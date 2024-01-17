from datetime import datetime
from collections import Counter
from fastapi.testclient import TestClient

from app.main import app
from app.routes.ticket_routes import DEFAULT_PAGE, DEFAULT_PAGE_SIZE
from app.models.ticket import Ticket
from app.models.message import Message
from app.models.enums.status import Status
from app.exceptions.not_found_exception import NotFoundException
from app.utils.data_utils import DataUtils

client = TestClient(app)

mock_data = DataUtils.read_and_validate_data(
    filepath="../data/awesome_tickets.json",
    data_types=[Ticket, Message],
    data_keys=["tickets", "messages"]
)
mock_ticket_message_ids = [ticket.msg_id for ticket in mock_data["tickets"].values()]


def test_get_tickets():
    """
    Confirm that the default page size is correct and the response starts at the default page
    """

    first_expected_idx = DEFAULT_PAGE * DEFAULT_PAGE_SIZE
    first_expected_ticket = list(mock_data["tickets"].values())[first_expected_idx]

    response = client.get("/api/v1/tickets/")
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == DEFAULT_PAGE_SIZE
    assert response_data[0]["id"] == first_expected_ticket.id


def test_get_tickets_with_pagination():
    """
    Confirm that the response data matches the expected page size and starts at the given page
    """

    page, page_size = 12, 8
    first_expected_idx = page * page_size
    first_expected_ticket = list(mock_data["tickets"].values())[first_expected_idx]

    response = client.get("/api/v1/tickets/", params={"page": page, "page_size": page_size})
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == page_size
    assert response_data[0]["id"] == first_expected_ticket.id


def test_get_tickets_with_invalid_pagination():
    """
    Confirm that invalid pagination parameters result in a 422 Unprocessable Entity response
    """

    response = client.get("/api/v1/tickets/", params={"page": -5, "page_size": -10})
    response_data = response.json()

    assert response.status_code == 422
    assert len(response_data["detail"]) == 2
    assert sum([item["msg"] == "Input should be greater than or equal to 0" for item in response_data["detail"]]) == 2
    assert [item["loc"][1] for item in response_data["detail"]] == ["page", "page_size"]


def test_get_tickets_with_author_filter():
    """
    Confirm that only the given author's tickets are returned
    """

    author_name = "samuyal01"
    num_tickets_with_given_author = sum([
        mock_data["messages"][message_id].author.name == author_name
        for message_id in mock_ticket_message_ids
    ])

    response = client.get("/api/v1/tickets/", params={
        "page": 0, "page_size": num_tickets_with_given_author,
        "author": author_name
    })
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == num_tickets_with_given_author
    assert all([item["msg"]["author"]["name"] == author_name for item in response_data])


def test_get_tickets_with_msg_content_filter():
    """
    Confirm that the messages of all returned tickets contain the given message content
    """

    message_content = "NFT"
    num_messages_with_given_content = sum([
        message_content.lower() in mock_data["messages"][message_id].content.lower()
        for message_id in mock_ticket_message_ids
    ])

    response = client.get("/api/v1/tickets/", params={
        "page": 0, "page_size": num_messages_with_given_content,
        "msg_content": message_content
    })
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == num_messages_with_given_content
    assert all([message_content.lower() in item["msg"]["content"].lower() for item in response_data])


def test_get_tickets_with_status_filter():
    """
    Confirm that all returned tickets have the given status
    """

    status = Status.OPEN
    num_tickets_with_given_status = sum([
        ticket.status == status
        for ticket in mock_data["tickets"].values()
    ])

    response = client.get("/api/v1/tickets/", params={
        "page": 0, "page_size": num_tickets_with_given_status,
        "status": status.value
    })
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == num_tickets_with_given_status
    assert all([item["status"] == status for item in response_data])


def test_get_tickets_with_timestamp_filter():
    """
    Confirm that all returned tickets have timestamps within the given range
    """

    timestamp_start = datetime.strptime("2023-10-30T09:00:00", "%Y-%m-%dT%H:%M:%S")
    timestamp_end = datetime.strptime("2023-11-02T12:00:00", "%Y-%m-%dT%H:%M:%S")
    num_tickets_with_timestamps_within_given_range = sum([
        timestamp_start <= ticket.timestamp <= timestamp_end
        for ticket in mock_data["tickets"].values()
    ])

    response = client.get("/api/v1/tickets/", params={
        "page": 0, "page_size": num_tickets_with_timestamps_within_given_range,
        "timestamp_start": timestamp_start.isoformat(), "timestamp_end": timestamp_end.isoformat()
    })
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == num_tickets_with_timestamps_within_given_range
    assert all([
        timestamp_start <= datetime.fromisoformat(item["timestamp"]) <= timestamp_end
        for item in response_data
    ])


def test_get_ticket_counts():
    """
    Confirm that the response data contains ticket counts for each status
    """

    ticket_counts = Counter(ticket.status for ticket in mock_data["tickets"].values())

    response = client.get("/api/v1/tickets/counts")
    response_data = response.json()

    assert response.status_code == 200
    assert isinstance(response_data, dict)
    assert response_data == dict(ticket_counts)


def test_get_ticket():
    """
    Confirm that the response data contains the ticket with the given ID
    """

    ticket_id = list(mock_data["tickets"].keys())[0]

    response = client.get(f"/api/v1/tickets/{ticket_id}")
    response_data = response.json()

    assert response.status_code == 200
    assert isinstance(response_data, dict)
    assert response_data["id"] == ticket_id


def test_get_ticket_not_found():
    """
    Confirm that the response data indicates the ticket with the invalid given ID is not found
    """

    ticket_id = "INVALID_TICKET_ID"
    ticket_not_found_exception = NotFoundException("ticket", ticket_id)

    response = client.get(f"/api/v1/tickets/{ticket_id}")
    response_data = response.json()

    assert response.status_code == 404
    assert response_data["detail"] == ticket_not_found_exception.detail


def test_get_ticket_context_messages():
    """
    Confirm that the response data contains the context messages for the ticket with the given ID
    """

    ticket = list(mock_data["tickets"].values())[0]

    response = client.get(f"/api/v1/tickets/{ticket.id}/messages")
    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == len(ticket.context_messages)
    assert [message["id"] for message in response_data] == ticket.context_messages


def test_close_ticket():
    """
    Confirm that the response data contains the closed ticket with the given ID
    """

    ticket_id = list(mock_data["tickets"].keys())[0]

    response = client.put(f"/api/v1/tickets/{ticket_id}")
    response_data = response.json()

    assert response.status_code == 200
    assert response_data["id"] == ticket_id
    assert response_data["status"] == Status.CLOSED


def test_remove_ticket():
    """
    Confirm that the response data contains the removed ticket with the given ID
    """

    ticket_id = list(mock_data["tickets"].keys())[0]

    response = client.delete(f"/api/v1/tickets/{ticket_id}")
    response_data = response.json()

    assert response.status_code == 200
    assert response_data["id"] == ticket_id
    assert response_data["status"] == Status.REMOVED
