from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminOut(BaseModel):
    id: int
    email: str

    model_config = {"from_attributes": True}
