#!/bin/bash
# SkillGraph macOS/Linux Setup Script
# Run this from the project root directory

set -e  # Exit on error

echo ""
echo "============================================================"
echo "SkillGraph - macOS/Linux Setup Script"
echo "============================================================"
echo ""

# Check if in correct directory
if [ ! -d "backend" ]; then
    echo "ERROR: backend directory not found!"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check .env exists
if [ ! -f "backend/.env" ]; then
    echo "ERROR: backend/.env not found!"
    echo "Please create backend/.env from backend/.env.example"
    echo "with your CognoDB credentials"
    exit 1
fi

echo "[1/5] Creating virtual environment..."
cd backend
python3 -m venv .venv

echo "[2/5] Activating virtual environment and installing dependencies..."
source .venv/bin/activate
pip install -r requirements.txt

echo ""
echo "[3/5] Running seed script..."
echo "WARNING: This will clear your CognoDB database!"
read -p "Proceed with seeding? (y/n): " seed_confirm
if [ "$seed_confirm" = "y" ] || [ "$seed_confirm" = "Y" ]; then
    python3 backend/scripts/seed.py || echo "WARNING: Seed failed - check your CognoDB credentials"
else
    echo "Skipped seed script"
fi

echo ""
echo "[4/5] Running tests..."
pytest -v backend/tests/ || {
    read -p "Some tests failed - continue anyway? (y/n): " continue_anyway
    if [ "$continue_anyway" != "y" ] && [ "$continue_anyway" != "Y" ]; then
        exit 1
    fi
}

echo ""
echo "============================================================"
echo "[5/5] Setup Complete!"
echo "============================================================"
echo ""
echo "To start the backend server, open a new terminal and run:"
echo ""
echo "  cd backend"
echo "  source .venv/bin/activate"
echo "  uvicorn backend.app.main:app --reload"
echo ""
echo "Backend will be at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"
echo ""
echo "To start the frontend, open another terminal and run:"
echo ""
echo "  cd frontend"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "Frontend will be at: http://localhost:5173"
echo ""
