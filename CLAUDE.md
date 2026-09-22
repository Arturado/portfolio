# arturodev.info — Portfolio autoadministrable

Portfolio personal de Hanowar (dev full-stack) con panel admin custom.
Single-admin (no multi-usuario). Deploy en VPS propio vía Docker Compose.

## Stack
- Backend: FastAPI + PostgreSQL (Alembic para migraciones), JWT auth
- Frontend: Next.js (sitio público + /admin protegido en la misma app)
- Imágenes: Cloudinary
- Email: Resend (formulario de contacto)
- Deploy: Docker Compose en VPS (nginx ya configurado, SSL vía certbot/Cloudflare)

## Dónde buscar qué (usa grep, no leas todo)
- Modelo de datos y decisiones de arquitectura → docs/architecture.md
- Decisiones puntuales (por qué elegimos X) → docs/decisions/*.md
- Plan de trabajo por fase → docs/phases/NN-nombre.md (trabaja UNA fase a la vez)
- Infra del VPS (nginx, dominios, certs) → ya está lista, no tocar salvo que se pida explícito

## Convenciones
- Tests antes de dar por completa una fase
- Commits pequeños, un scope por commit
- No asumas GitHub Actions existente — se arma en fase de deploy
