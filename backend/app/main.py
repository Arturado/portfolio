from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.csrf import CSRFOriginMiddleware
from app.routers import (
    auth,
    blog,
    contact_messages,
    profile,
    projects,
    services,
    testimonials,
    uploads,
)

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
app.include_router(projects.router)
app.include_router(blog.router)
app.include_router(testimonials.router)
app.include_router(services.router)
app.include_router(profile.router)
app.include_router(contact_messages.router)
app.include_router(uploads.router)


@app.get("/health")
def health():
    return {"status": "ok"}
