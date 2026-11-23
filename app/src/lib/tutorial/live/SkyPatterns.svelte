<script lang="ts">
	/**
	 * Chapter 2.2's patterns on the sky, on a globe the reader turns. In the first mode the globe shows Re Y_ℓm for a
	 * degree ℓ from 0 to 12 and an order m from −ℓ to ℓ, orange where it is positive and blue where it is negative,
	 * with its lines of zeros drawn, and beside it the pattern along the meridian φ = 0 against the polar angle ϑ. In
	 * the second, a cap of the sky 30° in radius is rebuilt from its degrees 0 to L, and the leftover can be shown in
	 * its place. The globe is drawn pixel by pixel as a lit sphere seen from far away (an orthographic view): every
	 * pixel of the disc is a point of the unit sphere, turned into the pattern's own axes, where the pattern is read.
	 * The mathematics is in ./sky-patterns.ts.
	 */
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Globe02Icon, Layers01Icon, Undo02Icon, ViewIcon } from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import {
		CAP,
		MOST_BUILD,
		MOST_DEGREE,
		cap,
		capCoefficients,
		capSquare,
		degrees,
		edge,
		largest,
		latitudeZeros,
		leftoverShare,
		meridianZeros,
		norm,
		patternsUpTo,
		polar,
		radians,
		rebuilt,
		ringing,
		sampleTheta,
		sign
	} from './sky-patterns';

	const uid = $props.id();

	type Mode = 'one' | 'build';
	let mode = $state<Mode>('one');

	// --- the pattern: degree and order, and the degree the cap is rebuilt to -----------------------------------------
	let l = $state(2);
	let m = $state(0);
	let L = $state(4);
	let showLeftover = $state(false);

	function setDegree(v: number) {
		l = Math.max(0, Math.min(MOST_DEGREE, Math.round(v)));
		m = Math.max(-l, Math.min(l, m));
		note();
	}
	function setOrder(v: number) {
		m = Math.max(-l, Math.min(l, Math.round(v)));
		note();
	}
	function setBuild(v: number) {
		L = Math.max(0, Math.min(MOST_BUILD, Math.round(v)));
		if (L >= SHARP) reachedSharp = true;
	}

	// --- the predictions -----------------------------------------------------------------------------------------------
	/** The degrees ℓ ≥ 1 at which the reader has looked at Y_ℓ0. */
	let seen = $state<number[]>([]);
	let askedOne = $state(false);
	let askedBuild = $state(false);
	let reachedSharp = $state(false);
	function note() {
		if (m === 0 && l >= 1 && !seen.includes(l)) seen = [...seen, l];
	}
	const revealed = $derived(
		mode === 'one' ? askedOne || seen.length >= 3 : askedBuild || reachedSharp
	);
	/** The least L at which the rebuilt edge is 10° wide or less: 16. */
	const SHARP = 16;

	// --- the view: the globe is seen from the direction at latitude `tilt` and longitude `turn` -----------------------
	const OPEN = { tilt: radians(22), turn: radians(30) };
	const view = new Tween({ ...OPEN }, { duration: 0 });
	const QUARTER = Math.PI / 2;
	const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

	function look(tilt: number, turn: number, ease = 0) {
		view.set(
			{ tilt: Math.max(-QUARTER, Math.min(QUARTER, tilt)), turn },
			{ duration: prefersReducedMotion.current ? 0 : ease, easing: cubicOut }
		);
	}
	function resetView() {
		const now = view.current;
		// the short way round, then back to the opening view
		view.set({ tilt: now.tilt, turn: OPEN.turn + wrap(now.turn - OPEN.turn) }, { duration: 0 });
		look(OPEN.tilt, OPEN.turn, 450);
	}

	/** The screen's right, its up and the direction toward the viewer, in the pattern's own axes. */
	const frame = $derived.by(() => {
		const { tilt, turn } = view.current;
		const ct = Math.cos(tilt);
		const st = Math.sin(tilt);
		const cp = Math.cos(turn);
		const sp = Math.sin(turn);
		return {
			right: [-sp, cp, 0],
			up: [-st * cp, -st * sp, ct],
			toward: [ct * cp, ct * sp, st]
		};
	});

	// --- what the globe shows: a table of the pattern against ϑ, and how it depends on φ -----------------------------
	const TABLE = 2048;
	const coefficients = $derived(capCoefficients(L));
	const shown = $derived.by(() => {
		if (mode === 'one') {
			const k = Math.abs(m);
			const s = sign(m);
			return {
				table: sampleTheta(TABLE, (t) => s * polar(l, k, t)),
				order: m,
				end: largest(l, m)
			};
		}
		return {
			table: sampleTheta(TABLE, (t) =>
				showLeftover ? cap(t) - rebuilt(L, t, CAP, coefficients) : rebuilt(L, t, CAP, coefficients)
			),
			order: 0,
			end: 1
		};
	});

	// --- the site's colours, read from its tokens, and read again when the theme changes -----------------------------
	type Rgb = [number, number, number];
	function parse(text: string): Rgb | undefined {
		const s = text.trim();
		const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
		if (hex) {
			const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
			return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
		}
		const n = s.match(/[\d.]+/g);
		return n && n.length >= 3 ? [Number(n[0]), Number(n[1]), Number(n[2])] : undefined;
	}
	const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
		a[0] + (b[0] - a[0]) * t,
		a[1] + (b[1] - a[1]) * t,
		a[2] + (b[2] - a[2]) * t
	];
	type Palette = { positive: Rgb; negative: Rgb; zero: Rgb; dark: boolean };
	let palette = $state<Palette | undefined>();

	const theme: Attachment<HTMLElement> = (node) => {
		const read = () => {
			const css = getComputedStyle(node);
			const get = (name: string) => parse(css.getPropertyValue(name));
			const positive = get('--accent');
			const negative = get('--accent-2');
			const text = get('--text');
			const ground = get('--bg-raised');
			if (!positive || !negative || !text || !ground) return;
			const dark = 0.2126 * ground[0] + 0.7152 * ground[1] + 0.0722 * ground[2] < 128;
			// zero is a grey with no hue, so that it is never read as the faint end of either colour
			const z = mix(ground, text, dark ? 0.2 : 0.12);
			const grey = 0.2126 * z[0] + 0.7152 * z[1] + 0.0722 * z[2];
			palette = { positive, negative, zero: [grey, grey, grey], dark };
		};
		read();
		const watch = new MutationObserver(read);
		watch.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'class']
		});
		const media = matchMedia('(prefers-color-scheme: light)');
		media.addEventListener('change', read);
		return () => {
			watch.disconnect();
			media.removeEventListener('change', read);
		};
	};

	// --- the globe, painted pixel by pixel -------------------------------------------------------------------------
	/** The overlay's half-width in its own units; the sphere's radius is 100 of them. */
	const BOX = 122;
	let size = $state(0);

	const measure: Attachment<HTMLElement> = (node) => {
		const seen = new ResizeObserver(() => (size = node.clientWidth));
		seen.observe(node);
		size = node.clientWidth;
		return () => seen.disconnect();
	};

	/**
	 * How strongly a value is coloured: |v/end| to this power, so that the weaker parts of a pattern still show their
	 * sign. The bar under the globe is drawn with the same rule.
	 */
	const GAMMA = 0.6;
	const bar = $derived.by(() => {
		if (!palette) return 'transparent';
		const z = `rgb(${palette.zero.map(Math.round).join(' ')})`;
		const stops: string[] = [];
		for (let i = -6; i <= 6; i++) {
			const t = i / 6;
			const share = Math.round(100 * Math.abs(t) ** GAMMA);
			const end = t < 0 ? 'var(--accent-2)' : 'var(--accent)';
			stops.push(`color-mix(in srgb, ${end} ${share}%, ${z}) ${((t + 1) * 50).toFixed(1)}%`);
		}
		return `linear-gradient(90deg, ${stops.join(', ')})`;
	});

	/** The light, from the upper left and in front, in the screen's axes (right, up, toward the viewer). */
	const LIGHT = (() => {
		const v = [-0.42, 0.55, 0.72];
		const n = Math.hypot(...v);
		return v.map((x) => x / n);
	})();

	function paint(
		target: HTMLCanvasElement,
		px: number,
		look: typeof frame,
		what: typeof shown,
		colours: Palette
	) {
		const N = Math.max(2, Math.round(px));
		if (target.width !== N) {
			target.width = N;
			target.height = N;
		}
		const context = target.getContext('2d');
		if (!context) return;
		const image = context.createImageData(N, N);
		const data = image.data;
		const half = N / 2;
		const R = (half * 100) / BOX;
		const [rx, ry, rz] = look.right;
		const [ux, uy, uz] = look.up;
		const [vx, vy, vz] = look.toward;
		const table = what.table;
		const n = table.length - 1;
		const k = what.order;
		const end = what.end || 1;
		const { positive, negative, zero, dark } = colours;
		const ambient = dark ? 0.56 : 0.66;
		const diffuse = 1 - ambient;
		const [lx, ly, lz] = LIGHT;
		for (let j = 0; j < N; j++) {
			const sy = (half - (j + 0.5)) / R;
			for (let i = 0; i < N; i++) {
				const sx = (i + 0.5 - half) / R;
				const d2 = sx * sx + sy * sy;
				const r = Math.sqrt(d2);
				// the share of the pixel inside the disc, for a smooth rim
				const cover = Math.max(0, Math.min(1, (1 - r) * R + 0.5));
				if (cover <= 0) continue;
				const w = Math.sqrt(Math.max(0, 1 - Math.min(1, d2)));
				const bx = sx * rx + sy * ux + w * vx;
				const by = sx * ry + sy * uy + w * vy;
				const bz = sx * rz + sy * uz + w * vz;
				const theta = Math.acos(Math.max(-1, Math.min(1, bz)));
				const s = (theta / Math.PI) * n;
				const a = Math.min(n - 1, Math.floor(s));
				let v = table[a] + (s - a) * (table[a + 1] - table[a]);
				if (k !== 0) v *= Math.cos(k * Math.atan2(by, bx));
				const t = Math.max(-1, Math.min(1, v / end));
				const c = t >= 0 ? positive : negative;
				const f = Math.abs(t) ** GAMMA;
				const light = ambient + diffuse * Math.max(0, sx * lx + sy * ly + w * lz);
				const at = 4 * (j * N + i);
				data[at] = (zero[0] + (c[0] - zero[0]) * f) * light;
				data[at + 1] = (zero[1] + (c[1] - zero[1]) * f) * light;
				data[at + 2] = (zero[2] + (c[2] - zero[2]) * f) * light;
				data[at + 3] = 255 * cover;
			}
		}
		context.putImageData(image, 0, 0);
	}

	/** Paints the canvas, and paints it again whenever the view, the pattern, the colours or the size change. */
	const draw: Attachment<HTMLCanvasElement> = (node) => {
		if (!palette || size <= 0) return;
		const ratio = Math.min(2, window.devicePixelRatio || 1);
		paint(node, size * ratio, frame, shown, palette);
	};

	// --- lines on the globe: projected, and only their parts on the near side ------------------------------------------
	type V3 = [number, number, number];
	const f2 = (x: number) => x.toFixed(2);
	function project(p: V3) {
		const { right, up, toward } = frame;
		return {
			x: 100 * (p[0] * right[0] + p[1] * right[1] + p[2] * right[2]),
			y: -100 * (p[0] * up[0] + p[1] * up[1] + p[2] * up[2]),
			z: p[0] * toward[0] + p[1] * toward[1] + p[2] * toward[2]
		};
	}
	/** A path through points on the sphere, broken where it goes behind, each piece ended exactly at the rim. */
	function near(points: V3[]) {
		let d = '';
		let open = false;
		let before: ReturnType<typeof project> | undefined;
		for (const p of points) {
			const q = project(p);
			if (before) {
				if (q.z >= 0 && before.z >= 0) {
					d += open
						? `L${f2(q.x)},${f2(q.y)}`
						: `M${f2(before.x)},${f2(before.y)}L${f2(q.x)},${f2(q.y)}`;
					open = true;
				} else if (q.z >= 0 || before.z >= 0) {
					const s = before.z / (before.z - q.z);
					const cx = before.x + s * (q.x - before.x);
					const cy = before.y + s * (q.y - before.y);
					if (q.z >= 0) {
						d += `M${f2(cx)},${f2(cy)}L${f2(q.x)},${f2(q.y)}`;
						open = true;
					} else {
						if (open) d += `L${f2(cx)},${f2(cy)}`;
						open = false;
					}
				}
			}
			before = q;
		}
		return d;
	}
	const latitude = (theta: number): V3[] =>
		Array.from({ length: 241 }, (_, i) => {
			const p = (2 * Math.PI * i) / 240;
			return [Math.sin(theta) * Math.cos(p), Math.sin(theta) * Math.sin(p), Math.cos(theta)];
		});
	const meridian = (phi: number): V3[] =>
		Array.from({ length: 121 }, (_, i) => {
			const t = (Math.PI * i) / 120;
			return [Math.sin(t) * Math.cos(phi), Math.sin(t) * Math.sin(phi), Math.cos(t)];
		});

	const zeros = $derived(mode === 'one' ? latitudeZeros(l, m) : []);
	const halves = $derived(mode === 'one' ? meridianZeros(m) : []);
	const lines = $derived.by(() => {
		const nodes = [...zeros.map((t) => near(latitude(t))), ...halves.map((p) => near(meridian(p)))];
		return {
			nodes: nodes.filter(Boolean),
			reference: near(meridian(0)),
			edge: mode === 'build' ? near(latitude(CAP)) : ''
		};
	});

	/** The z axis out of the north pole, from where it leaves the sphere or comes out from behind it. */
	const axis = $derived.by(() => {
		const pole = project([0, 0, 1]);
		const reach = Math.hypot(pole.x, pole.y) / 100;
		const TIP = 1.2;
		const from = pole.z >= 0 ? 1 : reach > 0 ? 1 / reach : Infinity;
		const visible = pole.z >= 0;
		if (reach < 0.3 || from >= TIP - 0.04)
			return { line: undefined, pole: visible ? pole : undefined, label: undefined };
		const ux = pole.x / (reach * 100);
		const uy = pole.y / (reach * 100);
		return {
			line: {
				x1: pole.x * from,
				y1: pole.y * from,
				x2: pole.x * TIP,
				y2: pole.y * TIP
			},
			pole: visible ? pole : undefined,
			label: { x: pole.x * TIP + ux * 8, y: pole.y * TIP + uy * 8 }
		};
	});

	// --- turning the globe: dragging, and Shift with the arrow keys -------------------------------------------------
	let drag: { id: number; x: number; y: number } | undefined;
	let dragging = $state(false);

	function grab(e: PointerEvent) {
		if (e.button !== 0) return;
		e.preventDefault();
		(e.currentTarget as HTMLElement).focus({ preventScroll: true });
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
		dragging = true;
	}
	function follow(e: PointerEvent) {
		if (!drag || e.pointerId !== drag.id) return;
		// a drag across the sphere's diameter turns it half a turn
		const per = Math.PI / Math.max(1, ((size * 100) / BOX) * 2);
		const dx = e.clientX - drag.x;
		const dy = e.clientY - drag.y;
		drag = { ...drag, x: e.clientX, y: e.clientY };
		look(view.current.tilt + dy * per, view.current.turn - dx * per);
	}
	function release(e: PointerEvent) {
		if (drag && e.pointerId === drag.id) {
			drag = undefined;
			dragging = false;
		}
	}

	const STEP = radians(15);
	function key(e: KeyboardEvent) {
		const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
		if (e.key === 'Home') {
			e.preventDefault();
			resetView();
			return;
		}
		if (!arrows.includes(e.key)) return;
		e.preventDefault();
		if (e.shiftKey) {
			const { tilt, turn } = view.current;
			if (e.key === 'ArrowUp') look(tilt - STEP, turn, 200);
			if (e.key === 'ArrowDown') look(tilt + STEP, turn, 200);
			if (e.key === 'ArrowLeft') look(tilt, turn + STEP, 200);
			if (e.key === 'ArrowRight') look(tilt, turn - STEP, 200);
			return;
		}
		const up = e.key === 'ArrowUp' || e.key === 'ArrowRight';
		if (mode === 'build') setBuild(L + (up ? 1 : -1));
		else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') setDegree(l + (up ? 1 : -1));
		else setOrder(m + (up ? 1 : -1));
	}

	// --- the profile along the meridian φ = 0 ------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	let u = $state(1);
	const plot = $derived.by(() => {
		const W = phone.current ? 340 : 360;
		const H = phone.current ? 230 : 270;
		const box = { x: 40, y: 10, w: W - 40 - 10, h: H - 10 - 34 };
		return { W, H, box };
	});
	/** The vertical range: the pattern's largest size with a margin, or the cap's height with room for its ringing. */
	const range = $derived(
		mode === 'one'
			? { low: -1.12 * (shown.end || 1), high: 1.12 * (shown.end || 1) }
			: { low: -0.3, high: 1.45 }
	);
	const X = (theta: number) => plot.box.x + (theta / Math.PI) * plot.box.w;
	const Y = (v: number) => plot.box.y + ((range.high - v) / (range.high - range.low)) * plot.box.h;

	const SAMPLES = 720;
	const thetas = Array.from({ length: SAMPLES + 1 }, (_, i) => (Math.PI * i) / SAMPLES);
	/** The pattern along φ = 0 in the first mode; f_L in the second. */
	const curve = $derived(
		mode === 'one'
			? thetas.map((t) => sign(m) * polar(l, Math.abs(m), t))
			: thetas.map((t) => rebuilt(L, t, CAP, coefficients))
	);
	const linePath = (values: number[]) =>
		values.map((v, i) => `${i ? 'L' : 'M'}${f2(X(thetas[i]))},${f2(Y(v))}`).join('');
	const curvePath = $derived(linePath(curve));
	const areaPath = $derived(`${curvePath}L${f2(X(Math.PI))},${f2(Y(0))}L${f2(X(0))},${f2(Y(0))}Z`);
	const capPath = $derived(
		`M${f2(X(0))},${f2(Y(1))}L${f2(X(CAP))},${f2(Y(1))}L${f2(X(CAP))},${f2(Y(0))}L${f2(X(Math.PI))},${f2(Y(0))}`
	);
	/** The leftover f − f_L between the cap and f_L, in runs of one sign: orange where it is positive, blue where negative. */
	const leftoverAreas = $derived.by(() => {
		if (mode !== 'build') return { positive: '', negative: '' };
		const out = { positive: '', negative: '' };
		let run: number[] = [];
		let runSign = 0;
		const close = () => {
			if (run.length < 2) return;
			const top = run.map((i, k) => `${k ? 'L' : 'M'}${f2(X(thetas[i]))},${f2(Y(cap(thetas[i])))}`);
			const back = [...run].reverse().map((i) => `L${f2(X(thetas[i]))},${f2(Y(curve[i]))}`);
			const d = top.join('') + back.join('') + 'Z';
			if (runSign > 0) out.positive += d;
			else out.negative += d;
		};
		for (let i = 0; i <= SAMPLES; i++) {
			const r = cap(thetas[i]) - curve[i];
			const s = r > 0 ? 1 : -1;
			if (s !== runSign) {
				if (run.length) {
					run.push(i);
					close();
				}
				run = [i];
				runSign = s;
			} else run.push(i);
		}
		close();
		return out;
	});

	const minus = (s: string) => s.replace('-', '−');
	/** The ticks along ϑ: the zeros, if their labels fit, and the ends; or every 45°. */
	const thetaTicks = $derived.by(() => {
		const ends = [0, Math.PI];
		if (mode === 'one' && zeros.length) {
			const digits = zeros.length <= 4 ? 1 : 0;
			const marks = [...ends, ...zeros].sort((a, b) => a - b);
			const room = (digits ? 38 : 28) * u;
			const fits = marks.every((t, i) => i === 0 || X(t) - X(marks[i - 1]) >= room);
			if (fits)
				return marks.map((t) => ({
					at: t,
					label: `${Number(degrees(t).toFixed(zeros.includes(t) ? digits : 0))}°`,
					zero: zeros.includes(t)
				}));
		}
		return [0, 45, 90, 135, 180].map((d) => ({ at: radians(d), label: `${d}°`, zero: false }));
	});
	const valueTicks = $derived.by(() => {
		if (mode === 'build') return [0, 0.5, 1];
		const top = shown.end || 1;
		const p = 10 ** Math.floor(Math.log10(top));
		const s = [1, 2, 2.5, 5, 10].map((k) => k * p).find((k) => k <= top && k * 2 > top) ?? p;
		return [-s, 0, s];
	});
	const valueLabel = (v: number) => {
		if (v === 0) return '0';
		const t = Math.abs(v) >= 1 ? String(Number(v.toFixed(2))) : String(Number(v.toPrecision(2)));
		return minus(t);
	};

	// --- the numbers -----------------------------------------------------------------------------------------------------
	const deg1 = (t: number) => `${Number(degrees(t).toFixed(1))}°`;
	const deg0 = (t: number) => `${Math.round(degrees(t))}°`;
	const listOf = (items: string[]) =>
		items.length <= 1
			? (items[0] ?? '')
			: `${items.slice(0, -1).join(', ')}${items.length > 2 ? ',' : ''} and ${items[items.length - 1]}`;

	const sub = (a: number, b: number) =>
		b < 0 || a > 9 || Math.abs(b) > 9 ? `${a},${b}` : `${a}${b}`;
	const name = $derived(`Y_{${sub(l, m)}}`);
	const cosm = (k: number) => (k === 0 ? '' : k === 1 ? '\\cos\\varphi' : `\\cos ${k}\\varphi`);

	/** Re Y_ℓm written out: as the chapter writes it up to degree two, and through P_ℓ^m above. */
	const patternTex = $derived.by(() => {
		const k = Math.abs(m);
		const re = m === 0 ? name : `\\mathrm{Re}\\,${name}`;
		const neg = sign(m) < 0;
		if (l === 0) return `${name} = \\sqrt{\\tfrac{1}{4\\pi}} = 0.282`;
		if (l === 1 && k === 0)
			return `${name} = \\sqrt{\\tfrac{3}{4\\pi}}\\,\\cos\\vartheta = 0.489\\cos\\vartheta`;
		if (l === 1) return `${re} = ${m > 0 ? '-' : ''}0.345\\,\\sin\\vartheta\\cos\\varphi`;
		if (l === 2 && k === 0) return `${name} = 0.315\\,(3\\cos^2\\vartheta - 1)`;
		if (l === 2 && k === 1)
			return `${re} = ${m > 0 ? '-' : ''}0.773\\,\\sin\\vartheta\\cos\\vartheta\\cos\\varphi`;
		if (l === 2) return `${re} = 0.386\\,\\sin^2\\vartheta\\cos 2\\varphi`;
		return `${re} = ${neg ? '-' : ''}c\\,P_{${l}}${k ? `^{${k}}` : ''}(\\cos\\vartheta)${cosm(k) ? '\\,' + cosm(k) : ''}`;
	});
	const factorTex = $derived.by(() => {
		const k = Math.abs(m);
		if (l <= 2) return undefined;
		const top = `\\tfrac{${2 * l + 1}}{4\\pi}`;
		const ratio = k === 0 ? '' : `\\,\\tfrac{${l - k}!}{${l + k}!}`;
		return `c = \\sqrt{${top}${ratio}} = ${texNumber(norm(l, k), 3)}`;
	});
	const eigenTex = $derived(
		`\\nabla_\\Omega^2 ${name} = -\\ell(\\ell + 1)\\,${name} = ${l === 0 ? '0' : `-${l * (l + 1)}\\,${name}`}`
	);
	const countTex = $derived.by(() => {
		const terms = Array.from({ length: l + 1 }, (_, i) => 2 * i + 1);
		const sum =
			terms.length <= 5
				? terms.join(' + ')
				: `${terms.slice(0, 3).join(' + ')} + \\dots + ${terms[terms.length - 1]}`;
		return `${sum} = (\\ell + 1)^2 = ${patternsUpTo(l)}`;
	});
	const WORDS = [
		'no',
		'one',
		'two',
		'three',
		'four',
		'five',
		'six',
		'seven',
		'eight',
		'nine',
		'ten',
		'eleven',
		'twelve'
	];
	const gaps = $derived(zeros.slice(1).map((t, i) => degrees(t - zeros[i])));
	const zeroWords = $derived.by(() => {
		const k = Math.abs(m);
		const circles = zeros.length;
		const at = listOf(zeros.map(circles <= 4 ? deg1 : deg0));
		const part = (n: number, one: string, many: string) =>
			`${WORDS[n] ?? n} ${n === 1 ? one : many}`;
		if (l === 0) return 'Nowhere: the pattern of degree 0 is the same in every direction.';
		const latitudeText =
			circles === 0
				? 'on no circle of latitude'
				: `on ${part(circles, 'circle', 'circles')} of latitude, at ϑ\u00a0=\u00a0${at}`;
		if (k === 0) {
			const apart =
				gaps.length === 0
					? ''
					: gaps.length === 1
						? `, ${gaps[0].toFixed(1)}° apart`
						: `; neighbouring circles are ${Math.min(...gaps).toFixed(1)}° to ${Math.max(...gaps).toFixed(1)}° apart`;
			return `It is zero ${latitudeText}${apart}.`;
		}
		return (
			`Its real part is zero ${latitudeText}, and on ${part(k, 'great circle', 'great circles')} through the poles` +
			`${k > 1 ? `, ${Number((180 / k).toFixed(1))}° apart in φ` : ''}: ${WORDS[l]} ${l === 1 ? 'line' : 'lines'} of zeros in all.`
		);
	});
	const widthTex = $derived(
		l === 0 ? '' : `180^\\circ/\\ell = ${Number((180 / l).toFixed(1))}^\\circ`
	);

	// the cap
	const edgeNow = $derived(mode === 'build' ? edge(L) : undefined);
	const ringNow = $derived(mode === 'build' && edgeNow ? ringing(L) : undefined);
	const share = $derived(leftoverShare(L));
	/** The first few coefficients and the last, each typeset on its own so that the list can wrap. */
	const coefficientsTex = $derived.by(() => {
		const first = Array.from(
			{ length: Math.min(L, 3) + 1 },
			(_, i) => `a_{${i}0} = ${texNumber(coefficients[i], 3)}`
		);
		if (L > 3) first.push(`a_{${sub(L, 0)}} = ${texNumber(coefficients[L], 3)}`);
		return first;
	});
	const rebuiltTex = $derived(`f_{${L}} = \\sum_{\\ell=0}^{${L}} a_{\\ell 0}\\,Y_{\\ell 0}`);
	const leftoverTex = $derived(
		`\\oint (f - f_{${L}})^2\\,\\mathrm{d}\\Omega = ${texNumber(share * capSquare(), 2)}`
	);
	const SQUARE_TEX = `\\oint f^2\\,\\mathrm{d}\\Omega = 2\\pi(1 - \\cos 30^\\circ) = 0.842`;
	const COEFFICIENT_TEX = `a_{\\ell 0} = 2\\pi\\sqrt{\\tfrac{2\\ell + 1}{4\\pi}}\\int_{\\cos 30^\\circ}^{1}P_\\ell\\,\\mathrm{d}\\mu`;

	const description = $derived(
		mode === 'one'
			? `A globe showing ${m === 0 ? '' : 'the real part of '}the spherical harmonic of degree ${l} and order ${m}, orange where it is positive and blue where it is negative. ${zeroWords}`
			: `A globe showing ${showLeftover ? 'the leftover after rebuilding' : 'the rebuilding of'} a cap of the sky 30° in radius from the degrees 0 to ${L}. ` +
					(edgeNow
						? `The rebuilt edge is ${degrees(edgeNow.width).toFixed(1)}° wide.`
						: 'The rebuilt pattern never reaches nine tenths of the cap’s height.')
	);

	const Y_L0 = String.raw`Y_{\ell 0}`;
	const P_10 = 'P_{10}';
	const A_LM = String.raw`a_{\ell m}`;
	const Y_MINUS = String.raw`Y_{\ell,-m}`;
	const Y_LM = String.raw`Y_{\ell m}`;

	const modes = [
		{ value: 'one' as const, label: 'One degree', icon: Globe02Icon },
		{ value: 'build' as const, label: 'Build a cap', icon: Layers01Icon }
	];
</script>

<div class="sky-patterns" {@attach theme}>
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
		</div>
		<p class="question">
			{#if mode === 'one'}
				How many circles of zeros does <Tex math={Y_L0} /> have, and how far apart are they?
			{:else}
				A cap of the sky 30° in radius is rebuilt from its degrees 0 to <Tex math="L" />. How high
				must <Tex math="L" /> go before the cap’s edge is sharp to about 10°?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && mode === 'one'}
				<strong><Tex math="\ell" /> circles, about <Tex math="180^\circ/\ell" /> apart.</strong>
				<Tex math="P_\ell(\cos\vartheta)" /> has <Tex math="\ell" /> zeros between the poles, so
				<Tex math={Y_L0} /> is zero on <Tex math="\ell" /> circles of latitude, and neighbouring circles
				are close to <Tex math="180^\circ/\ell" /> apart: for <Tex math={P_10} /> they lie at 13°, 30°,
				47°, 64°, …, 17° apart. At <Tex math="\ell = 2" /> they are the two circles 54.7° from the poles,
				where the tidal weight <Tex math="1 - 3\cos^2\vartheta = -2P_2(\cos\vartheta)" /> changes sign.
				<button type="button" class="next" onclick={() => (mode = 'build')}>Next prediction</button>
			{:else if revealed}
				<strong>About 18, by the rule of thumb.</strong> A pattern of degree <Tex math="\ell" /> has features
				about <Tex math="180^\circ/\ell" /> wide, so an edge 10° wide needs degrees up to about
				<Tex math="180^\circ/10 = 18" />. Measured from a tenth of the cap’s height to nine tenths,
				the rebuilt edge is 9.2° wide at <Tex math="L = 16" /> and 8.2° at <Tex math="L = 18" />. It
				never becomes perfectly sharp: a sharp edge needs every degree, and the rebuilt pattern
				overshoots by about a tenth of the cap’s height on both sides of the edge, however high <Tex
					math="L"
				/> goes.
			{:else if mode === 'one'}
				The answer appears when you have looked at <Tex math="m = 0" /> for three degrees, or
				<button type="button" class="next inline" onclick={() => (askedOne = true)}
					>show it now</button
				>.
			{:else}
				The answer appears when you have taken <Tex math="L" /> high enough, or
				<button type="button" class="next inline" onclick={() => (askedBuild = true)}
					>show it now</button
				>.
			{/if}
		</p>
	</section>

	<div class="stage">
		<figure class="globe-panel">
			<div
				class={['globe', { dragging }]}
				role="slider"
				aria-roledescription="globe"
				aria-label={mode === 'one' ? 'Globe: the degree ℓ' : 'Globe: the highest degree L'}
				aria-valuemin="0"
				aria-valuemax={mode === 'one' ? MOST_DEGREE : MOST_BUILD}
				aria-valuenow={mode === 'one' ? l : L}
				aria-valuetext={description}
				tabindex="0"
				onpointerdown={grab}
				onpointermove={follow}
				onpointerup={release}
				onpointercancel={release}
				onkeydown={key}
				{@attach measure}
			>
				<canvas aria-hidden="true" {@attach draw}></canvas>
				<svg viewBox="{-BOX} {-BOX} {2 * BOX} {2 * BOX}" aria-hidden="true" {@attach fitText()}>
					{#if lines.reference}
						<path class="reference" d={lines.reference} />
					{/if}
					{#each lines.nodes as d, i (i)}
						<path class="node" {d} />
					{/each}
					{#if lines.edge}
						<path class="cap-edge" d={lines.edge} />
					{/if}
					<circle class="rim" r="100" />
					{#if axis.line}
						<line class="axis" {...axis.line} />
					{/if}
					{#if axis.pole}
						<circle class="pole" cx={axis.pole.x} cy={axis.pole.y} r="1.8" />
					{/if}
					{#if axis.label}
						<text class="axis-name" x={axis.label.x} y={axis.label.y} dy="0.32em">z</text>
					{/if}
				</svg>
			</div>
			<figcaption>
				<span class="scale" aria-hidden="true">
					<span>{mode === 'one' ? valueLabel(-shown.end) : '−1'}</span>
					<i class="bar-colours" style:background={bar}></i>
					<span>{mode === 'one' ? valueLabel(shown.end) : '1'}</span>
				</span>
				<span class="key">
					{#if mode === 'one'}
						<span class="stretch">Orange</span> where {m === 0 ? '' : 'the real part of '}<Tex
							math={name}
						/>
						is positive, <span class="squeeze">blue</span> where negative; thin lines mark its zeros.
					{:else if showLeftover}
						The leftover <Tex math={`f - f_{${L}}`} />, on the same scale as the cap; the dashed
						circle is the cap’s edge.
					{:else}
						<Tex math={`f_{${L}}`} />, orange where positive, blue where negative; the dashed circle
						is the cap’s edge.
					{/if}
				</span>
			</figcaption>
		</figure>

		<figure class="profile">
			<figcaption class="profile-title">
				{#if mode === 'one'}
					<span
						><Tex math={m === 0 ? name : `\\mathrm{Re}\\,${name}`} /> along the dashed meridian
						<Tex math="\varphi = 0" />, against <Tex math="\vartheta" /></span
					>
				{:else}
					<span class="legend"><i class="dash"></i>the cap <Tex math="f" /></span>
					<span class="legend"><i class="solid"></i><Tex math={`f_{${L}}`} /></span>
					<span class="legend"><i class="patch"></i>the leftover</span>
				{/if}
			</figcaption>
			<svg
				viewBox="0 0 {plot.W} {plot.H}"
				role="img"
				aria-label={mode === 'one'
					? `The pattern along the meridian φ = 0, against the polar angle from 0° to 180°.`
					: `The cap, 1 out to 30° and 0 beyond, and its rebuilding from degrees 0 to ${L}, against the polar angle.`}
				{@attach fitText((value) => (u = value))}
			>
				<defs>
					<clipPath id="{uid}-above">
						<rect x={plot.box.x} y={plot.box.y} width={plot.box.w} height={Y(0) - plot.box.y} />
					</clipPath>
					<clipPath id="{uid}-below">
						<rect
							x={plot.box.x}
							y={Y(0)}
							width={plot.box.w}
							height={plot.box.y + plot.box.h - Y(0)}
						/>
					</clipPath>
				</defs>
				<rect class="frame" x={plot.box.x} y={plot.box.y} width={plot.box.w} height={plot.box.h} />
				{#each valueTicks as v (v)}
					<line
						class={['grid', { zero: v === 0 }]}
						x1={plot.box.x}
						x2={plot.box.x + plot.box.w}
						y1={Y(v)}
						y2={Y(v)}
					/>
					<text class="tick end" x={plot.box.x - 6 * u} y={Y(v)} dy="0.32em">{valueLabel(v)}</text>
				{/each}
				{#each thetaTicks as t (t.at)}
					<line
						class={['mark', { zero: t.zero }]}
						x1={X(t.at)}
						x2={X(t.at)}
						y1={plot.box.y + plot.box.h}
						y2={plot.box.y + plot.box.h + 4 * u}
					/>
					<text
						class={['tick', { strong: t.zero }]}
						x={X(t.at)}
						y={plot.box.y + plot.box.h + 15 * u}
						text-anchor={t.at === 0 ? 'start' : t.at === Math.PI ? 'end' : 'middle'}>{t.label}</text
					>
				{/each}
				<text class="axis-title" x={plot.box.x + plot.box.w / 2} y={plot.H - 3 * u}
					>the polar angle <tspan class="symbol">ϑ</tspan></text
				>

				{#if mode === 'one'}
					<path class="fill positive" d={areaPath} clip-path="url(#{uid}-above)" />
					<path class="fill negative" d={areaPath} clip-path="url(#{uid}-below)" />
					{#each zeros as t (t)}
						<line
							class="zero-line"
							x1={X(t)}
							x2={X(t)}
							y1={plot.box.y}
							y2={plot.box.y + plot.box.h}
						/>
					{/each}
					<path class="curve" d={curvePath} />
					{#each zeros as t (t)}
						<circle class="zero-dot" cx={X(t)} cy={Y(0)} r={2.2 * u} />
					{/each}
				{:else}
					<path class="fill positive" d={leftoverAreas.positive} />
					<path class="fill negative" d={leftoverAreas.negative} />
					<path class="target" d={capPath} />
					<path class="curve" d={curvePath} />
					{#if edgeNow}
						{@const y = Y(-0.19)}
						{@const a = X(edgeNow.inner)}
						{@const b = X(edgeNow.outer)}
						<line class="guide" x1={a} x2={a} y1={Y(0.9)} y2={y} />
						<line class="guide" x1={b} x2={b} y1={Y(0.1)} y2={y} />
						<circle class="edge-dot" cx={a} cy={Y(0.9)} r={2.2 * u} />
						<circle class="edge-dot" cx={b} cy={Y(0.1)} r={2.2 * u} />
						<path
							class="span"
							d="M{f2(a)},{f2(y)}H{f2(b)}M{f2(a)},{f2(y - 3 * u)}V{f2(y + 3 * u)}M{f2(b)},{f2(
								y - 3 * u
							)}V{f2(y + 3 * u)}"
						/>
						<text class="span-label" x={b + 5 * u} {y} dy="0.32em"
							>edge {degrees(edgeNow.width).toFixed(1)}° wide</text
						>
					{/if}
				{/if}
			</svg>
		</figure>
	</div>

	<div class="bar">
		<Segmented options={modes} bind:value={mode} label="What the globe shows" />
		<div class="sliders">
			{#if mode === 'one'}
				<Slider
					id="{uid}-degree"
					label="ℓ, the degree"
					min={0}
					max={MOST_DEGREE}
					step={1}
					bind:value={() => l, setDegree}
					readout={`ℓ = ${l}`}
					ends={['0', String(MOST_DEGREE)]}
				/>
				<Slider
					id="{uid}-order"
					label="m, the order"
					min={-l}
					max={l}
					step={1}
					bind:value={() => m, setOrder}
					readout={`m = ${minus(String(m))}`}
					ends={[minus(String(-l)), String(l)]}
				/>
			{:else}
				<Slider
					id="{uid}-build"
					label="L, the highest degree used"
					min={0}
					max={MOST_BUILD}
					step={1}
					bind:value={() => L, setBuild}
					readout={`L = ${L}`}
					ends={['0', String(MOST_BUILD)]}
				/>
				<Toggle icon={ViewIcon} label="Show the leftover" bind:checked={showLeftover} />
			{/if}
		</div>
		<div class="actions">
			<button type="button" class="reset" onclick={resetView}>
				<HugeiconsIcon icon={Undo02Icon} size={15} strokeWidth={1.7} />
				Turn back
			</button>
			<p class="hint">
				Drag the globe to turn it. With the globe focused,
				{mode === 'one'
					? 'the up and down arrows change ℓ and the left and right arrows change m;'
					: 'the arrows change L;'}
				Shift with an arrow turns the globe, and Home turns it back.
			</p>
		</div>
	</div>

	<div class="readouts">
		<dl>
			{#if mode === 'one'}
				<div class="row">
					<dt>The pattern</dt>
					<dd>
						<Tex math={patternTex} />
						{#if factorTex}<span class="also">with <Tex math={factorTex} /></span>{/if}
					</dd>
				</div>
				<div class="row">
					<dt>Its degree</dt>
					<dd><Tex math={eigenTex} /></dd>
				</div>
				<div class="row">
					<dt>Its zeros</dt>
					<dd><span>{zeroWords}</span></dd>
				</div>
				<div class="row">
					<dt>Its features</dt>
					<dd>
						{#if l === 0}
							<span>None: the pattern is constant.</span>
						{:else if l === 1}
							<span
								>One crest and one trough on the whole sphere: the estimate <Tex
									math={'180^\\circ/\\ell'}
								/> is meant for high degrees.</span
							>
						{:else}
							<span
								>About <Tex math={widthTex} /> wide{l < 4
									? ', roughly: the estimate improves as ℓ grows'
									: ''}.</span
							>
						{/if}
					</dd>
				</div>
				<div class="row">
					<dt>Patterns to degree <Tex math="\ell" /></dt>
					<dd><Tex math={countTex} /></dd>
				</div>
			{:else}
				<div class="row">
					<dt>Coefficients</dt>
					<dd>
						<Tex math={COEFFICIENT_TEX} />
						<span class="also list">
							{#each coefficientsTex as c, i (i)}
								<span
									>{#if i === coefficientsTex.length - 1 && L > 4}…,&nbsp;{/if}<Tex math={c} />{i <
									coefficientsTex.length - 1
										? ','
										: ''}</span
								>
							{/each}
						</span>
					</dd>
				</div>
				<div class="row">
					<dt>Rebuilt</dt>
					<dd>
						<Tex math={rebuiltTex} />
						<span class="also"
							>{L + 1} of the {patternsUpTo(L)} patterns up to degree {L}; every <Tex math={A_LM} /> with
							<Tex math="m \neq 0" /> is zero.</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>The edge</dt>
					<dd>
						{#if edgeNow}
							<span
								>{degrees(edgeNow.width).toFixed(1)}° wide, from ϑ&nbsp;=&nbsp;{deg1(
									edgeNow.inner
								)}, where
								<Tex math={`f_{${L}}`} /> is 0.9, to ϑ&nbsp;=&nbsp;{deg1(edgeNow.outer)}, where it
								is 0.1.</span
							>
						{:else}
							<span
								>Not yet an edge: <Tex math={`f_{${L}}`} /> never reaches nine tenths of the cap’s height.</span
							>
						{/if}
					</dd>
				</div>
				{#if ringNow}
					<div class="row">
						<dt>Overshoot</dt>
						<dd>
							<span>
								{#if ringNow.crest.at > radians(0.5)}
									Up to {ringNow.crest.value.toFixed(2)} just inside the edge, at ϑ&nbsp;=&nbsp;{deg1(
										ringNow.crest.at
									)}, and down
								{:else}
									Down
								{/if}
								to {minus(ringNow.trough.value.toFixed(2))} just outside {ringNow.crest.at >
								radians(0.5)
									? 'it'
									: 'the edge'}, at ϑ&nbsp;=&nbsp;{deg1(ringNow.trough.at)}.
							</span>
						</dd>
					</div>
				{/if}
				<div class="row">
					<dt>The leftover</dt>
					<dd>
						<Tex math={leftoverTex} />
						<span class="also"
							>which is {(100 * share).toFixed(1)}% of <Tex math={SQUARE_TEX} /></span
						>
					</dd>
				</div>
			{/if}
		</dl>

		<p class="note">
			{#if mode === 'one'}
				The globe is the unit sphere seen from far away, the <Tex math="z" /> axis through its north pole,
				<Tex math="\vartheta" /> measured from that pole and <Tex math="\varphi" /> round the axis from
				the dashed meridian. The colours deepen with the size of the value, up to the pattern’s largest
				size, {valueLabel(shown.end)}, as the bar under the globe shows. The real part of <Tex
					math={Y_MINUS}
				/> is <Tex math="(-1)^m" /> times that of <Tex math={Y_LM} />, so <Tex math="m" /> and <Tex
					math="-m"
				/> look alike up to a sign; the minus signs follow the Condon–Shortley convention.
			{:else}
				The cap is <Tex math="f = 1" /> within 30° of the <Tex math="z" /> axis and 0 outside, the kind
				of sharp-edged patch a nearby moon makes on the tidal column. It is symmetric about the axis,
				so only the patterns with <Tex math="m = 0" /> enter. Colours run from −1 to 1, the cap’s height;
				the ringing beyond that is drawn at full colour.
			{/if}
		</p>
	</div>
</div>

<style>
	.sky-patterns {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the predictions ---------------------------------------------------------------- */

	.predict {
		padding: 0.75rem 0.9rem 0.8rem;
		border-bottom: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.steps {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.35rem;
	}

	.tag {
		font: italic 500 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	.predict p {
		margin: 0;
		text-wrap: pretty;
	}

	.question {
		font: 500 0.9rem/1.45 var(--font-sans);
	}

	.answer {
		margin-top: 0.3rem !important;
		font: 400 0.8rem/1.5 var(--font-sans);
		color: var(--text-faint);
	}

	.answer.shown {
		color: var(--text-dim);
	}

	.answer strong {
		color: var(--text);
		font-weight: 600;
	}

	.next {
		margin-left: 0.3rem;
		padding: 0;
		border: 0;
		background: none;
		color: var(--accent);
		font: inherit;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}

	.next.inline {
		margin-left: 0;
	}

	.next:focus-visible,
	.reset:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* the globe shows its focus on its own rim */
	.globe:focus-visible {
		outline: none;
	}

	.globe:focus-visible .rim {
		stroke: var(--accent);
		stroke-width: calc(2px * var(--u, 1));
	}

	/* --- the globe and the profile ------------------------------------------------------- */

	.stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr);
		align-items: start;
		gap: 0.4rem 0.9rem;
		padding: 0.7rem 0.9rem 0.8rem;
		background: radial-gradient(circle at 30% 45%, var(--bg-raised) 0%, var(--bg-sunken) 80%);
	}

	figure {
		margin: 0;
		min-width: 0;
	}

	.globe {
		position: relative;
		aspect-ratio: 1;
		width: 100%;
		border-radius: 50%;
		cursor: grab;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	.globe.dragging {
		cursor: grabbing;
	}

	.globe canvas,
	.globe svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}

	.globe svg {
		overflow: visible;
		pointer-events: none;
	}

	.rim {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.node {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 78%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linecap: round;
	}

	.reference {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 62%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.cap-edge {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.pole {
		fill: var(--text);
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
	}

	.axis-title {
		fill: var(--text-faint);
		font: 400 calc(11px * var(--u, 1)) / 1 var(--font-sans);
		text-anchor: middle;
	}

	.symbol {
		font: italic 500 calc(13px * var(--u, 1)) / 1 var(--font-serif);
		fill: var(--text-dim);
	}

	.axis-name {
		fill: var(--text-dim);
		font: italic 500 calc(14px * var(--u, 1)) / 1 var(--font-serif);
		text-anchor: middle;
	}

	figcaption {
		font: 400 0.76rem/1.4 var(--font-sans);
		color: var(--text-dim);
	}

	.globe-panel figcaption {
		display: grid;
		gap: 0.3rem;
		margin-top: 0.45rem;
	}

	.scale {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-variant-numeric: tabular-nums;
		font-size: 0.72rem;
		color: var(--text-faint);
	}

	.bar-colours {
		flex: 1;
		height: 6px;
		border-radius: 3px;
		box-shadow: inset 0 0 0 1px var(--line);
	}

	.key {
		text-wrap: pretty;
	}

	.profile-title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 0.9rem;
		min-height: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.legend {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.legend i {
		display: inline-block;
		width: 1.1rem;
		height: 0;
	}

	.legend .dash {
		border-top: 1.2px dashed var(--text-dim);
	}

	.legend .solid {
		border-top: 1.6px solid var(--text);
	}

	.legend .patch {
		height: 0.6rem;
		width: 0.8rem;
		border-radius: 2px;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--accent) 34%, transparent) 50%,
			color-mix(in srgb, var(--accent-2) 34%, transparent) 50%
		);
	}

	.profile svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.frame {
		fill: color-mix(in srgb, var(--bg) 55%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.zero {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
	}

	.mark {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.tick {
		font: 400 calc(11px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		fill: var(--text-faint);
	}

	.tick.end {
		text-anchor: end;
	}

	.tick.strong {
		fill: var(--text-dim);
		font-weight: 500;
	}

	.fill {
		stroke: none;
	}

	.fill.positive {
		fill: color-mix(in srgb, var(--accent) 30%, transparent);
	}

	.fill.negative {
		fill: color-mix(in srgb, var(--accent-2) 30%, transparent);
	}

	.curve {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-linejoin: round;
	}

	.target {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.zero-line {
		stroke: color-mix(in srgb, var(--text) 18%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.zero-dot,
	.edge-dot {
		fill: var(--bg);
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.guide {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.span {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.span-label {
		font: 500 calc(11.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		fill: var(--text-dim);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.75rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: end;
		gap: 0.5rem 1.4rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.55rem 0.8rem;
	}

	.reset {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 2rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.78rem/1.2 var(--font-sans);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.reset :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.reset:hover {
			border-color: var(--accent);
		}
	}

	.hint {
		flex: 1 1 18rem;
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
	}

	.readouts {
		padding: 0.75rem 0.9rem 0.85rem;
		border-top: 1px solid var(--line);
		font-size: 0.8rem;
		line-height: 1.45;
	}

	/* the chapter's own lists of definitions are styled for the text: these keep their own */
	.readouts dl {
		margin: 0;
		display: grid;
		gap: 0.45rem;
	}

	.row {
		display: grid;
		grid-template-columns: 9.5rem 1fr;
		gap: 0.2rem 0.8rem;
		align-items: baseline;
	}

	.readouts dt {
		font-weight: 500;
		color: var(--text-dim);
	}

	.readouts dd {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.15rem 0.6rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
		text-wrap: pretty;
	}

	.also {
		color: var(--text-dim);
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.1rem 0.45rem;
	}

	.note {
		margin: 0.7rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	.stretch {
		color: var(--accent);
	}

	.squeeze {
		color: var(--accent-2);
	}

	@media (max-width: 560px) {
		.stage {
			grid-template-columns: minmax(0, 1fr);
			padding: 0.6rem 0.75rem 0.75rem;
		}

		.globe-panel {
			max-width: 20rem;
			width: 100%;
			margin: 0 auto;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}
</style>
