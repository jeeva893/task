# Parameterised Cypher queries for SkillGraph

candidate_lookup = """
MATCH (c:Candidate {id: $candidate_id})
OPTIONAL MATCH (c)-[:LOCATED_IN]->(city:City)
OPTIONAL MATCH (c)-[w:WORKED_AT]->(comp:Company)
RETURN c AS candidate, city AS city, collect({company: comp, work: w}) AS work_history
"""

candidate_skills = """
MATCH (c:Candidate {id: $candidate_id})-[hs:HAS_SKILL]->(s:Skill)
RETURN s.id AS skill_id, s.name AS skill_name, hs.level AS level, hs.years AS years
ORDER BY hs.years DESC
"""

# Multi-hop traversal: Candidate -> Skill -> Job -> Company
multi_hop_jobs = """
MATCH (c:Candidate {id: $candidate_id})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job)-[:OFFERED_BY]->(co:Company)
RETURN j AS job, co AS company, collect(DISTINCT s.name) AS matchingSkills, count(DISTINCT s) AS matchCount
ORDER BY matchCount DESC, j.posted_at DESC
LIMIT $limit
"""

# Recommendation query using Skill.id for matching and computing missing skills
recommendation_query = """
MATCH (j:Job)-[:REQUIRES]->(rs:Skill)
WITH j, collect(rs.id) AS requiredSkillIds, collect(rs) AS requiredSkills
OPTIONAL MATCH (c:Candidate {id: $candidate_id})-[hs:HAS_SKILL]->(cs:Skill)
WITH j, requiredSkillIds, requiredSkills, collect(DISTINCT cs.id) AS candidateSkillIds, collect(DISTINCT cs) AS candidateSkills
WITH j, requiredSkills, requiredSkillIds, candidateSkills, candidateSkillIds,
     [id IN requiredSkillIds WHERE id IN candidateSkillIds] AS matchingIds,
     [id IN requiredSkillIds WHERE NOT id IN candidateSkillIds] AS missingIds
RETURN j { .*, matchCount: size(matchingIds), requiredCount: size(requiredSkillIds),
           matching: [id IN matchingIds | head([s IN requiredSkills WHERE s.id = id]).name],
           missing: [id IN missingIds   | head([s IN requiredSkills WHERE s.id = id]).name],
           matchPercent: CASE WHEN size(requiredSkillIds)=0 THEN 0 ELSE (toFloat(size(matchingIds)) / toFloat(size(requiredSkillIds))) * 100 END }
ORDER BY j.matchPercent DESC, j.posted_at DESC
LIMIT $limit
"""

# Graph-native query awkward in SQL: companies that employ candidates with a given skill and have jobs requiring related skills
companies_with_skill_and_jobs = """
MATCH (s:Skill {id: $skill_id})<-[:HAS_SKILL]-(cand:Candidate)-[:WORKED_AT]->(co:Company)
MATCH (co)<-[:OFFERED_BY]-(job:Job)-[:REQUIRES]->(r:Skill)
WHERE r <> s
RETURN distinct co AS company, collect(DISTINCT job.title)[0..10] AS sampleJobs, collect(DISTINCT r.name)[0..10] AS relatedSkills
LIMIT $limit
"""

# Candidates list
candidates_list = """
MATCH (c:Candidate)
RETURN c.id AS id, c.name AS name, c.title AS title, c.years_experience AS years_experience
ORDER BY c.name
LIMIT $limit
"""

# Job lookup
job_lookup = """
MATCH (j:Job {id: $job_id})
OPTIONAL MATCH (j)-[:OFFERED_BY]->(co:Company)
OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
RETURN j AS job, co AS company, collect(s.name) AS requiredSkills
"""

