def create_post(client, title, published=True, content="contenido " * 30):
    return client.post(
        "/blog",
        json={"title": title, "content": content, "published": published},
    ).json()


def test_create_generates_excerpt(admin_client):
    post = create_post(admin_client, "Post con excerpt")
    assert post["excerpt"] == ("contenido " * 30)[:160]


def test_public_list_excludes_drafts(admin_client):
    create_post(admin_client, "Publicado", published=True)
    create_post(admin_client, "Borrador", published=False)

    response = admin_client.get("/blog")
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["title"] == "Publicado"


def test_public_get_draft_returns_404(admin_client):
    create_post(admin_client, "Secreto", published=False)

    response = admin_client.get("/blog/secreto")
    assert response.status_code == 404


def test_admin_list_includes_drafts(admin_client):
    create_post(admin_client, "Publicado", published=True)
    create_post(admin_client, "Borrador", published=False)

    response = admin_client.get("/admin/blog")
    assert response.json()["total"] == 2


def test_pagination(admin_client):
    for i in range(25):
        create_post(admin_client, f"Post {i}")

    page1 = admin_client.get("/blog?page=1&limit=20").json()
    page2 = admin_client.get("/blog?page=2&limit=20").json()

    assert page1["total"] == 25
    assert page1["pages"] == 2
    assert len(page1["items"]) == 20
    assert len(page2["items"]) == 5


def test_duplicate_slug_gets_suffix(admin_client):
    first = create_post(admin_client, "Repetido")
    second = create_post(admin_client, "Repetido")
    assert first["slug"] == "repetido"
    assert second["slug"] == "repetido-2"


def test_update_and_delete(admin_client):
    post = create_post(admin_client, "Editable")

    updated = admin_client.put(f"/blog/{post['slug']}", json={"published": False})
    assert updated.status_code == 200
    assert updated.json()["published_at"] is None

    deleted = admin_client.delete(f"/blog/{post['slug']}")
    assert deleted.status_code == 204


def test_missing_slug_404(client):
    assert client.get("/blog/no-existe").status_code == 404


def test_create_without_auth_401(client):
    response = client.post(
        "/blog",
        json={"title": "X", "content": "y"},
        headers={"Origin": "http://localhost:3000"},
    )
    assert response.status_code == 401
