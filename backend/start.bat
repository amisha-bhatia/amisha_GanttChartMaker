@echo off
cd /d %~dp0

echo Starting SMT Timeline Server...

start "" node server.js

timeout /t 3 > nul

echo Launching website in full-screen kiosk mode in Edge...

:: Close existing Edge windows to ensure kiosk mode works
taskkill /IM msedge.exe /F > nul 2>&1

:: Launch Edge in kiosk mode with isolated profile
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk "http://localhost:5000" --edge-kiosk-type=fullscreen --user-data-dir="%~dp0\edge-profile"

exit
