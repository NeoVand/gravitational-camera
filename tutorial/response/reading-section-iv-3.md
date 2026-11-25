---
id: R4
title: 'Reading Section IV, part 3: what heat and an applied tide reveal'
question: "With Part 4 behind us, which of Section IV's claims about what heat and an applied tide reveal can we now check for ourselves, and how does the paper's steel ball look when the whole part is turned on it?"
part: '4'
requires: ['1.3', '1.7', '2.1', '2.2', '2.3', '2.5', 'R2', '3.3', '3.9', 'R3', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6']
paper: [sec:near-field, eq:thermal-moment, eq:thermal-multipole, fig:tremor, eq:sum-rule, eq:thermometer, app:benchmarks, eq:jitter-bounds, sec:second-order, eq:hair-commutator, eq:dust, fig:same-outside]
figures: [fig:tremor]
live: [same-outside, tremor, sum-rule]
---

A steel ball ten centimetres in radius and a hollow steel shell of the same mass and the same radius sit side by side
at room temperature. Outside, their steady pulls are exactly alike, because outside a round body only its mass counts
([chapter 1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)). Yet the paper's Figure
[](/paper/#fig:tremor), below, shows that they tremble differently, and the plain words of its
[Section IV](/paper/#sec:near-field) say why that matters: "If the temperature is known, the size of this trembling,
seen through its pull, reveals how all the mass inside is arranged." With Part 4 behind us, which of Section IV's
claims about what heat and an applied tide reveal can we now check for ourselves, and how does the paper's steel ball
look when the whole part is turned on it?

This chapter reads the three paragraphs that [reading chapter R2](/tutorial/outside/reading-section-iv-1/) left for
after Part 4: *What heat reveals*, *What an applied tide reveals* and *A model-independent thermometer*. It also reads
Figure [](/paper/#fig:tremor), Appendix A's *The trembling lattice* and a list in Section XIII. As in
[R1](/tutorial/newton/reading-section-ii/), each claim is marked *checked here*, *read now, derived in Part N* or
*stated in the paper*. The chapter ends by following the steel ball from its heat to a thermometer. Figure
[](#fig:read-iv3-map) draws the seven stretches in order.

{{paper fig:tremor}}

::: plain
The last part of Section IV says what the trembling of a warm body, and its answer to a push, can show about its
inside. Every warm body trembles by itself, because its atoms move at random. The trembling changes the body's shape
very slightly, so its pull outside trembles too. How strongly the pull trembles depends only on the temperature and on
where the mass lies, not on the body's stiffness or its inner friction. So a ball and a hollow shell that pull alike
when they are still tremble differently: the shell five thirds as much.

A body can also be pushed with a tide, a pull that differs from place to place. Its answer, added up over all
frequencies, gives the same numbers as the trembling, at any temperature. The ratio of the trembling to the answer is
the temperature. So a camera that both watches and pushes is a thermometer that needs to know nothing about the body.

The paper's steel ball rings about thirteen thousand times a second. A metre away, the tide of its ringing is more
than ten million billion times weaker than a person's, but it is there.
:::

![The seven stretches read here, in order, each with its equation numbers if it has any and the chapters that teach
it beneath. Every box is checked here; a dotted chapter number marks a claim inside it that is read now and derived
later. All seven meet in the capstone.](tut-read-iv3-map){#fig:read-iv3-map}

## The plain words promise that heat and a push break the tie

The [summary in plain words](/paper/#sec:near-field) lists three measurements that break R2's tie, in which many
interiors pull exactly alike outside a body. R2 read the first, spin. The second, *Heat*, begins: "Every warm body
trembles: its atoms jiggle at random, and its shape quivers very slightly." The **temperature** $\sym{temperature}{T}$,
in kelvins, measures how heat is shared between bodies in contact, and $\kB T$ is an energy, where $\sym{boltzmann}{\kB}
= 1.38\times10^{-23}\unit{J\,K^{-1}}$ is Boltzmann's constant. At 300 K, $\kB T = 4.14\times10^{-21}\unit J$ ([chapter
4.2](/tutorial/response/temperature/#temperature-is-what-bodies-in-contact-come-to-share)). A warm body's shape quivers
in its **normal modes**, the motions in which every part swings in step at one frequency
([4.3](/tutorial/response/elastic-bodies/#masses-on-springs-move-in-normal-modes), *checked here*). The promise that the
trembling "reveals how all the mass inside is arranged" is chapter
[4.6](/tutorial/response/fluctuation-dissipation/#each-degree-of-the-tremor-holds-one-moment-of-the-density)'s result
that each degree of the trembling holds one moment of the density (*checked here*).

The third bullet, *A tide applied from outside*, says that "pushing the body with a tide and watching how it responds
reveals the same things at any temperature". A **tide** is the difference in the pull of gravity from one place to the
next, measured in $\mathrm{s^{-2}}$ ([1.4](/tutorial/newton/tides/)). The claim is the sum rule of
[4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust), read
[below](#a-push-measures-the-same-total-at-any-temperature) (*checked here*).

## A warm body's moments change at a rate set by its temperature and its density alone

The paragraph [*What heat reveals*](/paper/#par:what-heat-reveals) opens: "Every warm body trembles, and its trembling
has a near field." The **near field** of a source is the region close enough that its pull follows the source with no
delay to speak of (R2, [5.2](/tutorial/waves/retarded-waves/)). "In classical thermal equilibrium the velocities of the
particles of a body are independent of their positions and of one another, with $\langle v_a^2\rangle = 3k_BT/m_a$,
whatever forces hold the body together." Here $\matter m_a$ is the mass of particle $a$, in kilograms, and $v_a$ its
speed, in $\mathrm{m\,s^{-1}}$. Chapter
[4.2](/tutorial/response/temperature/#in-phase-space-the-weight-splits-and-the-velocities-are-independent-gaussians)
derived the sentence: the weight $e^{-H/\kB T}$ of a state, with $H$ its energy, splits into a factor for the velocities
and one for the positions, because the energy of motion holds only the velocities and the forces only the positions
(*checked here*). The condition is that no force depends on velocity.

A **moment of the mass** is $\sym{mass-moment}{\matter Q_h} = \sum_a\matter m_ah(\vect x_a)$, where the **profile**
$h$ is a smooth function of position and $\vect x_a$ is the place of particle $a$. Its unit is the kilogram times the
unit of $h$. "Any moment of its mass … therefore changes at a rate whose mean square follows at once":

{{paper eq:thermal-moment}}

Here $g$ is a second profile, $\matter\rho$ the density in $\mathrm{kg\,m^{-3}}$, and the angle brackets an average
over time. Chapter
[4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)
derived it: the chain rule writes the rate as $\sum_a\matter m_a\nabla h(\vect x_a)\cdot\vect v_a$, and the average
over the independent velocities keeps only the terms of one particle and one axis (*checked here*). Both sides
are in $\mathrm{kg^2\,s^{-2}}$ times the units of $h$ and $g$.

"For $h$ harmonic, $Q_h$ is one of the moments from which the field outside is built, and the camera reads it." A
function is **harmonic** where its Laplacian, the sum of its three second derivatives, is zero
([2.1](/tutorial/outside/laplace/#laplaces-equation-says-that-each-value-is-the-average-of-its-neighbours)), and the
field outside a body is a list of its harmonic moments
([2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments), *checked here*). "But $\nabla
h\cdot\nabla g = \tfrac12\nabla^2(hg)$ is not harmonic beyond the lowest orders": for harmonic $h$ and $g$ the
Laplacian of a product is $2\nabla h\cdot\nabla g$
([2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic), *checked here*). For
$h = g = xy$ it is $x^2 + y^2$, whose Laplacian is 4. So "the right-hand side holds what the static field cannot see"
(4.2,
[2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)).

"For the multipoles $h = r^\ell Y_{\ell m}$, summed over $m$,"

{{paper eq:thermal-multipole}}

Here $r$ is the distance from the body's centre, in metres, and $Y_{\ell m}$ are the orthonormal spherical harmonics
of [chapter 2.2](/tutorial/outside/spherical-harmonics/), of degree $\ell$ and order $m$, an integer and not a mass.
Chapter 4.6 derived the equation from the paper's [](/paper/#eq:thermal-moment) with 2.2's addition theorem, which gives
$\sum_m|\nabla(r^\ell Y_{\ell m})|^2 = \ell(2\ell + 1)^2r^{2\ell-2}/4\pi$ at every point (*checked here*). The factor
$\ell(2\ell + 1)^2/4\pi$ is 0.716 at $\ell = 1$, 3.979 at $\ell = 2$ and 11.70 at $\ell = 3$.[^norm]

"The dipole gives the mass: its tremor is the Brownian motion of the body as a whole." At $\ell = 1$ the integral is
the mass $\matter M$, and the three moments hold the centre of mass. So the equation gives the mean square speed
$3\kB T/\matter M$ of the centre: **Brownian motion**, the random wandering of a whole body at the temperature of its
surroundings ([4.2](/tutorial/response/temperature/#the-first-case-is-brownian-motion-and-the-next-ones-see-inside),
4.6, *checked here*). If the steel ball of 32.9 kg floated free at 300 K, its centre would move at
$1.1\times10^{-11}\unit{m\,s^{-1}}$ along each axis.

"The quadrupole gives $\int\rho\,r^2\,\dd V$, the number that told the nugget from its flush and its skin", which are
the three steel balls of the paper's Figure [](/paper/#fig:same-outside) (R2). "And the shell from the ball, whose
tremors differ by $5/3$ whatever their elastic constants and their friction": a uniform ball has $\int\matter\rho
r^2\,\dd V = \tfrac35\matter MR^2$, with $R$ its radius, and a thin shell of the same mass $\matter MR^2$ (4.2, *checked
here*). The right-hand side of the paper's [](/paper/#eq:thermal-moment) holds only the masses and their places. The
springs and the friction "set only at which frequencies the tremor lies, not how much of it there is" (4.6, *checked
here*). "The octupole gives $\int\rho\,r^4\,\dd V$, and so on."

"For a round body the whole sequence fixes the density at every radius, since a distribution on a finite interval
is fixed by its moments." A round body's density depends only on $r$, and the tremors give its moments
$\int\matter\rho\,r^{2\ell-2}\,\dd V$, from $r = 0$ to $R$, for every $\ell$. Chapter
[3.9](/tutorial/noise/positivity/#a-positive-distribution-of-mass-is-fixed-by-a-few-of-its-moments) showed that such
moments fix a distribution (*checked here*, with the theorem for all moments stated there).

"For any body, the products $\nabla h\cdot\nabla g$ of harmonic functions reach every Fourier component of the
density, as Calderón showed" [@Calderon1980]: *read now, derived in Part 13* (chapter
[13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple)). "At a known
temperature a warm body cannot hide its interior …, though … fine detail is reached only through exponentially small
signals": a fine pattern fades on its way out as the exponential of its fineness times the distance
([2.7](/tutorial/outside/evanescent/#in-empty-space-a-ripple-can-only-fade),
[3.7](/tutorial/noise/blur-law/#what-the-law-means), *checked here*). That correlations of a field can show what its
mean hides "is known for waves" [@Devaney1979; @WeaverLobkis2001]: *stated in the paper*.

::: try {#same-outside}
Choose *Round bodies*, keep the first body the uniform ball and make the second, B, the thin shell. Predict the row
*Thermal tremor of the quadrupole*: by what factor does the shell's exceed the ball's? Read it, and compare it with
the row *Moment of inertia*. Then drag *B's core radius* down, which thickens the shell: the two rows fall together,
and the row *Pull at 2R* stays the same.
:::

## The tremor lies in a few classical notes, and the camera reads it without one graviton

The second paragraph of *What heat reveals* begins: "Three conditions apply." The first is that "the modes that carry
the tremor must be classical, $\hbar\omega \ll k_BT$". Here $\omega$ is a mode's angular frequency, in
$\mathrm{s^{-1}}$, and $\hbar = 1.055\times10^{-34}\unit{J\,s}$ is the reduced Planck constant. In quantum mechanics a
mode takes energy only in steps of $\hbar\omega$, so it holds its classical share $\kB T$ only when the step is small
([4.2](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share)). At 300 K,
$\kB T/\hbar = 3.9\times10^{13}\unit{s^{-1}}$. The steel ball's lowest note that changes its quadrupole, at
$7.9\times10^4\unit{s^{-1}}$ or 12.6 kHz (its exact value, read below), has $\hbar\omega/\kB T = 2.0\times10^{-9}$
(*checked here*).

The second is that the modes be "slow enough to be seen as near field, $\omega r \ll c$". Here $c = 3.00\times10^8\unit
{m\,s^{-1}}$ is the speed of light, and $\omega r/c$ is the delay $r/c$ measured in radians of the source's cycle
([5.2](/tutorial/waves/retarded-waves/#inside-the-near-zone-the-field-is-the-static-field-of-the-source-as-it-is-now),
*read now, derived in Part 5*). The third, "measured in full", means that a camera hearing only part of the band of
frequencies reads only part of the sum. "All three hold for a solid,
whose smooth moments fall on its lowest modes of vibration."

"In a lattice ball of 924 masses joined by springs, $85\%$ of the tremor of the quadrupole along a lattice axis lies at
one frequency and $99\%$ below twice it." The **lattice ball** is Appendix A's, read
[below](#appendix-as-lattice-adds-up-the-modes-and-its-sums-hold-for-any-springs), and its 924 masses were counted in
[4.3](/tutorial/response/elastic-bodies/#masses-on-springs-move-in-normal-modes). Its strongest frequency, a pair of
modes with the same note, holds 0.848 of the tremor, and 0.992 lies below twice that frequency.[^axis] "A shell of the
same mass and radius, whose thickness is a third of its radius, trembles $1.22$ times as much, the ratio of their second
moments": its 668 masses give 1.2203, the ratio of the lattices' $\sum_p\matter m_pr_p^2$, where $p$ numbers the masses
([4.6](/tutorial/response/fluctuation-dissipation/#each-degree-of-the-tremor-holds-one-moment-of-the-density), *checked
here*). It trembles "with its strongest mode more than twice as low": that mode lies 2.34 times lower than the
ball's.[^mean]

"A steel ball ten centimetres in radius rings in its lowest spheroidal quadrupole mode, at an estimated
$15\,\mathrm{kHz}$." A **spheroidal** mode is one that moves mass toward or away from the centre, unlike a twist (4.3).
Chapter
[4.3](/tutorial/response/elastic-bodies/#a-guessed-shape-overestimates-the-lowest-note-and-a-good-guess-comes-close)
derived the number by **Rayleigh's method**, which bounds the lowest note from above by the stiffness of a guessed
shape over its mass. With the shear speed $\sym{shear-speed}{c_T} = 3000\unit{m\,s^{-1}}$ the bound is
$\sqrt{10}\,c_T/R = 9.49\times10^4\unit{s^{-1}}$, or 15.1 kHz (*checked here*). Lamb's exact solution for an elastic
sphere, also in 4.3, puts the lowest spheroidal quadrupole note at 12.6 kHz.[^lamb] The tutorial's steel has the
density $\matter\rho = 7850\unit{kg\,m^{-3}}$, so the ball weighs $\matter M = 32.9\unit{kg}$ and the shear modulus is
$\sym{shear-modulus}{\matter\mu} = \matter\rho c_T^2 = 71\unit{GPa}$ (4.3).

"With $4\times10^8$ quanta in it at room temperature." A **quantum** is one step $\hbar\omega$ of a mode's energy
(chapter 8.3). A classical mode holds $\kB T$, so it holds $\kB T/\hbar\omega$ quanta: $4.1\times10^8$ at 15.1 kHz
(*checked here*), and about $5\times10^8$ at Lamb's 12.6 kHz. "Its tremor makes a tide of
$3\times10^{-25}\,\mathrm{s^{-2}}$ a metre away." Chapter
[4.3](/tutorial/response/elastic-bodies/#a-ringing-quadrupole-makes-a-tide) found the trial shape's stiffness
$3\matter\mu V/R^2 = 8.9\times10^{10}\unit{N\,m^{-1}}$, with $V$ the ball's volume. Equipartition gives the swing of its
poles a root mean square $q_{\rm rms} = 2.2\times10^{-16}\unit m$. The tide on the axis is $36G\matter MRq/5r^5$, with
$G = 6.674\times10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$, which a metre away is $3.4\times10^{-25}\unit{s^{-2}}$ (*checked
here*). Two free balls a metre apart feel from it a relative acceleration of $3.4\times10^{-25}\unit{m\,s^{-2}}$,
$2.7\times10^{16}$ times less than from chapter 1.4's person of 70 kg standing a metre away. "Where $\omega r/c =
3\times10^{-4}$": $9.49\times10^4 \times 1\unit m/(3.00\times10^8\unit{m\,s^{-1}}) = 3.2\times10^{-4}$ (*checked here*;
5.2 gives $2.6\times10^{-4}$ at Lamb's note).

"That mode emits one graviton in a time of order $10^{18}$ years." A **graviton** is the quantum of a gravitational
wave (chapter 8.3). The number needs the power that a ringing quadrupole radiates, *read now, derived in Part 7*
(chapter 7.7).[^graviton] With it the trial shape at Rayleigh's 15.1 kHz radiates $4.9\times10^{-55}\unit W$, one
graviton every $6.5\times10^{17}$ years. The time per graviton grows as $\omega^{-3}$, so at Lamb's 12.6 kHz it is
about $1.1\times10^{18}$ years, eighty million times the age of the universe. "The camera detects the ball's ringing
without receiving any of its radiation." The camera reads the near field, the Newtonian pull of the ball's present
shape (5.2), and that pull is not radiation. So "the graviton counts that limit the thermal glow … say nothing about
the near field" (*checked here*; the glow is Section VI's, read in R10).

"The cost is distance." Chapter [3.3](/tutorial/noise/measuring-a-number/#a-tremor-far-below-the-noise-can-still-be-detected)
sketched why. Forces inside the body move neither its mass nor its centre. The centre's own Brownian wandering says
only $\matter M$, so the first moment whose tremor shows the inside is the quadrupole, whose tide falls as $r^{-5}$. A
tremor is a random signal, and its **spectrum**, its mean square shared out over frequency, falls as $r^{-10}$. When
the tremor is far below the noise, the information gathered in an observing time $\tau$ grows as $\tau$ times the
square of the ratio of the spectra, so it falls as $r^{-20}$. "From $20\,\mathrm{cm}$ to a metre costs $10^{14}$ times
as long": $5^{20} = 9.5\times10^{13}$ (*checked here*, as 3.3's sketch).

## Appendix A's lattice adds up the modes, and its sums hold for any springs

Figure [](/paper/#fig:tremor) and Appendix A's paragraph [*The trembling lattice*](/paper/#par:the-trembling-lattice)
give the construction. The masses sit at "the sites of a simple cubic lattice of unit spacing within a radius of six
spacings, less the one at the centre, the shell keeping only those beyond four". Each site is "joined to its six nearest
neighbours by springs of unit stiffness and to its twelve next-nearest by springs half as stiff, which makes a stable
elastic solid": the ball's 2772 modes include exactly six that do not ring, the three drifts and three turns of a free
body ([4.3](/tutorial/response/elastic-bodies/#masses-on-springs-move-in-normal-modes), *checked here*). The masses are
equal within each body, and the two bodies have the same total.

"A mode of frequency $\omega_n$ moves $Q_h$ by $c_n$ per unit of its mass-weighted amplitude." Chapter 4.6 read the
weight off the mode's shape, $c_n = \sum_p\sqrt{\matter m_p}\,\nabla h(\vect x_p)\cdot\vect e_{n,p}$, where $\vect
e_{n,p}$ is the unit shape of mode $n$ at mass $p$ (*checked here*). "In equilibrium $\langle\dot Q_h^2\rangle =
k_BT\sum_nc_n^2$ and $\langle\delta Q_h^2\rangle = k_BT\sum_nc_n^2/\omega_n^2$." The first holds because each mode
keeps $\kB T$ in its rate by **equipartition**, the rule that heat gives every quadratic term of the energy the same
mean share $\tfrac12\kB T$ (4.2). The second is 4.6's static form, mode by mode, for the modes that ring; here $\delta
\matter Q_h$ is the departure of $\matter Q_h$ from its mean (*checked here*).

"The first sum equals $k_BT\int\rho\,|\nabla h|^2\,\dd V$ to rounding error for any stiffnesses." The numbers
$\sqrt{\matter m_p}\,\nabla h(\vect x_p)$, three for each mass, make one long list. The weights $c_n$ are its components
along the mode shapes, and the mode shapes are the columns of an orthogonal matrix, which keeps a list's length. So
$\sum_nc_n^2 = \sum_p\matter m_p|\nabla h(\vect x_p)|^2$, the lattice's form of the integral, whatever the springs
([4.6](/tutorial/response/fluctuation-dissipation/#each-degree-of-the-tremor-holds-one-moment-of-the-density), *checked
here*). The second sum does change with the springs, because each weight counts over the square of its frequency.
"For $h = x$ all of it lies in the free translation": a uniform pull moves every mass alike, which is the drift of the
whole body, so all of $\sum_nc_n^2$ lies in the three drifts. This is the Brownian motion of
the paper's [](/paper/#eq:thermal-multipole) at $\ell = 1$ (4.6, *checked here*).

::: try {#tremor}
This is chapter 4.6's live figure. It draws only the quadrupole along one axis of the lattice, so it cannot show the
numbers for $h = xy$ or the sum over the five orders. Its buttons *Next-nearest springs* set the ratio $r$ of the
diagonal springs to the straight ones. Predict first: when $r$ changes, does the shell's total over the ball's
change, and does the ball's share in its strongest mode?

Press $r = \tfrac14$, $r = \tfrac12$ and $r = 1$ in turn. *The totals* stay in the ratio 1.220. *The strongest modes*
give the ball's share as 0.805, 0.848 and 0.873, and its strongest mode lies 2.62, 2.34 and 2.22 times higher than the
shell's. Then turn on *Static jitter* and press the three buttons again: the shell over the ball reads 7.12, 5.91 and
5.43.
:::

The paragraph then turns to the steel ball, whose numbers "use Rayleigh's method with the displacement $\mathbf u =
(q/R)(-x/2, -y/2, z)$", with $q$ the swing of the poles in metres. Chapter
[4.3](/tutorial/response/elastic-bodies/#a-ringing-quadrupole-makes-a-tide) derived that this shape changes no density
and moves mass only at the surface, and its "effective mass $3M/10$, stiffness $3\mu V/R^2$, a quadrupole
$\tfrac15MRq\,\mathrm{diag}(-1,-1,2)$ and so a tide $36GMRq/5r^5$ on its axis" (*checked here*). "These are
estimates, not the exact modes of a steel sphere": the bound lies 20% above Lamb's note.

The last paragraph of the appendix is quantum. In it $\chi_0 = \sym{tide-response}{\chi_h}(0)$ is the **static
compliance**, how far $\matter Q_h$ moves per unit of a steady tide, and $\sym{response-sum}{A}$ is the total of the
paper's sum rule [](/paper/#eq:sum-rule), read [below](#a-push-measures-the-same-total-at-any-temperature). The quantum
form of the theorem gives

{{paper eq:jitter-bounds}}

*read now, derived in Part 8* (chapter 8.7). One check is possible now. For a single mode of angular frequency
$\omega_0$, $A/\chi_0 = \omega_0^2$, and the upper bound over the lower is $x\coth x$ with $x = \hbar\omega_0/2\kB T$.
For small $x$, $\coth x = \cosh x/\sinh x \approx 1/x + x/3$, so the ratio is $1 + x^2/3$, and the two bounds meet when
$\hbar\omega_0 \ll \kB T$ ([4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number),
*checked here*). For the steel ball they differ by $3.4\times10^{-19}$ of the jitter at Lamb's 12.6 kHz, and by
$4.9\times10^{-19}$ at Rayleigh's 15.1 kHz.

## A push measures the same total at any temperature

The paragraph [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) begins: "A tide applied from
outside reads the same numbers at any temperature." The body's **response function** $\chi_h(\omega)$ is the answer of
$\matter Q_h$ per unit of a tide of angular frequency $\omega$, a complex number whose imaginary part, the friction,
turns the push's work into heat
([4.1](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push)). "By the
fluctuation–dissipation theorem [@CallenWelton1951] the tremor is the dissipative part of the body's response." The
**fluctuation–dissipation theorem** says that a reading trembles at each frequency by $2\kB T$ times the friction there,
divided by the frequency (4.6, *checked here*). So "Eq. [](/paper/#eq:thermal-moment) becomes the energy-weighted sum
rule":

{{paper eq:sum-rule}}

"Where $\chi_h$ is the response of $Q_h$ to a tide whose potential is $-Fh$", with $\sym{tide-strength}{F}$ the tide's
strength (4.5). A **sum rule** is an exact statement about the friction of a response added up over all frequencies.
Chapter 4.5 reached this one from causality and [the answer of
dust](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust), and chapter
[4.6](/tutorial/response/fluctuation-dissipation/#the-tremor-and-the-applied-tide-are-one-fact) from heat (*checked
here*, twice). It is "energy-weighted" because each frequency counts in proportion to $\omega$. That it is
"familiar from nuclear physics" [@LippariniStringari1989] is *stated in the paper*.

"The friction and the stiffness of the body spread the response over frequency but cannot change its total" (4.5,
*checked here*). For the steel ball and $h = xy$ the total is $\tfrac25\matter MR^2 = 0.13\unit{kg\,m^2}$, whatever its
springs or friction, and a thin shell of the same mass has $\tfrac23\matter MR^2$, in the ratio $3 : 5$.

::: try {#sum-rule}
This is chapter 4.5's figure, for the steel ball under the tide $h = xy$. Answer its two predictions at the top and
do what each asks, watching the readout *The area, 0 to ∞*: it stays $0.132\unit{kg\,m^2}$, the ball's
$\tfrac25\matter MR^2$. Then choose *Shell, same mass and radius* (*Thin shell* on a phone). The area becomes
$0.219\unit{kg\,m^2}$, five thirds of the ball's.
:::

"The static part of the response is the body's tidal Love number" [@Love1909]. The **Love number**
$\sym{love-number}{k_2}$ is a pure number: the potential that a body adds by yielding to a steady tide, as a fraction
of the tide's own potential at its surface
([4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number), *checked here*).
A ball of fluid yields completely and has $k_2 = \tfrac32$. "A ball of rigidity $\mu$, density $\rho$ and surface
gravity $g$ acquires a trace-free second moment $\int\rho\,(x_ix_j - \tfrac13r^2\delta_{ij})\,\dd V$ of $-\tfrac13
k_2R^5/G$ times the applied tide": the minus sign holds because the body grows longer along the axis that the tide
stretches.[^sign]

"With $k_2 = \tfrac32/(1 + 19\mu/2\rho gR)$ for a uniform incompressible ball" is Kelvin's result, *stated in the
paper* and stated in 4.6.[^kelvin] The paper's $g$ is the surface gravity, which 4.6 writes
$\sym{surface-gravity}{g_{\rm s}} = G\matter M/R^2$, in $\mathrm{m\,s^{-2}}$, so that $g$ stays a profile. For the steel
ball $g_{\rm s} = 2.2\times10^{-7}\unit{m\,s^{-2}}$, and its rigidity beats its gravity by $19\matter\mu/2\matter\rho
g_{\rm s}R = 3.9\times10^{15}$. "For the steel ball, $k_2 = 4\times10^{-16}$": $3.8\times10^{-16}$ (4.6, *checked
here*). The trial shape of Appendix A gives $2.9\times10^{-16}$, 0.76 of it, because a guessed shape is stiffer than
the true one.

"The same compliance sets the static jitter, $\langle\delta Q_h^2\rangle = k_BT\,\chi_h(0)$", by 4.6's [static form
of the theorem](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency)
(*checked here*). Take $h = x_iU_{ij}x_j$, with $U$ a fixed trace-free table and $U_{ij}U_{ij} = 1$. The tide of
potential $-Fh = \tfrac12\curv{\tE}_{ij}x_ix_j$ has $\curv{\tE} = -2FU$, so the Love rule gives the trace-free second
moment $\tfrac23k_2R^5FU_{ij}/G$. Since $\matter Q_h$ is $U_{ij}$ times that moment, $\chi_h(0) = 2k_2R^5/3G$, in
$\mathrm{kg\,m^2\,s^2}$
([4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number)). With the trial
shape's $k_2$ the jitter at 300 K is $(3.5\times10^{-16}\unit{kg\,m^2})^2$. For the axial $U =
\mathrm{diag}(-\tfrac12, -\tfrac12, 1)/\sqrt{3/2}$, a swing $q$ of the poles changes $\matter Q_h$ by
$0.490\,\matter MRq = 1.61\unit{kg\,m} \times q$ (4.6). So the poles swing by $3.5\times10^{-16}/1.61 =
2.2\times10^{-16}\unit m$, equipartition's number reached from the push. The paragraph's last sentence, on the quantum
bounds, is Appendix A's [](/paper/#eq:jitter-bounds), read above.

## A push shaped like the reading turns the pixel into a thermometer

The paragraph [*A model-independent thermometer*](/paper/#par:a-model-independent-thermometer) opens: "The ratio of
tremor to response is the temperature, but only if the push couples to the same quantity that the pixel reads"
[@Levin1998]. The **pixel** is the paper's ring of free test masses, which reads the tide at one place (chapter 1.4).
The theorem pairs a reading $y$ with its **conjugate push**, a push of strength $f$ whose energy is $-fy$, and with no
other (4.6, *checked here*).

The paper builds such a push. "Surround the pixel with a thin spherical shell of radius $a$ and shift mass around it,
changing its surface density by $\delta\sigma = -15f\,\hat n\cdot D\cdot\hat n/4\pi a^4$." Here $a$ is in metres,
$\hat n$ points from the pixel to a point of the shell, $\sym{drive-table}{D}$ is a fixed trace-free table of pure
numbers, $\sym{drive-amplitude}{f}$ is the push's strength in $\mathrm{kg\,m^2}$, and $\sym{surface-density}{\matter
\sigma}$ is a mass per area, in $\mathrm{kg\,m^{-2}}$. "Its interaction with any matter outside the shell is exactly
$-f\,D\!:\!\tE$", with $D\!:\!\curv{\tE} = D_{ij}\curv{\tE}_{ij}$ and $\curv{\tE}$ the tide of that matter at the pixel.
Chapter [4.6](/tutorial/response/fluctuation-dissipation/#a-push-shaped-like-the-reading-makes-a-thermometer-that-needs-no-model-of-the-body)
derived it from the potential of the outside matter, written inside the shell as a sum of growing harmonics, and the
average of four $\hat n$'s over the sky (*checked here*).[^checks] "So it pushes on precisely the combination
$y = D\!:\!\tE$ that the pixel reads. Then"

{{paper eq:thermometer}}

"Where $S_{yy}$ is the spectrum of the reading and $\chi_{yy}$ its response to $f$": $\sym{reading-spectrum}{S_{yy}}$
is the two-sided spectrum of $y$ and $\sym{reading-response}{\chi_{yy}}$ the response of $y$ to $f$ (4.6). The
equation is the theorem solved for $T$ (*checked here*). "Every unknown about the body, its modes, their shapes and how
each shows at the pixel, cancels", because each mode's frequency, friction and weight enter the noise and the
friction in the same way (4.6, *checked here*). Appendix A adds that "the shell drive of Eq.
[](/paper/#eq:thermometer) has no monopole or dipole": the pattern $\hat n\cdot D\cdot\hat n$ of a trace-free $D$ is of
degree two alone (4.6, *checked here*).

"The shell's own field at the pixel, $6GfD/a^5$, is in phase with $f$ and adds nothing to $\mathrm{Im}\,\chi_{yy}$."
The pixel reads the shell's own tide as well as the body's. Chapter 4.6 found it from the interior expansion of 2.3: it
follows $f$ with no delay, so it adds the real number $6G\,D\!:\!D/a^5$ to $\chi_{yy}$ and nothing to its imaginary
part, which is all the thermometer uses (*checked here*).

"A body not in equilibrium reads as an average of its temperatures, weighted by where it dissipates" is *stated in the
paper*. If mode $n$ is at its own temperature $T_n$, it trembles by $2\kB T_n$ times its own friction over $\omega$, so
at each frequency the thermometer reads the average of the $T_n$ weighted by each mode's friction there (4.6's margin
note).

## One integral of the density is a bracket, a thermal average, the weight of a response and the answer of dust

Section XIII's paragraph [*The field at two times*](/paper/#par:the-field-at-two-times) looks back. It writes the rate
of change of a moment with the momenta $\vect p_a$ and finds that two moments do not commute in quantum mechanics:

{{paper eq:hair-commutator}}

Here $[\,\cdot\,,\,\cdot\,]$ is the commutator of two quantum quantities (*read now, derived in Part 8*, chapter 8.2).
"The Poisson bracket of classical mechanics has the same form", which chapter
[1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside) derived (*checked here*). "The
right-hand side appears elsewhere": in classical equilibrium it is $\kB T$ times the mean product of the rates,
the paper's [](/paper/#eq:thermal-moment); it is "the whole weight of the response to an applied tide",
the paper's [](/paper/#eq:sum-rule); and far above every frequency at which the body can respond,

{{paper eq:dust}}

"which is the response of dust": driven faster than its bonds can act, every particle moves as if it were free
([4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust), *checked here*). So one
integral, $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$, is read in four ways.

| Where it appears in the paper | What the integral is there | Taught in |
|---|---|---|
| [](/paper/#eq:hair-commutator) | the bracket of $\matter Q_h$ and $\matter{\dot Q}_g$, over $i\hbar$ | 1.7 (classical); 8.2 |
| [](/paper/#eq:thermal-moment) | the mean product of two rates of change, over $\kB T$ | 4.2 |
| [](/paper/#eq:sum-rule) | the whole weight of the friction, for $g = h$ | 4.5, 4.6 |
| [](/paper/#eq:dust) | the answer to a very fast tide, times $-\omega^2$ | 4.5 |

The integral is the inertia that a tide of profile $h$ must move, weighed against the profile $g$. It is not a
harmonic moment, so it is not one of the numbers that the steady field outside holds. Interiors that pull alike, the
null space of R2, can therefore differ in it. Section XIII builds on this with Calderón's argument, read in
[R13](/tutorial/what-a-field-keeps/reading-sections-xii-and-xiii/#at-two-times-the-readings-hold-a-bracket-and-products-of-tides-build-every-ripple).

## The capstone: the steel ball, from its heat to a thermometer

We now follow the paper's steel ball with the whole of Part 4, in eight steps. Each step gives one number and the
chapter that supplies it. Figure [](#fig:read-iv3-capstone) draws the eight.

![The capstone in eight panels. (a) The ball and its atoms, each moving at random. (b) Its lowest note: Rayleigh's
bound, Lamb's exact mass-quadrupole note and the twist below it, which makes no tide. (c) The spread of the swing of its
poles at 300 K. (d) The tide of that swing on the axis, against distance: it falls as $r^{-5}$,
$3.4\times10^{-25}\unit{s^{-2}}$ at a metre. (e) The mean square rate of change of the quadrupole $xy$ for the ball and
for a thin shell of the same mass and radius. (f) The ball's Love number, from Kelvin's formula and from the trial
shape. (g) A line of the tremor at two quality factors: over all frequencies, the same area. (h) The thermometer's push
and the pixel. The atoms, the arrows and the sizes in (h) are schematic; the curves and the bars are
exact.](tut-read-iv3-capstone){#fig:read-iv3-capstone}

**(a) The body.** The ball has $R = 10\unit{cm}$ and $\matter M = 32.9\unit{kg}$. It holds $3.5\times10^{26}$ iron
atoms, each moving at a root mean square speed of $366\unit{m\,s^{-1}}$ in a random direction, independently of all the
others and of where it is ([4.2](/tutorial/response/temperature/#in-phase-space-the-weight-splits-and-the-velocities-are-independent-gaussians)).

**(b) Its note.** Its lowest mass-quadrupole note is Lamb's 12.6 kHz, below Rayleigh's bound of 15.1 kHz, and the mode
holds about $5\times10^8$ quanta, so it is classical
([4.3](/tutorial/response/elastic-bodies/#a-guessed-shape-overestimates-the-lowest-note-and-a-good-guess-comes-close)).

**(c) Its jitter.** At 300 K its poles swing by $q_{\rm rms} = 2.2\times10^{-16}\unit m$, a quarter of the radius of a
proton. Equipartition gives this number (4.3), and so does the Love number
([4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number)).

**(d) Its tide.** On the axis the swing makes $3.4\times10^{-25}\unit{s^{-2}}$ a metre away and
$1.1\times10^{-21}\unit{s^{-2}}$ at 20 cm, falling as $r^{-5}$
([4.3](/tutorial/response/elastic-bodies/#a-ringing-quadrupole-makes-a-tide),
[2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)).

**(e) What the tremor holds.** For the profile $xy$, $\langle\matter{\dot Q}_{xy}^2\rangle = \tfrac23\kB T\int\matter
\rho r^2\,\dd V = 5.4\times10^{-22}\unit{kg^2\,m^4\,s^{-2}}$, whatever the steel's rigidity or friction. A thin shell
of the same mass and radius would give $\tfrac53$ of it, $9.1\times10^{-22}\unit{kg^2\,m^4\,s^{-2}}$
([4.2](/tutorial/response/temperature/#the-first-case-is-brownian-motion-and-the-next-ones-see-inside), 4.6).

**(f) Its static answer.** Kelvin's formula gives $k_2 = 3.8\times10^{-16}$ and the trial shape $2.9\times10^{-16}$.
The ball hardly yields, because its rigidity beats its gravity by $3.9\times10^{15}$
([4.6](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number)).

**(g) Its line.** The paper gives no friction for steel. If the mode rings with the **quality factor**
$\sym{quality-factor}{Q}$, the number of radians of swing in which its energy falls by a factor $e$, its tremor fills a
line about its note whose width is the damping rate $\sym{damping-rate}{\Gamma} = \omega_0/Q$, in $\mathrm{s^{-1}}$
([4.1](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push)). A bare $Q$
is a quality factor, never a moment. For an illustrative $Q = 10^4$ at $\omega_0 = 9.49\times10^4\unit{s^{-1}}$ the
line is 1.5 Hz wide. A tenfold friction makes it ten times wider and ten times lower, and its area stays
$q_{\rm rms}^2$ ([4.5](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums),
4.6).

**(h) The thermometer.** Push with the shell drive and read $y = D\!:\!\curv{\tE}$ at the pixel. At any frequency in
the line, $\omega S_{yy}/2\kB\,\mathrm{Im}\,\chi_{yy}$ returns 300 K, and none of steps (b) to (g) is needed: the note,
the shape, the Love number and the friction all cancel
([4.6](/tutorial/response/fluctuation-dissipation/#a-push-shaped-like-the-reading-makes-a-thermometer-that-needs-no-model-of-the-body)).

So the ball's story runs through the whole of Part 4. Its atoms move at random, and their motion makes its shape ring at
about 13 kHz by $10^{-16}$ m. That ringing makes a tide too weak for any camera we can build, yet it holds
$\int\matter\rho r^2\,\dd V$, a number that the ball's steady pull can never show. A push of the right shape measures
the same number at any temperature, and the ratio of the two is the temperature itself.

## The ledger: after Part 4, eighteen of Section IV's twenty equations are derived in full

Section IV has twenty numbered equations. R2 read eight of them and R3 eight more; this chapter reads the four of heat
and an applied tide.

| Equation | What it says | After Part 4 | Where it is derived |
|---|---|---|---|
| [](/paper/#eq:thermal-moment) | a warm body's moments change at the rate $\kB T\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ | derived | 4.2 |
| [](/paper/#eq:thermal-multipole) | each degree $\ell$ of the tremor holds $\int\matter\rho\,r^{2\ell-2}\,\dd V$ | derived | 2.2, 4.6 |
| [](/paper/#eq:sum-rule) | the friction's total is $\int\matter\rho\,|\nabla h|^2\,\dd V$ | derived | 4.5, 4.6 |
| [](/paper/#eq:thermometer) | the ratio of tremor to response is the temperature | derived | 4.6 |

With R2's and R3's ledgers, eighteen of the twenty are now derived in full. Section IV's [](/paper/#eq:current-column)
is derived in its integral; its weight, and [](/paper/#eq:magnetic-point), the magnetic part of one moving mass, wait
for chapter
[7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight).
Part 4 has also derived Section VI's [](/paper/#eq:maxwell) (4.4) and [](/paper/#eq:friction-sum) (4.5), Section XIII's
[](/paper/#eq:dust) (4.5), and the classical side of Appendix A's [](/paper/#eq:jitter-bounds) (4.6), whose quantum side
waits for Part 8.

::: check
### Q

Why do a ball and a thin shell of the same mass and radius tremble by $5/3$ "whatever their elastic constants and
their friction"?

### A

The total mean square rate of change of a moment is $\kB T\int\matter\rho|\nabla h|^2\,\dd V$, which holds only the
masses and their places (4.2). Stiffness and friction only move the tremor in frequency or widen its lines, and for the
quadrupole the integral is in the ratio of $\int\matter\rho r^2\,\dd V$, $\matter MR^2$ against $\tfrac35\matter MR^2$.

### Q

How can a camera see the steel ball's ringing although the ball emits one graviton in about $10^{18}$ years?

### A

It reads the near field, the changing Newtonian pull of the ball's present shape, which is not radiation (5.2).

### Q

By what factor is the steel ball's tide at 20 cm larger than at a metre, and by what factor does that shorten the
observing time?

### A

The tide falls as $r^{-5}$, so it is $5^5 = 3125$ times larger: $1.07\times10^{-21}$ against
$3.41\times10^{-25}\unit{s^{-2}}$. The information holds the fourth power of the tide, so the time falls by
$5^{20} = 9.5\times10^{13}$, as long as the tremor stays far below the noise.
:::

**The idea to keep: a warm body's moments tremble at a rate fixed by its temperature and its density, whatever its
forces, and a push measures the same numbers at any temperature. Each degree holds one moment of the density, so heat
and a push break the ties of the static field, and the ratio of tremor to response is a thermometer that needs no
model of the body.**

::: problems
### Practice

Rerun the steel ball for a ball of aluminium of the same size at 300 K, with chapter 4.3's $\matter\mu = 26\unit{GPa}$
and $\matter\rho = 2700\unit{kg\,m^{-3}}$. Find Rayleigh's note, the swing $q_{\rm rms}$, the tide a metre away on the
axis, and Kelvin's $k_2$.

::: solution
The mass is $2700 \times 4.19\times10^{-3} = 11.3\unit{kg}$, and $c_T = \sqrt{2.6\times10^{10}/2700} =
3100\unit{m\,s^{-1}}$. Rayleigh's note is $\sqrt{10}\,c_T/R = 9.81\times10^4\unit{s^{-1}}$, or 15.6 kHz. The stiffness
$3\matter\mu V/R^2 = 3.27\times10^{10}\unit{N\,m^{-1}}$ gives $q_{\rm rms} = \sqrt{4.14\times10^{-21}/3.27\times10^{10}}
= 3.6\times10^{-16}\unit m$. The tide is $36G\matter MRq/5 = 1.9\times10^{-25}\unit{s^{-2}}$, a little over half of
steel's, because the softer ball swings farther but is lighter. With $g_{\rm s} = 7.5\times10^{-8}\unit{m\,s^{-2}}$,
Kelvin's formula gives $k_2 = 1.2\times10^{-16}$, a third of steel's: aluminium's low density weakens its gravity more
than its softness helps.
:::

### Stretch

Combine chapters 3.3 and 4.3. A camera a metre from the steel ball needs one year to detect its tremor with some
chosen confidence, and the tremor stays far below the noise at every distance asked about, even at 50 cm. How long
does the camera need at 50 cm, and at 2 m? Then say when the condition fails.

::: solution
The information grows as the observing time times $r^{-20}$, so for the same information the time scales as $r^{20}$.
At 50 cm it is $2^{-20}$ of a year, $3.16\times10^7\unit s/1.05\times10^6 = 30\unit s$. At 2 m it is $2^{20}$ years,
about a million. Doubling the distance costs a factor of a million, because the tide falls as $r^{-5}$ and the
information holds its fourth power.

The condition fails first at 50 cm, where the tremor's spectrum is $2^{10} \approx 10^3$ times higher. Take the 1.5 Hz
line of capstone step (g), of width $\Gamma = 9.5\unit{s^{-1}}$, with its peak a fraction $p$ of the noise. Chapter
3.3's radiometer equation gives its separation $D$ (not the drive's table) as $D^2 \approx \tau p^2\Gamma/8$, so $D = 5$
in a year needs $p = 8\times10^{-4}$ at a metre and about 0.8 at 50 cm. That is not far below the noise, so 30 s is only
a lower limit.
:::

### The paper

Reproduce every number of the second paragraph of *What heat reveals* from the steel ball's radius, density and shear
speed ($R = 0.10\unit m$, $\matter\rho = 7850\unit{kg\,m^{-3}}$, $c_T = 3000\unit{m\,s^{-1}}$): the 15 kHz, the
$4\times10^8$ quanta, the $3\times10^{-25}\,\mathrm{s^{-2}}$, the $3\times10^{-4}$ and the $10^{14}$, and the Love
number of the next paragraph.

::: solution
Rayleigh's bound is $\omega = \sqrt{10}\times3000/0.10 = 9.49\times10^4\unit{s^{-1}}$, or 15.1 kHz. The quanta are
$\kB T/\hbar\omega = 4.14\times10^{-21}/(1.055\times10^{-34} \times 9.49\times10^4) = 4.1\times10^8$. The mass is
$32.9\unit{kg}$ and $\matter\mu = \matter\rho c_T^2 = 7.1\times10^{10}\unit{Pa}$, so the stiffness is
$8.9\times10^{10}\unit{N\,m^{-1}}$, $q_{\rm rms} = 2.2\times10^{-16}\unit m$ and the tide a metre away is
$3.4\times10^{-25}\unit{s^{-2}}$. Then $\omega r/c = 3.2\times10^{-4}$, and $5^{20} = 9.5\times10^{13}$. Finally
$g_{\rm s} = G\matter M/R^2 = 2.2\times10^{-7}\unit{m\,s^{-2}}$, $19\matter\mu/2\matter\rho g_{\rm s}R =
3.9\times10^{15}$ and $k_2 = 3.8\times10^{-16}$. Every number agrees with the paper's rounding.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), its plain words *Heat* and *A tide applied from outside*.
- [*What heat reveals*](/paper/#par:what-heat-reveals): equations [](/paper/#eq:thermal-moment) and
  [](/paper/#eq:thermal-multipole), the three conditions, the lattice, the steel ball and Figure
  [](/paper/#fig:tremor).
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals): equation [](/paper/#eq:sum-rule), the
  Love number and the static jitter.
- [*A model-independent thermometer*](/paper/#par:a-model-independent-thermometer): equation
  [](/paper/#eq:thermometer) and the shell drive.
- [*The trembling lattice*](/paper/#par:the-trembling-lattice) (Appendix A): the lattice, the trial shape and
  [](/paper/#eq:jitter-bounds).
- [*The field at two times*](/paper/#par:the-field-at-two-times) (Section XIII): [](/paper/#eq:hair-commutator) and
  [](/paper/#eq:dust), with the list of the integral's appearances.
:::

::: deeper
- The [GR course, section 22.7](https://neovand.github.io/general-relativity/chapter-22.html#22-7-a-horizon-gets-a-temperature)
  explains the temperature of a horizon, which the paper's thermometer reads from a black hole's near field (chapter
  [13.7](/tutorial/what-a-field-keeps/thermometer/#beside-a-hole-a-camera-can-read-its-temperature-without-catching-a-graviton)).
- P. R. Saulson, *Fundamentals of Interferometric Gravitational Wave Detectors* (2nd ed., World Scientific, 2017), in
  its chapters on thermal noise, applies the theorem and Levin's method to LIGO's mirrors.
:::

[^norm]: These factors assume the orthonormal harmonics that chapter 2.2 fixed; the paper states no convention, and
    the geodesists' harmonics, normalized to $4\pi$, would make each factor $4\pi$ times larger.

[^axis]: These numbers, like the paper's 85%, belong to one quadrupole, $h = z^2 - \tfrac12(x^2 + y^2)$, along an
    axis of the lattice, the $m = 0$ term of Eq. [](/paper/#eq:thermal-multipole) that the caption names and 4.6
    draws. A cubic lattice is not the same in every direction. For $h = xy$ the totals and their ratio 1.2203 are
    unchanged, but the strongest note holds 0.90 of the tremor and lies 0.81 times as high. Summed over all five
    orders, the strongest single note holds only 0.54, though 0.98 still lies below twice it.

[^mean]: The strongest mode and the median of the tremor both lie 2.34 times lower. The mean frequency weighted by
    the tremor is only 1.71 times lower, because the shell keeps 23% of its tremor in higher modes.

[^lamb]: The paper's estimated 15 kHz is Rayleigh's, as Appendix A says. A twist at 11.9 kHz lies lower, but it is a
    torsional mode, which turns each part around the centre, so it moves no mass inward or outward and makes no tide.

[^graviton]: The power is the quadrupole formula $P = (G/5c^5)\langle\dddot I_{ij}\dddot I_{ij}\rangle$, with
    $I_{ij} = \tfrac15\matter MRq\,\mathrm{diag}(-1, -1, 2)$ the trial shape's trace-free second moment and each time
    derivative a factor $\omega$; the count of gravitons divides it by $\hbar\omega$ (chapters 7.7 and 8.3).

[^sign]: For the trace-free second moment $\int\matter\rho(x_ix_j - \tfrac13r^2\delta_{ij})\,\dd V$ the rule
    reads $-\tfrac13k_2R^5\curv{\tE}_{ij}/G$, with $\curv{\tE}_{ij}$ the tide. A stretch along $z$ has a negative
    $\curv{\tE}_{zz}$ and makes the body longer along $z$: hence the minus sign. With 2.3's quadrupole, three times as
    large, the factor is $k_2R^5/G$. The margin note of
    [4.6's Love-number section](/tutorial/response/fluctuation-dissipation/#the-static-end-of-the-response-is-the-love-number)
    lists the three quadrupoles of these chapters.

[^kelvin]: Steel is not incompressible, but for a ball whose rigidity so far exceeds its gravity, a compressible ball
    with steel's ratio of moduli yields only 0.3% more, so the paper's number stands.

[^checks]: A quadrature of the shell against a dozen random point masses agrees to twelve figures, and a numerical
    second derivative of the shell's potential gives the same tide $6GfD/a^5$.
