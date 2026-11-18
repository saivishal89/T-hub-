@echo off
title Sync Dependencies and Build Test - EduVerse
color 0B
echo ===================================================================
echo   EduVerse - Telugu AI Literacy Platform
echo   Updating frontend dependencies and lockfile
echo ===================================================================
echo.

cd /d "%~dp0\frontend"

echo [1/2] Installing frontend dependencies...
where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Detected pnpm. Running pnpm install...
    pnpm install
) else (
    echo Using npm install with --legacy-peer-deps...
    npm install --legacy-peer-deps
)

echo.
echo [2/2] Testing Next.js production build...
where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    pnpm run build
) else (
    npm run build
)

echo.
echo ===================================================================
echo   Build test finished! Check output above.
echo ===================================================================
pause
