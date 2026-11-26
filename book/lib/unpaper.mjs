// The book stands on its own: nothing in it names the research paper the tutorial serves. The tutorial's Markdown
// does, for the site (a side note "First shown in The gravitational camera (Mohsenvand 2026), Sec. IV, as its
// equation (12)", a link to a paragraph of the paper, "the paper's Figure 23"). This pass removes, from a section's
// pandoc tree, every sentence that names the paper or points into it, in the text, the notes, the captions, the tables,
// the exercises and the further reading. A note left empty goes with its mark, a paragraph left empty goes, and every
// sentence taken from the text proper (not from a note) is reported, so that a sentence the text needs can be
// rewritten at its source.
//
// A sentence names the paper if it holds "the paper" or "this paper" (not "his paper", "on paper"), the name Mohsenvand, the
// title The gravitational camera in italics, a citation of the paper, a roman section number of the paper ("Sec. IV",
// "Section XI"), or a link into the paper other than a bare link to one of its figures that the book prints (which the
// book numbers as its own).

const ABBREV = /^(?:Sec|Secs|Fig|Figs|Eq|Eqs|App|Ref|Refs|al|e\.g|i\.e|cf|vs|Ch|Phys|Rev|Lett|Vol|vol|p|pp|No|no|Dr|Mr|Mrs|St|Proc|Astrophys|Class|Quantum|Grav|Nucl|Math|Ann|Nat|J|Am|Soc|Lond|Ser|ed|eds|approx|ca|Jr)\.$/;
const ROMAN = /^\(?(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI)(?:[,.;:)]*|–[IVX]+[,.;:)]*)$/;

const text = (inl) => {
	let s = '';
	const walk = (x) => {
		if (!x) return;
		if (Array.isArray(x)) return x.forEach(walk);
		switch (x.t) {
			case 'Str':
				s += x.c;
				break;
			case 'Space':
			case 'SoftBreak':
			case 'LineBreak':
				s += ' ';
				break;
			case 'Math':
			case 'Code':
				s += x.c[1];
				break;
			case 'Note':
				break;
			case 'Link':
			case 'Image':
				walk(x.c[1]);
				break;
			case 'Cite':
				walk(x.c[1]);
				break;
			case 'Span':
				walk(x.c[1]);
				break;
			default:
				if (Array.isArray(x.c)) walk(x.c);
		}
	};
	walk(inl);
	return s;
};

/** Does this run of inlines name the paper? */
export function namesPaper(inls, figureShown) {
	let hit = false;
	const walk = (list) => {
		for (let k = 0; k < (list?.length ?? 0) && !hit; k++) {
			const x = list[k];
			if (!x || typeof x !== 'object') continue;
			switch (x.t) {
				case 'Str': {
					if (/Mohsenvand/.test(x.c)) hit = true;
					else if (/^\W*paper(?:['’]s)?\W*$/i.test(x.c)) {
						// "the paper", "the paper's", "this paper": the camera's paper; "his 1916 paper", "Radon's
						// paper", "a later paper", "on paper" are other papers, or the material
						const prev = list[k - 2]?.t === 'Str' ? list[k - 2].c : '';
						const next = list[k + 2]?.t === 'Str' ? list[k + 2].c : '';
						if (/^\W*(?:the|this)$/i.test(prev) && !/^(?:on|by)$/i.test(next)) hit = true;
					} else if (/^\(?(?:Sec|Secs|Section|Sections)\.?$/.test(x.c) && ROMAN.test(list[k + 2]?.t === 'Str' ? list[k + 2].c : '')) hit = true;
					break;
				}
				case 'Emph':
					if (/^\s*The gravitational camera\s*$/i.test(text(x.c))) hit = true;
					else walk(x.c);
					break;
				case 'Cite':
					if (x.c[0].some((c) => /^Mohsenvand/.test(c.citationId))) hit = true;
					break;
				case 'Link': {
					const url = String(x.c[2][0]);
					if (url.startsWith('/paper/')) {
						const label = decodeURIComponent(url.replace(/^\/paper\/#?/, ''));
						if (x.c[1].length || !label.startsWith('fig:') || !figureShown(label)) hit = true;
					}
					if (!hit) walk(x.c[1]);
					break;
				}
				case 'Note':
					break;
				default:
					if (Array.isArray(x.c)) {
						if (x.c.length && typeof x.c[0] === 'object' && !Array.isArray(x.c[0]) && x.c[0]?.t) walk(x.c);
						else for (const part of x.c) if (Array.isArray(part)) walk(part);
					}
			}
		}
	};
	walk(inls);
	return hit;
}

/** A run of inlines cut into sentences; a note mark after a full stop stays with its sentence. */
function sentences(inls) {
	const out = [];
	let cur = [];
	for (let k = 0; k < inls.length; k++) {
		const x = inls[k];
		cur.push(x);
		if (x.t !== 'Str') continue;
		const s = x.c;
		if (!/[.?!]["'”’)\]]*$/.test(s) || ABBREV.test(s.replace(/^[("'“‘[]+/, ''))) continue;
		// a full stop ends the sentence only before a space (or the end) and a fresh start
		let j = k + 1;
		while (inls[j]?.t === 'Note') cur.push(inls[j++]);
		const gap = inls[j];
		if (gap && gap.t !== 'Space' && gap.t !== 'SoftBreak' && gap.t !== 'LineBreak') {
			k = j - 1;
			continue;
		}
		const next = inls[j + 1];
		const fresh = !next || next.t !== 'Str' || /^[^a-z]/.test(next.c);
		k = j - 1;
		if (!fresh) continue;
		if (gap) {
			cur.push(gap);
			k = j;
		}
		out.push(cur);
		cur = [];
	}
	if (cur.length) out.push(cur);
	return out;
}

const trimEnd = (inls) => {
	while (inls.length && ['Space', 'SoftBreak', 'LineBreak'].includes(inls[inls.length - 1].t)) inls.pop();
	return inls;
};

/**
 * The section's tree with every sentence that names the paper taken out. `figureShown(label)` says whether a paper
 * figure is printed in the book; `report(kind, text)` hears every sentence removed from the text ('text') and every
 * note removed whole ('note').
 */
export function unpaper(doc, { figureShown, report }) {
	const inlineList = (inls, inNote) => {
		// notes first, inside out
		const withNotes = [];
		for (const x of inls) {
			if (x.t === 'Note') {
				const body = blockList(x.c, true);
				if (body.length) withNotes.push({ t: 'Note', c: body });
				else report('note', text(x.c.flatMap((b) => (Array.isArray(b.c) ? b.c : []))));
				continue;
			}
			withNotes.push(recurseInline(x, inNote));
		}
		const kept = [];
		for (const s of sentences(withNotes)) {
			if (namesPaper(s, figureShown)) {
				if (!inNote) report('text', text(s).trim());
				// a note attached to a dropped sentence moves to the previous sentence, if any
				const notes = s.filter((x) => x.t === 'Note');
				if (notes.length && kept.length) {
					trimEnd(kept);
					kept.push(...notes, { t: 'Space' });
				}
				continue;
			}
			kept.push(...s);
		}
		return trimEnd(kept);
	};
	const recurseInline = (x, inNote) => {
		switch (x.t) {
			case 'Emph':
			case 'Strong':
			case 'Underline':
			case 'Strikeout':
			case 'SmallCaps':
			case 'Superscript':
			case 'Subscript':
				return x;
			default:
				return x;
		}
	};
	const blockList = (bs, inNote) => {
		const out = [];
		for (const b of bs ?? []) {
			const r = block(b, inNote);
			if (r) out.push(r);
		}
		return out;
	};
	const block = (b, inNote) => {
		switch (b.t) {
			case 'Para':
			case 'Plain': {
				// a {{paper fig:…}} or {{paper eq:…}} paragraph is the figure or equation itself: keep it
				if (/^\{\{paper (eq|fig):[^}]+\}\}$/.test(text(b.c).trim())) return b;
				const c = inlineList(b.c, inNote);
				return c.length ? { ...b, c } : null;
			}
			case 'Div': {
				const [attr, content] = b.c;
				// the boxes the book leaves out anyway (the paper's own words, the plain-words boxes)
				if (attr[1].includes('paper') || attr[1].includes('plain')) return b;
				// further reading: an entry that points into the paper goes whole
				if (attr[1].includes('deeper'))
					return { ...b, c: [attr, content.map((x) => (x.t === 'BulletList' ? dropItems(x) : block(x, inNote))).filter(Boolean)] };
				return { ...b, c: [attr, blockList(content, inNote)] };
			}
			case 'BlockQuote':
				return { ...b, c: blockList(b.c, inNote) };
			case 'BulletList': {
				const items = b.c.map((it) => blockList(it, inNote)).filter((it) => it.length);
				return items.length ? { ...b, c: items } : null;
			}
			case 'OrderedList': {
				const items = b.c[1].map((it) => blockList(it, inNote)).filter((it) => it.length);
				return items.length ? { ...b, c: [b.c[0], items] } : null;
			}
			case 'Figure': {
				const [attr, [short, cap], content] = b.c;
				return { ...b, c: [attr, [short, blockList(cap, inNote)], content] };
			}
			case 'Table': {
				const [attr, [short, cap], specs, head, bodies, foot] = b.c;
				const cell = (c) => [c[0], c[1], c[2], c[3], blockList(c[4], inNote)];
				const row = (r) => [r[0], r[1].map(cell)];
				return {
					...b,
					c: [attr, [short, blockList(cap, inNote)], specs, [head[0], head[1].map(row)], bodies.map((x) => [x[0], x[1], x[2].map(row), x[3].map(row)]), [foot[0], foot[1].map(row)]]
				};
			}
			case 'Header':
				if (namesPaper(b.c[2], figureShown)) report('heading', text(b.c[2]));
				return b;
			default:
				return b;
		}
	};
	const dropItems = (list) => {
		const items = list.c.filter((it) => {
			const bad = it.some((bl) => (bl.t === 'Para' || bl.t === 'Plain') && namesPaper(bl.c, () => false));
			if (bad) report('reading', text(it.flatMap((bl) => (Array.isArray(bl.c) ? bl.c : []))));
			return !bad;
		});
		return items.length ? { ...list, c: items } : null;
	};
	return { ...doc, blocks: blockList(doc.blocks, false) };
}
