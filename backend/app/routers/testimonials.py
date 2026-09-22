from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_admin
from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialOut, TestimonialUpdate

router = APIRouter(tags=["testimonials"])


def _get_or_404(db: Session, testimonial_id: int) -> Testimonial:
    testimonial = db.get(Testimonial, testimonial_id)
    if testimonial is None:
        raise HTTPException(status_code=404, detail="Testimonio no encontrado")
    return testimonial


@router.get("/testimonials", response_model=list[TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    return db.query(Testimonial).order_by(Testimonial.order).all()


@router.get("/admin/testimonials", response_model=list[TestimonialOut])
def list_testimonials_admin(
    db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    return db.query(Testimonial).order_by(Testimonial.order).all()


@router.post("/testimonials", response_model=TestimonialOut, status_code=201)
def create_testimonial(
    payload: TestimonialCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    testimonial = Testimonial(**payload.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialOut)
def update_testimonial(
    testimonial_id: int,
    payload: TestimonialUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    testimonial = _get_or_404(db, testimonial_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(testimonial, field, value)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.delete("/testimonials/{testimonial_id}", status_code=204)
def delete_testimonial(
    testimonial_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    testimonial = _get_or_404(db, testimonial_id)
    db.delete(testimonial)
    db.commit()
