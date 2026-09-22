# 0002 — Blog a escala (SEO) cambia paginación y ruteo

Contexto: ~5 posts/semana planeados (~260/año) para posicionamiento SEO,
~20 proyectos fijos.

Decisiones:
- BlogPost lleva paginación desde el día 1 (público y admin). Project,
  Testimonial, Service no la necesitan por volumen bajo y fijo.
- Rutas públicas usan slug, no id numérico — el id sigue siendo la PK
  interna para operaciones de admin, pero SEO real depende de que la
  URL visible sea la amigable, no un wrapper sobre un id.
- Pendiente para fase de sitio público (Fase 5): sitemap.xml dinámico,
  meta tags por post (usar excerpt), posiblemente RSS. No se implementa
  en Fase 3, solo queda registrado aquí para no perderlo.
