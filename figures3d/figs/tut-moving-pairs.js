// The tutorial, section 9.4 (tutorial/one-point/petrov.md), its third diagram: a moving body's two pairs of principal
// null directions, their half sum and their half difference. The sky around a small grey pixel, drawn as section 8.4
// draws it (figs/tut-spin-lib.js, after section 6.6 and the paper's fig:stars): a thin outline, a veil over what lies
// behind, and the great circle z = 0, faint, solid in front and dashed behind. A stone body outside the sky along -x,
// moving along +y, an arrow in the observer's colour, "v = 0.9c", drawn at the scale of the half sum. The two pairs at
// rest, +-x, as open circles, two touching each; the aberrated pairs at (+-0.436, 0.9, 0) as filled dots in the
// curvature's colour, two touching each, with thin paths from each open circle to its pair along the great circle;
// a thin dashed line between the two pairs. From the pixel, an arrow in the observer's colour to their midpoint,
// (0, 0.9, 0), named "1/2(p+ + p-) = v_perp/c"; a thin ink arrow from the midpoint to the pair p+, named
// "1/2(p+ - p-)", parallel to the dashed ink line from the pixel to the body's present position, named "n, now".
// Departures from the diagram's comment: the dots are in the curvature's colour (as section 8.4's Majorana stars, the
// same directions), not the accent colour, which on this site is orange and means a stretch; the view is the paper's
// turned by 35 degrees instead of 25 and seen from 45 degrees above the plane of the motion instead of 14, so that the
// pairs and the places at rest, which lie in that plane, stand clear of the sky's outline (from the paper's view the
// pair p- falls on it); the open circles and
// the paths are as fig:stars and section 6.6 draw them, and, as there, a thin dashed line joins the two pairs, so that
// their midpoint, where the arrow from the pixel ends, can be seen as the middle of the two; the great circle z = 0 on
// which the paths lie is drawn faint; the half sum's name is set on two lines, to fit between the arrow and the sky's
// edge; the sky's outline is the page's rule colour, as in every sky of the tutorial. The paths are drawn in the dim
// grey, not ink, so that they cannot be read as the half difference's arrow; the two pairs are named p+ (left of its
// dots, where no path runs) and p- (over its own); the half difference's name sits just over its short arrow, across
// the faint great circle, on a patch of the veil's own tint that hides the circle's few points under the letters. A
// key at the lower left, under the body, says what the open circles, the filled dots and the grey paths are, each with
// a sample drawn as in the sky.
// In the printed book (figureLayout 'book') the sky's radius is 92 points instead of 104, which keeps every pair at
// least 3 points inside the outline (asserted), so that the drawing is not printed larger than it needs; the labels
// keep their size.
// Exact: the four directions at 0.9c, the roots of the quartic of Lambda W Lambda^T for the body's reading at rest
// W = w (1 - 3 n0 n0^T) (n0 = -x) and section 9.3's boost Lambda = exp(-i eta u.L) of the pixel through the body's
// frame (u = -y, tanh eta = 0.9), and the paths, the roots at every speed from 0 to 0.9c, all on z = 0 (asserted in
// figs/tut-petrov-lib.js against the chapter's text, the paper's eq:proof-stars and its figure data); the half sum
// (0, 0.9, 0), the half difference (-0.436, 0, 0) along the line to the body's present position, -x (the body
// moves across that line, so its present position is its place at rest); the arrow v at the half sum's scale; one
// orthographic view. Schematic: the body's distance on the page (1.5 sky radii, the chapter's 1.5 in the sky's unit)
// is exact, its size is not; the sizes of the dots and the pixel. Pictorial: the stone, the picture of the published
// tutorial figures (sprites/hair/ball-face.png) lit as a sphere by the studio of lib.js, as in tut-one-point-hero.js.
import { Sheet, ORIGIN, finish, checker, near, n2, placed, LABEL_GAP, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { dashed, STONE_INK } from './tut-orb-lib.js';
import { INK, DIM, PAGE, sprite } from '../lib.js';
import { MARGIN } from '../stone.js';
import { sky, palette, CURV, STAR, STAR_STEP, STAR_EDGE, CIRCLE, SKY, VEIL } from './tut-spin-lib.js';
import { OBS } from './tut-quantum-lib.js';
import { viewer } from './tut-maxwell-lib.js';
import { STEEL } from './tut-five-lib.js';
import { chapter, BODY, dot, cross, len } from './tut-petrov-lib.js';

const name = 'tut-moving-pairs';
const check = checker(name);

const BOOK = globalThis.figureLayout === 'book';
const R = BOOK ? 92 : 104;                 // the sky's radius, points (smaller in the printed book)
const TURN = 35, TILT = 45;                // the view: the paper's turn about the vertical, then a tilt about the horizontal
const PIXEL = 2.6;                         // the pixel's radius
const BODY_R = 9;                          // the body's radius, points
const PATH = 0.5;                          // the paths
const LINE_W = 0.45, LINE_DASH = [1.4, 1.6];   // the dashed lines: to the body, between the pairs (the paper's)
const OPEN_W = STAR_EDGE + 0.1;            // an open circle's stroke
const THIN = 0.55, THIN_HEAD = 3.6;        // the half difference's arrow
const MID = 2.6;                           // the air at the midpoint between the half sum's tip and the lines that leave it
const CLEAR = 1.2;                         // the air between a line's end and a dot, the pixel or the body
const KEY_DROP = 12, KEY_PITCH = 11, KEY_TEXT = 4;   // the key: from the body's foot to its first row, row to row, sample to text

// the veil's tint over the page, as one colour: SKY at the veil's opacity over white
const VEILED = '#' + [1, 3, 5].map((i) => Math.round(VEIL * parseInt(SKY.slice(i, i + 2), 16) + (1 - VEIL) * 255).toString(16).padStart(2, '0')).join('');
const rgbDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit3 = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const KEY = unit3([-0.55, 0.72, 0.62]), FILL = unit3([0.85, -0.15, 0.5]), HALF = unit3([KEY[0], KEY[1], KEY[2] + 1]);

export default async function () {
	const nums = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	let defs = '';
	const v = viewer(TURN, TILT);
	const c = [ORIGIN, ORIGIN];
	const K = sky(S, check, c, R, v);
	const { at, front } = K;
	const C = at([0, 0, 0]);
	const s = STAR * STAR_STEP;
	const toward = (a, b, d) => { const u = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...u); return [a[0] + (u[0] / l) * d, a[1] + (u[1] / l) * d]; };

	// ---- behind and the veil: the great circle z = 0, then the veil and the outline
	K.runs(Array.from({ length: 721 }, (_, k) => [Math.cos((k * Math.PI) / 360), Math.sin((k * Math.PI) / 360), 0]), 'the great circle z = 0');
	K.veil();

	// ---- the paths, from the places at rest to the pairs at 0.9c, along the great circle
	const pairs = nums.moving;                       // [p+, p-]: p+ on the body's side
	check(pairs[0].n[0] < 0 && pairs[1].n[0] > 0, 'p+ is not the pair on the body\'s side');
	for (const side of [0, 1]) {
		const pts = nums.track.map((t) => t.pairs[side].n);
		check(pts.every((p) => near(p[2], 0, 1e-7)), 'a path is off the great circle');
		K.runs(pts.map((p) => { const l = len(p); return p.map((x) => x / l); }), `the path ${side ? 'of p-' : 'of p+'}`, { color: DIM, width: PATH, layer: 3, opacity: 1 });
	}
	// ---- the open circles at rest, two touching each
	const rest = nums.track[0].pairs.map((g) => g.n);
	const openAt = (n, what) => [[-s, 0], [s, 0]].map((o, k) => K.dot(n, STAR, { fill: PAGE, stroke: CURV, width: OPEN_W, offset: o, what: `${what}, circle ${k}` }));
	const restDots = rest.map((n, i) => openAt(n, `the place at rest ${i ? '+x' : '-x'}`));
	check(near(rest[0][0], -1, 1e-7) && near(rest[1][0], 1, 1e-7) && front(rest[0]) && !front(rest[1]), 'the places at rest');
	// ---- the pairs at 0.9c
	const pairDots = pairs.map((g, i) => [[-s, 0], [s, 0]].map((o, k) => K.dot(g.n, STAR, { fill: CURV, offset: o, what: `the pair ${i ? 'p-' : 'p+'}, dot ${k}` })));
	check(pairs.every((g) => front(g.n)), 'a pair at 0.9c lies behind');
	const reach = s + STAR + STAR_EDGE / 2;
	for (const g of [...pairs.map((p) => p.n), rest[0]]) {
		const q = at(g), rim = R - Math.hypot(q[0] - c[0], q[1] - c[1]) - reach;
		check(rim >= 3, `a pair is ${rim.toFixed(2)} pt from the outline`);
	}

	// ---- the pixel
	S.sphere(C, PIXEL, STEEL, { spec: 0.5, layer: 4 }, 'the pixel');

	// ---- the body, lit stone, and the dashed line to it from the pixel, which passes the place at rest -x
	const face = await sprite('/figures3d/sprites/hair/ball-face.png');
	defs += `<image id="${name}-mass" class="art" href="${await litBall(face, 360)}" x="-1" y="-1" width="2" height="2" preserveAspectRatio="none"/>`;
	const B = at(BODY.at);
	check(front(BODY.at) && Math.hypot(B[0] - c[0], B[1] - c[1]) - BODY_R > R + 6, 'the body is not outside the sky, in front');
	defs += `<clipPath id="${name}-clip"><circle cx="${n2(B[0])}" cy="${n2(B[1])}" r="${BODY_R}"/></clipPath>`;
	S.raw(`<g clip-path="url(#${name}-clip)"><use href="#${name}-mass" transform="translate(${n2(B[0])},${n2(B[1])}) scale(${BODY_R})"/></g><circle cx="${n2(B[0])}" cy="${n2(B[1])}" r="${BODY_R}" fill="none" stroke="${STONE_INK}" stroke-width="0.4"/>`, 4);
	S.mark([B], BODY_R, 'the body');
	const restMarks = restDots[0];
	const clash = (q, gap) => restMarks.some((p) => Math.hypot(q[0] - p[0], q[1] - p[1]) < STAR + OPEN_W / 2 + gap);
	const line = { a: toward(C, B, PIXEL + CLEAR), b: toward(B, C, BODY_R + CLEAR) };
	dashed(S, line.a, line.b, { clash, color: INK, width: LINE_W, dash: LINE_DASH, layer: 1.5, what: 'the line to the body' });

	// ---- the velocity: from the body along +y, at the half sum's scale
	const half = nums.half, tipHalf = at(half);
	const vTip = at(BODY.at.map((x, i) => x + BODY.speed * BODY.moves[i]));
	check(near(Math.hypot(vTip[0] - B[0], vTip[1] - B[1]), Math.hypot(tipHalf[0] - C[0], tipHalf[1] - C[1]), 1e-4), 'the velocity is not drawn at the half sum\'s scale');
	const va = S.arrow(toward(B, vTip, BODY_R + CLEAR), vTip, { color: OBS, width: VEC - 0.1, head: VEC_HEAD, layer: 4, what: 'the velocity' });
	check(near(va.u[0], 0, 1e-9) && va.u[1] < 0, 'the velocity is not up the page');

	// ---- the dashed line between the pairs, from p- to the midpoint; the half sum; the half difference
	const pP = at(pairs[0].n), pM = at(pairs[1].n);
	check(near((pP[0] + pM[0]) / 2, tipHalf[0], 1e-6) && near((pP[1] + pM[1]) / 2, tipHalf[1], 1e-6), 'the midpoint is not the half sum\'s tip');
	const hs = S.arrow(toward(C, tipHalf, PIXEL + CLEAR), tipHalf, { color: OBS, width: VEC - 0.1, head: VEC_HEAD, layer: 4.5, what: 'the half sum' });
	dashed(S, toward(pM, tipHalf, reach + CLEAR), toward(tipHalf, pM, MID), { color: DIM, width: CIRCLE, dash: LINE_DASH, layer: 2, what: 'the line between the pairs' });
	const hd = S.arrow(toward(tipHalf, pP, MID), toward(pP, tipHalf, reach + CLEAR), { color: INK, width: THIN, head: THIN_HEAD, layer: 4.5, what: 'the half difference' });
	// the lines that leave the midpoint clear the half sum's head
	{
		const head = S.marks.find((m) => m.what === 'the half sum\'s head').pts;
		for (const what of ['the half difference', 'the line between the pairs']) for (const m of S.marks.filter((q) => q.what.startsWith(what) && !q.what.endsWith('head'))) {
			const q = m.pts[0], least = Math.min(...head.slice(0, 3).map((h, i) => {
				const a = h, b = head[(i + 1) % 3], e = [b[0] - a[0], b[1] - a[1]], l2 = e[0] ** 2 + e[1] ** 2;
				const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * e[0] + (q[1] - a[1]) * e[1]) / l2));
				return Math.hypot(q[0] - a[0] - t * e[0], q[1] - a[1] - t * e[1]);
			})) - m.r;
			check(least >= 1, `${m.what} is ${least.toFixed(2)} pt from the half sum's head`);
		}
	}
	// the half difference is parallel to the line to the body, and in the same sense
	{
		const u = [B[0] - C[0], B[1] - C[1]], l = Math.hypot(...u);
		check(near(hd.u[0], u[0] / l, 1e-6) && near(hd.u[1], u[1] / l, 1e-6), 'the half difference is not parallel to the line to the body');
		check(len(cross(nums.diff, nums.now)) < 1e-7 && dot(nums.diff, nums.now) > 0, 'the half difference does not point toward the body');
	}

	// ---- the names
	const mid = (A) => [(A.A[0] + A.B[0]) / 2, (A.A[1] + A.B[1]) / 2];
	{
		const m = mid(va);
		check(String(BODY.speed) === '0.9', 'the printed speed');
		L.push(await S.clear(`v = ${BODY.speed}c`, m[0] - LABEL_GAP - 1, m[1], 1, 0.5, [-1, 0], { color: OBS }));
	}
	{
		const m = mid(hs);
		L.push(await S.clear('\\begin{array}{l}\\tfrac12(\\hat p_+ + \\hat p_-)\\\\ {=}\\ \\boldsymbol v_{\\!\\perp}/c\\end{array}', m[0] + LABEL_GAP + 1.5, m[1] + 6, 0, 0.5, [1, 0], { color: OBS }));
	}
	{
		// above the short arrow, off its middle on the side away from the path of p+ (which runs below it)
		const m = mid(hd), up = [-hd.u[1], hd.u[0]];
		check(up[1] < 0, 'the half difference\'s label is not above its arrow');
		// the faint great circle z = 0 runs just over the arrow; the name sits across it, on a patch of the veil's own
		// tint that hides the circle's few points under the letters (the circle is a faint guide, the name is not)
		const src = '\\tfrac12(\\hat p_+ - \\hat p_-)', faint = (w) => w.startsWith('the great circle z = 0');
		let got = null;
		for (let k = 0; k < 400 && !got; k++) {
			const g = await placed(src, m[0] + up[0] * (1 + k * 0.05), m[1] + up[1] * (1 + k * 0.05), 0.5, 1);
			if (S.clearance(g.box, faint).d >= LABEL_GAP + 0.2) got = g;
		}
		check(got, 'no room for the half difference\'s name');
		const pad = 0.8, bx = got.box;
		S.raw(`<rect x="${n2(bx.l - pad)}" y="${n2(bx.t - pad)}" width="${n2(bx.r - bx.l + 2 * pad)}" height="${n2(bx.b - bx.t + 2 * pad)}" fill="${VEILED}"/>`, 2.9);
		got.on = S.marks.filter((q) => faint(q.what)).map((q) => q.what);
		L.push(got);
	}
	{
		// the two pairs named: p+ left of its dots (its path comes in from below), p- over its own
		const qP = at(pairs[0].n), qM = at(pairs[1].n);
		L.push(await S.clear('\\hat p_+', qP[0] - reach - LABEL_GAP - 0.4, qP[1], 1, 0.5, [-1, 0]));
		L.push(await S.clear('\\hat p_-', qM[0], qM[1] - STAR - LABEL_GAP - 0.4, 0.5, 1, [0, -1]));
	}
	{
		const m = [(line.a[0] + line.b[0]) / 2, (line.a[1] + line.b[1]) / 2];
		L.push(await S.clear('\\hat n,\\ \\text{now}', m[0] + 6, m[1] + LABEL_GAP + 2, 0.5, 0, [0, 1]));
	}

	// ---- the key, at the lower left under the body: what the open circles, the dots and the grey paths are
	{
		const x0 = B[0] - BODY_R, rr = STAR + STAR_EDGE / 2;
		let y = B[1] + BODY_R + KEY_DROP;
		const rows = [['open', '\\text{a pair at rest}'], ['filled', `\\text{a pair at }${BODY.speed}c`], ['path', '\\text{its path as the speed rises}']];
		for (const [kind, src] of rows) {
			if (kind === 'path') S.path([[x0, y], [x0 + 2 * s + 2 * rr, y]], { color: DIM, width: PATH, layer: 3, cap: 'butt', what: 'the key\'s path' });
			else for (const o of [rr, rr + 2 * s]) {
				const q = [x0 + o, y];
				S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${STAR}" fill="${kind === 'open' ? PAGE : CURV}" stroke="${kind === 'open' ? CURV : PAGE}" stroke-width="${kind === 'open' ? OPEN_W : STAR_EDGE}"/>`, 5);
				S.mark([q], rr, `the key's ${kind} dot`);
			}
			L.push(await placed(src, x0 + 2 * s + 2 * rr + KEY_TEXT, y, 0, 0.5, INK));
			y += KEY_PITCH;
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { pairs: pairs.map((g) => g.n), half, diff: nums.diff, view: { TURN, TILT } };
	return finish(S, L, BOOK ? [200, 300] : [240, 340], defs);
}


/** A stone ball lit by the studio (tut-one-point-hero's litBall, as tut-same-eigenvalues uses it): the picture `face`
 * (its exact circle inside MARGIN pixels of canvas) as the albedo, seen face on; a JPEG of N pixels across. */
async function litBall(face, N) {
	const img = new Image(); img.src = face.href; await img.decode();
	const src = document.createElement('canvas');
	src.width = face.w; src.height = face.h;
	const sctx = src.getContext('2d'); sctx.drawImage(img, 0, 0);
	const tex = sctx.getImageData(0, 0, face.w, face.h).data;
	const cv = document.createElement('canvas'); cv.width = N; cv.height = N;
	const ctx = cv.getContext('2d'), out = ctx.createImageData(N, N);
	const r0 = (face.w - 2 * MARGIN) / 2, cx = face.w / 2, cy = face.h / 2;
	for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
		let x = ((i + 0.5) / N) * 2 - 1, y = 1 - ((j + 0.5) / N) * 2;
		const rr = x * x + y * y;
		if (rr > 1) { const l = Math.sqrt(rr); x /= l; y /= l; }
		const n = [x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))];
		const sc = 0.97;
		const tx = Math.round(cx + sc * r0 * x), ty = Math.round(cy - sc * r0 * y), t = (ty * face.w + tx) * 4;
		const lit = 0.3 + 0.8 * Math.max(0, (rgbDot(n, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, rgbDot(n, FILL));
		const spec = 0.18 * Math.max(0, rgbDot(n, HALF)) ** 30;
		const q = (j * N + i) * 4;
		for (let k = 0; k < 3; k++) out.data[q + k] = Math.round(255 * Math.min(1, (tex[t + k] / 255) * lit + spec));
		out.data[q + 3] = 255;
	}
	ctx.putImageData(out, 0, 0);
	return cv.toDataURL('image/jpeg', 0.9);
}
