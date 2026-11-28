// The tutorial, section 1.6 (tutorial/newton/motion.md), its first diagram: forces inside a body cancel in pairs,
// so they cannot move its centre of mass. A body of five parts (small stone balls of unequal mass, each drawn with a
// radius in proportion to the cube root of its mass) joined in a ring by five springs and braced by two more across
// it from the top part, seen at three equal intervals of time as it drifts to the right and jostles. At the first
// instant every spring is stretched, and the force of each spring on each of its two parts is drawn in orange at
// that part, parallel to the spring and set off to one side of it (both arrows of a pair on the same side, so that
// the pair lies on one line beside its spring, clear of the spring's coils): the two arrows of a pair have the same
// length and point opposite ways. Thin pale curves are the paths of the parts between the instants, drawn only
// outside the three bodies (each is broken off at the ring of springs and at the balls); the centre of mass, marked
// by the quartered circle, moves on the dotted straight line by equal steps.
// Exact: the motion is integrated (velocity Verlet, 20,000 steps per interval) from Hooke's law, F_ab = k (|x_a -
// x_b| - l_ab) along the line from a to b; the code asserts that the inner forces add to zero at every step, that
// the centre of mass at each instant lies on one straight line at equal steps (to 1e-9 of the body's size), that
// the two arrows of each pair are equal and opposite and lie on one line parallel to their spring, that each
// arrow's length is in proportion to its force, that no arrow touches a spring's coils, a ball or another arrow,
// and that no drawn piece of a path enters a body.
// Schematic: the masses, the springs' stiffness and rest lengths, the starting state, and the scale of the arrows.
import { INK, DIM, RULE, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, HAIR, VEC, VEC_HEAD, n2 } from './tut-pot-lib.js';
import { IRON } from './tut-gauss-lib.js';

const name = 'tut-motion-parts';
const check = checker(name);

// ---- the physics (model units: the body's radius is about 1) -------------------------------------------------
export const MASS = [1.3, 0.75, 1.0, 1.15, 0.8];
const N = MASS.length;
// the springs: a ring, and two across it from the top part, so that the body holds its shape
const RING = [...Array.from({ length: N }, (_, a) => [a, (a + 1) % N]), [0, 2], [0, 3]];
const K_SPRING = 1;
const V = [0.6, 0];                     // the centre of mass's velocity
export const T = 6.3;                    // the interval between the instants drawn
const SPIN = 0.03;                      // the slow turn at the start, radians per unit of time
const STEPS = 20000;                     // per interval
const SHOTS = 3;

/** The regular pentagon of radius 1, turned so that a vertex points up: the springs' rest shape. */
const rest = Array.from({ length: N }, (_, a) => {
	const t = Math.PI / 2 + (2 * Math.PI * a) / N;
	return [Math.cos(t), Math.sin(t)];
});
const LEN0 = RING.map(([a, b]) => Math.hypot(rest[a][0] - rest[b][0], rest[a][1] - rest[b][1]));

/** The force of the spring s on its first part (the second feels the opposite). */
function springForce(x, s) {
	const [a, b] = RING[s];
	const d = [x[b][0] - x[a][0], x[b][1] - x[a][1]], L = Math.hypot(...d);
	const f = K_SPRING * (L - LEN0[s]);                                        // > 0: stretched, pulls a toward b
	return [(f * d[0]) / L, (f * d[1]) / L];
}

function forces(x) {
	const F = x.map(() => [0, 0]);
	for (let s = 0; s < RING.length; s++) {
		const [a, b] = RING[s], f = springForce(x, s);
		F[a][0] += f[0]; F[a][1] += f[1];
		F[b][0] -= f[0]; F[b][1] -= f[1];
	}
	return F;
}

const Mtot = MASS.reduce((s, m) => s + m, 0);
const cm = (x) => [0, 1].map((c) => x.reduce((s, p, a) => s + MASS[a] * p[c], 0) / Mtot);

/** The three instants: positions, and the centre of mass. The body starts stretched (each spring longer than at
 * rest), turning slowly, its parts moving a little against one another, and drifting with the velocity V. */
export function motion() {
	// the start: the pentagon stretched by 22 per cent across and 8 per cent up, then the centre of mass put at 0
	let x = rest.map(([px, py]) => [1.15 * px, 1.11 * py]);
	const c0 = cm(x);
	x = x.map(([px, py]) => [px - c0[0], py - c0[1]]);
	// velocities: a slow turn about the centre of mass, a jostle, and the drift; the jostle and the turn carry no
	// momentum (the jostle's momentum is removed), so the whole momentum is M V
	const jostle = [[0.04, -0.1], [-0.08, 0.04], [0.1, 0.06], [-0.04, -0.08], [0.06, 0.08]];
	let v = x.map(([px, py], a) => [-SPIN * py + jostle[a][0], SPIN * px + jostle[a][1]]);
	const p = [0, 1].map((c) => v.reduce((s, q, a) => s + MASS[a] * q[c], 0) / Mtot);
	v = v.map(([vx, vy]) => [vx - p[0] + V[0], vy - p[1] + V[1]]);
	const dt = T / STEPS;
	const shots = [{ x: x.map((q) => [...q]), F: RING.map((_, s) => springForce(x, s)), cm: cm(x) }];
	const paths = x.map((q) => [[...q]]);
	let F = forces(x);
	for (let i = 1; i <= STEPS * (SHOTS - 1); i++) {
		x = x.map((q, a) => [q[0] + v[a][0] * dt + (0.5 * F[a][0] * dt * dt) / MASS[a], q[1] + v[a][1] * dt + (0.5 * F[a][1] * dt * dt) / MASS[a]]);
		const G = forces(x);
		const sum = G.reduce((s, f) => [s[0] + f[0], s[1] + f[1]], [0, 0]);
		check(Math.hypot(...sum) < 1e-12, 'the inner forces do not add to zero');
		v = v.map((q, a) => [q[0] + (0.5 * (F[a][0] + G[a][0]) * dt) / MASS[a], q[1] + (0.5 * (F[a][1] + G[a][1]) * dt) / MASS[a]]);
		F = G;
		if (i % 100 === 0) x.forEach((q, a) => paths[a].push([...q]));
		if (i % STEPS === 0) shots.push({ x: x.map((q) => [...q]), F: RING.map((_, s) => springForce(x, s)), cm: cm(x) });
	}
	return { shots, paths };
}

// ---- the drawing (figure points, y down) ----------------------------------------------------------------------
const S = 42;                            // points per model unit
const BALL = 4.4;                        // the radius of a part of unit mass, points
const SPRING = 0.5;                      // a spring's stroke
const COILS = 5, AMP = 1.8;              // a spring's zigzag: corners, and half its width
const LEAD = 0.34;                       // the straight part of a spring at each end, a fraction of the gap
const REACH = 110;                       // an arrow's length per unit of force, points
const TAIL = 0.6;                        // each arrow starts this far clear of its ball's outline
const OFF = 4.8;                         // each force's line, set off to the side of its spring's axis, points
const FORCE = 0.85, FORCE_HEAD = 4.6;    // a force's stroke and head
const COM_R = 2.5;                       // the quartered circle's radius
const PATH = 0.45;                       // the parts' paths
const PATH_CLEAR = 1.2;                  // a path stops this far short of a ball or a force
const PATH_MIN = 6;                      // and a piece of path shorter than this is left out
const DOT = 0.6, DOT_STEP = 1.6, HAIRSPACE = 0.8;

export default async function () {
	const sh = new Sheet(name);
	const { shots, paths } = motion();
	const at = ([x, y]) => [ORIGIN + S * (x - V[0] * T), ORIGIN - S * y];      // the middle instant at the page's centre
	const radius = MASS.map((m) => BALL * Math.cbrt(m));

	// the centre of mass: on one straight line, at equal steps of V T
	const c = shots.map((s) => s.cm);
	for (let k = 0; k < SHOTS; k++) {
		check(near(c[k][0], V[0] * T * k, 1e-9) && near(c[k][1], V[1] * T * k, 1e-9), `the centre of mass at instant ${k} is off its line`);
	}
	// the springs at the first instant are all stretched
	check(shots[0].F.every((_, s) => {
		const [a, b] = RING[s], x = shots[0].x;
		return Math.hypot(x[b][0] - x[a][0], x[b][1] - x[a][1]) > LEN0[s];
	}), 'a spring is not stretched at the first instant');

	// ---- each instant: springs, parts, and at the first the forces
	const drawn = [];
	shots.forEach((shot, k) => {
		const X = shot.x.map(at);
		RING.forEach(([a, b], s) => {
			const d = [X[b][0] - X[a][0], X[b][1] - X[a][1]], L = Math.hypot(...d), u = [d[0] / L, d[1] / L], w = [-u[1], u[0]];
			const g0 = radius[a], g1 = L - radius[b], gap = g1 - g0;
			const l0 = g0 + LEAD * gap, l1 = g1 - LEAD * gap;
			const pts = [[X[a][0] + u[0] * g0, X[a][1] + u[1] * g0], [X[a][0] + u[0] * l0, X[a][1] + u[1] * l0]];
			for (let j = 1; j < 2 * COILS; j++) {
				const t = l0 + ((l1 - l0) * j) / (2 * COILS), side = j % 2 ? 1 : -1;
				pts.push([X[a][0] + u[0] * t + w[0] * AMP * side, X[a][1] + u[1] * t + w[1] * AMP * side]);
			}
			pts.push([X[a][0] + u[0] * l1, X[a][1] + u[1] * l1], [X[a][0] + u[0] * g1, X[a][1] + u[1] * g1]);
			sh.path(pts, { color: DIM, width: SPRING, layer: 1, what: `spring ${s} at instant ${k}` });
		});
		X.forEach((p, a) => sh.sphere(p, radius[a], IRON, { spec: 0.45, shininess: 30, layer: 2 }, `part ${a} at instant ${k}`));
		// the centre of mass: the quartered circle
		const [qx, qy] = at(shot.cm), r = COM_R;
		sh.raw(`<path d="M${n2(qx)},${n2(qy)}L${n2(qx - r)},${n2(qy)}A${r},${r} 0 0 1 ${n2(qx)},${n2(qy - r)}Z` +
			`M${n2(qx)},${n2(qy)}L${n2(qx + r)},${n2(qy)}A${r},${r} 0 0 1 ${n2(qx)},${n2(qy + r)}Z" fill="${INK}"/>` +
			`<circle cx="${n2(qx)}" cy="${n2(qy)}" r="${r}" fill="none" stroke="${INK}" stroke-width="${HAIR}"/>`, 3);
		sh.mark([[qx, qy]], r + HAIR / 2, `the centre of mass at instant ${k}`);
		// no spring or part comes near the mark
		X.forEach((p, a) => check(Math.hypot(p[0] - qx, p[1] - qy) > radius[a] + r + 3, `part ${a} touches the centre of mass at instant ${k}`));
		if (k > 0) return;
		// the forces: at each end of each spring, along a line parallel to the spring and OFF to one side of it, each
		// from TAIL clear of its ball's outline. The side is chosen at each part: the one with more room, the larger
		// angle to the next spring at that part (or, if the two are within about 11 degrees, the side away from the
		// centre of mass), so that the forces at a part fan out and keep clear of the springs
		const dirAt = (p, q) => { const d = [X[q][0] - X[p][0], X[q][1] - X[p][1]], l = Math.hypot(...d); return [d[0] / l, d[1] / l]; };
		const sideAt = (p, q) => {
			const u = dirAt(p, q), t0 = Math.atan2(u[1], u[0]);
			let ccw = 2 * Math.PI, cw = 2 * Math.PI;
			for (const [c, d] of RING) {
				const o = c === p ? d : d === p ? c : -1;
				if (o < 0 || o === q) continue;
				const v = dirAt(p, o);
				let t = Math.atan2(v[1], v[0]) - t0;
				t = ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				ccw = Math.min(ccw, t); cw = Math.min(cw, 2 * Math.PI - t);
			}
			const n = [-u[1], u[0]];                                       // the normal on the side of the ccw gap
			if (Math.abs(ccw - cw) < 0.2) {                                 // about even: the side away from the centre of mass
				const C = at(shot.cm), m = [(X[p][0] + X[q][0]) / 2 - C[0], (X[p][1] + X[q][1]) / 2 - C[1]];
				return m[0] * n[0] + m[1] * n[1] >= 0 ? n : [-n[0], -n[1]];
			}
			return ccw > cw ? n : [-n[0], -n[1]];
		};
		RING.forEach(([a, b], s) => {
			const f = shot.F[s], mag = Math.hypot(...f);
			const ue = dirAt(a, b), el = Math.hypot(X[b][0] - X[a][0], X[b][1] - X[a][1]);
			const pair = [[a, b, [f[0], -f[1]]], [b, a, [-f[0], f[1]]]];             // y down on the page
			const pairDrawn = pair.map(([p, q, g]) => {
				const u = [g[0] / mag, g[1] / mag], side = sideAt(p, q);
				const back = Math.sqrt(Math.max(0, (radius[p] + TAIL) ** 2 - OFF ** 2));   // where the line leaves the ball's clearance
				const from = [X[p][0] + u[0] * back + side[0] * OFF, X[p][1] + u[1] * back + side[1] * OFF];
				const to = [from[0] + u[0] * mag * REACH, from[1] + u[1] * mag * REACH];
				const what = `the force of spring ${s} on part ${p}`;
				return { ...sh.arrow(from, to, { color: ACCENT, width: FORCE, head: FORCE_HEAD, layer: 3, what }), what, back };
			});
			check(near(pairDrawn[0].L, pairDrawn[1].L, 1e-9) && near(pairDrawn[0].u[0], -pairDrawn[1].u[0], 1e-12) && near(pairDrawn[0].u[1], -pairDrawn[1].u[1], 1e-12),
				`the forces of spring ${s} are not equal and opposite`);
			check(near(pairDrawn[0].L, mag * REACH, 1e-9), `the arrow of spring ${s} is not in proportion to its force`);
			// each arrow parallel to the spring, OFF from its axis
			for (const d of pairDrawn) {
				check(near(Math.abs(d.u[0] * ue[0] + d.u[1] * ue[1]), 1, 1e-12), `a force of spring ${s} is not parallel to it`);
				for (const q of [d.A, d.B]) check(near(Math.abs((q[0] - X[a][0]) * ue[1] - (q[1] - X[a][1]) * ue[0]), OFF, 1e-9), `a force of spring ${s} is off its line`);
			}
			// the two arrows of a pair stay 3 pt apart, and clear the coils' zigzag sideways
			check(pairDrawn[0].back + pairDrawn[1].back + 2 * mag * REACH < el - 3, `the forces of spring ${s} meet`);
			check(OFF - FORCE / 2 - 0.36 * FORCE_HEAD - AMP - SPRING / 2 > 0.6, `the forces of spring ${s} touch its coils`);
			drawn.push(...pairDrawn);
		});
		// no force touches a ball, and the forces of different springs keep apart
		const segPts = (d) => Array.from({ length: 41 }, (_, i) => [d.A[0] + ((d.B[0] - d.A[0]) * i) / 40, d.A[1] + ((d.B[1] - d.A[1]) * i) / 40]);
		for (const d of drawn) {
			const P = segPts(d);
			X.forEach((p, a) => check(P.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > radius[a] + 0.5), `${d.what} touches part ${a}`));
			for (const e of drawn) {
				if (e === d || e.what.split(' on ')[0] === d.what.split(' on ')[0]) continue;
				const Q = segPts(e);
				check(P.every((q) => Q.every((r) => Math.hypot(q[0] - r[0], q[1] - r[1]) > FORCE + 1.4)), `${d.what} touches ${e.what}`);
			}
		}
	});

	// ---- the paths of the parts, thin and grey, beneath everything, drawn only outside the bodies: a point of a
	// path is left out if it lies inside the ring of springs at any instant drawn, or within PATH_CLEAR of a ball or a
	// force; a piece shorter than PATH_MIN left between them is left out
	const bodies = shots.map((shot) => shot.x.map(at));
	const inRing = (q, X) => {
		let inside = false;
		for (let a = 0, b = N - 1; a < N; b = a++) {
			if ((X[a][1] > q[1]) !== (X[b][1] > q[1]) && q[0] < X[b][0] + ((X[a][0] - X[b][0]) * (q[1] - X[b][1])) / (X[a][1] - X[b][1])) inside = !inside;
		}
		return inside;
	};
	const segDist = (q, a, b) => {
		const d = [b[0] - a[0], b[1] - a[1]], l2 = d[0] ** 2 + d[1] ** 2;
		const t = l2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1]) / l2)) : 0;
		return Math.hypot(q[0] - a[0] - t * d[0], q[1] - a[1] - t * d[1]);
	};
	const outside = (q) => bodies.every((X) => !inRing(q, X) && X.every((p, a) => Math.hypot(q[0] - p[0], q[1] - p[1]) > radius[a] + PATH_CLEAR))
		&& drawn.every((d) => segDist(q, d.A, d.B) > FORCE / 2 + PATH_CLEAR + (Math.hypot(q[0] - d.B[0], q[1] - d.B[1]) < d.head + 1 ? 0.36 * d.head : 0));
	paths.forEach((pts, a) => {
		let run = [];
		const runs = [];
		for (const q of pts.map(at)) {
			if (outside(q)) run.push(q);
			else { if (run.length > 1) runs.push(run); run = []; }
		}
		if (run.length > 1) runs.push(run);
		const length = (r) => r.slice(1).reduce((t, q, i) => t + Math.hypot(q[0] - r[i][0], q[1] - r[i][1]), 0);
		runs.filter((r) => length(r) >= PATH_MIN).forEach((r) => sh.path(r, { color: RULE, width: PATH, layer: 0, what: `the path of part ${a}` }));
	});

	// ---- the centre of mass's line, dotted, from before the first instant to past the last; the dots that would
	// touch a spring, a part, a force or a quartered circle are left out, so that the line passes under them with air
	const A = at([c[0][0] - 0.9, 0]), B = at([c[SHOTS - 1][0] + 0.9, 0]);
	{
		const L = B[0] - A[0], n = Math.round(L / DOT_STEP), step = L / n;
		const segDist = (q, a, b) => {
			const d = [b[0] - a[0], b[1] - a[1]], l2 = d[0] ** 2 + d[1] ** 2;
			const t = l2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * d[0] + (q[1] - a[1]) * d[1]) / l2)) : 0;
			return Math.hypot(q[0] - a[0] - t * d[0], q[1] - a[1] - t * d[1]);
		};
		const solid = sh.marks.filter((m) => /^(spring|part|the centre of mass|the force)/.test(m.what));
		const clear = (q) => solid.every((m) => (m.pts.length === 1 ? Math.hypot(q[0] - m.pts[0][0], q[1] - m.pts[0][1])
			: Math.min(...m.pts.slice(1).map((p, i) => segDist(q, m.pts[i], p)))) - m.r - DOT / 2 >= HAIRSPACE);
		const pts = Array.from({ length: n + 1 }, (_, i) => [A[0] + i * step, A[1]]).filter(clear);
		sh.raw(`<path d="${pts.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${DIM}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 0.5);
		sh.mark([A, B], DOT / 2, 'the line of the centre of mass');
	}

	// ---- labels: one pair named, the centre of mass named at the first instant
	const L = [];
	const X0 = shots[0].x.map(at);
	// the bottom spring, between the lower two parts: its names go below its arrows
	const s0 = 2;
	check(RING[s0][0] === 2 && RING[s0][1] === 3, 'spring 2 is not the bottom one');
	const [a0, b0] = RING[s0];
	const out = (p) => {
		const q = [X0[p][0] - at(shots[0].cm)[0], X0[p][1] - at(shots[0].cm)[1]], l = Math.hypot(...q);
		return [q[0] / l, q[1] / l];
	};
	// each name below the middle of its arrow, or above it if the spring is the upper side of the body
	const below = out(a0)[1] + out(b0)[1] > 0 ? 1 : -1;
	const mid = (p) => drawn.find((d) => d.what === `the force of spring ${s0} on part ${p}`);
	for (const [p, src] of [[a0, '\\boldsymbol F_{ab}'], [b0, '\\boldsymbol F_{ba}']]) {
		const d = mid(p), m = [(d.A[0] + d.B[0]) / 2, (d.A[1] + d.B[1]) / 2];
		L.push(await sh.clear(src, m[0], m[1], 0.5, below > 0 ? 0 : 1, [0, below]));
	}
	L.push(await sh.clear('\\boldsymbol x_{\\rm cm}', B[0] + 2.2, B[1], 0, 0.5, [1, 0]));
	void drawn;

	sh.checkAll(L);
	window.tutMotionParts = { cm: c, forces: shots[0].F.map((f) => Math.hypot(...f)) };
	return finish(sh, L, [380, 460]);
}
