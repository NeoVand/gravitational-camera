// The tutorial, section 4.6 (tutorial/response/fluctuation-dissipation.md), its third diagram: heat and causality reach
// the sum rule from opposite sides. Three boxes in a triangle, thin neutral strokes. Above, the sum rule, (2/pi)
// int_0^inf omega Im chi_h d omega = int rho |grad h|^2 dV. Below left, a warm body, <Q_h'^2> = k_B T int rho |grad
// h|^2 dV (4.2, equipartition), with an arrow up to the sum rule in the first accent, "fluctuation-dissipation theorem
// (4.6)"; below right, a pushed body, chi_h -> -int rho |grad h|^2 dV / omega^2 far above its modes (4.5, dust), with
// an arrow up to it in the second accent, "causality (4.5)". Nothing is computed: the boxes, their places and the
// arrows are schematic.
import { Sheet, ORIGIN, finish, checker, placed, n2, LABEL_GAP } from './tut-pot-lib.js';
import { INK, DIM, ACCENT, ACCENT2 } from '../lib.js';

const name = 'tut-fd-meeting';
const check = checker(name);

const BOX = 0.5;                          // the boxes' strokes
const PAD = [7, 5.5];                     // the air inside a box, across and down
const LEAD = 3.2;                         // between two lines of a box
const LOW_GAP = 40;                       // between the two lower boxes
const RISE = 72;                          // from the lower boxes' tops up to the upper box's foot
const ARROW = 0.75, HEAD = 4.4;
const AIR = 2.5;                          // an arrow stops this far from a box

/** Lines of TeX set one under another, centred on x, the first line's top at y; returns the labels and their box. */
async function lines(srcs, x, y, color = INK) {
	const out = [];
	let t = y;
	for (const s of srcs) {
		const l = await placed(s, x, t, 0.5, 0, color);
		out.push(l);
		t = l.box.b + LEAD;
	}
	return { labels: out, box: { l: Math.min(...out.map((l) => l.box.l)), r: Math.max(...out.map((l) => l.box.r)), t: y, b: out[out.length - 1].box.b } };
}

export default async function () {
	const S = new Sheet(name);
	const L = [];
	const rho = '\\rho\\,|\\nabla h|^2\\,dV';
	const texts = {
		top: ['\\text{the sum rule}', `(2/\\pi)\\int_0^\\infty \\omega\\,\\mathrm{Im}\\,\\chi_h\\,d\\omega = \\int ${rho}`],
		left: ['\\text{a warm body:}', `\\langle \\dot Q_h^2\\rangle = k_BT\\int ${rho}`, '\\text{(4.2, equipartition)}'],
		right: ['\\text{a pushed body:}', `\\chi_h \\to -\\int ${rho}/\\omega^2`, '\\text{far above its modes}', '\\text{(4.5, dust)}']
	};
	// measure each box's text, then size the boxes: the two lower ones of one width and height
	const probe = {};
	for (const k of Object.keys(texts)) probe[k] = (await lines(texts[k], 0, 0)).box;
	const lowW = Math.max(probe.left.r - probe.left.l, probe.right.r - probe.right.l) + 2 * PAD[0];
	const lowH = Math.max(probe.left.b - probe.left.t, probe.right.b - probe.right.t) + 2 * PAD[1];
	const topW = probe.top.r - probe.top.l + 2 * PAD[0], topH = probe.top.b - probe.top.t + 2 * PAD[1];
	const W = 2 * lowW + LOW_GAP;
	const lowTop = ORIGIN + RISE / 2, topTop = ORIGIN - RISE / 2 - topH;
	const boxes = {
		top: { l: ORIGIN - topW / 2, r: ORIGIN + topW / 2, t: topTop, b: topTop + topH },
		left: { l: ORIGIN - W / 2, r: ORIGIN - W / 2 + lowW, t: lowTop, b: lowTop + lowH },
		right: { l: ORIGIN + W / 2 - lowW, r: ORIGIN + W / 2, t: lowTop, b: lowTop + lowH }
	};
	for (const [k, b] of Object.entries(boxes)) {
		S.path([[b.l, b.t], [b.r, b.t], [b.r, b.b], [b.l, b.b]], { color: DIM, width: BOX, closed: true, cap: 'butt', what: `the ${k} box` });
		const h = probe[k].b - probe[k].t;
		const set = await lines(texts[k], (b.l + b.r) / 2, (b.t + b.b) / 2 - h / 2);
		for (const l of set.labels) check(l.box.l >= b.l + PAD[0] - 0.01 && l.box.r <= b.r - PAD[0] + 0.01 && l.box.t >= b.t + PAD[1] - 0.01 && l.box.b <= b.b - PAD[1] + 0.01, `${l.src} leaves its box`);
		L.push(...set.labels);
	}
	check(boxes.top.l > boxes.left.l && boxes.top.r < boxes.right.r, 'the upper box is wider than the two below');

	// ---- the arrows: from each lower box's top, at a third of the way in from its inner edge, up to the upper box's
	// foot, a quarter of the way in from its side
	const from = { left: [boxes.left.r - lowW / 3, boxes.left.t - AIR], right: [boxes.right.l + lowW / 3, boxes.right.t - AIR] };
	const to = { left: [boxes.top.l + topW / 4, boxes.top.b + AIR], right: [boxes.top.r - topW / 4, boxes.top.b + AIR] };
	const arrows = {};
	for (const [k, color] of [['left', ACCENT], ['right', ACCENT2]]) arrows[k] = S.arrow(from[k], to[k], { color, width: ARROW, head: HEAD, layer: 2, what: `the ${k} arrow` });
	// ---- their names, outside the triangle: the theorem to the left of the orange arrow, causality to the right of the
	// blue one, each centred on its arrow's middle height
	const mid = (a) => [(a.A[0] + a.B[0]) / 2, (a.A[1] + a.B[1]) / 2];
	const [mlx, mly] = mid(arrows.left), [mrx, mry] = mid(arrows.right);
	const fd1 = await S.clear('\\text{fluctuation–dissipation}', mlx - 6, mly - LEAD / 2 - 0.5, 1, 1, [-1, 0], { color: ACCENT });
	const fd2 = await S.clear('\\text{theorem (4.6)}', fd1.box.r, mly + LEAD / 2 + 0.5, 1, 0, [-1, 0], { color: ACCENT });
	const ca = await S.clear('\\text{causality (4.5)}', mrx + 6, mry, 0, 0.5, [1, 0], { color: ACCENT2 });
	L.push(fd1, fd2, ca);
	for (const l of [fd1, fd2, ca]) for (const b of Object.values(boxes)) check(l.box.b < b.t - LABEL_GAP || l.box.t > b.b + LABEL_GAP || l.box.r < b.l - LABEL_GAP || l.box.l > b.r + LABEL_GAP, `${l.src} is on a box`);

	S.checkAll(L);
	window[name + '-numbers'] = { boxes };
	return finish(S, L, [240, 340]);
}
