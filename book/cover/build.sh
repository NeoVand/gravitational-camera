#!/bin/bash
# Builds the book's cover: book/cover/cover.pdf (195 x 252 mm: 189 x 246 trim and 3 mm bleed), cover.svg (the same
# page, its type as outlines), cover.png (the trimmed page, 1600 px wide, for preview).
#   book/cover/build.sh          the picture is redrawn only if build/art.png is missing
#   book/cover/build.sh --art    redraw it (make_cover.py, about 20 s)
set -euo pipefail
export PATH="/Library/TeX/texbin:/opt/homebrew/bin:$PATH"
here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
py="$root/.venv/bin/python"
cd "$here"
if [[ "${1:-}" == "--art" || ! -f build/art.png ]]; then "$py" make_cover.py; fi
"$py" - <<'PY'
from PIL import Image
Image.open("build/art.png").convert("RGB").save("build/art.jpg", quality=94, subsampling=0, dpi=(304.8, 304.8))
PY
lualatex -interaction=nonstopmode -halt-on-error -output-directory=build cover.tex > build/lualatex.out || { tail -30 build/lualatex.out; exit 1; }
command cp -f build/cover.pdf cover.pdf
pdftocairo -svg cover.pdf cover.svg
# the preview: the page trimmed of its bleed, 1600 px wide
pdftoppm -r 430.053 -png -singlefile cover.pdf build/full
"$py" - <<'PY'
from PIL import Image
im = Image.open("build/full.png")
b = round(3 / 25.4 * 430.053)
t = im.crop((b, b, im.width - b, im.height - b))
t = t.resize((1600, round(1600 * t.height / t.width)), Image.LANCZOS)
t.save("cover.png")
print(f"cover.png {t.width} x {t.height}")
PY
pdfinfo cover.pdf | command grep -E "Page size|Pages"
/bin/ls -la cover.pdf cover.svg cover.png
