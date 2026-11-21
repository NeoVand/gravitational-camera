/**
 * A ring of marked particles in an exact gravitational plane wave: the mathematics of the figure "A ring of marked
 * particles" (routes/figures/marked-ring), ported from design/checks/ring_memory.py.
 *
 * Free particles, at rest before the wave, in an exact vacuum plane wave. In Brinkmann coordinates their transverse
 * positions obey x'' = H(u) x, with u the wave's phase (time, for the ring) and H(u) = [[A, B], [B, -A]] real,
 * symmetric and trace-free: that is the vacuum condition. X(u) is the 2 x 2 matrix that takes each particle's first
 * place to its place at u: X'' = H X, X(0) = 1, X'(0) = 0. The transverse axes of a gyroscope carried at the ring's
 * centre stay fixed in these coordinates, so an angle measured in them is an angle against the gyroscope.
 *
 * Write X = rho R(theta) S, with R a rotation and S symmetric, positive and of determinant one,
 * S^2 = R(psi/2) diag(e^r, e^-r) R(-psi/2). Then theta is the angle by which the particles' marks have turned against
 * the gyroscope, rho is the ring's radius (the square root of its area over pi), and (r, psi) is its shape: polar
 * coordinates on the hyperbolic plane, with line element dr^2 + sinh^2 r dpsi^2. Exactly,
 *
 *     theta' = (1/2)(cosh r - 1) psi',        rho'' = -(1/4)(r'^2 + sinh^2 r psi'^2) rho,
 *
 * so theta is half the signed hyperbolic area swept by the line from the round shape to the present one, and the
 * ring always shrinks: after any wave it comes to a focus (rho = 0) in a finite time. Nothing here is approximated
 * but the integration itself, a fourth-order Runge-Kutta rule with a fixed step.
 */

/** A 2 x 2 matrix by rows: [m11, m12, m21, m22]. */
export type Mat2 = [number, number, number, number];

/**
 * The burst the figure offers, of duration T: H = epsilon Q'' with Q = [[a, b], [b, -a]],
 *
 *     a(u) = env(u) cos(2 pi n u / T),    b(u) = s env(u) sin(2 pi n u / T),    env(u) = sin^4(pi u / T),
 *
 * so that a and b vanish with their slopes at both ends. The strain is h+ = 2 epsilon a, hx = 2 epsilon b.
 */
export interface Wave {
	/** the strength epsilon */
	epsilon: number;
	/** n: how many times the strain (a, b) turns in its plane during the burst */
	turns: number;
	/** s: +1 right-handed, -1 left-handed, 0 linear (b = 0) */
	hand: 1 | -1 | 0;
	/** the burst's duration; 1 if left out */
	T?: number;
}

/** A wave given by its tidal matrix alone: H(u) for 0 <= u <= T, and nothing after. */
export interface TidalWave {
	T: number;
	H: (u: number) => Mat2;
}

/** The two parts of the strain, a and b, with their first and second derivatives. */
export interface Profile {
	a: number;
	b: number;
	a1: number;
	b1: number;
	a2: number;
	b2: number;
}

/** Steps of the integration through the wave; two thousand is ample for up to three turns. */
export const STEPS = 2000;

const TAU = 2 * Math.PI;

const det = (M: Mat2) => M[0] * M[3] - M[1] * M[2];

const times = (A: Mat2, B: Mat2): Mat2 => [
	A[0] * B[0] + A[1] * B[2],
	A[0] * B[1] + A[1] * B[3],
	A[2] * B[0] + A[3] * B[2],
	A[2] * B[1] + A[3] * B[3]
];

/** A + s B */
const plus = (A: Mat2, B: Mat2, s: number): Mat2 => [
	A[0] + s * B[0],
	A[1] + s * B[1],
	A[2] + s * B[2],
	A[3] + s * B[3]
];

/** The angle equal to `angle` up to whole turns that lies nearest to the one before it. */
const near = (angle: number, before: number) => angle - TAU * Math.round((angle - before) / TAU);

/**
 * The strain's two parts a and b at phase u, with their first and second derivatives, all analytic. They are the
 * parts of Q, without the strength: the strain itself is 2 epsilon (a, b). Outside the burst all six vanish.
 */
export function profile(u: number, wave: Wave): Profile {
	const T = wave.T ?? 1;
	if (!(u > 0 && u < T)) return { a: 0, b: 0, a1: 0, b1: 0, a2: 0, b2: 0 };
	const w = Math.PI / T;
	const omega = (TAU * wave.turns) / T;
	const s = Math.sin(w * u);
	const c = Math.cos(w * u);
	const env = s ** 4;
	const env1 = 4 * w * s ** 3 * c;
	const env2 = 4 * w * w * s * s * (3 * c * c - s * s);
	const cos = Math.cos(omega * u);
	const sin = Math.sin(omega * u);
	const a = env * cos;
	const a1 = env1 * cos - omega * env * sin;
	const a2 = env2 * cos - 2 * omega * env1 * sin - omega * omega * env * cos;
	if (wave.hand === 0) return { a, b: 0, a1, b1: 0, a2, b2: 0 };
	const b = wave.hand * env * sin;
	const b1 = wave.hand * (env1 * sin + omega * env * cos);
	const b2 = wave.hand * (env2 * sin + 2 * omega * env1 * cos - omega * omega * env * sin);
	return { a, b, a1, b1, a2, b2 };
}

/** The wave's tidal matrix H = epsilon Q'' at phase u: real, symmetric and trace-free. */
export function H(u: number, wave: Wave): Mat2 {
	const { a2, b2 } = profile(u, wave);
	const A = wave.epsilon * a2;
	const B = wave.epsilon * b2;
	return [A, B, B, -A];
}

/** X and X' at equal steps of u, from the wave's first moment on. */
export interface Run {
	/** the wave's duration */
	T: number;
	/** the step of u between one sample and the next */
	h: number;
	/** the index of the sample at u = T, or -1 if the run stops before the wave has passed */
	end: number;
	u: number[];
	/** X at each sample, as [x11, x12, x21, x22] */
	X: Mat2[];
	/** X' at each sample */
	dX: Mat2[];
}

/**
 * X'' = H X from X(0) = 1, X'(0) = 0 to uEnd (the end of the wave, if left out): through the wave by the classical
 * fourth-order Runge-Kutta rule, in `steps` equal steps of T / steps, and after it, where H = 0 and every particle
 * moves uniformly, by X(u) = X(T) + (u - T) X'(T) at the same step.
 */
export function integrate(wave: Wave | TidalWave, uEnd?: number, steps = STEPS): Run {
	const field: TidalWave = 'H' in wave ? wave : { T: wave.T ?? 1, H: (u: number) => H(u, wave) };
	const { T } = field;
	const h = T / steps;
	const last = uEnd ?? T;
	const inWave = Math.max(0, Math.min(steps, Math.round(last / h)));
	const at = (i: number) => (i === steps ? T : i * h);

	let x: Mat2 = [1, 0, 0, 1];
	let v: Mat2 = [0, 0, 0, 0];
	const u = [0];
	const X = [x];
	const dX = [v];
	let H0 = field.H(0);
	for (let i = 0; i < inWave; i++) {
		const Hm = field.H(i * h + h / 2);
		const H1 = field.H(at(i + 1));
		const k1x = v;
		const k1v = times(H0, x);
		const k2x = plus(v, k1v, h / 2);
		const k2v = times(Hm, plus(x, k1x, h / 2));
		const k3x = plus(v, k2v, h / 2);
		const k3v = times(Hm, plus(x, k2x, h / 2));
		const k4x = plus(v, k3v, h);
		const k4v = times(H1, plus(x, k3x, h));
		const x0 = x;
		const v0 = v;
		x = [0, 1, 2, 3].map(
			(j) => x0[j] + (h / 6) * (k1x[j] + 2 * k2x[j] + 2 * k3x[j] + k4x[j])
		) as Mat2;
		v = [0, 1, 2, 3].map(
			(j) => v0[j] + (h / 6) * (k1v[j] + 2 * k2v[j] + 2 * k3v[j] + k4v[j])
		) as Mat2;
		H0 = H1;
		u.push(at(i + 1));
		X.push(x);
		dX.push(v);
	}
	if (inWave < steps) return { T, h, end: -1, u, X, dX };

	// after the wave: uniform motion
	const after = Math.max(0, Math.round((last - T) / h));
	for (let j = 1; j <= after; j++) {
		u.push(T + j * h);
		X.push(plus(x, v, j * h));
		dX.push([...v]);
	}
	return { T, h, end: steps, u, X, dX };
}

/** The sample of a run nearest to the phase u. */
export function indexAt(run: Run, u: number): number {
	return Math.max(0, Math.min(run.u.length - 1, Math.round(u / run.h)));
}

/** The ring's four parts: its radius, the turn of its marks, and its shape. */
export interface Polar {
	/** the radius, sqrt(det X), with the first radius as the unit */
	rho: number;
	/** the turn of the marks against the gyroscope, radians */
	theta: number;
	/** how far the shape is from round: the axes of the ring are rho e^(r/2) and rho e^(-r/2) */
	r: number;
	/** twice the angle of the longer axis, before the turn theta */
	psi: number;
}

/**
 * X = rho R(theta) S taken apart. With C = X^T X = rho^2 S^2:
 *
 *     theta = atan2(X21 - X12, X11 + X22),    psi = atan2(2 C12, C11 - C22),    sinh r = |(C11 - C22, 2 C12)| / 2 rho^2,
 *
 * the last being the same r as cosh r = tr C / 2 rho^2, and better conditioned near the round shape. Both angles
 * lie between -pi and pi. At a focus and past it det X is not positive, and there is no such radius or shape: rho
 * and r are then NaN.
 */
export function polar(X: Mat2): Polar {
	const [x11, x12, x21, x22] = X;
	const d = det(X);
	const c11 = x11 * x11 + x21 * x21;
	const c22 = x12 * x12 + x22 * x22;
	const c12 = x11 * x12 + x21 * x22;
	const theta = Math.atan2(x21 - x12, x11 + x22);
	const psi = Math.atan2(2 * c12, c11 - c22);
	if (!(d > 0)) return { rho: NaN, theta, r: NaN, psi };
	return {
		rho: Math.sqrt(d),
		theta,
		r: Math.asinh(Math.hypot(c11 - c22, 2 * c12) / (2 * d)),
		psi
	};
}

/** rho' = (det X)' / 2 rho, the rate at which the ring's radius changes. */
export function radiusRate(X: Mat2, dX: Mat2): number {
	return (dX[0] * X[3] + X[0] * dX[3] - dX[1] * X[2] - X[1] * dX[2]) / (2 * Math.sqrt(det(X)));
}

/** The ring's parts along a run, sample by sample. */
export interface PolarRun {
	/**
	 * How many samples, from the first, have these parts: all of them, unless the ring comes to a focus within the
	 * run, where they stop (the entries after it are NaN).
	 */
	count: number;
	rho: Float64Array;
	/** unwrapped: continuous along the run */
	theta: Float64Array;
	r: Float64Array;
	/** unwrapped: continuous along the run */
	psi: Float64Array;
	/** half the signed hyperbolic area swept so far: (1/2) ∫ (cosh r - 1) dpsi */
	swept: Float64Array;
}

/**
 * `polar` at every sample of a run, with theta and psi unwrapped so that they are continuous, and with them half the
 * signed hyperbolic area swept so far by the line from the round shape to the present one. The first law says that
 * this equals theta.
 *
 * The area is summed as geodesic triangles with one corner at the round shape and the others at successive samples;
 * with t = tanh(r/2), half the area of such a triangle is atan2(t t' sin dpsi, 1 - t t' cos dpsi). This is exact for
 * a path of straight steps, so a path through the round shape itself (a linearly polarised wave's) sweeps exactly
 * nothing. At every second sample the triangle over two steps is used to remove the sum's leading error
 * (Richardson's step), which lets the area be compared with theta to more figures than h^2 allows.
 */
export function polarAlong(run: Run): PolarRun {
	const n = run.X.length;
	const rho = new Float64Array(n).fill(NaN);
	const theta = new Float64Array(n).fill(NaN);
	const r = new Float64Array(n).fill(NaN);
	const psi = new Float64Array(n).fill(NaN);
	const swept = new Float64Array(n).fill(NaN);
	/** tanh(r / 2) at each sample: the shape's distance from the centre of the Poincaré disc */
	const t = new Float64Array(n);
	/** half the area of the triangle from the round shape to samples i and j */
	const triangle = (i: number, j: number) => {
		const d = psi[j] - psi[i];
		return Math.atan2(t[i] * t[j] * Math.sin(d), 1 - t[i] * t[j] * Math.cos(d));
	};
	let count = n;
	for (let i = 0; i < n; i++) {
		const p = polar(run.X[i]);
		if (!(p.rho > 0)) {
			count = i;
			break;
		}
		rho[i] = p.rho;
		r[i] = p.r;
		t[i] = Math.tanh(p.r / 2);
		theta[i] = i ? near(p.theta, theta[i - 1]) : p.theta;
		psi[i] = i ? near(p.psi, psi[i - 1]) : p.psi;
		if (i === 0) swept[i] = 0;
		else if (i % 2) swept[i] = swept[i - 1] + triangle(i - 1, i);
		else
			swept[i] =
				swept[i - 2] + (4 * (triangle(i - 2, i - 1) + triangle(i - 1, i)) - triangle(i - 2, i)) / 3;
	}
	return { count, rho, theta, r, psi, swept };
}

/**
 * Half the signed hyperbolic area swept by the ring's shape over a run, as the first law writes it:
 * (1/2) ∫ (cosh r - 1) dpsi, by the trapezoid rule over the run's samples, to compare with theta at its end. Good
 * to h^2 for a path that keeps clear of the round shape after leaving it; `polarAlong` sums the same area by
 * triangles, which also holds for a path through the round shape.
 */
export function areaAngle(run: Run): number {
	const { count, r, psi } = polarAlong(run);
	let sum = 0;
	for (let i = 1; i < count; i++) {
		// (1/2)(cosh r - 1) = sinh^2(r / 2)
		sum += 0.5 * (Math.sinh(r[i - 1] / 2) ** 2 + Math.sinh(r[i] / 2) ** 2) * (psi[i] - psi[i - 1]);
	}
	return sum;
}

/**
 * The turn of the marks after a weak wave, to second order in its strength: epsilon^2 ∮ (a db - b da), by the
 * trapezoid rule. In terms of the strain this is (1/4) ∮ (h+ dhx - hx dh+).
 */
export function weakAngle(wave: Wave, steps = STEPS): number {
	const h = (wave.T ?? 1) / steps;
	let sum = 0;
	for (let i = 1; i < steps; i++) {
		const { a, b, a1, b1 } = profile(i * h, wave);
		sum += a * b1 - b * a1;
	}
	return wave.epsilon ** 2 * sum * h;
}

/**
 * The rate rho' at which the ring is left shrinking by a weak wave, to second order in its strength:
 * -epsilon^2 ∫ (a'^2 + b'^2) du, by the trapezoid rule.
 */
export function weakShrink(wave: Wave, steps = STEPS): number {
	const h = (wave.T ?? 1) / steps;
	let sum = 0;
	for (let i = 1; i < steps; i++) {
		const { a1, b1 } = profile(i * h, wave);
		sum += a1 * a1 + b1 * b1;
	}
	return -(wave.epsilon ** 2) * sum * h;
}

/**
 * When the ring comes to a focus after the wave: the first u > T at which det X vanishes. After the wave
 * X(T + t) = X(T) + t X'(T), so det X is a quadratic in t, c + b t + a t^2 with c = det X(T), a = det X'(T) and
 * b = d(det X)/dt at T; this is its smallest positive root, added to T. Because X' X^-1 is symmetric the roots are
 * real. Null if the run stops before the wave has passed, or if no root is positive (no wave at all, or a ring
 * already through a focus and spreading).
 */
export function focusTime(run: Run): number | null {
	if (run.end < 0) return null;
	const X = run.X[run.end];
	const V = run.dX[run.end];
	const c = det(X);
	const b = X[0] * V[3] + V[0] * X[3] - X[1] * V[2] - V[1] * X[2];
	const a = det(V);
	const roots: number[] = [];
	if (a === 0) {
		if (b !== 0) roots.push(-c / b);
	} else {
		let disc = b * b - 4 * a * c;
		// a ring that shrinks without shear has a double root, which rounding can leave just short of real
		if (disc < 0 && disc > -1e-9 * b * b) disc = 0;
		if (disc >= 0) {
			const q = -0.5 * (b + (b < 0 ? -1 : 1) * Math.sqrt(disc));
			roots.push(q / a);
			if (q !== 0) roots.push(c / q);
		}
	}
	const positive = roots.filter((t) => t > 0 && Number.isFinite(t));
	return positive.length ? run.T + Math.min(...positive) : null;
}

/** The ring exactly at its focus. */
export interface Focus {
	/** when it comes: the phase u that `focusTime` finds */
	u: number;
	/** X there: its determinant is zero, and the ring is drawn out into a segment (or shrunk to a point) */
	X: Mat2;
	/** the turn of the marks there, continuous with the run's */
	theta: number;
	/** where the shape runs off the edge of the hyperbolic plane: psi there, continuous with the run's */
	psi: number;
	/** half the area swept on the way there, which the first law makes equal to theta */
	swept: number;
}

/**
 * The ring at the focus that `focusTime` finds, if the run reaches it: the turn of its marks, the direction in which
 * its shape has run off to the edge of the hyperbolic plane (r is infinite there), and half the area swept on the
 * way. The radius is zero there, but X is not: the ring is drawn out into a segment, and the two angles are read
 * from X as `polar` reads them. Should the ring shrink to a point instead, X vanishes, and they are read from -X',
 * the motion that brings it there. After the wave the shape moves along a geodesic, so the area between the last
 * sample and the edge is one triangle with a corner at infinity, and no approximation.
 * Null if the run stops short of the focus, or if the ring comes to a focus before the wave has passed.
 */
export function atFocus(run: Run, parts: PolarRun = polarAlong(run)): Focus | null {
	const u = focusTime(run);
	const last = parts.count - 1;
	if (u === null || u > run.u[run.u.length - 1] || last < run.end) return null;
	const XT = run.X[run.end];
	const VT = run.dX[run.end];
	const X = plus(XT, VT, u - run.T);
	const size = (M: Mat2) => Math.hypot(...M);
	const there = polar(size(X) > 1e-6 * size(XT) ? X : plus([0, 0, 0, 0], VT, -1));
	const theta = near(there.theta, parts.theta[last]);
	const psi = near(there.psi, parts.psi[last]);
	// the triangle from the round shape to the last sample and on to the edge, where tanh(r/2) = 1
	const t = Math.tanh(parts.r[last] / 2);
	const d = psi - parts.psi[last];
	const swept = parts.swept[last] + Math.atan2(t * Math.sin(d), 1 - t * Math.cos(d));
	return { u, X, theta, psi, swept };
}

/** A path of the ring's shape: u -> [r, r', psi, psi']. */
export type ShapePath = (u: number) => [r: number, dr: number, psi: number, dpsi: number];

/** The wave that carries the ring's shape along a given path, with what the two laws say of its end. */
export interface ShapeWave extends TidalWave {
	/** the turn of the marks when the wave has passed, from theta' = (1/2)(cosh r - 1) psi' */
	theta: number;
	/** the radius then, and its rate, from rho'' = -(1/4)(r'^2 + sinh^2 r psi'^2) rho */
	rho: number;
	drho: number;
}

/**
 * The wave H(u) that makes the ring's shape follow a given path, for 0 <= u <= T (ring_memory.py: shape_run,
 * strain, wave). The two laws are integrated along the path for theta, rho and rho' (Runge-Kutta, `steps` steps);
 * from them the ring's rate of strain is
 *
 *     S = X' X^-1 = (rho'/rho) 1 + R(m) [(r'/2) sz + (psi' sinh r / 2) sx] R(-m),    m = theta + psi/2,
 *
 * with sz = diag(1, -1) and sx = [[0, 1], [1, 0]]; and the wave is H = S' + S^2, with S' by a fourth-order central
 * difference. S is symmetric only if theta obeys the first law, and H is trace-free only if rho obeys the second:
 * nothing in the construction forces a vacuum wave. Integrating X'' = H X forwards with `integrate` and taking the
 * result apart again then tests both laws. Used in the tests only.
 */
export function fromShapePath(path: ShapePath, T = 1, steps = STEPS): ShapeWave {
	type State = [theta: number, rho: number, drho: number];
	const h = T / steps;
	const rate = (u: number, y: State): State => {
		const [r, dr, , dpsi] = path(u);
		return [
			0.5 * (Math.cosh(r) - 1) * dpsi,
			y[2],
			-0.25 * (dr * dr + Math.sinh(r) ** 2 * dpsi * dpsi) * y[1]
		];
	};
	const to = (y: State, k: State, s: number): State => [
		y[0] + s * k[0],
		y[1] + s * k[1],
		y[2] + s * k[2]
	];
	const step = (u: number, y: State, d: number): State => {
		const k1 = rate(u, y);
		const k2 = rate(u + d / 2, to(y, k1, d / 2));
		const k3 = rate(u + d / 2, to(y, k2, d / 2));
		const k4 = rate(u + d, to(y, k3, d));
		return [0, 1, 2].map((j) => y[j] + (d / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])) as State;
	};
	const nodes: State[] = [[0, 1, 0]];
	for (let i = 0; i < steps; i++) nodes.push(step(i * h, nodes[i], h));
	/** theta, rho and rho' at any u of the wave: one short step from the node before it */
	const at = (u: number): State => {
		const i = Math.max(0, Math.min(steps, Math.floor(u / h)));
		return step(i * h, nodes[i], u - i * h);
	};
	const strain = (u: number): Mat2 => {
		const [r, dr, psi, dpsi] = path(u);
		const [theta, rho, drho] = at(u);
		const p = 0.5 * dr;
		const q = 0.5 * dpsi * Math.sinh(r);
		const c = Math.cos(2 * theta + psi);
		const s = Math.sin(2 * theta + psi);
		const even = p * c - q * s;
		const odd = p * s + q * c;
		return [drho / rho + even, odd, odd, drho / rho - even];
	};
	const d = 1e-4 * T;
	const wave = (u: number): Mat2 => {
		if (u < 0 || u > T) return [0, 0, 0, 0];
		// the difference needs two steps of room on either side
		const w = Math.min(Math.max(u, 2 * d), T - 2 * d);
		const S = strain(w);
		const SS = times(S, S);
		const [m2, m1, p1, p2] = [w - 2 * d, w - d, w + d, w + 2 * d].map(strain);
		return [0, 1, 2, 3].map(
			(j) => (-p2[j] + 8 * p1[j] - 8 * m1[j] + m2[j]) / (12 * d) + SS[j]
		) as Mat2;
	};
	const [theta, rho, drho] = nodes[steps];
	return { T, H: wave, theta, rho, drho };
}
