from app.core.config import settings

ORIGIN_HEADERS = {"Origin": settings.allowed_origin}


def test_login_success(client, admin_user):
    response = client.post(
        "/auth/login",
        json={"email": settings.admin_email, "password": settings.admin_password},
        headers=ORIGIN_HEADERS,
    )

    assert response.status_code == 200
    assert "session" in response.cookies

    me = client.get("/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == settings.admin_email


def test_login_wrong_password(client, admin_user):
    response = client.post(
        "/auth/login",
        json={"email": settings.admin_email, "password": "wrong-password"},
        headers=ORIGIN_HEADERS,
    )

    assert response.status_code == 401
    assert "session" not in response.cookies


def test_me_without_cookie(client):
    response = client.get("/auth/me")
    assert response.status_code == 401


def test_login_without_origin_is_rejected(client, admin_user):
    response = client.post(
        "/auth/login",
        json={"email": settings.admin_email, "password": settings.admin_password},
    )

    assert response.status_code == 403


def test_login_with_wrong_origin_is_rejected(client, admin_user):
    response = client.post(
        "/auth/login",
        json={"email": settings.admin_email, "password": settings.admin_password},
        headers={"Origin": "https://evil.example.com"},
    )

    assert response.status_code == 403


def test_logout_clears_session(client, admin_user):
    client.post(
        "/auth/login",
        json={"email": settings.admin_email, "password": settings.admin_password},
        headers=ORIGIN_HEADERS,
    )
    assert client.get("/auth/me").status_code == 200

    logout = client.post("/auth/logout", headers=ORIGIN_HEADERS)
    assert logout.status_code == 200

    assert client.get("/auth/me").status_code == 401
