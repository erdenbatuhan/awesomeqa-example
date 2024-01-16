from enum import Enum


class Status(str, Enum):
    OPEN = "open"
    RESOLVED = "resolved"
    DELETED = "deleted"
