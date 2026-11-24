// The tutorial, chapter 9.1 (tutorial/one-point/spin-two.md), its first diagram: a reading's shares among the five
// spin weights about the axis z. Three small panels side by side, each a row of five bars at m = -2 ... 2, the bar of m
// as high as the share |c_m| sqrt<T_m|T_m> / |W| (so that the squares of the five add to one), on one scale from 0 to
// 1, thin ink outlines filled with ink at 30 per cent. Above each panel its name and a small sketch of the axis z (a
// thin ink arrow from the pixel, a dot) and the source. (a) "a mass on the axis": only m = 0, height 1; "rank 3". (b) "a
// wave along the axis", its crests across z and k = z: only m = 2, height 1; "rank 1". (c) "the same wave tilted by
// 60 degrees", its direction of travel k 60 degrees from z with its crests across it: 0.0625, 0.2165, 0.4593, 0.6495
// and 0.5625 (the last cos^4 30); "rank 1". Under the three, "spin weight m about z". No orange or blue.
// Departures from the diagram's comment: the panels stand side by side at every width (the site shows one drawing; at
// 390 px each panel is still about 110 px across), as chapter 8.4's three spheres do; the axis's name is written once,
// under the three panels, and the scale's 0, 0.5 and 1 once, on the left of the first; the third panel's name is set
// in two lines.
// Exact: every bar, from the reading itself (a mass's tide on the axis; a plane wave's E + iB along z, and along the
// direction 60 degrees from z in the xz plane), its five components on the tables T_m about z (figs/tut-spin-two-lib.js,
// which asserts the tables, their turns and lengths, the shares and the ranks against the chapter's text and its try
// comment); the angle in the third sketch. Schematic: the sketches' sizes, the mass's dot and the crests' spacing.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, NUM } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { stack } from './tut-curvature-lib.js';
import { chapter, WEIGHTS, BARS60 } from './tut-spin-two-lib.js';

const name = 'tut-spin-weight-bars';
const check = checker(name);

const PW = 84, PH = 66;                    // a panel's plot, points
const GAP = 24;                            // between two panels' plots
const BAR = 10;                            // a bar's width, points
const OUTLINE = 0.45, FILL = 0.3;          // a bar's outline, and its fill's opacity
const ZERO = 1e-9;                         // a share this small is no bar
const SKETCH = 24;                         // the axis z in the sketches, points
const SKETCH_GAP = 12;                     // from a sketch's pixel to the plot's top
const PIX = 1.05;                          // the pixel's dot
const MASS = 3.4, MASS_COLOR = '#a7a299';  // the mass's dot (the paper's figs/stars.js, BODY), and its colour
const CREST = 0.5, CREST_HALF = 6.5;       // the crests: stroke, half-length
const CRESTS = [0.38, 0.58, 0.78];          // their places along the direction of travel, in units of SKETCH
const ARC = 6;                             // the arc of 60 degrees
const TITLES = [['\\text{a mass on the axis}'], ['\\text{a wave along the axis}'], ['\\text{the same wave}', '\\text{tilted by } 60^\\circ']];

export default async function () {
	const nums = await chapter(check);
	const S = new Sheet(name);
	const L = [];
	const panels = [
		{ shares: nums.mass.shares, rank: nums.mass.rank, want: 3 },
		{ shares: nums.along, rank: 1, want: 1 },
		{ shares: nums.tilted.shares, rank: nums.tilted.rank, want: 1 }
	];
	check(panels[0].shares[2] === 1 || near(panels[0].shares[2], 1, 1e-12), 'the mass\'s bar is not 1');
	check(near(panels[1].shares[4], 1, 1e-12), 'the wave\'s bar is not 1');
	check(panels[2].shares.every((v, i) => v.toFixed(4) === BARS60[i]), 'the tilted bars');
	const left0 = ORIGIN - (3 * PW + 2 * GAP) / 2, top = ORIGIN;
	const sx = (P) => P.X(0);                  // the sketch stands over the bar m = 0

	for (const [i, p] of panels.entries()) {
		check(p.rank === p.want, `panel ${i}: rank ${p.rank}`);
		check(near(p.shares.reduce((s, v) => s + v * v, 0), 1, 1e-12), `panel ${i}: the squares do not add to one`);
		const P = new Plot({ left: left0 + i * (PW + GAP), top, w: PW, h: PH, x0: -2.5, x1: 2.5, y0: 0, y1: 1 });
		// ---- the bars
		for (const [j, m] of WEIGHTS.entries()) {
			const h = p.shares[j];
			if (h < ZERO) continue;
			const x0 = P.X(m) - BAR / 2, y0 = P.Y(h);
			S.raw(`<rect x="${n2(x0)}" y="${n2(y0)}" width="${BAR}" height="${n2(P.bottom - y0)}" fill="${INK}" fill-opacity="${FILL}" stroke="${INK}" stroke-width="${OUTLINE}"/>`, 2);
			S.boxes.push({ box: { l: x0 - OUTLINE / 2, r: x0 + BAR + OUTLINE / 2, t: y0 - OUTLINE / 2, b: P.bottom }, what: `panel ${i}: the bar ${m}` });
		}
		// ---- the axes: m along the foot, the scale on the first panel only
		L.push(...(await xAxis(S, P, { ticks: WEIGHTS, fmt: (t) => `${t}`, what: `panel ${i}'s m axis` })));
		if (i === 0) L.push(...(await yAxis(S, P, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '0.5' : `${t}`), what: 'the scale' })));
		// ---- the rank, under the numbers
		const under = P.bottom + TICK + NUM + 8.6;
		L.push(await placed(`\\text{rank }${p.rank}`, P.X(0), under + 3, 0.5, 0, INK));

		// ---- the sketch: the pixel, the axis z up from it, and the source
		const base = [sx(P), top - SKETCH_GAP], tip = [base[0], base[1] - SKETCH];
		S.arrow(base, tip, { color: INK, width: AXIS, head: AXIS_HEAD, layer: 3, what: `panel ${i}'s z` });
		S.raw(`<circle cx="${n2(base[0])}" cy="${n2(base[1])}" r="${PIX}" fill="${INK}"/>`, 4);
		S.mark([base], PIX, `panel ${i}'s pixel`);
		const crests = (k) => {
			// crests across the direction k (page, unit), at CRESTS along it from the pixel
			for (const s of CRESTS) {
				const c = [base[0] + k[0] * s * SKETCH, base[1] + k[1] * s * SKETCH], a = [-k[1], k[0]];
				S.path([[c[0] - a[0] * CREST_HALF, c[1] - a[1] * CREST_HALF], [c[0] + a[0] * CREST_HALF, c[1] + a[1] * CREST_HALF]], { color: FAINT, width: CREST, layer: 1, cap: 'round', what: `panel ${i}'s crest` });
			}
		};
		let zLabel = '\\hat z';
		if (i === 0) {
			const c = [tip[0], tip[1] - MASS - 2.2];
			S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${MASS}" fill="${MASS_COLOR}" stroke="${INK}" stroke-width="${HAIR}"/>`, 4);
			S.mark([c], MASS + HAIR / 2, 'the mass');
		} else if (i === 1) {
			crests([0, -1]);
			zLabel = '\\hat k = \\hat z';
		} else {
			const t = (60 * Math.PI) / 180, k = [Math.sin(t), -Math.cos(t)];
			const kt = [base[0] + k[0] * SKETCH, base[1] + k[1] * SKETCH];
			S.arrow(base, kt, { color: INK, width: AXIS, head: AXIS_HEAD, layer: 3, what: 'the tilted k' });
			crests(k);
			const arc = Array.from({ length: 61 }, (_, a) => { const u = (a * Math.PI) / 180; return [base[0] + ARC * Math.sin(u), base[1] - ARC * Math.cos(u)]; });
			S.path(arc, { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: 'the arc of 60 degrees' });
			const dir = Math.atan2(-(kt[1] - base[1]), kt[0] - base[0]);
			check(near((dir * 180) / Math.PI, 30, 1e-9), 'the drawn k is not 60 degrees from z');
			L.push(await S.clear('\\hat k', kt[0] + 1.5, kt[1], 0, 0.5, [1, 0]));
		}
		L.push(await S.clear(zLabel, tip[0] + 2.4, tip[1] + 1, 0, 0.5, [1, 0]));
		// ---- the name, over the sketches, the three names' feet on one line (over the tallest sketch, the mass's)
		const foot = tip[1] - 2 * MASS - 2.2 - 6;
		const probe = await stack(TITLES[i], 0, 0, 0.5);
		L.push(await stack(TITLES[i], P.X(0), foot - (probe.box.b - probe.box.t), 0.5));
	}
	// ---- the axis's name, once, under the three
	const foot = Math.max(...L.map((l) => l.box.b));
	L.push(await placed('\\text{spin weight } m \\text{ about } \\hat z', ORIGIN, foot + 6, 0.5, 0, INK));

	S.checkAll(L);
	window[name + '-numbers'] = panels.map((p) => p.shares);
	return finish(S, L, [240, 340]);
}
