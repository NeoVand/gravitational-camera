<script module lang="ts">
	import type { Vec3 } from '../pixel/complex';

	/** Where the camera stands in the scene, below the body's track. */
	export const CAMERA: Vec3 = [0, -2.7, 0];
</script>

<script lang="ts">
	/**
	 * A body crossing a scene with light slowed down (labelled so): the stretch axis of the tidal field at points
	 * of the plane, all pointing at where the body is now; a camera below, whose light shows the body where it was
	 * and whose gravitational pixel points at where it is. After a stop, the ring of news spreads at the speed of
	 * light (lib/pixel/present.ts).
	 */
	import {
		extrapolated,
		informed,
		position,
		retarded,
		stretchAxis,
		type Crossing
	} from '../pixel/present';

	interface Props {
		crossing: Crossing;
		/** seconds since the body set out */
		t: number;
	}

	let { crossing, t }: Props = $props();

	const SPAN = { x: 6.6, y: 3.6 };

	/** The colours of the drawing, from the theme: the ground, gravity's and light's colours, and the ink. */
	type Palette = { ground: string; gravity: string; light: string; ink: string; dim: string };

	/** A canvas cannot read the theme's custom properties: they are read from the element it is drawn in. */
	function readPalette(node: Element): Palette {
		const css = getComputedStyle(node);
		const token = (name: string, otherwise: string) =>
			css.getPropertyValue(name).trim() || otherwise;
		return {
			ground: token('--bg-sunken', '#18120b'),
			gravity: token('--accent', '#e8a45a'),
			light: token('--c-light', '#7fb4ff'),
			ink: token('--text', '#d2dde7'),
			dim: token('--text-dim', '#a2acb4')
		};
	}

	/** Calls `changed` whenever the theme may have changed: the site's switch, or the system's own setting. */
	function watchTheme(changed: () => void) {
		const observer = new MutationObserver(changed);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'class']
		});
		const media = window.matchMedia('(prefers-color-scheme: light)');
		media.addEventListener('change', changed);
		return () => {
			observer.disconnect();
			media.removeEventListener('change', changed);
		};
	}

	function draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext('2d')!;
		let raf = 0;
		// every frame is drawn afresh, so a change of theme shows at the next one
		let palette = readPalette(canvas);
		const unwatch = watchTheme(() => (palette = readPalette(canvas)));
		const frame = () => {
			const dpr = window.devicePixelRatio || 1;
			const w = canvas.clientWidth,
				h = canvas.clientHeight;
			if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
				canvas.width = Math.round(w * dpr);
				canvas.height = Math.round(h * dpr);
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			paint(ctx, w, h, palette);
			canvas.dataset.frames = String(Number(canvas.dataset.frames ?? 0) + 1);
			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);
		return () => {
			cancelAnimationFrame(raf);
			unwatch();
		};
	}

	function paint(ctx: CanvasRenderingContext2D, w: number, h: number, colours: Palette) {
		const { ground, gravity: GRAVITY, light: LIGHT, ink, dim } = colours;
		const k = crossing;
		const s = Math.min((w * 0.9) / (2 * SPAN.x), (h * 0.78) / (2 * SPAN.y));
		const ox = w / 2,
			oy = h * 0.47;
		const X = (p: Vec3) => ox + p[0] * s,
			Y = (p: Vec3) => oy - p[1] * s;
		ctx.fillStyle = ground;
		ctx.fillRect(0, 0, w, h);

		const now = position(k, t);
		const would = extrapolated(k, t);
		const stopped = k.stop !== undefined && t >= k.stop;

		// the field: a short line along the stretch axis at points of the plane, fainter where it is weaker
		const step = 0.5;
		ctx.lineCap = 'round';
		ctx.strokeStyle = GRAVITY;
		ctx.lineWidth = 1.4;
		for (let gx = -SPAN.x + step / 2; gx < SPAN.x; gx += step) {
			for (let gy = -SPAN.y + step / 2; gy < SPAN.y; gy += step) {
				const p: Vec3 = [gx, gy, 0];
				const d = Math.hypot(gx - now[0], gy - now[1]);
				if (d < 0.35) continue;
				const { axis } = stretchAxis(k, p, t);
				const reach = 0.19 * s;
				const a = Math.max(0.14, Math.min(0.85, 1.25 / (d + 0.3)));
				ctx.globalAlpha = a;
				ctx.beginPath();
				ctx.moveTo(X(p) - axis[0] * reach, Y(p) + axis[1] * reach);
				ctx.lineTo(X(p) + axis[0] * reach, Y(p) - axis[1] * reach);
				ctx.stroke();
			}
		}

		// the track and, after a stop, the ring of news
		ctx.setLineDash([4, 6]);
		ctx.strokeStyle = ink;
		ctx.globalAlpha = 0.18;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(X([-SPAN.x, now[1], 0]), Y(now));
		ctx.lineTo(X([SPAN.x, now[1], 0]), Y(now));
		ctx.stroke();
		if (stopped) {
			const r = k.c * (t - (k.stop as number)) * s;
			ctx.globalAlpha = 0.55;
			ctx.setLineDash([3, 4]);
			ctx.beginPath();
			ctx.arc(X(now), Y(now), r, 0, 2 * Math.PI);
			ctx.stroke();
		}
		ctx.setLineDash([]);
		ctx.globalAlpha = 1;

		// what each kind of pixel at the camera says: light's image, and gravity's stretch axis
		const image = retarded(k, CAMERA, t);
		const axis = stretchAxis(k, CAMERA, t).axis;
		const toTrack = (now[1] - CAMERA[1]) / axis[1];
		const aim: Vec3 = [CAMERA[0] + axis[0] * toTrack, now[1], 0];
		ray(ctx, X(CAMERA), Y(CAMERA), X(image), Y(image), LIGHT);
		ray(ctx, X(CAMERA), Y(CAMERA), X(aim), Y(aim), GRAVITY);

		// where the body would be, if the camera has not yet heard that it stopped
		if (stopped && !informed(k, CAMERA, t)) {
			ctx.strokeStyle = GRAVITY;
			ctx.setLineDash([2, 3]);
			ctx.beginPath();
			ctx.arc(X(would), Y(would), 0.22 * s, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.setLineDash([]);
			label(ctx, 'where it would be', X(would), Y(would) - 0.38 * s, GRAVITY);
		}
		// light's picture of the body
		ctx.strokeStyle = LIGHT;
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(X(image), Y(image), 0.22 * s, 0, 2 * Math.PI);
		ctx.stroke();
		// its words stay inside the drawing when the picture is at the edge, and are left out while it is beyond it
		if (X(image) > -0.22 * s && X(image) < w + 0.22 * s) {
			label(ctx, 'light shows it here', X(image), Y(image) + 0.48 * s, LIGHT, w);
		}
		// the body itself
		ctx.fillStyle = ink;
		ctx.beginPath();
		ctx.arc(X(now), Y(now), 0.2 * s, 0, 2 * Math.PI);
		ctx.fill();
		label(ctx, stopped ? 'stopped' : 'now', X(now), Y(now) - 0.38 * s, ink);
		// the camera
		ctx.fillStyle = ink;
		ctx.fillRect(X(CAMERA) - 7, Y(CAMERA) - 5, 14, 10);
		label(ctx, 'camera', X(CAMERA), Y(CAMERA) + 22, dim);
	}

	function ray(
		ctx: CanvasRenderingContext2D,
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		colour: string
	) {
		ctx.strokeStyle = colour;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.stroke();
	}

	function label(
		ctx: CanvasRenderingContext2D,
		text: string,
		x: number,
		y: number,
		colour: string,
		/** the width of the drawing, if the words are to be kept inside it */
		within?: number
	) {
		ctx.font = '500 12px Inter Variable, system-ui, sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = colour;
		if (within !== undefined) {
			const half = ctx.measureText(text).width / 2 + 6;
			x = Math.min(Math.max(x, half), within - half);
		}
		ctx.fillText(text, x, y);
	}
</script>

<div class="frame">
	<canvas
		{@attach draw}
		aria-label="A body crossing a scene: the tidal field points at where it is, light shows where it was"
	></canvas>
	<p class="tag">light slowed to {(1 / crossing.beta).toFixed(2)} times the body’s speed</p>
</div>

<style>
	.frame {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: var(--bg-sunken);
		/* light's colour, beside gravity's (the accent), in either theme */
		--c-light: #7fb4ff;
	}
	:global(:root[data-theme='light']) .frame {
		--c-light: #2d5f8e;
	}
	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .frame {
			--c-light: #2d5f8e;
		}
	}
	:global(:root .always-dark) .frame {
		--c-light: #7fb4ff;
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
	/* the caption, as on every figure: a pill at the foot of the picture */
	.tag {
		position: absolute;
		left: 50%;
		bottom: var(--tag-inset, 14px);
		translate: -50% 0;
		width: max-content;
		max-width: calc(100% - 2rem);
		margin: 0;
		padding: 0.4em 0.85em;
		border-radius: 1em;
		background: color-mix(in srgb, var(--bg-sunken) 72%, transparent);
		border: 1px solid var(--line-strong);
		backdrop-filter: blur(6px);
		color: var(--text-dim);
		font: 500 0.75rem/1.35 var(--font-sans);
		font-variant-numeric: tabular-nums;
		text-align: center;
		text-wrap: balance;
		pointer-events: none;
	}
</style>
