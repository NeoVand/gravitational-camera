---
id: '4.4'
title: 'Viscosity and relaxation; the Maxwell model'
question: 'Honey is far more viscous than water. How can the more viscous liquid have less friction at the frequencies of heat?'
part: '4'
requires: ['1.5b', '4.1', '4.3']
paper: [sec:thermal, eq:maxwell, eq:friction-sum, eq:damped, eq:alpha, fig:materials, tab:materials]
figures: [fig:materials]
live: [maxwell-liquid]
depth: A
---

A gravitational wave that crosses matter shears it, and the matter's internal friction turns a little of the wave's
energy into heat. By Kirchhoff's law, the same friction makes warm matter glow
([section 0.3](/tutorial/evening/waves-and-heat/#matter-is-transparent-so-warm-matter-glows-throughout)). The everyday
name for this friction is **viscosity**: honey has a high one and water a low one. Yet the friction that matters is the
one at the angular frequency $\omega$ of the wave, and for a liquid whose stresses relax in a time $\tau$ it is

$$\mathrm{Re}\,\matter\eta(\omega) = \frac{\matter\eta_0}{1 + \omega^2\tau^2} ,$$

where $\matter\eta_0$ is the viscosity we feel when we stir and $\tau$ is a time that belongs to the liquid. At a given
stiffness, then, the more viscous liquid glows the less. How can that be? We define viscosity, build the model behind
this formula, and apply it to a metal's electrons and to a solid's sound.[^letters][^p]

::: plain
A liquid resists being stirred. The faster one layer slides over the next, the harder the liquid pushes back. This
resistance is its **viscosity**, and the work spent against it becomes heat.

A liquid also has a little stiffness, like a solid. Its molecules need some time to rearrange themselves, the
**relaxation time**, and within that time a sudden shear is resisted as a solid would resist it. A slow stir gives the
molecules time, and the liquid flows. A shake much faster than the relaxation time gives them none, and the liquid
answers as a solid, which stores the work instead of turning it into heat.

Honey's molecules rearrange slowly, so honey starts acting as a solid at a much lower frequency than water does. Heat
shakes matter about $10^{13}$ times a second. If honey and water were equally stiff against a sudden shear, honey
would turn far less of that shaking into heat, although it is ten thousand times more viscous to stir.
:::

## Viscosity is a stress that answers how fast a shape changes

The solid of [section 4.3](/tutorial/response/elastic-bodies/) answers a shear with a stress in proportion to the shear
itself. A liquid at rest holds no shear stress at all, whatever the shape of its glass. A stirred liquid does push
back, but against the rate at which its shape changes, not against the change.

We describe a flowing liquid by its velocity $\vect v(\vect x)$, in metres per second, at each point. In a short time
$\dd t$ each bit moves by $\vect v\,\dd t$, and the
[strain](/tutorial/response/elastic-bodies/#a-deformation-is-a-displacement-field-and-its-strain-is-the-part-that-changes-lengths)
of that small displacement, divided by $\dd t$, is the **rate of strain**,

$$\dot u_{ij} = \tfrac12\bigl(\partial_iv_j + \partial_jv_i\bigr) ,$$

in $\mathrm{s^{-1}}$. Its trace-free part, $\dot{\tilde u}_{ij} = \dot u_{ij} - \tfrac13\delta_{ij}\dot u_{kk}$, is the
**rate of shear**: how fast each small piece changes its shape.

A **Newtonian fluid** is one whose stress has a part in proportion to the rate of shear:

$$\boxed{\;\matter T_{ij} = -p\,\delta_{ij} + 2\sym{viscosity}{\matter\eta}\,\dot{\tilde u}_{ij}\;} . \label{eq:viscous}$$

The number $\matter\eta$ is the **shear viscosity**, or the viscosity for short, in pascal seconds; the units agree, since
$\mathrm{Pa\,s} \times \mathrm{s^{-1}} = \mathrm{Pa}$. The first term is the pressure $p$, the push of a fluid at
rest. The second, the **viscous stress**, answers only the rate of shear, so a uniform compression is left to the
pressure. (A bulk viscosity, which resists a change of volume, never enters: a gravitational wave's shear is
trace-free.) The factor 2 matches the $2\matter\mu\,\tilde u_{ij}$ of Hooke's
law in section 4.3: $\matter\eta$ does for a rate of shear what the shear modulus $\matter\mu$ does for a shear.

**Why this quantity: it is what is measured between two plates.** A layer of liquid of thickness $d$ lies between two
flat plates. The lower plate is held still and the upper one slides along $x$ at the speed $v$. The liquid sticks to
each plate, so its velocity rises evenly across the gap, $v_x = v\,y/d$ (Figure [](#fig:plates)). The only entries of
the rate of strain are $\dot u_{xy} = \dot u_{yx} = v/2d$, and their trace is zero, so [](#eq:viscous) gives the
stress on the upper plate,

$$\matter T_{xy} = \frac{\matter\eta\,v}{d} .$$

This is the force per area needed to keep the plate moving, and an instrument that measures it measures $\matter\eta$.

**An example.** Water has $\matter\eta \approx 10^{-3}\unit{Pa\,s}$. Between plates 1 mm apart, moving at
$1\unit{cm\,s^{-1}}$, its stress is $10^{-3} \times 0.01/10^{-3} = 0.01\unit{Pa}$: each square metre of plate is held
back by the weight of a gram. Honey, of about $10\unit{Pa\,s}$, needs $100\unit{Pa}$.
**A non-example.** An elastic solid between the same plates has after a time $t$ the strain $u_{xy} = v\,t/2d$ and the
stress $\matter\mu v\,t/d$. When the plate stops, the solid's stress stays, while the liquid's vanishes at once.

![The arrows in the liquid grow evenly from the still plate to the moving one, so every layer slides over the next at
the rate $v/d$. The lengths are schematic.](tut-visc-plates){#fig:plates}

## Friction turns the work of a shear into heat, more at higher frequency

We want the heat that viscosity makes. Section 4.3 found that when the strain of a piece of material changes by
$\delta u_{ij}$, its neighbours do the work $\matter T_{ij}\,\delta u_{ij}$ on each cubic metre of it, besides the work
that speeds it up. Per second this is $\matter T_{ij}\dot u_{ij}$. With [](#eq:viscous), the pressure gives
$-p\,\dot u_{kk}$, the work of compression, which a fluid stores and returns as a spring does. The viscous stress gives
$2\matter\eta\,\dot{\tilde u}_{ij}\dot u_{ij}$, and since $\dot{\tilde u}_{ij}$ is trace-free, $\dot{\tilde
u}_{ij}\dot u_{ij} = \dot{\tilde u}_{ij}\dot{\tilde u}_{ij}$. So the heat made in each cubic metre per second is

$$\boxed{\;\text{heat per volume per second} = 2\matter\eta\,\dot{\tilde u}_{ij}\dot{\tilde u}_{ij} \ge 0\;} .
\label{eq:heat}$$

The right side is a sum of squares times $\matter\eta$, so a positive viscosity always heats and never cools.
**A number.** Between the plates, the two equal entries give $2\matter\eta \times 2(v/2d)^2 = \matter\eta v^2/d^2$,
which for water is $0.1\unit{W\,m^{-3}}$, the same as the plate's stress times its speed, $10^{-4}\unit{W}$ per square
metre, spread through a millimetre. At this rate the water warms by one kelvin in 1.3 years, since a cubic metre of it
needs $4.2 \times 10^6\unit{J}$ per kelvin.

Now let the shear rise and fall, $\tilde u_{ij} = \mathrm{Re}[U_{ij}\,e^{-i\omega t}]$, with the phasor $U_{ij}$ a
trace-free table of complex numbers without a unit ([section 1.5b](/tutorial/newton/complex-numbers/)). The rate of shear has the phasor $-i\omega U_{ij}$, and the rule for [the average of a
product](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push) of
section 4.1, $\tfrac12\mathrm{Re}[a^*b]$, gives $\langle\dot{\tilde u}_{ij}\dot{\tilde u}_{ij}\rangle =
\tfrac12\omega^2U_{ij}^*U_{ij}$, so the heat averaged over a swing is

$$\matter\eta\,\omega^2\,U_{ij}^*U_{ij} .$$

At a fixed viscosity and size of shear, friction takes work in proportion to the square of the frequency. A
gravitational wave of strain $\field h_{ij}$ shears matter at the rate $\tfrac12\dot h_{ij}$ (the
[half](/tutorial/response/elastic-bodies/#a-deformation-is-a-displacement-field-and-its-strain-is-the-part-that-changes-lengths)
of section 4.3), so the energy it loses is in proportion to $\matter\eta$.

## Maxwell's model is a liquid when slow and a solid when fast

A **dashpot** is a piston in a cylinder of oil. It does not resist being held at any position, but it resists motion
with a force in proportion to its speed: it is pure viscosity, as a spring is pure elasticity. Maxwell's law of a
material whose stresses relax, the **Maxwell model**, is drawn as a spring and a dashpot joined end to end.

We assume that **the material shears through two parts in series**: an elastic part of rigidity
$\sym{unrelaxed-modulus}{\matter\mu_\infty}$, whose stress is $2\matter\mu_\infty$ times its shear, and a viscous part
of viscosity $\sym{static-viscosity}{\matter\eta_0}$, whose stress is $2\matter\eta_0$ times its rate of shear. (The
subscript $\infty$ stands for an infinitely fast shear, and 0 for zero frequency.) We follow one entry of the tables,
say $xy$, and drop the indices. The same stress $\matter T$ acts through both parts, and their shears add. So the rates
add too:

$$\dot{\tilde u} = \frac{\dot{\matter T}}{2\matter\mu_\infty} + \frac{\matter T}{2\matter\eta_0} .$$

We multiply by $2\matter\mu_\infty$ and name the ratio of the two constants:

$$\dot{\matter T} + \frac{\matter T}{\tau} = 2\matter\mu_\infty\,\dot{\tilde u}, \qquad
\sym{relaxation-time}{\tau} = \frac{\matter\eta_0}{\matter\mu_\infty} . \label{eq:relax}$$

The **relaxation time** $\tau$ is in seconds, since pascal seconds over pascals leave seconds.

**A held shear.** Shear the material suddenly to $\tilde u_0$ at $t = 0$ and hold it there. During the sudden step the
dashpot has no time to move, so the spring takes the whole shear and $\matter T = 2\matter\mu_\infty\tilde u_0$. After
it, $\dot{\tilde u} = 0$, and [](#eq:relax) becomes $\dot{\matter T} = -\matter T/\tau$, so

$$\matter T = 2\matter\mu_\infty\,\tilde u_0\,e^{-t/\tau} .$$

The dashpot slowly gives way until the spring is slack. This dying away of a held stress is **relaxation**: over times
much longer than $\tau$ the material flows like a liquid, and over much shorter times it holds like a solid
(Figure [](#fig:maxwell)).

**A steady swing.** We write $\tilde u = \mathrm{Re}[U\,e^{-i\omega t}]$ and $\matter T = \mathrm{Re}[\tilde{\matter
T}\,e^{-i\omega t}]$, and each time derivative becomes a factor $-i\omega$ (section 1.5b). Then [](#eq:relax) reads
$(-i\omega + 1/\tau)\,\tilde{\matter T} = 2\matter\mu_\infty(-i\omega U)$. We multiply by $\tau$ and divide by
$1 - i\omega\tau$:

$$\tilde{\matter T} = 2\,\frac{\matter\eta_0}{1 - i\omega\tau}\,(-i\omega U) .$$

This is the law [](#eq:viscous) in phasors, with the rate of shear $-i\omega U$, and with a viscosity that depends on
the frequency. We call it the **dynamic viscosity**, a complex number like the response function of section 4.1:

$$\sym{dynamic-viscosity}{\matter\eta(\omega)} = \frac{\matter\eta_0}{1 - i\omega\tau} .$$

Multiplying its top and bottom by $1 + i\omega\tau$ splits it into its real and imaginary parts,

$$\begin{gathered}
\boxed{\;\mathrm{Re}\,\matter\eta(\omega) = \frac{\matter\eta_0}{1 + \omega^2\tau^2}\;} ,\\
\mathrm{Im}\,\matter\eta(\omega) = \frac{\matter\eta_0\,\omega\tau}{1 + \omega^2\tau^2} .
\end{gathered} \label{eq:dynamic}$$

Every entry of the tables obeys the same law, so we may restore the indices. The average above, with $a =
\tilde{\matter T}_{ij}$ and $b = -i\omega U_{ij}$, gives the heat $\mathrm{Re}\,\matter\eta\;\omega^2U_{ij}^*U_{ij}$. So
$\mathrm{Re}\,\matter\eta$ is the friction and $\mathrm{Im}\,\matter\eta$ is stored and returned. Here $\matter\eta$
links the stress to the rate of shear, which runs a quarter swing ahead of the shear, so the part of the stress in step
with the rate, $\mathrm{Re}\,\matter\eta$, does the work.[^modulus]

**Two limits.** When $\omega\tau \ll 1$, $\matter\eta(\omega) \to \matter\eta_0$: slowly stirred, the material is a
Newtonian liquid of viscosity $\matter\eta_0$, its everyday viscosity. When $\omega\tau \gg 1$, $\matter\eta \approx
\matter\eta_0/(-i\omega\tau) = i\matter\mu_\infty/\omega$, so $\tilde{\matter T} = 2\matter\mu_\infty U$: the stress
is in step with the shear, and the material answers as the solid of section 4.3, of rigidity $\matter\mu_\infty$. Its
friction then falls as

$$\mathrm{Re}\,\matter\eta \to \frac{\matter\eta_0}{(\omega\tau)^2} = \frac{\matter\mu_\infty^2}{\matter\eta_0\,\omega^2} .$$

The rigidity against a sudden shear, $\matter\mu_\infty$, is the **unrelaxed rigidity**; against a slow
one, $\sym{relaxed-modulus}{\matter\mu_0}$, the **relaxed rigidity**, which for a Maxwell liquid is zero, because a
held shear loses all its stress. Their difference, $\Delta\matter\mu = \matter\mu_\infty - \matter\mu_0$, is the
stiffness that relaxes. It is also the **weight** of a source of friction, because it fixes the friction added up over
all frequencies ([section 4.5](/tutorial/response/causality/#causality-fixes-a-materials-total-friction) shows why, and
the Stretch problem below checks it for Maxwell's model).

**A number.** Honey's everyday viscosity is about $10\unit{Pa\,s}$. We assume, for illustration, an unrelaxed
rigidity of $1\unit{GPa}$, about half of water's stiffness against compression, 2.2 GPa
([section 4.3](/tutorial/response/elastic-bodies/#a-solid-carries-two-kinds-of-sound)). Honey's relaxation time is
then $\tau = 10/10^9 = 10\unit{ns}$. Stirred once a second, $\omega\tau = 6 \times 10^{-8}$, and its friction is
$\matter\eta_0$ to within a few parts in $10^{15}$.

![The stress jumps when the shear is applied, because the spring takes all of it, and then dies away as the dashpot
gives way. After one relaxation time it has fallen to $1/e$ of its first value. The curve is exact; the drawing of the
spring and the dashpot is schematic.](tut-visc-maxwell){#fig:maxwell}

## At fixed stiffness, the more viscous liquid has less friction at the frequencies of heat

A body whose friction is the same at every frequency glows brightest where
$\hbar\omega = 2.82\,\kB T$, and we compare frictions there.[^peak] At 293 K this is $\omega = 1.08 \times
10^{14}\unit{s^{-1}}$, or $1.72 \times 10^{13}$ cycles a second, 17 THz. We estimate the Maxwell friction there for
two liquids of the same stiffness.

Honey, with $\matter\eta_0 = 10\unit{Pa\,s}$ and the assumed $\matter\mu_\infty = 1\unit{GPa}$, has
$\omega\tau = 1.1 \times 10^6$. A Maxwell liquid with water's viscosity, $10^{-3}\unit{Pa\,s}$, and the same assumed
rigidity has $\tau = 1\unit{ps}$ and $\omega\tau = 108$. Both are deep in the tail, $\omega\tau \gg 1$.

From the tail, $\matter\mu_\infty^2/\matter\eta_0\omega^2 = 10^{18}/(\matter\eta_0 \times 1.17 \times
10^{28})$:

$$\mathrm{Re}\,\matter\eta \approx 8.5 \times 10^{-12}\unit{Pa\,s}\ \text{(honey)}, \qquad 8.5 \times
10^{-8}\unit{Pa\,s}\ \text{(Maxwell water)} .$$

At the same stiffness, the liquid that is ten thousand times more viscous to stir has ten thousand
times less friction at the peak of the glow. The two curves cross where the two frictions are equal,
$\matter\eta_{\rm h}(1 + \omega^2\tau_{\rm w}^2) = \matter\eta_{\rm w}(1 + \omega^2\tau_{\rm h}^2)$, with h for honey
and w for water. With $\tau = \matter\eta_0/\matter\mu_\infty$ this gives
$\omega = \matter\mu_\infty/\sqrt{\matter\eta_{\rm h}\matter\eta_{\rm w}} = 10^{10}\unit{s^{-1}}$, four powers of ten
below the glow (Figure [](#fig:tails)). Both frictions lie far below the **placeholder**, the constant friction of
$10^{-3}\unit{Pa\,s}$ that serves as a reference for every glow: honey's by a factor of $10^8$, the Maxwell
water's by $10^4$. The everyday viscosity says almost nothing about the friction at 17 THz.

Far above $1/\tau$ the spring takes nearly all of the shear, the stress is
$2\matter\mu_\infty U$, and the dashpot moves with the rate $\matter T/2\matter\eta_0 \approx \matter\mu_\infty
U/\matter\eta_0$. Its heat goes as $\matter\eta_0$ times the square of that rate, so as
$\matter\mu_\infty^2|U|^2/\matter\eta_0$. A more viscous dashpot moves less under the same stress, and so it makes less
heat. The condition matters: this holds at a fixed stiffness $\matter\mu_\infty$.

![Below the crossing at $10^{10}\unit{s^{-1}}$ honey has the more friction, above it the less. The shaded band is the
glow at 293 K. The curves are exact, the dashed lines are their tails $\matter\mu_\infty^2/\matter\eta_0\omega^2$,
and the stiffness of 1 GPa is an illustration.](tut-visc-tails){#fig:tails}

Real water is different again. Its friction at terahertz frequencies comes from motions much faster than
Maxwell's rearrangement: the stretching of the hydrogen bonds between molecules, near 8 THz, and the rocking of the
molecules. A computer simulation gives near 8 THz a friction of $2.4 \times 10^{-4}\unit{Pa\,s}$, a third of the
simulated water's everyday viscosity, $7 \times 10^{-4}\unit{Pa\,s}$, and $4.2 \times 10^{-5}\unit{Pa\,s}$ at the
glow's peak, 17 THz.

A friction that changes with frequency is not one number, so materials are compared through the **effective
friction** $\sym{effective-friction}{\matter\eta_{\rm eff}}$: the constant friction that would make the body glow with
the same total power. It is an average of $\mathrm{Re}\,\matter\eta$ over the glow's band (where the glow is brighter
than a tenth of its peak, 2.6 to 51 THz at 293 K), each frequency counting in proportion to the Planck spectrum.
Water's is $5.4 \times 10^{-5}\unit{Pa\,s}$, near its friction at the glow's peak, because most of the glow comes from
well above 8 THz.

Maxwell's model explains the direction of the effect, since the slow rearrangement that makes a liquid viscous is
frozen at the frequencies of heat. It does not give water's number, which belongs to motions the model leaves out.

::: try {#maxwell-liquid}
The friction $\mathrm{Re}\,\matter\eta(\omega) = \matter\eta_0/(1 + \omega^2\tau^2)$ of one Maxwell liquid, on
logarithmic axes. The thin dashed lines are its plateau $\matter\eta_0$ and its tail
$\matter\mu_\infty^2/\matter\eta_0\omega^2$, which meet at $\omega = 1/\tau$; the dotted line is water's placeholder
viscosity, $10^{-3}\unit{Pa\,s}$; and the shaded band is where the thermal glow is brightest at the temperature you
choose. The sliders set $\matter\eta_0$, $\matter\mu_\infty$ and the temperature, and the presets choose water's
placeholder, honey, or copper's electrons. The readouts give $\tau$, the friction at the peak of the glow, and the
weight $(2/\pi)\int_0^\infty\mathrm{Re}\,\matter\eta\,\dd\omega$, computed from the curve.

Answer the predictions at the top of the figure first, then do what each asks. Afterwards, move
$\matter\mu_\infty$ alone and watch the weight.
:::

## A metal's electrons relax like a Maxwell liquid, and their friction has a ceiling

In a metal, some electrons belong to no single atom and move through the whole crystal: the **free electrons**, one
per atom in copper. Quantum mechanics allows at most two electrons in each state of motion, so they fill the states
from the slowest upward, up to an energy $\sym{fermi-energy}{E_F}$, the **Fermi energy**. The fastest of them move at the **Fermi speed**
$\sym{fermi-speed}{v_F}$, with $E_F = \tfrac12mv_F^2$ and $m = 9.11 \times 10^{-31}\unit{kg}$ the electron's mass. At
rest the electrons' velocities point equally in every direction. A shear makes this spread of velocities lopsided, and
collisions with the vibrating atoms even it out again in the **collision time** $\tau$, which plays the part of the
relaxation time.

The friction of these electrons, which we take without proof (section 10.3 derives it), is

$$\mathrm{Re}\,\matter\eta = \frac{\tfrac15\sym{electron-density}{\matter n}\,m v_F^2\,\tau}{1 + \omega^2\tau^2} ,$$

with $\matter n$ the number of free electrons per cubic metre. The $\tfrac15$ comes from averaging over the directions
in which the electrons move. The friction has Maxwell's form because the lopsided spread of velocities carries a
stress, which the collisions relax. It assumes a collision time that does not depend on the frequency, good to about a
factor of two. **A check.** This is [](#eq:dynamic) with $\matter\eta_0 = \tfrac15\matter n m v_F^2\tau$, so
$\matter\mu_\infty = \matter\eta_0/\tau = \tfrac15\matter n m v_F^2 = \tfrac25\matter nE_F$, the weight of the
electrons' friction, since here too $\matter\mu_0 = 0$. The units agree: $\matter n m
v_F^2$ is in $\mathrm{kg\,m^{-1}\,s^{-2}}$, which is a pascal.

**Numbers.** Copper has four atoms in a cube of side 0.3615 nm, so $\matter n = 8.47 \times 10^{28}\unit{m^{-3}}$, and
its Fermi energy is $7.0\unit{eV}$ ($1\unit{eV} = 1.60 \times 10^{-19}\unit{J}$).[^fermi] Then $\matter\mu_\infty =
0.4 \times 8.47 \times 10^{28}\unit{m^{-3}} \times 1.12 \times 10^{-18}\unit{J} = 3.8 \times 10^{10}\unit{Pa}$, or
38 GPa. Copper's electrical conductivity gives the collision time $\tau = 2.5 \times 10^{-14}\unit{s}$, so
$\matter\eta_0 = 9.5 \times 10^{-4}\unit{Pa\,s}$: stirred slowly, copper's electrons would be about as viscous as
water. At the glow's peak $\omega\tau = 2.7$, about one, and $\mathrm{Re}\,\matter\eta = 9.5 \times 10^{-4}/8.3 = 1.1
\times 10^{-4}\unit{Pa\,s}$.

Copper's effective friction is $1.3 \times 10^{-4}\unit{Pa\,s}$, near the value at the peak although its friction
falls 55-fold across the glow's band, from $8.2 \times 10^{-4}\unit{Pa\,s}$ at 2.6 THz to $1.5 \times
10^{-5}\unit{Pa\,s}$ at 51 THz: the excess below the peak offsets the deficit above it.

**The ceiling.** We want the largest friction that any collision time can give at a fixed $\omega$ and
$\matter\mu_\infty$. Since $\matter\eta_0 = \matter\mu_\infty\tau$, the friction is $\matter\mu_\infty\,\tau/(1 +
\omega^2\tau^2)$. Its derivative with respect to $\tau$ is $\matter\mu_\infty(1 - \omega^2\tau^2)/(1 +
\omega^2\tau^2)^2$, which is zero at $\omega\tau = 1$, positive below and negative above. So the largest value is at
$\omega\tau = 1$, and

$$\boxed{\;\mathrm{Re}\,\matter\eta \le \frac{\matter\mu_\infty}{2\omega} = \frac{\matter n m v_F^2}{10\,\omega}\;} ,
\label{eq:ceiling}$$

with equality when $\omega\tau = 1$ (Figure [](#fig:ceiling)). Copper is near it: the ceiling is $1.8 \times
10^{-4}\unit{Pa\,s}$, and copper reaches 65% of it. Honey is far from it: its ceiling at the same frequency is
$\matter\mu_\infty/2\omega = 4.6 \times 10^{-6}\unit{Pa\,s}$, and it reaches two millionths of that. A collision
time longer than $1/\omega$ lowers the friction, because the electrons then answer as a solid.

![At the glow's peak frequency no collision time gives electrons of weight 38 GPa more friction than
$\matter\mu_\infty/2\omega$, reached at $\omega\tau = 1$. Copper's own electrons sit a little past the peak, at 65%
of the ceiling. The curve is exact.](tut-visc-ceiling){#fig:ceiling}

Figure [](/paper/#fig:materials) draws each material's friction against $\omega/2\pi$ in THz, so the glow's peak sits at 17 THz.
Copper's curve in panel (a) is flat at low frequencies and bends down near $\omega = 1/\tau$, at 6.4 THz. Iron's outer
electrons are partly held by its atoms, so the free-electron formula does not fit them, and for iron the figure draws
the ceiling, falling as $1/\omega$: an envelope over every collision time, not the spectrum of any one metal.

{{paper fig:materials}}

## A ringing solid's friction is its quality factor

The friction inside a solid is tied to the quality factor of its sound. We assume that **a solid's internal friction
is a viscous stress**: on top of Hooke's stress $2\matter\mu\,\tilde u_{ij}$ (section 4.3), the solid carries a stress
$2\,\mathrm{Re}\,\matter\eta\;\dot{\tilde u}_{ij}$, of the same form as a liquid's. Take a shear vibration of the solid
at the frequency $\omega$, with phasor $U_{ij}$. Its energy passes back and forth between the strain and the motion, as
the cart's did in section 4.1, so on average each holds half. The strain holds $\matter\mu\,\tilde
u_{ij}\tilde u_{ij}$ per cubic metre ([section
4.3](/tutorial/response/elastic-bodies/#a-strain-stores-energy-half-the-stress-times-the-strain)), whose average is
$\tfrac12\matter\mu\,U_{ij}^*U_{ij}$, so the energy per cubic metre is $E = \matter\mu\,U_{ij}^*U_{ij}$. The friction
takes $\mathrm{Re}\,\matter\eta\,\omega^2U_{ij}^*U_{ij}$ per second. Section 4.1 wrote the [loss of a
ring-down](/tutorial/response/oscillator/#friction-makes-the-swing-die-away-and-the-quality-factor-counts-how-slowly) as
$\dd E/\dd t = -\Gamma E$ and defined $Q = \omega_0/\Gamma$, the mode's own frequency over its damping rate. Here the
mode's frequency is $\omega$, so $\Gamma = \mathrm{Re}\,\matter\eta\,\omega^2/\matter\mu$ and $Q = \omega/\Gamma$ give

$$\boxed{\;\mathrm{Re}\,\matter\eta = \frac{\matter\mu}{\omega Q} = \frac{\matter\rho c_T^2}{\omega Q}\;} ,
\label{eq:q-friction}$$

with [$\matter\mu = \matter\rho c_T^2$](/tutorial/response/elastic-bodies/#a-solid-carries-two-kinds-of-sound). The units
agree: pascals over $\mathrm{s^{-1}}$ are pascal seconds.

**Which $Q$.** A bell's note rings for thousands of swings, because a vibration that spans the whole bell loses little
in each. The vibrations of heat are a few atoms long and scatter within a few swings. We take $Q \approx 10$ for
them in steel, so that they travel about a nanometre before they die away.[^mfp]

**Why about ten.** A thermal vibration loses its energy to the others because a solid is not exactly a set of springs:
a strain $s$ changes the frequency of each vibration by the fraction $\delta\omega/\omega = -\gamma s$. The number
$\gamma$ is the **Grüneisen parameter**, a pure number of order one that is measured from a solid's thermal expansion;
for iron it is about 1.7. The thermal vibrations themselves strain every part of the solid at random. Each atom, of mass
$M$, holds an energy of order $\kB T$ in them ([section 4.2](/tutorial/response/temperature/)), and the elastic energy
of a strain $s$ per atom is of order $Mc_T^2s^2$, so the random strain has $s_{\rm th}^2 \approx \kB T/Mc_T^2$. A
vibration whose frequency is shaken by the fraction $\gamma s_{\rm th}$, differently in each swing, loses its energy
to the others in about $1/(\gamma s_{\rm th})^2$ swings, because the effects of successive swings add at random, as
the steps of a random walk do ([section 3.1](/tutorial/noise/probability/)). So

$$Q \approx \frac{Mc_T^2}{\gamma^2\,\kB T} ,$$

a pure number, as it must be. For iron, $Mc_T^2 = 9.27 \times 10^{-26}\unit{kg} \times (3000\unit{m\,s^{-1}})^2 =
8.3 \times 10^{-19}\unit{J}$, or 5.2 eV, which is 206 times $\kB T$ at 293 K, and $Q$ comes out near 70. This is the
order of magnitude for a pure crystal; a full calculation changes it by a factor of order one. Steel is iron with
carbon and other atoms dissolved in it, in small grains, and its free electrons also take energy from the vibrations;
each of these shortens the vibrations' lives. We therefore take $Q \approx 10$ for steel, an estimate good to a factor
of a few, and every friction and glow that follows from it is uncertain by the same factor. **A limit.** The estimate
grows as $1/T$: in a pure crystal cooled far enough the vibrations of heat cross the whole body before they die.

**A number.** Steel has $\matter\rho = 7850\unit{kg\,m^{-3}}$ and $c_T = 3000\unit{m\,s^{-1}}$, so
$\matter\mu = 7.07 \times 10^{10}\unit{Pa}$, section 4.3's 71 GPa. At the glow's peak,
$\mathrm{Re}\,\matter\eta = 7.07 \times 10^{10}/(1.08 \times 10^{14} \times 10) = 6.5 \times 10^{-5}\unit{Pa\,s}$,
fifteen times below the placeholder and about half of copper's electrons' $1.1 \times 10^{-4}$. **A limit.** As
$Q \to \infty$ the friction vanishes: a solid that rings for ever turns no work into heat inside. At a fixed $Q$ the
friction falls as $1/\omega$.[^p2]

## The vibrations of heat add a stiffness that relaxes, and a friction with Maxwell's form

Even a perfect crystal damps a slow sound wave, because the wave's strain disturbs the balance of energy among the
vibrations of heat, and the collisions between them restore it (Akhiezer 1939). We want this friction at every
frequency. We assume that **the solid is hot enough for each vibration to hold the energy $\kB T$**, section 4.2's
equal share; iron at room temperature is close to this, since its heat capacity is within a few per cent of the
classical $3\kB$ per atom. We also assume that **the solid has cubic symmetry or is made of many grains**.

Take the shear $\vect u = s\,(y, x, 0)$, for which $\tilde u_{xy} = \tilde u_{yx} = s$. It changes the frequency of
vibration $k$ by $\delta\omega_k = -\gamma_k\omega_ks$, with a Grüneisen coefficient $\gamma_k$ of its own for each
vibration. A quarter turn about $z$ reverses this shear and carries each vibration to another one, so the $\gamma_k$
add up to zero over all the vibrations: the shear moves energy among them but does not change the temperature.

**The vibrations push on the solid.** A slowly changed oscillator keeps the ratio $E/\omega$ of its energy to its
frequency. Its energy $\tfrac12\dot x^2 + \tfrac12\omega^2x^2$ changes at the rate $\omega\dot\omega\,x^2$,
whose average over a swing, with $\langle x^2\rangle = E/\omega^2$, is $(\dot\omega/\omega)E$; so
$E/\omega$ is constant. When the shear grows by $\dd s$ faster than the collisions act, each vibration's energy therefore
changes by $-\gamma_kE_k\,\dd s$. That energy is work done on the solid against a stress. For this shear the work per
cubic metre is $(\matter T_{xy} + \matter T_{yx})\,\dd s = 2\matter T_{xy}\,\dd s$, so the vibrations in a volume
$V$ carry the stress

$$\matter T_{xy}^{\rm vib} = -\frac{1}{2V}\sum_k\gamma_kE_k .$$

**A held shear.** Before the shear every $E_k = \kB T$, and the stress is zero because the $\gamma_k$ add up to zero.
Immediately after a sudden shear $s$, $E_k = \kB T\,(1 - \gamma_ks)$, and

$$\matter T_{xy}^{\rm vib} = \frac{\kB T}{2V}\sum_k\gamma_k^2\,s = 2\,\Delta\matter\mu\,s, \qquad
\boxed{\;\Delta\matter\mu = \tfrac34\,\matter n\,\kB T\,\langle\gamma^2\rangle\;} ,$$

where $\matter n$ is now the number of atoms per cubic metre, so that there are $3\matter nV$ vibrations, and
$\langle\gamma^2\rangle$ is the mean of $\gamma_k^2$ over them. The units agree: $\matter n\kB T$ is a pressure.
The collisions then share the energy out again until every vibration holds $\kB T$, in the lifetime $\tau$ of a thermal
vibration, and the stress falls to zero. This is the held shear of Maxwell's model, with the spring
$\Delta\matter\mu$ in place of $\matter\mu_\infty$ and a relaxed value of zero. The vibrations act as a Maxwell
element in parallel with the solid's ordinary rigidity, and by [](#eq:dynamic) their friction is

$$\mathrm{Re}\,\matter\eta_{\rm A}(\omega) = \frac{\Delta\matter\mu\,\tau}{1 + \omega^2\tau^2} .$$

Its weight is $\Delta\matter\mu$, and it sits at frequencies below $1/\tau$, near zero on the scale of the
vibrations of heat.

**Numbers.** Iron has $\matter n = 8.5 \times 10^{28}\unit{m^{-3}}$, so at 293 K $\matter n\kB T = 3.4 \times
10^8\unit{Pa}$. With $\langle\gamma^2\rangle \approx 3$, close to the square of iron's 1.7, $\Delta\matter\mu
\approx 0.8\unit{GPa}$, about one per cent of steel's rigidity. A vibration of heat near $\omega = \kB T/\hbar = 3.8
\times 10^{13}\unit{s^{-1}}$ with $Q = 10$ lives $\tau = Q/\omega = 2.6 \times 10^{-13}\unit{s}$. Ultrasound at
10 MHz has $\omega\tau = 1.6 \times 10^{-5}$, so its friction is $\Delta\matter\mu\,\tau = 2.0 \times
10^{-4}\unit{Pa\,s}$, and by [](#eq:q-friction) it would ring for $Q = \matter\mu/\omega\,\mathrm{Re}\,
\matter\eta_{\rm A} = 6 \times 10^6$ swings if nothing else damped it. Real steel damps ultrasound more, mostly
because its grains scatter the sound.

**The tail.** At frequencies far above $1/\tau$ the friction falls as

$$\mathrm{Re}\,\matter\eta_{\rm A} \to \frac{\Delta\matter\mu}{\omega^2\tau} .$$

At the top of iron's band of vibrations, $\omega_D = 6.2 \times 10^{13}\unit{s^{-1}}$ (with $\hbar\omega_D = \kB \times 470\unit{K}$), $\omega_D\tau = 16$ and the tail is $8 \times 10^{-7}\unit{Pa\,s}$. A weight $\Delta\matter\mu$ spread evenly
over a band of width $\omega_D$ would give a friction of about $\Delta\matter\mu/\omega_D$ there, so the tail is
smaller by the quality factor $\omega_D\tau$ of a thermal vibration. Section 10.3 finds a channel of the same weight
spread over the whole band, the making of pairs of vibrations, so Akhiezer's channel adds little to the glow.[^akh]

## A wave in a viscous medium fades, at the friction of its own frequency

A friction in a wave equation makes the wave's energy fall by the same factor in each metre ([section
5.1](/tutorial/waves/wave-equation/#a-damping-term-makes-a-wave-fade-at-a-fixed-rate-per-metre) derives this). For a
gravitational wave the damping rate in time is $\Gamma = 16\pi G\matter\eta/c^2$ in $\mathrm{s^{-1}}$, Hawking's
result, which section 7.8 derives. The wave moves at $c$, so its energy falls per metre at the rate

$$\alpha = \frac{\Gamma}{c} = \frac{16\pi G\matter\eta}{c^3} ,$$

in $\mathrm{m^{-1}}$: $G\matter\eta$ is in $\mathrm{m^2\,s^{-3}}$, and dividing by $c^3$ leaves $\mathrm{m^{-1}}$. The
$\matter\eta$ to put there is not the viscosity measured by stirring but $\mathrm{Re}\,\matter\eta$ at the frequency of
the wave.

**A number.** A gravitational wave at 100 Hz meets water's everyday viscosity, $10^{-3}\unit{Pa\,s}$, since
$\omega\tau \ll 1$. Then $\alpha = 16\pi \times 6.67 \times 10^{-11} \times 10^{-3}/(3.00 \times 10^8)^3 =
1.2 \times 10^{-37}\unit{m^{-1}}$. The wave's energy falls by the factor $e$ only after $1/\alpha = 8.0 \times
10^{36}\unit{m}$, or $8.5 \times 10^{20}$ light-years. A wave at the glow's peak meets
water's friction at 17 THz, $4.2 \times 10^{-5}\unit{Pa\,s}$, and so travels 24 times farther.

::: problems
### Practice

**[4.4]** What is the stress on a plate sliding at $2\unit{cm\,s^{-1}}$ over water $0.5\unit{mm}$ deep?

::: solution
$\matter\eta v/d = 10^{-3} \times 0.02/(5 \times 10^{-4}) = 0.04\unit{Pa}$.
:::

**[4.4]** A Maxwell liquid has $\matter\eta_0 = 1\unit{Pa\,s}$ and $\matter\mu_\infty = 1\unit{GPa}$. Find $\tau$, and
$\mathrm{Re}\,\matter\eta$ at 1 MHz and at 1 THz.

::: solution
$\tau = 1/10^9 = 1\unit{ns}$. At 1 MHz, $\omega = 2\pi \times 10^6 = 6.3 \times 10^6\unit{s^{-1}}$ and $\omega\tau =
6.3 \times 10^{-3}$, so $\mathrm{Re}\,\matter\eta = 1/(1 + 3.9 \times 10^{-5}) = 1.0\unit{Pa\,s}$. At 1 THz, $\omega\tau
= 6300$, so $\mathrm{Re}\,\matter\eta = 1/(3.9 \times 10^7) = 2.5 \times 10^{-8}\unit{Pa\,s}$.
:::

**[4.4]** Why does a Maxwell liquid act as a solid at high frequency?

::: solution
Within one swing the dashpot has no time to flow, so only the spring yields: the stress follows the shear with the
rigidity $\matter\mu_\infty$, in step with it.
:::

**[4.4]** Why does a longer time between the electrons' collisions not always raise a metal's friction at a given
frequency?

::: solution
The friction $\matter\mu_\infty\tau/(1 + \omega^2\tau^2)$ is largest at $\omega\tau = 1$. Beyond that, a longer
collision time lowers it, because the electrons then answer as a solid within each swing.
:::

**[4.4]** A solid rings at $Q = 100$ instead of 10. How does its friction at that frequency change?

::: solution
It is ten times smaller, since $\mathrm{Re}\,\matter\eta = \matter\mu/\omega Q$. For steel at the glow's peak it is
$6.5 \times 10^{-6}\unit{Pa\,s}$.
:::

**[4.4]** Steel is heated from 293 K to 600 K. Using the estimates of this section, how do the stiffness
$\Delta\matter\mu$ that the vibrations of heat carry, their quality factor $Q$ and their lifetime $\tau$ change, and
what happens to Akhiezer's friction for ultrasound?

::: solution
$\Delta\matter\mu \propto T$ doubles, to about 1.6 GPa. $Q \approx Mc_T^2/\gamma^2\kB T$ halves. The typical
vibration's frequency $\kB T/\hbar$ doubles, so $\tau = Q/\omega$ falls by four. The ultrasonic friction
$\Delta\matter\mu\,\tau$ therefore halves, to about $1 \times 10^{-4}\unit{Pa\,s}$ (ignoring the change of
$c_T$ with temperature).
:::

### Stretch

**[4.4]** Show that a sound wave damped only by Akhiezer's channel rings for $Q = \matter\mu(1 + \omega^2\tau^2)/
(\Delta\matter\mu\,\omega\tau)$ swings, that this is smallest at $\omega\tau = 1$, and find the smallest value for
steel.

::: solution
By [](#eq:q-friction), $Q = \matter\mu/\omega\,\mathrm{Re}\,\matter\eta_{\rm A}$, and
$\mathrm{Re}\,\matter\eta_{\rm A} = \Delta\matter\mu\,\tau/(1 + \omega^2\tau^2)$ gives the formula. With
$x = \omega\tau$, $(1 + x^2)/x = x + 1/x$ is smallest at $x = 1$, where it is 2, so $Q_{\min} =
2\matter\mu/\Delta\matter\mu = 2 \times 71/0.77 = 180$. A shear wave of frequency $1/\tau$, near $4 \times
10^{12}\unit{s^{-1}}$, is only about 5 nm long, some twenty atoms, so there the picture of a long wave passing through
a gas of short vibrations no longer holds.
:::

**[4.4]** A spring of stiffness $k$ and a dashpot whose force is $b$ times its speed are joined end to end, and the far
end of the spring is moved by $x(t)$. Show that the junction $q$ obeys section 4.1's law with no mass, $b\dot q + kq =
kx$, so that $b$ plays the part of $\matter m\Gamma$. Show that the force on the moving end, $k(x - q)$, has the phasor
$k\,\tilde x\,(-i\omega\tau)/(1 - i\omega\tau)$ with $\tau = b/k$, Maxwell's form. Then check that the weight,
$\tfrac2\pi\int_0^\infty\mathrm{Re}\,\matter\eta\,\dd\omega$, is $\matter\mu_\infty$ for [](#eq:dynamic), whatever
$\matter\eta_0$ ([section 4.5](/tutorial/response/causality/#causality-fixes-a-materials-total-friction) shows why).

::: solution
The same force passes through both, so $b\dot q = k(x - q)$. In phasors, $(k - i\omega b)\tilde q =
k\tilde x$, so $\tilde q = \tilde x/(1 - i\omega\tau)$, and the force is $k(\tilde x - \tilde q) = k\tilde x\,
(-i\omega\tau)/(1 - i\omega\tau)$. For the integral, put
$x = \omega\tau$: $\int_0^\infty \matter\eta_0\,\dd\omega/(1 + \omega^2\tau^2) = (\matter\eta_0/\tau)\int_0^\infty
\dd x/(1 + x^2) = \matter\mu_\infty\,\pi/2$, so $\tfrac2\pi$ times it is $\matter\mu_\infty$. A larger
$\matter\eta_0$ makes the curve taller and narrower with the same area.
:::

### The camera

**[4.4]** Silicon has two atoms in each cell of its crystal, and a uniform shear pushes one set against the other.
The two sets vibrate against each other at 15.6 THz, a vibration seen in the light a crystal scatters (Raman
scattering), so its friction is a Raman line. Give the line a weight of 18 GPa, averaged over directions. Model the line as the damped oscillator of section 4.1, $\mathrm{Re}\,\matter\eta = \Delta\matter\mu\,
\omega_0^2\Gamma/[(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2]$, show that at its centre it is
$\Delta\matter\mu/\Gamma$, and find it for the line's full width of $3\unit{cm^{-1}}$ (the
[line](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push) of section
4.1). Compare it with the placeholder.

::: solution
At $\omega = \omega_0$ the first term of the bottom vanishes, leaving $\Delta\matter\mu\,\omega_0^2\Gamma/\Gamma^2
\omega_0^2 = \Delta\matter\mu/\Gamma$. The width is $\Gamma = 2\pi c \times 300\unit{m^{-1}} = 5.65 \times
10^{11}\unit{s^{-1}}$, so $\mathrm{Re}\,\matter\eta = 1.8 \times 10^{10}/5.65 \times 10^{11} = 0.032\unit{Pa\,s}$, 32
times the placeholder. The true maximum is higher by only $1/4Q^2$, about $10^{-5}$ for $Q = 173$.
:::
:::

**The idea to keep: viscosity is a stress that answers the rate of shear. A material whose stresses relax in a time
$\tau$ is a liquid when slow and a solid when fast, and its friction at the frequency $\omega$ is
$\matter\eta_0/(1 + \omega^2\tau^2)$. At the frequencies of heat, and at a fixed stiffness, that friction is smaller
the more viscous the liquid, so the everyday viscosity says little about the thermal glow.**

::: paper
- [Section VI](/paper/#sec:thermal) says that honey "need not glow more than water".
- [*Absorption*](/paper/#par:absorption) writes [](/paper/#eq:damped) and [](/paper/#eq:alpha) with $\eta$ "the
  friction at the frequency of the wave".
- [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat) writes
  [](/paper/#eq:maxwell), the free electrons, the ceiling, silicon's 0.03 Pa s and water's friction near 8 THz;
  Table [](/paper/#tab:materials) gives each material's effective friction.
- [*Volume and surface emission*](/paper/#par:volume-and-surface-emission) uses
  $\mathrm{Re}\,\matter\eta = \matter\rho c_T^2/\omega Q$.
- [Section VII](/paper/#sec:no-lens) and [Section IX](/paper/#sec:first-image) use the same internal friction.
:::

::: deeper
- The GR course's lab [*How one layer pulls another*](https://neovand.github.io/general-relativity/chapter-11.html#fluid-shear-lab)
  shows the viscous stress between sliding layers, and its section
  [11.4](https://neovand.github.io/general-relativity/chapter-11.html#11-4-perfect-fluids-derived-from-isotropy) builds
  the perfect fluid, which has no viscosity.
- L. D. Landau and E. M. Lifshitz, *Fluid Mechanics* (2nd ed., Pergamon, 1987), section 15, derives the viscous stress;
  their *Theory of Elasticity* (3rd ed., 1986), sections 34 and 36, treats internal friction and Maxwell's law.
:::

::: history
### Maxwell and the time of relaxation

James Clerk Maxwell wrote the law of relaxation in "On the dynamical theory of gases" (*Philosophical Transactions*
157, 1867, pages 52–53). He defined a "time of relaxation" for bodies in general, from fluids that flow easily to
solids that slowly give way, and applied it to a gas, whose stiffness against a sudden shear is its pressure. The
spring and the dashpot in series came later, as a way of drawing his law.
:::

[^p]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, as its equation
    [](/paper/#eq:maxwell); its sum rule is [](/paper/#eq:friction-sum).

[^p2]: The absorption coefficient is the paper's [](/paper/#eq:alpha), with the damping rate [](/paper/#eq:damped); its
    *Volume and surface emission* uses the link to the quality factor.

[^akh]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, which gives the ratio of the pair
    band to this tail as about $\omega_D\tau\,(\omega/\omega_D)^4$ below the band's top.

[^letters]: The viscosity $\matter\eta$ is not the rapidity or the metric $\eta_{\mu\nu}$ of Parts 6 and 7; the
    relaxation time $\tau$ is not the averaging time of section 3.2 or the proper time of Part 6; the electron density
    $\matter n$ is not the refractive index of section 5.1.

[^modulus]: The stress per shear, $\tilde{\matter T} = 2\sym{complex-modulus}{\matter\mu(\omega)}\,U$, is the
    **complex modulus** $\matter\mu(\omega) = -i\omega\matter\eta(\omega) = \matter\mu_\infty(-i\omega\tau)/(1 -
    i\omega\tau)$, which runs from $\matter\mu_0 = 0$ at $\omega = 0$ to $\matter\mu_\infty$ at high frequency. Its
    friction shows as $\mathrm{Im}\,\matter\mu = -\omega\,\mathrm{Re}\,\matter\eta < 0$, the opposite sign to
    $\mathrm{Im}\,\chi$ of section 4.1, because a modulus is a force per displacement, the inverse of a displacement per
    force. Books on materials, which write $e^{+i\omega t}$, call the same loss a positive "loss modulus".

[^peak]: Section 10.1 derives the number 2.82 from Planck's law.

[^fermi]: Section 10.3 derives $E_F = \hbar^2(3\pi^2\matter n)^{2/3}/2m$, which gives 7.03 eV for copper's
    $\matter n$, and $v_F = \sqrt{2E_F/m} = 1.57 \times 10^6\unit{m\,s^{-1}}$.

[^mfp]: A vibration of quality factor $Q$ keeps its energy for about $Q/\omega$, and in that time it travels
    $c_TQ/\omega$. At $\omega = \kB T/\hbar$ this is $Q\hbar c_T/\kB T$, which for $Q = 10$,
    $c_T = 3000\unit{m\,s^{-1}}$ and 293 K is 0.8 nm, a few atoms.
