<script lang="ts">
	/**
	 * A small map of numbers on a grid, one square a number, with nothing smoothed between them. The value at column i
	 * and row j, counted from the bottom, is `values[i * rows + j]`. Anything passed as children is laid over it.
	 */
	import type { Snippet } from 'svelte';
	import type { Rgb } from '../array/present';

	interface Props {
		values: ArrayLike<number>;
		cols: number;
		rows: number;
		colour: (value: number) => Rgb;
		/** What the map shows, for screen readers. */
		label: string;
		children?: Snippet;
	}

	let { values, cols, rows, colour, label, children }: Props = $props();

	function paint(canvas: HTMLCanvasElement) {
		canvas.width = cols;
		canvas.height = rows;
		const context = canvas.getContext('2d');
		if (!context) return;
		const image = context.createImageData(cols, rows);
		for (let i = 0; i < cols; i++)
			for (let j = 0; j < rows; j++) {
				const [r, g, b] = colour(values[i * rows + j]);
				const at = 4 * ((rows - 1 - j) * cols + i);
				image.data[at] = r;
				image.data[at + 1] = g;
				image.data[at + 2] = b;
				image.data[at + 3] = 255;
			}
		context.putImageData(image, 0, 0);
	}
</script>

<div class="map" role="img" aria-label={label} style:aspect-ratio="{cols} / {rows}">
	<canvas {@attach paint}></canvas>
	{@render children?.()}
</div>

<style>
	.map {
		position: relative;
		width: 100%;
		border-radius: 3px;
		overflow: hidden;
		outline: 1px solid rgb(255 255 255 / 0.1);
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
	}

	.map > :global(svg) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
</style>
