import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

# Score minimo aceptado (0.0 = casi seguro bot, 1.0 = casi seguro humano).
# Punto de partida sugerido por Google; ajustable segun falsos positivos
# reales una vez el formulario este en produccion.
MIN_SCORE = 0.5


async def verify_recaptcha(token: str, remote_ip: str | None = None) -> bool:
    data = {"secret": settings.recaptcha_secret_key, "response": token}
    if remote_ip:
        data["remoteip"] = remote_ip

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(RECAPTCHA_VERIFY_URL, data=data)
            response.raise_for_status()
            result = response.json()
    except httpx.HTTPError:
        logger.exception("Fallo al verificar reCAPTCHA contra la API de Google")
        return False

    return bool(result.get("success")) and result.get("score", 0) >= MIN_SCORE
