from fastapi import status as http_status
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthz():
    response = client.get("/healthz")

    assert response.status_code == http_status.HTTP_200_OK
    assert response.text.strip('"\n') == "OK"
