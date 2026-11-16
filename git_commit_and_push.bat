@echo off
title Git Commit and Push - Every Child Reads Telugu AI Platform
color 0B
echo ===================================================================
echo   Every Child Reads - Telugu AI Platform
echo   Staging, Committing and Pushing to GitHub
echo   Remote: https://github.com/saivishal89/T-hub-.git
echo ===================================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking git status...
git status

echo.
echo [2/4] Staging all changes...
git add .

echo.
echo [3/4] Committing changes...
git commit -m "fix(auth): enable any Gmail direct join, Google sign-in fallback, and serverless SQLite support"

echo.
echo [4/4] Pushing to main branch on GitHub...
git push origin main

echo.
echo ===================================================================
echo   Git Push Process Complete!
echo ===================================================================
pause
