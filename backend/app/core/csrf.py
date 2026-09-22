from urllib.parse import urlsplit

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.core.config import settings

UNSAFE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}


def _origin(url: str) -> str:
    parts = urlsplit(url)
    return f"{parts.scheme}://{parts.netloc}"


class CSRFOriginMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in UNSAFE_METHODS:
            origin = request.headers.get("origin")
            source = origin or request.headers.get("referer")

            if not source or _origin(source) != _origin(settings.allowed_origin):
                return JSONResponse(
                    status_code=403, content={"detail": "Origin no permitido"}
                )

        return await call_next(request)
