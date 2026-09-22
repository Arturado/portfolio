from datetime import datetime

from pydantic import BaseModel


class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime
    read: bool

    model_config = {"from_attributes": True}
