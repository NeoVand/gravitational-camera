/**
 * A drawn figure (an SVG of the paper's, from paper/figures/make_figures.py or figures3d/, or one of the tutorial's
 * own) made ready to inline in a page: its fixed size turned into a width the page can shrink, and the paper's
 * palette replaced by the site's theme variables, so that it follows the light and dark themes. The figures keep
 * to exactly these colours; pictures inside them (stone, rendered reliefs) stay as they are.
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

export function inlineDrawing(svg: string): string {
	const points = Number(svg.match(/<svg[^>]*?\swidth="([\d.]+)/)?.[1] ?? 0);
	const width = points ? ` style="max-width: ${Math.round(points * PIXELS_PER_POINT)}px"` : '';
	return svg
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
