"""Prototype: an engraving drawn by code, with exact geometry (Fig. 2, what a pixel feels)."""
import math, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
from matplotlib.patches import Circle, FancyArrowPatch
sys.path.insert(0, "/home/user/gravitational-camera/paper/figures")
import make_figures as mf

INK, ACCENT, ACCENT2 = mf.INK, mf.ACCENT, mf.ACCENT2
LIGHT = np.array([-0.55, 0.62, 0.56]); LIGHT /= np.linalg.norm(LIGHT)


def _basis(k):
    k = k / np.linalg.norm(k)
    a = np.array([0.0, 0.0, 1.0]) if abs(k[2]) < 0.9 else np.array([1.0, 0, 0])
    e1 = np.cross(k, a); e1 /= np.linalg.norm(e1)
    return k, e1, np.cross(k, e1)


def engraved_sphere(ax, c, R, lines=30, axis=(-0.22, 1.0, 0.3), wmax=0.55, color=INK, cross=True, z=2,
                    tint=None, outline=0.4):
    """Engraved sphere: lines of latitude about a near-vertical axis, so they run from the lit side to the
    shadow; each line's width grows with the shadow (Lambert, light from the upper left), vanishing in the
    highlight; a second, finer family crosses them only in the core shadow."""
    if tint is not None:
        ax.add_patch(Circle(c, R, facecolor=tint, edgecolor="none", zorder=z - 0.5))
    segs, widths = [], []
    fams = [(np.array(axis, float), lines, 0.10, 1.0)]
    if cross:
        fams.append((np.array([1.0, 0.55, 0.25]), int(lines * 0.9), 0.62, 0.6))
    for k0, n, thr, scale in fams:
        k, e1, e2 = _basis(k0)
        for th in np.linspace(0, math.pi, n + 2)[1:-1]:
            phi = np.linspace(0, 2 * math.pi, 500)
            pts = (np.cos(th) * k[None, :] + np.sin(th) * (np.cos(phi)[:, None] * e1 + np.sin(phi)[:, None] * e2))
            vis = pts[:, 2] > 0.0
            lam = np.clip(pts @ LIGHT, 0, 1)
            dark = 1 - lam
            # reflected light just inside the limb on the shadow side
            dark = dark - 0.18 * np.clip(1 - pts[:, 2] / 0.35, 0, 1) * (lam < 0.05)
            t = np.clip((dark - thr) / (1 - thr), 0, 1)
            w = scale * wmax * t ** 1.6
            xy = np.asarray(c) + R * pts[:, :2]
            for i in range(len(phi) - 1):
                if vis[i] and vis[i + 1] and w[i] > 0.03:
                    segs.append([xy[i], xy[i + 1]]); widths.append(w[i])
    ax.add_collection(LineCollection(segs, linewidths=widths, colors=color, capstyle="butt", zorder=z))
    if outline:
        ax.add_patch(Circle(c, R, fill=False, lw=outline, edgecolor=color, zorder=z + 0.1))


def bead(ax, c, r, faint=False):
    if faint:
        ax.add_patch(Circle(c, r, facecolor="white", lw=0.4, edgecolor="#c4c0b6", zorder=3.5))
        return
    engraved_sphere(ax, c, r, lines=6, wmax=0.42, cross=False, z=4, tint="white", outline=0.45)


def arrow(ax, p, q, color=INK, lw=0.5, head=3.2):
    ax.add_patch(FancyArrowPatch(p, q, arrowstyle=f"-|>,head_length={head},head_width={0.4*head}",
                                 mutation_scale=1, color=color, lw=lw, shrinkA=0, shrinkB=0, zorder=5))


def ring(ax, centre, sx, sy, angle=0.0, n=12, r=1.0, beadr=0.075, faint=False, arrows=None):
    """n beads on the ellipse x = sx r cos(phi), y = sy r sin(phi), turned by angle; an exact curve through them."""
    ca, sa = math.cos(angle), math.sin(angle)
    rot = np.array([[ca, -sa], [sa, ca]])
    phi = np.linspace(0, 2 * math.pi, 361)
    curve = (rot @ np.vstack([sx * r * np.cos(phi), sy * r * np.sin(phi)])).T + centre
    ax.plot(*curve.T, color="#c4c0b6" if faint else INK, lw=0.45, zorder=3, ls=(0, (1.5, 1.5)) if faint else "-")
    ph = (np.arange(n) + 0.0) * 2 * math.pi / n
    pts = (rot @ np.vstack([sx * r * np.cos(ph), sy * r * np.sin(ph)])).T + centre
    for p in pts:
        bead(ax, p, beadr, faint)
    if arrows is not None:
        base = (rot @ np.vstack([r * np.cos(ph), r * np.sin(ph)])).T
        for p, b in zip(pts, base):
            d = arrows(rot.T @ b)
            d = rot @ d
            arrow(ax, p + 0.11 * d / max(np.linalg.norm(d), 1e-9), p + 0.11 * d / max(np.linalg.norm(d), 1e-9) + 0.16 * d,
                  lw=0.45)
    return pts


def main():
    mf.setup_fonts()
    fig, axes = plt.subplots(1, 3, figsize=(mf.FULL, 2.45), gridspec_kw={"wspace": 0.02, "width_ratios": [1.35, 1, 1]})
    for ax in axes:
        ax.set_aspect("equal"); ax.set_axis_off()
    # (a) beside a mass: E = (GM/r^3) diag(-2, 1, 1) along the line to it; the ring goes to (1 + 2e, 1 - e)
    a = axes[0]
    e = 0.17
    engraved_sphere(a, (-1.95, 0), 1.05, lines=34, wmax=0.62)
    a.text(-1.95, -1.32, r"$M$", ha="center", va="top", fontsize=10)
    a.add_patch(Circle((0.9, 0), 1.0, fill=False, lw=0.5, ls=(0, (2.5, 2)), edgecolor=mf.DIM, zorder=1))
    ring(a, np.array([0.9, 0]), 1 + 2 * e, 1 - e, arrows=lambda b: np.array([2 * b[0], -b[1]]))
    a.set_xlim(-3.05, 2.45); a.set_ylim(-1.6, 1.45)
    a.text(-3.0, 1.38, r"(a)", fontsize=9, va="top")
    # (b) and (c): a wave travelling out of the page; + and x, with the opposite phase faint
    for ax, ang, lab, name in ((axes[1], 0.0, r"$h_+$", "(b)"), (axes[2], math.pi / 4, r"$h_\times$", "(c)")):
        w = 0.22
        ax.add_patch(Circle((0, 0), 1.0, fill=False, lw=0.5, ls=(0, (2.5, 2)), edgecolor=mf.DIM, zorder=1))
        ring(ax, np.array([0.0, 0.0]), 1 - w, 1 + w, angle=ang, faint=True)
        ring(ax, np.array([0.0, 0.0]), 1 + w, 1 - w, angle=ang, arrows=lambda b: np.array([b[0], -b[1]]))
        ax.set_xlim(-1.62, 1.62); ax.set_ylim(-1.6, 1.45)
        ax.text(-1.58, 1.38, name + r"\ \ " + lab, fontsize=9, va="top")
    out = "/tmp/claude-0/-home-user-gravitational-camera/0b74e2ed-9878-585a-80f7-afc750134975/scratchpad/engrave/tidal-code"
    fig.savefig(out + ".pdf", bbox_inches="tight", pad_inches=0.02)
    fig.savefig(out + ".png", dpi=300, bbox_inches="tight", pad_inches=0.02)
    print("ok")

main()
