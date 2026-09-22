# Pendiente: sitemap.xml y meta tags dinámicos

No se implementa en Fase 3 (CRUD API) ni corresponde a Fase 3. Queda anotado
acá para no perderlo de vista en Fase 5 (sitio público), dado el volumen de
blog (~5 posts/semana):

- `sitemap.xml` dinámico que liste `/proyectos/{slug}` y `/blog/{slug}`
  (solo `published=true`), regenerado a partir de `GET /projects` y
  `GET /blog` (paginado — el sitemap tiene que recorrer todas las páginas,
  no solo la primera).
- Meta tags dinámicos por página (title, description) usando
  `BlogPost.excerpt` (ya autogenerado en Fase 3 si no se provee) como
  meta description, y `title`/`description` de `Project` para las páginas
  de proyecto.
