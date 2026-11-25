// The tutorial, chapter 13.8 (tutorial/what-a-field-keeps/holography.md), its first diagram: a stone that turns from a
// ball into a shell and back, and what its monopole outside shows. Left, the stone in section at three times along a
// short time axis running down: t = 0, a uniform ball; T/4, a thick shell; T/2, a thin shell; each cut away and tinted
// in matter's colour by its density, the thin shell a solid ring; outward arrows in the thick shell's hollow for the
// round motion, which is fastest then and at rest at 0 and T/2. Right, two stacked plots against the retarded time
// (t - r/c)/T over two cycles, the monopole Phi_0 at r = 10a in units of G M / a, in the field's colour: above,
// "scalar theory", the boxed -(G/r)[M + Iddot_r(t - r/c)/6c^2] for I_r = M a^2 (0.8 - 0.2 cos wt), its ripple
// magnified 10^12 times; below, "Einstein", the flat -G M / r. Beneath, the three terms of order 1/c^2 of Blanchet and
// Damour's monopole, in units of int T^ii dV / c^2, as a waterfall of bars of heights 1, 1/3 and -4/3, "stress",
// "r^2 term" and "current", whose running total returns to zero, marked "sum = 0".
// Departures from the diagram's comment: the bars stand in a waterfall, each starting where the last ended, so that the
// sum, zero, is where the last bar ends; they are a neutral tint, not a colour of their own; the stone and the ripple
// need a size and a rate, which the comment leaves open: a stone of radius 10 cm swinging once a millisecond, whose
// ripple, (wa/c)^2/30 = 1.5 x 10^-13 of the static pull, is 0.146 of it when magnified, and the caption says so; the
// thick shell is the one with I_r = 0.8 M a^2 at T/4, of inner radius 0.7625 a; the arrows of the motion are drawn at
// T/4 only, where the matter moves, the stone being at rest at 0 and T/2.
// Exact: the curve (tut-holo-lib.js: Iddot_r by differences of I_r, the ripple's size), the flat line, the three
// shells' radii and densities (I_r = 0.6, 0.8 and 1 M a^2, the chapter's 0.6 against 1), the three bars and their sum
// (asserted against the chapter's 1 + 1/3 - 4/3 = 0 and Blanchet and Damour's factors). Schematic: the arrows' length,
// the tints' strengths (in the order of the densities), the stones' size against the plots.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, AXIS, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, TINT } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, MATTER, FIELD, monopole, MAG, WAC2, IR, THICK, BARS, shellIR } from './tut-holo-lib.js';

const name = 'tut-breathing-stone';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const PW = 184, PH = 60, GAP = 22;              // each plot's size, and the air between the two
const T0 = 0, T1 = 2, Y0 = -0.13, Y1 = -0.07;  // retarded time / T; Phi_0 in G M / a at r = 10 a
const R_AT = 10;                                // r / a
const STONE = 15;                               // the stones' radius, points
const STONE_X = 78;                             // from the stones' centres to the plots' left edge
const CURVE = 0.8, EDGE = 0.45, RING = 1.6;
const TINT_BALL = 0.2;                          // the ball's tint; the thick shell's is scaled by its density
const BAR = { w: 26, step: 52, unit: 36, top: 62 };   // bars: width, spacing, points per unit, from the plots' bottom
const SMALL = 7.2;
const caption = 'Look first at the bars: in Einstein\'s theory the three terms of order $1/c^2$ cancel, so the breathing stone sends nothing, while a scalar theory sees its $\\int\\matter\\rho\\,r^2\\,\\dd V$. The ripple is magnified $10^{12}$ times, for a stone of radius 10 cm that swings once a millisecond; the shapes are exact.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'breathing-stone', caption);
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - 30, top = ORIGIN - 110;
	const A = new Plot({ left, top, w: PW, h: PH, x0: T0, x1: T1, y0: Y0, y1: Y1 });
	const B = new Plot({ left, top: top + PH + GAP, w: PW, h: PH, x0: T0, x1: T1, y0: Y0, y1: Y1 });
	const units = 1 / R_AT;                     // G M / r in units of G M / a

	// ---- the two plots: axes, then the curves
	const yt = [-0.12, -0.1, -0.08];
	const fmt = (t) => `{-}${Math.abs(t).toFixed(2)}`;
	for (const [k, P] of [A, B].entries()) {
		L.push(...(await yAxis(S, P, { ticks: yt, fmt, what: `plot ${k}'s axis up` })));
		const xl = await xAxis(S, P, { ticks: [0, 0.5, 1, 1.5, 2], fmt: k ? String : () => null, what: `plot ${k}'s axis across` });
		L.push(...xl);
		if (k) L.push(await placed('(t - r/c)/T', P.X(1), Math.max(...xl.map((l) => l.box.b)) + 3.5, 0.5, 0, DIM));
	}
	L.push(await placed('\\Phi_0\\ \\text{at }r = 10a\\ \\ \\text{(units of }GM/a\\text{)}', A.left - 4, A.top - 9, 0, 1, DIM));
	{
		const n = 800, pts = [];
		for (let i = 0; i <= n; i++) { const p = T0 + ((T1 - T0) * i) / n; pts.push(A.at(p, units * monopole(p, MAG))); }
		check(pts.every(([, y]) => y > A.top + 2 && y < A.bottom - 2), 'the scalar curve leaves its plot');
		S.path(pts, { color: FIELD, width: CURVE, layer: 2, what: 'the scalar curve' });
		check(Math.abs(units * monopole(0, MAG) + 0.1146) < 1e-4 && Math.abs(units * monopole(0.5, MAG) + 0.0854) < 1e-4, 'the curve\'s extremes');
		check(Math.abs(monopole(0.3) + 1) < 2e-13, 'the unmagnified ripple');
		S.path([B.at(T0, -units), B.at(T1, -units)], { color: FIELD, width: CURVE, layer: 2, cap: 'butt', what: 'the flat line' });
	}
	L.push(await placed('\\text{scalar theory, ripple}\\times10^{12}', A.left + 6, A.top + 3, 0, 0, INK, 8));
	L.push(await placed('\\text{Einstein}', B.left + 6, B.top + 3, 0, 0, INK, 8));

	// ---- the stones, in section, down a short time axis
	const cx = left - STONE_X;
	const ys = [A.top + STONE + 2, (A.top + B.bottom) / 2, B.bottom - STONE - 2];
	const phases = [0, 0.25, 0.5];
	const inner = [0, THICK, 1];
	check(phases.every((p, k) => Math.abs(IR(p) - [0.6, 0.8, 1][k]) < 1e-12) && Math.abs(shellIR(THICK) - 0.8) < 1e-12, 'the stones\' I_r');
	for (let k = 0; k < 3; k++) {
		const cy = ys[k], what = `the stone ${k}`;
		if (k === 0) S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${STONE}" fill="${MATTER}" fill-opacity="${TINT_BALL}"/>`, 1);
		if (k === 1) {
			const ri = THICK * STONE, density = 1 / (1 - THICK ** 3);
			const fi = ri - 0.2;                // the tint runs under the inner edge's hairline, leaving no seam
			check(density.toFixed(2) === '1.80', `the thick shell's density ${density}`);
			S.raw(`<path d="M${n2(cx - STONE)},${n2(cy)}a${STONE},${STONE} 0 1,0 ${2 * STONE},0a${STONE},${STONE} 0 1,0 ${-2 * STONE},0ZM${n2(cx - fi)},${n2(cy)}a${n2(fi)},${n2(fi)} 0 1,0 ${n2(2 * fi)},0a${n2(fi)},${n2(fi)} 0 1,0 ${n2(-2 * fi)},0Z" fill="${MATTER}" fill-opacity="${n2(TINT_BALL * density)}" fill-rule="evenodd"/>`, 1);
			S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(ri)}" fill="none" stroke="${INK}" stroke-width="${HAIR * 0.8}"/>`, 1.3);
			// the motion: outward arrows in the hollow
			for (const a of [45, 135, 225, 315]) {
				const u = [Math.cos((a * Math.PI) / 180), -Math.sin((a * Math.PI) / 180)];
				S.arrow([cx + u[0] * 0.22 * STONE, cy + u[1] * 0.22 * STONE], [cx + u[0] * (ri - 1.6), cy + u[1] * (ri - 1.6)], { color: INK, width: 0.45, head: 2.6, what: `the motion ${a}` });
			}
		}
		if (k === 2) S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(STONE - RING / 2)}" fill="none" stroke="${MATTER}" stroke-width="${RING}"/>`, 1.1);
		S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${STONE}" fill="none" stroke="${INK}" stroke-width="${EDGE}"/>`, 1.3);
		S.boxes.push({ box: { l: cx - STONE - EDGE, r: cx + STONE + EDGE, t: cy - STONE - EDGE, b: cy + STONE + EDGE }, what });
	}
	// the names of the three, right of each
	for (const [k, s] of ['\\text{ball}', '\\text{thick shell}', '\\text{thin shell}'].entries()) {
		L.push(await placed(s, cx + STONE + 4, ys[k], 0, 0.5, INK, SMALL));
	}
	// the time axis, left of the stones, its arrow down, and the times
	{
		const x = cx - STONE - 8;
		S.arrow([x, ys[0] - STONE], [x, ys[2] + STONE + 2], { color: DIM, width: AXIS, head: 3.2, what: 'the time axis' });
		for (const [k, s] of ['0', 'T/4', 'T/2'].entries()) {
			S.path([[x - TICK, ys[k]], [x, ys[k]]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the time tick ${k}` });
			L.push(await placed(s, x - TICK - 2.4, ys[k], 1, 0.5, DIM, SMALL));
		}
		L.push(await placed('t', x, ys[2] + STONE + 2 + LABEL_GAP + 0.5, 0.5, 0, DIM, SMALL));
	}

	// ---- the bars: a waterfall of the three terms of order 1/c^2
	{
		const base = B.bottom + BAR.top + 4 / 3 * BAR.unit;   // the zero line
		const x0 = left - 70;               // the chart centred under the stones and the plots
		const Yb = (v) => base - v * BAR.unit;
		let run = 0;
		const names = ['\\text{stress}', 'r^2\\ \\text{term}', '\\text{current}'];
		const values = ['+1', '+\\tfrac13', '-\\tfrac43'];
		check(BARS.length === 3 && Math.abs(BARS.reduce((a, b) => a + b, 0)) < 1e-15, 'the bars do not sum to zero');
		const zeroEnd = x0 + 2 * BAR.step + BAR.w + 30;
		S.path([[x0 - 8, base], [zeroEnd, base]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: 'the zero line' });
		for (let k = 0; k < 3; k++) {
			const xl = x0 + k * BAR.step, xr = xl + BAR.w;
			const a = run, b = run + BARS[k];
			const t = Math.min(Yb(a), Yb(b)), bt = Math.max(Yb(a), Yb(b));
			S.raw(`<rect x="${n2(xl)}" y="${n2(t)}" width="${BAR.w}" height="${n2(bt - t)}" fill="${TINT}" stroke="${INK}" stroke-width="${EDGE}"/>`, 1.2);
			S.boxes.push({ box: { l: xl - EDGE / 2, r: xr + EDGE / 2, t: t - EDGE / 2, b: bt + EDGE / 2 }, what: `the bar ${k}` });
			// the connector to the next bar, dotted, at the running total
			if (k < 2) S.dots([xr, Yb(b)], [xr + BAR.step - BAR.w, Yb(b)], { color: FAINT, clear0: 1.2, clear1: 1.2, layer: 1, what: `the connector ${k}` });
			// the rises' values above them, the fall's beside it
			if (BARS[k] > 0) L.push(await placed(values[k], (xl + xr) / 2, t - 3, 0.5, 1, INK, 8));
			else L.push(await placed(values[k], xr + 3, (t + bt) / 2, 0, 0.5, INK, 8));
			L.push(await placed(names[k], (xl + xr) / 2, base + 12, 0.5, 1, INK, SMALL));   // on one baseline: no name descends
			run = b;
		}
		check(Math.abs(run) < 1e-15, 'the waterfall does not end at zero');
		{
			// the sum, at the zero line's right end
			const q = [zeroEnd, base];
			S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="1.5" fill="${INK}"/>`, 2);
			S.mark([q], 1.5, 'the sum');
			L.push(await placed('\\text{sum} = 0', q[0] + 4.5, base, 0, 0.5, INK, 8));
		}
		L.push(await placed('\\text{terms of order }1/c^2\\ \\ \\text{(units of }\\textstyle\\int T^{ii}\\,dV/c^2\\text{)}', x0 - 8, Yb(4 / 3) - 17, 0, 1, DIM));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ripple: WAC2 / 30, magnified: (MAG * WAC2) / 30, thick: THICK };
	return finish(S, L, [260, 340]);
}
