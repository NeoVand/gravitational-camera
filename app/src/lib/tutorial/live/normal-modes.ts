/**
 * Chapter 4.3's disc of masses on springs, for its live figure. Nineteen equal masses sit on a triangular lattice,
 * a hexagon of side two spacings, in the plane; each is joined to its nearest neighbours, one spacing away, by equal
 * springs, 42 in all, unstretched when the disc is at rest. The 38 displacements make one list 𝐪 = (x₀, y₀, x₁, y₁,
 * …), with lengths in spacings. The units are those of the springs and masses: k = 1 and m = 1, so that a time is in
 * units of √(m/k) and a frequency in units of √(k/m).
 *
 * For small displacements the stretch of the spring from a to b, along the unit vector n̂ from a to b, is
 * n̂ · (𝐪_b − 𝐪_a), and the stored energy ½ 𝐪ᵀ𝐊𝐪 is the sum of ½ k (stretch)². So 𝐊 is the sum over springs of
 * k n̂n̂ᵀ in the blocks (a, a) and (b, b) and −k n̂n̂ᵀ in (a, b) and (b, a). The mass matrix 𝐌 holds each mass twice.
 * The chapter's D = 𝐌^(−1/2) 𝐊 𝐌^(−1/2) is diagonalized by Jacobi's rotations, which find every eigenvalue to the
 * rounding of the largest, however close two of them lie; its unit eigenvectors 𝐞_n give the normal modes
 * 𝐯_n = 𝐌^(−1/2) 𝐞_n at the frequencies ω_n.
 *
 * Three modes are zero modes: the two slides and the turn, which stretch no spring. Many others come in pairs (and
 * one in a triple) of equal frequency, because the hexagon looks the same after a turn by 60°. Within such a group
 * any mix of the modes is again a mode, so the solver's choice is arbitrary; the figure makes it the same every time
 * by taking, within each group, the modes that the two mirrors of the hexagon (x → −x and y → −y) send to plus or
 * minus themselves. The lowest pair is then the squash along the axes and the squash at 45°. The zero modes are
 * taken as the slide along x, the slide along y and the turn.
 *
 * A shape 𝐪 has the mass-weighted amplitudes a_n = 𝐞_nᵀ 𝐌^(1/2) 𝐪, and its shares a_n²/Σa² add up to one. Rayleigh's
 * quotient 𝐪ᵀ𝐊𝐪 / 𝐪ᵀ𝐌𝐪, with the zero-mode parts of 𝐪 removed as the chapter's bound assumes, is the average of the
 * ω_n² weighted by the shares of the ringing modes, so it is never below the lowest of them.
 */

// --- the disc ----------------------------------------------------------------------------------------------------

/** The hexagon's side, in spacings, and the number of masses and of coordinates. */
export const SIDE = 2;
export const COUNT = 19;
export const COORDS = 2 * COUNT;
/** The masses and the springs' stiffness, the units of the figure. */
export const MASS = 1;
export const STIFFNESS = 1;

/** The rest places of the masses, in spacings: the lattice sites i â₁ + j â₂ with |i|, |j|, |i + j| ≤ 2. */
export const SITES: readonly (readonly [number, number])[] = (() => {
	const out: [number, number][] = [];
	for (let j = SIDE; j >= -SIDE; j--)
		for (let i = -SIDE; i <= SIDE; i++)
			if (Math.abs(i + j) <= SIDE) out.push([i + j / 2, (j * Math.sqrt(3)) / 2]);
	return out;
})();

/** The springs: the two masses each joins, nearest neighbours one spacing apart. */
export const SPRINGS: readonly (readonly [number, number])[] = (() => {
	const out: [number, number][] = [];
	for (let a = 0; a < COUNT; a++)
		for (let b = a + 1; b < COUNT; b++) {
			const d = Math.hypot(SITES[b][0] - SITES[a][0], SITES[b][1] - SITES[a][1]);
			if (Math.abs(d - 1) < 1e-9) out.push([a, b]);
		}
	return out;
})();

/** The masses on the rim of the hexagon, more than one and a half spacings from the centre: twelve of them. */
export const EDGE: readonly number[] = SITES.map((_, a) => a).filter(
	(a) => Math.hypot(SITES[a][0], SITES[a][1]) > 1.5
);

/** The unit vector from the centre outward through the mass a. */
export function outward(a: number): [number, number] {
	const r = Math.hypot(SITES[a][0], SITES[a][1]);
	return r > 0 ? [SITES[a][0] / r, SITES[a][1] / r] : [0, 0];
}

/** The stiffness matrix 𝐊, row by row, COORDS × COORDS. */
export function stiffnessMatrix(k = STIFFNESS): number[][] {
	const K = Array.from({ length: COORDS }, () => new Array<number>(COORDS).fill(0));
	for (const [a, b] of SPRINGS) {
		const nx = SITES[b][0] - SITES[a][0];
		const ny = SITES[b][1] - SITES[a][1];
		const nn = [
			[nx * nx, nx * ny],
			[ny * nx, ny * ny]
		];
		for (let r = 0; r < 2; r++)
			for (let c = 0; c < 2; c++) {
				const v = k * nn[r][c];
				K[2 * a + r][2 * a + c] += v;
				K[2 * b + r][2 * b + c] += v;
				K[2 * a + r][2 * b + c] -= v;
				K[2 * b + r][2 * a + c] -= v;
			}
	}
	return K;
}

/** The stretch of each spring for the displacements 𝐪, to first order: n̂ · (𝐪_b − 𝐪_a). */
export function stretches(q: ArrayLike<number>): Float64Array {
	const out = new Float64Array(SPRINGS.length);
	SPRINGS.forEach(([a, b], s) => {
		const nx = SITES[b][0] - SITES[a][0];
		const ny = SITES[b][1] - SITES[a][1];
		out[s] = nx * (q[2 * b] - q[2 * a]) + ny * (q[2 * b + 1] - q[2 * a + 1]);
	});
	return out;
}

// --- Jacobi's method ---------------------------------------------------------------------------------------------

export interface Eigen {
	/** The eigenvalues, smallest first. */
	values: number[];
	/** The unit eigenvectors, one per value, in the same order. */
	vectors: number[][];
}

/**
 * The eigenvalues and unit eigenvectors of a symmetric matrix, by Jacobi's cyclic rotations: each turns two axes in
 * the plane of one entry off the diagonal so as to make that entry zero, and the sweeps go on until every entry off
 * the diagonal is below the rounding of the diagonal. Each rotation is orthogonal, so the eigenvalues are found to
 * the rounding of the largest and the eigenvectors stay perpendicular, however close two eigenvalues lie.
 */
export function eigenSymmetric(matrix: readonly (readonly number[])[]): Eigen {
	const n = matrix.length;
	const a = matrix.map((row) => row.slice());
	const v = Array.from({ length: n }, (_, i) => {
		const row = new Array<number>(n).fill(0);
		row[i] = 1;
		return row;
	});
	let scale = 0;
	for (let i = 0; i < n; i++)
		for (let j = 0; j < n; j++) scale = Math.max(scale, Math.abs(a[i][j]));
	for (let sweep = 0; sweep < 100; sweep++) {
		let off = 0;
		for (let p = 0; p < n; p++)
			for (let q = p + 1; q < n; q++) off = Math.max(off, Math.abs(a[p][q]));
		if (off <= 1e-15 * scale) break;
		for (let p = 0; p < n; p++)
			for (let q = p + 1; q < n; q++) {
				const apq = a[p][q];
				if (Math.abs(apq) <= 1e-300) continue;
				// the angle that makes a[p][q] zero: t = tan θ, the smaller root of t² + 2τt − 1 = 0
				const tau = (a[q][q] - a[p][p]) / (2 * apq);
				const t = Math.sign(tau || 1) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
				const c = 1 / Math.sqrt(1 + t * t);
				const s = t * c;
				for (let k = 0; k < n; k++) {
					const akp = a[k][p];
					const akq = a[k][q];
					a[k][p] = c * akp - s * akq;
					a[k][q] = s * akp + c * akq;
				}
				for (let k = 0; k < n; k++) {
					const apk = a[p][k];
					const aqk = a[q][k];
					a[p][k] = c * apk - s * aqk;
					a[q][k] = s * apk + c * aqk;
				}
				for (let k = 0; k < n; k++) {
					const vkp = v[k][p];
					const vkq = v[k][q];
					v[k][p] = c * vkp - s * vkq;
					v[k][q] = s * vkp + c * vkq;
				}
			}
	}
	const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => a[i][i] - a[j][j]);
	return {
		values: order.map((i) => a[i][i]),
		vectors: order.map((i) => v.map((row) => row[i]))
	};
}

// --- the mirrors of the hexagon ------------------------------------------------------------------------------------

/** The mirror (x, y) → (fx·x, fy·y) acting on a list of displacements. */
function mirror(fx: 1 | -1, fy: 1 | -1): (q: readonly number[]) => number[] {
	const to = SITES.map(([x, y]) =>
		SITES.findIndex(([u, w]) => Math.abs(u - fx * x) < 1e-9 && Math.abs(w - fy * y) < 1e-9)
	);
	return (q) => {
		const out = new Array<number>(COORDS).fill(0);
		for (let a = 0; a < COUNT; a++) {
			out[2 * to[a]] = fx * q[2 * a];
			out[2 * to[a] + 1] = fy * q[2 * a + 1];
		}
		return out;
	};
}
const mirrorX = mirror(-1, 1);
const mirrorY = mirror(1, -1);

const dot = (u: ArrayLike<number>, w: ArrayLike<number>) => {
	let s = 0;
	for (let i = 0; i < u.length; i++) s += u[i] * w[i];
	return s;
};

/** A vector of unit length, with its entry of largest size positive (the first such entry, if several tie). */
function settle(u: number[]): number[] {
	const n = Math.sqrt(dot(u, u));
	let big = 0;
	for (const x of u) big = Math.max(big, Math.abs(x));
	const lead = u.find((x) => Math.abs(x) >= big * (1 - 1e-6)) ?? 1;
	const f = (lead < 0 ? -1 : 1) / n;
	return u.map((x) => x * f);
}

// --- the modes -----------------------------------------------------------------------------------------------------

export type Kind = 'slide-x' | 'slide-y' | 'turn' | 'ring';

export interface Mode {
	/** Its place in the list, 0 to 37, by frequency. */
	index: number;
	/** The angular frequency ω_n, in units of √(k/m). */
	omega: number;
	/** The unit eigenvector 𝐞_n of D. */
	e: Float64Array;
	/** The pattern 𝐯_n = 𝐌^(−1/2) 𝐞_n, the displacements of the masses. */
	v: Float64Array;
	kind: Kind;
	/** The group of modes of the same frequency it belongs to, and its place in that group. */
	group: number;
	member: number;
}

/** A group of modes of one frequency: the first mode's index and how many there are. */
export interface Note {
	omega: number;
	first: number;
	size: number;
	/** True for the group of the three zero modes. */
	zero: boolean;
}

/** Two eigenvalues closer than this share a group. */
const SAME = 1e-8;

function build(): { modes: Mode[]; notes: Note[] } {
	const K = stiffnessMatrix();
	// D = 𝐌^(−1/2) 𝐊 𝐌^(−1/2); with equal masses it is 𝐊/m
	const D = K.map((row) => row.map((x) => x / MASS));
	const { values, vectors } = eigenSymmetric(D);
	const top = values[values.length - 1];

	// the zero modes: the slides and the turn, made unit in the mass-weighted product
	const slideX = SITES.flatMap(() => [1, 0]);
	const slideY = SITES.flatMap(() => [0, 1]);
	const turn = SITES.flatMap(([x, y]) => [-y, x]);
	const zero = [slideX, slideY, turn].map((u) => settle(u.map((x) => x * Math.sqrt(MASS))));

	const modes: Mode[] = [];
	const notes: Note[] = [];
	const kinds: Kind[] = ['slide-x', 'slide-y', 'turn'];
	zero.forEach((e, i) =>
		modes.push({
			index: i,
			omega: 0,
			e: Float64Array.from(e),
			v: Float64Array.from(e, (x) => x / Math.sqrt(MASS)),
			kind: kinds[i],
			group: 0,
			member: i
		})
	);
	notes.push({ omega: 0, first: 0, size: 3, zero: true });

	let i = 3;
	while (i < COORDS) {
		let j = i;
		while (j + 1 < COORDS && Math.abs(values[j + 1] - values[i]) <= SAME * top) j++;
		let basis = vectors.slice(i, j + 1);
		if (basis.length > 1) {
			// the modes of the group that the two mirrors send to ± themselves: eigenvectors of P_y + 2 P_x within it
			const S = basis.map((u) => {
				const w = mirrorY(u).map((y, k) => y + 2 * mirrorX(u)[k]);
				return basis.map((b) => dot(b, w));
			});
			const sym = S.map((row, r) => row.map((x, c) => (x + S[c][r]) / 2));
			const { vectors: turnIn } = eigenSymmetric(sym);
			// the evenest first
			basis = turnIn
				.slice()
				.reverse()
				.map((c) => basis[0].map((_, k) => c.reduce((s, cr, r) => s + cr * basis[r][k], 0)));
		}
		const omega = Math.sqrt(
			Math.max(0, values.slice(i, j + 1).reduce((s, x) => s + x, 0) / (j - i + 1))
		);
		const group = notes.length;
		basis.forEach((u, member) => {
			const e = settle(u);
			modes.push({
				index: i + member,
				omega,
				e: Float64Array.from(e),
				v: Float64Array.from(e, (x) => x / Math.sqrt(MASS)),
				kind: 'ring',
				group,
				member
			});
		});
		notes.push({ omega, first: i, size: j - i + 1, zero: false });
		i = j + 1;
	}
	return { modes, notes };
}

const built = build();
/** The 38 modes, the three zero modes first, then by frequency. */
export const MODES: readonly Mode[] = built.modes;
/** The groups of modes of one frequency, in order: the zero modes first. */
export const NOTES: readonly Note[] = built.notes;
/** The index of the first ringing mode, and the lowest ringing frequency ω₁. */
export const FIRST_RINGING = 3;
export const LOWEST = MODES[FIRST_RINGING].omega;
/** The highest frequency. */
export const HIGHEST = MODES[COORDS - 1].omega;

// --- a shape and its modes -----------------------------------------------------------------------------------------

/** The mass-weighted amplitudes a_n = 𝐞_nᵀ 𝐌^(1/2) 𝐪 of the displacements 𝐪. */
export function amplitudes(q: ArrayLike<number>): Float64Array {
	const y = Float64Array.from(q, (x) => x * Math.sqrt(MASS));
	return Float64Array.from(MODES, (m) => dot(m.e, y));
}

/** The shares a_n²/Σa² of each mode in a shape with the amplitudes a, or all zero if the shape is the rest. */
export function shares(a: ArrayLike<number>): Float64Array {
	const total = dot(a, a);
	return Float64Array.from(a, (x) => (total > 0 ? (x * x) / total : 0));
}

/** The shares of each group of modes of one frequency, in the order of NOTES. */
export function noteShares(share: ArrayLike<number>): Float64Array {
	return Float64Array.from(NOTES, (n) => {
		let s = 0;
		for (let k = n.first; k < n.first + n.size; k++) s += share[k];
		return s;
	});
}

export interface Quotient {
	/**
	 * The square root of Rayleigh's quotient 𝐪ᵀ𝐊𝐪 / 𝐪ᵀ𝐌𝐪 for the shape with its zero-mode parts removed, in units of
	 * √(k/m); undefined if nothing is left once they are removed.
	 */
	omega: number | undefined;
	/** The share of the shape in the zero modes, which the quotient leaves out. */
	zeroShare: number;
}

/**
 * Rayleigh's quotient of the shape 𝐪, as a frequency. The zero-mode parts are removed first, as the chapter's
 * bound assumes; 𝐊 does not see them, so only the denominator changes. It is computed from 𝐊 and 𝐌 directly, not
 * from the modes, so that the spec can check that it is the share-weighted average of the ω_n².
 */
export function rayleigh(q: ArrayLike<number>): Quotient {
	const y = Float64Array.from(q, (x) => x * Math.sqrt(MASS));
	const total = dot(y, y);
	if (!(total > 0)) return { omega: undefined, zeroShare: 0 };
	let zero = 0;
	const kept = Float64Array.from(y);
	for (let n = 0; n < FIRST_RINGING; n++) {
		const an = dot(MODES[n].e, y);
		zero += an * an;
		for (let k = 0; k < COORDS; k++) kept[k] -= an * MODES[n].e[k];
	}
	const mass = dot(kept, kept);
	if (!(mass > total * 1e-20)) return { omega: undefined, zeroShare: zero / total };
	const qk = Float64Array.from(kept, (x) => x / Math.sqrt(MASS));
	let energy = 0;
	for (const s of stretches(qk)) energy += STIFFNESS * s * s;
	return { omega: Math.sqrt(energy / mass), zeroShare: zero / total };
}

/**
 * The displacements at the time t of a shape released from rest with the amplitudes a: each ringing mode swings as
 * a_n cos ω_n t, and the zero modes, released with no speed, stay where they were. Written into `out`.
 */
export function swing(a: ArrayLike<number>, t: number, out: Float64Array): Float64Array {
	out.fill(0);
	for (let n = 0; n < COORDS; n++) {
		const an = a[n] * Math.cos(MODES[n].omega * t);
		if (an === 0) continue;
		const v = MODES[n].v;
		for (let k = 0; k < COORDS; k++) out[k] += an * v[k];
	}
	return out;
}

/** The squash u = c (x, −y): stretched along x, squeezed along y, at the same area to first order. */
export function squash(c = 1): Float64Array {
	return Float64Array.from(SITES.flatMap(([x, y]) => [c * x, -c * y]));
}

/** One mass pulled by the displacement (dx, dy) and every other mass at rest. */
export function pull(a: number, dx: number, dy: number): Float64Array {
	const q = new Float64Array(COORDS);
	q[2 * a] = dx;
	q[2 * a + 1] = dy;
	return q;
}

/** The largest displacement of any mass in a shape, in spacings. */
export function largest(q: ArrayLike<number>): number {
	let big = 0;
	for (let a = 0; a < COUNT; a++) big = Math.max(big, Math.hypot(q[2 * a], q[2 * a + 1]));
	return big;
}

/** How far a single pull may turn from straight outward and still count as outward: 25°. */
export const OUTWARD_WITHIN = (25 * Math.PI) / 180;

/**
 * If the shape is one edge mass pulled outward, and every other mass at rest, that mass; otherwise undefined. A
 * pull counts when it is at least a twentieth of a spacing long and within OUTWARD_WITHIN of straight outward.
 */
export function edgePulledOut(q: ArrayLike<number>): number | undefined {
	let moved: number | undefined;
	for (let a = 0; a < COUNT; a++) {
		const r = Math.hypot(q[2 * a], q[2 * a + 1]);
		if (r < 1e-6) continue;
		if (moved !== undefined) return undefined;
		moved = a;
	}
	if (moved === undefined || !EDGE.includes(moved)) return undefined;
	const r = Math.hypot(q[2 * moved], q[2 * moved + 1]);
	if (r < 0.05) return undefined;
	const [ox, oy] = outward(moved);
	const cos = (q[2 * moved] * ox + q[2 * moved + 1] * oy) / r;
	return cos >= Math.cos(OUTWARD_WITHIN) - 1e-12 ? moved : undefined;
}

// --- the numbers of the predictions ----------------------------------------------------------------------------------

/** The squash's quotient, how far it lies above ω₁, and its share in the lowest pair. */
export const SQUASH = (() => {
	const q = squash();
	const { omega } = rayleigh(q);
	const share = noteShares(shares(amplitudes(q)));
	return { omega: omega ?? NaN, above: (omega ?? NaN) / LOWEST - 1, lowest: share[1], share };
})();

/** One edge mass pulled straight outward: its quotient over ω₁, and its share in the zero modes. */
export const EDGE_PULL = (() => {
	const a = EDGE[0];
	const [ox, oy] = outward(a);
	const q = pull(a, ox, oy);
	const { omega, zeroShare } = rayleigh(q);
	const share = shares(amplitudes(q));
	let high = 0;
	let ringing = 0;
	for (let n = FIRST_RINGING; n < COORDS; n++) {
		ringing += share[n];
		if (MODES[n].omega > 1.5) high += share[n];
	}
	return { omega: omega ?? NaN, ratio: (omega ?? NaN) / LOWEST, zeroShare, high: high / ringing };
})();

/** The lattice ball of Appendix A, from the chapter's footnote: its trial shape's quotient over the mode's, and share. */
export const BALL = { above: 0.14, share: 0.85 };
