#!/usr/bin/env python3
"""
Setup script to prepare backend environment for testing.
Creates venv, installs dependencies, runs tests.
"""
import subprocess
import sys
import os

def run_cmd(cmd, description):
    """Run a shell command and report results."""
    print(f"\n{'='*60}")
    print(f">>> {description}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"⚠ {description} failed with return code {result.returncode}")
    return result.returncode == 0

def main():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    print("SkillGraph Backend Setup")
    print("="*60)
    
    # Create venv
    venv_dir = os.path.join(backend_dir, '.venv')
    if not os.path.exists(venv_dir):
        if not run_cmd(f'{sys.executable} -m venv .venv', 'Creating virtual environment'):
            return 1
    else:
        print("Virtual environment already exists.")
    
    # Detect activation script
    if sys.platform == 'win32':
        activate_cmd = '.venv\\Scripts\\activate &&'
    else:
        activate_cmd = '. .venv/bin/activate &&'
    
    # Install dependencies
    if not run_cmd(f'{activate_cmd} pip install -r requirements.txt', 'Installing dependencies'):
        return 1
    
    # Check for .env
    if not os.path.exists('.env'):
        print("\n⚠ backend/.env not found!")
        print("  Please create backend/.env from backend/.env.example with your CognoDB credentials.")
        print("  Then run this script again.")
        return 1
    
    # Run seed
    print("\n" + "="*60)
    print(">>> Run seed script (this will clear your CognoDB dev database)")
    print("="*60)
    seed_choice = input("Run seed? (y/n): ").lower()
    if seed_choice == 'y':
        if not run_cmd(f'{activate_cmd} python backend/scripts/seed.py', 'Running seed script'):
            print("⚠ Seed failed. Check CognoDB credentials and instance running.")
            return 1
    
    # Run tests
    print("\n" + "="*60)
    print(">>> Running backend tests")
    print("="*60)
    if not run_cmd(f'{activate_cmd} pytest -v', 'Running tests'):
        print("⚠ Some tests failed.")
        return 1
    
    print("\n" + "="*60)
    print("✓ Backend setup complete!")
    print("="*60)
    print(f"\nTo start the backend, activate the venv and run:")
    print(f"  {activate_cmd} uvicorn backend.app.main:app --reload")
    return 0

if __name__ == '__main__':
    sys.exit(main())
