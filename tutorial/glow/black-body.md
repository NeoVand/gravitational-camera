---
id: '10.1'
title: "The black body and Planck's law; Bose integrals"
question: 'Section VI writes "the Planck radiance $B_\omega(T) = \hbar\omega^3/[4\pi^3c^2(e^{\hbar\omega/k_BT} - 1)]$, summed over the two polarizations", and chapter 5.5 took it on trust. Where does this formula come from, and what do its integrals give the camera: the power of a glow, its number of gravitons, their mean energy and the frequency where the glow is brightest?'
part: '10'
requires: ['4.2', '5.5', '6.3', '8.3']
paper: [sec:thermal, eq:kirchhoff, eq:glow-bound, sec:first-image, eq:jN-friction, sec:regimes, fig:regimes, sec:vistas, eq:graviton-temperature]
figures: [fig:regimes]
live: [scene-closed-furnace, planck-spectrum]
depth: A
---

<!-- hero: Part 10's hero, the closed furnace cut open (P6a-DECISIONS item 6), is made after the part's chapters. -->

**What you need:** chapter [4.2](/tutorial/response/temperature/)'s equipartition, chapter
[5.5](/tutorial/waves/radiance/)'s radiance and enclosure radiation, chapter [8.3](/tutorial/quantum/quanta/)'s modes
of a wave and their thermal quanta, and, for the last section, chapter [6.3](/tutorial/relativity/aberration/)'s
Doppler factor.

The paper's closed furnace, in [Section VI](/paper/#sec:thermal), is a pair of closed steel furnaces, each holding an
identical block of iron, one at 293 K, room temperature, and the other at 1500 K. They look the same and weigh the same,
yet the camera sees the hot iron through the steel, as chapter
[0.3](/tutorial/evening/waves-and-heat/#the-glow-shows-what-light-and-weight-cannot-but-it-is-faint) told.

::: try {#scene-closed-furnace}
Predict first: the hot block is about five times as hot as the cold one. Will it look about five times as bright in
the glow, or far brighter? Drag the divider to the left, so that both furnaces are seen in the glow.
:::

The answer depends on how the count of gravitons grows with temperature. Section VI says that if the friction
"depended neither on frequency nor on temperature, the number of gravitons emitted would grow as $T^3$ and the hot
block would outshine the cold one more than a hundredfold": $(1500/293)^3 = 134$. A metal's friction falls as $1/T$,
so its count grows as $T^2$, and $(1500/293)^2 = 26$ is the paper's "nearer 25". That $T^3$ is the count of quanta
of a black body, the glow that fills a closed box whose walls are at one temperature, and this chapter derives it.

Part 10 builds the glow in three steps: this chapter finds the black body, chapter 10.2 (Kirchhoff's law and detailed
balance) shows that matter glows by its absorption times the black body, and chapter 10.3 (why matter barely glows)
finds that absorption. The paper's [*Emission*](/paper/#par:emission) gives the black body as "the Planck radiance
$B_\omega(T) = \hbar\omega^3/[4\pi^3c^2(e^{\hbar\omega/k_BT} - 1)]$, summed over the two polarizations", which chapter
5.5 stated without proof. So we ask where this formula comes from, and what its integrals give the camera.

::: plain
A closed box whose walls are at one temperature fills with a glow that depends only on that temperature, called
black-body radiation.

To find it, we count the waves that fit in the box. The number of ways to fit a wave grows as the square of its
frequency. Each wave that fits behaves like a spring. Heat gives it, on average, a definite number of quanta, the
smallest packets of energy it can hold, and waves of very high frequency get almost none. Multiplying the number of
waves by the energy each holds gives Planck's law.

Adding Planck's law over all frequencies gives the total power, which grows as the fourth power of the temperature.
Counting quanta instead gives the number of gravitons, which grows as the cube. Each graviton carries on average 2.7
times the energy that heat gives one long wave in the box.
:::

## A closed box fills with a glow that depends only on its temperature

We want the radiance of the glow inside a closed box. Chapter
[5.5](/tutorial/waves/radiance/#a-warm-bodys-glow-over-its-absorption-is-the-radiance-of-an-enclosure-at-its-temperature)
showed that it cannot depend on the walls: otherwise a window passing one frequency would let heat flow by
itself between two boxes at the same temperature. So the radiance of **enclosure radiation**, the radiation inside a
closed box whose walls are at one temperature, depends only on the temperature $\sym{temperature}{T}$, in kelvin,
and the angular frequency $\omega$, in radians per second.

This radiation is called **black-body radiation**, or a **black body** for short, as in chapter 6.3, because a body
that absorbs everything falling on it glows in exactly this way.[^name] Its radiance is chapter 5.5's Planck radiance
$\sym{planck-radiance}{B_\omega(T)}$, in $\mathrm{W\,m^{-2}\,sr^{-1}}$ per unit of angular frequency. We count the
waves that fit in an empty cube of side $D$, give each the thermal energy of chapter 8.3's oscillator, and add them
up.

## The number of waves that fit in a box grows as the square of their frequency

We want the number of waves of each frequency that fit in the cube, per cubic metre, as chapter
[8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons)
counted them. We assume that **opposite faces of the cube are joined**, so that a wave leaving through one face comes
back through the other. A real box has walls, but when it is much larger than the wavelength the number of waves per
cubic metre does not depend on its walls,[^shape] so we choose the condition easiest to count. A wave
$e^{i\vect k\cdot\vect x}$ then fits when a whole number of its wavelengths spans the cube along each axis, that is,
when its wavevector $\vect k$ lies on chapter
[2.6](/tutorial/outside/fourier/#an-area-holds-a-countable-number-of-ripples)'s grid

$$\vect k = \frac{2\pi}{D}\,(n_1, n_2, n_3) , \qquad n_1, n_2, n_3 = 0, \pm1, \pm2, \ldots$$

Each wave that fits is a **mode**, an oscillator of angular frequency $\omega = c|\vect k|$, with $c$ the speed of
light. The grid has one point in each small cube of volume $(2\pi/D)^3$ in the space of wavevectors, so a region of
volume $\dd^3k$ holds $D^3\,\dd^3k/(2\pi)^3$ modes for each polarization.[^halves]

The wavevectors whose length lies between $k$ and $k + \dd k$ fill a spherical shell of radius $k$ and thickness
$\dd k$, of volume $4\pi k^2\,\dd k$, so the shell holds

$$\sym{mode-number}{\dd N_{\rm modes}} = \frac{D^3}{(2\pi)^3}\,4\pi k^2\,\dd k = \frac{D^3k^2\,\dd k}{2\pi^2}$$

modes of each polarization. We put in $k = \omega/c$ and $\dd k = \dd\omega/c$, and divide by the volume $D^3$:

$$\boxed{\frac{\dd N_{\rm modes}}{D^3\,\dd\omega} = \frac{\omega^2}{2\pi^2c^3}}\quad\text{for each polarization.}
\label{eq:mode-density}$$

This is the **mode density**, the number of modes per cubic metre and per unit of angular frequency. Its unit is
$\mathrm{s^{-2}}$ divided by $\mathrm{m^3\,s^{-3}}$, which is $\mathrm{m^{-3}}$ per $\mathrm{s^{-1}}$, as it should
be. A gravitational wave has two polarizations, chapter
[7.6](/tutorial/geometry/gravitational-waves/#of-the-ten-amplitudes-of-a-plane-wave-two-are-physical)'s $h_+$ and
$h_\times$, so it has twice this many modes. Light also has two, and so the same count.

<!-- diagram: tut-planck-shell — Two panels side by side (one above the other on a phone), about 640 × 300 px at 1440.
Left: chapter 8.3's grid in the (k_x, k_y) plane, a square lattice of small dots with spacing 2π/D marked once by a
bracket, and a thin ring of radius k and width dk shaded in a pale neutral; one small square cell of side 2π/D drawn
round one dot; the label "2πk dk" beside the ring. Right: the same idea in three dimensions, a sphere of radius k cut
open to show a shell of thickness dk, labelled "4πk² dk", with a few lattice dots on its surface. No colour roles (the
grid and the shell are neutral). Caption: "Look first at the shaded ring: each dot is one wave that fits in the box,
one per cell of area (2π/D)², so the ring holds 2πk dk D²/(2π)² of them. In three dimensions the shell holds
4πk² dk D³/(2π)³, which grows as the square of the frequency. The dots are drawn far wider apart than in a real
box." -->

**Check.** The count does not depend on the shape of the box (the margin note above). **Number.** The 293 K glow is
brightest at 17.2 THz ([below](#the-energy-of-the-glow-peaks-at-2.82-thermal-energies-and-the-count-at-1.59)), an
angular frequency of $1.08\times10^{14}\unit{s^{-1}}$. Up to that frequency, two polarizations give
$\omega^3/3\pi^2c^3 = 1.6\times10^{15}$ modes in each cubic metre, but the whole glow holds only $5.1\times10^{14}$
quanta per cubic metre ([below](#a-black-body-holds-an-energy-and-a-number-of-quanta-in-each-cubic-metre)), so most
modes are empty.

**Meaning.** The number of ways to fit a wave grows as $\omega^2$, because the shell of wavevectors grows in area.

## Each mode holds the thermal quanta of an oscillator, and the product is Planck's law

We want the energy in each band of frequency, and then the radiance. We assume that **the radiation is in thermal
equilibrium with the walls at the temperature $T$**. Then chapter
[8.3](/tutorial/quantum/quanta/#a-warm-mode-holds-about-k_bthbaromega-quanta)'s result holds for every mode: an
oscillator of angular frequency $\omega$ holds on average

$$\sym{occupation}{\bar n} = \frac{1}{e^x - 1} , \qquad \sym{planck-ratio}{x} = \frac{\hbar\omega}{\kB T} ,$$

quanta, each of energy $\hbar\omega$. Here $\sym{hbar}{\hbar} = 1.055\times10^{-34}\unit{J\,s}$ is the reduced Planck
constant and $\sym{boltzmann}{\kB} = 1.381\times10^{-23}\unit{J\,K^{-1}}$ is Boltzmann's constant, so $\kB T$ is the
typical thermal energy, $4.05\times10^{-21}$ J at 293 K. The pure number $x$, the size of one quantum in units of $\kB
T$, is the paper's letter in [*A bound on the glow*](/paper/#par:a-bound-on-the-glow) and 8.3's $z$. The mean $\bar n$
is the **occupation number**, the mean of chapter 8.5's geometric counts. We drop each mode's zero-point energy
$\tfrac12\hbar\omega$: it changes no difference of energy (8.3's gap box), and what a body emits holds $\bar n$, not
$\bar n + \tfrac12$ (chapter
[8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-body-can-take-energy-from-a-push-but-has-none-to-give)'s two
orders).

**The energy density.** Let $\sym{spectral-energy-density}{\mathcal U_\omega}$ be the energy per cubic metre and per
unit of angular frequency, in $\mathrm{J\,m^{-3}}$ per $\mathrm{s^{-1}}$.[^U] Each band holds two polarizations, each
with the mode density [](#eq:mode-density), and each mode holds $\bar n$ quanta of $\hbar\omega$:

$$\mathcal U_\omega = 2\cdot\frac{\omega^2}{2\pi^2c^3}\cdot\hbar\omega\,\bar n = \frac{\hbar\omega^3}{\pi^2c^3}\,
\frac{1}{e^{\hbar\omega/\kB T} - 1} .$$

**From energy density to radiance.** We assume that **the glow is the same in every direction**, as it is in a closed
box. The radiation travelling within a small solid angle $\dd\Omega$ then carries the share $\dd\Omega/4\pi$ of the
energy. It moves at $c$, so in one second the part that crosses a square metre facing its direction fills a column
$c$ metres long, and carries $c\,\mathcal U_\omega\,\dd\Omega/4\pi$ per unit of $\omega$. By 5.5's definition of the
radiance, $\dd P = I_\omega\,\dd A\,\dd\Omega\,\dd\omega$, this is $B_\omega\,\dd\Omega$, and

$$B_\omega = \frac{c\,\mathcal U_\omega}{4\pi} .$$

Putting in $\mathcal U_\omega$ gives **Planck's law**,

$$\boxed{B_\omega(T) = \frac{\hbar\omega^3}{4\pi^3c^2}\,\frac{1}{e^{\hbar\omega/\kB T} - 1}} ,$$

the paper's form, summed over the two polarizations, which chapter 5.5 stated. Units: $\hbar\omega^3/c^2$ is
$\mathrm{J\,s\cdot s^{-3}/m^2\,s^{-2}} = \mathrm{J\,m^{-2}} = \mathrm{W\,s\,m^{-2}}$, which is $\mathrm{W\,m^{-2}}$
per $\mathrm{s^{-1}}$, and the $4\pi$ made it per steradian.

**Low frequencies.** When $\hbar\omega \ll \kB T$, $x$ is small, $e^x - 1 \approx x$, and $\bar n \approx \kB
T/\hbar\omega$. Then

$$B_\omega \approx \frac{\omega^2\kB T}{4\pi^3c^2} ,$$

the **Rayleigh–Jeans law**. Each mode holds $\kB T$, the share that chapter
[4.2](/tutorial/response/temperature/#heat-gives-every-quadratic-term-in-the-energy-the-same-share)'s equipartition
gives an oscillator. This classical answer grows as $\omega^2$ without limit, so a classical box would hold an
infinite energy (the box below).

**High frequencies.** When $\hbar\omega \gg \kB T$, $\bar n \approx e^{-\hbar\omega/\kB T}$, and $B_\omega$ falls as
$\omega^3e^{-\hbar\omega/\kB T}$. This fall is the **Wien tail**. Its modes are 8.3's frozen modes: one quantum costs
far more than heat can supply, so they almost never hold one, and the total stays finite.

**Number.** The classical law fails over most of the glow. Only 3.5% of the energy lies below $\hbar\omega = \kB
T$,[^share] and at $\hbar\omega = \kB T$ itself the Rayleigh–Jeans law overstates the radiance by $e - 1$, or 72%.
Both numbers depend on $x$ alone, so they are the same at every temperature.

<!-- diagram: tut-planck-curves — One panel, about 640 × 380 px at 1440 (full width on a phone). B_ω against
frequency f = ω/2π from 0 to 250 THz on linear axes, for 293 K, 700 K and 1500 K, three neutral greys from light to
dark (temperatures are neutral). On each curve a small filled dot at the energy peak, f = 2.821 k_BT/h (17.2, 41.2,
88.2 THz), and a small open dot at the number peak of B_ω/ħω, f = 1.594 k_BT/h (9.73, 23.2, 49.8 THz), placed on the
curve at that frequency. The Rayleigh–Jeans line ω²k_BT/4π³c² for 1500 K dashed, leaving the frame upward. Axis labels
"frequency (THz)" and "B_ω", no numbers on the vertical axis (shape only). Caption: "Look first at the dashed line:
the classical law follows the 1500 K curve only at the lowest frequencies, then climbs without limit, while the true
glow turns over and dies away. Filled dots mark where the energy per unit frequency peaks, open dots where the count of
quanta peaks; both move in proportion to the temperature. All curves are exact." -->

**Meaning.** A black body is a set of oscillators, each holding chapter 8.3's thermal occupation. Light and gravity
differ only in what their quanta are, photons or gravitons (that gravitational waves come in quanta is stated, in
chapter 8.3's gap box), so their black bodies have the same radiance.

::: history
### Planck's guess and the ultraviolet catastrophe

In June 1900 Lord Rayleigh applied equipartition to the waves in a box; its infinite total was later called the
**ultraviolet catastrophe** (Ehrenfest, 1911). On 14 December 1900 Max Planck derived the measured law by letting the
walls' oscillators hold energy only in steps proportional to their frequency. Satyendra Nath Bose derived it in 1924
by counting quanta in cells, as this chapter does.
:::

## Three integrals of one kind give the power, the count and the mean energy

We want three totals over all frequencies: the power, the number of quanta, and their ratio, the mean energy of a
quantum. With $\omega = (\kB T/\hbar)\,x$, each becomes a constant times $\int_0^\infty x^n\,\dd x/(e^x - 1)$, with $n
= 3$ for the energy and $n = 2$ for the count.

**The integrals.** For $x > 0$, $e^{-x} < 1$, so chapter 8.3's geometric series gives

$$\frac{1}{e^x - 1} = \frac{e^{-x}}{1 - e^{-x}} = \sum_{j=1}^\infty e^{-jx} ,$$

where $j = 1, 2, 3, \ldots$ counts the terms. Every term is positive, so we may integrate term by term. The
substitution $u = jx$ turns each term into a factorial,[^factorial]

$$\int_0^\infty x^n e^{-jx}\,\dd x = \frac{1}{j^{n+1}}\int_0^\infty u^ne^{-u}\,\dd u = \frac{n!}{j^{n+1}} ,$$

and adding over $j$ gives

$$\boxed{\int_0^\infty\frac{x^n\,\dd x}{e^x - 1} = n!\,\zeta(n + 1)} , \qquad
\zeta(s) = \sum_{j=1}^\infty\frac{1}{j^s} .$$

Such an integral is a **Bose integral**, and $\sym{riemann-zeta}{\zeta(s)}$, defined for $s > 1$ by this sum, is the
**Riemann zeta function**.[^zeta]

**Three values.** Leonhard Euler found $\zeta(2) = \pi^2/6$ and $\zeta(4) = \pi^4/90$, which we state. No such form is
known for $\zeta(3)$, whose value we also state: $\zeta(3) = 1.2021$. Adding terms checks them. Ten terms of
$\zeta(4)$ give 1.08204, against $\pi^4/90 = 1.08232$. A hundred terms of $\zeta(3)$ give 1.20201, short by about the
tail $\int_{100}^\infty\dd j/j^3 = 1/(2\times100^2) = 0.00005$. So

$$\begin{aligned}
\int_0^\infty\frac{x\,\dd x}{e^x - 1} &= \frac{\pi^2}{6} = 1.645 ,\\
\int_0^\infty\frac{x^2\,\dd x}{e^x - 1} &= 2\zeta(3) = 2.404 ,\\
\int_0^\infty\frac{x^3\,\dd x}{e^x - 1} &= \frac{\pi^4}{15} = 6.494 .
\end{aligned}$$

<!-- diagram: tut-planck-integrals — One panel, about 560 × 340 px at 1440. The three curves x^n/(e^x − 1) for n = 1,
2, 3 on 0 ≤ x ≤ 12, in three neutral line styles (thin solid, medium, thick), each with its area shaded very faintly
and labelled at its right end: "area π²/6 = 1.645", "2ζ(3) = 2.404", "π⁴/15 = 6.494". Peaks marked by a small dot and a
short vertical tick to the axis: n = 2 at x = 1.594 (height 0.648), n = 3 at x = 2.821 (height 1.421); the n = 1
curve starts at 1 and only falls, with no dot. Axis label "x = ħω/k_BT". Caption: "Look first at the peaks: counting
quanta (n = 2) peaks at x = 1.59, energy (n = 3) at 2.82, and the n = 1 curve falls from the start. The areas are the
Bose integrals n! ζ(n + 1). All curves are exact." -->

**The power.** In the variable $x$, Planck's law is $B_\omega\,\dd\omega = (\hbar/4\pi^3c^2)(\kB T/\hbar)^4\,x^3\,\dd
x/(e^x - 1)$, so the integral with $n = 3$ gives

$$\int_0^\infty B_\omega\,\dd\omega = \frac{\hbar}{4\pi^3c^2}\Bigl(\frac{\kB T}{\hbar}\Bigr)^4\frac{\pi^4}{15} =
\frac{\pi\kB^4T^4}{60\hbar^3c^2} .$$

We write the result as

$$\boxed{\int_0^\infty B_\omega\,\dd\omega = \frac{\sigma_{\rm SB}T^4}{\pi}} , \qquad \sigma_{\rm SB} =
\frac{\pi^2\kB^4}{60\hbar^3c^2} = 5.670\times10^{-8}\unit{W\,m^{-2}\,K^{-4}} .$$

This is the **Stefan–Boltzmann law**, and $\sym{stefan-boltzmann}{\sigma_{\rm SB}}$ is the constant that chapter 5.5
stated (the paper's bare $\sigma$).[^sigma] At 293 K the radiance added over all frequencies is
$133\unit{W\,m^{-2}\,sr^{-1}}$. A black surface sends it into the half of the sky above, each direction weighted by
the cosine of its angle $\theta$ to the surface's normal (chapter
[5.5](/tutorial/waves/radiance/#a-pixel-measures-radiance-power-per-area-per-solid-angle-and-per-frequency)'s flux).
With $\phi$ the angle around the normal,

$$\int_{\text{half sky}}\cos\theta\,\dd\Omega = \int_0^{2\pi}\dd\phi\int_0^{\pi/2}\cos\theta\,\sin\theta\,\dd\theta
= \pi ,$$

not its $2\pi$ steradians, so the surface emits $\sigma_{\rm SB}T^4 = 418\unit{W\,m^{-2}}$ of infrared light.

**The count.** Dividing each band's radiance by $\hbar\omega$ counts its quanta, as in 5.5's number radiance. The
integral with $n = 2$ gives

$$\boxed{\sym{black-body-number-radiance}{N_{\rm bb}} = \int_0^\infty\frac{B_\omega}{\hbar\omega}\,\dd\omega =
\frac{\zeta(3)}{2\pi^3c^2}\Bigl(\frac{\kB T}{\hbar}\Bigr)^3}$$

quanta per second, per square metre and per steradian: the **number radiance of a black body**, Section XI's $N$. Its
unit checks: $(\kB T/\hbar)^3$ is $\mathrm{s^{-3}}$, and dividing by $c^2$ leaves
$\mathrm{s^{-1}\,m^{-2}}$. For the 0.905 K graviton sky of the paper's [](/paper/#eq:graviton-temperature) it is
$3.59\times10^{14}$, Section XI's "$3.6\times10^{14}$", against at most $1.2\times10^{-5}$ for
the Earth's interior (chapter 5.5).

**The furnace.** Kirchhoff's law gives the number emissivity $j_N = \int\alpha B_\omega\,\dd\omega/\hbar\omega$, with
$\alpha$ the absorption coefficient. If $\alpha$ depends neither on frequency nor on temperature, $j_N = \alpha N_{\rm
bb}$ grows as $T^3$: the opening's 134.

**The mean energy.** The power divided by the count is

$$\boxed{\sym{mean-quantum-energy}{\bar E} = \frac{\pi^4/15}{2\zeta(3)}\,\kB T = 2.701\,\kB T} ,$$

the **mean energy of a quantum** of black-body radiation, the paper's $2.70\,k_BT$. At 293 K it is
$1.09\times10^{-20}$ J, or 0.068 eV (with $1\unit{eV} = 1.602\times10^{-19}$ J). For the Earth's outer core at 4500 K
it is 1.05 eV, chapter 0.6's "1.0 eV" and Section IX's "$2.70\,k_BT \approx 1\,\mathrm{eV}$". For the Sun's core at
$1.3\times10^7$ K it is $4.85\times10^{-16}$ J, chapter 0.3's "about $5\times10^{-16}$ J".

## The energy of the glow peaks at 2.82 thermal energies, and the count at 1.59

We want the frequency at which the glow is brightest, which depends on the curve we draw: the paper's 2.82 belongs
to $B_\omega$, 1.59 to the count of quanta and 4.97 to the radiance per unit of wavelength.

**The energy peak.** At a fixed temperature, $B_\omega$ is proportional to $x^3/(e^x - 1)$. Its derivative,

$$\frac{\dd}{\dd x}\,\frac{x^3}{e^x - 1} = \frac{3x^2(e^x - 1) - x^3e^x}{(e^x - 1)^2} ,$$

vanishes where $3(e^x - 1) = xe^x$. Dividing by $e^x$ gives

$$x = 3\,(1 - e^{-x}) .$$

No ordinary function solves this, but chapter
[3.7](/tutorial/noise/blur-law/#step-4-solving-the-cut-off-needs-a-logarithm-of-a-logarithm)'s fixed-point
iteration does: we put a guess into the right-hand side and read off a better one. From $x = 3$ it gives 2.851,
2.827, 2.822, and then settles at

$$\boxed{\hbar\omega_{\rm peak} = 2.821\,\kB T} .$$

Each step shrinks the error about fivefold, because the slope of the right-hand side, $3e^{-x}$, is 0.18 there.

**The count's peak.** The number of quanta per unit of angular frequency, $B_\omega/\hbar\omega$, is proportional to
$x^2/(e^x - 1)$. The same steps give $x = 2(1 - e^{-x})$, whose root is $x = 1.594$. Dividing each band by $\hbar
\omega$ favours low frequencies, so the count peaks lower than the energy.

**Per unit of wavelength.** A spectrum drawn against the wavelength $\lambda = 2\pi c/\omega$ gives its radiance per
unit of wavelength, $B_\lambda$. A band holds the same power whichever variable measures it, so

$$B_\lambda\,|\dd\lambda| = B_\omega\,\dd\omega , \qquad |\dd\lambda| = \frac{2\pi c}{\omega^2}\,\dd\omega ,$$

and $B_\lambda = \omega^2B_\omega/2\pi c$ is proportional to $x^5/(e^x - 1)$. Its peak is at $x = 5(1 - e^{-x})$, or
$x = 4.965$. So a peak is not a property of the glow alone, but of the glow and the variable it is drawn against.

**For chapter 10.3.** The largest values of the two curves are $x^3/(e^x - 1) = 1.4214$ at $x = 2.821$ and $x^2/(e^x
- 1) = 0.6476$ at $x = 1.594$. Eight times each gives the constants 11.37 and 5.18 of the paper's
[](/paper/#eq:glow-bound). The 8 is $4\pi\times16\pi\times(\pi/2)/4\pi^3$, from the
whole sphere of directions, the absorption coefficient, the sum rule on the friction and Planck's law.

**Wien's displacement law.** Each peak lies at a fixed multiple of $\kB T/\hbar$, so it moves in proportion to the
temperature. This is **Wien's displacement law**. In hertz, $f = \omega/2\pi$, the energy peak is at $f = 2.821\,\kB
T/2\pi\hbar$:

- at 293 K, 17.2 THz, of wavelength $c/f = 17.4$ µm, and the count peaks at 9.7 THz (31 µm): Section VI's "tens of
  micrometres";
- at 0.905 K, 53 GHz, or 5.6 mm: Section XI's gravitons "about six millimetres long";
- at 2800 K, the lower mantle, the count peaks at 93 THz, Section IX's "near $90\,\mathrm{THz}$".

The paper's Figure [](/paper/#fig:regimes) places a source at room temperature at "$f = 2.82\,k_BT/2\pi\hbar$", which
is 17.6 THz at 300 K (chapter [R5](/tutorial/waves/reading-section-iii/) read it).

{{paper fig:regimes}}

Silicon's Raman line at 15.6 THz (chapter 8.3) sits at $x = 2.56$ at 293 K, close to the energy peak (chapter
10.3). At the energy peak the occupation is $\bar n = 1/(e^{2.821} - 1) = 0.063$, and at the count's peak 0.255:
most modes are empty, so the glow is quantum, not classical.

::: try {#planck-spectrum}
Planck's law against frequency, on scales of powers of ten, with a marker at its peak. A slider sets the temperature,
and presets choose the 0.905 K graviton sky, a room, the Earth's outer and inner cores and the Sun's core. A switch
draws the spectrum per unit of frequency, per unit of wavelength or as a count of quanta. Readouts give the peak's
frequency and wavelength, $\sigma_{\rm SB}T^4$, $N_{\rm bb}$, the mean energy and $\bar n$ at the peak, and a second
panel shows the three factors whose product is the curve.

Predict first: if the temperature doubles, how far does the peak move, and by what factors do the power and the count
grow? Move the slider from 293 K to about 590 K and read the readouts. Then predict whether the peak stays at the same
frequency when the spectrum is drawn per unit of wavelength, and use the switch.
:::

## A black body holds an energy and a number of quanta in each cubic metre

Running the step from energy density to radiance backwards, $\mathcal U_\omega = 4\pi B_\omega/c$, the integrals give
the **energy density of radiation** $\sym{radiation-energy-density}{\mathcal U}$, in $\mathrm{J\,m^{-3}}$, and the
number of quanta per cubic metre, $\sym{black-body-number-density}{n_{\rm bb}}$:

$$\boxed{\mathcal U = \frac{4\sigma_{\rm SB}T^4}{c}} , \qquad \boxed{n_{\rm bb} = \frac{4\pi}{c}\,N_{\rm bb} =
\frac{2\zeta(3)}{\pi^2}\Bigl(\frac{\kB T}{\hbar c}\Bigr)^3} .$$

At 293 K they are $5.6\times10^{-6}\unit{J\,m^{-3}}$ and $5.1\times10^{14}\unit{m^{-3}}$, and the 0.905 K graviton
sky holds $1.5\times10^7$ gravitons per cubic metre. Pressure and entropy are chapter 10.2's.

## A moving observer still sees a black body, hotter ahead

We want to prove chapter
[6.3](/tutorial/relativity/aberration/#a-moving-black-body-is-still-a-black-body-hotter-ahead)'s stated result: a
moving observer sees a black body in each direction, at a temperature multiplied by that direction's Doppler
factor.

**The radiance is a count per mode.** The
[steps](#each-mode-holds-the-thermal-quanta-of-an-oscillator-and-the-product-is-plancks-law) to Planck's law hold
for any radiation. Let $\sym{mode-occupation}{n_\omega}$ be the mean number of quanta in a mode of angular
frequency $\omega$ travelling in a given direction, in any state: the **occupation** of the mode, of which $\bar n$ is
the thermal value. The modes travelling within $\dd\Omega$ in the band $\dd\omega$ are the share $\dd\Omega/4\pi$ of
[](#eq:mode-density), so the same counting, with the speed $c$, gives

$$I_\omega = 2\cdot\frac{\omega^2}{8\pi^3c^3}\cdot\hbar\omega\,n_\omega\cdot c = \frac{\hbar\omega^3}{4\pi^3c^2}\,
n_\omega ,$$

with $n_\omega$ the mean of the two polarizations. So $I_\omega$ divided by $\hbar\omega^3/4\pi^3c^2$ is the
occupation, which for Planck's law is $\bar n$.

**A count is the same for every observer.** A **boost** is chapter
[6.1](/tutorial/relativity/lorentz/#steady-motion-along-a-line-mixes-time-and-distance)'s change to the frame of an
observer in steady motion. A quantum is a click in a detector: two observers may disagree about its frequency and
direction, but not about whether it is there. A boost takes the box's modes in a small range of frequency and
direction one for one into the observer's modes in the matching range (the box below names this step). So the
observer finds in each mode the occupation that the same quanta have in the box's frame.

**The temperature in each direction.** Let the observer move with the velocity $c\,\obs{\vect\beta}$ through the
box's frame, with $\obs\gamma = 1/\sqrt{1 - \obs\beta^2}$. A quantum that the observer sees at the angle $\alpha'$
from its motion (6.3's angle, not the absorption coefficient $\alpha$) has, by chapter 6.3's Doppler factor, the
frequency $\omega' = \omega/[\obs\gamma(1 - \obs\beta\cos\alpha')]$, where $\omega$ is its frequency in the box's
frame. There it travels in another, aberrated direction, but the box's glow is the same in every direction, so its
occupation is $1/(e^{\hbar\omega/\kB T} - 1)$ whatever that direction is. Write $T' = T\omega'/\omega$. Since
$\hbar\omega/\kB T = \hbar\omega'/\kB T'$, the occupation the observer finds is

$$n_{\omega'} = \frac{1}{e^{\hbar\omega/\kB T} - 1} = \frac{1}{e^{\hbar\omega'/\kB T'} - 1} ,$$

the thermal occupation at $T'$. The ratio $\omega'/\omega$ depends on the direction but not on $\omega$, so $T'$ is
one temperature for each direction's whole spectrum. Its radiance, $\hbar\omega'^3n_{\omega'}/4\pi^3c^2$, is
therefore Planck's law at the temperature $T' = T(\alpha')$, with

$$\boxed{T(\alpha') = \frac{T}{\obs\gamma\,(1 - \obs\beta\cos\alpha')}} ,$$

chapter 6.3's result, now derived from the **invariance of the occupation**.

::: gap
This sketch assumes that a boost carries one mode into one mode. With the momentum $\vect p = \hbar\vect k$, the
[count of modes](#the-number-of-waves-that-fit-in-a-box-grows-as-the-square-of-their-frequency) says that quanta
filling a small volume $\dd V$ of space, with momenta in a small volume $\dd^3p$, have $\dd V\,\dd^3p/(2\pi\hbar)^3$
modes of each polarization. A boost multiplies the volume of the momenta by $\omega'/\omega$ and the volume the
quanta fill by $\omega/\omega'$, so the product $\dd V\,\dd^3p$, and with it the number of modes, is the same for
every observer (stated; proved in Misner, Thorne and Wheeler, section 22.6 [@MisnerThorneWheeler1973]).
:::

<!-- diagram: tut-planck-moving — Two discs side by side (stacked on a phone), about 640 × 320 px at 1440: the sky of a
black body seen from rest (left) and at 0.6c (right), each drawn as a circle in the plane of the motion with the
observer at its centre and the motion to the right (an arrow labelled "0.6c" in the observer colour on the right disc).
The rim of each disc is filled by the temperature seen in that direction, from a sequential neutral-to-warm scale:
uniform at T on the left; on the right 2T straight ahead, 0.8T at right angles to the motion in the observer's frame,
0.5T straight behind, with three small labels "2T", "0.8T", "T/2" outside the rim. A thin bar beside the right disc
shows the colour scale from T/2 to 2T. Caption: "Look first at the right disc's rim: moving at 0.6c through a glow of
one temperature, the observer sees a black body in every direction, twice as hot ahead and half as hot behind. The
temperatures are exact; the colours are a scale, not the glow's real colour." -->

**Checks.** At $\obs\beta = 0$ the temperature is $T$ everywhere. At $0.6c$, $\obs\gamma = 1.25$: straight
ahead ($\alpha' = 0$) the factor is $1/(1.25\times0.4) = 2$, twice $T$; straight behind it is $1/(1.25\times1.6) =
0.5$; and at $\alpha' = 90°$ it is $1/\obs\gamma = 0.8$, chapter 6.3's numbers. **Number.** At 370 km/s, $\obs\beta =
1.23\times10^{-3}$, and the 0.905 K graviton sky carries a dipole of $\pm1.12$ mK, Section XI's "hotter by $v/c =
1.2\times10^{-3}$ of its temperature in the direction in which we move".

**Meaning.** The radiance divided by $\omega^3$ is a count per mode, which no observer can change. So moving past a
black body changes only its temperature, direction by direction.

## What the camera takes from this

Kirchhoff's law, the paper's [](/paper/#eq:kirchhoff), makes the glow of matter $\alpha(\omega)B_\omega$. This
chapter supplied $B_\omega$: its power, its count, which grows as the furnace's $T^3$, the paper's mean energy
$2.70\,\kB T$ and the peaks behind its bound on every glow.

::: check
### Q

What is the mean energy of a graviton from a black body at 1500 K, in electronvolts?

### A

$2.701\,\kB T = 2.701 \times 1.381\times10^{-23} \times 1500 = 5.59\times10^{-20}$ J, or 0.349 eV.

### Q

Why do the energy peak and the count's peak lie at different frequencies?

### A

Counting quanta divides each band's energy by $\hbar\omega$, which favours low frequencies: the count peaks at
$x = 1.594$, the energy at 2.821.
:::

**The idea to keep: a black body is a box of oscillators. The number of waves that fit grows as $\omega^2$, each
holds 8.3's thermal quanta, and their product is Planck's law. Its integrals give the paper's constants: the power
$\sigma_{\rm SB}T^4/\pi$ per steradian, a mean graviton of $2.70\,\kB T$, and peaks at $2.82\,\kB T$ in energy and
$1.59\,\kB T$ in number.**

::: problems
### Practice

For the Earth's inner core at 5500 K, find the energy peak in hertz and in micrometres, the count's peak in hertz,
and the mean energy of a graviton.

::: solution
With $\kB T/2\pi\hbar = 1.146\times10^{14}$ Hz, the energy peak is $2.821 \times 1.146\times10^{14} = 323$ THz, of
wavelength $c/f = 0.927$ µm; the count peaks at $1.594 \times 1.146\times10^{14} = 183$ THz. The mean energy is
$2.701\,\kB T = 2.05\times10^{-19}$ J, or 1.28 eV.
:::

### Stretch

With chapter 5.5, derive the paper's [](/paper/#eq:jN-friction) with every constant now derived, and compute the
number emissivity of the placeholder friction, $10^{-3}$ Pa s, at 293 K.

::: solution
With $\alpha = 16\pi G\matter\eta/c^3$ the same at every frequency, $j_N = \alpha N_{\rm bb}$. Since $N_{\rm bb} =
\sigma_{\rm SB}T^4/(\pi \times 2.701\,\kB T)$, the factors $\pi$ cancel and $j_N = 16G\matter\eta\sigma_{\rm
SB}T^3/(2.701\,\kB c^3)$, the paper's equation. At 293 K it is $1.52\times10^{-15}\unit{s^{-1}\,m^{-3}\,sr^{-1}}$,
chapter 5.5's number.
:::

### The paper

Section IX's [*The graviton budget*](/paper/#par:the-graviton-budget) says that a filter passing only frequencies
above two terahertz keeps $4\times10^{-43}$ of the 0.905 K glow's gravitons and 98% of those from a body at room
temperature whose friction is the same at every frequency. Check both.

::: solution
Both counts have the spectrum $x^2/(e^x - 1)$, since a constant friction multiplies Planck's count by a constant. The
filter is in cycles per second, so its edge is $x_0 = 2\pi\hbar f/\kB T$ with $f = 2$ THz. At 0.905 K, $x_0 = 106$;
there $e^x - 1 \approx e^x$, and integrating $x^2e^{-x}$ by parts gives a share $e^{-x_0}(x_0^2 + 2x_0 + 2)/2\zeta(3) =
4.1\times10^{-43}$. At 293 K, $x_0 = 0.328$; below it $x^2/(e^x - 1) \approx x - x^2/2$, whose integral $x_0^2/2 -
x_0^3/6 = 0.048$ is 2.0% of $2\zeta(3)$, so 98.0% pass.
:::
:::

::: paper
- Section VI's [*Emission*](/paper/#par:emission): the Planck radiance, which the paper's [](/paper/#eq:kirchhoff)
  multiplies by the absorption.
- Section VI's [*A bound on the glow*](/paper/#par:a-bound-on-the-glow): the constants of the paper's
  [](/paper/#eq:glow-bound), eight times the peaks' heights (chapter 10.3).
- [Section IX](/paper/#sec:first-image): the paper's [](/paper/#eq:jN-friction), the filter above two terahertz,
  "near $90\,\mathrm{THz}$" and "$2.70\,k_BT \approx 1\,\mathrm{eV}$".
- [Section III](/paper/#sec:regimes): Figure [](/paper/#fig:regimes)'s thermal sources, at the energy peak.
- [Section XI](/paper/#sec:vistas): the paper's [](/paper/#eq:graviton-temperature), the count
  $N = \zeta(3)(k_BT/\hbar)^3/2\pi^3c^2$ and the dipole from our motion (chapter R12).
:::

::: deeper
- The GR course's [section 11.5](https://neovand.github.io/general-relativity/chapter-11.html#11-5-pressure-gravitates-and-the-photon-box-is-not-a-mass-doubling-machine)
  weighs a box of radiation and its pressure, a black body as a source of gravity.
- The GR course's [section 19.6](https://neovand.github.io/general-relativity/chapter-19.html#19-6-cosmological-redshift-derived-from-neighboring-wave-crests)
  derives the stretching of waves by expansion, under which a black body also stays a black body.
- F. Reif, *Fundamentals of Statistical and Thermal Physics* (McGraw-Hill, 1965), sections 9.13 to 9.15: the photon
  gas, derived the same way.
:::

[^name]: A body that absorbs every wave looks black when cold, hence the name. The letter $B$ is not the magnetic
    part of the tide $\curv{\tB}_{ij}$.

[^halves]: Chapter 8.3 counted the patterns $\cos(\vect k\cdot\vect x)$ and $\sin(\vect k\cdot\vect x)$ on half the
    grid; here each point of the whole grid is one travelling wave. The two counts agree.

[^shape]: A box of sides $D$, $D$ and $2D$ has the grid spacing $\pi/D$ along its long side, so its shell holds $2D^3
    \times 4\pi k^2\,\dd k/(2\pi)^3$ modes; dividing by its volume $2D^3$ gives the same $\omega^2/2\pi^2c^3$. Hermann
    Weyl proved in 1912 that this holds for a cavity of any shape much larger than the wavelength (stated; J. reine
    angew. Math. 141; his 1911 note treated a membrane).

[^share]: The share is $\int_0^1 x^3\,\dd x/(e^x - 1)$ over $\pi^4/15$. For small $x$, $x^3/(e^x - 1) \approx x^2 -
    x^3/2 + x^4/12$, whose integral from 0 to 1 is $1/3 - 1/8 + 1/60 = 0.225$, and $0.225/6.494 = 3.5\%$.

[^U]: The letter $\mathcal U$ is chapter 7.8's for the energy density of a wave, drawn there in the colour of matter;
    here, like the radiance, it is neutral. It is not 4.3's strain $u$ or 8.4's super-energy $u$.

[^factorial]: Integrating by parts, $\int_0^\infty u^ne^{-u}\,\dd u = \bigl[-u^ne^{-u}\bigr]_0^\infty +
    n\int_0^\infty u^{n-1}e^{-u}\,\dd u$, and the bracket vanishes at both ends. So each integral is $n$ times the one
    before, and $\int_0^\infty e^{-u}\,\dd u = 1$ starts the chain: the value is $n! = 1\cdot2\cdots n$.

[^zeta]: The tutorial always writes $\zeta(3)$ with its argument. It is not chapter 9.7's local ratio $\zeta$, nor
    Kleinman's parameter $\zeta_K$ of chapter 10.3, which always carries its subscript.

[^sigma]: The units: $\kB^4/\hbar^3c^2$ is $\mathrm{J^4\,K^{-4}}/(\mathrm{J^3\,s^3\,m^2\,s^{-2}}) =
    \mathrm{J\,s^{-1}\,m^{-2}\,K^{-4}}$, which is $\mathrm{W\,m^{-2}\,K^{-4}}$, the unit measured for light.
