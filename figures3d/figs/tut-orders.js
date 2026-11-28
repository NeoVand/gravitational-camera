// The tutorial, section 0.5 (tutorial/evening/what-the-outside-keeps.md), its diagram: first order and second order.
// A round body, cut away to show its inside, with a small mass beside it, drawn twice, one row above the other: on
// top the small mass m, below the small mass 2m, its centre at the same distance from the body's centre. In each row
// the arrow from the small mass toward the body is the pull on it, G M m / d^2, so the lower arrow is exactly twice
// as long as the upper; beside each small mass a bar, in the one accent colour, is the energy the small mass leaves
// in the body, which goes as the square of the kick each part gets, so as m^2: the lower bar is exactly four times as
// tall as the upper (and is cut by three thin gaps into four pieces, each the height of the upper bar). Each bar
// stands in its own row, on a hairline drawn from under its small mass, level with that mass's lowest point; each
// arrow is named "pull" and each bar "energy", the lower row's with their ratios to the upper (x2, x4).
// Exact: the ratios 2 and 4, asserted from the drawn lengths and heights; the same distance in both rows; each small
// mass a steel ball whose radius goes as the cube root of its mass (one density), so the lower one is 2^(1/3) times
// the upper (as the parts of figs/tut-motion-parts.js). Pictorial, and to be called so: the body, the cored ball of
// the paper's figure on gravitational hair (figs/hair.js; a picture from an image model, design/prompts/
// hair-sprites.json, cut out by design/hair_sprites.py), clipped here to its exact circle. Chosen for the drawing:
// the scale of the arrows and of the bars, the distance, the small masses' size against the body.
import { INK, DIM, ACCENT, PAGE, sprite } from '../lib.js';
import { picture, circle, outline, SPRITES } from '../stone.js';
import { STEEL } from './tut-five-lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, VEC, VEC_HEAD, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-orders';
const check = checker(name);

// ---- the physics (in units of the upper row: G M / d^2 = 1 for m = 1) ------------------------------------------
export const MASSES = [1, 2];
/** The pull on the small mass m at the distance d from the body's centre: first order in m. */
export const pull = (m) => m;
/** The energy it leaves in the body: each part's kick goes as m, the energy as the square of the kick. */
export const energy = (m) => m ** 2;

// ---- the drawing (figure points, y down) ------------------------------------------------------------------------
const A = 40;                            // the body's radius
const PITCH = 96;                        // from one row's centre to the next
const EDGE_TO_MASS = 68;                 // from the body's edge to the small mass's centre
const R1 = 5;                            // the radius of the small mass m
const TAIL = 1.35;                       // each pull arrow starts this far clear of its ball
const ARROW = 26;                        // the upper arrow's length: points per unit of pull
const TO_BAR = 30;                       // from the small mass's centre to the bar's middle
const BARW = 9;                          // a bar's width
const BAR = 12;                          // the upper bar's height: points per unit of energy
const CUT = 0.6;                         // the gaps that cut the lower bar into pieces of the upper bar's height
const FOOT = 3.5;                        // the line a bar stands on reaches this far past the bar's right side
const STONE_INK = '#3b3024';             // the body's edge, drawn on the stone: fixed, as in figs/tut-motion-earths.js

export default async function () {
	const sh = new Sheet(name);
	const art = await sprite(SPRITES + 'core.png');
	const BX = ORIGIN - (A + EDGE_TO_MASS + TO_BAR) / 2;              // the body's centre, x
	const rows = MASSES.map((m, k) => ({ m, y: ORIGIN + (k - 0.5) * PITCH, r: R1 * Math.cbrt(m / MASSES[0]) }));
	const xs = BX + A + EDGE_TO_MASS;                                    // both small masses, at the same distance
	const xb = xs + TO_BAR;
	const L = [];
	const drawn = [];

	for (const [k, row] of rows.entries()) {
		const { m, y, r } = row;
		// the body, cut away to show its inside
		sh.raw(picture(`${name}-body-${k}`, art, BX, y, A, circle(BX, y, A)) + outline(BX, y, A, 0.35, STONE_INK), 0);
		sh.mark([[BX, y]], A, `the body in row ${k}`);
		// the small mass, a steel ball
		sh.sphere([xs, y], r, STEEL, { spec: 0.6, shininess: 36, layer: 2 }, `the small mass in row ${k}`);
		// the pull on it, toward the body's centre
		const from = [xs - r - TAIL, y];
		const a = sh.arrow(from, [from[0] - ARROW * pull(m), y], { color: INK, width: VEC, head: VEC_HEAD, layer: 2, what: `the pull in row ${k}` });
		check(a.B[0] - (BX + A) > 6, `the pull in row ${k} reaches the body`);
		// the energy left in the body: a bar standing on the line of the small mass's lowest point, in its own row
		const h = BAR * energy(m), base = y + r;
		check(h <= 2 * A, `the bar in row ${k} stands taller than the body`);
		const box = { l: xb - BARW / 2, r: xb + BARW / 2, t: base - h, b: base };
		sh.fill(`M${n2(box.l)},${n2(box.t)}H${n2(box.r)}V${n2(box.b)}H${n2(box.l)}Z`, box, { color: ACCENT, layer: 1, what: `the bar in row ${k}` });
		// pieces of the upper bar's height, cut by thin gaps of the page's colour
		const pieces = energy(m) / energy(MASSES[0]);
		check(Number.isInteger(pieces), `the bar in row ${k} is not a whole number of the upper bar`);
		for (let i = 1; i < pieces; i++) {
			const yc = base - i * BAR * energy(MASSES[0]);
			sh.raw(`<path d="M${n2(box.l)},${n2(yc)}H${n2(box.r)}" stroke="${PAGE}" stroke-width="${CUT}"/>`, 1.5);
		}
		check(base - h > y - PITCH / 2 + 4 && base < y + PITCH / 2, `the bar in row ${k} leaves its row`);
		// the line it stands on, a hair from under the small mass to a little past the bar: the ball and its bar on one line
		sh.path([[xs, base], [box.r + FOOT, base]], { color: DIM, width: HAIR, layer: 0.5, cap: 'butt', what: `the foot of the bar in row ${k}` });
		drawn.push({ m, L: a.L, h, r, d: xs - BX, from });
		// the mass's name, above its ball
		L.push(await placed(m === 1 ? 'm' : `${m}m`, xs, y - r - LABEL_GAP - 0.4, 0.5, 1));
	}

	// ---- the ratios, from what is drawn
	const [up, down] = drawn;
	check(near(down.m / up.m, 2, 1e-15), 'the lower mass is not twice the upper');
	check(near(down.d, up.d, 1e-12), 'the two small masses are not at the same distance');
	check(near(down.L / up.L, 2, 1e-12), `the lower pull is ${down.L / up.L} times the upper, not 2`);
	check(near(down.h / up.h, 4, 1e-12), `the lower bar is ${down.h / up.h} times the upper, not 4`);
	check(near(down.r / up.r, Math.cbrt(2), 1e-12), 'the lower ball is not 2^(1/3) times the upper');

	// ---- each row's arrow and bar named, under the arrow and beside the bar; the lower row with its ratio to the upper
	for (const [k, row] of rows.entries()) {
		const d = drawn[k];
		const mid = d.from[0] - d.L / 2;
		L.push(await sh.clear('\\text{pull}' + (k ? '\\ {\\times}2' : ''), mid, row.y + LABEL_GAP + 0.6, 0.5, 0, [0, 1]));
		L.push(await placed('\\text{energy}' + (k ? '\\ {\\times}4' : ''), xb + BARW / 2 + LABEL_GAP + 1.2, row.y + d.r - d.h / 2, 0, 0.5));
	}

	sh.checkAll(L);
	window.tutOrders = { pulls: drawn.map((d) => d.L), bars: drawn.map((d) => d.h), radii: drawn.map((d) => d.r) };
	return finish(sh, L, [220, 320]);
}
