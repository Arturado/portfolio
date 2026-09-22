from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_admin
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceOut, ServiceUpdate

router = APIRouter(tags=["services"])


def _get_or_404(db: Session, service_id: int) -> Service:
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return service


@router.get("/services", response_model=list[ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return db.query(Service).order_by(Service.order).all()


@router.get("/admin/services", response_model=list[ServiceOut])
def list_services_admin(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Service).order_by(Service.order).all()


@router.post("/services", response_model=ServiceOut, status_code=201)
def create_service(
    payload: ServiceCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    service = Service(**payload.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/services/{service_id}", response_model=ServiceOut)
def update_service(
    service_id: int,
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    service = _get_or_404(db, service_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/services/{service_id}", status_code=204)
def delete_service(
    service_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    service = _get_or_404(db, service_id)
    db.delete(service)
    db.commit()
