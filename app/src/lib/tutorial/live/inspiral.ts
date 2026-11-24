/**
 * Chapter 12.1's inspiral. Two compact bodies of masses m₁ and m₂, M = m₁ + m₂, on a circular Newtonian orbit of
 * separation d, losing energy to gravitational waves slowly:
 *
 *   Ω = (GM/d³)^{1/2},   f_GW = Ω/π,   v_i/c = Ω d m_other/(M c),   λ = c/f_GW,
 *
 * and, from chapter 7.7's power and E = −Gm₁m₂/2d, the time to merger (the chapter's eq:inspiral)
 *
 *   τ = (5/256) c⁵d⁴ / G³m₁m₂M,   so that   d = (256 G³m₁m₂M τ / 5c⁵)^{1/4}.
 *
 * The separation runs from d_min = 3(r_s1 + r_s2), r_s = 2Gm/c², where the formula has long failed, to 10⁶ km. The
 * constants are the tutorial's own (symbols.yaml): G = 6.674 × 10⁻¹¹ and M_⊙ = 1.989 × 10³⁰ kg; a year is 365.25 days.
 *
 * The inset is chapter 0.1's map of the regimes (./regime-map.ts, its frame, ticks and edge r = c/2πf, used as they
 * are), with the pair as a dot at its wave frequency and its separation. Positions on the map are powers of ten.
 */
import { FRAME } from './regime-map';

/** The constants, SI. */
export const G = 6.674e-11;
export const C = 299_792_458;
export const M_SUN = 1.989e30;
export const YEAR = 365.25 * 86_400;

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** r_s = 2Gm/c² of a body of m solar masses, m. */
export const schwarzschild = (m: number) => (2 * G * m * M_SUN) / C ** 2;

/** The least separation, 3(r_s1 + r_s2), m: a few times the bodies' size, where the formula has failed. */
export const leastSeparation = (m1: number, m2: number) =>
	3 * (schwarzschild(m1) + schwarzschild(m2));

/** The greatest separation, 10⁶ km. */
export const FARTHEST = 1e9;

/** d⁴, as two squares: doubling d then multiplies it by exactly 16. */
const fourth = (d: number) => d * d * (d * d);

/** The time to merger, s, of masses m₁, m₂ (solar masses) at separation d (m): eq:inspiral. */
export function mergerTime(m1: number, m2: number, d: number): number {
	const a = m1 * M_SUN;
	const b = m2 * M_SUN;
	return ((5 / 256) * C ** 5 * fourth(d)) / (G ** 3 * a * b * (a + b));
}

/** The separation, m, at which masses m₁, m₂ (solar masses) have the time τ (s) left: eq:inspiral solved for d. */
export function separationFor(m1: number, m2: number, tau: number): number {
	const a = m1 * M_SUN;
	const b = m2 * M_SUN;
	return ((256 * G ** 3 * a * b * (a + b) * tau) / (5 * C ** 5)) ** 0.25;
}

export type Pair = {
	/** The masses, solar masses, and the total. */
	m1: number;
	m2: number;
	M: number;
	/** The separation, m. */
	d: number;
	/** Kepler's angular velocity, s⁻¹, and the waves' frequency Ω/π, Hz. */
	omega: number;
	f: number;
	/** Each body's speed about the centre of mass, over c. */
	v1: number;
	v2: number;
	/** The wavelength c/f_GW and the reduced wavelength λ/2π, m, and d over λ/2π. */
	lambda: number;
	reduced: number;
	depth: number;
	/** The time to merger, s. */
	tau: number;
	/** The least separation 3(r_s1 + r_s2), m. */
	dMin: number;
};

/** Everything the readouts show, from the formulas of the chapter only. */
export function pair(m1: number, m2: number, d: number): Pair {
	const M = m1 + m2;
	const omega = Math.sqrt((G * M * M_SUN) / d ** 3);
	const f = omega / Math.PI;
	const lambda = C / f;
	const reduced = lambda / (2 * Math.PI);
	return {
		m1,
		m2,
		M,
		d,
		omega,
		f,
		v1: (omega * d * m2) / (M * C),
		v2: (omega * d * m1) / (M * C),
		lambda,
		reduced,
		depth: d / reduced,
		tau: mergerTime(m1, m2, d),
		dMin: leastSeparation(m1, m2)
	};
}

/** Above this v/c of either body the Newtonian orbit is leaving its range. */
export const RANGE = 0.2;

/** Whether either body moves faster than 0.2 c. */
export const leaving = (p: Pair) => Math.max(p.v1, p.v2) > RANGE;

// --- the sliders --------------------------------------------------------------------------------------------------

/** A log slider: its ends as powers of ten, and its step, the span over a number of equal steps. */
export type Scale = { lo: number; hi: number; step: number };

const scale = (lo: number, hi: number, steps: number): Scale => ({
	lo,
	hi,
	step: (hi - lo) / steps
});

/** Each mass: 0.3 to 60 solar masses in 200 equal log steps. */
export const MASS = scale(Math.log10(0.3), Math.log10(60), 200);

/** The separation: d_min to 10⁶ km in 400 equal log steps. */
export const separationScale = (m1: number, m2: number) =>
	scale(Math.log10(leastSeparation(m1, m2)), Math.log10(FARTHEST), 400);

/** The time to merger over the same range, τ(d_min) to τ(10⁶ km), in 400 equal log steps. */
export const timeScale = (m1: number, m2: number) =>
	scale(
		Math.log10(mergerTime(m1, m2, leastSeparation(m1, m2))),
		Math.log10(mergerTime(m1, m2, FARTHEST)),
		400
	);

/** Page Up and Page Down move ten steps. */
export const PAGE = 10;

/**
 * The slider's next value from v by `by` steps (negative down): to the next point of its grid beyond v, then on along
 * it, kept inside the ends; an end is reached exactly.
 */
export function stepFrom(v: number, s: Scale, by: number): number {
	const at = (v - s.lo) / s.step;
	const eps = 1e-6;
	const n = by > 0 ? Math.floor(at + eps) + by : Math.ceil(at - eps) + by;
	const steps = Math.round((s.hi - s.lo) / s.step);
	if (n >= steps) return s.hi;
	if (n <= 0) return s.lo;
	return s.lo + n * s.step;
}

/** A value from the slider, taken exactly onto a mark it lands within half a step of. */
export function snap(v: number, s: Scale, marks: number[]): number {
	const near = marks.find((m) => Math.abs(m - v) <= s.step / 2);
	return clamp(near ?? v, s.lo, s.hi);
}

// --- the presets --------------------------------------------------------------------------------------------------

/** Chapter 1.8's white dwarfs turn every ten minutes: d = [GM(T/2π)²]^{1/3}, 113,000 km to three figures. */
export const TEN_MINUTES = 600;
export const dwarfSeparation = (M: number) =>
	(G * M * M_SUN * (TEN_MINUTES / (2 * Math.PI)) ** 2) ** (1 / 3);

export type PresetName = 'paper' | 'neutron' | 'dwarfs';
export type Preset = { m1: number; m2: number; d: number };

export const PRESETS: Record<PresetName, Preset> = {
	paper: { m1: 30, m2: 30, d: 2.2e6 },
	neutron: { m1: 1.4, m2: 1.4, d: 5e5 },
	dwarfs: { m1: 0.6, m2: 0.6, d: dwarfSeparation(1.2) }
};

export const PRESET_ORDER: PresetName[] = ['paper', 'neutron', 'dwarfs'];

/** The preset these settings are, if any. */
export function presetOf(m1: number, m2: number, d: number): PresetName | undefined {
	const same = (a: number, b: number) => Math.abs(a / b - 1) < 1e-9;
	return PRESET_ORDER.find(
		(p) => same(PRESETS[p].m1, m1) && same(PRESETS[p].m2, m2) && same(PRESETS[p].d, d)
	);
}

/** Masses worth going to on the mass sliders: the presets' bodies. */
export const MASS_MARKS = [0.6, 1.4, 30];

/** The paper's separation, worth going to on the separation slider, and Section XI's ten seconds on the time's. */
export const PAPER_SEPARATION = 2.2e6;
export const TEN_SECONDS = 10;

/** Above this mass a body is drawn as a black hole: heavier than any neutron star (stated). */
export const HOLE_FROM = 3;

// --- the drawing --------------------------------------------------------------------------------------------------

/**
 * The drawn period of the orbit, s: four seconds for the paper's pair, and the sixth root of the real period's ratio
 * to it, so that a closer pair turns faster, but far slower than the real one; kept within 1 to 30 s.
 */
export const PAPER_OMEGA = pair(30, 30, PAPER_SEPARATION).omega;
export const drawnPeriod = (omega: number) => clamp(4 * (PAPER_OMEGA / omega) ** (1 / 6), 1, 30);

/** A body's drawn radius, in units of the drawn separation: schematic, growing with log m. */
export const drawnRadius = (m: number) =>
	0.05 + 0.065 * ((Math.log10(m) - MASS.lo) / (MASS.hi - MASS.lo));

/**
 * A crest of the waves at radius r (in units of d) lags the pair by Ωr/c = r/2(λ/2π): the angle of crest k, from the
 * line of the bodies at angle φ, is φ − r d/(2λ/2π) + kπ.
 */
export const crestAngle = (phase: number, r: number, depth: number, k: number) =>
	phase - (r * depth) / 2 + k * Math.PI;

/** The pair on the map of the regimes: its wave frequency and its separation, as powers of ten. */
export const onMap = (p: Pair) => ({ lf: Math.log10(p.f), lr: Math.log10(p.d) });

/** The pair's track on the map from d_min to 10⁶ km, a straight line since f ∝ d^{−3/2}, kept inside the frame. */
export function track(m1: number, m2: number) {
	const a = onMap(pair(m1, m2, leastSeparation(m1, m2)));
	const b = onMap(pair(m1, m2, FARTHEST));
	const inFrame = (q: { lf: number; lr: number }) =>
		q.lf >= FRAME.lf[0] && q.lf <= FRAME.lf[1] && q.lr >= FRAME.lr[0] && q.lr <= FRAME.lr[1];
	return { a, b, inFrame: inFrame(a) && inFrame(b) };
}

// --- the words ----------------------------------------------------------------------------------------------------

/** A positive number to `figures` significant figures: its mantissa and power of ten, rounded together. */
function split(a: number, figures: number) {
	let e = Math.floor(Math.log10(a));
	let m = Number((a / 10 ** e).toFixed(figures - 1));
	if (m >= 10) {
		e += 1;
		m /= 10;
	}
	return { m: m.toFixed(figures - 1), e };
}

/** A positive number to three figures, plainly: "8.77", "0.00198", "34,400" (grouped from five figures). */
function plain(a: number, figures = 3): string {
	const { e } = split(a, figures);
	const v = Number(a.toPrecision(figures));
	const text = v.toFixed(Math.max(0, figures - 1 - e));
	if (e < 4) return text;
	return Number(text).toLocaleString('en-US');
}

const SUP = '⁻⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (e: number) =>
	String(e)
		.split('')
		.map((c) => SUP['-0123456789'.indexOf(c)])
		.join('');

/** A number as text and as LaTeX, to three figures: plain from a thousandth to a million, else a power of ten. */
export function numText(a: number, figures = 3): string {
	if (a >= 1e-3 && a < 1e6) return plain(a, figures);
	const { m, e } = split(a, figures);
	return `${m} × 10${sup(e)}`;
}

export function numTex(a: number, figures = 3): string {
	if (a >= 1e-3 && a < 1e6) return plain(a, figures).replace(/,/g, '{,}');
	const { m, e } = split(a, figures);
	return `${m} \\times 10^{${e}}`;
}

/** A frequency in the unit that suits it, to three figures: kHz, Hz, mHz or μHz. */
export function frequencyParts(f: number): { value: number; unit: string; tex: string } {
	const units: [number, string, string][] = [
		[1e3, 'kHz', '\\mathrm{kHz}'],
		[1, 'Hz', '\\mathrm{Hz}'],
		[1e-3, 'mHz', '\\mathrm{mHz}'],
		[1e-6, 'μHz', '\\mu\\mathrm{Hz}']
	];
	for (const [unit, name, tex] of units) {
		const v = Number((f / unit).toPrecision(3));
		if (v >= 1 || unit === 1e-6) return { value: f / unit, unit: name, tex };
	}
	return { value: f, unit: 'Hz', tex: '\\mathrm{Hz}' };
}

export const frequencyText = (f: number) => {
	const p = frequencyParts(f);
	return `${numText(p.value)} ${p.unit}`;
};

export const frequencyTex = (f: number) => {
	const p = frequencyParts(f);
	return `${numTex(p.value)}\\,${p.tex}`;
};

/** A length, m, in km to three figures (m below one km, a power of ten from 10⁷ km). */
export function lengthText(L: number): string {
	if (L < 1e3) return `${numText(L)} m`;
	const km = L / 1e3;
	return `${km < 1e7 ? plain(km) : numText(km)} km`;
}

export function lengthTex(L: number): string {
	if (L < 1e3) return `${numTex(L)}\\,\\mathrm{m}`;
	const km = L / 1e3;
	return `${km < 1e7 ? plain(km).replace(/,/g, '{,}') : numTex(km)}\\,\\mathrm{km}`;
}

/**
 * A time, s, in the unit that gives a number between 1 and 1000, to three figures: s, min, h, days or years, and
 * years beyond that with a power of ten. Below a second it stays in seconds.
 */
export function timeParts(t: number): { value: number; unit: string } {
	const units: [number, string][] = [
		[1, 's'],
		[60, 'min'],
		[3600, 'h'],
		[86_400, 'days'],
		[YEAR, 'years']
	];
	for (const [unit, name] of units) {
		if (Number((t / unit).toPrecision(3)) < 1000) return { value: t / unit, unit: name };
	}
	return { value: t / YEAR, unit: 'years' };
}

/** The value of a time in its unit: plain below a thousand, a power of ten beyond (years only). */
const timeValue = (v: number, tex: boolean) => {
	if (v >= 1e-3 && Number(v.toPrecision(3)) < 1000) return tex ? numTex(v) : numText(v);
	const { m, e } = split(v, 3);
	return tex ? `${m} \\times 10^{${e}}` : `${m} × 10${sup(e)}`;
};

export const timeText = (t: number) => {
	const p = timeParts(t);
	return `${timeValue(p.value, false)} ${p.unit}`;
};

export const timeTex = (t: number) => {
	const p = timeParts(t);
	const unit =
		p.unit === 'days' || p.unit === 'years' ? `\\ \\text{${p.unit}}` : `\\,\\mathrm{${p.unit}}`;
	return `${timeValue(p.value, true)}${unit}`;
};

/** A mass in solar masses, to three figures. */
export const massText = (m: number) => numText(m);
