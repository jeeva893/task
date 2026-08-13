from fastapi import APIRouter, HTTPException
from .repositories import get_candidate, get_candidate_skills, recommend_jobs, list_candidates, get_job, find_jobs_multi_hop
from .models import SkillItem, Recommendation

router = APIRouter()


@router.get('/candidates/{candidate_id}')
def candidate_lookup(candidate_id: str):
    rec = get_candidate(candidate_id)
    if not rec:
        raise HTTPException(status_code=404, detail='Candidate not found')
    # return raw record content; service layer can format further
    return {'candidate': rec['candidate'], 'city': rec['city'], 'work_history': rec['work_history']}


@router.get('/candidates/{candidate_id}/skills')
def candidate_skills(candidate_id: str):
    rows = get_candidate_skills(candidate_id)
    return {'candidate_id': candidate_id, 'skills': rows}


@router.get('/candidates/{candidate_id}/recommendations')
def candidate_recommendations(candidate_id: str, limit: int = 20):
    try:
        rows = recommend_jobs(candidate_id, limit)
        # rows are job maps from the query
        return {'candidate_id': candidate_id, 'recommendations': rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/candidates')
def candidates_list(limit: int = 100):
    try:
        rows = list_candidates(limit)
        return {'candidates': rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/jobs/{job_id}')
def job_lookup(job_id: str):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    return {'job': job['job'], 'company': job.get('company'), 'requiredSkills': job.get('requiredSkills')}


@router.get('/health')
def api_health():
    try:
        # Reuse endpoint behavior from main health
        # This route is under /api/health for frontend compatibility
        from .database import driver
        d = driver()
        with d.session() as s:
            s.run('RETURN 1')
        return {'status': 'ok'}
    except Exception as e:
        return {'status': 'db-unreachable', 'error': str(e)}


@router.get('/candidates/{candidate_id}/multi-hop-jobs')
def candidate_multi_hop(candidate_id: str, limit: int = 20):
    try:
        rows = find_jobs_multi_hop(candidate_id, limit)
        return {'candidate_id': candidate_id, 'jobs': rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
