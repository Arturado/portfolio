from fastapi import APIRouter, Depends, File, UploadFile

from app.core.deps import get_current_admin
from app.core.uploads import upload_to_cloudinary
from app.schemas.upload import UploadOut

router = APIRouter(tags=["uploads"])


@router.post("/admin/uploads", response_model=UploadOut)
async def upload_file(
    file: UploadFile = File(...), _=Depends(get_current_admin)
):
    url = await upload_to_cloudinary(file)
    return UploadOut(url=url)
