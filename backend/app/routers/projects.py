from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_admin
from app.core.slugs import slugify, unique_slug
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate

router = APIRouter(tags=["projects"])


def _get_by_slug_or_404(db: Session, slug: str) -> Project:
    project = db.query(Project).filter(Project.slug == slug).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project


@router.get("/projects", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.order).all()


@router.get("/admin/projects", response_model=list[ProjectOut])
def list_projects_admin(
    db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    return db.query(Project).order_by(Project.order).all()


@router.get("/projects/{slug}", response_model=ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    return _get_by_slug_or_404(db, slug)


@router.post("/projects", response_model=ProjectOut, status_code=201)
def create_project(
    payload: ProjectCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    base_slug = slugify(payload.slug or payload.title)
    slug = unique_slug(db, Project, base_slug)

    project = Project(**{**payload.model_dump(exclude={"slug"}), "slug": slug})
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/projects/{slug}", response_model=ProjectOut)
def update_project(
    slug: str,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    project = _get_by_slug_or_404(db, slug)
    data = payload.model_dump(exclude_unset=True)

    if "slug" in data and data["slug"]:
        data["slug"] = unique_slug(db, Project, slugify(data["slug"]), exclude_id=project.id)
    else:
        data.pop("slug", None)

    for field, value in data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{slug}", status_code=204)
def delete_project(
    slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    project = _get_by_slug_or_404(db, slug)
    db.delete(project)
    db.commit()
