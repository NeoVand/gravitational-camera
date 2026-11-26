/**
 * The inputs of the margin map's generator (lib/tutorial/paper-map.ts), read from the sources: the paper's anchors in
 * order, the published chapters' trees, where the book derives each equation (tutorial/derivations.yaml), and which
 * `::: try` blocks mount a paper figure's live version. Used by
 * scripts/paper-links.mjs, which writes lib/tutorial/paper-links.generated.ts, and by the test that checks that file
 * against a regeneration.
 */
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import { liveFigures } from '#lib/paper/figures.js';
import { tutorialLive } from '#lib/tutorial/live.js';
import { linksModule, mapPaper } from '#lib/tutorial/paper-map.js';
import type { MapAnchor, MapResult } from '#lib/tutorial/paper-map.js';
import { chapterTree, derivations, paperContext, paperRendered, published } from './sources';

/** Where the generated map is, from the app's folder. */
export const GENERATED = path.join('src', 'lib', 'tutorial', 'paper-links.generated.ts');
const SCRIPT = 'app/scripts/paper-links.mjs';

const PLACE = /^(sec|app|par|eq|fig|tab):/;

/** Every anchor of the paper page that can get a note, in the paper's order, with its section. */
export function orderedAnchors(): MapAnchor[] {
	const out: MapAnchor[] = [];
	let section = '';
	for (const b of paperRendered().blocks) {
		const ids =
			b.kind === 'figure' ? [b.id] : [...b.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
		for (const id of ids) {
			if (!PLACE.test(id)) continue;
			if (/^(sec|app):/.test(id)) section = id;
			out.push({ id, section });
		}
	}
	return out;
}

/** The margin map from the sources, with the generator's notes on what it had to work around. */
export function generatePaperMap(): MapResult {
	const aliases = new Map<string, string>();
	for (const [label, { tex }] of paperContext().index.equations) {
		const primary = tex.match(/\\label\{([^}]+)\}/)?.[1];
		if (primary && primary !== label) aliases.set(label, primary);
	}
	const figureOf = new Map<unknown, string>();
	for (const [fig, live] of Object.entries(liveFigures))
		figureOf.set('drawing' in live ? live.drawing : live.picture, fig);
	const live = new Map<string, string>();
	for (const [id, { component }] of Object.entries(tutorialLive)) {
		const fig = figureOf.get(component);
		if (fig) live.set(id, fig);
	}
	return mapPaper({
		anchors: orderedAnchors(),
		aliases,
		chapters: published().map((c) => ({
			id: c.id,
			reads: c.reads,
			tree: chapterTree(`${c.slug}.md`)
		})),
		derivations: derivations(),
		liveFigures: live
	});
}

/** The text paper-links.generated.ts should hold, formatted as the repository's prettier formats it. */
export async function paperLinksSource(map: MapResult = generatePaperMap()): Promise<string> {
	const file = path.resolve(GENERATED);
	const options = (await resolveConfig(file)) ?? {};
	return format(linksModule(map.links, SCRIPT), { ...options, plugins: [], filepath: file });
}
