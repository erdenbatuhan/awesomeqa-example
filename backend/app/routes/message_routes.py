from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from app.repositories.message_repository import MessageRepository

router = APIRouter()
message_repository = MessageRepository(filepath="../data/awesome_tickets.json")


@router.get("/{message_id}")
async def get_tickets(
    message_id: str,
    repository: MessageRepository = Depends(lambda: message_repository)
):
    message = repository.get_message(message_id)
    return JSONResponse(jsonable_encoder(message), status_code=200)
