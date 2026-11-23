/**
 * Chapter 2.3's list of moments, for equal point masses laid in a plane of ordinary space. The masses lie on the
 * plane z = 0 inside a circle of radius R about the origin, and a ring of readout of radius r lies in the same plane.
 * Lengths are in units of R and masses in units of one mass m, so a potential is in units of G m / R and a moment of
 * degree ℓ in units of m R^ℓ. The gravity is three-dimensional: the potential of each mass is −G m / |x − y|.
 *
 * The moments are the chapter's
 *
 *   Q_ℓm = Σ m r'^ℓ Y*_ℓm(ŷ),       Φ(x) = −G Σ_ℓ Σ_m 4π/(2ℓ + 1) Q_ℓm Y_ℓm(x̂) / r^{ℓ+1},
 *
 * with Y_ℓm from chapter 2.2's ./sky-patterns.ts. Every mass lies on the equator ϑ = π/2, where Y_ℓm is zero when
 * ℓ − m is odd, so those moments vanish; the others are not the sums Σ m (x + iy)^ℓ alone, which give only |m| = ℓ.
 *
 * On the ring, the term of degree ℓ is a sum of cos mφ and sin mφ up to m = ℓ. The figure's bar for degree ℓ is the
 * largest size of that term round the ring, divided by the size G M / r of the monopole's: the most the camera reads
 * of degree ℓ, wherever on the ring it sits. Chapter 2.3's bound |Φ_ℓ| ≤ (G M / r)(R/r)^ℓ holds for it, with
 * equality for one mass on the circle R.
 */
import { harmonic, legendreList, patternsUpTo, polar, type Complex } from './sky-patterns';

export { patternsUpTo };

/** The degrees drawn, 0 to this. */
export const MOST_DEGREE = 40;
/** The ring's radius, in units of R, and the signal-to-noise ratio's power of ten: least, most and first. */
export const RING_LEAST = 1.1;
export const RING_MOST = 6;
export const RING_FIRST = 3;
export const SNR_LEAST = 1;
export const SNR_MOST = 16;
export const SNR_FIRST = 6;
/** At most this many masses. */
export const MOST_MASSES = 6;

/** A point mass of mass m on the plane, x to the right and y up, in units of R. */
export interface Mass {
	x: number;
	y: number;
}

const EQUATOR = Math.PI / 2;
const FOUR_PI = 4 * Math.PI;

/** The masses the figure opens with and offers: each list is its places, in units of R. */
const third = 1 / Math.sqrt(5);
export const PRESETS = {
	/** Three masses in an L, centre of mass at the origin, both ends on the circle R. */
	ell: [
		{ x: -third, y: -third },
		{ x: 2 * third, y: -third },
		{ x: -third, y: 2 * third }
	],
	/** Chapter 2.3's pair: two masses at x = ±d/2, here d = 2R. */
	pair: [
		{ x: -1, y: 0 },
		{ x: 1, y: 0 }
	],
	/** A uniform rod from y = −R to R, as six equal pieces at their middles: the person of chapter 1.4 stood upright. */
	rod: [-5, -3, -1, 1, 3, 5].map((k) => ({ x: 0, y: k / 6 })),
	/** A ball: outside, its field is a point mass's at its centre (chapter 1.6's shell theorem). */
	ball: [{ x: 0, y: 0 }]
} satisfies Record<string, Mass[]>;
export type PresetName = keyof typeof PRESETS;
export const PRESET_NAMES = Object.keys(PRESETS) as PresetName[];

/** The names chapter 2.3 gives the first degrees. */
export const DEGREE_NAMES = ['monopole', 'dipole', 'quadrupole', 'octupole'];

// --- the moments ------------------------------------------------------------------------------------------------

/**
 * Q_ℓm for ℓ = 0 … L and m = −ℓ … ℓ, in units of m R^ℓ: `moments(...)[ℓ][m + ℓ]`. Each mass at the distance ρ and
 * the azimuth φ adds ρ^ℓ Y*_ℓm(π/2, φ).
 */
export function moments(masses: Mass[], L: number): Complex[][] {
	const out: Complex[][] = [];
	for (let l = 0; l <= L; l++)
		out.push(Array.from({ length: 2 * l + 1 }, () => ({ re: 0, im: 0 })));
	for (const p of masses) {
		const rho = Math.hypot(p.x, p.y);
		const phi = Math.atan2(p.y, p.x);
		let power = 1;
		for (let l = 0; l <= L; l++) {
			if (power === 0) break;
			for (let m = -l; m <= l; m++) {
				const y = harmonic(l, m, EQUATOR, phi);
				out[l][m + l].re += power * y.re;
				out[l][m + l].im -= power * y.im;
			}
			power *= rho;
		}
	}
	return out;
}

/** The total mass, in units of m, and the centre of mass, in units of R. */
export const totalMass = (masses: Mass[]) => masses.length;
export function centreOfMass(masses: Mass[]): Mass {
	const n = masses.length || 1;
	return {
		x: masses.reduce((s, p) => s + p.x, 0) / n,
		y: masses.reduce((s, p) => s + p.y, 0) / n
	};
}

/**
 * The quadrupole tensor Q_ij = Σ m (3 y_i y_j − r'² δ_ij), in units of m R². In the plane z = 0 the entries with z
 * other than Q_zz are zero, and Q_zz = −(Q_xx + Q_yy) since the table is trace-free.
 */
export function quadrupole(masses: Mass[]) {
	let xx = 0;
	let yy = 0;
	let xy = 0;
	let zz = 0;
	for (const p of masses) {
		const r2 = p.x * p.x + p.y * p.y;
		xx += 3 * p.x * p.x - r2;
		yy += 3 * p.y * p.y - r2;
		xy += 3 * p.x * p.y;
		zz -= r2;
	}
	return { xx, yy, xy, zz };
}

// --- the terms on the ring -----------------------------------------------------------------------------------------

/**
 * The term of degree ℓ on the ring, divided by G M / r: f(φ) = a0 + Σ_{m=1}^{ℓ} (c_m cos mφ + s_m sin mφ). It is
 * Φ_ℓ / (G M / r), with its sign, so the monopole's is −1.
 */
export interface RingTerm {
	l: number;
	a0: number;
	c: Float64Array;
	s: Float64Array;
	/** Σ m ρ^ℓ / (M r^ℓ): the size the term would have if every mass lay on the line to the camera. */
	scale: number;
}

/**
 * The terms of degrees 0 … L on a ring of radius r, from the moments. On the equator Y_ℓm = p_ℓm e^{imφ} with
 * p_ℓm = N_ℓm P_ℓ^m(0), and the terms m and −m are complex conjugates, so
 *
 *   Σ_m Q_ℓm Y_ℓm = Q_ℓ0 p_ℓ0 + 2 Σ_{m>0} p_ℓm (Re Q_ℓm cos mφ − Im Q_ℓm sin mφ).
 */
export function ringTerms(masses: Mass[], r: number, L = MOST_DEGREE): RingTerm[] {
	const Q = moments(masses, L);
	const M = totalMass(masses);
	const rhos = masses.map((p) => Math.hypot(p.x, p.y));
	const out: RingTerm[] = [];
	for (let l = 0; l <= L; l++) {
		const k = -(FOUR_PI / (2 * l + 1)) / (M * r ** l);
		const c = new Float64Array(l + 1);
		const s = new Float64Array(l + 1);
		for (let m = 1; m <= l; m++) {
			const p = equator(l, m);
			c[m] = 2 * k * p * Q[l][m + l].re;
			s[m] = -2 * k * p * Q[l][m + l].im;
		}
		const scale = rhos.reduce((sum, rho) => sum + rho ** l, 0) / (M * r ** l);
		out.push({ l, a0: k * equator(l, 0) * Q[l][l].re, c, s, scale });
	}
	return out;
}

/** N_ℓm P_ℓ^m(0), kept: the same for every drawing. Exactly zero when ℓ − m is odd. */
const equatorTable = new Map<number, number>();
function equator(l: number, m: number): number {
	const key = l * 1024 + m;
	let v = equatorTable.get(key);
	if (v === undefined) {
		v = (l - m) % 2 ? 0 : polar(l, m, EQUATOR);
		equatorTable.set(key, v);
	}
	return v;
}

/** A ring term at the azimuth φ. */
export function termAt(t: RingTerm, phi: number): number {
	let f = t.a0;
	// cos mφ and sin mφ by turning one step at a time
	const c1 = Math.cos(phi);
	const s1 = Math.sin(phi);
	let cm = 1;
	let sm = 0;
	for (let m = 1; m <= t.l; m++) {
		const next = cm * c1 - sm * s1;
		sm = sm * c1 + cm * s1;
		cm = next;
		f += t.c[m] * cm + t.s[m] * sm;
	}
	return f;
}

/** The term sampled at n azimuths 2πi/n round the ring. */
export function sampleTerm(t: RingTerm, n: number): Float64Array {
	const out = new Float64Array(n);
	for (let i = 0; i < n; i++) out[i] = termAt(t, (2 * Math.PI * i) / n);
	return out;
}

/** The samples the peak is first looked for on. */
export const SAMPLES = 1024;

/**
 * The largest size of a ring term and the azimuth where it is: on SAMPLES azimuths, then refined by a
 * golden-section search round the three highest crests of the samples, so that the grid's spacing costs nothing.
 */
export function peak(t: RingTerm, samples = sampleTerm(t, SAMPLES)): { value: number; at: number } {
	const n = samples.length;
	const size = (i: number) => Math.abs(samples[(i + n) % n]);
	const crests: number[] = [];
	for (let i = 0; i < n; i++) if (size(i) >= size(i - 1) && size(i) > size(i + 1)) crests.push(i);
	if (!crests.length) crests.push(0);
	crests.sort((a, b) => size(b) - size(a));
	const step = (2 * Math.PI) / n;
	const g = (Math.sqrt(5) - 1) / 2;
	let best = { value: 0, at: 0 };
	for (const i of crests.slice(0, 3)) {
		let a = (i - 1) * step;
		let b = (i + 1) * step;
		for (let k = 0; k < 60; k++) {
			const c = b - g * (b - a);
			const d = a + g * (b - a);
			if (Math.abs(termAt(t, c)) > Math.abs(termAt(t, d))) b = d;
			else a = c;
		}
		const at = 0.5 * (a + b);
		const value = Math.max(Math.abs(termAt(t, at)), size(i));
		if (value > best.value)
			best = { value, at: ((at % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) };
	}
	return best;
}

/** One bar of the chart: degree ℓ's largest size on the ring as a fraction of the monopole's, or zero. */
export interface Strength {
	l: number;
	value: number;
	/** Zero but for rounding: smaller than a millionth of a millionth of what the masses could give. */
	zero: boolean;
	/** The limit (R/r)^ℓ of chapter 2.3. */
	limit: number;
}

export const strengths = (masses: Mass[], r: number, L = MOST_DEGREE) =>
	strengthsOf(ringTerms(masses, r, L), r);

/** The bars of terms already found. */
export function strengthsOf(terms: RingTerm[], r: number): Strength[] {
	return terms.map((t) => {
		const value = peak(t).value;
		const zero = !(value > 1e-12 * t.scale);
		return { l: t.l, value: zero ? 0 : value, zero, limit: r ** -t.l };
	});
}

// --- the same, without the moments, for the checks --------------------------------------------------------------

/**
 * The term of degree ℓ on the ring straight from the generating function, before the addition theorem splits it:
 * Φ_ℓ / (G M / r) = −(1/M) Σ m (ρ/r)^ℓ P_ℓ(cos γ), γ the angle between the mass and the point of the ring.
 */
export function termDirect(masses: Mass[], l: number, r: number, phi: number): number {
	let f = 0;
	for (const p of masses) {
		const rho = Math.hypot(p.x, p.y);
		if (rho === 0) {
			if (l === 0) f -= 1;
			continue;
		}
		const cosGamma = Math.cos(phi - Math.atan2(p.y, p.x));
		f -= (rho / r) ** l * legendreList(l, cosGamma)[l];
	}
	return f / totalMass(masses);
}

/** The exact potential at (r, φ) on the ring, in units of G m / R: −Σ 1/|x − y|. */
export function exactPotential(masses: Mass[], r: number, phi: number): number {
	const x = r * Math.cos(phi);
	const y = r * Math.sin(phi);
	return -masses.reduce((s, p) => s + 1 / Math.hypot(x - p.x, y - p.y), 0);
}

// --- the noise ------------------------------------------------------------------------------------------------------

/**
 * Chapter 2.3's rule: from r, each degree is at most R/r times the one before, so degree ℓ stands above the noise of
 * a camera that reads the monopole with signal-to-noise ratio SNR while (r/R)^ℓ < SNR, that is while
 * ℓ < ln SNR / ln(r/R).
 */
export const ruleReach = (r: number, snr: number) => Math.log(snr) / Math.log(r);
/** The highest degree the rule lets through: the largest whole ℓ below ln SNR / ln(r/R). */
export const ruleTop = (r: number, snr: number) => Math.ceil(ruleReach(r, snr) - 1e-12) - 1;

/** The degrees of the masses whose bars stand above the noise 1/SNR. */
export const aboveNoise = (bars: Strength[], snr: number) =>
	bars.filter((b) => b.value > 1 / snr).map((b) => b.l);

/** A list of degrees as runs: [0, 2, 3, 4, 7] → "0, 2 to 4, 7". */
export function runs(list: number[]): string {
	const parts: string[] = [];
	for (let i = 0; i < list.length;) {
		let j = i;
		while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
		parts.push(
			j === i ? `${list[i]}` : j === i + 1 ? `${list[i]}, ${list[j]}` : `${list[i]} to ${list[j]}`
		);
		i = j + 1;
	}
	return parts.join(', ');
}

/**
 * Degrees in words for the readout: runs of neighbours as in `runs`, but a long list of every second degree, as a
 * body symmetric through the centre gives, as "the even degrees 0 to 36".
 */
export function degreesInWords(list: number[]): string {
	const even = list.length > 3 && list.every((l, i) => i === 0 || l === list[i - 1] + 2);
	if (even) return `the ${list[0] % 2 ? 'odd' : 'even'} degrees ${list[0]} to ${list.at(-1)}`;
	return `${list.length === 1 ? 'degree' : 'degrees'} ${runs(list)}`;
}

/** Whether every odd degree is zero, as for a body that is the same turned half round about the centre. */
export const oddZero = (bars: Strength[]) => bars.every((b) => b.l % 2 === 0 || b.zero);

// --- moving the masses --------------------------------------------------------------------------------------------

/** How near two masses may come, in units of R. */
export const APART = 0.12;

/** A place kept inside the circle R. */
export function inCircle(p: Mass): Mass {
	const rho = Math.hypot(p.x, p.y);
	return rho <= 1 ? p : { x: p.x / rho, y: p.y / rho };
}

/** A place for mass i, kept inside the circle R and at least APART from the others. */
export function settle(masses: Mass[], i: number, p: Mass): Mass {
	let q = inCircle(p);
	for (let pass = 0; pass < 4; pass++) {
		let moved = false;
		masses.forEach((o, j) => {
			if (j === i) return;
			const dx = q.x - o.x;
			const dy = q.y - o.y;
			const d = Math.hypot(dx, dy);
			if (d >= APART - 1e-12) return;
			const ux = d > 1e-9 ? dx / d : 1;
			const uy = d > 1e-9 ? dy / d : 0;
			q = inCircle({ x: o.x + ux * APART, y: o.y + uy * APART });
			moved = true;
		});
		if (!moved) break;
	}
	return q;
}

/** A free place for one more mass: the point on two circles about the origin farthest from the masses there are. */
export function freePlace(masses: Mass[]): Mass {
	let best = { x: 0.5, y: 0 };
	let far = -1;
	for (const rho of [0.45, 0.8])
		for (let k = 0; k < 48; k++) {
			const phi = (2 * Math.PI * k) / 48 + 0.1;
			const p = { x: rho * Math.cos(phi), y: rho * Math.sin(phi) };
			const d = Math.min(...masses.map((o) => Math.hypot(p.x - o.x, p.y - o.y)));
			if (d > far + 1e-9) {
				far = d;
				best = p;
			}
		}
	return best;
}
