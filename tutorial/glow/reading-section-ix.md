---
id: R10b
title: 'A first image: the Earth at midnight'
question: 'What would a camera on the night side of the Earth see in the thermal glow at midnight, how many gravitons would it count in a lifetime, and what could it learn from them?'
part: '10'
requires: ['R10', '3.1', '3.3', '5.5', '5.6', '7.7', '8.4', '8.5', '8.6', '10.1', '10.2', '10.3']
paper: [sec:first-image, eq:column, eq:abel, eq:abel-inverse, eq:jN-friction, fig:sun-at-midnight, fig:earth-glow, tab:budget, fig:budget, fig:earth-inverted, eq:glow-bound]
figures: [fig:earth-glow, fig:budget, fig:earth-inverted]
live: [scene-sun-at-midnight, graviton-count, onion-peel, planck-spectrum]
---

A camera on the night side of the Earth looks down at midnight and sees the planet's layers in the thermal glow and,
beyond them, the Sun's core. How bright is this first image, from the stiffness of each layer to the counts of a
lifetime, and what can it tell us?[^ninth]

::: plain
Nothing absorbs the glow, so each pixel adds up the glow along its line of sight, and the lines through the hot core are
the brightest. Beyond the Earth the Sun's core shines straight through it, ten billion times brighter.

The picture is faint. A square metre receives at most one graviton from the whole Earth every twenty hours, about 35,000
in a lifetime: enough for a picture of fourteen parts, or to find the edge of a round planet's core to about 30 km. No
detector made of matter could catch them, and one that records the wave would bury them in quantum noise. A camera that
counts them one at a time could still find the Sun's core through the Earth in half an hour.
:::

## A pixel counts the glow along its line of sight

For a friction $\sym{dynamic-viscosity}{\matter\eta}$ (in Pa s) the same at every frequency, the glow of section R10
integrates over frequency to the power per cubic metre and steradian $j_E = \alpha\sigma T^4/\pi$, with
$\sym{absorption-coefficient}{\alpha} = 16\pi G\matter\eta/c^3$ in m⁻¹, $\sym{temperature}{T}$ in kelvin and $\sigma =
\sym{stefan-boltzmann}{\sigma_{\rm SB}}$. A **graviton** is the smallest packet of a gravitational wave's energy,
$\hbar\omega$ for a wave of angular frequency $\omega$
([section 8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons)).
Dividing by the mean energy of a thermal graviton, $2.70\,\kB T$
([section 10.1](/tutorial/glow/black-body/#three-integrals-of-one-kind-give-the-power-the-count-and-the-mean-energy)),
gives the number emissivity $\sym{number-emissivity}{j_N}$, in gravitons per second, per cubic metre and per steradian.
Nothing absorbs the glow, so the pixel that looks along the unit vector $\hat n$ reads

$$N(\hat n) = \int_0^\infty j_N\bigl(s\,\hat n\bigr)\,\dd s ,$$

with $s$ the distance along the line
([section 5.5](/tutorial/waves/radiance/#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line)).[^column] This **number radiance** $\sym{number-radiance}{N(\hat n)}$ is in gravitons per second, per square metre, per steradian.

## At midnight the Sun's core outshines the ground ten billion times

The observer stands at latitude 40° at local midnight at an equinox.[^equinox] Straight down, the line crosses the
Earth's diameter, 12,742 km, and reads $N = 1.18\times10^{-5}$ (step (b) of the
[capstone](#the-capstone-the-sun-at-midnight-from-stiffness-to-the-edge-of-the-core)).

The Sun sends $10^8$ W in gravitational waves [@GarciaCelyRingwald2025; @Steane2024; @Weinberg1965]. Spread over a sphere
of one astronomical unit, $1.496\times10^{11}$ m, it is $10^8/4\pi(1.496\times10^{11})^2 =
3.6\times10^{-16}\unit{W\,m^{-2}}$. The Sun's core is at $1.3\times10^7$ K, where a graviton carries $2.70\,\kB T =
4.85\times10^{-16}$ J, so 0.73 gravitons cross each square metre a second.

We spread the Sun's glow over its inner fifth, a ball of radius $r_{\rm c} = 1.39\times10^8$ m, which is
$2r_{\rm c}/1.496\times10^{11}$ rad $= 0.107°$ across. A uniform ball sending $\dot N$ gravitons a
second has $j_N = \dot N/(4\pi\cdot\tfrac43\pi r_{\rm c}^3)$, and its central chord is $2r_{\rm c}$, so

$$N_{\rm centre} = \frac{3\dot N}{8\pi^2r_{\rm c}^2} = 4.0\times10^5 ,$$

with $\dot N = 10^8\unit W/4.85\times10^{-16}\unit J = 2.1\times10^{23}\unit{s^{-1}}$. It is $3.4\times10^{10}$ times the
ground's $1.18\times10^{-5}$.

The inner fifth is where the Sun's glow comes from, as its friction shows. The plasma glows by its friction at the
frequencies of heat, like any medium ([section R10](/tutorial/glow/reading-section-vi/)), and its free electrons, which
collide most often, carry most of it. A gas sheared suddenly pushes back with a stiffness equal to its pressure: the
weight $\tfrac25\matter nE_F$ of a metal's electrons
([section 10.3](/tutorial/glow/why-matter-barely-glows/#free-electrons-fill-a-sphere-of-states-and-collisions-relax-a-sheared-one))
is the pressure of a gas of fermions, and the same calculation over a Maxwell distribution of speeds gives $\matter
p = \matter n\kB T$. Collisions relax that stress in the collision time $\tau$, so the gas is a Maxwell liquid of
stiffness $\matter p$, and far above its collision rate its friction is the tail $\matter\mu_\infty/\omega^2\tau$ of
[section 4.4](/tutorial/response/viscosity/#maxwells-model-is-a-liquid-when-slow-and-a-solid-when-fast):

$$\mathrm{Re}\,\matter\eta(\omega) = \frac{\matter n\kB T}{\omega^2\tau}, \qquad \omega\tau \gg 1 .$$

An electron is turned through a large angle by a nucleus that it passes within the distance $e^2/4\pi\varepsilon_0\kB
T$, where their electric energy equals the thermal energy, so the collision rate is about $1/\tau = \matter n\,\pi
(e^2/4\pi\varepsilon_0\kB T)^2\,v_e\ln\Lambda$. Here $v_e = (3\kB T/m)^{1/2}$ is the electron's thermal speed, and
the **Coulomb logarithm** $\ln\Lambda$, of 2 to 4 in the Sun's core, counts the many distant, gentle deflections that
add to the close ones. At the centre, at $1.57\times10^7$ K and about $1.5\times10^5\unit{kg\,m^{-3}}$
([section 12.1](/tutorial/sky/stars/#eddingtons-model-ties-the-pressure-to-the-density)), where a third of the mass is
still hydrogen, there are about two thirds of an electron per proton mass, $6\times10^{31}$ electrons per cubic metre.
The distance is then $1.06$ pm and
$v_e = 2.7\times10^7\unit{m\,s^{-1}}$, so $1/\tau = 5.8\times10^{15}\ln\Lambda\unit{s^{-1}}$, of order
$10^{16}\unit{s^{-1}}$. That is a hundredth of $\kB T/\hbar = 2.1\times10^{18}\unit{s^{-1}}$, so the tail applies across
the band of heat. Kirchhoff's law $j_\omega = \alpha B_\omega$, with $\alpha = 16\pi G\,\mathrm{Re}\,\matter\eta/c^3$,
then gives

$$j_\omega = \frac{16\pi G}{c^3}\,\frac{\matter n\kB T}{\omega^2\tau}\,\frac{\hbar\omega^3}{4\pi^3c^2(e^x - 1)} =
\frac{4G}{\pi^2c^5}\,\frac{\matter n\kB T}{\tau}\,\frac{\hbar\omega}{e^x - 1} .$$

Its unit is that of $G/c^5$, $\mathrm{kg^{-1}\,m^{-2}\,s^3}$, times $\mathrm{m^{-3}\,s^{-1}\,J^2}$, which is
$\mathrm{J\,m^{-3}}$: watts per cubic metre, per steradian, per unit of angular frequency, as it should be. Below
$\omega = \kB T/\hbar$ the last factor is $\kB T$, so the glow is the same at every frequency, and above it the
factor falls as $e^{-x}$. The collision rate goes as $\matter n\,T^{-2}\,T^{1/2}$, so

$$\boxed{\;j_\omega \propto \matter n^2\,T^{1/2}, \qquad \frac{P}{V} \propto \matter n^2\,T^{3/2}\;}$$

for the glow per unit frequency and, adding over the band up to $\kB T/\hbar$, for the power per volume. The same
collisions send light, by bremsstrahlung, at a rate per unit frequency that goes as $\matter n^2T^{-1/2}$; a
quadrupole radiates two more powers of the speed than a dipole, and $v_e^2 \propto T$, which turns $T^{-1/2}$ into
$T^{1/2}$, our law.

In Eddington's model of the Sun (section 12.1) the density is $\matter\rho_c\theta^3$ and the pressure
$\matter p_c\theta^4$, with $\theta$ the Lane–Emden function, so the temperature, in proportion to $\matter
p/\matter\rho$, is $T_c\theta$, and the power per volume goes as $\theta^{15/2}$. Adding $\theta^{15/2}\,4\pi r^2\,\dd
r$ outward from the centre along the solution, half the power comes from within $0.156$ of the Sun's radius, 71% from
within $0.2$ and 90% from within $0.27$. The inner fifth holds 63% if the glow goes as $\theta^{13/2}$, as the glow per
unit frequency does, 59% for $\matter\rho^2$ alone, and 84% even for $\matter\rho^2T^4$: whatever power of the temperature
the glow carries, it comes from a ball about a fifth of the radius across. Solar models fitted to the measured Sun are
twice as dense at the centre, so their glow is more concentrated still. Spreading the glow evenly over that ball keeps
its total, and so the flux of 0.73 a second on each square metre. Only the brightness at the centre differs, the peaked
$\theta^{15/2}$ giving 1.35 times the uniform ball's, and no picture can see the difference, as the next paragraphs
show.[^fifth]

The picture of the night in
[section 5.5](/tutorial/waves/radiance/#when-nothing-absorbs-a-pixel-adds-the-glow-along-its-line) is framed to hold
the Sun's core and the core of the Earth together. At midnight the Sun lies due north, below the horizon by 90° less
the latitude, 50° at an equinox, which is 40° from straight down. So the camera looks north, along the meridian. The
frame reaches from 10° above the horizon, to show where the faint lines that cross only the crust and upper mantle
begin, down to 76° below it, 14° from straight down, to take in the lines within 33.1° of straight down that cross the
core. Its height is the difference of the two, $10° + 76° = 86°$, and its centre lies halfway, $(76° - 10°)/2 = 33°$
below the horizon. This 33° is a tilt from the horizon and is unrelated to the core's grazing angle, which is measured
from straight down: the core's edge lies 56.9° below the horizon, and the core fills the lowest quarter of the
frame.[^frame] The Sun's core is 17° below the centre.

The frame holds 360 rows of pixels and 640 columns. A flat image at unit distance from the lens is $2\tan43° = 1.865$
high, so at its centre a pixel spans $1.865/360 = 5.18\times10^{-3}$ rad, or 0.297°. At an angle $\phi$ from the
centre a step on the image turns the line of sight $\cos^2\phi$ as much along the radius and $\cos\phi$ as much across
it, so at the Sun's 17° a pixel spans $0.271°$ by $0.284°$, a solid angle of $2.35\times10^{-5}$ sr. The core,
0.107° across, is 0.39 of a pixel high, and its disc, $\pi(9.30\times10^{-4})^2 = 2.72\times10^{-6}$ sr, covers 0.12
of one pixel. A uniform ball's chord, averaged over its disc, is $\tfrac23$ of the central one, so the core's flux is
$\tfrac23N_{\rm centre}$ times its solid angle, $\tfrac23\times4.0\times10^5\times2.72\times10^{-6} = 0.73$ gravitons
per second per square metre, the flux found above. Gathered into a single pixel it reads $0.73/2.35\times10^{-5} =
3.1\times10^4$ gravitons $\mathrm{s^{-1}\,m^{-2}\,sr^{-1}}$; spread, as the picture draws it, over a spot about three
pixels across, it peaks at about $3\times10^3$. The picture's scale ends at $2.5\times10^{-5}$, twice the ground straight
down, so the core is $10^8$ to $10^9$ times brighter than the top of the scale. The camera's own blur does not
widen the spot: the Sun's gravitons peak at $\hbar\omega = 2.82\,\kB T$, a wavelength of 0.39 nm, and a camera a metre
across resolves $\lambda/D = 4\times10^{-10}$ rad
([section 5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)), ten
million times finer than a pixel.

::: try {#scene-sun-at-midnight}
The night at latitude 40°, in light left of a divider and in the thermal glow right of it. Predict first: how far from
straight down will the Sun appear, and will the Moon stand out? Then drag the divider to the left and look down.
:::

## The kinks fall where a line of sight grazes a boundary

{{paper fig:earth-glow}}

In panel (a) the lines that graze the lower mantle, the core and the inner core leave $\arcsin(r/R)$ from straight
down, with $R = 6371$ km the Earth's radius: $\arcsin(5701/6371) = 63.5°$, $\arcsin(3480/6371) = 33.1°$ and
$\arcsin(1221.5/6371) = 11.05°$, that is 63°, 33° and 11°
([section 5.6](/tutorial/waves/abel-transform/#a-boundary-shows-as-a-kink-at-an-angle-that-only-geometry-sets)). The
angles come from geometry alone, so they give the radius of the core, 3480 km. In panel (b) the curve stays continuous
at each boundary, and its slope becomes infinite on the inner side of the grazing angle, a square-root kink. Inside
63.5° the brightness doubles within half a degree, from $4.1\times10^{-7}$ to $8.1\times10^{-7}$ at 63.0°. The frictions
set only the heights.

## The Moon is faint, and every brightness of the Earth is an upper bound

The radii are those of the Preliminary Reference Earth Model, PREM [@DziewonskiAnderson1981]. Dziewonski and Anderson
fitted its density and its two sound speeds at every depth to the travel times of seismic waves, the periods of the
Earth's free oscillations and the Earth's mass and moment of inertia; the shear modulus at each depth is the density
times the square of the shear-wave speed. We take from it the shells' radii, rounded, their shear moduli and the outer
core's density, which runs from 9900 to $12{,}200\unit{kg\,m^{-3}}$ and averages about 11,000; the temperatures are
rounded textbook values. Each shell glows at most as much as its stiffness allows, the bound of section
[10.3](/tutorial/glow/why-matter-barely-glows/#no-material-can-glow-brighter-than-its-weight-allows), here with the
shear stiffness at the shell's base and, for the core, the weight of two free electrons per atom.[^bound] PREM's shear
moduli there are 44, 124 and 294 GPa for the crust and the two mantles, none for the liquid outer core and 176 GPa for
the inner core. We add the electrons' 0.21 TPa ([below](#real-materials-may-hide-the-core-in-counts-but-not-in-colour))
to each core and round to 44, 130, 293, 220 and 400 GPa: frictions of 1.58 to $3.38\times10^{-4}$ Pa s.

The Moon has a mantle at 1200 K with 70 GPa, like the Earth's uppermost mantle, and a core 350 km in radius at 1700 K
with 220 GPa. Its central line reads $1.41\times10^{-7}$, so the ground underfoot is 83 times brighter; its chord,
3475 km, is 0.27 of the Earth's.

## The Earth below sends a square metre one graviton every twenty hours

A square metre that collects from every direction receives $N\,\dd\Omega$ gravitons a second from each patch $\dd\Omega$
of sky, with $\dd\Omega = 2\pi\sin\theta\,\dd\theta$ and $\sym{nadir-angle}{\theta}$ the angle from straight down, so
the curve of the figure gives the rate

$$\sym{detector-rate}{\dot N_{\rm det}} = \int_0^{90°} N(\theta)\,2\pi\sin\theta\,\dd\theta =
1.42\times10^{-5}\unit{s^{-1}} :$$

one graviton every 19.6 hours, 447 a year and 35,800 in eighty years.

A count of $N$ random arrivals varies by about $\sqrt N$
([section 3.1](/tutorial/noise/probability/#rare-events-are-counted-with-the-poisson-distribution)). For one part of a
picture to stand ten per cent above a level known in advance by five such deviations, $0.1N = 5\sqrt N$, so $N =
(5/0.1)^2 = 2500$, and $35{,}800/2500 = 14.3$ parts: about fourteen picture elements.[^2500]

The primordial glow of the universe, at 0.905 K ([section 12.2](/tutorial/sky/universe/)), has the number radiance $\sym{black-body-number-radiance}{N_{\rm bb}} =
\zeta(3)(\kB T/\hbar)^3/2\pi^3c^2 = 3.6\times10^{14}$ gravitons s⁻¹ m⁻² sr⁻¹, with $\zeta(3) = 1.202$. Above $x_0$, with
$\sym{planck-ratio}{x} = \hbar\omega/\kB T$, a black body keeps $\int_{x_0}^\infty x^2\,\dd x/(e^x - 1)\big/2\zeta(3)$ of
its quanta: above 2 THz, $4.1\times10^{-43}$ of the primordial glow and 0.980 of a body at 293 K with a constant
friction. So a filter at 2 THz removes the background, fluctuations included
([section 8.5](/tutorial/quantum/counting-quanta/#a-thermal-source-gives-geometric-counts-with-a-larger-spread)).

::: try {#graviton-count}
Arrivals on a time line, with a picture cut into parts of 2500 gravitons each. Predict first: how many picture elements
does a lifetime of the Earth below give on one square metre? Choose *The Earth below*, one square metre and the third
tick of *Exposure*. Then choose *Hot iron, 3.9 m*: does even the longest exposure give it one element?
:::

## The budget runs from a second to a hundred and ten million years

How long does a square metre that collects from every direction wait for one graviton?[^budget]

- **The Sun's core**: 1.4 seconds. **The Earth below**: 19.6 hours.
- **The hot iron at 3.9 m**: the hot block of the
  [closed furnace](/tutorial/glow/reading-section-vi/#the-closed-furnace-from-the-friction-of-iron-to-a-count-of-gravitons)
  sends $5.4\times10^{-14}$ gravitons a second in all directions. Spread over $4\pi(3.86\unit m)^2 = 187\unit{m^2}$,
  that is one per square metre every $1.1\times10^8$ years.
- **The turning pair at 4.5 m**: two 33 kg balls 0.44 m apart, turning at $\Omega = 2\pi\unit{s^{-1}}$, radiate
  $(32/5)G\mu^2a^4\Omega^6/c^5 = 1.1\times10^{-46}$ W, with $\mu = 16.5$ kg their reduced mass and $a = 0.44$ m
  ([section 7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole)).
  Along its axis a rotor shines $\tfrac52$ times its average over directions
  ([section 5.4](/tutorial/waves/polarization/#the-rotor-shines-eight-times-less-edge-on)), and each graviton carries
  $2\hbar\Omega = 1.33\times10^{-33}$ J, so a square metre waits $3.9\times10^7$ years, at their far-field rate.
- **The near field**: none is needed, because a static field is not radiation
  ([section 5.2](/tutorial/waves/retarded-waves/#inside-the-near-zone-the-field-is-the-static-field-of-the-source-as-it-is-now)).

A flat detector facing the ground weights each direction by $\cos\theta$, and $\int N\,\dd\Omega\big/\int
N\cos\theta\,\dd\Omega = 1.27$: it waits 1.3 times as long.

{{paper fig:budget}}

The figure counts what whole objects send in all directions, each by one of two laws. A body that turns radiates by
the quadrupole formula of
[section 7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole),
$P = (32/5)G\matter{\Delta I}^2\Omega^6/c^5$, with $\matter{\Delta I}$ the difference of its principal second moments
in the plane of turning ($\tfrac12\matter md^2$ for two masses $\matter m$ a distance $d$ apart, which gives $P =
(8/5)G\matter m^2d^4\Omega^6/c^5$), in gravitons of $2\hbar\Omega$, since its waves repeat twice in each turn. A warm
body of volume $V$ sends $4\pi Vj_N$, with $j_N = \int\alpha B_\omega\,\dd\omega/\hbar\omega$ from Kirchhoff's law.

The beam is a steel cylinder 20 m long, of radius 1 m and density $7800\unit{kg\,m^{-3}}$, so of mass $7800\pi\times
1^2\times20 = 4.90\times10^5$ kg, spun about a line across its middle [@MisnerThorneWheeler1973]. Each half pulls on
the middle with the force needed to keep it turning, $\int_0^{L/2}\matter\rho A\Omega^2x\,\dd x$ for a beam of length
$L$ and cross-section $A$, so the stress there is $\matter\rho\Omega^2L^2/8$: at $\Omega = 28\unit{s^{-1}}$ it is
$7800\times28^2\times20^2/8 = 0.31$ GPa, near what steel can bear, and the beam turns about as fast as it can. Its
second moments about the middle are $\matter ML^2/12$ along its length and $\matter Mr^2/4$ across it, with $r$ its
radius, so $\matter{\Delta I} = 4.90\times10^5\times(33.3 - 0.25) = 1.62\times10^7\unit{kg\,m^2}$. The pair of tonnes
turns at $\Omega = 300\unit{s^{-1}}$, 47.7 turns a second, so that each mass moves at $300\unit{m\,s^{-1}}$; the pair
of kilograms turns at sixteen a second. For the person and the litre the count per volume, $4\pi j_N$, comes from
adding water's friction spectrum, from simulation [@Schulz2020], over the Planck count at each temperature; for the
Earth the five shells of the capstone add $4\pi j_{N,k}V_k$:

| Object | Inputs | Power or count per volume | Gravitons per second |
|---|---|---|---|
| The Sun | gravitons of $2.70\,\kB T$ at $1.3\times10^7$ K, $4.85\times10^{-16}$ J | $10^8$ W | $2.1\times10^{23}$ |
| The Earth's interior | $1.08\times10^{21}\unit{m^3}$ in five shells at their bounds | $5.3\times10^{-12}\unit{m^{-3}\,s^{-1}}$ on average | $5.7\times10^9$ |
| A steel beam of 490 t | $\matter{\Delta I} = 1.62\times10^7\unit{kg\,m^2}$, $\Omega = 28\unit{s^{-1}}$ | $2.2\times10^{-29}$ W | $3.8\times10^3$ |
| Two masses of 1 t, 2 m apart | $\Omega = 300\unit{s^{-1}}$ | $5.1\times10^{-31}$ W | 8.1 |
| Two masses of 1 kg, 1 m apart | $\Omega = 100.5\unit{s^{-1}}$ | $4.6\times10^{-41}$ W | $2.1\times10^{-9}$ |
| A person | 70 L of water at 310 K | $1.86\times10^{-15}\unit{m^{-3}\,s^{-1}}$ | $1.3\times10^{-16}$ |
| A litre of boiling water | 1 L of water at 373 K | $2.73\times10^{-15}\unit{m^{-3}\,s^{-1}}$ | $2.7\times10^{-18}$ |

The bars span $2.1\times10^{23}/2.7\times10^{-18} = 8\times10^{40}$, forty powers of ten. The Earth's shells send
$2.3\times10^8$, $1.8\times10^9$, $3.4\times10^9$, $2.7\times10^8$ and $6.7\times10^5$ gravitons a second, from the
inner core out, 59% of them from the lower mantle. Spread over the surface, $4\pi R^2 = 5.10\times10^{14}\unit{m^2}$,
they are $1.12\times10^{-5}$ per square metre per second, which is what a flat detector facing the ground collects, $1.42\times10^{-5}/1.27$: every
graviton sent crosses the surface once. The person's count agrees with one graviton every $2.4\times10^8$ years of
section R10. The litre, hotter by a fifth, would send $(373/310)^3/70 = 1/40$ of the person if its friction were the
same at every frequency, $3.2\times10^{-18}$; water's friction falls at the higher frequencies of the hotter glow, and
it sends 16% less, about one graviton in the age of the universe. The kilograms give the one graviton every fifteen
years of section 7.7. The tonnes gain
$(300/100.5)^6\times10^6\times2^4 = 1.1\times10^{10}$ in power over them, and three times the energy per graviton leaves
$3.8\times10^9$ times the count.[^bars]

## One camera peels the layers, and the heights measure friction times temperature cubed

The line at $\theta$ passes the centre at $\sym{line-impact-parameter}{b} = R\sin\theta$, and for an emissivity that
depends only on the radius $r$ the sum along the line becomes the Abel transform of the profile $j_N(r)$, which can be
inverted
([section 5.6](/tutorial/waves/abel-transform/#the-transform-can-be-undone)):[^abel]

$$N(b) = 2\int_b^R \frac{j_N(r)\,r\,\dd r}{\sqrt{r^2 - b^2}} , \qquad
j_N(r) = -\frac{1}{\pi}\int_r^R \frac{\dd N}{\dd b}\,\frac{\dd b}{\sqrt{b^2 - r^2}} .$$

For uniform shells the inversion is [onion peeling](/tutorial/waves/abel-transform/#uniform-shells-are-peeled-from-the-outside-in)
from the crust inwards. At each boundary $\dd N/\dd b$ diverges as $(r - b)^{-1/2}$, and the crust's kink is at
$\arcsin(6346/6371) = 84.9°$.

The heights measure a product:

$$j_N = \frac{16\,G\,\matter\eta\,\sigma T^3}{2.70\,\kB\,c^3} .$$

Counts give $\matter\eta T^3$ and energies $\matter\eta T^4$, so together they give $T$ and $\matter\eta$; if the friction varies across the band, the temperature trades against its shape
([section 5.5](/tutorial/waves/radiance/#a-materials-brightness-is-its-friction-times-a-power-of-its-temperature)).

::: try {#onion-peel}
A round planet of up to five shells, a line of sight you drag, and the brightness against the angle from straight down.
Choose the Earth and answer the figure's three predictions. Then predict which shell a lifetime leaves least certain, turn on *Noise*, set *Counts in all* near 35,000 and press
*Peel*.
:::

## A lifetime places the edge of the core to 29 km

{{paper fig:earth-inverted}}

The figure's 35,619 is one simulated draw; its mean, 35,776, rounds to the 35,800 above, and it lies $(35{,}619 -
35{,}776)/\sqrt{35{,}776} = -0.8$ standard deviations from it.

The errors come from the Fisher information of the model
([section 3.3](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks)).
For Poisson counts with means $\mu_i$ in the rings $i$, the **Fisher matrix** is $F_{ab} = \sum_i(\partial\mu_i/\partial
p_a)(\partial\mu_i/\partial p_b)/\mu_i$ over the unknowns $p_a$, and each error is the square root of a diagonal entry
of $F^{-1}$. With 90 rings of one degree and nine unknowns, four radii and five emissivities, the forecast places the
top of the lower mantle to 5.2 km and the core's boundary to 28.9 km. It measures the emissivities of the crust, upper
mantle, lower mantle, outer core and inner core to 55.7, 2.96, 0.91, 1.75 and 6.4%. Masking the ring that holds the Sun, from 39° to 40°, moves the core's edge from 28.86 to 28.91 km.

The draw in the figure is made and read back as follows. The rings are the ninety bands of one degree from straight
down to the horizon, $\theta_i < \theta < \theta_i + 1°$. A square metre collecting for eighty years,
$t_{\rm obs} = 2.52\times10^9$ s, expects in ring $i$

$$\mu_i = t_{\rm obs}\sum_k j_{N,k}X_{ik}, \qquad X_{ik} = \int_{\theta_i}^{\theta_i + 1°}\ell_k(R\sin\theta)\,
2\pi\sin\theta\,\dd\theta ,$$

where $\ell_k(b)$ is the chord of shell $k$ along the line at impact parameter $b$, so that $X_{ik}$, in metre
steradians, is the chord weighted by the ring's solid angle. Each ring's count $K_i$ is drawn from a Poisson
distribution of mean $\mu_i$; the Sun's gravitons are left out, as a mask over its patch a tenth of a degree across would
leave them. The fit finds the nine unknowns $p_a$, the five emissivities and the four inner radii, with the outer radius
held at 6371 km, which light measures, that make the Poisson log-likelihood

$$\ln\mathcal L = \sum_i\bigl(K_i\ln\mu_i - \mu_i\bigr)$$

largest. It climbs by Newton's method with the Fisher matrix in place of the second derivatives, $p \to p +
F^{-1}\nabla\ln\mathcal L$, from radii a few per cent off, and the errors are the square roots of the diagonal of
$F^{-1}$ at the top. The fitted radii are $1281 \pm 41$, $3499 \pm 28$, $5709 \pm 5$ and $6350 \pm 3$ km, against the
model's 1221.5, 3480, 5701 and 6346 km, so they lie 1.4, 0.7, 1.6 and 1.4 standard deviations off, as the radii of a
single draw may. Their errors differ a little from the forecast's because $F$ is taken at the fitted values instead of
the model's. Repeated over two hundred draws, the fitted radii scatter by 36, 28, 4.7 and 2.7 km, close to the
forecast's 39, 28.9, 5.2 and 2.3 km: the Fisher matrix is the curvature of the likelihood at its top, and it predicts
the scatter as far as the likelihood is a parabola over the range that the draws explore. The fitted emissivities,
divided by $16G\sigma T^3/2.70\,\kB c^3$ at each shell's temperature, give back the shells' frictions, the lower
mantle's to within 1.3%.[^inverted]

Every count, and the Fisher information with it, grows as $\matter\eta\,\sym{exposure-time}{t_{\rm obs}}$, so the errors
scale as $1/\sqrt{\matter\eta\,t_{\rm obs}}$. 
The draw's fitted inner-core radius is $1281 \pm 41$ km, against the forecast's 39 km. A planet that is not
round needs [the tomography of section 5.6](/tutorial/waves/abel-transform/#a-body-that-is-not-round-needs-views-from-many-directions).

## Real materials may hide the core in counts, but not in colour

To match the placeholder's count, $10^{-3}$ Pa s, a material needs a **relaxing stiffness**
$\sym{relaxing-stiffness}{\Delta\matter\mu}$, the part of its stiffness that its friction relaxes, of 0.87 TPa at 2800 K
and 1.70 TPa at 5500 K, several times any shell's. The core's two free electrons per atom, at 11,000 kg m⁻³ and 55.85
atomic mass units per atom, make $\sym{electron-density}{\matter n} = 2\times11{,}000/(55.85\times1.661\times10^{-27}) =
2.37\times10^{29}\unit{m^{-3}}$. Their Fermi energy $\sym{fermi-energy}{E_F} = \hbar^2(3\pi^2\matter n)^{2/3}/2m = 14.0$
eV gives the weight $\tfrac25\matter nE_F = 0.21$ TPa. So the bounds run from 15.8% of the placeholder's count, for the outer core, to 33.8%, for the lower mantle. The mantle's vibrations end near 33 THz and its pairs near 66 THz, below the count's peak at 2800 K, $1.594\,\kB T/h = 93$ THz.

*The core's electrons.* The collision time $\tau$ follows from a resistivity $\sym{resistivity}{\rho_e}$ of order a micro-ohm metre
[@Pozzo2012] by Drude's $\tau = m/\matter ne^2\rho_e$, with $e$ the electron's charge
([section R10](/tutorial/glow/reading-section-vi/#free-electrons-give-copper-its-friction-and-iron-a-ceiling)); at
$1\unit{\mu\Omega\,m}$ it is $1.50\times10^{-16}$ s, a fraction of a femtosecond. The friction $\tfrac25\matter
nE_F\,\tau/(1 + \omega^2\tau^2)$ is then $3.2\times10^{-5}$ Pa s at low frequency, and weighted by the count over the
band it is the count-equivalent friction $\sym{count-friction}{\matter\eta_N}$:

$$\begin{aligned}
\frac{\matter\eta_N}{10^{-3}\unit{Pa\,s}}
&= \frac{1}{2\zeta(3)}\int_0^\infty\frac{\mathrm{Re}\,\matter\eta}{10^{-3}\unit{Pa\,s}}\,\frac{x^2\,\dd x}{e^x - 1}\\
&= 0.030
\end{aligned}$$

at 4500 K, about 3%. The outer core's 15.8% is also a ratio of counts at 4500 K, so 3.0% is 0.19 of it: a fifth of what
the bound grants.

*In colour it does.* A flat friction gives gravitons of mean energy $2.70\,\kB T$, 1.05 eV at 4500 K. A mean energy
weights by $x^3$ where a count weights by $x^2$, so with the electrons' fall above $1/\tau$ it is 0.91, 0.995 and 1.04 eV
at 0.5, 1 and 3 µΩ m. The mantle's flat band below $x_c = 0.566$ (33 THz) or 1.13 (66 THz) at 2800 K gives

$$\begin{aligned}
\bar E &= \kB T\,\frac{\int_0^{x_c}x^3\,\dd x/(e^x - 1)}{\int_0^{x_c}x^2\,\dd x/(e^x - 1)}\\
&= 0.089\ \text{or}\ 0.172\unit{eV}.
\end{aligned}$$

At 33° the colour steps by $0.91/0.172 = 5.3$ to $1.04/0.089 = 11.7$: a factor of five to twelve.

::: try {#planck-spectrum}
Planck's law at a temperature you choose. Predict first: is a quantum from the outer core, at 4500 K, nearer a tenth of an
electronvolt or one? Choose *Outer core* and read *The mean energy*. Then choose *Count of quanta*, set 2800 K, and
predict whether the count peaks above or below the mantle's highest vibrations, near 33 THz.
:::

## No detector made of matter could catch these gravitons

A detector absorbs through the friction by which matter glows, so the sum rule bounds both. The optical depth of a path
$L$, added over angular frequency, is $8\pi^2GL\Delta\matter\mu/c^3$: $5.87\times10^{-24}\unit{s^{-1}}$ for a metre of
30 GPa
([section 10.3](/tutorial/glow/why-matter-barely-glows/#no-material-can-glow-brighter-than-its-weight-allows)). The band
of room-temperature heat is $\kB T/\hbar = 3.84\times10^{13}\unit{s^{-1}}$ wide at 293 K, so a metre stops at most
$5.87\times10^{-24}/3.84\times10^{13} = 1.5\times10^{-37}$ of what crosses it; diamond's 536 GPa, 18 times 30 GPa, does
not change this.

A cubic metre crossed by one graviton a second counts one every $1/1.53\times10^{-37}$ s, $2.1\times10^{29}$ years,
$1.5\times10^{19}$ times the universe's age of $1.38\times10^{10}$ years, as Dyson and Rothman and Boughn found [@Dyson2013; @RothmanBoughn2006].[^arrival]

## Recording adds half a quantum, so a thermal camera must count

Each mode of the glow that reaches a pixel holds $10^{-30}$ gravitons or fewer on average. A thin body sends a pixel the
occupation $\sym{optical-depth}{\tau}\bar n$
([section 10.2](/tutorial/glow/kirchhoff/#what-a-pixel-receives-holds-far-less-than-one-quantum-per-mode)): its optical
depth, a pure number, times the thermal occupation $\bar n = 1/(e^x - 1)$. Summed over the shells straight down it is $7.8\times10^{-31}$ at 30 THz and $1.4\times10^{-31}$ at 100 THz.

Recording both quadratures of a mode adds at least half a quantum of noise [@Caves1982]
([section 8.6](/tutorial/quantum/quantum-limit/#recording-both-quadratures-of-a-wave-adds-half-a-quantum-of-noise)),
$5\times10^{29}$ times the glow's $10^{-30}$. A counter adds none, because an empty mode never clicks
([section 8.5](/tutorial/quantum/counting-quanta/#counting-adds-no-noise-but-needs-quanta)), but it loses the phase that
the delay-and-add of section 5.3 needs to combine pixels. Tsang's scaling with the occupation against its square
[@Tsang2011; @CarneyDomckeRodd2024], repeaters [@Gottesman2012] and a converter [@Dyson2013] are discussed
elsewhere;[^beam] the near field is unaffected.

## A counting pixel finds the Sun's core to a degree in half an hour

One graviton of helicity two from $\hat n$ leaves the pixel's five modes in a coherent state of spin two
([section 8.4](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky)).[^convention] The measurement made of all such
states clicks at the angle $\vartheta$ from $\hat n$ with the density $(5/4\pi)\cos^8(\vartheta/2)$, and never in an empty
mode
([section 8.6](/tutorial/quantum/quantum-limit/#a-measurement-is-a-set-of-positive-tables-that-add-to-one-and-a-gravitons-click-carries-about-a-bit)).
For spin $s$ a click carries $\log_2(2s + 1) - 2s/[(2s + 1)\ln2]$ bits, 1.168 for $s = 2$ and 0.623 for $s = 1$, and the
Fisher information is $s = 2$ per angle against the quantum limit $2s = 4$.

At one graviton a second, half an hour gives 1800 clicks, the Fisher information 3600 per angle and an error of
$1/\sqrt{3600}$ rad $= 0.95°$: a degree in half an hour.[^rate] The pixel sees the sky only to degree four, the 25 numbers of its brightness ([section 9.6](/tutorial/one-point/the-sky-at-one-point/#the-pixel-sees-the-sky-only-up-to-degree-four-68-numbers)).

## The capstone: the Sun at midnight, from stiffness to the edge of the core

We follow the first image end to end, shell by shell from the crust in, with the Sun at an equinox
(Figure [](#fig:read-ix-capstone)).

![Look first at the bar: a lifetime's 35,800 gravitons, mostly from the lower mantle. The grazing lines place the
boundaries whatever the frictions, and the line to the Sun's core passes between the kinks at 63° and 33°. Sizes of
the Sun and distances schematic; every number from the capstone.](tut-read-ix-capstone){#fig:read-ix-capstone}

**(a) Each shell's friction and glow.** A relaxing stiffness $\Delta\matter\mu$ sends at most
$5.18\,G\Delta\matter\mu(\kB T)^2/\hbar^2c^5$ gravitons per second per cubic metre, and the placeholder sends $4\pi
j_N(10^{-3}\unit{Pa\,s}, T)$. A shell's share is the first over the second: for the lower mantle,
$5.62\times10^{-12}/1.66\times10^{-11} = 0.338$. Each shell's $j_N$ is its bound over $4\pi$, in gravitons
s⁻¹ m⁻³ sr⁻¹:

| Shell | $T$ (K) | $\Delta\matter\mu$ (GPa) | Share of the placeholder | $j_N$ | Chord straight down (km) | Share of the count |
|---|---|---|---|---|---|---|
| Crust | 700 | 44 | 0.203 | $4.2\times10^{-15}$ | 50 | 12 gravitons |
| Upper mantle | 1700 | 130 | 0.247 | $7.3\times10^{-14}$ | 1290 | 7.5% |
| Lower mantle | 2800 | 293 | 0.338 | $4.47\times10^{-13}$ | 4442 | 62% |
| Outer core | 4500 | 220 | 0.158 | $8.68\times10^{-13}$ | 4517 | 27% |
| Inner core | 5500 | 400 | 0.235 | $2.36\times10^{-12}$ | 2443 | 3.2% |

The inner core's $j_N$ is 560 times the crust's, mostly through $(5500/700)^3 = 485$.

**(b) Straight down.** The chords add to 12,742 km, and $N = \sum_kj_{N,k}\ell_k = 1.18\times10^{-5}$ with $\ell_k$ the
chord of shell $k$: 49% from the inner core and 33% from the outer. The table's last column shares out the 35,800
gravitons of eighty years; the inner core gives half the brightness straight down but 3% of the count, because it fills
only $2\pi(1 - \cos11.05°) = 0.12$ sr of the $2\pi$ below.

**(c) The Sun beyond.** The line to the Sun leaves at 40°, between the kinks at 63° and 33°, through 65 km of crust,
1763 km of upper mantle and 7932 km of lower mantle, where the ground reads $3.7\times10^{-6}$. At the Sun's
$1.3\times10^7$ K the band is $\kB T/\hbar = 1.70\times10^{18}\unit{s^{-1}}$ wide, so a metre of 30 GPa stops at most
$5.87\times10^{-24}/1.70\times10^{18} = 3.4\times10^{-42}$ of its gravitons, and a cubic metre crossed by the Sun's 0.73 a
second waits at least $1.3\times10^{34}$ years for one count.

**The idea to keep: no shell can glow beyond its stiffness, so the whole Earth sends a square metre one graviton every
twenty hours. A lifetime's 35,000 gravitons draw fourteen picture elements or place the core's edge to 29 km, and no
detector made of matter could catch them.**

::: problems
### Practice

**[R10b]** Rerun the hot iron of the budget for a block at 3000 K, its friction still falling as $1/T$: its wait on a
square metre at 3.86 m, and its count against that of the cold block, the same block at 293 K.

::: solution
Its count grows as $\matter\eta T^3 \propto T^2$, four times the 1500 K block's, so the wait is $1.1\times10^8/4 =
2.7\times10^7$ years, and $(3000/293)^2 = 105$ times the cold block's count.
:::

**[R10b]** Where does the Sun's core appear in the 86° frame at an equinox, as a fraction of the half-height below its
centre? Is it inside the frame at the two solstices?

::: solution
It is $50° - 33° = 17°$ below the centre, at $\tan17°/\tan43° = 0.328$ of the half-height. In June it is 26.6° below
the horizon, 6.4° above the centre, at 0.120 of the half-height above it; in December 73.4° below the horizon, 40.4° below
the centre, at 0.913: near the foot, but inside.
:::

**[R10b]** How many rows would the frame need for the Sun's core, 0.107° across, to fill one pixel at its centre?

::: solution
A pixel at the centre spans $2\tan43°/H$ rad for $H$ rows, so $H = 1.865/1.87\times10^{-3} = 999$: about a thousand
rows, 2.8 times the 360.
:::

**[R10b]** Recompute the beam of the budget at half its length, turning at the same stress at its middle.

::: solution
The stress $\matter\rho\Omega^2L^2/8$ fixes $\Omega L$, so $\Omega = 56\unit{s^{-1}}$. The mass halves to $2.45\times10^5$
kg and $\matter{\Delta I} = 2.45\times10^5\times(8.33 - 0.25) = 1.98\times10^6\unit{kg\,m^2}$, so $P = (32/5)G
\matter{\Delta I}^2\Omega^6/c^5 = 2.1\times10^{-29}$ W, almost as before; each graviton carries twice the energy, so
the beam sends $1.8\times10^3$ a second, half as many.
:::

### Stretch

**[R10b]** Give every shell the placeholder friction instead of its bound. What do eighty years give, and how well is the
core's edge placed?

::: solution
Every $j_N$ grows by $1/0.158$ to $1/0.338$, so the count becomes $1.43\times10^5$. The same Fisher forecast places the
core's edge to 5.6 km, better than $29/\sqrt4$ km, because the outer core gains the most and its kink sharpens.
:::

**[R10b]** In Eddington's model $\theta = 0.753$ at a fifth of the Sun's radius. By what factors do the glow per unit
frequency and the power per volume fall from the centre to there?

::: solution
They go as $\matter n^2T^{1/2} \propto \theta^{13/2}$ and $\matter n^2T^{3/2} \propto \theta^{15/2}$:
$0.753^{6.5} = 0.158$ and $0.753^{7.5} = 0.119$, a sixth and an eighth.
:::

**[R10b]** With the radii known and only the overall scale $j$ of the emissivities unknown, the rings expect $\mu_i =
ja_i$. Find the maximum-likelihood $j$ and its error.

::: solution
$\partial\ln\mathcal L/\partial j = \sum_iK_i/j - \sum_ia_i = 0$ gives $j = \sum_iK_i/\sum_ia_i$. The Fisher
information is $\sum_ia_i^2/\mu_i = \sum_ia_i/j$, so the fractional error is $1/\sqrt{j\sum_ia_i} = 1/\sqrt{\sum_i\mu_i}$:
for 35,619 gravitons, 0.53%. Each unknown added beside it can only enlarge this error.
:::

### The camera

**[R10b]** Reproduce the numbers of the argument that no detector made of matter can catch these gravitons.

::: solution
$\kB\times293/\hbar = 3.84\times10^{13}\unit{s^{-1}}$; $8\pi^2G\times1\times3\times10^{10}/c^3 =
5.87\times10^{-24}\unit{s^{-1}}$; the ratio is $1.53\times10^{-37}$, and $1/1.53\times10^{-37}$ s $= 2.1\times10^{29}$ years.
:::

**[R10b]** Reproduce the Earth's bar of the budget from the capstone's table.

::: solution
The shells' volumes, from the inner core out, are $7.63\times10^{18}$, $1.69\times10^{20}$, $6.00\times10^{20}$,
$2.94\times10^{20}$ and $1.27\times10^{19}\unit{m^3}$. Times $4\pi j_N$ they give $2.3\times10^8$, $1.8\times10^9$,
$3.4\times10^9$, $2.7\times10^8$ and $6.7\times10^5$ gravitons a second, $5.7\times10^9$ in all.
:::
:::

::: paper
- Section IX's opening: [](/paper/#eq:column), Figures [](/paper/#fig:sun-at-midnight) and [](/paper/#fig:earth-glow).
- [*The graviton budget*](/paper/#par:the-graviton-budget): Table [](/paper/#tab:budget), Figure [](/paper/#fig:budget).
- [*Recovering the layers*](/paper/#par:recovering-the-layers): [](/paper/#eq:abel), [](/paper/#eq:abel-inverse) and
  [](/paper/#eq:jN-friction), Figure [](/paper/#fig:earth-inverted).
- The last three paragraphs, from [*What the Earth's materials allow*](/paper/#par:what-the-earths-materials-allow):
  [](/paper/#eq:glow-bound).
:::

::: deeper
- A. M. Dziewonski and D. L. Anderson, *Physics of the Earth and Planetary Interiors* 25 (1981) 297: the shells.
- F. J. Dyson, *International Journal of Modern Physics A* 28 (2013) 1330041: why no detector could catch a graviton.
:::

[^ninth]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. IX](/paper/#sec:first-image).

[^column]: This is equation [](/paper/#eq:column) of *The gravitational camera* (Mohsenvand 2026), Sec. IX.

[^bound]: The bound is equation [](/paper/#eq:glow-bound) of *The gravitational camera* (Mohsenvand 2026), in
    [*What the Earth's materials allow*](/paper/#par:what-the-earths-materials-allow).

[^abel]: First shown in *The gravitational camera* (Mohsenvand 2026), as its equations [](/paper/#eq:abel) and
    [](/paper/#eq:abel-inverse), in [*Recovering the layers*](/paper/#par:recovering-the-layers), with the next equation
    as [](/paper/#eq:jN-friction).

[^2500]: Telling two measured parts apart, with no level known, needs about 5000 counts each: about seven elements.

[^budget]: First shown in *The gravitational camera* (Mohsenvand 2026), as its Table [](/paper/#tab:budget), in
    [*The graviton budget*](/paper/#par:the-graviton-budget).

[^equinox]: At midnight the Sun lies the latitude plus its declination from straight down: 16.6° at the December
    solstice and 63.4° in June.

[^fifth]: The uniform inner fifth is the model of *The gravitational camera* (Mohsenvand 2026),
    [Sec. IX](/paper/#sec:first-image).

[^bars]: The bars are Fig. [](/paper/#fig:budget) of *The gravitational camera* (Mohsenvand 2026), in
    [*The graviton budget*](/paper/#par:the-graviton-budget).

[^inverted]: First shown in *The gravitational camera* (Mohsenvand 2026), Fig. [](/paper/#fig:earth-inverted).

[^frame]: First shown in *The gravitational camera* (Mohsenvand 2026), Fig. [](/paper/#fig:sun-at-midnight).







[^arrival]: First shown in *The gravitational camera* (Mohsenvand 2026), in
    [*Arrival and absorption*](/paper/#par:arrival-and-absorption).

[^beam]: See [*Counting or recording*](/paper/#par:counting-or-recording) in *The gravitational camera* (Mohsenvand 2026),
    which writes the delay-and-add as equation [](/paper/#eq:beam).

[^convention]: A graviton from $\hat n$ travels along $-\hat n$, so its state points along $-\hat n$; labelled by the
    opposite direction, the clicks peak at the source, $5/4\pi = 0.40$ per steradian.

[^rate]: At the model's 0.733 a second, half an hour gives 1.12°.
