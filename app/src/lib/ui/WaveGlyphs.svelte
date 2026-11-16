<script lang="ts">
	/**
	 * What the pixels record from each rotor in the wave view: the pattern of
	 * stretching that passes over them, drawn as the distortion it gives a ring of
	 * free particles. It turns with the rotor (at twice the rotation rate the
	 * pattern repeats, since a stretch looks the same after half a turn), in the
	 * sense the camera sees the rotor turn.
	 */
	import {
		cameraBasis,
		screenPosition,
		seenFrom,
		type Rotor,
		type Vec3,
		type View
	} from '../engine';

	interface Props {
		rotors: Rotor[];
		observer: Vec3;
		view: View;
		/** Where the gravity side starts, as a fraction of the full width. */
		split: number;
	}

	let { rotors, observer, view, split }: Props = $props();

	let width = $state(0);
	let height = $state(0);
	let time = $state(0);

	/** A clock for the animation, running while the overlay is on the page. */
	function clock() {
		let frame = 0;
		const start = performance.now();
		const tick = (now: number) => {
			time = (now - start) / 1000;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}

	const glyphs = $derived.by(() => {
		if (!width || !height || split >= 1) return [];
		// the overlay covers the gravity side only; positions are for the whole picture
		const full = width / (1 - split);
		const { right, up } = cameraBasis(view);
		return rotors.flatMap((r) => {
			const seen = seenFrom(r, observer);
			const at = screenPosition(view, full, height, seen.direction);
			if (!at) return [];
			// screen angle of the axis projected on the sky: the polarization basis
			const axisAngle = Math.atan2(
				r.axis[0] * up[0] + r.axis[1] * up[1] + r.axis[2] * up[2],
				r.axis[0] * right[0] + r.axis[1] * right[1] + r.axis[2] * right[2]
			);
			return [{ x: at[0] - split * full, y: at[1], seen, omega: r.omega, axisAngle }];
		});
	});

	/** Ellipse of a ring of particles at time t: semi-axes and the angle of stretching. */
	function distortion(g: (typeof glyphs)[number], t: number) {
		const c = g.seen.cosIota;
		const phase = 2 * g.omega * t;
		const plus = 0.5 * (1 + c * c) * Math.cos(phase);
		const cross = c * Math.sin(phase);
		const size = Math.hypot(plus, cross) / (0.5 * (1 + c * c) + Math.abs(c));
		const angle = g.axisAngle + 0.5 * Math.atan2(cross, plus);
		return { a: 1 + 0.45 * size, b: 1 - 0.45 * size, angle };
	}
</script>

<div
	class="glyphs"
	bind:clientWidth={width}
	bind:clientHeight={height}
	aria-hidden="true"
	{@attach clock}
>
	<svg width="100%" height="100%">
		{#each glyphs as g, i (i)}
			{@const d = distortion(g, time)}
			<g transform="translate({g.x} {g.y}) rotate({(-d.angle * 180) / Math.PI})">
				<circle r="34" class="rest" />
				<ellipse rx={34 * d.a} ry={34 * d.b} class="ring" />
				{#each Array.from({ length: 12 }, (_, k) => (k * Math.PI) / 6) as phi (phi)}
					<circle cx={34 * d.a * Math.cos(phi)} cy={34 * d.b * Math.sin(phi)} r="2.6" />
				{/each}
			</g>
		{/each}
	</svg>
</div>

<style>
	.glyphs {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	svg {
		display: block;
		overflow: visible;
	}

	circle {
		fill: rgb(255 255 255 / 0.95);
	}

	.rest {
		fill: none;
		stroke: rgb(255 255 255 / 0.25);
		stroke-dasharray: 2 4;
	}

	.ring {
		fill: none;
		stroke: rgb(255 255 255 / 0.7);
		stroke-width: 1.2;
	}
</style>
