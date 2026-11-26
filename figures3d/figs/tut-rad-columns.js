// The tutorial, section 5.5 (tutorial/waves/radiance.md), its third diagram: what one pixel reports along one line of
// sight, in light, in a thick glow and in the gravitational glow. Three panels stacked, the same scene in each: a pixel
// (section 5.3's small square) at the left and a horizontal line of sight from it to the right edge, which crosses a
// door (a thin upright slab), a steel furnace (a box with thick walls, in section) holding a small block, and a person
// (a rounded rectangle). The bodies are outlines over the neutral tint. Under the bodies, on a common baseline, bars
// give each body's part in the pixel's reading. (a) "light": the line is solid from the pixel to the door's face, a dot
// there, faint and dashed beyond; one bar under the door, of height 1, "the first surface". (b) "a thick glow, tau = 3
// per body": the line is solid through the door and fades; each body crossed gives the share (1 - e^{-3}) e^{-3k} of
// the reading, for bodies of equal j/alpha, k = 0 for the door, 1 for the furnace's near wall, 2 for the block, 3 for
// its far wall and 4 for the person: 0.950, 0.047, 0.0024, 0.0001 and 0.000006, the last three drawn as hairlines,
// "only the near layer shows". (c) "the gravitational glow, tau ~ 10^-30": the line is solid all the way; each bar is
// that body's j l, the illustrative values door 0.1, each steel wall 0.15, the hot block 3.0 (the first accent, the
// paper's orange for the hottest glow) and the person 0.4, and a bar at the right edge, their sum 3.8, "the pixel:
// the sum". The bodies are named once, in (a), and the hot block in (c), over its bar.
// Departures from the diagram's comment: the comment's k = 0 to 3 ran door, furnace wall, block, person and left out
// the furnace's far wall, which the line also crosses; with it, k = 3 is the far wall (0.0001) and the person is
// k = 4 (0.000006), and both are hairlines. The bodies are named, and the panels' titles carry their letters, since
// the caption refers to (c). The scene is drawn at half a point per site pixel of the comment.
// Exact: the shares of (b) (asserted, and asserted to add, with the fifth, to 1 - e^{-15}), the bars' heights in
// proportion to them, the sum in (c) (asserted to be 3.8). Schematic: the bodies' shapes and sizes, the bars' widths,
// the values of (c), which are illustrative, as in the paper's Figure fig:line-integral, and the fading of the line
// in (b).
import { Sheet, ORIGIN, finish, checker, placed, near, HAIR, LINE, LABEL_GAP } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { DOT } from './tut-bessel-lib.js';
import { INK, DIM, FAINT, RULE, ACCENT } from '../lib.js';
import { chapter, pixel, share, GLOWS, DASH, TINT, SQ } from './tut-rad-lib.js';

const name = 'tut-rad-columns';
const check = checker(name);

// the comment's site pixels at 1440, half a point each; y down from each panel's top
const K = 0.5;
const PITCH = 178;                         // from one panel's top to the next
const LY = 68;                             // the line of sight
const X_PIXEL = 30, X_END = 630;
const DOOR = [120, 130, LY - 34, LY + 34];
const FURNACE = [220, 380, LY - 28, LY + 28], WALL = 10;
const BLOCK = [280, 320, LY - 10, LY + 10];
const PERSON = [470, 520, LY - 40, LY + 38], ROUND = 14;
const BASE = 154;                          // the bars' baseline
const BARH = 34;                           // a bar of the panel's largest value
const BAR = 12;                            // a bar's width
const TOTAL = [602, 626];                  // the sum's bar in (c)
const LINE_W = 0.7;                        // the line of sight
const FADE = [130, 220];                   // (b): where the line fades

export default async function () {
	const nums = chapter(check);
	const S = new Sheet(name);
	const L = [];
	let defs = '';
	const X0 = ORIGIN - 160, Y0 = ORIGIN - 130;
	const at = (p, x, y) => [X0 + K * x, Y0 + K * (p * PITCH + y)];
	const rect = (p, [l, r, t, b]) => [at(p, l, t), at(p, r, t), at(p, r, b), at(p, l, b)];
	const xOf = (x) => X0 + K * x;

	for (const [p, kind] of [[0, 'light'], [1, 'thick'], [2, 'gravity']]) {
		// ---- the bodies: the door, the furnace's walls (the ring between its outer and inner outlines), the block, the
		// person, each over the neutral tint
		const inner = [FURNACE[0] + WALL, FURNACE[1] - WALL, FURNACE[2] + WALL, FURNACE[3] - WALL];
		S.raw(`<path d="${pathOf(rect(p, DOOR))}" fill="${TINT}"/>`, 0.2);
		S.raw(`<path d="${pathOf(rect(p, FURNACE))}${pathOf(rect(p, inner))}" fill="${TINT}" fill-rule="evenodd"/>`, 0.2);
		S.raw(`<path d="${pathOf(rect(p, BLOCK))}" fill="${TINT}"/>`, 0.2);
		S.path(rect(p, DOOR), { color: INK, width: LINE, layer: 1, closed: true, what: `the door (${kind})` });
		S.path(rect(p, FURNACE), { color: INK, width: LINE, layer: 1, closed: true, what: `the furnace (${kind})` });
		S.path(rect(p, inner), { color: INK, width: LINE, layer: 1, closed: true, what: `the furnace's inside (${kind})` });
		S.path(rect(p, BLOCK), { color: INK, width: LINE, layer: 1, closed: true, what: `the block (${kind})` });
		{
			const [l, r, t, b] = PERSON, [x0, y0] = at(p, l, t), [x1, y1] = at(p, r, b), rr = K * ROUND;
			S.raw(`<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="${rr}" fill="${TINT}" stroke="${INK}" stroke-width="${LINE}"/>`, 1);
			// remembered as its outline: the straight sides and the corners' arcs
			const pts = [];
			for (const [cx, cy, a0] of [[x1 - rr, y0 + rr, -90], [x1 - rr, y1 - rr, 0], [x0 + rr, y1 - rr, 90], [x0 + rr, y0 + rr, 180]])
				for (let i = 0; i <= 12; i++) { const a = ((a0 + (90 * i) / 12) * Math.PI) / 180; pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); }
			S.mark([...pts, pts[0]], LINE / 2, `the person (${kind})`);
		}

		// ---- the line of sight
		const [, ly] = at(p, 0, LY);
		const seg = (a, b, o = {}) => S.path([[xOf(a), ly], [xOf(b), ly]], { color: INK, width: LINE_W, layer: 3, cap: 'butt', what: `the line (${kind})`, ...o });
		if (kind === 'light') {
			seg(X_PIXEL, DOOR[0]);
			seg(DOOR[0], X_END, { color: FAINT, width: HAIR + 0.1, dash: DASH, layer: 2, what: 'the line beyond the door (light)' });
			S.raw(`<circle cx="${xOf(DOOR[0])}" cy="${ly}" r="${DOT * 1.3}" fill="${INK}"/>`, 4);
			S.mark([[xOf(DOOR[0]), ly]], DOT * 1.3, 'the dot on the door');
		} else if (kind === 'thick') {
			seg(X_PIXEL, FADE[0]);
			const id = `${name}-fade`;
			defs += `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${xOf(FADE[0])}" y1="0" x2="${xOf(FADE[1])}" y2="0"><stop offset="0" stop-color="${INK}" stop-opacity="1"/><stop offset="0.5" stop-color="${INK}" stop-opacity="0.45"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></linearGradient>`;
			S.raw(`<path d="M${xOf(FADE[0])},${ly}L${xOf(FADE[1])},${ly}" stroke="url(#${id})" stroke-width="${LINE_W}" fill="none"/>`, 3);
			S.mark([[xOf(FADE[0]), ly], [xOf(FADE[1]), ly]], LINE_W / 2, 'the fading line (thick)');
			seg(FADE[1], X_END, { color: FAINT, width: HAIR + 0.1, dash: DASH, layer: 2, what: 'the line beyond the door (thick)' });
		} else seg(X_PIXEL, X_END);
		pixel(S, [xOf(X_PIXEL), ly], `the pixel (${kind})`);

		// ---- the bars, on a baseline
		const [, yb] = at(p, 0, BASE);
		S.path([[xOf(DOOR[0] - 14), yb], [xOf(X_END), yb]], { color: RULE, width: HAIR, layer: 0.5, cap: 'butt', what: `the baseline (${kind})` });
		const bar = (cx, v, scale, color = INK, w = BAR) => {
			const hpt = Math.max(K * BARH * (v / scale), HAIR);
			const box = { l: xOf(cx - w / 2), r: xOf(cx + w / 2), t: yb - hpt, b: yb };
			S.fill(pathOf([[box.l, box.b], [box.l, box.t], [box.r, box.t], [box.r, box.b]]), box, { color, layer: 2, what: `the bar at ${cx} (${kind})` });
			return { box, hair: hpt === HAIR };
		};
		const centres = { door: (DOOR[0] + DOOR[1]) / 2, near: FURNACE[0] + WALL / 2, block: (BLOCK[0] + BLOCK[1]) / 2, far: FURNACE[1] - WALL / 2, person: (PERSON[0] + PERSON[1]) / 2 };
		if (kind === 'light') {
			const b = bar(centres.door, 1, 1);
			L.push(await S.clear('\\text{the first surface}', b.box.r + LABEL_GAP + 1, (b.box.t + b.box.b) / 2, 0, 0.5, [1, 0], { color: INK }));
		} else if (kind === 'thick') {
			const order = ['door', 'near', 'block', 'far', 'person'];
			const bars = order.map((k, i) => bar(centres[k], share(i), 1));
			check(near(share(0), nums.shares[0], 1e-15), 'the door\'s share');
			check(bars.map((b) => b.hair).join() === 'false,false,true,true,true', `the hairlines ${bars.map((b) => b.hair)}`);
			check(bars[1].box.b - bars[1].box.t > 2 * HAIR, 'the near wall\'s bar is not taller than a hairline');
			L.push(await S.clear('\\text{only the near layer shows}', bars[0].box.r + LABEL_GAP + 1, (bars[0].box.t + bars[0].box.b) / 2 - 1, 0, 0.5, [1, 0], { color: INK }));
		} else {
			const total = Object.values(GLOWS).reduce((s, x) => s + x, 0);
			check(near(total, 3.8, 1e-12), 'the sum is not 3.8');
			for (const k of ['door', 'near', 'far', 'person']) bar(centres[k], GLOWS[k], total);
			const hot = bar(centres.block, GLOWS.block, total, ACCENT, BLOCK[1] - BLOCK[0] - 8);
			const sum = bar((TOTAL[0] + TOTAL[1]) / 2, total, total, INK, TOTAL[1] - TOTAL[0]);
			check(near(sum.box.b - sum.box.t, K * BARH, 1e-12) && near((hot.box.b - hot.box.t) / (sum.box.b - sum.box.t), 3 / 3.8, 1e-12), 'the bars are not in proportion');
			L.push(await S.clear('\\text{the pixel: the sum}', sum.box.l - LABEL_GAP - 1, (sum.box.t + sum.box.b) / 2, 1, 0.5, [-1, 0], { color: INK }));
			L.push(await S.clear('\\text{hot block}', (hot.box.l + hot.box.r) / 2, hot.box.t - LABEL_GAP - 0.4, 0.5, 1, [0, -1], { color: ACCENT }));
		}

		// ---- the title, at the panel's top left
		const titles = {
			light: '\\text{(a) light}',
			thick: '\\text{(b) a thick glow } (\\tau = 3\\text{ per body})',
			gravity: '\\text{(c) the gravitational glow } (\\tau \\approx 10^{-30})'
		};
		L.push(await placed(titles[kind], X0, at(p, 0, 0)[1], 0, 0, INK));
		if (kind === 'light') {
			L.push(await S.clear('\\text{pixel}', xOf(X_PIXEL), ly + SQ / 2 + LABEL_GAP + 0.5, 0.5, 0, [0, 1], { color: DIM }));
			// all three on one baseline, over the tallest body, the person; the descender of p hangs below it
			const o = await placed('\\text{o}', 0, 0, 0, 0, DIM), q = await placed('\\text{p}', 0, 0, 0, 0, DIM);
			const descender = q.box.b - o.box.b;
			for (const [src, box, down] of [['\\text{door}', DOOR, 0], ['\\text{furnace}', FURNACE, 0], ['\\text{person}', PERSON, descender]]) {
				const [x, y] = at(p, (box[0] + box[1]) / 2, PERSON[2]);
				L.push(await placed(src, x, y - LABEL_GAP - 1 - descender + down, 0.5, 1, DIM));
			}
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [240, 340], defs);
}
