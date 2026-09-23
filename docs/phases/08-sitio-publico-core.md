# Fase 8 — Home, Proyectos, Sobre mí, Servicios

Objetivo: construir las páginas públicas principales reusando los
componentes de Fase 7 (Button, Card/ProjectCard, Badge, Section,
StatusIndicator, motion hooks). Primera vez que existe header/footer
compartido para todo el sitio público (Blog ya existe pero corrió
sin layout compartido — esta fase lo agrega y el Blog lo hereda).

## Layout compartido (app/(public)/layout.tsx o equivalente)
- Header: logo/nombre (Hanowar / arturodev.info), nav (preguntar a Hanowar qué redes sociales incluir en el footer antes de construirlo — no asumir LinkedIn/GitHub por default)
- nav (Home, Proyectos,
  Servicios, Sobre mí, Blog, Contacto — este último placeholder hasta
  Fase 9), responsive (menú mobile)
- Footer: copyright, links a redes si aplica (dejar slots, confirmar
  con Hanowar qué redes poner o dejar solo email de contacto),
  StatusIndicator pequeño (footer es buen lugar para el "backend: online"
  de forma discreta, no solo en el hero)
- El Blog público (Fase 6) se envuelve en este layout también —
  verificar que no rompa nada de lo ya construido (paginación, sitemap)

## Home (/)
- Hero: titular fuerte + StatusIndicator (orquestación de Fase 7) +
  CTA principal (a Contacto o Proyectos, a definir con copy)
- Proyectos destacados: los que tengan featured=true (GET /projects,
  filtrar en frontend o pedir que el backend soporte ?featured=true —
  decidir cuál; preferible agregar el filtro al backend si no existe,
  es más correcto que filtrar client-side)
- Testimonios: sección con los Testimonial existentes (GET /testimonials)
- Servicios: resumen breve (título + 1 línea) con link a /servicios,
  no el detalle completo
- CTA de cierre hacia Contacto

## Proyectos (/proyectos)
- Listado completo (GET /projects, respeta order), sin paginación
  (ya定 en Fase 3 que no la necesitan por volumen)
- Cada proyecto: card con imagen, título, descripción corta, stack
  tags, links a repo/demo si existen
- Considerar filtro simple por tecnología en el frontend (client-side,
  no requiere endpoint nuevo) ya que confirmaste que stack es simple
  array — filtrar en el cliente sobre los datos ya cargados es
  suficiente para ~20 items

## Sobre mí (/sobre-mi)
- Consume GET /profile (bio, experience[], skills[])
- Bio destacada
- Experience: timeline o lista (aquí SÍ tiene sentido un tratamiento
  de secuencia/timeline, ya que experience es genuinamente cronológico)
- Skills: badges/tags (reusa el componente Badge)
- CV: botón de descarga del PDF (cv_pdf_url)

## Servicios (/servicios)
- GET /services (respeta order)
- Cada servicio con su descripción completa
- CTA hacia Contacto en cada uno o al final de la página

## Backend (si aplica)
- Evaluar si GET /projects necesita ?featured=true como query param
  opcional (recomendado, más correcto que filtrar en cliente) — si se
  agrega, actualizar tests

## Metadata / SEO
- generateMetadata en cada página (title, description) — mismo patrón
  que ya se usó en Blog (Fase 6)
- Agregar estas rutas nuevas al sitemap.ts existente

## Criterio de aceptación
- Las 4 páginas + header/footer funcionan y se ven con el sistema de
  diseño de Fase 7 (no placeholders, no Tailwind default)
- Blog sigue funcionando igual, ahora dentro del layout compartido
- Responsive mobile en las 4 páginas + nav
- Datos reales: cargar tus ~20 proyectos reales (o al menos varios de
  prueba representativos) y confirmar que se ven bien con contenido
  real, no solo 2-3 items de mock
- Metadata y sitemap actualizados
- Screenshot de cada página en el reporte de cierre, antes de pedir
  aprobación para commitear

## No hacer en esta fase
- No tocar el formulario de contacto (Fase 9) — el link/botón de
  Contacto en nav y CTAs puede apuntar a /contacto aunque la página
  no exista todavía (o a un anchor/placeholder simple)
- No tocar deploy ni infra (Fase 10)
