// Stills of every demo, for the demo list and for browsers without WebGPU.
//
//   node scripts/posters.mjs [base url] [slug ...]      (default http://localhost:5173/, every demo)
//
// Each demo is opened as a first-time visitor sees it, in the dark theme, with ?present=readback and its interface
// hidden. Every demo opens with its divider in the middle, so the stills on the list are all cut at the same place
// and each still, shown while the engine starts, is the frame the engine then draws (the divider is set to the middle
// here too, should a demo ever open elsewhere). The still is the picture alone: what is drawn over the gravity side as
// part of it (the flow) stays, and the names of the sides, captions, keys and the divider's handle are left out. A
// picture that keeps moving (a ball in flight, people walking, a pair in orbit) is caught at a moment that shows it
// well, and its clock stopped there. Writes static/posters/<slug>.jpg at 1280 x 720 (POSTERS_DIR writes elsewhere).
// Set PW_CHROMIUM to a Chromium binary if Playwright's own download is not available.
import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

/**
 * Demos whose picture keeps moving, and the moment to catch it: a test of the columns of the gravity half, each the
 * number of its pixels that glow blue-white, from the divider to the right edge (an array of 0 to 1 positions with
 * their counts), or a wait in milliseconds.
 */
const MOVING = {
	// the ball a little past the middle: its glow a third of the way into the gravity half, while light, which lags,
	// still shows it on its own side
	'where-it-is': (runs) => runs.some((r) => r.from > 0.2 && r.to < 0.5),
	// both people in the gravity half, apart, the walker clear of the edge
	'behind-the-wall': (runs) =>
		runs.length === 2 &&
		runs[0].from > 0.03 &&
		runs[1].from - runs[0].to > 0.12 &&
		runs[1].to < 0.85,
	'two-black-holes': 2500
};

/** Demos whose picture is not a split: no divider to move. */
const WHOLE = new Set(['two-black-holes']);

const ALL = [
	'sun-at-midnight',
	'locked-safe',
	'full-or-empty',
	'blank-mirror',
	'closed-furnace',
	'honey-and-water',
	'which-way',
	'sealed-flywheel',
	'beam-in-the-dark',
	'where-it-is',
	'behind-the-wall',
	'milky-way',
	'black-hole',
	'two-black-holes'
];
const args = process.argv.slice(2);
const base = args[0]?.startsWith('http') ? args.shift() : 'http://localhost:5173/';
const slugs = args.length ? args : ALL;
const out = process.env.POSTERS_DIR ?? 'static/posters';

/** Everything laid over the picture that is not part of it. */
const BARE = `
	button.unhide, .frame .tag, .frame .measure, .frame .caption, .frame .divider, .flow .key { visibility: hidden !important; }
`;

/**
 * The runs of columns in the gravity half of a split picture that hold something glowing blue-white, as fractions of
 * that half's width, from the divider. Read from the canvas, which the readback mode draws in 2D.
 */
const glowing = (page) =>
	page.evaluate(() => {
		const canvas = document.querySelector('canvas');
		const { width, height } = canvas;
		const from = Math.round(width * Number(canvas.dataset.split ?? 0.5));
		const pixels = canvas.getContext('2d').getImageData(from, 0, width - from, height).data;
		const span = width - from;
		const runs = [];
		let open;
		for (let x = 0; x < span; x += 2) {
			let lit = 0;
			for (let y = 0; y < height; y += 4) {
				const k = 4 * (y * span + x);
				if (pixels[k + 2] > 200 && pixels[k + 2] - pixels[k] > 40) lit++;
			}
			if (lit > 3 && !open) open = { from: x / span, to: x / span };
			else if (lit > 3) open.to = x / span;
			else if (open) {
				runs.push(open);
				open = undefined;
			}
		}
		if (open) runs.push(open);
		return runs.filter((r) => r.to - r.from > 0.01);
	});

const browser = await chromium.launch({
	executablePath: process.env.PW_CHROMIUM || undefined,
	args: ['--enable-unsafe-webgpu']
});

for (const slug of slugs) {
	// a fresh context each time: nothing kept from another demo (the field's look, the open tab), and the dark theme
	const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
	await context.addInitScript(() => {
		localStorage.setItem('theme', 'dark');
		// a clock that can be stopped: a moving picture is caught by stopping its time, so that the engine's frame and
		// what is drawn over it (the flow) show the same moment
		const now = performance.now.bind(performance);
		let stopped;
		performance.now = () => stopped ?? now();
		const frame = window.requestAnimationFrame.bind(window);
		window.requestAnimationFrame = (callback) => frame(() => callback(performance.now()));
		window.__stopTime = () => (stopped = now());
	});
	const page = await context.newPage();
	await page.goto(new URL(`demo/${slug}/?present=readback`, base).href, {
		waitUntil: 'networkidle'
	});
	const canvas = page.locator('canvas').first();
	await canvas.waitFor();
	const frames = () =>
		page.evaluate(() => Number(document.querySelector('canvas')?.dataset.frames ?? 0));
	async function steady() {
		// the engine draws only while something changes: wait until the frame counter stops
		let last = -1;
		for (let i = 0; i < 60; i++) {
			const n = await frames();
			if (n > 0 && n === last) return;
			last = n;
			await page.waitForTimeout(800);
		}
	}
	await page.waitForFunction(() => Number(document.querySelector('canvas')?.dataset.frames) > 0);
	// the picture alone, filling the window
	// (pressed again until it takes: the page may not yet listen for keys)
	const unhide = page.locator('button.unhide');
	for (let i = 0; i < 10 && !(await unhide.isVisible()); i++) {
		await page.keyboard.press('h');
		await unhide.waitFor({ timeout: 1500 }).catch(() => {});
	}
	await page.waitForTimeout(500);
	// the picture has the whole window once the panel has gone
	await page.waitForFunction(
		() => document.querySelector('canvas').getBoundingClientRect().width >= window.innerWidth - 1
	);
	await page.waitForTimeout(300);
	const frame = await canvas.boundingBox();
	if (!WHOLE.has(slug)) {
		// drag the divider to the middle of the picture, again if the page was still settling
		const divider = page.locator('[role="slider"][aria-label^="Divider"]');
		for (let i = 0; i < 5 && (await divider.getAttribute('aria-valuenow')) !== '50'; i++) {
			const grip = await divider.boundingBox();
			const now = await canvas.boundingBox();
			const y = grip.y + grip.height / 2;
			await page.mouse.move(grip.x + grip.width / 2, y);
			await page.mouse.down();
			await page.mouse.move(now.x + now.width / 2, y, { steps: 8 });
			await page.mouse.up();
			await page.waitForTimeout(400);
		}
	}
	await page.mouse.move(frame.x + 2, frame.y + 2);
	await page.addStyleTag({ content: BARE });
	const moving = MOVING[slug];
	if (typeof moving === 'number') await page.waitForTimeout(moving);
	else if (moving) {
		for (let i = 0; i < 300; i++) {
			const runs = await glowing(page);
			if (process.env.POSTERS_DEBUG) console.log(JSON.stringify(runs));
			if (moving(runs)) break;
			await page.waitForTimeout(60);
		}
	}
	if (moving) {
		await page.evaluate(() => window.__stopTime());
		// a frame or two more for the engine to draw the stopped moment
		await page.waitForTimeout(1500);
	} else await steady();
	const jpeg = await page.screenshot({ type: 'jpeg', quality: 86 });
	writeFileSync(`${out}/${slug}.jpg`, jpeg);
	const split = await page.evaluate(() => document.querySelector('canvas')?.dataset.split);
	console.log('wrote', slug, split ? `divider ${Number(split).toFixed(3)}` : '');
	await context.close();
}
await browser.close();
