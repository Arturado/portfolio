import logging
from html import escape

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

RESEND_API_URL = "https://api.resend.com/emails"


async def _send_email(to: str, subject: str, html: str, reply_to: str | None = None) -> bool:
    payload = {
        "from": f"arturodev.info <{settings.contact_email}>",
        "to": [to],
        "subject": subject,
        "html": html,
    }
    if reply_to:
        payload["reply_to"] = reply_to

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                RESEND_API_URL,
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json=payload,
            )
            response.raise_for_status()
        return True
    except httpx.HTTPError:
        logger.exception("Fallo al enviar email via Resend (to=%s)", to)
        return False


async def send_contact_notification(name: str, email: str, message: str) -> bool:
    html = (
        f"<p><strong>Nombre:</strong> {escape(name)}</p>"
        f"<p><strong>Email:</strong> {escape(email)}</p>"
        f"<p><strong>Mensaje:</strong></p>"
        f"<p>{escape(message).replace(chr(10), '<br>')}</p>"
    )
    return await _send_email(
        to=settings.contact_email,
        subject=f"Nuevo mensaje de contacto de {name}",
        html=html,
        reply_to=email,
    )


async def send_contact_autoreply(name: str, email: str) -> bool:
    html = (
        f"<p>Hola {escape(name)},</p>"
        f"<p>Recibimos tu mensaje, te respondemos pronto.</p>"
    )
    return await _send_email(
        to=email,
        subject="Recibimos tu mensaje — arturodev.info",
        html=html,
    )
