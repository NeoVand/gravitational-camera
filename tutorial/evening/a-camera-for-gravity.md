---
id: '0.1'
title: 'A camera for gravity: the pixel, the tide, the three regimes'
question: 'LIGO is a camera with one pixel. What would a camera made of many such pixels record of an ordinary room?'
part: '0'
requires: []
paper: [sec:introduction, fig:sun-at-midnight, sec:pixel, eq:deviation, fig:tidal, fig:tidal-field, sec:regimes, eq:nearzone, fig:regimes, tab:regimes]
figures: [fig:sun-at-midnight, fig:tidal, fig:tidal-field, fig:regimes]
live: [tidal-ring, regime-map]
---

In 2015 the observatory LIGO recorded a **gravitational wave** for the first time: a ripple in space, sent out by
moving masses, that stretches and squeezes everything it passes through. LIGO reports one number at each instant, so
it is a camera with one pixel. Suppose such detectors could be made as small and as sensitive as we like, with one at
every pixel of a sensor. What would a camera made of many such pixels record of an ordinary room?

{{paper fig:sun-at-midnight}}

An observer on the night side of the Earth points the camera at the ground. In ordinary light, panel (a), the ground
is dark. In gravity, panel (b), it is transparent, and the planet's hot interior glows in shells, because the jiggling
atoms of warm matter send out faint gravitational waves. The core of the Sun shines up through the whole Earth. Panel
(b) is what endless collecting would show; a lifetime gives only a coarse version.[^coarse] This is a thought
experiment about what gravity carries.

Pointed at an ordinary room, the camera would record a blurred map of where its mass lies, through anything in
between, and the map would change at the instant someone moved.[^room] Each pixel records the tide, the difference in
gravity between nearby points, and feels the room's contents by their pull, because the waves they send out are far
longer than the room.

## LIGO is a camera with one pixel

LIGO has two arms at right angles, each 4 km long, with a mirror hanging at each end. A passing wave lengthens one arm
and shortens the other. The difference between their lengths, divided by the length of an arm, is the **strain**, a
pure number. The waves that LIGO detects have strains near $10^{-21}$, so one arm becomes longer than the other by
$4 \times 10^{-18}\unit{m}$, a 420th of the width of a proton.

In this book a **pixel** is a detector of this kind shrunk to a point: a small cloud of free masses whose motions
relative to one another are watched. Where gravity is weak, as in a room, the gravity of separate masses adds up, and Einstein's theory takes a simpler
form, linearized gravity.[^linear] So the picture of a room is the sum of the pictures of the things in it.

## A falling detector feels only the difference in gravity

An astronaut in orbit floats because she and her spacecraft fall around the Earth together. A body is in **free
fall** when gravity is the only force acting on it. Every body at a given place falls with the same acceleration (the
equivalence principle),[^ep] so a detector in free fall cannot feel the pull at its own place.

The pull does differ a little from place to place. In a ring of free balls beside a large mass, panel (a) of the next
figure, the nearest ball is pulled harder than the farthest, so the ring is stretched along the line to the mass. The
balls at the sides are pulled along lines that meet at the mass, so they move slightly towards each other, and the
ring is squeezed across the line.

{{paper fig:tidal}}

This difference in gravity between nearby points is the **tide**, named after the tides of the sea, which the Moon
raises in the same way. One acceleration can match the pull at one place but not at two, so falling cannot remove the
tide: it is the only effect of gravity that a freely falling detector can measure, and it is what a pixel records.

## The tide at a point is a table of numbers, ten in all

The tide depends on two directions: the step from one ball to the next, and the push between them. So the tide at a
point is a table with three rows and three columns, one for each direction in space, such as east, north and up: the
**tidal tensor**. The row of an entry says which way the push goes, and its column which way the step goes.

Only five of the nine entries are independent. The table is symmetric, and in empty space its three diagonal entries
add up to zero, so every squeeze is paid for by a stretch.[^five] Masses in motion add a second kind of tide, the
**magnetic part**, which twists instead of stretching and brings five more numbers. So an ideal pixel records ten
numbers at every instant.[^magnetic]

The motion of the ring is one equation, with $\xi$ (the Greek letter xi) the separation, the arrow from one ball to the
other, in metres:

$$\ddot\xi_i = -\curv{\tE}_{ij}\,\xi_j .$$

The left side is the relative acceleration. The curly E is the tidal tensor. The small letters label the three
directions, and the label that appears twice on the right is summed over them, so the right side is the table
multiplied by the separation, as a matrix multiplies a vector.[^deviation]

The tide is measured in $\mathrm{s^{-2}}$, so that it turns metres of separation into metres per second squared: in a
tide of one per second squared, two free balls one metre apart accelerate by one metre per second squared. The minus
sign means that a positive entry pulls the balls back together, as a spring between them would. So a positive tide
along a direction is a squeeze, drawn in blue, and a negative one is a stretch, drawn in orange.

::: try {#tidal-ring}
Predict first: if the mass moves twice as far away, how much weaker does the stretch become? Then drag the mass to
2 m. The mass is 70 kg, a person, and the readout is in eötvös, units of $10^{-9}\unit{s^{-2}}$. Then predict whether
the ring stays stretched when a second mass on the other side cancels the first one's pull at the centre.
:::

## The pull of a person swamps the waves LIGO was built for

Take a person of 70 kg standing one metre from the pixel. The person makes a tide of
$9.3 \times 10^{-9}\unit{s^{-2}}$.[^person] Small as that is, it is 54,000 times the tide that the Moon raises on the
Earth, $1.7 \times 10^{-13}\unit{s^{-2}}$, because the tide falls with the cube of the distance.[^cube] On the ground
the Earth's own tide, $3.1 \times 10^{-6}\unit{s^{-2}}$, is 330 times the person's,[^earth] but it is steady and well
known, so the camera subtracts it.

Now let the person stand a metre beyond one of LIGO's end mirrors and sway by 5 cm, once a second. The far mirror of
that arm is 4 km away and feels nothing, so the pull on the near mirror changes by about a tenth, and the free mirror
swings by $1.2 \times 10^{-11}\unit{m}$, a hundred-millionth of a millimetre. The strain is $3 \times 10^{-15}$, three million times the strain of the waves that LIGO was built to
detect, and this is why people and vehicles are kept away from its mirrors.[^sway]

{{paper fig:tidal-field}}

The figure maps the tide around one mass (a), between two masses (b) and in a wave (c). In every panel each small
ring is stretched one way and squeezed another, so LIGO's one number cannot tell a passing lorry from a distant
collision of black holes. LIGO must remove what the camera records.

## Near a source a pixel feels its pull, and far away its waves

A moving body also sends out gravitational waves. Close to the swaying person, the tide follows the sway at once, and
the part of it that changes falls at least as fast as one over the cube of the distance: the **near field**, or near
zone. Far away, the sway arrives only as a wave, which travels at the speed of light and weakens only as one over the
distance: the **wave zone**.[^zones] The boundary between them is

$$r \ll \frac{\lambda}{2\pi} = \frac{c}{2\pi f}.$$

Here $r$ is the distance from the source to the pixel, in metres. The frequency $f$ of the waves, in hertz, is set by
how often the source moves, and their wavelength $\lambda$, in metres, is the speed of light divided by $f$. The sign
$\ll$ means "much smaller than". So a pixel is in the near zone when it is much closer than about a sixth of a
wavelength, and a source that moves more often has a smaller near zone.

For the person swaying once a second the wavelength is 300,000 km, and the near zone reaches 47,700 km, an eighth of
the way to the Moon. A source shaking a thousand times a second has a near zone of 47.7 km, so a camera anywhere in the same town sees everything in daily life in its near field.

{{paper fig:regimes}}

The diagonal line is the edge of the near zone. Every source that moves mechanically, from the Moon's tide to a rotor
beside a LIGO mirror, lies below it, in the near field. Only the thermal sources on the right reach a nearby camera as
waves.[^table]

::: try {#regime-map}
Predict first: answer the question at the top of the figure, about a person swaying 10 km away. Then drag the probe
to 1 Hz and 10 km, and the answer appears. Last, press the warm object at 300 K, whose near zone ends 2.7 μm from
it.
:::

The camera therefore sees in three ways: by the pull of nearby masses (section [0.2](/tutorial/evening/through-walls/)),
by the waves of bodies moving as a whole and by the **thermal glow** of jiggling atoms (section
[0.3](/tutorial/evening/waves-and-heat/)). Section [0.4](/tutorial/evening/one-pixel/) shows how much one pixel's ten
numbers can tell, and section [0.5](/tutorial/evening/what-the-outside-keeps/) what the outside of a body keeps of its
inside.

**The idea to keep: a pixel of the gravitational camera records the tide, the difference in gravity between nearby
points, as ten numbers; and whether it sees a source by its pull or by its waves depends on how far the source is
compared with a sixth of its wavelength.**

::: problems
### Practice

**[0.1]** In the map of where sources lie, on which side of the diagonal is the passing lorry, and how does a camera
across the street see it?

::: solution
Below the diagonal, in the near field. The camera feels the lorry's changing pull, which follows the lorry at once.
:::

**[0.1]** A source shakes a thousand times a second, 500 km from a pixel. Is the pixel in the near field?

::: solution
No. The near zone of a 1 kHz source reaches about 48 km, and 500 km is ten times farther, in the wave zone.
:::

**[0.1]** In the ring figure, find where the mass must stand for the stretch to read 2.0 eötvös.

::: solution
About 1.67 m, because the tide falls with the cube of the distance and the cube root of $9.3/2.0$ is 1.67.
:::

### Stretch

**[0.1]** At what distance would the person's tide equal the Moon's tide on the Earth?

::: solution
About 38 m. The person's tide at 1 m is 54,000 times the Moon's, and the cube root of 54,000 is 38.
:::

### The camera

**[0.1]** A detector a thousand times more sensitive narrows the blur, the angle over which the picture of a small
object is smeared (section [0.2](/tutorial/evening/through-walls/)). What are the two angles, and what does the first
look like?

::: solution
From about 24° to about 14°. An angle of 24° is about the width of an outstretched hand at arm's length.
:::
:::

::: paper
- [Section I](/paper/#sec:introduction) and its plain words: LIGO as one pixel, and the Sun at midnight.
- [Section II](/paper/#sec:pixel) and its plain words: the ring, Equation [](/paper/#eq:deviation), the person and
  LIGO's strain.
- [Section III](/paper/#sec:regimes) and its plain words: Equation [](/paper/#eq:nearzone), the map of sources and
  Table [](/paper/#tab:regimes).
:::

::: deeper
- Section [1.4](/tutorial/newton/tides/) derives the tide, and [1.5](/tutorial/newton/five-numbers/) counts the five
  numbers.
- The [GR course, chapter 1](https://neovand.github.io/general-relativity/chapter-1.html#weightlessness-and-tides)
  releases two pebbles instead of one to show what falling cannot remove.
:::

[^coarse]: Section 0.3 counts the gravitons: a lifetime gives a picture of about fourteen points. First shown in
    *The gravitational camera* (Mohsenvand 2026), [Sec. IX](/paper/#sec:first-image).

[^room]: Section 0.2 tours this picture. First shown in
    *The gravitational camera* (Mohsenvand 2026), [Sec. I](/paper/#sec:introduction).

[^linear]: Section [7.4](/tutorial/geometry/linearized-gravity/) teaches linearized gravity, and
    [1.2](/tutorial/newton/field-and-potential/) shows that Newton's pulls add.

[^ep]: Stated in its Newtonian form in section [1.4](/tutorial/newton/tides/), and in Einstein's theory in section
    [7.1](/tutorial/geometry/metric/#falling-cancels-gravity-at-a-point-and-only-there).

[^five]: Counted in section [1.5](/tutorial/newton/five-numbers/).

[^magnetic]: The magnetic part of moving masses is derived in section [7.5](/tutorial/geometry/gravitomagnetism/), and
    the count of ten in section
    [7.3](/tutorial/geometry/einstein-equation/#in-empty-space-only-the-weyl-curvature-is-left-and-it-holds-ten-numbers).
    Section [0.4](/tutorial/evening/one-pixel/) shows what the ten numbers can tell.

[^deviation]: Derived in section [1.4](/tutorial/newton/tides/), where section
    [1.1](/tutorial/newton/vectors-and-indices/) supplies the labels and the rule for summing. First shown in *The
    gravitational camera* (Mohsenvand 2026), Sec. II, as its equation [](/paper/#eq:deviation).

[^person]: Computed in section [1.4](/tutorial/newton/tides/), with the comparison with the Moon.

[^cube]: Derived in section [1.4](/tutorial/newton/tides/): at twice the distance a tide is eight times weaker.

[^earth]: Computed in section [1.4](/tutorial/newton/tides/).

[^sway]: Section [1.4](/tutorial/newton/tides/) works out the swing and the strain for both readings:
    $7 \times 10^{-11}$ for a detector small compared with its distance from the person, $3 \times 10^{-15}$ beside
    one of LIGO's mirrors.

[^zones]: Section [5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1)
    derives both regions and the boundary between them, with its $2\pi$. First shown in *The gravitational camera*
    (Mohsenvand 2026), Sec. III, as its equation [](/paper/#eq:nearzone).

[^table]: The three ways of seeing are tabulated in *The gravitational camera* (Mohsenvand 2026), Table
    [](/paper/#tab:regimes).
