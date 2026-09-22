from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24

    admin_email: str = ""
    admin_password: str = ""

    allowed_origin: str = "http://localhost:3000"
    # Dominio del cookie de sesion. Vacio = host-only (sirve para localhost).
    # En produccion usar ".arturodev.info" para que frontend y backend
    # (subdominios distintos) puedan leer la misma cookie.
    cookie_domain: str = ""

    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    resend_api_key: str = ""
    contact_email: str = ""

    recaptcha_site_key: str = ""
    recaptcha_secret_key: str = ""


settings = Settings()
