// The tutorial, chapter 5.3 (tutorial/waves/diffraction.md), its third diagram: a near source needs the delays from a
// point. Two panels, one above the other, on one scale, 150 points to the metre. In each, the array, sixteen small
// squares (ink) 0.1 m apart, 1.5 m from the first to the last, along a horizontal line, centred on its axis (dotted,
// dim), which runs up to an arrow toward the source, named with its distance. Top, "near": the source 4.5 m away; one
// front of its wave, the arc of the circle of radius 4.5 m about the source through the array's centre (first accent,
// solid), and the straight line tangent to it there, the plane front (dim, dashed), both drawn 0.1 m beyond the rims;
// from the right-hand rim's pixel along the ray to the source, a segment (first accent) up to the arc, the gap
// sqrt(4.5^2 + 0.75^2) - 4.5 = 0.062 m = 0.62 lambda, named so. Bottom, "far": the source 225 m away; its front through
// the centre, the arc of radius 225 m, which at this scale lies on its tangent (0.2 pt from it at the rims), drawn as
// one solid line in the first accent and named with its gap at the rim, 1.25 mm = 0.0125 lambda. Under each array a
// bar one wavelength, 10 cm, long.
// Departures from the diagram's comment: the comment set the panels side by side at 400 site pixels (210 points) to
// the metre; side by side at that scale they would be about 630 points wide, more than the site's 340. Stacked, they
// keep most of the comment's scale (150 points to the metre), so that the near gap is 9.3 points and plain. The gap is
// marked along the ray from the rim's pixel to the source, not vertically: along the ray its length is exactly the
// difference of path sqrt(r^2 + a^2) - r of the text and of the label, whereas a vertical bracket would measure the
// arc's height over the tangent, 0.0629 m. The fronts run 0.1 m beyond the rims, so that the plane front's name can
// stand at its end.
// Exact: every length, to scale (asserted): the pixels' places, both arcs (points on circles of radius 4.5 m and 225 m
// about their sources, sampled every quarter of a point at most), the tangent, the gap segment (its foot at the rim's
// pixel, its top on the arc, its length 0.0621 m, on the ray to the source), the bars. Nothing is schematic except
// that the sources themselves lie far off the page.
import { Sheet, ORIGIN, finish, checker, placed, near, HAIR, TICK, LABEL_GAP, AXIS, AXIS_HEAD } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { longest } from './tut-fourier-lib.js';
import { DASH, INK, DIM, ACCENT } from './tut-bessel-lib.js';
import { chapter, gap, LAMBDA, WIDTH, NEAR, FAR } from './tut-das-lib.js';

const name = 'tut-das-fresnel';
const check = checker(name);

const SCALE = 150;                        // points per metre, both panels
const PIXELS = 16, PITCH = 0.1;           // the array: sixteen pixels 0.1 m apart, 1.5 m from first to last
const SQ = 2.6;                           // a pixel's side, points
const BEYOND = 0.1;                       // the fronts run this far beyond the rims, metres
const FRONT = 0.7;                        // a front's stroke
const GAP_W = HAIR + 0.25;                // the gap segment's stroke
const AXIS_BELOW = 7;                     // the axis starts this far below the row, points
const RISE = 38;                          // the axis's arrow ends this far above the row, points
const ARROW = 11;                         // and is this long
const BAR_DROP = 9;                       // the wavelength's bar, this far below the row, points
const APART = 16;                         // the air between the two panels' ink, points

export default async function () {
	const n = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const half = WIDTH / 2;
	check(near((PIXELS - 1) * PITCH, WIDTH, 1e-12), 'the array is not 1.5 m from its first pixel to its last');

	/** One panel, its row at the page height y0; r the source's distance. Returns the lowest ink's height. */
	async function panel(y0, r, title, nearPanel) {
		const cx = ORIGIN;
		const P = ([a, y]) => [cx + a * SCALE, y0 - y * SCALE];
		// the axis, dotted, from under the row up to the arrow toward the source
		S.dots([cx, y0 + AXIS_BELOW], [cx, y0 - RISE + ARROW], { color: DIM, what: `the axis (${title})` });
		const arr = S.arrow([cx, y0 - RISE + ARROW], [cx, y0 - RISE], { color: INK, width: AXIS + 0.1, head: AXIS_HEAD, layer: 3, what: `the arrow to the source (${title})` });
		check(arr.head <= 0.4 * arr.L, 'the arrow\'s head');
		L.push(await placed(`\\text{source ${r} m away}`, cx + LABEL_GAP + 1.4, y0 - RISE + 0.6, 0, 0, INK));

		// the front: the circle of radius r about the source (0, r) through the centre, y = r - sqrt(r^2 - a^2)
		const front = (a) => r - Math.sqrt(r * r - a * a);
		const m = Math.ceil((2 * (half + BEYOND) * SCALE) / 0.2);
		const arc = Array.from({ length: m + 1 }, (_, i) => { const a = -(half + BEYOND) + (2 * (half + BEYOND) * i) / m; return [a, front(a)]; });
		for (const [a, y] of arc) check(near(Math.hypot(a, y - r), r, 1e-9), `the front of radius ${r} is off its circle`);
		const page = arc.map(P);
		check(longest(page) <= 0.25, 'the front is coarse');
		S.path(page, { color: ACCENT, width: FRONT, layer: 2, cap: 'butt', what: `the front (${title})` });
		if (nearPanel) {
			// the plane front, the tangent at the centre
			const ends = [P([-(half + BEYOND), 0]), P([half + BEYOND, 0])];
			S.path(ends, { color: DIM, width: HAIR + 0.1, layer: 1.8, dash: DASH, cap: 'butt', what: 'the plane front' });
			L.push(await placed('\\text{plane front}', ends[0][0] - LABEL_GAP - 0.6, y0, 1, 0.5, DIM));
		}
		// the far front stands within a quarter of a point of its tangent over the whole width
		if (!nearPanel) check(front(half + BEYOND) * SCALE < 0.4 && front(half) * SCALE < 0.21, 'the far front is visibly curved');

		// the pixels, over the lines
		for (let i = 0; i < PIXELS; i++) {
			const [x, y] = P([-half + i * PITCH, 0]);
			const box = { l: x - SQ / 2, r: x + SQ / 2, t: y - SQ / 2, b: y + SQ / 2 };
			S.fill(pathOf([[box.l, box.t], [box.r, box.t], [box.r, box.b], [box.l, box.b]]), box, { color: INK, layer: 3, what: `pixel ${i} (${title})` });
		}

		// the gap at the right-hand rim, along the ray from the rim's pixel to the source
		const g = gap(r, half);
		const u = [-half / Math.hypot(half, r), r / Math.hypot(half, r)];
		const top = [half + g * u[0], g * u[1]];
		check(near(Math.hypot(top[0], top[1] - r), r, 1e-12), 'the gap\'s top is not on the front');
		check(near(Math.hypot(half, r) - Math.hypot(top[0] - half, top[1]), r, 1e-12), 'the gap is not the difference of path');
		if (nearPanel) {
			const A = P([half, 0]), B = P(top);
			check(near(Math.hypot(B[0] - A[0], B[1] - A[1]), g * SCALE, 1e-9) && (g * SCALE).toFixed(1) === '9.3', `the gap is ${g * SCALE} pt`);
			S.path([A, B], { color: ACCENT, width: GAP_W, layer: 2.5, cap: 'butt', what: 'the gap' });
			L.push(await S.clear('0.062\\,\\text{m} = 0.62\\lambda', B[0] + 1, B[1] - LABEL_GAP - 1.5, 0.5, 1, [0, -1], { color: ACCENT }));
		} else {
			check((g * 1e3).toFixed(2) === '1.25', 'the far gap');
			const B = P([half, front(half)]);
			L.push(await S.clear('\\text{gap } 1.25\\,\\text{mm} = 0.0125\\lambda', B[0] + 1, B[1] - LABEL_GAP - 1.5, 0.5, 1, [0, -1], { color: ACCENT }));
		}

		// the panel's name, at the upper left
		L.push(await placed(`\\text{${title}}`, cx - (half + BEYOND) * SCALE, y0 - RISE + 0.6, 0, 0, INK));

		// one wavelength, under the row at the left
		const a = P([-half, 0]), yb = y0 + BAR_DROP;
		const b0 = [a[0], yb], b1 = [a[0] + LAMBDA * SCALE, yb];
		check(near(b1[0] - b0[0], 15, 1e-9), 'the bar is not 10 cm at 150 points to the metre');
		S.path([b0, b1], { color: INK, width: HAIR + 0.15, layer: 3, cap: 'butt', what: `the bar (${title})` });
		for (const e of [b0, b1]) S.path([[e[0], e[1] - TICK], [e[0], e[1] + TICK]], { color: INK, width: HAIR + 0.15, layer: 3, cap: 'butt', what: `the bar's end (${title})` });
		const bl = await placed('\\lambda = 10\\,\\text{cm}', b1[0] + LABEL_GAP + 1, yb, 0, 0.5, INK);
		L.push(bl);
		return Math.max(bl.box.b, yb + TICK, y0 + AXIS_BELOW);
	}

	const y1 = ORIGIN - 60;
	const bottom = await panel(y1, NEAR, 'near', true);
	// the far panel's highest ink, its name and the arrow, sits APART below the near panel's lowest
	const y2 = bottom + APART + RISE;
	await panel(y2, FAR, 'far', false);

	S.checkAll(L);
	window[name + '-numbers'] = { ...n, scale: SCALE, nearGap: n.g1 * SCALE, farGap: n.g2 * SCALE };
	return finish(S, L, [240, 340]);
}
