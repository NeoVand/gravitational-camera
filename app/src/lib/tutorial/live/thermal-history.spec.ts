/**
 * Chapter 12.2's thermal history, against the builder's checks in the spec (tutorial/sky/universe.md, the try comment
 * for `thermal-history`), written here as numbers worked out afresh: the counts summed from the chapter's table, the
 * cube roots and fourth powers taken by hand, and then the words the readouts show.
 */
import { describe, expect, it } from 'vitest';
import {
	COUNT,
	G_SM,
	G_TODAY,
	G_TWICE,
	REVERSED,
	STEPS,
	TEMPERATURE,
	T_GAMMA,
	T_NU,
	T_PLANCK,
	countOf,
	countText,
	extraText,
	gStar,
	gravitonLine,
	gravitonText,
	neutrinoLine,
	neutrinoPath,
	onePlusZ,
	photonLine,
	photonPath,
	smallText,
	snap,
	stageText,
	stepFrom,
	temperatureOf,
	temperatureText
} from './thermal-history';

/** A value to `n` significant figures. */
const fig = (x: number, n = 3) => Number(x.toPrecision(n));

describe('the counts', () => {
	it('sums the hot Standard Model and today from the chapter’s table', () => {
		const bosons = 2 + 16 + 9 + 1;
		const fermions = 72 + 12 + 6;
		expect(bosons + (7 / 8) * fermions).toBe(G_SM);
		expect(G_TWICE).toBe(213.5);
		expect(2 + (7 / 8) * 6 * (4 / 11)).toBeCloseTo(G_TODAY, 12);
		expect(countText(G_TODAY)).toBe('3.909');
	});

	it('steps down by the species that annihilate, each by its states', () => {
		// top 3·2·2 fermion states; W, Z, Higgs 9 + 1; bottom 12; tau 4; charm 12; confinement leaves photons 2,
		// e 4, μ 4, ν 6 and the pions' 3; muons 4 and pions 3; electrons 4
		const drops = [12 * 0.875, 10, 12 * 0.875, 4 * 0.875, 12 * 0.875];
		let g = G_SM;
		drops.forEach((d, i) => {
			g -= d;
			expect(STEPS[i].after).toBeCloseTo(g, 12);
		});
		expect(STEPS[5].after).toBe(2 + 0.875 * (4 + 4 + 6) + 3);
		expect(STEPS[6].after).toBe(2 + 0.875 * (4 + 6));
		expect(STEPS[7].after).toBe(G_TODAY);
	});

	it('reads g*s at the places the spec names', () => {
		expect(gStar(1e20, 500)).toBe(500);
		expect(gStar(1.5e15, G_SM)).toBe(96.25);
		expect(gStar(1e14, G_SM)).toBe(86.25);
		expect(gStar(3e13, G_SM)).toBe(75.75);
		expect(gStar(1.8e13, G_SM)).toBe(72.25);
		expect(gStar(1e13, G_SM)).toBe(61.75);
		expect(gStar(1.5e12, G_SM)).toBe(17.25);
		expect(gStar(1e11, G_SM)).toBe(10.75);
		expect(gStar(3000, G_SM)).toBe(G_TODAY);
	});
});

describe('the lines', () => {
	it('meet at the left edge, and end at 1 and (4/11)^(1/3) = 0.7138', () => {
		for (const g of [G_SM, G_TWICE, 1000]) {
			expect(photonLine(T_PLANCK, g)).toBeCloseTo(gravitonLine(g), 12);
			expect(neutrinoLine(T_PLANCK, g)).toBeCloseTo(gravitonLine(g), 12);
		}
		expect(photonLine(T_GAMMA, G_SM)).toBe(1);
		expect(neutrinoLine(T_GAMMA, G_SM)).toBeCloseTo(0.71377, 5);
		expect(gravitonLine(G_SM)).toBeCloseTo(0.33207, 5);
	});

	it('keeps the neutrinos with the photons down to 10¹⁰ K, and not after', () => {
		expect(neutrinoLine(2e10, G_SM)).toBe(photonLine(2e10, G_SM));
		expect(neutrinoLine(1e9, G_SM)).toBeCloseTo(0.71377, 5);
		expect(photonLine(1e9, G_SM)).toBe(1);
	});

	it('draws each step as a rise of (before/after)^(1/3)', () => {
		const pts = photonPath(G_SM, TEMPERATURE.hot, TEMPERATURE.cold);
		expect(pts).toHaveLength(2 + 2 * STEPS.length);
		expect(pts[0][0]).toBe(TEMPERATURE.hot);
		expect(pts.at(-1)).toEqual([TEMPERATURE.cold, 1]);
		// the electrons' step: 10.75 → 3.909, a rise by (11/4)^(1/3) = 1.401
		const [a, b] = [pts[pts.length - 3], pts[pts.length - 2]];
		expect(a[0]).toBe(b[0]);
		expect(b[1] / a[1]).toBeCloseTo(1.40102, 5);
		const nu = neutrinoPath(G_SM, TEMPERATURE.hot, TEMPERATURE.cold);
		expect(nu.at(-1)?.[1]).toBeCloseTo(0.71377, 5);
		expect(nu.at(-2)?.[0]).toBe(10);
	});
});

describe('the builder’s checks', () => {
	const cases = [
		{ g: 106.75, Tg: '0.9051 K', dN: '0.0535', omega: '6.62 × 10⁻⁷', h2: '3.01 × 10⁻⁷' },
		{ g: 213.5, Tg: '0.7184 K', dN: '0.0212', omega: '2.63 × 10⁻⁷' },
		{ g: 1000, Tg: '0.4293 K', dN: '0.00271', omega: '3.35 × 10⁻⁸' }
	];
	for (const c of cases) {
		it(`g_hot ${c.g}`, () => {
			const k = countOf(c.g, false);
			expect(gravitonText(k.Tg)).toBe(c.Tg);
			expect(extraText(k.dNeff)).toBe(c.dN);
			expect(smallText(k.omega)).toBe(c.omega);
			if (c.h2) expect(smallText(k.omegaH2)).toBe(c.h2);
		});
	}

	it('agrees with the values worked by hand', () => {
		// 2.7255 (3.90909/106.75)^(1/3) = 2.7255 × 0.332073 = 0.90507; T_ν = 2.7255 × 0.713766 = 1.94537
		const Tg = 0.90507;
		expect(T_NU).toBeCloseTo(1.94537, 5);
		const k = countOf(G_SM, false);
		expect(k.Tg).toBeCloseTo(Tg, 5);
		expect(k.dNeff).toBeCloseTo((8 / 7) * (0.90507 / 1.94537) ** 4, 5);
		expect(fig(k.omega)).toBe(6.62e-7);
		expect(fig(k.omegaH2)).toBe(3.01e-7);
		// doubling divides T_g by 2^(1/3) = 1.259921 and Ω_g by 2^(4/3) = 2.519842
		const twice = countOf(G_TWICE, false);
		expect(twice.Tg).toBeCloseTo(0.90507 / 1.259921, 4);
		expect(twice.omega).toBeCloseTo(6.619e-7 / 2.519842, 9);
	});

	it('reads g*s and 1 + z at 10¹³ K, 10¹¹ K and 3000 K', () => {
		// 10¹³ K: (3.90909/61.75)^(1/3) = 0.398568, 1 + z = 10¹³/(2.7255 × 0.398568) = 9.206 × 10¹²
		expect(countText(gStar(1e13, G_SM))).toBe('61.75');
		expect(smallText(onePlusZ(1e13, G_SM))).toBe('9.21 × 10¹²');
		expect(onePlusZ(1e13, G_SM)).toBeCloseTo(9.2061e12, -9);
		// 10¹¹ K: (4/11)^(1/3) = 0.713766, 1 + z = 10¹¹/1.945370 = 5.140 × 10¹⁰
		expect(countText(gStar(1e11, G_SM))).toBe('10.75');
		expect(smallText(onePlusZ(1e11, G_SM))).toBe('5.14 × 10¹⁰');
		// 3000 K: 3000/2.7255 = 1100.7
		expect(countText(gStar(3000, G_SM))).toBe('3.909');
		expect(smallText(onePlusZ(3000, G_SM))).toBe('1101');
	});

	it('with inflation on, leaves no gravitons', () => {
		const k = countOf(G_SM, true);
		expect(k.Tg).toBeNull();
		expect(gravitonText(k.Tg)).toBe('none');
		expect(extraText(k.dNeff)).toBe('0');
		expect(smallText(k.omega)).toBe('0');
		expect(smallText(k.omegaH2)).toBe('0');
	});
});

describe('the sliders', () => {
	it('holds the exact temperatures at the ends', () => {
		expect(temperatureOf(TEMPERATURE.hot)).toBe(T_PLANCK);
		expect(temperatureOf(TEMPERATURE.cold)).toBe(T_GAMMA);
		expect(temperatureText(T_PLANCK)).toBe('1.42 × 10³² K');
		expect(temperatureText(T_GAMMA)).toBe('2.7255 K');
		expect(temperatureText(temperatureOf(12))).toBe('1.00 × 10¹² K');
	});

	it('steps the reversed temperature by a hundredth and a whole power, and reaches today', () => {
		expect(stepFrom(-12, REVERSED, 1)).toBeCloseTo(-11.99, 9);
		expect(stepFrom(-12, REVERSED, -100)).toBeCloseTo(-13, 9);
		expect(stepFrom(-0.45, REVERSED, 1)).toBe(REVERSED.hi);
		expect(stepFrom(-1, REVERSED, 100)).toBe(REVERSED.hi);
		expect(stepFrom(-32.1, REVERSED, -100)).toBe(REVERSED.lo);
		// the native slider stops at −0.44, which is taken onto today's −0.4354
		expect(snap(-0.44, REVERSED)).toBe(REVERSED.hi);
	});

	it('steps the count by 0.25 and by 10', () => {
		expect(stepFrom(G_SM, COUNT, 1)).toBe(107);
		expect(stepFrom(G_SM, COUNT, 40)).toBe(116.75);
		expect(stepFrom(995, COUNT, 40)).toBe(1000);
		expect(stepFrom(110, COUNT, -40)).toBe(G_SM);
	});

	it('names what has last annihilated', () => {
		expect(stageText(1e20)).toMatch(/before any annihilation/);
		expect(stageText(1e15)).toMatch(/W, the Z and the Higgs/);
		expect(stageText(1.9e15)).toMatch(/beyond the Standard Model/);
		expect(stageText(1e3)).toMatch(/electrons and positrons annihilated, at 5.9 × 10⁹ K/);
	});
});
