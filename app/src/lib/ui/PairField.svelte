<script lang="ts">
	/**
	 * The changing tidal field of two black holes in orbit, mapped in the plane
	 * of the orbit and animated: E_zz = A(r) cos(2 Omega t - 2 phi + delta(r)),
	 * from the reference implementation's linearized solution (to the quadrupole)
	 * (lib/vistas/pair.ts). Colour gives the phase (orange stretch, blue
	 * squeeze across the plane); the strength, which falls from r^-5 to r^-1,
	 * is left out so that the pattern can be followed at every distance.
	 */
	import { pairField, separationOverWavelength } from '../vistas/pair';

	interface Props {
		/** Orbital speed of each hole, in units of c. */
		speed: number;
		/** Half the width of the smaller side of the view, in wavelengths. */
		reach: number;
		/** Whether the pair turns. */
		playing: boolean;
		/** Seconds per wave period on screen. */
		period?: number;
	}

	let { speed, reach, playing, period = 1.6 }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let width = $state(0);
	let height = $state(0);

	/** The colour scale: blue, cream, orange, as in the paper. */
	const PALETTE = (() => {
		const cool = [42, 103, 173];
		const mid = [247, 243, 236];
		const warm = [176, 86, 10];
		const out = new Uint8ClampedArray(256 * 3);
		for (let i = 0; i < 256; i++) {
			const t = (i / 255) * 2 - 1;
			const [a, b, f] = t < 0 ? [mid, cool, -t] : [mid, warm, t];
			for (let k = 0; k < 3; k++) out[i * 3 + k] = a[k] + (b[k] - a[k]) * f;
		}
		return out;
	})();

	function draw(node: HTMLCanvasElement) {
		const ctx = node.getContext('2d')!;
		let raf = 0;
		let tau = 0;
		let last = performance.now();
		let key = '';
		let phase = new Float32Array(0);
		let inside = new Uint8Array(0);
		let image: ImageData | undefined;

		const prepare = (w: number, h: number) => {
			const half = Math.min(w, h) / 2;
			const perPixel = reach / half;
			const d = separationOverWavelength(speed);
			phase = new Float32Array(w * h);
			inside = new Uint8Array(w * h);
			for (let j = 0; j < h; j++) {
				for (let i = 0; i < w; i++) {
					const x = (i + 0.5 - w / 2) * perPixel;
					const y = (h / 2 - j - 0.5) * perPixel;
					const r = Math.hypot(x, y);
					const k = j * w + i;
					// within the orbit the expansion of the field in multipoles fails
					if (r < 0.8 * d) {
						inside[k] = 1;
						continue;
					}
					phase[k] = pairField(r).delta - 2 * Math.atan2(y, x);
				}
			}
			image = ctx.createImageData(w, h);
		};

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);
			const w = node.width;
			const h = node.height;
			if (!w || !h) return;
			if (playing) tau += (now - last) / 1000 / period;
			last = now;
			const k = JSON.stringify([w, h, speed, reach]);
			if (k !== key) {
				key = k;
				prepare(w, h);
			}
			const data = image!.data;
			const turn = 2 * Math.PI * tau;
			for (let p = 0; p < phase.length; p++) {
				const o = p * 4;
				if (inside[p]) {
					data[o] = 38;
					data[o + 1] = 40;
					data[o + 2] = 48;
				} else {
					const c = Math.round((Math.cos(phase[p] + turn) * 0.5 + 0.5) * 255) * 3;
					data[o] = PALETTE[c];
					data[o + 1] = PALETTE[c + 1];
					data[o + 2] = PALETTE[c + 2];
				}
				data[o + 3] = 255;
			}
			ctx.putImageData(image!, 0, 0);
			// the two holes, turning at half the frequency of their waves
			const half = Math.min(w, h) / 2;
			const scale = half / reach;
			const d = separationOverWavelength(speed) * scale;
			const angle = Math.PI * tau;
			const hole = Math.max(2, 4 * speed * speed * d);
			ctx.strokeStyle = 'rgb(255 255 255 / 0.55)';
			ctx.lineWidth = 1;
			ctx.setLineDash([3, 3]);
			ctx.beginPath();
			ctx.arc(w / 2, h / 2, scale / (2 * Math.PI), 0, 2 * Math.PI);
			ctx.stroke();
			ctx.setLineDash([]);
			for (const s of [1, -1]) {
				ctx.beginPath();
				ctx.arc(
					w / 2 + (s * d * Math.cos(angle)) / 2,
					h / 2 - (s * d * Math.sin(angle)) / 2,
					hole,
					0,
					2 * Math.PI
				);
				ctx.fillStyle = '#000';
				ctx.fill();
				ctx.strokeStyle = 'rgb(255 255 255 / 0.7)';
				ctx.stroke();
			}
			node.dataset.frames = String(Number(node.dataset.frames ?? 0) + 1);
		};
		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}

	// draw at half the screen's resolution: the pattern is smooth
	$effect(() => {
		if (!canvas) return;
		const ratio = Math.min(window.devicePixelRatio || 1, 2) * 0.5;
		canvas.width = Math.max(1, Math.round(width * ratio));
		canvas.height = Math.max(1, Math.round(height * ratio));
	});
</script>

<div class="frame" bind:clientWidth={width} bind:clientHeight={height}>
	<canvas
		bind:this={canvas}
		{@attach draw}
		aria-label="Map of the changing tidal field of two black holes in orbit, seen from above the orbit"
	></canvas>
	<p class="scale">dashed circle: λ/2π, where Newton’s field gives way to the waves</p>
</div>

<style>
	.frame {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #0b0c10;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	.scale {
		position: absolute;
		left: 50%;
		bottom: var(--tag-inset, 14px);
		translate: -50% 0;
		margin: 0;
		padding: 0.4em 0.75em;
		border-radius: 999px;
		background: rgb(8 10 14 / 0.6);
		border: 1px solid rgb(255 255 255 / 0.14);
		color: rgb(255 255 255 / 0.8);
		font: 500 0.7rem/1.2 var(--font-sans);
		white-space: nowrap;
		pointer-events: none;
	}
</style>
