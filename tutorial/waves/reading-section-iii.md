---
id: R5
title: 'Which way it turns'
question: "Where does a source reach the camera as a pull and where as a wave, and how can the camera tell which way a sealed rotor turns?"
part: '5'
requires: ['1.4', '1.5', '1.5b', 'R1', '2.7', '3.6', '3.7', '4.2', '5.1', '5.2', '5.3', '5.4', '5.5']
paper: [sec:regimes, eq:nearzone, fig:regimes, tab:regimes, eq:newton, eq:wave, sec:waves, eq:unresolved, eq:circular, fig:which-way, eq:diffraction]
figures: [fig:regimes, fig:which-way]
live: [regime-map, rotor-polarization]
---

Move a magnet back and forth beside a compass and the needle follows it at once; from far away the magnet is felt only
through the radio waves it sends. Gravity divides the space round a source in the same way. In which part do a person,
an earthquake and the Sun's core lie for the camera, and, when the camera lies far out among the waves, what can it
still read about a source it cannot open, such as which way a sealed rotor turns?[^first]

{{paper fig:regimes}}

The map of Figure [](/paper/#fig:regimes) has frequency across and distance up, in powers of ten; its diagonal line is the edge of the near zone,
derived below. Mechanical sources lie far below it, thermal sources far above.

::: plain
Close to a source, its pull follows it at once and weakens quickly with distance. Far away, the source is felt only
through its waves, which weaken slowly. The border lies at about a sixth of a wavelength. Ordinary bodies move slowly,
so their waves are thousands of kilometres long, and everything that moves in a room is felt by its pull. Only the
jiggling of the atoms of warm matter is fast enough to send waves short enough for sharp pictures.


:::

## Near a source the tide follows it, and far away it is a wave {#the-plain-words-hold-number-by-number-from-the-compass-to-the-three-facts}

The field of a changing source has a **near part**, which follows the source and falls fast, and a **wave part**, which
falls only as one over the distance. Beside a source that oscillates at the angular frequency $\omega = 2\pi f$, with
$\sym{frequency}{f}$ the frequency in hertz, the slope of the field has a near part falling as $1/r^2$ and a wave part
$kr$ times larger, where $\sym{wavenumber}{k} = \omega/c = 2\pi/\lambda$ is the **wavenumber**
in $\mathrm{m^{-1}}$, $\sym{wavelength}{\lambda} = c/f$ is the **wavelength**, the distance between crests, in metres,
and $\sym{speed-of-light}{c} = 2.998\times10^8\unit{m\,s^{-1}}$
([section 5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1)).
The two are equal at $kr = 1$, so the **near zone**, where the near part wins, is

$$r \ll \frac{\lambda}{2\pi} = \frac{c}{2\pi f}.$$

The $2\pi$ appears because the edge is where the wave's phase has turned by one radian, not a whole wavelength;
$1/2\pi = 0.159$ is close to a sixth. At one cycle a second the wavelength is
299,800 km and the near zone reaches 47,700 km; at a thousand cycles a second it reaches 47.7 km.

Here $kr$ is the delay $r/c$ in radians of the source's cycle. Inside the near zone the slope of the field matches the
static slope of the source as it is now to a fraction of order $(kr)^2$, because the terms of order $kr$ cancel
([section 5.2](/tutorial/waves/retarded-waves/#inside-the-near-zone-the-field-is-the-static-field-of-the-source-as-it-is-now)).
The tide there is the Hessian of Newton's potential $\sym{potential}{\field\Phi}$,

$$\curv{\tE}_{ij} = \partial_i\partial_j\field\Phi,$$

of size $2G\matter M/r^3$ along the line to a mass $\matter M$, in $\mathrm{s^{-2}}$ (section 1.4). Outside the zone the
field is radiation, falling as $1/r$, and the tide of a wave of strain $h^{\rm TT}_{ij}$ is

$$\curv{\tE}_{ij} = -\tfrac12\,\partial_t^2 h^{\rm TT}_{ij}$$

([section 7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)).

## Every body that moves as a whole lies deep inside its near zone

A body that moves as a whole sends waves at the low frequencies at which it moves; a turning pair sends them at twice
its turning rate (section 5.2). Hot matter sends them at the very high frequencies at which its atoms jiggle
([section 4.2](/tutorial/response/temperature/)). We place a thermal source at the
peak of its spectrum, $f = 2.82\,\kB T/2\pi\hbar$. Here
$\sym{temperature}{T}$ is the temperature in kelvins, $\sym{boltzmann}{\kB} = 1.381\times10^{-23}\unit{J\,K^{-1}}$ is
Boltzmann's constant and $\sym{hbar}{\hbar} = 1.055\times10^{-34}\unit{J\,s}$ the reduced Planck constant. The factor
2.82 is the root of $x = 3(1 - e^{-x})$. It puts the peak of the Planck radiance of section 5.5, the glow of an
enclosure at the temperature $T$ in power per unit frequency, at $\hbar\omega = 2.82\,\kB T$ (section 10.1). A body's
own glow peaks there only if its friction is the same at every frequency, as with the **placeholder friction**, the
constant $10^{-3}\unit{Pa\,s}$ used as a reference for every glow
([section 4.4](/tutorial/response/viscosity/#at-fixed-stiffness-the-more-viscous-liquid-has-less-friction-at-the-frequencies-of-heat));
real materials peak elsewhere. The table gives each source's place and its distance in near zones.

| Source | $f$ (Hz) | $r$ (m) | $r/(\lambda/2\pi)$ |
|---|---|---|---|
| Moon's tide | ${2.24\times10^{-5}}$ | ${3.8\times10^8}$ | ${1.8\times10^{-4}}$ |
| earthquake | $0.032$ | ${1.0\times10^6}$ | ${6.6\times10^{-4}}$ |
| passing lorry | $0.32$ | $32$ | ${2.1\times10^{-7}}$ |
| person walking | $1$ | $3.2$ | ${6.6\times10^{-8}}$ |
| LIGO's rotor | $32$ | $1.5$ | ${1.0\times10^{-6}}$ |
| warm object, 300 K | ${1.76\times10^{13}}$ | $3.2$ | ${1.2\times10^6}$ |
| Earth's interior, 3500 K | ${2.06\times10^{14}}$ | ${3.2\times10^6}$ | ${1.4\times10^{13}}$ |
| Sun's core, 15.7 MK | ${9.2\times10^{17}}$ | ${1.5\times10^{11}}$ | ${2.9\times10^{21}}$ |

Every mechanical source lies at less than a thousandth of the distance to the edge of its near zone, and every thermal
source at more than a million times that distance. The Moon's tide rises every 12.4 hours, so its near zone reaches $2.1\times10^{12}$ m, 14 astronomical units, beyond
Saturn.[^moon] Merging neutron stars send their last waves
near 2 kHz, so their near zone ends 24 km from them and every camera receives them as waves (section [12.1](/tutorial/sky/stars/#two-compact-bodies-spiral-together-and-the-papers-pair-has-nine-seconds-left)).
Everything in daily life that moves mechanically therefore happens in the near field; the glow of a warm object does
not.

::: try {#regime-map}
Predict first: a person sways once a second, 10 km from the camera. Is the camera in the near field or in the waves?
Put the probe at 1 Hz and 10 km. Then press each source and compare the row "Near zone" with the table's last column.

Now put the probe at 2 Hz and 5 m, near the capstone's pairs: "near field", at $2.1\times10^{-7}$ of the way to the
edge. With light slowed to $20\unit{cm\,s^{-1}}$ the diagonal slides down by 9.2 powers of ten, and the same point lies
283 times beyond it.
:::

## Sources of radiation divide again, and each regime has its own limit

The two kinds of source give three regimes, each with its own limit on the image.

| Regime | What the pixel receives | What limits the image |
|---|---|---|
| near field | the changing Newtonian pull of nearby mass | blur grows with distance |
| waves from bulk motion | radiation from accelerating bodies | a compact source is an unresolved point |
| thermal glow | radiation from molecular motion | almost no gravitons arrive |

In the near field fine detail fades on its way out, and the best picture is blurred by 24° at a signal-to-noise ratio
of a thousand ([section 3.7](/tutorial/noise/blur-law/)). In the wave zone each direction
carries one ripple of the source. A source much smaller than a wavelength looks the same to every ripple, so each
direction reads one number, the source added up over its volume: the source is a point
([section 5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source)). An array
resolves no finer than about $\lambda/D$, with $D$ its width
([section 5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)).[^wheel]
The thermal glow is faint because matter barely absorbs, and so barely emits
([section 5.5](/tutorial/waves/radiance/#a-warm-bodys-glow-over-its-absorption-is-the-radiance-of-an-enclosure-at-its-temperature)).
That almost no gravitons, the quanta of the wave, arrive is the result of Parts 8 and 10.

## One property of gravity and two small numbers of matter decide what the camera can do {#one-property-of-gravity-and-two-small-numbers-of-matter-decide-what-the-camera-can-do}

**Gravity has spin two.** The **null vector** $\sym{null-vector}{\vect m} = (\vect e_1 + i\vect e_2)/\sqrt2$, with
$\vect e_1$ and $\vect e_2$ unit vectors across a wave's direction, has spin one and a dot product with itself equal to
zero; the table $\vect m\vect m^{\mathsf T}$ is symmetric, has no trace and has spin two
([section 1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero)).  In a wave the whole field is a multiple of that table (section 9.1). A turn
of the axes by $\theta$ multiplies the shear of a tide, written as one complex number, by $e^{-2i\theta}$, so a half
turn gives $e^{-2\pi i} = 1$, while an arrow's $e^{-i\pi}$ is $-1$
([section 1.5b](/tutorial/newton/complex-numbers/#a-tide-across-a-direction-is-one-complex-number-and-turning-the-axes-turns-it-back-by-twice-the-angle)).
Hence a pixel records ten numbers, five for the tide and five for its magnetic part ([R1](/tutorial/newton/reading-section-ii/#an-ideal-pixel-reads-ten-numbers-and-must-not-turn)).

**Matter is slow**, $v/c \ll 1$. A body of size $L$ whose parts move at the speed $v$ changes in a time near $L/v$, so its near zone reaches
$c/\omega \approx cL/v$. For a
person, $L$ near 1 m and $v$ near $1\unit{m\,s^{-1}}$ give $3\times10^8$ m. For a pair of masses a distance $d$ apart,
turning at the rate $\Omega$, the ratio is exact: $\lambda = 2\pi c/2\Omega = \pi c/\Omega$ and $v = \Omega d/2$, so
$\lambda/d = (\pi/2)(c/v)$. The same slowness makes a compact moving body a point in its own radiation (sections 5.2 and 5.3) and the
magnetic part of a near field small: by the ratio $\sqrt3\,v_\perp/c$ of [R1](/tutorial/newton/reading-section-ii/#an-ideal-pixel-reads-ten-numbers-and-must-not-turn), a person walking at
$1.4\unit{m\,s^{-1}}$ across the line of sight gives a magnetic part $8.1\times10^{-9}$ of the tide
([section 7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)).
Waves shorter than a body a metre across need frequencies above $3\times10^8$ Hz, which only heat reaches:
$1.76\times10^{13}$ Hz at room temperature.

**Matter is tenuous.** The **compactness** of a body, $\mathcal C = G\matter M/Rc^2$, a pure number, measures how
strongly it curves space; $R$ is its radius in metres and $\sym{gravitational-constant}{G} =
6.674\times10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$. For the Earth, $G\matter M = 3.986\times10^{14}\unit{m^3\,s^{-2}}$
and $R = 6.371\times10^6$ m give $6.96\times10^{-10}$; the Sun's is $2.1\times10^{-6}$; a black hole that does not spin
has the radius $2G\matter M/c^2$ and so the compactness $\tfrac12$ (section 11.1). Matter is far from compact, so it is transparent and hot matter glows throughout. The **optical depth** $\sym{optical-depth}{\tau}$ is the
exponent by which matter dims a ray, a pure number. With the placeholder friction, a line through the Earth's
diameter has $\tau = 1.6\times10^{-30}$
([section 5.5](/tutorial/waves/radiance/#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line)), so each pixel adds the glow of its whole line. Short of a black hole, nothing makes a lens, a mirror, an absorber or a shadow: by
Peters's refractive index [@Peters1974], a steel lens a metre in radius and a metre thick focuses a 1 kHz wave at
$6.0\times10^{12}$ m, about Pluto's distance, and a lens that focuses by its own gravity, at $f/10$ and 5 cm in
radius, needs eleven and a half Moons' worth of mass
([section 5.5](/tutorial/waves/radiance/#matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact)).
So images must be computed: the array delays its records and adds them
([section 5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)).

## The capstone: which way it turns, with Part 5 alone

Three sealed steel boxes stand on a shelf, 4.5 m in front of a camera 1.5 m wide, 1.04 m apart, one above another. In
the top and middle boxes a pair of steel balls, 10 cm in radius with centres 0.44 m apart, turns once a second about an
axis pointing at the camera, the two pairs in opposite senses; the bottom pair is still.  We compute the picture in seven steps with the speed of light set to $20\unit{cm\,s^{-1}}$, so that the waves are
short enough for the array to resolve the boxes.

{{paper fig:which-way}}

![The three boxes with Part 5's numbers. (a) Side view, to scale: the wavelength of 10 cm, the near zone of 1.6 cm
(magnified twenty times in the inset), and the curvature of the fronts across the array, exaggerated tenfold. (b) What
the focused array sees: an Airy spot for each turning pair, 3.9° wide at half height with its first dark ring 4.7° from
its centre, green where the pattern turns clockwise as the camera sees it and magenta where it turns anticlockwise;
the still pair is dark. The arrows and the still pair's dots are schematic; the spots, the rings and the geometry are
exact.](tut-read-iii-capstone){#fig:read-iii-capstone}

**(a) The wavelength.** A turning pair looks the same after half a turn
([section 1.5b](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number)), so its wave has $f = 2$ Hz ([section 5.4](/tutorial/waves/polarization/#projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor)).
At the slowed speed of $0.20\unit{m\,s^{-1}}$ the wavelength is $0.20/2 = 0.10$ m (section 5.1).

**(b) The zone.** The near zone of each pair reaches $\lambda/2\pi = 1.6$ cm. The camera, 4.5 m away, is 283 times
farther, deep in the wave zone, so it receives a wave falling as $1/r$. The balls, 0.44 m apart, are 4.4 wavelengths
apart, so the pair is not a **compact source**, one much smaller than its wavelength (section 5.2); the figure
nevertheless gives it a compact source's polarization.

**(c) Focusing.** The shelf lies inside the array's **Fresnel zone**, the distances closer than about $D^2/\lambda =
1.5^2/0.10 = 22.5$ m, where the fronts from a source are curved across the array, here by 6.25 cm of path at its rim, so the array must be focused on the shelf
([section 5.3](/tutorial/waves/diffraction/#a-near-source-needs-the-delays-from-a-point)).

**(d) The spots.** Each turning pair makes an **Airy spot**, the bright disc and faint rings with which a round aperture draws a point.
Sections [3.6](/tutorial/noise/bessel-and-airy/#a-lens-draws-a-star-as-the-square-of-that-pattern)
and 5.3 give it a width of 3.9° at half height, with its first dark ring 4.7° from its centre. The pairs are seen 13.2° and 0.2° above the axis, so the rings do not touch.

**(e) The colours.** The middle pair's spin points at the camera, at the **inclination** $\sym{inclination}{\iota} =
0.2°$ between the spin and the line to the camera, so its pattern turns anticlockwise as the camera sees it and
$V/I = +1.000$: magenta. Here $V/I$ is the **degree of circular polarization**, the share of the wave that turns, positive for anticlockwise
([section 5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes)).
The top pair turns the other way, so its spin points away, at $\iota = 166.8°$; its $V/I$ is $-1$ to seven figures, and
its spot is green. The still pair's second moment is constant, so it sends no wave and its box is dark (section 5.4).

**(f) The true speed of light.** At $2.998\times10^8\unit{m\,s^{-1}}$ the wave of 2 Hz is $1.5\times10^8$ m long and $\lambda/D$ is $10^8$ radians: no
array resolves anything. The near zone ends 23,900 km out, and a camera 4.5 m from the shelf is $1.9\times10^{-7}$ of
the way to its edge. It reads the balls' changing Newtonian tide, and still reads which way each pair turns: seen along the axis, the tide's stretch across the line of sight lies along the
line of the two balls (section 1.4), so it turns with the pair. A camera beyond the near zone reads the same sense, because $V/I$ depends only on the
inclination, through the angular factors of section 5.4.

**(g) What the scene stretches.** The balls move at $v = \Omega d/2 = 2\pi\times0.22 = 1.38\unit{m\,s^{-1}}$, 6.9 times the slowed light, so the
power of a pair, derived for $v \ll c$ in section 7.7, would not hold. The scene keeps the wavelength, the zone, the
focusing, the spots and the colours, which Part 5 computes, and leaves the strength of the waves to Part 7.

::: try {#rotor-polarization}
This is the figure of section 5.4. The middle pair is the rotor face on, at an inclination of 0°; the top pair is the
rotor at about 167°. Predict first: how far must the middle pair's spin tilt before its spot is only half as deeply
magenta, with $V/I = \tfrac12$? Tilt the rotor to find out. Then predict the top pair's spot: its colour, and whether
its power is much less than face on. Set the inclination to 167°: the spot turns green, and the power stays at about
0.95 of face on.
:::

**The idea to keep: within $\lambda/2\pi$ of a source its field is the Newtonian one, and every mechanical motion of
everyday matter keeps us there; beyond, waves fall as $1/r$, show a compact source as a point, and carry its sense of
turning in their polarization. Matter's slowness and tenuousness decide what a gravitational camera can see.**

::: problems
### Practice

**[R5]** Why does everything that moves in daily life happen in the near field?

::: solution
Its waves, $c/f$ long, are thousands of kilometres long, and $\lambda/2\pi$ reaches far beyond any room: 47,700 km at
1 Hz, 1500 km for LIGO's rotor at 32 Hz.
:::



**[R5]** Rerun the capstone for an array 3 m wide and boxes 9 m away, with the same slowed light and the same pairs.
Find the camera's distance in near zones, the edge of the Fresnel zone $D^2/\lambda$, the first dark ring and the width
at half height, and say whether the colours change.

::: solution
The wavelength is still 0.10 m, so 9 m is 565 near zones away. The Fresnel zone reaches $3^2/0.10 = 90$ m, ten times
the distance, so the array must still be focused. The first dark ring lies $1.22\times0.10/3 = 0.041$ radians, 2.3°,
from each centre, and the width at half height is 1.97°. The colours do not change.
:::

### Stretch

**[R5]** A hot block at 1500 K, with the placeholder friction, glows most brightly at $f = 2.82\,\kB T/2\pi\hbar$. Where
is the edge of its near zone, and is a camera 5 m away in its wave zone?

::: solution
The peak is at $2.82\times1.381\times10^{-23}\times1500/6.626\times10^{-34} = 8.8\times10^{13}$ Hz, so
$\lambda/2\pi = 0.54$ µm, and a camera 5 m away is $9\times10^6$ near zones out: deep in the wave zone.
:::

### The camera

**[R5]** Reproduce the numbers of the regime map: the 300,000 km, the 48,000 km and 48 km, the "one sixth", the
$7\times10^{-10}$, and the frequencies of the thermal sources at 300 K, 3500 K and 15.7 MK.

::: solution
At 1 Hz, $\lambda/2\pi = 4.77\times10^7$ m; at 1 kHz, $4.77\times10^4$ m. For the Earth, $G\matter M/Rc^2 =
3.986\times10^{14}/(6.371\times10^6\times8.988\times10^{16}) = 6.96\times10^{-10}$. With $2\pi\hbar = 6.626\times
10^{-34}\unit{J\,s}$, $f$ is $1.76\times10^{13}$ Hz at 300 K, $2.06\times10^{14}$ Hz at 3500 K and
$9.2\times10^{17}$ Hz at 15.7 MK.
:::
:::

::: paper
- [Section III](/paper/#sec:regimes): the three regimes and the three facts.
- [](/paper/#eq:nearzone), Figure [](/paper/#fig:regimes) and Table [](/paper/#tab:regimes): the near zone, the sources
  and the regimes.
- [*Spin, speed and compactness*](/paper/#par:spin-speed-and-compactness): spin two, the near zone $\lambda/2\pi \sim L/(v/c)$ <!-- lint-allow: \sim -->
  and the compactness.
- [Section V](/paper/#sec:waves), [*What does not radiate*](/paper/#par:what-does-not-radiate): Figure
  [](/paper/#fig:which-way), worked in the capstone.
:::

::: deeper
- The [GR course, section 18.6](https://neovand.github.io/general-relativity/chapter-18.html#18-6-why-a-violently-breathing-sphere-still-does-not-radiate-tensor-waves)
  shows why a sphere that breathes, however violently, sends no waves.
- The [GR course, section 17.2](https://neovand.github.io/general-relativity/chapter-17.html#17-2-two-alarming-radii-two-very-different-problems)
  explains the radius at which a body's compactness reaches one half.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. III](/paper/#sec:regimes), with its equation
    [](/paper/#eq:nearzone), Figure [](/paper/#fig:regimes) and Table [](/paper/#tab:regimes); the three facts are in
    [*Spin, speed and compactness*](/paper/#par:spin-speed-and-compactness), and the capstone is the scene of
    [*What does not radiate*](/paper/#par:what-does-not-radiate) (Sec. V, Figure [](/paper/#fig:which-way)).

[^moon]: This is an upper bound: the Earth turns beneath a tide whose own pattern changes over 13.7 days
    ([section 5.2](/tutorial/waves/retarded-waves/#a-source-sends-its-news-outward-at-the-speed-of-the-wave)).

[^wheel]: A wheel turning steadily about its axle accelerates every part and sends nothing ([section 5.4](/tutorial/waves/polarization/#what-the-wave-of-a-rotor-cannot-show-and-what-does-not-radiate)).

