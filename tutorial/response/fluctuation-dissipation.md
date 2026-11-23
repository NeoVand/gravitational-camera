---
id: '4.6'
title: 'Fluctuation and dissipation; Brownian motion; the Love number'
question: 'The paper says that the tremor of a warm body is the dissipative part of its response, and that in its thermometer every unknown about the body cancels. Why must a body that has friction also tremble, and by exactly how much?'
part: '4'
requires: ['1.5', '2.2', '2.3', '3.2', '4.2', '4.3', '4.5']
paper: [sec:near-field, eq:thermal-moment, eq:thermal-multipole, eq:sum-rule, eq:thermometer, fig:tremor, eq:jitter-bounds, app:benchmarks, sec:thermal, sec:hole, eq:hole-noise, eq:hole-thermometer, fig:hole-response]
figures: [fig:tremor]
live: []
depth: A
---

The paper's paragraph [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) begins with a claim
that ties heat to pushing: "By the fluctuation–dissipation theorem the tremor is the dissipative part of the body's
response." A few lines later, in [*A model-independent thermometer*](/paper/#par:a-model-independent-thermometer), it
divides one by the other and obtains a temperature,

{{paper eq:thermometer}}

in which, it says, "every unknown about the body, its modes, their shapes and how each shows at the pixel, cancels".

So we ask why a body that has friction must also tremble, and by exactly how much. The answer is one formula, the
fluctuation–dissipation theorem. With it the paper's two ways of reading a body's inside, watching its warm tremor and
pushing it with a tide, become one measurement, and a pixel becomes a thermometer.[^letters]

<!-- diagram: tut-fd-hero — Hero, in the stone pipeline (design/FIGURE_WORKFLOW.md), seen from the side, wide (16:9),
ball and distance to one scale. Left: 4.1's steel ball of radius 10 cm (the body of tut-osc-hero, the steel ball's
grey), drawn at one end of the swing of its lowest quadrupole mode, longer along the horizontal axis: 4.3's shape
u = (q/R)(−x/2, −y/2, z) with z along the axis and q = 2.2 × 10⁻¹⁶ m (the warm ball's root-mean-square swing)
exaggerated 10¹⁴ times to 2.2 cm, so the semi-axes are 12.2 cm along the axis and 8.9 cm across it; the ball at rest
as a thin dashed circle. Round the ball, a faint haze of about 300 small grey dots within 20 cm of its surface, the
warm air. Right, centred 1 m from the ball's centre on the same axis: chapter 1.4's ring of twelve small free balls,
radius 10 cm, in the plane of the page, drawn three times faintly overlaid as it trembles: stretched along the axis
(balls on an orange ellipse, 15% longer along the axis), at rest (on a thin dashed circle) and squeezed along the axis
(on a blue ellipse, 15% shorter). No hand, hammer or push arrow anywhere; no text in the panel. Caption: "Look first
at the ring: nothing pushes the ball, and still its tide a metre away trembles at the ball's note, because the ball is
warm. The ball's change of shape and the ring's are exaggerated; the ball and the distance are to scale; the air is
schematic." -->

::: plain
A grain of dust in water is pushed about at random by the water's molecules, and the same molecules slow it down when
it moves. The random push and the slowing come from one crowd of molecules, so they are linked. If the water slowed
the grain more, it would also have to push it harder, or the grain would not keep the energy that its temperature
requires.

The same is true of anything that rings, such as a steel ball. A body that turns some of a push into heat, at some
frequency, also trembles by itself at that frequency, and the size of the trembling is fixed: the temperature times the
friction at that frequency, divided by the frequency. A body with no friction at some frequency does not tremble there
at all.

So three things fix one another: how much a warm body trembles, how it answers a push, and its temperature. Measure
two and you know the third. A pixel that both watches a body and pushes it is therefore a thermometer, and it needs to
know nothing about the body.
:::

## A grain in water is kicked at random and slowed by friction, and the two are linked

We want to know what fixes the strength of the random kicks that a small particle in water receives, and how far
they carry it. Chapter 4.2 found the speed of this
[Brownian motion](/tutorial/response/temperature/#the-first-case-is-brownian-motion-and-the-next-ones-see-inside),
$\langle\dot x_{\rm cm}^2\rangle = \kB T/\matter M$ along each axis; now we follow it in time.

We model the particle, of mass $\matter m$, as feeling two forces from the water. When it moves at the velocity $v$
along one axis, the water drags it with the force $-\matter m\Gamma v$, where $\Gamma$ is a damping rate in
$\mathrm{s^{-1}}$, as for the cart of chapter
[4.1](/tutorial/response/oscillator/#friction-makes-the-swing-die-away-and-the-quality-factor-counts-how-slowly). The
molecules also strike it unevenly from moment to moment, which gives a **random force**
$\sym{thermal-force}{F_{\rm th}(t)}$, in newtons, with mean zero. Newton's law is then the **Langevin equation**,

$$\matter m\,\dot v = -\matter m\Gamma\,v + F_{\rm th}(t) . \label{eq:langevin}$$

We assume that **the kicks are white noise** in the sense of chapter
[3.2](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies): kicks at two
instants are uncorrelated, because each collision lasts about $10^{-13}$ s, far less than any time we watch. So the
force has a flat two-sided spectrum, a constant $\sym{force-spectrum}{S_F}$ in $\mathrm{N^2\,s}$. We assume also that
**the particle is in equilibrium with the water at the temperature $T$**.

We use 3.2's transforms, $\tilde v(\omega) = \int v(t)\,e^{i\omega t}\,\dd t$; here a tilde marks a transform, not a
phasor. A time derivative multiplies a transform by $-i\omega$, as it multiplied 4.1's phasors, so [](#eq:langevin)
becomes $-i\omega\matter m\tilde v = -\matter m\Gamma\tilde v + \tilde F_{\rm th}$, and $\tilde v = \tilde F_{\rm
th}/\matter m(\Gamma - i\omega)$. When one record's transform is another's times a factor, its spectrum is the
other's times the squared modulus of the factor.[^filter] So the spectrum of the velocity is

$$S_v(\omega) = \frac{S_F}{\matter m^2(\omega^2 + \Gamma^2)} .$$

Its integral over $\dd\omega/2\pi$ is the variance of the velocity, by 3.2's rule. Since $\int\dd\omega/(\omega^2 +
\Gamma^2) = \pi/\Gamma$, the variance is $S_F/2\matter m^2\Gamma$. Equipartition
([chapter 4.2](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share)) requires
it to be $\kB T/\matter m$, so

$$\boxed{\;S_F = 2\matter m\Gamma\,\kB T\;} . \label{eq:kick-strength}$$

The units agree: $\mathrm{kg\,s^{-1}} \times \mathrm{J} = \mathrm{N^2\,s}$. The kicks and the drag come from the same
molecules, and this result says that they cannot be chosen apart. A thicker liquid drags harder, so it must also kick
harder, or the particle would cool below the liquid's temperature. **A limit:** as $\Gamma \to 0$ the kicks vanish
too, and a particle that nothing slows is never warmed by its surroundings either.

**The wandering.** The spectrum $S_v$ is 3.2's [sluggish
noise](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies), with the variance
$\kB T/\matter m$ and the correlation time $1/\Gamma$. After a time $t$ the particle has moved by $x = t\,\bar v$, with
$\bar v$ the velocity averaged over that time. When $t \gg 1/\Gamma$, 3.2's
[square-root law](/tutorial/noise/random-signals/#the-variance-of-white-noise-falls-as-one-over-the-observing-time)
gives $\mathrm{Var}\,\bar v = S_v(0)/t$, and $S_v(0) = 2\kB T/\matter m\Gamma$. So $\langle x^2\rangle = t^2\,
S_v(0)/t$, and

$$\langle x^2\rangle = 2\,\frac{\kB T}{\matter m\Gamma}\,t \qquad\text{along each axis.}$$

The mean square distance grows in proportion to the time, not its square: this is **diffusion**, and the number $\kB
T/\matter m\Gamma$, in $\mathrm{m^2\,s^{-1}}$, is the **diffusion constant**. It depends on the friction $\matter
m\Gamma$ but not on the mass. This link between wandering and friction is the **Einstein relation**. For a sphere of
radius $R_{\rm b}$ moving slowly through a liquid of viscosity $\sym{viscosity}{\matter\eta}$ ([chapter
4.4](/tutorial/response/viscosity/#viscosity-is-a-stress-that-answers-how-fast-a-shape-changes)), the drag is
$6\pi\matter\eta R_{\rm b}v$, which is **Stokes's law** of 1851, stated here without proof. So $\matter m\Gamma =
6\pi\matter\eta R_{\rm b}$.

**A number.** A plastic bead of radius $0.5\unit{\mu m}$ and density $1050\unit{kg\,m^{-3}}$ in water ($\matter\eta =
1.0\times10^{-3}\unit{Pa\,s}$) at 293 K has $\matter m\Gamma = 9.4\times10^{-9}\unit{kg\,s^{-1}}$ and the diffusion
constant $4.3\times10^{-13}\unit{m^2\, s^{-1}}$. In one second it wanders $\sqrt{2 \times 4.3\times10^{-13}}\unit{m} =
0.93\unit{\mu m}$ along each axis, about its own diameter, and it does so although its speed along one axis is about
$3\unit{mm\,s^{-1}}$. Its velocity is forgotten after $1/\Gamma = 6\times10^{-8}\unit{s}$, so in a second it changes
direction about ten million times and gets almost nowhere.

<!-- diagram: tut-fd-grain — Two panels side by side (stack at 390 px). Left: one simulated Langevin path of the bead
(radius 0.5 µm, water at 293 K, diffusion constant 4.29 × 10⁻¹³ m² s⁻¹), projected on the x–y plane over 1 s and
sampled at 400 steps of 2.5 ms, each step a Gaussian displacement with standard deviation √(2 × 4.29 × 10⁻¹³ ×
2.5 × 10⁻³) m = 46 nm along each axis (fixed seed); the path as a thin dark polyline, an open dot at the start, a
filled dot at the end, the bead drawn to scale as a 1 µm disc at the end, and a scale bar of 1 µm. Right: the bead
enlarged (a disc 4 cm across on the page) in a crowd of about 60 small water molecules; five thin arrows into the
bead from molecules striking it, labelled once "kicks, F_th", and one thicker arrow pointing opposite to a velocity
arrow v, labelled "drag, −mΓv". Caption: "Look first at the scale bar: in one second the bead wanders about its own
diameter. The path is one simulated record; the molecules and arrows on the right are schematic." -->

::: history
### Einstein, Langevin and Perrin

Einstein predicted in 1905 that a particle in a liquid wanders with a mean square distance that grows in proportion to
the time, at a rate set by Boltzmann's constant, the temperature and Stokes's drag. Langevin wrote his equation
[](#eq:langevin) in 1908. Jean Perrin timed the wandering of beads of resin under a microscope and found from it
Avogadro's number, the number of molecules in a mole, and so the mass of a single atom (*Annales de Chimie et de
Physique* 18, 1909; Nobel Prize, 1926). His value, about $7\times10^{23}$, is some 15% above today's
$6.02\times10^{23}$.
:::

## An oscillator in a bath trembles by its friction over its frequency

We want the trembling of a warm oscillator at each frequency. We take 4.1's cart, of mass $\matter m$ on a spring of
stiffness $k$, and let its friction come from a bath, as for the grain. We assume that **the bath acts on the cart only
through the drag $-\matter m\Gamma\dot q$ and the kicks of [](#eq:kick-strength)**. The cart's law is 4.1's driven
oscillator with the random force as the push, so its transform is $\tilde q = \chi\,\tilde F_{\rm th}$, with 4.1's
[response function](/tutorial/response/oscillator/#a-steady-push-gets-a-steady-answer-the-response-function-times-the-push)
$\sym{response-function}{\chi}(\omega) = 1/\matter m(\omega_0^2 - \omega^2 - i\Gamma\omega)$. By the rule of the last
section the spectrum of $q$ is the spectrum of the force times $|\chi|^2$:

$$S_q(\omega) = |\chi(\omega)|^2\,S_F = 2\matter m\Gamma\,\kB T\,|\chi(\omega)|^2 .$$

Chapter 4.1 found that the dissipative part of the response is $\mathrm{Im}\,\chi = \matter m\Gamma\omega|\chi|^2$. We
replace $\matter m\Gamma|\chi|^2$ by $\mathrm{Im}\,\chi/\omega$:

$$\boxed{\;S_q(\omega) = \frac{2\kB T}{\omega}\,\mathrm{Im}\,\chi(\omega)\;} . \label{eq:fdt-one}$$

This is the **fluctuation–dissipation theorem** for one oscillator. The left side is a fluctuation, the trembling that
heat gives the cart with nothing pushing it. The right side is the dissipation, the part of its answer to a push that
4.1 showed [turns the work of the push into
heat](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push). Both sides are
in $\mathrm{m^2\,s}$: $\mathrm J/\mathrm s^{-1} \times \mathrm{m\,N^{-1}}$. The spectrum is two-sided, as in 3.2 and the
paper; a one-sided spectrum is twice as large.[^sides]

**Two checks**, for any friction. The variance is $\int S_q\,\dd\omega/2\pi = (2\kB T/\pi)\int_0^\infty\mathrm{Im}\,
\chi\,\dd\omega/\omega$, since the integrand is even. Chapter 4.5's
[sum at the slow end](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums) says
that $(2/\pi)\int_0^\infty\mathrm{Im}\,\chi\,\dd\omega/\omega = \chi(0) = 1/k$, so $\langle q^2\rangle = \kB T/k$,
4.2's equipartition. The velocity has the spectrum $\omega^2S_q$, and 4.5's sum at the fast end, with $A = 1/\matter
m$, gives $\langle\dot q^2\rangle = \kB T/\matter m$, equipartition again.[^numerics]

**A number.** At resonance $\mathrm{Im}\,\chi(\omega_0) = Q/k$, so for that cart with $Q = 10$ the spectrum peaks at
$2\kB TQ/k\omega_0 = 3.3\times10^{-22}\unit{m^2\,s}$, in a line $0.5\unit{s^{-1}}$ wide. The area under the line,
$\int S_q\,\dd\omega/2\pi$, is 4.2's static jitter $\kB T/k = 8.3\times10^{-23}\unit{m^2}$, the square of
$9.1\times10^{-12}\unit m$, about a sixth of the radius of a hydrogen atom.

So a body trembles, at each frequency, in proportion to its friction there, and where it has no friction it does not
tremble. More friction does not make the cart tremble more in all: the line becomes lower and wider by the same
factor, and its area stays fixed by equipartition.

<!-- diagram: tut-fd-lines — One panel, about 3:2. Horizontal axis ω/ω₀ from 0 to 2.5, linear, ticks every 0.5;
vertical axis S_q in units of 2k_BT/kω₀, logarithmic from 10⁻³ to 40, ticks at each power of ten. For Q = 3 (thin
line) and Q = 30 (thicker line), the exact curve S_q(ω) = 2k_BT·mΓ|χ|² with Γ = ω₀/Q, drawn solid; on each curve,
dots at ω/ω₀ = 0.05, 0.10, …, 2.50 giving 2k_BT Im χ/ω, which lie exactly on it. Labels "Q = 3" and "Q = 30" beside
the peaks, off the curves; a legend "S_q (line), 2k_BT Im χ/ω (dots)". Neutral ink; no colour roles. Caption: "Look
first at the dots: the trembling and the friction over the frequency coincide at every frequency and for both quality
factors. More friction lowers and widens the line; its area, k_BT/k, is the same. Curves exact." Place after the
paragraph that ends "its area stays fixed by equipartition". -->

## The theorem holds for every linear body, at every frequency

We want the theorem for a whole body, such as the steel ball, and for any quantity we read from it. Chapter
[4.3](/tutorial/response/elastic-bodies/#masses-on-springs-move-in-normal-modes) showed that a body of masses and
springs moves in normal modes, each an oscillator of unit mass with the mass-weighted amplitude $a_n$. We read a
quantity $y$ that the motion changes in proportion: $y = \sum_nc_na_n$, where $c_n$ is how far mode $n$ moves $y$ per
unit of its amplitude, 4.3's weight.

We assume that **each mode has its own friction $\Gamma_n$ and its own kicks**, independent of the other modes', as
4.3 assumed for the friction. Each mode is then the cart of the last section with $\matter m = 1$, and its amplitude
has the spectrum $(2\kB T/\omega)\,\mathrm{Im}[1/(\omega_n^2 - \omega^2 - i\Gamma_n\omega)]$. The modes are
uncorrelated, so the spectra of the terms of $y$ add, each multiplied by $c_n^2$. We also push the body with a force
$\sym{drive-amplitude}{f}$ that enters its energy as $-fy$, as a steady force $F$ on the cart entered as $-Fq$. This
push acts on mode $n$ with the force $-\partial(-fy)/\partial a_n = c_nf$, and so $y$ answers with 4.3's sum,

$$\sym{reading-response}{\chi_{yy}}(\omega) = \sum_n\frac{c_n^2}{\omega_n^2 - \omega^2 - i\Gamma_n\omega} .$$

The same $c_n^2$ weigh the modes in the noise and in the response. Adding the modes' spectra gives, for the reading,

$$\boxed{\;\sym{reading-spectrum}{S_{yy}}(\omega) = \frac{2\kB T}{\omega}\,\mathrm{Im}\,\chi_{yy}(\omega)\;} .
\label{eq:fdt}$$

This is the theorem in general, as the paper uses it. The push whose energy is $-fy$ is the **conjugate push** of $y$,
and the theorem pairs each reading with its own conjugate push.

::: gap
This sketch proves the theorem only for bodies whose friction damps each mode separately. It skips the following.

**Friction that couples the modes.** The theorem still holds, but this proof does not reach it. L. Onsager (1931)
assumed that a fluctuation that arises by chance dies away, on average, as the same displacement would if a push had
made it and let go; the classical theorem follows for any linear body in equilibrium. H. B. Callen and T. A. Welton
(1951) proved it in quantum mechanics [@CallenWelton1951], and R. Kubo's review (1966) gives both routes.

**Why the push must be conjugate.** A push that reached the modes with other weights $b_n$ would give the response
$\sum_nc_nb_n/(\omega_n^2 - \omega^2 - i\Gamma_n\omega)$, while the noise of $y$ still weighs the modes by $c_n^2$. Then
the ratio of noise to response would change from body to body, and no rule would link them.
:::

Two forms follow at once. **The static form**: integrate [](#eq:fdt) over $\dd\omega/2\pi$, fold the negative
frequencies onto the positive ones, and use 4.5's slow-end sum,
$\chi_{yy}(0) = (2/\pi)\int_0^\infty\mathrm{Im}\,\chi_{yy}\,\dd\omega/\omega$:

$$\boxed{\;\langle\delta y^2\rangle = \kB T\,\chi_{yy}(0)\;} , \label{eq:static-form}$$

where $\delta y$ is the departure of $y$ from its mean. This is the rule that chapter 4.2 found for the cart, its
[static jitter](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share), now for
any reading of any body. **The velocity form**: the spectrum of $\dot y$ is $\omega^2S_{yy}$, so

$$\boxed{\;\langle\dot y^2\rangle = \frac{2\kB T}{\pi}\int_0^\infty\omega\,\mathrm{Im}\,\chi_{yy}(\omega)\,\dd\omega\;}
. \label{eq:velocity-form}$$

**The limit where it fails.** The theorem is classical. In quantum mechanics the factor $2\kB T/\omega$ becomes
$\hbar\coth(\hbar\omega/2\kB T)$, stated here and derived in chapter 8.7. This is the classical factor times
$x\coth x$, where $x = \hbar\omega/2\kB T$ is the energy of one quantum over $2\kB T$. For $x \ll 1$, $x\coth x
\approx 1 + x^2/3$, and [](#eq:fdt) returns. For the steel ball's lowest mass-quadrupole mode, at 12.6 kHz by Lamb's
exact solution
([chapter 4.3](/tutorial/response/elastic-bodies/#a-guessed-shape-overestimates-the-lowest-note-and-a-good-guess-comes-close)),
$x = 1.0\times10^{-9}$ at 300 K, so the quantum correction is about $3\times10^{-19}$ (the paper problem below).

## The tremor and the applied tide are one fact

We want to see what the velocity form says about a moment of a body's mass, $\sym{mass-moment}{\matter Q_h} =
\int\matter\rho h\,\dd V$, with $h$ harmonic. Chapter 4.5
[pushed on it](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust) with a tide whose
potential is $-Fh$, so that the body's energy is $-F\matter Q_h$: the tide's strength $\sym{tide-strength}{F}$ is the
conjugate push of $\matter Q_h$, and the response is the paper's $\sym{tide-response}{\chi_h}$. Putting $y = \matter
Q_h$ into [](#eq:velocity-form) gives

$$\langle\matter{\dot Q}_h^2\rangle = \kB T\,\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi_h(\omega)\,\dd\omega .$$

Chapter
[4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)
found, from the law of the velocities alone, that two moments built from profiles $h$ and $g$ obey
$\langle\matter{\dot Q}_h\matter{\dot Q}_g\rangle = \kB T\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$, the paper's
equation [](/paper/#eq:thermal-moment). Here, as in 4.5, $g$ is a second profile. With $g = h$ the left side above is
$\kB T\int\matter\rho|\nabla h|^2\,\dd V$, and dividing both by $\kB T$ gives

$$\frac2\pi\int_0^\infty\omega\,\mathrm{Im}\,\chi_h(\omega)\,\dd\omega = \int\matter\rho\,|\nabla h|^2\,\dd V ,$$

which is the paper's sum rule:

{{paper eq:sum-rule}}

Chapter 4.5 reached the same equation from causality and the response of dust. Here it comes from heat:
equipartition fixes the trembling, and the theorem turns the trembling into the response. This is what the paper means
by "Eq. (thermal-moment) becomes the energy-weighted sum rule".

<!-- diagram: tut-fd-meeting — Three boxes in a triangle, thin strokes, about 3:2. Top box: "the sum rule
(2/π)∫₀^∞ ω Im χ_h dω = ∫ρ|∇h|² dV". Bottom-left box: "a warm body: ⟨Q̇_h²⟩ = k_BT ∫ρ|∇h|² dV (4.2,
equipartition)", with an arrow up to the top box labelled "fluctuation–dissipation theorem (4.6)". Bottom-right box:
"a pushed body: χ_h → −∫ρ|∇h|² dV/ω² far above its modes (4.5, dust)", with an arrow up to the top box labelled
"causality (4.5)". The left arrow orange, the right arrow blue (the two accent colours); boxes neutral. Caption: "Look
first at the two arrows: heat and causality reach the same total from opposite sides. Schematic." -->

So the tremor watched at a known temperature and the response to a known tide measure the same number, the inertia
$\int\matter\rho|\nabla h|^2\,\dd V$. The tremor needs the temperature to be known; the push works at any temperature,
even near absolute zero, where the tremor dies away.

## Each degree of the tremor holds one moment of the density

We want the tremor of each degree of the multipoles of [chapter
2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments), $\matter Q_{\ell m} =
\int\matter\rho\,r^\ell Y_{\ell m}^*\,\dd V$. Each is a moment $\matter Q_h$ with $h = r^\ell Y_{\ell m}^*$, which is
harmonic. These moments are complex, so we measure the size of a rate by $|\matter{\dot Q}_h|^2 = \matter{\dot
Q}_h\matter{\dot Q}_h^*$. The conjugate $\matter Q_h^*$ is the moment of $h^*$, so we take $g = h^*$ in 4.2's equation,
where $\nabla h\cdot\nabla h^* = |\nabla h|^2$, and sum over the $2\ell + 1$ orders $m$. The paper problem of chapter
[2.2](/tutorial/outside/spherical-harmonics/#the-addition-theorem-turns-a-sum-over-m-into-one-legendre-polynomial)
found, from the addition theorem, that $\sum_m|\nabla(r^\ell Y_{\ell m})|^2 = \ell(2\ell + 1)^2r^{2\ell-2}/4\pi$ at
every point. So

{{paper eq:thermal-multipole}}

At $\ell = 2$ the factor is $50/4\pi = 3.98$.[^checks]

**Degree one** has the factor $9/4\pi$ and the integral $\int\matter\rho\,\dd V$, the mass. Its moments hold the centre
of mass, $\sum_m|\matter Q_{1m}|^2 = (3/4\pi)\matter M^2|\vect x_{\rm cm}|^2$.[^dipole] So the paper's equation reads
$(3/4\pi)\matter M^2\langle|\dot{\vect x}_{\rm cm}|^2\rangle = (9/4\pi)\kB T\matter M$, and the tremor of the dipole is
the Brownian motion of the whole body, $\kB T/\matter M$ along each of the three axes, as in 4.2. For the steel ball its
root mean square is $1.1\times10^{-11}\unit{m\,s^{-1}}$.

**Degree two** gives $\int\matter\rho r^2\,\dd V$, the number that the static field cannot read ([chapter
2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)). A
uniform ball has $\tfrac35\matter MR^2$, and a thin shell of the same mass and radius has $\matter MR^2$, so their
quadrupoles tremble in the ratio $5/3$, "whatever their elastic constants and their friction". A shell whose thickness
is a third of its radius trembles 1.234 times as much as the ball.[^thick] **Degree three** gives $\int\matter\rho
r^4\,\dd V$, and so on. For a round body the whole sequence fixes the density at every radius, because a distribution on
a finite interval is fixed by all its moments ([chapter
3.9](/tutorial/noise/positivity/#a-positive-distribution-of-mass-is-fixed-by-a-few-of-its-moments)).

**Where the tremor lies.** The totals say nothing about frequency. The modes say where each total is spent, and we
read their weights off the mode shapes, as chapter 4.3 promised. We number the particles by $p$. A mode moves particle
$p$ by $a_n\vect e_{n,p}/\sqrt{\matter m_p}$, with $\vect e_{n,p}$ the three entries of the unit mode shape at that
particle. So, to first order, it changes $\matter Q_h = \sum_p\matter m_ph(\vect x_p)$ by $a_nc_n$, with

$$c_n = \sum_p\sqrt{\matter m_p}\,\nabla h(\vect x_p)\cdot\vect e_{n,p} .$$

Each mode holds $\langle\dot a_n^2\rangle = \kB T$ by equipartition, and the modes are independent, so
$\langle\matter{\dot Q}_h^2\rangle = \kB T\sum_nc_n^2$. Mode $n$ carries the share $c_n^2/\sum c^2$ of the tremor.

The squares of the $c_n$ add up for the reason that 4.3 gave for "the weights add up to $1/m_a$". Each $c_n$ is the
component, along the unit shape $\vect e_n$, of one list, the entries $\sqrt{\matter m_p}\,\partial_ih(\vect x_p)$.
The unit shapes are the columns of an orthogonal matrix, which keeps a list's length, so $\sum_nc_n^2 =
\sum_p\matter m_p|\nabla h(\vect x_p)|^2$, 4.2's integral once more. That is why Appendix A finds the sum equal to the
integral "to rounding error for any stiffnesses".

Figure [](/paper/#fig:tremor), below, adds up the $\kB Tc_n^2$ in order of frequency for Appendix A's lattice ball of
924 masses and its shell of 668, with $h = z^2 - \tfrac12(x^2 + y^2)$, the quadrupole along one axis of the lattice.
Each curve rises by one step for each mode. The totals stand in the ratio 1.220 of the lattices' $\sum_p\matter
m_pr_p^2$, close to the continuum's 1.234.

The ball keeps most of its tremor in one mode. Its strongest mode holds 85% of the tremor, and 99% lies below twice
that mode's frequency. The shell is softer, and its tremor lies lower. Its strongest mode holds 77% of its tremor and
lies 2.34 times lower in frequency than the ball's. Making every spring four times stiffer doubles every frequency and
leaves both totals unchanged. So the stiffness sets where the tremor lies, and the arrangement of the mass sets how
much there is.

{{paper fig:tremor}}

<!-- try: tremor — The live version of fig:tremor. Data: a precomputed table, built with Appendix A's lattice (sites of
the simple cubic lattice with |r| ≤ 6 spacings, less the centre; the shell keeps |r| > 4; 924 and 668 equal masses of
the same total; nearest-neighbour springs 1, next-nearest springs at the ratio r), of the frequencies ω_n and weights
c_n² of h = x·U·x with the paper's U = diag(−½, −½, 1)/√1.5, for both bodies at r = 0.25, 0.5 and 1 (modes whose
frequencies agree to 10⁻⁷ merged, their weights added). Opens at s = 1, r = 0.5, Q = 30. Controls: a stiffness slider
multiplying every spring by s from ¼ to 4 (frequencies scale as √s); the spring ratio r (three buttons); a friction
slider giving every mode the same Q, with Γ_n = ω_n/Q (from 3 to 300). Plot 1, the paper's figure: each body's
cumulative Σ c_n² in order of frequency, frequency in units of the ball's strongest mode at s = 1, r = 0.5 (ball blue,
shell orange), so stiffening moves the steps right. Plot 2: the spectrum of the quadrupole's rate,
Σ_n c_n² · 2Γ_nω² / [(ω_n² − ω²)² + Γ_n²ω²] (in units of k_BT), each line drawn with its width. Readouts: the two
totals and their ratio (1.220 at every setting), the ball's share in its strongest mode (0.806, 0.848, 0.873 at
r = 0.25, 0.5, 1), the ratio of the strongest modes' frequencies (2.62, 2.34, 2.22). A switch "static jitter" replaces
the totals by Σ c_n²/ω_n², which changes with the springs (shell/ball 7.1, 5.9, 5.4 at the three ratios; falls as
1/s). Predictions first: "Make every spring four times stiffer. What happens to the totals, and to the frequencies?"
(The totals stay; every frequency doubles.) Then "Lower Q to 3. Does the shell still tremble 1.22 times as much as the
ball?" (Yes: the lines broaden, their areas stay.) Keyboard: Tab to each control, arrows move it; both themes; at
390 px plot 2 sits below plot 1. -->

## The static end of the response is the Love number

We want a name for a body's answer to a steady tide, which astronomers measure for the Earth and the planets. A
tide $\curv{\tE}_{ij}$ that does not change in time gives the body a steady quadrupole. With 2.3's
[quadrupole tensor](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)
$\matter Q_{ij} = \int\matter\rho(3x_ix_j - r^2\delta_{ij})\,\dd V$, the one this section uses,[^three-q] a round
body of radius $R$ acquires

$$\matter Q_{ij} = -\frac{\sym{love-number}{k_2}\,R^5}{G}\,\curv{\tE}_{ij} , \label{eq:love}$$

and the pure number $k_2$ is the body's **Love number**. The paper writes the same rule for the trace-free second
moment, $\int\matter\rho(x_ix_j - \tfrac13r^2\delta_{ij})\,\dd V$, which is a third of $\matter Q_{ij}$: "a quadrupole
$\tfrac13k_2R^5/G$ times the applied tide". The minus sign makes a body yield toward a stretch, since a negative
$\curv{\tE}_{zz}$ stretches along $z$ and the body grows longer along $z$.

**Why this quantity.** The tide's potential near the body's centre is $\tfrac12\curv{\tE}_{ij}x_ix_j$ (chapter 2.3), and
the new quadrupole adds, outside the body, 2.3's potential $-\tfrac12G\matter Q_{ij}x_ix_j/r^5$. By [](#eq:love) this
is $\tfrac12k_2\curv{\tE}_{ij}x_ix_j\,R^5/r^5$, which at the surface is $k_2$ times the tide's own potential. So $k_2$
says how much a body adds to a tide by yielding to it, and it is the astronomers' static compliance, the slow end of
$\chi_h$. **How it is measured:** from the body's extra pull. The Earth's yielding to the Moon changes the orbits of
satellites, which give $k_2 \approx 0.30$.[^gravimeters] **An example:** a ball of fluid of uniform density
yields completely and has $k_2 = \tfrac32$. **A non-example:** the quadrupole of a body that rings, or its answer to a
tide that changes faster than its modes, is not its Love number; $k_2$ belongs to a steady tide only.

**Kelvin's ball** (stated, not derived). A uniform, incompressible, elastic ball of rigidity
$\sym{shear-modulus}{\matter\mu}$ and density $\matter\rho$, held together by its own gravity, has

$$k_2 = \frac{3/2}{1 + 19\matter\mu/2\matter\rho g_{\rm s}R} , \label{eq:kelvin}$$

where $\sym{surface-gravity}{g_{\rm s}} = G\matter M/R^2$ is the pull of gravity at its surface, in
$\mathrm{m\,s^{-2}}$ (Love, 1909 [@Love1909]; the paper writes $g$). It is plausible: gravity
resists a bulge with a stiffness about $\matter\rho g_{\rm s}R$, the rigidity adds $\matter\mu$, and the ball's
yielding falls as their sum grows. The ratio is a pure number, since $\matter\rho g_{\rm s}R$ is a pressure, like
$\matter\mu$. **Two checks:** with $\matter\mu = 0$ it gives the fluid's $\tfrac32$, and as $\matter\mu$ grows it falls
to zero, the Love number of a rigid body.

**Numbers.** The steel ball ($R = 0.10\unit m$, $\matter M = 32.9\unit{kg}$, $\matter\mu = 71\unit{GPa}$) has
$g_{\rm s} = 2.2\times10^{-7}\unit{m\,s^{-2}}$, 45 million times less than the Earth's. Its rigidity beats its gravity
by $19\matter\mu/2\matter\rho g_{\rm s}R = 3.9\times10^{15}$, so $k_2 = 3.8\times10^{-16}$, the paper's
$4\times10^{-16}$. The Earth, of radius 6371 km, mean density $5513\unit{kg\,m^{-3}}$ and $g_{\rm s} =
9.81\unit{m\,s^{-2}}$, would have its measured $k_2 = 0.30$ if it were a uniform ball of rigidity $\matter\mu =
8\matter\rho g_{\rm s}R/19 = 145\unit{GPa}$, about twice steel's.

::: history
### Kelvin weighs the rigidity of the Earth

In 1863 William Thomson, later Lord Kelvin, asked how much the solid Earth yields to the Moon and the Sun. The ocean's
tides are measured against the shore, so if the ground rose and fell with the water, the tides would look smaller than
the theory of a rigid Earth predicts. They do not look much smaller. From that alone, "with no other evidence than is
afforded by the tides", he concluded that "the tidal effective rigidity of the earth must be greater than that of
glass". He claimed no more than that: from the tides alone, he wrote, "we cannot infer that the earth is more
effectively rigid than steel" (W. Thomson, "On the rigidity of the earth", *Philosophical Transactions of the Royal
Society* 153, 573, 1863). A. E. H. Love introduced the numbers that measure the yielding in 1909, and T. Shida named
them Love numbers in 1912.
:::

**A check from the trial shape** (derivation). We want Appendix A's trial shape of 4.3 to give its own Love number. We
take an axial tide, $\curv{\tE} = \curv{\tE}_{zz}\,\mathrm{diag}(-\tfrac12, -\tfrac12, 1)$, and the shape's amplitude
$q$, in metres. Chapter 4.3 found that the shape changes the second moment $\int\matter\rho x_ix_j\,\dd V$ by
$\tfrac15\matter MRq\,\mathrm{diag}(-1, -1, 2)$, a change with no trace. The body's energy in the tide's potential is
$\int\matter\rho\,\tfrac12\curv{\tE}_{ij}x_ix_j\,\dd V$, which changes by $\tfrac12\curv{\tE}_{ij}$ times that change,
$\tfrac3{10}\matter MR\curv{\tE}_{zz}q$. With 4.3's stiffness $K = 3\matter\mu V/R^2$, the energy is

$$\tfrac12Kq^2 + \tfrac3{10}\matter MR\,\curv{\tE}_{zz}\,q ,$$

and it is least at $q = -\tfrac3{10}\matter MR\curv{\tE}_{zz}/K$. In 2.3's quadrupole, three times the trace-free
second moment, the shape gives $\matter Q_{zz} = 3 \times \tfrac25\matter MRq = \tfrac65\matter MRq$ (4.3). With
$\matter M = \matter\rho V$ and $G\matter M/R = g_{\rm s}R$, comparing with [](#eq:love) gives

$$\boxed{\;k_2 = \frac{3\matter\rho g_{\rm s}R}{25\matter\mu} = \frac{4\pi G\matter\rho^2R^2}{25\matter\mu}\;} .$$

For the steel ball this is $2.9\times10^{-16}$. Kelvin's formula, for $\matter\mu \gg \matter\rho g_{\rm s}R$, is
$3\matter\rho g_{\rm s}R/19\matter\mu$, so the trial shape gives $19/25 = 0.76$ of it. It must fall short. The true
shape is the one of least energy, so any guessed shape yields less: Rayleigh's rule of 4.3, now for a steady push.

**The static jitter.** We take the moment $\matter Q_h$ with $h = x_iU_{ij}x_j$, where $U$ is a fixed trace-free table
with $U_{ij}U_{ij} = 1$. Because $U$ has no trace, we may take the trace out of $x_ix_j$, as 2.3 did, so $\matter Q_h$
is $U_{ij}$ times the trace-free second moment: $\matter Q_h = U_{ij}\matter Q_{ij}/3$. The tide $-Fh$ is
$\tfrac12\curv{\tE}_{ij}x_ix_j$ with $\curv{\tE} = -2FU$, so [](#eq:love) gives $\matter Q_{ij} = 2k_2R^5FU_{ij}/G$,
and

$$\matter Q_h = \frac{2k_2R^5}{3G}\,U_{ij}U_{ij}\,F = \frac{2k_2R^5}{3G}\,F .$$

So the static compliance is $\chi_h(0) = 2k_2R^5/3G$, in $\mathrm{kg\,m^2\,s^2}$, the unit of $\matter Q_h$ per unit of
$F$. The static form [](#eq:static-form) then gives the paper's static jitter,

$$\langle\delta\matter Q_h^2\rangle = \kB T\,\chi_h(0) = \frac{2k_2R^5}{3G}\,\kB T .$$

For the steel ball with the trial shape's $k_2$, at 300 K, this is $(3.5\times10^{-16}\unit{kg\,m^2})^2$. For
$U = \mathrm{diag}(-\tfrac12, -\tfrac12, 1)/\sqrt{3/2}$ the shape changes $\matter Q_h$ by $U_{ij}$ times the change of
the second moment, $0.490\,\matter MRq$, so the poles swing by $q_{\rm rms} = 2.2\times10^{-16}\unit m$: the number
that 4.3 found from equipartition, reached now from the Love number. Kelvin's $k_2$ would make it
$2.5\times10^{-16}\unit m$.

**Stated: the quantum bounds.** When $\hbar\omega$ is not small, Appendix A bounds the jitter between the classical
value and that of a single mode at the root-mean-square frequency $\sqrt{A/\chi_0}$, with $\chi_0 = \chi_h(0)$ and
$\sym{response-sum}{A}$ the sum of 4.5's
[fast end](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums):

{{paper eq:jitter-bounds}}

Chapter 8.7 derives it. **A check:** for one mode with $\hbar\omega_0 \ll \kB T$ the two bounds meet at $\kB
T\chi_0$.[^one-mode]

## A push shaped like the reading makes a thermometer that needs no model of the body

We want the temperature of a body from what one pixel can do: read its tide and push it. Solving [](#eq:fdt) for $T$
gives the paper's thermometer at once:

$$\boxed{\;T = \frac{\omega\,S_{yy}(\omega)}{2\kB\,\mathrm{Im}\,\chi_{yy}(\omega)}\;} .$$

The modes, their frequencies, their frictions and the weights $c_n^2$ all enter $S_{yy}$ and $\mathrm{Im}\,\chi_{yy}$
in the same way, so they cancel, and the ratio is the same at every frequency. But the theorem holds only for a
reading and its conjugate push. The pixel reads $y = \sym{drive-table}{D}\!:\!\curv{\tE} = D_{ij}\curv{\tE}_{ij}$, the
contraction of
[chapter 1.5](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length) with
a fixed trace-free table $D$, a pure number for each entry, where $\curv{\tE}$ is the tide of the body at the pixel. So
we need a push whose energy is exactly $-f\,D\!:\!\curv{\tE}$, whatever the body: Levin's idea, invented for the
mirrors of LIGO [@Levin1998].[^D]

**The paper's push.** Put round the pixel a thin spherical shell of radius $a$, in metres, and shift mass about on it,
so that its surface density $\sym{surface-density}{\matter\sigma}$ changes by

$$\delta\matter\sigma(\hat n) = -\frac{15f}{4\pi a^4}\,\hat n\cdot D\cdot\hat n ,$$

where $\hat n$ points from the pixel to a point of the shell and $f$ is the push's strength, in $\mathrm{kg\,m^2}$, so
that $\delta\matter\sigma$ is in $\mathrm{kg\,m^{-2}}$. We assume that **all the other matter lies outside the shell**.

**Its energy in the field of that matter.** Inside the shell, 2.3's [interior
expansion](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics) writes the
potential of the outside matter as a sum of growing harmonics: a constant, a uniform pull, the tide's
$\tfrac12\curv{\tE}_{ij}x_ix_j$, and terms of degree three and more. The table $D$ is trace-free, so $\hat n\cdot
D\cdot\hat n$ is a pattern of degree two, and by the orthogonality of the patterns
([chapter 2.2](/tutorial/outside/spherical-harmonics/#patterns-of-different-degree-are-orthogonal-and-every-pattern-is-a-sum-of-them))
only the tide's term survives in $\int\delta\matter\sigma\,\field\Phi\,\dd A$. With $x = a\hat n$ and $\dd A =
a^2\,\dd\Omega$,

$$\int\delta\matter\sigma\,\field\Phi\,\dd A = -\frac{15f}{8\pi}\,D_{kl}\,\curv{\tE}_{ij}\oint\hat n_i\hat n_j\hat
n_k\hat n_l\,\dd\Omega .$$

The integral of four $\hat n$'s over the sky is $\tfrac{4\pi}{15}(\delta_{ij}\delta_{kl} + \delta_{ik}\delta_{jl} +
\delta_{il}\delta_{jk})$.[^sky] The first term multiplies the trace of $\curv{\tE}$ and the trace of $D$, both
zero, and the other two each give $D\!:\!\curv{\tE}$, so

$$\boxed{\;\int\delta\matter\sigma\,\field\Phi\,\dd A = -f\,D\!:\!\curv{\tE}\;} , \label{eq:drive}$$

exactly, for any matter outside the shell.[^checks2] The units agree: $\mathrm{kg\,m^2}\times\mathrm{s^{-2}}$ is a
joule. The drive has no degree zero or one, as Appendix A says: it adds no mass, makes no uniform pull at the pixel
and feels no net force from the uniform part of the outside field. Outside bodies do feel its quadrupole, which is the
push.

So the push enters the energy as $-fy$ with $y = D\!:\!\curv{\tE}$, the pixel's own reading, and the theorem applies to
the pair.

**The shell's own field.** The pixel reads the whole tide at its place, so its reading holds the shell's own tide as
well as the body's. The pixel lies inside the shell, and 2.3's interior expansion, of which only degree two
survives, gives[^shell]

$$\begin{aligned}
\field\Phi_{\rm shell} &= -\frac{4\pi G}{5a}\,r^2\,\delta\matter\sigma(\hat x) = \frac{3Gf}{a^5}\,x_iD_{ij}x_j ,\\
\curv{\tE}_{ij}^{\rm shell} &= \frac{6GfD_{ij}}{a^5} .
\end{aligned}$$

This tide follows $f$ with no delay, in phase with it. So it adds the real constant $6G\,D\!:\!D/a^5$ to
$\chi_{yy}$: it adds to $\mathrm{Re}\,\chi_{yy}$ and nothing to $\mathrm{Im}\,\chi_{yy}$, which is all the thermometer
uses. A body whose modes are at different temperatures reads as "an average of its temperatures, weighted by
where it dissipates".[^unequal]

<!-- diagram: tut-fd-thermometer — A section through the shell in the x–z plane, z up, about 4:3. At the centre, the
pixel as a small ring of twelve free balls (chapter 1.4's ring, 1/10 of the shell's radius). The shell as a circle of
radius a, its stroke coloured by δσ ∝ −n̂·D·n̂ for D = diag(−½, −½, 1), which in this section is −(cos²ϑ − ½sin²ϑ)
with ϑ the angle from z: orange where mass is added (around the equator, ϑ = 90°, value +½), blue where it is removed
(at the poles, value −1), neutral at the two zeros cos²ϑ = 1/3 (ϑ = 54.7° and its mirror images), strength as line
weight from 0.5 to 3 px. A body (a disc in the steel ball's grey, radius 0.3a) outside the shell at the right, its
centre at 2a on the x axis. Two labelled arrows, off the geometry: from the shell to the body "push: energy −f D:E";
from the body to the pixel "reading: y = D:E". A small inset at the lower right: one resonance line drawn twice, S_yy
(solid) and 2k_BT Im χ_yy/ω (dots on it), with the label "ratio → T". Caption: "Look first at the colours on the
shell: mass is moved to make a pattern of degree two, which pushes on exactly what the pixel reads. Pattern exact;
sizes and the inset schematic." -->

**Read now.** A black hole answers a slow tide with pure friction, $\mathrm{Im}\,\chi = \nu\omega$ (the paper's
[](/paper/#eq:horizon-friction), chapter 11.4), and its quadrupole trembles with the flat spectrum $S_Q$ of the paper's
[](/paper/#eq:hole-noise). Both belong to the paper's Section XIV quadrupole, a sixth of 2.3's $\matter Q_{ij}$, and the
factor cancels in $T$.[^scale] The thermometer gives $T = \omega S_Q/2\kB\nu\omega = S_Q/2\kB\nu$:

{{paper eq:hole-thermometer}}

the Hawking temperature. With the paper's $S_Q = \hbar r_s^5/360\pi G$ and $\nu = \matter Mr_s^5/90c^3$, the ratio
$S_Q/\nu$ is $\hbar c^3/4\pi G\matter M$, as the equation says. The paper's hole of $1.36\times10^{23}\unit{kg}$, about
twice the Moon's mass, is at 0.902 K. To the three figures of its mass, that is the 0.905 K that the paper's
[](/paper/#eq:graviton-temperature) predicts for gravitons left from the early universe: the hole is as warm as the sky
round it. Chapter
[4.5](/tutorial/response/causality/#a-blow-holds-every-frequency-and-the-energy-it-leaves-is-the-same-total) showed its
response, Figure [](/paper/#fig:hole-response), and chapter 13.7 reads this paragraph.

::: check
### Q

Why must the random force on a Brownian particle grow with its friction?

### A

Equipartition fixes the particle's mean energy of motion at $\tfrac12\kB T$ along each axis. More friction removes
that energy faster, so the kicks must supply it faster: $S_F = 2\matter m\Gamma\kB T$.

### Q

A body has no friction at 1 MHz. Does its reading tremble at 1 MHz?

### A

No. By [](#eq:fdt), $S_{yy} = 2\kB T\,\mathrm{Im}\,\chi_{yy}/\omega$ vanishes where $\mathrm{Im}\,\chi_{yy}$ does.

### Q

How many times more does a thin shell's quadrupole tremble, in mean square rate, than that of a uniform ball of the
same mass and radius at the same temperature?

### A

$5/3$, the ratio of their $\int\matter\rho r^2\,\dd V$, $\matter MR^2$ against $\tfrac35\matter MR^2$, whatever their
springs and friction.

### Q

Why must the thermometer's push couple to exactly the pixel's reading?

### A

The theorem links a reading only to its conjugate push. With any other push the modes would be weighed differently in
the noise and in the response, and the body's unknowns would not cancel.
:::

**The idea to keep: friction and trembling are two faces of one coupling to the heat bath, so a reading trembles at each
frequency by $2\kB T$ times its friction there over the frequency. A warm body's tremor, its response to a push and its
temperature therefore fix one another; the tremor of each degree holds one moment of the density,
$\int\matter\rho\,r^{2\ell-2}\,\dd V$, whatever the springs; and a push shaped like the reading turns the pixel into a
thermometer that needs no model of the body.**

::: problems
### Practice

How far does a bead of radius 1 µm wander along one axis in one minute, in water at 293 K?

::: solution
Its diffusion constant is $\kB T/6\pi\matter\eta R_{\rm b} = 4.05\times10^{-21}/(6\pi \times 10^{-3} \times
10^{-6})\unit{m^2\,s^{-1}} = 2.1\times10^{-13}\unit{m^2\,s^{-1}}$, so in 60 s it wanders $\sqrt{2 \times
2.1\times10^{-13} \times 60}\unit m = 5.1\unit{\mu m}$, five times its radius. A bead twice as large wanders $\sqrt2$
times less.
:::

### Stretch

Combine this chapter with chapter 4.1's
[two coupled carts](/tutorial/response/oscillator/#a-body-with-many-modes-answers-as-a-sum-of-oscillators) and 4.5's
[two sums](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums). In a bath at
300 K, with the same friction on each cart, find the mean square displacement and the mean square velocity of the first
cart without integrating any spectrum.

::: solution
The first cart's coordinate is a reading whose conjugate push is a force on that cart, so the theorem applies to
$\chi_{11}$. The static form gives $\langle q_1^2\rangle = \kB T\chi_{11}(0) = 4.14\times10^{-21} \times
0.0133\unit{m^2} = 5.5\times10^{-23}\unit{m^2}$, a root mean square of $7.4\times10^{-12}\unit m$. The velocity form and
4.5's fast-end sum, $A = 1/\matter m$, give $\langle\dot q_1^2\rangle = \kB T/\matter m = 2.1\times10^{-21}\unit{m^2\,
s^{-2}}$, which is equipartition for one cart, as it must be.
:::

### The paper

Check the paper's [](/paper/#eq:jitter-bounds) for the steel ball's lowest mass-quadrupole mode at 12.6 kHz, treated
as a single mode, at 300 K: by what fraction does the upper bound exceed the classical jitter $\kB T\chi_0$?

::: solution
For one mode $\sqrt{A/\chi_0} = \omega_0$ and $\sqrt{A\chi_0} = c^2/\omega_0$, so the ratio of the upper bound to
$\kB T\chi_0$ is $x\coth x$ with $x = \hbar\omega_0/2\kB T$. Here $\omega_0 = 7.9\times10^4\unit{s^{-1}}$ and $x =
1.0\times10^{-9}$. Since $x\coth x \approx 1 + x^2/3$, the excess is $3\times10^{-19}$: the jitter of the ball is
classical to that precision.
:::
:::

::: paper
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV) gives [](/paper/#eq:thermal-multipole), the
  dipole's Brownian motion, the $5/3$ of the ball and shell and Figure [](/paper/#fig:tremor), read here from the
  modes.
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) invokes the theorem
  [@CallenWelton1951] to turn [](/paper/#eq:thermal-moment) into [](/paper/#eq:sum-rule), and gives the Love number,
  Kelvin's $k_2$, the steel ball's $4\times10^{-16}$ and the static jitter.
- [*A model-independent thermometer*](/paper/#par:a-model-independent-thermometer) builds [](/paper/#eq:thermometer),
  the shell drive, its $6GfD/a^5$ and the reading of a body out of equilibrium.
- [*The trembling lattice*](/paper/#par:the-trembling-lattice) (Appendix A) gives the weights $c_n$, the sums
  $\kB T\sum c_n^2$ and $\kB T\sum c_n^2/\omega_n^2$, and [](/paper/#eq:jitter-bounds).
- [Section VI](/paper/#sec:thermal) uses the theorem in the form "$\mathrm{Re}\,\eta(\omega)$ is the spectrum of the
  material's stress" (Part 10), and [Section XIV](/paper/#sec:hole) applies the thermometer to a black hole,
  [](/paper/#eq:hole-thermometer) (chapter 13.7).
:::

::: deeper
- The GR course's section
  [22.7](https://neovand.github.io/general-relativity/chapter-22.html#22-7-a-horizon-gets-a-temperature) and its lesson
  [*Temperature and quantum input*](https://neovand.github.io/general-relativity/chapter-22.html#temperature-and-quantum-input)
  explain where a horizon's temperature comes from, the other half of this chapter's last paragraph.
- H. B. Callen and T. A. Welton, "Irreversibility and generalized noise", *Physical Review* 83, 34 (1951), prove the
  theorem for any linear system, with its quantum form.
- Yu. Levin, "Internal thermal noise in the LIGO test masses: a direct approach", *Physical Review D* 57, 659 (1998),
  invents the push shaped like the reading, for LIGO's mirrors.
- R. Kubo, "The fluctuation–dissipation theorem", *Reports on Progress in Physics* 29, 255 (1966), gives the general
  proofs that this chapter's gap box names.
:::

[^letters]: Some letters return with new meanings. Here $f$ is the strength of a push, not a frequency in hertz.
    $R_{\rm b}$ is a bead's radius, and $a$ is the radius of the thermometer's shell, not chapter 1.8's semi-major
    axis; $a_n$ is a mode's amplitude, as in 4.3, and the particles are numbered by $p$. The surface gravity is
    $g_{\rm s}$, so that $g$ is always 4.2's second profile; 1.2's field is the bold $\vect g$. And $k_2$ is a Love
    number, not a stiffness $k$ or a wavenumber. The diffusion constant is written out and gets no letter.

[^sides]: Chapter 3.2 [warned](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies)
    that $S_1(f) = 2S(\omega)$. With a one-sided spectrum the theorem reads $S_1 = 4\kB T\,\mathrm{Im}\,\chi/\omega$,
    the form engineers quote.

[^numerics]: Numerical integrals of the spectrum for the cart of 4.1 ($\matter m = 2\unit{kg}$, $k =
    50\unit{N\,m^{-1}}$) at 300 K give both checks to six figures for $Q$ from 0.3 to 1000.

[^dipole]: The addition theorem of 2.2 at $\ell = 1$, where $P_1(\cos\gamma) = \cos\gamma$, gives
    $\sum_mY_{1m}^*(\hat y)Y_{1m}(\hat x) = (3/4\pi)\,\hat x\cdot\hat y$. Each $\matter Q_{1m}$ is $\int\matter\rho\,
    rY_{1m}^*\,\dd V$, so $\sum_m|\matter Q_{1m}|^2$ is a double integral over the body that holds this sum, and it
    becomes $(3/4\pi)\,|\int\matter\rho\,\vect x\,\dd V|^2 = (3/4\pi)\matter M^2|\vect x_{\rm cm}|^2$.

[^filter]: Chapter 3.2 defined the spectrum by $\langle\tilde n(\omega)\,\tilde n^*(\omega')\rangle = 2\pi
    S(\omega)\,\delta(\omega - \omega')$. Put in $\tilde v = \tilde F_{\rm th}/\matter m(\Gamma - i\omega)$. The factor
    comes out once at $\omega$ and once conjugated at $\omega'$, so $\langle\tilde v\tilde v'^*\rangle$ is
    $\langle\tilde F_{\rm th}\tilde F_{\rm th}'^*\rangle = 2\pi S_F\,\delta(\omega - \omega')$ divided by
    $\matter m^2(\Gamma - i\omega)(\Gamma + i\omega')$. The delta function lets us set $\omega' = \omega$, and the
    divisor becomes $\matter m^2(\omega^2 + \Gamma^2)$. The same steps work for any factor.

[^sky]: The integral is unchanged when its indices are reordered or the axes are turned, so it is
    $\lambda(\delta_{ij}\delta_{kl} + \delta_{ik}\delta_{jl} + \delta_{il}\delta_{jk})$, the only such table of four
    indices. Set $k = l$ and sum: the left side becomes 1.5's
    [two-index integral](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes),
    $\tfrac{4\pi}3\delta_{ij}$, and the right side $5\lambda\delta_{ij}$, so $\lambda = 4\pi/15$. A check: the sky
    average of $\hat n_z^4$ is $3/15 = \tfrac15$, and so is $\int_{-1}^1u^4\,\dd u/2$.

[^shell]: All the shell's mass lies at $r' = a$, where $\dd V$ becomes $a^2\,\dd\Omega$, and $\delta\matter\sigma$ has
    degree two only. So the interior expansion keeps $\ell = 2$, with the coefficient $\int\delta\matter\sigma\,
    Y_{2m}^*a^{-3}\,\dd A = a^{-1}\oint\delta\matter\sigma\,Y_{2m}^*\,\dd\Omega$. It multiplies each coefficient by
    $-G(4\pi/5)\,r^2Y_{2m}(\hat x)$, its $4\pi/(2\ell + 1)$ at $\ell = 2$, and sums over $m$; by 2.2's expansion of a
    pattern in its harmonics, that sum rebuilds $\delta\matter\sigma(\hat x)$. Putting in $\delta\matter\sigma$ gives
    $3Gf\,x_iD_{ij}x_j/a^5$, and its second derivatives give the tide.

[^one-mode]: For one mode, $\chi_h = c^2/(\omega_0^2 - \omega^2 - i\Gamma\omega)$ gives $\chi_0 = c^2/\omega_0^2$ and
    $A = c^2$, so $A/\chi_0 = \omega_0^2$. With $x = \hbar\omega_0/2\kB T \ll 1$, $\coth x \approx 1/x$, and the upper
    bound becomes $\tfrac12\hbar(c^2/\omega_0)(2\kB T/\hbar\omega_0) = \kB T\chi_0$, the lower one.

[^thick]: With its inner radius at $\tfrac23R$ it has $\int\matter\rho r^2\,\dd V = \tfrac35\matter MR^2(1 -
    (2/3)^5)/(1 - (2/3)^3)$, which is 1.234 times the ball's $\tfrac35\matter MR^2$.

[^gravimeters]: Gravimeters on the ground measure the combination $1 + h_2 - \tfrac32k_2$, where a second Love number,
    $h_2$, says how far the ground itself rises.

[^unequal]: If each mode has its own temperature $T_n$, the noise is $\sum_n(2\kB T_n/\omega)\,\mathrm{Im}\,\chi_n$, with
    $\chi_n$ mode $n$'s term of $\chi_{yy}$, and the thermometer reads $\sum_nT_n\,\mathrm{Im}\,\chi_n/\sum_n\mathrm{Im}\,
    \chi_n$.

[^checks]: Numerical gradients of the five harmonics at a random point give the same factor to ten figures.

[^checks2]: A quadrature of the shell against a dozen random point masses agrees to twelve figures, and a numerical
    second derivative of the shell's potential, below, gives the same tide $6GfD/a^5$.

[^scale]: A moment scaled by a number $s$ has its conjugate push scaled by $1/s$, so that their product, the energy,
    is unchanged. Its spectrum and its response both scale as $s^2$, and their ratio does not change.

[^three-q]: Three quadrupoles appear in these chapters, and each passage uses one. Chapter 2.3's $\matter Q_{ij} =
    \int\matter\rho(3x_ix_j - r^2\delta_{ij})\,\dd V$ carries the Love number here. The trace-free second moment
    $\int\matter\rho(x_ix_j - \tfrac13r^2\delta_{ij})\,\dd V$, which 4.5 calls Newton's moment, is a third of it; the
    paper's Love rule in Section IV, 4.3's trial shape and the static jitter below use it. The paper's Section XIV
    $\matter Q_{ij}$, in 4.5's black-hole paragraph and this chapter's last, is half of Newton's moment, so a sixth of
    2.3's.

[^D]: Here $D$ is the thermometer's table, as in the paper. It is not 4.3's matrix $\mathbf M^{-1/2}\mathbf K\mathbf
    M^{-1/2}$, 3.3's separation in units of the noise, or a camera's width in chapter 2.3.
