/**
 * Chapter 4.5's sum rule: a body whose answer to the tide h = xy is a sum of up to three damped oscillators, its
 * lines,
 *
 *   χ_h(ω) = Σ c_n² / (ω_n² − ω² − iΓ_nω),
 *
 * each with its frequency ω_n, its damping rate Γ_n = ω_n/Q_n and its weight c_n². Its line of power is
 *
 *   ω Im χ_h = Σ c_n² Γ_n ω² / [(ω_n² − ω²)² + Γ_n²ω²],
 *
 * each line exactly c_n²/Γ_n high at ω_n, and each with the area (π/2)c_n² whatever its Γ_n. So the area times 2/π is
 * Σc_n², which the weights keep equal to A = ∫ρ|∇h|² dV: (2/5)MR² for the paper's uniform steel ball of 32.9 kg and
 * 10 cm, (2/3)MR² for a thin shell of the same mass and radius. The slow end's sum gives the static compliance
 * χ_h(0) = Σc_n²/ω_n² (eq:static-sum), and far above every line −ω²χ_h tends to A (eq:dust-limit).
 *
 * Frequencies are in units of ω₀, weights in kg m², so ω Im χ_h is in kg m² per ω₀ and χ_h(0) in kg m² per ω₀². The
 * areas are found by quadrature, not from the closed form, so that the readout is a count and not a promise.
 */

/** The paper's steel ball: 32.9 kg, radius 10 cm. */
export const MASS = 32.9;
export const RADIUS = 0.1;

export type Body = 'ball' | 'shell';

/** A = ∫ρ|∇h|² dV for h = xy, kg m²: (2/5)MR² for the uniform ball, (2/3)MR² for the thin shell; they stand as 3 : 5. */
export const TOTAL: Record<Body, number> = {
	ball: 0.4 * MASS * RADIUS * RADIUS,
	shell: (2 / 3) * MASS * RADIUS * RADIUS
};

/** The plot runs over ω from 0 to 4ω₀; a line's frequency is kept from 0.3 to 3.5ω₀ and its Q from 1 to 100. */
export const PLOT_MOST = 4;
export const OMEGA_RANGE = { low: 0.3, high: 3.5, step: 0.01, big: 0.1 };
export const Q_RANGE = { low: 1, high: 100 };
/** Where −ω²χ is read: forty times ω₀, beyond the plot and more than ten times the highest line's frequency. */
export const FAR = 40;
/** At most three lines; none with less than a twentieth of the weight. */
export const MOST_LINES = 3;
export const MIN_SHARE = 0.05;
/** The arrow keys move a boundary of the weights a hundredth, with Shift a tenth. */
export const SHARE_STEP = { small: 0.01, big: 0.1 };

/**
 * The quality factors the arrow keys stop at: 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6 and 8 times a power of ten, as in
 * chapter 4.1's figure, up to 100.
 */
export const QUALITIES = [
	1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100
];

/** One line as the reader sets it: its frequency and damping rate, in ω₀, and its share of the weight A. */
export type Line = { id: number; omega: number; Gamma: number; share: number };
/** A line with its weight c_n², kg m². */
export type Mode = { omega: number; Gamma: number; weight: number };

/** Where the figure opens: one line at ω₀, Q = 10, holding all the weight, in the uniform ball. */
export const OPENING: { lines: Line[]; body: Body } = {
	lines: [{ id: 1, omega: 1, Gamma: 0.1, share: 1 }],
	body: 'ball'
};

/** The lines with their weights c_n² = share × A. */
export const modes = (lines: readonly Line[], body: Body): Mode[] =>
	lines.map((l) => ({ omega: l.omega, Gamma: l.Gamma, weight: l.share * TOTAL[body] }));

export const quality = (m: { omega: number; Gamma: number }) => m.omega / m.Gamma;

// --- the response ---------------------------------------------------------------------------------------------------

/** One line of power, c²Γω²/[(ω_n² − ω²)² + Γ²ω²], kg m² per ω₀. */
export function powerLine(omega: number, m: Mode): number {
	const a = m.omega * m.omega - omega * omega;
	const b = m.Gamma * omega;
	return (m.weight * m.Gamma * omega * omega) / (a * a + b * b);
}

/** The whole line of power ω Im χ_h, kg m² per ω₀. */
export const power = (omega: number, ms: readonly Mode[]) =>
	ms.reduce((s, m) => s + powerLine(omega, m), 0);

/** The height of a line at its own frequency, where it is largest: c²/Γ. */
export const lineHeight = (m: Mode) => m.weight / m.Gamma;

/** The complex response χ_h(ω) = Σ c²/(ω_n² − ω² − iΓω), kg m² per ω₀². */
export function chi(omega: number, ms: readonly Mode[]) {
	let re = 0;
	let im = 0;
	for (const m of ms) {
		const a = m.omega * m.omega - omega * omega;
		const b = m.Gamma * omega;
		const d = a * a + b * b;
		re += (m.weight * a) / d;
		im += (m.weight * b) / d;
	}
	return { re, im };
}

// --- the areas, by quadrature -----------------------------------------------------------------------------------------

/**
 * ∫ g dθ from a to b by adaptive Simpson's rule: 32 panels to start, each halved until its two halves agree with it
 * to `tolerance`, the difference added back as Richardson's correction.
 */
function adaptive(g: (t: number) => number, a: number, b: number, tolerance: number): number {
	const simpson = (fa: number, fm: number, fb: number, h: number) => (h / 6) * (fa + 4 * fm + fb);
	const step = (
		x0: number,
		x1: number,
		f0: number,
		fm: number,
		f1: number,
		whole: number,
		tol: number,
		depth: number
	): number => {
		const m = (x0 + x1) / 2;
		const l = g((x0 + m) / 2);
		const r = g((m + x1) / 2);
		const left = simpson(f0, l, fm, m - x0);
		const right = simpson(fm, r, f1, x1 - m);
		const diff = left + right - whole;
		if (depth <= 0 || Math.abs(diff) <= 15 * tol) return left + right + diff / 15;
		return (
			step(x0, m, f0, l, fm, left, tol / 2, depth - 1) +
			step(m, x1, fm, r, f1, right, tol / 2, depth - 1)
		);
	};
	const panels = 32;
	const h = (b - a) / panels;
	let sum = 0;
	for (let i = 0; i < panels; i++) {
		const x0 = a + i * h;
		const x1 = x0 + h;
		const f0 = g(x0);
		const fm = g(x0 + h / 2);
		const f1 = g(x1);
		sum += step(x0, x1, f0, fm, f1, simpson(f0, fm, f1, h), tolerance / panels, 40);
	}
	return sum;
}

/**
 * ∫ f dω over a line, from 0 to `upTo`, after the change ω = ω_n + (Γ/2) tan θ, by adaptive Simpson's rule. The
 * line becomes nearly flat in θ, however narrow, and its 1/ω² tail a finite value at θ = π/2; the rule refines where
 * the ends of the range crowd into a little θ. `atInfinity` is the limit of f dω/dθ at θ = π/2, and `size` the
 * expected size of the answer, which sets the tolerance at a part in 10¹².
 */
function overLine(
	f: (omega: number) => number,
	m: Mode,
	upTo: number,
	atInfinity: number,
	size: number
): number {
	const s = m.Gamma / 2;
	const a = Math.atan(-m.omega / s);
	const open = !Number.isFinite(upTo);
	const b = open ? Math.PI / 2 : Math.atan((upTo - m.omega) / s);
	if (b <= a) return 0;
	const g = (t: number) => {
		if (open && t >= Math.PI / 2) return atInfinity;
		const tan = Math.tan(t);
		return f(m.omega + s * tan) * s * (1 + tan * tan);
	};
	return adaptive(g, a, b, 1e-12 * size);
}

/** The area under one line from 0 to `upTo` (∞ by default), kg m²: (π/2)c² when it runs to ∞. */
export const lineArea = (m: Mode, upTo = Infinity) =>
	overLine((w) => powerLine(w, m), m, upTo, 2 * m.weight, m.weight);

/** The area under the whole line of power from 0 to `upTo`, kg m². */
export const area = (ms: readonly Mode[], upTo = Infinity) =>
	ms.reduce((s, m) => s + lineArea(m, upTo), 0);

/** The sum rule's left side, (2/π)∫₀^∞ ω Im χ_h dω, kg m²: A, wherever the lines lie. */
export const sumRule = (ms: readonly Mode[]) => (2 / Math.PI) * area(ms);

/** The share of a set of lines' area that lies on the plot, from 0 to 4ω₀. */
export const shareShown = (ms: readonly Mode[]) => area(ms, PLOT_MOST) / area(ms);

/** The static compliance from its sum, (2/π)∫₀^∞ Im χ_h/ω dω (eq:static-sum), by quadrature, kg m² per ω₀². */
export const staticSum = (ms: readonly Mode[]) =>
	(2 / Math.PI) *
	ms.reduce(
		(s, m) =>
			s +
			overLine(
				(w) => {
					const a = m.omega * m.omega - w * w;
					const b = m.Gamma * w;
					return (m.weight * m.Gamma) / (a * a + b * b);
				},
				m,
				Infinity,
				0,
				m.weight / (m.omega * m.omega)
			),
		0
	);

/** The static compliance in closed form, χ_h(0) = Σ c_n²/ω_n², kg m² per ω₀². */
export const staticCompliance = (ms: readonly Mode[]) =>
	ms.reduce((s, m) => s + m.weight / (m.omega * m.omega), 0);

/** −ω²χ_h far above every line, at 40ω₀ by default, from the complex χ: its real part and its modulus, kg m². */
export function farAnswer(ms: readonly Mode[], omega = FAR) {
	const c = chi(omega, ms);
	const w2 = omega * omega;
	return { re: -w2 * c.re, im: -w2 * c.im, abs: w2 * Math.hypot(c.re, c.im) };
}

// --- setting the lines --------------------------------------------------------------------------------------------------

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** A frequency on the keys' hundredths of ω₀, inside the range. */
export const snapOmega = (w: number) =>
	clamp(
		Number((Math.round(w / OMEGA_RANGE.step) * OMEGA_RANGE.step).toFixed(2)),
		OMEGA_RANGE.low,
		OMEGA_RANGE.high
	);

/** A damping rate kept to Q from 1 to 100 at the frequency ω: Γ from ω/100 to ω. */
export const keepGamma = (omega: number, Gamma: number) =>
	clamp(Gamma, omega / Q_RANGE.high, omega / Q_RANGE.low);

/** A line moved to a new frequency: its width Γ stays, unless Q would leave 1 to 100. */
export function moveTo(l: Line, omega: number): Line {
	const w = snapOmega(omega);
	return { ...l, omega: w, Gamma: keepGamma(w, l.Gamma) };
}

/** A line given the height y at its frequency, kg m² per ω₀: Γ = c²/y, kept to Q from 1 to 100. */
export function heightTo(l: Line, y: number, body: Body): Line {
	const weight = l.share * TOTAL[body];
	const Gamma = y > 0 ? weight / y : Infinity;
	return { ...l, Gamma: keepGamma(l.omega, Gamma) };
}

/** A line's Q moved `by` stops along the ladder of quality factors: up makes it narrower. */
export function stepQuality(l: Line, by: number): Line {
	const Q = quality(l);
	let i: number;
	if (by > 0) {
		i = QUALITIES.findIndex((q) => q > Q * (1 + 1e-9));
		i = i < 0 ? QUALITIES.length - 1 : i + by - 1;
	} else {
		i = QUALITIES.findLastIndex((q) => q < Q * (1 - 1e-9));
		i = i < 0 ? 0 : i + by + 1;
	}
	const next = QUALITIES[clamp(i, 0, QUALITIES.length - 1)];
	return { ...l, Gamma: l.omega / next };
}

/**
 * The shares with the boundary after line k (the sum of the shares up to it) moved to `at`; only lines k and k + 1
 * change, and neither falls below the least share.
 */
export function moveBoundary(lines: readonly Line[], k: number, at: number): Line[] {
	if (k < 0 || k >= lines.length - 1) return [...lines];
	const before = lines.slice(0, k).reduce((s, l) => s + l.share, 0);
	const pair = lines[k].share + lines[k + 1].share;
	const left = clamp(at - before, MIN_SHARE, pair - MIN_SHARE);
	return lines.map((l, i) =>
		i === k ? { ...l, share: left } : i === k + 1 ? { ...l, share: pair - left } : l
	);
}

/** Where the boundary after line k stands, 0 to 1. */
export const boundary = (lines: readonly Line[], k: number) =>
	lines.slice(0, k + 1).reduce((s, l) => s + l.share, 0);

/**
 * The frequencies a new line tries, in order: the first more than 0.4ω₀ from every line is taken. The first ones
 * lie below 1.75ω₀, so that a new line can still be doubled for the first prediction.
 */
const NEW_AT = [1.6, 0.5, 1.3, 2.5, 3, 3.5, 0.3];

/**
 * A third or fourth line added at Q = 10, given the share 1/(n + 1) of the weight, the others giving it up in
 * proportion to their own. Nothing changes when there are already three.
 */
export function addLine(lines: readonly Line[]): Line[] {
	if (lines.length >= MOST_LINES) return [...lines];
	const n = lines.length;
	const omega =
		NEW_AT.find((w) => lines.every((l) => Math.abs(l.omega - w) > 0.4)) ??
		NEW_AT.find((w) => lines.every((l) => Math.abs(l.omega - w) > 1e-9)) ??
		2;
	const id = Math.max(0, ...lines.map((l) => l.id)) + 1;
	const kept = lines.map((l) => ({ ...l, share: (l.share * n) / (n + 1) }));
	return [...kept, { id, omega, Gamma: omega / 10, share: 1 / (n + 1) }];
}

// --- the drawing ------------------------------------------------------------------------------------------------------

/** The frequencies at which the curve is drawn: evenly over the plot, closer near each line, and each line's own peak. */
export function samples(ms: readonly Mode[], most = PLOT_MOST): number[] {
	const out: number[] = [];
	for (let i = 0; i <= 400; i++) out.push((most * i) / 400);
	for (const m of ms) {
		const lo = Math.max(0, m.omega - 8 * m.Gamma);
		const hi = Math.min(most, m.omega + 8 * m.Gamma);
		// 240 over ω_n ± 8Γ: at Q = 100 they are Γ/15 apart
		for (let i = 0; i <= 240; i++) out.push(lo + ((hi - lo) * i) / 240);
		out.push(m.omega);
	}
	out.sort((a, b) => a - b);
	return out.filter((w, i) => w >= 0 && w <= most && (i === 0 || w - out[i - 1] > 1e-9));
}

/** The highest point of the whole line of power on the plot, kg m² per ω₀. */
export function tallest(ms: readonly Mode[]): number {
	let most = 0;
	for (const w of samples(ms)) most = Math.max(most, power(w, ms));
	return most;
}

/** The tops of the vertical axis, kg m² per ω₀, each with the step of its ticks. */
export const AXIS_TOPS = [0.1, 0.15, 0.2, 0.3, 0.4, 0.6, 0.8]
	.flatMap((t) => [1, 10, 100].map((p) => t * p))
	.filter((t) => t <= 80 + 1e-9)
	.sort((a, b) => a - b)
	.map((t) => {
		const top = Number(t.toPrecision(2));
		const e = 10 ** Math.floor(Math.log10(top) + 1e-9);
		const m = top / e;
		const step = (m <= 1 ? 0.2 : m <= 2 ? 0.5 : m <= 4 ? 1 : 2) * e;
		return { top, step: Number(step.toPrecision(2)) };
	});

/**
 * The axis for a picture, fitted so that the shell's version of it would still leave a tenth of room: the switch to
 * the shell then makes every line taller on the same axis, and the ball's lines have room to grow.
 */
export function axisFor(lines: readonly Line[]) {
	const h = tallest(modes(lines, 'shell'));
	return AXIS_TOPS.find((r) => h <= 0.92 * r.top) ?? AXIS_TOPS[AXIS_TOPS.length - 1];
}

// --- the predictions ------------------------------------------------------------------------------------------------

/** Whether every line stands within 1.5% of twice the frequency it had when the first prediction was asked. */
export function doubled(lines: readonly Line[], from: ReadonlyMap<number, number>): boolean {
	return (
		lines.length > 0 &&
		lines.every((l) => {
			const f = from.get(l.id);
			return f !== undefined && Math.abs(l.omega / (2 * f) - 1) <= 0.015;
		})
	);
}

/** Whether every line can still be doubled within the range. */
export const doublable = (from: ReadonlyMap<number, number>) =>
	[...from.values()].every((f) => 2 * f <= OMEGA_RANGE.high + 1e-9);

/** A line counts as very broad, for the second prediction, at Q of 1.5 or less. */
export const BROAD_Q = 1.5;
