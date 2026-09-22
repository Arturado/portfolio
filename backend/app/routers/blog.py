from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_admin
from app.core.slugs import slugify, unique_slug
from app.models.blog_post import BlogPost
from app.schemas.blog_post import BlogPostCreate, BlogPostOut, BlogPostUpdate
from app.schemas.pagination import Page, paginate

router = APIRouter(tags=["blog"])

EXCERPT_LENGTH = 160


def _get_published_by_slug_or_404(db: Session, slug: str) -> BlogPost:
    post = (
        db.query(BlogPost)
        .filter(BlogPost.slug == slug, BlogPost.published.is_(True))
        .first()
    )
    if post is None:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    return post


def _get_by_slug_or_404(db: Session, slug: str) -> BlogPost:
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    return post


@router.get("/blog", response_model=Page[BlogPostOut])
def list_blog_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(BlogPost).filter(BlogPost.published.is_(True))
    total = query.count()
    offset, pages = paginate(total, page, limit)
    items = (
        query.order_by(BlogPost.published_at.desc()).offset(offset).limit(limit).all()
    )
    return Page(items=items, total=total, page=page, pages=pages)


@router.get("/admin/blog", response_model=Page[BlogPostOut])
def list_blog_posts_admin(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    query = db.query(BlogPost)
    total = query.count()
    offset, pages = paginate(total, page, limit)
    items = (
        query.order_by(BlogPost.created_at.desc()).offset(offset).limit(limit).all()
    )
    return Page(items=items, total=total, page=page, pages=pages)


@router.get("/blog/{slug}", response_model=BlogPostOut)
def get_blog_post(slug: str, db: Session = Depends(get_db)):
    return _get_published_by_slug_or_404(db, slug)


@router.post("/blog", response_model=BlogPostOut, status_code=201)
def create_blog_post(
    payload: BlogPostCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    base_slug = slugify(payload.slug or payload.title)
    slug = unique_slug(db, BlogPost, base_slug)
    excerpt = payload.excerpt or payload.content[:EXCERPT_LENGTH]

    data = payload.model_dump(exclude={"slug", "excerpt"})
    post = BlogPost(
        **data,
        slug=slug,
        excerpt=excerpt,
        published_at=datetime.now(timezone.utc) if payload.published else None,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/blog/{slug}", response_model=BlogPostOut)
def update_blog_post(
    slug: str,
    payload: BlogPostUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    post = _get_by_slug_or_404(db, slug)
    data = payload.model_dump(exclude_unset=True)

    if "slug" in data and data["slug"]:
        data["slug"] = unique_slug(db, BlogPost, slugify(data["slug"]), exclude_id=post.id)
    else:
        data.pop("slug", None)

    was_published = post.published

    for field, value in data.items():
        setattr(post, field, value)

    if not was_published and post.published:
        post.published_at = datetime.now(timezone.utc)
    elif not post.published:
        post.published_at = None

    db.commit()
    db.refresh(post)
    return post


@router.delete("/blog/{slug}", status_code=204)
def delete_blog_post(
    slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    post = _get_by_slug_or_404(db, slug)
    db.delete(post)
    db.commit()
