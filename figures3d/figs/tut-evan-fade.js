// The tutorial, section 2.7 (tutorial/outside/evanescent.md), the fade on a logarithmic axis. The factor e^{-kh} by
// which a ripple of the potential fades between the scene and the height h, against h from 0 to 0.3 m, for crests
// 1 m, 30 cm and 10 cm apart (k = 2 pi over the spacing), on a logarithmic vertical axis from 1 down to 10^-9. On such
// an axis each fade is a straight line through 1 at h = 0, of slope -k / ln 10 decades per metre, so the three slopes
// stand as 1 : 3.3 : 10. Two dots on the 10 cm line, at h = 0.1 m and 0.2 m, where the fade is e^{-2 pi} = 1/535 and
// e^{-4 pi} = 1/(2.9 x 10^5): the chapter's numbers.
// Exact: the three lines (sampled every quarter of a point), the dots and their numbers (asserted), the slopes' ratios.
// The 10 cm line stays above 10^-9 to its end (asserted), so no line runs along an axis.
import { Sheet, ORIGIN, finish, checker, placed, near, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, INK, DIM, ACCENT, CURVE } from './tut-fourier-lib.js';

const name = 'tut-evan-fade';
const check = checker(name);

// ---- the mathematics: heights in metres --------------------------------------------------------------------------
export const SPACINGS = [1, 0.3, 0.1];                      // the crests' spacing, m
export const H = 0.3;                                       // the largest height, m
const k = (s) => (2 * Math.PI) / s;
/** The fade, as a base-10 logarithm. */
const fade = (s) => (h) => (-k(s) * h) / Math.LN10;

function mathematics() {
	check(Math.round(Math.exp(2 * Math.PI)) === 535, `e^{2 pi} = ${Math.exp(2 * Math.PI)}`);
	check((Math.exp(4 * Math.PI) / 1e5).toFixed(1) === '2.9', `e^{4 pi} = ${Math.exp(4 * Math.PI)}`);
	check(near(Math.exp(-k(0.1) * 0.1), Math.exp(-2 * Math.PI), 1e-15) && near(Math.exp(-k(0.1) * 0.2), Math.exp(-4 * Math.PI), 1e-15), 'the dots');
	const slopes = SPACINGS.map((s) => k(s) / k(SPACINGS[0]));
	check(slopes[1].toFixed(1) === '3.3' && near(slopes[2], 10, 1e-12), `the slopes are ${slopes}`);
	check(Math.exp(-k(0.1) * H) > 1e-9, 'the 10 cm line reaches the bottom of the axis');
	// the 30 cm line ends where the 10 cm line is at 0.1 m: only kh enters
	check(near(fade(0.3)(0.3), fade(0.1)(0.1), 1e-12), 'the 30 cm line at 0.3 m');
	return { slopes, e2pi: Math.exp(2 * Math.PI), e4pi: Math.exp(4 * Math.PI), end10: Math.exp(-k(0.1) * H) };
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const PW = 196, PH = 126;
const DOT = 1.5;

export default async function () {
	const nums = mathematics();
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: 0, x1: H, y0: -9, y1: 0 });

	// ---- the three fades: the 10 cm one, the paper's, in the accent
	const colours = [INK, INK, ACCENT];
	const names = ['1\\ \\mathrm{m}', '30\\ \\mathrm{cm}', '10\\ \\mathrm{cm}'];
	SPACINGS.forEach((s, i) => {
		const pts = graph(P, fade(s), 0, H);
		check(longest(pts) <= 0.2501, `the ${s} m line has a step of ${longest(pts)} pt`);
		S.path(pts, { color: colours[i], width: CURVE, layer: 2, what: `the ${s} m line` });
	});

	// ---- the axes: a tick at every decade, numbers at every third
	L.push(...(await yAxis(S, P, {
		ticks: [0, -1, -2, -3, -4, -5, -6, -7, -8, -9],
		fmt: (t) => (t === 0 ? '1' : t % 3 ? null : `10^{${t}}`),
		what: 'the vertical axis'
	})));
	const xl = await xAxis(S, P, { ticks: [0, 0.1, 0.2, 0.3], fmt: (t) => (t ? t.toFixed(1) : '0'), what: 'the h axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('h\\ (\\mathrm{m})', last.box.r + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(await S.clear('e^{-kh}', P.left + 5, P.top - LABEL_GAP, 0, 1, [0, -1], { color: DIM }));

	// ---- each line named at its end
	for (const [i, s] of SPACINGS.entries()) {
		L.push(await S.clear(names[i], P.right + LABEL_GAP + 0.5, P.Y(fade(s)(H)), 0, 0.5, [1, 0], { color: colours[i] }));
	}

	// ---- the two dots and their numbers
	for (const [h, src] of [[0.1, '1/535'], [0.2, '1/(2.9 \\times 10^{5})']]) {
		const c = P.at(h, fade(0.1)(h));
		S.fill(`M${n2(c[0] - DOT)},${n2(c[1])}a${DOT},${DOT} 0 1,0 ${2 * DOT},0a${DOT},${DOT} 0 1,0 ${-2 * DOT},0Z`,
			{ l: c[0] - DOT, r: c[0] + DOT, t: c[1] - DOT, b: c[1] + DOT }, { color: ACCENT, layer: 3, what: `the dot at ${h} m` });
		L.push(await S.clear(src, c[0] + DOT + LABEL_GAP, c[1] - 1, 0, 1, [0.6, -0.8], { color: ACCENT }));
	}

	S.checkAll(L);
	window.tutEvanFade = nums;
	return finish(S, L, [240, 340]);
}
