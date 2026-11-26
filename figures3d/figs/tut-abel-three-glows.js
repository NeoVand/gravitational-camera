// The tutorial, section 5.6 (tutorial/waves/abel-transform.md), its second diagram: gold in a steel ball glows as a
// spot, a dome or a ring. Three columns. At the top of each, a steel ball of radius R cut through its centre, chapter
// 2.5's three bodies in their round case: the nugget, a ball of gold of radius 0.2 R at the centre; the flush, the gold
// spread evenly through the ball; the skin, a band of gold from 0.95 R to R (t = 0.05 R). Under each, aligned with it,
// its glow N(b) across the picture, if only the gold glows, from -R to R on the ball's own scale, each curve divided by
// its own largest value (0 to 1, no numbers), a thin ink line over a pale fill of matter's light gold: the spot
// 2 sqrt(0.04 R^2 - b^2) for |b| < 0.2 R; the dome 2 sqrt(R^2 - b^2); the ring 2 [sqrt(R^2 - b^2) - sqrt((R - t)^2 - b^2)]
// for |b| < R - t and 2 sqrt(R^2 - b^2) beyond, whose peaks at |b| = 0.95 R are sqrt(2R/t - 1) = 6.24 times its middle.
// Named "spot", "dome" and "ring" under the curves.
// Departures from the diagram's comment: the bodies are drawn as section 2.5 draws these balls (figs/tut-null-lib.js),
// the sawn face of its steel ball with the gold in matter's colour over it (the nugget lit, the flush and the skin a
// shade), rather than in flat grey and gold, so that they are recognizably the same three bodies; each is named over
// it ("nugget", "flush", "skin"). Each chart's axes stand a little outside -R and R (at 1.12 R), with ticks at -R, 0
// and R, so that the ring's steep flanks at +-R do not run along the vertical axis; the curves' "N" is named once, on
// the first. The comment's site pixels are drawn at half a point each: balls of radius 40 points, 100 points apart,
// charts 45 points tall.
// Exact: the three curves (each closed form asserted in tut-abel-lib.js against the sum of the glow along the chord),
// each scaled to its own largest value (asserted, and the ring's middle at 1/6.24 of its height, asserted in points),
// sampled so that no two neighbouring points are more than a quarter of a point apart; the nugget's radius and the
// skin's band to scale. Schematic: the strength of the gold's shade, which does not follow its density. Pictorial: the
// stone, as in section 2.5.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, AXIS, HAIR, TICK, LABEL_GAP } from './tut-pot-lib.js';
import { Plot, pathOf } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { ballFace, stoneDefs, stone, rim, nugget, DEEPEST } from './tut-null-lib.js';
import { circle as circlePath } from '../stone.js';
import { chapter, spot, dome, ring, NUGGET, SKIN, SHADE } from './tut-abel-lib.js';

const name = 'tut-abel-three-glows';
const check = checker(name);

const K = 0.5;                             // points per site pixel
const R = 80 * K;                          // a ball's radius
const PITCH = 200 * K;                     // from one column to the next
const PH = 90 * K;                         // a chart's height
const DROP = 17;                           // from a ball's foot to its chart's top
const REACH = 1.12;                        // the axes' reach, in R
// the pale fill under a curve: matter's dark-theme colour, its light gold (figs/tut-null-lib.js, GOLD_LIGHT), mixed
// with the page, more of it in the light theme than in the dark
const FILL = 'light-dark(color-mix(in srgb, #f1dc86 72%, #fffffe), color-mix(in srgb, #f1dc86 20%, #fffffe))';
const FLUSH = DEEPEST / 2;                 // the flush's shade, section 2.5's uniform ball
const BAND = DEEPEST;                      // the skin's shade

export default async function () {
	const nums = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const face = await ballFace();
	S.raw(stoneDefs(`${name}-face`, face, R), -1);
	const bodies = [
		{ key: 'nugget', glow: 'spot', f: spot, a: -NUGGET, b: NUGGET, kinks: [] },
		{ key: 'flush', glow: 'dome', f: dome, a: -1, b: 1, kinks: [] },
		{ key: 'skin', glow: 'ring', f: (b) => ring(b), a: -1, b: 1, kinks: [-(1 - SKIN), 1 - SKIN] }
	];
	const yc = ORIGIN - (R + DROP + PH) / 2;

	for (const [k, body] of bodies.entries()) {
		const x = ORIGIN + (k - 1) * PITCH;
		// ---- the ball: the stone, the gold, the edge
		S.raw(stone(`${name}-stone${k}`, `${name}-face`, x, yc, R), 0);
		if (body.key === 'nugget') S.raw(nugget(`${name}-gold`, x, yc, NUGGET * R), 1);
		if (body.key === 'flush') S.raw(`<path d="${circlePath(x, yc, R)}" fill="${SHADE}" fill-opacity="${FLUSH.toFixed(4)}"/>`, 0.5);
		if (body.key === 'skin') S.raw(`<path d="${circlePath(x, yc, R)}${circlePath(x, yc, (1 - SKIN) * R)}" fill="${SHADE}" fill-opacity="${BAND.toFixed(4)}" fill-rule="evenodd"/>`, 0.5);
		S.raw(rim(x, yc, R), 0.7);
		S.mark([[x, yc]], R + 0.2, `the ${body.key}`);
		L.push(await placed(`\\text{${body.key}}`, x, yc - R - LABEL_GAP - 1.6, 0.5, 1, INK));

		// ---- its chart, aligned with it: b from -R to R on the ball's own scale, N / N_max from 0 to 1
		const P = new Plot({ left: x - R, top: yc + R + DROP, w: 2 * R, h: PH, x0: -1, x1: 1, y0: 0, y1: 1 });
		check(near(P.X(0), x, 1e-12) && near(P.X(1) - P.X(-1), 2 * R, 1e-12), `the ${body.glow} chart is not aligned with its ball`);
		const top = body.f(body.key === 'skin' ? 1 - SKIN : 0);
		// the largest value, found on a fine grid, is where the comment puts it
		let most = 0;
		for (let i = 0; i <= 200000; i++) most = Math.max(most, body.f(-1 + i / 100000));
		check(near(most, top, 1e-12), `the ${body.glow}'s largest value`);
		const g = (b) => body.f(b) / top;
		// the curve in pieces between its corners, so that each corner is a point of it
		const cuts = [body.a, ...body.kinks, body.b];
		let pts = [];
		for (let i = 1; i < cuts.length; i++) { const piece = graph(P, g, cuts[i - 1], cuts[i]); pts = pts.length ? [...pts, ...piece.slice(1)] : piece; }
		check(longest(pts) <= 0.2501, `the ${body.glow} is coarse`);
		check(near(pts[0][1], P.Y(0), 1e-9) && near(pts[pts.length - 1][1], P.Y(0), 1e-9), `the ${body.glow} does not end on the axis`);
		S.raw(`<path d="${pathOf(pts)}" fill="${FILL}"/>`, 0.5);
		S.path(pts, { color: INK, width: CURVE, layer: 2, cap: 'butt', what: `the ${body.glow}` });
		if (body.key === 'skin') {
			const middle = P.Y(0) - P.Y(g(0));
			check(near(middle * nums.ratio, PH, 1e-9) && (PH / middle).toFixed(2) === '6.24', `the ring's middle ${middle} pt`);
		}
		// the axes, a little outside the ball's edges, with ticks at -R, 0 and R under the horizontal one
		const xl = x - REACH * R, xr = x + REACH * R;
		S.path([[xl, P.bottom], [xr, P.bottom]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: `the ${body.glow}'s b axis` });
		for (const b of [-1, 0, 1]) S.path([[P.X(b), P.bottom], [P.X(b), P.bottom + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the ${body.glow}'s tick at ${b}` });
		S.path([[xl, P.bottom], [xl, P.top]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: `the ${body.glow}'s N axis` });
		S.path([[xl, P.top], [xl - TICK, P.top]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the ${body.glow}'s tick at 1` });
		L.push(await placed(`\\text{${body.glow}}`, x, P.bottom + TICK + LABEL_GAP + 1.2, 0.5, 0, INK));
		if (k === 0) L.push(await S.clear('N', xl, P.top - LABEL_GAP - 1, 0.5, 1, [0, -1], { color: DIM }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [240, 340]);
}
