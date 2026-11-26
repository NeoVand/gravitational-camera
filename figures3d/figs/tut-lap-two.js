// The tutorial, section 2.1 (tutorial/outside/laplace.md), its second diagram: the potential of two people of mass M
// standing at x = -a and x = +a, a = 1 m, along the line through them and across it. On one pair of axes, in units
// of GM/a: along the line, Phi(x, 0, 0) = -GM/|a - x| - GM/|a + x| = -2GM a/(a^2 - x^2) for |x| < a, drawn for x
// from -0.8 m to 0.8 m; across it, through the midpoint, Phi(0, y, 0) = -2GM/sqrt(a^2 + y^2), drawn for y from
// -0.8 m to 0.8 m. Both meet at the midpoint at -2GM/a, where the first has a maximum (it falls toward each person)
// and the second a minimum (it rises toward zero). The people stand on the axis at x = -1 m and x = +1 m, just off
// the plotted range. Exact: both curves (sampled every quarter of a point along their length), their common value
// -2 at the midpoint and the signs of their second derivatives there, -4 and +2 in units of GM/a^3, which with the
// +2 across in z add up to zero (asserted, with the chapter's numbers -1.87 x 10^-8 and 9.3 x 10^-9 s^-2 for 70 kg).
// Chosen for the drawing: the two scales and the people's size (a person 1.75 m tall would be far taller than the
// plot); pictorial: the people, the stone figure of section 1.4 (sprites/tut-person.png).
import { INK, DIM, FAINT, sprite, tex } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, boxOf, AXIS, HAIR, TICK, SIZE, n2 } from './tut-pot-lib.js';
import { FIELD } from './tut-orb-lib.js';

const name = 'tut-lap-two';
const check = checker(name);
// matter's colour of the chapter's equations (app.css, --q-matter), light and dark
const MATTER = 'light-dark(#533f03, #f1dc86)';

// ---- the physics: lengths in units of a, the potential in units of GM/a -------------------------------------------
export const G = 6.674e-11, MASS = 70, A = 1;                // SI
export const along = (x) => -1 / Math.abs(1 - x) - 1 / Math.abs(1 + x);
export const across = (y) => -2 / Math.sqrt(1 + y * y);
export const REACH = 0.8;                                    // the plotted range, in a

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const SX = 96;                      // points per metre
const SY = 25;                      // points per GM/a
const XMAX = 1.27;                  // the horizontal axis, either side, in metres
const LOW = -6;                     // the potential axis's lowest value
const CURVE = 0.75;                 // a curve's stroke
const STATURE = 46;                 // a person's height on the page, points (schematic)
const PT = 1.25;                    // the midpoint's dot
const RES = 360;                    // the people's picture, pixels tall

/** Where a sprite has ink, its edges taken where the alpha passes half: [left, right, top, bottom] in pixels. */
/** The picture resampled to `h` pixels tall, as a data URL. */
async function resample(s, h) {
	const img = new Image();
	img.src = s.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.height = h; c.width = Math.round((h * img.width) / img.height);
	const ctx = c.getContext('2d');
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(img, 0, 0, c.width, c.height);
	return c.toDataURL('image/png');
}

async function inkOf(s) {
	const img = new Image();
	img.src = s.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.width = img.width; c.height = img.height;
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const a = ctx.getImageData(0, 0, img.width, img.height).data;
	let l = Infinity, r = -1, t = Infinity, b = -1;
	for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (a[(y * img.width + x) * 4 + 3] >= 128) {
		if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
	}
	return { l, r: r + 1, t, b: b + 1 };
}

export default async function () {
	// ---- the numbers the chapter prints
	const GM = G * MASS, unit = GM / A;
	check(near(along(0), -2, 1e-15) && near(across(0), -2, 1e-15), 'the curves do not meet at -2');
	check(near(-2 * unit, -9.34e-9, 0.005e-9) && (-2 * unit / 1e-9).toFixed(1) === '-9.3', `-2GM/a is ${-2 * unit}`);
	for (const x of [0.1, 0.37, 0.8]) check(near(along(x), (-2 * A * A) / (A * A - x * x), 1e-12), 'the curve along is not -2a/(a^2 - x^2)');
	const h = 1e-4, d2 = (f) => (f(h) - 2 * f(0) + f(-h)) / (h * h);
	const xx = d2(along), yy = d2(across);
	check(near(xx, -4, 1e-6) && near(yy, 2, 1e-6), `the second derivatives are ${xx} and ${yy}`);
	check(near(xx + 2 * yy, 0, 1e-6), 'the three second derivatives do not add up to zero');
	check((xx * GM / A ** 3).toExponential(2) === '-1.87e-8' && (yy * GM / A ** 3).toExponential(1) === '9.3e-9', 'the tides are not the chapter\'s');
	// the midpoint is a maximum along and a minimum across, over the whole plotted range
	for (let s = 0.01; s <= REACH; s += 0.01) check(along(s) < -2 && along(-s) < -2 && across(s) > -2 && across(-s) > -2, `the midpoint is not a saddle at ${s}`);
	check(across(REACH) < 0 && along(REACH) > LOW, 'a curve leaves the axes');

	const S = new Sheet(name);
	const X0 = ORIGIN, Y0 = ORIGIN - 60;
	const at = (x, p) => [X0 + SX * x, Y0 - SY * p];

	// ---- the curves, in the field's colour: each one path, points a quarter of a point apart along it
	const sample = (f) => {
		const pts = [];
		let x = -REACH;
		while (x < REACH) {
			pts.push(at(x, f(x)));
			const slope = (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;
			x = Math.min(REACH, x + 0.24 / Math.hypot(SX, SY * slope));
		}
		pts.push(at(REACH, f(REACH)));
		for (let i = 1; i < pts.length; i++) check(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) <= 0.25, 'a curve is sampled too coarsely');
		return pts;
	};
	S.path(sample(along), { color: FIELD, width: CURVE, layer: 2, what: 'the curve along' });
	S.path(sample(across), { color: FIELD, width: CURVE, layer: 2, what: 'the curve across' });

	// ---- the horizontal axis, at Phi = 0: ticks every half metre, downward, labelled below
	S.path([at(-XMAX, 0), at(XMAX, 0)], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the horizontal axis' });
	const L = [];
	// (the people stand at -1 and 1 and mark those places, so the axis carries ticks only between them, and its name
	// takes the place of the first number at the left)
	for (const k of [-0.5, 0, 0.5]) {
		const [x, y] = at(k, 0);
		S.path([[x, y], [x, y + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${k} m` });
		L.push(await placed(`${k < 0 ? '-' : ''}${Math.abs(k)}`, x, y + TICK + 2.4, 0.5, 0, DIM));
	}

	// ---- the potential's axis, at the right: ticks outward, labelled
	const right = at(XMAX, 0)[0];
	S.path([at(XMAX, 0), at(XMAX, LOW)], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the potential axis' });
	for (const t of [0, -2, -4, -6]) {
		const [x, y] = at(XMAX, t);
		const marked = t === -2;
		S.path([[x, y], [x + TICK, y]], { color: marked ? INK : DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${t}` });
		L.push(await placed(t === 0 ? '0' : `-${-t}`, x + TICK + 2.4, y, 0, 0.5, marked ? INK : DIM));
	}

	// ---- the midpoint: a dot, a dotted line to its value
	const Mp = at(0, -2);
	S.raw(`<circle cx="${n2(Mp[0])}" cy="${n2(Mp[1])}" r="${PT}" fill="${INK}"/>`, 4);
	S.mark([Mp], PT, 'the midpoint');
	// the two curves leave the level -2 tangentially, so the dotted line starts where both have drawn 2.4 points of
	// air away from it, and runs from there to the axis
	let s0 = 0;
	while (Math.min(across(s0) + 2, -2 - along(s0)) * SY < 2.4 + CURVE / 2 + 0.3) s0 += 0.001;
	check(s0 < REACH, 'the curves never leave the level -2');
	S.dots(at(s0, -2), [right, Mp[1]], { color: FAINT, clear0: 0, clear1: 0.4, what: 'the line to -2' });

	// ---- the people, standing on the axis at x = -a and x = +a, each centred on its place and facing the midpoint
	// (the picture, which faces right, is resampled to RES pixels tall: four pixels to a point at the site's size)
	const person = await sprite('/figures3d/sprites/tut-person.png');
	const ink = await inkOf(person);
	const px = STATURE / (ink.b - ink.t);                          // points per pixel of the picture
	const small = await resample(person, RES);
	for (const s of [-1, 1]) {
		const [cx, cy] = at(s * A, 0);
		const left = cx - ((ink.l + ink.r) / 2) * px, top = cy - ink.b * px;    // the picture's corner: soles on the axis
		const flip = s > 0 ? ` transform="translate(${n2(2 * cx)},0) scale(-1,1)"` : '';
		S.raw(`<image class="art" href="${small}" x="${n2(left)}" y="${n2(top)}" width="${n2(person.w * px)}" height="${n2(person.h * px)}" preserveAspectRatio="none"${flip}/>`, 3);
		S.boxes.push({ box: { l: left + ink.l * px, r: left + ink.r * px, t: top + ink.t * px, b: cy }, what: `the person at ${s} m` });
		check(near(top + ink.b * px, cy, 1e-9), 'a person does not stand on the axis');
		check(near(left + ((ink.l + ink.r) / 2) * px, cx, 1e-9), 'a person is not centred on its place');
		check(Math.abs(s * A) - REACH > 0.15, 'a person stands inside the plotted range');
	}

	// ---- labels
	const lab = (src, x, y, ax, ay, dir, color) => S.clear(src, x, y, ax, ay, dir, { color });
	// the curves' names, in the field's colour, beside them
	L.push(await lab('\\Phi(x, 0, 0)', ...at(-0.5, along(-0.5)), 1, 0.5, [-1, 0], FIELD));
	L.push(await lab('\\Phi(0, y, 0)', ...at(-0.62, across(-0.62)), 0.5, 1, [0, -1], FIELD));
	// the people's masses, in matter's colour, beside their heads on the outer side
	for (const s of [-1, 1]) {
		const box = S.boxes.find((b) => b.what === `the person at ${s} m`).box;
		L.push(await lab('M', s < 0 ? box.l : box.r, box.t + 0.3 * (box.b - box.t), s < 0 ? 1 : 0, 0.5, [s, 0], MATTER));
	}
	// the axes' names
	L.push(await placed('x\\ \\text{or}\\ y\\ (\\mathrm{m})', at(-XMAX, 0)[0], at(0, 0)[1] + TICK + 2.4, 0, 0, DIM));
	// the potential's name, above the top of its axis: Phi in the field's colour, its unit after it, on one baseline
	const base = at(0, 0)[1] - 9, x0 = right - 3;
	const phi = { src: '\\Phi', svg: await tex('\\Phi', [x0, base], SIZE, 'lB', FIELD) };
	phi.box = boxOf(phi.svg);
	const units = { src: '(GM/a)', svg: await tex('\\ (GM/a)', [phi.box.r, base], SIZE, 'lB', DIM) };
	units.box = boxOf(units.svg);
	L.push(phi, units);

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
