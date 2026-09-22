def test_get_profile_without_row_does_not_crash(client):
    response = client.get("/profile")
    assert response.status_code == 200
    assert response.json() == {
        "bio": None,
        "experience": None,
        "skills": None,
        "cv_pdf_url": None,
    }


def test_put_creates_then_updates(admin_client):
    created = admin_client.put("/profile", json={"bio": "Hola", "skills": ["python"]})
    assert created.status_code == 200
    assert created.json()["bio"] == "Hola"

    updated = admin_client.put("/profile", json={"bio": "Actualizado"})
    assert updated.status_code == 200
    body = updated.json()
    assert body["bio"] == "Actualizado"
    assert body["skills"] == ["python"]

    assert admin_client.get("/profile").json()["bio"] == "Actualizado"


def test_update_without_auth_401(client):
    response = client.put(
        "/profile", json={"bio": "x"}, headers={"Origin": "http://localhost:3000"}
    )
    assert response.status_code == 401
