from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    bio: str | None = None
    experience: list | None = None
    skills: list[str] | None = None
    cv_pdf_url: str | None = None


class ProfileOut(BaseModel):
    bio: str | None = None
    experience: list | None = None
    skills: list[str] | None = None
    cv_pdf_url: str | None = None

    model_config = {"from_attributes": True}
