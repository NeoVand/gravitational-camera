#!/bin/bash
# Builds the book's cover: book/cover/cover.pdf (209.2 x 260 mm: 8 x 10 in trim and 3 mm bleed) and cover.jpg (the
# trimmed page, 1600 px wide, for preview). The picture is painting.jpg (drawn by an image model, GPT Image, from
# painting-prompt.txt, then re-rendered at 2560 x 3200, about 310 dpi with the bleed); it is cut to the page's proportions here and the type
# is set over it by cover.tex.
set -euo pipefail
export PATH="/Library/TeX/texbin:/opt/homebrew/bin:$PATH"
here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
py="$root/.venv/bin/python"
cd "$here"
mkdir -p build
"$py" - <<'PY'
from PIL import Image
im = Image.open("painting.jpg").convert("RGB")
# the page with its bleed is 209.2 x 260 mm: keep the full width, trim the height evenly
h = round(im.width * 260 / 209.2)
top = (im.height - h) // 2
im.crop((0, top, im.width, top + h)).save("build/art.jpg", quality=95, subsampling=0, dpi=(im.width / (209.2 / 25.4),) * 2)
PY
# twice: the picture is placed against the page's corner, which tikz learns from the previous run
for run in 1 2; do
  lualatex -interaction=nonstopmode -halt-on-error -output-directory=build cover.tex > build/lualatex.out || { tail -30 build/lualatex.out; exit 1; }
done
command cp -f build/cover.pdf cover.pdf
# the preview: the page trimmed of its bleed, 1600 px wide
pdftoppm -r 430.053 -png -singlefile cover.pdf build/full
"$py" - <<'PY'
from PIL import Image
im = Image.open("build/full.png")
b = round(3 / 25.4 * 430.053)
t = im.crop((b, b, im.width - b, im.height - b))
t = t.resize((1600, round(1600 * t.height / t.width)), Image.LANCZOS)
t.save("cover.jpg", quality=88)
print(f"cover.jpg {t.width} x {t.height}")
PY
pdfinfo cover.pdf | command grep -E "Page size|Pages"
/bin/ls -la cover.pdf cover.jpg
