/**
 * Chapter 9.1's square of a vector: a plane wave's reading 𝒲 = c₂ m mᵀ, sorted by spin weight about an axis.
 *
 * A direction is a place on the sky, ϑ from ẑ and φ about it (./majorana-stars.ts), with the chapter's axes across
 * it, e₁ = (cos ϑ cos φ, cos ϑ sin φ, −sin ϑ) toward larger ϑ and e₂ = (−sin φ, cos φ, 0), so that e₁ × e₂ = k̂, and
 * the null vector m = (e₁ + ie₂)/√2. About an axis k̂ the five tables are T₂ = m mᵀ, T₁ = m k̂ᵀ + k̂ mᵀ,
 * T₀ = 3k̂k̂ᵀ − 1 and T₋ₘ = Tₘ*, and a reading's components are c_m = ⟨T_m|𝒲⟩/⟨T_m|T_m⟩ with ⟨T|U⟩ = tr(T†U).
 * Light's three are along m*, k̂ and m (weights −1, 0, 1). A bar is |c_m|√⟨T_m|T_m⟩/|𝒲|, so the squares add to one.
 *
 * The figure's wave has 𝒲 = m mᵀ at t = 0 (two waves: the sum of two such squares) and the tide
 * Re[(α⁺e^{−iωt} + α⁻e^{iωt}) m mᵀ] on its ring, with α⁺ = 1 for the helicity +2, α⁻ = 1 for −2 and α⁺ = α⁻ = ½
 * for a linear wave, so that the reading at t = 0 is the same for all three. The rank, tr 𝒲², tr 𝒲³ and the direction
 * −P/|𝓔|² read back by the super-Poynting vector are read from that reading at t = 0.
 *
 * Everything here is a pure function of plain numbers; the component only draws it.
 */
import { superPoynting } from '../../engine/majorana';
import {
	abs,
	add,
	cmat,
	conj,
	cvec,
	cx,
	madd,
	mmul,
	mscale,
	mul,
	outer,
	scale,
	trace,
	ZERO,
	type CMat3,
	type Complex,
	type CVec3,
	type Vec3
} from '../../pixel/complex';
import { apart, degrees, fixed, placeOf, vecOf, wrapPhi, type Place } from './majorana-stars';

export type { Complex, CMat3, CVec3, Place, Vec3 };

const RAD = Math.PI / 180;
const tidy = (x: number) => Math.round(x * 1e6) / 1e6 || 0;

// --- directions and their axes --------------------------------------------------------------------------------------

/** A direction k̂ with the chapter's two axes across it, e₁ × e₂ = k̂. */
export interface Frame {
	k: Vec3;
	e1: Vec3;
	e2: Vec3;
}

/** The axes of a place, exact at the poles, where they follow its azimuth. */
export function frameOf(p: Place): Frame {
	const pole = p.theta <= 0 ? 1 : p.theta >= 180 ? -1 : 0;
	const ct = pole || Math.cos(p.theta * RAD);
	const st = pole ? 0 : Math.sin(p.theta * RAD);
	const cf = Math.cos(p.phi * RAD);
	const sf = Math.sin(p.phi * RAD);
	return { k: [st * cf, st * sf, ct], e1: [ct * cf, ct * sf, -st || 0], e2: [-sf || 0, cf, 0] };
}

/** m = (e₁ + ie₂)/√2. */
export function nullOf(p: Place): CVec3 {
	const { e1, e2 } = frameOf(p);
	return [0, 1, 2].map((i) => cx(e1[i] * Math.SQRT1_2, e2[i] * Math.SQRT1_2)) as CVec3;
}

/** The place opposite. */
export const opposite = (p: Place): Place => ({
	theta: tidy(180 - p.theta),
	phi: wrapPhi(p.phi + 180)
});

/** ẑ, the disc's centre. */
export const ZENITH: Place = { theta: 0, phi: 0 };

/** Where a place sits about an axis: its tilt from the axis and its turn about it from the axis's e₁ (degrees). */
export function relativeOf(p: Place, about: Place): { tilt: number; turn: number } {
	const { k, e1, e2 } = frameOf(about);
	const v = vecOf(p);
	const d = (a: Vec3) => a[0] * v[0] + a[1] * v[1] + a[2] * v[2];
	const tilt = Math.atan2(Math.hypot(d(e1), d(e2)), d(k)) / RAD;
	// on the axis itself the turn is lost; on ẑ about ẑ it is the place's own azimuth
	const turn =
		Math.hypot(d(e1), d(e2)) < 1e-9
			? about.theta === 0 && p.theta === 0
				? p.phi - about.phi
				: 0
			: Math.atan2(d(e2), d(e1)) / RAD;
	return { tilt: tidy(tilt), turn: tidy(turn) };
}

/** The place at the tilt and the turn about an axis (degrees); `keep` is the azimuth kept at a pole. */
export function placeAbout(about: Place, tilt: number, turn: number, keep = 0): Place {
	const t = Math.max(0, Math.min(180, tilt));
	// onto the axis; at ẑ itself the azimuth is kept, so that the dot leaves it again the way it came
	if (t === 0) return about.theta === 0 ? { theta: 0, phi: wrapPhi(keep) } : { ...about };
	if (t === 180) return opposite(about);
	const { k, e1, e2 } = frameOf(about);
	const ct = Math.cos(t * RAD);
	const st = Math.sin(t * RAD);
	const cf = Math.cos(turn * RAD);
	const sf = Math.sin(turn * RAD);
	const v = [0, 1, 2].map((i) => ct * k[i] + st * (cf * e1[i] + sf * e2[i])) as Vec3;
	return placeOf(v, keep);
}

/** A place moved to the tilt from an axis, keeping its turn about it. */
export function tiltTo(p: Place, about: Place, tilt: number): Place {
	return placeAbout(about, tilt, relativeOf(p, about).turn, p.phi);
}

/** The angle between two places, degrees. */
export const angleOf = (a: Place, b: Place) => tidy(apart(a, b));

// --- the five tables and the three vectors ----------------------------------------------------------------------------

/** ⟨T|U⟩ = tr(T†U) = T*_ij U_ij. */
export function bracket(T: CMat3, U: CMat3): Complex {
	let s = ZERO;
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s = add(s, mul(conj(T[i][j]), U[i][j]));
	return s;
}

/** |𝒲| = √⟨𝒲|𝒲⟩. */
export const lengthOf = (W: CMat3) => Math.sqrt(bracket(W, W).re);

const conjugate = (A: CMat3): CMat3 => cmat((i, j) => conj(A[i][j]));

/** The five tables about an axis, T₋₂ … T₂ in this order. */
export function tables(axis: Place): CMat3[] {
	const m = nullOf(axis);
	const k = frameOf(axis).k;
	const kc = cvec(k);
	const T2 = outer(m, m);
	const T1 = madd(outer(m, kc), outer(kc, m));
	const T0 = cmat((i, j) => cx(3 * k[i] * k[j] - (i === j ? 1 : 0)));
	return [conjugate(T2), conjugate(T1), T0, T1, T2];
}

/** Light's three about an axis, m*, k̂, m, the weights −1, 0, 1, each of length one. */
export function vectors(axis: Place): CVec3[] {
	const m = nullOf(axis);
	return [m.map(conj) as CVec3, cvec(frameOf(axis).k), m];
}

/** One bar: the weight m, its component c_m, its height and, for a bar that can be seen, its phase (radians). */
export interface Bar {
	m: number;
	c: Complex;
	size: number;
	phase: number | undefined;
}

/** Below this height a bar's phase is not drawn. */
export const PHASE_FLOOR = 0.005;

const barOf = (m: number, c: Complex, size: number): Bar => ({
	m,
	c,
	size,
	phase: size >= PHASE_FLOOR ? Math.atan2(c.im, c.re) : undefined
});

/** A reading's five bars about an axis, m = −2 … 2: c_m = ⟨T_m|𝒲⟩/⟨T_m|T_m⟩, height |c_m|√⟨T_m|T_m⟩/|𝒲|. */
export function gravityBars(W: CMat3, axis: Place): Bar[] {
	const L = lengthOf(W);
	return tables(axis).map((T, i) => {
		const n = bracket(T, T).re;
		const c = scale(bracket(T, W), 1 / n);
		return barOf(i - 2, c, L > 0 ? (abs(c) * Math.sqrt(n)) / L : 0);
	});
}

/** Light's three bars about an axis, m = −1, 0, 1: c_m = V_m*·F, height |c_m|/|F|. */
export function lightBars(F: CVec3, axis: Place): Bar[] {
	const L = Math.sqrt(F.reduce((s, z) => s + z.re * z.re + z.im * z.im, 0));
	return vectors(axis).map((V, i) => {
		const c = add(add(mul(conj(V[0]), F[0]), mul(conj(V[1]), F[1])), mul(conj(V[2]), F[2]));
		return barOf(i - 1, c, L > 0 ? abs(c) / L : 0);
	});
}

// --- waves --------------------------------------------------------------------------------------------------------------

/** A wave's reading c₂ m mᵀ from a place, c₂ = 1 unless given. */
export const waveReading = (p: Place, c2: Complex = cx(1)): CMat3 =>
	mscale(outer(nullOf(p), nullOf(p)), c2);

/** Light's wave a m from a place, a = 1 unless given. */
export const lightWave = (p: Place, a: Complex = cx(1)): CVec3 =>
	nullOf(p).map((z) => mul(z, a)) as CVec3;

const addVec = (a: CVec3, b: CVec3): CVec3 => [add(a[0], b[0]), add(a[1], b[1]), add(a[2], b[2])];

/** The readings and light's fields of the waves shown, added. */
export function readingOfWaves(places: Place[]): { W: CMat3; F: CVec3 } {
	let W = waveReading(places[0]);
	let F = lightWave(places[0]);
	for (const p of places.slice(1)) {
		W = madd(W, waveReading(p));
		F = addVec(F, lightWave(p));
	}
	return { W, F };
}

/** A wave's tide from its polarizations, 𝓔 = 𝓔₊e⁺ + 𝓔×e^×, with e⁺ = e₁e₁ᵀ − e₂e₂ᵀ and e^× = e₁e₂ᵀ + e₂e₁ᵀ. */
export function tideOf(f: Frame, plus: number, cross: number): number[][] {
	const { e1, e2 } = f;
	return [0, 1, 2].map((i) =>
		[0, 1, 2].map(
			(j) => plus * (e1[i] * e1[j] - e2[i] * e2[j]) + cross * (e1[i] * e2[j] + e2[i] * e1[j])
		)
	);
}

/** 7.6's magnetic part of a wave, 𝓑_ij = ε_ipq k̂_p 𝓔_qj: the cross product with k̂ on the first index. */
export function magneticOf(k: Vec3, E: number[][]): number[][] {
	return [0, 1, 2].map((i) =>
		[0, 1, 2].map((j) => {
			const p = (i + 1) % 3;
			const q = (i + 2) % 3;
			return k[p] * E[q][j] - k[q] * E[p][j];
		})
	);
}

/** 𝒲 = 𝓔 + i𝓑. */
export const readingOf = (E: number[][], B: number[][]): CMat3 =>
	cmat((i, j) => cx(E[i][j], B[i][j]));

// --- what the pixel reads ---------------------------------------------------------------------------------------------

/**
 * The singular values of a complex 3 × 3 table, largest first: those of its real 6 × 6 form [[A, −B], [B, A]], each
 * twice, by one-sided Jacobi rotations, which keep a zero to the rounding of the largest.
 */
export function singularValues(W: CMat3): number[] {
	const M = Array.from({ length: 6 }, (_, i) =>
		Array.from({ length: 6 }, (_, j) => {
			const z = W[i % 3][j % 3];
			if (i < 3 === j < 3) return z.re;
			return i < 3 ? -z.im : z.im;
		})
	);
	for (let sweep = 0; sweep < 60; sweep++) {
		let turned = false;
		for (let p = 0; p < 5; p++)
			for (let q = p + 1; q < 6; q++) {
				let a = 0;
				let b = 0;
				let g = 0;
				for (let i = 0; i < 6; i++) {
					a += M[i][p] * M[i][p];
					b += M[i][q] * M[i][q];
					g += M[i][p] * M[i][q];
				}
				if (g === 0 || Math.abs(g) <= 1e-15 * Math.sqrt(a * b)) continue;
				turned = true;
				const zeta = (b - a) / (2 * g);
				const t = (zeta >= 0 ? 1 : -1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
				const c = 1 / Math.sqrt(1 + t * t);
				const s = c * t;
				for (let i = 0; i < 6; i++) {
					const x = M[i][p];
					const y = M[i][q];
					M[i][p] = c * x - s * y;
					M[i][q] = s * x + c * y;
				}
			}
		if (!turned) break;
	}
	const all = [0, 1, 2, 3, 4, 5]
		.map((j) => Math.hypot(...M.map((r) => r[j])))
		.sort((x, y) => y - x);
	return [all[0], all[2], all[4]];
}

/** Singular values below this share of the largest count as zero. */
export const RANK_FLOOR = 1e-9;

/** The rank: the number of singular values above RANK_FLOOR of the largest. */
export function rankOf(W: CMat3): number {
	const s = singularValues(W);
	if (!(s[0] > 0)) return 0;
	return s.filter((x) => x > RANK_FLOOR * s[0]).length;
}

/** The invariants I = tr 𝒲² and J = tr 𝒲³. */
export function invariants(W: CMat3): { I: Complex; J: Complex } {
	const W2 = mmul(W, W);
	return { I: trace(W2), J: trace(mmul(W2, W)) };
}

/**
 * The direction read back, −P/|𝓔|², with P_i = ε_ijk 𝓔_jl 𝓑_kl from 𝓔 = Re 𝒲 and 𝓑 = Im 𝒲, and its length; undefined
 * without a tide.
 */
export function readBack(W: CMat3): { n: Vec3; length: number } | undefined {
	let e2 = 0;
	for (const row of W) for (const z of row) e2 += z.re * z.re;
	const { P } = superPoynting(W);
	const big = Math.max(...W.flat().map((z) => abs(z)));
	if (!(e2 > 1e-20 * big * big)) return undefined;
	const n = P.map((x) => -x / e2 || 0) as Vec3;
	return { n, length: Math.hypot(...n) };
}

/** tr 𝒲²/|𝒲|² and tr 𝒲³/|𝒲|³, free of the reading's unit; zero for no reading. */
export function scaledInvariants(W: CMat3): { I: Complex; J: Complex } {
	const L = lengthOf(W);
	if (!(L > 0)) return { I: ZERO, J: ZERO };
	const { I, J } = invariants(W);
	return { I: scale(I, 1 / L ** 2), J: scale(J, 1 / L ** 3) };
}

/** The angle from a direction n to each source −k̂ of the places, degrees. */
export function fromSourcesOf(n: Vec3, places: Place[]): number[] {
	const l = Math.hypot(...n);
	return places.map((p) => {
		const k = frameOf(p).k;
		const c = -(k[0] * n[0] + k[1] * n[1] + k[2] * n[2]) / l;
		return Math.acos(Math.max(-1, Math.min(1, c))) / RAD;
	});
}

/** Two waves' overlaps, |⟨m₁m₁ᵀ|m₂m₂ᵀ⟩|² for gravity and |m₁*·m₂|² for light. */
export function overlaps(a: Place, b: Place): { gravity: number; light: number } {
	const ma = nullOf(a);
	const mb = nullOf(b);
	const h = add(add(mul(conj(ma[0]), mb[0]), mul(conj(ma[1]), mb[1])), mul(conj(ma[2]), mb[2]));
	const g = bracket(outer(ma, ma), outer(mb, mb));
	return { gravity: g.re * g.re + g.im * g.im, light: h.re * h.re + h.im * h.im };
}

/** 8.4's overlap of two coherent states of spin s the angle ϑ apart, cos^{4s}(ϑ/2) (ϑ in degrees). */
export const coherentOverlap = (angle: number, s: number) => Math.cos((angle * RAD) / 2) ** (4 * s);

// --- the ring ---------------------------------------------------------------------------------------------------------

export type Helicity = 'plus' | 'minus' | 'linear';

export const HELICITIES: Helicity[] = ['plus', 'minus', 'linear'];

/** α⁺ and α⁻ of each setting: the helicity +2, −2, and a linear wave, all with 𝒲 = m mᵀ at t = 0. */
export const AMPLITUDES: Record<Helicity, { plus: number; minus: number }> = {
	plus: { plus: 1, minus: 0 },
	minus: { plus: 0, minus: 1 },
	linear: { plus: 0.5, minus: 0.5 }
};

/** The next setting, for the key H. */
export const nextHelicity = (h: Helicity): Helicity =>
	HELICITIES[(HELICITIES.indexOf(h) + 1) % HELICITIES.length];

/** z = α⁺e^{−iθ} + α⁻e^{iθ}, the number in front of m mᵀ at the phase θ = ωt. */
export function prefactor(h: Helicity, theta: number): Complex {
	const { plus, minus } = AMPLITUDES[h];
	return cx((plus + minus) * Math.cos(theta), (minus - plus) * Math.sin(theta) || 0);
}

/**
 * The ring's tide in its own axes, e₁ to the right and e₂ up, seen from the side toward which k̂ points (the camera's):
 * Re(z m mᵀ) with m mᵀ = ½[[1, i], [i, −1]] there, which is ½[[Re z, −Im z], [−Im z, −Re z]].
 */
export function ringTide(h: Helicity, theta: number): [[number, number], [number, number]] {
	const z = prefactor(h, theta);
	return [
		[z.re / 2, -z.im / 2],
		[-z.im / 2, -z.re / 2]
	];
}

/** The direction of the squeeze, the axis of the positive value of a tide across k̂ (radians from e₁); none at zero. */
export function squeezeAxis(E: [[number, number], [number, number]]): number | undefined {
	const a = (E[0][0] - E[1][1]) / 2;
	const b = E[0][1];
	if (Math.hypot(a, b) < 1e-12) return undefined;
	return Math.atan2(b, a) / 2;
}

/** A ball of the ring: its place at rest, its acceleration −𝓔x, and whether that stretches, squeezes or slides. */
export interface Ball {
	x: number;
	y: number;
	ax: number;
	ay: number;
	kind: 'stretch' | 'squeeze' | 'still';
}

/** The balls of a ring of radius one under a tide across k̂, each accelerated by −𝓔x. */
export function ringBalls(E: [[number, number], [number, number]], count = 12): Ball[] {
	const most = Math.max(Math.hypot(E[0][0], E[0][1]), 1e-12);
	return Array.from({ length: count }, (_, j) => {
		const t = (2 * Math.PI * j) / count;
		const x = Math.cos(t);
		const y = Math.sin(t);
		const ax = -(E[0][0] * x + E[0][1] * y);
		const ay = -(E[1][0] * x + E[1][1] * y);
		const radial = ax * x + ay * y;
		const kind = radial > 0.05 * most ? 'stretch' : radial < -0.05 * most ? 'squeeze' : 'still';
		return { x, y, ax, ay, kind };
	});
}

/** One period of the tide, s: the pattern turns half a turn in it. */
export const PERIOD = 6;

/** The phase θ = ωt after dt seconds. */
export const advance = (theta: number, dt: number) =>
	(theta + (2 * Math.PI * dt) / PERIOD) % (2 * Math.PI);

// --- the settings, snapping and the keys ------------------------------------------------------------------------------

export type Mode = 'one' | 'two';

/** The figure opens on one wave of the helicity +2, 40° from the axis ẑ, playing. */
export const OPENING = {
	mode: 'one' as Mode,
	wave: { theta: 40, phi: 35 } as Place,
	axis: { ...ZENITH } as Place,
	helicity: 'plus' as Helicity
};

/** The second wave, when first shown: the angle `angle` from the first, turned toward its e₂, away from ẑ's pole. */
export function secondFor(first: Place, angle = 60): Place {
	return placeAbout(first, angle, 90, first.phi);
}

/** A dragged direction comes to rest on the axis or opposite it within this, degrees. */
export const SNAP = 3;
/** And on a whole multiple of 30° from the axis within this. */
export const SNAP_TILT = 1;

/** A dragged place, brought to rest on the axis, opposite it, or at a whole 30° from it, when near. */
export function snapped(p: Place, about: Place): Place {
	const a = angleOf(p, about);
	if (a < SNAP) return { ...about };
	if (a > 180 - SNAP) return opposite(about);
	const r = Math.round(a / 30) * 30;
	if (Math.abs(a - r) <= SNAP_TILT) return tiltTo(p, about, r);
	return p;
}

/**
 * Which side of the sphere a dragged dot is on, front (1) or behind (−1), after the pointer moves to `r` radii from
 * the disc's centre: past the rim it stays on the rim; coming back in from outside, it changes sides.
 */
export function crossing(side: 1 | -1, out: boolean, r: number): { side: 1 | -1; out: boolean } {
	if (r >= 1) return { side, out: true };
	if (out) return { side: side > 0 ? -1 : 1, out: false };
	return { side, out };
}

/** The keys' steps, degrees. */
export const KEY_STEP = 1;
export const KEY_LARGE = 10;

/**
 * A dot after a key: Up and Down move it toward the axis `about` or away, Left and Right turn it about the axis,
 * Shift by KEY_LARGE, Home onto the axis and End opposite it. Undefined for any other key.
 */
export function stepAbout(p: Place, about: Place, key: string, shift: boolean): Place | undefined {
	const s = shift ? KEY_LARGE : KEY_STEP;
	const { tilt, turn } = relativeOf(p, about);
	switch (key) {
		case 'ArrowUp':
			return placeAbout(about, tidy(tilt - s), turn, p.phi);
		case 'ArrowDown':
			return placeAbout(about, tidy(tilt + s), turn, p.phi);
		case 'ArrowLeft':
			return tilt === 0 ? { ...p } : placeAbout(about, tilt, turn - s, p.phi);
		case 'ArrowRight':
			return tilt === 0 ? { ...p } : placeAbout(about, tilt, turn + s, p.phi);
		case 'Home':
			return placeAbout(about, 0, turn, p.phi);
		case 'End':
			return placeAbout(about, 180, turn, p.phi);
	}
	return undefined;
}

// --- the predictions --------------------------------------------------------------------------------------------------

/** What the predictions look at. */
export interface Scene {
	mode: Mode;
	wave: Place;
	axis: Place;
}

/** How near the wave must be to the asked angle, degrees. */
export const NEAR = 1.5;

/** The first, once the one wave points along the axis. */
export const noteFirst = (done: boolean, s: Scene) =>
	done || (s.mode === 'one' && angleOf(s.wave, s.axis) <= 0.5);

/** The second, once the one wave is tilted 60° from the axis. */
export const noteSecond = (done: boolean, s: Scene) =>
	done || (s.mode === 'one' && Math.abs(angleOf(s.wave, s.axis) - 60) <= NEAR);

// --- the words ----------------------------------------------------------------------------------------------------------

/** A complex number to two decimals, as TeX: "0", "0.25", "−0.25i", "0.50 + 0.43i". */
export function complexTex(z: Complex, places = 2): string {
	const re = fixed(z.re, places);
	const im = fixed(Math.abs(z.im), places);
	const zero = (0).toFixed(places);
	const reZero = re === zero || re === `−${zero}`;
	const imZero = im === zero;
	const tex = (s: string) => s.replace('−', '-');
	if (reZero && imZero) return '0';
	if (imZero) return tex(re);
	const imPart = `${im}i`;
	if (reZero) return z.im < 0 ? `-${imPart}` : imPart;
	return `${tex(re)} ${z.im < 0 ? '-' : '+'} ${imPart}`;
}

/** A vector as TeX to two decimals. */
export const vecTex = (v: Vec3) => `(${v.map((x) => fixed(x).replace('−', '-')).join(',\\ ')})`;

/** A vector in words. */
export const vecWords = (v: Vec3) => `(${v.map((x) => fixed(x)).join(', ')})`;

/** A place in words, with its angle from the axis. */
export function placeWords(p: Place): string {
	if (p.theta === 0) return 'the centre, +ẑ';
	if (p.theta === 180) return 'the back of the sky, −ẑ';
	return `ϑ = ${degrees(p.theta)}, φ = ${degrees(p.phi)}`;
}

/** The bars in words. */
export const barsWords = (bars: Bar[]) =>
	bars
		.map(
			(b) =>
				`m = ${b.m === 0 ? '0' : b.m > 0 ? `+${b.m}` : `−${-b.m}`}: ${fixed(b.size, 3)}${b.phase === undefined ? '' : `, phase ${degrees(b.phase / RAD)}`}`
		)
		.join('; ');
