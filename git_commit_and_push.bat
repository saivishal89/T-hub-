@echo off
title Git Commit and Push - Telugu AI Audio Studio
color 0A
echo ===================================================================
echo   EduVerse - Telugu AI Literacy Platform
echo   Committing and Pushing Audio Studio & Button Fixes
echo   Remote: https://github.com/saivishal89/T-hub-.git
echo ===================================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking git status...
git status

echo.
echo [2/4] Staging all files...
git add .

echo.
echo [3/4] Committing fixes...
git commit -m "fix(tutor): add instant browser speech synthesis fallback and optimize button click event handling"

echo.
echo [4/4] Pushing to main branch on GitHub...
git push origin main

echo.
echo ===================================================================
echo   Push Complete! Vercel will now automatically trigger deploy!
echo ===================================================================
pause
