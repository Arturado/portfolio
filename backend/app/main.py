from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.csrf import CSRFOriginMiddleware
from app.routers import auth

app = FastAPI(title="arturodev.info API")

# CSRFOriginMiddleware se agrega antes: al agregarse despues, CORSMiddleware
# queda como capa mas externa y resuelve el preflight OPTIONS primero.
app.add_middleware(CSRFOriginMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.get("/health")
def health():
    return {"status": "ok"}
