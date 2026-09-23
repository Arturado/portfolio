import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_admin
from app.core.email import send_contact_autoreply, send_contact_notification
from app.core.html_sanitize import strip_html
from app.core.rate_limit import is_rate_limited
from app.core.recaptcha import verify_recaptcha
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate, ContactMessageOut
from app.schemas.pagination import Page, paginate

logger = logging.getLogger(__name__)

router = APIRouter(tags=["contact-messages"])


def _get_or_404(db: Session, message_id: int) -> ContactMessage:
    message = db.get(ContactMessage, message_id)
    if message is None:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")
    return message


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("/contact")
async def submit_contact_message(
    payload: ContactMessageCreate, request: Request, db: Session = Depends(get_db)
):
    client_ip = _client_ip(request)

    if is_rate_limited(client_ip):
        raise HTTPException(
            status_code=429, detail="Demasiados intentos. Probá de nuevo más tarde."
        )

    if payload.website:
        # Honeypot con valor => bot. Respondemos 200 sin revelar la deteccion,
        # pero no guardamos ni enviamos nada.
        return {"success": True}

    if not await verify_recaptcha(payload.recaptcha_token, client_ip):
        raise HTTPException(status_code=400, detail="Verificación de seguridad fallida")

    message_text = strip_html(payload.message)

    contact_message = ContactMessage(name=payload.name, email=payload.email, message=message_text)
    db.add(contact_message)
    db.commit()
    db.refresh(contact_message)

    try:
        await send_contact_notification(payload.name, payload.email, message_text)
        await send_contact_autoreply(payload.name, payload.email)
    except Exception:
        logger.exception(
            "Fallo enviando emails de contacto para mensaje id=%s", contact_message.id
        )

    return {"success": True}


@router.get("/admin/contact-messages", response_model=Page[ContactMessageOut])
def list_contact_messages(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    query = db.query(ContactMessage)
    total = query.count()
    offset, pages = paginate(total, page, limit)
    items = (
        query.order_by(ContactMessage.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return Page(items=items, total=total, page=page, pages=pages)


@router.patch("/admin/contact-messages/{message_id}", response_model=ContactMessageOut)
def mark_contact_message_read(
    message_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    message = _get_or_404(db, message_id)
    message.read = True
    db.commit()
    db.refresh(message)
    return message


@router.delete("/admin/contact-messages/{message_id}", status_code=204)
def delete_contact_message(
    message_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    message = _get_or_404(db, message_id)
    db.delete(message)
    db.commit()
