// The tutorial, chapter 12.2 (tutorial/sky/universe.md), its first diagram: two crests crossing an expanding universe.
// Time t runs to the right, from the first crest's emission t_e to the second crest's arrival; upward, distance in
// metres between galaxies (proper distance). The grid behind: five galaxies at rest among the expansion, at equal
// comoving distances from the source, so their lines fan out as a(t), and upright lines at equal times. The source is
// the bottom line, the observer the top one. A source emits two crests a period delta t_e apart (two short crest marks
// in the light role's colour); each crosses to the observer along its exact path, distance a(t) times the comoving
// distance covered, int c dt / a; they arrive delta t_0 apart. A short bracket under the source marks delta t_e, a long
// one over the observer marks delta t_0 = 3 delta t_e.
// The drawing's universe: a(t) proportional to t^{2/3} (matter alone), t_e = 1, delta t_e = 0.17. The arrival t_0 is
// found by bisection so that the two crests cover the same comoving distance and arrive exactly 3 delta t_e apart; the
// scale factor of each end is then its mean over the period, delta t / int dt / a (the text's "over which a hardly
// changes"), and their ratio is exactly 3 (asserted), the caption's "ratio 3 chosen for the drawing". Over the period
// a itself changes by 11% at the source and 6% at the observer.
// Departures from the diagram's comment: the brackets are the periods, delta t_e and delta t_0, laid along the time axis
// at the source and at the observer, since the wavelength is c times the period and the text derives the periods; the
// grid's lines are galaxies at rest, so that the band of comoving space widens with a(t) on the page, and the two paths,
// at one comoving distance apart, open as the grid does.
// Exact: both paths, the grid's fan, both brackets, for the drawing's a(t). Schematic: a(t)'s form, delta t_e and the
// ratio 3, chosen for the drawing.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR, AXIS, TICK } from './tut-pot-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter, LIGHT, stack } from './tut-universe-lib.js';

const name = 'tut-universe-crests';
const check = checker(name);

// ---- the drawing's universe (units of t_e = 1, c = 1) -------------------------------------------------------------
const a = (t) => t ** (2 / 3);
const eta = (t) => 3 * t ** (1 / 3);          // int dt / a
const TE = 1, DE = 0.17, RATIO = 3;
const GALAXIES = 4;                           // comoving intervals between the source and the observer
// ---- the drawing (points) -----------------------------------------------------------------------------------------
const W = 240;                                // the time span drawn
const TOP = 118;                              // the observer's height at the right end
const PAD = [0.22, 0.28];                     // time drawn before t_e and after the second arrival
const RAY = 0.8, GRID = 0.4, EDGE = 0.55;     // the paths, the grid, the source's and the observer's lines
const CREST = 3.2, CREST_AT = 15;              // half a crest mark, and its distance along its path
const AXIS_DROP = 16;                         // the time axis under the source
const BRACKET_GAP = 3.4;                      // the observer's bracket over its line
const BRACKET_DROP = 7;                       // the source's bracket under its line, room for its name
const END = 2;                                // half a bracket's end
const TINT = '#eeebe5';                       // the band (drawing.ts, THEME: a neutral tint of the page)
const caption = 'Look first at the two brackets: the two crests cross the same comoving distance, so the time between them, and the wavelength, grows in proportion to the scale factor. The ratio 3 is chosen for the drawing; the microwave sky\'s is 1091.';

/** The arrival t_0 of the first crest: the second, emitted DE later, arrives RATIO DE after it over the same comoving
 * distance, i.e. eta(t_0 + RATIO DE) - eta(t_0) = eta(TE + DE) - eta(TE). */
function arrival() {
	const deta = eta(TE + DE) - eta(TE);
	let lo = TE, hi = 100;
	for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (eta(m + RATIO * DE) - eta(m) > deta) lo = m; else hi = m; }
	return (lo + hi) / 2;
}

export default async function () {
	const { state } = await chapter(check);
	state(name, 'universe-crests', caption);

	const t0 = arrival(), d0 = RATIO * DE;
	const chi = eta(t0) - eta(TE);                                  // the observer's comoving distance
	// the two crests cover the same comoving distance, and the periods are as the mean scale factors over them
	check(near(eta(t0 + d0) - eta(TE + DE), chi, 1e-12), 'the second crest does not reach the observer');
	const mean = (t, d) => d / (eta(t + d) - eta(t));
	check(near(mean(t0, d0) / mean(TE, DE), RATIO, 1e-12), 'the mean scale factors are not in the ratio 3');
	check(near(d0 / DE, mean(t0, d0) / mean(TE, DE), 1e-12), 'delta t_0 / delta t_e is not a_0 / a_e');
	const spreadE = a(TE + DE) / a(TE) - 1, spread0 = a(t0 + d0) / a(t0) - 1;
	check(Math.round(100 * spreadE) === 11 && Math.round(100 * spread0) === 6, `a over the periods: ${spreadE}, ${spread0}`);

	const S = new Sheet(name);
	const L = [];
	const tA = TE - PAD[0], tB = t0 + d0 + PAD[1];
	const sx = W / (tB - tA), sy = TOP / (a(tB) * chi);
	const left = ORIGIN - W / 2, base = ORIGIN + TOP / 2;
	const X = (t) => left + (t - tA) * sx;
	const Y = (x) => base - x * sy;                                // x: proper distance, units of c t_e
	/** Points along t -> (t, a(t) chi(t)), no two more than 0.25 points apart. */
	const curve = (f, t1, t2) => {
		const pts = [[X(t1), Y(f(t1))]];
		let t = t1;
		while (t < t2) {
			let dt = 0.25 / sx;
			for (let i = 0; i < 30; i++) { const u = Math.min(t2, t + dt); if (Math.hypot(X(u) - X(t), Y(f(u)) - Y(f(t))) <= 0.25) break; dt /= 2; }
			t = Math.min(t2, t + dt);
			pts.push([X(t), Y(f(t))]);
		}
		return pts;
	};

	// ---- the grid: galaxies at rest (proper distance a(t) times their comoving distance) and equal times
	for (let k = 1; k < GALAXIES; k++) S.path(curve((t) => a(t) * (chi * k) / GALAXIES, tA, tB), { color: RULE, width: GRID, cap: 'butt', layer: 0.5, what: `the galaxy ${k}` });
	for (let t = 1; t <= Math.floor(tB); t++) S.path([[X(t), Y(0)], [X(t), Y(a(t) * chi)]], { color: RULE, width: GRID, cap: 'butt', layer: 0.5, what: `the time ${t}` });
	const source = [[X(tA), Y(0)], [X(tB), Y(0)]];
	const observer = curve((t) => a(t) * chi, tA, tB);
	// the band of space between them, tinted
	S.raw(`<path d="M${[...observer, [X(tB), Y(0)], [X(tA), Y(0)]].map((p) => `${n2(p[0])},${n2(p[1])}`).join('L')}Z" fill="${TINT}"/>`, 0.3);
	S.path(source, { color: INK, width: EDGE, cap: 'butt', layer: 1, what: 'the source' });
	S.path(observer, { color: INK, width: EDGE, cap: 'butt', layer: 1, what: 'the observer' });
	L.push(await placed('\\text{source}', X(tA) - LABEL_GAP - 0.6, Y(0), 1, 0.5, INK));
	L.push(await placed('\\text{observer}', X(tB) + LABEL_GAP + 0.6, Y(a(tB) * chi), 0, 0.5, INK));

	// ---- the two crests' paths: proper distance a(t) [eta(t) - eta(emission)]
	const ray = (te, ta) => curve((t) => a(t) * (eta(t) - eta(te)), te, ta);
	const one = ray(TE, t0), two = ray(TE + DE, t0 + d0);
	check(near(one.at(-1)[1], Y(a(t0) * chi), 1e-9) && near(two.at(-1)[1], Y(a(t0 + d0) * chi), 1e-9), 'the paths do not end on the observer');
	S.path(one, { color: LIGHT, width: RAY, cap: 'butt', layer: 2, what: 'the first crest' });
	S.path(two, { color: LIGHT, width: RAY, cap: 'butt', layer: 2, what: 'the second crest' });
	// the crest marks: short strokes across each path, just after it leaves the source
	for (const [pts, what] of [[one, 'the first crest\'s mark'], [two, 'the second crest\'s mark']]) {
		const i = pts.findIndex((p) => Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]) >= CREST_AT);
		const [p, q] = [pts[i - 1], pts[i + 1]];
		const L0 = Math.hypot(q[0] - p[0], q[1] - p[1]), n = [-(q[1] - p[1]) / L0, (q[0] - p[0]) / L0];
		const c = pts[i];
		S.path([[c[0] - n[0] * CREST, c[1] - n[1] * CREST], [c[0] + n[0] * CREST, c[1] + n[1] * CREST]], { color: LIGHT, width: RAY + 0.3, cap: 'round', layer: 2.5, what });
	}

	// ---- the brackets: delta t_e under the source, delta t_0 over the observer
	const bracket = (xa, xb, y, up, what) => {
		S.path([[xa, y], [xb, y]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what });
		for (const x of [xa, xb]) S.path([[x, y - END], [x, y + END]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: `${what}'s end` });
		void up;
	};
	{
		const y = Y(0) + EDGE / 2 + BRACKET_DROP;
		bracket(X(TE), X(TE + DE), y, false, 'delta t_e');
		L.push(await placed('\\delta t_{\\rm e}', X(TE + DE) + LABEL_GAP + 0.6, y, 0, 0.5, INK));
		const yo = Y(a(t0 + d0) * chi) - EDGE / 2 - BRACKET_GAP - END;
		bracket(X(t0), X(t0 + d0), yo, true, 'delta t_0');
		L.push(await placed('\\delta t_0 = 3\\,\\delta t_{\\rm e}', X(t0) - LABEL_GAP - 0.6, yo, 1, 0.5, INK));
		// a dotted guide from the bracket's left end down to the first arrival
		S.dots([X(t0), yo + END + 0.9], [X(t0), Y(a(t0) * chi) - EDGE / 2 - 0.9], { color: DIM, layer: 1.5, what: 'the first arrival\'s guide' });
		// the brackets' ends stand over the emissions and the arrivals
		check(near(one[0][0], X(TE), 1e-9) && near(two[0][0], X(TE + DE), 1e-9) && near(one.at(-1)[0], X(t0), 1e-9) && near(two.at(-1)[0], X(t0 + d0), 1e-9), 'the brackets');
		check(near((X(t0 + d0) - X(t0)) / (X(TE + DE) - X(TE)), RATIO, 1e-12), 'the brackets are not in the ratio 3');
	}

	// ---- the time axis
	{
		const y = Y(0) + AXIS_DROP;
		S.path([[X(tA), y], [X(tB), y]], { color: DIM, width: AXIS, cap: 'butt', layer: 1, what: 'the time axis' });
		for (const [t, src] of [[TE, 't_{\\rm e}'], [t0, 't_0']]) {
			S.path([[X(t), y], [X(t), y + TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the tick ${src}` });
			L.push(await placed(src, X(t), y + TICK + 2.4, 0.5, 0, DIM));
		}
		L.push(await placed('\\text{time}\\ t', X((tA + tB) / 2), y + TICK + 2.4, 0.5, 0, DIM));
		// the upward direction's name, left of the band's left end, over the source's name
		const up = await stack(['\\text{distance}', '\\text{between}', '\\text{galaxies}\\ \\uparrow'], X(tA) - LABEL_GAP - 0.6, Y(a(tA) * chi) - 9, 1, DIM);
		L.push(up);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { t0, d0, chi, meanE: mean(TE, DE), mean0: mean(t0, d0), spreadE, spread0 };
	return finish(S, L, [290, 345]);
}
