// The tutorial, section 2.5 (tutorial/outside/null-space.md), its first diagram: three steel balls that pull alike
// outside. Three balls of radius R = 0.1 m cut through their centres, side by side: rho0 + delta rho = (5/3) rho0
// r^2 / R^2, empty at the centre and 1.67 rho0 at the surface; the uniform ball, rho0; and rho0 - delta rho =
// rho0 (2 - (5/3) r^2 / R^2), 2 rho0 at the centre and rho0 / 3 at the surface. Each is shaded by its density in
// matter's colour, on one scale for all three (opacity 0.385 rho / rho0, so that 2 rho0 has section 2.4's darkest
// shade), with a key of that scale beside the third. Above each, the pull at 1.5 R and at 2 R along three directions,
// thin grey arrows pointing at the centre, the same list for all three. Under each, its density and its moment of
// inertia: 0.157, 0.132 and 0.106 kg m^2.
// Exact: the densities, centre and surface (asserted), the masses, equal to a part in 10^9 and 32.9 kg (asserted),
// so that the pull GM/r^2 is the same at 1.5 R and 2 R (asserted); the arrows' lengths in the ratio of the pulls,
// (2 / 1.5)^2 = 16/9 (asserted in points); the moments of inertia (asserted against the printed values and the
// factors 100/84 and 68/84); A = pi G R^2 rho0 / 3 = 5.5 x 10^-9 J/kg (asserted); the shading, a radial gradient of 64
// stops following rho(r) (asserted at the stops). Schematic: the arrows' common scale. Pictorial: the sawn face of the
// steel ball, a picture from an image model (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py, as
// in section 2.4's figs/tut-grn-kelvin.js), clipped to the exact circles, under a white wash (WASH) so that the stone
// recedes and the density's shade, in a fixed colour over it, runs from pale (the first ball's empty centre) to dark
// (the third ball's core).
import { INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { BALLS, MASS, G, R_BALL, RHO0, massOf, inertiaOf, pullOf, ballFace, stoneDefs, stone, rim, radialVeil, SHADE, MATTER, DEEPEST, STONE_INK } from './tut-null-lib.js';

const name = 'tut-null-hero';
const check = checker(name);

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const R = 42;                             // a ball's radius
const GAP = 20;                           // between two balls
const RAYS = [60, 90, 120];               // the pull's directions, degrees from the right, anticlockwise
const AT = [1.5, 2];                      // the pull's places, radii
const LONG = 0.4;                         // the arrow at 1.5 R, radii; the one at 2 R is (1.5 / 2)^2 of it
const ARROW = 0.5, HEAD = 2.8;            // as the pull of figs/tut-motion-earths.js
const KEY_W = 7, KEY_H = 66, KEY_GAP = 16;
const WASH = 0.65;                        // a white wash over the stone, under the shade, so that the empty centre is pale
const PRINTED = ['0.157', '0.132', '0.106'];
const NAMES = ['\\rho_0 + \\delta\\rho', '\\rho_0', '\\rho_0 - \\delta\\rho'];
const alphaOf = (rho) => (DEEPEST / 2) * rho;   // the shade of the density rho (units of rho0)

export default async function () {
	// ---- the physics
	const A = (Math.PI * G * R_BALL ** 2 * RHO0) / 3;
	check(A.toPrecision(2) === '5.5e-9', `A is ${A}`);
	check(MASS.toFixed(1) === '32.9', `the mass is ${MASS}`);
	const [plus, uniform, minus] = BALLS;
	check(near(plus.rho(0), 0) && plus.rho(1).toFixed(2) === '1.67' && near(minus.rho(0), 2) && near(minus.rho(1), 1 / 3, 1e-15), 'the densities');
	check(Math.round(plus.rho(1) * RHO0 / 100) * 100 === 13100 && minus.rho(0) * RHO0 === 15700 && Math.round(minus.rho(1) * RHO0 / 100) * 100 === 2600, 'the densities in kg m^-3');
	for (const b of BALLS) check(Math.abs(massOf(b.rho) / MASS - 1) < 1e-9, `the ball ${b.key} has another mass`);
	for (const r of AT) for (const b of BALLS) check(Math.abs(pullOf(b.rho, r * R_BALL) / pullOf(uniform.rho, r * R_BALL) - 1) < 1e-9, `the pulls differ at ${r} R`);
	const I = BALLS.map((b) => inertiaOf(b.rho));
	I.forEach((v, k) => check(v.toFixed(3) === PRINTED[k], `the moment of inertia ${k} is ${v}`));
	check(near(I[0] / I[1], 100 / 84, 1e-9) && near(I[2] / I[1], 68 / 84, 1e-9), 'the moments of inertia are not 100/84 and 68/84 of the uniform ball\'s');
	check(near(I[1], 0.4 * MASS * R_BALL ** 2, 1e-12), 'the uniform ball is not 0.4 M R^2');

	const S = new Sheet(name);
	const face = await ballFace();
	S.raw(stoneDefs(`${name}-face`, face, R), -1);
	const centres = [-1, 0, 1].map((k) => [ORIGIN + k * (2 * R + GAP), ORIGIN]);

	// ---- the balls: the stone, the density's shade over it, the edge
	centres.forEach(([x, y], k) => {
		const rho = BALLS[k].rho;
		S.raw(stone(`${name}-stone${k}`, `${name}-face`, x, y, R), 0);
		S.raw(`<path d="M${n2(x - R)},${n2(y)}a${R},${R} 0 1,0 ${2 * R},0a${R},${R} 0 1,0 ${-2 * R},0Z" fill="#ffffff" fill-opacity="${WASH}"/>`, 0.25);
		if (k === 1) S.raw(`<path d="M${n2(x - R)},${n2(y)}a${R},${R} 0 1,0 ${2 * R},0a${R},${R} 0 1,0 ${-2 * R},0Z" fill="${SHADE}" fill-opacity="${alphaOf(1).toFixed(4)}"/>`, 0.5);
		else S.raw(radialVeil(`${name}-shade${k}`, x, y, R, (u) => alphaOf(rho(u))), 0.5);
		S.raw(rim(x, y, R), 0.7);
		S.mark([[x, y]], R + 0.2, `ball ${k}`);
	});
	// the gradient's stops follow rho exactly at each stop (radialVeil, 64 stops); between stops, to a part in 10^4
	for (const k of [0, 2]) for (let j = 0; j < 64; j++) {
		const u = (j + 0.5) / 64, lin = (alphaOf(BALLS[k].rho(j / 64)) + alphaOf(BALLS[k].rho((j + 1) / 64))) / 2;
		check(Math.abs(lin - alphaOf(BALLS[k].rho(u))) < 1e-4, 'the shading departs from the density between stops');
	}

	// ---- the pull: the same arrows round each ball, from the place at 1.5 R or 2 R straight in, lengths as 1/r^2
	const lengths = AT.map((r) => LONG * R * pullOf(uniform.rho, r * R_BALL) / pullOf(uniform.rho, 1.5 * R_BALL));
	check(near(lengths[0] / lengths[1], 16 / 9, 1e-9), 'the arrows are not in the ratio 16/9');
	check(AT[0] * R - lengths[0] > R + 3 && AT[1] * R - lengths[1] > AT[0] * R + 6, 'an arrow reaches the next place or the ball');
	const tails = [];
	centres.forEach(([x, y], k) => {
		for (const deg of RAYS) {
			const u = [Math.cos((deg * Math.PI) / 180), -Math.sin((deg * Math.PI) / 180)];
			AT.forEach((r, j) => {
				const from = [x + u[0] * r * R, y + u[1] * r * R], to = [from[0] - u[0] * lengths[j], from[1] - u[1] * lengths[j]];
				S.arrow(from, to, { color: FAINT, width: ARROW, head: HEAD, layer: 2, what: `the pull at ${r} R, ${deg}, ball ${k}` });
				if (k === 0 && deg === 90) tails.push(from);
			});
		}
	});
	const reach = 2 * R * Math.cos((RAYS[0] * Math.PI) / 180);
	check(2 * reach < GAP + 2 * R - 8, 'the arrows of two balls run together');

	// ---- labels: the two places, beside the first ball's upright arrows; under each ball its density and its moment
	// of inertia, on two baselines
	const L = [];
	L.push(await S.clear('1.5R', tails[0][0] + 2.6, tails[0][1], 0, 0.5, [1, 0]));
	L.push(await S.clear('2R', tails[1][0] + 2.6, tails[1][1], 0, 0.5, [1, 0]));
	const y1 = ORIGIN + R + 12, y2 = y1 + 12.5;
	for (const [k, [x]] of centres.entries()) {
		L.push(await placed(NAMES[k], x, y1, 0.5, 1, MATTER));
		L.push(await placed(`I = ${PRINTED[k]}\\,\\mathrm{kg\\,m^2}`, x, y2, 0.5, 1, INK));
	}

	// ---- the key: the scale of the shading, 0 at its foot to 2 rho0 at its top, over the same stone, beside the third
	const kx = centres[2][0] + R + KEY_GAP, top = ORIGIN - KEY_H / 2;
	const keyShape = `M${n2(kx)},${n2(top)}h${KEY_W}v${KEY_H}h${-KEY_W}Z`;
	S.raw(stone(`${name}-key`, `${name}-face`, kx + KEY_W / 2, ORIGIN, R, keyShape), 0);
	S.raw(`<path d="${keyShape}" fill="#ffffff" fill-opacity="${WASH}"/>`, 0.25);
	const stops = Array.from({ length: 9 }, (_, j) => `<stop offset="${j / 8}" stop-color="${SHADE}" stop-opacity="${alphaOf(2 * (1 - j / 8)).toFixed(4)}"/>`);
	S.raw(`<linearGradient id="${name}-scale" gradientUnits="userSpaceOnUse" x1="0" y1="${n2(top)}" x2="0" y2="${n2(top + KEY_H)}">${stops.join('')}</linearGradient>` +
		`<path d="${keyShape}" fill="url(#${name}-scale)"/><path d="${keyShape}" fill="none" stroke="${STONE_INK}" stroke-width="${0.35}"/>`, 0.5);
	S.boxes.push({ box: { l: kx - 0.2, r: kx + KEY_W + 0.2, t: top - 0.2, b: top + KEY_H + 0.2 }, what: 'the key' });
	const yAt = (rho) => top + KEY_H * (1 - rho / 2);
	for (const [rho, src] of [[0, '0'], [1, '\\rho_0'], [2, '2\\rho_0']]) {
		S.path([[kx + KEY_W, yAt(rho)], [kx + KEY_W + 2.5, yAt(rho)]], { color: DIM, width: 0.4, layer: 1, cap: 'butt', what: `the key's tick ${src}` });
		L.push(await placed(src, kx + KEY_W + 2.5 + LABEL_GAP + 0.4, yAt(rho), 0, 0.5, MATTER));
	}
	L.push(await placed('\\rho', kx + KEY_W / 2, top - LABEL_GAP - 1, 0.5, 1, MATTER));

	S.checkAll(L);
	window[name + '-numbers'] = { A, MASS, I, lengths };
	return finish(S, L, [240, 340]);
}
