---
id: R4
title: 'What heat and a tide reveal'
question: "A steel ball and a hollow steel shell of the same mass and radius pull alike outside. What do the heat of the ball, or a push with a tide, reveal about the mass inside?"
part: '4'
requires: ['1.3', '1.7', '2.1', '2.2', '2.3', '2.5', 'R2', '3.3', '3.9', 'R3', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6']
paper: [sec:near-field, eq:thermal-moment, eq:thermal-multipole, fig:tremor, eq:sum-rule, eq:thermometer, app:benchmarks, eq:jitter-bounds, sec:second-order, eq:hair-commutator, eq:dust, fig:same-outside]
figures: [fig:tremor]
live: [same-outside, tremor, sum-rule]
---

A steel ball ten centimetres in radius and a hollow steel shell of the same mass and radius sit side by side at room
temperature. Outside, their steady pulls are exactly alike, because outside a round body only its mass counts
([section 1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)). Yet they tremble
differently, and the trembling reaches the camera through the pull. If the temperature is known, its size reveals how
all the mass inside is arranged, and a push with a tide reveals the same numbers at any temperature.

{{paper fig:tremor}}

::: plain
Every warm body trembles, because its atoms move at random, and the trembling changes its shape very slightly, so its
pull outside trembles too. How strongly depends only on the temperature and on where the mass lies, not on stiffness or
friction: the hollow shell trembles five thirds as much as the ball.

A body can also be pushed with a tide. Its answer, added up over all frequencies, gives the same numbers at any
temperature, and the ratio of the trembling to the answer is the temperature. So a camera that both watches and pushes
is a thermometer that needs to know nothing about the body.
:::

## A warm body's moments change at a rate set by its temperature and its density alone

Every warm body trembles.[^heat] The **temperature**
$\sym{temperature}{T}$, in kelvins, measures how heat is shared between bodies in contact, and $\kB T$ is an energy,
where $\sym{boltzmann}{\kB} = 1.38\times10^{-23}\unit{J\,K^{-1}}$ is Boltzmann's constant. At 300 K, $\kB T =
4.14\times10^{-21}\unit J$ ([section 4.2](/tutorial/response/temperature/#temperature-is-what-bodies-in-contact-come-to-share)).
In classical thermal equilibrium the velocities of the particles of a body are independent of their positions and of
one another, with $\langle v_a^2\rangle = 3\kB T/\matter m_a$, whatever forces hold the body together, provided no
force depends on velocity. Here $\matter m_a$ is the mass of particle $a$, in kilograms, and $v_a$ its speed, in
$\mathrm{m\,s^{-1}}$. The reason is that the weight $e^{-H/\kB T}$ of a state, with $H$ its energy, splits into a factor
for the velocities and one for the positions, because the energy of motion holds only the velocities and the forces
only the positions
([section 4.2](/tutorial/response/temperature/#in-phase-space-the-weight-splits-and-the-velocities-are-independent-gaussians)).

A **moment of the mass** is $\sym{mass-moment}{\matter Q_h} = \sum_a\matter m_ah(\vect x_a)$, where the **profile** $h$
is a smooth function of position and $\vect x_a$ is the place of particle $a$. Its unit is the kilogram times the unit
of $h$. By the chain rule its rate of change is $\sum_a\matter m_a\nabla h(\vect x_a)\cdot\vect v_a$, and the average
over the independent velocities keeps only the terms of one particle and one axis. For two profiles $h$ and $g$,

$$\langle\matter{\dot Q}_h\,\matter{\dot Q}_g\rangle = \kB T\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V ,$$

where $\matter\rho$ is the density in $\mathrm{kg\,m^{-3}}$ and the angle brackets are an average over time. Both sides
are in $\mathrm{kg^2\,s^{-2}}$ times the units of $h$ and $g$
([section 4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)).

For harmonic $h$, $\matter Q_h$ is one of the moments from which the field outside is built, and the camera reads it. A
function is **harmonic** where its Laplacian, the sum of its three second derivatives, is zero
([section 2.1](/tutorial/outside/laplace/#laplaces-equation-says-that-each-value-is-the-average-of-its-neighbours)),
and the field outside a body is a list of its harmonic moments
([section 2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments)). But for harmonic $h$
and $g$ the Laplacian of the product is $2\nabla h\cdot\nabla g$
([section 2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic)): for $h = g = xy$ the
product's gradients give $x^2 + y^2$, whose Laplacian is 4. So the right-hand side holds what the static field cannot see
([section 2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)).

For the multipoles $h = r^\ell Y_{\ell m}$, summed over $m$,

$$\sum_m\langle|\matter{\dot Q}_{\ell m}|^2\rangle = \frac{\ell(2\ell+1)^2}{4\pi}\,\kB T\int\matter\rho\,r^{2\ell-2}\,\dd V .$$

Here $r$ is the distance from the body's centre, in metres, and $Y_{\ell m}$ are the orthonormal spherical harmonics of
[section 2.2](/tutorial/outside/spherical-harmonics/), of degree $\ell$ and order $m$. The
addition theorem of 2.2 gives $\sum_m|\nabla(r^\ell Y_{\ell m})|^2 = \ell(2\ell + 1)^2r^{2\ell-2}/4\pi$ at every point
([section 4.6](/tutorial/response/fluctuation-dissipation/#each-degree-of-the-tremor-holds-one-moment-of-the-density)),
and the equation follows. The factor is 0.716 at $\ell = 1$, 3.979 at $\ell = 2$ and 11.70 at $\ell = 3$.[^norm]

Each degree reads one moment of the density. The dipole, $\ell = 1$, gives the mass $\matter M$, and its tremor is the
mean square speed $3\kB T/\matter M$ of the centre: **Brownian motion**, the random wandering of a whole body
([section 4.2](/tutorial/response/temperature/#the-first-case-is-brownian-motion-and-the-next-ones-see-inside)). If
the steel ball of 32.9 kg floated free at 300 K, its centre would move at $1.1\times10^{-11}\unit{m\,s^{-1}}$ along each
axis. The quadrupole gives $\int\matter\rho\,r^2\,\dd V$, the number that told the nugget from its flush and its skin
(section 2.5), and the ball from the shell: a uniform ball has $\int\matter\rho\,r^2\,\dd
V = \tfrac35\matter MR^2$, with $R$ its radius, and a thin shell of the same mass has $\matter MR^2$, so their tremors
differ by $5/3$. The right-hand side holds only the masses and their places, so the springs and the friction set only at
which frequencies the tremor lies, not how much of it there is. The octupole gives $\int\matter\rho\,r^4\,\dd V$.

For a round body the whole sequence fixes the density at every radius: the density depends only on $r$, the tremors
give its moments $\int\matter\rho\,r^{2\ell-2}\,\dd V$ for every $\ell$, and a distribution on a finite interval is
fixed by its moments ([section 3.9](/tutorial/noise/positivity/#a-positive-distribution-of-mass-is-fixed-by-a-few-of-its-moments)).
For any body, the products $\nabla h\cdot\nabla g$ of harmonic functions reach every Fourier component of the density,
as Calderón showed [@Calderon1980] ([section 13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple)).
So at a known temperature a warm body cannot hide its interior, though fine detail is reached only through
exponentially small signals ([section 2.7](/tutorial/outside/evanescent/#in-empty-space-a-ripple-can-only-fade)).  For waves it is known that
correlations of a field show what its mean hides [@Devaney1979; @WeaverLobkis2001].

::: try {#same-outside}
Choose *Round bodies*, keep the first body the uniform ball and make the second, B, the thin shell. Predict the row
*Thermal tremor of the quadrupole*: by what factor does the shell's exceed the ball's? Compare it with the row *Moment
of inertia*. Then drag *B's core radius* down: the two rows fall together, and *Pull at 2R* stays the same.
:::

## The tremor lies in a few classical notes, and the camera reads it without one graviton

Three conditions let the camera read the tremor as the equation gives it. First, the modes that carry it must be
classical, $\hbar\omega \ll \kB T$, with $\omega$ a mode's angular frequency, in $\mathrm{s^{-1}}$, and $\hbar =
1.055\times10^{-34}\unit{J\,s}$ the reduced Planck constant. A mode holds its classical share $\kB T$ only when its energy step $\hbar\omega$ is small
([section 4.2](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share)). At 300 K,
$\kB T/\hbar = 3.9\times10^{13}\unit{s^{-1}}$, and the steel ball's lowest quadrupole note, at $7.9\times10^4\unit{s^{-1}}$
or 12.6 kHz, has $\hbar\omega/\kB T = 2.0\times10^{-9}$.

Second, the modes must be slow enough to be seen as near field, $\omega r \ll c$, where $c = 3.00\times10^8\unit{m\,s^{-1}}$
is the speed of light and $\omega r/c$ is the delay $r/c$ in radians of the source's cycle: the camera then reads the
source's pull as it is now
([section 5.2](/tutorial/waves/retarded-waves/#inside-the-near-zone-the-field-is-the-static-field-of-the-source-as-it-is-now)).
Third, the measurement must cover the whole band, because a camera that hears only part of it reads only part of the
sum. All three hold for a solid, whose smooth moments fall on its lowest modes.

The steel ball rings in its lowest **spheroidal** mode, one that moves mass toward or away from the centre, unlike a
twist (4.3). **Rayleigh's method** bounds the lowest note from above by the stiffness of a
guessed shape over its mass
([section 4.3](/tutorial/response/elastic-bodies/#a-guessed-shape-overestimates-the-lowest-note-and-a-good-guess-comes-close)).
With the shear speed $\sym{shear-speed}{c_T} = 3000\unit{m\,s^{-1}}$ the bound is $\sqrt{10}\,c_T/R = 9.49\times10^4\unit{s^{-1}}$,
or 15.1 kHz. Lamb's exact solution for an elastic sphere puts the lowest spheroidal quadrupole note at
12.6 kHz. The steel has density $\matter\rho = 7850\unit{kg\,m^{-3}}$, so $\matter M = 32.9\unit{kg}$ and the shear modulus is $\sym{shear-modulus}{\matter\mu} = \matter\rho c_T^2 = 71\unit{GPa}$.

A classical mode holds $\kB T/\hbar\omega$ quanta of energy $\hbar\omega$ each (section 8.3): $4.1\times10^8$ at 15.1 kHz, and about $5\times10^8$ at 12.6 kHz. The tide of its ringing
follows from the trial shape's stiffness $3\matter\mu V/R^2 = 8.9\times10^{10}\unit{N\,m^{-1}}$, with $V$ the ball's
volume ([section 4.3](/tutorial/response/elastic-bodies/#a-ringing-quadrupole-makes-a-tide)). Equipartition gives the
swing $q$ of its poles a root mean square $q_{\rm rms} = 2.2\times10^{-16}\unit m$. The tide on the axis is
$36G\matter MRq/5r^5$, with $G = 6.674\times10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$, which a metre away is
$3.4\times10^{-25}\unit{s^{-2}}$. That is $2.7\times10^{16}$ times less than the tide of the person of 70 kg of section 1.4 standing a metre away. There $\omega r/c = 9.49\times10^4 \times 1\unit m/(3.00\times10^8\unit{m\,s^{-1}}) =
3.2\times10^{-4}$, as the condition needs.

A **graviton** is the quantum of a gravitational wave (section 8.3). A ringing quadrupole radiates a power that section
7.7 derives,[^graviton] and with it the trial shape at 15.1 kHz radiates $4.9\times10^{-55}\unit W$, one graviton every
$6.5\times10^{17}$ years. The time per graviton grows as $\omega^{-3}$, so at 12.6 kHz it is about $1.1\times10^{18}$
years, eighty million times the age of the universe. The camera detects the ringing without receiving any radiation,
because it reads the near field, the Newtonian pull of the ball's present shape, which is not radiation.

The cost is distance. Forces inside the body move neither its mass nor its centre, so the first moment whose tremor shows the inside is the quadrupole, whose tide falls as
$r^{-5}$. A tremor is a random signal, and its **spectrum**, its mean square shared out over frequency, falls as $r^{-10}$. When the tremor is far below the noise, the information gathered in an observing time $\tau$ grows as $\tau$
times the square of the ratio of the spectra, so it falls as $r^{-20}$
([section 3.3](/tutorial/noise/measuring-a-number/#a-tremor-far-below-the-noise-can-still-be-detected)). Moving from
20 cm to a metre, where the tide is $5^5 = 3125$ times smaller, costs $5^{20} = 9.5\times10^{13}$ times as long.

## A lattice of masses and springs adds up the modes, and its sums hold for any springs

A lattice ball shows the sums in a body whose modes can all be counted.[^lattice] Its masses sit at the sites of a simple
cubic lattice of unit spacing within a radius of six spacings, less the one at the centre; a second body, the shell,
keeps only the sites beyond four. Each site is joined to its six nearest neighbours by springs of unit stiffness and to
its twelve next-nearest by springs half as stiff, which makes a stable elastic solid: the ball's 2772 modes include
exactly six that do not ring, the three drifts and three turns of a free body
([section 4.3](/tutorial/response/elastic-bodies/#masses-on-springs-move-in-normal-modes)). The masses are equal within
each body, and the two bodies have the same total.

A mode of frequency $\omega_n$ moves $\matter Q_h$ by $c_n = \sum_p\sqrt{\matter m_p}\,\nabla h(\vect x_p)\cdot\vect
e_{n,p}$ per unit of its mass-weighted amplitude, where $p$ numbers the masses and $\vect e_{n,p}$ is the unit shape of
mode $n$ at mass $p$ (4.6). In equilibrium $\langle\matter{\dot Q}_h^2\rangle = \kB T\sum_nc_n^2$ and
$\langle\delta\matter Q_h^2\rangle = \kB T\sum_nc_n^2/\omega_n^2$, with $\delta\matter Q_h$ the departure from the
mean. The first holds by **equipartition**, the rule that heat gives every quadratic term of the energy the same mean
share $\tfrac12\kB T$; the second is the static form of 4.6, mode by mode.

The first sum equals $\kB T\int\matter\rho\,|\nabla h|^2\,\dd V$ for any stiffnesses: the numbers $\sqrt{\matter
m_p}\,\nabla h(\vect x_p)$, three for each mass, make one long list, the weights $c_n$ are its components along the
mode shapes, the columns of an orthogonal matrix, and an orthogonal matrix keeps a list's length. So $\sum_nc_n^2 = \sum_p\matter
m_p|\nabla h(\vect x_p)|^2$, the lattice's form of the integral, whatever the springs. The second sum does change with
the springs, because each weight counts over the square of its frequency. For $h = x$ a uniform pull moves every mass
alike, so all of $\sum_nc_n^2$ lies in the three drifts: the Brownian motion of the dipole.

For the quadrupole $h = z^2 - \tfrac12(x^2 + y^2)$ along a lattice axis, the ball's strongest frequency, a pair of modes
with the same note, holds 0.848 of the tremor, and 0.992 lies below twice that frequency.[^axis] The shell, of 668
masses and a thickness of a third of the radius, trembles 1.2203 times as much, the ratio of the lattices' $\sum_p\matter
m_pr_p^2$ (4.6), and its strongest mode lies 2.34 times lower.

::: try {#tremor}
This is the live figure of section 4.6, for the quadrupole along one axis. Its buttons *Next-nearest springs* set the
ratio $r$ of the diagonal springs to the straight ones. Predict first: when $r$ changes, does the shell's total over the
ball's change, and does the ball's share in its strongest mode?

Press $r = \tfrac14$, $r = \tfrac12$ and $r = 1$ in turn. *The totals* stay in the ratio 1.220, and the ball's share in
its strongest mode is 0.805, 0.848 and 0.873. With *Static jitter* on, the shell over the ball reads 7.12, 5.91 and
5.43.
:::

The steel ball's numbers use Rayleigh's trial shape, the displacement $\vect u = (q/R)(-x/2, -y/2, z)$, which changes
no density and moves mass only at the surface. It gives an effective mass $3\matter M/10$, a stiffness
$3\matter\mu V/R^2$ and a quadrupole $\tfrac15\matter MRq\,\mathrm{diag}(-1,-1,2)$ (4.3). It is an estimate: the bound lies
20% above Lamb's note.

## A push measures the same total at any temperature

A tide applied from outside reads the same numbers at any temperature.[^tide] The body's **response function**
$\sym{tide-response}{\chi_h}(\omega)$ is the answer of $\matter Q_h$ per unit of a tide of angular frequency $\omega$,
for a tide whose potential is $-Fh$, with $\sym{tide-strength}{F}$ its strength. It is a complex number whose imaginary
part, the friction, turns the push's work into heat
([section 4.1](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push)). The
**fluctuation–dissipation theorem** [@CallenWelton1951] says that a reading trembles at each frequency by $2\kB T$
times the friction there, divided by the frequency (4.6). So the thermal equation becomes an energy-weighted **sum rule**, an exact statement about the friction of a response
added up over all frequencies:

$$\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi_h(\omega)\,\dd\omega = \int\matter\rho\,|\nabla h|^2\,\dd V .$$

It is familiar from nuclear physics [@LippariniStringari1989]. Sections [4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust)
(from causality) and [4.6](/tutorial/response/fluctuation-dissipation/#the-tremor-and-the-applied-tide-are-one-fact)
(from heat) reach it. The friction and the stiffness spread the response over frequency but cannot change its total. For the steel ball and $h = xy$ the total is $\tfrac25\matter MR^2
= 0.13\unit{kg\,m^2}$, whatever its springs or friction, and a thin shell of the same mass has $\tfrac23\matter MR^2$,
in the ratio $3 : 5$.

::: try {#sum-rule}
This is the figure of section 4.5, for the steel ball under the tide $h = xy$. Answer its two predictions and watch the
readout *The area, 0 to ∞*: it stays $0.132\unit{kg\,m^2}$, the ball's $\tfrac25\matter MR^2$. Then choose *Shell, same
mass and radius*: the area becomes $0.219\unit{kg\,m^2}$, five thirds of the ball's.
:::

The static part of the response is the body's tidal Love number [@Love1909]. The **Love number**
$\sym{love-number}{k_2}$ is the potential that a body adds by yielding to a steady tide, as a fraction of the tide's own potential at its
surface
([section 4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number)). A ball
of fluid yields completely and has $k_2 = \tfrac32$. A ball of rigidity $\mu$, density $\rho$ and surface gravity
$g_{\rm s}$ acquires a trace-free second moment $\int\matter\rho\,(x_ix_j - \tfrac13r^2\delta_{ij})\,\dd V$ of
$-\tfrac13 k_2R^5/G$ times the applied tide, with a minus sign because the body grows longer along the axis that the
tide stretches.[^sign] For a uniform incompressible ball Kelvin found $k_2 = \tfrac32/(1 + 19\mu/2\rho g_{\rm s}R)$
 (4.6).[^kelvin] Here $\sym{surface-gravity}{g_{\rm s}} = G\matter M/R^2$ is in $\mathrm{m\,s^{-2}}$. For the steel ball
$g_{\rm s} = 2.2\times10^{-7}\unit{m\,s^{-2}}$, and its rigidity beats its gravity by $19\matter\mu/2\matter\rho
g_{\rm s}R = 3.9\times10^{15}$, so $k_2 = 3.8\times10^{-16}$. The trial shape gives $2.9\times10^{-16}$, 0.76 of it, because a guessed shape is stiffer than the true one.

The same compliance sets the static jitter, $\langle\delta\matter Q_h^2\rangle = \kB T\,\chi_h(0)$
([section 4.6](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency)).
Take $h = x_iU_{ij}x_j$, with $U$ a fixed trace-free table and $U_{ij}U_{ij} = 1$. The tide of potential $-Fh$ is
$\curv{\tE} = -2FU$, so the Love rule gives the second moment $\tfrac23k_2R^5FU_{ij}/G$, and since $\matter Q_h$ is
$U_{ij}$ times it, $\chi_h(0) = 2k_2R^5/3G$, in $\mathrm{kg\,m^2\,s^2}$. With the trial shape's $k_2$ the jitter at 300 K
is $(3.5\times10^{-16}\unit{kg\,m^2})^2$. For the axial $U = \mathrm{diag}(-\tfrac12, -\tfrac12, 1)/\sqrt{3/2}$, a swing
$q$ of the poles changes $\matter Q_h$ by $1.61\unit{kg\,m} \times q$, so the poles swing by $3.5\times10^{-16}/1.61 =
2.2\times10^{-16}\unit m$: equipartition's number, reached from the push.

Quantum mechanics bounds this jitter from both sides. Write $\chi_0 = \chi_h(0)$ and $\sym{response-sum}{A}$ for the
total of the sum rule. The quantum form of the theorem (section 8.7) gives

$$\kB T\chi_0 \le \langle\delta\matter Q_h^2\rangle \le \frac\hbar2\sqrt{A\chi_0}\,\coth\!\Bigl(\frac{\hbar}{2\kB T}\sqrt{\frac A{\chi_0}}\Bigr).$$

For a single mode of angular frequency $\omega_0$, $A/\chi_0 = \omega_0^2$, and the upper bound over the lower is $x\coth
x$ with $x = \hbar\omega_0/2\kB T$. For small $x$, $\coth x = \cosh x/\sinh x \approx 1/x + x/3$, so the ratio is $1 +
x^2/3$, and the bounds meet when $\hbar\omega_0 \ll \kB T$. For the steel ball they differ by $3.4\times10^{-19}$ of the
jitter at 12.6 kHz, and by $4.9\times10^{-19}$ at 15.1 kHz.

## A push shaped like the reading turns the pixel into a thermometer

The ratio of tremor to response is the temperature, but only if the push couples to the quantity that the pixel
reads [@Levin1998].[^thermometer] The **pixel** is the ring of free test masses of section 1.4. The theorem pairs a
reading $y$ with its **conjugate push**, of strength $f$ and energy $-fy$, and with no other (4.6).

Surround the pixel with a thin spherical shell of radius $a$, in metres, and shift mass around it, changing its surface
density by $\delta\matter\sigma = -15f\,\hat n\cdot D\cdot\hat n/4\pi a^4$. Here $\hat n$ points
from the pixel to a point of the shell, $\sym{drive-table}{D}$ is a fixed trace-free table of pure numbers,
$\sym{drive-amplitude}{f}$ is the push's strength in $\mathrm{kg\,m^2}$, and $\sym{surface-density}{\matter\sigma}$ is a
mass per area, in $\mathrm{kg\,m^{-2}}$. The shell's interaction with any matter outside it is exactly $-f\,D\!:\!\curv{\tE}$,
with $D\!:\!\curv{\tE} = D_{ij}\curv{\tE}_{ij}$ and $\curv{\tE}$ the tide of that matter at the pixel. This follows from
the potential of the outside matter, written inside the shell as a sum of growing harmonics, and the average of four
$\hat n$'s over the sky
([section 4.6](/tutorial/response/fluctuation-dissipation/#a-push-shaped-like-the-reading-makes-a-thermometer-that-needs-no-model-of-the-body)).
So the shell pushes on precisely the combination $y = D\!:\!\curv{\tE}$ that the pixel reads, and

$$T = \frac{\omega\,S_{yy}(\omega)}{2\kB\,\mathrm{Im}\,\chi_{yy}(\omega)} ,$$

where $\sym{reading-spectrum}{S_{yy}}$ is the two-sided spectrum of $y$ and $\sym{reading-response}{\chi_{yy}}$ the
response of $y$ to $f$. The equation is the theorem solved for $T$. Every unknown about the body, its modes, their shapes and how each shows at
the pixel, cancels, because each mode's frequency, friction and weight enter the noise and the friction alike. The
pattern $\hat n\cdot D\cdot\hat n$ of a trace-free $D$ is of degree two alone, so the
drive has no monopole or dipole.

The pixel also reads the shell's own tide, $6GfD/a^5$, which follows $f$ with no delay (section 2.3). So it adds the real number $6G\,D\!:\!D/a^5$ to $\chi_{yy}$ and nothing to
its imaginary part, which is all the thermometer uses. A body not in equilibrium reads as an average of its
temperatures, weighted by where it dissipates: a mode at its own temperature $T_n$ trembles by $2\kB T_n$ times its
friction over $\omega$, so the thermometer reads the $T_n$ weighted by each mode's friction.

## One integral of the density is a bracket, a thermal average, the weight of a response and the answer of dust

The integral $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ has more than one meaning.[^twotimes] In classical
mechanics it is the Poisson bracket of $\matter Q_h$ and $\matter{\dot Q}_g$
([section 1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside)); in quantum mechanics two
moments do not commute, and the commutator is

$$[\,\matter Q_h,\,\matter{\dot Q}_g\,] = i\hbar\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$$

(section 8.2). In classical equilibrium it is $\kB T$ times the mean product of the rates. For $g = h$ it is the whole
weight of the response to an applied tide. And far above every frequency at which the body can respond,

$$\chi_{hg}(\omega) \to -\frac{1}{\omega^2}\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V ,$$

the response of dust: driven faster than its bonds can act, every particle moves as if it were free
([section 4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust)).

It is the inertia that a tide of profile $h$ must move, weighed against $g$, and not a harmonic moment, so interiors
that pull alike (section 2.5) can differ in it.

## The steel ball, from its heat to a thermometer

We follow the steel ball through the whole of Part 4 in eight steps.

![The eight steps. (a) The ball and its atoms. (b) Its lowest note: Rayleigh's bound, Lamb's exact note and the twist
below it, which makes no tide. (c) The spread of the swing of its poles at 300 K. (d) The tide of that swing on the axis,
against distance. (e) The mean square rate of change of the quadrupole $xy$ for the ball and for a thin shell. (f) The
ball's Love number, from Kelvin's formula and from the trial shape. (g) A line of the tremor at two quality factors, with
the same area. (h) The thermometer's push and the pixel. The atoms, the arrows and the sizes in (h) are schematic; the
curves and the bars are exact.](tut-read-iv3-capstone){#fig:read-iv3-capstone}

**(a) The body.** $R = 10\unit{cm}$, $\matter M = 32.9\unit{kg}$, and $3.5\times10^{26}$ iron atoms, each moving at
$366\unit{m\,s^{-1}}$ rms in a random direction, independently of the others.

**(b) Its note.** Lamb's 12.6 kHz, with about $5\times10^8$ quanta: classical.

**(c) Its jitter.** At 300 K its poles swing by $q_{\rm rms} = 2.2\times10^{-16}\unit m$, a quarter of the radius of a
proton, by equipartition and equally from the Love number.

**(d) Its tide.** On the axis, $3.4\times10^{-25}\unit{s^{-2}}$ a metre away and $1.1\times10^{-21}\unit{s^{-2}}$ at
20 cm, falling as $r^{-5}$.

**(e) What the tremor holds.** For the profile $xy$, $\langle\matter{\dot Q}_{xy}^2\rangle = \tfrac23\kB T\int\matter
\rho r^2\,\dd V = 5.4\times10^{-22}\unit{kg^2\,m^4\,s^{-2}}$, whatever the steel's rigidity or friction. A thin shell
of the same mass and radius gives $\tfrac53$ of it, $9.1\times10^{-22}\unit{kg^2\,m^4\,s^{-2}}$.

**(f) Its static answer.** $k_2 = 3.8\times10^{-16}$ from Kelvin's formula and $2.9\times10^{-16}$ from the trial shape:
the ball hardly yields, since its rigidity beats its gravity by $3.9\times10^{15}$.

**(g) Its line.** No friction is given for steel. If the mode rings with the **quality factor** $\sym{quality-factor}{Q}$,
the number of radians of swing in which its energy falls by a factor $e$, its tremor fills a line about its note of
width $\sym{damping-rate}{\Gamma} = \omega_0/Q$, in $\mathrm{s^{-1}}$
([section 4.1](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push)). For
an illustrative $Q = 10^4$ at $\omega_0 = 9.49\times10^4\unit{s^{-1}}$ the line is 1.5 Hz wide. A tenfold friction makes
it ten times wider and ten times lower, and its area stays $q_{\rm rms}^2$
([section 4.5](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums)).

**(h) The thermometer.** Push with the shell drive and read $y = D\!:\!\curv{\tE}$ at the pixel. At any frequency in the
line, $\omega S_{yy}/2\kB\,\mathrm{Im}\,\chi_{yy}$ returns 300 K, and steps (b) to (g) are not needed.

So the ball's atoms make its shape ring at about 13 kHz by $10^{-16}$ m. The ringing makes a tide too weak for any
camera we can build, yet it holds $\int\matter\rho r^2\,\dd V$, which the steady pull can never show.

**The idea to keep: a warm body's moments tremble at a rate fixed by its temperature and its density, whatever its
forces, and a push measures the same numbers at any temperature. Each degree holds one moment of the density, so heat
and a push break the ties of the static field, and the ratio of tremor to response is a thermometer that needs no
model of the body.**

::: problems
### Practice

**[R4]** Rerun the steel ball for a ball of aluminium of the same size at 300 K, with $\matter\mu = 26\unit{GPa}$ and
$\matter\rho = 2700\unit{kg\,m^{-3}}$ (section 4.3). Find Rayleigh's note, the swing $q_{\rm rms}$, the tide a metre away
on the axis, and Kelvin's $k_2$.

::: solution
With $\matter M = 11.3\unit{kg}$ and $c_T = 3100\unit{m\,s^{-1}}$, Rayleigh's note is $9.81\times10^4\unit{s^{-1}}$, or
15.6 kHz. The stiffness $3.27\times10^{10}\unit{N\,m^{-1}}$ gives $q_{\rm rms} = 3.6\times10^{-16}\unit m$, and the tide
is $1.9\times10^{-25}\unit{s^{-2}}$, a little over half of steel's. With $g_{\rm s} = 7.5\times10^{-8}\unit{m\,s^{-2}}$,
$k_2 = 1.2\times10^{-16}$, a third of steel's.
:::

**[R4]** How can a camera see the steel ball's ringing although the ball emits one graviton in about $10^{18}$ years?

::: solution
It reads the near field, the changing Newtonian pull of the ball's present shape, which is not radiation (section 5.2).
:::

### Stretch

**[R4]** A camera a metre from the steel ball needs one year to detect its tremor with some chosen confidence, the
tremor staying far below the noise at every distance asked about. How long does it need at 50 cm, and at 2 m?

::: solution
The time for the same information scales as $r^{20}$. At 50 cm it is $2^{-20}$ of a year, $3.16\times10^7\unit
s/1.05\times10^6 = 30\unit s$. At 2 m it is $2^{20}$ years, about a million. Doubling the distance costs a million,
since the information holds the fourth power of a tide that falls as $r^{-5}$. At 50 cm the tremor's spectrum is
$2^{10} \approx 10^3$ times higher, so the condition of staying far below the noise fails first there, and 30 s is only
a lower limit.
:::

### The camera

**[R4]** Reproduce, from the steel ball's radius, density and shear speed ($R = 0.10\unit m$, $\matter\rho =
7850\unit{kg\,m^{-3}}$, $c_T = 3000\unit{m\,s^{-1}}$), the 15 kHz, the $4\times10^8$ quanta, the
$3\times10^{-25}\,\mathrm{s^{-2}}$, the $3\times10^{-4}$ and the $10^{14}$, and the Love number.

::: solution
Rayleigh's bound is $\sqrt{10}\times3000/0.10 = 9.49\times10^4\unit{s^{-1}}$, or 15.1 kHz, and the quanta are
$\kB T/\hbar\omega = 4.1\times10^8$. With $\matter\mu = 7.1\times10^{10}\unit{Pa}$ the stiffness is
$8.9\times10^{10}\unit{N\,m^{-1}}$, $q_{\rm rms} = 2.2\times10^{-16}\unit m$ and the tide a metre away is
$3.4\times10^{-25}\unit{s^{-2}}$. Then $\omega r/c = 3.2\times10^{-4}$, $5^{20} = 9.5\times10^{13}$, $g_{\rm s} =
2.2\times10^{-7}\unit{m\,s^{-2}}$, $19\matter\mu/2\matter\rho g_{\rm s}R = 3.9\times10^{15}$ and $k_2 =
3.8\times10^{-16}$.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), its plain words *Heat* and *A tide applied from outside*, and the paragraphs
  [*What heat reveals*](/paper/#par:what-heat-reveals), [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals)
  and [*A model-independent thermometer*](/paper/#par:a-model-independent-thermometer), with equations
  [](/paper/#eq:thermal-moment), [](/paper/#eq:thermal-multipole), [](/paper/#eq:sum-rule) and [](/paper/#eq:thermometer)
  and Figure [](/paper/#fig:tremor).
- [*The trembling lattice*](/paper/#par:the-trembling-lattice) (Appendix A): the lattice, the trial shape and
  [](/paper/#eq:jitter-bounds).
- [*The field at two times*](/paper/#par:the-field-at-two-times) (Section XIII): [](/paper/#eq:hair-commutator) and
  [](/paper/#eq:dust).
:::

::: deeper
- The [GR course, section 22.7](https://neovand.github.io/general-relativity/chapter-22.html#22-7-a-horizon-gets-a-temperature)
  explains the temperature of a horizon, which the thermometer reads from a black hole's near field
  ([section 13.7](/tutorial/what-a-field-keeps/thermometer/#beside-a-hole-a-camera-can-read-its-temperature-without-catching-a-graviton)).
- P. R. Saulson, *Fundamentals of Interferometric Gravitational Wave Detectors* (2nd ed., 2017), applies the theorem
  and Levin's method to LIGO's mirrors.

:::

[^heat]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV,
    [*What heat reveals*](/paper/#par:what-heat-reveals), equations [](/paper/#eq:thermal-moment) and
    [](/paper/#eq:thermal-multipole).

[^norm]: For harmonics normalized to $4\pi$ each factor would be $4\pi$ times larger.



[^graviton]: The power is $P = (G/5c^5)\langle\dddot I_{ij}\dddot I_{ij}\rangle$, with $I_{ij} =
    \tfrac15\matter MRq\,\mathrm{diag}(-1, -1, 2)$ and each time derivative a factor $\omega$; the graviton rate divides
    it by $\hbar\omega$.

[^lattice]: First shown in *The gravitational camera* (Mohsenvand 2026), Appendix A,
    [*The trembling lattice*](/paper/#par:the-trembling-lattice).

[^axis]: For $h = xy$ the ratio 1.2203 is unchanged, but the strongest note holds 0.90 of the tremor and lies 0.81 times
    as high.

[^tide]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV,
    [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals), as its equation [](/paper/#eq:sum-rule).

[^sign]: In terms of the tide, the rule reads $-\tfrac13k_2R^5\curv{\tE}_{ij}/G$; a stretch along $z$ has a negative
    $\curv{\tE}_{zz}$.

[^kelvin]: Steel is compressible, but allowing for that changes $k_2$ by only 0.3%.

[^thermometer]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV,
    [*A model-independent thermometer*](/paper/#par:a-model-independent-thermometer), as its equation
    [](/paper/#eq:thermometer).

[^twotimes]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII,
    [*The field at two times*](/paper/#par:the-field-at-two-times), as its equations [](/paper/#eq:hair-commutator) and
    [](/paper/#eq:dust).
