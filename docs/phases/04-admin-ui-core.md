# Fase 4 — Admin UI (shell + CRUD simple) + uploads a Cloudinary

Objetivo: panel admin navegable con CRUD funcional para Projects,
Testimonials, Services, Profile y gestión de ContactMessages. Sin editor
rico de blog todavía (eso es Fase 5).

## Backend — endpoint de uploads
- POST /admin/uploads (protegido, get_current_admin)
  - Recibe multipart/form-data (un archivo imagen)
  - Valida tipo (jpg/png/webp) y tamaño máximo (ej. 5MB)
  - Sube a Cloudinary usando el SDK server-side (CLOUDINARY_* del .env,
    nunca expuestos al frontend)
  - Devuelve {url: "https://res.cloudinary.com/..."\}
- Este endpoint es genérico, lo reusa cualquier entidad que necesite
  imagen (Project.image_urls, Testimonial.photo_url, Profile.cv_pdf_url
  si aplica, y el inline de blog en Fase 5)

## Frontend — shell del admin
- /admin (dashboard): resumen simple — cantidad de proyectos, posts
  publicados, mensajes sin leer
- Layout compartido /admin/* con nav lateral: Proyectos, Testimonios,
  Servicios, Perfil, Mensajes, (Blog queda placeholder "próximamente")
- Logout visible en el layout

## Pantallas CRUD (Projects, Testimonials, Services)
Para cada una: listado + crear/editar en el mismo form (modal o página)
- Listado: tabla con columnas relevantes, botones subir/bajar (order),
  editar, borrar (con confirmación)
- Form: campos de la entidad + componente de upload de imagen que:
  1. sube el archivo a POST /admin/uploads
  2. guarda la URL devuelta en el campo correspondiente
  3. muestra preview de la imagen ya cargada
- Validación de formulario en cliente (campos requeridos) +
  manejo de errores del backend (slug duplicado, etc.)

## Pantalla Profile (singleton, sin listado)
- Un solo form: bio, experience (lista simple de {title, company,
  period, description} — agregar/quitar filas), skills (lista de
  strings, agregar/quitar), cv_pdf_url (upload de PDF, no imagen —
  reusar o extender el endpoint de uploads para aceptar PDF también)

## Pantalla ContactMessages
- Listado (paginado, reusa la paginación del backend), marcar
  leído/no leído, borrar
- Mensajes no leídos destacados visualmente

## Criterio de aceptación
- CRUD completo funcional para Projects, Testimonials, Services desde
  el navegador (no solo por API) — crear, editar, reordenar, borrar
- Upload de imagen funciona end-to-end: seleccionar archivo → sube a
  Cloudinary → URL se guarda en el registro → se ve el preview
- Profile: guardar y recargar refleja los cambios
- ContactMessages: listar, marcar leído, borrar funcionan
- Endpoint /admin/uploads rechaza archivos que no sean imagen (o PDF
  para el caso de CV) y archivos que excedan el tamaño máximo
- Todo probado en navegador real contra Docker, no solo curl

## No hacer en esta fase
- No tocar BlogPost (modelo/endpoints ya existen de Fase 3, pero su
  pantalla admin y el editor TinyMCE son Fase 5)
- No tocar el sitio público (Fase 6) ni el formulario de contacto
  público (Fase 7)
