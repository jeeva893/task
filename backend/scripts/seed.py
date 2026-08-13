"""
Seed script for SkillGraph demo.
This is deterministic but creates a modest realistic dataset suitable for a free CognoDB instance.
It creates constraints, nodes and relationships. It is idempotent: it first clears the database.
WARNING: This will DELETE all data in the connected database; run only on a dev/test instance.
"""
import random
import uuid
from datetime import datetime, timedelta
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

load_dotenv()

URI = os.environ.get('COGNODB_URI')
USER = os.environ.get('COGNODB_USERNAME', 'cognodb')
PASSWORD = os.environ.get('COGNODB_PASSWORD')

if not URI or not PASSWORD:
    raise SystemExit('Please set COGNODB_URI and COGNODB_PASSWORD in environment (do not commit secrets).')

driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))


def clear_db(tx):
    tx.run('MATCH (n) DETACH DELETE n')


def create_constraints(tx):
    tx.run("CREATE CONSTRAINT IF NOT EXISTS FOR (c:Candidate) REQUIRE c.id IS UNIQUE")
    tx.run("CREATE CONSTRAINT IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE")
    tx.run("CREATE CONSTRAINT IF NOT EXISTS FOR (j:Job) REQUIRE j.id IS UNIQUE")
    tx.run("CREATE CONSTRAINT IF NOT EXISTS FOR (co:Company) REQUIRE co.id IS UNIQUE")


def seed():
    with driver.session() as session:
        print('Clearing database...')
        session.write_transaction(clear_db)
        print('Creating constraints...')
        session.write_transaction(create_constraints)

        cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune']
        industries = ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'SaaS']

        # Realistic skills
        skills_data = [
            'React', 'TypeScript', 'Node.js', 'REST API', 'Git', 'GraphQL',
            'Python', 'Java', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL',
            'JavaScript', 'Vue.js', 'Angular', 'SQL', 'Redis', 'Kubernetes'
        ]
        
        # Realistic companies
        company_names = [
            'Acme Technologies', 'TechCorp', 'Innovate Labs', 'Digital Solutions',
            'Cloud Systems', 'DataFlow Inc', 'NextGen Software', 'Quantum AI',
            'Smart Systems', 'Prime Tech'
        ]
        
        # Realistic candidate names (Indian)
        candidate_names = [
            'Arun Kumar', 'Priya Sharma', 'Rajesh Singh', 'Neha Patel',
            'Amit Verma', 'Deepti Gupta', 'Vikram Joshi', 'Anjali Reddy',
            'Rohan Desai', 'Sneha Iyer', 'Arjun Nair', 'Pooja Menon',
            'Sanjay Kumar', 'Ritika Sharma', 'Nitin Chopra'
        ]
        
        # Realistic job titles
        job_titles = [
            'Senior React Developer', 'Full Stack Engineer', 'Backend Developer',
            'Frontend Developer', 'DevOps Engineer', 'Cloud Architect',
            'Technical Lead', 'Senior Backend Developer', 'Mid-Level Frontend Engineer',
            'Junior Software Engineer'
        ]

        companies = []
        for i, name in enumerate(company_names):
            cid = str(uuid.uuid4())
            companies.append({
                'id': cid,
                'name': name,
                'industry': random.choice(industries),
                'city': random.choice(cities)
            })

        candidates = []
        for name in candidate_names:
            candidates.append({
                'id': str(uuid.uuid4()),
                'name': name,
                'title': random.choice(['Software Engineer', 'Senior Engineer', 'Technical Lead', 'Developer']),
                'years_experience': random.randint(1, 15),
                'city': random.choice(cities)
            })

        jobs = []
        for title in job_titles:
            jid = str(uuid.uuid4())
            jobs.append({
                'id': jid,
                'title': title,
                'company': random.choice(companies),
                'city': random.choice(cities),
                'posted_at': (datetime.utcnow() - timedelta(days=random.randint(0, 200))).isoformat()
            })

        # Create nodes
        print('✓ Creating cities...')
        for city in set(cities):
            session.run('CREATE (:City {name: $name})', {'name': city})
        print('✓ Creating industries...')
        for ind in industries:
            session.run('CREATE (:Industry {name: $name})', {'name': ind})
        print('✓ Creating skills...')
        for s in skills_data:
            session.run('CREATE (:Skill {id: $id, name: $name})', {'id': s.replace(' ', '_').lower(), 'name': s})
        print('✓ Creating companies...')
        for co in companies:
            session.run('CREATE (:Company {id: $id, name: $name, industry: $industry})', co)
        print('✓ Creating candidates...')
        for c in candidates:
            session.run('CREATE (:Candidate {id: $id, name: $name, title: $title, years_experience: $years_experience})', c)
        print('✓ Creating jobs...')
        for j in jobs:
            session.run('CREATE (:Job {id: $id, title: $title, posted_at: $posted_at})', {'id': j['id'], 'title': j['title'], 'posted_at': j['posted_at']})

        # Create relationships: companies located in cities, company industries
        print('✓ Creating company relationships...')
        for co in companies:
            session.run("MATCH (c:Company {id:$id}), (city:City {name:$city}) CREATE (c)-[:LOCATED_IN]->(city)", {'id': co['id'], 'city': co['city']})
            session.run("MATCH (c:Company {id:$id}), (ind:Industry {name:$industry}) CREATE (c)-[:IN_INDUSTRY]->(ind)", {'id': co['id'], 'industry': co['industry']})

        # Jobs offered by companies and located in cities, and require random skills
        print('✓ Creating job relationships...')
        for i, j in enumerate(jobs):
            if (i + 1) % 5 == 0:
                print(f'  Processing jobs {i + 1}/{len(jobs)}...')
            co = j['company']
            session.run("MATCH (job:Job {id:$jid}), (co:Company {id:$cid}) CREATE (job)-[:OFFERED_BY]->(co)", {'jid': j['id'], 'cid': co['id']})
            session.run("MATCH (job:Job {id:$jid}), (city:City {name:$city}) CREATE (job)-[:LOCATED_IN]->(city)", {'jid': j['id'], 'city': j['city']})
            required = random.sample(skills_data, k=random.randint(3, 7))
            for rs in required:
                skill_id = rs.replace(' ', '_').lower()
                session.run("MATCH (job:Job {id:$jid}), (s:Skill {id:$sid}) CREATE (job)-[:REQUIRES]->(s)", {'jid': j['id'], 'sid': skill_id})

        # Candidates have skills and worked_at some companies
        print('✓ Creating candidate relationships...')
        for i, c in enumerate(candidates):
            if (i + 1) % 5 == 0:
                print(f'  Processing candidates {i + 1}/{len(candidates)}...')
            owned_skills = random.sample(skills_data, k=random.randint(5, 10))
            for s in owned_skills:
                lvl = random.choice(['Beginner', 'Intermediate', 'Expert'])
                yrs = random.randint(0, 10)
                skill_id = s.replace(' ', '_').lower()
                session.run("MATCH (cand:Candidate {id:$cid}), (s:Skill {id:$sid}) CREATE (cand)-[:HAS_SKILL {level:$lvl, years:$yrs}]->(s)", {'cid': c['id'], 'sid': skill_id, 'lvl': lvl, 'yrs': yrs})
            # work history
            w = random.choice(companies)
            session.run("MATCH (cand:Candidate {id:$cid}), (co:Company {id:$cid2}) CREATE (cand)-[:WORKED_AT {title:$title, from:2015, to:2020}]->(co)", {'cid': c['id'], 'cid2': w['id'], 'title': random.choice(['Software Engineer', 'Senior Engineer', 'Technical Lead'])})

        print('\n✅ Seeding complete! Database ready.')


if __name__ == '__main__':
    seed()
