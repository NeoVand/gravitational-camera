import { readdirSync, readFileSync } from 'node:fs';
import { devices, expect, test, type Page } from '@playwright/test';
import { screenPosition } from '../src/lib/engine/camera';

/**
 * A page of the site opens in plain words; most of these tests work its controls, so they start as a reader who
 * last chose the Controls tab would (the page keeps the tab chosen). A test tagged @fresh starts as a first visit.
 */
test.beforeEach(async ({ page }, testInfo) => {
	if (testInfo.tags.includes('@fresh')) return;
	await page.addInitScript(() => {
		const kept = 'gravitational-camera:sidebar';
		if (!localStorage.getItem(kept))
			localStorage.setItem(kept, JSON.stringify({ open: true, tab: 'controls' }));
	});
});

test('landing page links to the demos and the paper', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Gravitational Camera');
	const start = page.getByRole('navigation', { name: 'Start' });
	await expect(start.getByRole('link', { name: 'Open the demos' })).toBeVisible();
	await expect(start.getByRole('link', { name: 'Read the paper' })).toBeVisible();
});

test('landing picture: dragging turns the view, and the wheel still scrolls the page', async ({
	page
}) => {
	await page.goto('/?present=readback');
	const canvas = page.locator('canvas');
	const frames = async () => Number(await canvas.getAttribute('data-frames'));
	await expect.poll(frames, { timeout: 60_000 }).toBeGreaterThan(0);
	const sample = () =>
		page.evaluate(() => {
			const c = document.querySelector('canvas')!;
			const g = c.getContext('2d')!;
			return Array.from(g.getImageData(0, 0, c.width, c.height).data).reduce((a, b) => a + b, 0);
		});
	const before = await sample();
	const drawn = await frames();
	// the picture sits under the title: bring it into the window, then drag across its right-hand
	// (gravity) side, clear of the divider
	await canvas.scrollIntoViewIfNeeded();
	const box = (await canvas.boundingBox())!;
	await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.3, { steps: 8 });
	await page.mouse.up();
	await expect.poll(frames, { timeout: 60_000 }).toBeGreaterThan(drawn);
	expect(await sample()).not.toBe(before);
	// the wheel over the picture scrolls the page instead of zooming
	const scrolled = await page.evaluate(() => window.scrollY);
	await page.mouse.wheel(0, 600);
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrolled + 100);
});

test('paper renders its equations, figures, cross-references and bibliography', async ({
	page
}) => {
	await page.goto('/paper/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Gravitational Camera: A Thought Experiment'
	);
	expect(await page.locator('.equation .katex').count()).toBeGreaterThanOrEqual(18);
	// seventeen numbered sections and three appendices
	expect(await page.locator('nav.contents li').count()).toBe(20);
	// the plain-language summaries, one at the head of each main section, closed until opened
	const plain = page.locator('details.plain');
	expect(await plain.count()).toBe(15);
	expect(await page.locator('details.plain[open]').count()).toBe(0);
	await plain.first().locator('summary').click();
	await expect(plain.first()).toHaveAttribute('open', '');
	await expect(plain.first().locator('p').first()).toBeVisible();
	await expect(page.locator('a.xref').first()).toBeVisible();
	expect(await page.locator('ol.references li').count()).toBeGreaterThanOrEqual(10);
	// every reference names its authors: in a list ordered by citation a dash for "the same author as
	// above" would point at the wrong entry
	for (const entry of await page.locator('ol.references li').allTextContents()) {
		expect(entry.trim()).not.toMatch(/^\W*[—–-]{2,}/);
	}
	// every figure in the LaTeX source is on the page, with something drawn in it
	const sections = new URL('../../paper/sections/', import.meta.url);
	const inSource = readdirSync(sections)
		.filter((f) => f.endsWith('.tex'))
		.map(
			(f) =>
				(readFileSync(new URL(f, sections), 'utf8').match(/\\begin\{figure\*?\}/g) ?? []).length
		)
		.reduce((a, b) => a + b, 0);
	const figures = page.locator('figure.plate');
	expect(await figures.count()).toBe(inSource);
	// the paper's figures are all drawings, inlined in the theme's colours
	expect(await page.locator('svg.drawing').count()).toBe(inSource);
	await expect(page.locator('svg.drawing [fill="var(--text)"]').first()).toBeAttached();
	for (const figure of await figures.all()) {
		expect(await figure.locator('svg, canvas, img').count()).toBeGreaterThan(0);
		for (const img of await figure.locator('img').all()) {
			await img.scrollIntoViewIfNeeded();
			await expect
				.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth))
				.toBeGreaterThan(0);
		}
	}
	// nothing from the LaTeX source may leak through unrendered
	await expect(page.locator('article')).not.toContainText('\\ref');
	await expect(page.locator('article')).not.toContainText('\\cite');
});

test('near-field figure responds: more sensitivity separates the two masses', async ({ page }) => {
	await page.goto('/paper/');
	const figure = page.locator('[id="fig:nearfield"]');
	// the live version opens under the paper's drawing
	await figure.getByText('Try it: change the sensitivity').click();
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

test('the Moon: lit grey in light, a faint warm glow in gravity', async ({ page }) => {
	await page.goto('/demo/sun-at-midnight/?present=readback');
	const canvas = page.locator('canvas');
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-frames')), { timeout: 60_000 })
		.toBeGreaterThan(0);
	const frames = Number(await canvas.getAttribute('data-frames'));
	// the divider is moved off the middle first, so that Find the Moon has to bring it back
	const divider = page.getByRole('slider', {
		name: 'Divider between the light view and the gravity view'
	});
	await divider.focus();
	await page.keyboard.press('Shift+ArrowLeft');
	await page.keyboard.press('Shift+ArrowLeft');
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-split')), { timeout: 30_000 })
		.toBeLessThan(0.45);
	await page.getByRole('button', { name: 'Find the Moon' }).click();
	// the Moon sits on the divider: half of it in each picture
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-split')), { timeout: 30_000 })
		.toBeCloseTo(0.5, 2);
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-frames')), { timeout: 60_000 })
		.toBeGreaterThan(frames);
	const [light, gravity, sky] = await page.evaluate(() => {
		const c = document.querySelector('canvas')!;
		const g = c.getContext('2d')!;
		const at = (fx: number, fy: number) =>
			Array.from(g.getImageData(Math.floor(c.width * fx), Math.floor(c.height * fy), 1, 1).data);
		return [at(0.47, 0.5), at(0.53, 0.5), at(0.1, 0.5)];
	});
	const sum = (p: number[]) => p[0] + p[1] + p[2];
	// moonlight is grey and far brighter than the night sky beside it
	expect(sum(light)).toBeGreaterThan(sum(sky) + 200);
	expect(Math.abs(light[0] - light[2])).toBeLessThan(40);
	// the Moon's own warmth: dimmer, and red rather than grey
	expect(sum(gravity)).toBeGreaterThan(60);
	expect(gravity[0]).toBeGreaterThan(gravity[2] + 40);
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

	await setSensitivity('40', 'blur 2.6°');
	const sharp = await levels();

	await setSensitivity('2', 'blur 31.5°');
	const blurred = await levels();

	// sharp: the gold is the brightest thing in view; blurred: it has melted away
	expect(sharp.peak, JSON.stringify({ sharp, blurred })).toBeGreaterThan(blurred.peak + 60);
});

test('near-field demo can show the tidal field as a coloured slice', async ({ page }) => {
	await page.goto('/demo/full-or-empty/?present=readback');
	const canvas = page.locator('canvas');
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-frames')), { timeout: 60_000 })
		.toBeGreaterThan(0);
	await page.getByLabel('Light', { exact: true }).uncheck();
	await page.getByRole('button', { name: 'Tidal field' }).click();
	await expect(page.locator('.tag.right')).toHaveText('Gravity · tidal field');
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 30_000 }).toBe('4');
	await expect.poll(() => canvas.getAttribute('data-split'), { timeout: 30_000 }).toBe('0');
	// a wash coloured by the direction of the stretch: much of the picture is coloured, not grey
	const coloured = await page.evaluate(() => {
		const c = document.querySelector('canvas')!;
		const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
		let n = 0;
		let total = 0;
		for (let i = 0; i < d.length; i += 4 * 53) {
			const hi = Math.max(d[i], d[i + 1], d[i + 2]);
			const lo = Math.min(d[i], d[i + 1], d[i + 2]);
			total++;
			if (hi - lo > 40) n++;
		}
		return n / total;
	});
	expect(coloured).toBeGreaterThan(0.3);
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
	// where the bronze ball shows in the mirror, and a plain stretch of mirror beside it
	const twin: Point = [-1.91, 1.27, -7.97];
	const plain: Point = [-1.3, 1.27, -7.97];

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

test('closed furnace: both blocks show through the steel, the hot one far the brighter', async ({
	page
}) => {
	const demo = await openDemo(page, '/demo/closed-furnace/', { yaw: 13, pitch: -13 });
	await demo.show(0, () => page.getByLabel('Light', { exact: true }).uncheck());
	const block = sceneObject('closed-furnace', 'furnace-left-charge').center;
	const hot = await demo.at(sceneObject('closed-furnace', 'furnace-right-charge').center);
	const cold = await demo.at(block);
	// the air over the cold block, inside the same furnace: air is given no friction, so only the steel glows there
	const air = await demo.at([block[0], 0.8, block[2]]);
	const detail = JSON.stringify({ hot, cold, air });
	expect(hot[0], detail).toBeGreaterThan(cold[0] + 80);
	// warm colours: red leads blue in the glow
	expect(hot[0], detail).toBeGreaterThan(hot[2] + 60);
	// the cold iron sends as much per volume as the steel, and the line through it holds six times the metal
	expect(cold[0], detail).toBeGreaterThan(air[0] + 5);
});

test('honey and water: both glow, the honey by a small factor more, not by its viscosity', async ({
	page
}) => {
	const demo = await openDemo(page, '/demo/honey-and-water/', { yaw: 14, pitch: -12 });
	await demo.show(0, () => page.getByLabel('Light', { exact: true }).uncheck());
	const honey = await demo.at(sceneObject('honey-and-water', 'bottle-left-contents').center);
	const water = await demo.at(sceneObject('honey-and-water', 'bottle-right-contents').center);
	// between the bottles the line of sight passes over the table to the floor, whose glow starts taken away
	const between = await demo.at([0, 1.0, -2.2]);
	const detail = JSON.stringify({ honey, water, between });
	expect(honey[0], detail).toBeGreaterThan(water[0] + 10);
	expect(water[0], detail).toBeGreaterThan(between[0] + 40);
	await openTab(page, 'Physics');
	await expect(page.getByText(/the honey here is 3\.8 times as bright as the water/)).toBeVisible();
});

test('which way it turns: the polarization tells the sense of turning', async ({ page }) => {
	const demo = await openDemo(page, '/demo/which-way/', { yaw: 1, pitch: 0 });
	const canvas = page.locator('canvas');
	await demo.show(0, () => page.getByLabel('Light', { exact: true }).uncheck());
	const centre = (name: string) => sceneObject('which-way', `drum-${name}`).center;
	const top = await demo.at(centre('top'));
	const middle = await demo.at(centre('middle'));
	const bottom = await demo.at(centre('bottom'));
	const detail = JSON.stringify({ top, middle, bottom });
	// top turns clockwise: green; middle anticlockwise: magenta; bottom is still: dark
	expect(top[1], detail).toBeGreaterThan(top[0] + 40);
	expect(middle[0], detail).toBeGreaterThan(middle[1] + 40);
	expect(middle[2], detail).toBeGreaterThan(middle[1] + 40);
	expect(bottom[0] + bottom[1] + bottom[2], detail).toBeLessThan((top[0] + top[1] + top[2]) / 2);

	// at the true speed of light there is no wave image, and the page says why
	await page.getByRole('button', { name: 'True speed' }).click();
	await expect(page.getByText('deep inside their near zone')).toBeVisible();
	await expect.poll(() => canvas.getAttribute('data-waves'), { timeout: 30_000 }).toBe('0');
	await expect(page.locator('.tag.right')).toHaveText('Gravity · waves');
});

test('sealed flywheel: the flow of the turning wheel shows as an anticlockwise vortex', async ({
	page
}) => {
	await page.goto('/demo/sealed-flywheel/?present=readback');
	await expect(page.locator('.tag.right')).toHaveText('Gravity · near field and flow');
	await expect(page.getByText('Smallest detail at 3.8 m')).toBeVisible();
	const picture = page.locator('.flow img');
	await expect(picture).toHaveCount(1, { timeout: 30_000 });
	// the flow's direction is its hue: leftward is yellow, rightward magenta. Turning anticlockwise as seen,
	// the wheel's flow runs left across its top and right across its bottom.
	const ends = await picture.evaluate(async (img: HTMLImageElement) => {
		await img.decode();
		const c = document.createElement('canvas');
		c.width = img.naturalWidth;
		c.height = img.naturalHeight;
		const g = c.getContext('2d')!;
		g.drawImage(img, 0, 0);
		const d = g.getImageData(0, 0, c.width, c.height).data;
		let sx = 0,
			sy = 0,
			sw = 0,
			top = c.height,
			bottom = 0;
		for (let j = 0; j < c.height; j++)
			for (let i = 0; i < c.width; i++) {
				const a = d[(j * c.width + i) * 4 + 3];
				if (a > 150) {
					sx += i * a;
					sy += j * a;
					sw += a;
					top = Math.min(top, j);
					bottom = Math.max(bottom, j);
				}
			}
		const cx = Math.round(sx / sw),
			cy = Math.round(sy / sw),
			r = (bottom - top) / 4;
		const at = (j: number) =>
			Array.from(d.slice((j * c.width + cx) * 4, (j * c.width + cx) * 4 + 3));
		return { up: at(Math.round(cy - r)), down: at(Math.round(cy + r)) };
	});
	const [ur, ug, ub] = ends.up;
	const [dr, dg, db] = ends.down;
	expect(ug - ub, JSON.stringify(ends)).toBeGreaterThan(40); // yellow above: flowing left
	expect(db - dg, JSON.stringify(ends)).toBeGreaterThan(40); // magenta below: flowing right
	expect(ur).toBeGreaterThan(150);
	expect(dr).toBeGreaterThan(150);
	await page.getByLabel('Flow', { exact: true }).uncheck();
	await expect(picture).toHaveCount(0);
});

test('a beam in the dark: the beam shows in gravity as a line', async ({ page }) => {
	const demo = await openDemo(page, '/demo/beam-in-the-dark/', { yaw: 0, pitch: -4 });
	await expect(page.getByText('Smallest detail at 5.5 m')).toBeVisible();
	await demo.show(0, () => page.getByLabel('Light', { exact: true }).uncheck());
	const beam = sceneObject('beam-in-the-dark', 'beam').center;
	const onBeam = await demo.at([-0.6, beam[1], beam[2]]);
	const above = await demo.at([-0.6, beam[1] + 0.7, beam[2]]);
	const sum = (c: number[]) => c[0] + c[1] + c[2];
	expect(sum(onBeam), JSON.stringify({ onBeam, above })).toBeGreaterThan(sum(above) + 60);
});

// --- the vistas -----------------------------------------------------------------

/** Mean colour of a small square of the canvas, at fractions of its width and height. */
async function sample(page: Page, fx: number, fy: number, r = 3) {
	return page.locator('canvas').evaluate(
		(c: HTMLCanvasElement, [fx, fy, r]) => {
			const x = Math.round(fx * c.width);
			const y = Math.round(fy * c.height);
			const data = c.getContext('2d')!.getImageData(x - r, y - r, 2 * r + 1, 2 * r + 1).data;
			const mean = [0, 0, 0];
			for (let i = 0; i < data.length; i += 4) for (let k = 0; k < 3; k++) mean[k] += data[i + k];
			return mean.map((v) => v / (data.length / 4));
		},
		[fx, fy, r] as const
	);
}

/** Open one of the sidebar's tabs, whatever is open now. */
async function openTab(page: Page, name: string) {
	const tab = page.getByRole('tab', { name, exact: true });
	if ((await tab.getAttribute('aria-selected')) !== 'true') await tab.click();
	await expect(tab).toHaveAttribute('aria-selected', 'true');
}

/** The demo's frame has read what it kept and answers clicks. */
async function shellReady(page: Page) {
	await page.locator('main[data-ready]').waitFor();
}

async function firstFrame(page: Page) {
	const frames = async () => Number(await page.locator('canvas').getAttribute('data-frames'));
	await expect.poll(frames, { timeout: 60_000 }).toBeGreaterThan(0);
}

async function framesAfter(page: Page, action: () => Promise<unknown>) {
	const canvas = page.locator('canvas');
	const frames = async () => Number(await canvas.getAttribute('data-frames'));
	await expect.poll(frames, { timeout: 60_000 }).toBeGreaterThan(0);
	const before = await frames();
	await action();
	await expect.poll(frames, { timeout: 30_000 }).toBeGreaterThan(before);
}

test('the Milky Way: dust hides the centre from light, not from the waves', async ({ page }) => {
	await page.goto('/demo/milky-way/?present=readback');
	await firstFrame(page);
	// the divider is in the middle: the centre of the Galaxy is on the line; look just either side
	const light = await sample(page, 0.47, 0.5);
	const waves = await sample(page, 0.53, 0.5);
	const detail = JSON.stringify({ light, waves });
	// in the waves the centre is near white, in light the dust lane darkens it
	expect(waves[1], detail).toBeGreaterThan(200);
	expect(waves[1], detail).toBeGreaterThan(light[1] + 30);
	// the first light: a nearly uniform glow, cream in the middle of its scale
	await framesAfter(page, () => page.getByRole('button', { name: 'The first light' }).click());
	await expect(page.locator('canvas')).toHaveAttribute('data-right', 'primordial');
});

test('a black hole: its shadow is black in both pictures and shrinks with distance', async ({
	page
}) => {
	await page.goto('/demo/black-hole/?present=readback');
	await firstFrame(page);
	const dark = (c: number[]) => c[0] + c[1] + c[2] < 15;
	// the hole is at the centre of the view, on the divider
	expect(dark(await sample(page, 0.47, 0.5))).toBe(true);
	expect(dark(await sample(page, 0.53, 0.5))).toBe(true);
	const shadowWidth = () =>
		page.locator('canvas').evaluate((c: HTMLCanvasElement) => {
			const y = Math.round(c.height / 2);
			const row = c.getContext('2d')!.getImageData(0, y, c.width, 1).data;
			let n = 0;
			for (let i = 0; i < row.length; i += 4) if (row[i] + row[i + 1] + row[i + 2] < 15) n += 1;
			return n / c.width;
		});
	const near = await shadowWidth();
	await framesAfter(page, () => page.getByLabel('Distance').fill('2.3'));
	const far = await shadowWidth();
	expect(far, JSON.stringify({ near, far })).toBeLessThan(near / 2);
	await expect(page.getByText('Angular radius of the shadow')).toBeVisible();
});

test('two black holes: the field turns, and stops when told to', async ({ page }) => {
	await page.goto('/demo/two-black-holes/');
	const canvas = page.locator('canvas');
	const frames = async () => Number(await canvas.getAttribute('data-frames'));
	await expect.poll(frames, { timeout: 30_000 }).toBeGreaterThan(5);
	// the field turns: a pixel's colour moves on, however slowly the frames come (on the software adapter
	// a fixed wait can catch the turn where that pixel barely changes)
	const a = await sample(page, 0.75, 0.5);
	await expect
		.poll(async () => distance(a, await sample(page, 0.75, 0.5)), { timeout: 15_000 })
		.toBeGreaterThan(5);
	// still: the loop keeps drawing with the clock stopped, so frames drawn after the click agree
	await page.getByRole('button', { name: 'Paused', exact: true }).click();
	const stopped = await frames();
	await expect.poll(frames, { timeout: 30_000 }).toBeGreaterThan(stopped + 1);
	const c = await sample(page, 0.75, 0.5);
	const held = await frames();
	// long enough for a running field to have moved on, and at least two frames drawn meanwhile
	await page.waitForTimeout(400);
	await expect.poll(frames, { timeout: 30_000 }).toBeGreaterThan(held + 1);
	const d = await sample(page, 0.75, 0.5);
	expect(distance(c, d), JSON.stringify({ c, d })).toBeLessThan(1);
});

test('principal null directions: gravity has four, light two, and a moving body is read exactly', async ({
	page
}) => {
	await page.goto('/figures/four-stars/');
	const skies = page.locator('svg.sky');
	await expect(skies).toHaveCount(2);
	await expect(skies.nth(0).locator('circle.star')).toHaveCount(4);
	await expect(skies.nth(1).locator('circle.star')).toHaveCount(2);
	await expect(page.getByText('like one round body (Petrov type D)')).toBeVisible();
	// the sideways speed read from the stars equals the true one, before and after the body is dragged
	const speeds = async () =>
		(
			await page
				.locator('dd', { has: page.locator('.katex') })
				.first()
				.innerText()
		).split('⋅');
	const [read, truth] = await speeds();
	expect(read.trim()).toBe(truth.trim());
	const body = skies.nth(0).locator('[data-source="0"]');
	const box = (await body.boundingBox())!;
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 - 60, { steps: 6 });
	await page.mouse.up();
	const [read2, truth2] = await speeds();
	expect(read2.trim()).toBe(truth2.trim());
	expect(truth2.trim()).not.toBe(truth.trim());
	await page.getByRole('button', { name: 'Two', exact: true }).click();
	await expect(page.getByText('not one round body or one wave (type I)')).toBeVisible();
	await expect(skies.nth(1).locator('circle.star')).toHaveCount(2);
	await page.getByRole('button', { name: 'A wave', exact: true }).click();
	await expect(page.getByText('one plane wave (type N)')).toBeVisible();
	await expect(skies.nth(0).locator('circle.star')).toHaveCount(4);
});

test('four waves: one gravitational pixel finds four waves, light none; with two, both find them', async ({
	page
}) => {
	await page.goto('/figures/four-voices/');
	const skies = page.locator('svg.sky');
	await expect(skies.nth(0).getByText('found 4 of 4')).toBeVisible();
	await expect(skies.nth(1).getByText('4 waves fill all 6 numbers: nothing to find')).toBeVisible();
	await expect(skies.nth(0).locator('circle.found')).toHaveCount(4);
	const slider = page.locator('#count');
	await slider.focus();
	await page.keyboard.press('ArrowLeft');
	await page.keyboard.press('ArrowLeft');
	await expect(skies.nth(0).getByText('found 2 of 2')).toBeVisible();
	await expect(skies.nth(1).getByText('found 2 of 2')).toBeVisible();
});

test('now and then: the scene runs, and a stop is held until the body is let go', async ({
	page
}) => {
	await page.goto('/figures/now-and-then/');
	const canvas = page.locator('canvas');
	const frames = async () => Number(await canvas.getAttribute('data-frames'));
	await expect.poll(frames, { timeout: 30_000 }).toBeGreaterThan(5);
	const stop = page.getByRole('button', { name: 'Stop it', exact: true });
	await stop.click();
	await expect(stop).toHaveAttribute('aria-pressed', 'true');
	const drawn = await frames();
	await expect.poll(frames).toBeGreaterThan(drawn);
	await page.getByRole('button', { name: 'Moving', exact: true }).click();
	await expect(stop).toHaveAttribute('aria-pressed', 'false');
});

test('own velocity: gravity reads the pixel’s speed exactly, and a walking person turns the motion test on', async ({
	page
}) => {
	await page.goto('/figures/speedometer/');
	await expect(page.getByText('all still', { exact: true })).toBeVisible();
	// the first reading, gravity's, is the pixel's own speed; the readings are under Physics
	await openTab(page, 'Physics');
	const speed = page.locator('dt', { hasText: 'Gravity reads the speed' }).locator('+ dd');
	await expect(speed).toContainText('0.6000');
	await openTab(page, 'Controls');
	await page.getByRole('button', { name: 'Walks', exact: true }).click();
	await expect(page.getByText('something moves', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Still', exact: true }).click();
	await expect(page.getByText('all still', { exact: true })).toBeVisible();
});

test('ranging: the split reaches farther than the rank, and farther still with more signal', async ({
	page
}) => {
	await page.goto('/figures/ranging/');
	await expect(page.locator('.reads').getByText('lost in the noise')).toBeVisible();
	await expect(page.getByText(/split: reaches \d+/)).toBeVisible();
	const reachOf = async () =>
		Number(((await page.getByText(/split: reaches \d+/).textContent()) ?? '').match(/\d+/)![0]);
	const before = await reachOf();
	await page.locator('#snr').focus();
	for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowRight');
	await expect.poll(reachOf).toBeGreaterThan(before);
});

test("one pixel's sky: the icosahedron matches a uniform sky, the octahedron does not", async ({
	page
}) => {
	await page.goto('/figures/one-pixel-sky/');
	await expect(page.locator('dd').first()).toContainText('the same');
	await page.getByRole('button', { name: 'Six', exact: true }).click();
	await expect(page.locator('dd').first()).toContainText('differ by');
	await expect(page.locator('svg.sky image')).toHaveCount(2);
});

test('beyond Einstein: one reading tells the theory, and a second wave fails the checks', async ({
	page
}) => {
	await page.goto('/figures/beyond-einstein/');
	await expect(page.getByText('what general relativity allows')).toBeVisible();
	await page.getByRole('button', { name: 'Massive', exact: true }).click();
	await expect(page.getByText('a massive graviton’s helicity-zero wave')).toBeVisible();
	await page.getByRole('button', { name: 'Scalar', exact: true }).click();
	await expect(page.getByText('a massive scalar’s wave')).toBeVisible();
	await page.getByRole('button', { name: 'A second wave', exact: true }).click();
	await expect(page.getByText('not one wave of the metric')).toBeVisible();
	await expect(page.getByText(/the checks fail/)).toBeVisible();
});

test('the One pixel layer: a turning flywheel turns the motion test on, a locked safe does not', async ({
	page
}) => {
	await page.goto('/demo/sealed-flywheel/');
	await page.getByRole('checkbox', { name: 'Pixel', exact: true }).check();
	await expect(page.getByText(/^something moves/)).toBeVisible();
	await page.goto('/demo/locked-safe/');
	await page.getByRole('checkbox', { name: 'Pixel', exact: true }).check();
	await expect(page.getByText('all still')).toBeVisible();
	await expect(page.getByText(/type (I|D):/)).toBeVisible();
});

test('push and weigh: a quadrupolar tide cannot tell the two bodies apart, an octupolar one can', async ({
	page
}) => {
	await page.goto('/figures/push-and-weigh/');
	const exact = page.locator('[data-testid=exact]');
	const verdict = page.locator('[data-testid=verdict]');
	// as it opens: the pair with the same second moment under the octupolar tide, one twice the other
	await expect(exact).toHaveText(['0.06667', '0.13333']);
	await expect(verdict).toHaveAttribute('data-apart', 'true');
	await expect(page.locator('tr[data-degree][aria-current]')).toContainText('different');
	await page.getByRole('button', { name: 'Quadrupole', exact: true }).click();
	await expect(exact).toHaveText(['0.16667', '0.16667']);
	await expect(verdict).toHaveAttribute('data-apart', 'false');
	await expect(page.locator('tr[data-degree][aria-current]')).toContainText('the same');
	// the next pair needs one degree more
	await page.getByRole('button', { name: 'Same second and fourth moments', exact: true }).click();
	await page.getByRole('button', { name: 'Octupole', exact: true }).click();
	await expect(exact).toHaveText(['0.08333', '0.08333']);
	await page.getByRole('button', { name: 'Hexadecapole', exact: true }).click();
	await expect(exact).toHaveText(['0.05000', '0.04464']);
	// a point does not answer a tide at all; a shell does
	await page.getByRole('button', { name: 'A point and a shell', exact: true }).click();
	await page.getByRole('button', { name: 'Quadrupole', exact: true }).click();
	await expect(exact).toHaveText(['0.00000', '0.33333']);
	// a new push draws new noise
	const weighed = page.locator('[data-testid=weighed]').first();
	const before = await weighed.innerText();
	await page.getByRole('button', { name: 'Push', exact: true }).click();
	await expect(weighed).not.toHaveText(before);
});

test('a ring of marked particles: the marks turn by half the area swept, and the other way in the mirror wave', async ({
	page
}) => {
	await page.goto('/figures/marked-ring/');
	const reading = (id: string) => page.locator(`[data-testid=${id}]`);
	// as it opens: one right-handed turn at the strength 0.25
	await expect(reading('turn-passed')).toHaveText('9.4530°');
	await expect(reading('turn-weak')).toHaveText('6.1523°');
	await expect(reading('focus')).toHaveText('0.2655 T after the wave');
	// at the end of the wave the ring has shrunk, and the turn is half the area its shape has swept
	await page.getByRole('button', { name: 'Paused', exact: true }).click();
	await page.locator('#time').fill('1');
	await expect(reading('radius')).toHaveText('0.4510');
	await expect(reading('turn-now')).toHaveText('9.4530°');
	await expect(reading('disc-turn')).toHaveText('9.4530°');
	await expect(reading('disc-area')).toHaveText('9.4530°');
	// part of the way through, the two still agree
	await page.locator('#time').fill('0.5');
	const turn = await reading('disc-turn').textContent();
	expect(turn).not.toBe('9.4530°');
	await expect(reading('disc-area')).toHaveText(turn!);
	// the mirror wave turns the marks the other way, and a linear wave not at all
	await page.getByRole('button', { name: 'Left-handed', exact: true }).click();
	await expect(reading('turn-passed')).toHaveText('−9.4530°');
	await page.getByRole('button', { name: 'Linear', exact: true }).click();
	await expect(reading('turn-passed')).toHaveText('0.0000°');
});

test('interactive figures: their own section, out of the demos, and live under their figures in the paper', async ({
	page
}) => {
	await page.goto('/figures/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Interactive figures');
	await expect(page.locator('ol > li')).toHaveCount(12);
	await page.goto('/demo/');
	await expect(page.getByText('Principal null directions')).toHaveCount(0);
	await page.goto('/paper/');
	const stars = page.locator('figure[id="fig:stars"]');
	await stars.locator('summary').click();
	await expect(stars.locator('svg.sky')).toHaveCount(2);
	await expect(stars.getByRole('link', { name: 'Full screen' })).toHaveAttribute(
		'href',
		/figures\/four-stars/
	);
	// a figure of Section XIII is not live in place: it links to its interactive figure
	const ladder = page.locator('figure[id="fig:ladder"]');
	await ladder
		.getByRole('link', { name: 'Apply the tides yourself in the interactive figure' })
		.click();
	await expect(page).toHaveURL(/figures\/push-and-weigh/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Push and weigh');
});

test('where it is now: the ball flies, the camera draws it, and a stop is held', async ({
	page
}) => {
	await page.goto('/demo/where-it-is/?present=readback');
	const canvas = page.locator('canvas').first();
	const frames = async () => Number(await canvas.getAttribute('data-frames'));
	await expect.poll(frames, { timeout: 60_000 }).toBeGreaterThan(3);
	await expect(page.getByText(/light slowed to [\d.]+ m\/s/)).toBeVisible();
	const stop = page.getByRole('button', { name: 'Stop it', exact: true });
	await stop.click();
	await expect(stop).toHaveAttribute('aria-pressed', 'true');
	const drawn = await frames();
	await expect.poll(frames, { timeout: 30_000 }).toBeGreaterThan(drawn);
});

test('behind the wall: one pixel detects that someone walks, and not when they stand', async ({
	page
}) => {
	await page.goto('/demo/behind-the-wall/?present=readback');
	const canvas = page.locator('canvas').first();
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-frames')), {
			timeout: 60_000
		})
		.toBeGreaterThan(1);
	await expect(page.getByRole('heading', { name: 'Behind the wall', level: 1 })).toBeVisible();
	await expect(page.getByText(/^something moves/)).toBeVisible();
	await expect(page.getByLabel('Flow', { exact: true })).toBeChecked();
	await page.getByRole('button', { name: 'Stands', exact: true }).click();
	await expect(page.getByText('all still')).toBeVisible();
});

test('tidal field, the Sun at midnight: the switch turns the gravity side into the field about the camera', async ({
	page
}) => {
	await page.goto('/demo/sun-at-midnight/?present=readback');
	const canvas = page.locator('canvas').first();
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('1');
	const before = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL().length);
	await page.getByRole('button', { name: 'Tidal field', exact: true }).click();
	// the picture itself changes: the engine's field view, as in the rooms
	await expect(page.locator('.tag.right')).toHaveText('Gravity · tidal field');
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('4');
	expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL().length)).not.toBe(before);
	// the key says where the points lie, what the strokes and the colour mean and the ends of the scale, in s⁻²
	const legend = page.getByTestId('field-legend');
	await expect(legend).toContainText('on a sphere 1,995 km about the camera');
	await expect(legend).toContainText('Colour is the direction of the stretch');
	await expect(legend).toContainText(
		/Strength: \d\.\d\d × 10⁻⁸ s⁻² to \d\.\d\d × 10⁻⁶ s⁻², logarithmic/
	);
	// the Key tab has the whole of it, with the scale drawn
	await openTab(page, 'Key');
	const key = page.getByTestId('field-key');
	await expect(key).toContainText('Each fine stroke lies along the stretch');
	await expect(key).toContainText('red across, green up and down, blue toward you');
	await expect(key).toContainText(/Half the picture is\s+stronger than\s+\d\.\d\d × 10⁻⁶ s⁻²/);
	await openTab(page, 'Controls');
	// the slider's ticks are worked out from the scene: the Earth's shells, its centre and far side, the Moon, the Sun
	const ticks = page.getByRole('group', { name: 'Places worth going to on “Slice”' });
	await expect(ticks.getByRole('button')).toHaveCount(8);
	await expect(
		ticks.getByRole('button', { name: /^Go to the Sun, 149,60\d,\d{3} km$/ })
	).toBeVisible();
	const core = ticks.getByRole('button', { name: 'Go to the top of the outer core, 2,891 km' });
	await core.click();
	await expect(core).toHaveAttribute('aria-pressed', 'true');
	await expect(legend).toContainText('on a sphere 2,891 km about the camera');
	// a tick is a button, so the keyboard reaches it too
	const centre = ticks.getByRole('button', { name: 'Go to the Earth’s centre, 6,371 km' });
	await centre.focus();
	await page.keyboard.press('Enter');
	await expect(legend).toContainText('on a sphere 6,371 km about the camera');
	// near by it is the ground's own tide in every direction
	await page.locator('#slice').fill('0');
	await expect(legend).toContainText('on a sphere 2.0 m about the camera');
	await expect(legend).toContainText(/Strength: \d\.\d\d × 10⁻⁸ s⁻² to \d\.\d\d × 10⁻⁵ s⁻²/);
	// nothing lies over the picture: the camera's own reading is under Physics, whatever the view
	await expect(page.locator('.stage [data-testid]')).toHaveCount(0);
	await openTab(page, 'Physics');
	await expect(page.getByRole('heading', { name: 'The tidal field at the camera' })).toBeVisible();
	const reading = page.getByTestId('tidal-reading');
	// 2 G M / R^3 for the scene's Earth, along the vertical, and half of it across
	await expect(reading.getByText('−3.06 × 10⁻⁶ s⁻²').first()).toBeVisible();
	await expect(reading.getByText('up-down')).toBeVisible();
	await expect(reading.getByText('+1.53 × 10⁻⁶ s⁻²')).toBeVisible();
	await expect(reading.getByText('−1.80 × 10⁻¹³ s⁻²')).toBeVisible();
	// the Sun's, 2 G M / d^3 for the real Sun's mass, and the Moon's against it: 1.80e-13 / 7.93e-14 = 2.26
	await expect(reading.getByText('−7.93 × 10⁻¹⁴ s⁻²')).toBeVisible();
	await expect(reading.getByText(/the real Sun’s mass/)).toBeVisible();
	await expect(reading.getByText(/Here the Moon’s is 2\.3 times the Sun’s\./)).toBeVisible();
	await expect(reading.getByText('exaggerated 2.0 × 10⁵ times')).toBeVisible();
	await expect(reading.getByText(/what one pixel at the camera reads/)).toBeVisible();
	expect(await reading.locator('svg[role="img"]').first().locator('circle.mass').count()).toBe(12);
	// the reading follows the hour: at noon the Moon is on the far side of the Earth, and its tide is less
	await openTab(page, 'Controls');
	await page.locator('#time').fill('12');
	await openTab(page, 'Physics');
	await expect(reading.getByText('−1.67 × 10⁻¹³ s⁻²')).toBeVisible();
});

test('tidal field, which way it turns: the same switch shows the field of the drums, turning with the pairs', async ({
	page
}) => {
	await page.goto('/demo/which-way/?present=readback');
	const canvas = page.locator('canvas').first();
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('3');
	await page.getByRole('button', { name: 'Tidal field', exact: true }).click();
	await expect(page.locator('.tag.right')).toHaveText('Gravity · tidal field');
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('4');
	await expect(page.getByTestId('field-legend')).toContainText(
		'on a sphere 4.5 m about the camera'
	);
	// the slice starts where the sphere meets the drums: the tick worked out from the scene says so
	await expect(
		page.getByRole('button', { name: 'Go to the three drums and the shelf, 4.5 m' })
	).toHaveAttribute('aria-pressed', 'true');
	// the pairs turn, so the field is drawn again and again
	const drawn = Number(await canvas.getAttribute('data-frames'));
	await expect
		.poll(async () => Number(await canvas.getAttribute('data-frames')), { timeout: 60_000 })
		.toBeGreaterThan(drawn);
	// the room's part can be taken away, as in the rooms
	await expect(page.getByRole('checkbox', { name: 'Room', exact: true })).toBeChecked();
	// the steady tide, the turning part and the wave, each in s⁻², are under Physics
	await page.getByRole('tab', { name: 'Physics' }).click();
	const reading = page.getByTestId('tidal-reading');
	await expect(reading.getByText('Steady: the average over a turn')).toBeVisible();
	await expect(reading.getByText('now; at most 3.41 × 10⁻¹³ s⁻² over a turn')).toBeVisible();
	await expect(reading.getByText('now; at most 1.42 × 10⁻⁴⁰ s⁻² over a turn')).toBeVisible();
});

test('tidal field, the sky: the same switch in the vista demos, and in the map of two black holes', async ({
	page
}) => {
	const legend = page.getByTestId('field-legend');
	const wash = page.locator('canvas[aria-label^="The tidal field"]');
	const reading = page.getByTestId('tidal-reading');

	// a black hole: the field of the hole at points about the camera, and its tide at the camera under Physics
	await page.goto('/demo/black-hole/');
	await shellReady(page);
	await expect(wash).toHaveCount(0);
	await page.getByRole('button', { name: 'Tidal field', exact: true }).click();
	await expect(page.locator('.tag').last()).toHaveText('Gravity · tidal field');
	// a wash over every pixel of the gravity side, and strokes over it
	await expect
		.poll(async () => Number(await wash.getAttribute('data-strokes')), { timeout: 60_000 })
		.toBeGreaterThan(50);
	await expect(legend).toContainText('on a sphere 40 GM/c² about the camera');
	// each end plain below ten thousand ("734 s⁻²"), in a power of ten above
	await expect(legend).toContainText(
		/Strength: [\d.,]+( × 10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)? s⁻² to [\d.,]+( × 10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)? s⁻²/
	);
	// the ticks: the photon sphere and the horizon on either side of the hole's centre
	await page.getByRole('button', { name: 'Go to the horizon, near side, 38 GM/c²' }).click();
	await expect(legend).toContainText('on a sphere 38 GM/c² about the camera');
	await openTab(page, 'Physics');
	await expect(page.getByRole('heading', { name: 'The tidal field at the camera' })).toBeVisible();
	await expect(reading.getByText('toward the hole', { exact: true })).toBeVisible();
	await openTab(page, 'Controls');
	await page.locator('#distance').fill('1.6');
	await openTab(page, 'Physics');
	await expect(reading.getByText('−1.31 × 10⁴ s⁻²').first()).toBeVisible();
	await openTab(page, 'Controls');
	await page.locator('#distance').fill('1.3');
	await openTab(page, 'Physics');
	await expect(reading.getByText('−1.04 × 10⁵ s⁻²').first()).toBeVisible();
	await openTab(page, 'Controls');

	// the Milky Way: the Galaxy's field about the Sun; at the Sun it is of order 1e-30 s⁻²
	await page.goto('/demo/milky-way/');
	await shellReady(page);
	await page.getByRole('button', { name: 'Tidal field', exact: true }).click();
	// a wash over every pixel of the gravity side, and strokes over it
	await expect
		.poll(async () => Number(await wash.getAttribute('data-strokes')), { timeout: 60_000 })
		.toBeGreaterThan(50);
	await expect(legend).toContainText('on a sphere 4.0 kpc about the Sun');
	await page.getByRole('button', { name: 'Go to the Galaxy’s centre, 8.2 kpc' }).click();
	await expect(legend).toContainText('on a sphere 8.2 kpc about the Sun');
	await openTab(page, 'Physics');
	await expect(reading.getByText('+3.54 × 10⁻³⁰ s⁻²')).toBeVisible();
	await expect(reading.getByText('toward the Galaxy’s centre', { exact: true })).toBeVisible();
	await openTab(page, 'Controls');

	// two black holes: the picture is the field, so the switch starts on; off, the page says why nothing else shows
	await page.goto('/demo/two-black-holes/');
	await shellReady(page);
	const on = page.getByRole('button', { name: 'Tidal field', exact: true });
	await expect(on).toHaveAttribute('aria-pressed', 'true');
	await page.getByRole('button', { name: 'Image', exact: true }).click();
	await expect(page.getByText(/no camera picture here/)).toBeVisible();
});

test('tidal field, the rooms: the switch turns the gravity side into the field, near-field room and thermal room alike', async ({
	page
}) => {
	const legend = page.getByTestId('field-legend');
	const reading = page.getByTestId('tidal-reading');
	const card = page.getByRole('complementary', { name: 'Tidal field at the camera' });

	// a near-field room: over the weighted mass, a wash coloured by the field and strokes along its stretch
	await page.goto('/demo/locked-safe/?present=readback');
	const canvas = page.locator('canvas').first();
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('2');
	const before = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL().length);
	await expect(legend).toHaveCount(0);
	await page.getByRole('button', { name: 'Tidal field', exact: true }).click();
	await expect(page.locator('.tag.right')).toHaveText('Gravity · tidal field');
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('4');
	expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL().length)).not.toBe(before);
	await expect(legend).toContainText('on a sphere 3.5 m about the camera');
	await expect(legend).toContainText(/Strength: \d\.\d\d × 10⁻¹⁰ s⁻² to \d\.\d\d × 10⁻⁷ s⁻²/);
	// the ticks of the slice are the distances of the things and the walls, worked out from the scene
	const ticks = page.getByRole('group', { name: 'Places worth going to on “Slice”' });
	await expect(ticks.getByRole('button')).toHaveCount(4);
	await ticks.getByRole('button', { name: 'Go to the two safes, 3.8 m' }).click();
	await expect(legend).toContainText('on a sphere 3.8 m about the camera');
	await expect(ticks.getByRole('button', { name: 'Go to the back wall, 8.0 m' })).toBeVisible();
	// nothing floats over the picture: what one pixel reads is under Physics
	await expect(card).toHaveCount(0);
	await expect(page.locator('.stage [data-testid]')).toHaveCount(0);
	await openTab(page, 'Physics');
	await expect(page.getByRole('heading', { name: 'The tidal field at the camera' })).toBeVisible();
	await expect(reading.getByText('the gold', { exact: true })).toBeVisible();
	await expect(reading.getByText('−7.22 × 10⁻¹⁰ s⁻²')).toBeVisible();
	await expect(reading.getByText('−6.59 × 10⁻⁹ s⁻²')).toBeVisible();
	// with the room taken away the gold and the safes are all of it
	await openTab(page, 'Controls');
	await page.getByRole('checkbox', { name: 'Room', exact: true }).uncheck();
	// the reading is there whatever the view shows
	await page.getByRole('button', { name: 'Image', exact: true }).click();
	await openTab(page, 'Physics');
	await expect(reading.getByText('taken away', { exact: true })).toBeVisible();
	await expect(reading.getByText('With the empty room taken away')).toBeVisible();
	await expect(reading.getByText('the gold', { exact: true })).toBeVisible();
	await openTab(page, 'Controls');

	// a thermal room has the same switch: its masses have a tidal field whatever the regime
	await page.goto('/demo/closed-furnace/?present=readback');
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('1');
	const glow = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL().length);
	await page.getByRole('button', { name: 'Tidal field', exact: true }).click();
	await expect(page.locator('.tag.right')).toHaveText('Gravity · tidal field');
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('4');
	expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL().length)).not.toBe(glow);
	await expect(legend).toContainText('on a sphere 3.5 m about the camera');
	await expect(page.getByRole('button', { name: 'Go to the two furnaces, 3.8 m' })).toBeVisible();
	await expect(card).toHaveCount(0);
	await openTab(page, 'Physics');
	await expect(reading.getByText('the hot iron', { exact: true })).toBeVisible();
	await expect(reading.getByText('−1.83 × 10⁻⁹ s⁻²').first()).toBeVisible();
});

test('tidal field, its look: colour and contrast change the picture, are kept across demos, and can be reset', async ({
	page
}) => {
	await page.goto('/demo/locked-safe/?present=readback');
	const canvas = page.locator('canvas').first();
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('2');
	await page.getByRole('button', { name: 'Tidal field', exact: true }).click();
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('4');
	/** The gravity side's mean colour and how far its colours spread from grey, 0 to 255. */
	const tint = () =>
		canvas.evaluate((c: HTMLCanvasElement) => {
			const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
			const from = Math.ceil(c.width * Number(c.dataset.split)) + 2;
			const sum = [0, 0, 0];
			let spread = 0;
			let n = 0;
			for (let y = 0; y < c.height; y += 3)
				for (let x = from; x < c.width; x += 3) {
					const o = (y * c.width + x) * 4;
					for (let k = 0; k < 3; k++) sum[k] += d[o + k];
					spread += Math.max(d[o], d[o + 1], d[o + 2]) - Math.min(d[o], d[o + 1], d[o + 2]);
					n++;
				}
			return { mean: sum.map((v) => v / n), spread: spread / n };
		});
	const settled = async () => {
		const frames = Number(await canvas.getAttribute('data-frames'));
		await expect
			.poll(async () => Number(await canvas.getAttribute('data-frames')), { timeout: 60_000 })
			.toBeGreaterThan(frames);
		return tint();
	};
	const far = (a: number[], b: number[]) => Math.max(...a.map((v, k) => Math.abs(v - b[k])));
	const first = await tint();
	const legend = page.getByTestId('field-legend');
	await expect(legend).toContainText('Colour is the direction of the stretch');

	// colour by strength, then by stretch against squeeze: each is another picture, and the key says which
	await page.getByRole('button', { name: 'Strength', exact: true }).click();
	await expect(legend).toContainText('Colour is the strength');
	const byStrength = await settled();
	expect(far(byStrength.mean, first.mean)).toBeGreaterThan(8);
	await page.getByRole('button', { name: 'Stretch or squeeze', exact: true }).click();
	await expect(legend).toContainText('Orange where stretch leads');
	const bySign = await settled();
	expect(far(bySign.mean, byStrength.mean)).toBeGreaterThan(8);
	await page.getByRole('button', { name: 'Direction', exact: true }).click();
	const again = await settled();
	expect(far(again.mean, first.mean)).toBeLessThan(1);

	// contrast: less of it and the wash's colours draw in toward grey
	const contrast = page.locator('#look-contrast');
	await expect(contrast).toHaveValue('1.2');
	await contrast.fill('0.5');
	await expect(page.locator('output[for="look-contrast"]')).toHaveText('50%');
	const pale = await settled();
	expect(pale.spread).toBeLessThan(0.6 * first.spread);

	// the strength scale's reading is the strength drawn at full, in s⁻², and the key follows it
	await page.locator('#look-scale').fill('1');
	await expect(page.locator('output[for="look-scale"]')).toHaveText(/\d\.\d\d × 10⁻⁸ s⁻²/);
	await expect(legend).toContainText(/to \d\.\d\d × 10⁻⁸ s⁻²/);

	// the look is one for every demo
	await page.goto('/demo/closed-furnace/?present=readback');
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('1');
	await page.getByRole('button', { name: 'Tidal field', exact: true }).click();
	await expect(page.locator('#look-contrast')).toHaveValue('0.5');
	await expect(page.locator('#look-scale')).toHaveValue('1');
	// strokes can be put away, and everything brought back at once
	await page.getByText('Strokes', { exact: true }).click();
	await page.getByRole('checkbox', { name: 'Draw strokes along the stretch' }).uncheck();
	await expect(page.locator('#look-density')).toHaveCount(0);
	await page.getByRole('button', { name: 'Reset look' }).click();
	await expect(page.locator('#look-contrast')).toHaveValue('1.2');
	await expect(page.locator('#look-scale')).toHaveValue('0');
	await expect(page.locator('#look-density')).toHaveValue('1');
	await expect(page.getByRole('button', { name: 'Reset look' })).toBeDisabled();
});

test('the locked safe: the camera at work reads, decides and images, and its error falls as the SNR rises', async ({
	page
}) => {
	await page.goto('/demo/locked-safe/');
	await page.getByRole('button', { name: 'The camera at work', exact: true }).click();
	const bench = page.getByRole('region', { name: 'The camera at work' });
	await expect(bench).toBeVisible();
	// it opens at a signal-to-noise ratio of 1,000: 605 readings, a decision, and an image that cannot weigh a safe
	await expect(
		bench.getByText(/605 readings, every one with noise of 3\.53 × 10⁻¹¹ s⁻²/)
	).toBeVisible();
	expect(await bench.getByTestId('readings').locator('canvas').count()).toBe(5);
	const choice = bench.getByTestId('choice');
	const error = bench.getByTestId('error');
	const distance = bench.getByTestId('distance');
	await expect(choice).toHaveText('Gold in the right safe');
	await expect(error).toHaveText('1 in 10¹⁷⁸³');
	await expect(distance).toHaveText('181 standard deviations apart');
	await expect(bench.getByTestId('mass-right')).toHaveText(/± 729 kg$/);
	await expect(bench.getByTestId('mass-left')).toHaveText(/± 729 kg$/);
	await expect(bench.getByTestId('verdict')).toHaveText(/cannot say where the gold is/);
	await expect(bench.getByTestId('bar-point')).toHaveText('0.58 standard deviations');

	// the paper's two cases: wrong 18% of the time at 10, once in a thousand at 34
	const chanceOfError = async () => Number(await error.getAttribute('data-error'));
	await page.getByRole('button', { name: 'Signal-to-noise ratio 10', exact: true }).click();
	await expect(error).toHaveText('18% of the time');
	await expect(distance).toHaveText('1.81 standard deviations apart');
	await expect(bench.getByTestId('mass-right')).toHaveText(/± 947 kg$/);
	const atTen = await chanceOfError();
	expect(atTen).toBeCloseTo(0.1826, 4);
	await page.getByRole('button', { name: 'Signal-to-noise ratio 34', exact: true }).click();
	await expect(error).toHaveText('0.10% of the time');
	expect(await chanceOfError()).toBeLessThan(atTen / 100);
	// and along the slider the error only falls
	let last = 1;
	for (const decades of [0, 0.5, 1, 1.5, 2]) {
		await page.locator('#snr').fill(String(decades));
		await expect
			.poll(async () => Number(await bench.getAttribute('data-snr')))
			.toBeCloseTo(10 ** decades, 9);
		const now = await chanceOfError();
		expect(now).toBeLessThan(last);
		last = now;
	}

	// a new exposure is a new draw of the noise; the count of decisions goes up
	const central = bench.getByTestId('central');
	const first = await central.innerText();
	await page.getByRole('button', { name: 'New exposure' }).click();
	await expect(bench.getByTestId('tally')).toHaveText(/^right \d, left \d$/);
	await expect(bench.getByText('The 2 exposures at these settings')).toBeVisible();
	expect(await central.innerText()).not.toBe(first);

	// positivity finds the gold where the Gaussian image could not
	await page.getByRole('button', { name: 'Signal-to-noise ratio 1,000', exact: true }).click();
	await page.getByRole('checkbox', { name: 'Positivity' }).check();
	await expect(bench.getByTestId('verdict')).toHaveText(/The right footprint holds mass/);
	const found = (await bench.getByTestId('mass-right').innerText()).match(/^(\d+) ± (\d+) kg$/);
	expect(found).not.toBeNull();
	expect(Number(found![1])).toBeGreaterThan(250);
	expect(Number(found![1])).toBeLessThan(380);
	expect(Number(found![2])).toBeLessThan(60);
	await page.getByRole('checkbox', { name: 'Positivity' }).uncheck();

	// a sphere and a point: the view says the readings are identical, and they are
	await page.getByRole('button', { name: 'Sphere', exact: true }).click();
	await expect(bench.getByTestId('inside')).toHaveText('a gold sphere in the right safe');
	await expect(bench.getByTestId('sphere-point')).toHaveText('0.000 standard deviations');
	await expect(bench.getByText(/Put the point in its place and no reading changes/)).toBeVisible();
	const sphere = await central.innerText();
	await page.getByRole('button', { name: 'Point', exact: true }).click();
	await expect(bench.getByTestId('inside')).toHaveText('a point mass in the right safe');
	expect(await central.innerText()).toBe(sphere);

	// nothing inside: asked to choose a safe, the camera says that neither fits
	await page.getByRole('button', { name: 'Nothing', exact: true }).click();
	await expect(choice).toHaveText('Neither fits the readings');
	await expect(bench.getByTestId('fit')).toHaveText(/χ² = [\d,]+ for 605 readings/);
});

test(
	'the sidebar: one docked panel of tabs that collapses to a rail, gives the picture its width, and is remembered',
	{
		tag: '@fresh'
	},
	async ({ page }) => {
		await page.goto('/demo/locked-safe/?present=readback');
		await shellReady(page);
		const canvas = page.locator('canvas').first();
		await firstFrame(page);
		const width = async () => (await canvas.boundingBox())!.width;
		const tab = (name: string) => page.getByRole('tab', { name, exact: true });
		const panel = page.getByRole('tabpanel');

		// it opens in plain words, with the title and the way back in the sidebar and nothing over the picture
		await expect(tab('Plain words')).toHaveAttribute('aria-selected', 'true');
		await expect(panel).toContainText(/\w+/);
		await tab('Controls').click();
		await expect(tab('Controls')).toHaveAttribute('aria-selected', 'true');
		await expect(panel.getByRole('button', { name: 'Tidal field', exact: true })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'The locked safe', level: 1 })).toBeVisible();
		await expect(page.getByRole('link', { name: 'All demos' })).toHaveAttribute(
			'href',
			/\/demo\/?$/
		);
		await expect(page.locator('.stage').locator('aside, [role="dialog"], nav')).toHaveCount(0);
		const beside = await width();
		const side = (await page.locator('aside').boundingBox())!;
		expect(beside + side.width).toBeCloseTo(page.viewportSize()!.width, 0);

		// the open tab's own icon puts the panel away: the rail stays, and the picture takes the width
		await tab('Controls').click();
		await expect(panel).toHaveCount(0);
		await expect(tab('Controls')).toHaveAttribute('aria-selected', 'false');
		await expect.poll(width).toBeGreaterThan(beside + 300);
		const wide = await width();
		const rail = (await page.locator('aside').boundingBox())!;
		expect(rail.width).toBeLessThan(80);
		// the picture is drawn again at its new size
		const frames = Number(await canvas.getAttribute('data-frames'));
		await expect
			.poll(async () => Number(await canvas.getAttribute('data-frames')), { timeout: 60_000 })
			.toBeGreaterThan(frames);
		expect(await canvas.evaluate((c: HTMLCanvasElement) => c.width / c.clientWidth)).toBeCloseTo(
			1,
			1
		);
		// at the new size the divider still answers, where it is drawn, and a still can be saved
		const divider = page.getByRole('slider', {
			name: 'Divider between the light view and the gravity view'
		});
		const at = (await divider.boundingBox())!;
		const split = Number(await canvas.getAttribute('data-split'));
		expect((at.x + at.width / 2) / wide).toBeCloseTo(split, 1);
		await divider.focus();
		await page.keyboard.press('ArrowLeft');
		await expect
			.poll(async () => Number(await canvas.getAttribute('data-split')), { timeout: 60_000 })
			.toBeLessThan(split);
		const still = page.waitForEvent('download');
		await page.getByRole('button', { name: 'Save a still' }).click();
		expect((await still).suggestedFilename()).toBe('the-locked-safe.png');

		// a tab's icon on the rail opens the panel at that tab
		await tab('Physics').click();
		await expect(tab('Physics')).toHaveAttribute('aria-selected', 'true');
		await expect(
			panel.getByRole('heading', { name: 'The tidal field at the camera' })
		).toBeVisible();
		await expect.poll(width).toBeCloseTo(beside, 0);

		// the tabs are a list of tabs: the arrow keys walk them, and the keys of old still work
		await tab('Physics').focus();
		await page.keyboard.press('ArrowUp');
		await expect(tab('Controls')).toHaveAttribute('aria-selected', 'true');
		await expect(tab('Controls')).toBeFocused();
		await page.keyboard.press('ArrowDown');
		await expect(tab('Physics')).toHaveAttribute('aria-selected', 'true');
		await page.keyboard.press('Home');
		await expect(tab('Plain words')).toHaveAttribute('aria-selected', 'true');
		await expect(panel).toContainText('safe');
		await page.keyboard.press('c');
		await expect(tab('Controls')).toHaveAttribute('aria-selected', 'true');
		await page.keyboard.press('c');
		await expect(panel).toHaveCount(0);
		await page.keyboard.press('?');
		await expect(panel).toContainText('reset the view, save a still');
		await page.keyboard.press('n');
		await expect(tab('Plain words')).toHaveAttribute('aria-selected', 'true');

		// the tab and whether the panel is open are kept, here and in the next demo
		await tab('Physics').click();
		await page.reload();
		await shellReady(page);
		await expect(tab('Physics')).toHaveAttribute('aria-selected', 'true');
		await tab('Physics').click();
		await page.goto('/demo/closed-furnace/?present=readback');
		await shellReady(page);
		await expect(panel).toHaveCount(0);
		await expect.poll(width).toBeCloseTo(wide, 0);
		await tab('Controls').click();
		await expect(panel.getByRole('button', { name: 'Tidal field', exact: true })).toBeVisible();

		// "hide the interface" hides the rail too
		await page.getByRole('button', { name: 'Hide the interface' }).click();
		await expect(page.locator('aside')).toHaveCount(0);
		await expect.poll(width).toBe(page.viewportSize()!.width);
		await page.getByRole('button', { name: /Show the interface/ }).click();
		await expect(tab('Controls')).toHaveAttribute('aria-selected', 'true');
	}
);

test('on a phone, a slider follows the finger anywhere along its track', async ({ browser }) => {
	const context = await browser.newContext({ ...devices['iPhone 13'] });
	const page = await context.newPage();
	await page.goto('/demo/milky-way/?present=readback');
	// on a phone the panel starts put away: the bar of tabs along the bottom opens it as a sheet
	await shellReady(page);
	await expect(page.locator('#fov')).toHaveCount(0);
	await openTab(page, 'Controls');
	const slider = page.locator('#fov');
	const box = (await slider.boundingBox())!;
	// a finger is given a larger target
	expect(box.height).toBeGreaterThanOrEqual(30);
	const touch = await context.newCDPSession(page);
	const y = box.y + box.height / 2;
	const at = (f: number) => ({ x: box.x + box.width * f, y });
	// a drag that starts away from the thumb
	await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [at(0.1)] });
	for (const f of [0.15, 0.25, 0.3]) {
		await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [at(f)] });
	}
	await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
	await expect.poll(async () => Number(await slider.inputValue())).toBeLessThan(45);
	// and a tap
	await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [at(0.9)] });
	await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
	await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThan(95);
	await context.close();
});

// --- what the instrument records: one exposure of the near field, and the gravitons a thermal exposure counts ------

/** The picture, one pixel in every seven along each side, as the sum of its red, green and blue. */
async function pixels(page: Page): Promise<number[]> {
	return page.locator('canvas').evaluate((c: HTMLCanvasElement) => {
		const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
		const out: number[] = [];
		for (let y = 3; y < c.height; y += 7)
			for (let x = 3; x < c.width; x += 7) {
				const i = 4 * (y * c.width + x);
				out.push(data[i] + data[i + 1] + data[i + 2]);
			}
		return out;
	});
}

const meanDifference = (a: number[], b: number[]) =>
	a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;

/** Wait until the picture has stopped changing: no new frame for a second. */
async function settled(page: Page) {
	const canvas = page.locator('canvas');
	let last = -1;
	await expect
		.poll(
			async () => {
				const now = Number(await canvas.getAttribute('data-frames'));
				const steady = now === last;
				last = now;
				return steady;
			},
			{ intervals: [1000], timeout: 30_000 }
		)
		.toBe(true);
}

test('one exposure, the near field: the reconstruction carries the noise of the readings, and each exposure its own', async ({
	page
}) => {
	const demo = await openDemo(page, '/demo/full-or-empty/', { yaw: 13, pitch: -13 });
	const canvas = page.locator('canvas');
	await openTab(page, 'Controls');
	await demo.show(0, () => page.getByLabel('Light', { exact: true }).uncheck());
	await page.getByLabel('Outline').uncheck();
	// a camera far less sensitive, and the picture brightened, so that the noise stands out; wait for a frame drawn
	// with both (a slow software frame can outlast settled's one-second wait)
	const blurBefore = await canvas.getAttribute('data-near-blur');
	const exposureBefore = await canvas.getAttribute('data-exposure');
	await page.locator('#sensitivity').fill('3');
	await page.locator('#brightness').fill('1.5');
	await expect
		.poll(() => canvas.getAttribute('data-near-blur'), { timeout: 60_000 })
		.not.toBe(blurBefore);
	await expect
		.poll(() => canvas.getAttribute('data-exposure'), { timeout: 60_000 })
		.not.toBe(exposureBefore);
	await settled(page);
	// a slow software frame can outlast settled's one-second wait, so each switch below also waits for a frame drawn
	// with, or without, the noise
	const expected = await pixels(page);

	await page.getByRole('button', { name: 'One exposure', exact: true }).click();
	await expect(page.locator('.tag.right')).toHaveText('Gravity · one exposure');
	await expect.poll(() => canvas.getAttribute('data-image'), { timeout: 30_000 }).toBe('1');
	await expect.poll(() => canvas.getAttribute('data-noise'), { timeout: 60_000 }).toBe('1');
	await settled(page);
	const one = await pixels(page);

	// another draw of the readings' noise, another picture of the same scene
	await page.getByRole('button', { name: 'New exposure', exact: true }).click();
	await expect.poll(() => canvas.getAttribute('data-image'), { timeout: 30_000 }).toBe('2');
	await settled(page);
	const two = await pixels(page);

	// the readings say what the signal-to-noise ratio is quoted for, and how large the noise is
	const readings = page.getByRole('region', { name: 'Readings' });
	await expect(
		readings.getByText('Signal to noise, for the water in the middle tank')
	).toBeVisible();
	await expect(readings.getByText(/493 kg, 3\.6 m away/)).toBeVisible();
	await expect(readings.getByText(/\d standard deviations/)).toBeVisible();

	// back to the expected picture: the noise is gone, but for the screen's dither, and each draw stood well above it
	await page.getByRole('button', { name: 'Image', exact: true }).click();
	await expect(page.locator('.tag.right')).toHaveText('Gravity · near field');
	await expect.poll(() => canvas.getAttribute('data-noise'), { timeout: 60_000 }).toBe('0');
	await settled(page);
	const dither = meanDifference(await pixels(page), expected);
	const detail = JSON.stringify({
		dither,
		one: meanDifference(one, expected),
		two: meanDifference(two, one)
	});
	expect(dither, detail).toBeLessThan(1);
	expect(meanDifference(one, expected), detail).toBeGreaterThan(dither + 1);
	expect(meanDifference(two, one), detail).toBeGreaterThan(dither + 1);
});

test('counts, a thermal room: a lifetime on a square metre counts nothing, and long enough shows the bottles', async ({
	page
}) => {
	const demo = await openDemo(page, '/demo/honey-and-water/', { yaw: 14, pitch: -12 });
	const canvas = page.locator('canvas');
	await openTab(page, 'Controls');
	await demo.show(0, () => page.getByLabel('Light', { exact: true }).uncheck());
	await page.getByLabel('Outline').uncheck();
	await page.getByRole('button', { name: 'Counts', exact: true }).click();
	await expect.poll(() => canvas.getAttribute('data-right'), { timeout: 60_000 }).toBe('5');
	await expect(page.locator('.tag.right')).toHaveText('Gravity · counted');
	await expect(page.locator('output[for="area"]')).toHaveText('1 m²');
	await expect(page.locator('output[for="time"]')).toHaveText('80 years');
	const verdict = page.getByTestId('counts-verdict');
	await expect(verdict).toContainText('the true picture is black');
	const readings = page.getByRole('region', { name: 'Readings' });
	await expect(readings.locator('dd').nth(1)).toContainText(/4\.\d\d/);
	await settled(page);
	const honey = sceneObject('honey-and-water', 'bottle-left-contents').center;
	const water = sceneObject('honey-and-water', 'bottle-right-contents').center;
	expect(Math.max(...(await demo.at(honey)))).toBeLessThan(10);

	// long enough for 2,500 gravitons in the brightest element: the bottles show, the honey the brighter
	const uploaded = await canvas.getAttribute('data-image');
	await page.getByRole('button', { name: 'Long enough', exact: true }).click();
	await expect
		.poll(() => canvas.getAttribute('data-image'), { timeout: 30_000 })
		.not.toBe(uploaded);
	await expect(verdict).toContainText('Enough for a picture');
	await expect(verdict).toContainText('times the age of the universe');
	await settled(page);
	const lit = await demo.at(honey);
	const wet = await demo.at(water);
	const detail = JSON.stringify({ lit, wet });
	expect(lit[0], detail).toBeGreaterThan(80);
	expect(lit[0], detail).toBeGreaterThan(wet[0] + 10);

	// another exposure, another draw: the same bottles, other counts
	const before = await pixels(page);
	await page.getByRole('button', { name: 'New exposure', exact: true }).click();
	await expect
		.poll(async () => meanDifference(await pixels(page), before), { timeout: 30_000 })
		.toBeGreaterThan(0);

	// the expected counts are the thermal image itself, cut into elements
	await page.getByRole('button', { name: 'Expected', exact: true }).click();
	await expect(page.locator('.tag.right')).toHaveText('Gravity · counts expected');
	await settled(page);
	expect((await demo.at(honey))[0]).toBeGreaterThan(80);
});

test('counts, the Sun at midnight: eighty years on a square metre, single gravitons from the planet, the Sun’s core in thousands', async ({
	page
}) => {
	await page.goto('/demo/sun-at-midnight/?present=readback');
	await firstFrame(page);
	await openTab(page, 'Controls');
	await page.getByRole('button', { name: 'Counts', exact: true }).click();
	await expect
		.poll(() => page.locator('canvas').getAttribute('data-right'), { timeout: 60_000 })
		.toBe('5');
	const readings = page.getByRole('region', { name: 'Readings' });
	// the Sun's core alone sends a square metre about a graviton a second: some 10^9 in a lifetime, in one element
	const counted = readings.locator('dt', { hasText: 'Counted in this exposure' }).locator('+ dd');
	// the count is set in KaTeX: its text, with the spacing taken out, reads "1.2×109,in…" for 1.2 × 10⁹
	const plainly = async () => ((await counted.textContent()) ?? '').replace(/[\s\u200b]/g, '');
	await expect.poll(plainly).toMatch(/^[12]\.\d×109,in[\d,]+of[\d,]+elements$/);
	await openTab(page, 'Physics');
	await expect(page.getByTestId('counts-verdict')).toContainText('lifetimes');
});

test('paper: the contents sit at the window’s left, the text centred in it', async ({ page }) => {
	for (const width of [1240, 1440, 1920]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/paper/');
		const viewport = await page.evaluate(() => document.documentElement.clientWidth);
		const article = await page.locator('article.paper').boundingBox();
		const contents = await page.locator('nav.contents').boundingBox();
		if (!article || !contents) throw new Error('paper layout not found');
		expect(Math.abs(article.x + article.width / 2 - viewport / 2)).toBeLessThan(2);
		// the contents start near the window's edge and end well short of the text
		expect(contents.x).toBeLessThan(120);
		expect(contents.x + contents.width).toBeLessThan(article.x - 40);
		if (width >= 1440) expect(article.x - (contents.x + contents.width)).toBeGreaterThan(64);
	}
});

test('paper: a live version spans its figure, on the caption’s edge, in one frame', async ({
	page
}) => {
	await page.goto('/paper/');
	const figure = page.locator('[id="fig:nearfield"]');
	await figure.locator('details.live > summary').click();
	const art = figure.locator('details.live > .art');
	await expect(art.locator('.gfig')).toBeVisible();
	const box = await art.boundingBox();
	const caption = await figure.locator('figcaption').boundingBox();
	if (!box || !caption) throw new Error('figure not found');
	expect(Math.abs(box.x - caption.x)).toBeLessThan(1);
	expect(Math.abs(box.width - caption.width)).toBeLessThan(1);
	// the box around the live version is gone: the card inside is its only frame
	const frame = await art.evaluate((el) => {
		const style = getComputedStyle(el);
		return [style.borderTopWidth, style.paddingTop, style.backgroundColor];
	});
	expect(frame).toEqual(['0px', '0px', 'rgba(0, 0, 0, 0)']);
});

test('paper: Back from a full-screen figure returns to that figure', async ({ page }) => {
	await page.goto('/paper/');
	const ladder = page.locator('figure[id="fig:ladder"]');
	const link = ladder.getByRole('link', {
		name: 'Apply the tides yourself in the interactive figure'
	});
	await expect(link).toHaveAttribute('href', /\/figures\/push-and-weigh\/\?from=fig%3Aladder$/);
	await link.scrollIntoViewIfNeeded();
	await link.click();
	await expect(page).toHaveURL(/\/figures\/push-and-weigh\/\?from=fig%3Aladder$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Push and weigh');
	await page.goBack();
	await expect(page).toHaveURL(/\/paper\/#fig:ladder$/);
	await expect(ladder).toBeInViewport();
	// and it stays there once the page has settled
	await page.waitForTimeout(1000);
	await expect(ladder).toBeInViewport();
});

test('paper: arriving at a figure’s hash opens the live figures opened before, and lands on it', async ({
	page
}) => {
	await page.goto('/paper/');
	const nearfield = page.locator('figure[id="fig:nearfield"]');
	await nearfield.locator('details.live > summary').click();
	await expect(nearfield.locator('.gfig')).toBeVisible();
	await page.goto('/');
	await page.goto('/paper/#fig:nearfield');
	await expect(nearfield.locator('details.live')).toHaveAttribute('open', '');
	await expect(nearfield.locator('.gfig')).toBeVisible();
	await expect(nearfield).toBeInViewport();
	const top = await nearfield.evaluate((el) => el.getBoundingClientRect().top);
	expect(top).toBeGreaterThan(0);
	expect(top).toBeLessThan(200);
});

test(
	'paper: the three live figures of what a field keeps, each with its full-screen page and the way back',
	{
		tag: '@fresh'
	},
	async ({ page }) => {
		// the paper is a long page: on a slow runner its main thread can be busy for some seconds after
		// loading, so the navigations below are given a runner's time, not a desktop's
		test.setTimeout(180_000);
		const live: [string, string, string][] = [
			['fig:passing', 'a-mass-that-passes', 'Try it: move the passing mass'],
			['fig:hidden-flow', 'a-hidden-flow', 'Try it: move the boundary between the two flows'],
			['fig:hole-response', 'black-hole-response', 'Try it: choose the tide, move the test']
		];
		for (const [id, slug, label] of live) {
			await page.goto('/paper/');
			const figure = page.locator(`figure[id="${id}"]`);
			const summary = figure.locator('details.live > summary');
			await expect(summary).toContainText(label);
			await summary.click();
			const art = figure.locator('details.live > .art');
			await expect(art.locator('svg').first()).toBeVisible();
			const full = art.getByRole('link', { name: 'Full screen' });
			const href = new RegExp(`/figures/${slug}/\\?from=${encodeURIComponent(id)}$`);
			await expect(full).toHaveAttribute('href', href);
			await full.scrollIntoViewIfNeeded();
			await full.click();
			await expect(page).toHaveURL(href, { timeout: 30_000 });
			await expect(page.locator('#shell-tab-plain')).toHaveAttribute('aria-selected', 'true');
			await expect(page.locator('#shell-panel')).toContainText(/\w{4,}/);
			const back = page.getByRole('link', { name: 'Back to the paper' });
			await expect(back).toHaveAttribute('href', new RegExp(`/paper/#${id}$`));
			await back.click();
			await expect(page).toHaveURL(new RegExp(`/paper/#${id}$`), { timeout: 30_000 });
			await expect(figure).toBeInViewport({ timeout: 15_000 });
		}
	}
);

// every figure and demo page opens on the In plain words tab, with something to read: one test per
// page, so that they run side by side
for (const path of ['figures', 'demo'].flatMap((section) =>
	readdirSync(new URL(`../src/routes/${section}`, import.meta.url), { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => `/${section}/${entry.name}/`)
)) {
	test(
		`${path} opens on the In plain words tab, with something to read`,
		{ tag: '@fresh' },
		async ({ page }) => {
			await page.goto(path);
			const tab = page.locator('#shell-tab-plain');
			await expect(tab).toHaveAttribute('aria-selected', 'true');
			await expect(tab).toHaveAttribute('title', /^In plain words/);
			const words = (await page.locator('#shell-panel').innerText()).trim();
			expect(words.split(/\s+/).length).toBeGreaterThan(40);
		}
	);
}
