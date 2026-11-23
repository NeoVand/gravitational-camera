// The tutorial, chapter 5.4 (tutorial/waves/polarization.md), its first diagram: the two patterns of a gravitational
// wave on a ring of twelve free steel beads, the wave travelling out of the page toward the reader. Two rings side by
// side at one scale, each drawn displaced by delta xi = (1/2) h xi with the strain exaggerated to h = 0.36, so that
// each is an ellipse of semi-axes 1.18 and 0.82 (in units of the undisturbed radius); at each bead an arrow from its
// undisturbed place to it, orange where the bead has moved outward (a stretch) and blue where it has moved inward (a
// squeeze); the small axes e_1 (right) and e_2 (up) at each ring's lower left, and n, out of the page, at its centre.
// Left: the plus pattern, h_+ = 0.36, h_x = 0, stretch along e_1; right: the cross pattern, h_+ = 0, h_x = 0.36,
// stretch along the diagonal at 45 degrees. Each named over it, its table under it.
// Departures from the diagram's comment: the beads are Part 1's steel beads (figs/tut-five-lib.js), not ink dots; the
// cross pattern's beads stand at 15 + 30 k degrees, the plus ring's turned by 45 degrees, so that no bead moves only
// along the ring (at 0, 90, 180 and 270 degrees the cross pattern moves a bead neither out nor in, and its arrow could
// be neither colour); the axes are drawn small at each ring's lower left, as in Part 1, rather than through the
// centre, where they would run along the arrows.
// Exact: each ring, the image of the circle under 1 + h/2 (its semi-axes asserted); the beads, the images of their
// places; every arrow, from the place to the bead (asserted), all (1/2) h R long before they stop short of their bead,
// coloured by the sign of the bead's outward move (asserted nonzero); the tables. Exaggerated: h, about 10^20 times.
import { Panel, v3, INK } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, n2, HAIR } from './tut-vec-lib.js';
import { gnomon } from './tut-five-lib.js';
import { chapter, waveRing, H } from './tut-pol-lib.js';

const name = 'tut-pol-patterns';
const check = checker(name);

const R = 56;                             // points: the undisturbed ring's radius
const BEAD = 2.2;
const STEP = 164;                         // points between the two rings' centres
const GN = [-63, -60], GN_LEN = 14;       // the small axes: their corner from the ring's centre, their length
const NHAT = 2.3, NHAT_DOT = 0.75;        // n out of the page: a circle and its dot
const TABLE = 7.5;                        // the tables' type
const TITLE_GAP = 6;                      // from the highest bead to the title's ink
const TABLE_GAP = 5;                      // from the lowest mark to the table's ink

export default async function () {
	chapter(check);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const panels = [
		{ key: 'plus', hp: H, hx: 0, phase: 0, title: '\\text{plus, } e^+', table: '\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}', along: 0 },
		{ key: 'cross', hp: 0, hx: H, phase: Math.PI / 12, title: '\\text{cross, } e^\\times', table: '\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}', along: 45 }
	];
	const L = [];
	const rings = [];
	for (const [i, p] of panels.entries()) {
		const c = v3((i - 0.5) * STEP, 0, 0);
		const r = waveRing(ink, check, { c, R, hp: p.hp, hx: p.hx, phase: p.phase, bead: BEAD, arrows: true, what: `the ${p.key} ring` });
		// the stretch: the orange arrows are those of the beads within 45 degrees of the pattern's axis
		for (const b of r.beads) {
			const t = Math.atan2(b.xi[1], b.xi[0]) - (p.along * Math.PI) / 180;
			check((b.out > 0) === (Math.cos(2 * t) > 0), `the ${p.key} ring: bead ${b.k} is coloured against its pattern`);
		}
		check(r.arrows.length === 12 && r.arrows.filter((a) => a.out > 0).length === 6, `the ${p.key} ring: not six arrows of each colour`);
		for (const a of r.arrows) check(near(a.L + BEAD + 0.6, (H / 2) * R, 1e-9), `the ${p.key} ring: an arrow is not (1/2) h R long`);
		// the plus ring turned by 45 degrees is the cross ring
		rings.push({ c, r, p });

		// n, out of the page, at the centre
		const [X, Y] = ink.at(c);
		P.items.push({ kind: 'raw', layer: 3, depth: 0, svg: `<circle cx="${n2(X)}" cy="${n2(Y)}" r="${NHAT}" fill="none" stroke="${INK}" stroke-width="${HAIR + 0.1}"/><circle cx="${n2(X)}" cy="${n2(Y)}" r="${NHAT_DOT}" fill="${INK}"/>` });
		ink.mark([[X, Y]], NHAT + 0.25, `the ${p.key} ring's n`);
		L.push(await ink.label('\\hat n', [X, Y], [Math.SQRT1_2, -Math.SQRT1_2]));

		// the small axes
		const O = c.clone().add(v3(...GN, 0));
		const tips = gnomon(ink, O, [{ d: v3(1, 0, 0), tex: 'e_1' }, { d: v3(0, 1, 0), tex: 'e_2' }], GN_LEN, { what: `the ${p.key} ring's axes` });
		L.push(await ink.label('\\boldsymbol e_1', ink.at(tips[0]), [1, 0], 2.2));
		L.push(await ink.label('\\boldsymbol e_2', ink.at(tips[1]), [0, -1], 2.2));
	}
	// the plus ring turned by 45 degrees is the cross ring: bead for bead
	for (const b of rings[0].r.beads) {
		const t = Math.PI / 4, q = [b.p.x - rings[0].c.x, b.p.y];
		const turned = [Math.cos(t) * q[0] - Math.sin(t) * q[1], Math.sin(t) * q[0] + Math.cos(t) * q[1]];
		check(rings[1].r.beads.some((o) => near(o.p.x - rings[1].c.x, turned[0], 1e-9) && near(o.p.y, turned[1], 1e-9)), `the cross ring is not the plus ring turned by 45 degrees at bead ${b.k}`);
	}

	// the titles over the rings and the tables under them, each pair on one line
	const top = Math.min(...ink.marks.map((m) => Math.min(...m.pts.map((q) => q[1] - m.r))));
	const bottom = Math.max(...ink.marks.map((m) => Math.max(...m.pts.map((q) => q[1] + m.r))), ...L.map((l) => l.box.b));
	for (const { c, p } of rings) {
		const [X] = ink.at(c);
		L.push(await placed(p.title, X, top - TITLE_GAP, 0.5, 1, INK));
		L.push(await placed(p.table, X, bottom + TABLE_GAP, 0.5, 0, INK, TABLE));
	}
	ink.checkAll(L);
	window[name + '-numbers'] = { semi: [1 + H / 2, 1 - H / 2], arrow: (H / 2) * R };
	return finish(name, P, L, [240, 340]);
}
