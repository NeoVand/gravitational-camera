// Shared numbers and colours for the three diagrams of the tutorial's section 7.3 (tutorial/geometry/einstein-equation.md):
// tut-einstein-traces, tut-einstein-twenty and tut-einstein-three-balls. Not a figure itself. The colour roles are
// section 7.2's (figs/tut-curvature-lib.js: the observer's and the curvature's) and section 6.1's (figs/tut-lorentz-lib.js:
// the light role's and matter's), read from app.css by `palette(check)`; the sheet, strokes, labels and cropping are
// those of sections 6.1 to 7.2, all imported, not copied.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints, and the chapter's
// other numbers on the way (SI throughout):
//  - the factor 8 pi G / c^4 = 2.1 x 10^-43 N^-1; water's rest energy density rho c^2 = 9.0 x 10^19 J m^-3 and
//    R_00 = (1/2)(8 pi G / c^4) rho c^2 = 9.3 x 10^-24 m^-2;
//  - the trace of the tide, tr E = 4 pi G (rho + sum p / c^2) - Lambda c^2 (eq:active, with the cosmological
//    constant), for each bar of tut-einstein-traces: the Earth's mean density 5513 kg m^-3, 4.6 x 10^-6 s^-2; water,
//    8.4 x 10^-7 (ninety times the person's stretch); the Casimir gap of 1 micrometre, u = -pi^2 hbar c / 720 d^4 =
//    -4.3 x 10^-4 J m^-3 with the momentum flux 3u across and -u along, so sum p = u, -8.1 x 10^-30; the dark matter
//    round the Sun, 0.4 GeV cm^-3 = 6.4 x 10^-5 J m^-3, 7.1 x 10^-22 kg m^-3, 6.0 x 10^-31; sunlight at the Earth,
//    1361 W m^-2, null dust with T^00 = T^zz = F/c, 8.5 x 10^-32; the cosmological constant 1.1 x 10^-52 m^-2,
//    -Lambda c^2; the person's stretch 2 G M / r^3 = 9.3 x 10^-9 s^-2 at 1 m from 70 kg (and its squeeze, 4.7 x 10^-9);
//  - the pressures: 3p / rho c^2 = 3.4 x 10^-15 in water at one atmosphere, 9.3 x 10^-10 at the Earth's centre
//    (364 GPa, 13 100 kg m^-3), 5.6 x 10^-6 at the Sun's (6.5's 2.5 x 10^16 Pa, 1.5 x 10^5 kg m^-3);
//  - the Ricci part of the tide (eq:ricci-tide) from rho and T_ij: for dust (4 pi G rho / 3) delta_ij, a third of the
//    trace each way; for null dust along n, (4 pi G F / c^3)(delta_ij - n_i n_j), nothing along the beam; the
//    neutrinos of a core collapse, 3 x 10^46 J over 10 s from 10 kpc = 3.09 x 10^20 m: L = 3 x 10^45 W, F = 2500 W m^-2,
//    about twice sunlight's, and the squeeze G L / c^3 r^2 = 7.8 x 10^-32 s^-2; beside one mass the tide
//    (G M / r^3) diag(-2, 1, 1), trace-free;
//  - the count: section 7.2's 20 = 6 + 8 + 6 (tut-curvature-lib.js, by the rank of the symmetries' conditions), of
//    which the ten Ricci conditions fix 1 + 3 + 6 = 10 (20 less the 10 left free in empty space, by the same rank)
//    and leave 5 + 5 + 0 = 10, the Weyl tensor's.
import { OBS, CURV, palette as curvaturePalette, chapter as curvatureChapter, stack } from './tut-curvature-lib.js';
import { LIGHT, MATTER } from './tut-momentum-lib.js';
import { ACCENT, ACCENT2 } from '../lib.js';

export { OBS, CURV, LIGHT, MATTER, ACCENT, ACCENT2, stack };

/** The role colours against app.css, both themes: the observer's, the light role's, matter's and the curvature's. */
export const palette = (check) => curvaturePalette(check);

// ---- constants, SI ----------------------------------------------------------------------------------------------
export const G = 6.674e-11;                // m^3 kg^-1 s^-2
export const C = 299792458;                // m s^-1
export const HBAR = 1.054571817e-34;       // J s
export const EV = 1.602176634e-19;         // J
export const ATM = 101325;                 // Pa
export const KPC = 3.0857e19;              // m

/** tr E = 4 pi G (rho + sum p / c^2) - Lambda c^2, s^-2 (eq:active with the cosmological constant). */
export const trace = ({ rho = 0, sumP = 0, Lambda = 0 }) => 4 * Math.PI * G * (rho + sumP / (C * C)) - Lambda * C * C;

// ---- the matter of the bars --------------------------------------------------------------------------------------
export const RHO_EARTH = 5513;             // kg m^-3, the Earth's mean density (section R1)
export const RHO_WATER = 1000;             // kg m^-3
export const SUN_FLUX = 1361;              // W m^-2, sunlight at the Earth
export const DARK = 0.4 * 1e9 * EV / 1e-6; // J m^-3: 0.4 GeV cm^-3
export const GAP = 1e-6;                   // m, the Casimir plates' spacing
export const CASIMIR = -(Math.PI ** 2) * HBAR * C / (720 * GAP ** 4);   // J m^-3, 6.5's energy density
export const LAMBDA = 1.1e-52;             // m^-2, the cosmological constant (stated)
export const PERSON = 70, PERSON_R = 1;    // kg, m: the paper's person and the distance

/** The bars of tut-einstein-traces, in the comment's order: each its name (TeX), its trace, and its colour role. */
export function bars() {
	// sunlight: null dust, T^00 = T^zz = F/c, so rho c^2 = F/c and sum p = F/c
	const sun = { rho: SUN_FLUX / C / (C * C), sumP: SUN_FLUX / C };
	// the Casimir gap: energy density u, momentum flux 3u across the plates and -u along each of the other two
	const cas = { rho: CASIMIR / (C * C), sumP: 3 * CASIMIR - CASIMIR - CASIMIR };
	return [
		{ key: 'earth', name: "\\text{the Earth's mean density}", tr: trace({ rho: RHO_EARTH }), role: 'matter', printed: '4.6\\times10^{-6}' },
		{ key: 'water', name: '\\text{water}', tr: trace({ rho: RHO_WATER }), role: 'matter', printed: '8.4\\times10^{-7}' },
		{ key: 'casimir', name: '\\text{Casimir gap, }1\\,\\mathrm{\\mu m}', tr: trace(cas), role: 'matter', printed: '-8.1\\times10^{-30}' },
		{ key: 'dark', name: '\\text{dark matter round the Sun}', tr: trace({ rho: DARK / (C * C) }), role: 'matter', printed: '6.0\\times10^{-31}' },
		{ key: 'sun', name: '\\text{sunlight at the Earth}', tr: trace(sun), role: 'light', printed: '8.5\\times10^{-32}' },
		// the chapter prints -1.0 x 10^-35; Lambda c^2 = 1.1 x 10^-52 x c^2 = 9.89 x 10^-36, which is 9.9 x 10^-36 to two figures
		{ key: 'lambda', name: '\\text{cosmological constant}', tr: trace({ Lambda: LAMBDA }), role: 'matter', printed: '-9.9\\times10^{-36}' }
	];
}

/** The person's stretch a metre away, 2 G M / r^3, s^-2. */
export const STRETCH = (2 * G * PERSON) / PERSON_R ** 3;

/** A number to two figures as TeX, a x 10^b, with the sign. */
export function twoFigures(v) {
	const [m, e] = Math.abs(v).toExponential(1).split('e');
	return `${v < 0 ? '-' : ''}${m}\\times10^{${Number(e)}}`;
}

// ---- the Ricci part of the tide (eq:ricci-tide) -------------------------------------------------------------------
/** E^Ricci_ij from the mass density rho (kg m^-3) and the momentum flux T_ij (Pa, a 3 x 3 table), s^-2:
 * (4 pi G / 3)(rho + T_kk / c^2) delta_ij - (4 pi G / c^2)(T_ij - delta_ij T_kk / 3). */
export function ricciTide(rho, T) {
	const kk = T[0][0] + T[1][1] + T[2][2];
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? ((4 * Math.PI * G) / 3) * (rho + kk / (C * C)) : 0) -
		((4 * Math.PI * G) / (C * C)) * (T[i][j] - (i === j ? kk / 3 : 0))));
}
/** The same, term by term from Einstein's equation in trace-reversed form (the chapter's derivation): R_00, R_ij and R
 * from rho c^2 and T_ij, then c^2 [ (1/2)(delta_ij R_00 - R_ij) + (1/6) R delta_ij ]. */
export function ricciTideFromR(rho, T) {
	const k = (8 * Math.PI * G) / C ** 4, e = rho * C * C, kk = T[0][0] + T[1][1] + T[2][2];
	const R00 = (k / 2) * (e + kk), R = k * (e - kk);
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => {
		const Rij = k * (T[i][j] + (i === j ? 0.5 * (e - kk) : 0));
		return C * C * (0.5 * ((i === j ? R00 : 0) - Rij) + (i === j ? R / 6 : 0));
	}));
}
/** The momentum flux of null dust of energy flux F (W m^-2) along the unit vector n: (F/c) n_i n_j. */
export const beamFlux = (F, n) => n.map((a) => n.map((b) => (F / C) * a * b));
/** The tide beside one mass, along the line and twice across it, in units of G M / r^3 (section 1.4). */
export const BESIDE = [-2, 1, 1];

// ---- the deformed balls of tut-einstein-three-balls ----------------------------------------------------------------
/** The drawn deformation: x -> (1 - EPS E / |E|) x, with |E| the tide's largest eigenvalue in size, one EPS for all
 * three balls (the comment's "about 30 per cent"). */
export const EPS = 0.3;
/** The diagonal of the scaled tide E / |E| in the page, (along the drawn horizontal, across it), and out of it. */
export function shape(E3) {
	const big = Math.max(...E3.map(Math.abs));
	return E3.map((v) => v / big);
}

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
	const rel = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
	const fig2 = (v) => Math.abs(v).toExponential(1);
	const curv = curvatureChapter(check);

	// ---- the factor and water's R_00
	const k = (8 * Math.PI * G) / C ** 4;
	check(fig2(k) === '2.1e-43', `8 pi G / c^4 = ${k}`);
	check(fig2(RHO_WATER * C * C) === '9.0e+19', `water's rho c^2 = ${RHO_WATER * C * C}`);
	const R00 = 0.5 * k * RHO_WATER * C * C;
	check(fig2(R00) === '9.3e-24', `water's R_00 = ${R00}`);
	check(rel(C * C * R00, trace({ rho: RHO_WATER }), 1e-12), 'c^2 R_00 is not water\'s trace');

	// ---- the bars
	const B = bars();
	const want = { earth: ['4.6e-6', 1], water: ['8.4e-7', 1], casimir: ['8.1e-30', -1], dark: ['6.0e-31', 1], sun: ['8.5e-32', 1], lambda: ['9.9e-36', -1] };
	for (const b of B) {
		const [m, s] = want[b.key];
		check(fig2(b.tr) === m && Math.sign(b.tr) === s, `the ${b.key} bar's trace ${b.tr} is not ${s < 0 ? '-' : ''}${m}`);
		check(twoFigures(b.tr) === b.printed, `the ${b.key} bar prints ${b.printed}, not ${twoFigures(b.tr)}`);
	}
	const tr = Object.fromEntries(B.map((b) => [b.key, b.tr]));
	// the Earth and water, by the comment's numbers, and the ninety times
	check(Math.round(tr.water / STRETCH) === 90, `water's trace over the person's stretch is ${tr.water / STRETCH}`);
	// sunlight: 8 pi G F / c^3, twice its energy alone
	check(rel(tr.sun, (8 * Math.PI * G * SUN_FLUX) / C ** 3, 1e-12), 'sunlight\'s trace is not 8 pi G F / c^3');
	check(rel(tr.sun, 2 * trace({ rho: SUN_FLUX / C ** 3 }), 1e-12), 'light does not pull twice its energy');
	// the dark matter: 6.4 x 10^-5 J m^-3 and 7.1 x 10^-22 kg m^-3
	check(fig2(DARK) === '6.4e-5' && fig2(DARK / (C * C)) === '7.1e-22', `the dark matter ${DARK} J m^-3`);
	// the Casimir gap: u = -4.3 x 10^-4 J m^-3, sum p = u, trace 8 pi G u / c^2, negative
	check(fig2(CASIMIR) === '4.3e-4' && CASIMIR < 0, `the Casimir energy density ${CASIMIR}`);
	check(rel(tr.casimir, (8 * Math.PI * G * CASIMIR) / (C * C), 1e-12) && tr.casimir < 0, 'the Casimir trace is not 8 pi G u / c^2');
	// the cosmological constant: -Lambda c^2; the chapter's "-1.0 x 10^-35" holds to one figure, not to two
	check(rel(-tr.lambda, LAMBDA * C * C, 1e-12) && (LAMBDA * C * C).toExponential(0) === '1e-35', `Lambda c^2 = ${LAMBDA * C * C}`);
	// the person: -9.3 x 10^-9 along the line, 4.7 x 10^-9 twice across
	check(fig2(STRETCH) === '9.3e-9' && fig2(STRETCH / 2) === '4.7e-9', `the person's stretch ${STRETCH}`);
	// the axis holds every bar: 10^-36 to 10^-5
	for (const b of B) check(Math.abs(b.tr) > 1e-36 && Math.abs(b.tr) < 1e-5, `the ${b.key} bar is off the axis`);
	check(Math.log10(Math.abs(tr.earth) / Math.abs(tr.lambda)) > 29.5, 'the bars do not span thirty orders of magnitude');

	// ---- the pressures
	const ratio = (p, rho) => (3 * p) / (rho * C * C);
	check(fig2(ratio(ATM, RHO_WATER)) === '3.4e-15', `water's 3p / rho c^2 = ${ratio(ATM, RHO_WATER)}`);
	check(fig2(ratio(364e9, 13100)) === '9.3e-10', `the Earth's centre ${ratio(364e9, 13100)}`);
	check(fig2(ratio(2.5e16, 1.5e5)) === '5.6e-6', `the Sun's centre ${ratio(2.5e16, 1.5e5)}`);

	// ---- the Ricci part of the tide
	const Z = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	for (const [rho, T] of [[RHO_WATER, Z], [RHO_WATER, [[ATM, 0, 0], [0, ATM, 0], [0, 0, ATM]]], [3, [[2e15, 1e14, 0], [1e14, -4e14, 3e13], [0, 3e13, 7e14]]]]) {
		const a = ricciTide(rho, T), b = ricciTideFromR(rho, T);
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) check(Math.abs(a[i][j] - b[i][j]) <= 1e-12 * Math.abs(a[0][0]) + 1e-40, `eq:ricci-tide's term-by-term form differs at ${i}${j}`);
		const kk = T[0][0] + T[1][1] + T[2][2];
		check(rel(a[0][0] + a[1][1] + a[2][2], trace({ rho, sumP: kk }), 1e-12), 'the Ricci part does not carry the whole trace');
	}
	// dust: a third of the trace each way, no shape
	{
		const E = ricciTide(RHO_WATER, Z);
		check(rel(E[0][0], tr.water / 3, 1e-12) && E[0][0] === E[1][1] && E[1][1] === E[2][2] && E[0][1] === 0, 'water\'s Ricci tide is not a third of its trace each way');
	}
	// a beam along x: (4 pi G F / c^3)(delta - n n), nothing along it
	const beamTide = (F) => ricciTide(F / C ** 3, beamFlux(F, [1, 0, 0]));
	{
		const E = beamTide(SUN_FLUX), unit = (4 * Math.PI * G * SUN_FLUX) / C ** 3;
		check(Math.abs(E[0][0]) < 1e-12 * unit && rel(E[1][1], unit, 1e-12) && rel(E[2][2], unit, 1e-12), 'the beam\'s Ricci tide is not (4 pi G F / c^3)(delta - n n)');
	}
	// the neutrinos of a core collapse
	const L = 3e46 / 10, r = 10 * KPC, F = L / (4 * Math.PI * r * r);
	check(L === 3e45 && (r / 1e20).toFixed(2) === '3.09', `the collapse: L ${L}, r ${r}`);
	check(Math.round(F / 100) * 100 === 2500 && Math.round(F / SUN_FLUX) === 2, `the neutrinos' flux ${F}`);
	const squeeze = beamTide(F)[1][1];
	check(fig2(squeeze) === '7.8e-32' && rel(squeeze, (G * L) / (C ** 3 * r * r), 1e-12), `the neutrinos' squeeze ${squeeze}`);
	check(fig2(2 * squeeze) === '1.6e-31', 'the neutrinos\' trace');
	// beside one mass: trace-free, -2 : 1 : 1
	check(BESIDE[0] + BESIDE[1] + BESIDE[2] === 0 && BESIDE[0] === -2 * BESIDE[1], 'the tide beside a mass is not -2 : 1 : 1');

	// ---- the count: 20 = 6 + 8 + 6; Ricci 1 + 3 + 6 = 10; Weyl 5 + 5 + 0 = 10
	const [all, tide, magnetic, space] = curv.count;
	const [vacE, vacB] = curv.vacuum;
	const weyl = [vacE, vacB, 0];
	const ricci = [tide - vacE, magnetic - vacB, space - 0];
	check(all === 20 && [tide, magnetic, space].join() === '6,8,6', `the count ${curv.count}`);
	check(ricci.join() === '1,3,6' && weyl.join() === '5,5,0', `Ricci ${ricci}, Weyl ${weyl}`);
	check(ricci.reduce((s, v) => s + v) === 10 && weyl.reduce((s, v) => s + v) === 10, 'not ten and ten');
	// the ten Ricci conditions: a symmetric table of four rows, 1 (R_00) + 3 (R_0k) + 6 (R_ij)
	check(1 + 3 + 6 === (4 * 5) / 2, 'the Ricci tensor does not have ten entries');

	// ---- the drawn shapes: one EPS, and the volume each changes to first order (the scaled tide's trace)
	const shapes = { water: shape([1, 1, 1]), mass: shape(BESIDE), beam: shape([beamTide(F)[0][0], beamTide(F)[1][1], beamTide(F)[2][2]]) };
	check(shapes.water.join() === '1,1,1', 'the water ball is not squeezed evenly');
	check(shapes.mass.join() === '-1,0.5,0.5' && shapes.mass.reduce((s, v) => s + v) === 0, `the ball beside the mass ${shapes.mass}`);
	check(Math.abs(shapes.beam[0]) < 1e-12 && shapes.beam[1] === 1 && shapes.beam[2] === 1, `the ball in the beam ${shapes.beam}`);
	shapes.beam[0] = 0;
	return { traces: tr, stretch: STRETCH, ricci, weyl, count: curv.count, shapes, neutrinos: { L, F, squeeze } };
}
