// The tutorial, section 4.6 (tutorial/response/fluctuation-dissipation.md), its fourth diagram: Levin's push for a
// pixel. A section through the shell in the x-z plane, z up. At the centre, the pixel, section 1.4's ring of twelve
// free balls, a tenth of the shell's radius a. The shell, a circle of radius a, its stroke coloured by its change of
// surface density, delta sigma proportional to -n.D.n for D = diag(-1/2, -1/2, 1), in this section -(cos^2 theta -
// sin^2 theta / 2) with theta from z: the first accent (orange) where mass is added, around the equator (+1/2 there),
// the second (blue) where it is removed, at the poles (-1), its weight 3 |delta sigma| points (from 3 at the poles to
// 1.5 at the equator) over a neutral hairline of 0.5, which alone shows where the weight would fall below it, around
// the zeros cos^2 theta = 1/3 (theta = 54.7 degrees and its mirror images), so that the drawn weight runs from 0.5 to
// 3. A body, a disc in the steel ball's grey of radius 0.3 a, its centre at 2a on the x axis. Two arrows between the
// shell and the body: from the shell to the body, "push: energy -f D:E"; from the body to the pixel, "reading: y =
// D:E", passing over the shell through a gap of the page's colour. A small inset at the lower right: one resonance
// line, S_yy solid and 2 k_B T Im chi_yy / omega as dots on it, "ratio -> T". Exact: the pattern (its values, its zeros
// at 54.7 degrees, its degree two and the drive energy -f D:E, asserted in figs/tut-fd-lib.js, `chapter`; the drawn
// weight asserted against 3 |delta sigma| along the shell), the ring's radius a/10, the body's radius and place.
// Schematic: the inset (a cart's line with Q = 5 and its dots, no units), the arrows' places.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';
import { Plot, pathOf } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM, ACCENT, ACCENT2, PAGE } from '../lib.js';
import { STEEL } from './tut-five-lib.js';
import { chapter, pattern, spectrum, dissipation, ZERO } from './tut-fd-lib.js';

const name = 'tut-fd-thermometer';
const check = checker(name);

const A = 80;                             // the shell's radius a, points
const BASE = 0.5;                         // the neutral hairline under the pattern
const WEIGHT = 3;                         // the pattern's weight per unit of |delta sigma| (the poles' -1 gives 3)
const N = 3600;                           // samples round the shell
const BEAD = 1.35;                        // a bead of the pixel's ring
const RING_W = 0.45;
const ARROW = 0.75, HEAD = 4.4;
const LANE = 0.08;                        // the arrows' heights above and below the axis, units of a
const AIR = 2.5;                          // an arrow stops this far from what it leaves or reaches
const HALO = 0.9;                         // the gap cut in the shell's stroke where the reading crosses it
const Q_INSET = 5;
const INSET = { w: 74, h: 42 };
const DOT = 0.95;

export default async function () {
	chapter(check);
	const S = new Sheet(name);
	const L = [];
	const O = [ORIGIN - A, ORIGIN];           // the pixel, the shell's centre
	const at = (psi, r = A) => [O[0] + r * Math.sin(psi), O[1] - r * Math.cos(psi)];   // psi from z, clockwise on the page

	// ---- the shell: the neutral hairline, then the pattern's bands where 3 |delta sigma| >= 0.5
	const circle = Array.from({ length: 721 }, (_, k) => at((k * Math.PI) / 360));
	S.path(circle, { color: DIM, width: BASE, layer: 1, what: 'the shell' });
	const w = (psi) => WEIGHT * Math.abs(pattern(psi));
	const bands = [];
	let run = null;
	for (let k = 0; k <= N; k++) {
		const psi = (2 * Math.PI * k) / N, v = pattern(psi);
		const on = w(psi) >= BASE;
		if (on && (!run || Math.sign(v) !== run.sign)) { if (run) bands.push(run); run = { sign: Math.sign(v), psis: [] }; }
		if (on) run.psis.push(psi);
		else if (run) { bands.push(run); run = null; }
	}
	if (run) bands.push(run);
	// the band that runs over the top (psi = 0 and 2 pi) is one band: join its two halves
	if (bands.length === 5 && bands[0].sign === bands[4].sign) { bands[0].psis = [...bands[4].psis.map((p) => p - 2 * Math.PI), ...bands[0].psis]; bands.pop(); }
	check(bands.length === 4, `the pattern has ${bands.length} bands, not four`);
	check(bands.filter((b) => b.sign > 0).length === 2 && bands.filter((b) => b.sign < 0).length === 2, 'not two orange and two blue bands');
	// each band's ends: where 3 |v| = 0.5, |v| = 1/6, that is cos^2 = 2/9 (orange) or 4/9 (blue); the zero between them
	const deg = (r) => (r * 180) / Math.PI;
	for (const b of bands) {
		const ends = [b.psis[0], b.psis[b.psis.length - 1]].map((p) => Math.abs(Math.cos(p)) ** 2);
		const want = b.sign > 0 ? 2 / 9 : 4 / 9;
		for (const c of ends) check(Math.abs(c - want) < 3e-3, `a band ends at cos^2 = ${c}, not ${want}`);
	}
	for (const b of bands) {
		const outer = b.psis.map((p) => at(p, A + w(p) / 2)), inner = b.psis.map((p) => at(p, A - w(p) / 2)).reverse();
		const pts = [...outer, ...inner];
		const box = { l: Math.min(...pts.map((p) => p[0])), r: Math.max(...pts.map((p) => p[0])), t: Math.min(...pts.map((p) => p[1])), b: Math.max(...pts.map((p) => p[1])) };
		S.fill(pathOf(pts), box, { color: b.sign > 0 ? ACCENT : ACCENT2, layer: 1.2, what: `the ${b.sign > 0 ? 'orange' : 'blue'} band`, solid: false });
		// the band's ink, remembered as its centre line with the half-width of its widest point
		S.mark(b.psis.map((p) => at(p)), Math.max(...b.psis.map(w)) / 2, `the ${b.sign > 0 ? 'orange' : 'blue'} band`);
	}
	// the drawn weight: 3 at the poles, 1.5 at the equator, the hairline alone within the neutral arcs round the zeros
	check(near(w(0), 3, 1e-12) && near(w(Math.PI / 2), 1.5, 1e-12) && near(w(ZERO), 0, 1e-12), 'the weights at the pole, the equator and the zero');
	check(deg(ZERO).toFixed(1) === '54.7', 'the zero is not at 54.7 degrees');
	// orange on the equator, blue at the poles
	check(pattern(Math.PI / 2) > 0 && pattern(0) < 0, 'the colours');

	// ---- the pixel: twelve beads on a circle of radius a/10
	const r = A / 10;
	check(near(r / A, 0.1, 1e-15), 'the ring is not a tenth of the shell');
	S.path(Array.from({ length: 361 }, (_, k) => [O[0] + r * Math.cos((k * Math.PI) / 180), O[1] + r * Math.sin((k * Math.PI) / 180)]), { color: INK, width: RING_W, layer: 2, what: 'the pixel\'s ring' });
	for (let k = 0; k < 12; k++) S.sphere([O[0] + r * Math.cos((k * Math.PI) / 6), O[1] + r * Math.sin((k * Math.PI) / 6)], BEAD, STEEL, { spec: 0.6, shininess: 36, layer: 3 }, `a bead ${k}`);

	// ---- the body: radius 0.3 a, centre at 2a on the x axis
	const B = [O[0] + 2 * A, O[1]], RB = 0.3 * A;
	S.raw(`<circle cx="${n2(B[0])}" cy="${n2(B[1])}" r="${n2(RB)}" fill="${STEEL}"/>`, 1);
	S.mark([B], RB, 'the body');
	check(near(B[0] - O[0], 2 * A, 1e-12) && near(RB, 0.3 * A, 1e-12), 'the body\'s place or size');

	// ---- the arrows, along two lanes LANE a above and below the axis
	const y = (s) => O[1] - s * LANE * A;
	const shellX = O[0] + A * Math.sqrt(1 - LANE * LANE), bodyX = B[0] - RB * Math.sqrt(1 - (LANE * A / RB) ** 2);
	const wLane = w(Math.acos(LANE));
	const push = S.arrow([shellX + wLane / 2 + AIR, y(1)], [bodyX - AIR, y(1)], { color: INK, width: ARROW, head: HEAD, layer: 2, what: 'the push' });
	const read = S.arrow([bodyX - AIR, y(-1)], [O[0] + Math.sqrt((r + BEAD + AIR) ** 2 - (LANE * A) ** 2), y(-1)], { color: INK, width: ARROW, head: HEAD, layer: 2, what: 'the reading' });
	// the reading passes over the shell through a gap of the page's colour
	const cross = [shellX, y(-1)];
	S.raw(`<path d="M${n2(cross[0] - 6)},${n2(cross[1])}H${n2(cross[0] + 6)}" stroke="${PAGE}" stroke-width="${n2(ARROW + 2 * HALO)}" fill="none"/>`, 1.5);
	check(push.L > 30 && read.L > 1.5 * A, 'the arrows are too short');
	// their names: two lines each, over the push and under the reading, between the shell and the body
	const mid = (push.A[0] + push.B[0]) / 2;
	const pushName = ['\\text{push:}', '\\text{energy}', '{-f}\\,D\\!:\\!\\mathcal{E}'];
	const readName = ['\\text{reading:}', 'y = D\\!:\\!\\mathcal{E}'];
	// the push's name upward from its lane, the last line first; the reading's downward from its lane
	const names = [];
	let edge = y(1) - ARROW / 2 - LABEL_GAP - 0.4;
	for (const src of [...pushName].reverse()) { const l = await placed(src, mid, edge, 0.5, 1); names.push(l); edge = l.box.t - 3.2; }
	edge = y(-1) + ARROW / 2 + LABEL_GAP + 0.4;
	for (const src of readName) { const l = await placed(src, mid, edge, 0.5, 0); names.push(l); edge = l.box.b + 3.2; }
	const [pa, pb, ra, rb] = names;
	L.push(...names);
	void [pa, pb, ra, rb];

	// ---- the inset, lower right, under the body: one line, S solid, the dissipation as dots on it
	const I = new Plot({ left: B[0] - INSET.w / 2 + 6, top: O[1] + A - INSET.h, w: INSET.w, h: INSET.h, x0: 0.3, x1: 1.7, y0: -0.6, y1: Q_INSET * 1.08 });
	S.path([[I.left, I.top], [I.left, I.bottom], [I.right, I.bottom]], { color: DIM, width: 0.45, cap: 'butt', what: 'the inset\'s axes' });
	check(Math.min(spectrum(0.3, Q_INSET), spectrum(1.7, Q_INSET)) > 0, 'the inset\'s line touches its axis');
	const pts = graph(I, (x) => spectrum(x, Q_INSET), 0.3, 1.7);
	check(longest(pts) <= 0.2501, 'the inset\'s line is coarse');
	S.path(pts, { color: INK, width: 0.6, layer: 2, what: 'the inset\'s line' });
	const dots = Array.from({ length: 14 }, (_, i) => 0.35 + i * 0.1).map((x) => {
		check(near(dissipation(x, Q_INSET), spectrum(x, Q_INSET), 1e-12), `the inset's dot at ${x} is off its line`);
		return I.at(x, dissipation(x, Q_INSET));
	});
	S.raw(dots.map(([x, yy]) => `<circle cx="${n2(x)}" cy="${n2(yy)}" r="${DOT}" fill="${INK}"/>`).join(''), 3);
	for (const d of dots) S.mark([d], DOT, 'an inset dot');
	L.push(await S.clear('\\omega', I.right + 3, I.bottom, 0, 0.5, [1, 0], { color: DIM }));
	L.push(await S.clear('\\text{ratio} \\to T', I.X(1.13) + 3, I.Y(Q_INSET * 0.62), 0, 0.5, [1, 0]));

	S.checkAll(L);
	window[name + '-numbers'] = { zero: deg(ZERO), bands: bands.map((b) => [deg(b.psis[0]), deg(b.psis[b.psis.length - 1])]) };
	return finish(S, L, [240, 340]);
}
