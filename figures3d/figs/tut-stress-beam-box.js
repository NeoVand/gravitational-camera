// The tutorial, section 6.5 (tutorial/relativity/stress-energy.md), its second diagram: what a beam and a box of light
// pull with. Two panels, "a free beam" over "a box of light" (beside it in the book). Above: a thin horizontal beam in
// the light role's colour from a small laser box at the left to an absorber at the right, both faint, joined by a faint
// bench far below the beam, named "bench, far away". Above the beam, at the distance b marked by a thin dimension line
// named "b", a ring of free beads drawn out by the beam's tide, with "(-1, 1, 0) x 4GP/c^3 b^2" beside it; below the
// bench a second, identical ring the same distance above a thin line in matter's colour, named "line of 2P/c^3 per
// metre", drawn out alike. Below: a closed rectangle with doubled (mirrored) walls, six short arrows in the light
// role's colour inside pointing six ways, named "pressure U/3 each way"; small arrows in matter's colour along the
// walls, pointing inward, named "tension" (drawn otherwise: see below); beside the box a bar of height 1 named "E/c^2"
// and, in faint outline, a bar
// of height 2 named "2E/c^2, the free beam's", crossed by a thin dotted line at 1.
// Departures from the diagram's comment: on the site the panels are stacked at every width, so that the figure stays
// narrow and its text large on a phone, and so the bars stand beside the box, not under it. In the printed book
// (figureLayout 'book') "a box of light" stands at the right of "a free beam", the titles on one line, the beam 170
// points long (the site's 214) so that the two fit the text width, and the bars stand under the box, as the comment
// asks, the pair and its name centred on the box, their baseline level with the line of matter; the box is drawn
// as tall as that leaves room for, and the bars 34 points per unit (the site's 26), so that both columns are of one
// height. (Three columns, the line of matter in one of its own, were tried: 490 points wide, and the box's column
// stood 45 points below the others.) The rings are section 1.5's (and the paper's) rings of twelve free
// steel beads over the dashed undisturbed circle, not eight beads in ink, and they lie in the page; the dashed circle
// leaves out the dashes where it meets the ring, along the beam. In the page, which holds the line to the beam and the
// beam itself, the beam's tide has the eigenvalues -1 along the line to the beam and 0 along the beam: each ring is
// stretched toward the beam (the orange arrows) and not changed along it; the squeeze, the eigenvalue 1, is at right
// angles to the page and is not drawn (the comment's blue squeeze along the beam would be wrong). The tide's
// eigenvalues stand beside the upper ring, not under it, where there is no room between the ring and the beam. The
// dimension line stands left of each ring, its top level with the ring's centre, marked + and joined to it by a dotted
// extension (section 1.4's figure). Under the eigenvalues, in three faint lines, the directions they belong to, "toward
// the beam, out of the page, along it", so that the squeeze 1, which the page cannot show, is at least named. The
// tension's arrows lie along each wall, outside it, in pairs from the wall's middle outward, grey, as the rod's
// "tension" of the chapter's first diagram: the pull that stretches the wall (inward arrows in matter's colour, the
// momentum flux, read as a squeeze). The pressure is written "U/3" for the comment's "(1/3)U", whose small fraction
// would be hard to read on a phone. The bar of 2E/c^2 is named in three lines beside its top, and the bars' baseline
// is named under it, "the mass each pulls with" (two lines on the site).
// Exact: the rings' table diag(0, -1) in (along the beam, toward it), from the line's Hessian (-1, 1, 0) x
// 2 G lambda / b^2 found by differences in tut-stress-lib.js; each ring the image of its circle under 1 - eps T, one
// eps for both, so that the two are alike (asserted bead by bead); the two distances b equal (asserted); the bars'
// heights 1 and 2 in one unit and the dotted line at 1 (asserted); the six pressure arrows equal and 60 degrees apart
// (asserted); each tension's arrow along its wall and pointing away from the wall's middle (asserted). Schematic: eps (exaggerated, as the caption says), the rings' size against b, the arrows' lengths, the
// laser, absorber and bench, and the break in the bench's struts, which says "far away".
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, VEC, VEC_HEAD, LINE, HAIR, DOT, DOT_STEP } from './tut-pot-lib.js';
import { measure } from './tut-rad-lib.js';
import { ring, RING, UNDISTURBED, UNDISTURBED_W } from './tut-five-lib.js';
import { v3, INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, LIGHT, MATTER, lines, lineTide, lineDensity, POWER, BOX_BAR, BEAM_BAR } from './tut-stress-lib.js';

const name = 'tut-stress-beam-box';
const check = checker(name);

const R = 21;                              // the undisturbed ring's radius, points (schematic)
const EPS = 0.25;                          // the rings' strain (exaggerated, as section 1.4's figure)
const BEAD = 2.2;                          // a bead's radius
const REACH = 13;                          // an arrow's length per unit of |T xi|, points
const B = 50;                              // b on the page, points
const PLUS = 2.2;                          // half the arms of the + at a ring's centre
const DIM_X = 16;                          // the dimension line, this far left of the ring's dashed circle
const BOOK = globalThis.figureLayout === 'book';
const SPAN = BOOK ? 170 : 214;             // the beam, from the laser's face to the absorber's, points
const BESIDE = 30;                         // the book's: the air between the free beam's ink and the box's column
const BOX = [15, 10];                      // the laser and the absorber, points
const BEAM = 0.9;                          // the beam's stroke
const DROP = 32;                           // the bench below the beam
const BREAK = 2.4;                         // half the break's marks
const ROW = 6;                             // a title to its panel's ink
const GAP = 18;                            // between the panels
const WALL = 2.2;                          // the doubled wall: the two lines this far apart
const BOX_W = 136, BOX_H0 = 86;            // the box of light, outer (the book's taller: see below)
const RAY = 24;                            // the pressure arrows
const TENSION = 13;                        // the tension arrows
const TEN_OFF = 4.2;                       // the tension arrows, this far outside the wall
const UNIT = BOOK ? 34 : 26;               // a bar's height per unit of E/c^2
const UNDER = 16;                          // the book's: from the tension's arrows under the box to the taller bar's top
const BAR = 13;                            // a bar's width

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - 125;
	const world = ([x, y]) => v3(x - ORIGIN, ORIGIN - y, 0);      // the sheet's panel: a figure point as a world point
	const ink = {
		name, P: S.P,
		at: (p) => S.P.at(p),
		mark: (pts, r, what) => S.mark(pts, r, what),
		curve: (pts, o) => S.path(pts.map((p) => S.P.at(p)), { cap: 'round', ...o }),
		arrow: (a, b, o) => S.arrow(S.P.at(a), S.P.at(b), o)
	};

	// ---- the tide in the page: rows and columns (along the beam, toward it), units of 4GP/c^3 b^2
	const E = lineTide(lineDensity(POWER), 1), unit = 2 * 6.674e-11 * lineDensity(POWER);
	// E's rows are (along the line to the beam, across, along the beam): the page holds the first and the third
	const T = [[E[2][2] / unit, E[2][0] / unit], [E[0][2] / unit, E[0][0] / unit]].map((r) => r.map((v) => +v.toFixed(4) + 0));
	check(T[0][0] === 0 && T[0][1] === 0 && T[1][0] === 0 && T[1][1] === -1, `the page's table is not diag(0, -1): ${T}`);
	check(near(E[1][1] / unit, 1, 1e-5), 'the squeeze out of the page is not 1');

	/** A ring with its centre at the figure point c, its +, the dimension b down to the line at y = c[1] + B, and the
	 * dotted extension from the + to the dimension's top. */
	const drawn = [];
	async function tideRing(c, what) {
		const r = ring(ink, { c: world(c), eh: v3(1, 0, 0), ev: v3(0, 1, 0), R, T, eps: EPS, phase: 0, bead: BEAD, reach: REACH, layer: 1, what, dashedStart: false });
		drawn.push(r);
		// the undisturbed circle, dashed as section 1.5's (a whole number of dashes), but with no dash where it runs
		// within a hair of the ring itself: along the beam the ring is not moved, and there the two coincide
		{
			const total = 2 * Math.PI * R, [on, off] = UNDISTURBED, n = Math.round(total / (on + off)), period = total / n, dash = (on * period) / (on + off);
			const ringPts = r.loop.map((p) => S.P.at(p));
			const tooNear = (q) => ringPts.some((p) => Math.hypot(p[0] - q[0], p[1] - q[1]) < RING / 2 + UNDISTURBED_W / 2 + 0.7) ||
				r.beads.some((b) => { const p = S.P.at(b.p); return Math.hypot(p[0] - q[0], p[1] - q[1]) < BEAD + UNDISTURBED_W / 2 + 0.7; });
			let kept = 0;
			for (let k = 0; k < n; k++) {
				const a0 = (k * period - dash / 2) / R, seg = Array.from({ length: 7 }, (_, j) => a0 + (dash * j) / 6 / R).map((t) => [c[0] + R * Math.cos(t), c[1] - R * Math.sin(t)]);
				if (seg.some(tooNear)) continue;
				S.path(seg, { color: DIM, width: UNDISTURBED_W, cap: 'butt', layer: 1, what: `${what}'s undisturbed circle, dash ${k}` });
				kept++;
			}
			check(kept >= n / 2, `${what}: too few dashes of the undisturbed circle`);
		}
		S.path([[c[0] - PLUS, c[1]], [c[0] + PLUS, c[1]]], { color: INK, width: HAIR, cap: 'butt', layer: 3, what: `${what}'s +` });
		S.path([[c[0], c[1] - PLUS], [c[0], c[1] + PLUS]], { color: INK, width: HAIR, cap: 'butt', layer: 3, what: `${what}'s + (upright)` });
		const x = c[0] - R - DIM_X;
		measure(S, [x, c[1]], [x, c[1] + B], { color: INK, layer: 2, what: `${what}'s dimension` });
		// the extension: dots from the + to the dimension's top, none within a hair of the ring's beads and lines
		const pts = [];
		const n = Math.floor((c[0] - PLUS - 1.2 - (x + 2.5 + 1)) / DOT_STEP);
		for (let k = 0; k <= n; k++) {
			const q = [x + 2.5 + 1 + k * DOT_STEP, c[1]];
			if (S.clearance({ l: q[0], r: q[0], t: q[1], b: q[1] }, (w) => w.startsWith(`${what}'s +`) || w.startsWith(`${what}'s dimension`)).d >= DOT / 2 + 0.8) pts.push(q);
		}
		S.raw(`<path d="${pts.map(([px, py]) => `M${px.toFixed(2)},${py.toFixed(2)}h0`).join('')}" stroke="${DIM}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1);
		for (const q of pts) S.mark([q], DOT / 2, `${what}'s extension`);
		check(pts.length >= 4, `${what}'s extension is too short`);
		L.push(await placed('b', x - TICKLESS - LABEL_GAP, c[1] + B / 2, 1, 0.5, INK));
		return r;
	}
	const TICKLESS = 2.5;                     // half a dimension's tick (tut-rad-lib's TICK)

	// ================= a free beam =================
	const t1 = await placed('\\text{a free beam}', left, ORIGIN - 240, 0, 0, INK);
	L.push(t1);
	const ringTop = R * (1 + EPS) + BEAD + 1.35 + REACH;           // from a ring's centre to its upper arrow's tip
	const c1 = [left + BOX[0] + 12 + DIM_X + R, t1.box.b + ROW + ringTop + 2];      // its dimension 12 points clear of the laser
	const yBeam = c1[1] + B;
	const x0 = left + BOX[0], x1 = x0 + SPAN;                     // the laser's face and the absorber's
	// the laser and the absorber, faint boxes; the beam between them
	S.path([[x0 - BOX[0], yBeam - BOX[1] / 2], [x0, yBeam - BOX[1] / 2], [x0, yBeam + BOX[1] / 2], [x0 - BOX[0], yBeam + BOX[1] / 2]], { color: FAINT, width: AXIS, closed: true, layer: 1, what: 'the laser' });
	S.path([[x1, yBeam - BOX[1] / 2], [x1 + BOX[0], yBeam - BOX[1] / 2], [x1 + BOX[0], yBeam + BOX[1] / 2], [x1, yBeam + BOX[1] / 2]], { color: FAINT, width: AXIS, closed: true, layer: 1, what: 'the absorber' });
	S.path([[x0, yBeam], [x1, yBeam]], { color: LIGHT, width: BEAM, cap: 'butt', layer: 2, what: 'the beam' });
	const ring1 = await tideRing(c1, 'the upper ring');
	// the tide's eigenvalues, beside the ring
	const tideName = await placed('(-1,\\,1,\\,0)\\times\\dfrac{4GP}{c^3b^2}', c1[0] + R + BEAD + 16, c1[1], 0, 0.5, INK);
	L.push(tideName);
	// the order of the three eigenvalues, under them: the squeeze, out of the page, is named, not drawn
	L.push(await lines(S, ['\\text{toward the beam,}', '\\text{out of the page,}', '\\text{along it}'], tideName.box.l, tideName.box.b + 4, 0, 0, [0, 1], DIM, L));
	// the bench: struts down from the laser and the absorber, each broken, and the bench between them
	const yBench = yBeam + DROP;
	for (const [x, what] of [[x0 - BOX[0] / 2, 'the laser\'s strut'], [x1 + BOX[0] / 2, 'the absorber\'s strut']]) {
		const top = yBeam + BOX[1] / 2, mid = (top + yBench) / 2;
		S.path([[x, top], [x, mid - 2]], { color: FAINT, width: AXIS, cap: 'butt', layer: 1, what: `${what}, above` });
		S.path([[x, mid + 2], [x, yBench]], { color: FAINT, width: AXIS, cap: 'butt', layer: 1, what: `${what}, below` });
		for (const dy of [-2, 2]) S.path([[x - BREAK, mid + dy + 1.2], [x + BREAK, mid + dy - 1.2]], { color: FAINT, width: AXIS, cap: 'butt', layer: 1, what: `${what}'s break` });
	}
	S.path([[x0 - BOX[0] / 2, yBench], [x1 + BOX[0] / 2, yBench]], { color: FAINT, width: 0.8, cap: 'butt', layer: 1, what: 'the bench' });
	const benchName = await placed('\\text{bench, far away}', (x0 + x1) / 2, yBench + 0.6 + LABEL_GAP + 0.4, 0.5, 0, DIM);
	L.push(benchName);

	// the line of matter, with the second ring the same b above it
	const c2 = [c1[0], benchName.box.b + 12 + ringTop];
	const yLine = c2[1] + B;
	S.path([[x0, yLine], [x1, yLine]], { color: MATTER, width: BEAM, cap: 'butt', layer: 2, what: 'the line of matter' });
	const ring2 = await tideRing(c2, 'the lower ring');
	check(near(yBeam - c1[1], yLine - c2[1], 1e-12), 'the two rings are not the same distance from their lines');
	// alike: every bead of the second is the first's, moved down
	ring1.beads.forEach((b, k) => {
		const p = S.P.at(b.p), q = S.P.at(ring2.beads[k].p);
		check(near(q[0] - p[0], 0, 1e-9) && near(q[1] - p[1], c2[1] - c1[1], 1e-9), `bead ${k} of the two rings differs`);
	});
	// stretched toward the line and unchanged along it: semi-axes R (1 + eps) upright and R level
	{
		const ys = ring1.loop.map((p) => S.P.at(p)[1]), xs = ring1.loop.map((p) => S.P.at(p)[0]);
		check(near((Math.max(...ys) - Math.min(...ys)) / 2, R * (1 + EPS), 1e-6) && near((Math.max(...xs) - Math.min(...xs)) / 2, R, 1e-3), 'the ring is not R(1 + eps) by R');
		const orange = ring1.arrows.filter((a) => a.stretch), blue = ring1.arrows.filter((a) => !a.stretch);
		check(orange.length === 2 && blue.length === 0, 'the ring has not two stretch arrows and no squeeze');
		for (const a of orange) check(near(Math.abs(a.B[1] - a.A[1]), a.L, 1e-9), 'a stretch arrow is not upright');
	}
	check(near(lineDensity(POWER) * 2.998e8 ** 3 / POWER, 2, 1e-12), 'the line is not 2P/c^3 per metre');
	L.push(await placed('\\text{line of } 2P/c^3 \\text{ per metre}', (x0 + x1) / 2, yLine + LINE / 2 + LABEL_GAP + 0.4, 0.5, 0, MATTER));

	// ================= a box of light =================
	// on the site below the free beam; in the book at its right, the titles on one line, the bars under the box with
	// their baseline level with the line of matter
	const bottom1 = Math.max(...L.map((l) => l.box.b));
	const right1 = Math.max(...L.map((l) => l.box.r), ...S.marks.flatMap((m) => m.pts.map((p) => p[0] + m.r)));
	const left2 = BOOK ? right1 + BESIDE : left;
	const t2 = await placed('\\text{a box of light}', left2, BOOK ? t1.box.t : bottom1 + GAP, 0, 0, INK);
	L.push(t2);
	const bx = left2 + TENSION + TEN_OFF + 4, by = t2.box.b + ROW + TEN_OFF + 8 + 10;     // the box's outer corner
	// in the book the box is as tall as leaves the bars under it their baseline level with the line of matter, so
	// that the box's column is as tall as the free beam's
	const BOX_H = BOOK ? yLine - BEAM_BAR * UNIT - UNDER - TEN_OFF - by : BOX_H0;
	check(BOX_H >= BOX_H0, `the box is ${BOX_H} points tall`);
	const rect = (l, t, w, h, what) => S.path([[l, t], [l + w, t], [l + w, t + h], [l, t + h]], { color: INK, width: AXIS, closed: true, layer: 2, what });
	rect(bx, by, BOX_W, BOX_H, 'the outer wall');
	rect(bx + WALL, by + WALL, BOX_W - 2 * WALL, BOX_H - 2 * WALL, 'the inner wall');
	// the light: six arrows from the star's centre, 60 degrees apart, equal
	const star = [bx + 42, by + BOX_H / 2];
	const rays = [];
	for (let k = 0; k < 6; k++) {
		const th = (k * Math.PI) / 3, u = [Math.cos(th), -Math.sin(th)];
		rays.push(S.arrow([star[0] + u[0] * 2.4, star[1] + u[1] * 2.4], [star[0] + u[0] * (2.4 + RAY), star[1] + u[1] * (2.4 + RAY)], { color: LIGHT, width: VEC, head: VEC_HEAD, layer: 3, what: `the light's arrow ${k}` }));
	}
	rays.forEach((a, k) => check(near(a.L, RAY, 1e-9) && near(a.u[0], Math.cos((k * Math.PI) / 3), 1e-12) && near(-a.u[1], Math.sin((k * Math.PI) / 3), 1e-12), `the light's arrow ${k}`));
	check(star[0] - RAY - 2.4 - VEC_HEAD > bx + WALL + 2 && star[1] - RAY > by + WALL + 2, 'the star reaches the walls');
	L.push(await lines(S, ['\\text{pressure}', '\\mathcal U/3 \\text{ each way}'], star[0] + RAY + 10, star[1], 0, 0.5, [1, 0], LIGHT, L));
	// the walls' tension: on each wall, outside it, two grey arrows along it from its middle outward, the pull that
	// stretches the wall (the rod's "tension" of the chapter's first diagram)
	const mx = bx + BOX_W / 2, my = by + BOX_H / 2;
	const tens = [];
	for (const [wall, a1, a0] of [
		['top', [bx + BOX_W * 0.2, by - TEN_OFF], [mx - 6, by - TEN_OFF]], ['top', [bx + BOX_W * 0.8, by - TEN_OFF], [mx + 6, by - TEN_OFF]],
		['bottom', [bx + BOX_W * 0.2, by + BOX_H + TEN_OFF], [mx - 6, by + BOX_H + TEN_OFF]], ['bottom', [bx + BOX_W * 0.8, by + BOX_H + TEN_OFF], [mx + 6, by + BOX_H + TEN_OFF]],
		['left', [bx - TEN_OFF, by + BOX_H * 0.12], [bx - TEN_OFF, my - 5]], ['left', [bx - TEN_OFF, by + BOX_H * 0.88], [bx - TEN_OFF, my + 5]],
		['right', [bx + BOX_W + TEN_OFF, by + BOX_H * 0.12], [bx + BOX_W + TEN_OFF, my - 5]], ['right', [bx + BOX_W + TEN_OFF, by + BOX_H * 0.88], [bx + BOX_W + TEN_OFF, my + 5]]
	]) tens.push(S.arrow(a0, a1, { color: DIM, width: VEC, head: VEC_HEAD, layer: 3, what: `the ${wall} wall's tension` }));
	// outward: each arrow points away from its wall's middle
	for (const [j, t] of tens.entries()) check((t.B[0] - mx) * t.u[0] + (t.B[1] - my) * t.u[1] > 0 && (Math.abs(t.u[0]) === 1 || Math.abs(t.u[1]) === 1), `the tension's arrow ${j} does not pull outward along its wall`);
	L.push(await S.clear('\\text{tension}', bx + BOX_W * 0.8 + LABEL_GAP + 0.6, by - TEN_OFF, 0, 0.5, [0, -1], { color: DIM }));
	// the bars, beside the box, on one baseline level with the box's bottom (in the book: under the box, the pair
	// and its name centred on the box, on a baseline level with the line of matter)
	const BARS_W = 2 * BAR + 9, NAME_W = 36;      // the pair of bars; their name at the right, about
	const base = BOOK ? by + BOX_H + TEN_OFF + UNDER + BEAM_BAR * UNIT : by + BOX_H;
	check(!BOOK || near(base, yLine, 1e-9), 'the bars\' baseline is not level with the line of matter');
	const b1 = BOOK ? mx - (BARS_W + LABEL_GAP + 1 + NAME_W) / 2 : bx + BOX_W + TEN_OFF + 16, b2 = b1 + BAR + 9;
	S.fill(`M${b1},${base - BOX_BAR * UNIT}H${b1 + BAR}V${base}H${b1}Z`, { l: b1, r: b1 + BAR, t: base - BOX_BAR * UNIT, b: base }, { color: MATTER, layer: 2, what: 'the box\'s bar' });
	S.path([[b2 + AXIS / 2, base], [b2 + AXIS / 2, base - BEAM_BAR * UNIT + AXIS / 2], [b2 + BAR - AXIS / 2, base - BEAM_BAR * UNIT + AXIS / 2], [b2 + BAR - AXIS / 2, base]], { color: FAINT, width: AXIS, cap: 'butt', layer: 2, what: 'the free beam\'s bar' });
	S.path([[b1 - 3, base + AXIS / 2], [b2 + BAR + 3, base + AXIS / 2]], { color: DIM, width: AXIS, cap: 'butt', layer: 2, what: 'the bars\' baseline' });
	check(BOX_BAR === 1 && BEAM_BAR === 2, 'the bars are not 1 and 2');
	S.dots([b1 + BAR + 0.9, base - BOX_BAR * UNIT], [b2 + BAR - AXIS, base - BOX_BAR * UNIT], { color: DIM, layer: 3, what: 'the dotted line at 1' });
	check(near(base - (base - BOX_BAR * UNIT), UNIT, 1e-12) && near(base - (base - BEAM_BAR * UNIT), 2 * UNIT, 1e-12), 'the bars\' heights are not 1 and 2 units');
	L.push(await placed('E/c^2', b1 + BAR / 2, base - BOX_BAR * UNIT - LABEL_GAP - 0.6, 0.5, 1, MATTER));
	L.push(await lines(S, ['2E/c^2,', '\\text{the free}', '\\text{beam\'s}'], b2 + BAR + LABEL_GAP + 1, base - BEAM_BAR * UNIT, 0, 0, [0, 1], DIM, L));
	// what the bars measure, under their baseline
	L.push(await lines(S, BOOK ? ['\\text{the mass each pulls with}'] : ['\\text{the mass}', '\\text{each pulls with}'], (b1 + b2 + BAR) / 2, base + LINE / 2 + LABEL_GAP + 0.4, 0.5, 0, [0, 1], DIM, L));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, table: T };
	return finish(S, L, BOOK ? [380, 460] : [240, 320]);
}
