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
git commit -m "fix: resolve practice currentUser error, tune neural voice frequencies (male/child/female), and isolate student profile data"

echo.
echo [4/4] Pushing to main branch on GitHub...
git push origin main

echo.
echo ===================================================================
echo   Git Push Process Complete!
echo ===================================================================
pause
