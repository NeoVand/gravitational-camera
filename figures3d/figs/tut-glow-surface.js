// The tutorial, section 10.3 (tutorial/glow/why-matter-barely-glows.md), its sixth diagram: a body glows through its
// volume, not its surface. Two parts side by side. Left: a ball in section, section 2.5's sawn steel ball in matter's
// colour (figs/tut-null-lib.js), its inside strewn with short wavy arrows, the friction inside, and at its rim three
// sets of ripples running in from the edge, the sound launched where a wave meets the surface; named over and under it,
// "surface: sound launched at the edge, proportional to R^2" and "volume: friction inside, proportional to R^3 / l_s".
// Right: P_V / P_S against the radius R on logarithmic axes, R from 0.1 nm to 1 m and the ratio from 10^-3 to 10^10,
// both straight lines of slope one: the steel ball's 0.89 R / l_s (l_s = 0.83 nm), and diamond's R / 165 nm; the ratio 1
// dotted; a dot where diamond's line passes 1, "diamond, 165 nm", and a dot on the steel line at R = 10 cm, "steel
// ball: 1.1 x 10^8". Lines neutral; no orange or blue.
// Departures from the diagram's comment: the two parts stay side by side on a phone, the figure being one drawing;
// each of the ball's labels stands on two lines; the axes are numbered at 1 nm, 1 µm, 1 mm and 1 m across and at 1,
// 10^4 and 10^8 up, every decade ticked; the two lines are named at their upper ends, "steel" and "diamond".
// Exact: the two lines (tut-glow-lib.js: the chapter's P_V / P_S for the steel ball, asserted against P_V and P_S
// themselves; diamond's from R = 3 (P_S / 4 pi R^2) / (P/V) with the paper's sound speeds, its lattice's density and
// the table's P/V), the two dots and their numbers. Schematic, as the caption says: the arrows and the ripples.
// Pictorial: the stone, as in section 2.5.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, LABEL_GAP, SIZE, AXIS, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, NUM } from './tut-prob-lib.js';
import { tex, INK, DIM } from '../lib.js';
import { ballFace, stoneDefs, stone, rim, STONE_INK } from './tut-null-lib.js';
import { uniforms } from './tut-prob-lib.js';
import { chapter, palette, near, steelRatio, diamondRatio, DIAMOND_CROSS } from './tut-glow-lib.js';

const name = 'tut-glow-surface';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const RB = 44;                                  // the ball's radius
const LOGX = [-10, 0], LOGY = [-3, 10];         // the plot's decades: R in metres, P_V / P_S
const DXD = 15.5, DYD = 10.2;                   // points per decade across and up
const GAP = 34;                                 // from the ball's right edge to the plot's axis up
const LINE = 0.7, DOT = 1.55;
const DOTTED = [0, 1.6], DOTTED_W = 0.6;
const WAVE = { n: 9, len: 12, amp: 0.95, period: 3.6, width: 0.5, head: 2.6 };  // the arrows inside
const RIPPLE = { at: [118, 62, 205], radii: [4.5, 8.5, 12.5], width: 0.45 };       // the ripples: their places (deg), radii
const LEAD = 10.5;
const caption = 'Look first at the dots on the right: even diamond, the faintest of the materials, glows more through its volume than through its surface once it is larger than 165 nm, and a steel ball of 10 cm glows about a hundred million times more through its volume. The ripples on the left are schematic; the lines are exact.';

/** Two lines of text, centred on x, the first baseline at y. */
async function twoLines(a, b, x, y, color = INK) {
	const one = await tex(a, [x, y], SIZE, 'cB', color), two = await tex(b, [x, y + LEAD], SIZE, 'cB', color);
	const p = boxOf(one), q = boxOf(two);
	return { src: `${a} / ${b}`, svg: one + two, box: { l: Math.min(p.l, q.l), r: Math.max(p.r, q.r), t: p.t, b: q.b } };
}

export default async function () {
	const { state, steel } = await chapter(check);
	await palette(check);
	state(name, 'glow-surface', caption);

	const S = new Sheet(name);
	const L = [];
	const W = (LOGX[1] - LOGX[0]) * DXD, H = (LOGY[1] - LOGY[0]) * DYD;
	const total = 2 * RB + GAP + W;
	const cx = ORIGIN - total / 2 + RB, cy = ORIGIN;
	const P = new Plot({ left: cx + RB + GAP, top: ORIGIN - H / 2, w: W, h: H, x0: LOGX[0], x1: LOGX[1], y0: LOGY[0], y1: LOGY[1] });

	// ---- the ball: the stone, its edge
	const face = await ballFace();
	S.raw(stoneDefs(`${name}-face`, face, RB), -1);
	S.raw(stone(`${name}-stone`, `${name}-face`, cx, cy, RB), 0);
	S.raw(rim(cx, cy, RB), 0.7);

	// ---- inside, short wavy arrows in every direction (seeded, so every render draws the same), none near the edge
	{
		const u = uniforms(103);
		const placedAt = [];
		let tries = 0;
		while (placedAt.length < WAVE.n && tries++ < 5000) {
			const r = 0.72 * RB * Math.sqrt(u()), t = 2 * Math.PI * u(), a = 2 * Math.PI * u();
			const c = [cx + r * Math.cos(t), cy + r * Math.sin(t)];
			const d = [Math.cos(a), Math.sin(a)];
			const ends = [-0.5, 0.5].map((s) => [c[0] + s * WAVE.len * d[0], c[1] + s * WAVE.len * d[1]]);
			if (ends.some(([x, y]) => Math.hypot(x - cx, y - cy) > RB - 6)) continue;
			if (placedAt.some((q) => Math.hypot(q[0] - c[0], q[1] - c[1]) < WAVE.len * 1.25)) continue;
			// clear of the ripples at the rim
			const ripples = RIPPLE.at.map((deg) => [cx + RB * Math.cos((deg * Math.PI) / 180), cy - RB * Math.sin((deg * Math.PI) / 180)]);
			if ([...ends, c].some((e) => ripples.some((q) => Math.hypot(e[0] - q[0], e[1] - q[1]) < RIPPLE.radii[RIPPLE.radii.length - 1] + 4))) continue;
			placedAt.push(c);
			// the wiggle: a sine across the shaft, whole periods, ending on the axis where the head begins
			const shaft = WAVE.len - WAVE.head, k = Math.max(1, Math.round(shaft / WAVE.period)), per = shaft / k;
			const n = [-d[1], d[0]], a0 = ends[0];
			const pts = Array.from({ length: 80 * k + 1 }, (_, i) => {
				const s = (i / (80 * k)) * shaft;
				const w = WAVE.amp * Math.sin((2 * Math.PI * s) / per);
				return [a0[0] + d[0] * s + n[0] * w, a0[1] + d[1] * s + n[1] * w];
			});
			const tip = ends[1], base = [tip[0] - d[0] * WAVE.head, tip[1] - d[1] * WAVE.head], hw = 0.36 * WAVE.head;
			S.raw(`<path d="M${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${STONE_INK}" stroke-width="${WAVE.width}" stroke-linecap="round" stroke-linejoin="round"/>` +
				`<path d="M${n2(tip[0])},${n2(tip[1])}L${n2(base[0] + n[0] * hw)},${n2(base[1] + n[1] * hw)}L${n2(base[0] - n[0] * hw)},${n2(base[1] - n[1] * hw)}Z" fill="${STONE_INK}"/>`, 1);
		}
		check(placedAt.length === WAVE.n, `only ${placedAt.length} wavy arrows found room`);
	}
	// ---- at the rim, ripples: arcs about a point of the edge, inside the ball only, fading inward
	S.raw(`<clipPath id="${name}-inside"><circle cx="${n2(cx)}" cy="${n2(cy)}" r="${RB}"/></clipPath>`, 0.8);
	for (const deg of RIPPLE.at) {
		const t = (deg * Math.PI) / 180, p = [cx + RB * Math.cos(t), cy - RB * Math.sin(t)];
		const arcs = RIPPLE.radii.map((r, i) => `<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${r}" fill="none" stroke="${STONE_INK}" stroke-width="${RIPPLE.width}" stroke-opacity="${(1 - 0.28 * i).toFixed(2)}"/>`).join('');
		S.raw(`<g clip-path="url(#${name}-inside)">${arcs}</g>`, 0.9);
	}
	S.mark([[cx, cy]], RB + 0.2, 'the ball');

	// ---- the ball's two names, over and under it
	L.push(await twoLines('\\text{surface: sound launched}', '\\text{at the edge,}\\propto R^2', cx, cy - RB - LABEL_GAP - 2.4 - LEAD, INK));
	L.push(await twoLines('\\text{volume: friction}', '\\text{inside,}\\propto R^3/\\ell_s', cx, cy + RB + LABEL_GAP + 9.2, INK));

	// ---- the plot's axes: decades ticked, a few numbered
	const X = (R) => P.X(Math.log10(R)), Y = (v) => P.Y(Math.log10(v));
	S.path([[P.left, P.bottom], [P.right, P.bottom]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the axis across' });
	S.path([[P.left, P.bottom], [P.left, P.top]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the axis up' });
	for (let e = LOGX[0]; e <= LOGX[1]; e++) S.path([[P.X(e), P.bottom], [P.X(e), P.bottom + (e % 3 === 0 ? TICK : TICK * 0.6)]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at 10^${e} m` });
	for (let e = LOGY[0]; e <= LOGY[1]; e++) S.path([[P.left, P.Y(e)], [P.left - (e % 4 === 0 ? TICK : TICK * 0.6), P.Y(e)]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at 10^${e}` });
	const xs = [[-9, '1\\,\\mathrm{nm}'], [-6, '1\\,\\mathrm{\\mu m}'], [-3, '1\\,\\mathrm{mm}'], [0, '1\\,\\mathrm{m}']];
	const xl = [];
	for (const [e, s] of xs) xl.push(await placed(s, P.X(e), P.bottom + TICK + NUM, 0.5, 0, DIM));
	L.push(...xl);
	L.push(await placed('\\text{radius } R', P.X((LOGX[0] + LOGX[1]) / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
	const yl = [];
	for (const [e, s] of [[0, '1'], [4, '10^4'], [8, '10^8']]) yl.push(await placed(s, P.left - TICK - NUM, P.Y(e), 1, 0.5, DIM));
	L.push(...yl);
	L.push(await placed('P_V/P_S', Math.min(...yl.map((l) => l.box.l)), P.top - 7, 0, 1, DIM));

	// ---- the ratio 1, dotted; the two lines
	S.path([[P.left, Y(1)], [P.right, Y(1)]], { color: DIM, width: DOTTED_W, dash: DOTTED, cap: 'round', layer: 1.2, what: 'the ratio 1' });
	const lineOf = (f, what) => {
		// a straight line in the logarithms: its ends where it leaves the frame
		const ends = [];
		for (const e of [LOGX[0], LOGX[1]]) ends.push([e, Math.log10(f(10 ** e))]);
		const slope = (ends[1][1] - ends[0][1]) / (ends[1][0] - ends[0][0]);
		check(near(slope, 1, 1e-12), `${what} does not have slope one`);
		for (const e of [-8.3, -4.1, -0.7]) check(near(Math.log10(f(10 ** e)), ends[0][1] + slope * (e - ends[0][0]), 1e-12), `${what} is not straight`);
		const clip = ([e, v]) => [Math.max(LOGX[0], Math.min(LOGX[1], e)), v];
		let [a, b] = ends;
		if (a[1] < LOGY[0]) a = [a[0] + (LOGY[0] - a[1]) / slope, LOGY[0]];
		if (b[1] > LOGY[1]) b = [b[0] - (b[1] - LOGY[1]) / slope, LOGY[1]];
		const pts = [P.at(...clip(a)), P.at(...clip(b))];
		S.path(pts, { color: INK, width: LINE, layer: 2, cap: 'butt', what });
		return pts;
	};
	const st = lineOf(steelRatio, 'the steel line');
	const di = lineOf(diamondRatio, 'diamond\'s line');
	L.push(await S.clear('\\text{steel}', st[1][0] + LABEL_GAP + 0.6, st[1][1], 0, 0.5, [1, 0]));
	L.push(await S.clear('\\text{diamond}', di[1][0] + LABEL_GAP + 0.6, di[1][1], 0, 0.5, [1, 0]));

	// ---- the dots
	const dot = (q, what) => { S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3); S.mark([q], DOT, what); };
	const qd = [X(DIAMOND_CROSS), Y(1)], qs = [X(0.1), Y(steelRatio(0.1))];
	check(near(diamondRatio(DIAMOND_CROSS), 1, 1e-12) && near(steelRatio(0.1), steel.ratio, 0), 'the dots');
	dot(qd, 'diamond\'s crossing');
	dot(qs, 'the steel ball');
	L.push(await S.clear(`\\text{diamond, ${(DIAMOND_CROSS * 1e9).toFixed(0)} nm}`, qd[0] + 2, qd[1] + DOT + LABEL_GAP + 0.6, 0, 0, [0.6, 0.8]));
	L.push(await S.clear(`\\text{steel ball: }${(steel.ratio / 1e8).toFixed(1)}\\times10^8`, qs[0] - DOT - LABEL_GAP, qs[1] - DOT - LABEL_GAP, 1, 1, [-0.6, -0.8]));

	S.checkAll(L);
	window[name + '-numbers'] = { steel, cross: DIAMOND_CROSS };
	return finish(S, L, [285, 345]);
}
