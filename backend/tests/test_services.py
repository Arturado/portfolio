def test_crud_service(admin_client):
    created = admin_client.post(
        "/services", json={"title": "Consultoria", "description": "desc"}
    ).json()
    assert created["id"]

    assert len(admin_client.get("/services").json()) == 1
    assert len(admin_client.get("/admin/services").json()) == 1

    updated = admin_client.put(
        f"/services/{created['id']}", json={"title": "Consultoria Senior"}
    )
    assert updated.json()["title"] == "Consultoria Senior"

    deleted = admin_client.delete(f"/services/{created['id']}")
    assert deleted.status_code == 204
    assert admin_client.get("/services").json() == []


def test_create_without_auth_401(client):
    response = client.post(
        "/services",
        json={"title": "X", "description": "y"},
        headers={"Origin": "http://localhost:3000"},
    )
    assert response.status_code == 401
