// The tutorial, section 13.5 (tutorial/what-a-field-keeps/impulsive-waves.md), its third diagram: Aichelburg and Sexl's
// profile on the plane of the front. The plane from -3R to 3R, a pale tint of the page; the body, a disc of radius R at
// the origin, the paper's stone (sprites/hair/ball.png, the steel ball seen along the path); the profile
// H = -k ln|x_perp - b| for b = (1.5 R, 0), drawn as its contours at equal steps of k/3 (circles about b, thin, in the
// field's colour, the field's light-theme colour fixed where they cross the stone); (1/2) gradH, the velocity each part
// gets over c, as arrows on a grid of spacing R offset by R/2 (ink; on the stone, the stone's fixed ink), all to one
// scale, outside a disc of radius 0.6 R about b; b a dot. The part s = (0.5 R, 0) a small dot on the stone. Beside the
// plane, lower right: the part s with two arrows toward b to one scale, the kick of this profile, 4Gp/c^2|b - s|, and
// Newton's for a mass p/c at c, 2Gp/c^2|b - s|, half as long and dashed; |b - s| = R, so they are named 4Gp/c^2R and
// 2Gp/c^2R.
// Departures from the diagram's comment: the inset stands beside the plane, at its lower right, rather than on it, so
// that it hides no arrow; its arrows are named with |b - s| = R.
// Exact (tut-impulsive-lib.js): the contours, circles of radius R e^{-n/3} about b (H = n k/3 with the unit of length R
// in the logarithm, a choice that only shifts H by a constant); every arrow (1/2) gradH = (k/2)(b - x)/|b - x|^2 at its
// tail, to one scale (asserted: each points at b, its length in proportion to 1/|b - x|); the inset's arrows in the ratio
// 2 : 1 (asserted against the chapter's 4Gp/c^2 and Newton's 2Gp/c^2). Pictorial: the stone.
import { INK, DIM } from '../lib.js';
import { circle as circlePath, text } from '../stone.js';
import { View, body, stonePicture, stoneColours } from './tut-pass-lib.js';
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD, LINE, HAIR, n2 } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { chapter, B, S_PART, grad, profile, FIELD, FIELD_ON_STONE, STONE_INK } from './tut-impulsive-lib.js';

const name = 'tut-as-profile';
const check = checker(name);

const R = 38;                                  // points per R
const HALF = 3;                                // the plane from -3R to 3R
const LEVELS = [-3, -2, -1, 0, 1, 2, 3, 4].map((n) => n + 0.5);  // contours H = -n k/3: radius e^{n/3} R about b
const AWAY = 0.6;                              // no arrow within this distance of b, in R
const SCALE = 1.78;                            // arrow length in R per unit of (1/2)|gradH| R / k
const RIM = 0.35;
const CONTOUR = 0.45;
const DOT_R = 1.25;
const TINT = '#eeebe5';
const INSET_GAP = 5;                           // between the plane and the inset, points
const caption = 'Look first at the inset: the kick of a particle without mass is twice Newton\'s for the same energy. The contours of the profile are a logarithm round the point where the path crosses the front, and the arrows point toward it.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'as-profile', caption);
	const S = new Sheet(name);
	const L = [];
	const c = [ORIGIN - 60, ORIGIN];
	const P = (x, y) => [c[0] + R * x, c[1] - R * y];
	const sq = `M${n2(P(-HALF, HALF)[0])},${n2(P(-HALF, HALF)[1])}H${n2(P(HALF, 0)[0])}V${n2(P(0, -HALF)[1])}H${n2(P(-HALF, 0)[0])}Z`;
	const disc = circlePath(c[0], c[1], R);

	// ---- the plane and the body
	S.raw(`<path d="${sq}" fill="${TINT}"/>`, 0.2);
	S.mark([P(-HALF, HALF), P(HALF, HALF), P(HALF, -HALF), P(-HALF, -HALF), P(-HALF, HALF)], 0, 'the plane');
	// the ball seen along the path: a sphere of radius R lit by the studio over the sawn stone's colours (tut-pass-lib.js)
	const colours = await stoneColours();
	const V = new View({ turn: 0, tilt: 0, scale: R, o: c });
	const pic = await stonePicture(`${name}-body`, body([0, 0, 0], () => 1), V, { reach: 1.3, size: 1, colours, px: 6, rimWidth: RIM });
	S.raw(pic.svg, 1);
	S.mark(Array.from({ length: 181 }, (_, k) => P(Math.cos((k * Math.PI) / 90), Math.sin((k * Math.PI) / 90))), RIM / 2, 'the body');

	// ---- the contours: circles about b, clipped to the plane; on the stone in its fixed colour
	S.raw(`<clipPath id="${name}-off"><path clip-rule="evenodd" d="${sq}${disc}"/></clipPath><clipPath id="${name}-on"><path d="${disc}"/></clipPath>`, 0.1);
	const bq = P(...B);
	for (const n of LEVELS) {
		const r = Math.exp(n / 3);
		// a point of the circle is on the level H = -n/3
		check(near(profile(B[0] + r, B[1]), -n / 3, 1e-12), `the contour ${n}`);
		const d = circlePath(bq[0], bq[1], r * R);
		S.raw(`<path d="${d}" fill="none" stroke="${FIELD}" stroke-width="${CONTOUR}" clip-path="url(#${name}-off)"/>` +
			`<path d="${d}" fill="none" stroke="${FIELD_ON_STONE}" stroke-width="${CONTOUR}" clip-path="url(#${name}-on)"/>`, 1.5);
		// remembered where it lies on the plane, for the labels' clearance
		let run = [];
		for (let k = 0; k <= 720; k++) {
			const a = (k * Math.PI) / 360, x = B[0] + r * Math.cos(a), y = B[1] + r * Math.sin(a);
			if (Math.abs(x) <= HALF && Math.abs(y) <= HALF) run.push(P(x, y));
			else { if (run.length > 1) S.mark(run, CONTOUR / 2, `the contour ${n}`); run = []; }
		}
		if (run.length > 1) S.mark(run, CONTOUR / 2, `the contour ${n}`);
	}
	// the steps are equal: successive radii in the ratio e^{1/3}
	for (let i = 1; i < LEVELS.length; i++) check(near(Math.exp(LEVELS[i] / 3) / Math.exp(LEVELS[i - 1] / 3), Math.exp(1 / 3), 1e-12), 'the steps');

	// ---- the arrows (1/2) gradH, on the grid (k + 1/2, l + 1/2) R
	let longest = 0, shortest = Infinity;
	for (let i = -HALF; i < HALF; i++) for (let j = -HALF; j < HALF; j++) {
		const x = i + 0.5, y = j + 0.5;
		const dist = Math.hypot(B[0] - x, B[1] - y);
		if (dist < AWAY) continue;
		const [gx, gy] = grad(x, y).map((v) => v / 2);
		const len = SCALE * Math.hypot(gx, gy);
		// it points at b, with the length k/2|b - x|
		check(near(Math.hypot(gx, gy), 1 / (2 * dist), 1e-12) && near((gx * (B[0] - x) + gy * (B[1] - y)) / (Math.hypot(gx, gy) * dist), 1, 1e-12), 'an arrow does not point at b');
		const tail = P(x, y), tip = P(x + SCALE * gx, y + SCALE * gy);
		S.arrow(tail, tip, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: `the arrow at ${x}, ${y}` });
		// where it lies on the stone, again in the stone's fixed ink, clipped to the body
		const reachesStone = [0, 0.25, 0.5, 0.75, 1].some((f) => Math.hypot(x + f * SCALE * gx, y + f * SCALE * gy) < 1 + 0.15);
		if (reachesStone) {
			const T = new Sheet(`${name}-tmp`);
			T.arrow(tail, tip, { color: STONE_INK, width: VEC, head: VEC_HEAD, layer: 3 });
			S.raw(`<g clip-path="url(#${name}-on)">${T.P.items.map((it) => it.svg).join('')}</g>`, 3.1);
		}
		longest = Math.max(longest, len); shortest = Math.min(shortest, len);
	}
	check(longest < 0.85 && shortest * R > 6, `the arrows run from ${shortest} to ${longest} R`);

	// ---- b and s
	S.raw(`<circle cx="${n2(bq[0])}" cy="${n2(bq[1])}" r="${DOT_R}" fill="${INK}"/>`, 4);
	S.mark([bq], DOT_R, 'b');
	L.push(await placed('\\boldsymbol b', bq[0], bq[1] + DOT_R + LABEL_GAP + 0.3, 0.5, 0, INK));
	const sq0 = P(...S_PART);
	S.raw(`<circle cx="${n2(sq0[0])}" cy="${n2(sq0[1])}" r="${DOT_R}" fill="${STONE_INK}"/>`, 4);
	S.mark([sq0], DOT_R, 's');
	L.push(await S.clear('\\boldsymbol s', sq0[0], sq0[1] + DOT_R + LABEL_GAP + 0.5, 0.5, 0, [0, 1], { color: STONE_INK }));

	// ---- the inset, beside the plane at its lower right: s and the two kicks toward b, to one scale
	{
		const as = 4, newton = 2;                // the kicks in units of Gp/c^2 |b - s|
		check(as / newton === 2, 'the factor two');
		const gs = grad(...S_PART).map((v) => v / 2);
		const len = SCALE * R * Math.hypot(...gs);      // this profile's kick at s, at the plane's scale
		const y1 = P(0, -HALF)[1] + INSET_GAP + 8, y2 = y1 + 14;
		const x0 = P(HALF, 0)[0] - 118;
		const L1 = len, L2 = (len * newton) / as;
		check(near(L2 * 2, L1, 1e-12), 'Newton\'s arrow is not half');
		for (const y of [y1, y2]) { S.raw(`<circle cx="${n2(x0)}" cy="${n2(y)}" r="${DOT_R}" fill="${INK}"/>`, 4); S.mark([[x0, y]], DOT_R, 's in the inset'); }
		S.arrow([x0, y1], [x0 + L1, y1], { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the kick of this profile' });
		// Newton's: a dashed shaft and a head
		const head = Math.min(VEC_HEAD, 0.4 * L2);
		dashed(S, [x0 + DOT_R + 0.8, y2], [x0 + L2 - head * 0.8, y2], { color: INK, width: VEC, layer: 3, dash: [1.8, 1.4], what: 'Newton\'s shaft' });
		{
			// the head, as Sheet.arrow draws one (tut-pot-lib.js), on the dashed shaft
			const tip = [x0 + L2, y2], hw = 0.36 * head;
			S.raw(`<path d="M${n2(tip[0])},${n2(tip[1])}L${n2(tip[0] - head)},${n2(tip[1] + hw)}L${n2(tip[0] - head)},${n2(tip[1] - hw)}Z" fill="${INK}"/>`, 3);
			S.mark([tip, [tip[0] - head, tip[1] + hw], [tip[0] - head, tip[1] - hw], tip], 0, 'Newton\'s head');
		}
		L.push(await placed('4Gp/c^2R', x0 + L1 + LABEL_GAP + 1, y1, 0, 0.5, INK));
		L.push(await placed('2Gp/c^2R\\ \\text{(Newton)}', x0 + L1 + LABEL_GAP + 1, y2, 0, 0.5, INK));
		L.push(await placed('\\boldsymbol s', x0 - DOT_R - LABEL_GAP - 0.8, (y1 + y2) / 2, 1, 0.5, INK));
		void DIM; void LINE; void HAIR; void text;
	}

	S.checkAll(L);
	return finish(S, L, [220, 300]);
}
