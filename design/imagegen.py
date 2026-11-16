"""Style candidates for the paper's figures, from an image model.

    python3 design/imagegen.py design/prompts/<figure>.json [--quality high]

The prompt file holds a shared description of the figure ("figure") and a list
of style variants ("variants", each with a "name" and a "style"). Each variant
becomes one request: the figure's description followed by its style. The
images, the exact prompts sent, and a contact sheet with the variants lettered
A, B, C, ... go to design/candidates/<figure>/, which is not committed.

These images are style references only (design/FIGURE_WORKFLOW.md): the
figure that goes into the paper is drawn by code from data and exact maths,
in the style chosen. The API key is never read here: the session's network
proxy adds it to requests to api.openai.com, so the header below carries a
placeholder.
"""
from __future__ import annotations

import argparse
import base64
import json
import pathlib
import string
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent
MODEL = "gpt-image-2.6-sunburst"
URL = "https://api.openai.com/v1/images/generations"


def generate(prompt: str, size: str, quality: str) -> bytes:
    body = json.dumps({"model": MODEL, "prompt": prompt, "size": size, "quality": quality, "n": 1}).encode()
    req = urllib.request.Request(URL, data=body, headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer proxy-injected",   # replaced by the proxy
    })
    with urllib.request.urlopen(req, timeout=600) as r:
        data = json.load(r)
    return base64.b64decode(data["data"][0]["b64_json"])


def contact_sheet(paths: list[pathlib.Path], names: list[str], out: pathlib.Path, width: int = 760) -> None:
    ims = [Image.open(p).convert("RGB") for p in paths]
    h = max(round(im.height * width / im.width) for im in ims)
    cols = 2 if len(ims) > 3 else len(ims)
    rows = -(-len(ims) // cols)
    pad, label = 24, 46
    sheet = Image.new("RGB", (cols * width + (cols + 1) * pad, rows * (h + label) + (rows + 1) * pad), "white")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 26)
    except OSError:
        font = ImageFont.load_default()
    for k, (im, name) in enumerate(zip(ims, names)):
        x = pad + (k % cols) * (width + pad)
        y = pad + (k // cols) * (h + label + pad)
        draw.text((x, y + 6), f"{string.ascii_uppercase[k]}  {name}", fill=(20, 20, 20), font=font)
        sheet.paste(im.resize((width, round(im.height * width / im.width)), Image.LANCZOS), (x, y + label))
    sheet.save(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("prompts", type=pathlib.Path)
    ap.add_argument("--quality", default="high", choices=["low", "medium", "high"])
    args = ap.parse_args()
    spec = json.loads(args.prompts.read_text())
    out = ROOT / "candidates" / args.prompts.stem
    out.mkdir(parents=True, exist_ok=True)
    size = spec.get("size", "1536x1024")
    jobs = []
    for k, v in enumerate(spec["variants"]):
        prompt = spec["figure"].strip() + "\n\nStyle: " + v["style"].strip()
        jobs.append((string.ascii_uppercase[k], v["name"], prompt))

    def run(job):
        letter, name, prompt = job
        png = out / f"{letter}.png"
        png.write_bytes(generate(prompt, size, args.quality))
        (out / f"{letter}.prompt.txt").write_text(prompt + "\n")
        return png

    with ThreadPoolExecutor(max_workers=len(jobs)) as pool:
        paths = list(pool.map(run, jobs))
    contact_sheet(paths, [j[1] for j in jobs], out / "sheet.png")
    print(f"wrote {len(paths)} images and {out / 'sheet.png'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
