# Fase 1 — Scaffolding

Objetivo: estructura base del proyecto corriendo local con Docker Compose,
sin lógica de negocio todavía — solo esqueleto + healthchecks.

## Estructura de carpetas
/backend
  /app
    /core       (config, security, db session)
    /models     (SQLAlchemy — vacío por ahora, se llena en Fase 3)
    /schemas    (Pydantic — vacío por ahora)
    /routers    (vacío por ahora)
    main.py     (FastAPI app, healthcheck GET /health)
  alembic/
  alembic.ini
  requirements.txt
  Dockerfile
/frontend
  (Next.js App Router, TypeScript, Tailwind)
  app/page.tsx  (placeholder "arturodev.info — en construcción")
  Dockerfile
docker-compose.yml
.env.example
.gitignore

## Requisitos
- Backend: FastAPI + SQLAlchemy + Alembic + psycopg2, Python 3.12
- Frontend: Next.js 15+ (App Router), TypeScript, Tailwind CSS
- docker-compose.yml: servicios postgres, backend (puerto 4000), frontend (puerto 3000)
  - Sin exponer el puerto de postgres al host (a diferencia del proyecto viejo)
- .env.example con todas las variables necesarias (DATABASE_URL, JWT_SECRET,
  CLOUDINARY_*, RESEND_API_KEY, CONTACT_EMAIL, RECAPTCHA_*) sin valores reales

## Criterio de aceptación
- `docker compose up -d` levanta los 3 servicios sin error
- `curl http://localhost:4000/health` responde 200
- `curl http://localhost:3000` responde 200 con el placeholder
- `alembic upgrade head` corre sin error (aunque no haya modelos aún)
- README.md con instrucciones de setup local

## No hacer en esta fase
- No implementar auth, modelos de negocio, ni CRUD — eso es Fase 2 y 3
- No tocar nada del VPS ni GitHub Actions — eso es Fase 7
