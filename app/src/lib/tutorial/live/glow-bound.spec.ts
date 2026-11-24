/**
 * Chapter 10.3's bound on every glow, against closed forms written out afresh, an independent quadrature, the
 * reference's own results (reference/gravcam/materials.py and glowbounds.py, exported into ./glow-bound-data.ts), the
 * paper's tab:materials and its shares of the bound, and the numbers the chapter prints.
 */
import { describe, expect, it } from 'vitest';
import {
	CHOICES,
	COUNT_CONSTANT,
	CUSTOM_RANGE,
	GPA,
	MATERIALS,
	OPENING,
	OPENING_CUSTOM,
	PEAK_COUNT,
	PEAK_POWER,
	PLACEHOLDER,
	POWER_CONSTANT,
	REFERENCE,
	ROOM,
	THZ,
	axisFor,
	build,
	canFollow,
	channelWeight,
	countBound,
	cuts,
	fAxisFor,
	friction,
	glow,
	glowDensity,
	hasPairs,
	integrate,
	lineHeight,
	moveCentre,
	niceStep,
	percent,
	powerBound,
	qualityOf,
	samples,
	setWidth,
	shownShare,
	stepWeight,
	stepWidth,
	tauAt,
	type Channel,
	type Choice,
	type MaterialId
} from './glow-bound';

// the constants written out again, SI
const G = 6.6743e-11;
const HB = 1.054571817e-34;
const KB = 1.380649e-23;
const C = 299792458;
const SIGMA = 5.670374419e-8;
const ZETA3 = 1.2020569031595942;

const ids = CHOICES.filter((c): c is MaterialId => c !== 'custom');
const at = (c: Choice, T = ROOM, pairs = true, follow = false) =>
	glow(build(c, OPENING_CUSTOM, T, { pairs, follow }).all, T);

/** Composite Simpson's rule with n (even) pieces: a quadrature that shares nothing with the module's. */
function simpson(f: (x: number) => number, a: number, b: number, n = 200000): number {
	const h = (b - a) / n;
	let s = f(a) + f(b);
	for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
	return (s * h) / 3;
}

describe('the peaks and eq:glow-bound', () => {
	it('x³/(e^x − 1) is at most 1.4214 and x²/(e^x − 1) at most 0.6476, found again on a fine grid', () => {
		let p3 = 0;
		let p2 = 0;
		for (let x = 0.001; x < 12; x += 1e-5) {
			p3 = Math.max(p3, x ** 3 / Math.expm1(x));
			p2 = Math.max(p2, x ** 2 / Math.expm1(x));
		}
		expect(PEAK_POWER).toBeCloseTo(p3, 9);
		expect(PEAK_COUNT).toBeCloseTo(p2, 9);
		expect(PEAK_POWER.toFixed(4)).toBe('1.4214');
		expect(PEAK_COUNT.toFixed(4)).toBe('0.6476');
	});

	it('gives the paper’s constants 11.37 and 5.18', () => {
		expect(POWER_CONSTANT.toFixed(2)).toBe('11.37');
		expect(COUNT_CONSTANT.toFixed(2)).toBe('5.18');
	});

	it('the bound is reached by a narrow line at the peak, and no line of the same weight exceeds it', () => {
		const T = ROOM;
		const w = 18 * GPA;
		const fPeak = (2.8214393721 * KB * T) / (2 * Math.PI * HB);
		// a line of Q = 10⁴ loses a few parts in 10⁴ to its wings
		const best = glow(
			build('custom', { weight: w, f0: fPeak, width: fPeak / 1e4 }, T, OPENING).all,
			T
		);
		expect(best.powerShare).toBeGreaterThan(0.999);
		expect(best.powerShare).toBeLessThan(1.00001);
		for (const x of [0.5, 1, 2, 2.6, 3.1, 4, 6.54, 10]) {
			const f0 = (x * KB * T) / (2 * Math.PI * HB);
			for (const Q of [1, 10, 1000]) {
				const g = glow(build('custom', { weight: w, f0, width: f0 / Q }, T, OPENING).all, T);
				expect(g.powerShare).toBeLessThan(1);
				expect(g.countShare).toBeLessThan(1 + 1e-6);
			}
		}
	});

	it('30 GPa at 293 K radiates at most 5.6 × 10⁻³⁵ W m⁻³ (the paper and the chapter)', () => {
		expect(powerBound(30 * GPA, 293)).toBeCloseTo(5.6e-35, 36);
		expect(countBound(30 * GPA, 293)).toBeCloseTo(
			(8 * PEAK_COUNT * G * 30e9 * (KB * 293) ** 2) / (HB ** 2 * C ** 5),
			6
		);
	});
});

describe('the channels keep 4.5’s sum rule', () => {
	/** (2/π)∫₀^∞ Re η dω, by Simpson in ω = tan θ / s, so that the whole axis fits in θ < π/2. */
	function weightOf(ch: Channel, s: number, T = ROOM): number {
		const f = (t: number) => {
			if (t >= Math.PI / 2) return 0;
			const w = Math.tan(t) / s;
			return (friction(ch, w, T) / s) * (1 + Math.tan(t) ** 2);
		};
		return (2 / Math.PI) * simpson(f, 0, Math.PI / 2 - 1e-12, 400000);
	}

	it('a line of any Q holds its weight', () => {
		for (const Q of [1, 3, 30]) {
			const ch: Channel = { kind: 'line', weight: 1e10, omega0: 1e14, width: 1e14 / Q };
			expect(weightOf(ch, 1e-14) / channelWeight(ch, ROOM)).toBeCloseTo(1, 4);
		}
	});

	it('the electrons, water’s Maxwell elements and its shear-inertia lines hold theirs', () => {
		const cu = MATERIALS.copper.channels[0];
		expect(weightOf(cu, cu.kind === 'drude' ? cu.tau : 1) / channelWeight(cu, ROOM)).toBeCloseTo(
			1,
			4
		);
		for (const ch of MATERIALS.water.channels) {
			const s = ch.kind === 'maxwell' ? ch.tau : ch.kind === 'inertia' ? ch.tau0 : 1;
			expect(weightOf(ch, s) / channelWeight(ch, ROOM)).toBeCloseTo(1, 4);
		}
	});

	it('the electrons’ weight is n m v_F²/5 = (2/5) n E_F, with E_F = ħ²(3π²n)^(2/3)/2m', () => {
		const m = 9.1093837015e-31;
		for (const id of ['copper', 'iron'] as const) {
			const ch = MATERIALS[id].channels[0];
			if (ch.kind !== 'drude' && ch.kind !== 'ceiling') throw new Error('not electrons');
			const EF = (HB ** 2 * (3 * Math.PI ** 2 * ch.n) ** (2 / 3)) / (2 * m);
			expect(ch.weight / ((2 / 5) * ch.n * EF)).toBeCloseTo(1, 8);
		}
		// the chapter's 38.2 GPa is for n = 8.47 × 10²⁸; the table's lattice constant gives 8.50 × 10²⁸ and 38.4
		expect(channelWeight(MATERIALS.copper.channels[0], ROOM) / GPA).toBeCloseTo(38.4, 1);
		expect(channelWeight(MATERIALS.iron.channels[0], ROOM) / GPA).toBeCloseTo(121, 0);
	});

	it('the pairs’ weight tends to the classical 2nk_BT when hot', () => {
		const p = MATERIALS.silicon.pairs!;
		if (p.kind !== 'pairs') throw new Error('not pairs');
		const T = 1e6;
		expect(channelWeight(p, T) / (2 * p.n * KB * T)).toBeCloseTo(1, 4);
		// and as the reference found it at 293 K, by scipy's quad
		const own = REFERENCE.silicon.withPairs.weight! - REFERENCE.silicon.alone.weight!;
		expect(channelWeight(p, ROOM) / own).toBeCloseTo(1, 6);
	});

	it('the plot’s share of the area is a fraction that reaches 1', () => {
		const chs = build('silica', OPENING_CUSTOM, ROOM, OPENING).all;
		expect(shownShare(chs, 2 * Math.PI * 50 * THZ, ROOM)).toBeCloseTo(1, 10);
		expect(shownShare(chs, 2 * Math.PI * 13.5 * THZ, ROOM)).toBeCloseTo(0.5, 10);
		expect(
			shownShare(build('placeholder', OPENING_CUSTOM, ROOM, OPENING).all, 1e14, ROOM)
		).toBeNaN();
	});
});

describe('the glow, against closed forms and an independent quadrature', () => {
	it('the placeholder: P/V = 4ασ_SB T⁴, η_eff = 10⁻³ Pa s and Ē = 2.701 k_BT', () => {
		for (const T of [100, 293, 5500]) {
			const g = at('placeholder', T);
			const alpha = (16 * Math.PI * G * PLACEHOLDER) / C ** 3;
			expect(g.power / (4 * alpha * SIGMA * T ** 4)).toBeCloseTo(1, 6);
			expect(g.etaEff / PLACEHOLDER).toBeCloseTo(1, 9);
			expect(g.meanKT).toBeCloseTo(Math.PI ** 4 / 15 / (2 * ZETA3), 6);
			expect(g.powerShare).toBeNaN();
		}
	});

	it('iron’s ceiling W/2ω: P/V = (16Għ/πc⁵)(W/2)·2ζ(3)(k_BT/ħ)³ and Ē = 2ζ(3)/(π²/6) k_BT', () => {
		const ch = MATERIALS.iron.channels[0];
		const g = at('iron', ROOM, false);
		const P = ((16 * G * HB) / (Math.PI * C ** 5)) * (ch.kind === 'ceiling' ? ch.weight / 2 : 0);
		expect(g.power / (P * 2 * ZETA3 * ((KB * ROOM) / HB) ** 3)).toBeCloseTo(1, 7);
		expect(g.meanKT).toBeCloseTo((2 * ZETA3) / (Math.PI ** 2 / 6), 7);
	});

	it('silica’s flat band, by Simpson’s rule in x', () => {
		const ch = MATERIALS.silica.channels[0];
		if (ch.kind !== 'band') throw new Error('not a band');
		const top = (HB * ch.omegaMax) / (KB * ROOM);
		const i3 = simpson((x) => (x ? x ** 3 / Math.expm1(x) : 0), 0, top);
		const i2 = simpson((x) => (x ? x ** 2 / Math.expm1(x) : 0), 0, top);
		const eta = (0.5 * Math.PI * ch.weight) / ch.omegaMax;
		const g = at('silica');
		expect(
			g.power / (((16 * G * HB) / (Math.PI * C ** 5)) * eta * ((KB * ROOM) / HB) ** 4 * i3)
		).toBeCloseTo(1, 8);
		expect(g.meanKT).toBeCloseTo(i3 / i2, 8);
	});

	it('the glow density integrates to the power', () => {
		const chs = build('water', OPENING_CUSTOM, ROOM, OPENING).all;
		const top = (60 * KB * ROOM) / HB;
		const own = simpson(
			(w) => (w ? chs.reduce((s, ch) => s + glowDensity(friction(ch, w, ROOM), w, ROOM), 0) : 0),
			0,
			top
		);
		expect(own / at('water').power).toBeCloseTo(1, 6);
	});

	it('the integrals are cut at every feature', () => {
		const line = MATERIALS.silicon.channels[0];
		if (line.kind !== 'line') throw new Error('not a line');
		const c = cuts([line], 0, 1e15);
		expect(c).toContain(line.omega0);
		expect(c[0]).toBe(0);
		expect(c[c.length - 1]).toBe(1e15);
		expect(integrate(() => 1, c)).toBeCloseTo(1e15, -2);
	});
});

describe('the reference’s own results (materials.py, glowbounds.py)', () => {
	for (const id of ids) {
		for (const pairs of [true, false]) {
			it(`${id}${pairs ? ', with its pairs' : ', its main channel alone'}`, () => {
				const r = REFERENCE[id][pairs ? 'withPairs' : 'alone'];
				const g = at(id, ROOM, pairs);
				expect(g.power / r.power).toBeCloseTo(1, 6);
				expect(g.number / r.number).toBeCloseTo(1, 6);
				expect(g.etaEff / r.etaEff).toBeCloseTo(1, 6);
				expect(g.meanKT / r.meanKT).toBeCloseTo(1, 6);
				if (r.weight !== undefined && r.powerShare !== undefined && r.countShare !== undefined) {
					// the reference integrates the weight only to x = 60, which leaves out 1.1% of copper's electrons
					// and 3.2% of water's fast Maxwell element; against its own weight the shares agree
					expect(g.power / powerBound(r.weight, ROOM) / r.powerShare).toBeCloseTo(1, 6);
					expect(g.count / countBound(r.weight, ROOM) / r.countShare).toBeCloseTo(1, 6);
					const tails = id === 'copper' || id === 'water';
					expect(Math.abs(g.weight / r.weight - 1)).toBeLessThan(tails ? 0.04 : 1e-6);
				}
			});
		}
	}
});

describe('the paper’s tab:materials, row by row, and its shares of the bound', () => {
	/** η_eff in 10⁻⁴ Pa s, P/V in 10⁻³⁵ W m⁻³ and Ē/k_BT, as printed (iron's first two are upper bounds). */
	const TABLE: Record<MaterialId, [string, string, string]> = {
		copper: ['1.3', '2.8', '1.4'],
		iron: ['6', '12', '1.5'],
		silicon: ['1.6', '3.4', '2.6'],
		diamond: ['0.12', '0.25', '6.4'],
		silica: ['2.3', '4.8', '2.1'],
		water: ['0.54', '1.1', '1.7'],
		placeholder: ['10', '21', '2.70']
	};
	/** A number to as many significant figures as the printed one has. */
	const like = (x: number, printed: string) =>
		String(Number(x.toPrecision(printed.replace(/^0\.0*/, '').replace('.', '').length)));
	for (const id of ids) {
		it(id, () => {
			const g = at(id);
			const [eta, P, E] = TABLE[id];
			expect(like(g.etaEff / 1e-4, eta)).toBe(eta);
			expect(like(g.power / 1e-35, P)).toBe(P);
			expect(g.meanKT.toFixed(E.length - 2)).toBe(E);
		});
	}

	it('iron is at its ceiling, ≤ 6 and ≤ 12', () => {
		const g = at('iron');
		expect(g.etaEff / 1e-4).toBeLessThanOrEqual(6);
		expect(g.power / 1e-35).toBeLessThanOrEqual(12.5);
	});

	it('silicon 98%, silica 69% and diamond 16% of the power their weight allows', () => {
		expect(Math.round(100 * at('silicon').powerShare)).toBe(98);
		expect(Math.round(100 * at('silica').powerShare)).toBe(69);
		expect(Math.round(100 * at('diamond').powerShare)).toBe(16);
	});

	it('copper and water within a point of the paper’s 39% and 40% (whose weights stop at x = 60)', () => {
		expect(Math.abs(100 * at('copper').powerShare - 39)).toBeLessThan(1);
		expect(Math.abs(100 * at('water').powerShare - 40)).toBeLessThan(1);
	});
});

describe('the chapter’s numbers', () => {
	it('silicon’s line alone: 1.59, 3.31, 2.55 k_BT and 98.5%; diamond’s line alone 28%', () => {
		const si = at('silicon', ROOM, false);
		expect((si.etaEff / 1e-4).toFixed(2)).toBe('1.59');
		expect((si.power / 1e-35).toFixed(2)).toBe('3.31');
		expect(si.meanKT.toFixed(2)).toBe('2.55');
		expect((100 * si.powerShare).toFixed(1)).toBe('98.5');
		expect(Math.round(100 * at('diamond', ROOM, false).powerShare)).toBe(28);
	});

	it('silica: 2.31, 4.80, 2.14 k_BT and 69.2%', () => {
		const g = at('silica');
		expect((g.etaEff / 1e-4).toFixed(2)).toBe('2.31');
		expect((g.power / 1e-35).toFixed(2)).toBe('4.80');
		expect(g.meanKT.toFixed(2)).toBe('2.14');
		expect((100 * g.powerShare).toFixed(1)).toBe('69.2');
	});

	it('iron’s ceiling: 5.9, 12.2 and 1.46 k_BT; copper’s electrons alone 37.5%', () => {
		const fe = at('iron', ROOM, false);
		expect((fe.etaEff / 1e-4).toFixed(1)).toBe('5.9');
		expect((fe.power / 1e-35).toFixed(1)).toBe('12.2');
		expect(fe.meanKT.toFixed(2)).toBe('1.46');
		expect((100 * at('copper', ROOM, false).powerShare).toFixed(1)).toBe('37.5');
	});

	it('the placeholder would need 112 GPa at 293 K, 2.09 TPa at 5500 K, and 1.70 TPa to match its count', () => {
		const need = (T: number) => at('placeholder', T).power / powerBound(1, T);
		const needN = (T: number) => at('placeholder', T).count / countBound(1, T);
		expect((need(293) / GPA).toFixed(0)).toBe('112');
		expect((need(5500) / 1e12).toFixed(2)).toBe('2.09');
		expect((needN(5500) / 1e12).toFixed(2)).toBe('1.70');
	});

	it('copper heated to 1500 K with its collision rate ∝ T: the electrons’ power as T³ and count as T²', () => {
		const a = at('copper', 293, false, true);
		const b = at('copper', 1500, false, true);
		expect(b.power / a.power).toBeCloseTo((1500 / 293) ** 3, 6);
		expect(b.count / a.count).toBeCloseTo((1500 / 293) ** 2, 6);
		// with a fixed collision time it does not
		expect(at('copper', 1500, false).count / at('copper', 293, false).count).not.toBeCloseTo(
			(1500 / 293) ** 2,
			0
		);
	});
});

describe('the controls', () => {
	it('opens on silicon at 293 K with its pairs', () => {
		expect(OPENING).toEqual({ choice: 'silicon', T: 293, pairs: true, follow: false });
		expect(
			hasPairs('silicon') && hasPairs('copper') && hasPairs('iron') && hasPairs('diamond')
		).toBe(true);
		expect(
			hasPairs('silica') || hasPairs('water') || hasPairs('placeholder') || hasPairs('custom')
		).toBe(false);
		expect(canFollow('copper')).toBe(true);
		expect(canFollow('iron')).toBe(false);
	});

	it('the collision time shortens as 1/T only when asked', () => {
		expect(tauAt(2.5e-14, 1465, true)).toBeCloseTo(5e-15, 25);
		expect(tauAt(2.5e-14, 1465, false)).toBe(2.5e-14);
		const ch = build('copper', OPENING_CUSTOM, 586, { pairs: false, follow: true }).main[0];
		expect(ch.kind === 'drude' && ch.tau).toBeCloseTo(1.25e-14, 25);
	});

	it('the custom line stays within its ranges', () => {
		const c = OPENING_CUSTOM;
		expect(qualityOf(c)).toBeCloseTo(20, 12);
		expect(moveCentre(c, 1e20).f0).toBe(CUSTOM_RANGE.f0.high);
		expect(moveCentre(c, 0).f0).toBe(CUSTOM_RANGE.f0.low);
		expect(moveCentre(c, 80 * THZ, 50 * THZ).f0).toBe(50 * THZ);
		// a centre moved low keeps Q ≥ 1
		expect(qualityOf(moveCentre(c, 1 * THZ))).toBeGreaterThanOrEqual(1);
		expect(qualityOf(setWidth(c, 1e9))).toBeCloseTo(1000, 9);
		expect(stepWidth(stepWidth(c, 1), -1).width).toBeCloseTo(c.width, 3);
		expect(stepWeight(c, 1).weight).toBe(19 * GPA);
		expect(stepWeight({ ...c, weight: GPA }, -1).weight).toBe(GPA);
		expect(lineHeight(c)).toBeCloseTo(18e9 / (2 * Math.PI * 1.5e12), 9);
	});

	it('the frequency axis always reaches x = 7, and no further than x = 17.5', () => {
		for (let T = 100; T <= 6000; T *= 1.01) {
			const top = fAxisFor(T) * THZ;
			const x = (2 * Math.PI * HB * top) / (KB * T);
			expect(x).toBeGreaterThanOrEqual(7);
			expect(x).toBeLessThanOrEqual(17.6);
		}
		expect(fAxisFor(293)).toBe(50);
		expect(fAxisFor(100)).toBe(20);
		expect(fAxisFor(6000)).toBe(1000);
	});

	it('the vertical axes hold their curve', () => {
		expect(niceStep(0.0031)).toBeCloseTo(0.005, 12);
		for (const v of [0.032, 9.5e-4, 3.4e-4, 7.7e-50, 1]) {
			const a = axisFor(v);
			expect(a.top).toBeGreaterThanOrEqual(v);
			expect(a.top / a.step).toBeLessThanOrEqual(6);
		}
	});

	it('the drawing’s samples resolve a narrow line', () => {
		const chs = build('silicon', OPENING_CUSTOM, ROOM, OPENING).all;
		const line = chs[0];
		if (line.kind !== 'line') throw new Error('not a line');
		const s = samples(chs, 2 * Math.PI * 50 * THZ);
		expect(s).toContain(line.omega0);
		const peak = Math.max(...s.map((w) => friction(line, w, ROOM)));
		expect(peak / (line.weight / line.width)).toBeCloseTo(1, 6);
	});

	it('the glow drawn is finite everywhere, even under iron’s ceiling at zero frequency', () => {
		const chs = build('iron', OPENING_CUSTOM, ROOM, OPENING).all;
		for (const w of samples(chs, 2 * Math.PI * 50 * THZ)) {
			const d = glowDensity(
				chs.reduce((s, ch) => s + friction(ch, w, ROOM), 0),
				w,
				ROOM
			);
			expect(Number.isFinite(d)).toBe(true);
		}
		expect(glowDensity(Infinity, 0, ROOM)).toBe(0);
	});

	it('percentages', () => {
		expect(percent(0.98205)).toBe('98.2');
		expect(percent(0.0561)).toBe('5.61');
		expect(percent(1)).toBe('100.0');
	});
});
