// The tutorial, section 13.6 (tutorial/what-a-field-keeps/algebra-of-moments.md), its third diagram: a history that
// is not analytic. One plot, t from -1 to 3 across and A from 0 to 1 up: the exact curve A(t) = e^{-1/t^2} for t > 0
// and 0 before, a thin solid stroke in ink; its Taylor series at t = 0, the flat line A = 0, dashed in a grey along the
// whole range; a small dot at t = 0, "every derivative zero", set in the empty part of the plot above and to the left
// and tied to the dot by a hairline; two light markers, open circles on the curve, at t = 0.5 (A = 0.018) and t = 1
// (A = 0.37), each with its value beside it. Below, a thin strip on the same time axis: a boundary reading drawn the
// same way, its series at t = 0 dashed and the reading itself solid, flat until a pulse arrives at t = 1.5 and then
// rising, "the pulse reaches the boundary" beside it and tied to the arrival by a hairline.
// Departures from the diagram's comment: the series is dashed in a grey, not orange, which the tutorial keeps for a
// stretch. The axes stand a few points off the plot (the time axis under the line A = 0, the axis of A left of t = -1),
// so that the line A = 0 is the curve and its series alone and can be seen for t < 0. Where the curve and the series
// agree within the stroke, for t below about 0.4, the solid stroke lies over the dashes. The strip's pulse rises and
// falls again by t = 2.9 (a smooth bump that is zero outside 1.5 < t < 2.9, of the same kind as e^{-1/t^2}).
// Exact: the curve, the series, the markers' places and values (tut-algebra-lib.js asserts 0.018, the text's 0.37 and
// the text's first two derivatives). Schematic: the strip (its height and the bump's shape; the caption says so).
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, AXIS, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { dashed } from './tut-orb-lib.js';
import { INK, DIM, FAINT, PAGE } from '../lib.js';
import { chapter, pulse, near } from './tut-algebra-lib.js';

const name = 'tut-analytic-pulse';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const W = 236, H = 112;                    // the plot: t from -1 to 3, A from 0 to 1
const T0 = -1, T1 = 3;
const OFF = 5;                             // the axes' distance from the plot
const CURVE = 0.6;                         // the curve and the reading
const SERIES = 0.6, SERIES_DASH = [2.6, 1.9];   // the Taylor series
const DOT = 1.35;                          // the dot at t = 0
const RING = 1.6, RING_W = 0.45;           // the markers: open circles
const STRIP = 24, STRIP_GAP = 26;          // the strip: its height, and from the plot's line A = 0 to its line
const ARRIVE = 1.5, BUMP = [1.5, 2.9];     // the pulse: its arrival, and the bump's support
const caption = 'Look first at the dashed line: the Taylor series at $t = 0$ of $e^{-1/t^2}$ is zero, yet the function rises. A reading whose every bracket with the energy vanishes at one time may still change later. The curve is exact; the strip below is schematic.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'analytic-pulse', caption);
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - W / 2, top = ORIGIN - H;
	const P = new Plot({ left, top, w: W, h: H, x0: T0, x1: T1, y0: 0, y1: 1 });
	const ts = Array.from({ length: 2001 }, (_, k) => T0 + ((T1 - T0) * k) / 2000);

	// ---- the plot: the series dashed beneath, the curve solid over it
	dashed(S, P.at(T0, 0), P.at(T1, 0), { color: DIM, width: SERIES, layer: 1, dash: SERIES_DASH, what: 'the series' });
	S.path(ts.map((t) => P.at(t, pulse(t))), { color: INK, width: CURVE, layer: 2, what: 'the curve' });
	check(ts.every((t) => t > 0 || pulse(t) === 0) && near(pulse(T1), Math.exp(-1 / 9)), 'the curve');

	// the axes, OFF points off the plot
	const yAx = P.bottom + OFF, xAx = left - OFF;
	L.push(...(await xAxis(S, P, { ticks: [-1, 0, 1, 2, 3], fmt: (t) => (t < 0 ? `-${-t}` : String(t)), y: yAx, what: 'the t axis' })));
	L.push(await placed('t', P.X(T1) + LABEL_GAP + 3, yAx, 0, 0.5, INK));
	L.push(...(await yAxis(S, P, { ticks: [0, 0.5, 1], fmt: (a) => (a === 0.5 ? '0.5' : String(a)), x: xAx, what: 'the A axis' })));
	L.push(await placed('A', xAx, P.top - LABEL_GAP - 3, 0.5, 1, INK));

	// the dot at t = 0, and its label up and to the left, tied by a hairline
	const O = P.at(0, 0);
	S.raw(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([O], DOT, 'the dot');
	{
		const lab = await placed('\\text{every derivative zero}', P.X(-0.3), P.Y(0.3), 0.5, 1, INK);
		L.push(lab);
		const from = [P.X(-0.16), lab.box.b + LABEL_GAP + 0.4], to = [O[0] - 0.5, O[1] - DOT - 1.5];
		S.path([from, to], { color: FAINT, width: HAIR, cap: 'butt', layer: 1.5, what: 'the dot\'s leader' });
	}

	// the two markers on the curve, with their values
	const marker = async (t, printed, side) => {
		const a = pulse(t), q = P.at(t, a);
		check(a.toFixed(printed.length - 2) === printed, `the marker at ${t}: ${a}`);
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${RING}" fill="${PAGE}" stroke="${DIM}" stroke-width="${RING_W}"/>`, 3);
		S.mark([q], RING + RING_W / 2, `the marker at ${t}`);
		return side === 'left'
			? S.clear(printed, q[0] - RING - LABEL_GAP, q[1] - RING, 1, 1, [-0.6, -0.8], { color: DIM })
			: S.clear(printed, q[0] + RING + LABEL_GAP, q[1] + 1, 0, 0, [1, 0], { color: DIM });
	};
	L.push(await marker(0.5, '0.018', 'left'));
	L.push(await marker(1, '0.37', 'right'));

	// the names of the curve and of the series
	{
		const t = 1 / Math.sqrt(-Math.log(0.66));             // where the curve stands at 0.66
		L.push(await S.clear('A = e^{-1/t^2}', P.X(t) - 3, P.Y(0.66), 1, 0.5, [-1, 0]));
		L.push(await S.clear('\\text{its Taylor series at }t = 0', P.X(2.15), P.Y(0) - 1, 0.5, 1, [0, -1], { color: DIM }));
	}

	// ---- the strip: a boundary reading, flat until the pulse arrives
	const sTop = yAx + TICK + 2.4 + 9 + STRIP_GAP - 20, Ps = new Plot({ left, top: sTop, w: W, h: STRIP, x0: T0, x1: T1, y0: 0, y1: 1 });
	check(Ps.top > yAx + TICK + 12, 'the strip meets the t axis\'s numbers');
	const bump = (t) => {
		const u = (2 * (t - BUMP[0])) / (BUMP[1] - BUMP[0]) - 1;
		return Math.abs(u) < 1 ? Math.exp(1 - 1 / (1 - u * u)) : 0;
	};
	check(near(bump((BUMP[0] + BUMP[1]) / 2), 1) && bump(ARRIVE) === 0 && bump(ARRIVE + 1e-3) > 0, 'the bump');
	dashed(S, Ps.at(T0, 0), Ps.at(T1, 0), { color: DIM, width: SERIES, layer: 1, dash: SERIES_DASH, what: 'the strip\'s series' });
	S.path(ts.map((t) => Ps.at(t, bump(t))), { color: INK, width: CURVE, layer: 2, what: 'the reading' });
	{
		const q = Ps.at(ARRIVE, 0);
		const lab = await placed('\\text{the pulse reaches the boundary}', Ps.X(0.85), Ps.Y(0.55), 1, 0.5, INK);
		L.push(lab);
		S.path([[lab.box.r + LABEL_GAP + 0.4, (lab.box.t + lab.box.b) / 2 + 1.5], [q[0] - 1.2, q[1] - 1.6]], { color: FAINT, width: HAIR, cap: 'butt', layer: 1.5, what: 'the arrival\'s leader' });
	}

	S.checkAll(L);
	window[name + '-numbers'] = { half: pulse(0.5), one: pulse(1) };
	return finish(S, L, [240, 330]);
}
