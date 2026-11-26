---
id: R10
title: 'The glow of matter'
question: 'Why does every warm body glow in gravitational waves, how bright can any material glow, and what would a pixel see of a hot furnace behind steel walls?'
part: '10'
requires: ['4.4', '4.5', '5.4', '5.5', '6.4', '7.8', '10.1', '10.2', '10.3']
paper: [sec:thermal, eq:damped, eq:alpha, eq:kirchhoff, eq:maxwell, eq:friction-sum, eq:glow-bound, eq:surface-glow, eq:volume-surface, fig:line-integral, fig:closed-furnace, tab:materials, fig:materials, eq:column, eq:jN-friction]
figures: [fig:line-integral, fig:closed-furnace, fig:materials]
live: [scene-closed-furnace, planck-spectrum]
---

Every warm body glows in gravitational waves, in proportion to its internal friction and its temperature, and nothing
absorbs the glow on its way to a pixel. How bright can a material glow, and what does a pixel see of a hot furnace
behind steel walls?[^sixth]

::: plain
The only motion in ordinary matter fast enough to send out short gravitational waves is heat. A wave that crosses matter
shears it, and the matter's internal friction takes a tiny share of the wave's energy, so tiny that matter is
transparent. A body that absorbs also glows, through the same friction, so a camera adds up the glow of everything along each line
of sight.

The friction that matters is the friction at the frequencies of heat, which can differ greatly from the stickiness of a
stirred liquid. Real materials glow at one to sixty per cent of a reference value, and causality fixes the total
friction a material can have, so none can glow brighter than a fixed limit.
:::

## Heat glows at wavelengths of tens of micrometres

Atoms at a temperature $\sym{temperature}{T}$ of 293 K jiggle about $\kB T/h = 6.1\times10^{12}$ times a second, with $\kB$
Boltzmann's and $h = 2\pi\hbar$ Planck's constant. The glow is brightest per unit of frequency at
17.2 THz, a wavelength of 17.4 µm, and its count of gravitons peaks at 9.7 THz, or 31 µm. These follow from the peaks
of the thermal spectrum at 2.82 and 1.59 in $\sym{planck-ratio}{x} = \hbar\omega/\kB T$, a quantum's energy over the
thermal energy
([section 10.1](/tutorial/glow/black-body/#the-energy-of-the-glow-peaks-at-2.82-thermal-energies-and-the-count-at-1.59)).
A body moving as a whole sends waves far longer than itself
([the near zone](/tutorial/waves/reading-section-iii/#every-body-that-moves-as-a-whole-lies-deep-inside-its-near-zone)),
so only heat sends waves this short, and a camera of size $D$ images them to about $\lambda/D$, as an infrared one
([section 5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)).

## A wave crossing matter fades at Hawking's rate

A wave of strain $\field h_{ij}$ shears a medium at the rate $\tfrac12\dot{\field h}_{ij}$, and a medium of viscosity
$\sym{dynamic-viscosity}{\matter\eta}$, in pascal seconds, pushes back with the stress $-\matter\eta\dot{\field h}_{ij}$,
which acts back on the wave. The wave equation becomes

$$\ddot{\field h}_{ij} + \frac{16\pi G\,\matter\eta}{c^{2}}\,\dot{\field h}_{ij} - c^{2}\nabla^{2}\field h_{ij} = 0 ,$$

so the wave's energy decays at the rate $16\pi G\matter\eta/c^2$, and per unit length the absorption coefficient is

$$\alpha = \frac{16\pi G\,\matter\eta}{c^{3}}$$

([section 7.8](/tutorial/geometry/wave-energy/#viscosity-fades-a-wave-at-hawkings-rate)).[^hawking] For water's everyday
$10^{-3}\unit{Pa\,s}$ the energy decays at $3.7\times10^{-29}\unit{s^{-1}}$, and dividing by $c$ gives
$\sym{absorption-coefficient}{\alpha} = 1.25\times10^{-37}\unit{m^{-1}}$. The energy falls by the factor $e$ in
$1/\alpha = 8.0\times10^{36}$ m, or $8.5\times10^{20}$ light-years, ten billion times the diameter of the observable
universe.
The $\matter\eta$ that enters is the friction at the frequency of the wave (section 4.4).

## A medium that absorbs must glow, by the same friction

The Planck radiance $\sym{planck-radiance}{B_\omega(T)} = \hbar\omega^3/[4\pi^3c^2(e^{\hbar\omega/\kB T} - 1)]$, in
$\mathrm{W\,m^{-2}\,sr^{-1}}$ per unit of angular frequency, sums the two polarizations
([section 10.1](/tutorial/glow/black-body/#each-mode-holds-the-thermal-quanta-of-an-oscillator-and-the-product-is-plancks-law)).
Kirchhoff's law gives the power sent per cubic metre, per steradian and per unit of angular frequency,
$\sym{emissivity}{j_\omega}$:

$$j_\omega = \alpha(\omega)\,B_\omega(T) .$$

Matter takes quanta from a mode of radiation in proportion to the mean number $\sym{mode-occupation}{n_\omega}$ that
the mode holds, whatever the radiation's state, and gives them in proportion to $n_\omega + 1$. So $\alpha$ is the
absorption less the stimulated emission, the net absorption coefficient, and $j_\omega$ is the spontaneous emission, the
1 ([section 10.2](/tutorial/glow/kirchhoff/#matter-absorbs-in-proportion-to-the-quanta-present-and-emits-in-proportion-to-one-more)).
In thermal radiation $n_\omega$ is the thermal occupation $\sym{occupation}{\bar n} = 1/(e^x - 1)$, which enters every
glow below. The same law follows from the fluctuations of the material's shear stress (section 10.2).[^plasma]

## Matter is transparent, so a pixel adds the glow along its whole line

Against a background of radiance $I_{\rm bg}$, a body changes what a pixel receives by $(B_\omega - I_{\rm bg})(1 -
e^{-\tau})$ ([section 5.5](/tutorial/waves/radiance/#along-a-ray-matter-adds-its-glow-and-takes-a-share-of-what-passes)).
Here $\sym{optical-depth}{\tau}$ is the **optical depth**, the pure number $\int\alpha\,\dd s$ along the line. A metre of
water has $\tau = 1.2\times10^{-37}$: it dims what lies behind it by that fraction and adds its own glow, $\tau
B_\omega$.

A person, taken as 70 litres of water at body temperature, 310 K, radiates $9.1\times10^{-37}$ W,
one graviton of mean energy $1.64\,\kB T$ every $2.4\times10^8$ years (section 5.5),[^person] against the kilowatt of
infrared light that the skin emits.

{{paper fig:line-integral}}

In Figure [](/paper/#fig:line-integral) each body $k$ adds its **number emissivity** $\sym{number-emissivity}{j_N}$, in gravitons per second, per
cubic metre and per steradian, times the length $\ell_k$ of the line inside it; the values are illustrative.[^column]

## The friction at the wave's frequency counts, and causality fixes its total

A viscosity measured by stirring is a friction at zero frequency; at the frequency of a wave, $\matter\eta$ becomes $\mathrm{Re}\,\matter\eta(\omega)$, the dissipative part of the shear response
[@BaymPatilPethick2017]. Maxwell's liquid, whose stresses relax in a time $\sym{relaxation-time}{\tau}$, has

$$\mathrm{Re}\,\matter\eta(\omega) = \frac{\matter\eta_0}{1 + \omega^2\tau^2} ,$$

with $\matter\eta_0$ its everyday viscosity
([section 4.4](/tutorial/response/viscosity/#maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast)). Its stiffness
against a sudden shear, in pascals, is $\sym{unrelaxed-modulus}{\matter\mu_\infty} = \matter\eta_0/\tau$, so the tail
$\matter\eta_0/(\omega\tau)^2$ is $\matter\mu_\infty^2/\matter\eta_0\omega^2$. At one stiffness the more viscous liquid has the less friction at high frequency: honey, with $\matter\eta_0 \approx 10\unit{Pa\,s}$ and 1 GPa, has $8.5\times10^{-12}\unit{Pa\,s}$ at the glow's
peak, ten thousand times below a Maxwell liquid with water's $10^{-3}\unit{Pa\,s}$. We take it as the **placeholder**
against which each material's glow is measured.

A wave's wavenumber is $c_T/c = 1.0\times10^{-5}$ of that of shear sound, at $c_T = 3000\unit{m\,s^{-1}}$, so it
cannot make a single sound quantum
([section 10.3](/tutorial/glow/why-matter-barely-glows/#a-wave-shears-a-body-all-at-once-so-it-cannot-make-one-phonon)).
And $\mathrm{Re}\,\matter\eta$ is the spectrum of the material's random stress
([section 10.2](/tutorial/glow/kirchhoff/#the-same-law-follows-from-the-random-stress-inside-warm-matter)), whose
integral causality fixes [@SrivastavaWidomPizzella2003], with $\matter\mu_0$ the stiffness against a slow shear
([section 4.5](/tutorial/response/causality/#causality-fixes-a-materials-total-friction)):[^sum]

$$\frac{2}{\pi}\int_0^\infty \mathrm{Re}\,\matter\eta(\omega)\,\dd\omega = \matter\mu_\infty - \matter\mu_0 .$$

For Maxwell's liquid $\int_0^\infty\dd\omega/(1 + \omega^2\tau^2) = \pi/2\tau$, so the left side is
$\matter\eta_0/\tau = \matter\mu_\infty$. A **weight** $\sym{relaxing-stiffness}{\Delta\matter\mu} =
\matter\mu_\infty - \matter\mu_0$, the stiffness that relaxes, spread evenly over a band $\Delta\omega$ has
$\mathrm{Re}\,\matter\eta \approx (\pi/2)\Delta\matter\mu/\Delta\omega$.

## Free electrons give copper its friction and iron a ceiling

In a metal the free electrons have the friction $\tfrac15\matter nmv_F^2\tau/(1 + \omega^2\tau^2)$
([section 10.3](/tutorial/glow/why-matter-barely-glows/#free-electrons-fill-a-sphere-of-states-and-collisions-relax-a-sheared-one)).
Here $\sym{electron-density}{\matter n}$ is the number of free electrons per cubic metre, $m = 9.11\times10^{-31}$ kg
their mass, $\sym{fermi-speed}{v_F}$ their Fermi speed and $\tau$ now the mean time between collisions. The weight $\tfrac25\matter nE_F$, with $\sym{fermi-energy}{E_F}$ the Fermi energy, is 38.2 GPa for copper,
whose $8.47\times10^{28}$ electrons per cubic metre have $E_F = 7.03$ eV.

Copper's collision time follows from how well it conducts [@Hirayama2011]. A field $E$ accelerates each electron, of
charge $e = 1.60\times10^{-19}$ C, at $eE/m$, so the electrons drift at $eE\tau/m$ and carry the current density
$\matter ne^2\tau E/m$. The **resistivity** $\sym{resistivity}{\rho_e}$, the field over the current
density in ohm metres, is then $m/(\matter ne^2\tau)$. Copper's $1.68\times10^{-8}\unit{\Omega\,m}$ gives $\tau =
2.49\times10^{-14}$ s, and $\omega\tau = 2.7$ at the glow's energy peak and 1.5 at its count's peak: about one.

The friction cannot exceed $\tfrac1{10}\matter nmv_F^2/\omega$, which is $\Delta\matter\mu/2\omega$, reached when
$\omega\tau = 1$
([section 4.4](/tutorial/response/viscosity/#a-metals-electrons-relax-like-a-maxwell-liquid-and-their-friction-has-a-ceiling)).
For iron, two free electrons per atom at 79.6 cubic bohr per atom (a bohr is $5.29\times10^{-11}$ m) make $\matter n =
1.70\times10^{29}\unit{m^{-3}}$ and $E_F = 11.17$ eV, and the weight is 121 GPa. The **effective friction**
$\sym{effective-friction}{\matter\eta_{\rm eff}}$ is the constant friction that sends the same power. A power adds up
$\mathrm{Re}\,\matter\eta\,\omega^3\bar n$ over frequency, so for the ceiling the integrals of $x^2/(e^x - 1)$,
$2\sym{riemann-zeta}{\zeta(3)} = 2.404$ with $\zeta(3) = \sum_{j\ge1}j^{-3}$, and of $x^3/(e^x - 1)$, $\pi^4/15 = 6.494$
([section 10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)),
give

$$\matter\eta_{\rm eff} = \frac{\hbar\,\Delta\matter\mu}{2\kB T}\cdot\frac{2\zeta(3)}{\pi^4/15} =
5.9\times10^{-4}\unit{Pa\,s}$$

at 293 K, an envelope over every collision time.

## The vibrations of a solid add friction at their own frequencies

Silicon's Raman line at 520 cm⁻¹ has the angular frequency $\omega_0 = 2\pi c\times5.2\times10^4\unit{m^{-1}} =
9.79\times10^{13}\unit{s^{-1}}$, or 15.59 THz. Its weight is $M\omega_0^2\zeta_K^2/8a$, with the atom's mass
$\sym{atom-mass}{M} = 4.66\times10^{-26}$ kg, the lattice constant $\sym{lattice-constant}{a} = 0.5431$ nm and
Kleinman's parameter $\sym{kleinman-parameter}{\zeta_K} = 0.54$, a pure number: 30.0 GPa. Only three of the five shears
drive the line, which averages to $\tfrac35\times30.0 = 18.0$ GPa
([section 10.3](/tutorial/glow/why-matter-barely-glows/#a-crystal-with-two-atoms-in-its-cell-rings-at-its-raman-line-when-sheared)).
Its width of 3 cm⁻¹, $\Gamma = 5.65\times10^{11}\unit{s^{-1}}$, is a quality factor $Q = \omega_0/\Gamma = 173$, and
its peak friction is $18.0\unit{GPa}/\Gamma = 0.032\unit{Pa\,s}$, thirty times the placeholder. The three shears carry $\tfrac12$, $\tfrac58$ and $\tfrac23$ of a wave's drive along a cube edge, a face diagonal
and a body diagonal, so the line is $\tfrac54$ and $\tfrac43$ as bright along the diagonals, and 60% polarized along a
face diagonal ([section 5.4](/tutorial/waves/polarization/)). Water's spectrum [@Schulz2020] gives $2.4\times10^{-4}\unit{Pa\,s}$
near 8 THz, a third of its steady $6.9\times10^{-4}\unit{Pa\,s}$.

Even a perfect crystal glows, through pairs of phonons, whose classical weight is $2\matter n\kB T$, with $\matter n$
here the atoms per cubic metre, which at 293 K is 0.40 GPa for silicon, 0.69 for copper and 1.43 for diamond, about a
gigapascal (section 10.3). Diamond, whose Debye temperature is 2200 K, holds at 293 K only 0.16 of its classical heat
capacity, so its quantum occupations matter
([section 10.2](/tutorial/glow/kirchhoff/#heat-capacity-says-how-a-bodys-energy-follows-its-temperature)).
Anharmonicity adds corrections of order one, an eighth of diamond's glow.[^anharmonic]

## Real materials glow at one to sixty per cent of the placeholder

The effective frictions of ordinary materials run from $0.12\times10^{-4}\unit{Pa\,s}$ (diamond, 1.2%) to at most
$5.9\times10^{-4}$ (iron, 59%), so $10^{-3}\unit{Pa\,s}$ is an upper estimate and $10^{-4}\unit{Pa\,s}$ is typical. For
a constant friction the power per volume is $P/V = 4\alpha\sigma_{\rm SB}T^4$, with $\sigma_{\rm SB}$ the
Stefan–Boltzmann constant, which is 2.08 in units of $10^{-35}\unit{W\,m^{-3}}$ for each $10^{-4}\unit{Pa\,s}$
(section 10.1), so each row's power is 2.08 times its effective friction, to the rounding. Each row is a weight at a
place ([section 10.3](/tutorial/glow/why-matter-barely-glows/#each-material-of-the-table-is-a-weight-at-a-place)).[^table]

{{paper fig:materials}}

In panel (a) of Figure [](/paper/#fig:materials) the shaded band, where $B_\omega$ exceeds a tenth of its peak, is $0.420 < x < 8.30$, or 2.57 to 50.7 THz,
and the steps are where pair bands end, at twice the Debye frequency. Panel (b) draws each $4\pi\alpha B_\omega$.

Metals and water glow redder than a constant friction: their mean graviton energies, 1.4, 1.5 and $1.7\,\kB T$, lie
below its $2.70\,\kB T$. Iron's ceiling gives $2\zeta(3)/(\pi^2/6) = 1.46\,\kB T$, and diamond's line
in the Wien tail alone gives $6.5\,\kB T$, or the table's 6.4 with its pairs. A collision rate in proportion to $T$
[@Duthil2014] makes a metal's friction at the peak fall as $1/T$, so its count grows as $T^2$, not $T^3$.

Each row rests on a model of where a material's weight sits, and four of the models can err in known ways. We take
them in turn and ask what each does to the glow; the bound of the next section caps every upward change, since no
arrangement of a weight sends more than its bound.[^caveats]

**Copper's collisions.** Drude's form gives the electrons one collision time at every frequency. Once $\hbar\omega$
exceeds the energy of the lattice's vibrations, about $\kB\Theta_D$ with $\Theta_D$ the Debye temperature, 343 K for
copper, an electron can also make a phonon as it collides, so collisions at the glow's frequencies come more often than
those that set the resistivity. At $\omega\tau$ above one a shorter collision time raises the friction
$\Delta\matter\mu\,\tau/(1 + \omega^2\tau^2)$: at the energy peak, where $\omega\tau = 2.7$, halving $\tau$ multiplies
it by $\tfrac12(1 + 2.7^2)/(1 + 1.35^2) = 1.47$. Over the whole band, where the low frequencies lose what the high ones
gain, the electrons' effective friction rises from $1.28$ to $1.52\times10^{-4}\unit{Pa\,s}$, by 19%, and doubling $\tau$
instead lowers it by 31%. No collision time can lift it past the ceiling of its 38.2 GPa,
$1.84\times10^{-4}\unit{Pa\,s}$ by the formula for iron's ceiling above, 44% over the estimate.

**The pairs.** Debye's spectrum smooths the peaks of the real density of pairs of phonons, but the pairs' weight is
fixed by the sum rule, so only where it sits can change. The Debye bands of copper, iron and silicon send 77 to 91% of
what their weights could send at the best frequency, so no rearrangement raises them by more than $1/0.77 = 1.3$
times; they make 4%, 1% and 2% of those materials' glow, which then moves by 1% or less. Diamond's band ends at $x =
15$, deep in the Wien tail, and sends only 4% of its bound, so its real peaks matter more; the pairs make an eighth of
diamond's glow, and a change of their share by a factor of two moves the row by 13%.

**The glass.** Its weight, 37.2 GPa, is the stiffness that relaxes when a simulated silica glass is strained along one
axis [@Leonforte2006], taken here to relax the same way under shear. The glow is in proportion to the weight, so an
error in it passes into the row unchanged. The spread matters less: a flat band below 27 THz sends 69% of the bound of
its weight, so no other spread raises it by more than $1/0.69 = 1.45$ times.

**Water.** Its spectrum is that of a classical simulation of rigid molecules [@Schulz2020]. The response of a harmonic
motion to a force is the same in quantum mechanics as in classical mechanics, the response function of
[section 4.1](/tutorial/response/oscillator/#a-steady-push-gets-a-steady-answer-the-response-function-times-the-push)
with no $\hbar$ in it, so a classical simulation errs only through motions that are not harmonic, chiefly those of
the light protons. Rigid molecules also leave out the bending and the stretching of each molecule, at 1595 and about 3400 cm⁻¹, where $x =
7.8$ and 16.7 at 293 K and a weight sends 13% and 0.02% of what it would send at the peak: a gigapascal at the bend
would add 2% to water's glow. Water sends 39% of the bound of its whole weight, 15.3 GPa, so no rearrangement could
raise it by more than 2.6 times.

So the shapes of the spectra move the rows by tens of per cent at most, the pairs and the missing vibrations by a few
per cent, and the largest uncertainty is in the weights that the simulations of glass and water give. We take the
table to hold to about a factor of two.

Two predictions follow from the same reasoning. **Quartz, and with it most rock, should glow like the glass.** A
uniform shear drives a vibration when it pushes the atoms of a cell against one another, and it does so whenever an
atom does not sit at a centre of symmetry, as in silicon
([section 10.3](/tutorial/glow/why-matter-barely-glows/#a-crystal-with-two-atoms-in-its-cell-rings-at-its-raman-line-when-sheared)). Quartz has nine atoms in its cell, none of them
at a centre of symmetry, and its 24 optical vibrations reach about $1200\unit{cm^{-1}}$, 36 THz; a shear drives many of
them, spreading a weight of the order of the shear stiffness over the band, as disorder does in the glass
[@Damart2017]. Most rock is made of silicate minerals with large cells of the same kind, so a block of granite should
glow at about the glass's $4.8\times10^{-35}\unit{W\,m^{-3}}$ at 293 K, within the factor of two.
**Soft tissue should glow like water.** It is about three quarters water by mass, so its friction at the frequencies
of heat is mostly water's, and a person glows as the 70 litres of water of section 5.5.

## No material can glow brighter than its weight allows

The friction is positive and its integral is fixed, so a weight emits the most when it all sits where the Planck
spectrum peaks. With $\sym{graviton-rate}{\dot N}$ the gravitons sent per second in all directions,

$$\begin{gathered}
\frac{P}{V} \le 11.37\,\frac{G\,\Delta\matter\mu\,(\kB T)^3}{\hbar^2c^5},\\
\frac{\dot N}{V} \le 5.18\,\frac{G\,\Delta\matter\mu\,(\kB T)^2}{\hbar^2c^5},
\end{gathered}$$

the constants being eight times the largest values of $x^3/(e^x - 1)$, 1.4214 at $x = 2.821$, and of $x^2/(e^x - 1)$,
0.6476 at $x = 1.594$
([section 10.3](/tutorial/glow/why-matter-barely-glows/#no-material-can-glow-brighter-than-its-weight-allows)).[^bound]
At 293 K, 30 GPa radiates at most $5.6\times10^{-35}\unit{W\,m^{-3}}$. Silicon's line reaches 98.5% of its own weight's
bound, a little under the 98.8% of a weight placed exactly at its $x = 2.55$, because the line has a width. Copper
reaches 38% and water 39% of theirs.[^shares]

The optical depth of a path of length $L$, integrated over frequency, is $8\pi^2GL\,\Delta\matter\mu/c^3$: for a metre of
30 GPa, $5.9\times10^{-24}\unit{s^{-1}}$. To glow as brightly as the placeholder, a material needs 112 GPa at 293 K and
2.09 TPa at 5500 K, and 1.70 TPa to send as many gravitons then; only the terapascals are several times diamond's
shear stiffness, 536 GPa. Counted gravitons measure only the friction times a power of the temperature, so temperature
cannot be read from the glow alone
([section 5.5](/tutorial/waves/radiance/#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature)).

::: try {#planck-spectrum}
Planck's law at a temperature you choose, with readouts of the peak, $\sigma_{\rm SB}T^4$ and the count. Predict first:
when the temperature doubles, how far does the peak move, and by what factors do $\sigma_{\rm SB}T^4$ and the count
grow? Choose *A room* (293 K) and double it. Then predict the temperature at which the energy peak falls on silicon's
line at 15.6 THz, where a narrow line reaches its bound, and find it with the slider.
:::

## Ordinary bodies glow through their volume, not their surface

A body without friction absorbs only at its surface, where a wave launches sound [@Dyson1969]. For a sphere below its
Debye temperature the glow grows as $R^2T^2$ [@DehnenRomeroSchaefer1984], and with the coefficient derived in section
[10.3](/tutorial/glow/why-matter-barely-glows/) it is

$$P_S = 4\pi R^2\,\frac{16\pi}{15}\Bigl(1 + \frac{2c_T}{3c_L}\Bigr)
\frac{G\matter\rho\,c_T^3\,(\kB T)^2}{\hbar c^5} ,$$

the surface power $\sym{surface-power}{P_S}$ in watts, with $\sym{shear-speed}{c_T}$ and
$\sym{compressional-speed}{c_L}$ the speeds of the two kinds of sound and $\sym{density}{\matter\rho}$ the density. Its
inside cannot absorb, because a wave shears a body all at once and so cannot make one phonon
([section 10.3](/tutorial/glow/why-matter-barely-glows/#a-wave-shears-a-body-all-at-once-so-it-cannot-make-one-phonon)).
Inside, sound of quality factor $Q$ has the friction $\matter\rho c_T^2/\omega Q$ (section 4.4), and the volume's glow
$\sym{volume-power}{P_V} = V\,32\zeta(3)\,G\matter\rho c_T^2(\kB T)^3/\pi c^5Q\hbar^2$ gives

$$\frac{P_V}{P_S} =\frac{10\,\zeta(3)}{\pi^2\,(1 + 2c_T/3c_L)}\,\frac{R}{\ell_s} ,$$

with $\sym{phonon-path}{\ell_s} = Q\hbar c_T/\kB T$ the distance a thermal phonon travels before it is damped
([section 10.3](/tutorial/glow/why-matter-barely-glows/#ordinary-bodies-glow-through-their-volume-not-their-surface)).[^volume]
For steel, with $c_T = 3200$ and $c_L = 5900\unit{m\,s^{-1}}$, the prefactor is 0.89, and at $Q = 10$, $\ell_s =
0.83$ nm. A steel ball of radius 10 cm and density $7800\unit{kg\,m^{-3}}$ at 293 K glows $6.3\times10^{-46}$ W from
its surface and $1.1\times10^8$ times more from its volume. With the table's glow per volume, the two glows of
diamond, the faintest material, are equal in a sphere of radius 165 nm.[^thirty] A cold pure crystal glows in proportion
to $T^2$ rather than $T^3$, as the powers of $\kB T$ in the two formulas show.

## The closed furnace, from the friction of iron to a count of gravitons

{{paper fig:closed-furnace}}

::: try {#scene-closed-furnace}
The two furnaces, with the iron at 293 K and 1500 K, in light on one side of a divider and in the thermal glow on the
other. Predict first: in the glow, will the cold block show through its steel at all, and will each steel box hide what
lies behind it or add to it? Then drag the divider to the left and compare the two blocks.
:::

The two furnaces weigh the same to within the mass of their heat, $\Delta U/c^2 = 1.11\times10^{-11}$ kg per megajoule,
so that heating a kilogram of iron from 293 K to 1500 K, which takes 0.82 MJ, adds $9.1\times10^{-12}$ kg
([section 6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-mass-is-its-total-energy-so-heat-has-weight))
[@Tolman1930]. Yet the hot one sends many more gravitons. A friction the same at every temperature would make the
count grow as $T^3$, and $(1500/293)^3 = 134$ ([section
10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)); a metal's
friction at the glow's peak falls as $1/T$, so its count grows as $T^2$: $(1500/293)^2 = 26.2$.

The camera is 1.5 m above the floor. Each furnace is a steel box 0.9 m wide and deep and 1.0 m tall, with walls 5 cm
thick, standing on the floor 3.5 m in front of the camera and 1.1 m to one side. It holds a block of iron
$0.5\times0.4\times0.5$ m, a tenth of a cubic metre, whose middle is 0.3 m above the floor, and the floor is a slab of
concrete 0.3 m thick.

**The friction.** Each material has a **count-equivalent friction** $\sym{count-friction}{\matter\eta_N}$, in pascal
seconds: the constant friction that would send as many gravitons as the material's real spectrum. A count adds up
$\mathrm{Re}\,\matter\eta\,\omega^2\bar n$ over frequency, where a power adds up $\mathrm{Re}\,\matter\eta\,\omega^3\bar n$.
So for iron's ceiling, with 121 GPa, the integrals of $x/(e^x - 1)$, $\pi^2/6$, and of $x^2/(e^x - 1)$, $2\zeta(3)$, give

$$\matter\eta_N = \frac{\hbar\,\Delta\matter\mu}{2\kB T}\cdot\frac{\pi^2/6}{2\zeta(3)} =
1.08\times10^{-3}\unit{Pa\,s}$$

at 293 K. Iron's phonon pairs add 0.7%, which makes $1.09\times10^{-3}\unit{Pa\,s}$.[^count] The hot block has
$293/1500$ of it, $2.13\times10^{-4}\unit{Pa\,s}$, because a metal's friction falls as $1/T$. The steel has the cold
iron's friction, and the concrete silica glass's: 37.2 GPa spread below 27 THz gives $(\pi/2)\Delta\matter\mu/\Delta\omega =
3.44\times10^{-4}\unit{Pa\,s}$ up to $x = 4.42$, which holds 85% of the count's integral $2\zeta(3)$, so
$\matter\eta_N = 2.92\times10^{-4}\unit{Pa\,s}$.

**The glow.** The number emissivity is $j_N = 16G\matter\eta_N\sigma_{\rm SB}T^3/(2.70\,\kB c^3)$ (section 5.5, with the
mean energy $2.70\,\kB T$ of section 10.1). It gives the cold iron and the steel $1.65\times10^{-15}$, the hot iron
$4.33\times10^{-14}$, 26.2 times more, and the concrete $4.43\times10^{-16}$ gravitons $\mathrm{s^{-1}\,m^{-3}\,sr^{-1}}$.

**The line.** The line of sight to a block's middle drops 1.2 m over 3.5 m forward and 1.1 m sideways, so it
reaches the middle after $\sqrt{3.5^2 + 1.1^2 + 1.2^2} = 3.86$ m and runs 1.10 m for each metre of depth. It crosses
$2\times0.05\times1.10 = 0.110$ m of steel in the box's front and back walls and $0.5\times1.10 = 0.551$ m of iron. It
meets the floor where it has dropped 1.5 m, at 1.25 times that distance, and leaves the slab 0.3 m lower, at 1.5
times, after $0.25\times3.86 = 0.965$ m of concrete. The air does not glow. Adding $j_N\ell_k$ over the bodies, the lines read, in gravitons $\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$,

$$\begin{aligned}
\text{cold:}&\quad 1.65\times10^{-15}\times0.661 + 4.43\times10^{-16}\times0.965 = 1.52\times10^{-15},\\
\text{hot:}&\quad 1.65\times10^{-15}\times0.110 + 4.33\times10^{-14}\times0.551\\
&\qquad + 4.43\times10^{-16}\times0.965 = 2.45\times10^{-14}.
\end{aligned}$$

Their ratio is 16.1, and without the floor 22.0. The **common glow**, the walls' and the floor's share that both lines
receive, is $\sym{common-glow}{g} = 0.67$ of the cold block's; it brings the 26-fold count down to sixteen.

**How faint.** The hot block sends $4\pi j_N\times0.1\unit{m^3} = 5.4\times10^{-14}$ gravitons a second, one every
580,000 years, and a square metre at 3.86 m catches one every $1.1\times10^8$ years.

**The idea to keep: matter glows its friction at the frequencies of heat times a black body, and causality caps that
friction, so real materials glow at one to sixty per cent of the placeholder, through any wall.**

::: problems
### Practice

**[R10]** Rerun the closed furnace with the hot block at 1000 K, its friction still falling as $1/T$: its count against
the cold block's, and the ratio of the two lines, with and without the floor.

::: solution
The block's count grows as $T^2$: $(1000/293)^2 = 11.6$. The hot line reads $1.8\times10^{-16} + 11.6\times9.1\times
10^{-16} + 4.3\times10^{-16} = 1.12\times10^{-14}$, so the ratio is 7.4 with the floor and 9.9 without it.
:::

**[R10]** At the count's peak copper has $\omega\tau = 1.5$. By what factor does halving its collision time multiply
its friction there, and why so little?

::: solution
$\tfrac12(1 + 1.5^2)/(1 + 0.75^2) = 1.04$. The friction $\Delta\matter\mu\,\tau/(1 + \omega^2\tau^2)$ is largest at
$\omega\tau = 1$, so near there it hardly depends on $\tau$.
:::

**[R10]** A cubic metre of granite at 293 K glows like the glass, with the count-equivalent friction of the furnace's
concrete. How many gravitons does it send a second?

::: solution
Its $j_N$ is the concrete's, $4.43\times10^{-16}$, so it sends $4\pi j_N = 5.6\times10^{-15}$ a second, one every
$5.7\times10^6$ years.
:::

### Stretch

**[R10]** What fraction of the gravitons that its weight of 121 GPa allows does the hot iron send at 1500 K?

::: solution
The bound is $\dot N/V \le 5.18\,G\Delta\matter\mu(\kB T)^2/\hbar^2c^5 = 6.7\times10^{-13}\unit{s^{-1}\,m^{-3}}$ at
1500 K, and the block sends $4\pi j_N = 5.4\times10^{-13}$, or 81%. The ceiling's count is $(4\pi/3)\,G\Delta\matter\mu(\kB T)^2/\hbar^2c^5$, so the fraction is $4.19/5.18$ at every temperature.
:::

**[R10]** At what temperature would water's bending vibration, at 1595 cm⁻¹, sit at the peak of the glow, and what
share of its peak glow would a weight there send at body temperature?

::: solution
The peak is at $x = 2.821$, and $hc\tilde\nu/\kB = 1.4388\unit{cm\,K}\times1595\unit{cm^{-1}} = 2295$ K, so $T =
2295/2.821 = 814$ K. At 310 K, $x = 7.40$ and $x^3/(e^x - 1) = 0.247$, which is 17% of the peak value 1.4214.
:::

### The camera

**[R10]** Reproduce the steel ball's prefactor, phonon path, surface glow and ratio $P_V/P_S$.

::: solution
$10\zeta(3)/[\pi^2(1 + 2c_T/3c_L)] = 0.89$ with $\zeta(3) = 1.202$. At 293 K and $Q = 10$, $\ell_s = 0.83$ nm. For
$R = 0.1$ m and $\matter\rho = 7800\unit{kg\,m^{-3}}$ the surface glow is $6.3\times10^{-46}$ W, and $P_V/P_S =
0.89\times0.1/0.83\times10^{-9} = 1.1\times10^8$.
:::
:::

::: paper
- [*Absorption*](/paper/#par:absorption) and [*Emission*](/paper/#par:emission): [](/paper/#eq:damped),
  [](/paper/#eq:alpha) and [](/paper/#eq:kirchhoff), Figures [](/paper/#fig:line-integral) and
  [](/paper/#fig:closed-furnace).
- [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat): [](/paper/#eq:maxwell) and
  [](/paper/#eq:friction-sum), Table [](/paper/#tab:materials) and Figure [](/paper/#fig:materials).
- [*A bound on the glow*](/paper/#par:a-bound-on-the-glow) and [*Volume and surface
  emission*](/paper/#par:volume-and-surface-emission): [](/paper/#eq:glow-bound), [](/paper/#eq:surface-glow) and
  [](/paper/#eq:volume-surface).
:::

::: deeper
- S. W. Hawking, *Astrophysical Journal* 145 (1966) 544: the absorption of gravitational waves by viscosity.
- W. Dehnen, F. B. Romero and G. Schäfer, *Classical and Quantum Gravity* 1 (1984) 305: the surface glow.
:::

[^sixth]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. VI](/paper/#sec:thermal).

[^hawking]: Hawking (1966). In *The gravitational camera* (Mohsenvand 2026) the equations are [](/paper/#eq:damped)
    and [](/paper/#eq:alpha), in [*Absorption*](/paper/#par:absorption), and [](/paper/#eq:kirchhoff), in
    [*Emission*](/paper/#par:emission).

[^plasma]: For plasmas see [@GhiglieriLaine2015; @GarciaCelyRingwald2025].

[^person]: At 293 K the same 70 litres give $7.80\times10^{-37}$ W.

[^column]: Section 5.5 derives the sum; it is equation [](/paper/#eq:column) of *The gravitational camera* (Mohsenvand
    2026), Sec. IX.

[^sum]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equations [](/paper/#eq:maxwell) and
    [](/paper/#eq:friction-sum), in [*Friction at the frequencies of
    heat*](/paper/#par:friction-at-the-frequencies-of-heat).

[^anharmonic]: Sec. VI of *The gravitational camera* (Mohsenvand 2026) also gives Akhiezer's tail.

[^table]: Table [](/paper/#tab:materials) of *The gravitational camera* (Mohsenvand 2026) lists each material's
    $\matter\eta_{\rm eff}$, its $P/V$ and its mean graviton energy.

[^caveats]: These caveats and the two predictions are those of *The gravitational camera* (Mohsenvand 2026), in
    [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat).

[^bound]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equation [](/paper/#eq:glow-bound), in
    [*A bound on the glow*](/paper/#par:a-bound-on-the-glow).

[^shares]: Integrating to every frequency gives 38.2% and 39.1%.

[^volume]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equations [](/paper/#eq:surface-glow)
    and [](/paper/#eq:volume-surface), in [*Volume and surface
    emission*](/paper/#par:volume-and-surface-emission), where the coefficient is derived from the traction at the
    surface and Kirchhoff's law, as in section 10.3. The $R^2T^2$ law is from [@DehnenRomeroSchaefer1984], whose sum
    over the modes gives a coefficient six times smaller for steel, $(\pi^2/24)(1 + 3c_T/2c_L)$.

[^thirty]: With diamond's own sound speeds, $c_T = 12.35$ and $c_L = 18.15\unit{km\,s^{-1}}$.

[^count]: It is almost twice the effective friction, $5.9\times10^{-4}\unit{Pa\,s}$, because a friction that falls as
    $1/\omega$ is largest at low frequencies, where gravitons are many and cheap.
