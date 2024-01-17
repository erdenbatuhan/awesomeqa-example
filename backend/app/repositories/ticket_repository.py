from datetime import datetime
from typing import Optional
from collections import Counter

from app.models.ticket import Ticket
from app.models.message import Message
from app.models.enums.status import Status

from app.repositories.message_repository import MessageRepository

from app.utils.data_utils import DataUtils
from app.utils.list_utils import ListUtils

from app.exceptions.not_found_exception import NotFoundException


class TicketRepository:

    def __init__(self, filepath: str):
        self.message_repository = MessageRepository(filepath)
        self.data = DataUtils.read_and_validate_data(filepath, Ticket, "tickets")

        # Set message attribute for each ticket
        for ticket_id, ticket in self.data.items():
            self.data[ticket_id].msg = self.message_repository.get_message(ticket.msg_id)

    def get_tickets(self, page: int, page_size: int, **filter_arguments) -> list[dict]:
        tickets_filtered = [ticket for ticket in self.data.values() if ticket.filter(**filter_arguments)]
        return ListUtils.get_paginated_list(lst=tickets_filtered, page=page, page_size=page_size)

    def get_ticket_counts(self) -> dict[Status, int]:
        return Counter(ticket.status for ticket in self.data.values())

    def get_ticket(self, ticket_id: str) -> Ticket:
        if ticket_id not in self.data:
            raise NotFoundException("ticket", ticket_id)

        return self.data[ticket_id]

    def get_ticket_context_messages(self, ticket_id: str) -> list[Message]:
        ticket = self.get_ticket(ticket_id)
        return self.message_repository.get_messages_by_ids(ticket.context_messages)

    def __update_ticket_status(self, ticket_id: str, new_status: Status) -> Ticket:
        ticket = self.get_ticket(ticket_id)

        ticket.status = new_status
        ticket.ts_last_status_change = datetime.now()

        return ticket

    def close_ticket(self, ticket_id: str) -> Ticket:
        return self.__update_ticket_status(ticket_id, Status.CLOSED)

    def remove_ticket(self, ticket_id: str) -> Ticket:
        return self.__update_ticket_status(ticket_id, Status.REMOVED)
