@echo off
title Every Child Reads - Telugu AI Platform Starter
color 0A
echo ===================================================
echo   Every Child Reads - Telugu AI Literacy Platform
echo   Launching Frontend (Next.js) & Backend (Python)
echo ===================================================
echo.

set "SCRIPT_DIR=%~dp0"

:: Check Python executable
if exist "%SCRIPT_DIR%backend\.venv\Scripts\python.exe" (
    set "PY_EXE=%SCRIPT_DIR%backend\.venv\Scripts\python.exe"
) else if exist "%SCRIPT_DIR%backend\.venv\bin\python.exe" (
    set "PY_EXE=%SCRIPT_DIR%backend\.venv\bin\python.exe"
) else (
    set "PY_EXE=python"
)

echo [1/2] Starting Python Neural Voice Server on port 8000 using: %PY_EXE%
start "Telugu AI Backend (Port 8000)" cmd /k "cd /d "%SCRIPT_DIR%backend" && "%PY_EXE%" server.py"

timeout /t 2 >nul

echo [2/2] Starting Next.js Dev Server on port 3000...
start "Telugu AI Frontend (Port 3000)" cmd /k "cd /d "%SCRIPT_DIR%frontend" && pnpm run dev"

echo.
echo ===================================================
echo   Servers are launching in separate windows!
echo   Unified Login : http://localhost:3000/login
echo   Admin Panel   : http://localhost:3000/admin
echo   Teacher Panel : http://localhost:3000/teacher
echo   AI Tutor      : http://localhost:3000/tutor
echo   Reading Studio: http://localhost:3000/reading-studio
echo   Parent Panel  : http://localhost:3000/parent
echo   Backend API   : http://localhost:8000/health
echo ===================================================
echo.
echo Leave those two command windows open while testing.
pause
