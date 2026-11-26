---
id: '10.3'
title: 'Why matter barely glows: phonons, electrons, Raman lines, and the bound on every glow'
question: 'Which motions inside matter can a gravitational wave at the frequencies of heat shake, how hard does each resist, and why can no material glow brighter than a fixed bound?'
part: '10'
requires: ['1.5', '4.1', '4.3', '4.4', '4.5', '4.6', '5.1', '8.3', '10.1', '10.2']
paper: [sec:thermal, eq:friction-sum, eq:maxwell, eq:alpha, eq:kirchhoff, eq:glow-bound, eq:surface-glow, eq:volume-surface, tab:materials, fig:materials, fig:closed-furnace, sec:no-lens, sec:first-image]
figures: [fig:materials]
live: [glow-bound]
depth: A
---

Panel (a) of the figure below draws how six materials resist a shear that is the same everywhere: a broad shoulder for
copper, a spike for silicon, a plateau for glass, bumps for water. Panel (b) draws their glow. Added up, at room
temperature copper sends 2.8, silicon 3.4 and diamond 0.25, in units of $10^{-35}\unit{W\,m^{-3}}$, against 21 for a
**placeholder friction**, a constant $10^{-3}\unit{Pa\,s}$ used for comparison.[^p]

{{paper fig:materials}}

Real materials glow at between one and sixty per cent of the placeholder, and none can exceed a certain limit. Section
[10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more)
showed that a body glows by its absorption times Planck's radiance, so we ask about friction. Which motions inside
matter can a gravitational wave at the frequencies of heat shake, how hard does each resist, and why is there a bound
on every glow?

::: plain
A gravitational wave at the frequencies of heat is about a hundred thousand times longer than a sound wave of the same
frequency. So it changes very little from one atom to the next, far less than that sound wave does, and it cannot set
off a single ripple of sound.

It can shake only motions that answer a push that is the same at every atom: the free electrons of a metal, the two
sets of atoms in a crystal such as silicon swinging against each other, every vibration of a glass, and pairs of sound
ripples running in opposite directions.

Each of these motions takes away part of the matter's stiffness when it has time to relax, and causality fixes the
total friction it can make. A material glows most when all of that friction sits where heat glows most strongly. Even
then the glow is the stiffness times gravity's very weak coupling, so every glow is faint, and every material is
almost perfectly transparent.
:::

## A wave shears a body all at once, so it cannot make one phonon

We want the motions that a gravitational wave can set going inside matter, since only they absorb and glow.

**Phonons.** The atoms of a solid move in the normal modes of section
[4.3](/tutorial/response/elastic-bodies/#masses-on-springs-move-in-normal-modes), and the quantum of one is a
**phonon**, as a graviton is the quantum of a mode of a gravitational wave. In a crystal each mode is a wave of
displacement with a wavevector $\vect k$, and its phonon carries the energy $\hbar\omega$ and the momentum $\hbar\vect
k$ (section
[8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons),
stated).

In an **acoustic** mode neighbouring atoms move almost together, and the mode is a sound wave: $\omega =
\sym{shear-speed}{c_T}k$ for shear sound and $\omega = \sym{compressional-speed}{c_L}k$ for compressional sound, with
the speeds of section 4.3 in metres per second. When the repeating cell of the crystal holds two atoms, as in silicon
and diamond, there are also **optical** modes, in which the two sets of atoms swing against each other. Their
frequency stays near a value $\omega_0$ even as $k \to 0$, because the two sets pull on each other at every
wavelength. The **Debye model** of
[section 10.2](/tutorial/glow/kirchhoff/#heat-capacity-says-how-a-bodys-energy-follows-its-temperature) treats every
acoustic mode as sound, up to the Debye frequency $\sym{debye-frequency}{\omega_D}$.

**The wavenumbers do not match.** A gravitational wave of angular frequency $\omega$ has the wavenumber $\omega/c$, and
a shear sound of the same frequency has $\omega/c_T$, larger by $c/c_T$. For $c_T = 3000\unit{m\,s^{-1}}$, $c_T/c =
1.0\times10^{-5}$ (section [5.1](/tutorial/waves/wave-equation/#a-plane-wave-is-a-turning-number-that-travels)). At
3 THz the gravitational wave is 100 µm long and the sound 1.0 nm, a few atoms. One gravitational wavelength spans about
400,000 atoms, so the wave acts as a **uniform shear**, the same at every atom.

To make one phonon, the wave must give it both its energy $\hbar\omega$ and its momentum $\hbar\omega/c$. But an
acoustic phonon of wavenumber $\omega/c$ has the frequency $c_T\omega/c$, $10^{-5}$ of $\omega$: the two lines $\omega
= ck$ and $\omega = c_Tk$ cross only at zero (Figure [](#fig:glow-dispersion)). So **a gravitational wave cannot make a
single acoustic phonon inside a body.** Two things lift the rule. An optical vibration has its frequency at zero
wavenumber, so a wave can make one of those (the section on the Raman line below), and at a boundary the crystal no
longer repeats, so momentum need not be conserved there (the section on the surface at the end). Kahn, Schutte-Engel
and Trickle computed single-phonon absorption of this kind for crystals used as detectors of high-frequency waves
[@KahnSchutteEngelTrickle2024].

![Look first at the steep line: a gravitational wave of any frequency has almost no wavenumber, so it meets no acoustic
phonon, which would need the same frequency at a far larger wavenumber. It can drive the optical vibration, whose
frequency at zero wavenumber is not zero, and pairs of phonons whose momenta cancel. The branches are schematic; the
ratio of slopes is not to scale.](tut-glow-dispersion){#fig:glow-dispersion}

## Every channel is a stiffness that relaxes, spread over a band

Each motion that answers a uniform shear at zero wavenumber is a **channel** of friction. Section
[4.4](/tutorial/response/viscosity/#maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast) named the stiffness
against a sudden shear the unrelaxed rigidity $\sym{unrelaxed-modulus}{\matter\mu_\infty}$, and against a slow one the
relaxed rigidity $\sym{relaxed-modulus}{\matter\mu_0}$, both in pascals. Their difference
$\sym{relaxing-stiffness}{\Delta\matter\mu} = \matter\mu_\infty - \matter\mu_0$ is the stiffness that relaxes, the
**weight** of the channel. Section 4.5 proved the sum rule on the friction
$\mathrm{Re}\,\sym{dynamic-viscosity}{\matter\eta}(\omega)$, in pascal seconds:[^sum]

$$\frac{2}{\pi}\int_0^\infty\mathrm{Re}\,\matter\eta(\omega)\,\dd\omega = \matter\mu_\infty - \matter\mu_0 .$$

A weight spread about evenly over a band of width $\Delta\omega$ gives $\mathrm{Re}\,\matter\eta \approx
(\pi/2)\,\Delta\matter\mu/\Delta\omega$: the stiffness that relaxes there divided by the band over which it does so.
Silica's 37.2 GPa spread below 27 THz, so over $\Delta\omega = 2\pi\times27\unit{THz} = 1.70\times10^{14}\unit{s^{-1}}$,
gives $3.4\times10^{-4}\unit{Pa\,s}$, a third of the placeholder. By section 10.2 the channel glows with
$\sym{emissivity}{j_\omega} = \sym{absorption-coefficient}{\alpha}\,\sym{planck-radiance}{B_\omega}$, with the $\alpha =
16\pi G\,\mathrm{Re}\,\matter\eta/c^3$ of section 7.8. So each channel is two numbers, its weight and its band.

## Free electrons fill a sphere of states, and collisions relax a sheared one

We want the weight and the friction of a metal's **free electrons**, which belong to no single atom (section
[4.4](/tutorial/response/viscosity/#a-metals-electrons-relax-like-a-maxwell-liquid-and-their-friction-has-a-ceiling)
stated both). We assume that **the electrons move freely between collisions**.

**Counting states.** The ripple $e^{i(px - Et)/\hbar}$ of section
[8.1](/tutorial/quantum/states/#a-particle-on-a-line-is-described-by-a-wave-function) is a particle of momentum $p$,
so an electron in the wave $e^{i\vect k\cdot\vect x}$ has the momentum $\hbar\vect k$ and the energy $E =
\hbar^2k^2/2m$, with $m = 9.11\times10^{-31}\unit{kg}$ the electron's mass. In a cube of side $D$ whose opposite faces
are joined, the waves that fit lie on the
[grid](/tutorial/glow/black-body/#the-number-of-waves-that-fit-in-a-box-grows-as-the-square-of-their-frequency)
$\vect k = (2\pi/D)(n_1, n_2, n_3)$, one point in each cell of volume $(2\pi/D)^3$. The **exclusion principle**,
stated here, allows at most one electron in each state of motion and spin, so with two states of spin each point holds
at most two electrons.

We assume that **the metal is cold compared with the electrons' energies** (checked below), so that they fill the
lowest states: every point inside a sphere whose radius $\sym{fermi-wavenumber}{k_F}$, in $\mathrm{m^{-1}}$, is the
**Fermi wavenumber**. The sphere holds $2\cdot\tfrac43\pi k_F^3\cdot D^3/(2\pi)^3$ electrons. Dividing by $D^3$ gives
the number per cubic metre, $\sym{electron-density}{\matter n} = k_F^3/3\pi^2$, and with $\sym{fermi-energy}{E_F} =
\hbar^2k_F^2/2m$,

$$\boxed{E_F = \frac{\hbar^2\,(3\pi^2\matter n)^{2/3}}{2m}} .$$

The unit of $\hbar^2\matter n^{2/3}/m$ is a joule. Copper's $\matter n
= 8.47\times10^{28}\unit{m^{-3}}$ gives $k_F = 1.36\times10^{10}\unit{m^{-1}}$, $E_F = 7.03$ eV and the Fermi speed
$\sym{fermi-speed}{v_F} = \hbar k_F/m = 1.57\times10^6\unit{m\,s^{-1}}$. Iron, counted with two free electrons per atom
($\matter n = 1.70\times10^{29}\unit{m^{-3}}$), has 11.2 eV. **The check:** at 293 K, $\kB T = 0.025$ eV is 280 times
less than copper's $E_F$.

**Two averages.** The first is the **density of states** at the Fermi energy, $g(E_F)$, the number of states per cubic
metre and per joule there. Inverted, the boxed result says that the states below an energy $E$ number
$(2mE)^{3/2}/3\pi^2\hbar^3$ per cubic metre, which grows as $E^{3/2}$, so

$$g(E_F) = \frac{3\matter n}{2E_F} .$$

The second is an average over the directions of motion $\hat{\vect n} = (\sin\theta\cos\phi, \sin\theta\sin\phi,
\cos\theta)$, each direction weighted by its share $\sin\theta\,\dd\theta\,\dd\phi/4\pi$ of the sphere:

$$\langle\hat n_x^2\hat n_y^2\rangle = \frac{1}{4\pi}\int_0^{2\pi}\cos^2\phi\,\sin^2\phi\,\dd\phi
\int_0^\pi\sin^5\theta\,\dd\theta = \frac{1}{4\pi}\cdot\frac{\pi}{4}\cdot\frac{16}{15} = \frac{1}{15} .$$

The $\phi$ integral is that of $\tfrac14\sin^22\phi$, and the $\theta$ integral is $\int_{-1}^1(1 - c^2)^2\,\dd c =
2 - \tfrac43 + \tfrac25$, with $c = \cos\theta$.

**The weight.** We assume that **the shear is too fast for the electrons to change state**. A shear whose only strain
is $u_{xy} = u_{yx}$ (section 4.3, a pure number) stretches the metal by the fraction $u_{ij}\hat n_i\hat n_j =
2u_{xy}\hat n_x\hat n_y$ along $\hat{\vect n}$. Each electron's wave stretches with the metal, so its wavenumber
shrinks by that fraction and its energy, which goes as $k^2$, falls by twice it. At the Fermi surface

$$\delta E = -4E_F\,\hat n_x\hat n_y\,u_{xy} .$$

Half the Fermi surface rises in energy and half falls (Figure [](#fig:glow-fermi)).

![Look first at the middle panel: a sudden shear raises the energy of electrons moving along one diagonal and lowers it
along the other, so the occupied states are no longer the lowest. Collisions move electrons from the raised states to
the lowered ones in a time $\tau$, and the energy they release is the stiffness that relaxes. The distortion is
exaggerated.](tut-glow-fermi){#fig:glow-fermi}

Collisions then move electrons from the raised states above $E_F$ into the lowered states below it, which releases
$\tfrac12g(E_F)\langle\delta E^2\rangle$ per cubic metre (the box below). Before any collision the electrons resist
the shear like a spring of stiffness $\Delta\matter\mu$; collisions release the energy that spring held. A shear held by a stiffness $\matter\mu$ stores $\matter\mu\,u_{ij}u_{ij} =
2\matter\mu\,u_{xy}^2$ per cubic metre (section
[4.3](/tutorial/response/elastic-bodies/#a-strain-stores-energy-half-the-stress-times-the-strain)). So
$2\Delta\matter\mu\,u_{xy}^2 = \tfrac12\cdot(3\matter n/2E_F)\cdot16E_F^2u_{xy}^2/15$, and

$$\boxed{\Delta\matter\mu = \tfrac25\,\matter nE_F = \tfrac15\,\matter nmv_F^2} :$$

38.2 GPa for copper and 122 GPa for iron. A relaxed electron gas keeps no shape, so $\matter\mu_0 = 0$ and
$\matter\mu_\infty = \Delta\matter\mu$.

::: derivation
### The energy that the collisions release

In a direction where $\delta E > 0$, the electrons whose old energies lay between $E_F - \delta E$ and $E_F$ now lie
above $E_F$: there are $g(E_F)\,\delta E$ of them per cubic metre for each unit share of directions, on average
$\tfrac12\delta E$ above $E_F$. In a direction where $\delta E < 0$, the states whose old energies lay between $E_F$
and $E_F + |\delta E|$ were empty and now lie below $E_F$, on average $\tfrac12|\delta E|$ below it. Because
$\langle\delta E\rangle = 0$, there are as many electrons above $E_F$ as empty states below it, and $E_F$ stays where
it was. An electron that moves from the first set to the second gives up its height above $E_F$ and then the depth of
the empty state below it. So both kinds of direction contribute, each $\tfrac12g(E_F)\,\delta E^2$ whatever the sign
of $\delta E$, and the average over directions is $\tfrac12g(E_F)\langle\delta E^2\rangle$.
:::

**The friction**, a sketch. The lopsided sphere carries a stress, the momentum its electrons carry across a plane. We
assume that **collisions with the vibrating atoms remove the lopsidedness at the rate $1/\tau$**, whatever its shape,
with $\sym{relaxation-time}{\tau}$ the collision time of section 4.4. After a sudden shear the stress then dies away as
$e^{-t/\tau}$, which is Maxwell's model with $\matter\eta_0 = \matter\mu_\infty\tau$, so by section 4.4

$$\mathrm{Re}\,\matter\eta = \frac{\tfrac15\,\matter nmv_F^2\,\tau}{1 + \omega^2\tau^2} ,$$

a friction that falls above $\omega\tau = 1$. Copper's $\tau = 2.5\times10^{-14}$ s, from how well it conducts electricity, gives $\omega\tau = 2.7$ at
the energy peak of section 10.1 and 1.5 at the count's peak: about one. **A limit:** as $\tau \to \infty$ the friction at
any $\omega > 0$ falls as $1/\tau$ to zero. A perfect metal answers a fast shear as a solid, and its whole weight moves
to zero frequency.

The weight $\tfrac25\matter nE_F$ is the pressure of the electron gas, two thirds of its energy density
$\tfrac35\matter nE_F$, as the weight of a classical gas is its pressure $\matter n\kB T$ (section
[10.2](/tutorial/glow/kirchhoff/#the-same-law-follows-from-the-random-stress-inside-warm-matter)). The same limit
says why **dark matter**, if its particles never collide, does not glow: its pressure is a stiffness that never
relaxes, so at every frequency above zero its friction vanishes, and it neither absorbs nor emits.

::: gap
This sketch skips the Boltzmann equation, which follows the electrons' occupation of each state as the shear and the
collisions change it. With one collision time for every state its solution is the Maxwell form above.
:::

## A crystal with two atoms in its cell rings at its Raman line when sheared

We want the weight of the optical vibration that a uniform shear drives in silicon and diamond. Their crystal is two
interleaved copies of one lattice. A shear moves the copies as a whole, but the bonds then pull one copy against the
other, so one shifts against the other in proportion to the shear (Figure [](#fig:glow-two-atoms)). This is **internal
strain**, and **Kleinman's parameter** $\sym{kleinman-parameter}{\zeta_K}$, a pure number (0.54 for silicon), measures
its size.[^zeta] The shift is the optical vibration at zero wavenumber.

![Look first at the small arrows: when the lattice is sheared, one copy of atoms does not follow it exactly but shifts
against the other, so a uniform shear drives the vibration in which the two copies swing against each other. The
picture is a flat sketch of a three-dimensional crystal, and the shift is
exaggerated.](tut-glow-two-atoms){#fig:glow-two-atoms}

**The line.** The vibration is the oscillator of section 4.1 at $\sym{natural-frequency}{\omega_0}$. **Raman
scattering** shifts the frequency of some of the light a crystal scatters by $\omega_0$, so the vibration is a **Raman
line**. Its frequency is quoted as a **spectroscopic wavenumber** $\sym{spectroscopic-wavenumber}{\tilde\nu}$, the
number of wavelengths per centimetre of light of that frequency, in $\mathrm{cm^{-1}}$, with $\omega_0 = 2\pi
c\tilde\nu$. Silicon's 520 cm⁻¹, or $5.2\times10^4\unit{m^{-1}}$, gives $\omega_0 = 9.79\times10^{13}\unit{s^{-1}}$, or
15.59 THz, at $\sym{planck-ratio}{x} = \hbar\omega_0/\kB T = 2.55$ at 293 K.

**Its weight** is the stiffness the shear loses when the copies may shift:

$$\Delta\matter\mu_{\rm line} = \frac{M\omega_0^2\zeta_K^2}{8a} .$$

Here $\sym{atom-mass}{M}$ is the mass of one atom and $\sym{lattice-constant}{a}$ the side of the cube that repeats, in
metres. The unit is $\mathrm{kg\,s^{-2}\,m^{-1}}$, a pascal. With $M = 4.66\times10^{-26}$ kg and $a = 0.5431$ nm it is
30.0 GPa.

**Why.** Take the shear $u_{yz}$ and the shift $s_x$ that it drives (the box below shows that it drives no other).
Held together, the copies resist the shear with the **clamped rigidity** $\matter\mu_\infty$, which stores
$2\matter\mu_\infty u_{yz}^2$ per cubic metre (section
[4.3](/tutorial/response/elastic-bodies/#a-strain-stores-energy-half-the-stress-times-the-strain)). The shift is held
back by the spring of the optical vibration: the two atoms of each cell swing against each other with the reduced mass
$M/2$ at $\omega_0$, so the spring stores $\tfrac12(M/2)\omega_0^2s_x^2$ in each cell, and the cube of side $a$ holds eight
atoms, so there are $4/a^3$ cells per cubic metre. The bonds couple the two, so to second order the energy
per cubic metre is

$$E = 2\matter\mu_\infty u_{yz}^2 - Ds_xu_{yz} + \tfrac12Ks_x^2 , \qquad K = \frac{2M\omega_0^2}{a^3} ,$$

with $D$ a constant of the crystal. Given time, the copies settle where $\partial E/\partial s_x = 0$, at $s_x =
Du_{yz}/K$, and Kleinman's parameter is defined by that shift: $s_x = a\zeta_Ku_{yz}/2$, so $D = Ka\zeta_K/2$
[@Tanner2021]. Putting the settled shift back into $E$ lowers it by $\tfrac12Ks_x^2 = Ka^2\zeta_K^2u_{yz}^2/8$. That
is $2\Delta\matter\mu\,u_{yz}^2$ with

$$\Delta\matter\mu = \frac{Ka^2\zeta_K^2}{16} = \frac{M\omega_0^2\zeta_K^2}{8a} ,$$

the weight above. The **relaxed rigidity** $\matter\mu_0 = \matter\mu_\infty - \Delta\matter\mu$ is the one that
slow sound measures. At a frequency $\omega$ the shift follows the shear as the oscillator of section 4.1 follows its
push, so the stress $-Ds_x$ that it adds has the oscillator's friction, with the weight $\Delta\matter\mu$.

**Three of five shears.** In a cubic crystal the [five shears](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length)
of section 1.5 fall into two sets: $b^4$ and $b^5$ stretch along the cube's own axes, on the diagonal, and $b^1$, $b^2$,
$b^3$ are the shears $xy$, $yz$ and $zx$, off the diagonal. The turns that leave the crystal unchanged show that **a
stretch along a cube axis moves both copies alike**, while each shear off the diagonal shifts one copy against the other
along the third axis (the box below). So only the three shears off the diagonal drive the line (Figure
[](#fig:glow-shears)). 

![Look first at the bottom row: each of the three shears off the cube's diagonal shifts one copy of atoms against the
other along the third axis, while the two stretches along the cube's axes shift nothing. So only three of a wave's five
shears drive the Raman line. The rings are schematic.](tut-glow-shears){#fig:glow-shears}

Averaged over every direction and both polarizations, the three shears off the diagonal carry $\tfrac35$ of a wave's
drive (the box), so the line's weight averaged over directions is $\tfrac35\times30.0 = 18.0$ GPa.

::: derivation
### Which shears drive the line, and their share

**The symmetry.** Let $\vect s$ be the shift of one copy against the other. A half turn about the $x$ axis through an
atom leaves the crystal unchanged (stated) and sends $y \to -y$, $z \to -z$. It keeps a stretch $u_{xx}$ and reverses
$s_y$ and $s_z$, so $u_{xx}$ can drive only $s_x$. A half turn about the $y$ axis keeps $u_{xx}$ but reverses $s_x$,
so no stretch drives a shift. The shear $u_{yz}$ is kept by the first turn and reversed by the second, as $s_x$ is, so
it drives $s_x$ alone; likewise $u_{zx}$ drives $s_y$ and $u_{xy}$ drives $s_z$.

**The share.** For a wave along $\hat{\vect n}$, with the unit vectors $\vect e_1$ and $\vect e_2$ across it (section
5.4), the two polarization tables are $e^+ = \vect e_1\vect e_1^{\mathsf T} - \vect e_2\vect e_2^{\mathsf T}$ and
$e^\times = \vect e_1\vect e_2^{\mathsf T} + \vect e_2\vect e_1^{\mathsf T}$, each with $e_{ij}e_{ij} = 2$. With $p =
e_{1z}^2$ and $q = e_{2z}^2$, the two together put on the entry $zz$

$$(e^+_{zz})^2 + (e^\times_{zz})^2 = (p - q)^2 + 4pq = (p + q)^2 = (1 - \hat n_z^2)^2 ,$$

because the three perpendicular unit vectors $\vect e_1$, $\vect e_2$ and $\hat{\vect n}$ have $z$ components whose
squares add to 1. Of the two tables' total of 4, the diagonal holds $\sum_i(1 - \hat n_i^2)^2$. Over directions,
$\langle\hat n_z^2\rangle = \tfrac13$ and $\langle\hat n_z^4\rangle = \tfrac12\int_0^\pi\cos^4\theta\,\sin\theta\,
\dd\theta = \tfrac15$, so $\langle(1 - \hat n_z^2)^2\rangle = 1 - \tfrac23 + \tfrac15 = \tfrac{8}{15}$. The diagonal
then holds $3\cdot\tfrac{8}{15}/4 = \tfrac25$ on average, and the shears off it $\tfrac35$. **A check:** along a cube
edge the shears off the diagonal hold $1 - \tfrac14(1 + 1) = \tfrac12$, and along a body diagonal $1 -
\tfrac14\cdot3\cdot\tfrac49 = \tfrac23$, the values of section 5.4.
:::

**The peak.** The line of width $\sym{damping-rate}{\Gamma} = \omega_0/\sym{quality-factor}{Q}$, here $Q = 173$, has
the friction $\Delta\matter\mu\,\omega_0^2\Gamma/[(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2]$ (section
[4.1](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push)). Near
$\omega_0$ it is a peak of height $\Delta\matter\mu/\Gamma$ and half-width $\Gamma/2$, whose area
$\pi(\Delta\matter\mu/\Gamma)(\Gamma/2) = \pi\Delta\matter\mu/2$ is the sum of section 4.5. The height is
$18.0\unit{GPa}/5.65\times10^{11}\unit{s^{-1}} = 0.032\unit{Pa\,s}$: thirty times the placeholder.

**Glass and water**, from simulations. A glass has no regular arrangement, so a uniform shear drives every
vibration; in silica the weight is about the glass's shear modulus, 37.2 GPa, below 27 THz. In water the hydrogen bonds
carry it: a simulated model gives $2.4\times10^{-4}$ to $2.6\times10^{-4}\unit{Pa\,s}$ near 8 THz, about a third of
its steady viscosity, $6.9\times10^{-4}\unit{Pa\,s}$.

**Why disorder couples.** In a crystal with one atom in its cell every atom is a centre of symmetry: for each
neighbour at $\vect r$ there is one at $-\vect r$. A uniform shear moves the two alike, so their pulls on the atom
change by equal and opposite amounts, and no atom is pushed. The shear stays **affine**, every atom moving with the
strain, and no vibration is driven. In diamond's structure the neighbours of an atom lack that symmetry, and the push
is the internal strain above. In a glass no atom has symmetric surroundings, so a uniform shear pushes every atom with
a force of its own, in proportion to the strain, and the atoms then settle away from the affine positions. This
**non-affine** relaxation lowers the stiffness, and the force projected on each vibration drives it at its own
frequency, so the weight spreads over the whole band of vibrations [@LemaitreMaloney2006; @Damart2017]. In a simulated
silica glass, relaxing after a sudden affine strain releases about half its elastic energy, so the stiffness that
relaxes is about the relaxed modulus itself, $\Delta\matter\mu \approx \matter\mu = 37.2\unit{GPa}$
[@Leonforte2006], with the strain taken to relax in shear as it does in the simulated stretch, and the vibrational band
ends at 27 THz [@Damart2017]. We spread the weight evenly over that band.

**Water's curve.** Schulz and colleagues fitted the friction of a simulated water at zero wavenumber with four terms
[@Schulz2020]. Two have Maxwell's form $\matter\eta_0/(1 + \omega^2\tau^2)$: $0.568\times10^{-3}\unit{Pa\,s}$ with
$1/2\pi\tau = 0.19$ THz, the rearranging of the network of hydrogen bonds, and $0.052\times10^{-3}\unit{Pa\,s}$ at
28.9 THz, the rocking of the molecules. Two are damped lines,
$\matter\eta_0/[(1 - \omega^2\tau_0^2)^2 + (\omega\tau_0^2/\tau_m)^2]$, the oscillator of section 4.1 written for a
friction: $0.019\times10^{-3}\unit{Pa\,s}$ with $1/2\pi\tau_0 = 1.27$ THz and $1/2\pi\tau_m = 2.68$ THz, the
vibrations of groups of three molecules, and $0.053\times10^{-3}\unit{Pa\,s}$ with 7.83 THz and 4.03 THz, the
stretching of the hydrogen bond. At zero frequency they add to $0.692\times10^{-3}\unit{Pa\,s}$, the steady
viscosity above. A Maxwell term has the weight $\matter\eta_0/\tau$ and a line $\matter\eta_0\tau_m/\tau_0^2$, so
the four hold 0.68, 9.45, 0.07 and 5.07 GPa: 15.3 GPa in all, most of it at the rocking and the stretch.

## Even a perfect crystal glows through pairs of phonons

A crystal with one atom in its cell and no free electrons has neither channel. It still glows, because two phonons of
wavevectors $\vect k$ and $-\vect k$ have no total momentum, so a uniform shear can make both at once, at any frequency
up to $2\omega_D$.

**The stress of moving atoms.** The stress of a crystal added over its volume is the momentum the atoms carry across a
plane plus the pull of their springs, and the tensor virial identity of
[section 7.7](/tutorial/geometry/quadrupole-formula/#a-compact-source-is-read-at-zero-wavevector-where-its-stress-is-half-the-acceleration-of-its-quadrupole),
$\int\matter T_{kl}\,\dd V = \tfrac12\ddot{\matter I}_{kl}$, gives it for any isolated body. For the atoms, of mass
$m$ each, the second moment is $\matter I_{kl} = \sum m\,x_kx_l$. We write each atom's place as $\vect x = \vect X +
\vect u$, its place $\vect X$ in the perfect lattice plus its displacement $\vect u$:

$$\matter I_{kl} = \sum m\,\bigl(X_kX_l + X_ku_l + u_kX_l + u_ku_l\bigr) .$$

The first term does not change. The two middle terms are linear in $\vect u$: half their second derivative is the
stress linear in the displacements, the elastic stress of section 4.3, $\matter\mu(\partial_ku_l + \partial_lu_k)$
plus a trace, added over the volume. By Gauss's theorem a volume integral of $\partial_ku_l$ is a surface integral of
$u_l$, so these terms read only how the surface moves, and they are the surface's glow, which the last section of this
chapter takes up. Inside the body only the last term is left:

$$\int\matter T_{xy}\,\dd V = \tfrac12\,\frac{\dd^2}{\dd t^2}\sum m\,u_xu_y ,$$

quadratic in the displacements. A product of two displacements swings at sums and differences of two frequencies.

**Its weight in a model.** We assume an **Einstein solid**, in which every atom sits on its own spring of one angular
frequency $\omega_E$, and that **the motion is classical**, $\kB T \gg \hbar\omega_E$.

*The weight is the stress's jiggle.* The spectrum of the stress $\matter T_{xy}$ (section
[10.2](/tutorial/glow/kirchhoff/#the-same-law-follows-from-the-random-stress-inside-warm-matter)) is $2\kB
T\,\mathrm{Re}\,\matter\eta$ per cubic metre, so the stress averaged over a volume $V$, $\sigma_{xy}$, has the spectrum
$2\kB T\,\mathrm{Re}\,\matter\eta/V$. Its mean square is the integral over $\dd\omega/2\pi$, twice the positive
frequencies (section
[4.6](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency)), and the
sum rule gives

$$\langle\sigma_{xy}^2\rangle = \frac{2\kB T}{\pi V}\int_0^\infty\mathrm{Re}\,\matter\eta\,\dd\omega =
\frac{\kB T\,\Delta\matter\mu}{V} .$$

*One atom.* With $\ddot{\vect u} = -\omega_E^2\vect u$ and the velocity $\vect v = \dot{\vect u}$,
$\dd^2/\dd t^2(\tfrac12mu_xu_y) = m(v_xv_y - \omega_E^2u_xu_y)$. By section
[4.2](/tutorial/response/temperature/#in-phase-space-the-weight-splits-and-the-velocities-are-independent-gaussians)
the four numbers $v_x$, $v_y$, $u_x$, $u_y$ are independent Gaussians of mean zero, with $\langle v_x^2\rangle = \kB
T/m$ and $\langle u_x^2\rangle = \kB T/m\omega_E^2$. The cross term averages to zero, so

$$m^2\langle(v_xv_y - \omega_E^2u_xu_y)^2\rangle = m^2\langle v_x^2\rangle\langle v_y^2\rangle + m^2\omega_E^4\langle
u_x^2\rangle\langle u_y^2\rangle = 2(\kB T)^2 .$$

*All the atoms.* $N$ independent atoms add their squares, so $V^2\langle\sigma_{xy}^2\rangle = 2N(\kB T)^2$. With
$\sym{atom-density}{\matter n} = N/V$, here the number of atoms per cubic metre,

$$\boxed{\Delta\matter\mu_{\rm pairs} = 2\matter n\kB T} ,$$

the classical weight, all of it at $2\omega_E$.[^einstein] Its unit, joules per cubic metre, is a pascal. At 293 K it
is 0.40 GPa for silicon, 0.69 for copper and 1.43 for diamond: about a gigapascal, some fifty times less than copper's
electrons or silicon's line.

**A limit.** Classically the weight vanishes as $T \to 0$, because nothing then moves. With quantum occupations it
does not: a shear can make a pair even in two empty modes, as spontaneous emission needs no quanta present. Diamond,
whose Debye temperature is 2200 K, holds only 0.16 of its classical heat capacity at 293 K, yet in the Debye model of
the next section its pairs hold 4.16 GPa, 2.9 times $2\matter n\kB T$, and still 4.10 GPa at 1 K. That is about its
line's 4.13 GPa, and the pairs make an eighth of diamond's glow.

## In a Debye crystal the pairs fill a band up to twice the Debye frequency, even at absolute zero

We want the pairs' friction at each frequency, with the quanta counted, for the crystal of the Debye model: $N$ atoms
in the volume $V$, sound of one speed $c_s$ in all three polarizations, and wavevectors filling a sphere up to the
Debye frequency $\omega_D$.

**The count.** Take two modes holding $n_1$ and $n_2$ phonons. When the matter absorbs a graviton and makes a pair,
both modes gain a quantum, and by the ladder of
[section 10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more)
the squared entry is $(n_1 + 1)(n_2 + 1)$. When a pair is unmade and a graviton emitted, it is $n_1n_2$. The net
absorption goes as their difference,

$$(n_1 + 1)(n_2 + 1) - n_1n_2 = 1 + n_1 + n_2 .$$

The 1 needs no phonons present, so the pairs absorb even in a crystal at absolute zero.

**The coupling.** By section
[8.3](/tutorial/quantum/quanta/#the-oscillators-energy-factorizes-into-two-ladder-operators), a mode of wavevector
$\vect k$, angular frequency $\omega_k = c_sk$ and polarization $\vect e_s$ moves each atom by
$\sqrt{\hbar/2Nm\omega_k}\,\vect e_s\,(a_{ks}e^{i\vect k\cdot\vect X} + a^\dagger_{ks}e^{-i\vect k\cdot\vect X})$,
the zero-point width $x_{\rm zp}$ of one oscillator shared among the $N$ atoms. The three unit vectors $\vect e_s$ are
perpendicular, so $\sum_se_{s,x}^2 = 1$ and $\sum_se_{s,x}e_{s,y} = 0$. In $\sum m\,u_xu_y$ the part that makes two
phonons holds $a^\dagger_{ks}a^\dagger_{k's'}e^{-i(\vect k + \vect k')\cdot\vect X}$, and the sum over the atoms
vanishes unless $\vect k' = -\vect k$, when it is $N$. So that part is $\sum(\hbar/2\omega_k)\,e_{s,x}e_{s',y}\,
a^\dagger_{ks}a^\dagger_{-ks'}$, over $\vect k$, $s$ and $s'$. Each such product swings as $e^{2i\omega_kt}$, so
$\tfrac12\,\dd^2/\dd t^2$ multiplies it by $-2\omega_k^2$, and the stress makes pairs with the terms
$-\hbar\omega_k\,e_{s,x}e_{s',y}\,a^\dagger_{ks}a^\dagger_{-ks'}$. One pair of modes appears twice, as $(\vect k, s,
s')$ and as $(-\vect k, s', s)$, so its coefficient is $c = -\hbar\omega_k(e_{s,x}e_{s',y} + e_{s',x}e_{s,y})$, and
over the nine choices of $s$ and $s'$

$$\sum_{s,s'}\bigl(e_{s,x}e_{s',y} + e_{s',x}e_{s,y}\bigr)^2 = 2\Bigl(\sum_se_{s,x}^2\Bigr)\Bigl(\sum_{s'}e_{s',y}^2\Bigr)
+ 2\Bigl(\sum_se_{s,x}e_{s,y}\Bigr)^2 = 2 .$$

**The band.** By section
[8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-body-can-take-energy-from-a-push-but-has-none-to-give) each pair
puts a line of weight $2\pi|c|^2(n_1 + 1)(n_2 + 1)$ at $\omega = 2\omega_k$ into the stress's spectrum and its mirror
$2\pi|c|^2n_1n_2$ at $-\omega$. Their difference is $2\hbar\,\mathrm{Im}\,\chi = 2\hbar\omega V\,
\mathrm{Re}\,\matter\eta$, with the $\mathrm{Im}\,\chi$ of section
[10.2](/tutorial/glow/kirchhoff/#the-same-law-follows-from-the-random-stress-inside-warm-matter). The two phonons have
the same frequency, so $1 + n_1 + n_2 = 1 + 2\bar n(\omega/2) = \coth(\hbar\omega/4\kB T)$. Counting each pair once,
the sum over pairs of $|c|^2$ is $\sum_{\vect k}\hbar^2\omega_k^2$, and

$$\mathrm{Re}\,\matter\eta = \frac{\pi\hbar}{\omega V}\sum_{\vect k}\omega_k^2\coth\frac{\hbar\omega_k}{2\kB T}\;
\delta(\omega - 2\omega_k) .$$

The $N$ wavevectors fill the Debye sphere evenly, so the number with $\omega_k$ in $\dd\omega_k$ is
$3N\omega_k^2\,\dd\omega_k/\omega_D^3$, and $\delta(\omega - 2\omega_k) = \tfrac12\delta(\omega_k - \omega/2)$.
With $\matter n = N/V$,

$$\boxed{\mathrm{Re}\,\matter\eta_{\rm pairs} = \frac{3\pi}{32}\,\matter n\hbar\,\frac{\omega^3}{\omega_D^3}\,
\coth\frac{\hbar\omega}{4\kB T}} , \qquad \omega < 2\omega_D ,$$

and zero above $2\omega_D$.[^pairs] The unit of $\matter n\hbar$ is $\mathrm{J\,s\,m^{-3}}$, a pascal second.

**Two limits.** When $\kB T \gg \hbar\omega_D$, $\coth(\hbar\omega/4\kB T) \approx 4\kB T/\hbar\omega$, the friction is
$(3\pi/8)\matter n\kB T\,\omega^2/\omega_D^3$, and the sum rule gives the weight
$(2/\pi)(3\pi/8)\matter n\kB T\,(2\omega_D)^3/3\omega_D^3 = 2\matter n\kB T$, the Einstein solid's. As $T \to 0$,
$\coth \to 1$ and the weight is

$$\Delta\matter\mu_{\rm pairs}(T = 0) = \frac2\pi\cdot\frac{3\pi}{32}\,\matter n\hbar\,\frac{(2\omega_D)^4}{4\omega_D^3}
= \tfrac34\,\matter n\hbar\omega_D ,$$

the zero point's share. **Diamond**, with $\matter n = 8/a^3 = 1.763\times10^{29}\unit{m^{-3}}$ and the Debye
frequency of its elastic constants, $\omega_D = 2.94\times10^{14}\unit{s^{-1}}$ (2250 K), has 4.10 GPa at absolute
zero. At 293 K the band ends at $x = 2\hbar\omega_D/\kB T = 15.3$, so $\coth$ stays near 1 over most of it, and the
integral of the box, done numerically, gives 4.16 GPa. Copper, with its Debye temperature of 343 K
[@Duthil2014], holds 0.73 GPa against its classical 0.69, and silicon (651 K) 0.50 against 0.40.

**Anharmonicity.** Real bonds are not perfect springs: a shear changes each mode's frequency by a fraction of the
strain times the mode's **Grüneisen parameter** $\gamma$, a pure number of order one to two. That change adds a term
of size $\hbar\omega_k\gamma$ to each pair's coupling, beside the harmonic $\hbar\omega_k(e_{s,x}e_{s',y} +
e_{s',x}e_{s,y})$, which is at most $\hbar\omega_k$. So anharmonicity changes the pairs' weight by a factor of order
one.

**Akhiezer's damping.** The same frequency shifts also relax. A sudden shear $u_{xy}$ shifts each mode by $\delta\omega
= -\gamma\omega u_{xy}$, and collisions among the phonons bring the occupations to Planck's for the new frequencies
in the phonons' lifetime $\tau$. Before any collision each mode keeps its $\bar n$ quanta, so its energy changes by
$\bar n\hbar\,\delta\omega$. After them it holds Planck's occupation at its new frequency, and its free energy has
changed by $\bar n\hbar\,\delta\omega - \tfrac12(\hbar\,\delta\omega)^2\bar n(\bar n + 1)/\kB T$, the second term
from the slope $\partial\bar n/\partial(\hbar\omega) = -\bar n(\bar n + 1)/\kB T$. The collisions release the
difference, $\tfrac12u_{xy}^2\gamma^2T\,C_{\rm mode}$, with the heat capacity $C_{\rm mode} = \kB x^2\bar n(\bar n + 1)$ of
[section 10.2](/tutorial/glow/kirchhoff/#heat-capacity-says-how-a-bodys-energy-follows-its-temperature). Added over the
modes and set equal to $2\Delta\matter\mu\,u_{xy}^2$, it gives the weight $\Delta\matter\mu_{\rm Akh} =
\tfrac14C_VT\langle\gamma^2\rangle$, with $C_V$ the heat capacity per cubic metre; the mean of $\gamma$ for a shear is
zero by symmetry. Classically $C_V = 3\matter n\kB$, so this is $\tfrac34\matter n\kB T\langle\gamma^2\rangle$, of the
size of the pairs' $2\matter n\kB T$; Akhiezer found this damping of sound in 1939. But it relaxes in Maxwell's way, $\Delta\matter\mu\,\tau/(1 +
\omega^2\tau^2)$, with its weight near zero frequency. At the frequencies of heat, $\omega\tau \gg 1$, its tail
$\Delta\matter\mu/\omega^2\tau$ over the pairs' $(3\pi/8)\matter n\kB T\omega^2/\omega_D^3$ is

$$\frac{2\langle\gamma^2\rangle}{\pi}\,\frac{1}{\omega_D\tau}\Bigl(\frac{\omega_D}{\omega}\Bigr)^4 :$$

smaller than the pair band by about $\omega_D\tau\,(\omega/\omega_D)^4$, where $\omega_D\tau$ is a thermal phonon's
quality factor. Where phonons are well defined, $\omega_D\tau \gg 1$, the tail is a small correction near the top
of the band.

## Each material of the table is a weight at a place

For each material at 293 K we want its effective friction $\sym{effective-friction}{\matter\eta_{\rm eff}}$ (the
constant friction with the same power), its glow $P/V = 4\pi\int j_\omega\,\dd\omega$ and the mean energy $\bar E$ of
its gravitons.[^table] For a constant friction, $P/V = 4\pi\alpha\,\sigma_{\rm SB}T^4/\pi$ by section 10.1, which is
$2.08\times10^{-35}\unit{W\,m^{-3}}$ for each $10^{-4}\unit{Pa\,s}$ at 293 K. In units of $10^{-4}\unit{Pa\,s}$,
$10^{-35}\unit{W\,m^{-3}}$ and $\kB T$, the models above give:
- **Copper.** The electrons alone give $\matter\eta_{\rm eff} = 1.28$, $P/V = 2.67$ and $\bar E = 1.43$; the pairs add
  the rest, to 1.3, 2.8 and 1.4.
- **Iron.** Its real conduction band is not a free gas, and its collision time is not known. So we take the ceiling of
  section 4.4, $\Delta\matter\mu/2\omega$ with 122 GPa: $P/V = 12.2$ and $\matter\eta_{\rm eff} \le 5.9$. A friction that
  falls as $1/\omega$ has, by the Bose integrals of section 10.1, $\bar E = 2\zeta(3)/(\pi^2/6) = 1.46$.
- **Silicon.** Its line alone gives 1.59, 3.31 and 2.55.
- **Diamond.** Its line, at 1333 cm⁻¹ or 40.0 THz, lies at $x = 6.546$ in the Wien tail, so it is faint and blue: 0.12,
  0.25, $6.4\,\kB T$ (stated).
- **Silica.** A flat band of 37.2 GPa below 27 THz gives 2.31, 4.80 and 2.14.
- **Water**, from the simulation: 0.54, 1.1, 1.7.

**The pairs' share and water.** Each number above is Kirchhoff's integral $4\pi\int\alpha B_\omega\,\dd\omega$, with
the material's friction curve, evaluated numerically, and its count divided by $\hbar\omega$ under the integral. The
pair bands are the box of the last section. Copper's ends at $2\omega_D = 14.3$ THz and glows 0.11, 3.8% of the
total, which takes copper from 2.67 to 2.78, with $\matter\eta_{\rm eff}$ from 1.28 to 1.33. Silicon's, to 27.1 THz,
glows 0.08, taking it from 3.31 to 3.40 and 1.59 to 1.63, and $\bar E$ from 2.55 to 2.56. Diamond's line alone glows
0.219, with $\matter\eta_{\rm eff} = 0.105$ and $\bar E = 6.52\,\kB T$. Its pair band reaches 93.7 THz, past the
shaded band, and with $\coth \approx 1$ its glow is $(3G\hbar^2\matter n/2c^5\omega_D^3)(\kB T/\hbar)^7\int_0^{15.3}x^6\,
\dd x/(e^x - 1)$, with the integral 722: $0.028$, or 0.032 with the full $\coth$. The pairs make $0.032/0.251$, an
eighth, of diamond's glow, and bring its row to 0.12, 0.25 and $6.4\,\kB T$. Water's curve above gives 0.54, 1.1 and
$1.7\,\kB T$. Its glow is redder than a constant friction's: the stretch of the hydrogen bond sits near 8 THz, below
the energy's peak at 17.2 THz, and the rocking's friction is flat only up to 29 THz, so half of its 9.45 GPa lies
above, where Planck's radiance is falling.

So real materials glow at 1.2% (diamond) to 59% (iron's ceiling) of the placeholder's power. The figure's shaded band is
where $B_\omega$ exceeds a tenth of its peak, $0.420 < x < 8.30$, or 2.57 to 50.7 THz at 293 K. The small steps are
where pair bands end, at $2\omega_D$: 14.3 THz for copper, 19.6 THz for iron (with the Debye temperature of steel,
470 K [@Duthil2014]) and 27.1 THz for silicon. Quartz, with nine atoms in its cell, has many optical vibrations that a
shear drives, and should glow like the glass [@Damart2017], and with it most rock, whose highest vibrations, the
stretching of the bond between silicon and oxygen, lie near 1100 cm⁻¹, or 33 THz, so that its pairs end near
66 THz. Soft tissue, mostly water, should glow like water.

**A metal heated.** Iron's ceiling, $\Delta\matter\mu/2\omega$, does not depend on the collision time, so its power
$\propto\int\omega^2\bar n\,\dd\omega$ grows as $T^3$ and its count as $T^2$. The hot iron of the closed furnace of
section 10.1 sends $(1500/293)^2 = 26.2$ times as many gravitons as the cold, not the 134 of a constant friction.

A Drude metal does the same. Its electrons collide with the vibrating atoms, so their rate of collisions $1/\tau$ is
in proportion to the number of phonons there are to meet. Above the Debye temperature each mode holds $\bar n \approx
\kB T/\hbar\omega$ phonons (section
[8.3](/tutorial/quantum/quanta/#a-warm-mode-holds-about-k_bthbaromega-quanta)), the equipartition of section 4.2, so
$1/\tau \propto T$, as measured [@Duthil2014]. The glow's peak also moves as $\omega \propto T$, so $\omega\tau$ there
stays fixed, and the friction there, $\Delta\matter\mu\,\tau/(1 + \omega^2\tau^2)$, falls as $1/T$. Then the power,
$\propto\int\mathrm{Re}\,\matter\eta\,\omega^3\bar n\,\dd\omega$, grows as $T^{-1}T^4 = T^3$, and the count as $T^2$,
the same as iron's ceiling.

## No material can glow brighter than its weight allows

We want the most that a weight $\Delta\matter\mu$ can glow at a temperature $T$, the bound on every glow, which section
[4.5](/tutorial/response/causality/#causality-fixes-a-materials-total-friction) anticipated.

**The glow as an integral.** Kirchhoff's law with the $\alpha$ of section 7.8 and the $B_\omega$ of section 10.1 gives

$$\frac PV = 4\pi\int_0^\infty\alpha B_\omega\,\dd\omega = \frac{16G\hbar}{\pi c^5}\int_0^\infty\mathrm{Re}\,
\matter\eta\;\omega^3\bar n\,\dd\omega ,$$

since $4\pi\cdot16\pi/4\pi^3 = 16/\pi$, with the occupation $\bar n = 1/(e^x - 1)$.

**A positive weight of fixed total.** We assume only that **$\mathrm{Re}\,\matter\eta \ge 0$ at every frequency**,
since friction takes energy from a wave (section 4.1), and that its integral is $\pi\Delta\matter\mu/2$ (section 4.5).
For a positive function $w$ and any function $F$, $\int wF\,\dd\omega \le (\max F)\int w\,\dd\omega$, with equality only
when all of $w$ sits where $F$ is largest. Here $F = \omega^3\bar n = (\kB T/\hbar)^3x^3/(e^x - 1)$, whose largest value
is $(\kB T/\hbar)^3\times1.4214$ at $x = 2.821$. The count divides each band by $\hbar\omega$, and $x^2/(e^x - 1)$ is
largest, 0.6476, at $x = 1.594$. The constants combine as $(16/\pi)(\pi/2) = 8$, the factor 8 of the
[11.37 and 5.18](/tutorial/glow/black-body/#the-energy-of-the-glow-peaks-at-2.82-thermal-energies-and-the-count-at-1.59)
of section 10.1. So, with $\sym{graviton-rate}{\dot N}$ the number of gravitons sent each second in all directions,

$$\boxed{\frac PV \le 11.37\,\frac{G\,\Delta\matter\mu\,(\kB T)^3}{\hbar^2c^5}} , \qquad
\boxed{\frac{\dot N}V \le 5.18\,\frac{G\,\Delta\matter\mu\,(\kB T)^2}{\hbar^2c^5}} .$$

The unit of $G\Delta\matter\mu(\kB T)^3/\hbar^2c^5$ is $\mathrm{W\,m^{-3}}$.[^units]

**Equality** holds when all the weight is a narrow line at $x = 2.821$ (17.2 THz at 293 K), or at $x = 1.594$ (9.7 THz)
for the count (Figure [](#fig:glow-bound)). Near equality, silicon's line at $x = 2.55$ reaches 98.5% of its own weight's bound; far from it,
diamond's line at $x = 6.55$ reaches 28%, or 16% when the pairs' 4.16 GPa join the weight, since they glow little.
Silica's flat band gives 69.2%, copper's electrons alone 37.5% and 38.2% with the pairs, and water 39%. The pairs
of diamond reach only 4.1% of their own bound, because their band runs far into the Wien tail, so adding their weight
nearly doubles diamond's bound and adds an eighth to its glow: 0.251 against the bound of 8.29 GPa is 16%. Water's
1.1 against the bound of its 15.3 GPa is 39%.

**Numbers.** At room temperature 30 GPa radiates at most $5.6\times10^{-35}\unit{W\,m^{-3}}$. The hot iron of the
closed furnace, 122 GPa at 1500 K, can glow at most $3.1\times10^{-32}\unit{W\,m^{-3}}$. To glow as brightly as the
placeholder, a material would need 112 GPa at 293 K and 2.09 TPa at 5500 K; to send as many gravitons at 5500 K, 1.70
TPa. The 2.09 TPa is about four times the shear stiffness of diamond, 536 GPa, so no material has the placeholder's
friction at high temperature.

**Why matter barely glows.** The bound is 11.4 times $G/c^5 = 2.8\times10^{-53}\unit{s^3\,kg^{-1}\,m^{-2}}$ times a
stiffness times $(\kB T)^3/\hbar^2$. Even diamond's whole shear stiffness could glow at most
$1.0\times10^{-33}\unit{W\,m^{-3}}$ at 293 K.

::: try {#glow-bound}
Two panels share a frequency axis. The top one draws a material's friction $\mathrm{Re}\,\matter\eta$ on ordinary
axes, so that its area is $\pi\Delta\matter\mu/2$, over a faint curve of $x^3/(e^x - 1)$; the bottom one draws its
glow. Buttons choose the six materials, the placeholder or Your line, a line of your own whose centre, width and
weight you drag. A Temperature slider moves the Planck weighting, a switch turns the Pairs of phonons on or off, and
for copper a switch makes its Collision rate ∝ T. Readouts give the weight, $P/V$, $\matter\eta_{\rm eff}$,
$\bar E/\kB T$ and the fraction of the bound.

Predict first: where must a line of fixed weight sit to glow the most, and where to send the most gravitons? Choose Your
line and drag it until the fraction of the bound is largest. Then predict by how much copper's count of gravitons grows
from the Room to the Hot iron with its collision rate growing as $T$, switch on Collision rate ∝ T, and read the count
at both temperatures.
:::

![Look first at the spike at the top of the curve: a weight glows the most when it all sits where $x^3/(e^x - 1)$ is
largest, which is the bound. Silicon's line sits close to it, diamond's far down the Wien tail, and copper's spread-out
friction wastes most of its weight at low frequency. The shapes have equal areas; their heights are
schematic.](tut-glow-bound){#fig:glow-bound}

**Absorption.** The same weight bounds what a body can absorb. A path of length $L$ through matter has the optical
depth $\sym{optical-depth}{\tau}(\omega) = \alpha L$ of section 5.5 (here $\tau$ is the optical depth, not the
collision time). Integrating over frequency with the sum rule,

$$\boxed{\int_0^\infty\tau\,\dd\omega = \frac{16\pi GL}{c^3}\cdot\frac{\pi\Delta\matter\mu}{2} = \frac{8\pi^2GL\,
\Delta\matter\mu}{c^3}}$$

in $\mathrm{s^{-1}}$. For a metre of 30 GPa it is $5.9\times10^{-24}\unit{s^{-1}}$. A band in which matter were opaque,
with $\tau \ge 1$ throughout, could be no wider than that. Spread over a band of the order of $\kB T/\hbar = 3.8\times10^{13}\unit{s^{-1}}$ at 293 K, the metre stops
$1.5\times10^{-37}$ of the gravitons that cross it. A cubic metre of detector crossed by one graviton a second would
wait $2.1\times10^{29}$ years for its first count, $1.5\times10^{19}$ ages of the universe.

**A resonant bar.** A single mode obeys the same kind of rule. Take a bar of mass $\matter M$ and length $L$ along $x$,
whose compressional sound runs along it at $v_s$, and a wave along $z$ whose strain is $\field h_{xx} = \field
h_0\cos\omega t$, the best case. The bar's lowest mode stretches it as $u_x = q(t)\sin(\pi x/L)$, for $-L/2 < x <
L/2$, at $\omega_1 = \pi v_s/L$, and the mode's mass is $\int\matter\rho\sin^2(\pi x/L)\,\dd V = \matter M/2$. In
the bar's own frame the wave's tide pushes each kilogram at $x$ with $\tfrac12\ddot{\field h}_{xx}x$ (section
[7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)), so
the mode feels the force

$$F = \tfrac12\ddot{\field h}_{xx}\int\matter\rho\,x\sin\frac{\pi x}{L}\,\dd V = \ddot{\field h}_{xx}\,
\frac{\matter ML}{\pi^2} ,$$

of amplitude $f_0 = \omega^2\field h_0\matter ML/\pi^2$. The oscillator of section 4.1, of mass $\matter M/2$ and width
$\Gamma$, takes the power $(f_0^2/\matter M)\,\Gamma\omega^2/[(\omega_1^2 - \omega^2)^2 + \Gamma^2\omega^2]$, whose
integral over $\omega$ is $\pi f_0^2/2\matter M$ whatever $\Gamma$ is. Divided by the flux $c^3\omega^2\field
h_0^2/32\pi G$ of section 7.8, the cross-section added over frequency is

$$\boxed{\int\sigma\,\dd\omega = \frac{16G\matter Mv_s^2}{c^3}} ,$$

in $\mathrm{m^2\,s^{-1}}$, which depends only on the bar's mass and its speed of sound [@MisnerThorneWheeler1973]. An
aluminium bar of 1.5 tonnes with $v_s = 5100\unit{m\,s^{-1}}$ has $1.5\times10^{-24}\unit{m^2\,s^{-1}}$. As for the
optical depth, damping moves the absorption about in frequency but cannot add to it.

**A narrow line.** A star's oscillations are modes of this kind, and a star may absorb strongly at their frequencies
[@McKernan2014]. But a mode can be opaque, with $\sigma$ at least the star's disc $\pi R^2$, only over a band no wider
than its integral divided by $\pi R^2$. For the Sun, with $\matter M = 2.0\times10^{30}$ kg, $R = 7.0\times10^8$ m and a
speed of sound of order $3\times10^5\unit{m\,s^{-1}}$, the integral is of order $7\times10^6\unit{m^2\,s^{-1}}$, and the
band is at most about $5\times10^{-12}\unit{s^{-1}}$ wide.

## Ordinary bodies glow through their volume, not their surface

We want to know whether a body glows through its volume, as we have assumed, or its surface.

**The surface.** A body without friction cannot absorb inside it (the first section above), but at its surface
the stiffness jumps, the momenta need not match, and a wave launches sound [@Dyson1969]. Dehnen, Romero and Schäfer
worked out the glow this gives a sphere colder than its Debye temperature [@DehnenRomeroSchaefer1984]. For a sphere of
radius $R$ and density $\sym{density}{\matter\rho}$ it grows as $R^2T^2$, and its coefficient follows from the pull of
the wave at the surface and Kirchhoff's law.

**The pull at the surface.** We derive the surface's absorption ourselves, assuming that **the body has no friction
inside**, that **it is many sound wavelengths across**, and that **it is colder than its Debye temperature**, so that its
thermal vibrations are sound. In a gravitational wave the distance between free points changes by the strain
$\tfrac12\field h_{ij}$ (section [7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain)),
so matter displaced by $\vect u$ in the coordinates that free points keep has the strain $u_{ij} + \tfrac12\field
h_{ij}$, and by Hooke's law of section [4.3](/tutorial/response/elastic-bodies/#in-a-uniform-solid-the-stress-answers-each-part-of-the-strain-with-its-own-modulus)
its stress is $\matter Ku_{kk}\delta_{ij} + 2\matter\mu(\tilde u_{ij} + \tfrac12\field h_{ij})$, with $\tilde u_{ij}$
the trace-free part of the strain; the wave's part, $\matter\mu\field h_{ij}$, has no trace. Inside a uniform body that part pushes
nothing, because a wave's strain is transverse, $\partial_j\field h_{ij} = 0$ (section 7.6): this is the first section's
result again. At a free surface, with outward normal $\hat{\vect n}$, the whole traction $\matter T_{ij}\hat n_j$ must
vanish, so the matter's own strain must supply $-\matter\mu\field h_{ij}\hat n_j$. The wave pulls on each square metre
of surface with the traction $\matter\mu\field h_{ij}\hat n_j$ [@Dyson1969].

**The sound it launches.** The traction changes along the surface over a gravitational wavelength, $10^5$ sound
wavelengths, so near each point it is uniform, and it launches plane sound straight into the body. Take $z$ along
$\hat{\vect n}$. The parts $\matter\mu\field h_{xz}$ and $\matter\mu\field h_{yz}$ along the surface launch shear sound,
and the part $\matter\mu\field h_{zz}$ across it compressional sound. In shear sound running into the body, $u_x =
f(t + z/c_T)$, the stress $\matter\mu\,\partial_zu_x$ is $\matter\rho c_T$ times the velocity $\partial_tu_x$, since
$\matter\mu = \matter\rho c_T^2$. So a traction $t$ drives the velocity $t/\matter\rho c_T$ and does the work
$t^2/\matter\rho c_T$ on each square metre each second, and compressional sound has $\matter\rho c_L$ in place of
$\matter\rho c_T$. For $\field h_{ij} = \field h_0e_{ij}\cos\omega t$ the surface takes, averaged over a cycle,

$$\frac{P}{A} = \tfrac12\field h_0^2\,\matter\rho c_T^3\Bigl[e_{xz}^2 + e_{yz}^2 + \frac{c_T}{c_L}\,e_{zz}^2\Bigr]$$

per square metre, because $\matter\mu^2/\matter\rho c_T = \matter\rho c_T^3$ and $\matter\mu^2/\matter\rho c_L =
\matter\rho c_T^3\,c_T/c_L$. Divided by the flux $c^3\omega^2\field h_0^2/32\pi G$ of section 7.8, each square metre
takes the fraction $16\pi G\matter\rho c_T^3/c^3\omega^2$ times the bracket.

**The average.** For a wave along $\hat{\vect n}$, both polarizations together put $(1 - \hat n_z^2)^2$ on the entry
$zz$, by the box on the Raman line, and $2(1 - \hat n_z^2)$ on the row $z$, because each table squared,
$e^Ae^A$, is the projector $P$ across the ray (section 7.6). Over directions $\langle1 - \hat n_z^2\rangle = \tfrac23$
and $\langle(1 - \hat n_z^2)^2\rangle = \tfrac{8}{15}$, so for one polarization the shear part averages to
$\tfrac12(\tfrac43 - \tfrac{8}{15}) = \tfrac25$ and the entry $zz$ to $\tfrac{4}{15}$. Each square metre takes on
average

$$\langle a\rangle = \frac{32\pi}{5}\Bigl(1 + \frac{2c_T}{3c_L}\Bigr)\frac{G\matter\rho c_T^3}{c^3\omega^2}$$

of a wave, a pure number, since $G\matter\rho$ is in $\mathrm{s^{-2}}$ and $c_T^3/c^3\omega^2$ in $\mathrm{s^2}$.

**The glow.** A wave crosses the whole of a transparent sphere, entering on one side and leaving on the other, and the
normals of its surface point every way, so for a wave from any direction its cross-section is $4\pi R^2\langle
a\rangle$. By Kirchhoff's law it glows $P_S = \int4\pi\,\sigma B_\omega\,\dd\omega$, and with $\langle a\rangle
B_\omega \propto \omega/(e^x - 1)$ and $\int x\,\dd x/(e^x - 1) = \pi^2/6$,

$$\boxed{P_S = 4\pi R^2\,\frac{16\pi}{15}\Bigl(1 + \frac{2c_T}{3c_L}\Bigr)\frac{G\matter\rho\,c_T^3\,(\kB T)^2}{\hbar
c^5}} .$$

The disc that the sphere shows a wave is a quarter of its surface, so as a fraction absorbed at every angle the surface
takes $A = 4\langle a\rangle = (128\pi/5)(1 + 2c_T/3c_L)\,G\matter\rho c_T^3/c^3\omega^2$. **A limit:** in a body that
cannot be compressed, $c_L \to \infty$, only shear sound is launched, and the bracket falls to 1. The same absorption follows from a
sphere's normal modes: each quadrupole mode absorbs as the resonant bar above does, and their integrated
cross-sections, added over a band of frequency that holds many modes and computed numerically, give the box to within
half a per cent for $c_L = 1.5c_T$ and $2c_T$.[^coef]

**Smolin's absorption.** For a body of mass $\matter M$ and size $L$, $\matter\rho \approx \matter M/L^3$, and the
fraction is of order

$$\frac{G\matter M}{Lc^2}\Bigl(\frac{\lambda}{2\pi L}\Bigr)^2\Bigl(\frac{c_T}{c}\Bigr)^3 ,$$

with $\lambda/2\pi = c/\omega$: the body's compactness, its size in reduced wavelengths and its slowness of sound, each
far below one. From this Smolin concluded that no stable matter absorbs gravitational waves over a broad band
[@Smolin1985]. A metre of steel takes $A = 1.8\times10^{-27}$ of a wave at 1 kHz and $2\times10^{-46}$ at 3 THz.

**The volume.** Inside, the friction of sound of quality factor $Q$ is $\mathrm{Re}\,\matter\eta =
\matter\rho c_T^2/\omega Q$ (section
[4.4](/tutorial/response/viscosity/#a-ringing-solids-friction-is-its-quality-factor)), which falls as $1/\omega$, so
the volume's glow grows as $T^3$ and the surface's as $T^2$. The ratio of the volume's power $P_V$ to the surface's
$P_S$, both in watts, is

$$\boxed{\frac{\sym{volume-power}{P_V}}{\sym{surface-power}{P_S}} = \frac{10\,\zeta(3)}{\pi^2(1 + 2c_T/3c_L)}\,
\frac{R}{\ell_s}} , \qquad \sym{phonon-path}{\ell_s} = \frac{Q\hbar c_T}{\kB T} ,$$

with $\ell_s$ the distance a thermal phonon, of angular frequency about $\kB T/\hbar$, travels at $c_T$ in its damping
time $Q/\omega$.[^vol]

::: derivation
### Kirchhoff's check and the volume's glow

**The surface.** Treat whatever absorbs at the surface as a thin layer. Along a ray leaving it, the law $j_\omega =
\alpha B_\omega$ of section 10.2 adds the radiance $\int j_\omega\,\dd s = B_\omega\int\alpha\,\dd s = AB_\omega$,
since the small $\int\alpha\,\dd s$ is the fraction $A$ that the layer takes from a ray. If $A$ is the same at every
angle, the half sky of section 10.1, $\int\cos\theta\,\dd\Omega = \pi$, gives $\pi\int AB_\omega\,\dd\omega$ per square
metre. With $AB_\omega \propto \omega/(e^x - 1)$ and $\int x\,\dd x/(e^x - 1) = \pi^2/6$,

$$\pi\cdot\frac{128\pi}{5}\Bigl(1 + \frac{2c_T}{3c_L}\Bigr)\frac{G\matter\rho c_T^3}{c^3}\cdot\frac{\hbar}{4\pi^3c^2}
\Bigl(\frac{\kB T}{\hbar}\Bigr)^2\frac{\pi^2}{6} = \frac{16\pi}{15}\Bigl(1 + \frac{2c_T}{3c_L}\Bigr)
\frac{G\matter\rho c_T^3(\kB T)^2}{\hbar c^5} ,$$

which is $P_S/4\pi R^2$ exactly.

**The volume.** In the bound's integral $\omega^3/\omega = \omega^2$, and $\int x^2\,\dd x/(e^x - 1) = 2\zeta(3)$ gives

$$P_V = V\,\frac{16G\hbar}{\pi c^5}\,\frac{\matter\rho c_T^2}{Q}\Bigl(\frac{\kB T}{\hbar}\Bigr)^3 2\zeta(3) =
V\,\frac{32\zeta(3)\,G\matter\rho c_T^2(\kB T)^3}{\pi c^5Q\hbar^2} .$$

Dividing by $P_S$, with $V = \tfrac43\pi R^3$, gives the boxed ratio.
:::

**Numbers.** For a steel ball, with $c_T = 3200$ and $c_L = 5900\unit{m\,s^{-1}}$ and $\matter\rho =
7800\unit{kg\,m^{-3}}$, the prefactor is 0.89, and at $Q = 10$, $\ell_s = 0.83$ nm. A ball of radius 10 cm glows
$6.3\times10^{-46}$ W from its surface and $1.1\times10^8$ times more from its volume.[^steels] With the glows above, the two meet at $R = 3(P_S/4\pi R^2)/(P/V)$: 165 nm for diamond, the faintest (Figure
[](#fig:glow-surface)).[^thirty] **A limit:** the surface wins only once $\ell_s$ passes about $0.9R$, as in a pure crystal cooled until its phonons
cross it about once.

**Why $Q$ is about ten.** A thermal phonon's quality factor is $\omega\tau$, the number of radians it swings before it
is scattered, or its free path $\ell$ over its reduced wavelength $c_T/\omega = \hbar c_T/\kB T$. The free path follows
from how well a solid conducts heat: in the kinetic theory of heat conduction (stated), phonons that carry the heat
capacity $C$ per cubic metre at the speed $v$ over the free path $\ell$ give the conductivity $\kappa = \tfrac13Cv\ell$.
Silica glass, with $\kappa = 1.4\unit{W\,m^{-1}\,K^{-1}}$, $C = 1.6\times10^6\unit{J\,m^{-3}\,K^{-1}}$ and $v \approx
4100\unit{m\,s^{-1}}$, has $\ell = 3\kappa/Cv = 0.62$ nm, six of its reduced wavelengths of 0.10 nm: $Q \approx 6$.
Ordinary solids at room temperature have $Q$ of this order, and only cold, pure crystals have far more.

![Look first at the dots on the right: even diamond, the faintest of the materials, glows more through its volume than
through its surface once it is larger than 165 nm, and a steel ball of 10 cm glows about a hundred million times more
through its volume. The ripples on the left are schematic; the lines are exact.](tut-glow-surface){#fig:glow-surface}

## The Sun's core glows by the collisions of its electrons, at about $10^8$ W

The hottest matter near us is the core of the Sun, a plasma of electrons and bare nuclei at 15.7 million kelvin. There
$\kB T/\hbar = 2.1\times10^{18}\unit{s^{-1}}$, about a hundred times the rate at which an electron collides, so the
plasma's friction at the frequencies of its heat is set by single collisions, each of which sends out a burst of
gravitons. How brightly does the core glow?

**One collision.** We assume that **the electron is slow**, $v \ll c$, and that **the nucleus, far heavier, stays
still**, so that the second moment of the pair is the electron's, $\matter I_{ij} = mx_ix_j$ about the nucleus. Before
and after the collision the electron moves freely, $\vect x = \vect vt + \vect b$, so $\ddot{\matter I}_{ij} =
2mv_iv_j$ is constant, and the collision changes it by $\Delta\ddot{\matter I}_{ij} = 2m(v'_iv'_j - v_iv_j)$, with
$\vect v'$ the velocity after. The collision is elastic, $|\vect v'| = |\vect v|$, so the change has no trace. Then
$\dddot{\matter I}_{ij}$ is a short pulse whose time integral is $\Delta\ddot{\matter I}_{ij}$, and at every frequency
below the inverse of its duration its transform is $\Delta\ddot{\matter I}_{ij}$ itself. The quadrupole formula of
[section 7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole) gives
the energy $(G/5c^5)\int\dddot{\matter I}_{ij}\dddot{\matter I}_{ij}\,\dd t$, and Parseval's theorem of
[section 2.6](/tutorial/outside/fourier/#the-power-of-a-pattern-is-the-same-counted-point-by-point-or-ripple-by-ripple),
with the negative frequencies folded onto the positive, turns it into $\int_0^\infty(G/5\pi c^5)\,\Delta\ddot{\matter
I}_{ij}\Delta\ddot{\matter I}_{ij}\,\dd\omega$. With $\Delta\ddot{\matter I}_{ij}\Delta\ddot{\matter I}_{ij} =
4m^2[2v^4 - 2(\vect v\cdot\vect v')^2] = 8m^2v^4\sin^2\theta$, for the angle $\theta$ through which the electron turns,
the energy sent per unit of angular frequency is flat:

$$\frac{\dd E}{\dd\omega} = \frac{8Gm^2v^4\sin^2\theta}{5\pi c^5} .$$

This is Weinberg's spectrum of soft gravitons, in the limit of slow particles [@Weinberg1965]. Its unit,
$\mathrm{s^3\,kg^{-1}\,m^{-2}\cdot kg^2\,m^4\,s^{-4}} = \mathrm{J\,s}$, is an energy per angular frequency. **A limit:**
an electron that passes undeflected, $\theta = 0$, sends nothing.

**Where it stops.** A graviton cannot carry more than the electron's kinetic energy $E = \tfrac12mv^2$, so the
spectrum ends near $\omega = E/\hbar$. In the core the collisions are quantum: for an electron of $\tfrac32\kB T$, the
distance at which the nucleus's pull turns it sharply, $b_0 = Ze^2/4\pi\varepsilon_0mv^2 = 3.6\times10^{-13}$ m, is
twelve times smaller than its reduced wavelength $\hbar/mv = 4.3\times10^{-12}$ m.

**How often.** The chance per unit area of turning through $\theta$ is Rutherford's cross-section, $\dd\sigma =
(b_0/2)^2\,\dd\Omega/\sin^4(\theta/2)$ (stated; quantum mechanics gives the same). With $s = \sin(\theta/2)$,
$\sin^2\theta = 4s^2(1 - s^2)$ and $\dd\Omega = 2\pi\sin\theta\,\dd\theta = 8\pi s\,\dd s$, so

$$\int\sin^2\theta\,\dd\sigma = 8\pi b_0^2\int_{s_{\min}}^1\frac{1 - s^2}{s}\,\dd s \approx 8\pi b_0^2\,g , \qquad g =
\ln\frac1{s_{\min}} - \frac12 .$$

The logarithm is cut off at small angles: to give up $\hbar\omega$ the electron must change its momentum $p$ by at
least $\hbar\omega/v$, while a turn through $\theta$ changes it by $2ps$, so $s_{\min} = \hbar\omega/2pv =
\hbar\omega/4E$. Averaged over $0 < \hbar\omega < E$, $g = \ln(4E/\hbar\omega) - \tfrac12$ gives $\bar g = \ln4 + \tfrac12
= 1.89$.

**The emissivity.** A nucleus meets $\matter n_ev$ electrons per square metre each second, so with $\matter n_i$ nuclei
of charge $Z$ per cubic metre, and $b_0 \propto Z$, the core sends, per cubic metre,

$$\frac PV = \matter n_e\sum\matter n_i\,\Bigl\langle v\cdot8\pi b_0^2\bar g\cdot\frac{8Gm^2v^4}{5\pi
c^5}\cdot\frac{E}{\hbar}\Bigr\rangle = \frac{64G\bar g}{5\hbar c^5}\Bigl(\frac{e^2}{4\pi\varepsilon_0}\Bigr)^2\matter
n_e\sum Z^2\matter n_i\,\bigl\langle\tfrac12mv^3\bigr\rangle .$$

The units are $\mathrm{s^3\,kg^{-1}\,m^{-2}\cdot J^{-1}\,s^{-1}\cdot J^2\,m^2\cdot m^{-6}\cdot kg\,m^3\,s^{-3}} =
\mathrm{W\,m^{-3}}$. Over the Maxwell distribution of
[section 4.2](/tutorial/response/temperature/#in-phase-space-the-weight-splits-and-the-velocities-are-independent-gaussians)
the speeds have $\langle v^3\rangle = (4/\sqrt\pi)(2\kB T/m)^{3/2}$, so the glow goes as $\matter n_e\matter\rho
T^{3/2}$ and comes mostly from the electrons, the lightest and fastest particles. Collisions of two electrons count as
well, with the reduced mass $m/2$ and $\matter n_e^2/2$ pairs; they add $(1 + X)/2\sqrt2$ of the rest, with $X$ the
share of hydrogen by mass, and collisions between nuclei add almost nothing.

**The Sun.** At the centre of a standard model of the Sun (Bahcall, Pinsonneault and Basu 2001), $T = 1.57\times10^7$
K, $\matter\rho = 1.5\times10^5\unit{kg\,m^{-3}}$ and $X = 0.34$. Hydrogen and helium both have $Z^2/A = 1$, so $\sum
Z^2\matter n_i = \matter\rho/m_p = 9.0\times10^{31}\unit{m^{-3}}$, and $\matter n_e = \matter\rho(1 + X)/2m_p =
6.0\times10^{31}\unit{m^{-3}}$, with $m_p$ the proton's mass. With $\kB T = 1.35$ keV the formula gives
$1.9\times10^{-17}\unit{W\,m^{-3}}$ from the nuclei and 0.47 times that from the electrons' own collisions,
$2.8\times10^{-17}\unit{W\,m^{-3}}$ in all. Weighted by $\matter n_e\matter\rho T^{3/2}$ over the model, the core glows
as if this central value filled a sphere of $0.12R_\odot$, $2.2\times10^{24}\unit{m^3}$, so

$$P_\odot \approx 2.8\times10^{-17}\unit{W\,m^{-3}}\times2.2\times10^{24}\unit{m^3} = 6\times10^7\unit{W} .$$

Steane, who computed the factor $g$ properly from the classical and the quantum limits, found
$76 \pm 20$ MW [@Steane2024], and García-Cely and Ringwald, with the plasma's other processes as well, found a total of
the same order [@GarciaCelyRingwald2025]. **The Sun radiates about $10^8$ W in gravitational waves**, $3\times10^{-19}$ of its
light, in gravitons of about a kiloelectronvolt. Spread over a sphere through the Earth,
$10^8$ W is $3.6\times10^{-16}\unit{W\,m^{-2}}$, roughly one graviton per square metre each second.

**The idea to keep: a gravitational wave shears matter uniformly, so it cannot make one phonon. It shakes only free
electrons, the optical vibration of a crystal, the disorder of a glass and pairs of phonons, and causality gives each a
fixed budget of friction, its stiffness that relaxes. Even with the whole budget at the peak of Planck's spectrum, no
material glows brighter than $11.4\,G\Delta\matter\mu(\kB T)^3/\hbar^2c^5$ per volume. Matter barely glows because
this is $G/c^5$ times a stiffness, and no matter's stiffness goes much past a terapascal.**

::: problems
### Practice

Aluminium has three free electrons per atom, $\matter n = 1.81\times10^{29}\unit{m^{-3}}$ (a standard value). Find its
Fermi energy, Fermi speed and the weight $\tfrac25\matter nE_F$ of its electrons' friction.

::: solution
$E_F = \hbar^2(3\pi^2\matter n)^{2/3}/2m = 1.87\times10^{-18}$ J, or 11.7 eV; $v_F = \sqrt{2E_F/m} =
2.03\times10^6\unit{m\,s^{-1}}$; and $\tfrac25\matter nE_F = 135$ GPa.
:::

**[10.3]** Why can a gravitational wave not make one sound phonon in a metre of steel?

::: solution
Its wavenumber is $10^{-5}$ of the sound's, so it cannot supply the momentum.
:::

**[10.3]** A material has 30 GPa of stiffness that relaxes. What is the most it can glow at 293 K?

::: solution
$11.37\,G\Delta\matter\mu(\kB T)^3/\hbar^2c^5 = 5.6\times10^{-35}\unit{W\,m^{-3}}$.
:::

**[10.3]** Diamond has $M = 1.994\times10^{-26}$ kg, $a = 0.3567$ nm, $\zeta_K = 0.125$ and its line at
$\omega_0 = 2.51\times10^{14}\unit{s^{-1}}$. Find the weight $M\omega_0^2\zeta_K^2/8a$ and its average over directions.

::: solution
$M\omega_0^2\zeta_K^2/8a = 1.994\times10^{-26}\times6.30\times10^{28}\times0.0156/(2.854\times10^{-9}\unit m) =
6.88$ GPa, and three fifths of it is 4.13 GPa.
:::

**[10.3]** What fraction of a wave of 1 kHz does the surface of a block of steel absorb, with $c_T = 3200$,
$c_L = 5900\unit{m\,s^{-1}}$ and $\matter\rho = 7800\unit{kg\,m^{-3}}$?

::: solution
$G\matter\rho c_T^3/c^3\omega^2 = 1.60\times10^{-29}$ at $\omega = 6283\unit{s^{-1}}$, and
$A = (128\pi/5)(1 + 2c_T/3c_L)$ times that is $1.8\times10^{-27}$.
:::

### Stretch

Diamond's line, averaged over directions, has the weight 4.13 GPa at 1333 cm⁻¹ and the width $\Gamma =
2.94\times10^{11}\unit{s^{-1}}$. Find its $Q$ and its peak friction. Is the line narrow beside $x^3/(e^x - 1)$? What
fraction of its bound does it reach at 293 K, and at what temperature would it reach the whole bound?

::: solution
Its $\omega_0 = 2\pi c\tilde\nu = 2.51\times10^{14}\unit{s^{-1}}$, so $Q = \omega_0/\Gamma = 854$ and the peak is
$\Delta\matter\mu/\Gamma = 0.014\unit{Pa\,s}$. The line is $1/854$ of its frequency wide, while $x^3/(e^x - 1)$
changes over $\Delta x \approx 1$, so its whole weight sits at $x = 6.546$, and its fraction is $[x^3/(e^x -
1)]/1.4214 = 0.28$. It reaches the bound at $x = 2.821$, at $293\unit{K}\times6.546/2.821 = 680\unit{K}$.
:::

**[10.3]** Silicon has $\matter n = 5.01\times10^{28}\unit{m^{-3}}$ and $\omega_D = 8.52\times10^{13}\unit{s^{-1}}$
(651 K). Find the weight of its pairs at absolute zero and compare it with the classical $2\matter n\kB T$ at 293 K.

::: solution
$\tfrac34\matter n\hbar\omega_D = 0.75\times5.01\times10^{28}\times1.055\times10^{-34}\times8.52\times10^{13} =
0.34$ GPa, against $2\matter n\kB T = 0.41$ GPa. The full $\coth$ at 293 K, below silicon's Debye temperature,
gives 0.50 GPa, more than either.
:::

**[10.3]** A resonant bar of aluminium has the mass 1.5 tonnes and $v_s = 5100\unit{m\,s^{-1}}$. Find its cross-section
integrated over angular frequency, and over frequency in hertz. Does it depend on the bar's length?

::: solution
$16G\matter Mv_s^2/c^3 = 1.5\times10^{-24}\unit{m^2\,s^{-1}}$, or $2.5\times10^{-25}\unit{m^2\,Hz}$ over
$\omega/2\pi$. It does not depend on the length: a longer bar has a lower note and a larger second moment, and the two
cancel.
:::

**[10.3]** Show that collisions between electrons add $(1 + X)/2\sqrt2$ of the glow of collisions between electrons and
nuclei, and evaluate it at the Sun's centre, $X = 0.34$, and where $X = 0.70$.

::: solution
A pair of electrons has the reduced mass $m/2$, so its $\langle\tfrac12\mu v^3\rangle$, which goes as
$\mu^{-1/2}$, is $\sqrt2$ times an electron's against a nucleus; there are $\matter n_e^2/2$ pairs against $\matter
n_e\sum Z^2\matter n_i$. The ratio is $\matter n_e/(\sqrt2\sum Z^2\matter n_i)$, and with $\matter n_e = \matter\rho(1 +
X)/2m_p$ and $\sum Z^2\matter n_i = \matter\rho/m_p$ it is $(1 + X)/2\sqrt2$: 0.47 at the centre and 0.60 where
$X = 0.70$.
:::

### The camera

Derive the bound on the glow and the integrated optical depth $8\pi^2GL\,\Delta\matter\mu/c^3$, and find the stiffness
at which a material would glow as brightly as the placeholder at 293 K and at 5500 K, and send as many gravitons at
5500 K. The answers are 0.110 TPa, 2.1 TPa and 1.7 TPa.

::: solution
The derivation is that of the section [on the bound](#no-material-can-glow-brighter-than-its-weight-allows). The
placeholder glows $4\alpha\sigma_{\rm SB}T^4$ with $\alpha = 16\pi G\times 10^{-3}\unit{Pa\,s}/c^3$; setting this
equal to the bound gives $\Delta\matter\mu = 4\alpha\sigma_{\rm SB}T^4\hbar^2c^5/(11.37\,G(\kB T)^3)$: 0.112 TPa at
293 K and 2.09 TPa at 5500 K. Its count is $(16G\eta/\pi c^5)(\kB T/\hbar)^3\,2\zeta(3)$, and setting it equal to the
second bound gives 1.70 TPa at 5500 K.
:::
:::

::: paper
- Section VI's [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat): the $10^{-5}$,
  the electrons, the driven vibrations, the pairs and a hot metal's $T^2$; Table [](/paper/#tab:materials) and Figure
  [](/paper/#fig:materials).
- Section VI's [*A bound on the glow*](/paper/#par:a-bound-on-the-glow): the bound, its fractions, the integrated
  optical depth and the 110 GPa, 2.1 TPa and 1.7 TPa.
- Section VI's [*Volume and surface emission*](/paper/#par:volume-and-surface-emission): the steel ball.
- [Section IX](/paper/#sec:first-image): the Earth's shells at their bounds, the core's electrons and the
  $2\times10^{29}$ years.
- [Section VII](/paper/#sec:no-lens): optical depths from $\mathrm{Re}\,\eta = \rho c_T^2/\omega Q$.
:::

::: deeper
- N. W. Ashcroft and N. D. Mermin, *Solid State Physics* (Saunders, 1976), chapters 1 and 2 (free electrons) and 22
  and 23 (phonons).
- F. J. Dyson, "Seismic response of the Earth to a gravitational wave in the 1-Hz band", *Astrophysical Journal* 156
  (1969) 529: why a body without friction absorbs at its surface.
:::

[^p]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, as its Table [](/paper/#tab:materials)
    and Fig. [](/paper/#fig:materials).

[^sum]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, as its equation
    [](/paper/#eq:friction-sum); the bound below is its equation [](/paper/#eq:glow-bound).

[^table]: Each material's row of the table in Sec. VI of *The gravitational camera* (Mohsenvand 2026) gives the same
    three numbers.

[^zeta]: Kleinman's $\zeta_K$ always carries its subscript; it is not the $\zeta(3)$ of section 10.1.

[^einstein]: The product $u_xu_y$ of one atom swings at $2\omega_E$ and also has a steady part, which the second
    derivative removes.

[^pairs]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, where the pair bands enter its Table
    [](/paper/#tab:materials).

[^units]: $G\Delta\matter\mu$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}\cdot kg\,m^{-1}\,s^{-2}}$, and $(\kB T)^3/\hbar^2c^5$
    is $\mathrm{J^3/(J^2\,s^2\,m^5\,s^{-5})} = \mathrm{J\,m^{-5}\,s^3}$; their product is $\mathrm{J\,m^{-3}\,s^{-1}}$.

[^vol]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VI, as its equation
    [](/paper/#eq:volume-surface), whose prefactor there, 5.5, follows from the coefficient corrected above.

[^steels]: Another steel, with $c_T = 3000\unit{m\,s^{-1}}$, gives $5.1\times10^{-46}$ W and $1.2\times10^8$.

[^coef]: This coefficient corrects the one printed in *The gravitational camera* (Mohsenvand 2026), Sec. VI, equation
    [](/paper/#eq:surface-glow), which carries a factor $\pi^2/24$ with the sound-speed ratio inverted, $3c_T/2c_L$.
    The derivation here was checked against a sum over the sphere's quadrupole modes.

[^thirty]: Diamond's crossing is
    165 nm with the sound speeds of its own elastic constants, $c_T = 12.35$ and $c_L = 18.15\unit{km\,s^{-1}}$;
    rounder sound speeds give about 175 nm. *The gravitational camera* (Mohsenvand 2026) first gave this crossing, as
    30 nm, from the coefficient corrected above.
    Every other material of the table crosses below 1 nm.
