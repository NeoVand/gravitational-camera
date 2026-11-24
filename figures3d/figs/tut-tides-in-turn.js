// The tutorial, chapter 13.4 (tutorial/what-a-field-keeps/flows-inside.md), its first diagram: two tides in turn. Left,
// two timelines stacked, each a short arrow of time from t = 0 to tau: above, a kick (an impulse, drawn as a spike)
// "kick g" at t = 0 and an eye "read h" at tau; below, "kick h" and "read g". Right, the response delta Q / eps against
// tau from 0 to 0.02 (the twelve parts' units): the two responses of the boxed series for the twelve parts of the
// margin note, tau S + tau^2 (dS/dt / 2 +- bracket / 2), with S = -5.80, dS/dt / 2 = 0.80 and the bracket 5.323, thin
// single strokes in ink, "kick g, read h" solid and "kick h, read g" dotted, each timeline drawn in its curve's
// stroke; the gap between them shaded. Above, at the true scale, where the two run as one straight line, labelled
// with the first term of the series; below, the same less that first term, forty times higher: the two parabolas, their
// half sum dashed, the shaded gap and, at tau = 0.02, a bar across it labelled tau^2 {Q_h, Q_g}, off the curves.
// Departures from the diagram's comment: the two orders are told apart by their strokes and by direct labels in ink,
// not by orange and blue, which mean a stretch and a squeeze; the timelines in the same two strokes serve as the key.
// At the true scale the gap is 2 per cent of the response at tau = 0.02 and cannot be seen, so the lower panel draws
// the curves less their common first term, forty times higher (the caption says so).
// Exact: S, dS/dt and the bracket, computed from the twelve parts (tut-brackets-lib.js, which also asserts the text's
// 5.043 and 5.268 from the exact motion); the curves are the series without its higher terms. In the upper panel the
// exact responses of the twelve parts, from the motion solved exactly, are asserted to lie within MATCH points of the
// drawn curves over the whole plot; the lower panel magnifies the series alone, where its higher terms would show.
// Pictorial: the spike and the eye.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, AXIS, HAIR, TICK, VEC_HEAD, n2 } from './tut-pot-lib.js';
import { Plot } from './tut-prob-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter, exact, MATTER, near } from './tut-brackets-lib.js';

const name = 'tut-tides-in-turn';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const W = 178;                             // the plots' width
const T1 = 0.02;                           // tau at the right
const Q0 = -0.12, H = 104;                 // the upper plot: the response at its bottom, its height
const ZOOM = 40;                           // the lower plot's heights, against the upper's
const LO = [-0.0009, 0.00155];             // the lower plot's range of the rest (response less tau S)
const GAP = 22;                            // between the two plots
const CURVE = 0.6;                         // the two responses
const DOTS = [0.001, 1.55];                // the dotted curve: dots of the stroke's width, this far apart
const SHADE = 0.5;                         // the gap's tint: the rule's colour, this opaque
const HALF = 0.45, HALF_DASH = [2.2, 1.6]; // the half sum
const MATCH = 0.45;                        // the most the exact responses may stray from the drawn curves, points
const LINE_T = 58;                         // a timeline's length, t = 0 to tau
const ROW = 46;                            // between the two timelines
const SPIKE = [2.6, 9.5];                  // the kick: base and height
const EYE = [10, 5.2];                     // the eye: width and height
const caption = 'Look first at the shaded gap: the two orders start along the same straight line, which weighs the density, and part as the square of the time, by the bracket of the two rates, which weighs the flow. The lower panel is the upper one less that straight line, drawn forty times higher. The curves are the series of the text for the twelve parts of the margin note, without its higher terms.';

export default async function () {
	const { state, S, Sdot, B } = await chapter(check);
	state(name, 'tides-in-turn', caption);
	const Sh = new Sheet(name);
	const L = [];
	const Q = (s) => `{\\color{${MATTER}}${s}}`;
	const first = `\\tau\\!\\int\\!${Q('\\rho')}\\,\\nabla g\\cdot\\nabla h\\,\\mathrm dV`;

	const up = (t) => t * t * (Sdot + B) / 2;                   // kick g, read h, less tau S
	const down = (t) => t * t * (Sdot - B) / 2;                 // kick h, read g, less tau S
	const half = (t) => t * t * Sdot / 2;
	const n = 400, ts = Array.from({ length: n + 1 }, (_, k) => (T1 * k) / n);
	check(ts.every((t) => up(t) >= down(t)), 'kick g, read h is not the upper curve');

	// ---- the two plots, one above the other, on one tau axis
	const hB = ((LO[1] - LO[0]) * H * ZOOM) / -Q0;
	const left = ORIGIN - 30, top = ORIGIN - (H + GAP + hB) / 2;
	const A = new Plot({ left, top, w: W, h: H, x0: 0, x1: T1, y0: Q0, y1: 0 });
	const Bp = new Plot({ left, top: A.bottom + GAP, w: W, h: hB, x0: 0, x1: T1, y0: LO[0], y1: LO[1] });
	check(near((Bp.Y(0) - Bp.Y(0.001)) / (A.Y(0) - A.Y(0.001)), ZOOM, 1e-9), 'the lower plot is not forty times higher');
	check(down(T1) > LO[0] && up(T1) < LO[1], 'the lower curves leave their plot');
	check(T1 * S + down(T1) > Q0 * 0.985, 'the upper curves leave their plot');
	// the exact responses, against the curves drawn in the upper plot, on the page
	{
		let worst = 0;
		for (const t of ts.filter((_, k) => k % 8 === 0)) {
			const [a, b] = exact(t);
			worst = Math.max(worst, Math.abs(A.Y(a) - A.Y(t * S + up(t))), Math.abs(A.Y(b) - A.Y(t * S + down(t))));
		}
		check(worst < MATCH, `the exact responses stray ${worst.toFixed(3)} pt from the curves`);
		window[name + '-match'] = worst;
	}

	// the tau axis along the top of the upper plot, at zero response, its ticks up and its numbers above
	Sh.path([[A.X(0), A.top], [A.X(T1), A.top]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the tau axis' });
	for (const t of [0, 0.01, 0.02]) {
		Sh.path([[A.X(t), A.top], [A.X(t), A.top - TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${t}` });
		L.push(await placed(t === 0 ? '0' : t.toFixed(2), A.X(t), A.top - TICK - 2.6, 0.5, 1, DIM));
	}
	L.push(await placed('\\tau', A.X(T1) + LABEL_GAP + 5.5, A.top, 0, 0.5, INK));
	Sh.path([[left, A.top], [left, A.bottom]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the response axis' });
	for (const q of [-0.05, -0.1]) {
		Sh.path([[left, A.Y(q)], [left - TICK, A.Y(q)]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${q}` });
		L.push(await placed(`-${Math.abs(q).toFixed(2)}`, left - TICK - 2.6, A.Y(q), 1, 0.5, DIM));
	}
	L.push(await placed(`\\delta ${Q('Q')}/\\epsilon`, left + 4, A.bottom - 1, 0, 1, INK));

	/** The two responses and the gap between them on the plot P, with `base(t)` added to the rest. */
	const pair = (P, base, key) => {
		const upper = ts.map((t) => P.at(t, base(t) + up(t))), lower = ts.map((t) => P.at(t, base(t) + down(t)));
		const d = 'M' + [...upper, ...[...lower].reverse()].map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
		Sh.raw(`<path d="${d}" fill="${RULE}" fill-opacity="${SHADE}"/>`, 0.5);
		Sh.path(upper, { color: INK, width: CURVE, layer: 2, what: `kick g, read h ${key}` });
		Sh.path(lower, { color: INK, width: CURVE, dash: DOTS, layer: 2, what: `kick h, read g ${key}` });
	};

	// ---- above, at the true scale: the two as one line, named by the series' first term
	pair(A, (t) => t * S, 'above');
	{
		const t = 0.0085, p = A.at(t, t * S);
		const u = [A.X(1e-4) - A.X(0), A.Y(1e-4 * S) - A.Y(0)], l = Math.hypot(...u);
		L.push(await Sh.clear(first, p[0], p[1], 0, 1, [-u[1] / l, u[0] / l]));
	}

	// ---- below: the rest, forty times higher, from the first term as its zero line
	Sh.path([[Bp.X(0), Bp.Y(0)], [Bp.X(T1), Bp.Y(0)]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the lower zero line' });
	for (const t of [0.01, 0.02]) Sh.path([[Bp.X(t), Bp.Y(0)], [Bp.X(t), Bp.Y(0) + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the lower tick at ${t}` });
	Sh.path([[left, Bp.top], [left, Bp.bottom]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the lower axis' });
	Sh.path(ts.map((t) => Bp.at(t, half(t))), { color: DIM, width: HALF, dash: HALF_DASH, cap: 'butt', layer: 1.5, what: 'the half sum' });
	pair(Bp, () => 0, 'below');
	L.push(await placed(`{-}\\,${first}`, left - TICK - 2.6, Bp.Y(0), 1, 0.5, DIM));
	L.push(await placed(`{\\times}${ZOOM}`, left + 4, Bp.bottom, 0, 1, DIM));
	// the gap's width at tau = 0.02: a bar just past the curves' ends, the bracket's label beside it
	{
		const x = Bp.X(T1) + 3.4, a = Bp.Y(up(T1)), b = Bp.Y(down(T1));
		Sh.path([[x, a], [x, b]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the gap\'s bar' });
		for (const y of [a, b]) Sh.path([[x - 1.6, y], [x + 1.6, y]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the gap\'s bar end' });
		L.push(await placed(`\\tau^2\\{${Q('\\dot Q_h')}, ${Q('\\dot Q_g')}\\}`, x + 1.6 + LABEL_GAP + 0.4, (a + b) / 2, 0, 0.5, INK));
		check(near(b - a, T1 * T1 * B * (hB / (LO[1] - LO[0])), 1e-9), 'the bar is not the bracket\'s tau^2');
	}
	// direct labels: each order beside its curve, on its own side
	{
		const t = 0.0128;
		L.push(await Sh.clear('\\text{kick }g\\text{, read }h', Bp.X(t), Bp.Y(up(t)), 1, 1, [-0.5, -0.866]));
		L.push(await Sh.clear('\\text{kick }h\\text{, read }g', Bp.X(t), Bp.Y(down(t)), 0, 0, [0.5, 0.866]));
	}

	// ---- the two timelines, left of the plots, each drawn in its curve's stroke
	const right = left - 52;                                    // tau's end of the timelines
	const mid = (A.top + Bp.bottom) / 2;
	const rows = [[mid - ROW / 2, 'g', 'h', null], [mid + ROW / 2, 'h', 'g', DOTS]];
	for (const [y, kick, read, dash] of rows) {
		const x0 = right - LINE_T, x1 = right;
		// the arrow of time: a shaft (solid or dotted) and a filled head at tau
		const neck = x1 - VEC_HEAD * 0.8;
		Sh.path([[x0, y], [neck, y]], { color: INK, width: CURVE, dash, layer: 2, cap: dash ? 'round' : 'butt', what: `the time line ${kick}` });
		Sh.fill(`M${n2(x1)},${n2(y)}L${n2(x1 - VEC_HEAD)},${n2(y - 0.36 * VEC_HEAD)}L${n2(x1 - VEC_HEAD)},${n2(y + 0.36 * VEC_HEAD)}Z`,
			{ l: x1 - VEC_HEAD, r: x1, t: y - 0.36 * VEC_HEAD, b: y + 0.36 * VEC_HEAD }, { color: INK, layer: 2, what: `the time line's head ${kick}` });
		// the kick: a spike standing on the line at t = 0
		Sh.fill(`M${n2(x0 - SPIKE[0] / 2)},${n2(y)}L${n2(x0)},${n2(y - SPIKE[1])}L${n2(x0 + SPIKE[0] / 2)},${n2(y)}Z`,
			{ l: x0 - SPIKE[0] / 2, r: x0 + SPIKE[0] / 2, t: y - SPIKE[1], b: y }, { color: INK, layer: 2, what: `the kick ${kick}` });
		// the eye, above the line at tau: two arcs and the iris
		{
			const cx = x1 - VEC_HEAD / 2, cy = y - 3.2 - EYE[1] / 2, [w, h] = EYE;
			const rr = (w * w / 4 + h * h / 4) / h;           // the radius of an arc through the corners and the top
			Sh.raw(`<path d="M${n2(cx - w / 2)},${n2(cy)}A${n2(rr)},${n2(rr)} 0 0,1 ${n2(cx + w / 2)},${n2(cy)}A${n2(rr)},${n2(rr)} 0 0,1 ${n2(cx - w / 2)},${n2(cy)}Z" fill="none" stroke="${INK}" stroke-width="0.5" stroke-linejoin="round"/>` +
				`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(h * 0.32)}" fill="${INK}"/>`, 2);
			Sh.boxes.push({ box: { l: cx - w / 2 - 0.25, r: cx + w / 2 + 0.25, t: cy - h / 2 - 0.25, b: cy + h / 2 + 0.25 }, what: `the eye ${read}` });
		}
		const below = y + 0.36 * VEC_HEAD + LABEL_GAP + 0.3;
		L.push(await placed(`\\text{kick }${kick}`, x0, below, 0.5, 0, INK));
		L.push(await placed(`\\text{read }${read}`, x1 - VEC_HEAD / 2, below, 0.5, 0, INK));
		L.push(await placed('\\tau', (x0 + x1) / 2, y - LABEL_GAP - 1.4, 0.5, 1, DIM));
	}

	Sh.checkAll(L);
	window[name + '-numbers'] = { S, halfRate: Sdot / 2, bracket: B, gap: T1 * T1 * B };
	return finish(Sh, L, [280, 370]);
}
