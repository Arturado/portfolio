from sqlalchemy import JSON, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base

PROFILE_SINGLETON_ID = 1


class Profile(Base):
    __tablename__ = "profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    experience: Mapped[list | None] = mapped_column(JSON, nullable=True)
    skills: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    cv_pdf_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
