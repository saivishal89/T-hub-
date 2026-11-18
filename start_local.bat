@echo off
title Start Local Servers - Every Child Reads Original Platform
color 0E
echo ===================================================================
echo   Every Child Reads - Original Telugu AI Platform
echo   Starting Local Development Servers (Frontend + Backend)
echo ===================================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "ECR-FastAPI-Backend" cmd /k "cd backend && python server.py"

timeout /t 2 /nobreak >nul

echo.
echo [2/2] Launching Next.js Frontend on http://localhost:3000 ...
start "ECR-NextJS-Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================================
echo   Original clean application launched!
echo   Open your browser at: http://localhost:3000
echo ===================================================================
timeout /t 3 /nobreak >nul
start http://localhost:3000
pause
