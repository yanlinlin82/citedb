#!/bin/bash

# CITEdb Startup Script

# Load configuration
if [ -f "config/local.js" ]; then
    API_PORT=$(node -e "console.log(require('./config/local.js').api.port)")
    FRONTEND_PORT=$(node -e "console.log(require('./config/local.js').frontend.port)")
else
    API_PORT=3000
    FRONTEND_PORT=8080
fi

echo "🚀 Starting CITEdb (API: $API_PORT, Frontend: $FRONTEND_PORT)"

# Start backend
echo "Starting backend service..."
cd celltypeapi
PORT=$API_PORT node simple-index.js &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend service..."
cd ../celltypeweb
npm run serve &
FRONTEND_PID=$!

echo "✅ Services started"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend: http://localhost:$API_PORT"
echo "Press Ctrl+C to stop"

# Wait for interrupt signal
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait