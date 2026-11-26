// The tutorial, section 13.8 (tutorial/what-a-field-keeps/holography.md), its third diagram: what looking and pushing
// count as the sensitivity grows. One panel on logarithmic axes: across, ln SNR from 6.6 to 300, ticks at the ln of
// 10^3, 10^6, 10^12, 10^30, 10^70 and 10^120, numbered by the SNR; up, the count from 10 to 10^7 (decade ticks). Both
// counts from three radii, R_c = 3a: the looking count N_1 = (floor(L/Lambda) + 1)^2 as its staircase in the field's
// colour, "looking, N_1"; the pushing count N_2 of the paired-tides model in matter's colour, "pushing, N_2", the
// exact staircase of its singular values (drawn to 0.02 pt); its large-L law 0.073 (L/Lambda)^3, dashed in the page's
// dim grey. Thin vertical rules at 10^6, at the paper's 10^70 and at the ceiling S_BH / 2 pi of the Hubble radius,
// 3.6 x 10^121; beside each, low in the empty part of the panel, a disc of radius a cut into square cells of the side
// d = (4 pi / 3 N_2)^(1/3) a there, to scale, its d/a printed.
// Departures from the diagram's comment: the ceiling of a metre, 1.9 x 10^69, lies 0.7 pt from 10^70 on this axis, so
// the two share one rule and one disc (d/a = 0.0255 and 0.0258, both 0.026), named together; the axis across starts
// at 6.6, a little left of the tick at 10^3 (ln 10^3 = 6.91), and has a tick at 10^12, a row of the chapter's table;
// the asymptote is dim grey, not matter's colour, so that where it meets the count at the right it reads as a second
// line; the discs' cells are drawn as a grid of hairlines in matter's colour, which at d/a = 0.026 and 0.015 is finer
// than a screen's pixel and reads as a tint, as it should.
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
const L0 = 6.6, L1 = 300, Y0 = 1, Y1 = 7;
const DX = 160, DY = 34;                        // points per decade
const CURVE = 0.8, LAW = 0.55, DASH = [3, 2], RULE_W = 0.4, TOL = 0.02;
const DISC = 13;                                // the discs' radius, points
const EDGE = 0.45;                              // the discs' outline
const SMALL = 7.2;
const caption = 'Look first at how close the two curves stay: pushing passes looking between $10^3$ and $10^6$ and beats it by a factor of about twelve only at the ceiling. Dashed: the law $0.073(L/\\Lambda)^3$ that pushing approaches. The curves are counted; the discs are drawn to scale.';

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
	for (const [k, Ls] of rules.entries()) {
		const x = P.X(lg(Ls));
		S.path([[x, P.bottom], [x, P.top]], { color: FAINT, width: RULE_W, layer: 0.8, cap: 'butt', what: `the rule ${k}` });
	}

	// ---- the axes
	const ticks = [3, 6, 12, 30, 70, 120];
	const xl = await xAxis(S, P, { ticks: ticks.map((e) => lg(lnOf(e))), fmt: (t) => `10^{${Math.round(10 ** t / ln10)}}`, what: 'the axis across' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [1, 2, 3, 4, 5, 6, 7], fmt: (t) => (t === 1 ? '10' : `10^{${t}}`), what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('\\mathrm{SNR}\\quad(\\text{spaced by }\\mathrm{ln\\,SNR}\\text{, logarithmically})', (P.left + P.right) / 2, below + 4, 0.5, 0, DIM));
	L.push(await placed('\\text{count}', P.left - 4, P.top - 9, 0, 1, DIM));

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
		// low at the left, under the law and left of the rule at 10^6, where the law lies below both counts
		L.push(await placed('0.073(L/\\Lambda)^3', P.X(lg(lnOf(6))) - 2.7, P.bottom - 2.7, 1, 1, DIM, SMALL));
	}

	// ---- the rules' names: the paper's and the metre's left of their rule, the Hubble radius's above the panel
	{
		const x = P.X(lg(lnOf(70)));
		L.push(await placed('\\begin{array}{r}\\text{the paper\'s }10^{70}\\text{ and the}\\\\\\text{ceiling of a metre, }1.9\\times10^{69}\\end{array}', x - 3, P.top + 2, 1, 0, DIM, SMALL));
		const xh = P.X(lg(hubble));
		L.push(await placed('\\text{ceiling of the Hubble radius, }3.6\\times10^{121}', xh + 1, P.top - 4, 1, 1, DIM, SMALL));
	}

	// ---- the discs
	const discs = [
		{ Ls: lnOf(6), cx: (x) => x + 5 + DISC, label: 'right' },
		{ Ls: lnOf(70), cx: (x) => x - 5 - DISC, label: 'above' },
		{ Ls: hubble, cx: (x) => (x + P.X(lg(lnOf(70)))) / 2, label: 'above' }
	];
	const clips = [];
	for (const [k, D] of discs.entries()) {
		const x = P.X(lg(D.Ls)), cx = D.cx(x), cy = P.bottom - 4 - DISC;
		const N = N2(D.Ls), d = dOverA(N), side = d * DISC;
		const id = `p${k}-cells`;
		clips.push(`<clipPath id="${id}"><circle cx="${n2(cx)}" cy="${n2(cy)}" r="${DISC}"/></clipPath>`);
		const lines = [];
		const m = Math.ceil(1 / d);
		for (let i = -m; i <= m; i++) {
			const o = i * side;
			if (Math.abs(o) >= DISC) continue;
			lines.push(`M${(cx + o).toFixed(3)},${(cy - DISC).toFixed(3)}V${(cy + DISC).toFixed(3)}`, `M${(cx - DISC).toFixed(3)},${(cy + o).toFixed(3)}H${(cx + DISC).toFixed(3)}`);
		}
		const w = Math.min(0.3, 0.22 * side);
		S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${DISC}" fill="${MATTER}" fill-opacity="0.08"/>`, 1.1);
		S.raw(`<path d="${lines.join('')}" clip-path="url(#${id})" stroke="${MATTER}" stroke-width="${w.toFixed(3)}" fill="none"/>`, 1.2);
		S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${DISC}" fill="none" stroke="${INK}" stroke-width="${EDGE}"/>`, 1.3);
		S.boxes.push({ box: { l: cx - DISC - EDGE / 2, r: cx + DISC + EDGE / 2, t: cy - DISC - EDGE / 2, b: cy + DISC + EDGE / 2 }, what: `the disc ${k}` });
		// the disc clears the curves above it and the rules beside it
		const shown = d >= 0.1 ? d.toFixed(2) : d.toPrecision(2);
		for (let px = cx - DISC; px <= cx + DISC; px += 0.5) {
			const Ls = 10 ** (P.x0 + ((px - P.left) / P.w) * (P.x1 - P.x0));
			check(Math.max(P.Y(lg(N1(Ls))), P.Y(lg(N2(Ls))), P.Y(lg(law(Ls)))) < cy - DISC - 3, `the disc ${k} touches a curve`);
		}
		for (const Lr of rules) check(Math.abs(P.X(lg(Lr)) - cx) > DISC + 3, `the disc ${k} touches a rule`);
		if (D.label === 'right') L.push(await placed(`d/a = ${shown}`, cx + DISC + 4, cy, 0, 0.5, INK, SMALL));
		else L.push(await placed(shown, cx, cy - DISC - 3, 0.5, 1, INK, SMALL));
		window[name + '-discs'] = [...(window[name + '-discs'] ?? []), { N, d: shown }];
	}
	check(window[name + '-discs'].map((q) => q.d).join() === '0.25,0.026,0.015', 'the discs\' d/a');

	S.checkAll(L);
	window[name + '-numbers'] = { cross, kappa: KAPPA, metre, hubble };
	return finish(S, L, [260, 340], clips.join(''));
}
