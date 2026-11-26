// Shared numbers for the three diagrams of the tutorial's section 5.2 (tutorial/waves/retarded-waves.md):
// tut-ret-cone, tut-ret-crossing and tut-ret-far. Not a figure itself. The sheet, the strokes, the labels and the
// cropping are section 1.2's (figs/tut-pot-lib.js), the axes section 3.1's (figs/tut-prob-lib.js), the sampling of
// curves section 2.6's (figs/tut-fourier-lib.js) and the dotted zero line and the marked point section 3.6's
// (figs/tut-bessel-lib.js), all imported, not copied. The colours follow the paper's Figure fig:regimes: the near
// field in the second accent (blue), the wave zone in the first (orange); a source is neutral, as nothing special.
//
// `chapter(check)` asserts every number of the chapter that a diagram draws or its caption prints: the slope of
// e^{ikr}/r and its two parts, equal at kr = 1, so that the edge is r = lambda/2pi (47.7 km at 1 kHz); the crossings
// (kr)^n = n! of the first four derivatives, 1, 1.41, 1.82 and 2.21; the second derivative, the tide, with its three
// terms, of which the middle one is the largest for 1 < kr < 2, its outer two crossing at sqrt 2 and its two terms
// that fall faster than 1/r, taken together, crossing the wave term at kr = sqrt(2 + 2 sqrt 2) = 2.2; the pair of
// black holes' 0.3 lambda, kr = 1.9; and the far field's path difference, r - |x - y| -> n.y as r grows.

export const C = 2.998e8;                 // m/s, as the chapter writes it

// ---- the parts of the slope and of the tide, in units of k^2 and k^3, as functions of x = kr --------------------
export const nearPart = (x) => 1 / (x * x);          // |b|/4 pi r^2 over k^2 |b|/4 pi
export const wavePart = (x) => 1 / x;                // k |b|/4 pi r over k^2 |b|/4 pi
export const tideOuter = (x) => 2 / (x * x * x);     // 2/r^3 over k^3
export const tideMiddle = (x) => 2 / (x * x);        // 2k/r^2 over k^3
export const tideWave = (x) => 1 / x;                // k^2/r over k^3: the same function as the slope's wave part
/** The tide's two terms that fall faster than 1/r, taken together: |2/r^3 - 2ik/r^2| over k^3. */
export const tideNear = (x) => Math.hypot(tideOuter(x), tideMiddle(x));
/** Where the tide's near terms, together, equal its wave term: (kr)^4 = 4 + 4 (kr)^2. */
export const TIDE_CROSS = Math.sqrt(2 + 2 * Math.SQRT2);

/** e^{ikr}/r and its first two derivatives along r, [re, im], with k = 1 (so r is kr). */
const cexp = (r) => [Math.cos(r) / r, Math.sin(r) / r];

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- the slope: d/dr e^{ikr}/r = e^{ikr}(-1/r^2 + ik/r), checked by a central difference at k = 1
	const h = 1e-5;
	for (const r of [0.07, 0.6, 1, 2.3, 9.1]) {
		const [a0, b0] = cexp(r - h), [a1, b1] = cexp(r + h);
		const d = [(a1 - a0) / (2 * h), (b1 - b0) / (2 * h)];
		const c = Math.cos(r), s = Math.sin(r);
		// (c + i s)(-1/r^2 + i/r) = (-c/r^2 - s/r) + i(-s/r^2 + c/r)
		const want = [-c / r ** 2 - s / r, -s / r ** 2 + c / r];
		check(near(d[0], want[0], 1e-6 * (1 + Math.abs(want[0]))) && near(d[1], want[1], 1e-6 * (1 + Math.abs(want[1]))), `the slope at kr = ${r}`);
		// the second derivative, e^{ikr}(2/r^3 - 2ik/r^2 - k^2/r)
		const [m0, n0] = cexp(r);
		const dd = [(a1 - 2 * m0 + a0) / (h * h), (b1 - 2 * n0 + b0) / (h * h)];
		// (c + i s)(2/r^3 - 1/r - 2i/r^2) = (2c/r^3 - c/r + 2s/r^2) + i(2s/r^3 - s/r - 2c/r^2)
		const want2 = [2 * c / r ** 3 - c / r + 2 * s / r ** 2, 2 * s / r ** 3 - s / r - 2 * c / r ** 2];
		check(near(dd[0], want2[0], 1e-3 * (1 + Math.abs(want2[0]))) && near(dd[1], want2[1], 1e-3 * (1 + Math.abs(want2[1]))), `the tide at kr = ${r}`);
		// the wave part is kr times the near part
		check(near(wavePart(r) / nearPart(r), r, 1e-12 * r), 'the ratio of the parts is not kr');
	}
	// ---- the edge: equal at kr = 1, r = c/2 pi f; 47,700 km at 1 Hz and 47.7 km at 1 kHz
	check(nearPart(1) === wavePart(1), 'the parts are not equal at kr = 1');
	check((C / (2 * Math.PI) / 1e6).toFixed(1) === '47.7' && (C / (2 * Math.PI * 1e3) / 1e3).toFixed(1) === '47.7', 'the edge at 1 Hz and 1 kHz');
	check((C / (2 * Math.PI) / 1e7).toFixed(2) === '4.77', 'the edge at 1 Hz, 4.77 x 10^7 m');
	// ---- the n-th derivative: near term n!/r^{n+1}, wave term k^n/r, equal at (kr)^n = n!
	let fact = 1;
	const at = [];
	for (let n = 1; n <= 4; n++) { fact *= n; at.push(fact ** (1 / n)); }
	check(at.map((x) => x.toFixed(2)).join(' ') === '1.00 1.41 1.82 2.21', `the crossings ${at}`);
	// ---- the tide: the outer terms cross at sqrt 2, where each is 2/r^3 and the middle one 2 sqrt 2 / r^3
	check(near(tideOuter(Math.SQRT2), tideWave(Math.SQRT2), 1e-15), 'the outer terms do not cross at sqrt 2');
	check(near(tideMiddle(Math.SQRT2) / tideOuter(Math.SQRT2), Math.SQRT2, 1e-15), 'the middle term at sqrt 2');
	// the middle term is the largest exactly for 1 < kr < 2
	for (let x = 0.5; x <= 3; x += 1e-3) {
		const largest = tideMiddle(x) > tideOuter(x) && tideMiddle(x) > tideWave(x);
		check(largest === (x > 1 + 1e-9 && x < 2 - 1e-9) || Math.abs(x - 1) < 2e-3 || Math.abs(x - 2) < 2e-3, `the middle term at kr = ${x}`);
	}
	// the near terms together cross the wave term at sqrt(2 + 2 sqrt 2) = 2.197, the text's 2.2
	check(near(tideNear(TIDE_CROSS), tideWave(TIDE_CROSS), 1e-14) && TIDE_CROSS.toFixed(1) === '2.2' && TIDE_CROSS.toFixed(3) === '2.197', `the groups cross at ${TIDE_CROSS}`);
	check(tideNear(TIDE_CROSS * 0.99) > tideWave(TIDE_CROSS * 0.99) && tideNear(TIDE_CROSS * 1.01) < tideWave(TIDE_CROSS * 1.01), 'the groups do not cross once');
	// the near terms fall as 2/(kr)^3 far inside and as 2/(kr)^2 near the crossing
	check(near(tideNear(0.01) / tideOuter(0.01), 1, 1e-4) && near(tideNear(100) / tideMiddle(100), 1, 1e-4), 'the near terms\' two laws');
	// ---- the pair of black holes: 0.3 lambda is kr = 0.6 pi = 1.885, the text's 1.9
	check((2 * Math.PI * 0.3).toFixed(1) === '1.9', 'kr at 0.3 lambda');
	// ---- the far field: the path from y to x = r n is r - n.y + (y^2 - (n.y)^2)/2r + ..., so r - |x - y| -> n.y
	const n = [Math.cos(0.5), Math.sin(0.5)], y = [0.7, -0.3], ny = n[0] * y[0] + n[1] * y[1], yy = y[0] ** 2 + y[1] ** 2;
	for (const r of [10, 100, 1000]) {
		const path = Math.hypot(r * n[0] - y[0], r * n[1] - y[1]);
		check(Math.abs(path - (r - ny + (yy - ny * ny) / (2 * r))) < 2 / r ** 2 + 1e-12, `the expansion of the path at r = ${r}`);
		check(Math.abs(r - path - ny) <= (yy - ny * ny) / (2 * r) + 2 / r ** 2, `the path difference at r = ${r}`);
	}
	return { tideCross: TIDE_CROSS, crossings: at };
}
