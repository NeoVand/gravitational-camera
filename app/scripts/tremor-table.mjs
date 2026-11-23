// The table of the tutorial's interactive "tremor" (chapter 4.6, the paper's fig:tremor), from Appendix A's lattices.
//
//   node app/scripts/tremor-table.mjs [out]      (from the repository root; default out:
//                                                 app/src/lib/tutorial/live/tremor-data.ts)
//
// The ball is the sites of a simple cubic lattice of unit spacing with |r| <= 6, less the centre (924 sites); the shell
// keeps those with |r| > 4 (668). The masses are equal within each body and add to 1 in both. Each site is joined to
// its six nearest neighbours by springs of stiffness 1 and to its twelve next-nearest by springs of stiffness r, for
// r = 0.25, 0.5 (the paper's) and 1, as in reference/gravcam/response.py (lattice_body). For h = x·U·x with the
// paper's U = diag(−½, −½, 1)/√1.5, the weight of mode n is c_n² with c_n = Σ_p √m_p ∇h(x_p)·e_n,p, ∇h = 2Ux.
//
// The weights are the spectral measure of the one vector v = (√m_p ∇h(x_p)) under the mass-weighted stiffness
// D = M^-1/2 K M^-1/2, and they are found exactly, without the mode shapes: D is reduced to a tridiagonal T = QᵀDQ by
// Householder reflections, each applied to v as well, and T is diagonalized by implicit QL with Wilkinson shifts, each
// plane rotation applied to Qᵀv. The squares of the rotated vector's entries are then the c_n², and T's diagonal the
// ω_n². Modes whose frequencies agree to a relative 10⁻⁷ are merged and their weights added; levels whose weight is
// below 10⁻¹⁸ of the total, which h's symmetry makes zero (among them the six zero modes), are left out, and their
// sum is printed. Four checks are printed for each body: Σc² against Σ m|∇h|² (the length of v), Σc²ω² against
// vᵀDv and Σc²ω⁴ against |Dv|² (the moments of the measure), and Σc²/ω² against vᵀD⁺v from conjugate gradients.
// No dependencies; a full run takes a minute or two.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] ?? join(HERE, '../src/lib/tutorial/live/tremor-data.ts');
const RATIOS = [0.25, 0.5, 1];
const MERGE = 1e-7;
const DROP = 1e-18;
const U = [-0.5, -0.5, 1].map((u) => u / Math.sqrt(1.5));

function lattice(radius, inner, k1, k2) {
	const n = Math.ceil(radius);
	const p = [];
	for (let x = -n; x <= n; x++)
		for (let y = -n; y <= n; y++)
			for (let z = -n; z <= n; z++) {
				const r = Math.hypot(x, y, z);
				if (r <= radius + 1e-9 && r > inner + 1e-9) p.push([x, y, z]);
			}
	const N = p.length;
	const m = 1 / N;
	const index = new Map(p.map((q, i) => [q.join(','), i]));
	const bonds = [
		[[1, 0, 0], k1],
		[[0, 1, 0], k1],
		[[0, 0, 1], k1],
		...[1, -1].flatMap((s) => [
			[[1, s, 0], k2],
			[[1, 0, s], k2],
			[[0, 1, s], k2]
		])
	];
	const n3 = 3 * N;
	const K = new Float64Array(n3 * n3);
	for (let i = 0; i < N; i++)
		for (const [d, k] of bonds) {
			const j = index.get([p[i][0] + d[0], p[i][1] + d[1], p[i][2] + d[2]].join(','));
			if (j === undefined) continue;
			const len = Math.hypot(...d);
			const e = d.map((c) => c / len);
			for (let a = 0; a < 3; a++)
				for (let b = 0; b < 3; b++) {
					const B = k * e[a] * e[b];
					K[(3 * i + a) * n3 + 3 * i + b] += B;
					K[(3 * j + a) * n3 + 3 * j + b] += B;
					K[(3 * i + a) * n3 + 3 * j + b] -= B;
					K[(3 * j + a) * n3 + 3 * i + b] -= B;
				}
		}
	// D = M^-1/2 K M^-1/2 with equal masses is K / m
	for (let i = 0; i < K.length; i++) K[i] /= m;
	const v = new Float64Array(n3);
	for (let i = 0; i < N; i++)
		for (let a = 0; a < 3; a++) v[3 * i + a] = Math.sqrt(m) * 2 * U[a] * p[i][a];
	let second = 0;
	for (const q of p) second += m * (q[0] ** 2 + q[1] ** 2 + q[2] ** 2);
	return { N, D: K, v, second };
}

const dot = (a, b) => {
	let s = 0;
	for (let i = 0; i < a.length; i++) s += a[i] * b[i];
	return s;
};

function matvec(A, x) {
	const n = x.length;
	const y = new Float64Array(n);
	for (let i = 0; i < n; i++) {
		let s = 0;
		const row = i * n;
		for (let j = 0; j < n; j++) s += A[row + j] * x[j];
		y[i] = s;
	}
	return y;
}

/** Householder reduction of the symmetric A (overwritten) to tridiagonal form; each reflection also applied to w. */
function tridiagonalize(A, n, w) {
	const d = new Float64Array(n);
	const e = new Float64Array(n);
	const u = new Float64Array(n);
	const p = new Float64Array(n);
	for (let k = 0; k < n - 2; k++) {
		const lo = k + 1;
		let norm = 0;
		for (let i = lo; i < n; i++) norm += A[i * n + k] ** 2;
		norm = Math.sqrt(norm);
		const x0 = A[lo * n + k];
		if (norm === 0) {
			e[k] = 0;
			continue;
		}
		const alpha = x0 > 0 ? -norm : norm;
		for (let i = lo; i < n; i++) u[i] = A[i * n + k];
		u[lo] -= alpha;
		let un = 0;
		for (let i = lo; i < n; i++) un += u[i] ** 2;
		un = Math.sqrt(un);
		if (un === 0) {
			e[k] = x0;
			continue;
		}
		for (let i = lo; i < n; i++) u[i] /= un;
		// p = A u on the trailing block, then q = p − (u·p) u, A ← A − 2uqᵀ − 2quᵀ
		let up = 0;
		for (let i = lo; i < n; i++) {
			let s = 0;
			const row = i * n;
			for (let j = lo; j < n; j++) s += A[row + j] * u[j];
			p[i] = s;
			up += u[i] * s;
		}
		for (let i = lo; i < n; i++) p[i] -= up * u[i];
		for (let i = lo; i < n; i++) {
			const row = i * n;
			const ui = 2 * u[i];
			const pi = 2 * p[i];
			for (let j = lo; j < n; j++) A[row + j] -= ui * p[j] + pi * u[j];
		}
		e[k] = alpha;
		for (let i = lo + 1; i < n; i++) A[i * n + k] = A[k * n + i] = 0;
		A[lo * n + k] = A[k * n + lo] = alpha;
		let uw = 0;
		for (let i = lo; i < n; i++) uw += u[i] * w[i];
		for (let i = lo; i < n; i++) w[i] -= 2 * uw * u[i];
	}
	if (n > 1) e[n - 2] = A[(n - 1) * n + n - 2];
	for (let i = 0; i < n; i++) d[i] = A[i * n + i];
	return { d, e };
}

/** Implicit QL on the tridiagonal (d, e), e[i] joining i and i + 1; every rotation applied to w (Numerical Recipes'
 * tqli, with the rows of the eigenvector matrix replaced by the one vector). */
function ql(d, e, w) {
	const n = d.length;
	const off = new Float64Array(n);
	off.set(e);
	for (let l = 0; l < n; l++) {
		let iter = 0;
		for (;;) {
			let m = l;
			for (; m < n - 1; m++) {
				const dd = Math.abs(d[m]) + Math.abs(d[m + 1]);
				if (Math.abs(off[m]) <= Number.EPSILON * dd) break;
			}
			if (m === l) break;
			if (++iter > 60) throw new Error('QL did not converge');
			let g = (d[l + 1] - d[l]) / (2 * off[l]);
			let r = Math.hypot(g, 1);
			g = d[m] - d[l] + off[l] / (g + (g >= 0 ? Math.abs(r) : -Math.abs(r)));
			let s = 1;
			let c = 1;
			let p = 0;
			let i = m - 1;
			for (; i >= l; i--) {
				let f = s * off[i];
				const b = c * off[i];
				r = Math.hypot(f, g);
				off[i + 1] = r;
				if (r === 0) {
					d[i + 1] -= p;
					off[m] = 0;
					break;
				}
				s = f / r;
				c = g / r;
				g = d[i + 1] - p;
				r = (d[i] - g) * s + 2 * c * b;
				p = s * r;
				d[i + 1] = g + p;
				g = c * r - b;
				f = w[i + 1];
				w[i + 1] = s * w[i] + c * f;
				w[i] = c * w[i] - s * f;
			}
			if (r === 0 && i >= l) continue;
			d[l] -= p;
			off[l] = g;
			off[m] = 0;
		}
	}
}

/** vᵀD⁺v by conjugate gradients (v has no part along D's zero modes). */
function compliance(D, v) {
	const n = v.length;
	const x = new Float64Array(n);
	const r = Float64Array.from(v);
	const p = Float64Array.from(v);
	let rr = dot(r, r);
	const stop = 1e-28 * rr;
	for (let k = 0; k < 4 * n && rr > stop; k++) {
		const Ap = matvec(D, p);
		const a = rr / dot(p, Ap);
		for (let i = 0; i < n; i++) {
			x[i] += a * p[i];
			r[i] -= a * Ap[i];
		}
		const next = dot(r, r);
		for (let i = 0; i < n; i++) p[i] = r[i] + (next / rr) * p[i];
		rr = next;
	}
	return dot(x, v);
}

function body(inner, ratio) {
	const { N, D, v, second } = lattice(6, inner, 1, ratio);
	const n = 3 * N;
	const Dv = matvec(D, v);
	const checks = {
		length: dot(v, v),
		first: dot(v, Dv),
		second: dot(Dv, Dv),
		static: compliance(D, v)
	};
	const w = Float64Array.from(v);
	const { d, e } = tridiagonalize(D, n, w);
	ql(d, e, w);
	const modes = Array.from(d, (w2, i) => ({ w2: Math.max(0, w2), c2: w[i] ** 2 })).sort(
		(a, b) => a.w2 - b.w2
	);
	const total = modes.reduce((s, x) => s + x.c2, 0);
	const sums = {
		length: total,
		first: modes.reduce((s, x) => s + x.c2 * x.w2, 0),
		second: modes.reduce((s, x) => s + x.c2 * x.w2 * x.w2, 0),
		static: modes.reduce((s, x) => (x.w2 > 1e-9 ? s + x.c2 / x.w2 : s), 0)
	};
	// merge equal frequencies, then leave out the levels of zero weight
	const levels = [];
	for (const x of modes) {
		const omega = Math.sqrt(x.w2);
		const last = levels.at(-1);
		if (last && omega - last.omega <= MERGE * Math.max(omega, 1e-300)) last.c2 += x.c2;
		else levels.push({ omega, c2: x.c2 });
	}
	const kept = levels.filter((l) => l.c2 > DROP * total);
	const dropped = levels.filter((l) => l.c2 <= DROP * total);
	const droppedWeight = dropped.reduce((s, l) => s + l.c2, 0);
	console.log(
		`${inner ? 'shell' : 'ball '} r=${ratio}: N=${N}, ${levels.length} levels, ${kept.length} kept;` +
			` dropped weight ${droppedWeight.toExponential(2)} (largest ${Math.max(0, ...dropped.map((l) => l.c2)).toExponential(2)});` +
			` lowest kept ω=${kept[0].omega.toFixed(4)}`
	);
	for (const k of Object.keys(checks))
		console.log(
			`   ${k.padEnd(7)} modes ${sums[k].toPrecision(14)}  direct ${checks[k].toPrecision(14)}` +
				`  rel ${(sums[k] / checks[k] - 1).toExponential(2)}`
		);
	return { N, second, inertia: checks.length, levels: kept };
}

const fmt = (x) => Number(x.toPrecision(8));
const tables = {};
for (const ratio of RATIOS) {
	const ball = body(0, ratio);
	const shell = body(4, ratio);
	tables[ratio] = { ball, shell };
}

const lines = [];
lines.push(`/**
 * The table of chapter 4.6's interactive tremor (Tremor.svelte), the paper's fig:tremor: Appendix A's lattice ball
 * (924 equal masses, the simple cubic sites with |r| ≤ 6 spacings less the centre) and shell (668, those with
 * |r| > 4), each of total mass 1, nearest-neighbour springs of stiffness 1 and next-nearest of stiffness r. For each
 * r and body: the frequencies ω_n (in radians per unit time, with unit spacing, unit total mass and unit springs) of
 * the levels that carry the quadrupole h = x·U·x, U = diag(−½, −½, 1)/√1.5, and their weights c_n², in order of
 * frequency; modes whose frequencies agree to a relative 10⁻⁷ merged, their weights added; levels of zero weight
 * (by h's symmetry, below 10⁻¹⁸ of the total) left out. Also each body's Σ_p m_p|∇h(x_p)|² (\`inertia\`), which
 * Σc_n² equals, and Σ_p m_p r_p² (\`second\`), all to eight figures.
 *
 * Generated by app/scripts/tremor-table.mjs (node app/scripts/tremor-table.mjs, from the repository root), which
 * diagonalizes the lattices exactly; do not edit by hand.
 */

export type Level = readonly [omega: number, weight: number];

export interface Lattice {
	/** The number of masses. */
	readonly count: number;
	/** Σ_p m_p r_p², about the centre. */
	readonly second: number;
	/** Σ_p m_p |∇h(x_p)|², which the weights add up to. */
	readonly inertia: number;
	/** [ω_n, c_n²], in order of frequency. */
	readonly levels: readonly Level[];
}

export type Ratio = 0.25 | 0.5 | 1;
export const RATIOS: readonly Ratio[] = [0.25, 0.5, 1];

export const TABLE: Record<Ratio, { readonly ball: Lattice; readonly shell: Lattice }> = {`);
for (const ratio of RATIOS) {
	lines.push(`\t${ratio}: {`);
	for (const name of ['ball', 'shell']) {
		const b = tables[ratio][name];
		lines.push(`\t\t${name}: {`);
		lines.push(`\t\t\tcount: ${b.N},`);
		lines.push(`\t\t\tsecond: ${fmt(b.second)},`);
		lines.push(`\t\t\tinertia: ${fmt(b.inertia)},`);
		lines.push(`\t\t\tlevels: [`);
		lines.push(b.levels.map((l) => `\t\t\t\t[${fmt(l.omega)}, ${fmt(l.c2)}]`).join(',\n'));
		lines.push(`\t\t\t]`);
		lines.push(name === 'shell' ? `\t\t}` : `\t\t},`);
	}
	lines.push(ratio === RATIOS.at(-1) ? `\t}` : `\t},`);
}
lines.push(`};`);
writeFileSync(OUT, lines.join('\n') + '\n');
console.log(`wrote ${OUT}`);
