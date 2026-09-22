import jwt
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import decode_access_token
from app.models.admin_user import AdminUser

COOKIE_NAME = "session"


def get_current_admin(request: Request, db: Session = Depends(get_db)) -> AdminUser:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="No autenticado"
    )

    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise unauthorized

    try:
        payload = decode_access_token(token)
    except jwt.PyJWTError:
        raise unauthorized

    admin_id = payload.get("sub")
    admin = db.get(AdminUser, int(admin_id)) if admin_id is not None else None
    if admin is None:
        raise unauthorized

    return admin
