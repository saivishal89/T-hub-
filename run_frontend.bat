@echo off
title Telugu AI Frontend (Port 3000)
color 0B
cd /d "%~dp0frontend"
echo ===================================================
echo   Starting Next.js Dev Server (Port 3000)...
echo ===================================================
echo.

where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Running with pnpm...
    call pnpm run dev
) else (
    where npm >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Running with npm...
        call npm run dev
    ) else (
        echo [ERROR] Neither pnpm nor npm was found in PATH!
    )
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Frontend failed with error code %ERRORLEVEL%.
)
pause

