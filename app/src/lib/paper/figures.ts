import type { Component } from 'svelte';
import ArrayFigure from './figures/ArrayFigure.svelte';
import ClosedFurnaceFigure from './figures/ClosedFurnaceFigure.svelte';
import LockedSafeFigure from './figures/LockedSafeFigure.svelte';
import NearFieldFigure from './figures/NearFieldFigure.svelte';
import QuadrupoleFigure from './figures/QuadrupoleFigure.svelte';
import SunAtMidnightFigure from './figures/SunAtMidnightFigure.svelte';
import TidalFigure from './figures/TidalFigure.svelte';
import WhichWayFigure from './figures/WhichWayFigure.svelte';

/** Live figures that are pictures from the engine; they take a still image to show while loading. */
export const pictureFigures: Record<string, Component<{ poster?: string }>> = {
	'fig:sun-at-midnight': SunAtMidnightFigure,
	'fig:locked-safe': LockedSafeFigure,
	'fig:closed-furnace': ClosedFurnaceFigure,
	'fig:which-way': WhichWayFigure
};

/**
 * Interactive versions of some drawn figures, offered under the drawing itself
 * (which is the paper's, from paper/figures/make_figures.py).
 */
export const liveFigures: Record<string, { label: string; component: Component }> = {
	'fig:tidal': { label: 'See it move', component: TidalFigure },
	'fig:nearfield': { label: 'Try it: change the sensitivity', component: NearFieldFigure },
	'fig:quadrupole': { label: 'Try it: change the speed', component: QuadrupoleFigure },
	'fig:array': { label: 'Try it: change the width of the array', component: ArrayFigure }
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

export function figureImage(source: string): string | undefined {
	const name = source.split('/').pop();
	const hit = Object.entries(images).find(([file]) => file.split('/').pop() === name);
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
