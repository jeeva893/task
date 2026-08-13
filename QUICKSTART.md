# SkillGraph - Quick Start Guide

This document provides step-by-step instructions to get SkillGraph running locally on your machine.

## Prerequisites

Ensure you have installed:
- **Python 3.11+** (check: `python --version` or `python3 --version`)
- **Node.js 16+** (check: `node --version`)
- **npm or pnpm** (check: `npm --version`)

## 1. Prepare CognoDB Credentials

Before anything else, you need your CognoDB connection details.

**If you haven't created a CognoDB instance yet:**
1. Go to https://console.cognodb.com/signup
2. Create a free account (no credit card required)
3. Create a free (c0) instance in your region
4. Wait ~1 minute for provisioning
5. Copy the connection string: `bolt+s://db-XXXXX.databases.cognodb.com`
6. Copy the generated password for user "cognodb" (shown once!)

**⚠️ SECURITY**: Never paste the password in chat, GitHub, or any public place.

## 2. Create `backend/.env`

In the `backend/` directory, create a file named `.env` (exactly):

```
COGNODB_URI=bolt+s://db-0b19e9c1.databases.cognodb.com
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<your-password-here>
BACKEND_PORT=8000
```

Replace the URI and password with YOUR credentials.

**⚠️ NEVER commit this file to Git. It's already in `.gitignore`.**

## 3. Backend Setup

### Windows PowerShell

```powershell
cd backend

# Create virtual environment
python -m venv .venv

# Activate it
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run the setup script (handles everything: seed + tests + summary)
python run_setup.py

# OR run steps manually:

# Seed the database (CLEARS existing data - use only on dev instance)
python backend\scripts\seed.py

# Run tests
pytest -v backend\tests\

# Start the backend server
uvicorn backend.app.main:app --reload
```

### macOS / Linux

```bash
cd backend

# Create virtual environment
python3 -m venv .venv

# Activate it
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the setup script
python3 run_setup.py

# OR run steps manually:

# Seed the database
python3 backend/scripts/seed.py

# Run tests
pytest -v backend/tests/

# Start the backend server
uvicorn backend.app.main:app --reload
```

**Expected output when backend starts:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Verify backend is working:**
- Open http://localhost:8000/health (should return `{"status": "ok"}`)
- Open http://localhost:8000/docs (should show Swagger UI)

## 4. Frontend Setup

In a **new terminal**, from the project root:

### Windows PowerShell
```powershell
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env if needed (default points to http://localhost:8000/api)

# Start development server
npm run dev
```

### macOS / Linux
```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env if needed

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v4.4.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

**Open http://localhost:5173 in your browser.**

## 5. Test the Application

1. **Dashboard** should load with a list of candidates
2. **Click a candidate** to view their profile
3. **View skills** - should show proficiency levels
4. **Click "Find Jobs"** to get recommendations
5. **View recommendations** - jobs ranked by match %
6. **Green badges** = matching skills
7. **Yellow badges** = missing skills
8. **Click a job** to see details
9. **Back buttons** should work correctly
10. **Try error state**: Stop backend and refresh frontend (should show error)

## 6. Backend API Endpoints

Test these endpoints in browser or with curl:

```bash
# Health check
curl http://localhost:8000/health

# List candidates
curl http://localhost:8000/api/candidates

# Get a candidate (replace with real ID from list)
curl http://localhost:8000/api/candidates/{id}

# Get candidate skills
curl http://localhost:8000/api/candidates/{id}/skills

# Get recommendations
curl http://localhost:8000/api/candidates/{id}/recommendations

# Get job details
curl http://localhost:8000/api/jobs/{id}
```

All endpoints documented at: **http://localhost:8000/docs**

## 7. Verify Tests Pass

From `backend/` directory (with venv activated):

```bash
pytest -v
```

Expected: All tests pass (or skip if missing env config)

## 8. Screenshots & Demo

For submission, capture:
- Dashboard with candidates
- Candidate profile with skills
- Recommendations with match %
- Job details page

Record a 2-minute demo showing:
1. Select candidate
2. View profile
3. Click Find Jobs
4. View recommendations
5. Click job details
6. Explain graph advantage

## 9. Build Frontend for Production

When ready to deploy:

```bash
cd frontend
npm run build
# Output: dist/ folder ready to deploy
```

## 10. Deployment (Free Tiers)

### Deploy Backend (FastAPI)
Use **Railway.app** (recommended):
1. Create account at railway.app
2. Connect GitHub repo (or use Railway CLI)
3. Set environment variables:
   - `COGNODB_URI`
   - `COGNODB_PASSWORD`
4. Deploy
5. Note the deployed URL (e.g., `https://skillgraph-backend.railway.app`)

### Deploy Frontend (React)
Use **Vercel** (recommended):
1. Create account at vercel.com
2. Connect GitHub repo
3. Set environment variable:
   - `VITE_API_URL=https://skillgraph-backend.railway.app/api`
4. Deploy
5. Note the frontend URL

## 11. Troubleshooting

### "Cannot find module 'fastapi'"
```bash
# Ensure venv is activated, then:
pip install -r requirements.txt
```

### "Cannot connect to CognoDB"
- Check `backend/.env` has correct URI and password
- Verify instance is running in console.cognodb.com
- Check firewall/network allows outbound connections

### "No candidates in dashboard"
- Verify seed script ran: `python backend/scripts/seed.py`
- Check CognoDB console to see if data exists
- Restart backend after seeding

### "CORS error" (frontend can't reach backend)
- Verify backend is running on `http://localhost:8000`
- Check `frontend/.env` has correct `VITE_API_URL`
- Check browser console for exact error

### Tests fail
If tests skip with "COGNODB credentials not configured", that's OK.
Just ensure:
1. `backend/.env` is created and filled
2. Backend server can start without errors
3. Manual API tests work in browser

## 12. Next Steps

1. ✅ Run backend setup (step 3)
2. ✅ Run frontend setup (step 4)
3. ✅ Test the app (step 5)
4. ✅ Take screenshots (step 8)
5. ✅ Record demo (step 8)
6. ✅ Deploy to Railway + Vercel (step 10)
7. ✅ Create GitHub repo
8. ✅ Email submission to hr@wexa.ai

## File Locations Reference

- **Backend server**: `backend/app/main.py`
- **Database layer**: `backend/app/database.py`
- **Cypher queries**: `backend/app/queries.py`
- **Seed script**: `backend/scripts/seed.py`
- **Frontend pages**: `frontend/src/pages/`
- **API client**: `frontend/src/api.ts`
- **Styles**: `frontend/src/styles.css`

## Important Files

```
✅ backend/requirements.txt - All Python dependencies
✅ backend/.env.example - Environment template
✅ backend/run_setup.py - Automated setup script
✅ frontend/package.json - Node dependencies
✅ frontend/.env.example - Frontend env template
✅ README.md - Full project documentation
✅ IMPLEMENTATION_STATUS.md - Detailed status & checklist
```

---

**Everything is ready! Follow the steps above and the app will run locally.** 🚀

Need help? Check IMPLEMENTATION_STATUS.md for the complete requirement checklist.
