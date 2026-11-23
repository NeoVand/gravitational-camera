// Shared tools for the five diagrams of the tutorial's chapter 1.3 (tutorial/newton/gauss-and-poisson.md):
// tut-gauss-solid-angle, tut-gauss-crossings, tut-gauss-box, tut-gauss-cone-box and tut-gauss-pillbox. Not a figure
// itself. The strokes, heads, dots, labels and the cropping are those of chapter 1.1's diagrams (figs/tut-vec-lib.js,
// imported, not copied), so that the three chapters look alike; this file adds what a solid body drawn in true 3D
// needs: a flat face filled with a tint, a polygon's edges with the hidden ones dashed, a small stone ball for a
// point mass, the arc of an angle, and a closed curve sampled finely.
import { THREE, v3, INK, DIM } from '../lib.js';
import { IRON } from '../stone.js';
import { DASH, HAIR, near, checker } from './tut-vec-lib.js';

export { IRON };

// the site's tints (app/src/lib/paper/drawing.ts, THEME), swapped for each theme
export const TINT = '#eeebe5';            // a neutral tint of the page: a surface, a region
export const TINT_ACCENT = '#f3dfcb';     // a pale tint of the first accent (orange)
export const TINT_ACCENT2 = '#dce7f3';    // a pale tint of the second accent (blue)

export const EDGE = 0.55;                 // the edges of a body or a surface (tut-pot-lib's LINE)
export const BALL = 3.3;                  // a point mass, a small stone ball, radius in points (as in tut-pot-well)

/** The unit vector of a three.js vector. */
export const unitv = (p) => p.clone().normalize();

/** A flat face through world points, filled with `fill` (no stroke), at `layer`. */
export function face(ink, pts, fill, layer = -1) {
	ink.P.polygon(pts, { fill, layer });
}

/** The edges of a closed polygon of world points, each edge drawn solid or, if `hidden(i)` says so, dashed. */
export function edges(ink, pts, { color = INK, width = EDGE, layer = 1, hidden = () => false, what = 'an edge' } = {}) {
	for (let i = 0; i < pts.length; i++) {
		const a = pts[i], b = pts[(i + 1) % pts.length];
		ink.line(a, b, { color, width: hidden(i) ? HAIR : width, layer: hidden(i) ? layer - 0.5 : layer, dash: hidden(i) ? DASH : null, what: `${what} ${i}` });
	}
}

/** A point mass at the world point c: a small lit stone ball `r` points across in radius, over the strokes. */
export function ball(ink, c, { r = BALL, layer = 6, what = 'the mass' } = {}) {
	ink.P.sphere(c, r / ink.P.scale, IRON, { spec: 0.45, shininess: 30, layer });
	ink.mark([ink.at(c)], r, what);
}

/** The arc of the angle at the world point C from the unit vector a toward the unit vector b, radius rho (world). */
export function arc(ink, C, a, b, rho, { color = DIM, width = HAIR, layer = 1, n = 120, what = 'an angle' } = {}) {
	const check = checker(ink.name);
	const ang = Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
	const w = b.clone().addScaledVector(a, -a.dot(b)).normalize();
	check(near(w.dot(a), 0, 1e-12), 'the arc\'s plane is not spanned by its two directions');
	const pts = Array.from({ length: n + 1 }, (_, k) => {
		const t = (ang * k) / n;
		return C.clone().addScaledVector(a, rho * Math.cos(t)).addScaledVector(w, rho * Math.sin(t));
	});
	ink.curve(pts, { color, width, layer, what });
	return { ang, mid: C.clone().addScaledVector(a, rho * Math.cos(ang / 2)).addScaledVector(w, rho * Math.sin(ang / 2)) };
}

/** The camera's axes in world coordinates: right, up and toward the viewer (unit vectors). */
export function cameraAxes(P) {
	const inv = P.rot.clone().invert();
	return [v3(1, 0, 0), v3(0, 1, 0), v3(0, 0, 1)].map((e) => e.applyMatrix4(inv).normalize());
}

/** Points along the segment a-b (world), no two more than `step` points apart on the page. */
export function fine(ink, a, b, step = 0.25) {
	const A = ink.at(a), B = ink.at(b);
	const n = Math.max(1, Math.ceil(Math.hypot(B[0] - A[0], B[1] - A[1]) / step));
	return Array.from({ length: n + 1 }, (_, i) => a.clone().lerp(b, i / n));
}

export { THREE };
