/**
 * Behaviour shared by the pages set like the paper (the paper and the tutorial's chapters), as attachments for
 * their <article>.
 */
import type { Attachment } from 'svelte/attachments';

/**
 * Follows the section being read: the last of the headings matching `selector` above a line a third of the way
 * down the window, reported by its id ('' above the first).
 */
export function followHeadings(
	selector: string,
	onChange: (id: string) => void
): Attachment<HTMLElement> {
	return (article) => {
		const headings = Array.from(article.querySelectorAll<HTMLElement>(selector));
		let frame = 0;
		const update = () => {
			frame = 0;
			const line = innerHeight * 0.33;
			let current = '';
			for (const h of headings) {
				if (h.getBoundingClientRect().top <= line) current = h.id;
				else break;
			}
			onChange(current);
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll);
		return () => {
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
			cancelAnimationFrame(frame);
		};
	};
}

/**
 * Shrinks each display equation that is wider than the column until it fits
 * (down to 60% of its size; beyond that it scrolls sideways), so that on a
 * phone no equation runs under its number or off the screen.
 */
export const fitEquations: Attachment<HTMLElement> = (article) => {
	const fit = () => {
		for (const eq of article.querySelectorAll<HTMLElement>('.equation')) {
			eq.style.removeProperty('--fit');
			eq.classList.remove('wide');
			const html = eq.querySelector<HTMLElement>('.katex-html');
			if (!html) continue;
			// the body is centred and the number sits at the right edge, so a
			// body that clears the number on both sides needs the number's width twice
			let body = 0;
			let tag = 0;
			for (const part of Array.from(html.children)) {
				const width = part.getBoundingClientRect().width;
				// a number set on its own line (the tutorial does this on phones) takes no room beside the body
				if (part.matches('.tag, .katex-tag'))
					tag = getComputedStyle(part).position === 'static' ? 0 : width;
				else body += width;
			}
			const need = body + 2 * tag + 8;
			const room = eq.clientWidth;
			if (need <= room) continue;
			const scale = room / need;
			eq.style.setProperty('--fit', String(Math.max(0.6, scale)));
			// too wide even at that size: the number follows the body, and both scroll
			if (scale < 0.6) eq.classList.add('wide');
		}
	};
	fit();
	const watch = new ResizeObserver(fit);
	watch.observe(article);
	document.fonts?.ready.then(fit);
	return () => watch.disconnect();
};
