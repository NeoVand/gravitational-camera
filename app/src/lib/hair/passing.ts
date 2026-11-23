/**
 * A mass that passes (paper, Section XIII, Eq. pass and Fig. passing; reference/gravcam/passing.py). A mass mu flies
 * past a body on a straight line at the speed V, fast enough that the parts of the body do not move meanwhile. Let b
 * be the point where its path crosses the plane through the body at right angles to it. A part of the body that lies
 * over the point s of that plane receives the velocity
 *
 *     C (b - s) / |b - s|^2,      C = 2 G mu / V,
 *
 * wherever it lies along the path (the impulse approximation of stellar dynamics), and the body gains
 *
 *     dE(b) = (C^2 / 2) int Sigma(s) / |b - s|^2 d^2s,
 *
 * with Sigma its mass per area projected along the path. Of that, M C^2 / 2 b^2 is the recoil of the whole body; the
 * rest is left inside it, and depends on how the mass is arranged.
 *
 * Bodies are round and made of thin shells (lib/hair/ladder.ts). Units: lengths in R, the outer radius of the second
 * body of the pair; masses in M; F = int Sigma / |b - s|^2 d^2s in M / R^2, so that an energy in units of
 * M C^2 / 2 R^2 is F itself. Used by the figure "A mass that passes" (routes/figures/a-mass-that-passes).
 */
import type { Body, Shell } from './ladder';

/** The two bodies of the paper's figure: the same mass and the same field outside, and the same M <r^2>. */
export const TWINS: { a: Body; b: Body } = {
	a: { name: 'a shell of radius R/√2', shells: [{ mass: 1, radius: Math.SQRT1_2 }] },
	b: {
		name: 'half at the centre, half on a shell of radius R',
		shells: [
			{ mass: 1 / 2, radius: 0 },
			{ mass: 1 / 2, radius: 1 }
		]
	}
};

/** The pass of the paper's figure, b = 1.5 R, and the range the figure offers. */
export const PAPER_PASS = 1.5;
export const NEAREST = 1.04;
export const FARTHEST = 4;

/**
 * F for one thin shell of mass m and radius r, the pass at the distance b > r from its centre:
 * m asin(r/b) / (r sqrt(b^2 - r^2)), and m / b^2 for a point (r = 0). Its projection along the path is the disc of
 * radius r with Sigma = m / (2 pi r sqrt(r^2 - s^2)).
 */
export function shellF(shell: Shell, b: number): number {
	const { mass, radius: r } = shell;
	if (r === 0) return mass / (b * b);
	return (mass * Math.asin(r / b)) / (r * Math.sqrt(b * b - r * r));
}

/** F for a body: what the whole of it gains from the pass, in units of M C^2 / 2 R^2. */
export function bodyF(body: Body, b: number): number {
	return body.shells.reduce((sum, shell) => sum + shellF(shell, b), 0);
}

/** The body's mass. */
export const mass = (body: Body) => body.shells.reduce((sum, shell) => sum + shell.mass, 0);

/** The recoil of the whole body, M / b^2: what any body of its mass gains, by the shell theorem in the plane. */
export const recoilF = (body: Body, b: number) => mass(body) / (b * b);

/** The energy left inside the body, in units of M C^2 / 2 R^2: all it gains, less its recoil. */
export const internalF = (body: Body, b: number) => bodyF(body, b) - recoilF(body, b);

/**
 * The coefficient of M <r^(2p)> / b^(2p + 2) in F: c_p = (2p)!! / (2p + 1)!!, the mean of sin^(2p) over a sphere.
 * 1, 2/3, 8/15, 16/35, ...
 */
export function seriesCoefficient(p: number): number {
	let c = 1;
	for (let k = 1; k <= p; k++) c *= (2 * k) / (2 * k + 1);
	return c;
}

/** F as the series of the paper, M/b^2 + (2/3) M<r^2>/b^4 + (8/15) M<r^4>/b^6 + ..., to `terms` terms. */
export function seriesF(body: Body, b: number, terms = 60): number {
	let sum = 0;
	for (let p = 0; p < terms; p++) {
		const moment = body.shells.reduce((s, shell) => s + shell.mass * shell.radius ** (2 * p), 0);
		sum += (seriesCoefficient(p) * moment) / b ** (2 * p + 2);
	}
	return sum;
}

/**
 * How far apart the two bodies' energies are far away, in units of M C^2 / 2 R^2: they share M and M <r^2>, and differ
 * first in M <r^4>, by R^4 / 4, so by (8/15)(1/4) / b^6 = (2/15) / b^6. In ordinary units M C^2 R^4 / 15 b^6.
 */
export const farDifference = (b: number) => 2 / (15 * b ** 6);

/** A point of the plane across the path, [x, y], in units of R. */
export type Point = [number, number];

/** The velocity a part over the point s receives, in units of C / R, with the pass at b: (b - s) / |b - s|^2. */
export function kick(s: Point, b: Point): Point {
	const dx = b[0] - s[0],
		dy = b[1] - s[1];
	const q = dx * dx + dy * dy;
	return [dx / q, dy / q];
}

/** The same, less the recoil of the whole body, b / |b|^2: what the part moves by inside the body. */
export function relativeKick(s: Point, b: Point): Point {
	const [vx, vy] = kick(s, b);
	const [rx, ry] = kick([0, 0], b);
	return [vx - rx, vy - ry];
}

/**
 * F by quadrature: each shell cut into n bands of equal height along the path (equal mass, by Archimedes) and m
 * points round each band, every point given its share of the shell's mass. A check on shellF and on the impulses:
 * the sum of mass |kick|^2.
 */
export function quadratureF(body: Body, b: number, n = 400, m = 400): number {
	let sum = 0;
	for (const shell of body.shells) {
		if (shell.radius === 0) {
			sum += shell.mass / (b * b);
			continue;
		}
		const share = shell.mass / (n * m);
		for (let i = 0; i < n; i++) {
			// the height along the path: the middle of band i
			const z = 1 - (2 * i + 1) / n;
			const across = shell.radius * Math.sqrt(1 - z * z);
			for (let j = 0; j < m; j++) {
				const phi = (2 * Math.PI * (j + 0.5 * (i % 2))) / m;
				const [vx, vy] = kick([across * Math.cos(phi), across * Math.sin(phi)], [b, 0]);
				sum += share * (vx * vx + vy * vy);
			}
		}
	}
	return sum;
}

// --- the paper's example ----------------------------------------------------------------------------------------------

/** A tonne at 44 km/s, passing a steel ball a metre across (SI units throughout). */
export const STEEL_EXAMPLE = {
	G: 6.674e-11,
	mu: 1000,
	V: 4.4e4,
	radius: 0.5,
	density: 7850
};

/**
 * The paper's example, with the pass at `b` metres from the ball's centre (1.5 m in the paper: a metre from its
 * edge). A uniform ball has M <r^(2p)> = 3 M a^(2p) / (2p + 3). Returns C, the kick the nearest edge receives, and the
 * passing mass's loss of speed as a part of its speed, dV / V = dE / (mu V^2): in all, and the part that is left
 * inside the ball, which is the part that depends on how its mass is arranged.
 */
export function steelBall(b = 1.5, example = STEEL_EXAMPLE) {
	const { G, mu, V, radius: a, density } = example;
	const M = (density * 4 * Math.PI * a ** 3) / 3;
	const C = (2 * G * mu) / V;
	let F = 0;
	for (let p = 0; p < 80; p++)
		F += (seriesCoefficient(p) * 3 * a ** (2 * p)) / (2 * p + 3) / b ** (2 * p + 2);
	F *= M;
	const recoil = M / (b * b);
	const scale = (0.5 * C * C) / (mu * V * V);
	return {
		M,
		C,
		edgeKick: C / (b - a),
		totalLoss: scale * F,
		internalLoss: scale * (F - recoil)
	};
}
