import os
import sys
import pytest
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Load env vars from backend/.env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

# Add backend directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Only import and create test client if we have valid CognoDB credentials
if os.getenv('COGNODB_URI') and os.getenv('COGNODB_PASSWORD'):
    from app.main import app
    client = TestClient(app)
else:
    client = None


@pytest.mark.skipif(client is None, reason="CognoDB credentials not configured")
def test_health_ok():
    """Test health endpoint when database is reachable."""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.json()
    assert 'status' in data


@pytest.mark.skipif(client is None, reason="CognoDB credentials not configured")
def test_candidates_list():
    """Test listing candidates."""
    response = client.get('/api/candidates?limit=10')
    assert response.status_code == 200
    data = response.json()
    assert 'candidates' in data
    assert isinstance(data['candidates'], list)


@pytest.mark.skipif(client is None, reason="CognoDB credentials not configured")
def test_candidate_lookup_invalid():
    """Test candidate lookup with invalid ID returns 404."""
    response = client.get('/api/candidates/invalid-uuid-that-does-not-exist')
    assert response.status_code == 404
    data = response.json()
    assert 'detail' in data


@pytest.mark.skipif(client is None, reason="CognoDB credentials not configured")
def test_candidate_skills_invalid():
    """Test candidate skills with invalid candidate."""
    response = client.get('/api/candidates/nonexistent-id/skills')
    assert response.status_code == 200
    # Returns empty skills list if candidate not found
    data = response.json()
    assert 'skills' in data


@pytest.mark.skipif(client is None, reason="CognoDB credentials not configured")
def test_candidate_recommendations_invalid():
    """Test recommendations with invalid candidate."""
    response = client.get('/api/candidates/nonexistent-id/recommendations')
    assert response.status_code == 200
    data = response.json()
    assert 'recommendations' in data


@pytest.mark.skipif(client is None, reason="CognoDB credentials not configured")
def test_job_lookup_invalid():
    """Test job lookup with invalid job ID returns 404."""
    response = client.get('/api/jobs/invalid-job-id')
    assert response.status_code == 404
    data = response.json()
    assert 'detail' in data
