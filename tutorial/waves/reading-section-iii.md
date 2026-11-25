---
id: R5
title: 'Reading Section III, with the capstone: which way it turns'
question: "With Part 5 behind us, which of Section III's claims about the three regimes and the three facts can we now check for ourselves, and how far can Part 5 alone take one of the paper's wave scenes?"
part: '5'
requires: ['1.4', '1.5', '1.5b', 'R1', '2.7', '3.6', '3.7', '4.2', '5.1', '5.2', '5.3', '5.4', '5.5']
paper: [sec:regimes, eq:nearzone, fig:regimes, tab:regimes, eq:newton, eq:wave, sec:waves, eq:unresolved, eq:circular, fig:which-way, eq:diffraction]
figures: [fig:regimes, fig:which-way]
live: [regime-map, rotor-polarization]
---

The paper's Figure [](/paper/#fig:regimes), below, is a map with frequency across and distance up, both in powers of
ten. A diagonal line crosses it. Below the line sit the Moon's tide, an earthquake, a passing lorry, a person walking
and a rotor beside one of LIGO's mirrors; far to the right, above it, sit a warm object in the room, the Earth's
interior and the Sun's core. The plain words of [Section III](/paper/#sec:regimes) draw the lesson: "Everything in
daily life that moves mechanically therefore happens in the near field."[^daily] With Part 5 behind us, which of
Section III's claims about the three regimes and the three facts can we now check for ourselves, and how far can Part 5
alone take one of the paper's wave scenes?

This chapter reads Section III in order, one heading for each stretch of text: its plain words, the near-zone
condition [](/paper/#eq:nearzone), Figure [](/paper/#fig:regimes), Table [](/paper/#tab:regimes) and the paragraph
[*Spin, speed and compactness*](/paper/#par:spin-speed-and-compactness). As in
[R4](/tutorial/response/reading-section-iv-3/), each claim is marked *checked here*, *read now, derived in Part N*
or *stated in the paper*. The chapter ends with Part 5's capstone, the three sealed boxes of the paper's Figure
[](/paper/#fig:which-way). Figure [](#fig:read-iii-map) draws the five stretches in order.

{{paper fig:regimes}}

::: plain
Section III divides the space round every source of gravity into two regions. Close to a source, its pull follows the
source at once and weakens quickly with distance. Far away, the source is felt only through its waves, which weaken
slowly. The border lies at the wavelength divided by $2\pi$, about a sixth of a wavelength. Ordinary bodies move
slowly, so their waves are thousands of kilometres long, and everything that moves in a room is felt by its pull,
never by its waves. Only the jiggling of the atoms of warm matter is fast enough to send waves short enough for sharp
pictures.

The section then names one fact about gravity and two about matter. A pattern of stretch looks the same after half a
turn. Matter moves slowly compared with light. And matter is spread out, so that it barely bends, reflects or absorbs
gravitational waves. Part 5 has derived most of this. At the end of the chapter, Part 5's tools find the colours of
three spots in one of the paper's pictures, and with them the way two hidden pairs of balls turn.
:::

![The five stretches of Section III, in order, each with its equation number if it has one and the chapters that
teach it beneath. A filled box is checked here and the half-filled box holds claims of more than one kind; a dotted
chapter number marks a claim read now and derived later. All five meet in the capstone, which is Section V's
scene.](tut-read-iii-map){#fig:read-iii-map}

## The plain words hold, number by number, from the compass to the three facts

The [plain words](/paper/#sec:regimes) open with a magnet moved back and forth beside a compass. Close to the magnet
the needle follows it "almost at the same instant"; far away "the moving magnet is felt only through the radio waves
it sends out, and these grow weaker with distance". Chapter
[5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1)
found the same two pieces in the field of any changing source: a **near part**, which follows the source and falls
fast, and a **wave part**, which falls only as one over the distance (*checked here*). The **near field** is the region
where the near part wins. The **wave zone** is the region beyond it, where the field is a wave; the plain words call it
the far field.

"A wave whose frequency is $f$, meaning $f$ cycles each second, has a wavelength equal to the speed of light divided by
$f$." The **frequency** $\sym{frequency}{f}$ is in hertz, the **wavelength** $\sym{wavelength}{\lambda} = c/f$ is the
distance between crests, in metres, and $\sym{speed-of-light}{c} = 2.998\times10^8\unit{m\,s^{-1}}$
([5.1](/tutorial/waves/wave-equation/#a-plane-wave-is-a-turning-number-that-travels), *checked here*). "The near field
reaches out to about one sixth of a wavelength from the source (more exactly, the wavelength divided by $2\pi$)": the
fraction is $1/2\pi = 0.159$, against $0.167$ for a sixth (5.2, *checked here*). "Waves of one cycle a second are
300,000 kilometres long": they are 299,800 km long, so the near field reaches 47,700 km, the paper's "about 48,000";
at a thousand cycles a second it reaches 47.7 km, the paper's "about 48" (*checked here*).

"There the tide of a body follows the body almost at once, and it grows weaker quickly with distance (as one over the
distance cubed)." The **tide** is the difference in the pull of gravity from one place to the next, in
$\mathrm{s^{-2}}$. A mass $\matter M$ at the distance $r$ makes a tide of order $G\matter M/r^3$, and $2G\matter M/r^3$
along the line to it
([1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it), *checked
here*). "In the far field the tide is a wave, and it grows weaker much more slowly (as one over the distance)": this
is 5.2's wave part (*checked here*).

"Bodies that move as a whole … send out waves at the low frequencies at which they move": a turning pair sends them
at twice its turning rate, because it looks the same after half a turn (5.2, *checked here*). "Hot matter sends out
waves at the very high frequencies at which its atoms and molecules jiggle": heat is the random motion of atoms
([4.2](/tutorial/response/temperature/)), and the frequency of the glow is read [below](#every-body-that-moves-as-a-whole-lies-deep-inside-its-near-zone).

The three facts come last. *Gravity has spin two*: "a pattern of stretch and squeeze turned by half a circle looks
exactly as it did before". Chapter
[1.5b](/tutorial/newton/complex-numbers/#a-tide-across-a-direction-is-one-complex-number-and-turning-the-axes-turns-it-back-by-twice-the-angle)
wrote the shear of a tide as one complex number, which a turn of the axes by $\theta$ multiplies by $e^{-2i\theta}$; a
half turn gives $e^{-2\pi i} = 1$, while an arrow's $e^{-i\pi}$ is $-1$ (*checked here*). "It is the reason why a
pixel records ten numbers": the tide and its magnetic part are each a symmetric table with no trace, five numbers
apiece ([1.5](/tutorial/newton/five-numbers/), [R1](/tutorial/newton/reading-section-ii/#an-ideal-pixel-reads-ten-numbers-and-must-not-turn),
*checked here*). That spin two "shapes much of what a single pixel can measure" is Section VIII's claim: *read now,
derived in Part 9*.

*Matter moves slowly*, so "its near field reaches far beyond any room", checked in the next two sections. "The twisting
magnetic part of the tide is small near ordinary matter": by R1's ratio $\sqrt3\,v_\perp/c$, a person walking at
$1.4\unit{m\,s^{-1}}$ across the line of sight gives a magnetic part $8.1\times10^{-9}$ of the tide (*read now, derived
in Part 7*, chapter
[7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)).

*Matter is spread out.* "The ratio $GM/Rc^2$ of a body … measures how strongly the body curves space." This is the
**compactness** $\mathcal C = G\matter M/Rc^2$, a pure number, with $R$ the body's radius in metres and
$\sym{gravitational-constant}{G} = 6.674\times10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$. For the Earth, $G\matter M =
3.986\times10^{14}\unit{m^3\,s^{-2}}$ and $R = 6.371\times10^6$ m give $6.96\times10^{-10}$, the paper's "about
$7\times10^{-10}$" (*checked here*); the Sun's is $2.1\times10^{-6}$. "About one half for a black hole": a black hole
that does not spin has the radius $r_s = 2G\matter M/c^2$, so its compactness is exactly $\tfrac12$ (*read now, derived
in Part 11*, chapter 11.1). That matter "can neither bend, reflect nor block" the waves is 5.5's, read
[below](#one-property-of-gravity-and-two-small-numbers-of-matter-decide-what-the-camera-can-do).

## Within $\lambda/2\pi$ of a source the field is Newton's, and beyond it a wave

The text below the plain words begins: "What reaches a pixel depends on how the distance $r$ to the source compares
with the wavelength $\lambda = c/f$ of the radiation it would emit at frequency $f$. Inside the *near zone*,"

{{paper eq:nearzone}}

Chapter 5.2 derived the edge. Beside a source oscillating at the angular frequency $\omega = 2\pi f$, the slope of the
field has a near part falling as $1/r^2$ and a wave part $kr$ times larger, where $\sym{wavenumber}{k} = \omega/c =
2\pi/\lambda$ is the **wavenumber**, in $\mathrm{m^{-1}}$. The two are equal at $kr = 1$, that is at $r = \lambda/2\pi$
([5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1),
*checked here*). The $2\pi$ is there because a wavelength is a whole turn of the wave's phase, while the edge is where
the phase has turned by one radian.

"The field is the Newtonian one of Eq. [](/paper/#eq:newton), following the source almost instantaneously." The
small parameter is $kr$, the delay $r/c$ measured in radians of the source's cycle. Inside the near zone the slope of
the field matches the static slope of the source as it is now to a fraction of order $(kr)^2$, because the terms of
order $kr$ in the two parts cancel
([5.2](/tutorial/waves/retarded-waves/#inside-the-near-zone-the-field-is-the-static-field-of-the-source-as-it-is-now),
*checked here*). Equation [](/paper/#eq:newton) is Section II's statement that near slow matter the tide is the table
of second derivatives of Newton's potential, which chapter 1.4 derived (R1, *checked here*).

"Outside it the field is radiation, Eq. [](/paper/#eq:wave), falling off as $1/r$." The fall as $1/r$ is 5.2's (*checked
here*). Equation [](/paper/#eq:wave) itself, the tide of a wave as minus half the second time derivative of its strain,
is *read now, derived in Part 7* (chapter
[7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)). "At 1
Hz the near zone reaches to 48,000 km; at 1 kHz, to 48 km": $c/2\pi f$ is $4.77\times10^7$ m and $4.77\times10^4$ m
(*checked here*).

## Every body that moves as a whole lies deep inside its near zone

The caption of Figure [](/paper/#fig:regimes) says that "thermal sources are placed at the peak of their spectrum,
$f = 2.82\,k_BT/2\pi\hbar$". Here $\sym{temperature}{T}$ is the temperature in kelvins,
$\sym{boltzmann}{\kB} = 1.381\times10^{-23}\unit{J\,K^{-1}}$ is Boltzmann's constant and $\sym{hbar}{\hbar} =
1.055\times10^{-34}\unit{J\,s}$ the reduced Planck constant. The factor 2.82 is the root of $x = 3(1 - e^{-x})$. It
puts the peak of chapter 5.5's Planck radiance, the glow of an enclosure at the temperature $T$ in power per unit
frequency, at $\hbar\omega = 2.82\,\kB T$, in hertz and in radians per second alike (*read now, derived in Part 10*,
chapter 10.1). A body's own glow peaks there only if its friction is the same at every frequency, as is the paper's
**placeholder friction**, the constant $10^{-3}\unit{Pa\,s}$ that it uses as a reference for every glow
([4.4](/tutorial/response/viscosity/#at-fixed-stiffness-the-more-viscous-liquid-has-less-friction-at-the-frequencies-of-heat)).
The figure's thermal points assume it; real materials peak elsewhere. The table places every source as the paper's
figure script does, and recomputes how far out each lies in units of its near zone.

| Source | $f$ (Hz) | $r$ (m) | $r/(\lambda/2\pi)$ |
|---|---|---|---|
| Moon's tide | ${2.24\times10^{-5}}$ | ${3.8\times10^8}$ | ${1.8\times10^{-4}}$ |
| earthquake | $0.032$ | ${1.0\times10^6}$ | ${6.6\times10^{-4}}$ |
| passing lorry | $0.32$ | $32$ | ${2.1\times10^{-7}}$ |
| person walking | $1$ | $3.2$ | ${6.6\times10^{-8}}$ |
| LIGO's rotor | $32$ | $1.5$ | ${1.0\times10^{-6}}$ |
| warm object, 300 K | ${1.76\times10^{13}}$ | $3.2$ | ${1.2\times10^6}$ |
| Earth's interior, 3500 K | ${2.06\times10^{14}}$ | ${3.2\times10^6}$ | ${1.4\times10^{13}}$ |
| Sun's core, 15.7 MK | ${9.2\times10^{17}}$ | ${1.5\times10^{11}}$ | ${2.9\times10^{21}}$ |

Every mechanical source lies at less than a thousandth of the distance to the edge of its near zone, and every thermal
source at more than a million times that distance (*checked here*, given the peak). The earthquake row stands for its
gravity signal, and the rotor is the one that calibrates LIGO's detectors. The Moon's tide rises once every 12.4 hours,
so its near zone reaches $2.1\times10^{12}$ m, 14 astronomical units, beyond Saturn.[^moon] The arrow to "neutron stars
merging, $10^{12}$ times farther" points past the top of the chart, $10^{12}$ m, which we read as about $10^{24}$ m, a
hundred million light years. Their last waves are near 2 kHz, twice the frequency of their last orbits, so their near
zone ends 24 km from them and every camera receives them as waves (chapter
[12.1](/tutorial/sky/stars/#two-compact-bodies-spiral-together-and-the-papers-pair-has-nine-seconds-left)).

::: try {#regime-map}
Predict first, with the map's own question: a person sways once a second, 10 km from the camera. Is the camera in
the person's near field, or in the waves? Put the probe at 1 Hz and 10 km for the answer. Then press each source in
turn and read $r/(\lambda/2\pi)$ in the row "Near zone", against the last column of the table.

Now put the probe near the capstone's boxes: at 2 Hz, the frequency of a pair turning once a second, and at 5 m, the
nearest the probe goes to their 4.5 m. The map reads "near field", with $r/(\lambda/2\pi) = 2.1\times10^{-7}$
($1.9\times10^{-7}$ at 4.5 m exactly), because it uses the true speed of light. In the paper's
Figure [](/paper/#fig:which-way) light is slowed to 20 cm s⁻¹, $1.5\times10^9$ times slower, so the diagonal
$r = c/2\pi f$ would slide down by that factor, 9.2 powers of ten, and the same point would lie 283 times beyond it.
:::

## Sources of radiation divide again, and each regime has its own limit

"Sources of radiation divide again. Bodies in bulk motion radiate at the frequencies at which they move, which are
low; hot matter radiates at the frequencies of its molecular motion, which are very high." The map shows both halves
of the sentence: the first five rows of the table lie at or below 32 Hz, the last three above $10^{13}$ Hz (*checked
here*). This gives the three regimes of Table [](/paper/#tab:regimes), set out here with the
chapters that teach each limit.

| Regime | What the pixel receives | What limits the image | Taught in |
|---|---|---|---|
| near field | the changing Newtonian pull of nearby mass | blur grows with distance | 2.7, 3.7, R3; 5.2 |
| waves from bulk motion | radiation from accelerating bodies | a compact source is an unresolved point | 5.2, 5.3, 5.4; 7.7 |
| thermal glow | radiation from molecular motion | almost no gravitons arrive | 5.5; Part 8, Part 10 |

In the near field, fine detail fades on its way out, so the blur of the best picture is an angle, 24° at a
signal-to-noise ratio of a thousand ([3.7](/tutorial/noise/blur-law/), R3, *checked here*). In the wave zone, each
direction carries one ripple of the source, with its crests a wavelength apart along that direction. A source much
smaller than a wavelength looks the same to every such ripple, so every direction reads one number, the source added
up over its volume, and the source is a point
([5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source), *checked here*). An
array resolves no finer than about $\lambda/D$, with $D$ its width
([5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array), *checked
here*).[^wheel] The thermal glow is faint because matter barely absorbs, and so barely emits
([5.5](/tutorial/waves/radiance/#a-warm-bodys-glow-over-its-absorption-is-the-radiance-of-an-enclosure-at-its-temperature),
*checked here*); that "almost no gravitons arrive" needs the graviton, a quantum of the wave (*read now, derived in
Parts 8 and 10*, reading chapter R10b).

## One property of gravity and two small numbers of matter decide what the camera can do

The paragraph [*Spin, speed and compactness*](/paper/#par:spin-speed-and-compactness) restates the three facts.

*Gravity has spin two*: "curvature at a point is a symmetric trace-free tensor, and in a wave it is the square
$\mathbf m\mathbf m^T$ of a complex null vector $\mathbf m$, where the field of light is the vector itself." The
**null vector** is $\sym{null-vector}{\vect m} = (\vect e_1 + i\vect e_2)/\sqrt2$, with $\vect e_1$ and $\vect e_2$
unit vectors across the wave's direction; its dot product with itself is zero. Chapter
[1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero) showed that $\vect m$ has
spin one, and that the table $\vect m\vect m^{\mathsf T}$ is symmetric, has no trace and has spin two (*checked
here*). That a wave's whole field is a multiple of that table is *read now, derived in Part 9* (chapter 9.1), and so
are the uses the paper lists, from "the four principal null directions of a reading" to "the spin-two envelope of a
sparse array" (reading chapter R9b).

*Matter is slow*, "$v/c \ll 1$: this puts the edge of the near zone, $\lambda/2\pi \sim L/(v/c)$, far beyond any <!-- lint-allow: \sim -->
room". A body of size $L$ whose parts move at the speed $v$ changes in a time near $L/v$, so its angular frequency is
near $v/L$ and its near zone reaches $c/\omega \approx cL/v$ (*checked here*, as an estimate). For a person, $L$ near 1 m
and $v$ near $1\unit{m\,s^{-1}}$ give $3\times10^8$ m; the map's walking person, at 1 Hz, gives $4.8\times10^7$ m, the
same within the $2\pi$ that an estimate ignores. For the paper's turning pair, Section V's [](/paper/#eq:unresolved)
gives the ratio exactly: its waves have twice the turning rate $\Omega$, so $\lambda = 2\pi c/2\Omega = \pi c/\Omega$,
and its masses, a distance $d$ apart, move at $v = \Omega d/2$, so $\lambda/d = (\pi/2)(c/v)$ (*checked here*; the
waves' strength is chapter 7.7's).

The same slowness "makes every compact moving body a point in its own radiation" (5.2, 5.3, *checked here*), and
"makes the magnetic part of a near field small, so that it is at once a clean channel for waves and a range-finder for
moving mass" (*read now, derived in Parts 7 and 9*). "Only thermal motion reaches the frequencies at which the
wavelength is shorter than the body": a body a metre across would need waves above $3\times10^8$ Hz, and heat reaches
$1.76\times10^{13}$ Hz at room temperature (*checked here*).

*Matter is tenuous*, "its compactness $GM/Rc^2 \ll 1$: this makes it transparent, so that hot matter glows
throughout". The **optical depth** $\sym{optical-depth}{\tau}$ is the exponent by which matter dims a ray, a pure
number. With the placeholder friction, a line through the Earth's diameter has $\tau = 1.6\times10^{-30}$
([5.5](/tutorial/waves/radiance/#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line), *checked here*), so each
pixel adds the glow of everything on its line. The compactness "rules out lenses, mirrors, absorbers and shadows short
of a black hole". Given Peters's refractive index [](/paper/#eq:index), which is stated in the paper, a steel lens a
metre in radius and a metre thick focuses a 1 kHz wave at $6.0\times10^{12}$ m, about Pluto's distance. A lens that
focuses by its own gravity, at $f/10$ and 5 cm in radius, needs eleven and a half Moons' worth of mass packed inside it
([5.5](/tutorial/waves/radiance/#matter-makes-no-useful-lens-or-mirror-and-gravity-focuses-well-only-when-it-is-very-compact),
*checked here*). Hence "images must be computed": the array delays its records and adds them
([5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array), *checked
here*).

## The capstone: which way it turns, with Part 5 alone

Section V's paragraph [*What does not radiate*](/paper/#par:what-does-not-radiate) ends with the scene of the paper's
Figure [](/paper/#fig:which-way). Three sealed steel boxes stand on a shelf, their centres 4.5 m in front of a camera
1.5 m wide, and their centres 1.04 m apart, one above another. In the top and middle boxes a pair of steel balls,
10 cm in radius with centres 0.44 m apart, turns once a second about an axis pointing at the camera, the two pairs in
opposite senses; the bottom pair is still. The figure is "computed with the speed of light set to
$20\,\mathrm{cm\,s^{-1}}$". We follow it in seven steps, each with the chapter that supplies it. Figure
[](#fig:read-iii-capstone) draws the seven numbers on the scene.

{{paper fig:which-way}}

![The capstone's scene with Part 5's numbers. (a) Side view, to scale: the wavelength of 10 cm, the near zone of
1.6 cm (magnified twenty times in the inset), and the curvature of the fronts across the array, exaggerated tenfold,
which makes the array focus at the shelf because the shelf lies inside the Fresnel zone, which ends near 22.5 m.
(b) What the focused array sees: an Airy spot for each turning pair, 3.9° wide at half height with its first dark ring
4.7° from its centre, green where the pattern turns clockwise as the camera sees it and magenta where it turns
anticlockwise; the still pair is dark. The turning arrows and the still pair's dots are schematic; the spots, the
rings and the geometry are exact.](tut-read-iii-capstone){#fig:read-iii-capstone}

**(a) The wavelength.** A turning pair looks the same after half a turn
([1.5b](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number)), so its wave repeats twice
for each turn: $f = 2$ Hz ([5.4](/tutorial/waves/polarization/#projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor)).
At the slowed speed of $0.20\unit{m\,s^{-1}}$ the wavelength is $0.20/2 = 0.10$ m, the caption's 10 cm (5.1).

**(b) The zone.** The near zone of each pair reaches $\lambda/2\pi = 1.6$ cm. The camera, 4.5 m away, is 283 times
farther than that, deep in the wave zone, so what reaches it is a wave falling as $1/r$
([5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1)).
The pair, however, is wide for its wave. At this slowed light its balls, 0.44 m apart, are 4.4 wavelengths apart, so it
is not a **compact source**, one much smaller than its wavelength (5.2). As the paper says, the figure gives each pair
the polarization of a compact source, and the steps below follow the figure.

**(c) Focusing.** The shelf lies inside the array's **Fresnel zone**, the distances closer than about $D^2/\lambda =
1.5^2/0.10 = 22.5$ m, where the fronts from a source are curved across the array, here by 6.25 cm of path at its rim.
So the array must be focused on the shelf, as chapter
[5.3](/tutorial/waves/diffraction/#a-near-source-needs-the-delays-from-a-point) found for this scene.

**(d) The spots.** Each turning pair makes an **Airy spot**, the bright disc and faint rings with which a round
aperture draws a point. Chapters [3.6](/tutorial/noise/bessel-and-airy/#a-lens-draws-a-star-as-the-square-of-that-pattern)
and 5.3 found it 3.9° wide at half height, with its first dark ring 4.7° from its centre (the paper's
[](/paper/#eq:diffraction)). The pairs are seen 13.2° and 0.2° above the camera's axis, so the rings of the two spots
do not touch.

**(e) The colours.** The middle pair's spin points at the camera, at the **inclination** $\sym{inclination}{\iota} =
0.2°$ between the spin and the line to the camera, so its pattern turns anticlockwise as the camera sees it and
$V/I = +1.000$: magenta. Here $V/I$ is the paper's **degree of circular polarization**
[](/paper/#eq:circular), the share of the wave that turns, positive for anticlockwise
([5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes)).
The top pair turns the other way, so its spin points away, at $\iota = 166.8°$; its $V/I$ is $-1$ to seven figures,
and its spot is green. The still pair has a second moment that does not change, so it sends no wave and its box is
dark (5.4; chapter 7.7 derives it).

**(f) The true speed of light.** At $2.998\times10^8\unit{m\,s^{-1}}$ the wave of 2 Hz is $1.5\times10^8$ m long,
and $\lambda/D$ is $10^8$ radians: no array resolves anything. The near zone now ends 23,900 km out, so a camera
4.5 m from the shelf is $1.9\times10^{-7}$ of the way to its edge. It reads the balls' changing Newtonian tide, the near
field of Parts 2 and 3, not a wave. It still reads which way each pair turns. Seen along the axis, the tide's stretch
across the line of sight lies along the line of the two balls (1.4), so it turns with the pair (*checked here*). A
camera beyond the near zone reads the same sense in the polarization, because $V/I$ depends only on the inclination,
through the angular factors of [](/paper/#eq:rotor-amplitudes) that chapter 5.4 derived (*checked here*).[^caption]

**(g) What the scene stretches.** The balls move at $v = \Omega d/2 = 2\pi\times0.22 = 1.38\unit{m\,s^{-1}}$, the
paper's "1.4", which is 6.9 times the slowed light, the paper's "seven times faster". The power [](/paper/#eq:dumbbell)
assumes $v \ll c$ and "would not hold" (*stated in the paper*; chapter 7.7), and the pair is not compact, as step (b)
said. The scene keeps the wavelength, the zone, the focusing, the spots and the colours, which are the numbers Part 5
computes, and leaves the strength of the waves to Part 7.

::: try {#rotor-polarization}
This is chapter 5.4's figure, with a spot coloured as in the paper's Figure [](/paper/#fig:which-way). The middle
pair is the rotor face on, at an inclination of 0°; the top pair is the rotor at about 167°. Predict first, with the
figure's first question: how far must the middle pair's spin tilt before its spot is only half as deeply magenta, with
$V/I = \tfrac12$? Tilt the rotor to find out. Then predict the top pair's spot: what is its colour, and is its power
much less than face on? Set the inclination to 167°. The spot turns green, and the power stays at about 0.95 of face
on.
:::

So the slowed light makes the waves 10 cm long, the focused array draws each turning pair as a spot 3.9° wide, and
the colour of the spot, which does not depend on the speed of light, says which way the pair turns.

## The ledger: Section III's one equation is derived, and Part 5 reaches four more sections

Section III has one numbered equation and cites two of Section II's.

| Equation | What it says | After Part 5 | Where it is derived |
|---|---|---|---|
| [](/paper/#eq:nearzone) | the near zone is $r \ll \lambda/2\pi = c/2\pi f$ | derived | 5.2 |
| [](/paper/#eq:newton) | near slow matter, the tide is the Hessian of Newton's potential | derived | 1.4 |
| [](/paper/#eq:wave) | in a wave, the tide is $-\tfrac12\partial_t^2h^{\rm TT}_{ij}$ | read | 7.6 |

Part 5 has also derived ten equations of Sections V, VI, VII and IX, a few of them in a simpler form or as a sketch, in
chapters [5.1](/tutorial/waves/wave-equation/), [5.2](/tutorial/waves/retarded-waves/),
[5.3](/tutorial/waves/diffraction/), [5.4](/tutorial/waves/polarization/) and [5.5](/tutorial/waves/radiance/). Chapter
[5.6](/tutorial/waves/abel-transform/) derived Section IX's Abel transform [](/paper/#eq:abel) and its inverse
[](/paper/#eq:abel-inverse). Three that they use are still stated: the quadrupole formula and the pair's power, which
chapter 7.7 derives, and Peters's index. Reading chapter R7b reads Section V with Part 7's amplitudes, R10 and R10b
read Sections VI and IX, and R11 reads Section VII.

::: check
### Q

Why does everything that moves in daily life happen in the near field?

### A

Mechanical motions are slow, so their waves, $c/f$ long, are thousands of kilometres long or more, and $\lambda/2\pi$
reaches far beyond any room: 47,700 km at 1 Hz, 1500 km for LIGO's rotor at 32 Hz.

### Q

Why does the paper set the speed of light to 20 cm s⁻¹ for Figure which-way, and what does that change?

### A

It makes the waves 10 cm long, so that an array 1.5 m wide resolves the boxes. It rescales the wavelength and what
follows from it, the zone, the focusing and the spots; the sense of turning, $V/I$, does not depend on the speed of
light.

### Q

Which of Section III's three facts has Part 5 derived, and which are read?

### A

Matter being slow is derived through the near zone and the point source (5.2, 5.3). Spin two was derived for the tide
in 1.5b, and its wave form is read until Part 9. Transparency is derived in 5.5's optical depth and the failure of
lenses in its brief section, while the compactness of a black hole is read until 11.1.
:::

**The idea to keep: Section III follows from Part 5 and two facts about matter. Within $\lambda/2\pi$ of a source its
field is the Newtonian one, and every mechanical motion of everyday matter keeps us there; beyond, waves fall as
$1/r$, show a compact source as a point, and carry its sense of turning in their polarization. Matter's slowness and
its tenuousness, more than any instrument, decide what a gravitational camera can see.**

::: problems
### Practice

Rerun the capstone for an array 3 m wide and boxes 9 m away, with the same slowed light and the same pairs. Find the
camera's distance in near zones, the edge of the Fresnel zone $D^2/\lambda$, the first dark ring and the width at
half height, and say whether the colours change.

::: solution
The wavelength is still 0.10 m and $\lambda/2\pi = 1.6$ cm, so 9 m is 565 near zones away. The Fresnel zone reaches to
$3^2/0.10 = 90$ m, ten times the distance, so the array must still be focused. The first dark ring lies
$1.22\times0.10/3 = 0.041$ radians, or 2.3°, from each centre, and the width at half height is 1.97°. The colours do
not change: $V/I$ depends only on the inclination.
:::

### Stretch

Combine 5.2 with the peak of the thermal glow. A hot block at 1500 K, with the placeholder friction, glows most
brightly at $f = 2.82\,\kB T/2\pi\hbar$.
Where is the edge of its near zone, and is a camera 5 m away in its wave zone?

::: solution
The peak is at $2.82\times1.381\times10^{-23}\times1500/6.626\times10^{-34} = 8.8\times10^{13}$ Hz, so $\lambda =
c/f = 3.4$ µm and $\lambda/2\pi = 0.54$ µm. A camera 5 m away is $9\times10^6$ near zones out: deep in the wave zone,
by a factor of millions.
:::

### The paper

Reproduce every number of Section III and of the placements in Figure [](/paper/#fig:regimes): the 300,000 km, the
48,000 km and 48 km, the "one sixth", the $7\times10^{-10}$, and the frequencies of the thermal sources at 300 K,
3500 K and 15.7 MK.

::: solution
At 1 Hz, $\lambda = 2.998\times10^8$ m, 299,800 km, and $\lambda/2\pi = 4.77\times10^7$ m; at 1 kHz,
$4.77\times10^4$ m. The fraction $1/2\pi = 0.159$ is close to a sixth, 0.167. For the Earth, $G\matter M/Rc^2 =
3.986\times10^{14}/(6.371\times10^6\times8.988\times10^{16}) = 6.96\times10^{-10}$. With $2\pi\hbar = 6.626\times
10^{-34}\unit{J\,s}$, $f = 2.82\,\kB T/2\pi\hbar$ is $1.76\times10^{13}$ Hz at 300 K, $2.06\times10^{14}$ Hz at 3500 K
and $9.2\times10^{17}$ Hz at 15.7 MK, the figure's three thermal points. Every number agrees with the paper's
rounding.
:::
:::

::: paper
- [Section III](/paper/#sec:regimes), its plain words: the compass, the three regimes and the three facts.
- [](/paper/#eq:nearzone) and Figure [](/paper/#fig:regimes): the edge of the near zone and the placements of the
  sources.
- Table [](/paper/#tab:regimes): the three regimes and what limits each.
- [*Spin, speed and compactness*](/paper/#par:spin-speed-and-compactness): spin two as $\vect m\vect m^{\mathsf T}$,
  $\lambda/2\pi \sim L/(v/c)$ and the compactness. <!-- lint-allow: \sim -->
- [Section V](/paper/#sec:waves), [*What does not radiate*](/paper/#par:what-does-not-radiate): the slowed speed of
  light and Figure [](/paper/#fig:which-way), worked in the capstone.
:::

::: deeper
- The [GR course, section 18.6](https://neovand.github.io/general-relativity/chapter-18.html#18-6-why-a-violently-breathing-sphere-still-does-not-radiate-tensor-waves)
  shows why a sphere that breathes, however violently, sends no waves: the other side of the paper's "bodies that move
  as a whole".
- The [GR course, section 17.2](https://neovand.github.io/general-relativity/chapter-17.html#17-2-two-alarming-radii-two-very-different-problems)
  explains the radius at which a body's compactness reaches one half.
:::

[^daily]: The qualifier matters: the glow of a warm object in the room is not mechanical motion, and it reaches a
    camera as a wave, as the table below shows.

[^moon]: As the caption says, this placement is an upper bound. The rise comes from the Earth turning beneath the
    tide, whose own pattern changes over 13.7 days
    ([5.2](/tutorial/waves/retarded-waves/#a-source-sends-its-news-outward-at-the-speed-of-the-wave)).

[^wheel]: The table's "accelerating bodies" is shorthand that Section V fills in: a wheel turning steadily about its
    axle accelerates every part and sends nothing
    ([5.4](/tutorial/waves/polarization/#what-the-wave-of-a-rotor-cannot-show-and-what-does-not-radiate)).

[^caption]: The caption's last sentence says the same: "a camera in the room, deep inside their near zone, reads the
    Newtonian tide, whose stretch turns with each pair and still gives the sense of turning".
