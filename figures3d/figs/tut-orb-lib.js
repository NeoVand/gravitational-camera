// Shared tools for the three diagrams of the tutorial's section 1.8 (tutorial/newton/orbits-and-kicks.md):
// tut-orb-falls, tut-orb-ring and tut-orb-flyby. Not a figure itself. The strokes, heads, dots, labels and the
// cropping are those of the earlier chapters' diagrams (figs/tut-pot-lib.js, figs/tut-vec-lib.js), imported, not
// copied; this file adds a fitted dashed line that leaves out the dashes that would touch another mark.
import { INK } from '../lib.js';
import { LINE, near, checker } from './tut-pot-lib.js';

export const DASH = [2.4, 1.8];           // dashes (tut-vec-lib's DASH)
export const DASH_CLEAR = 0.7;            // the least air between a dash and a mark it is kept from
export const STONE_INK = '#3b3024';       // a stone body's rim, drawn on the stone (tut-motion-earths): fixed, not swapped
// the field's colour of the chapter's equations (app.css, --q-field), light and dark: the colour of B in the chapter's
// interactive figure flyby-kick (app/src/lib/tutorial/live/FlybyKick.svelte), as tut-motion-frame uses --q-obs
export const FIELD = 'light-dark(#0b5a59, #04becd)';

/**
 * A straight dashed line from a to b (figure points) on a pot-lib Sheet: a whole number of dashes with a dash at each
 * end, the pattern stretched to fit; a dash any point of which `clash(q, gap)` finds within `gap` of another mark is
 * left out. Returns the dashes drawn, as [start, end] distances from a.
 */
export function dashed(S, a, b, { clash = () => false, color = INK, width = LINE, layer = 1, dash = DASH, what = 'a dashed line' } = {}) {
	const check = checker(S.name);
	const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
	const k = Math.max(1, Math.round((L + dash[1]) / (dash[0] + dash[1]))), f = L / (k * dash[0] + (k - 1) * dash[1]);
	const on = dash[0] * f, period = (dash[0] + dash[1]) * f;
	check(near((k - 1) * period + on, L, 1e-9), `${what}: the dashes do not fit`);
	const drawn = [];
	for (let i = 0; i < k; i++) {
		const s0 = i * period, s1 = s0 + on;
		const pts = Array.from({ length: 9 }, (_, j) => { const s = s0 + ((s1 - s0) * j) / 8; return [a[0] + u[0] * s, a[1] + u[1] * s]; });
		if (pts.some((q) => clash(q, width / 2 + DASH_CLEAR))) continue;
		S.path([pts[0], pts[8]], { color, width, layer, cap: 'butt', what: `${what}, dash ${i}` });
		drawn.push([s0, s1]);
	}
	return drawn;
}
