from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Query, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from ..repositories.ticket_repository import TicketRepository

DEFAULT_PAGE = 0
DEFAULT_PAGE_SIZE = 20

router = APIRouter()
ticket_repository = TicketRepository(filepath="../data/awesome_tickets.json")


@router.get("/")
async def get_tickets(
    page: int = Query(default=DEFAULT_PAGE, ge=0),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE, ge=0),
    author: Optional[str] = None,
    msg_content: Optional[str] = None,
    status: Optional[str] = None,
    timestamp_start: Optional[datetime] = None,
    timestamp_end: Optional[datetime] = None,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    tickets = repository.get_tickets(
        page,
        page_size,
        author=author,
        msg_content=msg_content,
        status=status,
        timestamp_start=timestamp_start,
        timestamp_end=timestamp_end
    )

    return JSONResponse(jsonable_encoder(tickets), status_code=200)


@router.get("/counts")
async def get_ticket_counts(
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket_counts = repository.get_ticket_counts()
    return JSONResponse(ticket_counts, status_code=200)


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
