// The tutorial, section 5.1 (tutorial/waves/wave-equation.md), its fourth diagram: a wave train fading in a damped
// medium. A wave of one frequency at one instant, entering a medium from the left at x = 0 (the medium lightly shaded
// from x = 0 on): before x = 0 it is sin(omega x / c) of constant amplitude, and in the medium it is the solution of
// the damped wave equation driven at the real frequency omega, Re[e^{i(k x - omega t)}] with the exact complex
// wavenumber k = (omega/c) sqrt(1 + i Gamma/omega), drawn at the instant when x = 0 is a zero of the wave, so that the
// two pieces join with the same value and, to 3 x 10^-4 of the slope, the same slope. Its envelope +-e^{-Im(k) x},
// dashed, which on the page is e^{-Gamma x / 2c} to within 0.01 pt (asserted). Gamma/omega = 0.05, so that the
// attenuation length c/Gamma, marked on the axis with twice it, is 3.2 wavelengths; there the energy has fallen by e
// and the amplitude by sqrt(e). A bar of one wavelength over two crests before the medium.
// Exact: the curve (asserted to solve u'' + Gamma u' - c^2 u_xx = 0 at points in the medium, and sampled every quarter
// of a point), the envelope (asserted to be touched and never crossed), the marks at c/Gamma and 2c/Gamma and the bar.
// Schematic: the damping, far stronger than in any real medium, and the join at x = 0, where a real boundary would
// also reflect a little of the wave.
import { Sheet, ORIGIN, finish, checker, placed, near, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, dimension, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { ZERO_LINE, ZERO_DASH } from './tut-bessel-lib.js';
import { TINT } from './tut-gauss-lib.js';
import { chapter, wavenumber, GAMMA } from './tut-wave-lib.js';
import { INK, DIM, FAINT } from '../lib.js';

const name = 'tut-wave-damped';
const check = checker(name);

// ---- the mathematics: x in wavelengths 2 pi c / omega, u in units of the incoming amplitude ---------------------
const [KR, KI] = wavenumber(GAMMA);       // units of omega / c
const TWO_PI = 2 * Math.PI;
export const X0 = -2, X1 = 7;             // the drawn stretch, wavelengths
/** The wave at the drawn instant: zero at x = 0. */
const wave = (x) => (x < 0 ? Math.sin(TWO_PI * x) : Math.exp(-TWO_PI * KI * x) * Math.sin(TWO_PI * KR * x));
const envelope = (x) => Math.exp(-TWO_PI * KI * x);
const chapterEnvelope = (x) => Math.exp(-TWO_PI * (GAMMA / 2) * x);
export const LENGTH = 1 / GAMMA / TWO_PI;  // c/Gamma, wavelengths

function mathematics(UNIT_Y) {
	const nums = chapter(check);
	// the wave in the medium solves u_tt + Gamma u_t - c^2 u_xx = 0: with omega = c = 1 and x in units of c/omega,
	// u(x, t) = e^{-KI x} sin(KR x - t)
	const U = (x, t) => Math.exp(-KI * x) * Math.sin(KR * x - t);
	const h = 1e-3;
	for (const x of [0.7, 5.1, 13.3, 30.2]) {
		const utt = (U(x, h) - 2 * U(x, 0) + U(x, -h)) / (h * h), ut = (U(x, h) - U(x, -h)) / (2 * h);
		const uxx = (U(x + h, 0) - 2 * U(x, 0) + U(x - h, 0)) / (h * h);
		check(Math.abs(utt + GAMMA * ut - uxx) < 1e-5, `the wave breaks the damped wave equation at ${x}`);
		check(near(U(x, 0), wave(x / TWO_PI), 1e-12), 'the drawn wave is not the solution at t = 0');
	}
	// the join at x = 0: the same value, and slopes that differ by the fraction 1 - KR (3 x 10^-4)
	check(wave(0) === 0 && Math.abs(Math.sin(TWO_PI * -1e-12)) < 1e-10, 'the wave is not zero at x = 0');
	check(Math.abs(KR - 1) < 4e-4, `the slopes at x = 0 differ by ${KR - 1}`);
	// the envelope is touched (where sin = +-1) and never crossed, and is e^{-Gamma x / 2c} to 0.01 pt on the page
	for (let x = 0; x <= X1; x += 1e-4) {
		check(Math.abs(wave(x)) <= envelope(x) + 1e-15, `the wave leaves its envelope at ${x}`);
		check(Math.abs(envelope(x) - chapterEnvelope(x)) * UNIT_Y < 0.01, `the envelope differs from e^{-Gamma x/2c} at ${x}`);
	}
	for (let n = 0; n < 6; n++) { const x = (0.25 + n / 2) / KR; check(near(Math.abs(wave(x)), envelope(x), 1e-14), `the wave does not touch its envelope at ${x}`); }
	// at c/Gamma the amplitude has fallen by sqrt(e) (by 1.6 x 10^-4 more, with the exact Im k), at 2c/Gamma by e
	check(near(chapterEnvelope(LENGTH), Math.exp(-0.5), 1e-15) && near(chapterEnvelope(2 * LENGTH), Math.exp(-1), 1e-15), 'the amplitude at c/Gamma');
	check(Math.abs(envelope(LENGTH) / Math.exp(-0.5) - 1) < 2e-4, 'the exact envelope at c/Gamma');
	check(near(LENGTH, nums.lengths, 1e-15) && LENGTH.toFixed(1) === '3.2', `c/Gamma = ${LENGTH} wavelengths`);
	// the crests before the medium, at x = -1.75 and -0.75: one wavelength apart
	check(near(wave(-1.75), 1, 1e-12) && near(wave(-0.75), 1, 1e-12), 'the bar\'s crests');
	return nums;
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const UNIT = 31;                          // points per wavelength
const AMP = 26;                           // points per unit of u
const TOP = 1.3, BOTTOM = -1.12;          // the plot's range of u: room for the bar above
const ENV = 0.45, ENV_DASH = [1.8, 1.4];  // the envelope, as section 4.1's ring-down (figs/tut-osc-ringdown.js)
const BAR = 1.17;                         // the bar's height, units of u

export default async function () {
	mathematics(AMP);
	const S = new Sheet(name);
	const L = [];
	const PW = (X1 - X0) * UNIT, PH = (TOP - BOTTOM) * AMP;
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: X0, x1: X1, y0: BOTTOM, y1: TOP });

	// ---- the medium, shaded from x = 0 to the end, under everything
	S.raw(`<path d="M${n2(P.X(0))},${n2(P.top)}H${n2(P.right)}V${n2(P.bottom)}H${n2(P.X(0))}Z" fill="${TINT}"/>`, 0.1);

	// ---- the level at rest, the envelope, the wave
	S.path([[P.left, P.Y(0)], [P.right, P.Y(0)]], { color: DIM, width: ZERO_LINE, dash: ZERO_DASH, cap: 'butt', layer: 0.5, what: 'the level at rest' });
	for (const s of [1, -1]) {
		const pts = graph(P, (x) => s * envelope(x), 0, X1);
		check(longest(pts) <= 0.2501, 'the envelope is sampled too coarsely');
		S.path(pts, { color: FAINT, width: ENV, dash: ENV_DASH, cap: 'butt', layer: 1.5, what: s > 0 ? 'the upper envelope' : 'the lower envelope' });
	}
	const pts = graph(P, wave, X0, X1);
	check(longest(pts) <= 0.2501, `the wave has a step of ${longest(pts)} pt`);
	S.path(pts, { color: INK, width: CURVE, layer: 2, what: 'the wave' });

	// ---- one wavelength, over two crests before the medium
	dimension(S, P.X(-1.75), P.X(-0.75), P.Y(BAR), { color: DIM, what: 'the wavelength' });
	L.push(await placed('\\lambda', P.X(-1.25), P.Y(BAR) - LABEL_GAP - 0.4, 0.5, 1, DIM));

	// ---- the axes: x with the marks 0, c/Gamma, 2c/Gamma; u with -1, 0, 1
	const marks = { 0: '0', [LENGTH]: 'c/\\Gamma', [2 * LENGTH]: '2c/\\Gamma' };
	const xl = await xAxis(S, P, { ticks: [0, LENGTH, 2 * LENGTH], fmt: (t) => marks[t], what: 'the x axis' });
	L.push(...xl);
	L.push(await placed('x', P.right + 4, P.bottom, 0, 0.5, DIM));
	const fmt = (v) => (v < 0 ? `-${-v}` : `${v}`);
	L.push(...(await yAxis(S, P, { ticks: [-1, 0, 1], fmt, to: 1.12, what: 'the u axis' })));
	L.push(await S.clear('u', P.left, P.Y(1.12) - LABEL_GAP, 0.5, 1, [0, -1], { color: DIM }));

	S.checkAll(L);
	window[name + '-numbers'] = { kr: KR, ki: KI, length: LENGTH, atLength: envelope(LENGTH) };
	return finish(S, L, [240, 340]);
}
