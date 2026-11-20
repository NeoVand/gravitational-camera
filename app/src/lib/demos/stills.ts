/**
 * Each scene on the landing page twice, from the same camera: in light alone and in gravity alone
 * (scripts/seam-stills.mjs). The page lays the two over each other and cuts them at one seam.
 */
import { asset } from '$app/paths';

export interface Stills {
	light: string;
	gravity: string;
}

export const stills: Record<string, Stills> = {
	'sun-at-midnight': {
		light: asset('seam/sun-at-midnight-light.jpg'),
		gravity: asset('seam/sun-at-midnight-gravity.jpg')
	},
	'locked-safe': {
		light: asset('seam/locked-safe-light.jpg'),
		gravity: asset('seam/locked-safe-gravity.jpg')
	},
	'full-or-empty': {
		light: asset('seam/full-or-empty-light.jpg'),
		gravity: asset('seam/full-or-empty-gravity.jpg')
	},
	'closed-furnace': {
		light: asset('seam/closed-furnace-light.jpg'),
		gravity: asset('seam/closed-furnace-gravity.jpg')
	},
	'blank-mirror': {
		light: asset('seam/blank-mirror-light.jpg'),
		gravity: asset('seam/blank-mirror-gravity.jpg')
	},
	'sealed-flywheel': {
		light: asset('seam/sealed-flywheel-light.jpg'),
		gravity: asset('seam/sealed-flywheel-gravity.jpg')
	},
	'beam-in-the-dark': {
		light: asset('seam/beam-in-the-dark-light.jpg'),
		gravity: asset('seam/beam-in-the-dark-gravity.jpg')
	},
	'behind-the-wall': {
		light: asset('seam/behind-the-wall-light.jpg'),
		gravity: asset('seam/behind-the-wall-gravity.jpg')
	},
	'milky-way': {
		light: asset('seam/milky-way-light.jpg'),
		gravity: asset('seam/milky-way-gravity.jpg')
	},
	'black-hole': {
		light: asset('seam/black-hole-light.jpg'),
		gravity: asset('seam/black-hole-gravity.jpg')
	}
};
