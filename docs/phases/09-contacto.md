# Fase 9 — Formulario de contacto público

Objetivo: página /contacto funcional con reCAPTCHA v3 (invisible),
guardado en ContactMessage (ya existe desde Fase 3), notificación por
email al admin y auto-respuesta de confirmación al remitente, vía Resend.

## Backend

### Nuevo endpoint público
- POST /contact (público, SIN auth — es el único endpoint de escritura
  público de todo el proyecto, requiere cuidado extra)
  - Body: name, email, message
  - Requiere un token de reCAPTCHA v3 en el body, verificarlo server-side
    contra la API de Google (RECAPTCHA_SECRET_KEY) antes de aceptar
  - Rechazar si el score de reCAPTCHA es bajo (definir umbral, sugerido
    0.5 como punto de partida — documentar que es ajustable)
  - Honeypot adicional: un campo oculto (ej. "website") que un humano
    nunca llena pero un bot sí — si viene con valor, responder 200 falso
    positivo (no revelar al bot que fue detectado) pero NO guardar ni
    enviar emails
  - Rate limiting básico por IP (ej. máximo 3 envíos cada 10 minutos) —
    usar algo simple en memoria o Redis si ya hay, no sobre-ingenieriar
  - Sanitizar inputs (mismo criterio que el blog: nh3 o similar en el
    campo message por si se pega HTML)
  - Si todo pasa: guardar ContactMessage (read=false) y disparar los
    dos emails vía Resend:
    1. Notificación a CONTACT_EMAIL con los datos del mensaje
    2. Auto-respuesta al remitente confirmando que se recibió (copy
       breve, en la voz del sitio — "Recibimos tu mensaje, te
       respondemos pronto", nada de firma robótica)
  - Manejar fallos de Resend sin romper la respuesta al usuario: si el
    guardado en DB fue exitoso pero el email falla, el usuario igual
    debe ver éxito (el mensaje ya está en el admin), loguear el error
    de email para revisión manual

### Variables de entorno (ya existían en .env.example desde Fase 1,
verificar que sigan ahí: RESEND_API_KEY, CONTACT_EMAIL,
RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY)

## Frontend

### Página /contacto
- Form: nombre, email, mensaje (usa los componentes de Fase 7 —
  inputs con el mismo sistema de diseño, no defaults del navegador)
- Campo honeypot oculto (CSS, no display:none literal que los bots ya
  detectan — usar posición off-screen o similar)
- Integración de reCAPTCHA v3: se ejecuta invisible al enviar, no hay
  checkbox ni widget visible (mostrar el badge de Google requerido por
  sus términos, usualmente fixed bottom-right, o esconderlo con CSS y
  poner el texto de atribución requerido en el footer del form — Google
  permite ambas opciones)
- Estados: loading al enviar, éxito (mensaje claro, no solo un toast
  que desaparece), error (mensaje claro si falla validación o rate
  limit, no un error técnico crudo)
- Validación en cliente antes de enviar (campos requeridos, formato
  de email) — no reemplaza la validación server-side, es solo UX

## Criterio de aceptación
- Envío real de principio a fin: formulario → guardado en DB → visible
  en /admin/mensajes → llega el email de notificación → llega la
  auto-respuesta al remitente (probar con un email real tuyo)
- reCAPTCHA v3 rechaza un intento simulando score bajo (o al menos
  confirmar que la verificación server-side realmente llama a la API
  de Google y no es un stub)
- Honeypot: enviar el campo oculto con valor (simulando un bot) →
  responde 200 pero NO se guarda ni se envía email
- Rate limiting: 4to intento en la ventana de tiempo es rechazado
- Mensaje con HTML/script inyectado en el campo message → se sanitiza
  igual que el blog
- Responsive, con el sistema de diseño de Fase 7 (no inputs default)
- Link de Contacto en nav (que apuntaba a un placeholder desde Fase 8)
  ahora funciona de verdad
- Screenshot de la página en el reporte de cierre

## No hacer en esta fase
- No tocar deploy/infra (Fase 10)
- No agregar más canales de contacto (WhatsApp, etc.) salvo que se
  pida explícitamente — mantener el alcance a email
