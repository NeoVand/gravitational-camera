/** The candidate palettes meet the limits of PLAN.md §5, and app.css carries the default one. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DEFAULT_PALETTE, LIMITS, PALETTES, ROLES, audit, contrast, simulate } from './colour';

describe('the colour arithmetic', () => {
	it('gives the WCAG contrast of black on white, and leaves grey alone under every deficiency', () => {
		expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
		expect(simulate('#808080', 'deuteranopia')).toBe('#808080');
		expect(simulate('#808080', 'protanopia')).toBe('#808080');
	});
});

describe.each(Object.entries(PALETTES))('palette %s', (_, palette) => {
	it.each(['dark', 'light'] as const)('on the %s ground meets every limit', (theme) => {
		const a = audit(palette, theme);
		expect(a.minContrast).toBeGreaterThanOrEqual(LIMITS.contrast);
		expect(a.fromReserved).toBeGreaterThanOrEqual(LIMITS.reserved);
		expect(a.fromInk).toBeGreaterThanOrEqual(LIMITS.ink);
		expect(a.separation.normal).toBeGreaterThanOrEqual(LIMITS.separation.normal);
		expect(a.separation.deuteranopia).toBeGreaterThanOrEqual(LIMITS.separation.deuteranopia);
		expect(a.separation.protanopia).toBeGreaterThanOrEqual(LIMITS.separation.protanopia);
	});
});

describe('app.css', () => {
	const css = readFileSync('src/app.css', 'utf8');
	it('sets the default palette for both themes', () => {
		const palette = PALETTES[DEFAULT_PALETTE];
		for (const role of ROLES) {
			const values = [...css.matchAll(new RegExp(`--q-${role}: (#[0-9a-f]{6});`, 'g'))].map(
				(m) => m[1]
			);
			// dark, then light, then light again for the system preference
			expect(values, role).toEqual([palette.dark[role], palette.light[role], palette.light[role]]);
		}
	});
});
