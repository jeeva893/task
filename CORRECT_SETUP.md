# ✅ CORRECT SETUP INSTRUCTIONS

## 🚨 IMPORTANT: Run Commands from PROJECT ROOT, NOT from backend/

All commands must be run from: `c:\Users\NEXOVA3\Downloads\task`

---

## 📋 COMPLETE SETUP (Copy & Paste)

### Terminal 1 - Backend Setup

```powershell
# START HERE - Go to project root
cd c:\Users\NEXOVA3\Downloads\task

# Activate virtual environment (it already exists)
backend\.venv\Scripts\Activate.ps1

# Verify you're activated (prompt should show .venv)
# If activation fails, run this:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install/verify dependencies
pip install -r backend\requirements.txt

# Seed the database (creates test data)
python backend\scripts\seed.py

# Run tests
pytest -v backend\tests\

# Start the backend server (keep this running)
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
# Will show: INFO: Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2 - Frontend Setup (open NEW PowerShell)

```powershell
# Go to project root
cd c:\Users\NEXOVA3\Downloads\task

# Check if node_modules exists, if not install dependencies
if (!(Test-Path "frontend\node_modules")) {
    npm install
}

# If .env doesn't exist, create it
if (!(Test-Path "frontend\.env")) {
    copy frontend\.env.example frontend\.env
}

# Start frontend dev server (keep this running)
npm run dev
# Will show: Local: http://localhost:5173/
```

---

## ✅ VERIFICATION CHECKLIST

After both servers start:

1. **Backend running?**
   - Open http://localhost:8000/health
   - Should show: `{"status":"ok"}`

2. **Frontend running?**
   - Open http://localhost:5173
   - Should show: Candidate grid dashboard

3. **Database working?**
   - In app, check top-right corner
   - Should show: ✓ Database connected

4. **Can click candidates?**
   - Click any candidate face
   - Should see: Profile page with skills

5. **Can find jobs?**
   - Click "Find Jobs" button
   - Should see: Jobs ranked by match %

6. **Can view job details?**
   - Click any job
   - Should see: Full job information

---

## 🔧 TROUBLESHOOTING

### Error: "ModuleNotFoundError: No module named 'backend'"
**Cause:** Running from wrong directory or wrong Python
**Fix:**
```powershell
cd c:\Users\NEXOVA3\Downloads\task
backend\.venv\Scripts\Activate.ps1
# Check (venv) appears in prompt
which python
# Should show: C:\Users\NEXOVA3\Downloads\task\backend\.venv\Scripts\python.exe
```

### Error: "No such file or directory: backend\scripts\seed.py"
**Cause:** Running from inside backend/ directory
**Fix:**
```powershell
# Make sure you're here:
cd c:\Users\NEXOVA3\Downloads\task
# NOT here: cd c:\Users\NEXOVA3\Downloads\task\backend
```

### Error: "Permission denied: .venv\Scripts\python.exe"
**Cause:** Execution policy issue
**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
backend\.venv\Scripts\Activate.ps1
```

### "Cannot connect to database" message in app
**Cause:** Backend not running or database not seeded
**Fix:**
```powershell
# Verify backend is running (should see Uvicorn output)
# If backend stopped, restart it:
uvicorn backend.app.main:app --reload

# If database empty, reseed:
python backend\scripts\seed.py
```

### "Frontend cannot reach backend" error
**Cause:** Backend not running or port mismatch
**Fix:**
1. Verify backend is running: http://localhost:8000/health
2. Check frontend/.env:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```
3. Restart frontend: Stop (Ctrl+C) and run `npm run dev` again

---

## 📊 Expected Output

### Backend Terminal
```
(.venv) PS C:\Users\NEXOVA3\Downloads\task> pip install -r backend\requirements.txt
Requirement already satisfied: fastapi...
Requirement already satisfied: uvicorn...
...

(.venv) PS C:\Users\NEXOVA3\Downloads\task> python backend\scripts\seed.py
Clearing database...
Creating constraints...
Creating nodes and relationships...
✓ Seeding complete

(.venv) PS C:\Users\NEXOVA3\Downloads\task> pytest -v backend\tests\
test_health.py::test_health_ok PASSED
test_endpoints.py::test_candidates_list PASSED
...
6 passed in 2.34s

(.venv) PS C:\Users\NEXOVA3\Downloads\task> uvicorn backend.app.main:app --reload
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Frontend Terminal
```
> npm run dev

VITE v4.4.0  ready in 245 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Browser (http://localhost:5173)
```
SkillGraph
Dashboard | Database: ✓ Connected

[30 candidate faces in grid]
```

---

## 🎯 KEY POINTS

✅ **Always from project root**: `c:\Users\NEXOVA3\Downloads\task`
✅ **Activate venv first**: `backend\.venv\Scripts\Activate.ps1`
✅ **Use relative paths**: `backend\scripts\seed.py` (not `./backend/backend/scripts/seed.py`)
✅ **Keep both terminals open**: Backend AND frontend need to run simultaneously
✅ **Database status**: Check app's top-right corner

---

## 🚀 EVERYTHING SHOULD NOW WORK!

If you hit any other errors, let me know the exact error message and terminal output.
