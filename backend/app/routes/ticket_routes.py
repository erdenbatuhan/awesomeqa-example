from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.repositories.ticket_repository import TicketRepository

router = APIRouter()
ticket_repository = TicketRepository(filepath="../data/awesome_tickets.json")


@router.get("/")
async def get_tickets(
    limit: int = 20,
    repository: TicketRepository = Depends(lambda: ticket_repository),
):
    tickets = repository.get_tickets(limit)
    return JSONResponse(tickets, status_code=200)
