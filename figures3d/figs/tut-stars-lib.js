// Shared numbers for the five diagrams of the tutorial's section 12.1 (tutorial/sky/stars.md): tut-stars-shell,
// tut-stars-lane-emden, tut-stars-ends, tut-stars-inspiral and tut-stars-columns. Not a figure itself. The sheet,
// strokes, labels and cropping are sections 1.2 to 11.4's (figs/tut-pot-lib.js), the plots and axes section 3.1's
// (figs/tut-prob-lib.js), the stone and its shade section 2.5's (figs/tut-null-lib.js), the colour roles chapter
// 7.4's (figs/tut-linear-lib.js, through figs/tut-friction-lib.js: matter's and the field's, read from app.css), G
// section 3.6's (figs/tut-measure-lib.js, the app's 6.6743 x 10^-11), hbar section 8.1's (figs/tut-quantum-lib.js),
// c section 7.1's (figs/tut-metric-lib.js), the Sun's mass and the year section 9.2's (figs/tut-quadrupole-lib.js),
// all imported, not copied. The electron's and the proton's masses are CODATA 2018's.
//
// The colours: stars, their densities and their branches in matter's colour; the pull and the line r = r_s in the
// field's; everything else in ink and the page's greys. Orange and blue, which mean a stretch and a squeeze, are not
// used.
//
// The numbers, each computed here and asserted against the chapter's text (outside its comments) by `chapter(check)`:
//  - Lane-Emden: the equation integrated outward by fourth-order Runge-Kutta in steps of 10^-4 from the series
//    1 - xi^2/6 + n xi^4/120 - n(8n - 5) xi^6/15120 at xi = 10^-2, to the first zero, found by a cubic through the last
//    step: xi_1 = 3.654 and 6.897, omega = 2.714 and 2.018, so rho_c / rho_bar = xi_1^3 / 3 omega = 54.2 for n = 3;
//    the share of the mass inside xi is -xi^2 theta'(xi) / omega exactly, 0.406 at r/R = 0.25 for n = 3 ("41%");
//  - the white dwarf: C_{3/2} = (3 pi^2)^{2/3} hbar^2 / 5 m_e (2 m_p)^{5/3} = 3.12 x 10^6 SI, R = xi_1 (4 pi
//    omega)^{1/3} (5 C / 8 pi G) M^{-1/3} = 10,400 km at 0.6 M_sun; M_Ch = (sqrt(3 pi)/2) omega_3 (hbar c/G)^{3/2} /
//    (2 m_p)^2 = 1.43 M_sun; r_s = 2GM/c^2;
//  - the inspiral: tau = (5/256) c^5 d^4 / G^3 m1 m2 M, 8.8 s for 30 + 30 M_sun at 2200 km; the white-dwarf pair turning
//    every ten minutes (section 1.8's) at d = (G M (600 s / 2 pi)^2)^{1/3} = 113,000 km, with 244,000 years left
//    (7.7 x 10^12 s); lambda/2 pi = c / 2 Omega = 5500 km for the black holes; their cut-off 3 (r_s1 + r_s2) = 532 km;
//  - the Galaxy: reference/gravcam/galaxy.py reproduced line by line (its densities, its dust and MAG = 2.5 / ln 10),
//    each line of sight added up in the chapter's steps of 0.15 pc out to 60 kpc at the Sun's 20 pc: the column ratio
//    102 (galaxy.py's sky, run with the same steps, gives 101.784418), 31 magnitudes of dust to the centre (galaxy.py's
//    dust_opacity added up to 8.2 kpc, 31.355940) and 2.6 in all toward the anticentre (its visual_extinction,
//    2.619938); these three are asserted against galaxy.py's to a part in 10^6.
import { G } from './tut-measure-lib.js';
import { HBAR } from './tut-quantum-lib.js';
import { C } from './tut-metric-lib.js';
import { M_SUN, YEAR } from './tut-quadrupole-lib.js';
import { MATTER, FIELD, palette } from './tut-friction-lib.js';
import { SHADE, STONE_INK, DEEPEST } from './tut-null-lib.js';

export { G, HBAR, C, M_SUN, YEAR, MATTER, FIELD, palette, SHADE, STONE_INK, DEEPEST };
export const ME = 9.1093837015e-31;          // kg, the electron
export const MP = 1.67262192369e-27;         // kg, the proton
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
export const rel = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(a), Math.abs(b));
/** The field's colour, light theme, fixed: for marks on the stone, which the site does not swap. */
export const FIELD_ON_STONE = FIELD.match(/light-dark\((#[0-9a-f]{6}),/)[1];

// ---- the Lane-Emden equation ---------------------------------------------------------------------------------------
const STEP = 1e-4, START = 1e-2;
/** The solution of index n from the centre to its first zero: samples (xi, theta, theta') every STEP, xi_1, omega,
 * and theta(xi) between samples by the cubic through the neighbouring values and slopes. */
export function laneEmden(n) {
	const f = (x, t, d) => [d, -Math.sign(t) * Math.abs(t) ** n - (2 * d) / x];
	const x0 = START;
	let t = 1 - x0 ** 2 / 6 + (n * x0 ** 4) / 120 - (n * (8 * n - 5) * x0 ** 6) / 15120;
	let d = -x0 / 3 + (n * x0 ** 3) / 30 - (n * (8 * n - 5) * x0 ** 5) / 2520;
	const xs = [0, x0], ts = [1, t], ds = [0, d];
	let x = x0;
	for (;;) {
		const k1 = f(x, t, d);
		const k2 = f(x + STEP / 2, t + (STEP / 2) * k1[0], d + (STEP / 2) * k1[1]);
		const k3 = f(x + STEP / 2, t + (STEP / 2) * k2[0], d + (STEP / 2) * k2[1]);
		const k4 = f(x + STEP, t + STEP * k3[0], d + STEP * k3[1]);
		const t1 = t + (STEP / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
		const d1 = d + (STEP / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
		if (t1 <= 0) {
			// the zero inside this step, on the cubic through (x, t, d) and (x + STEP, t1, d1), by bisection
			const cub = hermite(x, x + STEP, t, t1, d, d1);
			let lo = x, hi = x + STEP;
			for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (cub(m) > 0) lo = m; else hi = m; }
			const xi1 = (lo + hi) / 2, s = (xi1 - x) / STEP, d1z = d + s * (d1 - d);
			xs.push(xi1); ts.push(0); ds.push(d1z);
			const omega = -xi1 * xi1 * d1z;
			const theta = (u) => {
				if (u <= 0) return 1;
				if (u >= xi1) return 0;
				let i = Math.min(xs.length - 2, Math.max(0, Math.floor(u / STEP)));
				while (xs[i] > u) i--;
				while (xs[i + 1] < u) i++;
				return hermite(xs[i], xs[i + 1], ts[i], ts[i + 1], ds[i], ds[i + 1])(u);
			};
			const slope = (u) => {
				let i = Math.min(xs.length - 2, Math.max(0, Math.floor(u / STEP)));
				while (xs[i] > u) i--;
				while (xs[i + 1] < u) i++;
				const s2 = (u - xs[i]) / (xs[i + 1] - xs[i]);
				return ds[i] + s2 * (ds[i + 1] - ds[i]);
			};
			/** The share of the mass inside xi: -xi^2 theta'(xi) / omega, from the equation itself. */
			const massInside = (u) => (u >= xi1 ? 1 : (-u * u * slope(u)) / omega);
			return { n, xi1, omega, theta, massInside, xs, ts, ds };
		}
		x += STEP; t = t1; d = d1;
		xs.push(x); ts.push(t); ds.push(d);
	}
}
function hermite(xa, xb, ya, yb, da, db) {
	const h = xb - xa;
	return (u) => {
		const s = (u - xa) / h, s2 = s * s, s3 = s2 * s;
		return (2 * s3 - 3 * s2 + 1) * ya + (s3 - 2 * s2 + s) * h * da + (-2 * s3 + 3 * s2) * yb + (s3 - s2) * h * db;
	};
}
let solutions = null;
/** The two solutions the chapter uses, n = 3/2 and n = 3, computed once. */
export const solved = () => (solutions ??= { half: laneEmden(1.5), three: laneEmden(3) });

// ---- the white dwarf and the limits ---------------------------------------------------------------------------------
export const C32 = ((3 * Math.PI ** 2) ** (2 / 3) * HBAR ** 2) / (5 * ME * (2 * MP) ** (5 / 3));
/** The radius of a white dwarf of M kilograms, the polytrope of index 3/2, m. */
export function wdRadius(M) {
	const { xi1, omega } = solved().half;
	return xi1 * (4 * Math.PI * omega) ** (1 / 3) * ((5 * C32) / (8 * Math.PI * G)) * M ** (-1 / 3);
}
export const chandrasekhar = () => ((Math.sqrt(3 * Math.PI) / 2) * solved().three.omega * ((HBAR * C) / G) ** 1.5) / (2 * MP) ** 2;
/** The Schwarzschild radius of M kilograms, m. */
export const rs = (M) => (2 * G * M) / (C * C);
export const NS = { mass: 1.4, radius: [11, 13], central: 12, max: [2, 2.3] };     // M_sun, km: the chapter's (stated)
export const WD = { mass: 0.6 };                                                   // M_sun

// ---- the inspiral -------------------------------------------------------------------------------------------------
/** The time to merger, eq:inspiral, s: separation d (m), masses m1, m2 (kg). */
export const tau = (d, m1, m2) => (5 / 256) * (C ** 5 * d ** 4) / (G ** 3 * m1 * m2 * (m1 + m2));
/** The separation with the time tau left. */
export const sepAt = (t, m1, m2) => ((256 / 5) * (G ** 3 * m1 * m2 * (m1 + m2) * t) / C ** 5) ** 0.25;
export const HOLES = { m: 30 * M_SUN, d: 2.2e6 };
export const DWARFS = { m: 0.6 * M_SUN, period: 600 };
/** The white dwarfs' separation, Kepler's law for a period of ten minutes, m. */
export const dwarfSep = () => (G * 2 * DWARFS.m * (DWARFS.period / (2 * Math.PI)) ** 2) ** (1 / 3);
/** The black holes' reduced wavelength at 2200 km, lambda / 2 pi = c / 2 Omega (f = Omega / pi), m. */
export const reduced = () => C / (2 * Math.sqrt((G * 2 * HOLES.m) / HOLES.d ** 3));
/** Where the black holes' line is cut, 3 (r_s1 + r_s2), m. */
export const cutoff = () => 3 * 2 * rs(HOLES.m);

// ---- the Galaxy: reference/gravcam/galaxy.py ----------------------------------------------------------------------
export const R_SUN = 8.2, Z_SUN = 0.02;                       // kpc
const THIN = { mass: 3.5e10, length: 2.6, height: 0.3 };
const THICK = { mass: 0.6e10, length: 2.0, height: 0.9 };
const BULGE = { mass: 1.5e10, scale: 0.5, flattening: 0.6 };
const DUST = { length: 3.2, height: 0.1, visual: 1.0 };
export const MAG = 2.5 / Math.log(10);
const disc = (R, z, { mass, length, height }) => (mass / (2 * Math.PI * length ** 2) / (2 * height)) * Math.exp(-R / length - Math.abs(z) / height);
const bulge = (R, z, { mass, scale, flattening }) => (mass / (8 * Math.PI * flattening * scale ** 3)) * Math.exp(-Math.sqrt(R * R + (z / flattening) ** 2) / scale);
/** Solar masses per cubic kpc at galactocentric (x, y, z), kpc (galaxy.py, stellar_density). */
export const stellar = (x, y, z) => { const R = Math.hypot(x, y); return disc(R, z, THIN) + disc(R, z, THICK) + bulge(R, z, BULGE); };
/** Visual optical depth per kpc (galaxy.py, dust_opacity). */
export const dust = (x, y, z) => (DUST.visual / MAG) * Math.exp(-(Math.hypot(x, y) - R_SUN) / DUST.length - Math.abs(z) / DUST.height);
export const SIGHT = { step: 0.15e-3, reach: 60 };            // kpc: the chapter's 0.15 pc out to 60 kpc
/** Along the line from the Sun toward the centre (sign +1) or the anticentre (-1): the column, the total extinction,
 * and the running extinction (magnitudes) and density at the distance s (kpc), in the chapter's steps. */
export function sight(sign) {
	const { step, reach } = SIGHT;
	const n = Math.round(reach / step);
	let column = 0, tau0 = 0;
	const at = (s) => [-R_SUN + sign * s, 0, Z_SUN];
	const cum = new Float64Array(n + 1);         // the optical depth of the first k steps
	for (let i = 0; i < n; i++) {
		const s = (i + 0.5) * step;
		const p = at(s);
		column += stellar(...p) * step;
		tau0 += dust(...p) * step;
		cum[i + 1] = tau0;
	}
	/** The extinction from the Sun out to s, magnitudes, in the same steps (the last part-step by Simpson's rule). */
	const extinction = (s) => {
		const k = Math.min(n, Math.floor(s / step + 1e-9));
		let sum = cum[k];
		const rest = s - k * step;
		if (rest > 0) { const a = k * step; sum += (rest / 6) * (dust(...at(a)) + 4 * dust(...at(a + rest / 2)) + dust(...at(s))); }
		return MAG * sum;
	};
	return { column, total: MAG * tau0, extinction, density: (s) => stellar(...at(s)) };
}
/** galaxy.py's own numbers in the chapter's steps (sky and visual_extinction, run once): the JS above must give them. */
export const PY = { ratio: 101.784418, centre: 31.355940, anticentre: 2.619938 };

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/sky/stars.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- Lane-Emden
	const { half, three } = solved();
	has(r`The surface is at $\xi_1 = 6.897$, with $\omega_3 = 2.018$, so the centre is $\xi_1^3/3\omega_3 = 54.2$ times denser than the mean`, 'the n = 3 solution');
	has(r`with $\xi_1 = 3.654$ and $\omega_{3/2} = 2.714$ from the numerical solution`, 'the n = 3/2 solution');
	has(r`for $n = 0$ the density is uniform, $\theta = 1 - \xi^2/6$ and $\xi_1 = \sqrt6$`, 'the uniform ball');
	check(three.xi1.toFixed(3) === '6.897' && three.omega.toFixed(3) === '2.018', `n = 3: ${three.xi1}, ${three.omega}`);
	check(half.xi1.toFixed(3) === '3.654' && half.omega.toFixed(3) === '2.714', `n = 3/2: ${half.xi1}, ${half.omega}`);
	const contrast = three.xi1 ** 3 / (3 * three.omega);
	check(contrast.toFixed(1) === '54.2', `rho_c / rho_bar = ${contrast}`);
	const inner = three.massInside(0.25 * three.xi1);
	check(Math.round(100 * inner) === 41, `the share inside a quarter of the radius is ${inner}`);
	// the share by the sum of xi^2 theta^3 agrees with -xi^2 theta' / omega
	{
		let sum = 0;
		const b = 0.25 * three.xi1, k = 20000;
		for (let i = 0; i < k; i++) { const u = ((i + 0.5) * b) / k; sum += u * u * three.theta(u) ** 3 * (b / k); }
		check(rel(sum / three.omega, inner, 1e-6), `the share by the sum, ${sum / three.omega}, against ${inner}`);
	}
	// against the series near the centre and the uniform ball's exact solution
	check(Math.abs(three.theta(0.05) - (1 - 0.05 ** 2 / 6 + (3 * 0.05 ** 4) / 120)) < 1e-9, 'theta_3 near the centre');
	check(Math.abs(laneEmden(0).xi1 - Math.sqrt(6)) < 1e-8, 'n = 0 does not end at sqrt 6');
	check(Math.abs(laneEmden(1).xi1 - Math.PI) < 1e-8 && Math.abs(laneEmden(1).theta(1.3) - Math.sin(1.3) / 1.3) < 1e-9, 'n = 1 is not sin xi / xi');

	// ---- the white dwarf and the limits
	has(r`C_{3/2} = \frac{(3\pi^2)^{2/3}\hbar^2}{5m_e(2m_p)^{5/3}} = 3.12\times10^6\unit{m^4\,kg^{-2/3}\,s^{-2}}`, 'C_3/2');
	has(r`$$R = \xi_1\,(4\pi\omega_{3/2})^{1/3}\,\frac{5C_{3/2}}{8\pi G}\,\matter M^{-1/3} ,$$`, 'the radius of a white dwarf');
	has(r`For $0.6\,M_\odot$ it gives 10,400 km, the size of the Earth`, 'the white dwarf\'s radius');
	has(r`\frac{(\hbar c/G)^{3/2}}{(2m_p)^2} = 1.43\,M_\odot\;} \label{eq:chandrasekhar}`, 'the Chandrasekhar mass');
	has(r`a radius of about 12 km (11 to 13 km, stated)`, 'the neutron star\'s radius');
	has(r`which allows neutron stars up to about 2 to $2.3\,M_\odot$ (stated)`, 'the heaviest neutron stars');
	has(r`What is left is a **neutron star** of about $1.4\,M_\odot$`, 'the neutron star\'s mass');
	check(C32.toPrecision(3) === '3.12e+6', `C_3/2 = ${C32}`);
	check(Math.round(wdRadius(WD.mass * M_SUN) / 1e5) * 100 === 10400, `R(0.6) = ${wdRadius(WD.mass * M_SUN)}`);
	check((chandrasekhar() / M_SUN).toFixed(2) === '1.43', `M_Ch = ${chandrasekhar() / M_SUN}`);
	check(near(wdRadius(8 * M_SUN) / wdRadius(M_SUN), 0.5, 1e-12), 'the radius is not as M^-1/3');

	// ---- the inspiral
	has(r`The formula gives $\tau = 8.8$ s, about nine seconds before they merge.`, 'the black holes\' time');
	has(r`The reduced wavelength, $\lambda/2\pi = 5500$ km, is 2.5 times the separation`, 'the reduced wavelength');
	has(r`is 113,000 km apart and radiates at 3.3 mHz. It has 244,000 years left.`, 'the white dwarfs');
	has(r`Halving the separation shortens it sixteen times`, 'the fourth power');
	{
		const t = tau(HOLES.d, HOLES.m, HOLES.m);
		check(t.toFixed(1) === '8.8', `tau = ${t}`);
		check(Math.round(reduced() / 1e5) * 100 === 5500 && (reduced() / HOLES.d).toFixed(1) === '2.5', `lambda / 2 pi = ${reduced()}`);
		check(Math.round(sepAt(10, HOLES.m, HOLES.m) / 1e4) * 10 === 2270, 'ten seconds is not 2270 km');
		const d = dwarfSep(), tw = tau(d, DWARFS.m, DWARFS.m);
		check(Math.round(d / 1e6) * 1000 === 113000, `the dwarfs' separation ${d}`);
		check(Math.round(tw / YEAR / 1000) * 1000 === 244000 && tw.toExponential(1) === '7.7e+12', `the dwarfs' time ${tw} s`);
		check((Math.sqrt((G * 2 * DWARFS.m) / d ** 3) / Math.PI * 1e3).toFixed(1) === '3.3', 'the dwarfs\' 3.3 mHz');
		check(Math.round(cutoff() / 1e3) === 532, `the cut-off ${cutoff()}`);
		check(near(tau(2 * HOLES.d, HOLES.m, HOLES.m) / t, 16, 1e-12), 'doubling d does not multiply tau by 16');
	}

	// ---- the Galaxy
	has(r`The Sun is 8.2 kpc from the centre and 20 pc above the mid-plane.`, 'the Sun\'s place');
	has(r`is flattened to 0.6 of its width in height`, 'the bulge\'s flattening');
	has(r`Adding up each column in steps of 0.15 pc out to 60 kpc gives`, 'the steps');
	has(r`$$\boxed{\;\frac{N_{\rm centre}}{N_{\rm anticentre}} = 102\;}$$`, 'the column ratio');
	has(r`Along the 8.2 kpc to the centre the model's dust adds up to 31 magnitudes`, 'the extinction to the centre');
	const toward = sight(1), away = sight(-1);
	const ratio = toward.column / away.column, centre = toward.extinction(R_SUN);
	check(rel(ratio, PY.ratio, 1e-6) && Math.round(ratio) === 102, `the column ratio ${ratio}`);
	check(rel(centre, PY.centre, 1e-6) && Math.round(centre) === 31, `the extinction to the centre ${centre}`);
	check(rel(away.total, PY.anticentre, 1e-6) && away.total.toFixed(1) === '2.6', `the anticentre's extinction ${away.total}`);

	/** Whether the diagram `name` is drawn (its figure line, with the caption `caption`) or still planned (its comment). */
	const state = (name, id, caption) => {
		const drawn = flat.includes(`](${name}){#fig:${id}}`);
		const planned = comments.some((c) => c.includes(`diagram: ${name} `));
		check(drawn !== planned, `the diagram ${name} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) {
			has(`![${caption}](${name}){#fig:${id}}`, `the caption of ${name}`);
			has(`(Figure [](#fig:${id}))`, `the pointer to ${name}`);
		}
		return drawn;
	};
	return { md, flat, has, state, half, three, contrast, inner, toward, away, ratio, centre };
}

/** A dash pattern for the polyline `pts` (page points) stretched so that the line starts and ends on a whole dash, as
 * figs/tut-orb-lib.js's `dashed` fits its straight lines: [on, off], with the scale it applied. */
export function fitDash(pts, dash) {
	let L = 0;
	for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
	const k = Math.max(1, Math.round((L + dash[1]) / (dash[0] + dash[1])));
	const f = L / (k * dash[0] + (k - 1) * dash[1]);
	return { dash: [+(dash[0] * f).toFixed(4), +(dash[1] * f).toFixed(4)], f, k, L };
}
