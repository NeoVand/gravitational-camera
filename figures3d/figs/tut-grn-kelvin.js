// The tutorial, chapter 2.4 (tutorial/outside/greens-functions.md), its fourth diagram: Kelvin's image and the skin of
// balayage. A ball of radius R cut through its centre, with a nugget at s = R/2 on the vertical axis and the nugget's
// Kelvin image s* = R^2 s / s^2 at 2R above the centre, on the same ray (dotted), marked with its weight R/s = 2; the
// skin of balayage drawn as a band just inside the sphere, shaded by the ball's Poisson kernel
// P = (R^2 - s^2) / 4 pi R |x - s|^3 in steps that double (as panel (c) of the paper's fig:same-outside, from
// paper/figures/make_figures.py, same_outside: a band a tenth of R wide, each step's opacity 0.12 + 0.13 k), 6 over the
// nugget and 0.22 opposite, in units of m / 4 pi R^2, with a key of the six shades beside the ball, the edges
// between them named; a point x of the sphere joined to s and to s*, the two lengths named, the second twice the
// first.
// Exact: s at R/2 and s* at 2R (asserted); every point of the sphere is twice as far from s* as from s (asserted at
// 360 points, and for the drawn x); the band's steps, whose edges are where P = 0.125, 0.25, 0.5, 1, 2 and 4 m / 4 pi R^2
// (asserted there), and the two printed values 6 and 0.22 (asserted from P); the line from x to s* stays outside the
// ball (asserted), as it does for every x within 60 degrees of the pole. Chosen: the place of x (50 degrees from the
// pole), the band's width and the nugget's size (0.15 R, as in the paper's figure).
// Pictorial: the ball's sawn face, a picture from an image model (design/prompts/hair-sprites.json, cut out by
// design/hair_sprites.py, as in the paper's figure on gravitational hair, figs/hair.js), clipped to the exact circle
// and, under the key, to its column. Marks on it are drawn in fixed colours (the site does not swap them): the edge
// and the lines in a dark ink, the skin in matter's colour (app.css, --q-matter, its light one) and the nugget lit in
// matter's two colours; the labels off the stone take matter's colour of each theme.
import { INK, DIM, FAINT, sprite } from '../lib.js';
import { MARGIN, circle as circlePath } from '../stone.js';
import { Sheet, ORIGIN, placed, finish, checker, near, HAIR, LABEL_GAP, DOT, n2 } from './tut-pot-lib.js';
import { STONE_INK } from './tut-orb-lib.js';
import { ORIGIN_DOT } from './tut-vec-lib.js';

const name = 'tut-grn-kelvin';
const check = checker(name);

// ---- the mathematics, lengths in units of R ---------------------------------------------------------------------
export const T = 0.5;                                    // s / R
/** The surface density of the skin at the angle g from the pole over the nugget, in units of m / 4 pi R^2. */
export const skin = (g) => (1 - T * T) / (1 + T * T - 2 * T * Math.cos(g)) ** 1.5;
/** The angle from the pole at which the skin has the density `level` (it falls from the pole to the far side). */
export const angleAt = (level) => {
	const d = ((1 - T * T) / level) ** (1 / 3);
	return Math.acos(Math.min(1, Math.max(-1, (1 + T * T - d * d) / (2 * T))));
};
export const LEVELS = [0.125, 0.25, 0.5, 1, 2, 4];       // the steps' edges, m / 4 pi R^2

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const R = 105;                       // the ball's radius
const BAND = 0.1;                    // the skin's band, in R
const NUGGET = 0.15;                 // the nugget's radius, in R
const X_AT = 50;                     // x, degrees from the pole, toward the right
const IMAGE_R = 2.1;                 // the image's ring
const RIM = 0.35;                    // the ball's edge (as figs/hair.js)
const SEG = 0.45;                    // the two lines from x
// matter's colour (app.css, --q-matter), light and dark; on the stone, its light one, fixed
const MATTER = 'light-dark(#533f03, #f1dc86)';
const SKIN = '#533f03';
const GOLD_LIGHT = '#f1dc86';         // matter's dark-theme colour: the nugget's highlight
const STEP = 0.25;
const KEY_W = 7, KEY_H = 10;          // the key: a column of the six shades, each cell KEY_W by KEY_H points
const KEY_GAP = 16;                  // from the sphere to the key

export default async function () {
	// ---- the numbers
	check(near(skin(0), 6, 1e-12) && skin(Math.PI).toFixed(2) === '0.22', `the skin is ${skin(0)} and ${skin(Math.PI)}`);
	check(near(skin(0), (1 + T) / (1 - T) ** 2, 1e-12), 'the skin over the nugget is not (1 + t)/(1 - t)^2');
	for (const v of LEVELS) if (v > skin(Math.PI) && v < skin(0)) check(near(skin(angleAt(v)), v, 1e-9), `the edge at ${v} is misplaced`);
	check(LEVELS[0] < skin(Math.PI) && skin(0) < 2 * LEVELS[LEVELS.length - 1], 'the skin runs past the steps');
	const sStar = 1 / T;                                   // R^2 / s, in R
	check(near(sStar, 2, 1e-15) && near(1 / T, 2, 1e-15), 'the image is not at 2R with the weight 2');
	for (let k = 0; k < 360; k++) {
		const g = (k * Math.PI) / 180, x = [Math.sin(g), Math.cos(g)];
		const a = Math.hypot(x[0], x[1] - T), b = Math.hypot(x[0], x[1] - sStar);
		check(near(b, 2 * a, 1e-12), `the sphere at ${k} degrees is not twice as far from s* as from s`);
	}

	const S = new Sheet(name);
	const C = [ORIGIN, ORIGIN];
	/** The point r (in R) from the centre at the angle g (degrees) from the pole, clockwise. */
	const p = (g, r) => [C[0] + R * r * Math.sin((g * Math.PI) / 180), C[1] - R * r * Math.cos((g * Math.PI) / 180)];
	const d = (pts, close = true) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + (close ? 'Z' : '');
	const arcPts = (g0, g1, r) => {
		const n = Math.max(2, Math.ceil(((Math.abs(g1 - g0) * Math.PI) / 180) * R * r / STEP));
		return Array.from({ length: n + 1 }, (_, i) => p(g0 + ((g1 - g0) * i) / n, r));
	};
	const S0 = p(0, T), SS = p(0, sStar), X = p(X_AT, 1);

	// ---- the stone, the skin over it, its edge
	const face = await sprite('/figures3d/sprites/hair/ball-face.png');
	// the picture once, shown through two clips: the ball's circle here, the key's column below
	const half = R * (face.w / (face.w - 2 * MARGIN));
	S.raw(`<defs><image id="${name}-stone" class="art" href="${face.href}" x="${n2(C[0] - half)}" y="${n2(C[1] - half)}" width="${n2(2 * half)}" height="${n2(2 * half)}" preserveAspectRatio="none"/></defs>`, 0);
	const stone = (id, shape, dx = 0) => `<clipPath id="${id}"><path d="${shape}"/></clipPath><g clip-path="url(#${id})"><use href="#${name}-stone" x="${n2(dx)}" y="0"/></g>`;
	S.raw(stone(`${name}-ball`, circlePath(C[0], C[1], R)), 0.5);
	// the skin: nested regions, each denser than the last edge, so that the k-th band shows at 0.12 + 0.13 k
	let shown = 0;
	LEVELS.forEach((v, k) => {
		const want = 0.12 + 0.13 * k, alpha = 1 - (1 - want) / (1 - shown);
		shown = want;
		const g = (angleAt(v) * 180) / Math.PI;
		const shape = g >= 180 - 1e-9
			? d(arcPts(0, 360, 1)) + d(arcPts(0, 360, 1 - BAND))
			: d([...arcPts(-g, g, 1), ...arcPts(g, -g, 1 - BAND)]);
		S.raw(`<path d="${shape}" fill="${SKIN}" fill-opacity="${alpha.toFixed(4)}" fill-rule="evenodd"/>`, 0.6);
	});
	check(near(shown, 0.12 + 0.13 * (LEVELS.length - 1), 1e-12), 'the steps do not reach their last shade');
	S.mark(arcPts(0, 360, 1 - BAND), 0, 'the skin\'s inner edge');
	S.raw(`<path d="${circlePath(C[0], C[1], R)}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>`, 0.7);
	S.mark(arcPts(0, 360, 1), RIM / 2, 'the sphere');

	// ---- the centre, the radius R, the axis through s to s* (dotted)
	S.raw(`<circle cx="${C[0]}" cy="${C[1]}" r="${ORIGIN_DOT}" fill="${STONE_INK}"/>`, 0.8);
	S.mark([C], ORIGIN_DOT, 'the centre');
	const left = p(-90, 1);
	S.raw(`<path d="M${n2(C[0])},${n2(C[1])}L${n2(left[0] + RIM / 2)},${n2(left[1])}" stroke="${STONE_INK}" stroke-width="${HAIR}" fill="none"/>`, 0.8);
	S.mark([C, left], HAIR / 2, 'the radius');
	const dotted = (a, b, color, layer, what, c0 = 0, c1 = 0) => {
		const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
		const s0 = c0 + DOT / 2, s1 = L - c1 - DOT / 2, n = Math.max(1, Math.round((s1 - s0) / 1.6)), st = (s1 - s0) / n;
		const pts = Array.from({ length: n + 1 }, (_, i) => [a[0] + u[0] * (s0 + i * st), a[1] + u[1] * (s0 + i * st)]);
		S.raw(`<path d="${pts.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${color}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, layer);
		S.mark([pts[0], pts[pts.length - 1]], DOT / 2, what);
	};
	// inside, from the centre to the nugget and from the nugget to the sphere; outside, from the sphere to the image
	dotted(C, S0, STONE_INK, 0.8, 'the axis to the nugget', ORIGIN_DOT + 1, NUGGET * R + 1);
	dotted(S0, p(0, 1), STONE_INK, 0.8, 'the axis to the sphere', NUGGET * R + 1, RIM / 2 + 1);
	dotted(p(0, 1), SS, DIM, 0.8, 'the axis to the image', RIM / 2 + 1, IMAGE_R + 1);

	// ---- the nugget: a lit ball of matter's two colours, its light one where the key light falls (the highlight placed
	// as lib.js places a sphere's), its dark one over the rest, darker toward the rim
	const key = [-0.55, 0.72, 0.62], kl = Math.hypot(...key), hl = [key[0] / kl, key[1] / kl, key[2] / kl + 1], hn = Math.hypot(...hl);
	const fx = 0.5 + 0.5 * (hl[0] / hn) * 0.9, fy = 0.5 - 0.5 * (hl[1] / hn) * 0.9;
	const mix = (a, b, t) => '#' + [0, 2, 4].map((i) => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - t) + parseInt(b.slice(1 + i, 3 + i), 16) * t).toString(16).padStart(2, '0')).join('');
	const stops = [[0, GOLD_LIGHT], [0.22, mix(GOLD_LIGHT, SKIN, 0.55)], [0.5, SKIN], [0.85, mix(SKIN, '#000000', 0.3)], [1, mix(SKIN, '#000000', 0.45)]];
	S.raw(`<radialGradient id="${name}-gold" cx="0.5" cy="0.5" r="0.5" fx="${fx.toFixed(3)}" fy="${fy.toFixed(3)}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>` +
		`<circle cx="${n2(S0[0])}" cy="${n2(S0[1])}" r="${n2(NUGGET * R)}" fill="url(#${name}-gold)"/>`, 1);
	S.mark([S0], NUGGET * R, 'the nugget');
	// ---- the image: a ring
	S.raw(`<circle cx="${n2(SS[0])}" cy="${n2(SS[1])}" r="${IMAGE_R}" fill="none" stroke="${INK}" stroke-width="${HAIR}"/>`, 1);
	S.mark([SS], IMAGE_R + HAIR / 2, 'the image');

	// ---- x, and its lines to s and to s*
	const toS = Math.hypot(X[0] - S0[0], X[1] - S0[1]), toImage = Math.hypot(X[0] - SS[0], X[1] - SS[1]);
	check(near(toImage, 2 * toS, 1e-9), 'x is not twice as far from s* as from s');
	for (let f = 0.02; f < 1; f += 0.01) {
		const q = [X[0] + (SS[0] - X[0]) * f, X[1] + (SS[1] - X[1]) * f];
		check(Math.hypot(q[0] - C[0], q[1] - C[1]) > R, 'the line from x to s* enters the ball');
	}
	const seg = (a, b, ca, cb) => {
		const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
		return [[a[0] + u[0] * ca, a[1] + u[1] * ca], [b[0] - u[0] * cb, b[1] - u[1] * cb]];
	};
	const inner = seg(X, S0, 0, NUGGET * R + 0.9), outer = seg(X, SS, 0, IMAGE_R + 0.9);
	S.raw(`<path d="${d(inner, false)}" stroke="${STONE_INK}" stroke-width="${SEG}" fill="none"/>`, 0.8);
	S.mark(inner, SEG / 2, 'the line from x to s');
	S.raw(`<path d="${d(outer, false)}" stroke="${INK}" stroke-width="${SEG}" fill="none"/>`, 0.4);
	S.mark(outer, SEG / 2, 'the line from x to s*');
	// x is where the two lines meet on the sphere: a dot there would lie half on the stone and half off it
	S.mark([X], SEG / 2, 'x');

	// ---- the key: the six shades over the same stone, one above another, the edges between them named
	const kx = C[0] + R + KEY_GAP, ky = C[1] + (LEVELS.length * KEY_H) / 2;     // its lower left corner
	const cells = LEVELS.map((v, k) => ({ v, want: 0.12 + 0.13 * k, t: ky - (k + 1) * KEY_H, b: ky - k * KEY_H }));
	const rect = (l, t, w, h) => `M${n2(l)},${n2(t)}h${w}v${h}h${-w}Z`;
	const keyShape = rect(kx, ky - LEVELS.length * KEY_H, KEY_W, LEVELS.length * KEY_H);
	S.raw(stone(`${name}-key`, keyShape, kx + KEY_W / 2 - C[0]), 0.5);
	for (const c of cells) S.raw(`<path d="${rect(kx, c.t, KEY_W, KEY_H)}" fill="${SKIN}" fill-opacity="${c.want.toFixed(4)}"/>`, 0.6);
	S.raw(`<path d="${keyShape}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>`, 0.7);
	S.boxes.push({ box: { l: kx - RIM / 2, r: kx + KEY_W + RIM / 2, t: ky - LEVELS.length * KEY_H - RIM / 2, b: ky + RIM / 2 }, what: 'the key' });

	// ---- labels: on the stone in its ink, off it in the page's
	const L = [];
	const on = (src, x, y, ax, ay, dir) => S.clear(src, x, y, ax, ay, dir, { color: STONE_INK });
	L.push(await on('R', (C[0] + left[0]) / 2, C[1] - HAIR / 2 - LABEL_GAP, 0.5, 1, [0, -1]));
	L.push(await on('\\boldsymbol{s}', S0[0] - NUGGET * R - LABEL_GAP - 0.3, S0[1], 1, 0.5, [-1, 0]));
	// |x - s| under its line, at its middle; 2 |x - s| beside the outer line, on the right
	const mid = [(inner[0][0] + inner[1][0]) / 2, (inner[0][1] + inner[1][1]) / 2];
	L.push(await on('|\\boldsymbol{x} - \\boldsymbol{s}|', mid[0], mid[1] + 3, 0.5, 0, [0, 1]));
	const om = [(outer[0][0] + outer[1][0]) / 2, (outer[0][1] + outer[1][1]) / 2];
	L.push(await S.clear('2\\,|\\boldsymbol{x} - \\boldsymbol{s}|', om[0] + 2, om[1], 0, 0.5, [0.86, 0.5]));
	L.push(await S.clear('\\boldsymbol{x}', X[0] + 2, X[1], 0, 0.5, [0.64, 0.77]));
	L.push(await S.clear('\\boldsymbol{s}^*\\!,\\ \\text{weight}\\ 2', SS[0] - IMAGE_R - LABEL_GAP, SS[1], 1, 0.5, [-1, 0]));
	// the skin's two values, in matter's colour, beside the sphere over the nugget and opposite it
	L.push(await S.clear('6', ...p(-14, 1), 1, 1, [-0.24, -0.97], { color: MATTER }));
	L.push(await S.clear('0.22', ...p(180, 1), 0.5, 0, [0, 1], { color: MATTER }));

	// the key's edges, 0.25 to 4, beside it on the right, and its name above it
	for (const c of cells.slice(1)) L.push(await placed(`${c.v}`, kx + KEY_W + LABEL_GAP + 0.4, c.b, 0, 0.5, MATTER));
	L.push(await placed('\\sigma\\ (m/4\\pi R^2)', kx, ky - LEVELS.length * KEY_H - RIM / 2 - LABEL_GAP - 1, 0, 1, MATTER));

	S.checkAll(L);
	void FAINT;
	return finish(S, L, [240, 340]);
}
