/**
 * How the "Tidal field" view looks, as the reader has set it: one set of values for every demo, kept from one
 * visit to the next. The rules they drive are in lib/pixel/field-view.ts.
 */
import { DEFAULT_LOOK, type FieldLook } from '../pixel/field-view';

const KEY = 'gravitational-camera:field-look';

/** What was kept from an earlier visit, as far as it still fits. */
function kept(): Partial<FieldLook> {
	if (typeof localStorage === 'undefined') return {};
	try {
		const found = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, unknown>;
		const fits = Object.entries(DEFAULT_LOOK).filter(
			([name, value]) => typeof found[name] === typeof value
		);
		return Object.fromEntries(fits.map(([name]) => [name, found[name]]));
	} catch {
		return {};
	}
}

export const fieldLook = $state<FieldLook>({ ...DEFAULT_LOOK, ...kept() });

/** Keep the look for the next demo and the next visit. */
export function keepLook(): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(fieldLook));
	} catch {
		// a browser that keeps nothing still shows the look for this page
	}
}

/** Back to the look the view starts with. */
export function resetLook(): void {
	Object.assign(fieldLook, DEFAULT_LOOK);
	keepLook();
}

/** Whether anything has been changed from the look the view starts with. */
export const lookChanged = (): boolean =>
	(Object.keys(DEFAULT_LOOK) as (keyof FieldLook)[]).some((k) => fieldLook[k] !== DEFAULT_LOOK[k]);
