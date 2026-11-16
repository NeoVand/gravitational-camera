"""An exact base drawing for the Earth plate: layers to scale, straight lines of sight."""
import json, math
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle

R = 1.0
layers = [(1221 / 6371, "#f2d2a9"), (3480 / 6371, "#f6dfc0"), (5711 / 6371, "#faecd8"), (1.0, "#fcf4ea")]
W, H = 1536, 1024
fig = plt.figure(figsize=(W / 200, H / 200), dpi=200)
ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(-1.45, 4.45); ax.set_ylim(-1.97, 1.97); ax.set_aspect("equal"); ax.set_axis_off()
for r, col in reversed(layers):
    ax.add_patch(Circle((0, 0), r, facecolor=col, edgecolor="#333333", lw=1.2))
obs_ang = math.radians(128)
obs = np.array([math.cos(obs_ang), math.sin(obs_ang)]) * 1.0
sun = np.array([3.6, -0.18])
ax.add_patch(Circle(sun, 0.32, facecolor="#f5b04c", edgecolor="#333333", lw=1.2))
ax.plot([obs[0], sun[0]], [obs[1], sun[1]], color="#d4700f", lw=2.4, solid_capstyle="butt")
# light: the ray from the eye ends at the ground beside the observer's feet
foot = np.array([math.cos(math.radians(122)), math.sin(math.radians(122))])
eye = obs * 1.07
ax.plot([eye[0], foot[0]], [eye[1], foot[1]], color="#2a67ad", lw=2.0)
ax.plot(*obs, marker="o", ms=5, color="#333333")
fig.savefig("design/candidates/earth-base.png", dpi=200)
json.dump({"obs": obs.tolist(), "sun": sun.tolist(), "xlim": [-1.45, 4.45], "ylim": [-1.97, 1.97], "W": W, "H": H,
           "radii": [r for r, _ in layers]}, open("design/candidates/earth-base.json", "w"))
print("ok")
