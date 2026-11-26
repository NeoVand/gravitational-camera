// The tutorial, section 9.4 (tutorial/one-point/petrov.md), its second diagram: the six Petrov types as six small
// skies. Each sky is drawn as section 8.4 draws it (figs/tut-spin-lib.js, after section 6.6 and the paper's fig:stars),
// without its equator: a thin outline, a veil over what lies behind, and a small grey pixel at the centre. On it, the
// reading's four principal null directions as dots in the curvature's colour, coincident ones as touching dots, so that
// each sky holds four (those on the far side under the veil, faint), and a thin dashed line from the pixel to each
// distinct direction. The type's letter above in ink, and the example under each in small ink: I, the fig:stars pair,
// four separate dots on two lines through the pixel; II, a mass along z and a wave along +z (w = 0.125, c2 = 0.05), two
// touching dots at +z and two single dots at (+-0.484, 0, -0.875); D, one mass along z, two at +z and two at -z; III,
// the paper's table, three at +z and one at -z; N, one wave along +z, four at +z and a small ink arrow k from the
// pixel; O, an empty sky. No orange or blue.
// Departures from the diagram's comment: the dots are in the curvature's colour (as section 8.4's Majorana stars, the
// same directions), not the accent colour, which on this site is orange and means a stretch; the six skies stand in two
// rows of three at every width (the site shows one drawing at every width, and six in a row would be too small on a
// phone); every sky, not only type I's, has a thin dashed line from the pixel to each of its distinct directions, so
// that the lines through the pixel of types I and D and the lone directions of the others read alike; the sky's outline
// is the page's rule colour, as in every sky of the tutorial and in fig:stars, and no equator is drawn (from any view
// that keeps type I's four directions clear of the outline and of one another, one of them falls on it); the long
// example "a mass and a wave along its line" is set on two lines; in type N the arrow k from the pixel replaces the
// dashed line.
// Exact: every direction, a root of the quartic m(z)^T W m(z) of its reading mapped to the sky by k(z) (a root lost
// from the top a dot at -z), each reading sorted into its type both by section 9.2's algebraic test and by the pattern
// of its roots, asserted in figs/tut-petrov-lib.js against the chapter's text; the view, orthographic, the same for the
// six. Schematic: the sizes of the dots, the pixel and the skies.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { INK, DIM } from '../lib.js';
import { view, sky, palette, CURV, STAR, STAR_STEP, STAR_EDGE } from './tut-spin-lib.js';
import { STEEL } from './tut-five-lib.js';
import { chapter, TYPES, EXAMPLES, near, len } from './tut-petrov-lib.js';

const name = 'tut-petrov-skies';
const check = checker(name);

const R = 48;                              // each sky's radius, points
const GAP = 16, ROW_GAP = 14;              // between two skies' outlines; between a row's last line and the next title
const AZ = -95, EL = 36;                   // the view: the camera's azimuth from x toward y, and its height, degrees
const PIXEL = 2.3;                         // the pixel's radius
const SPOKE = 0.4, SPOKE_DASH = [1.4, 1.6];   // the dashed lines from the pixel (the paper's dashed line to a body)
const CLEAR = 1.2;                         // the air between a dashed line's end and a dot or the pixel
const TITLE_UP = 6;                        // a type's letter: its foot this far above the sky
const UNDER = 5, SKIP = 1.7;             // from the sky to the first line under it; between two lines, ink to ink
const ARROW_W = 0.55, ARROW_HEAD = 3.4;    // type N's arrow k (fig:stars's)

export default async function () {
	const { skies } = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const v = view(AZ, EL);
	const s = STAR * STAR_STEP;
	const OFFSETS = { 1: [[0, 0]], 2: [[-s, 0], [s, 0]], 3: [[0, (-2 * s) / Math.sqrt(3)], [-s, s / Math.sqrt(3)], [s, s / Math.sqrt(3)]], 4: [[-s, -s], [s, -s], [-s, s], [s, s]] };
	const reach = (n) => Math.max(...OFFSETS[n].map(([x, y]) => Math.hypot(x, y))) + STAR + STAR_EDGE / 2;
	// three columns, two rows; the second row's top set below the first row's lowest line
	const col = (j) => ORIGIN + (j - 1) * (2 * R + GAP);
	let top = ORIGIN - 200;
	let lowest = 0;
	const drawn = [];
	for (const [i, t] of TYPES.entries()) {
		const j = i % 3;
		if (i === 3) top = lowest + ROW_GAP;
		const title = await placed(`\\text{${t}}`, col(j), top, 0.5, 0, INK);
		L.push(title);
		const c = [col(j), title.box.b + TITLE_UP + R];
		const K = sky(S, check, c, R, v);
		const { at, front } = K;
		const C = at([0, 0, 0]);
		K.veil();
		const { groups } = skies[t];
		check(groups.reduce((n, g) => n + g.count, 0) === (t === 'O' ? 0 : 4), `${t}: not four directions`);
		// ---- the pixel
		S.sphere(C, PIXEL, STEEL, { spec: 0.5, layer: 4 }, `${t}: the pixel`);
		// ---- the dashed lines from the pixel, or type N's arrow
		for (const g of groups) {
			const q = at(g.n), u = [q[0] - C[0], q[1] - C[1]], l = Math.hypot(...u);
			const e = [u[0] / l, u[1] / l];
			check(l > PIXEL + reach(g.count) + 8, `${t}: a direction lies too near the pixel on the page`);
			const a = [C[0] + e[0] * (PIXEL + CLEAR), C[1] + e[1] * (PIXEL + CLEAR)];
			// the line stops short of the cluster: the least distance along it at which it clears every dot
			let stop = l;
			for (const o of OFFSETS[g.count]) {
				const d = [q[0] + o[0] - C[0], q[1] + o[1] - C[1]], along = d[0] * e[0] + d[1] * e[1], off = Math.abs(d[0] * e[1] - d[1] * e[0]);
				const rr = STAR + STAR_EDGE / 2 + CLEAR + SPOKE / 2;
				if (off < rr) stop = Math.min(stop, along - Math.sqrt(rr * rr - off * off));
			}
			const b = [C[0] + e[0] * stop, C[1] + e[1] * stop];
			if (t === 'N') {
				const A = S.arrow(a, b, { color: INK, width: ARROW_W, head: ARROW_HEAD, layer: 3, what: 'N: the arrow k' });
				const mid = [(A.A[0] + A.B[0]) / 2, (A.A[1] + A.B[1]) / 2];
				L.push(await S.clear('\\hat k', mid[0] + ARROW_W / 2 + LABEL_GAP + 0.8, mid[1], 0, 0.5, [1, 0]));
			} else dashed(S, a, b, { color: DIM, width: SPOKE, dash: SPOKE_DASH, layer: 1.5, what: `${t}: the line to ${g.n.map((x) => x.toFixed(2))}` });
		}
		// ---- the directions
		for (const g of groups) {
			const what = `${t}: the direction ${g.n.map((x) => x.toFixed(2))}`;
			const dots = OFFSETS[g.count].map((o, k) => K.dot(g.n, STAR, { fill: CURV, offset: o, what: `${what}, dot ${k}` }));
			// clear of the sky's outline
			const q = at(g.n), rim = R - Math.hypot(q[0] - c[0], q[1] - c[1]) - reach(g.count);
			check(rim >= 1.4 || !front(g.n) && rim >= 1.0, `${what} is ${rim.toFixed(2)} pt from the outline`);
			drawn.push({ t, n: g.n, count: g.count, front: front(g.n), dots });
		}
		// ---- the example under the sky
		const lines = EXAMPLES[t] === 'a mass and a wave along its line' ? ['a mass and a wave', 'along its line'] : [EXAMPLES[t]];
		// each line set on a strut, so that the lines of all six share their baselines; two lines are one label
		let q = null;
		for (const line of lines) {
			const p = await placed(`\\vphantom{(}\\text{${line.replace(/'/g, '\u2019')}}`, c[0], q ? q.box.b + SKIP : c[1] + R + UNDER, 0.5, 0, INK);
			q = q ? { src: `${q.src} ${p.src}`, svg: q.svg + p.svg, box: { l: Math.min(q.box.l, p.box.l), r: Math.max(q.box.r, p.box.r), t: q.box.t, b: p.box.b } } : p;
		}
		L.push(q);
		lowest = Math.max(lowest, q.box.b);
	}
	// the directions on the far side are exactly those under the veil, and the pairs of type I are opposite
	check(drawn.filter((d) => d.t === 'I').filter((d) => d.front).length === 2, 'type I does not show two directions in front and two behind');
	for (const d of drawn) for (const e of drawn) if (d !== e && d.t === e.t) {
		const least = Math.min(...d.dots.flatMap((p) => e.dots.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1]))));
		check(least >= 2 * STAR + STAR_EDGE + 1.5, `${d.t}: two directions overlap on the page (${least.toFixed(2)} pt)`);
	}
	check(near(len(drawn.find((d) => d.t === 'N').n), 1) && drawn.find((d) => d.t === 'N').n[2] > 0.999, 'N: the arrow k is not along +z');

	S.checkAll(L);
	window[name + '-numbers'] = drawn.map((d) => ({ type: d.t, n: d.n, count: d.count, front: d.front }));
	return finish(S, L, [280, 340]);
}
