// Shared tools for the diagrams of the tutorial's sections 1.5 (tutorial/newton/five-numbers.md: tut-five-split,
// tut-five-basis, tut-five-turn) and 1.5b (tutorial/newton/complex-numbers.md: tut-cx-product, tut-cx-euler,
// tut-cx-spin). Not a figure itself. The strokes, heads, dots, labels and the cropping are those of section 1.1's
// diagrams (figs/tut-vec-lib.js, imported, not copied); the ring of twelve free steel beads, its dashed undisturbed
// circle and its orange stretch and blue squeeze arrows are those of the paper's figure 2 (figs/tidal.js) and of
// section 1.4's opening figure (figs/tut-tides.js), so that the five chapters look alike.
//
// A ring is drawn from its table: the bead whose undisturbed place is the unit vector xi (in the ring's plane) is
// drawn at (1 - eps T) xi, so that the ring is the image of the circle under that map, an exact ellipse; the arrows
// are -T xi at the beads that lie on the table's eigen-axes, orange where they point out (a stretch, a negative
// eigenvalue) and blue where they point in (a squeeze, a positive one), all drawn at one scale.
import { v3, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { AXIS, AXIS_HEAD, HAIR, near, checker } from './tut-vec-lib.js';

export const STEEL = '#868b92';           // the beads (tidal.js): a fixed grey, not swapped by the site
export const RING = 0.65;                 // the deformed ring's stroke (tidal.js)
export const UNDISTURBED = [2.4, 2];      // the dashes of the undisturbed circle (tidal.js), DIM, 0.5 wide
export const UNDISTURBED_W = 0.5;
export const PUSH = 0.55;                 // a push arrow's stroke (tidal.js)
export const PUSH_HEAD = 3.2;             // its head, or two fifths of the arrow if that is less
export const TAIL = 1.35;                 // a push arrow starts this far clear of its bead
export const CLEAR = 0.36 * PUSH_HEAD + 0.55 + 0.6;   // no dash of the dashed circle this near an arrow's axis
export const TICK = 2.5;                  // half a tick, points
export const PT = 1.15;                   // a marked point of a plane: a dot's radius

/** The eigen-axes of a symmetric 2 x 2 table [[a, b], [b, d]]: [{ l, e: [x, y] }], unit eigenvectors. */
export function eigen2([[a, b], [c, d]]) {
	if (Math.abs(b - c) > 1e-12) throw new Error('the table is not symmetric');
	const m = (a + d) / 2, r = Math.hypot((a - d) / 2, b);
	const phi = 0.5 * Math.atan2(2 * b, a - d);          // the axis of the larger eigenvalue
	return [
		{ l: m + r, e: [Math.cos(phi), Math.sin(phi)] },
		{ l: m - r, e: [-Math.sin(phi), Math.cos(phi)] }
	];
}

const mul = (T, [x, y]) => [T[0][0] * x + T[0][1] * y, T[1][0] * x + T[1][1] * y];

/**
 * A ring of twelve free beads in a plane, under the 2 x 2 table T (the table's entries in the plane's two axes,
 * `eh` to the right of the ring's own drawing and `ev` up, world unit vectors): the bead at the undisturbed place xi
 * is drawn at c + R (1 - eps T) xi. `phase` (radians) is the first bead's angle from eh: the beads stand at
 * phase + k 30 degrees, and every eigen-axis of T with a nonzero eigenvalue must pass through two of them. `reach`:
 * an arrow's length, world units, per unit of |T xi|. `bead`: a bead's radius, world units.
 */
export function ring(ink, { c, eh, ev, R, T, eps, phase = 0, bead, reach, layer = 0, what = 'the ring', dashedStart = true }) {
	const check = checker(ink.name);
	const P = ink.P;
	const world = ([h, v]) => c.clone().addScaledVector(eh, R * h).addScaledVector(ev, R * v);
	const image = (xi) => { const t = mul(T, xi); return [xi[0] - eps * t[0], xi[1] - eps * t[1]]; };
	const axes = eigen2(T);
	// never folding: the map 1 - eps T keeps every direction's sense, with room to spare
	for (const { l } of axes) check(1 - eps * l >= 0.25, `${what}: 1 - eps lambda = ${1 - eps * l}, the ring would fold`);
	check(near(eh.dot(ev), 0, 1e-12) && near(eh.length(), 1, 1e-12) && near(ev.length(), 1, 1e-12), `${what}: its plane's axes are not unit vectors at right angles`);

	// the ring: the image of the circle, one closed path, the stroke under the beads
	const N = 360;
	const loop = Array.from({ length: N + 1 }, (_, k) => world(image([Math.cos((2 * Math.PI * k) / N), Math.sin((2 * Math.PI * k) / N)])));
	ink.curve(loop, { color: INK, width: RING, layer: layer + 1, what: `${what}'s ellipse` });

	// the beads, and the arrows at those on the eigen-axes
	const beads = [], arrows = [];
	for (let k = 0; k < 12; k++) {
		const t = phase + (2 * Math.PI * k) / 12;
		const xi = [Math.cos(t), Math.sin(t)];
		const p = world(image(xi));
		beads.push({ k, xi, p });
		P.sphere(p, bead, STEEL, { spec: 0.6, shininess: 36, layer: layer + 3 });
		ink.mark([ink.at(p)], bead * P.scale, `${what}'s bead ${k}`);
		const on = axes.find(({ e }) => near(Math.abs(e[0] * xi[0] + e[1] * xi[1]), 1, 1e-9));
		if (on) on.n = (on.n ?? 0) + 1;
		if (!on || near(on.l, 0, 1e-12)) continue;
		const a = mul(T, xi).map((x) => -x);                 // the push per unit of distance, -T xi
		check(near(a[0], -on.l * xi[0], 1e-12) && near(a[1], -on.l * xi[1], 1e-12), `${what}: bead ${k} is not on an eigen-axis`);
		const stretch = on.l < 0;                             // outward
		const u = eh.clone().multiplyScalar(a[0]).addScaledVector(ev, a[1]).normalize();
		const from = p.clone().addScaledVector(u, bead + TAIL / P.scale);
		const L = Math.hypot(...a) * reach;                   // world units
		const to = from.clone().addScaledVector(u, L);
		const drawn = ink.arrow(from, to, { color: stretch ? ACCENT : ACCENT2, width: PUSH, head: PUSH_HEAD, layer: layer + 4, what: `${what}'s ${stretch ? 'stretch' : 'squeeze'} arrow at bead ${k}` });
		arrows.push({ k, l: on.l, stretch, from, to, L: drawn.L, head: drawn.head, A: drawn.A, B: drawn.B });
	}
	// every eigen-axis with a nonzero eigenvalue carries two arrows, opposite each other (for a table with two equal
	// eigenvalues, every direction is an eigen-axis: the arrows stand on the two axes of the plane)
	for (const { l, n } of axes) if (!near(l, 0, 1e-12)) check(n === 2, `${what}: the axis of eigenvalue ${l} does not pass through two beads`);
	// each bead on the image of its place: (1 - eps T) xi, on the ellipse
	for (const b of beads) {
		const q = image(b.xi), back = world(q);
		check(near(back.distanceTo(b.p), 0, 1e-9), `${what}: bead ${b.k} is not the image of its place`);
	}
	// all arrows at one scale: the drawn length is the push times `reach`
	for (const a of arrows) check(near(a.L, Math.abs(a.l) * reach * P.scale, 1e-6), `${what}: an arrow is not at the common scale`);

	if (dashedStart) dashedCircle(ink, world, arrows, layer);
	return { beads, arrows, loop, world, image, axes };
}

/** The undisturbed circle, dashed (a whole number of dashes, so that the pattern closes), no dash within CLEAR
 * points of an arrow (tidal.js). */
function dashedCircle(ink, world, arrows, layer) {
	const P = ink.P;
	const N = 720;
	const pts = Array.from({ length: N + 1 }, (_, k) => world([Math.cos((2 * Math.PI * k) / N), Math.sin((2 * Math.PI * k) / N)]));
	const F = pts.map((q) => ink.at(q));
	const segs = arrows.map((a) => [a.A, a.B]);
	const nearArrow = (q) => segs.some(([A, B]) => {
		const d = [B[0] - A[0], B[1] - A[1]], t = Math.max(0, Math.min(1, ((q[0] - A[0]) * d[0] + (q[1] - A[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2)));
		return Math.hypot(q[0] - A[0] - t * d[0], q[1] - A[1] - t * d[1]) < CLEAR;
	});
	const s = [0];
	for (let i = 1; i < F.length; i++) s.push(s[i - 1] + Math.hypot(F[i][0] - F[i - 1][0], F[i][1] - F[i - 1][1]));
	const [on, off] = UNDISTURBED;
	const total = s[s.length - 1], n = Math.round(total / (on + off)), period = total / n, dash = (on * period) / (on + off);
	const atS = (x) => {
		x = ((x % total) + total) % total;
		let i = 1;
		while (s[i] < x) i++;
		const f = (x - s[i - 1]) / (s[i] - s[i - 1] || 1);
		return pts[i - 1].clone().lerp(pts[i], f);
	};
	for (let k = 0; k < n; k++) {
		const x0 = k * period - dash / 2;
		const seg = Array.from({ length: 7 }, (_, j) => atS(x0 + (dash * j) / 6));
		if (seg.some((q) => nearArrow(ink.at(q)))) continue;
		ink.curve(seg, { color: DIM, width: UNDISTURBED_W, layer, what: 'a dash of the undisturbed circle' });
	}
}

/** A pair of short axes from the world point O along the unit vectors of `axes` ([{ d, color, tex }]), each `len`
 * world units, thin with a small head (section 1.1's axes). Returns their tips, for the labels. */
export function gnomon(ink, O, axes, len, { layer = 1, what = 'the axes' } = {}) {
	return axes.map((x) => {
		const tip = O.clone().addScaledVector(x.d, len);
		ink.arrow(O, tip, { color: x.color ?? INK, width: AXIS, head: AXIS_HEAD, layer, what: `${what}: ${x.tex}` });
		return tip;
	});
}

/** A flat arc in the page's plane about the world point C, radius r (world), from the angle a0 to a1 (radians,
 * anticlockwise positive), with a head at the a1 end if `head` (points) is given; `endGap` points of air are left
 * between the head's tip and the point at a1 (a marked point there). The arc is sampled so that no two points are
 * more than a quarter of a point apart. */
export function arc(ink, C, r, a0, a1, { color = DIM, width = HAIR, head = 0, endGap = 0, layer = 1, what = 'an arc' } = {}) {
	const P = ink.P;
	const aim = a1;
	if (endGap) a1 -= (Math.sign(a1 - a0) * endGap) / (r * P.scale);
	const len = Math.abs(a1 - a0) * r * P.scale;               // points
	const stop = head ? a1 - (Math.sign(a1 - a0) * 0.8 * head) / (r * P.scale) : a1;
	const n = Math.max(8, Math.ceil(len / 0.25));
	const pts = Array.from({ length: n + 1 }, (_, k) => {
		const t = a0 + ((stop - a0) * k) / n;
		return C.clone().add(v3(r * Math.cos(t), r * Math.sin(t), 0));
	});
	ink.curve(pts, { color, width, layer, what });
	if (head) {
		const check = checker(ink.name);
		check(head <= 0.4 * len + 1e-9, `${what}: a head longer than two fifths of its arc`);
		// the head along the chord of its own length, ending at a1
		const tip = ink.at(C.clone().add(v3(r * Math.cos(a1), r * Math.sin(a1), 0)));
		const tb = a1 - (Math.sign(a1 - a0) * head) / (r * P.scale);
		const base = ink.at(C.clone().add(v3(r * Math.cos(tb), r * Math.sin(tb), 0)));
		const L = Math.hypot(tip[0] - base[0], tip[1] - base[1]);
		const u = [(tip[0] - base[0]) / L, (tip[1] - base[1]) / L], w = [-u[1], u[0]], hw = 0.36 * L;
		const b0 = [tip[0] - u[0] * L, tip[1] - u[1] * L];
		const tri = [tip, [b0[0] + w[0] * hw, b0[1] + w[1] * hw], [b0[0] - w[0] * hw, b0[1] - w[1] * hw]];
		P.items.push({ kind: 'raw', layer, depth: 0, svg: `<path d="M${tri.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')}Z" fill="${color}"/>` });
		ink.mark([...tri, tri[0]], 0, `${what}'s head`);
	}
	return { mid: C.clone().add(v3(r * Math.cos((a0 + aim) / 2), r * Math.sin((a0 + aim) / 2), 0)), pts };
}

/** A marked point of a plane: a small round dot at the world point p. */
export function point(ink, p, { r = PT, color = INK, layer = 5, what = 'a point' } = {}) {
	ink.dot(p, { r, color, layer, what });
}

/** The axes of a plane (a complex plane, or the plane of two numbers): through the world point O, `scale` world
 * units per unit, from lo to hi along each; thin, with a head at the positive end; ticks at the listed values. */
export function planeAxes(ink, O, scale, { h, v, layer = 0, color = DIM }) {
	const out = {};
	for (const [key, d, ax] of [['h', v3(1, 0, 0), h], ['v', v3(0, 1, 0), v]]) {
		const a = O.clone().addScaledVector(d, ax.lo * scale), b = O.clone().addScaledVector(d, ax.hi * scale);
		ink.arrow(a, b, { color, width: AXIS, head: AXIS_HEAD, layer, what: `the ${key} axis` });
		const across = key === 'h' ? v3(0, 1, 0) : v3(1, 0, 0);
		out[key] = { tip: b, ticks: [] };
		for (const t of ax.ticks ?? []) {
			const q = O.clone().addScaledVector(d, t * scale);
			const k = TICK / ink.P.scale;
			ink.line(q.clone().addScaledVector(across, -k), q.clone().addScaledVector(across, k), { color, width: HAIR, layer, what: `the tick at ${t} on the ${key} axis` });
			out[key].ticks.push({ t, q });
		}
	}
	return out;
}
