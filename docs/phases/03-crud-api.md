# Fase 3 — Modelos + CRUD API

Objetivo: modelos SQLAlchemy + migraciones + endpoints CRUD para las
entidades de negocio, todas protegidas con get_current_admin (Fase 2)
en las operaciones de escritura. Lectura pública solo donde se indique.

## Modelos

### Project
- id, title, slug (unique, indexed), description, stack: list[str],
  image_urls: list[str], repo_url, demo_url, featured: bool, order: int,
  created_at, updated_at

### BlogPost
- id, title, slug (unique, indexed), content (text, markdown),
  excerpt (opcional, para listados/SEO meta description),
  tags: list[str], published: bool, published_at (nullable),
  created_at, updated_at

### Testimonial
- id, name, company, text, photo_url, order: int, created_at

### Service
- id, title, description, order: int, created_at

### Profile (singleton — una sola fila, id fijo)
- id, bio, experience: JSON, skills: list[str], cv_pdf_url

### ContactMessage
- id, name, email, message, created_at, read: bool
(modelo + endpoints de gestión para el admin; el formulario público que
lo alimenta se conecta en Fase 6)

## Endpoints

### Project (público sin paginación, ~20 registros fijos)
- GET /projects — público, respeta order
- GET /projects/{slug} — público
- POST /projects — protegido
- PUT /projects/{slug} — protegido
- DELETE /projects/{slug} — protegido
- GET /admin/projects — protegido, devuelve todo (incluye no-featured)

### BlogPost (público CON paginación — crece ~5/semana)
- GET /blog?page=1&limit=20 — público, solo published=true, ordenado por
  published_at desc, respuesta incluye {items, total, page, pages}
- GET /blog/{slug} — público, solo published=true (404 si es draft)
- POST /blog — protegido
- PUT /blog/{slug} — protegido
- DELETE /blog/{slug} — protegido
- GET /admin/blog?page=1&limit=20 — protegido, TODO incluidos drafts

### Testimonial, Service (público sin paginación)
- GET /{entity} — público, respeta order
- POST /{entity}, PUT /{entity}/{id}, DELETE /{entity}/{id} — protegido
  (estos dos no llevan slug, se manejan por id, no son contenido
  indexable individualmente)
- GET /admin/{entity} — protegido

### Profile (singleton, sin colección)
- GET /profile — público
- PUT /profile — protegido (crea la fila si no existe, o actualiza)

### ContactMessage (solo admin)
- GET /admin/contact-messages?page=1&limit=20 — protegido
- PATCH /admin/contact-messages/{id} — protegido (marcar read=true)
- DELETE /admin/contact-messages/{id} — protegido

## Migraciones
- Una migración Alembic por entidad, aplicar y verificar con
  `alembic upgrade head` contra Postgres real
- Índice único en slug para Project y BlogPost (no solo unique a nivel
  de constraint, sino índice para que la búsqueda por slug sea rápida)

## Validación
- Pydantic schemas separados: *Create, *Update (campos opcionales),
  *Public (respuesta), *Admin (respuesta completa si difiere)
- slug: autogenerado desde title si no se provee (slugify), validar
  unicidad, regenerar con sufijo si hay colisión (ej. -2)
- BlogPost.excerpt: si no se provee, autogenerar de los primeros ~160
  caracteres del content (útil para SEO meta description más adelante)

## Criterio de aceptación
- Migraciones corren limpias desde cero
- Tests por entidad: crear, leer (público y admin), actualizar, borrar,
  no-admin recibe 401/403 en endpoints protegidos
- GET público de BlogPost NO devuelve published=false
- GET /blog paginado: probar con >20 posts sembrados que la paginación
  funciona (page 2 trae los siguientes, total es correcto)
- Slug duplicado al crear → se resuelve con sufijo automático, no error
- GET /projects/{slug} y /blog/{slug} con slug inexistente → 404
- Profile: GET antes de que exista ninguna fila no debe crashear
- Todo probado con Docker real, no solo tests unitarios

## No hacer en esta fase
- No construir el admin UI — eso es Fase 4
- No tocar el formulario público de contacto — eso es Fase 6
- No subir imágenes a Cloudinary todavía — campos de imagen como string
  simple por ahora, integración real en Fase 4
- No implementar sitemap.xml ni meta tags dinámicos — eso corresponde a
  Fase 5 (sitio público), pero quedó anotado en docs/decisions para no
  perderlo de vista dado el volumen de blog
