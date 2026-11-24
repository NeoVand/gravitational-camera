/**
 * Chapter 11.2's spinning hole, against values found here by other means: the horizon as the root of Kerr's Δ found by
 * bisection, the horizon's rate as the frame dragging −g_tφ/g_φφ of the Boyer–Lindquist metric written out afresh, the
 * ergosphere as the root of g_tt, the irreducible mass from the horizon's area, the switch at m = 2 found by bisection,
 * the numbers the chapter and its card print, and the paper's text for the five stated gains.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	ARROW,
	COARSE_STOPS,
	FINE_STOPS,
	FREQUENCY,
	LEAST_IRREDUCIBLE,
	OPENING,
	ORDERS,
	PAPER_GAINS,
	PLACE,
	SPIN,
	TEN_SUNS_RATE,
	arrowWidths,
	bracketSign,
	ergosphere,
	ergosphereOutline,
	horizon,
	horizonRate,
	irreducible,
	meridians,
	paperGainAt,
	percentText,
	placeOf,
	spinAt,
	spinFromPlace,
	spinShare,
	stepSpin,
	tenSunsTurns,
	threshold,
	verdict
} from './spin-and-gain';

/** The SI constants, written out afresh: G, c and the Sun's mass. */
const G_SI = 6.6743e-11;
const C_SI = 299792458;
const M_SUN_SI = 1.98847e30;

/** A root of f between lo and hi, where f changes sign, by bisection. */
function bisect(f: (x: number) => number, lo: number, hi: number): number {
	let a = lo;
	let b = hi;
	const fa = f(a);
	for (let i = 0; i < 200; i++) {
		const m = (a + b) / 2;
		if (f(m) * fa > 0) a = m;
		else b = m;
	}
	return (a + b) / 2;
}

/** Kerr's Boyer–Lindquist metric in GM/c² = 1, c = 1: Σ, Δ and the components g_tt, g_tφ, g_φφ. */
function kerr(chi: number, r: number, theta: number) {
	const s2 = Math.sin(theta) ** 2;
	const sigma = r * r + chi * chi * Math.cos(theta) ** 2;
	const delta = r * r - 2 * r + chi * chi;
	return {
		delta,
		gtt: -(1 - (2 * r) / sigma),
		gtp: (-2 * chi * r * s2) / sigma,
		gpp: (r * r + chi * chi + (2 * chi * chi * r * s2) / sigma) * s2
	};
}

/** The outer root of Δ = r² − 2r + χ², by bisection between 1 and 2. */
const deltaRoot = (chi: number) => bisect((r) => kerr(chi, r, 0).delta, 1, 2 + 1e-12);

const SPINS = [0, 0.1, 0.22, 0.5, 0.7, 0.8, 0.9, 0.95, 0.99, 0.998, 1];

describe('the horizon', () => {
	it('is the outer root of Δ', () => {
		for (const chi of SPINS.slice(0, -1)) expect(horizon(chi)).toBeCloseTo(deltaRoot(chi), 10);
		expect(horizon(1)).toBe(1);
	});

	it('is 11.1’s r_s without spin and half of it at the greatest spin', () => {
		expect(horizon(0)).toBe(2);
		expect(horizon(1)).toBe(1);
	});

	it('turns at the frame dragging −g_tφ/g_φφ there, the same at every latitude', () => {
		for (const chi of [0.3, 0.7, 0.9, 0.99]) {
			// a hair outside the horizon, where g_φφ is finite and the dragging tends to Ω_H
			const r = deltaRoot(chi) * (1 + 1e-9);
			for (const theta of [0.3, 1, Math.PI / 2]) {
				const g = kerr(chi, r, theta);
				expect(-g.gtp / g.gpp).toBeCloseTo(horizonRate(chi), 7);
			}
		}
	});

	it('turns at 0 without spin and c³/2GM at the greatest spin', () => {
		expect(horizonRate(0)).toBe(0);
		expect(horizonRate(1)).toBeCloseTo(0.5, 12);
	});
});

describe('the ergosphere', () => {
	it('is where g_tt vanishes, r₊ at the poles and 2GM/c² on the equator', () => {
		for (const chi of [0.5, 0.9, 0.998]) {
			for (const theta of [0.2, 0.7, 1.2, Math.PI / 2]) {
				const root = bisect((r) => kerr(chi, r, theta).gtt, horizon(chi) - 1e-9, 2.0000001);
				expect(ergosphere(chi, theta)).toBeCloseTo(root, 8);
			}
			expect(ergosphere(chi, 0)).toBeCloseTo(horizon(chi), 12);
			expect(ergosphere(chi, Math.PI / 2)).toBe(2);
		}
	});

	it('is drawn as a closed outline, symmetric about the axis and the equator', () => {
		const pts = ergosphereOutline(0.9, 180);
		expect(pts[0][0]).toBeCloseTo(0, 12);
		expect(pts[0][1]).toBeCloseTo(horizon(0.9), 12);
		expect(pts[45][0]).toBeCloseTo(2, 12);
		expect(pts[180][1]).toBeCloseTo(pts[0][1], 12);
		expect(pts[90][1]).toBeCloseTo(-horizon(0.9), 12);
	});
});

describe('the irreducible mass', () => {
	it('is √(A/16π) from the horizon’s area A = 4π(r₊² + a²)', () => {
		for (const chi of SPINS) {
			const r = horizon(chi);
			const area = 4 * Math.PI * (r * r + chi * chi);
			expect(irreducible(chi)).toBeCloseTo(Math.sqrt(area / (16 * Math.PI)), 12);
		}
	});

	it('is the chapter’s M√((1 + √(1 − χ²))/2)', () => {
		for (const chi of SPINS)
			expect(irreducible(chi)).toBeCloseTo(Math.sqrt((1 + Math.sqrt(1 - chi * chi)) / 2), 12);
	});

	it('leaves the share in spin the chapter prints: 3.4%, 7.4%, 15%, 24% and 29.3%', () => {
		expect(percentText(spinShare(0.5))).toBe('3.4');
		expect(percentText(spinShare(0.7))).toBe('7.4');
		expect(100 * spinShare(0.9)).toBeCloseTo(15, 0);
		expect(100 * spinShare(0.99)).toBeCloseTo(24, 0);
		expect(percentText(spinShare(1))).toBe('29.3');
		expect(spinShare(1)).toBeCloseTo(1 - 1 / Math.sqrt(2), 12);
		expect(LEAST_IRREDUCIBLE).toBeCloseTo(0.70710678, 8);
		expect(spinShare(0)).toBe(0);
	});
});

describe('the card’s table', () => {
	// r₊, GMΩ_H/c³, 2GMΩ_H/c³ and M_irr/M, from outlines-p6b/p11_kerr.py
	const TABLE: [number, number, number, number, number][] = [
		[0.5, 1.866, 0.134, 0.268, 0.966],
		[0.7, 1.714, 0.204, 0.408, 0.926],
		[0.9, 1.436, 0.313, 0.627, 0.847],
		[0.99, 1.141, 0.434, 0.868, 0.755],
		[0.998, 1.063, 0.469, 0.939, 0.729],
		[1, 1, 0.5, 1, 0.707]
	];
	it('agrees to its three decimals', () => {
		for (const [chi, r, rate, two, irr] of TABLE) {
			expect(Math.abs(horizon(chi) - r)).toBeLessThan(5e-4);
			expect(Math.abs(horizonRate(chi) - rate)).toBeLessThan(5e-4);
			expect(Math.abs(threshold(chi, 2) - two)).toBeLessThan(5e-4);
			expect(Math.abs(irreducible(chi) - irr)).toBeLessThan(5e-4);
		}
	});

	it('gives the chapter’s thresholds for m = 2: 0.41, 0.63, 0.87, 0.94 and 1', () => {
		expect(threshold(0.7, 2).toFixed(2)).toBe('0.41');
		expect(threshold(0.9, 2).toFixed(2)).toBe('0.63');
		expect(threshold(0.99, 2).toFixed(2)).toBe('0.87');
		expect(threshold(0.998, 2).toFixed(2)).toBe('0.94');
		expect(threshold(1, 2)).toBeCloseTo(1, 12);
	});

	it('gives 1320 Hz for ten solar masses at χ = 0.7, and the card’s practice problem at 0.9', () => {
		const rate = C_SI ** 3 / (G_SI * 10 * M_SUN_SI);
		expect(TEN_SUNS_RATE).toBeCloseTo(rate, 6);
		expect(Math.round((threshold(0.7, 2) * rate) / (2 * Math.PI) / 10) * 10).toBe(1320);
		expect(tenSunsTurns(0.7)).toBeCloseTo((horizonRate(0.7) * rate) / (2 * Math.PI), 6);
		expect(horizon(0.9).toFixed(3)).toBe('1.436');
		expect(horizonRate(0.9).toFixed(3)).toBe('0.313');
		expect(irreducible(0.9).toFixed(3)).toBe('0.847');
		expect(threshold(0.9, 2).toFixed(3)).toBe('0.627');
	});

	it('meets the chapter’s check for a boson cloud: χ = 0.9, m = 1 turns faster than α = 0.1', () => {
		expect(horizonRate(0.9).toFixed(2)).toBe('0.31');
		expect(verdict(0.9, 0.1, 1)).toBe('amplified');
	});
});

describe('the switch', () => {
	it('at m = 2 and GMω/c³ = 0.5 is at χ = 0.8, where χ = r₊/2', () => {
		const chi = bisect((x) => threshold(x, 2) - 0.5, 0.1, 0.999);
		expect(chi).toBeCloseTo(0.8, 12);
		expect(horizon(0.8)).toBeCloseTo(1.6, 12);
		expect(horizon(0.8) / 2).toBeCloseTo(0.8, 12);
		expect(2 * horizonRate(0.8)).toBeCloseTo(0.5, 12);
	});

	it('answers the try box’s two predictions as the chapter does', () => {
		expect(verdict(0.9, 0.5, 2)).toBe('amplified');
		expect(verdict(0.7, 0.5, 2)).toBe('absorbed');
		expect(verdict(0.79, 0.5, 2)).toBe('absorbed');
		expect(verdict(0.81, 0.5, 2)).toBe('amplified');
		expect(verdict(0.8, 0.5, 2)).toBe('threshold');
	});

	it('reads only the sign of 1 − mΩ_H/ω', () => {
		for (const chi of [0, 0.4, 0.8, 0.95])
			for (const m of ORDERS)
				for (const omega of [0.05, 0.3, 0.6, 1.1]) {
					const b = 1 - (m * horizonRate(chi)) / omega;
					const s = bracketSign(chi, omega, m);
					expect(s).toBe(Math.abs(b) < 1e-9 ? 0 : Math.sign(b));
				}
	});

	it('amplifies nothing without spin, and nothing at ω = 0', () => {
		for (const m of ORDERS)
			for (const omega of [0.01, 0.5, 1.2]) expect(verdict(0, omega, m)).toBe('absorbed');
		expect(verdict(0.9, 0, 2)).toBe('none');
	});

	it('draws the outgoing arrow wider when amplified, narrower when absorbed, equal otherwise', () => {
		expect(arrowWidths(0.9, 0.5, 2)).toEqual({ in: ARROW.in, out: ARROW.wider });
		expect(arrowWidths(0.7, 0.5, 2)).toEqual({ in: ARROW.in, out: ARROW.narrower });
		expect(arrowWidths(0.8, 0.5, 2).out).toBe(ARROW.in);
		expect(ARROW.wider).toBeGreaterThan(ARROW.in);
		expect(ARROW.narrower).toBeLessThan(ARROW.in);
	});
});

describe('the paper’s gains', () => {
	it('are the paper’s words, verbatim, at its five spins', () => {
		const tex = readFileSync('../paper/sections/11-vistas.tex', 'utf8').replace(/\s+/g, ' ');
		expect(tex).toContain(
			'The mode $\\ell = m = 2$ is amplified by at most $0.27\\%$ for a hole of spin $a = 0.7\\,GM/c^2$, by $6.4\\%$ at $0.9$, $56\\%$ at $0.99$ and $91\\%$ at $0.998$, and by $138\\%$ in the limit of the greatest spin.'
		);
		expect(PAPER_GAINS.map((g) => g.chi)).toEqual([0.7, 0.9, 0.99, 0.998, 1]);
		expect(PAPER_GAINS.map((g) => g.gain)).toEqual(['0.27%', '6.4%', '56%', '91%', '138%']);
		expect(paperGainAt(0.9)).toBe('6.4%');
		expect(paperGainAt(0.8)).toBeUndefined();
	});
});

describe('the controls', () => {
	it('open with the wave absorbed, settling no prediction', () => {
		expect(OPENING).toEqual({ chi: 0.5, omega: 0.5, m: 2 });
		// the wave the figure opens with is not amplified
		expect(verdict(OPENING.chi, OPENING.omega, OPENING.m)).toBe('absorbed');
		expect(SPIN.max).toBe(0.998);
		expect(FREQUENCY.max).toBe(1.2);
	});

	it('place the spin by 2 − r₊, and come back from the place', () => {
		expect(placeOf(0)).toBe(0);
		expect(PLACE.max).toBeCloseTo(2 - horizon(0.998), 12);
		for (const chi of SPINS) expect(spinAt(placeOf(chi))).toBeCloseTo(chi, 9);
		// the paper's two fastest spins lie a tenth of the track apart
		expect((placeOf(0.998) - placeOf(0.99)) / PLACE.max).toBeGreaterThan(0.08);
	});

	it('hold a dragged spin on the paper’s spins and at three decimals', () => {
		for (const g of PAPER_GAINS.slice(0, 4)) {
			expect(spinFromPlace(placeOf(g.chi))).toBe(g.chi);
			expect(spinFromPlace(placeOf(g.chi) + PLACE.step / 2)).toBe(g.chi);
		}
		const v = spinFromPlace(0.3);
		expect(Math.round(v * 1000) / 1000).toBe(v);
		expect(spinFromPlace(-1)).toBe(0);
		expect(spinFromPlace(5)).toBe(0.998);
	});

	it('step the spin by hundredths, then thousandths, and Page by tenths', () => {
		expect(stepSpin(0.9, 1)).toBe(0.91);
		expect(stepSpin(0.8, -1)).toBe(0.79);
		expect(stepSpin(0.99, 1)).toBe(0.991);
		expect(stepSpin(0.998, 1)).toBe(0.998);
		expect(stepSpin(0, -1)).toBe(0);
		expect(stepSpin(0.853, 1)).toBe(0.86);
		expect(stepSpin(0.9, 1, true)).toBe(0.99);
		expect(stepSpin(0.99, 1, true)).toBe(0.998);
		expect(stepSpin(0.75, -1, true)).toBe(0.7);
		expect(FINE_STOPS.at(-1)).toBe(0.998);
		expect(COARSE_STOPS.at(-1)).toBe(0.998);
		for (const s of FINE_STOPS) expect(s).toBeLessThanOrEqual(SPIN.max);
	});
});

describe('the surface marks', () => {
	it('show only the near side, half the meridians at a time', () => {
		for (const phase of [0.1, 1, 2.5, 4]) {
			const ms = meridians(phase);
			expect(ms.length).toBeGreaterThanOrEqual(2);
			expect(ms.length).toBeLessThanOrEqual(4);
			for (const m of ms) {
				expect(m.facing).toBeGreaterThan(0);
				expect(Math.abs(m.across)).toBeLessThanOrEqual(1);
			}
		}
	});

	it('move to the right on the near side as the phase grows', () => {
		const a = meridians(1.5)[0];
		const b = meridians(1.5 + 0.01).find((m) => Math.abs(m.across - a.across) < 0.05)!;
		expect(b.across).toBeGreaterThan(a.across);
	});
});
