// Stills of each scene for the landing page, one in light and one in gravity, from the same camera.
//
//   node scripts/seam-stills.mjs [base url] [slug ...]      (default http://localhost:5173/, every slug)
//
// The landing page splits every scene at one seam that runs down the whole page, so it needs each
// scene twice with the same framing: the divider pushed all the way right (light only) and all
// the way left (gravity only). Each demo is opened with ?present=readback, its interface hidden,
// the divider moved with the keyboard, and the canvas read once the frames are steady. Writes
// static/seam/<slug>-light.jpg and static/seam/<slug>-gravity.jpg. Set PW_CHROMIUM to a Chromium
// binary if Playwright's own download is not available.
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const ALL = [
	'sun-at-midnight',
	'locked-safe',
	'full-or-empty',
	'blank-mirror',
	'closed-furnace',
	'sealed-flywheel',
	'beam-in-the-dark',
	'behind-the-wall',
	'milky-way',
	'black-hole'
];
const [base = 'http://localhost:5173/', ...only] = process.argv.slice(2);
const slugs = only.length ? only : ALL;
const WIDTH = 1600;
const HEIGHT = 800;

mkdirSync('static/seam', { recursive: true });
const browser = await chromium.launch({
	executablePath: process.env.PW_CHROMIUM || undefined,
	args: ['--enable-unsafe-webgpu']
});
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });

const frames = () =>
	page.evaluate(() => Number(document.querySelector('canvas')?.dataset.frames ?? 0));

async function steady() {
	// wait until the frame counter stops: the engine draws only while something changes
	let last = -1;
	for (let i = 0; i < 80; i++) {
		const n = await frames();
		if (n > 0 && n === last) return;
		last = n;
		await page.waitForTimeout(700);
	}
}

async function push(direction) {
	const divider = page.locator('.divider').first();
	await divider.focus();
	for (let i = 0; i < 12; i++) await page.keyboard.press(`Shift+${direction}`);
}

async function save(slug, side) {
	await steady();
	const data = await page.evaluate(() =>
		document.querySelector('canvas').toDataURL('image/jpeg', 0.86)
	);
	writeFileSync(`static/seam/${slug}-${side}.jpg`, Buffer.from(data.split(',')[1], 'base64'));
	const size = await page.evaluate(() => {
		const c = document.querySelector('canvas');
		return `${c.width}x${c.height}`;
	});
	console.log('wrote', `${slug}-${side}`, size);
}

for (const slug of slugs) {
	await page.goto(new URL(`demo/${slug}/?present=readback`, base).href, {
		waitUntil: 'networkidle'
	});
	await page.locator('canvas').first().waitFor();
	await steady();
	await page.keyboard.press('h'); // the picture alone, filling the window
	await page.waitForTimeout(400);
	await push('ArrowRight');
	await save(slug, 'light');
	await push('ArrowLeft');
	await save(slug, 'gravity');
}
await browser.close();
