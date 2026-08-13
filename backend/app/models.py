from pydantic import BaseModel
from typing import List, Optional, Any


class CandidateSummary(BaseModel):
    id: str
    name: str
    title: Optional[str]
    years_experience: Optional[int]


class SkillItem(BaseModel):
    skill_id: str
    skill_name: str
    level: Optional[str]
    years: Optional[int]


class Recommendation(BaseModel):
    id: str
    title: str
    matchCount: int
    requiredCount: int
    matching: List[str]
    missing: List[str]
    matchPercent: float


class JobDetail(BaseModel):
    id: str
    title: str
    description: Optional[str]
    company: Optional[Any]
