// Thumbnails of the interactive figures, for the list at /figures: each figure's drawing alone, cropped to the box
// its marks fill (with a little of the stage around them) at the list's 16:9, in each theme, so that the drawing
// fills its frame and its words can be read.
//
//   node scripts/figure-thumbs.mjs [base url] [slug[:wait ms] ...]   (default base http://localhost:5173/, all figures)
//
// Writes static/figure-thumbs/<slug>-dark.jpg and <slug>-light.jpg at 960 x 540. A slug may carry a wait in
// milliseconds after a colon (marked-ring:2600), for a page that should be caught part of the way through its run.
// Set PW_CHROMIUM to a Chromium binary if Playwright's own download is not available.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const ALL = [
	'four-stars',
	'four-voices',
	'now-and-then',
	'speedometer',
	'ranging',
	'one-pixel-sky',
	'beyond-einstein',
	'push-and-weigh',
	'a-mass-that-passes',
	'a-hidden-flow',
	'black-hole-response',
	'marked-ring:2600'
];
const args = process.argv.slice(2);
const base = args[0]?.startsWith('http') ? args.shift() : 'http://localhost:5173/';
const slugs = args.length ? args : ALL;
/**
 * Layouts for the thumbnail alone, where the page's own would leave the frame mostly empty: the two skies of
 * four-stars, a column on the page, side by side.
 */
const LAYOUT = {
	'four-stars': `.skies { flex-direction: row !important; gap: 1rem !important; }
		.sky { width: min(46cqw, 92cqh) !important; }`
};
const W = 960;
const H = 540;
/** Room left around the marks, as a fraction of the box. */
const MARGIN = 0.07;

mkdirSync('static/figure-thumbs', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
for (const theme of ['dark', 'light']) {
	// the page is laid out at 1280 x 720, as a visitor sees it, and taken at twice that, to be cropped
	const context = await browser.newContext({
		viewport: { width: 1280, height: 720 },
		deviceScaleFactor: 2
	});
	await context.addInitScript((t) => localStorage.setItem('theme', t), theme);
	const page = await context.newPage();
	for (const arg of slugs) {
		const [slug, wait] = arg.split(':');
		await page.goto(new URL(`figures/${slug}/`, base).href, { waitUntil: 'networkidle' });
		await page.locator('main[data-ready]').waitFor();
		await page.keyboard.press('h');
		// the stage's room for the full-screen controls, which are hidden, is given to the drawing
		await page.addStyleTag({
			content: `button.unhide { visibility: hidden !important; }
				main, main * { --stage-pad: 1.2rem 1rem 3.2rem !important; --tag-inset: 0.9rem !important; }
				${LAYOUT[slug] ?? ''}`
		});
		await page.waitForTimeout(Number(wait ?? 800));
		// the box of the drawing's marks: its pictures and words, not the stage they sit on
		const box = await page.evaluate(() => {
			const marks = [...document.querySelectorAll('main svg, main p, main canvas')].filter((e) => {
				const s = getComputedStyle(e);
				const r = e.getBoundingClientRect();
				return (
					r.width > 2 &&
					r.height > 2 &&
					s.visibility !== 'hidden' &&
					+s.opacity > 0.05 &&
					!e.closest('button, header, nav, aside, [role="tablist"]')
				);
			});
			const outer = marks.filter((e) => !marks.some((o) => o !== e && o.contains(e)));
			const rects = outer.map((e) => e.getBoundingClientRect());
			return {
				x0: Math.min(...rects.map((r) => r.left)),
				y0: Math.min(...rects.map((r) => r.top)),
				x1: Math.max(...rects.map((r) => r.right)),
				y1: Math.max(...rects.map((r) => r.bottom))
			};
		});
		const vw = 1280;
		const vh = 720;
		let w = (box.x1 - box.x0) * (1 + 2 * MARGIN);
		let h = (box.y1 - box.y0) * (1 + 2 * MARGIN);
		// widened or heightened to 16:9 about the drawing's centre, and kept on the page
		if (w / h < 16 / 9) w = (h * 16) / 9;
		else h = (w * 9) / 16;
		if (w > vw || h > vh) [w, h] = [vw, vh];
		const cx = (box.x0 + box.x1) / 2;
		const cy = (box.y0 + box.y1) / 2;
		const x = Math.min(Math.max(cx - w / 2, 0), vw - w);
		const y = Math.min(Math.max(cy - h / 2, 0), vh - h);
		const png = await page.screenshot({ clip: { x, y, width: w, height: h } });
		// scaled to the thumbnail's size in a canvas, as a JPEG
		const jpeg = await page.evaluate(
			async ({ data, W, H }) => {
				const img = new Image();
				img.src = `data:image/png;base64,${data}`;
				await img.decode();
				const canvas = document.createElement('canvas');
				canvas.width = W;
				canvas.height = H;
				const g = canvas.getContext('2d');
				g.imageSmoothingQuality = 'high';
				g.drawImage(img, 0, 0, W, H);
				return canvas.toDataURL('image/jpeg', 0.88).split(',')[1];
			},
			{ data: png.toString('base64'), W, H }
		);
		writeFileSync(`static/figure-thumbs/${slug}-${theme}.jpg`, Buffer.from(jpeg, 'base64'));
		console.log('wrote', slug, theme, `${Math.round(w)} x ${Math.round(h)}`);
	}
	await context.close();
}
await browser.close();
