@echo off
title Install Three.js - EduVerse
color 0A
echo ===================================================================
echo   EduVerse - Telugu AI Literacy Platform
echo   Installing Three.js package for Chinni 3D Tutor
echo ===================================================================
echo.

cd /d "%~dp0\frontend"

where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Detected pnpm. Installing with pnpm add three...
    pnpm add three
) else (
    echo Installing with npm install three --no-package-lock...
    npm install three --no-package-lock
)

echo.
echo ===================================================================
echo   Installation finished! 
echo   Now you can run "npm run dev" or "pnpm run dev" to test!
echo ===================================================================
pause
