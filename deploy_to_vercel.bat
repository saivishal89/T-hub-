@echo off
title Deploy to Vercel - Every Child Reads Telugu AI Platform
color 0B
echo ===================================================================
echo   Every Child Reads - Telugu AI Platform
echo   Deploying Multi-Service Project to Vercel
echo ===================================================================
echo.

cd /d "%~dp0"

echo [Step 1/2] Deploying Multi-Service Application to Production...
call npx vercel --prod --yes

echo.
echo ===================================================================
echo   Vercel Deployment Finished!
echo ===================================================================
pause
