import uvicorn
from fastapi import FastAPI

from app.routes.ticket_routes import router as ticket_router
from app.routes.message_routes import router as message_router

API_PREFIX = "/api/v1"

app = FastAPI()


@app.get("/healthz")
async def root():
    return "OK"


# Routes
app.include_router(ticket_router, prefix=f"{API_PREFIX}/tickets")
app.include_router(message_router, prefix=f"{API_PREFIX}/messages")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
