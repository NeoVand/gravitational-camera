---
id: R10
title: 'Reading Section VI'
question: 'With chapters 10.1 to 10.3 behind us, can we derive or check every claim of Section VI, from the wavelength of heat to the glow of a steel ball, and does every number come out as the paper says?'
part: '10'
requires: ['4.4', '4.5', '5.4', '5.5', '6.4', '7.8', '10.1', '10.2', '10.3']
paper: [sec:thermal, eq:damped, eq:alpha, eq:kirchhoff, eq:maxwell, eq:friction-sum, eq:glow-bound, eq:surface-glow, eq:volume-surface, fig:line-integral, fig:closed-furnace, tab:materials, fig:materials, eq:column, eq:jN-friction]
figures: [fig:line-integral, fig:closed-furnace, fig:materials]
live: [scene-closed-furnace, planck-spectrum]
---

The paper's [Section VI](/paper/#sec:thermal) claims that every warm body glows in gravitational waves, "in proportion
to its internal friction and to its temperature", that nothing absorbs the glow, and that no material can glow brighter
than a fixed limit. With chapters [10.1](/tutorial/glow/black-body/), [10.2](/tutorial/glow/kirchhoff/) and
[10.3](/tutorial/glow/why-matter-barely-glows/) behind us, can we derive or check every claim of Section VI, and does
every number come out as the paper says?

This chapter reads the section in order (Figure [](#fig:read-vi-map)). As in
[R9](/tutorial/one-point/reading-section-viii/), each claim gets one mark: *checked here* (a number recomputed from a
result derived earlier), *read now, derived in chapter N*, or *stated in the paper*; one short step, copper's
collision time, is *derived here*.

![Look first at the solid boxes: every paragraph of Section VI is derived in Part 10 or earlier, with its stated
results in dotted insets. The hatched boxes rest on sketches at depth B. The last box follows one scene through six of
them.](tut-read-vi-map){#fig:read-vi-map}

::: plain
Section VI says that the only motion in ordinary matter fast enough to send out short gravitational waves is heat. A
wave that crosses matter shears it, and the matter's internal friction takes a tiny share of the wave's energy, so tiny
that matter is transparent. A body that absorbs also glows, through the same friction. So every warm body glows, and
nothing casts a shadow: a camera adds up the glow of everything along each line of sight.

The friction that matters is the friction at the frequencies of heat, which can be very different from the stickiness
we feel when we stir a liquid. Real materials glow at one to sixty per cent of a reference value. Causality fixes the
total friction a material can have, so no material can glow brighter than a fixed limit.
:::

## Heat glows at wavelengths of tens of micrometres

In the [plain words](/paper/#sec:thermal) atoms jiggle "about $10^{13}$ times a second": $\kB T/h =
6.1\times10^{12}\unit{Hz}$ at a temperature $\sym{temperature}{T}$ of 293 K, with $\kB$ Boltzmann's constant and $h =
2\pi\hbar$ Planck's constant. The glow is brightest per unit of frequency at 17.2 THz, a wavelength of 17.4 µm, and
its count of gravitons peaks at 9.7 THz, or 31 µm: "tens of micrometres" (*checked here*, from chapter
[10.1](/tutorial/glow/black-body/#the-energy-of-the-glow-peaks-at-2.82-thermal-energies-and-the-count-at-1.59)'s peaks
at 2.82 and 1.59 in $\sym{planck-ratio}{x} = \hbar\omega/\kB T$, a quantum's energy over the thermal energy).

## Heat is fast enough, and a wave crossing matter fades at Hawking's rate

Heat is "the only motion in ordinary matter fast enough" because a body moving as a whole sends waves far longer than
itself (chapter
[R5](/tutorial/waves/reading-section-iii/#every-body-that-moves-as-a-whole-lies-deep-inside-its-near-zone), *read
now*), and "as sharp as an infrared one" is chapter
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)'s $\lambda/D$
(*read now*).

In [*Absorption*](/paper/#par:absorption) a wave of strain $\field h_{ij}$ shears a medium at the rate
$\tfrac12\dot{\field h}_{ij}$, and a medium of viscosity $\sym{dynamic-viscosity}{\matter\eta}$, in pascal seconds,
pushes back with the stress $-\matter\eta\dot{\field h}_{ij}$. The paper's wave equation and absorption coefficient
are

{{paper eq:damped}}

{{paper eq:alpha}}

(*read now, derived in chapter [7.8](/tutorial/geometry/wave-energy/#viscosity-fades-a-wave-at-hawkings-rate)*). For
water's everyday $10^{-3}\unit{Pa\,s}$ the energy decays at $16\pi G\matter\eta/c^2 = 3.7\times10^{-29}\unit{s^{-1}}$,
and dividing by $c$ gives $\sym{absorption-coefficient}{\alpha} = 1.25\times10^{-37}\unit{m^{-1}}$, the paper's
"$\alpha \approx 10^{-37}\,\mathrm{m^{-1}}$". The energy falls by the factor $e$ in $1/\alpha = 8.0\times10^{36}$ m,
or $8.5\times10^{20}$ light-years, "nearly $10^{21}$" (*checked here*). The universe's "$10^{11}$ light-years" is
*stated in the paper*. That $\matter\eta$ is "the friction at the frequency of the wave" is chapter
[4.4](/tutorial/response/viscosity/#a-wave-in-a-viscous-medium-fades-at-the-friction-of-its-own-frequency)'s (*read
now*).

## A medium that absorbs must glow, by the same friction

[*Emission*](/paper/#par:emission) takes the Planck radiance $\sym{planck-radiance}{B_\omega(T)}$, in
$\mathrm{W\,m^{-2}\,sr^{-1}}$ per unit of angular frequency, "summed over the two polarizations" (*read now, derived in
chapter
[10.1](/tutorial/glow/black-body/#each-mode-holds-the-thermal-quanta-of-an-oscillator-and-the-product-is-plancks-law)*)
and gives the paper's

{{paper eq:kirchhoff}}

with $\sym{emissivity}{j_\omega}$ the power sent per cubic metre, per steradian and per unit of angular frequency.
Matter takes quanta from a mode of radiation in proportion to the mean number $\sym{mode-occupation}{n_\omega}$ that
the mode holds, whatever the radiation's state, and gives them in proportion to $n_\omega + 1$. So $\alpha$, the
absorption less the stimulated emission in proportion to $n_\omega$, is the "net absorption coefficient", and
$j_\omega$, the 1, is "the spontaneous emission" (*read now, derived in chapter
[10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more)*).
In thermal radiation $n_\omega$ is 10.1's thermal occupation $\sym{occupation}{\bar n} = 1/(e^x - 1)$, which enters
every glow below.

"The same expression follows directly from the thermal fluctuations of shear stress" (*read now, derived in chapter
10.2* at depth B), in the "unsymmetrized (Wightman) order", the order in which matter gives energy to the field. The
plasma results and "What we add" are *stated in the paper* [@GhiglieriLaine2015; @GarciaCelyRingwald2025].

## Matter is transparent, so a pixel adds the glow along its whole line

*Matter is transparent*: against a background of radiance $I_{\rm bg}$, a body
changes what a pixel receives by $(B_\omega - I_{\rm bg})(1 - e^{-\tau})$ (*read now, derived in chapter
[5.5](/tutorial/waves/radiance/#along-a-ray-matter-adds-its-glow-and-takes-a-share-of-what-passes)*). Here
$\sym{optical-depth}{\tau}$ is the **optical depth**, the pure number $\int\alpha\,\dd s$ along the line, not a time. A
metre of water has $\tau = 1.2\times10^{-37}$, so it dims what lies behind it by that fraction and adds its own glow,
$\tau B_\omega$ (*checked here*). *Brightness is set by temperature and high-frequency friction* (*read now*:
[10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more)'s
law with 4.4's friction at the wave's frequency).

*The glow is faint.* A person, taken as 70 litres of water at 293 K, sends the table's $1.1\times10^{-35}$
$\mathrm{W\,m^{-3}}$ times $0.07\unit{m^3}$, or $7.7\times10^{-37}$ W: "about $10^{-36}$ W". At water's mean
graviton energy of $1.7\,\kB T$ that is one graviton every $2.8\times10^8$ years (*checked here*, as in chapter
[5.5](/tutorial/waves/radiance/#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature)).[^person]
The plain words' "hundred watts of infrared light" is a net loss, not an emission.[^infrared]

{{paper fig:line-integral}}

In the caption each body $k$ adds its **number emissivity** $\sym{number-emissivity}{j_N}$, in gravitons per second,
per cubic metre and per steradian, times the length $\ell_k$ of the line inside it: the paper's [](/paper/#eq:column)
(*read now, derived in chapter 5.5*). Its values are "illustrative" (*stated in the paper*).

## The hot furnace weighs the same, yet sends twenty-six times as many gravitons

{{paper fig:closed-furnace}}

::: try {#scene-closed-furnace}
The paper's live figure: the two furnaces, with the iron at 293 K and 1500 K, in light on one side of a divider and
in the thermal glow on the other. Drag the divider, or drag the scene to look around. Predict first:
when both furnaces are seen in the glow, will the cold block show through its steel at all, and will each steel box
hide what lies behind it or add to it? Then drag the divider to the left and compare the two blocks.
:::

"To within the mass of their heat", $\Delta U/c^2$ is $1.11\times10^{-11}$ kg per megajoule (*checked here*, by chapter
[6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-mass-is-its-total-energy-so-heat-has-weight)) [@Tolman1930].
A friction the same at every frequency and temperature makes the count grow as $T^3$, and $(1500/293)^3 = 134$ is "more
than a hundredfold" (*checked here*, by
[10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)). A
metal's friction at the glow's peak falls as $1/T$, so its count grows as $T^2$: $(1500/293)^2 = 26.2$, "nearer 25"
(*checked here*, by
[10.3](/tutorial/glow/why-matter-barely-glows/#each-material-of-the-table-is-a-weight-at-a-place)).[^25] The
caption's sixteen and twenty-two are *checked*
[at the end](#the-closed-furnace-from-the-friction-of-iron-to-a-count-of-gravitons).

## The friction at the wave's frequency counts, and causality fixes its total

[*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat) replaces $\matter\eta$ by
$\mathrm{Re}\,\matter\eta(\omega)$, the dissipative part of the shear response [@BaymPatilPethick2017]. Maxwell's
liquid has

{{paper eq:maxwell}}

with $\sym{relaxation-time}{\tau}$ here the time in which its stresses relax and $\matter\eta_0$ its everyday viscosity
(*read now, derived in chapter
[4.4](/tutorial/response/viscosity/#maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast)*). Its stiffness
against a sudden shear, in pascals, is $\sym{unrelaxed-modulus}{\matter\mu_\infty} = \matter\eta_0/\tau$, so the tail
$\matter\eta_0/(\omega\tau)^2$ is $\matter\mu_\infty^2/\matter\eta_0\omega^2$ (*checked here*). So at one stiffness
the more viscous liquid has the less friction at high frequency. Honey, with $\matter\eta_0 \approx 10\unit{Pa\,s}$
and 1 GPa, has $8.5\times10^{-12}\unit{Pa\,s}$ at the glow's peak, ten thousand times below a Maxwell liquid with
water's $10^{-3}\unit{Pa\,s}$ (*read now, derived in chapter 4.4*).

A wave's wavenumber is "about $10^{-5}$ of that of a sound wave", $c_T/c = 1.0\times10^{-5}$ for shear
sound at $c_T = 3000\unit{m\,s^{-1}}$, so it "cannot make a single sound quantum" (*read now, derived in chapter
[10.3](/tutorial/glow/why-matter-barely-glows/#a-wave-shears-a-body-all-at-once-so-it-cannot-make-one-phonon)*).

That $\mathrm{Re}\,\matter\eta$ "is the spectrum of the material's stress" is chapter 4.6's theorem as chapter
[10.2](/tutorial/glow/kirchhoff/#the-same-law-follows-from-the-random-stress-inside-warm-matter) uses it (*read now*).
Causality then gives the paper's

{{paper eq:friction-sum}}

(*read now, derived in chapter [4.5](/tutorial/response/causality/#causality-fixes-a-materials-total-friction)*
[@SrivastavaWidomPizzella2003]), with $\matter\mu_0$ the stiffness against a slow shear. For Maxwell's liquid
$\int_0^\infty\dd\omega/(1 + \omega^2\tau^2) = \pi/2\tau$, so the left side is $\matter\eta_0/\tau =
\matter\mu_\infty$, as the paper says (*checked here*).

A **weight** $\sym{relaxing-stiffness}{\Delta\matter\mu} = \matter\mu_\infty - \matter\mu_0$, the stiffness that
relaxes, spread evenly over a band $\Delta\omega$ has $\mathrm{Re}\,\matter\eta \approx
(\pi/2)\Delta\matter\mu/\Delta\omega$: "the stiffness that relaxes there divided by the band" (*read now, derived in
chapter 10.3*).

## Free electrons give copper its friction and iron a ceiling

In *Free electrons* the friction $\tfrac15\matter nmv_F^2\tau/(1 + \omega^2\tau^2)$ is *read now, derived in chapter
[10.3](/tutorial/glow/why-matter-barely-glows/#free-electrons-fill-a-sphere-of-states-and-collisions-relax-a-sheared-one)*
at depth B. Here $\sym{electron-density}{\matter n}$ is the number of free electrons per cubic metre, $m =
9.11\times10^{-31}$ kg the electron's mass, $\sym{fermi-speed}{v_F}$ their Fermi speed and $\tau$ now the collision
time, the mean time between collisions. The weight $\tfrac25\matter nE_F$, with $\sym{fermi-energy}{E_F}$
the Fermi energy, is 38.2 GPa for copper, whose $8.47\times10^{28}$ electrons per cubic metre have $E_F = 7.03$ eV:
"38 GPa" (*checked here*).

Copper's collision time follows from how well it conducts [@Hirayama2011]. A field $E$ accelerates each electron, of
charge $e = 1.60\times10^{-19}$ C, at $eE/m$ between collisions, so the electrons drift at $eE\tau/m$ and carry the
current density $\matter ne^2\tau E/m$. The **resistivity** $\sym{resistivity}{\rho_e}$, the field over the current
density in ohm metres, is then $m/(\matter ne^2\tau)$. Copper's $1.68\times10^{-8}\unit{\Omega\,m}$ gives $\tau =
2.49\times10^{-14}$ s, the paper's $2.5\times10^{-14}$, and $\omega\tau = 2.7$ at the glow's energy peak and 1.5 at
its count's peak, "about one" (*derived here*).

"The friction cannot exceed $\tfrac1{10}nmv_F^2/\omega$", which is $\Delta\matter\mu/2\omega$, reached when $\omega\tau
= 1$ (*read now, derived in chapter
[4.4](/tutorial/response/viscosity/#a-metals-electrons-relax-like-a-maxwell-liquid-and-their-friction-has-a-ceiling)*).
For iron, the paper's source gives 79.6 cubic bohr per atom (a bohr is $5.29\times10^{-11}$ m), so two free electrons
per atom make $\matter n = 1.70\times10^{29}\unit{m^{-3}}$ and $E_F = 11.17$ eV, and the weight is 121 GPa (10.3's
122 rounds $\matter n$ and $E_F$ first). The table's **effective friction**
$\sym{effective-friction}{\matter\eta_{\rm eff}}$ is the constant friction that sends the same power. A power adds up
$\mathrm{Re}\,\matter\eta\,\omega^3\bar n$ over frequency, so for the ceiling
[10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)'s
integrals of $x^2/(e^x - 1)$, $2\sym{riemann-zeta}{\zeta(3)} = 2.404$ with $\zeta(3) = \sum_{j\ge1}j^{-3}$, and of
$x^3/(e^x - 1)$, $\pi^4/15 = 6.494$, give

$$\matter\eta_{\rm eff} = \frac{\hbar\,\Delta\matter\mu}{2\kB T}\cdot\frac{2\zeta(3)}{\pi^4/15} =
5.9\times10^{-4}\unit{Pa\,s}$$

at 293 K (*checked here*): "an envelope over every collision time".

## A shear drives silicon's Raman line, every vibration of a glass and the bonds of water

In *Driven vibrations* silicon's line at 520 cm⁻¹ is $\omega_0 = 2\pi c\times5.2\times10^4\unit{m^{-1}} =
9.79\times10^{13}\unit{s^{-1}}$, or 15.59 THz (*checked here*). Kleinman's weight $M\omega_0^2\zeta_K^2/8a$ is *stated
in the paper*. With the atom's mass $\sym{atom-mass}{M} = 4.66\times10^{-26}$ kg, the lattice constant
$\sym{lattice-constant}{a} = 0.5431$ nm and Kleinman's parameter $\sym{kleinman-parameter}{\zeta_K} = 0.54$, a pure
number, it is 30.0 GPa (*checked here*). Only three of five shears drive the line, which averages to
$\tfrac35\times30.0 = 18.0$ GPa (*read now, derived in chapter
[10.3](/tutorial/glow/why-matter-barely-glows/#a-crystal-with-two-atoms-in-its-cell-rings-at-its-raman-line-when-sheared)*).
Its width of 3 cm⁻¹, $\Gamma = 5.65\times10^{11}\unit{s^{-1}}$, is a quality factor $Q = \omega_0/\Gamma = 173$, and
by chapter 4.1 its peak friction is $18.0\unit{GPa}/\Gamma = 0.032\unit{Pa\,s}$: "thirty times the placeholder", the
paper's constant $10^{-3}\unit{Pa\,s}$ (*checked here*).

The three shears carry $\tfrac12$, $\tfrac58$ and $\tfrac23$ of a wave's drive along a cube edge, a face diagonal and a
body diagonal (10.3), so the line is $\tfrac54$ and $\tfrac43$ as bright along the diagonals (*checked here*). Its 60%
polarization along a face diagonal is derived in the stretch problem of chapter [5.4](/tutorial/waves/polarization/)
(*read now*). The glass and water spectra are *stated in the paper* [@Leonforte2006; @Schulz2020]; that of water
gives $2.4\times10^{-4}\unit{Pa\,s}$ near 8 THz, 0.35 of its steady $6.9\times10^{-4}\unit{Pa\,s}$, so the
paper's "a third" holds (*checked here*).[^water]

## Even a perfect crystal glows through pairs of phonons

In *Pairs of phonons* the stress $\tfrac12\,\dd^2/\dd t^2\sum mu_xu_y$, with $m$ an atom's mass and $\vect u$ its
displacement, is *stated in the paper* and sketched in
[10.3](/tutorial/glow/why-matter-barely-glows/#even-a-perfect-crystal-glows-through-pairs-of-phonons). Its classical
weight $2\matter n\kB T$, with $\matter n$ here the atoms per cubic metre, is *read now, derived in chapter 10.3* in an
Einstein solid: at 293 K it is 0.40 GPa for silicon, 0.69 for copper and 1.43 for diamond, "about a gigapascal"
(*checked here*). "The only one in an insulating crystal with one atom in its cell" follows from 10.3's list of
channels (*read now*). Diamond, whose Debye temperature is 2200 K, holds at 293 K only 0.16 of its classical heat
capacity, so its quantum occupations "matter" (*checked here*, by
[10.2](/tutorial/glow/kirchhoff/#heat-capacity-says-how-a-bodys-energy-follows-its-temperature)'s Debye model).
Anharmonicity's factor of order one, "an eighth of diamond's glow" and Akhiezer's tail, with $\tau$ a thermal
phonon's relaxation time, are *stated in the paper*.

## Real materials glow at one to sixty per cent of the placeholder

The summary paragraph's "one to sixty per cent" is the table's $\matter\eta_{\rm eff}$: from
$0.12\times10^{-4}\unit{Pa\,s}$ (diamond, 1.2%) to at most $5.9\times10^{-4}$ (iron, 59%). So "$10^{-3}\,
\mathrm{Pa\,s}$ is an upper estimate, and $10^{-4}\,\mathrm{Pa\,s}$ is typical" (*checked here*). The "30 nm" is
checked [below](#ordinary-bodies-glow-through-their-volume-not-their-surface).

"Metals and water glow redder than a constant friction would": their mean graviton energies, 1.4, 1.5 and $1.7\,\kB
T$, lie below the placeholder's $2.70\,\kB T$ (*read now*, from
[10.3](/tutorial/glow/why-matter-barely-glows/#each-material-of-the-table-is-a-weight-at-a-place)). Iron's ceiling
gives $2\zeta(3)/(\pi^2/6) = 1.46\,\kB T$, and diamond's line in the Wien tail alone gives $6.5\,\kB T$, or the table's
6.4 with its pairs (*checked here*). The count $j_N = \int\alpha\,B_\omega\,\dd\omega/\hbar\omega$ is 10.1's (*read
now*). A collision rate in proportion to $T$ [@Duthil2014] and the "factor of two" are *stated in the paper*; the
$T^3$ and $T^2$ that follow are 10.3's (*read now*).

## Each row of the table is a weight at a place

The paper's Table [](/paper/#tab:materials) gives, at 293 K, $\matter\eta_{\rm eff}$ in $10^{-4}\unit{Pa\,s}$, the
power per volume $P/V$ in $10^{-35}\unit{W\,m^{-3}}$ and the mean energy $\bar E$ of a graviton. For a constant
friction $P/V = 4\alpha\sigma_{\rm SB}T^4$, with $\sigma_{\rm SB}$ the Stefan–Boltzmann constant, which is 2.08 table
units for each $10^{-4}\unit{Pa\,s}$ (10.1). So every row's second column is 2.08 times its first, to the rounding
(*checked here*). Chapter
[10.3](/tutorial/glow/why-matter-barely-glows/#each-material-of-the-table-is-a-weight-at-a-place) recomputes the rows
from its models; those of diamond and water are *stated in the paper*.

{{paper fig:materials}}

Panel (a)'s shaded band, where $B_\omega$ exceeds a tenth of its peak, is $0.420 < x < 8.30$, or 2.57 to 50.7 THz
(*checked here*). Its steps are where pair bands end, at twice the Debye frequency (*read now*, from 10.3). Panel (b)
draws each $4\pi\alpha B_\omega$ (*read now, derived in chapter
[10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more)*).

## No material can glow brighter than its weight allows

[*A bound on the glow*](/paper/#par:a-bound-on-the-glow) puts the whole weight where the Planck spectrum peaks:

{{paper eq:glow-bound}}

(*read now, derived in chapter
[10.3](/tutorial/glow/why-matter-barely-glows/#no-material-can-glow-brighter-than-its-weight-allows)*), with
$\sym{graviton-rate}{\dot N}$ the gravitons sent per second in all directions. Eight times the peaks 1.4214 at $x =
2.821$ and 0.6476 at $x = 1.594$ gives 11.37 and 5.18 (*checked here*, by 10.1), and at 293 K, 30 GPa radiates at most
$5.6\times10^{-35}\unit{W\,m^{-3}}$ (*checked here*).

Silicon's line reaches 98.5% of its own weight's bound, the paper's 98% (*checked here*): a weight placed exactly at
its $x = 2.55$ would reach 98.8%, and the line's width moves a little of it to where the glow is weaker. The other
shares are 10.3's (*read now*).[^shares]

The optical depth of a path of length $L$, integrated over frequency, $8\pi^2GL\,\Delta\matter\mu/c^3$, is *read now,
derived in chapter 10.3*: for a metre of 30 GPa it is $5.9\times10^{-24}\unit{s^{-1}}$, the paper's $6\times10^{-24}$
(*checked here*). The resonant bar is *stated in the paper* [@MisnerThorneWheeler1973]. To glow as brightly as the
placeholder, a material needs 112 GPa at 293 K and 2.09 TPa at 5500 K, and 1.70 TPa to send as many gravitons at
5500 K: the paper's 110 GPa, 2.1 and 1.7 TPa (*checked here*). Only the terapascals are "several times" diamond's shear
stiffness, 536 GPa; 110 GPa is a fifth of it.

"Temperature cannot be read from the glow alone", as the plain words' first caution also says, because counted
gravitons measure only the friction times a power of the temperature (*read now, derived in chapter
[5.5](/tutorial/waves/radiance/#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature)*).

::: try {#planck-spectrum}
Planck's law at a temperature you choose. Preset buttons (*A room* is 293 K) and a slider set the temperature, two
buttons halve or double it, and the readouts give the peak, $\sigma_{\rm SB}T^4$ and the count. Predict first: when
the temperature doubles, how far does the peak move, and by what factors do $\sigma_{\rm SB}T^4$ and the count grow?
Choose *A room* and double it. Then predict the temperature at which the energy peak falls on silicon's line at 15.6
THz, where a narrow line reaches its bound, and find it with the slider.
:::

## Ordinary bodies glow through their volume, not their surface

[*Volume and surface emission*](/paper/#par:volume-and-surface-emission) cites earlier work [@SchaeferDehnen1981;
@DehnenRomeroSchaefer1984]. A lossless body absorbs only at its surface, where a wave launches sound [@Dyson1969].
That its inside cannot absorb is *read now, derived in chapter
[10.3](/tutorial/glow/why-matter-barely-glows/#a-wave-shears-a-body-all-at-once-so-it-cannot-make-one-phonon)*; that
its surface does, and its glow $\sym{surface-power}{P_S}$, in watts,

{{paper eq:surface-glow}}

are *stated in the paper*, with $\sym{shear-speed}{c_T}$ and $\sym{compressional-speed}{c_L}$ the speeds of the two
kinds of sound and $\sym{density}{\matter\rho}$ the density; the glow's check by Kirchhoff's law is 10.3's. Inside,
sound of quality factor $Q$ has the friction $\matter\rho c_T^2/\omega Q$ (chapter 4.4), and the volume's glow
$\sym{volume-power}{P_V}$ and the paper's

{{paper eq:volume-surface}}

are *read now, derived in chapter 10.3*, with $\sym{phonon-path}{\ell_s} = Q\hbar c_T/\kB T$ the path of a thermal
phonon. For steel, with $c_T = 3200$ and $c_L = 5900\unit{m\,s^{-1}}$, the prefactor is 5.47, "5.5", and at $Q = 10$,
$\ell_s = 0.83$ nm, "nanometres" (*checked here*). A steel ball of radius 10 cm and density $7800\unit{kg\,m^{-3}}$ at
293 K glows $1.0\times10^{-46}$ W from its surface and $6.6\times10^8$ times more from its volume, the paper's
$10^{-46}$ W and $7\times10^8$ (*checked here*).[^steels] With the table's glow per volume, the two glows of diamond,
the faintest material, are equal in a sphere of radius 28 nm: the paper's "30 nm" (*checked here*).[^thirty] A cold
pure crystal glows "in proportion to $T^2$ rather than $T^3$", as the powers of $\kB T$ in the two formulas show
(*checked here*).

## The closed furnace, from the friction of iron to a count of gravitons

We now follow the scene of the paper's Figure [](/paper/#fig:closed-furnace) end to end. The camera is 1.5 m above
the floor. Each furnace is a steel box 0.9 m wide and deep and 1.0 m tall, with walls 5 cm thick, standing on the
floor 3.5 m in front of the camera and 1.1 m to one side. It holds a block of iron $0.5\times0.4\times0.5$ m, a tenth
of a cubic metre, whose middle is 0.3 m above the floor. The floor is a slab of concrete 0.3 m thick.

**The weight.** Heating a kilogram of iron from 293 K to 1500 K takes 0.82 MJ, so the hot block is heavier by
$9.1\times10^{-12}$ kg for each kilogram, one part in $10^{11}$ (chapter 6.4).

**The friction.** The scene gives each material its **count-equivalent friction**
$\sym{count-friction}{\matter\eta_N}$, in pascal seconds: the constant friction that would send as many gravitons as
the material's real spectrum. A count adds up $\mathrm{Re}\,\matter\eta\,\omega^2\bar n$ over frequency, where a power
adds up $\mathrm{Re}\,\matter\eta\,\omega^3\bar n$. So for iron's ceiling, with 121 GPa, 10.1's integrals of
$x/(e^x - 1)$, $\pi^2/6$, and of $x^2/(e^x - 1)$, $2\zeta(3)$, give

$$\matter\eta_N = \frac{\hbar\,\Delta\matter\mu}{2\kB T}\cdot\frac{\pi^2/6}{2\zeta(3)} =
1.08\times10^{-3}\unit{Pa\,s}$$

at 293 K. Iron's phonon pairs add 0.7%, which makes the scene's $1.09\times10^{-3}\unit{Pa\,s}$ (*checked
here*).[^count] The hot block has $293/1500$ of it, $2.13\times10^{-4}\unit{Pa\,s}$, because a metal's friction falls
as $1/T$ (10.3). The steel has the cold iron's friction, and the concrete silica glass's count-equivalent friction:
37.2 GPa spread below 27 THz is $(\pi/2)\Delta\matter\mu/\Delta\omega = 3.44\times10^{-4}\unit{Pa\,s}$ up to $x =
4.42$, which holds 85% of the count's integral $2\zeta(3)$, so $\matter\eta_N = 2.92\times10^{-4}\unit{Pa\,s}$
(*checked here*).

**The glow.** Chapter 5.5's $j_N = 16G\matter\eta_N\sigma_{\rm SB}T^3/(2.70\,\kB c^3)$, the paper's
[](/paper/#eq:jN-friction), gives the cold iron and the steel $1.65\times10^{-15}$, the hot iron $4.33\times10^{-14}$,
26.2 times more, and the concrete $4.43\times10^{-16}$, all in gravitons $\mathrm{s^{-1}\,m^{-3}\,sr^{-1}}$.

**The line.** The line of sight to a block's middle drops 1.2 m while it runs 3.5 m forward and 1.1 m sideways, so it
reaches the middle after $\sqrt{3.5^2 + 1.1^2 + 1.2^2} = 3.86$ m and runs 1.10 m for each metre of depth. It crosses
$2\times0.05\times1.10 = 0.110$ m of steel in the box's front and back walls and $0.5\times1.10 = 0.551$ m of iron. It
meets the floor where it has dropped 1.5 m, at 1.25 times that distance, and leaves the slab 0.3 m lower, at 1.5
times, after $0.25\times3.86 = 0.965$ m of concrete. The air does not glow. By the paper's [](/paper/#eq:column) the
two lines read, in gravitons $\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$,

$$\begin{aligned}
\text{cold:}&\quad 1.65\times10^{-15}\times0.661 + 4.43\times10^{-16}\times0.965 = 1.52\times10^{-15},\\
\text{hot:}&\quad 1.65\times10^{-15}\times0.110 + 4.33\times10^{-14}\times0.551\\
&\qquad + 4.43\times10^{-16}\times0.965 = 2.45\times10^{-14}.
\end{aligned}$$

Their ratio is 16.1, the caption's sixteen, and without the floor 22.0, its twenty-two (*checked here*). The **common
glow**, the walls' and the floor's share that both lines receive, is $\sym{common-glow}{g} = 0.67$ of the cold block's,
chapter 5.5's two-thirds.

**How faint.** In all directions the hot block sends $4\pi j_N\times0.1\unit{m^3} = 5.4\times10^{-14}$ gravitons a
second, one every 580,000 years. A square metre 3.5 m away, the distance of Section IX's graviton budget (chapter
R10b), catches one every $9.0\times10^7$ years.

## The ledger accounts for all eight of Section VI's equations

| The paper's equation | What it says | Where it is derived; its mark here |
|---|---|---|
| [](/paper/#eq:damped) | a wave fades in a viscous medium | [7.8](/tutorial/geometry/wave-energy/#viscosity-fades-a-wave-at-hawkings-rate); *checked here* |
| [](/paper/#eq:alpha) | Hawking's absorption | [7.8](/tutorial/geometry/wave-energy/#viscosity-fades-a-wave-at-hawkings-rate); *checked here* |
| [](/paper/#eq:kirchhoff) | glow is absorption times Planck | [10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more), with [10.1](/tutorial/glow/black-body/); *read now* |
| [](/paper/#eq:maxwell) | Maxwell's liquid | [4.4](/tutorial/response/viscosity/#maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast); *checked here* |
| [](/paper/#eq:friction-sum) | causality fixes the total friction | [4.5](/tutorial/response/causality/#causality-fixes-a-materials-total-friction); *checked here* |
| [](/paper/#eq:glow-bound) | the bound on every glow | [10.3](/tutorial/glow/why-matter-barely-glows/#no-material-can-glow-brighter-than-its-weight-allows); *checked here* |
| [](/paper/#eq:surface-glow) | a lossless sphere's surface glow | stated; its absorptivity checked in [10.3](/tutorial/glow/why-matter-barely-glows/#ordinary-bodies-glow-through-their-volume-not-their-surface) |
| [](/paper/#eq:volume-surface) | volume against surface | [10.3](/tutorial/glow/why-matter-barely-glows/#ordinary-bodies-glow-through-their-volume-not-their-surface); *checked here* |

The section also uses the paper's [](/paper/#eq:column) and [](/paper/#eq:jN-friction), from Section IX, both derived
in chapter [5.5](/tutorial/waves/radiance/#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature).
Stated, not derived: Kleinman's weight, the glass, water and diamond spectra, Akhiezer's tail, a metal's collision
rate, the resonant bar, a surface's absorption and the surface glow.

::: check
### Q

Why does the hot iron send 26 times as many gravitons as the cold block, and not 134 times?

### A

A metal's collision rate grows as $T$, so its friction at the glow's peak falls as $1/T$, and the count grows as $T^2$.

### Q

What share of the count along the line through the cold furnace's middle comes from the block itself?

### A

The block adds $9.1\times10^{-16}$ of the line's $1.52\times10^{-15}$, or 60%.
:::

**The idea to keep: Section VI follows from Planck's law, Kirchhoff's balance and the sum rule. Matter glows its
friction at the frequencies of heat times a black body, and causality caps that friction, so real materials glow at
one to sixty per cent of the placeholder, through any wall.**

::: problems
### Practice

Rerun the closed furnace with the hot block at 1000 K, its friction still falling as $1/T$: its count against the
cold block's, and the ratio of the two lines, with and without the floor.

::: solution
The block's count grows as $T^2$: $(1000/293)^2 = 11.6$. The hot line reads $1.8\times10^{-16} + 11.6\times9.1\times
10^{-16} + 4.3\times10^{-16} = 1.12\times10^{-14}$, so the ratio is 7.4 with the floor and 9.9 without it.
:::

### Stretch

With chapters 4.4, 10.1 and 10.3: what fraction of the gravitons that its weight of 121 GPa allows does the hot iron
send at 1500 K?

::: solution
The bound is $\dot N/V \le 5.18\,G\Delta\matter\mu(\kB T)^2/\hbar^2c^5 = 6.7\times10^{-13}\unit{s^{-1}\,m^{-3}}$ at
1500 K, and the block sends $4\pi j_N = 5.4\times10^{-13}$, or 81%. The ceiling's count, with 10.1's $\pi^2/6$, is
$(4\pi/3)\,G\Delta\matter\mu(\kB T)^2/\hbar^2c^5$, so the fraction is $4.19/5.18 = 0.81$ at every temperature.
:::

### The paper

Reproduce every number of the paper's paragraph [*Volume and surface
emission*](/paper/#par:volume-and-surface-emission).

::: solution
With $\zeta(3) = 1.202$, $c_T = 3200$ and $c_L = 5900\unit{m\,s^{-1}}$, $256\zeta(3)/[\pi^3(1 + 3c_T/2c_L)] = 5.47$. At
293 K and $Q = 10$, $\ell_s = Q\hbar c_T/\kB T = 0.83$ nm. For $R = 0.1$ m and $\matter\rho = 7800\unit{kg\,m^{-3}}$
the paper's [](/paper/#eq:surface-glow) gives $1.0\times10^{-46}$ W, and $P_V/P_S = 5.47\times0.1/0.83\times10^{-9}
= 6.6\times10^8$.
:::
:::

::: paper
- [*Absorption*](/paper/#par:absorption) and [*Emission*](/paper/#par:emission): the paper's [](/paper/#eq:damped),
  [](/paper/#eq:alpha) and [](/paper/#eq:kirchhoff), Figures [](/paper/#fig:line-integral) and
  [](/paper/#fig:closed-furnace).
- [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat): the paper's
  [](/paper/#eq:maxwell) and [](/paper/#eq:friction-sum), Table [](/paper/#tab:materials) and Figure
  [](/paper/#fig:materials).
- [*A bound on the glow*](/paper/#par:a-bound-on-the-glow) and [*Volume and surface
  emission*](/paper/#par:volume-and-surface-emission): the paper's [](/paper/#eq:glow-bound),
  [](/paper/#eq:surface-glow) and [](/paper/#eq:volume-surface).
- [Section IX](/paper/#sec:first-image): the paper's [](/paper/#eq:column), which makes these glows an image
  (chapter R10b).
:::

::: deeper
- S. W. Hawking, "Perturbations of an expanding universe", *Astrophysical Journal* 145 (1966) 544: where the
  absorption of gravitational waves by viscosity first appears.
- W. Dehnen, F. B. Romero and G. Schäfer, "Gravitational radiation of an isotropic elastic sphere", *Classical and
  Quantum Gravity* 1 (1984) 305: the surface glow of the last paragraph.
:::

[^person]: The paper's "about $10^{-36}$ watts" and "two hundred million years" use water's friction. Its full
    spectrum gives $7.80\times10^{-37}$ W and one graviton every $2.75\times10^8$ years
    at 293 K, and $9.1\times10^{-37}$ W and $2.4\times10^8$ years at the body's 310 K. Water's everyday
    $10^{-3}\unit{Pa\,s}$ would give $1.8\times10^{-35}$ W at 310 K.

[^infrared]: The paper's "about a hundred watts of infrared light" is the net loss to a room: skin of 1.8 m² at 306 K
    and emissivity 0.98 emits 880 W, about a kilowatt, and takes back 740 W from walls at 293 K.

[^water]: The paper's $2\times10^{-4}\unit{Pa\,s}$ near 8 THz rounds down the cited model's $2.4\times10^{-4}$
    ($2.6\times10^{-4}$ at 7 THz).

[^shares]: The paper's 39 and 40 per cent for copper and water take each weight, the integral of the paper's
    [](/paper/#eq:friction-sum), only up to $\hbar\omega = 60\,\kB T$, leaving out 1.1% of copper's and 3.2% of
    water's. With the whole weight they are 38.2% and 39.1%.

[^25]: The paper's "nearer 25" and "about 25" round $(1500/293)^2 = 26.2$, the value its own scene computes.

[^thirty]: The paper's 30 nm is a fair rounding of diamond's crossing, 28 nm with the sound speeds of its own elastic
    constants, $c_T = 12.35$ and $c_L = 18.15\unit{km\,s^{-1}}$. Steel, copper, silicon and silica cross below 1 nm.

[^steels]: The paper's prefactor 5.5 is that of $c_T = 3200\unit{m\,s^{-1}}$, which gives 5.47 and $6.6\times10^8$.
    Section IV's steel, with $3000\unit{m\,s^{-1}}$, would give 5.6 and $7.2\times10^8$.

[^count]: It is almost twice the table's $5.9\times10^{-4}\unit{Pa\,s}$, which matches the power, because a friction
    that falls as $1/\omega$ is largest at low frequencies, where gravitons are many and cheap.
