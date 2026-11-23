// Shared tools for the five diagrams of the tutorial's chapter 2.6 (tutorial/outside/fourier.md): tut-fourier-hero,
// tut-fourier-bars, tut-fourier-gauss, tut-fourier-comb and tut-fourier-blur. Not a figure itself. The charts take
// chapter 3.1's sheet, axes and labels (figs/tut-prob-lib.js and figs/tut-pot-lib.js, imported, not copied). The
// colours keep one meaning in all five: a pattern along the line (bars, a bump, a row of points) in neutral ink; its
// ripples and their amounts (a partial sum, a transform, a spike in wavenumber) in the first accent (orange); a blur's
// kernel and its transform in the second (blue).
import { INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { n2 } from './tut-pot-lib.js';

export const PATTERN = INK;          // a pattern along the line
export const RIPPLE = ACCENT;        // ripples and their amounts
export const KERNEL = ACCENT2;       // a blur's kernel
export const CURVE = 0.6;            // a curve that is the subject
export const THIN = 0.5;             // a pattern drawn under others
export { INK, DIM, ACCENT, ACCENT2 };

/** Points along the graph of f on [a, b] on the plot P (tut-prob-lib.js, Plot), no two more than `chord` points
 * apart on the page, so that no curve shows a corner at any zoom the site allows. */
export function graph(P, f, a, b, chord = 0.25) {
	const pts = [P.at(a, f(a))];
	let x = a;
	const span = P.x1 - P.x0;
	while (x < b) {
		let dx = (chord / P.w) * span;
		for (let i = 0; i < 20; i++) {
			const x2 = Math.min(b, x + dx);
			const [p0, q0] = P.at(x, f(x)), [p1, q1] = P.at(x2, f(x2));
			if (Math.hypot(p1 - p0, q1 - q0) <= chord) break;
			dx /= 2;
		}
		x = Math.min(b, x + dx);
		pts.push(P.at(x, f(x)));
	}
	return pts;
}

/** The longest step between neighbouring points of a polyline (page points): the check that a curve is fine. */
export const longest = (pts) => pts.slice(1).reduce((m, p, i) => Math.max(m, Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), 0);

/** The largest value of f on [a, b], found on a grid of n steps and refined by golden sections around the best. */
export function peak(f, a, b, n = 20000) {
	let best = a;
	for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; if (f(x) > f(best)) best = x; }
	let lo = Math.max(a, best - (b - a) / n), hi = Math.min(b, best + (b - a) / n);
	const g = (Math.sqrt(5) - 1) / 2;
	for (let i = 0; i < 100; i++) {
		const c = hi - g * (hi - lo), d = lo + g * (hi - lo);
		if (f(c) > f(d)) hi = d; else lo = c;
	}
	const x = (lo + hi) / 2;
	return { x, y: f(x) };
}

export { n2 };
