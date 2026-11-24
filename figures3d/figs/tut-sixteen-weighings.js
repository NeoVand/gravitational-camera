// The tutorial, chapter 13.2 (tutorial/what-a-field-keeps/calderon.md), its second diagram: the sixteen weighings of
// one Fourier component, as a tree drawn left to right. The root, "one Fourier component", with the complex number
// int rho grad h_+ . grad h_- under its name; two branches, its real and its imaginary part; four nodes, the real
// integrals int rho grad u_+ . grad u_- and int rho grad v_+ . grad v_- under the real part, int rho grad u_+ . grad v_-
// and int rho grad v_+ . grad u_- under the imaginary part; eight nodes, the squares A(a + b) and A(a - b) of each
// integral's two profiles; sixteen leaves, E_+ and E_- under each square, each a small balance of one make. Thin single
// strokes, neutral; rho in matter's colour, as in the chapter's equations. A count under each column: 1, 2, 4, 8, 16.
// Departures from the diagram's comment: the squares are named with their profiles (A(u_+ + u_-) for the first, and so
// on), not as A(a + b) and A(a - b) alone.
// Exact: the tree, its labels and its counts (tut-calderon-lib.js, which checks the expansion into four integrals and
// the polarization identity, and the chapter's 4 x 2 x 2 = 16). Pictorial: the balances, which stand for weighings.
import { Sheet, ORIGIN, finish, checker, placed, n2, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK, DIM } from '../lib.js';
import { text } from '../stone.js';
import { chapter, INTEGRALS, COUNTS, MATTER } from './tut-calderon-lib.js';

const name = 'tut-sixteen-weighings';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const PITCH = 11.2;                    // between two leaves
const STUB = 6;                        // a spine to its children's labels
const AIR = 2.6;                       // a label's ink to its connector
const COL_GAP = 13;                    // the widest label of a column to the next column
const TREE_W = 0.45;                   // the connectors
const COUNT_GAP = 9;                   // the last leaf's ink to the counts
const caption = 'Look first at the counts under the columns: one complex ripple of the density needs four real integrals, each found from two squares by the polarization identity, and each square from two copies kicked both ways. The balances stand for weighings.';

const rho = `{\\color{${MATTER}}\\rho}`;
/** A balance: a foot, a post, a beam and two pans on strings, its foot's centre at (x, y), drawn in INK. */
function balance(S, x, y, what) {
	const W = 9.6, Hp = 6.2, foot = 4.2, str = 2.4, pan = 1.75, sw = 0.45;
	const top = y - Hp, l = x - W / 2, r = x + W / 2;
	const d = [
		`M${n2(x - foot / 2)},${n2(y)}H${n2(x + foot / 2)}`,                 // the foot
		`M${n2(x)},${n2(y)}V${n2(top)}`,                                     // the post
		`M${n2(l)},${n2(top)}H${n2(r)}`,                                      // the beam
		`M${n2(l)},${n2(top)}V${n2(top + str)}M${n2(r)},${n2(top)}V${n2(top + str)}`,     // the strings
		// the pans: half circles hanging from the strings
		`M${n2(l - pan)},${n2(top + str)}A${pan},${pan} 0 0,0 ${n2(l + pan)},${n2(top + str)}Z`,
		`M${n2(r - pan)},${n2(top + str)}A${pan},${pan} 0 0,0 ${n2(r + pan)},${n2(top + str)}Z`
	].join('');
	S.raw(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` +
		`<circle cx="${n2(x)}" cy="${n2(top)}" r="0.7" fill="${INK}"/>`, 2);
	S.boxes.push({ box: { l: l - pan - sw, r: r + pan + sw, t: top - 0.7, b: y + sw / 2 }, what });
	return { l: l - pan - sw / 2, r: r + pan + sw / 2, t: top - 0.7, b: y + sw / 2 };
}

export default async function () {
	const { state } = await chapter(check);
	state(name, 'sixteen-weighings', caption);
	const S = new Sheet(name);
	const L = [];

	// ---- the nodes, column by column; each node: { src, row (in leaves), parent }
	const y0 = ORIGIN - 7.5 * PITCH;
	const rowY = (i) => y0 + i * PITCH;
	const plus = (a, b) => `A(${a} + ${b})`, minus = (a, b) => `A(${a} - ${b})`;
	const cols = [
		[{ src: `\\begin{array}{l}\\text{one Fourier component}\\\\[1pt]\\textstyle\\int${rho}\\,\\nabla h_+\\cdot\\nabla h_-\\end{array}`, row: 7.5 }],
		[{ src: text('real part'), row: 3.5, parent: 0 }, { src: text('imaginary part'), row: 11.5, parent: 0 }],
		INTEGRALS.map((g, i) => ({ src: `\\textstyle\\int${rho}\\,\\nabla ${g.a}\\cdot\\nabla ${g.b}`, row: 1.5 + 4 * i, parent: g.part === 're' ? 0 : 1 })),
		INTEGRALS.flatMap((g, i) => [{ src: plus(g.a, g.b), row: 4 * i + 0.5, parent: i }, { src: minus(g.a, g.b), row: 4 * i + 2.5, parent: i }]),
		Array.from({ length: 16 }, (_, i) => ({ src: i % 2 === 0 ? 'E_+' : 'E_-', row: i, parent: Math.floor(i / 2), leaf: true }))
	];
	check(cols.map((c) => c.length).join() === COUNTS.join(), 'the columns\' counts');
	// every node stands at the middle of its children
	for (let c = 0; c + 1 < cols.length; c++) cols[c].forEach((n, i) => {
		const kids = cols[c + 1].filter((k) => k.parent === i);
		check(kids.length === 2 && Math.abs(n.row - (kids[0].row + kids[1].row) / 2) < 1e-12, `the node ${c}, ${i} is not between its two children`);
	});
	check(cols[2][0].src.includes('u_+') && cols[2][0].src.includes('u_-') && cols[2][3].src.includes('v_+') && cols[2][3].src.includes('u_-'), 'the integrals');

	// ---- place the columns from the left; a leaf is its balance and its label
	let x = ORIGIN - 160;
	const placedCols = [];
	for (const [c, col] of cols.entries()) {
		const nodes = [];
		for (const n of col) {
			const y = rowY(n.row);
			if (n.leaf) {
				const b = balance(S, x + 6.4, y + 3.1, `the balance ${nodes.length}`);
				const lab = await placed(n.src, b.r + 2.4, y, 0, 0.5, INK);
				L.push(lab);
				nodes.push({ ...n, y, l: b.l, r: lab.box.r, box: { l: b.l, r: lab.box.r, t: Math.min(b.t, lab.box.t), b: Math.max(b.b, lab.box.b) } });
			} else {
				const lab = await placed(n.src, x, y, 0, 0.5, INK);
				L.push(lab);
				nodes.push({ ...n, y, l: lab.box.l, r: lab.box.r, box: lab.box });
			}
		}
		placedCols.push({ x, nodes });
		x = Math.max(...nodes.map((n) => n.r)) + COL_GAP + STUB;
		void c;
	}

	// ---- the connectors: parent's stub to a spine, the spine, a stub to each child
	for (let c = 0; c + 1 < placedCols.length; c++) {
		const kidsCol = placedCols[c + 1];
		const spine = kidsCol.x - STUB;
		placedCols[c].nodes.forEach((p, i) => {
			const kids = kidsCol.nodes.filter((k) => k.parent === i);
			S.path([[p.r + AIR, p.y], [spine, p.y]], { color: DIM, width: TREE_W, cap: 'butt', layer: 1, what: `the stub of ${c}, ${i}` });
			S.path([[spine, kids[0].y], [spine, kids[1].y]], { color: DIM, width: TREE_W, cap: 'butt', layer: 1, what: `the spine of ${c}, ${i}` });
			for (const k of kids) S.path([[spine, k.y], [k.l - AIR, k.y]], { color: DIM, width: TREE_W, cap: 'butt', layer: 1, what: `the stub to ${c + 1}, ${k.row}` });
			check(p.r + AIR < spine - 1, `no room for the stub of ${c}, ${i}`);
		});
	}

	// ---- the counts, one under each column, centred on its labels
	const bottom = Math.max(...placedCols.flatMap((p) => p.nodes.map((n) => n.box.b)));
	for (const [c, p] of placedCols.entries()) {
		const l = Math.min(...p.nodes.map((n) => n.l)), r = Math.max(...p.nodes.map((n) => n.r));
		L.push(await placed(String(COUNTS[c]), (l + r) / 2, bottom + COUNT_GAP, 0.5, 0, DIM));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { counts: placedCols.map((p) => p.nodes.length) };
	return finish(S, L, [280, 360]);
}
