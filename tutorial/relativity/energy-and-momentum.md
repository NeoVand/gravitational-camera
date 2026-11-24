---
id: '6.4'
title: 'Energy and momentum; the weight of heat; light-cone coordinates'
question: 'The paper says that a hot and a cold furnace weigh the same "to within the mass of their heat", and that a tide''s kick can be read by weighing the body afterwards, because "energy has weight". Why does energy have weight, and how much does a body gain?'
part: '6'
requires: ['1.6', '1.7', '6.1', '6.2']
paper: [sec:thermal, fig:closed-furnace, sec:second-order, eq:push, eq:shock, eq:shock-even, app:proofs, eq:proof-shock, eq:proof-mass, sec:vistas, sec:status]
figures: [fig:closed-furnace]
live: [mass-shell]
depth: A
---

The paper's [Section VI](/paper/#sec:thermal) sets two closed steel furnaces side by side. Each holds the same block of
iron, one at room temperature, 293 K, and the other at 1500 K. The paper says that the two look the same and that, "to
within the mass of their heat ($\Delta U/c^2$, about $10^{-11}\,\mathrm{kg}$ per megajoule)", they weigh the same.

{{paper fig:closed-furnace}}

Much later, in [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing), the paper gives a
body a brief kick with a tide and then reads what the kick did by weighing the body. Its reason fits in three words,
"Energy has weight", and it adds that "the mass that the monopole of the body's field reports rises by $\Delta E/c^2$".
The monopole is the part of a body's field that falls off as $1/r^2$ far away: the pull of its total mass, as if the
mass sat at one point (chapter
[2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)).

So we ask why energy has weight, and how much a body gains. We build the four-momentum that chapter
[6.2](/tutorial/relativity/spacetime-vectors/#what-an-observer-measures-is-a-contraction-with-its-own-four-velocity)
assumed, find from it that a body's mass at rest is its whole energy over $c^2$, and then follow the paper's Appendix C,
which weighs a body that a wave has crossed in light-cone coordinates.

::: plain
A moving body has an energy and a momentum. In relativity these are the four parts of one arrow in spacetime, in the
same way that a time and a place are. Every observer finds the same length for that arrow, and the length is the body's
mass.

Energy is kept in every collision because momentum is kept in every frame. A body at rest has a mass equal to all the
energy inside it divided by the square of the speed of light. So a hot body is heavier than the same body cold. The
difference is tiny: a megajoule of heat weighs about a hundredth of a microgram.

Light has energy but no mass of its own. Two flashes that travel in opposite directions do have a mass together.

Along one line it helps to measure time and distance on two diagonals, $ct - z$ and $ct + z$, which a change of observer
stretches and squeezes. The paper uses them to find the energy and the mass that a sudden gravitational wave gives a
body.
:::

## Momentum and energy are the parts of one four-vector

We want a four-vector for a body's momentum, because a four-vector changes from one observer to another by the one table
$\Lambda^\mu{}_\nu$ of chapter [6.2](/tutorial/relativity/spacetime-vectors/#an-event-is-a-vector-of-four-components).
That chapter built the four-velocity, $\obs u^\mu = \obs\gamma(c, \obs{\vect v})$, whose squared length is $\obs
u\cdot\obs u = -c^2$ for every body. We multiply it by a number $\sym{rest-mass}{\matter m}$, in kilograms, that belongs
to the body alone and is the same for every observer. The product is the body's **four-momentum**, in
$\mathrm{kg\,m\,s^{-1}}$, and we name its time part and its space part:

$$\sym{four-momentum}{p^\mu} = \matter m\,\obs u^\mu = \Bigl(\frac{E}{c},\, \vect p\Bigr),$$

$$\sym{energy}{E} = \obs\gamma\matter mc^2, \qquad \sym{momentum}{\vect p} = \obs\gamma\matter m\obs{\vect v} .$$

It is a four-vector, because $\obs u^\mu$ is one. Here $E$ is the body's **energy**, in joules, and $\vect p$ its
momentum.[^letters] At rest $\obs\gamma = 1$ and $E = \matter mc^2$, so the **rest mass** $\matter m$ is the energy a
body has at rest, divided by $c^2$. For a slow body $\vect p \approx \matter m\obs{\vect v}$, the momentum of chapter
[1.6](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel), so the rest mass is also the
mass that resists a gentle push. Whether gravity pulls on the same mass is the fourth section's question. A
non-example: Newton's list $(\matter mc, \matter m\obs{\vect v})$ is not a four-vector, because its squared length,
$-\matter m^2c^2 + \matter m^2\obs v^2$, depends on the speed.

**The mass shell.** From $p^\mu = \matter m\obs u^\mu$, $p\cdot p = \matter m^2\,\obs u\cdot\obs u = -\matter m^2c^2$.
From the components, with chapter 6.2's dot product, $p\cdot p = -E^2/c^2 + |\vect p|^2$. We set the two equal and
multiply by $-c^2$:

$$\boxed{\;E^2 = |\vect p|^2c^2 + \matter m^2c^4\;} \label{eq:shell}$$

Each term is the square of an energy, in $\mathrm{J^2}$. Every body of rest mass $\matter m$ satisfies [](#eq:shell)
at every speed and for every observer, so all observers compute the same rest mass. Plotted as $E$ against $|\vect
p|c$, the allowed points lie on one branch of a hyperbola (Figure [](#fig:mass-shell)), and in the four dimensions of
$(E/c, \vect p)$ they form a surface called the **mass shell**.

![Look first at the two dots: a body at rest and the same body at $0.6c$ lie on one hyperbola, $E^2 - |\vect
p|^2c^2 = \matter m^2c^4$, and $1.25^2 - 0.75^2 = 1$. Light, with no rest mass, lies on the dashed lines, which the
hyperbola approaches but never reaches.](tut-momentum-shell){#fig:mass-shell}

**A number.** The particle of chapter 6.2 moves at $0.6c$, so $\obs\gamma = 1.25$ and $\obs\gamma\obs\beta = 0.75$.
Then $E = 1.25\,\matter mc^2$ and $|\vect p|c = 0.75\,\matter mc^2$, and $1.25^2 - 0.75^2 = 1.5625 - 0.5625 = 1$, as
[](#eq:shell) requires. An observer who moves with the particle measures $E = \matter mc^2$.[^observer]

**The slow limit.** The binomial series $(1 - x)^{-1/2} = 1 + \tfrac12x + \tfrac38x^2 + \dots$, with $x =
\obs\beta^2$, gives

$$E = \matter mc^2 + \tfrac12\matter m\obs v^2 + \tfrac38\matter m\frac{\obs v^4}{c^2} + \dots$$

The second term is chapter 1.6's kinetic energy. The first stays when the body is at rest, and it is called the body's
**rest energy**. The third, the first correction to Newton, is smaller than the second by $\tfrac34\obs\beta^2$, which
is $7.5\times10^{-15}$ for a car at $30\unit{m\,s^{-1}}$. The energy of motion is $E - \matter mc^2 = (\obs\gamma -
1)\matter mc^2$: at $0.6c$ it is $0.25\,\matter mc^2$, and Newton's $\tfrac12\matter m\obs v^2$ gives $0.18\,\matter
mc^2$, 28 per cent less.

So momentum and energy are the space and time parts of one four-vector, whose length is the rest mass times $c$.

## If momentum is kept in every frame, so is energy

We want to know why $E/c$ deserves the name of an energy, and the answer is a law of collisions. We take bodies that
move freely, collide, and move freely again, with nothing outside pushing them, and we assume:

**In such a collision the total momentum $\sum_a\obs\gamma_a\matter m_a\obs{\vect v}_a$ after equals the total before,
in every inertial frame.**

Here $a$ labels the bodies, whose rest masses may change: two lumps may stick, or a nucleus may split. For slow bodies
this is chapter 1.6's conservation of momentum. For fast ones it is what accelerators measure, from the bending of
particle tracks in a magnetic field, when each momentum is counted as $\obs\gamma\matter m\obs{\vect v}$.

The total four-momentum $\sym{total-four-momentum}{P^\mu} = \sum_a p_a^\mu$, in $\mathrm{kg\,m\,s^{-1}}$, is a sum of
four-vectors, and so is its change in the collision, $\Delta P^\mu$. For an observer moving at $\obs\beta c$ along
$x$, row 1 of chapter [6.2](/tutorial/relativity/spacetime-vectors/#an-event-is-a-vector-of-four-components)'s boost
table gives

$$\Delta P'^x = \obs\gamma\,(\Delta P^x - \obs\beta\,\Delta P^0) .$$

The assumption makes both $\Delta P^x$ and $\Delta P'^x$ zero. So $\obs\gamma\obs\beta\,\Delta P^0 = 0$, and since
$\obs\beta$ is not zero, the time component of the total, $\sum_aE_a/c$, does not change:

$$\boxed{\;\sum_a E_a\Big|_{\rm after} = \sum_a E_a\Big|_{\rm before}, \qquad \Delta P^\mu = 0\;} \label{eq:conserved}$$

This is the **conservation of four-momentum**. The energy kept is the whole of each $E_a = \obs\gamma_a\matter m_ac^2$,
rest energy included, and neither the rest masses nor the energies of motion need to be kept separately.

::: example
### Two lumps that stick

Two lumps of clay, each of rest mass $\matter m$, fly at each other at $\pm0.6c$ and stick. Before the collision the
total momentum is zero, and the total energy is $2 \times 1.25\,\matter mc^2 = 2.5\,\matter mc^2$. After it there is one
lump at rest, with the energy $\matter Mc^2$, where $\matter M$ is its rest mass. By [](#eq:conserved),

$$\boxed{\;\matter M = 2.5\,\matter m\;} .$$

The new lump has more mass than the two lumps had, by $0.5\,\matter m$, the lost energy of motion $2 \times
0.25\,\matter mc^2$ divided by $c^2$. Newton's mechanics keeps mass by a law of its own, so for it this gain of 25 per
cent is impossible. Counting the lost energy with Newton's $\tfrac12\matter m\obs v^2$ would give a gain of only
$0.36\,\matter m$, because that formula is the first term of the series above.

The energy of motion is now heat, the random motion of the lump's molecules, and the lump weighs more because it is hot
(Figure [](#fig:lumps-stick)).
:::

![Look first at the dotted line at 2.5: the total energy is the same before and after. The energy of motion of the
two lumps becomes part of the rest energy of the one, so the lump at rest has the mass $2.5\,\matter m$, not
$2\,\matter m$. The bars are to scale; the lumps are not.](tut-momentum-lumps){#fig:lumps-stick}

## A body's mass is its total energy, so heat has weight

We want the mass of a body made of many parts, such as a hot block of iron. We define the **mass of a system**,
$\sym{system-mass}{\matter M}$, in kilograms, from its total four-momentum as [](#eq:shell) gives $\matter m$ for one
body:

$$\boxed{\;\matter M^2c^2 = -P\cdot P = \Bigl(\sum_a\frac{E_a}{c}\Bigr)^2 - \Bigl|\sum_a\vect p_a\Bigr|^2\;} \label{eq:system-mass}$$

It is also called the invariant mass, because $P\cdot P$ is the same for every observer. A lump that we treat as one
particle is such a system, and its $\matter M$ is its rest mass.

In the system's rest frame, where $\sum_a\vect p_a = 0$, [](#eq:system-mass) becomes $\matter Mc^2 = \sum_aE_a$, so

$$\matter M = \sum_a\matter m_a + \frac{1}{c^2}\sum_a\bigl(E_a - \matter m_ac^2\bigr) .$$

The energy of the bonds between the parts counts as well. This we state without proof, because it needs the energy of
the fields between the parts (chapters [6.5](/tutorial/relativity/stress-energy/) and
[6.6](/tutorial/relativity/maxwell-complex/#the-energy-of-the-field-and-its-flow-are-two-products-of-the-complex-field)).
Bonds have negative energy, so a bound body is lighter than its parts pulled apart, and the energy needed to pull it
apart is its **binding energy**.

**The weight of heat.** We heat a body at rest without moving it: a flame, a current, or two equal beams of light from
opposite sides add the energy $\Delta U$, in joules, to the random motion and the bonds of its atoms, its **internal
energy**, and bring no net momentum. Its total energy grows by $\Delta U$, so its mass grows by

$$\boxed{\;\Delta\matter M = \frac{\Delta U}{c^2}\;} \label{eq:heat}$$

kilograms, since a joule over $\mathrm{m^2\,s^{-2}}$ is a kilogram. This is the **weight of heat**, and of every other
energy stored in a body at rest.

- *A megajoule.* $10^6\unit{J}/(2.998\times10^8\unit{m\,s^{-1}})^2 = 1.11\times10^{-11}\unit{kg}$, the paper's "about
  $10^{-11}\,\mathrm{kg}$ per megajoule", for which it cites R. C. Tolman's paper of 1930 on the weight of heat.
- *The furnace.* The paper names no mass of iron, so take a kilogram, $17.9$ moles. The measured heat that warms it
  from 293 K to 1500 K is $0.82\unit{MJ}$ (the NIST-JANAF tables), under a megajoule.[^dulong] The hot block is
  heavier by $9.1\times10^{-12}\unit{kg}$, less than one part in $10^{11}$ of its kilogram.
- *An exploding star.* The paper's [*An exploding star*](/paper/#par:an-exploding-star) says that a core collapse
  sends out some $3\times10^{46}\unit{J}$ in neutrinos. Over $c^2$ this is $3.3\times10^{29}\unit{kg}$, $0.168$ of the
  Sun's $1.99\times10^{30}\unit{kg}$: the paper's "a sixth of a solar mass". The neutrinos leave as a thin shell. A
  camera outside the shell feels the pull of the whole star, and after the shell passes, the pull of what is left. So
  the drop in the pull is the mass of the burst: the camera "weighs the burst as it arrives".

**A limit.** When the parts of a body are at rest relative to each other, $\matter M = \sum_a\matter m_a - B/c^2$, with
$B$ the binding energy. A deuteron, the nucleus of heavy hydrogen, is a proton, of mass
$1.67262\times10^{-27}\unit{kg}$, bound to a neutron, of mass $1.67493\times10^{-27}\unit{kg}$. Its own mass,
$3.34358\times10^{-27}\unit{kg}$, is less than theirs by $3.97\times10^{-30}\unit{kg}$, or 0.12 per cent. Times $c^2$
this is $2.22\unit{MeV}$ ($1\unit{MeV} = 1.602\times10^{-13}\unit{J}$), the measured binding energy.

## Gravity weighs the rest mass, so a weighing reads the energy

The word "weight" now has two meanings. The first is the rest mass we derived, which also measures inertia. The second
is the mass that gravity sees: the strength of the body's field far away, which Gauss's law ties to the mass inside a
closed surface (chapter
[1.3](/tutorial/newton/gauss-and-poisson/#the-flux-out-of-a-closed-surface-counts-the-mass-inside)), and the pull the
body feels in the field of another. That the two are equal we state without proof.[^plausible]

**Stated.** An isolated body at rest, whose inside is steady and whose own gravity is weak, has far away the field of a
point of mass $\matter M = E/c^2$, its rest mass, whatever its energy is made of: rest masses, heat, bonds or trapped
light.

One check is possible now: when the parts move slowly and their bonds are weak, $E/c^2$ is the sum of the rest masses,
Newton's mass, as it must be.

**The paper's weighing.** Chapter
[1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass) kicked a body with
an impulsive tide: masses outside make, for one instant, the potential $-\epsilon g(\vect x)\delta(t)$, in joules per
kilogram. Here $\delta(t)$ is a spike at $t = 0$, in $\mathrm{s^{-1}}$, zero at every other time, with
$\int\delta(t)\,\dd t = 1$ (chapter
[1.3](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point)). The function $g(\vect x)$
gives the tide its shape and the number $\epsilon$ its strength, with $\epsilon g$ in $\mathrm{m^2\,s^{-1}}$, so that
$\epsilon\nabla g$ is a velocity. Each part of mass $\matter m$ receives the impulse $\epsilon\matter m\nabla g$, and
the body gains the energy of the paper's equation

{{paper eq:push}}

in which $\dot Q_g$ is the rate at which the moment of the mass against $g$ changes, and $\matter\rho$ is the density.
By the stated result, the mass that the monopole reports rises by $\Delta E/c^2$. If every part gains the same velocity
$\Delta\obs v$ from rest, the weight rises by the fraction

$$\frac{\Delta E}{\matter Mc^2} = \frac{\tfrac12\matter M\Delta\obs v^2}{\matter Mc^2} = \frac12\Bigl(\frac{\Delta\obs
v}{c}\Bigr)^2 .$$

In the paper's scene (chapter 1.7) a tonne passes a steel ball at $44\unit{km\,s^{-1}}$, one metre from its edge, and
pulls the nearest part with $6.7\times10^{-8}\unit{m\,s^{-2}}$ for about $45\unit{\mu s}$. So $\Delta\obs v =
3\times10^{-12}\unit{m\,s^{-1}}$, and the fraction is $\tfrac12(3\times10^{-12}/2.998\times10^8)^2 = 5.0\times10^{-41}$,
the paper's "five parts in $10^{41}$". Most of it is the recoil of the whole ball. The tide alone gives the edge
$6.7\times10^{-13}\unit{m\,s^{-1}}$, and the share that depends on the inside, two fifths of
$\tfrac12(6.7\times10^{-13}/2.998\times10^8)^2$, is $1.0\times10^{-42}$. The furnace's heat added $9\times10^{-12}$ of
its mass, some thirty orders of magnitude more.

In the paper's words, "Only the weight has been read, the one number that Gauss's law carries to any
distance." Everything the kick did inside enters it through the total energy alone.

## Light has no rest mass, but two beams of light have one

We want the four-momentum of light, because the paper's waves and its particle without mass travel at $c$. Dividing
$\vect p$ by $E$ gives the velocity, $\obs{\vect v} = \vect pc^2/E$. By [](#eq:shell), $|\vect p|c < E$ whenever
$\matter m > 0$, so every body with a rest mass moves slower than light. A speed of $c$ therefore needs $|\vect p|c =
E$, which gives

$$\matter m = 0, \qquad E = |\vect p|c, \qquad p\cdot p = 0 .$$

So a flash of energy $E$ carries the momentum $E/c$ along its direction, and its four-momentum is a null vector (chapter
[6.2](/tutorial/relativity/spacetime-vectors/#the-minkowski-metric-measures-the-interval-with-one-minus-sign-for-time)).
A system of light can still have a mass. Two flashes of energy $E$ travelling in opposite directions have the total
momentum zero and the total energy $2E$, so [](#eq:system-mass) gives $\matter M = 2E/c^2$: $2.2\times10^{-17}\unit{kg}$
for two flashes of a joule. A single beam has $\matter M = 0$. So "the mass of light" depends on what is added up.

## Along one line, light-cone coordinates turn a boost into a stretch

We want coordinates suited to motion along one line, because the paper's Appendix C follows a wave that travels along
$z$ and crosses a body. Its letters there have other meanings elsewhere.[^cone-letters] The **light-cone coordinates**
of an event are

$$\sym{light-cone-u}{u} = ct - z, \qquad \sym{light-cone-v}{v} = ct + z ,$$

both in metres. A flash moving along $+z$ has $z = ct + \text{constant}$, so it keeps its $u$: a surface of constant
$u$ is the front of a wave moving along $+z$, and the paper's wave is the front $u = 0$. A flash moving along $-z$
keeps its $v$.

**The interval.** With $c\,\dd t = \tfrac12(\dd u + \dd v)$ and $\dd z = \tfrac12(\dd v - \dd u)$, the squares $\dd
u^2$ and $\dd v^2$ cancel:

$$-c^2\dd t^2 + \dd z^2 = -\tfrac14(\dd u + \dd v)^2 + \tfrac14(\dd v - \dd u)^2 ,$$

so

$$\boxed{\;-c^2\dd t^2 + \dd z^2 = -\dd u\,\dd v\;} \label{eq:lc-metric}$$

With the two directions across $z$, $\vect x_\perp = (x, y)$, this is the paper's metric of Appendix C, $\dd s^2 =
-\dd u\,\dd v + H\,\delta(u)\,\dd u^2 + \dd\vect x_\perp^2$, without its wave term. In that term $\delta(u)$ is the
spike of chapter 1.3 in the variable $u$, in $\mathrm{m^{-1}}$, zero except on the front, with $\int\delta(u)\,\dd u =
1$. So the wave is an impulse, a wave of zero thickness whose total strength is fixed, and its profile $H(\vect
x_\perp)$, in metres, gives that strength at each place on the front. The metric solves Einstein's equations in empty
space when $H$ is **harmonic** across the front, which means $\partial^2H/\partial x^2 + \partial^2H/\partial y^2 = 0$.

**A boost is a stretch.** Chapter 6.1's boost along $z$ with rapidity $\obs\eta$ is $ct' = \cosh\obs\eta\,ct -
\sinh\obs\eta\,z$ and $z' = \cosh\obs\eta\,z - \sinh\obs\eta\,ct$. We subtract and add the two, with $\cosh\obs\eta \pm
\sinh\obs\eta = e^{\pm\obs\eta}$ (chapter [6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not)):

$$\boxed{\;u' = e^{\obs\eta}\,u, \qquad v' = e^{-\obs\eta}\,v\;} \label{eq:lc-boost}$$

A boost stretches one light-cone coordinate and squeezes the other by the same factor, so $uv = c^2t^2 - z^2$ is kept.
Two boosts multiply the stretches, which is why rapidities along one line add.

**Momentum in light-cone form.** The pair $(E/c, p_z)$ changes under a boost along $z$ as $(ct, z)$ does. So the
**light-cone components** of the momentum,

$$\sym{light-cone-q}{q} = \frac{E}{c} - p_z \qquad\text{and}\qquad \frac{E}{c} + p_z ,$$

both in $\mathrm{kg\,m\,s^{-1}}$, are multiplied by $e^{\obs\eta}$ and $e^{-\obs\eta}$. Dividing [](#eq:shell) by $c^2$
and moving $p_z^2$ to the left gives their product:

$$\boxed{\;\Bigl(\frac{E}{c} - p_z\Bigr)\Bigl(\frac{E}{c} + p_z\Bigr) = \matter m^2c^2 + p_\perp^2\;} \label{eq:lc-product}$$

Here $\sym{transverse-momentum}{\vect p_\perp} = (p_x, p_y)$ is the momentum across $z$, which a boost along $z$ does
not change, and $p_\perp^2$ its square. The paper writes this identity in Appendix C, and its
[Section XIII](/paper/#sec:second-order) writes $E - cp_z$, which is $cq$, in joules.

**A number.** A body moving along $+z$ with rapidity $\obs\eta$ has $E/c = \matter mc\cosh\obs\eta$ and $p_z = \matter
mc\sinh\obs\eta$, so

$$q = \matter mc\,e^{-\obs\eta}, \qquad \frac{E}{c} + p_z = \matter mc\,e^{\obs\eta} .$$

The sign is the opposite of [](#eq:lc-boost)'s because the direction is: there we go from the room to an observer moving
at $+\obs\eta$, here from the body's own frame, where $q = \matter mc$, to the room, which moves at $-\obs\eta$ relative
to the body. At $0.6c$, $\obs\eta = \ln 2$, so $E/c + p_z = (1.25 + 0.75)\,\matter mc = 2\,\matter mc$ and $q =
0.5\,\matter mc$, the factors 2 and $\tfrac12$, with the product $\matter m^2c^2$.

**The cases.** For slow matter $q \approx \matter mc$. For light moving along $+z$, $q = 0$; along $-z$, $q = 2E/c$
(Figure [](#fig:light-cone-components)).
Every other body has $q > 0$, because $E/c \ge |\vect p| \ge p_z$, with both equalities only for light along $+z$. So
$q$ measures how far a body lags behind a front moving along $+z$: for a given energy it is zero for light riding with
the front and largest for light running against it.

![Look first at the two dotted lines from the dot at $0.6c$: a boost along $z$ doubles one light-cone component and
halves the other, so the dot slides along the hyperbola $q(E/c + p_z) = \matter m^2c^2$. Light along $+z$ lies on the
axis $q = 0$.](tut-momentum-lightcone){#fig:light-cone-components}

## A sideways kick that keeps q fixes the energy gained

We want the energy a body gains when its momentum across $z$ changes by $\Delta\vect p_\perp$, because that is what
the paper's wave does. We assume that **the kick keeps $q$ and the rest mass $\matter m$**. That an impulsive plane
wave moving along $+z$ does this to a free particle we state without proof; chapter 13.5 derives it.

Adding $q$ to the other component, $(\matter m^2c^2 + p_\perp^2)/q$ by [](#eq:lc-product), gives $2E/c$, so

$$E = \frac c2\Bigl(q + \frac{\matter m^2c^2 + p_\perp^2}{q}\Bigr) .$$

With $q$ and $\matter m$ fixed, only $p_\perp^2$ changes:

$$\boxed{\;\Delta E = \frac{c}{2q}\Bigl(\bigl|\vect p_\perp + \Delta\vect p_\perp\bigr|^2 - p_\perp^2\Bigr)\;} \label{eq:kick}$$

The unit is $\mathrm{m\,s^{-1}}$ times a momentum, a joule. Because $q$ is kept, $p_z$ grows by $\Delta E/c$ too.

**The wave's kick.** We state a second result without proof, also derived in chapter 13.5: an impulsive plane wave of
profile $\sym{wave-profile}{H}(\vect x_\perp)$ gives the particle at $\vect x_\perp$ the momentum $\Delta\vect p_\perp
= \tfrac12q\nabla H$, where $\nabla H$, the gradient across the front, is a pure number. Put into [](#eq:kick), this
gives the paper's equation of Appendix C,

{{paper eq:proof-shock}}

and expanding the square and using $cq = E - cp_z$ gives Section XIII's form:

{{paper eq:shock}}

It holds "at any speed, light included", except for light moving along $+z$, which has $q = 0$. The first term has
either sign, so a body can gain or lose energy. A body that crosses the front head-on, with $\vect p_\perp = 0$, gains
$\tfrac18cq|\nabla H|^2$, and a body moving with the wave, with a small $q$, gains less.

**The slow limit.** For slow matter $q \approx \matter mc$, and [](#eq:kick) becomes

$$\begin{aligned}
\Delta E &\approx \frac{1}{2\matter m}\bigl(2\,\vect p_\perp\cdot\Delta\vect p_\perp + |\Delta\vect p_\perp|^2\bigr)\\
&= \obs{\vect v}_\perp\cdot\Delta\vect p_\perp + \frac{|\Delta\vect p_\perp|^2}{2\matter m} ,
\end{aligned}$$

the rule of chapter [1.7](/tutorial/newton/hamilton/#a-sudden-kick-changes-the-kinetic-energy-in-two-parts),
$\Delta K = \obs{\vect v}\cdot\vect J + J^2/2\matter m$, with the impulse $\vect J = \Delta\vect p_\perp$. The wave's
kick, $\tfrac12\matter mc\nabla H$, gives every slow part the velocity $\tfrac12c\nabla H$ whatever its mass, as the
impulsive tide of the paper's [](/paper/#eq:push) does with $\epsilon\nabla g$. This is why the paper calls Section
XIII's equation the impulsive tide "without the restriction to slow matter".

Reversing $H$ reverses the first term of the paper's [](/paper/#eq:shock) and keeps the second, so a wave and its
reverse together always give energy: summed over a body, this is the paper's [](/paper/#eq:shock-even), in which
$\mathcal N$ is the energy, less $c$ times the momentum along $z$, that crosses each point of the front (chapter
[6.5](/tutorial/relativity/stress-energy/#along-a-ray-of-light-the-table-gives-the-energy-less-c-times-the-momentum)
builds it).

## A body's rest mass in light-cone form is a sum and a weighted variance

We want the rest mass of a body after a wave has crossed it, because the paper's reading is a weighing. The paper
writes it $\matter{\mathcal M}$, the $\matter M$ of [](#eq:system-mass). For the particles $a$ of a body we write $q_a$
for each one's light-cone component and $\sym{light-cone-total}{Q} = \sum_aq_a$ for their total, in
$\mathrm{kg\,m\,s^{-1}}$.

**A weighted variance.** We assume that **no part of the body is light moving along $+z$**, so that every $q_a > 0$.
The numbers $w_a = q_a/Q$ are then positive and add up to 1, so they can serve as weights, as probabilities do. The
weighted mean of $\vect x_a$ is $\langle\vect x\rangle = \sum_aw_a\vect x_a$, and its weighted variance is

$$\mathrm{Var}(\vect x) = \langle|\vect x|^2\rangle - |\langle\vect x\rangle|^2 = \bigl\langle|\vect x - \langle\vect
x\rangle|^2\bigr\rangle ,$$

the mean square distance from the mean: never negative, and zero only when every $\vect x_a$ is the same.

**The derivation.** We split $|\sum_a\vect p_a|^2$ in [](#eq:system-mass) into its parts along and across $z$, factor
the difference of squares $(\sum_aE_a/c)^2 - (\sum_ap_{za})^2$, use [](#eq:lc-product) for each particle, and collect a
weighted variance of $\vect x_a = \vect p_{\perp a}/q_a$, the sideways momentum per unit of $q$ (the box gives the
steps):

$$\boxed{\;\matter{\mathcal M}^2c^2 = Q\sum_a\frac{\matter m_a^2c^2}{q_a} + Q^2\,\mathrm{Var}\Bigl(\frac{\vect
p_\perp}{q}\Bigr)\;} \label{eq:mass-lc}$$

::: derivation
### The weighted variance in the rest mass

The difference of squares has the factor $\sum_a(E_a/c - p_{za}) = Q$, so

$$\begin{aligned}
\matter{\mathcal M}^2c^2 &= Q\sum_a\Bigl(\frac{E_a}{c} + p_{za}\Bigr) - \Bigl|\sum_a\vect p_{\perp a}\Bigr|^2\\
&= Q\sum_a\frac{\matter m_a^2c^2}{q_a} + Q\sum_a\frac{p_{\perp a}^2}{q_a} - \Bigl|\sum_a\vect p_{\perp a}\Bigr|^2 ,
\end{aligned}$$

the second line by [](#eq:lc-product). With $w_a = q_a/Q$ and $\vect x_a = \vect p_{\perp a}/q_a$, $\langle\vect
x\rangle = \sum_a\vect p_{\perp a}/Q$ and $\langle|\vect x|^2\rangle = \sum_a(p_{\perp a}^2/q_a)/Q$. So

$$Q^2\,\mathrm{Var}(\vect x) = Q\sum_a\frac{p_{\perp a}^2}{q_a} - \Bigl|\sum_a\vect p_{\perp a}\Bigr|^2 ,$$

which is the last two terms.
:::

The first line of the box and [](#eq:mass-lc) are the two lines of the paper's equation:

{{paper eq:proof-mass}}

The second term, the spread of the sideways motion, is a squared momentum, as the first is.

**What a wave does to the rest mass.** The wave keeps every $q_a$ and $\matter m_a$, so it leaves $Q$ and the first
term alone, and it adds $\vect y_a = \tfrac12\nabla H$ to each $\vect x_a$, with $\nabla H$ taken at that particle.
For a sum, $\mathrm{Var}(\vect x + \vect y) = \mathrm{Var}(\vect x) + 2\,\mathrm{Cov}(\vect x, \vect y) +
\mathrm{Var}(\vect y)$, where the covariance $\mathrm{Cov}(\vect x, \vect y) = \langle\vect x\cdot\vect y\rangle -
\langle\vect x\rangle\cdot\langle\vect y\rangle$ changes sign with $\vect y$. Let $\matter{\mathcal M}_+$ be the mass
after the wave, $\matter{\mathcal M}_-$ after its reverse, with $-\tfrac12\nabla H$, and $\matter{\mathcal M}_0$
without a wave. Adding the first two and subtracting twice the third cancels the covariances, so

$$\boxed{\;\matter{\mathcal M}_+^2 + \matter{\mathcal M}_-^2 - 2\matter{\mathcal M}_0^2 = \frac{Q^2\,\mathrm{Var}(\nabla
H)}{2c^2} \ge 0\;} \label{eq:even-mass}$$

as the paper states. This is a bound, and its right side is zero only when $\nabla H$ is the same at every particle:
such a wave moves the body as a whole without heating it. One wave alone can lower the mass, because the covariance
can be negative, but the wave and its reverse together can only raise it.

::: example
### The pair that a wave stops

The paper's example takes two lumps of rest mass $\matter m$ flying apart across $z$, each with $|\vect p_\perp| =
\tfrac34\matter mc$ and $p_z = 0$: the lumps of the second section run backwards. Each has $E = 1.25\,\matter mc^2$,
so $q = 1.25\,\matter mc$ and $Q = 2.5\,\matter mc$. The values of $\vect p_\perp/q$ are $\pm0.6$, with mean zero and
variance $0.36$, so [](#eq:mass-lc) gives

$$\begin{aligned}
\matter{\mathcal M}_0^2c^2 &= 2.5 \times 2 \times \frac{\matter m^2c^2}{1.25} + 6.25 \times 0.36\,\matter m^2c^2\\
&= (4 + 2.25)\,\matter m^2c^2 ,
\end{aligned}$$

so $\matter{\mathcal M}_0 = 2.5\,\matter m$, as the stuck lump had. The wave with $\nabla H = -2\vect p_\perp/q$ at each
lump, that is $\mp1.2$, gives each the kick $\tfrac12q\nabla H = -\vect p_\perp$ and stops their motion apart. The
variance is now zero, and

$$\matter{\mathcal M}_+ = 2\,\matter m .$$

The reverse wave moves the values to $\pm1.2$ instead, with variance $1.44$, so $\matter{\mathcal M}_-^2 = (4 + 6.25
\times 1.44)\,\matter m^2 = 13\,\matter m^2$. The left side of [](#eq:even-mass) is $4 + 13 - 2 \times 6.25 = 4.5$, in
units of $\matter m^2$, and the right side, with the variance $1.44$ of $\nabla H = \pm1.2$, is $6.25 \times 1.44/2 =
4.5$.
:::

::: try {#mass-shell}
Two tabs. *One particle* draws the light-cone components $q$ and $E/c + p_z$ as two axes at right angles, with the mass
shell as a hyperbola between them. The rapidity slider boosts the body along $z$ and slides it along the shell; the
sliders across set its sideways momentum and the strength of a wave's kick, which keeps $q$, and the table compares
the energy gained with Newton's rule. *Two particles* holds Appendix C's pair of lumps, whose sideways momenta can be
set, with the rest mass from the sum and weighted variance beside the direct formula. *Stop them* applies the wave that
stops the lumps' motion apart, and *Reverse* its reverse.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, give
the two lumps different momenta along $z$ and check that the sum and the direct formula still agree.
:::

::: check
### Q

Why does a box of hot gas at rest weigh more than the same box cold, although its total momentum is zero in both?

### A

Its rest mass is its total energy over $c^2$, by [](#eq:system-mass) in its rest frame, and the energy of motion of the
gas molecules is part of that energy. The molecules' momenta cancel, but their energies add.

### Q

Compute both light-cone components of a body moving along $z$ at $0.8c$.

### A

At $0.8c$, $\obs\gamma = 5/3$ and $\obs\gamma\obs\beta = 4/3$, so $E/c + p_z = 3\,\matter mc$ and $q = \tfrac13\matter
mc$, the factors $\matter mc\,e^{\pm\ln 3}$, with product $\matter m^2c^2$.

:::

**The idea to keep: energy and momentum are the time and space parts of one four-vector, whose length is the rest mass.
So a body's rest mass is its total energy over $c^2$, and heat, or the energy a tide leaves, weighs $\Delta U/c^2$,
about $10^{-11}$ kg per megajoule.**

::: problems
### Practice

A kilogram of water warmed by 1 K gains 4.18 kJ. By how much does its mass grow, and how many such warmings would add
a microgram?

::: solution
By [](#eq:heat), $\Delta\matter M = 4180\unit{J}/(2.998\times10^8\unit{m\,s^{-1}})^2 = 4.65\times10^{-14}\unit{kg}$.
A microgram is $10^{-9}\unit{kg}$, so it takes $10^{-9}/4.65\times10^{-14} = 2.2\times10^4$ warmings of one kelvin,
far more heat than water can hold without boiling.
:::

### Stretch

Combine this chapter with chapter 1.6. Two lumps of rest mass $\matter m$ approach at $\pm\obs v$ and stick. Expand the
final mass to order $\obs\beta^4$, with $\obs\beta = \obs v/c$, and show that Newton's lost kinetic energy, over
$c^2$, is the first term of the gain.

::: solution
The new lump is at rest, so by [](#eq:conserved) its mass is $\matter M = 2\obs\gamma\matter m$, and the binomial
series gives

$$\matter M = 2\matter m\bigl(1 + \tfrac12\obs\beta^2 + \tfrac38\obs\beta^4 + \dots\bigr) .$$

In Newton's mechanics the lumps stop and the kinetic energy $2 \times \tfrac12\matter m\obs v^2$ becomes heat. Over
$c^2$ this is $\matter m\obs\beta^2$, the first term of the gain $\matter M - 2\matter m$. The next term,
$\tfrac34\matter m\obs\beta^4$, corrects Newton's kinetic energy.
:::

### The paper

Check the paper's example of Appendix C further. After the wave that stops the pair of the last section, find each
lump's energy and $p_z$, the velocity of the pair, and the energy the pair lost, and check the rest mass $2\,\matter m$
with [](#eq:system-mass).

::: solution
Each lump keeps $q = 1.25\,\matter mc$ and now has $p_\perp = 0$, so by [](#eq:lc-product) $E/c + p_z = \matter
m^2c^2/q = 0.8\,\matter mc$. Adding and subtracting $q$ gives $E/c = \tfrac12(1.25 + 0.8)\,\matter mc =
1.025\,\matter mc$ and $p_z = \tfrac12(0.8 - 1.25)\,\matter mc = -0.225\,\matter mc$. The two lumps move together along
$-z$ at $\obs v = p_zc^2/E = -0.22c$. Each lost $0.225\,\matter mc^2$, so the pair lost $0.45\,\matter mc^2$ to the
wave. As a check, [](#eq:system-mass) gives $\matter{\mathcal M}_+^2c^2 = (2.05^2 - 0.45^2)\,\matter m^2c^2 =
4\,\matter m^2c^2$.
:::
:::

::: paper
- [Section VI](/paper/#sec:thermal) and Figure [](/paper/#fig:closed-furnace): the two furnaces that weigh the same "to
  within the mass of their heat", $\Delta U/c^2$, computed in [the section on the weight of
  heat](#a-bodys-mass-is-its-total-energy-so-heat-has-weight).
- [Section XIII](/paper/#sec:second-order), [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing):
  the paper's [](/paper/#eq:push), "energy has weight" and the fraction $\tfrac12(\Delta v/c)^2$; and [*A mass that
  passes*](/paper/#par:a-mass-that-passes): the paper's [](/paper/#eq:shock), with its $E - cp_z$, and the paper's
  [](/paper/#eq:shock-even).
- [Appendix C](/paper/#app:proofs), [*The energy given by an impulsive
  wave*](/paper/#par:the-energy-given-by-an-impulsive-wave): the metric in $u$ and $v$, the identity of the light-cone
  components, the paper's [](/paper/#eq:proof-shock) and [](/paper/#eq:proof-mass), and the pair taken from $2.5\,m$
  to $2\,m$.
- [Section XI](/paper/#sec:vistas), [*An exploding star*](/paper/#par:an-exploding-star): a sixth of a solar mass in
  neutrinos, which a camera "weighs" as the shell passes.
- [Section XVII](/paper/#sec:status): the weighing is "exact in Newton's theory with the weight of energy added".
:::

::: deeper
- The GR course, [section 3.6](https://neovand.github.io/general-relativity/chapter-3.html#3-6-four-velocity-and-four-momentum),
  finds $E = mc^2$ as the rest-frame case of the mass shell, and
  [section 3.7](https://neovand.github.io/general-relativity/chapter-3.html#3-7-energy-is-a-measurement-made-by-an-observer)
  treats energy as a measurement an observer makes, with the exercise
  [A.3](https://neovand.github.io/general-relativity/appendix-a.html#a-3-energy-depends-on-the-observer-even-when-it-is-a-scalar).
- R. C. Tolman, "On the weight of heat and thermal equilibrium in general relativity", *Physical Review* 35, 904
  (1930): the article the paper cites, on what heat weighs in a field of gravity.
- E. F. Taylor and J. A. Wheeler, *Spacetime Physics* (2nd edition, Freeman, 1992), chapters 7 and 8: momentum and
  energy as one four-vector, which they call momenergy, the mass of a system of particles, and light as energy without
  mass.
:::

[^letters]: The letter $E$ for an energy is not the electric field $\light{\vect E}$ of light (chapter
    [6.6](/tutorial/relativity/maxwell-complex/#the-electric-and-magnetic-fields-are-defined-by-the-force-on-a-test-charge)),
    nor the tidal tensor $\curv{\tE}_{ij}$, nor the eötvös, a unit of tide. The letter $p$ alone is a pressure in the
    tutorial, so the size of the momentum is written $|\vect p|$, and $p^\mu$ always carries its index; so does the
    total four-momentum $P^\mu$ of the next section, because a bare $P$ is a power.

[^observer]: This is chapter 6.2's rule $E = -p_\mu\obs u^\mu$, the energy that an observer of four-velocity $\obs u^\mu$
    measures: $1.25\,\matter mc^2$ for the room and $\matter mc^2$ for an observer moving with the particle.

[^dulong]: A rough estimate: heat gives each atom of a solid $3\kB T$, with $T$ the temperature in kelvin and $\kB =
    1.38\times10^{-23}\unit{J\,K^{-1}}$ Boltzmann's constant (chapter
    [4.2](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share)), so a mole
    needs $3R = 24.9\unit{J\,K^{-1}\,mol^{-1}}$, with $R$ the gas constant (Dulong and Petit's rule). The warming then
    takes $17.9 \times 24.9 \times 1207\unit{J} = 0.54\unit{MJ}$. Iron's measured heat capacity rises well above $3R$ on
    the way up.

[^plausible]: Two facts make it plausible. First, bodies of every composition fall alike (chapter
    [7.1](/tutorial/geometry/metric/#falling-cancels-gravity-at-a-point-and-only-there)). The binding energy of the
    nuclei is a share of the rest mass that differs by $8.6\times10^{-4}$ between titanium and platinum, and the
    MICROSCOPE satellite found that the two fall alike to about three parts in $10^{15}$, $[-1.5 \pm 2.3 \pm
    1.5]\times10^{-15}$ (P. Touboul and colleagues, *Physical Review Letters* 129, 121102, 2022). If only the nuclear
    binding energy could fall differently, and its strong and electric parts do not cancel, it falls as the rest mass
    does to $3\times10^{-15}/8.6\times10^{-4}$, a few parts in $10^{12}$. Second, pressure is a source of gravity in
    relativity, but chapter [6.5](/tutorial/relativity/stress-energy/#the-stresses-of-a-body-at-rest-add-up-to-zero)
    proves that in a steady body at rest the pressures and tensions add up to zero, so they add nothing to its weight.

[^cone-letters]: The paper's letters in Appendix C, kept here: $u = ct - z$ is not the four-velocity $\obs u^\mu$, nor the
    retarded time $u = t - r/c$ of the paper's Sections V and XI; $v = ct + z$ is not a speed; $q = E/c - p_z$ is not
    chapter 3.7's $q = kz$, the asymmetry $q$ of a burst in Section XI, nor the trial amplitude $q$ of Appendix A;
    $Q = \sum_aq_a$ is not a moment $Q_h$, the complex quadrupole $Q_c$, a black hole's $Q_{ij}$, nor a quality factor;
    and the profile $H$ is not a Hamiltonian (chapter 1.7's, or the one Appendix C uses elsewhere), chapter 3.5's
    Wiener filter, nor the bits $H$ of Section XII.
