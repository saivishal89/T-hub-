@echo off
title Every Child Reads - Automated Security & RBAC Verification
color 0B
echo ========================================================
echo   Running Automated P0 Security Verification Suite
echo ========================================================
echo.

set "SCRIPT_DIR=%~dp0"

if exist "%SCRIPT_DIR%backend\.venv\Scripts\python.exe" (
    set "PY_EXE=%SCRIPT_DIR%backend\.venv\Scripts\python.exe"
) else if exist "%SCRIPT_DIR%backend\.venv\bin\python.exe" (
    set "PY_EXE=%SCRIPT_DIR%backend\.venv\bin\python.exe"
) else (
    set "PY_EXE=python"
)

cd /d "%SCRIPT_DIR%backend"
"%PY_EXE%" test_security_p0.py
echo.
pause

