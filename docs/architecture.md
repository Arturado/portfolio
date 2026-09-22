# Arquitectura

## Modelo de datos
- Project: id, title, slug, description, stack[], image_urls[], links{repo,demo}, featured:bool, order
- BlogPost: id, title, slug, content(markdown), tags[], published:bool, published_at
- Testimonial: id, name, company, text, photo_url
- Service: id, title, description, order
- Profile: singleton — bio, experience[], skills[], cv_pdf_url
- ContactMessage: id, name, email, message, created_at, read:bool

## Auth
- Single admin user, seed vía env var (no endpoint de registro público)
- JWT, expiración corta + refresh, middleware Next.js valida en /admin/*

## Backend (api.arturodev.info)
- FastAPI, routers por entidad, Pydantic schemas separados de modelos ORM
- Alembic para todas las migraciones (nunca editar DB a mano)

## Frontend (arturodev.info)
- Next.js App Router
- Rutas públicas: /, /proyectos, /blog, /servicios, /cv, /contacto
- Rutas admin: /admin/login, /admin/(dashboard con CRUD por entidad)

## Infra (ya lista, referencia)
- VPS: /var/www/arturodev, nginx con SSL (arturodev.info, www, api.arturodev.info)
- Docker Compose: postgres + backend (:4000) + frontend (:3000)
