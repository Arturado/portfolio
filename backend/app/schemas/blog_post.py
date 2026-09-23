from datetime import datetime

from pydantic import BaseModel


class BlogPostCreate(BaseModel):
    title: str
    slug: str | None = None
    content: str
    excerpt: str | None = None
    cover_image_url: str | None = None
    tags: list[str] = []
    published: bool = False


class BlogPostUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    content: str | None = None
    excerpt: str | None = None
    cover_image_url: str | None = None
    tags: list[str] | None = None
    published: bool | None = None


class BlogPostSummaryOut(BaseModel):
    title: str
    slug: str
    excerpt: str | None
    cover_image_url: str | None
    published_at: datetime | None

    model_config = {"from_attributes": True}


class BlogPostOut(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    excerpt: str | None
    cover_image_url: str | None
    tags: list[str]
    published: bool
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
