// The tutorial, section 11.4 (tutorial/black-holes/under-tides.md), its first diagram: a steady tide raises a bulge on a
// stone and none on a hole. Two panels side by side, each under its name. Left, "the Earth, k_2 = 0.30": the Earth as
// a lit stone body (sprites/hair/ball-face.png, as section 7.5 draws it), drawn bulged along the tide's axis; an ink
// arrow beside it points along that axis to the Moon, off the panel; on the other side a ring of four free steel beads,
// section 1.4's tut-tides and 11.1's tut-schw-falling-pair: the two on the axis pulled out by orange arrows (the
// stretch), the two across pushed in by blue arrows half as long (the squeeze), the tide diag(1, 1, -2) along the line
// to the Moon. Right, "a black hole, k_2 = 0": a near-black disc of radius r_s, edged in ink, perfectly round, with the
// same arrow and the same ring. Under each panel a strip on logarithmic axes along the tide's axis, from 2 to 8 radii:
// on the left the tide's part of the potential, (r/R)^2, thin ink, "tide, r^2", and the stone's reply, k_2 (R/r)^3,
// thin in matter's colour, "reply, r^-3"; on the right the hole's whole static tide, r(r - r_s) in units of r_s^2, thin
// ink, "tide, r(r - r_s)", and no reply.
// Departures from the diagram's comment: the bulge is drawn as the chapter's interactive draws it (tidal-friction.ts,
// bulgeAxes: semi-axes 1 + k_2/2 and its root's reciprocal, the sphere's volume), not a thousand times its size: the
// Earth's solid tide, about 0.3 m from top to side, is 5 x 10^-8 of its radius, so a thousandfold bulge would not show;
// the drawn one is about four million times too large, and the caption says only that it is exaggerated. The stretch
// is shown in orange on the ring of beads, where the tide acts on free bodies; the bodies carry no colour of their own,
// the stone being stone and the hole dark. The strips' axes are logarithmic, so that r^2 and r^-3 are straight lines
// of slopes 2 and -3 and the reply, a hundredth of the tide at 2R, shows; both strips share one scale up, the tide's
// r^2 part being 1 at r = R (or r_s), and only the left one numbers it. Each panel has a short name with its k_2. The
// two panels stay side by side on a phone, the figure being one drawing.
// Exact: the strips' curves (tut-friction-lib.js: r^2 and r^-3 solve Laplace's equation for degree two, H = r(r - r_s)
// solves Hinderer's, and the reply is k_2 = 0.30 times the tide at r = R); the hole's disc is round and of radius r_s
// on the page, the Earth's undeformed radius; the beads' arrows are -E xi for the tide diag(1, 1, -2), the orange
// twice the blue. Schematic, as the caption says: the bulge's size, the ring's size against the bodies, the arrows'
// lengths. Pictorial: the stone, a picture from an image model, stretched with its ellipse and clipped to it.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM, ACCENT, ACCENT2, sprite } from '../lib.js';
import { MARGIN } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { chapter, palette, MATTER, HOLE, K2, BULGE, tide, reply, holeH } from './tut-friction-lib.js';

const name = 'tut-tide-no-bulge';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const lg = Math.log10;
const R = 21;                                   // the Earth's undeformed radius and the hole's r_s, on the page
const APART = 192;                              // between the panels' centres
const BODY = 12, RING = -51;                    // the body's and the ring's centres, right of the panel's centre
const RING_R = 12.5;                              // the ring's radius
const BEAD = 2.9, BEAD_COLOUR = '#868b92', BEAD_LOOK = { spec: 0.6, shininess: 36 };   // tut-tides' beads
const ARROW = { width: 0.55, head: 3.2, tail: 1.3, blue: 5.6 };                       // tut-tides' arrows
const MOON = { gap: 7, len: 22 };               // the arrow to the Moon: from the body's side, its length
const EDGE = 0.45, STONE_EDGE = 0.4;            // the hole's edge, the stone's
const RING_LINE = 0.4, RING_DASH = [1.6, 1.4];  // the ring, dashed
const TITLE = 10;                               // from a panel's name to the tallest body
// the strips: log10 of r/R across, of the potential up
const SX0 = lg(2), SX1 = lg(8), SY0 = -4, SY1 = 2;
const STRIP_W = 122, STRIP_H = 58, STRIP_IN = 4, STRIPS = 22;   // the strip's frame, its left from the panel's left, its top under the bodies
const THIN = 0.6;
const caption = 'Look first at the two strips: the stone\'s potential has a part that falls as $r^{-3}$, its reply, and the hole\'s has none. The bulge is exaggerated; the curves are exact.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'tide-no-bulge', caption);
	const S = new Sheet(name);
	const L = [];
	const art = await sprite('/figures3d/sprites/hair/ball-face.png');
	const centres = [ORIGIN - APART / 2, ORIGIN + APART / 2];
	const titles = ['\\text{the Earth, }k_2 = 0.30', '\\text{a black hole, }k_2 = 0'];
	check(near(K2, 0.3, 0) && titles[0].endsWith(K2.toFixed(2)), 'the Earth\'s k_2');
	const top = ORIGIN - 150;
	const T = await Promise.all(titles.map((t, k) => placed(t, centres[k] + BODY, top, 0.5, 0, INK)));
	L.push(...T);
	const yb = Math.max(...T.map((t) => t.box.b)) + TITLE + R;   // the bodies' centre line
	check(BULGE.b * R < R && R > RING_R + BEAD, 'the tallest body is not the hole');

	// ---- the tide on the beads: -E xi with E = diag(-2, 1) in the page's (along, across), per point of xi
	const per = ARROW.blue / RING_R;
	const push = ([u, v]) => [2 * u * per, -v * per];             // along the axis out, across it in
	check(near(Math.hypot(...push([RING_R, 0])) / Math.hypot(...push([0, RING_R])), 2, 1e-12), 'the stretch is not twice the squeeze');

	for (const [k, cx] of centres.entries()) {
		const isHole = k === 1, what = isHole ? 'the hole' : 'the Earth';
		const c = [cx + BODY, yb];
		// ---- the body
		if (isHole) {
			S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${R}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 2);
			S.mark(Array.from({ length: 145 }, (_, i) => [c[0] + R * Math.cos((i * Math.PI) / 72), c[1] + R * Math.sin((i * Math.PI) / 72)]), EDGE / 2, what);
		} else {
			const a = BULGE.a * R, b = BULGE.b * R, reach = art.w / (art.w - 2 * MARGIN);
			const ell = `M${n2(c[0] - a)},${n2(c[1])}a${n2(a)},${n2(b)} 0 1,0 ${n2(2 * a)},0a${n2(a)},${n2(b)} 0 1,0 ${n2(-2 * a)},0Z`;
			S.raw(`<clipPath id="${name}-earth"><path d="${ell}"/></clipPath>` +
				`<image class="art" href="${art.href}" x="${n2(c[0] - a * reach)}" y="${n2(c[1] - b * reach)}" width="${n2(2 * a * reach)}" height="${n2(2 * b * reach)}" preserveAspectRatio="none" clip-path="url(#${name}-earth)"/>` +
				`<path d="${ell}" fill="none" stroke="${STONE_INK}" stroke-width="${STONE_EDGE}"/>`, 2);
			S.mark(Array.from({ length: 145 }, (_, i) => [c[0] + a * Math.cos((i * Math.PI) / 72), c[1] + b * Math.sin((i * Math.PI) / 72)]), STONE_EDGE / 2, what);
			check(near(a * b * b, R ** 3, 1e-9), 'the bulged Earth does not keep its volume');
		}
		// ---- the arrow to the Moon, along the axis to the right, and its name beyond its head
		const x0 = c[0] + (isHole ? R : BULGE.a * R) + MOON.gap;
		const xm = c[0] + BULGE.a * R + MOON.gap;                      // both arrows start alike, past the bulge
		const A = S.arrow([Math.max(x0, xm), yb], [xm + MOON.len, yb], { color: INK, width: VEC, head: VEC_HEAD, layer: 2, what: `${what}'s arrow to the Moon` });
		L.push(await placed('\\text{Moon}', A.B[0] + LABEL_GAP + 0.6, yb, 0, 0.5, INK));
		// ---- the ring of beads, left of the body on the axis
		const rc = [cx + RING, yb];
		check(rc[0] + RING_R + BEAD + ARROW.tail + 2 * ARROW.blue + 4 < c[0] - BULGE.a * R, `${what}: the ring runs into the body`);
		{
			const n = 4 * Math.round((2 * Math.PI * RING_R) / (4 * (RING_DASH[0] + RING_DASH[1])));
			const len = (2 * Math.PI * RING_R) / n;
			S.raw(`<circle cx="${n2(rc[0])}" cy="${n2(rc[1])}" r="${RING_R}" fill="none" stroke="${DIM}" stroke-width="${RING_LINE}" stroke-dasharray="${n2(len * RING_DASH[0] / (RING_DASH[0] + RING_DASH[1]))} ${n2(len * RING_DASH[1] / (RING_DASH[0] + RING_DASH[1]))}"/>`, 1);
			S.mark(Array.from({ length: 73 }, (_, i) => [rc[0] + RING_R * Math.cos((i * Math.PI) / 36), rc[1] + RING_R * Math.sin((i * Math.PI) / 36)]), RING_LINE / 2, `${what}'s ring`);
		}
		const arrows = [];
		for (const [u, v] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
			const xi = [u * RING_R, v * RING_R];                          // page: v up
			const p = [rc[0] + xi[0], rc[1] - xi[1]];
			S.sphere(p, BEAD, BEAD_COLOUR, { ...BEAD_LOOK, layer: 3 }, `${what}'s bead ${u},${v}`);
			const f = push(xi), len = Math.hypot(...f), d = [f[0] / len, -f[1] / len];
			const P0 = [p[0] + d[0] * (BEAD + ARROW.tail), p[1] + d[1] * (BEAD + ARROW.tail)];
			const color = u !== 0 ? ACCENT : ACCENT2;
			arrows.push(S.arrow(P0, [P0[0] + d[0] * len, P0[1] + d[1] * len], { color, width: ARROW.width, head: ARROW.head, layer: 4, what: `${what}'s ${u !== 0 ? 'stretch' : 'squeeze'} arrow` }));
			if (u !== 0) check(d[0] === u && d[1] === 0, 'a stretch arrow does not point out along the axis');
			else check(d[0] === 0 && Math.sign(d[1]) === v, 'a squeeze arrow does not point in');
		}
		const [, , up, down] = arrows;
		check(Math.abs(up.B[1] - down.B[1]) >= 2, 'the squeeze arrows meet');

		// ---- the strip
		const P = new Plot({ left: cx + BODY - (STRIP_W + 4) / 2 + STRIP_IN, top: yb + R + STRIPS, w: STRIP_W, h: STRIP_H, x0: SX0, x1: SX1, y0: SY0, y1: SY1 });
		const xl = await xAxis(S, P, { ticks: [2, 4, 8].map(lg), fmt: (t) => String(Math.round(10 ** t)), what: `${what}'s strip across` });
		L.push(...xl);
		const yl = await yAxis(S, P, { ticks: [-4, -3, -2, -1, 0, 1, 2], fmt: (t) => (isHole || t % 2 ? null : t === 0 ? '1' : `10^{${t}}`), what: `${what}'s strip up` });
		L.push(...yl);
		const below = Math.max(...xl.map((l) => l.box.b));
		L.push(await placed(isHole ? 'r/r_s' : 'r/R', P.X((SX0 + SX1) / 2), below + 3, 0.5, 0, DIM));
		L.push(await placed('\\text{potential}', P.left - 4, P.top - 7, 0, 1, DIM));
		const curve = (f, n = 200) => Array.from({ length: n + 1 }, (_, i) => { const x = SX0 + ((SX1 - SX0) * i) / n; return P.at(x, lg(f(10 ** x))); });
		const inside = (pts) => pts.every(([, y]) => y >= P.top - 1e-9 && y <= P.bottom + 1e-9);
		if (isHole) {
			const pts = curve(holeH);
			check(inside(pts), 'the hole\'s tide leaves its strip');
			S.path(pts, { color: INK, width: THIN, layer: 2, what: 'the hole\'s tide' });
			const q = P.at(lg(5.5), lg(holeH(5.5)));
			L.push(await S.clear('\\text{tide, }r(r - r_s)', q[0], q[1] + 3, 0.5, 0, [0, 1]));
		} else {
			const t = curve(tide), rp = curve(reply);
			check(inside(t) && inside(rp), 'a part leaves the stone\'s strip');
			check(near(reply(2) / tide(2), K2 / 32, 1e-15), 'the reply at 2R');
			S.path(t, { color: INK, width: THIN, layer: 2, what: 'the stone\'s tide' });
			S.path(rp, { color: MATTER, width: THIN, layer: 2, what: 'the stone\'s reply' });
			const q = P.at(lg(5.5), lg(tide(5.5)));
			L.push(await S.clear('\\text{tide, }r^2', q[0], q[1] + 3, 0.5, 0, [0, 1]));
			const p = P.at(lg(5.5), lg(reply(5.5)));
			L.push(await S.clear('\\text{reply, }r^{-3}', p[0], p[1] - 3, 0.5, 1, [0, -1], { color: MATTER }));
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { bulge: BULGE, replyAt2R: reply(2) / tide(2) };
	return finish(S, L, [320, 380]);
}
