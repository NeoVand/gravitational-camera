// The tutorial, chapter 7.1 (tutorial/geometry/metric.md), its second diagram: two clocks at rest, one above the other,
// and two flashes of light between them. One panel: coordinate time t across and height upward, thin ink axes named
// "t" and "height". Two horizontal worldlines in the observer's colour, the lower clock's at height 0 and the upper
// clock's at height h, named "lower clock" and "upper clock". Two flashes rise from the lower to the upper one, two
// identical, slightly curved lines in the light role's colour, the second a copy of the first shifted along t by
// Delta t; the departures and the arrivals as small filled ink dots. Below the lower line a bracket between the
// departures, named "Delta tau_lower = (1 + Phi(0)/c^2) Delta t"; above the upper line a bracket between the
// arrivals, of exactly the same length on the page, named "Delta tau_upper = (1 + Phi(h)/c^2) Delta t"; between them
// on the left, "same Delta t".
// Departures from the diagram's comment: the drawing is narrower than the comment's 560 site pixels, about 500 at
// 1440, so that its text stays readable on a phone. The lower clock's worldline lies along the time axis, since it is
// at height 0, and the axis runs on past it to its head; the height axis carries ticks at 0 and h, named so, which
// the comment does not draw, so that the upper clock's height can be read. The clocks' names stand at the right,
// between the two worldlines and beyond the second flash; "same Delta t" stands between the worldlines left of the
// first flash. The brackets' names are in the observer's colour, as the clocks' own times are in the chapter.
// Exact: the second flash is the first moved along t by Delta t (asserted at every point), each flash starts and ends
// on the worldlines (asserted), and the two brackets have the same length on the page, each with its ends at the
// dots' times (asserted). Schematic: the flashes' shape. In these coordinates light climbs faster where the potential
// is higher (dz/dt = c (1 + 2 Phi/c^2) to first order), so each flash steepens as it rises; the bend is exaggerated
// and the axes carry no scale.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, LINE, HAIR, TICK } from './tut-pot-lib.js';
import { NUM } from './tut-prob-lib.js';
import { longest } from './tut-fourier-lib.js';
import { DOT } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, OBS, LIGHT } from './tut-metric-lib.js';

const name = 'tut-metric-clocks';
const check = checker(name);

const H = 96;                              // the upper clock's height on the page, points
const T1 = 50;                             // the first departure, points from the height axis
const DT = 72;                             // Delta t on the page
const CLIMB = 54;                          // a flash's climb, across, points
const BEND = 0.55;                         // the flashes' steepening (schematic): dz/dx grows as e^{BEND x / CLIMB}
const RUN = 236;                           // the worldlines' length from the height axis
const AXIS_RUN = 252;                      // the time axis's length, to the point of its head
const UP = 120;                            // the height axis's length
const WORLD = 0.75;                        // a worldline's stroke
const EVENT = DOT + 0.25;                  // a dot, radius (chapter 6.1's)
const BRACKET = HAIR + 0.15;               // a bracket's stroke
const ARM = 3;                             // a bracket's ends, toward its worldline
const DOT_AIR = 1.1;                       // the air between a bracket's ends and the dots they point at

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - RUN / 2, y0 = ORIGIN + H / 2;   // the corner: t = 0, height 0
	const yh = y0 - H;

	// ---- the axes
	const tA = S.arrow([x0, y0], [x0 + AXIS_RUN, y0], { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the t axis' });
	const zA = S.arrow([x0, y0], [x0, y0 - UP], { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the height axis' });
	L.push(await placed('t', tA.B[0] + LABEL_GAP + 1.2, tA.B[1], 0, 0.5, INK));
	L.push(await placed('\\text{height}', zA.B[0], zA.B[1] - LABEL_GAP - 1.2, 0.5, 1, INK));
	S.path([[x0, yh], [x0 - TICK, yh]], { color: DIM, width: HAIR, cap: 'butt', what: 'the tick at h' });
	L.push(await placed('h', x0 - TICK - NUM, yh, 1, 0.5, DIM));
	L.push(await placed('0', x0 - TICK - NUM, y0, 1, 0.5, DIM));
	S.path([[x0, y0], [x0 - TICK, y0]], { color: DIM, width: HAIR, cap: 'butt', what: 'the tick at 0' });

	// ---- the worldlines, the lower along the time axis
	S.path([[x0, y0], [x0 + RUN, y0]], { color: OBS, width: WORLD, layer: 2, cap: 'butt', what: 'the lower clock' });
	S.path([[x0, yh], [x0 + RUN, yh]], { color: OBS, width: WORLD, layer: 2, cap: 'butt', what: 'the upper clock' });
	check(x0 + RUN < tA.B[0] - AXIS_HEAD - 4, 'the lower worldline reaches the axis\'s head');

	// ---- the flashes: z grows with x as (e^{BEND x/CLIMB} - 1)/(e^BEND - 1), steepening upward; the second a copy
	const shape = (u) => (Math.exp(BEND * u) - 1) / (Math.exp(BEND) - 1);
	const flash = (start) => {
		const pts = [];
		for (let i = 0; i <= 600; i++) { const u = i / 600; pts.push([start + CLIMB * u, y0 - H * shape(u)]); }
		return pts;
	};
	const f1 = flash(x0 + T1), f2 = flash(x0 + T1 + DT);
	check(longest(f1) <= 0.25, 'a flash is coarse');
	f1.forEach((p, i) => check(near(f2[i][0] - p[0], DT, 1e-9) && near(f2[i][1], p[1], 1e-12), 'the second flash is not the first moved by Delta t'));
	for (const f of [f1, f2]) check(near(f[0][1], y0, 1e-12) && near(f[f.length - 1][1], yh, 1e-9), 'a flash does not run from clock to clock');
	// it steepens: the slope at the top is e^BEND times that at the bottom
	{
		const s0 = (f1[0][1] - f1[1][1]) / (f1[1][0] - f1[0][0]), s1 = (f1[599][1] - f1[600][1]) / (f1[600][0] - f1[599][0]);
		check(s1 > s0 && near(s1 / s0, Math.exp(BEND), 0.01), 'the flash does not steepen upward');
	}
	f1.forEach((_, i) => { if (i) check(f1[i][1] < f1[i - 1][1], 'a flash turns back'); });
	S.path(f1, { color: LIGHT, width: LINE, layer: 2.5, cap: 'butt', what: 'the first flash' });
	S.path(f2, { color: LIGHT, width: LINE, layer: 2.5, cap: 'butt', what: 'the second flash' });

	// ---- the events
	const dep = [f1[0], f2[0]], arr = [f1[f1.length - 1], f2[f2.length - 1]];
	for (const [p, what] of [[dep[0], 'the first departure'], [dep[1], 'the second departure'], [arr[0], 'the first arrival'], [arr[1], 'the second arrival']]) {
		S.raw(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${EVENT}" fill="${INK}"/>`, 4);
		S.mark([p], EVENT, what);
	}

	// ---- the brackets: under the departures, ends up; over the arrivals, ends down
	const bracket = (xa, xb, y, s, what) => {
		// s = +1: below the line y, ends pointing up; s = -1: above, ends pointing down
		const yb = y + s * (EVENT + DOT_AIR + ARM);    // butt ends: the arm stops at yb - s ARM
		S.path([[xa, yb - s * ARM], [xa, yb], [xb, yb], [xb, yb - s * ARM]], { color: DIM, width: BRACKET, layer: 2, cap: 'butt', what });
		return yb;
	};
	const yl = bracket(dep[0][0], dep[1][0], y0, 1, 'the lower bracket');
	const yu = bracket(arr[0][0], arr[1][0], yh, -1, 'the upper bracket');
	check(near(dep[1][0] - dep[0][0], DT, 1e-9) && near(arr[1][0] - arr[0][0], DT, 1e-9), 'the brackets are not both Delta t long');
	check(near(dep[1][0] - dep[0][0], arr[1][0] - arr[0][0], 1e-12), 'the brackets differ in length');
	// the brackets' ends clear the dots
	check(near(yl - ARM - y0, EVENT + DOT_AIR, 1e-9) && near(yh - (yu + ARM), EVENT + DOT_AIR, 1e-9), 'a bracket\'s end is not clear of its dot');

	// ---- the brackets' names
	const lower = await placed('\\Delta\\tau_{\\rm lower} = \\bigl(1 + \\Phi(0)/c^2\\bigr)\\,\\Delta t', (dep[0][0] + dep[1][0]) / 2, yl + BRACKET / 2 + LABEL_GAP + 0.6, 0.5, 0, OBS);
	const upper = await placed('\\Delta\\tau_{\\rm upper} = \\bigl(1 + \\Phi(h)/c^2\\bigr)\\,\\Delta t', (arr[0][0] + arr[1][0]) / 2, yu - BRACKET / 2 - LABEL_GAP - 0.6, 0.5, 1, OBS);
	L.push(lower, upper);

	// ---- "same Delta t", between the worldlines left of the first flash, level with its middle
	{
		const mid = (y0 + yh) / 2;
		const left = x0 + AXIS / 2 + LABEL_GAP + 1.2;
		const lab = await placed('\\text{same } \\Delta t', left, mid, 0, 0.5, INK);
		L.push(lab);
	}

	// ---- the clocks' names, at the right, between the worldlines and beyond the second flash
	const right = x0 + RUN;
	L.push(await placed('\\text{upper clock}', right, yh + WORLD / 2 + LABEL_GAP + 0.6, 1, 0, OBS));
	L.push(await placed('\\text{lower clock}', right, y0 - WORLD / 2 - LABEL_GAP - 0.6, 1, 1, OBS));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, dt: DT, climb: CLIMB };
	return finish(S, L, [240, 300]);
}
