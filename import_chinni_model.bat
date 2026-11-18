@echo off
title Copy Chinni 3D Model
color 0A
echo Copying Tripo3D GLB model...
echo.

copy /y "C:\Users\HP\Downloads\tripo_texture_3e020f8d-22b2-4299-9629-cb288395ac74_meshopt.glb" "C:\Users\HP\Downloads\Zaraki-Ai-Stack\TISC-t hub\frontend\public\models\chinni.glb"

if exist "C:\Users\HP\Downloads\Zaraki-Ai-Stack\TISC-t hub\frontend\public\models\chinni.glb" (
    echo.
    echo ==============================================================
    echo [SUCCESS] chinni.glb successfully copied! (15.6 MB)
    echo ==============================================================
) else (
    echo.
    echo [FAILED] Could not copy. Please manually copy the file.
)

echo.
pause
