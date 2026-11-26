// The tutorial, section 10.1 (tutorial/glow/black-body.md), its fourth diagram: a moving observer still sees a black
// body, hotter ahead. Two discs side by side, the sky of a black body at the temperature T in the plane of the motion,
// the observer a small ink dot at each centre and the motion to the right. Each disc's rim is filled with the
// temperature seen in that direction, T(alpha') = T / gamma (1 - beta cos alpha'), on the paper's diverging scale.
// Left, "at rest": uniform at T, named "T" outside the rim. Right, "moving": the observer's arrow, in the observer's
// colour, named "0.6c"; the rim 2T straight ahead, 0.8T at right angles to the motion in the observer's frame and T/2
// straight behind, named "2T", "0.8T" and "T/2" outside the rim, each at its direction. A thin bar beside the right
// disc shows the scale from T/2 to 2T, ticked at T/2, 0.8T, T and 2T.
// The scale: T'/T is the Doppler factor D, so the scale is the one section 6.3's sky of Doppler factors uses
// (tut-aberration-lib.js, `shift`, the paper's `diverging`): the paper's blue ACCENT2 at 2T (hotter, blueshifted,
// ahead), its orange ACCENT at T/2 (cooler, redshifted, behind), the neutral FAINT ink at T, each side mixed in sRGB in
// proportion to the logarithm of the temperature, so that T/2 and 2T lie equally far from T. A hotter black body is
// also a bluer one. (HOT and COOL name the two ends; swapping them is one line.)
// Departures from the diagram's comment: the discs are named "at rest" and "moving" under them; the bar also carries
// T (the left disc's colour) and 0.8T; the dot at each centre is the observer. The figure stays one drawing side by
// side on a phone (about 330 points wide), as section 6.1's diagrams do.
// Exact: each wedge's colour is T(alpha') at its middle (720 wedges, within 0.0024 of the scale's range of the exact
// value along the rim), the three named values (asserted against the chapter's text), the bar's ticks. Schematic: the
// discs' size and the rim's width; the colours are a scale, not the glow's colour.
import { Sheet, ORIGIN, finish, checker, placed, beside, LABEL_GAP, HAIR, VEC, n2 } from './tut-pot-lib.js';
import { INK, DIM, FAINT, RULE, ACCENT, ACCENT2 } from '../lib.js';
import { chapter, palette, near, OBS, BETA, seen } from './tut-planck-lib.js';

const name = 'tut-planck-moving';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const R = 52;                                   // a disc's outer radius
const RIM = 10;                                 // the rim's width
const APART = 56;                               // between the two discs' rims
const WEDGES = 720;
const SEAM = 0.12;                              // each wedge overlaps the next by this, degrees, so no seam shows
const EDGE = 0.4;                               // the rim's outlines
const OBSERVER = 1.6;                           // the observer's dot
const ARROW = 0.56 * R;                         // the motion's arrow
const BAR = { w: 6, h: 1.5 * R, gap: 15, steps: 300 };
const TITLE = 7;                                // from a disc's rim to its title's top

// ---- the scale: the paper's diverging scale, blue hotter, orange cooler, neutral at T ------------------------------
const HOT = ACCENT2, COOL = ACCENT;            // the paper's blue and orange (tut-aberration-lib.js, `shift`)
/** The scale's colour at s from 0 (T/2) to 1 (2T): orange at 0, the neutral FAINT at 1/2, blue at 1. */
const colour = (s) => {
	const v = 2 * s - 1, end = v >= 0 ? HOT : COOL, p = +(Math.abs(v) * 100).toFixed(2);
	return p === 0 ? FAINT : p === 100 ? end : `color-mix(in srgb, ${end} ${p}%, ${FAINT})`;
};
/** The place on the scale of the temperature t = T' / T: log2 t from -1 to 1. */
const place = (t) => (Math.log2(t) + 1) / 2;

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'planck-moving', 'Look first at the right disc\'s rim: moving at $0.6c$ through a glow of one temperature, the observer sees a black body in every direction, twice as hot ahead and half as hot behind. The temperatures are exact; the colours are a scale, not the glow\'s real colour.');
	check(near(BETA, 0.6, 0), 'the speed is not 0.6c');

	// the scale is the paper's: its ends the two accents, its middle (T itself) the neutral faint ink
	check(colour(place(2)) === HOT && colour(place(0.5)) === COOL && colour(place(1)) === FAINT, 'the scale\'s ends and middle');

	const S = new Sheet(name);
	const L = [];
	const r0 = R - RIM;
	const c1 = [ORIGIN - R - APART / 2, ORIGIN], c2 = [ORIGIN + R + APART / 2, ORIGIN];
	const pt = (c, rr, a) => [c[0] + rr * Math.cos(a), c[1] - rr * Math.sin(a)];   // a from the motion, counterclockwise

	/** A rim of wedges about c, the wedge at the angle a filled with fill(a). */
	const rim = (c, fill, what) => {
		const cells = [];
		for (let k = 0; k < WEDGES; k++) {
			const a0 = (2 * Math.PI * k) / WEDGES, a1 = (2 * Math.PI * (k + 1)) / WEDGES, am = (a0 + a1) / 2;
			const f = fill(am);
			if (cells.length && cells[cells.length - 1].f === f) cells[cells.length - 1].a1 = a1;
			else cells.push({ a0, a1, f });
		}
		for (const { a0, a1, f } of cells) {
			const e = (SEAM * Math.PI) / 180, b0 = a0 - e, b1 = a1 + e;
			const n = Math.max(2, Math.ceil((b1 - b0) / ((0.5 * Math.PI) / 180)));
			const outer = Array.from({ length: n + 1 }, (_, i) => pt(c, R, b0 + ((b1 - b0) * i) / n));
			const inner = Array.from({ length: n + 1 }, (_, i) => pt(c, r0, b1 - ((b1 - b0) * i) / n));
			const d = 'M' + [...outer, ...inner].map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
			S.raw(`<path d="${d}" fill="${f}" stroke="none"/>`, 1);
		}
		for (const rr of [R, r0]) {
			const ring = Array.from({ length: 361 }, (_, i) => pt(c, rr, (i * Math.PI) / 180));
			S.path(ring, { color: RULE, width: EDGE, layer: 1.5, what: `${what}'s ${rr === R ? 'outer' : 'inner'} edge` });
		}
		return cells.length;
	};

	// ---- the left disc: at rest, uniform at T
	const nLeft = rim(c1, () => colour(place(1)), 'the left rim');
	check(nLeft === 1, 'the left rim is not one colour');
	// ---- the right disc: moving, T(alpha') at each wedge's middle
	let worst = 0;
	const nRight = rim(c2, (a) => {
		const s = place(seen(a));
		// the step to the next wedge, the largest error of a wedge's one colour, as a share of the scale
		worst = Math.max(worst, Math.abs(place(seen(a + Math.PI / WEDGES)) - s));
		return colour(s);
	}, 'the right rim');
	check(worst < 0.0025, `a wedge's colour is ${worst} of the scale from the exact value`);
	check(near(place(seen(0)), 1, 1e-14) && near(place(seen(Math.PI)), 0, 1e-14), 'the rim does not span the scale');

	// ---- the observers, and the motion's arrow
	for (const c of [c1, c2]) {
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${OBSERVER}" fill="${INK}"/>`, 3);
		S.mark([c], OBSERVER, 'an observer');
	}
	const arrow = S.arrow([c2[0] + OBSERVER + 1.2, c2[1]], [c2[0] + OBSERVER + 1.2 + ARROW, c2[1]], { color: OBS, width: VEC, what: 'the motion' });
	check(arrow.B[0] < c2[0] + r0 - 6, 'the arrow reaches the rim');
	L.push(await placed('0.6c', (arrow.A[0] + arrow.B[0]) / 2, c2[1] - VEC / 2 - LABEL_GAP - 0.6, 0.5, 1, INK));

	// ---- the names of the temperatures, outside the rims
	const UP = Math.PI / 2;
	L.push(await beside('T', pt(c1, R, UP), [0, -1], LABEL_GAP + 0.4));
	const named = [[0, '2T', 2], [UP, '0.8T', 0.8], [Math.PI, 'T/2', 0.5]];
	for (const [a, src, v] of named) {
		check(near(seen(a), v, 1e-14), `T(alpha') at ${a} is not ${src}`);
		L.push(await beside(src, pt(c2, R, a), [Math.cos(a), -Math.sin(a)], LABEL_GAP + 0.4));
	}

	// ---- the titles, under the discs
	for (const [c, src] of [[c1, '\\text{at rest}'], [c2, '\\text{moving}']]) L.push(await placed(src, c[0], c[1] + R + TITLE, 0.5, 0, DIM));

	// ---- the bar: the scale from T/2 (bottom) to 2T (top), beside the right disc, clear of its "2T"
	const twoT = L.find((l) => l.src === '2T');
	const bx = twoT.box.r + BAR.gap, by = c2[1] - BAR.h / 2;
	for (let i = 0; i < BAR.steps; i++) {
		const y0 = by + BAR.h - ((i + 1) * BAR.h) / BAR.steps, y1 = by + BAR.h - (i * BAR.h) / BAR.steps;
		S.raw(`<rect x="${n2(bx)}" y="${n2(y0 - 0.06)}" width="${BAR.w}" height="${n2(y1 - y0 + 0.12)}" fill="${colour((i + 0.5) / BAR.steps)}"/>`, 1);
	}
	S.path([[bx, by], [bx + BAR.w, by], [bx + BAR.w, by + BAR.h], [bx, by + BAR.h]], { color: RULE, width: EDGE, closed: true, layer: 1.5, what: 'the bar' });
	S.boxes.push({ box: { l: bx, r: bx + BAR.w, t: by, b: by + BAR.h }, what: 'the bar\'s colours' });
	for (const [t, src] of [[0.5, 'T/2'], [0.8, '0.8T'], [1, 'T'], [2, '2T']]) {
		const y = by + BAR.h - place(t) * BAR.h;
		S.path([[bx + BAR.w, y], [bx + BAR.w + 2.5, y]], { color: DIM, width: HAIR, layer: 1.5, cap: 'butt', what: `the bar's tick at ${src}` });
		L.push(await placed(src, bx + BAR.w + 2.5 + LABEL_GAP + 0.4, y, 0, 0.5, DIM));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { wedges: nRight, worst };
	return finish(S, L, [300, 345]);
}
