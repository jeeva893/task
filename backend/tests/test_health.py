import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.main import app

client = TestClient(app)


def test_health_no_env():
    # health should return db-unreachable if env not set; but endpoint must respond
    r = client.get('/health')
    assert r.status_code == 200
    assert 'status' in r.json()
