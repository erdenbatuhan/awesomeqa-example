from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from app.repositories.ticket_repository import TicketRepository

router = APIRouter()
ticket_repository = TicketRepository(filepath="../data/awesome_tickets.json")


@router.get("/")
async def get_tickets(
    limit: int = 20,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    tickets = repository.get_tickets(limit)
    return JSONResponse(jsonable_encoder(tickets), status_code=200)


@router.get("/{ticket_id}")
async def get_ticket(
    ticket_id: str,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket = repository.get_ticket(ticket_id)
    return JSONResponse(jsonable_encoder(ticket), status_code=200)


@router.get("/{ticket_id}/messages")
async def get_ticket_context_messages(
    ticket_id: str,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket_context_messages = repository.get_ticket_context_messages(ticket_id)
    return JSONResponse(jsonable_encoder(ticket_context_messages), status_code=200)


@router.put("/{ticket_id}")
async def close_ticket(
    ticket_id: str,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket = repository.close_ticket(ticket_id)
    return JSONResponse(jsonable_encoder(ticket), status_code=200)


@router.delete("/{ticket_id}")
async def remove_ticket(
    ticket_id: str,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket = repository.remove_ticket(ticket_id)
    return JSONResponse(jsonable_encoder(ticket), status_code=200)
