// The tutorial, chapter 3.6 (tutorial/noise/bessel-and-airy.md), its third diagram: a round opening transforms to a
// wider pattern than a slit. Left, a disc of radius R (first accent, orange) and a slit of half-width R (second
// accent, blue; a strip across the plane, its ends faded because it runs on), each with its shadow on the first axis
// a_1 drawn beneath it, at the drawing's scale: the disc's chord, 2 sqrt(R^2 - a_1^2), a half-ellipse of height 2R; and
// the slit's flat bar, drawn with the same area, pi R^2, so that the two shadows weigh the same (their spreads, R/2 and
// R/sqrt 3 = 0.58 R, are asserted but not drawn). Right, on one pair of
// axes from x = 0 to 12, the disc's pattern 2 J1(x) / x (orange) and the slit's sin x / x (blue, dashed, as chapter
// 3.5 draws it), with the dotted lines at zero and at one half: the half maxima, 2.215 and 1.895; the first zeros,
// 3.832 and pi; and the first dips, (5.136, -0.132) and (4.493, -0.217), each marked by a dot in its colour.
// Exact: the two patterns (tut-bessel-lib.js), their half maxima and zeros (bisection) and their dips (golden
// sections), asserted against the chapter's numbers; the shadows (the chord, and a bar of equal area). Each curve is sampled every quarter of a point along its length.
// Schematic: the length of the slit (it runs on), and the height of the bar, which is set by the equal area.
import { Sheet, ORIGIN, finish, checker, placed, near, AXIS, HAIR, DOT as DOTS } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, dimension, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { airy, sinc, mathematics, DIM, INK, ACCENT, ACCENT2, DASH, DOT, ZERO_LINE, ZERO_DASH, n2 } from './tut-bessel-lib.js';

const name = 'tut-bessel-disc-slit';
const check = checker(name);

const R = 22;                        // the openings' radius and half-width, points
const COL = 2 * R + 14;              // from one opening's centre to the other's
const STRIP = 1.5;                   // the slit is drawn from -1.5 R to 1.5 R across, the last 0.45 R of each end faded
const FADE = 0.45;
const PW = 184, UNIT = 92;           // the chart: x from 0 to 12; points per unit of the patterns
const TOP = 1.06, BOTTOM = -0.45;
const GAP = 30;                      // from the right end of the openings' column to the chart's vertical axis
const OPEN = 0.55;                   // the openings' and shadows' outlines
const TINT_O = '#f3dfcb', TINT_B = '#dce7f3';   // drawing.ts, THEME: the pale tints of the two accents

export default async function () {
	const n = mathematics(name);
	const S = new Sheet(name);
	const L = [];
	let defs = '';
	const H = (TOP - BOTTOM) * UNIT;
	const colW = COL + 2 * R;
	const left = ORIGIN - (colW + GAP + PW) / 2, top = ORIGIN - H / 2;
	const P = new Plot({ left: left + colW + GAP, top, w: PW, h: H, x0: 0, x1: 12, y0: BOTTOM, y1: TOP });
	const xD = left + R, xS = left + R + COL;        // the centres of the disc and of the slit
	const cy = top + STRIP * R;                       // the openings' centre line: the strip's top is the chart's top
	const base = P.bottom;                            // the shadows stand on the chart's horizontal axis

	// ---- the disc
	S.raw(`<circle cx="${n2(xD)}" cy="${n2(cy)}" r="${R}" fill="${TINT_O}" stroke="${ACCENT}" stroke-width="${OPEN}"/>`, 1);
	S.boxes.push({ box: { l: xD - R, r: xD + R, t: cy - R, b: cy + R }, what: 'the disc' });
	// its radius, from the centre to the right
	S.path([[xD, cy], [xD + R, cy]], { color: ACCENT, width: HAIR, layer: 1.5, cap: 'butt', what: 'the radius' });
	S.raw(`<circle cx="${n2(xD)}" cy="${n2(cy)}" r="0.7" fill="${ACCENT}"/>`, 1.6);

	// ---- the slit: a strip, its ends faded
	const sTop = cy - STRIP * R, sBot = cy + STRIP * R;
	const f0 = FADE / (2 * STRIP), f1 = 1 - f0;
	const fade = (id, c, o) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${n2(sTop)}" x2="0" y2="${n2(sBot)}">` +
		`<stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="${f0.toFixed(4)}" stop-color="${c}" stop-opacity="${o}"/>` +
		`<stop offset="${f1.toFixed(4)}" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`;
	defs += fade(`${name}-strip`, TINT_B, 1) + fade(`${name}-edge`, ACCENT2, 1);
	S.raw(`<rect x="${n2(xS - R)}" y="${n2(sTop)}" width="${2 * R}" height="${n2(sBot - sTop)}" fill="url(#${name}-strip)"/>`, 1);
	S.raw(`<path d="M${n2(xS - R)},${n2(sTop)}V${n2(sBot)}M${n2(xS + R)},${n2(sTop)}V${n2(sBot)}" stroke="url(#${name}-edge)" stroke-width="${OPEN}" fill="none"/>`, 1.2);
	S.boxes.push({ box: { l: xS - R, r: xS + R, t: sTop, b: sBot }, what: 'the slit' });
	// its half-width, from the middle to the right edge
	S.path([[xS, cy], [xS + R, cy]], { color: ACCENT2, width: HAIR, layer: 1.5, cap: 'butt', what: 'the half-width' });
	S.raw(`<circle cx="${n2(xS)}" cy="${n2(cy)}" r="0.7" fill="${ACCENT2}"/>`, 1.6);

	// ---- the shadows: the disc's chord, and a bar of the same area
	const N = 400;
	const ell = [];
	for (let i = 0; i <= N; i++) { const t = Math.PI * (1 - i / N); ell.push([xD + R * Math.cos(t), base - 2 * R * Math.sin(t)]); }
	// the face filled, the outline drawn over the arc only: the axis is the shadow's base, and no stroke runs along it
	const ellD = ell.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L');
	S.raw(`<path d="M${ellD}Z" fill="${TINT_O}"/><path d="M${ellD}" fill="none" stroke="${ACCENT}" stroke-width="${OPEN}" stroke-linejoin="round" stroke-linecap="butt"/>`, 1);
	S.mark(ell, OPEN / 2, 'the disc\'s shadow');
	// the half-ellipse is the chord: at a_1 its height is 2 sqrt(R^2 - a_1^2)
	for (const a of [0, 0.3, 0.7, 0.95]) {
		const t = Math.acos(a), y = 2 * R * Math.sin(t);
		check(near(y, 2 * Math.sqrt(R * R - (a * R) ** 2), 1e-9), 'the half-ellipse is not the chord');
	}
	const hBar = (Math.PI * R) / 2;
	check(near(2 * R * hBar, (Math.PI * R * R), 1e-9), 'the bar\'s area is not the disc\'s');
	S.raw(`<rect x="${n2(xS - R)}" y="${n2(base - hBar)}" width="${2 * R}" height="${n2(hBar)}" fill="${TINT_B}"/>` +
		`<path d="M${n2(xS - R)},${n2(base)}V${n2(base - hBar)}H${n2(xS + R)}V${n2(base)}" fill="none" stroke="${ACCENT2}" stroke-width="${OPEN}" stroke-linejoin="miter" stroke-linecap="butt"/>`, 1);
	S.mark([[xS - R, base], [xS - R, base - hBar], [xS + R, base - hBar], [xS + R, base]], OPEN / 2, 'the slit\'s shadow');
	S.boxes.push({ box: { l: xD - R, r: xD + R, t: base - 2 * R, b: base }, what: 'the disc\'s shadow\'s face' });
	S.boxes.push({ box: { l: xS - R, r: xS + R, t: base - hBar, b: base }, what: 'the slit\'s shadow\'s face' });
	// the first axis under both
	S.path([[xD - R - 5, base], [xS + R + 5, base]], { color: DIM, width: AXIS, layer: 1.3, cap: 'butt', what: 'the first axis' });
	// dotted lines from each opening's edges down to its shadow: the slit's to the bar's corners; the disc's down to the
	// height where the half-ellipse's flank stands GUIDE points inside the line, so that the two never run together
	const gap = 2.2, GUIDE = 2.6;
	const hFlank = 2 * R * Math.sqrt(1 - (1 - GUIDE / R) ** 2);
	// and from the height below the disc's middle where its rim stands GUIDE points inside the line
	const vFlank = R * Math.sqrt(1 - (1 - GUIDE / R) ** 2);
	check(near(R * Math.sqrt(1 - (hFlank / (2 * R)) ** 2), R - GUIDE, 1e-9), 'the guide\'s end');
	for (const s of [-1, 1]) {
		S.dots([xD + s * R, cy + vFlank], [xD + s * R, base - hFlank], { color: DIM, what: 'the disc\'s edge line' });
		S.dots([xS + s * R, sBot + gap], [xS + s * R, base - hBar - gap], { color: DIM, what: 'the slit\'s edge line' });
	}

	// ---- the chart: the zero line, the half line, the two patterns
	S.path([[P.left, P.Y(0)], [P.right, P.Y(0)]], { color: DIM, width: ZERO_LINE, layer: 0.5, cap: 'butt', dash: ZERO_DASH, what: 'the zero line' });
	S.path([[P.left, P.Y(0.5)], [P.right, P.Y(0.5)]], { color: DIM, width: ZERO_LINE, layer: 0.5, cap: 'butt', dash: ZERO_DASH, what: 'the half line' });
	for (const [f, o, what] of [[airy, { color: ACCENT }, '2J1(x)/x'], [sinc, { color: ACCENT2, dash: DASH, cap: 'butt' }, 'sin x / x']]) {
		const pts = graph(P, f, 0, 12);
		check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y >= P.top && y <= P.bottom - 4), `${what} leaves its chart or meets its axis`);
		S.path(pts, { width: CURVE, layer: o.dash ? 2.2 : 2, what, ...o });
	}
	const dot = (x, v, color, what) => {
		const [px, py] = P.at(x, v);
		S.raw(`<circle cx="${n2(px)}" cy="${n2(py)}" r="${DOT}" fill="${color}"/>`, 3);
		S.mark([[px, py]], DOT, what);
		return [px, py];
	};
	const hD = dot(n.halfDisc, 0.5, ACCENT, 'the disc\'s half'), hS = dot(n.halfSlit, 0.5, ACCENT2, 'the slit\'s half');
	const zD = dot(n.z1[0], 0, ACCENT, 'the disc\'s zero'), zS = dot(Math.PI, 0, ACCENT2, 'the slit\'s zero');
	const dD = dot(n.dipDisc.x, n.dipDisc.y, ACCENT, 'the disc\'s dip'), dS = dot(n.dipSlit.x, n.dipSlit.y, ACCENT2, 'the slit\'s dip');

	// ---- the axes
	const fmt = (t) => (t < 0 ? `-${-t}` : `${t}`);
	const xl = await xAxis(S, P, { ticks: [0, 4, 8, 12], fmt, what: 'the x axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('x', last.box.r + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '\\tfrac12' : fmt(t)), what: 'the vertical axis' })));

	// ---- the numbers: each on the side of its dot that the curves leave empty
	const g = DOT + LABEL_GAP + 0.3;
	L.push(await S.clear('2.215', hD[0] + 0.8, hD[1] - g, 0, 1, [1, 0], { color: ACCENT }));
	L.push(await S.clear('1.895', hS[0] - 0.8, hS[1] + g, 1, 0, [-1, 0], { color: ACCENT2 }));
	L.push(await S.clear('3.832', zD[0] + 0.8, zD[1] - g, 0, 1, [1, 0], { color: ACCENT }));
	L.push(await S.clear('\\pi', zS[0] - 0.8, zS[1] + g, 1, 0, [-1, 0], { color: ACCENT2 }));
	// the dips' depths, side by side under the deeper one, far enough apart not to read as a range, as chapter 3.5's
	L.push(await S.clear('-0.217', dS[0] + 1.5, dS[1] + DOT + LABEL_GAP, 1, 0, [0, 1], { color: ACCENT2 }));
	L.push(await S.clear('-0.132', dS[0] + 7.5, dS[1] + DOT + LABEL_GAP, 0, 0, [0, 1], { color: ACCENT }));

	// ---- the names
	L.push(await S.clear('2J_1(x)/x', P.X(1.62), P.Y(0.8), 0, 0.5, [1, 0], { color: ACCENT }));
	L.push(await S.clear('\\sin x/x', P.X(7.73), P.Y(sinc(7.725)) - LABEL_GAP - 1, 0.5, 1, [0, -1], { color: ACCENT2 }));
	// labels inside a tinted face: placed as by the sheet's `clear`, passing over that face
	const inside = async (src, x, y, ax, ay, dir, color, face) => {
		const skip = (w) => w === face;
		for (let t = 0; t < 30; t += 0.05) {
			const l = await placed(src, x + dir[0] * t, y + dir[1] * t, ax, ay, color);
			if (S.clearance(l.box, skip).d >= LABEL_GAP + 0.2) return Object.assign(l, { on: [face] });
		}
		throw new Error(`${name}: no room for ${src}`);
	};
	L.push(await inside('R', xD + R / 2, cy - 1.4, 0.5, 1, [0, -1], ACCENT, 'the disc'));
	L.push(await inside('R', xS + R / 2, cy - 1.4, 0.5, 1, [0, -1], ACCENT2, 'the slit'));
	L.push(await placed('a_1', xS + R + 5 + 2.5, base, 0, 0.5, DIM));

	S.checkAll(L);
	window.tutBesselDiscSlit = { half: [n.halfDisc, n.halfSlit], dips: [n.dipDisc, n.dipSlit], spreads: [n.sDisc, n.sSlit] };
	return finish(S, L, [240, 340], defs);
}
