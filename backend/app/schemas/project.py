from datetime import datetime

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    title: str
    slug: str | None = None
    description: str
    stack: list[str] = []
    image_urls: list[str] = []
    repo_url: str | None = None
    demo_url: str | None = None
    featured: bool = False
    order: int = 0


class ProjectUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    description: str | None = None
    stack: list[str] | None = None
    image_urls: list[str] | None = None
    repo_url: str | None = None
    demo_url: str | None = None
    featured: bool | None = None
    order: int | None = None


class ProjectOut(BaseModel):
    id: int
    title: str
    slug: str
    description: str
    stack: list[str]
    image_urls: list[str]
    repo_url: str | None
    demo_url: str | None
    featured: bool
    order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
