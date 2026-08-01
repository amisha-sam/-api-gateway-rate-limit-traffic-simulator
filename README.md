# 🚀 RateScale — Intelligent API Gateway Rate Limit & Traffic Simulator

RateScale is an enterprise-grade, AI-driven API Gateway rate-limiting and synthetic workload traffic simulator. It features a **React 18 TypeScript frontend**, a **Node.js Express backend**, a **Python FastAPI Machine Learning engine (Scikit-Learn RandomForest)**, and **PostgreSQL 18 relational persistence via SQLAlchemy**.

---

## 🏗️ Architecture Overview

```mermaid
graph TD
    Client["🎨 React 18 Frontend (Port 5173 / Vite)"] -->|HTTP API & WebSockets| NodeServer["⚙️ Express Backend Server (Port 8080)"]
    NodeServer -->|Synthetic Load Engine| TargetEndpoint["🎯 Target API Workload Sandbox"]
    NodeServer -->|Telemetry & Sync POST| PythonAI["🧠 Python FastAPI AI Engine (Port 8000)"]
    PythonAI -->|Scikit-Learn ML Model| RateLimitPolicy["⚡ Recommended Token Bucket RPS"]
    PythonAI -->|SQLAlchemy ORM| PostgresDB[("🐘 PostgreSQL Database (ratescale_db)")]
```

---

## 🛠️ Technology Stack

* **Frontend**: React 18, TypeScript, Vite v8, Tailwind CSS v4, TanStack React Query v5, Zod, Lucide Icons.
* **Backend**: Node.js v20, Express.js, WebSockets (`ws`), JWT Auth, `bcryptjs`, Rate Limit, Helmet.
* **AI & Machine Learning**: Python 3.14, FastAPI, Uvicorn, Scikit-Learn (`RandomForestRegressor`), NumPy.
* **Database Layer**: PostgreSQL 18 (managed via pgAdmin 4), SQLAlchemy 2.0 ORM, `psycopg2-binary`, SQLite WAL fallback.

---

## ⚡ Quick Start (1 Command)

Run the complete 3-service platform with a single terminal command:

```bash
cd /Users/prathap/Documents/hack
npm start
```

*Or execute the startup script directly:*
```bash
./start.sh
```

Open your browser at **`http://localhost:5173`**!

---

## 💻 Manual Setup & Startup Guide

If you prefer to start each service in separate terminal windows:

### 1️⃣ Start Python AI & PostgreSQL Engine (Port 8000)
```bash
cd ai_service
source venv/bin/activate
pip install -r requirements.txt
python create_tables.py
uvicorn main:app --port 8000 --reload
```

### 2️⃣ Start Express Node.js Backend Engine (Port 8080)
```bash
cd backend
npm install
npm start
```

### 3️⃣ Start React Frontend Web App (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

---

## 🐘 PostgreSQL Database & pgAdmin Setup

### Database Configuration (`ai_service/.env`)
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_PGADMIN_PASSWORD
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=ratescale_db

DATABASE_URL=postgresql://postgres:YOUR_PGADMIN_PASSWORD@127.0.0.1:5432/ratescale_db
```

### SQL Inspection in pgAdmin 4
Connect to `ratescale_db` in pgAdmin and execute:

```sql
-- View all stored traffic simulation runs
SELECT * FROM simulations ORDER BY created_at DESC;

-- View execution metrics (Passed/Failed requests, Avg/P99 latency)
SELECT * FROM simulation_results;

-- View AI-generated rate limiting recommendations
SELECT * FROM recommendations;
```

---

## 🧠 AI Rate Limiting Machine Learning Engine

The Python service utilizes a **Scikit-Learn Random Forest Regressor** model trained to detect latency knee-curves. It evaluates 6 telemetry features:
1. `latency_ms`
2. `p95_latency_ms` / `p99_latency_ms`
3. `throughput_rps`
4. `cpu_usage_percent`
5. `memory_usage_percent`
6. `error_rate_percent`

### Gateway Exporter Support
Exports generated policies to:
* **Nginx** (`limit_req_zone`)
* **Kong API Gateway** (`rate-limiting`)
* **Cloudflare WAF** (`rate_limiting`)
* **Envoy Proxy** (`local_rate_limit`)

---

## 📄 License & Author

Developed for **RateScale Production SaaS Environment**.
