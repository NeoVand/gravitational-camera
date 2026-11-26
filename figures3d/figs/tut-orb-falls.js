// The tutorial, section 1.8 (tutorial/newton/orbits-and-kicks.md), its first diagram: a circular orbit as a sequence
// of falls that miss. The space station's orbit round the Earth, seen face on, with the Earth cut through the plane of
// the orbit. From a point on the orbit the station moves one second along its velocity, on the straight line
// tangent to the circle (dashed); in that second it falls toward the centre, and the fall brings it back onto the
// circle (the orange arrow, along the line to the centre). Three such steps in a row. Exact: the Earth's radius,
// 6371 km, and the orbit's, 6791 km, to one scale (asserted in points); the station's speed and the fall in one
// second, computed from the chapter's numbers: v = sqrt(GM/r) = 7.66 km/s, so a step of 7.66 km, and the fall
// sqrt(r^2 + d^2) - r = 4.32 m, equal to the free fall (1/2)(GM/r^2)(1 s)^2 to a part in 10^5; each drawn step is
// tangent to the circle at its start, and each drawn fall runs from the step's end along the line to the centre and
// ends on the circle. Exaggerated: the steps, drawn STRETCH times longer than one second's travel, which makes each
// drawn fall (the same construction, exact for the drawn step) about 330,000 times deeper than 4.3 m. Pictorial: the
// Earth's stone, a picture from an image model (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py,
// as in the paper's figure on gravitational hair, figs/hair.js), clipped here to the exact circle. Only the top of the
// Earth and of the orbit is drawn, where the steps are: both fade out downward, over a band below the lowest station,
// so that the room goes to the steps and their numbers.
import { INK, DIM, ACCENT, sprite } from '../lib.js';
import { picture, circle, outline, STEEL } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, near, n2, VEC } from './tut-pot-lib.js';
import { dashed, STONE_INK } from './tut-orb-lib.js';

const name = 'tut-orb-falls';
const check = checker(name);

// ---- the physics: the chapter's numbers ----------------------------------------------------------------------
export const GM = 3.986e14;              // m^3 s^-2, the Earth
export const EARTH = 6371e3;             // m, its radius
export const ORBIT = 6791e3;             // m, the station's distance from the centre
export const STEP_TIME = 1;              // s
export const STRETCH = 600;              // the drawn step against the true one

// ---- the drawing (figure points, y down) ----------------------------------------------------------------------
const R_ORBIT = 175;                     // points: the orbit's radius
const FADE_TOP = 0.55, FADE_BOTTOM = 0.41;  // the Earth and the orbit fade out between these heights above the centre,
                                         // in units of the orbit's radius
const STEPS = 3;
const BEAD = 2.6;                        // the station, a small steel bead, radius in points
const FALL_GAP = 0.9;                    // air between a fall's head and the bead it reaches
const FALL_HEAD = 3.4;
const ORBIT_LINE = 0.45;                 // the orbit's line, quieter than the steps, which run along it where they
                                         // leave it as tangents
const SPRITES = '/figures3d/sprites/hair/';

export default async function () {
	// ---- the numbers the chapter prints
	const v = Math.sqrt(GM / ORBIT);
	const d = v * STEP_TIME;
	const fall = Math.sqrt(ORBIT ** 2 + d ** 2) - ORBIT;
	const free = 0.5 * (GM / ORBIT ** 2) * STEP_TIME ** 2;
	check((v / 1e3).toFixed(2) === '7.66', `the speed is ${v} m/s, not 7.66 km/s`);
	check(fall.toFixed(1) === '4.3', `the fall in one second is ${fall} m, not 4.3 m`);
	check(Math.abs(fall / free - 1) < 1e-5, `the fall back onto the circle, ${fall} m, is not the free fall, ${free} m`);
	check(near(GM / ORBIT ** 2, 8.64, 0.01), 'the pull at the station is not 8.6 m/s^2');

	// ---- the drawing's scale, the step and the fall as drawn
	const k = R_ORBIT / ORBIT;                                       // points per metre
	const R_EARTH = EARTH * k;
	const D = (STRETCH * d) / ORBIT;                                 // the drawn step, in units of the orbit's radius
	const alpha = Math.atan(D);                                      // the angle each step carries the station round
	const fallDrawn = R_ORBIT * (Math.sqrt(1 + D * D) - 1);          // points
	const deeper = fallDrawn / k / fall;                             // how much deeper the drawn fall is than the true one
	check(near(R_EARTH / R_ORBIT, 6371 / 6791, 1e-12), 'the Earth and the orbit are not to one scale');
	check(deeper > 3.2e5 && deeper < 3.4e5, `the drawn fall is ${deeper} times the true one, not about 330,000`);

	const S = new Sheet(name);
	const C = [ORIGIN, ORIGIN + 40];                                 // the Earth's centre on the provisional page
	const at = (r, th) => [C[0] + r * Math.cos(th), C[1] - r * Math.sin(th)];

	// ---- the fade: the Earth and the orbit are drawn down to FADE_BOTTOM r above the centre, fading out below FADE_TOP r
	const yTop = C[1] - FADE_TOP * R_ORBIT, yBot = C[1] - FADE_BOTTOM * R_ORBIT;
	const fade = `<linearGradient id="tut-orb-fade-g" gradientUnits="userSpaceOnUse" x1="0" y1="${n2(yTop)}" x2="0" y2="${n2(yBot)}">` +
		`<stop offset="0" stop-color="#fff"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
		`<mask id="tut-orb-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="700" height="700">` +
		`<rect x="0" y="0" width="700" height="${n2(yBot)}" fill="url(#tut-orb-fade-g)"/></mask>`;
	const faded = (svg) => `<g mask="url(#tut-orb-fade)">${svg}</g>`;

	// ---- the Earth, cut through the plane of the orbit: the stone clipped to its exact circle, and its rim
	const face = await sprite(SPRITES + 'ball-face.png');
	S.raw(faded(picture('tut-orb-earth', face, C[0], C[1], R_EARTH, circle(C[0], C[1], R_EARTH))), 0);
	S.raw(faded(outline(C[0], C[1], R_EARTH, 0.35, STONE_INK)), 1);
	S.boxes.push({ box: { l: C[0] - R_EARTH, r: C[0] + R_EARTH, t: C[1] - R_EARTH, b: yBot }, what: 'the Earth' });

	// ---- the orbit, its upper part, sampled every quarter of a point
	const th1 = Math.asin(FADE_BOTTOM), N = Math.ceil(((Math.PI - 2 * th1) * R_ORBIT) / 0.25);
	const ring = Array.from({ length: N + 1 }, (_, i) => at(R_ORBIT, th1 + ((Math.PI - 2 * th1) * i) / N));
	S.raw(faded(`<path d="M${ring.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${DIM}" stroke-width="${ORBIT_LINE}"/>`), 1);
	S.mark(ring, ORBIT_LINE / 2, 'the orbit');

	// ---- the steps, clockwise over the top, symmetric about the vertical
	const th0 = Math.PI / 2 + (STEPS / 2) * alpha;
	const places = Array.from({ length: STEPS + 1 }, (_, j) => th0 - j * alpha);
	const steps = [];
	for (let j = 0; j < STEPS; j++) {
		const th = places[j];
		const P = at(R_ORBIT, th);
		const t = [Math.sin(th), Math.cos(th)];                      // the velocity's direction, clockwise, figure axes
		const Q = [P[0] + t[0] * D * R_ORBIT, P[1] + t[1] * D * R_ORBIT];
		// the step is tangent to the circle at P, and D r long
		const radial = [(P[0] - C[0]) / R_ORBIT, (P[1] - C[1]) / R_ORBIT];
		check(near(radial[0] * t[0] + radial[1] * t[1], 0, 1e-12), `step ${j} is not tangent to the orbit`);
		// the step, dashed, from the bead at its start (no dash under the bead) to its end
		const clash = (q, gap) => Math.hypot(q[0] - P[0], q[1] - P[1]) < BEAD + gap;
		const dashes = dashed(S, P, Q, { clash, what: `step ${j}` });
		check(near(dashes[dashes.length - 1][1], D * R_ORBIT, 1e-9), `step ${j}'s last dash does not reach its end`);
		check(dashes[0][0] < BEAD + 3, `step ${j} does not start at its bead`);
		// the fall: from Q along the line to the centre, back onto the circle, where the next step begins
		const toC = [C[0] - Q[0], C[1] - Q[1]], lq = Math.hypot(...toC), u = [toC[0] / lq, toC[1] / lq];
		const end = [Q[0] + u[0] * (lq - R_ORBIT), Q[1] + u[1] * (lq - R_ORBIT)];
		const next = at(R_ORBIT, places[j + 1]);
		check(near(end[0], next[0], 1e-9) && near(end[1], next[1], 1e-9), `fall ${j} does not end where step ${j + 1} begins`);
		check(near(lq - R_ORBIT, fallDrawn, 1e-9), `fall ${j} is not the drawn step's fall`);
		const tip = [end[0] - u[0] * (BEAD + FALL_GAP), end[1] - u[1] * (BEAD + FALL_GAP)];
		const arrow = S.arrow(Q, tip, { color: ACCENT, width: VEC, head: FALL_HEAD, layer: 3, what: `fall ${j}` });
		steps.push({ P, Q, end, arrow, t, u });
	}
	// the station at the start of each step and at the end, every one above the fade
	check(Math.min(...places.map((th) => Math.sin(th))) * R_ORBIT - BEAD > FADE_TOP * R_ORBIT + 8, 'a station sits in the fade');
	places.forEach((th, j) => S.sphere(at(R_ORBIT, th), BEAD, STEEL, { spec: 0.6, shininess: 36, layer: 4 }, `the station ${j}`));

	// ---- the numbers: the middle step's length above it, the middle fall's beside it, on the side it moves toward
	const mid = steps[Math.floor(STEPS / 2)];
	const M = [(mid.P[0] + mid.Q[0]) / 2, (mid.P[1] + mid.Q[1]) / 2];
	const out = [mid.t[1], -mid.t[0]];                               // away from the centre, at right angles to the step
	check(out[1] < 0, 'the step\'s label would not stand above it');
	const L = [];
	L.push(await S.clear('7.66\\,\\mathrm{km}', M[0], M[1], 0.5, 1, out, { color: INK }));
	const F = [(mid.Q[0] + mid.end[0]) / 2, (mid.Q[1] + mid.end[1]) / 2];
	L.push(await S.clear('4.3\\,\\mathrm{m}', F[0], F[1], 0, 0.5, [1, 0], { color: ACCENT }));

	S.checkAll(L);
	window.tutOrbFalls = { v, d, fall, free, D, alpha: (alpha * 180) / Math.PI, fallDrawn, deeper, R_EARTH };
	return finish(S, L, [240, 340], fade);
}
