// Shared numbers for the six diagrams of the tutorial's section 10.3 (tutorial/glow/why-matter-barely-glows.md):
// tut-glow-dispersion, tut-glow-fermi, tut-glow-two-atoms, tut-glow-shears, tut-glow-bound and tut-glow-surface. Not
// a figure itself. hbar is section 8.1's (figs/tut-quantum-lib.js), k_B and G section 4.1's (figs/tut-osc-lib.js), c
// section 7.1's (figs/tut-metric-lib.js), the role check section 6.1's (figs/tut-lorentz-lib.js), matter's colour
// section 2.5's (figs/tut-null-lib.js), Simpson's rule section 8.2's (figs/tut-operators-lib.js), the curve
// x^3 / (e^x - 1) and its peak section 10.1's (figs/tut-planck-lib.js), and the five basis tables section 1.5's
// (figs/tut-five-basis.js), all imported, not copied. The frictions, the Fermi sea and the ball are in matter's colour,
// as the chapter writes eta, n and Delta mu in it; everything else is neutral (ink and the page's greys). Orange and
// blue, which mean a stretch and a squeeze, appear only on the shears of tut-glow-two-atoms and tut-glow-shears.
//
// `chapter(check)` asserts against the chapter's own text (fetched, outside its comments) every statement that a
// figure draws or its caption prints, and computes the numbers behind them:
//  - the wavenumbers: c_T / c = 1.0 x 10^-5 for c_T = 3000 m/s, so gravity's line is 10^5 times steeper than sound's;
//  - the free electrons: delta E = -4 E_F n_x n_y u_xy, lowered along k_x = k_y and raised along k_x = -k_y for
//    u_xy > 0, and the occupied region the image of the Fermi disc under 1 - u, an ellipse squeezed along k_x = k_y;
//  - the internal strain: the only coupling s_i Lambda_ijk u_jk left unchanged by the crystal's half turns is
//    Lambda_ijk = |eps_ijk|, so the shear u_yz drives s_x, u_zx drives s_y, u_xy drives s_z, and a stretch along a cube
//    axis drives nothing; the three shears off the diagonal carry 3/5 of a wave's drive, averaged over directions;
//  - the bound: x^3 / (e^x - 1) peaks at 2.821 with 1.4214; silicon's line (520 cm^-1, x = 2.553, Q = 173) reaches
//    98.5% of its bound, diamond's (1333 cm^-1, x = 6.546) 28%, and copper's electrons (Drude, tau = 2.5 x 10^-14 s,
//    omega tau = 2.7 at the energy peak) 37.5%;
//  - the surface: P_S = 4 pi R^2 (16 pi / 15) (1 + 2 c_T / 3 c_L) G rho c_T^3 (k_B T)^2 / hbar c^5, the chapter's
//    derivation (it corrects the paper's eq:surface-glow, which has pi^2 / 24 and 3 c_T / 2 c_L), so
//    P_V / P_S = 10 zeta(3) / pi^2 (1 + 2 c_T / 3 c_L) R / l_s, 0.89 for the steel ball (c_T = 3200,
//    c_L = 5900 m/s), l_s = Q hbar c_T / k_B T = 0.83 nm at Q = 10, 1.1 x 10^8 at R = 10 cm and P_S = 6.3 x 10^-46 W;
//    diamond's volume and surface meet at R = 3 (P_S / 4 pi R^2) / (P/V) = 165 nm, with c_T = 12.35, c_L = 18.15 km/s,
//    the density of its lattice (eight atoms of carbon in a cube of 0.3567 nm, as the paper's table compiles) and the
//    P/V = 0.251 x 10^-35 W m^-3 of line and pairs together.
import { HBAR, KB, C, palette, simpson, bose, ENERGY } from './tut-planck-lib.js';
import { G } from './tut-osc-lib.js';
import { MATTER } from './tut-null-lib.js';

export { HBAR, KB, C, G, palette, simpson, bose, ENERGY, MATTER };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the frictions' pale fill: each theme's own matter colour mixed with the page, so that on the printed (day) page
// it is a pale tint of matter's brown #533f03, the colour of its outlines, and on the night page a pale tint of matter's
// gold #f1dc86 (until 2026-11 the day page also took the gold, a pale yellow outside the palette) ------------------
export const FILL = 'light-dark(color-mix(in srgb, #533f03 20%, #fffffe), color-mix(in srgb, #f1dc86 20%, #fffffe))';

// ---- the temperature and the bound ----------------------------------------------------------------------------------
export const T = 293;
export const ROOM = (KB * T) / HBAR;                  // k_B T / hbar, s^-1
export const F = (x) => (x < 1e-9 ? 0 : bose(3, x));  // x^3 / (e^x - 1)
export const TOP = bose(3, ENERGY);                   // its largest value, 1.4214
export const AMU = 1.66053906660e-27;
/** x = hbar omega_0 / k_B T of a line at the spectroscopic wavenumber nu (cm^-1). */
export const lineX = (nu) => (2 * Math.PI * C * nu * 100) / ROOM;
export const SILICON = { nu: 520, Q: 173 };
export const DIAMOND = { nu: 1333, Q: 854 };
export const TAU_CU = 2.5e-14;                        // copper's collision time, s
export const DRUDE = TAU_CU * ROOM;                   // omega tau = DRUDE x
/** The fraction of its bound that a friction w(x) >= 0 reaches: int w F / (TOP int w), on [0, X]. */
export function fraction(w, X, n = 400000) {
	return simpson((x) => w(x) * F(x), 0, X, n) / (TOP * simpson(w, 0, X, n));
}
/** A damped oscillator's friction at x (section 4.1), up to its weight: x0^2 g / [(x0^2 - x^2)^2 + g^2 x^2], g = x0/Q. */
export const oscillator = (x0, Q) => { const g = x0 / Q; return (x) => (x0 * x0 * g) / ((x0 * x0 - x * x) ** 2 + g * g * x * x); };

// ---- the surface ----------------------------------------------------------------------------------------------------
export const ZETA3 = 1.2020569031595942;
export const STEEL = { cT: 3200, cL: 5900, rho: 7800, Q: 10 };
export const DIA = { cT: 12350, cL: 18150, rho: (8 * 12.011 * AMU) / 0.3567e-9 ** 3, PV: 0.251e-35 };
/** The prefactor 10 zeta(3) / pi^2 (1 + 2 c_T / 3 c_L). */
export const prefactor = ({ cT, cL }) => (10 * ZETA3) / (Math.PI ** 2 * (1 + (2 * cT) / (3 * cL)));
/** l_s = Q hbar c_T / k_B T, m. */
export const phononPath = ({ cT, Q }) => (Q * HBAR * cT) / (KB * T);
/** The surface's glow per square metre, the chapter's P_S over 4 pi R^2, W m^-2. */
export const surfacePerArea = ({ cT, cL, rho }) => ((16 * Math.PI) / 15) * (1 + (2 * cT) / (3 * cL)) * (G * rho * cT ** 3 * (KB * T) ** 2) / (HBAR * C ** 5);
/** P_V / P_S of the steel ball of radius R (m). */
export const steelRatio = (R) => (prefactor(STEEL) * R) / phononPath(STEEL);
/** Where diamond's volume and surface meet, R = 3 (P_S / 4 pi R^2) / (P/V), m; its ratio is R over this. */
export const DIAMOND_CROSS = (3 * surfacePerArea(DIA)) / DIA.PV;
export const diamondRatio = (R) => R / DIAMOND_CROSS;

// ---- the five shears and the internal strain ---------------------------------------------------------------------
/** Lambda_ijk = |eps_ijk|: the coupling of the shift s_i to the strain u_jk. */
export const LAMBDA = (i, j, k) => (i !== j && j !== k && k !== i ? 1 : 0);
/** The shift that the strain table u drives, s_i = Lambda_ijk u_jk. */
export const shiftOf = (u) => [0, 1, 2].map((i) => { let s = 0; for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) s += LAMBDA(i, j, k) * u[j][k]; return s; });

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	const md = await (await fetch('/tutorial/glow/why-matter-barely-glows.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);

	// ---- the wavenumbers
	has('For $c_T = 3000\\unit{m\\,s^{-1}}$, $c_T/c = 1.0\\times10^{-5}$', 'c_T / c');
	has('the two lines $\\omega = ck$ and $\\omega = c_Tk$ cross only at zero', 'the two lines');
	has('Their frequency stays near a value $\\omega_0$ even as $k \\to 0$', 'the optical frequency at k = 0');
	has('two phonons of wavevectors $\\vect k$ and $-\\vect k$ have no total momentum', 'the pair');
	const ratio = 3000 / C;
	check(ratio.toPrecision(2) === '0.000010' && Math.round(Math.log10(C / 3000)) === 5, `c_T / c = ${ratio}`);

	// ---- the free electrons
	has('$$\\delta E = -4E_F\\,\\hat n_x\\hat n_y\\,u_{xy} .$$', 'delta E');
	has('Each electron\'s wave stretches with the metal, so its wavenumber shrinks by that fraction', 'the wavenumber shrinks');
	has('Collisions then move electrons from the raised states above $E_F$ into the lowered states below it', 'the collisions');
	for (const deg of [45, 135, 225, 315]) {
		const t = (deg * Math.PI) / 180, nx = Math.cos(t), ny = Math.sin(t);
		const dE = -4 * nx * ny;                                   // per E_F u_xy, u_xy > 0
		const stretch = 2 * nx * ny;                              // the metal's stretch along n, per u_xy
		check(Math.sign(dE) === (deg % 180 === 45 ? -1 : 1), `delta E along ${deg} degrees`);
		check(near(dE, -2 * stretch, 1e-15), `the energy does not fall by twice the stretch at ${deg} degrees`);
	}

	// ---- the internal strain: Lambda = |eps| is kept by the half turns about the axes and the diagonal mirrors
	has('so it drives $s_x$ alone; likewise $u_{zx}$ drives $s_y$ and $u_{xy}$ drives $s_z$', 'which shear drives which shift');
	has('$b^4$ and $b^5$ stretch along the cube\'s own axes, on the diagonal, and $b^1$, $b^2$, $b^3$ are the shears $xy$, $yz$ and $zx$, off the diagonal', 'the two sets');
	has('**a stretch along a cube axis moves both copies alike**', 'a stretch moves both copies alike');
	has('the three shears off the diagonal carry $\\tfrac35$ of a wave\'s drive', 'the 3/5');
	{
		const ops = [
			[[1, 0, 0], [0, -1, 0], [0, 0, -1]], [[-1, 0, 0], [0, 1, 0], [0, 0, -1]], [[-1, 0, 0], [0, -1, 0], [0, 0, 1]],
			[[0, 1, 0], [1, 0, 0], [0, 0, 1]], [[0, 0, 1], [0, 1, 0], [1, 0, 0]], [[1, 0, 0], [0, 0, 1], [0, 1, 0]],
			[[0, 0, 1], [1, 0, 0], [0, 1, 0]]
		];
		for (const R of ops) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) {
			let s = 0;
			for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 3; c++) s += R[i][a] * R[j][b] * R[k][c] * LAMBDA(a, b, c);
			check(near(s, LAMBDA(i, j, k), 1e-15), `Lambda is not kept by the operation ${JSON.stringify(R)}`);
		}
		// a stretch u_xx is reversed in s by the half turn about y, so drives nothing (the chapter's argument)
		const halfY = [[-1, 0, 0], [0, 1, 0], [0, 0, -1]];
		check(halfY[0][0] ** 2 === 1 && halfY[0][0] === -1, 'the half turn about y reverses s_x and keeps u_xx');
	}
	{
		// the 3/5: the diagonal's share (1 - n_z^2)^2 summed over the axes, over 4, averaged over directions
		const N = 400;
		let diag = 0, w = 0;
		for (let i = 0; i < N; i++) for (let j = 0; j < 2 * N; j++) {
			const th = ((i + 0.5) * Math.PI) / N, ph = ((j + 0.5) * Math.PI) / N, s = Math.sin(th);
			const n = [s * Math.cos(ph), s * Math.sin(ph), Math.cos(th)];
			diag += (s * n.reduce((t, v) => t + (1 - v * v) ** 2, 0)) / 4;
			w += s;
		}
		check(near(1 - diag / w, 3 / 5, 1e-5), `the off-diagonal share ${1 - diag / w}`);
	}

	// ---- the bound
	has('whose largest value is $(\\kB T/\\hbar)^3\\times1.4214$ at $x = 2.821$', 'the peak');
	has('silicon\'s line at $x = 2.55$ reaches 98.5% of its own weight\'s bound', 'silicon\'s 98.5%');
	has('diamond\'s line at $x = 6.55$ reaches 28%', 'diamond\'s 28%');
	has('copper\'s electrons alone 37.5%', 'copper\'s 37.5%');
	has('Silicon\'s 520 cm⁻¹', 'silicon\'s line');
	has('at $\\sym{planck-ratio}{x} = \\hbar\\omega_0/\\kB T = 2.55$ at 293 K', 'silicon\'s x');
	has('here $Q = 173$', 'silicon\'s Q');
	has('Its line, at 1333 cm⁻¹ or 40.0 THz, lies at $x = 6.546$ in the Wien tail', 'diamond\'s x');
	has('Copper\'s $\\tau = 2.5\\times10^{-14}$ s', 'copper\'s tau');
	has('gives $\\omega\\tau = 2.7$ at the energy peak of section 10.1', 'omega tau at the peak');
	has('$$\\mathrm{Re}\\,\\matter\\eta = \\frac{\\tfrac15\\,\\matter nmv_F^2\\,\\tau}{1 + \\omega^2\\tau^2} ,$$', 'the Drude friction');
	const x = { silicon: lineX(SILICON.nu), diamond: lineX(DIAMOND.nu) };
	check(ENERGY.toFixed(3) === '2.821' && TOP.toFixed(4) === '1.4214' && TOP.toFixed(3) === '1.421', `the peak ${ENERGY}, ${TOP}`);
	check(x.silicon.toFixed(2) === '2.55' && x.diamond.toFixed(3) === '6.546' && x.diamond.toFixed(2) === '6.55', `the lines' x ${x.silicon}, ${x.diamond}`);
	check((DRUDE * ENERGY).toFixed(1) === '2.7', `omega tau at the peak ${DRUDE * ENERGY}`);
	const share = {
		silicon: fraction(oscillator(x.silicon, SILICON.Q), 30 * x.silicon, 3000000),
		diamond: fraction(oscillator(x.diamond, DIAMOND.Q), 30 * x.diamond, 3000000),
		diamondLine: F(x.diamond) / TOP,
		copper: simpson((y) => F(y) / (1 + (DRUDE * y) ** 2), 0, 400, 800000) / (TOP * (Math.PI / (2 * DRUDE)))
	};
	check((100 * share.silicon).toFixed(1) === '98.5', `silicon's share ${share.silicon}`);
	check((100 * share.diamond).toFixed(0) === '28' && (100 * share.diamondLine).toFixed(0) === '28', `diamond's share ${share.diamond}`);
	check((100 * share.copper).toFixed(1) === '37.5', `copper's share ${share.copper}`);
	// the Drude friction integrates to pi/2 DRUDE^-1 per unit of its height, and the oscillators to pi/2 per weight
	check(near(simpson((y) => 1 / (1 + (DRUDE * y) ** 2), 0, 40, 400000), Math.atan(40 * DRUDE) / DRUDE, 1e-10), 'the Drude area');
	check(near(simpson(oscillator(x.silicon, SILICON.Q), 0, 30 * x.silicon, 3000000), Math.PI / 2, 1e-5), 'the oscillator\'s area');

	// ---- the surface
	has('with $c_T = 3200$ and $c_L = 5900\\unit{m\\,s^{-1}}$ and $\\matter\\rho = 7800\\unit{kg\\,m^{-3}}$, the prefactor is 0.89, and at $Q = 10$, $\\ell_s = 0.83$ nm', 'the steel ball');
	has('A ball of radius 10 cm glows $6.3\\times10^{-46}$ W from its surface and $1.1\\times10^8$ times more from its volume', 'the steel ball\'s glow');
	has('the two meet at $R = 3(P_S/4\\pi R^2)/(P/V)$: 165 nm for diamond, the faintest', 'diamond\'s crossing');
	has('165 nm with the sound speeds of its own elastic constants, $c_T = 12.35$ and $c_L = 18.15\\unit{km\\,s^{-1}}$', 'diamond\'s sound speeds');
	has('**Diamond.** Its line, at 1333 cm⁻¹ or 40.0 THz, lies at $x = 6.546$ in the Wien tail, so it is faint and blue: 0.12, 0.25, $6.4\\,\\kB T$ (stated)', 'diamond\'s P/V');
	has('the surface wins only once $\\ell_s$ passes about $0.9R$', 'the limit');
	has('\\frac{16\\pi}{15}\\Bigl(1 + \\frac{2c_T}{3c_L}\\Bigr)\\frac{G\\matter\\rho\\,c_T^3\\,(\\kB T)^2}{\\hbar c^5}} .$$', 'the surface\'s glow');
	has('\\frac{10\\,\\zeta(3)}{\\pi^2(1 + 2c_T/3c_L)}', 'the boxed ratio');
	has('Every other material of the table crosses below 1 nm', 'the other crossings');
	const steel = {
		prefactor: prefactor(STEEL), ls: phononPath(STEEL), ratio: steelRatio(0.1),
		PS: 4 * Math.PI * 0.1 ** 2 * surfacePerArea(STEEL), cross: phononPath(STEEL) / prefactor(STEEL)
	};
	check(steel.prefactor.toFixed(2) === '0.89' && (steel.ls * 1e9).toFixed(2) === '0.83', `the steel ball ${steel.prefactor}, ${steel.ls}`);
	check((steel.ratio / 1e8).toFixed(1) === '1.1' && (steel.PS / 1e-46).toFixed(1) === '6.3', `the steel ball's ratio ${steel.ratio}, ${steel.PS}`);
	check(steel.cross < 1e-9 && near(steelRatio(steel.cross), 1, 1e-12), `steel crosses at ${steel.cross}`);
	// the ratio is the chapter's: P_V / P_S with P_V = V 32 zeta(3) G rho c_T^2 (k_B T)^3 / pi c^5 Q hbar^2
	for (const R of [1e-9, 1e-3, 0.1]) {
		const PV = (4 / 3) * Math.PI * R ** 3 * (32 * ZETA3 * G * STEEL.rho * STEEL.cT ** 2 * (KB * T) ** 3) / (Math.PI * C ** 5 * STEEL.Q * HBAR ** 2);
		check(near(PV / (4 * Math.PI * R * R * surfacePerArea(STEEL)), steelRatio(R), 1e-9 * steelRatio(R)), `the ratio at ${R} m`);
	}
	check(DIA.rho.toFixed(0) === '3516' && (DIAMOND_CROSS * 1e9).toFixed(0) === '165', `diamond's crossing ${DIAMOND_CROSS}, rho ${DIA.rho}`);

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
	return { md, flat, state, x, share, steel };
}
