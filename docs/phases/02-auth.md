# Fase 2 — Autenticación (single-admin, JWT en cookie httpOnly)

Objetivo: login funcional para un único usuario admin, con JWT en cookie
httpOnly y protección de rutas /admin/* en el frontend.

## Backend (FastAPI)
- Modelo AdminUser (id, email, hashed_password) — SOLO se crea vía seed
  script/comando, no hay endpoint de registro público
- Seed: script o comando CLI que lee ADMIN_EMAIL y ADMIN_PASSWORD desde
  variables de entorno y crea/actualiza el usuario admin (idempotente)
- Password hasheado con bcrypt (passlib)
- POST /auth/login: recibe email+password, valida, si es correcto
  responde Set-Cookie con el JWT:
  - httpOnly=true, secure=true, samesite=lax, domain=.arturodev.info
  - expiración del JWT: 24h
- POST /auth/logout: limpia la cookie (Set-Cookie con Max-Age=0)
- GET /auth/me: valida la cookie, devuelve datos del admin o 401
- Dependency reusable (get_current_admin) para proteger cualquier
  endpoint que se agregue en fases futuras (CRUD de Fase 3)
- CSRF: para cualquier endpoint POST/PUT/DELETE/PATCH, verificar que el
  header Origin (o Referer si Origin falta) coincida con el dominio
  esperado (config vía env var ALLOWED_ORIGIN); rechazar con 403 si no

## Frontend (Next.js)
- /admin/login: form simple email+password, llama a POST /auth/login
  (con credentials:'include' para que la cookie se guarde)
- middleware.ts: intercepta rutas /admin/* (excepto /admin/login),
  verifica el JWT de la cookie usando `jose` (verificación de firma,
  sin llamar al backend) — si no es válido, redirige a /admin/login
- Botón/acción de logout que llama a POST /auth/logout y redirige a
  /admin/login
- JWT_SECRET debe ser el mismo valor en backend y frontend (env var
  compartida) para que el middleware pueda verificar la firma

## Variables de entorno nuevas (agregar a .env.example)
- ADMIN_EMAIL
- ADMIN_PASSWORD  (solo se usa en el seed, no queda en runtime normal)
- JWT_SECRET
- ALLOWED_ORIGIN  (ej: https://arturodev.info)

## Criterio de aceptación
- Seed crea el admin correctamente (correr dos veces no duplica ni falla)
- Login con credenciales correctas → cookie seteada, /admin accesible
- Login con credenciales incorrectas → 401, sin cookie
- Acceder a /admin/* sin cookie válida → redirige a /admin/login
- GET /auth/me sin cookie → 401
- POST a un endpoint protegido sin header Origin correcto → 403 (CSRF check)
- Logout limpia la cookie y bloquea el acceso de nuevo
- Tests: al menos login exitoso, login fallido, acceso protegido sin
  sesión, y el chequeo de CSRF

## No hacer en esta fase
- No implementar refresh tokens (24h de expiración simple es suficiente
  para este caso de uso; si en el futuro molesta, se revisita)
- No tocar CRUD de negocio (Projects, BlogPosts, etc.) — eso es Fase 3
- No tocar infra del VPS ni deploy
