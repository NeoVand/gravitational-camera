// The tutorial, chapter 2.3 (tutorial/outside/multipoles.md), its first diagram: the ceiling of each degree for a
// camera three of a stone's radii away. A bar for each degree l from 0 to 16, its top at (1/3)^l on a logarithmic
// axis from 1 down to 10^-8, in matter's colour; a dashed line at 10^-6, the noise when the monopole is read with
// SNR = 10^6, which passes between the bars of degrees 12 and 13; the bars below it faded. Under each bar the number
// of moments of its degree, 2l + 1, and under the counts of degrees 0 to 12 a bracket with their sum, 169.
// Exact: every bar (its top at log10 of 3^-l, asserted against the axis's ticks), the noise line, the counts, the
// sum 1 + 3 + ... + 25 = 13^2 = 169, and the chapter's numbers: ln 10^6 / ln 3 = 13.8 / 1.10 = 12.6, so that degree
// 12 stands above the noise and degree 13 below it (asserted). Nothing is schematic.
import { INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, AXIS, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { DASH } from './tut-orb-lib.js';

const name = 'tut-mul-ceiling';
const check = checker(name);
// matter's colour of the chapter's equations (app.css, --q-matter), light and dark
const MATTER = 'light-dark(#533f03, #f1dc86)';

// ---- the numbers ------------------------------------------------------------------------------------------------
export const DISTANCE = 3;          // the camera's distance, in radii of the stone
export const SNR = 1e6;             // the monopole's signal-to-noise ratio
export const TOP = 16;              // the last degree drawn
export const LOW = -8;              // the axis's lowest decade
export const ceiling = (l) => DISTANCE ** -l;

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const PITCH = 15.5;                 // from one bar to the next
const BAR = 7.5;                    // a bar's width
const SY = 14.5;                    // points per decade
const FADED = 0.32;                 // the opacity of a bar below the noise
const ROW = 10.5;                   // from the axis to the counts' row, and from it to the degrees' row (centres)
const RUN = 22;                     // the noise line runs this far past the last bar

export default async function () {
	// ---- the chapter's numbers
	const lmax = Math.log(SNR) / Math.log(DISTANCE);
	check(Math.log(SNR).toFixed(1) === '13.8' && Math.log(DISTANCE).toFixed(2) === '1.10' && lmax.toFixed(1) === '12.6', `ln SNR / ln 3 is ${lmax}`);
	check(ceiling(12) > 1 / SNR && ceiling(13) < 1 / SNR, 'the noise does not fall between degrees 12 and 13');
	const above = Array.from({ length: TOP + 1 }, (_, l) => l).filter((l) => ceiling(l) > 1 / SNR);
	const count = above.reduce((s, l) => s + 2 * l + 1, 0);
	check(above.length === 13 && count === 169 && count === 13 ** 2 && 2 * 12 + 1 === 25, `${above.length} degrees and ${count} numbers above the noise`);
	check(ceiling(TOP) > 10 ** LOW, 'the last bar does not reach above the axis');

	const S = new Sheet(name);
	const X0 = ORIGIN - 130, Y0 = ORIGIN + 40;                  // the axes' corner: the left axis at 10^LOW
	const xOf = (l) => X0 + PITCH * (l + 0.5) + 3;
	const yOf = (v) => Y0 - SY * (Math.log10(v) - LOW);
	const right = xOf(TOP) + BAR / 2 + RUN;

	// ---- the bars
	for (let l = 0; l <= TOP; l++) {
		const x = xOf(l), y = yOf(ceiling(l)), faded = ceiling(l) < 1 / SNR;
		check(near(Y0 - y, SY * (-l * Math.log10(DISTANCE) - LOW), 1e-9), `the bar ${l} is not (1/3)^${l}`);
		const box = { l: x - BAR / 2, r: x + BAR / 2, t: y, b: Y0 };
		S.raw(`<path d="M${n2(box.l)},${n2(box.b)}V${n2(box.t)}H${n2(box.r)}V${n2(box.b)}Z" fill="${MATTER}"${faded ? ` opacity="${FADED}"` : ''}/>`, 1);
		S.boxes.push({ box, what: `the bar ${l}` });
	}

	// ---- the axes: the left one with a tick every two decades, labelled; the bottom one under the bars
	const L = [];
	S.path([[X0, Y0], [right, Y0]], { color: DIM, width: AXIS, layer: 2, cap: 'butt', what: 'the bottom axis' });
	S.path([[X0, Y0], [X0, yOf(1)]], { color: DIM, width: AXIS, layer: 2, cap: 'butt', what: 'the left axis' });
	for (let k = 0; k >= LOW; k -= 2) {
		const y = yOf(10 ** k);
		S.path([[X0, y], [X0 - TICK, y]], { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: `the tick at 10^${k}` });
		L.push(await placed(k === 0 ? '1' : `10^{${k}}`, X0 - TICK - 2.4, y, 1, 0.5, DIM));
	}
	check(near(yOf(ceiling(0)), yOf(1), 1e-12), 'the first bar does not reach 1');

	// ---- the noise: a dashed line at 10^-6 across the bars, named above its right end, where the bars are short
	const yn = yOf(1 / SNR);
	S.path([[X0, yn], [right, yn]], { color: INK, width: 0.5, layer: 0, dash: DASH, cap: 'butt', what: 'the noise line' });
	check(yOf(ceiling(12)) < yn && yOf(ceiling(13)) > yn, 'the line does not pass between the bars 12 and 13');
	L.push(await S.clear('\\text{noise at }\\mathrm{SNR} = 10^6', right, yn - 2.6, 1, 1, [0, -1]));

	// ---- the rows under the bars: the degrees l, then the counts 2l + 1; their names at the left; under the counts
	// of the degrees above the noise, a bracket and their sum
	const yl = Y0 + ROW, yc = Y0 + 2 * ROW;
	for (let l = 0; l <= TOP; l++) {
		L.push(await placed(`${l}`, xOf(l), yl, 0.5, 0.5, DIM, 8));
		L.push(await placed(`${2 * l + 1}`, xOf(l), yc, 0.5, 0.5, ceiling(l) > 1 / SNR ? INK : DIM, 8));
	}
	L.push(await placed('\\ell', X0 - TICK - 2.4, yl, 1, 0.5, DIM, 8));
	L.push(await placed('2\\ell + 1', X0 - TICK - 2.4, yc, 1, 0.5, INK, 8));
	const counts = L.filter((x) => /^\d+$/.test(x.src) && x.box.t > yl + 3);
	const yb = Math.max(...counts.map((x) => x.box.b)) + 2.4, x0 = xOf(0) - BAR / 2, x1 = xOf(12) + BAR / 2;
	S.path([[x0, yb], [x0, yb + 2.2], [x1, yb + 2.2], [x1, yb]], { color: INK, width: HAIR, layer: 2, cap: 'butt', what: 'the bracket' });
	L.push(await placed('1 + 3 + \\dots + 25 = 169', (x0 + x1) / 2, yb + 2.2 + 2.6, 0.5, 0, INK, 8));

	// ---- the quantity's name, above the left axis
	L.push(await placed('(1/3)^\\ell', X0, yOf(1) - 5, 0.5, 1, INK));

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
