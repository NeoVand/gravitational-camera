// The tutorial, section 8.3 (tutorial/quantum/quanta.md), its third diagram: how many quanta a mode holds. One panel
// on logarithmic axes: across, k_B T / hbar omega from 0.1 to 10^10 (a tick at each power of ten, every second one
// numbered); up, from 10^-5 to 10^10 (the same). Three curves: nbar = 1/(e^{hbar omega / k_B T} - 1), solid ink;
// nbar + 1/2 = <E> / hbar omega, dashed ink; the classical line k_B T / hbar omega, thin grey. Two marked points:
// silicon's Raman line at k_B T / hbar omega = 0.40, nbar = 0.090, "silicon, 15.6 THz", and the steel ball at
// k_B T / hbar omega = 4.1 x 10^8, nbar = 4.1 x 10^8, "steel ball, 15 kHz", their labels beside them, off the
// curves. Ink and grey only; no orange or blue.
// Departures from the diagram's comment: the three curves are named in a key at the lower right, where the panel is
// empty, since along most of their length they lie on one another. The solid one is named "nbar, the mean number of
// quanta", its formula being the chapter's box just above, so that no script inside a script is too small on a
// phone; "nbar + 1/2" is written with a slash rather than a built-up half for the same reason. The axis across is
// named "k_B T / hbar omega".
// Exact: every curve (the closed forms, asserted against the sum over the levels in tut-quanta-lib.js), the two
// points (from the chapter's constants: section 4.3's ball at 300 K, 15.6 THz at 300 K), the axes' decades.
import { Sheet, ORIGIN, finish, checker, placed, AXIS, HAIR, TICK, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near, nbar, energy } from './tut-quanta-lib.js';

const name = 'tut-occupation';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const X0 = -1, X1 = 10;                  // log10 of k_B T / hbar omega
const Y0 = -5, Y1 = 10;                  // log10 of the vertical axis
const DX = 23, DY = 14;                  // points per decade
const DASH = [3, 2];
const CLASSICAL_W = 0.5;
const DOT = 1.7;
const KEY_LINE = 18, PITCH = 14;         // the key's sample lines, and baseline to baseline
const KEY_AT = [4.6, -1.6];              // the key's first line, in decades

const pow = (k) => (k === 0 ? '1' : `10^{${k}}`);

export default async function () {
	const { ball, silicon } = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DX, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });
	const lg = Math.log10;
	check(lg(nbar(10 ** X0)) > Y0 && lg(energy(10 ** X1)) <= Y1 + 1e-9, 'a curve leaves the panel');

	// ---- the axes
	const xt = Array.from({ length: X1 - X0 + 1 }, (_, i) => X0 + i), yt = Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i);
	L.push(...(await xAxis(S, P, { ticks: xt, fmt: (k) => (k % 2 === 0 ? pow(k) : null), what: 'the axis across' })));
	L.push(...(await yAxis(S, P, { ticks: yt, fmt: (k) => (k % 2 === 0 ? pow(k) : null), what: 'the axis up' })));
	const below = Math.max(...L.map((l) => l.box.b));
	L.push(await placed('k_BT/\\hbar\\omega', P.X((X0 + X1) / 2), below + 4, 0.5, 0, DIM));

	// ---- the curves: the classical line, then nbar, then nbar + 1/2 on top
	const solid = graph(P, (x) => lg(nbar(10 ** x)), X0, X1);
	const dashed = graph(P, (x) => lg(energy(10 ** x)), X0, X1);
	for (const [pts, what] of [[solid, 'nbar'], [dashed, 'nbar + 1/2']]) check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
	S.path([P.at(X0, X0), P.at(X1, X1)], { color: FAINT, width: CLASSICAL_W, layer: 1.5, cap: 'butt', what: 'the classical line' });
	S.path(solid, { color: INK, width: CURVE, layer: 2, what: 'nbar' });
	S.path(dashed, { color: INK, width: CURVE, layer: 2.2, dash: DASH, cap: 'butt', what: 'nbar + 1/2' });
	// the curves' shapes, as the caption has them
	check(near(energy(10 ** X0), 0.5, 1e-4) && lg(nbar(10 ** X0)) < -4, 'nbar + 1/2 does not level off at 1/2 where nbar dies away');
	check(Math.abs(lg(energy(1e3)) - 3) < 1e-7 && Math.abs(lg(energy(10 ** X1)) - X1) < 1e-9, 'nbar + 1/2 does not meet the classical line');

	// ---- the two points
	const dot = (t, n, what) => {
		const q = P.at(lg(t), lg(n));
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3);
		S.mark([q], DOT, what);
		return q;
	};
	check(near(silicon.n, nbar(silicon.t), 1e-15) && near(ball.n, nbar(ball.t), 1e-15), 'a point is not on the curve');
	const si = dot(silicon.t, silicon.n, 'silicon');
	const st = dot(ball.t, ball.n, 'the ball');
	// silicon's label below and to the right, under the curves; the ball's above and to the left, over the line
	L.push(await S.clear('\\text{silicon, 15.6 THz}', si[0] + DOT + LABEL_GAP, si[1] + DOT + LABEL_GAP, 0, 0, [0.6, 0.8]));
	const up = [-DY, -DX].map((v) => v / Math.hypot(DX, DY));
	L.push(await S.clear('\\text{steel ball, 15 kHz}', st[0] - DOT - LABEL_GAP, st[1] - DOT - LABEL_GAP, 1, 1, up));

	// ---- the key, in the empty lower right
	{
		const x = P.X(KEY_AT[0]);
		let y = P.Y(KEY_AT[1]);
		const rows = [
			[{ color: INK, width: CURVE }, '\\bar n\\text{, the mean number of quanta}', 'the key\'s solid line'],
			[{ color: INK, width: CURVE, dash: DASH }, '\\bar n + 1/2 = \\langle E\\rangle/\\hbar\\omega', 'the key\'s dashed line'],
			[{ color: FAINT, width: CLASSICAL_W }, 'k_BT/\\hbar\\omega\\text{, classical}', 'the key\'s grey line']
		];
		for (const [style, src, what] of rows) {
			S.path([[x, y], [x + KEY_LINE, y]], { ...style, layer: 2, cap: 'butt', what });
			L.push(await placed(src, x + KEY_LINE + LABEL_GAP + 1, y, 0, 0.5, INK));
			y += PITCH;
		}
		check(y < P.Y(Y0), 'the key runs below the panel');
	}

	S.checkAll(L);
	window[name + '-numbers'] = { silicon, ball };
	return finish(S, L, [260, 320]);
}
