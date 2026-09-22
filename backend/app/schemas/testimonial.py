from datetime import datetime

from pydantic import BaseModel


class TestimonialCreate(BaseModel):
    name: str
    company: str | None = None
    text: str
    photo_url: str | None = None
    order: int = 0


class TestimonialUpdate(BaseModel):
    name: str | None = None
    company: str | None = None
    text: str | None = None
    photo_url: str | None = None
    order: int | None = None


class TestimonialOut(BaseModel):
    id: int
    name: str
    company: str | None
    text: str
    photo_url: str | None
    order: int
    created_at: datetime

    model_config = {"from_attributes": True}
