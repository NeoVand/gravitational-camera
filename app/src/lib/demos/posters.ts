/**
 * Stills of each demo, by slug: those drawn on a canvas made by scripts/posters.mjs, the drawn ones (the one-pixel
 * demos and the interactive figures) from a screenshot of their stage, as scripts/figure-posters.mjs takes it.
 */
import { asset } from '$app/paths';

export const posters: Record<string, string> = {
	'sun-at-midnight': asset('posters/sun-at-midnight.jpg'),
	'locked-safe': asset('posters/locked-safe.jpg'),
	'full-or-empty': asset('posters/full-or-empty.jpg'),
	'blank-mirror': asset('posters/blank-mirror.jpg'),
	'closed-furnace': asset('posters/closed-furnace.jpg'),
	'honey-and-water': asset('posters/honey-and-water.jpg'),
	'which-way': asset('posters/which-way.jpg'),
	'sealed-flywheel': asset('posters/sealed-flywheel.jpg'),
	'beam-in-the-dark': asset('posters/beam-in-the-dark.jpg'),
	'milky-way': asset('posters/milky-way.jpg'),
	'black-hole': asset('posters/black-hole.jpg'),
	'two-black-holes': asset('posters/two-black-holes.jpg'),
	'where-it-is': asset('posters/where-it-is.jpg'),
	'behind-the-wall': asset('posters/behind-the-wall.jpg'),
	'four-stars': asset('posters/four-stars.jpg'),
	'four-voices': asset('posters/four-voices.jpg'),
	'now-and-then': asset('posters/now-and-then.jpg'),
	speedometer: asset('posters/speedometer.jpg'),
	ranging: asset('posters/ranging.jpg'),
	'one-pixel-sky': asset('posters/one-pixel-sky.jpg'),
	'beyond-einstein': asset('posters/beyond-einstein.jpg'),
	'push-and-weigh': asset('posters/push-and-weigh.jpg'),
	'marked-ring': asset('posters/marked-ring.jpg')
};
