/**
 * The standard quantum limit's arithmetic (quantum-limit.ts): σ_SQL and the best first reading for a gram watched
 * for a second, the compromise σ_x(τ)/σ_SQL, the tides, h_SQL at 50, 100 and 200 Hz, the touching frequencies of
 * P₀/10, P₀ and 10P₀, the noise never below the limit, the sliders' grids, the words and the two predictions.
 */
import { describe, expect, it } from 'vitest';
import {
	ARM,
	F0,
	FREQUENCY,
	HBAR,
	MASS,
	MIRROR,
	NOTHING_TRIED,
	OPENING_LIGHT,
	OPENING_MASSES,
	POWER,
	SEPARATION,
	SHARP,
	TIME,
	aboutTen,
	bell,
	bestStart,
	compromise,
	endOverSql,
	hSql,
	hertzWords,
	lengthWords,
	lightReading,
	logSpaced,
	massWords,
	massesReading,
	noise,
	noteFirst,
	noteSecond,
	noteTried,
	overSql,
	powerTex,
	powerWords,
	pressurePsd,
	ratioWords,
	shotPsd,
	snapLog,
	spreadAfter,
	sqlWidth,
	startOverSql,
	stepped,
	three,
	tideOne,
	tideTwo,
	timeWords,
	touchAt,
	type Light,
	type Masses
} from './quantum-limit';

const rel = (a: number, b: number) => Math.abs(a - b) / Math.abs(b);

describe('the free mass', () => {
	it('uses ħ = 1.0546 × 10⁻³⁴ J s', () => {
		expect(HBAR).toBe(1.0546e-34);
	});

	it('a gram watched for a second: σ_SQL = 3.247 × 10⁻¹⁶ m, the best first reading 2.296 × 10⁻¹⁶ m', () => {
		expect(rel(sqlWidth(1e-3, 1), 3.247e-16)).toBeLessThan(2e-4);
		expect(rel(bestStart(1e-3, 1), 2.296e-16)).toBeLessThan(2e-4);
		expect(bestStart(1e-3, 1) * Math.SQRT2).toBeCloseTo(sqlWidth(1e-3, 1), 30);
	});

	it('the spread at the best first reading is σ_SQL, and larger at any other', () => {
		for (const [m, tau] of [
			[1e-3, 1],
			[1e-6, 1e-3],
			[10, 100],
			[0.04, 7]
		]) {
			const sql = sqlWidth(m, tau);
			const best = bestStart(m, tau);
			expect(rel(spreadAfter(best, m, tau), sql)).toBeLessThan(1e-12);
			for (const r of [0.03, 0.5, 0.99, 1.01, 2, 30])
				expect(spreadAfter(r * best, m, tau)).toBeGreaterThan(sql);
		}
	});

	it('σ_x/σ_SQL is 1 at the optimum and 7.071 ten times sharper or looser, √(1/200 + 50)', () => {
		expect(endOverSql(1)).toBe(1);
		expect(ratioWords(endOverSql(0.1))).toBe('7.071');
		expect(ratioWords(endOverSql(10))).toBe('7.071');
		expect(endOverSql(0.1)).toBeCloseTo(Math.sqrt(1 / 200 + 50), 12);
	});

	it('the ratio is the compromise curve at σ₀/σ_SQL = r/√2, whose least value is 1 at 1/√2', () => {
		for (const r of logSpaced(0.03, 30, 41)) {
			expect(compromise(startOverSql(r))).toBeCloseTo(endOverSql(r), 12);
			expect(compromise(startOverSql(r))).toBeGreaterThanOrEqual(1 - 1e-12);
		}
		expect(compromise(Math.SQRT1_2)).toBeCloseTo(1, 14);
	});

	it('the reading agrees with the formulas for any mass and time', () => {
		const s: Masses = { q: -1, m: 1, t: 2, xi: -1 };
		const r = massesReading(s);
		expect(r.r).toBeCloseTo(0.1, 14);
		expect(rel(r.sigmaX / r.sql, endOverSql(0.1))).toBeLessThan(1e-12);
		expect(rel(r.start, 0.1 / Math.SQRT2)).toBeLessThan(1e-12);
		expect(rel(r.one, (2 * r.sigmaX) / (0.1 * 100 * 100))).toBeLessThan(1e-12);
	});
});

describe('the tide', () => {
	it('two grams a centimetre apart read for a second: 6.49 × 10⁻¹⁴ and 9.19 × 10⁻¹⁴ s⁻²', () => {
		const r = massesReading(OPENING_MASSES);
		expect(rel(r.one, 6.49e-14)).toBeLessThan(1e-3);
		expect(rel(r.two, 9.19e-14)).toBeLessThan(1e-3);
		expect(powerWords(r.one)).toBe('6.49 × 10⁻¹⁴');
		expect(powerWords(r.two)).toBe('9.19 × 10⁻¹⁴');
		expect(rel(tideTwo(r.sql, 0.01, 1), Math.SQRT2 * tideOne(r.sql, 0.01, 1))).toBeLessThan(1e-14);
	});

	it('the Practice problem: two 10 kg masses 10 cm apart for 100 s, 6.5 and 9.2 × 10⁻²⁰ s⁻²', () => {
		const r = massesReading({ q: 0, m: 1, t: 2, xi: -1 });
		expect(rel(r.sql, 3.25e-17)).toBeLessThan(2e-3);
		expect(rel(r.one, 6.5e-20)).toBeLessThan(2e-3);
		expect(rel(r.two, 9.18e-20)).toBeLessThan(2e-3);
	});
});

describe('the interferometer', () => {
	it('h_SQL = 3.65, 1.83 and 0.914 × 10⁻²⁴ Hz^-1/2 at 50, 100 and 200 Hz for 40 kg and 4 km', () => {
		expect(MIRROR).toBe(40);
		expect(ARM).toBe(4000);
		expect(rel(hSql(50), 3.65e-24)).toBeLessThan(2e-3);
		expect(rel(hSql(100), 1.83e-24)).toBeLessThan(2e-3);
		expect(rel(hSql(200), 0.914e-24)).toBeLessThan(2e-3);
		expect(hSql(50) / hSql(100)).toBeCloseTo(2, 12);
	});

	it('P₀ touches at 100 Hz; P₀/10, P₀ and 10P₀ at 31.6, 100 and 316 Hz, as √P', () => {
		expect(F0).toBe(100);
		expect(three(touchAt(0.1))).toBe('31.6');
		expect(three(touchAt(1))).toBe('100');
		expect(three(touchAt(10))).toBe('316');
		for (const p of [0.01, 0.3, 4, 100]) expect(touchAt(p)).toBeCloseTo(100 * Math.sqrt(p), 9);
	});

	it('at the touching frequency the noise equals h_SQL, and there the two noises are equal', () => {
		for (const p of [0.01, 0.1, 1, 10, 100]) {
			const f = touchAt(p);
			expect(rel(noise(f, p), hSql(f))).toBeLessThan(1e-12);
			expect(rel(shotPsd(p), pressurePsd(f, p))).toBeLessThan(1e-12);
			expect(overSql(f, p)).toBeCloseTo(1, 12);
		}
	});

	it('the noise is never below h_SQL, at any frequency for any power', () => {
		for (const p of logSpaced(0.01, 100, 81))
			for (const f of logSpaced(1, 1e5, 401)) {
				expect(noise(f, p) / hSql(f)).toBeGreaterThanOrEqual(1 - 1e-12);
				expect(rel(overSql(f, p), noise(f, p) / hSql(f))).toBeLessThan(1e-12);
			}
	});

	it('the noise is least against the limit where it touches, and nowhere else', () => {
		for (const p of [0.1, 1, 10]) {
			const fs = logSpaced(10, 1000, 2001);
			const ratios = fs.map((f) => overSql(f, p));
			const i = ratios.indexOf(Math.min(...ratios));
			expect(rel(fs[i], touchAt(p))).toBeLessThan(3e-3);
		}
	});

	it('at 100 Hz only P₀ touches: every other power is above the line', () => {
		expect(overSql(100, 1)).toBe(1);
		for (const p of [0.01, 0.1, 0.5, 0.99, 1.01, 2, 10, 100])
			expect(overSql(100, p)).toBeGreaterThan(1);
		expect(ratioWords(overSql(100, 10))).toBe(ratioWords(overSql(100, 0.1)));
	});

	it('flat at high frequency as P^-1/2, falling as f⁻² at low frequency as P^1/2', () => {
		expect(noise(1e6, 4) / noise(1e6, 1)).toBeCloseTo(0.5, 6);
		expect(noise(0.1, 4) / noise(0.1, 1)).toBeCloseTo(2, 6);
		expect(noise(0.1, 1) / noise(0.2, 1)).toBeCloseTo(4, 4);
	});

	it('the reading agrees', () => {
		const r = lightReading(OPENING_LIGHT);
		expect(r.p).toBe(1);
		expect(r.f).toBe(100);
		expect(r.ratio).toBe(1);
		expect(rel(r.touch, 100)).toBeLessThan(1e-12);
		expect(rel(r.noise, r.limit)).toBeLessThan(1e-12);
		expect(rel(Math.hypot(r.shot, r.pressure), r.noise)).toBeLessThan(1e-12);
	});
});

describe('the sliders', () => {
	it('span 0.03–30, 1 mg–10 kg, 1 ms–100 s, 1 mm–1 m, 0.01–100 P₀ and 10–1000 Hz', () => {
		expect(10 ** SHARP.min).toBeCloseTo(0.03, 12);
		expect(10 ** SHARP.max).toBeCloseTo(30, 10);
		expect([MASS.min, MASS.max, TIME.min, TIME.max]).toEqual([-6, 1, -3, 2]);
		expect([SEPARATION.min, SEPARATION.max]).toEqual([-3, 0]);
		expect([POWER.min, POWER.max, FREQUENCY.min, FREQUENCY.max]).toEqual([-2, 2, 1, 3]);
	});

	it('land on hundredths of a decade, the ends kept exact', () => {
		expect(snapLog(-1.004, SHARP)).toBe(-1);
		expect(snapLog(-2, SHARP)).toBe(SHARP.min);
		expect(snapLog(SHARP.min + 0.003, SHARP)).toBe(SHARP.min);
		expect(snapLog(5, SHARP)).toBe(SHARP.max);
		expect(snapLog(0.0001, POWER)).toBe(0);
		expect(snapLog(Number.NaN, POWER)).toBe(POWER.min);
	});

	it('step a twentieth of a decade by the arrows, a quarter with Shift; Home and End go to the ends', () => {
		let q = 0;
		for (let i = 0; i < 20; i++) q = stepped(q, 'ArrowLeft', false, SHARP)!;
		expect(q).toBe(-1);
		expect(stepped(0, 'ArrowRight', true, POWER)).toBe(0.25);
		expect(stepped(0, 'ArrowLeft', false, POWER)).toBe(-0.05);
		expect(stepped(0.3, 'Home', false, SHARP)).toBe(SHARP.min);
		expect(stepped(0.3, 'End', false, FREQUENCY)).toBe(3);
		expect(stepped(SHARP.min, 'ArrowRight', false, SHARP)).toBe(-1.5);
		expect(stepped(0, 'ArrowRight', false, MASS)).toBe(0.1);
		expect(stepped(0, 'a', false, MASS)).toBeUndefined();
	});
});

describe('the words', () => {
	it('give masses, times, lengths and frequencies in their units', () => {
		expect(massWords(1e-3)).toBe('1 g');
		expect(massWords(1e-6)).toBe('1 mg');
		expect(massWords(10)).toBe('10 kg');
		expect(massWords(10 ** -4.5)).toBe('31.6 mg');
		expect(timeWords(1)).toBe('1 s');
		expect(timeWords(1e-3)).toBe('1 ms');
		expect(timeWords(100)).toBe('100 s');
		expect(lengthWords(0.01)).toBe('1 cm');
		expect(lengthWords(1e-3)).toBe('1 mm');
		expect(lengthWords(1)).toBe('1 m');
		expect(hertzWords(touchAt(0.1))).toBe('31.6 Hz');
	});

	it('write powers of ten', () => {
		expect(powerWords(3.2475e-16)).toBe('3.25 × 10⁻¹⁶');
		expect(powerTex(3.2475e-16)).toBe('3.25 \\times 10^{-16}');
		expect(aboutTen(1.1e13)).toBe('10¹³');
	});

	it('a bell has unit area', () => {
		const h = 0.01;
		let s = 0;
		for (let x = -10; x <= 10; x += h) s += bell(x, 1.3) * h;
		expect(s).toBeCloseTo(1, 6);
	});
});

describe('the predictions', () => {
	const at = (q: number): Masses => ({ ...OPENING_MASSES, q });
	const light = (p: number, f = 2): Light => ({ p, f });

	it('the first is answered once σ₀ is a tenth of the optimum or sharper, and stays answered', () => {
		expect(noteFirst(false, OPENING_MASSES)).toBe(false);
		expect(noteFirst(false, at(-0.95))).toBe(false);
		expect(noteFirst(false, at(1))).toBe(false);
		expect(noteFirst(false, at(-1))).toBe(true);
		expect(noteFirst(false, at(SHARP.min))).toBe(true);
		expect(noteFirst(false, { q: -1, m: 1, t: -3, xi: 0 })).toBe(true);
		expect(noteFirst(true, OPENING_MASSES)).toBe(true);
	});

	it('the second needs, at 100 Hz, a power at most P₀/3 and one at least 3P₀', () => {
		let tried = noteTried(NOTHING_TRIED, light(0));
		expect(noteSecond(false, tried)).toBe(false);
		tried = noteTried(tried, light(-0.5));
		expect(tried).toEqual({ low: true, high: false });
		expect(noteSecond(false, tried)).toBe(false);
		tried = noteTried(tried, light(0.45));
		expect(noteSecond(false, tried)).toBe(false);
		tried = noteTried(tried, light(0.5));
		expect(noteSecond(false, tried)).toBe(true);
	});

	it('powers tried away from 100 Hz do not count', () => {
		let tried = noteTried(NOTHING_TRIED, light(-2, 2.5));
		tried = noteTried(tried, light(2, 1.5));
		expect(tried).toBe(NOTHING_TRIED);
		expect(noteSecond(false, tried)).toBe(false);
		expect(noteTried(tried, light(-0.48, 2))).toEqual({ low: true, high: false });
	});

	it('the second keeps its answer, and a tally left alone is the same object', () => {
		expect(noteSecond(true, NOTHING_TRIED)).toBe(true);
		const t = { low: true, high: false };
		expect(noteTried(t, light(-1))).toBe(t);
	});
});
