// The tutorial, section 13.8 (tutorial/what-a-field-keeps/holography.md), its third diagram: what looking and pushing
// count as the sensitivity grows. One panel on logarithmic axes: across, ln SNR from 6.6 to 300, ticks at the ln of
// 10^3, 10^6, 10^12, 10^30, 10^70 and 10^120, numbered by the SNR; up, the number of independent cells from 10 to 10^7
// (decade ticks), named so above the axis. Both counts from three radii, R_c = 3a: the looking count
// N_1 = (floor(L/Lambda) + 1)^2 as its staircase in the field's colour, "looking, N_1"; the pushing count N_2 of the
// paired-tides model in matter's colour, "pushing, N_2", the exact staircase of its singular values (drawn to 0.02 pt);
// its large-L law 0.073 (L/Lambda)^3, dashed in the page's dim grey, named just under it at 10^45, set along it at
// its slope on the page, where it runs well above the looking count. Thin vertical rules at SNR = 10^6, at 10^70 and at the ceiling S_BH / 2 pi of the Hubble radius,
// 3.6 x 10^121, each named above the panel at the rule's upper end, the rule running up to the name's right end:
// "SNR = 10^6" and "SNR = 10^70, near a metre's ceiling, 1.9 x 10^69" on the row next to the panel, "the Hubble
// radius's ceiling, 3.6 x 10^121" on the row above (its rule passes right of the lower row's names). Low on each rule,
// centred on it (the rule stops above its number), a disc of radius a, the stone in section, cut into square cells of
// the side d = (4 pi / 3 N_2)^(1/3) a there, to scale, its d/a printed above it: at 10^6 a grid of hairlines in
// matter's colour; at the two others the cells, 0.33 and 0.20 points wide, are too fine to draw, and the disc is an
// even tint of matter's colour (the caption says what the discs are and that the finest are too fine to draw).
// Departures from the diagram's comment: the ceiling of a metre, 1.9 x 10^69, lies 0.7 pt from 10^70 on this axis, so
// the two share one rule and one disc (d/a = 0.0255 and 0.0258, both 0.026), named together; the axis across starts
// at 6.6, a little left of the tick at 10^3 (ln 10^3 = 6.91), and has a tick at 10^12, a row of the chapter's table;
// the asymptote is dim grey, not matter's colour, so that where it meets the count at the right it reads as a second
// line.
// Exact: both staircases (tut-holo-lib.js: N_2 from tut-holo-spectrum.js, asserted against the chapter's table, the
// comment's 46 and 1,227,687 and counts.out at the ceilings), the asymptote with kappa = 0.0733 from its integral, the
// ceilings from l_r^2 / 2 l_P^2 (asserted against the chapter's 1.9 x 10^69 and its table's 2.3 x 10^122), the cells'
// sides. Schematic: the discs' places and their common size.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, MATTER, FIELD, LAM, N1, N2, JUMPS, KAPPA, dOverA, ceiling, REGIONS } from './tut-holo-lib.js';

const name = 'tut-cells-vs-snr';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const lg = Math.log10;
const L0 = 6.6, L1 = 300, Y0 = 0.5, Y1 = 7;
const DX = 160, DY = 34;                        // points per decade
const CURVE = 0.8, LAW = 0.55, DASH = [3, 2], RULE_W = 0.4, TOL = 0.02;
const DISC = 13;                                // the discs' radius, points
const EDGE = 0.45;                              // the discs' outline
const SMALL = 7.2;
const FINE = 1.2;                               // cells narrower than this (points) are drawn as an even tint
const ROW = 10.5;                               // between the two rows of the rules' names
const caption = 'Look first at how close the two curves stay: pushing passes looking between $10^3$ and $10^6$ and beats it by a factor of about twelve only at the ceiling. Dashed: the law $0.073(L/\\Lambda)^3$ that pushing approaches. Each disc is the stone, of radius $a$, in section, cut into cubes of side $d$, one for each cell that pushing reads there, to scale; at the two ceilings the cubes are too fine to draw. The curves are counted.';

/** Ramer-Douglas-Peucker on page points, iteratively: the polyline within `tol` points of the original. */
function simplify(pts, tol) {
	const keep = new Uint8Array(pts.length);
	keep[0] = keep[pts.length - 1] = 1;
	const stack = [[0, pts.length - 1]];
	while (stack.length) {
		const [a, b] = stack.pop();
		const [ax, ay] = pts[a], [bx, by] = pts[b];
		const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1e-12;
		let worst = -1, at = -1;
		for (let i = a + 1; i < b; i++) {
			const [px, py] = pts[i];
			// the distance to the segment, not the line
			const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (len * len)));
			const d = Math.hypot(px - ax - t * dx, py - ay - t * dy);
			if (d > worst) { worst = d; at = i; }
		}
		if (worst > tol) { keep[at] = 1; stack.push([a, at], [at, b]); }
	}
	return pts.filter((_, i) => keep[i]);
}

export default async function () {
	const { state } = await chapter(check);
	state(name, 'cells-vs-snr', caption);
	const S = new Sheet(name);
	const L = [];
	const W = lg(L1 / L0) * DX, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: lg(L0), x1: lg(L1), y0: Y0, y1: Y1 });
	const at = (Ls, n) => P.at(lg(Ls), lg(n));
	const ln10 = Math.log(10);
	const lnOf = (e) => e * ln10;

	// ---- the rules and their places
	const metre = Math.log(ceiling(REGIONS.metre)), hubble = Math.log(ceiling(REGIONS.hubble));
	check(Math.abs(P.X(lg(metre)) - P.X(lg(lnOf(70)))) < 1, 'the ceiling of a metre is not on the rule at 10^70');
	const rules = [lnOf(6), lnOf(70), hubble];

	// ---- the axes
	const ticks = [3, 6, 12, 30, 70, 120];
	const xl = await xAxis(S, P, { ticks: ticks.map((e) => lg(lnOf(e))), fmt: (t) => `10^{${Math.round(10 ** t / ln10)}}`, what: 'the axis across' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [1, 2, 3, 4, 5, 6, 7], fmt: (t) => (t === 1 ? '10' : `10^{${t}}`), what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('\\mathrm{SNR}\\quad(\\text{spaced by }\\mathrm{ln\\,SNR}\\text{, logarithmically})', (P.left + P.right) / 2, below + 4, 0.5, 0, DIM));

	// ---- the law, dashed, under the counts
	const law = (Ls) => KAPPA * (Ls / LAM) ** 3;
	check(KAPPA.toFixed(3) === '0.073' && lg(law(L0)) > Y0 && lg(law(L1)) < Y1, 'the law leaves the panel');
	S.path([at(L0, law(L0)), at(L1, law(L1))], { color: DIM, width: LAW, dash: DASH, cap: 'butt', layer: 1.6, what: 'the law' });

	// ---- the looking count, a staircase
	{
		const pts = [at(L0, N1(L0))];
		for (let k = Math.floor(L0 / LAM) + 1; k * LAM < L1; k++) {
			pts.push(at(k * LAM, N1(k * LAM - 1e-9)), at(k * LAM, N1(k * LAM + 1e-9)));
			check(N1(k * LAM + 1e-9) === (k + 1) ** 2, `the step at ${k}`);
		}
		pts.push(at(L1, N1(L1)));
		S.path(pts, { color: FIELD, width: CURVE, layer: 2, what: 'the looking count' });
	}

	// ---- the pushing count, its exact staircase, simplified to TOL points
	{
		let n = N2(L0);
		const raw = [at(L0, n)];
		for (const [t, m] of JUMPS) {
			if (t < L0) continue;
			if (t >= L1) break;
			raw.push(at(t, n));
			n += m;
			raw.push(at(t, n));
		}
		raw.push(at(L1, n));
		check(n === N2(L1), 'the staircase\'s end');
		const pts = simplify(raw, TOL);
		check(pts.every(([, y]) => y >= P.top && y <= P.bottom), 'the pushing count leaves the panel');
		S.path(pts, { color: MATTER, width: CURVE, layer: 2.1, what: 'the pushing count' });
		window[name + '-vertices'] = [raw.length, pts.length];
	}
	// pushing passes looking between 10^3 and 10^6
	let cross = null;
	for (let Ls = lnOf(3); Ls < lnOf(6); Ls += 0.001) if (N2(Ls) > N1(Ls)) { cross = Ls; break; }
	check(cross !== null, 'pushing does not pass looking between 10^3 and 10^6');

	// ---- the names of the curves
	{
		const Ls = 30;
		const lab = await S.clear('\\text{pushing, }N_2', P.X(lg(Ls)), P.Y(lg(N2(Ls))) - 3, 1, 1, [-0.5, -0.87], { color: MATTER });
		check(lab.box.l > P.X(lg(lnOf(6))) + 3, 'the name of the pushing count crosses the rule at 10^6');
		L.push(lab);
	}
	{
		const Ls = 70;
		L.push(await S.clear('\\text{looking, }N_1', P.X(lg(Ls)), P.Y(lg(N1(Ls))) + 4, 0, 0, [0.4, 0.92], { color: FIELD }));
	}
	{
		// set along the law, just under it, at 10^45, where it runs well above the looking count: turned to the law's
		// slope on the page, as a horizontal name would cross one line or the other
		const Ls = lnOf(45), q = at(Ls, law(Ls)), q2 = at(Ls * 1.01, law(Ls * 1.01));
		check(law(Ls) < N2(Ls) && law(Ls) > 4 * N1(Ls), 'the law does not run well above the looking count there');
		const ang = Math.atan2(q2[1] - q[1], q2[0] - q[0]), u = [Math.cos(ang), Math.sin(ang)], nrm = [-u[1], u[0]];   // nrm points down-right of the line
		const probe = await placed('0.073(L/\\Lambda)^3', 0, 0, 0.5, 0.5, DIM, SMALL);
		const hw = (probe.box.r - probe.box.l) / 2, hh = (probe.box.b - probe.box.t) / 2, off = hh + LABEL_GAP + 0.6;
		const c = [q[0] + nrm[0] * off, q[1] + nrm[1] * off];
		S.raw(`<g transform="translate(${n2(c[0])},${n2(c[1])}) rotate(${(ang * 180 / Math.PI).toFixed(2)})">${probe.svg}</g>`, 3);
		// its four corners lie under the law and over the looking count, with air
		const xb = (x) => 10 ** (P.x0 + ((x - P.left) / P.w) * (P.x1 - P.x0));
		const corners = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([a, b]) => [c[0] + u[0] * a + nrm[0] * b, c[1] + u[1] * a + nrm[1] * b]);
		check(corners.every(([x, y]) => y > P.Y(lg(law(xb(x)))) + 1.5 && y < P.Y(lg(N1(xb(x)))) - LABEL_GAP && Math.abs(x - P.X(lg(rules[1]))) > LABEL_GAP), 'the law\'s name reaches a line');
		S.boxes.push({ box: { l: Math.min(...corners.map((p) => p[0])), r: Math.max(...corners.map((p) => p[0])), t: Math.min(...corners.map((p) => p[1])), b: Math.max(...corners.map((p) => p[1])) }, what: 'the law\'s name' });
	}

	// ---- the discs, low on their rules and centred on them, d/a above each
	const clips = [], discTop = [];
	for (const [k, Ls] of rules.entries()) {
		const cx = P.X(lg(Ls)), cy = P.bottom - 4 - DISC;
		const N = N2(Ls), d = dOverA(N), side = d * DISC;
		S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${DISC}" fill="${MATTER}" fill-opacity="${side < FINE ? 0.3 : 0.08}"/>`, 1.1);
		if (side >= FINE) {
			// the cells, a grid of hairlines clipped to the disc
			const id = `p${k}-cells`;
			clips.push(`<clipPath id="${id}"><circle cx="${n2(cx)}" cy="${n2(cy)}" r="${DISC}"/></clipPath>`);
			const lines = [];
			const m = Math.ceil(1 / d);
			for (let i = -m; i <= m; i++) {
				const o = i * side;
				if (Math.abs(o) >= DISC) continue;
				lines.push(`M${(cx + o).toFixed(3)},${(cy - DISC).toFixed(3)}V${(cy + DISC).toFixed(3)}`, `M${(cx - DISC).toFixed(3)},${(cy + o).toFixed(3)}H${(cx + DISC).toFixed(3)}`);
			}
			S.raw(`<path d="${lines.join('')}" clip-path="url(#${id})" stroke="${MATTER}" stroke-width="${Math.min(0.3, 0.22 * side).toFixed(3)}" fill="none"/>`, 1.2);
		}
		S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${DISC}" fill="none" stroke="${INK}" stroke-width="${EDGE}"/>`, 1.3);
		S.boxes.push({ box: { l: cx - DISC - EDGE / 2, r: cx + DISC + EDGE / 2, t: cy - DISC - EDGE / 2, b: cy + DISC + EDGE / 2 }, what: `the disc ${k}` });
		// the disc clears the curves above it and the other rules
		const shown = d >= 0.1 ? d.toFixed(2) : d.toPrecision(2);
		const lab = await placed(k === 0 ? `d/a = ${shown}` : shown, cx, cy - DISC - 3, 0.5, 1, INK, SMALL);
		L.push(lab);
		discTop.push(lab.box.t);
		for (let px = Math.min(lab.box.l, cx - DISC); px <= Math.max(lab.box.r, cx + DISC); px += 0.5) {
			const Lx = 10 ** (P.x0 + ((px - P.left) / P.w) * (P.x1 - P.x0));
			check(Math.max(P.Y(lg(N1(Lx))), P.Y(lg(N2(Lx))), P.Y(lg(law(Lx)))) < lab.box.t - 3, `the disc ${k} or its number touches a curve`);
		}
		for (const [j, Lr] of rules.entries()) if (j !== k) check(Math.abs(P.X(lg(Lr)) - cx) > DISC + 3, `the disc ${k} touches a rule`);
		window[name + '-discs'] = [...(window[name + '-discs'] ?? []), { N, d: shown, side, drawn: side >= FINE }];
	}
	check(window[name + '-discs'].map((q) => q.drawn).join() === 'true,false,false', 'the discs drawn and tinted');

	// ---- the rules' names above the panel, each with its right end on its rule's line: 10^6 and 10^70 on the row next
	// to the panel, the Hubble radius's on the row above, and the axis's name left on that row
	const names = [
		await placed('\\mathrm{SNR} = 10^{6}', P.X(lg(rules[0])) + 0.6, P.top - 4, 1, 1, DIM, SMALL),
		await placed('\\mathrm{SNR} = 10^{70}\\text{, near a metre\'s ceiling, }1.9\\times10^{69}', P.X(lg(rules[1])) + 0.6, P.top - 4, 1, 1, DIM, SMALL),
		null
	];
	names[2] = await placed('\\text{the Hubble radius\'s ceiling, }3.6\\times10^{121}', P.X(lg(rules[2])) + 0.6, names[1].box.t - ROW + 7, 1, 1, DIM, SMALL);
	L.push(...names);
	L.push(await placed('\\text{number of independent cells}', P.left - 4, names[2].box.b, 0, 1, DIM));
	check(names[0].box.r + 4 < names[1].box.l && names[2].box.b + LABEL_GAP < names[1].box.t, 'the rules\' names touch');
	// the rules, from above each disc's number to under its name
	for (const [k, Ls] of rules.entries()) {
		const x = P.X(lg(Ls));
		S.path([[x, discTop[k] - LABEL_GAP - 0.4], [x, names[k].box.b + LABEL_GAP + 0.4]], { color: FAINT, width: RULE_W, layer: 0.8, cap: 'butt', what: `the rule ${k}` });
	}
	check(window[name + '-discs'].map((q) => q.d).join() === '0.25,0.026,0.015', 'the discs\' d/a');

	S.checkAll(L);
	window[name + '-numbers'] = { cross, kappa: KAPPA, metre, hubble };
	return finish(S, L, [260, 340], clips.join(''));
}
