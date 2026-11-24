---
id: '6.5'
title: 'What gravitates: the stress–energy tensor'
question: 'The paper says that gravity is produced "in proportion to its energy (and, for fast motion and for light, its momentum and stress too)", and that a beam of light "pulls like a line of matter with twice the mass that its energy alone would suggest". What exactly produces gravity, and why does a box of hot gas, whose pressure also gravitates, still weigh only its energy over $c^2$?'
part: '6'
requires: ['1.3', '1.6', '6.1', '6.2', '6.4']
paper: [sec:introduction, sec:affordances, tab:affordances, sec:one-pixel, sec:waves, eq:wave-zone, sec:vistas, sec:second-order, eq:pass, eq:shock-even, eq:massless-pass, app:proofs]
figures: []
live: [stress-energy-table]
depth: B
---

The paper's [Section X](/paper/#sec:affordances) points the camera at an infrared beam of 100 kW a metre away. A beam of
light carries energy and pushes on whatever it strikes, so it also carries a pressure along its length, and the paper
says that it "pulls like a line of matter with twice the mass that its energy alone would suggest".

Chapter [6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-mass-is-its-total-energy-so-heat-has-weight) found that
heat weighs $\Delta U/c^2$, and it said nothing of pressure. So we ask what exactly produces gravity, and why a box of
hot gas, whose pressure also gravitates, still weighs only its energy over $c^2$.

::: plain
Matter has energy, and when it moves it carries momentum. Energy and momentum can also flow while the matter stays
still: heat flows through a wall, and a pushed rod passes momentum along. Ten numbers at each point, the stress–energy
tensor, say how much energy and momentum a cubic metre holds and how much of each crosses a square metre each second.

The source of gravity is the energy plus the pressures. A beam of light has a pressure along its length equal to its
energy per cubic metre, so it pulls twice as hard as its energy alone would. Inside a body at rest, the pushes and
pulls that hold it together add up to zero, so a box of hot gas weighs only its energy.
:::

## Ten numbers say where energy and momentum are and where they flow

We want one object that says how much energy and momentum there are at each point and how they move, because the paper's
source of gravity is built from them. A flow of mass has a density $\matter\rho$, the mass in a cubic metre, and a mass
flux $\matter\rho\obs{\vect v}$, the mass that crosses a square metre each second (chapter
[2.8](/tutorial/outside/flows/#a-flow-of-mass-is-a-mass-flux-and-mass-is-conserved)). Energy and momentum are the four
parts of one four-vector, $p^\mu = (E/c, \vect p)$ (chapter
[6.4](/tutorial/relativity/energy-and-momentum/#momentum-and-energy-are-the-parts-of-one-four-vector)). So each of the
four parts needs a density and a flux across each of three faces: sixteen numbers.

We write them as one table $\sym{stress-energy-tensor}{\matter T}^{\mu\nu}$, the **stress–energy tensor** (also called
the energy–momentum tensor). Its first index says which part of $p^\mu$ is meant, 0 for energy and $i$ for momentum
along $i$. Its second index says what is counted: 0 for the amount in a cubic metre, and $j$ for the amount that crosses
a square metre facing $j$ each second. With the factors of $c$ that give every entry one unit,

- $\matter T^{00}$ is the **energy density**, the energy in a cubic metre;
- $\matter T^{0j}$ is the energy flux across a face whose normal points along $j$, in watts per square metre, divided by
  $c$;
- $\matter T^{i0}$ is $c$ times the **momentum density**, the momentum along $i$ in a cubic metre;
- $\matter T^{ij}$ is the **momentum flux**, the momentum along $i$ that crosses a square metre facing $j$ each second.

All sixteen are in joules per cubic metre, which is the pascal, because momentum that crosses an area each second is a
force per area (chapter [1.6](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel)).

**Why one table.** An observer who moves sees part of a density as a flow and part of a flow as a density, as a boost
mixes time and distance (chapter
[6.1](/tutorial/relativity/lorentz/#steady-motion-along-a-line-mixes-time-and-distance)). We take as given that the
sixteen numbers change between observers by chapter
[6.2](/tutorial/relativity/spacetime-vectors/#a-tensor-is-a-table-whose-every-index-changes-with-the-boost)'s rule for a
tensor of rank 2, $\matter T'^{\mu\nu} = \Lambda^\mu{}_\alpha\Lambda^\nu{}_\beta\matter T^{\alpha\beta}$, with
$\Lambda^\mu{}_\alpha$ the boost.[^letters]

**Why ten.** The table is symmetric, $\matter T^{\mu\nu} = \matter T^{\nu\mu}$, so ten of its numbers are free (6.2's
count); momentum fluxes that were not symmetric would spin a small cube up without limit. That $\matter T^{0i} = \matter
T^{i0}$ says that energy which flows carries momentum, the energy flux over $c^2$, as in 6.4's $\vect p = E\obs{\vect
v}/c^2$ for one body.[^sym]

Sunlight at the Earth, for example, carries $1361\unit{W\,m^{-2}}$, an energy density and a momentum flux of
$4.5\times10^{-6}\unit{J\,m^{-3}}$. The pair $(\matter\rho, \matter\rho\obs{\vect v})$ of a flow of mass is a
non-example: it is only the table's first row.

## In the stresses, the sign is that of a flow of momentum

We want the sign of the momentum flux, because chapter 4.3 already gave a table of stresses, and the two tables differ
by a sign. Take a gas at rest with the pressure $\matter p$, and a small face inside it whose normal points along $+x$.
The gas on the $-x$ side pushes the gas on the $+x$ side along $+x$, with the force $\matter p$ per square metre. A
force is the rate at which momentum is handed over, so each second the momentum $\matter p$ along $+x$ crosses each
square metre of the face toward $+x$. That is a positive flux, $\matter T^{xx} = +\matter p$, and the same holds on
every face.

Chapter [4.3](/tutorial/response/elastic-bodies/#stress-is-force-per-area-and-it-too-is-a-symmetric-table)'s stress is
the force per area that the material on the far side of a face exerts on it, which for the gas is $-\matter
p\,\delta_{ij}$. The momentum that crosses the face is what the near side gives to the far side, the other half of the
pair of forces of Newton's third law. So:

**The spatial block $\matter T^{ij}$ of the stress–energy tensor is the flow of momentum. For matter at rest it is the
negative of chapter 4.3's stress: a pressure enters as $+\matter p\,\delta_{ij}$, and a tension as a negative number.**

Matter that moves at $\obs{\vect v}$ also carries its momentum density $\matter\rho\obs v_i$ along with it, so for slow
matter

$$\matter T^{ij} = -(\text{4.3's stress})_{ij} + \matter\rho\,\obs v_i\obs v_j .$$

This is the $T_{kl}$ of the paper's [](/paper/#eq:wave-zone), through which chapter
[5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source) read the waves of a
compact source. A rod stretched along $x$ with the tension $\tau$, a force per area, has $\matter T^{xx} = -\tau$:
momentum along $+x$ flows toward $-x$ (Figure [](#fig:momentum-flux-sign)). The paper uses this sign, and calls the
three eigenvalues of $\matter T^{ij}$ in the matter's own frame the **principal stresses**
$\sym{principal-stresses}{\matter p_a}$; for a fluid each is $\matter p$, and their sum is the paper's "$3p$ for a
fluid".

![Look first at the arrows on the faces: in a gas, momentum flows out through every face, so the momentum flux is
$+\matter p$; in a stretched rod it flows inward along the rod, so the momentum flux is $-\tau$. Chapter 4.3's stress
has the opposite sign in both. The arrows' lengths are schematic.](tut-stress-flow-sign){#fig:momentum-flux-sign}

**A fluid at rest** has the table

$$\matter T^{\mu\nu} = \mathrm{diag}(\matter\rho c^2, \matter p, \matter p, \matter p) ,$$

the diagonal promised by chapter 6.2. Here $\matter\rho$ is the mass density in the fluid's own frame, its whole energy
per cubic metre over $c^2$, heat included (chapter 6.4). Its trace with the metric, which every observer agrees on, is
$\field\eta_{\mu\nu}\matter T^{\mu\nu} = -\matter\rho c^2 + 3\matter p$ (6.2's stretch problem).

**How much pressure adds.** The ratio $3\matter p/\matter\rho c^2$ is $3.4\times10^{-15}$ for water and
$5.6\times10^{-6}$ at the Sun's centre ($\matter p = 2.5\times10^{16}\unit{Pa}$, $\matter\rho =
1.5\times10^5\unit{kg\,m^{-3}}$). Models of neutron stars put the pressure at their centres at a tenth or more of
$\matter\rho c^2$, so there the ratio is about 0.4 to 0.5 (stated). So pressure matters to gravity only in the most compact
bodies, and for light.

## Dust, a fluid and a beam of light each fill the table

We want the tables of the paper's three kinds of matter. **Dust** is matter whose grains exert no forces on one another
(chapter [4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust)), and here all the
grains at a point move together. Let $\matter\rho$ be its density in its own frame, and $\obs u^\mu = \obs\gamma(c,
\obs{\vect v})$ its four-velocity (chapter
[6.2](/tutorial/relativity/spacetime-vectors/#the-four-velocity-has-the-same-length-for-every-body)).

**Counting.** In the room's frame two factors of $\obs\gamma$ appear. Each grain of rest mass $\matter m$ has the energy
$\obs\gamma\matter mc^2$ and the momentum $\obs\gamma\matter m\obs{\vect v}$ (chapter 6.4), and the grains are crowded
closer along their motion by $\obs\gamma$ (6.1's shortening of a moving ruler), so a cubic metre holds $\obs\gamma$
times as many. So the energy density is $\obs\gamma^2\matter\rho c^2$ and the momentum density
$\obs\gamma^2\matter\rho\obs{\vect v}$. Both move at $\obs{\vect v}$, so the energy flux is $\obs\gamma^2\matter\rho
c^2\obs{\vect v}$ and the momentum flux $\obs\gamma^2\matter\rho\obs v_i\obs v_j$. With the first section's factors of
$c$, all sixteen entries are one product:

$$\boxed{\;\matter T^{\mu\nu} = \matter\rho\,\obs u^\mu\obs u^\nu\;} \label{eq:dust}$$

Each $\obs u^\mu$ is a four-vector and $\matter\rho$ is measured in the dust's own frame, so the product is a symmetric
tensor. At $0.6c$, $\obs\gamma^2 = 1.5625$, so $\matter T^{00} = 1.5625\,\matter \rho c^2$, $\matter T^{0x} =
0.9375\,\matter\rho c^2$ and $\matter T^{xx} = 0.5625\,\matter\rho c^2$.

**A perfect fluid**, one whose pressure in its own frame is the same in every direction, with no viscosity and no flow
of heat, has

$$\matter T^{\mu\nu} = \Bigl(\matter\rho + \frac{\matter p}{c^2}\Bigr)\obs u^\mu\obs u^\nu + \matter p\,\field\eta^{\mu\nu} .$$

At rest, $\obs u^\mu = (c, 0, 0, 0)$, so $\matter T^{00} = (\matter\rho + \matter p/c^2)c^2 - \matter p = \matter\rho
c^2$ and $\matter T^{ij} = \matter p\,\delta_{ij}$: the last section's table. Both terms are tensors, so this is the
fluid's table for every observer, and with $\matter p = 0$ it is dust.

**A beam of light** along $z$ carries the energy flux $F$, in watts per square metre.[^F] As for sunlight,

$$\matter T^{00} = \matter T^{0z} = \matter T^{z0} = \matter T^{zz} = \frac{F}{c} ,$$

and every other entry is zero. In one product, $\matter T^{\mu\nu} = (F/c)\,k^\mu k^\nu$ with $k^\mu = (1, 0, 0, 1)$,
the beam's direction in spacetime: 6.2's wave four-vector divided by $\omega/c$, a null vector of pure numbers. A beam
is therefore also called **null dust**. Its trace is $-F/c + F/c = 0$. An observer who moves along the beam at $0.6c$
finds every entry four times smaller.[^boost]

**Light in a box**, the same in every direction, is many beams, each along a unit vector $\hat n$ with $\matter T^{ij} =
\matter T^{00}\hat n_i\hat n_j$. Averaged over directions, $\hat n_i\hat n_j$ is a multiple of $\delta_{ij}$, since no
direction is special, with the trace 1, so it is $\tfrac13\delta_{ij}$: light of energy density $\matter{\mathcal U}$
has the pressure $\tfrac13\matter{\mathcal U}$.

## Conservation is one equation with four parts

We want the law that says energy and momentum are never made or destroyed. We assume that **no outside force acts**,
gravity included, so that every force between the parts of the matter is a stress in $\matter T^{\mu\nu}$. As for mass,
the amount of each part of $p^\mu$ in a box changes only by what crosses its faces, with the density in the column 0 and
the fluxes in the columns $j$. With $x^0 = ct$,

$$\boxed{\;\partial_\nu\matter T^{\mu\nu} = \frac1c\frac{\partial\matter T^{\mu0}}{\partial t} +
\frac{\partial\matter T^{\mu j}}{\partial x^j} = 0\;} \label{eq:conservation}$$

Because the table is symmetric this is also $\partial_\mu\matter T^{\mu\nu} = 0$. It has one free index, so if it holds
for one observer it holds for all (chapter 6.2).

**Energy**, $\mu = 0$. Multiplied by $c$ it reads $\partial_t\matter T^{00} + \nabla\cdot(c\matter T^{0j}) = 0$. By
chapter [1.3](/tutorial/newton/gauss-and-poisson/#the-divergence-theorem-adds-up-the-boxes)'s divergence theorem, the
energy in any box changes only by the flux $c\matter T^{0j}$ through its faces.

**Momentum**, $\mu = i$. The momentum density $\matter T^{i0}/c$ changes only by the momentum that flows in. For slow
matter $\matter T^{i0}/c \approx \matter\rho\obs v_i$, and with the second section's $\matter T^{ij}$ the law reads

$$\frac{\partial(\matter\rho\obs v_i)}{\partial t} + \frac{\partial(\matter\rho\obs v_i\obs v_j)}{\partial x^j} =
\frac{\partial(\text{4.3's stress})_{ij}}{\partial x^j} .$$

By the product rule and the continuity of mass, the left side is the density times the acceleration of each bit of
matter, so this is chapter 4.3's Newton's law for a solid; the second section's minus sign makes it come out right. Dust
has no stress, so each grain moves in a straight line at a constant speed.

Conservation also turns the momentum fluxes of a moving source into the second time derivative of its second moment of
mass, the tensor virial identity, which chapter 7.7 derives.

## The stresses of a body at rest add up to zero

We want the total of the stresses inside a body, because gravity's source, in the sixth section, contains them. We
assume that **the body is static**, so nothing in it changes with time, and **isolated**, so $\matter T^{\mu\nu} = 0$
outside some closed surface $S$ around it. By the last section's assumption, every force inside it is a stress.

Static means $\partial_t = 0$, so [](#eq:conservation) with $\mu = j$ leaves $\partial_k\matter T^{jk} = 0$, which we
use in the product rule:

$$\frac{\partial}{\partial x^k}\bigl(x^i\matter T^{jk}\bigr) = \delta_{ik}\matter T^{jk} + x^i\frac{\partial\matter
T^{jk}}{\partial x^k} = \matter T^{ji} .$$

So every entry $\matter T^{ji}$ is a divergence, and the divergence theorem turns its integral into one over $S$, where
$\matter T^{jk} = 0$:

$$\boxed{\;\int\matter T^{ij}\,\dd V = \oint_S x^j\matter T^{ik}\,\hat n_k\,\dd A = 0\;} \label{eq:laue}$$

This is **von Laue's theorem** (Max von Laue, 1911). It does not say that the stresses are zero, only that the
pressures, counted positive, and the tensions, counted negative, add up to zero over the whole body. It holds for bodies
held together by stresses other than gravity, such as a steel shell. It does not cover a star, which its own gravity
holds together, because gravity is not a stress in $\matter T^{\mu\nu}$; chapter 12.1, on stars, takes up that
case.[^star]

::: example
### A ball of gas in a steel shell

A thin steel sphere of radius $R$ and wall thickness $t$ holds gas at the pressure $\matter p$. The gas has
$\matter T^{11} + \matter T^{22} + \matter T^{33} = 3\matter p$, so over its volume $V = \tfrac43\pi R^3$ it gives
$3\matter pV = 4\pi R^3\matter p$. The wall holds the gas in by a tension $\tau$ along it, in both directions along the
wall. Cut the sphere in half: the gas pushes one half with $\matter p\,\pi R^2$, and the wall's cut edge, of area $2\pi
Rt$, pulls back with $\tau\,2\pi Rt$, so $\tau = \matter pR/2t$. The wall's two tensions, each $-\tau$, over its volume
$4\pi R^2t$, give $-2\tau \times 4\pi R^2t = -4\pi R^3\matter p$. The sum is zero, as [](#eq:laue) requires, for any
thin wall.
:::

## What gravitates is the energy plus the sum of the stresses

We need one result of Einstein's theory, stated here without proof; chapter
[7.3](/tutorial/geometry/einstein-equation/#pressure-and-stress-gravitate) derives it. **For a source whose field is
weak and does not change in time**, the potential obeys

$$\boxed{\;\nabla^2\field\Phi = \frac{4\pi G}{c^2}\Bigl(\matter T^{00} + \matter T^{11} + \matter T^{22} +
\matter T^{33}\Bigr)\;} \label{eq:source}$$

The units agree: $\mathrm{J\,m^{-3}}$ over $c^2$ is $\mathrm{kg\,m^{-3}}$, and $G$ times a density is $\mathrm{s^{-2}}$.
For matter at rest with small stresses, $\matter T^{00} = \matter\rho c^2$ and this is chapter
[1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point)'s Poisson equation.[^dust-two]

In a static field the tide $\curv{\tE}$ is the table of second derivatives of the potential (chapter
[1.4](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives)), so its trace is
$\nabla^2\field\Phi$. For matter at rest relative to the pixel, $\matter T^{11} + \matter T^{22} + \matter T^{33}$ is
the sum of the eigenvalues of $\matter T^{ij}$, the principal stresses, so inside matter

$$\mathrm{tr}\,\curv{\tE} = 4\pi G\Bigl[\matter\rho + \frac{\matter p_1 + \matter p_2 + \matter p_3}{c^2}\Bigr] ,$$

the paper's formula of [*Matter at the pixel*](/paper/#par:matter-at-the-pixel).

**A body at rest weighs its energy.** Far outside a static isolated body, [](#eq:source) and Gauss's law give the field
of a point whose mass is $(1/c^2)\int(\matter T^{00} + \matter T^{11} + \matter T^{22} + \matter T^{33})\,\dd V$. This
is the body's **active mass**, the mass that its field reports. For a body held together by its material, [](#eq:laue)
removes the stresses:

$$\boxed{\;\matter M = \frac1{c^2}\int\matter T^{00}\,\dd V = \frac{E}{c^2}\;}$$

with $E$ the body's whole energy at rest. This is chapter
[6.4](/tutorial/relativity/energy-and-momentum/#gravity-weighs-the-rest-mass-so-a-weighing-reads-the-energy)'s stated
result. Heated gas presses harder on its walls, but the walls' tension grows to match, so only the heat's energy counts,
$\Delta U/c^2$.

**A free beam pulls with twice its energy.** Along a beam no wall cancels the pressure, so beside it the source is
$\matter T^{00} + \matter T^{zz} = 2F/c$. A beam of power $P$, in watts, holds the energy $P/c$ in each metre, so it
acts as a line of $\sym{line-density}{\matter\lambda} = 2P/c^3$ kilograms per metre, the paper's "twice". A long
straight line of $\matter\lambda$ kilograms per metre has the potential $2G\matter\lambda\ln b$ at the distance $b$
(chapter [2.4](/tutorial/outside/greens-functions/#along-a-long-rod-the-greens-function-is-a-logarithm) derives it). Its
Hessian has the eigenvalues $-2G\matter\lambda/b^2$ along the line to the beam, $+2G\matter\lambda/b^2$ across it and 0
along it. So the tide beside the beam has the eigenvalues

$$(-1, 1, 0) \times \frac{4GP}{c^3b^2} ,$$

as the paper writes. For 100 kW, $\matter\lambda = 2 \times 10^5/(2.998\times10^8)^3 =
7.4\times10^{-21}\unit{kg\,m^{-1}}$, and at a metre the tide is $9.9\times10^{-31}\unit{s^{-2}}$, the paper's
$10^{-30}$. That is $9.4\times 10^{21}$ times weaker than the tide of a person a metre away,
$9.3\times10^{-9}\unit{s^{-2}}$ (chapter
[1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)), the paper's "a
part in $10^{22}$".

**The bench.** The bench that holds the laser and the absorber apart runs along the beam, and the beam's push puts it in
tension, a momentum flux of $-P/c$ over its cross-section: a line of $-P/c^3$ kilograms per metre. Beam and bench weigh
the beam's energy over $c^2$, as von Laue's theorem requires. A pixel reads the paper's $2P/c^3$ per metre only if **the
bench is much farther from the pixel than the beam is**; with the bench as near as the beam, it would read $P/c^3$, the
energy alone.

**A box of light weighs its energy.** In a box with mirrored walls, the **photon box**, light of total energy $E_{\rm
light}$ has the pressure of the third section, so its diagonal momentum fluxes add up to $E_{\rm light}$. The walls'
tension adds $-E_{\rm light}$, so the box pulls with $E_{\rm light}/c^2$ (and the walls' own mass), not twice that
(Figure [](#fig:beam-and-box)). Pressure gravitates where it is, but a bound body's stresses add up to zero.

![Look first at the two rings: the beam and a line of matter of twice its energy over $c^2$ stretch a ring alike, when
the bench that holds the laser and the absorber apart is far away. Below, the same light, sealed in a mirrored box,
pulls only with its energy over $c^2$, because the walls' tension cancels the light's pressure. The rings' deformation
is exaggerated, and the tide's squeeze, at right angles to the page, is not
drawn.](tut-stress-beam-box){#fig:beam-and-box}

**Neutrinos.** *Matter at the pixel* also treats dark matter, the Casimir gap (next section) and the cosmological
constant's $-\Lambda c^2$, which chapter [7.3](/tutorial/geometry/einstein-equation/#pressure-and-stress-gravitate)
computes. Neutrinos streaming from a supernova at nearly $c$ are null dust, and chapter
[7.3](/tutorial/geometry/einstein-equation/#inside-matter-the-tide-has-a-part-fixed-by-the-matter-at-that-point) finds
the squeeze that they make across the line to the star, $GL/c^3r^2$ for the luminosity $L$ in watts at the distance $r$.
The paper's [*An exploding star*](/paper/#par:an-exploding-star) compares it with the change of the star's own tide
across that line, $GL\Delta t/c^2r^3$, as a burst that lasts $\Delta t$ carries off the mass $L\Delta t/c^2$: the ratio
is $r/c\Delta t$. For **a burst of steady luminosity lasting 10 s** (the neutrinos of the 1987 supernova arrived over 6
to 12 s) at ten kiloparsecs, $3.1\times10^{20}\unit{m}$, it is $1.0\times10^{11}$, the paper's "some $10^{11}$". A real
burst gives much of its energy in its first second or two, which makes the peak squeeze a few times larger.

## Along a ray of light the table gives the energy less c times the momentum

We want the $\mathcal N$ of the paper's [](/paper/#eq:shock-even), the energy less $c$ times the momentum along $z$ that
crosses a wave's front at each point (chapter
[6.4](/tutorial/relativity/energy-and-momentum/#a-sideways-kick-that-keeps-q-fixes-the-energy-gained)), which the paper
defines as "the integral of $T_{\mu\nu}k^\mu k^\nu$ along the null ray through that point". For a wave along $+z$,
$k^\mu = (1, 0, 0, 1)$. Lowering both indices (chapter
[6.2](/tutorial/relativity/spacetime-vectors/#lowering-an-index-changes-only-the-sign-of-time)) flips the sign of
$\matter T^{0z}$ alone among the entries that enter, so

$$\matter T_{\mu\nu}k^\mu k^\nu = \matter T^{00} - 2\matter T^{0z} + \matter T^{zz} .$$

For a fluid at rest it is $\matter\rho c^2 + \matter p$. For a beam along $+z$ it is zero, and along $-z$ it is $4F/c$.

**One particle.** A particle of rest mass $\matter m$, energy $E$ and momentum $\vect p$ at $\vect x_p(t)$ is dust
gathered at one point: in its own frame its density is $\matter m$ times chapter
[1.3](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point)'s delta function. A delta
function obeys $\delta(ax) = \delta(x)/|a|$ for any number $a$, since substituting $y = ax$ gives $\int\delta(ax)\,\dd x
= 1/|a|$. Distances along the motion measured in the room are $1/\obs\gamma$ of the particle's own (6.1), so its delta
function along the motion is $\delta(\obs\gamma x_\parallel) = \delta(x_\parallel)/\obs\gamma$, with $x_\parallel$ the
room's distance from it along the motion. With this density, $(\matter m/\obs\gamma)\,\delta^3(\vect x - \vect x_p(t))$,
[](#eq:dust) gives $\matter T^{\mu\nu} = (\matter m/\obs\gamma)\,\obs u^\mu\obs u^\nu\delta^3 = (c^2/E)\,p^\mu
p^\nu\delta^3$, since $p^\mu = \matter m\obs u^\mu$ and $E = \obs\gamma\matter mc^2$. As $p_\mu k^\mu = -(E/c - p_z)$,

$$\matter T_{\mu\nu}k^\mu k^\nu = \frac{(E - cp_z)^2}{E}\,\delta^3\bigl(\vect x - \vect x_p(t)\bigr) .$$

The ray is $z = ct - u_0$ at fixed $\vect x_\perp = (x, y)$, with $u_0$ its value of 6.4's light-cone coordinate $u =
ct - z$, and we mark its points by $\ell = ct$, in metres. Along it $z - z_p$ changes by $1 - \obs v_z/c$ per metre
of $\ell$, because the particle moves along $z$ too. By the rule $\delta(ax) = \delta(x)/|a|$, the ray crosses the
delta function in $z$ with the weight $1/(1 - \obs v_z/c) = E/(E - cp_z)$ (Figure [](#fig:ray-crossing)), using
$\obs v_z = p_zc^2/E$, and one factor of $E - cp_z$ cancels:

$$\boxed{\begin{aligned}\int\matter T_{\mu\nu}k^\mu k^\nu\,\dd\ell &= (E - cp_z)\\ &\quad\times\delta^2\bigl(\vect
x_\perp - \vect x_{p\perp}\bigr)\end{aligned}} \label{eq:N}$$

Summed over a body's particles, this is the paper's $\sym{crossing-energy}{\matter{\mathcal N}} = c\sum_aq_a\,
\delta^2(\vect x_\perp - \vect x_a)$ of Appendix C, with 6.4's $q = E/c - p_z$, in joules per square metre. For slow
matter $q_a \approx \matter m_ac$, so $\matter{\mathcal N} = \matter\Sigma c^2$, with
$\sym{projected-density}{\matter\Sigma}$ the mass per square metre along the ray.

![Look first at the crossing: a ray meets the particle once, and the faster the particle runs ahead of the ray, the
longer the stretch of the ray its crossing takes. That is the factor $1/(1 - \obs v_z/c)$, which turns $(E -
cp_z)^2/E$ into $E - cp_z$.](tut-stress-null-crossing){#fig:ray-crossing}

**The null energy condition.** For dust, $\matter T_{\mu\nu}k^\mu k^\nu = \matter\rho(\obs u_\mu k^\mu)^2 \ge 0$; for a
fluid at rest it is $\matter\rho c^2 + \matter p$ along every null direction; for light, a sum of such squares. So
ordinary matter, with $\matter\rho c^2 + \matter p \ge 0$, has $\matter T_{\mu\nu}k^\mu k^\nu \ge 0$ along every null
direction, the **null energy condition**, which is why $\matter{\mathcal N} \ge 0$ and the paper's
[](/paper/#eq:shock-even) cannot be negative. Equality holds for light moving with the ray.

The paper's Casimir gap breaks it. Between two flat metal plates $a = 1\unit{\mu m}$ apart, quantum theory gives the
electromagnetic field less energy than in the empty space outside (quoted): the energy density is
$\sym{casimir-energy-density}{u} = -\pi^2\hbar c/720a^4 = -4.3\times 10^{-4}\unit{J\,m^{-3}}$, with $\hbar$ the reduced
Planck constant.[^u] The momentum flux across the plates is $3u$, a tension, since the plates attract, and along them
$-u$ in each direction. Along the normal, $\matter T_{\mu\nu}k^\mu k^\nu = u + 3u = 4u < 0$.[^casimir-nec]

## Some stresses are invisible to every ray

Some stress tensors, the paper says, give nothing along any ray. Take any smooth function $\phi$, in joules per metre,
that is zero outside some region, and build

$$\matter T_\phi^{\mu\nu} = \bigl(\partial^\mu\partial^\nu - \field\eta^{\mu\nu}\Box\bigr)\phi ,$$

with 6.2's wave operator $\Box = \field\eta^{\mu\nu}\partial_\mu\partial_\nu$. Its divergence is zero for every $\phi$
(6.2's problem on the paper), so conservation allows it. Along a null ray $\field\eta_{\mu\nu}k^\mu k^\nu = 0$ removes
the second term, which leaves $\dd^2\phi/\dd\ell^2$, the second derivative along the ray. Its integral is the difference
of $\dd\phi/\dd\ell$ at the two ends, where $\phi$ is zero:

$$\boxed{\;\int\matter T_{\phi\,\mu\nu}k^\mu k^\nu\,\dd\ell = 0\;}$$

So adding $\matter T_\phi$ to a body changes no ray's $\matter{\mathcal N}$. In a body at rest a steady $\phi$ adds
$\nabla^2\phi$ to the energy density, as the paper says, with the stresses $\partial_i\partial_j\phi -
\delta_{ij}\nabla^2\phi$, whose diagonal adds up to $\nabla^2\phi - 3\nabla^2\phi = -2\nabla^2\phi$. If two interiors
differ by such a $\matter T_\phi$ and both have stresses below $S$, each added diagonal stress is below $2S$, their sum
is below $6S$, and the energy densities differ by at most $3S$. Steel near its breaking strength has $S \approx
10^9\unit{Pa}$, $1.4\times10^{-12}$ of its $\matter\rho c^2$ (with $\matter\rho = 7900\unit{kg\,m^{-3}}$). So in
ordinary matter such a $\phi$ could change the energy density by only about a part in $10^{12}$, which is why the paper
says it "is excluded when the stresses are small beside $\rho c^2$".

::: try {#stress-energy-table}
The table $\matter T^{\mu\nu}$ as a grid of sixteen cells, coloured by sign, with its blocks shaded: the energy
density, the two flux blocks, which the symmetry makes equal, and the momentum flux. The selector chooses what fills
it: dust, a gas at rest, a gas in a steel shell, a beam along $z$, the beam with its bench, light in a mirrored box, or
the Casimir gap. For the bodies held together by walls, each cell is the average over the body. The slider boosts the
observer along $x$ or $z$. Beside the table stand $\matter T^{00}$, the trace that every observer agrees on, the sum
$\matter T^{00} + \matter T^{11} + \matter T^{22} + \matter T^{33}$ that gravitates in this frame, the stresses
integrated over a bound body, and $\matter T_{\mu\nu}k^\mu k^\nu$ along $+z$ or $-z$.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, choose
the Casimir gap and find the direction along which $\matter T_{\mu\nu}k^\mu k^\nu$ is negative.
:::

::: check
### Q

A steel rod is squeezed along $x$ with $10^8\unit{Pa}$. What is its $\matter T^{xx}$?

### A

$+10^8\unit{Pa}$, because a squeeze hands momentum along $+x$ toward $+x$, as a gas does. Chapter 4.3's stress is
$-10^8\unit{Pa}$.

### Q

A 12-litre diving cylinder holds about 3 kg of air at 200 bar. What does the air's pressure add to its active mass, and
what does the steel add?

### A

$3\matter pV/c^2 = 3 \times 2\times10^7 \times 0.012/(2.998\times10^8)^2\unit{kg} = 8.0\times10^{-12}\unit{kg}$, three
parts in $10^{12}$ of the air. The steel's tension adds exactly minus that.
:::

**The idea to keep: energy, momentum and their flows make one symmetric table, conserved in every frame. Gravity's
source is the energy plus the sum of the stresses, so a free beam pulls twice as hard as its energy suggests, while a
body at rest weighs its energy over $c^2$, because the stresses that hold it together add up to zero.**

::: problems
### Practice

A laser of 1 W shines on a mirror at normal incidence. What force does it exert, and what are $\matter T^{00}$ and
$\matter T^{zz}$ of the incoming beam if it is 1 mm² across?

::: solution
The beam brings the momentum $P/c$ each second and the mirror returns it, so the force is $2P/c = 2/(2.998\times
10^8)\unit{N} = 6.7\times10^{-9}\unit{N}$. The energy flux is $F = 1\unit{W}/10^{-6}\unit{m^2} = 10^6\unit{W\,m^{-2}}$,
so $\matter T^{00} = \matter T^{zz} = F/c = 3.3\times10^{-3}\unit{J\,m^{-3}}$.
:::

### Stretch

Combine this chapter with chapter 1.6's forces that cancel inside a body. A steel rod of length $L = 1\unit{m}$ and
cross-section $A = 1\unit{cm^2}$ is held at the tension $\tau = 10^8\unit{Pa}$ by a steel tube around it, which it
squeezes. Show that $\int\matter T^{xx}\,\dd V$ over both is zero.

::: solution
The rod has $\matter T^{xx} = -\tau$ over its volume $AL$. The tube carries the same force $\tau A$ as a squeeze over
its cross-section $A_t$, so it has $+\tau A/A_t$ over its volume $A_tL$. The sum, $-\tau AL + \tau AL$, is zero,
although the rod's tension alone would take $\tau AL/c^2 = 1.1\times10^{-13}\unit{kg}$ from the active mass.
:::

### The paper

The paper's [*A mass that passes*](/paper/#par:a-mass-that-passes) sends a mass $\mu$ past a body at rest on a straight
line at the speed $V$, crossing the plane through the body at right angles to its path at the point $\vect b$. A part of
the body over the point $\vect s$ of that plane receives the velocity $C(\vect b - \vect s)/|\vect b - \vect s|^2$, with
$C = 2G\mu/V$ in $\mathrm{m^2\,s^{-1}}$. The body gains the energy of the paper's equation

{{paper eq:pass}}

where $\Sigma(\vect s)$ is the body's mass per square metre seen along the path. A particle without mass, with the
momentum $p$ (not a pressure), gives instead the paper's equation

{{paper eq:massless-pass}}

Show that for slow matter $\mathcal N = \Sigma c^2$, so that the second is the first with $C = 4Gp/c^2$, twice Newton's
$2G\mu/V$ at $\mu V = p$ and $V = c$.

::: solution
For a body at rest $\matter T^{0z} = 0$, so the contraction is $\matter\rho c^2 + \matter T^{zz}$, and with $\matter
T^{zz}$ negligible its integral along $z$ is $c^2\int\matter\rho\,\dd z = \matter\Sigma c^2$. Then the paper's
[](/paper/#eq:massless-pass) becomes $\Delta E = (8G^2p^2/c^4)\int\matter\Sigma/|\vect b - \vect s|^2\,\dd^2s$, which is
the paper's [](/paper/#eq:pass) with $C^2/2 = 8G^2p^2/c^4$, that is $C = 4Gp/c^2$. Newton's $2G\mu/V = 2G\mu V/V^2$ is
$2Gp/c^2$ at $\mu V = p$ and $V = c$, half of it.
:::
:::

::: paper
- [Section I](/paper/#sec:introduction): "its momentum and stress too", the source [](#eq:source).
- [Section X](/paper/#sec:affordances) and Table [](/paper/#tab:affordances): the beam's $2P/c^3$ per metre and its
  tide.
- [Section VIII](/paper/#sec:one-pixel), [*Matter at the pixel*](/paper/#par:matter-at-the-pixel): the trace of the
  tide inside matter; the Casimir gap.
- [Section V](/paper/#sec:waves): the $T_{kl}$ of the paper's [](/paper/#eq:wave-zone), with the second section's sign.
- [Section XI](/paper/#sec:vistas), [*An exploding star*](/paper/#par:an-exploding-star): the neutrinos' squeeze.
- [Section XIII](/paper/#sec:second-order), [*A mass that passes*](/paper/#par:a-mass-that-passes): $\mathcal N$, the
  paper's equations [](/paper/#eq:shock-even), [](/paper/#eq:massless-pass) and [](/paper/#eq:pass), and the stresses
  that no ray sees.
- [Appendix C](/paper/#app:proofs), [*The energy given by an impulsive
  wave*](/paper/#par:the-energy-given-by-an-impulsive-wave): $\mathcal N = c\sum_aq_a\delta^2$, derived in [](#eq:N).
:::

::: deeper
- The GR course's
  [section 11.1](https://neovand.github.io/general-relativity/chapter-11.html#11-1-a-tensor-is-a-shipping-manifest-for-energy-and-momentum)
  reads the table as what crosses each surface;
  [11.5](https://neovand.github.io/general-relativity/chapter-11.html#11-5-pressure-gravitates-and-the-photon-box-is-not-a-mass-doubling-machine)
  treats the photon box, and
  [section 12.4](https://neovand.github.io/general-relativity/chapter-12.html#12-4-deriving-the-newtonian-limit-including-the-factor-of-two)
  derives the source [](#eq:source).
- R. C. Tolman, P. Ehrenfest and B. Podolsky, "On the gravitational field produced by light", *Physical Review* 37,
  602 (1931): the beam's factor of two.
- B. F. Schutz, *A First Course in General Relativity* (2nd ed., Cambridge, 2009), chapter 4: dust, fluids and
  conservation, in the paper's signature.
:::

[^letters]: Two letters have two meanings, as in the paper. With its indices, $\Lambda^\mu{}_\alpha$ is the boost; a
    bare $\Lambda$ is the cosmological constant. With its indices, $\field\eta_{\mu\nu}$ is the metric; a bare
    $\obs\eta$, in the observer's colour, is the rapidity of chapter 6.1.

[^sym]: In general it follows from the conservation of angular momentum in every frame (stated).

[^F]: The paper's letter for an energy flux, in Sections VIII and XI; not a force, nor chapter 6.6's complex field
    $\light{\vect F} = \light{\vect E} + ic\light{\vect B}$.

[^boost]: By 6.2's rule an observer moving along the beam with the rapidity $\obs\eta$ finds every entry multiplied
    by $\obs\gamma^2(1 - \obs\beta)^2 = e^{-2\obs\eta}$: chapter 6.3's Doppler factor $e^{-\obs\eta}$ for each
    photon's energy, times the same for the number of photons met each second. At $0.6c$, $\obs\eta = \ln 2$.

[^star]: In a star the pressures add up instead to minus its gravitational energy (the virial theorem). It still
    weighs its whole energy over $c^2$, the negative gravitational energy included, but showing this needs gravity's
    own share of the source (stated).

[^dust-two]: For a steady stream of dust at $\obs v$ past a pixel at rest the source is
    $\obs\gamma^2\matter\rho c^2(1 + \obs\beta^2)$, twice the energy density as $\obs\beta \to 1$: the factor of
    two by which light bends more than Newton's theory predicts.

[^u]: The paper's letter; not a four-velocity $\obs u^\mu$, nor 6.4's light-cone coordinate $u$.

[^casimir-nec]: A ray along the normal also crosses the plates, whose positive mass is far larger, so its
    $\matter{\mathcal N}$ stays positive.
