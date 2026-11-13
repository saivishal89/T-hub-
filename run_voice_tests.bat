@echo off
title Every Child Reads - Telugu Neural Voice Phonetics Test
color 0E
echo ========================================================
echo   Running Telugu AI Neural Voice Phonetics Test Suite
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
"%PY_EXE%" test_telugu_voice_engine.py
echo.
pause

