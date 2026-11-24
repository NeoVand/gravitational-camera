---
id: '12.1'
title: 'Stars, compact objects, supernovae and the Galaxy'
question: 'Section XI takes the camera to two black holes "ten seconds before they merge … 2200 kilometres apart", to a collapsing star that sends out "a sixth of a solar mass" in neutrinos, and to a Galaxy of "tens of millions of close pairs of white dwarfs" whose glow makes its centre "about a hundred times brighter than the opposite side". What are these objects, and why do their numbers come out as they do?'
part: '12'
requires: ['1.3', '1.6', '1.8', '4.2', '5.5', '6.4', '6.5', '7.7', '8.2', '11.1']
paper: [sec:vistas, fig:milky-way, eq:column, fig:binary-field, fig:sun-lens, eq:one-wave, eq:pass, sec:hair, sec:second-order, sec:one-pixel]
figures: [fig:milky-way]
live: []
depth: A
---

<!-- hero: Part 12's hero (P6b-DECISIONS item 11, decided: the new Galaxy figure), made after the part's chapters in
the 3D stone pipeline, with image-model candidates in two runs as style references only. The Galaxy edge-on as a thin
bright disc with its bulge, from this chapter's model density (thin disc 3.5e10 Msun, 2.6 kpc by 0.3 kpc; thick disc
0.6e10, 2.0 by 0.9; bulge 1.5e10, 0.5 kpc, flattened 0.6); a few white-dwarf pairs as tiny orbiting dots with faint
rings; the Sun 8.2 kpc from the centre and 20 pc above the mid-plane, with its camera; the line of sight to the centre
crossing the dark dust lane (the model's dust, 3.2 kpc by 0.1 kpc, its opacity from code); behind it the uniform
0.905 K glow of 12.2 with one black disc. Every mark from code. -->

**What you need:** chapters [1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts) (the
shell theorem and $\matter m(r)$),
[1.6](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel) (equal and opposite forces),
[1.8](/tutorial/newton/orbits-and-kicks/#a-circular-orbit-is-a-fall-that-keeps-missing) (Kepler's law for a pair),
[4.2](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share) (a gas's
$\tfrac32\kB T$ per particle and its pressure),
[5.5](/tutorial/waves/radiance/#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line) (the glow added along a
line), [6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-mass-is-its-total-energy-so-heat-has-weight) (mass is
energy), [6.5](/tutorial/relativity/stress-energy/#the-stresses-of-a-body-at-rest-add-up-to-zero) (von Laue's
theorem), [7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole)
(the power of a turning pair),
[8.2](/tutorial/quantum/operators/#the-uncertainty-relation-is-robertsons-inequality-for-position-and-momentum) (the
uncertainty relation) and
[11.1](/tutorial/black-holes/schwarzschild/#outside-a-round-body-einsteins-field-is-fixed-by-the-mass-alone)
(Birkhoff's theorem and the bending of light). Chapters 7.3, 7.8, 9.5, 10.3 and R9b help, and are
recalled where used.

The paper's [Section XI](/paper/#sec:vistas) points the camera at the sky. Its two black holes, "each thirty times
the mass of the Sun", are "ten seconds before they merge … 2200 kilometres apart". Its collapsing star sends out "a
sixth of a solar mass" in neutrinos. Its Galaxy holds "tens of millions of close pairs of white dwarfs", whose glow in
gravitational waves makes the centre "about a hundred times brighter than the opposite side", while dust hides that
centre from light. So we ask what these objects are, and why their numbers come out as they do.

{{paper fig:milky-way}}

By the end of the chapter we can compute the bright centre of panel (b) and the dust that hides it in panel (a).

::: plain
A star is a ball of hot gas. Its gravity pulls every layer inward, and the pressure of the hotter, denser gas below
pushes it back out. In the Sun this balance needs millions of degrees at the centre.

When a star runs out of fuel, it shrinks until quantum mechanics alone keeps its particles apart. Electrons hold up
a white dwarf in this way, and neutrons hold up a neutron star. Above about one and a half solar masses electrons
cannot hold a star, and above about two nothing can: a black hole remains.

A core that collapses into a neutron star frees a sixth of a solar mass of energy, carried off by neutrinos. Two
compact stars in orbit lose energy to gravitational waves and spiral together ever faster. In those waves the Galaxy's
pairs of white dwarfs show where its stars are, through the dust that hides them from light.
:::

## A star holds itself up by the pressure of its gas

We want the pressure at the centre of a star, because it sets how hot the star must be. We assume that **the star is
round and at rest**. Here $\sym{pressure}{\matter p}(r)$ is the **pressure** at the distance $r$ from the centre, the
force per unit area with which the gas pushes on any surface, in pascals. The density is
$\matter\rho(r)$, in kilograms per cubic metre, and $\sym{mass-inside}{\matter m}(r)$ is the mass inside the radius
$r$, which grows as $\dd\matter m/\dd r = 4\pi r^2\matter\rho$ (chapter 1.3).

Take a thin slab of gas between $r$ and $r + \dd r$, with an area $A$ facing the centre. Its mass is $\matter\rho
A\,\dd r$. By the shell theorem only the mass inside $r$ pulls on it, with the force $G\matter m\matter\rho A\,\dd
r/r^2$ toward the centre. The gas below pushes it outward with the force $\matter p(r)A$, and the gas above pushes it
inward with $\matter p(r + \dd r)A$. The three forces add up to zero, and dividing by $A\,\dd r$ gives

$$\boxed{\;\frac{\dd\matter p}{\dd r} = -\frac{G\matter m(r)\,\matter\rho(r)}{r^2}\;} \label{eq:hydrostatic}$$

This is **hydrostatic balance**: the pressure falls outward at the rate needed to hold each layer up. Both sides are
in $\mathrm{Pa\,m^{-1}}$, which is $\mathrm{kg\,m^{-2}\,s^{-2}}$.

<!-- diagram: tut-stars-shell — spec: a quarter of a round star in section, warm ground darkening toward the centre;
one thin slab at radius r, area A, thickness dr, drawn as a small curved box; three arrows on it: the pull G m(r) rho A
dr / r^2 toward the centre (field colour), the push p(r) A outward from below and p(r + dr) A inward from above (matter
colour, the lower arrow slightly longer); the inner ball of mass m(r) shaded, the shell outside it unshaded and marked
"pulls nothing" (1.3's shell theorem). Thin single strokes, labels off the geometry. Caption: "Look first at the two
pressure arrows on the slab: the push from below is slightly larger than the push from above, and the difference holds
the slab against the pull of the mass inside it. The shell outside pulls nothing. Schematic." -->

**A uniform ball.** If the density is the same everywhere, $\matter m(r) = \tfrac43\pi r^3\matter\rho$, so $\dd\matter
p/\dd r = -\tfrac43\pi G\matter\rho^2r$. The pressure is zero at the surface $R$, and integrating from the centre to
$R$ gives the **central pressure**

$$\sym{central-pressure}{\matter p_c} = \frac23\pi G\matter\rho^2R^2 = \frac{3G\matter M^2}{8\pi R^4} ,$$

with $\matter M$ the whole mass. For the Sun, $\matter M = 1.989\times10^{30}$ kg and $R = 6.96\times10^8$ m give
$1.3\times10^{14}$ Pa, 1.3 billion times the pressure of the air.

**How hot.** The Sun's gas is ionized: nuclei and free electrons each move on their own. A gas of $\matter n_{\rm gas}$
particles per cubic metre has the pressure $\matter n_{\rm gas}\kB T$ (chapter 4.2), with $T$ the temperature in kelvin
and $\kB = 1.381\times10^{-23}\unit{J\,K^{-1}}$ Boltzmann's constant. A kilogram holds $1/\bar mm_p$ particles, with
$m_p = 1.673\times10^{-27}$ kg the proton's mass and $\sym{mean-particle-mass}{\bar m}$ the **mean particle mass** in
proton masses, a pure number: $\tfrac12$ for ionized hydrogen, where a proton and an electron share one proton's mass,
and about 0.6 for the Sun's hydrogen and helium (stated).[^mbar] So

$$\matter p = \frac{\matter\rho\,\kB T}{\bar mm_p} .$$

The uniform Sun, of mean density $1410\unit{kg\,m^{-3}}$, has $T = 6.9\times10^6$ K at its centre: gravity alone, with
no nuclear physics, makes a star millions of kelvin hot inside.

**Limit.** The pressure did not need the gas law, so it holds for any round body that compresses little. For the Earth
it gives $1.7\times10^{11}$ Pa, half the $3.6\times10^{11}$ Pa that seismology finds at the centre (stated), because
the Earth's iron core is denser than its mean. The Sun, too, is denser at its centre, as [Eddington's
model](#eddingtons-model-ties-the-pressure-to-the-density) shows.

## In a bound system the motion is half the binding

A star's temperature also follows from a rule for every **self-gravitating** system, one held together by its own
gravity: a star, a cluster of stars, a pair in orbit. We want a relation between its kinetic and potential energies,
on average over a long time.

We take point masses $\matter m_a$, labelled by $a = 1, 2, \dots$, with positions $\vect x_a$ and momenta $\vect p_a$
(in bold: not the pressure). The **total potential energy** $\sym{total-potential-energy}{U}$, in joules, is the sum
of the potential energies of all the pairs, each pair counted once:

$$U = -\sum_{\text{pairs } a < c}\frac{G\matter m_a\matter m_c}{|\vect x_a - \vect x_c|} ,$$

and $K$ is the total kinetic energy. We assume that **gravity is the only force** and that **the system stays
bounded**: no part flies off, and no speed grows without limit. We follow the quantity $S = \sum_a\vect
p_a\cdot\vect x_a$, in joule seconds. By the product rule,

$$\begin{aligned}
\frac{\dd S}{\dd t} &= \sum_a\dot{\vect p}_a\cdot\vect x_a + \sum_a\vect p_a\cdot\dot{\vect x}_a\\
&= \sum_a\vect F_a\cdot\vect x_a + 2K,
\end{aligned}$$

because $\dot{\vect p}_a$ is the force $\vect F_a$ on part $a$, and $\vect p_a\cdot\dot{\vect x}_a = \matter m_av_a^2$
is twice the part's kinetic energy.

The force on part $a$ is the sum of the pulls of all the other parts. The pull on part $a$ by part $c$ is

$$\vect F_{ac} = -\frac{G\matter m_a\matter m_c\,(\vect x_a - \vect x_c)}{|\vect x_a - \vect x_c|^3},$$

and $\vect F_{ca} = -\vect F_{ac}$ (chapter 1.6). So $\sum_a\vect F_a\cdot\vect x_a = \sum_a\sum_{c \ne a}\vect
F_{ac}\cdot\vect x_a$. Each pair $a < c$ appears in this double sum twice, once as $\vect F_{ac}\cdot\vect x_a$ and
once as $\vect F_{ca}\cdot\vect x_c$. We collect the two terms of each pair:

$$\begin{aligned}
\sum_a\vect F_a\cdot\vect x_a &= \sum_{\text{pairs } a < c}\bigl(\vect F_{ac}\cdot\vect x_a + \vect F_{ca}\cdot\vect x_c\bigr)\\
&= \sum_{\text{pairs } a < c}\vect F_{ac}\cdot(\vect x_a - \vect x_c)\\
&= -\sum_{\text{pairs } a < c}\frac{G\matter m_a\matter m_c}{|\vect x_a - \vect x_c|} = U .
\end{aligned}$$

The second line uses $\vect F_{ca} = -\vect F_{ac}$, and the third puts in the pull. So $\dd S/\dd t = 2K + U$.

The **time average** of a quantity $f$ over a time $t_0$ is $\sym{time-average}{\langle f\rangle} = (1/t_0)\int_0^{t_0}
f\,\dd t$. The average of $\dd S/\dd t$ is $[S(t_0) - S(0)]/t_0$. In a bounded system $S$ stays bounded, so this
average goes to zero as $t_0$ grows, and

$$\boxed{\;2\langle K\rangle = -\langle U\rangle .\;} \label{eq:virial}$$

This is the **virial theorem**. Chapter
[1.8](/tutorial/newton/orbits-and-kicks/#energy-and-angular-momentum-fix-the-size-and-shape-of-an-orbit)'s circular
orbit checks it, with $K = -\tfrac12U$ at every moment. A bound system's energy is then $E = -\langle K\rangle$, so a
system that gains energy ends slower: a star cluster heated by a passing mass swells (Lyman Spitzer, 1958). A star that
shines loses energy, so it contracts and grows hotter inside.

**The Sun.** We build a uniform ball shell by shell. A shell of mass $4\pi r^2\matter\rho\,\dd r$ brought from far
away onto the ball of mass $\tfrac43\pi r^3\matter\rho$ inside it adds $-G(\tfrac43\pi r^3\matter\rho)(4\pi
r^2\matter\rho\,\dd r)/r$, by the shell theorem. Integrating $r^4$ from 0 to $R$ gives $U =
-\tfrac{16}{15}\pi^2G\matter\rho^2R^5 = -\tfrac35G\matter M^2/R$. The gas holds $\matter M/\bar mm_p$ particles, each
with the mean kinetic energy $\tfrac32\kB T$, so $2K = -U$ gives

$$T = \frac{\bar m\,G\matter Mm_p}{5\kB R} = 2.8\times10^6\unit K$$

for $\bar m = 0.6$. Solar models fitted to the Sun's measured properties put its centre at $1.57\times10^7$ K
(stated), between five and six times hotter, because the theorem gives an average over the mass, and the centre is
the hottest part.

**For a fluid star**, the case that chapter 6.5 left for here, we multiply hydrostatic balance by $4\pi r^3$ and
integrate over the star:

$$\int_0^R4\pi r^3\,\frac{\dd\matter p}{\dd r}\,\dd r = -\int_0^R\frac{G\matter m}{r}\,4\pi r^2\matter\rho\,\dd r .$$

On the left we integrate by parts. The term $4\pi r^3\matter p$ is zero at both ends, since $\matter p(R) = 0$, and
$-\int_0^R12\pi r^2\matter p\,\dd r = -\int3\matter p\,\dd V$ remains. On the right, $4\pi r^2\matter\rho\,\dd r$ is a
shell's mass $\dd\matter m$, and $-G\matter m\,\dd\matter m/r$ is the energy the shell adds, so the right side is $U$:

$$\boxed{\;\int3\matter p\,\dd V = -U\;} \label{eq:virial-fluid}$$

For a gas $\tfrac32\matter p$ is the kinetic energy per cubic metre, so the left side is $2K$: the virial theorem
again, with the pressure as the motion of the particles. The uniform ball checks it, with $\matter p = \matter p_c(1 -
r^2/R^2)$ and $\int3\matter p\,\dd V = \tfrac{8\pi}5\matter p_cR^3 = \tfrac35G\matter M^2/R$.

**Why von Laue's theorem does not hold here.** Chapter
[6.5](/tutorial/relativity/stress-energy/#the-stresses-of-a-body-at-rest-add-up-to-zero)'s von Laue theorem says that
the pressures and tensions of a static body add up to zero. A star's add up instead to $-U$, which is positive. The
theorem's proof needs every force inside the body to be a stress in $\matter T^{\mu\nu}$, as in a steel shell. A star
is held together by gravity, whose own stress is not part of $\matter T^{\mu\nu}$, so the theorem does not apply. The
star still weighs its whole energy over $c^2$, its negative gravitational energy included, as Richard Tolman showed
in 1930 (stated).

::: history
### Clausius, Eddington and Chandrasekhar

Rudolf Clausius stated the virial theorem in 1870, for the molecules of a gas. Arthur Eddington built his standard
model in papers of 1916 to 1918 and set it out in full in *The Internal Constitution of the Stars* (1926). Subrahmanyan
Chandrasekhar found the limit on a white dwarf's mass in 1930 and published it in 1931.
:::

## Eddington's model ties the pressure to the density

The uniform ball is too crude: the Sun is far denser at its centre. We want the density inside a star whose pressure
depends on its density alone. We assume that **the pressure is a power of the density**,

$$\matter p = \matter p_c\Bigl(\frac{\matter\rho}{\matter\rho_c}\Bigr)^{1 + 1/n} ,$$

with $\sym{central-density}{\matter\rho_c}$ the central density[^rhoc] and $\sym{polytropic-index}{n}$ a pure number,
not a count. Such a star is a **polytrope**, and $n$ is its **polytropic index**. **Eddington's standard model** of the
Sun has $n = 3$. Eddington assumed that the pressure of the Sun's light, which grows as $T^4$ (chapter 10.1), is the
same fraction of the gas's pressure $\matter\rho\kB T/\bar mm_p$ everywhere in the star. Only the constancy of this
fraction matters, not its size. Then $T^4 \propto \matter\rho T$, so $T^3 \propto \matter\rho$ and $\matter p \propto
\matter\rho T \propto \matter\rho^{4/3}$.[^light]

**The equation.** Hydrostatic balance gives $(r^2/\matter\rho)\,\dd\matter p/\dd r = -G\matter m$. We differentiate
with respect to $r$ and use $\dd\matter m/\dd r = 4\pi r^2\matter\rho$:

$$\frac1{r^2}\frac{\dd}{\dd r}\Bigl(\frac{r^2}{\matter\rho}\frac{\dd\matter p}{\dd r}\Bigr) = -4\pi G\matter\rho .$$

We write $\matter\rho = \matter\rho_c\theta^n$, so that $\matter p = \matter p_c\theta^{n+1}$, and $r = L\xi$, with the
length $L$ given by $L^2 = (n + 1)\matter p_c/4\pi G\matter\rho_c^2$. Then $\theta(\xi)$ obeys the **Lane–Emden
equation**

$$\boxed{\;\frac1{\xi^2}\frac{\dd}{\dd\xi}\Bigl(\xi^2\frac{\dd\theta}{\dd\xi}\Bigr) = -\theta^n\;} \label{eq:lane-emden}$$

with $\theta = 1$ and $\dd\theta/\dd\xi = 0$ at the centre (the box below). Here $\sym{lane-emden-theta}{\theta}$ and
$\sym{lane-emden-xi}{\xi}$ are pure numbers,[^xi] and the surface is the first zero $\xi_1$ of $\theta$. **Special
case:** for $n = 0$ the density is uniform, $\theta = 1 - \xi^2/6$ and $\xi_1 = \sqrt6$, so $R^2 = 6L^2 = 3\matter
p_c/2\pi G\matter\rho_c^2$: the uniform ball's central pressure again.

::: derivation
### The substitution, step by step

With $\matter\rho = \matter\rho_c\theta^n$ and $\matter p = \matter p_c\theta^{n+1}$, the chain rule gives $\dd\matter
p/\dd r = (n + 1)\matter p_c\theta^n\,(\dd\theta/\dd\xi)/L$. Dividing by $\matter\rho$ cancels $\theta^n$:

$$\frac{r^2}{\matter\rho}\frac{\dd\matter p}{\dd r} = \frac{(n + 1)\matter p_cL}{\matter\rho_c}\,\xi^2\frac{\dd\theta}{\dd\xi} .$$

The outer derivative, $\dd/\dd r = (1/L)\,\dd/\dd\xi$, and $1/r^2 = 1/L^2\xi^2$ give

$$\frac{(n + 1)\matter p_c}{\matter\rho_cL^2}\,\frac1{\xi^2}\frac{\dd}{\dd\xi}\Bigl(\xi^2\frac{\dd\theta}{\dd\xi}\Bigr) =
-4\pi G\matter\rho_c\theta^n .$$

With the stated $L^2$ the factor in front is $4\pi G\matter\rho_c$, and dividing by it gives the Lane–Emden equation.
The unit of $\matter p_c/G\matter\rho_c^2$ is $\mathrm{(kg\,m^{-1}s^{-2})/(m^3kg^{-1}s^{-2}\,kg^2m^{-6})} =
\mathrm{m^2}$. The mass is $4\pi L^3\matter\rho_c\int\xi^2\theta^n\,\dd\xi$, and the equation turns $\xi^2\theta^n$
into $-\dd(\xi^2\,\dd\theta/\dd\xi)/\dd\xi$, so $\matter M = 4\pi L^3\matter\rho_c\,\omega_n$, with $\omega_n =
-\xi^2\,\dd\theta/\dd\xi$ at $\xi_1$.
:::

**The numbers** (a numerical result). At $n = 3$ the equation has no formula for its solution, so we integrate it
outward from the centre, step by step, to the first zero.[^solver] The surface is at $\xi_1 = 6.897$, with $\omega_3 =
2.018$, so the centre is $\xi_1^3/3\omega_3 = 54.2$ times denser than the mean. For the Sun, $\matter\rho_c =
7.6\times10^4\unit{kg\,m^{-3}}$, 76 times water, and $\matter p_c = 11.05\,G\matter M^2/R^4 = 1.24\times10^{16}$ Pa,
93 times the uniform ball's. The gas law gives $T_c = 1.2\times10^7$ K, a quarter below the $1.57\times10^7$ K of
the solar models fitted to the Sun's measured properties. Those models have twice this density and pressure at the
centre (stated; chapter 6.5's numbers).

<!-- diagram: tut-stars-lane-emden — spec: left panel, theta(xi) against xi from 0 to 7 for n = 1.5 (dashed) and n = 3
(solid), from the Lane–Emden solver, with the first zeros xi_1 = 3.654 and 6.897 marked by small ticks on the axis;
right panel, Eddington's Sun: density over the mean, rho/rho_bar = 54.2 theta^3, against r/R from 0 to 1 (log axis from
0.01 to 100), with the uniform ball as a thin flat line at 1; mark r/R = 0.25 with "41% of the mass inside". Matter
colour for the density curves. Caption: "Look first at the right panel's curve against the flat line of the uniform
ball: Eddington's Sun is 54 times denser than its mean at the centre and holds 41% of its mass inside a quarter of its
radius. The left panel shows the two solutions of the Lane–Emden equation that the chapter uses. Curves exact." -->

**What it gives the paper: a lens.** Section XI's waves cross the transparent Sun and are bent by its interior. Chapter
[11.1](/tutorial/black-holes/schwarzschild/#far-from-a-mass-light-bends-by-twice-newtons-angle) added up the turns
$\partial_\perp(1 - 2\field\Phi/c^2)\,\dd l$ along a ray: the rate of change, across the ray, of the refractive index
$1 - 2\field\Phi/c^2$ of a weak field. Since $-\nabla\field\Phi$ is the pull $\vect g$, the bending is $\vect\alpha =
(2/c^2)\int\vect g_\perp\,\dd l$, with $\vect g_\perp$ the part of the pull across the ray, a vector on the plane at
right angles to it. Here $\vect b$ is the ray's place on that plane, and $b = |\vect b|$, its distance from the
centre, is its **impact parameter**. On the plane, the divergence of $\vect g_\perp$ is the full divergence of $\vect
g$ less its derivative along the ray, so the divergence of $\vect\alpha$ is $(2/c^2)\int(\nabla\cdot\vect g -
\partial_lg_l)\,\dd l$. The second term integrates to the pull along the ray at its far ends, which is zero. Poisson's
equation $\nabla\cdot\vect g = -4\pi G\matter\rho$ (chapter 1.3) turns the first into $-(8\pi G/c^2)\matter\Sigma$,
with $\sym{projected-density}{\matter\Sigma}$ the **column density**, the density added up along the ray, in
$\mathrm{kg\,m^{-2}}$. For a round body $\vect\alpha$ points to the centre, so its flux outward through the circle of
radius $b$ is $-2\pi b\,\alpha$. The divergence theorem on that disc gives $-2\pi b\,\alpha = -(8\pi
G/c^2)\matter M_{\rm cyl}(b)$:

$$\boxed{\;\alpha(b) = \frac{4G\sym{cylinder-mass}{\matter M_{\rm cyl}}(b)}{c^2b}\;} \label{eq:extended-lens}$$

with $\matter M_{\rm cyl}(b)$ the mass inside the cylinder of radius $b$ along the ray. Outside the body this is
chapter 11.1's $4G\matter M/c^2b$. Near the centre $\matter M_{\rm cyl} \approx \pi b^2\matter\Sigma(0)$, so every
central ray crosses the axis at the same distance $b/\alpha = c^2/4\pi G\matter\Sigma(0)$: a focus. Eddington's Sun has
$\matter\Sigma(0) = 2.1\times10^{13}\unit{kg\,m^{-2}}$, eleven times the uniform ball's, which puts the focus at the
paper's 33.7 AU, and its bending peaks at $4.19''$ for rays $0.27R$ from the centre (Figure [](/paper/#fig:sun-lens)).
Reading chapter R12b reads the rest of the lens, and why the denser standard model gives Patla and Nemiroff's 23.5 AU.

## When the fuel is gone, crowded particles hold the star up

A star shines by fusing light nuclei into heavier ones at its centre (stated). When the fuel runs out, the star loses
heat and, by the virial theorem, contracts, until the crowding of its particles stops it.

**Degeneracy pressure.** Electrons packed $\matter n_e$ to the cubic metre are each confined to a space about $\matter
n_e^{-1/3}$ across. By chapter 8.2's uncertainty relation, $\sigma_x\sigma_p \ge \hbar/2$, each then has a momentum of
order $\hbar\matter n_e^{1/3}$, whatever the temperature, with $\hbar = 1.055\times10^{-34}$ J s. Chapter
[10.3](/tutorial/glow/why-matter-barely-glows/#free-electrons-fill-a-sphere-of-states-and-collisions-relax-a-sheared-one)
gives the exact count: no two electrons share a state of motion and spin, so when cold they fill every wavevector up to
the Fermi wavenumber $\sym{fermi-wavenumber}{k_F}$, with $\matter n_e = k_F^3/3\pi^2$. Their greatest momentum, $\hbar
k_F$, is the **Fermi momentum**.

Particles that move equally in every direction press with a third of their number per cubic metre times the mean,
over the particles, of momentum times speed (chapter 6.5's momentum flux, averaged over directions). For a warm gas
that mean is $3\kB T$, which gives $\matter n_{\rm gas}\kB T$ again. An electron of wavenumber $k$ has the momentum
$\hbar k$. A slow one, of mass $m_e = 9.11\times10^{-31}$ kg, has the speed $\hbar k/m_e$, so momentum times speed is
$\hbar^2k^2/m_e$. One near the speed of light has $\hbar kc$. The cold electrons fill the ball of wavevectors of
radius $k_F$ evenly, so a mean over them weights each $k$ by the area $4\pi k^2$ of its shell:

$$\begin{aligned}
\text{mean of }k^2 &= \frac{\int_0^{k_F}k^2\cdot4\pi k^2\,\dd k}{\int_0^{k_F}4\pi k^2\,\dd k} = \frac35k_F^2 ,\\
\text{mean of }k &= \frac{\int_0^{k_F}k\cdot4\pi k^2\,\dd k}{\int_0^{k_F}4\pi k^2\,\dd k} = \frac34k_F .
\end{aligned}$$

A third of $\matter n_e$ times $\tfrac35\hbar^2k_F^2/m_e$, or times $\tfrac34\hbar k_Fc$, is the **degeneracy
pressure**:

$$\matter p = \frac{\matter n_e\hbar^2k_F^2}{5m_e}\;\;\text{(slow)},\qquad \matter p = \frac{\matter n_e\hbar
k_Fc}4\;\;\text{(near } c\text{)} ,$$

which grows as $\matter n_e^{5/3}$ in the first case and as $\matter n_e^{4/3}$ in the second. Both are in pascals,
since $\hbar k_F$ is a momentum.

**A white dwarf.** In a star of helium, carbon or oxygen each electron comes with two nucleons, so $\matter n_e =
\matter\rho/2m_p$. We set the slow pressure, about $\hbar^2\matter n_e^{5/3}/m_e$ with $\matter n_e$ of order
$\matter M/m_pR^3$, equal to the first section's $G\matter M^2/R^4$. This gives the estimate
$R \sim \hbar^2/Gm_em_p^{5/3}\matter M^{1/3}$: the radius *shrinks* as the mass grows. <!-- lint-allow: \sim -->
This is a **white dwarf**, the small, dense remnant of a star like the Sun. The estimate gives 7300 km for
$0.6\,M_\odot$.

**Its size from the polytrope.** With $k_F = (3\pi^2\matter n_e)^{1/3}$ and $\matter n_e = \matter\rho/2m_p$, the slow
pressure is $\matter p = C_{3/2}\matter\rho^{5/3}$, a polytrope of index $\tfrac32$, with the constant

$$C_{3/2} = \frac{(3\pi^2)^{2/3}\hbar^2}{5m_e(2m_p)^{5/3}} = 3.12\times10^6\unit{m^4\,kg^{-2/3}\,s^{-2}} .$$

At the centre $\matter p_c = C_{3/2}\matter\rho_c^{5/3}$, so the Lane–Emden length obeys $L^2 = 5C_{3/2}/8\pi
G\matter\rho_c^{1/3}$. We take $\matter\rho_c$ from this, put it into the mass $\matter M = 4\pi
L^3\matter\rho_c\,\omega_{3/2}$, and solve for the radius $R = \xi_1L$:

$$R = \xi_1\,(4\pi\omega_{3/2})^{1/3}\,\frac{5C_{3/2}}{8\pi G}\,\matter M^{-1/3} ,$$

with $\xi_1 = 3.654$ and $\omega_{3/2} = 2.714$ from the numerical solution. The unit of $C_{3/2}/G$ is $\mathrm{m\,
kg^{1/3}}$, so $R$ is a length. For $0.6\,M_\odot$ it gives 10,400 km, the size of the Earth, a compactness $G\matter
M/Rc^2$ of $8.5\times10^{-5}$, and a centre of $1.5\times10^9\unit{kg\,m^{-3}}$, a tonne and a half to the cubic
centimetre. There $\hbar k_F = 0.92\,m_ec$: the electrons are no longer slow, and real white dwarfs of this mass are
somewhat smaller (stated).

**Chandrasekhar's mass.** As the mass grows, the electrons are pushed toward $c$. Then the pressure, about $\hbar
c\matter n_e^{4/3} \approx \hbar c\matter M^{4/3}/m_p^{4/3}R^4$, falls as $R^{-4}$, exactly as gravity's $G\matter
M^2/R^4$ does. Shrinking no longer helps, and the two balance at one mass only, of order $(\hbar c/G)^{3/2}/m_p^2 =
1.85\,M_\odot$, whatever the radius. In detail the fast pressure is a polytrope of index 3, $\matter p =
C_3\matter\rho^{4/3}$, with the constant $C_3 = (3\pi^2)^{1/3}\hbar c/4(2m_p)^{4/3}$. The Lane–Emden length then
gives $L^3\matter\rho_c = (C_3/\pi G)^{3/2}$, with no $\matter\rho_c$ left, so the mass $4\pi
L^3\matter\rho_c\,\omega_3$ is fixed:

$$\boxed{\;\sym{chandrasekhar-mass}{\matter M_{\rm Ch}} = \frac{\sqrt{3\pi}}2\,\omega_3\,\frac{(\hbar
c/G)^{3/2}}{(2m_p)^2} = 1.43\,M_\odot\;} \label{eq:chandrasekhar}$$

This is the **Chandrasekhar mass**, the most that electrons can hold up. Its unit is a mass, since $(\hbar c/G)^{1/2}$
is the Planck mass, $2.2\times10^{-8}$ kg (chapter
[11.3](/tutorial/black-holes/hawking/#a-black-hole-has-a-temperature-lower-the-heavier-it-is)). The often-quoted
$1.44\,M_\odot$ differs through the mass used per nucleon (the atomic mass unit gives 1.46) and through small
corrections like those in the box below (stated).

::: gap
This sketch treats every electron as moving near $c$, which holds only as the star shrinks without limit. The full
model follows the change from slow to fast electrons and finds the radius falling to zero as the mass approaches
$\matter M_{\rm Ch}$. It leaves out the electrons' attraction to the nuclei and their capture onto protons near the
limit, which lower it slightly.
:::

**A neutron star.** A core heavier than this collapses, and its electrons are pressed into its protons, which become
neutrons. What is left is a **neutron star** of about $1.4\,M_\odot$ and a radius of about 12 km (11 to 13 km,
stated).[^pulsar] Its mean density, $3.8\times10^{17}\unit{kg\,m^{-3}}$, is 1.4 times that of the matter inside a
heavy atomic nucleus, $2.7\times10^{17}\unit{kg\,m^{-3}}$. Its compactness is chapter
[7.1](/tutorial/geometry/metric/#free-fall-is-the-path-along-which-a-clock-ages-most)'s 0.17, and its central pressure
is near a tenth of $\matter\rho c^2$ (chapter 6.5, stated). Its **equation of state**, how its matter answers a
pressure, is known only within a range, which allows neutron stars up to about 2 to $2.3\,M_\odot$ (stated). Whatever
it is, a neutron star's moment of inertia, quadrupole and Love number (chapter 11.4) are tied to one another to about
one per cent by the **I-Love-Q relations** (stated), which [Section XII](/paper/#sec:hair) uses. Above about
$2\,M_\odot$ nothing holds the core, and it becomes a black hole (chapter 11.1).

<!-- diagram: tut-stars-ends — spec: mass (Msun, linear 0 to 2.5) against radius (km, log 1 to 30,000); the white-dwarf
branch from the n = 1.5 polytrope, R proportional to M^(-1/3), solid up to about 1 Msun and then bending down dashed
toward R = 0 at M_Ch = 1.43 (a thin vertical line, labelled); a shaded band for neutron stars at 11–13 km up to about
2–2.3 Msun (its top edge drawn as a range); the line R = r_s = 2GM/c^2 (field colour), black holes on its far side; the
paper's objects marked: the 0.6 Msun white dwarf at 10,400 km and the 1.4 Msun neutron star at 12 km. Matter colour for
the two branches. Caption: "Look first at the white-dwarf branch: the heavier the star, the smaller it is, until at
1.43 solar masses electrons can hold no more. Neutron stars sit a thousand times smaller, near 12 km, and the line r =
r_s bounds them all. The white-dwarf curve is the polytrope of index 3/2, exact; the neutron-star band and the bend
toward the limit are schematic." -->

## A core collapse frees a sixth of a solar mass, and neutrinos carry it

We want the energy that a core collapse frees, as an order-of-magnitude estimate. A **core collapse** ends a star of
more than about eight solar masses (stated). Its iron core, held by its electrons near Chandrasekhar's mass and about
the size of the Earth, loses that support, falls inward in less than a second, and is stopped by its neutrons at about
12 km. The rest of the star is blown off in a **supernova**, an exploding star.

**The inputs:** $\matter M = 1.4\,M_\odot$, from the Chandrasekhar mass, and $R = 12$ km, the neutron star's radius.
**The arithmetic:** the collapse frees the rise in the core's **binding energy**, the energy needed to pull it apart
(chapter 6.4). A gas star's binding is only $-U/2$, because by the virial theorem half of its gravitational energy
stays in it as heat. The neutron star is cold within seconds, since the neutrinos carry its heat away, and its stiff
nuclear matter stores little energy in its compression. So it keeps almost nothing to offset its gravitational
energy, and its binding is close to $-U$, which for a uniform ball is $\tfrac35G\matter M^2/R$. At the Earth's radius
the binding was 530 times smaller, so the energy freed is

$$\boxed{\;E \approx \frac35\,\frac{G\matter M^2}{R} = 2.6\times10^{46}\unit J = 0.14\,M_\odot c^2\;}$$

**Compared with:** 200 times all the light of the Sun in ten billion years. Lattimer and Prakash's fit to models of
real neutron stars (2001, stated) begins with the same term, three fifths of the compactness $G\matter M/Rc^2$ times
$\matter Mc^2$, and gives in full $2.8\times10^{46}$ J, $0.16\,M_\odot c^2$. The paper's "some
$3\times10^{46}\,\mathrm J$ … a sixth of a solar mass" is $0.168\,M_\odot c^2$ (chapter
[6.4](/tutorial/relativity/energy-and-momentum/#gravity-weighs-the-rest-mass-so-a-weighing-reads-the-energy)).

**Neutrinos carry it.** A **neutrino** is a particle with almost no mass and no charge, which crosses matter almost
freely (stated). Each proton that becomes a neutron sends one out, and the new neutron star, at about $10^{11}$ K,
sends out many more. The matter and its light stay trapped, but the neutrinos work their way out in about ten seconds,
as long as the burst from the supernova seen in 1987 lasted (stated). So neutrinos carry about 99% of the energy, and
the explosion about 1% (stated).

**What the camera sees.** By Birkhoff's theorem (chapter 11.1) a round collapse sends no gravitational waves. Outside
the shell of neutrinos the field is that of the original mass, and inside it that of the remnant (Vaidya, 1951,
stated). Reading chapter R12 reads the weighing as the shell passes, with the neutrinos' squeeze (chapter
[7.3](/tutorial/geometry/einstein-equation/#inside-matter-the-tide-has-a-part-fixed-by-the-matter-at-that-point)) and
the memory of a lopsided burst (chapter
[7.8](/tutorial/geometry/wave-energy/#a-burst-that-carries-energy-away-leaves-the-strain-changed-for-good)). About two
core collapses happen in the Galaxy each century (stated), typically some ten kiloparsecs away (a kiloparsec, kpc, is
3260 light-years; chapter [0.6](/tutorial/evening/how-to-read/#the-sky-has-its-own-units)).

## Two compact bodies spiral together, and the paper's pair has nine seconds left

We want the time that a circular pair of compact bodies has left before it merges. The masses are $\matter m_1$ and
$\matter m_2$, with the total $\matter M = \matter m_1 + \matter m_2$, and $d$ is their separation. We assume that
**the orbit is Newtonian and stays circular**, and that **it shrinks slowly**, so that at each moment it is a circle
losing energy to gravitational waves.

**The energy.** By chapter 1.8 the separation moves as one body round a fixed mass $\matter M$, so Kepler's law gives
the angular velocity $\Omega = (G\matter M/d^3)^{1/2}$. About the centre of mass the energy is that of a body of the
reduced mass $\matter m_1\matter m_2/\matter M$ in this orbit, $E = -G\matter m_1\matter m_2/2d$.

**The power.** Chapter 7.7's stretch problem found that the turning pair radiates

$$P = \frac{32}5\,\frac{G^4\matter m_1^2\matter m_2^2\matter M}{c^5d^5} .$$

**The shrinking.** The energy falls at the rate $P$, and $\dd E/\dd t = (G\matter m_1\matter m_2/2d^2)\,\dd
d/\dd t$, so

$$\frac{\dd d}{\dd t} = -\frac{64}5\,\frac{G^3\matter m_1\matter m_2\matter M}{c^5d^3} .$$

We multiply by $d^3$ and integrate from the separation $d$ now to zero, over the time $\tau$ that remains:

$$\boxed{\;\sym{merger-time}{\tau} = \frac5{256}\,\frac{c^5d^4}{G^3\matter m_1\matter m_2\matter M}\;} \label{eq:inspiral}$$

This is the time to merger of the **inspiral**, the slow spiral of a pair toward its **merger**.[^tau] Its unit is
$\mathrm{(m^5s^{-5})\,m^4/(m^9s^{-6})}$, a second. Halving the separation shortens it sixteen times. As $d$ shrinks,
$\Omega$ grows as $d^{-3/2}$, so the waves' frequency rises ever faster: the chirp whose rate chapter 9.5 used.

**The paper's pair.** Two black holes of $30\,M_\odot$ at 2200 km turn at $\Omega = 27.3\unit{s^{-1}}$, each at
$0.100\,c$, and send waves of 8.7 Hz and wavelength $\lambda = 34{,}400$ km (chapters 1.8 and 7.7). The formula gives
$\tau = 8.8$ s, Section XI's "ten seconds before they merge"; at exactly ten seconds it gives 2270 km.[^ten] The
reduced wavelength, $\lambda/2\pi = 5500$ km, is 2.5 times the separation, and inside it Figure
[](/paper/#fig:binary-field) shows the field turning rigidly with the pair (chapter 7.7).

**A white-dwarf pair.** Chapter 1.8's practice pair, two white dwarfs of $0.6\,M_\odot$ turning every ten minutes, is
113,000 km apart and radiates at 3.3 mHz. It has 244,000 years left. Its wave frequency $f_{\rm GW} = \Omega/\pi$ grows
as $d^{-3/2}$, and $d$ as $\tau^{1/4}$, so $f_{\rm GW} \propto \tau^{-3/8}$. In one year the frequency therefore rises
by $\tfrac38\times(1\text{ year})/\tau = 1.5\times10^{-6}$ of itself, which is $5\times10^{-9}$ Hz. Two waves whose
frequencies differ by $\Delta f$ drift apart by a whole cycle in the time $1/\Delta f$, so a year's record tells apart
only frequencies more than $3.2\times10^{-8}$ Hz apart. The drift is a sixth of that, so to any observatory the pair
"sends out waves at its own steady frequency", as Section XI says. Two neutron stars of $1.4\,M_\odot$ touch at about
24 km, where their waves have 1.7 kHz, and merge near 2 kHz, the frequency that reading chapter
[R5](/tutorial/waves/reading-section-iii/#every-body-that-moves-as-a-whole-lies-deep-inside-its-near-zone) gives for
them.

**Limits.** At $0.002\,c$ the white dwarfs are far inside the formula's range. At $0.1\,c$ the black holes' corrections
are of order $(v/c)^2$ with large coefficients, which here nearly cancel.[^ten] The formula fails near the merger,
when the holes, each of $r_s = 89$ km, come within a few times their size.

<!-- try: inspiral (new; P6b-DECISIONS item 6; not yet registered in live.ts). Place as a ::: try {#inspiral} block
here once built, and add inspiral to the front matter's live list.
Its text: "Predict first: two neutron stars of 1.4 solar masses are 2200 km apart, as far apart as the paper's black
holes. Do they have more or less time left than the black holes' 8.8 seconds, and by about what factor? Then choose
the neutron-star masses, set the separation to 2200 km and read the time to merger. Drag the separation and watch the
time change as its fourth power. On the white-dwarf preset, notice how slowly the frequency moves."
Controls (exact): mass 1 and mass 2, each a log slider from 0.3 to 60 Msun in 200 equal log steps; separation d, a log
slider in 400 equal log steps from d_min = 3(r_s1 + r_s2), with r_s = 2Gm/c^2, to 10^6 km; a switch "set the time
instead", which turns the separation slider into a log slider of tau over the same range, tau(d_min) to tau(10^6 km),
and solves d = (256 G^3 m1 m2 M tau / 5 c^5)^(1/4). Presets: "the paper's pair" (30 + 30 Msun, 2200 km), "neutron
stars" (1.4 + 1.4 Msun, 500 km), "white dwarfs" (0.6 + 0.6 Msun, 113,000 km). Opens on the paper's pair.
Readouts, three figures, from these formulas only: Omega = (GM/d^3)^(1/2); f_GW = Omega/pi; v/c of each body, Omega d
m_other/(M c); lambda = c/f_GW and lambda/2pi; tau from eq:inspiral, shown in s, min, h, days or years, whichever
gives a number between 1 and 1000 (years beyond that with a power of ten); d over lambda/2pi. A warning line, "the
Newtonian orbit is leaving its range", when either v/c exceeds 0.2. Inset: the pair as a dot on 0.1's regime map
(regime-map's axes, frequency against distance).
Checks for the builder (each must hold to the figures given): the paper's pair reads Omega = 27.3 s^-1, f_GW = 8.71
Hz, v/c = 0.100 for each body, lambda = 34,400 km, lambda/2pi = 5480 km, d over lambda/2pi = 0.401, tau = 8.77 s;
the white dwarfs read f_GW = 3.33 mHz, v/c = 0.00198 and tau = 244,000 years; the neutron-star preset reads f_GW =
17.4 Hz and tau = 230 s; doubling d at fixed masses multiplies tau by exactly 16; with 30 + 30 Msun, setting tau = 10 s
returns d = 2270 km; with 30 + 30 Msun the warning appears below d = 554 km and d_min is 532 km; d_min is 24.8 km for
1.4 + 1.4 Msun and 5.32 km for 0.3 + 0.3 Msun.
Both themes; keyboard: Tab between sliders, arrow keys one step, Page Up and Page Down ten steps, Home and End the
ends; phone: at 390 px the readouts sit above the sliders, the inset below. Until it exists, the registered
near-to-far can stand in: it shows the paper's pair at 2200 km and its waves, but not the time to merger. -->

<!-- diagram: tut-stars-inspiral — spec: separation (km, log, 10 to 10^6) against time to merger (s, log, 10^-3 to
10^14), from eq:inspiral: a solid line for 30 + 30 Msun with a dot at 2200 km, 8.8 s, and a dashed line for 0.6 + 0.6
Msun with a dot at 113,000 km, 244,000 years (7.7 × 10^12 s); both lines of slope 1/4; on the black-hole line a thin
tick at lambda/2pi = 5500 km marked "near zone ends", and the line greyed below about 530 km (3(r_s1 + r_s2)) where the
formula fails. Caption: "Look first at the dot at 2200 km: the paper's pair has 8.8 seconds left, and each halving of
the separation cuts the time sixteen times. The white-dwarf pair on the dashed line has 244,000 years. Lines from the
quadrupole formula, exact for Newton's orbit; the grey end is outside its range." -->

## In waves the Galaxy shows where its stars are

We want the brightness of the Galaxy's sky in gravitational waves and in light. The paper's model, rounded from Joss
Bland-Hawthorn and Ortwin Gerhard's review (2016), has three parts. Here $\varpi$ (a form of the letter $\pi$) is the
distance from the Galaxy's axis and $z$ the height above its mid-plane, both in kiloparsecs. A **thin disc** of
$3.5\times10^{10}\,M_\odot$ has a density in proportion to $e^{-\varpi/2.6 - |z|/0.3}$. Its **scale length** 2.6 kpc
and **scale height** 0.3 kpc are the distances over which the density falls by a factor $e$. A **thick disc** of
$0.6\times10^{10}\,M_\odot$ has 2.0 and 0.9 kpc. The **bulge**, a ball of $1.5\times10^{10}\,M_\odot$ at the centre,
is flattened to 0.6 of its width in height: its density falls by $e$ every 0.5 kpc of $(\varpi^2 + z^2/0.6^2)^{1/2}$.
The Sun is 8.2 kpc from the centre and 20 pc above the mid-plane.

Tens of millions of close white-dwarf pairs follow the stars (stated; Nelemans and colleagues, 2001), and the model
takes their number, like the light of the stars, in proportion to the stellar mass. Averaged over time and over random
orientations, each pair radiates the same in every direction. So by the paper's [](/paper/#eq:column), the number
radiance $N(\hat n)$ along a line of sight, chapter
[5.5](/tutorial/waves/radiance/#a-pixel-measures-radiance-power-per-area-per-solid-angle-and-per-frequency)'s count of
gravitons per second, per square metre and per steradian, is in proportion to the column of stellar mass along it,
$\int\matter\rho_\star\,\dd s$. Here $\matter\rho_\star$ is the model's density of stars and $s$ the distance from the
Sun.[^dark] Toward the centre the line runs 8.2 kpc into rising density and through the bulge. Toward the opposite
side, the **anticentre**, the density falls away from its value at the Sun. Adding up each column in steps of 0.15 pc
out to 60 kpc gives (a numerical result, to three figures)

$$\boxed{\;\frac{N_{\rm centre}}{N_{\rm anticentre}} = 102\;}$$

in the paper's model: Section XI's "a hundred times brighter".[^galaxy]

**Dust.** Light from the same stars crosses **interstellar dust**, grains of rock and carbon, here in a disc of its own
with a scale length of 3.2 kpc and a scale height of 0.1 kpc. It dims visible light by one magnitude per kiloparsec
in the mid-plane at the Sun's distance from the centre, and by 0.82 at the Sun's height. This dimming is
**extinction**. Chapter 0.6's **magnitudes** count brightness so that five magnitudes are
a factor of 100, and so 30 magnitudes are $100^6 = 10^{12}$, "a million million". Along the 8.2 kpc to the centre the
model's dust adds up to 31 magnitudes, while gravitational waves cross it untouched (chapter 7.8). So in light the
centre is only 1.33 times as bright as the anticentre: in that direction we see only the nearest few kiloparsecs of
stars.

<!-- diagram: tut-stars-columns — spec: a top view of the model Galaxy's mid-plane (stellar density as a soft
matter-coloured glow, log scale) with the Sun at 8.2 kpc, 20 pc above the mid-plane (the bulge flattened 0.6, as in
the model; the 102, 31 and 2.6 below hold only with both); two lines of sight from the Sun, to the centre and to the
anticentre; below, two strips along each line: the stellar density against distance (0 to 25 kpc), whose areas are the
columns (ratio 102), and the dust's cumulative extinction in magnitudes (31 at the centre, 2.6 in all toward the
anticentre). Caption: "Look first at the two areas under the density curves: the line toward the centre crosses a
hundred times more stars. Above it, the dust's extinction climbs to 31 magnitudes along the same line, which hides that
centre from light. Curves from the paper's model." -->

**Seeing the glow.** At 3 mHz the waves are 0.67 AU long, and an aperture resolves about the wavelength over its
width, in radians, so the paper's camera 50 AU across sees the glow as sharply as Figure [](/paper/#fig:milky-way), to
$0.77°$. The pairs are not a smooth glow, though. A year's record tells apart frequencies
$3.2\times10^{-8}$ Hz apart, as for the white-dwarf pair above, and each such interval is a **frequency bin**. Below a
few millihertz each bin holds many pairs, and together they make a **confusion foreground** that cannot be taken
apart. Above, the brightest pairs, thousands of them, sit alone in their bins (stated), and one pixel can place each
by the paper's [](/paper/#eq:one-wave) (chapter 9.1).

::: check
### Q

Why does a star grow hotter inside as it loses energy?

### A

Its energy is $E = -\langle K\rangle$, so losing energy raises the kinetic energy of its particles.

### Q

About how much energy does a core collapse free, in units of the Sun's $M_\odot c^2$?

### A

About a sixth: $\tfrac35G\matter M^2/R = 0.14\,M_\odot c^2$ for $1.4\,M_\odot$ in 12 km, and 0.16 for real
neutron stars.

### Q

Why is the Galaxy's centre a hundred times brighter than the anticentre in waves, but not in light?

### A

The waves cross the dust and show the whole column of stars, far larger toward the centre; the light is dimmed by 31
magnitudes.
:::

**The idea to keep: a star holds itself up by the pressure of its gas, and its particles move with half its binding
energy. Crowded electrons hold a dead star up to $1.43\,M_\odot$ and neutrons to about $2\,M_\odot$; beyond that a
black hole remains. A core collapse frees a sixth of a solar mass in neutrinos. A pair's time to merger grows as the
fourth power of its separation, and in the waves of its white-dwarf pairs the Galaxy shows where its stars are.**

::: problems
### Practice

Two neutron stars of $1.4\,M_\odot$ each are 100 km apart. Find the frequency of their waves and their time to merger.

::: solution
With $\matter M = 2.8\,M_\odot$, $\Omega = (G\matter M/d^3)^{1/2} = 610\unit{s^{-1}}$, so the waves have $\Omega/\pi =
194$ Hz, and [](#eq:inspiral) gives $\tau = 0.37$ s.
:::

### Stretch

With chapters 4.2 and 10.3, find the temperature below which a white dwarf's electrons at $10^9\unit{kg\,m^{-3}}$ are
degenerate, by comparing $\kB T$ with the kinetic energy of an electron at the Fermi momentum.

::: solution
The electrons number $\matter n_e = \matter\rho/2m_p = 3.0\times10^{35}\unit{m^{-3}}$, so $\hbar k_F =
\hbar(3\pi^2\matter n_e)^{1/3} = 0.80\,m_ec$. The kinetic energy is $(\sqrt{1 + 0.80^2} - 1)m_ec^2 = 143$ keV,
which is $\kB T$ at $1.7\times10^9$ K. White dwarfs are far colder inside, so their electrons are degenerate.
:::

### The paper

Check Section XI's "about ten seconds before they merge, when they are $d = 2200\,\mathrm{km}$ apart and move at a
tenth of the speed of light; their waves are $35{,}000\,\mathrm{km}$ long" from Kepler's law and [](#eq:inspiral).

::: solution
With $\matter M = 60\,M_\odot$ and $d = 2.2\times10^6$ m, $\Omega = 27.3\unit{s^{-1}}$, and each hole moves at $\Omega
d/2 = 0.100\,c$. The waves have $\Omega/\pi = 8.7$ Hz and are $c/f = 34{,}400$ km long, and $\tau = 8.8$ s: the
paper's numbers, within corrections of order $(v/c)^2$.
:::
:::

::: paper
- [Section XI](/paper/#sec:vistas): [*A pair of black
  holes*](/paper/#par:a-pair-of-black-holes-from-the-near-zone-to-the-wave-zone), the pair's separation, speed and
  clock (Figure [](/paper/#fig:binary-field)); [*An exploding star*](/paper/#par:an-exploding-star), the neutrinos,
  Birkhoff and Vaidya; [*The Milky Way*](/paper/#par:the-milky-way), the model, the pairs, the paper's
  [](/paper/#eq:column) and the dust; [*The transparent Sun as a lens*](/paper/#par:the-transparent-sun-as-a-lens),
  Eddington's model and the cylinder's mass.
- [Section XII](/paper/#sec:hair), [*The number of bits*](/paper/#par:the-number-of-bits): a neutron star nearly as
  bald as a hole. [Section XIII](/paper/#sec:second-order): Spitzer's clusters, beside the paper's
  [](/paper/#eq:pass). [Section VIII](/paper/#sec:one-pixel), [*Matter at the pixel*](/paper/#par:matter-at-the-pixel):
  the dark matter's tide.
:::

::: deeper
- The GR course's section
  [17.8](https://neovand.github.io/general-relativity/chapter-17.html#17-8-a-relativistic-star-has-an-interior) builds
  a star in Einstein's theory, where pressure adds to gravity, and section
  [18.8](https://neovand.github.io/general-relativity/chapter-18.html#18-8-a-real-event-that-turned-these-symbols-into-data)
  reads GW150914, the first merger heard.
- S. Chandrasekhar, *An Introduction to the Study of Stellar Structure* (Chicago, 1939; Dover), chapters IV and XI:
  polytropes and white dwarfs in full. S. L. Shapiro and S. A. Teukolsky, *Black Holes, White Dwarfs, and Neutron
  Stars* (Wiley, 1983): compact objects and their pairs.
- The paper's sources for the Galaxy [@BlandHawthornGerhard2016] and its pairs [@Nelemans2001].
:::

[^mbar]: Astronomers write $\mu$ for it; the tutorial keeps $\mu$ for chapter 4.3's shear modulus.

[^rhoc]: The critical density is the mean density at which the universe's space, on the largest scales, is flat.
    Chapter 12.2 derives it and writes it $\rho_{\rm crit}$, so that $\matter\rho_c$ is always a central density.

[^light]: In the Sun the fraction is small: at the centre of Eddington's model the light's pressure is
    $4\times10^{-4}$ of the gas's, so the numbers below leave it out. The index 3 comes from the fraction being the
    same everywhere, not from its size.

[^pulsar]: A **pulsar** is a turning neutron star whose radio beam sweeps the Earth at each turn, as regularly as a
    clock. A **pulsar timing array** follows dozens of them for years, and nanohertz waves passing the Earth shift
    their arrival times in a pattern across the sky. NANOGrav found such a background in 2023, with about $10^{-8}$
    of the critical density (stated).

[^dark]: The Galaxy also holds **dark matter**, matter that neither shines nor absorbs light and is known only by its
    pull: about $0.4\unit{GeV\,cm^{-3}} = 7.1\times10^{-22}\unit{kg\,m^{-3}}$ near the Sun (stated), a hundredth of a
    solar mass per cubic parsec. Reading chapter
    [R9b](/tutorial/one-point/reading-section-viii-2/#inside-matter-the-trace-of-the-tide-reads-the-density-there)
    read its tide at the pixel, $6\times10^{-31}\unit{s^{-2}}$. Its particles do not collide, so it has no friction
    and does not glow in gravitational waves either.

[^xi]: Not the paper's separation $\xi^i$ of free particles, nor an angle.

[^solver]: From the series $\theta = 1 - \xi^2/6$ near the centre, with a relative error below $10^{-12}$. The
    paper's `reference/gravcam/sunlens.py` agrees to four figures.

[^tau]: A time, not chapter 5.5's optical depth.

[^ten]: The paper's "about ten seconds" and "$35{,}000\,\mathrm{km}$" are rounded: for exactly 2200 km the formula
    gives 8.8 s and Newton's law 34,400 km, 1.6% less. The next two corrections (stated; L. Blanchet, *Living Reviews
    in Relativity*, 2014) change the time left at 8.7 Hz by $+16\%$ and $-16\%$, under 1% together.

[^galaxy]: A model's number, not the sky's; the paper's `reference/gravcam/galaxy.py` agrees. The Sun's 20 pc matter:
    with the Sun in the mid-plane the same model gives 99, 38 magnitudes of dust and 1.24 in light.
