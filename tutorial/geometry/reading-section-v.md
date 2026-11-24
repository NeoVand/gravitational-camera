---
id: R7b
title: 'Reading Section V, with the capstone: the sealed rotor'
question: "With Part 7 behind us, can we derive every claim of Section V about the waves of moving bodies, and what does one sealed rotor look like to a pixel beside it and to a camera far away?"
part: '7'
requires: ['5.2', '5.3', '5.4', 'R5', 'R7', '7.7', '7.8']
paper: [sec:waves, eq:quadrupole, eq:dumbbell, eq:unresolved, eq:wave-zone, eq:rotor-amplitudes, eq:circular, fig:quadrupole, fig:polarization, fig:which-way, eq:multipole]
figures: [fig:quadrupole, fig:polarization, fig:which-way]
live: [quadrupole, scene-which-way]
---

The plain words of the paper's [Section V](/paper/#sec:waves) put a number on how weak the waves of moving bodies are:
"Two masses of one kilogram each, one metre apart, spun sixteen times a second, send out a power of
$4.5\times10^{-41}$ watts." Reading chapter [R5](/tutorial/waves/reading-section-iii/) met such pairs in sealed boxes
and found which way they turn with Part 5's tools, leaving the strength of their waves to Part 7. With Part 7 behind
us, can we now derive every claim of Section V, and what does one sealed rotor look like to a pixel beside it and to a
camera far away?

This chapter reads Section V in order and derives nothing new. As in [R7](/tutorial/geometry/reading-section-ii-again/),
each claim gets the chapter that derived it and one mark: *checked here* (derived earlier, its numbers recomputed here),
*read now, derived in Part N*, or *stated in the paper*. The capstone then follows one rotor outward.

::: plain
Section V is about the gravitational waves that bodies send out when they move as a whole, and Part 7 has derived all
of it. A body sends waves only when the spread of its mass changes shape, and the strength of the wave is set by how
quickly the rate of that change itself changes. Even a fast-spinning dumbbell sends out so little power that a single
graviton, the smallest packet of wave energy, leaves it about once in fifteen years.

Everyday bodies move far more slowly than light, so their waves are millions of times longer than they are, and no
camera can see their shape: each is a single point. That point still shows which way it turns. Seen along the axis of a
rotor, the pattern of stretch in its wave turns in the same sense as the rotor. At the end, one sealed rotor is followed
from ten metres to ten thousand kilometres.
:::

<!-- diagram: tut-read-v-map — The sibling of R5's map (figs/tut-read-iii-map.js) and R7's (tut-read-ii-again-map): the
same box, type, tint, outline, dotted outline and grey arrows, laid out to be read at 390 px, about 560 × 330 px at
1440. Seven boxes, one for each stretch this chapter reads, in its order, four in the first row and three in the
second, joined in reading order by thin grey arrows. Above the first box a greyed box, "Parts 5 and 7", with an arrow
down into it. Each box carries the stretch's name and, as the site prints them, its equation and figure numbers; under
it the chapters that teach it; on a line of its own, in a small dotted box, a later chapter from which the box holds a
claim read now. (1) "Plain words" — 5.2, 5.4, 7.6, 7.7; dotted 8.3; lower half filled. (2) "Strain, power, dumbbell",
(27), (28) — 7.7, 7.8; dotted 8.3; lower half filled. (3) "A compact body is a point", (29) — 5.3, 7.7, filled. (4) "A
source larger than its wave", (30) — 5.2, 5.3, 7.7, filled. (5) "Polarization and the sense of turning", (31), (32),
"Fig. 15, Fig. 16" — 5.4, 7.7, 7.8, filled. (6) "What does not radiate" — 7.6, 7.7, filled.
(7) "The slowed light", "Fig. 17" — 5.2, 5.4, R5, filled. Below the second row, joined to all seven by one grey
bracket, a box with the orange outline and no fill: "Capstone: the sealed rotor, 10 m to 10⁴ km, on the axis and
edge-on". Labels inside the boxes, never on the arrows. Caption: "Look first at the filled boxes: every stretch of
Section V is now derived, in Part 5 or Part 7. A half-filled box also holds a claim read now, the graviton (8.3). All
seven stretches meet in the capstone." -->

## The plain words hold, from the four silent motions to the slowed light

The [plain words](/paper/#sec:waves) open with the rule that decides everything else. A body sends waves "only when the
lopsidedness of its mass, measured about its own centre, changes", and the measure of that lopsidedness is the
**quadrupole moment**. In the paper's equations it is the **second moment** $\sym{second-moment}{\matter I_{ij}} =
\int\matter\rho\,x_ix_j\,\dd V$, in $\mathrm{kg\,m^2}$, with $\matter\rho$ the density and the position $x_i$ measured
from the centre of mass. Chapter
[7.7](/tutorial/geometry/quadrupole-formula/#a-compact-source-is-read-at-zero-wavevector-where-its-stress-is-half-the-acceleration-of-its-quadrupole)
found that a small source radiates through the second time derivative of the part of $\matter I_{ij}$ across the
line of sight with no trace (*checked here*).

Every other claim of the plain words, from the four silent motions to the slowed light, returns in the main text and
is checked there, below.

## A compact source radiates through the acceleration of its quadrupole

After the plain words, the main text of Section V opens with the strain far from a small source:

{{paper eq:quadrupole}}

Here $\sym{tt-strain}{\field h^{\rm TT}_{ij}}$ is the wave's strain, a pure number, at the distance $r$ from the
source. The label TT keeps the part of a table that lies across the line of sight and has no trace, and $t - r/c$ is
the **retarded time**, the moment at which the source sent what arrives at the time $t$. Chapter 7.7 derived the
equation from the wave of any source, read [below](#only-a-source-larger-than-its-wave-shows-a-form), and the **tensor
virial identity**: the total stress inside an isolated source is half the second time derivative of its second moment
(*checked here*).[^wave-zone]

The source "radiates the power $P = (G/5c^5)\,\langle\dddot I_{ij}\dddot I_{ij}\rangle$, with the trace of $I_{ij}$
removed", where the three dots are three time derivatives and the brackets an average over a cycle. Chapter
[7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole) found it by
adding the wave's energy flux, its power per square metre, over a sphere, and chapter
[7.8](/tutorial/geometry/wave-energy/#the-heat-comes-from-the-wave-so-the-wave-carries-energy) derived that flux, so
every step to the power is now derived (*checked here*). For two masses $\matter m$ a distance $d$ apart, turning
about their centre at the angular velocity $\Omega$, in radians per second,

{{paper eq:dumbbell}}

(7.7, *checked here*). With $\matter m = 1$ kg, $d = 1$ m and $\Omega = 2\pi\times16 = 100.5\unit{s^{-1}}$, it gives
$P = 4.55\times10^{-41}$ W.[^rounding] A **graviton** is the smallest packet of energy that a gravitational wave of a
given frequency can carry, as a photon is for light (*read now, derived in Part 8*, chapter 8.3). The pair looks the
same after half a turn, so its waves have the angular frequency $2\Omega$, and a graviton of that wave carries
$2\hbar\Omega = 2.12\times10^{-32}$ J, where $\hbar = 1.055\times10^{-34}\unit{J\,s}$ is the reduced Planck constant.
One leaves every $4.66\times10^8$ s, or 14.8 years: "one graviton every fifteen years".

## A body far smaller than its wave shows no shape

The paragraph [*A compact body is a point*](/paper/#par:a-compact-body-is-a-point) compares the waves with their
source. They "have twice the rotation frequency, so their wavelength is $\lambda = \pi c/\Omega$, while the masses move
at $v = \Omega d/2$". Dividing the first by $d$ and using the second gives

{{paper eq:unresolved}}

(7.7, *checked here*). For the pair turning sixteen times a second, $\lambda = 9370$ km and $v = 50.3\unit{m\,s^{-1}}$,
so $\lambda/d = 9.4\times10^6$. A pair a metre across turning once a second has $v = 3.1\unit{m\,s^{-1}}$ and waves
$1.50\times10^8$ m long, the plain words' 150,000 kilometres.

The same holds, "up to a factor of order one", for any body whose parts move at the speed $v$ through distances like its
size $L$: it changes at a rate near $v/L$, so $\lambda/2\pi$ is near $L/(v/c)$, Section III's estimate
([R5](/tutorial/waves/reading-section-iii/#one-property-of-gravity-and-two-small-numbers-of-matter-decide-what-the-camera-can-do),
*checked here*, as an estimate). "No aperture can resolve an object much smaller than the wavelength" is chapter
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)'s limit, about
$\lambda/D$ radians for an aperture of width $D$ (*checked here*).

## Only a source larger than its wave shows a form

[*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave) gives the wave far from any source, "of
whatever size and speed":

{{paper eq:wave-zone}}

Here $\hat n$ is the unit vector from the source to the field point,[^n] $\omega$ the angular frequency, and
$\sym{tt-projector}{\Lambda_{ij,kl}}(\hat n)$ the **transverse trace-free projection**, which keeps the part of a table
across the line of sight $\hat n$ with no trace. The source enters through $\sym{stress-transform}{\matter{\tilde
T}_{kl}}$, the transform in time and space of its stress $\matter T_{kl}$, the momentum that crosses each square metre
each second, in pascals. The strain on the left is a transform in time too, so it is measured in seconds.

- Chapter
  [7.7](/tutorial/geometry/quadrupole-formula/#far-away-each-direction-reads-the-stress-at-one-wavevector) assembled
  the equation with every factor: 5.2's far field, 7.4's $16\pi G/c^4$ and 7.6's projector (*checked here*).
- In it "each direction carries one Fourier component of the stress, on the sphere $|\mathbf k| = \omega/c$", 5.2's
  ripple of one wavevector $\mathbf k$ (5.2, *checked here*).
- An aperture of width $D$ at the distance $r$ reads a cap of that sphere and sees "detail $\lambda r/D$" (5.3,
  *checked here*).
- "A compact source is the point $\mathbf k \to 0$", where the total stress is the virial identity's
  $\tfrac12\ddot{\matter I}_{kl}$, and the equation becomes the paper's [](/paper/#eq:quadrupole) (7.7, *checked
  here*).

The simplest source larger than its wave is many compact ones driven in step.

- The generators of a continental power grid "turn together over distances greater than the 3000 km wavelength of
  their waves". Rotors turning 50 times a second send waves at 100 Hz, which are $2.998\times10^8/100 = 3000$ km long
  ([5.2](/tutorial/waves/retarded-waves/#many-sources-in-step-add-their-amplitudes), *checked here*).[^grid]
- They send one rotor's wave times their **array factor**, "the sum $\sum_s e^{-i\phi_s - i\omega\hat
  n\cdot\mathbf x_s/c}$" over their positions $\mathbf x_s$ and phases $\phi_s$. Close together and in step, the
  amplitudes add and "$N$ rotors radiate $N^2$ times the power of one"; far apart, the powers add, "$N$ times". A
  thousand rotors in step send a million times one rotor's power (5.2, *checked here*).
- An aperture wide enough to resolve such a source "lies in its Fresnel zone, $D^2 \gg \lambda r$", the distances
  closer than about $D^2/\lambda$, where the fronts are still curved across the aperture. So the camera must use the
  delays from each point of the source ([5.3](/tutorial/waves/diffraction/#a-near-source-needs-the-delays-from-a-point), *checked here*).
- Two sources in step are told apart "once $D \gtrsim 1.4\,\lambda r/s$ for a separation $s$, against about $\lambda
  r/s$" out of step. With 5.3's test, a dip of a fifth (the brightness midway between the two images falls to 0.8 of
  their peaks), sources in step must be $1.43\,\lambda r/D$ apart and sources out of step $1.01\,\lambda r/D$
  ([5.3](/tutorial/waves/diffraction/#sources-in-step-blur-more-than-sources-out-of-step), *checked here*).[^criterion]

## The polarization of an unresolved rotor gives its sense of turning and its tilt

[*The polarization of an unresolved source*](/paper/#par:the-polarization-of-an-unresolved-source) says that "along the
axis of rotation it is strongest and circularly polarized, with the handedness of the rotation; in the plane of rotation
it is eight times weaker and linearly polarized". The **polarization** of a wave is the way its pattern of stretch is
oriented and changes during each cycle (5.4). The angle between the rotor's spin and the direction from the rotor to
the camera is the **inclination** $\sym{inclination}{\iota}$. Chapter
[5.4](/tutorial/waves/polarization/#the-rotor-shines-eight-times-less-edge-on) found the power sent toward $\iota$,
relative to the power along the axis, to be $(1 + 6\cos^2\iota + \cos^4\iota)/8$, panel (a) below. Edge-on it is
$\tfrac18$: the amplitude is halved, which quarters the power, and one of the two polarizations is gone, which halves it
again (*checked here*). Averaged over the sky the curve is $\tfrac25$, so the total power is $\tfrac85\pi r^2$ times the
flux on the axis at the distance $r$, which with 7.8's flux gives the paper's [](/paper/#eq:dumbbell) again.

{{paper fig:quadrupole}}

Panel (b) is the paper's [](/paper/#eq:unresolved) against the speed of the moving parts (7.7).
[*The sense of turning*](/paper/#par:the-sense-of-turning) then gives the two polarizations at twice the rotation
frequency, the plus and cross patterns of chapter 7.6:

{{paper eq:rotor-amplitudes}}

Here $\sym{rotor-amplitude}{\field A}$ is the strain seen face on, a pure number, and
$\sym{moment-difference}{\matter{\Delta I}}$, in $\mathrm{kg\,m^2}$, is "the difference between the two principal
moments of inertia in the plane of rotation". The pair's second moment has the principal values, its eigenvalues,
$\tfrac12\matter md^2$ along the rod and zero across it, and their difference has the same size as the paper's. Chapter
[5.4](/tutorial/waves/polarization/#projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor)
showed this, and derived the two angular factors and the quarter cycle between them by projecting the turning second
moment onto the sky, with its first axis along the spin's shadow, the part of the spin that lies across the line of
sight. Chapter
[7.7](/tutorial/geometry/quadrupole-formula/#seen-along-its-spin-a-rotors-two-polarizations-share-one-amplitude) derived
$\field A$ (*checked here*).[^axes] The **Stokes parameters** $I$ and $V$ of 5.4 measure the wave's whole strength and
its anticlockwise part minus its clockwise part, and neither changes when the camera turns its axes:[^stokes]

{{paper eq:circular}}

This ratio is the **degree of circular polarization**, a pure number between $-1$ and 1
([5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes),
*checked here*). For the rotor it is $+1$ at $\iota = 0$, 0.976 at 60°, 0 edge-on and $-1$ at 180°. Its sign is "the
sense in which the rotor itself appears to turn", and its size gives the tilt, finely only near edge-on: at 30° it
differs from 1 by $5\times10^{-5}$.

{{paper fig:polarization}}

::: try {#quadrupole}
The paper's Figure [](/paper/#fig:quadrupole), with the speed of the moving parts on a slider. On the right one
wavelength is drawn beside the source, to the same scale, with their ratio.

Before you touch anything, answer the predictions: at the sixteen-turn pair's 50 m/s, how many times its own size is
its wavelength? At the slider's end, two-thirds of light's speed, is the wavelength still longer than the source? Then
read the ratio at both speeds and compare it with the paper's [](/paper/#eq:unresolved). The power curve on the left
keeps a slow source's shape at every speed: that is the figure's choice, since its formula holds only for slow
sources.
:::

## Shear and lopsided motion radiate, and pressure does not

[*What does not radiate*](/paper/#par:what-does-not-radiate) opens: "The source of the wave field is the part of the
stress that is transverse to the line of sight and has no trace", the projector of the paper's [](/paper/#eq:wave-zone)
(7.7, *checked here*).

- Steady motion "radiates nothing: its quadrupole grows, but with a constant second derivative". Chapter
  [7.6](/tutorial/geometry/gravitational-waves/#a-body-in-steady-motion-sends-no-wave-and-neither-does-an-even-pressure)
  found it by relativity: a body moving steadily is a body at rest seen by a moving observer, so its field falls as
  $1/r^3$, with no part falling as $1/r$ (*checked here*).[^steady]
- Anything "that keeps spherical symmetry, however violently it pulsates", has the second moment
  $\tfrac13\delta_{ij}\int\matter\rho\,r^2\,\dd V$ at every instant, which is pure trace, and the projector removes it
  (7.7, *checked here*).
- "A wheel turning steadily about its axis of symmetry" puts an identical piece of itself in the place of each piece,
  so its second moment does not change (7.7, *checked here*).
- The last case is "a pressure that is the same in all directions", which "is pure trace: it is removed exactly by the
  projection". Its stress is $\matter p\,\delta_{kl}$, and $\Lambda_{ij,kl}\delta_{kl} = 0$ exactly (7.6, *checked
  here*), so a sealed box of gas whose pressure rises and falls evenly sends nothing at all. The paper adds that it has
  "verified numerically" the statement (*stated in the paper*).[^projection]

"The camera sees shear and lopsided motion, not pressure." In chapter
[7.7](/tutorial/geometry/quadrupole-formula/#a-compact-source-is-read-at-zero-wavevector-where-its-stress-is-half-the-acceleration-of-its-quadrupole)'s
rotor, the rod's tension, $\tfrac12\matter m\Omega^2d^2$ over its length, counts as much as the flow of momentum
carried by the masses.

## Slowing light to twenty centimetres a second makes each rotor a spot

A pair turning once a second "radiates waves $150{,}000\,\mathrm{km}$ long, and a room is deep inside their near zone".
The **near zone**, where the field follows the source almost at once, reaches $\lambda/2\pi = 23{,}900$ km
([5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1),
*checked here*). So the paper's Figure [](/paper/#fig:which-way) sets the speed of light, "and of gravity with it", to
$0.20\unit{m\,s^{-1}}$. A pair turning once a second sends waves at 2 Hz, $0.20/2 = 0.10$ m long, the paper's ten
centimetres (R5, *checked here*). The figure's balls, 0.44 m apart, move at $\Omega d/2 = 1.38\unit{m\,s^{-1}}$, the
paper's 1.4, which is 6.9 times the slowed light, "seven times faster". The paper's [](/paper/#eq:dumbbell) assumes $v
\ll c$, so it "would not hold" (7.7, *checked here*).[^rescales] "The polarization … does not depend on the speed of
light": by the paper's [](/paper/#eq:rotor-amplitudes), $V/I$ depends only on the inclination (5.4, *checked
here*, for a compact source).

{{paper fig:which-way}}

Reading chapter [R5](/tutorial/waves/reading-section-iii/#the-capstone-which-way-it-turns-with-part-5-alone) worked
this figure, spot by spot. At the true speed of light the waves are the 150,000 km found above, "and nothing is
resolved" (R5, *checked here*).[^caption]

::: try {#scene-which-way}
The three sealed boxes, in ordinary light on the left and in the slowed waves on the right. Magenta marks a pattern of
stretch that turns anticlockwise as the camera sees it, $V/I > 0$, and green one that turns clockwise.

Before you touch anything, answer the predictions: which box stays dark in the waves, and why do the other two take
opposite colours? Then drag the divider across the shelf and compare the two views box by box.
:::

## The capstone: one sealed rotor, from beside it to far away

The rotor is Section V's own: two 1 kg masses at the ends of a light rod 1 m long, turning sixteen times a second
inside a sealed steel box, anticlockwise as seen from above. In ordinary light a camera sees only the closed box, but no
wall screens gravity ([0.2](/tutorial/evening/through-walls/)). We follow the rotor outward in eight steps: first along
a line in its plane, then up its axis, and last back in its plane, far away.

**(a) Its waves.** Its moment difference is $\matter{\Delta I} = \tfrac12\matter md^2 = 0.5\unit{kg\,m^2}$. Its
waves have $2\times16 = 32$ Hz, so $\lambda = 9370$ km and the near zone reaches $\lambda/2\pi = 1490$ km (5.2, 7.7).

**(b) A pixel 10 m away, in the rotor's plane.** Deep in the near zone, it reads Newton's changing tide of the masses
where they are now. Its tide along the spin, at right angles to the plane, is
$\curv\tE_{zz} = \tfrac{15}4G\matter{\Delta I}/r^5 = 1.25\times10^{-15}\unit{s^{-2}}$ in amplitude, swinging at 32 Hz:
about a ten-millionth of the person's $9.3\times10^{-9}\unit{s^{-2}}$ at a metre. This is 7.7's
[all-zone solution](/tutorial/geometry/quadrupole-formula/#one-solution-runs-from-newtons-pull-near-the-source-to-the-wave-far-away)
close to the source, where it becomes Newton's tide of a quadrupole
([2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)).[^present]
The box's steady pull does not change, so the pixel removes it together with the steady pull of the room.

**(c) Its magnetic part, in the plane.** The changing magnetic part is smaller than the changing tide by about $kr =
6.7\times10^{-6}$, where $k = 2\pi/\lambda$ is the wavenumber
([7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)'s
estimate). The all-zone solution gives its size, the square root of the sum of the squares of
its entries (7.5): $|\curv\tB| = 9.8\times10^{-21}\unit{s^{-2}}$, which is $1.17\,kr$ times step (b)'s
$\curv\tE_{zz}$.[^kr] Two gyroscopes a metre apart would read it, turning relative to each other at no more than
$|\curv\tB|\times1\,\mathrm m/c = 3\times10^{-29}$ radians a second
([7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)),
about $5\times10^{-15}$ of the frame dragging that Gravity Probe B measured.

**(d) Where the wave takes over, in the plane.** Newton's changing tide $\curv\tE_{zz}$, falling as $r^{-5}$, and the
wave's, falling as $r^{-1}$, are equal at $0.313\lambda = 2930$ km (7.7).

**(e) A camera $10^4$ km away, on the axis.** On the axis the near tide and the wave's tide are equal closer in, at
$0.21\lambda = 1970$ km (7.7), so this camera, about one wavelength out, reads the wave. Its two strains are $\field h_+
= \field h_\times = \field A = 1.7\times10^{-47}$, a quarter cycle apart, $10^{-26}$ of the strains LIGO detects. A
wave's tide is minus half the second time derivative of its strain
([7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)), so
each entry of the tide swings at up to $\tfrac12(2\Omega)^2\field A = 2\Omega^2\field A =
3.4\times10^{-43}\unit{s^{-2}}$, the largest stretch. The size of the whole table is $\sqrt2$ times that, $|\curv\tE| =
4.8\times10^{-43}\unit{s^{-2}}$, and the magnetic part's is the same, $|\curv\tB| = |\curv\tE|$ (7.6). The pattern of
stretch turns with the rotor, so $V/I = +1$ for this camera above it, which sees the rotor turn anticlockwise (5.4).

**(f) Its energy.** The rotor sends $4.55\times10^{-41}$ W in all. On the axis at $10^4$ km the flux is
$c^3(2\Omega)^2\field A^2/16\pi G = 9.1\times10^{-56}\unit{W\,m^{-2}}$
([7.8](/tutorial/geometry/wave-energy/#the-heat-comes-from-the-wave-so-the-wave-carries-energy)), which is
$P/1.6\pi r^2$, as 5.4's power pattern requires.

**(g) Its gravitons.** One leaves the rotor every 14.8 years. A square metre on the axis at $10^4$ km catches one
every $7.4\times10^{15}$ years, half a million times the age of the universe (*read now, derived in Part 8*).

**(h) A camera $10^4$ km away, edge-on.** Back in the rotor's plane at the same distance, beyond the crossover of step
(d), the camera reads a pattern of stretch that only pulses along a fixed line: $\field h_+ = \field A/2 =
8.3\times10^{-48}$ and $\field h_\times = 0$, so $V/I = 0$ and the wave is linearly polarized. Its power is $\tfrac18$
of that on the axis (5.4). This camera finds the plane in which the rotor turns, but not which way it turns.

So a camera far away reads the rotor's sense of turning and the tilt of its axis from the polarization, without ever
resolving it. The pixel beside it reads the shape of its mass in the near field. The rotor's whole power crosses a
sphere of radius 10 m too, but there the wave's share of the tide in the plane is $(kr)^4/15 = 1.3\times10^{-22}$ of it,
about $1.7\times10^{-37}\unit{s^{-2}}$, far too small to pick out.

<!-- diagram: tut-read-v-capstone — One figure in eight small panels, (a) to (h), two rows of four at 1440 (about 680 ×
380 px) and four rows of two on a phone, in the paper's palette, each panel with its one number beneath it in the
caption's type. (a) The rotor seen from above (two filled balls, matter colour, on a thin rod, curved arrow
anticlockwise) beside one cycle of a 32 Hz sine, "λ = 9370 km". (b) The pixel as a ring of twelve free balls 10 m from
the rotor in its plane, the ring standing upright and facing the rotor so that the spin's direction (vertical) lies in
it, stretched (orange) along the spin and squeezed (blue) across it, its oval drawn twice, at two moments half a cycle
apart (stretched upright in one, squeezed upright in the other), "𝓔_zz = 1.25 × 10⁻¹⁵ s⁻²". (c) Two gyroscopes a
metre apart beside the ring, each a small disc with an axis, one turned by a barely visible tick, "|𝓑| = 9.8 × 10⁻²¹
s⁻²". (d) 7.7's log–log crossover plot in miniature (tut-crossover): the near law r⁻⁵, the wave law r⁻¹ and the exact
curve in the curvature colour, an open circle at "2930 km, in the plane". (e) The camera on the axis: its ring face on,
its stretch axis drawn at three moments, turning anticlockwise with a curved arrow, filled magenta, "A = 1.7 × 10⁻⁴⁷,
V/I = +1". (f) A small square of wave front with arrows through it beside 5.4's power curve (the dumbbell-shaped polar
plot), "9.1 × 10⁻⁵⁶ W m⁻²". (g) A counter reading "1" with a clock face labelled "14.8 years". (h) The edge-on camera at
the same distance in the plane: its ring pulsing along one fixed line, drawn at two moments half a cycle apart, no
fill, "h₊ = A/2 = 8.3 × 10⁻⁴⁸, V/I = 0". No orange or blue except for stretch and squeeze in (b), (e) and (h). Labels
beside the geometry, never on a line. Caption: "Look first at panels (b) and (e): the same rotor gives a pixel 10 m
away the changing Newtonian tide of its masses, and a camera 10⁴ km away on its axis a wave whose turning pattern shows
which way the rotor turns; edge-on, in (h), the pattern only pulses. Rings, gyroscopes and counter schematic; the
curves of (d) and (f) exact." -->

## The ledger: all six of Section V's equations are derived

| The paper's equation | What it says | After Part 7 | Where it is derived |
|---|---|---|---|
| [](/paper/#eq:quadrupole) | a compact source's strain | derived | 7.7 |
| [](/paper/#eq:dumbbell) | the dumbbell's power | derived | 7.7, with 7.8's flux |
| [](/paper/#eq:unresolved) | $\lambda/d = (\pi/2)(c/v)$ | derived | 7.7 |
| [](/paper/#eq:wave-zone) | the wave of any source | derived | 5.2; 7.7 |
| [](/paper/#eq:rotor-amplitudes) | the rotor's two amplitudes | derived | 5.4; 7.7 |
| [](/paper/#eq:circular) | the circular fraction $V/I$ | derived | 5.4 |
| Section XI's [](/paper/#eq:multipole) | the all-zone field, used in the capstone | stated, from Thorne | 7.7 |

Every number of the section is recomputed, and only the graviton waits, for chapter 8.3. With R7, Part 7 has read
Sections II and V in full.

::: check
### Q

Why is a pixel ten metres from the rotor in its near zone, and what does it read?

### A

The rotor's waves are 9370 km long, so its near zone reaches $\lambda/2\pi = 1490$ km. Ten metres is deep inside, so
the pixel reads Newton's changing tide of the masses where they are now, $1.25\times10^{-15}\unit{s^{-2}}$ at 32 Hz.

### Q

What single property of a source decides whether it radiates?

### A

Whether the part of its second moment across the line of sight, with no trace, has a changing second time
derivative. Steady motion, a pulsating sphere and a smooth wheel fail the test, and an even pressure has no such part.

:::

**The idea to keep: Section V follows from Parts 5 and 7. A compact source radiates through the changing, transverse,
trace-free part of its quadrupole, so slow bodies are points in their own waves, and their sense of turning survives
in the polarization. One rotor shows both regimes: beside it a pixel reads Newton's pull of the masses as they are now,
and far away a camera reads a wave.**

::: problems
### Practice

Rerun Section V's chain for a dumbbell of two 10 kg masses 2 m apart, turning five times a second: the power, the
wavelength, $\lambda/d$, the amplitude times the distance, $\field Ar$, and the years between gravitons.

::: solution
With $\Omega = 31.4\unit{s^{-1}}$, the paper's [](/paper/#eq:dumbbell) gives $P = 6.8\times10^{-41}$ W: $\matter
m^2d^4$ is 1600 times the 1 kg pair's, and $\Omega^6$ a 1100th. The 10 Hz waves are 30,000 km long, so
$\lambda/d = 1.5\times10^7$. With $\matter{\Delta I} =
20\unit{kg\,m^2}$, $\field Ar = 4G\matter{\Delta I}\Omega^2/c^4 = 6.5\times10^{-40}$ m. A graviton carries $2\hbar\Omega
= 6.6\times10^{-33}$ J, so one leaves every 3.1 years.
:::

### Stretch

Combine 7.5 and 7.7. At 10 m from the rotor, compare the estimate $kr$ for the changing magnetic part over the changing
tide with 7.5's static ratio $\sqrt3\,v/c$ for a mass crossing the line of sight at the balls' $50\unit{m\,s^{-1}}$.

::: solution
Here $kr = 6.7\times10^{-6}$, while $\sqrt3\,v/c = \sqrt3\times50.3/2.998\times10^8 = 2.9\times10^{-7}$. The changing
part's ratio is 23 times larger, because $kr = (v/c)(4r/d)$ carries the distance over the size of the rotor, as
Section VIII says: "more than $v/c$, but still far below one in the near zone".
:::

### The paper

The power sent toward the inclination $\iota$ is in proportion to $\field h_+^2 + \field h_\times^2$. From the paper's
[](/paper/#eq:rotor-amplitudes), find the inclination at which the rotor sends half the power it sends along its axis,
and the paper's [](/paper/#eq:circular) there. What does the answer say about reading the tilt?

::: solution
$\field h_+^2 + \field h_\times^2 = \field A^2(1 + 6\cos^2\iota + \cos^4\iota)/4$, which is $2\field A^2$ on the axis.
Half the power needs $\cos^4\iota + 6\cos^2\iota - 3 = 0$, so $\cos^2\iota = 2\sqrt3 - 3 = 0.464$ and $\iota = 47°$.
There $\field h_+^2 + \field h_\times^2 = \field A^2$, so $V/I = (1 + \cos^2\iota)\cos\iota = 0.997$. Half the power has
gone, but $V/I$ has fallen by only 0.3 per cent, so its size measures the tilt finely only near edge-on, as Figure
[](/paper/#fig:polarization) shows.
:::
:::

::: paper
- [Section V](/paper/#sec:waves): the paper's equations [](/paper/#eq:quadrupole) to [](/paper/#eq:circular), all
  derived.
- [*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave): the power grid and the coherent
  penalty.
- [*The sense of turning*](/paper/#par:the-sense-of-turning) and Figures [](/paper/#fig:quadrupole) and
  [](/paper/#fig:polarization): the polarization of an unresolved rotor.
- [*What does not radiate*](/paper/#par:what-does-not-radiate): the silent motions and Figure [](/paper/#fig:which-way).
:::

::: deeper
- The GR course's [section
  18.8](https://neovand.github.io/general-relativity/chapter-18.html#18-8-a-real-event-that-turned-these-symbols-into-data)
  sets the quadrupole formula against the first wave ever detected, from two black holes merging.
- K. S. Thorne, "Gravitational radiation", in *300 Years of Gravitation*, ed. S. W. Hawking and W. Israel (Cambridge,
  1987): the physics of Section V at full length.
:::

[^wave-zone]: The paper says "outside the near zone"; the formula holds in the wave zone, $r \gg \lambda/2\pi$, since
    near $\lambda/2\pi$ the terms in $1/r^2$ and $1/r^3$ are as large as the wave's (7.7).

[^rounding]: The paper's 4.5 should read 4.6, since the formula gives $4.552\times10^{-41}$ W (7.7).

[^n]: As in Section XI; elsewhere the paper's $\hat n$ points from the pixel toward the source.

[^grid]: The paper says only that the generators "turn in step". Turning 50 times a second, as on a 50 Hz grid, holds
    for two-pole machines. Four-pole machines turn 25 times a second and would give 6000 km, and only through their
    flaws, since a perfect four-fold rotor sends no wave.

[^criterion]: The paper names no criterion. With Sparrow's, which asks only that a dip appear, or with a round
    aperture, the factor lies between 1.4 and 1.6 (5.3).

[^axes]: The paper does not state the handedness of the axes or the origin of the phase, on which the sign of
    $\field h_\times$ depends; 5.4 takes $\vect e_1\times\vect e_2 = \hat n$. The sign of $V$ is fixed in words.

[^stokes]: The paper uses $I$ and $V$ without defining them for a gravitational wave. Chapter 5.4 defines all four,
    $I$, $Q$, $U$ and $V$, from the two polarizations.

[^steady]: The quadrupole formula about a fixed origin stops applying once the body has moved far from it; the
    argument from relativity does not.

[^projection]: The projector that acts on the stress is the one in the paper's [](/paper/#eq:wave-zone); the paper
    cites its [](/paper/#eq:quadrupole) instead.

[^rescales]: The paper says the change "rescales the wavelength and nothing else". It also makes the balls faster than
    the slowed light and the pair 4.4 wavelengths across, no longer compact, so the figure gives it a compact source's
    $V/I$ by choice (R5).

[^caption]: The caption's "the polarization still gives the sense of turning" holds beyond the near zone. At the true
    speed of light a camera in the room reads the sense of turning from the near tide, whose stretch turns with each
    pair (R5).

[^present]: Section VIII says that the first-order delay cancels "because mass and momentum are conserved". At first
    order mass alone suffices, and momentum removes part of the next term (7.7).

[^kr]: Between the whole tables, measured by their sizes, the ratio $|\curv\tB|/|\curv\tE|$ is $0.31\,kr$ in the plane
    and $kr$ on the axis.
