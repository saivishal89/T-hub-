@echo off
title Every Child Reads - Comprehensive Test Suite Runner
color 0A
echo ===================================================================
echo   EVERY CHILD READS (ప్రతి బిడ్డ చదవాలి) - COMPREHENSIVE TEST SUITE
echo   Testing P0 Security, Neural Voice Engine, Student Portal & ASR
echo ===================================================================
echo.

set "SCRIPT_DIR=%~dp0"

:: Check Python executable
if exist "%SCRIPT_DIR%backend\.venv\Scripts\python.exe" (
    set "PY_EXE=%SCRIPT_DIR%backend\.venv\Scripts\python.exe"
) else if exist "%SCRIPT_DIR%backend\.venv\bin\python.exe" (
    set "PY_EXE=%SCRIPT_DIR%backend\.venv\bin\python.exe"
) else (
    set "PY_EXE=python"
)

echo [SUITE 1/3] Running P0 Security & RBAC Test Suite...
"%PY_EXE%" "%SCRIPT_DIR%backend\test_security_p0.py"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Security test suite failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [SUITE 2/3] Running Telugu Voice Engine & SSML Test Suite...
"%PY_EXE%" "%SCRIPT_DIR%backend\test_telugu_voice_engine.py"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Voice engine test suite failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [SUITE 3/3] Running Phase 2 (Student Portal) & Phase 3 (ASR) Test Suite...
"%PY_EXE%" "%SCRIPT_DIR%backend\test_student_portal_and_asr.py"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Student Portal and ASR test suite failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================================
echo   ALL SUITES PASSED WITH 100%% SUCCESS! SYSTEM VERIFIED & PRODUCTION READY.
echo ===================================================================
pause

