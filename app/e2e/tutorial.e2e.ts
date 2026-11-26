import { expect, test, type Page } from '@playwright/test';

/** The text a reader sees in the article, with KaTeX's hidden copies of the TeX left out. */
const visibleText = (page: Page) =>
	page.locator('article').evaluate((a) => {
		const copy = a.cloneNode(true) as HTMLElement;
		copy.querySelectorAll('annotation, .katex-mathml').forEach((n) => n.remove());
		return copy.textContent ?? '';
	});

/** The chapter page has hydrated once its symbols have been made buttons (both happen as it mounts). */
const hydrated = (page: Page) =>
	page.waitForFunction(
		() => document.querySelector('article [class*="symbol-"]')?.getAttribute('role') === 'button'
	);

test('tutorial: the front page shows the parts, the routes and the equations', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/tutorial/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'From calculus to the gravitational camera'
	);
	await expect(page.locator('header nav a[aria-current="page"]')).toContainText('Tutorial');

	// the banner's seam moves from the keyboard
	const seam = page.getByRole('slider', { name: 'The seam between light and gravity' });
	await expect(seam).toHaveAttribute('aria-valuenow', '50');
	// (pressed again until the page has hydrated and the key takes)
	await expect(async () => {
		await seam.press('ArrowLeft');
		expect(Number(await seam.getAttribute('aria-valuenow'))).toBeLessThan(50);
	}).toPass();
	await expect(page.getByRole('link', { name: 'Begin with one evening' })).toHaveAttribute(
		'href',
		/tutorial\/evening\/a-camera-for-gravity\/$/
	);

	// fourteen parts and the appendices, each a picture that links to its first chapter, its chapters folded away
	const parts = page.locator('li.part');
	await expect(parts).toHaveCount(15);
	const newton = page.locator('#part-1');
	await expect(newton.locator('h3')).toHaveText("Newton's gravity");
	await expect(newton.locator('a.opening')).toHaveAttribute(
		'href',
		/newton\/vectors-and-indices\/$/
	);
	const tides = newton.getByRole('link', { name: 'Tides: the difference in gravity', exact: true });
	await expect(tides).toBeHidden();
	await newton.locator('summary').click();
	await expect(tides).toBeVisible();
	await expect(newton.locator('.chapters em.reading')).toHaveText('reading');
	// the part's drawing is fetched as it nears the screen, and drawn in the theme's colours
	await newton.scrollIntoViewIfNeeded();
	await expect(newton.locator('.picture svg.drawing')).toBeAttached({ timeout: 20_000 });
	await expect(newton.locator('.picture [role="img"]')).toHaveAttribute(
		'aria-label',
		/ring of free balls/
	);

	// eight routes, each with its picture, its time and a path of dots that name their chapters
	const routes = page.locator('li.route');
	await expect(routes).toHaveCount(8);
	const toII = page.locator('#route-section-ii');
	await expect(toII.locator('h3')).toHaveText('Section II, what a pixel measures');
	await expect(toII.locator('.length')).toContainText(
		/\d+ chapters from \d+ parts, about [\d½]+ hours/
	);
	await expect(toII.getByRole('link', { name: 'Start the route' })).toHaveAttribute(
		'href',
		/evening\/a-camera-for-gravity\/$/
	);
	const dots = toII.locator('svg a[data-rove]');
	expect(await dots.count()).toBeGreaterThan(10);
	await dots.first().focus();
	await expect(toII.locator('.tip')).toContainText('A camera for gravity');
	await page.keyboard.press('ArrowRight');
	await expect(toII.locator('.tip')).toContainText('How to read this book');

	// every numbered equation, as many tiles as the sentence counts
	const sentence = await page.locator('section.equations .head p').textContent();
	const [, derived, total] = sentence!.match(/(\d+) of (\d+) are derived in the tutorial/)!;
	await expect(page.locator('section.equations a.tile')).toHaveCount(Number(total));
	await expect(page.locator('section.equations a.tile.derived')).toHaveCount(Number(derived));
	await page.locator('section.equations a.tile').first().hover();
	await expect(page.locator('section.equations .reading')).toContainText(/\(1\) (derived|stated)/);

	await page.getByRole('link', { name: 'glossary', exact: true }).first().click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Glossary');
	await page.goto('/tutorial/symbols/');
	await expect(page.locator('#symbol-tidal-tensor .q-curv').first()).toBeVisible();
});

test('tutorial: the site header and the landing page link to the tutorial', async ({ page }) => {
	for (const path of ['/', '/paper/']) {
		await page.goto(path);
		await expect(page.locator('nav[aria-label="Site"] a', { hasText: 'Tutorial' })).toHaveAttribute(
			'href',
			/tutorial\/?$/
		);
	}
});

test('tutorial: the sample chapter renders every block, with no TeX left over', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/dev/tutorial-sample/');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('A sample chapter');
	await expect(page.locator('header .question')).toContainText('How much does the pull');
	await expect(page.locator('.needs .chip')).toHaveCount(2);
	for (const selector of [
		'details.plain',
		'details.box.derivation',
		'aside.box.gap',
		'section.box.example',
		'section.box.check',
		'section.box.problems',
		'aside.box.paper-uses',
		'aside.box.deeper',
		'details.box.history',
		'.equation.from-paper',
		'figure.plate.from-paper svg',
		'section.try svg',
		'ol.references li'
	])
		await expect(page.locator(selector).first(), selector).toBeAttached();
	// colour roles, equation numbers per chapter, the paper's own number on its equations
	await expect(page.locator('article .q-curv').first()).toBeVisible();
	await expect(page.locator('#eq\\:hessian .katex-tag, #eq\\:hessian .tag')).toHaveText('(2)');
	await expect(page.locator('#paper-eq\\:newton a')).toHaveAttribute('href', /paper\/#eq:newton$/);
	const text = await visibleText(page);
	expect(text).not.toMatch(/\\[A-Za-z]+/);
	expect(text).not.toContain('{{paper');
	expect(text).not.toMatch(/\$/);
	await expect(page.locator('.legend')).toBeAttached();
});

test('tutorial: boxes open when asked, answers and solutions stay hidden until then', async ({
	page
}) => {
	await page.goto('/dev/tutorial-sample/');
	for (const selector of ['details.plain', 'details.box.derivation', 'details.box.history']) {
		const box = page.locator(selector).first();
		await expect(box).not.toHaveAttribute('open', '');
		await box.locator('summary').click();
		await expect(box).toHaveAttribute('open', '');
	}
	const answer = page.locator('details.answer').first();
	await expect(answer.locator('.answer-body')).toBeHidden();
	await answer.locator('summary').click();
	await expect(answer.locator('.answer-body')).toBeVisible();
	expect(await page.locator('details.solution').count()).toBe(3);
	await expect(page.locator('details.solution .solution-body').first()).toBeHidden();
});

test('tutorial: margin notes stand in the margin when wide, and open below their line when narrow', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/dev/tutorial-sample/');
	const article = (await page.locator('article').boundingBox())!;
	const note = page.locator('.mn-body').first();
	await expect(note).toBeVisible();
	const box = (await note.boundingBox())!;
	expect(box.x).toBeGreaterThan(article.x + article.width);
	// level with the line that calls it
	const mark = (await page.locator('.mn-mark').first().boundingBox())!;
	expect(Math.abs(box.y - mark.y)).toBeLessThan(24);

	await page.setViewportSize({ width: 390, height: 844 });
	await page.reload();
	await hydrated(page);
	await expect(note).toBeHidden();
	await page.locator('.mn-mark').first().click();
	await expect(page.locator('.mn-mark').first()).toHaveAttribute('aria-expanded', 'true');
	await expect(note).toBeVisible();
	const narrow = (await note.boundingBox())!;
	expect(narrow.x + narrow.width).toBeLessThanOrEqual(390);
	await page.locator('.mn-mark').first().click();
	await expect(note).toBeHidden();
	// no page wider than the phone
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('tutorial: a symbol opens its card, and Escape closes it', async ({ page }) => {
	await page.goto('/dev/tutorial-sample/');
	await hydrated(page);
	const symbol = page.locator('article .symbol-tidal-tensor').first();
	await symbol.click();
	const card = page.locator('#symbol-card');
	await expect(card).toBeVisible();
	await expect(card).toContainText('Tidal tensor');
	await expect(card).toContainText('Curvature');
	await expect(symbol).toHaveAttribute('aria-expanded', 'true');
	await page.keyboard.press('Escape');
	await expect(card).toBeHidden();
	await expect(symbol).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(card).toBeVisible();
});

test('tutorial: the palette page shows three palettes on both grounds', async ({ page }) => {
	await page.goto('/tutorial/palette/');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
	const candidates = page.locator('.candidate');
	await expect(candidates).toHaveCount(3);
	await expect(candidates.first()).toHaveAttribute('aria-checked', 'true');
	await expect(page.locator('.verdict.pass')).toHaveCount(3);
	// three visions, each on umber and cream
	await expect(page.locator('.panel')).toHaveCount(6);
	const matter = () =>
		page
			.locator('.panel[data-theme-panel="dark"] .q-matter')
			.first()
			.evaluate((e) => getComputedStyle(e).color);
	const before = await matter();
	await candidates.nth(1).click();
	await expect(candidates.nth(1)).toHaveAttribute('aria-checked', 'true');
	expect(await matter()).not.toBe(before);
	expect(await page.locator('table').count()).toBe(2);
});

test('the paper: its margin points to the published chapters, as notes when wide and chips when narrow', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/paper/');
	await expect(page.locator('.equation').first()).toBeVisible();
	const notes = page.locator('aside.margin .note');
	await expect(notes.filter({ hasText: 'Tides, 1.4' }).first()).toBeAttached();
	await expect(notes.filter({ hasText: '3.7' }).first()).toBeAttached();
	// the run-in headings carry ids that the margin can be keyed to
	await expect(page.locator('h4.run-in[id="par:the-earths-own-tide"]')).toHaveCount(1);
	await page.setViewportSize({ width: 390, height: 900 });
	await page.goto('/paper/');
	await expect(page.locator('.tutorial-chip').first()).toBeAttached();
});

test('the paper: a margin note from the map stands level with its anchor and previews its chapter', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/dev/paper-margin/');
	const notes = page.locator('aside.margin .note');
	await expect(notes).toHaveCount(2);
	await expect(notes.first()).toContainText('Background');
	await expect(notes.first()).toContainText('A sample, X.1');
	// placed once the page has mounted and measured its anchors
	const offset = async () => {
		const anchor = (await page.locator('[id="eq:tidal"]').boundingBox())!;
		const note = (await notes.first().boundingBox())!;
		return { dy: Math.abs(note.y - anchor.y), right: note.x > anchor.x + anchor.width };
	};
	await expect.poll(async () => (await offset()).dy).toBeLessThan(3);
	expect((await offset()).right).toBe(true);
	await notes.first().hover();
	const preview = page.locator('#tutorial-preview');
	await expect(preview).toBeVisible();
	await expect(preview).toContainText('A sample chapter: the tide of one mass');
	await expect(preview.locator('.katex').first()).toBeVisible();
	await expect(page.locator('.tutorial-chip').first()).toBeHidden();

	await page.setViewportSize({ width: 390, height: 844 });
	await page.reload();
	await expect(page.locator('aside.margin')).toBeHidden();
	const chip = page.locator('.tutorial-chip').first();
	await expect(chip).toBeVisible();
	await expect(chip).toHaveText('Background · A sample, X.1');
	await chip.focus();
	await expect(preview).toBeVisible();
	await chip.click();
	await expect(page).toHaveURL(/\/dev\/tutorial-sample\/$/);
});

test('a chapter shows its own figures, numbered, drawn in the theme’s colours', async ({
	page
}) => {
	await page.goto('/tutorial/noise/blur-law/');
	const sheets = page.locator('figure[id="fig:sheets"]');
	await expect(sheets.locator('svg.drawing')).toHaveCount(1);
	await expect(sheets.locator('figcaption')).toContainText('Figure 1.');
	await expect(page.locator('figure[id="fig:ripples"] figcaption')).toContainText('Figure 2.');
	// the palette is swapped for the theme's variables, so no ink of the paper's own colours is left
	const html = await sheets.locator('svg.drawing').evaluate((s) => s.outerHTML);
	expect(html).toContain('var(--text)');
	expect(html).not.toMatch(/#1c1a16|#b0560a|#2a67ad/);
});
