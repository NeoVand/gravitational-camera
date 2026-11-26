// The tutorial, section 9.5 (tutorial/one-point/separating-waves.md), its first diagram: counting unknowns against
// recorded numbers gives the largest number of waves one point can separate. Three small panels side by side, "one
// instant (L = 1)", "one frequency (L = 2)" and "long record (L large)", each with a horizontal axis "number of waves
// N" from 1 to 6. In each, a dot in ink at every N for its unknowns N(L + 1), rising in steps, and two flat lines for
// what is recorded, L(2s + 1): solid in the curvature's colour for gravity (s = 2: 5, 10), dashed in the light role's
// colour for light (s = 1: 3, 6). The largest N whose dot lies at or below a line is ringed in that line's colour:
// gravity 2, 3, 4, light 1, 2, 2. The long record is drawn per snapshot, N(L + 1)/L against 2s + 1, at L = 20. A
// legend of two lines under the panels. No orange or blue.
// Departures from the diagram's comment: the dots stand alone, without a line joining them, since the counts are
// whole numbers of waves; the names "unknowns N(L + 1)" and "recorded L(2s + 1)" stand in a legend under the panels
// rather than in each panel, where three panels about 80 points wide leave no room for them clear of the dots; each
// panel's vertical axis carries ticks only at zero and at the two recorded lines, whose numbers (3 and 5, 6 and 10,
// 3 and 5) are the recorded counts; the third panel says under its title that it is drawn per snapshot, at L = 20.
// Exact: every dot, line and ring, computed in figs/tut-separating-lib.js (the counts, the largest N found both by
// counting and by the paper's eq:wave-count, for every L up to 200) and asserted against the chapter's text and its
// table. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { dashed } from './tut-orb-lib.js';
import { CURVE } from './tut-fourier-lib.js';
import { DASH } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, PANELS, WAVES, LONG, CURV, LIGHT } from './tut-separating-lib.js';

const name = 'tut-wave-count';
const check = checker(name);

const PW = 80, PH = 104;                  // each panel's plot, points
const GAPX = 30;                          // between two plots
const DOT_R = 1.35;                       // a dot's radius
const RING = 3.5, RING_W = 0.6;           // a ring's radius and stroke
const SWATCH = 14;                        // a legend's line
const TITLE_UP = 6.5;                     // a title's foot above the plot
const LEGEND_SKIP = 4;                    // between the legend's two lines

export default async function () {
	const nums = await chapter(check);
	const S = new Sheet(name);
	const L = [];
	const total = 3 * PW + 2 * GAPX;
	const top = ORIGIN - PH / 2;
	let under = -Infinity;

	// the third panel's note under its title, which sets the titles' height for all three
	const note = await placed(`\\text{drawn per snapshot, }L = ${LONG}`, 0, 0, 0.5, 1, DIM);
	const noteH = note.box.b - note.box.t;

	for (const [i, def] of PANELS.entries()) {
		const p = nums.counts[i];
		const left = ORIGIN - total / 2 + i * (PW + GAPX);
		const y1 = Math.max(...p.dots) * 1.03;
		const P = new Plot({ left, top, w: PW, h: PH, x0: 0.35, x1: 6.65, y0: 0, y1 });
		const what = `panel ${i + 1}`;

		// ---- the axes: N from 1 to 6, the counts at zero and at the two recorded lines
		const xs = await xAxis(S, P, { ticks: WAVES, what: `${what}'s N axis` });
		const fmt = (t) => `${+t.toFixed(6)}`;
		const ys = await yAxis(S, P, { ticks: [0, p.light, p.gravity], fmt, what: `${what}'s count axis` });
		L.push(...xs, ...ys);
		const below = Math.max(...xs.map((l) => l.box.b));
		const axisName = await placed('\\text{number of waves }N', P.X(3.5), below + 4.5, 0.5, 0, INK);
		L.push(axisName);
		under = Math.max(under, axisName.box.b);

		// ---- the title, and the long record's note under it
		const titleFoot = top - TITLE_UP - noteH - LABEL_GAP - 0.4;
		L.push(await placed(def.title, P.X(3.5), titleFoot, 0.5, 1, INK));
		if (def.per) L.push(await placed(`\\text{drawn per snapshot, }L = ${LONG}`, P.X(3.5), top - TITLE_UP, 0.5, 1, DIM));

		// ---- the recorded lines: gravity solid, light dashed, across the plot
		const span = [P.X(P.x0), P.X(P.x1)];
		S.path([[span[0], P.Y(p.gravity)], [span[1], P.Y(p.gravity)]], { color: CURV, width: CURVE, layer: 2, cap: 'butt', what: `${what}'s gravity line` });
		dashed(S, [span[0], P.Y(p.light)], [span[1], P.Y(p.light)], { color: LIGHT, width: CURVE, layer: 2, dash: DASH, what: `${what}'s light line` });

		// ---- the dots, and the rings at the largest N that fits
		for (const [j, N] of WAVES.entries()) {
			const [x, y] = P.at(N, p.dots[j]);
			S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${DOT_R}" fill="${INK}"/>`, 3);
			S.mark([[x, y]], DOT_R, `${what}'s dot at ${N}`);
		}
		for (const [k, color] of [['gravity', CURV], ['light', LIGHT]]) {
			const N = p.ring[k], [x, y] = P.at(N, p.dots[N - 1]);
			S.raw(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${RING}" fill="none" stroke="${color}" stroke-width="${RING_W}"/>`, 3);
			// the ring as a closed polyline, for the labels' clearance
			const pts = Array.from({ length: 49 }, (_, q) => [x + RING * Math.cos((q * Math.PI) / 24), y + RING * Math.sin((q * Math.PI) / 24)]);
			S.mark(pts, RING_W / 2, `${what}'s ${k} ring`);
			// a ring stands clear of the other dots
			for (const [m, M] of WAVES.entries()) if (M !== N) {
				const [u, v] = P.at(M, p.dots[m]);
				check(Math.hypot(u - x, v - y) - RING - RING_W / 2 - DOT_R >= 1, `${what}'s ${k} ring touches the dot at ${M}`);
			}
		}
		// a dot above a line is seen to be above it: at least its own radius of air over the line
		for (const [j, N] of WAVES.entries()) for (const k of ['gravity', 'light']) {
			const gap = (p.dots[j] - p[k]) / (P.y1 - P.y0) * PH;
			if (gap > 1e-9) check(gap >= DOT_R + CURVE / 2 + 0.6, `${what}: the dot at ${N} is only ${gap.toFixed(2)} pt over the ${k} line`);
		}
	}

	// ---- the legend, two lines centred under the panels
	const row = async (items, y) => {
		const parts = [];
		let x = 0;
		for (const it of items) {
			if (it.text) {
				const t = await placed(it.text, 0, 0, 0, 0.5, it.color ?? INK);
				parts.push({ ...it, x, w: t.box.r - t.box.l });
				x += t.box.r - t.box.l;
			} else {
				parts.push({ ...it, x, w: it.w });
				x += it.w;
			}
			x += it.after ?? 0;
		}
		const x0 = ORIGIN - x / 2;
		for (const it of parts) {
			const a = x0 + it.x;
			if (it.text) L.push(await placed(it.text, a, y, 0, 0.5, it.color ?? INK));
			else if (it.dot) { S.raw(`<circle cx="${n2(a + it.w / 2)}" cy="${n2(y)}" r="${DOT_R}" fill="${INK}"/>`, 3); S.mark([[a + it.w / 2, y]], DOT_R, 'the legend\'s dot'); }
			else if (it.dash) dashed(S, [a, y], [a + it.w, y], { color: LIGHT, width: CURVE, layer: 2, dash: DASH, what: 'the legend\'s light line' });
			else S.path([[a, y], [a + it.w, y]], { color: CURV, width: CURVE, layer: 2, cap: 'butt', what: 'the legend\'s gravity line' });
		}
	};
	const air = LABEL_GAP + 1.2, wide = 12;
	const probe = await placed('\\text{unknowns }N(L + 1)', 0, 0, 0, 0);
	const lineH = probe.box.b - probe.box.t;
	const y1 = under + 9 + lineH / 2;
	await row([{ dot: true, w: 2 * DOT_R, after: air }, { text: '\\text{unknowns }N(L + 1)' }], y1);
	await row([
		{ text: '\\text{recorded }L(2s + 1)\\text{:}', after: air + 1 },
		{ line: true, w: SWATCH, after: air }, { text: '\\text{gravity, }s = 2', after: wide },
		{ dash: true, w: SWATCH, after: air }, { text: '\\text{light, }s = 1' }
	], y1 + lineH + LEGEND_SKIP + 2);

	S.checkAll(L);
	window[name + '-numbers'] = { rings: nums.counts.map((p) => p.ring) };
	return finish(S, L, [280, 340]);
}
