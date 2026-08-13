#!/usr/bin/env python3
"""
Complete SkillGraph Setup & Test Script
Runs all setup, seeding, and testing steps
"""
import subprocess
import sys
import os
from pathlib import Path

def run_cmd(cmd, description, cwd=None):
    """Run a shell command with error handling"""
    print(f"\n{'='*70}")
    print(f">>> {description}")
    print(f"{'='*70}")
    print(f"Command: {cmd}\n")
    
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=False)
        if result.returncode != 0:
            print(f"\n⚠️  FAILED: {description}")
            return False
        print(f"\n✓ SUCCESS: {description}")
        return True
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

def main():
    backend_dir = Path(__file__).parent.resolve()
    project_root = backend_dir.parent
    
    print("\n" + "="*70)
    print("🚀 SkillGraph Complete Setup & Test")
    print("="*70)
    print(f"Project Root: {project_root}")
    print(f"Backend Root: {backend_dir}")
    
    # Step 1: Check for .env
    env_file = backend_dir / ".env"
    if not env_file.exists():
        print("\n❌ FATAL: backend/.env not found!")
        print("   Please create backend/.env from backend/.env.example with your CognoDB credentials")
        print("   Do NOT paste password in chat!")
        return 1
    print(f"✓ Found backend/.env")
    
    # Step 2: Create venv
    venv_dir = backend_dir / ".venv"
    if not venv_dir.exists():
        if not run_cmd(f"{sys.executable} -m venv .venv", "Creating virtual environment", cwd=backend_dir):
            return 1
    else:
        print(f"✓ Virtual environment already exists")
    
    # Detect activation command
    if sys.platform == 'win32':
        activate_cmd = ".venv\\Scripts\\activate &&"
    else:
        activate_cmd = ". .venv/bin/activate &&"
    
    # Step 3: Install dependencies
    if not run_cmd(f"{activate_cmd} pip install -r requirements.txt", "Installing Python dependencies", cwd=backend_dir):
        return 1
    
    # Step 4: Run seed
    print("\n" + "="*70)
    print("⚠️  SEED SCRIPT WARNING")
    print("="*70)
    print("The seed script will CLEAR all data in your CognoDB instance")
    print("and then populate it with realistic sample data.")
    print("This is only safe to run on a dev/test instance!")
    proceed = input("\nProceed with seeding? (y/n): ").lower().strip()
    
    if proceed == 'y':
        if not run_cmd(f"{activate_cmd} python backend/scripts/seed.py", "Seeding database", cwd=backend_dir):
            print("\n⚠️  Seed failed. Check CognoDB credentials and instance status.")
            return 1
    else:
        print("Skipped seed script.")
    
    # Step 5: Run tests
    print("\n" + "="*70)
    print("Running pytest...")
    print("="*70)
    if not run_cmd(f"{activate_cmd} pytest -v backend/tests/", "Running backend tests", cwd=backend_dir):
        print("\n⚠️  Some tests failed. This may be OK if database is not yet seeded.")
        proceed = input("Continue anyway? (y/n): ").lower().strip()
        if proceed != 'y':
            return 1
    
    # Step 6: Backend server (background)
    print("\n" + "="*70)
    print("✓ Setup Complete!")
    print("="*70)
    print("""
To start the backend server, run:

    cd backend
    # Activate venv:
    # Windows:  .venv\\Scripts\\Activate.ps1
    # Mac/Linux: source .venv/bin/activate
    
    # Start server:
    uvicorn backend.app.main:app --reload
    
    Backend will be at: http://localhost:8000
    API docs at: http://localhost:8000/docs
    Health check: http://localhost:8000/health

To start the frontend (in another terminal):

    cd frontend
    npm install
    npm run dev
    
    Frontend will be at: http://localhost:5173
    """)
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
