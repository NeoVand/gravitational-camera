// The tutorial, chapter 4.4 (tutorial/response/viscosity.md), its second diagram: Maxwell's model and a held shear.
// Left: the Maxwell element drawn across the page, a zigzag spring (mu_inf) joined end to end with a dashpot (eta_0),
// an open cylinder of oil with a piston and its rod; the left end on a hatched wall, as chapter 1.7's cart
// (figs/tut-ham-phase.js), the right end carrying a small arrow, the shear. Right: two charts on one axis of t/tau
// from -0.5 to 4. Above, the shear u/u_0, thin and grey, stepping from 0 to 1 at t = 0 and staying there; below, the
// stress T/T(0), solid in the first accent, jumping to 1 at t = 0 and falling as e^{-t/tau}, with a short tick
// across it at t/tau = 1, where it is 1/e = 0.368, labelled tau = eta_0/mu_inf. The two are drawn in separate charts,
// rather than in one as the diagram's comment had it, because there the shear's step would lie on the stress's jump
// and its zero on the axis. Each line is stopped where it would merge with its horizontal axis (figs/tut-prob-lib.js,
// `merge`), so the zero before t = 0 is the axis itself.
// Exact: the stress, T(t)/T(0) = e^{-t/tau}, asserted here to solve eq:relax, dT/dt + T/tau = 2 mu du/dt, for the held
// shear (the step taken by the spring alone, T(0) = 2 mu u_0), and the point (1, 1/e). Schematic: the drawing of the
// element (the spring's coils, the dashpot's size). The curve is sampled so that no two neighbouring points are more
// than a quarter of a point apart.
import { Sheet, ORIGIN, finish, checker, placed, near, AXIS, HAIR, LINE } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, pathOf, TINT, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { DIM, FAINT, ACCENT } from './tut-bessel-lib.js';
import { chapter } from './tut-visc-lib.js';

const name = 'tut-visc-maxwell';
const check = checker(name);

const T0 = -0.5, T1 = 4;                   // t / tau
const PW = 150, STRIP = 24, PH = 74, GAP = 12;   // the charts: width, the shear's height, the stress's, between them
const SHEAR = 0.6;                         // the shear's line, thin and grey (fainter than the axes)
const AIR = 1.4;
const MARK = 2.6;                          // half the tick across the stress at t = tau
// the element (points)
const SPRING = 0.45, COILS = 7, AMP = 3.2, LEAD = 5, SPRING_L = 48;   // the spring: stroke, corners, half-width, straight ends, length
const POT = [34, 15];                      // the dashpot's cylinder: length and height
const PISTON = 0.7 * POT[1];               // the piston's height
const ROD = 22;                            // the rod, from the piston out of the cylinder
const SHEAR_ARROW = 13, SHEAR_HEAD = 4.4;  // the small arrow at the free end
const WALL_H = 26;
const TO_CHART = 20;                       // from the element's right end to the charts' y axis

export default async function () {
	chapter(check);
	const S = new Sheet(name);
	const L = [];
	// the stress for a held shear: the spring takes the step, T(0) = 2 mu u0, then dT/dt = -T/tau
	const stress = (t) => (t < 0 ? 0 : Math.exp(-t));
	{
		const h = 1e-5;
		for (const t of [0.1, 0.7, 1.9, 3.3]) check(near((stress(t + h) - stress(t - h)) / (2 * h) + stress(t), 0, 1e-8), `the stress breaks eq:relax at ${t}`);
		check(near(stress(1), Math.exp(-1), 1e-15) && Math.exp(-1).toFixed(2) === '0.37', 'the stress at t = tau is not 1/e');
	}

	// ---- the charts: the shear above, the stress below, on one axis of t/tau
	const left = ORIGIN;
	const top = ORIGIN - (STRIP + GAP + PH) / 2;
	const PS = new Plot({ left, top, w: PW, h: STRIP, x0: T0, x1: T1, y0: 0, y1: 1.15 });
	const PT = new Plot({ left, top: PS.bottom + GAP, w: PW, h: PH, x0: T0, x1: T1, y0: 0, y1: 1.12 });

	// the shear: up at t = 0 from its axis, then level at 1
	S.path([[PS.X(0), PS.bottom - (SHEAR + AXIS) / 2], PS.at(0, 1), PS.at(T1, 1)], { color: FAINT, width: SHEAR, layer: 2, cap: 'butt', what: 'the shear' });
	// the stress: up at t = 0, then e^{-t}, stopped where it would merge with the axis
	const clear = merge(PT, CURVE) + (AIR / PT.h) * (PT.y1 - PT.y0);
	let b = T1;
	while (stress(b) < clear) b -= 1e-4;
	const decay = graph(PT, stress, 0, b);
	check(longest(decay) <= 0.2501, 'the stress is coarse');
	S.path([[PT.X(0), PT.bottom - (CURVE + AXIS) / 2], ...decay], { color: ACCENT, width: CURVE, layer: 2, what: 'the stress' });
	// the level 1/e, dotted, from the axis to the tick; and the tick across the curve at t = tau
	const [ex, ey] = PT.at(1, Math.exp(-1));
	S.dots([PT.left, ey], [ex, ey], { color: DIM, clear0: 1.2, clear1: 1.6, layer: 1, what: 'the level 1/e' });
	S.path([[ex, ey - MARK], [ex, ey + MARK]], { color: DIM, width: HAIR, layer: 3, cap: 'butt', what: 'the tick at tau' });
	L.push(await S.clear('\\tau = \\eta_0/\\mu_\\infty', ex + 1.5, ey - MARK - LABEL_GAP, 0, 1, [1, -0.4], { color: DIM }));

	// the axes
	const ticks = [0, 1, 2, 3, 4];
	await xAxis(S, PS, { ticks, fmt: () => null, what: 'the shear\'s axis' });
	const xl = await xAxis(S, PT, { ticks, what: 'the t axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await S.clear('t/\\tau', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, [1, 0], { color: DIM }));
	L.push(...(await yAxis(S, PS, { ticks: [0, 1], fmt: (t) => (t ? '\\tilde u_0' : '0'), what: 'the shear\'s y axis' })));
	L.push(...(await yAxis(S, PT, { ticks: [0, Math.exp(-1), 1], fmt: (t) => (t === 0 ? '0' : t === 1 ? '1' : '1/e'), what: 'the stress\'s y axis' })));
	L.push(await S.clear('\\text{shear}', PS.X(1.6), PS.Y(1) + LABEL_GAP + 0.3, 0, 0, [0, 1], { color: DIM }));
	L.push(await S.clear('T/T(0)', PT.left + 4.5, PT.top, 0, 0, [1, 0], { color: DIM }));

	// ---- the element, across the page at the height of the stress's chart's middle, its right end TO_CHART before
	// the charts' axes
	const y = (PS.top + PT.bottom) / 2;
	const xEnd = PS.left - TO_CHART - 18;               // the tip of the shear's arrow
	const xRod = xEnd - SHEAR_ARROW;                    // the rod's free end
	const xPiston = xRod - ROD;
	const potR = xPiston + 0.3 * POT[0], potL = potR - POT[0];
	const xWall = potL - SPRING_L;
	// the wall and its hatching (chapter 1.7's)
	S.path([[xWall, y - WALL_H / 2], [xWall, y + WALL_H / 2]], { color: DIM, width: LINE, layer: 1, cap: 'butt', what: 'the wall' });
	{
		const k = 6, step = (WALL_H - 3) / (k - 1);
		for (let i = 0; i < k; i++) S.path([[xWall - 0.3, y - WALL_H / 2 + i * step], [xWall - 3.3, y - WALL_H / 2 + i * step + 3]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the wall\'s hatching' });
	}
	// the spring, from the wall to the cylinder's closed end
	const s0 = xWall + LINE / 2, s1 = potL;
	const coil = [[s0, y], [s0 + LEAD, y]];
	for (let j = 1; j < 2 * COILS; j++) coil.push([s0 + LEAD + ((s1 - s0 - 2 * LEAD) * j) / (2 * COILS), y + (j % 2 ? -AMP : AMP)]);
	coil.push([s1 - LEAD, y], [s1, y]);
	S.path(coil, { color: DIM, width: SPRING, layer: 2, what: 'the spring' });
	// the dashpot: the oil, the cylinder open to the right, the piston and its rod
	const ct = y - POT[1] / 2, cb = y + POT[1] / 2;
	S.fill(pathOf([[potL, ct], [xPiston, ct], [xPiston, cb], [potL, cb]]), { l: potL, r: xPiston, t: ct, b: cb }, { color: TINT, layer: 0.5, what: 'the oil' });
	S.path([[potR, ct], [potL, ct], [potL, cb], [potR, cb]], { color: DIM, width: LINE, layer: 2, what: 'the cylinder' });
	S.path([[xPiston, y - PISTON / 2], [xPiston, y + PISTON / 2]], { color: DIM, width: 1.1, layer: 2, cap: 'butt', what: 'the piston' });
	S.path([[xPiston, y], [xRod, y]], { color: DIM, width: LINE, layer: 2, cap: 'butt', what: 'the rod' });
	const arrow = S.arrow([xRod, y], [xEnd, y], { color: DIM, width: LINE, head: SHEAR_HEAD, layer: 2, what: 'the shear\'s arrow' });
	check(arrow.head <= 0.4 * arrow.L, 'the shear\'s head');
	L.push(await placed('\\mu_\\infty', (s0 + s1) / 2, y - AMP - LABEL_GAP - 0.6, 0.5, 1, DIM));
	L.push(await placed('\\eta_0', (potL + potR) / 2, ct - LABEL_GAP - 0.6, 0.5, 1, DIM));
	L.push(await placed('\\text{shear}', (xRod + xEnd) / 2 + 1, y - LABEL_GAP - 1.6, 0.5, 1, DIM));

	S.checkAll(L);
	window[name + '-numbers'] = { e: Math.exp(-1), stop: b };
	return finish(S, L, [240, 340]);
}
