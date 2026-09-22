from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    jwt_secret: str

    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    resend_api_key: str = ""
    contact_email: str = ""

    recaptcha_site_key: str = ""
    recaptcha_secret_key: str = ""


settings = Settings()
