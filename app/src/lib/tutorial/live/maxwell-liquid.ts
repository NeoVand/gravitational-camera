/**
 * Chapter 4.4's Maxwell liquid: a spring of rigidity μ∞ in series with a dashpot of viscosity η₀, whose stresses
 * relax in the time τ = η₀/μ∞. Its friction at the angular frequency ω is the real part of the dynamic viscosity,
 *
 *   Re η(ω) = η₀ / (1 + ω²τ²),
 *
 * the paper's eq:maxwell: the plateau η₀ when ωτ ≪ 1 and the tail μ∞²/η₀ω² when ωτ ≫ 1. Weighed over all
 * frequencies, (2/π)∫₀^∞ Re η dω = μ∞ whatever η₀ (chapter 4.5 explains why). At a fixed ω and μ∞ the friction is
 * largest when ωτ = 1, where it is the ceiling μ∞/2ω. The thermal glow at the temperature T lies where the Planck
 * radiance x³/(eˣ − 1), x = ħω/k_BT, is above a tenth of its peak, x from 0.420 to 8.30, with its peak at x = 2.821.
 */

/** The reduced Planck constant, J s, and Boltzmann's constant, J K⁻¹ (exact in the SI). */
export const HBAR = 1.054571817e-34;
export const KB = 1.380649e-23;

/** The paper's placeholder: the constant friction of 10⁻³ Pa s that it uses as a reference for every glow. */
export const PLACEHOLDER = 1e-3;

/** The drawing's axes: ω from 10⁴ to 10¹⁶ s⁻¹, Re η from 10⁻¹⁸ to 10⁴ Pa s, as powers of ten. */
export const OMEGA_AXIS = { low: 4, high: 16 };
export const ETA_AXIS = { low: -18, high: 4 };

/**
 * The sliders, as powers of ten: η₀ from 10⁻⁴ to 10⁴ Pa s (the upper end a thousand times honey's 10 Pa s, so that
 * the first prediction can be tried), μ∞ from 0.1 to 100 GPa, and T from 200 to 2000 K. The arrows step `step`, the
 * page keys `page`.
 */
export const ETA0 = { low: -4, high: 4, step: 0.1, page: 1 };
export const MU = { low: 8, high: 11, step: 0.05, page: 0.5 };
export const TEMPERATURE = { low: Math.log10(200), high: Math.log10(2000), step: 0.01, page: 0.1 };

/** The chapter's room temperature, K. */
export const ROOM = 293;

export type Liquid = { eta0: number; mu: number };
export type PresetName = 'placeholder' | 'honey' | 'copper';

/** Copper's electrons: the paper's weight ⅖nE_F = 38 GPa and its collision time 2.5 × 10⁻¹⁴ s. */
export const COPPER_TAU = 2.5e-14;

/**
 * The three presets: a Maxwell liquid with water's viscosity, the placeholder 10⁻³ Pa s; honey, 10 Pa s; both with
 * the chapter's illustrative 1 GPa; and copper's electrons, 38 GPa and η₀ = μ∞τ = 9.5 × 10⁻⁴ Pa s.
 */
export const PRESETS: Record<PresetName, Liquid> = {
	placeholder: { eta0: PLACEHOLDER, mu: 1e9 },
	honey: { eta0: 10, mu: 1e9 },
	copper: { eta0: 38e9 * COPPER_TAU, mu: 38e9 }
};
export const PRESET_ORDER: readonly PresetName[] = ['placeholder', 'honey', 'copper'];

/** Where the figure opens: honey at 293 K. */
export const OPENING = { ...PRESETS.honey, T: ROOM };

/** The relaxation time τ = η₀/μ∞, s. */
export const relaxationTime = (eta0: number, mu: number) => eta0 / mu;

/** The friction Re η(ω) = η₀/(1 + ω²τ²), Pa s. */
export function friction(omega: number, eta0: number, mu: number): number {
	const wt = omega * relaxationTime(eta0, mu);
	return eta0 / (1 + wt * wt);
}

/** The tail μ∞²/η₀ω², Pa s, which the friction approaches when ωτ ≫ 1. */
export const tail = (omega: number, eta0: number, mu: number) => (mu * mu) / (eta0 * omega * omega);

/** The ceiling μ∞/2ω, Pa s: the most friction any relaxation time gives at ω and μ∞, reached at ωτ = 1. */
export const ceiling = (omega: number, mu: number) => mu / (2 * omega);

/** The Planck radiance in the units of x = ħω/k_BT: x³/(eˣ − 1). */
export const planck = (x: number) => (x * x * x) / Math.expm1(x);

/** The peak of x³/(eˣ − 1), where x = 3(1 − e⁻ˣ): 2.8214. */
export const PEAK_X = (() => {
	let x = 3;
	for (let i = 0; i < 100; i++) x = 3 * -Math.expm1(-x);
	return x;
})();

/** A root of f between a and b, where f changes sign, by bisection. */
function bisect(f: (x: number) => number, a: number, b: number): number {
	let lo = a;
	let hi = b;
	const up = f(lo) < 0;
	for (let i = 0; i < 200; i++) {
		const mid = (lo + hi) / 2;
		if (f(mid) < 0 === up) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}

/** The band's edges, where the radiance is a tenth of its peak: 0.420 and 8.30. */
export const BAND_X = (() => {
	const level = planck(PEAK_X) / 10;
	const f = (x: number) => planck(x) - level;
	return { low: bisect(f, 1e-6, PEAK_X), high: bisect(f, PEAK_X, 60) };
})();

/** The angular frequency of x = ħω/k_BT at the temperature T, s⁻¹. */
export const omegaOf = (x: number, T: number) => (x * KB * T) / HBAR;

/** The band of the glow at T, in ω, s⁻¹: its lower edge, its peak and its upper edge. */
export const glow = (T: number) => ({
	low: omegaOf(BAND_X.low, T),
	peak: omegaOf(PEAK_X, T),
	high: omegaOf(BAND_X.high, T)
});

/** Cycles a second in THz, ω/2π × 10⁻¹². */
export const terahertz = (omega: number) => omega / (2 * Math.PI) / 1e12;

/**
 * The weight (2/π)∫₀^∞ Re η dω, Pa, by quadrature: Simpson's rule in u = ln ω, where the integrand is Re η · ω,
 * over 80 e-folds about ω = 1/τ, beyond which it is smaller than e⁻⁴⁰ of its largest value.
 */
export function weight(eta0: number, mu: number, n = 4000): number {
	const centre = -Math.log(relaxationTime(eta0, mu));
	const a = centre - 40;
	const h = 80 / n;
	let sum = 0;
	for (let i = 0; i <= n; i++) {
		const w = Math.exp(a + i * h);
		const y = friction(w, eta0, mu) * w;
		sum += y * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
	}
	return (2 / Math.PI) * ((sum * h) / 3);
}

/** The curve's points as (log₁₀ ω, log₁₀ Re η), evenly in log ω across the axis. */
export function curve(f: (omega: number) => number, count = 241): [number, number][] {
	const out: [number, number][] = [];
	for (let i = 0; i < count; i++) {
		const lw = OMEGA_AXIS.low + ((OMEGA_AXIS.high - OMEGA_AXIS.low) * i) / (count - 1);
		out.push([lw, Math.log10(f(10 ** lw))]);
	}
	return out;
}

// --- the predictions ------------------------------------------------------------------------------------------------

/** Whether two values agree to within a hundredth of a power of ten. */
export const near = (a: number, b: number) => Math.abs(Math.log10(a / b)) < 0.01;

/** The first prediction is answered at honey's stiffness, 1 GPa, and a thousand times its viscosity, 10⁴ Pa s. */
export const THOUSANDFOLD: Liquid = { eta0: 1000 * PRESETS.honey.eta0, mu: PRESETS.honey.mu };

/**
 * The second is answered at copper's stiffness once the friction at the glow's peak is within 2% of the ceiling,
 * which the slider's tenths of a power of ten reach at two places, either side of ωτ = 1.
 */
export const NEAR_CEILING = 0.98;

/** How close a liquid's friction at ω is to the ceiling: 2/(ωτ + 1/ωτ), 1 at ωτ = 1. */
export const shareOfCeiling = (omega: number, eta0: number, mu: number) =>
	friction(omega, eta0, mu) / ceiling(omega, mu);

// --- words and numbers ----------------------------------------------------------------------------------------------

const SUPER: Record<string, string> = {
	'-': '⁻',
	'0': '⁰',
	'1': '¹',
	'2': '²',
	'3': '³',
	'4': '⁴',
	'5': '⁵',
	'6': '⁶',
	'7': '⁷',
	'8': '⁸',
	'9': '⁹'
};
const sup = (e: number) => [...String(e)].map((c) => SUPER[c]).join('');

/** Mantissa and exponent, the mantissa rounded to `figures` and carried if it rounds to 10. */
function split(x: number, figures: number) {
	let e = Math.floor(Math.log10(x));
	let m = Number((x / 10 ** e).toFixed(figures - 1));
	if (m >= 10) {
		e += 1;
		m = 1;
	}
	return { m: m.toFixed(figures - 1), e };
}

/** A positive number as text to `figures` figures: "293", "0.42", "8.5 × 10⁻¹²", "10⁴". */
export function numberText(x: number, figures = 2): string {
	if (x >= 0.01 && x < 1e4) return String(Number(x.toPrecision(figures)));
	const { m, e } = split(x, figures);
	return Number(m) === 1 ? `10${sup(e)}` : `${m} × 10${sup(e)}`;
}

/** The same as LaTeX: "8.5 \times 10^{-12}". */
export function numberTex(x: number, figures = 2): string {
	if (x >= 0.01 && x < 1e4) return String(Number(x.toPrecision(figures)));
	const { m, e } = split(x, figures);
	return Number(m) === 1 ? `10^{${e}}` : `${m} \\times 10^{${e}}`;
}

/** A stiffness in GPa to two figures: "1.0 GPa", "38 GPa", "0.10 GPa". */
export function gpa(mu: number): string {
	const g = mu / 1e9;
	return g >= 9.95 ? String(Math.round(g)) : g.toPrecision(2);
}

const PREFIXES: [number, string][] = [
	[1e-3, 'ms'],
	[1e-6, 'μs'],
	[1e-9, 'ns'],
	[1e-12, 'ps'],
	[1e-15, 'fs']
];

/** A time in the prefix that suits it, as text and LaTeX: "10 ns", "25 fs". */
export function timeWords(t: number): { text: string; tex: string } {
	for (const [scale, unit] of PREFIXES) {
		if (t >= scale * 0.9995) {
			const v = Number((t / scale).toPrecision(2));
			const shown = v >= 100 ? String(Math.round(v)) : String(v);
			return {
				text: `${shown} ${unit}`,
				tex: `${shown}\\,\\mathrm{${unit === 'μs' ? '\\mu s' : unit}}`
			};
		}
	}
	return { text: `${numberText(t)} s`, tex: `${numberTex(t)}\\,\\mathrm{s}` };
}

/** Which preset a liquid is, if any. */
export function presetOf(l: Liquid): PresetName | undefined {
	return PRESET_ORDER.find((p) => near(PRESETS[p].eta0, l.eta0) && near(PRESETS[p].mu, l.mu));
}

/** The powers of ten at which the axes have their numbers: every second one. */
export const omegaTicks = [4, 6, 8, 10, 12, 14, 16];
export const etaTicks = [-18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4];
