$ErrorActionPreference = "Stop"

if ($env:SKIP_CHECKS -eq "1") {
  Write-Host "SKIP_CHECKS=1 set, skipping checks."
  exit 0
}

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "Running backend tests..." -ForegroundColor Cyan
Push-Location (Join-Path $root "Tezrisat_Backend")
if (Get-Command python -ErrorAction SilentlyContinue) {
  python manage.py test
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
  py -3 manage.py test
} else {
  throw "Python not found. Install Python or ensure it is on PATH."
}
Pop-Location

Write-Host "Running frontend lint/build..." -ForegroundColor Cyan
Push-Location (Join-Path $root "Tezrisat_Frontend\tezrisat_frontend")
npm run lint
npm run build
Pop-Location
