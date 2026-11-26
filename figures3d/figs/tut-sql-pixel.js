// The tutorial, section 8.6 (tutorial/quantum/quantum-limit.md), its second diagram: Section II's ideal pixel. Two
// panels side by side. Left: two small grey balls of 1 g, a centimetre apart on a horizontal line, drawn twice, at
// t = 0 (above) and t = 1 s (below); above each ball an ink bell for its position's spread, of standard deviation
// sigma_0 = 2.30 x 10^-16 m above and sigma_SQL = 3.25 x 10^-16 m below, magnified; at the right the person, the stone
// figure of Part 1, small, facing the balls, with a dimension line "1 m" from the middle of the pair to the person's
// axis; on the balls below, a short orange arrow each, outward along the line, the stretch toward the person,
// named E xi tau^2 / 2. Right: a vertical logarithmic strip of tides from 10^-15 to 10^-8 s^-2 with three marks named
// beside them: the person, 9.3 x 10^-9; the gradiometer, 0.02 E in 1 s, 2 x 10^-11; the SQL pixel, 6.5 x 10^-14,
// with a short bracket up to 9.2 x 10^-14, the distance of the two. Ink and greys, and orange for the two arrows only.
// Departures from the diagram's comment: the spreads are magnified 4 x 10^12 times against the drawn centimetre, not
// 10^13, since at 10^13 each bell (three standard deviations either side) would be wider than the centimetre between
// the balls; "1 g" is written under the balls of the first row only; the stretch is written E xi tau^2 / 2, with a
// slash, since a built-up half is too small to read on a phone (as in section 8.3's tut-occupation); the one person,
// standing between the two rows, serves both.
// Exact: sigma_0, sigma_SQL and the three tides (tut-sql-lib.js, asserted against the chapter's text); the bells'
// widths in proportion, sigma_SQL / sigma_0 = sqrt 2, at the stated magnification of the drawn centimetre; the strip's
// marks. Schematic: the balls' size, the person's size and distance, the arrows' length. Pictorial: the person
// (sprites/tut-person.png, as figs/tut-lap-two.js draws it).
import { Sheet, ORIGIN, finish, checker, placed, HAIR, TICK, LABEL_GAP, AXIS, n2 } from './tut-pot-lib.js';
import { Plot, yAxis } from './tut-prob-lib.js';
import { CURVE } from './tut-fourier-lib.js';
import { STEEL } from './tut-five-lib.js';
import { INK, DIM, ACCENT, sprite } from '../lib.js';
import { chapter, palette, CURV, near, personTide, pixelTide, GRADIOMETER, XI } from './tut-sql-lib.js';

const name = 'tut-sql-pixel';
const check = checker(name);

// ---- the scene (points, y down) ----------------------------------------------------------------------------------
const D = 60;                            // the drawn centimetre between the balls
const MAG = 4e12;                        // the bells' magnification against the drawn centimetre
const BALL = 3.4;                        // a ball's radius (schematic)
const BELL_H = 13, BELL_GAP = 2.2, BELL_REACH = 3;   // a bell's height, its baseline above the ball, its half-width in sigma
const ROWS = 62;                         // from the first row's line to the second's
const LINE_W = 0.4;
const STATURE = 84;                      // the person's height on the page (schematic)
const PERSON_AT = 70;                    // from the right ball to the person's axis
const ARROW = 9, ARROW_W = 0.6, ARROW_HEAD = 3.4, ARROW_TAIL = 1.2;
const RES = 600;                         // the person's picture, pixels tall
// ---- the strip
const lg = Math.log10;
const S0 = -15, S1 = -8, DEC = 19.5;     // decades, points per decade
const STRIP_GAP = 34;                    // from the person's right edge to the strip
const MARK = 6;                          // a mark's length right of the strip
const M_W = 0.55;

/** Where a sprite has ink (alpha at least half): [left, right, top, bottom] in pixels. */
async function inkOf(s) {
	const img = new Image();
	img.src = s.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.width = img.width; c.height = img.height;
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const a = ctx.getImageData(0, 0, img.width, img.height).data;
	let l = Infinity, r = -1, t = Infinity, b = -1;
	for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (a[(y * img.width + x) * 4 + 3] >= 128) {
		if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
	}
	return { l, r: r + 1, t, b: b + 1 };
}
/** The picture resampled to `h` pixels tall, as a data URL. */
async function resample(s, h) {
	const img = new Image();
	img.src = s.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.height = h; c.width = Math.round((h * img.width) / img.height);
	const ctx = c.getContext('2d');
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(img, 0, 0, c.width, c.height);
	return c.toDataURL('image/png');
}

export default async function () {
	const { md, sql, s0 } = await chapter(check);
	check(md.replace(/\s+/g, ' ').includes('reads tides 144,000 times smaller than the person\'s') && (Math.round(personTide() / pixelTide() / 1000) * 1000) === 144000, 'the caption\'s 144,000');
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const E = `{\\color{${CURV}}\\mathcal E}`;

	// ---- the two rows
	const x1 = ORIGIN - 150, x2 = x1 + D, mid = (x1 + x2) / 2;
	const y1 = ORIGIN - ROWS / 2, y2 = ORIGIN + ROWS / 2;
	const perPt = (D / XI) * MAG;            // drawn points per metre of spread
	const xp = x2 + PERSON_AT;               // the person's axis
	const rows = [{ y: y1, sigma: s0 * perPt, key: '0' }, { y: y2, sigma: sql * perPt, key: '1' }];
	check(near(rows[1].sigma / rows[0].sigma, Math.SQRT2, 1e-12), 'the bells are not sqrt 2 apart in width');
	check(BELL_REACH * rows[1].sigma * 2 < D - 6, 'the bells of a row touch');
	check(near(rows[0].sigma / perPt, 2.296e-16, 1e-3) && near(rows[1].sigma / perPt, 3.2475e-16, 1e-3), 'the bells\' spreads');
	for (const r of rows) {
		S.path([[x1 - 16, r.y], [xp - 14, r.y]], { color: DIM, width: LINE_W, layer: 1, cap: 'butt', what: `the line of row ${r.key}` });
		for (const x of [x1, x2]) {
			S.sphere([x, r.y], BALL, STEEL, { spec: 0.6, shininess: 36, layer: 3 }, `a ball of row ${r.key}`);
			// the bell: e^{-u^2/2} over u in sigma, from -BELL_REACH to BELL_REACH
			const base = r.y - BALL - BELL_GAP;
			const pts = [];
			for (let i = 0; i <= 240; i++) {
				const u = -BELL_REACH + (2 * BELL_REACH * i) / 240;
				pts.push([x + u * r.sigma, base - BELL_H * Math.exp(-(u * u) / 2)]);
			}
			S.path(pts, { color: INK, width: CURVE, layer: 2, what: `a bell of row ${r.key}` });
		}
	}
	// the bells' names, above each row's pair
	L.push(await S.clear(`\\sigma_0 = 2.30\\times10^{-16}\\ \\mathrm m`, mid, y1 - BALL - BELL_GAP - BELL_H - LABEL_GAP - 1, 0.5, 1, [0, -1]));
	L.push(await S.clear(`\\sigma_{\\rm SQL} = 3.25\\times10^{-16}\\ \\mathrm m`, mid, y2 - BALL - BELL_GAP - BELL_H - LABEL_GAP - 1, 0.5, 1, [0, -1]));
	// the masses, under the first row's balls
	for (const x of [x1, x2]) L.push(await placed('1\\ \\mathrm g', x, y1 + BALL + LABEL_GAP + 0.6, 0.5, 0, INK));
	// the times, at the left of each row
	L.push(await S.clear('t = 0', x1 - 18, y1, 1, 0.5, [-1, 0]));
	L.push(await S.clear('t = 1\\ \\mathrm s', x1 - 18, y2, 1, 0.5, [-1, 0]));

	// ---- the stretch: an orange arrow on each ball of the second row, outward along the line
	for (const [x, s] of [[x1, -1], [x2, 1]]) {
		const a = [x + s * (BALL + ARROW_TAIL), y2], b = [x + s * (BALL + ARROW_TAIL + ARROW), y2];
		S.arrow(a, b, { color: ACCENT, width: ARROW_W, head: ARROW_HEAD, layer: 4, what: 'a stretch arrow' });
	}
	L.push(await S.clear(`${E}\\xi\\tau^2/2`, mid, y2 + LABEL_GAP + 1, 0.5, 0, [0, 1]));

	// ---- the person, standing between the rows, facing the balls
	const person = await sprite('/figures3d/sprites/tut-person.png');
	const ink = await inkOf(person);
	const px = STATURE / (ink.b - ink.t);
	const small = await resample(person, RES);
	const sole = ORIGIN + STATURE / 2 + 2;
	const left = xp - ((ink.l + ink.r) / 2) * px, top = sole - ink.b * px;
	S.raw(`<image class="art" href="${small}" x="${n2(left)}" y="${n2(top)}" width="${n2(person.w * px)}" height="${n2(person.h * px)}" preserveAspectRatio="none" transform="translate(${n2(2 * xp)},0) scale(-1,1)"/>`, 3);
	const body = { l: xp - ((ink.r - ink.l) / 2) * px, r: xp + ((ink.r - ink.l) / 2) * px, t: sole - STATURE, b: sole };
	S.boxes.push({ box: body, what: 'the person' });
	check(body.t < y1 - 4 && body.b > y2 + 4, 'the person does not span the two rows');

	// ---- the dimension, 1 m, from the middle of the pair to the person's axis, under everything
	{
		const low = Math.max(body.b, ...L.map((l) => l.box.b));
		const y = low + 6;
		S.path([[mid, y], [xp, y]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the dimension' });
		for (const x of [mid, xp]) S.path([[x, y - TICK], [x, y + TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'a tick of the dimension' });
		L.push(await placed('1\\ \\mathrm m', (mid + xp) / 2, y + HAIR / 2 + LABEL_GAP + 0.3, 0.5, 0, INK));
		const note = await placed(`\\text{spreads magnified }4\\times10^{12}\\text{ times}`, x1 - 16, L[L.length - 1].box.b + 6, 0, 0, DIM);
		L.push(note);
		check(near((rows[0].sigma / s0) * (XI / D), MAG, 1e-12), 'the magnification');
	}

	// ---- the strip
	const sx = body.r + STRIP_GAP;
	const H = (S1 - S0) * DEC;
	const P = new Plot({ left: sx, top: ORIGIN - H / 2 - 4, w: 1, h: H, x0: 0, x1: 1, y0: S0, y1: S1 });
	L.push(...(await yAxis(S, P, { ticks: Array.from({ length: S1 - S0 + 1 }, (_, i) => S0 + i), fmt: (t) => ((t - S0) % 2 === 1 ? `10^{${t}}` : null), what: 'the strip' })));
	L.push(await placed('\\text{tide}\\ (\\mathrm{s^{-2}})', sx + 2, P.top - 9, 1, 1, DIM));
	const mark = (v, what, width = M_W, color = INK) => {
		const y = P.Y(lg(v));
		S.path([[sx, y], [sx + MARK, y]], { color, width, cap: 'butt', layer: 2, what });
		return y;
	};
	const yP = mark(personTide(), 'the person\'s mark');
	const yG = mark(GRADIOMETER, 'the gradiometer\'s mark');
	const y6 = mark(pixelTide(), 'the pixel\'s mark');
	const y9 = P.Y(lg(pixelTide(true)));
	check(lg(personTide()) < S1 && lg(pixelTide()) > S0, 'a mark leaves the strip');
	// the bracket from 6.5 up to 9.2 x 10^-14, right of the pixel's mark
	const bx = sx + MARK + 1.6;
	S.path([[sx, y9], [sx + MARK, y9]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the mark of the distance' });
	S.path([[sx + MARK, y6], [bx, y6], [bx, y9], [sx + MARK, y9]], { color: DIM, width: HAIR, cap: 'butt', layer: 2, what: 'the bracket' });
	const lx = bx + LABEL_GAP + 1;
	// each name in two lines, the first centred on its mark (the pair at the pixel above and below the bracket's ends)
	const two = async (a, b, y, below = 0, color = INK) => {
		const first = await placed(`\\text{${a}}`, lx, y, 0, below ? 0 : 0.5, color);
		const second = await placed(b, lx, first.box.b + 2.2, 0, 0, color);
		if (below < 0) {
			const h = second.box.b - first.box.t;
			return [await placed(`\\text{${a}}`, lx, y - h, 0, 0, color), await placed(b, lx, y - (second.box.b - second.box.t), 0, 0, color)];
		}
		return [first, second];
	};
	L.push(...(await two('the person,', '9.3\\times10^{-9}', yP)));
	L.push(...(await two('gradiometer, 0.02 E in 1 s,', '2\\times10^{-11}', yG)));
	L.push(...(await two('the distance of the two,', '9.2\\times10^{-14}', y9 - 1.5, -1, DIM)));
	L.push(...(await two('the SQL pixel,', '6.5\\times10^{-14}', y6 + 1.5, 1)));
	check((personTide() / 1e-9).toFixed(1) === '9.3' && (pixelTide() / 1e-14).toFixed(1) === '6.5' && (pixelTide(true) / 1e-14).toFixed(1) === '9.2', 'the strip\'s numbers');

	S.checkAll(L);
	window[name + '-numbers'] = { sigma0: s0, sql, tides: [personTide(), GRADIOMETER, pixelTide(), pixelTide(true)] };
	return finish(S, L, [280, 340]);
}
