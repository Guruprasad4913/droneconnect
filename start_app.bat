@echo off
TITLE AgriDrone Hub - Launcher
COLOR 0A

echo =====================================================================
echo           AGRIDRONE HUB - AGRITECH PLATFORM LAUNCHER
echo      "More Flights. Less Idle Time. Higher Farm Profitability."
echo =====================================================================
echo.

echo [1/3] Starting Backend API Server (Node.js + Express on port 5000)...
start "AgriDrone Hub Backend (Port 5000)" cmd /k "cd server && node index.js"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Dev Server (Vite + React on port 5173)...
start "AgriDrone Hub Frontend (Port 5173)" cmd /k "cd client && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening AgriDrone Hub in default web browser...
start http://localhost:5173

echo.
echo =====================================================================
echo   AgriDrone Hub is running!
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:5000/api/health
echo =====================================================================
pause
