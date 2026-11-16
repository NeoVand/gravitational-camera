import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { screenPosition } from '../src/lib/engine/camera';

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
	expect(report, report).toContain('all 4 passed');
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

	/** Set the sensitivity and wait for a frame drawn with the new blur. */
	const setSensitivity = async (decades: string, readout: string) => {
		const before = await canvas.getAttribute('data-near-blur');
		await sensitivity.fill(decades);
		await expect(page.locator('output[for="sensitivity"]')).toContainText(readout);
		await expect
			.poll(() => canvas.getAttribute('data-near-blur'), { timeout: 30_000 })
			.not.toBe(before);
		await settle();
	};

	await setSensitivity('40', 'blur 2.0°');
	const sharp = await levels();

	await setSensitivity('2', 'blur 39.1°');
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

// --- the room demos: sample the picture where the camera says an object is ---

type Point = [number, number, number];

const DEG = Math.PI / 180;

function sceneObject(name: string, id: string): { center: Point } {
	const scene = JSON.parse(
		readFileSync(new URL(`../../scenes/${name}.scene.json`, import.meta.url), 'utf8')
	);
	const o = scene.objects.find((x: { id: string }) => x.id === id);
	if (!o) throw new Error(`no ${id} in ${name}`);
	return o.shape;
}

/** Open a demo in readback mode and return helpers to read its picture. */
async function openDemo(page: Page, path: string, look: { yaw: number; pitch: number }) {
	await page.goto(`${path}?present=readback`);
	const canvas = page.locator('canvas');
	const frames = async () => Number(await canvas.getAttribute('data-frames'));
	await expect.poll(frames, { timeout: 60_000 }).toBeGreaterThan(0);
	const view = { yaw: look.yaw * DEG, pitch: look.pitch * DEG, fov: 58 * DEG };

	return {
		/**
		 * Change something and wait until a frame drawn with the divider at `split`
		 * (1: all light, 0: all gravity) is on screen.
		 */
		async show(split: number, change: () => Promise<void>) {
			await change();
			await expect
				.poll(() => canvas.getAttribute('data-split'), { timeout: 30_000 })
				.toBe(String(split));
		},
		/** Mean red, green and blue (0 to 255) of a small patch around a point in the room. */
		async at(point: Point, observer: Point = [0, 1.5, 0]) {
			const size = await canvas.evaluate((c: HTMLCanvasElement) => [c.width, c.height]);
			const d: Point = [point[0] - observer[0], point[1] - observer[1], point[2] - observer[2]];
			const n = Math.hypot(...d);
			const xy = screenPosition(view, size[0], size[1], [d[0] / n, d[1] / n, d[2] / n]);
			if (!xy) throw new Error('point is behind the camera');
			return canvas.evaluate((c: HTMLCanvasElement, [x, y]) => {
				const r = 3;
				const data = c
					.getContext('2d')!
					.getImageData(Math.round(x) - r, Math.round(y) - r, 2 * r + 1, 2 * r + 1).data;
				const mean = [0, 0, 0];
				for (let i = 0; i < data.length; i += 4) for (let k = 0; k < 3; k++) mean[k] += data[i + k];
				return mean.map((v) => v / (data.length / 4));
			}, xy);
		}
	};
}

const distance = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

test('blank mirror: the reflection is there in light and absent in gravity', async ({ page }) => {
	const demo = await openDemo(page, '/demo/blank-mirror/', { yaw: 13, pitch: -6 });
	// where the figure's torso shows in the mirror, and a plain stretch of mirror beside it
	const twin: Point = [-1.91, 1.25, -7.97];
	const plain: Point = [-1.3, 1.25, -7.97];

	await demo.show(1, () => page.getByLabel('Gravity', { exact: true }).uncheck());
	const light = { twin: await demo.at(twin), plain: await demo.at(plain) };

	await demo.show(0, async () => {
		await page.getByLabel('Gravity', { exact: true }).check();
		await page.getByLabel('Light', { exact: true }).uncheck();
	});
	const gravity = { twin: await demo.at(twin), plain: await demo.at(plain) };

	const detail = JSON.stringify({ light, gravity });
	expect(distance(light.twin, light.plain), detail).toBeGreaterThan(40);
	expect(distance(gravity.twin, gravity.plain), detail).toBeLessThan(8);
});

test('closed furnace: the hot iron glows through the steel, the cold one does not', async ({
	page
}) => {
	const demo = await openDemo(page, '/demo/closed-furnace/', { yaw: 13, pitch: -13 });
	await demo.show(0, () => page.getByLabel('Light', { exact: true }).uncheck());
	const hot = await demo.at(sceneObject('closed-furnace', 'furnace-right-charge').center);
	const cold = await demo.at(sceneObject('closed-furnace', 'furnace-left-charge').center);
	const detail = JSON.stringify({ hot, cold });
	expect(hot[0], detail).toBeGreaterThan(cold[0] + 80);
	// warm colours: red leads blue in the glow
	expect(hot[0], detail).toBeGreaterThan(hot[2] + 60);
});

test('honey and water: honey glows, water barely does', async ({ page }) => {
	const demo = await openDemo(page, '/demo/honey-and-water/', { yaw: 0, pitch: -12 });
	await demo.show(0, () => page.getByLabel('Light', { exact: true }).uncheck());
	const honey = await demo.at(sceneObject('honey-and-water', 'bottle-left-contents').center);
	const water = await demo.at(sceneObject('honey-and-water', 'bottle-right-contents').center);
	expect(honey[0], JSON.stringify({ honey, water })).toBeGreaterThan(water[0] + 80);
});
