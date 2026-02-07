$ErrorActionPreference = "Stop"

$root = Resolve-Path "$PSScriptRoot\.."
$backend = Join-Path $root "Tezrisat_Backend"
$frontend = Join-Path $root "Tezrisat_Frontend\tezrisat_frontend"

Write-Host "Starting Tezrisat (Windows)..." -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $backend "venv"))) {
  Write-Host "Creating virtual environment..." -ForegroundColor Cyan
  python -m venv (Join-Path $backend "venv")
}

Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& (Join-Path $backend "venv\Scripts\Activate.ps1")

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
pip install -r (Join-Path $backend "requirements.txt")

Write-Host "Running migrations..." -ForegroundColor Cyan
python (Join-Path $backend "manage.py") migrate

Write-Host "Starting backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "manage.py runserver" -WorkingDirectory $backend

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Push-Location $frontend
npm install

Write-Host "Starting frontend on http://localhost:5173 ..." -ForegroundColor Green
npm run dev
Pop-Location
