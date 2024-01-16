from typing import Optional
from datetime import datetime
from pydantic import BaseModel

from enums.status import Status


class Ticket(BaseModel):
    id: str
    msg_id: str
    status: Status
    resolved_by: Optional[str] = None
    ts_last_status_change: Optional[datetime] = None
    timestamp: datetime
    context_messages: list[str]
