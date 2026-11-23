<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowHorizontalIcon,
		Clock01Icon,
		PauseIcon,
		PlayIcon,
		RedoIcon,
		Sine02Icon,
		Tally1Icon,
		Tally2Icon,
		Tally3Icon,
		UndoIcon,
		ZoomInIcon,
		ZoomOutIcon
	} from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import MarkedRing, { degrees } from '#lib/ui/MarkedRing.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import {
		atFocus,
		focusTime,
		indexAt,
		integrate,
		polarAlong,
		weakAngle,
		type Wave
	} from '#lib/ring/ring.js';

	/** The view runs this far, in units of the wave's duration T: the wave, and 0.6 T after it. */
	const END = 1.6;
	/** Seconds on the screen for the wave to pass, and for the picture to rest at the end before it starts again. */
	const PASSING = 8;
	const REST = 1.5;
	/** The step of the time slider, in units of T. */
	const STEP = 0.005;
	/**
	 * The strongest wave offered, for each number of turns: a little under the strength at which the ring would come
	 * to its focus before the wave has passed (0.303 for one turn, 0.189 for two, 0.139 for three).
	 */
	const STRONGEST = { '1': 0.26, '2': 0.17, '3': 0.125 };
	/** The strength is set in steps of this fraction of the strongest: steps of 0.005 for one turn. */
	const LEVELS = 52;
	const ZOOM = 10;

	/** The displayed formulas with braces, which the markup would read as expressions: each on two lines, to fit the panel. */
	const APART =
		'\\begin{gathered} X = \\rho\\,R(\\theta)\\,S, \\\\ S^2 = R(\\tfrac{\\psi}{2})\\,\\mathrm{diag}(e^{r}, e^{-r})\\,R(-\\tfrac{\\psi}{2}), \\end{gathered}';
	const LAWS =
		"\\begin{gathered} \\theta' = \\tfrac12(\\cosh r - 1)\\,\\psi', \\\\ \\rho'' = -\\tfrac14\\bigl(r'^2 + \\sinh^2 r\\,\\psi'^2\\bigr)\\rho . \\end{gathered}";

	type Handed = 'right' | 'left' | 'linear';
	type Turns = keyof typeof STRONGEST;

	let handed = $state<Handed>('right');
	let turns = $state<Turns>('1');
	/**
	 * The strength as a count of steps, which is what the slider holds. It is kept when the number of turns changes,
	 * so that the slider stays where it is and the strength keeps its share of the new range.
	 */
	let level = $state(50);
	let magnified = $state(false);
	let u = $state(0);
	let playing = $state(false);

	/** The strength itself: 0.25 as the page opens. */
	const epsilon = $derived((STRONGEST[turns] * level) / LEVELS);
	const wave: Wave = $derived({
		epsilon,
		turns: Number(turns),
		hand: handed === 'right' ? 1 : handed === 'left' ? -1 : 0
	});
	const run = $derived(integrate(wave, END));
	const parts = $derived(polarAlong(run));
	/** The ring at its focus, if it comes to one in view; and when the focus comes, in view or not. */
	const focus = $derived(atFocus(run, parts));
	const focusAt = $derived(focusTime(run));
	const i = $derived(indexAt(run, u));
	/** The present sample or, at a focus, the last at which the ring still has a radius and a turn. */
	const shaped = $derived(Math.min(i, parts.count - 1));
	/** Whether the ring has come to its focus. The run ends there, and the turn is held as it is there. */
	const ended = $derived(focus ? u >= focus.u : i >= parts.count);
	const theta = $derived(ended && focus ? focus.theta : parts.theta[shaped]);
	/** The turn when the wave has passed, in words. */
	const passed = $derived(
		run.end < parts.count ? degrees(parts.theta[run.end]) : 'none: the ring focuses first'
	);
	/** Where the run ends: at the focus, if the ring comes to one in view. */
	const finish = $derived(focus ? focus.u : END);

	// the clock: through the wave and what follows, as far as the focus if there is one in view; a rest, and round again
	let frame = 0;

	function play() {
		if (playing) return;
		if (u >= finish) u = 0;
		playing = true;
		let last = performance.now();
		let rested = 0;
		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			if (u < finish) u = Math.min(finish, u + dt / PASSING);
			else if ((rested += dt) >= REST) {
				rested = 0;
				u = 0;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	}

	function pause() {
		playing = false;
		cancelAnimationFrame(frame);
	}

	/**
	 * The run as the page opens it: from the start and running or, for a reader who has asked for less motion, still
	 * at the wave's end. The wave chosen is kept, as the other figures keep theirs when their view is reset.
	 */
	function reset() {
		pause();
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) u = 1;
		else {
			u = 0;
			play();
		}
	}

	onMount(() => {
		reset();
		return pause;
	});

	/**
	 * A moment chosen by hand stops the clock there. The focus falls between two steps of the slider, so a moment
	 * within half a step of it is taken for the focus itself.
	 */
	function scrub(v: number) {
		pause();
		u = focus && Math.abs(v - focus.u) < STEP / 2 ? focus.u : v;
	}

	/** A span of time in units of T, to about three figures. */
	const span = (t: number) => (t < 10 ? t.toFixed(2) : t < 100 ? t.toFixed(1) : t.toFixed(0));
	const focusWords = $derived(
		focus
			? `${(focus.u - 1).toFixed(4)} T after the wave`
			: focusAt === null
				? 'no focus in view'
				: `no focus in view: it comes ${span(focusAt - 1)} T after the wave`
	);
	/** Moments worth going to on the time slider. */
	const marks = $derived([
		{ at: 1, label: 'the end of the wave' },
		...(focus ? [{ at: focus.u, label: 'the focus' }] : [])
	]);
</script>

<svelte:head>
	<title>A ring of marked particles · Gravitational Camera</title>
	<meta
		name="description"
		content="A ring of free particles in an exact gravitational plane wave. When the wave has passed, the particles’ marks have turned against a gyroscope by half the hyperbolic area that the ring’s shape swept: one way for a right-handed wave, the other way for its mirror image."
	/>
</svelte:head>

<DemoShell section="figures" title="A ring of marked particles" onreset={reset}>
	{#snippet stage()}
		<MarkedRing {wave} {u} end={END} magnify={magnified ? ZOOM : 1} onscrub={scrub} />
	{/snippet}

	{#snippet controls()}
		<Group title="The wave">
			<Segmented
				label="Handedness"
				options={[
					{ value: 'right', label: 'Right-handed', icon: UndoIcon },
					{ value: 'left', label: 'Left-handed', icon: RedoIcon },
					{ value: 'linear', label: 'Linear', icon: ArrowHorizontalIcon, wide: true }
				]}
				bind:value={handed}
			/>
			<Segmented
				label="Turns of the strain in its plane during the wave"
				options={[
					{ value: '1', label: '1 turn', icon: Tally1Icon },
					{ value: '2', label: '2 turns', icon: Tally2Icon },
					{ value: '3', label: '3 turns', icon: Tally3Icon }
				]}
				bind:value={turns}
			/>
			<Slider
				id="strength"
				label="Strength"
				icon={Sine02Icon}
				min={1}
				max={LEVELS}
				step={1}
				bind:value={level}
				readout="ε = {epsilon.toFixed(3)}, strain {(2 * epsilon).toFixed(2)}"
				ends={['weak', 'strong']}
			/>
		</Group>
		<Group title="Time">
			<Slider
				id="time"
				label="Time"
				icon={Clock01Icon}
				min={0}
				max={END}
				step={STEP}
				bind:value={() => u, scrub}
				readout="{u.toFixed(2)} T, {u < 1 ? 'in the wave' : 'after the wave'}"
				{marks}
				marksHint={focus
					? 'the ticks mark the end of the wave and the focus'
					: 'the tick marks the end of the wave'}
			/>
			<Segmented
				label="Motion"
				options={[
					{ value: 'play', label: 'Playing', icon: PlayIcon },
					{ value: 'pause', label: 'Paused', icon: PauseIcon }
				]}
				bind:value={() => (playing ? 'play' : 'pause'), (v) => (v === 'play' ? play() : pause())}
			/>
		</Group>
		<Group title="The drawing">
			<Segmented
				label="The size the turning is drawn at"
				options={[
					{ value: 'true', label: 'True size', icon: ZoomOutIcon },
					{ value: 'magnified', label: `Angle ×${ZOOM}`, icon: ZoomInIcon }
				]}
				bind:value={
					() => (magnified ? 'magnified' : 'true'), (v) => (magnified = v === 'magnified')
				}
			/>
		</Group>
	{/snippet}

	{#snippet plain()}
		<p>
			Sixteen small balls float freely in a ring. A <strong>gravitational wave</strong>, a ripple in
			gravity that travels at the speed of light, passes through the ring toward you. It stretches
			space in one direction and squeezes it in another, so it pulls the ring into an oval. This
			wave is far stronger than any real one, so that its effects can be seen.
		</p>
		<p>
			The balls are blue, shaded in order round the ring. One ball is <strong>marked</strong> in
			orange, with an orange circle round it. The faint dashed circle is the ring as it began, with
			a tick where the marked ball was. At the centre is a <strong>gyroscope</strong>, a spinning
			wheel whose axis keeps its direction. The orange arc at the top, with the angle θ written
			beside it, shows how far the marks have turned against the gyroscope.
		</p>
		<p>
			The strip under the ring shows the wave's <strong>strain</strong> over time. Strain is the change
			in a length divided by the length. The two lines are the wave's two patterns of stretch, called
			plus (h+) and cross (h×). The dot on the strip is the present moment, and the tick marked T is where
			the wave ends.
		</p>
		<p>
			On the right are two small panels. <em>The wave's strain</em> draws the path of the two
			strains together. <em>The ring's shape</em> is a map of every possible oval. Its centre is a perfect
			circle. The farther a point lies from the centre, the more stretched the oval is. The direction
			of the point from the centre gives the direction of the stretch. The shaded area is swept by the
			line from the centre to the ring's shape. Under the map, the turn of the marks and half the area
			swept are worked out separately. They agree.
		</p>
		<p>Try these first. Open the Controls tab.</p>
		<ul>
			<li>
				Watch the wave pass, or choose <em>Playing</em> if time is paused. The oval turns. When the wave
				has passed, the ring is smaller and goes on shrinking. The marks have turned.
			</li>
			<li>
				Choose <em>Left-handed</em>, then <em>Linear</em>. The left-handed wave turns the marks the
				other way. The linear wave does not turn them.
			</li>
			<li>Lower the <em>Strength</em>, and choose <em>Angle ×10</em> to see the small turn.</li>
		</ul>
		<p>
			This result is not yet in the paper. It is related to the gravitational memory of Section XI,
			“Astrophysical and cosmological scenes”: a burst of waves can leave a lasting change after it
			has passed.
		</p>
	{/snippet}

	{#snippet help()}
		<p>Drag along the strip under the ring to choose a moment.</p>
		<p>
			In the Controls tab, <em>Right-handed</em>, <em>Left-handed</em> and <em>Linear</em> choose
			the kind of wave. <em>1 turn</em>, <em>2 turns</em> and <em>3 turns</em> set how many times
			the wave's stretch turns round while it passes. The <em>Strength</em> slider sets how strong
			the wave is. The <em>Time</em> slider chooses a moment, and <em>Playing</em> and
			<em>Paused</em>
			run or stop time. <em>Angle ×10</em> draws the turn ten times larger, and <em>True size</em> draws
			it as it is; the numbers stay unchanged. Reset goes back to the start.
		</p>
	{/snippet}

	{#snippet notes()}
		<p>
			A ring of sixteen free particles, at rest until a gravitational wave passes through it, coming
			towards the viewer. One particle is <strong>marked</strong>, and the others are shaded in
			order round the ring. The wave stretches and squeezes the ring. When it has passed, the ring
			is smaller, and if the wave was circularly polarised its marks have turned. The faint circle
			is the ring as it began, with a tick where the marked particle was.
		</p>
		<p>
			At the centre is a <strong>gyroscope</strong>. Its axes stay fixed in the coordinates used
			here, so the angle <Tex math="\theta" /> drawn at the top is the turn of the marks against the gyroscope.
			A right-handed wave turns them one way, its mirror image the other way, and a linearly polarised
			wave not at all. For a weak wave the turn is small: ‘Angle ×{ZOOM}’ draws the turning at {ZOOM}
			times its size and leaves the numbers as they are.
		</p>
		<p>
			One small panel shows the wave’s strain, the point <Tex math="(h_+, h_\times)" /> in its plane.
			The other shows the ring’s shape as a point of the hyperbolic plane, drawn in the Poincaré disc:
			its distance <Tex math="r" /> from the centre says how far the ring is from round, and its angle
			<Tex math="\psi" /> which way the ring is stretched. The turn of the marks is half the area swept
			by the line from the centre to that point. The two numbers under the disc are computed separately,
			and agree. Drag along the strip under the ring to choose a moment.
		</p>
		<dl>
			<div>
				<dt>Turn of the marks against the gyroscope, now · when the wave has passed</dt>
				<dd>
					<span data-testid="turn-now">{degrees(theta)}{ended ? ' at the focus' : ''}</span> ·
					<span data-testid="turn-passed">{passed}</span>
				</dd>
			</div>
			<div>
				<dt>
					The estimate of that turn for a weak wave,
					<Tex math="\tfrac14\oint (h_+\,dh_\times - h_\times\,dh_+)" />
				</dt>
				<dd data-testid="turn-weak">{degrees(weakAngle(wave))}</dd>
			</div>
			<div>
				<dt>Radius of the ring now, as a fraction of its first radius</dt>
				<dd data-testid="radius">
					{ended ? '0.0000 at the focus' : parts.rho[shaped].toFixed(4)}
				</dd>
			</div>
			<div>
				<dt>Focus, where the ring’s radius falls to nothing</dt>
				<dd data-testid="focus">{focusWords}</dd>
			</div>
		</dl>
		<p class="fine">
			The wave is an exact plane wave of general relativity, a burst of duration <Tex math="T" />,
			and nothing is approximated but the steps of the integration. The particles are followed after
			the wave, where each moves uniformly and the ring goes on shrinking, for 0.6
			<Tex math="T" /> or until the ring comes to its focus. Drag the strip under the ring to choose a
			moment.
		</p>
		<p class="fine">This result is not yet part of the paper.</p>
	{/snippet}

	{#snippet physics()}
		<h4>The ring, taken apart</h4>
		<p>
			Each particle’s place is its first place multiplied by a matrix <Tex math="X(u)" />, where
			<Tex math="u" /> is the wave’s phase, which is time for the ring. It obeys
			<Tex math="X'' = H(u)\,X" />, with <Tex math="H" /> the wave’s tidal field, symmetric and without
			trace. Written as a size, a rotation and a shape,
		</p>
		<Tex display math={APART} />
		<p>
			<Tex math="\rho" /> is the ring’s radius, <Tex math="\theta" /> the turn of its marks, and
			<Tex math="(r, \psi)" /> its shape: polar coordinates on the hyperbolic plane, whose line element
			is <Tex math="dr^2 + \sinh^2 r\,d\psi^2" />. The transverse axes of a gyroscope at the ring’s
			centre stay fixed in the coordinates in which <Tex math="X" /> is written, so
			<Tex math="\theta" /> is an angle against the gyroscope.
		</p>
		<h4>Two exact laws</h4>
		<Tex display math={LAWS} />
		<p>
			By the first, the marks turn by half the signed area that the shape sweeps in the hyperbolic
			plane. By the second, the ring always shrinks, and after the wave it comes to a focus in a
			finite time.
		</p>
		<h4>A weak wave</h4>
		<p>For a weak wave the turn is</p>
		<Tex display math="\theta = \tfrac14\oint \bigl(h_+\,dh_\times - h_\times\,dh_+\bigr)," />
		<p>
			which is the helicity term of the gyroscopic memory of Seraj and Oblak (2022), seen from the
			other side: the gyroscope against the ring, instead of the gyroscope against the stars. A
			circularly polarised wave turns the marks one way, its mirror image the other way, and a
			linearly polarised wave not at all.
		</p>
	{/snippet}
</DemoShell>
