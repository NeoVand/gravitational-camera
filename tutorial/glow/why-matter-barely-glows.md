---
id: '10.3'
title: 'Why matter barely glows: phonons, electrons, Raman lines, and the bound on every glow'
question: 'Section VI finds that real materials glow at "between one and sixty per cent" of a reference friction, and that "no material can glow more brightly than a certain limit". Which motions inside matter can a gravitational wave at the frequencies of heat shake, how hard does each resist, and why can no material glow brighter than a fixed bound?'
part: '10'
requires: ['1.5', '4.1', '4.3', '4.4', '4.5', '4.6', '5.1', '8.3', '10.1', '10.2']
paper: [sec:thermal, eq:friction-sum, eq:maxwell, eq:alpha, eq:kirchhoff, eq:glow-bound, eq:surface-glow, eq:volume-surface, tab:materials, fig:materials, fig:closed-furnace, sec:no-lens, sec:first-image]
figures: [fig:materials]
live: [glow-bound]
depth: A
---

<!-- hero: Part 10's hero, the closed furnace cut open (P6a-DECISIONS item 6), is made after the part's chapters. -->

**What you need:** chapters [10.1](/tutorial/glow/black-body/) (Planck's law) and
[10.2](/tutorial/glow/kirchhoff/) (Kirchhoff's law), and chapters [4.4](/tutorial/response/viscosity/),
[4.5](/tutorial/response/causality/), [4.1](/tutorial/response/oscillator/),
[4.3](/tutorial/response/elastic-bodies/), [4.6](/tutorial/response/fluctuation-dissipation/),
[1.5](/tutorial/newton/five-numbers/), [5.1](/tutorial/waves/wave-equation/) and [8.3](/tutorial/quantum/quanta/).
Chapters [4.2](/tutorial/response/temperature/), [5.4](/tutorial/waves/polarization/),
[5.5](/tutorial/waves/radiance/), [7.8](/tutorial/geometry/wave-energy/) and [8.1](/tutorial/quantum/states/) are
recalled.

Panel (a) of the paper's Figure [](/paper/#fig:materials) draws how six materials resist a shear that is the same
everywhere: a broad shoulder for copper, a spike for silicon, a plateau for glass, bumps for water. Panel (b) draws
their glow. The paper's Table [](/paper/#tab:materials) adds it up: at room temperature copper sends 2.8, silicon 3.4
and diamond 0.25, in units of $10^{-35}\unit{W\,m^{-3}}$, against 21 for the paper's **placeholder friction**, a
constant $10^{-3}\unit{Pa\,s}$ used for comparison.

{{paper fig:materials}}

Section VI concludes that real materials glow at "between one and sixty per cent" of the placeholder, and that "no
material can glow more brightly than a certain limit". Chapter
[10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more)
showed that a body glows by its absorption times Planck's radiance, so we ask about friction. Which motions inside
matter can a gravitational wave at the frequencies of heat shake, how hard does each resist, and why can no material
glow brighter than a fixed bound?

::: plain
A gravitational wave at the frequencies of heat is about a hundred thousand times longer than a sound wave of the same
frequency. So it changes very little from one atom to the next, far less than that sound wave does, and it cannot set
off a single ripple of sound.

It can shake only motions that answer a push that is the same at every atom: the free electrons of a metal, the two
sets of atoms in a crystal such as silicon swinging against each other, every vibration of a glass, and pairs of sound
ripples running in opposite directions.

Each of these motions takes away part of the matter's stiffness when it has time to relax, and causality fixes the
total friction it can make. A material glows most when all of that friction sits where heat glows most strongly. Even
then the glow is the stiffness times gravity's very weak coupling, and no material is much stiffer than diamond, so
every glow is faint. The same limit makes every material almost perfectly transparent.
:::

## A wave shears a body all at once, so it cannot make one phonon

We want the motions inside matter that a gravitational wave can set going, since only they absorb and glow.

**Phonons.** The atoms of a solid move in chapter
[4.3](/tutorial/response/elastic-bodies/#masses-on-springs-move-in-normal-modes)'s normal modes, and the quantum of
one is a **phonon**, as a graviton is the quantum of a mode of a gravitational wave. In a crystal each mode is a wave
of displacement with a wavevector $\vect k$, and its phonon carries the energy $\hbar\omega$ and the momentum
$\hbar\vect k$ (chapter
[8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons),
stated).

In an **acoustic** mode neighbouring atoms move almost together, and the mode is a sound wave: $\omega =
\sym{shear-speed}{c_T}k$ for shear sound and $\omega = \sym{compressional-speed}{c_L}k$ for compressional sound, with
4.3's speeds in metres per second. When the repeating cell of the crystal holds two atoms, as in silicon and diamond,
there are also **optical** modes, in which the two sets of atoms swing against each other. Their frequency stays near a
value $\omega_0$ even as $k \to 0$, because the two sets pull on each other at every wavelength. Chapter
[10.2](/tutorial/glow/kirchhoff/#heat-capacity-says-how-a-bodys-energy-follows-its-temperature)'s **Debye model**
treats every acoustic mode as sound, up to the Debye frequency $\sym{debye-frequency}{\omega_D}$.

**The wavenumbers do not match.** A gravitational wave of angular frequency $\omega$ has the wavenumber $\omega/c$, and
a shear sound of the same frequency has $\omega/c_T$, larger by $c/c_T$. For $c_T = 3000\unit{m\,s^{-1}}$, $c_T/c =
1.0\times10^{-5}$, chapter [5.1](/tutorial/waves/wave-equation/#a-plane-wave-is-a-turning-number-that-travels)'s
number. At 3 THz the gravitational wave is 100 µm long and the sound 1.0 nm, a few atoms. One gravitational
wavelength spans about 400,000 atoms, so from one atom to the next the wave's shear hardly changes: it acts as a
**uniform shear**, the same at every atom.

To make one phonon, the wave must give it both its energy $\hbar\omega$ and its momentum $\hbar\omega/c$. But an
acoustic phonon of wavenumber $\omega/c$ has the frequency $c_T\omega/c$, $10^{-5}$ of $\omega$: the two lines $\omega
= ck$ and $\omega = c_Tk$ cross only at zero (Figure [](#fig:glow-dispersion)). So **a gravitational wave cannot make a
single acoustic phonon inside a body.**

![Look first at the steep line: a gravitational wave of any frequency has almost no wavenumber, so it meets no acoustic
phonon, which would need the same frequency at a far larger wavenumber. It can drive the optical vibration, whose
frequency at zero wavenumber is not zero, and pairs of phonons whose momenta cancel. The branches are schematic; the
ratio of slopes is not to scale.](tut-glow-dispersion){#fig:glow-dispersion}

## Every channel is a stiffness that relaxes, spread over a band

Each motion that answers a uniform shear at zero wavenumber is a **channel** of friction. Chapter
[4.4](/tutorial/response/viscosity/#maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast) named the stiffness
against a sudden shear the unrelaxed rigidity $\sym{unrelaxed-modulus}{\matter\mu_\infty}$, and against a slow one
the relaxed rigidity $\sym{relaxed-modulus}{\matter\mu_0}$, both in pascals. Their difference
$\sym{relaxing-stiffness}{\Delta\matter\mu} = \matter\mu_\infty - \matter\mu_0$ is the stiffness that relaxes, which
the paper calls the **weight** of the channel. Chapter 4.5 proved the paper's sum rule on the friction
$\mathrm{Re}\,\sym{dynamic-viscosity}{\matter\eta}(\omega)$, in pascal seconds:

{{paper eq:friction-sum}}

A weight spread about evenly over a band of width $\Delta\omega$ gives $\mathrm{Re}\,\matter\eta \approx
(\pi/2)\,\Delta\matter\mu/\Delta\omega$, in the paper's words "the stiffness that relaxes there divided by the band over
which it does so". Silica's 37.2 GPa spread below 27 THz, so over $\Delta\omega = 2\pi\times27\unit{THz} =
1.70\times10^{14}\unit{s^{-1}}$, gives $3.4\times10^{-4}\unit{Pa\,s}$, a third of the placeholder. By chapter 10.2 the
channel glows with $\sym{emissivity}{j_\omega} =
\sym{absorption-coefficient}{\alpha}\,\sym{planck-radiance}{B_\omega}$, with chapter 7.8's $\alpha = 16\pi
G\,\mathrm{Re}\,\matter\eta/c^3$. So each channel is two numbers, its weight and the place of its band.

## Free electrons fill a sphere of states, and collisions relax a sheared one

We want the weight and the friction of a metal's **free electrons**, which belong to no single atom; chapter
[4.4](/tutorial/response/viscosity/#a-metals-electrons-relax-like-a-maxwell-liquid-and-their-friction-has-a-ceiling)
stated both. We assume that **the electrons move freely between collisions**.

**Counting states.** Chapter [8.1](/tutorial/quantum/states/#a-particle-on-a-line-is-described-by-a-wave-function)'s
ripple $e^{i(px - Et)/\hbar}$ is a particle of momentum $p$, so an electron in the wave $e^{i\vect k\cdot\vect x}$ has
the momentum $\hbar\vect k$ and the energy $E = \hbar^2k^2/2m$, with $m = 9.11\times10^{-31}\unit{kg}$ the electron's
mass. In a cube of side $D$ whose opposite faces are joined, the waves that fit lie on chapter
[10.1](/tutorial/glow/black-body/#the-number-of-waves-that-fit-in-a-box-grows-as-the-square-of-their-frequency)'s
grid $\vect k = (2\pi/D)(n_1, n_2, n_3)$, one point in each cell of volume $(2\pi/D)^3$. The **exclusion principle**,
stated here, allows at most one electron in each state of motion and spin, and an electron has two states of spin, so
each point holds at most two electrons.

We assume that **the metal is cold compared with the electrons' energies** (checked below), so that they fill the
lowest states: every point inside a sphere whose radius $\sym{fermi-wavenumber}{k_F}$, in $\mathrm{m^{-1}}$, is the
**Fermi wavenumber**. The sphere holds $2\cdot\tfrac43\pi k_F^3\cdot D^3/(2\pi)^3$ electrons. Dividing by $D^3$ gives
the number per cubic metre, $\sym{electron-density}{\matter n} = k_F^3/3\pi^2$, and with $\sym{fermi-energy}{E_F} =
\hbar^2k_F^2/2m$,

$$\boxed{E_F = \frac{\hbar^2\,(3\pi^2\matter n)^{2/3}}{2m}} .$$

The unit of $\hbar^2\matter n^{2/3}/m$ is $\mathrm{J^2\,s^2\,m^{-2}\,kg^{-1}}$, which is a joule. Copper's $\matter n
= 8.47\times10^{28}\unit{m^{-3}}$ gives $k_F = 1.36\times10^{10}\unit{m^{-1}}$, $E_F = 7.03$ eV and the Fermi speed
$\sym{fermi-speed}{v_F} = \hbar k_F/m = 1.57\times10^6\unit{m\,s^{-1}}$, as chapter 4.4 promised. Iron, which the
paper counts with two free electrons per atom ($\matter n = 1.70\times10^{29}\unit{m^{-3}}$), has 11.2 eV. **The
check:** at 293 K, $\kB T = 0.025$ eV is 280 times less than copper's $E_F$, so heat hardly changes the sphere.

**Two averages.** The first is the **density of states** at the Fermi energy, $g(E_F)$, the number of states per cubic
metre and per joule there. Inverted, the boxed result says that the states below an energy $E$ number
$(2mE)^{3/2}/3\pi^2\hbar^3$ per cubic metre, which grows as $E^{3/2}$, so

$$g(E_F) = \frac{3\matter n}{2E_F} .$$

The second is an average over the directions of motion $\hat{\vect n} = (\sin\theta\cos\phi, \sin\theta\sin\phi,
\cos\theta)$, each direction weighted by its share $\sin\theta\,\dd\theta\,\dd\phi/4\pi$ of the sphere:

$$\langle\hat n_x^2\hat n_y^2\rangle = \frac{1}{4\pi}\int_0^{2\pi}\cos^2\phi\,\sin^2\phi\,\dd\phi
\int_0^\pi\sin^5\theta\,\dd\theta = \frac{1}{4\pi}\cdot\frac{\pi}{4}\cdot\frac{16}{15} = \frac{1}{15} .$$

The $\phi$ integral is that of $\tfrac14\sin^22\phi$, and the $\theta$ integral is $\int_{-1}^1(1 - c^2)^2\,\dd c =
2 - \tfrac43 + \tfrac25$, with $c = \cos\theta$.[^sample]

**The weight.** We assume that **the shear is too fast for the electrons to change state**. A shear whose only strain
is $u_{xy} = u_{yx}$ (4.3's, a pure number) stretches the metal by the fraction $u_{ij}\hat n_i\hat n_j = 2u_{xy}\hat
n_x\hat n_y$ along $\hat{\vect n}$. Each electron's wave stretches with the metal, so its wavenumber shrinks by that
fraction and its energy, which goes as $k^2$, falls by twice it. At the Fermi surface

$$\delta E = -4E_F\,\hat n_x\hat n_y\,u_{xy} .$$

Half the Fermi surface rises in energy and half falls, so the occupied states are no longer the lowest (Figure
[](#fig:glow-fermi)).

![Look first at the middle panel: a sudden shear raises the energy of electrons moving along one diagonal and lowers it
along the other, so the occupied states are no longer the lowest. Collisions move electrons from the raised states to
the lowered ones in a time $\tau$, and the energy they release is the stiffness that relaxes. The distortion is
exaggerated.](tut-glow-fermi){#fig:glow-fermi}

Collisions then move electrons from the raised states above $E_F$ into the lowered states below it, which releases
$\tfrac12g(E_F)\langle\delta E^2\rangle$ per cubic metre (the box below). Before any collision the electrons resist
the shear like a spring of stiffness $\Delta\matter\mu$. Collisions take that resistance away, so the energy they
release is the energy that spring held. A shear held by a stiffness $\matter\mu$ stores $\matter\mu\,u_{ij}u_{ij} =
2\matter\mu\,u_{xy}^2$ per cubic metre (chapter
[4.3](/tutorial/response/elastic-bodies/#a-strain-stores-energy-half-the-stress-times-the-strain)). So
$2\Delta\matter\mu\,u_{xy}^2 = \tfrac12\cdot(3\matter n/2E_F)\cdot16E_F^2u_{xy}^2/15$, and

$$\boxed{\Delta\matter\mu = \tfrac25\,\matter nE_F = \tfrac15\,\matter nmv_F^2} ,$$

the paper's weight: 38.2 GPa for copper (4.4's 38), 122 GPa for iron. A relaxed electron gas keeps no shape, so
$\matter\mu_0 = 0$ and $\matter\mu_\infty = \Delta\matter\mu$.

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
with $\sym{relaxation-time}{\tau}$ 4.4's collision time. After a sudden shear the stress then dies away as
$e^{-t/\tau}$, which is Maxwell's model with $\matter\eta_0 = \matter\mu_\infty\tau$, so by 4.4

$$\mathrm{Re}\,\matter\eta = \frac{\tfrac15\,\matter nmv_F^2\,\tau}{1 + \omega^2\tau^2} ,$$

the paper's form. Copper's $\tau = 2.5\times10^{-14}$ s, which follows from how well it conducts electricity (reading
chapter [R10](/tutorial/glow/reading-section-vi/#free-electrons-give-copper-its-friction-and-iron-a-ceiling)), gives
$\omega\tau = 2.7$ at 10.1's energy peak and 1.5 at the count's, the paper's "about one". **A limit:** as $\tau \to
\infty$ the friction at any $\omega > 0$ falls as $1/\tau$ to zero. A perfect metal answers a fast shear as a solid, and
its whole weight moves to zero frequency.

::: gap
This sketch skips the Boltzmann equation, which follows the electrons' occupation of each state as the shear and the
collisions change it. With one collision time for every state its solution is the Maxwell form above.
:::

## A crystal with two atoms in its cell rings at its Raman line when sheared

We want the weight of the optical vibration that a uniform shear drives in silicon and diamond. Their crystal is two
interleaved copies of one lattice. A shear moves the copies as a whole, but the bonds then pull one copy against the
other, so one shifts against the other in proportion to the shear (Figure [](#fig:glow-two-atoms)). This is **internal
strain**, and **Kleinman's parameter** $\sym{kleinman-parameter}{\zeta_K}$, a pure number (0.54 for silicon), measures
its size.[^zeta] The shift is section 1's optical vibration at zero wavenumber.

![Look first at the small arrows: when the lattice is sheared, one copy of atoms does not follow it exactly but shifts
against the other, so a uniform shear drives the vibration in which the two copies swing against each other. The
picture is a flat sketch of a three-dimensional crystal, and the shift is
exaggerated.](tut-glow-two-atoms){#fig:glow-two-atoms}

**The line.** The vibration is chapter 4.1's oscillator at $\sym{natural-frequency}{\omega_0}$. **Raman scattering**
shifts the frequency of some of the light a crystal scatters by $\omega_0$, so the vibration is called a **Raman
line**. Its frequency is quoted as a **spectroscopic wavenumber**
$\sym{spectroscopic-wavenumber}{\tilde\nu}$, the number of wavelengths per centimetre of light of that frequency, in
$\mathrm{cm^{-1}}$, with $\omega_0 = 2\pi c\tilde\nu$. Silicon's 520 cm⁻¹, or $5.2\times10^4\unit{m^{-1}}$, gives
$\omega_0 = 9.79\times10^{13}\unit{s^{-1}}$, or 15.59 THz, at $\sym{planck-ratio}{x} = \hbar\omega_0/\kB T = 2.55$ at
293 K.

**Its weight**, stated without proof from Kleinman's work, is the stiffness the shear loses when the copies may
shift:

$$\Delta\matter\mu_{\rm line} = \frac{M\omega_0^2\zeta_K^2}{8a} .$$

Here $\sym{atom-mass}{M}$ is the mass of one atom (the paper's letter, not a body's mass) and
$\sym{lattice-constant}{a}$ the side of the cube that repeats, in metres (not 8.3's lowering operator). The unit is
$\mathrm{kg\,s^{-2}\,m^{-1}}$, a pascal. With $M = 4.66\times10^{-26}$ kg and $a = 0.5431$ nm it is 30.0 GPa, the
paper's 30.[^kleinman]

**Three of five shears.** In a cubic crystal 1.5's [five
shears](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length) fall into
two sets: $b^4$ and $b^5$ stretch along the cube's own axes, on the diagonal, and $b^1$, $b^2$, $b^3$ are the shears
$xy$, $yz$ and $zx$, off the diagonal. The turns that leave the crystal unchanged show that **a stretch along a cube
axis moves both copies alike**, while each shear off the diagonal shifts one copy against the other along the third
axis (the box below). So only the three shears off the diagonal drive the line, as chapter 5.4's stretch problem took
on trust (Figure [](#fig:glow-shears)). A wave carries two of the five at a time, its polarizations, mixed according to
its direction.

![Look first at the bottom row: each of the three shears off the cube's diagonal shifts one copy of atoms against the
other along the third axis, while the two stretches along the cube's axes shift nothing. So only three of a wave's five
shears drive the Raman line. The rings are schematic.](tut-glow-shears){#fig:glow-shears}

Averaged over every direction and both polarizations, the three shears off the diagonal carry $\tfrac35$ of a wave's
drive (the box), so the line's weight averaged over directions is $\tfrac35\times30.0 = 18.0$ GPa, the paper's 18.

::: derivation
### Which shears drive the line, and their share

**The symmetry.** Let $\vect s$ be the shift of one copy against the other. A half turn about the $x$ axis through an
atom leaves the crystal unchanged (stated) and sends $y \to -y$, $z \to -z$. It keeps a stretch $u_{xx}$ and reverses
$s_y$ and $s_z$, so $u_{xx}$ can drive only $s_x$. A half turn about the $y$ axis keeps $u_{xx}$ but reverses $s_x$,
so no stretch drives a shift. The shear $u_{yz}$ is kept by the first turn and reversed by the second, as $s_x$ is, so
it drives $s_x$ alone; likewise $u_{zx}$ drives $s_y$ and $u_{xy}$ drives $s_z$.

**The share.** For a wave along $\hat{\vect n}$, with 5.4's unit vectors $\vect e_1$ and $\vect e_2$ across it, the
two polarization tables are $e^+ = \vect e_1\vect e_1^{\mathsf T} - \vect e_2\vect e_2^{\mathsf T}$ and $e^\times =
\vect e_1\vect e_2^{\mathsf T} + \vect e_2\vect e_1^{\mathsf T}$, each with $e_{ij}e_{ij} = 2$. With $p = e_{1z}^2$
and $q = e_{2z}^2$, the two together put on the entry $zz$

$$(e^+_{zz})^2 + (e^\times_{zz})^2 = (p - q)^2 + 4pq = (p + q)^2 = (1 - \hat n_z^2)^2 ,$$

because the three perpendicular unit vectors $\vect e_1$, $\vect e_2$ and $\hat{\vect n}$ have $z$ components whose
squares add to 1. Of the two tables' total of 4, the diagonal holds $\sum_i(1 - \hat n_i^2)^2$. Over directions,
$\langle\hat n_z^2\rangle = \tfrac13$ and $\langle\hat n_z^4\rangle = \tfrac12\int_0^\pi\cos^4\theta\,\sin\theta\,
\dd\theta = \tfrac15$, so $\langle(1 - \hat n_z^2)^2\rangle = 1 - \tfrac23 + \tfrac15 = \tfrac{8}{15}$. The diagonal
then holds $3\cdot\tfrac{8}{15}/4 = \tfrac25$ on average, and the shears off it $\tfrac35$. **A check:** along a cube
edge the shears off the diagonal hold $1 - \tfrac14(1 + 1) = \tfrac12$, and along a body diagonal $1 -
\tfrac14\cdot3\cdot\tfrac49 = \tfrac23$, chapter 5.4's values.
:::

**The peak.** Chapter
[4.1](/tutorial/response/oscillator/#only-the-imaginary-part-of-the-response-takes-energy-from-the-push)'s line of
width $\sym{damping-rate}{\Gamma} = \omega_0/\sym{quality-factor}{Q}$, here $Q = 173$, has the friction
$\Delta\matter\mu\,\omega_0^2\Gamma/[(\omega_0^2 - \omega^2)^2 + \Gamma^2\omega^2]$. Near $\omega_0$ it is a peak of
height $\Delta\matter\mu/\Gamma$ and half-width $\Gamma/2$, whose area $\pi(\Delta\matter\mu/\Gamma)(\Gamma/2) =
\pi\Delta\matter\mu/2$ is 4.5's sum. The height is $18.0\unit{GPa}/5.65\times10^{11}\unit{s^{-1}} =
0.032\unit{Pa\,s}$: "thirty times the placeholder".

**Glass and water**, stated from simulations. A glass has no regular arrangement, so a uniform shear drives every
vibration; in the paper's silica the weight is about the glass's shear modulus, 37.2 GPa, below 27 THz. In water the
hydrogen bonds carry it. The paper's model of water gives $2.4\times10^{-4}$ to $2.6\times10^{-4}\unit{Pa\,s}$ near
8 THz, 0.35 to 0.38 of its steady viscosity, $6.9\times10^{-4}\unit{Pa\,s}$: the paper's "a third".

## Even a perfect crystal glows through pairs of phonons

A crystal with one atom in its cell and no free electrons has neither channel. It still glows, because two phonons of
wavevectors $\vect k$ and $-\vect k$ have no total momentum, so a uniform shear can make both at once, at any
frequency up to $2\omega_D$.

**The stress of moving atoms**, a sketch. The stress of a crystal added over its volume, the momentum the atoms carry
across a plane plus the pull of their springs, is the paper's $\tfrac12\,\dd^2/\dd t^2\sum m u_xu_y$ over the atoms,
with $m$ an atom's mass and $\vect u$ its displacement (stated). A product of two displacements swings at sums and
differences of two frequencies.

**Its weight in a model.** We assume an **Einstein solid**, in which every atom sits on its own spring of one angular
frequency $\omega_E$, and that **the motion is classical**, $\kB T \gg \hbar\omega_E$.

*The weight is the stress's jiggle.* Chapter
[10.2](/tutorial/glow/kirchhoff/#the-same-law-follows-from-the-random-stress-inside-warm-matter)'s spectrum of the
stress $\matter T_{xy}$ is $2\kB T\,\mathrm{Re}\,\matter\eta$ per cubic metre, so the stress averaged over a volume
$V$, $\sigma_{xy}$, has the spectrum $2\kB T\,\mathrm{Re}\,\matter\eta/V$. Its mean square is the integral over
$\dd\omega/2\pi$, twice the positive frequencies
([chapter 4.6](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency)),
and 4.5's sum gives

$$\langle\sigma_{xy}^2\rangle = \frac{2\kB T}{\pi V}\int_0^\infty\mathrm{Re}\,\matter\eta\,\dd\omega =
\frac{\kB T\,\Delta\matter\mu}{V} .$$

*One atom.* With $\ddot{\vect u} = -\omega_E^2\vect u$ and the velocity $\vect v = \dot{\vect u}$,
$\dd^2/\dd t^2(\tfrac12mu_xu_y) = m(v_xv_y - \omega_E^2u_xu_y)$. By chapter
[4.2](/tutorial/response/temperature/#in-phase-space-the-weight-splits-and-the-velocities-are-independent-gaussians)
the four numbers $v_x$, $v_y$, $u_x$, $u_y$ are independent Gaussians of mean zero, with $\langle v_x^2\rangle = \kB
T/m$ and $\langle u_x^2\rangle = \kB T/m\omega_E^2$. The cross term averages to zero, so

$$m^2\langle(v_xv_y - \omega_E^2u_xu_y)^2\rangle = m^2\langle v_x^2\rangle\langle v_y^2\rangle + m^2\omega_E^4\langle
u_x^2\rangle\langle u_y^2\rangle = 2(\kB T)^2 .$$

*All the atoms.* $N$ independent atoms add their squares, so $V^2\langle\sigma_{xy}^2\rangle = 2N(\kB T)^2$. With
$\sym{atom-density}{\matter n} = N/V$, here the number of atoms per cubic metre,

$$\boxed{\Delta\matter\mu_{\rm pairs} = 2\matter n\kB T} ,$$

the paper's "classical weight $2nk_BT$", all of it at $2\omega_E$.[^einstein] Its unit, joules per cubic metre, is a
pascal. At 293 K it is 0.40 GPa for silicon, 0.69 for copper and 1.43 for diamond, the paper's "about a gigapascal",
some fifty times less than copper's electrons or silicon's line.

**A limit.** Classically the weight vanishes as $T \to 0$, because nothing then moves. With quantum occupations it
does not: a shear can make a pair even in two empty modes, as 10.2's spontaneous emission needs no quanta present, so
the net rate goes as $1 + \bar n_1 + \bar n_2$ (stated). Diamond, whose Debye temperature is 2200 K, holds only 0.16
of its classical heat capacity at 293 K (chapter
[10.2](/tutorial/glow/kirchhoff/#heat-capacity-says-how-a-bodys-energy-follows-its-temperature)), yet in the paper's
model its pairs hold 4.16 GPa, 2.9 times $2\matter n\kB T$, and still 4.10 GPa at 1 K. That is about its line's
4.13 GPa, and the pairs make "an eighth of diamond's glow" (stated). **Anharmonicity**, the departure of real bonds
from perfect springs, changes the weight by a factor of order one (stated).[^akhiezer]

## Each material of the table is a weight at a place

The paper's Table [](/paper/#tab:materials) gives, at 293 K, each material's effective friction
$\sym{effective-friction}{\matter\eta_{\rm eff}}$ (4.4's constant friction with the same power), its $P/V = 4\pi\int
j_\omega\,\dd\omega$ and the mean energy $\bar E$ of its gravitons. For a constant friction,
$P/V = 4\pi\alpha\,\sigma_{\rm SB}T^4/\pi$ by 10.1, which is $2.08\times10^{-35}\unit{W\,m^{-3}}$ for each
$10^{-4}\unit{Pa\,s}$ at 293 K, so the second column is 2.08 times the first. With the models above:
- **Copper.** The electrons alone give $\matter\eta_{\rm eff} = 1.28\times10^{-4}\unit{Pa\,s}$, $P/V = 2.67$ and
  $\bar E = 1.43\,\kB T$, against the table's 1.3, 2.8 and 1.4; the pairs add the rest.
- **Iron.** The paper counts two free electrons per atom, but iron's real conduction band is not a free gas, and its
  collision time is not known. So the paper gives 4.4's ceiling, $\Delta\matter\mu/2\omega$ with 122 GPa:
  5.9 and 12.2. A friction that falls as $1/\omega$ has, by 10.1's Bose integrals, $\bar E/\kB T = 2\zeta(3)/(\pi^2/6)
  = 1.46$ (the table's $\le 6$, $\le 12$, 1.5).
- **Silicon.** Its line alone gives 1.59, 3.31 and $2.55\,\kB T$ (1.6, 3.4, 2.6).
- **Diamond.** Its line, at 1333 cm⁻¹ or 40.0 THz, lies at $x = 6.546$ in the Wien tail, so it is faint and blue: 0.12,
  0.25, $6.4\,\kB T$ (stated).
- **Silica.** A flat band of 37.2 GPa below 27 THz gives 2.31, 4.80 and $2.14\,\kB T$ (2.3, 4.8, 2.1).
- **Water**, from the simulation: 0.54, 1.1, $1.7\,\kB T$ (stated).

So real materials glow at 1.2% (diamond) to 59% (iron's ceiling) of the placeholder's power. The figure's shaded
band is where $B_\omega$ exceeds a tenth of its peak, $0.420 < x < 8.30$, or 2.57 to 50.7 THz at 293 K. The small
steps are where pair bands end, at $2\omega_D$: 14.3 THz for copper, with its Debye temperature of 343 K.

**A metal heated.** Iron's ceiling, $\Delta\matter\mu/2\omega$, does not depend on the collision time, so its power
$\propto\int\omega^2\bar n\,\dd\omega$ grows as $T^3$ and its count as $T^2$. The hot iron of the paper's closed
furnace, Figure [](/paper/#fig:closed-furnace), sends $(1500/293)^2 = 26.2$ times as many gravitons as the cold, not
the 134 of a constant friction (10.1).[^twentyfive] A Drude metal does the same far above its Debye temperature, where
its collision rate grows as $T$ (stated); copper's Debye temperature (343 K) and iron's (470 K) are above 293 K.

## No material can glow brighter than its weight allows

We want the most that a weight $\Delta\matter\mu$ can glow at a temperature $T$: the paper's bound on every glow, which
chapter [4.5](/tutorial/response/causality/#causality-fixes-a-materials-total-friction) anticipated.

**The glow as an integral.** Kirchhoff's law with 7.8's $\alpha$ and 10.1's $B_\omega$ gives

$$\frac PV = 4\pi\int_0^\infty\alpha B_\omega\,\dd\omega = \frac{16G\hbar}{\pi c^5}\int_0^\infty\mathrm{Re}\,
\matter\eta\;\omega^3\bar n\,\dd\omega ,$$

since $4\pi\cdot16\pi/4\pi^3 = 16/\pi$, with 10.1's occupation $\bar n = 1/(e^x - 1)$.

**A positive weight of fixed total.** We assume only that **$\mathrm{Re}\,\matter\eta \ge 0$ at every frequency**,
since friction takes energy from a wave (4.1), and that its integral is $\pi\Delta\matter\mu/2$ (4.5). For a positive
function $w$ and any function $F$, $\int wF\,\dd\omega \le (\max F)\int w\,\dd\omega$, with equality only when all of
$w$ sits where $F$ is largest. Here $F = \omega^3\bar n = (\kB T/\hbar)^3x^3/(e^x - 1)$, whose largest value is
$(\kB T/\hbar)^3\times1.4214$ at $x = 2.821$ (10.1). The count divides each band by $\hbar\omega$, and $x^2/(e^x - 1)$
is largest, 0.6476, at $x = 1.594$. The constants combine as $(16/\pi)(\pi/2) = 8$, the factor 8 of chapter
[10.1](/tutorial/glow/black-body/#the-energy-of-the-glow-peaks-at-2.82-thermal-energies-and-the-count-at-1.59)'s
11.37 and 5.18. So, with $\sym{graviton-rate}{\dot N}$ the number of gravitons sent each second in all directions,

$$\boxed{\frac PV \le 8\times1.4214\,\frac{G\,\Delta\matter\mu\,(\kB T)^3}{\hbar^2c^5}} , \qquad
\boxed{\frac{\dot N}V \le 8\times0.6476\,\frac{G\,\Delta\matter\mu\,(\kB T)^2}{\hbar^2c^5}} ,$$

which is the paper's

{{paper eq:glow-bound}}

The unit of $G\Delta\matter\mu(\kB T)^3/\hbar^2c^5$ is $\mathrm{W\,m^{-3}}$.[^units]

**Equality** holds when all the weight is a narrow line at $x = 2.821$, 17.2 THz at 293 K, or at $x = 1.594$, 9.7 THz,
for the count (Figure [](#fig:glow-bound)). **Near equality:** silicon's line at $x = 2.55$ reaches 98.5% of its own
weight's bound, the paper's 98%. **Far from it:** diamond's line at $x = 6.55$ reaches 28%; the paper's 16% adds the
pairs' 4.16 GPa to the weight, and they glow little for it (stated). Silica's flat band gives 69.2%, the paper's 69%;
copper's electrons alone 37.5%, the paper's 39% with the pairs; water 40% (stated).[^shares]

**Numbers.** At room temperature 30 GPa radiates at most $5.6\times10^{-35}\unit{W\,m^{-3}}$. The hot iron of the
closed furnace, 122 GPa at 1500 K, can glow at most $3.1\times10^{-32}\unit{W\,m^{-3}}$. To glow as brightly as the
placeholder, a material would need 112 GPa at 293 K (the paper's 110) and 2.09 TPa at 5500 K (2.1); to send as many
gravitons at 5500 K, 1.70 TPa (1.7). The 2.09 TPa is about four times the shear stiffness of diamond, 536 GPa, so "no
material has the placeholder's friction at high temperature".

**Why matter barely glows.** The bound is 11.4 times $G/c^5 = 2.8\times10^{-53}\unit{s^3\,kg^{-1}\,m^{-2}}$ times a
stiffness times $(\kB T)^3/\hbar^2$, and no matter's stiffness goes much past a terapascal. Even diamond's whole shear
stiffness could glow at most $1.0\times10^{-33}\unit{W\,m^{-3}}$ at 293 K.

::: try {#glow-bound}
Two panels share a frequency axis. The top one draws a material's friction $\mathrm{Re}\,\matter\eta$ on ordinary
axes, so that its area is $\pi\Delta\matter\mu/2$, over a faint curve of $x^3/(e^x - 1)$; the bottom one draws its
glow. Buttons choose the paper's materials, the placeholder or Your line, a line of your own whose centre, width and
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

**Absorption.** The same weight bounds what a body can absorb. A path of length $L$ through matter has chapter 5.5's
optical depth $\sym{optical-depth}{\tau}(\omega) = \alpha L$ (here $\tau$ is the optical depth, not the collision
time). Integrating over frequency with 4.5's sum,

$$\boxed{\int_0^\infty\tau\,\dd\omega = \frac{16\pi GL}{c^3}\cdot\frac{\pi\Delta\matter\mu}{2} = \frac{8\pi^2GL\,
\Delta\matter\mu}{c^3}}$$

in $\mathrm{s^{-1}}$. For a metre of 30 GPa it is $5.9\times10^{-24}\unit{s^{-1}}$, the paper's
$6\times10^{-24}\unit{s^{-1}}$. A band in which matter were opaque, with $\tau \ge 1$ throughout, could be no wider than
that: chapter 5.5's "across any band of useful width, every material is far from opaque". Spread over a band of the
order of $\kB T/\hbar = 3.8\times10^{13}\unit{s^{-1}}$ at 293 K, the metre stops $1.5\times10^{-37}$ of the gravitons
that cross it. A cubic metre of detector crossed by one graviton a second would wait $2.1\times10^{29}$ years for its
first count, $1.5\times10^{19}$ ages of the universe, as chapter 0.3 said. Diamond's whole shear stiffness, 18 times
more, would not change this.

## Ordinary bodies glow through their volume, not their surface

We want to know whether a body glows through its volume, as the paper assumes, or its surface.

**The surface**, stated. A body without friction cannot absorb inside it (section 1), but at its surface the stiffness
jumps, the momenta need not match, and a wave launches sound [@Dyson1969]. For a sphere of radius $R$ and
density $\sym{density}{\matter\rho}$ below its Debye temperature, Dehnen, Romero and Schäfer found the glow
[@DehnenRomeroSchaefer1984]

{{paper eq:surface-glow}}

It is what Kirchhoff's law gives for a surface that absorbs the paper's fraction $A(\omega) = \pi^2(1 +
3c_T/2c_L)\,G\matter\rho c_T^3/c^3\omega^2$ of a wave, taken to be the same at every angle (the box below).

**The volume.** Inside, the friction of sound of quality factor $Q$ is chapter
[4.4](/tutorial/response/viscosity/#a-ringing-solids-friction-is-its-quality-factor)'s $\mathrm{Re}\,\matter\eta =
\matter\rho c_T^2/\omega Q$, which falls as $1/\omega$, so the volume's glow grows as $T^3$ and the surface's as $T^2$.
The ratio of the volume's power $P_V$ to the surface's $P_S$, both in watts, is the paper's
[](/paper/#eq:volume-surface):

$$\boxed{\frac{\sym{volume-power}{P_V}}{\sym{surface-power}{P_S}} = \frac{256\,\zeta(3)}{\pi^3(1 + 3c_T/2c_L)}\,
\frac{R}{\ell_s}} , \qquad \sym{phonon-path}{\ell_s} = \frac{Q\hbar c_T}{\kB T} ,$$

with $\ell_s$ the distance a thermal phonon, of angular frequency about $\kB T/\hbar$, travels at $c_T$ in its damping
time $Q/\omega$.

::: derivation
### Kirchhoff's check and the volume's glow

**The surface.** Treat whatever absorbs at the surface as a thin layer. Along a ray leaving it, 10.2's law $j_\omega =
\alpha B_\omega$ adds the radiance $\int j_\omega\,\dd s = B_\omega\int\alpha\,\dd s = AB_\omega$, since the small
$\int\alpha\,\dd s$ is the fraction $A$ that the layer takes from a ray. If $A$ is the same at every angle, 10.1's half
sky, $\int\cos\theta\,\dd\Omega = \pi$, gives $\pi\int AB_\omega\,\dd\omega$ per square metre. With $AB_\omega \propto
\omega/(e^x - 1)$ and 10.1's $\int x\,\dd x/(e^x - 1) = \pi^2/6$,

$$\pi\cdot\pi^2\Bigl(1 + \frac{3c_T}{2c_L}\Bigr)\frac{G\matter\rho c_T^3}{c^3}\cdot\frac{\hbar}{4\pi^3c^2}
\Bigl(\frac{\kB T}{\hbar}\Bigr)^2\frac{\pi^2}{6} = \frac{\pi^2}{24}\Bigl(1 + \frac{3c_T}{2c_L}\Bigr)
\frac{G\matter\rho c_T^3(\kB T)^2}{\hbar c^5} ,$$

the paper's $P_S/4\pi R^2$ exactly.

**The volume.** In the bound's integral $\omega^3/\omega = \omega^2$, and 10.1's $\int x^2\,\dd x/(e^x - 1) =
2\zeta(3)$ gives

$$P_V = V\,\frac{16G\hbar}{\pi c^5}\,\frac{\matter\rho c_T^2}{Q}\Bigl(\frac{\kB T}{\hbar}\Bigr)^3 2\zeta(3) =
V\,\frac{32\zeta(3)\,G\matter\rho c_T^2(\kB T)^3}{\pi c^5Q\hbar^2} .$$

Dividing by $P_S$, with $V = \tfrac43\pi R^3$, gives the boxed ratio.
:::

**Numbers.** For the paper's steel ball, with $c_T = 3200$ and $c_L = 5900\unit{m\,s^{-1}}$ and $\matter\rho =
7800\unit{kg\,m^{-3}}$, the prefactor is 5.47 (the paper's 5.5), and at $Q = 10$, $\ell_s = 0.83$ nm. A ball of radius
10 cm glows $1.0\times10^{-46}$ W from its surface and $6.6\times10^8$ times more from its volume.[^steels] With the
table's volume glows, the two meet at $R = 3(P_S/4\pi R^2)/(P/V)$: 28 nm for diamond, the faintest (Figure
[](#fig:glow-surface)).[^thirty] **A limit:** the surface wins only once $\ell_s$ passes about $5.5R$, so a pure
crystal cooled until its phonons cross it several times glows at its surface, as Dehnen, Romero and Schäfer found.

![Look first at the dots on the right: even diamond, the faintest of the paper's materials, glows more through its
volume than through its surface once it is larger than 28 nm, and a steel ball of 10 cm glows hundreds of millions of
times more through its volume. The ripples on the left are schematic; the lines are exact for the paper's
formulas.](tut-glow-surface){#fig:glow-surface}

::: check
### Q

Why can a gravitational wave not make one sound phonon in a metre of steel?

### A

Its wavenumber is $10^{-5}$ of the sound's, so it cannot supply the momentum.

### Q

Why does silicon glow at 98% of its bound and diamond's line at 28%?

### A

Silicon's line sits at $x = 2.55$, near the peak at 2.82; diamond's sits at 6.55, in the Wien tail.

### Q

A material has 30 GPa of stiffness that relaxes. What is the most it can glow at 293 K?

### A

$11.37\,G\Delta\matter\mu(\kB T)^3/\hbar^2c^5 = 5.6\times10^{-35}\unit{W\,m^{-3}}$.

### Q

Why do ordinary bodies glow through their volume?

### A

Their thermal phonons are damped within about a nanometre, so $R/\ell_s$ is enormous.
:::

**The idea to keep: a gravitational wave shears matter uniformly, so it cannot make one phonon. It shakes only free
electrons, the optical vibration of a crystal, the disorder of a glass and pairs of phonons, and causality gives each a
fixed budget of friction, its stiffness that relaxes. Even with the whole budget at the peak of Planck's spectrum, no
material glows brighter than $11.4\,G\Delta\matter\mu(\kB T)^3/\hbar^2c^5$ per volume. Matter barely glows because
this is $G/c^5$ times a stiffness, and no matter's stiffness goes much past a terapascal.**

::: problems
### Practice

Aluminium has three free electrons per atom, $\matter n = 1.81\times10^{29}\unit{m^{-3}}$ (a standard value, not the
paper's). Find its Fermi energy, Fermi speed and the weight $\tfrac25\matter nE_F$ of its electrons' friction.

::: solution
$E_F = \hbar^2(3\pi^2\matter n)^{2/3}/2m = 1.87\times10^{-18}$ J, or 11.7 eV; $v_F = \sqrt{2E_F/m} =
2.03\times10^6\unit{m\,s^{-1}}$; and $\tfrac25\matter nE_F = 135$ GPa.
:::

### Stretch

With chapters 4.1 and 10.1: diamond's line, averaged over directions, has the weight 4.13 GPa at 1333 cm⁻¹ and the
width $\Gamma = 2.94\times10^{11}\unit{s^{-1}}$. Find its $Q$ and its peak friction. Is the line narrow beside
$x^3/(e^x - 1)$? What fraction of its bound does it reach at 293 K, and at what temperature would it reach the whole
bound?

::: solution
Its $\omega_0 = 2\pi c\tilde\nu = 2.51\times10^{14}\unit{s^{-1}}$, so $Q = \omega_0/\Gamma = 854$ and the peak is
$\Delta\matter\mu/\Gamma = 0.014\unit{Pa\,s}$. The line is $1/854$ of its frequency wide, while $x^3/(e^x - 1)$
changes over $\Delta x \approx 1$, so its whole weight sits at $x = 6.546$, and its fraction is $[x^3/(e^x -
1)]/1.4214 = 0.28$. It reaches the bound at $x = 2.821$, at $293\unit{K}\times6.546/2.821 = 680\unit{K}$.
:::

### The paper

Derive the paper's [](/paper/#eq:glow-bound) and its integrated optical depth $8\pi^2GL\,\Delta\matter\mu/c^3$, and
reproduce the paper's 110 GPa, 2.1 TPa and 1.7 TPa.

::: solution
The derivation is that of the section [on the bound](#no-material-can-glow-brighter-than-its-weight-allows). The
placeholder glows $4\alpha\sigma_{\rm SB}T^4$ with $\alpha = 16\pi G\times 10^{-3}\unit{Pa\,s}/c^3$; setting this
equal to the bound gives $\Delta\matter\mu = 4\alpha\sigma_{\rm SB}T^4\hbar^2c^5/(11.37\,G(\kB T)^3)$: 0.112 TPa at
293 K and 2.09 TPa at 5500 K. Its count is $(16G\eta/\pi c^5)(\kB T/\hbar)^3\,2\zeta(3)$, and setting it equal to the
second bound gives 1.70 TPa at 5500 K.
:::
:::

::: paper
- Section VI's [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat): the
  $10^{-5}$, the electrons, the driven vibrations, the pairs and a hot metal's $T^2$; Table [](/paper/#tab:materials)
  and Figure [](/paper/#fig:materials).
- Section VI's [*A bound on the glow*](/paper/#par:a-bound-on-the-glow): the paper's [](/paper/#eq:glow-bound), its
  fractions, the integrated optical depth, and the 110 GPa, 2.1 TPa and 1.7 TPa.
- Section VI's [*Volume and surface emission*](/paper/#par:volume-and-surface-emission): the paper's
  [](/paper/#eq:surface-glow) and [](/paper/#eq:volume-surface), and the steel ball.
- [Section IX](/paper/#sec:first-image): the Earth's shells at their bounds, the core's electrons and the
  $2\times10^{29}$ years (chapter R10b).
- [Section VII](/paper/#sec:no-lens): optical depths from $\mathrm{Re}\,\eta = \rho c_T^2/\omega Q$ (chapter R11).
:::

::: deeper
- The GR course's [fluid shear lab](https://neovand.github.io/general-relativity/chapter-11.html#fluid-shear-lab)
  shows the shear stress that every channel here relaxes.
- N. W. Ashcroft and N. D. Mermin, *Solid State Physics* (Saunders, 1976), chapters 1 and 2 (free electrons) and 22
  and 23 (phonons).
- F. J. Dyson, "Seismic response of the Earth to a gravitational wave in the 1-Hz band", *Astrophysical Journal* 156
  (1969) 529: why a body without friction absorbs at its surface.
- L. Kleinman, "Deformation potentials in silicon. I. Uniaxial strain", *Physical Review* 128 (1962) 2614: the
  internal strain of the Raman line.
:::

[^sample]: Two million random directions give $\langle\hat n_x^2\hat n_y^2\rangle = 0.0666$, against $1/15 = 0.0667$.

[^zeta]: Kleinman's $\zeta_K$ always carries its subscript; it is not 10.1's $\zeta(3)$.

[^kleinman]: A check: the shift $s_x = a\zeta_Ku_{yz}/2$, held back by a spring $(M/2)\omega_0^2$ in each of the
    $4/a^3$ pairs of atoms per cubic metre, costs $\tfrac12(M/2)\omega_0^2(a\zeta_Ku_{yz}/2)^2\cdot4/a^3 =
    2\Delta\matter\mu\,u_{yz}^2$ with exactly this $\Delta\matter\mu$.

[^einstein]: Two million samples give $2.000(\kB T)^2$. The product $u_xu_y$ of one atom swings at $2\omega_E$ and
    also has a steady part, which the second derivative removes.

[^akhiezer]: The paper also names Akhiezer's damping, the relaxation of the thermal phonons themselves, whose tail at
    the frequencies of heat lies far below the pair band (stated).

[^twentyfive]: The paper's "nearer 25" for the hot iron is this 26.2.

[^units]: $G\Delta\matter\mu$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}\cdot kg\,m^{-1}\,s^{-2}}$, and $(\kB T)^3/\hbar^2c^5$
    is $\mathrm{J^3/(J^2\,s^2\,m^5\,s^{-5})} = \mathrm{J\,m^{-5}\,s^3}$; their product is $\mathrm{J\,m^{-3}\,s^{-1}}$.

[^steels]: The paper's $7\times10^8$ rounds this $6.6\times10^8$; its other steel, with $c_T = 3000\unit{m\,s^{-1}}$,
    gives $8.2\times10^{-47}$ W and $7.2\times10^8$.

[^thirty]: The paper's 30 nm is diamond's crossing, 28 nm with the sound speeds of its own elastic constants, $c_T =
    12.35$ and $c_L = 18.15\unit{km\,s^{-1}}$. Every other material of its table crosses below 1 nm.

[^shares]: The paper's 39 and 40 per cent for copper and water integrate the weight only up to $x = 60$, which drops
    1.1% of copper's tail and 3.2% of water's; with the whole weight they are 38.2% and 39.1%.
