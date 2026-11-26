// The tutorial, section 4.1 (tutorial/response/oscillator.md), its second diagram: the ring-down of section 1.7's
// cart with Q = 10 (m = 2 kg, k = 50 N/m, Gamma = 0.5 s^-1, omega_d = 4.994 s^-1), released from rest at q = 0.1 m:
// q(t) = 0.1 e^{-t/4} [cos omega_d t + (Gamma/2 omega_d) sin omega_d t] m for t from 0 to 8 s, one thin curve in the
// colour of the swing (the chapter's live figure, driven-cart); its envelope +-A e^{-t/4}, dashed, with
// A = 0.1 / cos(alpha) = 0.100125 m and tan(alpha) = Gamma / 2 omega_d, the amplitude of the chapter's boxed form,
// which the curve touches where cos(omega_d t - alpha) = +-1 (the chapter's diagram comment had 0.1 m, which the
// curve would cross by 0.13%); the dotted line at zero; a short upright tick across the upper envelope at t = 2 s,
// where the energy has fallen by e, and at t = 4 s, where the amplitude has.
// Exact: the curve (asserted to solve m q'' + m Gamma q' + k q = 0 from rest at 0.1 m), the envelope (asserted to be
// touched and never crossed), the two times (asserted: e^{-Gamma t} = 1/e at 2 s, e^{-Gamma t/2} = 1/e at 4 s), all
// in tut-osc-lib.js, `cart`. Every curve is sampled so that no two neighbouring points are more than a quarter of a
// point apart. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, TICK, HAIR } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { DIM, FAINT, ACCENT, ZERO_LINE, ZERO_DASH } from './tut-bessel-lib.js';
import { cart, ringdown, envelope, GAMMA } from './tut-osc-lib.js';

const name = 'tut-osc-ringdown';
const check = checker(name);

const TMAX = 8;
const PW = 290, UNIT = 560;                // t from 0 to 8 s; points per metre of q
const TOP = 0.108, BOTTOM = -0.108;        // room for the envelope, +-0.100125 at t = 0, 3 pt clear of the axis
const ENV_DASH = [1.8, 1.4];               // the envelope, as section 3.6's far form (figs/tut-bessel-j0-j1.js)
const ENV = 0.45;
const MARK = 2.6;                          // half the length of a time's tick across the envelope

export default async function () {
	cart(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - ((TOP - BOTTOM) * UNIT) / 2, w: PW, h: (TOP - BOTTOM) * UNIT, x0: 0, x1: TMAX, y0: BOTTOM, y1: TOP });

	// ---- the zero line, the envelope, the curve
	S.path([[P.left, P.Y(0)], [P.right, P.Y(0)]], { color: DIM, width: ZERO_LINE, layer: 0.5, cap: 'butt', dash: ZERO_DASH, what: 'the zero line' });
	check(-envelope(0) > BOTTOM + 3 / UNIT, 'the envelope comes within 3 pt of the axis');
	for (const s of [1, -1]) {
		const pts = graph(P, (t) => s * envelope(t), 0, TMAX);
		check(longest(pts) <= 0.2501, `the envelope has a step of ${longest(pts)} pt`);
		S.path(pts, { color: FAINT, width: ENV, layer: 1.5, dash: ENV_DASH, cap: 'butt', what: s > 0 ? 'the upper envelope' : 'the lower envelope' });
	}
	const pts = graph(P, ringdown, 0, TMAX);
	check(longest(pts) <= 0.2501, `the ring-down has a step of ${longest(pts)} pt`);
	S.path(pts, { color: ACCENT, width: CURVE, layer: 2, what: 'the ring-down' });

	// ---- the two times, each a tick across the upper envelope with its words above
	const times = [{ t: 1 / GAMMA, src: '\\text{energy} \\div e' }, { t: 2 / GAMMA, src: '\\text{amplitude} \\div e' }];
	check(near(times[0].t, 2, 1e-15) && near(times[1].t, 4, 1e-15), 'the times are not 2 s and 4 s');
	for (const { t, src } of times) {
		const [x, y] = P.at(t, envelope(t));
		S.path([[x, y - MARK], [x, y + MARK]], { color: DIM, width: HAIR, layer: 3, cap: 'butt', what: `the tick at ${t} s` });
		L.push(await S.clear(src, x, y - MARK - LABEL_GAP - 0.3, 0.5, 1, [0, -1], { color: DIM }));
	}

	// ---- the axes
	L.push(...(await xAxis(S, P, { ticks: [0, 2, 4, 6, 8], what: 'the t axis' })));
	const last = L[L.length - 1];
	L.push(await placed('t\\ (\\mathrm{s})', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	const fmt = (v) => (v === 0 ? '0' : v < 0 ? `-${-v}` : `${v}`);
	L.push(...(await yAxis(S, P, { ticks: [-0.1, 0, 0.1], fmt, what: 'the q axis' })));
	L.push(await S.clear('q\\ (\\mathrm{m})', P.left + 4.5, P.top, 0, 1, [0, -1], { color: DIM }));

	S.checkAll(L);
	window[name + '-numbers'] = { A: envelope(0), times: times.map((x) => x.t) };
	return finish(S, L, [240, 340]);
}
