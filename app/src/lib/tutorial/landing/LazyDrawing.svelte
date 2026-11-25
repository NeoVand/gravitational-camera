<script lang="ts">
	/**
	 * One of the tutorial's drawings, fetched and inlined as it nears the screen, so that it follows the theme as
	 * the chapters' drawings do (its colours are the site's variables) without weighing on the page's first load.
	 */
	import { resolve } from '$app/paths';

	interface Props {
		name: string;
		alt: string;
	}

	let { name, alt }: Props = $props();

	let svg = $state('');

	/** Fetch the drawing once its box is within a screen of the viewport. */
	function load(box: HTMLElement) {
		let done = false;
		const fetchIt = async () => {
			if (done) return;
			done = true;
			const response = await fetch(resolve(`/tutorial/pictures/${name}.svg` as '/'));
			if (!response.ok) return;
			// the picture's name is on the box; the drawing inside is decoration of it
			svg = (await response.text()).replace(
				/<svg([^>]*?) role="img"/,
				'<svg$1 aria-hidden="true" focusable="false"'
			);
		};
		if (!('IntersectionObserver' in window)) {
			fetchIt();
			return;
		}
		const watch = new IntersectionObserver(
			(seen) => {
				if (seen.some((s) => s.isIntersecting)) {
					watch.disconnect();
					fetchIt();
				}
			},
			{ rootMargin: '100% 0px' }
		);
		watch.observe(box);
		return () => watch.disconnect();
	}
</script>

<span class="drawing-box" role="img" aria-label={alt} {@attach load}>
	{#if svg}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- the site's own drawing, from its own endpoint -->
		{@html svg}
	{/if}
</span>

<style>
	.drawing-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.drawing-box :global(svg.drawing) {
		display: block;
		width: 100%;
		height: 100%;
		max-width: none !important;
	}

	/* engraved objects are black ink on transparency: on the dark theme the ink turns light (as in the chapters) */
	:global(:root[data-theme='dark'] .drawing-box svg.drawing image.ink) {
		filter: invert(1);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light']) .drawing-box svg.drawing image.ink) {
			filter: invert(1);
		}
	}
</style>
