/**
 * A ring of marked particles in an exact plane wave: the marks turn against a gyroscope by half the hyperbolic area
 * that the ring's shape sweeps, and the ring shrinks to a focus. The numbers are those of
 * design/checks/ring_memory.py.
 */
import { describe, expect, it } from 'vitest';
import {
	H,
	areaAngle,
	atFocus,
	focusTime,
	fromShapePath,
	integrate,
	polar,
	polarAlong,
	profile,
	radiusRate,
	weakAngle,
	weakShrink,
	type Mat2,
	type Run,
	type ShapePath,
	type Wave
} from './ring';

const DEG = 180 / Math.PI;
const det = (M: Mat2) => M[0] * M[3] - M[1] * M[2];

/** The ring's parts when the wave has just passed. */
function atEnd(run: Run) {
	const p = polarAlong(run);
	return {
		theta: p.theta[run.end],
		rho: p.rho[run.end],
		drho: radiusRate(run.X[run.end], run.dX[run.end])
	};
}

/** The reference example: the shape goes out to r = 0.60 and back while psi makes one turn, either way. */
const petal =
	(sign: 1 | -1): ShapePath =>
	(u) => {
		const s = Math.sin(Math.PI * u);
		const c = Math.cos(Math.PI * u);
		return [
			0.6 * s ** 4,
			0.6 * 4 * Math.PI * s ** 3 * c,
			sign * 2 * Math.PI * u,
			sign * 2 * Math.PI
		];
	};

describe('a ring of marked particles in a plane wave', () => {
	const waves: Wave[] = [
		{ hand: 1, turns: 1, epsilon: 0.05 },
		{ hand: -1, turns: 2, epsilon: 0.08 },
		{ hand: 1, turns: 2, epsilon: 0.03 }
	];

	it('the wave is a vacuum wave: H is symmetric and trace-free, and its strain has the stated derivatives', () => {
		const d = 1e-6;
		for (const wave of waves) {
			for (let k = 0; k <= 40; k++) {
				const u = k / 40;
				const M = H(u, wave);
				expect(M[1]).toBe(M[2]);
				expect(M[0] + M[3]).toBe(0);
			}
			for (const u of [0.11, 0.37, 0.5, 0.83]) {
				const p = profile(u, wave);
				const before = profile(u - d, wave);
				const after = profile(u + d, wave);
				expect(Math.abs(p.a1 - (after.a - before.a) / (2 * d))).toBeLessThan(1e-7);
				expect(Math.abs(p.b1 - (after.b - before.b) / (2 * d))).toBeLessThan(1e-7);
				expect(Math.abs(p.a2 - (after.a1 - before.a1) / (2 * d))).toBeLessThan(1e-6);
				expect(Math.abs(p.b2 - (after.b1 - before.b1) / (2 * d))).toBeLessThan(1e-6);
				expect(Math.abs(H(u, wave)[0] - wave.epsilon * p.a2)).toBe(0);
			}
			// the strain and its slope vanish at both ends, and there is no wave outside them
			for (const u of [-0.2, 0, 1, 1.3]) {
				expect(Object.values(profile(u, wave)).every((x) => x === 0)).toBe(true);
			}
		}
	});

	it('the turn of the marks is half the hyperbolic area swept by the shape', () => {
		for (const wave of waves) {
			const run = integrate(wave);
			const p = polarAlong(run);
			const theta = p.theta[run.end];
			expect(run.u[run.end]).toBe(1);
			expect(Math.abs(theta)).toBeGreaterThan(1e-3);
			// by the trapezoid rule on (1/2)(cosh r - 1) dpsi
			expect(Math.abs(theta - areaAngle(run))).toBeLessThan(1e-6);
			// and by triangles, at every moment of the wave
			for (let i = 0; i < p.count; i += 25) {
				expect(Math.abs(p.theta[i] - p.swept[i])).toBeLessThan(1e-8);
			}
		}
	});

	it('the mirror image of a wave turns the marks the other way, and a linear wave not at all', () => {
		for (const { turns, epsilon } of waves) {
			const right = atEnd(integrate({ hand: 1, turns, epsilon }));
			const left = atEnd(integrate({ hand: -1, turns, epsilon }));
			expect(right.theta).toBeGreaterThan(0);
			expect(Math.abs(right.theta + left.theta)).toBeLessThan(1e-12);
			expect(Math.abs(right.rho - left.rho)).toBeLessThan(1e-12);

			const run = integrate({ hand: 0, turns, epsilon }, 1.6);
			const p = polarAlong(run);
			expect(p.count).toBe(run.u.length);
			expect(Math.max(...p.theta.map(Math.abs))).toBeLessThan(1e-12);
			// its shape runs along one line through the round shape, and sweeps nothing
			expect(Math.max(...p.swept.map(Math.abs))).toBeLessThan(1e-12);
			expect(Math.max(...p.r)).toBeGreaterThan(epsilon);
		}
	});

	it('a weak wave turns the marks by ε² ∮ (a db − b da), and leaves the ring shrinking at −ε² ∫ (a′² + b′²) du', () => {
		for (const turns of [1, 2]) {
			const off = [0.01, 0.02].map((epsilon) => {
				const wave: Wave = { hand: 1, turns, epsilon };
				const end = atEnd(integrate(wave));
				return {
					theta: end.theta / weakAngle(wave) - 1,
					drho: end.drho / weakShrink(wave) - 1
				};
			});
			// within one per cent at 0.01, and four times closer than at 0.02: the next term is of fourth order
			expect(Math.abs(off[0].theta)).toBeLessThan(0.01);
			expect(Math.abs(off[0].drho)).toBeLessThan(0.01);
			expect(off[1].theta / off[0].theta).toBeGreaterThan(3.5);
			expect(off[1].theta / off[0].theta).toBeLessThan(4.5);
			expect(off[1].drho / off[0].drho).toBeGreaterThan(3.5);
			expect(off[1].drho / off[0].drho).toBeLessThan(4.5);
		}
		// the two integrals in closed form, for a circular burst: env = sin^4 has ∫ env^2 = 35/128, ∫ env'^2 = 5 pi^2/8
		for (const turns of [1, 2, 3]) {
			const wave: Wave = { hand: -1, turns, epsilon: 0.05 };
			const omega = 2 * Math.PI * turns;
			expect(weakAngle(wave)).toBeCloseTo((-(0.05 ** 2) * omega * 35) / 128, 14);
			expect(weakShrink(wave)).toBeCloseTo(
				-(0.05 ** 2) * ((5 * Math.PI ** 2) / 8 + (omega ** 2 * 35) / 128),
				13
			);
		}
		expect(weakAngle({ hand: 0, turns: 2, epsilon: 0.05 })).toBe(0);
	});

	it('the reference example: 9.0521 degrees either way, radius 0.2691, and a focus 0.1903 T after the wave', () => {
		for (const sign of [1, -1] as const) {
			const wave = fromShapePath(petal(sign));
			// the wave built from the shape is a vacuum wave, which nothing in its construction forces
			for (let k = 1; k < 20; k++) {
				const M = wave.H(k / 20);
				expect(Math.abs(M[1] - M[2])).toBeLessThan(1e-9);
				expect(Math.abs(M[0] + M[3])).toBeLessThan(1e-8);
			}
			expect(Math.max(...wave.H(0.5).map(Math.abs))).toBeGreaterThan(1);

			// integrated forwards on its own, it gives back what the two laws said
			const run = integrate(wave);
			const end = atEnd(run);
			expect(Math.abs(end.theta * DEG - sign * 9.0521)).toBeLessThan(1e-3);
			expect(Math.abs(end.rho - 0.2691)).toBeLessThan(1e-4);
			expect(Math.abs(end.theta - wave.theta)).toBeLessThan(1e-8);
			expect(Math.abs(end.rho - wave.rho)).toBeLessThan(1e-8);
			expect(Math.abs(end.drho - wave.drho)).toBeLessThan(1e-7);
			expect(Math.abs(areaAngle(run) - end.theta)).toBeLessThan(1e-6);

			const focus = focusTime(run);
			expect(focus).not.toBeNull();
			expect(Math.abs((focus as number) - 1 - 0.1903)).toBeLessThan(1e-4);
			// the ring is round again and shrinking without shear, so the focus is at rho / -rho'
			expect(Math.abs((focus as number) - 1 + end.rho / end.drho)).toBeLessThan(1e-7);
		}
	});

	it('the ring’s radius obeys ρ″ = −¼ (r′² + sinh² r ψ′²) ρ at every moment of the wave', () => {
		for (const wave of waves) {
			const run = integrate(wave);
			const p = polarAlong(run);
			const h = run.h;
			let worst = 0;
			let largest = 0;
			for (let i = 2; i < run.end - 1; i++) {
				// at the round shape psi has no value, and its difference means nothing
				if (p.r[i] < 1e-3) continue;
				const second = (p.rho[i + 1] - 2 * p.rho[i] + p.rho[i - 1]) / (h * h);
				const dr = (p.r[i + 1] - p.r[i - 1]) / (2 * h);
				const dpsi = (p.psi[i + 1] - p.psi[i - 1]) / (2 * h);
				const law = -0.25 * (dr * dr + Math.sinh(p.r[i]) ** 2 * dpsi * dpsi) * p.rho[i];
				worst = Math.max(worst, Math.abs(second - law));
				largest = Math.max(largest, Math.abs(law));
			}
			// by differences over one step, which are good to about h^2
			expect(largest).toBeGreaterThan(0.05);
			expect(worst).toBeLessThan(1e-5);
		}
	});

	it('the ring never grows, and is left shrinking', () => {
		for (const wave of [...waves, { hand: 0, turns: 3, epsilon: 0.08 } as Wave]) {
			const run = integrate(wave, 1.6);
			const { rho, count } = polarAlong(run);
			expect(count).toBe(run.u.length);
			expect(rho[0]).toBe(1);
			// up to rounding in the last place: rho <= 1 throughout, and it never rises
			let largest = 0;
			let rise = -Infinity;
			for (let i = 1; i < count; i++) {
				largest = Math.max(largest, rho[i]);
				rise = Math.max(rise, rho[i] - rho[i - 1]);
			}
			expect(largest).toBeLessThanOrEqual(1 + 1e-14);
			expect(rise).toBeLessThan(1e-14);
			expect(rho[count - 1]).toBeLessThan(0.99);
			expect(atEnd(run).drho).toBeLessThan(0);
		}
	});

	it('after the wave every particle moves uniformly, and the focus is where det X first vanishes', () => {
		for (const wave of [
			{ hand: 1, turns: 1, epsilon: 0.25 },
			{ hand: -1, turns: 3, epsilon: 0.08 },
			{ hand: 0, turns: 2, epsilon: 0.2 }
		] as Wave[]) {
			const run = integrate(wave, 2.2);
			const last = run.u.length - 1;
			const XT = run.X[run.end];
			const VT = run.dX[run.end];
			for (let j = 0; j < 4; j++) {
				expect(run.X[last][j]).toBeCloseTo(XT[j] + (run.u[last] - 1) * VT[j], 12);
				expect(run.dX[last][j]).toBe(VT[j]);
			}

			// a direct search: the first sample after the wave at which det X is no longer positive, then bisection
			const { count } = polarAlong(run);
			expect(count).toBeGreaterThan(run.end);
			expect(count).toBeLessThan(run.u.length);
			const between = (t: number) => XT.map((x, j) => x + t * VT[j]) as Mat2;
			let lo = run.u[count - 1] - 1;
			let hi = run.u[count] - 1;
			expect(det(between(lo))).toBeGreaterThan(0);
			expect(det(between(hi))).toBeLessThanOrEqual(0);
			for (let k = 0; k < 60; k++) {
				const mid = (lo + hi) / 2;
				if (det(between(mid)) > 0) lo = mid;
				else hi = mid;
			}
			expect(focusTime(run)).toBeCloseTo(1 + lo, 9);
			// polar has no radius or shape to give there
			expect(polar(run.X[count]).rho).toBeNaN();
		}
	});

	it('at its focus the ring is drawn out into a segment, and the turn of its marks there is still half the area swept', () => {
		for (const wave of [
			{ hand: 1, turns: 1, epsilon: 0.25 },
			{ hand: -1, turns: 2, epsilon: 0.17 },
			{ hand: 1, turns: 3, epsilon: 0.125 }
		] as Wave[]) {
			const run = integrate(wave, 1.6);
			const parts = polarAlong(run);
			const last = parts.count - 1;
			const focus = atFocus(run, parts);
			expect(focus).not.toBeNull();
			if (!focus) continue;
			// it comes after the wave, within a step of the last sample at which the ring still has a radius
			expect(focus.u).toBe(focusTime(run));
			expect(last).toBeGreaterThan(run.end);
			expect(focus.u - run.u[last]).toBeGreaterThan(0);
			expect(focus.u - run.u[last]).toBeLessThan(run.h * (1 + 1e-9));
			// X has no area there, but it is not zero: the particles lie in a row
			expect(Math.abs(det(focus.X))).toBeLessThan(1e-12);
			expect(Math.hypot(...focus.X)).toBeGreaterThan(0.05);
			// the first law, all the way to the edge of the hyperbolic plane
			expect(Math.abs(focus.theta - focus.swept)).toBeLessThan(1e-9);
			// the marks have gone on turning the same way since the wave passed, and nothing jumps at the last step
			expect(Math.sign(focus.theta)).toBe(wave.hand);
			expect(Math.abs(focus.theta)).toBeGreaterThan(Math.abs(parts.theta[run.end]) + 0.01);
			expect(Math.abs(focus.theta - parts.theta[last])).toBeLessThan(1e-3);
			expect(Math.abs(focus.psi - parts.psi[last])).toBeLessThan(1e-2);
			// a run of four times as many steps comes to the same focus
			const fine = atFocus(integrate(wave, 1.6, 8000));
			expect(fine).not.toBeNull();
			if (!fine) continue;
			expect(Math.abs(focus.u - fine.u)).toBeLessThan(1e-9);
			expect(Math.abs(focus.theta - fine.theta)).toBeLessThan(1e-9);
			expect(Math.abs(focus.swept - fine.swept)).toBeLessThan(1e-9);
		}

		// the wave the figure opens with, in the figures its page prints
		const run = integrate({ hand: 1, turns: 1, epsilon: 0.25 }, 1.6);
		const parts = polarAlong(run);
		const focus = atFocus(run, parts);
		expect((parts.theta[run.end] * DEG).toFixed(4)).toBe('9.4530');
		expect((weakAngle({ hand: 1, turns: 1, epsilon: 0.25 }) * DEG).toFixed(4)).toBe('6.1523');
		expect(parts.rho[run.end].toFixed(4)).toBe('0.4510');
		expect(focus && (focus.u - 1).toFixed(4)).toBe('0.2655');
		expect(focus && (focus.theta * DEG).toFixed(4)).toBe('14.1108');

		// a ring that shrinks to a point without shear (the reference example) keeps the turn it had when the wave passed
		const round = integrate(fromShapePath(petal(1)), 1.3);
		const before = polarAlong(round);
		const point = atFocus(round, before);
		expect(point).not.toBeNull();
		if (point) {
			expect(Math.hypot(...point.X)).toBeLessThan(1e-8);
			expect(Math.abs(point.theta - before.theta[round.end])).toBeLessThan(1e-8);
			expect(Math.abs(point.swept - point.theta)).toBeLessThan(1e-8);
		}

		// nothing to report if the focus comes after the run's end
		expect(atFocus(integrate({ hand: 1, turns: 1, epsilon: 0.25 }, 1.2))).toBeNull();
		expect(atFocus(integrate({ hand: 1, turns: 1, epsilon: 0.1 }, 1.6))).toBeNull();
		// or if the ring has been through a focus before the wave has passed: the one after the wave is then its second
		const early = integrate({ hand: 1, turns: 2, epsilon: 0.2 }, 1.6);
		expect(polarAlong(early).count).toBeLessThanOrEqual(early.end);
		expect(focusTime(early)).toBeGreaterThan(1);
		expect(focusTime(early)).toBeLessThan(1.6);
		expect(atFocus(early)).toBeNull();
	});

	it('there is no focus to report without a wave, or before the wave has passed', () => {
		expect(focusTime(integrate({ hand: 1, turns: 1, epsilon: 0 }, 1.6))).toBeNull();
		const part = integrate(waves[0], 0.5);
		expect(part.end).toBe(-1);
		expect(part.u[part.u.length - 1]).toBeCloseTo(0.5, 12);
		expect(focusTime(part)).toBeNull();
	});

	it('two thousand steps through the wave are ample', () => {
		for (const wave of [...waves, { hand: 1, turns: 3, epsilon: 0.08 } as Wave]) {
			const fine = atEnd(integrate(wave));
			const coarse = atEnd(integrate(wave, 1, 1000));
			expect(Math.abs(fine.theta - coarse.theta)).toBeLessThan(1e-9);
			expect(Math.abs(fine.rho - coarse.rho)).toBeLessThan(1e-9);
		}
	});
});
