from datetime import datetime
from collections import Counter
from typing import Union

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

    def get_tickets(self, page: int, page_size: int, **filter_arguments) -> dict[str, Union[int, list[Ticket]]]:
        """
        Get paginated response of tickets with optional filters.

        Parameters:
        - page (int): Page number.
        - page_size (int): Number of items per page.
        - **filter_arguments: Optional filters for tickets.

        Returns:
        dict[str, Union[int, list[Ticket]]]: Paginated list of tickets along with the total ticket count.
        """
        tickets_filtered = [ticket for ticket in self.data["tickets"].values() if ticket.filter(**filter_arguments)]

        return {
            "ticket_count": len(tickets_filtered),
            "tickets": ListUtils.get_paginated_list(lst=tickets_filtered, page=page, page_size=page_size)
        }

    def get_ticket_counts(self) -> dict[Status, int]:
        """
        Get ticket counts per each status.

        Returns:
        dict[Status, int]: A dictionary containing each status and their respective ticket counts.
        """
        return Counter(ticket.status for ticket in self.data["tickets"].values())

    def get_ticket(self, ticket_id: str) -> Ticket:
        """
        Get a ticket by its ID.

        Parameters:
        - ticket_id (str): ID of the ticket.

        Returns:
        Ticket: The ticket with the given ID.

        Raises:
        NotFoundException: If the ticket with the given ID is not found.
        """
        if ticket_id not in self.data["tickets"]:
            raise NotFoundException("ticket", ticket_id)

        return self.data["tickets"][ticket_id]

    def __get_message(self, message_id: str) -> Message:
        """
        Get a message by its ID.

        Parameters:
        - message_id (str): ID of the message.

        Returns:
        Message: The message with the given ID.

        Raises:
        NotFoundException: If the message with the given ID is not found.
        """
        if message_id not in self.data["messages"]:
            raise NotFoundException("message", message_id)

        return self.data["messages"][message_id]

    def get_ticket_context_messages(self, ticket_id: str) -> list[Message]:
        """
        Get context messages associated with a ticket by ID.

        Parameters:
        - ticket_id (str): ID of the ticket.

        Returns:
        list[Message]: Context messages associated with the ticket with the given ID.
        """
        ticket = self.get_ticket(ticket_id)

        return [
            self.__get_message(message_id)
            for message_id in ticket.context_messages
        ]

    def __update_ticket_status(self, ticket_id: str, new_status: Status) -> Ticket:
        """
        Update the status of a ticket.

        Parameters:
        - ticket_id (str): ID of the ticket.
        - new_status (Status): New status to set for the ticket.

        Returns:
        Ticket: The updated ticket response after setting its status.
        """
        ticket = self.get_ticket(ticket_id)

        ticket.status = new_status
        ticket.ts_last_status_change = datetime.now()

        return ticket

    def close_ticket(self, ticket_id: str) -> Ticket:
        """
        Closes a ticket by updating its status to 'CLOSED'.

        Parameters:
        - ticket_id (str): The unique identifier of the ticket.

        Returns:
        Ticket: The updated ticket with the 'CLOSED' status.
        """
        return self.__update_ticket_status(ticket_id, Status.CLOSED)

    def remove_ticket(self, ticket_id: str) -> Ticket:
        """
        Removes a ticket by updating its status to 'REMOVED'.

        Parameters:
        - ticket_id (str): The unique identifier of the ticket.

        Returns:
        Ticket: The updated ticket with the 'REMOVED' status.
        """
        return self.__update_ticket_status(ticket_id, Status.REMOVED)
