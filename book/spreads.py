"""Rasterizes pages of the built book as two-page spreads, for looking at the design: book/build/samples/.

    .venv/bin/python book/spreads.py PDF PAGE [PAGE ...] [--dpi 70] [--name prefix]

A page number p shows the spread it belongs to (an even page on the left, the odd one after it on the right);
"single:p" shows one page alone at the given resolution.
"""
import subprocess, sys, tempfile, os
from PIL import Image

args = sys.argv[1:]
dpi = int(args[args.index('--dpi') + 1]) if '--dpi' in args else 70
name = args[args.index('--name') + 1] if '--name' in args else 'spread'
args = [a for i, a in enumerate(args) if not a.startswith('--') and (i == 0 or not args[i - 1].startswith('--'))]
pdf, pages = args[0], args[1:]
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build', 'samples')
os.makedirs(out, exist_ok=True)

def page(p, tmp):
    base = os.path.join(tmp, f'p{p}')
    subprocess.run(['pdftoppm', '-r', str(dpi), '-png', '-singlefile', '-f', str(p), '-l', str(p), pdf, base], check=True)
    return Image.open(base + '.png')

with tempfile.TemporaryDirectory() as tmp:
    for spec in pages:
        if spec.startswith('single:'):
            p = int(spec.split(':')[1])
            page(p, tmp).save(os.path.join(out, f'{name}-p{p}.png'))
            continue
        p = int(spec)
        left, right = (p, p + 1) if p % 2 == 0 else (p - 1, p)
        ims = [page(q, tmp) for q in (left, right) if q >= 1]
        w = sum(i.width for i in ims) + 12
        h = max(i.height for i in ims)
        sheet = Image.new('RGB', (w, h), (120, 120, 120))
        x = 0
        for im in ims:
            sheet.paste(im, (x, 0))
            x += im.width + 12
        path = os.path.join(out, f'{name}-{left}-{right}.png')
        sheet.save(path)
        print(path)
