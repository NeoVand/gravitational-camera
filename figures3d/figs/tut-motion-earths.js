// The tutorial, chapter 1.6 (tutorial/newton/motion.md), its third diagram: two Earths that pull alike outside and
// turn differently. Left, the Earth of two layers, cut open: a core of radius 3480 km and density 12,500 kg m^-3
// inside a mantle of 4150 kg m^-3 out to 6371 km; right, the uniform Earth of 5513 kg m^-3, cut open the same way.
// Around each, the same ring of arrows: the pull outside, which the two share. Exact: the two sections to scale (the
// core's circle has radius 3480/6371 of the outer one, asserted in points); the densities, solved here from the
// mean density and the moment-of-inertia factor 0.3307 as the chapter does (12,505 and 4152, printed as the paper's
// 12,500 and 4150), and the two moment-of-inertia factors, 0.3307 and 0.4, recomputed from them; the two masses,
// equal to a part in 10^9, so that the pull GM/r^2 outside is the same at every distance (asserted at five); the
// arrows, one list drawn round both bodies, each pointing at the centre. Pictorial, and to be called so: the stone
// and the metal, pictures from an image model (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py,
// as in the paper's figure on gravitational hair, figs/hair.js), clipped here to the exact circles; the paler stone
// of the mantle and the darker stone of the uniform Earth stand for their densities in order only. Schematic: the
// arrows' length.
import { INK, DIM, FAINT, sprite, tex } from '../lib.js';
import { picture, circle, outline, MARGIN } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, near, boxOf, HAIR } from './tut-pot-lib.js';

const name = 'tut-motion-earths';
const check = checker(name);

// ---- the physics ----------------------------------------------------------------------------------------------
export const RADIUS = 6371;              // km
export const CORE = 3480;                // km
export const MEAN = 5513;                // kg m^-3
export const FACTOR = 0.3307;            // I / M R^2
const G = 6.674e-11;

/** The two densities: rho_c q^3 + rho_m (1 - q^3) = mean, rho_c q^5 + rho_m (1 - q^5) = (FACTOR / 0.4) mean. */
export function densities() {
	const q = CORE / RADIUS, a = q ** 3, b = q ** 5;
	const r1 = MEAN, r2 = (FACTOR / 0.4) * MEAN;
	const det = a * (1 - b) - b * (1 - a);
	const core = (r1 * (1 - b) - r2 * (1 - a)) / det, mantle = (a * r2 - b * r1) / det;
	return { q, core, mantle };
}

/** The mass inside the radius r (km) of a body of layers [{ out: km, rho }], kg. */
const massWithin = (layers, r) => {
	let m = 0, inner = 0;
	for (const { out, rho } of layers) {
		const o = Math.min(out, r);
		if (o > inner) m += (4 / 3) * Math.PI * rho * ((o * 1e3) ** 3 - (inner * 1e3) ** 3);
		inner = out;
	}
	return m;
};
/** The pull at the distance r (km) from the centre, m s^-2. */
const pull = (layers, r) => (G * massWithin(layers, r)) / (r * 1e3) ** 2;

// ---- the drawing (figure points, y down) ----------------------------------------------------------------------
const A = 46;                            // points per Earth radius
const GAP = 26;                          // between the two rings of arrows
const FIELD = [1.17, 1.5];               // the arrows' heads and tails, in Earth radii
const ARROWS = 24;
const ARROW = 0.5, HEAD = 2.8;           // as the field's arrows of figs/hair.js
const STONE_INK = '#3b3024';             // the sections' edges, drawn on the stone: fixed, so the site does not swap it
const SPRITES = '/figures3d/sprites/hair/';
const SIZE = 8.5;

export default async function () {
	const sh = new Sheet(name);
	const { q, core, mantle } = densities();
	check(Math.round(core / 100) * 100 === 12500 && Math.round(mantle / 10) * 10 === 4150, 'the densities do not round to 12,500 and 4150');
	check(near(core, 12505, 1) && near(mantle, 4152, 1), 'the densities are not the chapter\'s 12,505 and 4152');
	const twoLayer = [{ out: CORE, rho: core }, { out: RADIUS, rho: mantle }];
	const uniform = [{ out: RADIUS, rho: MEAN }];
	const M = massWithin(uniform, RADIUS);
	check(Math.abs(massWithin(twoLayer, RADIUS) / M - 1) < 1e-9, 'the two Earths differ in mass');
	check(near(pull(uniform, RADIUS), 9.82, 0.01), 'the pull at the surface is not 9.82 m s^-2');
	// the two moments of inertia: the factor 0.3307 and 0.4
	const second = (layers) => {
		let s = 0, inner = 0;
		for (const { out, rho } of layers) { s += (4 / 5) * Math.PI * rho * ((out * 1e3) ** 5 - (inner * 1e3) ** 5); inner = out; }
		return s;
	};
	check(near(((2 / 3) * second(twoLayer)) / (M * (RADIUS * 1e3) ** 2), FACTOR, 1e-12), 'the two-layer Earth\'s factor is not 0.3307');
	check(near(((2 / 3) * second(uniform)) / (M * (RADIUS * 1e3) ** 2), 0.4, 1e-12), 'the uniform Earth\'s factor is not 0.4');

	const art = Object.fromEntries(await Promise.all(['core-face', 'core-metal', 'ball-face'].map(async (n) => [n, await sprite(SPRITES + n + '.png')])));
	const pixels = (art['ball-face'].w - 2 * MARGIN) / 2;                 // the radius of a sprite's exact circle
	const span = 2 * FIELD[1] * A;
	const centres = [[ORIGIN - (span + GAP) / 2, ORIGIN], [ORIGIN + (span + GAP) / 2, ORIGIN]];

	// ---- the sections, to scale: the two-layer Earth (the mantle's stone, and the metal of the core clipped to its
	// exact circle), and the uniform one
	const [[x1, y1], [x2, y2]] = centres;
	const metalReach = art['core-metal'].w / (2 * pixels) * (q / 0.4);   // the patch, grown to cover the larger core
	check(metalReach * A > q * A + 2, 'the metal does not cover the core');
	sh.raw(picture('tut-motion-mantle', art['core-face'], x1, y1, A, circle(x1, y1, A)) +
		picture('tut-motion-core', art['core-metal'], x1, y1, A, circle(x1, y1, q * A), metalReach), 0);
	sh.raw(`<path d="${circle(x1, y1, q * A)}" fill="none" stroke="${STONE_INK}" stroke-width="${HAIR}"/>`, 1);
	sh.raw(picture('tut-motion-uniform', art['ball-face'], x2, y2, A, circle(x2, y2, A)), 0);
	for (const [x, y] of centres) {
		sh.raw(outline(x, y, A, 0.35, STONE_INK), 1);
		sh.boxes.push({ box: { l: x - A, r: x + A, t: y - A, b: y + A }, what: 'an Earth' });
	}
	check(near((q * A) / A, CORE / RADIUS, 1e-15), 'the core is not to scale');

	// ---- the pull outside: one list of arrows, drawn round both, each from its tail at FIELD[1] radii straight in
	// toward the centre; the pull is the same for both at every distance outside, so one list serves both
	const g = (r) => pull(uniform, r * RADIUS);
	for (const r of [1, FIELD[0], FIELD[1], 2, 5]) check(near(pull(twoLayer, r * RADIUS) / g(r), 1, 1e-9), `the pulls differ at ${r} radii`);
	const len = (FIELD[1] - FIELD[0]) * A;
	const list = Array.from({ length: ARROWS }, (_, m) => (2 * Math.PI * (m + 0.5)) / ARROWS);
	for (const [k, [x, y]] of centres.entries()) {
		for (const t of list) {
			const u = [Math.cos(t), -Math.sin(t)];
			const from = [x + u[0] * FIELD[1] * A, y + u[1] * FIELD[1] * A];
			sh.arrow(from, [from[0] - u[0] * len, from[1] - u[1] * len], { color: FAINT, width: ARROW, head: HEAD, layer: 2, what: `the pull round Earth ${k}` });
		}
	}

	// ---- the densities, beneath each Earth: a small table centred under it, each line a word and a number with its
	// unit, the numbers set flush right so that their digits line up, all lines on baselines LEAD apart
	const unit = '\\,\\mathrm{kg\\,m^{-3}}';
	const words = [[['core', '12{,}500'], ['mantle', '4150']], [['uniform', '5513']]];
	const first = ORIGIN + FIELD[1] * A + 12;                            // the first baseline
	const LEAD = 11.5, SPACE = 4.4;                                       // between baselines; between word and number
	const L = [];
	const set = async (src, x, y, anchor, color) => {
		const svg = await tex(src, [x, y], SIZE, anchor, color);
		return { src, svg, box: boxOf(svg) };
	};
	for (const [k, rows] of words.entries()) {
		// set the table with its numbers' right edge at 0, measure its ink, and set it again centred under the Earth
		const table = async (right) => {
			const out = [];
			for (const [i, [w, v]] of rows.entries()) {
				const num = await set(`${v}${unit}`, right, first + i * LEAD, 'rB', INK);
				out.push(num, await set(`\\text{${w}}`, num.box.l - SPACE, first + i * LEAD, 'rB', DIM));
			}
			return out;
		};
		const span = (t) => ({ l: Math.min(...t.map((l) => l.box.l)), r: Math.max(...t.map((l) => l.box.r)) });
		const s0 = span(await table(0));
		const placedTable = await table(centres[k][0] - (s0.l + s0.r) / 2);
		L.push(...placedTable);
		const ink = span(placedTable);
		check(near((ink.l + ink.r) / 2, centres[k][0], 0.05), `the table under Earth ${k} is not centred`);
	}
	check(L.every((l) => l.box.t > ORIGIN + FIELD[1] * A + 2.2), 'a label reaches the arrows');

	sh.checkAll(L);
	window.tutMotionEarths = { q, core, mantle, M, g: g(1) };
	return finish(sh, L, [240, 340]);
}
