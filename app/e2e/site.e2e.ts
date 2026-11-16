import { expect, test } from '@playwright/test';

test('landing page links to the demos and the paper', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Gravitational Camera');
	await expect(page.getByRole('link', { name: 'Open the demos' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Read the paper' })).toBeVisible();
});

test('paper renders its equations, cross-references and bibliography', async ({ page }) => {
	await page.goto('/paper/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Gravitational Camera');
	expect(await page.locator('.equation .katex').count()).toBeGreaterThanOrEqual(8);
	await expect(page.locator('a.xref').first()).toBeVisible();
	expect(await page.locator('ol.references li').count()).toBeGreaterThanOrEqual(5);
	// nothing from the LaTeX source may leak through unrendered
	await expect(page.locator('article')).not.toContainText('\\ref');
	await expect(page.locator('article')).not.toContainText('\\cite');
});

test('GPU self-test agrees with the reference implementation', async ({ page }) => {
	await page.goto('/dev/selftest/');
	await expect(page.locator('#summary')).not.toHaveText('running', { timeout: 60_000 });
	const report = await page.locator('main').innerText();
	expect(report, report).toContain('all 2 passed');
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
