// Shared numbers for the five diagrams of the tutorial's section 11.1 (tutorial/black-holes/schwarzschild.md):
// tut-schw-clocks, tut-schw-falling-pair, tut-schw-barrier, tut-schw-shadow-angle and tut-schw-ring. Not a figure
// itself. The sheet, strokes, labels and cropping are sections 1.2 to 10.3's (figs/tut-pot-lib.js), the observer's and
// light's colours and their check against app.css section 6.1's (figs/tut-lorentz-lib.js), all imported, not copied.
// The colours: the clock rate in the observer's colour (the chapter colours tau so); every ray and the Einstein rings
// in the light role's colour; the falling pair's stretch and squeeze in the figures' orange and blue (section 1.4's
// tut-tides: ACCENT out along the line, ACCENT2 in across it); everything else in ink and the page's greys. The hole
// is a disc of a fixed near-black, which the site does not swap, edged in ink, so that it is dark in both themes.
//
// Lengths are in GM/c^2, so r_s = 2, the photon sphere is at 3 and b_c = sqrt(27).
//
// The rays: a port of the tested integrator of the chapter's interactive figure (app/src/lib/tutorial/live/
// shadow-and-ring.ts: trace, rayFrom, deflection, shadowEdge, exactRing), which this file cannot import, being plain
// JavaScript in the page. With u = 1/r a ray obeys d^2u/dphi^2 + u = 3u^2 (the derivative of the chapter's orbit
// equation, (du/dphi)^2 = 1/b^2 - u^2 (1 - 2u)), stepped by fourth-order Runge-Kutta in phi until it reaches the
// horizon or infinity. `chapter(check)` checks the port against that module's own test values (b_c = sqrt(27) by
// bisection on capture, the exact ring of 20.20 degrees at 40 GM/c^2 with b = 14.2, the ratios 1.003, 1.031 and 1.18
// of the exact bending to 4GM/bc^2), against the first integral along a drawn ray, and asserts against the chapter's
// own text (outside its comments) every statement that a figure draws or its caption prints.
import { OBS, LIGHT, palette } from './tut-lorentz-lib.js';

export { OBS, LIGHT, palette };

export const DEG = Math.PI / 180;
export const RS = 2;                            // r_s, GM/c^2
export const PHOTON = 3;                        // the photon sphere, 1.5 r_s
export const BC = Math.sqrt(27);                // b_c
export const HOLE = '#0d0c0b';                  // the hole's fill: fixed, not a palette colour, so the site keeps it dark
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the field ---------------------------------------------------------------------------------------------------
/** The clock rate sqrt(1 - r_s/r), x = r/r_s. */
export const rate = (x) => Math.sqrt(1 - 1 / x);
/** The hovering acceleration over Newton's GM/r^2, 1/sqrt(1 - r_s/r), x = r/r_s. */
export const push = (x) => 1 / Math.sqrt(1 - 1 / x);
/** Light's barrier (1 - r_s/r)/r^2 in units of 1/r_s^2, x = r/r_s. */
export const barrier = (x) => (1 - 1 / x) / (x * x);
/** The shadow's radius seen from rest at r > 3 GM/c^2 (the chapter's boxed arcsine). */
export const shadowRadius = (r) => Math.asin((BC / r) * Math.sqrt(1 - RS / r));
/** The angle from the hole at which a camera at rest at r sees the ray of impact parameter b (psi <= 90 degrees). */
export const angleOf = (r, b) => Math.asin(Math.min(1, (b / r) * Math.sqrt(1 - RS / r)));
/** The weak-field ring sqrt(2 r_s/d), d = r. */
export const weakRing = (r) => Math.sqrt((2 * RS) / r);

// ---- the rays (shadow-and-ring.ts, ported) -------------------------------------------------------------------------
/** Where, as a fraction t of the step h, the cubic Hermite through (u0, v0) and (u1, v1) takes the value target. */
function crossing(u0, v0, u1, v1, h, target) {
	const at = (t) => {
		const t2 = t * t, t3 = t2 * t;
		return (2 * t3 - 3 * t2 + 1) * u0 + (t3 - 2 * t2 + t) * h * v0 + (-2 * t3 + 3 * t2) * u1 + (t3 - t2) * h * v1 - target;
	};
	let lo = 0, hi = 1;
	const rising = at(1) > at(0);
	for (let i = 0; i < 60; i++) {
		const mid = (lo + hi) / 2;
		if ((at(mid) < 0) === rising) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}

/**
 * A ray from u = u0, du/dphi = v0 at phi = 0, followed in phi until it reaches the horizon, infinity (or rOut), or has
 * swept maxPhi: { fate: 'horizon' | 'infinity' | 'winding', phi, rMin, points: [[r cos phi, r sin phi], ...] }.
 */
export function trace(u0, v0, { step = 2e-3, maxPhi = 8 * Math.PI, rOut = Infinity, keep = false } = {}) {
	const uOut = Number.isFinite(rOut) ? 1 / rOut : 0;
	const uIn = 1 / RS;
	const acc = (u) => -u + 3 * u * u;
	let u = u0, v = v0, phi = 0, uMax = u0;
	const points = [];
	const add = (uu, p) => { if (keep) points.push([Math.cos(p) / uu, Math.sin(p) / uu]); };
	if (u0 > uOut) add(u0, 0);
	let started = u0 > uOut || v0 > 0;
	while (phi < maxPhi) {
		const h = Math.min(step, (0.05 * Math.max(u, 1e-3)) / Math.max(Math.abs(v), 1e-12));
		const k1u = v, k1v = acc(u);
		const k2u = v + 0.5 * h * k1v, k2v = acc(u + 0.5 * h * k1u);
		const k3u = v + 0.5 * h * k2v, k3v = acc(u + 0.5 * h * k2u);
		const k4u = v + h * k3v, k4v = acc(u + h * k3u);
		const un = u + (h / 6) * (k1u + 2 * k2u + 2 * k3u + k4u);
		const vn = v + (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
		if (un >= uIn) {
			const pc = phi + crossing(u, v, un, vn, h, uIn) * h;
			add(uIn, pc);
			return { fate: 'horizon', phi: pc, rMin: RS, points };
		}
		if (started && un <= uOut) {
			const pc = phi + crossing(u, v, un, vn, h, uOut) * h;
			if (uOut > 0) add(uOut, pc);
			return { fate: 'infinity', phi: pc, rMin: 1 / Math.max(uMax, un), points };
		}
		if (un > uOut) started = true;
		u = un; v = vn; phi += h;
		if (u > uMax) uMax = u;
		add(u, phi);
	}
	return { fate: 'winding', phi, rMin: 1 / uMax, points };
}

/** The ray a camera at rest at r sees at psi from the hole, traced back from the camera. */
export function rayFrom(r, psi, o = {}) {
	const v0 = (Math.sqrt(1 - RS / r) * Math.cos(psi)) / (r * Math.max(Math.sin(psi), 1e-300));
	return trace(1 / r, v0, o);
}
/** The ray that comes in from infinity with impact parameter b, phi measured from its incoming direction. */
export const incoming = (b, o = {}) => trace(0, 1 / b, o);
/** The exact deflection of a ray with b > b_c. */
export function deflection(b, step = 1e-3) {
	const ray = trace(0, 1 / b, { step });
	return ray.fate === 'infinity' ? ray.phi - Math.PI : NaN;
}
/** The shadow's edge from rest at r: the arcsine outside the photon sphere, past 90 degrees inside it. */
export function shadowEdge(r) {
	const a = r > PHOTON ? shadowRadius(r) : Math.asin(Math.min(1, (BC * Math.sqrt(1 - RS / r)) / r));
	return r >= PHOTON ? a : Math.PI - a;
}
/** The exact ring seen from rest at r: the psi whose ray sweeps 180 degrees on its way back to infinity. */
export function exactRing(r, step = 2e-3) {
	let lo = shadowEdge(r), hi = Math.PI;
	for (let i = 0; i < 56; i++) {
		const mid = (lo + hi) / 2;
		const ray = rayFrom(r, mid, { step, maxPhi: 4 * Math.PI });
		if (ray.fate !== 'infinity' || ray.phi > Math.PI) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}
/** The impact parameter of the ray seen at psi from rest at r. */
export const impactOf = (r, psi) => (r * Math.sin(psi)) / Math.sqrt(1 - RS / r);

/** The first integral (du/dphi)^2 = 1/b^2 - u^2 (1 - 2u) along a kept ray: its largest error between neighbours. */
export function firstIntegral(points, b) {
	let worst = 0;
	for (let i = 1; i < points.length; i++) {
		const [p, q] = [points[i - 1], points[i]];
		const up = 1 / Math.hypot(...p), uq = 1 / Math.hypot(...q);
		let dphi = Math.atan2(q[1], q[0]) - Math.atan2(p[1], p[0]);
		dphi -= 2 * Math.PI * Math.round(dphi / (2 * Math.PI));
		if (Math.abs(dphi) < 1e-4) continue;
		const slope = (uq - up) / dphi, m = (up + uq) / 2;
		worst = Math.max(worst, Math.abs(slope * slope - (1 / (b * b) - m * m * (1 - 2 * m))) * b * b);
	}
	return worst;
}

/** A page polyline thinned so that neighbouring points are at least `chord` points apart (its ends kept): the curve
 * stays smooth at any zoom the site allows, and the file small. */
export function thin(pts, chord = 0.2) {
	const out = [pts[0]];
	for (let i = 1; i < pts.length - 1; i++) {
		const q = out[out.length - 1];
		if (Math.hypot(pts[i][0] - q[0], pts[i][1] - q[1]) >= chord) out.push(pts[i]);
	}
	out.push(pts[pts.length - 1]);
	return out;
}

// ---- the falling pairs: E = 1, d^2 r / d tau^2 = -GM/r^2 exactly ---------------------------------------------------
/** r at the proper time tau of a body falling from far away, at r0 at tau = 0: r^{3/2} = r0^{3/2} - (3/sqrt 2) tau. */
export const fall = (r0, tau) => (r0 ** 1.5 - (3 / Math.SQRT2) * tau) ** (2 / 3);
/** The proper time at which that body reaches r. */
export const fallTime = (r0, r) => (Math.SQRT2 / 3) * (r0 ** 1.5 - r ** 1.5);

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	const md = await (await fetch('/tutorial/black-holes/schwarzschild.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- the clocks and the hovering camera
	has(r`$$\frac{\dd\obs\tau}{\dd t} = \sqrt{1 - \frac{r_s}{r}}$$`, 'the clock rate');
	has(r`The rate falls to zero at $r = r_s$: seen from far away, a clock held there would stop`, 'the stopped clock');
	has(r`$$\boxed{\;a = \frac{G\matter M}{r^2\sqrt{1 - r_s/r}}\;} .$$`, 'the hovering acceleration');
	has(r`**Limit:** far away it is Newton's $G\matter M/r^2$. As $r \to r_s$ it grows without limit`, 'the limits of a');
	for (const x of [1.0001, 1.5, 2, 3, 6, 50]) check(near(rate(x) * push(x), 1, 1e-12), `rate times push at ${x}`);
	check(near(push(4 / 3), 2, 1e-15) && near(rate(4 / 3), 0.5, 1e-15), 'the push is 2 at 4r_s/3');

	// ---- the tide
	has(r`$$\frac{\dd^2r}{\dd\obs\tau^2} = -\frac{G\matter M}{r^2}\quad\text{exactly.}`, 'the exact fall');
	has(r`$$\frac{\dd^2\xi}{\dd\obs\tau^2} = \delta\varphi\,\frac{\dd^2r}{\dd\obs\tau^2} = -\frac{G\matter M}{r^3}\,\xi ,$$`, 'the squeeze across');
	has(r`along the third axis, the line to the hole, is $-2G\matter M/r^3$: a stretch of $2G\matter M/r^3$`, 'the stretch along');
	has(r`On the sphere through them the metric's $r^2\dd\varphi^2$ makes their separation $\xi = r\,\delta\varphi$`, 'the gap r delta phi');
	// the closed form of the fall: d^2 r / d tau^2 = -1/r^2 and (dr/dtau)^2 = 2/r (E = 1)
	for (const [r0, t] of [[17, 3], [12, 10], [9, 1]]) {
		const h = 1e-3, a = (fall(r0, t + h) - 2 * fall(r0, t) + fall(r0, t - h)) / (h * h), v = (fall(r0, t + h) - fall(r0, t - h)) / (2 * h);
		const x = fall(r0, t);
		check(Math.abs(a * x * x + 1) < 1e-5 && Math.abs((v * v * x) / 2 - 1) < 1e-8, `the fall from ${r0} at ${t}`);
		check(near(fall(r0, fallTime(r0, x)), x, 1e-9), 'fallTime is not the inverse of fall');
	}

	// ---- light: the barrier, the photon sphere and b_c
	has(r`$$\frac{\dd\varphi}{\dd r} = \pm\frac{1}{r^2\sqrt{1/b^2 - \field f(r)/r^2}} . \label{eq:orbit}$$`, 'the orbit equation');
	has(r`The ray can reach $r$ only where $(1 - r_s/r)/r^2 \le 1/b^2$. This **barrier** is zero at the horizon`, 'the barrier');
	has(r`at $r = \tfrac32r_s = 3G\matter M/c^2$, the **photon sphere**, where light can circle the hole`, 'the photon sphere');
	has(r`$$\frac{1 - \tfrac23}{(\tfrac32r_s)^2} = \frac{4}{27r_s^2} ,$$`, 'the peak\'s height');
	has(r`$$\sym{critical-impact-parameter}{b_c} = \tfrac32\sqrt3\,r_s = \sqrt{27}\,\frac{G\matter M}{c^2} .$$`, 'b_c');
	has(r`Rays with $b > b_c$ turn at the barrier and leave; rays with $b < b_c$ pass over it and fall in; a ray with $b = b_c$ circles the photon sphere for ever`, 'the three fates');
	{
		// the peak, by golden sections, and its height
		const g = (Math.sqrt(5) - 1) / 2;
		let a = 1.0001, b = 10;
		for (let i = 0; i < 200; i++) { const c = b - g * (b - a), d = a + g * (b - a); if (barrier(c) > barrier(d)) b = d; else a = c; }
		const peak = (a + b) / 2;
		check(near(peak, 1.5, 1e-7) && near(barrier(1.5), 4 / 27, 1e-15), `the barrier peaks at ${peak}`);
		check(near(1 / Math.sqrt(barrier(1.5) / (RS * RS)), BC, 1e-12) && near(BC / RS, 1.5 * Math.sqrt(3), 1e-15), 'b_c from the peak');
		check((BC / RS).toFixed(1) === '2.6', 'b_c = 2.6 r_s');
	}
	{
		// the port: b_c by bisection on capture (the module's test), the ring, the bending ratios
		let lo = 4, hi = 7;
		for (let i = 0; i < 40; i++) { const b = (lo + hi) / 2; if (trace(0, 1 / b, { step: 1e-3, maxPhi: 40 * Math.PI }).fate === 'horizon') lo = b; else hi = b; }
		check(Math.abs((lo + hi) / 2 - BC) < 5e-6, `capture stops at b = ${(lo + hi) / 2}, not sqrt 27`);
		const ratio = (b) => deflection(b) / (4 / b);
		check(ratio(1000).toFixed(3) === '1.003' && ratio(100).toFixed(3) === '1.031' && ratio(20).toFixed(2) === '1.18', `the ratios ${[1000, 100, 20].map(ratio)}`);
		check(ratio(100).toFixed(4) === '1.0306' && ratio(20).toFixed(3) === '1.181', 'the ratios to more places');
		has(r`At $b = 1000$, 100 and $20\,G\matter M/c^2$ it is 1.003, 1.031 and 1.18 times $4G\matter M/bc^2$`, 'the ratios');
		const near12 = trace(0, 1 / 12, { step: 1e-3, keep: true });
		check(firstIntegral(near12.points, 12) < 1e-5, `the first integral along b = 12: ${firstIntegral(near12.points, 12)}`);
	}

	// ---- the shadow and the ring at 40 GM/c^2
	has(r`$$\sin\psi = \frac{b}{r}\sqrt{1 - \frac{r_s}{r}} .$$`, 'sin psi');
	has(r`At $40\,G\matter M/c^2$ it is $7.27°$`, 'the shadow at 40');
	has(r`It gives $b = 14.2\,G\matter M/c^2$, and $\sin\psi = (b/r)\sqrt{\field f}$ gives $20.2°$`, 'the exact ring');
	has(r`The weak formula, with $d = 40\,G\matter M/c^2$, gives $18.1°$, 10% short`, 'the weak ring');
	has(r`$$\boxed{\;\sym{einstein-radius}{b_E} = \sqrt{2r_sd}\;} ,$$`, 'the Einstein radius');
	has(r`and sees them as the **Einstein ring** round the mass, at the angle $b_E/d = \sqrt{2r_s/d}$`, 'the ring\'s angle');
	has(r`a ray at $b$, turned toward the axis by $2r_s/b$, crosses it at the distance $b^2/2r_s$`, 'the line of foci');
	const shadow40 = shadowEdge(40), ring40 = exactRing(40), weak40 = weakRing(40);
	check((shadow40 / DEG).toFixed(2) === '7.27' && (shadow40 / DEG).toFixed(3) === '7.274', `the shadow at 40: ${shadow40 / DEG}`);
	check((ring40 / DEG).toFixed(2) === '20.20' && impactOf(40, ring40).toFixed(1) === '14.2', `the ring at 40: ${ring40 / DEG}, b = ${impactOf(40, ring40)}`);
	check((weak40 / DEG).toFixed(1) === '18.1' && (weak40 / DEG).toFixed(2) === '18.12', `the weak ring at 40: ${weak40 / DEG}`);
	{
		// the ring's ray sweeps 180 degrees to infinity; the shadow's edge separates capture from escape
		const ray = rayFrom(40, ring40, { step: 1e-3 });
		check(ray.fate === 'infinity' && Math.abs(ray.phi - Math.PI) < 1e-6, `the ring's ray sweeps ${ray.phi}`);
		for (const R of [16, 40]) {
			const e = shadowEdge(R);
			check(rayFrom(R, e - 1e-4, { maxPhi: 40 * Math.PI }).fate === 'horizon' && rayFrom(R, e + 1e-4, { maxPhi: 40 * Math.PI }).fate === 'infinity', `the shadow's edge at ${R}`);
		}
	}

	/** Whether the diagram `name` is drawn (its figure line, with the caption `caption`) or still planned (its comment). */
	const state = (name, id, caption) => {
		const drawn = flat.includes(`](${name}){#fig:${id}}`);
		const planned = comments.some((c) => c.includes(`diagram: ${name} `));
		check(drawn !== planned, `the diagram ${name} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) has(`![${caption}](${name}){#fig:${id}}`, `the caption of ${name}`);
		return drawn;
	};
	return { md, flat, has, state, shadow40, ring40, weak40 };
}
