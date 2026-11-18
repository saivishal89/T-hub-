@echo off
title Restart Dev Server - EduVerse
color 0B
echo ===================================================================
echo   EduVerse - Refreshing Dev Server with Three.js
echo ===================================================================
echo.

cd /d "%~dp0\frontend"

echo [1/2] Clearing stale Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo Cache cleared successfully.
)

echo.
echo [2/2] Starting Next.js Frontend on http://localhost:3000 ...
where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    pnpm run dev
) else (
    npm run dev
)

pause
