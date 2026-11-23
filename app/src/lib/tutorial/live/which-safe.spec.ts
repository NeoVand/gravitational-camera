/** The locked safe as a test, against the numbers chapter 3.3 prints, and the trials against the rule they stand for. */
import { describe, expect, it } from 'vitest';
import {
	BIN,
	GOLD_MASS,
	LEAST,
	MOST,
	READINGS,
	RUNGS,
	SEPARATION_PER_SNR,
	aloneSeparation,
	bell,
	binOf,
	emptyTally,
	errorProbability,
	expectedWrong,
	fullTrial,
	largestDifference,
	noise,
	reach,
	run,
	separation,
	separationForError,
	snap,
	snrForError,
	source,
	stepRung,
	trial
} from './which-safe';

describe('the chapter’s numbers', () => {
	it('reads 605 numbers: five components at each of 11 × 11 pixels', () => {
		expect(READINGS).toBe(605);
		expect(GOLD_MASS).toBeCloseTo(324.24, 9);
	});

	it('gives σ_n = 3.5 × 10⁻⁹ s⁻² at SNR = 10', () => {
		expect(noise(10)).toBeCloseTo(3.533e-9, 12);
	});

	it('separates the two safes by D = 1.811 at SNR = 10, and P_err = 0.183', () => {
		// reference/gravcam/inversion.py: worked_case(10)["left_right"] = 1.8111554511736525
		expect(separation(10)).toBeCloseTo(1.8111554511736525, 9);
		expect(separation(10).toFixed(3)).toBe('1.811');
		expect(errorProbability(separation(10))).toBeCloseTo(0.18257970146405988, 9);
		expect(errorProbability(separation(10)).toFixed(3)).toBe('0.183');
		expect((separation(10) / 2).toFixed(3)).toBe('0.906');
		expect(SEPARATION_PER_SNR.toFixed(3)).toBe('0.181');
	});

	it('reaches one error in a thousand near SNR = 34: D = 6.16 and P_err = 1.04 × 10⁻³', () => {
		expect(separation(34).toFixed(2)).toBe('6.16');
		expect((separation(34) / 2).toFixed(2)).toBe('3.08');
		expect(errorProbability(separation(34))).toBeCloseTo(1.038607973512946e-3, 9);
		expect(separationForError(1e-3).toFixed(2)).toBe('6.18');
		expect(snrForError(1e-3).toFixed(1)).toBe('34.1');
	});

	it('needs D = 4.65 for an error of 1%, at SNR = 25.7; and 9.51 for 10⁻⁶, at 52.5', () => {
		expect(separationForError(0.01).toFixed(2)).toBe('4.65');
		expect(snrForError(0.01).toFixed(1)).toBe('25.7');
		expect(separationForError(1e-6).toFixed(2)).toBe('9.51');
		expect(snrForError(1e-6).toFixed(1)).toBe('52.5');
	});

	it('gives D = 18.1 and P_err = 7 × 10⁻²⁰ at SNR = 100, and a coin as D falls to zero', () => {
		expect(separation(100).toFixed(1)).toBe('18.1');
		expect(errorProbability(separation(100))).toBeCloseTo(6.77992889610637e-20, 30);
		expect(errorProbability(0)).toBeCloseTo(0.5, 12);
		expect(errorProbability(separation(1))).toBeCloseTo(0.463921993312027, 9);
	});

	it('has no single reading differ by more than a fifth of σ_n, and each safe alone 1.77 above an empty room', () => {
		expect(largestDifference(10)).toBeCloseTo(0.1863502546941707, 9);
		expect(largestDifference(10)).toBeLessThan(0.2);
		expect(aloneSeparation(10).toFixed(2)).toBe('1.77');
	});
});

describe('the slider', () => {
	it('stops at the 181 ratios of two significant figures from 1 to 100, among them 10 and 34', () => {
		expect(RUNGS.length).toBe(181);
		expect(RUNGS[0]).toBe(LEAST);
		expect(RUNGS.at(-1)).toBe(MOST);
		for (let i = 1; i < RUNGS.length; i++) expect(RUNGS[i]).toBeGreaterThan(RUNGS[i - 1]);
		expect(RUNGS).toContain(10);
		expect(RUNGS).toContain(34);
		expect(RUNGS).toContain(3);
	});

	it('snaps to two figures and steps one rung at a time', () => {
		expect(snap(10 ** 1.5315)).toBe(34);
		expect(snap(10.04)).toBe(10);
		expect(snap(0.5)).toBe(1);
		expect(snap(1000)).toBe(100);
		expect(snap(99.7)).toBe(100);
		expect(stepRung(34, 1)).toBe(35);
		expect(stepRung(10, -1)).toBe(9.9);
		expect(stepRung(9.9, 1)).toBe(10);
		expect(stepRung(1, -1)).toBe(1);
		expect(stepRung(100, 3)).toBe(100);
	});
});

describe('the trials', () => {
	it('are the same for the same seed', () => {
		const a = source(7);
		const b = source(7);
		for (let k = 0; k < 20; k++) expect(trial(1.8, a)).toEqual(trial(1.8, b));
	});

	it('decide by the sufficient statistic exactly as by the two distances over all 605 readings', () => {
		// with all the noises drawn: the closer prediction is the one on the side of t, and
		// |y − f_B|² − |y − f_A|² = 2 D t (both in units of σ_n), the chapter's identity
		const from = source(11);
		const d = separation(10);
		for (let k = 0; k < 400; k++) {
			const one = fullTrial(10, from);
			expect(one.pick).toBe(one.t > 0 ? 'A' : 'B');
			expect(one.toB - one.toA).toBeCloseTo(2 * d * one.t, 6);
		}
	});

	it('gives t/σ_n the mean ±D/2 and the variance 1 in full, as the statistic assumes', () => {
		const from = source(5);
		const d = separation(10);
		const n = 3000;
		for (const truth of ['A', 'B'] as const) {
			let s = 0;
			let s2 = 0;
			for (let k = 0; k < n; k++) {
				const { t } = fullTrial(10, from, truth);
				s += t;
				s2 += t * t;
			}
			const mean = s / n;
			const variance = s2 / n - mean ** 2;
			expect(Math.abs(mean - (truth === 'A' ? d / 2 : -d / 2))).toBeLessThan(4 / Math.sqrt(n));
			expect(Math.abs(variance - 1)).toBeLessThan(4 * Math.sqrt(2 / n));
		}
	});

	it('are wrong 18.3% of the time at SNR = 10, within the scatter of 10,000 trials', () => {
		const d = separation(10);
		const p = errorProbability(d);
		for (const seed of [1, 2, 3]) {
			const tally = run(emptyTally(d), 10_000, source(seed));
			expect(tally.trials).toBe(10_000);
			expect(tally.trialsA + tally.trialsB).toBe(10_000);
			const { mean, spread } = expectedWrong(10_000, p);
			expect(Math.abs(tally.wrong - mean)).toBeLessThan(4 * spread);
			expect(Math.abs(tally.trialsA - 5000)).toBeLessThan(4 * 50);
		}
	});

	it('are wrong about ten times in 10,000 at SNR = 34', () => {
		const d = separation(34);
		let wrong = 0;
		for (const seed of [1, 2, 3, 4]) wrong += run(emptyTally(d), 10_000, source(seed)).wrong;
		const { mean, spread } = expectedWrong(40_000, errorProbability(d));
		expect(mean).toBeCloseTo(41.5, 0);
		expect(Math.abs(wrong - mean)).toBeLessThan(4 * spread);
	});

	it('run a batch of 10,000 at once, in well under a frame', () => {
		const start = performance.now();
		run(emptyTally(1.8), 10_000, source(9));
		expect(performance.now() - start).toBeLessThan(50);
	});

	it('keep the old tally untouched and fill the histogram of each hypothesis', () => {
		const d = separation(10);
		const before = emptyTally(d);
		const after = run(before, 500, source(4));
		expect(before.trials).toBe(0);
		expect(before.binsA.reduce((s, v) => s + v, 0)).toBe(0);
		expect(after.binsA.reduce((s, v) => s + v, 0)).toBe(after.trialsA);
		expect(after.binsB.reduce((s, v) => s + v, 0)).toBe(after.trialsB);
		expect(after.last).toBeDefined();
	});
});

describe('the drawing’s bins and bells', () => {
	it('reaches past both bells and their tails, in whole bins', () => {
		expect(reach(0.2)).toBe(4);
		expect(reach(separation(100))).toBeGreaterThan(separation(100) / 2 + 3.5);
		expect((reach(7.3) / BIN) % 1).toBe(0);
		expect(emptyTally(0.2).binsA.length).toBe(32);
		expect(emptyTally(1.8).binsA.length).toBe(36);
	});

	it('puts t in its bin, and values beyond the ends in the end bins', () => {
		expect(binOf(-4, 0.2)).toBe(0);
		expect(binOf(-3.99, 0.2)).toBe(0);
		expect(binOf(0.01, 0.2)).toBe(16);
		expect(binOf(-100, 0.2)).toBe(0);
		expect(binOf(100, 0.2)).toBe(31);
	});

	it('draws the bell of unit width and unit area', () => {
		let s = 0;
		for (let x = -8; x < 8; x += 0.001) s += bell(x + 0.0005) * 0.001;
		expect(s).toBeCloseTo(1, 6);
		expect(bell(0)).toBeCloseTo(0.3989, 4);
	});
});
