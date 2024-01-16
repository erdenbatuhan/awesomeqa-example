from datetime import datetime

from app.models.base_object import BaseObject


class Author(BaseObject):
    name: str
    nickname: str
    color: str
    discriminator: str
    avatar_url: str
    is_bot: bool
    timestamp_insert: datetime
