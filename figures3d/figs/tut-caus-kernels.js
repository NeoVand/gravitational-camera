// The tutorial, section 4.5 (tutorial/response/causality.md), its first diagram: a response and a kernel that is not
// one. Two charts side by side on the same axes, time t from -3 to 8 in units of 1/omega_0 and the kernel in units of
// 1/m omega_0. Left, "causal": section 4.1's impulse response for Q = 5, e^{-Gamma t/2} sin(omega_d t) / m omega_d
// (Gamma = 0.2 omega_0, omega_d = 0.995 omega_0), in the colour of 4.1's swing, lying on the dotted zero line before
// t = 0 and a decaying sine after. Right, "not a response": the even kernel e^{-|t|/tau} with tau = 1/omega_0, in the
// second accent, rising before t = 0 and symmetric about it. In both the blow is a short upright arrow at t = 0, from
// below the zero line up to it, and the time before the blow, t < 0, is lightly shaded; on the left it is named
// "before the blow". The time axis is at the foot of each chart and the zero line dotted across it, as in 4.1's
// ring-down (figs/tut-osc-ringdown.js), rather than the time axis at zero as the diagram's comment had it, because
// there the axis's numbers would fall on the response's lower swings; on the right the zero line stops where the
// kernel's tail comes down onto it. The axis's name is set once, after the right chart, and the kernel's numbers on
// the left chart only.
// Exact: both curves (the impulse response asserted to solve the cart's law of motion after the blow from rest with
// unit velocity, to be zero before it, and to transform to 4.1's chi(omega); the even kernel asserted to be even and
// to transform to the real 2/(1 + omega^2)), in tut-caus-lib.js, `chapter`. Every curve is sampled so that no two
// neighbouring points are more than a quarter of a point apart. Schematic: the blow's arrow, whose length stands for
// no number.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, pathOf, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { ZERO_LINE, ZERO_DASH } from './tut-bessel-lib.js';
import { PUSH, PUSH_HEAD } from './tut-five-lib.js';
import { TINT } from './tut-gauss-lib.js';
import { INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { chapter, impulse, even, Q_KERNEL } from './tut-caus-lib.js';

const name = 'tut-caus-kernels';
const check = checker(name);

const T0 = -3, T1 = 8;                     // omega_0 t
const Y0 = -0.75, Y1 = 1.1;                // m omega_0 chi
const UNIT = 12.5;                         // points per 1/omega_0
const AMP = 46;                            // points per unit of m omega_0 chi
const GAP = 20;                            // from the left chart's right edge to the right chart's axis
const BLOW = -0.4;                         // the blow's arrow starts here (units of m omega_0 chi)
const TIP_AIR = 1;                         // and stops this far below the zero line's curve
const AIR = 1.4;                           // a line is drawn only where it stands this far clear of the curve beside it

export default async function () {
	const n = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const PW = (T1 - T0) * UNIT, PH = (Y1 - Y0) * AMP;
	const top = ORIGIN - PH / 2, left = ORIGIN - PW - GAP / 2;
	const charts = [
		{ key: 'causal', f: impulse, color: ACCENT, title: '\\text{causal}' },
		{ key: 'even', f: even, color: ACCENT2, title: '\\text{not a response}' }
	].map((c, i) => ({ ...c, P: new Plot({ left: left + i * (PW + GAP), top, w: PW, h: PH, x0: T0, x1: T1, y0: Y0, y1: Y1 }) }));

	// the curves stay inside their charts, 3 pt clear of the foot and the top
	for (const { key, f, P } of charts) {
		for (let t = T0; t <= T1; t += 1e-3) check(P.Y(f(t)) > P.top + 3 && P.Y(f(t)) < P.bottom - 3, `the ${key} curve leaves its chart at ${t}`);
		check(P.Y(BLOW) < P.bottom - 3, 'the blow reaches the foot');
	}
	// the response's lower swings lie below the zero line, where the time axis's numbers would be (the reason the axis
	// is at the foot)
	check(impulse(4) < -0.4 && impulse(6) < -0.1, 'the response has no lower swing at the ticks 4 and 6');

	const tops = [];
	for (const { key, f, color, P } of charts) {
		// ---- the time before the blow, shaded
		const shade = { l: P.left, r: P.X(0), t: P.top, b: P.bottom };
		S.fill(pathOf([[shade.l, shade.t], [shade.r, shade.t], [shade.r, shade.b], [shade.l, shade.b]]), shade, { color: TINT, layer: 0.1, what: `the ${key} shade` });
		// ---- the zero line, the curve
		// (on the right stopped where the kernel's tail comes down onto it, so that the two never run as one line)
		const parts = (t) => AMP * f(t) - (CURVE + ZERO_LINE) / 2 >= AIR;
		let end = T1;
		if (key === 'even') {
			check(parts(T0), 'the even kernel merges with the zero line at the left edge');
			end = 0;
			while (parts(end)) end += 1e-4;
		}
		S.path([[P.left, P.Y(0)], [P.X(end), P.Y(0)]], { color: DIM, width: ZERO_LINE, layer: 0.5, cap: 'butt', dash: ZERO_DASH, what: `the ${key} zero line` });
		const pts = key === 'causal' ? [...graph(P, f, T0, 0), ...graph(P, f, 0, T1).slice(1)] : graph(P, f, T0, T1);
		check(longest(pts) <= 0.2501, `the ${key} curve has a step of ${longest(pts)} pt`);
		S.path(pts, { color, width: CURVE, layer: 2, what: `the ${key} curve` });
		// ---- the blow, up to the zero line at t = 0
		const x = P.X(0), tip = P.Y(0) + CURVE / 2 + TIP_AIR;
		const a = S.arrow([x, P.Y(BLOW)], [x, tip], { color: INK, width: PUSH, head: PUSH_HEAD, layer: 2.5, what: `the ${key} blow` });
		check(a.head <= 0.4 * a.L, `the ${key} blow's head`);
		// ---- the axes; the kernel's numbers on the left only
		const xl = await xAxis(S, P, { ticks: [-2, 0, 2, 4, 6, 8], fmt: (t) => (t < 0 ? `-${-t}` : `${t}`), what: `the ${key} t axis` });
		L.push(...xl);
		const fmt = key === 'causal' ? (v) => (v === 0 ? '0' : v < 0 ? `-${-v}` : `${v}`) : () => null;
		L.push(...(await yAxis(S, P, { ticks: [-0.5, 0, 0.5, 1], fmt, what: `the ${key} chi axis` })));
		if (key === 'even') {
			const last = xl[xl.length - 1];
			L.push(await S.clear('\\omega_0 t', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, [1, 0], { color: DIM }));
		}
		tops.push(P);
	}
	// the even kernel peaks at the blow, the response is zero there
	check(near(even(0), 1, 1e-15) && impulse(0) === 0, 'the kernels at t = 0');

	// ---- the names
	const [PL] = tops;
	L.push(await S.clear('m\\omega_0\\,\\chi(t)', PL.left + 4.5, PL.top, 0, 1, [0, -1], { color: DIM }));
	// "before the blow", in two lines in the shaded time of the left chart, over the flat response
	const cx = (PL.left + PL.X(0)) / 2, cy = PL.Y(0.62);
	const l1 = await placed('\\text{before}', cx, cy - 1.2, 0.5, 1, DIM);
	const l2 = await placed('\\text{the blow}', cx, cy + 1.2, 0.5, 0, DIM);
	l1.on = l2.on = ['the causal shade'];
	for (const l of [l1, l2]) check(l.box.l >= PL.left + LABEL_GAP && l.box.r <= PL.X(0) - LABEL_GAP, `the label ${l.src} leaves the shaded time`);
	L.push(l1, l2);
	// the titles, over the charts
	const highest = Math.min(...S.marks.flatMap((m) => m.pts.map((q) => q[1] - m.r)), ...L.map((l) => l.box.t));
	for (const [i, { title }] of charts.entries()) L.push(await placed(title, (tops[i].left + tops[i].right) / 2, highest - 5, 0.5, 1, INK));

	S.checkAll(L);
	window[name + '-numbers'] = { Q: Q_KERNEL, wd: n.wd, low: impulse(4) };
	return finish(S, L, [240, 340]);
}
