import { expect, test } from '@playwright/test';

test('landing page links to the demos and the paper', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Gravitational Camera');
	await expect(page.getByRole('link', { name: 'Open the demos' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Read the paper' })).toBeVisible();
});

test('paper renders its equations, figures, cross-references and bibliography', async ({
	page
}) => {
	await page.goto('/paper/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Gravitational Camera');
	expect(await page.locator('.equation .katex').count()).toBeGreaterThanOrEqual(18);
	expect(await page.locator('nav.contents li').count()).toBe(11);
	expect(await page.locator('aside.plain').count()).toBeGreaterThanOrEqual(6);
	await expect(page.locator('a.xref').first()).toBeVisible();
	expect(await page.locator('ol.references li').count()).toBeGreaterThanOrEqual(10);
	// every figure has something drawn in it
	const figures = page.locator('figure.plate');
	expect(await figures.count()).toBe(8);
	for (const figure of await figures.all()) {
		expect(await figure.locator('svg, canvas').count()).toBeGreaterThan(0);
	}
	// nothing from the LaTeX source may leak through unrendered
	await expect(page.locator('article')).not.toContainText('\\ref');
	await expect(page.locator('article')).not.toContainText('\\cite');
});

test('near-field figure responds: more sensitivity separates the two masses', async ({ page }) => {
	await page.goto('/paper/');
	const figure = page.locator('[id="fig:nearfield"]');
	const sensitivity = figure.getByLabel('Sensitivity');
	await sensitivity.fill('1');
	await expect(figure).toContainText('merge into one');
	await sensitivity.fill('40');
	await expect(figure).toContainText('told apart');
});

test('theme switch changes the page colours and is remembered', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/paper/');
	const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
	const dark = await background();
	await page.getByRole('button', { name: 'Switch between light and dark' }).click();
	const light = await background();
	expect(light).not.toBe(dark);
	await page.reload();
	expect(await background()).toBe(light);
});

test('GPU self-test agrees with the reference implementation', async ({ page }) => {
	await page.goto('/dev/selftest/');
	await expect(page.locator('#summary')).not.toHaveText('running', { timeout: 60_000 });
	const report = await page.locator('main').innerText();
	expect(report, report).toContain('all 3 passed');
});

test('demo draws frames and responds to its controls', async ({ page }) => {
	// headless browsers do not composite WebGPU canvases, so read frames back
	await page.goto('/demo/sun-at-midnight/?present=readback');
	const canvas = page.locator('canvas');
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-frames')), { timeout: 60_000 })
		.toBeGreaterThan(0);

	const sample = () =>
		page.evaluate(() => {
			const c = document.querySelector('canvas')!;
			const g = c.getContext('2d')!;
			const at = (fx: number, fy: number) =>
				Array.from(g.getImageData(Math.floor(c.width * fx), Math.floor(c.height * fy), 1, 1).data);
			return { light: at(0.1, 0.8), gravity: at(0.9, 0.8) };
		});
	const before = await sample();
	const sum = (p: number[]) => p[0] + p[1] + p[2];
	expect(sum(before.gravity)).toBeGreaterThan(sum(before.light));

	// turning the light view off hands the whole picture to gravity
	const frames = Number(await canvas.getAttribute('data-frames'));
	await page.getByLabel('Light', { exact: true }).uncheck();
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-frames')))
		.toBeGreaterThan(frames);
	const after = await sample();
	expect(sum(after.light)).toBeGreaterThan(sum(before.light) + 30);
});

test('near-field demo: gold shows through steel, and blurs away at low sensitivity', async ({
	page
}) => {
	await page.goto('/demo/locked-safe/?present=readback');
	const canvas = page.locator('canvas');
	const frames = async () => Number(await canvas.getAttribute('data-frames'));
	await expect.poll(frames, { timeout: 60_000 }).toBeGreaterThan(0);

	/** Wait until the picture has stopped changing. */
	const settle = async () => {
		let last = -1;
		await expect
			.poll(
				async () => {
					const now = await frames();
					const steady = now === last;
					last = now;
					return steady;
				},
				{ intervals: [500], timeout: 20_000 }
			)
			.toBe(true);
	};
	/** Brightest and median level over the picture, 0 to 765. */
	const levels = () =>
		page.evaluate(() => {
			const c = document.querySelector('canvas')!;
			const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
			const sums: number[] = [];
			for (let i = 0; i < data.length; i += 4 * 97) sums.push(data[i] + data[i + 1] + data[i + 2]);
			sums.sort((a, b) => a - b);
			return { peak: sums[sums.length - 1], median: sums[Math.floor(sums.length / 2)] };
		});

	// hide the outline of the light picture so only the mass image is measured
	await page.getByLabel('Outline').uncheck();
	await page.getByLabel('Light', { exact: true }).uncheck();
	const sensitivity = page.getByLabel('Sensitivity');

	await sensitivity.fill('40');
	await expect(page.locator('output[for="sensitivity"]')).toContainText('blur 2.0°');
	await settle();
	const sharp = await levels();

	await sensitivity.fill('2');
	await expect(page.locator('output[for="sensitivity"]')).toContainText('blur 39.1°');
	await settle();
	const blurred = await levels();

	// sharp: the gold is the brightest thing in view; blurred: it has melted away
	expect(sharp.peak, JSON.stringify({ sharp, blurred })).toBeGreaterThan(blurred.peak + 60);
});

test('near-field demo can show what the pixels record', async ({ page }) => {
	await page.goto('/demo/full-or-empty/?present=readback');
	await expect
		.poll(async () => Number(await page.locator('canvas').getAttribute('data-frames')), {
			timeout: 60_000
		})
		.toBeGreaterThan(0);
	await page.getByRole('button', { name: 'Raw pixels' }).click();
	await expect(page.locator('.field ellipse')).toHaveCount(77);
});
