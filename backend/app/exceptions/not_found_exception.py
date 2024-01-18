from fastapi import HTTPException, status as http_status


class NotFoundException(HTTPException):

    def __init__(self, context: str, identifier: str):
        super().__init__(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"{context.capitalize()} with ID {identifier} does not exist."
        )
