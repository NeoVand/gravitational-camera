---
id: R7b
title: 'Waves from moving bodies'
question: "What does the wave of a moving body look like to a pixel beside it and to a camera far away, and what does it say about the way the body turns?"
part: '7'
requires: ['5.2', '5.3', '5.4', 'R5', 'R7', '7.7', '7.8']
paper: [sec:waves, eq:quadrupole, eq:dumbbell, eq:unresolved, eq:wave-zone, eq:rotor-amplitudes, eq:circular, fig:quadrupole, fig:polarization, fig:which-way, eq:multipole]
figures: [fig:quadrupole, fig:polarization, fig:which-way]
live: [quadrupole, scene-which-way]
---

Two masses of one kilogram each, one metre apart and spun sixteen times a second, send out a power of
$4.55\times10^{-41}$ watts. How does such a rotor look to a pixel beside it and to a camera far away?[^waves]

::: plain
A body sends waves only when the spread of its mass changes shape, and a fast-spinning dumbbell sends so little that a
single graviton, the smallest packet of wave energy, leaves it about once in fifteen years. Everyday bodies move far
more slowly than light, so their waves are millions of times longer than they are, and no camera can see their shape.
Yet seen along its axis, the pattern of stretch in a rotor's wave turns in the same sense as the rotor.
:::

## A compact source radiates through the acceleration of its quadrupole

A body's lopsidedness is measured by its **second moment**
$\sym{second-moment}{\matter I_{ij}} = \int\matter\rho\,x_ix_j\,\dd V$, in $\mathrm{kg\,m^2}$, with $\matter\rho$ the
density and $x_i$ measured from the centre of mass; its trace-free part is the **quadrupole moment**. Beyond the near
zone, $r \gg \lambda/2\pi$, a source small compared with its wave sends the strain

$$\field h^{\rm TT}_{ij}(t, r) = \frac{2G}{c^4 r}\,\ddot{\matter I}{}^{\rm TT}_{ij}\!\Bigl(t - \frac rc\Bigr),$$

which section 7.7 derived from the wave of any source and the **tensor virial identity**: the total stress inside an
isolated source is half the second time derivative of its second moment. Here
$\sym{tt-strain}{\field h^{\rm TT}_{ij}}$ is the strain, a pure number; TT keeps the part of a table across the line
of sight with no trace; and $t - r/c$ is the **retarded time**, the moment at which the source sent what arrives at
$t$.[^quad]

Adding the wave's energy flux
([7.8](/tutorial/geometry/wave-energy/#the-heat-comes-from-the-wave-so-the-wave-carries-energy)) over a sphere
([7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole)) gives
$P = (G/5c^5)\,\langle\dddot{\matter I}_{ij}\dddot{\matter I}_{ij}\rangle$, with the trace of $\matter I_{ij}$
removed, where the three dots are three time derivatives and the brackets an average over a cycle. For two masses
$\matter m$ a distance $d$ apart, turning about their centre at the angular velocity $\Omega$, in radians per second,

$$P = \frac85\,\frac{G\matter m^2d^4\,\Omega^6}{c^5}.$$

With $\matter m = 1$ kg, $d = 1$ m and $\Omega = 2\pi\times16 = 100.5\unit{s^{-1}}$ the power is
$P = 4.55\times10^{-41}$ W. A **graviton** is the smallest packet of energy that a wave of a given frequency can
carry, as a photon is for light (section 8.3). The pair looks the same after half a turn, so its waves have the angular
frequency $2\Omega$, and a graviton carries $2\hbar\Omega = 2.12\times10^{-32}$ J, with
$\hbar = 1.055\times10^{-34}\unit{J\,s}$ the reduced Planck constant. One leaves every 14.8 years.

## A body far smaller than its wave shows no shape

The waves have twice the rotation frequency, so $\lambda = \pi c/\Omega$, while the masses move at $\obs v = \Omega d/2$.
Dividing,

$$\frac{\lambda}{d} = \frac{\pi}{2}\,\frac{c}{\obs v}.$$

For the pair turning sixteen times a second, $\lambda = 9370$ km and $\obs v = 50.3\unit{m\,s^{-1}}$, so $\lambda/d =
9.4\times10^6$. A pair a metre across turning once a second has $\obs v = 3.1\unit{m\,s^{-1}}$ and waves 150,000 km long. The
same holds, up to a factor of order one, for any body whose parts move at the speed $\obs v$ through distances like its
size $L$: it changes at a rate near $\obs v/L$, so $\lambda/2\pi$ is near $L/(\obs v/c)$. No aperture can resolve an
object much smaller than the wavelength, since the limit of section
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array) is about
$\lambda/D$ radians for an aperture of width $D$. A compact, slow body is a point in its own radiation.[^unres]

## Only a source larger than its wave shows a form

Far from any source, of whatever size and speed, the wave is

$$\tilde{\field h}^{\rm TT}_{ij}(\omega, r\hat n) = \frac{4G}{c^4 r}\,e^{i\omega r/c}\,\Lambda_{ij,kl}(\hat n)\,
\matter{\tilde T}_{kl}\Bigl(\omega, \frac{\omega\hat n}{c}\Bigr),$$

where $\hat n$ is the unit vector from the source to the field point, $\omega$ the angular frequency, and
$\sym{tt-projector}{\Lambda_{ij,kl}}(\hat n)$ the **transverse trace-free projection**, which keeps the part of a table
across the line of sight with no trace. The source enters through $\sym{stress-transform}{\matter{\tilde T}_{kl}}$, the
transform in time and space of its stress, the momentum that crosses each square metre each second, in pascals. Section
[7.7](/tutorial/geometry/quadrupole-formula/#far-away-each-direction-reads-the-stress-at-one-wavevector) assembled it
from the far field of section 5.2, the factor $16\pi G/c^4$ of section 7.4 and the projector of section 7.6.[^zone]
Each direction carries one Fourier component of the stress, on the sphere $|\mathbf k| = \omega/c$, and an aperture of
width $D$ at the distance $r$ reads a cap of that sphere and sees detail $\lambda r/D$ (section 5.3). A compact source is the point $\mathbf k \to 0$, where the total stress is the
virial identity's $\tfrac12\ddot{\matter I}_{kl}$, and the equation becomes the quadrupole formula.

The simplest source larger than its wave is many compact ones driven in step. The rotors of a continental power
grid turn together over distances greater than 3000 km, the length of their waves: turning 50 times a second, they send
waves at 100 Hz, $2.998\times10^8/100 = 3000$ km long. They send one rotor's wave times their **array factor**, the sum
$\sum_s e^{-i\phi_s - i\omega\hat n\cdot\mathbf x_s/c}$ over their positions $\mathbf x_s$ and phases $\phi_s$
([5.2](/tutorial/waves/retarded-waves/#many-sources-in-step-add-their-amplitudes)). Close together and in step the
amplitudes add, so $N$ rotors radiate $N^2$ times the power of one, against $N$ times far apart.

An aperture wide enough to resolve such a source lies in its Fresnel zone, $D^2 \gg \lambda r$, and must use the delays
from each point of the source
([5.3](/tutorial/waves/diffraction/#a-near-source-needs-the-delays-from-a-point)). Sources in step also blur more: with
a dip of a fifth as the test, they must be $1.43\,\lambda r/D$ apart, against $1.01\,\lambda r/D$ out of step
([5.3](/tutorial/waves/diffraction/#sources-in-step-blur-more-than-sources-out-of-step)).

## The polarization of an unresolved rotor gives its sense of turning and its tilt

The angle between the rotor's spin and the direction from the rotor to the camera is the **inclination**
$\sym{inclination}{\iota}$. Section
[5.4](/tutorial/waves/polarization/#the-rotor-shines-eight-times-less-edge-on) found the power sent toward $\iota$,
relative to the power along the axis, to be $(1 + 6\cos^2\iota + \cos^4\iota)/8$, panel (a) below. Edge-on it is
$\tfrac18$: the amplitude is halved, which quarters the power, and one polarization is gone, which halves it
again. Averaged over the sky the curve is $\tfrac25$, so the total power is $\tfrac85\pi r^2$ times the flux on the
axis, which gives the dumbbell's power again. Panel (b) shows $\lambda/d$ against the speed of the moving parts.

{{paper fig:quadrupole}}

At twice the rotation frequency the rotor's two polarizations, the plus and cross patterns of section 7.6, are a
quarter cycle apart, $\field h_+(t) = \field h_+\cos 2\Omega u$ and $\field h_\times(t) = \field
h_\times\sin 2\Omega u$ with $u = t - r/c$, with the amplitudes

$$\begin{gathered}\field h_+ = \field A\,\frac{1 + \cos^2\iota}{2},\qquad \field h_\times = \field A\cos\iota,\\
\sym{rotor-amplitude}{\field A} = \frac{4G\matter{\Delta I}\,\Omega^2}{c^4 r}.\end{gathered}$$

Here $\field A$ is the strain seen face on, a pure number, and $\sym{moment-difference}{\matter{\Delta I}}$, in
$\mathrm{kg\,m^2}$, is the difference between the two principal moments of inertia in the plane of rotation: the pair's
second moment has the eigenvalues $\tfrac12\matter md^2$ along the rod and zero across it. Section
[5.4](/tutorial/waves/polarization/#projecting-a-turning-quadrupole-onto-the-sky-gives-the-two-amplitudes-of-a-rotor)
derived the two angular factors and the quarter cycle by projecting the turning second moment onto the sky, with the
first axis along the spin's shadow, and section
[7.7](/tutorial/geometry/quadrupole-formula/#seen-along-its-spin-a-rotors-two-polarizations-share-one-amplitude)
derived $\field A$.[^amp]

On axes turned through any angle the two amplitudes mix, but the **Stokes parameters** $I$ and $V$ of section 5.4,
the wave's whole strength and its anticlockwise part minus its clockwise part, do not change. Their ratio, the
**degree of circular polarization**, is a pure number between $-1$ and 1:

$$\frac VI = \frac{2\,\field h_+\field h_\times}{\field h_+^2 + \field h_\times^2}.$$

It is positive when the pattern of stretch turns anticlockwise as the camera sees it, as the rotor itself appears to
turn. For the rotor it is $+1$ at $\iota = 0$, 0.976 at 60°, 0 edge-on and $-1$ at 180°. Its sign
gives the sense of turning, and its size the tilt, finely only near edge-on: at 30° it differs from 1 by
$5\times10^{-5}$.

{{paper fig:polarization}}

::: try {#quadrupole}
The wavelength over the size of a source, with the speed of its moving parts on a slider.

Predict first: at the sixteen-turn pair's 50 m/s, how many times its own size is its wavelength? At the slider's end,
two-thirds of light's speed, is it still longer than the source? Then read the ratio at both speeds and compare it with
$(\pi/2)(c/\obs v)$.
:::

## Shear and lopsided motion radiate, and pressure does not

The source of the wave field is the part of the stress that is transverse to the line of sight and has no trace. Four
motions fail the test.

- Steady motion in a straight line is a body at rest seen by a moving observer, and the field of a body at rest falls
  as $1/r^3$, with no part falling as $1/r$
  ([7.6](/tutorial/geometry/gravitational-waves/#a-body-in-steady-motion-sends-no-wave-and-neither-does-an-even-pressure)).
- A body that keeps spherical symmetry, however violently it pulsates, has the second moment
  $\tfrac13\delta_{ij}\int\matter\rho\,r^2\,\dd V$, which is pure trace, and the projector removes it.
- A wheel turning steadily about its axis of symmetry puts an identical piece in the place of each piece, so its second
  moment does not change.
- A pressure the same in all directions has the stress $\matter p\,\delta_{kl}$, and
  $\Lambda_{ij,kl}\delta_{kl} = 0$ exactly, so a sealed box of gas whose pressure rises and falls evenly sends nothing.

The camera sees shear and lopsided motion, not pressure.[^silent]

## Slowing light to twenty centimetres a second makes each rotor a spot

A pair turning once a second sends waves 150,000 km long, and a room is deep inside their near zone, which reaches
$\lambda/2\pi = 23{,}900$ km
([5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1)).
Nothing is resolved, but the tide there still turns with each pair. To show each pair as a spot, the figure below sets
the speed of light, and of gravity with it, to $0.20\unit{m\,s^{-1}}$. A pair turning once a second then sends waves
at 2 Hz, $0.20/2 = 0.10$ m long. The balls, 0.44 m apart, move at $\Omega d/2 = 1.38\unit{m\,s^{-1}}$, 6.9 times the
slowed light, and each pair is 4.4 wavelengths across, so the dumbbell's power would not hold. The polarization does
not depend on the speed of light, since $V/I$ depends only on the inclination.[^slow]

{{paper fig:which-way}}

::: try {#scene-which-way}
The three sealed boxes, in ordinary light on the left and in the slowed waves on the right. Magenta marks a pattern of
stretch that turns anticlockwise as the camera sees it, $V/I > 0$, and green one that turns clockwise.

Predict first: which box stays dark in the waves, and why do the other two take opposite colours? Then drag the divider
across the shelf and compare the two views.
:::

## The capstone: one sealed rotor, from beside it to far away

The rotor is two 1 kg masses at the ends of a light rod 1 m long, turning sixteen times a second inside a sealed steel
box, anticlockwise as seen from above. In ordinary light a camera sees only the closed box, but no wall screens gravity
([0.2](/tutorial/evening/through-walls/)). We follow the rotor outward in eight steps.

**(a) Its waves.** Its moment difference is $\matter{\Delta I} = \tfrac12\matter md^2 = 0.5\unit{kg\,m^2}$. Its waves
have $2\times16 = 32$ Hz, so $\lambda = 9370$ km and the near zone reaches 1490 km.

**(b) A pixel 10 m away, in the rotor's plane.** Deep in the near zone, it reads Newton's changing tide of the masses
where they are now: the all-zone solution of section
[7.7](/tutorial/geometry/quadrupole-formula/#one-solution-runs-from-newtons-pull-near-the-source-to-the-wave-far-away)
becomes the tide of a quadrupole ([2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)),
the first-order retardation cancelling because mass is conserved. Its tide along the spin, at right angles to the plane, is
$\curv\tE_{zz} = \tfrac{15}4G\matter{\Delta I}/r^5 = 1.25\times10^{-15}\unit{s^{-2}}$ in amplitude, swinging at 32 Hz:
about a ten-millionth of the person's $9.3\times10^{-9}\unit{s^{-2}}$ at a metre. The box's steady pull does not change,
so the pixel removes it.

**(c) Its magnetic part, in the plane.** The changing magnetic part is smaller than the tide by about $kr =
6.7\times10^{-6}$, with $k = 2\pi/\lambda$ the wavenumber (section
[7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)).
The all-zone solution gives its size, the root of the sum of the squares of its entries:
$|\curv\tB| = 9.8\times10^{-21}\unit{s^{-2}}$, which is $1.17\,kr$ times step (b)'s $\curv\tE_{zz}$.[^kr] Two gyroscopes a
metre apart would turn relative to each other at no more than $|\curv\tB|\times1\,\mathrm m/c =
3\times10^{-29}$ radians a second
([7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)),
about $5\times10^{-15}$ of the frame dragging that Gravity Probe B measured.

**(d) Where the wave takes over, in the plane.** Newton's changing tide, falling as $r^{-5}$, and the wave's, falling as
$r^{-1}$, are equal at $0.313\lambda = 2930$ km.

**(e) A camera $10^4$ km away, on the axis.** On the axis the near tide and the wave's tide are equal closer in, at
$0.21\lambda = 1970$ km, so this camera, about one wavelength out, reads the wave. Its two strains are $\field h_+
= \field h_\times = \field A = 1.7\times10^{-47}$, a quarter cycle apart, $10^{-26}$ of the strains LIGO detects. A
wave's tide is minus half the second time derivative of its strain
([7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)), so
each entry of the tide swings at up to $2\Omega^2\field A = 3.4\times10^{-43}\unit{s^{-2}}$. The whole table has the
size $|\curv\tE| = \sqrt2\times$ that $= 4.8\times10^{-43}\unit{s^{-2}}$, and the magnetic part's is the same. The pattern of stretch turns with the rotor, so
$V/I = +1$ for this camera above it, which sees the rotor turn anticlockwise.

**(f) Its energy.** On the axis at $10^4$ km the flux is
$c^3(2\Omega)^2\field A^2/16\pi G = 9.1\times10^{-56}\unit{W\,m^{-2}}$, which is $P/1.6\pi r^2$, as the power pattern
requires. **(g) Its gravitons.** One leaves the rotor every 14.8 years, and a square metre on the axis at $10^4$ km
catches one every $7.4\times10^{15}$ years, half a million times the age of the universe.

**(h) A camera $10^4$ km away, edge-on.** Back in the rotor's plane at the same distance, beyond the crossover of step
(d), the camera reads a pattern of stretch that only pulses along a fixed line: $\field h_+ = \field A/2 =
8.4\times10^{-48}$ and $\field h_\times = 0$, so $V/I = 0$ and the wave is linearly polarized, with $\tfrac18$ of the
power on the axis. This camera finds the plane of the rotor's turning, but not its sense.

So a camera far away reads the rotor's sense of turning and the tilt of its axis from the polarization, without ever
resolving it (Figure [](#fig:read-v-capstone)), while the pixel beside it reads the shape of its mass. The wave's share of
the tide in the plane at 10 m is only $(kr)^4/15 = 1.3\times10^{-22}$, about $1.7\times10^{-37}\unit{s^{-2}}$.

![Look first at panels (b) and (e): the same rotor gives a pixel 10 m away the changing Newtonian tide of its masses,
and a camera $10^4$ km away on its axis a wave whose turning pattern shows which way the rotor turns; edge-on, in (h),
the pattern only pulses. Rings, gyroscopes and counter schematic; the curves of (d) and (f)
exact.](tut-read-v-capstone){#fig:read-v-capstone}

**The idea to keep: waves from moving bodies follow from Parts 5 and 7. A compact source radiates through the changing,
transverse, trace-free part of its quadrupole, so slow bodies are points in their own waves, and their sense of
turning survives in the polarization. One rotor shows both regimes: beside it a pixel reads Newton's pull of the masses
as they are now, and far away a camera reads a wave.**

::: problems
### Practice

**[R7b]** For a dumbbell of two 10 kg masses 2 m apart, turning five times a second, find the power, the wavelength,
$\lambda/d$, the amplitude times the distance, $\field Ar$, and the years between gravitons.

::: solution
With $\Omega = 31.4\unit{s^{-1}}$, $P = 6.8\times10^{-41}$ W: $\matter m^2d^4$ is 1600 times the 1 kg pair's, and
$\Omega^6$ a 1100th. The 10 Hz waves are 30,000 km long, so $\lambda/d = 1.5\times10^7$. With $\matter{\Delta I} =
20\unit{kg\,m^2}$, $\field Ar = 4G\matter{\Delta I}\Omega^2/c^4 = 6.5\times10^{-40}$ m. A graviton carries
$2\hbar\Omega = 6.6\times10^{-33}$ J, so one leaves every 3.1 years.
:::

### Stretch

**[R7b]** At 10 m from the rotor, compare $kr$, the estimate of the changing magnetic part over the changing tide, with
the static ratio $\sqrt3\,\obs v/c$ of section 7.5 for a mass crossing the line of sight at $50\unit{m\,s^{-1}}$.

::: solution
Here $kr = 6.7\times10^{-6}$, while $\sqrt3\,\obs v/c = \sqrt3\times50.3/2.998\times10^8 = 2.9\times10^{-7}$. The
changing part's ratio is 23 times larger, because $kr = (\obs v/c)(4r/d)$ carries the distance over the size of the
rotor.
:::

### The camera

**[R7b]** The power sent toward the inclination $\iota$ is in proportion to $\field h_+^2 + \field h_\times^2$. Find the
inclination at which the rotor sends half the power it sends along its axis, and $V/I$ there. What does the answer say
about reading the tilt?

::: solution
$\field h_+^2 + \field h_\times^2 = \field A^2(1 + 6\cos^2\iota + \cos^4\iota)/4$, which is $2\field A^2$ on the axis.
Half the power needs $\cos^4\iota + 6\cos^2\iota - 3 = 0$, so $\cos^2\iota = 2\sqrt3 - 3 = 0.464$ and $\iota = 47°$.
There $\field h_+^2 + \field h_\times^2 = \field A^2$, so $V/I = (1 + \cos^2\iota)\cos\iota = 0.997$. Half the power has
gone, but $V/I$ has fallen by only 0.3 per cent: its size measures the tilt finely only near edge-on.
:::
:::

::: paper
- [Section V](/paper/#sec:waves): the equations [](/paper/#eq:quadrupole) to [](/paper/#eq:circular).
- [*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave): the power grid and the coherent
  penalty.
- [*The sense of turning*](/paper/#par:the-sense-of-turning) and Figures [](/paper/#fig:quadrupole) and
  [](/paper/#fig:polarization): the polarization of an unresolved rotor.
- [*What does not radiate*](/paper/#par:what-does-not-radiate): the silent motions and Figure [](/paper/#fig:which-way).
:::

::: deeper
- The GR course's [section
  18.8](https://neovand.github.io/general-relativity/chapter-18.html#18-8-a-real-event-that-turned-these-symbols-into-data)
  sets the quadrupole formula against the first wave detected.
- K. S. Thorne, "Gravitational radiation", in *300 Years of Gravitation* (Cambridge, 1987), treats this section's
  physics at full length.
:::

[^waves]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. V](/paper/#sec:waves).

[^quad]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, as its equations
    [](/paper/#eq:quadrupole) and [](/paper/#eq:dumbbell), which rounds the power to $4.6\times10^{-41}$ W.

[^unres]: Equation [](/paper/#eq:unresolved) of *The gravitational camera* (Mohsenvand 2026), Sec. V,
    [*A compact body is a point*](/paper/#par:a-compact-body-is-a-point).

[^zone]: Equation [](/paper/#eq:wave-zone) of *The gravitational camera* (Mohsenvand 2026), Sec. V,
    [*A source larger than its wave*](/paper/#par:a-source-larger-than-its-wave).

[^amp]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, as its equation
    [](/paper/#eq:rotor-amplitudes) and, for the ratio $V/I$, [](/paper/#eq:circular),
    [*The sense of turning*](/paper/#par:the-sense-of-turning).

[^silent]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V,
    [*What does not radiate*](/paper/#par:what-does-not-radiate).

[^slow]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, Fig. [](/paper/#fig:which-way).

[^kr]: Between the whole tables, measured by their sizes, the ratio $|\curv\tB|/|\curv\tE|$ is $0.31\,kr$ in the plane
    and $kr$ on the axis.
