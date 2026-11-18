"""Receive the image service's key and keep it in design/.openai-key (not committed; never printed).

    .venv/bin/python design/setkey.py

It asks for the key with the typing hidden: paste it and press Return. Press Return alone and it takes the key from
the clipboard instead. A key can also come down a pipe (pbpaste | .venv/bin/python design/setkey.py). Whatever
arrives is tidied (quotes, spaces, a leading "Bearer" or "OPENAI_API_KEY=" are dropped), tried once against the
service, and saved only if the service accepts it.
"""
from __future__ import annotations

import getpass
import json
import os
import pathlib
import re
import subprocess
import sys
import urllib.error
import urllib.request

KEY_FILE = pathlib.Path(__file__).resolve().parent / ".openai-key"
MODEL = "gpt-image-2.6-sunburst"


def clean(text: str) -> str:
    """The key out of whatever was pasted: the first run of characters that looks like one, else the text with its
    quotes and spaces removed."""
    text = re.sub(r"\s*[\r\n]+\s*", "", text)                  # a key broken over lines by the copying
    found = re.search(r"sk-[A-Za-z0-9_\-]{20,}", text)
    if found:
        return found.group(0)
    text = text.strip().strip("\"'")
    for prefix in ("export ", "OPENAI_API_KEY=", "Authorization:", "Bearer "):
        if text.startswith(prefix):
            text = text[len(prefix):].strip().strip("\"'")
    return "".join(text.split())


def clipboard() -> str:
    try:
        return subprocess.run(["pbpaste"], capture_output=True, text=True, timeout=5).stdout
    except (OSError, subprocess.SubprocessError):
        return ""


def receive() -> tuple[str, str]:
    """The key and where it came from."""
    if not sys.stdin.isatty():
        piped = sys.stdin.read()
        if piped.strip():
            return clean(piped), "the pipe"
        return clean(clipboard()), "the clipboard"
    typed = getpass.getpass("Paste the key and press Return (nothing will show). Return alone uses the clipboard: ")
    if typed.strip():
        return clean(typed), "what you pasted"
    return clean(clipboard()), "the clipboard"


def try_key(key: str) -> tuple[int, bool | None]:
    """The service's answer to a harmless request made with the key (its list of models), and whether the image
    model is in that list. 0 means the service could not be reached."""
    req = urllib.request.Request("https://api.openai.com/v1/models", headers={"Authorization": "Bearer " + key})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            names = {m.get("id") for m in json.load(r).get("data", [])}
        return 200, MODEL in names
    except urllib.error.HTTPError as e:
        return e.code, None
    except (urllib.error.URLError, TimeoutError, OSError):
        return 0, None


def save(key: str) -> None:
    KEY_FILE.write_text(key + "\n")
    os.chmod(KEY_FILE, 0o600)


def main() -> int:
    key, source = receive()
    if len(key) < 20:
        print(f"Nothing that looks like a key came from {source} ({len(key)} characters). Nothing was saved.")
        print("Copy the key (it begins with sk-) and run this again.")
        return 1
    looks = "begins with sk-" if key.startswith("sk-") else "does NOT begin with sk-, which is unusual"
    print(f"Received {len(key)} characters from {source}; it {looks}.")
    status, has_model = try_key(key)
    if status == 200:
        save(key)
        print(f"The service accepts it. Saved to {KEY_FILE} (readable by you alone, not committed).")
        if has_model:
            print(f"The model {MODEL} is available to this key.")
        else:
            print(f"Note: {MODEL} is not in the list of models this key can use, so image requests may be refused.")
        return 0
    if status == 401:
        print("The service refused this key (HTTP 401). Nothing was saved.")
        print("Usual causes: part of the key was cut off in copying, or the key has been revoked. Copy it whole and run this again.")
        return 1
    if status == 0:
        save(key)
        print(f"The service could not be reached, so the key is saved untested in {KEY_FILE}.")
        return 0
    save(key)
    print(f"The service answered HTTP {status} to a test request, which is not a refusal of the key. Saved to {KEY_FILE}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
