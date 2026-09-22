from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_admin
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageOut
from app.schemas.pagination import Page, paginate

router = APIRouter(prefix="/admin/contact-messages", tags=["contact-messages"])


def _get_or_404(db: Session, message_id: int) -> ContactMessage:
    message = db.get(ContactMessage, message_id)
    if message is None:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")
    return message


@router.get("", response_model=Page[ContactMessageOut])
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


@router.patch("/{message_id}", response_model=ContactMessageOut)
def mark_contact_message_read(
    message_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    message = _get_or_404(db, message_id)
    message.read = True
    db.commit()
    db.refresh(message)
    return message


@router.delete("/{message_id}", status_code=204)
def delete_contact_message(
    message_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    message = _get_or_404(db, message_id)
    db.delete(message)
    db.commit()
