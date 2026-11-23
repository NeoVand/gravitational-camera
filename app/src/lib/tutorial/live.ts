import type { Component } from 'svelte';
import TidalFigure from '../paper/figures/TidalFigure.svelte';
import NearFieldFigure from '../paper/figures/NearFieldFigure.svelte';
import LockedSafeFigure from '../paper/figures/LockedSafeFigure.svelte';
import WhichWayFigure from '../paper/figures/WhichWayFigure.svelte';
import ClosedFurnaceFigure from '../paper/figures/ClosedFurnaceFigure.svelte';
import QuadrupoleFigure from '../paper/figures/QuadrupoleFigure.svelte';
import Speedometer from '../paper/figures/interactive/Speedometer.svelte';
import Stars from '../paper/figures/interactive/Stars.svelte';
import Voices from '../paper/figures/interactive/Voices.svelte';
import Present from '../paper/figures/interactive/Present.svelte';
import Passing from '../paper/figures/hair/Passing.svelte';
import HoleResponse from '../paper/figures/hair/HoleResponse.svelte';
import TidalRing from './live/TidalRing.svelte';
import BlurLaw from './live/BlurLaw.svelte';
import RingMatrix from './live/RingMatrix.svelte';
import PotentialMap from './live/PotentialMap.svelte';
import ShellTheorem from './live/ShellTheorem.svelte';
import SpinTwoDial from './live/SpinTwoDial.svelte';
import FiveNumbers from './live/FiveNumbers.svelte';
import TurningPixel from './live/TurningPixel.svelte';

/**
 * The interactive figures a chapter can mount with `::: try {#id}`, by id. A chapter that names an id not listed
 * here fails the build. The paper's own live figures are reused where they fit; the GR course's labs will be
 * ported here as Svelte components (PLAN.md section 7).
 */
export const tutorialLive: Record<string, { label: string; component: Component }> = {
	// the paper's own live figures, for the tour of Part 0 and the reading chapters
	'scene-locked-safe': {
		label: 'The two safes, in light and in gravity',
		component: LockedSafeFigure as Component
	},
	'scene-which-way': {
		label: 'The three boxes, in light and in gravity',
		component: WhichWayFigure as Component
	},
	'scene-closed-furnace': {
		label: 'The two furnaces, in light and in gravity',
		component: ClosedFurnaceFigure as Component
	},
	quadrupole: { label: 'A source of waves, at the speed you choose', component: QuadrupoleFigure },
	speedometer: { label: 'One pixel reads its own velocity', component: Speedometer },
	stars: { label: 'The four special directions of the tide', component: Stars },
	voices: { label: 'How many waves one pixel can tell apart', component: Voices },
	present: { label: 'Where a moving body is now', component: Present },
	passing: { label: 'A mass passing a body, and what it weighs', component: Passing },
	'hole-response': { label: "A black hole's reply to a tide", component: HoleResponse },
	'tidal-rings': { label: 'Three rings of free particles, in motion', component: TidalFigure },
	'tidal-ring': {
		label: 'A ring of free particles beside a mass you can move',
		component: TidalRing
	},
	'potential-map': {
		label: 'Two masses, the lines of their potential and a probe of their field',
		component: PotentialMap
	},
	'shell-theorem': {
		label: 'A round body of fixed mass, its pull inside and out',
		component: ShellTheorem
	},
	'ring-matrix': {
		label: 'A ring of free particles under a table you set',
		component: RingMatrix
	},
	'five-numbers': {
		label: 'Five numbers, one table and three rings of free particles',
		component: FiveNumbers
	},
	'spin-two-dial': {
		label: 'A ring, an arrow and axes you turn, with their numbers in the complex plane',
		component: SpinTwoDial
	},
	'turning-pixel': {
		label: 'A ring of free balls seen from outside and from a turning frame',
		component: TurningPixel
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
