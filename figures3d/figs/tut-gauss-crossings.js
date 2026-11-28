// The tutorial, section 1.3 (tutorial/newton/gauss-and-poisson.md), its second diagram: why the flux out of a
// closed surface counts only the mass inside. A closed surface S with a fold (a horseshoe, drawn in section, the
// region it encloses tinted), a point mass m1 inside one arm and a point mass m2 outside, in the notch between the
// arms. A thin cone from m1 crosses S three times: out, back in, and out again; a thin cone from m2 enters the
// region and leaves it. Each crossing cuts a patch from S, drawn in the accent of its sign, with the outward normal
// at its middle: orange (+d Omega) where the normal points away from the mass, blue (-d Omega) where it points
// toward it. Exact: S is a periodic cubic B-spline, drawn as a polyline with points at most a quarter of a point
// apart, and every crossing is found on that polyline; along each cone's middle line and both its edges the code
// finds the same number of crossings with the same signs (the sign of the outward normal dotted with the cone's
// direction), +, -, + for m1 and -, + for m2, alternating, the first and last out for m1; each patch is the arc of
// S between the cone's two edges; each normal is at right angles to S. Schematic: the shape of S, the places of the
// masses, and the cones' width (10 degrees). The masses are named in matter's colour, as in the caption; each sign
// stands beside its patch, the last of m1's inside its cone, below the normal, clear of the figure's corner.
import { INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, AXIS, HAIR, n2 } from './tut-pot-lib.js';
import { IRON, TINT, EDGE, BALL } from './tut-gauss-lib.js';

const name = 'tut-gauss-crossings';
const check = checker(name);

// the control polygon of S (points, y down), going round once: the left arm, the notch, the right arm, the base
const CONTROL = [
	[8, 18], [30, 2], [62, 6], [72, 30], [74, 62], [80, 88], [100, 98], [126, 96], [140, 82], [142, 52], [140, 22],
	[150, 4], [182, 0], [206, 14], [214, 50], [214, 90], [206, 118], [180, 136], [120, 140], [60, 138], [22, 126],
	[4, 98], [0, 66], [2, 40]
];
const M1 = [24, 48];                     // the mass inside, points
const M2 = [106, 54];                    // the mass outside, in the notch
const DIR1 = -9, DIR2 = 95;              // the cones' middle lines, degrees from the page's x axis (y down)
const HALF = 5;                          // half the cones' width, degrees
const BEYOND = 16;                       // how far each cone runs past its last crossing, points
const PATCH = 1.5;                       // a patch's stroke
const NORMAL = 13;                       // a normal's length, points
const NORMAL_HEAD = 4.2;
const SC = 1.2;                         // points per unit of CONTROL
const SIGN = 11;                         // the signs' size
const MATTER = 'light-dark(#533f03, #f1dc86)';   // matter's colour of each theme (tut-null-lib.js), for the masses' names

/** A point and the tangent of the periodic cubic B-spline through CONTROL, segment i, parameter t in [0, 1]. */
function spline(i, t) {
	const n = CONTROL.length;
	const p = [-1, 0, 1, 2].map((k) => CONTROL[(i + k + n) % n]);
	const b = [(1 - t) ** 3 / 6, (3 * t ** 3 - 6 * t ** 2 + 4) / 6, (-3 * t ** 3 + 3 * t ** 2 + 3 * t + 1) / 6, t ** 3 / 6];
	const db = [-((1 - t) ** 2) / 2, (3 * t ** 2 - 4 * t) / 2, (-3 * t ** 2 + 2 * t + 1) / 2, t ** 2 / 2];
	return [[0, 1].map((c) => b.reduce((s, w, k) => s + w * p[k][c], 0)), [0, 1].map((c) => db.reduce((s, w, k) => s + w * p[k][c], 0))];
}

/** Whether the point q lies inside the closed polyline pts (even-odd rule). */
function inside(q, pts) {
	let c = false;
	for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
		const [xi, yi] = pts[i], [xj, yj] = pts[j];
		if ((yi > q[1]) !== (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) c = !c;
	}
	return c;
}

export default async function () {
	const S = new Sheet(name);
	const at = ([x, y]) => [ORIGIN + SC * (x - 107), ORIGIN + SC * (y - 76)];

	// ---- S: the spline, sampled so that no two neighbouring points are more than a quarter of a point apart
	const curve = [], tangent = [];
	for (let i = 0; i < CONTROL.length; i++) {
		// enough points for a quarter of a point between neighbours
		let len = 0;
		for (let k = 0; k < 200; k++) { const [p] = spline(i, k / 200), [q] = spline(i, (k + 1) / 200); len += SC * Math.hypot(q[0] - p[0], q[1] - p[1]); }
		let m = Math.ceil(len / 0.2);
		const step = (n) => Math.max(...Array.from({ length: n }, (_, k) => { const [p] = spline(i, k / n), [q] = spline(i, (k + 1) / n); return SC * Math.hypot(q[0] - p[0], q[1] - p[1]); }));
		while (step(m) > 0.24) m = Math.ceil(m * 1.2);
		for (let k = 0; k < m; k++) {
			const [p, d] = spline(i, k / m);
			curve.push(at(p)); tangent.push(d);
		}
	}
	for (let i = 0; i < curve.length; i++) {
		const q = curve[(i + 1) % curve.length];
		check(Math.hypot(q[0] - curve[i][0], q[1] - curve[i][1]) <= 0.25, 'S is sampled too coarsely');
	}
	// the outward normal at sample i: the tangent turned a quarter, the way that leaves the region
	const normal = (i) => {
		const [tx, ty] = tangent[i], l = Math.hypot(tx, ty);
		let nx = ty / l, ny = -tx / l;
		if (inside([curve[i][0] + 0.5 * nx, curve[i][1] + 0.5 * ny], curve)) { nx = -nx; ny = -ny; }
		check(!inside([curve[i][0] + 0.5 * nx, curve[i][1] + 0.5 * ny], curve) && inside([curve[i][0] - 0.5 * nx, curve[i][1] - 0.5 * ny], curve), 'no outward normal at a point of S');
		return [nx, ny];
	};

	/** The crossings of the ray from m in the direction of `deg` degrees with S, in order along the ray: the distance,
	 * the index of the sample of S before the crossing, the point, and the sign (outward normal . direction). */
	const crossings = (m, deg) => {
		const u = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
		const out = [];
		for (let i = 0; i < curve.length; i++) {
			const a = curve[i], b = curve[(i + 1) % curve.length];
			const e = [b[0] - a[0], b[1] - a[1]], w = [a[0] - m[0], a[1] - m[1]];
			const den = u[0] * e[1] - u[1] * e[0];
			if (Math.abs(den) < 1e-12) continue;
			const t = (w[0] * e[1] - w[1] * e[0]) / den, s = (w[0] * u[1] - w[1] * u[0]) / den;
			if (t > 0 && s >= 0 && s < 1) {
				const nm = normal(i);
				out.push({ t, i, p: [m[0] + u[0] * t, m[1] + u[1] * t], sign: Math.sign(nm[0] * u[0] + nm[1] * u[1]) });
			}
		}
		return out.sort((p, q) => p.t - q.t);
	};

	const m1 = at(M1), m2 = at(M2);
	check(inside(m1, curve), 'm1 is not inside S');
	check(!inside(m2, curve), 'm2 is not outside S');

	// ---- the region and S
	S.fill('M' + curve.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z', null, { color: TINT, layer: -2, solid: false });
	S.path(curve, { color: INK, width: EDGE, layer: 1, closed: true, what: 'S' });

	const L = [];
	const cones = [
		{ m: m1, dir: DIR1, signs: [1, -1, 1], who: 'm1', side: [[0, -1], [0, -1], [0, 1]] },
		{ m: m2, dir: DIR2, signs: [-1, 1], who: 'm2', side: [[1, 0], [1, 0]] }
	];
	for (const c of cones) {
		const mid = crossings(c.m, c.dir), lo = crossings(c.m, c.dir - HALF), hi = crossings(c.m, c.dir + HALF);
		// the same crossings, with the same signs, along the middle line and both edges, and the signs alternate
		for (const r of [mid, lo, hi]) {
			check(r.length === c.signs.length && r.every((x, k) => x.sign === c.signs[k]), `the cone from ${c.who} does not cross S as ${c.signs.join(', ')}: ${r.map((x) => x.sign).join(', ')}`);
		}
		for (let k = 1; k < mid.length; k++) check(mid[k].sign === -mid[k - 1].sign, `the crossings of the cone from ${c.who} do not alternate`);
		check(c.signs.reduce((s, x) => s + x, 0) === (c.who === 'm1' ? 1 : 0), `the crossings of the cone from ${c.who} do not add up as Gauss's law says`);

		// the cone: its two edges, a hairline from the mass to a little past the last crossing
		const far = mid[mid.length - 1].t + BEYOND;
		for (const dg of [c.dir - HALF, c.dir + HALF]) {
			const u = [Math.cos((dg * Math.PI) / 180), Math.sin((dg * Math.PI) / 180)];
			S.path([[c.m[0] + u[0] * (BALL + 1.2), c.m[1] + u[1] * (BALL + 1.2)], [c.m[0] + u[0] * far, c.m[1] + u[1] * far]], { color: DIM, width: HAIR, layer: 2, what: `the cone from ${c.who}` });
		}

		// each patch: the arc of S between the cone's edges, in the accent of its sign, and its outward normal
		for (let k = 0; k < mid.length; k++) {
			const color = mid[k].sign > 0 ? ACCENT : ACCENT2;
			let [i0, i1] = [lo[k].i, hi[k].i].sort((p, q) => p - q);
			if (i1 - i0 > curve.length / 2) [i0, i1] = [i1, i0 + curve.length];
			check(i1 - i0 < curve.length / 20 && (mid[k].i - i0 + curve.length) % curve.length <= i1 - i0, `a patch of the cone from ${c.who} is not the arc between its edges`);
			const arcPts = [lo[k].i <= hi[k].i ? lo[k].p : hi[k].p];
			for (let j = i0 + 1; j <= i1; j++) arcPts.push(curve[j % curve.length]);
			arcPts.push(lo[k].i <= hi[k].i ? hi[k].p : lo[k].p);
			S.path(arcPts, { color, width: PATCH, layer: 3, cap: 'butt', what: `a patch of the cone from ${c.who}` });
			const nm = normal(mid[k].i);
			const tg = tangent[mid[k].i];
			check(near(nm[0] * tg[0] + nm[1] * tg[1], 0, 1e-9), 'a normal is not at right angles to S');
			const p = mid[k].p;
			S.arrow(p, [p[0] + nm[0] * NORMAL, p[1] + nm[1] * NORMAL], { color, width: AXIS + 0.15, head: NORMAL_HEAD, layer: 4, what: `the normal of a patch of the cone from ${c.who}` });
			mid[k].normal = nm;
		}
		c.mid = mid;
	}

	// ---- the masses
	S.sphere(m1, BALL, IRON, { spec: 0.45, shininess: 30, layer: 6 }, 'm1');
	S.sphere(m2, BALL, IRON, { spec: 0.45, shininess: 30, layer: 6 }, 'm2');

	// ---- labels: each sign beside its patch, on the side of the normal turned a quarter; the masses; S
	for (const c of cones) {
		for (const [k, x] of c.mid.entries()) {
			const color = x.sign > 0 ? ACCENT : ACCENT2;
			// beside the patch, off the cone's middle line to the side c.side[k] and off S along the normal
			const dx = x.normal[0] + c.side[k][0], dy = x.normal[1] + c.side[k][1], l = Math.hypot(dx, dy);
			L.push(await S.clear(x.sign > 0 ? '+' : '-', x.p[0], x.p[1], 0.5, 0.5, [dx / l, dy / l], { color, size: SIGN }));
		}
	}
	L.push(await S.clear('m_1', m1[0], m1[1] + BALL, 0.5, 0, [0, 1], { color: MATTER }));
	L.push(await S.clear('m_2', m2[0] - BALL, m2[1], 1, 0.5, [-1, 0], { color: MATTER }));
	const sAt = at([4, 112]);
	L.push(await S.clear('S', sAt[0], sAt[1], 1, 0.5, [-1, 0], { color: INK }));

	S.checkAll(L);
	void FAINT;
	return finish(S, L, [240, 320]);
}
