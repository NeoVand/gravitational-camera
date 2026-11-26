---
id: '4.6'
title: 'Fluctuation and dissipation; Brownian motion; the Love number'
question: 'Why must a body that has friction also tremble, and by exactly how much? And how can a pixel use the answer to read the temperature of a body whose inside it does not know?'
part: '4'
requires: ['1.5', '2.2', '2.3', '3.2', '4.2', '4.3', '4.5']
paper: [sec:near-field, sec:no-lens, sec:hair, eq:thermal-moment, eq:thermal-multipole, eq:sum-rule, eq:thermometer, fig:tremor, eq:jitter-bounds, app:benchmarks, sec:thermal, sec:hole, eq:hole-noise, eq:hole-thermometer, fig:hole-response]
figures: [fig:tremor]
live: [tremor]
depth: A
---

A warm body trembles by itself, and the same body, pushed, turns some of the push into heat. These look like two
properties, but the tremor of a warm body is the dissipative part of its response. Dividing one by the other gives a
temperature,

$$T = \frac{\omega\,S_{yy}(\omega)}{2\kB\,\mathrm{Im}\,\chi_{yy}(\omega)} ,$$

where $S_{yy}$ is the spectrum of a reading $y$ and $\chi_{yy}$ the response of $y$ to its conjugate push, and every
unknown about the body, its modes, their shapes and how each shows at the pixel, cancels. Why must a body that has
friction also tremble, and by exactly how much? The answer is one formula, the fluctuation–dissipation theorem. With
it two ways of reading a body's inside, watching its warm tremor and pushing it with a tide, become one measurement,
and a pixel becomes a thermometer.[^letters][^p]

![Nothing pushes the ball, and still its tide a metre away trembles at the ball's note, because the ball is warm. The
ball's change of shape and the ring's are exaggerated; the ball and the distance are to scale; the air is
schematic.](tut-fd-hero){#fig:warm-ball}

::: plain
A grain of dust in water is pushed about at random by the water's molecules, and the same molecules slow it down when
it moves. The two come from one crowd of molecules, so they are linked: if the water slowed the grain more, it would
also have to push it harder, or the grain would not keep the energy that its temperature requires.

The same is true of anything that rings, such as a steel ball. A body that turns some of a push into heat at some
frequency also trembles by itself there, by the temperature times the friction at that frequency, divided by the
frequency. With no friction at a frequency, it does not tremble there.

So the tremor of a warm body, its answer to a push and its temperature fix one another: measure two and you know the
third. A pixel that both watches a body and pushes it is a thermometer, and it needs to know nothing about the body.
:::

## A grain in water is kicked at random and slowed by friction, and the two are linked

What fixes the strength of the random kicks that a small particle in water receives, and how far they carry it?
Section 4.2 found the speed of this
[Brownian motion](/tutorial/response/temperature/#the-first-case-is-brownian-motion-and-the-next-ones-see-inside),
$\langle\dot x_{\rm cm}^2\rangle = \kB T/\matter M$; now we follow it in time.

The particle, of mass $\matter m$, feels two forces from the water. When it moves at the velocity $v$ along one axis,
the water drags it with the force $-\matter m\Gamma v$, where $\Gamma$ is a damping rate in $\mathrm{s^{-1}}$, as for
the [cart](/tutorial/response/oscillator/#friction-makes-the-swing-die-away-and-the-quality-factor-counts-how-slowly)
of section 4.1. The molecules also strike it unevenly from moment to moment, which gives a **random force**
$\sym{thermal-force}{F_{\rm th}(t)}$, in newtons, with mean zero. Newton's law is then the **Langevin equation**,

$$\matter m\,\dot v = -\matter m\Gamma\,v + F_{\rm th}(t) . \label{eq:langevin}$$

We assume that **the kicks are white noise** in the sense of section
[3.2](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies): kicks at two
instants are uncorrelated, because each collision lasts about $10^{-13}$ s, far less than any time we watch. So the
force has a flat two-sided spectrum, a constant $\sym{force-spectrum}{S_F}$ in $\mathrm{N^2\,s}$. We assume also that
**the particle is in equilibrium with the water at the temperature $T$**.

We use the transforms $\tilde v(\omega) = \int v(t)\,e^{i\omega t}\,\dd t$ of section 3.2; a tilde marks a transform
here, not a phasor. A time derivative multiplies a transform by $-i\omega$, so [](#eq:langevin) becomes
$-i\omega\matter m\tilde v = -\matter m\Gamma\tilde v + \tilde F_{\rm th}$, and $\tilde v = \tilde F_{\rm
th}/\matter m(\Gamma - i\omega)$. When one record's transform is another's times a factor, its spectrum is the
other's times the squared modulus of the factor.[^filter] So the spectrum of the velocity is

$$S_v(\omega) = \frac{S_F}{\matter m^2(\omega^2 + \Gamma^2)} .$$

Its integral over $\dd\omega/2\pi$ is the variance of the velocity. Since $\int\dd\omega/(\omega^2 +
\Gamma^2) = \pi/\Gamma$, the variance is $S_F/2\matter m^2\Gamma$. Equipartition
([section 4.2](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share)) requires
it to be $\kB T/\matter m$, so

$$\boxed{\;S_F = 2\matter m\Gamma\,\kB T\;} . \label{eq:kick-strength}$$

The units agree: $\mathrm{kg\,s^{-1}} \times \mathrm{J} = \mathrm{N^2\,s}$. The kicks and the drag come from the same
molecules and cannot be chosen apart: a thicker liquid drags harder, so it must also kick harder, or the particle would
cool below the liquid's temperature. **A limit:** as $\Gamma \to 0$ the kicks vanish too.

**The wandering.** The spectrum $S_v$ is the [sluggish
noise](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies) of section 3.2.
After a time $t$ the particle has moved by $x =
t\,\bar v$, with $\bar v$ the velocity averaged over that time. When $t \gg 1/\Gamma$, the
[square-root law](/tutorial/noise/random-signals/#the-variance-of-white-noise-falls-as-one-over-the-observing-time)
gives $\mathrm{Var}\,\bar v = S_v(0)/t$, and $S_v(0) = 2\kB T/\matter m\Gamma$. So $\langle x^2\rangle = t^2\,
S_v(0)/t$, and

$$\langle x^2\rangle = 2\,\frac{\kB T}{\matter m\Gamma}\,t \qquad\text{along each axis.}$$

The mean square distance grows in proportion to the time, not its square: this is **diffusion**, and $\kB
T/\matter m\Gamma$, in $\mathrm{m^2\,s^{-1}}$, is the **diffusion constant**. It depends on the friction $\matter
m\Gamma$ but not on the mass. This link between wandering and friction is the **Einstein relation**. For a sphere of
radius $R_{\rm b}$ moving slowly through a liquid of viscosity $\sym{viscosity}{\matter\eta}$ ([section
4.4](/tutorial/response/viscosity/#viscosity-is-a-stress-that-answers-how-fast-a-shape-changes)), the drag is
$6\pi\matter\eta R_{\rm b}v$, which is **Stokes's law** of 1851, stated without proof. So $\matter m\Gamma =
6\pi\matter\eta R_{\rm b}$.

**A number.** A plastic bead of radius $0.5\unit{\mu m}$ and density $1050\unit{kg\,m^{-3}}$ in water ($\matter\eta =
1.0\times10^{-3}\unit{Pa\,s}$) at 293 K has $\matter m\Gamma = 9.4\times10^{-9}\unit{kg\,s^{-1}}$ and the diffusion
constant $4.3\times10^{-13}\unit{m^2\, s^{-1}}$. In one second it wanders $\sqrt{2 \times 4.3\times10^{-13}}\unit{m} =
0.93\unit{\mu m}$ along each axis, about its own diameter (Figure [](#fig:grain)), although its speed along one axis is
about $3\unit{mm\,s^{-1}}$: it forgets its velocity after $1/\Gamma = 6\times10^{-8}\unit{s}$, so it changes
direction about ten million times a second.

![In one second the bead wanders about its own diameter. The path is one simulated record; the molecules and arrows on
the right are schematic.](tut-fd-grain){#fig:grain}

::: history
### Einstein, Langevin and Perrin

Einstein predicted in 1905 that a particle in a liquid wanders with a mean square distance that grows in proportion to
the time, at a rate set by Boltzmann's constant, the temperature and Stokes's drag. Langevin wrote his equation
[](#eq:langevin) in 1908. Jean Perrin timed beads of resin under a microscope and found Avogadro's number, and so the
mass of a single atom (Nobel Prize, 1926): about $7\times10^{23}$, some 15% above today's $6.02\times10^{23}$.
:::

## An oscillator in a bath trembles by its friction over its frequency

We want the trembling of a warm oscillator at each frequency. We take the cart of section 4.1, of mass $\matter m$ on a
spring of stiffness $k$, and let its friction come from a bath, as for the grain. We assume that **the bath acts on the
cart only through the drag $-\matter m\Gamma\dot q$ and the kicks of [](#eq:kick-strength)**. The cart's law is the
driven oscillator of 4.1 with the random force as the push, so $\tilde q = \chi\,\tilde F_{\rm th}$, with the
[response function](/tutorial/response/oscillator/#a-steady-push-gets-a-steady-answer-the-response-function-times-the-push)
$\sym{response-function}{\chi}(\omega) = 1/\matter m(\omega_0^2 - \omega^2 - i\Gamma\omega)$. By the rule of the last
section the spectrum of $q$ is the spectrum of the force times $|\chi|^2$:

$$S_q(\omega) = |\chi(\omega)|^2\,S_F = 2\matter m\Gamma\,\kB T\,|\chi(\omega)|^2 .$$

Section 4.1 found that the dissipative part of the response is $\mathrm{Im}\,\chi = \matter m\Gamma\omega|\chi|^2$. We
replace $\matter m\Gamma|\chi|^2$ by $\mathrm{Im}\,\chi/\omega$:

$$\boxed{\;S_q(\omega) = \frac{2\kB T}{\omega}\,\mathrm{Im}\,\chi(\omega)\;} . \label{eq:fdt-one}$$

This is the **fluctuation–dissipation theorem** for one oscillator. The left side is a fluctuation, the trembling that
heat gives the cart with nothing pushing it. The right side is the dissipation, the part of its answer that
[turns the work of the push into
heat](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push). Both sides are
in $\mathrm{m^2\,s}$. The spectrum is two-sided, as in section 3.2.[^sides]

**Two checks**, for any friction. The variance is $\int S_q\,\dd\omega/2\pi = (2\kB T/\pi)\int_0^\infty\mathrm{Im}\,
\chi\,\dd\omega/\omega$, and the
[sum at the slow end](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums) of
section 4.5 says that this integral is $\chi(0) = 1/k$ times $\pi/2$, so $\langle q^2\rangle = \kB T/k$, the
equipartition of section 4.2. The velocity has the spectrum $\omega^2S_q$, and the sum at the fast end, with $A =
1/\matter m$, gives $\langle\dot q^2\rangle = \kB T/\matter m$, equipartition again.

**A number.** At resonance $\mathrm{Im}\,\chi(\omega_0) = Q/k$, so for the cart of section 4.5 with $Q = 10$ the
spectrum peaks at $2\kB TQ/k\omega_0 = 3.3\times10^{-22}\unit{m^2\,s}$, in a line $0.5\unit{s^{-1}}$ wide. The area
under the line is the static jitter $\kB T/k = 8.3\times10^{-23}\unit{m^2}$, the square of $9.1\times10^{-12}\unit m$,
about a sixth of the radius of a hydrogen atom.

So a body trembles, at each frequency, in proportion to its friction there. More friction does not make the cart
tremble more in all: the line becomes lower and wider by the same factor, and its area stays fixed by equipartition
(Figure [](#fig:lines)).

![The trembling and the friction over the frequency coincide at every frequency and for both quality factors. More
friction lowers and widens the line; its area, $\kB T/k$, is the same. Curves exact.](tut-fd-lines){#fig:lines}

## The theorem holds for every linear body, at every frequency

We want the theorem for a whole body and for any quantity we read from it. A body of masses
and springs moves in [normal modes](/tutorial/response/elastic-bodies/#masses-on-springs-move-in-normal-modes) (section
4.3), each an oscillator of unit mass with the mass-weighted amplitude $a_n$. We read a quantity $y$ that the motion
changes in proportion: $y = \sum_nc_na_n$, where $c_n$ is how far mode $n$ moves $y$ per unit of its amplitude.

We assume that **each mode has its own friction $\Gamma_n$ and its own kicks**, independent of the other modes'. Each
mode is then the cart of the last section with $\matter m = 1$, and its amplitude has the spectrum $(2\kB T/\omega)\,
\mathrm{Im}[1/(\omega_n^2 - \omega^2 - i\Gamma_n\omega)]$. The modes are uncorrelated, so the spectra of the terms of
$y$ add, each multiplied by $c_n^2$. We also push the body with a force $\sym{drive-amplitude}{f}$ that enters its
energy as $-fy$, as a steady force $F$ on the cart entered as $-Fq$. This push acts on mode $n$ with the force
$-\partial(-fy)/\partial a_n = c_nf$, and so $y$ answers with the sum of section 4.3,

$$\sym{reading-response}{\chi_{yy}}(\omega) = \sum_n\frac{c_n^2}{\omega_n^2 - \omega^2 - i\Gamma_n\omega} .$$

The same $c_n^2$ weigh the modes in the noise and in the response. Adding the modes' spectra gives, for the reading,

$$\boxed{\;\sym{reading-spectrum}{S_{yy}}(\omega) = \frac{2\kB T}{\omega}\,\mathrm{Im}\,\chi_{yy}(\omega)\;} .
\label{eq:fdt}$$

The push whose energy is $-fy$ is the **conjugate push** of $y$, and the theorem pairs each reading with its own
conjugate push.

::: gap
This sketch proves the theorem only for bodies whose friction damps each mode separately.

**Friction that couples the modes.** The theorem still holds. L. Onsager (1931) assumed that a fluctuation that arises
by chance dies away, on average, as the same displacement would if a push had made it, and the classical theorem follows
for any linear body in equilibrium. H. B. Callen and T. A. Welton proved it in quantum mechanics [@CallenWelton1951].

**Why the push must be conjugate.** A push that reached the modes with other weights $b_n$ would give the response
$\sum_nc_nb_n/(\omega_n^2 - \omega^2 - i\Gamma_n\omega)$, while the noise still weighs the modes by $c_n^2$, and the
ratio would change from body to body.
:::

Two forms follow at once. **The static form**: integrate [](#eq:fdt) over $\dd\omega/2\pi$, fold the negative
frequencies onto the positive ones, and use the slow-end sum of section 4.5, $\chi_{yy}(0) =
(2/\pi)\int_0^\infty\mathrm{Im}\,\chi_{yy}\,\dd\omega/\omega$:

$$\boxed{\;\langle\delta y^2\rangle = \kB T\,\chi_{yy}(0)\;} , \label{eq:static-form}$$

where $\delta y$ is the departure of $y$ from its mean. This is the [static
jitter](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share) that section 4.2
found for the cart, now for any reading of any body. **The velocity form**: the spectrum of $\dot y$ is
$\omega^2S_{yy}$, so

$$\boxed{\;\langle\dot y^2\rangle = \frac{2\kB T}{\pi}\int_0^\infty\omega\,\mathrm{Im}\,\chi_{yy}(\omega)\,\dd\omega\;}
. \label{eq:velocity-form}$$

**The limit where it fails.** The theorem is classical. In quantum mechanics the factor $2\kB T/\omega$ becomes
$\hbar\coth(\hbar\omega/2\kB T)$ (section 8.7): the classical factor times $x\coth x$, with $x = \hbar\omega/2\kB T$.
For $x \ll 1$, $x\coth x \approx 1 + x^2/3$, and [](#eq:fdt) returns. For the steel ball's lowest mass-quadrupole mode, at 12.6 kHz by
[Lamb's exact solution](/tutorial/response/elastic-bodies/#a-guessed-shape-overestimates-the-lowest-note-and-a-good-guess-comes-close),
$x = 1.0\times10^{-9}$ at 300 K, so the quantum correction is about $3\times10^{-19}$.

## The tremor and the applied tide are one fact

We want to see what the velocity form says about a moment of a body's mass, $\sym{mass-moment}{\matter Q_h} =
\int\matter\rho h\,\dd V$, with $h$ harmonic. Section 4.5
[pushed on it](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust) with a tide whose
potential is $-Fh$, so that the body's energy is $-F\matter Q_h$: the tide's strength $\sym{tide-strength}{F}$ is the
conjugate push of $\matter Q_h$, and the response is $\sym{tide-response}{\chi_h}$. Putting $y = \matter Q_h$ into
[](#eq:velocity-form) gives

$$\langle\matter{\dot Q}_h^2\rangle = \kB T\,\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi_h(\omega)\,\dd\omega .$$

Section
[4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)
found, from the law of the velocities alone, that two moments built from profiles $h$ and $g$ obey
$\langle\matter{\dot Q}_h\matter{\dot Q}_g\rangle = \kB T\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$. With $g = h$ the
left side above is $\kB T\int\matter\rho|\nabla h|^2\,\dd V$, and dividing both by $\kB T$ gives

$$\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi_h(\omega)\,\dd\omega = \int\matter\rho\,|\nabla h|^2\,\dd V ,$$

the sum rule of section 4.5. That section reached it from causality and the response of dust; here it comes from heat (Figure [](#fig:meeting)):
equipartition fixes the trembling, and the theorem turns the trembling into the response.

![Heat and causality reach the same total from opposite sides. Schematic.](tut-fd-meeting){#fig:meeting}

So the tremor watched at a known temperature and the response to a known tide measure the same number, the inertia
$\int\matter\rho|\nabla h|^2\,\dd V$. The push works at any temperature, even near absolute zero, where the tremor
dies away.

::: history
### Noise that shows what a steady field hides

That the noise of a source can show what its steady field hides was known for waves. Devaney (1979) [@Devaney1979] showed that the
correlations of the waves radiated by a source that fluctuates at random from point to point fix the source's strength
at every point, although a steady source of the same shape could hide part of itself from the outside, as the interiors
of section 2.5 hide from a steady field. Weaver and Lobkis (2001) [@WeaverLobkis2001] recorded the thermal noise of ultrasound at two
points on a block of metal, correlated the two records, and recovered the echoes that a pulse sent from one point would
have made at the other, although no pulse was ever sent.
:::

## Each degree of the tremor holds one moment of the density

We want the tremor of each degree of the multipoles of [section
2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments), $\matter Q_{\ell m} =
\int\matter\rho\,r^\ell Y_{\ell m}^*\,\dd V$. Each is a moment $\matter Q_h$ with $h = r^\ell Y_{\ell m}^*$, which is
harmonic. These moments are complex, so we use $|\matter{\dot Q}_h|^2 = \matter{\dot Q}_h\matter{\dot Q}_h^*$. The conjugate $\matter Q_h^*$ is the moment of $h^*$, so we take $g = h^*$ in the equation of
section 4.2, where $\nabla h\cdot\nabla h^* = |\nabla h|^2$, and sum over the $2\ell + 1$ orders $m$. The problem of
section
[2.2](/tutorial/outside/spherical-harmonics/#the-addition-theorem-turns-a-sum-over-m-into-one-legendre-polynomial)
found, from the addition theorem, that $\sum_m|\nabla(r^\ell Y_{\ell m})|^2 = \ell(2\ell + 1)^2r^{2\ell-2}/4\pi$ at
every point. So

$$\boxed{\;\sum_m\langle|\matter{\dot Q}_{\ell m}|^2\rangle = \frac{\ell(2\ell+1)^2}{4\pi}\,\kB T
\int\matter\rho\,r^{2\ell-2}\,\dd V\;} .$$

At $\ell = 2$ the factor is $50/4\pi = 3.98$.[^p2]

**Degree one** has the factor $9/4\pi$ and the integral $\int\matter\rho\,\dd V$, the mass. Its moments hold the centre
of mass, $\sum_m|\matter Q_{1m}|^2 = (3/4\pi)\matter M^2|\vect x_{\rm cm}|^2$,[^dipole] so the equation reads
$(3/4\pi)\matter M^2\langle|\dot{\vect x}_{\rm cm}|^2\rangle = (9/4\pi)\kB T\matter M$: the tremor of the dipole is
the Brownian motion of the whole body, $1.1\times10^{-11}\unit{m\,s^{-1}}$ along each axis for the steel ball.

**Degree two** gives $\int\matter\rho r^2\,\dd V$, the number that the static field cannot read ([section
2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)). A
uniform ball has $\tfrac35\matter MR^2$, and a thin shell of the same mass and radius has $\matter MR^2$, so their
quadrupoles tremble in the ratio $5/3$, whatever their elastic constants and their friction. A shell whose thickness is
a third of its radius trembles 1.234 times as much as the ball.[^thick] For a round body the whole sequence of degrees
fixes the density at every radius, because a distribution on a finite interval is fixed by all its moments ([section
3.9](/tutorial/noise/positivity/#a-positive-distribution-of-mass-is-fixed-by-a-few-of-its-moments)).

**Where the tremor lies.** The modes say where each total is spent. We number the particles by $p$. A mode moves particle $p$ by $a_n\vect
e_{n,p}/\sqrt{\matter m_p}$, with $\vect e_{n,p}$ the three entries of the unit mode shape at that particle. So, to
first order, it changes $\matter Q_h = \sum_p\matter m_ph(\vect x_p)$ by $a_nc_n$, with

$$c_n = \sum_p\sqrt{\matter m_p}\,\nabla h(\vect x_p)\cdot\vect e_{n,p} .$$

Each mode holds $\langle\dot a_n^2\rangle = \kB T$ by equipartition, and the modes are independent, so
$\langle\matter{\dot Q}_h^2\rangle = \kB T\sum_nc_n^2$, and mode $n$ carries the share $c_n^2/\sum c^2$.

The squares of the $c_n$ add up for the reason that section 4.3 gave for the weights adding up to $1/\matter m_a$: each
$c_n$ is the component, along the unit shape $\vect e_n$, of the list $\sqrt{\matter m_p}\,\partial_ih(\vect x_p)$, and
the unit shapes are the columns of an orthogonal matrix, which keeps a list's length. So $\sum_nc_n^2 =
\sum_p\matter m_p|\nabla h(\vect x_p)|^2$, the integral of section 4.2 once more, for any stiffnesses.

Figure [](/paper/#fig:tremor) adds up the $\kB Tc_n^2$ in order of frequency for a lattice ball of 924 masses and a lattice shell of
668, for the quadrupole $h = z^2 - \tfrac12(x^2 + y^2)$. The totals stand in the ratio
1.220 of the lattices' $\sum_p\matter m_pr_p^2$, close to the continuum's 1.234. The ball keeps most of its tremor in
one mode: its strongest mode holds 85% of it, and 99% lies below twice that mode's frequency. The shell is softer: its
strongest mode holds 77% and lies 2.34 times lower in frequency. Making every spring four times stiffer doubles every
frequency and leaves both totals unchanged. So the stiffness sets where the tremor lies, and the arrangement of the
mass sets how much there is.[^p3]

{{paper fig:tremor}}

::: try {#tremor}
The live version of Figure [](/paper/#fig:tremor), for the quadrupole along one axis. On the left, each body's tremor added up in
order of frequency, the ball in blue and the shell in orange; on the right, the spectrum of the quadrupole's rate, each
line drawn at its width. The sliders make every spring stiffer or softer and set one quality factor for every mode; the
buttons choose the ratio of the diagonal springs to the straight ones. The switch *Static jitter* adds up
$c_n^2/\omega_n^2$ instead of $c_n^2$. The readouts give the two totals and their ratio, each body's share in its
strongest mode, and the ratio of the strongest modes' frequencies.

Answer the predictions at the top of the figure first, then do what each asks. Afterwards, turn on *Static jitter* and
stiffen the springs again.
:::

## The static end of the response is the Love number

Astronomers measure a body's answer to a steady tide for the Earth and the planets. A tide
$\curv{\tE}_{ij}$ that does not change in time gives the body a steady quadrupole. With the
[quadrupole tensor](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)
$\matter Q_{ij} = \int\matter\rho(3x_ix_j - r^2\delta_{ij})\,\dd V$ of section 2.3, the one used here,[^three-q] a round
body of radius $R$ acquires

$$\matter Q_{ij} = -\frac{\sym{love-number}{k_2}\,R^5}{G}\,\curv{\tE}_{ij} , \label{eq:love}$$

and the pure number $k_2$ is the body's **Love number**. For the trace-free second moment $\int\matter\rho(x_ix_j -
\tfrac13r^2\delta_{ij})\,\dd V$, a third of $\matter Q_{ij}$, the rule reads $-\tfrac13 k_2R^5/G$ times the applied tide.
The minus sign makes a body grow longer along a stretch, a negative $\curv{\tE}_{zz}$.

**Why this quantity.** The tide's potential near the body's centre is $\tfrac12\curv{\tE}_{ij}x_ix_j$ (section 2.3), and
the new quadrupole adds, outside the body, the potential $-\tfrac12G\matter Q_{ij}x_ix_j/r^5$. By [](#eq:love) this is
$\tfrac12k_2\curv{\tE}_{ij}x_ix_j\,R^5/r^5$, which at the surface is $k_2$ times the tide's own potential. So $k_2$ says
how much a body adds to a tide by yielding to it: the static compliance, the slow end of $\chi_h$. **How it is
measured:** from the body's extra pull; the Earth's yielding to the Moon changes the orbits of satellites, which give
$k_2 \approx 0.30$.[^gravimeters] **An example:** a ball of fluid of uniform density has $k_2 = \tfrac32$. **A
non-example:** the quadrupole of a body that rings is not its Love number; $k_2$ belongs to a steady tide only.

**Kelvin's ball.** A uniform, incompressible, elastic ball of rigidity
$\sym{shear-modulus}{\matter\mu}$ and density $\matter\rho$, held together by its own gravity, has

$$k_2 = \frac{3/2}{1 + 19\matter\mu/2\matter\rho g_{\rm s}R} , \label{eq:kelvin}$$

where $\sym{surface-gravity}{g_{\rm s}} = G\matter M/R^2$ is the pull of gravity at its surface (Love, 1909 [@Love1909]).
It is plausible: gravity resists a bulge with a stiffness about $\matter\rho g_{\rm s}R$, a pressure like $\matter\mu$,
and the rigidity adds to it. **Two checks:** with $\matter\mu = 0$ it gives the fluid's $\tfrac32$, and as $\matter\mu$
grows it falls to zero, the Love number of a rigid body.

We derive it. We assume that **the tide is steady**, so that every bit of the ball is at rest in balance, that **the
ball is uniform**, and that **it is incompressible**, $\nabla\cdot\vect u = 0$: section 4.3's law with an infinite
bulk modulus, in which the pressure is not set by the strain but by whatever the balance of forces requires. Inside,
the stress balances the pull of the whole potential of degree two, the applied tide's together with that of the ball's
own bulge. At the moved surface the stress must also carry the weight of the bulge, $\matter\rho g_{\rm s}$ per square
metre for each metre that the surface rises. The box below solves these conditions. The surface rises by

$$u_r = -\frac{5\matter\rho R^3}{2}\,\frac{\hat n\cdot\curv{\tE}'\cdot\hat n}{19\matter\mu + 5\matter\rho g_{\rm s}R} ,$$

where $\hat n$ is the outward direction and $\curv{\tE}'$ the tide inside the ball, the applied one raised by the
bulge's own pull; the bulge's quadrupole then gives [](#eq:kelvin). The 19 comes from the rigidity's two ways of
resisting, the shear inside and the pressure that keeps the volume fixed.

::: derivation
### Kelvin's formula from the equations of an elastic ball

**Inside.** Write the potential of degree two inside the ball as $\tfrac12\curv{\tE}'_{ij}x_ix_j$, with
$\curv{\tE}'$ trace-free and proportional to the applied $\curv{\tE}$. The ball's density does not change inside,
because it is uniform and incompressible, so the only new force on a bit is the pull of this potential. With the stress
$\matter T_{ij} = -P\delta_{ij} + 2\matter\mu u_{ij}$, of which $-P$ is the change of pressure, the balance of forces
of section 4.3 at rest is $\partial_j\matter T_{ij} = \matter\rho\,\curv{\tE}'_{ij}x_j$. Since $\nabla\cdot\vect u =
0$, $2\partial_ju_{ij} = \nabla^2u_i$, and the balance reads

$$\matter\mu\nabla^2\vect u = \nabla\Pi, \qquad \Pi = P + \tfrac12\matter\rho\,x_i\curv{\tE}'_{ij}x_j .$$

Taking the divergence, and using $\nabla\cdot\vect u = 0$, gives $\nabla^2\Pi = 0$.

**A trial form.** The answer is built from $\vect x$ and the table $\curv{\tE}'$, linear in the table, and of first
and third degree in $\vect x$:

$$\vect u = \alpha\,\curv{\tE}'\vect x + \beta\bigl(r^2\,\curv{\tE}'\vect x - \tfrac25\,\vect x\,(\vect
x\cdot\curv{\tE}'\vect x)\bigr) ,$$

with constants $\alpha$ in $\mathrm{s^2}$ and $\beta$ in $\mathrm{s^2\,m^{-2}}$. Because $\curv{\tE}'$ has no trace,
$\nabla\cdot(\curv{\tE}'\vect x) = 0$, $\nabla\cdot(r^2\curv{\tE}'\vect x) = 2\,\vect x\cdot\curv{\tE}'\vect x$ and
$\nabla\cdot(\vect x\,(\vect x\cdot\curv{\tE}'\vect x)) = 5\,\vect x\cdot\curv{\tE}'\vect x$, so $\nabla\cdot\vect u =
(2 - 2)\beta\,\vect x\cdot\curv{\tE}'\vect x = 0$. The Laplacians are $\nabla^2(r^2\curv{\tE}'\vect x) =
10\,\curv{\tE}'\vect x$ and $\nabla^2(\vect x\,(\vect x\cdot\curv{\tE}'\vect x)) = 4\,\curv{\tE}'\vect x$, so
$\matter\mu\nabla^2\vect u = \tfrac{42}5\matter\mu\beta\,\curv{\tE}'\vect x$, which is $\nabla\Pi$ for the harmonic
$\Pi = \tfrac{21}5\matter\mu\beta\,\vect x\cdot\curv{\tE}'\vect x$. Both conditions inside hold.

**The traction on a sphere.** On a sphere of radius $r$ the stress pulls with $\matter T_{ij}x_j/r$ per square metre.
The identity $2u_{ij}x_j = (\vect x\cdot\nabla)u_i + \partial_i(\vect x\cdot\vect u) - u_i$ follows from the
definition of the strain. Each term of $\vect u$ is homogeneous, so $\vect x\cdot\nabla$ multiplies it by its degree;
and $\vect x\cdot\vect u = (\alpha + \tfrac35\beta r^2)\,\vect x\cdot\curv{\tE}'\vect x$. Adding the three parts,

$$2u_{ij}x_j = \bigl(2\alpha + \tfrac{16}5\beta r^2\bigr)\,(\curv{\tE}'\vect x)_i + \tfrac25\beta\,x_i\,(\vect
x\cdot\curv{\tE}'\vect x) .$$

**The surface.** Before the tide the pressure inside falls to zero at $r = R$ with the slope $-\matter\rho g_{\rm s}$.
When the surface rises by $u_r$, the total stress there must still vanish, so the new stress must supply
$-\matter\rho g_{\rm s}u_r$ along the outward normal and nothing along the surface:
$\matter T_{ij}x_j = -\matter\rho g_{\rm s}u_r\,x_i$ at $r = R$. The part along $\curv{\tE}'\vect x$ gives $2\alpha +
\tfrac{16}5\beta R^2 = 0$, so $\alpha = -\tfrac85\beta R^2$, and the surface rises by $u_r = \vect x\cdot\vect u/R =
-\beta R^3\,\hat n\cdot\curv{\tE}'\cdot\hat n$. The part along $\vect x$, with $P = \Pi - \tfrac12\matter\rho\,\vect
x\cdot\curv{\tE}'\vect x$, gives

$$-\tfrac{21}5\matter\mu\beta + \tfrac12\matter\rho + \tfrac25\matter\mu\beta = \matter\rho g_{\rm s}R\,\beta, \qquad
\beta = \frac{5\matter\rho}{2\,(19\matter\mu + 5\matter\rho g_{\rm s}R)} .$$

**The bulge.** The surface carries a layer of surface density $\matter\rho u_r$. By the integral of four $\hat n$'s over the sky,
$\tfrac{4\pi}{15}(\delta_{ij}\delta_{kl} + \delta_{ik}\delta_{jl} + \delta_{il}\delta_{jk})$ (derived for the
thermometer below), its quadrupole is $\matter Q_{ij} = \int\matter\rho u_r(3\hat n_i\hat n_j - \delta_{ij})R^4\,\dd
\Omega = -\tfrac{8\pi}5\matter\rho\beta R^7\curv{\tE}'_{ij}$. Inside, such a layer makes the potential
$-(4\pi G/5R)\,r^2\matter\rho u_r(\hat x)$ (the thermometer's shell, below), a tide
$\tfrac{8\pi}5G\matter\rho\beta R^2\,\curv{\tE}'$. With $\tfrac43\pi G\matter\rho R = g_{\rm s}$ this is
$3\matter\rho g_{\rm s}R\,\curv{\tE}'/(19\matter\mu + 5\matter\rho g_{\rm s}R)$, and it adds to the applied tide:

$$\curv{\tE}' = \curv{\tE} + \frac{3\matter\rho g_{\rm s}R}{19\matter\mu + 5\matter\rho g_{\rm s}R}\,\curv{\tE}'
\quad\Longrightarrow\quad \curv{\tE}' = \frac{19\matter\mu + 5\matter\rho g_{\rm s}R}{19\matter\mu + 2\matter\rho g_{\rm
s}R}\,\curv{\tE} .$$

**The Love number.** Then $\matter Q_{ij} = -4\pi\matter\rho^2R^7\curv{\tE}_{ij}/(19\matter\mu + 2\matter\rho g_{\rm
s}R)$, and comparing with [](#eq:love),

$$k_2 = \frac{4\pi G\matter\rho^2R^2}{19\matter\mu + 2\matter\rho g_{\rm s}R} = \frac{3\matter\rho g_{\rm
s}R}{19\matter\mu + 2\matter\rho g_{\rm s}R} = \frac{3/2}{1 + 19\matter\mu/2\matter\rho g_{\rm s}R} ,$$

which is [](#eq:kelvin). The units agree: $\matter\rho g_{\rm s}R$ is a pressure, like $\matter\mu$.
:::

**Numbers.** The steel ball ($R = 0.10\unit m$, $\matter M = 32.9\unit{kg}$, $\matter\mu = 71\unit{GPa}$) has
$g_{\rm s} = 2.2\times10^{-7}\unit{m\,s^{-2}}$, 45 million times less than the Earth's. Its rigidity beats its gravity
by $19\matter\mu/2\matter\rho g_{\rm s}R = 3.9\times10^{15}$, so $k_2 = 3.8\times10^{-16}$. The Earth, of radius
6371 km, mean density $5513\unit{kg\,m^{-3}}$ and $g_{\rm s} = 9.81\unit{m\,s^{-2}}$, would have its measured
$k_2 = 0.30$ if it were a uniform ball of rigidity $\matter\mu = 8\matter\rho g_{\rm s}R/19 = 145\unit{GPa}$, about
twice steel's.

::: history
### Kelvin weighs the rigidity of the Earth

In 1863 William Thomson, later Lord Kelvin, asked how much the solid Earth yields to the Moon and the Sun. The ocean's
tides are measured against the shore, so if the ground rose and fell with the water, the tides would look smaller than
for a rigid Earth. They do not look much smaller, and from that alone he concluded that the Earth's rigidity "must be
greater than that of glass" (*Philosophical Transactions of the Royal Society* 153, 573, 1863). A. E. H. Love
introduced the numbers that measure the yielding in 1909, and T. Shida named them Love numbers in 1912.
:::

**A check from the trial shape.** We want the Love number of the trial shape of section 4.3. We take an axial
tide, $\curv{\tE} = \curv{\tE}_{zz}\,\mathrm{diag}(-\tfrac12, -\tfrac12, 1)$, and the shape's amplitude $q$, in metres.
Section 4.3 found that the shape changes the second moment $\int\matter\rho x_ix_j\,\dd V$ by $\tfrac15\matter
MRq\,\mathrm{diag}(-1, -1, 2)$, a change with no trace. The body's energy in the tide's potential is
$\int\matter\rho\,\tfrac12\curv{\tE}_{ij}x_ix_j\,\dd V$, which changes by $\tfrac12\curv{\tE}_{ij}$ times that change,
$\tfrac3{10}\matter MR\curv{\tE}_{zz}q$. With the stiffness $K = 3\matter\mu V/R^2$ of 4.3, the energy is

$$\tfrac12Kq^2 + \tfrac3{10}\matter MR\,\curv{\tE}_{zz}\,q ,$$

and it is least at $q = -\tfrac3{10}\matter MR\curv{\tE}_{zz}/K$. The quadrupole of section 2.3, three times the
trace-free second moment, is then $\matter Q_{zz} = 3 \times \tfrac25\matter MRq = \tfrac65\matter MRq$. With
$\matter M = \matter\rho V$ and $G\matter M/R = g_{\rm s}R$, comparing with [](#eq:love) gives

$$\boxed{\;k_2 = \frac{3\matter\rho g_{\rm s}R}{25\matter\mu} = \frac{4\pi G\matter\rho^2R^2}{25\matter\mu}\;} .$$

For the steel ball this is $2.9\times10^{-16}$. Kelvin's formula, for $\matter\mu \gg \matter\rho g_{\rm s}R$, is
$3\matter\rho g_{\rm s}R/19\matter\mu$, so the trial shape gives $19/25 = 0.76$ of it, as it must: any guessed shape
yields less than the true one of least energy.

**Yielding is a ratio of two frequencies, squared.** Section 4.3 found the trial shape's note, $\omega_1^2 =
10\,c_T^2/R^2 = 10\matter\mu/\matter\rho R^2$. We put $\matter\mu = \matter\rho R^2\omega_1^2/10$ into the trial
shape's Love number:

$$k_2 = \frac{8\pi}{5}\,\frac{G\matter\rho}{\omega_1^2} .$$

The radius has gone. The number $\sqrt{G\matter\rho}$ is a frequency set by gravity alone: a satellite skimming a ball
of density $\matter\rho$ circles it at $\sqrt{4\pi G\matter\rho/3}$. So a body yields to a tide by the square of the
ratio of this frequency to the note at which it rings. For steel, $G\matter\rho = 5.2 \times 10^{-7}\unit{s^{-2}}$ and
$G\matter\rho/\omega_1^2 = 5.8 \times 10^{-17}$ for the 10 cm ball. The yielding reaches order one only when the note
falls to about $\sqrt{G\matter\rho}$, which for steel means a ball of radius $c_T\sqrt{50/8\pi G\matter\rho} =
6000\unit{km}$, as large as the Earth; and the Earth's own $k_2$ is 0.30. Matter answers a tide only by deforming, so
no slab of laboratory size can restore the fading detail of section 2.7, as a slab of negative permittivity restores
it for light.[^yield]

**Stars of different matter yield alike.** For neutron stars, Yagi and Yunes (2013) [@YagiYunes2013] found that the moment of inertia,
the quadrupole that the star's spin gives it, and its Love number are tied to one another to about one per cent,
whatever the matter inside, so that a measurement of one gives the other two. Newton's gravity
already shows the first link. For a star of moment of inertia $I$ about an axis, the pure numbers of relativity are
$\bar I = Ic^4/G^2\matter M^3 = (I/\matter MR^2)\,C^{-2}$ and $\bar\lambda = \tfrac23k_2(c^2R/G\matter M)^5 =
\tfrac23k_2\,C^{-5}$, with $C = G\matter M/Rc^2$. Eliminating $C$ gives $\bar I = \kappa\,\bar\lambda^{2/5}$, with

$$\kappa = \frac{I/\matter MR^2}{\bigl(\tfrac23k_2\bigr)^{2/5}} .$$

A uniform liquid ball has $I/\matter MR^2 = \tfrac25$ and $k_2 = \tfrac32$, so $\kappa = 0.400$. A liquid star whose
pressure grows as the square of its density has $I/\matter MR^2 = \tfrac23(1 - 6/\pi^2) = 0.261$ and $k_2 = 15/\pi^2 -
1 = 0.520$ (the stretch problem derives both), so $\kappa = 0.399$. The two stars differ by a factor of three in $k_2$
and of 1.5 in $I/\matter MR^2$, and agree in $\kappa$ to 0.2%.

**The static jitter.** We take the moment $\matter Q_h$ with $h = x_iU_{ij}x_j$, where $U$ is a fixed trace-free table
with $U_{ij}U_{ij} = 1$. Since $U$ has no trace, $\matter Q_h = U_{ij}\matter Q_{ij}/3$ (section 2.3). The tide $-Fh$ is $\tfrac12\curv{\tE}_{ij}x_ix_j$ with $\curv{\tE} = -2FU$, so
[](#eq:love) gives $\matter Q_{ij} = 2k_2R^5FU_{ij}/G$, and

$$\matter Q_h = \frac{2k_2R^5}{3G}\,U_{ij}U_{ij}\,F = \frac{2k_2R^5}{3G}\,F .$$

So the static compliance is $\chi_h(0) = 2k_2R^5/3G$, in $\mathrm{kg\,m^2\,s^2}$, the unit of $\matter Q_h$ per unit of
$F$. The static form [](#eq:static-form) then gives the static jitter,

$$\langle\delta\matter Q_h^2\rangle = \kB T\,\chi_h(0) = \frac{2k_2R^5}{3G}\,\kB T .$$

For the steel ball with the trial shape's $k_2$, at 300 K, this is $(3.5\times10^{-16}\unit{kg\,m^2})^2$. For
$U = \mathrm{diag}(-\tfrac12, -\tfrac12, 1)/\sqrt{3/2}$ the shape changes $\matter Q_h$ by $0.490\,\matter MRq$, so the
poles swing by $q_{\rm rms} = 2.2\times10^{-16}\unit m$: the number that section 4.3 found from equipartition, reached
now from the Love number. Kelvin's $k_2$ would make it $2.5\times10^{-16}\unit m$.

**Stated: the quantum bounds.** When $\hbar\omega$ is not small, the jitter lies between the classical value and that of
a single mode at the frequency $\sqrt{A/\chi_0}$, with $\chi_0 = \chi_h(0)$ and $\sym{response-sum}{A}$ the
[fast-end sum](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums) of section
4.5:

$$\kB T\chi_0 \le \langle\delta\matter Q_h^2\rangle \le \frac\hbar2\sqrt{A\chi_0}\,\coth\!\Bigl(\frac{\hbar}{2\kB T}
\sqrt{\frac{A}{\chi_0}}\Bigr) .$$

Section 8.7 derives it.[^p4] For one mode with $\hbar\omega_0 \ll \kB T$ the two bounds meet at $\kB
T\chi_0$.[^one-mode]

## A push shaped like the reading makes a thermometer that needs no model of the body

Solving [](#eq:fdt) for $T$ gives the thermometer of the opening,

$$\boxed{\;T = \frac{\omega\,S_{yy}(\omega)}{2\kB\,\mathrm{Im}\,\chi_{yy}(\omega)}\;} .$$

The modes, their frequencies, their frictions and the weights $c_n^2$ enter $S_{yy}$ and $\mathrm{Im}\,\chi_{yy}$
in the same way, so they cancel. But the theorem holds only for a reading and its conjugate push. The pixel reads $y = \sym{drive-table}{D}\!:\!\curv{\tE} = D_{ij}\curv{\tE}_{ij}$, the
contraction of
[section 1.5](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length) with
a fixed trace-free table $D$, a pure number for each entry, where $\curv{\tE}$ is the tide of the body at the pixel. So
we need a push whose energy is exactly $-f\,D\!:\!\curv{\tE}$, whatever the body: Levin's idea, invented for the mirrors
of LIGO [@Levin1998].[^D]

**The push.** Put round the pixel a thin spherical shell of radius $a$, in metres, and shift mass about on it, so that
its surface density $\sym{surface-density}{\matter\sigma}$ changes by

$$\delta\matter\sigma(\hat n) = -\frac{15f}{4\pi a^4}\,\hat n\cdot D\cdot\hat n ,$$

where $\hat n$ points from the pixel to a point of the shell and $f$ is the push's strength, in $\mathrm{kg\,m^2}$, so
that $\delta\matter\sigma$ is in $\mathrm{kg\,m^{-2}}$. We assume that **all the other matter lies outside the shell**.

**Its energy in the field of that matter.** Inside the shell, the
[interior expansion](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics)
of section 2.3 writes the potential of the outside matter as a sum of growing harmonics: a constant, a uniform pull, the
tide's $\tfrac12\curv{\tE}_{ij}x_ix_j$, and terms of degree three and more. The table $D$ is trace-free, so $\hat n\cdot
D\cdot\hat n$ is a pattern of degree two, and by the
[orthogonality of the patterns](/tutorial/outside/spherical-harmonics/#patterns-of-different-degree-are-orthogonal-and-every-pattern-is-a-sum-of-them)
only the tide's term survives in $\int\delta\matter\sigma\,\field\Phi\,\dd A$. With $x = a\hat n$ and $\dd A =
a^2\,\dd\Omega$,

$$\int\delta\matter\sigma\,\field\Phi\,\dd A = -\frac{15f}{8\pi}\,D_{kl}\,\curv{\tE}_{ij}\oint\hat n_i\hat n_j\hat
n_k\hat n_l\,\dd\Omega .$$

The integral of four $\hat n$'s over the sky is $\tfrac{4\pi}{15}(\delta_{ij}\delta_{kl} + \delta_{ik}\delta_{jl} +
\delta_{il}\delta_{jk})$.[^sky] The first term multiplies the trace of $\curv{\tE}$ and the trace of $D$, both zero, and
the other two each give $D\!:\!\curv{\tE}$, so

$$\boxed{\;\int\delta\matter\sigma\,\field\Phi\,\dd A = -f\,D\!:\!\curv{\tE}\;} , \label{eq:drive}$$

exactly, for any matter outside the shell. The units agree: $\mathrm{kg\,m^2}\times\mathrm{s^{-2}}$ is a joule. The push
has no degree zero or one: it adds no mass, makes no uniform pull at the pixel and feels no net force from the uniform
part of the outside field.

So the push enters the energy as $-fy$ with $y = D\!:\!\curv{\tE}$, the pixel's own reading, and the theorem applies to
the pair (Figure [](#fig:thermometer)).

**The shell's own field.** The pixel reads the whole tide at its place, so its reading holds the shell's own tide as
well as the body's. The pixel lies inside the shell, and the interior expansion, of which only degree two survives,
gives[^shell]

$$\begin{aligned}
\field\Phi_{\rm shell} &= -\frac{4\pi G}{5a}\,r^2\,\delta\matter\sigma(\hat x) = \frac{3Gf}{a^5}\,x_iD_{ij}x_j ,\\
\curv{\tE}_{ij}^{\rm shell} &= \frac{6GfD_{ij}}{a^5} .
\end{aligned}$$

This tide follows $f$ with no delay, so it adds the real constant $6G\,D\!:\!D/a^5$ to $\chi_{yy}$: it adds to
$\mathrm{Re}\,\chi_{yy}$ and nothing to $\mathrm{Im}\,\chi_{yy}$, which is all the thermometer uses. A body whose
modes are at different temperatures reads as an average of its temperatures, weighted by where it
dissipates.[^unequal]

![Mass is moved to make a pattern of degree two, which pushes on exactly what the pixel reads. Pattern exact; sizes and
the inset schematic.](tut-fd-thermometer){#fig:thermometer}

**A black hole.** A black hole answers a slow tide with pure friction, $\mathrm{Im}\,\chi = \nu\omega$ (section 11.4),
and its quadrupole trembles with a flat spectrum $S_Q$; the scale of the quadrupole cancels in $T$.[^scale] The
thermometer gives $T = S_Q/2\kB\nu$. With $S_Q = \hbar r_s^5/360\pi G$ and $\nu = \matter Mr_s^5/90c^3$, the ratio
$S_Q/\nu$ is $\hbar c^3/4\pi G\matter M$, so

$$T = \frac{S_Q}{2\kB\,\nu} = \frac{\hbar c^3}{8\pi G\matter M\kB} ,$$

the Hawking temperature. A hole of $1.356\times10^{23}\unit{kg}$, about twice the Moon's mass, is at 0.905 K, the
temperature of gravitons left from the early universe: the hole is as warm as the sky round it.[^p5] Section
[13.7](/tutorial/what-a-field-keeps/thermometer/#beside-a-hole-a-camera-can-read-its-temperature-without-catching-a-graviton)
reads this result.

**The idea to keep: friction and trembling are two faces of one coupling to the heat bath, so a reading trembles at each
frequency by $2\kB T$ times its friction there over the frequency. A warm body's tremor, its response to a push and its
temperature therefore fix one another; the tremor of each degree holds one moment of the density,
$\int\matter\rho\,r^{2\ell-2}\,\dd V$, whatever the springs; and a push shaped like the reading turns the pixel into a
thermometer that needs no model of the body.**

::: problems
### Practice

**[4.6]** How far does a bead of radius 1 µm wander along one axis in one minute, in water at 293 K?

::: solution
Its diffusion constant is $\kB T/6\pi\matter\eta R_{\rm b} = 4.05\times10^{-21}/(6\pi \times 10^{-3} \times
10^{-6})\unit{m^2\,s^{-1}} = 2.1\times10^{-13}\unit{m^2\,s^{-1}}$, so in 60 s it wanders $\sqrt{2 \times
2.1\times10^{-13} \times 60}\unit m = 5.1\unit{\mu m}$, five times its radius.
:::

**[4.6]** A body has no friction at 1 MHz. Does its reading tremble at 1 MHz?

::: solution
No: by [](#eq:fdt), $S_{yy}$ vanishes where $\mathrm{Im}\,\chi_{yy}$ does.
:::

**[4.6]** How many times more does a thin shell's quadrupole tremble, in mean square rate, than that of a uniform ball
of the same mass and radius at the same temperature?

::: solution
$5/3$, the ratio of their $\int\matter\rho r^2\,\dd V$, $\matter MR^2$ against $\tfrac35\matter MR^2$, whatever their
springs and friction.
:::

**[4.6]** Why must the thermometer's push couple to exactly the pixel's reading?

::: solution
With any other push the modes would be weighed differently in the noise and in the response, and the body's unknowns
would not cancel.
:::

**[4.6]** By Kelvin's formula, what is the Love number of a steel ball of radius 1 m, and how does it compare with
$\tfrac{8\pi}5G\matter\rho/\omega_1^2$?

::: solution
In the rigid limit $k_2 = 3\matter\rho g_{\rm s}R/19\matter\mu = 4\pi G\matter\rho^2R^2/19\matter\mu$ grows as $R^2$,
so the 1 m ball has $100 \times 3.8 \times 10^{-16} = 3.8 \times 10^{-14}$. The trial shape's
$\tfrac{8\pi}5G\matter\rho/\omega_1^2$ also grows as $R^2$, because $\omega_1 \propto 1/R$: $100 \times 2.9 \times
10^{-16} = 2.9 \times 10^{-14}$, again $19/25$ of Kelvin's.
:::

### Stretch

**[4.6]** A liquid star has a pressure $p = K\matter\rho^2$, with $K$ a constant. (a) From the balance $\dd p/\dd r =
-\matter\rho\,\dd\field\Phi/\dd r$ and Poisson's equation $\nabla^2\field\Phi = 4\pi G\matter\rho$, show that
$\nabla^2\matter\rho + k^2\matter\rho = 0$ with $k^2 = 2\pi G/K$, so that $\matter\rho = \matter\rho_c\sin(kr)/kr$ and
the radius is $R = \pi/k$. (b) Show that $I/\matter MR^2 = \tfrac23(1 - 6/\pi^2)$. (c) Under a steady tide the liquid
follows the total potential, $\delta\matter\rho = -\delta\field\Phi/2K$. Write $\delta\field\Phi = H(r)\,P_2(\cos
\vartheta)$ and show that $H'' + 2H'/r - 6H/r^2 + k^2H = 0$, whose solution regular at the centre is $j_2(kr)$, with
$j_2(x) = (3/x^3 - 1/x)\sin x - 3\cos x/x^2$. Outside, $H = Ar^2 + Br^{-3}$, the applied tide and the star's answer,
so that $k_2 = B/AR^5$. Match $H$ and $H'$ at $r = R$ and show that $k_2 = 15/\pi^2 - 1$.

::: solution
(a) $\dd p/\dd r = 2K\matter\rho\,\dd\matter\rho/\dd r$, so $2K\,\dd\matter\rho/\dd r = -\dd\field\Phi/\dd r$ and
$2K\matter\rho + \field\Phi$ is constant. Taking the Laplacian, $2K\nabla^2\matter\rho = -4\pi G\matter\rho$. The
solution finite at the centre is $\sin(kr)/kr$, which first vanishes at $kr = \pi$.

(b) With $x = kr$, $\matter M \propto \int_0^\pi x\sin x\,\dd x = \pi$, and $I = \tfrac23\int\matter\rho r^2\,\dd V
\propto \tfrac23\int_0^\pi x^3\sin x\,\dd x/k^2 = \tfrac23(\pi^3 - 6\pi)/k^2$. Dividing by $\matter MR^2 \propto
\pi \cdot \pi^2/k^2$ gives $\tfrac23(1 - 6/\pi^2) = 0.261$.

(c) The applied part of $\delta\field\Phi$ is harmonic, so $\nabla^2\delta\field\Phi = 4\pi G\,\delta\matter\rho =
-k^2\,\delta\field\Phi$; with the pattern $P_2$, the Laplacian gives $H'' + 2H'/r - 6H/r^2$ (section 2.2). The density
vanishes at the surface, so no layer forms there and $H$ and $H'$ are continuous. With $y = RH'/H$ at $r = R$, the
outside form gives $y = (2 - 3k_2)/(1 + k_2)$, so $k_2 = (2 - y)/(3 + y)$. Inside, at $x = \pi$, $j_2(\pi) = 3/\pi^2$
and $j_2'(\pi) = 1/\pi - 9/\pi^3$, so $y = \pi j_2'(\pi)/j_2(\pi) = (\pi^2 - 9)/3$. Then $k_2 = (15 - \pi^2)/\pi^2 =
0.520$. The uniform liquid ball's $\tfrac32$ is three times larger, because its mass sits farther out.
:::

**[4.6]** In a bath at 300 K, with the same friction on each cart, find the mean square displacement and velocity of
the first of the
[two coupled carts](/tutorial/response/oscillator/#a-body-with-many-modes-answers-as-a-sum-of-oscillators) of section
4.1, using the two sums of section 4.5 and without integrating any spectrum.

::: solution
The first cart's coordinate is a reading whose conjugate push is a force on that cart. The static form gives
$\langle q_1^2\rangle = \kB T\chi_{11}(0) = 4.14\times10^{-21} \times 0.0133\unit{m^2} = 5.5\times10^{-23}\unit{m^2}$,
a root mean square of $7.4\times10^{-12}\unit m$. The velocity form and $A = 1/\matter m$ give $\langle\dot q_1^2\rangle
= \kB T/\matter m = 2.1\times10^{-21}\unit{m^2\,s^{-2}}$, equipartition for one cart.
:::

### The camera

**[4.6]** Check the quantum bounds on the jitter for the steel ball's lowest mass-quadrupole mode at 12.6 kHz, treated as
a single mode, at 300 K: by what fraction does the upper bound exceed the classical jitter $\kB T\chi_0$?

::: solution
For one mode the ratio of the upper bound to $\kB T\chi_0$ is $x\coth x$ with $x = \hbar\omega_0/2\kB T$. Here
$\omega_0 = 7.9\times10^4\unit{s^{-1}}$ and $x = 1.0\times10^{-9}$, so the excess is $x^2/3 = 3\times10^{-19}$.
:::
:::

::: paper
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV) gives [](/paper/#eq:thermal-multipole), the
  dipole's Brownian motion, the $5/3$ of the ball and shell and Figure [](/paper/#fig:tremor).
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) invokes the theorem
  [@CallenWelton1951] to turn [](/paper/#eq:thermal-moment) into [](/paper/#eq:sum-rule), and gives the Love number and
  the static jitter.
- [*A model-independent thermometer*](/paper/#par:a-model-independent-thermometer) builds [](/paper/#eq:thermometer),
  the shell drive and the reading of a body out of equilibrium.
- [*The trembling lattice*](/paper/#par:the-trembling-lattice) (Appendix A) gives the weights $c_n$ and
  [](/paper/#eq:jitter-bounds).
- [Section VI](/paper/#sec:thermal) uses the theorem for $\mathrm{Re}\,\eta(\omega)$, and
  [Section XIV](/paper/#sec:hole) applies the thermometer to a black hole, [](/paper/#eq:hole-thermometer).
:::

::: deeper
- The GR course's section
  [22.7](https://neovand.github.io/general-relativity/chapter-22.html#22-7-a-horizon-gets-a-temperature) explains where
  a horizon's temperature comes from.
- H. B. Callen and T. A. Welton, "Irreversibility and generalized noise", *Physical Review* 83, 34 (1951).
- Yu. Levin, "Internal thermal noise in the LIGO test masses: a direct approach", *Physical Review D* 57, 659 (1998).
- R. Kubo, "The fluctuation–dissipation theorem", *Reports on Progress in Physics* 29, 255 (1966), gives the general
  proofs.
:::

[^p]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:thermometer), with the sum rule [](/paper/#eq:sum-rule) derived from the theorem.

[^p2]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:thermal-multipole).

[^p3]: The lattices and Figure [](/paper/#fig:tremor) are those of the paper's Appendix A.

[^p4]: The paper's [](/paper/#eq:jitter-bounds), Appendix A.

[^p5]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIV, equation [](/paper/#eq:hole-thermometer); the temperature of the relic
    gravitons is its [](/paper/#eq:graviton-temperature).

[^yield]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VII, in the paragraph
    [*What a lens would add*](/paper/#par:what-a-lens-would-add), which also estimates a slab of steel some ten thousand kilometres thick.

[^letters]: Here $f$ is the strength of a push, not a frequency in hertz; $a$ is the radius of the thermometer's shell, not
    the semi-major axis of section 1.8; the surface gravity is $g_{\rm s}$, so that $g$ is always the second profile of
    4.2; and $k_2$ is a Love number, not a stiffness.

[^sides]: With a one-sided spectrum, $S_1(f) = 2S(\omega)$ in section 3.2, the theorem reads $S_1 = 4\kB T\,
    \mathrm{Im}\,\chi/\omega$, the form engineers quote.

[^dipole]: The addition theorem of section 2.2 at $\ell = 1$ gives $\sum_mY_{1m}^*(\hat y)Y_{1m}(\hat x) = (3/4\pi)\,\hat
    x\cdot\hat y$, so $\sum_m|\matter Q_{1m}|^2$, a double integral over the body, becomes $(3/4\pi)\,|\int\matter\rho\,
    \vect x\,\dd V|^2 = (3/4\pi)\matter M^2|\vect x_{\rm cm}|^2$.

[^filter]: Section 3.2 defined the spectrum by $\langle\tilde n(\omega)\,\tilde n^*(\omega')\rangle = 2\pi
    S(\omega)\,\delta(\omega - \omega')$. The factor $1/\matter m(\Gamma - i\omega)$ comes out once at $\omega$ and once
    conjugated at $\omega'$, and the delta function sets $\omega' = \omega$, so the divisor is $\matter m^2(\omega^2 +
    \Gamma^2)$.

[^sky]: The integral is unchanged when its indices are reordered or the axes are turned, so it is
    $\lambda(\delta_{ij}\delta_{kl} + \delta_{ik}\delta_{jl} + \delta_{il}\delta_{jk})$, the only such table of four
    indices. Set $k = l$ and sum: the left side becomes the
    [two-index integral](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes) of section 1.5,
    $\tfrac{4\pi}3\delta_{ij}$, and the right side $5\lambda\delta_{ij}$, so $\lambda = 4\pi/15$.

[^shell]: All the shell's mass lies at $r' = a$, and $\delta\matter\sigma$ has degree two only, so the interior expansion
    keeps $\ell = 2$, with coefficient $a^{-1}\oint\delta\matter\sigma\,Y_{2m}^*\,\dd\Omega$ times $-G(4\pi/5)\,
    r^2Y_{2m}(\hat x)$; the sum over $m$ rebuilds $\delta\matter\sigma(\hat x)$ (section 2.2). Putting in
    $\delta\matter\sigma$ gives $3Gf\,x_iD_{ij}x_j/a^5$, and its second derivatives give the tide.

[^one-mode]: For one mode $\chi_0 = c^2/\omega_0^2$ and $A = c^2$, so $A/\chi_0 = \omega_0^2$; with $x =
    \hbar\omega_0/2\kB T \ll 1$, $\coth x \approx 1/x$, and the upper bound becomes $\kB T\chi_0$.

[^thick]: With inner radius $\tfrac23R$ it has $\int\matter\rho r^2\,\dd V = \tfrac35\matter MR^2(1 -
    (2/3)^5)/(1 - (2/3)^3)$.

[^gravimeters]: Gravimeters on the ground measure $1 + h_2 - \tfrac32k_2$, where a second Love number $h_2$ says how far
    the ground rises.

[^unequal]: If each mode has its own temperature $T_n$, the noise is $\sum_n(2\kB T_n/\omega)\,\mathrm{Im}\,\chi_n$, with
    $\chi_n$ mode $n$'s term of $\chi_{yy}$, and the thermometer reads $\sum_nT_n\,\mathrm{Im}\,\chi_n/\sum_n\mathrm{Im}\,
    \chi_n$.

[^scale]: A moment scaled by $s$ has its conjugate push scaled by $1/s$, so that the energy is unchanged; its spectrum and
    response both scale as $s^2$.

[^three-q]: Three quadrupoles appear. The $\matter Q_{ij}$ of section 2.3 carries the Love number here; Newton's
    trace-free moment of section 4.5 is a third of it, and the trial shape and the static jitter use it; the black hole's
    quadrupole is half of Newton's moment, so a sixth of the first.

[^D]: Here $D$ is the thermometer's table, not the matrix $\mathbf M^{-1/2}\mathbf K\mathbf M^{-1/2}$ of section 4.3.
