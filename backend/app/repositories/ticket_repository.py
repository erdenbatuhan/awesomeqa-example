from datetime import datetime
from collections import Counter

from ..models.ticket import Ticket
from ..models.message import Message
from ..models.enums.status import Status

from ..utils.data_utils import DataUtils
from ..utils.list_utils import ListUtils

from ..exceptions.not_found_exception import NotFoundException


class TicketRepository:

    def __init__(self, filepath: str):
        self.data = DataUtils.read_and_validate_data(filepath, [Ticket, Message], ["tickets", "messages"])

        # Set message attribute for each ticket
        for ticket_id, ticket in self.data["tickets"].items():
            self.data["tickets"][ticket_id].msg = self.__get_message(ticket.msg_id)

    def get_tickets(self, page: int, page_size: int, **filter_arguments) -> list[dict]:
        tickets_filtered = [ticket for ticket in self.data["tickets"].values() if ticket.filter(**filter_arguments)]
        return ListUtils.get_paginated_list(lst=tickets_filtered, page=page, page_size=page_size)

    def get_ticket_counts(self) -> dict[Status, int]:
        return Counter(ticket.status for ticket in self.data["tickets"].values())

    def get_ticket(self, ticket_id: str) -> Ticket:
        if ticket_id not in self.data["tickets"]:
            raise NotFoundException("ticket", ticket_id)

        return self.data["tickets"][ticket_id]

    def __get_message(self, message_id: str) -> Message:
        if message_id not in self.data["messages"]:
            raise NotFoundException("message", message_id)

        return self.data["messages"][message_id]

    def get_ticket_context_messages(self, ticket_id: str) -> list[Message]:
        ticket = self.get_ticket(ticket_id)

        return [
            self.__get_message(message_id)
            for message_id in ticket.context_messages
        ]

    def __update_ticket_status(self, ticket_id: str, new_status: Status) -> Ticket:
        ticket = self.get_ticket(ticket_id)

        ticket.status = new_status
        ticket.ts_last_status_change = datetime.now()

        return ticket

    def close_ticket(self, ticket_id: str) -> Ticket:
        return self.__update_ticket_status(ticket_id, Status.CLOSED)

    def remove_ticket(self, ticket_id: str) -> Ticket:
        return self.__update_ticket_status(ticket_id, Status.REMOVED)
