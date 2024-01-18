import uvicorn
from fastapi import FastAPI, status as http_status

from .routes.ticket_routes import router as ticket_router

API_PREFIX = "/api/v1"

app = FastAPI()


@app.get(
    "/healthz",
    summary="Perform a healthcheck.",
    tags=["Healthcheck"],
    response_model=str,
    response_description="Healthcheck response. Should return 'OK' if the service is healthy.",
    responses={
        http_status.HTTP_200_OK: {"description": "Healthcheck successful. Service is healthy."},
        http_status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Internal Server Error."}
    }
)
async def root():
    return "OK"


# Routes
app.include_router(ticket_router, prefix=f"{API_PREFIX}/tickets")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
