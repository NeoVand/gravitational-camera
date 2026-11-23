/**
 * Chapter 6.1's boost along a line. A pixel moves along the room's x axis with the rapidity η, so that
 *
 *   β = tanh η,   γ = cosh η,   γβ = sinh η,
 *
 * and the chapter's eq:lorentz, written with the rapidity, carries the room's (ct, x) of an event to the pixel's:
 *
 *   ct′ = cosh η · ct − sinh η · x,   x′ = −sinh η · ct + cosh η · x.
 *
 * Distances are in light-seconds and times in seconds, so that c = 1 light-second per second and ct, in
 * light-seconds, is the time in seconds. The events stand on a grid of twentieths of a light-second and are kept as
 * whole numbers of its steps, so that whether light can connect two of them, and the sign of their interval, are
 * decided without rounding. At a rapidity that is a whole number k of ln 2, e^η = 2^k, and the hyperbolic functions
 * are formed from powers of two: cosh(ln 2) = 5/4 and sinh(ln 2) = 3/4 exactly, as the chapter's numbers are.
 */

/** The step of the events' grid, light-seconds. */
export const GRID = 0.05;
/** The events stay within this many steps of the origin: ±2 light-seconds. */
export const REACH = 40;
/** The drawing shows the room from −SPAN to SPAN light-seconds on both axes. */
export const SPAN = 2.25;

/** The rapidity slider: its range, its step, the arrow keys' step, and how near a named value it lands on it. */
export const RAPIDITY = { min: -2, max: 2, step: 0.01, key: 0.05, page: 0.5, snap: 0.0075 };

export const LN2 = Math.LN2;
/** The rapidities the slider lands on exactly: rest, the paper's pixel at 0.6c, and two such boosts. */
export const NAMED = [-2 * LN2, -LN2, 0, LN2, 2 * LN2];

/** An event, in steps of the grid: n for ct, m for x. */
export type Event = { n: number; m: number };

/** The two flashes of the chapter: A beside the pixel, B a light-second farther along its path, at t = 0. */
export const FLASH_A: Event = { n: 0, m: 0 };
export const FLASH_B: Event = { n: 0, m: 20 };

export const OPENING = { eta: LN2, second: LN2, a: FLASH_A, b: FLASH_B };

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** The whole number k with η = k ln 2, if η is one (to the last bits of a double), for |k| ≤ 8. */
export function lnTwos(eta: number): number | undefined {
	const k = Math.round(eta / LN2);
	if (Math.abs(k) > 8) return undefined;
	return Math.abs(eta - k * LN2) <= 1e-12 * Math.max(1, Math.abs(eta)) ? k : undefined;
}

/** cosh η, sinh η and tanh η; from powers of two when η is a whole number of ln 2. */
export function hyper(eta: number): { cosh: number; sinh: number; tanh: number } {
	const k = lnTwos(eta);
	if (k !== undefined) {
		const p = 2 ** k;
		const q = 4 ** k;
		return { cosh: (p + 1 / p) / 2, sinh: (p - 1 / p) / 2, tanh: (q - 1) / (q + 1) };
	}
	return { cosh: Math.cosh(eta), sinh: Math.sinh(eta), tanh: Math.tanh(eta) };
}

/** β = tanh η, γ = cosh η and γβ = sinh η of a pixel. */
export function pixel(eta: number) {
	const h = hyper(eta);
	return { beta: h.tanh, gamma: h.cosh, gammaBeta: h.sinh };
}

/** The rapidity of a speed, η = ½ ln[(1 + β)/(1 − β)]. */
export const rapidity = (beta: number) => Math.atanh(beta);

/** β = tanh η as a fraction, when η = k ln 2: (4^k − 1)/(4^k + 1), so 3/5 at ln 2 and 15/17 at ln 4. */
export function betaFraction(eta: number): [number, number] | undefined {
	const k = lnTwos(eta);
	if (k === undefined || k === 0) return undefined;
	const q = 4 ** Math.abs(k);
	return [Math.sign(k) * (q - 1), q + 1];
}

/** γ = cosh η as a fraction, when η = k ln 2: (4^k + 1)/2^{k+1}, so 5/4 at ln 2 and 17/8 at ln 4. */
export function gammaFraction(eta: number): [number, number] | undefined {
	const k = lnTwos(eta);
	if (k === undefined || k === 0) return undefined;
	const a = Math.abs(k);
	return [4 ** a + 1, 2 ** (a + 1)];
}

/** The light-seconds of an event: ct and x. */
export const place = (e: Event) => ({ ct: e.n * GRID, x: e.m * GRID });

/** The pixel's ct′ and x′ of a point (ct, x) of the room, by the chapter's eq:lorentz with β = tanh η. */
export function boost(eta: number, p: { ct: number; x: number }) {
	const { cosh, sinh } = hyper(eta);
	return { ct: cosh * p.ct - sinh * p.x, x: -sinh * p.ct + cosh * p.x };
}

/** The pixel's ct′ and x′ of an event. */
export const seen = (eta: number, e: Event) => boost(eta, place(e));

/** The room's interval between two events, −c²Δt² + Δx², in light-seconds squared: exact, from whole steps. */
export function interval(a: Event, b: Event): number {
	const dn = b.n - a.n;
	const dm = b.m - a.m;
	return (dm * dm - dn * dn) * GRID * GRID;
}

/**
 * The pixel's interval, −c²Δt′² + Δx′², from its own Δct′ and Δx′, written as (Δx′ − Δct′)(Δx′ + Δct′) so that it
 * is not lost to cancellation when the two are large and nearly equal. Each factor is e^{±η} times the room's.
 */
export function pixelInterval(eta: number, a: Event, b: Event): number {
	const pa = seen(eta, a);
	const pb = seen(eta, b);
	const dct = pb.ct - pa.ct;
	const dx = pb.x - pa.x;
	return (dx - dct) * (dx + dct);
}

/** The interval through an event from the origin, −c²t² + x²: the hyperbola drawn through it. */
export const fromOrigin = (e: Event) => interval({ n: 0, m: 0 }, e);

export type Kind = 'space' | 'light' | 'time' | 'same';

/** Whether light can connect two events: timelike, on light's path, or not (spacelike); decided on whole steps. */
export function kind(a: Event, b: Event): Kind {
	const dn = Math.abs(b.n - a.n);
	const dm = Math.abs(b.m - a.m);
	if (dn === 0 && dm === 0) return 'same';
	if (dm > dn) return 'space';
	return dm === dn ? 'light' : 'time';
}

/** Light, or anything slower, can go from one to the other. */
export const connectable = (a: Event, b: Event) => {
	const k = kind(a, b);
	return k === 'time' || k === 'light';
};

/** The pixel's Δt′ = t′_B − t′_A, seconds: γ(Δt − βΔx/c). */
export function gap(eta: number, a: Event, b: Event): number {
	const { cosh, sinh } = hyper(eta);
	const dct = (b.n - a.n) * GRID;
	const dx = (b.m - a.m) * GRID;
	return cosh * dct - sinh * dx;
}

export type Order = 'A first' | 'B first' | 'together';

/** The order of two times, B's less A's: zero to the last bits of the numbers is together. */
export function orderOf(dt: number, scale = 1): Order {
	if (Math.abs(dt) <= 1e-12 * Math.max(1, scale)) return 'together';
	return dt < 0 ? 'B first' : 'A first';
}

/** The order the pixel finds for A and B. */
export function order(eta: number, a: Event, b: Event): Order {
	const { cosh } = hyper(eta);
	// the largest Δt′ on the drawing is some 8 cosh η seconds: zero to its last bits is together
	return orderOf(gap(eta, a, b), 8 * cosh);
}

/** The order the room finds. */
export const roomOrder = (a: Event, b: Event): Order => orderOf((b.n - a.n) * GRID);

/**
 * The speed at which Δt′ is zero, β = cΔt/Δx: the order reverses beyond it. It is below light's only when
 * |Δx| > c|Δt|; undefined when Δx = 0.
 */
export function reversingSpeed(a: Event, b: Event): number | undefined {
	const dm = b.m - a.m;
	if (dm === 0) return undefined;
	return (b.n - a.n) / dm;
}

/**
 * The least size of Δt′ over the rapidities from lo to hi. For events a clock can go between, Δt′ is least where
 * tanh η = Δx/cΔt, and there it is the clock's proper time √(c²Δt² − Δx²)/c, which every observer computes alike.
 */
export function leastGap(
	a: Event,
	b: Event,
	lo = RAPIDITY.min,
	hi = RAPIDITY.max
): { least: number; at: number; proper: boolean } {
	const ends = [lo, hi].map((eta) => ({ least: Math.abs(gap(eta, a, b)), at: eta, proper: false }));
	let best = ends[0].least <= ends[1].least ? ends[0] : ends[1];
	if (kind(a, b) === 'time') {
		const dn = b.n - a.n;
		const dm = b.m - a.m;
		const at = Math.atanh(dm / dn);
		if (at >= lo && at <= hi) {
			best = { least: Math.sqrt(dn * dn - dm * dm) * GRID, at, proper: true };
		}
	}
	return best;
}

/** Rapidities add: the second boost, η₂ in the pixel's frame, on top of the first. */
export const added = (eta1: number, eta2: number) => eta1 + eta2;

/** The chapter's eq:addition, β = (β₁ + β₂)/(1 + β₁β₂). */
export const addSpeeds = (b1: number, b2: number) => (b1 + b2) / (1 + b1 * b2);

/** The two boosts, one after the other, applied to a point: the second by η₂ to what the first gives. */
export const twice = (eta1: number, eta2: number, p: { ct: number; x: number }) =>
	boost(eta2, boost(eta1, p));

// --- the slider ------------------------------------------------------------------------------------------------------

/** A rapidity the reader asks for, kept in range and landing exactly on a named one within the snap. */
export function landed(v: number): number {
	const eta = clamp(v, RAPIDITY.min, RAPIDITY.max);
	for (const name of NAMED) if (Math.abs(eta - name) < RAPIDITY.snap) return name;
	return Math.round(eta * 1e6) / 1e6;
}

/** One press of an arrow key: the next point of the key's grid, then landed. */
export function keyed(eta: number, direction: number, step = RAPIDITY.key): number {
	const next = Math.round((eta + direction * step) / step) * step;
	return landed(Math.round(next * 1e9) / 1e9);
}

/** An event moved by whole steps, kept within reach. */
export const moved = (e: Event, dn: number, dm: number): Event => ({
	n: clamp(e.n + dn, -REACH, REACH),
	m: clamp(e.m + dm, -REACH, REACH)
});

/** The event nearest a point of the room, in light-seconds, on the grid and within reach. */
export const snapped = (p: { ct: number; x: number }): Event => ({
	n: clamp(Math.round(p.ct / GRID), -REACH, REACH),
	m: clamp(Math.round(p.x / GRID), -REACH, REACH)
});

export const same = (a: Event, b: Event) => a.n === b.n && a.m === b.m;
export const atFlashes = (a: Event, b: Event) => same(a, FLASH_A) && same(b, FLASH_B);

// --- the predictions ----------------------------------------------------------------------------------------------

/**
 * The first prediction is answered once the reader, with A and B at the two flashes, has set the pixel at rest,
 * η = 0, and then back at ln 2. It keeps what has been seen: at rest, since the flashes were last in place.
 */
export type FirstSeen = { rest: boolean; done: boolean };

export function noteFirst(seen: FirstSeen, eta: number, a: Event, b: Event): FirstSeen {
	if (seen.done) return seen;
	if (!atFlashes(a, b)) return { rest: false, done: false };
	if (eta === 0) return { rest: true, done: false };
	if (seen.rest && lnTwos(eta) === 1) return { rest: true, done: true };
	return seen;
}

/**
 * The second is answered once the reader has reversed the order of two events with the rapidity alone, and then,
 * with two events that light can connect, has slid the rapidity to both ends of its range. Each record is kept for
 * one pair of events and forgotten when either moves.
 */
export type SecondSeen = {
	/** The orders seen for the pair as it now stands. */
	orders: Order[];
	reversed: boolean;
	/** With the pair as it now stands, light able to connect it: the ends of the range reached. */
	low: boolean;
	high: boolean;
	done: { a: Event; b: Event } | undefined;
};

export const SECOND_START: SecondSeen = {
	orders: [],
	reversed: false,
	low: false,
	high: false,
	done: undefined
};

/** How near an end of the range counts as reaching it. */
export const END = 0.05;

export function noteSecond(
	seen: SecondSeen,
	eta: number,
	a: Event,
	b: Event,
	moved: boolean
): SecondSeen {
	if (seen.done) return seen;
	const now = order(eta, a, b);
	const orders = moved ? [now] : seen.orders.includes(now) ? seen.orders : [...seen.orders, now];
	const reversed = seen.reversed || (orders.includes('A first') && orders.includes('B first'));
	const light = connectable(a, b);
	const low = light && ((!moved && seen.low) || eta <= RAPIDITY.min + END);
	const high = light && ((!moved && seen.high) || eta >= RAPIDITY.max - END);
	const done = reversed && low && high ? { a, b } : undefined;
	return { orders, reversed, low, high, done };
}

/** The numbers of the second answer, for the pair that answered it. */
export function secondAnswer(a: Event, b: Event) {
	const dct = (b.n - a.n) * GRID;
	const dx = (b.m - a.m) * GRID;
	const least = leastGap(a, b);
	return {
		dt: dct,
		dx,
		interval: interval(a, b),
		kind: kind(a, b),
		order: roomOrder(a, b),
		least: least.least,
		proper: least.proper,
		/** Δt′ at the two ends of the range. */
		ends: [gap(RAPIDITY.min, a, b), gap(RAPIDITY.max, a, b)] as [number, number]
	};
}

// --- the words -------------------------------------------------------------------------------------------------------

/** A number to three figures, with a true minus sign; zero as 0. */
export function three(v: number): string {
	if (Math.abs(v) < 5e-13) return '0';
	return v.toPrecision(3).replace('-', '−');
}

/** The same for LaTeX. */
export const threeTex = (v: number) => three(v).replace('−', '-');

/** A place on the grid, in light-seconds, to two decimals. */
export function grid(v: number): string {
	const s = (Math.round(v / GRID) * GRID).toFixed(2);
	return s === '-0.00' ? '0.00' : s.replace('-', '−');
}

/** A rapidity, as "ln 2" when it is one, in LaTeX. */
export function etaTex(eta: number): string {
	const k = lnTwos(eta);
	if (k === undefined) return threeTex(eta);
	if (k === 0) return '0';
	const name = Math.abs(k) === 1 ? '\\ln 2' : `\\ln ${2 ** Math.abs(k)}`;
	return `${k < 0 ? '-' : ''}${name} = ${threeTex(eta)}`;
}

/** A fraction and its value, "15/17 = 0.882", or the value alone, in LaTeX. */
export function fractionTex(value: number, f: [number, number] | undefined): string {
	return f ? `${f[0]}/${f[1]} = ${threeTex(value)}` : threeTex(value);
}

// --- the drawing -----------------------------------------------------------------------------------------------------

/**
 * Places for labels along one edge, as near their wishes as they can be without overlapping: each wants `at` and
 * is `size` long; they keep `gap` between them and stay within lo and hi. Their order along the edge is kept.
 */
export function spread(
	wishes: { at: number; size: number }[],
	lo: number,
	hi: number,
	gap: number
): number[] {
	const order = wishes.map((_, i) => i).sort((i, j) => wishes[i].at - wishes[j].at);
	const pos = order.map((i) =>
		clamp(wishes[i].at, lo + wishes[i].size / 2, hi - wishes[i].size / 2)
	);
	const need = (k: number) => (wishes[order[k - 1]].size + wishes[order[k]].size) / 2 + gap;
	for (let pass = 0; pass < 4; pass++) {
		for (let k = 1; k < pos.length; k++) pos[k] = Math.max(pos[k], pos[k - 1] + need(k));
		const last = pos.length - 1;
		if (last >= 0) pos[last] = Math.min(pos[last], hi - wishes[order[last]].size / 2);
		for (let k = last - 1; k >= 0; k--) pos[k] = Math.min(pos[k], pos[k + 1] - need(k + 1));
		if (pos.length) pos[0] = Math.max(pos[0], lo + wishes[order[0]].size / 2);
	}
	const out = new Array<number>(wishes.length);
	order.forEach((i, k) => (out[i] = pos[k]));
	return out;
}

/**
 * The branch of the hyperbola −c²t² + x² = s through an event, as points (ct, x) in light-seconds across the
 * drawing; none when s = 0, where it is the light lines themselves.
 */
export function hyperbola(e: Event, count = 96, span = SPAN): { ct: number; x: number }[] {
	const s = fromOrigin(e);
	if (s === 0) return [];
	const out: { ct: number; x: number }[] = [];
	if (s < 0) {
		const side = Math.sign(e.n);
		for (let j = 0; j <= count; j++) {
			const x = -span + (2 * span * j) / count;
			out.push({ ct: side * Math.sqrt(x * x - s), x });
		}
	} else {
		const side = Math.sign(e.m);
		for (let j = 0; j <= count; j++) {
			const ct = -span + (2 * span * j) / count;
			out.push({ ct, x: side * Math.sqrt(ct * ct + s) });
		}
	}
	return out.filter((p) => Math.abs(p.ct) <= span * 1.6 && Math.abs(p.x) <= span * 1.6);
}

/** The unit hyperbolas −c²t² + x² = ∓(1 light-second)², the upper and right branches: each axis's tick 1 lies on one. */
export function unitHyperbola(which: 'time' | 'space', count = 96, span = SPAN) {
	const out: { ct: number; x: number }[] = [];
	for (let j = 0; j <= count; j++) {
		const a = -span + (2 * span * j) / count;
		const b = Math.sqrt(a * a + 1);
		out.push(which === 'time' ? { ct: b, x: a } : { ct: a, x: b });
	}
	return out.filter((p) => p.ct <= span * 1.6 && p.x <= span * 1.6);
}
