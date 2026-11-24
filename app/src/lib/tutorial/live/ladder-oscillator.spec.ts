/**
 * The ladder oscillator's arithmetic (ladder-oscillator.ts): the chapter's check values of ⟨E⟩/k_BT and P(0), the
 * normalization and mean of the thermal and the coherent P(n), the radii in the scaled axes, the 1% point, the
 * sliders' grids, the words and the three predictions.
 */
import { describe, expect, it } from 'vitest';
import {
	BLOB,
	LEAST,
	LEVELS,
	NBAR,
	OPENING,
	TEMP,
	approxExcess,
	bell,
	centreAt,
	centreRadius,
	discRadius,
	energyOverKT,
	excessOf,
	excessWords,
	fixed,
	levelEnergy,
	nbarWords,
	noteFirst,
	noteSecond,
	noteThird,
	onePercentPoint,
	orbitRadius,
	parabola,
	percentWords,
	poissonAbove,
	poissonP,
	reading,
	sameNbar,
	snapNbar,
	snapTemp,
	stepped,
	texNbar,
	thermalAbove,
	thermalNbar,
	thermalP,
	tOf,
	tWords,
	zOf,
	type Settings
} from './ladder-oscillator';

const at = (t: number, coherent = false, nbar = 4): Settings => ({
	lt: Math.log10(t),
	coherent,
	nbar
});
const Z = [0.02, 0.1, 0.5, 1, 2, 3, 10, 20];

describe('the chapter’s check values', () => {
	it('⟨E⟩/k_BT = 1.000, 1.001, 1.082, 1.657, 5.000 at z = 0.01, 0.1, 1, 3, 10', () => {
		expect(fixed(energyOverKT(0.01))).toBe('1.000');
		expect(fixed(energyOverKT(0.1))).toBe('1.001');
		expect(fixed(energyOverKT(1))).toBe('1.082');
		expect(fixed(energyOverKT(3))).toBe('1.657');
		expect(fixed(energyOverKT(10))).toBe('5.000');
	});

	it('P(0) = 0.632 = 1 − 1/e at z = 1', () => {
		expect(fixed(thermalP(0, 1))).toBe('0.632');
		expect(thermalP(0, 1)).toBeCloseTo(1 - 1 / Math.E, 15);
		expect(fixed(thermalP(1, 1))).toBe('0.233');
		expect(fixed(thermalP(2, 1))).toBe('0.086');
		expect(fixed(thermalNbar(1))).toBe('0.582');
	});

	it('⟨E⟩/k_BT is z(n̄ + ½), and near z = 0 it is 1 + z²/12', () => {
		for (const z of Z) expect(energyOverKT(z)).toBeCloseTo(z * (thermalNbar(z) + 0.5), 12);
		expect(energyOverKT(1e-6)).toBeCloseTo(1, 12);
		expect(excessOf(0.01) / approxExcess(0.01)).toBeCloseTo(1, 5);
		expect(excessOf(1e-5)).toBeGreaterThan(0);
	});

	it('the steel ball and silicon’s Raman line: n̄ = 4.1 × 10⁸ at z = 2.4 × 10⁻⁹, 0.090 at z = 2.5 (1.03 × 10⁻²⁰ J over 4.14 × 10⁻²¹ J)', () => {
		expect(thermalNbar(2.4e-9) / 4.1e8).toBeCloseTo(1, 1);
		expect(fixed(thermalNbar(1.03e-20 / 4.14e-21), 2)).toBe('0.09');
	});
});

describe('the thermal distribution', () => {
	it('adds up to one, with the mean n̄ = 1/(e^z − 1)', () => {
		for (const z of Z) {
			let sum = 0;
			let mean = 0;
			for (let n = 0; n < 20000; n++) {
				sum += thermalP(n, z);
				mean += n * thermalP(n, z);
			}
			expect(sum).toBeCloseTo(1, 10);
			expect(mean / thermalNbar(z)).toBeCloseTo(1, 8);
		}
	});

	it('leaves e^{−21z} above n = 20, which is what the drawn levels miss', () => {
		for (const z of Z) {
			let below = 0;
			for (let n = 0; n <= LEVELS; n++) below += thermalP(n, z);
			expect(thermalAbove(LEVELS, z)).toBeCloseTo(1 - below, 12);
		}
		expect(Math.round(100 * thermalAbove(LEVELS, 1 / 50))).toBe(66);
	});

	it('falls from n = 0 at every temperature', () => {
		for (const z of Z)
			for (let n = 0; n < 30; n++) expect(thermalP(n + 1, z)).toBeLessThan(thermalP(n, z));
	});
});

describe('the coherent distribution', () => {
	it('is Poisson: it adds up to one and its mean is n̄', () => {
		for (const nbar of [0.1, 1, 2.5, 4, 10, 20]) {
			let sum = 0;
			let mean = 0;
			let square = 0;
			for (let n = 0; n <= 200; n++) {
				const p = poissonP(n, nbar);
				sum += p;
				mean += n * p;
				square += n * n * p;
			}
			expect(sum).toBeCloseTo(1, 12);
			expect(mean).toBeCloseTo(nbar, 10);
			// a Poisson distribution's variance is its mean
			expect(square - mean * mean).toBeCloseTo(nbar, 9);
		}
	});

	it('at n̄ = 0 is the ground state', () => {
		expect(poissonP(0, 0)).toBe(1);
		expect(poissonP(1, 0)).toBe(0);
		expect(poissonAbove(LEVELS, 0)).toBe(0);
	});

	it('peaks near n̄ and has e^{−n̄} in the ground state', () => {
		expect(poissonP(0, 4)).toBeCloseTo(Math.exp(-4), 15);
		const p = Array.from({ length: 21 }, (_, n) => poissonP(n, 4));
		expect([3, 4]).toContain(p.indexOf(Math.max(...p)));
		expect(poissonP(3, 4)).toBeCloseTo(poissonP(4, 4), 14);
	});

	it('leaves about half above n = 20 at n̄ = 20', () => {
		expect(poissonAbove(LEVELS, 20)).toBeGreaterThan(0.4);
		expect(poissonAbove(LEVELS, 20)).toBeLessThan(0.5);
	});
});

describe('the radii in the scaled axes', () => {
	it('the level n’s orbit has the radius √(2(2n + 1)), where it meets the parabola E/ħω = (x/x_zp)²/4', () => {
		for (let n = 0; n <= LEVELS; n++) {
			expect(orbitRadius(n) ** 2 / 4).toBeCloseTo(levelEnergy(n), 12);
			expect(orbitRadius(n)).toBeCloseTo(Math.sqrt(2 * (2 * n + 1)), 14);
		}
		expect(orbitRadius(0)).toBeCloseTo(Math.SQRT2, 15);
	});

	it('the coherent centre sits at 2√n̄ with a blob of radius 1, and turns clockwise', () => {
		expect(centreRadius(4)).toBe(4);
		expect(BLOB).toBe(1);
		const a = centreAt(4, 0);
		expect(a.x).toBe(4);
		expect(a.p).toBeCloseTo(0, 15);
		// a quarter of a turn later it is at the bottom: clockwise with p up
		const b = centreAt(4, Math.PI / 2);
		expect(b.x).toBeCloseTo(0, 14);
		expect(b.p).toBeCloseTo(-4, 14);
	});

	it('the thermal disc has the radius √(2n̄ + 1) = √coth(z/2), 1 at absolute zero', () => {
		expect(discRadius(0)).toBe(1);
		for (const z of Z)
			expect(discRadius(thermalNbar(z)) ** 2).toBeCloseTo(1 / Math.tanh(z / 2), 10);
	});

	it('the coherent state and the thermal one of the same n̄ have the same mean squared radius, 4n̄ + 2', () => {
		for (const nbar of [0.5, 2, 4, 20]) {
			// coherent: the centre's squared radius plus the blob's variance in each of two directions
			const coherent = centreRadius(nbar) ** 2 + 2 * BLOB ** 2;
			const thermal = 2 * discRadius(nbar) ** 2;
			expect(coherent).toBeCloseTo(4 * nbar + 2, 12);
			expect(thermal).toBeCloseTo(4 * nbar + 2, 12);
		}
	});
});

describe('the 1% point', () => {
	it('is k_BT = 2.88ħω, where n̄ = 2.41', () => {
		const p = onePercentPoint();
		expect(p.t.toFixed(2)).toBe('2.88');
		expect(p.nbar.toFixed(2)).toBe('2.41');
		expect(excessOf(p.z)).toBeCloseTo(0.01, 12);
	});

	it('the first correction (ħω)²/12k_BT reaches 0.01 at 2.89ħω, where n̄ = 2.4 and the exact excess is 0.00998', () => {
		const t = 1 / Math.sqrt(0.12);
		expect(t.toFixed(2)).toBe('2.89');
		expect(approxExcess(1 / t)).toBeCloseTo(0.01, 14);
		expect(thermalNbar(1 / t).toFixed(1)).toBe('2.4');
		expect(excessOf(1 / t).toFixed(5)).toBe('0.00998');
	});

	it('the slider’s grid first reaches it at log₁₀ = 0.46, where n̄ = 2.41', () => {
		const below = { ...OPENING, lt: 0.45 };
		const there = { ...OPENING, lt: 0.46 };
		expect(noteSecond(false, below)).toBe(false);
		expect(noteSecond(false, there)).toBe(true);
		expect(reading(there).thermal.nbar.toFixed(2)).toBe('2.41');
		expect(excessWords(reading(below).thermal.excess)).toBe('1.05%');
		expect(excessWords(reading(there).thermal.excess)).toBe('1.00%');
	});
});

describe('the sliders', () => {
	it('the temperature runs from 0.05 to 50 on hundredths of a decade, landing on ħω', () => {
		expect(tOf(TEMP.min)).toBeCloseTo(0.05, 14);
		expect(tOf(TEMP.max)).toBeCloseTo(50, 12);
		expect(snapTemp(-1e-4)).toBe(0);
		expect(snapTemp(0.4567)).toBe(0.46);
		expect(snapTemp(-5)).toBe(TEMP.min);
		expect(snapTemp(TEMP.min + 0.004)).toBe(TEMP.min);
		expect(snapTemp(9)).toBe(TEMP.max);
		expect(snapTemp(TEMP.max - 0.004)).toBe(TEMP.max);
		expect(zOf(0)).toBe(1);
	});

	it('the keys step a hundredth of a decade, a tenth with Shift, and reach k_BT = ħω from the opening', () => {
		let v = OPENING.lt;
		for (let i = 0; i < 4; i++) v = stepped(v, 'ArrowRight', true, TEMP)!;
		expect(v).toBe(0);
		expect(stepped(0, 'ArrowRight', false, TEMP)).toBe(0.01);
		expect(stepped(0, 'ArrowLeft', false, TEMP)).toBe(-0.01);
		expect(stepped(0, 'Home', false, TEMP)).toBe(TEMP.min);
		expect(stepped(0, 'End', false, TEMP)).toBe(TEMP.max);
		expect(stepped(TEMP.max, 'ArrowRight', false, TEMP)).toBe(TEMP.max);
	});

	it('the coherent n̄ runs from 0 to 20 in tenths', () => {
		expect(snapNbar(4.04)).toBe(4);
		expect(snapNbar(-1)).toBe(0);
		expect(snapNbar(25)).toBe(20);
		expect(stepped(4, 'ArrowRight', false, NBAR)).toBe(4.1);
		expect(stepped(4, 'ArrowRight', true, NBAR)).toBe(5);
		expect(stepped(19.5, 'ArrowRight', true, NBAR)).toBe(20);
	});
});

describe('the predictions', () => {
	it('the opening answers none of them', () => {
		expect(noteFirst(false, OPENING)).toBe(false);
		expect(noteSecond(false, OPENING)).toBe(false);
		expect(noteThird(false, OPENING)).toBe(false);
		expect(noteThird(false, { ...OPENING, coherent: true })).toBe(false);
		expect(tWords(tOf(OPENING.lt))).toBe('0.500');
	});

	it('the first, once k_BT = ħω with the thermal bars shown', () => {
		expect(noteFirst(false, at(1))).toBe(true);
		expect(noteFirst(false, at(1, true))).toBe(false);
		expect(noteFirst(false, { ...OPENING, lt: 0.01 })).toBe(false);
		expect(noteFirst(true, OPENING)).toBe(true);
		expect(percentWords(reading(at(1)).thermal.ground)).toBe('63.2%');
	});

	it('the second, once ⟨E⟩ is within 1% of k_BT, in either mode', () => {
		expect(noteSecond(false, at(2.5))).toBe(false);
		expect(noteSecond(false, at(3))).toBe(true);
		expect(noteSecond(false, at(50, true))).toBe(true);
		expect(noteSecond(true, at(0.1))).toBe(true);
	});

	it('the third, once the coherent state is shown with the thermal n̄, at least 1', () => {
		// k_BT = 4.47ħω has n̄ = 3.99, near the coherent state's opening 4
		const warm = { lt: 0.65, coherent: true, nbar: 4 };
		expect(fixed(reading(warm).thermal.nbar, 2)).toBe('3.99');
		expect(noteThird(false, warm)).toBe(true);
		expect(noteThird(false, { ...warm, coherent: false })).toBe(false);
		expect(noteThird(false, { ...warm, nbar: 5 })).toBe(false);
		// too cold: both are about the zero point
		const cold = { lt: Math.log10(0.5), coherent: true, nbar: 0.2 };
		expect(reading(cold).thermal.nbar).toBeLessThan(LEAST);
		expect(noteThird(false, cold)).toBe(false);
		expect(sameNbar(4.1, 4)).toBe(true);
		expect(sameNbar(4.3, 4)).toBe(false);
		expect(sameNbar(1.1, 1)).toBe(true);
	});
});

describe('the curves and the words', () => {
	it('the parabola and the bell', () => {
		const p = parabola(10, 100);
		expect(p.length).toBe(101);
		expect(p[0]).toEqual({ x: -10, e: 25 });
		expect(p[50].e).toBe(0);
		const b = bell(3, 60);
		expect(b[30].h).toBe(1);
		// one standard deviation out, at e^{−1/2} of the peak
		expect(b[40].h).toBeCloseTo(Math.exp(-0.5), 14);
	});

	it('reads the numbers out', () => {
		expect(tWords(0.05)).toBe('0.0500');
		expect(tWords(1)).toBe('1.00');
		expect(tWords(50)).toBe('50.0');
		expect(nbarWords(0.58198)).toBe('0.582');
		expect(nbarWords(49.502)).toBe('49.5');
		expect(nbarWords(thermalNbar(20))).toBe('2.1 × 10⁻⁹');
		expect(texNbar(thermalNbar(20))).toBe('2.1\\times10^{-9}');
		expect(texNbar(2.413)).toBe('2.41');
		expect(percentWords(1 - 1e-9)).toBe('> 99.9%');
		expect(percentWords(1)).toBe('100.0%');
		expect(percentWords(0.0198)).toBe('2.0%');
		expect(fixed(-0.0001)).toBe('0.000');
	});

	it('reading gathers both states', () => {
		const r = reading({ lt: 0, coherent: true, nbar: 4 });
		expect(r.t).toBe(1);
		expect(r.thermal.p.length).toBe(LEVELS + 1);
		expect(r.thermal.radius).toBeCloseTo(Math.sqrt(2 / (Math.E - 1) + 1), 14);
		expect(r.coherent.energy).toBe(4.5);
		expect(r.coherent.radius).toBe(4);
		expect(r.coherent.ground).toBeCloseTo(Math.exp(-4), 15);
	});
});
