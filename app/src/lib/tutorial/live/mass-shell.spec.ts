/**
 * Chapter 6.4's mass shell in light-cone form: the figure's model against the chapter's equations and against every
 * number its specification asks for: q(E/c + p_z) = m²c² + p_⊥²; a boost multiplying the light-cone components by
 * e^{±η}; a kick that keeps q with ΔE = (c/2q)Δ(p_⊥²), Newton's rule in the slow limit; the pair of Appendix C at
 * 2.5m, 2m after the wave that stops it and √13 m after its reverse, with 𝓜₊² + 𝓜₋² − 2𝓜₀² = 4.5m²; and the gain
 * ⅛cq|∇H|² at 0.6c along +z half the slow body's.
 */
import { describe, expect, it } from 'vitest';
import {
	APP_C,
	FAST,
	FIRST_START,
	GRADIENT,
	LN2,
	MOMENTUM,
	NAMED,
	RAPIDITY,
	SECOND_START,
	SLOW,
	SPAN,
	afterWave,
	betaPerp,
	betaZ,
	boosted,
	energyGain,
	etaTex,
	etaWords,
	evenMass,
	expEta,
	firstAnswer,
	fromMomenta,
	fromQ,
	fromRapidity,
	headOnGain,
	hundredths,
	hyper,
	keyed,
	kickOf,
	kicked,
	landed,
	lnTwos,
	lorentz,
	lumpBodies,
	massSquared,
	newtonGain,
	noteFirst,
	noteSecond,
	offShell,
	onPanel,
	pinned,
	rapidityOf,
	secondAnswer,
	shellCurve,
	shellProduct,
	stats,
	stoppingWave,
	three,
	toPlane,
	two,
	underWave,
	weighted,
	type Lump,
	type OneSettings
} from './mass-shell';

const ETAS = [-2, -1.37, -LN2, -0.3, 0, 0.05, 0.42, LN2, 1.1, 2];
const PERPS = [-1.5, -0.75, -0.2, 0, 0.01, 0.6, 0.75, 1.5];

describe('the mass shell', () => {
	it('puts every body on q(E/c + p_z) = m²c² + p_⊥², to 1e-12', () => {
		for (const eta of ETAS)
			for (const perp of PERPS) {
				const b = fromRapidity(eta, perp);
				// the light-cone components formed from E/c and p_z, not taken from the body's own q and w
				const q = b.e - b.pz;
				const w = b.e + b.pz;
				expect(Math.abs(q * w - shellProduct(1, perp))).toBeLessThan(1e-12 * Math.max(1, q * w));
				expect(Math.abs(offShell(b))).toBeLessThan(1e-12);
				expect(massSquared(b)).toBeCloseTo(1, 11);
				expect(q).toBeCloseTo(b.q, 12);
				expect(w).toBeCloseTo(b.w, 11);
			}
	});

	it('gives the chapter’s numbers at 0.6c: q = mc/2, E/c + p_z = 2mc, E = 1.25mc², exactly', () => {
		const b = fromRapidity(LN2, 0);
		expect(b.q).toBe(0.5);
		expect(b.w).toBe(2);
		expect(b.e).toBe(1.25);
		expect(b.pz).toBe(0.75);
		expect(betaZ(b)).toBe(0.6);
		// and q = 2mc along −z
		expect(fromRapidity(-LN2, 0).q).toBe(2);
		// at 0.8c, E/c + p_z = 3mc and q = mc/3
		const fast = fromRapidity(Math.atanh(0.8), 0);
		expect(fast.w).toBeCloseTo(3, 12);
		expect(fast.q).toBeCloseTo(1 / 3, 12);
	});

	it('has the velocity c tanh η along z, and the rapidity ½ ln(w/q), with p_⊥ or without', () => {
		for (const eta of ETAS)
			for (const perp of PERPS) {
				const b = fromRapidity(eta, perp);
				expect(betaZ(b)).toBeCloseTo(Math.tanh(eta), 12);
				expect(rapidityOf(b)).toBeCloseTo(eta, 12);
			}
	});

	it('builds the same body from its q, its rapidity or its momenta', () => {
		for (const eta of ETAS)
			for (const perp of PERPS) {
				const b = fromRapidity(eta, perp);
				for (const c of [fromQ(b.q, perp), fromMomenta(perp, b.pz)]) {
					expect(c.e).toBeCloseTo(b.e, 11);
					expect(c.pz).toBeCloseTo(b.pz, 11);
					expect(c.q / b.q).toBeCloseTo(1, 12);
					expect(c.w / b.w).toBeCloseTo(1, 12);
				}
			}
	});

	it('is exact at whole numbers of ln 2', () => {
		expect(lnTwos(LN2)).toBe(1);
		expect(lnTwos(-2 * LN2)).toBe(-2);
		expect(lnTwos(0.7)).toBeUndefined();
		expect(expEta(LN2)).toBe(2);
		expect(hyper(LN2)).toEqual({ cosh: 1.25, sinh: 0.75, tanh: 0.6 });
	});
});

describe('a boost along z', () => {
	it('multiplies q by e^{η} and E/c + p_z by e^{−η}, as the boost table on (E/c, p_z) does', () => {
		for (const eta0 of ETAS)
			for (const perp of PERPS)
				for (const eta of [-1.5, -LN2, 0.2, LN2, 1.9]) {
					const b = fromRapidity(eta0, perp);
					const seen = boosted(b, eta);
					expect(seen.q / b.q).toBeCloseTo(Math.exp(eta), 12);
					expect(seen.w / b.w).toBeCloseTo(Math.exp(-eta), 12);
					expect(seen.perp).toBe(perp);
					const table = lorentz(b, eta);
					expect(seen.e).toBeCloseTo(table.e, 10);
					expect(seen.pz).toBeCloseTo(table.pz, 10);
					// the product, and so the rest mass, is kept
					expect(seen.q * seen.w).toBeCloseTo(b.q * b.w, 11);
				}
	});

	it('of −η carries the body at rest to the body at the rapidity η, sliding along its hyperbola', () => {
		for (const eta of ETAS)
			for (const perp of PERPS) {
				const moving = boosted(fromRapidity(0, perp), -eta);
				const b = fromRapidity(eta, perp);
				expect(moving.q / b.q).toBeCloseTo(1, 12);
				expect(moving.w / b.w).toBeCloseTo(1, 12);
			}
	});

	it('doubles one component and halves the other at ln 2', () => {
		const rest = fromRapidity(0, 0);
		const seen = boosted(rest, LN2);
		expect(seen.q).toBe(2);
		expect(seen.w).toBe(0.5);
	});
});

describe('a sideways kick', () => {
	it('keeps q and moves the body onto the shell of its new p_⊥', () => {
		for (const eta of ETAS)
			for (const perp of PERPS)
				for (const g of [-2, -0.6, 0.3, 1, 2])
					for (const mode of ['wave', 'fixed'] as const) {
						const b = fromRapidity(eta, perp);
						const dp = kickOf(b, g, mode);
						const a = kicked(b, dp);
						expect(a.q).toBe(b.q);
						expect(a.perp).toBeCloseTo(perp + dp, 12);
						expect(Math.abs(offShell(a))).toBeLessThan(1e-12 * Math.max(1, a.q * a.w));
						// ΔE = (c/2q)Δ(p_⊥²), and p_z grows by the same ΔE/c
						const gain = energyGain(b, dp);
						expect(gain).toBeCloseTo(((perp + dp) ** 2 - perp ** 2) / (2 * b.q), 9);
						expect(a.e - b.e).toBeCloseTo(gain, 9);
						expect(a.pz - b.pz).toBeCloseTo(gain, 9);
					}
	});

	it('gives the wave’s Δp_⊥ = ½q∇H, and a fixed ½mc∇H', () => {
		const b = fromRapidity(LN2, 0.3);
		expect(kickOf(b, 1.2, 'wave')).toBeCloseTo(0.5 * b.q * 1.2, 14);
		expect(kickOf(b, 1.2, 'fixed')).toBe(0.6);
	});

	it('is Newton’s v·Δp + |Δp|²/2m in the slow limit', () => {
		for (const perp of [-1e-3, 0, 2e-3])
			for (const dp of [-1e-3, 5e-4, 1e-3]) {
				const b = fromRapidity(0, perp);
				const exact = energyGain(b, dp);
				const newton = newtonGain(b, dp);
				expect(Math.abs(exact - newton)).toBeLessThan(1e-5 * Math.abs(exact) + 1e-18);
			}
		// and departs from it at speed: at rest with p_⊥ = 0.75mc, Newton's second term is 1.25 times too large
		const b = fromRapidity(0, 0.75);
		expect(energyGain(b, 0.5)).toBeCloseTo(0.6 * 0.5 + 0.25 / 2.5, 12);
		expect(newtonGain(b, 0.5)).toBeCloseTo(0.6 * 0.5 + 0.25 / 2, 12);
		expect(betaPerp(b)).toBeCloseTo(0.6, 12);
	});

	it('gives a body crossing head-on ⅛cq|∇H|², half as much at 0.6c along +z as at rest', () => {
		for (const g of [0.3, 1, 2]) {
			const slow = fromRapidity(0, 0);
			const fast = fromRapidity(LN2, 0);
			const gs = energyGain(slow, kickOf(slow, g, 'wave'));
			const gf = energyGain(fast, kickOf(fast, g, 'wave'));
			expect(gs).toBeCloseTo(headOnGain(1, g), 14);
			expect(gf).toBeCloseTo(headOnGain(0.5, g), 14);
			expect(gf / gs).toBe(0.5);
			// a fixed kick gives the fast body twice as much instead
			const fs = energyGain(slow, kickOf(slow, g, 'fixed'));
			const ff = energyGain(fast, kickOf(fast, g, 'fixed'));
			expect(ff / fs).toBe(2);
		}
		expect(headOnGain(1, 1)).toBe(0.125);
	});

	it('of a wave and its reverse gives energy in total', () => {
		for (const eta of ETAS)
			for (const perp of PERPS) {
				const b = fromRapidity(eta, perp);
				const g = 0.8;
				const sum = energyGain(b, kickOf(b, g, 'wave')) + energyGain(b, kickOf(b, -g, 'wave'));
				expect(sum).toBeCloseTo(2 * headOnGain(b.q, g), 10);
				expect(sum).toBeGreaterThan(0);
			}
	});
});

describe('the rest mass of two lumps', () => {
	const pair = lumpBodies(APP_C);

	it('is 2.5m for the pair of Appendix C, by the sum and the direct formula', () => {
		const s = stats(pair);
		expect(s.Q).toBeCloseTo(2.5, 14);
		expect(s.first).toBeCloseTo(4, 14);
		expect(s.x[0]).toBeCloseTo(0.6, 14);
		expect(s.x[1]).toBeCloseTo(-0.6, 14);
		expect(s.mean).toBeCloseTo(0, 14);
		expect(s.variance).toBeCloseTo(0.36, 14);
		expect(s.spread).toBeCloseTo(2.25, 13);
		expect(s.massSum).toBeCloseTo(2.5, 13);
		expect(s.massDirect).toBeCloseTo(2.5, 13);
	});

	it('agrees with (ΣE/c)² − |Σp|² for any lumps', () => {
		const lumps: Lump[][] = [
			[
				{ perp: 0.3, pz: -1.2 },
				{ perp: -1.1, pz: 0.4 }
			],
			[
				{ perp: 1.5, pz: 1.5 },
				{ perp: 1.5, pz: -1.5 }
			],
			[
				{ perp: 0, pz: 0.9 },
				{ perp: 0, pz: 0.9 }
			],
			[
				{ perp: -0.2, pz: 0.05 },
				{ perp: 0.7, pz: -0.65 },
				{ perp: 0.1, pz: 1.3 }
			]
		];
		for (const l of lumps) {
			const s = stats(lumpBodies(l));
			expect(s.sum).toBeCloseTo(s.direct, 12);
			expect(s.massSum).toBeCloseTo(s.massDirect, 12);
		}
	});

	it('is the weighted variance of p_⊥/q with the weights q_a/Q', () => {
		const { mean, variance } = weighted([1, 3], [3, 1]);
		expect(mean).toBe(1.5);
		expect(variance).toBeCloseTo(0.75, 14);
		expect(weighted([2, 2, 2], [1, 5, 2]).variance).toBe(0);
	});

	it('falls to 2m under the wave that stops the lumps, and rises to √13 m under its reverse', () => {
		const g = stoppingWave(pair);
		expect(g[0]).toBeCloseTo(-1.2, 14);
		expect(g[1]).toBeCloseTo(1.2, 14);
		const stopped = underWave(pair, 'stop');
		for (const b of stopped) {
			expect(b.perp).toBeCloseTo(0, 14);
			expect(b.q).toBe(1.25);
			expect(b.e).toBeCloseTo(1.025, 14);
			expect(b.pz).toBeCloseTo(-0.225, 14);
		}
		const plus = stats(stopped);
		expect(plus.Q).toBeCloseTo(2.5, 14);
		expect(plus.first).toBeCloseTo(4, 14);
		expect(plus.variance).toBeCloseTo(0, 14);
		expect(plus.massSum).toBeCloseTo(2, 13);
		expect(plus.massDirect).toBeCloseTo(2, 12);
		const minus = stats(underWave(pair, 'reverse'));
		expect(minus.x[0]).toBeCloseTo(1.2, 14);
		expect(minus.variance).toBeCloseTo(1.44, 13);
		expect(minus.massSum).toBeCloseTo(Math.sqrt(13), 13);
		expect(minus.massDirect).toBeCloseTo(Math.sqrt(13), 12);
		expect(three(minus.massSum)).toBe('3.61');
		expect(minus.massSum).toBeCloseTo(3.606, 3);
		expect(underWave(pair, 'none')).toBe(pair);
		expect(afterWave(pair, [0, 0]).map((b) => b.perp)).toEqual([0.75, -0.75]);
	});

	it('obeys 𝓜₊² + 𝓜₋² − 2𝓜₀² = Q²Var(∇H)/2c² = 4.5m² for the pair, and ≥ 0 for any', () => {
		const e = evenMass(pair);
		expect(e.zero).toBeCloseTo(6.25, 13);
		expect(e.plus).toBeCloseTo(4, 13);
		expect(e.minus).toBeCloseTo(13, 12);
		expect(e.left).toBeCloseTo(4.5, 12);
		expect(e.right).toBeCloseTo(4.5, 12);
		expect(e.gradientVariance).toBeCloseTo(1.44, 13);
		for (const l of [
			[
				{ perp: 0.3, pz: -1.2 },
				{ perp: -1.1, pz: 0.4 }
			],
			[
				{ perp: 0.4, pz: 0.2 },
				{ perp: 0.4, pz: 0.2 }
			],
			[
				{ perp: 1.5, pz: 1.5 },
				{ perp: -0.1, pz: -1.5 }
			]
		]) {
			const f = evenMass(lumpBodies(l));
			expect(f.left).toBeCloseTo(f.right, 11);
			expect(f.right).toBeGreaterThanOrEqual(0);
		}
	});

	it('is answered with the chapter’s numbers for the pair of Appendix C', () => {
		const a = secondAnswer(APP_C);
		expect(a.zero).toBeCloseTo(2.5, 13);
		expect(a.plus).toBeCloseTo(2, 13);
		expect(a.minus).toBeCloseTo(Math.sqrt(13), 12);
		expect(a.left).toBeCloseTo(4.5, 12);
		expect(a.appC).toBe(true);
		expect(secondAnswer([{ perp: 0.5, pz: 0 }, APP_C[1]]).appC).toBe(false);
	});
});

describe('the sliders', () => {
	it('land exactly on 0 and ±ln 2 near them', () => {
		expect(NAMED).toEqual([-LN2, 0, LN2]);
		expect(landed(0.69)).toBe(LN2);
		expect(landed(-0.7)).toBe(-LN2);
		expect(landed(0.004)).toBe(0);
		expect(landed(0.5)).toBe(0.5);
		expect(landed(3)).toBe(RAPIDITY.max);
	});

	it('step by the arrow keys’ grid', () => {
		expect(landed(keyed(0, 1, RAPIDITY.key))).toBe(0.05);
		// fourteen steps of 0.05 from rest reach 0.70, which lands on ln 2, and the next leaves it
		let eta = 0;
		for (let i = 0; i < 14; i++) eta = landed(keyed(eta, 1, RAPIDITY.key));
		expect(eta).toBe(LN2);
		expect(landed(keyed(eta, 1, RAPIDITY.key))).toBe(0.75);
		expect(landed(keyed(eta, -1, RAPIDITY.key))).toBe(0.65);
		expect(hundredths(keyed(0.75, -1, MOMENTUM.key), MOMENTUM)).toBe(0.7);
		expect(hundredths(keyed(1.98, 1, GRADIENT.key), GRADIENT)).toBe(2);
		expect(hundredths(-1.53, MOMENTUM)).toBe(-1.5);
		expect(hundredths(-1.5 + 225 * 0.01, MOMENTUM)).toBe(0.75);
	});

	it('the rapidity slider passes ln 2 within its snap', () => {
		// a step of 0.01 from 0.69 is 0.70, which also lands on ln 2 = 0.6931
		expect(landed(0.7)).toBe(LN2);
		expect(landed(0.68)).toBe(0.68);
	});
});

describe('the predictions', () => {
	const at = (s: Partial<OneSettings>): OneSettings => ({
		eta: 0,
		perp: 0,
		gradient: 1,
		mode: 'wave',
		kick: true,
		...s
	});

	it('the first is answered by kicking a slow body and a fast one along +z with one wave', () => {
		let seen = noteFirst(FIRST_START, at({ kick: false }));
		expect(seen.slow).toBeUndefined();
		seen = noteFirst(seen, at({}));
		expect(seen.slow?.gain).toBe(0.125);
		expect(seen.done).toBeUndefined();
		// moving at 0.3c, or at 0.57c, is neither; at 0.1c it is slow, but slower than it was at rest
		seen = noteFirst(seen, at({ eta: Math.atanh(0.3) }));
		seen = noteFirst(seen, at({ eta: 0.65 }));
		expect(seen.fast).toBeUndefined();
		seen = noteFirst(seen, at({ eta: 0.1 }));
		expect(seen.slow?.eta).toBe(0);
		seen = noteFirst(seen, at({ eta: LN2 }));
		expect(seen.done).toBeDefined();
		const a = firstAnswer(seen.done!);
		expect(a.slow.gain).toBe(0.125);
		expect(a.fast.gain).toBe(0.0625);
		expect(a.ratio).toBe(0.5);
		expect(a.atLn2 / a.rest).toBe(0.5);
		// once done it stays done
		expect(noteFirst(seen, at({ gradient: 2 }))).toBe(seen);
	});

	it('the first counts only the wave’s kick, with no sideways motion, at one |∇H| > 0', () => {
		let seen = noteFirst(FIRST_START, at({}));
		for (const s of [
			at({ eta: LN2, mode: 'fixed' }),
			at({ eta: LN2, perp: 0.1 }),
			at({ eta: LN2, kick: false }),
			at({ eta: LN2, gradient: 0 })
		])
			expect(noteFirst(seen, s).done).toBeUndefined();
		// a new |∇H| starts the record again
		seen = noteFirst(seen, at({ gradient: 1.5, eta: LN2 }));
		expect(seen.slow).toBeUndefined();
		expect(seen.fast?.eta).toBe(LN2);
		seen = noteFirst(seen, at({ gradient: 1.5, eta: -0.05 }));
		expect(seen.done?.gradient).toBe(1.5);
		// along −z is not fast along the wave's direction
		let back = noteFirst(FIRST_START, at({}));
		back = noteFirst(back, at({ eta: -LN2 }));
		expect(back.done).toBeUndefined();
		expect(SLOW).toBeLessThan(FAST);
	});

	it('the second is answered by both waves on one pair that moves apart', () => {
		let seen = noteSecond(SECOND_START, 'none', APP_C, false);
		expect(seen).toEqual(SECOND_START);
		seen = noteSecond(seen, 'stop', APP_C, false);
		expect(seen.stop).toBe(true);
		expect(seen.done).toBeUndefined();
		seen = noteSecond(seen, 'none', APP_C, false);
		seen = noteSecond(seen, 'reverse', APP_C, false);
		expect(seen.done).toEqual(APP_C);
		expect(noteSecond(seen, 'none', [APP_C[0], APP_C[0]], true)).toBe(seen);
	});

	it('the second forgets when the pair moves, and asks for a spread to stop', () => {
		let seen = noteSecond(SECOND_START, 'stop', APP_C, false);
		const moved: Lump[] = [{ perp: 0.5, pz: 0 }, APP_C[1]];
		seen = noteSecond(seen, 'none', moved, true);
		expect(seen.stop).toBe(false);
		seen = noteSecond(seen, 'reverse', moved, false);
		expect(seen.done).toBeUndefined();
		seen = noteSecond(seen, 'stop', moved, false);
		expect(seen.done).toEqual(moved);
		// lumps moving together have no spread: the stopping wave moves them as a whole
		const together: Lump[] = [
			{ perp: 0.4, pz: 0 },
			{ perp: 0.4, pz: 0 }
		];
		let none = noteSecond(SECOND_START, 'stop', together, false);
		none = noteSecond(none, 'reverse', together, false);
		expect(none.done).toBeUndefined();
	});
});

describe('the words and the drawing', () => {
	it('write three figures with a true minus sign', () => {
		expect(three(2.5)).toBe('2.50');
		expect(three(-0.225)).toBe('−0.225');
		expect(three(1e-14)).toBe('0');
		expect(two(-0.004)).toBe('0.00');
		expect(two(-0.75)).toBe('−0.75');
		expect(etaTex(LN2)).toBe('\\ln 2 = 0.693');
		expect(etaWords(-LN2)).toBe('−ln 2 = −0.693');
		expect(etaWords(0)).toBe('0');
	});

	it('place q up and to the left and E/c + p_z up and to the right', () => {
		expect(toPlane(1, 0)).toEqual({ pz: -0.5, e: 0.5 });
		expect(toPlane(0, 1)).toEqual({ pz: 0.5, e: 0.5 });
		expect(toPlane(1.25, 1.25)).toEqual({ pz: 0, e: 1.25 });
	});

	it('draw the hyperbola on its shell, to the panel’s edges', () => {
		for (const s of [1, 1.5625, 3.25]) {
			const pts = shellCurve(s);
			expect(pts.length).toBeGreaterThan(10);
			for (const p of pts) {
				expect(p.q * p.w).toBeCloseTo(s, 12);
				expect(onPanel(p.q, p.w)).toBe(true);
			}
			const ends = [pts[0], pts[pts.length - 1]].map((p) => toPlane(p.q, p.w));
			for (const e of ends)
				expect(Math.abs(Math.abs(e.pz) - SPAN / 2) < 1e-9 || Math.abs(e.e - SPAN) < 1e-9).toBe(
					true
				);
		}
		expect(shellCurve(9)).toEqual([]);
	});

	it('pin a point off the panel to its edge', () => {
		const p = pinned(Math.exp(2), Math.exp(-2));
		expect(p.off).toBe(true);
		expect(Math.abs(p.pz)).toBeCloseTo(SPAN / 2, 12);
		const q = pinned(1, 1);
		expect(q).toEqual({ pz: 0, e: 1, off: false });
	});
});
