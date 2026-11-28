// The tutorial, section 5.5 (tutorial/waves/radiance.md), its fourth diagram: a thin lens and a mass as lenses. Two
// panels side by side, each with its axis (dim, finely dashed) at mid-height; x runs right and y up from the axis, in
// the comment's site pixels. Left, "a thin lens": a lens (the neutral tint, an ink outline) with a flat face at x = 60
// from y = -80 to 80 and a curved face x = 60 + 24 (1 - y^2/6400), so that R = 80 and h = 24 (exaggerated). Five rays
// (thin ink) at y = 0, +-40 and +-70 run level to the curved face, which they leave at x = 84, 78 and 65.6, and then
// straight to F = (284, 0), a dot named F. Two crests of the arriving wave, upright segments (dim) at x = 20 and 40,
// named "crests" under them, and two crests of the leaving wave, arcs about F, drawn between the two outer rays.
// Dimension lines (dim, a short stroke across each end): R from the axis to the rim and a from the axis to the lower
// outer ray, on one upright line
// left of the rays; h across the lens at y = 10, just over the axis, from the flat face to x = 84 (the face there
// lies 0.375 site pixels, 0.18 points, short of that: within its outline's stroke; asserted under a fifth of a point;
// at y = -20, as before, h's line ran 1.5 site pixels past the face and measured the lens away from its axis); f
// from the curved face's vertex to F. The lower outer ray, from the
// lens to F, is named f + a^2/2f. Under the panel, f = R^2/2(n - 1)h. Right, "a mass as a lens": a dot of mass M
// (matter's colour) on the axis at x = 40; three rays at b = 30, 45 and 60 over the axis and their mirror images under
// it run level to x = 40 and then straight through the axis at x = 40 + b^2/15 = 100, 175 and 280, each crossing
// marked by a tick; a dimension line from the mass to the farthest crossing is named f(b), and one from the axis up
// to that pair's upper ray, at x = -12 left of the rays as R and a are in the left panel, is named b (the formula
// under the panel uses it). Under the panel, f = b^2/2r_s. The lens's axis ends at x = 306, short of its panel's end,
// to leave b's line and name room between the panels.
// Departures from the diagram's comment: the comment's panels, 340 site pixels (179 points) each, are together wider
// than the site's 340 points; they stay side by side at 0.47 points to its pixel, so that the lens and the mass can be
// compared at one height. At that size the comment's places for the labels fail: R, between the crest at x = 40 and
// its line at x = 50, and a, between its line at x = 10 and the crest at x = 20, would touch the crests; h, under its
// line at y = -20, has 9.8 points between that line and the ray at -40 for a letter that needs 10.6; and f + a^2/2f,
// between the rays at +40 and +70, has 6 points of room for a label 9 points tall. So R and a are measured on one
// upright line at x = -12, left of the rays (R up to the rim; a down to the lower outer ray, a = 70), h is named
// beyond the lens's vertex, its foot level with the top of its line's end tick (beside its line, at 10 site pixels
// over the axis, it would crowd the ray on the axis), F to the right of the focus, and the lower outer ray carries
// f + a^2/2f under it, where nothing else is drawn. The arcs have the radii 160 and 90 (the comment's 180 and 110 put
// the larger arc within 10 points of the lens's vertex, too close for h's name). The mass's f(b) is a dimension line
// under the rays, as f is
// in the left panel, since under the farthest tick the rays leave 15 points for a label that needs 18; the rays end
// where they leave the panel's height, +-80, or at x = 330, whichever comes first (the ray at b = 30 would reach -115
// at x = 330).
// Whether the rays meet at F: the drawn face, with the index n = 5/3 that f = R^2/2(n - 1)h gives for f = 200, sends a
// ray near the axis, traced by Snell's law, through F (asserted); the drawing shows the thin lens of the text, each ray
// bent at its exit point straight to F, and the arcs about F are true crests of that lens to within the difference
// between the path sqrt(f^2 + a^2) - f and the text's a^2/2f, 0.35 site pixels (0.16 points) at the outer rays
// (asserted in tut-rad-lib.js). The lens is drawn as the text gives it: traced exactly by Snell's law, this thick
// parabola would send its outer rays across the axis at 268 and 230; an exact focus for a thick lens needs a
// hyperbolic face, which differs from this parabola by 0.6 site pixels (0.3 points) at most.
// Exact: the lens's faces, the exit points (asserted), F, the rays (each asserted to pass through F), the arcs (points
// at their radii from F, their ends on the outer rays, asserted), the mass's rays and their crossings at 40 + b^2/15
// (asserted). Schematic: the lens's thickness and all the angles, greatly exaggerated, as the caption says, the arcs'
// radii and the size of the mass's dot.
import { Sheet, ORIGIN, finish, checker, placed, near, HAIR, LINE, LABEL_GAP, AXIS, TICK } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { longest } from './tut-fourier-lib.js';
import { ZERO_DASH, DOT } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, measure, face, thick, LENS, RAYS, IMPACTS, MASS, crossing, TINT, MATTER } from './tut-rad-lib.js';

const name = 'tut-rad-lenses';
const check = checker(name);

const K = 0.47;                            // points per site pixel of the comment
const WIDTH = 330;                         // a panel's axis, site pixels
const APART = 22;                          // from the left panel's right end to the right panel's left end
const HALF = 80;                           // the panels' half-height: the lens's rim, and where the mass's rays stop
const CRESTS_IN = [20, 40];                // the arriving wave's crests
const ARCS = [160, 90];                    // the leaving wave's crests, radii about F
const RAY = HAIR + 0.1;                    // a ray's stroke
const LENS_END = 306;                      // where the lens's axis ends
const DIMX = -12;                          // the upright dimension line of R and a
const H_AT = 10;                           // the dimension line of h, just over the axis
const F_AT = -100;                         // the dimension line of f
const DOT_R = 6;                           // the mass's dot, site pixels

export default async function () {
	const nums = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const X0 = ORIGIN - (K * (2 * WIDTH + APART)) / 2;
	const panel = (i) => ([x, y]) => [X0 + K * (x + i * (WIDTH + APART)), ORIGIN - K * y];
	const A = panel(0), B = panel(1);
	const dist = (p, a, b) => Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / Math.hypot(b[0] - a[0], b[1] - a[1]);

	// ---- the axes
	// (the lens's axis stops at LENS_END, short of the panel's end, to leave the mass's b room between the panels)
	for (const [P, k, end] of [[A, 'lens', LENS_END], [B, 'mass', WIDTH]]) S.path([P([0, 0]), P([end, 0])], { color: DIM, width: AXIS, dash: ZERO_DASH, layer: 0.5, cap: 'butt', what: `the axis (${k})` });

	// ---- the thin lens: its outline, the flat face and the curved one sampled finely
	const F = [LENS.F, 0];
	const curved = [];
	for (let i = 0; i <= 320; i++) { const y = HALF - i * (2 * HALF / 320); curved.push([face(y), y]); }
	check(near(face(HALF), LENS.flat, 1e-12) && near(face(-HALF), LENS.flat, 1e-12) && near(thick(0), LENS.h, 1e-12), 'the lens\'s rim and thickness');
	const outline = [[LENS.flat, -HALF], ...curved.slice().reverse()].map(A);
	check(longest(curved.map(A)) <= 0.3, 'the curved face is coarse');
	S.raw(`<path d="${pathOf(outline)}" fill="${TINT}"/>`, 0.2);
	S.path(outline, { color: INK, width: LINE, layer: 2, closed: true, what: 'the lens' });

	// ---- the rays: level to the curved face, then straight to F
	for (const a of RAYS) for (const s of a === 0 ? [1] : [1, -1]) {
		const y = s * a, e = [face(y), y];
		check(near(e[0], nums.exits[RAYS.indexOf(a)], 1e-12), `the exit point at ${y}`);
		check(dist(F, e, F) < 1e-12, `the ray at ${y} misses F`);
		S.path([A([0, y]), A(e), A(F)], { color: INK, width: RAY, layer: 3, cap: 'butt', what: `the ray at ${y}` });
	}
	// F: a dot
	{
		const [x, y] = A(F);
		S.raw(`<circle cx="${x}" cy="${y}" r="${DOT * 1.3}" fill="${INK}"/>`, 4);
		S.mark([[x, y]], DOT * 1.3, 'F');
	}
	// ---- the crests: upright before the lens, arcs about F after it, between the outer rays
	for (const x of CRESTS_IN) S.path([A([x, -HALF]), A([x, HALF])], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the crest at ${x}` });
	check(near(LENS.flat + LENS.h - face(H_AT), LENS.h * (H_AT / LENS.R) ** 2, 1e-12) && K * (LENS.flat + LENS.h - face(H_AT)) < 0.2, 'h\'s line runs past the face by more than a fifth of a point');
	{
		const outer = [face(70), 70];
		const half = Math.atan2(70, F[0] - outer[0]);
		for (const r of ARCS) {
			const pts = [];
			const n = Math.ceil((2 * half * r * K) / 0.2);
			for (let i = 0; i <= n; i++) { const t = -half + (2 * half * i) / n; pts.push([F[0] - r * Math.cos(t), r * Math.sin(t)]); }
			for (const p of pts) check(near(Math.hypot(p[0] - F[0], p[1] - F[1]), r, 1e-9), `the arc of radius ${r}`);
			check(dist(pts[0], [outer[0], -70], F) < 1e-9 && dist(pts[n], outer, F) < 1e-9, `the arc of radius ${r} does not end on the outer rays`);
			check(r < Math.hypot(F[0] - outer[0], 70), `the arc of radius ${r} lies beyond the lens`);
			const page = pts.map(A);
			check(longest(page) <= 0.2501, `the arc of radius ${r} is coarse`);
			S.path(page, { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the arc of radius ${r}` });
		}
	}
	// ---- the dimension lines
	measure(S, A([DIMX, 0]), A([DIMX, HALF]), { color: DIM, what: 'R' });
	measure(S, A([DIMX, 0]), A([DIMX, -70]), { color: DIM, what: 'a' });
	measure(S, A([LENS.flat, H_AT]), A([face(0), H_AT]), { color: DIM, what: 'h' });
	measure(S, A([face(0), F_AT]), A([F[0], F_AT]), { color: DIM, what: 'f' });
	check(near(F[0] - face(0), nums.focal, 1e-12), 'f is not the vertex to F');

	// ---- the mass as a lens
	{
		const [x, y] = B([MASS.x, 0]), r = K * DOT_R;
		S.raw(`<circle cx="${x}" cy="${y}" r="${r}" fill="${MATTER}"/>`, 3);
		S.mark([[x, y]], r, 'the mass');
	}
	for (const b of IMPACTS) for (const s of [1, -1]) {
		const x1 = crossing(b);
		check(near(x1, nums.crossings[IMPACTS.indexOf(b)], 1e-12), `the crossing of b = ${b}`);
		// straight from (40, s b) through (x1, 0), on to x = 330 or to the panel's height
		const slope = -s * b / (x1 - MASS.x);
		let xe = WIDTH, ye = s * b + slope * (WIDTH - MASS.x);
		if (Math.abs(ye) > HALF) { ye = Math.sign(ye) * HALF; xe = MASS.x + (ye - s * b) / slope; }
		check(dist([x1, 0], [MASS.x, s * b], [xe, ye]) < 1e-9 && xe > x1, `the ray at b = ${s * b} does not cross at ${x1}`);
		S.path([B([0, s * b]), B([MASS.x, s * b]), B([xe, ye])], { color: INK, width: RAY, layer: 3, cap: 'butt', what: `the ray at b = ${s * b}` });
	}
	// b for the farthest pair, from the axis up to its ray, left of the rays, as R and a in the left panel
	measure(S, B([DIMX, 0]), B([DIMX, IMPACTS[2]]), { color: DIM, what: 'b' });
	// f(b) for the farthest pair, from the mass to its crossing, as f in the left panel
	measure(S, B([MASS.x, F_AT]), B([crossing(IMPACTS[2]), F_AT]), { color: DIM, what: 'f(b)' });
	for (const b of IMPACTS) { const [x, y] = B([crossing(b), 0]); S.path([[x, y - TICK], [x, y + TICK]], { color: INK, width: HAIR + 0.1, layer: 3.5, cap: 'butt', what: `the tick at ${crossing(b)}` }); }

	// ---- the labels
	const titleY = A([0, HALF])[1] - 9;
	L.push(await placed('\\text{a thin lens}', A([WIDTH / 2, 0])[0], titleY, 0.5, 1, INK));
	L.push(await placed('\\text{a mass as a lens}', B([WIDTH / 2, 0])[0], titleY, 0.5, 1, INK));
	{
		const [x, y] = A([DIMX, HALF / 2]);
		L.push(await S.clear('R', x - LABEL_GAP - 0.4, y, 1, 0.5, [-1, 0], { color: DIM }));
		const [x2, y2] = A([DIMX, -35]);
		L.push(await S.clear('a', x2 - LABEL_GAP - 0.4, y2, 1, 0.5, [-1, 0], { color: DIM }));
		// h beyond the lens's vertex, its foot level with the top of its line's end tick (beside the line it would
		// crowd the ray on the axis)
		const [x3, y3] = A([face(0), H_AT]);
		L.push(await S.clear('h', x3 + LABEL_GAP + 0.6, y3 - TICK, 0, 1, [1, 0], { color: DIM }));
		// the arriving crests named under them
		{ const [xc, yc] = A([(CRESTS_IN[0] + CRESTS_IN[1]) / 2, -HALF]); L.push(await S.clear('\\text{crests}', xc, yc + LABEL_GAP + 0.4, 0.5, 0, [0, 1], { color: DIM })); }
		const [x4, y4] = A([(face(0) + F[0]) / 2, F_AT]);
		L.push(await S.clear('f', x4, y4 + TICK + LABEL_GAP, 0.5, 0, [0, 1], { color: DIM }));
		const [x5, y5] = A(F);
		L.push(await S.clear('F', x5 + LABEL_GAP + 1, y5 + LABEL_GAP + 0.5, 0, 0, [1, 1].map((v) => v / Math.SQRT2), { color: INK }));
		// f + a^2/2f under the middle of the lower outer ray, from its exit point to F
		const e = [face(70), -70], m = A([(e[0] + F[0]) / 2, (e[1] + F[1]) / 2]);
		L.push(await S.clear('f + a^2/2f', m[0], m[1] + LABEL_GAP + 1, 0.5, 0, [0, 1], { color: INK }));
	}
	{
		const [x, y] = B([(MASS.x + crossing(IMPACTS[2])) / 2, F_AT]);
		L.push(await S.clear('f(b)', x, y + TICK + LABEL_GAP, 0.5, 0, [0, 1], { color: DIM }));
		const [xb, yb] = B([DIMX, IMPACTS[2] / 2]);
		L.push(await S.clear('b', xb - LABEL_GAP - 0.4, yb, 1, 0.5, [-1, 0], { color: DIM }));
		const [xm, ym] = B([MASS.x, 0]);
		L.push(await S.clear('M', xm - K * DOT_R - LABEL_GAP, ym - LABEL_GAP - 0.7, 1, 1, [-1, 0], { color: INK }));
	}
	// the formulas, under each panel, on one line
	{
		const low = Math.max(...L.map((l) => l.box.b), ...S.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)));
		L.push(await placed('f = R^2/2(n - 1)h', A([WIDTH / 2, 0])[0], low + 7, 0.5, 0, INK));
		L.push(await placed('f = b^2/2r_{\\mathrm s}', B([WIDTH / 2, 0])[0], low + 7, 0.5, 0, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [240, 340]);
}
