<script lang="ts">
	/**
	 * The changing tidal field of two black holes in orbit, mapped in the plane of the orbit and animated, from the
	 * reference implementation's linearized solution (to the quadrupole) (lib/vistas/pair.ts). It is drawn by the rules
	 * of every demo's "Tidal field" view (lib/pixel/field-view.ts), with the look the reader has set (field-look): a
	 * wash over every point, coloured by the direction of the stretch, by the strength or by stretch against squeeze,
	 * its strength on a logarithmic scale; and one fine stroke to a cell along the stretch as it lies in the plane.
	 *
	 * Here colour by sign is the stretch or squeeze across the plane, E_zz, as in the paper's figure: orange where it
	 * is stretched (E_zz < 0), pale where it passes through zero, blue where squeezed. The strength scale is set
	 * against the median of the field's size over the view, as a root mean square over a wave period (pairScale), so
	 * that it does not change as the pair turns. Within the orbit the expansion in multipoles fails, and nothing is
	 * drawn there. How the wash here departs from the shared rules, and why, is at `markAt`.
	 */
	import {
		fieldLevel,
		markOf,
		strokeHalf,
		strokeUniforms,
		toDisplay,
		PALE,
		SQUEEZE,
		STRETCH,
		type FieldLook,
		type Rgb
	} from '../pixel/field-view';
	import { pairScale, pairTensorAt, separationOverWavelength } from '../vistas/pair';
	import { fieldLook } from './field-look.svelte';

	interface Props {
		/** Orbital speed of each hole, in units of c. */
		speed: number;
		/** Half the width of the smaller side of the view, in wavelengths. */
		reach: number;
		/** Whether the pair turns. */
		playing: boolean;
		/** Seconds per wave period on screen. */
		period?: number;
		/** Draw the map of the field; without it only the pair on its orbit is drawn. */
		field?: boolean;
	}

	let { speed, reach, playing, period = 1.6, field = true }: Props = $props();

	let width = $state(0);
	let height = $state(0);

	/** The wash is worked out at no more than this many points and smoothed between them: the field is smooth. */
	const POINTS = 90_000;
	/** What lies beneath the wash, in linear light: the dark of the page, and within the orbit a lighter grey. */
	const BENEATH = (11 / 255) ** 2.2;
	const ORBIT = 'rgb(38 40 48)';

	/** A linear value as the screen shows it, 0 to 255, from a table: the wash needs it at every point and frame. */
	const SHOWN = (() => {
		const out = new Uint8ClampedArray(4097);
		for (let i = 0; i <= 4096; i++) out[i] = Math.round(255 * toDisplay(i / 4096));
		return out;
	})();
	const shown = (c: number) => SHOWN[Math.round(Math.max(0, Math.min(1, c)) * 4096)];

	/**
	 * The changing tensor at the points of a lattice, as amplitudes: for each point its angle phi and the real and
	 * imaginary parts of c_rr, c_rphi, c_phiphi and c_zz in s⁻² (NaN where there is nothing). The orbit's disc, out
	 * to 0.8 of the separation, is drawn over the field; the field is worked out to half of it, so that the wash
	 * blends up to the disc's edge and not into the dark.
	 */
	function lattice(points: [number, number][]) {
		const out = new Float64Array(points.length * 9);
		points.forEach(([x, y], p) => {
			const t = pairTensorAt(speed, x, y, undefined, 0.5);
			const o = p * 9;
			if (!t) {
				out[o] = NaN;
				return;
			}
			out.set([t.phi, ...t.rr, ...t.rphi, ...t.phiphi, ...t.zz], o);
		});
		return out;
	}

	/**
	 * Colour by direction, the hue of a stretch along a unit vector of the picture (right, up, along the view): as
	 * markOf draws it, red across, green up and down, blue along the view, the strongest part full.
	 */
	const directionHue = (s0: number, s1: number, s2: number): Rgb => {
		const top = Math.max(Math.abs(s0), Math.abs(s1), Math.abs(s2), 1e-6);
		return [Math.abs(s0) / top, Math.abs(s1) / top, Math.abs(s2) / top];
	};

	/**
	 * How far apart the two least principal values must be, against the field's size, before the direction of the
	 * stretch is drawn in its own colour alone. Where they meet, the stretch has no one direction: it pulls equally
	 * along both axes, and the wash takes the mean of their two colours, so that the colour passes from one to the
	 * other without an edge.
	 */
	const DEFINITE = 0.2;

	/**
	 * Colour by sign, here: E_zz over its amplitude, -1 to 1, as the paper's figure draws it, orange for a stretch
	 * across the plane, pale where it passes through zero, blue for a squeeze. The stops are mixed as the screen
	 * shows them, as the paper's colour map is, and kept in linear light.
	 */
	const DIVERGING = (() => {
		const n = 256;
		const out = new Float64Array(3 * (n + 1));
		const shownAs = (c: Rgb) => c.map((v) => v ** (1 / 2.2));
		const [pale, stretch, squeeze] = [PALE, STRETCH, SQUEEZE].map(shownAs);
		for (let i = 0; i <= n; i++) {
			const s = (i / n) * 2 - 1;
			const end = s > 0 ? stretch : squeeze;
			for (let k = 0; k < 3; k++)
				out[3 * i + k] = (pale[k] + (end[k] - pale[k]) * Math.abs(s)) ** 2.2;
		}
		return (s: number): Rgb => {
			const i = 3 * Math.round((Math.max(-1, Math.min(1, s)) + 1) * 0.5 * n);
			return [out[i], out[i + 1], out[i + 2]];
		};
	})();

	/**
	 * What the view draws at lattice point p at the phase `turn` = 2 Omega t, from the amplitudes: the stroke, as
	 * fieldMark makes it, along the stretch at its strength now; and the wash's tone and cover beneath it.
	 *
	 * The wash follows the shared rules but in two ways, both for this map alone. Coloured by direction, its colour
	 * fades from one axis's to the other's where the two least principal values come together (DEFINITE), rather than
	 * switching at a hard edge. Coloured by sign, it is the paper's map of E_zz, pale at zero, and its brightness and
	 * cover are the strength as a root mean square over a wave period, the measure the scale is set against: the
	 * field passes through zero twice a period at every point, and the wash would otherwise go dark there.
	 */
	function markAt(a: Float64Array, p: number, turn: number, reference: number, look: FieldLook) {
		const o = p * 9;
		const phi = a[o];
		if (Number.isNaN(phi)) return undefined;
		// the tensor at phi is that at phi = 0 and the time t - phi / Omega, turned by phi
		const theta = turn - 2 * phi;
		const cs = Math.cos(theta);
		const sn = Math.sin(theta);
		const rr = a[o + 1] * cs - a[o + 2] * sn;
		const rphi = a[o + 3] * cs - a[o + 4] * sn;
		const phiphi = a[o + 5] * cs - a[o + 6] * sn;
		const zz = a[o + 7] * cs - a[o + 8] * sn;
		const size = Math.sqrt(0.5 * (rr * rr + phiphi * phiphi + zz * zz + 2 * rphi * rphi));
		const level = fieldLevel(size, reference, look.shift);
		// the principal values in the plane, mid -/+ half, along the angles `along` + pi / 2 and `along`; and E_zz
		const mid = 0.5 * (rr + phiphi);
		const half = Math.hypot(0.5 * (rr - phiphi), rphi);
		const along = phi + 0.5 * Math.atan2(2 * rphi, rr - phiphi);
		const inPlane = (angle: number): [number, number, number] => [
			Math.cos(angle),
			Math.sin(angle),
			0
		];
		// the stretch: the least principal value, across the plane or in it; and the next least, with its axis
		const normal: [number, number, number] = [0, 0, 1];
		let screen = normal;
		let next = inPlane(along + Math.PI / 2);
		let gap = mid - half - zz;
		if (zz > mid - half) {
			screen = next;
			next = zz < mid + half ? normal : inPlane(along);
			gap = Math.min(zz, mid + half) - (mid - half);
		}
		const stroke = markOf(level, screen, look, () => SQUEEZE);
		if (look.colour === 'strength') return { stroke, tone: stroke.tone, cover: stroke.cover };

		if (look.colour === 'direction') {
			const t = Math.max(0, Math.min(1, gap / Math.max(size, 1e-300) / DEFINITE));
			const share = 0.5 * (1 - t * t * (3 - 2 * t));
			const first = directionHue(...screen);
			const other = directionHue(...next);
			const hue = first.map((h, k) => h + (other[k] - h) * share) as Rgb;
			const mark = markOf(level, screen, { ...look, colour: 'sign' }, () => hue);
			return { stroke, tone: mark.tone, cover: mark.cover };
		}

		// by sign: E_zz against its amplitude, and the size's root mean square over a period
		const sq = (k: number) => a[o + k] * a[o + k] + a[o + k + 1] * a[o + k + 1];
		const amplitude = Math.sqrt(sq(7));
		const rms = Math.sqrt((sq(1) + sq(5) + sq(7) + 2 * sq(3)) / 4);
		const mark = markOf(fieldLevel(rms, reference, look.shift), screen, look, (): Rgb =>
			DIVERGING(-zz / Math.max(amplitude, 1e-12 * rms, 1e-300))
		);
		return { stroke, tone: mark.tone, cover: mark.cover };
	}

	function draw(node: HTMLCanvasElement) {
		const ctx = node.getContext('2d')!;
		let raf = 0;
		let tau = 0;
		let last = performance.now();
		let key = '';
		let cols = 0;
		let rows = 0;
		let block = 1;
		let wash = new Float64Array(0);
		let small: OffscreenCanvas | undefined;
		let image: ImageData | undefined;
		let cellKey = '';
		let cellAt: [number, number][] = [];
		let strokes = new Float64Array(0);
		let reference = 1;

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);
			const w = node.width;
			const h = node.height;
			if (!w || !h) return;
			if (playing) tau += (now - last) / 1000 / period;
			last = now;
			const look = $state.snapshot(fieldLook);
			// wavelengths per canvas pixel, and a canvas pixel's place in wavelengths from the pair
			const perPixel = reach / (Math.min(w, h) / 2);
			const place = (px: number, py: number): [number, number] => [
				(px - w / 2) * perPixel,
				(h / 2 - py) * perPixel
			];
			const k = JSON.stringify([w, h, speed, reach]);
			if (k !== key) {
				key = k;
				cellKey = '';
				reference = pairScale(speed, reach);
				block = Math.max(1, Math.ceil(Math.sqrt((w * h) / POINTS)));
				cols = Math.ceil(w / block) + 1;
				rows = Math.ceil(h / block) + 1;
				const points: [number, number][] = [];
				for (let j = 0; j < rows; j++)
					for (let i = 0; i < cols; i++) points.push(place(i * block, j * block));
				wash = lattice(points);
				small = new OffscreenCanvas(cols, rows);
				image = new ImageData(cols, rows);
			}
			const turn = 2 * Math.PI * tau;
			const scale = Math.min(w, h) / 2 / reach;
			const ratio = w / Math.max(1, width);

			ctx.fillStyle = '#18120b';
			ctx.fillRect(0, 0, w, h);
			let drawn = 0;
			if (field && small && image) {
				// the wash, over the dark beneath it as the shader mixes them in linear light
				const data = image.data;
				for (let p = 0; p < cols * rows; p++) {
					const o = p * 4;
					const at = markAt(wash, p, turn, reference, look);
					if (!at) {
						data[o + 3] = 0;
						continue;
					}
					const under = BENEATH * 0.85 * (1 - at.cover);
					data[o] = shown(under + at.tone[0] * at.cover);
					data[o + 1] = shown(under + at.tone[1] * at.cover);
					data[o + 2] = shown(under + at.tone[2] * at.cover);
					data[o + 3] = 255;
				}
				small.getContext('2d')!.putImageData(image, 0, 0);
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'high';
				ctx.drawImage(small, 0, 0, cols, rows, -block / 2, -block / 2, cols * block, rows * block);

				// one stroke to a cell along the stretch, white mixed in at 0.38 in linear light, with a hairline of
				// shade about it where the look asks for one; strokes of one strength of white are drawn together
				const [cell, , weight] = strokeUniforms(look);
				if (cell >= 1) {
					const ck = `${key}|${cell}`;
					if (ck !== cellKey) {
						cellKey = ck;
						cellAt = [];
						for (let cy = 0; cy * cell < h; cy++)
							for (let cx = 0; cx * cell < w; cx++)
								cellAt.push([(cx + 0.5) * cell, (cy + 0.5) * cell]);
						strokes = lattice(cellAt.map(([x, y]) => place(x, y)));
					}
					const edges = new Path2D();
					const lines = Array.from({ length: 16 }, () => new Path2D());
					cellAt.forEach(([x, y], p) => {
						const at = markAt(strokes, p, turn, reference, look);
						if (!at) return;
						const mark = at.stroke;
						const half = strokeHalf(mark, look);
						if (half <= 1) return;
						const segment = (path: Path2D) => {
							path.moveTo(x - half * mark.across[0], y - half * mark.across[1]);
							path.lineTo(x + half * mark.across[0], y + half * mark.across[1]);
						};
						segment(edges);
						const washed = at.tone.map((t) => BENEATH * 0.85 * (1 - at.cover) + t * at.cover);
						const under = washed.reduce((s, c) => s + toDisplay(c), 0) / 3;
						const lit = washed.reduce((s, c) => s + toDisplay(0.62 * c + 0.38), 0) / 3;
						const alpha = (lit - under) / (1 - under);
						segment(lines[Math.max(0, Math.min(15, Math.round(alpha * 15)))]);
						drawn++;
					});
					ctx.lineCap = 'round';
					if (look.edge > 0) {
						ctx.lineWidth = 2 * weight + 1.5;
						ctx.strokeStyle = `rgb(0 0 0 / ${1 - toDisplay(1 - 0.55 * look.edge)})`;
						ctx.stroke(edges);
					}
					ctx.lineWidth = 2 * weight;
					lines.forEach((path, i) => {
						ctx.strokeStyle = `rgb(255 255 255 / ${i / 15})`;
						ctx.stroke(path);
					});
				}
			}

			// within the orbit there is no field to draw; without the field, nothing but the pair
			const d = separationOverWavelength(speed) * scale;
			ctx.fillStyle = ORBIT;
			if (field) {
				ctx.beginPath();
				ctx.arc(w / 2, h / 2, 0.8 * d, 0, 2 * Math.PI);
				ctx.fill();
			} else ctx.fillRect(0, 0, w, h);

			// the edge of the near zone, r = lambda / 2 pi, and the two holes, turning at half the frequency of their
			// waves: each drawn at its horizon's size, 4 v^2 of the separation, or two screen pixels if larger
			const angle = Math.PI * tau;
			const hole = Math.max(2 * ratio, 4 * speed * speed * d);
			ctx.strokeStyle = 'rgb(255 255 255 / 0.55)';
			ctx.lineWidth = ratio;
			ctx.setLineDash([3 * ratio, 3 * ratio]);
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
			node.dataset.strokes = String(drawn);
			node.dataset.frames = String(Number(node.dataset.frames ?? 0) + 1);
		};
		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}

	/** Drawn at the screen's own resolution, as the other views are: the strokes are a pixel or two wide. */
	function size(node: HTMLCanvasElement) {
		const ratio = Math.min(window.devicePixelRatio || 1, 2);
		node.width = Math.max(1, Math.round(width * ratio));
		node.height = Math.max(1, Math.round(height * ratio));
	}
</script>

<div class="frame" bind:clientWidth={width} bind:clientHeight={height}>
	<canvas
		{@attach size}
		{@attach draw}
		aria-label={field
			? 'The tidal field of two black holes in orbit, its changing part, in the plane of the orbit seen from above: a wash of colour and fine strokes along the stretch'
			: 'Two black holes in orbit, seen from above, with the field not drawn'}
	></canvas>
</div>

<style>
	.frame {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #18120b;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
