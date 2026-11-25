/**
 * A row of many links (the dots of a route, the tiles of the equations) as one stop of the Tab key: the arrow keys,
 * Home and End move among them, and only the one last reached takes Tab. An attachment for the row's element; its
 * links carry `data-rove`. In a `grid` (a wrapped row) Up and Down move a line of the wrap; otherwise they step like
 * Left and Right.
 */
import type { Attachment } from 'svelte/attachments';

export function rove({ grid = false } = {}): Attachment<Element> {
	return (row) => {
		const items = () => [...row.querySelectorAll<HTMLElement | SVGElement>('[data-rove]')];
		const settle = (keep: HTMLElement | SVGElement) => {
			for (const item of items()) item.tabIndex = item === keep ? 0 : -1;
		};
		const first = items()[0];
		if (first) settle(first);

		const onkeydown = (e: KeyboardEvent) => {
			const list = items();
			const at = list.indexOf(document.activeElement as HTMLElement);
			if (at < 0) return;
			// the tiles on the first line of the wrap
			const top = list[0].getBoundingClientRect().top;
			const step = grid
				? Math.max(1, list.filter((el) => el.getBoundingClientRect().top === top).length)
				: 1;
			const to =
				e.key === 'ArrowRight'
					? at + 1
					: e.key === 'ArrowLeft'
						? at - 1
						: e.key === 'ArrowDown'
							? at + step
							: e.key === 'ArrowUp'
								? at - step
								: e.key === 'Home'
									? 0
									: e.key === 'End'
										? list.length - 1
										: undefined;
			if (to === undefined) return;
			e.preventDefault();
			const next = list[Math.max(0, Math.min(list.length - 1, to))];
			settle(next);
			next.focus();
		};
		const onfocusin = (e: FocusEvent) => {
			const target = (e.target as Element).closest<HTMLElement | SVGElement>('[data-rove]');
			if (target) settle(target);
		};
		row.addEventListener('keydown', onkeydown as EventListener);
		row.addEventListener('focusin', onfocusin as EventListener);
		return () => {
			row.removeEventListener('keydown', onkeydown as EventListener);
			row.removeEventListener('focusin', onfocusin as EventListener);
		};
	};
}
