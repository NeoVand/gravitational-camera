// The tutorial, section 12.1 (tutorial/sky/stars.md), its first diagram: a slab of a star held up by its pressure. A
// quarter of a round star in section, the quarter about the upright radius (from 45 to 135 degrees), on the sawn stone
// of section 2.5's bodies; the inner ball out to the slab, of mass m(r), shaded in matter's colour and darkening toward
// the centre; the shell outside the slab left as bare stone and marked "pulls nothing" (section 1.3's shell theorem).
// On the upright radius, one thin slab between r and r + dr, a small curved box of area A; three arrows on it: the
// push from below, p(r) A, outward, and the push from above, p(r + dr) A, inward, both in matter's colour, the lower
// slightly longer, on one radius a little to the left; the pull of the mass inside, G m(r) rho A dr / r^2, toward the
// centre, in the field's colour, from the slab's middle on one radius a little to the right, its words beside the
// slab's right side. The radius r is measured off along the quarter's left edge, outside the stone.
// Marks on the stone keep fixed colours, which the site does not swap (figs/tut-flow-lib.js): the stone's ink,
// matter's light colour and the field's light colour; the radius outside it is in the page's colours.
// Departures from the diagram's comment: none.
// Exact: nothing; the figure is schematic, as its caption says. The inner ball's shade follows Eddington's density,
// theta^3 of the polytrope of index 3 (tut-stars-lib.js), over a floor that marks the ball: shade = 0.2 + (0.77 - 0.2)
// theta^3(xi_1 r/R), DEEPEST being section 2.5's darkest shade. Pictorial: the stone (sprites/hair/ball-face.png).
import { INK, DIM } from '../lib.js';
import { text, circle as circlePath } from '../stone.js';
import { Sheet, ORIGIN, placed, finish, checker, near, n2, LABEL_GAP, HAIR, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { ballFace, stoneDefs, stone } from './tut-null-lib.js';
import { RIM, STONE_FAINT } from './tut-flow-lib.js';
import { chapter, SHADE, STONE_INK, DEEPEST, FIELD_ON_STONE } from './tut-stars-lib.js';

const name = 'tut-stars-shell';
const check = checker(name);

// ---- the drawing (points); angles in degrees from the right, anticlockwise ------------------------------------------
const R = 180;                         // the star's radius
const SPAN = [45, 135];                // the quarter
const r = 0.55 * R, DR = 0.075 * R;    // the slab
const PHI = 12;                        // the slab's half-width, degrees
const ALPHA = 5.5;                     // the arrows' radii, degrees either side of the upright one
const PUSH_LOW = 28, PUSH_HIGH = 24;   // the pushes' lengths
const PULL = 26;                       // the pull's length
const TOUCH = 0.3;                     // from a push's tip to the face it presses on
const FLOOR = 0.2;                     // the inner ball's shade at its edge
const SLAB = 0.42;                     // the slab's shade
const FACE = 0.5;                      // the slab's outline
const STOPS = 64;
const DIM_OFF = 8;                     // the radius's dimension line, out from the quarter's left edge
const END = 2.2;                       // half its ends
const caption = 'Look first at the two pressure arrows on the slab: the push from below is slightly larger than the push from above, and the difference holds the slab against the pull of the mass inside it. The shell outside pulls nothing. Schematic.';

export default async function () {
	const { state, three } = await chapter(check);
	state(name, 'stars-shell', caption);
	check(PUSH_LOW > PUSH_HIGH && PUSH_LOW / PUSH_HIGH < 1.25, 'the push from below is not slightly longer');

	const S = new Sheet(name);
	const L = [];
	const C = [ORIGIN, ORIGIN + R / 2];
	const rad = (deg) => (deg * Math.PI) / 180;
	/** The page point at the distance rho from the centre, at the angle deg. */
	const P = (rho, deg) => [C[0] + rho * Math.cos(rad(deg)), C[1] - rho * Math.sin(rad(deg))];
	const pt = (p) => `${n2(p[0])},${n2(p[1])}`;
	/** Path data of the ring sector between radii a and b (a = 0: a sector) from angle d0 to d1. */
	const sector = (a, b, d0, d1) => {
		const outer = `M${pt(P(b, d0))}A${n2(b)},${n2(b)} 0 0,0 ${pt(P(b, d1))}`;
		return a === 0 ? `M${pt(C)}L${pt(P(b, d0))}A${n2(b)},${n2(b)} 0 0,0 ${pt(P(b, d1))}Z` : `${outer}L${pt(P(a, d1))}A${n2(a)},${n2(a)} 0 0,1 ${pt(P(a, d0))}Z`;
	};
	/** Points along the arc of radius rho from d0 to d1, no two more than a quarter of a point apart. */
	const arc = (rho, d0, d1) => { const n = Math.max(2, Math.ceil((rho * rad(Math.abs(d1 - d0))) / 0.25)); return Array.from({ length: n + 1 }, (_, i) => P(rho, d0 + ((d1 - d0) * i) / n)); };

	// ---- the stone, clipped to the quarter
	const face = await ballFace();
	S.raw(stoneDefs(`${name}-face`, face, R), -1);
	S.raw(stone(`${name}-stone`, `${name}-face`, C[0], C[1], R, sector(0, R, SPAN[0], SPAN[1])), 0);
	S.mark(arc(R, SPAN[0], SPAN[1]), RIM / 2, 'the star\'s surface');
	S.mark([P(R, SPAN[0]), C, P(R, SPAN[1])], RIM / 2, 'the quarter\'s edges');

	// ---- the inner ball's shade: Eddington's density over a floor, by a radial gradient of 64 stops
	const xi1 = three.xi1;
	const shade = (u) => FLOOR + (DEEPEST - FLOOR) * three.theta(xi1 * u) ** 3;          // u = distance / R
	{
		const id = `${name}-ball`;
		const stops = Array.from({ length: STOPS + 1 }, (_, k) => `<stop offset="${(k / STOPS).toFixed(4)}" stop-color="${SHADE}" stop-opacity="${shade(((k / STOPS) * r) / R).toFixed(4)}"/>`);
		S.raw(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n2(C[0])}" cy="${n2(C[1])}" r="${n2(r)}">${stops.join('')}</radialGradient>` +
			`<path d="${sector(0, r, SPAN[0], SPAN[1])}" fill="url(#${id})"/>`, 0.5);
		// between stops the straight interpolation follows the shade to a part in 10^3
		let worst = 0;
		for (let k = 0; k < STOPS; k++) {
			const a = ((k / STOPS) * r) / R, b = (((k + 1) / STOPS) * r) / R;
			worst = Math.max(worst, Math.abs((shade(a) + shade(b)) / 2 - shade((a + b) / 2)));
		}
		check(worst < 2e-3, `the shade departs from its law between stops by ${worst}`);
		check(near(shade(0), DEEPEST, 1e-12) && shade(r / R) - FLOOR < 0.01, 'the shade\'s ends');
	}
	// the inner ball's edge, a faint hairline either side of the slab
	for (const [d0, d1] of [[SPAN[0], 90 - PHI], [90 + PHI, SPAN[1]]]) S.path(arc(r, d0, d1), { color: STONE_FAINT, width: HAIR, layer: 0.7, cap: 'butt', what: 'the inner ball\'s edge' });
	// the quarter's outline
	S.raw(`<path d="${sector(0, R, SPAN[0], SPAN[1])}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}" stroke-linejoin="round"/>`, 0.8);

	// ---- the slab
	S.raw(`<path d="${sector(r, r + DR, 90 - PHI, 90 + PHI)}" fill="${SHADE}" fill-opacity="${SLAB}" stroke="${STONE_INK}" stroke-width="${FACE}" stroke-linejoin="round"/>`, 1);
	S.mark([...arc(r, 90 - PHI, 90 + PHI)], FACE / 2, 'the slab\'s inner face');
	S.mark([...arc(r + DR, 90 - PHI, 90 + PHI)], FACE / 2, 'the slab\'s outer face');
	S.mark([P(r, 90 - PHI), P(r + DR, 90 - PHI)], FACE / 2, 'the slab\'s right side');
	S.mark([P(r, 90 + PHI), P(r + DR, 90 + PHI)], FACE / 2, 'the slab\'s left side');

	// ---- the arrows: the pushes on the left radius, the pull on the right one
	const left = 90 + ALPHA, right = 90 - ALPHA;
	const low = S.arrow(P(r - PUSH_LOW - TOUCH, left), P(r - TOUCH, left), { color: SHADE, width: VEC, head: VEC_HEAD, layer: 2, what: 'the push from below' });
	const high = S.arrow(P(r + DR + PUSH_HIGH + TOUCH, left), P(r + DR + TOUCH, left), { color: SHADE, width: VEC, head: VEC_HEAD, layer: 2, what: 'the push from above' });
	const pull = S.arrow(P(r + DR / 2, right), P(r + DR / 2 - PULL, right), { color: FIELD_ON_STONE, width: VEC, head: VEC_HEAD, layer: 2, what: 'the pull' });
	check(near(low.L, PUSH_LOW, 1e-9) && near(high.L, PUSH_HIGH, 1e-9) && near(pull.L, PULL, 1e-9), 'the arrows\' lengths');
	check(r + DR + PUSH_HIGH + TOUCH < R - 8, 'the push from above starts outside the star');

	// ---- the labels on the stone, in its fixed colours
	const midLow = P(r - PUSH_LOW / 2, left), midHigh = P(r + DR + PUSH_HIGH / 2, left);
	L.push(await S.clear('p(r)\\,A', midLow[0] - LABEL_GAP - 1, midLow[1], 1, 0.5, [-1, 0], { color: SHADE }));
	L.push(await S.clear('p(r + \\mathrm{d}r)\\,A', midHigh[0] - LABEL_GAP - 1, midHigh[1], 1, 0.5, [-1, 0], { color: SHADE }));
	// the pull's words beside the slab's right side, at the arrow's tail (beside its body they would cross the inner
	// ball's edge)
	{
		const side = P(r + DR / 2, 90 - PHI);
		L.push(await S.clear('Gm(r)\\,\\rho A\\,\\mathrm{d}r/r^2', side[0] + LABEL_GAP + 1, side[1], 0, 0.5, [1, 0], { color: FIELD_ON_STONE }));
	}
	// the slab's own: its area over its outer face, right of the push that lands there, and its thickness at its left
	{
		L.push(await S.clear('A', P(r + DR, 90 - PHI / 2)[0], P(r + DR, 90)[1] - FACE / 2 - LABEL_GAP - 0.4, 0.5, 1, [0, -1], { color: STONE_INK }));
		const mid = P(r + DR / 2, 90 + PHI);
		L.push(await S.clear('\\mathrm{d}r', mid[0] - LABEL_GAP - 0.8, mid[1], 1, 0.5, [-1, 0], { color: STONE_INK }));
	}
	L.push(await S.clear('m(r)', C[0], C[1] - 0.3 * R, 0.5, 0.5, [0, -1], { color: STONE_INK }));
	{
		const at = P(0.79 * R, 64);
		L.push(await S.clear(text('pulls nothing'), at[0], at[1], 0.5, 0.5, [1, 0], { color: STONE_INK }));
	}

	// ---- the radius r, off the stone: a dimension line parallel to the quarter's left edge, outside it
	{
		const out = [Math.cos(rad(SPAN[1] + 90)), -Math.sin(rad(SPAN[1] + 90))];      // the edge's outward normal (page)
		const a = [C[0] + out[0] * DIM_OFF, C[1] + out[1] * DIM_OFF];
		const e = P(r, SPAN[1]);
		const b = [e[0] + out[0] * DIM_OFF, e[1] + out[1] * DIM_OFF];
		S.path([a, b], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the radius' });
		for (const q of [a, b]) S.path([[q[0] - out[0] * END, q[1] - out[1] * END], [q[0] + out[0] * END, q[1] + out[1] * END]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the radius\'s end' });
		const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
		L.push(await S.clear('r', m[0] + out[0] * (LABEL_GAP + 2), m[1] + out[1] * (LABEL_GAP + 2), 0.5, 0.5, out, { color: INK }));
	}

	S.checkAll(L);
	return finish(S, L, [220, 300]);
}
