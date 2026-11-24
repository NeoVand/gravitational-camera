// Shared numbers and tools for the three diagrams of the tutorial's chapter 6.5 (tutorial/relativity/stress-energy.md):
// tut-stress-flow-sign, tut-stress-beam-box and tut-stress-null-crossing. Not a figure itself. The colours are the
// chapter's colour roles, read from app.css by chapter 7.1's palette (figs/tut-metric-lib.js: --q-obs, --q-light,
// --q-matter and --q-curv), and the sheet, strokes, labels and cropping are those of chapters 6.1 to 6.4
// (figs/tut-pot-lib.js and the libraries they import); the rings of free beads, with their orange stretch and blue
// squeeze arrows, are chapter 1.5's (figs/tut-five-lib.js, after the paper's figs/tidal.js), all imported, not copied.
// This file adds a light oblique projection, for the small cubes of the first diagram, and a name of several lines.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints:
//  - the sign: a gas at the pressure p hands the momentum p along +x each second across a square metre of a face whose
//    normal is +x, toward +x, so T^xx = +p; a rod in tension tau along x hands -tau, so T^xx = -tau; chapter 4.3's
//    stress, the force per area of the far side on the near side, is the negative of each (-p and +tau); a squeeze
//    of 10^8 Pa gives T^xx = +10^8 Pa (the check);
//  - the beam: T^00 + T^zz = 2F/c, so a beam of power P is a line of 2P/c^3 kilograms per metre; the potential
//    2 G lambda ln b of such a line has, beside it, the Hessian (-1, 1, 0) x 2 G lambda / b^2 along the line to it,
//    across and along it (found here by differences), (-1, 1, 0) x 4GP/c^3 b^2; for 100 kW, lambda = 7.4 x 10^-21
//    kg/m and the tide at a metre 9.9 x 10^-31 s^-2, 9.4 x 10^21 times weaker than a person's 9.3 x 10^-9 s^-2; the
//    bench, -P/c^3 per metre, with the beam P/c^3: the energy alone;
//  - the box: light the same in every direction has the average of n_i n_j over directions delta_ij / 3 (by
//    quadrature), so the pressure U/3 each way and the diagonal momentum fluxes adding up to E; the walls' tension adds
//    -E, so the box pulls with E/c^2 (bar 1), the free beam's source 2E/c^2 (bar 2);
//  - the crossing: a particle at v_z = 0.4c meets the rays u0 +- 0.3, du = 0.6 apart, a stretch dl = du/(1 - v_z/c)
//    = 1.0 of the ray apart; the weight 1/(1 - v_z/c) = E/(E - c p_z) with v_z = p_z c^2/E turns (E - c p_z)^2/E into
//    E - c p_z.
import { OBS, LIGHT, CURV, palette } from './tut-metric-lib.js';
import { MATTER } from './tut-lorentz-lib.js';
import { placed, LABEL_GAP } from './tut-pot-lib.js';

export { OBS, LIGHT, MATTER, CURV, palette };

// ---- constants, SI -------------------------------------------------------------------------------------------------
export const G = 6.674e-11;
export const C = 2.998e8;                  // as the chapter prints it

// ---- the first diagram's light oblique projection --------------------------------------------------------------------
/** A cabinet projection: x to the right, y up, w into the page drawn up and to the right at the angle `angle`
 * (degrees) and shortened by `k`. Returns the page point (points, y down) of (x, y, w), `unit` points per unit, about
 * the page point o. */
export const oblique = (o, unit, angle = 30, k = 0.5) => {
	const c = Math.cos((angle * Math.PI) / 180) * k, s = Math.sin((angle * Math.PI) / 180) * k;
	return ([x, y, w]) => [o[0] + unit * (x + c * w), o[1] - unit * (y + s * w)];
};

// ---- a name of several lines -----------------------------------------------------------------------------------------
/** The lines `srcs` of one name, aligned by `ax` (0 left, 0.5 centre, 1 right), their joint box with its point
 * (ax, ay) at (x, y), then moved along `dir` until the whole name clears every mark of S by the label gap and every
 * label of `others` (tut-momentum-lightcone's names, made general). */
export async function lines(S, srcs, x, y, ax, ay, dir, color, others = [], skip = 1.6) {
	const set = async (dx, dy) => {
		const parts = [];
		for (const src of srcs) parts.push(await placed(src, 0, 0, ax, 0, color));
		let top = 0;
		const moved = [];
		for (const p of parts) { moved.push({ ...p, dy: top - p.box.t }); top += p.box.b - p.box.t + skip; }
		const H = top - skip;
		const W = Math.max(...parts.map((p) => p.box.r - p.box.l));
		const ox = x + dx, oy = y + dy - ay * H;
		const svg = moved.map((p) => `<g transform="translate(${ox.toFixed(2)},${(oy + p.dy).toFixed(2)})">${p.svg}</g>`).join('');
		const l = ox - ax * W;
		return { src: srcs.join(' '), svg, box: { l, r: l + W, t: oy, b: oy + H } };
	};
	for (let s = 0; s < 60; s += 0.05) {
		const c = await set(dir[0] * s, dir[1] * s);
		const apart = others.every((o) => c.box.r + LABEL_GAP <= o.box.l || o.box.r + LABEL_GAP <= c.box.l || c.box.b + LABEL_GAP <= o.box.t || o.box.b + LABEL_GAP <= c.box.t);
		if (apart && S.clearance(c.box).d >= LABEL_GAP + 0.2) return c;
	}
	throw new Error(`${S.name}: no room for the name ${srcs.join(' ')}`);
}

// ---- the sign of the momentum flux ----------------------------------------------------------------------------------------
/** The momentum along +x that crosses a square metre of a face whose normal is +x each second, toward +x: the force
 * per area along +x that the matter on the -x side exerts on the matter on the +x side. `push` is that force per area
 * along the normal, positive for a push (a pressure), negative for a pull (a tension). */
export const flux = (push) => push;
/** Chapter 4.3's stress on the same face: the force per area that the far (+x) side exerts on the near (-x) side,
 * the other half of the pair of Newton's third law. */
export const stress43 = (push) => -push;

// ---- the beam -------------------------------------------------------------------------------------------------------------
export const POWER = 1e5;                  // W, the paper's infrared beam
export const PERSON_TIDE = 9.3e-9;         // s^-2, a person a metre away (chapter 1.4)
/** The beam's line density, kg/m: (T^00 + T^zz) A / c^2 = 2 (F/c) A / c^2 = 2P/c^3. */
export const lineDensity = (P) => (2 * P) / C ** 3;
/** The potential of a long straight line of lambda kilograms per metre along z at the distance rho (chapter 2.4). */
export const linePotential = (lambda, [x, y]) => 2 * G * lambda * Math.log(Math.hypot(x, y));
/** The Hessian of a function of (x, y, z) at p, by central differences of the step h. */
export function hessian(f, p, h) {
	const H = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	const at = (d) => f(p.map((v, k) => v + d[k]));
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
		const e = (k, s) => [0, 1, 2].map((m) => (m === k ? s * h : 0));
		const add = (a, b) => a.map((v, k) => v + b[k]);
		H[i][j] = (at(add(e(i, 1), e(j, 1))) - at(add(e(i, 1), e(j, -1))) - at(add(e(i, -1), e(j, 1))) + at(add(e(i, -1), e(j, -1)))) / (4 * h * h);
	}
	return H;
}
/** The tide beside the line at the distance b, in the frame (along the line to it, across, along it): the Hessian of
 * 2 G lambda ln rho at (x, y) = (0, b), the line along z, rows (y, x, z). */
export function lineTide(lambda, b) {
	const H = hessian(([x, y]) => linePotential(lambda, [x, y]), [0, b, 0], b * 1e-3);
	return [[H[1][1], H[1][0], H[1][2]], [H[0][1], H[0][0], H[0][2]], [H[2][1], H[2][0], H[2][2]]];
}

// ---- the box of light ---------------------------------------------------------------------------------------------------
/** The average over directions of n_i n_j, by the midpoint rule in cos theta and phi. */
export function directionAverage(n = 200) {
	const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	for (let a = 0; a < n; a++) for (let b = 0; b < 2 * n; b++) {
		const c = -1 + (2 * (a + 0.5)) / n, s = Math.sqrt(1 - c * c), ph = (Math.PI * (b + 0.5)) / n;
		const v = [s * Math.cos(ph), s * Math.sin(ph), c];
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) A[i][j] += (v[i] * v[j]) / (2 * n * n);
	}
	return A;
}
export const BOX_BAR = 1;                  // the box's pull, units of E/c^2
export const BEAM_BAR = 2;                 // the free beam's, units of E/c^2

// ---- the crossing ------------------------------------------------------------------------------------------------------
export const VZ = 0.4;                     // the particle's speed along z, units of c
export const HALF_DU = 0.3;                // the dotted rays at u0 +- 0.3
/** dl = du/(1 - v_z/c): the stretch of ray between the meetings of the rays u0 +- du/2 with the worldline. */
export const stretch = (du, v = VZ) => du / (1 - v);

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- the sign
	{
		const p = 2.5, tau = 1.7;
		check(flux(p) === p && stress43(p) === -p, 'a gas: T^xx = +p, 4.3\'s stress -p');
		check(flux(-tau) === -tau && stress43(-tau) === tau, 'a rod in tension: T^xx = -tau, 4.3\'s stress +tau');
		// the two halves of the pair: what the near side gives the far side, and what the far side exerts on it
		for (const push of [p, -tau]) check(flux(push) + stress43(push) === 0, 'the flux is not the negative of 4.3\'s stress');
		check(flux(1e8) === 1e8 && stress43(1e8) === -1e8, 'the check: a squeeze of 10^8 Pa');
	}
	// ---- the beam
	const lambda = lineDensity(POWER);
	check(lambda.toPrecision(2) === '7.4e-21', `the beam's line density ${lambda}`);
	{
		const F = 3.7, c = 1;           // T^00 = T^0z = T^zz = F/c, and the source T^00 + T^zz
		const T = { '00': F / c, zz: F / c };
		check(T['00'] + T.zz === (2 * F) / c, 'the beam\'s source is not 2F/c');
		// the potential's Hessian beside the line: (-1, 1, 0) x 2 G lambda / b^2, at b = 1 m and at b = 2.5 m
		for (const b of [1, 2.5]) {
			const E = lineTide(lambda, b), unit = (2 * G * lambda) / (b * b);
			check(near(unit, (4 * G * POWER) / (C ** 3 * b * b), 1e-45), 'the unit is not 4GP/c^3 b^2');
			const want = [[-1, 0, 0], [0, 1, 0], [0, 0, 0]];
			for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) check(near(E[i][j] / unit, want[i][j], 1e-5), `the tide at b = ${b} is not (-1, 1, 0): ${E[i][j] / unit} at ${i}${j}`);
			check(near(E[0][0] + E[1][1] + E[2][2], 0, 1e-5 * unit), 'the tide beside the beam has a trace');
		}
		const tide = (4 * G * POWER) / C ** 3;
		check(tide.toPrecision(2) === '9.9e-31', `the tide at a metre ${tide}`);
		check((PERSON_TIDE / tide).toPrecision(2) === '9.4e+21', `the ratio to a person's tide ${PERSON_TIDE / tide}`);
		// the bench: a momentum flux of -P/c over its cross-section, a line of -P/c^3; with the beam, P/c^3
		const bench = -POWER / C ** 3;
		check(near(lambda + bench, POWER / C ** 3, 1e-35), 'beam and bench do not weigh the energy alone');
	}
	// ---- the box
	{
		const A = directionAverage();
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) check(near(A[i][j], i === j ? 1 / 3 : 0, 2e-5), `the average of n_i n_j at ${i}${j}: ${A[i][j]}`);
		const E = 1, light = 3 * (E / 3), walls = -E;          // the integrals of the diagonal, over the volume
		check(near(light, E, 1e-15) && near(light + walls, 0, 1e-15), 'the light\'s and the walls\' stresses do not cancel');
		check(near(E + light + walls, BOX_BAR * E, 1e-15), 'the box does not pull with E/c^2');
		// the same light as a free beam: its one diagonal flux T^zz = T^00 adds E and no wall takes it away
		const beam = E;
		check(near(E + beam, BEAM_BAR * E, 1e-15) && BEAM_BAR === 2 * BOX_BAR, 'the free beam\'s bar is not twice the box\'s');
	}
	// ---- the crossing
	{
		const du = 2 * HALF_DU;
		check(near(du, 0.6, 1e-15) && near(1 / (1 - VZ), 5 / 3, 1e-15), 'du and the factor 5/3');
		check(near(stretch(du), 1, 1e-15), `dl = ${stretch(du)}`);
		// with E = gamma m c^2 and p_z = gamma m v_z, the weight E/(E - c p_z) is 1/(1 - v_z/c)
		const g = 1 / Math.sqrt(1 - VZ * VZ), E = g, pz = g * VZ;
		check(near(pz / E, VZ, 1e-15) && near(E / (E - pz), 1 / (1 - VZ), 1e-14), 'the weight is not 1/(1 - v_z/c)');
		check(near(((E - pz) ** 2 / E) * (E / (E - pz)), E - pz, 1e-15), '(E - c p_z)^2/E times the weight is not E - c p_z');
	}
	return { lambda, tide: (4 * G * POWER) / C ** 3 };
}
