---
id: '4.2'
title: 'Temperature, the Boltzmann distribution and equipartition'
question: 'In a warm body every velocity follows one law, whatever forces hold the body together. Why can heat say something so exact about a body whose forces we do not know, and what does it then say about the body''s pull?'
part: '4'
requires: ['1.6', '1.7', '2.1', '3.1', '4.1']
paper: [sec:near-field, eq:thermal-moment, eq:thermal-multipole, eq:sum-rule, eq:jitter-bounds, app:benchmarks, sec:second-order, eq:hair-commutator, eq:dust, sec:thermal]
figures: []
live: [equipartition]
depth: A
---

Every warm body trembles, and its trembling has a near field. The first fact about it is a strong claim. In classical
thermal equilibrium the velocities of the particles of a body are independent of their positions and of one another,
with $\langle v_a^2\rangle = 3\kB T/m_a$, whatever forces hold the body together. From this follows the mean square
rate of change of the moments of a body's mass.

So why can heat say something so exact about a body whose forces we do not know, and what does it then say about the
body's pull? In short, the chance of each state of a warm body falls exponentially with its energy, and in that law
the velocities separate from the positions, which hold all the forces. The result then follows in a few lines.

::: plain
Temperature measures how heat is shared. Two bodies that touch pass energy back and forth until their temperatures
are equal. Boltzmann's constant times the temperature is an energy, about $4\times10^{-21}$ joules at room
temperature.

In a warm body, each extra amount of energy $\kB T$ makes a state 2.7 times less likely. A body's energy is the energy
of motion of its atoms, which depends only on their velocities, plus the energy stored in its forces, which depends
only on their positions. So the velocities follow their own law, whatever the forces are: each is a random number with
a bell-shaped spread, independent of all the others, whose size depends only on the temperature and the atom's mass.

So the mean square rate of change of a warm body's moments depends only on the temperature and on where the mass
lies. It holds numbers, such as how far the mass lies from the centre, that the steady pull cannot show.
:::

## Temperature is what bodies in contact come to share

Put a hot steel ball into a bucket of cold water. Energy flows from the ball to the water as heat, and after a while
the flow stops. The two are then in **thermal equilibrium**: their atoms still trade energy, but on average as much
flows each way. What is then equal in the two bodies, whatever they are made of, is their **temperature**, which is how
a thermometer measures it. Here $\sym{temperature}{T}$ is measured in kelvin from absolute zero; room temperature is about
$300\unit{K}$.[^T]

Boltzmann's constant $\sym{boltzmann}{\kB} = 1.380649\times10^{-23}\unit{J\,K^{-1}}$ (section
[0.6](/tutorial/evening/how-to-read/#every-number-says-what-it-measures-in-what-unit-and-against-what)), exact by
definition since 2019, turns a temperature into an energy. The product $\kB T$ sets the share of energy that heat gives
to each part of a body's motion: $\tfrac12\kB T$ to each squared term of the energy, such as $\tfrac12\matter mv_x^2$,
and so $\kB T$ to each way in which a body can vibrate
([equipartition](#heat-gives-every-quadratic-term-in-the-energy-the-same-share), below). At 300 K,

$$\kB T = 1.381\times10^{-23} \times 300\unit{J} = 4.14\times10^{-21}\unit{J} = 0.0259\unit{eV},$$

about a fortieth of an electronvolt. A chemical bond takes a few electronvolts to break, a hundred times more.

**A non-example.** A temperature is not an amount of heat. A bathtub of warm water and a cup of the same water have the
same $\kB T$, but the bathtub holds a thousand times more heat.

## The chance of a state falls exponentially with its energy

We want the probability of each state of a small system that trades energy with a large one, the **heat bath**: the
small system may be a molecule of gas, a cart on its spring or a steel ball in a room. A state is, as in
[section 1.7](/tutorial/newton/hamilton/#a-state-is-a-position-and-a-momentum), a point of phase space: every position
and every momentum.

We make one assumption, the founding assumption of statistical physics: **every state of the combined system with the
same total energy $E_{\rm tot}$ is equally likely**. When the small system is in a state of energy $E$, the bath has the
energy $E_{\rm tot} - E$ and may be in any of its states with that energy. We write $\sym{state-count}{\Omega}(E)$ for the
number of the bath's states with the energy $E$, a pure number.[^Omega] Since every combined state is equally likely,
the probability $p$ of the small system's state is proportional to the number of ways in which the bath can go with it:

$$p \propto \Omega(E_{\rm tot} - E) .$$

Since $\Omega$ grows enormously fast with the energy, we use its logarithm and expand to first order in the small
system's energy $E$ (Figure [](#fig:bath)):

$$\ln\Omega(E_{\rm tot} - E) = \ln\Omega(E_{\rm tot}) - E\,\frac{\dd\ln\Omega}{\dd E} + \dots$$

The derivative is an inverse energy. We name it

$$\frac{1}{\kB T} = \frac{\dd\ln\Omega}{\dd E} . \label{eq:beta}$$

The box below shows that this slope is equal in two bodies in equilibrium, so it measures
[the temperature that bodies in contact share](#temperature-is-what-bodies-in-contact-come-to-share); we write it as
$1/\kB T$ so that $\kB T$ is an energy. We take the exponential of both sides. The first term becomes a constant
factor, which the condition that the probabilities add up to one fixes, and

$$\boxed{\;p \propto e^{-E/\kB T}\;} .$$

This is the **Boltzmann distribution** (or canonical distribution), and $e^{-E/\kB T}$ is the **Boltzmann factor**. A state with $\kB T$ more energy than another is $e = 2.7$ times less likely, and one with
$10\,\kB T$ more is $e^{10} = 22{,}000$ times less likely. As $T \to 0$ only the states of the lowest energy remain, and as $T \to \infty$ every state becomes equally likely.

![Look first at the inset, where the logarithm of the bath's count of states is a straight line of slope $1/\kB T$
over the small system's range, so giving the small system (left) the energy $E$ lowers $\ln\Omega$ by $E/\kB T$.
Below it, on the same energy scale, $e^{-E/\kB T}$ falls by a factor $e$ for each $\kB T$. The large curve is
schematic.](tut-temp-bath){#fig:bath}

::: gap
This sketch skips the following.

**Counting states.** The number of states means the volume of phase space within a narrow range of energy, cut into
cells of $2\pi\hbar$ for each coordinate and its momentum (section 8.3). Only the slope of $\ln\Omega$ enters, so
the cell size drops out.

**Why $\ln\Omega$ is nearly a straight line.** For $N$ atoms that do not pull on one another, the momenta with
energy below $E$ fill a ball of radius $\sqrt{2mE}$ in $3N$ dimensions, whose volume grows as $E^{3N/2}$, so
$\ln\Omega \approx \tfrac32N\ln E$. Then equation [](#eq:beta) gives $E/N = \tfrac32\kB T$ per atom, as
[the section on equipartition](#heat-gives-every-quadratic-term-in-the-energy-the-same-share) finds. Over the small
system's range the slope changes only by the fraction $E/E_{\rm tot}$ of itself.

**Why the slope is the temperature.** When two bodies share a fixed energy, the number of joint states with the first
holding $E_1$ is $\Omega_1(E_1)\,\Omega_2(E_{\rm tot} - E_1)$. For large bodies this product has an extremely sharp
peak, where $\dd\ln\Omega_1/\dd E_1 = \dd\ln\Omega_2/\dd E_2$, and energy moves toward the body with the larger
slope, which is the colder. With $S = \kB\ln\Omega$, the body's **entropy** ($\kB\ln2$ times the entropy in bits of
[section 3.8](/tutorial/noise/bits/#a-bit-is-the-answer-to-one-yes-or-no-question)), equation [](#eq:beta) reads
$1/T = \dd S/\dd E$.

**The founding assumption.** It is not proved for any real body; its consequences, such as those below, support it.
:::

**A number: the thinning of the air.** Take one molecule of air as the small system and the rest of the air as its
bath. The molecule's energy is $\tfrac12\matter mv^2 + \matter mg_0z$, with $z$ its height above the ground,
$g_0 = 9.81\unit{m\,s^{-2}}$ and $\matter m = 4.81\times10^{-26}\unit{kg}$ the average mass of air's molecules. Its
Boltzmann factor is the product $e^{-\matter mv^2/2\kB T}\,e^{-\matter mg_0z/\kB T}$. The first factor does
not contain $z$, so adding it up over all velocities gives the same number at every height. The chance of finding the
molecule at the height $z$ is then proportional to $e^{-\matter mg_0z/\kB T}$, and so is the number $n$ of molecules
per cubic metre:

$$n(z) = n(0)\,e^{-\matter mg_0z/\kB T} .$$

The pressure is $n\kB T$
([the gas thermometer](#heat-gives-every-quadratic-term-in-the-energy-the-same-share), below), so it falls by $e$ every

$$\frac{\kB T}{\matter mg_0} = \frac{1.381\times10^{-23} \times 288}{4.81\times10^{-26} \times 9.81}\unit{m} = 8.4\unit{km}$$

at 288 K, the average temperature at the ground. The standard atmosphere's pressure falls by $e$ in 7.7 km, because
real air cools by about 6.5 K for each kilometre of height.

## In phase space the weight splits, and the velocities are independent Gaussians

We want the law of the velocities in a warm body. We apply the Boltzmann distribution to the whole body: the body is
the small system, the room or table it touches is the bath. We assume that **the body is in thermal equilibrium with a
bath at the temperature $T$**, that **classical mechanics applies** (the end of
[the section on equipartition](#heat-gives-every-quadratic-term-in-the-energy-the-same-share) says when), and that
**the body's forces come from a potential energy** $V(\vect x_1, \dots, \vect x_N)$ of the positions alone, as in
[section 1.7](/tutorial/newton/hamilton/#hamiltons-equations-are-newtons-law-split-in-two), so that none of them
depends on velocity.[^magnetic]

Friction does depend on velocity, but it belongs to the coupling between the body and its bath, which slows parts
that move too fast and, with random kicks, speeds up parts that move too slowly. That coupling brings the body to the
bath's temperature; it is not part of the body's energy and does not change the weights of the states in
equilibrium. The energy is the Hamiltonian of section 1.7,

$$H = \sum_a\frac{\vect p_a\cdot\vect p_a}{2\matter m_a} + V(\vect x_1, \dots, \vect x_N),$$

with $\matter m_a$, $\vect x_a$ and $\vect p_a$ the mass, position and momentum of particle $a$. The probability
density on phase space is proportional to $e^{-H/\kB T}$. The exponential of a sum is the product of the exponentials,
so

$$e^{-H/\kB T} = \prod_a e^{-\vect p_a\cdot\vect p_a/2\matter m_a\kB T} \times e^{-V/\kB T} .$$

Each factor before the last depends on the momentum of one particle, and the last on the positions alone. A joint
density that is a product of separate factors describes independent quantities
([section 3.1](/tutorial/noise/probability/#averaging-independent-readings-shrinks-the-noise-as-a-square-root)). So
the momenta are independent of the positions and of one another, and, since $\vect p\cdot\vect p = p_x^2 + p_y^2 +
p_z^2$, the three components of each momentum are independent too.

Each component has a density proportional to $e^{-p_x^2/2\matter m_a\kB T}$, which is
[the Gaussian of section 3.1](/tutorial/noise/probability/#most-noise-follows-the-gaussian-bell) with mean zero and the variance
$\matter m_a\kB T$, in $\mathrm{kg^2\,m^2\,s^{-2}}$. The velocity $\vect v_a = \vect p_a/\matter m_a$ then has the
variance $\kB T/\matter m_a$ along each axis, in $\mathrm{m^2\,s^{-2}}$. With $\delta$ the Kronecker delta of
section 1.1, $i$ and $j$ labelling axes and $a$ and $b$ labelling particles,

$$\boxed{\;\langle v_{ai}\,v_{bj}\rangle = \frac{\kB T}{\matter m_a}\,\delta_{ab}\,\delta_{ij}\;} . \label{eq:maxwell}$$

Every component of every velocity has mean zero, the variance $\kB T/\matter m_a$, and no correlation with any other.
This law is the **Maxwell distribution**. Adding the three axes gives $\langle v_a^2\rangle = 3\kB T/\matter m_a$.

The potential energy $V$, which holds every force in the body, has dropped out. It still governs the positions, which
follow $e^{-V/\kB T}$: that is how a solid keeps its shape while a gas fills its box. So independence does not mean
that the positions are random; it means that knowing where the atoms are tells nothing about how fast they move.
Figure [](#fig:phase) shows this for the cart of section 1.7.

**Numbers.** An iron atom has the mass $9.27\times10^{-26}\unit{kg}$. At 300 K its velocity along each axis has the
standard deviation $\sigma_v = \sqrt{\kB T/\matter m} = 211\unit{m\,s^{-1}}$, and its **root mean square speed**,
$\sqrt{3\kB T/\matter m}$, is $366\unit{m\,s^{-1}}$, faster than sound in air. A steel ball of radius 10 cm has the mass 32.9 kg at the density we use for steel, $7850\unit{kg\,m^{-3}}$. It holds
$3.5\times10^{26}$ such atoms (section 1.7), all moving this fast while the ball rests on the table, because their
independent velocities point every way.

**A limit.** As $T \to 0$ every variance shrinks to zero and the particles come to rest at the bottom of $V$.

![Look first at the three slices along $p$, at $q = 0$, $\sigma_q$ and $2\sigma_q$: each divided by its own height
(right), they coincide in one Gaussian of width $\sigma_p$, so the spread of the momentum does not depend on the
position. The hill is the weight $e^{-H/\kB T}$ of the cart of section 1.7, $\matter m = 2\unit{kg}$ on
$k = 50\unit{N\,m^{-1}}$ at 300 K, with $q$ in units of $\sigma_q = 9.1\times10^{-12}\unit{m}$ and $p$ in units of
$\sigma_p = \sqrt{\matter m\kB T} = 9.1\times10^{-11}\unit{kg\,m\,s^{-1}}$.](tut-temp-phase){#fig:phase}

## Heat gives every quadratic term in the energy the same share

We want the average energy in each part of a body's motion. Take a term of the energy of the form $\tfrac12\kappa\,y^2$,
where $y$ is one coordinate or one momentum and $\kappa$ a positive constant. We assume that **$y$ appears nowhere else in the energy**. Then the factor of the Boltzmann weight that depends
on $y$ is $e^{-\kappa y^2/2\kB T}$, a Gaussian with mean zero and variance $\kB T/\kappa$. So
$\langle y^2\rangle = \kB T/\kappa$, and

$$\boxed{\;\bigl\langle\tfrac12\kappa\,y^2\bigr\rangle = \tfrac12\kB T\;} .$$

This is **equipartition**: heat gives every quadratic term of the energy the same average share, whatever its constant
$\kappa$. For a component of momentum, $y = p_x$ and $\kappa = 1/\matter m$, so
$\langle\tfrac12\matter mv_x^2\rangle = \tfrac12\kB T$. An atom has three such terms and holds $\tfrac32\kB T =
6.2\times10^{-21}\unit{J}$ of energy of motion at 300 K, the number that section
[1.8](/tutorial/newton/orbits-and-kicks/) quoted. A **degree of freedom** is one independent way in which a system can move: an atom has three, a cart on a track one.

**The oscillator.** The cart of
[section 4.1](/tutorial/response/oscillator/#a-mass-on-a-spring-swings-at-one-frequency), of mass $\matter m$ on a spring
of stiffness $k$, has the energy $H = p^2/2\matter m + \tfrac12kq^2$. Both terms are quadratic, so each holds
$\tfrac12\kB T$, and the cart holds $\kB T$ in all. Every normal mode of a body is such an oscillator, so every mode
holds $\kB T$ on average. The term $\tfrac12kq^2$ gives the mean square displacement:

$$\boxed{\;\langle q^2\rangle = \frac{\kB T}{k} = \kB T\,\chi(0)\;} .$$

The cart trembles about its place of rest, pushed only by the heat of its surroundings. This **static jitter** is $\kB T$ times the static compliance $\chi(0) = 1/k$ of
[section 4.1](/tutorial/response/oscillator/#a-steady-push-gets-a-steady-answer-the-response-function-times-the-push).
The units agree, since $\mathrm{J}/(\mathrm{N\,m^{-1}}) = \mathrm{m^2}$. The same rule holds for a moment of a body's
mass, $\matter Q_h$
([defined below](#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)):
$\langle\delta Q_h^2\rangle = \kB T\,\chi_h(0)$, where $\delta Q_h$ is the departure of $\matter Q_h$ from its mean and
$\chi_h(0)$ is how far $\matter Q_h$ moves per unit of steady tide.[^jitter] This is the static form of the
[fluctuation–dissipation theorem](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency)
of section 4.6.

**A number.** For the cart of section 1.7 at 300 K the jitter is
$\sqrt{4.14\times10^{-21}/50}\unit{m} = 9.1\times10^{-12}\unit{m}$, about a tenth of the width of a small atom.
**A limit.** As $k \to 0$ the jitter grows without limit, as it must for a cart that no spring holds.

**The gas thermometer.** Equipartition also gives the pressure of a gas. Molecules of a gas, $n$ per cubic metre, strike a wall at right angles to $x$. A molecule moving toward the wall at
$v_x$ bounces back and gives it the momentum $2\matter mv_x$, and those within the distance $v_x$ of a square metre of
the wall reach it in one second; half move away and bring nothing. So the momentum given to each square metre per
second, the pressure, is $n \times \tfrac12 \times 2\matter m\langle v_x^2\rangle$, and by equipartition

$$\text{pressure} = n\,\kB T .$$

The mass of the molecule has cancelled: at a fixed density the pressure of any gas is in proportion to its
temperature, which makes a gas a thermometer. Air at $288\unit{K}$ and $101{,}325\unit{Pa}$ holds $2.5\times10^{25}$
molecules in each cubic metre.

**Where it fails.** Equipartition is classical. In quantum mechanics a mode of angular frequency $\omega$ takes energy
only in steps of $\hbar\omega$, and it keeps a zero-point energy $\tfrac12\hbar\omega$ at every temperature
(section 8.3). Above that zero point it holds the heat $\hbar\omega/(e^{\hbar\omega/\kB T} - 1)$, which tends to
$\kB T$ when $\hbar\omega \ll \kB T$. At 300 K, $\kB T/\hbar = 3.9\times10^{13}\unit{s^{-1}}$ (section 0.6). For the
steel ball's mode at 15 kHz, $\hbar\omega/\kB T = 2.4\times10^{-9}$, so the slow motions that change a body's shape
are classical. Silicon's line at 15.6 THz (section 4.1) has the ratio 2.5 and holds $0.22\,\kB T$; the stretching
vibration of a nitrogen molecule, at $7.0\times10^{13}\unit{Hz}$, has the ratio 11 and holds $1.6\times10^{-4}\,\kB T$.

## The mean square rate of change of a warm body's moments is fixed by its temperature and density

We want the mean square rate of change of a body's moments, the main result of this section. A **moment of the mass**
([section 1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass)) is
$\sym{mass-moment}{\matter Q_h} = \sum_a\matter m_ah(\vect x_a)$, with $h$ a smooth function of position; for harmonic
$h$ these are the moments from which the steady field outside is built
([section 2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments)). By the chain rule its
rate of change is

$$\matter{\dot Q}_h = \sum_a\matter m_a\,\nabla h(\vect x_a)\cdot\vect v_a ,$$

which is $\sum_a\vect p_a\cdot\nabla h(\vect x_a)$ (section 1.7). A second moment $\matter Q_g$ is built in the same
way from a second smooth function $g$ (a profile, not the gravity $g_0$ of the air above). We multiply the two rates and write the dot products with indices, summed over $i$ and $j$:

$$\matter{\dot Q}_h\,\matter{\dot Q}_g = \sum_{a,b}\matter m_a\matter m_b\,\partial_ih(\vect x_a)\,\partial_jg(\vect
x_b)\,v_{ai}\,v_{bj} .$$

The velocities are independent of the positions, so we first average over the velocities with the positions held
fixed. By [](#eq:maxwell) only the terms with $a = b$ and $i = j$ survive:

$$\begin{aligned}
\langle\matter{\dot Q}_h\,\matter{\dot Q}_g\rangle_{\vect v} &= \sum_{a,b}\matter m_a\matter m_b\,\partial_ih(\vect
x_a)\,\partial_jg(\vect x_b)\,\frac{\kB T}{\matter m_a}\,\delta_{ab}\,\delta_{ij}\\
&= \kB T\sum_a\matter m_a\,\nabla h(\vect x_a)\cdot\nabla g(\vect x_a) .
\end{aligned}$$

One factor of the mass has cancelled against the $1/\matter m_a$ of the variance, and what remains depends on the
positions alone. A sum $\sum_a\matter m_af(\vect x_a)$ over the particles is the integral $\int\matter\rho f\,\dd V$
over the density at that instant (section 1.7). Averaged over the positions, it is the same integral over the density
averaged in time. In a solid each atom strays from its place by only about $10^{-11}$ m, a twenty-fifth of the
distance to its neighbours, so the averaged density is that of the body at rest. The result is[^units]

$$\boxed{\;\langle\matter{\dot Q}_h\,\matter{\dot Q}_g\rangle = \kB T\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V\;} .
\label{eq:thermal-moment}$$

The springs and the arrangement of the bonds have dropped out with $V$, and friction never entered: only the masses
and their places remain. Stiffer springs make the moments swing faster but do not change the mean square of their
rates of change. Figure [](#fig:moment) shows how the places weight the velocities for $h = xy$.

![Look first at the mass far out on the diagonal $y = x$, whose velocity counts strongly, and then at the one near
the centre, which moves fast but barely counts. The grey arrows are the weight $\nabla(xy) = (y, x)$ and the dark
arrows the velocities; each coloured tick is $\vect v\cdot\nabla(xy)$ at its mass, orange where positive and blue where negative, and
$\matter{\dot Q}_{xy}$ is the sum of the masses times these ticks. The places are chosen, with the larger dots twice
as heavy, and the velocities are a random sample with the variance $\kB T/\matter m$ of equation [](#eq:maxwell).](tut-temp-moment){#fig:moment}

## The first case is Brownian motion, and the next ones see inside

Take $h = g = x$. Then $\nabla h\cdot\nabla g = 1$, the integral is the mass $\matter M$, and $\matter Q_x =
\matter Mx_{\rm cm}$, with $x_{\rm cm}$ the centre of mass of
[section 1.6](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel). Equation [](#eq:thermal-moment)
gives $\matter M^2\langle\dot x_{\rm cm}^2\rangle = \kB T\matter M$, so

$$\langle\dot x_{\rm cm}^2\rangle = \frac{\kB T}{\matter M} .$$

The centre of mass moves like one particle that carries the whole mass, at the temperature of the bath.[^bath] This
random wandering of a whole body is **Brownian motion**, named for Robert Brown, who studied it in 1827 in the small
particles that grains of pollen release into water.[^brown] Section
[4.6](/tutorial/response/fluctuation-dissipation/#a-grain-in-water-is-kicked-at-random-and-slowed-by-friction-and-the-two-are-linked)
follows it in time. For the steel ball of 32.9 kg at 300 K the speed along each axis is $\sqrt{\kB T/\matter M} =
1.1\times10^{-11} \unit{m\,s^{-1}}$, and for a person of 70 kg it is $7.7\times10^{-12}\unit{m\,s^{-1}}$. If the ball
kept its direction, it would cross an iron atom's width, about 0.25 nm, in 22 seconds.

Now take $h = g = xy$, which is harmonic, since $\nabla^2(xy) = 0$. Its gradient is $(y, x, 0)$, so
$\nabla h\cdot\nabla g = x^2 + y^2$. The integral of $\matter\rho\,(x^2 + y^2)$ is the moment of inertia about the $z$
axis, which for a round body is $\tfrac23\int\matter\rho\,r^2\,\dd V$
([section 1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)). So

$$\boxed{\;\langle\matter{\dot Q}_{xy}^2\rangle = \tfrac23\kB T\int\matter\rho\,r^2\,\dd V\;} .$$

A uniform ball has $\int\matter\rho\,r^2\,\dd V = \tfrac35\matter MR^2$, and a thin shell of the same mass and radius
has $\matter MR^2$, yet the two pull identically on everything outside them (section 1.3). At the same temperature the
shell's moment changes $\tfrac53$ times as much in mean square, whatever the springs and friction inside either body.
The steel ball's moment of inertia, $\tfrac25\matter MR^2$, is $0.1315\unit{kg\,m^2}$, so at 300 K its
$\langle\matter{\dot Q}_{xy}^2\rangle$ is
$4.14\times10^{-21}\unit{J} \times 0.1315\unit{kg\,m^2} = 5.4\times10^{-22}\unit{kg^2\,m^4\,s^{-2}}$.

The tremor can read what the steady pull cannot because $x^2 + y^2$ is not harmonic: it is $\tfrac12\nabla^2(x^2y^2)$,
as the rule of [section 2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic) says, and
its Laplacian is 4. The steady field outside reads the density only through harmonic functions, so
$\int\matter\rho\,r^2\,\dd V$ is exactly what it cannot read ([section
2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)). A
profile of degree 3 reaches further. For $h = g = x^3 - 3xy^2$, which is harmonic, $|\nabla h|^2 = 9(x^2 + y^2)^2$, and
for a round body $\int\matter\rho\,(x^2 + y^2)^2\,\dd V = \tfrac{8}{15}\int\matter\rho\,r^4\,\dd V$, so the tremor reads
$\int\matter\rho\,r^4\,\dd V$. Section
[4.6](/tutorial/response/fluctuation-dissipation/#each-degree-of-the-tremor-holds-one-moment-of-the-density) adds up
every degree and finds at which frequencies the tremor lies (the figure of section 4.1).[^multipole]

::: try {#equipartition}
Six masses at the corners of a hexagon, joined by springs, sit in a heat bath that slows them with a friction and
kicks them at random; each velocity is a thin arrow. Four gauges show running averages divided by what this section
predicts: the energy of motion of a light and of a heavy mass in units of $\tfrac12\kB T$ per axis,
$\langle\matter{\dot Q}_x^2\rangle$ against $\kB T\matter M$, and $\langle\matter{\dot Q}_{xy}^2\rangle$ against
equation [](#eq:thermal-moment), each with its standard error. The sliders set the mass of two opposite masses, the
stiffness of every spring and the temperature.

Before you touch anything, answer the two predictions at the top of the figure, then do what each asks. Afterwards,
raise the temperature and watch which gauges move.
:::

**The idea to keep: in thermal equilibrium every velocity is an independent Gaussian of variance $k_BT/m$, whatever
the forces. So the mean square rate of change of a warm body's moments is fixed by its temperature and its density
alone, $\langle\dot Q_h\dot Q_g\rangle = k_BT\int\rho\,\nabla h\cdot\nabla g\,\mathrm dV$, and that integral holds what
the static field hides.**

::: problems
### Practice

**[4.2]** What is the root mean square speed of a nitrogen molecule, of mass $4.65\times10^{-26}\unit{kg}$, at 300 K?

::: solution
$$\sqrt{\frac{3\kB T}{\matter m}} = \sqrt{\frac{3 \times 4.14\times10^{-21}}{4.65\times10^{-26}}}\unit{m\,s^{-1}} = 517\unit{m\,s^{-1}} .$$
:::

**[4.2]** Why must the forces in the body not depend on velocity?

::: solution
Then the energy, and so the Boltzmann weight, splits into a part with only the momenta and a part with only the
positions. Friction is not such a force: it belongs to the coupling to the bath and leaves the weight as it is.
:::

**[4.2]** Why does making a body's springs stiffer leave $\langle\matter{\dot Q}_h^2\rangle$ unchanged?

::: solution
It depends only on the masses and their places. Stiffer springs change the frequencies at which the shape swings, not
the spread of the velocities.
:::

**[4.2]** At what temperature does a helium atom, of mass $6.65\times10^{-27}\unit{kg}$, have a root mean square speed
of $1\unit{km\,s^{-1}}$?

::: solution
From $\langle v^2\rangle = 3\kB T/\matter m$, $T = \matter m\langle v^2\rangle/3\kB = 6.65\times10^{-27} \times 10^6/(3
\times 1.381\times10^{-23})\unit{K} = 160\unit{K}$.
:::

### Stretch

**[4.2]** Combine this section with the centre of mass of section 1.6. A particle from inside a grain of pollen, about a
micrometre across, has the mass $10^{-15}\unit{kg}$ and floats in water at 300 K. What is its root mean square speed
along one axis, and how does it compare with a water molecule's ($3.0\times10^{-26}\unit{kg}$)?

::: solution
By [](#eq:thermal-moment) with $h = g = x$, $\langle\dot x_{\rm cm}^2\rangle = \kB T/\matter M$, so the speed along one
axis is $\sqrt{4.14\times10^{-21}/10^{-15}}\unit{m\,s^{-1}} = 2.0\times10^{-3}\unit{m\,s^{-1}}$. A water molecule moves
at $\sqrt{4.14\times10^{-21}/3.0\times10^{-26}} = 370\unit{m\,s^{-1}}$. The ratio, $1.8\times10^5$, is the square root
of the ratio of the masses, because both hold the same energy of motion.
:::

### The camera

**[4.2]** Compare the right-hand side of [](#eq:thermal-moment) with the bracket $\{\matter Q_h, \matter{\dot Q}_g\}$ of
section 1.7 and with its quantum form, the commutator. Say in one sentence each what the same integral measures in the
three.

::: solution
All three equal $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ times a constant: $\kB T$, 1 and $i\hbar$. In
[](#eq:thermal-moment) it is the mean product of two moments' rates of change in a warm body. In the bracket it is the
change in $\matter{\dot Q}_h$ per unit strength of an impulsive tide of profile $g$. In the commutator, $i\hbar$ times
it is the difference between the products $\matter Q_h\matter{\dot Q}_g$ taken in the two orders. For a motion at
angular frequency $\omega$, the typical thermal size of that product is about $\kB T/\omega$ times the integral, so
the difference is smaller by $\hbar\omega/\kB T$ (section 8.3 shows why): $2.4\times10^{-9}$ for the steel ball's mode
at 15 kHz.
:::
:::

::: paper
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV) states the law of the velocities, derives
  [](/paper/#eq:thermal-moment) from it, and names the condition $\hbar\omega \ll k_BT$ (section 4.6).
- [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals): the static jitter; Appendix A's
  [](/paper/#eq:jitter-bounds) bounds its quantum form.
- [*The trembling lattice*](/paper/#par:the-trembling-lattice) (Appendix A): $\langle\dot Q_h^2\rangle = k_BT\sum_nc_n^2$
  equals the integral, and the Brownian motion for $h = x$.
- [*The field at two times*](/paper/#par:the-field-at-two-times) (Section XIII) meets the same integral in
  [](/paper/#eq:hair-commutator), [](/paper/#eq:sum-rule) and [](/paper/#eq:dust).
- [Section VI](/paper/#sec:thermal) takes the random motion of a body's atoms as the source of the short
  gravitational waves a warm body sends out (Part 10).
:::

::: deeper
- F. Reif, *Fundamentals of Statistical and Thermal Physics* (McGraw-Hill, 1965), chapters 6 and 7.
- D. V. Schroeder, *An Introduction to Thermal Physics* (Addison-Wesley, 2000), chapters 2, 3 and 6, reaches
  temperature by counting states.
:::

[^T]: In Part 4 a $T$ without indices is a temperature, not a period or record length; an observing time is written
    $t_{\rm obs}$.

[^Omega]: Here $\Omega$ is a count, used only in this section.

[^magnetic]: The magnetic force on a moving charge depends on its velocity but does no work: written with velocities
    instead of momenta, the energy is $\sum_a\tfrac12\matter m_av_a^2 + V$, with no magnetic field in it. So a body in
    classical equilibrium has no magnetization (Bohr, thesis, 1911; van Leeuwen, *J. Phys. Radium* 2, 361, 1921).

[^units]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:thermal-moment). Units, for quadratic $h$ and $g$ in square metres: on the left, a moment's rate is
    in $\mathrm{kg\,m^2\,s^{-1}}$, so the product is in $\mathrm{kg^2\,m^4\,s^{-2}}$; on the right,
    $\mathrm{J} \times \mathrm{kg\,m^{-3}} \times \mathrm{m^2} \times \mathrm{m^3}$ is the same.

[^jitter]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV; Appendix A bounds the quantum form of
    the rule, as its equation [](/paper/#eq:jitter-bounds).

[^multipole]: The sum over degrees is the equation [](/paper/#eq:thermal-multipole) of *The gravitational camera*
    (Mohsenvand 2026), Sec. IV.

[^bath]: This needs a body that trades momentum with its surroundings, as a ball on a table does.

[^brown]: The grains themselves, about 100 µm across, hardly move. See P. Pearle et al., "What Brown saw and you can
    too", *Am. J. Phys.* 78, 1278 (2010).
