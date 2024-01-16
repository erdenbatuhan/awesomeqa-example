from fastapi import HTTPException


class NotFoundException(HTTPException):

    def __init__(self, context: str, identifier: str):
        super().__init__(status_code=404, detail=f"{context.capitalize()} with ID {identifier} does not exist.")
