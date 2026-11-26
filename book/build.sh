#!/bin/bash
# Builds the book: book/out/the-gravitational-camera.pdf. Options are build.mjs's (--parts, --colour, --font, ...).
set -euo pipefail
export PATH="/Library/TeX/texbin:/opt/homebrew/bin:$PATH"
exec node "$(dirname "$0")/build.mjs" "$@"
