from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    pages: int


def paginate(total: int, page: int, limit: int) -> tuple[int, int]:
    offset = (page - 1) * limit
    pages = (total + limit - 1) // limit
    return offset, pages
