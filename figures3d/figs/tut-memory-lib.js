// Shared numbers and marks for the three diagrams of the tutorial's chapter 7.8 (tutorial/geometry/wave-energy.md):
// tut-viscous-slab, tut-memory-angles and tut-memory-step. Not a figure itself. The colour roles are chapter 7.4's
// (figs/tut-linear-lib.js through figs/tut-quadrupole-lib.js: the observer's, the curvature's, matter's and the
// field's, read from app.css by `palette(check)`); orange and blue, which mean a stretch and a squeeze, are not used.
// The sheet, strokes, labels and cropping are those of chapters 6.1 to 7.7 (figs/tut-pot-lib.js), all imported, not
// copied.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints, and the chapter's
// other numbers on the way (SI throughout):
//  - Hawking's rate: water's 10^-3 Pa s gives Gamma = 16 pi G eta / c^2 = 3.7 x 10^-29 s^-1, alpha = Gamma / c =
//    1.2 x 10^-37 m^-1, 1/alpha = 8.0 x 10^36 m = 8.5 x 10^20 light-years, the visible universe (10^11 light-years)
//    crossed eight or nine billion times; the units of G eta / c^2, a rate;
//  - the slab's drawn fall: the amplitude to 60 per cent across a slab a metre thick, where water's amplitude falls by
//    the fraction alpha / 2 per metre: an exaggeration of 8 x 10^36, about 10^37;
//  - the heat: 2 eta (h-dot / 2)^2 = (1/2) eta h-dot h-dot for every entry; the balance gives U = c^2 <h-dot h-dot> /
//    32 pi G, h_ij h_ij = 2 (h+^2 + hx^2); the flux of a plus wave of 10^-21 at 100 Hz, omega = 628 s^-1, 1.6 x 10^-3
//    W m^-2 and its energy density 5.3 x 10^-12 J m^-3; c^3 / G = 4.0 x 10^35 kg s^-1; LIGO's arm moved 2 x 10^-18 m;
//  - the directions: N-hat, e_1, e_2 right-handed (e_1 x e_2 = N-hat); n' = cos(beta) N + sin(beta)(cos(psi) e_1 +
//    sin(psi) e_2) has n'.e_1 = sin(beta) cos(psi), n'.e_2 = sin(beta) sin(psi), e+_ij n'_i n'_j = sin^2(beta)
//    cos(2 psi); z-hat = cos(theta) N + sin(theta) e_1 gives cos(theta') = cos(theta) cos(beta) + sin(theta)
//    sin(beta) cos(psi) (all at the drawn angles and at others);
//  - the memory's integrals: int cos^2(psi) cos(2 psi) d psi = pi / 2, int (1 - v^2)(1 + v) dv = 4/3, so a burst
//    (E / 4 pi)(1 + q P2) leaves (q G E / 2 c^4 r) sin^2(theta), checked against eq:memory-axes summed over the sky; the
//    supernova's 3 x 10^46 J from 10 kpc (3.1 x 10^20 m) with q = 0.01: 4.0 x 10^-21, four times LIGO's 10^-21; balls
//    4 km apart moved 8 x 10^-18 m, about a two-hundredth of a proton's width (1.7 x 10^-15 m).
import { OBS, CURV, MATTER, FIELD, palette, G, C } from './tut-quadrupole-lib.js';

export { OBS, CURV, MATTER, FIELD, palette, G, C };

// ---- constants ---------------------------------------------------------------------------------------------------
export const LY = 9.4607e15;               // m, a light-year
export const WATER = 1e-3;                 // Pa s, water's everyday viscosity
export const UNIVERSE = 1e11;              // light-years, the visible universe across, as the chapter rounds it
export const KPC = 3.0857e19;              // m
export const LIGO = 1e-21;
export const ARM = 4000;                   // m
export const PROTON = 1.7e-15;             // m, its width as chapter 7.6 states it

/** Hawking's damping rate Gamma = 16 pi G eta / c^2 (s^-1) and the absorption coefficient alpha = Gamma / c (m^-1). */
export const gammaOf = (eta) => (16 * Math.PI * G * eta) / (C * C);
export const alphaOf = (eta) => gammaOf(eta) / C;

// ---- the slab ----------------------------------------------------------------------------------------------------
export const SLAB_FALL = 0.6;              // the drawn amplitude after the slab, over the amplitude before it
export const SLAB_THICK = 1;               // m, the slab the caption names
/** The drawn fall over water's real one across the slab: ln(1/0.6) against (alpha / 2) x 1 m. */
export const exaggeration = () => Math.log(1 / SLAB_FALL) / ((alphaOf(WATER) / 2) * SLAB_THICK);

// ---- the directions ------------------------------------------------------------------------------------------------
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const comb = (...terms) => [0, 1, 2].map((i) => terms.reduce((s, [k, v]) => s + k * v[i], 0));
/** The camera's frame: N-hat, e_1, e_2 as the coordinate axes of the drawing's world. */
export const FRAME = { N: [1, 0, 0], e1: [0, 1, 0], e2: [0, 0, 1] };
/** n' at the angle beta from N-hat and the azimuth psi round it, from e_1 (the chapter's list). */
export const emission = (beta, psi, { N, e1, e2 } = FRAME) => comb([Math.cos(beta), N], [Math.sin(beta) * Math.cos(psi), e1], [Math.sin(beta) * Math.sin(psi), e2]);
/** The burst's axis z-hat = cos(theta) N-hat + sin(theta) e_1. */
export const axisZ = (theta, { N, e1 } = FRAME) => comb([Math.cos(theta), N], [Math.sin(theta), e1]);
export const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b) / Math.sqrt(dot(a, a) * dot(b, b)))));
export const DRAWN = { beta: 40, psi: 35, theta: 115 };   // degrees: the angles of tut-memory-angles
export const rad = (d) => (d * Math.PI) / 180;
export const deg = (r) => (r * 180) / Math.PI;

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const fig = (v, n = 1) => Math.abs(v).toExponential(n);
	const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(a), Math.abs(b), 1e-300);

	// ---- Hawking's rate, for water
	const gamma = gammaOf(WATER), alpha = alphaOf(WATER), length = 1 / alpha, years = length / LY;
	check(fig(gamma) === '3.7e-29' && fig(alpha) === '1.2e-37' && fig(length) === '8.0e+36', `Gamma ${gamma}, alpha ${alpha}, 1/alpha ${length}`);
	check(fig(years) === '8.5e+20' && Math.round(Math.log10(years)) === 21, `1/alpha = ${years} light-years`);
	{
		const times = years / UNIVERSE;
		check(times > 8e9 && times < 9e9, `the universe is crossed ${times} times`);
	}
	// the amplitude falls at Gamma / 2 = 8 pi G eta / c^2
	check(near(gamma / 2, (8 * Math.PI * G * WATER) / (C * C), 1e-14), 'Gamma / 2 is not 8 pi G eta / c^2');
	// the honey of the practice: alpha = 1.2 x 10^-33 m^-1, 8.0 x 10^32 m, 8.5 x 10^16 light-years
	check(fig(alphaOf(10)) === '1.2e-33' && fig(1 / alphaOf(10)) === '8.0e+32' && fig(1 / alphaOf(10) / LY) === '8.5e+16', 'honey');

	// ---- the slab's exaggeration
	const ex = exaggeration();
	check(Math.round(Math.log10(ex)) === 37 && ex.toExponential(0) === '8e+36', `the slab's fall is exaggerated ${ex} times`);

	// ---- the heat and the flux
	for (const hd of [0.3, -1.7, 2.2]) check(near(2 * WATER * (hd / 2) * (hd / 2), 0.5 * WATER * hd * hd, 1e-14), 'the heat per entry');
	{
		// h_ij h_ij = 2 (h+^2 + hx^2) for h = h+ e+ + hx ex across z
		const hp = 0.37, hx = -1.3, h = [[hp, hx, 0], [hx, -hp, 0], [0, 0, 0]];
		check(near(h.flat().reduce((s, v) => s + v * v, 0), 2 * (hp * hp + hx * hx), 1e-14), 'h_ij h_ij');
		// the balance: (16 pi G eta / c^2) U = (1/2) eta <h-dot h-dot> gives U = c^2 <..> / 32 pi G, for any eta
		for (const eta of [1e-3, 10, 3.3e4]) check(near((0.5 * eta) / gammaOf(eta), (C * C) / (32 * Math.PI * G), 1e-12), 'the viscosity does not cancel');
	}
	const w = 2 * Math.PI * 100, F = ((C ** 3) / (16 * Math.PI * G)) * 0.5 * w * w * LIGO * LIGO;
	check(Math.round(w) === 628 && fig(F) === '1.6e-3' && fig(F / C) === '5.3e-12', `the flux ${F}, its energy density ${F / C}`);
	check(fig(C ** 3 / G) === '4.0e+35' && (0.5 * LIGO * ARM).toExponential(0) === '2e-18', 'c^3 / G and LIGO\'s arm');
	// sunlight's energy density, 1.4 kW m^-2 / c: 4.7 x 10^-6 J m^-3, nearly a million times more
	check(fig(1400 / C) === '4.7e-6' && Math.round(Math.log10(1400 / F)) === 6, 'sunlight');

	// ---- the directions
	const { N, e1, e2 } = FRAME;
	check(cross(e1, e2).every((v, i) => v === N[i]), 'e_1 x e_2 is not N-hat');
	for (const [b, p, t] of [[DRAWN.beta, DRAWN.psi, DRAWN.theta], [12, 200, 33], [150, -40, 80]]) {
		const n = emission(rad(b), rad(p)), z = axisZ(rad(t));
		check(near(dot(n, n), 1, 1e-14) && near(dot(z, z), 1, 1e-14), 'a direction is not a unit vector');
		check(near(Math.acos(dot(n, N)), rad(b), 1e-12) && near(deg(angle(z, N)), t, 1e-12), 'beta or theta');
		check(near(dot(n, e1), Math.sin(rad(b)) * Math.cos(rad(p)), 1e-14) && near(dot(n, e2), Math.sin(rad(b)) * Math.sin(rad(p)), 1e-14), 'n\'.e_1 or n\'.e_2');
		const eplus = dot(n, e1) ** 2 - dot(n, e2) ** 2;
		check(near(eplus, Math.sin(rad(b)) ** 2 * Math.cos(2 * rad(p)), 1e-12) && near(2 * dot(n, e1) * dot(n, e2), Math.sin(rad(b)) ** 2 * Math.sin(2 * rad(p)), 1e-12), 'the patterns on n\'');
		check(near(dot(n, z), Math.cos(rad(t)) * Math.cos(rad(b)) + Math.sin(rad(t)) * Math.sin(rad(b)) * Math.cos(rad(p)), 1e-14), 'cos theta\'');
		// psi is the turn round N-hat from e_1: the part of n' across N-hat is at psi from e_1, toward e_2
		const across = comb([1, n], [-dot(n, N), N]);
		check(near(Math.atan2(dot(across, e2), dot(across, e1)), Math.atan2(Math.sin(rad(p)), Math.cos(rad(p))), 1e-12), 'psi');
	}

	// ---- the memory's integrals, and eq:memory-axes summed over the sky against (q/2) sin^2 theta
	{
		const n = 4000;
		let a = 0, b = 0;
		for (let i = 0; i < n; i++) { const p = (2 * Math.PI * (i + 0.5)) / n; a += Math.cos(p) ** 2 * Math.cos(2 * p); }
		for (let i = 0; i < n; i++) { const v = -1 + (2 * (i + 0.5)) / n; b += (1 - v * v) * (1 + v); }
		check(near((a * 2 * Math.PI) / n, Math.PI / 2, 1e-9) && near((b * 2) / n, 4 / 3, 1e-6), 'the integrals pi/2 and 4/3');
		// Delta h+ in units of G E / c^4 r: 2 int (dE/d^2n'/E)(1 + cos beta) cos(2 psi) d^2n'
		const P2 = (x) => 0.5 * (3 * x * x - 1), q = 0.7;
		for (const t of [rad(90), rad(37), rad(140)]) {
			let s = 0;
			const nv = 600, np = 600;
			for (let i = 0; i < nv; i++) {
				const v = -1 + (2 * (i + 0.5)) / nv, sb = Math.sqrt(1 - v * v);
				for (let j = 0; j < np; j++) {
					const p = (2 * Math.PI * (j + 0.5)) / np;
					const ct = Math.cos(t) * v + Math.sin(t) * sb * Math.cos(p);
					s += ((1 + q * P2(ct)) / (4 * Math.PI)) * (1 + v) * Math.cos(2 * p);
				}
			}
			s *= 2 * ((2 / nv) * ((2 * Math.PI) / np));
			check(Math.abs(s - (q / 2) * Math.sin(t) ** 2) < 1e-4, `eq:memory-axes does not give (q/2) sin^2 theta at ${deg(t)}: ${s}`);
		}
	}
	// the supernova and the balls
	const r = 10 * KPC, E = 3e46, q = 0.01;
	const memory = (q * G * E) / (2 * C ** 4 * r);
	check(fig(r) === '3.1e+20' && fig(memory) === '4.0e-21' && Math.round(memory / LIGO) === 4, `the supernova's memory ${memory}`);
	const moved = 0.5 * Number(memory.toExponential(1)) * ARM;
	check(moved.toExponential(0) === '8e-18' && Math.round(PROTON / moved / 100) === 2, `the balls move ${moved} m, ${PROTON / moved} times less than a proton`);
	return { gamma, alpha, length, years, exaggeration: ex, memory, moved };
}
