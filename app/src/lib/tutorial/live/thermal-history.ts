/**
 * Chapter 12.2's thermal history, the arithmetic of ThermalHistory.svelte. Against the photons' temperature T, from
 * the Planck temperature down to today, three lines of T a in units of the photons' value today, T_γ a₀: the
 * photons', (3.909/g*s(T))^{1/3}, which steps up at each annihilation and ends at 1; the neutrinos', the photons'
 * down to their decoupling at 10¹⁰ K and then flat at (4/11)^{1/3}; and the gravitons', flat at (3.909/g_hot)^{1/3}
 * from the left edge, where they parted. The count g*s(T) is stepped: the heights of the steps are the chapter's exact
 * counts, their places the temperatures named for the species, which are schematic. Any species beyond the Standard
 * Model are taken to annihilate with the top quark. From the hot count follow the gravitons' temperature today,
 * ΔN_eff = (8/7)(T_g/T_ν)⁴, and Ω_g and Ω_g h², scaled from the chapter's 6.619 × 10⁻⁷ at 0.90507 K with H₀ = 67.4.
 */
import { numberTex, numberText } from './planck-spectrum';

// --- the chapter's constants --------------------------------------------------------------------------------------

/** The microwave sky today, in kelvin (Fixsen 2009). */
export const T_GAMMA = 2.7255;
/** Today's count: photons 2 and three neutrinos at (4/11)^{1/3} T_γ, 2 + (7/8)·6·(4/11) = 43/11 = 3.909. */
export const G_TODAY = 43 / 11;
/** The hot Standard Model's count, 28 + (7/8)·90. */
export const G_SM = 106.75;
/** Twice the Standard Model's species. */
export const G_TWICE = 2 * G_SM;
/** The neutrinos today, (4/11)^{1/3} T_γ = 1.9454 K. */
export const T_NU = Math.cbrt(4 / 11) * T_GAMMA;
/** The neutrinos' line after they decouple, (4/11)^{1/3} = 0.7138. */
export const NU_LINE = Math.cbrt(4 / 11);
/** The neutrinos decouple at about 10¹⁰ K (stated in the chapter). */
export const NU_DECOUPLING = 1e10;
/** The Planck temperature, √(ħc⁵/G)/k_B, in kelvin. */
export const T_PLANCK = 1.416784e32;
/** The gravitons' energy as the chapter gives it at the Standard Model's 0.90507 K, with H₀ = 67.4 km s⁻¹ Mpc⁻¹. */
export const OMEGA_AT = { T: 0.90507, omega: 6.619e-7, omegaH2: 3.007e-7 } as const;
export const H0 = 67.4;

// --- the stepped count --------------------------------------------------------------------------------------------

export type Step = {
	/** The temperature at which the species annihilate, in kelvin; the count below it is `after`. */
	at: number;
	after: number;
	/** The species, as the readout names them. */
	species: string;
};

/**
 * The annihilations, hottest first. Above the first, g*s is the hot count, g_hot; at and below each, its `after`.
 * The heights are exact (the chapter's table), the places schematic.
 */
export const STEPS: readonly Step[] = [
	{ at: 2.0e15, after: 96.25, species: 'the top quarks' },
	{ at: 1.2e15, after: 86.25, species: 'the W, the Z and the Higgs' },
	{ at: 4.9e13, after: 75.75, species: 'the bottom quarks' },
	{ at: 2.1e13, after: 72.25, species: 'the taus' },
	{ at: 1.5e13, after: 61.75, species: 'the charm quarks' },
	{ at: 1.7e12, after: 17.25, species: 'the quarks and gluons, confined into pions' },
	{ at: 1.2e12, after: 10.75, species: 'the muons and pions' },
	{ at: 5.9e9, after: G_TODAY, species: 'the electrons and positrons' }
];

/** The last annihilation at or above T, as an index into STEPS; −1 above them all. */
export function stageOf(T: number): number {
	let last = -1;
	STEPS.forEach((s, i) => {
		if (s.at >= T) last = i;
	});
	return last;
}

/** g*s at the photons' temperature T, for a hot count gHot. */
export function gStar(T: number, gHot: number): number {
	const i = stageOf(T);
	return i < 0 ? gHot : STEPS[i].after;
}

// --- the three lines: T a over the photons' value today -----------------------------------------------------------

/** The photons' T a / T_γ a₀: (3.909/g*s)^{1/3}, which is 1 once the electrons have annihilated. */
export const photonLine = (T: number, gHot: number) => Math.cbrt(G_TODAY / gStar(T, gHot));

/** The neutrinos' T a / T_γ a₀: the photons' down to 10¹⁰ K, then (4/11)^{1/3}. */
export const neutrinoLine = (T: number, gHot: number) =>
	T >= NU_DECOUPLING ? photonLine(T, gHot) : NU_LINE;

/** The gravitons' T a / T_γ a₀, the same at every temperature: (3.909/g_hot)^{1/3}. */
export const gravitonLine = (gHot: number) => Math.cbrt(G_TODAY / gHot);

/** The redshift at T: 1 + z = a₀/a = T / (T_γ × the photons' line). */
export const onePlusZ = (T: number, gHot: number) => T / (T_GAMMA * photonLine(T, gHot));

/**
 * The photons' line as a polyline in (log₁₀ T, T a / T_γ a₀), from `hot` on the left to `cold` on the right, each
 * step drawn as a vertical rise at its place.
 */
export function photonPath(gHot: number, hot: number, cold: number): [number, number][] {
	let y = gravitonLine(gHot);
	const pts: [number, number][] = [[hot, y]];
	for (const s of STEPS) {
		const x = Math.log10(s.at);
		if (x > hot || x < cold) continue;
		pts.push([x, y]);
		y = Math.cbrt(G_TODAY / s.after);
		pts.push([x, y]);
	}
	pts.push([cold, y]);
	return pts;
}

/** The neutrinos' line: the photons' down to 10¹⁰ K, then flat to the right. */
export function neutrinoPath(gHot: number, hot: number, cold: number): [number, number][] {
	const parted = Math.log10(NU_DECOUPLING);
	const pts = photonPath(gHot, hot, cold).filter(([x]) => x >= parted);
	pts.push([parted, NU_LINE], [cold, NU_LINE]);
	return pts;
}

// --- what the hot count gives today -------------------------------------------------------------------------------

/** The gravitons today, T_γ (3.909/g_hot)^{1/3}. */
export const gravitonTemperature = (gHot: number) => T_GAMMA * gravitonLine(gHot);

/** Their extra species, ΔN_eff = (8/7)(T_g/T_ν)⁴. */
export const extraSpecies = (Tg: number) => (8 / 7) * (Tg / T_NU) ** 4;

/** Their density parameter with H₀ = 67.4, and the part of it that does not depend on H₀. */
export const omegaG = (Tg: number) => OMEGA_AT.omega * (Tg / OMEGA_AT.T) ** 4;
export const omegaGH2 = (Tg: number) => OMEGA_AT.omegaH2 * (Tg / OMEGA_AT.T) ** 4;

export type Count = { Tg: number | null; dNeff: number; omega: number; omegaH2: number };

/** Everything the hot count fixes; inflation after the gravitons parted leaves none of them. */
export function countOf(gHot: number, inflation: boolean): Count {
	if (inflation) return { Tg: null, dNeff: 0, omega: 0, omegaH2: 0 };
	const Tg = gravitonTemperature(gHot);
	return { Tg, dNeff: extraSpecies(Tg), omega: omegaG(Tg), omegaH2: omegaGH2(Tg) };
}

// --- the sliders ----------------------------------------------------------------------------------------------------

export type Scale = { lo: number; hi: number; step: number; page: number };

/**
 * The photons' temperature as log₁₀ T, from the Planck temperature's 32.15 down to today's log₁₀ 2.7255 = 0.4354.
 * The ends stand for the exact temperatures.
 */
export const TEMPERATURE = { hot: 32.15, cold: Math.log10(T_GAMMA), step: 0.01, page: 1 } as const;
/** The hot count. */
export const COUNT: Scale = { lo: G_SM, hi: 1000, step: 0.25, page: 10 };
/**
 * The temperature slider runs hot on the left, like the plot, so its native value is −log₁₀ T, on steps of a
 * hundredth from the hot end.
 */
export const REVERSED: Scale = {
	lo: -TEMPERATURE.hot,
	hi: -TEMPERATURE.cold,
	step: TEMPERATURE.step,
	page: TEMPERATURE.page
};

export const OPENING = { logT: 12, gHot: G_SM, inflation: false } as const;

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** The temperature at log₁₀ T, exact at the two ends. */
export function temperatureOf(logT: number): number {
	if (logT >= TEMPERATURE.hot - 1e-9) return T_PLANCK;
	if (logT <= TEMPERATURE.cold + 1e-9) return T_GAMMA;
	return 10 ** logT;
}

/**
 * One key's move on a scale: `by` steps (a page is `page / step` of them) from v to the next point of the grid
 * beyond it, kept within the ends; a point of the grid within half a step of an end is that end.
 */
export function stepFrom(v: number, s: Scale, by: number): number {
	const at = (v - s.lo) / s.step;
	const eps = 1e-6;
	const n = by > 0 ? Math.floor(at + eps) + by : Math.ceil(at - eps) + by;
	const steps = Math.floor((s.hi - s.lo) / s.step + eps);
	if (n > steps) return s.hi;
	if (n <= 0) return s.lo;
	return snap(Number((s.lo + n * s.step).toFixed(6)), s);
}

/** A value from the slider, taken exactly onto an end or a mark it lands within half a step of. */
export function snap(v: number, s: Scale, marks: readonly number[] = []): number {
	const near = [s.lo, s.hi, ...marks].find((m) => Math.abs(m - v) <= s.step / 2 + 1e-9);
	return clamp(near ?? v, s.lo, s.hi);
}

// --- the words ------------------------------------------------------------------------------------------------------

/** A count as the chapter writes it: 106.75, 213.5, 1000, and today's 3.909. */
export function countText(g: number): string {
	if (Math.abs(g - G_TODAY) < 1e-9) return '3.909';
	return String(Number(g.toFixed(2)));
}

/** A temperature to three figures, with today's and the Planck temperature exact: "2.7255 K", "1.42 × 10³² K". */
export function temperatureText(T: number): string {
	if (T === T_GAMMA) return '2.7255 K';
	return `${numberText(T, 3)} K`;
}

export function temperatureTex(T: number): string {
	if (T === T_GAMMA) return '2.7255\\,\\mathrm{K}';
	return `${numberTex(T, 3)}\\,\\mathrm{K}`;
}

/** The gravitons today to four figures: "0.9051 K"; "none" after inflation. */
export const gravitonText = (Tg: number | null) =>
	Tg === null ? 'none' : `${Tg.toPrecision(4)} K`;

/** ΔN_eff to three figures: 0.0535, 0.00271; 0 exactly after inflation. */
export const extraText = (x: number) => (x === 0 ? '0' : x.toPrecision(3));

/** Ω_g and Ω_g h², 1 + z: three figures, as LaTeX. */
export const smallTex = (x: number) => (x === 0 ? '0' : numberTex(x, 3));
export const smallText = (x: number) => (x === 0 ? '0' : numberText(x, 3));

/** What has last happened above T, in words for the readout. */
export function stageText(T: number): string {
	const i = stageOf(T);
	if (i < 0) return 'before any annihilation: every species counts';
	const s = STEPS[i];
	const beyond = i === 0 ? ' (and any species beyond the Standard Model)' : '';
	return `since ${s.species}${beyond} annihilated, at ${numberText(s.at, 2)} K`;
}
