---
id: R9b
title: 'One pixel on a desk'
question: 'What does one pixel on a desk learn about a person, a rotor and a passing wave, and what do its neighbours add?'
part: '9'
requires: ['R9', '2.3', '3.3', '6.3', '7.3', '7.5', '9.5', '9.6', '9.7']
paper: [sec:one-pixel, eq:pencil, eq:four-waves, eq:wave-count, eq:pixel-kernel, eq:sky-count, eq:sky-witness, eq:ranging-instant, eq:ranging-C, eq:helicity-split, eq:bianchi-wave, eq:wave-vector, eq:one-pixel-range, eq:depth-bound, eq:magnetic-range, fig:present, fig:separation-noise, tab:one-pixel, app:benchmarks]
figures: [fig:present, fig:separation-noise]
live: [present]
---

A pixel on a desk records ten numbers. Beside it a person sits, a rotor turns and a wave passes. How many waves can one
pixel separate, how much of the sky does it see, how far away can it place a mass, and which scenes can no single
reading tell apart?[^sec] A reading's signal-to-noise ratio is $\sym{reading-snr}{\rho}$.

::: plain
One pixel separates up to four waves that cross it together, where light separates two, and reads 68 numbers of a sky
of many sources. Neighbours add depth: the ratio of a mass's tide to its change from place to place gives the distance.
:::

## One pixel separates up to four waves, and light two

Waves that cross the pixel together add their squares, $\curv{\mathcal W} = \sum_a\curv\alpha_a\vect m_a\vect
m_a^{\mathsf T}$ (section 9.1). Two waves give a reading of rank two, so $\det\curv{\mathcal W} = 0$, and the vector
$\vect m_1\times\vect m_2$ that the reading sends to zero leads to both
([section 9.5](/tutorial/one-point/separating-waves/#two-waves-give-a-reading-of-rank-two-and-the-vector-it-sends-to-zero-leads-to-both);
that every such reading has this form is Sylvester's converse). At one frequency, with the reading's two parts
$\curv{\mathcal W}_\pm$ (the parts at $e^{\mp i\omega t}$), three waves are the roots $\lambda$ of

$$\begin{aligned}\det(\curv{\mathcal W}_+ - \lambda\,\curv{\mathcal W}_-) ={}& \det[\vect m_1, \vect m_2, \vect m_3]^2\\
&\times\prod_{a=1}^{3}(\curv\alpha^+_a - \lambda\,\curv\alpha^-_a)
\end{aligned}$$

([section 9.5](/tutorial/one-point/separating-waves/#three-waves-of-one-frequency-are-three-roots-of-one-pencil)). A
binary seen at the inclination $\iota$ has $|\lambda| = \tan^{\pm4}(\iota/2)$: 194 or its inverse at 30°, 9 or $\tfrac19$
at 60°. Over time, four waves leave one combination $A$ of the readings empty, and each direction solves
$\vect m^{\mathsf T}A\,\vect m = 0$, $\vect m\cdot\vect m = 0$, two conics that meet in four points ([section 9.5](/tutorial/one-point/separating-waves/#four-waves-over-time-leave-one-combination-of-the-readings-empty)).
All three cases are Prony's problem [@KunisPeterRomerOhe2016]: for a field of spin $s$ read in $L$ independent
snapshots, at most

$$N_{\max} = \Bigl\lfloor\frac{L(2s + 1)}{L + 1}\Bigr\rfloor$$

waves can be separated. For $s = 1$, 2 and 4 this gives 1, 2, 2; 2, 3, 4; and 4, 6, 8 at one instant, at one frequency
and over a long record. With noise of $10^{-4}$ of the
signal, four waves are typically located to $10^{-4}$ radian from three hundred readings.[^typical] From second moments
alone, one pixel separates five uncorrelated sources whose circular fractions differ
([section 9.5](/tutorial/one-point/separating-waves/#uncorrelated-sources-separate-from-their-average-brightness-and-circular-polarization)).

The images of a lensed chirp fall in separate cells of time and frequency, where the pixel reads one wave
([section 9.5](/tutorial/one-point/separating-waves/#lensed-images-fall-in-separate-cells-of-time-and-frequency)). One
wave is placed to $1/\rho$ radian (section 9.7), so an arcsecond, $4.85\times10^{-6}$ rad, needs $\rho =
2.06\times10^5$. An aperture would need the wavelength at 100 Hz over that angle, $3.0\times10^6\unit{m}/4.85\times10^{-6}$,
which is 4.1 astronomical units.

## One pixel reads 68 numbers of a sky of independent sources

A sky of independent sources overlapping in frequency is averaged into the pixel's **spectral matrix**, the mean
products of its ten numbers at one frequency: one hundred real numbers, in blocks for brightness and for circular and
linear polarization
([section 9.6](/tutorial/one-point/the-sky-at-one-point/#the-pixels-spectral-matrix-splits-into-three-blocks-by-helicity)).
The brightness enters through the kernel

$$\begin{gathered}\sum_{A=+,\times}e^A_{ij}\,e^A_{kl} = P_{ik}P_{jl} + P_{il}P_{jk} - P_{ij}P_{kl},\\
P_{ij} = \delta_{ij} - \hat n_i\hat n_j,\end{gathered}$$

with $e^A_{ij}$ the two polarization tables, $e^A_{ij}e^A_{ij} = 2$, a polynomial of degree four in $\hat n$ and even,
which reaches the brightness's degrees 0, 2 and 4, fifteen numbers. The cross terms of the tide and the magnetic part
are odd and reach degrees 1 and 3, the other ten. So the pixel sees twenty-five numbers of the brightness and as many of
the circular polarization, and, since the linear polarization has spin weight four, eighteen of that:

$$25 + 25 + 18 = 68$$

numbers of the sky, and the other 32 are checks. For spin $s$ the count is $2(2s + 1)^2 + 2(4s + 1)$: 68 of 100 at $s = 2$ and 28 of 36 at
$s = 1$. Sound's 9 of 16 are $1 + 3 + 5$, degrees 0, 1 and 2. Every sky obeys an inequality that a standing
wave breaks ([section 9.6](/tutorial/one-point/the-sky-at-one-point/#a-sky-obeys-an-inequality-that-a-standing-wave-breaks)).[^sky]

## A near source is ranged by the tilt between its helicities

A source at a finite distance spoils the square. Its field **peels** into parts falling as $1/r$, $1/r^2$, $1/r^3$ and
beyond [@Sachs1962]. The first correction only tilts the null vector, so at one instant the oscillating part's second singular value over its
first is of second order in $1/kr$, with $\sym{reduced-distance}{kr}$ the distance
in reduced wavelengths $c/\omega$ (477 km at 100 Hz):

$$\frac{s_2}{s_1} = \frac{C(\iota, \theta)}{(kr)^2} + O\bigl((kr)^{-3}\bigr).$$

For a turning pair at the inclination $\iota$ and wave phase $\theta$,

$$\begin{gathered}C = \frac{2\sin^2\!\iota\,\sqrt{A^2 + B^2}}{Z}, \qquad B = 2\cos\iota\,\sin\theta\cos\theta,\\
A = (1 - 3\cos^2\!\iota)\cos^2\!\theta - 4\cos^2\!\iota\,\sin^2\!\theta,\\
Z = (1 + \cos^2\!\iota)^2\cos^2\!\theta + 4\cos^2\!\iota\,\sin^2\!\theta
\end{gathered}$$

([section 9.7](/tutorial/one-point/beyond-one-plane-wave/#a-nearby-source-spoils-the-square-only-at-second-order)).
Edge-on, $C(90°, \theta) = 2$, and $C(\iota, 0)$ vanishes at $\cos^2\iota = \tfrac13$, $\iota = 54.7°$.[^phase]

The pair's mass also makes a steady tide $G\matter M/r^3$, $(c/v)^2$ times larger than the departure, which is
$(kr)^{-2}$ of the wave's tide $\omega^2G\matter Mv^2/c^4r$, with $v$ the speed of each mass. Reading the oscillating
part from $\dot{\curv{\mathcal W}}$ removes it. Over a cycle the two
helicities tilt apart by

$$\Delta\theta_\pm = \frac{8\,|\cot\iota|}{kr},$$

0.069 rad at $kr = 200$ and $\iota = 30°$. At $\rho = 10^3$ and 60° the split equals its own error at $kr = 507$
(section 9.7), $2.4\times10^5$ km at 100 Hz.

## The field of a moving body points at where the body is now

The stretch axis of a steadily moving body's tide points at its present position, at any speed
([section 9.3](/tutorial/one-point/the-matrix-w/#how-large-the-magnetic-part-is-and-where-the-field-points), from the
steady field of [section 6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now)).
So the gravitational Sun runs ahead of the optical Sun by the Earth's orbital speed over $c$, $29.8\unit{km\,s^{-1}}/c =
9.94\times10^{-5}$ rad, which is $20.5''$. Near two masses in orbit at $kr = 0.1$, Newton's tide of their present
positions misses the changing field by 0.14 per cent in the orbit's plane and 0.5 per cent on its axis, and their
retarded positions by $kr$, 10 per cent
([section 7.7](/tutorial/geometry/quadrupole-formula/#near-a-slow-source-the-field-points-at-where-the-masses-are-now)).[^mass]

{{paper fig:present}}

::: try {#present}
Predict first: when the moving body stops, does the stretch axis at the pixel turn at once to where the body stopped,
or later? Then stop it, and watch where the field turns first and how the change spreads.
:::

## One reading gives a wave's speed and all six polarizations

Other metric theories allow up to six polarizations and other phase speeds $v_p$. For any plane wave of a metric theory
the second Bianchi identity gives, with no field equations assumed,

$$\curv\tB_{ij} = \frac{c}{v_p}\,\epsilon_{ipq}\hat k_p\,\curv\tE_{qj}$$

([section 9.7](/tutorial/one-point/beyond-one-plane-wave/#the-second-bianchi-identity-ties-a-metric-waves-magnetic-part-to-its-tide)).
With a trace, $\curv\tE$ holds six numbers, and $\curv\tB$, no longer symmetric, eight; nine unknowns (direction, speed,
six polarizations) leave $14 - 9 = 5$ checks. Summing the cross products of matching columns $\vect e_j$ of $\curv\tE$
and $\vect b_j$ of $\curv\tB$ gives, for $\vect p = (c/v_p)\hat k$,

$$\bigl(|\curv\tE|^2 - \curv\tE^2\bigr)\,\vect p = \sum_j\vect e_j\times\vect b_j,$$

solvable when $\curv\tE$ has rank two or more. With $n = c/v_p$, a massive graviton's helicity-zero wave has its
longitudinal and breathing amplitudes in the ratio $-2(1 - n^2)$ and a massive scalar's in $+(1 - n^2)$: $-1.28$ and
$0.64$ at $n = 0.6$.[^tests]

## Inside matter the trace of the tide reads the density there

The trace of the tide is $\mathrm{tr}\,\curv\tE = 4\pi G[\matter\rho + (\matter p_1 + \matter p_2 + \matter p_3)/c^2]$,
with $\matter\rho$ the density and $\matter p_a$ the principal stresses
([section 7.3](/tutorial/geometry/einstein-equation/#pressure-and-stress-gravitate)). A frame turning at the rate
$\Omega$ subtracts $2\Omega^2$, the trace of the pseudo-tide of
[section 1.4](/tutorial/newton/tides/#on-the-ground-the-earths-own-tide-is-far-larger-but-steady). Three cases:

- the dark matter's $0.4\unit{GeV\,cm^{-3}}$ is $7.13\times10^{-22}\unit{kg\,m^{-3}}$, and $4\pi G\matter\rho =
  5.98\times10^{-31}\unit{s^{-2}}$;
- between plates $d = 1\unit{\mu m}$ apart, the Casimir energy density $-\pi^2\hbar c/720d^4 =
  -4.33\times10^{-4}\unit{J\,m^{-3}}$ (section 6.5) is the mass density $\matter\rho_{\rm cas} =
  -4.82\times10^{-21}\unit{kg\,m^{-3}}$; its stresses, $3\matter\rho_{\rm cas}c^2$ across the plates and $-\matter\rho_{\rm
  cas}c^2$ twice along them, add to $\matter\rho_{\rm cas}c^2$, so the trace is $8\pi G\matter\rho_{\rm cas} =
  -8.09\times10^{-30}\unit{s^{-2}}$;
- the cosmological constant, $1.1\times10^{-52}\unit{m^{-2}}$, gives $-\Lambda c^2 = -9.9\times10^{-36}\unit{s^{-2}}$.

Radiation of energy flux $\matter{\vect F}$, in $\mathrm{W\,m^{-2}}$, gives the trace $8\pi G|\matter{\vect
F}|/c^3$ and $\curv\tB_{[ij]} = -(4\pi G/c^3)\epsilon_{ijk}\matter F_k$
([section 7.5](/tutorial/geometry/gravitomagnetism/#moving-matter-makes-the-magnetic-part-through-the-potential-of-its-flow)).

## Two masses and two waves can give the same ten numbers

A mass on the $y$ axis has the tidal weight $G\matter M/r^3 = a$, in $\mathrm{s^{-2}}$, and a mass on the $z$ axis has
$2a$. Each stretches along its line by twice its weight and squeezes across it by its weight
([section 1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)), so

$$\begin{aligned}&a\,\mathrm{diag}(1, -2, 1) + 2a\,\mathrm{diag}(1, 1, -2)\\
&\quad= a\,\mathrm{diag}(3, 0, -3),\end{aligned}$$

with $\curv\tB = 0$. Two equal plus waves along $+\hat y$ and $-\hat y$, each with the tide $\tfrac32a\,\mathrm{diag}(1,
0, -1)$ at its crest, add at an antinode to the same table, and their magnetic parts, opposite in sign, cancel (a
[standing wave](/tutorial/one-point/reading-section-viii/#the-magnetic-part-equals-the-tide-in-a-wave-and-is-small-near-slow-matter)).
The ten numbers agree.

More is true. A positive shell whose density holds only degrees 0 and 2 makes a constant tide $\curv\tE_0$ inside it
(section [2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics)), here
with $\curv\tE_0\hat y = 0$. Two pulses along $\pm\hat y$, each with the tide $\tfrac12\curv\tE_0f(u)$, match it
with the profile $f(u) = [1 - 2m(u/\tau)^{2m}]e^{-(u/\tau)^{2m}}$, where $u = t \mp y/c$ is each pulse's time of
passage, $\tau$ its duration and $m$ a whole number. This $f$ is the derivative of $ue^{-(u/\tau)^{2m}}$, so $\int
f\,\dd u = 0$, and by parts $\int uf\,\dd u = -\int ue^{-(u/\tau)^{2m}}\,\dd u = 0$, an odd integrand, so no strain is left
behind. Near $u = 0$, $f = 1 - (2m + 1)(u/\tau)^{2m} + \dots$, so the pulses match a constant tide through order $2m -
1$, at least $N$ when $2m > N$. A record over time, an aperture, or knowing the sources tells such scenes apart.

Nor does the type count bodies: two masses on a line are type D, like one, and the table with rows $(0, 0, 1)$, $(0, 0,
i)$ and $(1, i, 0)$ has $I = J = 0$, rank two, $\curv{\mathcal W}^2 \neq 0$ and $\curv{\mathcal W}^3 = 0$: type III
(sections [9.2](/tutorial/one-point/complex-symmetric/#six-shapes-told-apart-by-what-the-tables-powers-do) and
[9.4](/tutorial/one-point/petrov/#the-pattern-of-the-four-directions-is-the-fields-petrov-type)).

## The spin-two weight removes an array's false fringes

Since $N$ pixels have $5N$ numbers per steering vector, a subspace method separates up to $5N - 1$ uncorrelated
sources, against $N - 1$ for scalar sensors and $3N - 1$ for sensors of light. Two pixels give a fringe at the angle
$\vartheta$ from the source the weight $\cos^8(\vartheta/2)$, the spin-two envelope of a sparse array
([section 9.1](/tutorial/one-point/spin-two/#two-squares-overlap-less-than-two-vectors)). For two pixels $D$ apart,
Capon's minimum-variance estimator lifts the true fringe above the next false one by $1 + \rho^2[1 -
\cos^8(\vartheta_1/2)]$, with the fringe spacing $\vartheta_1 = c/(fD)$ at broadside for the frequency $f$. At a hundred
wavelengths, $1 - \cos^8(0.005) = 1.00\times10^{-4}$, so the factor is 2 at $\rho = 100$; at 55° from broadside the next
fringes lie $1.72\,c/(fD)$ and $1.77\,c/(fD)$ away, about 1.8.

## Across one metre a wave is uniform and a person is not

Across an array of width $D = 1$ m, a wave at $f = 100$ Hz of wavelength $c/f = 3.0\times10^6$ m varies by $2\pi Df/c =
2.1\times10^{-6}$, while a person 3 m away varies by $3D/r = 1$. The person adds to the array's average the tide's largest
eigenvalue $2G\matter M/r^3 = 3\times10^{-10}\unit{s^{-2}}$. In size $|\curv\tE|$ (section 1.5) the person's tide,
$4.24\times10^{-10}\unit{s^{-2}}$, is $1.5\times10^6$ times that of a wave of strain $\field h = 10^{-21}$ at 100 Hz,
$\sqrt2\times\tfrac12\omega^2\field h = 2.79\times10^{-16}\unit{s^{-2}}$: a million times. Modelling nearby masses from
their variation removes **Newtonian noise**, the changing pull of an observatory's surroundings
([section 8.6](/tutorial/quantum/quantum-limit/#each-kind-of-detector-reads-its-own-part-of-the-tide)), which is how
observatories plan to remove it [@Harms2019; @Chaibi2016]. The magnetic part is a second way (section 9.7). A third
needs no model: two arrays far apart both see a wave, the second later by the travel time between them along its
direction, while a nearby mass appears in one only. A person 3 m from one array is $(3\unit{m}/3000\unit{km})^3 =
10^{-18}$ as strong at a second array 3000 km away, a tide of $4\times10^{-28}\unit{s^{-2}}$, far below the wave's.

## Neighbours give depth, and the magnetic part ranges a moving mass

A mass's tide falls as $\matter M/r^3$ and its gradient as $\matter M/r^4$, so their ratio gives $r$ and then $\matter
M$. Exactly, $r = \sqrt{15}\,|\curv\tE|/|\nabla\curv\tE|$, because $|\curv\tE|^2 = 6(G\matter M)^2/r^6$ and
$|\nabla\curv\tE|^2 = 90(G\matter M)^2/r^8$.[^euler] A calibration rotor's distance from a detector's mirror is found
in the same way, from the ratio of two of its multipoles [@Inoue2018].

**Euler's relation gives the 15.** Each entry of a mass's tide is homogeneous of degree $-3$ about the mass at $\vect
x_s$: $\curv\tE(\vect x_s + \lambda\vect y) = \lambda^{-3}\curv\tE(\vect x_s + \vect y)$. Differentiating with respect
to $\lambda$ at $\lambda = 1$ gives $(\vect x - \vect x_s)\cdot\nabla\curv\tE = -3\curv\tE$, so along the line from the
mass the tide changes at the rate $\partial_r\curv\tE = -3\curv\tE/r$, and the radial derivative alone gives $r =
3|\curv\tE|/|\partial_r\curv\tE|$, with $|\partial_r\curv\tE|^2 = 9|\curv\tE|^2/r^2 = 54(G\matter M)^2/r^8$. Across
the line, along a unit vector $\vect e$ at right angles to the unit vector $\hat n$ from the mass, only the direction
turns, $\partial_{\vect e}\hat n = \vect e/r$, so the tide $(G\matter M/r^3)(1 - 3\hat n\hat n^{\mathsf T})$ changes at
the rate $-(3G\matter M/r^4)(\vect e\hat n^{\mathsf T} + \hat n\vect e^{\mathsf T})$, of squared length $18(G\matter
M)^2/r^8$. Two such directions and the radial one give $36 + 54 = 90$. So $|\nabla\curv\tE|^2 =
\tfrac53|\partial_r\curv\tE|^2 = 15|\curv\tE|^2/r^2$: the gradient's full length carries the radial derivative and a
fixed share across it.

A single pixel can range a moving mass without neighbours, but only through its magnetic part, because the tide has no
scale: doubling the path and making the mass eight times larger leaves $\curv\tE \propto \matter M/r^3$ unchanged, while the
speed doubles, and so does $\curv\tB \propto \matter Mv/cr^3$. Let $\hat n$ point from the pixel to the mass, with
$\vect v$ the mass's velocity, $\vect v_\perp$ its part across $\hat n$, and $P = 1 - \hat n\hat n^{\mathsf T}$ the table
that removes the part along $\hat n$. The magnetic part of a moving mass (section 7.5) is $\curv\tB\hat n =
(3G\matter M/cr^3)\,\hat n\times\vect v$. The tide of section 1.4, $\curv\tE = (G\matter M/r^3)(1 - 3\hat n\hat
n^{\mathsf T})$, gives $\curv\tE\hat n = -2(G\matter M/r^3)\hat n$, and differentiating in time, with $\dot{\hat
n}\cdot\hat n = 0$,

$$\dot{\curv\tE}\hat n = \frac{6G\matter M\dot r}{r^4}\,\hat n - \frac{3G\matter M}{r^3}\,\dot{\hat n} .$$

$P$ removes the first term, which lies along $\hat n$. The second comes from the line to the mass turning, at the rate
$\dot{\hat n} = \vect v_\perp/r$, so $P\dot{\curv\tE}\hat n = -(3G\matter M/r^4)\,\vect v_\perp$. Since $\hat
n\times(\hat n\times\vect v) = -\vect v_\perp$,

$$\hat n\times(\curv\tB\hat n) = \frac{r}{c}\,P\dot{\curv\tE}\hat n, \qquad r = c\,\frac{|\curv\tB\hat n|}{|P\dot{\curv\tE}\hat n|},$$

for both sides equal $-(3G\matter M/cr^3)\vect v_\perp$. Reversing $\hat n$ reverses only the right side, so the sign that
makes $r$ positive fixes $\hat n$. Motion straight on gives instead the [time to
contact](/tutorial/one-point/reading-section-viii/#one-pixel-reads-the-position-velocity-and-mass-of-a-moving-body).

## The full table tells front from back

A mass mirrored in the plane $z = 0$ of a flat array has the tide $\curv\tE_{ij} = G\matter M(r^2\delta_{ij} -
3x_ix_j)/r^5$, with $\vect x$ from the mass to the pixel. Mirroring reverses $x_z$, which enters $\curv\tE_{zz}$ twice
and $\curv\tE_{xz}$, $\curv\tE_{yz}$ once: the first is unchanged, the others change sign. In three dimensions,
pixels outside the matter keep the [ambiguity](/tutorial/outside/null-space/) of section 2.5.

## The table sums up the pixel

With independent noise $\sigma_n$, in $\mathrm{s^{-2}}$, on each of the ten numbers in the orthonormal basis of
[section 1.5](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length),
$\rho = |\curv{\mathcal W}|/\sigma_n$. One wave is placed to $1/\rho$ radian, and by a sensor of light to
$\sqrt2/\rho$
([section 9.7](/tutorial/one-point/beyond-one-plane-wave/#one-waves-direction-is-known-to-1ρ-a-factor-2-better-than-lights)).

| At one point | Sound | Light | Gravity |
|---|---|---|---|
| numbers recorded | 4 | 6 | 10 |
| numbers no observer changes | – | 2 | 4 |
| own velocity, components | – | 2 | 3 |
| waves: one instant, one frequency, over time | 1, 2, 2 | 1, 2, 2 | 2, 3, 4 |
| sky numbers (of) | 9 (16) | 28 (36) | 68 (100) |
| direction of one wave | – | $\sqrt2/\rho$ | $1/\rho$ |

## A near field costs √2, and the shape test rarely errs

A wave at 100 Hz of strain $10^{-21}$ (tide $2.79\times10^{-16}\unit{s^{-2}}$ in size) lies beside a rotor 3 m away: two
1 kg masses 12 cm apart turning fifty times a second. In the rotor's plane its tide at 100 Hz is 99 times the wave's
(section 9.7).[^rotor]

The nearest wave to a mass's tide, and the nearest mass to a wave's, lie at half the reading's size, so one reading puts
the two shapes $\rho_E/2$ noise deviations apart, with $\rho_E = |\curv\tE|/\sigma_n$ the tide's own
signal-to-noise ratio
([section 9.7](/tutorial/one-point/beyond-one-plane-wave/#the-shape-of-the-tide-tells-a-wave-from-a-mass-at-half-its-size)).
Fitting both shapes, the mass kept positive, to millions of simulated readings at $\rho_E = 12$ takes a mass for a wave
about once in 140 readings and a wave for a mass about once in 1350.

A near field of any tide and no magnetic part costs the wave's amplitude exactly $\sqrt2$: the wave is read from its
magnetic part alone
([section 9.7](/tutorial/one-point/beyond-one-plane-wave/#a-near-field-costs-the-waves-amplitude-exactly-2-however-strong-it-is)).
The rotor's magnetic part, $0.31\,kr$ of its tide with $kr = 2\pi\times100\times3\unit{m}/c = 6.3\times10^{-6}$,
shifts the wave's estimate by $9\times10^{-5}$. An array of seven pixels a metre across, which must fit the rotor as a
point quadrupole from its variation, pays a factor that grows as $r/b$: 2.2 from the tide alone and 1.26 with the
magnetic part as well
([section 9.7](/tutorial/one-point/beyond-one-plane-wave/#an-array-that-reads-only-the-tide-pays-more-in-proportion-to-rb)).

## The neighbours range a mass to a part in a million, and masses on one line read as one

The Cramér–Rao bounds on range and mass are

$$\Bigl(\frac{\sigma_r}{r}\Bigr)^2 = \frac{1}{\rho_E^2} + \frac{1}{\rho_G^2}, \qquad
\Bigl(\frac{\sigma_M}{\matter M}\Bigr)^2 = \frac{16}{\rho_E^2} + \frac{9}{\rho_G^2},$$

with $\sym{field-snr}{\rho_E}$ and $\sym{gradient-snr}{\rho_G}$ the signal-to-noise ratios of the tide and of its
gradient over all the readings. They follow from the rule of
[section 3.3](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks)
that independent errors add in square. Up to constants, $\ln|\curv\tE| = \ln\matter M - 3\ln r$ and
$\ln|\nabla\curv\tE| = \ln\matter M - 4\ln r$, read to $1/\rho_E$ and $1/\rho_G$. So $\ln r$ is their difference and
$\ln\matter M = 4\ln|\curv\tE| - 3\ln|\nabla\curv\tE|$, with the variances $1/\rho_E^2 + 1/\rho_G^2$ and $16/\rho_E^2 +
9/\rho_G^2$; the unknown direction does not enlarge them. Six neighbours at the
distance $b$, two on each axis, give seven readings. When **the neighbours are close, $b \ll r$**, all seven read one
tide, so $\rho_E = \sqrt7\,\rho$, and a difference across $2b$ reads each of the gradient's fifteen numbers with noise
$\sigma_n/\sqrt2b$, so $\rho_G = (\sqrt{15}|\curv\tE|/r)(\sqrt2b/\sigma_n) = \sqrt{30}\,\rho b/r$.

**Whatever the direction.** The Fisher matrix (section 3.3) is built from the changes of the readings with each unknown,
and its entries are their inner products. A small turn of the line to the mass changes $\curv\tE$ by a turned copy and
leaves its length alone, so the change is orthogonal to $\curv\tE$: $\delta|\curv\tE|^2 = 2\langle\curv\tE,
\delta\curv\tE\rangle = 0$. The same holds for $\nabla\curv\tE$. A change of $\ln\matter M$ or $\ln r$ changes
$\curv\tE$ along itself (by $\curv\tE$ and $-3\curv\tE$) and $\nabla\curv\tE$ along itself (by $\nabla\curv\tE$ and
$-4\nabla\curv\tE$). So the rows of the two angles are orthogonal to those of $\ln\matter M$ and $\ln r$, the direction
decouples, and the bounds depend only on $|\curv\tE|$ and $|\nabla\curv\tE|$, which are the same in every direction.
Noise of the same size on every number prefers no direction, so nothing else enters.

**A number.** A person 3 m away, with neighbours 0.5 m out, has $b/r = 1/6$, so $\rho_E^2 = 7\rho^2$ and $\rho_G^2 =
30\rho^2/36$:

$$\frac{\sigma_r}{r} = \Bigl(\frac17 + \frac{36}{30}\Bigr)^{1/2}\frac{1}{\rho} = \frac{1.16}{\rho},\qquad
\frac{\sigma_M}{\matter M} = \Bigl(\frac{16}{7} + \frac{9\times36}{30}\Bigr)^{1/2}\frac{1}{\rho} = \frac{3.62}{\rho} .$$

At $b = r/6$ the stencil is no longer small, and the field curves across it. The Cramér–Rao bound of the full model, the
inverse of the Fisher matrix of $\ln\matter M$, $\ln r$ and the two angles built from the seven exact readings, gives
$\sigma_r/r$ between $0.90/\rho$ and $1.08/\rho$, depending on the direction, against the closed form's $1.16/\rho$: a
wider stencil gains from the curvature of the field across it
([Appendix A.1](/tutorial/appendices/numerical-methods/)).[^bench]

Without neighbours, the magnetic range has

$$\frac{\sigma_r}{r} = \frac{1}{\rho_B},$$

with $\sym{magnetic-snr}{\rho_B} = (\sqrt3\,v_\perp/c)\,\rho$, since the magnetic part is that much smaller than the tide
(section 9.3). If **the tide and its rate of change are read far better than $\curv\tB$**, then $r = c|\curv\tB\hat
n|/|P\dot{\curv\tE}\hat n|$ carries the fractional error of $|\curv\tB\hat n|$ alone. A moving mass's $\curv\tB$ lies
along one table of length one, $(\hat n\vect s^{\mathsf T} + \vect s\hat n^{\mathsf T})/\sqrt2$ with $\vect s$ the unit
vector along $\hat n\times\vect v$, so $|\curv\tB\hat n| = |\curv\tB|/\sqrt2$ is read to the fraction $1/\rho_B$. For a
walker at $1.4\unit{m\,s^{-1}}$, $\sqrt3\,v_\perp/c = 8.09\times10^{-9}$, so $\sigma_r/r = 1.2\times10^8/\rho$.[^million]

Bodies on one line read as one at $\sym{effective-depth}{r_{\rm eff}} = \sum_i\matter M_ir_i^{-3}/\sum_i\matter
M_ir_i^{-4}$. Two equal masses at $r \pm \Delta/2$ give $r - \Delta^2/r$ to second order. They are told apart only
beyond about $0.7(r^2/b)/\rho^{1/2}$ (the next section). A round body of any size is a
point ([section 1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)).

**Why one body.** Put the pixel at the origin and masses $\matter M_i$ on the $z$ axis at the distances $r_i$, all on
one side. Near the pixel, $|\vect x| < r_i$, each mass's potential expands in growing harmonics
([section 2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics)), and
on the axis only the axial ones appear:

$$\field\Phi(\vect x) = -G\sum_{\ell}S_\ell\,|\vect x|^\ell P_\ell(\cos\vartheta),\qquad S_\ell =
\sum_i\frac{\matter M_i}{r_i^{\ell + 1}},$$

with $P_\ell$ the Legendre polynomials, $\vartheta$ the angle from the axis and $S_\ell$ (local) in
$\mathrm{kg\,m^{-(\ell + 1)}}$. Each degree has the same pattern whatever the masses are; only its weight $S_\ell$
depends on them. The tide at the pixel is the degree-2 part, its gradient the degree-3 part and its second derivatives
the degree-4 part. One mass $\matter M$ at $r$ has $S_\ell = \matter M/r^{\ell + 1}$, so it matches $S_2$ and $S_3$ when
$\matter M/r^3 = S_2$ and $\matter M/r^4 = S_3$: at $r_{\rm eff} = S_2/S_3$, the formula above, with $\matter M_{\rm eff}
= r_{\rm eff}^3S_2$.

**Where it appears.** Let the masses lie at $r_i = r + s_i$ about their mass-weighted mean depth $r$, so that $\langle
s\rangle = 0$, with $\langle\cdot\rangle$ the mean weighted by mass. With $u_i = \ln(r_i/r)$, $S_\ell =
r^{-(\ell+1)}\sum_i\matter M_ie^{-(\ell + 1)u_i}$, and to second order in the spread the logarithm of a mean of
exponentials is $\ln\langle e^{-(\ell + 1)u}\rangle = -(\ell + 1)\langle u\rangle + \tfrac12(\ell + 1)^2V$, with $V$ the
variance of $u$. So $\ln(r_{\rm eff}/r) = \ln(S_2/rS_3) = \langle u\rangle - \tfrac72V$. Since $u \approx s/r -
s^2/2r^2$, $\langle u\rangle \approx -\langle s^2\rangle/2r^2$ and $V \approx \langle s^2\rangle/r^2$, so

$$\boxed{\;r_{\rm eff} = r - \frac{4\langle s^2\rangle}{r} .\;}$$

Two equal masses at $r \pm \Delta/2$ have $\langle s^2\rangle = \Delta^2/4$, which gives $r - \Delta^2/r$ again. A uniform
rod of length $L$ along the line has $\langle s^2\rangle = L^2/12$, the mean of $s^2$ from $-L/2$ to $L/2$, so it
appears as a point $L^2/3r$ nearer than its centre: a rod a metre long centred 3 m away appears at 2.89 m.

## The second derivatives tell two bodies on one line from one

**The spread shows at degree four.** One body with the weights $S_2$ and $S_3$ would have $S_4 = \matter M_{\rm
eff}/r_{\rm eff}^5 = S_3^2/S_2$. For the line, by the same expansion, $\ln(S_4S_2/S_3^2) = \tfrac12V(25 + 9 - 32) = V$,
the means cancelling ($-5 - 3 + 8 = 0$). So the line's second derivatives exceed one body's by the share $q =
\langle s^2\rangle/r^2$ (local), a pure number, and nothing else changes, since the pattern of degree four is fixed.

**How well seven pixels read it.** Field and gradient fix $\matter M_{\rm eff}$ and $r_{\rm eff}$ far better than the
curvature is read, so $q$ is the one unknown left in the second derivatives. Across the six neighbours the tide expands
as $\curv\tE(\pm b\hat e_a) = \curv\tE_0 \pm b\,\partial_a\curv\tE + \tfrac12b^2\partial_a^2\curv\tE + \dots$, so the sum
of two opposite readings, $2\curv\tE_0 + b^2\partial_a^2\curv\tE$, carries the second derivative along that axis, with
noise $\sqrt2\,\sigma_n$ on each number. The three second derivatives add to zero in empty space, so a change of them
moves the three sums in a pattern orthogonal to that of $\curv\tE_0$ and does not trade against it. With
$\partial_a^2\curv\tE = (1 + q)\times$ one body's, the Fisher information on $q$ is $b^4\sum_a|\partial_a^2\curv\tE|^2/
2\sigma_n^2$, and $q$ is read to $1/\rho_H$ (local), with

$$\rho_H^2 = \frac{b^4}{2\sigma_n^2}\sum_{a}|\partial_a^2\curv\tE|^2 .$$

For one mass, $\partial_a^2\curv\tE$ is $G\matter M$ times four derivatives of $1/R$, and its squared length is
$(G\matter M)^2(234 - 180n_a^2 + 810n_a^4)/r^{10}$, with $n_a$ the components of $\hat n$. Two cases check it. Along
the line ($n_a = 1$, the axis $z$) the table is $(G\matter M/r^5)\,\mathrm{diag}(-12, -12, 24)$, since $\partial_z^4(1/z)
= 24/z^5$ and the tide has no trace: the squared length is $864 = 234 - 180 + 810$. Across it ($n_a = 0$) it is
$(G\matter M/r^5)\,\mathrm{diag}(9, 3, -12)$, with the squared length 234. Summing over the three axes with $\sum_an_a^2
= 1$, and using $\rho^2 = 6(G\matter M)^2/r^6\sigma_n^2$,

$$\boxed{\;\rho_H = \rho\,\Bigl(\frac{b}{r}\Bigr)^2\Bigl(43.5 + 67.5\sum_an_a^4\Bigr)^{1/2} .\;}$$

The sum $\sum_an_a^4$ runs from $\tfrac13$, toward a diagonal of the stencil, to 1, along one of its axes, so $\rho_H$
lies between 8.1 and 10.5 times $\rho(b/r)^2$.

**Two from one.** Two equal masses $\Delta$ apart have $q = \Delta^2/4r^2$. At one standard deviation, $q = 1/\rho_H$,
so they are told from one body when

$$\Delta > \frac{2r}{\rho_H^{1/2}} = \frac{2}{(43.5 + 67.5\sum_an_a^4)^{1/4}}\,\frac{r^2/b}{\rho^{1/2}} ,$$

between $0.62$ and $0.70$ times $(r^2/b)/\rho^{1/2}$. The separation falls only as the square root of $\rho$, as it does
for two masses side by side.

**The three panels.** In the figure, (a) is the factor on the wave's error: $\sqrt2$ at one pixel from $\curv\tE$ and
$\curv\tB$ with any near field, and, for the array fitting the rotor as a point quadrupole, 2.17 from the tide alone and
1.26 with the magnetic part at $b = r/6$, the first growing as $r/b$ and crossing $\sqrt2$ at $b = 0.29\,r$. Panel (b) is
the range, $0.90/\rho$ to $1.08/\rho$ for the full model against the closed form's $1.16/\rho$ at $b = r/6$; panel (c) is
$\Delta_{\min}$, $0.62$ to $0.70$ times $(r^2/b)/\rho^{1/2}$. Maximum-likelihood fits to simulated noisy readings, 2000
for each point of (a) and $10^4$ in (b) and (c), scatter as the bounds say.

{{paper fig:separation-noise}}

## The capstone: one pixel on a desk

A pixel on a desk has six neighbours 10 cm away. A person of 70 kg stands 3 m away, a rotor turns 3 m away with the
pixel in its plane, and a wave at 100 Hz of strain $10^{-21}$ passes (Figure [](#fig:read-viii-2-desk)). We choose the noise:
$\sigma_n = 10^{-16}\unit{s^{-2}}$ on each coefficient in the person's slow band, and a record at 100 Hz long enough
that the wave's whole reading has $\rho = |\curv{\mathcal W}|/\sigma_n = 12$.

![Look first at the two objects 3 m from the pixel. With its six neighbours the pixel weighs the person to a quarter of
a gram and finds the distance to 3.9 µm; alone it cannot find the distance at all. It reads the wave beneath a rotor 99
times stronger at a price of $\sqrt2$: the amplitude to 12% instead of 8.3%, and the direction to 6.8° instead of
4.8°. Distances not to scale.](tut-read-viii-2-desk){#fig:read-viii-2-desk}

**(a) The person's tide.** $G\matter M/r^3 = 1.73\times10^{-10}\unit{s^{-2}}$, and $|\curv\tE| = \sqrt6\,G\matter M/r^3 =
4.24\times10^{-10}\unit{s^{-2}}$ gives $\rho = 4.24\times10^6$. Then $I = 1.80\times10^{-19}\unit{s^{-4}}$, $J =
-3.11\times10^{-29}\unit{s^{-6}}$, and the type is D.

**(b) The pixel on a cart.** By the
[speedometer](/tutorial/one-point/reading-section-viii/#ten-numbers-are-four-invariants-an-orientation-and-a-velocity),
each velocity component across the line is read to $c\sigma_n/(\sqrt2\times3G\matter M/r^3) =
41\unit{m\,s^{-1}}$, and the one along it not at all.

**(c) How far and how heavy.** With the neighbours, $\rho_E = 1.12\times10^7$ and $\rho_G = 7.74\times10^5$, so
$\sigma_r/r = 1.3\times10^{-6}$, which is 3.9 µm, and $\sigma_M/\matter M = 3.9\times10^{-6}$, 0.27 g. Alone,
from the twist of the person walking past at $1.4\unit{m\,s^{-1}}$, $\rho_B = 0.034$ and $\sigma_r/r = 29$: no range at
all.

**(d) Two people on one line.** At 3.0 m and 3.5 m they read as one body at $r_{\rm eff} = 3.175$ m, and $r -
\Delta^2/r$ gives 3.173 m about the midpoint $r = 3.25$ m. With $\rho = 6.9\times10^6$ for the pair, the neighbours tell
two from one beyond $0.7(r^2/b)/\rho^{1/2} = 2.8$ cm, against their 50 cm.

**(e) The wave against the room.** The person's tide is $1.5\times10^6$ times the wave's, but steady. The rotor's
changes at 100 Hz, at 99 times the wave's. Ignored, it reads as a wave 35 times the true one for a wave from
$(-0.45, -0.35, 0.82)$, with the rotor turning in the $xy$ plane and the pixel in it at 30° from $\hat x$ (section 9.7).

**(f) The wave under the rotor.** Fitting the rotor's tide as anything at all, the pixel reads the wave from
$\curv\tB$: the amplitude's error is $\sqrt2/\rho = 11.8$ per cent instead of $1/\rho = 8.3$ per cent.

**(g) Where the wave comes from.** With the rotor known, the direction is read to $1/\rho = 0.083$ rad, 4.8°; fitting
the rotor costs the same $\sqrt2$, 6.8°.

**(h) What one reading cannot tell.** With the line to the person along $\hat x$ and $w = G\matter M/r^3$, two standing
waves at their antinodes, with the tides $w\,\mathrm{diag}(0, 1, -1)$ along $\hat x$ and $-2w\,\mathrm{diag}(1, 0, -1)$
along $\hat y$, add to the person's $w\,\mathrm{diag}(-2, 1, 1)$, with $\curv\tB = 0$. Alone, the pixel tells them apart
only by its record over time. The neighbours tell them apart at once: across them the person's tide changes by $3b/r =
10$ per cent, read at $\rho_G = 7.7\times10^5$, and the waves' by $2\pi bf/c = 2\times10^{-7}$.

**The idea to keep: one pixel separates several waves as a sum of squares, and reads a wave beneath any nearby pull
from its magnetic part at a price of $\sqrt2$. Neighbours give the depth of a mass, and no single reading says what
kind of scene it comes from.**

::: problems
### Practice

**[R9b]** Rerun the capstone's steps (a) to (c) with the person 1 m from the pixel.

::: solution
$G\matter M/r^3 = 4.67\times10^{-9}\unit{s^{-2}}$ and $\rho = 1.14\times10^8$. Across the line the velocity is read to
$1.5\unit{m\,s^{-1}}$. With $\rho_E = 3.03\times10^8$ and $\rho_G = \sqrt{30}\times0.1\rho = 6.27\times10^7$,
$\sigma_r/r = 1.6\times10^{-8}$, 16 nm, and $\sigma_M/\matter M = 5.0\times10^{-8}$.
:::

**[R9b]** Two equal masses lie on one line at 2.9 m and 3.1 m from the pixel. Where do field and gradient place them,
and where would a rod 0.2 m long, centred at 3 m, appear?

::: solution
$\langle s^2\rangle = (0.1\unit{m})^2$, so $r_{\rm eff} = 3 - 4\times0.01/3 = 2.987$ m (the exact $\sum r^{-3}/\sum
r^{-4}$ gives 2.987 m). The rod has $\langle s^2\rangle = 0.04/12$, so it appears $L^2/3r = 0.0044$ m nearer, at 2.996 m.
:::

**[R9b]** For neighbours at $b = r/3$, what does the closed form give for $\sigma_r/r$, and is it to be trusted?

::: solution
$(1/7 + 9/30)^{1/2}/\rho = 0.67/\rho$. At $b = r/3$ the stencil is not small and the field curves across it, so the
closed form only estimates the bound; the full model, which also reads the curvature, does better still.
:::

### Stretch

**[R9b]** Combine 9.2 and 9.4. One reading has $1 - 6J^2/I^3 = 0$ and $\det\curv{\mathcal W} \neq 0$. It may be one body at
rest, or a body with a weak wave travelling along the line to it. Which product of tables decides?

::: solution
Both have the eigenvalues $-2\curv w$, $\curv w$, $\curv w$, with $\curv w = -J/I$. One body is type D, so
$(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w) = 0$. With the line along $\hat x$, the wave adds
$\curv\alpha\,\vect m\vect m^{\mathsf T}$ with $\vect m = (0, 1, i)/\sqrt2$, and since $(\vect m\vect m^{\mathsf T})^2 =
0$ the product becomes $3\curv w\curv\alpha\,\vect m\vect m^{\mathsf T} \neq 0$: type II.
:::

**[R9b]** For the person of the capstone, $\rho = 4.24\times10^6$ with $b = 0.1$ m and $r = 3$ m, find $\rho_H$ for a
line along an axis of the stencil and toward a diagonal, and the least depth separation of two people on that line.

::: solution
$\rho(b/r)^2 = 4.24\times10^6/900 = 4.71\times10^3$, so $\rho_H = 4.96\times10^4$ along an axis and $3.83\times10^4$
toward a diagonal. Then $\Delta > 2r/\rho_H^{1/2} = 2.7$ cm and $3.1$ cm.
:::

**[R9b]** Show from $S_\ell = \sum_i\matter M_ir_i^{-(\ell+1)}$ that two equal masses at $r \pm \Delta/2$ have
$S_4S_2/S_3^2 = 1 + \Delta^2/4r^2$ to second order in $\Delta/r$.

::: solution
With $\epsilon = \Delta/2r$, $\sum_\pm(1 \pm \epsilon)^{-(\ell + 1)} = 2[1 + \tfrac12(\ell + 1)(\ell + 2)\epsilon^2]$, so
$S_\ell \propto 1 + \tfrac12(\ell + 1)(\ell + 2)\epsilon^2$. Then $S_4S_2/S_3^2 = 1 + (15 + 6 - 20)\epsilon^2 = 1 +
\epsilon^2 = 1 + \Delta^2/4r^2$.
:::

### The camera

**[R9b]** Reproduce every number of the sections on variation across the array and on matter at the pixel.

::: solution
$2\pi\times100/(2.998\times10^8) = 2.1\times10^{-6}$, $3\times1/3 = 1$, $2G\times70/27 =
3.46\times10^{-10}\unit{s^{-2}}$, $\sqrt6\,G\times70/27 = 4.24\times10^{-10}\unit{s^{-2}}$ and the ratio $1.5\times10^6$.
:::
:::

::: paper
- [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point) to [*What no reading
  can tell*](/paper/#par:what-no-reading-can-tell): [](/paper/#eq:pencil) to [](/paper/#eq:wave-vector) and Figure
  [](/paper/#fig:present).
- [*One pixel and many*](/paper/#par:one-pixel-and-many) to [*Precision of depth*](/paper/#par:precision-of-depth):
  [](/paper/#eq:one-pixel-range) to [](/paper/#eq:magnetic-range), Table [](/paper/#tab:one-pixel) and Figure
  [](/paper/#fig:separation-noise), with Appendix B's bounds.
:::

::: deeper
- The GR course on [what a tidal instrument measures](https://neovand.github.io/general-relativity/chapter-10.html#what-a-tidal-instrument-measures).
:::

[^sec]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. VIII](/paper/#sec:one-pixel), with its
    Table [](/paper/#tab:one-pixel).

[^typical]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equations
    [](/paper/#eq:pencil), [](/paper/#eq:four-waves) and [](/paper/#eq:wave-count). Over 200 records the median error is
    $2\times10^{-5}$ rad, and the worst $2\times10^{-3}$ rad.

[^sky]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equations
    [](/paper/#eq:pixel-kernel), [](/paper/#eq:sky-count) and [](/paper/#eq:sky-witness).

[^phase]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equations
    [](/paper/#eq:ranging-instant), [](/paper/#eq:ranging-C) and [](/paper/#eq:helicity-split). At the phase $\theta =
    0$ the formula for $C$ is within a few per cent at $kr = 80$; over the whole cycle the next order reaches 10 per cent
    there, falling as $1/kr$.

[^mass]: Conservation of mass cancels the first-order term, which would err by $kr$. Conservation of momentum removes a
    next-order term, $(kd)(kr)$ of the steady tide for an orbit of size $d < r$, under 1 per cent there.

[^tests]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equations
    [](/paper/#eq:bianchi-wave) and [](/paper/#eq:wave-vector); the polarizations are classified by Eardley, Lee and
    Lightman (1973).

[^euler]: Euler's relation, $(\vect x_s - \vect x)\cdot\nabla f = Nf$ for a field falling as the power $-N$ of the
    distance from its source at $\vect x_s$, gives geophysicists the depth of buried sources [@Thompson1982; @Reid1990]. The ranging equations were first shown in *The
    gravitational camera* (Mohsenvand 2026), Sec. VIII, as [](/paper/#eq:one-pixel-range), [](/paper/#eq:depth-bound)
    and [](/paper/#eq:magnetic-range).

[^rotor]: The ratio is 21 on the rotor's axis. Ignoring the rotor makes the wave at most 47 times the true one over all
    directions, within the bound $99/2$.

[^bench]: First shown in *The gravitational camera* (Mohsenvand 2026), [App. A](/paper/#app:benchmarks): the
    full-model bounds on depth, the rod and the depth spread read to $1/\rho_H$.

[^million]: Without neighbours the range is worse by $1.07\times10^8$ at $b = r/6$, $2.3\times10^7$ at the desk's $b/r =
    1/30$ and $6.6\times10^7$ at 0.1 (the approximation $r/(\sqrt{30}\rho b)$ gives $6.8\times10^7$).
