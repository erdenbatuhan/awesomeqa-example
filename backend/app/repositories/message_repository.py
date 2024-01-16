from typing import List

from app.models.message import Message

from app.utils.data_utils import DataUtils

from app.exceptions.not_found_exception import NotFoundException


class MessageRepository:

    def __init__(self, filepath: str):
        self.data = DataUtils.read_and_validate_data(filepath, Message, "messages")

    def get_message(self, message_id: str) -> Message:
        if message_id not in self.data:
            raise NotFoundException("message", message_id)

        return self.data[message_id]

    def get_messages_by_ids(self, message_ids: List[str]) -> List[Message]:
        return [self.get_message(message_id) for message_id in message_ids]
