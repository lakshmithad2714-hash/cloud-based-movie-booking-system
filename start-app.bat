@echo off
echo Starting Movie Booking App...

:: Start Backend in a new window
echo Starting Backend...
start cmd /k "cd backend && npm start"

:: Start Frontend in a new window
echo Starting Frontend...
start cmd /k "cd frontend && npm start"

echo Both services are starting! 🎬
pause
