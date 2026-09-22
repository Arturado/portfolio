def test_crud_testimonial(admin_client):
    created = admin_client.post(
        "/testimonials", json={"name": "Cliente", "text": "Excelente trabajo"}
    ).json()
    assert created["id"]

    public = admin_client.get("/testimonials").json()
    assert len(public) == 1

    admin_list = admin_client.get("/admin/testimonials").json()
    assert len(admin_list) == 1

    updated = admin_client.put(
        f"/testimonials/{created['id']}", json={"company": "Acme"}
    )
    assert updated.status_code == 200
    assert updated.json()["company"] == "Acme"

    deleted = admin_client.delete(f"/testimonials/{created['id']}")
    assert deleted.status_code == 204
    assert admin_client.get("/testimonials").json() == []


def test_create_without_auth_401(client):
    response = client.post(
        "/testimonials",
        json={"name": "X", "text": "y"},
        headers={"Origin": "http://localhost:3000"},
    )
    assert response.status_code == 401
