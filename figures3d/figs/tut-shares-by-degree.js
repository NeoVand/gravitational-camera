// The tutorial, chapter 13.4 (tutorial/what-a-field-keeps/flows-inside.md), its third diagram: the shares of the
// radii, by degree. Three small plots stacked, for the pairs (x + iy)^n / n of degree n = 2, 3 and 4, on one radial axis
// r/R from 0 to 1, each drawn to its own greatest value, as the paper's fig:hidden-flow(b) (figs/hidden-flow.js) and
// its live figure (app/src/lib/hair/flow.ts, HiddenFlowDrawing.svelte) draw them. In each, the share of each radius in
// the bracket for the hidden swirl at a = 2^(-1/5) R, the inner ball turning at +Omega: -r^(2n) inside a, an area
// below the zero line in a grey, and +r^(2n) outside it, an area above the line in matter's colour, the two joined by
// the jump at a. A thin vertical line at a through all three. Beside each plot its sum, 0, +0.221 and +0.389, in units
// of M Omega R^(2n-2), outside the areas. Under the common axis, three small ticks at the zeros of the sums,
// 2^(-1/5) = 0.871, 2^(-1/7) = 0.906 and 2^(-1/9) = 0.926, their labels "n = 2", "n = 3", "n = 4" set apart below them
// and tied to them by hairlines, since the ticks stand 4 to 8 points apart.
// Departures from the diagram's comment: the inner ball's and the shell's shares are a grey and matter's colour, not
// orange and blue, which mean a stretch and a squeeze; the caption names them by their places, above and below the line.
// Exact: every curve (r^(2n), both parts, the jump at a), a, the zeros, the sums (tut-brackets-lib.js asserts the
// shares' integrals against the sums and these against the chapter's 0.389 and its closed forms). Schematic: each
// plot's height, its own scale.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, AXIS, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, MATTER, HIDDEN, DEGREES, bracket, zeroOf, share, rigid, near } from './tut-brackets-lib.js';

const name = 'tut-shares-by-degree';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const W = 214;                             // the radius from 0 to R
const RISE = 24;                           // a plot's greatest value (the share at R), above its line
const GAP = 9;                             // from one plot's lowest point to the next one's highest
const CURVE = 0.55;                        // the shares' outline
const INNER = 0.13, OUTER = 0.32;          // the areas' opacities: ink (the inner ball), matter's colour (the shell)
const ZTICK = 3.6;                         // the zeros' ticks, under the axis
const ROW = 22;                            // from the axis down to the zeros' labels
const SPREAD = 27;                         // between the zeros' labels
const caption = 'Look first at the areas above the line: with each degree the outer layers count for more, so at degree two the areas balance and at degrees three and four the outer part wins. The ticks under the axis mark where the inner ball would have to end for each sum to vanish.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'shares-by-degree', caption);
	const S = new Sheet(name);
	const L = [];
	const a = HIDDEN, left = ORIGIN - W / 2;

	// ---- the three plots, top to bottom; each is the share over its own greatest value, r^(2n) at R
	const plots = [];
	let y = ORIGIN - 75;
	for (const n of DEGREES) {
		const depth = a ** (2 * n);                             // the inner part's deepest, at a, in units of the greatest
		const P = new Plot({ left, top: y, w: W, h: RISE * (1 + depth), x0: 0, x1: 1, y0: -depth, y1: 1 });
		const top = rigid(n) * (2 * n + 1);                     // the greatest share, at R
		check(near(share(n, 1 - 1e-12) / top, 1, 1e-9) && near(share(n, a * (1 - 1e-15)) / top, -depth, 1e-9), `the plot of degree ${n}`);
		plots.push({ n, P, top, depth });
		y = P.bottom + GAP;
	}

	// the thin line at a, through all three, from the top plot's top to the axis
	const base = plots.at(-1).P.bottom + 7;
	S.path([[left + a * W, plots[0].P.top - 1], [left + a * W, base]], { color: FAINT, width: HAIR, cap: 'butt', layer: 0.8, what: 'the line at a' });

	for (const { n, P, top } of plots) {
		const curve = (r0, r1) => Array.from({ length: 161 }, (_, k) => r0 + ((r1 - r0) * k) / 160);
		const inner = curve(0, a).map((r) => P.at(r, share(n, Math.min(r, a * (1 - 1e-15))) / top));
		const outer = curve(a, 1).map((r) => P.at(r, share(n, Math.max(r, a)) / top));
		const zero = P.Y(0);
		const area = (pts, r0, r1) => `M${n2(P.X(r0))},${n2(zero)}L` + pts.map(([x, yy]) => `${n2(x)},${n2(yy)}`).join('L') + `L${n2(P.X(r1))},${n2(zero)}Z`;
		S.raw(`<path d="${area(inner, 0, a)}" fill="${INK}" fill-opacity="${INNER}"/>`, 0.5);
		S.raw(`<path d="${area(outer, a, 1)}" fill="${MATTER}" fill-opacity="${OUTER}"/>`, 0.5);
		S.boxes.push({ box: { l: P.X(0), r: P.X(a), t: zero, b: P.bottom }, what: `the inner area ${n}` });
		S.boxes.push({ box: { l: P.X(a), r: P.X(1), t: P.top, b: zero }, what: `the outer area ${n}` });
		// the outline: the inner part, the jump at a, the outer part, as one stroke
		// drawn from where it leaves the line by more than the two strokes' half-widths, so that it never runs along
		// the line as a second stroke
		const from = inner.findIndex(([, yy]) => yy - zero > (CURVE + AXIS) / 2);
		check(from > 0 && P.X(0) + (from / 160) * a * W < P.X(0.7), `the shares ${n} leave the line late`);
		S.path([...inner.slice(from), ...outer], { color: INK, width: CURVE, layer: 2, what: `the shares ${n}` });
		S.path([[P.X(0), zero], [P.X(1), zero]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: `the line ${n}` });
		// the plot's name, at the top left, over the empty part of the inner ball's side
		L.push(await placed(`n = ${n}`, P.X(0) + 1, P.top, 0, 0, INK));
		// the sum, beside the plot at its line
		const s = bracket(n), printed = Math.abs(s) < 1e-12 ? '0' : `+${s.toFixed(3)}`;
		check(['0', '+0.221', '+0.389'][n - 2] === printed, `the sum of degree ${n}: ${printed}`);
		L.push(await placed(printed, P.X(1) + 12, zero, 0, 0.5, INK));
	}
	// the column's head: what the sums are, and in what units
	{
		const P = plots[0].P;
		L.push(await placed(`\\text{sum, in }{\\color{${MATTER}}M}\\Omega R^{2n-2}`, P.X(1) + 12, P.top - 3, 0, 1, DIM, 7.5));
	}

	// ---- the common axis of the radius, and the zeros of the sums under it
	const Pb = new Plot({ left, top: base - 10, w: W, h: 10, x0: 0, x1: 1, y0: 0, y1: 1 });
	L.push(...(await xAxis(S, Pb, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '0.5' : String(t)), what: 'the r axis' })));
	L.push(await placed('r/R', Pb.X(1) + LABEL_GAP + 3, base, 0, 0.5, INK));
	const zs = DEGREES.map(zeroOf);
	check(zs.map((z) => z.toFixed(3)).join() === '0.871,0.906,0.926' && near(zs[0], a, 1e-15), 'the zeros');
	for (const [k, z] of zs.entries()) {
		const x = Pb.X(z), lx = Pb.X(zs[1]) + (k - 1) * SPREAD;
		S.path([[x, base], [x, base + ZTICK]], { color: INK, width: HAIR * 1.2, cap: 'butt', layer: 2, what: `the zero ${k}` });
		const lab = await placed(`n = ${DEGREES[k]}`, lx, base + ROW, 0.5, 0, INK);
		S.path([[x, base + ZTICK + 0.6], [lx, lab.box.t - 2.6]], { color: FAINT, width: HAIR * 0.8, cap: 'butt', layer: 1.5, what: `the zero's leader ${k}` });
		L.push(lab);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { a, zeros: zs, sums: DEGREES.map((n) => bracket(n)) };
	return finish(S, L, [240, 330]);
}
