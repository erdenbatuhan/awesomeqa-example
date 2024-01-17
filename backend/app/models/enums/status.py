from enum import Enum


class Status(str, Enum):

    OPEN = "open"
    CLOSED = "closed"
    REMOVED = "removed"
