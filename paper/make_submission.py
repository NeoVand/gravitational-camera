"""The paper's source as a journal or arXiv wants it: one .tex file, its figures beside it, and nothing else.

    python paper/make_submission.py        (from the repository root, after `make paper`)

Writes paper/submission/ (not kept in git) and paper/submission.tar.gz:

    main.tex            every \\input expanded, the bibliography set in from main.bbl, the typesetting details of
                        gcpaper.sty set into the preamble, and the plain-language summaries (the quote environments,
                        which only the website shows) taken out
    fig01.pdf, ...      the figures, named in the order in which they appear, which is the order of their numbers

It then builds main.tex there and checks that the result has the pages of paper/main.pdf and no undefined reference
or citation, so that what is sent is what was read.
"""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys
import tarfile

PAPER = pathlib.Path(__file__).resolve().parent
OUT = PAPER / "submission"


def run(cmd, cwd):
    done = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if done.returncode:
        sys.exit(f"{' '.join(cmd)} failed:\n{done.stdout[-3000:]}\n{done.stderr[-3000:]}")
    return done.stdout


def pages(pdf: pathlib.Path) -> int:
    return int(re.search(r"Pages:\s+(\d+)", run(["pdfinfo", str(pdf)], PAPER)).group(1))


def main() -> int:
    for needed in ("main.bbl", "main.pdf"):
        if not (PAPER / needed).exists():
            sys.exit(f"paper/{needed} is missing: run `make paper` first")
    text = run(["latexpand", "--expand-bbl", "main.bbl", "main.tex"], PAPER)

    # the comment that opens main.tex is about the website
    text = text[text.index("\\documentclass"):]
    # the plain-language summaries, and the package that hid them
    text, boxes = re.subn(r"\\begin\{quote\}.*?\\end\{quote\}\n?", "", text, flags=re.S)
    assert boxes and "\\begin{quote}" not in text, "the quote environments"
    text = re.sub(r"% The summaries in plain words.*?\n% this same source\. The PDF leaves them out \(gcpaper\.sty\)\.\n", "", text, flags=re.S)
    # gcpaper.sty, set into the preamble
    sty = (PAPER / "gcpaper.sty").read_text(encoding="utf-8")
    # without its own name, and without the part that drops the summaries, which are already gone
    drops = sty.index("%\n% The summaries in plain words")
    assert sty[drops:].rstrip().endswith("\\RenewEnviron{quote}{}")
    sty = "\n".join(line for line in sty[:drops].splitlines()
                    if not line.startswith(("\\NeedsTeXFormat", "\\ProvidesPackage", "% Kept out of main.tex")))
    while sty.startswith("%\n"):
        sty = sty[2:]
    assert text.count("\\usepackage{gcpaper}\n") == 1
    text = text.replace("\\usepackage{gcpaper}\n", "\\makeatletter\n" + sty.strip() + "\n\\makeatother\n")

    # the figures, in order
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    names: dict[str, str] = {}

    def figure(m):
        src = m.group(2)
        if src not in names:
            names[src] = f"fig{len(names) + 1:02d}.pdf"
            shutil.copyfile(PAPER / src, OUT / names[src])
        return f"\\includegraphics{m.group(1)}{{{names[src]}}}"

    text = re.sub(r"\\includegraphics(\[[^\]]*\])\{(figures/[^}]+\.pdf)\}", figure, text)
    assert "figures/" not in text and "\\input{" not in text and "\\bibliography{" not in text
    (OUT / "main.tex").write_text(text, encoding="utf-8")

    # build it where it lies, with nothing else beside it, and compare
    for _ in range(3):
        run(["pdflatex", "-interaction=nonstopmode", "-halt-on-error", "main.tex"], OUT)
    log = (OUT / "main.log").read_text(encoding="utf-8", errors="replace")
    problems = [line for line in log.splitlines() if "undefined" in line.lower() or line.startswith("Overfull")]
    there, here = pages(OUT / "main.pdf"), pages(PAPER / "main.pdf")
    if problems or there != here:
        sys.exit(f"the submission builds to {there} pages against {here}, with:\n" + "\n".join(problems[:20]))
    for junk in list(OUT.glob("main.*")) + list(OUT.glob("mainNotes.bib")):
        if junk.suffix not in (".tex", ".pdf"):
            junk.unlink()
    pdf = OUT / "main.pdf"
    pdf.rename(PAPER / "submission.pdf")           # the built copy, to look at; not part of the source
    with tarfile.open(PAPER / "submission.tar.gz", "w:gz") as tar:
        for f in sorted(OUT.iterdir()):
            tar.add(f, arcname=f.name)
    size = (PAPER / "submission.tar.gz").stat().st_size / 1e6
    print(f"wrote paper/submission/ ({len(names)} figures, {boxes} summaries left out), {there} pages as paper/main.pdf, "
          f"and paper/submission.tar.gz ({size:.1f} MB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
