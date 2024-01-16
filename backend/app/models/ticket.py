from datetime import datetime
from typing import Optional

from app.models.base_object import BaseObject
from app.models.enums.status import Status


class Ticket(BaseObject):
    msg_id: str
    status: Status
    resolved_by: Optional[str] = None
    ts_last_status_change: Optional[datetime] = None
    timestamp: datetime
    context_messages: list[str]
