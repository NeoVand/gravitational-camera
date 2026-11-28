// The tutorial, section 7.2 (tutorial/geometry/curvature-and-tides.md), its second diagram: geodesic deviation in the
// frame that falls with the reference ball. Time upward. Two worldlines of free balls rising from their starting
// events (small dots), thin, in the observer's colour: the reference ball's, straight and upright, named "reference
// ball" above its top; its neighbour's, starting parallel to it a short distance to the right and curving slowly away,
// named "neighbour" above its top. Three horizontal ink arrows from the reference to the neighbour at three heights,
// each named "xi" above its middle, the top one longest. Along the reference worldline, at the same three heights,
// small squares in faint ink, all the same size and orientation, named once, left of the middle one, "falling frame:
// every Gamma^mu_alpha beta = 0 on this path". A short heavier arrow in the observer's colour up the reference worldline
// from its start, named "u".
// Departures from the diagram's comment: the frame's name is set on two lines, left of the middle square, so that the
// drawing stays about 250 points wide and its text readable on a phone; the two balls' starting events are marked by
// small dots, from which u and the neighbour's worldline leave. The squares are drawn 10 points across in dim ink, not
// faint, and the worldlines 0.65 points wide, so that they hold in print; a thin ink time axis, which the comment does
// not draw, stands at the left under the frame's name, up from the level of the starts, named "time".
// Exact: the neighbour's worldline, the separation xi(tau) = xi_0 cosh(k tau) of d^2 xi / dtau^2 = -R xi with R = -k^2
// (a stretch, as along the line to a mass), integrated by Runge-Kutta in tut-curvature-lib.js and asserted against the
// closed form; it leaves parallel (asserted: its slope at the start is zero) and each arrow ends on it (asserted at
// its tip). Schematic: k, xi_0 and the heights of the arrows.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD, AXIS, AXIS_HEAD } from './tut-pot-lib.js';
import { DOT } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, stack, deviation, deviationRK, OBS } from './tut-curvature-lib.js';

const name = 'tut-curvature-deviation';
const check = checker(name);

const HEIGHT = 196;                        // points from the start to the top of the worldlines
const KT = 1.6;                            // k times the time drawn (schematic)
const XI0 = 40;                            // the starting separation, points (schematic)
const AT = [0.27, 0.57, 0.88];             // the arrows' heights, fractions of the time drawn
const BOX = 10;                            // a square's side
const BOX_LINE = 0.5;                      // its outline
const U_LEN = 22;                          // the four-velocity's arrow
const START = DOT + 0.25;                  // the starting events' dots (section 7.1's)
const WORLD = 0.65;                        // the two worldlines' stroke
const TIME_X = 62, TIME_UP = 64;           // the time axis: this far left of the reference, and its length

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const K = -KT * KT;                    // R xi = K xi in units of 1/T^2: a stretch
	const x0 = ORIGIN - 40, y0 = ORIGIN + HEIGHT / 2;
	const at = (s, xi = 0) => [x0 + xi, y0 - s * HEIGHT];
	const xi = (s) => deviation(K, XI0, s);

	// ---- the worldlines
	S.path([at(0), at(1)], { color: OBS, width: WORLD, cap: 'butt', layer: 2, what: 'the reference' });
	const pts = [];
	for (let i = 0; i <= 400; i++) { const s = i / 400; pts.push(at(s, xi(s))); }
	for (const s of [0, 0.3, 0.6, 1]) check(near(deviationRK(K, XI0, s), xi(s), 1e-8), `the neighbour at ${s} is off the deviation equation`);
	check(near((xi(1e-6) - xi(0)) / 1e-6, 0, 1e-3), 'the neighbour does not leave parallel');
	S.path(pts, { color: OBS, width: WORLD, cap: 'butt', layer: 2, what: 'the neighbour' });
	for (const [p, what] of [[at(0), 'the reference\'s start'], [at(0, XI0), 'the neighbour\'s start']]) {
		S.raw(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${START}" fill="${OBS}"/>`, 4);
		S.mark([p], START, what);
	}

	// ---- u, up the reference from its start
	S.arrow(at(0), [x0, y0 - U_LEN], { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: 'u' });
	L.push(await placed('u', x0 - LABEL_GAP - VEC / 2 - 1, y0 - U_LEN / 2 - 1, 1, 0.5, OBS));

	// ---- the squares and the arrows
	const lengths = [];
	for (const [j, s] of AT.entries()) {
		const [x, y] = at(s);
		const h = BOX_LINE / 2;
		S.path([[x - BOX / 2 + h, y - BOX / 2 + h], [x + BOX / 2 - h, y - BOX / 2 + h], [x + BOX / 2 - h, y + BOX / 2 - h], [x - BOX / 2 + h, y + BOX / 2 - h]],
			{ color: DIM, width: BOX_LINE, closed: true, layer: 1, what: `square ${j}` });
		const tip = at(s, xi(s));
		const a = S.arrow([x, y], tip, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: `xi ${j}` });
		check(near(a.B[0] - x, xi(s), 1e-9) && near(a.B[1], y, 1e-12), `arrow ${j} does not end on the neighbour`);
		lengths.push(a.L);
		L.push(await placed('\\xi', x + BOX / 2 + (a.L - BOX / 2) / 2, y - VEC / 2 - LABEL_GAP - 0.6, 0.5, 1, INK));
	}
	check(lengths[0] < lengths[1] && lengths[1] < lengths[2], `the arrows do not grow: ${lengths}`);

	// ---- the names
	L.push(await placed('\\text{reference ball}', x0, at(1)[1] - LABEL_GAP - 0.6, 0.5, 1, OBS));
	L.push(await placed('\\text{neighbour}', x0 + xi(1), at(1)[1] - LABEL_GAP - 0.6, 0.5, 1, OBS));
	{
		const [x, y] = at(AT[1]);
		const lab = await stack(['\\text{falling frame: every}', '\\Gamma^\\mu{}_{\\alpha\\beta} = 0\\text{ on this path}'], 0, 0, 1, DIM);
		const h = lab.box.b - lab.box.t;
		L.push(await stack(['\\text{falling frame: every}', '\\Gamma^\\mu{}_{\\alpha\\beta} = 0\\text{ on this path}'], x - BOX / 2 - LABEL_GAP - 1, y - h / 2, 1, INK));
	}

	// ---- the time axis: a thin ink arrow at the left, up from the level of the starts, named beside its head
	{
		const x = x0 - TIME_X, a = S.arrow([x, y0], [x, y0 - TIME_UP], { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the time axis' });
		L.push(await placed('\\text{time}', x - AXIS_HEAD / 2 - LABEL_GAP - 0.4, a.B[1], 1, 0, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, xi: AT.map(xi) };
	return finish(S, L, [200, 300]);
}
