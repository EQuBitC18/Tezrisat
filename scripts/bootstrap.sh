#!/usr/bin/env bash
set -euo pipefail

repo="https://github.com/EQuBitC18/Tezrisat.git"
branch="main"
target="${PWD}/Tezrisat"

echo "Cloning Tezrisat..."
if ! command -v git >/dev/null 2>&1; then
  echo "git is required. Please install Git and rerun."
  exit 1
fi

if [ ! -d "$target" ]; then
  git clone --branch "$branch" "$repo" "$target"
else
  echo "Repo already exists at $target, using it."
fi

cd "$target"
./scripts/dev.sh
