from unittest.mock import AsyncMock, patch

from app.models.contact_message import ContactMessage

VALID_PAYLOAD = {
    "name": "Juan",
    "email": "juan@example.com",
    "message": "Hola, quiero charlar sobre un proyecto.",
    "recaptcha_token": "fake-token",
}


def _post_contact(client, db_session, payload=None, recaptcha_ok=True):
    with (
        patch(
            "app.routers.contact_messages.verify_recaptcha",
            new=AsyncMock(return_value=recaptcha_ok),
        ),
        patch(
            "app.routers.contact_messages.send_contact_notification",
            new=AsyncMock(return_value=True),
        ) as mock_notification,
        patch(
            "app.routers.contact_messages.send_contact_autoreply",
            new=AsyncMock(return_value=True),
        ) as mock_autoreply,
    ):
        response = client.post(
            "/contact", json=payload or VALID_PAYLOAD, headers={"Origin": "http://localhost:3000"}
        )
    return response, mock_notification, mock_autoreply


def test_submit_contact_success(client, db_session):
    response, mock_notification, mock_autoreply = _post_contact(client, db_session)

    assert response.status_code == 200
    assert response.json() == {"success": True}

    messages = db_session.query(ContactMessage).all()
    assert len(messages) == 1
    assert messages[0].name == "Juan"
    assert messages[0].read is False

    mock_notification.assert_awaited_once()
    mock_autoreply.assert_awaited_once()


def test_submit_contact_sanitizes_html_in_message(client, db_session):
    payload = {**VALID_PAYLOAD, "message": "Hola <script>alert('x')</script> mundo"}
    response, _, _ = _post_contact(client, db_session, payload=payload)

    assert response.status_code == 200
    message = db_session.query(ContactMessage).first()
    assert "<script>" not in message.message
    assert "alert" not in message.message


def test_submit_contact_rejects_low_recaptcha_score(client, db_session):
    response, mock_notification, mock_autoreply = _post_contact(client, db_session, recaptcha_ok=False)

    assert response.status_code == 400
    assert db_session.query(ContactMessage).count() == 0
    mock_notification.assert_not_awaited()
    mock_autoreply.assert_not_awaited()


def test_submit_contact_honeypot_returns_fake_success(client, db_session):
    payload = {**VALID_PAYLOAD, "website": "http://spam-bot.example"}
    response, mock_notification, mock_autoreply = _post_contact(client, db_session, payload=payload)

    assert response.status_code == 200
    assert response.json() == {"success": True}
    assert db_session.query(ContactMessage).count() == 0
    mock_notification.assert_not_awaited()
    mock_autoreply.assert_not_awaited()


def test_submit_contact_rate_limited_after_three_attempts(client, db_session):
    for _ in range(3):
        response, _, _ = _post_contact(client, db_session)
        assert response.status_code == 200

    response, mock_notification, mock_autoreply = _post_contact(client, db_session)

    assert response.status_code == 429
    mock_notification.assert_not_awaited()
    mock_autoreply.assert_not_awaited()


def test_submit_contact_without_origin_rejected(client):
    response = client.post("/contact", json=VALID_PAYLOAD)
    assert response.status_code == 403
