from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Query, Depends, status as http_status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from ..repositories.ticket_repository import TicketRepository
from ..models.ticket import Ticket
from ..models.message import Message
from ..models.enums.status import Status
from ..exceptions.not_found_exception import NotFoundException

DEFAULT_PAGE = 0
DEFAULT_PAGE_SIZE = 20

router = APIRouter()
ticket_repository = TicketRepository(filepath="../data/awesome_tickets.json")


@router.get(
    "/",
    summary="Get paginated response of tickets with optional filters.",
    tags=["Tickets"],
    response_model=list[Ticket],
    response_description="A paginated list of tickets after applying optional filters.",
    responses={
        http_status.HTTP_200_OK: {"description": "Tickets successfully retrieved."},
        http_status.HTTP_422_UNPROCESSABLE_ENTITY: {"description": "Validation error in request."},
        http_status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Internal Server Error."}
    }
)
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

    return JSONResponse(jsonable_encoder(tickets), status_code=http_status.HTTP_200_OK)


@router.get(
    "/counts",
    summary="Get ticket counts per each status.",
    tags=["Tickets"],
    response_model=dict[Status, int],
    response_description="A dictionary containing each status and their respective ticket counts.",
    responses={
        http_status.HTTP_200_OK: {"description": "Ticket counts successfully retrieved."},
        http_status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Internal Server Error."}
    }
)
async def get_ticket_counts(
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket_counts = repository.get_ticket_counts()
    return JSONResponse(ticket_counts, status_code=http_status.HTTP_200_OK)


@router.get(
    "/{ticket_id}",
    summary="Get a ticket by its ID.",
    tags=["Tickets"],
    response_model=Ticket,
    response_description="A ticket with the given ID.",
    responses={
        http_status.HTTP_200_OK: {"description": "Ticket successfully retrieved."},
        http_status.HTTP_404_NOT_FOUND: {"description": "Ticket not found."},
        http_status.HTTP_422_UNPROCESSABLE_ENTITY: {"description": "Validation error in request."},
        http_status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Internal Server Error."}
    }
)
async def get_ticket(
    ticket_id: str,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket = repository.get_ticket(ticket_id)
    return JSONResponse(jsonable_encoder(ticket), status_code=http_status.HTTP_200_OK)


@router.get(
    "/{ticket_id}/messages",
    summary="Get context messages associated with a ticket by ID.",
    tags=["Tickets"],
    response_model=list[Message],
    response_description="Context messages associated with the ticket with the given ID.",
    responses={
        http_status.HTTP_200_OK: {"description": "Context messages successfully retrieved."},
        http_status.HTTP_404_NOT_FOUND: {"description": "Ticket or message not found."},
        http_status.HTTP_422_UNPROCESSABLE_ENTITY: {"description": "Validation error in request."},
        http_status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Internal Server Error."}
    }
)
async def get_ticket_context_messages(
    ticket_id: str,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket_context_messages = repository.get_ticket_context_messages(ticket_id)
    return JSONResponse(jsonable_encoder(ticket_context_messages), status_code=http_status.HTTP_200_OK)


@router.put(
    "/{ticket_id}",
    summary="Close a ticket by ID.",
    tags=["Tickets"],
    response_model=Ticket,
    response_description="The updated ticket response after setting its status to closed.",
    responses={
        http_status.HTTP_200_OK: {"description": "Ticket successfully closed."},
        http_status.HTTP_404_NOT_FOUND: {"description": "Ticket not found."},
        http_status.HTTP_422_UNPROCESSABLE_ENTITY: {"description": "Validation error in request."},
        http_status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Internal Server Error."}
    }
)
async def close_ticket(
    ticket_id: str,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket = repository.close_ticket(ticket_id)
    return JSONResponse(jsonable_encoder(ticket), status_code=http_status.HTTP_200_OK)


@router.delete(
    "/{ticket_id}",
    summary="Remove a ticket by ID.",
    tags=["Tickets"],
    response_model=Ticket,
    response_description="The updated ticket response after setting its status to removed.",
    responses={
        http_status.HTTP_200_OK: {"description": "Ticket successfully removed."},
        http_status.HTTP_404_NOT_FOUND: {"description": "Ticket not found."},
        http_status.HTTP_422_UNPROCESSABLE_ENTITY: {"description": "Validation error in request."},
        http_status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": "Internal Server Error."}
    }
)
async def remove_ticket(
    ticket_id: str,
    repository: TicketRepository = Depends(lambda: ticket_repository)
):
    ticket = repository.remove_ticket(ticket_id)
    return JSONResponse(jsonable_encoder(ticket), status_code=http_status.HTTP_200_OK)
