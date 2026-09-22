# arturodev.info

Portfolio personal autoadministrable — sitio público + panel admin.

## Stack

- Backend: FastAPI + PostgreSQL (Alembic)
- Frontend: Next.js (App Router, TypeScript, Tailwind)
- Imágenes: Cloudinary
- Email: Resend

## Setup local

1. Copiar el archivo de variables de entorno y completar los valores:

   ```bash
   cp .env.example .env
   ```

2. Levantar los servicios:

   ```bash
   docker compose up -d
   ```

3. Verificar que todo responde:

   ```bash
   curl http://localhost:4000/health   # backend
   curl http://localhost:3000          # frontend
   ```

4. Correr las migraciones (dentro del contenedor del backend):

   ```bash
   docker compose exec backend alembic upgrade head
   ```

## Desarrollo

- Backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 4000`
- Frontend: `cd frontend && npm install && npm run dev`

## Migraciones

Toda modificación al esquema de base de datos se hace vía Alembic, nunca a mano:

```bash
docker compose exec backend alembic revision --autogenerate -m "descripción"
docker compose exec backend alembic upgrade head
```
