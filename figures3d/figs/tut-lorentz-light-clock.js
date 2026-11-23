// The tutorial, chapter 6.1 (tutorial/relativity/lorentz.md), its second diagram: a clock made of light, at rest and
// moving at 0.6c. Two panels side by side at one scale, half a point to the comment's site pixel. Left, "at rest": two
// short level mirrors (thin ink, 60 site pixels wide) 160 apart, one above the other; the flash, in the light role's
// colour, straight up and straight down as two slightly separated upright arrows; the gap named L beside a thin
// dimension line at the left. Right, "moving at 0.6c": the lower mirror at three places, 0, 120 and 240 site pixels
// to the right, the first and the last faint, and the upper mirror at 120; the flash's path, two diagonals from (0, 0)
// up to (120, 160) and down to (240, 0), each 200 long, so that the triangle has the sides 120, 160 and 200, in the
// ratio 0.75 : 1 : 1.25 for L = 1; a thin dimension line under the left half of the base, named v dt/2, the left
// diagonal named c dt/2 outside the triangle, and under the right half of the base an arrow in the observer's colour
// named 0.6c.
// Departure from the diagram's comment: the comment's arrow "along the bottom" is drawn under the base's right half,
// level with the dimension line under its left half, so that the two names share one line.
// Exact: the triangle, 3 : 4 : 5 and gamma beta : 1 : gamma (asserted in tut-lorentz-lib.js, and here on the page);
// the mirrors' places. Schematic: the arrow's length (a direction, not a distance), the mirrors' width.
import { Sheet, ORIGIN, finish, checker, placed, beside, near, LABEL_GAP, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { measure } from './tut-rad-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, OBS, LIGHT, CLOCK, BETA, GAMMA } from './tut-lorentz-lib.js';

const name = 'tut-lorentz-light-clock';
const check = checker(name);

const K = 0.5;                             // points per site pixel of the comment
const PANEL = 300;                         // a panel's width, site pixels
const MIRROR = 60;                         // a mirror's width
const GLASS = 0.75;                        // a mirror's stroke, points
const RAY = 0.6;                           // the flash's stroke
const APART = 3;                           // half the gap between the two upright arrows, points
const DIM_AT = -16;                        // the dimension lines and the arrow, site pixels under the base
const ARROW = [148, 228];                  // the arrow's ends, site pixels along the base

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const { L: H, run, path } = CLOCK;
	// each panel's centre on the page: the rest clock at the left panel's middle, the moving one's middle position at
	// the right panel's
	const X0 = ORIGIN - K * PANEL;
	const left = ([x, y]) => [X0 + K * (PANEL / 2 + x), ORIGIN + K * (H / 2 - y)];
	const right = ([x, y]) => [X0 + K * (PANEL + PANEL / 2 - run + x), ORIGIN + K * (H / 2 - y)];
	const mirror = (T, x, y, color, what) => S.path([T([x - MIRROR / 2, y]), T([x + MIRROR / 2, y])], { color, width: GLASS, layer: 1, cap: 'butt', what });
	const inner = GLASS / 2;                // the flash meets a mirror at its stroke's face

	// ---- left: at rest
	mirror(left, 0, 0, INK, 'the lower mirror at rest');
	mirror(left, 0, H, INK, 'the upper mirror at rest');
	{
		const [x0, y0] = left([0, 0]), [, y1] = left([0, H]);
		S.arrow([x0 - APART, y0 - inner], [x0 - APART, y1 + inner], { color: LIGHT, width: RAY, head: VEC_HEAD, what: 'the flash up' });
		S.arrow([x0 + APART, y1 + inner], [x0 + APART, y0 - inner], { color: LIGHT, width: RAY, head: VEC_HEAD, what: 'the flash down' });
		const dx = -MIRROR / 2 - 14;
		measure(S, left([dx, 0]), left([dx, H]), { color: DIM, what: 'L' });
		const [mx, my] = left([dx, H / 2]);
		L.push(await placed('L', mx - LABEL_GAP - 3, my, 1, 0.5, INK));
	}

	// ---- right: moving at 0.6c
	mirror(right, 0, 0, FAINT, 'the lower mirror before');
	mirror(right, run, 0, INK, 'the lower mirror at the reflection');
	mirror(right, 2 * run, 0, FAINT, 'the lower mirror after');
	mirror(right, run, H, INK, 'the upper mirror');
	const a = right([0, 0]), b = right([run, H]), c = right([2 * run, 0]);
	{
		// on the page: the sides 60, 80 and 100 points, 3 : 4 : 5
		const up = Math.hypot(b[0] - a[0], b[1] - a[1]), down = Math.hypot(c[0] - b[0], c[1] - b[1]);
		check(near(up, K * path, 1e-9) && near(down, K * path, 1e-9) && near(b[0] - a[0], K * run, 1e-9) && near(a[1] - b[1], K * H, 1e-9), 'the triangle on the page');
		check(near((b[0] - a[0]) / (a[1] - b[1]), GAMMA * BETA, 1e-12) && near(up / (a[1] - b[1]), GAMMA, 1e-12), 'the triangle is not 0.75 : 1 : 1.25');
		// each diagonal meets the mirrors' faces: shortened along itself by the stroke's half-width over its slope
		const s = inner / ((a[1] - b[1]) / up);
		const u = [(b[0] - a[0]) / up, (b[1] - a[1]) / up];
		S.arrow([a[0] + u[0] * s, a[1] + u[1] * s], [b[0] - u[0] * s, b[1] - u[1] * s], { color: LIGHT, width: RAY, head: VEC_HEAD, what: 'the flash up' });
		S.arrow([b[0] + u[0] * s, b[1] - u[1] * s], [c[0] - u[0] * s, c[1] + u[1] * s], { color: LIGHT, width: RAY, head: VEC_HEAD, what: 'the flash down' });
		// c dt/2 outside the triangle, beside the middle of the left diagonal (u runs up and right; [u1, -u0] is up and left)
		check(u[1] < 0 && -u[0] < 0, 'the normal does not point out of the triangle');
		L.push(await beside('c\\Delta t/2', [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [u[1], -u[0]], LABEL_GAP + 0.6, INK));
	}
	// v dt/2 under the base's left half; the arrow 0.6c under its right half, level with it
	measure(S, right([0, DIM_AT]), right([run, DIM_AT]), { color: DIM, what: 'v dt/2' });
	{
		const [mx, my] = right([run / 2, DIM_AT]);
		L.push(await placed('v\\Delta t/2', mx, my + LABEL_GAP + 3, 0.5, 0, INK));
		const p = right([ARROW[0], DIM_AT]), q = right([ARROW[1], DIM_AT]);
		S.arrow(p, q, { color: OBS, width: VEC, head: VEC_HEAD, what: 'the velocity' });
		L.push(await placed('0.6c', (p[0] + q[0]) / 2, my + LABEL_GAP + 3, 0.5, 0, OBS));
	}

	// ---- the titles, on one line over the panels
	{
		const top = left([0, H])[1] - 12;
		L.push(await placed('\\text{at rest}', left([0, 0])[0], top, 0.5, 1, INK));
		L.push(await placed('\\text{moving at } 0.6c', right([run, 0])[0], top, 0.5, 1, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [240, 340]);
}
