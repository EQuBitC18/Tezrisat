#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backend="$root/Tezrisat_Backend"
frontend="$root/Tezrisat_Frontend/tezrisat_frontend"

echo "Starting Tezrisat (macOS/Linux)..."

if [ ! -d "$backend/venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv "$backend/venv"
fi

echo "Activating virtual environment..."
source "$backend/venv/bin/activate"

echo "Installing backend dependencies..."
pip install -r "$backend/requirements.txt"

echo "Running migrations..."
python "$backend/manage.py" migrate

echo "Starting backend on http://localhost:8000 ..."
python "$backend/manage.py" runserver &
backend_pid=$!

cleanup() {
  echo "Stopping backend..."
  kill "$backend_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Installing frontend dependencies..."
cd "$frontend"
npm install

echo "Starting frontend on http://localhost:5173 ..."
npm run dev
