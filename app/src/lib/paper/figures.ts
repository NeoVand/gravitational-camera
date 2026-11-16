import type { Component } from 'svelte';
import SunAtMidnightFigure from './figures/SunAtMidnightFigure.svelte';

/** Live versions of the paper's figures, by LaTeX label. */
export const liveFigures: Record<string, Component> = {
	'fig:sun-at-midnight': SunAtMidnightFigure
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
