---
id: R12
title: 'What the camera can do that light cannot'
question: 'What can a camera that reads the tide do that light cannot, where is it blind, and what would it see of a star that collapses ten kiloparsecs away?'
part: '12'
requires: ['6.4', '6.5', '7.3', '7.5', '7.7', '7.8', '11.1', '12.1']
paper: [sec:affordances, tab:affordances, tab:null, sec:vistas, eq:multipole, fig:binary-field, eq:memory, eq:merger-memory, eq:burst-memory, fig:memory, fig:milky-way]
figures: [fig:binary-field, fig:memory, fig:milky-way]
live: [near-to-far, memory-pattern]
---

Two facts set the camera apart from an eye. Gravity passes through everything, because matter barely absorbs or scatters
it (section [7.8](/tutorial/geometry/wave-energy/#matter-barely-touches-the-waves)); and all energy gravitates, because
a body's mass is its energy over $c^2$ (section 6.4). What does the camera do with them that light cannot, where does it
remain blind, and what would it see of a star that collapses ten kiloparsecs away?[^x]

::: plain
The camera sees through walls, weighs what it looks at, and sees even a beam of light, but not a picture on a screen,
because the light weighs far too little. Each way of seeing has blind spots, and another way usually covers them.

Near two merging black holes the camera feels two masses turning, and farther out a wave. A star whose core collapses
evenly sends no waves, but the camera weighs it lighter, by a sixth of the Sun's mass, as the neutrinos pass. In
gravitational waves the Galaxy's centre, hidden from light by dust, is the brightest part of the sky.
:::

## Gravity passes through everything and all energy gravitates, so the camera sees through walls and weighs light

Ten abilities follow, all but two from these facts; the two others are reading spin from the polarization (section
[5.4](/tutorial/waves/polarization/#two-oscillations-a-quarter-cycle-apart-make-a-pattern-that-turns)) and reading
interiors by their tremor (section
[4.6](/tutorial/response/fluctuation-dissipation/#each-degree-of-the-tremor-holds-one-moment-of-the-density)).

A 100 W screen fills the metre in front of it with $100\unit{W}\times(1\unit{m})/c = 3.3\times10^{-7}$ J of light,
which weighs $3.7\times10^{-24}$ kg (section 6.4), against the few kilograms of the screen. So the camera ignores
pictures.

A printed page fails for another reason. Toner or ink lies a few micrometres thick at about the density of water, some
$5\unit{g\,m^{-2}}$ where it lies, against $80\unit{g\,m^{-2}}$ for the sheet itself, and a sheet of even surface density makes
no tide outside it except near its edges, so the letters stand out at a few per cent of the page. Their size defeats
the camera. A stroke of ten-point type is about 0.3 mm wide, and by the blur law of section
[3.7](/tutorial/noise/blur-law/#what-the-law-means) a camera at the distance $z$ blurs the page over $4.43\,z/q_c$, so
it must be within 0.7 mm of the page at a signal-to-noise ratio of $10^3$ ($q_c = 10.4$), and within 5 mm even at
$10^{30}$ ($q_c = 74.5$), with pixels finer than the strokes. A stroke 1 mm long holds $1.5\times10^{-9}$ kg, and at
0.7 mm its tide, $2G\matter m/z^3 = 5.8\times10^{-10}\unit{s^{-2}}$, is a sixteenth of the person's at a metre: the
mass would do, but no instrument that reads a tide is smaller than a millimetre or can be held that close. So the
camera cannot read a page, not for want of mass, but because the letters are far smaller than any blur it can reach.

A beam of power $P$ carries energy and an equal pressure. Section
[6.5](/tutorial/relativity/stress-energy/#what-gravitates-is-the-energy-plus-the-sum-of-the-stresses) shows that both
gravitate, so the beam pulls like a line of $2P/c^3$ kilograms per metre
[@TolmanEhrenfestPodolsky1931].[^bench] For 100 kW this is $7.4\times10^{-21}\unit{kg\,m^{-1}}$. Beside the beam, at
the distance $b$, the tide has the eigenvalues $(-1, 1, 0)\times4GP/c^3b^2$: a stretch along the line to the beam (a
negative eigenvalue is a stretch), a squeeze across both it and the beam, and nothing along the beam. At a metre this is
$9.9\times10^{-31}\unit{s^{-2}}$. A person of 70 kg a metre away makes $9.3\times10^{-9}\unit{s^{-2}}$ (section
[1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)), $9.4\times
10^{21}$ times more, so the beam shows only as the difference of readings with it on and off.

The magnetic part of the beam's tide is as large, and it reverses with the beam, because the flow of energy makes it
(section
[7.5](/tutorial/geometry/gravitomagnetism/#moving-matter-makes-the-magnetic-part-through-the-potential-of-its-flow)).
So the camera tells from the side which way an invisible beam runs; in a standing wave between two mirrors the
flows cancel, and so does the magnetic part (the magnetic part of a wave, in
[the one-point sky](/tutorial/one-point/reading-section-viii/#the-magnetic-part-equals-the-tide-in-a-wave-and-is-small-near-slow-matter)).

## Each channel has blind spots, and another channel covers them

A **channel**, one way of seeing, has **blind spots**: pairs of different scenes that it cannot tell apart at any
sensitivity.[^null]

- *The near field's electric part* cannot tell a hollow shell from a solid ball of the same mass
  ([1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)), nor the nugget, the flush and
  the skin
  ([2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)).
  Spin breaks the tie through the moment of inertia
  ([1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)), and so do the
  tremor (4.6), the glow (5.6), a passing mass
  ([13.1](/tutorial/what-a-field-keeps/push-and-pass/#passes-along-one-great-circle-of-directions-give-the-density))
  and a pixel inside, where
  $\mathrm{tr}\,\curv\tE = 4\pi G\matter\rho$
  ([7.3](/tutorial/geometry/einstein-equation/#the-trace-of-the-tide-is-the-ricci-curvature-along-the-observers-time)).
- *The near field's magnetic part* cannot tell a ball and a shell turning oppositely, with no total spin, from rest,
  and it is silent for rolls
  ([2.8](/tutorial/outside/flows/#rolls-are-silent-outside-because-their-potential-there-is-a-gradient)). A pixel
  inside (7.5) and two tides applied in either order
  ([13.4](/tutorial/what-a-field-keeps/flows-inside/#every-silent-flow-is-read-by-calderóns-pair)) break the tie.
- *The waves* cannot tell a body moving steadily in a straight line from a body at rest
  ([7.6](/tutorial/geometry/gravitational-waves/#a-body-in-steady-motion-sends-no-wave-and-neither-does-an-even-pressure)),
  and a round pulsation, pressure and a smooth wheel send nothing
  ([7.7](/tutorial/geometry/quadrupole-formula/#a-swelling-sphere-and-a-smooth-wheel-send-nothing)). The near field
  breaks the tie, except for the pulsation, which changes nothing outside (11.1).
- *The thermal glow* cannot tell a hot body with little friction from a cooler one with more. A pixel counts gravitons
  in proportion to the friction $\matter\eta$ times $T^3$, with $T$ the temperature (section
  [5.5](/tutorial/waves/radiance/#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature)), so a body
  at 600 K with an eighth of the friction sends as many as one at 300 K. Its energy, as $\matter\eta T^4$, is twice as
  large, and its spectrum is shifted: these break the tie.
- *The thermal glow* cannot see dark matter that does not collide. Friction needs collisions: a gas of pressure $\matter
  p$ whose particles collide once in a time $\tau$ has the static friction $\matter p\tau$, to a factor near one, and,
  like the electrons of section
  [10.3](/tutorial/glow/why-matter-barely-glows/#free-electrons-fill-a-sphere-of-states-and-collisions-relax-a-sheared-one),
  $\mathrm{Re}\,\matter\eta(\omega) = \matter p\tau/(1 + \omega^2\tau^2)$. As $\tau \to \infty$ this tends to $\matter
  p/\omega^2\tau$ and then to zero at every frequency, and with it the absorption $16\pi G\,\mathrm{Re}\,\matter\eta/c^3$
  and the glow. Near the Sun the dark matter has $7.1\times10^{-22}\unit{kg\,m^{-3}}$ and speeds of about
  $160\unit{km\,s^{-1}}$ along each axis (stated), so $\matter p = 1.8\times10^{-11}$ Pa; colliding clusters of galaxies
  bound its collisions to fewer than one in $5\times10^{16}$ s (a cross-section below $1\unit{cm^2}$ per gram, stated),
  which caps $\mathrm{Re}\,\matter\eta$ at 1 Hz at $9\times10^{-30}$ Pa s, $10^{26}$ times below water's. Its pull still
  shows it (7.3).
- *Every channel* takes a straight cosmic string for empty space, because near it space has no tide; what lies behind
  it shows it (12.2).
- *One pixel* sees only the sky's degrees four and below, so twelve sources on an icosahedron look like a uniform sky
  ([9.6](/tutorial/one-point/the-sky-at-one-point/#twelve-sources-look-to-the-pixel-like-a-uniform-sky)). An array
  breaks the tie.

So the channels cover for one another: the glow places what the near field cannot (section
[5.6](/tutorial/waves/abel-transform/#uniform-shells-are-peeled-from-the-outside-in)), and the near field weighs what
the glow cannot.

## Near a pair of black holes the tide turns with it, and beyond three-tenths of a wavelength it is a wave {#near-the-pair-the-tide-turns-with-it-and-beyond-three-tenths-of-a-wavelength-it-is-a-wave}

Outside any compact source, linearized gravity has an exact solution organized by multipoles [@Thorne1980]. Kept to
the order of the second moment of the mass, $\matter I_{ij} = \int\matter\rho\,x_ix_j\,\dd V$ in
$\mathrm{kg\,m^2}$, the trace-reversed perturbation in harmonic gauge is

$$\begin{aligned}
\field{\bar h}^{00} &= \frac{4G}{c^2}\Bigl[\frac{\matter M}{r} + \frac12\,\partial_i\partial_j\frac{\matter I_{ij}(u)}{r}\Bigr],\\
\field{\bar h}^{0i} &= \frac{2G}{c^3}\Bigl[\frac{\dot{\matter I}_{ij}(u)\,\hat n_j}{r^2} + \frac{\ddot{\matter I}_{ij}(u)\,\hat n_j}{c\,r}
+ \frac{(\vect L\times\vect x)_i}{r^3}\Bigr],\\
\field{\bar h}^{ij} &= \frac{2G}{c^4}\,\frac{\ddot{\matter I}_{ij}(u)}{r},
\end{aligned}$$

with $u = t - r/c$ the retarded time, $\hat n$ the direction from the source, $\matter M$ the mass and $\vect L$ the
angular momentum [@Teukolsky1982].[^multipole] Section 7.7 checks that it solves the wave equation and derives its tide. For a circular orbit the trace of $\matter I_{ij}$ is constant and changes only the
gauge: its part $\tfrac13\matter I_{kk}\delta_{ij}$ adds $\tfrac16\matter I_{kk}\nabla^2(1/r) = 0$ to
$\field{\bar h}^{00}$ outside the source, and nothing elsewhere, since its time derivatives vanish.

Two black holes of $30\,M_\odot$, $d = 2200$ km apart, turn at the angular speed
$\Omega = 27.3\unit{s^{-1}}$, each at $0.100\,c$. Their waves have twice the orbit's frequency, so they are
$\lambda = \pi c/\Omega = 34{,}400$ km long, and the pair has 8.8 s left before it merges (section
[12.1](/tutorial/sky/stars/#two-compact-bodies-spiral-together-and-the-papers-pair-has-nine-seconds-left)). The
**reduced wavelength** $\lambda/2\pi$ is 5480 km, 2.5 times the separation. Inside it the changing tide turns rigidly
with the pair and falls as $r^{-5}$; beyond it the pattern winds into a spiral falling as $r^{-1}$ (section 7.7). In
the plane of the orbit the laws cross at $(15/16)^{1/4}c/\Omega = 0.313\lambda$, 10,800 km; the table below gives
the other crossings. Near, the field is Newton's, with errors of order $(d/r)^2$ and $(\omega r/c)^2$; far, it is the quadrupole wave,
with an error of order $\lambda/r$ and $|\curv\tB| = |\curv\tE|$ (sections 7.7 and
[7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45)). An array this
near resolves the two holes only if it meets the blur law (section [3.7](/tutorial/noise/blur-law/#what-the-law-means)).

{{paper fig:binary-field}}

::: try {#near-to-far}
Section 7.7's live figure: the changing tide across the plane of the orbit, and below it the strength times $r$
against $r/\lambda$. Drag the probe on the map or the plot; sliders set the map's width, from $0.02\lambda$ to
$10\lambda$, and the orbital speed at the same separation.

Predict first: at 2200 km, does the probe read the near law or the wave? Then zoom to a tenth of a wavelength to see
the pattern turn rigidly, and widen the map while you move the probe outward until the two laws meet.
:::

One pixel on the axis of the orbit, a distance $r$ away, reads the pair's static tide plus the wave:

$$\curv{\mathcal W} = \frac{G\matter M}{r^3}\,\mathrm{diag}(1, 1, -2) + \sym{axis-wave-tide}{\curv h}\,\vect m_0\vect
m_0^{\mathsf T} ,\qquad \vect m_0 = (1, i, 0) ,$$

with $\curv h$ the wave's tide on the axis, in $\mathrm{s^{-2}}$ (here not a strain), a complex number whose phase
turns as $e^{-2i\Omega t}$. The static part is the whole mass's stretch $2G\matter M/r^3$ along the axis and squeeze
$G\matter M/r^3$ across it. With section
[9.4](/tutorial/one-point/petrov/#four-directions-solve-one-quartic)'s $\vect m(z) = (1 - z^2, i(1 + z^2), -2z)$ and
its stereographic coordinate $z$, the four principal directions solve $\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect
m(z) = 0$, and in three lines

$$\begin{aligned}\vect m(z)^{\mathsf T}\mathrm{diag}(1, 1, -2)\,\vect m(z) &= (1 - z^2)^2 - (1 + z^2)^2 - 8z^2 =
-12z^2 ,\\ \bigl(\vect m(z)\cdot\vect m_0\bigr)^2 &= \bigl(1 - z^2 - (1 + z^2)\bigr)^2 = 4z^4 ,\\
\vect m(z)^{\mathsf T}\curv{\mathcal W}\,\vect m(z) &= 4z^2\Bigl(\curv hz^2 - \frac{3G\matter M}{r^3}\Bigr) .\end{aligned}$$

This is section 9.4's type II example, $\curv w(1 - 3\hat z\hat z^{\mathsf T}) + \curv c_2\,\vect m\vect m^{\mathsf T}$, with
$\curv w = G\matter M/r^3$ and $\curv c_2 = 2\curv h$, because 9.4 divides $\vect m_0$ by $\sqrt2$. Two directions
sit at $z = 0$, the wave's direction of travel; the other two sit at $z = \pm(3G\matter M/r^3\curv h)^{1/2}$. With no
wave they are at the opposite pole, and the field is of type D. As the wave outgrows the static tide they move in
toward the first two: the field is of type II at every finite distance and approaches type N only as $r \to \infty$
(section [9.4](/tutorial/one-point/petrov/#the-pattern-of-the-four-directions-is-the-fields-petrov-type)), because $z^2$ falls only as $r^{-2}$. Since $z
\propto \curv h^{-1/2}$ turns as $e^{i\Omega t}$, the two directions turn about the line of sight with the pair.

They cross the equator, $|z| = 1$, where $|\curv h| = 3G\matter M/r^3$, one and a half times the static stretch. On the axis the wave's tide is $|\curv h| = 8G\matter{\Delta I}\,\Omega^4/c^4r$, twice
section 7.7's edge-on law, with $\matter{\Delta I}$ the reduced mass ($15\,M_\odot$ here) times $d^2$. Equal to
$3G\matter M/r^3$, it gives $r = 66{,}900$ km, 12 reduced wavelengths.

The magnetic part has only the spin's contribution. On the axis section
[7.5](/tutorial/geometry/gravitomagnetism/#a-spinning-round-body-is-a-spin-dipole)'s spin dipole has the eigenvalues
$(6, -3, -3)\times G|\vect L|/cr^4$, with $|\vect L| = \matter{\Delta I}\,\Omega$ the pair's angular momentum, and a
wave's magnetic part is as large as its tide (7.6). The largest eigenvalues meet where $6G\matter{\Delta I}\,\Omega/cr^4
= 8G\matter{\Delta I}\,\Omega^4/c^4r$, that is at

$$r = \Bigl(\frac34\Bigr)^{1/3}\frac{c}{\Omega} = 1.82\,\frac{\lambda}{2\pi} ,$$

9960 km. Both sides hold $\matter{\Delta I}$, so this holds at any speed.

| What crosses | Where | In units of $\lambda/2\pi$ | In km | Derived in |
|---|---|---|---|---|
| the changing tide across the plane, $\curv\tE_{zz}$ | in the plane | 1.97 ($0.313\lambda$) | 10,800 | 7.7 |
| the whole changing tide, $\lvert\curv\tE\rvert$ | in the plane | 2.5 ($0.40\lambda$) | 13,800 | 7.7 |
| the changing tide | on the axis | 1.3 ($0.21\lambda$) | 7200 | 7.7 |
| the static tide of the whole mass | on the axis | 12.2 | 66,900 | above |
| the magnetic part, the spin's against the wave's | on the axis | 1.82 | 9960 | above, from 7.5 |

**What a sixth of a wavelength means.** The reduced wavelength $\lambda/2\pi$, $0.159\lambda$ or about a sixth of a
wavelength, is the edge of the near zone: there the travel time $r/c$ is $1/\omega$, one radian of the wave's phase,
and the near and wave parts of a field's slope are equal (section
[5.2](/tutorial/waves/retarded-waves/#beside-an-oscillating-source-the-slope-of-the-field-has-a-near-part-and-a-wave-part-equal-at-kr-1)).
It is not where the pair's two laws cross. Every component of the changing tide is $G\matter{\Delta I}/r^5$ times
$e^{ikr}$ times a polynomial of degree four in $kr$, whose constant term is Newton's and whose top term is the wave's,
as in section 7.7's $\curv\tE_{zz}$. The laws cross where $(kr)^4$ equals the ratio of those two coefficients: 15 for
$\curv\tE_{zz}$ in the plane, 3.0 for the whole tide $|\curv\tE|$ on the axis, and 39.5 for $|\curv\tE|$ in the plane.
The fourth root turns ratios from 3 to 40 into $kr$ from 1.32 to 2.51, so the crossings lie 1.3 to 2.5 reduced
wavelengths out, at $0.21\lambda$ to $0.40\lambda$. At $\lambda/2\pi$ itself the all-zone field already differs from
Newton's, by $+35\%$ for $\curv\tE_{zz}$ in the plane, $+12\%$ for $|\curv\tE|$ in the plane and $-53\%$ on the axis:
the near law's error of order $(kr)^2$ has reached one. So within a sixth of a wavelength the camera sees two bodies
turning, to within a factor of two; the change to one wave is centred near a third of a wavelength, and it is complete
only several wavelengths out, where the error $\lambda/r$ is small.

## A burst leaves a memory, largest where the oscillating wave is weakest

Radiation that escapes carries away mass, and a camera it passes is left deformed. For energy sent out with the pattern
$\dd\matter E/\dd\Omega'$, the energy per unit solid angle $\Omega'$, seen from the direction $\hat N$ at distance $r$, the strain changes by

$$\Delta h^{\rm TT}_{ij} = \frac{4G}{c^4 r}\int \frac{\dd\matter E}{\dd\Omega'}
\left[\frac{\hat n'_i \hat n'_j}{1 - \hat n'\cdot\hat N}\right]^{\rm TT}\dd\Omega' ,$$

which section [7.8](/tutorial/geometry/wave-energy/#a-burst-that-carries-energy-away-leaves-the-strain-changed-for-good)
sketches [@Christodoulou1991; @Thorne1992].[^memory] Applied to the waves of a merger, taken to have the inspiral's
pattern of power, $(1 + \cos^2\iota)^2/4 + \cos^2\iota$ at the inclination $\iota$, it gives
$$\Delta h_+ = \frac{G\,\Delta\matter E}{24\,c^4 r}\,\sin^2\iota\,\bigl(17 + \cos^2\iota\bigr) ,$$

with $\Delta\matter E$ the energy radiated, the shape of Wiseman and Will [@WisemanWill1991] (section
[7.8](/tutorial/geometry/wave-energy/#the-waves-own-energy-leaves-a-memory-too)). Here $\Delta h_+$ is the plus part of the
strain, along and across the source's axis on the sky, and $\Delta h_\times = 0$; the formula is an estimate. Edge-on it is $\tfrac{17}{24}G\matter{\Delta E}/c^4r$, where the
oscillating wave is eight times weaker in power than face-on (section 5.4). A camera that records the tide sees a burst
of $\curv\tE$ whose second time integral does not return to zero (section
[7.8](/tutorial/geometry/wave-energy/#a-camera-that-reads-the-tide-sees-the-memory-as-a-burst-that-does-not-add-up-to-nothing)).

The **spin memory**, an offset in the strain's time integral, goes as $\sin^2\iota\cos\iota$
[@PasterskiStromingerZhiboedov2016; @Nichols2017]. With $x = \cos\iota$ the pattern is $(1 - x^2)x$, whose derivative
$1 - 3x^2$ vanishes at $x = \pm1/\sqrt3$, $\iota = 54.7°$ and $125.3°$, a peak of opposite sign on the two sides. The
**displacement memory**, the step in the strain itself, is the same at $\iota$ and $180° - \iota$, so only the spin
memory records which way the pair turned.

{{paper fig:memory}}

## A round collapse sends no waves, but the camera weighs its neutrinos as they pass

By Birkhoff's theorem the field outside a round body is that of a point mass, whatever moves inside, so a round
collapse radiates nothing (section
[11.1](/tutorial/black-holes/schwarzschild/#outside-a-round-body-einsteins-field-is-fixed-by-the-mass-alone)). A core
collapse frees the binding energy of the new neutron star (section 12.1), some $3\times10^{46}$ J, which is
$0.168\,M_\odot c^2$, a sixth of a solar mass (section 6.4). Outside the thin shell of neutrinos the field is that of
the original mass, inside it that of the remnant [@Vaidya1951], so the camera weighs the burst as it arrives, 32,600
years after the collapse for a star ten kiloparsecs away.

**Why each side keeps its own mass.** Birkhoff's theorem holds in any round region empty of matter, at every moment:
there the field is a point mass's, though the mass may differ from one empty region to the next. The shell of
neutrinos divides space into two such regions. The outer one adjoins the far field, which the shell has not yet
reached and which has always been that of the original mass $\matter M$, so the outer region keeps $\matter M$. The
inner one adjoins the remnant, whose own field fixes its mass at $\matter M - \matter E/c^2$, with $\matter E$ the
energy the shell carries. The camera therefore reads $\matter M$ until the shell reaches it and $\matter M - \matter
E/c^2$ after; Vaidya's exact solution for a shell of radiation joins the two.

While the shell passes, its energy flux $F = L/4\pi r^2$, for the luminosity $L$ in watts, squeezes the camera evenly
across the line to the star, $\curv\tE_{ij} = (GL/c^3r^2)(\delta_{ij} - \hat n_i\hat n_j)$ (section
[7.3](/tutorial/geometry/einstein-equation/#inside-matter-the-tide-has-a-part-fixed-by-the-matter-at-that-point)), and
the antisymmetric part of $\curv\tB$ points back to the star (section 7.3 and the
[one pixel on a desk](/tutorial/one-point/reading-section-viii-2/#inside-matter-the-trace-of-the-tide-reads-the-density-there)). A
burst of duration $\Delta t$ carries off the mass $L\Delta t/c^2$ (section 6.4), so the ratio of the squeeze to the
change of tide across the line is $r/c\Delta t$: $1.0\times10^{11}$ for 10 s at 10 kpc, as in 1987 ($5.1\times10^{10}$ along the line, where the change of tide is twice as large).

A burst that leaves unevenly leaves memory [@Epstein1978; @Turner1978]. A narrow jet of energy $\matter E$ leaves
$\Delta h_+ = (2G\matter E/c^4r)(1 + \cos\theta)$ at the angle $\theta$ from it, up to 1 in units of
$4G\matter E/c^4r$ close to its line. On the line itself it leaves none, although $1 + \cos\theta$ is largest there:
seen along the jet, the emission is round about the line of sight, so it picks out no direction across the sky for a
strain to stretch along. Two opposite jets that share $\matter E$ leave $\tfrac12$ in every direction off their axis. A sphere and a
pure dipole leave nothing; the remnant's recoil leaves a memory of second order in the recoil [@Favata2009recoil].
A burst brighter along an axis, as $1 + qP_2(\cos\theta')$ with $P_2(x) = (3x^2 - 1)/2$ and $\theta'$ the angle of
emission from the axis, leaves

$$\Delta h_+ = \frac{q\,G\matter E}{2\,c^4 r}\,\sin^2\theta ,$$

with $\theta$ the camera's angle from the axis (section 7.8). For $3\times10^{46}$ J at 10 kpc and $q = 0.01$, seen
from the side, it is $4.0\times10^{-21}$.

## In waves the Galaxy's centre is a hundred times brighter than the opposite sky

Tens of millions of close white-dwarf pairs make a foreground below a few millihertz [@Nelemans2001]. Averaged over time and random orientations, each pair radiates alike in every direction, so the brightness along a
line of sight is the column of stellar mass (section
[12.1](/tutorial/sky/stars/#in-waves-the-galaxy-shows-where-its-stars-are)), here over a model of two discs and a
bulge [@BlandHawthornGerhard2016]. In that model the centre is 102 times as bright as the anticentre in waves.
In light the dust dims the centre by 31.4 magnitudes, so we see only the nearest few kiloparsecs, and the
centre is only 1.33 times as bright as the anticentre. Five magnitudes are a factor of 100, so 30 magnitudes are
$10^{12}$, a million million; the infrared puts the dimming at the low end of thirty to fifty [@Fritz2011].

At 3 mHz the waves are $c/f = 0.668$ AU long, and a camera 50 AU across resolves $0.668/50$ of a radian, $0.77°$
(section [5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)). A year's
record tells apart frequencies $3.2\times10^{-8}$ Hz apart, so thousands of the brightest pairs would each sit alone in
a frequency bin, and one pixel places each (section [9.1](/tutorial/one-point/spin-two/)).

{{paper fig:milky-way}}

## Worked example: a star collapses ten kiloparsecs away

![Look first at the tinted panel: while the shell of neutrinos passes, its squeeze is a hundred billion times the
change of tide it leaves. The tides on the scale are exact; the rings' deformations and the balls' step are
exaggerated.](tut-read-xi-collapse){#fig:read-xi-collapse}

The example follows one core collapse 10 kpc away, $3.09\times10^{20}$ m, through Parts 6 to 12 (Figure
[](#fig:read-xi-collapse)). Each row recomputes from the table with $G$ and $c$.

| Step | Formula | Number | Chapter |
|---|---|---|---|
| (a) energy | $\matter E = 3\times10^{46}$ J (12.1's $\tfrac35G\matter M^2/R$ for $1.4\,M_\odot$ in 12 km gives $2.6\times10^{46}$ J); $\Delta\matter M = \matter E/c^2$ | $0.168\,M_\odot$ | 12.1, 6.4 |
| (b) weighing | $\Delta\curv\tE = 2G\Delta\matter M/r^3$ along the line, $G\Delta\matter M/r^3$ across, $\Delta\matter M$ of (a) | $1.5\times10^{-42}$, $7.6\times10^{-43}\unit{s^{-2}}$ | 11.1 |
| (c) squeeze | $GL/c^3r^2$, $L = \matter E/10\unit{s} = 3\times10^{45}$ W from (a) | $7.8\times10^{-32}\unit{s^{-2}}$; $5.1\times10^{10}$ and $1.0\times10^{11}$ times (b) | 7.3, 6.5 |
| (d) direction | $\curv\tB_{[ij]} = -(4\pi G/c^3)\epsilon_{ijk}\matter F_k$, $F = L/4\pi r^2 = 2500\unit{W\,m^{-2}}$ | size $7.8\times10^{-32}\unit{s^{-2}}$, back to the star | 7.3, R9b |
| (e) memory | $qG\matter E/2c^4r$, $q = 0.01$, $\matter E$ of (a), from the side | $4.0\times10^{-21}$ | 7.8 |
| (f) waves | a round collapse | none | 11.1 |

(a) The neutrinos carry off a sixth of the Sun's mass in about ten seconds. (b) When the shell
passes, the tide along the line falls by $1.5\times10^{-42}\unit{s^{-2}}$, $6\times10^{33}$ times less than the
person's tide a metre away. (c) While the shell
passes, its squeeze is $5\times10^{10}$ to $10^{11}$ times larger, because the flux falls as $r^{-2}$ and the change
of tide as $r^{-3}$. (d) An antisymmetric $3\times3$ table holds one vector $\curv{\vect w}$, with $\curv\tB_{[ij]} =
\epsilon_{ijk}\curv w_k$, whose length is $4\pi GF/c^3$. It equals the squeeze of (c) because $4\pi r^2F = L$, so one
reading inside the shell names the star's direction. (e) A burst 1%
brighter along an axis changes the strain by $4.0\times10^{-21}$. A strain moves each of two free balls by half of it
times their distance (section
[7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain)), so balls 4 km
apart end $\tfrac12\times4.0\times10^{-21}\times4\unit{km} = 8\times10^{-18}$ m farther apart for good. The step
builds over ten seconds, so its spectrum falls as $f^{-2}$ above $1/(\pi\times10\unit{s}) = 0.03$ Hz, far under
LIGO's band, which starts near 10 Hz. (f) A round collapse leaves only the weighing and the squeeze.

::: try {#memory-pattern}
On the left, a burst's pattern of emission about its axis, with the camera's direction $\hat N$
as an arrow you drag; on the right, the memory in every direction, in units of $4G\matter E/c^4r$.

Predict first: for a burst a little brighter along its axis, where on the sky is its memory largest? Then choose
$1 + qP_2$, set $q$ to 0.05, and turn the camera from the axis to the side.
:::

**The idea to keep: most of what the camera can do follows from two facts, that gravity passes through everything and
that all energy gravitates; a star that collapses evenly sends it no wave, but the camera weighs the star lighter as the
neutrinos pass, and feels their squeeze a hundred billion times more strongly while they pass.**

::: problems
### Practice

**[R12]** Rerun the example for a supernova in the Andromeda galaxy, 770 kpc away: the squeeze, the ratio to the
change of tide across the line, and the memory for $q = 0.01$.

::: solution
The squeeze falls as $r^{-2}$, to $1.3\times10^{-35}\unit{s^{-2}}$; the ratio grows as $r$, to $7.9\times10^{12}$; the
memory falls as $1/r$, to $5.2\times10^{-23}$.
:::

**[R12]** With section 7.7's bracket for $\curv\tE_{zz}$ in the plane, by how much does the changing tide at $kr =
\tfrac12$ exceed Newton's?

::: solution
The squared bracket is $225 + 135/4 + 39/16 + 10/64 + 1/256 = 261.4$, whose root, 16.17, is 1.078 times 15: 8%.
:::

**[R12]** How much ink does a page of text carry, if 5% of an A4 page ($0.0625\unit{m^2}$) is covered with
$5\unit{g\,m^{-2}}$, and how does its tide 0.1 m away compare with a person's at a metre?

::: solution
$0.05\times0.0625\times5\unit g = 16$ mg. At 0.1 m, $2G\matter m/z^3 = 2\times6.67\times10^{-11}\times1.6\times10^{-5}/10^{-3}
= 2.1\times10^{-12}\unit{s^{-2}}$, 4400 times below the person's $9.3\times10^{-9}$, and blurred over centimetres.
:::

**[R12]** Why does the camera weigh the star lighter only when the shell reaches it, not at the collapse?

::: solution
Outside the shell the field is still that of the original mass; only inside the shell is it the remnant's.
:::

### Stretch

**[R12]** With sections 12.1 and 7.7: when the pair is 1000 km apart, how long has it left, and where is its
crossover in the plane?

::: solution
The time goes as $d^4$: $8.8\unit{s}\times(1000/2200)^4 = 0.38$ s. The wavelength goes as $d^{3/2}$, so the crossover
is $0.313\times34{,}400\unit{km}\times(1000/2200)^{3/2} = 3300$ km.
:::

### The camera

**[R12]** Reproduce every number of the collapse: the sixth of a solar mass, the $10^{11}$ and the $4\times10^{-21}$.

::: solution
$3\times10^{46}\unit{J}/c^2 = 3.34\times10^{29}$ kg, $0.168\,M_\odot$. For 10 s at $3.09\times10^{20}$ m,
$r/c\Delta t = 1.03\times10^{11}$. And $qGE/2c^4r = 0.01\times6.67\times10^{-11}\times3\times10^{46}/(2\times8.08
\times10^{33}\times3.09\times10^{20}) = 4.0\times10^{-21}$.
:::
:::

::: paper
- Section X in full: Tables [](/paper/#tab:affordances) and [](/paper/#tab:null), and the beam.
- Section XI to *The Milky Way*: Eqs. [](/paper/#eq:multipole), [](/paper/#eq:memory), [](/paper/#eq:merger-memory)
  and [](/paper/#eq:burst-memory), and Figures [](/paper/#fig:binary-field), [](/paper/#fig:memory) and
  [](/paper/#fig:milky-way).
:::

::: deeper
- K. S. Thorne, "Multipole expansions of gravitational radiation", *Rev. Mod. Phys.* 52, 299 (1980), gives the
  field of every multipole in every zone.
:::

[^x]: First shown in *The gravitational camera* (Mohsenvand 2026), Secs. X and XI; the ten abilities are in its Table
    [](/paper/#tab:affordances).

[^null]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. X, Table [](/paper/#tab:null).

[^bench]: The pixel is far nearer to the beam than to the bench that holds its ends apart; the bench's tension $P/c$
    pulls like $-P/c^3$ per metre, so a pixel as near as the bench reads $P/c^3$, the energy alone (section 6.5).

[^multipole]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, as its equation
    [](/paper/#eq:multipole).

[^memory]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, as its equations
    [](/paper/#eq:memory), [](/paper/#eq:merger-memory) and [](/paper/#eq:burst-memory).
