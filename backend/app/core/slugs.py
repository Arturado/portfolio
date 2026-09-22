import re
import unicodedata

from sqlalchemy import exists
from sqlalchemy.orm import Session


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    return re.sub(r"[-\s]+", "-", value)


def unique_slug(
    db: Session, model, base: str, exclude_id: int | None = None
) -> str:
    slug = base
    suffix = 2
    while True:
        query = db.query(exists().where(model.slug == slug))
        if exclude_id is not None:
            query = db.query(
                exists().where(model.slug == slug, model.id != exclude_id)
            )
        if not query.scalar():
            return slug
        slug = f"{base}-{suffix}"
        suffix += 1
