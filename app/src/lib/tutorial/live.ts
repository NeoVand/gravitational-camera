import type { Component } from 'svelte';
import TidalFigure from '../paper/figures/TidalFigure.svelte';
import NearFieldFigure from '../paper/figures/NearFieldFigure.svelte';
import TidalRing from './live/TidalRing.svelte';
import BlurLaw from './live/BlurLaw.svelte';

/**
 * The interactive figures a chapter can mount with `::: try {#id}`, by id. A chapter that names an id not listed
 * here fails the build. The paper's own live figures are reused where they fit; the GR course's labs will be
 * ported here as Svelte components (PLAN.md section 7).
 */
export const tutorialLive: Record<string, { label: string; component: Component }> = {
	'tidal-rings': { label: 'Three rings of free particles, in motion', component: TidalFigure },
	'tidal-ring': {
		label: 'A ring of free particles beside a mass you can move',
		component: TidalRing
	},
	'blur-law': {
		label: 'The cut-off, the weight of each ripple and the picture of a point',
		component: BlurLaw
	},
	'near-field-blur': {
		label: 'Two buried masses and the blur of the near field',
		component: NearFieldFigure
	}
};
