/** The flyby of chapter 1.8, against quadrature, against the paper's series and against the chapter's numbers. */
import { describe, expect, it } from 'vitest';
import { shellF } from '../../hair/passing';
import {
	BALL,
	FROZEN,
	G,
	PAPER_PASS,
	PAPER_SPEED,
	PARTS,
	RADIUS,
	RINGING,
	STEEL,
	TONNE,
	ballEnergy,
	deflection,
	kick,
	kickAt,
	kickSoFar,
	passDuration,
	peak,
	pull,
	slowing,
	strength,
	tickStep,
	type Point
} from './flyby-kick';

const relative = (a: number, b: number, tolerance: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.abs(b));
const absolute = (a: number, b: number, tolerance: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance);

/** Composite Simpson's rule on [lo, hi] with n (even) intervals. */
function simpson(f: (x: number) => number, lo: number, hi: number, n = 4000) {
	const h = (hi - lo) / n;
	let sum = f(lo) + f(hi);
	for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(lo + i * h);
	return (sum * h) / 3;
}

/** ∫ f dt over all time, by t = (B/V) sinh u, which brings the slow tails in. */
const overTime = (f: (t: number) => number, B: number, V: number, n = 8000) =>
	simpson((u) => f((B / V) * Math.sinh(u)) * (B / V) * Math.cosh(u), -40, 40, n);

const passes = [
	{ mu: TONNE, B: 1, V: 44e3 },
	{ mu: TONNE, B: 0.2, V: 1e3 },
	{ mu: 70, B: 5, V: 100e3 },
	{ mu: 3e4, B: 2.3, V: 7.5e3 }
];

describe('one part', () => {
	it('gains 2Gμ/BV across, the area under its pull, and nothing along the path', () => {
		for (const { mu, B, V } of passes) {
			relative(
				overTime((t) => pull(mu, B, V, t).across, B, V),
				kick(mu, B, V),
				1e-10
			);
			absolute(
				overTime((t) => pull(mu, B, V, t).along, B, V),
				0,
				1e-12 * kick(mu, B, V)
			);
			relative(kick(mu, B, V), (2 * G * mu) / (B * V), 1e-15);
		}
	});

	it('gains, by each moment, the integral of its pull so far', () => {
		for (const { mu, B, V } of passes) {
			for (const tau of [-3, -0.7, 0, 0.4, 2.5].map((x) => (x * B) / V)) {
				const so = kickSoFar(mu, B, V, tau);
				// the pull from the far past to τ, by the same substitution cut at τ
				const upTo = asinhOf(V * tau, B);
				const across = simpson(
					(u) => pull(mu, B, V, (B / V) * Math.sinh(u)).across * (B / V) * Math.cosh(u),
					-40,
					upTo,
					8000
				);
				const along = simpson(
					(u) => pull(mu, B, V, (B / V) * Math.sinh(u)).along * (B / V) * Math.cosh(u),
					-40,
					upTo,
					8000
				);
				relative(so.across, across, 1e-9);
				relative(so.along, along, 1e-9);
			}
		}
	});

	it('has half its kick at closest approach, all of it after, none before', () => {
		for (const { mu, B, V } of passes) {
			relative(kickSoFar(mu, B, V, 0).across, kick(mu, B, V) / 2, 1e-15);
			relative(kickSoFar(mu, B, V, 0).along, -(G * mu) / (B * V), 1e-15);
			expect(kickSoFar(mu, B, V, Infinity)).toEqual({ across: kick(mu, B, V), along: 0 });
			expect(kickSoFar(mu, B, V, -Infinity)).toEqual({ across: 0, along: 0 });
			relative(kickSoFar(mu, B, V, (1e7 * B) / V).across, kick(mu, B, V), 1e-12);
			absolute(kickSoFar(mu, B, V, (-1e7 * B) / V).across, 0, 1e-12 * kick(mu, B, V));
		}
	});

	it('gets the same kick wherever it lies along the path: its pulse is only shifted', () => {
		const { mu, B, V } = passes[0];
		// the five parts of a row along the path, at z = −0.5 … 0.5 m: each feels the pull 0.25/V later than the last
		const kicks = [-0.5, -0.25, 0, 0.25, 0.5].map((z) =>
			simpson((t) => pull(mu, B, V, t - z / V).across, -2e-2, 2e-2, 200000)
		);
		for (const k of kicks) relative(k, kicks[2], 1e-9);
		relative(kicks[2], kick(mu, B, V), 1e-4);
	});

	it('is pulled hardest, Gμ/B², at closest approach, and gets the kick the peak pull would give in 2B/V', () => {
		for (const { mu, B, V } of passes) {
			relative(pull(mu, B, V, 0).across, peak(mu, B), 1e-15);
			relative(passDuration(B, V), (2 * B) / V, 1e-15);
			// the duration of the pass: the peak pull acting for it gives the kick, the area under the pulse
			relative(kick(mu, B, V), peak(mu, B) * passDuration(B, V), 1e-15);
			relative(
				overTime((t) => pull(mu, B, V, t).across, B, V) / peak(mu, B),
				passDuration(B, V),
				1e-10
			);
		}
	});
});

describe('the plane across the path', () => {
	const C = 3e-12;
	const b: Point = [1.5, 0];

	it('gives a part over s the kick C(b − s)/|b − s|², toward the path, of size C/B', () => {
		for (const s of PARTS) {
			const [kx, ky] = kickAt(C, b, s);
			const B = Math.hypot(b[0] - s[0], b[1] - s[1]);
			relative(Math.hypot(kx, ky), C / B, 1e-14);
			// along b − s
			absolute(kx * (b[1] - s[1]) - ky * (b[0] - s[0]), 0, 1e-26);
			expect(kx * (b[0] - s[0]) + ky * (b[1] - s[1])).toBeGreaterThan(0);
		}
	});

	it('agrees with the kick of one part: C/B is 2Gμ/BV', () => {
		for (const { mu, B, V } of passes) relative(strength(mu, V) / B, kick(mu, B, V), 1e-15);
	});

	it('moves a uniform ball as a whole at C/b toward the path: the mean kick, by quadrature', () => {
		const R = RADIUS;
		// Σ(s) = 2ρ√(R² − s²), in polar coordinates about the centre; the mean is weighted by mass
		let mx = 0,
			my = 0,
			m = 0;
		const rings = 400,
			angles = 400;
		for (let i = 0; i < rings; i++) {
			const s = ((i + 0.5) / rings) * R;
			const w = 2 * STEEL * Math.sqrt(R * R - s * s) * s * (R / rings) * ((2 * Math.PI) / angles);
			for (let j = 0; j < angles; j++) {
				const phi = (2 * Math.PI * j) / angles;
				const [kx, ky] = kickAt(C, b, [s * Math.cos(phi), s * Math.sin(phi)]);
				mx += w * kx;
				my += w * ky;
				m += w;
			}
		}
		relative(m, BALL, 1e-4);
		relative(mx / m, C / b[0], 1e-6);
		absolute(my / m, 0, 1e-9 * (C / b[0]));
	});
});

describe('what a pass leaves in a uniform ball', () => {
	const C = 3e-12;
	const R = RADIUS;
	const M = BALL;

	/** Eq. pass by quadrature over the projected disc: the ring average of 1/|b − s|² done numerically too. */
	function quadrature(b: number) {
		let F = 0;
		const rings = 600,
			angles = 600;
		for (let i = 0; i < rings; i++) {
			// s = R sin θ, which brings the √(R² − s²) edge in smoothly
			const theta = ((i + 0.5) / rings) * (Math.PI / 2);
			const s = R * Math.sin(theta);
			const ds = R * Math.cos(theta) * (Math.PI / 2 / rings);
			const sigma = 2 * STEEL * Math.sqrt(R * R - s * s);
			let ring = 0;
			for (let j = 0; j < angles; j++) {
				const phi = (2 * Math.PI * (j + 0.5)) / angles;
				ring += 1 / (b * b - 2 * b * s * Math.cos(phi) + s * s);
			}
			F += sigma * (ring / angles) * 2 * Math.PI * s * ds;
		}
		return ((C * C) / 2) * F;
	}

	it('is equation pass, integrated in full', () => {
		for (const b of [0.6, 1, PAPER_PASS, 2.5, 4])
			relative(ballEnergy(C, b).total, quadrature(b), 1e-5);
	});

	it('is the sum of the paper’s thin shells', () => {
		// the ball as thin shells of mass 3M r²/R³ dr, each by lib/hair/passing.ts in units M = R = 1
		for (const b of [0.6, PAPER_PASS, 3]) {
			const F = simpson((r) => 3 * r * r * shellF({ mass: 1, radius: r }, b / R), 0, 1, 2000);
			relative(ballEnergy(C, b).total, ((C * C) / 2) * (M / (R * R)) * F, 1e-9);
		}
	});

	it('has the recoil MC²/2b², and the paper’s series for the rest', () => {
		for (const b of [1, PAPER_PASS, 4]) {
			const { total, recoil, inside } = ballEnergy(C, b);
			relative(recoil, (M * C * C) / (2 * b * b), 1e-15);
			relative(total, recoil + inside, 1e-15);
			// M/b² + (2/3)∫ρr²/b⁴ + (8/15)∫ρr⁴/b⁶ + (16/35)∫ρr⁶/b⁸ + …, ∫ρr^(2p) dV = 3MR^(2p)/(2p + 3)
			let series = 0;
			let c = 1;
			for (let p = 0; p < 80; p++) {
				if (p > 0) c *= (2 * p) / (2 * p + 1);
				series += (c * 3 * M * R ** (2 * p)) / (2 * p + 3) / b ** (2 * p + 2);
			}
			relative(total, ((C * C) / 2) * series, 1e-12);
			// the first internal term, (2/5) MR²/b⁴, is most of the inside far away
			const first = (((C * C) / 2) * ((2 / 5) * M * R * R)) / b ** 4;
			expect(inside).toBeGreaterThan(first);
			if (b === 4) relative(inside, first, 0.03);
		}
	});
});

describe('the chapter’s numbers', () => {
	const C = strength(TONNE, PAPER_SPEED);

	it('the ball: 4110 kg', () => {
		relative(BALL, 4110, 1e-3);
	});

	it('the tonne at 44 km/s: C = 3.03 × 10⁻¹² m²/s, an edge kick of 3.0 × 10⁻¹² m/s at 1 m', () => {
		relative(C, 3.03e-12, 2e-3);
		relative(kick(TONNE, 1, PAPER_SPEED), 3.0e-12, 0.02);
		relative(peak(TONNE, 1), 6.7e-8, 0.01);
		// the pass lasts 2B/V: 45.5 μs at the near edge, B = 1 m, and 91 μs at the far side, B = b + R = 2 m
		relative(passDuration(PAPER_PASS - RADIUS, PAPER_SPEED), 45.5e-6, 1e-3);
		relative(passDuration(PAPER_PASS + RADIUS, PAPER_SPEED), 91e-6, 2e-3);
		// a seventh to a quarter of the ball's slowest ringing period, 330 μs
		relative(passDuration(PAPER_PASS - RADIUS, PAPER_SPEED) / RINGING, 1 / 7, 0.05);
		relative(passDuration(PAPER_PASS + RADIUS, PAPER_SPEED) / RINGING, 1 / 4, 0.12);
		// the figure's frozen-ball check, on the longest pass: under a third of a period, so it shows green
		expect(passDuration(PAPER_PASS + RADIUS, PAPER_SPEED) / RINGING).toBeLessThan(FROZEN);
	});

	it('the pass at 1.5 m: 8.8 × 10⁻²¹ J, of which 8.4 recoil and 0.40 inside', () => {
		const { total, recoil, inside } = ballEnergy(C, PAPER_PASS);
		relative(total, 8.8e-21, 0.01);
		relative(recoil, 8.4e-21, 0.01);
		relative(inside, 4.0e-22, 0.01);
		relative(recoil / total, 0.95, 0.01);
	});

	it('the tonne slows by 4.5 × 10⁻³³ of its speed, the inside’s share 2.1 × 10⁻³⁴', () => {
		const { total, inside } = ballEnergy(C, PAPER_PASS);
		relative(slowing(total, TONNE, PAPER_SPEED), 4.5e-33, 0.02);
		relative(slowing(inside, TONNE, PAPER_SPEED), 2.1e-34, 0.03);
	});

	it('the ball bends the tonne’s path by 1.9 × 10⁻¹⁶ rad', () => {
		relative(deflection(BALL, PAPER_PASS, PAPER_SPEED), 1.9e-16, 0.01);
	});

	it('the Sun at 1 AU and 30 km/s would “kick” by 59 km/s', () => {
		relative(kick(1.989e30, 1.496e11, 30e3), 59e3, 0.01);
	});
});

describe('the parts and the axes', () => {
	it('draws thirteen parts within the ball, five in the row through the centre', () => {
		expect(PARTS).toHaveLength(13);
		for (const [x, z] of PARTS) expect(Math.hypot(x, z)).toBeLessThanOrEqual(RADIUS + 1e-12);
		expect(PARTS.filter(([x]) => x === 0)).toHaveLength(5);
	});

	it('steps an axis by 1, 2 or 5 times a power of ten', () => {
		expect(tickStep(100, 5)).toBe(20);
		expect(tickStep(70, 5)).toBe(10);
		expect(tickStep(3e-5, 4)).toBeCloseTo(1e-5, 18);
		expect(tickStep(400, 4)).toBe(100);
	});
});

/** asinh(x / B): the u of t = (B/V) sinh u at which V t = x. */
function asinhOf(x: number, B: number) {
	return Math.asinh(x / B);
}
