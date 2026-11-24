/**
 * Chapter 8.1's two-paths figure: a Mach–Zehnder interferometer for a particle sent in along L, with a delay φ on
 * path L, a record of the path whose two states overlap by cos θ, and an absorber that can block path R. The engine
 * multiplies the chapter's tables, the mirror U = (1, i; i, 1)/√2, the delay D = diag(e^{iφ}, 1) and the record, on
 * the four-entry state of the mass and the record, ordered (L0, L1, R0, R1) as in the chapter; the closed forms
 * P_R = ½(1 + cos θ cos φ) and P_L = ½(1 − cos θ cos φ) are here only to be checked against. Settings, words and
 * predictions are pure functions too.
 */
import { stepped, type Range } from './near-to-far';

export { stepped, type Range };

// --- complex numbers and tables ----------------------------------------------------------------------------------

/** A complex number. */
export interface Complex {
	re: number;
	im: number;
}
/** A table of complex numbers, as rows. */
export type Table = Complex[][];

export const cx = (re: number, im = 0): Complex => ({ re, im });
export const ZERO = cx(0);
export const ONE = cx(1);
export const I = cx(0, 1);
export const plus = (a: Complex, b: Complex): Complex => cx(a.re + b.re, a.im + b.im);
export const times = (a: Complex, b: Complex): Complex =>
	cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export const conj = (a: Complex): Complex => cx(a.re, -a.im);
/** The squared size |a|², a probability when a is an amplitude. */
export const abs2 = (a: Complex) => a.re * a.re + a.im * a.im;
/** e^{iα}. */
export const expi = (alpha: number): Complex => cx(Math.cos(alpha), Math.sin(alpha));
export const real = (x: number) => cx(x);

/** The table AB. */
export function multiply(a: Table, b: Table): Table {
	return a.map((row) =>
		b[0].map((_, j) => row.reduce((s, aik, k) => plus(s, times(aik, b[k][j])), ZERO))
	);
}

/** The table times a column. */
export const apply = (a: Table, v: Complex[]): Complex[] =>
	a.map((row) => row.reduce((s, aik, k) => plus(s, times(aik, v[k])), ZERO));

/** The conjugate transpose A†: rows and columns swapped, every entry conjugated. */
export const dagger = (a: Table): Table => a[0].map((_, j) => a.map((row) => conj(row[j])));

/** The n × n table of ones on the diagonal. */
export const identity = (n: number): Table =>
	Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? ONE : ZERO)));

/**
 * The table that acts with A on the first thing and B on the second, for a state ordered with the first thing's
 * index outermost: (A ⊗ B)[2i + k][2j + l] = A[i][j] B[k][l].
 */
export function kron(a: Table, b: Table): Table {
	const n = b.length;
	return Array.from({ length: a.length * n }, (_, r) =>
		Array.from({ length: a[0].length * b[0].length }, (_, c) =>
			times(a[Math.floor(r / n)][Math.floor(c / b[0].length)], b[r % n][c % b[0].length])
		)
	);
}

/** The largest distance of A†A from the identity, entry by entry: zero for a unitary table. */
export function unitarityError(a: Table): number {
	const p = multiply(dagger(a), a);
	let worst = 0;
	p.forEach((row, i) =>
		row.forEach((z, j) => (worst = Math.max(worst, Math.hypot(z.re - (i === j ? 1 : 0), z.im))))
	);
	return worst;
}

// --- the chapter's tables ------------------------------------------------------------------------------------------

const H = Math.SQRT1_2;

/** The half-silvered mirror, U = (1, i; i, 1)/√2: through with 1/√2, reflected with i/√2. */
export const MIRROR: Table = [
	[real(H), cx(0, H)],
	[cx(0, H), real(H)]
];

/** The delay on path L, D = diag(e^{iφ}, 1). */
export const delay = (phi: number): Table => [
	[expi(phi), ZERO],
	[ZERO, ONE]
];

/**
 * The record, made while the mass is in its two places: the record starts in |0⟩ = (1, 0) and is left there on
 * path L, |e_L⟩ = (1, 0), and turned to |e_R⟩ = (cos θ, sin θ) on path R. As a table on (L0, L1, R0, R1), the
 * identity on L and the turn by θ on R.
 */
export function recorder(theta: number): Table {
	const c = real(Math.cos(theta));
	const s = real(Math.sin(theta));
	return [
		[ONE, ZERO, ZERO, ZERO],
		[ZERO, ONE, ZERO, ZERO],
		[ZERO, ZERO, c, real(-Math.sin(theta))],
		[ZERO, ZERO, s, c]
	];
}

/** Which path is blocked by an absorber between the two mirrors, if any. */
export type Block = 'none' | 'L' | 'R';

/** The absorber on (L0, L1, R0, R1): it takes away whatever arrives on its path. Not unitary. */
export function absorber(block: Block): Table {
	const keep = [block !== 'L', block !== 'L', block !== 'R', block !== 'R'];
	return keep.map((k, i) => keep.map((_, j) => (i === j && k ? ONE : ZERO)));
}

/** The particle sent in along L, the record not yet made: |L⟩|0⟩ = (1, 0, 0, 0). */
export const ENTRY: Complex[] = [ONE, ZERO, ZERO, ZERO];

/** The record's angle θ for an overlap ⟨e_R|e_L⟩ = cos θ, held to 0 to 1. */
export const thetaOf = (overlap: number) => Math.acos(Math.max(0, Math.min(1, overlap)));

/** The interferometer without a record, the chapter's UDU|L⟩ on the two-entry state. */
export const twoEntry = (phi: number): Complex[] =>
	apply(multiply(MIRROR, multiply(delay(phi), MIRROR)), [ONE, ZERO]);

/**
 * The whole instrument as one table on (L0, L1, R0, R1): the first mirror on the mass, the record, the delay, the
 * absorber and the second mirror, (U ⊗ 1)(A)(D ⊗ 1)(C)(U ⊗ 1), read from the right.
 */
export function instrument(phi: number, overlap: number, block: Block): Table {
	const one = identity(2);
	const tables = [
		kron(MIRROR, one),
		recorder(thetaOf(overlap)),
		kron(delay(phi), one),
		absorber(block),
		kron(MIRROR, one)
	];
	return tables.reduce((m, t) => multiply(t, m), identity(4));
}

/** The state that leaves, and the exits' probabilities: P_L, P_R and the share absorbed. */
export function run(phi: number, overlap: number, block: Block = 'none') {
	const out = apply(instrument(phi, overlap, block), ENTRY);
	const pL = abs2(out[0]) + abs2(out[1]);
	const pR = abs2(out[2]) + abs2(out[3]);
	return { out, pL, pR, absorbed: 1 - pL - pR };
}

/**
 * The amplitudes that reach exit R, path by path, by running the instrument with the other path blocked: by way of
 * L, with the record in |0⟩, ie^{iφ}/2; by way of R, i cos θ/2 with the record in |0⟩ and i sin θ/2 in |1⟩. The
 * first two add, as the sum; the third has no partner, since path L leaves the record in |0⟩.
 */
export function arrows(phi: number, overlap: number, blocked: boolean) {
	const viaL = apply(instrument(phi, overlap, 'R'), ENTRY);
	const viaR = blocked ? [ZERO, ZERO, ZERO, ZERO] : apply(instrument(phi, overlap, 'L'), ENTRY);
	const byL = viaL[2];
	const byR = viaR[2];
	const other = viaR[3];
	return { byL, byR, other, sum: plus(byL, byR) };
}

// --- the chapter's closed forms, to check the engine against ----------------------------------------------------

export const closedPR = (phi: number, overlap: number, blocked = false) =>
	blocked ? 0.25 : 0.5 * (1 + overlap * Math.cos(phi));
export const closedPL = (phi: number, overlap: number, blocked = false) =>
	blocked ? 0.25 : 0.5 * (1 - overlap * Math.cos(phi));

// --- the figure's settings and readings ----------------------------------------------------------------------------

/** The settings: the delay in twelfths of π, the records' overlap cos θ, and whether path R is blocked. */
export interface Settings {
	k: number;
	overlap: number;
	blocked: boolean;
}

/** The figure opens at φ = π/3 with no record, overlap 1, where P_R = 0.75. */
export const OPENING: Settings = { k: 4, overlap: 1, blocked: false };

/** The delay φ = kπ/12, k from 0 to 24: a twelfth of π a press, a quarter with Shift. */
export const PHI: Range = { min: 0, max: 24, step: 1, key: 1, large: 3 };
/**
 * The record of the path, 1 − cos θ: from 0, no record (overlap 1), to 1, a perfect record (overlap 0); 0.05 a
 * press, 0.25 with Shift.
 */
export const RECORD: Range = { min: 0, max: 1, step: 0.05, key: 0.05, large: 0.25, stops: [0.5] };

export const phiOf = (k: number) => (k * Math.PI) / 12;

/** A value held to a range and its grid. */
export function landed(v: number, r: Range): number {
	const k = Math.round(Math.max(r.min, Math.min(r.max, v)) / r.step);
	return Math.round(k * r.step * 1e9) / 1e9 || 0;
}

/** The overlap for a position of the record's slider, and back, on the grid of 0.05. */
export const overlapOf = (record: number) => landed(1 - landed(record, RECORD), RECORD);
export const recordOf = (overlap: number) => landed(1 - overlap, RECORD);

/** What the readouts show, from the engine: the exits, the share absorbed, the arrows and the interference term. */
export function reading(s: Settings) {
	const phi = phiOf(s.k);
	const r = run(phi, s.overlap, s.blocked ? 'R' : 'none');
	const a = arrows(phi, s.overlap, s.blocked);
	// what the two paths give alone, and what adding the amplitudes before squaring adds to it
	const alone = abs2(a.byL) + abs2(a.byR) + abs2(a.other);
	return {
		phi,
		...r,
		...a,
		alone,
		term: r.pR - alone,
		closedR: closedPR(phi, s.overlap, s.blocked),
		closedL: closedPL(phi, s.overlap, s.blocked)
	};
}

/** P_R over the delay from 0 to 2π, in n steps, from the engine. */
export function fringe(overlap: number, blocked: boolean, n = 96) {
	return Array.from({ length: n + 1 }, (_, i) => {
		const phi = (2 * Math.PI * i) / n;
		return { phi, p: run(phi, overlap, blocked ? 'R' : 'none').pR };
	});
}

/** The fringes' lowest and highest P_R and the swing between them, from the engine at φ = π and φ = 0. */
export function swingOf(overlap: number, blocked: boolean) {
	const a = run(0, overlap, blocked ? 'R' : 'none').pR;
	const b = run(Math.PI, overlap, blocked ? 'R' : 'none').pR;
	const lo = Math.min(a, b);
	const hi = Math.max(a, b);
	return { lo, hi, swing: hi - lo };
}

// --- the predictions --------------------------------------------------------------------------------------------

const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;

/** The first is answered once the record is perfect, overlap 0, and the delay is zero (or a whole turn). */
export const noteFirst = (done: boolean, s: Settings) =>
	done || (!s.blocked && near(s.overlap, 0) && (s.k === 0 || s.k === 24));
/** The second, once the record is half-way, overlap 0.5. */
export const noteSecond = (done: boolean, s: Settings) =>
	done || (!s.blocked && near(s.overlap, 0.5));
/** The third, once path R is blocked. */
export const noteThird = (done: boolean, s: Settings) => done || s.blocked;

// --- the words ------------------------------------------------------------------------------------------------------

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** The delay kπ/12 in lowest terms: "0", "π/12", "π/3", "5π/12", "π", "2π". */
export function phiWords(k: number): string {
	if (k === 0) return '0';
	const g = gcd(k, 12);
	const n = k / g;
	const d = 12 / g;
	return `${n === 1 ? '' : n}π${d === 1 ? '' : `/${d}`}`;
}

/** The same in LaTeX: "0", "\pi/12", "5\pi/12", "2\pi". */
export const phiTex = (k: number) => phiWords(k).replace('π', '\\pi');

/** A number to two decimals, with a true minus sign and no "−0.00". */
export function two(x: number): string {
	const r = Math.round(x * 100) / 100;
	if (r === 0) return '0.00';
	return (r < 0 ? '−' : '') + Math.abs(r).toFixed(2);
}

/** The record's angle θ in whole degrees, for an overlap cos θ. */
export const degrees = (overlap: number) => Math.round((thetaOf(overlap) * 180) / Math.PI);
