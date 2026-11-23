/**
 * The numbers of chapter 0.1's map of the regimes, for its live figure: the edge of the near zone, r = c/2πf
 * (the paper's eq:nearzone), the wavelength, the temperature whose thermal glow peaks at a frequency, and the
 * chart of the paper's Figure fig:regimes, its frame and its eight sources, placed exactly as
 * paper/figures/make_figures.py places them (function `regimes()`; the spec reads that file and compares).
 *
 * Positions on the chart are kept as powers of ten: `lf` = log10 of the frequency in Hz, `lr` = log10 of the
 * distance in metres.
 */

/** The speed of light, m s⁻¹. */
export const C = 299_792_458;
/** The reduced Planck constant, J s, and Boltzmann's constant, J K⁻¹ (exact in the SI). */
export const HBAR = 6.62607015e-34 / (2 * Math.PI);
export const KB = 1.380649e-23;

/**
 * The constant of the peak of a thermal spectrum per unit frequency: x = 2πħf / k_B T at the peak, the root of
 * x = 3 (1 − e^(−x)), 2.8214.
 */
export const PEAK = (() => {
	let x = 3;
	for (let i = 0; i < 100; i++) x = 3 * (1 - Math.exp(-x));
	return x;
})();

/** The wavelength of waves of frequency f, m: λ = c/f. */
export const wavelength = (f: number) => C / f;

/** The edge of the near zone at frequency f, m: λ/2π = c/2πf. */
export const nearZone = (f: number) => C / (2 * Math.PI * f);

/** The frequency whose near zone reaches the distance r, Hz. */
export const edgeFrequency = (r: number) => C / (2 * Math.PI * r);

/** How far out a distance r lies, in units of the near zone at frequency f: r / (λ/2π) = 2πrf/c. */
export const depth = (f: number, r: number) => r / nearZone(f);

export type Regime = 'near' | 'wave';

/** Inside the near zone, r < λ/2π, or outside it. */
export const regime = (f: number, r: number): Regime => (depth(f, r) < 1 ? 'near' : 'wave');

/** The temperature whose thermal glow peaks at frequency f, K: T = 2πħf / (2.8214 k_B). */
export const peakTemperature = (f: number) => (2 * Math.PI * HBAR * f) / (PEAK * KB);

/** The frequency at which a body at temperature T glows most brightly, Hz: f = 2.8214 k_B T / 2πħ. */
export const peakFrequency = (T: number) => (PEAK * KB * T) / (2 * Math.PI * HBAR);

/**
 * The coldest thermal glow in nature, the afterglow of the Big Bang, K, and the frequency of its peak: below that
 * frequency no source glows, and only bodies moving as a whole send waves.
 */
export const COLDEST = 2.725;
export const THERMAL_FROM = peakFrequency(COLDEST);

// --- the chart of fig:regimes -----------------------------------------------------------------------------------

/** The frame, as powers of ten: 10⁻⁹ to 10¹⁹ Hz across, 0.1 m to 10¹² m up. */
export const FRAME = { lf: [-9, 19], lr: [-1, 12] } as const;

/** The paper's ticks, as powers of ten. */
export const TICKS = { lf: [-6, 0, 6, 12, 18], lr: [0, 3, 6, 9, 12] } as const;

/** The two zones' names, at this distance, the same distance in from the left and the right of the frame. */
export const ZONE_NAMES_AT = 3;

/** The label of the edge, `r = c/2πf`, and the point of the edge its leader runs to, as in the paper. */
export const EDGE_LABEL = {
	lf: Math.log10(3e7),
	lr: Math.log10(3e4),
	to: Math.log10(3e5)
} as const;

/**
 * The paper's arrow to two neutron stars merging, at the frequency of their last orbits, about 2 kHz, pointing up
 * past the top of the chart, and its words, set from their top left corner.
 */
export const MERGER = {
	lf: Math.log10(2e3),
	from: 10,
	to: Math.log10(9e11),
	text: { lf: Math.log10(8e2), lr: Math.log10(5e9) },
	lines: ['neutron stars merging,', '10¹² times farther']
} as const;

export interface Source {
	/** Its name, as the paper's figure sets it, one entry to a line. */
	lines: string[];
	/** Its frequency, Hz, and its distance, m, as the paper places it. */
	f: number;
	r: number;
	/** Where its name stands from it, in points as in the paper, x to the right and y up. */
	offset: [number, number];
	/** Which end of the name stands at that point. */
	align: 'left' | 'center' | 'right';
	/** A thermal source, placed at the peak of its spectrum, and its temperature, K. */
	thermal?: number;
}

/** The eight sources of fig:regimes, in the paper's order and at the paper's places. */
export const SOURCES: Source[] = [
	{ lines: ['the Moon’s tide'], f: 10 ** -4.65, r: 10 ** 8.58, offset: [0, -8], align: 'center' },
	{
		lines: ['an earthquake’s', 'gravity signal'],
		f: 10 ** -1.5,
		r: 1e6,
		offset: [-3, -10],
		align: 'center'
	},
	{ lines: ['a passing lorry'], f: 10 ** -0.5, r: 10 ** 1.5, offset: [-5, 0], align: 'right' },
	{ lines: ['a person walking'], f: 1.0, r: 10 ** 0.5, offset: [-5, 0], align: 'right' },
	{
		lines: ['LIGO’s calibration rotor'],
		f: 10 ** 1.5,
		r: 10 ** 0.18,
		offset: [0, -7],
		align: 'center'
	},
	{
		lines: ['a warm object', 'in the room'],
		f: 1.76e13,
		r: 10 ** 0.5,
		offset: [0, 11],
		align: 'center',
		thermal: 300
	},
	{
		lines: ['the Earth’s interior'],
		f: 2.06e14,
		r: 10 ** 6.5,
		offset: [-5, 0],
		align: 'right',
		thermal: 3500
	},
	{
		lines: ['the Sun’s core'],
		f: 9.2e17,
		r: 10 ** 11.18,
		offset: [-5, 0],
		align: 'right',
		thermal: 15.7e6
	}
];

/** A source's name on one line. */
export const sourceName = (s: Source) => s.lines.join(' ');

type Point = { lf: number; lr: number };

/**
 * The edge of the near zone where it crosses the frame, as two points: it is a straight line of slope −1 in
 * powers of ten, lr = log10(c/2π) − lf.
 */
export function edgeInFrame(): [Point, Point] {
	const k = Math.log10(C / (2 * Math.PI));
	const [lr0, lr1] = FRAME.lr;
	const [lf0, lf1] = FRAME.lf;
	const top = { lf: Math.max(lf0, k - lr1), lr: Math.min(lr1, k - lf0) };
	const bottom = { lf: Math.min(lf1, k - lr0), lr: Math.max(lr0, k - lf1) };
	return [top, bottom];
}

/** The two zones as polygons in powers of ten: the near field below and left of the edge, the wave zone above. */
export function zones(): { near: Point[]; wave: Point[] } {
	const [top, bottom] = edgeInFrame();
	const [lf0, lf1] = FRAME.lf;
	const [lr0, lr1] = FRAME.lr;
	return {
		near: [{ lf: lf0, lr: lr0 }, { lf: lf0, lr: lr1 }, top, bottom],
		wave: [top, { lf: lf1, lr: lr1 }, { lf: lf1, lr: lr0 }, bottom]
	};
}

/** A position kept in the frame. */
export const clampToFrame = (p: Point): Point => ({
	lf: Math.max(FRAME.lf[0], Math.min(FRAME.lf[1], p.lf)),
	lr: Math.max(FRAME.lr[0], Math.min(FRAME.lr[1], p.lr))
});

// --- numbers for a reader, as LaTeX ---------------------------------------------------------------------------

/** A number to three significant figures, plainly, grouped by commas: "4.77", "47.7", "47,700". */
function three(x: number): string {
	const v = Number(x.toPrecision(3));
	return v.toLocaleString('en-US', { maximumFractionDigits: 20 }).replace(/,/g, '{,}');
}

/** A number to three figures in a power of ten: "4.77 \times 10^{7}", or "10^{7}". */
function power(x: number): string {
	let e = Math.floor(Math.log10(x));
	let m = Number((x / 10 ** e).toPrecision(3));
	if (m >= 10) {
		m /= 10;
		e += 1;
	}
	return m === 1 ? `10^{${e}}` : `${m.toFixed(2)} \\times 10^{${e}}`;
}

/** A frequency, Hz, as LaTeX: plain from a hundredth to ten thousand, else a power of ten. */
export const texFrequency = (f: number) =>
	`${f >= 0.01 && f < 1e4 ? three(f) : power(f)}\\,\\mathrm{Hz}`;

/** One light-year, m. */
export const LIGHT_YEAR = 9_460_730_472_580_800;

/**
 * A length, m, as LaTeX in the unit that suits it, to three figures: pm, nm, μm, mm, m, km (grouped up to ten
 * million km, in powers of ten beyond), light-years from a tenth of one.
 */
export function texLength(m: number): string {
	const units: [number, number, string][] = [
		[1e-9, 1e-12, 'pm'],
		[1e-6, 1e-9, 'nm'],
		[1e-3, 1e-6, '\\mu m'],
		[1, 1e-3, 'mm'],
		[1e3, 1, 'm'],
		[1e10, 1e3, 'km']
	];
	for (const [below, unit, name] of units) {
		if (m < below * (1 - 5e-4)) return `${three(m / unit)}\\,\\mathrm{${name}}`;
	}
	if (m < 0.1 * LIGHT_YEAR) return `${power(m / 1e3)}\\,\\mathrm{km}`;
	return `${three(m / LIGHT_YEAR)}\\ \\text{light-years}`;
}

/** The time of one cycle, s, in words to three figures: "12.4 hours". */
export function period(seconds: number): string {
	const steps: [number, number, string][] = [
		[120, 1, 'seconds'],
		[7200, 60, 'minutes'],
		[172800, 3600, 'hours'],
		[2 * 365.25 * 86400, 86400, 'days']
	];
	for (const [below, unit, name] of steps) {
		if (seconds < below) return `${Number((seconds / unit).toPrecision(3))} ${name}`;
	}
	return `${Number((seconds / (365.25 * 86400)).toPrecision(3))} years`;
}

/** A temperature, K, as LaTeX: plain below ten thousand, else a power of ten. */
export const texTemperature = (T: number) =>
	`${T >= 0.01 && T < 1e4 ? three(T) : power(T)}\\,\\mathrm{K}`;

/** A number as LaTeX to two figures: plain from a hundredth to ten thousand, else a power of ten. */
export function texRatio(x: number): string {
	if (x >= 0.01 && x < 1e4)
		return Number(x.toPrecision(2)).toLocaleString('en-US').replace(/,/g, '{,}');
	let e = Math.floor(Math.log10(x));
	let m = Number((x / 10 ** e).toPrecision(2));
	if (m >= 10) {
		m /= 10;
		e += 1;
	}
	return m === 1 ? `10^{${e}}` : `${m.toFixed(1)} \\times 10^{${e}}`;
}
