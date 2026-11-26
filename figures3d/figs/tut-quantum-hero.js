// The tutorial's Part 8, its hero (tutorial/quantum/states.md, section 8.1, and the head of 8.2 to 8.7): the camera's
// objects are quantum, and nearly always behave classically. Left, the paper's steel ball of radius 10 cm (chapter
// 4.1's, tut-osc-hero), in polished stone, at room temperature; right, the same ball cold and frosted. Right of each
// ball, its lowest quadrupole mode as a ladder of evenly spaced thin levels, a quantum hbar omega apart, broken (a
// column of three dots) because hundreds of millions of levels are not drawn, and fading upward because it goes on. On
// the warm ball's ladder a wash of matter's colour fills the levels and fades out round a soft band, "about 4 x 10^8
// quanta at 300 K"; on the cold ball's ladder only the lowest level is filled, "zero point, hbar omega / 2". The
// spacing is marked on the cold ladder, "hbar omega". No orange or blue.
// Departures from the diagram's comment: the ladders are broken by a column of three dots between their lowest levels
// and the band, since 4 x 10^8 levels cannot be drawn evenly; the spacing hbar omega is marked once, with a bracket
// beside the cold ladder; the wash is drawn as the thermal state's own probability of reaching each level (below).
// Exact: k_B T / hbar omega = 4.2 x 10^8 at 15 kHz and 300 K, and at the note computed from the ball (tut-quantum-lib.js,
// `chapter`); the wash is P(n' >= n) = (nbar / (nbar + 1))^n, the probability that the thermal mode stands at level n or
// above, which is one far below the mean nbar and falls to 1/e at it; below the break it is drawn level by level (one
// for the warm ball; for the cold ball, at 0.1 microkelvin, one at the lowest level and 7 x 10^-4 at the next, so nothing);
// above the break, on the band's compressed scale, n / nbar runs evenly from U0 to U1 over the drawn levels. Schematic:
// the number of levels drawn, the break, and the scale above it (the caption says the levels are schematic).
// Pictorial: the stone, the picture of tut-osc-hero (design/prompts/hair-sprites.json, cut out by
// design/hair_sprites.py); the frost, made here from that picture: its colour drawn toward a pale grey, a seeded rime
// thicker toward the rim, and seeded six-armed crystals in vector, all clipped to the exact circle.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK, DIM, FAINT, sprite } from '../lib.js';
import { MARGIN } from '../stone.js';
import { STONE_INK } from './tut-orb-lib.js';
import { uniforms } from './tut-prob-lib.js';
import { chapter, palette, MATTER, stack, occupation, omegaOf, NOTE, COLD } from './tut-quantum-lib.js';
import { TEMP } from './tut-osc-lib.js';

const name = 'tut-quantum-hero';
const check = checker(name);

// ---- the drawing (points, y down) --------------------------------------------------------------------------------
const R = 30;                              // the balls' radius
const RIM = 0.35;
const SPRITE = '/figures3d/sprites/hair/ball.png';
const SP = 4.4;                            // the levels' spacing
const LOW = 9;                             // the levels drawn below the break: n = 0 to 8
const BREAK = 4;                           // the break, in spacings, from the last level below it to the first above
const UPPER = 18;                          // the levels drawn above the break
const U0 = 0.3, U1 = 2.7;                  // n / nbar at the lowest and the highest level above the break
const LW = 30;                             // a level's length
const LEVEL = 0.4;                         // a level's stroke
const FILLED = 0.6;                        // a filled level's stroke
const TINT = 0.3;                          // the wash's strongest opacity
const PAD = 2.2;                           // the wash reaches this far beyond the levels' ends
const FADE = [1, 0.12];                    // the levels' opacity, at the foot of the ladder and at its top
const BALL_GAP = 10;                       // from a ball's rim to its ladder
const COLUMN_GAP = 20;                     // from the warm ladder's wash to the cold ball's rim
const BRACKET = { width: 0.45, hook: 2.4, off: 3 };
const SATURATION = 0.3;                    // the cold stone keeps this much of its colour
const LIFT = 0.16;                         // and is lifted this far toward white
const CRYSTALS = 26;                       // the frost's crystals

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];

	// ---- the ladder's places: y of level n below the break, and of level k above it
	const foot = ORIGIN + 70;                                     // the lowest level
	const yLow = (n) => foot - n * SP;
	const yUp = (k) => yLow(LOW - 1) - BREAK * SP - k * SP;
	const top = yUp(UPPER - 1);
	const uOf = (k) => U0 + ((U1 - U0) * k) / (UPPER - 1);
	const kBand = ((1 - U0) / (U1 - U0)) * (UPPER - 1);           // where n = nbar, between drawn levels
	const yBand = yUp(kBand);
	const fade = (y) => FADE[0] + ((FADE[1] - FADE[0]) * (foot - y)) / (foot - top);

	// the probability of standing at level n or above, for a thermal mode of mean occupation nbar
	const reach = (n, nbar) => (nbar / (nbar + 1)) ** n;
	const warm = { nbar: nums.nbar, label: 'warm' };
	const cold = { nbar: occupation(omegaOf(NOTE), COLD), label: 'cold' };
	check(near(reach(0, warm.nbar), 1) && reach(LOW - 1, warm.nbar) > 1 - 1e-7, 'the warm ladder is not full below the break');
	check(near(reach(0, cold.nbar), 1) && reach(1, cold.nbar) < 1e-3, 'the cold ladder is not empty above its lowest level');
	check(Math.abs(reach(warm.nbar, warm.nbar) - Math.exp(-1)) < 1e-8, 'the warm wash is not 1/e at the mean');

	// ---- the stone, once
	const art = await sprite(SPRITE);
	const half = R * (art.w / (art.w - 2 * MARGIN));
	const frosted = await frost(art);
	const defs = `<image id="${name}-stone" class="art" href="${art.href}" x="${n2(-half)}" y="${n2(-half)}" width="${n2(2 * half)}" height="${n2(2 * half)}" preserveAspectRatio="none"/>` +
		`<image id="${name}-frost" class="art" href="${frosted}" x="${n2(-half)}" y="${n2(-half)}" width="${n2(2 * half)}" height="${n2(2 * half)}" preserveAspectRatio="none"/>`;
	const circle = (cx, cy, r) => `M${n2(cx - r)},${n2(cy)}a${n2(r)},${n2(r)} 0 1,0 ${n2(2 * r)},0a${n2(r)},${n2(r)} 0 1,0 ${n2(-2 * r)},0Z`;

	// ---- the two columns: ball, then ladder
	const xWarm = ORIGIN - 150;                                   // the warm ball's centre
	const ballY = yLow(LOW - 1) + 2;                              // both balls' centres
	const columns = [];
	let x = xWarm;
	for (const [i, c] of [warm, cold].entries()) {
		const bx = x, lx = bx + R + BALL_GAP;                      // the ball's centre, the ladder's left end
		S.raw(`<clipPath id="${name}-ball${i}"><path d="${circle(bx, ballY, R)}"/></clipPath>` +
			`<g clip-path="url(#${name}-ball${i})"><use href="#${name}-${i ? 'frost' : 'stone'}" transform="translate(${n2(bx)},${n2(ballY)})"/></g>`, 0);
		if (i) S.raw(crystals(bx, ballY, `${name}-ball${i}`), 0.5);
		S.raw(`<path d="${circle(bx, ballY, R)}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}"/>`, 0.7);
		S.mark(Array.from({ length: 361 }, (_, k) => [bx + R * Math.cos((k * Math.PI) / 180), ballY + R * Math.sin((k * Math.PI) / 180)]), RIM / 2, `ball ${c.label}`);

		// the wash: a rectangle of matter's colour behind the levels, its opacity the probability of reaching the level
		const wy0 = top - SP / 2, wy1 = foot + SP / 2;
		const stops = [];
		const at = (y) => ((y - wy0) / (wy1 - wy0)).toFixed(5);
		// above the break, evenly in n / nbar between levels; across the break, from the last level below to U0
		const upper = (k) => (c.nbar > 1 ? Math.exp(-uOf(k)) : 0);
		for (let k = UPPER - 1; k >= 0; k--) stops.push([at(yUp(k)), upper(k)]);
		for (let n = LOW - 1; n >= 0; n--) {
			const w = reach(n, c.nbar);
			// each level's own band, a flat step from half a spacing below it to half above
			stops.push([at(yLow(n) - SP / 2 + 0.01), w], [at(yLow(n) + SP / 2 - 0.01), w]);
		}
		const grad = `${name}-wash${i}`;
		const stopSvg = stops.map(([o, w]) => `<stop offset="${o}" stop-color="#ffffff" stop-opacity="${Math.max(0, Math.min(1, w)).toFixed(4)}"/>`).join('');
		S.raw(`<linearGradient id="${grad}-g" gradientUnits="userSpaceOnUse" x1="0" y1="${n2(wy0)}" x2="0" y2="${n2(wy1)}">${stopSvg}</linearGradient>` +
			`<mask id="${grad}" maskUnits="userSpaceOnUse" x="${n2(lx - PAD - 1)}" y="${n2(wy0 - 1)}" width="${n2(LW + 2 * PAD + 2)}" height="${n2(wy1 - wy0 + 2)}"><rect x="${n2(lx - PAD)}" y="${n2(wy0)}" width="${n2(LW + 2 * PAD)}" height="${n2(wy1 - wy0)}" fill="url(#${grad}-g)"/></mask>` +
			`<rect x="${n2(lx - PAD)}" y="${n2(wy0)}" width="${n2(LW + 2 * PAD)}" height="${n2(wy1 - wy0)}" fill="${MATTER}" fill-opacity="${TINT}" mask="url(#${grad})"/>`, 0.2);

		// the levels: ink, fading upward; the filled ones (probability over a half) in matter's colour
		const level = (y, w, what) => {
			const filled = w > 0.5;
			S.raw(`<path d="M${n2(lx)},${n2(y)}H${n2(lx + LW)}" stroke="${filled ? MATTER : INK}" stroke-width="${filled ? FILLED : LEVEL}" stroke-opacity="${fade(y).toFixed(3)}" fill="none"/>`, 1);
			S.mark([[lx, y], [lx + LW, y]], (filled ? FILLED : LEVEL) / 2, what);
		};
		for (let n = 0; n < LOW; n++) level(yLow(n), reach(n, c.nbar), `${c.label} level ${n}`);
		for (let k = 0; k < UPPER; k++) level(yUp(k), upper(k), `${c.label} level above ${k}`);
		// the break: three dots in the middle of the gap
		const gapMid = (yLow(LOW - 1) + yUp(0)) / 2;
		for (const d of [-1, 0, 1]) {
			const y = gapMid + d * SP * 0.75;
			S.raw(`<circle cx="${n2(lx + LW / 2)}" cy="${n2(y)}" r="0.55" fill="${INK}" fill-opacity="${fade(y).toFixed(3)}"/>`, 1);
			S.mark([[lx + LW / 2, y]], 0.55, `${c.label} break`);
		}
		S.mark([[lx - PAD, wy0], [lx - PAD, wy1]], 0, `${c.label} wash`);
		S.mark([[lx + LW + PAD, wy0], [lx + LW + PAD, wy1]], 0, `${c.label} wash`);
		columns.push({ bx, lx });
		x = lx + LW + PAD + COLUMN_GAP + R;
	}

	// ---- labels: the warm band, left of the warm ladder above its ball; the zero point and the spacing, the cold one's
	const [W, C] = columns;
	const lines = ['\\text{about } 4\\times10^8 \\text{ quanta}', '\\text{at 300 K}'];
	const probe = await stack(lines, 0, 0, 1, INK);
	L.push(await stack(lines, W.lx - PAD - LABEL_GAP - 0.4, yBand - (probe.box.b - probe.box.t) / 2, 1, INK));
	L.push(await placed('\\text{zero point, } \\hbar\\omega/2', C.lx + LW + PAD + LABEL_GAP + 0.4, yLow(0), 0, 0.5, INK));
	// the spacing: a bracket right of the cold ladder, between its levels 3 and 4
	{
		const bx = C.lx + LW + PAD + BRACKET.off, y0 = yLow(4), y1 = yLow(3);
		S.path([[bx - BRACKET.hook, y0], [bx, y0], [bx, y1], [bx - BRACKET.hook, y1]], { color: DIM, width: BRACKET.width, cap: 'butt', layer: 3, what: 'the spacing' });
		check(near(y1 - y0, SP), 'the bracket is not one spacing');
		L.push(await placed('\\hbar\\omega', bx + BRACKET.width / 2 + LABEL_GAP, (y0 + y1) / 2, 0, 0.5, INK));
	}
	check(TEMP === 300 && nums.ratio.toPrecision(1) === '4e+8', 'the band is not about 4 x 10^8 at 300 K');

	S.checkAll(L);
	window[name + '-numbers'] = { ratio: nums.ratio, nbar: warm.nbar, cold: cold.nbar, kBand };
	return finish(S, L, [240, 340], defs);
}

// ---- the frost ---------------------------------------------------------------------------------------------------
/** The stone's picture, cold: its colour drawn toward a pale grey, and a seeded rime, thicker toward the rim. */
async function frost(art) {
	const img = new Image();
	img.src = art.href;
	await img.decode();
	const c = document.createElement('canvas');
	c.width = art.w; c.height = art.h;
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0);
	const data = ctx.getImageData(0, 0, c.width, c.height);
	const a = data.data;
	const cx = art.w / 2, r = (art.w - 2 * MARGIN) / 2;
	// value noise on two scales, seeded
	const lattice = (cell, seed) => {
		const u = uniforms(seed), n = Math.ceil(art.w / cell) + 2, g = Array.from({ length: n * n }, () => u());
		return (x, y) => {
			const fx = x / cell, fy = y / cell, i = Math.floor(fx), j = Math.floor(fy), tx = fx - i, ty = fy - j;
			const s = (t) => t * t * (3 - 2 * t), v = (p, q) => g[q * n + p];
			const a0 = v(i, j) + (v(i + 1, j) - v(i, j)) * s(tx), a1 = v(i, j + 1) + (v(i + 1, j + 1) - v(i, j + 1)) * s(tx);
			return a0 + (a1 - a0) * s(ty);
		};
	};
	const coarse = lattice(9, 81), fine = lattice(2.2, 82), grain = uniforms(83);
	for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
		const k = (y * c.width + x) * 4;
		if (a[k + 3] === 0) continue;
		const rho = Math.min(1, Math.hypot(x + 0.5 - cx, y + 0.5 - cx) / r);
		const lum = 0.299 * a[k] + 0.587 * a[k + 1] + 0.114 * a[k + 2];
		// cold stone: two thirds of the way to grey, lifted a little toward white, its texture kept
		const pale = (v) => SATURATION * v + (1 - SATURATION) * lum;
		let rgb = [pale(a[k]), pale(a[k + 1]), pale(a[k + 2])].map((v) => (1 - LIFT) * v + LIFT * 240);
		// the rime: fine white grains where the noise is high, more of them toward the rim
		const edge = rho ** 4;
		const n = 0.45 * coarse(x, y) + 0.4 * fine(x, y) + 0.15 * grain();
		const t = Math.max(0, Math.min(1, (n - (0.66 - 0.22 * edge)) * 4)) * (0.35 + 0.55 * edge);
		rgb = rgb.map((v) => v + (252 - v) * t);
		a[k] = rgb[0]; a[k + 1] = rgb[1]; a[k + 2] = rgb[2];
	}
	ctx.putImageData(data, 0, 0);
	return c.toDataURL('image/png');
}

/** Seeded six-armed crystals of frost over the cold ball at (cx, cy), clipped to it, more toward the rim. */
function crystals(cx, cy, clip) {
	const u = uniforms(91);
	const out = [];
	const placed = [];
	let tries = 0;
	while (out.length < CRYSTALS && tries < 20000) {
		tries++;
		const rho = Math.sqrt(u()), t = 2 * Math.PI * u();
		if (u() > 0.25 + 0.75 * rho ** 2) continue;          // more toward the rim
		const x = cx + R * rho * Math.cos(t), y = cy + R * rho * Math.sin(t);
		const s = 0.45 + 0.7 * u(), turn = (Math.PI / 3) * u();
		if (placed.some(([px, py, ps]) => Math.hypot(px - x, py - y) < ps + s + 1.6)) continue;
		placed.push([x, y, s]);
		let d = '';
		for (let k = 0; k < 6; k++) {
			const a = turn + (k * Math.PI) / 3, ex = x + s * Math.cos(a), ey = y + s * Math.sin(a);
			d += `M${n2(x)},${n2(y)}L${n2(ex)},${n2(ey)}`;
		}
		out.push(d);
	}
	return `<g clip-path="url(#${clip})"><path d="${out.join('')}" stroke="#ffffff" stroke-width="0.14" stroke-linecap="round" fill="none" opacity="0.65"/></g>`;
}
