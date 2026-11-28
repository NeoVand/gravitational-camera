// The tutorial, section 7.6 (tutorial/geometry/gravitational-waves.md), its third diagram: in a plane wave the magnetic
// part is the tide's own pattern turned by 45 degrees. Two panels side by side, each the paper's ring of twelve free
// steel beads (figure 2, panels (b) and (c); figs/tidal.js) with an arrow at every bead, the pale ring of half a cycle
// later and the dashed circle undisturbed. Left, "E, plus": the tide E = E+ diag(1, -1) with E+ < 0, stretched along
// e_1 and squeezed along e_2, its axes drawn as a small cross at the centre. Right, "B": the table B_ij = eps_ipq k_p E_qj
// of the same wave drawn the same way (each arrow -B xi), its axes along the diagonals. In the right panel, about its
// ring's centre, a short dashed ray along e_1 (where the left panel's stretch axis lies) and a curved ink arrow from it,
// anticlockwise, to the right panel's stretch axis, "45 degrees" (the comment's curved arrow between the panels did
// not show about what, or in which sense, the pattern turns). At each panel's lower left the axes e_1 (right) and e_2 (up), and the direction of travel k-hat
// out of the page at their corner. Under the right panel, "acts on gyroscopes, not on free balls; drawn with E's
// convention". E and B in the curvature's colour.
// Departures from the diagram's comment: the principal axes are a small cross at each ring's centre, inside the inward
// arrows, not lines through the whole ring, where they would run along the arrows on the axes; the direction of travel
// stands at the corner of the small axes e_1 and e_2 (as in section 5.4's rings), so that the two panels show the same
// fixed axes and the pattern turned in them; the pale ring of half a cycle later is drawn, as in the paper's panels;
// each arrow is orange where its bead is pushed outward and blue where inward (Part 1's colours), where the paper's
// are ink; the note under the right panel is set on three lines, so that it stays under its panel. Under the left
// panel, at the note's height, a key to the three rings: a short sample of each, "the ring now" (the solid line and a
// bead), "undisturbed" (the dashed line), "half a cycle later" (the pale dashes and a pale bead). The two titles stand
// on one baseline.
// Exact: B computed from E by eq:b-wave with the Levi-Civita symbol (tut-gw-lib.js), its axes asserted turned
// anticlockwise by 45 degrees from E's, its size equal to E's; each ring the image of the circle under 1 - eps T,
// each pale ring under 1 + eps T, every bead the image of its place, every arrow -T xi at one scale for both panels,
// its colour the sign of its bead's outward push (asserted nonzero); the right ring is the left one turned by 45
// degrees, bead for bead (asserted); the curved arrow from e_1 to the right panel's stretch axis, 45 degrees
// anticlockwise (asserted). Exaggerated: eps.
import { Sheet, ORIGIN, finish, checker, placed, beside, near, LABEL_GAP, HAIR, AXIS, AXIS_HEAD } from './tut-pot-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { STEEL } from './tut-five-lib.js';
import { turning } from './tut-flow-lib.js';
import { chapter, palette, stack, CURV, freeRing, odot, ODOT, magnetic, tide, axisOf, size, RING } from './tut-gw-lib.js';

const name = 'tut-gw-turned';
const check = checker(name);

const R = 36;                              // the undisturbed ring's radius, points
const EPS = 0.2;                           // the ring's strain (exaggerated; the paper's 0.2)
const REACH = 8.5;                         // an arrow's length per unit of push, points
const STEP = 128;                          // between the two rings' centres
const CROSS = 12.5;                        // half the length of each axis of the cross at a ring's centre
const GN = [-52, 60], GN_LEN = 12, GN_FROM = ODOT.r + 1.4;   // the small axes: corner from the centre (y down), length, start
const RAY = 15, RAY_DASH = [1.6, 1.2];     // the right panel's dashed ray along e_1, from its centre
const TURN = { r: 10.5, width: 0.6, head: 3.2 };   // the curved arrow of the turn, about the right ring's centre
const KEY = { sample: 14, air: 4, row: 10 };   // the key to the rings: a sample's length, its air to the words, between rows
const TITLE_AIR = 6;                       // the highest mark to a title's ink
const NOTE_AIR = 5;                        // the lowest mark to the note

export default async function () {
	chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const k = [0, 0, 1];
	const Ep = -1;                         // E+ < 0: a stretch along e_1
	const E3 = tide(Ep, 0), B3 = magnetic(k, E3);
	const E = [[E3[0][0], E3[0][1]], [E3[1][0], E3[1][1]]], B = [[B3[0][0], B3[0][1]], [B3[1][0], B3[1][1]]];
	check(near(size(B3), size(E3), 1e-15), '|B| is not |E|');
	const turn = (((axisOf(B) - axisOf(E)) * 180) / Math.PI + 360) % 180;
	check(near(turn, 45, 1e-9), `B is E turned by ${turn} degrees`);
	check(near(B[0][1], Ep, 1e-15) && near(B[0][0], 0, 1e-15), 'B is not E+ e^x');

	const panels = [
		{ key: 'E', T: E, phase: 0, title: `{\\color{${CURV}}\\mathcal E}\\text{, plus}` },
		{ key: 'B', T: B, phase: Math.PI / 4, title: `{\\color{${CURV}}\\mathcal B}` }
	];
	const rings = [];
	for (const [i, p] of panels.entries()) {
		const c = [ORIGIN + (i - 0.5) * STEP, ORIGIN];
		const r = freeRing(S, check, { c, R, T: p.T, eps: EPS, phase: p.phase, reach: REACH, what: `the ${p.key} ring` });
		// the stretch: outward (orange) arrows at the six beads within 45 degrees of the stretch axis
		const along = axisOf(p.T) + Math.PI / 2;             // the smaller eigenvalue's axis: the stretch
		for (const b of r.beads) check((b.out > 0) === (Math.cos(2 * (Math.atan2(b.xi[1], b.xi[0]) - along)) > 0), `the ${p.key} ring: bead ${b.k} coloured against its pattern`);
		check(r.arrows.filter((a) => a.out > 0).length === 6, `the ${p.key} ring: not six arrows of each colour`);
		rings.push({ c, r, p });

		// the axes: a small cross at the centre, along the table's eigen-axes
		for (const a of [along, along + Math.PI / 2]) {
			const u = [Math.cos(a), -Math.sin(a)];
			S.path([[c[0] - CROSS * u[0], c[1] - CROSS * u[1]], [c[0] + CROSS * u[0], c[1] + CROSS * u[1]]], { color: DIM, width: HAIR, cap: 'butt', what: `the ${p.key} ring's axis` });
		}
		// the small axes e_1, e_2 and k-hat out of the page at their corner
		const O = [c[0] + GN[0], c[1] + GN[1]];
		odot(S, O, `the ${p.key} panel's k`);
		const e1 = S.arrow([O[0] + GN_FROM, O[1]], [O[0] + GN_FROM + GN_LEN, O[1]], { width: AXIS, head: AXIS_HEAD, what: `the ${p.key} panel's e_1` });
		const e2 = S.arrow([O[0], O[1] - GN_FROM], [O[0], O[1] - GN_FROM - GN_LEN], { width: AXIS, head: AXIS_HEAD, what: `the ${p.key} panel's e_2` });
		L.push(await placed('\\boldsymbol e_1', e1.B[0] + LABEL_GAP + 0.6, e1.B[1], 0, 0.5, INK));
		L.push(await placed('\\boldsymbol e_2', e2.B[0], e2.B[1] - LABEL_GAP - 0.6, 0.5, 1, INK));
		L.push(await placed('\\hat k', O[0] - ODOT.r - LABEL_GAP - 0.4, O[1] + ODOT.r + 0.4, 1, 0, INK));
	}
	// the right ring is the left one turned anticlockwise by 45 degrees, bead for bead (and its pale ring with it)
	{
		const t = Math.PI / 4, [a, b] = rings;
		for (const bead of a.r.beads) {
			const q = [bead.p[0] - a.c[0], -(bead.p[1] - a.c[1])];
			const tq = [Math.cos(t) * q[0] - Math.sin(t) * q[1], Math.sin(t) * q[0] + Math.cos(t) * q[1]];
			check(b.r.beads.some((o) => near(o.p[0] - b.c[0], tq[0], 1e-9) && near(-(o.p[1] - b.c[1]), tq[1], 1e-9)), `the B ring is not the E ring turned by 45 degrees at bead ${bead.k}`);
		}
	}

	// ---- the turn, in the right panel about its ring's centre: a short dashed ray along e_1 (where the left panel's
	// stretch axis lies) and a curved arrow from it, anticlockwise, to the right panel's stretch axis, "45°"
	{
		const [cx, cy] = rings[1].c;
		S.path([[cx, cy], [cx + RAY, cy]], { color: INK, width: HAIR, dash: RAY_DASH, cap: 'butt', layer: 2, what: 'the left panel\'s stretch axis, again' });
		const along = axisOf(B) + Math.PI / 2;               // the right panel's stretch axis, from e_1, anticlockwise
		check(near(along, Math.PI / 4, 1e-9), `the right panel's stretch axis is at ${(along * 180) / Math.PI} degrees`);
		const t = turning(cx, cy, TURN.r, 0, along, INK, { width: TURN.width, head: TURN.head });
		S.raw(t.svg, 4);
		S.mark(t.pts, TURN.width / 2, 'the turn');
		S.mark(t.head, 0, 'the turn\'s head');
		check(t.len - t.hd > 3, 'the turn\'s arrow has no shaft');
		// its sense: from e_1 toward e_2, anticlockwise as seen (y up)
		check(t.head[0][1] < cy && t.head[0][0] > cx, 'the turn does not run anticlockwise');
		const m = along / 2, rr = TURN.r + LABEL_GAP + 0.6;
		L.push(await beside('45^\\circ', [cx + rr * Math.cos(m), cy - rr * Math.sin(m)], [Math.cos(m), -Math.sin(m)], 0.2, INK));
	}

	// ---- the titles over the rings, on one line, and the note under the right panel
	const marks = S.marks.flatMap((m) => m.pts.map((q) => [q[1] - m.r, q[1] + m.r]));
	const top = Math.min(...marks.map((m) => m[0]));
	// one baseline for both titles: the right one carries an invisible p on each side, as deep as the left one's
	const ghost = '{\\color{transparent}p}';
	for (const { c, p } of rings) L.push(await placed(p.key === 'B' ? `\\llap{${ghost}}${p.title}\\rlap{${ghost}}` : p.title, c[0], top - TITLE_AIR, 0.5, 1, INK));
	const bottom = Math.max(...marks.map((m) => m[1]), ...L.map((l) => l.box.b));
	const note = ['\\text{acts on gyroscopes,}', '\\text{not on free balls; drawn}', `\\text{with }{\\color{${CURV}}\\mathcal E}\\text{'s convention}`];
	L.push(await stack(note, rings[1].c[0], bottom + NOTE_AIR, 0.5, DIM));
	// the key to the three rings, under the left panel at the note's height: a short sample of each, then its words
	{
		const items = [['now', '\\text{the ring now}'], ['rest', '\\text{undisturbed}'], ['later', '\\text{half a cycle later}']];
		const probe = await Promise.all(items.map(([, t]) => placed(t, 0, 0, 0, 0.5, INK)));
		const wide = KEY.sample + KEY.air + Math.max(...probe.map((q) => q.box.r - q.box.l));
		const x0 = rings[0].c[0] - wide / 2;
		let y = bottom + NOTE_AIR + KEY.row / 2 - 1;
		for (const [k, src] of items) {
			const A = [x0, y], Bq = [x0 + KEY.sample, y], mid = [x0 + KEY.sample / 2, y];
			if (k === 'now') S.path([A, Bq], { color: INK, width: RING.stroke, cap: 'butt', layer: 2, what: 'the key\'s ring now' });
			if (k === 'rest') S.path([A, Bq], { color: DIM, width: 0.5, dash: RING.undisturbed, cap: 'butt', layer: 0, what: 'the key\'s undisturbed circle' });
			if (k === 'later') S.path([A, Bq], { color: RULE, width: 0.5, dash: RING.pale, cap: 'butt', layer: 0, what: 'the key\'s pale ring' });
			if (k === 'now') S.sphere(mid, RING.bead, STEEL, { layer: 3, spec: 0.6, shininess: 36 }, 'the key\'s bead');
			if (k === 'later') S.sphere(mid, RING.bead, STEEL, { layer: 1, opacity: 0.3, spec: 0.3 }, 'the key\'s pale bead');
			L.push(await placed(src, x0 + KEY.sample + KEY.air, y, 0, 0.5, k === 'now' ? INK : DIM));
			y += KEY.row;
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { turn, size: [size(E3), size(B3)] };
	return finish(S, L, [230, 300]);
}
