@echo off
title Every Child Reads - Launcher
color 0E
echo ===================================================================
echo   Every Child Reads - Telugu AI Literacy Platform
echo   Launching Backend (Port 8000) and Frontend (Port 3000)...
echo ===================================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching Backend Server in a new window...
start "Telugu AI Backend (Port 8000)" cmd /k run_backend.bat

timeout /t 2 >nul

echo [2/2] Launching Frontend Server in a new window...
start "Telugu AI Frontend (Port 3000)" cmd /k run_frontend.bat

echo.
echo ===================================================================
echo   Two windows have been opened for Backend and Frontend!
echo.
echo   Once Next.js shows "Ready in ... ms", open your browser:
echo   👉 http://localhost:3000/login
echo.
echo   Keep those two command windows open while using the app.
echo ===================================================================
echo.
pause
