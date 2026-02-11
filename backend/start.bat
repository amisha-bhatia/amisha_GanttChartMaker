@echo off
cd /d %~dp0

echo Starting SMT Timeline Server...

start "" node server.js

timeout /t 3 > nul

start http://localhost:5000

exit
