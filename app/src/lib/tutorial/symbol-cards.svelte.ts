/**
 * Which symbol's card is open, and the attachment that makes a chapter's symbols open it. Symbols are the elements
 * with a class symbol-<key> (set by \sym{key}{…} in a chapter's TeX) whose key tutorial/symbols.yaml lists; each
 * becomes a button for the keyboard and for screen readers. SymbolCard.svelte draws the card.
 */
import type { Attachment } from 'svelte/attachments';
import type { SymbolCardData } from './types';

export interface OpenCard {
	entry: SymbolCardData;
	/** where the card goes, in the page */
	left: number;
	top: number;
	trigger: HTMLElement;
}

const keyOf = (el: Element) =>
	Array.from(el.classList)
		.find((c) => c.startsWith('symbol-'))
		?.slice('symbol-'.length);

export class SymbolCards {
	open = $state<OpenCard | null>(null);
	#symbols: () => SymbolCardData[];

	constructor(symbols: () => SymbolCardData[]) {
		this.#symbols = symbols;
	}

	/** The chapter's symbols by key. */
	#lookup(): Record<string, SymbolCardData> {
		return Object.fromEntries(this.#symbols().map((s) => [s.key, s]));
	}

	show(trigger: HTMLElement) {
		const entry = this.#lookup()[keyOf(trigger) ?? ''];
		if (!entry) return;
		if (this.open?.trigger === trigger) return this.close();
		this.open?.trigger.setAttribute('aria-expanded', 'false');
		const box = trigger.getBoundingClientRect();
		const width = Math.min(21 * 16, innerWidth - 32);
		const left = Math.max(16, Math.min(box.left - 12, innerWidth - width - 16)) + scrollX;
		this.open = { entry, left, top: box.bottom + 10 + scrollY, trigger };
		trigger.setAttribute('aria-expanded', 'true');
	}

	close(refocus = false) {
		if (!this.open) return;
		this.open.trigger.setAttribute('aria-expanded', 'false');
		if (refocus) this.open.trigger.focus();
		this.open = null;
	}

	/** For the article: its symbols become buttons that open their cards. */
	watch: Attachment<HTMLElement> = (root) => {
		const byKey = this.#lookup();
		const marks = Array.from(root.querySelectorAll<HTMLElement>('[class*="symbol-"]')).filter(
			(el) => Object.hasOwn(byKey, keyOf(el) ?? '')
		);
		for (const el of marks) {
			el.tabIndex = 0;
			el.setAttribute('role', 'button');
			el.setAttribute('aria-label', `${byKey[keyOf(el)!].title}: open its card`);
			el.setAttribute('aria-expanded', 'false');
			el.setAttribute('aria-controls', 'symbol-card');
		}
		const onClick = (event: MouseEvent) => {
			const el =
				event.target instanceof Element ? event.target.closest('[class*="symbol-"]') : null;
			if (el instanceof HTMLElement && marks.includes(el)) {
				event.preventDefault();
				this.show(el);
			}
		};
		const onKey = (event: KeyboardEvent) => {
			const el = event.target;
			if (!(el instanceof HTMLElement) || !marks.includes(el)) return;
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				this.show(el);
			}
		};
		root.addEventListener('click', onClick);
		root.addEventListener('keydown', onKey);
		return () => {
			root.removeEventListener('click', onClick);
			root.removeEventListener('keydown', onKey);
		};
	};
}
