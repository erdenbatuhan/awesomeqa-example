from pydantic import BaseModel
from datetime import datetime


class Author(BaseModel):
    id: str
    name: str
    nickname: str
    color: str
    discriminator: str
    avatar_url: str
    is_bot: bool
    timestamp_insert: datetime
