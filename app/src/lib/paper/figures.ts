import type { Component } from 'svelte';
import ArrayFigure from './figures/ArrayFigure.svelte';
import ClosedFurnaceFigure from './figures/ClosedFurnaceFigure.svelte';
import LockedSafeFigure from './figures/LockedSafeFigure.svelte';
import WhichWayFigure from './figures/WhichWayFigure.svelte';
import BudgetFigure from './figures/BudgetFigure.svelte';
import LineIntegralFigure from './figures/LineIntegralFigure.svelte';
import NearFieldFigure from './figures/NearFieldFigure.svelte';
import QuadrupoleFigure from './figures/QuadrupoleFigure.svelte';
import RegimeMap from './figures/RegimeMap.svelte';
import SunAtMidnightFigure from './figures/SunAtMidnightFigure.svelte';
import TidalFigure from './figures/TidalFigure.svelte';

/** Live figures that are pictures from the engine; they take a still image to show while loading. */
export const pictureFigures: Record<string, Component<{ poster?: string }>> = {
	'fig:sun-at-midnight': SunAtMidnightFigure,
	'fig:locked-safe': LockedSafeFigure,
	'fig:closed-furnace': ClosedFurnaceFigure,
	'fig:which-way': WhichWayFigure
};

/** Live figures that are drawings, by LaTeX label. */
export const drawnFigures: Record<string, Component> = {
	'fig:tidal': TidalFigure,
	'fig:regimes': RegimeMap,
	'fig:nearfield': NearFieldFigure,
	'fig:quadrupole': QuadrupoleFigure,
	'fig:line-integral': LineIntegralFigure,
	'fig:array': ArrayFigure,
	'fig:budget': BudgetFigure
};

/** The static images in /paper/figures, as URLs the site can serve. */
const images = import.meta.glob<string>('../../../../paper/figures/*.{png,jpg,svg}', {
	eager: true,
	query: '?url',
	import: 'default'
});

export function figureImage(source: string): string | undefined {
	const name = source.split('/').pop();
	const hit = Object.entries(images).find(([file]) => file.split('/').pop() === name);
	return hit?.[1];
}
