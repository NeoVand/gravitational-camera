/**
 * The numbers of chapter 0.6's ladder of scales, for its live figure: two logarithmic axes, the paper's tides in
 * s⁻² and its lengths in metres, each mark a scene of the paper with its value, the section that gives it and the
 * label to link to. Where the paper gives a formula the value is recomputed from it, and where the paper prints a
 * rounder number the mark says so (the spec compares both with the paper's text).
 *
 * Places on an axis are kept as powers of ten: `p` = log10 of the value in SI units.
 */

/** Newton's constant, m³ kg⁻¹ s⁻², and the speed of light, m s⁻¹. */
export const G = 6.674_3e-11;
export const C = 299_792_458;
/** Planck's reduced constant, J s, and Boltzmann's constant, J K⁻¹ (exact in the SI). */
export const HBAR = 6.626_070_15e-34 / (2 * Math.PI);
export const KB = 1.380_649e-23;

/** One eötvös, the unit of tide of gravity gradiometers, s⁻². */
export const EOTVOS = 1e-9;
/** The astronomical unit, the light-year and the parsec, m (IAU). */
export const AU = 1.495_978_707e11;
export const LIGHT_YEAR = 9.460_730_472_580_8e15;
export const PARSEC = 3.085_677_581_491_367e16;

/** The tide of a mass M at distance r along the line to it, s⁻²: 2GM/r³. */
export const tide = (M: number, r: number) => (2 * G * M) / r ** 3;

/** The paper's bodies: a person, the Moon at its mean distance, the Earth, and the black hole as warm as the sky. */
export const PERSON = 70;
export const MOON = { M: 7.342e22, r: 3.844e8 };
export const EARTH = { M: 5.972e24, R: 6.371e6 };
export const HOLE = 1.36e23;

/** x = 2πħf/k_BT at the peak of a thermal spectrum per unit frequency, the root of x = 3(1 − e^(−x)), 2.8214. */
export const PEAK = (() => {
	let x = 3;
	for (let i = 0; i < 100; i++) x = 3 * (1 - Math.exp(-x));
	return x;
})();

/** The wavelength at which a body at temperature T glows most brightly per unit frequency, m. */
export const peakWavelength = (T: number) => (C * 2 * Math.PI * HBAR) / (PEAK * KB * T);

export type LadderId = 'tides' | 'lengths';

export interface Mark {
	id: string;
	/** The mark's words on a wide screen, and on a phone. */
	name: string;
	short: string;
	/** The value, in SI units (s⁻² or m). */
	value: number;
	/** The value as the figure prints it, in plain text and in LaTeX, with its unit. */
	text: string;
	tex: string;
	/** The scene, in full sentences. */
	scene: string;
	/** How the paper itself gives the number, where it rounds it or gives it another way. */
	paper?: string;
	/** The section of the paper, and the label of the place in it to link to. */
	section: string;
	label: string;
}

export interface Ladder {
	id: LadderId;
	/** What is measured, its symbol and its unit. */
	quantity: string;
	unit: string;
	unitTex: string;
	/** The ends of the axis, as powers of ten. */
	range: readonly [number, number];
	/** The labelled ticks on a wide screen and on a phone, as powers of ten. */
	ticks: readonly number[];
	phoneTicks: readonly number[];
	/** Where the pointer opens, as a power of ten. */
	start: number;
	marks: readonly Mark[];
}

/** Spaces that must not break a line: inside "1.7 × 10⁻¹³" and between a number and its unit. */
export const tight = (s: string) =>
	s
		.replace(/ × /g, '\u00a0×\u00a0')
		.replace(/([\d⁰¹²³⁴⁵⁶⁷⁸⁹]) (?=(s⁻²|kg|K|km|m|μm|E|AU|kpc|mHz|Hz)(?!\p{L}))/gu, '$1\u00a0');

/** A number's mantissa and power of ten, to the significant figures given. */
function split(x: number, figures: number) {
	let e = Math.floor(Math.log10(x));
	let m = Number((x / 10 ** e).toFixed(figures - 1));
	if (m >= 10) {
		m /= 10;
		e += 1;
	}
	return { m, e };
}

/**
 * A number for a label, to the significant figures given: plainly from a hundredth to ten thousand ("0.05", "12",
 * "1,200"), and beyond that in powers of ten ("1.7 × 10⁻¹³", "4 × 10⁻³²", "10⁻⁹"), never breaking across lines.
 */
export function plain(x: number, figures = 2): string {
	const { m, e } = split(x, figures);
	if (e >= -2 && e <= 3)
		return (m * 10 ** e).toLocaleString('en-US', { maximumSignificantDigits: figures });
	const sup = String(e).replace(/[-0-9]/g, (c) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]);
	return m === 1 ? `10${sup}` : tight(`${m} × 10${sup}`);
}

/** The same number as LaTeX. */
export function texPlain(x: number, figures = 2): string {
	const { m, e } = split(x, figures);
	if (e >= -2 && e <= 3)
		return (m * 10 ** e)
			.toLocaleString('en-US', { maximumSignificantDigits: figures })
			.replace(/,/g, '{,}');
	return m === 1 ? `10^{${e}}` : `${m}\\times10^{${e}}`;
}

const S2 = '\\,\\mathrm{s^{-2}}';

/** A mark's words, with the spaces inside its numbers kept from breaking. */
const tidy = (m: Mark): Mark => ({
	...m,
	text: tight(m.text),
	scene: tight(m.scene),
	paper: m.paper && tight(m.paper)
});

/** A mark on the ladder of tides, its value printed to the figures given. */
function tideMark(m: Omit<Mark, 'text' | 'tex'>, figures: number): Mark {
	return tidy({
		...m,
		text: `${plain(m.value, figures)} s⁻²`,
		tex: texPlain(m.value, figures) + S2
	});
}

export const TIDES: Ladder = {
	id: 'tides',
	quantity: 'tide',
	unit: 's⁻²',
	unitTex: '\\mathrm{s^{-2}}',
	range: [-33, 14],
	ticks: [-30, -25, -20, -15, -10, -5, 0, 5, 10],
	phoneTicks: [-30, -20, -10, 0, 10],
	start: -9,
	marks: [
		tideMark(
			{
				id: 'hole-tremor',
				name: 'a black hole’s trembling',
				short: 'a hole’s trembling',
				value: 4e-32,
				scene:
					'A black hole of 1.36 × 10²³ kg is as warm as the sky of gravitons, 0.905 K, and like every warm body it trembles. A camera a metre away, watching for one second, would feel the trembling as this tide.',
				section: 'XIV',
				label: 'sec:hole'
			},
			1
		),
		tideMark(
			{
				id: 'quantum-limit',
				name: 'two gram masses at the quantum limit',
				short: 'the quantum limit',
				value: 6e-14,
				scene:
					'Two free masses of a gram, a centimetre apart, read for one second as finely as quantum mechanics allows (the standard quantum limit), would resolve this tide.',
				section: 'II',
				label: 'sec:pixel'
			},
			1
		),
		tideMark(
			{
				id: 'moon',
				name: 'the Moon on the Earth',
				short: 'the Moon',
				value: tide(MOON.M, MOON.r),
				scene:
					'The tide the Moon raises on the Earth, from the Moon’s mass and its distance: the tide that lifts the oceans.',
				paper:
					'The paper gives it as a comparison: a person a metre away raises about fifty thousand times this tide.',
				section: 'IV',
				label: 'eq:tidal-brightness'
			},
			2
		),
		tideMark(
			{
				id: 'gradiometer',
				name: 'a gradiometer’s noise in one second',
				short: 'a gradiometer',
				value: 0.02 * EOTVOS,
				scene:
					'The noise of a superconducting gradiometer in the laboratory after one second of reading, 0.02 eötvös. One eötvös, E, is 10⁻⁹ s⁻².',
				section: 'II',
				label: 'sec:pixel'
			},
			1
		),
		tideMark(
			{
				id: 'person',
				name: 'a person a metre away',
				short: 'a person',
				value: tide(PERSON, 1),
				scene:
					'A person of 70 kg standing a metre from the camera raises about nine eötvös. This is the scene the paper starts from.',
				paper: 'The paper rounds it to 9 × 10⁻⁹ s⁻².',
				section: 'II',
				label: 'sec:pixel'
			},
			2
		),
		tideMark(
			{
				id: 'earth',
				name: 'the Earth’s own tide',
				short: 'the Earth',
				value: tide(EARTH.M, EARTH.R),
				scene:
					'The Earth’s own tide at the ground, a stretch along the vertical. It is steady and known, and it is subtracted before any picture is made.',
				section: 'II',
				label: 'sec:pixel'
			},
			2
		),
		tideMark(
			{
				id: 'bearable',
				name: 'a camera beside a small black hole',
				short: 'a camera’s limit',
				value: 1,
				scene:
					'The black hole of 1.36 × 10²³ kg could serve as a lens, but its tide falls to a bearable 1 s⁻² only 26 km away, so a camera using it must stay that far off.',
				section: 'VII',
				label: 'fig:black-hole-camera'
			},
			1
		),
		tideMark(
			{
				id: 'hole',
				name: 'the small black hole a metre away',
				short: 'the hole at 1 m',
				value: tide(HOLE, 1),
				scene: 'The same black hole seen from a metre: a tide that would tear the camera apart.',
				paper: 'The paper rounds it to 2 × 10¹³ s⁻².',
				section: 'VII',
				label: 'fig:black-hole-camera'
			},
			2
		)
	]
};

export const LENGTHS: Ladder = {
	id: 'lengths',
	quantity: 'length',
	unit: 'm',
	unitTex: '\\mathrm{m}',
	range: [-18, 21],
	ticks: [-15, -10, -5, 0, 5, 10, 15, 20],
	phoneTicks: [-15, -10, -5, 0, 5, 10, 15, 20],
	start: 3,
	marks: (
		[
			{
				id: 'ligo',
				name: 'LIGO’s arm, stretched by a wave',
				short: 'LIGO’s arm',
				value: 1e-21 * 4e3,
				text: '4 × 10⁻¹⁸ m',
				tex: '4\\times10^{-18}\\,\\mathrm{m}',
				scene:
					'A wave of strain 10⁻²¹ makes one of LIGO’s 4 km arms longer than the other by this much, about a four-hundredth of the width of a proton.',
				section: 'II',
				label: 'sec:pixel'
			},
			{
				id: 'heat',
				name: 'a wave of room-temperature heat',
				short: 'a wave of heat',
				value: peakWavelength(300),
				text: '17 μm',
				tex: '17\\,\\mathrm{\\mu m}',
				scene:
					'A body at room temperature, 300 K, glows most brightly, counted per unit of frequency, in waves this long. A micrometre, μm, is a millionth of a metre.',
				paper:
					'The paper says the waves of heat are “tens of micrometres” long; 17 μm is the peak of the glow at 300 K.',
				section: 'VI',
				label: 'sec:thermal'
			},
			{
				id: 'metre',
				name: 'a person a metre away',
				short: 'a person',
				value: 1,
				text: '1 m',
				tex: '1\\,\\mathrm{m}',
				scene: 'The person of the paper’s first scene stands one metre from the camera.',
				section: 'II',
				label: 'sec:pixel'
			},
			{
				id: 'near-zone',
				name: 'the near zone of a source at 1 Hz',
				short: 'the near zone',
				value: C / (2 * Math.PI),
				text: '47,700 km',
				tex: '47{,}700\\,\\mathrm{km}',
				scene:
					'A source swaying once a second has a near zone, inside which its tide follows it almost at once. The zone reaches a wavelength divided by 2π, this far.',
				paper: 'The paper rounds it to 48,000 km.',
				section: 'III',
				label: 'eq:nearzone'
			},
			{
				id: 'au',
				name: 'one astronomical unit',
				short: 'one AU',
				value: AU,
				text: '1 AU',
				tex: '1\\,\\mathrm{AU}',
				scene:
					'The astronomical unit, AU, is the mean distance from the Earth to the Sun. Waves of 3 mHz from the Galaxy’s pairs of stars are two-thirds of it long, and a camera that saw the Galaxy’s centre sharply would be 50 AU across.',
				section: 'XI',
				label: 'fig:milky-way'
			},
			{
				id: 'supernova',
				name: 'a supernova ten kiloparsecs away',
				short: 'a supernova',
				value: 10e3 * PARSEC,
				text: '10 kpc',
				tex: '10\\,\\mathrm{kpc}',
				scene:
					'A supernova in our Galaxy, ten kiloparsecs away, would leave the camera’s field changed for good, by a strain of 4 × 10⁻²¹ seen from the side. A parsec, pc, is 3.26 light-years, and a kiloparsec, kpc, a thousand of them.',
				section: 'XI',
				label: 'eq:burst-memory'
			}
		] satisfies Mark[]
	).map(tidy)
};

export const LADDERS: Record<LadderId, Ladder> = { tides: TIDES, lengths: LENGTHS };

// --- powers of ten -------------------------------------------------------------------------------------------------

/** The place of a value on the axis, as a power of ten. */
export const power = (x: number) => Math.log10(x);

/** How many powers of ten separate two values: log10(b/a), positive when b is the larger. */
export const decades = (a: number, b: number) => Math.log10(b / a);

/** A place kept on the axis. */
export const clampTo = (ladder: Ladder, p: number) =>
	Math.min(ladder.range[1], Math.max(ladder.range[0], p));

/** The mark nearest a place on the axis, counted in powers of ten. */
export function nearest(ladder: Ladder, p: number): Mark {
	let best = ladder.marks[0];
	for (const m of ladder.marks)
		if (Math.abs(power(m.value) - p) < Math.abs(power(best.value) - p)) best = m;
	return best;
}

/** The pointer stands on a mark when it is within this many powers of ten of it. */
export const ON = 1e-6;

/** The prediction: how many powers of ten separate the person's tide from the Moon's. */
export const ASKED = { from: 'moon', to: 'person' } as const;
export const markOf = (ladder: Ladder, id: string) => {
	const m = ladder.marks.find((k) => k.id === id);
	if (!m) throw new Error(`no mark "${id}"`);
	return m;
};
export const ANSWER = decades(markOf(TIDES, ASKED.from).value, markOf(TIDES, ASKED.to).value);

// --- placing the words -----------------------------------------------------------------------------------------------

/**
 * Words set beside an axis, moved apart along it so that no two come closer than `gap`: each crowd of words is
 * spread evenly about the mean of the places it wants, and kept between `lo` and `hi`. Returns the places in the
 * order given; the order along the axis is kept.
 */
export function spread(want: readonly number[], gap: number, lo: number, hi: number): number[] {
	const order = want.map((_, i) => i).sort((a, b) => want[a] - want[b]);
	type Crowd = { members: number[]; start: number };
	const place = (members: number[]) => {
		const mean = members.reduce((s, i) => s + want[i], 0) / members.length;
		const span = (members.length - 1) * gap;
		return Math.min(hi - span, Math.max(lo, mean - span / 2));
	};
	const crowds: Crowd[] = [];
	for (const i of order) {
		let c: Crowd = { members: [i], start: place([i]) };
		// a crowd that overlaps the one before it joins it, and the two are placed again together
		while (crowds.length) {
			const prev = crowds[crowds.length - 1];
			if (prev.start + (prev.members.length - 1) * gap + gap <= c.start + 1e-9) break;
			crowds.pop();
			const members = [...prev.members, ...c.members];
			c = { members, start: place(members) };
		}
		crowds.push(c);
	}
	const out = new Array<number>(want.length);
	for (const c of crowds) c.members.forEach((i, k) => (out[i] = c.start + k * gap));
	return out;
}

// --- the pointer's value in words ------------------------------------------------------------------------------------

/** A length in a unit that suits it, as LaTeX, or nothing where metres in powers of ten are best. */
export function texFriendly(m: number): string | undefined {
	const p = Math.log10(m);
	const n = (x: number) => {
		const s = Number(x.toPrecision(3)).toLocaleString('en-US', { maximumFractionDigits: 2 });
		return s.replace(/,/g, '{,}');
	};
	if (p < -9 || (p >= 0 && p < 3)) return undefined;
	if (p < -6) return `${n(m * 1e9)}\\,\\mathrm{nm}`;
	if (p < -3) return `${n(m * 1e6)}\\,\\mathrm{\\mu m}`;
	if (p < 0) return `${n(m * 1e3)}\\,\\mathrm{mm}`;
	if (p < 10) return `${n(m / 1e3)}\\,\\mathrm{km}`;
	if (p < 15.5) return `${n(m / AU)}\\,\\mathrm{AU}`;
	if (p < 19) return `${n(m / LIGHT_YEAR)}\\ \\text{light-years}`;
	return `${n(m / PARSEC / 1e3)}\\,\\mathrm{kpc}`;
}

/** A factor in plain words: "3.0", "54,000", "2.2 × 10⁷". */
export function factor(x: number): string {
	if (x < 10) return x.toFixed(1);
	if (x < 1e6) return Number(x.toPrecision(2)).toLocaleString('en-US');
	return plain(x, 2);
}
