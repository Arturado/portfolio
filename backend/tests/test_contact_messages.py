from app.models.contact_message import ContactMessage


def _seed_message(db_session, name="Juan", email="juan@example.com"):
    message = ContactMessage(name=name, email=email, message="hola")
    db_session.add(message)
    db_session.commit()
    db_session.refresh(message)
    return message


def test_list_contact_messages(admin_client, db_session):
    _seed_message(db_session)
    _seed_message(db_session, name="Ana", email="ana@example.com")

    response = admin_client.get("/admin/contact-messages")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 2


def test_mark_as_read(admin_client, db_session):
    message = _seed_message(db_session)

    response = admin_client.patch(f"/admin/contact-messages/{message.id}")
    assert response.status_code == 200
    assert response.json()["read"] is True


def test_delete_message(admin_client, db_session):
    message = _seed_message(db_session)

    response = admin_client.delete(f"/admin/contact-messages/{message.id}")
    assert response.status_code == 204


def test_list_without_auth_401(client):
    response = client.get("/admin/contact-messages")
    assert response.status_code == 401
