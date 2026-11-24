// The tutorial, chapter 11.3 (tutorial/black-holes/hawking.md), its second diagram: one mode's bookkeeping at a hole.
// The hole at the right, a dark disc edged by its horizon. From the left a band, the sky's quanta in the mode, comes in
// ("sky: n_bg"); short of the hole it splits: its upper part runs on into the horizon and ends there in a point
// ("Gamma_l n_bg absorbed, net"), its lower part turns back below itself ("(1 - Gamma_l) n_bg scattered"). A thin band
// in the light role's colour leaves the horizon ("Gamma_l n_H spontaneous") and joins the scattered band beneath it, and
// the two run on to the left as one band ending in a point ("n_out = n_bg + Gamma_l (n_H - n_bg)"). Every band's width
// is in proportion to its number of quanta, for Gamma_l = 0.4, n_bg = 1 and n_H = 0.3: 1 comes in, 0.4 is absorbed,
// 0.6 scattered, 0.12 emitted and 0.72 goes out. The sky's quanta are in the page's grey wherever they go, the hole's
// own in the light role's colour, so that the band that leaves shows both.
// Departures from the diagram's comment: the arrows are bands of the given widths, and their heads are points of the
// bands' own widths; the labels carry Gamma_l, the chapter's letter, where the comment writes Gamma; "sky: n_bg" and
// "n_out = ..." stand at the left ends of the bands they name, and the scattered band's name between the two lanes.
// Exact: the widths, in proportion to the chapter's bookkeeping (asserted in tut-hawking-lib.js, and against the drawn
// widths here). Schematic, as the caption says: the paths, the place of the turn and the hole's size.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { INK } from '../lib.js';
import { chapter, palette, near, LIGHT, HOLE, book, MODE } from './tut-hawking-lib.js';

const name = 'tut-hawking-mode';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const U = 20;                                    // a band's width for one quantum
const RI = 11;                                   // the turn's inner radius
const R = 33;                                    // the hole's radius
const EDGE = 0.45;                               // the horizon's stroke (chapter 11.1's)
const CLEAR = 8;                                 // from the turn to the hole
const RUN = 100;                                 // the bands' straight run left of the turn
const HEAD = 0.75;                               // a point's length, over its band's width
const SKY = 'color-mix(in srgb, #1c1a16 36%, #fffffe)';   // the sky's quanta: ink mixed into the page, swapped with it
const OWN = LIGHT;                               // the hole's own
const caption = 'Look first at the two arrows that leave: what the hole scatters and what it emits of its own add up to what the camera receives. The arrow into the horizon is the net absorption, stimulated emission taken away. The arrows are schematic; their widths follow the bookkeeping for one example.';

const d = (pts) => 'M' + pts.map((p) => p.map(n2).join(',')).join('L') + 'Z';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'hawking-mode', caption);

	const S = new Sheet(name);
	const L = [];
	const b = book(MODE);
	const W = { in: b.in * U, abs: b.absorbed * U, sca: b.scattered * U, own: b.emitted * U, out: b.out * U };
	check(near(W.abs + W.sca, W.in, 1e-12) && near(W.sca + W.own, W.out, 1e-12), 'the widths do not add up');
	check([W.in, W.abs, W.sca, W.own, W.out].map((w) => (w / U).toFixed(2)).join() === '1.00,0.40,0.60,0.12,0.72', 'the widths');

	// ---- the lanes, y down: the band that comes in, [yA, yA + W.in]; the one that goes out, [yB, yB + W.out]
	const yA0 = 0;
	const yc = yA0 + W.in + RI;                      // the turn's centre, below the band that comes in
	const yB = yc + RI;                              // the lower lane's top
	const absMid = yA0 + W.abs / 2, ownMid = yB + W.sca + W.own / 2;
	const hy0 = (absMid + ownMid) / 2;
	// place the drawing about the page's centre
	const dy = ORIGIN - hy0;
	const yA = yA0 + dy, ycT = yc + dy, yBt = yB + dy, hy = ORIGIN;
	const hx = ORIGIN + 120;
	const reach = (y) => Math.sqrt(R * R - (y - hy) ** 2);       // the horizon's half-width at the height y
	const xt = hx - R - CLEAR - (RI + W.sca);                    // the turn's start
	const x0 = xt - RUN;                                          // the bands' left ends
	check(Math.abs(absMid + dy - hy) < R && Math.abs(ownMid + dy - hy) < R, 'a band misses the hole');

	// ---- the sky's quanta, one shape: in, absorbed with its point, the turn, and the lower lane
	const absTip = [hx - Math.sqrt((R + EDGE / 2) ** 2 - (yA + W.abs / 2 - hy) ** 2), yA + W.abs / 2];   // on the horizon's outer edge
	const absBase = absTip[0] - HEAD * W.abs;
	const turn = [];
	const n = 96;
	for (let i = 0; i <= n; i++) { const p = (Math.PI * i) / n; turn.push([xt + (RI + W.sca) * Math.sin(p), ycT - (RI + W.sca) * Math.cos(p)]); }
	for (let i = n; i >= 0; i--) { const p = (Math.PI * i) / n; turn.push([xt + RI * Math.sin(p), ycT - RI * Math.cos(p)]); }
	check(near(turn[0][1], yA + W.abs, 1e-9) && near(turn[n][1], yBt + W.sca, 1e-9) && near(turn[n + 1][1], yBt, 1e-9), 'the turn\'s ends');
	const outTip = [x0, yBt + W.out / 2];
	const outBase = x0 + HEAD * W.out;
	const skyShape = [
		[[x0, yA], [xt + 0.5, yA], [xt + 0.5, yA + W.in], [x0, yA + W.in]],                                 // in
		[[xt - 0.5, yA], [absBase, yA], absTip, [absBase, yA + W.abs], [xt - 0.5, yA + W.abs]],           // absorbed
		turn,                                                                                             // the turn
		[[xt + 0.5, yBt], [outBase, yBt], [outBase, yBt + W.sca], [xt + 0.5, yBt + W.sca]]               // scattered, out
	];
	// the point of the band that goes out, cut at the line between its two parts
	const cut = (y) => [outTip[0] + ((outBase - outTip[0]) * Math.abs(y - outTip[1])) / (W.out / 2), y];
	const yS = yBt + W.sca;                                                                              // the line between them
	check(yS > outTip[1], 'the line between the parts is not below the point\'s tip');
	skyShape.push([[outBase + 0.5, yBt], [outBase, yBt], outTip, cut(yS), [outBase, yS], [outBase + 0.5, yS]]);
	// one path for each piece, each overlapping the next by half a point, so that no seam shows where they meet
	for (const piece of skyShape) S.raw(`<path d="${d(piece)}" fill="${SKY}"/>`, 2);
	// ---- the hole's own: from inside the horizon to the point
	const ownStart = hx - reach(ownMid + dy) + 3;
	const ownShape = [[ownStart, yS], [outBase, yS], [outBase, yS + W.own], [ownStart, yS + W.own]];
	const ownPoint = [[outBase + 0.5, yS], [outBase, yS], cut(yS), [outBase, yS + W.own], [outBase + 0.5, yS + W.own]];
	S.raw(`<path d="${d(ownShape)}${d(ownPoint)}" fill="${OWN}"/>`, 2);
	check(near(cut(yS + W.own)[0], outBase, 1e-9), 'the point\'s lower corner');
	// the outlines, for the labels' clearance
	for (const [i, s] of skyShape.entries()) S.mark([...s, s[0]], 0, `the sky's band ${i}`);
	S.mark([...ownShape, ownShape[0]], 0, 'the hole\'s own band');
	S.mark([...ownPoint, ownPoint[0]], 0, 'the hole\'s own point');

	// ---- the hole, over the bands
	S.raw(`<circle cx="${n2(hx)}" cy="${n2(hy)}" r="${R}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 3);
	S.mark(Array.from({ length: 181 }, (_, i) => [hx + R * Math.cos((i * Math.PI) / 90), hy + R * Math.sin((i * Math.PI) / 90)]), EDGE / 2, 'the hole');
	// the absorbed point touches the horizon and nothing else of it does; the turn clears the hole
	for (let i = 0; i <= 40; i++) {
		const t = i / 40;
		for (const p of [[absBase + t * (absTip[0] - absBase), yA + t * (W.abs / 2)], [absBase + t * (absTip[0] - absBase), yA + W.abs - t * (W.abs / 2)]])
			check(Math.hypot(p[0] - hx, p[1] - hy) >= R + EDGE / 2 - 1e-9, 'the absorbed point runs into the hole');
	}
	check(Math.min(...turn.map((p) => Math.hypot(p[0] - hx, p[1] - hy))) > R + CLEAR - 1e-6 - 0.01, 'the turn comes close to the hole');
	// the drawn widths against the bookkeeping
	check(near((yA + W.in - yA) / U, b.in, 1e-12) && near((yS - yBt) / U, b.scattered, 1e-12) && near(W.own / U, b.emitted, 1e-12), 'the drawn widths');
	check(near((yS + W.own - yBt) / U, b.out, 1e-12) && near((turn[0][1] - yA) / U, b.absorbed, 1e-12), 'the drawn widths out and absorbed');

	// ---- the names
	L.push(await placed('\\text{sky: }n_{\\rm bg}', x0 - LABEL_GAP - 0.4, yA + W.in / 2, 1, 0.5, INK));
	L.push(await placed('n_{\\rm out} = n_{\\rm bg} + \\Gamma_\\ell\\,(n_H - n_{\\rm bg})', x0 - LABEL_GAP - 0.4, outTip[1], 1, 0.5, INK));
	L.push(await S.clear('\\Gamma_\\ell n_{\\rm bg}\\ \\text{absorbed, net}', absBase + 2, yA - LABEL_GAP - 0.3, 1, 1, [-1, 0]));
	L.push(await placed('(1 - \\Gamma_\\ell)\\,n_{\\rm bg}\\ \\text{scattered}', xt - 3, ycT, 1, 0.5, INK));
	L.push(await S.clear('\\Gamma_\\ell n_H\\ \\text{spontaneous}', hx - R + 4, yS + W.own + LABEL_GAP + 0.3, 1, 0, [-1, 0]));

	S.checkAll(L);
	window[name + '-numbers'] = { widths: W, gap: Math.min(...turn.map((p) => Math.hypot(p[0] - hx, p[1] - hy))) - R };
	return finish(S, L, [280, 340]);
}
