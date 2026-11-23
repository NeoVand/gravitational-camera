---
id: '4.2'
title: 'Temperature, the Boltzmann distribution and equipartition'
question: 'The paper says that in a warm body every velocity follows one law, whatever forces hold the body together. Why can heat say something so exact about a body whose forces we do not know, and what does it then say about the body''s pull?'
part: '4'
requires: ['1.6', '1.7', '2.1', '3.1', '4.1']
paper: [sec:near-field, eq:thermal-moment, eq:thermal-multipole, eq:sum-rule, eq:jitter-bounds, app:benchmarks, sec:second-order, eq:hair-commutator, eq:dust, sec:thermal]
figures: []
live: [equipartition]
depth: A
---

The paper's paragraph [*What heat reveals*](/paper/#par:what-heat-reveals) opens with "Every warm body trembles, and
its trembling has a near field." Its next sentence is a strong claim. In classical thermal equilibrium, it says, "the
velocities of the particles of a body are independent of their positions and of one another, with
$\langle v_a^2\rangle = 3k_BT/m_a$, whatever forces hold the body together." From this the paper draws, "at once", its
equation [](/paper/#eq:thermal-moment) for the mean square rate of change of the moments of a body's mass: sums of
its particles' masses, each weighted by a function of the particle's place.

So we ask why heat can say something so exact about a body whose forces we do not know, and what it then says about
the body's pull. In short, the chance of each state of a warm body falls exponentially with its energy, and in that
law the velocities separate from the positions, which hold all the forces. The paper's equation then follows in a few
lines, as chapter [1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside) promised.

::: plain
Temperature measures how heat is shared. Two bodies that touch pass energy back and forth until their temperatures
are equal, and then the exchange stops on average. Boltzmann's constant times the temperature is an energy, about
$4\times10^{-21}$ joules at room temperature.

In a warm body, a state of higher energy is less likely: each extra amount of that energy makes a state 2.7 times less
likely. A body's energy is the energy of motion of its atoms, which depends only on their velocities, plus the
energy stored in its forces, which depends only on their positions. So the velocities follow their own law, whatever
the forces are. Each is a random number with a bell-shaped spread, independent of all the others, and the spread
depends only on the temperature and the atom's mass.

So the way a warm body's mass is spread out changes at random. Square its rate of change and average it over time: this
mean square rate of change depends only on the temperature and on where the mass lies. It holds numbers, such as how far
the mass lies from the centre, that the steady pull outside cannot show.
:::

## Temperature is what bodies in contact come to share

Put a hot steel ball into a bucket of cold water. Energy flows from the ball to the water as heat, the ball cools and
the water warms, and after a while the flow stops. The two are then in **thermal equilibrium**: their atoms still
trade energy, but on average as much flows each way. What is then equal in the two bodies, whatever they are made of,
is their **temperature**. That is also how it is measured: a thermometer placed against a body comes to the body's
temperature and shows its own. Here $\sym{temperature}{T}$ is the temperature, measured in kelvin from absolute zero;
room temperature is about $300\unit{K}$.[^T]

Boltzmann's constant $\sym{boltzmann}{\kB} = 1.380649\times10^{-23}\unit{J\,K^{-1}}$ (chapter
[0.6](/tutorial/evening/how-to-read/#every-number-says-what-it-measures-in-what-unit-and-against-what)), exact by
definition since 2019, turns a temperature into an energy. The product $\kB T$ sets the share of energy that heat gives
to each part of a body's motion: $\tfrac12\kB T$ to each term of the energy that is a square, such as
$\tfrac12\matter mv_x^2$, and so $\kB T$ to each way in which a body can vibrate, as
[the section on equipartition](#heat-gives-every-quadratic-term-in-the-energy-the-same-share) shows. At 300 K,

$$\kB T = 1.381\times10^{-23} \times 300\unit{J} = 4.14\times10^{-21}\unit{J} = 0.0259\unit{eV},$$

about a fortieth of an electronvolt. A chemical bond takes a few electronvolts to break, a hundred times more, which is
why things at room temperature do not fall apart.

**A non-example.** A temperature is not an amount of heat. A bathtub of warm water and a cup of the same water have the
same temperature and the same $\kB T$, but the bathtub holds a thousand times more heat, because it holds a thousand
times more water.

## The chance of a state falls exponentially with its energy

We want the probability of each state of a small system that trades energy with a large one. The small system may be
one molecule of a gas, one cart on its spring, or a whole steel ball resting in a room. The large one, everything it
touches, is the **heat bath**. A state is, as in
[chapter 1.7](/tutorial/newton/hamilton/#a-state-is-a-position-and-a-momentum), a point of phase space: every position
and every momentum.

We make one assumption, the founding assumption of statistical physics: **every state of the combined system with the
same total energy is equally likely**. It is stated here, not proved; the box below says what supports it. The total
energy $E_{\rm tot}$ is fixed. When the small system is in a particular state of energy $E$, the bath has the energy
$E_{\rm tot} - E$ and may be in any of its states with that energy. We write $\sym{state-count}{\Omega}(E)$ for the
number of the bath's states with the energy $E$, a pure number.[^Omega] Since every combined state is equally likely,
the probability $p$ of the small system's state is proportional to the number of ways in which the bath can go with it:

$$p \propto \Omega(E_{\rm tot} - E) .$$

The count $\Omega$ grows enormously fast with the energy, so we work with its logarithm, which changes smoothly. The
small system holds a tiny fraction of the energy, so we expand to first order in $E$ (Figure [](#fig:bath)):

$$\ln\Omega(E_{\rm tot} - E) = \ln\Omega(E_{\rm tot}) - E\,\frac{\dd\ln\Omega}{\dd E} + \dots$$

The derivative is an inverse energy. We name it

$$\frac{1}{\kB T} = \frac{\dd\ln\Omega}{\dd E} . \label{eq:beta}$$

The box below shows that this slope is equal in two bodies in equilibrium, so it measures the temperature that
[bodies in contact come to share](#temperature-is-what-bodies-in-contact-come-to-share); we write it as $1/\kB T$ so
that $\kB T$ is an energy. We take the exponential of both sides of the expansion. The first term becomes a constant
factor, which the condition that the probabilities add up to one fixes, and

$$\boxed{\;p \propto e^{-E/\kB T}\;} .$$

This is the **Boltzmann distribution**, also called the **canonical distribution**, and $e^{-E/\kB T}$ is the
**Boltzmann factor**. A state with $\kB T$ more energy than another is $e = 2.7$ times less likely, and one with
$10\,\kB T$ more is $e^{10} = 22{,}000$ times less likely. Two limits check it. As $T \to 0$ only the states of the
lowest energy remain, and as $T \to \infty$ every state becomes equally likely.

![Look first at the inset, where the logarithm of the bath's count of states is a straight line of slope $1/\kB T$
over the small system's range, so giving the small system (left) the energy $E$ lowers $\ln\Omega$ by $E/\kB T$.
Below the inset, on the same scale of energy, the resulting $e^{-E/\kB T}$ falls by a factor $e$ for each $\kB T$. The
shape of the large curve is schematic; the inset and the exponential are exact.](tut-temp-bath){#fig:bath}

::: gap
This sketch skips the following.

**Counting states.** A classical state is a point, so the number of states means the volume of phase space within a
narrow range of energy, cut into cells of $2\pi\hbar$ for each coordinate and its momentum (chapter 8.3). Only the
slope of $\ln\Omega$ enters, so the size of the cell drops out.

**Why $\ln\Omega$ is nearly a straight line.** For a gas of $N$ atoms that do not pull on one another, the momenta with
energy below $E$ fill a ball of radius $\sqrt{2mE}$ in $3N$ dimensions, whose volume grows as $E^{3N/2}$, so
$\ln\Omega \approx \tfrac32N\ln E$. Then equation [](#eq:beta) gives $\kB T = 2E/3N$, so each atom holds
$E/N = \tfrac32\kB T$, as [the section on equipartition](#heat-gives-every-quadratic-term-in-the-energy-the-same-share)
finds. Over the small system's range the slope changes only by the fraction $E/E_{\rm tot}$ of itself.

**Why the slope is the temperature.** When two bodies share a fixed energy, the number of joint states with the first
holding $E_1$ is $\Omega_1(E_1)\,\Omega_2(E_{\rm tot} - E_1)$. For large bodies this product has an extremely sharp
peak, where $\dd\ln\Omega_1/\dd E_1 = \dd\ln\Omega_2/\dd E_2$. Energy moves toward the body with the larger slope,
because that raises the joint count, so the larger slope belongs to the colder body. With $S = \kB\ln\Omega$, the
body's **entropy** ($\kB\ln2$ times the entropy in bits, $\log_2\Omega$, of
[chapter 3.8](/tutorial/noise/bits/#a-bit-is-the-answer-to-one-yes-or-no-question)), equation [](#eq:beta) reads
$1/T = \dd S/\dd E$.

**The founding assumption.** It is not proved for any real body; its consequences, such as those below, are what
support it.
:::

**A number: the thinning of the air.** Take one molecule of air as the small system and the rest of the air as its
bath. The molecules of a thin gas barely pull on one another, so each can be treated alone. The molecule's energy is
$\tfrac12\matter mv^2 + \matter mg_0z$, where $z$ is its height above the
ground, $g_0 = 9.81\unit{m\,s^{-2}}$ is the pull of gravity at the ground and
$\matter m = 4.81\times10^{-26}\unit{kg}$ is the average mass of the air's molecules. Its Boltzmann factor is
therefore the product $e^{-\matter mv^2/2\kB T}\,e^{-\matter mg_0z/\kB T}$. The first factor does
not contain $z$, so adding it up over all velocities gives the same number at every height. The chance of finding the
molecule in a small box at the height $z$ is then proportional to $e^{-\matter mg_0z/\kB T}$. Every molecule follows
this law independently, so the number $n$ of molecules per cubic metre falls in the same proportion:

$$n(z) = n(0)\,e^{-\matter mg_0z/\kB T} .$$

At a fixed temperature the pressure is $n\kB T$
([the gas thermometer](#heat-gives-every-quadratic-term-in-the-energy-the-same-share), below), so it too falls by a
factor $e$ every

$$\frac{\kB T}{\matter mg_0} = \frac{1.381\times10^{-23} \times 288}{4.81\times10^{-26} \times 9.81}\unit{m} = 8.4\unit{km}$$

at 288 K, the average temperature at the ground. The standard atmosphere's pressure falls by $e$ in 7.7 km. The
difference comes from the real air cooling by about 6.5 K for each kilometre of height.

## In phase space the weight splits, and the velocities are independent Gaussians

We want the law of the velocities in a warm body. We apply the Boltzmann distribution to the whole body: the body is
the small system, the room or the table it touches is the bath, and a state is a point of the body's phase space. We
assume that **the body is in thermal equilibrium with a bath at the temperature $T$**, that **classical mechanics
applies** (the end of [the section on equipartition](#heat-gives-every-quadratic-term-in-the-energy-the-same-share)
says when), and, with the paper, that **the body's forces come from a potential energy** $V(\vect x_1, \dots, \vect
x_N)$ of the positions alone, as in
[chapter 1.7](/tutorial/newton/hamilton/#hamiltons-equations-are-newtons-law-split-in-two), so that none of them
depends on velocity.[^magnetic]

Friction does depend on velocity, but it is not one of these forces. It belongs to the coupling between the body and
its bath, which slows parts that move too fast and, with random kicks, speeds up parts that move too slowly. That
coupling brings the body to the bath's temperature. It is not part of the body's energy, and it does not change the
weights of the body's states in equilibrium. The energy is 1.7's Hamiltonian,

$$H = \sum_a\frac{\vect p_a\cdot\vect p_a}{2\matter m_a} + V(\vect x_1, \dots, \vect x_N),$$

with $\matter m_a$, $\vect x_a$ and $\vect p_a$ the mass, position and momentum of particle $a$. The probability
density on phase space is proportional to $e^{-H/\kB T}$. The exponential of a sum is the product of the exponentials,
so

$$e^{-H/\kB T} = \prod_a e^{-\vect p_a\cdot\vect p_a/2\matter m_a\kB T} \times e^{-V/\kB T} .$$

Each factor before the last depends on the momentum of one particle, and the last depends on the positions alone. A
joint density that is a product of separate factors describes independent quantities
([chapter 3.1](/tutorial/noise/probability/#averaging-independent-readings-shrinks-the-noise-as-a-square-root)). So
the momenta are independent of the positions and of one another. Since $\vect p\cdot\vect p = p_x^2 + p_y^2 + p_z^2$,
each factor splits once more, and the three components of each momentum are independent too.

Each component has a density proportional to $e^{-p_x^2/2\matter m_a\kB T}$. This is
[3.1's Gaussian](/tutorial/noise/probability/#most-noise-follows-the-gaussian-bell) with mean zero and the variance
$\matter m_a\kB T$, in $\mathrm{kg^2\,m^2\,s^{-2}}$. The velocity $\vect v_a = \vect p_a/\matter m_a$ then has the
variance $\kB T/\matter m_a$ along each axis, in $\mathrm{m^2\,s^{-2}}$. With $\delta$ the Kronecker delta of
chapter 1.1, $i$ and $j$ labelling axes and $a$ and $b$ labelling particles,

$$\boxed{\;\langle v_{ai}\,v_{bj}\rangle = \frac{\kB T}{\matter m_a}\,\delta_{ab}\,\delta_{ij}\;} . \label{eq:maxwell}$$

Every component of every velocity has mean zero, the variance $\kB T/\matter m_a$, and no correlation with any other.
This law of the velocities is the **Maxwell distribution**. Adding the three axes gives $\langle v_a^2\rangle =
3\kB T/\matter m_a$, the paper's sentence.

The potential energy $V$, which holds every force in the body, has dropped out. It still governs the positions, which
follow $e^{-V/\kB T}$: that is how a solid keeps its shape while a gas fills its box. So "independent of the
positions" does not mean that the positions are random. It means that knowing where the atoms are tells nothing about
how fast they move. Only the velocities are free of the forces. Figure [](#fig:phase) shows this for 1.7's cart.

**Numbers.** An iron atom has the mass $9.27\times10^{-26}\unit{kg}$. At 300 K its velocity along each axis has the
standard deviation $\sigma_v = \sqrt{\kB T/\matter m} = 211\unit{m\,s^{-1}}$, and its **root mean square speed**,
$\sqrt{\langle v^2\rangle} = \sqrt{3\kB T/\matter m}$, is $366\unit{m\,s^{-1}}$, faster than sound in air. The paper's
steel ball, of radius 10 cm, has the mass 32.9 kg at the density that the tutorial uses for steel,
$7850\unit{kg\,m^{-3}}$. It holds $3.5\times10^{26}$ such atoms (chapter 1.7), all moving this fast while the ball
rests on the table, because their independent velocities point every way.

**A limit.** As $T \to 0$ every variance shrinks to zero, and the particles come to rest at the bottom of $V$. Quantum
mechanics leaves a small motion even then (chapter 8.3).

![Look first at the three slices along $p$, at $q = 0$, $\sigma_q$ and $2\sigma_q$: each divided by its own height
(right), they coincide in one Gaussian of width $\sigma_p$, so the spread of the momentum does not depend on the
position. The hill is the weight $e^{-H/\kB T}$ of 1.7's cart, $\matter m = 2\unit{kg}$ on $k = 50\unit{N\,m^{-1}}$ at
300 K, with $q$ in units of $\sigma_q = 9.1\times10^{-12}\unit{m}$ and $p$ in units of
$\sigma_p = \sqrt{\matter m\kB T} = 9.1\times10^{-11}\unit{kg\,m\,s^{-1}}$. The hill and the slices are exact; the
angle of view and the height of the hill on the page are chosen for the drawing.](tut-temp-phase){#fig:phase}

## Heat gives every quadratic term in the energy the same share

We want the average energy in each part of a body's motion. Take a term of the energy of the form $\tfrac12\kappa\,y^2$,
where $y$ is one coordinate or one momentum and $\kappa$ is a positive constant, in whatever unit makes the term an
energy. We assume that **$y$ appears nowhere else in the energy**. Then the factor of the Boltzmann weight that depends
on $y$ is $e^{-\kappa y^2/2\kB T}$, a Gaussian with mean zero and variance $\kB T/\kappa$. So
$\langle y^2\rangle = \kB T/\kappa$, and

$$\boxed{\;\bigl\langle\tfrac12\kappa\,y^2\bigr\rangle = \tfrac12\kB T\;} .$$

This is **equipartition**: in equilibrium, heat gives every quadratic term of the energy the same average share,
$\tfrac12\kB T$, whatever its constant $\kappa$. For a component of momentum, $y = p_x$ and $\kappa = 1/\matter m$, so
$\langle\tfrac12\matter mv_x^2\rangle = \tfrac12\kB T$. An atom has three such terms and holds $\tfrac32\kB T =
6.2\times10^{-21}\unit{J}$ of energy of motion at 300 K, the number that chapter
[1.8](/tutorial/newton/orbits-and-kicks/) quoted. A **degree of freedom** is one independent coordinate of a system,
one way in which it can move: an atom has three, and a cart on a track has one.

**The oscillator.** The cart of chapter
[4.1](/tutorial/response/oscillator/#a-mass-on-a-spring-swings-at-one-frequency), of mass $\matter m$ on a spring of
stiffness $k$, has the energy $H = p^2/2\matter m + \tfrac12kq^2$. Both terms are quadratic, so each holds
$\tfrac12\kB T$, and the cart holds $\kB T$ in all. Every normal mode of a body is such an oscillator (chapter 4.1), so
every mode holds $\kB T$ on average, the energy that 4.1's last problem gave the steel ball's mode. The term
$\tfrac12kq^2$ gives the mean square displacement:

$$\boxed{\;\langle q^2\rangle = \frac{\kB T}{k} = \kB T\,\chi(0)\;} .$$

The cart trembles about its place of rest, although nothing pushes it except the heat of its surroundings. This **static
jitter** is $\kB T$ times the static compliance $\chi(0) = 1/k$ of chapter
[4.1](/tutorial/response/oscillator/#a-steady-push-gets-a-steady-answer-the-response-function-times-the-push). The units
agree, since $\mathrm{J}/(\mathrm{N\,m^{-1}}) = \mathrm{m^2}$. The paper's [*What an applied tide
reveals*](/paper/#par:what-an-applied-tide-reveals) writes the same rule for a moment of a body's mass, $\matter Q_h$
([defined below](#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)):
$\langle\delta Q_h^2\rangle = \kB T\,\chi_h(0)$. Here $\delta Q_h$ is the departure of $\matter Q_h$ from its mean, and
$\chi_h(0)$ is how far $\matter Q_h$ moves per unit of steady tide. Chapter 4.6 calls this rule the static form of the
fluctuation–dissipation theorem.

**A number.** For 1.7's cart, $\matter m = 2\unit{kg}$ on $k = 50\unit{N\,m^{-1}}$ at 300 K, the jitter is
$\sqrt{4.14\times10^{-21}/50}\unit{m} = 9.1\times10^{-12}\unit{m}$, about a tenth of the width of a small atom. **A limit.**
As $k \to 0$ the jitter grows without limit, as it must for a cart that no spring holds.

**The gas thermometer.** Equipartition also gives the pressure of a gas. Molecules of a gas, $n$ per cubic metre,
strike a wall at right angles to $x$. A molecule moving toward the wall at $v_x$ bounces back and gives it the momentum
$2\matter mv_x$, and those within the distance $v_x$ of a square metre of the wall reach it in one second. Half of the
molecules move away from the wall and bring nothing. So the momentum given to each square metre per second, the
pressure, is $n \times \tfrac12 \times 2\matter m\langle v_x^2\rangle$, and by equipartition

$$\text{pressure} = n\,\kB T .$$

The mass of the molecule has cancelled. A gas kept at a fixed density has a pressure in proportion to its temperature,
whatever the gas, and that makes it a thermometer. Air at $288\unit{K}$ and the pressure at sea level,
$101{,}325\unit{Pa}$, holds $2.5\times10^{25}$ molecules in each cubic metre.

**Where it fails.** Equipartition is classical. In quantum mechanics a mode of angular frequency $\omega$ takes energy
only in steps of $\hbar\omega$, and it keeps a zero-point energy $\tfrac12\hbar\omega$ at every temperature
(chapter 8.3).[^quantum] Above that zero point it holds the heat $\hbar\omega/(e^{\hbar\omega/\kB T} - 1)$, which
tends to $\kB T$ when $\hbar\omega \ll \kB T$. At 300 K,
$\kB T/\hbar = 3.9\times10^{13}\unit{s^{-1}}$ (chapter 0.6). For the steel ball's mode at 15 kHz the small parameter
$\hbar\omega/\kB T$ is $2.4\times10^{-9}$, so the slow motions that change a body's shape are classical. Silicon's
line at 15.6 THz (chapter 4.1) has the ratio 2.5 and holds $0.22\,\kB T$. The stretching vibration of a nitrogen
molecule, at $7.0\times10^{13}\unit{Hz}$, has the ratio 11 and holds $1.6\times10^{-4}\,\kB T$, almost none of its
share of the heat. This is the first of the paper's conditions, "$\hbar\omega \ll k_BT$".

## The mean square rate of change of a warm body's moments is fixed by its temperature and density

We want the paper's equation, the chapter's main result. A **moment of the mass**
([chapter 1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass)) is
$\sym{mass-moment}{\matter Q_h} = \sum_a\matter m_ah(\vect x_a)$, with $h$ a smooth function of position; for harmonic
$h$ these are the moments from which the steady field outside is built
([chapter 2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments)). By the chain rule its
rate of change is

$$\matter{\dot Q}_h = \sum_a\matter m_a\,\nabla h(\vect x_a)\cdot\vect v_a ,$$

which is 1.7's $\sum_a\vect p_a\cdot\nabla h(\vect x_a)$. A second moment $\matter Q_g$ is built in the same way from
a second smooth function $g$, which, like $h$, is a profile and not the gravity $g_0$ of the air above. We multiply the
two rates and write the dot products with indices, summed over $i$ and $j$:

$$\matter{\dot Q}_h\,\matter{\dot Q}_g = \sum_{a,b}\matter m_a\matter m_b\,\partial_ih(\vect x_a)\,\partial_jg(\vect
x_b)\,v_{ai}\,v_{bj} .$$

The velocities are independent of the positions, so we may first average over the velocities with the positions held
fixed. By [](#eq:maxwell) only the terms with $a = b$ and $i = j$ survive:

$$\begin{aligned}
\langle\matter{\dot Q}_h\,\matter{\dot Q}_g\rangle_{\vect v} &= \sum_{a,b}\matter m_a\matter m_b\,\partial_ih(\vect
x_a)\,\partial_jg(\vect x_b)\,\frac{\kB T}{\matter m_a}\,\delta_{ab}\,\delta_{ij}\\
&= \kB T\sum_a\matter m_a\,\nabla h(\vect x_a)\cdot\nabla g(\vect x_a) .
\end{aligned}$$

One factor of the mass has cancelled against the $1/\matter m_a$ of the variance. What remains depends on the
positions alone. A sum $\sum_a\matter m_af(\vect x_a)$ over the particles is the integral $\int\matter\rho f\,\dd V$
over the density at that instant (chapter 1.7). Averaged over the positions, it is the same integral over the density
averaged in time, which is what the paper's $\matter\rho$ means. In a solid each atom strays from its place
by only about $10^{-11}$ m, a twenty-fifth of the distance between neighbouring atoms, so the averaged density is the
density of the body at rest. The result is the paper's equation:[^units]

{{paper eq:thermal-moment}}

The springs and the arrangement of the bonds have dropped out with $V$, and friction never entered. Only the masses
and their places remain. Stiffer springs make the moments swing faster, but they do not change the mean square of
their rates of change.[^mc] Figure [](#fig:moment) shows how the places weight the velocities for $h = xy$.

![Look first at the mass far out on the diagonal $y = x$, whose velocity counts strongly, and then at the one near
the centre, which moves fast but barely counts. The grey arrows are the weight $\nabla(xy) = (y, x)$ and the dark
arrows the velocities; each coloured tick is $\vect v\cdot\nabla(xy)$ at its mass, orange where it is positive and blue
where it is negative, and $\matter{\dot Q}_{xy}$ is the sum of the masses times these ticks. The weights are exact; the
places are chosen, with the larger dots twice as heavy, and the velocities are a random sample with the variance
$\kB T/\matter m$ of equation [](#eq:maxwell).](tut-temp-moment){#fig:moment}

## The first case is Brownian motion, and the next ones see inside

Take $h = g = x$. Then $\nabla h\cdot\nabla g = 1$, the integral is the mass $\matter M$, and $\matter Q_x =
\matter Mx_{\rm cm}$, with $x_{\rm cm}$ the centre of mass of
[chapter 1.6](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel). The paper's equation
gives $\matter M^2\langle\dot x_{\rm cm}^2\rangle = \kB T\matter M$, so

$$\langle\dot x_{\rm cm}^2\rangle = \frac{\kB T}{\matter M} .$$

The centre of mass moves like one particle that carries the whole mass, at the temperature of the bath.[^bath] This
random wandering of a whole body is **Brownian motion**. It is named for Robert Brown, who studied it in 1827 in the
particles, about 1 to 8 µm across, that grains of pollen release into water.[^brown] Chapter 4.6 follows it in time.
For the steel ball of 32.9 kg at 300 K the speed along each axis is $\sqrt{\kB T/\matter M} = 1.1\times10^{-11}
\unit{m\,s^{-1}}$, and for a person of 70 kg it is $7.7\times10^{-12}\unit{m\,s^{-1}}$. If the ball kept its direction,
it would cross the width of one of its iron atoms, about 0.25 nm, in 22 seconds.

Now take $h = g = xy$, which is harmonic, since $\nabla^2(xy) = 0$. Its gradient is $(y, x, 0)$, so
$\nabla h\cdot\nabla g = x^2 + y^2$. The integral of $\matter\rho\,(x^2 + y^2)$ is the moment of inertia about the $z$
axis, which for a round body is $\tfrac23\int\matter\rho\,r^2\,\dd V$
([chapter 1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)). So

$$\boxed{\;\langle\matter{\dot Q}_{xy}^2\rangle = \tfrac23\kB T\int\matter\rho\,r^2\,\dd V\;} .$$

A uniform ball has $\int\matter\rho\,r^2\,\dd V = \tfrac35\matter MR^2$, and a thin shell of the same mass and radius
has $\matter MR^2$. The two pull identically on everything outside them at all times (chapter 1.3). At the same
temperature, the shell's moment changes $\tfrac53$ times as much in mean square, whatever the springs and the friction
inside either body: the paper's "$5/3$". The steel ball's moment of inertia, $\tfrac25\matter MR^2$, is
$0.1315\unit{kg\,m^2}$, so at 300 K its $\langle\matter{\dot Q}_{xy}^2\rangle$ is
$4.14\times10^{-21}\unit{J} \times 0.1315\unit{kg\,m^2} = 5.4\times10^{-22}\unit{kg^2\,m^4\,s^{-2}}$.

The tremor can read what the steady pull cannot because $x^2 + y^2$ is not harmonic. It is $\tfrac12\nabla^2(x^2y^2)$,
as the rule of [chapter 2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic) says,
and its Laplacian is 4. The steady field outside reads the density only through harmonic functions, so
$\int\matter\rho\,r^2\,\dd V$ is exactly what it cannot read
([chapter 2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)).
A profile of degree 3 reaches further. For $h = g = x^3 - 3xy^2$, which is harmonic, $|\nabla h|^2 = 9(x^2 + y^2)^2$,
and for a round body $\int\matter\rho\,(x^2 + y^2)^2\,\dd V = \tfrac{8}{15}\int\matter\rho\,r^4\,\dd V$, so the tremor
reads $\int\matter\rho\,r^4\,\dd V$. Chapter 4.6 adds up every degree in the paper's [](/paper/#eq:thermal-multipole)
and finds at which frequencies the tremor lies (Figure [](/paper/#fig:tremor)); reading chapter R4 reads the paragraph
whole.

::: try {#equipartition}
Six masses at the corners of a hexagon, each joined to its neighbours by springs, sit in a heat bath that slows them
with a friction and kicks them at random. The molecule is drawn about its wandering centre of mass, with each velocity
as a thin arrow. Four gauges on the right show running averages divided by what this chapter predicts: the energy of
motion of a light and of a heavy mass in units of $\tfrac12\kB T$ per axis, $\langle\matter{\dot Q}_x^2\rangle$ against
$\kB T\matter M$, and $\langle\matter{\dot Q}_{xy}^2\rangle$ against the paper's equation, each with its standard
error. The sliders set the mass of two opposite masses, the stiffness of every spring and the temperature.

Before you touch anything, answer the two predictions at the top of the figure, then do what each asks. Afterwards,
raise the temperature and watch which gauges move.
:::

::: check
### Q

What is the root mean square speed of a nitrogen molecule, of mass $4.65\times10^{-26}\unit{kg}$, at 300 K?

### A

The root mean square speed is

$$\sqrt{\frac{3\kB T}{\matter m}} = \sqrt{\frac{3 \times 4.14\times10^{-21}}{4.65\times10^{-26}}}\unit{m\,s^{-1}} = 517\unit{m\,s^{-1}} .$$

### Q

Why does the paper insist that the forces do not depend on velocity?

### A

Then the energy splits into a part with only the momenta and a part with only the positions, and the Boltzmann weight
splits into a product. A velocity-dependent force in the body's energy would in general mix the two. Friction is not
such a force: it belongs to the coupling to the bath, which brings the body to the temperature $T$ and leaves the
weight $e^{-H/\kB T}$ as it is.

### Q

Why does making a body's springs stiffer leave $\langle\matter{\dot Q}_h^2\rangle$ unchanged?

### A

It depends only on the masses and their places. Stiffer springs change the frequencies at which the shape swings, not
the spread of the velocities, which is fixed by the temperature and the masses.

### Q

A uniform ball and a thin shell of the same mass and radius are at the same temperature. What is the ratio of their
$\langle\matter{\dot Q}_{xy}^2\rangle$?

### A

The ratio of their $\int\matter\rho\,r^2\,\dd V$, $\tfrac35\matter MR^2$ to $\matter MR^2$, which is $3 : 5$.
:::

**The idea to keep: in thermal equilibrium every velocity is an independent Gaussian of variance $k_BT/m$, whatever
the forces. So the mean square rate of change of a warm body's moments is fixed by its temperature and its density
alone, $\langle\dot Q_h\dot Q_g\rangle = k_BT\int\rho\,\nabla h\cdot\nabla g\,\mathrm dV$, and that integral holds what
the static field hides.**

::: problems
### Practice

At what temperature does a helium atom, of mass $6.65\times10^{-27}\unit{kg}$, have a root mean square speed of
$1\unit{km\,s^{-1}}$?

::: solution
From $\langle v^2\rangle = 3\kB T/\matter m$, $T = \matter m\langle v^2\rangle/3\kB = 6.65\times10^{-27} \times 10^6/(3
\times 1.381\times10^{-23})\unit{K} = 160\unit{K}$.
:::

### Stretch

Combine this chapter with chapter 1.6's centre of mass. A particle from inside a grain of pollen, about a micrometre
across, has the mass $10^{-15}\unit{kg}$ and floats in water at 300 K. What is its root mean square speed along one
axis, and how does it compare with a water molecule's ($3.0\times10^{-26}\unit{kg}$)?

::: solution
By the paper's equation with $h = g = x$, $\langle\dot x_{\rm cm}^2\rangle = \kB T/\matter M$, so the speed along one
axis is $\sqrt{4.14\times10^{-21}/10^{-15}}\unit{m\,s^{-1}} = 2.0\times10^{-3}\unit{m\,s^{-1}}$, two millimetres a
second. A water molecule moves at $\sqrt{4.14\times10^{-21}/3.0\times10^{-26}} = 370\unit{m\,s^{-1}}$ along one axis.
The ratio, $1.8\times10^5$, is the square root of the ratio of the masses, because both hold the same energy of
motion.
:::

### The paper

Compare the right-hand side of [](/paper/#eq:thermal-moment) with chapter 1.7's bracket $\{\matter Q_h,
\matter{\dot Q}_g\}$ and with the paper's [](/paper/#eq:hair-commutator). Say in one sentence each what the same
integral measures in the three.

::: solution
All three equal $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ times a constant: $\kB T$, 1 and $i\hbar$. In
[](/paper/#eq:thermal-moment) it is the mean product of two moments' rates of change in a warm body. In the bracket it
is the change in $\matter{\dot Q}_h$ per unit strength of an impulsive tide of profile $g$. In the commutator, the
quantum form of the bracket, $i\hbar$ times it is the difference between the products $\matter Q_h\matter{\dot Q}_g$
taken in the two orders. For a motion at angular frequency $\omega$, the typical thermal size of that product is about
$\kB T/\omega$ times the integral, so the difference is smaller by the ratio $\hbar\omega/\kB T$ (with $\hbar$ as
stated in chapter 4.1's paper problem; chapter 8.3 shows why): $2.4\times10^{-9}$ for the steel ball's mode at 15 kHz.
:::
:::

::: paper
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV) states the law of the velocities, "whatever forces
  hold the body together", derives [](/paper/#eq:thermal-moment) from it, and names the condition
  "$\hbar\omega \ll k_BT$" (chapters 4.6 and R4 read the rest).
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) writes the static jitter
  $\langle\delta Q_h^2\rangle = k_BT\,\chi_h(0)$; [](/paper/#eq:jitter-bounds) bounds its quantum form.
- [*The trembling lattice*](/paper/#par:the-trembling-lattice) (Appendix A) finds $\langle\dot Q_h^2\rangle =
  k_BT\sum_nc_n^2$ equal to the integral "to rounding error for any stiffnesses", and the Brownian motion for $h = x$.
- [*The field at two times*](/paper/#par:the-field-at-two-times) (Section XIII) meets the same integral in
  [](/paper/#eq:hair-commutator), in the sum rule [](/paper/#eq:sum-rule) and in [](/paper/#eq:dust).
- [Section VI](/paper/#sec:thermal), *The thermal glow*, takes this random motion of a body's atoms as the source of
  the short gravitational waves a warm body sends out (Part 10).
:::

::: deeper
- The GR course's lesson
  [*Probability, temperature and entropy*](https://neovand.github.io/general-relativity/chapter-22.html#probability-temperature-and-entropy)
  derives the canonical distribution from counting states; its
  [lab on particle crossings](https://neovand.github.io/general-relativity/chapter-11.html#particle-momentum-lab) shows
  pressure as momentum carried across a surface by moving particles, the gas thermometer's mechanism.
- F. Reif, *Fundamentals of Statistical and Thermal Physics* (McGraw-Hill, 1965), chapters 6 and 7, derives the
  canonical distribution, the Maxwell distribution and equipartition with care.
- D. V. Schroeder, *An Introduction to Thermal Physics* (Addison-Wesley, 2000), chapters 2, 3 and 6, reaches
  temperature by counting states, at the level of this chapter.
:::

[^T]: In Part 4 a $T$ without indices is always a temperature, not the period, record length or gain of chapters
    1.8, 3.3 and 3.5; an observing time is written $t_{\rm obs}$.

[^Omega]: Here $\Omega$ is a count, used only in this section. It is not a rotation rate or a solid angle.

[^magnetic]: The magnetic force on a moving charge depends on its velocity but does no work. Bohr and van Leeuwen's
    theorem says that a body in classical thermal equilibrium has no magnetization. Its key step keeps the law of the
    velocities derived here: written with velocities instead of momenta, the energy is
    $\sum_a\tfrac12\matter m_av_a^2 + V$, with no magnetic field in it, and the change of variables changes the weights
    only by a constant factor. The theorem is stated here (N. Bohr, thesis, 1911; H.-J. van Leeuwen, *J. Phys. Radium*
    2, 361, 1921).

[^quantum]: Chapter 8.3 derives this; here it only marks where the chapter's results stop.

[^units]: Units, for a quadratic $h$ and $g$ in square metres: on the left, a moment is in $\mathrm{kg\,m^2}$ and its
    rate in $\mathrm{kg\,m^2\,s^{-1}}$, so the product is in $\mathrm{kg^2\,m^4\,s^{-2}}$. On the right,
    $\mathrm{J} \times \mathrm{kg\,m^{-3}} \times \mathrm{m^2} \times \mathrm{m^3} = \mathrm{kg^2\,m^4\,s^{-2}}$.

[^mc]: A check by numbers: 300 particles of random masses at random places, with velocities drawn by
    [](#eq:maxwell) 20,000 times, give a mean $\matter{\dot Q}_{xy}^2$ of 1.007 times the right-hand side, within the
    1% sampling error.

[^bath]: This needs a body that trades momentum with its surroundings, as a ball on a table does. A body alone in
    empty space keeps its total momentum.

[^brown]: The grains themselves, about 100 µm across, hardly move, and Brown named earlier observers of the motion.
    See P. Pearle et al., "What Brown saw and you can too", *Am. J. Phys.* 78, 1278 (2010).
