from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_admin
from app.models.profile import PROFILE_SINGLETON_ID, Profile
from app.schemas.profile import ProfileOut, ProfileUpdate

router = APIRouter(tags=["profile"])


@router.get("/profile", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db)):
    profile = db.get(Profile, PROFILE_SINGLETON_ID)
    if profile is None:
        return ProfileOut()
    return profile


@router.put("/profile", response_model=ProfileOut)
def update_profile(
    payload: ProfileUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    profile = db.get(Profile, PROFILE_SINGLETON_ID)
    if profile is None:
        profile = Profile(id=PROFILE_SINGLETON_ID)
        db.add(profile)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile
