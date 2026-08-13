export interface Candidate {
  id: string;
  name: string;
  title?: string;
  years_experience?: number;
}

export interface Skill {
  skill_id: string;
  skill_name: string;
  level?: string;
  years?: number;
}

export interface Recommendation {
  id: string;
  title: string;
  matchCount: number;
  requiredCount: number;
  matching: string[];
  missing: string[];
  matchPercent: number;
  [key: string]: any;
}

export interface Job {
  id: string;
  title: string;
  description?: string;
  company?: any;
  requiredSkills?: string[];
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
}
