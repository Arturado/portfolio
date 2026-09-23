# 0004 — Dirección visual + multilenguaje pospuesto

Decisiones:
- No se implementa multilenguaje en este rebuild. En un futuro (fuera de
  alcance actual), si se agrega, sería solo ES/EN para páginas estáticas
  (Home, About, Services) — el Blog queda siempre single-language (ES).
- Dirección visual aprobada: concepto "blueprint técnico" — paleta ink/
  paper/blueprint-line/signal (ver docs/architecture.md), tipografía
  serif de carácter para titulares + IBM Plex Sans para cuerpo +
  monospace solo para datos reales (stack tags, status), interactividad
  con sustancia (ping real a /health como indicador de estado en el
  hero) en vez de animaciones decorativas genéricas.
- Se construye como fase separada (sistema de diseño + componentes base)
  antes de las páginas públicas reales, para poder revisar la dirección
  visual en una página de muestra antes de aplicarla a todo el sitio.
