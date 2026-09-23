import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("JWT_SECRET", "test-secret")
os.environ.setdefault("ALLOWED_ORIGIN", "http://localhost:3000")
os.environ.setdefault("ADMIN_EMAIL", "admin@arturodev.info")
os.environ.setdefault("ADMIN_PASSWORD", "test-password")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.core.db import Base, get_db
from app.core.security import hash_password
from app.main import app
from app.models.admin_user import AdminUser

test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSessionLocal = sessionmaker(bind=test_engine, autocommit=False, autoflush=False)


def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(autouse=True)
def reset_rate_limit():
    from app.core.rate_limit import _hits

    _hits.clear()
    yield
    _hits.clear()


@pytest.fixture
def db_session():
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def admin_user(db_session):
    admin = AdminUser(
        email=settings.admin_email,
        hashed_password=hash_password(settings.admin_password),
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def origin_headers():
    return {"Origin": settings.allowed_origin}


@pytest.fixture
def admin_client(client, admin_user, origin_headers):
    client.headers.update(origin_headers)
    response = client.post(
        "/auth/login",
        json={"email": settings.admin_email, "password": settings.admin_password},
    )
    assert response.status_code == 200
    return client
