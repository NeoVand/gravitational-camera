// The tutorial, section 7.4 (tutorial/geometry/linearized-gravity.md), its third diagram: the sizes of the entries of the
// field a metre from the 70 kg person walking at 1.4 m s^-1, three bars on a logarithmic axis from 10^-44 to 10^-24:
// "h_00, from the energy" 1.0 x 10^-25; "hbar_0i, from the momentum" 9.7 x 10^-34; "hbar_ij, its motion part
// rho v_i v_j" 4.5 x 10^-42. The bars solid in the field's colour, the longest darkest. Under the third bar a hollow
// bar (an outline in the field's colour) from 10^-44 to the stress of standing on a floor, about 2 x 10^-41. Between consecutive bars a small bracket from the
// right end of one to the right end of the next, named "x 2v/c" and "x v/c"; v/c = 4.7 x 10^-9 printed once below the
// axis. Each bar's value right of its end, never on a bar.
// Departures from the diagram's comment: each bar's name stands above its bar, not left of it (as section 7.3's
// tut-einstein-traces), so that one drawing about 280 points wide gives the twenty decades the whole width and keeps
// its text readable on a phone. The comment's hollow tick is drawn as a whole hollow bar on a line of its own just under
// the third bar, from the axis's start like the others, so that it reads as a length on the scale and not as a key: on
// the third bar's own line the third bar's value, printed right of its end, would cover it (the stress is less than a
// decade beyond the bar's end); its value and name read "about 2 x 10^-41, from the stress of standing on a floor", the
// chapter's number and the comment's words. Each bracket is a step: a short hook down from the upper bar's end, a line across to above
// the lower bar's end, a short hook down to it, its name right of the upper hook. The axis is named "the entry a metre
// from a 70 kg person walking at 1.4 m s^-1", with "logarithmic; v/c = 4.7 x 10^-9" under it.
// Exact: every bar's length, log10 of its entry on the axis (tut-linear-lib.js: h_00 = 2GM/c^2 r, |hbar_0i| =
// 4GMv/c^3 r and the motion part (4G/c^4 r) M v^2, each asserted against the chapter's printed value); the hollow bar's end at
// (4G/c^4 r) M g z_cm with g = 9.8 m s^-2 and z_cm = 1 m, 2.3 x 10^-41, the chapter's "about 2 x 10^-41" (asserted to one
// figure), five times the motion part (asserted); each bracket spans exactly the gap between the two ends, log10 2v/c
// and log10 v/c (asserted); the axis's ticks one a decade. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, HAIR, TICK } from './tut-pot-lib.js';
import { INK } from '../lib.js';
import { chapter, palette, twoFigures, FIELD, MATTER, BETA } from './tut-linear-lib.js';

const name = 'tut-linear-hierarchy';
const check = checker(name);

const LO = -44, HI = -24;                  // the axis's decades
const PER = 12;                            // points per decade
const BAR_H = 6.6;                         // a bar's height (as tut-einstein-traces)
const SHADES = [1, 0.7, 0.48];             // the bars' opacities: the longest darkest
const NAME_AIR = 2.6;                      // a bar's name to the bracket's line above the bar
const STEP_AIR = 3.4;                      // the bracket's line to the bar under it
const HOOK_CLEAR = 0.8;                    // a hook stops this far from its bar
const ROW_AIR = 5.2;                       // a bar to the next bar's name
const BRACKET_W = HAIR + 0.1;
const HOLLOW_LINE = 0.6;                   // the hollow bar's outline
const TICK_AIR = 3.4;                      // the third bar to the hollow bar under it
const MINOR = 1.6;                         // a decade's tick, down from the axis
const AXIS_AIR = 6;                        // the last mark to the axis

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const x0 = ORIGIN - 140;
	const X = (lg) => x0 + (lg - LO) * PER;
	const p = nums.person;
	const h = `{\\color{${FIELD}}h}`, hb = `{\\color{${FIELD}}\\bar h}`, rho = `{\\color{${MATTER}}\\rho}`;
	const B = [
		{ key: 'energy', name: `${h}_{00}\\text{, from the energy}`, v: p.h00, printed: '1.0\\times10^{-25}' },
		{ key: 'momentum', name: `${hb}_{0i}\\text{, from the momentum}`, v: p.hbar0i, printed: '9.7\\times10^{-34}' },
		{ key: 'motion', name: `${hb}_{ij}\\text{, its motion part }${rho}v_iv_j`, v: p.motion, printed: '4.5\\times10^{-42}' }
	];
	const strut = (src) => `\\vphantom{(}${src}`;
	const NH = Math.max(...(await Promise.all(B.map((b) => placed(strut(b.name), 0, 0, 0, 0, INK)))).map((q) => q.box.b - q.box.t));

	// ---- the rows: a name, the bar from 10^-44 to the entry, the value right of the bar's end
	const rows = [];
	let top = ORIGIN - 60;
	for (const [i, b] of B.entries()) {
		const nameLab = await placed(strut(b.name), x0, top - STEP_AIR - NAME_AIR, 0, 1, INK);
		L.push(nameLab);
		const lg = Math.log10(b.v), end = X(lg);
		check(lg > LO && lg < HI, `the ${b.key} bar is off the axis`);
		check(twoFigures(b.v) === b.printed, `the ${b.key} bar prints ${b.printed}, not ${twoFigures(b.v)}`);
		S.raw(`<path d="M${x0.toFixed(2)},${top.toFixed(2)}H${end.toFixed(2)}V${(top + BAR_H).toFixed(2)}H${x0.toFixed(2)}Z" fill="${FIELD}" fill-opacity="${SHADES[i]}"/>`, 2);
		S.boxes.push({ box: { l: x0, r: end, t: top, b: top + BAR_H }, what: `the ${b.key} bar` });
		check(near(end - x0, (lg - LO) * PER, 1e-9), `the ${b.key} bar's length`);
		const value = await placed(b.printed, end + LABEL_GAP + 0.6, top + BAR_H / 2, 0, 0.5, INK);
		L.push(value);
		rows.push({ b, top, end, lg, nameLab, value });
		top += BAR_H + ROW_AIR + NH + NAME_AIR + STEP_AIR;
	}
	check(rows[0].end > rows[1].end && rows[1].end > rows[2].end, 'the bars do not shorten down the table');
	check(SHADES[0] > SHADES[1] && SHADES[1] > SHADES[2], 'the longest bar is not the darkest');

	// ---- the brackets: from the end of each bar down to the end of the next, named by their factor
	const factors = [{ src: '\\times\\,2v/c', ratio: 2 * BETA }, { src: '\\times\\,v/c', ratio: BETA }];
	for (const [i, f] of factors.entries()) {
		const up = rows[i], dn = rows[i + 1];
		// the gap between the two ends is exactly the factor, on the axis
		check(near(dn.lg - up.lg, Math.log10(f.ratio), 1e-9), `the gap ${i + 1} is ${dn.lg - up.lg} decades, not log10 of ${f.ratio}`);
		check(near(up.end - dn.end, -Math.log10(f.ratio) * PER, 1e-9), `the bracket ${i + 1}'s span`);
		const y = dn.top - STEP_AIR, a = up.top + BAR_H + HOOK_CLEAR, c = dn.top - HOOK_CLEAR;
		S.path([[up.end, a], [up.end, y], [dn.end, y], [dn.end, c]], { color: INK, width: BRACKET_W, cap: 'butt', layer: 1, what: `the bracket ${i + 1}` });
		const lab = await placed(f.src, up.end + LABEL_GAP + 1, (a + y) / 2 + 1, 0, 0.5, INK);
		L.push(lab);
		check(dn.nameLab.box.r < dn.end - LABEL_GAP || dn.nameLab.box.b < y - LABEL_GAP, `the bracket ${i + 1} crosses a name`);
	}

	// ---- the hollow bar under the third bar: the stress of standing on a floor, on the same scale from 10^-44
	const third = rows[2];
	const lgS = Math.log10(p.stress), xs = X(lgS);
	check(p.stress.toExponential(0) === '2e-41' && Math.round(p.stress / p.motion) === 5, `the stress ${p.stress}`);
	check(xs > third.end + 2 * HOLLOW_LINE, 'the hollow bar does not reach beyond the third bar');
	check(near(xs - x0, (lgS - LO) * PER, 1e-9), 'the hollow bar\'s length');
	// its row stands under the third bar, its value clear of the third bar's value
	const tickSrc = '\\text{about }2\\times10^{-41}\\text{, from the stress of standing on a floor}';
	const probe = await placed(tickSrc, 0, 0, 0, 0.5, INK);
	const tt = Math.max(third.top + BAR_H + TICK_AIR, third.value.box.b + LABEL_GAP + 0.3 - probe.box.t - BAR_H / 2), o = HOLLOW_LINE / 2;
	S.path([[x0 + o, tt + o], [xs - o, tt + o], [xs - o, tt + BAR_H - o], [x0 + o, tt + BAR_H - o]], { color: FIELD, width: HOLLOW_LINE, closed: true, cap: 'butt', layer: 2, what: 'the hollow bar' });
	const tickLab = await placed(tickSrc, xs + LABEL_GAP + 0.6, tt + BAR_H / 2, 0, 0.5, INK);
	L.push(tickLab);

	// ---- the axis: a line from 10^-44 to 10^-24, a tick each decade, longer and named every fourth
	const yA = tt + BAR_H + AXIS_AIR;
	S.path([[X(LO), yA], [X(HI), yA]], { color: INK, width: AXIS, cap: 'butt', what: 'the axis' });
	let ticks = 0, bottom = yA;
	for (let d = LO; d <= HI; d++) {
		const major = (d - LO) % 4 === 0;
		S.path([[X(d), yA], [X(d), yA + (major ? TICK : MINOR)]], { color: INK, width: HAIR, cap: 'butt', what: `the tick at 10^${d}` });
		ticks++;
		if (major) {
			const lab = await placed(`10^{${d}}`, X(d), yA + TICK + LABEL_GAP + 0.2, 0.5, 0, INK);
			L.push(lab);
			bottom = Math.max(bottom, lab.box.b);
		}
	}
	check(ticks === HI - LO + 1 && near(X(HI) - X(LO), (HI - LO) * PER, 1e-9), `${ticks} ticks`);
	const axisName = await placed('\\text{the entry a metre from a 70 kg person walking at }1.4\\,\\mathrm{m\\,s^{-1}}', (X(LO) + X(HI)) / 2, bottom + 3.6, 0.5, 0, INK);
	L.push(axisName);
	check(BETA.toExponential(1) === '4.7e-9', `v/c ${BETA}`);
	L.push(await placed(`\\text{logarithmic; }v/c = ${twoFigures(BETA)}`, (X(LO) + X(HI)) / 2, axisName.box.b + 2.4, 0.5, 0, INK));

	S.checkAll(L);
	window[name + '-numbers'] = nums;
	return finish(S, L, [250, 300]);
}
