# Fase 6: Blog público — listado, detalle y sanitización de render

## Contexto
Fase 5 completa: admin CMS del blog (crear/editar/publicar posts con TinyMCE + Cloudinary) funcionando y probado. Esta fase construye el lado público: las páginas que ve cualquier visitante de arturodev.info.

Contenido disponible por post: `title`, `slug`, `content` (HTML ya sanitizado en backend con nh3 al guardarse), `excerpt`, `cover_image_url`, `status`, `published_at`.

---

## 6.1 — Endpoint público de listado y detalle (verificar si ya existe)

Confirmar si el backend ya expone (mencionado en el output de Fase 5 que el endpoint público "solo expone posts publicados"):

- `GET /blog` → lista paginada de posts con `status: published`, ordenados por `published_at` desc. Devolver campos ligeros (title, slug, excerpt, cover_image_url, published_at) sin el `content` completo.
- `GET /blog/{slug}` → post individual publicado, con `content` completo. 404 si no existe o no está publicado.

Si falta paginación, agregarla (`page`, `page_size` como query params).

## 6.2 — Página de listado `/blog` (frontend)

- Grid o lista de cards: cover image, título, excerpt, fecha.
- Paginación (o "cargar más").
- Estado vacío si no hay posts publicados aún.
- Loading state / skeleton mientras carga.

## 6.3 — Página de detalle `/blog/[slug]`

- Renderizar `content` (HTML) **sanitizándolo en el cliente con DOMPurify antes de inyectarlo** — esto es la pieza pendiente marcada en la Fase 5. Aunque el backend ya sanitiza al guardar, esta es la segunda capa de defensa: protege si cambia la política de sanitización del backend, si el dato llega por otra vía, o si hay un bug en la sanitización server-side.
  - Instalar `dompurify` (+ `@types/dompurify` si aplica) o `isomorphic-dompurify` si se renderiza server-side (Next.js App Router con RSC).
  - Sanitizar antes de usar `dangerouslySetInnerHTML`.
- Metadata dinámica: `<title>`, meta description desde `excerpt`, Open Graph (`og:title`, `og:description`, `og:image` con `cover_image_url`) usando el sistema de metadata de Next.js App Router (`generateMetadata`).
- 404 si el slug no existe o el post no está publicado.

## 6.4 — Sitemap

- Agregar las rutas `/blog` y `/blog/[slug]` de posts publicados al sitemap dinámico (si ya existe un `sitemap.xml` del sitio, extenderlo; si no, crear uno con `app/sitemap.ts`).

## 6.5 — Verificación final de la fase

- [ ] `/blog` lista solo posts publicados, paginado, con loading/empty states
- [ ] `/blog/[slug]` renderiza el contenido sanitizado con DOMPurify en el cliente (segunda capa, no reemplaza la sanitización del backend)
- [ ] 404 correcto para slugs inexistentes o posts en borrador
- [ ] Metadata dinámica (title, description, OG image) funcionando por post — verificar con el debugger de OG de alguna red social o `curl` a la meta tags
- [ ] Posts publicados aparecen en el sitemap
- [ ] Probado localmente con Docker antes de cerrar la fase

No pushear a producción. Antes de deployar esta fase (o la 5), recordar verificar que el script de copia de assets de TinyMCE corre en GitHub Actions y no solo en build local — queda pendiente confirmarlo cuando se arme el pipeline de CI/CD para este blog.
