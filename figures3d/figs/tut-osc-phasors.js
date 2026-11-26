// The tutorial, section 4.1 (tutorial/response/oscillator.md), its fourth diagram: three small complex planes, for
// section 1.7's cart with Q = 10 pushed at omega = 3, 5 and 8 s^-1. In each, the push's phasor F~ = 1 N along
// the positive real axis, in neutral ink, and the swing's phasor q~ = chi F~ in the swing's colour (the chapter's live
// figure, driven-cart), in metres on its own scale, the same in all three, shown by a bar of 0.1 m: at 3 s^-1,
// 0.0311 m at 5.4 degrees; at 5 s^-1, 0.200 m at 90 degrees; at 8 s^-1, 0.0128 m at 174.1 degrees. The lag phi marked in
// each by an arc from F~ anticlockwise to q~'s direction. Under each plane its omega and, in words, the lag.
// Exact: the phasors, chi(omega) F~ from eq:chi (tut-osc-lib.js, `cart`, asserted against the chapter's numbers), each
// drawn at its true modulus and argument on the common scale (asserted in points); the arcs' angles. Schematic: the
// arcs' radii, and the length that stands for 1 N.
// Each plane is cropped to the half the phasors use: its real axis runs only as far left as the arc needs, its
// imaginary axis only as high as its swing needs, each with a short tail below the real axis, so the planes differ in
// size (the one at 5 s^-1, whose swing is 0.200 m straight up, the tallest); they stand in one row in the order of
// omega, their real axes on one level line. The bar of 0.1 m stands
// upright beside the tall swing, its upper end level with the swing's tip, so that the swing reads as two bars.
// The common scale is 800 pt to the metre, so that the shortest swing (0.0128 m, at 8 s^-1) is 10 pt long and the
// longest 160 pt; the 1 N push is 44 pt. The lag of 5.4 degrees, too small to read on an arc inside the push, is marked
// on an arc of radius 64 pt, beyond the push's head, with q~'s direction carried out to it by a dotted line; the other
// two arcs have radius 25 pt. The two lines under each plane are centred on its real axis.
import { Panel, v3, INK, DIM, FAINT, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, VEC, VEC_HEAD, AXIS, AXIS_HEAD, HAIR } from './tut-vec-lib.js';
import { arc } from './tut-five-lib.js';
import { cart, chi, modulus, argument, deg } from './tut-osc-lib.js';

const name = 'tut-osc-phasors';
const check = checker(name);

const OMEGAS = [3, 5, 8];
const PER_M = 800;                        // points per metre of the swing, all three planes
const NEWTON = 44;                        // points for the push's 1 N (schematic)
const TAIL = 9;                           // the imaginary axis's tail below the real one, points
// each plane: its real axis from RE[0] to RE[1] points from its origin (to the tip of its head), its imaginary axis up
// to IM points; the arc's radius; the plane's origin across the page
// to IM points; the arc's radius; the plane's origin on the page (y up): one row, in the order of omega, the real axes
// on one level line
const PLANES = {
	3: { RE: [-TAIL, 90], IM: 44, ARC: 64, x: 0, y: 0 },
	5: { RE: [-TAIL, 62], IM: 0.2 * PER_M + 16, ARC: 25, x: 128, y: 0 },
	8: { RE: [-36, 62], IM: 44, ARC: 25, x: 240, y: 0 }
};
const PRINTED = { 3: '5.4^\\circ', 5: '90^\\circ', 8: '174.1^\\circ' };
const WORDS = { 3: 'nearly in step', 5: 'a quarter swing behind', 8: 'nearly opposite' };
const BAR = 0.1;                          // the scale bar, metres
const END = 2.2;
const ROW = 11;                           // between the two lines under each plane

export default async function () {
	const n = cart(check);
		const P = new Panel({ x: ORIGIN - 140, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const L = [];
	const rad = (d) => (d * Math.PI) / 180;
	const page = (a) => [Math.cos(a), -Math.sin(a)];

	const origin = (w) => v3(PLANES[w].x, PLANES[w].y, 0);
	for (const [k, w] of OMEGAS.entries()) {
		const { RE, IM, ARC } = PLANES[w];
		const O = origin(w);
		// the axes, thin and grey, with heads
		const reTip = O.clone().add(v3(RE[1], 0, 0)), imTip = O.clone().add(v3(0, IM, 0));
		ink.arrow(O.clone().add(v3(RE[0], 0, 0)), reTip, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: `plane ${k}: the real axis` });
		ink.arrow(O.clone().add(v3(0, -TAIL, 0)), imTip, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: `plane ${k}: the imaginary axis` });
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
		check(q.L >= 10, `plane ${k}: the swing is shorter than 10 pt`);
		check(PER_M * r * Math.sin(a) + 8 < IM && F.L + 8 < RE[1] && PER_M * r * Math.cos(a) - 6 > RE[0], `plane ${k}: a phasor reaches the end of an axis`);
		// the arc passes beyond the short swings' tips (at 3 and 8 s^-1); inside the push's head but at 3 s^-1,
		// where it lies beyond it
		check((w === 5 || ARC > q.L + 2) && (w === 3 ? ARC > F.L + 8 : ARC < F.L - VEC_HEAD - 2) && ARC + 6 < RE[1], `plane ${k}: the arc is not clear of the arrows' heads`);
		check(ARC * Math.cos(a) > RE[0] + 4, `plane ${k}: the arc reaches past the real axis's tail`);
		ink.dot(O, { color: INK, layer: 4, what: `plane ${k}: the origin` });
		// the lag: an arc from F anticlockwise to the swing's direction
		const lag = arc(ink, O, ARC, 0, a, { color: DIM, what: `plane ${k}: the lag` });
		const end = lag.pts[lag.pts.length - 1].clone().sub(O), dir = tip.clone().sub(O);
		check(near(Math.atan2(end.y, end.x), Math.atan2(dir.y, dir.x), 1e-12), `plane ${k}: the arc does not end on the swing's direction`);
		check(a > 0 && a < Math.PI, `plane ${k}: the swing is not behind the push`);
		// at 3 s^-1, the swing's direction carried out to the arc
		if (w === 3) ink.dots(tip, O.clone().add(v3((ARC + 4) * Math.cos(a), (ARC + 4) * Math.sin(a), 0)), { color: FAINT, clear0: 2.4, what: `plane ${k}: the swing's direction` });

		// labels: the phasors at their tips, the angle beside its arc
		L.push(await ink.label('\\tilde F', F.B, [0.25, 1], 2.2, INK));
		const qDir = w === 5 ? [-1, 0] : w === 3 ? [-0.3, -1] : [-0.45, 1];
		L.push(await ink.label('\\tilde q', ink.at(tip), qDir, 2.2, ACCENT));
		const at = w === 3 ? a : w === 8 ? rad(135) : a / 2;
		const out = w === 3 ? [1, -0.25] : page(at);
		L.push(await ink.label(PRINTED[w], ink.at(O.clone().add(v3(ARC * Math.cos(at), ARC * Math.sin(at), 0))), out.map((v) => v / Math.hypot(...out)), 2.2, DIM));
	}

	// ---- the scale of the swing: a bar of 0.1 m in the swing's colour, upright beside the middle plane's swing, its
	// upper end level with the swing's tip (which is two bars from the origin)
	const O2 = origin(5);
	const bx = O2.x + 12, y1 = O2.y + 0.2 * PER_M, y0 = y1 - PER_M * BAR;
	const [BX, Y0] = ink.at(v3(bx, y0, 0)), [, Y1] = ink.at(v3(bx, y1, 0));
	check(near(Y0 - Y1, 80, 1e-9), 'the bar is not 0.1 m on the swing\'s scale');
	P.items.push({ kind: 'raw', layer: 2, depth: 0, svg: `<path d="M${BX.toFixed(2)},${Y0.toFixed(2)}V${Y1.toFixed(2)}M${(BX - END).toFixed(2)},${Y0.toFixed(2)}H${(BX + END).toFixed(2)}M${(BX - END).toFixed(2)},${Y1.toFixed(2)}H${(BX + END).toFixed(2)}" stroke="${ACCENT}" stroke-width="0.55" fill="none"/>` });
	ink.mark([[BX, Y0], [BX, Y1]], 0.3, 'the bar');
	ink.mark([[BX - END, Y0], [BX + END, Y0]], 0.3, 'the bar\'s end');
	ink.mark([[BX - END, Y1], [BX + END, Y1]], 0.3, 'the bar\'s end');
	L.push(await placed('0.1\\ \\mathrm{m}', BX + END + 2.4, (Y0 + Y1) / 2, 0, 0.5, ACCENT));

	// ---- under each plane: its omega, and the lag in words, centred on its real axis
	for (const w of OMEGAS) {
		const { RE } = PLANES[w];
		const [x, base] = ink.at(v3(PLANES[w].x + (RE[0] + RE[1]) / 2, PLANES[w].y - TAIL, 0));
		L.push(await placed(`\\omega = ${w}\\ \\mathrm{s^{-1}}`, x, base + 9, 0.5, 0, INK));
		L.push(await placed(`\\text{${WORDS[w]}}`, x, base + 9 + ROW, 0.5, 0, DIM));
	}

	ink.checkAll(L);
	void HAIR;
	window[name + '-numbers'] = n.ph;
	return finish(name, P, L, [200, 450]);
}
