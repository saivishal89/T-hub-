@echo off
title Telugu AI Backend (Port 8000)
color 0A
cd /d "%~dp0backend"
echo ===================================================
echo   Starting Telugu AI Backend (Port 8000)...
echo ===================================================
echo.

if exist ".venv\Scripts\python.exe" (
    echo Using VirtualEnv Python...
    ".venv\Scripts\python.exe" server.py
) else (
    echo Using System Python...
    python server.py
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Backend exited with error code %ERRORLEVEL%.
)
pause

