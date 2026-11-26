// The tutorial, section 2.1 (tutorial/outside/laplace.md), its fourth diagram: Green's second identity, drawn on a
// region. A bounded region V (drawn in section, tinted) and its boundary, the closed surface dV, with outward
// normals dA at six places along it; inside the region, the integrand u lap v - v lap u of the identity's left side;
// beside the boundary, the integrand (u grad v - v grad u) . dA of its right side. In one neutral colour, the normals
// thin arrows. Exact: each normal is at right angles to the boundary where it stands and points out of the region
// (asserted); the boundary is a smooth closed curve that does not cross itself (asserted), sampled every quarter of a
// point. Schematic: the region's shape, which is any shape, and the normals' length.
import { INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, n2 } from './tut-pot-lib.js';
import { TINT, EDGE } from './tut-gauss-lib.js';

const name = 'tut-lap-green';
const check = checker(name);

// the boundary, points (y down), t from 0 to 2 pi: an oval with a gentle dent on its upper side
const shape = (t) => [104 * Math.cos(t) + 9 * Math.cos(2 * t), -58 * Math.sin(t) + 9 * Math.cos(3 * t) + 5 * Math.sin(2 * t)];
const dshape = (t) => [-104 * Math.sin(t) - 18 * Math.sin(2 * t), -58 * Math.cos(t) - 27 * Math.sin(3 * t) + 10 * Math.cos(2 * t)];
const NORMALS = [0.18, 0.95, 1.75, 2.75, 3.85, 5.0];   // where the normals stand: values of t
const NORMAL = 15;                  // a normal's length, points
const NORMAL_W = 0.5, NORMAL_HEAD = 3.4;
const LABELLED = 0;                 // the normal that carries dA

/** Whether q lies inside the closed polyline pts (even-odd rule). */
function inside(q, pts) {
	let c = false;
	for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
		const [xi, yi] = pts[i], [xj, yj] = pts[j];
		if ((yi > q[1]) !== (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) c = !c;
	}
	return c;
}

/** Whether the segments a-b and c-d cross. */
function crosses(a, b, c, d) {
	const s = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
	return s(a, b, c) * s(a, b, d) < 0 && s(c, d, a) * s(c, d, b) < 0;
}

export default async function () {
	const S = new Sheet(name);
	const at = ([x, y]) => [ORIGIN + x, ORIGIN + y];

	// ---- the boundary: points no more than a quarter of a point apart
	const ts = [0];
	while (ts[ts.length - 1] < 2 * Math.PI) {
		const t = ts[ts.length - 1];
		ts.push(Math.min(2 * Math.PI, t + 0.24 / Math.hypot(...dshape(t))));
	}
	const curve = ts.slice(0, -1).map((t) => at(shape(t)));
	for (let i = 0; i < curve.length; i++) {
		const q = curve[(i + 1) % curve.length];
		check(Math.hypot(q[0] - curve[i][0], q[1] - curve[i][1]) <= 0.25, 'the boundary is sampled too coarsely');
	}
	// it does not cross itself (checked on a coarser polygon of the same curve)
	const coarse = Array.from({ length: 360 }, (_, k) => shape((2 * Math.PI * k) / 360));
	for (let i = 0; i < 360; i++) for (let j = i + 2; j < 360; j++) {
		if (i === 0 && j === 359) continue;
		check(!crosses(coarse[i], coarse[i + 1], coarse[j], coarse[(j + 1) % 360]), 'the boundary crosses itself');
	}
	const d = 'M' + curve.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
	S.raw(`<path d="${d}" fill="${TINT}"/>`, 0);
	S.path(curve, { color: INK, width: EDGE, layer: 1, closed: true, what: 'the boundary' });

	// ---- the outward normals
	const arrows = [];
	for (const [k, t] of NORMALS.entries()) {
		const p = at(shape(t)), [tx, ty] = dshape(t), l = Math.hypot(tx, ty);
		// the tangent turned a quarter; the sign that leaves the region
		let n = [ty / l, -tx / l];
		if (inside([p[0] + 2 * n[0], p[1] + 2 * n[1]], curve)) n = [-n[0], -n[1]];
		check(near(n[0] * tx + n[1] * ty, 0, 1e-9), `the normal ${k} is not at right angles to the boundary`);
		check(!inside([p[0] + 2 * n[0], p[1] + 2 * n[1]], curve) && inside([p[0] - 2 * n[0], p[1] - 2 * n[1]], curve), `the normal ${k} does not point out`);
		const tip = [p[0] + NORMAL * n[0], p[1] + NORMAL * n[1]];
		S.arrow(p, tip, { color: DIM, width: NORMAL_W, head: NORMAL_HEAD, layer: 2, what: `the normal ${k}` });
		arrows.push({ p, tip, n });
	}

	// ---- labels
	const L = [];
	const centre = at([0, 0]);
	L.push(await placed('u\\,\\nabla^2 v - v\\,\\nabla^2 u', centre[0], centre[1] + 4, 0.5, 0.5, INK));
	L.push(await S.clear('V', ...at([-58, -6]), 0.5, 0.5, [0, 1]));
	// dA at the tip of the labelled normal, out along it
	const a = arrows[LABELLED];
	L.push(await S.clear('\\mathrm{d}\\boldsymbol{A}', a.tip[0], a.tip[1], 0, 0.5, a.n));
	// dV beside the boundary at the left, outside
	L.push(await S.clear('\\partial V', ...at(shape(Math.PI * 1.02)), 1, 0.5, [-1, 0]));
	// the surface integrand beside the boundary, below and to the right, outside
	const q = at(shape(5.55));
	L.push(await S.clear('(u\\,\\nabla v - v\\,\\nabla u)\\cdot\\mathrm{d}\\boldsymbol{A}', q[0], q[1], 0, 0, [0.6, 0.8]));

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
