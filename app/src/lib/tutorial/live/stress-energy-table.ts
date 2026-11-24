/**
 * Chapter 6.5's table T^{μν}, with its rows and columns 0, x, y, z (the indices 0, 1, 2, 3), for seven contents, and
 * as an observer moving along x or z with the speed βc finds it, by chapter 6.2's rule for a tensor of rank 2,
 *
 *   T′^{μν} = Λ^μ_α Λ^ν_β T^{αβ},   Λ^0_0 = Λ^d_d = γ,   Λ^0_d = Λ^d_0 = −γβ   (d the direction of motion).
 *
 * The spatial block is the flow of momentum: +p for a gas, −τ for a stretched rod. Dust has ρu^μu^ν; a beam along z
 * the four equal entries F/c; light in a box the pressure ⅓𝒰; the Casimir gap u(1, −1, −1, 3) with the plates'
 * normal along z. From the table the chapter's readouts: T⁰⁰; the trace η_{μν}T^{μν} = −T⁰⁰ + T¹¹ + T²² + T³³, the
 * same for every observer; the source T⁰⁰ + T¹¹ + T²² + T³³, what gravitates in this frame; and, for a null direction
 * k^μ = (1, 0, 0, ±1), T_{μν}k^μk^ν = T⁰⁰ ∓ 2T⁰ᶻ + Tᶻᶻ.
 *
 * The three bound contents (gas in a steel shell, beam and its bench, light in a box) are shown as their average over
 * the body, ⟨T^{μν}⟩ = (1/V)∫T^{μν}dV, with V the body's volume in the frame at hand. For a body whose table does not
 * change in time, the average follows 6.2's rule exactly: at a fixed time of the moving observer, d³x = γ d³x′, so
 * ∫T′d³x′ = (1/γ)ΛΛ∫T d³x, and the volume is V/γ. The integral itself is the average times that volume. The beam and
 * its bench run on along z, so they are taken per metre of their length and averaged over a cross-section A that
 * holds both; a boost along z leaves A alone, and one along x shortens it by γ.
 *
 * Every entry is in units of a scale chosen for the content, said by `CONTENTS[c].unit`.
 */

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** A 4 × 4 table, rows and columns 0, x, y, z. */
export type Table = number[][];

export const INDEX = ['0', 'x', 'y', 'z'] as const;

export type Direction = 'x' | 'z';
/** The index of a direction of motion in the table. */
export const AXIS: Record<Direction, 1 | 3> = { x: 1, z: 3 };

// --- the speeds ------------------------------------------------------------------------------------------------------

/** The boost slider: its range, its step, the arrow keys' step and Page Up's. */
export const BOOST = { min: -0.9, max: 0.9, step: 0.01, key: 0.05, page: 0.3 };

export const LN2 = Math.LN2;

/** The whole number k with η = k ln 2, if η is one (to the last bits of a double), for |k| ≤ 8. */
export function lnTwos(eta: number): number | undefined {
	const k = Math.round(eta / LN2);
	if (Math.abs(k) > 8) return undefined;
	return Math.abs(eta - k * LN2) <= 1e-12 * Math.max(1, Math.abs(eta)) ? k : undefined;
}

/**
 * γ = cosh η, γβ = sinh η and η = artanh β of a speed βc. At β = ±0.6, η = ±ln 2 and the two are formed from powers of
 * two, cosh(ln 2) = 5/4 and sinh(ln 2) = 3/4 exactly, so that the beam's e^{−2η} is exactly ¼.
 */
export function speed(beta: number): {
	beta: number;
	gamma: number;
	gammaBeta: number;
	eta: number;
} {
	const eta = Math.atanh(beta);
	const k = lnTwos(eta);
	if (k !== undefined) {
		const p = 2 ** k;
		return { beta, gamma: (p + 1 / p) / 2, gammaBeta: (p - 1 / p) / 2, eta: k * LN2 };
	}
	const gamma = 1 / Math.sqrt(1 - beta * beta);
	return { beta, gamma, gammaBeta: gamma * beta, eta };
}

/** The boost Λ^μ_α of an observer moving along d with the speed βc, as a table. */
export function boostMatrix(beta: number, d: Direction): Table {
	const { gamma, gammaBeta } = speed(beta);
	const L = identity();
	const i = AXIS[d];
	L[0][0] = gamma;
	L[i][i] = gamma;
	L[0][i] = -gammaBeta;
	L[i][0] = -gammaBeta;
	return L;
}

export function identity(): Table {
	return [0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => (r === c ? 1 : 0)));
}

export const copy = (t: Table): Table => t.map((r) => [...r]);

/**
 * 6.2's rule, T′^{μν} = Λ^μ_αΛ^ν_βT^{αβ}, written out for a boost along d: only the rows and columns 0 and d mix,
 *
 *   T′⁰⁰ = γ²T⁰⁰ − 2γ²β T⁰ᵈ + γ²β² Tᵈᵈ,   T′⁰ᵈ = −γ²β T⁰⁰ + γ²(1 + β²) T⁰ᵈ − γ²β Tᵈᵈ,
 *   T′ᵈᵈ = γ²β² T⁰⁰ − 2γ²β T⁰ᵈ + γ² Tᵈᵈ,   T′⁰ʲ = γT⁰ʲ − γβ Tᵈʲ,   T′ᵈʲ = −γβ T⁰ʲ + γ Tᵈʲ,
 *
 * for j neither 0 nor d, and the rest unchanged.
 */
export function boosted(t: Table, beta: number, d: Direction): Table {
	const { gamma: c, gammaBeta: s } = speed(beta);
	const i = AXIS[d];
	const out = copy(t);
	const t00 = t[0][0];
	const t0d = 0.5 * (t[0][i] + t[i][0]);
	const tdd = t[i][i];
	out[0][0] = c * c * t00 - 2 * c * s * t0d + s * s * tdd;
	out[i][i] = s * s * t00 - 2 * c * s * t0d + c * c * tdd;
	const mixed = -c * s * t00 + (c * c + s * s) * t0d - c * s * tdd;
	out[0][i] = mixed;
	out[i][0] = mixed;
	for (const j of [1, 2, 3]) {
		if (j === i) continue;
		const a = c * t[0][j] - s * t[i][j];
		const b = -s * t[0][j] + c * t[i][j];
		out[0][j] = a;
		out[j][0] = a;
		out[i][j] = b;
		out[j][i] = b;
	}
	return out;
}

// --- the readouts ----------------------------------------------------------------------------------------------------

/** η_{μν}T^{μν} = −T⁰⁰ + T¹¹ + T²² + T³³, in the signature (−, +, +, +): the same for every observer. */
export const trace = (t: Table) => -t[0][0] + t[1][1] + t[2][2] + t[3][3];

/** The sum of the diagonal momentum fluxes, T¹¹ + T²² + T³³. */
export const stressSum = (t: Table) => t[1][1] + t[2][2] + t[3][3];

/** The chapter's eq:source, T⁰⁰ + T¹¹ + T²² + T³³: what gravitates, in this frame. */
export const source = (t: Table) => t[0][0] + stressSum(t);

export type Ray = 1 | -1;

/**
 * T_{μν}k^μk^ν for k^μ = (1, 0, 0, ±1): lowering both indices flips the sign of T⁰ᶻ alone among the entries that
 * enter, so it is T⁰⁰ ∓ 2T⁰ᶻ + Tᶻᶻ.
 */
export const alongRay = (t: Table, ray: Ray) => t[0][0] - ray * (t[0][3] + t[3][0]) + t[3][3];

/** The same, by lowering with η_{μν} = diag(−1, 1, 1, 1) and summing over all sixteen. */
export function alongRayFull(t: Table, ray: Ray): number {
	const k = [1, 0, 0, ray];
	const eta = [-1, 1, 1, 1];
	let s = 0;
	for (let m = 0; m < 4; m++)
		for (let n = 0; n < 4; n++) s += eta[m] * eta[n] * t[m][n] * k[m] * k[n];
	return s;
}

/** The largest entry, by size. */
export const largest = (t: Table) => Math.max(...t.flat().map(Math.abs));

// --- the contents ----------------------------------------------------------------------------------------------------

export type Content = 'dust' | 'gas' | 'shell' | 'beam' | 'bench' | 'box' | 'casimir';

/** The gas's pressure over its energy density, p/ρc²: a tenth, as near a neutron star's centre. */
export const GAS_P = 0.1;
/** The gas's share of the energy of the gas in its steel shell; the steel has the rest. */
export const GAS_SHARE = 0.5;
/** The Casimir gap's u = −π²ħc/720a⁴ at a = 1 μm, in J m⁻³; the table is in units of |u|. */
export const CASIMIR_U = -(Math.PI ** 2 * 1.054571817e-34 * 2.99792458e8) / (720 * 1e-6 ** 4);

/** One part of a bound body, and its ∫T^{ii}dV along x, y and z in its own frame, in units of `integral`. */
export type Part = { name: string; stresses: [number, number, number] };

export type ContentInfo = {
	value: Content;
	label: string;
	/** What the table is of, in a sentence. */
	words: string;
	/** The scale of the table's entries, in LaTeX and in words. */
	unit: string;
	unitWords: string;
	/** The table in the content's own frame (the lab's for the beam), in units of `unit`. */
	rest: Table;
	/** For a bound body: its parts, how its integral is taken, and the unit of the integral. */
	bound?: {
		parts: Part[];
		/** A body of finite volume, or one that runs on along z, taken per metre. */
		measure: 'volume' | 'perMetre';
		integral: string;
		integralWords: string;
	};
};

const diag = (a: number, b: number, c: number, d: number): Table => [
	[a, 0, 0, 0],
	[0, b, 0, 0],
	[0, 0, c, 0],
	[0, 0, 0, d]
];

/** (F/c) k^μk^ν with k^μ = (1, 0, 0, 1), in units of F/c. */
const beamTable = (): Table => [
	[1, 0, 0, 1],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[1, 0, 0, 1]
];

/** The gas's ∫T^{ii}dV along each axis, pV, in units of the whole body's energy E. */
const GAS_STRESS = GAS_P * GAS_SHARE;
const THIRD = 1 / 3;

export const CONTENTS: Record<Content, ContentInfo> = {
	dust: {
		value: 'dust',
		label: 'Dust',
		words: 'dust',
		unit: '\\htmlClass{q-matter}{\\rho} c^2',
		unitWords: 'ρc²',
		rest: diag(1, 0, 0, 0)
	},
	gas: {
		value: 'gas',
		label: 'Gas at rest',
		words: 'a gas at rest',
		unit: '\\htmlClass{q-matter}{\\rho} c^2',
		unitWords: 'ρc²',
		rest: diag(1, GAS_P, GAS_P, GAS_P)
	},
	shell: {
		value: 'shell',
		label: 'Gas in a steel shell',
		words: 'a gas in a steel shell, averaged over the body',
		unit: 'E/V',
		unitWords: 'E/V',
		rest: diag(1, 0, 0, 0),
		bound: {
			parts: [
				{ name: 'the gas', stresses: [GAS_STRESS, GAS_STRESS, GAS_STRESS] },
				{ name: 'the steel', stresses: [-GAS_STRESS, -GAS_STRESS, -GAS_STRESS] }
			],
			measure: 'volume',
			integral: 'E',
			integralWords: 'E'
		}
	},
	beam: {
		value: 'beam',
		label: 'Beam along z',
		words: 'a beam of light along z',
		unit: 'F/c',
		unitWords: 'F/c',
		rest: beamTable()
	},
	bench: {
		value: 'bench',
		label: 'Beam and its bench',
		words: 'a beam and its bench, averaged over a cross-section A that holds both',
		unit: 'P/cA',
		unitWords: 'P/cA',
		// the beam's table, and the bench's tension −P/c over A along z; the bench's own mass left out
		rest: [
			[1, 0, 0, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[1, 0, 0, 0]
		],
		bound: {
			parts: [
				{ name: 'the beam', stresses: [0, 0, 1] },
				{ name: 'the bench', stresses: [0, 0, -1] }
			],
			measure: 'perMetre',
			integral: 'P/c',
			integralWords: 'P/c'
		}
	},
	box: {
		value: 'box',
		label: 'Light in a box',
		words: 'light in a mirrored box, averaged over the box',
		unit: 'E/V',
		unitWords: 'E/V',
		rest: diag(1, 0, 0, 0),
		bound: {
			parts: [
				{ name: 'the light', stresses: [THIRD, THIRD, THIRD] },
				{ name: 'the walls', stresses: [-THIRD, -THIRD, -THIRD] }
			],
			measure: 'volume',
			integral: 'E',
			integralWords: 'E'
		}
	},
	casimir: {
		value: 'casimir',
		label: 'Casimir gap',
		words: 'the Casimir gap',
		unit: '|u|',
		unitWords: '|u|',
		// u(1, −1, −1, 3) with u < 0
		rest: diag(-1, 1, 1, -3)
	}
};

export const ORDER: Content[] = ['dust', 'gas', 'shell', 'beam', 'bench', 'box', 'casimir'];

/** The table of a content for an observer moving along d at βc. */
export const tableOf = (c: Content, beta: number, d: Direction) =>
	boosted(CONTENTS[c].rest, beta, d);

/**
 * The volume, or for the bench the cross-section, of a bound body in the frame at hand over its own: 1/γ, except for
 * the bench boosted along its length, whose cross-section a boost along z leaves alone.
 */
export function shrink(c: Content, beta: number, d: Direction): number {
	const b = CONTENTS[c].bound;
	if (!b) return 1;
	if (b.measure === 'perMetre' && d === 'z') return 1;
	return 1 / speed(beta).gamma;
}

/** ∫T^{ij}dV over a bound body in the frame at hand: the average times the volume, in units of its `integral`. */
export function integrated(c: Content, beta: number, d: Direction): Table {
	const k = shrink(c, beta, d);
	return tableOf(c, beta, d).map((row) => row.map((v) => v * k));
}

/** The nine ∫T^{ij}dV of a bound body in its own frame, the sum of its parts': all zero. */
export function ownIntegral(c: Content): number[][] | undefined {
	const b = CONTENTS[c].bound;
	if (!b) return undefined;
	const out = [0, 1, 2].map(() => [0, 0, 0]);
	for (const p of b.parts) for (let i = 0; i < 3; i++) out[i][i] += p.stresses[i];
	// and the average's own spatial block, times the volume
	const rest = CONTENTS[c].rest;
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++) if (i !== j) out[i][j] += rest[i + 1][j + 1];
	return out;
}

/** Each part's ∫(T¹¹ + T²² + T³³)dV in the body's own frame. */
export const partSums = (c: Content) =>
	(CONTENTS[c].bound?.parts ?? []).map((p) => ({
		name: p.name,
		sum: p.stresses[0] + p.stresses[1] + p.stresses[2]
	}));

// --- the cells -------------------------------------------------------------------------------------------------------

export type Sign = 'positive' | 'negative' | 'zero';

/** Below this, in units of the content's scale, an entry is zero. */
export const ZERO = 5e-13;

export const signOf = (v: number): Sign =>
	Math.abs(v) < ZERO ? 'zero' : v > 0 ? 'positive' : 'negative';

/** The block an entry belongs to: the energy density, the energy flux and momentum density, or the momentum flux. */
export type Block = 'energy' | 'flux' | 'momentum';
export const blockOf = (r: number, c: number): Block =>
	r === 0 && c === 0 ? 'energy' : r === 0 || c === 0 ? 'flux' : 'momentum';

/** How strongly a cell is tinted, 0 to 1: its size over the table's largest entry, with a floor for small ones. */
export function strength(v: number, max: number): number {
	if (Math.abs(v) < ZERO || max < ZERO) return 0;
	return 0.25 + 0.75 * Math.min(1, Math.abs(v) / max);
}

// --- the sliders -----------------------------------------------------------------------------------------------------

/** A speed on the slider's grid of hundredths, within its range. */
export const hundredths = (v: number) => Math.round(clamp(v, BOOST.min, BOOST.max) * 100) / 100;

/**
 * One press of a key on the slider: the next point of the key's grid, with step the key's size, in the key's
 * direction, within range; from 0.62 that is 0.65 up and 0.6 down.
 */
export function keyed(v: number, direction: number, step: number): number {
	const k = v / step;
	const n = direction > 0 ? Math.floor(k + 1e-9) + 1 : Math.ceil(k - 1e-9) - 1;
	return hundredths(Math.round(n * step * 1e9) / 1e9);
}

// --- the predictions -------------------------------------------------------------------------------------------------

export type Settings = { content: Content; beta: number; direction: Direction };

export const OPENING: Settings = { content: 'beam', beta: 0, direction: 'z' };

/** The first is answered once the reader has put the light in a box and looked at it at rest. */
export const firstDone = (done: boolean, s: Settings) =>
	done || (s.content === 'box' && s.beta === 0);

/** The speed of the second: the beam boosted along itself at 0.6c. */
export const ALONG = 0.6;

/** The second is answered once the reader has boosted the beam along z, its own direction, at 0.6c. */
export const secondDone = (done: boolean, s: Settings) =>
	done || (s.content === 'beam' && s.direction === 'z' && s.beta === ALONG);

/** The numbers of the second answer: the factor by which every entry fell, e^{−2η}, the trace and the source. */
export function secondAnswer() {
	const rest = tableOf('beam', 0, 'z');
	const moved = tableOf('beam', ALONG, 'z');
	const { eta } = speed(ALONG);
	return {
		factors: [moved[0][0] / rest[0][0], moved[0][3] / rest[0][3], moved[3][3] / rest[3][3]],
		expected: Math.exp(-2 * eta),
		eta,
		trace: trace(moved),
		source: source(moved)
	};
}

// --- the words -------------------------------------------------------------------------------------------------------

/** A number to three figures, with a true minus sign; zero as 0. */
export function three(v: number): string {
	if (Math.abs(v) < ZERO) return '0';
	return v.toPrecision(3).replace('-', '−');
}

/** The same for LaTeX. */
export const threeTex = (v: number) => three(v).replace('−', '-');

/** A speed on the slider, to two decimals, with a true minus sign. */
export function two(v: number): string {
	const s = v.toFixed(2);
	return (s === '-0.00' ? '0.00' : s).replace('-', '−');
}

/** The rapidity in words: "ln 2 = 0.693" at ±0.6c, else three figures. */
export function etaWords(eta: number): string {
	const k = lnTwos(eta);
	if (k === undefined) return three(eta);
	if (k === 0) return '0';
	const name = Math.abs(k) === 1 ? 'ln 2' : `ln ${2 ** Math.abs(k)}`;
	return `${k < 0 ? '−' : ''}${name} = ${three(eta)}`;
}

/** The same in LaTeX. */
export const etaTex = (eta: number) =>
	etaWords(eta)
		.replace(/ln (\d+)/, '\\ln $1')
		.replace(/−/g, '-');

/** Who looks: at rest with the contents, or moving at βc along a direction. */
export function frameWords(beta: number, d: Direction): string {
	if (beta === 0) return 'at rest';
	return `for an observer moving at ${two(Math.abs(beta))}c along ${beta > 0 ? '+' : '−'}${d}`;
}

/** The table read out in words, row by row, for the figure's description. */
export function tableWords(t: Table): string {
	return t
		.map((row, r) => `row ${INDEX[r]}: ${row.map((v, c) => `${INDEX[c]} ${three(v)}`).join(', ')}`)
		.join('; ');
}
