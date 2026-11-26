// Shared tools for the four diagrams of the tutorial's section 3.2 (tutorial/noise/random-signals.md):
// tut-noise-hero, tut-noise-red-white, tut-noise-patch and tut-noise-points. Not a figure itself. The charts take
// section 3.1's sheet, axes and colours (figs/tut-prob-lib.js, imported, not copied): the noise in the second accent
// (blue), the signal in the first (orange), a trace in neutral ink. What this file adds is the array, drawn as the
// paper's figures draw it (figs/tut-blur.js): a plate of square pixels seen from above at a slant, with its thickness
// along the near edges, each pixel a tile; and the same plate raised into columns, one per ripple, for a spectrum.
//
// A view maps the plate's world (x to the right, y away from the viewer, z up; one unit is the plate's side) to the
// sheet's figure points by an orthographic projection: a turn about the vertical, then a tilt toward the viewer.
// Everything a plate draws is remembered on the sheet (its outline as a mark, its face as a region that no label may
// enter), so that section 1.2's checks of the labels hold for it too.
import { PAGE } from '../lib.js';
import { n2, checker } from './tut-pot-lib.js';
import { INK, DIM, ACCENT, ACCENT2, pathOf } from './tut-prob-lib.js';

export const TILE_LINE = 0.2;          // the borders between tiles, as figs/tut-blur.js
export const EDGE = 0.4;               // a plate's outline
export const DEEP = 0.85;              // the strongest tile's opacity
export const CLIP = 2.5;               // a tile is at its strongest at this many standard deviations

/** An orthographic view: `turn` about the vertical and `tilt` above the horizon (degrees; 90 looks straight down),
 * `scale` points per unit, the world's origin at the figure point `o`. */
export class View {
	constructor({ turn, tilt, scale, o }) {
		const t = (turn * Math.PI) / 180, f = (tilt * Math.PI) / 180;
		Object.assign(this, { c: Math.cos(t), s: Math.sin(t), cf: Math.cos(f), sf: Math.sin(f), scale, o });
	}
	/** The figure point of the world point [x, y, z]. */
	at([x, y, z = 0]) {
		const xr = x * this.c - y * this.s, yr = x * this.s + y * this.c;
		return [this.o[0] + this.scale * xr, this.o[1] - this.scale * (yr * this.sf + z * this.cf)];
	}
	/** How far toward the viewer a world point (or direction) lies. */
	depth([x, y, z = 0]) {
		const yr = x * this.s + y * this.c;
		return -yr * this.cf + z * this.sf;
	}
}

/** Whether the figure point q lies inside the convex polygon `poly` (figure points). */
function insidePoly(poly, q) {
	let sign = 0;
	for (let i = 0; i < poly.length; i++) {
		const a = poly[i], b = poly[(i + 1) % poly.length];
		const c = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]);
		if (Math.abs(c) < 1e-12) continue;
		if (sign === 0) sign = Math.sign(c);
		else if (Math.sign(c) !== sign) return false;
	}
	return true;
}

/** Regions no label may enter: a list of convex polygons (figure points), kept beside a sheet. */
export class Regions {
	constructor(name) { this.name = name; this.list = []; }
	add(poly, what) { this.list.push({ poly, what }); }
	/** Every label's box stays out of every region: none of its corners or its centre inside one, and no corner of a
	 * region inside the box. (Its air from the regions' outlines is the sheet's own check.) */
	check(labels) {
		const check = checker(this.name);
		for (const l of labels) {
			const b = l.box, pts = [[b.l, b.t], [b.r, b.t], [b.r, b.b], [b.l, b.b], [(b.l + b.r) / 2, (b.t + b.b) / 2]];
			for (const r of this.list) {
				check(!pts.some((q) => insidePoly(r.poly, q)), `the label ${l.src} lies on ${r.what}`);
				check(!r.poly.some(([x, y]) => x > b.l && x < b.r && y > b.t && y < b.b), `${r.what} reaches into the label ${l.src}`);
			}
		}
	}
}

/** The fill of a reading v (in standard deviations) on the diverging scale of the array's tiles: orange for a
 * positive reading and blue for a negative one, as the paper colours a stretch and a squeeze (figs/tut-blur.js), its
 * opacity on the page growing in proportion to |v| up to DEEP at CLIP standard deviations. */
export const diverging = (v) => ({ color: v >= 0 ? ACCENT : ACCENT2, opacity: Math.min(1, Math.abs(v) / CLIP) * DEEP });

/** A square plate of n by n tiles, side 1, centred on the origin at the height z0, of thickness `thick` (world
 * units), drawn on the sheet S in the view V from the layer `layer` up. `tile(i, j)` gives each tile's fill
 * ({ color, opacity }, or null for the bare page), i across and j away from the viewer; the tiles are separated by thin
 * borders. Returns the plate's corners and a function from a pixel's place (i, j, fractions within it) to the world. */
export function plate(S, V, R, { n, tile, z0 = 0, thick = 0.025, layer = 1, what = 'the plate', top = PAGE } = {}) {
	const c = 1 / n, h = 0.5;
	const W = (x, y, z = z0) => [x - h, y - h, z];
	const P = (p) => V.at(p);
	const corners = [W(0, 0), W(1, 0), W(1, 1), W(0, 1)];
	const face = corners.map(P);
	// the thickness along the near edges: the front (facing -y) and whichever side faces the viewer, each a pale band
	const sides = [];
	if (V.depth([0, -1, 0]) > 0) sides.push([W(0, 0), W(1, 0)]);
	if (V.depth([1, 0, 0]) > 0) sides.push([W(1, 0), W(1, 1)]);
	if (V.depth([-1, 0, 0]) > 0) sides.push([W(0, 1), W(0, 0)]);
	let g = `<path d="${pathOf(face)}" fill="${top}"/>`;
	// each band the page with the studio's veil over it (at least a quarter), so that it reads darker than the top in
	// both themes
	for (const [a, b] of sides) {
		const q = pathOf([a, b, [b[0], b[1], z0 - thick], [a[0], a[1], z0 - thick]].map(P));
		const nrm = Math.abs(a[1] - b[1]) < 1e-12 ? [0, -1, 0] : [Math.sign(a[0]), 0, 0];
		g += `<path d="${q}" fill="${PAGE}"/><path d="${q}" fill="${SHADOW}" fill-opacity="${Math.max(0.25, veil(V, nrm)).toFixed(3)}"/>`;
	}
	S.raw(g, layer);
	// the tiles
	let t = '';
	for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
		const f = tile ? tile(i, j) : null;
		if (!f || f.opacity <= 0) continue;
		const q = [W(i * c, j * c), W((i + 1) * c, j * c), W((i + 1) * c, (j + 1) * c), W(i * c, (j + 1) * c)].map(P);
		t += `<path d="${pathOf(q)}" fill="${f.color}" fill-opacity="${f.opacity.toFixed(3)}"/>`;
	}
	S.raw(t, layer + 0.1);
	// the borders between tiles, then the outline of the top and of the thickness
	let d = '';
	for (let k = 1; k < n; k++) {
		d += pathOf([P(W(k * c, 0)), P(W(k * c, 1))], false) + pathOf([P(W(0, k * c)), P(W(1, k * c))], false);
	}
	S.raw(`<path d="${d}" fill="none" stroke="${DIM}" stroke-width="${TILE_LINE}"/>`, layer + 0.2);
	let o = pathOf(face);
	for (const [a, b] of sides) o += pathOf([a, [a[0], a[1], z0 - thick], [b[0], b[1], z0 - thick], b].map(P), false);
	S.raw(`<path d="${o}" fill="none" stroke="${DIM}" stroke-width="${EDGE}" stroke-linejoin="round"/>`, layer + 0.3);
	S.mark([...face, face[0]], EDGE / 2, what);
	for (const [a, b] of sides) S.mark([a, [a[0], a[1], z0 - thick], [b[0], b[1], z0 - thick], b].map(P), EDGE / 2, `${what}'s edge`);
	// the plate with its thickness, as one convex region
	const all = [...corners, ...corners.map(([x, y]) => [x, y, z0 - thick])].map(P);
	R.add(hull(all), what);
	return { face, at: (i, j, fi = 0.5, fj = 0.5, z = z0) => W((i + fi) * c, (j + fj) * c, z) };
}

/** The studio's light (lib.js, shadeNormal: the key, the fill, the wrap) on a face whose world normal is `n`, against
 * that on an upward face, turned into a veil: the opacity of SHADOW laid over the face. A face lit as the top gets no
 * veil; one turned from the key gets a darker one. The veil's colour is fixed, not swapped by the site's theme, so a
 * box reads lit from above on the light page and on the dark one alike, as figs/tut-blur.js shades its block. */
export const SHADOW = '#2b2418';             // figs/tut-blur.js, CUT: the stone's ink, dark in both themes
const SIDE_VEIL = 0.35;                      // a slab's side at most this dark, so that it keeps its colour
const KEY = [-0.55, 0.72, 0.62], FILL = [0.85, -0.15, 0.5];
const unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
export function veil(V, n) {
	const cam = ([x, y, z]) => { const xr = x * V.c - y * V.s, yr = x * V.s + y * V.c; return [xr, yr * V.sf + z * V.cf, -yr * V.cf + z * V.sf]; };
	const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	const light = (w) => { const m = cam(w); return 0.3 + 0.8 * Math.max(0, (dot(m, unit(KEY)) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(m, unit(FILL))); };
	return Math.max(0, Math.min(0.6, 1 - light(n) / light([0, 0, 1])));
}

/** A spectrum that is the same on every wavevector of an n by n grid: a slab on a square of side 1 (centred on the
 * origin), `height` world units tall, its top divided into the grid's cells and its near sides into the cells' columns.
 * Each face is the page, the colour `color` at the opacity `tint` over it (the same on every face), and the studio's
 * veil over that. Returns the figure point of the top's centre. */
export function slab(S, V, R, { n, height: z, color, tint = 0.3, layer = 1, what = 'the slab' }) {
	const c = 1 / n, h = 0.5;
	const P = (p) => V.at(p);
	const face = (pts, nrm) => {
		const d = pathOf(pts.map(P));
		const v = Math.min(SIDE_VEIL, veil(V, nrm));
		return `<path d="${d}" fill="${PAGE}"/><path d="${d}" fill="${color}" fill-opacity="${tint}"/>` + (v > 0.005 ? `<path d="${d}" fill="${SHADOW}" fill-opacity="${v.toFixed(3)}"/>` : '');
	};
	const sides = [];
	if (V.depth([0, -1, 0]) > 0) sides.push({ a: [-h, -h], b: [h, -h], n: [0, -1, 0], along: (k) => [-h + k * c, -h] });
	if (V.depth([1, 0, 0]) > 0) sides.push({ a: [h, -h], b: [h, h], n: [1, 0, 0], along: (k) => [h, -h + k * c] });
	if (V.depth([-1, 0, 0]) > 0) sides.push({ a: [-h, h], b: [-h, -h], n: [-1, 0, 0], along: (k) => [-h, h - k * c] });
	const top = [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]];
	let g = face(top, [0, 0, 1]);
	for (const s of sides) g += face([[...s.a, 0], [...s.b, 0], [...s.b, z], [...s.a, z]], s.n);
	S.raw(g, layer);
	// the grid: the cells on the top, the columns on the near sides
	let d = '';
	for (let k = 1; k < n; k++) {
		d += pathOf([P([-h + k * c, -h, z]), P([-h + k * c, h, z])], false) + pathOf([P([-h, -h + k * c, z]), P([h, -h + k * c, z])], false);
		for (const s of sides) { const [x, y] = s.along(k); d += pathOf([P([x, y, 0]), P([x, y, z])], false); }
	}
	S.raw(`<path d="${d}" fill="none" stroke="${DIM}" stroke-width="${TILE_LINE}"/>`, layer + 0.2);
	// the outline: the top, the near sides' lower edges and their upright edges
	let o = pathOf(top.map(P));
	for (const s of sides) o += pathOf([P([...s.a, z]), P([...s.a, 0]), P([...s.b, 0]), P([...s.b, z])], false);
	S.raw(`<path d="${o}" fill="none" stroke="${DIM}" stroke-width="${EDGE}" stroke-linejoin="round"/>`, layer + 0.3);
	S.mark([...top, top[0]].map(P), EDGE / 2, what);
	for (const s of sides) S.mark([P([...s.a, z]), P([...s.a, 0]), P([...s.b, 0]), P([...s.b, z])], EDGE / 2, `${what}'s side`);
	const base = [[-h, -h, 0], [h, -h, 0], [h, h, 0], [-h, h, 0]];
	R.add(hull([...base, ...top].map(P)), what);
	return { centre: P([0, 0, z]), top: top.map(P) };
}

/** The convex hull of figure points (monotone chain). */
export function hull(pts) {
	const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const lo = [], up = [];
	for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
	for (const q of [...p].reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
	return [...lo.slice(0, -1), ...up.slice(0, -1)];
}

/** The mean over many maps of |f~(k)|^2 / A on the grid k = (2 pi / L)(p, q), p and q from -h to h (n = 2h + 1 a
 * side), for maps given as sums of weighted points: `draw()` returns { x, y, w } arrays (places in [0, L), weights).
 * The phases are separable, e^{-i(k1 x + k2 y)} = e^{-i k1 x} e^{-i k2 y}, so each point costs 2n phases and n^2
 * products. Returns an n by n array [i][j], i along k1 and j along k2, index h the zero wavevector. */
export function meanPower(draw, { n, L, maps }) {
	const h = (n - 1) / 2, A = L * L;
	const sum = Array.from({ length: n }, () => new Float64Array(n));
	const cx = new Float64Array(n), sx = new Float64Array(n), cy = new Float64Array(n), sy = new Float64Array(n);
	const re = Array.from({ length: n }, () => new Float64Array(n)), im = Array.from({ length: n }, () => new Float64Array(n));
	for (let m = 0; m < maps; m++) {
		for (let i = 0; i < n; i++) { re[i].fill(0); im[i].fill(0); }
		const { x, y, w } = draw();
		for (let k = 0; k < x.length; k++) {
			for (let p = 0; p < n; p++) {
				const a = (-2 * Math.PI * (p - h) * x[k]) / L, b = (-2 * Math.PI * (p - h) * y[k]) / L;
				cx[p] = Math.cos(a); sx[p] = Math.sin(a); cy[p] = Math.cos(b); sy[p] = Math.sin(b);
			}
			const wk = w[k];
			for (let i = 0; i < n; i++) {
				const ri = re[i], ii = im[i], a = cx[i] * wk, b = sx[i] * wk;
				for (let j = 0; j < n; j++) { ri[j] += a * cy[j] - b * sy[j]; ii[j] += a * sy[j] + b * cy[j]; }
			}
		}
		for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) sum[i][j] += (re[i][j] ** 2 + im[i][j] ** 2) / A;
	}
	return sum.map((r) => Array.from(r, (v) => v / maps));
}

export { n2 };

/** A dimension line on the plate's plane (world points a and b, z = 0), set `gap` world units out along the in-plane
 * unit vector u, with a short stroke across each end along u; returns the figure points of its middle and of the
 * outward direction on the page (a unit vector), for its label. */
export function dimension3(S, V, a, b, u, { gap = 0.05, end = 0.014, color = DIM, width = 0.45, layer = 3, what = 'a dimension' } = {}) {
	const off = (p, s) => [p[0] + u[0] * s, p[1] + u[1] * s, p[2] ?? 0];
	const A = V.at(off(a, gap)), B = V.at(off(b, gap));
	S.path([A, B], { color, width, layer, cap: 'butt', what });
	for (const p of [a, b]) S.path([V.at(off(p, gap - end)), V.at(off(p, gap + end))], { color, width, layer, cap: 'butt', what: `${what}'s end` });
	const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
	const q = V.at(off([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], gap + 1));
	const d = Math.hypot(q[0] - m[0], q[1] - m[1]);
	return { mid: m, out: [(q[0] - m[0]) / d, (q[1] - m[1]) / d], ends: [A, B] };
}
