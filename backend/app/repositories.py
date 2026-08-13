from .database import driver
from . import queries
import logging

logger = logging.getLogger(__name__)


def _node_to_dict(node):
    if node is None:
        return None
    # Neo4j Node has .items() or ._properties in older versions
    try:
        return dict(node.items())
    except Exception:
        # fallback
        return dict(node)


def _record_to_dict(record):
    # Convert a neo4j Record to a plain dict
    out = {}
    for k, v in record.items():
        # if value is a Node
        try:
            from neo4j.graph import Node
            if isinstance(v, Node):
                out[k] = _node_to_dict(v)
            else:
                out[k] = v
        except Exception:
            out[k] = v
    return out


def get_candidate(candidate_id: str):
    with driver().session() as session:
        result = session.run(queries.candidate_lookup, {'candidate_id': candidate_id})
        record = result.single()
        if not record:
            return None
        return _record_to_dict(record)


def get_candidate_skills(candidate_id: str):
    with driver().session() as session:
        result = session.run(queries.candidate_skills, {'candidate_id': candidate_id})
        rows = []
        for r in result:
            rows.append({'skill_id': r['skill_id'], 'skill_name': r['skill_name'], 'level': r.get('level'), 'years': r.get('years')})
        return rows


def find_jobs_multi_hop(candidate_id: str, limit: int = 20):
    with driver().session() as session:
        result = session.run(queries.multi_hop_jobs, {'candidate_id': candidate_id, 'limit': limit})
        out = []
        for r in result:
            out.append({'job': _node_to_dict(r['job']), 'company': _node_to_dict(r['company']), 'matchingSkills': r.get('matchingSkills'), 'matchCount': r.get('matchCount')})
        return out


def recommend_jobs(candidate_id: str, limit: int = 30):
    with driver().session() as session:
        result = session.run(queries.recommendation_query, {'candidate_id': candidate_id, 'limit': limit})
        out = []
        for r in result:
            # r[0] is a map projection representing job
            job_map = r[0]
            out.append(job_map)
        return out


def companies_with_skill_and_jobs(skill_id: str, limit: int = 10):
    with driver().session() as session:
        result = session.run(queries.companies_with_skill_and_jobs, {'skill_id': skill_id, 'limit': limit})
        return [dict(r) for r in result]


def list_candidates(limit: int = 100):
    with driver().session() as session:
        result = session.run(queries.candidates_list, {'limit': limit})
        out = []
        for r in result:
            out.append({'id': r['id'], 'name': r['name'], 'title': r.get('title'), 'years_experience': r.get('years_experience')})
        return out


def get_job(job_id: str):
    with driver().session() as session:
        result = session.run(queries.job_lookup, {'job_id': job_id})
        record = result.single()
        if not record:
            return None
        return _record_to_dict(record)
