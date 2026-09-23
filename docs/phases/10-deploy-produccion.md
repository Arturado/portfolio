# Fase 10 — Deploy a producción (GitHub Actions + VPS)

Objetivo: pipeline de deploy automático (push a main → build + deploy en
el VPS), con secrets de producción propios (nunca los de dev/local),
DB limpia, y verificación de salud post-deploy antes de dar la fase
por cerrada.

## Contexto de infra ya existente (no tocar, solo usar)
- VPS: ssh ninchcompany, proyecto en /var/www/arturodev (repo git ya
  clonado ahí, actualmente solo con lo del scaffold inicial — hace
  falta git pull del estado real)
- Nginx + SSL ya configurados y probados para arturodev.info, www,
  api.arturodev.info (Fase de infra inicial, antes de Fase 1 de código)
- Docker instalado en el VPS
- docker-compose.yml del proyecto ya expone backend:4000 y frontend:3000
  al host (coincide con lo que nginx espera), postgres NO expuesto

## 1. Secrets de producción (Hanowar los genera y carga a mano en el VPS,
NUNCA en el repo ni pegados a Claude Code)
En el VPS, crear /var/www/arturodev/.env con valores DE PRODUCCIÓN,
distintos a los de desarrollo local:
- JWT_SECRET: nuevo, generado con `openssl rand -hex 32`
- POSTGRES_PASSWORD: nuevo, generado igual
- ADMIN_EMAIL / ADMIN_PASSWORD: credenciales reales de admin para
  producción (no las de prueba local)
- COOKIE_DOMAIN=.arturodev.info
- ALLOWED_ORIGIN=https://arturodev.info
- NEXT_PUBLIC_API_URL=https://api.arturodev.info
- NEXT_PUBLIC_SITE_URL=https://arturodev.info
- INTERNAL_API_URL=http://backend:4000 (igual que local, es interno
  a la red de Docker)
- RECAPTCHA_SITE_KEY / RECAPTCHA_SECRET_KEY / NEXT_PUBLIC_RECAPTCHA_SITE_KEY:
  las mismas que ya tienes (arturodev.info ya está en la lista de
  dominios permitidos en Google)
- CLOUDINARY_*: las mismas credenciales (incluye ambos entornos)
- RESEND_API_KEY / CONTACT_EMAIL: las mismas
- DATABASE_URL construida con el nuevo POSTGRES_PASSWORD

## 2. SSH key dedicada para el deploy (no la personal de Hanowar)
- Generar un par de llaves nuevo SOLO para GitHub Actions:
  `ssh-keygen -t ed25519 -f deploy_key -N ""`
- Agregar la pública a ~/.ssh/authorized_keys del VPS
- La privada va como secret en GitHub (Settings → Secrets → Actions):
  VPS_SSH_KEY, además de VPS_HOST y VPS_USER

## 3. GitHub Actions workflow (.github/workflows/deploy.yml)
Trigger: push a main.
Pasos (vía SSH al VPS, ej. con appleboy/ssh-action):
1. cd /var/www/arturodev && git pull origin main
2. docker compose up -d --build (reconstruye solo lo que cambió)
3. docker compose exec -T backend alembic upgrade head
4. docker compose exec -T backend python -m app.scripts.seed_admin
   (idempotente, seguro correr en cada deploy)
5. Health check: curl a https://api.arturodev.info/health y a
   https://arturodev.info — si cualquiera falla, el job de GitHub
   Actions debe fallar visiblemente (no dejar un deploy roto en
   silencio)

## 4. Primer deploy (bootstrap manual, antes de confiar en el workflow)
- Hanowar corre manualmente en el VPS: git pull, carga el .env de
  producción, docker compose up -d --build, alembic upgrade head,
  seed_admin — para confirmar que todo funciona ANTES de delegarlo
  al GitHub Action
- Recién después de ese primer deploy manual exitoso, se prueba el
  workflow automático con un push menor

## 5. Verificación TinyMCE en producción
Como el build ahora ocurre en el propio VPS vía el mismo Dockerfile
que se usa local (no un runner de CI distinto con caché propio de
node_modules), el riesgo que se había anotado en Fase 5/6 debería
quedar resuelto por diseño — pero VERIFICAR explícitamente en
producción: entrar a /admin/blog/nuevo en https://arturodev.info y
confirmar que el editor TinyMCE carga sus assets (sin errores 404 en
la consola del navegador para los archivos de /tinymce/).

## Criterio de aceptación
- https://arturodev.info y https://www.arturodev.info sirven el sitio
  real (no 502, no placeholder)
- https://api.arturodev.info/health responde 200
- https://montana.arturodev.info sigue funcionando (no se rompió nada
  de la infra compartida)
- Login de admin funciona en producción con las credenciales reales
  (no las de prueba)
- TinyMCE carga correctamente en /admin/blog/nuevo (ver punto 5)
- Formulario de contacto probado en producción de verdad (reCAPTCHA
  ya tiene arturodev.info registrado, así que debería funcionar sin
  el problema de localhost que tuvimos)
- Un push a main dispara el GitHub Action y el deploy se completa sin
  intervención manual (probado con un cambio menor real, no solo
  teorizado)
- Si el health check post-deploy falla intencionalmente (simular
  rompiendo algo momentáneamente), el job de GitHub Actions se marca
  como fallido — confirmar que el gate funciona, no solo que existe
- DB de producción arranca limpia (verificar que no se coló data de
  prueba/local)

## No hacer en esta fase
- No migrar datos de la DB local — Hanowar carga contenido real desde
  el admin en producción después
- No implementar rollback automático ni blue-green deploy — fuera de
  alcance para este proyecto (un solo admin, bajo tráfico)
- No tocar WAF de Cloudflare ni restricciones de IP al /admin — queda
  como mejora de seguridad a considerar en otra sesión, no bloquea el
  deploy
