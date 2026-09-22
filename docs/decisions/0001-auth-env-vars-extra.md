# Variables de entorno extra para auth (más allá de las listadas en fase 2)

La fase 2 lista `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `ALLOWED_ORIGIN`.
Se agregaron además:

## COOKIE_DOMAIN

El doc de fase pide `domain=.arturodev.info` fijo en la cookie. Eso rompe el
login en local: un cookie con `Domain=arturodev.info` nunca se manda a
`localhost`, así que el criterio de aceptación ("login funcional local") no
se podría probar.

Se hizo configurable, default `""` (vacío → cookie host-only, sirve tal cual
para `localhost` sin importar el puerto, porque las cookies no distinguen
puerto). En producción se setea a `.arturodev.info` para que la cookie sea
válida tanto en `arturodev.info` (frontend, donde el middleware la lee) como
en `api.arturodev.info` (backend).

## NEXT_PUBLIC_API_URL

El login (`/admin/login`) y el logout corren en el browser y hacen
`fetch(..., {credentials:'include'})` directo al backend. Next.js necesita
saber la URL del backend en el bundle del cliente, y eso requiere una env
var `NEXT_PUBLIC_*` — se hornea en build time, por eso el Dockerfile del
frontend la recibe como build arg (`docker-compose.yml` → `build.args`).

## Cookie `secure`

No se agregó una env var nueva para esto: `secure` se deriva de
`ALLOWED_ORIGIN.startswith("https://")`. Evita otra variable y además es
consistente por construcción (si el frontend es https, el cookie exige
https).
