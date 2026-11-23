/** Chapter 4.5's sum rule, against closed forms, a brute-force sum and the chapter's numbers. */
import { describe, expect, it } from 'vitest';
import {
	AXIS_TOPS,
	FAR,
	MIN_SHARE,
	OMEGA_RANGE,
	OPENING,
	PLOT_MOST,
	QUALITIES,
	Q_RANGE,
	TOTAL,
	addLine,
	area,
	axisFor,
	boundary,
	chi,
	doublable,
	doubled,
	farAnswer,
	heightTo,
	keepGamma,
	lineArea,
	lineHeight,
	modes,
	moveBoundary,
	moveTo,
	power,
	powerLine,
	quality,
	shareShown,
	staticCompliance,
	staticSum,
	stepQuality,
	sumRule,
	tallest,
	type Line,
	type Mode
} from './sum-rule';

const three = (x: number) => x.toPrecision(3);
const FREQUENCIES = [0.3, 0.5, 1, 1.7, 2.5, 3.2, 3.5];
const QS = [1, 1.5, 3, 10, 30, 100];

/** A brute-force integral of the line of power by the trapezium rule on a very fine grid, out to ω = `most`. */
function brute(m: Mode, most: number, n = 2_000_000) {
	const h = most / n;
	let s = 0;
	for (let i = 1; i < n; i++) s += powerLine(i * h, m);
	return (s + powerLine(most, m) / 2) * h;
}

describe('the bodies', () => {
	it('the ball holds (2/5)MR² = 0.132 kg m² and the shell (2/3)MR² = 0.219 kg m², as 3 : 5', () => {
		expect(three(TOTAL.ball)).toBe('0.132');
		expect(three(TOTAL.shell)).toBe('0.219');
		expect(TOTAL.shell / TOTAL.ball).toBeCloseTo(5 / 3, 14);
	});

	it('the switch multiplies every weight by 5/3', () => {
		const lines = addLine(addLine(OPENING.lines));
		const ball = modes(lines, 'ball');
		const shell = modes(lines, 'shell');
		ball.forEach((m, i) => expect(shell[i].weight / m.weight).toBeCloseTo(5 / 3, 14));
		expect(sumRule(shell) / sumRule(ball)).toBeCloseTo(5 / 3, 9);
	});
});

describe('one line', () => {
	it('is largest at its own frequency, c²/Γ high', () => {
		for (const w of FREQUENCIES)
			for (const Q of QS) {
				const m = { omega: w, Gamma: w / Q, weight: 0.1 };
				expect(powerLine(w, m)).toBeCloseTo(lineHeight(m), 12);
				for (const d of [0.999, 1.001, 0.9, 1.1])
					expect(powerLine(w * d, m)).toBeLessThan(lineHeight(m));
			}
	});

	it('is ω Im χ of the complex response', () => {
		const ms = modes(addLine(addLine(OPENING.lines)), 'ball');
		for (const w of [0.2, 1, 2.3, 3.9, 12]) expect(w * chi(w, ms).im).toBeCloseTo(power(w, ms), 12);
	});

	it('has the area (π/2)c² from 0 to ∞, by quadrature, for Q from 1 to 100 across the range', () => {
		for (const w of FREQUENCIES)
			for (const Q of QS) {
				const m = { omega: w, Gamma: w / Q, weight: 0.0731 };
				const a = lineArea(m);
				expect(Math.abs(a / ((Math.PI / 2) * m.weight) - 1)).toBeLessThan(1e-9);
				expect(three((2 / Math.PI) * a)).toBe(three(m.weight));
			}
	});

	it('has the same area from 0 to 4ω₀ as a brute-force sum, the tail included or not', () => {
		for (const m of [
			{ omega: 3.5, Gamma: 3.5, weight: 1 },
			{ omega: 1, Gamma: 0.1, weight: 1 },
			{ omega: 0.3, Gamma: 0.003, weight: 1 }
		])
			expect(lineArea(m, PLOT_MOST)).toBeCloseTo(brute(m, PLOT_MOST), 6);
	});

	it('runs well past the plot when broad and high: at 3.5ω₀ and Q = 1, over a third of its area lies beyond 4ω₀', () => {
		const m = { omega: 3.5, Gamma: 3.5, weight: TOTAL.ball };
		const shown = shareShown([m]);
		expect(shown).toBeLessThan(0.65);
		// the tail beyond 4ω₀, ∫ c²Γ/ω² dω ≈ c²Γ/4ω₀ at large ω, is the right size
		expect(1 - shown).toBeGreaterThan(0.35);
		// and the area to ∞ is still the whole weight
		expect(three(sumRule([m]))).toBe(three(TOTAL.ball));
	});
});

describe('the sum rule', () => {
	it('the area times 2/π is Σc² to three figures, for Q from 1 to 100 and lines across the range', () => {
		for (const body of ['ball', 'shell'] as const)
			for (const Q1 of QS)
				for (const Q2 of [1, 7, 100])
					for (const [w1, w2, w3] of [
						[0.3, 1, 3.5],
						[1, 1.05, 1.1],
						[3.5, 3.4, 3.3],
						[0.5, 2, 3]
					]) {
						const lines: Line[] = [
							{ id: 1, omega: w1, Gamma: w1 / Q1, share: 0.5 },
							{ id: 2, omega: w2, Gamma: w2 / Q2, share: 0.3 },
							{ id: 3, omega: w3, Gamma: w3 / 10, share: 0.2 }
						];
						const ms = modes(lines, body);
						const total = ms.reduce((s, m) => s + m.weight, 0);
						expect(total).toBeCloseTo(TOTAL[body], 14);
						expect(three(sumRule(ms))).toBe(three(total));
						expect(Math.abs(sumRule(ms) / total - 1)).toBeLessThan(1e-9);
					}
	});

	it('counts the whole integral to ∞, not the plot: for broad high lines the plot alone falls short', () => {
		const ms = modes([{ id: 1, omega: 3.5, Gamma: 3.5, share: 1 }], 'ball');
		expect((2 / Math.PI) * area(ms, PLOT_MOST)).toBeLessThan(0.7 * TOTAL.ball);
		expect(three(sumRule(ms))).toBe('0.132');
	});
});

describe('the static compliance', () => {
	it('is Σc²/ω_n², and the slow end’s sum by quadrature agrees', () => {
		for (const w of FREQUENCIES)
			for (const Q of QS) {
				const ms = [{ omega: w, Gamma: w / Q, weight: 0.2 }];
				expect(staticSum(ms) / staticCompliance(ms)).toBeCloseTo(1, 9);
			}
	});

	it('scales as 1/ω_n²: twice the frequency, a quarter of the compliance; the area stays', () => {
		for (const w of [0.3, 0.6, 1, 1.75])
			for (const Q of QS) {
				const a = [{ omega: w, Gamma: w / Q, weight: 0.13 }];
				const b = [{ omega: 2 * w, Gamma: w / Q, weight: 0.13 }];
				expect(staticCompliance(b) / staticCompliance(a)).toBeCloseTo(0.25, 14);
				expect(staticSum(b) / staticSum(a)).toBeCloseTo(0.25, 8);
				expect(sumRule(b) / sumRule(a)).toBeCloseTo(1, 9);
			}
	});

	it('does not depend on the width', () => {
		const a = staticSum([{ omega: 1, Gamma: 1, weight: 0.13 }]);
		const b = staticSum([{ omega: 1, Gamma: 0.01, weight: 0.13 }]);
		expect(a / b).toBeCloseTo(1, 8);
	});

	it('opens at 0.132 kg m² per ω₀², and is 0.0329 once the line is at 2ω₀', () => {
		const ms = modes(OPENING.lines, 'ball');
		expect(three(staticCompliance(ms))).toBe('0.132');
		expect(three(staticCompliance(modes([moveTo(OPENING.lines[0], 2)], 'ball')))).toBe('0.0329');
	});
});

describe('far above every line', () => {
	it('−ω²χ at 40ω₀, real part and modulus, is within 1% of A, for every setting', () => {
		expect(FAR).toBeGreaterThan(10 * OMEGA_RANGE.high);
		for (const body of ['ball', 'shell'] as const)
			for (const w of FREQUENCIES)
				for (const Q of QS) {
					const lines: Line[] = [
						{ id: 1, omega: w, Gamma: w / Q, share: 0.6 },
						{ id: 2, omega: OMEGA_RANGE.high, Gamma: OMEGA_RANGE.high / Q, share: 0.4 }
					];
					const far = farAnswer(modes(lines, body));
					expect(Math.abs(far.re / TOTAL[body] - 1)).toBeLessThan(0.01);
					expect(Math.abs(far.abs / TOTAL[body] - 1)).toBeLessThan(0.01);
				}
	});

	it('is worst for a narrow line at 3.5ω₀, 0.77% high, the factor 1/(1 − ω_n²/ω²)', () => {
		const far = farAnswer([{ omega: 3.5, Gamma: 0.035, weight: 1 }]);
		expect(far.re).toBeCloseTo(1 / (1 - 3.5 ** 2 / FAR ** 2), 4);
		expect((100 * (far.re - 1)).toFixed(2)).toBe('0.77');
	});
});

describe('setting the lines', () => {
	it('opens with one line at ω₀, Q = 10, holding all the weight', () => {
		expect(OPENING.lines).toHaveLength(1);
		expect(quality(OPENING.lines[0])).toBeCloseTo(10, 12);
		expect(OPENING.lines[0].share).toBe(1);
	});

	it('moving a line keeps its width, unless Q would leave 1 to 100', () => {
		const l = OPENING.lines[0];
		expect(moveTo(l, 2).Gamma).toBe(l.Gamma);
		expect(moveTo(l, 2).omega).toBe(2);
		expect(moveTo(l, 9).omega).toBe(OMEGA_RANGE.high);
		expect(moveTo(l, 0).omega).toBe(OMEGA_RANGE.low);
		const narrow = { ...l, Gamma: 0.011 };
		expect(quality(moveTo(narrow, 3.5))).toBeCloseTo(Q_RANGE.high, 9);
		expect(keepGamma(1, 5)).toBe(1);
	});

	it('a height sets Γ = c²/y, kept to Q from 1 to 100', () => {
		const l = OPENING.lines[0];
		const y = 2 * lineHeight(modes([l], 'ball')[0]);
		const h = heightTo(l, y, 'ball');
		expect(h.Gamma).toBeCloseTo(l.Gamma / 2, 12);
		expect(quality(heightTo(l, 1e6, 'ball'))).toBeCloseTo(100, 9);
		expect(quality(heightTo(l, -1, 'ball'))).toBeCloseTo(1, 9);
	});

	it('the keys step Q along the ladder', () => {
		let l = OPENING.lines[0];
		l = stepQuality(l, 1);
		expect(quality(l)).toBeCloseTo(12, 9);
		l = stepQuality(l, -2);
		expect(quality(l)).toBeCloseTo(8, 9);
		for (let i = 0; i < 40; i++) l = stepQuality(l, -1);
		expect(quality(l)).toBeCloseTo(QUALITIES[0], 9);
		for (let i = 0; i < 40; i++) l = stepQuality(l, 3);
		expect(quality(l)).toBeCloseTo(QUALITIES[QUALITIES.length - 1], 9);
	});

	it('adding lines shares the weight and keeps its sum; at most three', () => {
		const two = addLine(OPENING.lines);
		expect(two.map((l) => l.share)).toEqual([0.5, 0.5]);
		expect(two[1].omega).toBe(1.6);
		const three_ = addLine(two);
		expect(three_.reduce((s, l) => s + l.share, 0)).toBeCloseTo(1, 14);
		expect(three_[2].omega).toBe(0.5);
		expect(doublable(new Map(three_.map((l) => [l.id, l.omega])))).toBe(true);
		expect(addLine(three_)).toHaveLength(3);
		expect(new Set(three_.map((l) => l.id)).size).toBe(3);
	});

	it('moving a boundary changes two shares only, keeps the sum and the least share', () => {
		const lines = addLine(addLine(OPENING.lines));
		const moved = moveBoundary(lines, 0, 0.1);
		expect(moved[0].share).toBeCloseTo(0.1, 14);
		expect(moved[1].share).toBeCloseTo(2 / 3 - 0.1, 14);
		expect(moved[2].share).toBe(lines[2].share);
		expect(moveBoundary(lines, 1, 2)[2].share).toBeCloseTo(MIN_SHARE, 14);
		expect(moveBoundary(lines, 0, -1)[0].share).toBeCloseTo(MIN_SHARE, 14);
		expect(boundary(moved, 0)).toBeCloseTo(0.1, 14);
		expect(boundary(moved, 2)).toBeCloseTo(1, 14);
	});
});

describe('the drawing', () => {
	it('the axis leaves the shell a tenth of room, and opens at 3 kg m² per ω₀', () => {
		expect(axisFor(OPENING.lines).top).toBe(3);
		for (const Q of [1, 10, 100])
			for (const w of [0.3, 1, 3.5]) {
				const lines = [{ id: 1, omega: w, Gamma: w / Q, share: 1 }];
				const a = axisFor(lines);
				expect(tallest(modes(lines, 'shell'))).toBeLessThanOrEqual(0.92 * a.top);
			}
		for (let i = 1; i < AXIS_TOPS.length; i++)
			expect(AXIS_TOPS[i].top).toBeGreaterThan(AXIS_TOPS[i - 1].top);
	});

	it('the tallest point is found at a line’s peak', () => {
		const ms = modes([{ id: 1, omega: 0.3, Gamma: 0.003, share: 1 }], 'ball');
		expect(tallest(ms)).toBeCloseTo(lineHeight(ms[0]), 9);
	});
});

describe('the predictions', () => {
	it('doubling is recognised within 1.5%, and only when every line has been doubled', () => {
		const lines = addLine(OPENING.lines);
		const from = new Map(lines.map((l) => [l.id, l.omega]));
		expect(doubled(lines, from)).toBe(false);
		const one = [moveTo(lines[0], 2), lines[1]];
		expect(doubled(one, from)).toBe(false);
		expect(doubled([moveTo(lines[0], 2.02), moveTo(lines[1], 3.2)], from)).toBe(true);
		expect(doubled([moveTo(lines[0], 2.02), moveTo(lines[1], 3.5)], from)).toBe(false);
		expect(doublable(from)).toBe(true);
		expect(doublable(new Map([[1, 1.8]]))).toBe(false);
		const single = new Map([[1, 1]]);
		expect(doublable(single)).toBe(true);
		expect(doubled([moveTo(OPENING.lines[0], 2.02)], single)).toBe(true);
		expect(doubled([moveTo(OPENING.lines[0], 2.04)], single)).toBe(false);
	});
});
