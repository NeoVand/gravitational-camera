// The tutorial, section 7.8 (tutorial/geometry/wave-energy.md), its first diagram: a gravitational wave fading in a
// slab of viscous medium. A plane wave travels left to right through a slab, lightly shaded, that fills the middle half
// of the drawing: its strain h at one instant, a thin curve in the field's colour, and its envelope, dashed, flat before
// the slab, falling inside it to 60 per cent and flat again after it. Inside the slab, under the wave, the medium seen
// along the wave: four thin ink strips, each displaced sideways from the one below, with a small double arrow,
// "sheared at (1/2) h-dot". Above the slab a wavy arrow rising in matter's colour, the heat, "(1/2) eta h-dot_ij
// h-dot_ij per m^3 per second". Under the slab one line, "energy falls by e in 1/alpha = 8.5 x 10^20 light-years of
// water". An arrow over the incoming wave shows its direction of travel. No orange or blue (they mean stretch and
// squeeze).
// Departures from the diagram's comment: the strips are the medium seen along the wave, and are named so ("medium,
// seen along the wave"), because a gravitational wave shears the medium across its direction of travel (its strain is
// transverse, h_xj = 0 for a wave along x): strips sliding along the page's horizontal, the direction of travel, would
// show a shear the wave does not make. The heat's label reads "per m^3 per second": (1/2) eta h-dot h-dot is a power
// per volume, in W m^-3, not an energy per volume. The caption's exaggeration is about 10^37 (8 x 10^36, asserted),
// not 10^36: water's amplitude falls by alpha / 2 = 6 x 10^-38 across a metre, the drawn one by ln(1/0.6) = 0.51.
// Exact: the wave in the slab, the solution of the damped wave equation driven at a real frequency with the exact
// complex wavenumber (as section 5.1's tut-wave-damped), its damping chosen so that the envelope falls to 0.6 across
// the slab (asserted, and the wave asserted to solve the equation and never to leave its envelope); the number under
// the slab (tut-memory-lib.js, `chapter`). Schematic: the damping, about 10^37 times water's for a slab a metre thick;
// the joins at the slab's faces, where a real face would also reflect a little of the wave; the strips and their
// displacement; the heat arrow.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, AXIS, AXIS_HEAD, VEC, VEC_HEAD, HAIR } from './tut-pot-lib.js';
import { Plot, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { TINT } from './tut-gauss-lib.js';
import { doubleArrow } from './tut-maxwell-lib.js';
import { wavenumber } from './tut-wave-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, FIELD, MATTER, SLAB_FALL } from './tut-memory-lib.js';

const name = 'tut-viscous-slab';
const check = checker(name);

// ---- the mathematics: x in wavelengths 2 pi c / omega, h in units of the incoming amplitude -----------------------
const TWO_PI = 2 * Math.PI;
const X0 = 0, X1 = 8, A = 2, B = 6;       // the drawn stretch and the slab's faces, wavelengths
/** Gamma / omega for which the exact envelope falls to SLAB_FALL across the slab: e^{-2 pi Im(k) (B - A)}. */
function damping() {
	let lo = 1e-4, hi = 0.5;
	for (let i = 0; i < 200; i++) {
		const g = (lo + hi) / 2, fall = Math.exp(-TWO_PI * wavenumber(g)[1] * (B - A));
		if (fall > SLAB_FALL) lo = g; else hi = g;
	}
	return (lo + hi) / 2;
}
const GAM = damping();
const [KR, KI] = wavenumber(GAM);
const PH_A = TWO_PI * A;                  // the phase at the slab's first face
const PH_B = PH_A + TWO_PI * KR * (B - A);
const envelope = (x) => (x < A ? 1 : x < B ? Math.exp(-TWO_PI * KI * (x - A)) : SLAB_FALL);
const wave = (x) => (x < A ? Math.sin(TWO_PI * x) : x < B ? envelope(x) * Math.sin(PH_A + TWO_PI * KR * (x - A)) : SLAB_FALL * Math.sin(PH_B + TWO_PI * (x - B)));

function mathematics() {
	const n = chapter(check);
	// the fall across the slab
	check(near(envelope(B - 1e-12), SLAB_FALL, 1e-9), `the envelope falls to ${envelope(B - 1e-12)}`);
	check(GAM > 0.03 && GAM < 0.05, `Gamma / omega = ${GAM}`);
	// in the slab the wave solves h_tt + Gamma h_t - c^2 h_xx = 0: with omega = c = 1, x in units of c / omega,
	// h(x, t) = e^{-KI x} sin(KR x - t)
	const H = (x, t) => Math.exp(-KI * x) * Math.sin(KR * x - t);
	const d = 1e-3;
	for (const x of [0.4, 3.3, 9.1, 22.7]) {
		const htt = (H(x, d) - 2 * H(x, 0) + H(x, -d)) / (d * d), ht = (H(x, d) - H(x, -d)) / (2 * d);
		const hxx = (H(x + d, 0) - 2 * H(x, 0) + H(x - d, 0)) / (d * d);
		check(Math.abs(htt + GAM * ht - hxx) < 1e-5, `the wave breaks the damped wave equation at ${x}`);
	}
	// the joins: the same value at both faces; the slopes differ by the fraction 1 - KR, a few parts in ten thousand
	check(near(wave(A - 1e-12), wave(A), 1e-9) && near(wave(B - 1e-12), wave(B), 1e-9), 'the wave jumps at a face');
	check(Math.abs(KR - 1) < 5e-4, `the slopes differ by ${KR - 1}`);
	for (let x = X0; x <= X1; x += 1e-4) check(Math.abs(wave(x)) <= envelope(x) + 1e-12, `the wave leaves its envelope at ${x}`);
	return n;
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const UNIT = 34;                          // points per wavelength
const AMP = 19;                           // points per unit of h
const TOP = 1.95, BOTTOM = -1.05;         // the plot's range of h: room above for the arrow of travel
const ENV = 0.45, ENV_DASH = [1.8, 1.4];  // the envelope, as section 5.1's
const SLAB_TOP = 1.32;                    // the slab's top, units of h
const STRIP = { n: 4, len: 30, w: 0.9, gap: 4.6, shift: 3.2, from: 0.32 };   // the strips: count, length, stroke,
// spacing, the displacement of each from the one below, and the stack's left end (wavelengths into the slab)
const STRIPS_DOWN = 9;                    // the lowest envelope inside the slab to the top strip
const SLAB_BELOW = 5.5;                   // the lowest label in the slab to the slab's bottom
const HEAT = { at: 0.55, len: 17, amp: 1.5, waves: 2, from: 1.6 };   // the heat arrow: where (fraction of the slab),
// its length, its wiggle's amplitude and count, and its foot's air above the slab
const TRAVEL = [0.2, 1.4, 1.62];          // the arrow of travel: from, to (wavelengths), height (units of h)

export default async function () {
	const nums = mathematics();
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const PW = (X1 - X0) * UNIT, PH = (TOP - BOTTOM) * AMP;
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: X0, x1: X1, y0: BOTTOM, y1: TOP });

	// ---- the envelope and the wave
	for (const s of [1, -1]) {
		const pts = graph(P, (x) => s * envelope(x), X0, X1);
		check(longest(pts) <= 0.2501, 'the envelope is sampled too coarsely');
		S.path(pts, { color: FAINT, width: ENV, dash: ENV_DASH, cap: 'butt', layer: 1.5, what: s > 0 ? 'the upper envelope' : 'the lower envelope' });
	}
	const pts = graph(P, wave, X0, X1);
	check(longest(pts) <= 0.2501, `the wave has a step of ${longest(pts)} pt`);
	S.path(pts, { color: FIELD, width: CURVE, layer: 2, what: 'the wave' });

	// ---- the arrow of travel over the incoming wave, h at its tail
	{
		const a = S.arrow(P.at(TRAVEL[0], TRAVEL[2]), P.at(TRAVEL[1], TRAVEL[2]), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the travel' });
		check(a.u[0] > 0.999, 'the wave does not travel to the right');
		L.push(await placed(`{\\color{${FIELD}}h}`, a.A[0] - LABEL_GAP - 0.6, a.A[1], 1, 0.5, INK));
	}

	// ---- the medium seen along the wave: four strips, each shifted sideways from the one below
	const yTop = P.Y(-envelope(A)) + STRIPS_DOWN;
	const x0 = P.X(A + STRIP.from);
	const strips = [];
	for (let k = 0; k < STRIP.n; k++) {
		const y = yTop + (STRIP.n - 1 - k) * STRIP.gap, x = x0 + k * STRIP.shift;    // k = 0 the lowest
		S.path([[x, y], [x + STRIP.len, y]], { color: INK, width: STRIP.w, cap: 'butt', layer: 2, what: `strip ${k}` });
		strips.push({ x, y });
	}
	for (let k = 1; k < STRIP.n; k++) check(near(strips[k].x - strips[k - 1].x, STRIP.shift, 1e-12), 'the strips are not sheared evenly');
	// the double arrow, right of the stack, level with the gap between the middle two strips
	const yMid = (strips[1].y + strips[2].y) / 2;
	const right = strips[STRIP.n - 1].x + STRIP.len;
	const da = doubleArrow(S, [right + 3.2, yMid], [right + 3.2 + 13, yMid], { color: INK, width: HAIR + 0.1, head: 3, layer: 3, what: 'the shear' });
	L.push(await placed(`\\text{sheared at }\\tfrac12\\dot{\\color{${FIELD}}h}`, da.B[0] + LABEL_GAP + 0.4, yMid, 0, 0.5, INK));
	const under = await placed('\\text{medium, seen along the wave}', x0, strips[0].y + STRIP.w / 2 + LABEL_GAP + 1.6, 0, 0, DIM);
	L.push(under);

	// ---- the slab, under everything: from above the wave's crests to below the strips' name
	const slab = { l: P.X(A), r: P.X(B), t: P.Y(SLAB_TOP), b: under.box.b + SLAB_BELOW };
	S.raw(`<path d="M${n2(slab.l)},${n2(slab.t)}H${n2(slab.r)}V${n2(slab.b)}H${n2(slab.l)}Z" fill="${TINT}"/>`, 0.1);
	check(slab.t < P.Y(1) - 3, 'the slab\'s top is too near the crests');

	// ---- the heat: a wavy arrow rising from the slab's top, in matter's colour
	{
		const cx = slab.l + HEAT.at * (slab.r - slab.l), y0 = slab.t - HEAT.from, y1 = y0 - HEAT.len;
		const hd = 3.4, body = HEAT.len - hd * 0.8;
		const wig = Array.from({ length: 241 }, (_, i) => { const s = i / 240; return [cx + HEAT.amp * Math.sin(TWO_PI * HEAT.waves * s), y0 - s * body]; });
		S.path(wig, { color: MATTER, width: VEC, cap: 'butt', layer: 3, what: 'the heat' });
		// the head, upright at the top, on the wiggle's axis
		const tip = [cx, y1], hw = 0.36 * hd;
		S.raw(`<path d="M${n2(tip[0])},${n2(tip[1])}L${n2(cx + hw)},${n2(y1 + hd)}L${n2(cx - hw)},${n2(y1 + hd)}Z" fill="${MATTER}"/>`, 3);
		S.mark([tip, [cx + hw, y1 + hd], [cx - hw, y1 + hd], tip], 0, 'the heat\'s head');
		check(near(Math.sin(TWO_PI * HEAT.waves), 0, 1e-12), 'the wiggle does not end on its axis');
		L.push(await placed(`\\text{heat }\\tfrac12{\\color{${MATTER}}\\eta}\\,\\dot{\\color{${FIELD}}h}_{ij}\\dot{\\color{${FIELD}}h}_{ij}\\text{ per m}^3\\text{ per second}`, cx + HEAT.amp + VEC / 2 + LABEL_GAP + 1, (y0 + y1) / 2, 0, 0.5, INK));
	}

	// ---- under the slab, one line
	{
		const ly = Number(nums.years.toExponential(1).split('e')[0]), ex = Number(nums.years.toExponential(1).split('e')[1]);
		check(ly === 8.5 && ex === 20, `1/alpha is ${nums.years} light-years`);
		L.push(await placed(`\\text{energy falls by }e\\text{ in }1/\\alpha = ${ly}\\times10^{${ex}}\\text{ light-years of water}`, (slab.l + slab.r) / 2, slab.b + LABEL_GAP + 2.4, 0.5, 0, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { gammaOverOmega: GAM, kr: KR, ki: KI, fall: envelope(B - 1e-12), exaggeration: nums.exaggeration };
	return finish(S, L, [240, 340]);
}
