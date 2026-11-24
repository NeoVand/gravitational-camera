// Shared numbers and tools for the three diagrams of the tutorial's chapter 13.5 (tutorial/what-a-field-keeps/
// impulsive-waves.md): tut-impulsive-front, tut-light-ray-transform and tut-as-profile. Not a figure itself. The sheet,
// strokes, labels and cropping are chapters 1.2 to 13.1's (figs/tut-pot-lib.js), the fitted dashes chapter 1.8's
// (figs/tut-orb-lib.js), the stone bodies and their lit pictures chapter 13.1's (figs/tut-pass-lib.js), the colour roles
// chapters 6.1 and 7.4's (figs/tut-lorentz-lib.js, figs/tut-linear-lib.js, read from app.css), all imported, not copied.
//
// The colours: the wave's profile H and its front in the field's colour (H is an entry of the metric); the energy that
// crosses a front, N = c^2 Sigma, in matter's colour; the rays of light in the light role's colour; everything else in
// ink, the page's greys and the stone. Orange and blue, which mean a stretch and a squeeze, are not used: no figure here
// shows a stretch and a squeeze.
//
// The numbers, each computed here and asserted against the chapter's text (outside its comments) by `chapter(check)`:
//  - the kicks (units m = c = 1): a particle that crosses the front keeps q = E - p_z and its rest mass, and gains the
//    sideways momentum (1/2) q gradH. For |gradH| = 0.3: slow matter, q = 1, gets p_perp = 0.15, then E + p_z =
//    (1 + 0.15^2) / 1, so E = 1.01125, p_z = 0.01125; light along -z with E = 1, q = 2, gets 0.3, E = 1.0225,
//    p_z = -0.9775, a turn of atan(0.3 / 0.9775) = 0.2978 rad, |gradH| = 0.3 to first order; light along +z has q = 0
//    and is not kicked. The ratios 0.15 : 0 : 0.3 are the side panel's lengths;
//  - the numbers of the text: (1/2) c x 10^-6 = 150 m/s; the turn of light running against the front, |gradH|;
//  - Aichelburg and Sexl's profile H = -k ln|x - b|: gradH = -k (x - b) / |x - b|^2 points toward b with the size
//    k / |x - b|; its flux out of any circle round b is -2 pi k (by quadrature, to 1e-9), and its Laplacian vanishes off
//    b (by differences); at s = (0.5 R, 0) with b = (1.5 R, 0), |b - s| = R; the kick 4Gp/c^2 against Newton's
//    2G mu / V = 2Gp/c^2 for mu = p/c at V = c, the factor two; the chapter's tonne at 44 km/s has C = 3.0 x 10^-12
//    m^2/s, and a flash with the same C carries E = C c^3 / 4G = 3.1 x 10^23 J, the mass-energy of 3400 tonnes.
import { MATTER, FIELD, palette as linearPalette } from './tut-linear-lib.js';
import { LIGHT, palette as lorentzPalette } from './tut-lorentz-lib.js';
import { STONE_INK } from './tut-orb-lib.js';
import { FIELD_ON_STONE } from './tut-stars-lib.js';

export { MATTER, FIELD, LIGHT, STONE_INK, FIELD_ON_STONE };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
export const G = 6.674e-11, C = 2.998e8;

// ---- the kicks of the front ----------------------------------------------------------------------------------------
export const GRAD = 0.3;                       // |gradH| drawn, a pure number
/** A particle of mass m, energy E and momentum p_z along z, at rest across the front (p_perp = 0), crossing a front of
 * uniform gradient `grad`: its q, kick and momentum after (units m = c = 1). */
export function cross({ m, E, pz }, grad = GRAD) {
	const q = E - pz, kick = 0.5 * q * grad;
	if (q === 0) return { q, kick: 0, E1: E, pz1: pz, vperp: 0, vz: pz / E, mass2: E * E - pz * pz };
	const plus = (m * m + kick * kick) / q;     // E + p_z after, from (E - p_z)(E + p_z) = m^2 + p_perp^2
	const E1 = (q + plus) / 2, pz1 = (plus - q) / 2;
	return { q, kick, E1, pz1, vperp: kick / E1, vz: pz1 / E1, mass2: E1 * E1 - pz1 * pz1 - kick * kick };
}
export const MATTER_PART = { m: 1, E: 1, pz: 0 };
export const WITH = { m: 0, E: 1, pz: 1 };     // light along +z, with the front
export const AGAINST = { m: 0, E: 1, pz: -1 }; // light along -z, E = mc^2 of the matter

// ---- Aichelburg and Sexl's profile (lengths in R, H in units of k = 8Gp/c^3) --------------------------------------
export const B = [1.5, 0];
export const S_PART = [0.5, 0];
export const profile = (x, y) => -Math.log(Math.hypot(x - B[0], y - B[1]));
export const grad = (x, y) => { const dx = x - B[0], dy = y - B[1], r2 = dx * dx + dy * dy; return [-dx / r2, -dy / r2]; };

/** Every number of the chapter that the three diagrams draw or their captions print, checked once. */
export async function chapter(check) {
	await linearPalette(check);
	await lorentzPalette(check);
	const md = await (await fetch('/tutorial/what-a-field-keeps/impulsive-waves.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- the front and its kicks
	has(r`Its **front** is the plane $u = 0$, which moves along $+z$ at $c$.`, 'the front');
	has(r`$$\boxed{\;\Delta\sym{transverse-momentum}{\vect p_\perp} = \tfrac12\,q\,\nabla H\;} \label{eq:wave-kick}$$`, 'the kick');
	has(r`$$\boxed{\;q = \frac{E}{c} - p_z \text{ is the same after the front as before}\;}$$`, 'q kept');
	has(r`Across the front the coordinate $v$ of the particle therefore jumps by $H(\vect x_\perp)$. In the plane of $z$ and
		$ct$ the path is cut at the front and its far part is shifted by $\tfrac12H$ in both $z$ and $ct$, along the front
		itself`, 'the jump in v');
	has(r`It is continuous only where $H = 0$.`, 'the continuity');
	has(r`For slow matter $q \approx \matter mc$, so every part`, 'q of slow matter');
	has(r`A photon of energy $E'$ crossing this wave head-on has $q = 2E'/c$ (6.4)`, 'q of light against the front');
	has(r`turns light running against it, with $q = 2E/c$, by only $10^{-6}$ radians`, 'the turn of light');
	has(r`every part gets the velocity $\Delta\obs{\vect v} = \tfrac12c \nabla H$ whatever its mass`, 'the velocity of slow matter');
	has(r`A photon moving with the particle has $q = 0$ and is not turned.`, 'light with the front');
	check(Math.round(0.5 * C * 1e-6) === 150, 'half c times 10^-6 is not 150 m/s');
	has(r`$|\nabla H| = 10^{-6}$ gives every slow part $150\unit{m\,s^{-1}}$`, 'the number 150 m/s');
	const kicks = [MATTER_PART, WITH, AGAINST].map((p) => cross(p));
	check(near(kicks[0].kick, 0.15) && kicks[1].kick === 0 && near(kicks[2].kick, 0.3), `the kicks ${kicks.map((k) => k.kick)}`);
	check(near(kicks[0].q, 1) && kicks[1].q === 0 && near(kicks[2].q, 2), 'the light-cone components');
	for (const k of kicks) check(near(k.E1 - k.pz1, k.q, 1e-12), 'q is not kept');
	check(near(kicks[0].mass2, 1, 1e-12) && near(kicks[2].mass2, 0, 1e-12), 'the rest mass is not kept');
	check(near(kicks[0].E1, 1.01125) && near(kicks[0].pz1, 0.01125) && near(kicks[2].E1, 1.0225) && near(kicks[2].pz1, -0.9775), 'the momenta after');
	const turn = Math.atan2(kicks[2].kick, -kicks[2].pz1);
	check(near(turn, 0.2978, 1e-4) && Math.abs(turn - GRAD) < 0.01, `the turn ${turn}`);

	// ---- Aichelburg and Sexl
	has(r`$$\boxed{\;H = -\frac{8Gp}{c^3}\,\ln|\vect x_\perp - \vect b|\;} \label{eq:as-profile}$$`, 'the profile');
	has(r`$\nabla H$ points inward with the size $8Gp/c^3r$`, 'the gradient');
	has(r`$$\boxed{\;\sym{flyby-constant}{C} = \frac{4Gp}{c^2}\;}$$`, 'the flyby constant');
	has(r`Newton's $C = 2G\matter\mu/V$, for a mass $\matter\mu = p/c$ at $V = c$, is $2Gp/c^2$. The kick is twice Newton's`, 'Newton\'s constant');
	has(r`"as for the bending of light"`, 'the bending of light');
	has(r`\Delta\obs{\vect v} = \tfrac12c\nabla H = \frac{4Gp}{c^2}\,\frac{\vect b - \vect s}{|\vect b - \vect s|^2}`, 'the velocity toward the path');
	for (const rr of [0.3, 1, 2.7]) {
		let f = 0;
		const n = 4000;
		for (let i = 0; i < n; i++) {
			const t = (2 * Math.PI * (i + 0.5)) / n, [gx, gy] = grad(B[0] + rr * Math.cos(t), B[1] + rr * Math.sin(t));
			f += ((gx * Math.cos(t) + gy * Math.sin(t)) * rr * 2 * Math.PI) / n;
		}
		check(near(f, -2 * Math.PI, 1e-9), `the flux out of the circle ${rr}: ${f}`);
	}
	{
		const h = 1e-3;
		for (const [x, y] of [[0.2, 0.7], [-2, -1.3], [2.4, 1.1]]) {
			const lap = (profile(x + h, y) + profile(x - h, y) + profile(x, y + h) + profile(x, y - h) - 4 * profile(x, y)) / (h * h);
			check(Math.abs(lap) < 1e-5, `the profile is not harmonic at ${x}, ${y}: ${lap}`);
		}
		const [gx, gy] = grad(...S_PART);
		check(near(gx, 1) && gy === 0 && near(Math.hypot(B[0] - S_PART[0], B[1] - S_PART[1]), 1), 'the gradient at s');
	}
	{
		const Ct = (2 * G * 1000) / 44e3, E = (Ct * C ** 3) / (4 * G);
		check(Ct.toExponential(1) === '3.0e-12' && E.toExponential(1) === '3.1e+23' && Math.round(E / C ** 2 / 1000 / 100) === 34, `the flash ${Ct} ${E}`);
		has(r`To kick the edge of the ball as hard as the tonne does, the flash must carry $3.1\times10^{23}$ J, the mass-energy of
			3400 tonnes, and it then kicks twice as hard as Newton's law would say for that energy.`, 'the flash');
	}

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
	return { md, flat, has, state, kicks, turn };
}
