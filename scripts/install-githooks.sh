#!/usr/bin/env bash
set -euo pipefail

echo "Installing Git hooks..."
git config core.hooksPath scripts/githooks
echo "Git hooks installed. Pre-commit and pre-push checks are now active."
