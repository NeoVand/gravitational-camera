import type { Component } from 'svelte';
import ArrayFigure from './figures/ArrayFigure.svelte';
import ClosedFurnaceFigure from './figures/ClosedFurnaceFigure.svelte';
import LockedSafeFigure from './figures/LockedSafeFigure.svelte';
import NearFieldFigure from './figures/NearFieldFigure.svelte';
import QuadrupoleFigure from './figures/QuadrupoleFigure.svelte';
import SunAtMidnightFigure from './figures/SunAtMidnightFigure.svelte';
import TidalFigure from './figures/TidalFigure.svelte';
import WhichWayFigure from './figures/WhichWayFigure.svelte';

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
	'fig:array': { label: 'Try it: change the width of the array', drawing: ArrayFigure }
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
	'#c9c4b8': 'var(--line-strong)'
};

export function figureDrawing(source: string): string | undefined {
	const hit = Object.entries(drawings).find(([file]) => stem(file) === stem(source));
	if (!hit) return undefined;
	return hit[1]
		.replace(/<\?xml[^>]*\?>/, '')
		.replace(/<!DOCTYPE[^>]*>/, '')
		.replace(/<metadata>[\s\S]*?<\/metadata>/, '')
		.replace(/<svg([^>]*?) width="[^"]*" height="[^"]*"/, '<svg$1 class="drawing" role="img"')
		.replace(/#[0-9a-f]{6}\b/g, (hex) => THEME[hex] ?? hex)
		.trim();
}
