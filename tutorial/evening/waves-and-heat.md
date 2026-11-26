---
id: '0.3'
title: 'Waves too long to see, and the glow of heat'
question: 'A turning pair of balls and the warm inside of the Earth both send out gravitational waves. What limits the picture a camera can make of each?'
part: '0'
requires: ['0.1']
paper: [sec:waves, eq:unresolved, fig:quadrupole, fig:which-way, sec:thermal, fig:line-integral, fig:closed-furnace, sec:first-image, eq:column, fig:sun-at-midnight, tab:budget]
figures: [fig:line-integral, fig:sun-at-midnight]
live: [quadrupole, scene-which-way, scene-closed-furnace, graviton-count]
---

Three sealed steel boxes stand on a shelf. In two of them a pair of steel balls turns once a second, the two pairs in
opposite senses, and in the third the pair is still. In ordinary light the boxes look the same. What could the
gravitational waves of the turning pairs show? To picture them, imagine light, and gravity with it, slowed to 20 cm
per second. At the true speed of light the pairs' waves are 150,000 km long, and a camera on the shelf would be deep
inside their near field (section [0.1](/tutorial/evening/a-camera-for-gravity/)).[^sections]

The heat inside every warm body sends out far shorter waves, and a camera could point at the warm inside of the Earth.
What limits the picture of a turning pair, and of the warm Earth? A slowly moving body is far smaller than its own
waves, so it shows only as a point. Warm matter sends waves short enough for sharp pictures, but so few gravitons that
a lifetime of watching the Earth below on one square metre gives a picture of only about fourteen elements.

## Only a changing lopsidedness sends out waves

A gravitational wave is a pattern of stretch and squeeze that travels out from its source at the speed of light. A
body sends one out when its mass is lopsided and the lopsidedness changes. The measure of that lopsidedness is the
**quadrupole moment**: it says how far the mass is drawn out along some axis, like a rugby ball or a dumbbell, rather
than spread evenly as in a sphere. A dumbbell spun end over end, like the pairs in the boxes, keeps changing its
quadrupole moment, so it sends out waves.[^quadrupole] A wheel turning smoothly on its axle sends out none.

Take two masses of one kilogram, a metre apart and spun sixteen times a second. They send out $4.6 \times 10^{-41}$ W.
The pair looks the same after half a turn, as the stretched ring of section
[0.1](/tutorial/evening/a-camera-for-gravity/) does, so its waves vibrate 32 times a second.[^twice] A **graviton** is
the smallest packet of energy that a gravitational wave of a given frequency can carry, as a photon is for light. Its
energy is Planck's constant, $6.6 \times 10^{-34}$ joule-seconds, times the frequency, here $2.1 \times 10^{-32}$ J. The pair therefore sends out one graviton about every fifteen years.[^graviton]

## A slow body is far smaller than its waves, so it is a point

A wave cannot show details much smaller than its own wavelength, the distance from one crest to the next: the
**diffraction limit**.[^diffraction] The wavelength of a turning pair compares with its size as

$$\frac{\lambda}{d} = \frac{\pi}{2}\,\frac{c}{v}.$$

Here $d$ is the distance between the two masses and $\lambda$ (lambda) the wavelength of their waves, both in metres.
The speed of each mass is $v$, and $c = 3.0 \times 10^8\unit{m\,s^{-1}}$ is the speed of light. Both sides are pure
numbers. The wavelength exceeds the body by about the factor by which light outruns the body's moving parts.[^unresolved]

Everyday bodies move millions of times more slowly than light. A pair of balls turning once a second sends out waves
150,000 km long, twelve times the diameter of the Earth. Seen in its own waves, a compact body that moves slowly is
therefore a single point, with no shape. Only a source larger than its waves can show a shape, such as a continent's
power grid, whose generators turn in step 50 times a second and send out waves 3000 km long.

## A point still shows which way it turns

The **polarization** of a wave is the pattern of stretch and squeeze it makes in a ring of free balls, and how that
pattern changes during each cycle. Seen along the axis of a turning pair, the pattern turns round with the pair:
**circular polarization**. Seen edge-on, it only pulses along fixed directions and carries eight times less power:
**linear polarization**.[^polarization]

The circularly polarized share of the signal is $+1$ along the axis when the pair turns anticlockwise as the camera
sees it, $-1$ when it turns clockwise, and 0 edge-on. Its sign gives the sense of turning and its size the tilt of the
axis, without the pair being resolved at all.

::: try {#quadrupole}
*Power sent in each direction* shows how strongly a turning pair sends out waves round its axis; *Wavelength against
size* compares the waves with the pair. Predict first: at two-thirds of the speed of light, is the pair still smaller
than its waves? Drag the speed to the top, then down to 1 m/s.
:::

In the boxes scene the slowed light makes the waves 10 cm long, so an array 1.5 m across shows each pair as a spot.

::: try {#scene-which-way}
Predict first: will the still pair show at all, and will the two turning pairs take the same colour? Drag the divider
across the shelf. Magenta marks a pattern that turns anticlockwise as the camera sees it, and green one that turns
clockwise.
:::

## Matter is transparent, so warm matter glows throughout

Heat is the random jiggling of atoms and molecules. At room temperature they jiggle about $10^{13}$ times a second,
and gravitational waves of that frequency are tens of micrometres long, like the infrared light of warm bodies. A
wave crossing matter makes neighbouring layers slide past each other, and the matter's internal friction, its
**viscosity**, turns a little of the wave's energy into heat. In water a wave would travel about
$8.5 \times 10^{20}$ light-years before losing most of its energy, far more than the $10^{11}$ light-years across the
visible universe, so matter is transparent to these waves.[^absorption]

A body that absorbs a kind of radiation also gives it off when it is warm, and the better it absorbs, the more it
gives off. This is **Kirchhoff's law**.[^kirchhoff] So every warm body sends out a faint **thermal glow** of
gravitational waves, set by its friction and its temperature. Transparency and glow do not conflict: every small piece
of the body glows a little, and the glow escapes because almost nothing absorbs it.

{{paper fig:line-integral}}

Nothing casts a shadow in the glow. A pixel receives the glow of every metre along its line of sight, near and far,
added together.[^column] The picture is an X-ray in which every object is its own lamp.

## The glow shows what light and weight cannot, but it is faint

Two closed steel furnaces hold the same block of iron, one at room temperature, 293 K, and the other at 1500 K. They
look the same. They also weigh the same to within the weight of the heat, less than one part in $10^{11}$ of the
iron, far too little for the near field to tell them apart.[^weight]

::: try {#scene-closed-furnace}
Predict first: will the steel hide the blocks, and how many times brighter will the hot block, five times as hot,
look? Drag the divider to the left to see both furnaces in the glow.
:::

Both blocks show through their steel. The hot iron sends out about 26 times as many gravitons as the cold,[^metal]
but the steel and the floor behind add the same glow to both lines of sight, so the hot block looks sixteen times as
bright through its middle.

The glow is also extraordinarily faint. A person, taken as seventy litres of water at body temperature, sends out about
$10^{-36}$ W of it, against about a kilowatt of infrared light, which is one graviton every 240 million years.[^person]

## A first image: the Sun at midnight, and how few gravitons arrive

{{paper fig:sun-at-midnight}}

Put a camera on the night side of the Earth, looking down. Model the Earth as five shells, from a crust at 700 K to an
inner core at 5500 K, each with the most friction its stiffness allows, so that every brightness is an upper
limit.[^bound] Beyond the Earth, shining straight through it, is the core of the Sun. The Sun sends out about
$10^8$ W in gravitational waves [@GarciaCelyRingwald2025], about one graviton per square metre per second at the
Earth,[^sun] from a patch of sky a tenth of a degree across. The whole Earth below sends one square metre at most one
graviton every twenty hours.

In eighty years one square metre collects about 35,000 gravitons from the Earth below. A count of random arrivals varies
from one exposure to the next by about its own square root.[^sqrt] Suppose one part of a picture is ten per cent
brighter than a level known in advance. To be sure of it at five standard deviations, its extra tenth must be five
times that spread. This happens at 2500 gravitons: their tenth, 250, is five times their square root, 50. Each part told apart in this way is a **picture element**, and a lifetime gives $35{,}000 / 2500 = 14$
of them. The limit is the count, not the sharpness.[^first]

::: try {#graviton-count}
Predict first: how many picture elements would one of the turning pairs in the boxes give, watched for a lifetime on
one square metre? Choose the turning pair and a lifetime to check. Then choose the Earth below and press *New draw* a
few times: each element's count changes by about its square root.
:::

Fourteen elements is what a lifetime gives of a scene not known in advance. A camera that knows the Earth is made of
round shells spends the same gravitons on nine numbers instead, the radii and the glow of the shells, as a simple
scene does in the near field (section [0.2](/tutorial/evening/through-walls/)). Lines of sight that point less
steeply down miss the deeper shells, so the camera reads the crust first and peels off each deeper shell in turn, like
the layers of an onion. A lifetime would place the edge of the core to within 29 km.[^abel] These pictures show what is
there to be seen, not what a detector made of matter could record.[^detector]

**The idea to keep: a slowly moving body is a single point in its own waves, though their polarization shows how it
turns; warm matter glows throughout because nothing absorbs the glow, but so few gravitons arrive that counting
them, not sharpness, limits the picture.**

::: problems
### Practice

**[0.3]** In the last *Try it*, how long must one square metre watch the Sun's core to collect one picture element's
gravitons?

::: solution
About 42 minutes: 2500 gravitons at one a second.
:::

### Stretch

**[0.3]** Two balls 0.44 m apart, turning once a second, move at about 1.4 m/s. Estimate the length of their waves.

::: solution
The wavelength is $(\pi/2)(c/v)$ times the size: $1.6 \times (3.0 \times 10^8 / 1.4) \times 0.44\unit{m} =
1.5 \times 10^8\unit{m}$.
:::

### The camera

**[0.3]** Which of the scenes of this tour need no gravitons at all, and why?

::: solution
The near-field scenes. A static field is not radiation, so its picture is limited by the pixels' noise, not by counts.
:::
:::

::: paper
- [Section V](/paper/#sec:waves) and its plain words: which motions send out waves, and what a point shows.
- [Section VI](/paper/#sec:thermal) and its plain words: absorption, the glow and the closed furnace.
- [Section IX](/paper/#sec:first-image) and its plain words: the Sun at midnight and the graviton budget.
- [Section VII](/paper/#sec:no-lens) shows that no useful lens can be made for these waves; section
  [0.4](/tutorial/evening/one-pixel/) tours it. [Section XI](/paper/#sec:vistas) is the sky.
:::

::: deeper
- Sections 5.3 to 5.6, 7.6 to 7.8 and Part 10 derive the waves, the glow and the first image.
:::

[^sections]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. V](/paper/#sec:waves), whose pictures
    imagine light slowed in this way, [Sec. VI](/paper/#sec:thermal) and [Sec. IX](/paper/#sec:first-image).

[^quadrupole]: Section 7.7 derives the quadrupole formulas of *The gravitational camera* (Mohsenvand 2026), its
    equations [](/paper/#eq:quadrupole) and [](/paper/#eq:dumbbell), and shows which motions send out none; section
    [7.6](/tutorial/geometry/gravitational-waves/#a-body-in-steady-motion-sends-no-wave-and-neither-does-an-even-pressure)
    shows it for steady motion and an even pressure.

[^twice]: A pattern that looks the same after half a turn is said to have spin two
    ([1.5b](/tutorial/newton/complex-numbers/)). Section 7.7 derives the doubled frequency.

[^graviton]: Section 8.3 introduces the graviton and its energy. Here
    $2.1 \times 10^{-32}\unit{J} / 4.6 \times 10^{-41}\unit{W} = 4.6 \times 10^{8}\unit{s}$.

[^diffraction]: Section [5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)
    derives it.

[^unresolved]: Section 7.7 derives it: in half a turn the wave travels one wavelength while each mass goes half way
    round its circle, a distance $\pi d/2$. First shown in *The gravitational camera*
    (Mohsenvand 2026), Sec. V, as its equation [](/paper/#eq:unresolved).

[^polarization]: [1.5b](/tutorial/newton/complex-numbers/) defines polarization. Section
    [5.4](/tutorial/waves/polarization/#projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor)
    derives the amplitudes, the circular share and the factor of eight (the paper's equations
    [](/paper/#eq:rotor-amplitudes) and [](/paper/#eq:circular)).

[^absorption]: Section 7.8 derives the absorption, $1.2 \times 10^{-37}$ per metre for water's viscosity,
    $10^{-3}$ Pa s; first shown in *The gravitational camera* (Mohsenvand 2026) as its equation
    [](/paper/#eq:alpha).

[^kirchhoff]: Section 10.2 derives it; first shown in *The gravitational camera* (Mohsenvand 2026) as its equation
    [](/paper/#eq:kirchhoff).

[^column]: Section 5.5 derives this sum; first shown in *The gravitational camera* (Mohsenvand 2026) as its equation
    [](/paper/#eq:column).

[^weight]: An energy weighs that energy over $c^2$ (section
    [6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-mass-is-its-total-energy-so-heat-has-weight)): a megajoule
    weighs $1.1 \times 10^{-11}$ kg, and heating a kilogram of iron to 1500 K takes less.

[^metal]: In a metal the friction falls as one over the temperature, so the count grows as its square:
    $(1500/293)^2 = 26$ (sections 10.1 and 10.3).

[^person]: The person is 70 litres of water at 310 K, glowing $1.3 \times 10^{-35}$ W per cubic metre
    ([table of materials](/paper/#tab:materials)): $9 \times 10^{-37}$ W. A graviton at $10^{13}$ vibrations a second
    carries $7 \times 10^{-21}$ J.

[^bound]: Causality caps a material's friction summed over all frequencies (section 10.3; first shown in *The
    gravitational camera* (Mohsenvand 2026) as its equation [](/paper/#eq:glow-bound)).

[^sun]: $4 \times 10^{-16}\unit{W\,m^{-2}}$ at the Earth, over $5 \times 10^{-16}$ J per graviton from a core at about
    $1.3 \times 10^7$ K (section 10.1).

[^sqrt]: Section 3.1 derives this square-root law.

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. IX](/paper/#sec:first-image).

[^abel]: The peeling inverts an Abel transform, taught in section
    [5.6](/tutorial/waves/abel-transform/#the-transform-can-be-undone). *The gravitational camera* (Mohsenvand 2026)
    simulates a lifetime of counts and recovers the layers in its Figure [](/paper/#fig:earth-inverted).

[^detector]: A cubic metre of detector crossed by one graviton a second would wait $2 \times 10^{29}$ years for its
    first count (section 10.3).
