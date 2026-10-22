#!/usr/bin/env bash
# Resolves a Chromium binary and the Playwright Node module for scripts/qa-browser.cjs.
# Usage:  source scripts/browser-env.sh
# Exports: CHROMIUM_PATH, PLAYWRIGHT_MODULE_PATH

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

resolve_playwright() {
  if [ -d "$root/node_modules/playwright" ]; then
    echo "$root/node_modules/playwright"
    return
  fi
  local cached
  cached="$(ls -1d "${HOME}"/.npm/_npx/*/node_modules/playwright 2>/dev/null | sort | tail -1 || true)"
  if [ -n "$cached" ]; then
    echo "$cached"
    return
  fi
  echo "" >&2
  echo "Playwright module not found. Install it with:" >&2
  echo "  npm install --no-save --prefix \"${HOME}/.cache/ocago-tools\" playwright" >&2
  return 1
}

resolve_chromium() {
  if [ -n "${CHROMIUM_PATH:-}" ] && [ -x "${CHROMIUM_PATH}" ]; then
    echo "${CHROMIUM_PATH}"
    return
  fi
  # Prefer the newest cached Playwright Chromium: its revision matches the installed module.
  local newest=""
  local revision
  for revision in $(ls -1d "${HOME}"/Library/Caches/ms-playwright/chromium-* "${HOME}"/.cache/ms-playwright/chromium-* 2>/dev/null | sort -t- -k2 -n); do
    local candidate
    for candidate in \
      "${revision}"/chrome-mac*/"Google Chrome for Testing.app"/Contents/MacOS/"Google Chrome for Testing" \
      "${revision}"/chrome-mac*/Chromium.app/Contents/MacOS/Chromium \
      "${revision}"/chrome-linux/chrome; do
      if [ -x "$candidate" ]; then
        newest="$candidate"
      fi
    done
  done
  if [ -n "$newest" ]; then
    echo "$newest"
    return
  fi
  local fallback
  for fallback in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "/usr/bin/chromium" "/usr/bin/google-chrome"; do
    if [ -x "$fallback" ]; then
      echo "$fallback"
      return
    fi
  done
  echo "" >&2
  echo "No Chromium/Chrome binary found. Install Chrome or run: npx playwright install chromium" >&2
  return 1
}

PLAYWRIGHT_MODULE_PATH="$(resolve_playwright)"
CHROMIUM_PATH="$(resolve_chromium)"
export PLAYWRIGHT_MODULE_PATH CHROMIUM_PATH

echo "PLAYWRIGHT_MODULE_PATH=${PLAYWRIGHT_MODULE_PATH}"
echo "CHROMIUM_PATH=${CHROMIUM_PATH}"
