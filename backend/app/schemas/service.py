from datetime import datetime

from pydantic import BaseModel


class ServiceCreate(BaseModel):
    title: str
    description: str
    order: int = 0


class ServiceUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    order: int | None = None


class ServiceOut(BaseModel):
    id: int
    title: str
    description: str
    order: int
    created_at: datetime

    model_config = {"from_attributes": True}
