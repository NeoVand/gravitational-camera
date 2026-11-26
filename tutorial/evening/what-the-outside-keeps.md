---
id: '0.5'
title: 'What the outside of a body keeps'
question: 'A hollow shell and a solid ball of the same mass pull alike on everything outside them. Is there any measurement made from outside that tells them apart?'
part: '0'
requires: ['0.1']
paper: [sec:hair, eq:hair-bits, fig:hair, sec:second-order, eq:push, eq:pass, fig:passing, fig:ladder, fig:hidden-flow, sec:hole, fig:hole-response, tab:hair, sec:holography, eq:dp-energy]
figures: [fig:hair, fig:ladder]
live: [same-outside, hole-response]
---

Three round bodies of one size and one mass stand side by side: a uniform ball, a hollow shell with a thin skin, and
a ball of light rock with a dense core that holds half the mass. Their pull is the same at every point outside them,
so a camera that feels the pull cannot tell them apart.[^blind] Is there any measurement made from outside that tells
them apart?

{{paper fig:hair}}

In panel (a) the grey arrows of the pull are the same for all three, but the bars, the energy one brief tide leaves
in each body, differ. So the answer is yes: the field outside shows only a short list of totals of a body's mass, but
the energy that a tide leaves in it depends on everything inside, and a black hole answers both kinds of question with
almost nothing.[^sections]

## One reading shows only a list of weighted totals

At any one time, the pull outside a body depends on its mass only through a list of weighted totals, the
**multipole moments**, in which every piece of mass counts by an amount that depends on where it lies. The steps of
the list are numbered by their **degree**. Degree zero is the total mass, degree one the place of its centre, and
degree two the quadrupole moment of section
[0.3](/tutorial/evening/waves-and-heat/#only-a-changing-lopsidedness-sends-out-waves), which says how far the mass
is drawn out along some direction, like a rugby ball. Each degree holds two more numbers than the one before.

Any rearrangement of the inside that keeps the whole list keeps everything outside the same.[^split] The shell theorem
is the simplest case: a ball and a shell of the same mass are both perfectly round, so every moment after the mass is
zero for both.[^shell] Each degree reaches a camera weaker than the one before by the body's size over its distance, so from three body radii
away each degree is three times weaker.[^moments]

## The list is short, and a black hole's is the shortest

We count what the moments hold in bits, answers to yes-or-no questions. A number known to one part in a
million is worth about 20 bits, because a million is about $2^{20}$. A camera three body radii away, whose
signal-to-noise ratio (the signal over the typical size of the noise) for the total mass is a million, reads 169
moments before the rest sink below its noise. The finer ones are read less precisely, so together they hold about 1200 bits.[^bits] At about $10^{70}$, the rough
quantum limit of section
[0.2](/tutorial/evening/through-walls/#the-blur-shrinks-only-with-the-number-of-digits-of-the-sensitivity), the count
is still only $1.7 \times 10^6$ bits, about 200 kilobytes.

Any detail of a body that the field outside could show, beyond its mass, its spin and its electric charge, is
**hair**. By the no-hair theorem, a black hole has none.[^nohair] An uncharged hole at rest gives seven numbers: one
for its mass, three for its spin (its rate and the direction of its axis) and three for its position. At 20 bits
each the hole gives about 140 bits, and the ordinary body more than eight times as much.

## The body's reply to a pull reveals its inside

The pull of a body on a small mass outside it is in proportion to the small mass. An effect that grows in proportion to
a small quantity is **first order** in it. The small mass also pulls back, sets the parts of the body moving and leaves
energy in them. Doubling the small mass doubles each part's speed, and energy of motion goes as the square of speed, so
the energy left behind quadruples (Figure [](#fig:orders)). An effect that grows as the square of a small quantity is **second order** in it.[^two] The shell
theorem holds at first order only, and the energy that a tide leaves in a body lies beyond it.

![A small mass $m$ (top) and $2m$ (below) beside the same body at the same distance: doubling the small mass makes the
arrow of the pull on it exactly twice as long, and the bar of the energy it leaves in the body exactly four times as
tall. The lower steel ball is drawn larger, as it would be at the same density; the scales are chosen for the drawing.](tut-orders){#fig:orders}

An **impulsive tide** acts so briefly that the body does not move while it acts, so it gives every part of the body a
kick, a sudden change of velocity set by where the part stands.[^kick] A mass that flies fast past a body gives it
nearly such a tide. The energy that the body gains is

$$\Delta E = \epsilon\,\dot Q_g + \frac{\epsilon^2}{2}\int\rho\,|\nabla g|^2\,\dd V.$$

Here $\Delta E$ is the energy gained, in joules. The function $g$ of position, in square metres, is the tide's shape,
and $\epsilon$, in reciprocal seconds, is its strength times the brief time it acts, so the kick $\epsilon\nabla g$ is a
velocity in metres per second. In the first term, $Q_g$ is the body's mass weighted by the tide's shape, in kilograms
times square metres, and $\dot Q_g$ is its rate of change, zero for a body at rest. In the second, $\sym{density}{\rho}$
is the density, in kilograms per cubic metre, so the integral adds up each piece's mass times the square of its kick.
This term is never negative, and it grows as the square of the tide's strength.[^push]

A **quadrupolar tide** is the tide of a distant mass, which stretches a body along one line and squeezes it across
that line, as in section [0.1](/tutorial/evening/a-camera-for-gravity/). Along every line out from the centre its
kick grows in proportion to the distance. So for a round body the second term depends on one number: each piece's
mass times the square of its distance from the centre, added up. This is three fifths of the mass times the square of
the radius for a ball, and the whole mass times the square of the radius for a thin shell. So the ball and the shell
gain energy in the ratio three to five, although their pulls are identical.[^ratio]

::: try {#same-outside}
Predict first: if body B's mass moves outward, does its pull at twice its radius change? Does the energy that a kick
leaves in it? B opens as the cored ball. Drag the mass in B's core down to zero, then drag the core's radius, and watch
the plot of the pull and the table. The second tab does the same for gold inside a steel ball.
:::

## The reply can be read by weighing the body or by watching the passer

Energy has weight: a body that gains energy gains a mass equal to that energy divided by the square of the speed of
light, so weighing the body after the tide reads the reply.[^weight] Newton's mechanics gives a second way. The energy
that a passing mass leaves in the body comes out of its own motion, so it leaves a little slower, and its losses along
many paths that miss the body give the density everywhere.[^pass]

Take a tonne passing at $44\unit{km\,s^{-1}}$, one metre from the edge of a steel ball one metre across.
The edge gains $3 \times 10^{-12}\unit{m\,s^{-1}}$, a speed at which it would take ten years to move a millimetre. The
centre gains two thirds as much in the same direction, so the ball gains $8.8 \times 10^{-21}\unit{J}$, of which 95 per
cent is the recoil of the whole ball, which tells nothing of its inside. The inside keeps $4.0 \times 10^{-22}\unit{J}$,
a fifteenth of the energy of motion of one atom at room temperature.[^tonne] Energy of motion goes as the square of
speed, so the tonne leaves slower by half the fraction of energy lost, the fraction

$$\frac{8.8 \times 10^{-21}\unit{J}}{1000\unit{kg} \times (44{,}000\unit{m\,s^{-1}})^2} = 4.5 \times 10^{-33},$$

about five parts in $10^{33}$, far beyond reach. Only a twentieth of that loss depends on what is inside the ball.

A warm body needs no tonne. The random motion of its atoms makes its shape tremble, and the size of the trembling
depends on the same weighted total as a kick's energy, so a camera that only watches can read the inside.[^tremor]

The next figure draws two more bodies of one mass. The upper one is a thin shell. The lower one holds half its mass at
the centre of a larger shell that holds the rest, sized so that every quadrupolar tide leaves the same energy in
both. A nearer mass stretches the side of a body that faces it more than the far side. This uneven part is the
**octupolar tide**, a tide of degree three, one more than the quadrupolar tide. In a round body it weighs each piece
by the fourth power of its distance from the centre, so it leaves twice as much energy in the lower body. Each higher
degree reaches one more weighted total.[^ladder]

{{paper fig:ladder}}

One pass at 1.5 times the larger shell's radius leaves 30 per cent more energy inside the lower body. Both also take
the same recoil, so their total energies differ by only 4.5 per cent.

## A black hole replies with friction and a temperature

The **horizon** of a black hole is the surface from which nothing, not even light, escapes. It absorbs part of a
changing tide's energy, as if it had friction.[^friction] In every warm body friction and random trembling go
together, and the **fluctuation–dissipation theorem** states the link: the trembling divided by the friction gives
the temperature. A black hole's shape trembles too, and its trembling divided by the horizon's friction gives the
Hawking temperature, the temperature that quantum mechanics gives a hole.[^hawking]

Take a hole of $1.356 \times 10^{23}\unit{kg}$, about twice the mass of the Moon, whose temperature is
$0.905\unit{K}$. A camera one metre away, watching for one second, would see a trembling tide of about
$4 \times 10^{-32}\unit{s^{-2}}$, against a steady tide of about $2 \times 10^{13}\unit{s^{-2}}$, which is about
$5 \times 10^{44}$ times larger.[^numbers] A stone's trembling holds its whole interior, but a hole's holds only its
temperature, which its mass sets.

A tide can also rise and fall at any rate. Feed a round body tides of one strength at every
rate and add up the power it absorbs, every rate counted alike. The total depends only on how far out its mass
lies, not on its stiffness or friction.[^sums] At degree two it adds each piece's mass times the square of its
distance from the centre, and higher degrees weigh the outer mass more. The hole's total at degree two is that of
a thin shell of its own mass at 1.02 times the radius of its horizon, and at degrees three and four that of shells at
1.46 and 1.61 times it. No arrangement of positive mass gives all three.

::: try {#hole-response}
Predict first: as the degree of the tide keeps rising, do the matching shells move out without end, or toward a limit?
Drag the degree from 2 to 8. The lower panel is a test that, for real matter, can never fall below zero. Built from
the hole's three totals, it does.
:::

The **holographic principle** is the idea that everything inside a region can be learnt at its boundary. Without
quantum mechanics, looking gives a surface's worth of numbers and acting with tides gives the rest. A black hole is the
exception, because it takes energy from a tide by its mass and spin alone.[^holography]

**The idea to keep: the field outside a body at one time keeps only a short list of weighted totals of its mass,
and the energy that a tide leaves in the body keeps the rest; a black hole answers both with almost nothing, its
mass, its spin and its temperature.**

::: problems
### Practice

**[0.5]** In the figure of round bodies, with the uniform ball as A and the cored ball as B, read the energy a kick
leaves in B relative to A.

::: solution
About 0.61, which is 0.365 against 0.6.
:::

**[0.5]** In the ladder figure, which tide leaves twice as much energy in one body as in the other?

::: solution
The octupolar tide, in the lower body (the mass at the centre of a shell) against the upper (the thin shell).
:::

### Stretch

**[0.5]** At a signal-to-noise ratio of $10^{70}$, how many bits do a black hole's seven numbers give, against a
stone's $1.7 \times 10^6$?

::: solution
$7 \times \log_2 10^{70} = 7 \times 70 \times 3.32 \approx 1630$ bits, a thousand times fewer.
:::

### The camera

**[0.5]** For a camera three body radii away, at a signal-to-noise ratio of a million and at $10^{70}$, how many numbers
does the field carry, and how many cells of the body do the kicks reach?

::: solution
About 170 numbers against 270 cells at a million, and about twenty thousand against a quarter of a million at
$10^{70}$. The numbers grow as the square of $R/d$ and the cells as its cube.
:::
:::

::: paper
- [Section XII](/paper/#sec:hair) and its plain words: the moments and their bits, equation [](/paper/#eq:hair-bits).
- [Section XIII](/paper/#sec:second-order) and its plain words: equations [](/paper/#eq:push) and
  [](/paper/#eq:pass), and Figures [](/paper/#fig:passing), [](/paper/#fig:ladder) and [](/paper/#fig:hidden-flow).
- [Section XIV](/paper/#sec:hole) and its plain words, with Table [](/paper/#tab:hair): a stone against a black
  hole.
- [Section XV](/paper/#sec:holography) and its plain words: holography, and equation [](/paper/#eq:dp-energy).
:::

::: deeper
- Sections [1.7](/tutorial/newton/hamilton/#a-sudden-kick-changes-the-kinetic-energy-in-two-parts) and [1.8](/tutorial/newton/orbits-and-kicks/#what-a-pass-leaves-inside-a-body-is-a-weighted-sum-of-its-projected-mass) derive the kick and the
  pass.
- The [GR course, section 17.7](https://neovand.github.io/general-relativity/chapter-17.html#17-7-rotation-kerr-frame-dragging-and-carefully-qualified-no-hair-claims)
  says what the no-hair theorem claims, and
  [section 22.7](https://neovand.github.io/general-relativity/chapter-22.html#22-7-a-horizon-gets-a-temperature) why a
  horizon is warm.
:::

[^sections]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XII](/paper/#sec:hair) to
    [Sec. XV](/paper/#sec:holography).

[^blind]: Section [0.2](/tutorial/evening/through-walls/#the-outside-of-a-body-does-not-settle-its-inside) calls
    this a blind spot; [1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts) proves it
    for round bodies.

[^moments]: Defined in section 2.3.

[^split]: Proved in section 2.5. First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its
    equation [](/paper/#eq:split).

[^shell]: Proved in section [1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts).

[^bits]: As $3^{12}$ is about half a million, degrees 0 to 12 survive: $1 + 3 + \dots + 25 = 169$ numbers. The sum is
    derived in section 3.8; first shown in *The
    gravitational camera* (Mohsenvand 2026), Sec. XII, as its equation [](/paper/#eq:hair-bits).

[^nohair]: Stated, with its conditions, in section 11.2.

[^two]: Section
    [13.1](/tutorial/what-a-field-keeps/push-and-pass/#a-probe-reads-the-field-at-first-order-and-the-bodys-reply-at-second)
    works out both orders.

[^kick]: Defined in section [1.7](/tutorial/newton/hamilton/#a-sudden-kick-changes-the-kinetic-energy-in-two-parts).

[^push]: Derived in [1.7](/tutorial/newton/hamilton/#the-energy-of-an-impulsive-tide), interpreted in
    [13.1](/tutorial/what-a-field-keeps/push-and-pass/#a-probe-reads-the-field-at-first-order-and-the-bodys-reply-at-second).
    First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, as its equation [](/paper/#eq:push).

[^ratio]: Derived in [1.7](/tutorial/newton/hamilton/#a-ball-and-a-shell-gain-in-the-ratio-three-to-five).

[^weight]: Stated in section [1.7](/tutorial/newton/hamilton/#a-sudden-kick-changes-the-kinetic-energy-in-two-parts), derived in section
    [6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-mass-is-its-total-energy-so-heat-has-weight).

[^pass]: Derived in section
    [1.8](/tutorial/newton/orbits-and-kicks/#what-a-pass-leaves-inside-a-body-is-a-weighted-sum-of-its-projected-mass);
    section
    [13.1](/tutorial/what-a-field-keeps/push-and-pass/#passes-along-one-great-circle-of-directions-give-the-density)
    shows that the losses fix the density. First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, as
    its equation [](/paper/#eq:pass).

[^tonne]: All computed in section
    [1.8](/tutorial/newton/orbits-and-kicks/#a-fast-passing-mass-gives-every-part-of-a-body-a-sideways-kick).

[^tremor]: Derived in section 4.6.

[^ladder]: Proved in section
    [13.3](/tutorial/what-a-field-keeps/ladder/#no-tide-reaches-beyond-the-rungs-below-its-degree-whatever-is-read);
    first shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, as its equation [](/paper/#eq:ladder).

[^friction]: Explained in section 11.4; first shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIV, as its
    equation [](/paper/#eq:horizon-friction).

[^hawking]: The theorem is in section 4.6, the temperature in 11.3, and the thermometer formula in 11.4 and
    [13.7](/tutorial/what-a-field-keeps/thermometer/#beside-a-hole-a-camera-can-read-its-temperature-without-catching-a-graviton)
    (first shown in *The gravitational camera* (Mohsenvand 2026) as its equation [](/paper/#eq:hole-thermometer)).

[^numbers]: Section 11.3 gives the mass and its steady tide,
    [12.2](/tutorial/sky/universe/#gravitons-parted-first-and-kept-a-colder-share-of-the-heat) the temperature and
    [11.4](/tutorial/black-holes/under-tides/#the-friction-trembles-at-the-holes-temperature)
    the trembling tide.

[^holography]: Section [13.8](/tutorial/what-a-field-keeps/holography/); first shown in *The gravitational camera*
    (Mohsenvand 2026), [Sec. XV](/paper/#sec:holography).

[^sums]: Section
    [4.5](/tutorial/response/causality/#a-blow-holds-every-frequency-and-the-energy-it-leaves-is-the-same-total)
    explains such sums, and section
    [13.7](/tutorial/what-a-field-keeps/thermometer/#no-distribution-of-positive-mass-has-the-holes-first-three-sums)
    the test. First shown in *The gravitational camera* (Mohsenvand 2026) as its equation
    [](/paper/#eq:hole-sum-rule).
