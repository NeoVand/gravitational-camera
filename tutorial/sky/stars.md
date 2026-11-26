---
id: '12.1'
title: 'Stars, compact objects, supernovae and the Galaxy'
question: 'Two black holes of thirty solar masses, 2200 kilometres apart, have about nine seconds before they merge; a collapsing star sends out a sixth of a solar mass in neutrinos; the Galaxy holds tens of millions of close pairs of white dwarfs, whose glow makes its centre about a hundred times brighter than the opposite side. What are these objects, and why do their numbers come out as they do?'
part: '12'
requires: ['1.3', '1.6', '1.8', '4.2', '5.5', '6.4', '6.5', '7.7', '8.2', '11.1']
paper: [sec:vistas, fig:milky-way, eq:column, fig:binary-field, fig:sun-lens, eq:one-wave, eq:pass, sec:hair, sec:second-order, sec:one-pixel]
figures: [fig:milky-way]
live: [inspiral]
depth: A
---

![Look first at the thin bright disc and the dark lane along its middle: this is the section's model of the Galaxy, seen
edge-on from far away, and the lane is its dust. The pale line runs from the Sun to the centre inside that dust, through
31 magnitudes of it. The inset, magnified 40 times, shows the Sun with its camera 20 parsecs above the mid-plane. The
disc's light and the dust's dimming are computed from the model; the pairs of white dwarfs, the camera, and the black
disc in the 0.905 K glow of gravitons of section [12.2](/tutorial/sky/universe/) are schematic.](tut-sky-hero){#fig:sky-hero}

The camera can be pointed at the sky. Two black holes of thirty solar masses each, 2200 kilometres apart, have about
nine seconds before they merge. A collapsing star sends out a sixth of a solar mass in neutrinos. The Galaxy holds tens
of millions of close pairs of white dwarfs, whose glow in gravitational waves makes its centre about a hundred times
brighter than the opposite side, while dust hides that centre from light. What are these objects, and why do their
numbers come out as they do?[^sky]

{{paper fig:milky-way}}

::: plain
A star is a ball of hot gas. Its gravity pulls every layer inward, and the pressure of the hotter, denser gas below
pushes it back out; in the Sun this balance needs millions of degrees at the centre.

When a star runs out of fuel, it shrinks until quantum mechanics alone keeps its particles apart: electrons hold up a
white dwarf, and neutrons a neutron star. Above about one and a half solar masses electrons cannot hold a star, and
above about two nothing can: a black hole remains.

A collapsing core frees a sixth of a solar mass of energy, carried off by neutrinos. Two compact stars in orbit lose
energy to gravitational waves and spiral together ever faster. In those waves the Galaxy's pairs of white dwarfs show
where its stars are, through the dust that hides them from light.
:::

## A star holds itself up by the pressure of its gas

The pressure at the centre of a star sets how hot the star must be. We assume that **the star is round and at rest**.
Here $\sym{pressure}{\matter p}(r)$ is the **pressure** at the distance $r$ from the centre, the
force per unit area with which the gas pushes on any surface, in pascals. The density is
$\matter\rho(r)$, in kilograms per cubic metre, and $\sym{mass-inside}{\matter m}(r)$ is the mass inside the radius
$r$, which grows as $\dd\matter m/\dd r = 4\pi r^2\matter\rho$.

Take a thin slab of gas between $r$ and $r + \dd r$, with an area $A$ facing the centre (Figure
[](#fig:stars-shell)). Its mass is $\matter\rho
A\,\dd r$. By the shell theorem (section [1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)) only the mass inside $r$ pulls on it, with the force $G\matter m\matter\rho A\,\dd
r/r^2$ toward the centre. The gas below pushes it outward with the force $\matter p(r)A$, and the gas above pushes it
inward with $\matter p(r + \dd r)A$. The three forces add up to zero, and dividing by $A\,\dd r$ gives

$$\boxed{\;\frac{\dd\matter p}{\dd r} = -\frac{G\matter m(r)\,\matter\rho(r)}{r^2}\;} \label{eq:hydrostatic}$$

This is **hydrostatic balance**: the pressure falls outward at the rate needed to hold each layer up. Both sides are
in $\mathrm{Pa\,m^{-1}}$, which is $\mathrm{kg\,m^{-2}\,s^{-2}}$.

![Look first at the two pressure arrows on the slab: the push from below is slightly larger than the push from
above, and the difference holds the slab against the pull of the mass inside it. The shell outside pulls nothing.
Schematic.](tut-stars-shell){#fig:stars-shell}

**A uniform ball.** If the density is the same everywhere, $\matter m(r) = \tfrac43\pi r^3\matter\rho$, so $\dd\matter
p/\dd r = -\tfrac43\pi G\matter\rho^2r$. The pressure is zero at the surface $R$, and integrating from the centre to
$R$ gives the **central pressure**

$$\sym{central-pressure}{\matter p_c} = \frac23\pi G\matter\rho^2R^2 = \frac{3G\matter M^2}{8\pi R^4} ,$$

with $\matter M$ the whole mass. For the Sun, $\matter M = 1.989\times10^{30}$ kg and $R = 6.96\times10^8$ m give
$1.3\times10^{14}$ Pa, 1.3 billion times the pressure of the air.

**How hot.** The Sun's gas is ionized: nuclei and free electrons move on their own. A gas of $\matter n_{\rm gas}$
particles per cubic metre has the pressure $\matter n_{\rm gas}\kB T$ (section [4.2](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share)), with $T$ the temperature in kelvin
and $\kB = 1.381\times10^{-23}\unit{J\,K^{-1}}$ Boltzmann's constant. A kilogram holds $1/\bar mm_p$ particles, with
$m_p = 1.673\times10^{-27}$ kg the proton's mass and $\sym{mean-particle-mass}{\bar m}$ the **mean particle mass** in
proton masses, a pure number: $\tfrac12$ for ionized hydrogen, where a proton and an electron share one proton's mass,
and about 0.6 for the Sun's hydrogen and helium (stated).[^mbar] So

$$\matter p = \frac{\matter\rho\,\kB T}{\bar mm_p} .$$

The uniform Sun, of mean density $1410\unit{kg\,m^{-3}}$, has $T = 6.9\times10^6$ K at its centre: gravity alone, with
no nuclear physics, makes a star millions of kelvin hot inside.

**Limit.** The central pressure did not need the gas law, so it holds for any round body that compresses little. For the
Earth it gives $1.7\times10^{11}$ Pa, half the $3.6\times10^{11}$ Pa that seismology finds at the centre (stated),
because the Earth's iron core is denser than its mean; the Sun, too, is denser at its centre (below).

## In a bound system the motion is half the binding

A star's temperature also follows from a rule for every **self-gravitating** system, one held together by its own
gravity: a star, a cluster of stars, a pair in orbit. The rule relates its kinetic and potential energies, on average
over a long time.

We take point masses $\matter m_a$, labelled by $a = 1, 2, \dots$, with positions $\vect x_a$ and momenta $\vect p_a$
(in bold, to distinguish them from the pressure). The **total potential energy** $\sym{total-potential-energy}{U}$, in joules, is the sum
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

and $\vect F_{ca} = -\vect F_{ac}$ (equal and opposite forces, section [1.6](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel)). So $\sum_a\vect F_a\cdot\vect x_a = \sum_a\sum_{c \ne a}\vect
F_{ac}\cdot\vect x_a$. Each pair $a < c$ appears in this double sum twice, once as $\vect F_{ac}\cdot\vect x_a$ and
once as $\vect F_{ca}\cdot\vect x_c$. We collect the two terms of each pair:

$$\begin{aligned}
\sum_a\vect F_a\cdot\vect x_a &= \sum_{\text{pairs } a < c}\bigl(\vect F_{ac}\cdot\vect x_a + \vect F_{ca}\cdot\vect x_c\bigr)\\
&= \sum_{\text{pairs } a < c}\vect F_{ac}\cdot(\vect x_a - \vect x_c)\\
&= -\sum_{\text{pairs } a < c}\frac{G\matter m_a\matter m_c}{|\vect x_a - \vect x_c|} = U .
\end{aligned}$$

The second line uses $\vect F_{ca} = -\vect F_{ac}$, and the third the pull. So $\dd S/\dd t = 2K + U$.

The **time average** of a quantity $f$ over a time $t_0$ is $\sym{time-average}{\langle f\rangle} = (1/t_0)\int_0^{t_0}
f\,\dd t$. The average of $\dd S/\dd t$ is $[S(t_0) - S(0)]/t_0$. In a bounded system $S$ stays bounded, so this
average goes to zero as $t_0$ grows, and

$$\boxed{\;2\langle K\rangle = -\langle U\rangle .\;} \label{eq:virial}$$

This is the **virial theorem**. The circular orbit of section
[1.8](/tutorial/newton/orbits-and-kicks/#energy-and-angular-momentum-fix-the-size-and-shape-of-an-orbit) checks it, with
$K = -\tfrac12U$ at every moment. A bound system's energy is then $E = -\langle K\rangle$, so a system that gains
energy ends slower. A star that shines loses energy, so its particles move faster: it contracts and grows hotter inside.

**The Sun.** We build a uniform ball shell by shell. A shell of mass $4\pi r^2\matter\rho\,\dd r$ brought from far
away onto the ball of mass $\tfrac43\pi r^3\matter\rho$ inside it adds $-G(\tfrac43\pi r^3\matter\rho)(4\pi
r^2\matter\rho\,\dd r)/r$, by the shell theorem. Integrating $r^4$ from 0 to $R$ gives $U =
-\tfrac{16}{15}\pi^2G\matter\rho^2R^5 = -\tfrac35G\matter M^2/R$. The gas holds $\matter M/\bar mm_p$ particles, each
with the mean kinetic energy $\tfrac32\kB T$, so $2K = -U$ gives

$$T = \frac{\bar m\,G\matter Mm_p}{5\kB R} = 2.8\times10^6\unit K$$

for $\bar m = 0.6$. Solar models fitted to the Sun's measured properties put its centre at $1.57\times10^7$ K
(stated), between five and six times hotter, because the theorem gives an average over the mass, and the centre is
the hottest part.

**For a fluid star**, the case that the von Laue theorem leaves open, we multiply hydrostatic balance by $4\pi r^3$ and
integrate over the star:

$$\int_0^R4\pi r^3\,\frac{\dd\matter p}{\dd r}\,\dd r = -\int_0^R\frac{G\matter m}{r}\,4\pi r^2\matter\rho\,\dd r .$$

On the left we integrate by parts. The term $4\pi r^3\matter p$ is zero at both ends, since $\matter p(R) = 0$, and
$-\int_0^R12\pi r^2\matter p\,\dd r = -\int3\matter p\,\dd V$ remains. On the right, $4\pi r^2\matter\rho\,\dd r$ is a
shell's mass $\dd\matter m$, and $-G\matter m\,\dd\matter m/r$ is the energy the shell adds, so the right side is $U$:

$$\boxed{\;\int3\matter p\,\dd V = -U\;} \label{eq:virial-fluid}$$

For a gas $\tfrac32\matter p$ is the kinetic energy per cubic metre, so the left side is $2K$: the virial theorem
again, with the pressure as the motion of the particles. The uniform ball checks it, with $\matter p = \matter p_c(1 -
r^2/R^2)$ and $\int3\matter p\,\dd V = \tfrac{8\pi}5\matter p_cR^3 = \tfrac35G\matter M^2/R$.

**Why von Laue's theorem does not hold here.** The theorem of section
[6.5](/tutorial/relativity/stress-energy/#the-stresses-of-a-body-at-rest-add-up-to-zero) says that the pressures and
tensions of a static body add up to zero, but a star's add up to $-U$. The proof needs every force inside the body to be
a stress in $\matter T^{\mu\nu}$, as in a steel shell, and gravity's own stress is not part of it. The star still
weighs its whole energy over $c^2$, its negative gravitational energy included (Richard Tolman, 1930, stated).

::: history
### Clausius, Eddington and Chandrasekhar

Rudolf Clausius stated the virial theorem in 1870, for the molecules of a gas. Arthur Eddington set out his standard
model in 1926, and Subrahmanyan Chandrasekhar found the limit on a white dwarf's mass in 1930.
:::

## Eddington's model ties the pressure to the density

The uniform ball is too crude, since the Sun is far denser at its centre. We want the density inside a star whose
pressure depends on its density alone. We assume that **the pressure is a power of the density**,

$$\matter p = \matter p_c\Bigl(\frac{\matter\rho}{\matter\rho_c}\Bigr)^{1 + 1/n} ,$$

with $\sym{central-density}{\matter\rho_c}$ the central density[^rhoc] and $\sym{polytropic-index}{n}$ a pure number,
not a count. Such a star is a **polytrope**, and $n$ is its **polytropic index**. **Eddington's standard model** of the
Sun has $n = 3$. Eddington assumed that the pressure of the Sun's light, which grows as $T^4$ (section 10.1), is the
same fraction of the gas's pressure $\matter\rho\kB T/\bar mm_p$ everywhere in the star. Then $T^4 \propto \matter\rho T$, so $T^3 \propto \matter\rho$ and $\matter p \propto
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

**The numbers.** At $n = 3$ the equation has no formula for its solution, so we integrate it outward from the centre,
step by step, to the first zero. The surface is at $\xi_1 = 6.897$, with $\omega_3 = 2.018$, so the centre is
$\xi_1^3/3\omega_3 = 54.2$ times denser than the mean (Figure [](#fig:stars-lane-emden)). For the Sun, $\matter\rho_c =
7.6\times10^4\unit{kg\,m^{-3}}$, 76 times water, and $\matter p_c = 11.05\,G\matter M^2/R^4 = 1.24\times10^{16}$ Pa,
93 times the uniform ball's. The gas law gives $T_c = 1.2\times10^7$ K, a quarter below the $1.57\times10^7$ K of the
solar models fitted to the Sun's measured properties, which have twice this density and pressure at the centre
(stated).

![Look first at the right panel's curve against the flat line of the uniform ball: Eddington's Sun is 54 times
denser than its mean at the centre and holds 41% of its mass inside a quarter of its radius. The left panel shows the
two solutions of the Lane–Emden equation that the section uses. Curves
exact.](tut-stars-lane-emden){#fig:stars-lane-emden}

**A lens.** A gravitational wave that crosses the transparent Sun is bent by its interior. Section
[11.1](/tutorial/black-holes/schwarzschild/#far-from-a-mass-light-bends-by-twice-newtons-angle) added up the turns
$\partial_\perp(1 - 2\field\Phi/c^2)\,\dd l$ along a ray, so the bending is $\vect\alpha = (2/c^2)\int\vect
g_\perp\,\dd l$, with $\vect g_\perp$ the pull $\vect g = -\nabla\field\Phi$ across the ray, a vector on the plane at
right angles to it. A point on that plane is $\vect b$, and $b = |\vect b|$, its distance from the centre, is the
**impact parameter**. On the plane the divergence of $\vect g_\perp$ is the full divergence of $\vect g$ less its
derivative along the ray, so $\nabla\cdot\vect\alpha = (2/c^2)\int(\nabla\cdot\vect g - \partial_lg_l)\,\dd l$. The
second term integrates to the pull at the ray's far ends, which is zero. Poisson's equation $\nabla\cdot\vect g =
-4\pi G\matter\rho$ (section 1.3) turns the first into $-(8\pi G/c^2)\matter\Sigma$, with
$\sym{projected-density}{\matter\Sigma}$ the **column density**, the density added up along the ray, in
$\mathrm{kg\,m^{-2}}$. For a round body $\vect\alpha$ points to the centre, so its flux outward through the circle of
radius $b$ is $-2\pi b\,\alpha$, and the divergence theorem on that disc gives $-2\pi b\,\alpha = -(8\pi
G/c^2)\matter M_{\rm cyl}(b)$:

$$\boxed{\;\alpha(b) = \frac{4G\sym{cylinder-mass}{\matter M_{\rm cyl}}(b)}{c^2b}\;} \label{eq:extended-lens}$$

with $\matter M_{\rm cyl}(b)$ the mass inside the cylinder of radius $b$ along the ray. Outside the body this is
$4G\matter M/c^2b$ of section 11.1. Near the centre $\matter M_{\rm cyl} \approx \pi b^2\matter\Sigma(0)$, so every
central ray crosses the axis at the same distance $b/\alpha = c^2/4\pi G\matter\Sigma(0)$: a focus. Eddington's Sun has
$\matter\Sigma(0) = 2.1\times10^{13}\unit{kg\,m^{-2}}$, eleven times the uniform ball's, which puts the focus at
33.7 AU, and its bending peaks at $4.19''$ for rays $0.27R$ from the centre (Figure
[](/paper/#fig:sun-lens)).[^lens] Section [R12b](/tutorial/sky/reading-section-xi-2/#the-transparent-sun-focuses-only-waves-above-8-khz) reads the rest of the lens.

## When the fuel is gone, crowded particles hold the star up

A star shines by fusing light nuclei into heavier ones at its centre (stated). When the fuel runs out, the star loses
heat and, by the virial theorem, contracts, until the crowding of its particles stops it.

**Degeneracy pressure.** Electrons packed $\matter n_e$ to the cubic metre are each confined to a space about $\matter
n_e^{-1/3}$ across. By the uncertainty relation of section [8.2](/tutorial/quantum/operators/#the-uncertainty-relation-is-robertsons-inequality-for-position-and-momentum), $\sigma_x\sigma_p \ge \hbar/2$, each then has a momentum of
order $\hbar\matter n_e^{1/3}$, whatever the temperature, with $\hbar = 1.055\times10^{-34}$ J s. Section
[10.3](/tutorial/glow/why-matter-barely-glows/#free-electrons-fill-a-sphere-of-states-and-collisions-relax-a-sheared-one)
gives the exact count: no two electrons share a state of motion and spin, so when cold they fill every wavevector up to
the Fermi wavenumber $\sym{fermi-wavenumber}{k_F}$, with $\matter n_e = k_F^3/3\pi^2$. Their greatest momentum, $\hbar
k_F$, is the **Fermi momentum**.

Particles that move equally in every direction press with a third of their number per cubic metre times the mean of
momentum times speed (the momentum flux of section 6.5, averaged over directions). For a warm gas that mean is $3\kB
T$, which gives $\matter n_{\rm gas}\kB T$ again. An electron of wavenumber $k$ has the momentum $\hbar k$. A slow one,
of mass $m_e = 9.11\times10^{-31}$ kg, has the speed $\hbar k/m_e$, so momentum times speed is $\hbar^2k^2/m_e$; one
near the speed of light has $\hbar kc$. The cold electrons fill the ball of wavevectors of radius $k_F$ evenly, so a
mean over them weights each $k$ by the area $4\pi k^2$ of its shell:

$$\begin{aligned}
\text{mean of }k^2 &= \frac{\int_0^{k_F}k^2\cdot4\pi k^2\,\dd k}{\int_0^{k_F}4\pi k^2\,\dd k} = \frac35k_F^2 ,\\
\text{mean of }k &= \frac{\int_0^{k_F}k\cdot4\pi k^2\,\dd k}{\int_0^{k_F}4\pi k^2\,\dd k} = \frac34k_F .
\end{aligned}$$

A third of $\matter n_e$ times $\tfrac35\hbar^2k_F^2/m_e$, or times $\tfrac34\hbar k_Fc$, is the **degeneracy
pressure**:

$$\matter p = \frac{\matter n_e\hbar^2k_F^2}{5m_e}\;\;\text{(slow)},\qquad \matter p = \frac{\matter n_e\hbar
k_Fc}4\;\;\text{(near } c\text{)} ,$$

which grows as $\matter n_e^{5/3}$ in the first case and as $\matter n_e^{4/3}$ in the second; both are in pascals.

**A white dwarf.** In a star of helium, carbon or oxygen each electron comes with two nucleons, so $\matter n_e =
\matter\rho/2m_p$. We set the slow pressure, about $\hbar^2\matter n_e^{5/3}/m_e$ with $\matter n_e$ of order
$\matter M/m_pR^3$, equal to the gravitational scale $G\matter M^2/R^4$ of hydrostatic balance. This gives the estimate
$R \sim \hbar^2/Gm_em_p^{5/3}\matter M^{1/3}$: the radius *shrinks* as the mass grows. <!-- lint-allow: \sim -->
This is a **white dwarf**, the small, dense remnant of a star like the Sun.

**Its size.** With $k_F = (3\pi^2\matter n_e)^{1/3}$ and $\matter n_e = \matter\rho/2m_p$, the slow
pressure is $\matter p = C_{3/2}\matter\rho^{5/3}$, a polytrope of index $\tfrac32$, with the constant

$$C_{3/2} = \frac{(3\pi^2)^{2/3}\hbar^2}{5m_e(2m_p)^{5/3}} = 3.12\times10^6\unit{m^4\,kg^{-2/3}\,s^{-2}} .$$

At the centre $\matter p_c = C_{3/2}\matter\rho_c^{5/3}$, so the Lane–Emden length obeys $L^2 = 5C_{3/2}/8\pi
G\matter\rho_c^{1/3}$. We take $\matter\rho_c$ from this, put it into the mass $\matter M = 4\pi
L^3\matter\rho_c\,\omega_{3/2}$, and solve for $R = \xi_1L$:

$$R = \xi_1\,(4\pi\omega_{3/2})^{1/3}\,\frac{5C_{3/2}}{8\pi G}\,\matter M^{-1/3} ,$$

with $\xi_1 = 3.654$ and $\omega_{3/2} = 2.714$ from the numerical solution. The unit of $C_{3/2}/G$ is $\mathrm{m\,
kg^{1/3}}$, so $R$ is a length. For $0.6\,M_\odot$ it gives 10,400 km, the size of the Earth, a compactness $G\matter
M/Rc^2$ of $8.5\times10^{-5}$, and a centre of $1.5\times10^9\unit{kg\,m^{-3}}$, a tonne and a half to the cubic
centimetre. There $\hbar k_F = 0.92\,m_ec$, so the electrons are no longer slow, and real white dwarfs of this mass are
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

This is the **Chandrasekhar mass**, the most that electrons can hold up (Figure [](#fig:stars-ends)). Its unit is a
mass, since $(\hbar c/G)^{1/2}$ is the Planck mass, $2.2\times10^{-8}$ kg (section
[11.3](/tutorial/black-holes/hawking/#a-black-hole-has-a-temperature-lower-the-heavier-it-is)). The often-quoted
$1.44\,M_\odot$ includes small corrections (stated).

::: gap
This sketch treats every electron as moving near $c$. The full model follows the change from slow to fast electrons and
finds the radius falling to zero as the mass approaches $\matter M_{\rm Ch}$; it also includes the electrons'
attraction to the nuclei and their capture onto protons, which lower the limit slightly.
:::

**A neutron star.** A core heavier than this collapses, and its electrons are pressed into its protons, which become
neutrons. What is left is a **neutron star** of about $1.4\,M_\odot$ and a radius of about 12 km (11 to 13 km, stated).[^pulsar] Its mean
density, $3.8\times10^{17}\unit{kg\,m^{-3}}$, is 1.4 times that of the matter inside a heavy atomic nucleus,
$2.7\times10^{17}\unit{kg\,m^{-3}}$. Its compactness $G\matter M/Rc^2$ is 0.17 (section
[7.1](/tutorial/geometry/metric/#free-fall-is-the-path-along-which-a-clock-ages-most)), and its central pressure is
near a tenth of $\matter\rho c^2$ (stated). Its **equation of state**, how its matter answers a pressure, is known only
within a range, which allows neutron stars up to about 2 to $2.3\,M_\odot$ (stated). Whatever it is, a neutron star's moment
of inertia, quadrupole and Love number (section 11.4) are tied to one another to about one per cent by the
**I-Love-Q relations** (stated).[^hair] Above about $2\,M_\odot$ nothing holds the core, and it becomes a black hole
(section 11.1).

![Look first at the white-dwarf branch: the heavier the star, the smaller it is, until at 1.43 solar masses
electrons can hold no more. Neutron stars sit a thousand times smaller, near 12 km, and the line $r = r_s$ bounds them
all. The white-dwarf curve is the polytrope of index 3/2, exact; the neutron-star band and the bend toward the limit
are schematic.](tut-stars-ends){#fig:stars-ends}

## A core collapse frees a sixth of a solar mass, and neutrinos carry it

To an order of magnitude, how much energy does a core collapse free? A **core collapse** ends a star of more than
about eight solar masses (stated). Its iron core, held by its electrons near Chandrasekhar's mass and about the size of
the Earth, loses that support, falls inward in less than a second, and is stopped by its neutrons at about 12 km. The
rest of the star is blown off in a **supernova**, an exploding star.

For $\matter M = 1.4\,M_\odot$ and $R = 12$ km the collapse frees the rise in the core's **binding energy**, the energy needed to pull it apart
(section [6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-mass-is-its-total-energy-so-heat-has-weight)). A gas star's binding is only $-U/2$, because by the virial theorem half of its gravitational energy
stays in it as heat. The neutron star is cold within seconds, since the neutrinos carry its heat away, and its stiff
nuclear matter stores little energy in its compression. So it keeps almost nothing to offset its gravitational
energy, and its binding is close to $-U$, which for a uniform ball is $\tfrac35G\matter M^2/R$. At the Earth's radius
the binding was 530 times smaller, so the energy freed is

$$\boxed{\;E \approx \frac35\,\frac{G\matter M^2}{R} = 2.6\times10^{46}\unit J = 0.14\,M_\odot c^2\;}$$

This is 200 times all the light of the Sun in ten billion years. The fit of Lattimer and Prakash to models of real
neutron stars (2001, stated) begins with the same term, and gives in full $2.8\times10^{46}$ J, $0.16\,M_\odot c^2$.
Rounded, this is $3\times10^{46}$ J, a
sixth of a solar mass (section
[6.4](/tutorial/relativity/energy-and-momentum/#gravity-weighs-the-rest-mass-so-a-weighing-reads-the-energy)).

**Neutrinos carry it.** A **neutrino** is a particle with almost no mass and no charge, which crosses matter almost
freely (stated). Each proton that becomes a neutron sends one out, and the new neutron star, at about $10^{11}$ K,
sends out many more. Matter and light stay trapped, but the neutrinos work their way out in about ten seconds, as long
as the burst from the supernova of 1987 lasted. So neutrinos carry about 99% of the energy, and the explosion about 1%
(stated).

**What the camera sees.** By Birkhoff's theorem (section 11.1) a round collapse sends no gravitational waves. Outside
the shell of neutrinos the field is that of the original mass, and inside it that of the remnant (Vaidya, 1951,
stated). Section [R12](/tutorial/sky/reading-sections-x-and-xi/) reads the weighing as the shell passes, with the neutrinos'
squeeze (section
[7.3](/tutorial/geometry/einstein-equation/#inside-matter-the-tide-has-a-part-fixed-by-the-matter-at-that-point)) and
the memory of a lopsided burst (section
[7.8](/tutorial/geometry/wave-energy/#a-burst-that-carries-energy-away-leaves-the-strain-changed-for-good)). About two
core collapses happen in the Galaxy each century (stated), typically some ten kiloparsecs away (a kiloparsec, kpc, is
3260 light-years; section [0.6](/tutorial/evening/how-to-read/#the-sky-has-its-own-units)).

## Two compact bodies spiral together, and a pair of black holes has nine seconds left {#two-compact-bodies-spiral-together-and-the-papers-pair-has-nine-seconds-left}

How long has a circular pair of compact bodies left before it merges? The masses are $\matter m_1$ and
$\matter m_2$, with the total $\matter M = \matter m_1 + \matter m_2$, and $d$ is their separation. We assume that
**the orbit is Newtonian and stays circular**, and that **it shrinks slowly**, so that at each moment it is a circle
losing energy to gravitational waves.

**The energy.** By section 1.8 the separation moves as one body round a fixed mass $\matter M$, so Kepler's law gives
the angular velocity $\Omega = (G\matter M/d^3)^{1/2}$. About the centre of mass the energy is that of a body of the
reduced mass $\matter m_1\matter m_2/\matter M$ in this orbit, $E = -G\matter m_1\matter m_2/2d$.

**The power.** The turning pair radiates (the stretch problem of section
[7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole))

$$P = \frac{32}5\,\frac{G^4\matter m_1^2\matter m_2^2\matter M}{c^5d^5} .$$

**The shrinking.** The energy falls at the rate $P$, and $\dd E/\dd t = (G\matter m_1\matter m_2/2d^2)\,\dd
d/\dd t$, so

$$\frac{\dd d}{\dd t} = -\frac{64}5\,\frac{G^3\matter m_1\matter m_2\matter M}{c^5d^3} .$$

We multiply by $d^3$ and integrate from the separation $d$ now to zero, over the time $\tau$ that remains:

$$\boxed{\;\sym{merger-time}{\tau} = \frac5{256}\,\frac{c^5d^4}{G^3\matter m_1\matter m_2\matter M}\;} \label{eq:inspiral}$$

This is the time to merger of the **inspiral**, the slow spiral of a pair toward its **merger**.[^tau] Its unit is
$\mathrm{(m^5s^{-5})\,m^4/(m^9s^{-6})}$, a second. Halving the separation shortens it sixteen times (Figure
[](#fig:stars-inspiral)). As $d$ shrinks, $\Omega$ grows as $d^{-3/2}$, so the waves' frequency rises ever faster: the
chirp whose rate section 9.5 used.

**A pair of black holes.** Two black holes of $30\,M_\odot$ at 2200 km turn at $\Omega = 27.3\unit{s^{-1}}$, each at
$0.100\,c$, and send waves of 8.7 Hz and wavelength $\lambda = 34{,}400$ km (sections 1.8 and 7.7). The formula gives
$\tau = 8.8$ s, about nine seconds before they merge.[^ten] The reduced wavelength, $\lambda/2\pi = 5500$ km, is 2.5
times the separation, and inside it Figure [](/paper/#fig:binary-field) shows the field turning rigidly with the pair
(section 7.7).

**A white-dwarf pair.** The practice pair of section 1.8, two white dwarfs of $0.6\,M_\odot$ turning every ten minutes,
is 113,000 km apart and radiates at 3.3 mHz. It has 244,000 years left. The wave frequency $f_{\rm GW} = \Omega/\pi$ grows
as $d^{-3/2}$, and $d$ as $\tau^{1/4}$, so $f_{\rm GW} \propto \tau^{-3/8}$. In one year the frequency therefore rises
by $\tfrac38\times(1\text{ year})/\tau = 1.5\times10^{-6}$ of itself, which is $5\times10^{-9}$ Hz. Two waves whose
frequencies differ by $\Delta f$ drift apart by a cycle in the time $1/\Delta f$, so a year's record tells apart only
frequencies more than $3.2\times10^{-8}$ Hz apart. The drift is a sixth of that, so the pair sends out waves at its
own steady frequency. Two neutron stars of $1.4\,M_\odot$ touch at about 24 km, where their
waves have 1.7 kHz, and merge near 2 kHz (section
[R5](/tutorial/waves/reading-section-iii/#every-body-that-moves-as-a-whole-lies-deep-inside-its-near-zone)).

**Limits.** The white dwarfs, at $0.002\,c$, are far inside the formula's range, and the black holes' corrections of
order $(v/c)^2$ nearly cancel. The formula fails near the merger, when the holes, each of $r_s = 89$ km, come within a
few times their size.

**A tail.** The waves leave through the field of the pair's own mass, which focuses them as a mass focuses a passing
wave and raises their power by the factor $1 + 2\pi G\matter M\omega/c^3$, with $\omega$ the waves' angular frequency
(section [R12b](/tutorial/sky/reading-section-xi-2/#matter-scatters-almost-nothing-so-every-picture-is-emitted-pulled-or-yielded)).
For the black holes at 8.7 Hz, $G\matter M\omega/c^3 = 0.016$ and the power is 10% higher; for the white dwarfs the
rise is $8\times10^{-7}$.

::: try {#inspiral}
A pair of compact bodies turning about each other, with readouts of its angular velocity, the frequency and length
of its waves, each body's speed and the time to merger from [](#eq:inspiral), and its place on the map of frequency
against distance of section 0.1. Sliders set the two masses and the separation; the switch Set the time instead lets
you set the time to merger and read the separation. Three presets give the pair of black holes, two neutron stars and
two white dwarfs.

Predict first: two neutron stars of 1.4 solar masses are 2200 km apart, as far apart as the black holes. Do
they have more or less time left than the black holes' 8.8 seconds, and by about what factor? Then choose Neutron
stars, set the separation to 2200 km and read the time. Drag the separation and watch the time change as its fourth
power. On White dwarfs, see how slowly the frequency moves.
:::

![Look first at the dot at 2200 km: the pair of black holes has 8.8 seconds left, and each halving of the separation
cuts the time sixteen times. The white-dwarf pair on the dashed line has 244,000 years. Lines from the quadrupole
formula, exact for Newton's orbit; the grey ends are outside its range.](tut-stars-inspiral){#fig:stars-inspiral}

## In waves the Galaxy shows where its stars are

We want the brightness of the Galaxy's sky in gravitational waves and in light. The model, rounded from Joss
Bland-Hawthorn and Ortwin Gerhard's review (2016), has three parts. Here $\varpi$ (a form of the letter $\pi$) is the
distance from the Galaxy's axis and $z$ the height above its mid-plane, both in kiloparsecs. A **thin disc** of
$3.5\times10^{10}\,M_\odot$ has a density in proportion to $e^{-\varpi/2.6 - |z|/0.3}$. Its **scale length** 2.6 kpc
and **scale height** 0.3 kpc are the distances over which the density falls by a factor $e$. A **thick disc** of
$0.6\times10^{10}\,M_\odot$ has 2.0 and 0.9 kpc. The **bulge**, a ball of $1.5\times10^{10}\,M_\odot$ at the centre,
is flattened to 0.6 of its width in height: its density falls by $e$ every 0.5 kpc of $(\varpi^2 + z^2/0.6^2)^{1/2}$.
The Sun is 8.2 kpc from the centre and 20 pc above the mid-plane.

Tens of millions of close white-dwarf pairs follow the stars (stated; Nelemans and colleagues, 2001), and the model
takes their number, like the light of the stars, in proportion to the stellar mass. Averaged over time and over random
orientations, each pair radiates the same in every direction. So the number radiance $N(\hat n)$ along a line of sight,
the count of gravitons per second, per square metre and per steradian (section
[5.5](/tutorial/waves/radiance/#a-pixel-measures-radiance-power-per-area-per-solid-angle-and-per-frequency)), is the
line integral of the number emissivity $j_N$,

$$N(\hat n) = \int_0^\infty j_N\bigl(s\,\hat n\bigr)\,\dd s $$

with $s$ the distance from the Sun, and $j_N$ is in proportion to the density $\matter\rho_\star$ of the model's stars.
So $N$ is in proportion to the column of stellar mass along the line, $\int\matter\rho_\star\,\dd s$.[^dark] Toward
the centre the line runs 8.2 kpc into rising density and through the bulge (Figure [](#fig:stars-columns)). Toward the
opposite side, the **anticentre**, the density falls away from its value at the Sun. Adding up each column in steps of
0.15 pc out to 60 kpc gives (to three figures)

$$\boxed{\;\frac{N_{\rm centre}}{N_{\rm anticentre}} = 102\;}$$

in the model: the centre is about a hundred times brighter.[^galaxy]

**Dust.** Light from the same stars crosses **interstellar dust**, grains of rock and carbon, here in a disc of its own
with a scale length of 3.2 kpc and a scale height of 0.1 kpc. It dims visible light by one magnitude per kiloparsec
in the mid-plane at the Sun's distance from the centre, and by 0.82 at the Sun's height: **extinction**. The
**magnitudes** of section 0.6 count brightness so that five magnitudes are a factor of 100, and so 30 magnitudes are
$100^6 = 10^{12}$, a million million. Along the 8.2 kpc to the centre the model's dust adds up to 31 magnitudes, while
gravitational waves cross it untouched (section 7.8). So in light the centre is only 1.33 times as bright as the
anticentre: we see only the nearest few kiloparsecs of stars in that direction.

**Reddening.** Most dust grains are smaller than a micrometre, close to the wavelengths of visible light, and grains of
that size block short waves more than long ones, so extinction rises toward the blue, roughly as the inverse of the
wavelength across the visible band (stated). Light that crosses the dust comes out dimmed and reddened, and at
infrared wavelengths of about two micrometres the same column dims the centre by only a few magnitudes, which is why
the stars there are studied in the infrared. Measured that way, the dimming toward the centre is thirty to fifty
visible magnitudes [@Fritz2011], so the model's 31 lies at the low end.

![Look first at the density strip: along the line toward the centre the density of stars rises into the bulge,
and its column is 102 times the anticentre's. Below it, the dust's extinction climbs to 31 magnitudes along the same
line, which hides that centre from light. Curves from the model.](tut-stars-columns){#fig:stars-columns}

**Seeing the glow.** At 3 mHz the waves are 0.67 AU long, and an aperture resolves about the wavelength over its
width, in radians, so a camera 50 AU across sees the glow to $0.77°$, as in Figure [](/paper/#fig:milky-way). The pairs are not a smooth glow, though. A year's record tells apart frequencies
$3.2\times10^{-8}$ Hz apart, and each such interval is a **frequency bin**. Below a
few millihertz each bin holds many pairs, which together make a **confusion foreground** that cannot be taken apart.
Above, the brightest pairs, thousands of them, sit alone in their bins (stated), and one pixel can place each (section 9.1).[^place]

**How many pairs, and how many alone.** A pair is born at a low frequency, when two white dwarfs are left close
together, and its frequency then rises along the chirp until they merge. If pairs are born and merge at a steady rate
$\mathcal R$, in a steady state as many pairs pass each frequency per second as merge:
$(\dd N/\dd f)\,\dot f = \mathcal R$, with $\dd N/\dd f$ the number of pairs per hertz and $\dot f$ the rate at which
each pair's frequency rises. Every pair now above $f$ merges within the time $\tau(f)$ left from $f$, and every pair
that merges within that time is now above $f$, so above the frequencies at which pairs are born

$$N(>f) = \mathcal R\,\tau(f) .$$

With $f \propto \tau^{-3/8}$ (above), $\dot f = 3f/8\tau$, and $\dd N/\dd f = 8\mathcal R\tau/3f \propto f^{-11/3}$.
Population models give $\mathcal R = 1.1\times10^{-2}$ per year, about one merger a century [@Nelemans2001]. For the
pair of two $0.6\,M_\odot$ white dwarfs, $\tau$ is 244,000 years at 3.33 mHz and grows as $f^{-8/3}$, to $2.8\times10^9$
years at 0.1 mHz, so $N(>0.1\unit{mHz}) = 3.1\times10^7$: tens of millions. A year's bins of $3.2\times10^{-8}$ Hz hold
$\dd N/\dd f\times3.2\times10^{-8}$ Hz pairs each: 5.6 at 1 mHz, one at 1.6 mHz and 0.07 at 3.33 mHz. Below 1.6 mHz the
crowded bins make the confusion foreground; above it most bins are empty or hold one pair, and
$N(>1.6\unit{mHz}) = 1.9\times10^4$. With a full population of masses and orbits, Nelemans and colleagues find the
first bins holding one pair near 1.4 mHz and about twelve thousand pairs that a year's record resolves.

**The idea to keep: a star holds itself up by the pressure of its gas, and its particles move with half its binding
energy. Crowded electrons hold a dead star up to $1.43\,M_\odot$ and neutrons to about $2\,M_\odot$; beyond that a
black hole remains. A core collapse frees a sixth of a solar mass in neutrinos. A pair's time to merger grows as the
fourth power of its separation, and in the waves of its white-dwarf pairs the Galaxy shows where its stars are.**

::: problems
### Practice

**[12.1]** Two neutron stars of $1.4\,M_\odot$ each are 100 km apart. Find the frequency of their waves and their time
to merger.

::: solution
With $\matter M = 2.8\,M_\odot$, $\Omega = (G\matter M/d^3)^{1/2} = 610\unit{s^{-1}}$, so the waves have $\Omega/\pi =
194$ Hz, and [](#eq:inspiral) gives $\tau = 0.37$ s.
:::

**[12.1]** With $N(>f) = \mathcal R\,\tau(f)$: how many white-dwarf pairs radiate above 1 mHz, and at what frequency
does a four-year record leave one pair per bin?

::: solution
$\tau(1\unit{mHz}) = 244{,}000\times3.33^{8/3}$ years $= 6.0\times10^6$ years, so $N = 6.6\times10^4$. The count per bin
goes as $f^{-11/3}/T$; four years divide 1.6 mHz's one pair by four, which $f^{-11/3}$ restores at $1.6\times4^{-3/11} =
1.1$ mHz.
:::

### Stretch

**[12.1]** With sections 4.2 and 10.3, find the temperature below which a white dwarf's electrons at
$10^9\unit{kg\,m^{-3}}$ are degenerate, by comparing $\kB T$ with the kinetic energy of an electron at the Fermi
momentum.

::: solution
The electrons number $\matter n_e = \matter\rho/2m_p = 3.0\times10^{35}\unit{m^{-3}}$, so $\hbar k_F =
\hbar(3\pi^2\matter n_e)^{1/3} = 0.80\,m_ec$. The kinetic energy is $(\sqrt{1 + 0.80^2} - 1)m_ec^2 = 143$ keV,
which is $\kB T$ at $1.7\times10^9$ K. White dwarfs are far colder inside, so their electrons are degenerate.
:::

### The camera

**[12.1]** Two black holes of $30\,M_\odot$ are $d = 2200$ km apart. From Kepler's law and [](#eq:inspiral), find their
speed, the length of their waves and the time they have left.

::: solution
With $\matter M = 60\,M_\odot$ and $d = 2.2\times10^6$ m, $\Omega = 27.3\unit{s^{-1}}$, and each hole moves at $\Omega
d/2 = 0.100\,c$. The waves have $\Omega/\pi = 8.7$ Hz and are $c/f = 34{,}400$ km long, and $\tau = 8.8$ s, within
corrections of order $(v/c)^2$.
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
  bald as a hole. [Section XIII](/paper/#sec:second-order): clusters, beside the paper's
  [](/paper/#eq:pass). [Section VIII](/paper/#sec:one-pixel), [*Matter at the pixel*](/paper/#par:matter-at-the-pixel):
  the dark matter's tide.
:::

::: deeper
- The GR course's sections
  [17.8](https://neovand.github.io/general-relativity/chapter-17.html#17-8-a-relativistic-star-has-an-interior) and
  [18.8](https://neovand.github.io/general-relativity/chapter-18.html#18-8-a-real-event-that-turned-these-symbols-into-data)
  build a star in Einstein's theory, where pressure adds to gravity, and read GW150914, the first merger heard.
- S. Chandrasekhar, *An Introduction to the Study of Stellar Structure* (Chicago, 1939; Dover), chapters IV and XI. S. L.
  Shapiro and S. A. Teukolsky, *Black Holes, White Dwarfs, and Neutron Stars* (Wiley, 1983).
- Sources for the Galaxy [@BlandHawthornGerhard2016] and its pairs [@Nelemans2001].
:::

[^mbar]: Astronomers write $\mu$ for it; the book keeps $\mu$ for the shear modulus of section 4.3.

[^rhoc]: Not the critical density of section [12.2](/tutorial/sky/universe/#the-universe-expands-uniformly-and-a-critical-density-decides-its-fate), written $\rho_{\rm crit}$.

[^light]: At the centre of Eddington's model the light's pressure is $4\times10^{-4}$ of the gas's, so the numbers below
    leave it out.

[^pulsar]: A **pulsar** is a turning neutron star whose radio beam sweeps the Earth at each turn, as regularly as a
    clock. A **pulsar timing array** follows dozens of them; nanohertz waves shift their arrival times in a pattern
    across the sky, and NANOGrav found such a background in 2023, with about $10^{-8}$ of the critical density (stated).

[^dark]: The Galaxy also holds **dark matter**, known only by its pull: about $0.4\unit{GeV\,cm^{-3}} =
    7.1\times10^{-22}\unit{kg\,m^{-3}}$ near the Sun (stated). It does not collide, so it does not glow in gravitational
    waves either; section [R9b](/tutorial/one-point/reading-section-viii-2/#inside-matter-the-trace-of-the-tide-reads-the-density-there) reads its tide at a pixel.

[^xi]: Not the separation of free particles of section 1.4, nor an angle.

[^tau]: A time, not the optical depth of section 5.5.

[^ten]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XI](/paper/#sec:vistas), rounded to ten
    seconds and 35,000 km; for exactly ten seconds the formula gives 2270 km. The next two post-Newtonian corrections
    change the time left at 8.7 Hz by $+16\%$ and $-16\%$, under 1% together (stated; Blanchet, *Living Reviews in
    Relativity*, 2014).

[^galaxy]: A model's number, not the sky's. With the Sun in the mid-plane the model gives 99 and 1.24 in light.

[^sky]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XI](/paper/#sec:vistas).

[^lens]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. XI](/paper/#sec:vistas); the denser standard
    model of the Sun gives a focus at 23.5 AU (Patla and Nemiroff).

[^hair]: The relations bear on how bald a neutron star is: *The gravitational camera* (Mohsenvand 2026),
    [Sec. XII](/paper/#sec:hair).

[^place]: The pixel finds the direction of one wave from its tide, as in *The gravitational camera* (Mohsenvand 2026),
    equation [](/paper/#eq:one-wave).
