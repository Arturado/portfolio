from fastapi import FastAPI

app = FastAPI(title="arturodev.info API")


@app.get("/health")
def health():
    return {"status": "ok"}
