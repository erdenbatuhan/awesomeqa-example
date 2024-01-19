from datetime import datetime
from typing import Optional

from .base_object import BaseObject
from .message import Message
from .enums.status import Status


class Ticket(BaseObject):

    msg_id: str
    msg: Optional[Message] = None
    status: Status
    resolved_by: Optional[str] = None
    ts_last_status_change: Optional[datetime] = None
    timestamp: datetime
    context_messages: list[str]

    def filter(self, **kwargs) -> bool:
        """
        Filters the ticket based on the provided keyword arguments.

        Parameters:
        - **kwargs: Filtering criteria for author, message content, status, timestamp range.

        Returns:
        bool: True if the ticket passes all filters, False otherwise.
        """
        return all([
            kwargs.get('author') is None or (
                self.msg is not None and kwargs.get('author').lower() in self.msg.author.name.lower()
            ),
            kwargs.get('msg_content') is None or (
                self.msg is not None and kwargs.get('msg_content').lower() in self.msg.content.lower()
            ),
            kwargs.get('status') is None or (
                self.status in kwargs.get('status')
            ),
            kwargs.get('timestamp_start') is None or kwargs.get('timestamp_start') <= self.timestamp,
            kwargs.get('timestamp_end') is None or self.timestamp <= kwargs.get('timestamp_end')
        ])
