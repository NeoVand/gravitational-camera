/** A mass that passes: the energy one pass leaves in two bodies that have the same field outside. */
import { describe, expect, it } from 'vitest';
import {
	PAPER_PASS,
	TWINS,
	bodyF,
	farDifference,
	internalF,
	kick,
	mass,
	quadratureF,
	relativeKick,
	seriesCoefficient,
	seriesF,
	steelBall
} from './passing';

describe('the two bodies', () => {
	it('have the same mass and the same M <r^2>', () => {
		expect(mass(TWINS.a)).toBe(1);
		expect(mass(TWINS.b)).toBe(1);
		const second = (shells: { mass: number; radius: number }[]) =>
			shells.reduce((s, x) => s + x.mass * x.radius ** 2, 0);
		expect(second(TWINS.a.shells)).toBeCloseTo(second(TWINS.b.shells), 14);
	});
});

describe('the energy of a pass', () => {
	it('is the closed form, the series and a quadrature of the impulses alike', () => {
		for (const b of [1.1, 1.5, 2, 3.3]) {
			for (const body of [TWINS.a, TWINS.b]) {
				expect(seriesF(body, b, 400)).toBeCloseTo(bodyF(body, b), 10);
				expect(quadratureF(body, b, 300, 300)).toBeCloseTo(bodyF(body, b), 4);
			}
		}
	});

	it('has the series coefficients 1, 2/3, 8/15, 16/35', () => {
		expect([0, 1, 2, 3].map(seriesCoefficient)).toEqual(
			[1, 2 / 3, 8 / 15, 16 / 35].map((c) => expect.closeTo(c, 15))
		);
	});

	it('leaves 0.080 and 0.104 M C^2 / 2 R^2 inside the two at b = 1.5 R, a 30% difference', () => {
		const a = internalF(TWINS.a, PAPER_PASS);
		const b = internalF(TWINS.b, PAPER_PASS);
		expect(a.toFixed(3)).toBe('0.080');
		expect(b.toFixed(3)).toBe('0.104');
		expect(Math.round(100 * (b / a - 1))).toBe(30);
		// the reference implementation's values (results/figures/passing.json)
		expect(a).toBeCloseTo(0.08033121248714925, 13);
		expect(b).toBeCloseTo(0.1041219066547967, 13);
	});

	it('differs far away by M C^2 R^4 / 15 b^6, which is (2/15)(R/b)^6 in these units', () => {
		for (const b of [20, 40, 80]) {
			const difference = internalF(TWINS.b, b) - internalF(TWINS.a, b);
			expect(difference / farDifference(b)).toBeCloseTo(1, 2);
		}
		// and both go as (1/3)(R/b)^4, the part the quadrupole reads alike
		expect(internalF(TWINS.a, 80) * 80 ** 4).toBeCloseTo(1 / 3, 3);
	});

	it('gives the centre no kick of its own, and every part the kick (b - s)/|b - s|^2', () => {
		expect(relativeKick([0, 0], [1.5, 0])).toEqual([0, 0]);
		const [vx, vy] = kick([0.3, -0.4], [1.5, 0.2]);
		const dx = 1.2,
			dy = 0.6;
		expect(vx).toBeCloseTo(dx / (dx * dx + dy * dy), 15);
		expect(vy).toBeCloseTo(dy / (dx * dx + dy * dy), 15);
	});
});

describe('the paper’s example', () => {
	it('a tonne at 44 km/s, a metre from the edge of a steel ball a metre across: 3e-12 m/s, 5 parts in 10^33', () => {
		const pass = steelBall(1.5);
		expect(pass.edgeKick.toExponential(0)).toBe('3e-12');
		expect(pass.totalLoss.toExponential(0)).toBe('5e-33');
		// of which the part left inside the ball, the part that depends on its inside, is some 2 parts in 10^34
		expect(pass.internalLoss.toExponential(0)).toBe('2e-34');
	});
});
