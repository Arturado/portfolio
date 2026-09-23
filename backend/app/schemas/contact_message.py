from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)
    recaptcha_token: str
    # Honeypot: campo oculto en el form que un humano nunca llena.
    website: str = ""


class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime
    read: bool

    model_config = {"from_attributes": True}
