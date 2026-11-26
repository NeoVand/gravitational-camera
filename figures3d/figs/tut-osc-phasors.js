// The tutorial, section 4.1 (tutorial/response/oscillator.md), its fourth diagram: three small complex planes side by
// side, for section 1.7's cart with Q = 10 pushed at omega = 3, 5 and 8 s^-1. In each, the push's phasor F~ = 1 N along
// the positive real axis, in neutral ink, and the swing's phasor q~ = chi F~ in the swing's colour (the chapter's live
// figure, driven-cart), in metres on its own scale, the same in all three, shown by a bar of 0.1 m: at 3 s^-1,
// 0.0311 m at 5.4 degrees; at 5 s^-1, 0.200 m at 90 degrees; at 8 s^-1, 0.0128 m at 174.1 degrees. The lag phi marked in
// each by an arc from F~ anticlockwise to q~'s direction. Under each plane its omega and, in words, the lag.
// Exact: the phasors, chi(omega) F~ from eq:chi (tut-osc-lib.js, `cart`, asserted against the chapter's numbers), each
// drawn at its true modulus and argument on the common scale (asserted in points); the arcs' angles. Schematic: the
// arcs' radii, and the length that stands for 1 N.
import { Panel, v3, INK, DIM, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, VEC, VEC_HEAD, AXIS, AXIS_HEAD, HAIR } from './tut-vec-lib.js';
import { arc } from './tut-five-lib.js';
import { cart, chi, modulus, argument, deg } from './tut-osc-lib.js';

const name = 'tut-osc-phasors';
const check = checker(name);

const OMEGAS = [3, 5, 8];
const PER_M = 550;                        // points per metre of the swing, all three planes
const NEWTON = 34;                        // points for the push's 1 N (schematic)
const D = 112;                            // from one plane's origin to the next
const RE = [-24, 50], IM = [-12, 122];    // each plane's axes, points from its origin
const ARC = { 3: 26, 5: 15, 8: 12 };      // the lag's arc, radius in points: clear of the arrows' heads
const PRINTED = { 3: '5.4^\\circ', 5: '90^\\circ', 8: '174.1^\\circ' };
const WORDS = { 3: 'nearly in step', 5: 'a quarter swing behind', 8: 'nearly opposite' };
const BAR = 0.1;                          // the scale bar, metres
const END = 2.2;
const ROW = 11;                           // between the two lines under each plane

export default async function () {
	const n = cart(check);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const L = [];
	const rad = (d) => (d * Math.PI) / 180;
	const page = (a) => [Math.cos(a), -Math.sin(a)];

	for (const [k, w] of OMEGAS.entries()) {
		const O = v3((k - 1) * D, 0, 0);
		// the axes, thin and grey, with heads
		const reTip = O.clone().add(v3(RE[1], 0, 0)), imTip = O.clone().add(v3(0, IM[1], 0));
		ink.arrow(O.clone().add(v3(RE[0], 0, 0)), reTip, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: `plane ${k}: the real axis` });
		ink.arrow(O.clone().add(v3(0, IM[0], 0)), imTip, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: `plane ${k}: the imaginary axis` });
		if (k === 0) {
			L.push(await ink.label('\\mathrm{Re}', ink.at(reTip), [1, 0], 2.2, DIM));
			L.push(await ink.label('\\mathrm{Im}', ink.at(imTip), [0, -1], 2.2, DIM));
		}
		// the push, 1 N along the real axis; the swing, chi times it, at its true modulus and argument
		const F = ink.arrow(O, O.clone().add(v3(NEWTON, 0, 0)), { color: INK, width: VEC, head: VEC_HEAD, layer: 2, what: `plane ${k}: F` });
		const z = chi(w), r = modulus(z), a = argument(z);
		const p = n.ph.find((x) => x.w === w);
		check(near(r, p.r, 1e-15) && near(deg(a), p.a, 1e-12), `plane ${k}: the swing is not the chapter's`);
		const tip = O.clone().add(v3(PER_M * r * Math.cos(a), PER_M * r * Math.sin(a), 0));
		const q = ink.arrow(O, tip, { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 3, what: `plane ${k}: q` });
		check(near(q.L, PER_M * r, 1e-9), `plane ${k}: the swing is not drawn at its modulus`);
		ink.dot(O, { color: INK, layer: 4, what: `plane ${k}: the origin` });
		// the lag: an arc from F anticlockwise to the swing's direction
		const lag = arc(ink, O, ARC[w], 0, a, { color: DIM, what: `plane ${k}: the lag` });
		const end = lag.pts[lag.pts.length - 1].clone().sub(O), dir = tip.clone().sub(O);
		check(near(Math.atan2(end.y, end.x), Math.atan2(dir.y, dir.x), 1e-12), `plane ${k}: the arc does not end on the swing's direction`);
		check(a > 0 && a < Math.PI, `plane ${k}: the swing is not behind the push`);

		// labels: the phasors at their tips, the angle beside its arc
		L.push(await ink.label('\\tilde F', F.B, [0.25, 1], 2.2, INK));
		const qDir = w === 5 ? [1, 0] : w === 3 ? [-0.2, -1] : [-0.5, 1];
		L.push(await ink.label('\\tilde q', ink.at(tip), qDir, 2.2, ACCENT));
		const mid = a / 2;
		L.push(await ink.label(PRINTED[w], ink.at(O.clone().add(v3(ARC[w] * Math.cos(w === 8 ? rad(135) : mid), ARC[w] * Math.sin(w === 8 ? rad(135) : mid), 0))), page(w === 3 ? rad(60) : w === 8 ? rad(135) : mid), 2.2, DIM));
	}

	// ---- the scale of the swing: a bar of 0.1 m in the swing's colour, at the top right of the last plane
	const O3 = v3(D, 0, 0);
	const y = IM[1] - 16, x0 = O3.x + 12, x1 = x0 + PER_M * BAR;
	const [X0, Y] = ink.at(v3(x0, y, 0)), [X1] = ink.at(v3(x1, y, 0));
	check(near(X1 - X0, 55, 1e-9), 'the bar is not 0.1 m on the swing\'s scale');
	P.items.push({ kind: 'raw', layer: 2, depth: 0, svg: `<path d="M${X0.toFixed(2)},${Y.toFixed(2)}H${X1.toFixed(2)}M${X0.toFixed(2)},${(Y - END).toFixed(2)}V${(Y + END).toFixed(2)}M${X1.toFixed(2)},${(Y - END).toFixed(2)}V${(Y + END).toFixed(2)}" stroke="${ACCENT}" stroke-width="0.55" fill="none"/>` });
	ink.mark([[X0, Y], [X1, Y]], 0.3, 'the bar');
	ink.mark([[X0, Y - END], [X0, Y + END]], 0.3, 'the bar\'s end');
	ink.mark([[X1, Y - END], [X1, Y + END]], 0.3, 'the bar\'s end');
	L.push(await placed('0.1\\ \\mathrm{m}', (X0 + X1) / 2, Y - END - 2.4, 0.5, 1, ACCENT));

	// ---- under each plane: its omega, and the lag in words
	const [, base] = ink.at(v3(0, IM[0], 0));
	for (const [k, w] of OMEGAS.entries()) {
		const [x] = ink.at(v3((k - 1) * D, 0, 0));
		L.push(await placed(`\\omega = ${w}\\ \\mathrm{s^{-1}}`, x, base + 9, 0.5, 0, INK));
		L.push(await placed(`\\text{${WORDS[w]}}`, x, base + 9 + ROW, 0.5, 0, DIM));
	}

	ink.checkAll(L);
	void HAIR;
	window[name + '-numbers'] = n.ph;
	return finish(name, P, L, [240, 340]);
}
