def test_create_and_get_project(admin_client):
    response = admin_client.post(
        "/projects",
        json={"title": "Mi Proyecto", "description": "desc", "stack": ["python"]},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["slug"] == "mi-proyecto"

    public = admin_client.get(f"/projects/{body['slug']}")
    assert public.status_code == 200
    assert public.json()["title"] == "Mi Proyecto"


def test_list_projects_public(admin_client):
    admin_client.post("/projects", json={"title": "A", "description": "d"})
    admin_client.post("/projects", json={"title": "B", "description": "d"})

    response = admin_client.get("/projects")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_list_projects_filter_featured(admin_client):
    admin_client.post("/projects", json={"title": "Destacado", "description": "d", "featured": True})
    admin_client.post("/projects", json={"title": "Normal", "description": "d", "featured": False})

    response = admin_client.get("/projects?featured=true")
    assert response.status_code == 200
    titles = [p["title"] for p in response.json()]
    assert titles == ["Destacado"]


def test_admin_list_projects(admin_client):
    admin_client.post("/projects", json={"title": "A", "description": "d"})

    response = admin_client.get("/admin/projects")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_duplicate_slug_gets_suffix(admin_client):
    first = admin_client.post("/projects", json={"title": "Repetido", "description": "d"})
    second = admin_client.post("/projects", json={"title": "Repetido", "description": "d"})

    assert first.json()["slug"] == "repetido"
    assert second.json()["slug"] == "repetido-2"


def test_update_project(admin_client):
    created = admin_client.post(
        "/projects", json={"title": "Original", "description": "d"}
    ).json()

    response = admin_client.put(
        f"/projects/{created['slug']}", json={"description": "actualizada"}
    )
    assert response.status_code == 200
    assert response.json()["description"] == "actualizada"
    assert response.json()["title"] == "Original"


def test_delete_project(admin_client):
    created = admin_client.post(
        "/projects", json={"title": "Borrame", "description": "d"}
    ).json()

    response = admin_client.delete(f"/projects/{created['slug']}")
    assert response.status_code == 204
    assert admin_client.get(f"/projects/{created['slug']}").status_code == 404


def test_get_missing_project_404(client):
    assert client.get("/projects/no-existe").status_code == 404


def test_create_project_without_auth_401(client):
    response = client.post(
        "/projects",
        json={"title": "Sin auth", "description": "d"},
        headers={"Origin": "http://localhost:3000"},
    )
    assert response.status_code == 401
