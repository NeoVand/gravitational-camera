/**
 * Chapter 7.3's ball of free dust, Ricci against Weyl. A small ball of free test masses sits in a medium of density
 * ρ and pressure p, with a beam of light of energy flux F through it along n̂ and a point mass M at the distance d.
 * Everything is in SI units, in the ball's own falling frame, which does not turn. The tide is the sum of a Ricci
 * part, set by the energy and stress at the ball (the chapter's eq:ricci-tide),
 *
 *   𝓔^Ricci_ij = (4πG/3)(ρ + T_kk/c²) δ_ij − (4πG/c²)(T_ij − ⅓ δ_ij T_kk),
 *
 * and a trace-free Weyl part, set by the mass outside, (GM/d³)(δ_ij − 3 m̂_i m̂_j) with m̂ toward the mass. A grain
 * released at rest at ξ₀ is at ξ(t) = ξ₀ − ½ 𝓔 ξ₀ t² a little later, and a ball's volume changes at the rate
 * V̈/V = −tr 𝓔. A negative principal value is a stretch, a positive one a squeeze.
 */

/** Newton's constant, m³ kg⁻¹ s⁻² (CODATA 2018). */
export const G = 6.6743e-11;
/** The speed of light, m s⁻¹. */
export const C = 299792458;

/** A symmetric table of three rows, in the slice's axes: x toward the mass, y up the page, z out of the slice. */
export type Mat3 = [[number, number, number], [number, number, number], [number, number, number]];
export type Vec3 = [number, number, number];

export const zero = (): Mat3 => [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

export const identity = (): Mat3 => [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1]
];

/** n̂ n̂: the outer product of a vector with itself. */
export const outer = (n: Vec3): Mat3 =>
	[0, 1, 2].map((i) => [0, 1, 2].map((j) => n[i] * n[j])) as Mat3;

/** a A + b B. */
export function combine(a: number, A: Mat3, b = 0, B: Mat3 = zero()): Mat3 {
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => a * A[i][j] + b * B[i][j])) as Mat3;
}

export const sum = (...ms: Mat3[]): Mat3 => ms.reduce((s, m) => combine(1, s, 1, m), zero());

export const trace = (m: Mat3) => m[0][0] + m[1][1] + m[2][2];

/** The split of chapter 1.5: a part that changes the size, (tr/3) δ, and a trace-free part that changes the shape. */
export function split(m: Mat3) {
	const tr = trace(m);
	const even = combine(tr / 3, identity());
	return { trace: tr, even, traceFree: combine(1, m, -1, even) };
}

/** The principal values of a symmetric table, smallest first, with their axes (Jacobi's rotations). */
export function principal(m: Mat3): { value: number; axis: Vec3 }[] {
	const a = m.map((r) => [...r]);
	const v = identity().map((r) => [...r]);
	for (let sweep = 0; sweep < 50; sweep++) {
		const off = a[0][1] ** 2 + a[0][2] ** 2 + a[1][2] ** 2;
		const scale = a[0][0] ** 2 + a[1][1] ** 2 + a[2][2] ** 2 + off;
		if (off <= 1e-30 * scale || off === 0) break;
		for (const [p, q] of [
			[0, 1],
			[0, 2],
			[1, 2]
		]) {
			if (a[p][q] === 0) continue;
			const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
			const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
			const cs = 1 / Math.sqrt(t * t + 1);
			const sn = t * cs;
			for (let k = 0; k < 3; k++) {
				const akp = a[k][p];
				const akq = a[k][q];
				a[k][p] = cs * akp - sn * akq;
				a[k][q] = sn * akp + cs * akq;
			}
			for (let k = 0; k < 3; k++) {
				const apk = a[p][k];
				const aqk = a[q][k];
				a[p][k] = cs * apk - sn * aqk;
				a[q][k] = sn * apk + cs * aqk;
			}
			for (let k = 0; k < 3; k++) {
				const vkp = v[k][p];
				const vkq = v[k][q];
				v[k][p] = cs * vkp - sn * vkq;
				v[k][q] = sn * vkp + cs * vkq;
			}
		}
	}
	return [0, 1, 2]
		.map((i) => ({ value: a[i][i], axis: [v[0][i], v[1][i], v[2][i]] as Vec3 }))
		.sort((x, y) => x.value - y.value);
}

/** The largest principal value in size: how strong a table is. */
export const strength = (m: Mat3) => Math.max(...principal(m).map((p) => Math.abs(p.value)));

// --- the tides ---------------------------------------------------------------------------------------------------

/**
 * The Ricci part of the tide, s⁻², from the mass density ρ the ball measures, kg m⁻³, and the momentum flux T_ij,
 * J m⁻³ (a pressure positive): the chapter's eq:ricci-tide.
 */
export function ricciTide(rho: number, T: Mat3): Mat3 {
	const Tkk = trace(T);
	const even = ((4 * Math.PI * G) / 3) * (rho + Tkk / (C * C));
	const shear = combine(1, T, -Tkk / 3, identity());
	return combine(even, identity(), (-4 * Math.PI * G) / (C * C), shear);
}

/** A medium at rest: density ρ, an even pressure p, Pa, in every direction. */
export const mediumStress = (rho: number, p: number) => ({ rho, T: combine(p, identity()) });

/** A beam of energy flux F, W m⁻², along n̂: null dust, with ρc² = T_kk = F/c and T_ij = (F/c) n̂_i n̂_j. */
export const beamStress = (F: number, n: Vec3) => ({
	rho: F / C ** 3,
	T: combine(F / C, outer(n))
});

/** The chapter's beam check: (4πGF/c³)(δ_ij − n̂_i n̂_j), an even squeeze across the beam and none along it. */
export const beamCheck = (F: number, n: Vec3): Mat3 =>
	combine((4 * Math.PI * G * F) / C ** 3, identity(), (-4 * Math.PI * G * F) / C ** 3, outer(n));

/** The tide of a point mass M, kg, at the distance d, m, along m̂: (GM/d³)(δ_ij − 3 m̂_i m̂_j). */
export function pointMassTide(M: number, d: number, m: Vec3): Mat3 {
	const a = (G * M) / d ** 3;
	return combine(a, identity(), -3 * a, outer(m));
}

/** V̈/V for a ball of free grains released at rest: minus the trace. */
export const volumeRate = (m: Mat3) => -trace(m);

/** The volume of a small ball after the time t, over its starting volume: det(1 − ½ 𝓔 t²). */
export function volumeAfter(m: Mat3, t: number): number {
	const a = combine(1, identity(), -(t * t) / 2, m);
	return (
		a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
		a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
		a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
	);
}

// --- the settings ------------------------------------------------------------------------------------------------

export interface Settings {
	/** The medium's density, kg m⁻³. */
	rho: number;
	/** The medium's pressure over ρc². */
	pressure: number;
	/** The beam's energy flux, W m⁻². */
	flux: number;
	/** The beam's direction in the slice, degrees anticlockwise from the line to the mass. */
	beam: number;
	/** The mass outside, kg. */
	mass: number;
	/** Its distance, m. */
	distance: number;
}

/** The figure opens inside water with a 1000 kg mass 2 m away. */
export const OPENING: Settings = {
	rho: 1000,
	pressure: 0,
	flux: 0,
	beam: 0,
	mass: 1000,
	distance: 2
};

export const WATER = 1000;
export const EARTH = 5513;
export const SUNLIGHT = 1361;

export interface Range {
	min: number;
	max: number;
	/** The slider's own step. */
	step: number;
	/** An arrow key's step. */
	key: number;
	/** With Shift, or Page Up and Page Down. */
	large: number;
	/** The value goes round, as an angle does. */
	wraps?: boolean;
}

export const DENSITY: Range = { min: 0, max: 20000, step: 1, key: 100, large: 1000 };
/** The pressure's slider is the decimal logarithm of p/ρc², its left end no pressure at all. */
export const PRESSURE: Range = { min: -16, max: Math.log10(0.3), step: 0.01, key: 0.1, large: 1 };
export const FLUX: Range = { min: 0, max: 10000, step: 1, key: 50, large: 1000 };
export const BEAM: Range = { min: 0, max: 360, step: 1, key: 5, large: 45, wraps: true };
export const MASS: Range = { min: 0, max: 10000, step: 1, key: 100, large: 1000 };
export const DISTANCE: Range = { min: 0.5, max: 5, step: 0.01, key: 0.1, large: 0.5 };

/** p/ρc² from the pressure's slider: none at its left end, else a power of ten. */
export const pressureAt = (v: number) => (v <= PRESSURE.min + 1e-9 ? 0 : Math.min(0.3, 10 ** v));
/** The pressure's slider for p/ρc². */
export const pressureSlider = (w: number) =>
	w <= 0 ? PRESSURE.min : Math.max(PRESSURE.min, Math.min(PRESSURE.max, Math.log10(w)));

/** p/ρc² for water at one atmosphere, at the Earth's centre (364 GPa, 13 100 kg m⁻³) and at the Sun's centre. */
export const PRESSURES = {
	water: 101325 / (1000 * C * C),
	earth: 364e9 / (13100 * C * C),
	sun: 5.6e-6 / 3
};

/**
 * A slider's value after a key: the arrows by a step, with Shift (or Page Up and Page Down) by a large one, onto the
 * grid of that step; Home and End to the ends. Undefined for any other key.
 */
export function stepped(v: number, key: string, shift: boolean, r: Range): number | undefined {
	if (key === 'Home') return r.min;
	if (key === 'End') return r.wraps ? r.min : r.max;
	const dir = { ArrowRight: 1, ArrowUp: 1, PageUp: 1, ArrowLeft: -1, ArrowDown: -1, PageDown: -1 }[
		key
	];
	if (dir === undefined) return undefined;
	const size = shift || key.startsWith('Page') ? r.large : r.key;
	// from the grid's line below or above, so that a value off the grid lands on it
	const k = dir > 0 ? Math.floor(v / size + 1e-9) + 1 : Math.ceil(v / size - 1e-9) - 1;
	const next = Math.round(k * size * 1e9) / 1e9;
	if (r.wraps) {
		const span = r.max - r.min;
		return ((((next - r.min) % span) + span) % span) + r.min;
	}
	return Math.max(r.min, Math.min(r.max, next));
}

/** The beam's direction in the slice. */
export const beamAxis = (deg: number): Vec3 => {
	const t = (deg * Math.PI) / 180;
	return [Math.cos(t), Math.sin(t), 0];
};

/** Toward the mass: along x, to the right of the slice. */
export const TOWARD_MASS: Vec3 = [1, 0, 0];

/**
 * A table with the entries that are rounding errors next to its largest, `scale`, set to zero: the trace-free part
 * of an even tide is zero, not 10⁻²² of it.
 */
export function chop(m: Mat3, scale: number): Mat3 {
	return m.map((r) => r.map((x) => (Math.abs(x) <= 1e-12 * scale ? 0 : x))) as Mat3;
}

const largest = (m: Mat3) => Math.max(...m.flat().map(Math.abs));

/**
 * The three tides at the ball and their sum, s⁻². The trace is the Ricci parts' alone, the Weyl part's being zero by
 * construction; each part's trace-free piece is cleaned of rounding against its own size, since the beam's is
 * twenty-five orders of magnitude below the medium's.
 */
export function tides(s: Settings) {
	const p = s.pressure * s.rho * C * C;
	const m = mediumStress(s.rho, p);
	const b = beamStress(s.flux, beamAxis(s.beam));
	const medium = ricciTide(m.rho, m.T);
	const beam = ricciTide(b.rho, b.T);
	const ricci = sum(medium, beam);
	const weyl = s.mass > 0 ? pointMassTide(s.mass, s.distance, TOWARD_MASS) : zero();
	const total = sum(ricci, weyl);
	const tr = trace(medium) + trace(beam);
	const ricciFree = sum(
		chop(split(medium).traceFree, largest(medium)),
		chop(split(beam).traceFree, largest(beam))
	);
	return {
		medium,
		beam,
		ricci,
		weyl,
		total,
		trace: tr,
		/** 4πG(ρ + Σp/c²) + 8πGF/c³, the chapter's sum, for the check. */
		traceFormula:
			4 * Math.PI * G * (s.rho + (3 * p) / (C * C)) + (8 * Math.PI * G * s.flux) / C ** 3,
		volumeRate: -tr,
		traceFree: strength(sum(ricciFree, weyl)),
		weylSize: strength(weyl),
		ricciTraceFree: strength(ricciFree)
	};
}

// --- the drawing -------------------------------------------------------------------------------------------------

/** The ball is drawn after this time, s. */
export const AFTER = 1;

/**
 * The pressure's share of the medium's tide, 3p/ρc², is drawn larger by a power of ten when it is under a tenth, so
 * that it shows: ×10¹⁴ in water at one atmosphere.
 */
export function pressureBoost(w: number): number {
	const share = 3 * w;
	if (share <= 0 || share >= 0.1) return 1;
	return 10 ** Math.floor(Math.log10(1 / share) + 1e-9);
}

/** The tide that is drawn: the true one, with the pressure's share boosted as pressureBoost says. */
export function drawnTide(s: Settings): Mat3 {
	const t = tides(s);
	const boost = pressureBoost(s.pressure);
	if (boost === 1 || s.rho === 0) return t.total;
	const p = s.pressure * s.rho * C * C;
	const extra = ricciTide(0, combine((boost - 1) * p, identity()));
	return sum(t.total, extra);
}

/** The largest drawn change of a radius, as a fraction of it. */
export const LARGEST = 0.4;

/**
 * The display scale: the deformation after AFTER is drawn ×N, N one of 1, 2 or 5 times a power of ten, the largest
 * that keeps every radius's change within LARGEST of it. Undefined with no tide at all.
 */
export function displayScale(m: Mat3): number | undefined {
	const most = (strength(m) * AFTER * AFTER) / 2;
	if (!(most > 0)) return undefined;
	const room = LARGEST / most;
	const e = Math.floor(Math.log10(room) + 1e-12);
	const base = 10 ** e;
	const lead = [5, 2, 1].find((k) => k * base <= room * (1 + 1e-12)) ?? 1;
	return lead * base;
}

/** 200 grains spread evenly over the slice through the ball's centre, radius 1 (a sunflower's pattern). */
export function grains(n = 200): [number, number][] {
	const golden = Math.PI * (3 - Math.sqrt(5));
	return Array.from({ length: n }, (_, i) => {
		const r = Math.sqrt((i + 0.5) / n);
		const t = i * golden;
		return [r * Math.cos(t), r * Math.sin(t)];
	});
}

/** A grain's place in the slice after the time t, drawn ×N: ξ₀ − ½ N 𝓔 ξ₀ t². */
export function moved(m: Mat3, N: number, t: number, p: [number, number]): [number, number] {
	const k = (N * t * t) / 2;
	return [
		p[0] - k * (m[0][0] * p[0] + m[0][1] * p[1]),
		p[1] - k * (m[1][0] * p[0] + m[1][1] * p[1])
	];
}

/** The two principal values in the slice, with their directions in degrees, from 0 to 180. */
export function inSlice(m: Mat3): { value: number; angle: number }[] {
	const a = m[0][0];
	const b = m[0][1];
	const d = m[1][1];
	const mid = (a + d) / 2;
	const r = Math.hypot((a - d) / 2, b);
	const t = (0.5 * Math.atan2(2 * b, a - d) * 180) / Math.PI;
	const norm = (x: number) => ((x % 180) + 180) % 180;
	return [
		{ value: mid + r, angle: norm(t) },
		{ value: mid - r, angle: norm(t + 90) }
	];
}

/**
 * The shape in the slice: its longest axis over its shortest as drawn ×N after AFTER, and the true excess over 1
 * after AFTER, ½|λ₁ − λ₂|t² to first order, from the true tide.
 */
export function aspect(drawn: Mat3, N: number, truth: Mat3) {
	const axes = inSlice(drawn).map((a) => 1 - (N * AFTER * AFTER * a.value) / 2);
	const t = inSlice(truth);
	const excess = (Math.abs(t[0].value - t[1].value) * AFTER * AFTER) / 2;
	return {
		drawn: Math.max(...axes) / Math.min(...axes),
		excess: excess <= 1e-12 * Math.max(Math.abs(t[0].value), Math.abs(t[1].value)) ? 0 : excess
	};
}

// --- the predictions ---------------------------------------------------------------------------------------------

/** No pressure to speak of: its share 3p/ρc² is under 3 × 10⁻⁹, and the trace keeps its two figures. */
const LITTLE_PRESSURE = 1e-9;

/** The first, once the ball is in water with nothing else nearby: no mass, no beam. */
export const noteFirst = (done: boolean, s: Settings) =>
	done ||
	(Math.abs(s.rho - WATER) < 0.5 && s.mass === 0 && s.flux === 0 && s.pressure <= LITTLE_PRESSURE);

/** The second, once the ball is out of any medium with a mass near and no beam. */
export const noteSecond = (done: boolean, s: Settings) =>
	done || (s.rho === 0 && s.mass > 0 && s.flux === 0);

/** The third, once a beam runs through the ball with nothing else there: no medium and no mass. */
export const noteThird = (done: boolean, s: Settings) =>
	done || (s.flux > 0 && s.rho === 0 && s.mass === 0);

// --- the words ---------------------------------------------------------------------------------------------------

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number) =>
	(n < 0 ? '⁻' : '') +
	String(Math.abs(n))
		.split('')
		.map((c) => SUP[Number(c)])
		.join('');

/** A number to two figures, in plain text: "8.4 × 10⁻⁷", "−1.7 × 10⁻⁸", "1.0 × 10⁵", "0". */
export function two(x: number): string {
	if (x === 0 || !Number.isFinite(x)) return '0';
	const sign = x < 0 ? '−' : '';
	const a = Math.abs(x);
	if (a >= 0.01 && a < 1000) return sign + String(Number(a.toPrecision(2)));
	let e = Math.floor(Math.log10(a));
	let m = Number((a / 10 ** e).toFixed(1));
	if (m >= 10) {
		e += 1;
		m = 1;
	}
	return `${sign}${m.toFixed(1)} × 10${sup(e)}`;
}

/** The same in LaTeX: "8.4 \times 10^{-7}". */
export function texTwo(x: number): string {
	return two(x)
		.replace('−', '-')
		.replace(' × ', ' \\times ')
		.replace(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/, (_, s: string) => {
			const e = s
				.split('')
				.map((c) => (c === '⁻' ? '-' : String(SUP.indexOf(c))))
				.join('');
			return `10^{${e}}`;
		});
}

/** A display scale in words: "×2 × 10⁶". */
export function scaleWords(N: number): string {
	const e = Math.floor(Math.log10(N) + 1e-12);
	const lead = Math.round(N / 10 ** e);
	if (e < 3) return `×${Math.round(N)}`;
	return lead === 1 ? `×10${sup(e)}` : `×${lead} × 10${sup(e)}`;
}

/** A whole number grouped by thin spaces, as the chapter writes 13 100: "5513", "20 000". */
export const grouped = (n: number) => {
	const s = String(Math.round(n));
	return s.length <= 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
