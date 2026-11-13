@echo off
title Every Child Reads - Student Portal & Telugu ASR Verification
color 0A
echo ========================================================
echo   Running Phase 2 (Student Portal) & Phase 3 (ASR) Tests
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
"%PY_EXE%" test_student_portal_and_asr.py
echo.
pause

