import io
from unittest.mock import patch


def _fake_file(content_type, data=b"fake-bytes"):
    return {"file": ("test.jpg", io.BytesIO(data), content_type)}


def test_upload_without_auth_401(client):
    response = client.post(
        "/admin/uploads",
        files=_fake_file("image/jpeg"),
        headers={"Origin": "http://localhost:3000"},
    )
    assert response.status_code == 401


def test_upload_rejects_invalid_type(admin_client):
    response = admin_client.post(
        "/admin/uploads", files=_fake_file("text/plain")
    )
    assert response.status_code == 400


def test_upload_rejects_too_large(admin_client):
    big = b"0" * (5 * 1024 * 1024 + 1)
    response = admin_client.post(
        "/admin/uploads", files=_fake_file("image/jpeg", data=big)
    )
    assert response.status_code == 400


@patch("app.core.uploads.cloudinary.uploader.upload")
def test_upload_success(mock_upload, admin_client):
    mock_upload.return_value = {"secure_url": "https://res.cloudinary.com/demo/image.jpg"}

    response = admin_client.post("/admin/uploads", files=_fake_file("image/jpeg"))

    assert response.status_code == 200
    assert response.json() == {"url": "https://res.cloudinary.com/demo/image.jpg"}
    mock_upload.assert_called_once()


@patch("app.core.uploads.cloudinary.uploader.upload")
def test_upload_pdf_allowed(mock_upload, admin_client):
    mock_upload.return_value = {"secure_url": "https://res.cloudinary.com/demo/cv.pdf"}

    response = admin_client.post(
        "/admin/uploads", files={"file": ("cv.pdf", io.BytesIO(b"%PDF-1.4"), "application/pdf")}
    )

    assert response.status_code == 200
