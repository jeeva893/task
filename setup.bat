@echo off
REM SkillGraph Windows Setup Script
REM Run this from the project root directory

echo.
echo ============================================================
echo SkillGraph - Windows Setup Script
echo ============================================================
echo.

REM Check if in correct directory
if not exist backend (
    echo ERROR: backend directory not found!
    echo Please run this script from the project root directory
    exit /b 1
)

REM Check .env exists
if not exist backend\.env (
    echo ERROR: backend\.env not found!
    echo Please create backend\.env from backend\.env.example
    echo with your CognoDB credentials
    exit /b 1
)

echo [1/5] Creating virtual environment...
cd backend
python -m venv .venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    exit /b 1
)

echo [2/5] Activating virtual environment and installing dependencies...
call .venv\Scripts\activate.bat
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)

echo.
echo [3/5] Running seed script...
echo WARNING: This will clear your CognoDB database!
set /p "seed_confirm=Proceed with seeding? (y/n): "
if /i "%seed_confirm%"=="y" (
    python backend\scripts\seed.py
    if errorlevel 1 (
        echo WARNING: Seed failed - check your CognoDB credentials
    )
) else (
    echo Skipped seed script
)

echo.
echo [4/5] Running tests...
pytest -v backend\tests\
if errorlevel 1 (
    echo WARNING: Some tests failed
    set /p "continue_anyway=Continue anyway? (y/n): "
    if /i "%continue_anyway%"=="n" (
        exit /b 1
    )
)

echo.
echo ============================================================
echo [5/5] Setup Complete!
echo ============================================================
echo.
echo To start the backend server, open a new PowerShell window
echo and run:
echo.
echo   cd backend
echo   .venv\Scripts\Activate.ps1
echo   uvicorn backend.app.main:app --reload
echo.
echo Backend will be at: http://localhost:8000
echo API docs at: http://localhost:8000/docs
echo.
echo To start the frontend, open another terminal and run:
echo.
echo   cd frontend
echo   npm install
echo   npm run dev
echo.
echo Frontend will be at: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
