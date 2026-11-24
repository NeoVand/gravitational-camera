/**
 * Chapter 12.1's inspiral, against the spec's checks (tutorial/sky/stars.md, the try comment for `inspiral`) and
 * against values worked out here afresh: Kepler's law and the quadrupole time to merger written out again with the
 * tutorial's constants, the time integrated numerically from dd/dt, the separation for a given time found by
 * bisection, and then the words.
 */
import { describe, expect, it } from 'vitest';
import {
	FARTHEST,
	MASS,
	PRESETS,
	TEN_SECONDS,
	frequencyText,
	leastSeparation,
	leaving,
	lengthText,
	mergerTime,
	numText,
	pair,
	presetOf,
	separationFor,
	separationScale,
	snap,
	stepFrom,
	timeParts,
	timeScale,
	timeText,
	track
} from './inspiral';
import { FRAME } from './regime-map';

/** The tutorial's constants (symbols.yaml), written out afresh. */
const G_ = 6.674e-11;
const C_ = 299792458;
const SUN = 1.989e30;
const YR = 365.25 * 24 * 3600;

/** A value to `n` significant figures. */
const fig = (x: number, n = 3) => Number(x.toPrecision(n));

/** Kepler, the speeds and the time, written out again from the chapter's equations. */
function independent(m1: number, m2: number, d: number) {
	const a = m1 * SUN;
	const b = m2 * SUN;
	const omega = Math.pow((G_ * (a + b)) / Math.pow(d, 3), 0.5);
	const f = omega / Math.PI;
	return {
		omega,
		f,
		v1: (omega * d * b) / ((a + b) * C_),
		lambda: C_ / f,
		tau: (5 * Math.pow(C_, 5) * Math.pow(d, 4)) / (256 * Math.pow(G_, 3) * a * b * (a + b))
	};
}

/** The time to merger by integrating dd/dt = −(64/5)G³m₁m₂M/c⁵d³ from d to zero, Simpson's rule in d. */
function integrated(m1: number, m2: number, d: number) {
	const a = m1 * SUN;
	const b = m2 * SUN;
	const k = ((64 / 5) * (Math.pow(G_, 3) * a * b * (a + b))) / Math.pow(C_, 5);
	const n = 2000;
	const h = d / n;
	let s = 0;
	for (let i = 0; i <= n; i++) {
		const x = i * h;
		const w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
		s += (w * x ** 3) / k;
	}
	return (s * h) / 3;
}

describe('the paper’s pair, 30 + 30 solar masses at 2200 km', () => {
	const p = pair(30, 30, 2.2e6);

	it('reads the spec’s figures', () => {
		expect(fig(p.omega)).toBe(27.3);
		expect(fig(p.f)).toBe(8.71);
		expect(fig(p.v1)).toBe(0.1);
		expect(fig(p.v2)).toBe(0.1);
		expect(fig(p.lambda / 1e3)).toBe(34400);
		expect(fig(p.reduced / 1e3)).toBe(5480);
		expect(fig(p.depth)).toBe(0.401);
		expect(fig(p.tau)).toBe(8.77);
	});

	it('agrees with the formulas written out again', () => {
		const q = independent(30, 30, 2.2e6);
		expect(p.omega).toBeCloseTo(q.omega, 10);
		expect(p.f / q.f).toBeCloseTo(1, 12);
		expect(p.v1 / q.v1).toBeCloseTo(1, 12);
		expect(p.lambda / q.lambda).toBeCloseTo(1, 12);
		expect(p.tau / q.tau).toBeCloseTo(1, 12);
		expect(p.depth).toBeCloseTo((2 * Math.PI * 2.2e6) / q.lambda, 12);
	});

	it('has the time that integrating the shrinking gives', () => {
		expect(p.tau / integrated(30, 30, 2.2e6)).toBeCloseTo(1, 9);
	});
});

describe('the white dwarfs, 0.6 + 0.6 solar masses turning every ten minutes', () => {
	const d = PRESETS.dwarfs.d;
	const p = pair(0.6, 0.6, d);

	it('are 113,000 km apart, Kepler’s law for a ten-minute orbit', () => {
		expect(fig(d / 1e3)).toBe(113000);
		// one turn of the separation takes ten minutes
		expect((2 * Math.PI) / p.omega).toBeCloseTo(600, 9);
	});

	it('read the spec’s figures', () => {
		expect(fig(p.f * 1e3)).toBe(3.33);
		expect(fig(p.v1)).toBe(0.00198);
		expect(fig(p.tau / YR)).toBe(244000);
		expect(frequencyText(p.f)).toBe('3.33 mHz');
		expect(timeText(p.tau)).toBe('2.44 × 10⁵ years');
	});
});

describe('the neutron stars, 1.4 + 1.4 solar masses at 500 km', () => {
	const p = pair(1.4, 1.4, 5e5);

	it('read the spec’s figures', () => {
		expect(fig(p.f)).toBe(17.4);
		expect(fig(p.tau)).toBe(230);
		expect(timeText(p.tau)).toBe('230 s');
	});
});

describe('the time to merger', () => {
	it('grows exactly sixteen times when d doubles, at fixed masses', () => {
		for (const [m1, m2, d] of [
			[30, 30, 2.2e6],
			[1.4, 0.6, 3.3e5],
			[0.3, 60, 7.7e7]
		])
			expect(mergerTime(m1, m2, 2 * d) / mergerTime(m1, m2, d)).toBe(16);
	});

	it('gives d = 2270 km for ten seconds at 30 + 30 solar masses, as bisection does', () => {
		const d = separationFor(30, 30, TEN_SECONDS);
		expect(fig(d / 1e3)).toBe(2270);
		let lo = 1e5;
		let hi = 1e7;
		for (let i = 0; i < 200; i++) {
			const mid = (lo + hi) / 2;
			if (independent(30, 30, mid).tau < 10) lo = mid;
			else hi = mid;
		}
		expect(d / lo).toBeCloseTo(1, 10);
		expect(mergerTime(30, 30, d)).toBeCloseTo(10, 9);
	});
});

describe('the range of the separation and the warning', () => {
	it('sets d_min = 3(r_s1 + r_s2): 532 km, 24.8 km and 5.32 km', () => {
		expect(fig(leastSeparation(30, 30) / 1e3)).toBe(532);
		expect(fig(leastSeparation(1.4, 1.4) / 1e3)).toBe(24.8);
		expect(fig(leastSeparation(0.3, 0.3) / 1e3)).toBe(5.32);
		expect(leastSeparation(30, 30)).toBeCloseTo((6 * G_ * 30 * SUN * 2) / C_ ** 2, 6);
	});

	it('warns below 554 km for 30 + 30 solar masses, where v/c passes 0.2', () => {
		// v/c = (GM/d)^{1/2}/2c for equal masses, 0.2 at d = GM/0.16c²
		const edge = (G_ * 60 * SUN) / (0.16 * C_ ** 2);
		expect(fig(edge / 1e3)).toBe(554);
		expect(leaving(pair(30, 30, edge * 1.001))).toBe(false);
		expect(leaving(pair(30, 30, edge * 0.999))).toBe(true);
		expect(leaving(pair(30, 30, 554e3))).toBe(false);
		expect(leaving(pair(30, 30, 553e3))).toBe(true);
		expect(leaving(pair(30, 30, leastSeparation(30, 30)))).toBe(true);
	});

	it('warns when the lighter body alone passes 0.2 c', () => {
		const p = pair(0.3, 60, 3e5);
		expect(p.v1).toBeGreaterThan(0.2);
		expect(p.v2).toBeLessThan(0.2);
		expect(leaving(p)).toBe(true);
	});
});

describe('the sliders', () => {
	it('step the masses in 200 equal log steps from 0.3 to 60', () => {
		expect(10 ** MASS.lo).toBeCloseTo(0.3, 12);
		expect(10 ** MASS.hi).toBeCloseTo(60, 10);
		expect(Math.round((MASS.hi - MASS.lo) / MASS.step)).toBe(200);
	});

	it('step the separation in 400 from d_min to 10⁶ km, and the time over the same range', () => {
		const s = separationScale(30, 30);
		expect(10 ** s.lo / leastSeparation(30, 30)).toBeCloseTo(1, 12);
		expect(10 ** s.hi).toBeCloseTo(FARTHEST, 0);
		expect((s.hi - s.lo) / s.step).toBeCloseTo(400, 9);
		const t = timeScale(30, 30);
		expect(10 ** t.lo / mergerTime(30, 30, leastSeparation(30, 30))).toBeCloseTo(1, 10);
		expect(10 ** t.hi / mergerTime(30, 30, FARTHEST)).toBeCloseTo(1, 10);
		// τ ∝ d⁴: the time's steps are the separation's, four times as long
		expect(t.step / s.step).toBeCloseTo(4, 9);
	});

	it('move one step, ten, and land on the ends exactly', () => {
		const s = separationScale(1.4, 1.4);
		const one = stepFrom(s.lo, s, 1);
		expect(one).toBeCloseTo(s.lo + s.step, 12);
		expect(stepFrom(one, s, 10)).toBeCloseTo(s.lo + 11 * s.step, 12);
		expect(stepFrom(s.lo + 395 * s.step, s, 10)).toBe(s.hi);
		expect(stepFrom(s.lo + 3 * s.step, s, -10)).toBe(s.lo);
		// from between two points of the grid, a step goes to the next one beyond
		const between = s.lo + 7.4 * s.step;
		expect(stepFrom(between, s, 1)).toBeCloseTo(s.lo + 8 * s.step, 12);
		expect(stepFrom(between, s, -1)).toBeCloseTo(s.lo + 7 * s.step, 12);
	});

	it('take a value within half a step of a mark exactly onto it', () => {
		const at = Math.log10(30);
		expect(snap(at + 0.4 * MASS.step, MASS, [at])).toBe(at);
		expect(snap(at + 0.6 * MASS.step, MASS, [at])).toBeCloseTo(at + 0.6 * MASS.step, 12);
	});

	it('know the presets', () => {
		expect(presetOf(30, 30, 2.2e6)).toBe('paper');
		expect(presetOf(1.4, 1.4, 5e5)).toBe('neutron');
		expect(presetOf(0.6, 0.6, PRESETS.dwarfs.d)).toBe('dwarfs');
		expect(presetOf(30, 30, 2.3e6)).toBeUndefined();
	});
});

describe('the pair on the map of the regimes', () => {
	it('stays inside the map’s frame for every mass and separation', () => {
		for (const [m1, m2] of [
			[0.3, 0.3],
			[60, 60],
			[0.3, 60]
		])
			expect(track(m1, m2).inFrame).toBe(true);
		expect(FRAME.lf).toEqual([-9, 19]);
	});

	it('lies inside its near zone even at d_min, where d/(λ/2π) = 4v/c for equal masses', () => {
		const p = pair(30, 30, leastSeparation(30, 30));
		expect(p.depth).toBeCloseTo(4 * p.v1, 12);
		expect(p.depth).toBeLessThan(1);
	});
});

describe('the words', () => {
	it('write the paper’s pair as the spec reads it', () => {
		const p = pair(30, 30, 2.2e6);
		expect(numText(p.omega)).toBe('27.3');
		expect(frequencyText(p.f)).toBe('8.71 Hz');
		expect(numText(p.v1)).toBe('0.100');
		expect(lengthText(p.lambda)).toBe('34,400 km');
		expect(lengthText(p.reduced)).toBe('5480 km');
		expect(lengthText(p.d)).toBe('2200 km');
		expect(numText(p.depth)).toBe('0.401');
		expect(timeText(p.tau)).toBe('8.77 s');
	});

	it('choose the unit of a time that gives a number between 1 and 1000', () => {
		expect(timeParts(999).unit).toBe('s');
		expect(timeParts(1000).unit).toBe('min');
		// the first unit that gives less than a thousand: 300 minutes, 20.0 hours, 41.7 days
		expect(timeText(3600 * 5)).toBe('300 min');
		expect(timeText(3600 * 20)).toBe('20.0 h');
		expect(timeText(3600 * 1000)).toBe('41.7 days');
		expect(timeText(YR * 3)).toBe('3.00 years');
		expect(timeText(YR * 2e6)).toBe('2.00 × 10⁶ years');
		expect(timeText(3.0e-4)).toBe('3.00 × 10⁻⁴ s');
		expect(timeText(2e-4 * 1e-3)).toBe('2.00 × 10⁻⁷ s');
	});

	it('write frequencies and lengths in the unit that suits them', () => {
		expect(frequencyText(1700)).toBe('1.70 kHz');
		expect(frequencyText(9e-5)).toBe('90.0 μHz');
		expect(lengthText(5320)).toBe('5.32 km');
		expect(lengthText(1e9)).toBe('1,000,000 km');
		expect(lengthText(3.3e12)).toBe('3.30 × 10⁹ km');
	});
});
