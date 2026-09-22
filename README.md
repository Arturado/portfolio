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

5. Crear/actualizar el usuario admin (usa `ADMIN_EMAIL` y `ADMIN_PASSWORD` del `.env`, idempotente):

   ```bash
   docker compose exec backend python -m app.scripts.seed_admin
   ```

6. Login:

   - UI: http://localhost:3000/admin/login
   - o vía curl:
     ```bash
     curl -c cookies.txt -X POST http://localhost:4000/auth/login \
       -H "Content-Type: application/json" -H "Origin: http://localhost:3000" \
       -d '{"email":"...","password":"..."}'
     ```

## Desarrollo

- Backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 4000`
- Frontend: `cd frontend && npm install && npm run dev`

## Tests

```bash
docker compose exec backend python -m pytest
```

## Migraciones

Toda modificación al esquema de base de datos se hace vía Alembic, nunca a mano.
El contenedor del backend no tiene bind mount, así que un archivo generado
adentro no existe en el host — hay que copiarlo:

```bash
docker compose exec backend alembic revision --autogenerate -m "descripción"
docker compose cp backend:/app/alembic/versions/<archivo_generado>.py backend/alembic/versions/
docker compose exec backend alembic upgrade head
```
