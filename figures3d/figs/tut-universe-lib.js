// Shared numbers for the five diagrams of the tutorial's section 12.2 (tutorial/sky/universe.md): tut-universe-crests,
// tut-universe-gstar, tut-universe-temperatures, tut-universe-surfaces and tut-universe-string. Not a figure itself.
// The sheet, strokes, labels and cropping are sections 1.2 to 12.1's (figs/tut-pot-lib.js), the plots and axes chapter
// 3.1's (figs/tut-prob-lib.js), the sampling of curves section 2.6's (figs/tut-fourier-lib.js), the names of several
// lines section 6.4's (figs/tut-curvature-lib.js, stack), the colour roles sections 6.1's and 7.4's
// (figs/tut-lorentz-lib.js: the observer's, the light role's and matter's; figs/tut-linear-lib.js: the field's), all
// imported, not copied, and asserted against app.css by `palette(check)`.
//
// The colours: light (its rays, the microwave sky's surface, the photons' line) in the light role's colour; gravitons
// and the metric in the field's; fermions (their states and counts) in matter's; the string's velocity in the
// observer's; everything else in ink and the page's greys. Orange and blue, which mean a stretch and a squeeze, are not
// used.
//
// The numbers, each computed here and asserted against the chapter's text (outside its comments) by `chapter(check)`:
//  - the counts: the table's rows read out of the chapter (its last number in each row's States column), bosons
//    2 + 16 + 9 + 1 = 28, fermions 72 + 12 + 6 = 90, 7/8 of them 78.75, so g*s = 106.75; today 2 + (7/8) 6 (4/11) =
//    43/11 = 3.91;
//  - the thermal history: the stepped g(T) of the chapter's planned interactive figure (the `try: thermal-history`
//    comment, whose table is asserted equal to the one below while that comment stands), each value derived here from
//    the particles still counted, the photons' Ta = (3.909 / g(T))^{1/3}, 0.3321 for the gravitons, (4/11)^{1/3} =
//    0.7138 for the neutrinos after 10^10 K, and today's 2.7255, 1.945 and 0.905 K;
//  - the two surfaces: the comoving distance int c dz / H(z) with H(z)^2 = H_0^2 [0.315 (1 + z)^3 + 9.2 x 10^-5
//    (1 + z)^4 + 0.685], H_0 = 67.4 km s^-1 Mpc^-1, to z = 1090 (13.86 Gpc) and to the start (14.14 Gpc), in the scale
//    factor a = 1/(1 + z) by the midpoint rule in 2 x 10^6 steps; the gap 0.28 Gpc and the ratio 1.020;
//  - the string: Delta = 8 pi G mu / c^2 and the step gamma v Delta / c = 8 pi G mu gamma v / c^3.
import { palette as linearPalette, MATTER, FIELD, OBS } from './tut-linear-lib.js';
import { LIGHT, OBS as OBS_LORENTZ, palette as lorentzPalette } from './tut-lorentz-lib.js';
import { stack } from './tut-curvature-lib.js';

export { MATTER, FIELD, OBS, LIGHT, stack };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

/** The role colours against app.css, both themes. */
export async function palette(check) {
	await linearPalette(check);
	await lorentzPalette(check);
	check(OBS === OBS_LORENTZ, 'the observer\'s colour differs between tut-linear-lib and tut-lorentz-lib');
}

// ---- the counts ---------------------------------------------------------------------------------------------------
/** The chapter's table of the hot Standard Model, row by row: name (as the figure prints it), kind, states. */
export const HOT = [
	{ key: 'photon', name: '\\text{photon}', kind: 'boson', g: 2 },
	{ key: 'gluons', name: '\\text{gluons}', kind: 'boson', g: 16 },
	{ key: 'wz', name: 'W^+\\text{, }W^-\\text{, }Z', kind: 'boson', g: 9 },
	{ key: 'higgs', name: '\\text{Higgs}', kind: 'boson', g: 1 },
	{ key: 'quarks', name: '\\text{quarks}', kind: 'fermion', g: 72 },
	{ key: 'leptons', name: '\\text{electron, muon, tau}', kind: 'fermion', g: 12 },
	{ key: 'neutrinos', name: '\\text{neutrinos}', kind: 'fermion', g: 6 }
];
export const FERMION = 7 / 8;
export const NU_CUBE = 4 / 11;                          // (T_nu / T_gamma)^3 today
const sum = (xs) => xs.reduce((s, x) => s + x, 0);
export const BOSONS = sum(HOT.filter((r) => r.kind === 'boson').map((r) => r.g));            // 28
export const FERMIONS = sum(HOT.filter((r) => r.kind === 'fermion').map((r) => r.g));        // 90
export const G_HOT = BOSONS + FERMION * FERMIONS;                                             // 106.75
export const G_TODAY = 2 + FERMION * 6 * NU_CUBE;                                             // 43/11

// ---- the thermal history ------------------------------------------------------------------------------------------
/** The states still counted, by species (per particle and antiparticle together), to derive each value of g(T). */
const SPECIES = {
	photon: [2, 'b'], gluons: [16, 'b'], wz: [9, 'b'], higgs: [1, 'b'], pions: [3, 'b'],
	top: [12, 'f'], bottom: [12, 'f'], charm: [12, 'f'], light: [36, 'f'],     // light: up, down, strange
	tau: [4, 'f'], muon: [4, 'f'], electron: [4, 'f'], neutrinos: [6, 'f']
};
const count = (keys) => sum(keys.map((k) => SPECIES[k][0] * (SPECIES[k][1] === 'f' ? FERMION : 1)));
const ALL = ['photon', 'gluons', 'wz', 'higgs', 'top', 'bottom', 'charm', 'light', 'tau', 'muon', 'electron', 'neutrinos'];
const without = (keys, gone) => keys.filter((k) => !gone.includes(k));
/** The steps of g(T), hottest first: at T (K) the named species annihilate, and g falls from `before` to `after`. The
 * temperatures are the planned interactive's (places schematic, heights exact). */
export const STEPS = (() => {
	const k1 = without(ALL, ['top']), k2 = without(k1, ['wz', 'higgs']), k3 = without(k2, ['bottom']), k4 = without(k3, ['tau']);
	const k5 = without(k4, ['charm']);
	const k6 = [...without(k5, ['gluons', 'light']), 'pions'], k7 = without(k6, ['muon', 'pions']);
	return [
		{ T: 2.0e15, before: count(ALL), after: count(k1), key: 'top' },
		{ T: 1.2e15, before: count(k1), after: count(k2), key: 'wzh' },
		{ T: 4.9e13, before: count(k2), after: count(k3), key: 'bottom' },
		{ T: 2.1e13, before: count(k3), after: count(k4), key: 'tau' },
		{ T: 1.5e13, before: count(k4), after: count(k5), key: 'charm' },
		{ T: 1.7e12, before: count(k5), after: count(k6), key: 'confinement' },
		{ T: 1.2e12, before: count(k6), after: count(k7), key: 'muons' },
		{ T: 5.9e9, before: count(k7), after: 2 + FERMION * 6 * NU_CUBE, key: 'electrons' }
	];
})();
export const T_PLANCK = 1.42e32, T_GAMMA = 2.7255, T_NU_PART = 1e10;     // K
/** g*s at the photons' temperature T (K), for the hot count gHot. */
export function gOf(T, gHot = G_HOT) {
	if (T > STEPS[0].T) return gHot;
	for (const s of STEPS) if (T > s.T) return s.before;
	return STEPS.at(-1).after;
}
/** The photons' Ta over today's, the neutrinos' and the gravitons', at the photons' temperature T (K). */
export const photonsTa = (T, gHot = G_HOT) => (G_TODAY / gOf(T, gHot)) ** (1 / 3);
export const NU_FLAT = NU_CUBE ** (1 / 3);                                    // 0.7138
export const neutrinosTa = (T, gHot = G_HOT) => (T > T_NU_PART ? photonsTa(T, gHot) : NU_FLAT);
export const GRAV_FLAT = (G_TODAY / G_HOT) ** (1 / 3);                          // 0.3321

// ---- the two surfaces ---------------------------------------------------------------------------------------------
const C_KMS = 299792.458, H0 = 67.4;                                          // km s^-1, km s^-1 Mpc^-1
const SHARES = { matter: 0.315, radiation: 9.2e-5, lambda: 0.685 };
/** The comoving distance (Gpc) from today back to the scale factor a1: c/H_0 int_{a1}^1 da / (a^2 E), with
 * a^2 E = sqrt(0.315 a + 9.2 x 10^-5 + 0.685 a^4). */
export function comoving(a1, n = 2000000) {
	let s = 0;
	const h = (1 - a1) / n;
	for (let i = 0; i < n; i++) { const a = a1 + (i + 0.5) * h; s += h / Math.sqrt(SHARES.matter * a + SHARES.radiation + SHARES.lambda * a ** 4); }
	return ((C_KMS / H0) * s) / 1000;
}
let surfaces = null;
/** The light's surface (z = 1090) and the gravitons' (the start), Gpc, computed once. */
export const SURFACES = () => (surfaces ??= { light: comoving(1 / 1091), gravitons: comoving(0) });

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/sky/universe.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- the redshift
	has(r`$$\frac{c\,\delta t_0}{a_0} = \frac{c\,\delta t_{\rm e}}{a_{\rm e}} .$$`, 'the two ends');
	has(r`So the period, and the wavelength $\lambda = c\,\delta t$, grow in proportion to $a$.`, 'the period grows as a');
	has(r`The microwave sky was released at $z = 1090$`, 'z = 1090');

	// ---- the counts: the table's rows, number for number
	{
		const rows = [...md.matchAll(/^\| ([^|]+?) \| (boson|fermion) \| ([^|]+?) \|/gm)].map((m) => ({ kind: m[2], g: +m[3].match(/(\d+)\s*$/)[1] }));
		check(rows.length === HOT.length, `the table has ${rows.length} rows`);
		rows.forEach((row, i) => check(row.kind === HOT[i].kind && row.g === HOT[i].g, `the table's row ${i}: ${JSON.stringify(row)}`));
	}
	has(r`The bosons hold 28 states and the fermions 90, so $g_{*s} = 28 + \tfrac78\cdot90 = 106.75$`, 'the hot count');
	has(r`so $g_{*s} = 2 + \tfrac78\cdot6\cdot\tfrac4{11} = \tfrac{43}{11} = 3.91$`, 'today\'s count');
	has(r`So each fermion state carries $\tfrac78$ of a boson state's energy`, 'the seven eighths');
	check(BOSONS === 28 && FERMIONS === 90 && near(FERMION * FERMIONS, 78.75) && near(G_HOT, 106.75), `the hot count ${BOSONS} ${FERMIONS} ${G_HOT}`);
	check(near(G_TODAY, 43 / 11, 1e-14) && G_TODAY.toFixed(2) === '3.91', `today's count ${G_TODAY}`);

	// ---- the temperatures
	has(r`T_g = \Bigl(\frac{3.91}{106.75}\Bigr)^{1/3}T_\gamma = 0.3321\times2.7255\unit K = 0.905\unit K`, 'T_g');
	has(r`\Bigl(\frac4{11}\Bigr)^{1/3}\sym{photon-temperature}{T_\gamma} = 1.945\unit K`, 'T_nu');
	has(r`at about $10^{10}$ K`, 'the neutrinos\' parting');
	has(r`$m_ec^2/\kB = 5.9\times10^9$ K`, 'the electrons\' temperature');
	has(r`Above $2\times10^{15}$ K, $mc^2/\kB$ for the heaviest, the top quark, every particle counts`, 'the top quark');
	has(r`$$\frac{\Gamma}{H} \approx \Bigl(\frac{T}{T_{\rm P}}\Bigr)^3 , \qquad \sym{planck-temperature}{T_{\rm P}} = \frac1{\kB}\sqrt{\frac{\hbar c^5}{G}} = 1.42\times10^{32}\unit K ,$$`, 'the Planck temperature');
	check(GRAV_FLAT.toFixed(4) === '0.3321' && NU_FLAT.toFixed(4) === '0.7138', `the flat lines ${GRAV_FLAT} ${NU_FLAT}`);
	check((T_GAMMA * GRAV_FLAT).toFixed(3) === '0.905' && (T_GAMMA * NU_FLAT).toFixed(3) === '1.945', 'today\'s temperatures');
	check(near(STEPS[0].before, G_HOT) && near(STEPS.at(-1).after, G_TODAY, 1e-14), 'the steps\' ends');
	const values = [96.25, 86.25, 75.75, 72.25, 61.75, 17.25, 10.75];
	STEPS.forEach((s, i) => {
		if (i > 0) check(near(s.before, STEPS[i - 1].after, 1e-12), `the step ${s.key} does not start where the last ended`);
		if (i < values.length) check(near(s.after, values[i], 1e-12), `the step ${s.key} ends at ${s.after}, not ${values[i]}`);
		if (i > 0) check(s.T < STEPS[i - 1].T, 'the steps are not in order');
	});
	check(near(photonsTa(1e3), 1) && near(photonsTa(1e31), GRAV_FLAT) && near(neutrinosTa(1e3), NU_FLAT) && near(neutrinosTa(1e11), photonsTa(1e11)), 'the lines\' ends');
	check(near(photonsTa(7e9), NU_FLAT, 1e-14), 'the photons before the pairs annihilate are not at the neutrinos\' value');
	// the planned interactive's table, while its comment stands: the same values, temperatures and ends
	{
		const plan = comments.find((c) => c.includes('try: thermal-history'));
		if (plan) {
			const sci = (T) => { const e = Math.floor(Math.log10(T) + 1e-9); return `${(T / 10 ** e).toFixed(1)} × 10^${e} K`; };
			STEPS.slice(0, -1).forEach((s, i) => check(plan.includes(`${values[i]} to ${sci(STEPS[i + 1].T)}`), `the plan's step ${values[i]} to ${sci(STEPS[i + 1].T)}`));
			check(plan.includes(`g_hot (the second slider) above ${sci(STEPS[0].T)}`) && plan.includes('3.909 below'), 'the plan\'s ends');
			check(plan.includes('log10 T from 32.15 (left) to 0.435 (right)') && plan.includes('0 to 1.1'), 'the plan\'s axes');
			check(plan.includes('then flat at (4/11)^(1/3) = 0.7138') && plan.includes('down to 10^10 K'), 'the plan\'s neutrinos');
		}
	}
	check(Math.log10(T_PLANCK).toFixed(2) === '32.15' && Math.log10(T_GAMMA).toFixed(3) === '0.435', 'the axis\'s ends');

	// ---- the surfaces
	has('A numerical integral gives 13.86 Gpc for the light and 14.14 Gpc for the gravitons', 'the two distances');
	has('The stretch from $z = 1090$ back to the start adds only 0.28 Gpc', 'the gap');
	has(r`$$\boxed{\;2.0\%\ \text{farther}\;} ,$$`, 'the 2%');
	has(r`H(z)^2 = H_0^2\bigl[0.315\,(1 + z)^3 + 9.2\times10^{-5}\,(1 + z)^4 + 0.685\bigr]`, 'H(z)');
	has(r`$H_0 = 67.4\unit{km\,s^{-1}\,Mpc^{-1}}`, 'H_0');
	has('The 0.28 Gpc is also the horizon at the light\'s release, so larger patterns obeyed the rule until then, and both skies show the same large spots', 'the large spots');
	const { light, gravitons } = SURFACES();
	check(light.toFixed(2) === '13.86' && gravitons.toFixed(2) === '14.14' && (gravitons - light).toFixed(2) === '0.28', `the surfaces ${light} ${gravitons}`);
	check(((gravitons / light - 1) * 100).toFixed(1) === '2.0', 'the 2%');
	// against the integral in z on its own grid (u = ln(1 + z)), for the light's surface
	{
		const U = Math.log(1091), n = 400000;
		let s = 0;
		for (let i = 0; i < n; i++) { const z = Math.expm1(((i + 0.5) * U) / n); s += ((1 + z) / Math.sqrt(0.315 * (1 + z) ** 3 + 9.2e-5 * (1 + z) ** 4 + 0.685) * U) / n; }
		check(Math.abs(((C_KMS / H0) * s) / 1000 - light) < 1e-5, 'the two integrals for the light\'s surface differ');
	}

	// ---- the string
	has(r`$$\boxed{\;\sym{deficit-angle}{\Delta} = \frac{8\pi G\matter\mu}{c^2}\;}$$`, 'the deficit angle');
	has(r`a source behind is seen twice, at most $\Delta$ apart`, 'the double images');
	has(r`$$\boxed{\;\frac{\delta T}{T} = \frac{\obs\gamma\obs v\Delta}{c} = \frac{8\pi G\matter\mu\,\obs\gamma\obs v}{c^3}\;} ,$$`, 'the step');
	has('the part of the plane already swept, to its left, is the string\'s **wake**', 'the wake');
	has('makes the left half of the background warmer than the right', 'the warmer half');
	has('which moves to the right at the speed $\\obs v$, at right angles to its length and to our line of sight', 'the motion');

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
	return { md, flat, has, state, light, gravitons };
}
