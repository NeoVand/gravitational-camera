/**
 * The colour language of the tutorial's equations: five roles, each a colour per theme, and the arithmetic that
 * checks a palette (contrast on the site's grounds, distance from the accent and from the figures' orange and blue,
 * and distance between roles for readers with the two common red-green deficiencies).
 */

export const ROLES = ['matter', 'field', 'curv', 'obs', 'light'] as const;
export type Role = (typeof ROLES)[number];

/** What each role marks, as the legend says it. */
export const ROLE_INFO: Record<Role, { name: string; tex: string; meaning: string }> = {
	matter: {
		name: 'Matter',
		tex: '\\rho,\\ M,\\ T_{\\mu\\nu}',
		meaning: 'what gravitates: mass, energy, stress and their flow'
	},
	field: {
		name: 'Field',
		tex: '\\Phi,\\ h_{\\mu\\nu},\\ g_{\\mu\\nu}',
		meaning: 'potentials and the metric'
	},
	curv: {
		name: 'Curvature',
		tex: '\\mathcal{E}_{ij},\\ \\mathcal{B}_{ij},\\ R_{\\mu\\nu\\rho\\sigma}',
		meaning: 'tides: what a pixel measures'
	},
	obs: {
		name: 'Observer',
		tex: 'v,\\ u^\\mu,\\ \\tau',
		meaning: 'the one who measures: velocity, proper time'
	},
	light: {
		name: 'Light',
		tex: 'E,\\ B,\\ F',
		meaning: 'the electromagnetic field'
	}
};

export type Theme = 'dark' | 'light';
export type Palette = { name: string; note: string } & Record<Theme, Record<Role, string>>;

/** The grounds every role colour must read on, from app.css. */
export const GROUNDS: Record<Theme, { bg: string; 'bg-raised': string; 'bg-sunken': string }> = {
	dark: { bg: '#18120c', 'bg-raised': '#21190f', 'bg-sunken': '#110d08' },
	light: { bg: '#f4eee2', 'bg-raised': '#ece4d4', 'bg-sunken': '#e3d9c6' }
};

/** Colours a role must stay away from: the site's accent (links, focus) and the figures' stretch and squeeze. */
export const RESERVED: Record<Theme, Record<string, string>> = {
	dark: {
		accent: '#e8a45a',
		'accent-2': '#8fb6dd',
		stretch: '#e8a45a',
		squeeze: '#7fb4ff'
	},
	light: {
		accent: '#9a5212',
		'accent-ink': '#86460d',
		'accent-2': '#2d5f8e',
		stretch: '#b0560a',
		squeeze: '#2a67ad'
	}
};

/** The ink of the text: a role must not look like a black (or, on umber, a pale) symbol. */
export const INK: Record<Theme, string> = { dark: '#d2dde7', light: '#2d2218' };

/** Three candidates for Neo to choose between; A is the default. */
export const PALETTES: Record<'A' | 'B' | 'C', Palette> = {
	A: {
		name: 'Gold and violet',
		note: 'Closest to the GR course: gold matter, teal field, violet curvature, rose observer, green light.',
		dark: {
			matter: '#f1dc86',
			field: '#04becd',
			curv: '#968ff7',
			obs: '#e26c8c',
			light: '#86bd54'
		},
		light: {
			matter: '#533f03',
			field: '#0b5a59',
			curv: '#4d1c7b',
			obs: '#9b2d7f',
			light: '#256b00'
		}
	},
	B: {
		name: 'Red and green',
		note: 'Red matter, green field, lilac curvature, teal observer, yellow light.',
		dark: {
			matter: '#e46d7c',
			field: '#7ad082',
			curv: '#cda6fd',
			obs: '#47a7ba',
			light: '#f8df5c'
		},
		light: {
			matter: '#ae2744',
			field: '#006700',
			curv: '#48377d',
			obs: '#1a635c',
			light: '#474100'
		}
	},
	C: {
		name: 'Red and cyan',
		note: 'Red matter, slate-cyan field, magenta curvature, yellow observer, green light.',
		dark: {
			matter: '#dd747c',
			field: '#58a5b7',
			curv: '#e59cfb',
			obs: '#f9df5c',
			light: '#87c964'
		},
		light: {
			matter: '#ad2a3a',
			field: '#054757',
			curv: '#753987',
			obs: '#4a4007',
			light: '#196432'
		}
	}
};

export const DEFAULT_PALETTE = 'A' as const;

// ---- colour arithmetic ------------------------------------------------------------------------------------------

export type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
	const h = hex.replace('#', '');
	return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
}

export function rgbToHex(rgb: Rgb): string {
	return (
		'#' +
		rgb
			.map((v) =>
				Math.round(Math.min(1, Math.max(0, v)) * 255)
					.toString(16)
					.padStart(2, '0')
			)
			.join('')
	);
}

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

export const linear = (rgb: Rgb): Rgb => rgb.map(toLinear) as Rgb;
export const gamma = (rgb: Rgb): Rgb => rgb.map(toGamma) as Rgb;

/** WCAG relative luminance. */
export function luminance(hex: string): number {
	const [r, g, b] = linear(hexToRgb(hex));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, from 1 to 21. */
export function contrast(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/** OKLab coordinates (Björn Ottosson, 2020) of an sRGB colour. */
export function oklab(hex: string): Rgb {
	const [r, g, b] = linear(hexToRgb(hex));
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
	];
}

/** Distance in OKLab: about 0.02 is just noticeable side by side; text wants several times that. */
export function distance(a: string, b: string): number {
	const [p, q] = [oklab(a), oklab(b)];
	return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

export type Vision = 'normal' | 'deuteranopia' | 'protanopia';

/**
 * Machado, Oliveira and Fernandes (2009), severity 1, applied to linear RGB: how a colour looks to a reader without
 * working green (deuteranopia) or red (protanopia) cones.
 */
const CVD: Record<Exclude<Vision, 'normal'>, number[][]> = {
	protanopia: [
		[0.152286, 1.052583, -0.204868],
		[0.114503, 0.786281, 0.099216],
		[-0.003882, -0.048116, 1.051998]
	],
	deuteranopia: [
		[0.367322, 0.860646, -0.227968],
		[0.280085, 0.672501, 0.047413],
		[-0.01182, 0.04294, 0.968881]
	]
};

export function simulate(hex: string, vision: Vision): string {
	if (vision === 'normal') return hex;
	const c = linear(hexToRgb(hex));
	const m = CVD[vision];
	const out = m.map((row) => row[0] * c[0] + row[1] * c[1] + row[2] * c[2]) as Rgb;
	return rgbToHex(gamma(out.map((v) => Math.min(1, Math.max(0, v))) as Rgb));
}

/** Everything the palette page reports, and the tests check, about one palette in one theme. */
export function audit(palette: Palette, theme: Theme) {
	const colours = palette[theme];
	const grounds = GROUNDS[theme];
	const reserved = RESERVED[theme];
	const contrasts = ROLES.map((role) => ({
		role,
		ratios: Object.fromEntries(
			Object.entries(grounds).map(([name, bg]) => [name, contrast(colours[role], bg)])
		) as Record<keyof typeof grounds, number>
	}));
	const minContrast = Math.min(...contrasts.flatMap((c) => Object.values(c.ratios)));
	const fromReserved = Math.min(
		...ROLES.flatMap((role) => Object.values(reserved).map((r) => distance(colours[role], r)))
	);
	const fromInk = Math.min(
		...ROLES.flatMap((role) =>
			(['normal', 'deuteranopia', 'protanopia'] as const).map((v) =>
				distance(simulate(colours[role], v), simulate(INK[theme], v))
			)
		)
	);
	const pairs = (vision: Vision) => {
		let least = Infinity;
		for (let i = 0; i < ROLES.length; i++)
			for (let j = i + 1; j < ROLES.length; j++)
				least = Math.min(
					least,
					distance(simulate(colours[ROLES[i]], vision), simulate(colours[ROLES[j]], vision))
				);
		return least;
	};
	return {
		contrasts,
		minContrast,
		fromReserved,
		fromInk,
		separation: {
			normal: pairs('normal'),
			deuteranopia: pairs('deuteranopia'),
			protanopia: pairs('protanopia')
		}
	};
}

/** The thresholds a palette must meet (see PLAN.md §5). */
export const LIMITS = {
	contrast: 4.5,
	/** from the accent, stretch and squeeze, in OKLab */
	reserved: 0.08,
	/** from the ink of the text, under each vision */
	ink: 0.1,
	/** between any two roles, in OKLab, under each vision */
	separation: { normal: 0.1, deuteranopia: 0.06, protanopia: 0.06 }
} as const;

/** CSS custom properties for one palette, for both themes, as app.css writes them. */
export function paletteVars(palette: Palette, theme: Theme): string {
	return ROLES.map((r) => `--q-${r}: ${palette[theme][r]};`).join(' ');
}
