import type { Attachment } from 'svelte/attachments';

/**
 * The words of a figure at one size on the screen, whatever the size of its drawing. Attached to an SVG, it sets
 * `--u`, the drawing units in one CSS pixel, so that the drawing's text can be sized as `calc(12px * var(--u))` and
 * read 12 pixels high on a phone as on a wide screen. `measured`, if given, is told the same number, and the size of
 * the words in the drawing's units (`--t`, the size on the screen, times `u`), for a drawing that places its words
 * by their size.
 */
export function fitText(measured?: (u: number, em: number) => void): Attachment<SVGSVGElement> {
	return (svg) => {
		const set = () => {
			const box = svg.viewBox.baseVal;
			const { width, height } = svg.getBoundingClientRect();
			if (!box || box.width <= 0 || box.height <= 0 || width <= 0 || height <= 0) return;
			// the drawing is scaled to fit its box, by the less of the two ratios
			const u = 1 / Math.min(width / box.width, height / box.height);
			svg.style.setProperty('--u', u.toFixed(4));
			const t = parseFloat(getComputedStyle(svg).getPropertyValue('--t')) || 12;
			measured?.(u, t * u);
		};
		set();
		const observer = new ResizeObserver(set);
		observer.observe(svg);
		return () => observer.disconnect();
	};
}
