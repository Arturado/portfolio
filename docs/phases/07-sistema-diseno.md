# Fase 7 — Sistema de diseño (tokens + componentes base)

Objetivo: establecer la identidad visual en Tailwind config + un set de
componentes base reutilizables, verificable en una página de muestra
antes de construir las páginas públicas reales (Fase 8).

No se toca contenido real todavía. Referencia completa del concepto y
la paleta en docs/decisions/0004-diseno-visual-y-multilenguaje.md y
docs/architecture.md (sección "Sistema de diseño").

## Tailwind config
- Extender theme con los tokens de color exactos (ver architecture.md):
  ink, paper, blueprint (line), signal, status
- Tipografía: importar y configurar la serif de titulares + IBM Plex
  Sans (Google Fonts, self-hosted si es posible por performance) +
  una monospace (ej. JetBrains Mono) para datos
- Type scale: definir escala clara (ej. text-display, text-h1...h3,
  text-body, text-mono-sm) con weights/spacing intencionales, no los
  tamaños default de Tailwind sin criterio

## Componentes base (con Storybook-like página de muestra, no Storybook
formal — una ruta /admin/design-preview o similar, protegida o solo en
dev, para revisar visualmente)
- Button (variantes: primary usando Signal, secondary, ghost)
- Card / proyecto-card con la anotación tipo leader-line al hover
  (revela stack tags en monospace al hacer hover, con una línea que
  conecta visualmente al tag — no un simple shadow-lift)
- Badge/Tag (para stack tags, en monospace)
- Section (wrapper con la lógica de grid/alineación del concepto)
- StatusIndicator: componente que hace fetch real a GET /health del
  backend (usa INTERNAL_API_URL o NEXT_PUBLIC_API_URL según contexto
  server/client) y muestra "online"/"offline" con el color de status
  correspondiente — este es el componente que va en el hero

## Motion
- Respetar prefers-reduced-motion en cualquier animación
- Una utilidad/hook para la secuencia de entrada orquestada del hero
  (se usa en Fase 8, pero la utilidad se construye acá)

## Página de muestra
- Ruta temporal (ej. /design-preview, sin linkear desde ningún lado
  público) que muestre todos los componentes base con datos de ejemplo,
  para que Hanowar la revise visualmente antes de Fase 8

## Criterio de aceptación
- Tailwind config con los tokens aplicados, verificable en /design-preview
- Todos los componentes base renderizan correctamente con los tokens
- StatusIndicator hace el fetch real y refleja el estado real del
  backend (probar apagando el backend y viendo que cambia a "offline")
- Responsive (mobile-first) en la página de muestra
- Focus visible en elementos interactivos (accesibilidad)
- Reduced motion respetado (probar con la preferencia del SO activada)
- Screenshot del resultado incluido en el reporte de cierre de fase,
  para revisión visual antes de aprobar

## No hacer en esta fase
- No construir las páginas públicas reales (Home, About, Services,
  Contacto) — eso es Fase 8, que reusa estos componentes
- No tocar el admin existente ni el blog público ya construido
