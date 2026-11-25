// The tutorial's Part 11, its hero (tutorial/black-holes/schwarzschild.md, chapter 11.1, and the head of 11.2 to R11):
// a black hole, what it does to light and what it does to free bodies beside it. A little right of centre a small
// black sphere, the horizon, lit by the studio of lib.js; round it, as a thin circle (pale by day, bright at night),
// the outline of the photon sphere at 1.5 r_s. A fan of eight rays of light comes in from the left, parallel, evenly
// spaced by r_s and all on one side of the hole, in a plane through its centre (the orbit plane), which is turned
// 56 degrees out of the page so that its far side is up and seen from above. The two with b < b_c fall in: each runs
// behind the horizon's rim and ends on its far side. One, with the b that bends it by exactly one turn, winds once
// round the photon sphere: it crosses its own path above the horizon, passes before the horizon's lower edge (a pale
// arc on the black) and leaves along the line it came in on. The five outer ones are bent toward the hole and leave,
// less and less as b grows; the nearest of them dives down and to the right. The rays fade in and out over FADE points
// at the window's edges. Below and left of the hole, in the plane of the page through the hole's centre, a ring of
// twelve free stone beads at rest under the hole's tide: stretched along the line to the hole and squeezed across it,
// with an orange arrow outward at each bead on that line and a blue arrow inward at each bead across it, the stretch
// twice the squeeze. No text. Orange and blue only on the ring.
// Departures from the comment at schwarzschild.md l. 13: the photon ring is drawn as the outline of the photon sphere,
// a circle of radius 1.5 r_s on the page, not as a circle in the orbit plane, which the winding ray (1.545 r_s at its
// nearest) would run along as a second line; the orbit plane is turned out of the page so that the winding ray's loop
// is an ellipse crossing that outline at 16 degrees or more, and its own crossing stands above the horizon; the
// captured rays are two; the rays are clipped to a window of the orbit plane and faded at its edges; the horizon is a
// black sphere, not stone, because the stone of Parts 8 and 9 is matter, and a horizon is not a surface of matter (the
// chapter's diagrams draw it in the same fixed near-black, tut-schw-lib's HOLE; the candidates' glossy black ball read
// best of the two kinds tried there). The rays are in ink, not in the light role's colour of the chapter's diagrams,
// since the brief keeps the heroes to neutrals, matter and the tide's two colours.
// Exact: the rays, the chapter's orbit equation in the form u'' + u = (3/2) r_s u^2 (u = 1/r, ' = d/dphi), integrated
// by the tested port in tut-schw-lib.js (trace), each checked against the first integral (du/dphi)^2 = 1/b^2 -
// u^2 (1 - r_s u); their fates (b < b_c on the horizon, the others to infinity); their bending, more than the chapter's
// 2 r_s/b and by less as b grows (2.14 to 1.26 times it, b = 3.6 to 7.6 r_s); b_c = (3 sqrt 3 / 2) r_s, asserted
// and found by bisection on capture, 2.6 r_s to the chapter's precision; the winding ray's b, found by bisection so
// that it is bent by 2 pi, 1.00126 b_c = 2.6013 r_s (2.6 r_s to the chapter's precision), its sweep 3 pi, its nearest
// approach 1.545 r_s, and its leaving on the line it came in on; the photon sphere's radius 1.5 r_s (the peak of the
// chapter's barrier, asserted in tut-schw-lib.js); the projection (orthographic, so the photon sphere's outline is a
// circle of radius 1.5 r_s; each ray is hidden exactly where the horizon lies in front of it and drawn pale exactly
// where it passes before it, the pieces' ends found by bisection); the ring's beads at (1 - eps E/E0) xi, with E the
// chapter's exact tide at the ring's distance d, built from its exact fall d^2r/dtau^2 = -GM/r^2 (across, -a(d)/d;
// along, -a'(d)) and asserted equal to (GM/d^3) diag(1, 1, -2), E0 = GM/d^3; the arrows -E xi / E0 at the four beads
// on its axes, the stretch exactly twice the squeeze. Schematic: the view (TAU), the window and the fades, the choice
// of b, the ring's distance, size and place, eps, the arrows' scale, the beads' size. Pictorial: the horizon's sheen;
// the stone of the beads, the picture of the paper's figures (design/prompts/hair-sprites.json, cut out by
// design/hair_sprites.py, ball-face.png), lit as a sphere by the studio of lib.js, as in tut-one-point-hero. Asserted
// on the page: every ray's end at the window's edge at least END_GAP from another's, every crossing at ANGLE or more
// and at CROSS_CLEAR or more from an end, the winding ray's own crossing above the horizon, its stand-off from the
// photon sphere's outline between crossings, the rays' meeting points with the horizon's rim apart, the ring clear of
// everything else. Style references, not marks: design/candidates/tut-hole-hero/ (two runs).
import { Sheet, ORIGIN, finish, checker, n2 } from './tut-pot-lib.js';
import { sprite, INK, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { SPRITES, MARGIN } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { chapter, trace, deflection, firstIntegral, thin, BC, RS, PHOTON, HOLE, near } from './tut-schw-lib.js';

const name = 'tut-hole-hero';
const check = checker(name);
// ---- the view (lengths in r_s) -------------------------------------------------------------------------------------
const TAU = 56;                           // degrees: the orbit plane turned out of the page about the page's horizontal,
                                          // its far side up; so that the winding ray crosses itself above the horizon
                                          // and passes before it, not behind it, and its loop is an ellipse crossing
                                          // the photon sphere's outline
const SCALE = 21;                         // points per r_s
// ---- the rays ------------------------------------------------------------------------------------------------------
const FAN = [0.6, 1.5, 3.6, 4.6, 5.6, 6.6, 7.6];   // the impact parameters, r_s, besides the winding ray's (2.6013):
                                          // evenly spaced by r_s, the winding ray in the gap at 2.6
const WIN = { x0: -6.6, x1: 8.5, y0: -6.5 };   // the window of the orbit plane: x from x0 to x1, y (far side +) above y0
const RAY = 0.5;                          // a ray's stroke
const FADE = 14;                          // points over which the rays fade in and out at the window's edges
const PALE = 'light-dark(#ebe6da, #d2dde7)';   // a ray before the horizon: fixed, not swapped, so that it shows on the
                                          // black (at night, the night ink's colour)
const RIM_GAP = 4;                        // the least distance between two rays' ends at the horizon's rim, points
const END_GAP = 6, CROSS_CLEAR = 18;      // the rays' ends at the window's edge: their least spacing, and the least
                                          // distance from an end to a crossing of two rays, points
const SLIVER = 2;                         // the least stand-off of the winding ray from the photon sphere's outline
                                          // between two crossings, points
const ANGLE = 10;                         // the least angle at which two rays, or a ray and the photon sphere's
                                          // outline, cross, degrees
// ---- the photon sphere's outline and the horizon --------------------------------------------------------------------
const PHOTON_W = 0.55;
const PHOTON_C = 'light-dark(#9d988c, #e6dfcc)';   // fixed: pale on the day page, bright at night
const HOLE_EDGE = 'light-dark(#1c1a16, #4a453d)';  // fixed: ink on the day page, a dim edge at night
const HOLE_W = 0.4;
// ---- the ring -------------------------------------------------------------------------------------------------------
const RING_AT = { d: 4.9, angle: 214 };   // its centre: distance from the hole's centre, r_s, and direction on the page,
                                          // degrees from +x
const RING = 1.15;                        // the ring's radius, r_s
const EPS = 0.16;                         // the tide's exaggeration
const BEAD = 0.14;                        // a bead's radius, r_s
const RING_W = 0.4;                       // the ring's outline
const REACH = 7;                          // points of arrow per unit of |E xi| / E0 (the squeeze's is one)
const PUSH = 0.55, PUSH_HEAD = 2.6, TAIL = 0.9;   // the arrows: stroke, head, air between bead and tail (points)
const RING_CLEAR = 6;                     // the least air between the ring (beads, outline, arrows) and the rest, points
// ---- the studio (lib.js) --------------------------------------------------------------------------------------------
const unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const KEY = unit([-0.55, 0.72, 0.62]), FILL = unit([0.85, -0.15, 0.5]);
const HALF = unit([KEY[0], KEY[1], KEY[2] + 1]);
const rad = (d) => (d * Math.PI) / 180;

export default async function () {
	const nums = await chapter(check);
	const S = new Sheet(name);
	let defs = '';
	const { has } = nums;
	const r = String.raw;

	// ---- the chapter's statements that the figure draws
	has(r`Both $r_s$ and $b_c$ are lengths, and $b_c = 2.6\,r_s$.`, 'b_c = 2.6 r_s');
	has(r`$$\boxed{\;\sym{deflection-angle}{\alpha} = \int\partial_\perp n\,\dd l = \frac{4G\matter M}{bc^2} = \frac{2r_s}{b}\;} ,$$`, 'the bending 2 r_s / b');
	has(r`$$\boxed{\;\curv{\tE} = \frac{G\matter M}{r^3}\,\mathrm{diag}(1, 1, -2)\;} \label{eq:exact-tide}$$`, 'the exact tide');
	has(r`As $b \to b_c$ the bending grows without limit, and the rays wind round the photon sphere.`, 'the winding rays');

	// ---- b_c and the winding ray (GM/c^2 inside tut-schw-lib; r_s here)
	check(near(BC / RS, 1.5 * Math.sqrt(3), 1e-15) && (BC / RS).toFixed(1) === '2.6', 'b_c is not (3 sqrt 3 / 2) r_s = 2.6 r_s');
	check(near(PHOTON / RS, 1.5, 1e-15), 'the photon sphere is not at 1.5 r_s');
	{
		let lo = 4, hi = 7;
		for (let i = 0; i < 44; i++) { const b = (lo + hi) / 2; if (trace(0, 1 / b, { step: 1e-3, maxPhi: 40 * Math.PI }).fate === 'horizon') lo = b; else hi = b; }
		check(Math.abs((lo + hi) / 2 - BC) < 5e-6, `capture stops at b = ${(lo + hi) / 2}, not b_c`);
	}
	let wind;
	{
		let lo = BC * (1 + 1e-5), hi = BC * 1.05;
		for (let i = 0; i < 60; i++) { const b = (lo + hi) / 2; if (deflection(b, 2e-4) > 2 * Math.PI) lo = b; else hi = b; }
		wind = (lo + hi) / 2 / RS;
	}
	check(wind.toFixed(1) === '2.6' && wind * RS / BC - 1 > 1.2e-3 && wind * RS / BC - 1 < 1.3e-3, `the winding ray's b is ${wind} r_s`);

	// ---- the view: page x right, page y up, z toward the reader; the orbit plane spanned by x and (0, cos, -sin)
	const c = Math.cos(rad(TAU)), s = Math.sin(rad(TAU));
	const cam = ([X, Y]) => [X, Y * c, -Y * s];
	const P = ([x, y]) => [ORIGIN + SCALE * x, ORIGIN - SCALE * y];
	// a point of the orbit plane outside the horizon is hidden where the horizon's disc is in front of it
	const disc = ([x, y]) => x * x + y * y < 1;
	const hidden = (p) => { const q = cam(p); return disc(q) && q[2] < 0; };
	const before = (p) => { const q = cam(p); return disc(q) && q[2] > 0; };
	const inWin = ([X, Y]) => X >= WIN.x0 && X <= WIN.x1 && Y >= WIN.y0;

	// ---- the rays
	const rays = [...FAN.map((b) => ({ b })), { b: wind, winding: true }].sort((a, q) => a.b - q.b);
	for (const ray of rays) {
		const t = trace(0, 1 / (ray.b * RS), { step: 5e-4, keep: true, maxPhi: 6 * Math.PI });
		ray.fate = t.fate; ray.phi = t.phi; ray.rMin = t.rMin / RS;
		check(firstIntegral(t.points, ray.b * RS) < 2e-5, `the first integral along b = ${ray.b}: ${firstIntegral(t.points, ray.b * RS)}`);
		check(ray.fate === (ray.b < BC / RS ? 'horizon' : 'infinity'), `the ray b = ${ray.b} goes to ${ray.fate}`);
		// the orbit plane: the ray comes in from x = -infinity at y = +b
		const pts = t.points.map(([px, py]) => [-px / RS, py / RS]);
		ray.far = pts.at(-1);
		check(near(pts[0][1], ray.b, 1e-3 * ray.b), `the ray b = ${ray.b} does not come in at y = b`);
		// the pieces of the ray in the window: over the page (1), before the horizon (2), or hidden by it (0); each
		// piece's ends found by bisection
		const state = (p) => (!inWin(p) || hidden(p) ? 0 : before(p) ? 2 : 1);
		ray.pieces = [];
		let run = null, st = 0;
		for (let i = 0; i < pts.length; i++) {
			const k = state(pts[i]);
			if (k === st) { if (run) run.push(pts[i]); continue; }
			const e = i ? edge(pts[i - 1], pts[i], (p) => state(p) === st) : pts[i];
			if (run) { run.push(e); ray.pieces.push({ st, pts: run }); }
			run = k ? [e, pts[i]] : null;
			st = k;
		}
		if (run) ray.pieces.push({ st, pts: run });
		ray.end = ray.pieces[ray.pieces.length - 1].pts.at(-1);
	}
	// the fates on the page: the captured rays end at the horizon's rim (behind it), the others at the window's edge
	for (const ray of rays) {
		const [x, y] = cam(ray.end);
		if (ray.fate === 'horizon') check(ray.pieces.at(-1).st === 2 ? near(Math.hypot(...ray.end), 1, 1e-9) : near(Math.hypot(x, y), 1, 1e-6), `the captured ray b = ${ray.b} does not end on the horizon or at its rim`);
		else check(near(ray.end[0], WIN.x1, 1e-6) || near(ray.end[1], WIN.y0, 1e-6), `the ray b = ${ray.b} ends inside the window`);
	}
	// the winding ray: bent by one turn, so it sweeps 3 pi and leaves along the line it came in on; it comes to 1.545 r_s
	{
		const w = rays.find((q) => q.winding);
		check(Math.abs(w.phi - 3 * Math.PI) < 2e-3, `the winding ray sweeps ${w.phi}`);
		check(w.rMin.toFixed(3) === '1.545', `the winding ray comes to ${w.rMin}`);
		const far = w.far;
		check(far[0] > 1e3 && near(far[1], wind, 1e-3 * wind) && near(w.end[0], WIN.x1, 1e-6), `the winding ray does not leave on its line: ${far}`);
	}
	// the outer rays: bent more than 2 r_s / b, by less as b grows (1.26 times it at 7.6 r_s)
	{
		const outer = rays.filter((q) => q.fate === 'infinity' && !q.winding);
		const ratio = outer.map((q) => deflection(q.b * RS, 2e-4) / (2 / q.b));
		check(ratio.every((v, i) => v > 1 && (i === 0 || v < ratio[i - 1])), `the bending ratios ${ratio}`);
		check(ratio[ratio.length - 1] < 1.3, `the outermost ray is bent ${ratio[ratio.length - 1]} times 2 r_s / b`);
		nums.ratios = ratio;
	}
	// the pieces on the page: ink over the page, under the horizon; a fixed pale tone where a ray passes before it
	const rim = [];                         // where a piece meets the horizon's rim on the page
	const ink = [];                         // the pieces over the page, drawn together under the fades
	for (const ray of rays) {
		const what = `the ray b = ${ray.b.toFixed(4)}`;
		check(ray.pieces[0].st === 1, `${what} does not come in over the page`);
		ray.pieces.forEach((pc, i) => {
			const page = thin(pc.pts.map((p) => P(cam(p))), 0.2);
			if (pc.st === 1) { ink.push(page); S.mark(page, RAY / 2, what); }
			else S.path(page, { color: PALE, width: RAY, layer: 3.5, cap: 'butt', what: `${what} before the horizon` });
			// a piece before the horizon begins and ends on its rim
			if (pc.st === 2) for (const e of [pc.pts[0], pc.pts.at(-1)]) check(near(Math.hypot(...cam(e).slice(0, 2)), 1, 1e-6) || e === ray.end, `${what}: a piece before the horizon does not meet its rim`);
			void i;
		});
		for (const pc of ray.pieces) for (const e of [pc.pts[0], pc.pts.at(-1)]) if (near(Math.hypot(...cam(e).slice(0, 2)), 1, 1e-6)) rim.push({ q: P(cam(e)), what });
		ray.front = ray.pieces.filter((pc) => pc.st === 2).length;
		ray.back = ray.pieces.filter((pc) => pc.st === 1).length;
	}

	// the ink pieces, faded over FADE points at the window's edges, where the rays come in from afar and go on
	{
		const L = P([WIN.x0, 0])[0], R = P([WIN.x1, 0])[0], B = P([0, WIN.y0 * c])[1];
		const g = (id, x1, y1, x2, y2) => `<linearGradient id="${name}-${id}" gradientUnits="userSpaceOnUse" x1="${n2(x1)}" y1="${n2(y1)}" x2="${n2(x2)}" y2="${n2(y2)}"><stop offset="0" stop-color="#000000" stop-opacity="1"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></linearGradient>`;
		const big = `x="${n2(L - 20)}" y="${n2(ORIGIN - 400)}" width="${n2(R - L + 40)}" height="800"`;
		const mask = `<mask id="${name}-fade" maskUnits="userSpaceOnUse" ${big}>${g('fl', L, 0, L + FADE, 0)}${g('fr', R, 0, R - FADE, 0)}${g('fb', 0, B, 0, B - FADE)}` +
			`<rect ${big} fill="#ffffff"/><rect ${big} fill="url(#${name}-fl)"/><rect ${big} fill="url(#${name}-fr)"/><rect ${big} fill="url(#${name}-fb)"/></mask>`;
		const d = ink.map((pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')).join('');
		S.raw(`${mask}<path d="${d}" fill="none" stroke="${INK}" stroke-width="${RAY}" stroke-linecap="butt" stroke-linejoin="round" mask="url(#${name}-fade)"/>`, 2);
	}
	// the rays that leave the window end at least END_GAP apart, and no two cross within CROSS_CLEAR of an end
	{
		const ends = rays.filter((q) => q.fate === 'infinity').map((q) => ({ q: P(cam(q.end)), what: `the ray b = ${q.b.toFixed(4)}` }));
		for (let i = 0; i < ends.length; i++) for (let j = i + 1; j < ends.length; j++) {
			const dd = Math.hypot(ends[i].q[0] - ends[j].q[0], ends[i].q[1] - ends[j].q[1]);
			check(dd >= END_GAP, `${ends[i].what} and ${ends[j].what} end ${dd.toFixed(2)} pt apart`);
		}
		nums.ends = ends;
	}
	// every piece meets the rim at least RIM_GAP from every other (a ray's own two pieces meet there exactly)
	for (let i = 0; i < rim.length; i++) for (let j = i + 1; j < rim.length; j++) {
		const dd = Math.hypot(rim[i].q[0] - rim[j].q[0], rim[i].q[1] - rim[j].q[1]);
		check(dd < 1e-6 || dd >= RIM_GAP, `${rim[i].what} and ${rim[j].what} meet the rim ${dd.toFixed(2)} pt apart`);
	}

	// ---- the photon sphere's outline, and the horizon
	const O = P([0, 0]);
	S.raw(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${n2(1.5 * SCALE)}" fill="none" stroke="${PHOTON_C}" stroke-width="${PHOTON_W}"/>`, 1);
	S.mark(Array.from({ length: 721 }, (_, i) => [O[0] + 1.5 * SCALE * Math.cos(rad(i / 2)), O[1] + 1.5 * SCALE * Math.sin(rad(i / 2))]), PHOTON_W / 2, 'the photon sphere');
	const hole = await litSphere(() => rgb(HOLE), 360, 0.2, 40);
	defs += `<image id="${name}-hole" class="art" href="${hole}" x="-1" y="-1" width="2" height="2" preserveAspectRatio="none"/>`;
	S.raw(`<clipPath id="${name}-hc"><circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${n2(SCALE)}"/></clipPath><g clip-path="url(#${name}-hc)"><use href="#${name}-hole" transform="translate(${n2(O[0])},${n2(O[1])}) scale(${n2(SCALE)})"/></g><circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${n2(SCALE)}" fill="none" stroke="${HOLE_EDGE}" stroke-width="${HOLE_W}"/>`, 3);
	S.mark([O], SCALE, 'the horizon');

	// ---- the crossings: of two rays (or of the winding ray with itself), and of a ray with the photon sphere's
	// outline; each at ANGLE or more; two rays' at CROSS_CLEAR or more from every end; the winding ray's own, above the
	// horizon and clear of its rim
	{
		const lines = S.marks.filter((m) => (m.what.startsWith('the ray') && !m.what.includes('before')) || m.what === 'the photon sphere');
		const tips = [...nums.ends.map((e) => e.q), ...rays.map((q) => P(cam(q.pieces[0].pts[0])))];
		const all = [];
		for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
			const [A, B] = [lines[i], lines[j]];
			for (const k of crossingsOf(A.pts, B.pts)) {
				const what = `${A.what} and ${B.what}`;
				all.push({ ...k, what });
				check(k.angle >= ANGLE, `${what} cross at ${k.angle.toFixed(1)} degrees`);
				if (B.what === 'the photon sphere') continue;
				const least = Math.min(...tips.map((t) => Math.hypot(t[0] - k.x[0], t[1] - k.x[1])));
				check(least >= CROSS_CLEAR, `${what} cross ${least.toFixed(2)} pt from an end`);
				if (A.what === B.what) {
					check(A.what === `the ray b = ${wind.toFixed(4)}` && k.x[1] < O[1] && Math.hypot(k.x[0] - O[0], k.x[1] - O[1]) - SCALE >= RIM_GAP, `${what} cross at ${k.x.map((v) => v.toFixed(1))}`);
					nums.self = (Math.hypot(k.x[0] - O[0], k.x[1] - O[1]) - SCALE).toFixed(2);
				}
			}
		}
		check(all.filter((k) => k.what.split(' and ')[0] === k.what.split(' and ')[1]).length === 1, 'the winding ray does not cross itself once');
		// between two of its crossings with the photon sphere's outline, the winding ray stands off it by SLIVER or
		// more, so that no thin sliver of page lies between them
		const w = lines.filter((m) => m.what === `the ray b = ${wind.toFixed(4)}`).flatMap((m) => m.pts);
		let arc = 0, slivers = [];
		for (let i = 0; i < w.length; i++) {
			const sd = Math.hypot(w[i][0] - O[0], w[i][1] - O[1]) - 1.5 * SCALE;
			if (i && Math.sign(sd) !== Math.sign(Math.hypot(w[i - 1][0] - O[0], w[i - 1][1] - O[1]) - 1.5 * SCALE)) { slivers.push(arc); arc = 0; }
			arc = Math.max(arc, Math.abs(sd));
		}
		slivers = slivers.slice(1);                 // the arcs between crossings (the first runs in from the window)
		check(slivers.every((v) => v >= SLIVER), `the winding ray stands off the photon sphere's outline by only ${Math.min(...slivers).toFixed(2)} pt`);
		nums.sliver = Math.min(...slivers).toFixed(2);
		nums.crossings = all.length;
		nums.angle = Math.min(...all.map((k) => k.angle)).toFixed(1);
	}

	// ---- the ring: the exact tide at its distance, from the exact fall d^2 r / dtau^2 = -GM/r^2 (GM = 1 here)
	const d = RING_AT.d;
	const a = (x) => -1 / (x * x);
	const h = 1e-4 * d;
	const along = -(a(d + h) - a(d - h)) / (2 * h), across = -a(d) / d, E0 = 1 / d ** 3;
	check(near(across / E0, 1, 1e-12) && near(along / E0, -2, 1e-7) && near(2 * across + along, 0, 1e-7 * E0), 'the tide is not (GM/d^3) diag(1, 1, -2)');
	const cen = [d * Math.cos(rad(RING_AT.angle)), d * Math.sin(rad(RING_AT.angle))];
	const u = [-cen[0] / d, -cen[1] / d], v = [-u[1], u[0]];          // toward the hole; across, in the page
	const Exi = (xi) => { const p = dot(xi, u), q = dot(xi, v); return [0, 1].map((i) => along * p * u[i] + across * q * v[i]); };
	const placeAt = (xi) => { const e = Exi(xi); return [0, 1].map((i) => cen[i] + RING * (xi[i] - (EPS * e[i]) / E0)); };
	const xiOf = (t) => [0, 1].map((i) => Math.cos(t) * u[i] + Math.sin(t) * v[i]);
	{
		const pu = placeAt(u), pv = placeAt(v);
		check(near(Math.hypot(pu[0] - cen[0], pu[1] - cen[1]), RING * (1 + 2 * EPS), 1e-6) && near(Math.hypot(pv[0] - cen[0], pv[1] - cen[1]), RING * (1 - EPS), 1e-9), 'the ring is not stretched 1 + 2 eps and squeezed 1 - eps');
	}
	const outline = Array.from({ length: 721 }, (_, i) => P(placeAt(xiOf(rad(i / 2)))));
	S.path(outline, { color: INK, width: RING_W, layer: 4, what: 'the ring' });
	const face = await sprite(SPRITES + 'ball-face.png');
	const ball = await litBall(face, 160);
	defs += `<image id="${name}-bead" class="art" href="${ball}" x="-1" y="-1" width="2" height="2" preserveAspectRatio="none"/>`;
	let arrows = 0;
	for (let j = 0; j < 12; j++) {
		const xi = xiOf(rad(30 * j)), p = placeAt(xi), [X, Y] = P(p), rr = BEAD * SCALE;
		S.raw(`<clipPath id="${name}-b${j}"><circle cx="${n2(X)}" cy="${n2(Y)}" r="${n2(rr)}"/></clipPath><g clip-path="url(#${name}-b${j})"><use href="#${name}-bead" transform="translate(${n2(X)},${n2(Y)}) scale(${n2(rr)})"/></g><circle cx="${n2(X)}" cy="${n2(Y)}" r="${n2(rr)}" fill="none" stroke="${STONE_INK}" stroke-width="0.25"/>`, 5);
		S.mark([[X, Y]], rr, `bead ${j}`);
		if (j % 3) continue;
		// the push -E xi / E0 at a bead on an axis: along it, outward on the line to the hole, inward across it
		const e = Exi(xi), push = e.map((x) => -x / E0), l = dot(push, xi);
		check(near(Math.hypot(push[0] - l * xi[0], push[1] - l * xi[1]), 0, 1e-6) && near(Math.abs(l), j % 6 ? 1 : 2, 1e-6), `the push at bead ${j} is not along its axis`);
		const stretch = l > 0, w = xi.map((x) => x * Math.sign(l));
		const page = [w[0], -w[1]];
		const A = [X + page[0] * (rr + TAIL), Y + page[1] * (rr + TAIL)], B = [A[0] + page[0] * REACH * Math.abs(l), A[1] + page[1] * REACH * Math.abs(l)];
		S.arrow(A, B, { color: stretch ? ACCENT : ACCENT2, width: PUSH, head: PUSH_HEAD, layer: 6, what: `the ${stretch ? 'stretch' : 'squeeze'} at bead ${j}` });
		check(stretch === !(j % 6), `bead ${j} is ${stretch ? 'stretched' : 'squeezed'}`);
		arrows++;
	}
	check(arrows === 4, 'the ring does not carry four arrows');
	const lens = S.arrows.map((q) => q.L);
	check(near(Math.max(...lens), 2 * Math.min(...lens), 1e-6), 'the stretch is not twice the squeeze');

	// ---- clearances on the page: the ring and its arrows clear of every ray, the photon sphere and the horizon
	const ringMarks = S.marks.filter((m) => /^bead|the ring|stretch|squeeze/.test(m.what));
	const others = S.marks.filter((m) => /ray|photon|horizon/.test(m.what));
	let least = Infinity, pair = '';
	for (const m of ringMarks) for (const q of others) {
		const dd = gap(m, q);
		if (dd < least) { least = dd; pair = `${m.what} and ${q.what}`; }
	}
	check(least >= RING_CLEAR, `${pair} are ${least.toFixed(2)} pt apart`);
	nums.ringClear = least;

	S.checkAll([]);
	window[name + '-numbers'] = { crossings: nums.crossings, angle: nums.angle, self: nums.self, sliver: nums.sliver, ends: rays.filter((q) => q.fate === 'infinity').map((q) => [q.b, ...P(cam(q.end)).map((v) => +(v - ORIGIN).toFixed(2))]), rim: rim.map((q) => [q.what, ...q.q.map((v) => +(v - ORIGIN).toFixed(2))]), wind, bc: BC / RS, rays: rays.map((q) => ({ b: q.b, fate: q.fate, phi: q.phi, rMin: q.rMin })), ratios: nums.ratios, ringClear: least, tide: [across, along, E0] };
	return finish(S, [], [240, 360], defs);
}

/** The point where `keep` changes between p (kept or not) and q, by bisection along the segment. */
function edge(p, q, keep) {
	const kp = keep(p);
	let lo = 0, hi = 1;
	for (let i = 0; i < 60; i++) {
		const m = (lo + hi) / 2, x = [p[0] + m * (q[0] - p[0]), p[1] + m * (q[1] - p[1])];
		if (keep(x) === kp) lo = m; else hi = m;
	}
	const m = kp ? lo : hi;
	return [p[0] + m * (q[0] - p[0]), p[1] + m * (q[1] - p[1])];
}

/** Where two polylines cross: the points, and the angle between them there, degrees. */
function crossingsOf(a, b) {
	const out = [];
	for (let i = 1; i < a.length; i++) for (let j = 1; j < b.length; j++) {
		const [p, q, r0, s0] = [a[i - 1], a[i], b[j - 1], b[j]];
		const d = (q[0] - p[0]) * (s0[1] - r0[1]) - (q[1] - p[1]) * (s0[0] - r0[0]);
		if (!d) continue;
		const t = ((r0[0] - p[0]) * (s0[1] - r0[1]) - (r0[1] - p[1]) * (s0[0] - r0[0])) / d;
		const u = ((r0[0] - p[0]) * (q[1] - p[1]) - (r0[1] - p[1]) * (q[0] - p[0])) / d;
		if (t < 0 || t >= 1 || u < 0 || u >= 1) continue;
		const la = Math.hypot(q[0] - p[0], q[1] - p[1]), lb = Math.hypot(s0[0] - r0[0], s0[1] - r0[1]);
		const angle = (Math.asin(Math.min(1, Math.abs(d) / (la * lb))) * 180) / Math.PI;
		out.push({ x: [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])], angle });
	}
	return out;
}

/** The least air between two marks (polylines with half-widths), points. */
function gap(m, q) {
	const segs = (k) => (k.pts.length === 1 ? [[k.pts[0], k.pts[0]]] : k.pts.slice(1).map((p, i) => [k.pts[i], p]));
	let best = Infinity;
	for (const [a, b] of segs(m)) for (const [c0, c1] of segs(q)) best = Math.min(best, segDist(a, b, c0, c1));
	return best - m.r - q.r;
}
function segDist(a, b, c, d) {
	const pt = (p, s0, s1) => {
		const dx = s1[0] - s0[0], dy = s1[1] - s0[1], l2 = dx * dx + dy * dy;
		const t = l2 ? Math.max(0, Math.min(1, ((p[0] - s0[0]) * dx + (p[1] - s0[1]) * dy) / l2)) : 0;
		return Math.hypot(p[0] - s0[0] - t * dx, p[1] - s0[1] - t * dy);
	};
	return Math.min(pt(a, c, d), pt(b, c, d), pt(c, a, b), pt(d, a, b));
}

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/** A sphere lit by the studio, its albedo `albedo(x, y)` ([r, g, b], 0 to 1) at the point (x, y) of its face, with a
 * highlight of strength `spec` and sharpness `shine`; a PNG of N pixels across, the rim's colour carried outward. */
async function litSphere(albedo, N, spec, shine) {
	const cv = document.createElement('canvas'); cv.width = N; cv.height = N;
	const ctx = cv.getContext('2d'), out = ctx.createImageData(N, N);
	for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
		let x = ((i + 0.5) / N) * 2 - 1, y = 1 - ((j + 0.5) / N) * 2;
		const rr = x * x + y * y;
		if (rr > 1) { const l = Math.sqrt(rr); x /= l; y /= l; }
		const n = [x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))];
		const lit = 0.3 + 0.8 * Math.max(0, (dot(n, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(n, FILL));
		const sp = spec * Math.max(0, dot(n, HALF)) ** shine;
		const al = albedo(x, y), q = (j * N + i) * 4;
		for (let k = 0; k < 3; k++) out.data[q + k] = Math.round(255 * Math.min(1, al[k] * lit + sp));
		out.data[q + 3] = 255;
	}
	ctx.putImageData(out, 0, 0);
	return cv.toDataURL('image/png');
}

/** A stone ball lit by the studio (tut-one-point-hero's litBall): the picture `face` (its exact circle inside MARGIN
 * pixels of canvas) as the albedo, seen face on; a JPEG of N pixels across. */
async function litBall(face, N) {
	const img = new Image(); img.src = face.href; await img.decode();
	const src = document.createElement('canvas');
	src.width = face.w; src.height = face.h;
	const sctx = src.getContext('2d'); sctx.drawImage(img, 0, 0);
	const tex = sctx.getImageData(0, 0, face.w, face.h).data;
	const c = document.createElement('canvas'); c.width = N; c.height = N;
	const ctx = c.getContext('2d'), out = ctx.createImageData(N, N);
	const r0 = (face.w - 2 * MARGIN) / 2, cx = face.w / 2, cy = face.h / 2;
	for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
		let x = ((i + 0.5) / N) * 2 - 1, y = 1 - ((j + 0.5) / N) * 2;
		const rr = x * x + y * y;
		if (rr > 1) { const l = Math.sqrt(rr); x /= l; y /= l; }
		const n = [x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))];
		const s = 0.97;
		const tx = Math.round(cx + s * r0 * x), ty = Math.round(cy - s * r0 * y), t = (ty * face.w + tx) * 4;
		const lit = 0.3 + 0.8 * Math.max(0, (dot(n, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(n, FILL));
		const spec = 0.18 * Math.max(0, dot(n, HALF)) ** 30;
		const q = (j * N + i) * 4;
		for (let k = 0; k < 3; k++) out.data[q + k] = Math.round(255 * Math.min(1, (tex[t + k] / 255) * lit + spec));
		out.data[q + 3] = 255;
	}
	ctx.putImageData(out, 0, 0);
	return c.toDataURL('image/jpeg', 0.9);
}
