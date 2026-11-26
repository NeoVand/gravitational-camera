// The tutorial, section 6.4 (tutorial/relativity/energy-and-momentum.md), its second diagram: two lumps that stick.
// Two panels, "before" over "after". Before: two small round lumps in matter's colour on a thin line, each with an
// arrow in the observer's colour toward the centre, named "0.6c"; under them one bar for the pair, to scale, made of
// two solid segments of one unit of mc^2 each in matter's colour, named "rest energy mc^2" once, and two hatched
// segments of 0.25 each, named "energy of motion 0.25mc^2" once, 2.5 in all; the readout of the totals. After:
// one larger lump at the centre, no arrow, with a faint warm halo meaning heat, and one solid bar of 2.5 in matter's
// colour, named "rest energy Mc^2, M = 2.5m"; the same readout. A thin dotted line at 2.5 runs across both panels from
// one bar to the other and shows that the totals agree, and a thin dotted line at 2 is named "2m, Newton's mass".
// Departures from the diagram's comment: the panels are stacked, "before" over "after", at every width, so that the
// figure is narrow enough to keep its text large on a phone (a drawing is shown at most 1.9 site pixels to the point
// and shrinks with a narrower column); so the bars lie along the page, one over the other at
// one scale (52 points to mc^2, 99 site pixels, for the comment's 60), and the dotted lines at 2 and 2.5 run down
// from the first bar to the second, across both panels. The name "2m, Newton's mass" stands under the second bar, at
// the end of the line at 2, which runs on a few points past that bar. Both lumps of "before" and the one of "after"
// sit on a short line, the one of "after" kept clear of the dotted lines. The lump after the collision has the radius
// of a ball of 2.5 times the volume, though the caption says the lumps are not to scale. The halo is a radial fade of
// the page's accent, warm in both themes, at most a fifth opaque: no colour role of the chapter. The readouts say
// "sum E = 2.5mc^2, sum p = 0" for the comment's "E = 2.5mc^2, P = 0", since in the tutorial a bare P is a power (the
// chapter's footnote on letters) and the total momentum is the sum of the bodies' p.
// Exact: the bars, to scale (asserted against the chapter's 1, 0.25 and 2.5), and the dotted lines at 2 and 2.5 on the
// page (asserted on the segments' ends). The lumps are schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD, HAIR } from './tut-pot-lib.js';
import { INK, DIM, ACCENT } from '../lib.js';
import { chapter, palette, OBS, MATTER, LUMP_REST, LUMP_MOTION, BEFORE, AFTER, NEWTON } from './tut-momentum-lib.js';

const name = 'tut-momentum-lumps';
const check = checker(name);

const U = 52;                              // points per unit of mc^2 along the bars
const BAR = 8;                             // a bar's height
const SEAM = 0.9;                          // the air between two segments of a bar
const OUTLINE = 0.45;                      // a hatched segment's outline
const HATCH = 0.4, HATCH_STEP = 2.1;       // the hatching's lines and their spacing (measured across them)
const LUMP = 4.5;                          // a lump before, radius
const LUMP_AFTER = LUMP * Math.cbrt(AFTER); // the lump after: a ball of 2.5 times the volume
const HALO = 2.2;                          // the halo reaches this many lump radii
const HALO_PEAK = 0.2;                     // its opacity at the lump's edge
const APART = 40;                          // each lump before, from the centre
const ARROW = 22;                          // the arrows' length
const ROW = 3.2;                           // the air between rows of the panel
const PANELS = 14;                         // the air between the two panels
const CLEAR = 1.2;                         // the dotted lines start and end this far from a bar

/** Two labels as one, the lines of one name. */
const join = (a, b) => ({ src: `${a.src} ${b.src}`, svg: a.svg + b.svg, box: { l: Math.min(a.box.l, b.box.l), r: Math.max(a.box.r, b.box.r), t: Math.min(a.box.t, b.box.t), b: Math.max(a.box.b, b.box.b) } });

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - (AFTER * U) / 2;             // the bars' left end
	const X = (e) => x0 + e * U;                     // the page x of the energy e (units of mc^2) along a bar
	const centre = X(AFTER / 2);
	// the printed numbers, from the computed ones
	const total = String(+BEFORE.toFixed(2)), motion = String(+LUMP_MOTION.toFixed(2));
	check(total === '2.5' && String(+AFTER.toFixed(2)) === total && motion === '0.25' && NEWTON === 2, `the printed numbers ${total} ${motion}`);
	// the totals: a bare P is a power in the chapter, so the total momentum is written as a sum of p
	const READOUT = `\\textstyle\\sum E = ${total}mc^2,\\ \\sum\\boldsymbol{p} = 0`;

	// ---- the bars' segments, to scale
	const before = [[0, LUMP_REST], [LUMP_REST, 2 * LUMP_REST], [2 * LUMP_REST, 2 * LUMP_REST + LUMP_MOTION], [2 * LUMP_REST + LUMP_MOTION, BEFORE]];
	check(before[1][1] === NEWTON && near(before[2][1] - before[2][0], 0.25, 1e-15) && near(before[3][1], 2.5, 1e-15), 'the segments are not 1, 1, 0.25 and 0.25');
	check(near(BEFORE, AFTER, 1e-15), 'the totals differ');

	/** A solid segment from e0 to e1 at the top y; `inner` the ends that meet another segment. */
	const solid = (e0, e1, y, inner = [false, false], what = 'a solid segment') => {
		const l = X(e0) + (inner[0] ? SEAM / 2 : 0), r = X(e1) - (inner[1] ? SEAM / 2 : 0);
		S.fill(`M${l},${y}H${r}V${y + BAR}H${l}Z`, { l, r, t: y, b: y + BAR }, { color: MATTER, layer: 2, what });
	};
	/** A hatched segment: an outline and lines at 45 degrees, rising to the right, clipped to the inside. */
	const hatched = (e0, e1, y, inner, what) => {
		const l = X(e0) + (inner[0] ? SEAM / 2 : 0), r = X(e1) - (inner[1] ? SEAM / 2 : 0);
		S.path([[l + OUTLINE / 2, y + OUTLINE / 2], [r - OUTLINE / 2, y + OUTLINE / 2], [r - OUTLINE / 2, y + BAR - OUTLINE / 2], [l + OUTLINE / 2, y + BAR - OUTLINE / 2]], { color: MATTER, width: OUTLINE, closed: true, layer: 2, what });
		const a = l + OUTLINE, b = r - OUTLINE, t = y + OUTLINE, u = y + BAR - OUTLINE;
		const step = HATCH_STEP * Math.SQRT2;            // along x + y
		let d = '';
		for (let c = a + t + step / 2; c < b + u; c += step) {
			const xa = Math.max(a, c - u), xb = Math.min(b, c - t);
			if (xb - xa < 0.3) continue;
			d += `M${(xa).toFixed(2)},${(c - xa).toFixed(2)}L${(xb).toFixed(2)},${(c - xb).toFixed(2)}`;
		}
		S.raw(`<path d="${d}" stroke="${MATTER}" stroke-width="${HATCH}" stroke-linecap="butt" fill="none"/>`, 2);
		S.boxes.push({ box: { l, r, t: y, b: y + BAR }, what });
	};

	// ================= before =================
	let y = ORIGIN - 90;
	const t1 = await placed('\\text{before}', x0, y, 0, 0, INK);
	L.push(t1);
	// the lumps on their line, the arrows toward the centre at the lumps' height, their speeds over them
	const track1 = t1.box.b + ROW + 7.5 + 2 * LUMP + 0.5;
	const cy1 = track1 - HAIR / 2 - LUMP;
	S.path([[X(0) + 4, track1], [X(AFTER) - 4, track1]], { color: DIM, width: HAIR, cap: 'butt', what: 'the line before' });
	for (const s of [-1, 1]) {
		const cx = centre + s * APART;
		S.raw(`<circle cx="${cx.toFixed(2)}" cy="${cy1.toFixed(2)}" r="${LUMP}" fill="${MATTER}"/>`, 3);
		S.mark([[cx, cy1]], LUMP, `the lump ${s}`);
		const a0 = cx - s * (LUMP + 1.4), a1 = a0 - s * ARROW;
		const arr = S.arrow([a0, cy1], [a1, cy1], { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: `the arrow ${s}` });
		L.push(await S.clear('0.6c', (a0 + a1) / 2, cy1 - VEC / 2 - LABEL_GAP - 0.4, 0.5, 1, [0, -1], { color: OBS }));
		check(near(arr.L, ARROW, 1e-9), 'an arrow\'s length');
	}
	check(centre - APART - LUMP > X(0) + 4 && centre + APART + LUMP < X(AFTER) - 4, 'a lump is off its line');
	// the bar
	const bar1 = track1 + ROW + 4;
	solid(...before[0], bar1, [false, true], 'the first rest energy');
	solid(...before[1], bar1, [true, true], 'the second rest energy');
	hatched(...before[2], bar1, [true, true], 'the first energy of motion');
	hatched(...before[3], bar1, [true, false], 'the second energy of motion');
	L.push(await S.clear(`\\text{energy of motion } ${motion}mc^2`, X(BEFORE) + LABEL_GAP + 0.4, bar1 + BAR / 2, 0, 0.5, [1, 0], { color: MATTER }));
	const rest1 = await S.clear('\\text{rest energy } mc^2', X(0), bar1 + BAR + LABEL_GAP + 0.4, 0, 0, [0, 1], { color: MATTER });
	L.push(rest1);
	const read1 = await placed(READOUT, X(0), rest1.box.b + ROW + 1, 0, 0, INK);
	L.push(read1);

	// ================= after =================
	const t2 = await placed('\\text{after}', x0, read1.box.b + PANELS, 0, 0, INK);
	L.push(t2);
	const reach = HALO * LUMP_AFTER;
	// the lump under the title (the faint halo may reach up beside it), sitting on its line
	const cy2 = t2.box.b + ROW + LUMP_AFTER + 3;
	const track2 = cy2 + LUMP_AFTER + HAIR / 2;
	const half = 28;
	S.path([[centre - half, track2], [centre + half, track2]], { color: DIM, width: HAIR, cap: 'butt', what: 'the line after' });
	const defs = `<radialGradient id="${name}-heat" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${reach.toFixed(3)}">` +
		Array.from({ length: 25 }, (_, k) => {
			const u = k / 24, s = u * HALO;           // s: distance in lump radii
			const a = s <= 1 ? HALO_PEAK : HALO_PEAK * ((HALO - s) / (HALO - 1)) ** 2;
			return `<stop offset="${u.toFixed(4)}" stop-color="${ACCENT}" stop-opacity="${a.toFixed(4)}"/>`;
		}).join('') + '</radialGradient>';
	S.raw(`<circle cx="0" cy="0" r="${reach.toFixed(3)}" fill="url(#${name}-heat)" transform="translate(${centre.toFixed(2)},${cy2.toFixed(2)})"/>`, 2.5);
	S.mark([[centre, cy2]], reach, 'the halo');
	S.raw(`<circle cx="${centre.toFixed(2)}" cy="${cy2.toFixed(2)}" r="${LUMP_AFTER.toFixed(3)}" fill="${MATTER}"/>`, 3);
	const bar2 = track2 + ROW + 4;
	solid(0, AFTER, bar2, [false, false], 'the rest energy after');
	L.push(await S.clear(`\\text{rest energy } Mc^2,\\ M = ${total}m`, X(AFTER) + LABEL_GAP + 0.4, bar2 + BAR / 2, 0, 0.5, [1, 0], { color: MATTER }));

	// ---- the dotted lines: at 2.5 from bar to bar; at 2 from bar to bar and on past the second to its name
	S.dots([X(BEFORE), bar1 + BAR + CLEAR], [X(AFTER), bar2 - CLEAR], { color: DIM, layer: 1, what: 'the line at 2.5' });
	S.dots([X(NEWTON), bar1 + BAR + CLEAR], [X(NEWTON), bar2 - CLEAR], { color: DIM, layer: 1, what: 'the line at 2' });
	const tail = S.dots([X(NEWTON), bar2 + BAR + CLEAR], [X(NEWTON), bar2 + BAR + CLEAR + 5], { color: DIM, layer: 1, what: 'the line at 2, below' });
	check(near(X(NEWTON) - X(0), 2 * U, 1e-9) && near(X(BEFORE) - X(0), 2.5 * U, 1e-9), 'the dotted lines are not at 2 and 2.5');
	check(centre + half < X(NEWTON) - 4 && centre + reach < X(NEWTON) - 4, 'the line or the halo after reaches the dotted line at 2');
	const newton = await placed(`${NEWTON}m,\\ \\text{Newton's mass}`, X(NEWTON), tail.pts[tail.pts.length - 1][1] + 0.3 + LABEL_GAP + 0.2, 0.5, 0, INK);
	L.push(newton);
	const read2 = await placed(READOUT, X(0), newton.box.b + ROW + 1, 0, 0, INK);
	L.push(read2);

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, after: AFTER, lump: LUMP_AFTER };
	return finish(S, L, [180, 260], defs);
}
