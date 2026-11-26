// The tutorial, section 1.1 (tutorial/newton/vectors-and-indices.md), its third diagram: the cyclic orders of 1, 2
// and 3. The three numbers stand round a circle, 1 at the top and 2 and 3 a third of a turn on either side, the
// same in both drawings. On the left, arrows go round from 1 to 2 to 3 and back to 1 (anticlockwise), and the
// three orders read off that way, starting at each number in turn, are 1, 2, 3 and 2, 3, 1 and 3, 1, 2: the
// cyclic orders, with the sign + (orange). On the right the same circle is read the other way (clockwise), which
// gives 1, 3, 2 and 3, 2, 1 and 2, 1, 3, with the sign - (blue). Exact: the orders printed below each circle are
// read from its arrows by the code (asserted against the chapter's lists), the arrows are arcs of the circle, and
// each head is at most two fifths of its arc. Nothing is schematic.
import { Panel, v3, ACCENT, ACCENT2, INK } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, toBox, VEC } from './tut-vec-lib.js';

const R = 44;                           // the circle's radius, points
const C = 76;                           // each circle's centre, this far left or right of the middle, points
const NUMBER = 10;                      // the numbers' size
const SIGN = 13;                        // the signs' size
const AIR = 2.6;                        // between a number's ink and the arc on either side of it
const HEAD = 4.4;                       // an arc's head
const ROW_GAP = 7;                      // between a circle's lowest ink and its row of orders
const name = 'tut-vec-cyclic';
const check = checker(name);

// the numbers' places: 1 at the top, and anticlockwise from it 2, then 3 (degrees, anticlockwise from east)
const PLACE = { 1: 90, 2: 210, 3: 330 };
export const CYCLIC = ['1,2,3', '2,3,1', '3,1,2'];         // the chapter's lists
export const ANTICYCLIC = ['1,3,2', '3,2,1', '2,1,3'];

/** The three orders read round the circle in the sense s (+1 anticlockwise, -1 clockwise), starting at each number. */
function orders(s) {
	const met = [1, 2, 3].sort((p, q) => s * (PLACE[p] - PLACE[q]));     // in the order met going round
	const round = [0, 1, 2].map((j) => met[(met.indexOf(1) + j) % 3]);  // from 1
	return [0, 1, 2].map((k) => [0, 1, 2].map((j) => round[(k + j) % 3]).join(','));
}

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1, tilt: 0, turn: 0 });
	const ink = new Sheet(P, name);
	const L = [];
	const sides = [
		{ x: -C, sense: +1, color: ACCENT, sign: '+', want: CYCLIC },
		{ x: +C, sense: -1, color: ACCENT2, sign: '-', want: ANTICYCLIC }
	];
	// the readings: anticlockwise gives the cyclic orders, clockwise the others
	for (const sd of sides) {
		const got = orders(sd.sense);
		check(got.length === 3 && got.every((o) => sd.want.includes(o)) && sd.want.every((o) => got.includes(o)), `the ${sd.sign} circle reads ${got.join(' ')}`);
	}
	// rotating the order of a cyclic triple keeps it cyclic; swapping two numbers makes it anticyclic
	check(CYCLIC.every((o) => { const [a, b, c] = o.split(','); return ANTICYCLIC.includes([a, c, b].join(',')); }), 'a swap does not change the sign');

	const pt = (cx, deg, r = R) => v3(cx + r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180), 0);
	let lowest = -Infinity;
	for (const sd of sides) {
		// the numbers, each centred on its place on the circle
		const boxes = {};
		for (const n of [1, 2, 3]) {
			const [x, y] = ink.at(pt(sd.x, PLACE[n]));
			const lab = await placed(`${n}`, x, y, 0.5, 0.5, INK, NUMBER);
			boxes[n] = lab.box;
			L.push(lab);
		}
		// an arc leaves a number where the circle comes AIR from its ink, and arrives the same way
		const clearAngle = (n, dir) => {
			let deg = PLACE[n];
			while (toBox(boxes[n], ink.at(pt(sd.x, deg))) < AIR + VEC / 2) deg += dir * 0.01;
			return deg;
		};
		const seq = [1, 2, 3].sort((p, q) => sd.sense * (PLACE[p] - PLACE[q]));
		for (let k = 0; k < 3; k++) {
			const from = seq[k], to = seq[(k + 1) % 3];
			let d0 = clearAngle(from, sd.sense), d1 = clearAngle(to, -sd.sense);
			// unwrap so that the arc runs the sense's way from d0 to d1
			while (sd.sense * (d1 - d0) <= 0) d1 += sd.sense * 360;
			check(sd.sense * (d1 - d0) < 120, `the arc from ${from} to ${to} goes the long way round`);
			const arcLen = (Math.abs(d1 - d0) * Math.PI * R) / 180;
			const hd = Math.min(HEAD, 0.4 * arcLen);
			// the head: its tip on the circle at d1, its base on the circle hd behind it (along the chord)
			const back = (2 * Math.asin(hd / (2 * R)) * 180) / Math.PI;
			const dBase = d1 - sd.sense * back;
			// the shaft: the arc up to 0.8 of the head behind the tip, as lib.js draws a straight arrow
			const dShaft = d1 - sd.sense * ((2 * Math.asin((0.8 * hd) / (2 * R)) * 180) / Math.PI);
			const pts = Array.from({ length: 81 }, (_, i) => pt(sd.x, d0 + ((dShaft - d0) * i) / 80));
			ink.curve(pts, { color: sd.color, width: VEC, layer: 2, what: `the arc ${from} to ${to}` });
			const tip = ink.at(pt(sd.x, d1)), base = ink.at(pt(sd.x, dBase));
			const u = [(tip[0] - base[0]) / hd, (tip[1] - base[1]) / hd], w = [-u[1], u[0]], hw = 0.36 * hd;
			check(near(Math.hypot(tip[0] - base[0], tip[1] - base[1]), hd, 1e-9), 'a head is not its length');
			const tri = [tip, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw]];
			P.items.push({ kind: 'raw', layer: 2, depth: 0, svg: `<path d="M${tri.map((q) => q.map((v) => v.toFixed(2)).join(',')).join('L')}Z" fill="${sd.color}"/>` });
			ink.mark([...tri, tri[0]], 0, `the head of the arc ${from} to ${to}`);
			ink.arrows.push({ L: arcLen, head: hd, what: `the arc ${from} to ${to}` });
		}
		// the sign, in the circle's centre
		const [cx, cy] = ink.at(v3(sd.x, 0, 0));
		L.push(await placed(sd.sign, cx, cy, 0.5, 0.5, sd.color, SIGN));
		lowest = Math.max(lowest, ...Object.values(boxes).map((b) => b.b), ...ink.marks.flatMap((m) => m.pts.map((q) => q[1] + m.r)));
	}
	// the orders, one row under each circle, on one baseline
	for (const sd of sides) {
		const [cx] = ink.at(v3(sd.x, 0, 0));
		const src = orders(sd.sense).map((o) => o.split(',').join(',\\,')).join('\\quad ');
		L.push(await placed(src, cx, lowest + ROW_GAP, 0.5, 0, INK));
	}
	check(near(L[L.length - 1].box.t, L[L.length - 2].box.t, 1e-6), 'the rows of orders are not level');

	ink.checkAll(L, 2);
	return finish(name, P, L);
}
