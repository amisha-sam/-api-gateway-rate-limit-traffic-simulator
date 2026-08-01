#!/bin/bash

echo "===================================================="
echo "🚀 Starting RateScale Complete Platform (1 Command)"
echo "===================================================="

# Clean up any lingering processes on ports 8000, 8080, and 5173
lsof -ti :8000 -ti :8080 -ti :5173 | xargs kill -9 2>/dev/null || true

# 1. Start Python AI & PostgreSQL Service (Port 8000)
echo "🧠 Starting Python AI Engine on http://127.0.0.1:8000..."
cd /Users/prathap/Documents/hack/ai_service
source venv/bin/activate
uvicorn main:app --port 8000 --host 127.0.0.1 > /dev/null 2>&1 &

# 2. Start Express Backend (Port 8080)
echo "⚙️ Starting Express Backend Engine on http://localhost:8080..."
cd /Users/prathap/Documents/hack/backend
node server.cjs > /dev/null 2>&1 &

# 3. Start React Frontend (Port 5173)
echo "🎨 Starting React Frontend UI on http://127.0.0.1:5173..."
cd /Users/prathap/Documents/hack/frontend
npx vite --host 127.0.0.1 --port 5173 > /dev/null 2>&1 &

echo "===================================================="
echo "✅ All 3 services are online!"
echo "🌐 Open App: http://127.0.0.1:5173"
echo "===================================================="

wait
