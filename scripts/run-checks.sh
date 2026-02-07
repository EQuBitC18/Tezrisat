#!/usr/bin/env bash
set -euo pipefail

if [ "${SKIP_CHECKS:-}" = "1" ]; then
  echo "SKIP_CHECKS=1 set, skipping checks."
  exit 0
fi

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Running backend tests..."
(
  cd "$root/Tezrisat_Backend"
  if command -v python >/dev/null 2>&1; then
    python manage.py test
  else
    python3 manage.py test
  fi
)

echo "Running frontend lint/build..."
(
  cd "$root/Tezrisat_Frontend/tezrisat_frontend"
  npm run lint
  npm run build
)
