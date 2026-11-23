/** Chapter 5.3's delay and sum, against the chapter's sum term by term and the chapter's numbers. */
import { describe, expect, it } from 'vitest';
import {
	COUNT,
	DIP_RULE,
	FRAMES,
	OPENING,
	PAIR,
	SPACING,
	SPREAD,
	aperture,
	amplitude,
	beam,
	delayed,
	dip,
	directSum,
	dirichlet,
	firstZero,
	generator,
	gratingLobes,
	halfPsi,
	mainLobe,
	meanCos,
	pairAnswer,
	pairImage,
	placeAt,
	positions,
	psiOf,
	record,
	safeSpacing,
	separation,
	spreadAnswer,
	summed
} from './delay-and-sum';

const DEG = Math.PI / 180;
const one = (v: number) => v.toFixed(1);

describe('the array factor', () => {
	it('is the chapter’s sum, term by term, whatever the origin', () => {
		for (const N of [2, 3, 8, 16, 31, 32])
			for (const b of [0.25, 0.5, 1.35, 2, 3])
				for (const [t, s] of [
					[20, 20],
					[20, -9.1],
					[-75, 40],
					[0, 89],
					[90, -90]
				]) {
					const closed = beam(N, b, t, s) * N * N;
					expect(Math.abs(closed - directSum(N, b, t, s))).toBeLessThanOrEqual(1e-8 * N * N);
				}
	});

	it('is N on the source and first falls to zero at sin θ − sin θ′ = λ/D', () => {
		for (const N of [2, 8, 16, 32]) {
			expect(amplitude(N, 0.5, 20, 20)).toBeCloseTo(1, 12);
			const s = Math.sin(20 * DEG) - firstZero(N, 0.5);
			expect(beam(N, 0.5, 20, Math.asin(s) / DEG)).toBeLessThan(1e-20);
		}
		expect(firstZero(16, 0.5)).toBe(1 / 8);
	});

	it('is real for the centred row, so two sources in step have the chapter’s real a₁ and a₂', () => {
		const N = 7;
		const b = 0.8;
		const xs = positions(N, b);
		expect(xs[0]).toBeCloseTo(-xs[N - 1], 12);
		const psi = psiOf(b, 0.3, -0.1);
		let re = 0;
		let im = 0;
		for (const x of xs) {
			re += Math.cos(psi * (x / b));
			im -= Math.sin(psi * (x / b));
		}
		expect(Math.abs(im)).toBeLessThan(1e-12);
		expect(re).toBeCloseTo(dirichlet(N, psi), 12);
	});

	it('gives eight pixels λ/2 apart a largest side lobe of 5.3% near sin θ = ±0.36', () => {
		let best = 0;
		let at = 0;
		for (let j = 0; j <= 20000; j++) {
			const s = 0.25 + (0.25 * j) / 20000;
			const v = beam(8, 0.5, Math.asin(s) / DEG, 0);
			if (v > best) {
				best = v;
				at = s;
			}
		}
		expect(best.toFixed(3)).toBe('0.053');
		expect(at.toFixed(2)).toBe('0.36');
	});
});

describe('the main lobe', () => {
	it('falls to half at the ψ where sin²(Nψ/2)/N² sin²(ψ/2) = ½', () => {
		for (const N of [COUNT.min, 5, 16, COUNT.max]) {
			const p = halfPsi(N);
			expect((dirichlet(N, p) / N) ** 2).toBeCloseTo(0.5, 12);
		}
		expect(halfPsi(2)).toBeCloseTo(Math.PI / 2, 12);
	});

	it('is 6.8° wide for 16 pixels λ/2 apart at 20°, and 1.7° at 2λ, four times narrower', () => {
		const before = mainLobe(16, 0.5, 20);
		const after = mainLobe(16, 2, 20);
		expect(one(before.width)).toBe('6.8');
		expect(one(after.width)).toBe('1.7');
		expect(before.width / after.width).toBeGreaterThan(3.9);
		expect(before.width / after.width).toBeLessThan(4.1);
		// the half heights are where the beam is ½
		expect(beam(16, 0.5, 20, before.from)).toBeCloseTo(0.5, 9);
		expect(beam(16, 0.5, 20, before.to)).toBeCloseTo(0.5, 9);
		expect(before.cut).toBe(false);
	});

	it('is cut at the horizon when its half height lies beyond it', () => {
		const lobe = mainLobe(2, 0.25, 80);
		expect(lobe.cut).toBe(true);
		expect(lobe.to).toBe(90);
	});
});

describe('the grating lobes', () => {
	it('lie at 57.4°, −9.1° and −41.1° for pixels 2λ apart and a source at 20°', () => {
		const lobes = gratingLobes(2, 20);
		expect(lobes.map((l) => one(l.angle))).toEqual(['57.4', '-9.1', '-41.1']);
		expect(lobes.map((l) => l.m)).toEqual([-1, 1, 2]);
		expect(lobes.map((l) => l.sin.toFixed(3))).toEqual(['0.842', '-0.158', '-0.658']);
		// sin θ − sin θ′ = mλ/b, and each copy is of full height
		for (const l of lobes) {
			expect(Math.sin(20 * DEG) - l.sin).toBeCloseTo(l.m / 2, 12);
			expect(beam(16, 2, 20, l.angle)).toBeCloseTo(1, 9);
		}
	});

	it('never appear with b ≤ λ/2, except at the far horizon when steered to the opposite one', () => {
		for (const b of [0.25, 0.35, 0.5])
			for (let t = -89; t <= 89; t += 1) expect(gratingLobes(b, t)).toEqual([]);
		expect(gratingLobes(0.5, -90).map((l) => l.angle)).toEqual([90]);
		expect(gratingLobes(0.25, -90)).toEqual([]);
		expect(safeSpacing(0.5)).toBe(true);
		expect(safeSpacing(0.55)).toBe(false);
		// one step wider, and a copy appears somewhere
		expect(gratingLobes(SPACING.step + 0.5, 60).length).toBeGreaterThan(0);
	});
});

describe('two sources', () => {
	const N = OPENING.N;
	const b = OPENING.b;
	const t1 = OPENING.theta;
	const t2 = placeAt(N, b, t1, PAIR)!;

	it('are placed 1.2 λ/D apart in sin θ', () => {
		expect(separation(N, b, t1, t2)).toBeCloseTo(PAIR, 12);
		expect(one(t2)).toBe('29.5');
		expect(placeAt(N, b, 80, 5)).toBeUndefined();
	});

	it('1.2 λ/D apart, dip to about 0.5 of the peaks out of step and show one peak in step', () => {
		const out = dip(N, b, t1, t2, 0);
		expect(out.onePeak).toBe(false);
		expect(out.ratio).toBeGreaterThan(0.48);
		expect(out.ratio).toBeLessThan(0.53);
		expect(out.ratio).toBeLessThan(DIP_RULE);
		const inStep = dip(N, b, t1, t2, 1);
		expect(inStep.onePeak).toBe(true);
		expect(inStep.ratio).toBe(1);
		// the in-step peak, at the midpoint, is the sum of two amplitudes of about a half, squared
		expect(inStep.peak).toBeGreaterThan(1);
		const a = pairAnswer(N, b, t1, t2);
		expect(a.out.ratio).toBe(out.ratio);
		expect(a.inStep.onePeak).toBe(true);
		expect(a.sep).toBeCloseTo(PAIR, 12);
	});

	it('separate at 1.01 λ/D out of step and 1.43 λ/D in step for a wide row, by the dip of a fifth', () => {
		// a wide row of many close pixels is the chapter's slit; the separations are near the axis
		const n = 400;
		const bb = 0.5;
		const at = (c: number) => {
			let lo = 0.5;
			let hi = 2;
			for (let i = 0; i < 50; i++) {
				const q = (lo + hi) / 2;
				const t = placeAt(n, bb, 0, q)!;
				const d = dip(n, bb, 0, t, c);
				if (d.onePeak || d.ratio > DIP_RULE) lo = q;
				else hi = q;
			}
			return (lo + hi) / 2;
		};
		const out = at(0);
		const inStep = at(1);
		expect(out.toFixed(2)).toBe('1.01');
		expect(inStep.toFixed(2)).toBe('1.43');
		expect((inStep / out).toFixed(2)).toBe('1.42');
	});

	it('averaged over phases, depend only on the mean of cos φ', () => {
		const rand = generator(5303);
		const phases = Array.from({ length: FRAMES }, () => 2 * Math.PI * rand());
		const c = meanCos(phases);
		for (const s of [10, 20, 24.7, 29.5, 40]) {
			const mean =
				phases.reduce((acc, p) => {
					const a1 = amplitude(N, b, t1, s);
					const a2 = amplitude(N, b, t2, s);
					return acc + a1 * a1 + a2 * a2 + 2 * a1 * a2 * Math.cos(p);
				}, 0) / FRAMES;
			expect(pairImage(N, b, t1, t2, s, c)).toBeCloseTo(mean, 12);
		}
		// fifty random phases average to near zero, and the generator repeats
		expect(Math.abs(c)).toBeLessThan(0.3);
		const again = generator(5303);
		expect(2 * Math.PI * again()).toBe(phases[0]);
	});
});

describe('the records', () => {
	it('line up when delayed for the source’s own direction, and sum to N times one record', () => {
		const N = 16;
		const b = 0.5;
		const waves = [{ sin: Math.sin(20 * DEG), phase: 0.4 }];
		const xs = positions(N, b);
		for (const tau of [-2.5, -1, -0.3, 0]) {
			const first = delayed(xs[0], waves, waves[0].sin, 1.1, tau);
			for (const x of xs) expect(delayed(x, waves, waves[0].sin, 1.1, tau)).toBeCloseTo(first, 12);
			expect(summed(N, b, waves, waves[0].sin, 1.1, tau)).toBeCloseTo(N * first, 10);
		}
	});

	it('sum to the chapter’s S(t), the delayed records added, at any steering and with two sources', () => {
		const N = 9;
		const b = 1.35;
		const waves = [
			{ sin: 0.3, phase: 0 },
			{ sin: -0.55, phase: 2.2 }
		];
		const xs = positions(N, b);
		for (const sSteer of [-0.9, -0.2, 0.3, 0.71])
			for (const tau of [-2, -0.7, 0]) {
				const direct = xs.reduce((s, x) => s + delayed(x, waves, sSteer, 0.6, tau), 0);
				expect(summed(N, b, waves, sSteer, 0.6, tau)).toBeCloseTo(direct, 10);
			}
		// a record sees the crest earlier by n̂·x_p/c: a pixel nearer the source leads
		expect(record(1, waves.slice(0, 1), 0, -0.3)).toBeCloseTo(
			record(0, waves.slice(0, 1), 0, 0),
			12
		);
	});
});

describe('the answers', () => {
	it('carry the chapter’s numbers', () => {
		const a = spreadAnswer(16, 20);
		expect(a.sin.toFixed(3)).toBe('0.342');
		expect(a.step).toBe(0.5);
		expect(a.lobes.map((l) => one(l.angle))).toEqual(['57.4', '-9.1', '-41.1']);
		expect(one(a.before)).toBe('6.8');
		expect(one(a.after)).toBe('1.7');
		expect(a.widths).toEqual([8, 32]);
		expect(aperture(16, SPREAD)).toBe(32);
	});
});
