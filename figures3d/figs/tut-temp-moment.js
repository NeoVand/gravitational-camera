// The tutorial, section 4.2 (tutorial/response/temperature.md), its third diagram: which velocities count in the
// rate of change of the moment Q_xy = sum m_a x_a y_a. In the plane (x, y), behind everything, a faint field of
// short grey arrows for the weight grad(xy) = (y, x), each centred on a point of a grid offset by half a step from the
// axes, its length in proportion to |grad(xy)| = r: outward along the diagonal y = x, inward along y = -x, longer
// far from the centre. Over it, a lump of twelve masses in matter's colour, six of one mass and six of twice it (the
// dots' areas in proportion). On each, a thin dark arrow for its velocity, and a short tick along the grey arrow at
// its place for v . grad(xy), its velocity's part along that arrow times the arrow's length: orange where it is
// positive, blue where it is negative. Q_xy' = sum m v . grad(xy) is the masses times these ticks, added.
// Exact: the weights (grad(xy) = (y, x) asserted by differences, outward on y = x and inward on y = -x, of length r)
// and, for each mass, its tick (v . grad(xy) at its place, the colour its sign, along grad(xy) at its place). Chosen
// for the drawing: the places (a lump spread as the atoms of a solid are, one far out on y = x and one near the
// centre, each asserted clear of the others, of the grey arrows and of the axes) and the scales of the velocities and
// of the ticks. A sample: the velocities, seeded Gaussian draws with the variance k_BT/m of the chapter's eq:maxwell
// (the heavier masses' smaller by sqrt 2); the first seed is taken whose arrows and ticks clear the other dots, the
// grey arrows and the axes, part from each other by 18 degrees, and give the far mass a velocity that counts strongly
// and the central one a fast velocity that barely counts.
import { INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, AXIS, AXIS_HEAD } from './tut-pot-lib.js';
import { normals } from './tut-prob-lib.js';
import { MATTER } from './tut-null-lib.js';

const name = 'tut-temp-moment';
const check = checker(name);

// ---- the mathematics ----------------------------------------------------------------------------------------------
const h = (x, y) => x * y;
const grad = (x, y) => [y, x];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];

// ---- the drawing (points, and units of the plane) -------------------------------------------------------------------
const U = 40;                                  // points per unit of the plane
const GRID = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
const FIELD = 0.2;                             // a grey arrow's length per unit of |grad(xy)|, in units of the plane
const FIELD_W = 0.45, FIELD_HEAD = 2.6, FIELD_OPACITY = 0.55;
const N = 12;
const R_LIGHT = 2.7, R_HEAVY = R_LIGHT * Math.SQRT2;   // the dots' radii, points (areas in proportion to mass)
const VEL = 0.26;                              // the velocity arrows: units of the plane per sigma_v of the lighter mass
const VEL_W = 0.55, VEL_HEAD = 3.4;
const TICK_K = 0.11;                           // the ticks: units of the plane per unit of v . grad(xy), v in sigma_v
const TICK_W = 1.1;
const AX = 3.05;                               // the axes reach this far

/** The places: a lump of twelve masses spread about the origin as the atoms of a solid are, six of mass 1 and six of
 * mass 2, chosen for the drawing; the first, far out on the diagonal y = x, and the second, near the centre. */
export const PLACES = [
	[1.7, 1.79, 1], [0.24, -0.19, 1], [-1.08, 0.93, 2], [1.12, 0.88, 2], [-0.9, -1.12, 2], [0.96, -0.9, 1],
	[-2.05, 0.84, 1], [0.88, 2.06, 2], [-0.84, 1.95, 1], [0.78, -2.02, 2], [-1.86, -0.92, 2], [2.04, -0.84, 1]
];
const FIELD_SEGS = [];
for (const gx of GRID) for (const gy of GRID) {
	const v = grad(gx, gy), l = Math.hypot(...v), e = [v[0] / l, v[1] / l], L = FIELD * l;
	FIELD_SEGS.push([[gx - (e[0] * L) / 2, gy - (e[1] * L) / 2], [gx + (e[0] * L) / 2, gy + (e[1] * L) / 2]]);
}
const segDist = (p, [a, b]) => {
	const d = [b[0] - a[0], b[1] - a[1]], t = Math.max(0, Math.min(1, dot([p[0] - a[0], p[1] - a[1]], d) / dot(d, d)));
	return Math.hypot(p[0] - a[0] - t * d[0], p[1] - a[1] - t * d[1]);
};

/** The velocities, a sample from the seed (variance k_BT/m along each axis, k_BT = 1); null if they do not meet the
 * drawing's needs. */
function sample(seed) {
	const g = normals(seed);
	const fieldSegs = FIELD_SEGS;
	const dots = PLACES.map(([x, y, m]) => ({ x, y, m, r: (m === 2 ? R_HEAVY : R_LIGHT) / U, v: [g() / Math.sqrt(m), g() / Math.sqrt(m)] }));
	const [far, centre] = dots;
	const gh = (d) => { const q = grad(d.x, d.y); return Math.abs(dot(d.v, q)) / (Math.hypot(...d.v) * Math.hypot(...q)); };
	if (gh(far) < 0.6 || Math.hypot(...far.v) < 0.7) return null;                       // the far one counts strongly
	if (Math.hypot(...centre.v) < 1.2) return null;                                       // the central one moves, but barely counts
	if (dots.some((d) => Math.hypot(...d.v) * VEL * U < 5)) return null;                  // every arrow long enough to read
	// each velocity arrow and tick (units of the plane) clears the other dots by 2 pt and the axes by 4 pt
	for (const d of dots) {
		const vl = Math.hypot(...d.v), vu = [d.v[0] / vl, d.v[1] / vl];
		const q = grad(d.x, d.y), ql = Math.hypot(...q), proj = dot(d.v, q), sg = Math.sign(proj);
		const segs = [[[d.x + vu[0] * d.r, d.y + vu[1] * d.r], [d.x + vu[0] * (d.r + vl * VEL), d.y + vu[1] * (d.r + vl * VEL)]],
			[[d.x, d.y], [d.x + (sg * q[0] / ql) * (d.r + Math.abs(proj) * TICK_K), d.y + (sg * q[1] / ql) * (d.r + Math.abs(proj) * TICK_K)]]];
		// the tick and the arrow part by at least 18 degrees where the tick is long enough to see
		if (Math.abs(proj) * TICK_K * U > 2 && Math.abs(proj) / (vl * ql) > Math.cos((18 * Math.PI) / 180)) return null;
		for (const sgm of segs) {
			if (dots.some((o) => o !== d && segDist([o.x, o.y], sgm) < o.r + 2 / U)) return null;
			// and comes no nearer a grey arrow than 3 pt between them, sampled along it
			for (let k = 0; k <= 20; k++) {
				const pt = [sgm[0][0] + ((sgm[1][0] - sgm[0][0]) * k) / 20, sgm[0][1] + ((sgm[1][1] - sgm[0][1]) * k) / 20];
				if (fieldSegs.some((f) => segDist(pt, f) < (3 + (FIELD_HEAD * 0.36) + TICK_W / 2) / U)) return null;
			}
			if (sgm.some(([x, y]) => Math.abs(x) < 4 / U || Math.abs(y) < 4 / U) || Math.sign(sgm[0][0]) !== Math.sign(sgm[1][0]) || Math.sign(sgm[0][1]) !== Math.sign(sgm[1][1])) return null;
		}
	}
	return { dots, far, centre, fieldSegs };
}

/** What `draw` adds to the sheet S, laid as one group of the given opacity at `layer`: strokes that cross or overlap
 * (a net's crossings, an arrow's head over its shaft) are then pale once, with no darker spots where they meet. */
function veiled(S, opacity, layer, draw) {
	const n = S.P.items.length;
	draw();
	const added = S.P.items.splice(n);
	S.raw(`<g opacity="${opacity}">${added.map((it) => it.svg).join('')}</g>`, layer);
}

export default async function () {
	// ---- the weights: grad(xy) = (y, x) by differences; outward along y = x, inward along y = -x, of length r
	const e = 1e-6;
	for (const [x, y] of [[0.3, -1.2], [2, 0.5], [-1.1, -0.7]]) {
		const d = [(h(x + e, y) - h(x - e, y)) / (2 * e), (h(x, y + e) - h(x, y - e)) / (2 * e)];
		check(near(d[0], y, 1e-8) && near(d[1], x, 1e-8), `grad(xy) at ${x}, ${y} is not (y, x)`);
		check(near(Math.hypot(...grad(x, y)), Math.hypot(x, y), 1e-12), 'the weight\'s length is not r');
	}
	for (const s of [0.5, 2]) {
		check(dot(grad(s, s), [s, s]) > 0 && near(Math.abs(dot(grad(s, s), [s, s])), Math.hypot(s, s) ** 2, 1e-12), 'the weight is not outward along y = x');
		check(dot(grad(s, -s), [s, -s]) < 0 && near(Math.abs(dot(grad(s, -s), [s, -s])), Math.hypot(s, s) ** 2, 1e-12), 'the weight is not inward along y = -x');
	}

	// ---- the places: far out on y = x, near the centre, the dots apart, clear of the grey arrows and of the axes
	const [f0, c0] = PLACES;
	check(Math.hypot(f0[0], f0[1]) > 2.4 && Math.abs(Math.atan2(f0[1], f0[0]) - Math.PI / 4) < 0.05, 'the first mass is not far out on y = x');
	check(Math.hypot(c0[0], c0[1]) < 0.35, 'the second mass is not near the centre');
	for (const [x, y, m] of PLACES) {
		const r = (m === 2 ? R_HEAVY : R_LIGHT) / U;
		check(PLACES.every(([a, b]) => (a === x && b === y) || Math.hypot(a - x, b - y) > 0.6), `the mass at ${x}, ${y} is near another`);
		check(FIELD_SEGS.every((sg) => segDist([x, y], sg) > r + 2.2 / U), `the mass at ${x}, ${y} touches a grey arrow`);
		check(Math.abs(x) > r + 2.5 / U && Math.abs(y) > r + 2.5 / U, `the mass at ${x}, ${y} touches an axis`);
	}
	// ---- the velocities: the first seed that meets the drawing's needs
	let seed = 1, smp = null;
	for (; seed < 100000 && !(smp = sample(seed)); seed++);
	check(smp, 'no seed below 100000 gives a sample');
	console.log(`seed ${seed}`);
	const { dots, far, centre, fieldSegs } = smp;
	check(dots.filter((d) => d.m === 1).length === 6 && dots.filter((d) => d.m === 2).length === 6, 'not six of each mass');

	const S = new Sheet(name);
	const L = [];
	const P = (x, y) => [ORIGIN + U * x, ORIGIN - U * y];

	// ---- the axes
	S.arrow(P(-AX, 0), P(AX, 0), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the x axis' });
	S.arrow(P(0, -AX), P(0, AX), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the y axis' });
	L.push(await placed('x', P(AX, 0)[0] + 3, P(AX, 0)[1], 0, 0.5, DIM));
	L.push(await placed('y', P(0, AX)[0], P(0, AX)[1] - 3, 0.5, 1, DIM));

	// ---- the field of grey arrows, centred on the grid
	veiled(S, FIELD_OPACITY, 1.2, () => { for (const [a, b] of fieldSegs) S.arrow(P(...a), P(...b), { color: FAINT, width: FIELD_W, head: FIELD_HEAD, layer: 1.2, what: 'a grey arrow' }); });

	// ---- each mass: its tick, its dot, its velocity
	let qdot = 0;
	for (const d of dots) {
		const c = P(d.x, d.y), rp = d.m === 2 ? R_HEAVY : R_LIGHT;
		const gw = grad(d.x, d.y), gl = Math.hypot(...gw), gu = [gw[0] / gl, gw[1] / gl];
		const proj = dot(d.v, gw);                        // v . grad(xy)
		qdot += d.m * proj;
		const sgn = Math.sign(proj), len = Math.abs(proj) * TICK_K * U;
		// the tick: along grad(xy) (orange) or against it (blue), from the dot's rim
		if (len > 0.3) {
			const a = [c[0] + sgn * gu[0] * rp, c[1] - sgn * gu[1] * rp], b = [a[0] + sgn * gu[0] * len, a[1] - sgn * gu[1] * len];
			S.path([a, b], { color: proj > 0 ? ACCENT : ACCENT2, width: TICK_W, layer: 2, cap: 'butt', what: `the tick at ${d.x.toFixed(2)}, ${d.y.toFixed(2)}` });
			d.tick = { a, b };
		}
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(rp)}" fill="${MATTER}"/>`, 3);
		S.mark([c], rp, `the dot at ${d.x.toFixed(2)}, ${d.y.toFixed(2)}`);
		// the velocity, from the rim
		const vl = Math.hypot(...d.v), vu = [d.v[0] / vl, d.v[1] / vl];
		const A = [c[0] + vu[0] * rp, c[1] - vu[1] * rp], B = [A[0] + vu[0] * vl * VEL * U, A[1] - vu[1] * vl * VEL * U];
		S.arrow(A, B, { color: INK, width: VEL_W, head: VEL_HEAD, layer: 4, what: `the velocity at ${d.x.toFixed(2)}, ${d.y.toFixed(2)}` });
		check(near(dot(d.v, gw), d.v[0] * d.y + d.v[1] * d.x, 1e-12), 'the tick is not v . (y, x)');
	}
	check(far !== centre, 'the far mass is the central one');
	// the field's name, beside the arrow at the upper right corner of the grid
	const corner = fieldSegs.find(([a, b]) => near(a[0] + b[0], 5, 1e-9) && near(a[1] + b[1], 5, 1e-9));
	L.push(await S.clear('\\nabla(xy)', P(...corner[1])[0] - 6, P(...corner[1])[1], 1, 0.5, [-1, 0], { color: DIM }));

	S.checkAll(L);
	window[name + '-numbers'] = { seed, qdot, far: [far.x, far.y], centre: [centre.x, centre.y] };
	return finish(S, L, [240, 340]);
}
