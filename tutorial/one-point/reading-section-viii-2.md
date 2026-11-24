---
id: R9b
title: 'Reading Section VIII, part 2, with the capstone: one pixel on a desk'
question: 'With chapters 9.5 to 9.7 behind us, can we derive or check every claim of the second half of Section VIII, and what does one pixel on a desk learn about a person, a rotor and a passing wave?'
part: '9'
requires: ['R9', '2.3', '3.3', '6.3', '7.3', '7.5', '9.5', '9.6', '9.7']
paper: [sec:one-pixel, eq:pencil, eq:four-waves, eq:wave-count, eq:pixel-kernel, eq:sky-count, eq:sky-witness, eq:ranging-instant, eq:ranging-C, eq:helicity-split, eq:bianchi-wave, eq:wave-vector, eq:one-pixel-range, eq:depth-bound, eq:magnetic-range, fig:present, fig:separation-noise, tab:one-pixel, app:benchmarks]
figures: [fig:present, fig:separation-noise]
live: [present]
---

The paper's Table [](/paper/#tab:one-pixel) sets a pixel beside sensors of sound and of light: ten numbers against six,
four waves separated where light separates two, and one wave's direction to $1/\rho$ radian against $\sqrt2/\rho$, with
$\sym{reading-snr}{\rho}$ the reading's signal-to-noise ratio. Reading chapter
[R9](/tutorial/one-point/reading-section-viii/) read the first half of [Section VIII](/paper/#sec:one-pixel). With
chapters [9.5](/tutorial/one-point/separating-waves/), [9.6](/tutorial/one-point/the-sky-at-one-point/) and [chapter
9.7](/tutorial/one-point/beyond-one-plane-wave/) behind us, can we derive or check every claim of the second half, and
what does one pixel on a desk learn about a person, a rotor and a passing wave?

This chapter reads the sixteen paragraphs from [*Separating waves at one
point*](/paper/#par:separating-waves-at-one-point) to [*Precision of depth*](/paper/#par:precision-of-depth) in order.
As in R9, each claim gets one mark: *checked here* (a number recomputed from a result derived earlier), *read now,
derived in chapter N*, or *stated in the paper*; a fourth, *derived here*, marks the last three equations, which no
earlier chapter derives.

<!-- diagram: tut-read-viii-2-map — The map of the second half of Section VIII, as R9's tut-read-viii-map draws the first
half (same kit, same size, about 640 × 560 px at 1440, one column on a phone). Sixteen boxes in the paper's order, in two
columns of eight read down, joined by thin arrows: Separating waves (pencil, four-waves, wave-count; 9.5), Lensed images
(9.5), The sky (pixel-kernel, sky-count, sky-witness; 9.6), Ranging (ranging-instant, ranging-C, helicity-split; 9.7),
Absence of aberration (6.3, 7.7, 9.3), Tests of GR (bianchi-wave, wave-vector; 9.7), Matter at the pixel (1.4, 7.3, 7.5),
What no reading can tell (1.4, 2.3, 9.4), One pixel and many (9.1, 9.7), Variation across the array (8.6), Depth
(one-pixel-range; 1.4, 7.5), Front and back (1.4), Three dimensions (2.5, 5.6), Precision (tab:one-pixel; 9.7),
Separation with noise (9.7), Precision of depth (depth-bound, magnetic-range; 3.3). Each box holds its paragraph's name,
its equation labels in small type and its chapters. Fill: solid for a box derived in Part 9 or earlier, or derived here;
hatched for one whose main result rests on an estimate or on stated coefficients (Lensed images, Ranging); a dotted
inset in a box for its stated results (Sylvester and Bézout, the convex cone, Sachs, Carlip, the subspace bound and
Capon's factor, the 2.2 and 1.26, the 0.7 fit). A last box below both columns, outlined in the curvature colour, is the
capstone, with arrows into it from Depth, Separation with noise, Precision of depth and What no reading can tell. A faint
dashed strip at the top stands for R9's first half. Caption: "Look first at the solid boxes: every paragraph of the
second half of Section VIII is derived in Part 9 or earlier, or derived here, with its stated results in dotted insets.
Four of them meet in the capstone." -->

::: plain
The second half of Section VIII asks what one pixel, and a few side by side, can learn beyond one wave. One pixel
separates up to four waves that cross it together, where light separates two. It reads 68 numbers of a sky of many
sources, and one reading gives a wave's speed and every pattern of stretch that other theories allow.

Neighbours add depth. The tide of a mass falls as one over the distance cubed, and its change from place to place as
one over the fourth power, so their ratio gives the distance. No single reading can tell what kind of scene it comes
from.
:::

## One pixel separates up to four waves, and light two

[*Separating waves at one point*](/paper/#par:separating-waves-at-one-point) adds the waves' squares
$\curv\alpha_a\vect m_a\vect m_a^{\mathsf T}$ (9.1). Two waves give a reading of rank two, so $\det\curv{\mathcal W} =
0$, and the vector $\vect m_1\times\vect m_2$ that the reading sends to zero
leads to both (*read now, derived in chapter
[9.5](/tutorial/one-point/separating-waves/#two-waves-give-a-reading-of-rank-two-and-the-vector-it-sends-to-zero-leads-to-both)*;
Sylvester's converse *stated*). At one frequency, with the reading's two parts $\curv{\mathcal W}_\pm$, three waves are
the roots of the paper's

{{paper eq:pencil}}

(*read now, derived in chapter
[9.5](/tutorial/one-point/separating-waves/#three-waves-of-one-frequency-are-three-roots-of-one-pencil)*), and a
binary seen at the inclination $\iota$ has $|\lambda| = \tan^{\pm4}(\iota/2)$: 194 or its inverse at 30°, 9 or
$\tfrac19$ at 60° (*checked here*). Over time four waves leave one combination $A$ of the readings empty, and each
direction solves

{{paper eq:four-waves}}

(*read now, derived in chapter 9.5*; Bézout's count *stated*). All three are Prony's problem, and for a field of spin
$s$ read in $L$ independent snapshots

{{paper eq:wave-count}}

For $s = 1$, 2 and 4 it gives 1, 2, 2; 2, 3, 4; and 4, 6, 8 at one instant, at one frequency and over a long record,
so spin four "would separate six waves at one frequency" (*checked here*). With noise of $10^{-4}$ of the signal, four
waves "are located to $10^{-4}$ radian from three hundred readings".[^typical] From second moments alone, one
pixel separates five uncorrelated sources whose circular fractions differ (*read now, derived in chapter
[9.5](/tutorial/one-point/separating-waves/#uncorrelated-sources-separate-from-their-average-brightness-and-circular-polarization)*).

## Lensed images need a ratio of two hundred thousand

In [*Lensed images at one point*](/paper/#par:lensed-images-at-one-point), each image of a lensed chirp falls in its own
cell of time and frequency, where the pixel reads one wave (*read now, derived in chapter
[9.5](/tutorial/one-point/separating-waves/#lensed-images-fall-in-separate-cells-of-time-and-frequency)*, an estimate).
One wave is placed to $1/\rho$ radian (9.7), so an arcsecond, $4.85\times10^{-6}$ rad, needs $\rho = 2.06\times10^5$. An
aperture would need the wavelength at 100 Hz over that angle, $3.0\times10^6\unit{m}/4.85\times10^{-6}$, which is 4.1
astronomical units (*checked here*).

## One pixel reads 68 numbers of a sky of independent sources

[*What one pixel sees of the sky*](/paper/#par:what-one-pixel-sees-of-the-sky) averages a sky into the pixel's
**spectral matrix**, the mean products of its ten numbers at one frequency: one hundred real numbers, in blocks for
the sky's brightness and its circular and linear polarization (*read now, derived in chapter
[9.6](/tutorial/one-point/the-sky-at-one-point/#the-pixels-spectral-matrix-splits-into-three-blocks-by-helicity)*).
Through the paper's kernel

{{paper eq:pixel-kernel}}

and the linear polarization's spin weight four, the pixel reads

{{paper eq:sky-count}}

numbers of the sky, and the other 32 are checks (*read now*).[^even] The paper's $2(2s + 1)^2 + 2(4s + 1)$ gives 68 of
100 at $s = 2$ and 28 of 36 at $s = 1$; sound's 9 of 16 are its brightness at degrees 0, 1 and 2, $1 + 3 + 5$
(*checked here*). Chapter 9.6 reads the rest, including the paper's inequality
[](/paper/#eq:sky-witness), which [every sky obeys and a standing wave
breaks](/tutorial/one-point/the-sky-at-one-point/#a-sky-obeys-an-inequality-that-a-standing-wave-breaks).

## A near source is ranged by the tilt between its helicities

[*Ranging a wave source*](/paper/#par:ranging-a-wave-source) reads how a near source spoils the square. Its field
**peels** into parts falling as $1/r$, $1/r^2$, $1/r^3$ and beyond (Sachs, *stated*; chapter 9.1). The first correction
only tilts the null vector, so the ratio of the second singular value to the first is of second order in $1/kr$, with
$\sym{reduced-distance}{kr}$ the distance in reduced wavelengths $c/\omega$, 477 km at 100 Hz:

{{paper eq:ranging-instant}}

Here $C(\iota, \theta)$, for a turning pair seen at the inclination $\iota$ and the wave phase $\theta$, is the paper's
[](/paper/#eq:ranging-C) (*read now, derived in chapter
[9.7](/tutorial/one-point/beyond-one-plane-wave/#a-nearby-source-spoils-the-square-only-at-second-order)*, from the
pair's stated coefficients). Edge-on, $C(90°, \theta) = 2$, and $C(\iota, 0)$ vanishes at $\cos^2\iota = \tfrac13$,
$\iota = 54.7°$ (*checked here*).[^phase]

The pair's mass also makes a steady tide $G\matter M/r^3$. With $v$ the speed of each mass, the wave's tide is about
$\omega^2G\matter Mv^2/c^4r$ and the departure $(kr)^{-2}$ of it, so the steady tide is $(c/v)^2$ times larger
(*checked here*, as a scaling). The paper reads the oscillating part from $\dot{\curv{\mathcal W}}$, the reading's
rate of change, which holds none of the steady tide because that tide does not change.

Over a cycle the two helicities tilt apart by

{{paper eq:helicity-split}}

0.069 rad at $kr = 200$ and $\iota = 30°$ (*checked here*). At $\rho = 10^3$ and 60° the split equals its own error at
$kr = 507$ (9.7), $2.4\times10^5$ km at 100 Hz: "a few hundred thousand kilometres".

## The field of a moving body points at where the body is now

[*The absence of gravitational aberration*](/paper/#par:the-absence-of-gravitational-aberration) says that the stretch
axis of a steadily moving body's tide "points at the body's present position, at any speed" (*read now*, derived in
chapter [9.3](/tutorial/one-point/the-matrix-w/#how-large-the-magnetic-part-is-and-where-the-field-points) from 6.3's
steady field). So the gravitational Sun runs ahead of the optical Sun by the Earth's orbital speed over $c$,
$29.8\unit{km\,s^{-1}}/c = 9.94\times10^{-5}$ rad: the paper's $20.5''$ (*checked here*; chapter
[6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now)). Near two
masses in orbit at $kr = 0.1$, Newton's tide of their present positions misses the changing field by 0.14 per cent in
the orbit's plane and 0.5 per cent on its axis; their retarded positions miss by $kr$, 10 per cent (*read now, derived
in chapter
[7.7](/tutorial/geometry/quadrupole-formula/#near-a-slow-source-the-field-points-at-where-the-masses-are-now)*).[^mass]

{{paper fig:present}}

::: try {#present}
Predict first: when the moving body stops, does the stretch axis at the pixel turn at once to where the body stopped,
or later? Then stop it, and watch where the field turns first and how the change spreads.
:::

## One reading gives a wave's speed and all six polarizations

[*Tests of general relativity from one reading*](/paper/#par:tests-of-general-relativity-from-one-reading) assumes only
a metric theory. For a plane wave of any polarization and phase speed $v_p$, the second
Bianchi identity gives the paper's

{{paper eq:bianchi-wave}}

(*read now, derived in chapter
[9.7](/tutorial/one-point/beyond-one-plane-wave/#the-second-bianchi-identity-ties-a-metric-waves-magnetic-part-to-its-tide)*).
With a trace, $\curv\tE$ holds six numbers, and $\curv\tB$, no longer symmetric, eight; nine unknowns (direction, speed,
six polarizations) leave $14 - 9 = 5$ checks (*checked here*). Summing the cross products of
matching columns of $\curv\tE$ and $\curv\tB$ gives, for $\mathbf p = (c/v_p)\hat k$, the paper's

{{paper eq:wave-vector}}

solvable when $\curv\tE$ has rank two or more (*read now*). With $n = c/v_p$, a massive graviton's helicity-zero wave
has its longitudinal and breathing amplitudes in the ratio $-2(1 - n^2)$ and a massive scalar's in $+(1 - n^2)$:
$-1.28$ and $0.64$ at $n = 0.6$ (*checked here*).

## Inside matter the trace of the tide reads the density there

[*Matter at the pixel*](/paper/#par:matter-at-the-pixel) gives $\mathrm{tr}\,\curv\tE = 4\pi G[\matter\rho + (\matter
p_1 + \matter p_2 + \matter p_3)/c^2]$, with $\matter\rho$ the density (here not a signal-to-noise ratio) and $\matter
p_a$ the principal stresses (*read now, derived in chapter
[7.3](/tutorial/geometry/einstein-equation/#pressure-and-stress-gravitate)*). A frame turning at the rate $\Omega$
subtracts $2\Omega^2$, the trace of
[1.4](/tutorial/newton/tides/#on-the-ground-the-earths-own-tide-is-far-larger-but-steady)'s pseudo-tide. The numbers
come out (*checked here*):

- the dark matter's $0.4\unit{GeV\,cm^{-3}}$ is $7.13\times10^{-22}\unit{kg\,m^{-3}}$, and $4\pi G\matter\rho =
  5.98\times10^{-31}\unit{s^{-2}}$;
- between plates $d = 1\unit{\mu m}$ apart, the Casimir energy density $-\pi^2\hbar c/720d^4 =
  -4.33\times10^{-4}\unit{J\,m^{-3}}$ (6.5) is the mass density $\matter\rho_{\rm cas} =
  -4.82\times10^{-21}\unit{kg\,m^{-3}}$; its stresses, $3\matter\rho_{\rm cas}c^2$ across the plates and $-\matter\rho_{\rm
  cas}c^2$ twice along them, add to $\matter\rho_{\rm cas}c^2$, so the trace is $8\pi G\matter\rho_{\rm cas} =
  -8.09\times10^{-30}\unit{s^{-2}}$;
- the cosmological constant, $1.1\times10^{-52}\unit{m^{-2}}$, gives $-\Lambda c^2 = -9.9\times10^{-36}\unit{s^{-2}}$.

Radiation with the energy flux $\matter{\vect F}$, in $\mathrm{W\,m^{-2}}$, gives the trace $8\pi G|\matter{\vect
F}|/c^3$ (7.3) and $\curv\tB_{[ij]} = -(4\pi G/c^3)\epsilon_{ijk}\matter F_k$ (*read now, derived in chapter
[7.5](/tutorial/geometry/gravitomagnetism/#moving-matter-makes-the-magnetic-part-through-the-potential-of-its-flow)*).
The supernova's neutrinos wait for R12.

## Two masses and two waves can give the same ten numbers

[*What no reading can tell*](/paper/#par:what-no-reading-can-tell) builds the two scenes that chapter
[0.4](/tutorial/evening/one-pixel/#no-single-reading-tells-the-kind-of-scene) promised. A mass on the $y$ axis has the
tidal weight $G\matter M/r^3 = a$, in $\mathrm{s^{-2}}$, and a mass on the $z$ axis has $2a$. Each stretches along its
line by twice its weight and squeezes across it by its weight
([1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)), so

$$\begin{aligned}&a\,\mathrm{diag}(1, -2, 1) + 2a\,\mathrm{diag}(1, 1, -2)\\
&\quad= a\,\mathrm{diag}(3, 0, -3),\end{aligned}$$

with $\curv\tB = 0$. Two equal plus waves along $+\hat y$ and $-\hat y$, each with the tide $\tfrac32a\,\mathrm{diag}(1,
0, -1)$ at its crest, add at an antinode to the same table, and their magnetic parts, opposite in sign, cancel (R9's
[standing
wave](/tutorial/one-point/reading-section-viii/#the-magnetic-part-equals-the-tide-in-a-wave-and-is-small-near-slow-matter)).
The ten numbers agree (*checked here*).

More is true. A positive shell whose density holds only degrees 0 and 2 makes inside it a constant tide $\curv\tE_0$
(chapter [2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics)); we take
one with $\curv\tE_0\hat y = 0$. Two pulses along $\pm\hat y$, each carrying the tide $\tfrac12\curv\tE_0f(u)$, match it
with the profile $f(u) = [1 - 2m(u/\tau)^{2m}]e^{-(u/\tau)^{2m}}$, where $u = t \mp y/c$ is each pulse's time of
passage, $\tau$ its duration and $m$ a whole number. This $f$ is the derivative of $ue^{-(u/\tau)^{2m}}$, so $\int
f\,\dd u = 0$, and by parts $\int uf\,\dd u = -\int ue^{-(u/\tau)^{2m}}\,\dd u = 0$, an odd integrand: no strain is left
behind. Near $u = 0$, $f = 1 - (2m + 1)(u/\tau)^{2m} + \dots$, so the pulses match a constant tide through order $2m -
1$, at least $N$ when $2m > N$ (*checked here*). A record over time, an aperture, or knowing the sources tells such
scenes apart.

Nor does the type count bodies: two masses on a line give type D, like one, and the table with rows $(0, 0, 1)$, $(0, 0,
i)$ and $(1, i, 0)$ has $I = J = 0$, rank two, $\curv{\mathcal W}^2 \neq 0$ and $\curv{\mathcal W}^3 = 0$: type III
(*checked here*; chapters
[9.2](/tutorial/one-point/complex-symmetric/#six-shapes-told-apart-by-what-the-tables-powers-do) and
[9.4](/tutorial/one-point/petrov/#the-pattern-of-the-four-directions-is-the-fields-petrov-type)).

## The spin-two weight removes an array's false fringes

[*One pixel and many*](/paper/#par:one-pixel-and-many) counts what an array adds. Since $N$ pixels have $5N$ numbers per
steering vector, a subspace method separates up to $5N - 1$ uncorrelated sources, against $N - 1$ for scalar
sensors and $3N - 1$ for sensors of light (*stated*, as in 9.7). The "spin-two envelope of a sparse
array", which [R5](/tutorial/waves/reading-section-iii/) left to this chapter, is the weight
$\cos^8(\vartheta/2)$ that two pixels give a fringe at the angle $\vartheta$ from the source (*read now, derived in
chapter [9.1](/tutorial/one-point/spin-two/#two-squares-overlap-less-than-two-vectors)*). For two pixels $D$
apart, Capon's estimator lifts the true fringe above the next false one by $1 + \rho^2[1 - \cos^8(\vartheta_1/2)]$,
with the fringe spacing $\vartheta_1 = c/(fD)$ at broadside for the frequency $f$ (*stated*). At a hundred wavelengths,
$1 - \cos^8(0.005) = 1.00\times10^{-4}$, so the factor is 2 at $\rho = 100$; at 55° from broadside the next fringes lie
$1.72\,c/(fD)$ and $1.77\,c/(fD)$ away, the paper's 1.8 (*checked here*).

## Across one metre a wave is uniform and a person is not

[*Variation across the array*](/paper/#par:variation-across-the-array) compares a wave and a mass across an array of
width $D = 1$ m. A wave at $f = 100$ Hz has the wavelength $c/f = 3.0\times10^6$ m, so $2\pi Df/c = 2.1\times10^{-6}$,
while a person 3 m away gives $3D/r = 1$ (*checked here*). The person adds to the array's average the paper's
$3\times10^{-10}\unit{s^{-2}}$, the tide's largest eigenvalue $2G\matter M/r^3$. This chapter compares tides by their
size $|\curv\tE|$ (1.5): the person's, $4.24\times10^{-10}\unit{s^{-2}}$, is $1.5\times10^6$ times
that of a wave of strain $\field h = 10^{-21}$ at 100 Hz, $\sqrt2\times\tfrac12\omega^2\field h =
2.79\times10^{-16}\unit{s^{-2}}$: the paper's "a million times" (*checked here*). Modelling nearby masses from their
variation is how observatories plan to remove **Newtonian noise**, the changing pull of their surroundings (chapter
[8.6](/tutorial/quantum/quantum-limit/#each-kind-of-detector-reads-its-own-part-of-the-tide)).

## Neighbours give depth, and the magnetic part ranges a moving mass

[*Depth*](/paper/#par:depth) uses that variation. A mass's tide falls as $\matter M/r^3$ and its gradient as $\matter
M/r^4$, so their ratio gives $r$ and then $\matter M$ (*read now*,
[1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)). Exactly, $r =
\sqrt{15}\,|\curv\tE|/|\nabla\curv\tE|$, because $|\curv\tE|^2 = 6(G\matter M)^2/r^6$ and $|\nabla\curv\tE|^2 =
90(G\matter M)^2/r^8$ (*checked here*).

The tide has no scale: doubling the path and making the mass eight times larger leaves $\curv\tE \propto \matter M/r^3$
unchanged, while the speed doubles, and so does $\curv\tB \propto \matter Mv/cr^3$ (*checked here*). Let $\hat n$ point
from the pixel to the mass, with $\vect v$ the mass's velocity, $\vect v_\perp$ its part across $\hat n$, and $P = 1 -
\hat n\hat n^{\mathsf T}$ (not 9.3's $P$) the table that removes the part along $\hat n$. Section IV's
[](/paper/#eq:magnetic-point), derived in chapter 7.5, gives $\curv\tB\hat n = (3G\matter M/cr^3)\,\hat n\times\vect v$.
Chapter 1.4's tide $\curv\tE = (G\matter M/r^3)(1 - 3\hat n\hat n^{\mathsf T})$ gives $\curv\tE\hat n = -2(G\matter
M/r^3)\hat n$, and differentiating in time, with $\dot{\hat n}\cdot\hat n = 0$,

$$\dot{\curv\tE}\hat n = \frac{6G\matter M\dot r}{r^4}\,\hat n - \frac{3G\matter M}{r^3}\,\dot{\hat n} .$$

$P$ removes the first term, which lies along $\hat n$. The second comes from the line to the mass turning, at the rate
$\dot{\hat n} = \vect v_\perp/r$, so $P\dot{\curv\tE}\hat n = -(3G\matter M/r^4)\,\vect v_\perp$. Since $\hat
n\times(\hat n\times\vect v) = -\vect v_\perp$, both sides of the paper's

{{paper eq:one-pixel-range}}

equal $-(3G\matter M/cr^3)\vect v_\perp$ (*derived here*). Reversing $\hat n$ reverses only the right side, so the sign
that makes $r$ positive fixes $\hat n$. Motion straight on gives R9's [time
to contact](/tutorial/one-point/reading-section-viii/#one-pixel-reads-the-position-velocity-and-mass-of-a-moving-body)
instead.

## The full table tells front from back

[*Front and back*](/paper/#par:front-and-back) mirrors a mass in the plane $z = 0$ of a flat array. By chapter 1.4 the
tide is $\curv\tE_{ij} = G\matter M(r^2\delta_{ij} - 3x_ix_j)/r^5$, with $\vect x$ from the mass to the pixel. Mirroring
reverses $x_z$, which enters $\curv\tE_{zz}$ twice and $\curv\tE_{xz}$, $\curv\tE_{yz}$ once: the first is unchanged,
the others change sign (*checked here*). In [*Three dimensions*](/paper/#par:three-dimensions), pixels outside the
matter keep 2.5's [ambiguity](/tutorial/outside/null-space/), and thermal images are 5.6's [line
integrals](/tutorial/waves/abel-transform/) (*read now*).

## The table sums up the section

[*Precision*](/paper/#par:precision) takes independent noise $\sigma_n$, in $\mathrm{s^{-2}}$, on each of the ten
numbers in chapter [1.5](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length)'s
orthonormal basis (the paper's bare $\sigma$). With $\rho =
|\curv{\mathcal W}|/\sigma_n$, one wave is placed to $1/\rho$ radian, and by a sensor of light to $\sqrt2/\rho$ (*read
now, derived in chapter
[9.7](/tutorial/one-point/beyond-one-plane-wave/#one-waves-direction-is-known-to-1ρ-a-factor-2-better-than-lights)*).
The table:

| At one point | Sound | Light | Gravity | Derived in |
|---|---|---|---|---|
| numbers recorded | 4 | 6 | 10 | R1, 6.6 |
| numbers no observer changes | – | 2 | 4 | 6.6, 9.3 |
| own velocity, components | – | 2 | 3 | 9.3 |
| waves: one instant, one frequency, over time | 1, 2, 2 | 1, 2, 2 | 2, 3, 4 | 9.5 |
| sky numbers (of) | 9 (16) | 28 (36) | 68 (100) | 9.6 |
| direction of one wave | – | $\sqrt2/\rho$ | $1/\rho$ | 9.7 |

Sound's column is *stated in the paper*.

## A near field costs √2, and the shape test rarely errs

[*Separation with noise*](/paper/#par:separation-with-noise) puts a wave at 100 Hz of strain $10^{-21}$ (tide
$2.79\times10^{-16}\unit{s^{-2}}$ in size) beside a rotor 3 m away: two 1 kg masses 12 cm apart turning fifty
times a second. In the rotor's plane its tide at 100 Hz is 99 times the wave's in size (9.7).[^rotor]

The nearest wave to a mass's tide, and the nearest mass to a wave's, lie at half the reading's size, so one reading of
$\curv\tE$ puts the two shapes $\rho_E/2$ noise deviations apart, with $\rho_E = |\curv\tE|/\sigma_n$ the tide's own
signal-to-noise ratio, the paper's $\rho$ here (*read now, derived in chapter
[9.7](/tutorial/one-point/beyond-one-plane-wave/#the-shape-of-the-tide-tells-a-wave-from-a-mass-at-half-its-size)*).
In 9.7's test both shapes are fitted, with the mass kept positive, to millions of simulated readings at $\rho_E =
12$: a mass is taken for a wave about once in 140 readings and a wave for a mass about once in 1350, "fewer than one
reading in a hundred".

A near field of any tide and no magnetic part costs the wave's amplitude exactly $\sqrt2$: the wave is read from its
magnetic part alone (*read now, derived in chapter
[9.7](/tutorial/one-point/beyond-one-plane-wave/#a-near-field-costs-the-waves-amplitude-exactly-2-however-strong-it-is)*).
The rotor's magnetic part, $0.31\,kr$ of its tide with $kr = 2\pi\times100\times3\unit{m}/c = 6.3\times10^{-6}$ (9.7),
shifts the wave's estimate by $9\times10^{-5}$: "less than $10^{-4}$". The array's factors on the wave's error, 2.2 and
1.26 (Figure [](/paper/#fig:separation-noise)(a)), are *stated*.[^letter]

## The neighbours range a mass to a part in a million, and masses on one line read as one

[*Precision of depth*](/paper/#par:precision-of-depth) gives the Cramér–Rao bounds

{{paper eq:depth-bound}}

with $\sym{field-snr}{\rho_E}$ and $\sym{gradient-snr}{\rho_G}$ the signal-to-noise ratios of the tide and of its
gradient over all the readings. They follow from chapter
[3.3](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks)'s rule
that independent errors add in square. Up to constants, $\ln|\curv\tE| = \ln\matter M - 3\ln r$ and
$\ln|\nabla\curv\tE| = \ln\matter M - 4\ln r$, read to $1/\rho_E$ and $1/\rho_G$. So $\ln r$ is their difference and
$\ln\matter M = 4\ln|\curv\tE| - 3\ln|\nabla\curv\tE|$, with the variances $1/\rho_E^2 + 1/\rho_G^2$ and $16/\rho_E^2 +
9/\rho_G^2$ (*derived here*; that the direction does not enlarge them is *stated*). Six neighbours at the distance $b$,
two on each axis, give seven readings. When **the neighbours are close, $b \ll r$**, all seven read one tide, so
$\rho_E = \sqrt7\,\rho$, and a difference across $2b$ reads each of the gradient's fifteen numbers with noise
$\sigma_n/\sqrt2b$, so $\rho_G = (\sqrt{15}|\curv\tE|/r)(\sqrt2b/\sigma_n) = \sqrt{30}\,\rho b/r$ (*derived here*).

Without neighbours, the paper's

{{paper eq:magnetic-range}}

has $\sym{magnetic-snr}{\rho_B} = (\sqrt3\,v_\perp/c)\,\rho$, since the magnetic part is that much smaller than the
tide (R9). If **the tide and its rate of change are read far better than $\curv\tB$**, then $r = c|\curv\tB\hat
n|/|P\dot{\curv\tE}\hat n|$ carries the fractional error of $|\curv\tB\hat n|$ alone. A moving mass's $\curv\tB$ lies
along one table of length one, $(\hat n\vect s^{\mathsf T} + \vect s\hat n^{\mathsf T})/\sqrt2$ with $\vect s$ the unit
vector along $\hat n\times\vect v$, so $|\curv\tB\hat n| = |\curv\tB|/\sqrt2$ is read to the fraction $1/\rho_B$
(*derived here*). For a walker at $1.4\unit{m\,s^{-1}}$, $\sqrt3\,v_\perp/c = 8.09\times10^{-9}$.[^million]

Bodies on one line read as one at $\sym{effective-depth}{r_{\rm eff}} = \sum_i\matter M_ir_i^{-3}/\sum_i\matter
M_ir_i^{-4}$. Two equal masses at $r \pm \Delta/2$ give $r - \Delta^2/r$ to
second order (*checked here*). That they are told apart beyond about $0.7(r^2/b)/\rho^{1/2}$ is the fit of Figure
[](/paper/#fig:separation-noise)(c), *stated*. "A round body of any size is a point" is chapter
[1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)'s shell theorem.

{{paper fig:separation-noise}}

## The capstone: one pixel on a desk

A pixel on a desk has six neighbours 10 cm away. A person of 70 kg stands 3 m away, the paper's rotor turns 3 m away
with the pixel in its plane, and a wave at 100 Hz of strain $10^{-21}$ passes. We choose the noise: $\sigma_n =
10^{-16}\unit{s^{-2}}$ on each coefficient in the person's slow band, and a record at 100 Hz long enough that the wave's
whole reading has $\rho = |\curv{\mathcal W}|/\sigma_n = 12$.

<!-- diagram: tut-read-viii-2-desk — The capstone's desk seen from above, about 560 × 420 px at 1440 (full width on a
phone). A rounded rectangle for the desk; at its centre the pixel as a small ring with its six neighbours as dots 10 cm
away (two drawn along x and y, the pair along z drawn as a dot in a circle, out of the page), one bracket "b = 10 cm".
To the left, 3 m away (not to scale, "3 m" on a thin dimension line), the person as a plain upright figure in the matter
colour, with a short arrow for a walk of 1.4 m/s across the line of sight. Below right, 3 m away, the rotor: two dots on
a bar inside a circle with a curved arrow, in the matter colour, labelled "2 × 1 kg, 12 cm, 50 turns/s". From the upper
right, parallel thin lines with an arrow in the curvature colour for the wave, labelled "100 Hz, h = 10⁻²¹". Beside each
object its numbers, small: by the person "ρ = 4.2 × 10⁶", "σ_r = 3.9 µm, σ_M = 0.27 g", "ρ_B = 0.034"; by a cart arrow
on the pixel "41 m/s across, nothing along"; by the rotor "99 × the wave"; by the wave "4.8° or 6.8°", "error 12%, not
8.3%". Steps (a) to (h) as small circled letters beside the numbers they give. No orange or blue. Caption: "Look first
at the three distances of 3 m: the same pixel weighs the person to about a quarter of a gram, cannot range it alone,
and reads the wave beneath a rotor 99 times stronger at a price of √2. Distances not to scale; numbers exact for the
chosen noise." -->

**(a) The person's tide.** $G\matter M/r^3 = 1.73\times10^{-10}\unit{s^{-2}}$, and $|\curv\tE| = \sqrt6\,G\matter M/r^3 =
4.24\times10^{-10}\unit{s^{-2}}$ gives $\rho = 4.24\times10^6$. Then $I = 1.80\times10^{-19}\unit{s^{-4}}$, $J =
-3.11\times10^{-29}\unit{s^{-6}}$, and the type is D (R9).

**(b) The pixel on a cart.** By R9's
[speedometer](/tutorial/one-point/reading-section-viii/#ten-numbers-are-four-invariants-an-orientation-and-a-velocity),
each velocity component across the line is read to $c\sigma_n/(\sqrt2\times3G\matter M/r^3) =
41\unit{m\,s^{-1}}$, and the one along it not at all.

**(c) How far and how heavy.** With the neighbours, $\rho_E = 1.12\times10^7$ and $\rho_G = 7.74\times10^5$, so the
paper's [](/paper/#eq:depth-bound) gives $\sigma_r/r = 1.3\times10^{-6}$, which is 3.9 µm, and $\sigma_M/\matter M =
3.9\times10^{-6}$, 0.27 g. Alone, from the twist of the person walking past at $1.4\unit{m\,s^{-1}}$, $\rho_B = 0.034$,
and the paper's [](/paper/#eq:magnetic-range) gives $\sigma_r/r = 29$: no range at all.

**(d) Two people on one line.** At 3.0 m and 3.5 m they read as one body at $r_{\rm eff} = 3.175$ m, and $r -
\Delta^2/r$ gives 3.173 m about the midpoint $r = 3.25$ m. With $\rho = 6.9\times10^6$ for the pair, the neighbours'
second differences tell two from one beyond $0.7(r^2/b)/\rho^{1/2} = 2.8$ cm, against their 50 cm.

**(e) The wave against the room.** In size the person's tide is $1.5\times10^6$ times the wave's, but steady. The
rotor's changes at 100 Hz, at 99 times the wave's. Ignored, it reads as a wave 35 times the true one for a wave from
$(-0.45, -0.35, 0.82)$, with the rotor turning in the $xy$ plane and the pixel in it at 30° from $\hat x$ (9.7).

**(f) The wave under the rotor.** Fitting the rotor's tide as anything at all, the pixel reads the wave from
$\curv\tB$: the amplitude's error is $\sqrt2/\rho = 11.8$ per cent instead of $1/\rho = 8.3$ per cent.

**(g) Where the wave comes from.** With the rotor known, the direction is read to $1/\rho = 0.083$ rad, 4.8°; fitting
the rotor costs the same $\sqrt2$, 6.8°.

**(h) What one reading cannot tell.** With the line to the person along $\hat x$ and $w = G\matter M/r^3$, two standing
waves at their antinodes, with the tides $w\,\mathrm{diag}(0, 1, -1)$ along $\hat x$ and $-2w\,\mathrm{diag}(1, 0, -1)$
along $\hat y$, add to the person's $w\,\mathrm{diag}(-2, 1, 1)$, with $\curv\tB = 0$ (*checked here*). Alone, the
pixel tells them apart only by its record over time. The neighbours, the paper's "an aperture", tell them apart at
once: across them the person's tide changes by $3b/r = 10$ per cent, read at $\rho_G = 7.7\times10^5$, and the
waves' by $2\pi bf/c = 2\times10^{-7}$.

So the desk has learned that one pixel with six neighbours weighs the person to a quarter of a gram and
places the person to 4 micrometres, and reads a wave beneath a rotor a hundred times stronger at a price of $\sqrt2$.
Alone, it can neither range the person nor tell the person from two standing waves.

## The ledger: all fourteen equations are derived

| The paper's equation | Derived in; its mark here |
|---|---|
| [](/paper/#eq:pencil) | [9.2](/tutorial/one-point/complex-symmetric/#a-pencil-of-two-tables-has-generalized-eigenvalues), [9.5](/tutorial/one-point/separating-waves/#three-waves-of-one-frequency-are-three-roots-of-one-pencil); *read now*, numbers checked |
| [](/paper/#eq:four-waves) | [9.5](/tutorial/one-point/separating-waves/#four-waves-over-time-leave-one-combination-of-the-readings-empty); *read now* |
| [](/paper/#eq:wave-count) | [9.5](/tutorial/one-point/separating-waves/#all-three-cases-are-pronys-problem-and-counting-gives-the-limit); *read now*, numbers checked |
| [](/paper/#eq:pixel-kernel) | [9.6](/tutorial/one-point/the-sky-at-one-point/#the-pixel-sees-the-sky-only-up-to-degree-four-68-numbers); *read now* |
| [](/paper/#eq:sky-count) | [9.6](/tutorial/one-point/the-sky-at-one-point/#the-pixel-sees-the-sky-only-up-to-degree-four-68-numbers); *read now*, numbers checked |
| [](/paper/#eq:sky-witness) | [9.6](/tutorial/one-point/the-sky-at-one-point/#a-sky-obeys-an-inequality-that-a-standing-wave-breaks); *read now* |
| [](/paper/#eq:ranging-instant), [](/paper/#eq:ranging-C) | [9.7](/tutorial/one-point/beyond-one-plane-wave/); *read now*, numbers checked |
| [](/paper/#eq:helicity-split) | [9.7](/tutorial/one-point/beyond-one-plane-wave/); *read now*, numbers checked |
| [](/paper/#eq:bianchi-wave), [](/paper/#eq:wave-vector) | [9.7](/tutorial/one-point/beyond-one-plane-wave/); *read now*, counts checked |
| [](/paper/#eq:one-pixel-range) | 7.5, 1.4; *derived here* |
| [](/paper/#eq:depth-bound) | 3.3; *derived here* |
| [](/paper/#eq:magnetic-range) | the paper's [](/paper/#eq:one-pixel-range); *derived here* |

Appendix C's [](/paper/#eq:proof-prony) is derived in chapter 9.5, so with R9 all twenty-six equations of Section VIII
are derived, here or earlier.

::: check
### Q

A person of 70 kg stands 1 m from a pixel whose six neighbours are 10 cm away, read with noise
$10^{-16}\unit{s^{-2}}$. Roughly how well does the pixel find the person's distance?

### A

Here $\rho = 1.14\times10^8$ and $\rho_G = \sqrt{30}\times0.1\rho = 6.3\times10^7$, so $\sigma_r \approx r/\rho_G = 16$
nm.

### Q

Why can a lone pixel not find the distance to a moving mass from its tide alone?

### A

A path twice as large, with a mass eight times larger, gives the same tide at every moment, while the magnetic part
doubles.
:::

**The idea to keep: the second half of Section VIII follows from Part 9 and three short derivations. Several waves at
one point are a sum of squares that one pixel separates, and the magnetic part, which repeats a wave, lets it read a
wave beneath any nearby pull at a price of $\sqrt2$. Neighbours give the depth of a mass, and no single reading can say
what kind of scene it comes from.**

::: problems
### Practice

Rerun the capstone's steps (a) to (c) with the person 1 m from the pixel.

::: solution
$G\matter M/r^3 = 4.67\times10^{-9}\unit{s^{-2}}$ and $\rho = 1.14\times10^8$. Across the line the velocity is read to
$1.5\unit{m\,s^{-1}}$. With $\rho_E = 3.03\times10^8$
and $\rho_G = 6.27\times10^7$, $\sigma_r/r = 1.6\times10^{-8}$, 16 nm, and $\sigma_M/\matter M = 5.0\times10^{-8}$.
:::

### Stretch

Combine 9.2 and 9.4. One reading has $1 - 6J^2/I^3 = 0$ and $\det\curv{\mathcal W} \neq 0$. It may be one body at rest,
or a body with a weak wave travelling along the line to it. Which product of tables decides?

::: solution
Both have the eigenvalues $-2\curv w$, $\curv w$, $\curv w$, with $\curv w = -J/I$. One body is type D, so
$(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w) = 0$. With the line along $\hat x$, the wave adds
$\curv\alpha\,\vect m\vect m^{\mathsf T}$ with $\vect m = (0, 1, i)/\sqrt2$, and since $(\vect m\vect m^{\mathsf T})^2 =
0$ the product becomes $3\curv w\curv\alpha\,\vect m\vect m^{\mathsf T} \neq 0$: type II.
:::

### The paper

Reproduce every number of *Variation across the array* and *Matter at the pixel*.

::: solution
$2\pi\times100/(2.998\times10^8) = 2.1\times10^{-6}$, $3\times1/3 = 1$, $2G\times70/27 =
3.46\times10^{-10}\unit{s^{-2}}$, and $\sqrt6\,G\times70/27 = 4.24\times10^{-10}\unit{s^{-2}}$, $1.5\times10^6$ times
$\sqrt2\times\tfrac12(2\pi\times100)^2\times10^{-21}$; then the three traces
[above](#inside-matter-the-trace-of-the-tide-reads-the-density-there).
:::
:::

::: paper
- Section VIII from [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point) to [*What no reading
  can tell*](/paper/#par:what-no-reading-can-tell): the paper's [](/paper/#eq:pencil) to [](/paper/#eq:wave-vector)
  and Figure [](/paper/#fig:present).
- From [*One pixel and many*](/paper/#par:one-pixel-and-many) to [*Precision of depth*](/paper/#par:precision-of-depth):
  the paper's [](/paper/#eq:one-pixel-range) to [](/paper/#eq:magnetic-range), Table [](/paper/#tab:one-pixel) and
  Figure [](/paper/#fig:separation-noise), with Appendix B's bounds.
:::

::: deeper
- The GR course's [lesson on tidal
  instruments](https://neovand.github.io/general-relativity/chapter-10.html#what-a-tidal-instrument-measures): what a
  small cloud of test masses determines and what it misses.
- R. J. Blakely, *Potential Theory in Gravity and Magnetic Applications* (Cambridge, 1995): **Euler's relation**,
  $(\vect x_s - \vect x)\cdot\nabla f = Nf$ for a field falling as the power $-N$ of the distance from its source at
  $\vect x_s$, which the paper cites for depth.
:::

[^typical]: The paper's $10^{-4}$ radian holds for a typical record: over 200 records the median error is
    $2\times10^{-5}$ rad, and the worst reach $2\times10^{-3}$ rad, where two sources lie a few degrees apart (9.5).

[^even]: The paper's reason for the brightness's 25 numbers, its kernel, gives only 15: the kernel is even in $\hat n$
    and reaches degrees 0, 2 and 4. Degrees 1 and 3 enter through the tide's products with the magnetic part (9.6).

[^phase]: The paper's "within a few per cent at $kr = 80$ … under one per cent at $kr = 200$" holds at the phase $\theta
    = 0$ of its Figure [](/paper/#fig:ranging)(a). Over the whole cycle the next order reaches 10 per cent at $kr = 80$,
    falling as $1/kr$ (9.7).

[^mass]: The paper's "because mass and momentum are conserved": mass alone cancels the first-order term, which would
    err by $kr$, 10 per cent at $kr = 0.1$. Momentum removes a next-order term, $(kd)(kr)$ of the steady tide for an
    orbit of size $d < r$, under 1 per cent there (7.7).

[^rotor]: The paper's "a hundred times its size" and "thirty-five times the true one" need a geometry it does not give:
    99 in the rotor's plane, 21 on its axis, 35.5 in the capstone's (e), and at most 47 over all wave directions,
    within 9.7's bound of $99/2$.

[^letter]: The paper's caption calls this factor $D$, which also names the array's width and a term of the paper's
    [](/paper/#eq:ranging-C). It is a pure number: exactly $\sqrt2 = 1.41$ at one pixel.

[^million]: The paper's "a hundred million times worse than with neighbours" depends on $b/r$, which it does not fix.
    The full bound of the paper's [](/paper/#eq:depth-bound) gives $2.3\times10^7$ at the desk's $b/r = 1/30$,
    $6.6\times10^7$ at 0.1 (its approximation $r/(\sqrt{30}\rho b)$ gives $6.8\times10^7$) and $10^8$ near 0.15.
