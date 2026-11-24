---
id: '10.2'
title: "Kirchhoff's law and detailed balance; entropy and heat capacity"
question: 'Section VI says that "a medium that absorbs must also emit", and that in Kirchhoff''s law "$\alpha$ is the net absorption coefficient, absorption less stimulated emission, and $j_\omega$ the spontaneous emission". Chapter 5.5 proved the law only inside a closed box at one temperature. Why does it hold for a hot block in a cold room, what does a glow carry besides its energy, and how does a body''s temperature respond to the heat it gains or loses?'
part: '10'
requires: ['4.2', '4.6', '5.5', '7.7', '7.8', '8.3', '8.7', '10.1']
paper: [sec:thermal, eq:kirchhoff, eq:alpha, fig:closed-furnace, fig:materials, sec:first-image, eq:column, sec:no-lens, sec:vistas, eq:graviton-temperature]
figures: [fig:closed-furnace, fig:materials]
live: [detailed-balance]
depth: A
---

<!-- hero: Part 10's hero, the closed furnace cut open (P6a-DECISIONS item 6), is made after the part's chapters. -->

**What you need:** chapter [10.1](/tutorial/glow/black-body/)'s Planck law and occupation $n_\omega$, chapter
[5.5](/tutorial/waves/radiance/)'s equation of transfer, chapter [8.3](/tutorial/quantum/quanta/)'s ladder of quanta,
chapter [8.7](/tutorial/quantum/quantum-fluctuation/)'s two orders of a correlation, and, for one section, chapters
[4.6](/tutorial/response/fluctuation-dissipation/), [7.7](/tutorial/geometry/quadrupole-formula/) and
[7.8](/tutorial/geometry/wave-energy/). Chapters [3.8](/tutorial/noise/bits/) and
[8.5](/tutorial/quantum/counting-quanta/) are recalled.

Two closed steel furnaces stand in a room at 293 K. Each holds an identical block of iron, one at 293 K and the other
at 1500 K. The paper computes the hot block's glow from Kirchhoff's law at the block's own temperature, as if the block
sat in a closed box at 1500 K. It does not. At the block's brightest frequency, 88 THz, such a box would hold 0.063
gravitons in each mode, while the gravitational radiation in the room holds less than $10^{-30}$.

{{paper fig:closed-furnace}}

Why does Kirchhoff's law hold for a hot block in a cold room, what does a glow carry besides its energy, and how does a
body's temperature respond to the heat it gains or loses? The answer lets the paper compute every glow from the
temperature of the matter alone. It also gives the glow's entropy, which sets the cooling of the graviton sky, and the
heat capacities of diamond and of Section VII's black hole.

::: plain
Matter takes quanta from a passing wave in proportion to the number the wave already holds. It gives quanta in
proportion to one more than that number. The extra one is emission that happens on its own, even into an empty wave.
The rest is emission that the passing wave provokes, and it cancels part of the absorption.

So the glow that matter gives on its own depends only on how its atoms are shared among their energies, and its
temperature fixes that. The radiation around it changes only how much the matter absorbs. The glow divided by the
absorption is then the brightness of a closed box at the matter's temperature. The random jiggling of the stress
inside warm matter gives the same law.

A glow also carries entropy, a measure of how many ways its energy can be shared. A box of glow that is widened slowly
stays a glow of the same kind, only cooler. A body can rest in balance with its surroundings only if heating it raises
its temperature.
:::

## Chapter 5.5's argument needed a closed box

Chapter
[5.5](/tutorial/waves/radiance/#a-warm-bodys-glow-over-its-absorption-is-the-radiance-of-an-enclosure-at-its-temperature)
proved Kirchhoff's law inside a closed box at one temperature $\sym{temperature}{T}$, in kelvin. There the radiation
settles at chapter
[10.1](/tutorial/glow/black-body/#each-mode-holds-the-thermal-quanta-of-an-oscillator-and-the-product-is-plancks-law)'s
Planck radiance $\sym{planck-radiance}{B_\omega(T)}$, so along a ray through matter at $T$ the radiance cannot change.
The equation of transfer then needs the **emissivity** $\sym{emissivity}{j_\omega}$, the power the matter sends out per
cubic metre, per steradian and per unit of angular frequency, to equal the absorption coefficient
$\sym{absorption-coefficient}{\alpha}$, in $\mathrm{m^{-1}}$, times $B_\omega$. The argument assumes **radiation in
equilibrium with the matter**.

In gravity this never happens: a wave that crosses the whole Earth loses only about $10^{-30}$ of its energy (chapter
5.5). We want the law for matter at a temperature $T$ in radiation of any kind, so we count the quanta that the matter
takes from one mode of the radiation and gives to it.

## Matter absorbs in proportion to the quanta present and emits in proportion to one more

Let the mode have the angular frequency $\omega$, in radians per second, and travel along the ray. Its **occupation**
$\sym{mode-occupation}{n_\omega}$ is the mean number of quanta it holds, in any state, as in chapter
[10.1](/tutorial/glow/black-body/#a-moving-observer-still-sees-a-black-body-hotter-ahead); the thermal value is
$\sym{occupation}{\bar n} = 1/(e^x - 1)$, with $\sym{planck-ratio}{x} = \hbar\omega/\kB T$.

We assume that **the matter has a lower and an upper level of energy, $\hbar\omega$ apart**, one pair of chapter
8.7's levels. Their **populations** $\sym{level-populations}{P_l}$ and $P_u$ are the fractions of the matter found in
each, pure numbers. The coupling is a quantity $y$ of the matter, such as its stress, times the mode's amplitude,
which chapter 8.3 wrote as $x_{\rm zp}(a + a^\dagger)$. We assume that **the coupling is weak**, so that the chance per
second of a jump is in proportion to the square of the coupling's entry between the two states.[^golden]

**The ladder.** When the matter rises from $l$ to $u$, the mode loses a quantum, so the mode's part of the entry comes
from chapter [8.3](/tutorial/quantum/quanta/#the-oscillators-energy-factorizes-into-two-ladder-operators)'s lowering
operator $a$. When the matter falls, the mode gains one, through the raising operator $a^\dagger$. Their squared
entries are

$$|\langle n - 1|a|n\rangle|^2 = n , \qquad |\langle n + 1|a^\dagger|n\rangle|^2 = n + 1 .$$

The matter's part is its entry $y_{ul}$ for the rise and $y_{lu}$ for the fall, which have the same size by 8.7's
$|y_{mn}| = |y_{nm}|$, so one constant serves both directions. The occupation gains at the rate of falls and loses at
the rate of rises. These rates are per second; the quanta travel at $c$, so $\dd s = c\,\dd t$, and dividing by $c$
makes them rates per metre of the ray. Averaged over the mode's states, the occupation changes as

$$\frac{\dd n_\omega}{\dd s} = \kappa P_u\,(n_\omega + 1) - \kappa P_l\,n_\omega .$$

Here $s$ is 5.5's distance along the ray, in metres,[^s] and $\sym{coupling-per-metre}{\kappa}$, in
$\mathrm{m^{-1}}$, is the chance per metre that a quantum is absorbed by matter that is all in its lower level.

**The two coefficients.** Chapter
[10.1](/tutorial/glow/black-body/#a-moving-observer-still-sees-a-black-body-hotter-ahead) found that a radiance is
$I_\omega = (\hbar\omega^3/4\pi^3c^2)\,n_\omega$. We multiply the equation by this factor:

$$\frac{\dd I_\omega}{\dd s} = \kappa P_u\,\frac{\hbar\omega^3}{4\pi^3c^2} - \kappa\,(P_l - P_u)\,I_\omega .$$

This is chapter
[5.5](/tutorial/waves/radiance/#along-a-ray-matter-adds-its-glow-and-takes-a-share-of-what-passes)'s equation of
transfer, $\dd I_\omega/\dd s = j_\omega - \alpha I_\omega$, with

$$\alpha = \kappa\,(P_l - P_u) , \qquad j_\omega = \kappa P_u\,\frac{\hbar\omega^3}{4\pi^3c^2} .$$

The upper level's emission has two parts. The part in proportion to $n_\omega$ is **stimulated emission**: the passing
radiation causes it, it adds quanta to the same mode, and it cancels the share $P_u/P_l$ of the absorption. The part
that remains in an empty mode, the 1 of $n_\omega + 1$, is **spontaneous emission**. So $\alpha$ is the **net
absorption coefficient**, absorption less stimulated emission, and $j_\omega$ is the spontaneous emission, as the paper
says (Figure [](#fig:balance-rates)).

![Look first at the dashed arrows: they are the only pair that does not need quanta already in the mode. The other two
pairs both grow with $n_\omega$, and their difference is the net absorption. The levels are
schematic.](tut-balance-rates){#fig:balance-rates}

**Temperature.** We assume that **the matter is at the temperature $T$**, so that its populations have chapter
[4.2](/tutorial/response/temperature/#the-chance-of-a-state-falls-exponentially-with-its-energy)'s Boltzmann ratio
$P_u/P_l = e^{-x}$. Dividing above and below by $P_l$, $P_u/(P_l - P_u) = e^{-x}/(1 - e^{-x}) = 1/(e^x - 1) =
\bar n$, and

$$\boxed{\frac{j_\omega}{\alpha} = \frac{\hbar\omega^3}{4\pi^3c^2}\,\frac{1}{e^{\hbar\omega/\kB T} - 1} = B_\omega(T)}
,$$

Planck's law. This is the paper's

{{paper eq:kirchhoff}}

The occupation $n_\omega$ has cancelled, and so has $\kappa$. The law holds whatever radiation surrounds the matter,
in a box or in a cold room, which closes the gap that chapter 5.5 left open.

**Detailed balance.** When the radiation is itself thermal, $n_\omega = \bar n$, the absorption $\kappa P_l\bar n$
equals the whole emission $\kappa P_u(\bar n + 1)$, because $\bar n/(\bar n + 1) = e^{-x} = P_u/P_l$. Each absorption
is then matched by an emission, which is chapter
[8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-body-can-take-energy-from-a-push-but-has-none-to-give)'s **detailed
balance**, $S_{yy}(-\omega) = e^{-x}S_{yy}(\omega)$, for one pair of levels.

**Numbers.** At chapter
[10.1](/tutorial/glow/black-body/#the-energy-of-the-glow-peaks-at-2.82-thermal-energies-and-the-count-at-1.59)'s
energy peak, $x = 2.821$, stimulated emission cancels $e^{-2.821} = 6.0\%$ of the absorption, and $j_\omega/\alpha$ is
$\bar n = 0.063$ in units of $\hbar\omega^3/4\pi^3c^2$. **Limits.** As $T \to 0$, $P_u \to 0$: the matter absorbs
fully and emits nothing. If the upper level held more than the lower, $P_u > P_l$, then $\alpha$ would be negative and
the matter would amplify a passing wave. Such an **inverted population** is how a **maser** works.[^maser]

**Many levels.** A real body has very many pairs of levels $\hbar\omega$ apart. Each pair keeps the same balance with
the same $e^{-x}$, so the whole body does too. We state without proof that the summed $\kappa(P_l - P_u)$ is chapter
7.8's $\alpha = 16\pi G\,\mathrm{Re}\,\sym{dynamic-viscosity}{\matter\eta}(\omega)/c^3$, the paper's
[](/paper/#eq:alpha), as 8.7's many close lines merge into chapter [4.4](/tutorial/response/viscosity/)'s friction.

**Meaning.** Warm matter decides its own glow, and the radiation around it decides only how much the matter absorbs.
So panel (b) of the paper's Figure [](/paper/#fig:materials) draws each material's glow as its absorption times
$B_\omega$ at 293 K.

{{paper fig:materials}}

::: history
### Einstein's coefficients

In 1916 and 1917 Albert Einstein derived Planck's law from this balance, in "Zur Quantentheorie der Strahlung"
(*Physikalische Zeitschrift* 18, 1917). He needed stimulated emission to make it work, and so predicted it. His letters
$A$ for spontaneous emission and $B$ for absorption and stimulated emission are still in use. James Gordon, Herbert
Zeiger and Charles Townes built the first maser, with ammonia, in 1954.
:::

## What a pixel receives holds far less than one quantum per mode

We want the occupation of the glow that reaches a pixel, which the paper's Section IX needs. Since $\kappa P_u =
\alpha\bar n$, the equation of the last section is

$$\frac{\dd n_\omega}{\dd s} = \alpha\,\bigl[\bar n(T) - n_\omega\bigr] .$$

The **optical depth** of a stretch of the ray is $\sym{optical-depth}{\tau} = \int\alpha\,\dd s$ along it, a pure
number (chapter [5.5](/tutorial/waves/radiance/#along-a-ray-matter-adds-its-glow-and-takes-a-share-of-what-passes)).
Over a few optical depths the occupation relaxes to the matter's own $\bar n(T)$, from above or below (Figure
[](#fig:balance-ray)). In gravity every body's optical depth is tiny and nothing arrives from behind, so $n_\omega \ll
\bar n$ and we drop $\alpha n_\omega$. Integrating along the line of sight gives

$$\boxed{n_\omega = \sum_k\tau_k(\omega)\,\bar n(T_k)} ,$$

each body's optical depth times its own occupation. Multiplied by $\hbar\omega^3/4\pi^3c^2$, divided by $\hbar\omega$
and added over frequencies, this is the paper's [](/paper/#eq:column) (chapter
[5.5](/tutorial/waves/radiance/#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line)).

![Look first at the three curves meeting: whatever enters the slab, the occupation relaxes to the slab's own
$\bar n(T)$, so the slab's glow does not depend on the radiation around it. In gravity every body lives in the inset,
where the occupation is $\tau$ times $\bar n$. Curves exact.](tut-balance-ray){#fig:balance-ray}

**The Earth.** The paper's Earth is five uniform shells, the onion of chapter
[5.6](/tutorial/waves/abel-transform/#uniform-shells-are-peeled-from-the-outside-in), from the crust at 700 K to the
inner core at 5500 K. Their friction at the frequencies of heat is not known, so the paper gives each shell the
constant friction that sends the most gravitons its stiffness allows, by the paper's [](/paper/#eq:glow-bound)
(chapter 10.3): from $1.6\times10^{-4}$ Pa s in the outer core to $3.4\times10^{-4}$ Pa s in the lower
mantle.[^earth] This bounds the count of gravitons, not the friction, which could be larger at one frequency. A line
straight down crosses each shell twice and the inner core once. With $\tau_k = \alpha_kL_k$ for its path $L_k$
through shell $k$, the boxed sum gives $7.8\times10^{-31}$ at 30 THz and $1.4\times10^{-31}$ at 100 THz.

**Water.** A metre of water in a room gives $1.7\times10^{-39}$ at the count's peak, $x = 1.594$ or 9.7 THz, where
$\bar n = 0.255$. Water's friction there is $5.4\times10^{-5}$ Pa s, the constant friction that sends as much power as
its simulated spectrum (the paper's Table [](/paper/#tab:materials)); its everyday $10^{-3}$ Pa s belongs to slow flow
(chapter 4.4).

These are Section IX's "of order $10^{-30}$ gravitons" in each mode for the Earth, and a room's bodies hold far fewer.
Chapter R10b sets them beside chapter [8.6](/tutorial/quantum/quantum-limit/)'s half quantum of noise. **Meaning.** A
glow of matter is a black body diluted by its optical depth: its spectrum keeps the shape $\alpha B_\omega$, with
about $10^{30}$ times fewer quanta in each mode than in a closed box.

::: try {#detailed-balance}
A slab of two-level matter at one frequency, with a ray passing through it from the left. The Slab slider sets its
temperature and, past a stop at the top, inverts its populations; the Radiation entering slider sets the occupation
$n_\omega$ of the ray that comes in. Counters give the three rates per metre, the coefficients $\alpha$ and
$j_\omega$, and $j_\omega/\alpha$ beside $B_\omega(T)$, and a strip draws $n_\omega$ along the ray against the depth.

Predict first: if radiation far hotter than the slab comes in, do the slab's own glow $j_\omega$ and the ratio
$j_\omega/\alpha$ change? Move the Radiation entering slider up to find out. Then predict what happens to the ray when
the populations are inverted, and move the Slab slider past its stop.
:::

## The same law follows from the random stress inside warm matter

This sketch at depth B follows the second route that the paper names, "the thermal fluctuations of shear stress in a
viscous fluid", and the box at its end names what it skips.

**The stress jiggles.** Let $\sym{stress-energy-tensor}{\matter T}_{ij}$ be the stress inside warm matter, in pascals,
chapter 7.7's spatial stress; with indices it is always the stress, and a bare $T$ stays the temperature. Because the
atoms move at random (chapter [4.2](/tutorial/response/temperature/)), the shear part of the stress jiggles about
zero. Chapter
[4.6](/tutorial/response/fluctuation-dissipation/#the-theorem-holds-for-every-linear-body-at-every-frequency)'s
theorem, in the form Section VI uses, "$\mathrm{Re}\,\eta(\omega)$ is the spectrum of the material's stress", gives the
two-sided spectrum of each pair of components, per unit volume:

$$S_{ij,kl}(\omega) = 2\kB T\,\mathrm{Re}\,\matter\eta\;\sym{shear-noise-table}{\Delta_{ijkl}} , \qquad \Delta_{ijkl}
= \delta_{ik}\delta_{jl} + \delta_{il}\delta_{jk} - \tfrac23\delta_{ij}\delta_{kl} .$$

This is Landau and Lifshitz's **fluctuating stress** (stated). The table $\Delta$ spreads the friction over the shear
components and gives the trace nothing. Stresses at two points are independent, so the stress added over a volume has
the volume times this spectrum, in $\mathrm{Pa^2\,s\,m^3}$.

**Each volume radiates.** Chapter 7.7's far strain, squared in chapter 7.8's energy flux, turns this jiggling into
the classical emissivity

$$j_\omega = \frac{4G\,\mathrm{Re}\,\matter\eta\,\kB T\,\omega^2}{\pi^2c^5} ,$$

and the box below checks every factor. Chapter 7.8's $\alpha = 16\pi G\,\mathrm{Re}\,\matter\eta/c^3$ times chapter
[10.1](/tutorial/glow/black-body/#each-mode-holds-the-thermal-quanta-of-an-oscillator-and-the-product-is-plancks-law)'s
Rayleigh–Jeans radiance $\omega^2\kB T/4\pi^3c^2$ is the same. The classical stress gives Kirchhoff's law wherever
$\hbar\omega \ll \kB T$.

::: derivation
### The classical glow of the jiggling stress

**The power.** Chapter
[7.7](/tutorial/geometry/quadrupole-formula/#far-away-each-direction-reads-the-stress-at-one-wavevector)'s strain at
the distance $r$ is $\field h^{\rm TT}_{ij} = (4G/c^4r)\,\Lambda_{ij,kl}\int\matter T_{kl}\,\dd^3x$, with chapter
7.6's projector $\sym{tt-projector}{\Lambda_{ij,kl}}$ across the ray. Chapter
[7.8](/tutorial/geometry/wave-energy/#the-heat-comes-from-the-wave-so-the-wave-carries-energy)'s flux is
$c^3\langle\dot{\field h}^{\rm TT}_{ij}\dot{\field h}^{\rm TT}_{ij}\rangle/32\pi G$. Its square holds the projector
twice, and $\Lambda_{ij,kl}\Lambda_{ij,mn} = \Lambda_{kl,mn}$, because $\Lambda$ is unchanged when its two pairs of
indices swap and applying it twice is applying it once. The power per steradian is $r^2$ times the flux, so each cubic
metre sends

$$\frac{c^3}{32\pi G}\Bigl(\frac{4G}{c^4}\Bigr)^2\Lambda_{ij,kl}\langle\dot{\matter T}_{ij}\dot{\matter T}_{kl}\rangle
= \frac{G}{2\pi c^5}\,\Lambda_{ij,kl}\langle\dot{\matter T}_{ij}\dot{\matter T}_{kl}\rangle .$$

**The spectrum.** Each time derivative brings a factor $\omega$. A two-sided spectrum gives a mean square $\int
S\,\dd\omega/2\pi$ over all frequencies. For a classical stress the negative frequencies repeat the positive ones, so
we fold them in: per unit of positive $\omega$ the mean square is $2\omega^2S/2\pi = \omega^2S/\pi$.

**The contraction.** Chapter
[7.6](/tutorial/geometry/gravitational-waves/#one-projector-keeps-what-a-wave-can-carry)'s projector is
$\Lambda_{ij,kl} = \tfrac12(P_{ik}P_{jl} + P_{il}P_{jk}) - \tfrac12P_{ij}P_{kl}$, with $P_{ij} = \delta_{ij} -
\hat n_i\hat n_j$. The three terms of $\Delta_{ijkl}$ give $\Lambda_{ij,ij} = 2$, the number of polarizations;
$\Lambda_{ij,ji} = 2$, because $\Lambda$ is symmetric in $i$ and $j$; and $\Lambda_{ii,kk} = 0$, because $\Lambda$
removes traces. So $\Lambda_{ij,kl}\Delta_{ijkl} = 2 + 2 - 0 = 4$, and

$$j_\omega = \frac{G}{2\pi c^5}\,\omega^2\,\frac{2\kB T\,\mathrm{Re}\,\matter\eta}{\pi}\cdot4 = \frac{4G\,
\mathrm{Re}\,\matter\eta\,\kB T\,\omega^2}{\pi^2c^5} .$$
:::

**The quantum step.** At the frequencies of heat $\hbar\omega$ is close to $\kB T$, and 8.7's two orders of the stress
correlation differ. The matter gives energy to the field in the order of 8.7's negative frequencies, $S(-\omega)$,
which we call the **emission order**. A viscous stress is $\matter\eta$ times the rate of a shear strain (chapter
[4.4](/tutorial/response/viscosity/#viscosity-is-a-stress-that-answers-how-fast-a-shape-changes)), and the rate
brings a factor $-i\omega$. So for the stress added over a volume $V$, 8.7's $\mathrm{Im}\,\chi$ is $\omega V\,
\mathrm{Re}\,\matter\eta$, and 8.7's $S_{yy}(-\omega) = 2\hbar\bar n\,\mathrm{Im}\,\chi$ gives, per unit volume,

$$S_{ij,kl}(-\omega) = 2\hbar\omega\,\bar n\,\mathrm{Re}\,\matter\eta\;\Delta_{ijkl} ,$$

which tends to 4.6's $2\kB T\,\mathrm{Re}\,\matter\eta\,\Delta_{ijkl}$ when $\hbar\omega \ll \kB T$.

The rule, stated in the box below, is this: **in the folded classical result, the classical spectrum is replaced by
the emission order $S(-\omega)$.** The folding stays, because the two signs of frequency of a classical spectrum are
not two processes. A real stress that swings at $\omega$ holds both $e^{-i\omega t}$ and $e^{i\omega t}$, as
$\cos\omega t$ does, and together they make one wave sent out. Only the strength of that wave changes, so $\kB T$
becomes $\hbar\omega\bar n$ and

$$\boxed{j_\omega = \frac{4G\,\mathrm{Re}\,\matter\eta\;\hbar\omega^3\,\bar n}{\pi^2c^5} = \alpha\,B_\omega(T)}$$

exactly. Keeping only the emission half of the unfolded $\omega^2[S(\omega) + S(-\omega)]/2\pi$ would give
$\tfrac12\alpha B_\omega$. The difference of the two orders, $2\hbar\omega\,\mathrm{Re}\,\matter\eta$, is
proportional to the net absorption $\alpha$, and the emission order over it is $\bar n$, the populations' $P_u/(P_l -
P_u)$. So the friction that absorbs a wave is the same jiggling that sends one out.

**The wrong order.** A classical record shows 8.7's symmetrized spectrum, $\hbar\omega(2\bar n + 1)\,
\mathrm{Re}\,\matter\eta\,\Delta_{ijkl}$. Used here, it would give $\bar n + \tfrac12$ in place of $\bar n$, and a body
at absolute zero would glow with its zero point, which a cold body has no way to give away (8.7). So the paper takes
the stress in the "unsymmetrized (Wightman) order", the emission order. At 293 K the symmetrized order would overstate
the glow by $(\bar n + \tfrac12)/\bar n = 1.15$ at $\omega = 10^{13}\unit{s^{-1}}$ (1.6 THz), and 8.9 times at the
energy peak (Figure [](#fig:balance-orders)).

::: gap
This sketch takes three steps on trust. Landau and Lifshitz's spectrum of the stress is stated, not derived. Stresses
are independent beyond the size of a molecule, far below a wavelength, so the integral over the volume reads the stress
at zero wavenumber. The quantum rule is stated: it is the golden rule of this chapter's first derivation applied to the
stress, and it returns the classical result where $S(-\omega)$ tends to the classical spectrum. For a hot plasma the
same law is the known result that its gravitational glow is set by its shear viscosity [@GhiglieriLaine2015].
:::

![Look first at the dashed curve climbing: the symmetrized order keeps the zero point and grows without limit, while
the emission order dies away with Planck's $\bar n$. Only the solid curve gives Kirchhoff's law. Curves
exact.](tut-balance-orders){#fig:balance-orders}

## A glow carries entropy as well as energy

We want the disorder that a glow carries, measured with heat and temperature. The thermodynamic **entropy**
$\sym{thermodynamic-entropy}{S}$ of a body, in joules per kelvin, is defined by its changes: when the body, at the
temperature $T$, takes in a small heat $\dd Q$ slowly, its entropy grows by

$$\dd S = \frac{\dd Q}{T} .$$

It is measured by heating the body in small steps from near absolute zero and adding up $\dd Q/T$. The **second law of
thermodynamics** says that the total entropy of a closed system never falls.

**One mode.** A mode holds the energy $\hbar\omega\bar n$ above its zero point, so heating it slowly at a fixed
frequency gives $\dd Q = \hbar\omega\,\dd\bar n$, and $\dd S = \kB x\,\dd\bar n$. Since $\bar n = 1/(e^x - 1)$, $x =
\ln[(\bar n + 1)/\bar n]$, and the integral from $\bar n = 0$ is

$$\boxed{S_{\rm mode} = \kB\bigl[(\bar n + 1)\ln(\bar n + 1) - \bar n\ln\bar n\bigr]} ,$$

as differentiating checks. This is $\kB\ln2$ times chapter
[3.8](/tutorial/noise/bits/#a-bit-is-the-answer-to-one-yes-or-no-question)'s entropy in bits of 8.5's geometric counts
(the stretch problem), so one joule per kelvin is $1/\kB\ln2 = 1.04\times10^{23}$ bits. A mode at the count's peak,
$\bar n = 0.255$, carries 0.914 bits. The glow a pixel receives is not thermal, but a thermal field thinned in this way
keeps geometric counts (stated), so the formula holds with $n_\omega$ in place of $\bar n$. A mode of it, with
$n_\omega = 10^{-30}$, carries about $n_\omega\log_2(e/n_\omega) = 1.0\times10^{-28}$ bits.

**A black body.** From $\bar n + 1 = 1/(1 - e^{-x})$ and $\bar n = e^{-x}/(1 - e^{-x})$, $\ln(\bar n + 1) = -\ln(1 -
e^{-x})$ and $\ln\bar n = -x - \ln(1 - e^{-x})$, so the mode's entropy is

$$\begin{aligned}\frac{S_{\rm mode}}{\kB} &= -(\bar n + 1)\ln(1 - e^{-x}) + \bar n\,\bigl[x + \ln(1 - e^{-x})\bigr]\\
&= x\bar n - \ln(1 - e^{-x}) .\end{aligned}$$

We add chapter
[10.1](/tutorial/glow/black-body/#the-number-of-waves-that-fit-in-a-box-grows-as-the-square-of-their-frequency)'s
modes, $\omega^2/\pi^2c^3$ per cubic metre and per unit of $\omega$ for two polarizations. The first term is each
mode's energy over $\kB T$, so it gives $\mathcal U/T$, with 10.1's energy density
$\sym{radiation-energy-density}{\mathcal U}$. The second we integrate by parts, since $-\ln(1 - e^{-x})$ has the
derivative $-x\bar n/\omega$ and vanishes at both ends:

$$\int_0^\infty\omega^2\bigl[-\ln(1 - e^{-x})\bigr]\,\dd\omega = \frac13\int_0^\infty\omega^2\,x\bar n\,\dd\omega ,$$

a third of the first. So the entropy per cubic metre is

$$\boxed{\sym{entropy-density}{s} = \frac{4\,\mathcal U}{3T} = \frac{16\,\sigma_{\rm SB}T^3}{3c}} ,$$

in $\mathrm{J\,K^{-1}\,m^{-3}}$, with chapter
[10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)'s
Stefan–Boltzmann constant $\sym{stefan-boltzmann}{\sigma_{\rm SB}}$. **Check.** Heating a box of fixed volume from
absolute zero gives $\dd s = \dd\mathcal U/T = (16\sigma_{\rm SB}T^2/c)\,\dd T$, whose integral is the same.

**Numbers.** At 293 K, $s = 2.5\times10^{-8}\unit{J\,K^{-1}\,m^{-3}}$. **Meaning.** A glow is disorder as well as
energy: $3.60\,\kB$, or 5.2 bits, for each quantum of a black body, and almost none in each mode of the faint glow a
pixel receives.

## A slowly widened box keeps a black body, cooler

We want what slow stretching does to a black body, because the paper's graviton sky has been stretched in this way
since the early universe. Widen a closed box of black-body radiation slowly, from the side $L$ to $L'$, in metres. Each
mode's frequency falls as $1/L$, and a slow change keeps each mode's count of quanta. The area of a mode's orbit in
chapter [1.7](/tutorial/newton/hamilton/#hamiltons-equations-are-newtons-law-split-in-two)'s phase plane, $2\pi
E/\omega$, stays fixed when the change is slow compared with one swing (stated), so $E/\omega$ is an **adiabatic
invariant**. Chapter [8.3](/tutorial/quantum/quanta/#one-state-fills-an-area-2pihbar-of-phase-space)'s level $n$ fills
the area $2\pi\hbar(n + \tfrac12)$, so the count stays fixed too. A mode now at $\omega' = \omega L/L'$ therefore holds
the old $\bar n = 1/(e^{\hbar\omega/\kB T} - 1)$, which is $1/(e^{\hbar\omega'/\kB T'} - 1)$ with $T' = TL/L'$: a black
body again, cooler. Its volume $V = L^3$ times $T^3$, and with it the entropy $sV$, is unchanged. This is an
**adiabatic expansion**. Doubling a 293 K box gives 146.5 K.

Chapter 12.2 uses this to cool the paper's graviton sky to 0.905 K, the paper's
[](/paper/#eq:graviton-temperature). In its factor $(3.91/106.75)^{1/3}$ the two numbers count the kinds of particle
that held the heat today and when the gravitons parted; those that annihilated in between heated only the photons.

## Heat capacity says how a body's energy follows its temperature

We want how much heat raises a body's temperature, because Section VI keeps diamond's quantum occupations and Section
VII's hole needs a sign. A body's **heat capacity** is

$$\sym{heat-capacity}{C} = \frac{\dd E}{\dd T} ,$$

in $\mathrm{J\,K^{-1}}$, with $E$ the body's energy.

**One mode.** With $E = \hbar\omega\bar n$ and $\dd\bar n/\dd T = (x/T)\,e^x/(e^x - 1)^2$,

$$\boxed{C_{\rm mode} = \kB\,\frac{x^2e^x}{(e^x - 1)^2}} .$$

When $x \ll 1$ it tends to $\kB$, chapter
[4.2](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share)'s equipartition.
When $x \gg 1$ it falls as $\kB x^2e^{-x}$, because the mode is frozen (8.3). At $x = 0.1$, 1, 2 and 5 it is 0.999,
0.921, 0.724 and 0.171 times $\kB$.

**A solid.** A solid of $N$ atoms has $3N$ normal modes (chapter
[4.3](/tutorial/response/elastic-bodies/#masses-on-springs-move-in-normal-modes)), so when hot it has $C = 3N\kB$, the
**Dulong–Petit law**. Debye's model, a sketch, treats every mode as a sound wave, counted as $\omega^2$ like 10.1's
modes, up to the **Debye frequency** $\sym{debye-frequency}{\omega_D}$ that leaves exactly $3N$ modes: $9N\omega^2\,
\dd\omega/\omega_D^3$ in each band. With the **Debye temperature** $\sym{debye-temperature}{\Theta_D} =
\hbar\omega_D/\kB$ and $x_D = \Theta_D/T$, adding $C_{\rm mode}$ over these modes gives

$$\frac{C}{3N\kB} = \frac{3}{x_D^3}\int_0^{x_D}\frac{x^4e^x\,\dd x}{(e^x - 1)^2} .$$

**Numbers.** At 293 K diamond, with the paper's Debye temperature of 2200 K, holds only 0.16 of its classical heat
capacity, while copper, whose Debye temperature is 343 K, holds 0.93 (Figure [](#fig:heat-capacity)). So most of
diamond's modes are frozen, which is why Section VI keeps "the quantum occupations, which matter for diamond".

![Look first at the left panel's dots: at room temperature copper's modes are nearly all awake and diamond's mostly
frozen. On the right, a black hole's heat capacity is negative at every temperature. Curves
exact.](tut-heat-capacity){#fig:heat-capacity}

## A balance is stable only if the heat capacity is positive

A body a little hotter than its surroundings loses heat. If $C > 0$ it cools back, and its balance is **stable**; if
$C < 0$, losing energy makes it hotter still, and it runs away from an **unstable** balance. A black hole of mass
$\matter M$, in kilograms, has a **negative heat capacity**: its Hawking temperature $T_H = \hbar c^3/8\pi
G\matter M\kB$ (stated; chapter 11.3) falls as $1/\matter M$, so $\dd T_H/\dd\matter M = -T_H/\matter M$ and

$$\boxed{C = \frac{\dd(\matter Mc^2)}{\dd T_H} = -\frac{\matter Mc^2}{T_H}} .$$

Section VII's hole of $1.36\times10^{23}$ kg is at 0.902 K,[^hole] with $C = -1.4\times10^{40}\unit{J\,K^{-1}}$. So
its balance with the 0.905 K graviton sky is, "like every such balance", unstable.

::: check
### Q

Why does Kirchhoff's law hold for the hot block in a cold room?

### A

Both $j_\omega$ and $\alpha$ depend only on the matter's populations, which are Boltzmann's at the block's temperature.
The radiation's occupation $n_\omega$ cancels from their ratio.

### Q

Why must the glow be computed with the emission order of the stress spectrum?

### A

The symmetrized order includes the zero point, and would make a body at absolute zero glow.

### Q

A black body at 293 K in a box is slowly widened to three times its size. What is its temperature?

### A

The temperature falls as one over the size, to $293\unit{K}/3 = 97.7$ K.

### Q

Why is a black hole's balance with a sky of its own temperature unstable?

### A

Its heat capacity is negative: a hole that loses a little energy grows hotter and loses more.
:::

**The idea to keep: matter absorbs a mode's quanta in proportion to how many are there and emits in proportion to one
more, so its spontaneous glow over its net absorption is Planck's radiance at its own temperature, whatever surrounds
it. The random stress of warm matter, in the order that gives energy away, gives the same law. A glow carries entropy,
keeps its count of quanta when stretched slowly, and a body is in stable balance with it only if its heat capacity is
positive.**

::: problems
### Practice

A slab holds two levels whose spacing is the quantum of 10 THz (cycles per second), at 293 K. Find $P_u/P_l$, the
fraction of the absorption that stimulated emission cancels, and $j_\omega/\alpha$ in units of
$\hbar\omega^3/4\pi^3c^2$.

::: solution
Here $x = 2\pi\hbar\times10^{13}/\kB T = 1.638$. Then $P_u/P_l = e^{-x} = 0.194$, which is also the cancelled
fraction, and $j_\omega/\alpha = \bar n = 1/(e^{1.638} - 1) = 0.241$.
:::

### Stretch

With chapter 8.5's geometric counts $P(n) = \bar n^n/(1 + \bar n)^{n+1}$, compute chapter 3.8's entropy $-\sum_nP(n)
\log_2P(n)$, show that it is $S_{\rm mode}/\kB\ln2$, and evaluate it at $\bar n = 1$.

::: solution
Each count has $-\log_2P(n) = (n + 1)\log_2(1 + \bar n) - n\log_2\bar n$. Its mean, with $\langle n\rangle =
\bar n$, is $(\bar n + 1)\log_2(\bar n + 1) - \bar n\log_2\bar n$, which is $S_{\rm mode}/\kB\ln2$. At $\bar n = 1$ it
is 2 bits, or $2\ln2\,\kB = 1.39\,\kB$.
:::

### The paper

Derive the paper's [](/paper/#eq:kirchhoff) both ways, from the rates of a mode and from the stress spectrum, and show
that the paper's "net absorption coefficient" is $\kappa(P_l - P_u)$.

::: solution
From the rates, $\dd n_\omega/\dd s = \kappa P_u(n_\omega + 1) - \kappa P_ln_\omega$ gives $\alpha = \kappa(P_l -
P_u)$, absorption less stimulated emission, and $j_\omega = \kappa P_u\hbar\omega^3/4\pi^3c^2$, so $j_\omega/\alpha =
B_\omega$ with Boltzmann's populations. From the stress, the emission order $2\hbar\omega\bar
n\,\mathrm{Re}\,\matter\eta\,\Delta_{ijkl}$, with $G/2\pi c^5$, $\omega^2/\pi$ and the contraction 4, gives $4G\,
\mathrm{Re}\,\matter\eta\,\hbar\omega^3\bar n/\pi^2c^5$, which is $16\pi G\,\mathrm{Re}\,\matter\eta/c^3$ times
$B_\omega$.
:::
:::

::: paper
- Section VI's [*Emission*](/paper/#par:emission): the paper's [](/paper/#eq:kirchhoff), "absorption less stimulated
  emission", "the spontaneous emission", the "unsymmetrized (Wightman) order" and the plasma result.
- Section VI's [*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat):
  "$\mathrm{Re}\,\eta(\omega)$ is the spectrum of the material's stress at zero wavenumber", and diamond's quantum
  occupations and 2200 K.
- Section IX's [*Counting or recording*](/paper/#par:counting-or-recording): "of order $10^{-30}$ gravitons on
  average" in each mode (chapter R10b).
- Section VII's [*A black hole as the lens*](/paper/#par:a-black-hole-as-the-lens): "like every such balance, this
  one is unstable" (chapter R11).
- Section XI's [*A primordial graviton background*](/paper/#par:a-primordial-graviton-background): conservation of
  entropy and the paper's [](/paper/#eq:graviton-temperature) (chapter 12.2).
:::

::: deeper
- The GR course's [section on probability, temperature and entropy](https://neovand.github.io/general-relativity/chapter-22.html#probability-temperature-and-entropy)
  sets entropy in the language of the canonical distribution.
- The GR course's [section 22.8](https://neovand.github.io/general-relativity/chapter-22.html#22-8-entropy-is-written-in-area)
  gives a black hole's entropy and its first law.
- The GR course's [section 19.4](https://neovand.github.io/general-relativity/chapter-19.html#19-4-conservation-becomes-the-universe-s-first-law-of-thermodynamics)
  treats energy and pressure in an expanding universe: the slow widening at the scale of the sky.
- L. D. Landau and E. M. Lifshitz, *Statistical Physics, Part 2* (Pergamon, 1980), section 88: the fluctuating stress
  of a fluid.
:::

[^golden]: This is Fermi's golden rule, stated here; chapter 8.7's lines carry the same squares.

[^earth]: From the centre outward: 5500, 4500, 2800, 1700 and 700 K; frictions of 2.4, 1.6, 3.4, 2.5 and
    $2.0\times10^{-4}$ Pa s; and paths straight down of 2443, 4517, 4442, 1290 and 50 km. Each friction is
    $0.42\,\hbar\Delta\mu/\kB T$, with $\Delta\mu$ the stiffness that relaxes: the shear stiffness at the shell's
    base, with two free electrons per atom added in the core.

[^s]: From the section on entropy on, $s$ is an entropy per volume; the two never meet in one equation.

[^maser]: An inverted population would need $e^{-x} > 1$, a negative temperature in Boltzmann's ratio. It can only be
    made by pumping energy in from outside.

[^hole]: The paper's $1.36\times10^{23}$ kg is $1.356\times10^{23}$ kg rounded: that mass gives 0.905 K, and
    $1.36\times10^{23}$ kg gives 0.902 K. The heat capacity is $-1.35\times10^{40}\unit{J\,K^{-1}}$ either way.
