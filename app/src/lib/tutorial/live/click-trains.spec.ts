/**
 * The click trains' arithmetic (click-trains.ts): the samplers' means and variances, the chapter's check values of
 * g⁽²⁾ and g⁽²⁾₁₂ after 10⁵ seeded windows, the standard errors against a direct computation and against the scatter
 * of repeated runs, the bounds and their strike-through, the trains, the histogram, the words and the predictions.
 */
import { describe, expect, it } from 'vitest';
import {
	BREAK,
	COUNT_RATE,
	FLOOR,
	LOW,
	MIN_PAIRS,
	MODES,
	NBAR,
	NOTHING_RAN,
	OPENING,
	READY_WINDOWS,
	TRAIN_WINDOWS,
	clickTimes,
	coherentCount,
	countRange,
	crossBound,
	decimalsFor,
	deltaError,
	drawWindow,
	emptyTally,
	errorsWords,
	exponential,
	fillTrain,
	fractions,
	g12Of,
	gOf,
	generator,
	geometricCount,
	geometricLaw,
	judge,
	lawPoints,
	lowerBound,
	moments,
	nbarOf,
	nbarWords,
	noteFirst,
	noteRun,
	noteSecond,
	poissonLaw,
	ranEnough,
	readings,
	record,
	sampleTally,
	scrollTrain,
	snapLt,
	stepped,
	thermalCount,
	varianceOf,
	windowsDue,
	withError,
	type Estimate,
	type Mode,
	type Ran
} from './click-trains';

const N = 100_000;

/** The mean and variance of `count` draws, with the standard errors of both. */
function stats(draw: () => number, count: number) {
	let s1 = 0;
	let s2 = 0;
	const xs = new Float64Array(count);
	for (let k = 0; k < count; k++) {
		const x = draw();
		xs[k] = x;
		s1 += x;
		s2 += x * x;
	}
	const mean = s1 / count;
	const variance = s2 / count - mean * mean;
	let m4 = 0;
	for (const x of xs) m4 += (x - mean) ** 4;
	m4 /= count;
	return {
		mean,
		variance,
		seMean: Math.sqrt(variance / count),
		seVariance: Math.sqrt((m4 - variance * variance) / count)
	};
}

/** |value − truth| within `k` standard errors. */
function near(e: Estimate | undefined, truth: number, k = 4) {
	expect(e).toBeDefined();
	expect(Math.abs(e!.value - truth)).toBeLessThan(k * e!.se);
}

describe('the samplers', () => {
	it('draw the exponential law with its mean and variance', () => {
		const r = generator(11);
		const s = stats(() => exponential(2.5, r), N);
		expect(Math.abs(s.mean - 2.5)).toBeLessThan(4 * s.seMean);
		expect(Math.abs(s.variance - 6.25)).toBeLessThan(4 * s.seVariance);
	});

	for (const nbar of [0.1, 1, 4, 10]) {
		it(`give the steady source Poisson counts, mean and variance n̄, at n̄ = ${nbar}`, () => {
			const r = generator(21);
			const s = stats(() => coherentCount(nbar, r), N);
			expect(Math.abs(s.mean - nbar)).toBeLessThan(4 * s.seMean);
			expect(Math.abs(s.variance - nbar)).toBeLessThan(4 * s.seVariance);
		});

		it(`give thermal light the variance n̄ + n̄², by intensity then Poisson, at n̄ = ${nbar}`, () => {
			const r = generator(31);
			const s = stats(() => thermalCount(nbar, r), N);
			expect(Math.abs(s.mean - nbar)).toBeLessThan(4 * s.seMean);
			expect(Math.abs(s.variance - nbar - nbar * nbar)).toBeLessThan(4 * s.seVariance);
		});

		it(`draw the geometric law with mean n̄ and variance n̄ + n̄² at n̄ = ${nbar}`, () => {
			const r = generator(41);
			const s = stats(() => geometricCount(nbar, r), N);
			expect(Math.abs(s.mean - nbar)).toBeLessThan(4 * s.seMean);
			expect(Math.abs(s.variance - nbar - nbar * nbar)).toBeLessThan(4 * s.seVariance);
		});
	}

	it('give thermal counts the geometric law itself, not only its two moments', () => {
		const nbar = 1.5;
		const t = sampleTally('thermal', nbar, N, 5);
		for (let n = 0; n <= 6; n++) {
			const p = geometricLaw(n, nbar);
			const se = Math.sqrt((p * (1 - p)) / N);
			expect(Math.abs((t.hist[n] ?? 0) / N - p)).toBeLessThan(4 * se);
		}
	});

	it('give both detectors of the pair the same count, and one detector elsewhere', () => {
		const r = generator(3);
		for (let k = 0; k < 200; k++) {
			const w = drawWindow('pair', 0.7, r);
			expect(w.b).toBe(w.a);
			expect(drawWindow('thermal', 0.7, r).b).toBe(0);
			expect(drawWindow('coherent', 0.7, r).b).toBe(0);
		}
	});

	it('repeat from a seed', () => {
		expect(sampleTally('thermal', 2, 500, 9).hist).toEqual(sampleTally('thermal', 2, 500, 9).hist);
		expect(sampleTally('thermal', 2, 500, 9).hist).not.toEqual(
			sampleTally('thermal', 2, 500, 10).hist
		);
	});
});

describe('the laws', () => {
	it('sum to one with the mean n̄, and give the chapter’s numbers at n̄ = 4', () => {
		for (const law of [poissonLaw, geometricLaw]) {
			let total = 0;
			let mean = 0;
			for (let n = 0; n < 400; n++) {
				total += law(n, 4);
				mean += n * law(n, 4);
			}
			expect(total).toBeCloseTo(1, 10);
			expect(mean).toBeCloseTo(4, 8);
		}
		expect(poissonLaw(3, 4)).toBeCloseTo(0.195, 3);
		expect(poissonLaw(0, 4)).toBeCloseTo(0.018, 3);
		expect(geometricLaw(0, 4)).toBeCloseTo(0.2, 10);
		expect(geometricLaw(1, 0.1)).toBeCloseTo(0.0826, 4);
	});

	it('give two or more clicks in 0.47% and 0.83% of windows at n̄ = 0.1', () => {
		const more = (law: typeof poissonLaw) => 1 - law(0, 0.1) - law(1, 0.1);
		expect(more(poissonLaw)).toBeCloseTo(0.0047, 4);
		expect(more(geometricLaw)).toBeCloseTo(0.0083, 4);
	});

	it('stop the curves at the floor of the axis', () => {
		const pts = lawPoints(poissonLaw, 0.01, 40);
		expect(pts.map((q) => q.n)).toEqual([0, 1, 2]);
		expect(pts.every((q) => q.p >= FLOOR)).toBe(true);
	});
});

describe('the chapter’s numbers after 10⁵ seeded windows', () => {
	it('g⁽²⁾ = 1.00 for the steady source at n̄ = 4', () => {
		const r = readings(sampleTally('coherent', 4, N, 101), false);
		near(r.g, 1);
		expect(r.g!.se).toBeLessThan(0.01);
		near(r.mean, 4);
		near(r.variance, 4);
	});

	it('g⁽²⁾ = 2.00 for thermal light at n̄ = 4', () => {
		const r = readings(sampleTally('thermal', 4, N, 102), false);
		near(r.g, 2);
		expect(r.g!.se).toBeLessThan(0.05);
		near(r.variance, 20);
	});

	it('g⁽²⁾₁₂ = 5.68 at n̄ = 0.2715 (r = 0.5), each detector’s own g⁽²⁾ at 2', () => {
		const nbar = Math.sinh(0.5) ** 2;
		expect(nbar).toBeCloseTo(0.2715, 4);
		expect(g12Of(nbar)).toBeCloseTo(5.68, 2);
		const r = readings(sampleTally('pair', nbar, N, 103), true);
		near(r.g12, 5.68, 4.5);
		expect(r.g12!.se).toBeLessThan(0.15);
		near(r.g, 2);
		near(r.g22, 2);
	});

	it('g⁽²⁾₁₂ = 3.00 at n̄ = 1', () => {
		const r = readings(sampleTally('pair', 1, N, 104), true);
		near(r.g12, 3);
		expect(r.g12!.se).toBeLessThan(0.05);
		near(r.excess, 1);
	});

	it('the exact values the figure is checked against', () => {
		expect(gOf('coherent')).toBe(1);
		expect(gOf('thermal')).toBe(2);
		expect(gOf('pair')).toBe(2);
		expect(g12Of(0.1)).toBeCloseTo(12, 10);
		expect(varianceOf('coherent', 9)).toBe(9);
		expect(varianceOf('thermal', 9)).toBe(90);
	});
});

describe('the standard errors', () => {
	// four windows, repeated ten times: counts 0, 1, 2, 3 at one detector
	const t = emptyTally();
	for (let k = 0; k < 10; k++) for (const a of [0, 1, 2, 3]) record(t, { a, b: 0 });

	it('give the mean the error √(variance/N)', () => {
		const r = readings(t, false);
		expect(r.mean!.value).toBeCloseTo(1.5, 12);
		expect(r.variance!.value).toBeCloseTo(1.25, 12);
		expect(r.mean!.se).toBeCloseTo(Math.sqrt(1.25 / 40), 12);
	});

	it('match each window’s influence on g⁽²⁾ and on the variance, computed directly', () => {
		const ns = Array.from({ length: 40 }, (_, k) => k % 4);
		const B = 1.5;
		const A = ns.reduce((s, n) => s + n * (n - 1), 0) / 40;
		const V = 1.25;
		const mu4 = ns.reduce((s, n) => s + (n - B) ** 4, 0) / 40;
		const psiG = ns.map((n) => (n * (n - 1) - A) / B ** 2 - (2 * A * (n - B)) / B ** 3);
		const seG = Math.sqrt(psiG.reduce((s, p) => s + p * p, 0) / 40 / 40);
		const r = readings(t, false);
		expect(r.g!.value).toBeCloseTo(A / B ** 2, 12);
		expect(r.g!.se).toBeCloseTo(seG, 12);
		expect(r.variance!.se).toBeCloseTo(Math.sqrt((mu4 - V * V) / 40), 12);
	});

	it('give the covariance of the window quantities from the power sums', () => {
		const { mean, cov } = moments(t);
		expect(mean[0]).toBeCloseTo(1.5, 12);
		expect(mean[2]).toBeCloseTo(2, 12);
		expect(cov[0][0]).toBeCloseTo(1.25, 12);
		expect(cov[2][2]).toBeCloseTo(6, 12);
		expect(cov[0][2]).toBeCloseTo(2.5, 12);
		expect(deltaError([1, 0, 0, 0, 0], cov, 40)).toBeCloseTo(Math.sqrt(1.25 / 40), 12);
	});

	/** The scatter of a reading over `runs` seeded runs against the mean of its stated error. */
	function scatter(mode: Mode, nbar: number, pick: (r: ReturnType<typeof readings>) => Estimate) {
		const runs = 300;
		const values: number[] = [];
		let ses = 0;
		for (let k = 0; k < runs; k++) {
			const e = pick(readings(sampleTally(mode, nbar, 3000, 5000 + k), mode === 'pair'));
			values.push(e.value);
			ses += e.se;
		}
		const m = values.reduce((s, v) => s + v, 0) / runs;
		const sd = Math.sqrt(values.reduce((s, v) => s + (v - m) ** 2, 0) / (runs - 1));
		return sd / (ses / runs);
	}

	it('agree with the scatter of repeated runs, to within 15%', () => {
		for (const [mode, nbar, pick] of [
			['coherent', 2, (r) => r.g!],
			['thermal', 1, (r) => r.g!],
			['thermal', 1, (r) => r.variance!],
			['pair', 0.5, (r) => r.g12!],
			['pair', 0.5, (r) => r.excess!]
		] as [Mode, number, (r: ReturnType<typeof readings>) => Estimate][]) {
			const ratio = scatter(mode, nbar, pick);
			expect(ratio).toBeGreaterThan(0.85);
			expect(ratio).toBeLessThan(1.15);
		}
	});

	it('are left out until enough clicks and pairs are in', () => {
		const r = readings(sampleTally('coherent', 0.01, 300, 7), false);
		expect(r.mean).toBeUndefined();
		expect(r.g).toBeUndefined();
		const few = readings(sampleTally('pair', 0.05, 3000, 7), true);
		expect(few.pairs).toBeLessThan(MIN_PAIRS);
		expect(few.g).toBeUndefined();
		expect(few.excess).toBeUndefined();
		expect(few.g12).toBeDefined();
	});
});

describe('the bounds', () => {
	it('strike only past three standard errors', () => {
		expect(BREAK).toBe(3);
		expect(judge(undefined)).toEqual({ status: 'waiting' });
		expect(judge({ value: 0.31, se: 0.1 }).status).toBe('broken');
		expect(judge({ value: 0.29, se: 0.1 }).status).toBe('holds');
		expect(judge({ value: -5, se: 0.1 }).status).toBe('holds');
		expect(judge({ value: 0.31, se: 0.1 })).toMatchObject({ errors: expect.closeTo(3.1, 9) });
		expect(judge({ value: 0.01, se: 0 }).status).toBe('broken');
	});

	it('hold for the steady and the thermal sources, which no classical bound forbids', () => {
		for (const mode of ['coherent', 'thermal'] as const) {
			const r = readings(sampleTally(mode, 1, N, 201), false);
			expect(lowerBound(r).status).toBe('holds');
			expect(crossBound(r).status).toBe('waiting');
		}
	});

	it('break g⁽²⁾₁₂ ≤ √(g⁽²⁾₁₁g⁽²⁾₂₂) for the pair source, and keep g⁽²⁾ ≥ 1', () => {
		const r = readings(sampleTally('pair', 1, 20_000, 202), true);
		expect(crossBound(r).status).toBe('broken');
		expect(lowerBound(r).status).toBe('holds');
	});

	it('break g⁽²⁾ ≥ 1 for counts that antibunch, as a single quantum’s', () => {
		const t = emptyTally();
		const r = generator(1);
		for (let k = 0; k < 5000; k++) record(t, { a: r() < 0.5 ? 1 : 2, b: 0 });
		const v = lowerBound(readings(t, false));
		expect(v.status).toBe('broken');
	});
});

describe('the settings', () => {
	it('open on the steady source at n̄ = 1', () => {
		expect(OPENING).toEqual({ mode: 'coherent', lt: 0 });
		expect(nbarOf(OPENING.lt)).toBe(1);
		expect(MODES).toEqual(['coherent', 'thermal', 'pair']);
	});

	it('run the slider from 0.01 to 10, with key steps that land on 0.1 and 1', () => {
		expect(nbarOf(NBAR.min)).toBeCloseTo(0.01, 12);
		expect(nbarOf(NBAR.max)).toBeCloseTo(10, 12);
		let v = 0;
		for (let k = 0; k < 20; k++) v = stepped(v, 'ArrowLeft', false, NBAR)!;
		expect(v).toBe(-1);
		expect(stepped(-1, 'ArrowRight', true, NBAR)).toBe(-0.75);
		expect(stepped(0.97, 'ArrowRight', true, NBAR)).toBe(1);
		expect(stepped(0, 'Home', false, NBAR)).toBe(-2);
		expect(snapLt(-0.333)).toBe(-0.33);
		expect(snapLt(-5)).toBe(-2);
		expect(snapLt(1.004)).toBe(1);
	});
});

describe('the trains', () => {
	it('fill a train with every window that reaches into view, its clicks in order within it', () => {
		const train = fillTrain(100.4, 'thermal', 3, generator(1));
		expect(train[0].id).toBe(100 - TRAIN_WINDOWS);
		expect(train[train.length - 1].id).toBe(100);
		for (const w of train) {
			expect(w.times).toEqual([...w.times].sort((p, q) => p - q));
			expect(w.times.every((t) => t >= 0 && t < 1)).toBe(true);
		}
	});

	it('scroll by adding the windows begun and dropping those gone', () => {
		const r = generator(2);
		const train = fillTrain(10.5, 'coherent', 1, r);
		const next = scrollTrain(train, 12.2, 'coherent', 1, r);
		expect(next[next.length - 1].id).toBe(12);
		expect(next[0].id).toBe(12 - TRAIN_WINDOWS);
		expect(next.map((w) => w.id)).toEqual(next.map((_, k) => next[0].id + k));
		expect(clickTimes(0, r)).toEqual([]);
	});

	it('count the windows due in each frame at the counting rate, carrying the fraction', () => {
		let owed = 0;
		let total = 0;
		for (let k = 0; k < 60; k++) {
			const d = windowsDue(owed, 1 / 60);
			total += d.count;
			owed = d.owed;
			expect(owed).toBeGreaterThanOrEqual(0);
			expect(owed).toBeLessThan(1);
		}
		expect(Math.abs(total - COUNT_RATE)).toBeLessThanOrEqual(1);
	});
});

describe('the histogram', () => {
	it('spans four standard deviations above the mean, from 4 to 40 counts', () => {
		expect(countRange('coherent', 0.01)).toBe(4);
		expect(countRange('coherent', 10)).toBe(23);
		expect(countRange('thermal', 10)).toBe(40);
		expect(countRange('thermal', 1)).toBe(7);
	});

	it('gives the fractions of windows, and what lies above the last count', () => {
		const t = emptyTally();
		for (const a of [0, 0, 1, 5]) record(t, { a, b: 0 });
		const f = fractions(t, 4);
		expect(f.p).toEqual([0.5, 0.25, 0, 0, 0]);
		expect(f.above).toBeCloseTo(0.25, 12);
		expect(fractions(emptyTally(), 4).above).toBe(0);
	});
});

describe('the words', () => {
	it('give an error two figures and the value the same place', () => {
		expect(withError({ value: 2.00342, se: 0.01234 })).toBe('2.003 ± 0.012');
		expect(withError({ value: 5.6812, se: 0.153 })).toBe('5.68 ± 0.15');
		expect(withError({ value: 20.31, se: 1.52 })).toBe('20.3 ± 1.5');
		expect(withError({ value: 102.4, se: 15.2 })).toBe('102 ± 15');
		expect(withError({ value: -0.0213, se: 0.0042 })).toBe('−0.0213 ± 0.0042');
		expect(decimalsFor(0)).toBe(4);
		expect(nbarWords(0.01)).toBe('0.0100');
		expect(nbarWords(1)).toBe('1.00');
		expect(nbarWords(10)).toBe('10.0');
		expect(errorsWords(33.4)).toBe('by 33 errors');
		expect(errorsWords(Infinity)).toBe('by more than 1,000 errors');
	});
});

describe('the predictions', () => {
	const run = (ran: Ran, mode: Mode, lt: number) => noteRun(ran, { mode, lt });

	it('count a run once it has a thousand windows and fifty clicks, and the pair once it has coincidences', () => {
		expect(ranEnough('coherent', sampleTally('coherent', 1, READY_WINDOWS - 1, 1))).toBe(false);
		expect(ranEnough('coherent', sampleTally('coherent', 1, READY_WINDOWS, 1))).toBe(true);
		expect(ranEnough('thermal', sampleTally('thermal', 0.01, 2000, 1))).toBe(false);
		expect(ranEnough('pair', sampleTally('pair', 0.01, 2000, 1))).toBe(false);
		expect(ranEnough('pair', sampleTally('pair', 0.1, 2000, 1))).toBe(true);
	});

	it('answer the first once the steady and the thermal sources have run at the same n̄', () => {
		let ran = NOTHING_RAN;
		expect(noteFirst(false, ran)).toBe(false);
		ran = run(ran, 'coherent', 0);
		expect(noteFirst(false, ran)).toBe(false);
		ran = run(ran, 'thermal', -0.5);
		expect(noteFirst(false, ran)).toBe(false);
		ran = run(ran, 'pair', 0);
		expect(noteFirst(false, ran)).toBe(false);
		ran = run(ran, 'thermal', 0);
		expect(noteFirst(false, ran)).toBe(true);
		expect(noteFirst(true, NOTHING_RAN)).toBe(true);
	});

	it('answer the second once the pair has run at two n̄, the lower at most 0.3 and a third of the other', () => {
		let ran = NOTHING_RAN;
		ran = run(ran, 'pair', 0);
		expect(noteSecond(false, ran)).toBe(false);
		ran = run(ran, 'pair', -0.3);
		expect(noteSecond(false, ran)).toBe(false);
		ran = run(ran, 'thermal', -1);
		expect(noteSecond(false, ran)).toBe(false);
		ran = run(ran, 'pair', Math.log10(LOW) + 0.01);
		expect(noteSecond(false, ran)).toBe(false);
		ran = run(ran, 'pair', -0.55);
		expect(noteSecond(false, ran)).toBe(true);
		// a single low setting is not lowering
		expect(noteSecond(false, run(NOTHING_RAN, 'pair', -1))).toBe(false);
		expect(noteSecond(false, run(run(NOTHING_RAN, 'pair', -1), 'pair', -2))).toBe(true);
	});

	it('keep the record unchanged for a setting already run', () => {
		const ran = run(NOTHING_RAN, 'pair', -1);
		expect(run(ran, 'pair', -1.0000001)).toBe(ran);
		expect(NOTHING_RAN.pair).toEqual([]);
	});
});
