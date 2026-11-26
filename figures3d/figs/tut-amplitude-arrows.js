// The tutorial, section 8.1 (tutorial/quantum/states.md), its second diagram: the two terms of the amplitude at exit R
// added as arrows in the complex plane. Two panels side by side, each a complex plane with thin grey axes, the same
// scale and the same origin height. Left, "phi = 0": two equal ink arrows of length 1/2, both pointing straight up
// (each is i/2), head to tail, reaching i; a thicker arrow from the origin to i, "sum, length 1". Right, "phi = pi": the
// first arrow, i e^{i pi}/2 = -i/2, points down, the second, i/2, points up from its head, and the sum returns to the
// origin, an open circle, "sum 0". Under each panel the probability as a squared length, "P_R = 1" and "P_R = 0", and
// in smaller type "each arrow alone: 1/4". No orange or blue.
// Departures from the diagram's comment: the arrows that would lie on one another are drawn side by side, a few points
// apart (the two terms beside the sum on the left; the two terms on either side of the axis on the right, joined by a
// dotted step where the second begins at the first's head); the axes are named Re and Im; a quarter is set as 1/4, so
// that it reads on a phone. The two panels stay side by side on a phone, the figure being one drawing.
// Exact: every arrow's length and direction, from the terms i e^{i phi}/2 (by way of L) and i/2 (by way of R) computed
// by multiplying the chapter's tables with each path blocked in turn, and their sums, i and 0 (tut-quantum-lib.js,
// `terms` and `chapter`); the probabilities |sum|^2 = 1 and 0 and |term|^2 = 1/4. Schematic: the sideways offsets.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, AXIS, AXIS_HEAD, VEC, VEC_HEAD, DOT, LABEL_GAP } from './tut-pot-lib.js';
import { INK, DIM, PAGE } from '../lib.js';
import { chapter, palette, terms, add, abs2 } from './tut-quantum-lib.js';

const name = 'tut-amplitude-arrows';
const check = checker(name);

const UNIT = 62;                           // points per unit of amplitude
const RE = [-0.74, 0.74], IM = [-0.72, 1.2];   // each plane's axes, in units of amplitude
const PANEL_GAP = 56;                      // between the two planes' axes' ends
const OFF = 6.5;                           // the sideways offset of a term drawn beside another arrow
const SUM = { width: 1.25, head: 6 };      // the sum's arrow
const RING = 2.1;                          // the open circle of a zero sum
const SMALL = 7.4;                         // the smaller type

export default async function () {
	chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const panels = [
		{ phi: 0, title: '\\phi = 0', P: '1' },
		{ phi: Math.PI, title: '\\phi = \\pi', P: '0' }
	];
	const width = (RE[1] - RE[0]) * UNIT;
	const oy = ORIGIN;                                         // the origins' height on the page
	for (const [i, pn] of panels.entries()) {
		const ox = ORIGIN + (i - 0.5) * (width + PANEL_GAP);   // the panel's origin
		const at = ([re, im], dx = 0) => [ox + re * UNIT + dx, oy - im * UNIT];
		// the axes
		S.arrow(at([RE[0], 0]), at([RE[1], 0]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: `axis Re ${i}` });
		S.arrow(at([0, IM[0]]), at([0, IM[1]]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: `axis Im ${i}` });
		L.push(await S.clear('\\mathrm{Re}', at([RE[1], 0])[0], oy - AXIS / 2, 1, 1, [0, -1], { color: DIM, size: SMALL }));
		L.push(await S.clear('\\mathrm{Im}', at([0, IM[1]])[0], at([0, IM[1]])[1], 0, 0, [1, 0], { color: DIM, size: SMALL }));

		const { viaL, viaR } = terms(pn.phi), sum = add(viaL, viaR);
		check(near(viaL[0], 0, 1e-15) && near(viaR[0], 0, 1e-15), 'a term is not along the imaginary axis');
		check(near(abs2(viaL), 0.25, 1e-15) && near(abs2(viaR), 0.25, 1e-15), 'a term is not of length 1/2');
		if (i === 0) {
			check(near(sum[0], 0, 1e-15) && near(sum[1], 1, 1e-15) && near(abs2(sum), 1, 1e-15), 'the sum at phi = 0 is not i');
			// the sum along the axis, thick; the terms beside it, head to tail
			S.arrow(at([0, 0]), at(sum), { color: INK, width: SUM.width, head: SUM.head, layer: 3, what: 'the sum' });
			const a = S.arrow(at([0, 0], OFF), at(viaL, OFF), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the term by L' });
			const b = S.arrow(at(viaL, OFF), at(add(viaL, viaR), OFF), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the term by R' });
			check(near(a.L, UNIT / 2, 1e-9) && near(b.L, UNIT / 2, 1e-9), 'the terms are not half the unit long');
			L.push(await S.clear('i/2', OFF + ox + VEC / 2 + LABEL_GAP, (a.A[1] + a.B[1]) / 2, 0, 0.5, [1, 0]));
			L.push(await S.clear('i/2', OFF + ox + VEC / 2 + LABEL_GAP, (b.A[1] + b.B[1]) / 2, 0, 0.5, [1, 0]));
			L.push(await S.clear('\\text{sum, length } 1', ox - SUM.width / 2 - LABEL_GAP, oy - 0.72 * UNIT, 1, 0.5, [-1, 0]));
		} else {
			check(near(viaL[1], -0.5, 1e-15) && near(abs2(sum), 0, 1e-30), 'the sum at phi = pi is not 0');
			// the first term left of the axis, down; the second right of it, up from the first's head, a dotted step between
			const a = S.arrow(at([0, 0], -OFF), at(viaL, -OFF), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the term by L' });
			const b = S.arrow(at(viaL, OFF), at(sum, OFF), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the term by R' });
			check(near(a.L, UNIT / 2, 1e-9) && near(b.L, UNIT / 2, 1e-9) && near(a.B[1], b.A[1], 1e-9), 'the terms are not head to tail');
			// (passing under the imaginary axis, with air on either side of it)
			const cut = AXIS / 2 + 0.9;
			S.dots(a.B, [ox - cut, a.B[1]], { color: DIM, clear0: VEC_HEAD * 0.36 + 0.6, clear1: 0, layer: 2, what: 'the step' });
			S.dots([ox + cut, b.A[1]], b.A, { color: DIM, clear0: 0, clear1: VEC / 2 + 0.6, layer: 2, what: 'the step' });
			// the zero sum: an open circle at the origin, over the axes
			S.raw(`<circle cx="${n2(ox)}" cy="${n2(oy)}" r="${RING}" fill="${PAGE}" stroke="${INK}" stroke-width="${VEC}"/>`, 4);
			S.mark([[ox, oy]], RING + VEC / 2, 'the zero sum');
			L.push(await S.clear('i e^{i\\pi}\\!/2 = -i/2', ox - OFF - VEC / 2 - LABEL_GAP, (a.A[1] + a.B[1]) / 2 + 4, 1, 0.5, [-1, 0]));
			L.push(await S.clear('i/2', ox + OFF + VEC / 2 + LABEL_GAP, (b.A[1] + b.B[1]) / 2 + 4, 0, 0.5, [1, 0]));
			L.push(await S.clear('\\text{sum } 0', ox - RING - LABEL_GAP, oy - RING - LABEL_GAP, 1, 1, [-1, -1].map((v) => v / Math.SQRT2)));
		}
		// the title, above; the probabilities, below
		L.push(await placed(pn.title, ox, oy - IM[1] * UNIT - 6, 0.5, 1, INK));
		check(abs2(sum).toFixed(0) === pn.P, `P_R is not ${pn.P}`);
		const pr = await placed(`P_R = ${pn.P}`, ox, oy - IM[0] * UNIT + 6, 0.5, 0, INK);
		L.push(pr);
		check(near(abs2(viaL), 0.25, 1e-15), 'a term alone does not give 1/4');
		L.push(await placed('\\text{each arrow alone: } 1/4', ox, pr.box.b + 3, 0.5, 0, DIM, SMALL));
	}
	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
