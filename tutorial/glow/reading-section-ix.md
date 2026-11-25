---
id: R10b
title: 'Reading Section IX, with the capstone: the Sun at midnight'
question: 'With Part 10 behind us, can we derive or check every claim of Section IX, and how bright, from the stiffness of each layer to the counts of a lifetime, is the paper''s first image of the Earth and the Sun at midnight?'
part: '10'
requires: ['R10', '3.1', '3.3', '5.5', '5.6', '7.7', '8.4', '8.5', '8.6', '10.1', '10.2', '10.3']
paper: [sec:first-image, eq:column, eq:abel, eq:abel-inverse, eq:jN-friction, fig:sun-at-midnight, fig:earth-glow, tab:budget, fig:budget, fig:earth-inverted, eq:glow-bound]
figures: [fig:earth-glow, fig:budget, fig:earth-inverted]
live: [scene-sun-at-midnight, graviton-count, onion-peel, planck-spectrum]
---

The paper's [Section IX](/paper/#sec:first-image) draws its first picture in the thermal glow: a camera on the night
side of the Earth looks down at midnight and sees the planet's layers and, beyond them, the Sun's core. "In eighty
years that is about 36,000 gravitons." With Part 10 behind us, can we derive or check every claim of Section IX, and
how bright, from the stiffness of each layer to the counts of a lifetime, is the paper's first image?

This chapter reads the section in order (Figure [](#fig:read-ix-map)), as R10 read Section VI, and gives each claim
one mark: *checked here* (a number recomputed from a result derived earlier), *read now, derived in chapter N*, or
*stated in the paper*. Nothing is derived here: the one step from outside Part 10, a collision time read from a
resistivity, is derived in R10. The capstone follows the Sun at midnight from the stiffness of each shell to the edge
of the core.

![Look first at the solid boxes: every paragraph of Section IX is derived in Part 10 or earlier, with its stated
results in dotted insets. The last box follows the paper's first image through eight of
them.](tut-read-ix-map){#fig:read-ix-map}

::: plain
Section IX draws the paper's first picture in the thermal glow. A camera on the night side of the Earth looks down at
midnight. Nothing absorbs the glow, so each pixel adds up the glow of everything along its line of sight, and the lines
that cross the hot core are the brightest. Beyond the Earth the Sun's core shines straight through it, ten billion
times brighter for each patch of sky.

The picture is faint. A square metre receives at most one graviton from the whole Earth every twenty hours, about
36,000 in a lifetime: enough for a picture of fourteen parts, or, for a planet known to be made of round shells, to
find the edge of the core to about 30 km. No detector made of matter could catch these gravitons, and one that records
the wave would bury them in quantum noise. A camera that counts them one at a time could still find the Sun's core
through the Earth in half an hour.
:::

## A pixel counts the glow along its line of sight

The opening paragraph integrates the paper's [](/paper/#eq:kirchhoff) over frequency, for a friction
$\sym{dynamic-viscosity}{\matter\eta}$ (in Pa s) the same at every frequency, to the power per cubic metre and
steradian $j_E = \alpha\sigma T^4/\pi$, with $\sym{absorption-coefficient}{\alpha} = 16\pi G\matter\eta/c^3$ in m⁻¹,
$\sym{temperature}{T}$ in kelvin and $\sigma = \sym{stefan-boltzmann}{\sigma_{\rm SB}}$ (*read now, derived in chapter
[5.5](/tutorial/waves/radiance/#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature)*). A
**graviton** is the smallest packet of a gravitational wave's energy, $\hbar\omega$ for a wave of angular frequency
$\omega$ (chapter
[8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons)).
Dividing by the mean energy of a thermal graviton, $2.70\,\kB T$ (chapter
[10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)), gives
the number emissivity $\sym{number-emissivity}{j_N}$, in gravitons per second, per cubic metre and per steradian. The
pixel that looks along the unit vector $\hat n$ then reads the paper's

{{paper eq:column}}

(*read now, derived in chapter
[5.5](/tutorial/waves/radiance/#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line)*), with $s$ the distance
along the line: per cubic metre times metres, the **number radiance** $\sym{number-radiance}{N(\hat n)}$ in
gravitons per second, per square metre, per steradian.

## At midnight the Sun's core outshines the ground ten billion times

The observer stands "at latitude 40° at local midnight at an equinox".[^equinox] Straight down, the line crosses the
Earth's diameter, 12,742 km, "12,700 km", and reads $N = 1.18\times10^{-5}$, "at most $1.2\times10^{-5}$" (*checked
here*, in the capstone's [step (b)](#the-capstone-the-sun-at-midnight-from-stiffness-to-the-edge-of-the-core)).

The Sun's "$10^8$ W" in gravitational waves is *stated in the paper* [@GarciaCelyRingwald2025; @Steane2024;
@Weinberg1965]. Spread over a sphere of one astronomical unit, $1.496\times10^{11}$ m, it is
$10^8/4\pi(1.496\times10^{11})^2 = 3.6\times10^{-16}\unit{W\,m^{-2}}$, the paper's $4\times10^{-16}$. The scene's core
is at $1.3\times10^7$ K, where a graviton carries $2.70\,\kB T = 4.85\times10^{-16}$ J, so 0.73 gravitons cross each
square metre a second, "roughly one" (*checked here*).

The scene spreads the Sun's glow over its inner fifth (*stated in the paper*), a ball of radius $r_{\rm c} =
1.39\times10^8$ m, which is $2r_{\rm c}/1.496\times10^{11}$ rad $= 0.107°$ across, "a tenth of a degree". A uniform
ball sending $\dot N$ gravitons a second has $j_N = \dot N/(4\pi\cdot\tfrac43\pi r_{\rm c}^3)$, and its central
chord is $2r_{\rm c}$, so

$$N_{\rm centre} = \frac{3\dot N}{8\pi^2r_{\rm c}^2} = 4.0\times10^5 ,$$

with $\dot N = 10^8\unit W/4.85\times10^{-16}\unit J = 2.1\times10^{23}\unit{s^{-1}}$: the paper's $4\times10^5$. It
is $3.4\times10^{10}$ times the ground's $1.18\times10^{-5}$, "more than $10^{10}$" (*checked here*).

::: try {#scene-sun-at-midnight}
The paper's live figure: the night at latitude 40°, in light left of a divider and in the thermal glow right of it.
Drag the divider, or move it with the arrow keys, and drag the view to look around. Predict first: how far from
straight down will the Sun appear in the glow, and will the Moon, the brightest thing in the night sky, stand out?
Then drag the divider to the left and look down.
:::

## The kinks fall where a line of sight grazes a boundary

{{paper fig:earth-glow}}

In panel (a) the lines that graze the lower mantle, the core and the inner core leave $\arcsin(r/R)$ from straight
down, with $R = 6371$ km the Earth's radius: $\arcsin(5701/6371) = 63.5°$, $\arcsin(3480/6371) = 33.1°$ and
$\arcsin(1221.5/6371) = 11.05°$, the caption's 63°, 33° and 11° (*checked here*, by chapter
[5.6](/tutorial/waves/abel-transform/#a-boundary-shows-as-a-kink-at-an-angle-that-only-geometry-sets)). So
[R2](/tutorial/outside/reading-section-iv-1/#three-channels-together-weigh-the-earths-core)'s "radius of the core,
3480 km, from the kinks" is now derived. In panel (b) the curve stays continuous at each boundary, and its slope
becomes infinite on the inner side of the grazing angle, a square-root kink (below). Inside 63.5° the brightness
doubles within half a degree, from $4.1\times10^{-7}$ to $8.1\times10^{-7}$ at 63.0° (*checked here*). The
frictions set only the heights.

## The Moon is faint, and every brightness of the Earth is an upper bound

The radii from the Preliminary Reference Earth Model, PREM [@DziewonskiAnderson1981], are *stated in the paper*, and
each shell gets "the most that its stiffness allows" by the paper's [](/paper/#eq:glow-bound) (*read now, derived in
chapter [10.3](/tutorial/glow/why-matter-barely-glows/#no-material-can-glow-brighter-than-its-weight-allows)*). The
paper grants "all of the shear stiffness at its base, and the core the weight of two free electrons per atom", but
prints no number. PREM's shear moduli at the shells' bases are 44, 124 and 294 GPa for the crust and the two mantles,
none for the liquid outer core and 176 GPa for the inner core. The scene adds the electrons' 0.21 TPa (found
[below](#real-materials-may-hide-the-core-in-counts-but-not-in-colour)) to each core and rounds to 44, 130, 293, 220
and 400 GPa. As frictions these are 1.58 to $3.38\times10^{-4}$ Pa s, "between 1.6 and $3.4\times10^{-4}$" (*checked
here*, in the capstone's step (a)).

The scene's Moon has a mantle at 1200 K with 70 GPa, about the shear modulus of the Earth's uppermost mantle, and a
core 350 km in radius at 1700 K with the outer core's 220 GPa. The line through its centre reads $1.41\times10^{-7}$,
so the ground underfoot is 83 times brighter, "about eighty times" (*checked here*). Its chord, 3475 km, is 0.27 of
the Earth's, "a quarter as long".

## The Earth below sends a square metre one graviton every twenty hours

[*The graviton budget*](/paper/#par:the-graviton-budget) counts what arrives. A square metre that collects from every
direction receives $N\,\dd\Omega$ gravitons a second from each patch $\dd\Omega$ of sky, with $\dd\Omega =
2\pi\sin\theta\,\dd\theta$ and $\sym{nadir-angle}{\theta}$ the angle from straight down. The figure's curve gives the
detector's rate

$$\sym{detector-rate}{\dot N_{\rm det}} = \int_0^{90°} N(\theta)\,2\pi\sin\theta\,\dd\theta =
1.42\times10^{-5}\unit{s^{-1}} :$$

one graviton every 19.6 hours, 447 a year and 35,800 in eighty years, "one every twenty hours, $3.6\times10^4$"
(*checked here*). The 447 is the "about 450" that chapters
[3.8](/tutorial/noise/bits/#a-blurred-picture-spends-its-few-bits-on-a-few-numbers) and
[R3](/tutorial/noise/reading-section-iv-2/#a-near-field-picture-holds-a-few-dozen-bits-for-each-patch-of-its-scene)
took as an input, and
[R5](/tutorial/waves/reading-section-iii/#sources-of-radiation-divide-again-and-each-regime-has-its-own-limit)'s
"almost no gravitons arrive".

A count of $N$ random arrivals varies by about $\sqrt N$ (*read now, derived in chapter
[3.1](/tutorial/noise/probability/#rare-events-are-counted-with-the-poisson-distribution)*). For one part of a picture
to stand ten per cent above a level known in advance by five such deviations, $0.1N = 5\sqrt N$, so $N = (5/0.1)^2 =
2500$, and $35{,}800/2500 = 14.3$ parts, "about fourteen" picture elements (*checked here*).[^2500]

"These counts assume no other background." Section XI's primordial glow, at 0.905 K (*stated in the paper*), has
10.1's $\sym{black-body-number-radiance}{N_{\rm bb}} = \zeta(3)(\kB T/\hbar)^3/2\pi^3c^2 = 3.6\times10^{14}$ gravitons
s⁻¹ m⁻² sr⁻¹, with $\zeta(3) = 1.202$. Above $x_0$, with $\sym{planck-ratio}{x} = \hbar\omega/\kB T$, a black body
keeps $\int_{x_0}^\infty x^2\,\dd x/(e^x - 1)\big/2\zeta(3)$ of its quanta: above 2 THz, $4.1\times10^{-43}$ of the
primordial glow and 0.980, "98%", of a body at 293 K with a constant friction (*checked here*). The filter must
remove "its fluctuations, not its known mean" (*read now, derived in chapter
[8.5](/tutorial/quantum/counting-quanta/#a-thermal-source-gives-geometric-counts-with-a-larger-spread)*).

::: try {#graviton-count}
Chapter 0.3's count: a source from the paper's table, a detector area and an exposure, with the arrivals on a time
line and a picture cut into parts of 2500 gravitons each. Predict first: how many picture elements does a lifetime of
the Earth below give on one square metre? Choose *The Earth below*, one square metre and the third tick of *Exposure*.
Then choose *Hot iron, 3.9 m* and predict whether even the longest exposure gives it one element.
:::

## The budget runs from a second to a hundred and ten million years

The paper's Table [](/paper/#tab:budget) gives the wait for one graviton on a square metre that collects from every
direction:

- **The Sun's core**: 0.73 a second, "second", and **the Earth below**: 19.6 hours, "20 hours, or more" (above).
- **The hot iron at 3.9 m**:
  [R10](/tutorial/glow/reading-section-vi/#the-closed-furnace-from-the-friction-of-iron-to-a-count-of-gravitons)
  followed the closed furnace's block, a tenth of a cubic metre at 1500 K, to $5.4\times10^{-14}$ gravitons a second
  in all directions. Spread over $4\pi(3.86\unit m)^2 = 187\unit{m^2}$, at the length of the line of sight to the
  block's middle, that is one per square metre every $1.1\times10^8$ years, "$1.1\times10^{8}$", the plain words'
  "millions of years" (*checked here*).[^furnace]
- **The turning pair at 4.5 m**: two 33 kg balls 0.44 m apart, turning at $\Omega = 2\pi\unit{s^{-1}}$, radiate
  $(32/5)G\mu^2a^4\Omega^6/c^5 = 1.1\times10^{-46}$ W, with $\mu = 16.5$ kg their reduced mass and $a = 0.44$ m (*read
  now, derived in chapter
  [7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole)*). Along
  its axis a rotor shines $\tfrac52$ times its average over directions
  ([5.4](/tutorial/waves/polarization/#the-rotor-shines-eight-times-less-edge-on)), and each graviton carries
  $2\hbar\Omega = 1.33\times10^{-33}$ J, so a square metre waits $3.9\times10^7$ years, "$4\times10^7$" (*checked
  here*). This is their far-field rate, although the camera is "deep inside their near zone".
- **The near field**: "none needed", because a static field is not radiation (*read now, derived in chapter
  [5.2](/tutorial/waves/retarded-waves/#inside-the-near-zone-the-field-is-the-static-field-of-the-source-as-it-is-now)*).

A flat detector facing the ground weights each direction by $\cos\theta$, and $\int N\,\dd\Omega\big/\int
N\cos\theta\,\dd\Omega = 1.27$, "about 1.3 times as long" (*checked here*).

{{paper fig:budget}}

The figure's thermal bars follow the paper's [](/paper/#eq:kirchhoff) and its spinning masses the paper's
[](/paper/#eq:dumbbell); its values are *read now, derived in chapters 5.5 and 7.7*.

## One camera peels the layers, and the heights measure friction times temperature cubed

[*Recovering the layers*](/paper/#par:recovering-the-layers): the line at $\theta$ passes the centre at
$\sym{line-impact-parameter}{b} = R\sin\theta$, and for an emissivity that depends only on the radius $r$ the
paper's [](/paper/#eq:column) becomes

{{paper eq:abel}}

the Abel transform, whose inverse is

{{paper eq:abel-inverse}}

(*read now, derived in chapter [5.6](/tutorial/waves/abel-transform/#the-transform-can-be-undone)*). For uniform shells
the inversion is 5.6's [onion peeling](/tutorial/waves/abel-transform/#uniform-shells-are-peeled-from-the-outside-in)
from the crust inwards, which chapter 0.3's margin note sent here. At each boundary $\dd N/\dd b$ diverges as $(r -
b)^{-1/2}$, and the crust's kink is at $\arcsin(6346/6371) = 84.9°$.

"The heights measure a product." The paper's

{{paper eq:jN-friction}}

is chapter 5.5's, with 10.1's 2.70 (*read now, derived in chapters 5.5 and 10.1*). Counts give $\matter\eta T^3$ and
energies $\matter\eta T^4$, so together they give $T$ and $\matter\eta$. If the friction varies across the band,
the temperature trades against its shape (*read now, derived in chapter
[5.5](/tutorial/waves/radiance/#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature)*).

::: try {#onion-peel}
Chapter 5.6's figure: a round planet of up to five shells, a line of sight you drag or turn with the arrow keys, and
the brightness against the angle from straight down. Choose *The paper's Earth* and answer the figure's three
predictions. Then predict which shell a lifetime leaves least certain, turn on *Noise*, set *Counts in all* near
36,000 and press *Peel*.
:::

## A lifetime places the edge of the core to 29 km

{{paper fig:earth-inverted}}

The figure's 35,619 is one simulated draw. Its mean, 35,773, is the count of the scene's frictions with
$2.7012\,\kB T$ a graviton, which rounds to the 35,800 above, and the draw lies
$(35{,}619 - 35{,}773)/\sqrt{35{,}773} = -0.8$ standard deviations from it (*checked here*).

The errors come "from the Fisher information of the model" (*read now, derived in chapter
[3.3](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks)*). For
Poisson counts with means $\mu_i$ in the rings $i$, the **Fisher matrix** is $F_{ab} = \sum_i(\partial\mu_i/\partial
p_a)(\partial\mu_i/\partial p_b)/\mu_i$ over the unknowns $p_a$, and each error is the square root of a diagonal entry
of $F^{-1}$. With 90 rings of one degree and nine unknowns, four radii and five emissivities, the forecast places the
top of the lower mantle to 5.2 km and the core's boundary to 28.9 km. It measures the emissivities of the crust, upper
mantle, lower mantle, outer core and inner core to 55.7, 2.96, 0.91, 1.75 and 6.4%: the paper's 5 km, 29 km, 56, 3,
0.9, 1.8 and 6% (*checked here*). The crust's share, $3.4\times10^{-4}$ of the count, is 12 gravitons, "about
twelve".

The forecast counts only the Earth's gravitons. The paper instead masks "the Sun's path across the ground", and
dropping the whole ring that holds the Sun, from 39° to 40°, moves the core's edge from 28.86 to 28.91 km. So 28.9 km
holds either way.

"The errors scale as $1/\sqrt{\eta\tau}$", where the paper's $\tau$ is the exposure time, which this tutorial writes
$\sym{exposure-time}{t_{\rm obs}}$: every count, and the Fisher information with it, grows as $\matter\eta\,t_{\rm
obs}$. A layered planet spends the fourteen elements' gravitons on nine numbers, as a simple scene does in the near
field (*read now, derived in chapter
[R3](/tutorial/noise/reading-section-iv-2/#one-mass-is-placed-to-a-millimetre-though-two-are-hard-to-tell-from-one)*).
The sample's fitted radii, $1281 \pm 41$ km for the inner core against the forecast's 39 km, are *stated in the
paper*. This is the fit that 5.6's gap box left here; a planet that is not round needs
[5.6](/tutorial/waves/abel-transform/#a-body-that-is-not-round-needs-views-from-many-directions)'s tomography.

## Real materials may hide the core in counts, but not in colour

[*What the Earth's materials allow*](/paper/#par:what-the-earths-materials-allow): to match the placeholder's
count, $10^{-3}$ Pa s, a material needs a **relaxing stiffness** $\sym{relaxing-stiffness}{\Delta\matter\mu}$, the
part of its stiffness that its friction relaxes, of 0.87 TPa at 2800 K and 1.70 TPa at 5500 K (*checked here*, by
chapter 10.3), several times any shell's.

The core's "two free electrons per atom" number $\sym{electron-density}{\matter n} =
2\times11{,}000/(55.85\times1.661\times10^{-27}) = 2.37\times10^{29}\unit{m^{-3}}$ at 11,000 kg m⁻³, since an iron
atom weighs 55.85 atomic mass units. Their Fermi energy $\sym{fermi-energy}{E_F} = \hbar^2(3\pi^2\matter
n)^{2/3}/2m = 14.0$ eV, with $m$ the electron's mass, gives the weight $\tfrac25\matter nE_F = 0.21$ TPa, "0.2 TPa"
(*checked here*, by 10.3).

So the bounds run from 15.8% of the placeholder's count, for the outer core, to 33.8%, for the lower mantle: "16 to
34%". With the placeholder itself a lifetime would bring "$1.4\times10^5$" gravitons and place the core's edge to
"6 km" (*checked* in the stretch problem). The mantle's vibrations end near 33 THz, and its pairs near 66 THz, while
at 2800 K the count peaks at $1.594\,\kB T/h = 93$ THz, "near 90 THz" (*checked here*, by 10.1).

*The core's electrons.* The paper reads their collision time $\tau$, the mean time between an electron's collisions,
from a "resistivity of order a micro-ohm metre" [@Pozzo2012]. The resistivity $\sym{resistivity}{\rho_e}$ is the
electric field needed per unit of current density, in ohm metres. Drude's $\tau = m/\matter ne^2\rho_e$, with $e$ the
electron's charge, is *read now, derived in chapter
[R10](/tutorial/glow/reading-section-vi/#free-electrons-give-copper-its-friction-and-iron-a-ceiling)*, and at
$1\unit{\mu\Omega\,m}$ gives $\tau = 1.50\times10^{-16}$ s, "a fraction of a femtosecond" (*checked here*).

Then 10.3's friction $\tfrac25\matter nE_F\,\tau/(1 + \omega^2\tau^2)$ is $3.2\times10^{-5}$ Pa s at low frequency.
Weighted by the count over the band, it is
[R10](/tutorial/glow/reading-section-vi/#the-closed-furnace-from-the-friction-of-iron-to-a-count-of-gravitons)'s
count-equivalent friction $\sym{count-friction}{\matter\eta_N}$:

$$\begin{aligned}
\frac{\matter\eta_N}{10^{-3}\unit{Pa\,s}}
&= \frac{1}{2\zeta(3)}\int_0^\infty\frac{\mathrm{Re}\,\matter\eta}{10^{-3}\unit{Pa\,s}}\,\frac{x^2\,\dd x}{e^x - 1}\\
&= 0.030
\end{aligned}$$

at 4500 K, "about 3%" (*checked here*). The outer core's 15.8% is also a ratio of counts at 4500 K, its bound's to the
placeholder's, so the two compare like with like: 3.0% is 0.19 of 15.8%, "a fifth of what the figures grant it".

*In colour it does.* A flat friction gives gravitons of mean energy $2.70\,\kB T$, 1.05 eV at 4500 K: "about $2.70\,\kB
T \approx 1\,\mathrm{eV}$ at the outer core's $4500\,\mathrm{K}$".[^ev] A mean energy weights by $x^3$ where a count
weights by $x^2$, so with the electrons' fall above $1/\tau$ it is 0.91, 0.995 and 1.04 eV at 0.5, 1 and 3 µΩ m. The
mantle's flat band below $x_c = 0.566$ (33 THz) or 1.13 (66 THz) at 2800 K gives

$$\begin{aligned}
\bar E &= \kB T\,\frac{\int_0^{x_c}x^3\,\dd x/(e^x - 1)}{\int_0^{x_c}x^2\,\dd x/(e^x - 1)}\\
&= 0.089\ \text{or}\ 0.172\unit{eV},
\end{aligned}$$

"0.09 to 0.17 eV". At 33° the colour steps by $0.91/0.172 = 5.3$ to $1.04/0.089 = 11.7$, "five to twelve" (*checked
here*).

::: try {#planck-spectrum}
Planck's law at a temperature you choose, with readouts of the peak, the count and the mean energy of a quantum.
Predict first: is a quantum from the outer core, at 4500 K, nearer a tenth of an electronvolt or one? Choose *Outer
core* and read *The mean energy*. Then choose *Count of quanta*, set the slider to 2800 K, and predict whether the
count peaks above or below the mantle's highest vibrations, near 33 THz.
:::

## No detector made of matter could catch these gravitons

[*Arrival and absorption*](/paper/#par:arrival-and-absorption): a detector absorbs through the friction by which
matter glows, so the sum rule bounds both (*read now, derived in chapter 10.3*). Chapter 10.3's optical depth of a
path $L$, added over angular frequency, is $8\pi^2GL\Delta\matter\mu/c^3$, $5.87\times10^{-24}\unit{s^{-1}}$ for a
metre of 30 GPa. The band of room-temperature heat is $\kB T/\hbar = 3.84\times10^{13}\unit{s^{-1}}$ wide at 293 K,
"$4\times10^{13}$", so a metre stops at most $5.87\times10^{-24}/3.84\times10^{13} = 1.5\times10^{-37}$ of what
crosses it (*checked here*). Diamond's 536 GPa is 18 times 30 GPa, "not twenty times more".

A cubic metre crossed by one graviton a second counts one every $1/1.53\times10^{-37}$ s, $2.1\times10^{29}$ years,
$1.5\times10^{19}$ times the universe's age of $1.38\times10^{10}$ years (*checked here*). The verdicts of Dyson and of
Rothman and Boughn are *stated in the paper* [@Dyson2013; @RothmanBoughn2006].

## Recording adds half a quantum, so a thermal camera must count

[*Counting or recording*](/paper/#par:counting-or-recording): "each of its modes holds $10^{-30}$ gravitons or fewer on
average". Chapter [10.2](/tutorial/glow/kirchhoff/#what-a-pixel-receives-holds-far-less-than-one-quantum-per-mode)
showed that a thin body sends a pixel the occupation $\sym{optical-depth}{\tau}\bar n$: its optical depth, here a pure
number and not a time, times the thermal occupation $\bar n = 1/(e^x - 1)$. Summed over the shells straight down it is
$7.8\times10^{-31}$ at 30 THz and $1.4\times10^{-31}$ at 100 THz (*checked here*).[^occ]

Recording both quadratures of a mode adds at least half a quantum of noise [@Caves1982] (*read now, derived in
chapter
[8.6](/tutorial/quantum/quantum-limit/#recording-both-quadratures-of-a-wave-adds-half-a-quantum-of-noise)*),
$5\times10^{29}$ times the glow's $10^{-30}$. A counter adds none, because an empty mode never clicks, but it
loses the phase that the paper's [](/paper/#eq:beam) needs to combine pixels (*read now, derived in chapter
[8.5](/tutorial/quantum/counting-quanta/#counting-adds-no-noise-but-needs-quanta)*). This is the tension that 8.6
left here, and that
[R8](/tutorial/quantum/reading-the-quantum-limits/#read-ahead-a-counter-adds-no-noise-and-each-graviton-tells-about-one-bit)
read ahead. Tsang's scaling with the occupation against its square [@Tsang2011; @CarneyDomckeRodd2024], the
repeaters [@Gottesman2012] and the converter [@Dyson2013] are *stated in the paper*; the near field is unaffected.

## A counting pixel finds the Sun's core to a degree in half an hour

"One graviton of helicity two from $\hat n$" leaves the pixel's five modes in "a coherent state of spin two" (*read
now, derived in chapter [8.4](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky)*).[^convention] The measurement
made of all such states clicks at the angle $\vartheta$ from $\hat n$ with the density $(5/4\pi)\cos^8(\vartheta/2)$,
and never in an empty mode (*read now, derived in chapter
[8.6](/tutorial/quantum/quantum-limit/#a-measurement-is-a-set-of-positive-tables-that-add-to-one-and-a-gravitons-click-carries-about-a-bit)*).
For spin $s$ a click carries $\log_2(2s + 1) - 2s/[(2s + 1)\ln2]$ bits, 1.168 for $s = 2$ and 0.623 for $s = 1$, and
the Fisher information $s = 2$ per angle against the quantum limit $2s = 4$ (*checked here*, as in R8).

At one graviton a second, half an hour gives 1800 clicks, the Fisher information 3600 per angle and an error of
$1/\sqrt{3600}$ rad $= 0.95°$, "to a degree in half an hour" (*checked here*).[^rate] The pixel sees the sky only to
degree four, the 25 numbers of its brightness (*read now, derived in chapter
[9.6](/tutorial/one-point/the-sky-at-one-point/#the-pixel-sees-the-sky-only-up-to-degree-four-68-numbers)*).

## The capstone: the Sun at midnight, from stiffness to the edge of the core

We follow the paper's first image end to end, shell by shell from the crust in, with the Sun at an equinox
(Figure [](#fig:read-ix-capstone)).

![Look first at the bar: a lifetime's 35,800 gravitons, mostly from the lower mantle. The grazing lines place the
boundaries whatever the frictions, and the line to the Sun's core passes between the kinks at 63° and 33°. Sizes of
the Sun and distances schematic; every number from the capstone.](tut-read-ix-capstone){#fig:read-ix-capstone}

**(a) Each shell's friction and glow.** By chapter 10.3 a relaxing stiffness $\Delta\matter\mu$ sends at most
$5.18\,G\Delta\matter\mu(\kB T)^2/\hbar^2c^5$ gravitons per second per cubic metre, and the placeholder sends $4\pi
j_N(10^{-3}\unit{Pa\,s}, T)$, by the paper's [](/paper/#eq:jN-friction). A shell's share is the first over the
second: for the lower mantle, $5.62\times10^{-12}/1.66\times10^{-11} = 0.338$, a friction of $3.38\times10^{-4}$ Pa s.
Each shell's $j_N$ is its bound over $4\pi$, in gravitons s⁻¹ m⁻³ sr⁻¹:

| Shell | $T$ (K) | $\Delta\matter\mu$ (GPa) | Share of the placeholder | $j_N$ | Chord straight down (km) | Share of the count |
|---|---|---|---|---|---|---|
| Crust | 700 | 44 | 0.203 | $4.2\times10^{-15}$ | 50 | 12 gravitons |
| Upper mantle | 1700 | 130 | 0.247 | $7.3\times10^{-14}$ | 1290 | 7.5% |
| Lower mantle | 2800 | 293 | 0.338 | $4.47\times10^{-13}$ | 4442 | 62% |
| Outer core | 4500 | 220 | 0.158 | $8.68\times10^{-13}$ | 4517 | 27% |
| Inner core | 5500 | 400 | 0.235 | $2.36\times10^{-12}$ | 2443 | 3.2% |

The inner core's $j_N$ is 560 times the crust's, mostly through $(5500/700)^3 = 485$.

**(b) Straight down.** The chords add to 12,742 km. By the paper's [](/paper/#eq:column), with $\ell_k$ the chord of
shell $k$, $N = \sum_kj_{N,k}\ell_k = 1.18\times10^{-5}$, 49% of it from the inner core and 33% from the outer.

**(c) The count.** The table's last column shares out the 35,800 gravitons of eighty years. The inner core gives half
the brightness straight down but 3% of the count, because it fills only $2\pi(1 - \cos11.05°) = 0.12$ sr of the
$2\pi$ below.

**(d) What they buy.** The Fisher forecast, a step that needs code, places the core's edge to 29 km.

**(e) The Sun beyond, and the detector.** The line to the Sun leaves at 40°, between the kinks at 63° and 33°,
through 65 km of crust, 1763 km of upper mantle and 7932 km of lower mantle, where the ground reads
$3.7\times10^{-6}$. At the Sun's $1.3\times10^7$ K the band is $\kB T/\hbar = 1.70\times10^{18}\unit{s^{-1}}$ wide, so
a metre of 30 GPa stops at most $5.87\times10^{-24}/1.70\times10^{18} = 3.4\times10^{-42}$ of its gravitons, and a
cubic metre crossed by the Sun's 0.73 a second waits at least $1.3\times10^{34}$ years for one count (10.3).

## The ledger: Section IX's four equations are derived

| The paper's equation | What it says | Where it is derived; its mark here |
|---|---|---|
| [](/paper/#eq:column) | a pixel adds the glow along its line | [5.5](/tutorial/waves/radiance/#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line); *checked here* |
| [](/paper/#eq:abel) | a round planet's brightness | [5.6](/tutorial/waves/abel-transform/#from-the-surface-of-a-round-planet-each-line-of-sight-is-a-chord); *checked here* |
| [](/paper/#eq:abel-inverse) | the inversion | [5.6](/tutorial/waves/abel-transform/#the-transform-can-be-undone); *read now* |
| [](/paper/#eq:jN-friction) | heights measure $\eta T^3$ | [5.5](/tutorial/waves/radiance/#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature), 10.1; *checked here* |

With R10, the glow that R1 and R7 left to Section IX is read.

::: check
### Q

Why does a camera on the Earth's surface find the radius of the core without knowing its friction?

### A

The kink falls where the line of sight grazes the boundary, at $\arcsin(r/R)$: geometry alone. The friction sets only
its height.

### Q

How many gravitons does a square metre that collects from every direction receive from the Earth below in a year, and
why can no detector made of matter count them?

### A

About 450. A metre of matter stops at most $1.5\times10^{-37}$ of the room-temperature gravitons that cross it, and
less of the Earth's hotter ones, so a cubic metre crossed by one a second waits at least $2\times10^{29}$ years.
:::

**The idea to keep: no shell can glow beyond its stiffness, so the whole Earth sends a square metre one graviton every
twenty hours. A lifetime's 36,000 gravitons draw fourteen picture elements or place the core's edge to 29 km, and no
detector made of matter could catch them.**

::: problems
### Practice

Rerun the hot iron of the budget for a block at 3000 K, its friction still falling as $1/T$: its wait on a square
metre at 3.86 m, and its count against that of R10's cold block, the same block at 293 K.

::: solution
Its count grows as $\matter\eta T^3 \propto T^2$, four times the 1500 K block's, so the wait is $1.1\times10^8/4 =
2.7\times10^7$ years, and $(3000/293)^2 = 105$ times the cold block's count.
:::

### Stretch

Combine chapters 10.3 and 3.3: give every shell the placeholder friction instead of its bound. What do eighty years
give, and how well is the core's edge placed?

::: solution
Every $j_N$ grows by $1/0.158$ to $1/0.338$, so the count becomes $1.43\times10^5$. The same Fisher forecast places the
core's edge to 5.6 km, better than $29/\sqrt4$ km, because the outer core below that edge gains the most and its kink
sharpens.
:::

### The paper

Reproduce every number of the paper's paragraph [*Arrival and absorption*](/paper/#par:arrival-and-absorption).

::: solution
$\kB\times293/\hbar = 3.84\times10^{13}\unit{s^{-1}}$; $8\pi^2G\times1\times3\times10^{10}/c^3 =
5.87\times10^{-24}\unit{s^{-1}}$, over the band $1.53\times10^{-37}$; diamond $536/30 = 18$; and
$1/1.53\times10^{-37}$ s $= 2.1\times10^{29}$ years.
:::
:::

::: paper
- Section IX's opening: the paper's [](/paper/#eq:column), Figures [](/paper/#fig:sun-at-midnight) and
  [](/paper/#fig:earth-glow).
- [*The graviton budget*](/paper/#par:the-graviton-budget): Table [](/paper/#tab:budget), Figure
  [](/paper/#fig:budget).
- [*Recovering the layers*](/paper/#par:recovering-the-layers): the paper's [](/paper/#eq:abel),
  [](/paper/#eq:abel-inverse) and [](/paper/#eq:jN-friction), Figure [](/paper/#fig:earth-inverted).
- The last three paragraphs, from [*What the Earth's materials allow*](/paper/#par:what-the-earths-materials-allow):
  the paper's [](/paper/#eq:glow-bound).
:::

::: deeper
- A. M. Dziewonski and D. L. Anderson, "Preliminary reference Earth model", *Physics of the Earth and Planetary
  Interiors* 25 (1981) 297: the radii, densities and shear moduli of the shells.
- F. J. Dyson, "Is a graviton detectable?", *International Journal of Modern Physics A* 28 (2013) 1330041: why no
  detector made of matter could catch one.
:::

[^2500]: Telling two measured parts apart, with no level known, doubles the variance of their difference, so each part
    needs about 5000 counts, and a lifetime gives about seven elements.

[^equinox]: At midnight the Sun lies the latitude plus its declination from straight down: 16.6° at the December
    solstice, when the line to it crosses the outer core (grazed at 33.1°), and 63.4° in June.

[^furnace]: The furnace stands 3.5 m in front of the camera along the floor; the line of sight to the block's middle is
    3.86 m (R10). At 3.5 m the wait would be $9.0\times10^7$ years.

[^ev]: The outer core lies inside the kink at 33°. At the inner core's 5500 K the same mean energy is 1.28 eV.

[^occ]: A metre of water in a room gives $1.7\times10^{-39}$ (chapter 10.2), so the paper's "or fewer" covers every
    scene.

[^convention]: A graviton "from $\hat n$" travels along $-\hat n$, so by Section VIII's convention its state points
    along $-\hat n$. The paper labels "each click by the direction opposite to that of its coherent state", so the
    clicks peak at the source, $5/4\pi = 0.40$ per steradian.

[^rate]: The paper's "roughly one" and "at one graviton a second" round its model's 0.733 a second (0.607 at the
    Sun's central $1.57\times10^7$ K). At 0.733, half an hour brings 1320 clicks and an error of 1.12°. One degree
    needs 1641 clicks, 37 minutes; the paper's 1800 clicks give 0.95°.
