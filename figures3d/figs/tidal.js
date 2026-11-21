// Figure 2: what a pixel feels. A ring of twelve free test masses beside a mass, and in a passing wave
// of either polarization. Exact: the ring's shape (beside a mass the tidal tensor is
// (GM/r^3) diag(-2, 1, 1) along the line to it, so a ring of radius 1 becomes the ellipse with
// semi-axes 1 + 2e and 1 - e; in a wave, 1 + e and 1 - e), the beads' places on it, and each arrow,
// the tidal acceleration -E xi at the bead, in direction and (one scale for the three panels) in length.
// Exaggerated: e. Schematic: the planet's size and distance.
import { Panel, v3, ellipsePoints, figure, letter, INK, DIM, RULE, PAGE } from '../lib.js';

// one column: (a) across the top, (b) and (c) side by side beneath it, all at one scale (SCALE points to the
// undisturbed ring's radius), so that the dashed rings are the same size in the three panels. Each row is as tall
// as what it holds: (a) the dashed circle, (b) and (c) the ghost ring, radius 1 + s plus a bead; GAP of air between.
// REACH: the arrows' length per unit of tidal acceleration. An arrow's head is HEAD points long, or two fifths of
// the arrow if that is less, so that the shortest, at the top and bottom of (a) and in (b) and (c), keep a shaft.
const W = 246, SCALE = 40, BEAD = 0.075, REACH = 0.2, HEAD = 3.2;
const TOP = 2 * SCALE + 4, GAP = 18, LOW = Math.ceil(2 * (1.2 + BEAD) * SCALE) + 4;
const ROW = TOP + GAP, H = ROW + LOW;
const STEEL = '#868b92', STONE = '#cdbca3';
const UNDISTURBED = [2.4, 2], PALE = [1.4, 1.4];   // the dashes of the undisturbed circle and of the pale ring
// Each arrow starts TAIL points clear of its bead. Where the push runs nearly along the ring (the beads near
// 1, 5, 7 and 11 o'clock), the arrow would lie on the ring's stroke: it is moved sideways, off the ring, by up to
// ASIDE points, in proportion to how nearly it runs along the ring (not at all for an arrow across it).
const TAIL = 1.35, ASIDE = 1.1;
// HALO: the page-coloured margin of an arrow over a pale bead; CLEAR: no dash of a dashed line within this many
// points of an arrow's axis (half the head's width, the halo and the dash's own half-width)
const HALO = 0, CLEAR = 0.36 * HEAD + 0.55 + 0.6;
// The ink of a panel letter starts this far right of where it is set (the side bearing of its parenthesis), so
// the drawings' outer edges are set this far inside the page, and the figure's ink has equal margins.
const BEARING = 0.72;

function ring(P, centre, sx, sy, angle, accel, ghost = false) {
	const ca = Math.cos(angle), sa = Math.sin(angle);
	const turn = (x, y) => v3(ca * x - sa * y, sa * x + ca * y, 0);
	const layer = ghost ? -1 : 0;
	// the solid ring; the pale one is dashed afterwards, clear of the arrows (dashed())
	if (!ghost) P.curve(ellipsePoints(centre[0], centre[1], -0.01, sx, sy, angle), { color: INK, width: 0.65, layer });
	for (let k = 0; k < 12; k++) {
		const t = (2 * Math.PI * k) / 12;
		const p = turn(sx * Math.cos(t), sy * Math.sin(t)).add(v3(centre[0], centre[1], 0));
		P.sphere(p, BEAD, STEEL, ghost ? { layer, opacity: 0.3, spec: 0.3 } : { layer, spec: 0.6, shininess: 36 });
		if (!accel) continue;
		const [ax, ay] = accel(Math.cos(t), Math.sin(t));
		const a = turn(ax, ay);
		const u = a.clone().normalize();
		// the ring's tangent at the bead, along the branch on the arrow's side, and the way off it
		let tan = turn(-sx * Math.sin(t), sy * Math.cos(t)).normalize();
		const along = u.dot(tan);
		if (along < 0) tan.negate();
		const off = u.clone().multiplyScalar(u.dot(tan)).sub(tan);
		const from = p.clone().addScaledVector(u, BEAD + TAIL / SCALE);
		if (off.length() > 1e-9) from.addScaledVector(off.normalize(), (ASIDE * Math.abs(along)) / SCALE);
		const L = a.length() * REACH * SCALE;
		// a halo of the page's colour beneath each arrow cuts the pale beads (layer -1) clear of it
		P.arrow(from, from.clone().addScaledVector(a, REACH), { width: 0.55, head: Math.min(HEAD, 0.4 * L), halo: HALO, haloLayer: -0.5 });
	}
}

/** A closed curve (world points) dashed `on`, `off` points, as separate dashes, a whole number of them so that the
 * pattern closes; a dash that would pass within CLEAR points of an arrow is left out whole, so that no stub of one
 * stands beside an arrow. */
function dashed(P, points, [on, off], style) {
	const F = points.map((q) => P.at(q));
	const arrows = P.items.filter((it) => it.kind === 'arrow' && it.color !== PAGE).map((it) => [P.at(it.a), P.at(it.b)]);
	const near = (q) => arrows.some(([A, B]) => {
		const d = [B[0] - A[0], B[1] - A[1]], t = Math.max(0, Math.min(1, ((q[0] - A[0]) * d[0] + (q[1] - A[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2)));
		return Math.hypot(q[0] - A[0] - t * d[0], q[1] - A[1] - t * d[1]) < CLEAR;
	});
	const s = [0];
	for (let i = 1; i < F.length; i++) s.push(s[i - 1] + Math.hypot(F[i][0] - F[i - 1][0], F[i][1] - F[i - 1][1]));
	const total = s[s.length - 1], n = Math.round(total / (on + off)), period = total / n, dash = (on * period) / (on + off);
	// the world point at arc length x (wrapping)
	const at = (x) => {
		x = ((x % total) + total) % total;
		let i = 1;
		while (s[i] < x) i++;
		const f = (x - s[i - 1]) / (s[i] - s[i - 1] || 1);
		return points[i - 1].clone().lerp(points[i], f);
	};
	for (let k = 0; k < n; k++) {
		const x0 = k * period - dash / 2, steps = 6;
		const pts = Array.from({ length: steps + 1 }, (_, j) => at(x0 + (dash * j) / steps));
		if (pts.some((q) => near(P.at(q)))) continue;
		P.curve(pts, style);
	}
}

/** The horizontal reach of a panel's ink, in figure points: beads, strokes and arrows (not their halos). */
function extent(P) {
	let lo = Infinity, hi = -Infinity;
	const take = (x, r) => { lo = Math.min(lo, x - r); hi = Math.max(hi, x + r); };
	for (const it of P.items) {
		if (it.kind === 'sphere') take(P.at(it.c)[0], it.r * P.scale);
		else if (it.kind === 'curve') for (const q of it.points) take(P.at(q)[0], it.width / 2);
		else if (it.kind === 'arrow' && it.color !== PAGE) {
			const A = P.at(it.a), B = P.at(it.b);
			const L = Math.hypot(B[0] - A[0], B[1] - A[1]), hd = Math.min(it.head, 0.6 * L);
			const n = [-(B[1] - A[1]) / L, (B[0] - A[0]) / L];
			take(A[0], 0);
			take(B[0], 0);
			for (const s of [1, -1]) take(B[0] - ((B[0] - A[0]) / L) * hd + s * n[0] * 0.36 * hd, 0);
		}
	}
	return [lo, hi];
}

export default async function () {
	const e = 0.16, s = 0.2;
	// (a): the planet and the ring, centred across the column; the dashed circle's top level with the panel letter
	const a = new Panel({ x: 0, y: 0, w: W, h: TOP, cx: 0, cy: 0, scale: SCALE });
	a.sphere(v3(-1.6, 0, 0), 0.55, STONE, { spec: 0.1, shininess: 10, wrap: 0.45, ambient: 0.34 });
	ring(a, [0.95, 0], 1 + 2 * e, 1 - e, 0, (x, y) => [2 * x, -y]);
	dashed(a, ellipsePoints(0.95, 0, -0.2, 1, 1), UNDISTURBED, { color: DIM, width: 0.5, layer: -2 });
	const [al, ar] = extent(a);
	a.x += W / 2 - (al + ar) / 2;
	a.labels.push(letter('a', 0));
	a.label('M', v3(-1.6, -0.68, 0), { anchor: 'ct', size: 9.5 });

	// (b), (c): each ring with its arrows reaching the page's margin on the outer side, (b) at the left and (c) at
	// the right, and each panel's letter over the left edge of its drawing
	const panels = [a];
	for (const [k, angle, name] of [[0, 0, ['b', 'h_+']], [1, Math.PI / 4, ['c', 'h_\\times']]]) {
		const P = new Panel({ x: 0, y: ROW, w: 0, h: LOW, scale: SCALE });
		ring(P, [0, 0], 1 - s, 1 + s, angle, null, true);
		ring(P, [0, 0], 1 + s, 1 - s, angle, (x, y) => [x, -y]);
		dashed(P, ellipsePoints(0, 0, -0.2, 1, 1), UNDISTURBED, { color: DIM, width: 0.5, layer: -2 });
		dashed(P, ellipsePoints(0, 0, -0.01, 1 - s, 1 + s, angle), PALE, { color: RULE, width: 0.5, layer: -1 });
		const [l, r] = extent(P);
		P.x = k ? W - BEARING - r : BEARING - l;
		P.labels.push(letter(name[0], P.x + l - BEARING, P.y, `${name[1]}\\ \\ \\odot`));
		panels.push(P);
	}
	return figure(W, H, panels);
}
