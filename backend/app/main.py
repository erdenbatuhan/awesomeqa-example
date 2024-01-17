import uvicorn
from fastapi import FastAPI

from .routes.ticket_routes import router as ticket_router

API_PREFIX = "/api/v1"

app = FastAPI()


@app.get("/healthz")
async def root():
    return "OK"


# Routes
app.include_router(ticket_router, prefix=f"{API_PREFIX}/tickets")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
