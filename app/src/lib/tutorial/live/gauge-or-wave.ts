/**
 * Chapter 7.4's gauge or wave. A 5 × 5 grid of rings of twelve free balls, one ring spacing apart, in the linear
 * theory. Lengths are in ring spacings and times in 1/ω, so ω = 1; the four coordinates are x⁰ = ct, x, y, z, and
 * indices are lowered with η = diag(−1, 1, 1, 1).
 *
 * Two things can be laid on flat spacetime. The first is the chapter's pure-gauge relabelling, ζ_x = ε cos(kx − ωt),
 * which by eq:gauge, h′_μν = h_μν − ∂_μζ_ν − ∂_νζ_μ, gives h′_xx = 2εk sin(kx − ωt) and h′_0x = −(εω/c) sin(kx − ωt):
 * a table that ripples along x at the speed ω/k, with no curvature. A ball at rest at x carries the new label
 * x + ε cos(kx − ωt). The second is a real plus-polarized wave travelling along z, out of the screen, in transverse-
 * traceless form, h_xx = −h_yy = h₊ cos(ωz/c − ωt): the balls keep their labels, the metric between them changes,
 * and its tide at the centre is 𝓔_ij = c² R_0i0j = −½ ∂²_t h_ij.
 *
 * Every table here is a sum of plane waves A_μν cos(k_α x^α + φ₀), so the linearized curvature of chapter 7.2,
 * R_αβγδ = ½(∂_β∂_γ h_αδ + ∂_α∂_δ h_βγ − ∂_α∂_γ h_βδ − ∂_β∂_δ h_αγ), is computed in closed form, with ∂_α∂_β
 * bringing down −k_α k_β. The proper separation of two neighbouring balls is read from the metric, to first order:
 * their labels' separation, plus half the table along the line between them, averaged along it exactly.
 */

export type Vec4 = [number, number, number, number];
export type Mat4 = [Vec4, Vec4, Vec4, Vec4];
export type Mat3 = [[number, number, number], [number, number, number], [number, number, number]];
export type Point = [number, number];

/** η_μν, also η^μν. */
export const ETA: Vec4 = [-1, 1, 1, 1];

export const zero4 = (): Mat4 => [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

/** What is left of a sum whose parts cancel: below a part in 10¹⁰ of the inputs, it is zero. */
export const chop = (v: number, size = 1) =>
	Math.abs(v) <= 1e-10 * Math.max(size, 1e-300) ? 0 : v;

const dot4 = (a: Vec4, b: Vec4) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

// --- the figure's numbers ------------------------------------------------------------------------------------------

/** Rings on a side, balls on a ring, and a ring's radius in spacings. */
export const GRID = 5;
export const BALLS = 12;
export const RADIUS = 0.3;

/** ω, in units of itself. */
export const OMEGA = 1;
/** The relabelling's wavenumber, set by the grid: a wavelength of four ring spacings, k = π/2 per spacing. */
export const K = Math.PI / 2;
/** The relabelling ripples along x at ω/k, a tenth of the speed of light: c = 10 ω/k, in spacings per 1/ω. */
export const SPEED = 0.1;
export const C = OMEGA / K / SPEED;
/** One period of ωt on the screen, in seconds. */
export const PERIOD_S = 4;
/** The strain of the waves that LIGO detects, for the scale of the drawing. */
export const LIGO = 1e-21;

/** A slider's range: its own step, an arrow key's step, and a step with Shift. */
export interface Range {
	min: number;
	max: number;
	step: number;
	key: number;
	large: number;
}

/** The gauge shift ε, in ring spacings: εk stays under 1, so the new labels keep their order. */
export const GAUGE: Range = { min: 0, max: 0.3, step: 0.01, key: 0.01, large: 0.05 };
/** The real wave's strain h₊. */
export const WAVE: Range = { min: 0, max: 0.3, step: 0.01, key: 0.01, large: 0.05 };

export interface Settings {
	/** ε, ring spacings. */
	gauge: number;
	/** h₊. */
	wave: number;
	/** ωt, radians. */
	phase: number;
}

/** Opens with the gauge shift at 0.2 and the wave off, at the phase of the wave's largest stretch, playing. */
export const OPENING: Settings = { gauge: 0.2, wave: 0, phase: 0 };

export type View = 'rulers' | 'labels';

// --- plane waves and gauge shifts ----------------------------------------------------------------------------------

/** A table A_μν cos(k_α x^α + φ₀): k with its index down, so that ∂_α of the phase is k_α. */
export interface Plane {
	A: Mat4;
	k: Vec4;
	phase0: number;
}

/** A gauge shift ζ_ν = ε e_ν cos(k_α x^α), its index down. */
export interface Gauge {
	eps: number;
	e: Vec4;
	k: Vec4;
}

/** The event at (x, y) on the screen's plane z = 0, at the phase ωt. */
export const event = (p: Point, phase: number): Vec4 => [(C * phase) / OMEGA, p[0], p[1], 0];

/** ζ_ν at an event. */
export const zetaAt = (g: Gauge, x: Vec4): Vec4 =>
	g.e.map((e) => g.eps * e * Math.cos(dot4(g.k, x))) as Vec4;

/** ∂_μ ζ_ν at an event: −ε k_μ e_ν sin(k·x). */
export const zetaGradient = (g: Gauge, x: Vec4): Mat4 => {
	const s = Math.sin(dot4(g.k, x));
	return g.k.map((km) => g.e.map((en) => -g.eps * km * en * s)) as Mat4;
};

/** eq:gauge: h′_μν = h_μν − ∂_μζ_ν − ∂_νζ_μ, from the table and the gradient of the shift at one event. */
export const gaugeChange = (h: Mat4, dz: Mat4): Mat4 =>
	h.map((row, m) => row.map((v, n) => v - dz[m][n] - dz[n][m])) as Mat4;

/**
 * The table a gauge shift adds, as a plane wave: −∂_μζ_ν − ∂_νζ_μ = ε(k_μ e_ν + k_ν e_μ) sin(k·x), which is
 * −ε(k_μ e_ν + k_ν e_μ) cos(k·x + π/2).
 */
export const gaugePlane = (g: Gauge): Plane => ({
	A: g.k.map((km, m) => g.e.map((en, n) => -g.eps * (km * en + g.k[n] * g.e[m]))) as Mat4,
	k: g.k,
	phase0: Math.PI / 2
});

/** The chapter's shift, ζ_x = ε cos(kx − ωt): k_α = (−ω/c, k, 0, 0), since ∂₀ = c⁻¹∂_t. */
export const figureGauge = (eps: number, k = K, omega = OMEGA, c = C): Gauge => ({
	eps,
	e: [0, 1, 0, 0],
	k: [-omega / c, k, 0, 0]
});

/** A plus-polarized wave along z in transverse-traceless form: h_xx = −h_yy = h₊ cos(ωz/c − ωt). */
export const plusWave = (h: number, omega = OMEGA, c = C): Plane => {
	const A = zero4();
	A[1][1] = h;
	A[2][2] = -h;
	return { A, k: [-omega / c, 0, 0, omega / c], phase0: 0 };
};

/** The planes of the figure's table: the wave's and the relabelling's. */
export const figurePlanes = (s: Settings): Plane[] => [
	plusWave(s.wave),
	gaugePlane(figureGauge(s.gauge))
];

/** The table at an event: the sum of its planes. */
export function table(planes: Plane[], x: Vec4): Mat4 {
	const h = zero4();
	for (const p of planes) {
		const c = Math.cos(dot4(p.k, x) + p.phase0);
		for (let m = 0; m < 4; m++) for (let n = 0; n < 4; n++) h[m][n] += p.A[m][n] * c;
	}
	return h;
}

/** The largest entry in size of the gauge table h′ (2εk for the chapter's), and its time–space entry (εω/c). */
export const gaugeSizes = (eps: number, k = K, omega = OMEGA, c = C) => ({
	xx: 2 * eps * k,
	tx: (eps * omega) / c
});

// --- the curvature -------------------------------------------------------------------------------------------------

/** R_αβγδ[a][b][g][d] at an event, from chapter 7.2's linearized curvature, exact for a sum of plane waves. */
export function riemann(planes: Plane[], x: Vec4): number[][][][] {
	const R = Array.from({ length: 4 }, () =>
		Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => [0, 0, 0, 0]))
	);
	for (const p of planes) {
		// ∂_α∂_β of A cos(φ) is −k_α k_β A cos(φ)
		const f = -0.5 * Math.cos(dot4(p.k, x) + p.phase0);
		const { A, k } = p;
		for (let a = 0; a < 4; a++)
			for (let b = 0; b < 4; b++)
				for (let g = 0; g < 4; g++)
					for (let d = 0; d < 4; d++)
						R[a][b][g][d] +=
							f *
							(k[b] * k[g] * A[a][d] +
								k[a] * k[d] * A[b][g] -
								k[a] * k[g] * A[b][d] -
								k[b] * k[d] * A[a][g]);
	}
	return R;
}

/** The largest component of R_αβγδ in size. */
export const largestComponent = (R: number[][][][]) =>
	Math.max(...R.flat(3).map((v) => Math.abs(v)));

/** The tide 𝓔_ij = c² R_0i0j at an event, in units of ω². */
export function tide(planes: Plane[], x: Vec4, c = C, omega = OMEGA): Mat3 {
	const R = riemann(planes, x);
	return [1, 2, 3].map((i) => [1, 2, 3].map((j) => (c * c * R[0][i][0][j]) / omega ** 2)) as Mat3;
}

/** The figure's tide at the centre, 𝓔_xx / ω². */
export const centreTide = (s: Settings) =>
	chop(tide(figurePlanes(s), event([0, 0], s.phase))[0][0], s.wave + s.gauge * K);

/** −½ ∂²_t h_xx at the centre for the wave alone, ½ h₊ cos ωt, in units of ω²: the check on the tide. */
export const tideCheck = (s: Settings) => 0.5 * s.wave * Math.cos(s.phase);

// --- the balls -----------------------------------------------------------------------------------------------------

export interface Ring {
	/** Its centre, in spacings from the middle of the grid. */
	centre: Point;
	/** Its balls, where they sit in the wave's transverse-traceless labels: at rest there. */
	balls: Point[];
}

/** The 25 rings, row by row from the top, each of twelve balls from angle 0 anticlockwise. */
export const RINGS: Ring[] = Array.from({ length: GRID * GRID }, (_, n) => {
	const half = (GRID - 1) / 2;
	const centre: Point = [(n % GRID) - half, half - Math.floor(n / GRID)];
	return {
		centre,
		balls: Array.from({ length: BALLS }, (_, m) => {
			const a = (2 * Math.PI * m) / BALLS;
			return [centre[0] + RADIUS * Math.cos(a), centre[1] + RADIUS * Math.sin(a)] as Point;
		})
	};
});

/**
 * The pairs of neighbouring balls: those next to each other on a ring, and those facing each other across the gap
 * between two rings side by side or one above the other.
 */
export const PAIRS: [Point, Point][] = (() => {
	const pairs: [Point, Point][] = [];
	RINGS.forEach((r, n) => {
		r.balls.forEach((b, m) => pairs.push([b, r.balls[(m + 1) % BALLS]]));
		const col = n % GRID;
		if (col < GRID - 1) pairs.push([r.balls[0], RINGS[n + 1].balls[BALLS / 2]]);
		if (n + GRID < RINGS.length)
			pairs.push([r.balls[(3 * BALLS) / 4], RINGS[n + GRID].balls[BALLS / 4]]);
	});
	return pairs;
})();

/** The pair the drawing marks: the middle ring's ball at angle 0 and the ball facing it on the ring to its right. */
export const MARKED: [Point, Point] = (() => {
	const mid = (RINGS.length - 1) / 2;
	return [RINGS[mid].balls[0], RINGS[mid + 1].balls[BALLS / 2]];
})();

/** ⟨cos φ⟩ along a line on which φ goes evenly from a to b: cos((a + b)/2) sin(Δ/2)/(Δ/2). */
export function meanCos(a: number, b: number): number {
	const h = (b - a) / 2;
	const sinc = Math.abs(h) < 1e-4 ? 1 - (h * h) / 6 : Math.sin(h) / h;
	return Math.cos((a + b) / 2) * sinc;
}

/**
 * The fractional change, to first order, of the proper separation of two balls at rest at the events a and b on
 * one slice of constant time. Their new labels are a + ζ(a) and b + ζ(b), so the labels' separation changes by
 * n·(ζ(b) − ζ(a)); the metric adds ½ h′_ij n^i n^j, averaged exactly along the line between them. The time–space
 * entries do not enter a separation at one time.
 */
export function separationChange(a: Vec4, b: Vec4, planes: Plane[], gauges: Gauge[]): number {
	const d = [1, 2, 3].map((i) => b[i] - a[i]);
	const L = Math.hypot(d[0], d[1], d[2]);
	const n = d.map((v) => v / L);
	let labels = 0;
	for (const g of gauges) {
		const za = zetaAt(g, a);
		const zb = zetaAt(g, b);
		for (let i = 0; i < 3; i++) labels += (n[i] * (zb[i + 1] - za[i + 1])) / L;
	}
	let metric = 0;
	for (const p of [...planes, ...gauges.map(gaugePlane)]) {
		const m = meanCos(dot4(p.k, a) + p.phase0, dot4(p.k, b) + p.phase0);
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++) metric += 0.5 * p.A[i + 1][j + 1] * n[i] * n[j] * m;
	}
	return labels + metric;
}

/** The fractional change of one pair's proper separation in the figure. */
export const pairChange = (s: Settings, [a, b]: [Point, Point]) =>
	separationChange(
		event(a, s.phase),
		event(b, s.phase),
		[plusWave(s.wave)],
		[figureGauge(s.gauge)]
	);

/** The largest change in size, now, over all pairs of neighbouring balls, signed. */
export function largestChange(s: Settings): number {
	let best = 0;
	for (const p of PAIRS) {
		const v = pairChange(s, p);
		if (Math.abs(v) > Math.abs(best)) best = v;
	}
	return chop(best, Math.max(s.wave, s.gauge * K));
}

/** The largest change over a period, in size: the wave's h₊/2, sampled at 48 phases. */
export function peakChange(s: Omit<Settings, 'phase'>): number {
	let best = 0;
	for (let i = 0; i < 48; i++)
		best = Math.max(best, Math.abs(largestChange({ ...s, phase: (2 * Math.PI * i) / 48 })));
	return best;
}

/** The tide's largest size over a period, ½ h₊ ω², sampled at 48 phases. */
export function peakTide(s: Omit<Settings, 'phase'>): number {
	let best = 0;
	for (let i = 0; i < 48; i++)
		best = Math.max(best, Math.abs(centreTide({ ...s, phase: (2 * Math.PI * i) / 48 })));
	return best;
}

// --- the drawing ---------------------------------------------------------------------------------------------------

/** A ball's new label (x′, y′) at the phase ωt: x + ε cos(kx − ωt), y. */
export const label = (p: Point, s: Settings): Point => [
	p[0] + s.gauge * Math.cos(K * p[0] - s.phase),
	p[1]
];

/** Where a ball is, as rulers measure from the middle of the grid: stretched by ½h₊ cos ωt along x, squeezed along y. */
export const ruled = (p: Point, s: Settings): Point => {
	const q = 0.5 * s.wave * Math.cos(s.phase);
	return [p[0] * (1 + q), p[1] * (1 - q)];
};

/** The old x of the line of new label x′ (x + ε cos(kx − ωt) = x′), by Newton's rule; εk < 1 keeps it single. */
export function lineAt(xp: number, s: Settings): number {
	let x = xp;
	for (let i = 0; i < 30; i++) {
		const f = x + s.gauge * Math.cos(K * x - s.phase) - xp;
		const df = 1 - s.gauge * K * Math.sin(K * x - s.phase);
		const step = f / df;
		x -= step;
		if (Math.abs(step) < 1e-13) break;
	}
	return x;
}

/** A ball where the view draws it: as rulers measure, or at its labels. */
export const drawnAt = (p: Point, s: Settings, view: View): Point =>
	view === 'rulers' ? ruled(p, s) : label(p, s);

/** The coordinate lines x′ = const and y′ = const where the view draws them, as their x and y on the page. */
export function linesAt(n: number, s: Settings, view: View): { x: number; y: number } {
	if (view === 'labels') return { x: n, y: n };
	const q = 0.5 * s.wave * Math.cos(s.phase);
	return { x: lineAt(n, s) * (1 + q), y: n * (1 - q) };
}

// --- the keys ------------------------------------------------------------------------------------------------------

/**
 * A slider's value after a key: the arrows by a step, with Shift (or Page Up and Page Down) by a large one, onto the
 * grid of that step; Home and End to the ends. Undefined for any other key.
 */
export function stepped(v: number, key: string, shift: boolean, r: Range): number | undefined {
	if (key === 'Home') return r.min;
	if (key === 'End') return r.max;
	const dir = { ArrowRight: 1, ArrowUp: 1, PageUp: 1, ArrowLeft: -1, ArrowDown: -1, PageDown: -1 }[
		key
	];
	if (dir === undefined) return undefined;
	const size = shift || key.startsWith('Page') ? r.large : r.key;
	const k = dir > 0 ? Math.floor(v / size + 1e-9) + 1 : Math.ceil(v / size - 1e-9) - 1;
	const next = Math.round(k * size * 1e9) / 1e9;
	return Math.max(r.min, Math.min(r.max, next));
}

/** A slider's value held to its range and its step. */
export const clampTo = (v: number, r: Range) =>
	Math.round(Math.max(r.min, Math.min(r.max, v)) / r.step) * r.step;

// --- the predictions -----------------------------------------------------------------------------------------------

/** How much of a period the reader must watch with only the gauge shift on, in radians of ωt: half a period. */
export const WATCH = Math.PI;

/** Only the gauge shift on. */
export const gaugeOnly = (s: Omit<Settings, 'phase'>) => s.gauge > 0 && s.wave === 0;
/** Only the wave on. */
export const waveOnly = (s: Omit<Settings, 'phase'>) => s.gauge === 0 && s.wave > 0;
/** Both on. */
export const bothOn = (s: Omit<Settings, 'phase'>) => s.gauge > 0 && s.wave > 0;

/**
 * The first, once only the gauge shift is on and the reader has watched the ripple for half a period (`watched`,
 * the phase run through so) or set the shift themselves (`moved`).
 */
export const noteFirst = (
	done: boolean,
	s: Omit<Settings, 'phase'>,
	watched: number,
	moved: boolean
) => done || (gaugeOnly(s) && (watched >= WATCH - 1e-9 || moved));

/** The second, once the gauge shift is off and the wave on. */
export const noteSecond = (done: boolean, s: Omit<Settings, 'phase'>) => done || waveOnly(s);

/** The third, once both are on. */
export const noteThird = (done: boolean, s: Omit<Settings, 'phase'>) => done || bothOn(s);

// --- the words -----------------------------------------------------------------------------------------------------

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number) =>
	(n < 0 ? '⁻' : '') +
	String(Math.abs(n))
		.split('')
		.map((c) => SUP[Number(c)])
		.join('');

/** A number to two figures, in plain text: "0.15", "−0.087", "2.0 × 10⁻³", "3.0 × 10²⁰", "0". */
export function two(x: number): string {
	if (x === 0 || !Number.isFinite(x)) return '0';
	const sign = x < 0 ? '−' : '';
	const a = Math.abs(x);
	if (a >= 0.01 && a < 1000) {
		const r = Number(a.toPrecision(2));
		return sign + r.toFixed(Math.max(0, 1 - Math.floor(Math.log10(r))));
	}
	let e = Math.floor(Math.log10(a));
	let m = Number((a / 10 ** e).toFixed(1));
	if (m >= 10) {
		e += 1;
		m = 1;
	}
	return `${sign}${m.toFixed(1)} × 10${sup(e)}`;
}

/** The same in LaTeX. */
export const texTwo = (x: number) =>
	two(x)
		.replace('−', '-')
		.replace(' × ', ' \\times ')
		.replace(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/, (_, s: string) => {
			const e = s
				.split('')
				.map((c) => (c === '⁻' ? '-' : String(SUP.indexOf(c))))
				.join('');
			return `10^{${e}}`;
		});

/** A setting to two decimals, as its slider reads: "0.20". */
export const setting = (v: number) => v.toFixed(2);

/** How much larger the drawn wave is than LIGO's: h₊/10⁻²¹, in words. */
export const overLigo = (h: number) => two(h / LIGO);
