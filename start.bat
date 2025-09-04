@echo off
echo Starting Fragrance Recommender...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "pip install -r requirements.txt && uvicorn main:app --reload --port 8000"

echo.
echo Starting Frontend Server...
cd ../frontend
start "Frontend Server" cmd /k "npm install && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
pause
