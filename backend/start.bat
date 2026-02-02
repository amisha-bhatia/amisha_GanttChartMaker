@echo off
cd /d %~dp0

set DB_PATH=C:\project\SMTScreenVision\src\storage\data\db\database.db
set FRONTEND_BUILD_PATH=C:\project\smt-timeline\frontend\build

echo Starting SMT Timeline Server...

start "" node server.js

timeout /t 3 > nul

start http://localhost:5000

exit
