from typing import Optional
from datetime import datetime
from pydantic import BaseModel

from author import Author


class Message(BaseModel):
    id: str
    channel_id: str
    parent_channel_id: Optional[str] = None
    community_server_id: str
    timestamp: datetime
    has_attachment: bool
    reference_msg_id: Optional[str] = None
    timestamp_insert: datetime
    discussion_id: Optional[str]
    content: str
    msg_url: str
    # author_id: str
    author: Author
