from fastapi import HTTPException, status as http_status


class GenericException(HTTPException):

    def __init__(self, detail: str):
        super().__init__(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )
