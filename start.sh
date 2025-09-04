#!/bin/bash

echo "Starting Fragrance Recommender..."
echo

echo "Starting Backend Server..."
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

echo
echo "Starting Frontend Server..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for interrupt signal
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
