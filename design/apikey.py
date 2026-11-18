"""Where the image scripts get their key: never from the command line and never from a committed file.

In order: the environment variable OPENAI_API_KEY; the file design/.openai-key (one line, not committed); and
otherwise a placeholder, for sessions whose network proxy adds the key to requests to api.openai.com.
"""
from __future__ import annotations

import os
import pathlib

KEY_FILE = pathlib.Path(__file__).resolve().parent / ".openai-key"


def bearer() -> str:
    key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not key and KEY_FILE.exists():
        key = KEY_FILE.read_text().strip()
    return "Bearer " + (key or "proxy-injected")


def explain(error) -> str:
    """One plain line for a failed request, in place of a traceback. The key is never printed."""
    try:
        import json
        detail = json.loads(error.read().decode("utf-8", "replace")).get("error", {}).get("message", "")
    except Exception:
        detail = ""
    if error.code == 401:
        have = "OPENAI_API_KEY is set" if os.environ.get("OPENAI_API_KEY", "").strip() else (
            f"{KEY_FILE.name} exists" if KEY_FILE.exists() else "no key was found")
        # the service's own message can quote part of a key, so it is not repeated here
        return (f"The image service refused the key (HTTP 401; {have}). Put the key, alone on one line, in "
                f"{KEY_FILE} or in the environment variable OPENAI_API_KEY, and run this again.")
    return f"The image service answered HTTP {error.code}: {detail or error.reason}"
