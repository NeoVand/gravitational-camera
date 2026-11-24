// The tutorial, chapter 12.2 (tutorial/sky/universe.md), its third diagram: the thermal history as Ta, which a free
// species keeps. Horizontal axis: log10 of the photons' temperature from the Planck temperature, 1.42 x 10^32 K (left),
// to today's 2.7255 K (right); vertical axis: Ta over today's photons' value, 0 to 1.1. Three lines: the gravitons flat
// at (3.909/106.75)^{1/3} = 0.3321 across the whole axis, in the field's colour; the neutrinos, neutral, following the
// photons until 10^10 K and then flat at (4/11)^{1/3} = 0.7138; the photons, in the light role's colour, stepping up at
// each annihilation by (g*s before / g*s after)^{1/3} and ending at 1. The steps are named: the top quark with the W, Z
// and Higgs, the bottom, tau and charm, the quarks' confinement, the muons and pions, the electrons; the right-hand ends
// carry today's 2.7255 K, 1.945 K and 0.905 K.
// The steps of g*s are the chapter's planned interactive's (its `try: thermal-history` comment), asserted equal to
// tut-universe-lib.js's STEPS, where each value is derived from the particles still counted, so that the figure and the
// interactive draw the same lines.
// Departures from the diagram's comment: the axis runs from 32.15 (the Planck temperature), as the interactive's does,
// not 32. Where lines share a value they run side by side, as a bundle one line's width and a little air apart: the
// neutrinos' line at its value, the photons' just above it until the electrons' step (so that step is drawn 1.05 points
// short, and the photons' corners stand 1.05 points left of the neutrinos'), the gravitons' just below it all the way.
// The close steps are named in two groups, each with a bracket over its steps; the neutrinos' parting at 10^10 K is
// marked by a leader down to the bundle.
// Exact: the neutrinos' line, the step heights, the temperatures of the steps (the interactive's), the right-hand
// values; the gravitons' line 1.05 points (0.008) below 0.3321, the photons' 1.05 points above the neutrinos' where they
// share it. Schematic: the steps' temperatures, which the chapter states only for the top quark, the electrons and the
// neutrinos.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, LIGHT, FIELD, STEPS, G_HOT, G_TODAY, GRAV_FLAT, NU_FLAT, T_PLANCK, T_GAMMA, T_NU_PART, photonsTa, neutrinosTa } from './tut-universe-lib.js';

const name = 'tut-universe-temperatures';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const W = 236, H = 150;                // the plot
const LINE_W = 0.7;                    // each line
const D = 1.05;                        // the bundle's spacing, centre to centre
const MINOR = 1.5;                     // a decade's tick
const END_AIR = 3.2;                   // a line's end to its name
const NAME_UP = 7;                     // the vertical axis's name over the plot
const BRACKET = 1.6;                   // a bracket's ends
const caption = 'Look first at the flat graviton line: it parted near the Planck temperature and missed every step. Each step of the photon line is an annihilation, its height set by the count before and after. The ends are exact; the steps\' places are schematic, their heights from the counts. Lines that share a value are drawn side by side.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'universe-temperatures', caption);

	const S = new Sheet(name);
	const L = [];
	const x0 = Math.log10(T_PLANCK), x1 = Math.log10(T_GAMMA);
	const P = new Plot({ left: ORIGIN - 150, top: ORIGIN - H / 2, w: W, h: H, x0, x1, y0: 0, y1: 1.1 });
	const X = (T) => P.X(Math.log10(T));
	const Y = (v) => P.Y(v);

	// ---- the axes
	{
		const ticks = [30, 25, 20, 15, 10, 5];
		const xl = await xAxis(S, P, { ticks, fmt: (t) => `10^{${t}}`, what: 'the temperature axis' });
		L.push(...xl);
		for (let k = 1; k <= 31; k++) if (!ticks.includes(k)) S.path([[P.X(k), P.bottom], [P.X(k), P.bottom + MINOR]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the tick at 10^${k}` });
		// the ends: the Planck temperature and today
		for (const [x, src] of [[x0, 'T_{\\rm P}'], [x1, '\\text{today}']]) {
			S.path([[P.X(x), P.bottom], [P.X(x), P.bottom + TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the end at ${src}` });
			L.push(await placed(src, P.X(x), P.bottom + TICK + 2.4, 0.5, 0, DIM));
		}
		L.push(await placed('\\text{temperature of the photons (K)}', P.X((x0 + x1) / 2), Math.max(...L.map((l) => l.box.b)) + 3.6, 0.5, 0, DIM));
		const yl = await yAxis(S, P, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0 ? null : String(t)), what: 'the Ta axis' });
		L.push(...yl);
		L.push(await placed('Ta\\ \\text{(today\'s photons: 1)}', Math.min(...yl.map((l) => l.box.l)), P.top - NAME_UP, 0, 1, DIM));
	}

	// ---- the lines
	const xs = STEPS.map((s) => X(s.T));
	const last = STEPS.length - 1;                              // the electrons
	const level = (g) => (G_TODAY / g) ** (1 / 3);
	// the neutrinos: at their value, stepping with the photons until the electrons' step, which they miss
	const nu = [[P.left, Y(level(G_HOT))]];
	for (let i = 0; i < last; i++) nu.push([xs[i], Y(level(STEPS[i].before))], [xs[i], Y(level(STEPS[i].after))]);
	nu.push([P.right, Y(level(STEPS[last].before))]);
	// the photons: just above the neutrinos, turning D earlier at each step, until the electrons' step
	const ph = [[P.left, Y(level(G_HOT)) - D]];
	for (let i = 0; i < last; i++) ph.push([xs[i] - D, Y(level(STEPS[i].before)) - D], [xs[i] - D, Y(level(STEPS[i].after)) - D]);
	ph.push([xs[last], Y(level(STEPS[last].before)) - D], [xs[last], Y(1)], [P.right, Y(1)]);
	const gr = [[P.left, Y(GRAV_FLAT) + D], [P.right, Y(GRAV_FLAT) + D]];
	S.path(gr, { color: FIELD, width: LINE_W, cap: 'butt', layer: 3, what: 'the gravitons' });
	S.path(nu, { color: INK, width: LINE_W, cap: 'butt', layer: 3, what: 'the neutrinos' });
	S.path(ph, { color: LIGHT, width: LINE_W, cap: 'butt', layer: 3, what: 'the photons' });
	// the lines are the library's, wherever they are at their values
	for (const T of [1e31, 3e15, 1e14, 3e13, 1.8e13, 1e13, 1.5e12, 3e11, 1e9, 1e3]) {
		const x = X(T);
		const onNu = nu.findIndex((p, i) => i > 0 && nu[i - 1][0] <= x && p[0] > x && near(nu[i - 1][1], p[1], 1e-9));
		check(onNu > 0 && near(nu[onNu][1], Y(neutrinosTa(T)), 1e-9), `the neutrinos' line at ${T} K`);
		// the photons' corners stand D left of the neutrinos' while they share a line
		const off = T > STEPS[last].T ? D : 0, xp = x - off;
		const onPh = ph.findIndex((p, i) => i > 0 && ph[i - 1][0] <= xp && p[0] > xp && near(ph[i - 1][1], p[1], 1e-9));
		check(onPh > 0 && near(ph[onPh][1] + off, Y(photonsTa(T)), 1e-9), `the photons' line at ${T} K`);
	}
	check(near(level(G_HOT), GRAV_FLAT, 1e-15) && near(level(STEPS[last].before), NU_FLAT, 1e-12), 'the bundle\'s values');
	check(D - LINE_W >= 0.3, 'the bundle\'s air');
	// every step's height is (before/after)^{1/3} of the level below it
	STEPS.forEach((s) => check(near(level(s.after) / level(s.before), (s.before / s.after) ** (1 / 3), 1e-12), `the step ${s.key}`));

	// ---- the ends
	{
		const ends = [
			[`\\text{photons, }${T_GAMMA}\\,\\mathrm{K}`, Y(1), LIGHT],
			[`\\text{neutrinos, }${(T_GAMMA * NU_FLAT).toFixed(3)}\\,\\mathrm{K}`, Y(NU_FLAT), INK],
			[`\\text{gravitons, }${(T_GAMMA * GRAV_FLAT).toFixed(3)}\\,\\mathrm{K}`, Y(GRAV_FLAT) + D, FIELD]
		];
		for (const [src, y, color] of ends) L.push(await placed(src, P.right + END_AIR, y, 0, 0.5, color));
		check(ends[1][0].includes('1.945') && ends[2][0].includes('0.905'), 'today\'s temperatures');
	}

	// ---- the steps' names
	// a group of close steps: a bracket over the photons' corners, a leader up to the name, set left of it
	const group = async (from, to, top, labelY, src) => {
		const a = xs[from] - D - 1.2, b = xs[to] - D + 1.2, y = top - D - LINE_W / 2 - LABEL_GAP - 0.4;
		S.path([[a, y + BRACKET], [a, y], [b, y], [b, y + BRACKET]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: `the bracket of ${src}` });
		const m = (a + b) / 2;
		S.path([[m, y], [m, labelY]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: `the leader of ${src}` });
		L.push(await placed(src, m - LABEL_GAP - 0.4, labelY, 1, 0.5, INK));
	};
	await group(0, 1, Y(level(STEPS[1].after)), Y(0.5), '\\text{top quark; }W\\text{, }Z\\text{, Higgs}');
	await group(2, 4, Y(level(STEPS[4].after)), Y(0.6), '\\text{bottom, tau, charm}');
	// the tall steps: named beside their rise, right of it
	const beside = async (i, src, v = (level(STEPS[i].before) + level(STEPS[i].after)) / 2) => {
		L.push(await S.clear(src, xs[i] + LINE_W / 2 + LABEL_GAP + 0.4, Y(v), 0, 0.5, [1, 0], { color: INK }));
	};
	await beside(5, '\\text{quarks confined}');
	await beside(6, '\\text{muons, pions}');
	await beside(last, '\\text{electrons}', (NU_FLAT + 1) / 2);
	// the neutrinos' parting at 10^10 K: a leader down to the bundle, named above it, left of the electrons' rise
	{
		const p = [X(T_NU_PART), Y(NU_FLAT)];
		check(p[0] < xs[last] - LINE_W && p[0] > xs[6], 'the parting is not between the muons\' step and the electrons\'');
		const top = p[1] - D - LINE_W / 2 - 1.2, labelY = Y(0.81);
		S.path([[p[0], top], [p[0], labelY]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the parting\'s leader' });
		L.push(await placed('\\text{neutrinos part, }10^{10}\\,\\mathrm{K}', p[0] - LABEL_GAP - 0.4, labelY, 1, 0.5, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { levels: STEPS.map((s) => [s.key, level(s.before), level(s.after)]), grav: GRAV_FLAT, nu: NU_FLAT };
	return finish(S, L, [300, 345]);
}
