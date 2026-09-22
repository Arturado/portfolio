from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.db import get_db
from app.core.deps import COOKIE_NAME, get_current_admin
from app.core.security import create_access_token, verify_password
from app.models.admin_user import AdminUser
from app.schemas.auth import AdminOut, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])

COOKIE_MAX_AGE = settings.jwt_expire_minutes * 60


def _is_secure_cookie() -> bool:
    return settings.allowed_origin.startswith("https://")


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE,
        path="/",
        domain=settings.cookie_domain or None,
        httponly=True,
        secure=_is_secure_cookie(),
        samesite="lax",
    )


@router.post("/login")
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.email == payload.email).first()

    if admin is None or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales invalidas"
        )

    token = create_access_token(subject=str(admin.id))
    _set_session_cookie(response, token)
    return {"status": "ok"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        domain=settings.cookie_domain or None,
    )
    return {"status": "ok"}


@router.get("/me", response_model=AdminOut)
def me(admin: AdminUser = Depends(get_current_admin)):
    return admin
