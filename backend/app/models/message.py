from datetime import datetime
from typing import Optional

from app.models.base_object import BaseObject
from app.models.author import Author


class Message(BaseObject):
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
