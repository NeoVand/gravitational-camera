// Shared numbers for the three diagrams of the tutorial's section 6.4 (tutorial/relativity/energy-and-momentum.md):
// tut-momentum-shell, tut-momentum-lumps and tut-momentum-lightcone. Not a figure itself. The colours, the speed 0.6c
// and its rapidity are section 6.1's (figs/tut-lorentz-lib.js: the observer's colour and the light role's, read from
// app.css's --q-obs and --q-light, and matter's, --q-matter, through figs/tut-null-lib.js), and the sheet, strokes,
// labels and cropping are those of 6.1's and 6.2's diagrams, all imported, not copied.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints, in units of m and c:
//  - the mass shell E^2 = |p|^2 c^2 + m^2 c^4 (eq:shell): at 0.6c, gamma = 1.25 and gamma beta = 0.75, so
//    E = 1.25 mc^2 and |p|c = 0.75 mc^2, and 1.25^2 - 0.75^2 = 1.5625 - 0.5625 = 1; at rest E = mc^2; the energy of
//    motion (gamma - 1) mc^2 = 0.25 mc^2 at 0.6c, against Newton's 0.18;
//  - the lumps that stick: before, E = 2 x 1.25 = 2.5 mc^2 and P = 0, two rest energies of 1 and two energies of
//    motion of 0.25; after, one lump at rest with M = 2.5 m, more than 2m by 0.5 m, the lost energy of motion over
//    c^2; Newton's count of the loss would give 0.36 m;
//  - light-cone components: at 0.6c along +z, eta = ln 2, E/c + p_z = 2 mc and q = E/c - p_z = mc/2, the factors
//    e^{+-eta}, with the product m^2 c^2 (eq:lc-product with p_perp = 0); at rest both are mc; at 0.6c along -z,
//    q = 2 mc; light along +z has q = 0.
import { OBS, LIGHT, MATTER, palette, BETA, GAMMA, ETA } from './tut-lorentz-lib.js';

export { OBS, LIGHT, MATTER, palette, BETA, GAMMA, ETA };

/** E/mc^2 on the mass shell at |p|c/mc^2 = x (eq:shell with m = 1). */
export const shell = (x) => Math.sqrt(1 + x * x);

// ---- the two bodies of the shell, (|p|c, E) / mc^2 -----------------------------------------------------------------
export const REST = [0, 1];
export const MOVING = [GAMMA * BETA, GAMMA];

// ---- the lumps, units of mc^2 --------------------------------------------------------------------------------------
export const LUMP_REST = 1;                         // each lump's rest energy
export const LUMP_MOTION = GAMMA - 1;               // each lump's energy of motion at 0.6c
export const BEFORE = 2 * (LUMP_REST + LUMP_MOTION);
export const AFTER = BEFORE;                        // M c^2 of the lump at rest, by eq:conserved
export const NEWTON = 2 * LUMP_REST;                // Newton's mass, 2m

// ---- the light-cone components, units of mc: q = E/c - p_z and E/c + p_z of the point (p_z, E/c) ----------------------
export const q = ([pz, e]) => e - pz;
export const qbar = ([pz, e]) => e + pz;
/** The point (p_z, E/c) of the light-cone components (q, E/c + p_z). */
export const fromCone = (a, b) => [(b - a) / 2, (a + b) / 2];
export const ALONG = [GAMMA * BETA, GAMMA];          // 0.6c along +z
export const AGAINST = [-GAMMA * BETA, GAMMA];       // 0.6c along -z

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- the shell
	check(near(GAMMA, 1.25, 1e-15) && near(GAMMA * BETA, 0.75, 1e-15), `gamma ${GAMMA}`);
	check(near(MOVING[1] ** 2, 1.5625, 1e-15) && near(MOVING[0] ** 2, 0.5625, 1e-15) && near(MOVING[1] ** 2 - MOVING[0] ** 2, 1, 1e-15), '1.25^2 - 0.75^2 = 1');
	check(shell(REST[0]) === REST[1] && near(shell(MOVING[0]), MOVING[1], 1e-15), 'the two bodies are not on the shell');
	check(near(LUMP_MOTION, 0.25, 1e-15) && (0.5 * BETA * BETA).toFixed(2) === '0.18', 'the energy of motion at 0.6c');
	check(Math.round(100 * (1 - (0.5 * BETA * BETA) / LUMP_MOTION)) === 28, 'Newton\'s 28 per cent less');
	// light: |p|c = E, below the shell at every momentum and approached by it
	for (const x of [0.5, 1, 1.9, 10, 1e3]) check(shell(x) > x && shell(x) - x < 1 / (2 * x) + 1e-12, `the shell and light at ${x}`);
	// ---- the lumps
	check(near(BEFORE, 2.5, 1e-15) && near(AFTER, 2.5, 1e-15) && NEWTON === 2 && near(AFTER - NEWTON, 0.5, 1e-15), `the lumps ${BEFORE}`);
	check(near(2 * LUMP_MOTION, AFTER - NEWTON, 1e-15), 'the gain is not the lost energy of motion');
	check(near(2 * 0.5 * BETA * BETA, 0.36, 1e-15), 'Newton\'s count of the gain');
	// the momenta: +0.75 and -0.75, P = 0, before; zero after
	check(GAMMA * BETA + -GAMMA * BETA === 0, 'P before');
	// eq:system-mass before: (sum E/c)^2 - |sum p|^2 = 2.5^2, so M = 2.5 m
	check(near(Math.sqrt(BEFORE ** 2 - 0 ** 2), AFTER, 1e-15), 'the system mass before');
	// ---- light-cone components
	check(near(ETA, Math.log(2), 1e-15), `eta ${ETA}`);
	check(near(qbar(ALONG), 2, 1e-15) && near(q(ALONG), 0.5, 1e-15) && near(q(ALONG) * qbar(ALONG), 1, 1e-15), 'the factors 2 and 1/2');
	check(near(qbar(ALONG), Math.exp(ETA), 1e-14) && near(q(ALONG), Math.exp(-ETA), 1e-14), 'the factors are not e^{+-eta}');
	check(q(REST) === 1 && qbar(REST) === 1, 'at rest q = E/c + p_z = mc');
	check(near(q(AGAINST), 2, 1e-15) && near(qbar(AGAINST), 0.5, 1e-15), 'q = 2mc along -z');
	check(q([1.7, 1.7]) === 0 && q([-1.7, 1.7]) === 3.4, 'light along +z has q = 0, along -z q = 2E/c');
	for (const p of [REST, ALONG, AGAINST]) { const b = fromCone(q(p), qbar(p)); check(near(b[0], p[0], 1e-15) && near(b[1], p[1], 1e-15), `fromCone at ${p}`); }
	// eq:lc-boost: the boost with rapidity eta multiplies q' = e^{eta} q... here from the body's frame to the room
	{
		const room = [Math.sinh(ETA), Math.cosh(ETA)];
		check(near(room[0], ALONG[0], 1e-15) && near(room[1], ALONG[1], 1e-15), 'the body at 0.6c is (sinh eta, cosh eta)');
	}
	// the check question: 0.8c gives 3 and 1/3, e^{+-ln 3}
	{
		const g = 1 / Math.sqrt(1 - 0.64), p = [g * 0.8, g];
		check(near(qbar(p), 3, 1e-14) && near(q(p), 1 / 3, 1e-14) && near(Math.log(qbar(p)), Math.log(3), 1e-14), 'the check at 0.8c');
	}
	return { gamma: GAMMA, eta: ETA };
}
