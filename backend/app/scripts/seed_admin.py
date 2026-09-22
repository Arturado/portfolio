from app.core.config import settings
from app.core.db import SessionLocal
from app.core.security import hash_password
from app.models.admin_user import AdminUser


def seed_admin() -> None:
    if not settings.admin_email or not settings.admin_password:
        raise SystemExit("ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidas")

    db = SessionLocal()
    try:
        admin = (
            db.query(AdminUser).filter(AdminUser.email == settings.admin_email).first()
        )
        hashed = hash_password(settings.admin_password)

        if admin:
            admin.hashed_password = hashed
        else:
            admin = AdminUser(email=settings.admin_email, hashed_password=hashed)
            db.add(admin)

        db.commit()
        print(f"Admin '{settings.admin_email}' sincronizado")
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
