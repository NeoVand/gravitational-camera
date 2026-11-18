import type { Component } from 'svelte';
import ArrayFigure from './figures/ArrayFigure.svelte';
import ClosedFurnaceFigure from './figures/ClosedFurnaceFigure.svelte';
import LockedSafeFigure from './figures/LockedSafeFigure.svelte';
import NearFieldFigure from './figures/NearFieldFigure.svelte';
import QuadrupoleFigure from './figures/QuadrupoleFigure.svelte';
import SunAtMidnightFigure from './figures/SunAtMidnightFigure.svelte';
import TidalFigure from './figures/TidalFigure.svelte';
import WhichWayFigure from './figures/WhichWayFigure.svelte';
import BeyondLive from './figures/interactive/Beyond.svelte';
import PresentLive from './figures/interactive/Present.svelte';
import RangingLive from './figures/interactive/Ranging.svelte';
import SkyLive from './figures/interactive/Sky.svelte';
import SpeedometerLive from './figures/interactive/Speedometer.svelte';
import StarsLive from './figures/interactive/Stars.svelte';
import VoicesLive from './figures/interactive/Voices.svelte';

/**
 * Interactive versions of some figures, offered under the figure itself (which
 * is the paper's, from paper/figures/make_figures.py). The demonstration scenes
 * open at once, beside ordinary light; they take a still from the engine to
 * show while loading.
 */
export type LiveFigure = { label: string } & (
	{ picture: Component<{ poster?: string }>; open: true } | { drawing: Component }
);

export const liveFigures: Record<string, LiveFigure> = {
	'fig:sun-at-midnight': {
		label: 'Live: the same night, beside ordinary light',
		picture: SunAtMidnightFigure,
		open: true
	},
	'fig:locked-safe': {
		label: 'Live: beside ordinary light',
		picture: LockedSafeFigure,
		open: true
	},
	'fig:closed-furnace': {
		label: 'Live: beside ordinary light',
		picture: ClosedFurnaceFigure,
		open: true
	},
	'fig:which-way': { label: 'Live: beside ordinary light', picture: WhichWayFigure, open: true },
	'fig:tidal': { label: 'See it move', drawing: TidalFigure },
	'fig:nearfield': { label: 'Try it: change the sensitivity', drawing: NearFieldFigure },
	'fig:quadrupole': { label: 'Try it: change the speed', drawing: QuadrupoleFigure },
	'fig:array': { label: 'Try it: change the width of the array', drawing: ArrayFigure },
	// the interactive figures of Section VIII (also at /figures)
	'fig:stars': { label: 'Try it: move the bodies, set one moving', drawing: StarsLive },
	'fig:voices': { label: 'Try it: up to five waves at once', drawing: VoicesLive },
	'fig:present': { label: 'Try it: stop the body, with light slowed down', drawing: PresentLive },
	'fig:speedometer': {
		label: 'Try it: cross the room, set a mass moving',
		drawing: SpeedometerLive
	},
	'fig:ranging': { label: 'Try it: move the source, change the signal', drawing: RangingLive },
	'fig:sky-count': { label: 'Try it: choose a sky', drawing: SkyLive },
	'fig:beyond': { label: 'Try it: choose a theory, add a second wave', drawing: BeyondLive }
};

/** Figures whose scene can be explored in a demo of its own, with the demo's path. */
export const figureDemos: Record<string, { label: string; slug: string }> = {
	'fig:binary-field': { label: 'Watch it turn in the demo', slug: 'two-black-holes' },
	'fig:milky-way': { label: 'Look around this sky in the demo', slug: 'milky-way' },
	'fig:black-hole': { label: 'Fly closer in the demo', slug: 'black-hole' }
};

/** The static images in /paper/figures, as URLs the site can serve. */
const images = import.meta.glob<string>('../../../../paper/figures/*.{png,jpg}', {
	eager: true,
	query: '?url',
	import: 'default'
});

/** The paper's drawn figures, as SVG text. */
const drawings = import.meta.glob<string>('../../../../paper/figures/*.svg', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const stem = (path: string) => (path.split('/').pop() ?? '').replace(/\.[a-z]+$/, '');

/** A still image with the figure's name (whatever its extension), if there is one. */
export function figureImage(source: string): string | undefined {
	const hit = Object.entries(images).find(([file]) => stem(file) === stem(source));
	return hit?.[1];
}

/**
 * The figure drawn with the paper's own colours replaced by the site's theme
 * variables, ready to inline, or undefined if the figure is not a drawing.
 * make_figures.py keeps to exactly these colours.
 */
const THEME: Record<string, string> = {
	'#1c1a16': 'var(--text)',
	'#5d5a52': 'var(--text-dim)',
	'#8b877d': 'var(--text-faint)',
	'#b0560a': 'var(--accent)',
	'#2a67ad': 'var(--accent-2)',
	'#c9c4b8': 'var(--line-strong)',
	// the page itself, where a figure clears a space around a mark
	'#fffffe': 'var(--bg)',
	// pale tints of the accents, mixed with the page
	'#dce7f3': 'color-mix(in srgb, var(--accent-2) 16%, var(--bg))',
	// a neutral tint of the page, for a sky or a surface drawn flat
	'#eeebe5': 'color-mix(in srgb, var(--text) 8%, var(--bg))',
	// a pale tint of the first accent
	'#f3dfcb': 'color-mix(in srgb, var(--accent) 20%, var(--bg))'
};

/**
 * On the page a drawing is shown at about 1.9 screen pixels per point of the
 * PDF, so that its labels are as large wherever it appears; those that span
 * both columns of the PDF are wider than the text and take its full width.
 */
const PIXELS_PER_POINT = 1.9;

export function figureDrawing(source: string): string | undefined {
	const hit = Object.entries(drawings).find(([file]) => stem(file) === stem(source));
	if (!hit) return undefined;
	const points = Number(hit[1].match(/<svg[^>]*?\swidth="([\d.]+)/)?.[1] ?? 0);
	const width = points ? ` style="max-width: ${Math.round(points * PIXELS_PER_POINT)}px"` : '';
	return hit[1]
		.replace(/<\?xml[^>]*\?>/, '')
		.replace(/<!DOCTYPE[^>]*>/, '')
		.replace(/<metadata>[\s\S]*?<\/metadata>/, '')
		.replace(
			/<svg([^>]*?) width="[^"]*" height="[^"]*"/,
			`<svg$1 class="drawing" role="img"${width}`
		)
		.replace(/#[0-9a-f]{6}\b/g, (hex) => THEME[hex] ?? hex)
		.trim();
}
