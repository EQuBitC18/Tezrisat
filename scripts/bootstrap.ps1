$ErrorActionPreference = "Stop"

$repo = "https://github.com/EQuBitC18/Tezrisat.git"
$branch = "main"
$target = Join-Path (Get-Location) "Tezrisat"

Write-Host "Cloning Tezrisat..." -ForegroundColor Cyan
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "git is required. Please install Git and rerun."
}

if (-not (Test-Path $target)) {
  git clone --branch $branch $repo $target
} else {
  Write-Host "Repo already exists at $target, using it." -ForegroundColor Yellow
}

Set-Location $target
& .\scripts\dev.ps1
