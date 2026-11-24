// The tutorial, chapter 12.2 (tutorial/sky/universe.md), its fifth diagram: a straight cosmic string, at rest and
// moving. Left, the plane at right angles to the string (a dot), drawn flat as a tinted patch with a wedge of angle Delta
// cut out above the string, its two edges glued: matching tick marks, one and two, on each edge at equal distances from
// the string. The source behind lies on the cut, so it is drawn on both edges, at one distance from the string; two
// straight rays in the light role's colour, one passing each side of the string, meet at the observer in front, who sees
// the source twice. Right, the same seen from above: the background along the top, the observer at the bottom, the
// string between them moving to the right at v (the observer's colour), the plane it has swept, its wake, dashed to its
// left. The rays from the background to the observer fill a fan: those passing left of the string cross the wake and
// arrive warmer by delta T / T = 8 pi G mu gamma v / c^3 (the fan's left half tinted more strongly in the light role's
// colour), those passing right of it arrive unchanged.
// Departures from the diagram's comment: the angle Delta is marked by an arc across the wedge's mouth, named over it
// with "exaggerated"; the two images are the source's two places on the cut edges, as the observer sees them along the
// two rays. In the right panel the rays are drawn as a fan (its edges and the ray through the string), so that the
// velocity's arrow crosses no line.
// Exact: the straight rays from the source's two places to the observer, which pass either side of the string; the
// wedge's angle as drawn (20 degrees) and the glue marks' equal distances. Schematic: the wedge's size (a real Delta is
// 2.5 x 10^-5 rad for G mu / c^2 = 10^-6), the distances, the fan, the tints' strength.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR, VEC, VEC_HEAD } from './tut-pot-lib.js';
import { INK, DIM, PAGE } from '../lib.js';
import { dashed } from './tut-orb-lib.js';
import { chapter, LIGHT, OBS, stack } from './tut-universe-lib.js';

const name = 'tut-universe-string';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const DELTA = 20;                       // the wedge as drawn, degrees
const DS = 60, DO = 100;                // the source's distance behind the string, the observer's in front
const HALF_W = 50;                      // the left patch's half-width
const OVER = 16;                        // the patch beyond the source's places, upward
const UNDER = 9;                        // the patch below the observer
const RIGHT_W = 152;                    // the right panel's width
const BETWEEN = 26;                     // between the panels
const BAND = 16;                        // the background's band
const RAY = 0.75, EDGE = 0.45, GLUE = 3.0, GLUE_AT = [13, 29], GLUE_SEP = 1.2;
const DOT = 1.7, RING = 2.4;            // the string's dot, the observer's ring
const ARC_R = DS + 8;                   // the arc that marks Delta
const FAN = [-0.46, 0.46];              // the fan's edges at the background, as fractions of the panel's width from its middle
const MID = 0.62;                       // where a ray's head stands along it
const ARROW = 20;                       // the velocity's arrow
const TINT = '#eeebe5';
const WARM = 0.2, COOL = 0.07;          // the fan's tints
const caption = 'Look first at the glued edges: space is flat, but a ray on each side of the string reaches the observer, so a source behind is seen twice. Moving, the string leaves a warmer half of the sky behind it. The wedge\'s angle is exaggerated.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'universe-string', caption);

	const S = new Sheet(name);
	const L = [];
	const rad = (d) => (d * Math.PI) / 180;
	const total = 2 * HALF_W + BETWEEN + RIGHT_W;
	const lx = ORIGIN - total / 2 + HALF_W;                 // the left panel's axis
	const rx = lx + HALF_W + BETWEEN + RIGHT_W / 2;          // the right panel's axis
	const yO = ORIGIN + 80, yS = yO - DO;
	const half = rad(DELTA / 2);
	const S1 = [lx - DS * Math.sin(half), yS - DS * Math.cos(half)], S2 = [lx + DS * Math.sin(half), yS - DS * Math.cos(half)];
	const top = S1[1] - OVER, bottom = yO + UNDER;
	const O = [lx, yO], str = [lx, yS];

	// ---- left: the patch with the wedge cut out
	{
		const mouth = (top - yS) * Math.tan(half);           // half the wedge's width at the patch's top edge (negative y)
		const wl = [lx + mouth, top], wr = [lx - mouth, top];
		check(mouth < 0, 'the wedge does not open upward');
		const rect = `M${n2(lx - HALF_W)},${n2(top)}H${n2(lx + HALF_W)}V${n2(bottom)}H${n2(lx - HALF_W)}Z`;
		const wedge = `M${n2(str[0])},${n2(str[1])}L${n2(wr[0])},${n2(wr[1])}L${n2(wl[0])},${n2(wl[1])}Z`;
		S.raw(`<path d="${rect}${wedge}" fill="${TINT}" fill-rule="evenodd"/>`, 0.3);
		// the edges, and the glue marks: one tick at the nearer distance, two at the farther, on both edges
		for (const [end, side] of [[wl, -1], [wr, 1]]) {
			S.path([str, end], { color: INK, width: EDGE, cap: 'butt', layer: 1, what: `the wedge's ${side < 0 ? 'left' : 'right'} edge` });
			const u = [(end[0] - str[0]) / Math.hypot(end[0] - str[0], end[1] - str[1]), (end[1] - str[1]) / Math.hypot(end[0] - str[0], end[1] - str[1])];
			const n = [-u[1], u[0]];
			GLUE_AT.forEach((r, k) => {
				for (let j = 0; j <= k; j++) {
					const s = r + (j - k / 2) * GLUE_SEP, c = [str[0] + u[0] * s, str[1] + u[1] * s];
					S.path([[c[0] - n[0] * GLUE / 2, c[1] - n[1] * GLUE / 2], [c[0] + n[0] * GLUE / 2, c[1] + n[1] * GLUE / 2]], { color: INK, width: HAIR, cap: 'butt', layer: 1, what: `a glue mark at ${r}` });
				}
			});
		}
		// the source's two places on the edges, one distance from the string
		check(near(Math.hypot(S1[0] - str[0], S1[1] - str[1]), DS, 1e-9) && near(Math.hypot(S2[0] - str[0], S2[1] - str[1]), DS, 1e-9), 'the source\'s places');
		// the arc across the mouth that marks Delta, and its name over the patch
		const arc = Array.from({ length: 41 }, (_, i) => { const a = -half + (2 * half * i) / 40; return [str[0] + ARC_R * Math.sin(a), str[1] - ARC_R * Math.cos(a)]; });
		S.path(arc, { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the arc of Delta' });
		check(ARC_R < (yS - top) / Math.cos(half) - 2, 'the arc leaves the patch');
		L.push(await placed('\\Delta\\text{, exaggerated}', lx, top - LABEL_GAP - 0.6, 0.5, 1, INK));
	}
	// the rays, straight from each place of the source to the observer, either side of the string
	{
		// each ray stops short of the observer's ring; the two merge just before it, as rays that meet do
		const stop = RING + 1.6;
		const end = (P) => { const L0 = Math.hypot(O[0] - P[0], O[1] - P[1]); return [O[0] - ((O[0] - P[0]) / L0) * stop, O[1] - ((O[1] - P[1]) / L0) * stop]; };
		// each ray with its head at MID of its length, so that the two heads stay apart
		const ray = (P, what) => {
			const E = end(P), M = [P[0] + MID * (E[0] - P[0]), P[1] + MID * (E[1] - P[1])];
			S.path([M, E], { color: LIGHT, width: RAY, cap: 'butt', layer: 2, what: `${what}, after its head` });
			return S.arrow(P, M, { color: LIGHT, width: RAY, head: 3.8, layer: 2, what });
		};
		const left = ray(S1, 'the left ray'), right = ray(S2, 'the right ray');
		// where each passes the string's height, and the angle between them at the observer
		const at = (P) => P[0] + ((O[0] - P[0]) * (yS - P[1])) / (O[1] - P[1]);
		check(at(S1) < str[0] - DOT - RAY && at(S2) > str[0] + DOT + RAY, 'the rays do not pass either side of the string');
		const seen = Math.atan2(S2[0] - O[0], O[1] - S2[1]) - Math.atan2(S1[0] - O[0], O[1] - S1[1]);
		check(seen > 0 && seen < rad(DELTA), 'the images are not less than Delta apart');
		void left; void right;
	}
	for (const P of [S1, S2]) { S.raw(`<circle cx="${n2(P[0])}" cy="${n2(P[1])}" r="${DOT}" fill="${INK}"/>`, 3); S.mark([P], DOT, 'the source'); }
	L.push(await placed('\\text{source}', S1[0] - DOT - LABEL_GAP - 0.4, S1[1], 1, 0.5, INK));
	L.push(await placed('\\text{source}', S2[0] + DOT + LABEL_GAP + 0.4, S2[1], 0, 0.5, INK));
	// the string, named by a leader out to the right, across the right ray
	S.raw(`<circle cx="${n2(str[0])}" cy="${n2(str[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([str], DOT, 'the string');
	{
		const x1 = str[0] + 24;
		S.path([[str[0] + DOT + 0.8, str[1]], [x1, str[1]]], { color: DIM, width: HAIR, cap: 'butt', layer: 1.5, what: 'the string\'s leader' });
		L.push(await placed('\\text{string}', x1 + LABEL_GAP + 0.4, str[1], 0, 0.5, INK));
	}
	// the observer
	const ring = async (c) => {
		S.raw(`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${RING}" fill="${PAGE}" stroke="${INK}" stroke-width="0.6"/>`, 4);
		S.mark([c], RING + 0.3, 'an observer');
		L.push(await placed('\\text{observer}', c[0], bottom + LABEL_GAP + 0.4, 0.5, 0, INK));
	};
	await ring(O);

	// ---- right: seen from above
	const O2 = [rx, yO], str2 = [rx, yS];
	const bTop = top + OVER - BAND, bBot = top + OVER;
	{
		// the background
		S.raw(`<rect x="${n2(rx - RIGHT_W / 2)}" y="${n2(bTop)}" width="${RIGHT_W}" height="${BAND}" fill="${TINT}"/>`, 0.3);
		S.boxes.push({ box: { l: rx - RIGHT_W / 2, r: rx + RIGHT_W / 2, t: bTop, b: bBot }, what: 'the background' });
		const bg = await placed('\\text{background}', rx - RIGHT_W / 2 + 4, (bTop + bBot) / 2, 0, 0.5, DIM);
		bg.on = ['the background'];
		L.push(bg);
		// the fan: from the observer to the background's lower edge, its left half (through the wake) warmer
		const fl = [rx + FAN[0] * RIGHT_W, bBot], fr = [rx + FAN[1] * RIGHT_W, bBot], fm = [rx, bBot];
		const poly = (pts, op) => S.raw(`<path d="M${pts.map((p) => `${n2(p[0])},${n2(p[1])}`).join('L')}Z" fill="${LIGHT}" fill-opacity="${op}"/>`, 0.6);
		poly([O2, fl, fm], WARM);
		poly([O2, fm, fr], COOL);
		for (const [p, what] of [[fl, 'the fan\'s left edge'], [fr, 'the fan\'s right edge']]) S.path([[O2[0] + ((p[0] - O2[0]) / (O2[1] - p[1])) * (RING + 1), O2[1] - (RING + 1)], p], { color: LIGHT, width: RAY, cap: 'butt', layer: 2, what });
		// the ray through the string divides the fan
		S.path([[rx, yO - RING - 1], [rx, str2[1] + DOT + 1.2]], { color: LIGHT, width: HAIR, cap: 'butt', layer: 2, what: 'the ray through the string, below it' });
		S.path([[rx, str2[1] - DOT - 1.2], [rx, bBot]], { color: LIGHT, width: HAIR, cap: 'butt', layer: 2, what: 'the ray through the string, above it' });
		// the wake: the swept plane, edge on, dashed from the string to the panel's left edge
		dashed(S, [str2[0] - DOT - 1.4, yS], [rx - RIGHT_W / 2, yS], { color: INK, width: EDGE, layer: 2.5, what: 'the wake' });
		const wake = await placed('\\text{wake}', rx - RIGHT_W / 2, yS + EDGE / 2 + LABEL_GAP + 0.6, 0, 0, INK);
		wake.on = ['the warm fan'];
		L.push(wake);
		// the string and its velocity
		S.raw(`<circle cx="${n2(str2[0])}" cy="${n2(str2[1])}" r="${DOT}" fill="${INK}"/>`, 3);
		S.mark([str2], DOT, 'the string, from above');
		const v = S.arrow([str2[0] + DOT + 1.2, yS], [str2[0] + DOT + 1.2 + ARROW, yS], { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: 'the velocity' });
		L.push(await placed('v', (v.A[0] + v.B[0]) / 2, yS - VEC / 2 - LABEL_GAP - 0.4, 0.5, 1, OBS));
		const sname = await placed('\\text{string}', str2[0] - LABEL_GAP - 0.6, yS - EDGE / 2 - LABEL_GAP - 0.8, 1, 1, INK);
		L.push(sname);
		// the velocity crosses no line: between the ray through the string and the fan's right edge
		const edgeAt = rx + ((fr[0] - rx) * (yO - yS)) / (yO - bBot);
		check(v.B[0] + 6 < edgeAt, 'the velocity reaches the fan\'s right edge');
		// the two halves' names, over the background, on the line of the left panel's name
		const yName = top - LABEL_GAP - 0.6;
		L.push(await placed('\\text{warmer: }\\delta T/T = 8\\pi G\\mu\\gamma v/c^3', rx - 6, yName, 1, 1, INK));
		L.push(await placed('\\text{unchanged}', rx + 12, yName, 0, 1, INK));
		await ring(O2);
	}

	S.checkAll(L);
	return finish(S, L, [270, 350]);
}
