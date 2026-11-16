"""Engrave an exact drawing: send a base image drawn by code to the image model's edit endpoint.

    python3 design/imageedit.py BASE.png PROMPT.txt OUT.png

The base carries the geometry (drawn from data and exact maths); the prompt asks
for a style and forbids moving anything. Every result must then pass a
geometric check against the base before it is used (see design/FIGURE_PLAN.md).
The key is added by the session's network proxy; the header is a placeholder.
"""
import base64, json, sys, urllib.request, uuid, pathlib
def edit(image_path, prompt, out, quality="high", size="1536x1024", model="gpt-image-2.6-sunburst"):
    boundary = uuid.uuid4().hex
    parts = []
    def field(name, value):
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode())
    field("model", model); field("prompt", prompt); field("size", size); field("quality", quality)
    data = pathlib.Path(image_path).read_bytes()
    parts.append((f'--{boundary}\r\nContent-Disposition: form-data; name="image[]"; filename="base.png"\r\n'
                  f'Content-Type: image/png\r\n\r\n').encode() + data + b"\r\n")
    parts.append(f"--{boundary}--\r\n".encode())
    req = urllib.request.Request("https://api.openai.com/v1/images/edits", data=b"".join(parts), headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}", "Authorization": "Bearer proxy-injected"})
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        print(e.read().decode()[:800]); raise
    pathlib.Path(out).write_bytes(base64.b64decode(d["data"][0]["b64_json"]))
if __name__ == "__main__":
    edit(sys.argv[1], open(sys.argv[2]).read(), sys.argv[3])
    print("wrote", sys.argv[3])
