/**
 * The tutorial's table of contents (tutorial/parts.yaml), checked: every id and slug once, every status and size
 * known, every route made of real chapters, every section a reading chapter reads present in the paper.
 */

export const STATUSES = ['planned', 'draft', 'published'] as const;
export type Status = (typeof STATUSES)[number];
export const SIZES = ['S', 'M', 'L'] as const;

export interface Chapter {
	id: string;
	/** part/chapter: the page is /tutorial/<slug>/, the source tutorial/<slug>.md */
	slug: string;
	title: string;
	/** for margin notes and links: "Tides" */
	short: string;
	size: (typeof SIZES)[number];
	status: Status;
	/** for a reading chapter, the paper's sections it reads */
	reads: string[];
	/** the part it belongs to */
	part: string;
}

export interface Part {
	id: string;
	slug: string;
	title: string;
	chapters: Chapter[];
}

export interface Route {
	id: string;
	title: string;
	chapters: string[];
}

export interface Catalogue {
	parts: Part[];
	routes: Route[];
}

/** Page segments the tutorial keeps for itself, which no part may take as its slug. */
const RESERVED_SLUGS = ['glossary', 'symbols', 'palette', 'pictures'];

/** Reads parts.yaml's parsed object; throws on anything malformed. `paperLabels`, if given, checks `reads`. */
export function parseCatalogue(raw: unknown, paperLabels?: ReadonlySet<string>): Catalogue {
	const fail = (message: string): never => {
		throw new Error(`tutorial/parts.yaml: ${message}`);
	};
	const obj = raw as { parts?: unknown[]; routes?: unknown[] };
	if (!Array.isArray(obj?.parts)) fail('no list of parts');
	const ids = new Set<string>();
	const slugs = new Set<string>();
	const text = (v: unknown, what: string) => {
		if (typeof v !== 'string' && typeof v !== 'number') fail(`${what} is missing`);
		return String(v);
	};

	const parts: Part[] = obj.parts!.map((p: unknown, i) => {
		const part = p as Record<string, unknown>;
		const id = text(part.id, `part ${i + 1}: id`);
		const slug = text(part.slug, `part ${id}: slug`);
		if (!/^[a-z0-9-]+$/.test(slug)) fail(`part ${id}: slug "${slug}" is not lower case words`);
		if (RESERVED_SLUGS.includes(slug)) fail(`part ${id}: the slug "${slug}" is reserved`);
		if (!Array.isArray(part.chapters)) fail(`part ${id}: no chapters`);
		const chapters = (part.chapters as Record<string, unknown>[]).map((c) => {
			const cid = text(c.id, `a chapter of part ${id}: id`);
			if (ids.has(cid)) fail(`the chapter id ${cid} is used twice`);
			ids.add(cid);
			const cslug = text(c.slug, `chapter ${cid}: slug`);
			if (!new RegExp(`^${slug}/[a-z0-9-]+$`).test(cslug))
				fail(`chapter ${cid}: slug "${cslug}" should be "${slug}/<words-with-hyphens>"`);
			if (slugs.has(cslug)) fail(`the slug ${cslug} is used twice`);
			slugs.add(cslug);
			const status = text(c.status, `chapter ${cid}: status`) as Status;
			if (!STATUSES.includes(status)) fail(`chapter ${cid}: unknown status "${status}"`);
			const size = text(c.size, `chapter ${cid}: size`) as Chapter['size'];
			if (!SIZES.includes(size)) fail(`chapter ${cid}: unknown size "${size}"`);
			const reads = Array.isArray(c.reads) ? c.reads.map(String) : [];
			if (paperLabels)
				for (const label of reads)
					if (!paperLabels.has(label)) fail(`chapter ${cid}: the paper has no section "${label}"`);
			return {
				id: cid,
				slug: cslug,
				title: text(c.title, `chapter ${cid}: title`),
				short: text(c.short, `chapter ${cid}: short`),
				size,
				status,
				reads,
				part: id
			};
		});
		return { id, slug, title: text(part.title, `part ${id}: title`), chapters };
	});

	const routes: Route[] = (obj.routes ?? []).map((r: unknown) => {
		const route = r as Record<string, unknown>;
		const id = text(route.id, 'a route: id');
		if (!Array.isArray(route.chapters)) fail(`route ${id}: no chapters`);
		const chapters = (route.chapters as unknown[]).map(String);
		for (const c of chapters) if (!ids.has(c)) fail(`route ${id}: no chapter ${c}`);
		return { id, title: text(route.title, `route ${id}: title`), chapters };
	});

	return { parts, routes };
}

export const allChapters = (catalogue: Catalogue): Chapter[] =>
	catalogue.parts.flatMap((p) => p.chapters);

/**
 * The chapters a route lacks: for each chapter on it, every chapter it requires (and those require, and so on)
 * must be on the route too. `requires` maps a chapter id to its front matter's `requires`; chapters without a
 * source yet have none.
 */
export function routeGaps(
	route: Route,
	requires: Readonly<Record<string, readonly string[]>>
): { chapter: string; lacks: string }[] {
	const on = new Set(route.chapters);
	const gaps: { chapter: string; lacks: string }[] = [];
	const seen = new Set<string>();
	const visit = (id: string, from: string) => {
		for (const need of requires[id] ?? []) {
			if (!on.has(need)) gaps.push({ chapter: from, lacks: need });
			if (!seen.has(need)) {
				seen.add(need);
				visit(need, from);
			}
		}
	};
	for (const id of route.chapters) visit(id, id);
	return gaps;
}
