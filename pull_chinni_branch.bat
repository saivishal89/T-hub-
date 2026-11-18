@echo off
title Git Pull Feature Branch chinni-3d-tutor
color 0E
echo ===================================================================
echo   Checking Git Remote & Fetching feature/chinni-3d-tutor
echo   Remote: https://github.com/saivishal89/T-hub-.git
echo ===================================================================
echo.

cd /d "%~dp0"

echo [1/3] Fetching all branches from remote...
git fetch origin

echo.
echo [2/3] Checking out feature/chinni-3d-tutor ...
git checkout feature/chinni-3d-tutor 2>nul || git checkout -b feature/chinni-3d-tutor origin/feature/chinni-3d-tutor

echo.
echo [3/3] Pulling latest changes...
git pull origin feature/chinni-3d-tutor

echo.
echo ===================================================================
echo   Branch Sync Complete!
echo ===================================================================
pause
