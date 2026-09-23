# Fase 5: Blog — Editor TinyMCE + Upload de imágenes inline a Cloudinary

## Contexto
Proyecto arturodev.info rebuild. Stack: FastAPI + PostgreSQL (backend), Next.js 16 App Router (frontend), JWT single-admin auth, Cloudinary para imágenes. Fases 1-4 (scaffolding, auth, CRUD API, admin UI core) ya completas.

Objetivo de esta fase: que el admin pueda crear/editar posts de blog con un editor WYSIWYG (TinyMCE self-hosted) que permita insertar imágenes inline, subidas directamente a Cloudinary vía el backend (nunca upload unsigned desde el cliente).

Trabajar en sub-fases, probando localmente con Docker antes de pasar a la siguiente. No avanzar sin verificar cada paso.

---

## 5.1 — Modelo de datos (si no existe ya un modelo Post completo)

Verificar si ya existe un modelo `Post` en el backend (de la Fase 3, CRUD API). Si no, crear:

- `id`, `title`, `slug` (unique, auto-generado desde title), `content` (Text, HTML del editor), `excerpt` (opcional), `cover_image_url` (opcional), `status` (enum: `draft` | `published`), `published_at` (nullable datetime), `created_at`, `updated_at`.

Migración con Alembic. Verificar: correr migración local, confirmar tabla creada con `\d posts` en psql.

## 5.2 — Endpoint de upload de imágenes (backend)

Crear `POST /api/admin/media/upload` (protegido con JWT del admin):

- Recibe `multipart/form-data` con el archivo de imagen.
- Validar tipo MIME (solo imágenes: jpeg, png, webp, gif) y tamaño máximo (ej. 5MB).
- Subir a Cloudinary usando el SDK oficial de Python (`cloudinary.uploader.upload`), con las credenciales ya configuradas en `.env`.
- Devolver `{ "url": "<secure_url de Cloudinary>" }`.
- Manejar errores de Cloudinary (timeout, cuota, formato inválido) con respuestas 4xx/5xx claras.

Verificar: probar el endpoint con `curl -F "file=@test.jpg"` o Postman, confirmar que la imagen aparece en el dashboard de Cloudinary y la URL devuelta carga correctamente.

## 5.3 — Instalar TinyMCE self-hosted (frontend)

```bash
npm install tinymce @tinymce/tinymce-react
```

Configurar TinyMCE self-hosted (copiar assets a `/public/tinymce` o usar el import directo del paquete, sin `api-key` de tinymce cloud). Confirmar que el editor carga sin warnings de licencia/API key en consola.

## 5.4 — Componente Editor con upload inline

Crear componente `<BlogEditor />` que envuelva TinyMCE con:

- `images_upload_handler` custom: al insertar/pegar/arrastrar una imagen, la sube a `/api/admin/media/upload` (con el JWT en el header), y usa la URL devuelta para insertarla en el contenido.
- Manejo de estado de carga (mostrar progreso o placeholder mientras sube).
- Manejo de error (si falla el upload, no insertar imagen rota y notificar al usuario).
- Toolbar razonable para blog: headings, bold/italic, listas, links, blockquote, imagen, código inline, undo/redo.

Verificar: insertar una imagen desde el editor, confirmar que aparece en Cloudinary y se renderiza en el editor sin recargar la página.

## 5.5 — Integración en la UI admin

- Formulario de crear/editar post en `/admin/blog/nuevo` y `/admin/blog/[id]/editar`, usando `<BlogEditor />` para el campo `content`.
- Campo separado para `cover_image_url` (puede reusar el mismo endpoint de upload, sin pasar por TinyMCE).
- Guardar como borrador (`status: draft`) o publicar (`status: published`, seteando `published_at`).
- Listado de posts en `/admin/blog` con estado (borrador/publicado), fecha, y acciones editar/eliminar.

Verificar: crear un post completo end-to-end (título, contenido con imagen inline, cover image, publicar), confirmar que persiste correctamente en la BD y que el contenido HTML se sanitiza antes de renderizarse en el sitio público (evitar XSS — usar una librería de sanitización como `DOMPurify` en el frontend público al renderizar).

## 5.6 — Verificación final de la fase

- [ ] Migración de `posts` aplicada y probada
- [ ] Endpoint de upload protegido por JWT, valida tipo/tamaño, sube a Cloudinary
- [ ] Editor TinyMCE self-hosted sin dependencia de API key externa
- [ ] Upload inline de imágenes funcional con manejo de error
- [ ] CRUD de posts completo desde el admin (crear, editar, borrador/publicar, eliminar)
- [ ] Contenido HTML sanitizado al renderizarse en el sitio público
- [ ] Todo probado localmente con `docker compose` antes de considerar la fase cerrada

No pushear a producción hasta confirmar con Hanowar.
