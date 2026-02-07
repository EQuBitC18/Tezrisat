$ErrorActionPreference = "Stop"

Write-Host "Installing Git hooks..." -ForegroundColor Cyan
git config core.hooksPath scripts/githooks
Write-Host "Git hooks installed. Pre-commit and pre-push checks are now active." -ForegroundColor Green
