// The tutorial, reading section R5 (tutorial/waves/reading-section-iii.md), its second diagram: the capstone, the
// paper's which-way scene (scenes/which-way.scene.json, Figure fig:which-way) with Part 5's numbers. Two panels. One
// drawing serves the desktop and the phone (as R4's capstone, figs/tut-read-iv3-capstone.js), so the two are stacked
// and laid out to be read at 390 px; the diagram comment asked for them side by side on a wide screen, but the site
// shows one drawing at every width, and R4 took its narrow layout for both. The printed book (figureLayout 'book')
// sets them side by side, (a) at the left and (b) at the right, their letters on one line, (a) at 40 points per metre
// and (b) at 4.4 points per degree, its elevation from -21 to 21 degrees (the site's 44, 6.4 and -22 to 22) so that
// the pair fits the text width and (b) stands little lower than (a); the name of the dark ring is set in three lines to
// fit the narrower picture. The line on the true speed of light (at c = 3e8 m/s, lambda = 1.5e8 m: no spot, the same
// sense of turning) is the caption's, not the drawing's.
//  (a) Side view, to scale (SCALE points per metre across and up), of the plane through the camera's axis: distance
//      from the array across, from 0 to 5 m, an axis break, and one more tick at D^2/lambda = 22.5 m, where the
//      Fresnel zone ends; height up, from 0 to 3.2 m. The array, a thick segment at distance 0 from 0.75 to 2.25 m. The
//      three boxes, 0.7 m deep and 0.95 m tall, their front faces at 4.15 m, centred at 2.555, 1.515 and 0.475 m (the
//      steel grey of the beads, figs/tut-five-lib.js), all read from the scene file. Dotted lines from the array's
//      centre to the three pairs' centres. Step (a): a bar 10 cm long. Step (b): the near zone of the middle pair, a
//      circle of radius lambda/2pi = 1.59 cm about its centre, drawn in a round inset magnified twenty times, with
//      lines from its place in the box. Step (c): the front from the middle pair through the array's centre against the
//      flat front there (the array's own line, from which it differs by 2.5 mm at the rims: 0.11 pt): at every height
//      of the array the difference of path |p - s| - (r - (p - c).u) is drawn ten times larger, along the ray from the
//      array's point p to the pair s; at the lower rim it is drawn as a thicker segment, the gap, and named.
//  (b) The camera's view: azimuth (about the vertical, positive to the right) from -20 to 20 degrees across and
//      elevation (above the horizontal plane through the camera) from -22 to 22 degrees up, on a pale ground (the
//      page's neutral tint, #eeebe5) in a thin frame, where the paper's panel (b) is dark. The front faces of the boxes
//      as thin dark grey outlines: their upright edges at
//      azimuth +-6.19 degrees and their level edges at the elevations the comment gives on the centre line (7.96 to
//      20.24, -6.33 to 6.73 and -19.87 to -7.55 degrees), which sag towards the horizon at the corners by up to 0.11
//      degree, as level lines do in azimuth and elevation. The picture is the paper's: for each turning pair an Airy
//      spot of intensity (2 J_1(x)/x)^2, x = pi (D/lambda) sin gamma, gamma the angle from the pair's direction, times
//      the pair's I = a_+^2 + a_x^2, and the colour from V/I = 2 a_+ a_x / I on the paper's scale from green (-1)
//      through #f2f2f2 to magenta (+1) (the magenta the book's, the observer's: tut-pol-lib.js, MAGENTA, where the
//      paper's is an ad hoc rose, #c2255c, none of the palette's roles), its brightness the square root of the
//      intensity, mixed with the pale ground as the paper's is with its dark one (make_figures.py, which_way), computed
//      here pixel by pixel (kept as a JPEG of quality 0.92, three pixels to the point). The picture is fixed, pale in
//      both of the site's themes, so the marks and words on it are in an ink and a grey one step off the palette's,
//      which the site does not swap; the bracket and its value, on the magenta spot, in white.
//      The first dark ring, the angle 4.66 degrees from each centre where
//      x = j_1,1, dashed; across the middle spot, a bracket between the points of half intensity, 3.93 degrees apart.
// Departures from the diagram's comment: the gap of step (c) is labelled with its exact length, 6.2 cm (6.20 and
// 6.21 cm at the two rims), not the chapter's 6.25 cm, which is the estimate D^2/8r; the phase, 3.9 rad, is the same
// to two figures. The still pair's two dots are drawn one above the other, 0.44 m apart, as a pair turning in the
// plane of the page would be seen; in fact its balls lie side by side across the line of sight, one behind the other
// in a side view, so the dots are schematic, as the turning arrows are. The dark ring is a circle on the sky; in
// azimuth and elevation it is 2.7% wider than tall at the top spot's elevation.
// Exact: every length in (a) but the arrows' and dots' shapes, the gap's ten times and the inset's twenty times (both
// to scale at that magnification); every angle and the whole picture in (b). Schematic: the turning arrows (their
// sense on the page follows the camera's: clockwise for the top pair, anticlockwise for the middle one) and the dots.
import { INK, DIM, RULE, ACCENT, ACCENT2, LETTER } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, HAIR, AXIS, TICK, LABEL_GAP } from './tut-pot-lib.js';
import { NUM } from './tut-prob-lib.js';
import { longest } from './tut-fourier-lib.js';
import { STEEL } from './tut-five-lib.js';
import { airy, bisect } from './tut-bessel-lib.js';
import { amplitudes, circularShare, MAGENTA } from './tut-pol-lib.js';

const name = 'tut-read-iii-capstone';
const check = checker(name);

const GREEN = '#2f9e44';                   // clockwise as seen, V/I < 0 (figs/quadrupole.js, TURNS_CLOCKWISE)
const MID = '#f2f2f2';                     // the paper's scale at V/I = 0
const TINT = '#eeebe5';                    // the picture's ground: the neutral tint of the page (drawing.ts, THEME)
// The picture is a fixed image (a JPEG), pale in both of the site's themes, so the marks and words on it are drawn in
// colours the site does not swap for its dark theme (drawing.ts swaps only the palette's exact hexes): the ink and the
// dim grey, each one step off the palette's.
const ON_INK = '#1c1a17', ON_DIM = '#5d5a53';
const WHITE = '#ffffff';                   // the bracket and its value, on the magenta spot (not swapped by the site)
const C_SLOW = 0.2, C_TRUE = 2.998e8;      // m/s
const D = 1.5;                             // m, the array
const J11 = 3.8317059702075125;            // the first zero of J_1

// ---- the drawing (figure points, y down) --------------------------------------------------------------------------
const SIZE = 8.5;
const BOOK = globalThis.figureLayout === 'book';
const SCALE = BOOK ? 40 : 44;              // (a): points per metre, across and up
const YL = 21;                             // from the column's left to the axes of both panels
const OFF = 5;                             // (a): the height axis stands this far left of the array
const ARRAY_W = 1.6;                       // the array's stroke
const FRONT = 0.7, GAP_W = HAIR + 0.25;    // the front and the gap (figs/tut-das-fresnel.js)
const EXAG = 10, MAG = 20;                 // the gap's exaggeration, the inset's magnification
const RIN = 18;                            // the inset's radius, points
const DEG = BOOK ? 4.4 : 6.4;              // (b): points per degree
const BESIDE = 18;                         // the book's: the air between (a)'s ink and (b)'s column
const PX = 3;                              // (b): the picture's pixels per point
const ROW_GAP = 15;                        // from the lowest ink of (a) to the letter (b)
const BELOW_LETTER = 5;
const OUTLINE = 0.55;                       // the boxes' outlines on the picture
const FRAME = 0.5;                         // the picture's frame
const RING_W = 0.5, RING_DASH = [2, 1.6];

const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;
const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a, b) => a.map((x, i) => x - b[i]);

// ---- the scene and the numbers -------------------------------------------------------------------------------------
async function numbers() {
	const scene = await (await fetch('/scenes/which-way.scene.json')).json();
	const obj = (id) => scene.objects.find((o) => o.id === id);
	const O = scene.observer.position;
	check(O.join() === '0,1.5,0', 'the camera is not at height 1.5 m');
	const N = { O };
	// the boxes: 0.9 wide, 0.95 tall, 0.7 deep, front faces at 4.15 m, centred at 2.555, 1.515, 0.475 m
	N.boxes = ['top', 'middle', 'bottom'].map((k) => {
		const s = obj(`drum-${k}`).shape;
		const a = obj(`drum-${k}-ball-a`), b = obj(`drum-${k}-ball-b`);
		const rate = a.spin?.rate ?? 0;
		check(s.size.join() === '0.9,0.95,0.7' && near(-(s.center[2] + s.size[2] / 2), 4.15, 1e-12), `the ${k} box's size or place`);
		check(near(Math.hypot(...sub(a.shape.center, b.shape.center)), 0.44, 1e-12) && a.shape.radius === 0.1, `the ${k} pair's balls`);
		const centre = a.spin ? a.spin.center : a.shape.center.map((x, i) => (x + b.shape.center[i]) / 2);
		check(near(centre[2], -4.5, 1e-12) && near(centre[1], s.center[1], 1e-12), `the ${k} pair is not at the box's centre`);
		return { k, y: s.center[1], half: s.size[1] / 2, w: s.size[0] / 2, front: -(s.center[2] + s.size[2] / 2), depth: s.size[2], pair: centre, rate, axis: a.spin?.axis };
	});
	check(N.boxes.map((b) => b.y).join() === '2.555,1.515,0.475', 'the boxes\' heights');
	check(N.boxes[0].rate === -1 && N.boxes[1].rate === 1 && N.boxes[2].rate === 0, 'the top pair turns -1, the middle +1, the bottom is still');

	// (a) the wavelength: a pattern of stretch repeats twice a turn, f = 2 Hz at one turn a second
	N.f = 2 * Math.abs(N.boxes[1].rate);
	N.lambda = C_SLOW / N.f;
	check(near(N.lambda, 0.1, 1e-15), `lambda = ${N.lambda}`);
	// (b) the near zone and the camera's distance in units of it
	N.zone = N.lambda / (2 * Math.PI);
	N.times = 4.5 / N.zone;
	check((N.zone * 100).toFixed(1) === '1.6' && N.times.toFixed(0) === '283', `lambda/2pi = ${N.zone}, ${N.times}`);
	// (c) the Fresnel distance, and the difference of path across the array from the middle pair
	N.fresnel = D ** 2 / N.lambda;
	check(near(N.fresnel, 22.5, 1e-12), 'D^2/lambda');
	const s = [-N.boxes[1].pair[2], N.boxes[1].pair[1]];                   // (distance, height) of the middle pair
	const c = [0, O[1]];
	const r = Math.hypot(s[0] - c[0], s[1] - c[1]), u = [(s[0] - c[0]) / r, (s[1] - c[1]) / r];
	N.path = (h) => { const p = [0, h]; return Math.hypot(s[0] - p[0], s[1] - p[1]) - (r - ((p[0] - c[0]) * u[0] + (p[1] - c[1]) * u[1])); };
	N.s = s; N.c = c; N.r = r; N.u = u;
	N.gapLow = N.path(O[1] - D / 2); N.gapHigh = N.path(O[1] + D / 2);
	check((N.gapLow * 100).toFixed(2) === '6.20' && (N.gapHigh * 100).toFixed(2) === '6.21', `the gaps ${N.gapLow}, ${N.gapHigh}`);
	check((D ** 2 / (8 * 4.5)).toFixed(4) === '0.0625', 'the chapter\'s D^2/8r');
	N.phase = (2 * Math.PI * N.gapLow) / N.lambda;
	check(N.phase.toFixed(1) === '3.9' && ((2 * Math.PI * 0.0625) / N.lambda).toFixed(1) === '3.9', `the phase ${N.phase}`);
	// the flat front through the centre, against the array's line: 0.75 u_y at the rims
	N.tilt = (D / 2) * Math.abs(u[1]);
	check(N.tilt * SCALE < 0.12, 'the flat front stands visibly off the array');

	// (b) the view: azimuth about the vertical, elevation above the horizontal, the camera looking along -z
	N.view = (p) => { const v = sub(p, O); return [deg(Math.atan2(v[0], -v[2])), deg(Math.atan2(v[1], Math.hypot(v[0], v[2])))]; };
	N.dir = (az, el) => [Math.cos(rad(el)) * Math.sin(rad(az)), Math.sin(rad(el)), -Math.cos(rad(el)) * Math.cos(rad(az))];
	const [b0, b1, b2] = N.boxes;
	const edgeAz = N.view([b0.w, b0.y, -b0.front])[0];
	check(edgeAz.toFixed(2) === '6.19', `the boxes' edges at ${edgeAz}`);
	const els = N.boxes.map((b) => [N.view([0, b.y - b.half, -b.front])[1], N.view([0, b.y + b.half, -b.front])[1]].map((e) => e.toFixed(2)).join(' to '));
	check(els.join(', ') === '7.96 to 20.24, -6.33 to 6.73, -19.87 to -7.55', `the boxes' elevations ${els}`);
	N.sag = N.view([0, b0.y + b0.half, -b0.front])[1] - N.view([b0.w, b0.y + b0.half, -b0.front])[1];
	check(N.sag.toFixed(2) === '0.11', `the sag ${N.sag}`);
	// the spots: centres, intensities, polarizations
	N.spots = [b0, b1].map((b) => {
		const [az, el] = N.view(b.pair);
		const n = norm(sub(O, b.pair));                                   // from the pair to the camera
		const spin = b.axis.map((x) => x * Math.sign(b.rate));
		const iota = Math.acos(dot(spin, n));
		const { hp, hx } = amplitudes(iota);
		return { az, el, iota: deg(iota), I: hp * hp + hx * hx, V: 2 * hp * hx, vi: circularShare(iota), c: norm(sub(b.pair, O)) };
	});
	const [top, mid] = N.spots;
	check(top.el.toFixed(2) === '13.19' && mid.el.toFixed(2) === '0.19' && near(top.az, 0, 1e-12) && near(mid.az, 0, 1e-12), 'the spots\' centres');
	check(top.iota.toFixed(1) === '166.8' && mid.iota.toFixed(1) === '0.2', `the inclinations ${top.iota}, ${mid.iota}`);
	check(top.vi.toFixed(3) === '-1.000' && mid.vi.toFixed(3) === '1.000' && (1 + top.vi) < 5e-7, `V/I = ${top.vi}, ${mid.vi}`);
	check(near(top.vi, top.V / top.I, 1e-15), 'V/I');
	// the Airy pattern: x = pi (D/lambda) sin gamma; its first zero and its half width
	N.k = (Math.PI * D) / N.lambda;
	check(Math.abs(airy(J11)) < 1e-13, 'j_1,1 is not a zero of J_1');
	N.ring = deg(Math.asin(J11 / N.k));
	const xh = bisect((x) => airy(x) ** 2 - 0.5, 1, 2);
	N.half = deg(Math.asin(xh / N.k));
	check(N.ring.toFixed(2) === '4.66' && N.ring.toFixed(1) === '4.7' && (4.5 * Math.tan(rad(N.ring))).toFixed(2) === '0.37', `the ring ${N.ring}`);
	check((2 * N.half).toFixed(2) === '3.93' && (2 * N.half).toFixed(1) === '3.9', `the width ${2 * N.half}`);
	// the rings of the two spots do not touch
	check(top.el - mid.el > 2 * N.ring, 'the rings touch');
	// (f) the true speed of light
	N.lambdaTrue = C_TRUE / N.f;
	check(N.lambdaTrue.toPrecision(2) === '1.5e+8', `lambda = ${N.lambdaTrue}`);
	return N;
}

/** The paper's colour scale for V/I: green at -1, MID at 0, magenta (the book's) at +1, straight between (rgb, 0 to 1). */
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const [G3, M0, M3, T3] = [rgb(GREEN), rgb(MID), rgb(MAGENTA), rgb(TINT)];
const scale = (vi) => { const t = (vi + 1) / 2; return t < 0.5 ? G3.map((g, i) => g + (M0[i] - g) * (t / 0.5)) : M0.map((m, i) => m + (M3[i] - m) * ((t - 0.5) / 0.5)); };

export default async function () {
	const N = await numbers();
	const S = new Sheet(name);
	const L = [];
	const CW = 318;
	const x0 = BOOK ? 40 : ORIGIN - CW / 2;          // (the book's two columns need the provisional page's width)
	const letter = async (l, x, y) => { const g = await placed(`\\text{(${l})}`, x, y, 0, 0, INK, LETTER); L.push(g); return g.box; };
	const lowest = () => Math.max(...L.map((g) => g.box.b), ...S.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)));

	// =============== (a) the side view ===============
	const T1 = ORIGIN - 300;
	const la = await letter('a', x0, T1);
	L.push(await placed('\\text{height (m)}', la.r + 6, (la.t + la.b) / 2, 0, 0.5, DIM, SIZE));
	const ax = x0 + YL + OFF;                                // distance 0
	const H_TOP = 3.2;
	const by = la.b + BELOW_LETTER + 4 + H_TOP * SCALE;      // height 0
	const X = (d) => ax + d * SCALE, Y = (h) => by - h * SCALE;
	const P = ([d, h]) => [X(d), Y(h)];

	// the axes: height at the left, distance along the floor, broken after 5 m, with D^2/lambda beyond
	const yx = ax - OFF;
	S.path([[yx, Y(0)], [yx, Y(H_TOP)]], { color: DIM, width: AXIS, cap: 'butt', what: 'the height axis' });
	for (const t of [0, 1, 2, 3]) {
		S.path([[yx, Y(t)], [yx - TICK, Y(t)]], { color: DIM, width: HAIR, cap: 'butt', what: `the height tick ${t}` });
		L.push(await placed(String(t), yx - TICK - NUM, Y(t), 1, 0.5, DIM, SIZE));
	}
	const BREAK = X(5.25), XF = X(5) + 44;                   // the break's slashes, and the tick at 22.5 m
	S.path([[yx, Y(0)], [BREAK - 1.6, Y(0)]], { color: DIM, width: AXIS, cap: 'butt', what: 'the distance axis' });
	S.path([[BREAK + 1.6, Y(0)], [XF + 4, Y(0)]], { color: DIM, width: AXIS, cap: 'butt', what: 'the distance axis beyond the break' });
	for (const dx of [-1.6, 1.6]) S.path([[BREAK + dx - 1.2, Y(0) + 2.4], [BREAK + dx + 1.2, Y(0) - 2.4]], { color: DIM, width: AXIS, cap: 'butt', what: 'the break' });
	const ticks = [0, 1, 2, 3, 4, 4.5];
	for (const t of ticks) {
		S.path([[X(t), Y(0)], [X(t), Y(0) + TICK]], { color: DIM, width: HAIR, cap: 'butt', what: `the distance tick ${t}` });
		L.push(await placed(String(t), X(t), Y(0) + TICK + NUM, 0.5, 0, DIM, SIZE));
	}
	S.path([[XF, Y(0)], [XF, Y(0) + TICK]], { color: DIM, width: HAIR, cap: 'butt', what: 'the tick at 22.5 m' });
	const n22 = await placed('22.5', XF, Y(0) + TICK + NUM, 0.5, 0, DIM, SIZE);
	L.push(n22);
	const row2 = n22.box.b + 4;
	L.push(await placed('\\text{distance from the array (m)}', X(2.25), row2, 0.5, 0, DIM, SIZE));
	const f1 = await placed(`D^2/\\lambda = ${N.fresnel}\\ \\mathrm m\\text{:}`, n22.box.r, row2, 1, 0, DIM, SIZE);
	const f2 = await placed('\\text{the Fresnel zone ends}', n22.box.r, f1.box.b + 3, 1, 0, DIM, SIZE);
	L.push(f1, f2);

	// the boxes, in the steel grey; the turning arrows (schematic) and the still pair's dots
	for (const b of N.boxes) {
		const l = X(b.front), r = X(b.front + b.depth), t = Y(b.y + b.half), bt = Y(b.y - b.half);
		check(near(r - l, 0.7 * SCALE, 1e-9) && near(bt - t, 0.95 * SCALE, 1e-9), `the ${b.k} box is not to scale`);
		S.raw(`<path d="M${n2(l)},${n2(t)}H${n2(r)}V${n2(bt)}H${n2(l)}Z" fill="${STEEL}" fill-opacity="0.28" stroke="${STEEL}" stroke-width="0.6"/>`, 0);
		S.mark([[l, t], [r, t], [r, bt], [l, bt], [l, t]], 0.3, `the ${b.k} box`);
	}
	const RX = 0.13 * SCALE, RY = 0.27 * SCALE;
	const turning = (b, color, clockwise) => {
		const [cx, cy] = P([-b.pair[2], b.pair[1]]);
		const rx = RX, ry = RY;
		// an ellipse's arc of 280 degrees, open towards the inset (the lines to it pass through the opening) and ending in
		// a head; clockwise on the page for the top pair, as the camera sees it
		const a0 = clockwise ? -40 : 40, sweep = clockwise ? -280 : 280;
		const pts = Array.from({ length: 241 }, (_, i) => { const a = rad(a0 + (sweep * i) / 240); return [cx + rx * Math.cos(a), cy - ry * Math.sin(a)]; });
		// the head, along the ellipse's tangent at its end, as lib's arrows are drawn (a shaft to 0.8 of the head)
		const HD = 3.2, tip = pts.at(-1), pre = pts.at(-2);
		const t = [(tip[0] - pre[0]) / Math.hypot(tip[0] - pre[0], tip[1] - pre[1]), (tip[1] - pre[1]) / Math.hypot(tip[0] - pre[0], tip[1] - pre[1])];
		const nn = [-t[1], t[0]], base = [tip[0] - HD * t[0], tip[1] - HD * t[1]], hw = 0.36 * HD;
		let kb = pts.length - 1;
		while (Math.hypot(tip[0] - pts[kb][0], tip[1] - pts[kb][1]) < 0.8 * HD) kb--;
		S.path(pts.slice(0, kb + 1), { color, width: 0.75, layer: 3, what: `the ${b.k} pair's arrow` });
		const tri = [tip, [base[0] + nn[0] * hw, base[1] + nn[1] * hw], [base[0] - nn[0] * hw, base[1] - nn[1] * hw]];
		S.raw(`<path d="M${tri.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${color}"/>`, 3);
		S.mark([...tri, tip], 0, `the ${b.k} pair's head`);
		return [cx, cy];
	};
	const cTop = turning(N.boxes[0], GREEN, true);
	const cMid = turning(N.boxes[1], MAGENTA, false);
	const still = N.boxes[2];
	for (const s of [-1, 1]) {
		const p = P([-still.pair[2], still.pair[1] + 0.22 * s]);
		S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${n2(0.1 * SCALE)}" fill="${STEEL}"/>`, 2);
		S.mark([p], 0.1 * SCALE, 'a still ball');
	}

	// the dotted lines from the array's centre to the pairs' centres
	const cA = P(N.c);
	// the lines to the turning pairs stop short of their arrows' ellipses, which they would cross
	for (const b of N.boxes) {
		const e = P([-b.pair[2], b.pair[1]]), th = Math.atan2(e[1] - cA[1], e[0] - cA[0]);
		const reach = b.rate ? 1 / Math.hypot(Math.cos(th) / RX, Math.sin(th) / RY) + 1.6 : 0;
		S.dots(cA, e, { color: DIM, clear0: ARRAY_W, clear1: reach, layer: 1.5, what: `the line to the ${b.k} pair` });
	}

	// the array, and its name above it
	S.path([P([0, 0.75]), P([0, 2.25])], { color: INK, width: ARRAY_W, cap: 'butt', layer: 3, what: 'the array' });
	L.push(await placed('\\text{array, } D = 1.5\\ \\mathrm m', X(0) - 1, Y(2.25) - 5, 0, 1, INK, SIZE));

	// step (c): the front from the middle pair through the array's centre, its difference of path from the flat front
	// drawn ten times larger along the ray to the pair; the gap at the lower rim
	const s2 = N.s;
	const front = (h) => {
		const p = [0, h], l = Math.hypot(s2[0] - p[0], s2[1] - p[1]);
		const g = EXAG * N.path(h);
		return [p[0] + (g * (s2[0] - p[0])) / l, p[1] + (g * (s2[1] - p[1])) / l];
	};
	const fpts = Array.from({ length: 601 }, (_, i) => P(front(0.75 + (1.5 * i) / 600)));
	check(longest(fpts) <= 0.25, 'the front is coarse');
	check(near(N.path(N.c[1]), 0, 1e-15), 'the front does not pass through the array\'s centre');
	S.path(fpts, { color: ACCENT, width: FRONT, layer: 2.5, cap: 'butt', what: 'the front' });
	const gA = P([0, 0.75]), gB = P(front(0.75));
	check(near(Math.hypot(gB[0] - gA[0], gB[1] - gA[1]), EXAG * N.gapLow * SCALE, 1e-9), 'the gap is not ten times the path');
	S.path([gA, gB], { color: ACCENT, width: GAP_W + 0.35, layer: 2.6, cap: 'butt', what: 'the gap' });
	const gl = await S.clear(`\\text{${(N.gapLow * 100).toFixed(1)} cm of path, ${N.phase.toFixed(1)} rad}`, X(0) + 2, gB[1] + LABEL_GAP + 1.5, 0, 0, [0, 1], { color: ACCENT });
	L.push(gl);

	// step (a): the wavelength, a bar 10 cm long, under the gap's name
	const yb = gl.box.b + 7.5, b0 = [X(0.05), yb], b1 = [X(0.05 + N.lambda), yb];
	check(near(b1[0] - b0[0], 0.1 * SCALE, 1e-9), 'the bar is not 10 cm');
	S.path([b0, b1], { color: INK, width: HAIR + 0.15, layer: 3, cap: 'butt', what: 'the bar' });
	for (const e of [b0, b1]) S.path([[e[0], e[1] - TICK], [e[0], e[1] + TICK]], { color: INK, width: HAIR + 0.15, layer: 3, cap: 'butt', what: 'the bar\'s end' });
	L.push(await placed('\\lambda = 10\\ \\mathrm{cm}', b1[0] + LABEL_GAP + 1, yb, 0, 0.5, INK, SIZE));
	check(yb + TICK + 3 < Y(0), 'the bar reaches the floor');

	// step (b): the near zone of the middle pair, in a round inset magnified twenty times
	const mb = N.boxes[1];
	const cIn = [X(mb.front + mb.depth) + 7 + RIN, cMid[1]];
	const small = RIN / MAG;                                   // the region the inset shows, in the main view
	const circle = (c, r, k = 360) => Array.from({ length: k + 1 }, (_, i) => [c[0] + r * Math.cos((2 * Math.PI * i) / k), c[1] + r * Math.sin((2 * Math.PI * i) / k)]);
	S.path(circle(cIn, RIN), { color: DIM, width: HAIR, layer: 2, what: 'the inset' });
	S.raw(`<circle cx="${n2(cIn[0])}" cy="${n2(cIn[1])}" r="${RIN}" fill="#fffffe"/>`, 1.9);
	S.path(circle(cMid, small, 72), { color: DIM, width: HAIR, layer: 3.1, what: 'the inset\'s place' });
	// the two lines tangent to both circles (external tangents), from the small one to the inset
	const dc = Math.hypot(cIn[0] - cMid[0], cIn[1] - cMid[1]), ang = Math.atan2(cIn[1] - cMid[1], cIn[0] - cMid[0]);
	// a line tangent to both, with both circles on one side: its normal n has n.(cIn - cMid) = small - RIN
	const tA = Math.acos((RIN - small) / dc);
	for (const sg of [-1, 1]) {
		const a = ang + sg * (Math.PI - tA);
		const A = [cMid[0] + small * Math.cos(a), cMid[1] + small * Math.sin(a)], B = [cIn[0] + RIN * Math.cos(a), cIn[1] + RIN * Math.sin(a)];
		// tangent: at right angles to both radii, so it touches the inset and does not cross it
		check(near((B[0] - A[0]) * Math.cos(a) + (B[1] - A[1]) * Math.sin(a), 0, 1e-9), 'a line to the inset is not tangent');
		S.path([A, B], { color: DIM, width: HAIR, layer: 1.95, cap: 'butt', what: 'a line to the inset' });
	}
	const rz = N.zone * MAG * SCALE;
	check(near(rz, 0.1 / (2 * Math.PI) * 20 * SCALE, 1e-9) && rz < RIN - 2, `the near zone in the inset, ${rz} pt`);
	S.path(circle(cIn, rz), { color: ACCENT2, width: 0.6, layer: 2.2, what: 'the near zone' });
	S.raw(`<circle cx="${n2(cIn[0])}" cy="${n2(cIn[1])}" r="0.9" fill="${INK}"/>`, 2.3);
	S.mark([cIn], 0.9, 'the pair\'s centre');
	L.push(await placed(`\\times${MAG}`, cIn[0], cIn[1] + RIN + 3, 0.5, 0, DIM, SIZE));
	const zl = [];
	const zLines = [`\\lambda/2\\pi = ${(N.zone * 100).toFixed(1)}\\ \\mathrm{cm}\\text{:}`, '\\text{the camera is}', `\\text{${N.times.toFixed(0)} times farther}`];
	let zy = cIn[1] - RIN - 4;
	for (const s of zLines.reverse()) { const g = await placed(s, cIn[0] - RIN, zy, 0, 1, INK, SIZE); zl.push(g); zy = g.box.t - 3; }
	L.push(...zl);

	// =============== (b) the camera's view ===============
	// on the site under (a); in the book at its right, the two letters on one line
	const rightA = Math.max(...L.map((g) => g.box.r), ...S.marks.flatMap((m) => m.pts.map((p) => p[0] + m.r)));
	const xb = BOOK ? rightA + BESIDE : x0;
	const T2 = BOOK ? T1 : lowest() + ROW_GAP;
	const lb = await letter('b', xb, T2);
	L.push(await placed('\\text{elevation (degrees)}', lb.r + 6, (lb.t + lb.b) / 2, 0, 0.5, DIM, SIZE));
	const AZ = [-20, 20], EL = BOOK ? [-21, 21] : [-22, 22];
	const left = xb + YL, top = lb.b + BELOW_LETTER + 2;
	const PW = (AZ[1] - AZ[0]) * DEG, PH = (EL[1] - EL[0]) * DEG;
	const XA = (a) => left + (a - AZ[0]) * DEG, YE = (e) => top + (EL[1] - e) * DEG;
	const V = ([a, e]) => [XA(a), YE(e)];

	// the picture, pixel by pixel, at the pixels' centres
	const w = Math.round(PW * PX), h = Math.round(PH * PX);
	const cv = document.createElement('canvas');
	cv.width = w; cv.height = h;
	const ctx = cv.getContext('2d');
	const img = ctx.createImageData(w, h);
	const Imap = new Float64Array(w * h), Vmap = new Float64Array(w * h);
	for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
		const az = AZ[0] + ((i + 0.5) / w) * (AZ[1] - AZ[0]), el = EL[1] - ((j + 0.5) / h) * (EL[1] - EL[0]);
		const d = N.dir(az, el);
		let I = 0, Vv = 0;
		for (const s of N.spots) {
			const cg = Math.min(1, dot(d, s.c));
			if (cg <= 0) continue;
			const x = N.k * Math.sqrt(Math.max(0, 1 - cg * cg));
			const a2 = airy(x) ** 2;
			I += s.I * a2; Vv += s.V * a2;
		}
		Imap[j * w + i] = I; Vmap[j * w + i] = Vv;
	}
	const Imax = Imap.reduce((m, v) => Math.max(m, v), 0);
	check(near(Imax, Math.max(...N.spots.map((s) => s.I)), 0.01 * Imax), `the picture's brightest point ${Imax}`);
	for (let q = 0; q < w * h; q++) {
		const shade = Math.sqrt(Math.min(1, Math.max(0, Imap[q] / Imax)));
		const col = scale(Vmap[q] / Math.max(Imap[q], 1e-300));
		for (let k = 0; k < 3; k++) img.data[4 * q + k] = Math.round(255 * (T3[k] * (1 - shade) + col[k] * shade));
		img.data[4 * q + 3] = 255;
	}
	ctx.putImageData(img, 0, 0);
	// the colours at the two centres are the scale's ends, at their brightness; the still pair's box is the bare ground
	const at = (az, el) => { const i = Math.floor(((az - AZ[0]) / (AZ[1] - AZ[0])) * w), j = Math.floor(((EL[1] - el) / (EL[1] - EL[0])) * h); return Array.from(img.data.slice(4 * (j * w + i), 4 * (j * w + i) + 3)); };
	const nearCol = (got, want, tol) => got.every((v, k) => Math.abs(v - want[k] * 255) <= tol);
	const over = (c, a) => c.map((v, k) => T3[k] + (v - T3[k]) * a);
	check(nearCol(at(0, N.spots[1].el), M3, 6), `the middle spot is not magenta: ${at(0, N.spots[1].el)}`);
	check(nearCol(at(0, N.spots[0].el), over(G3, Math.sqrt(N.spots[0].I / Imax)), 6), `the top spot is not green: ${at(0, N.spots[0].el)}`);
	check(nearCol(at(0, -13.7), T3, 12), 'the still pair\'s box is not the bare ground');
	// the picture, and a thin frame round it
	S.raw(`<image class="art" href="${cv.toDataURL('image/jpeg', 0.92)}" x="${n2(left)}" y="${n2(top)}" width="${n2(PW)}" height="${n2(PH)}" preserveAspectRatio="none"/>`, 0);
	S.raw(`<rect x="${n2(left)}" y="${n2(top)}" width="${n2(PW)}" height="${n2(PH)}" fill="none" stroke="${RULE}" stroke-width="${FRAME}"/>`, 0.1);
	S.mark([[left, top], [left + PW, top], [left + PW, top + PH], [left, top + PH], [left, top]], 0, 'the picture');

	// the axes, outside the picture
	const yA = top + PH + 1.2, xA = left - 1.2;
	S.path([[left, yA], [left + PW, yA]], { color: DIM, width: AXIS, cap: 'butt', what: 'the azimuth axis' });
	S.path([[xA, top], [xA, top + PH]], { color: DIM, width: AXIS, cap: 'butt', what: 'the elevation axis' });
	const sgn = (t) => (t < 0 ? `-${-t}` : String(t));
	for (const t of [-20, -10, 0, 10, 20]) {
		S.path([[XA(t), yA], [XA(t), yA + TICK]], { color: DIM, width: HAIR, cap: 'butt', what: `the azimuth tick ${t}` });
		L.push(await placed(sgn(t), XA(t), yA + TICK + NUM, 0.5, 0, DIM, SIZE));
		S.path([[xA, YE(t)], [xA - TICK, YE(t)]], { color: DIM, width: HAIR, cap: 'butt', what: `the elevation tick ${t}` });
		L.push(await placed(sgn(t), xA - TICK - NUM, YE(t), 1, 0.5, DIM, SIZE));
	}
	const azTitle = await placed('\\text{azimuth (degrees)}', XA(0), lowest() + 3.4, 0.5, 0, DIM, SIZE);
	L.push(azTitle);

	// the front faces' outlines: upright edges at constant azimuth, level edges at constant height
	for (const b of N.boxes) {
		const z = -b.front, y0 = b.y - b.half, y1 = b.y + b.half;
		const ring = [];
		const n = 120;
		for (let i = 0; i <= n; i++) ring.push(N.view([-b.w + (2 * b.w * i) / n, y1, z]));
		for (let i = 0; i <= n; i++) ring.push(N.view([b.w, y1 - ((y1 - y0) * i) / n, z]));
		for (let i = 0; i <= n; i++) ring.push(N.view([b.w - (2 * b.w * i) / n, y0, z]));
		for (let i = 0; i <= n; i++) ring.push(N.view([-b.w, y0 + ((y1 - y0) * i) / n, z]));
		const pts = ring.map(V);
		S.raw(`<path d="M${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="none" stroke="${ON_DIM}" stroke-width="${OUTLINE}" stroke-linejoin="round"/>`, 2);
		S.mark(pts, OUTLINE / 2, `the ${b.k} box's outline`);
		check(near(Math.abs(ring[n + 1][0]), 6.189, 5e-4), 'an upright edge is not at 6.19 degrees');
	}

	// the first dark rings, dashed, and the bracket at half height across the middle spot
	const around = (s, g, phi) => {
		// the direction at the angle g from the spot's centre c, at the position angle phi (0: towards +azimuth)
		const c = s.c, e1 = norm([-c[2], 0, c[0]]), e2 = norm([c[1] * e1[2] - c[2] * e1[1], c[2] * e1[0] - c[0] * e1[2], c[0] * e1[1] - c[1] * e1[0]]);
		const d = [0, 1, 2].map((k) => Math.cos(rad(g)) * c[k] + Math.sin(rad(g)) * (Math.cos(phi) * e1[k] + Math.sin(phi) * e2[k]));
		return [deg(Math.atan2(d[0], -d[2])), deg(Math.asin(d[1]))];
	};
	for (const s of N.spots) {
		const pts = Array.from({ length: 721 }, (_, i) => around(s, N.ring, (2 * Math.PI * i) / 720));
		for (const q of pts) { const d = N.dir(...q); check(near(deg(Math.acos(Math.min(1, dot(d, s.c)))), N.ring, 1e-9), 'a point of the ring is off it'); }
		check(near(around(s, N.ring, 0)[0], -around(s, N.ring, Math.PI)[0], 1e-9) && around(s, N.ring, 0)[0] > 0, 'the ring is not symmetric, or e1 does not point right');
		const page = pts.map(V);
		S.raw(`<path d="M${page.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${ON_INK}" stroke-width="${RING_W}" stroke-dasharray="${RING_DASH.join(' ')}"/>`, 2.1);
		S.mark(page, RING_W / 2, `the ring of the spot at ${s.el.toFixed(2)}`);
	}
	const mid = N.spots[1];
	const h0 = V(around(mid, N.half, Math.PI)), h1 = V(around(mid, N.half, 0));
	check(near(airy(N.k * Math.sin(rad(N.half))) ** 2, 0.5, 1e-12), 'the bracket\'s ends are not at half intensity');
	const hy = (h0[1] + h1[1]) / 2;
	S.path([[h0[0], hy], [h1[0], hy]], { color: WHITE, width: 0.5, cap: 'butt', layer: 3, what: 'the bracket' });
	for (const x of [h0[0], h1[0]]) S.path([[x, hy - 2], [x, hy + 2]], { color: WHITE, width: 0.5, cap: 'butt', layer: 3, what: 'the bracket\'s end' });
	const hl = await placed(`${(2 * N.half).toFixed(1)}^\\circ`, (h0[0] + h1[0]) / 2, hy + 2 + LABEL_GAP + 0.6, 0.5, 0, WHITE, SIZE);
	L.push(hl);

	// the words on the picture: V/I left of the turning pairs' boxes, the ring's name right of the top one, the still
	// box's words in it
	const edge = XA(6.19);
	for (const s of N.spots) {
		const v = s.vi < 0 ? `-${Math.abs(s.vi).toFixed(3)}` : `+${s.vi.toFixed(3)}`;
		L.push(await placed(`V/I = ${v}`, XA(-6.19) - 4.5, YE(s.el), 1, 0.5, ON_INK, SIZE));
	}
	if (!BOOK) {
		const r1 = await placed(`\\text{first dark ring ${N.ring.toFixed(1)}}^\\circ`, edge + 4.5, YE(N.spots[0].el) - 1.5, 0, 1, ON_INK, SIZE);
		const r2 = await placed(`\\text{(${(4.5 * Math.tan(rad(N.ring))).toFixed(2)} m on the shelf)}`, edge + 4.5, r1.box.b + 3, 0, 0, ON_INK, SIZE);
		L.push(r1, r2);
	} else {
		// the book's picture is narrower: the same words in three lines, the middle one level with the spot's centre
		const r2 = await placed(`${N.ring.toFixed(1)}^\\circ\\ \\text{(${(4.5 * Math.tan(rad(N.ring))).toFixed(2)} m}`, edge + 4.5, YE(N.spots[0].el), 0, 0.5, ON_INK, SIZE);
		const r1 = await placed('\\text{first dark ring}', edge + 4.5, r2.box.t - 3, 0, 1, ON_INK, SIZE);
		const r3 = await placed('\\text{on the shelf)}', edge + 4.5, r2.box.b + 3, 0, 0, ON_INK, SIZE);
		L.push(r1, r2, r3);
	}
	const sb = N.boxes[2];
	const stillAt = N.view([0, sb.y, -sb.front]);
	L.push(await placed('\\text{still: no wave}', XA(0), YE(stillAt[1]), 0.5, 0.5, ON_INK, SIZE));
	for (const g of L.slice(BOOK ? -7 : -6)) check(g.box.l > left + 1.5 && g.box.r < left + PW - 1.5 && g.box.t > top + 1.5, `the label ${g.src} leaves the picture`);

	// the true speed of light (lambda = 1.5e8 m at c = 3e8 m/s, no spot) is the caption's, not the drawing's
	void N.lambdaTrue;

	// ---- checks: the column (in the book, the two columns), and nothing touches
	const colR = BOOK ? xb + CW : x0 + CW;
	for (const g of L) check(g.box.l >= x0 - 0.01 && g.box.r <= colR + 0.01, `the label ${g.src} leaves the column`);
	for (const g of L) g.on = g.on ?? (g.box.t > top && g.box.b < top + PH && g.box.l > left && g.box.r < left + PW ? ['the picture'] : []);
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadIiiCapstone = { gap: [N.gapLow, N.gapHigh], phase: N.phase, ring: N.ring, fwhm: 2 * N.half, spots: N.spots.map(({ az, el, iota, vi, I }) => ({ az, el, iota, vi, I })), sag: N.sag, tilt: N.tilt };
	return finish(S, L, BOOK ? [380, 520] : [240, 340]);
}
