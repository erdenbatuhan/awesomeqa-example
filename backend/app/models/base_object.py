from pydantic import BaseModel


class BaseObject(BaseModel):
    id: str
