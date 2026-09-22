# 0003 — Editor de blog tipo WordPress + partición de fases

Contexto: se pidió un editor de blog similar al Classic Editor de WordPress
(TinyMCE), con carga de imágenes inline a Cloudinary.

Decisiones:
- BlogPost.content pasa de Markdown a HTML (generado por TinyMCE),
  sanitizado en el backend antes de guardar (allow-list de tags).
- Uploads de imágenes (blog inline, Project, Testimonial, Profile) pasan
  SIEMPRE por un endpoint propio protegido (POST /admin/uploads) que sube
  a Cloudinary desde el backend — el navegador nunca ve el API secret.
- Fase 4 (admin UI) se partió en dos por tamaño:
  - Fase 4: shell del admin + CRUD simple (Projects, Testimonials,
    Services, Profile, ContactMessages) + upload de imágenes simple
  - Fase 5: pantallas de Blog + editor TinyMCE + upload inline en contenido
- Renumeración de fases siguientes: sitio público (antes 5) → ahora 6,
  formulario de contacto (antes 6) → ahora 7, deploy (antes 7) → ahora 8
