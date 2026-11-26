---
id: '8.6'
title: 'Measurement, added noise and the standard quantum limit; detectors and strain'
question: 'Why does watching a free mass disturb it, and what limits does quantum mechanics set on reading a tide?'
part: '8'
requires: ['1.4', 'R1', '3.1', '3.2', '3.3', '3.7', '3.8', '8.1', '8.2', '8.3', '8.4']
paper: [sec:pixel, sec:near-field, sec:first-image, sec:no-lens, sec:one-pixel]
figures: []
live: [quantum-limit]
depth: A
---

Two free masses of a gram, a centimetre apart, drift relative to each other under a tide, and the pair could read
that drift as a pixel of the camera. What stops it from reading a tide as small as we like? Watching a free mass
disturbs it, and we derive the limit from the uncertainty relation of [section 8.2](/tutorial/quantum/operators/) and the
states of sections [8.1](/tutorial/quantum/states/), [8.3](/tutorial/quantum/quanta/#its-energies-are-evenly-spaced-and-the-lowest-is-not-zero), [8.4](/tutorial/quantum/spin/)
and [8.5](/tutorial/quantum/counting-quanta/#counting-adds-no-noise-but-needs-quanta). A second limit holds for every way of reading.

::: plain
To read where a mass is, something must touch it, such as light bouncing off it. The touch gives the mass a small kick
of unknown size, and the sharper the reading, the harder the kick. A free mass then drifts by an amount that grows
with time, so reading it sharply at the start makes the drift worse later, and reading it loosely leaves the start
uncertain. The best compromise is the standard quantum limit: for a gram watched for a second, about a fifth of the
width of a proton.

This limit belongs to one way of reading, and cleverer readings beat it. What no reading beats is the speed at which
any quantum state can change, which is set by the spread of its energy. A camera too heavy for its size would be a
black hole, so its energy of interaction with a scene is limited, and from this no camera could watch a person with a
signal-to-noise ratio better than about $10^{70}$. The picture would still be blurred by 1.5°.

A counter of gravitons adds no noise, but each graviton it counts tells only about one bit about its direction.
:::

## Reading a position disturbs the momentum

We want to know what a sharp reading does to a free mass $\matter m$, in kilograms. A reading of a position does more
than the question and answer of [section 8.1](/tutorial/quantum/states/#probabilities-are-the-squared-sizes-of-amplitudes):
after it, the mass is in a state that agrees with the answer. We assume that **after a reading to within $\sigma_0$,
the position has the standard deviation $\sigma_0$**, where $\sym{first-reading-spread}{\sigma_0}$, in metres, is the
sharpness of the reading. The
[uncertainty relation](/tutorial/quantum/operators/#the-uncertainty-relation-is-robertsons-inequality-for-position-and-momentum)
$\sigma_x\sigma_p \ge \hbar/2$ of section 8.2, with $\hbar = 1.055\times10^{-34}\unit{J\,s}$ the reduced Planck
constant, then holds in the new state, so its momentum has the spread

$$\sigma_p \ge \frac{\hbar}{2\sigma_0} .$$

The reading has given the mass a momentum it did not know before. This disturbance of the quantity that was not read
is the **back-action** of the measurement.[^microscope] **A number.** A gram read to $10^{-16}$ m receives a spread of
velocities of at least $\hbar/2\matter m\sigma_0 = 5.3\times10^{-16}\unit{m\,s^{-1}}$, which in one second carries
the mass five times farther than the reading's own uncertainty.

## A free mass watched for a time cannot be followed better than the standard quantum limit

We want the smallest spread of a free mass's position a time $\sym{reading-time}{\tau}$ after a first reading,
where $\tau$ is the reading time, in seconds.[^tau] We assume that **the mass is free**, so that a force that does not
depend on its position moves its mean and not its spread, and that **the first reading leaves no chirp**: the position
and the momentum of the new state are uncorrelated, as in the Gaussian packet of
[section 8.2](/tutorial/quantum/operators/#the-uncertainty-relation-is-robertsons-inequality-for-position-and-momentum).
The Practice problem of that section found that such a packet spreads as

$$\sigma_x(\tau)^2 = \sigma_0^2 + \Bigl(\frac{\sigma_p\tau}{\matter m}\Bigr)^2 .$$

We put in the back-action, $\sigma_p \ge \hbar/2\sigma_0$:

$$\sigma_x(\tau)^2 \ge \sigma_0^2 + \Bigl(\frac{\hbar\tau}{2\matter m\sigma_0}\Bigr)^2 . \label{eq:spread}$$

The first term falls as the first reading sharpens, and the second grows. A square cannot be negative, so
$(\sigma_0 - \hbar\tau/2\matter m\sigma_0)^2 \ge 0$, and expanding it gives $\sigma_0^2 + (\hbar\tau/2\matter m\sigma_0)^2
\ge \hbar\tau/\matter m$, with equality when $\sigma_0^2 = \hbar\tau/2\matter m$. The least spread is therefore

$$\boxed{\sym{sql-width}{\sigma_{\rm SQL}} = \sqrt{\frac{\hbar\tau}{\matter m}}} ,$$

the **standard quantum limit** for a free mass.[^units]

**A number.** A gram watched for a second has $\sigma_{\rm SQL} = 3.25\times10^{-16}$ m, about a fifth of the width of a
proton, whose radius is $8.4\times10^{-16}$ m. The best first reading is $\sigma_0 = \sqrt{\hbar\tau/2\matter m} =
2.30\times10^{-16}$ m. **A limit.** As $\matter m \to \infty$ or $\hbar \to 0$ the limit goes to zero, and classical
mechanics follows a free mass as closely as we like. **What it means.** Past the best $\sigma_0$, reading more sharply
at the start blurs the end more. If the first reading is ten times sharper than the best, the second term of
[](#eq:spread) is a hundred times larger than there, and the final spread is seven times $\sigma_{\rm SQL}$ (Figure
[](#fig:sql-compromise)). The best is a compromise, not zero, and it grows as $\sqrt\tau$.

![Look first at the lowest point of the ink curve: no first reading leaves the mass better known after the time
$\tau$ than $\sqrt{\hbar\tau/\matter m}$. Sharper readings (left) leave a larger kick, looser ones (right) a larger
start. The curves are exact for a packet with no chirp.](tut-sql-compromise){#fig:sql-compromise}

## Two gram masses read for a second resolve a tide a hundred thousand times smaller than the person's

We want the smallest tide this limit allows two free masses to read. Two masses a distance $\sym{separation}{\xi}$
apart, at rest at the start, are moved relative to each other by $\tfrac12\curv{\tE}\xi\tau^2$ in the time $\tau$, by
the relative acceleration $\ddot\xi = -\curv{\tE}\xi$ of
[section 1.4](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives). A tide is resolved
when this exceeds the spread, so the smallest resolved tide is about

$$\begin{aligned}
\sym{smallest-tide}{\Delta\curv{\tE}} \approx \frac{2\sigma_{\rm SQL}}{\xi\tau^2}
&= \frac{2\times3.25\times10^{-16}}{0.01\times1^2}\unit{s^{-2}}\\
&= 6.5\times10^{-14}\unit{s^{-2}} ,
\end{aligned}$$

the one-mass estimate. The person a metre away makes $9.34\times10^{-9}\unit{s^{-2}}$ (1.4), 144,000 times
more, so on the person this pixel reads a signal-to-noise ratio of $1.44\times10^5$ in a second.

**The $\sqrt2$.** This estimate gives one mass the limit and treats the other as a perfect reference. What is read is
the distance between them, and each has its own spread. The spreads of independent masses add in squares
([section 3.1](/tutorial/noise/probability/#covariance-describes-noise-that-two-readings-share)), so the distance has
the spread $\sqrt2\,\sigma_{\rm SQL} = \sqrt{2\hbar\tau/\matter m} = 4.6\times10^{-16}$ m,[^reduced] and the tide is $9.2\times10^{-14}\unit{s^{-2}}$, $1.02\times10^5$ times below the person's. This section carries the one-mass estimate forward, so its ratios on the person are $\sqrt2$
larger than those of the distance.[^pixel]

**Against real instruments.** The best superconducting gradiometer reaches $0.02\unit{E}$ in a second,
$2\times10^{-11}\unit{s^{-2}}$ (section [R1](/tutorial/newton/reading-section-ii/#what-the-premise-asks-existing-instruments-nearly-supply)), and so reads the person at a ratio
of 467, about 300 times short of the ideal pixel (Figure [](#fig:sql-pixel)).

![Look first at the strip: the ideal pixel, on the one-mass estimate, reads tides 144,000 times smaller
than the person's. The bells are the position's spreads at the first and the second reading; their sizes and the
person's distance are not to scale.](tut-sql-pixel){#fig:sql-pixel}

## The standard quantum limit belongs to one way of reading, and it can be beaten

The limit came from three choices: reading the position, reading it twice, and starting from a state with no chirp.
None is required. A reading of a free mass's momentum disturbs its position, and the position never feeds back into the
momentum, so the momentum can be read again and again. A reading that its own disturbance never reaches is a **quantum
non-demolition measurement**, and arranging one is **back-action evasion** (Braginsky, Vorontsov and Thorne, and Caves
and colleagues, both 1980).

**An interferometer.** LIGO reads the difference of the lengths of its two arms, $\sym{arm-length}{L}$ = 4 km, with
laser light reflected from mirrors of $\matter m = 40$ kg. More laser power $P$, in watts, reads the length more
sharply, because the noise of counting photons, **shot noise**, falls as $P^{-1/2}$
([section 3.2](/tutorial/noise/random-signals/#randomly-placed-masses-are-a-noise-too)). It also kicks the mirrors harder:
**radiation-pressure noise**, the random push of the photons' momenta, grows as $P^{1/2}$ and moves free mirrors less at
higher frequency. The balance of the two at each frequency is the interferometer's standard quantum limit. For a
signal of frequency $f$, with the angular frequency $\omega = 2\pi f$ in $\mathrm{s^{-1}}$, it is

$$\sym{sql-strain}{h_{\rm SQL}} = \sqrt{\frac{8\hbar}{\matter m\omega^2L^2}} ,$$

an **amplitude spectral density** of the strain, the square root of the
[spectrum](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies) of section 3.2,
in $\mathrm{Hz^{-1/2}}$ and one-sided, as instrument makers quote it.[^hsql] At 100 Hz, $\omega = 628\unit{s^{-1}}$ and
$h_{\rm SQL} = 1.8\times10^{-24}\unit{Hz^{-1/2}}$. The variance of the strain over a band is the spectrum
$h_{\rm SQL}^2$ added up over the band's frequencies, so from 50 to 150 Hz, where $h_{\rm SQL}$ falls as $1/f$, the
strain is $2.1\times10^{-23}$, about fifty times smaller than the waves of $10^{-21}$ that LIGO detects
([section 7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain)).

::: gap
The sketch skips the spectral form of the uncertainty relation (Braginsky and Khalili): a reading of a position with
the one-sided noise spectrum $S_x$, in $\mathrm{m^2\,Hz^{-1}}$, pushes the mass with a random force of spectrum $S_F$,
and $S_xS_F \ge \hbar^2$ when the two are uncorrelated. A force at $\omega$ moves a free mass by $F/\matter m\omega^2$,
so $S_x + S_F/\matter m^2\omega^4 \ge 2\hbar/\matter m\omega^2$, by the same square as for the free mass. The
difference of two arms of two mirrors each moves as one body of a quarter of a mirror's mass, which gives the strain
$8\hbar/\matter m\omega^2L^2$.
:::

**Squeezed light.** Both noises come from the zero point of the light entering the interferometer: one quadrature
makes the shot noise, the other the radiation pressure. The
[squeezed vacuum](/tutorial/quantum/counting-quanta/#a-squeezed-state-is-narrower-than-the-zero-point-in-one-direction)
of section 8.5, sent in instead, narrows one quadrature and widens the other. Squeezed in the shot-noise quadrature, it
reads the length more finely than the zero point allows, but alone this acts as more power (Figure
[](#fig:sql-interferometer)). Squeezed in a mixture of the two, it makes the reading's noise and the mirrors' kick
partly cancel, so the quantum noise falls below the limit in a band. In 2020 LIGO Livingston inferred, after
subtracting its classical noise, a quantum noise 3 dB (half the power) below its standard quantum limit at 40 Hz (H. Yu
and colleagues, *Nature* 583, 43). That quantum part was 28% of the total noise power, so the total stayed above the
limit.

![Look first at the dots: each laser power reaches the limit at one frequency only, where its shot noise and its
radiation pressure are equal. More power helps above that frequency and hurts below it, and squeezing in the
shot-noise quadrature acts as more power. The curves are exact for an ideal interferometer of LIGO's size; real noise
has other sources.](tut-sql-interferometer){#fig:sql-interferometer}

## Recording both quadratures of a wave adds half a quantum of noise

A mode of a wave has two quadratures, the amplitudes
[$X_1$ and $X_2$](/tutorial/quantum/counting-quanta/#a-thermal-source-gives-geometric-counts-with-a-larger-spread) of
its cosine and sine parts. For an oscillator of angular frequency $\omega$ they are $X_1 = x$ and $X_2 =
p/\matter m\omega$, both in metres. Their commutator is $[X_1, X_2] = i\hbar/\matter m\omega$, so Robertson's
inequality gives $\sigma_{X_1}\sigma_{X_2} \ge \hbar/2\matter m\omega = x_{\rm zp}^2$, with the zero-point width
$x_{\rm zp}$ of [section 8.3](/tutorial/quantum/quanta/#its-energies-are-evenly-spaced-and-the-lowest-is-not-zero). A
device that records both at once, as a radio receiver records a wave's amplitude and phase, is a **phase-insensitive
amplifier**, which magnifies both quadratures alike, or a **heterodyne** receiver.

We want the least noise such a device must add. Its two records are read at the same time, so they must commute. We
assume that **the device records $O_1 = X_1 + Y_1$ and $O_2 = X_2 + Y_2$**, where $Y_1$ and $Y_2$, in metres, belong to
a second system inside the device and so commute with $X_1$ and $X_2$. Then

$$\begin{aligned}
[O_1, O_2] &= [X_1, X_2] + [Y_1, Y_2]\\
&= \frac{i\hbar}{\matter m\omega} + [Y_1, Y_2] ,
\end{aligned}$$

and the records commute only if $[Y_1, Y_2] = -i\hbar/\matter m\omega$: the second system's commutator must cancel the
mode's. Robertson's inequality then holds for it too, $\sigma_{Y_1}\sigma_{Y_2} \ge x_{\rm zp}^2$. We assume also that
**the device is phase-insensitive**, so that $\sigma_{Y_1} = \sigma_{Y_2}$; each added variance is then at least
$x_{\rm zp}^2$, whereas without this symmetry only their product is bounded, by $x_{\rm zp}^4$. Independent variances
add ([section 3.1](/tutorial/noise/probability/)), so each record's variance is the mode's own plus at least $x_{\rm
zp}^2$.

To turn this into energy, we write the mode's energy as $\tfrac12\matter m\omega^2x^2 + p^2/2\matter m =
\tfrac12\matter m\omega^2(X_1^2 + X_2^2)$. A variance $x_{\rm zp}^2$ in each quadrature is therefore worth

$$\tfrac12\matter m\omega^2\times2x_{\rm zp}^2 = \tfrac12\matter m\omega^2\times\frac{\hbar}{\matter m\omega} =
\tfrac12\hbar\omega ,$$

half a quantum. The mode's zero point holds this half, and the device adds at least another, so for a mode in its
ground state

$$\boxed{\tfrac12\matter m\omega^2\bigl(\sigma_{O_1}^2 + \sigma_{O_2}^2\bigr) \ge \tfrac12\hbar\omega + \tfrac12\hbar\omega
= \hbar\omega} ,$$

at least one quantum in all. The device's half is the **added noise**, and the theorem is Caves's (1982)
[@Caves1982]. **A special case.** A device that records only $X_1$ needs no second system and adds nothing, which is
why the interferometer, reading one quadrature of its light, gains from squeezing.

**A number.** Each mode of the thermal glow of matter holds $10^{-30}$ gravitons or fewer on average.[^recording]
Recorded quadrature by quadrature, its excess over the noise is $10^{-30}$ of a quantum against at least one, the zero
point's half and the device's half, so a thermal gravitational image recorded pixel by pixel would be buried in that
noise. A counter adds no noise, because an empty mode never clicks
([section 8.5](/tutorial/quantum/counting-quanta/#counting-adds-no-noise-but-needs-quanta)), but it loses the phase
that an array needs to combine its pixels.

## Combined before counting, two pixels gain in proportion to the occupation; recorded apart, in proportion to its square

We want to know what recording costs an array, and what combining the field before detection saves. An array forms
its image of thermal light from the correlations of the fields at pairs of pixels
([section 5.3](/tutorial/waves/diffraction/#one-moving-pixel-can-image-a-steady-source-but-thermal-light-needs-pixels-that-record-together-in-pairs)),
so we take two pixels, $a$ and $b$, with one mode at each, filled by the same thermal source. By the picture of
[section 8.5](/tutorial/quantum/counting-quanta/#a-thermal-source-gives-geometric-counts-with-a-larger-spread), a
thermal field is a mixture of coherent states whose complex amplitudes $\alpha_a$ and $\alpha_b$ are Gaussian numbers,
here with $\langle|\alpha_a|^2\rangle = \langle|\alpha_b|^2\rangle = \bar n$, the mean occupation of each mode, and with
$\langle\alpha_a\alpha_b^*\rangle = \bar n\gamma_{ab}$. The **correlation** $\gamma_{ab}$, a pure number between $-1$ and 1, is the part of
the image that this pair reads. We assume that **$\gamma_{ab}$ is real**, any known phase having been removed by a delay, and we
compare the [Fisher information](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks)
about $\gamma_{ab}$ of the two ways of detecting, at $\gamma_{ab} = 0$, where a fine detail of the image lies.

**Recording each pixel.** A device at each pixel records a complex number $\beta = \alpha + \nu$. The noise $\nu$ holds
the zero point and the added noise of the last section, so a mode with no quanta gives a record of one quantum in all:
$\langle|\nu|^2\rangle = 1$, in units in which $|\alpha|^2$ counts quanta. We assume that **the devices are ideal,
with Gaussian noise independent from pixel to pixel**. Then $\langle|\beta_a|^2\rangle = \langle|\beta_b|^2\rangle =
\bar n + 1$, which we call $N$, and still $\langle\beta_a\beta_b^*\rangle = \bar n\gamma_{ab}$. One complex Gaussian number with
$\langle|\beta|^2\rangle = N$ has the density $e^{-|\beta|^2/N}/\pi N$ over the complex plane, and to first order in
$\gamma_{ab}$ the pair has the density

$$p = \frac{e^{-(|\beta_a|^2 + |\beta_b|^2)/N}}{\pi^2N^2}\Bigl[1 + \frac{2\bar n\gamma_{ab}}{N^2}\,\mathrm{Re}\bigl(\beta_a^*\beta_b\bigr)\Bigr] .$$

The added term averages to zero, so the total stays one, and it gives the right correlation. Under the first factor
alone the phases of $\beta_a$ and $\beta_b$ are uniform, so $\beta_a\beta_b^*\,\mathrm{Re}(\beta_a^*\beta_b)$ averages
to $\tfrac12\langle|\beta_a|^2\rangle\langle|\beta_b|^2\rangle = \tfrac12N^2$, and $\langle\beta_a\beta_b^*\rangle =
(2\bar n\gamma_{ab}/N^2)\cdot\tfrac12N^2 = \bar n\gamma_{ab}$. The score of section 3.3 at $\gamma_{ab} = 0$ is the coefficient of $\gamma_{ab}$ in $\ln p$,

$$U = \frac{2\bar n}{N^2}\,\mathrm{Re}\bigl(\beta_a^*\beta_b\bigr) .$$

The product $\beta_a^*\beta_b$ of two independent numbers has the mean square $N^2$, shared equally between its real
and imaginary parts because its phase is uniform. The Fisher information is the mean square of the score:

$$F_{\rm rec} = \frac{4\bar n^2}{N^4}\cdot\frac{N^2}{2} = \frac{2\bar n^2}{(1 + \bar n)^2} .$$

**Combining before counting.** A delay of a quarter turn on one path and a beam splitter, as in the interferometer of
[section 8.1](/tutorial/quantum/states/#amplitudes-add-so-two-paths-can-cancel), combine the two fields before any
detection, so that the two exits carry the amplitudes $(\alpha_a + \alpha_b)/\sqrt2$ and $(\alpha_a -
\alpha_b)/\sqrt2$, up to a phase. Their mean squares are $\tfrac12(\bar n + \bar n \pm 2\bar n\gamma_{ab}) = \bar n(1 \pm \gamma_{ab})$,
and their correlation, $\tfrac12\langle(\alpha_a + \alpha_b)(\alpha_a - \alpha_b)^*\rangle = \tfrac12(\bar n - \bar n\gamma_{ab}
+ \bar n\gamma_{ab} - \bar n)$, is zero. So each exit is again a Gaussian mixture of coherent states, a thermal mode with the
mean count $\mu_\pm = \bar n(1 \pm \gamma_{ab})$, and the two exits are independent, since two Gaussian numbers with no
correlation are. A counter at each exit counts by the geometric law of section 8.5, $P(n) = \mu^n/(1 + \mu)^{n+1}$. Its
score with respect to $\mu$ is

$$\frac{\partial\ln P}{\partial\mu} = \frac n\mu - \frac{n + 1}{1 + \mu} = \frac{n - \mu}{\mu(1 + \mu)} ,$$

and the variance of $n$ is $\mu(1 + \mu)$, so the Fisher information about $\mu$ is $1/\mu(1 + \mu)$. Each mean
changes with $\gamma_{ab}$ at the rate $\pm\bar n$, which multiplies the score by $\pm\bar n$, and the informations of independent
exits add:

$$F_{\rm count} = \frac{\bar n^2}{\mu_+(1 + \mu_+)} + \frac{\bar n^2}{\mu_-(1 + \mu_-)} = \frac{2\bar n}{1 + \bar n}\quad\text{at } \gamma_{ab} = 0 .$$

Together,

$$\boxed{F_{\rm count} = \frac{2\bar n}{1 + \bar n}, \qquad F_{\rm rec} = \frac{2\bar n^2}{(1 + \bar n)^2}, \qquad
\frac{F_{\rm count}}{F_{\rm rec}} = 1 + \frac1{\bar n}} ,$$

pure numbers for each pair of modes, since $\gamma_{ab}$ has no unit.[^combine] **A limit.** When $\bar n \gg 1$ the ratio goes
to one, and a bright field loses nothing by being recorded: radio telescopes, whose modes hold many quanta, record each
dish apart and correlate the records afterwards. **A number.** At $\bar n = 10^{-30}$, counting draws $2\times10^{-30}$
for each pair of modes, about one unit for each quantum that the pair holds, since it holds $2\bar n$ on average.
Recording draws $2\times10^{-60}$, and to read $\gamma_{ab}$ as well it needs $10^{30}$ times as many modes. **What it means.**
Each record carries one quantum of noise for $10^{-30}$ of signal, and the correlation must be dug out of the product
of two such noises, which is why its information goes as the square of the occupation. Combined first, the signal's
quanta reach a counter that adds no noise of its own.

Tsang (2011) found the same tension for weak thermal light in optical interferometers, and showed that it binds every
measurement made on the pixels separately, even with classical messages between them; Carney, Domcke and Rodd (2024)
discuss it for gravitons [@Tsang2011; @CarneyDomckeRodd2024]. A thermal gravitational camera therefore needs its pixels
joined before detection. Two ways have been proposed. Quantum repeaters, which share entanglement between distant
stations, could carry the quantum state of each pixel to one receiver, as Gottesman, Jennewein and Croke (2012)
proposed for optical telescopes [@Gottesman2012]. Or a converter could turn each graviton into a photon travelling the
same way, as a strong magnetic field does, so that ordinary optics could combine them [@Dyson2013]. The box estimates
the price of the second.

::: derivation
### A magnetic field turns gravitons into photons, rarely

We want the chance that a graviton crossing a static magnetic field becomes a photon, the **Gertsenshtein effect**
(Gertsenshtein, 1962).[^gert] We assume **a wave of strain $\field h_+ = h\cos\omega(t - z/c)$ travelling along $z$, in the
coordinates of section 7.6 in which free balls keep their places, crossing a uniform field $B_0$ along $x$, in
tesla, over a length $L$**. We state one input (Plebanski, 1960): in these coordinates Maxwell's equations are those of
a medium in which the stretched space gives a magnetic field the magnetization $M_i = -\field h_{ij}B_j/\mu_0$, in
amperes per metre, with $\mu_0 = 1.257\times10^{-6}\unit{T\,m\,A^{-1}}$ the magnetic constant. Here $M_x =
-\field h_+B_0/\mu_0$.

The new wave has a magnetic field $b$ along $x$ and an electric field $e$ along $y$, both depending on $z$ and $t$.
Faraday's law, $\nabla\times\vect E = -\partial_t\vect B$, gives $\partial_ze = \partial_tb$. Ampère's law with the
magnetization, $\nabla\times(\vect B/\mu_0 - \vect M) = \epsilon_0\partial_t\vect E$, gives $\partial_zb -
\mu_0\partial_zM_x = c^{-2}\partial_te$. We differentiate the second with respect to $z$ and use the first:

$$\frac{1}{c^2}\frac{\partial^2b}{\partial t^2} - \frac{\partial^2b}{\partial z^2} = -\mu_0\frac{\partial^2M_x}{\partial z^2} = -\frac{B_0h\omega^2}{c^2}\cos\omega\Bigl(t - \frac zc\Bigr) .$$

The source runs at the speed of light, in step with the wave it drives, so the wave grows along $z$. Trying $b =
\kappa z\sin\omega(t - z/c)$, the terms in $z$ cancel on the left and leave $2(\kappa\omega/c)\cos\omega(t - z/c)$, so
$\kappa = -B_0h\omega/2c$. After the length $L$ the photons' wave has the amplitude

$$|b| = \frac{hB_0\omega L}{2c} .$$

It carries the energy flux $cb^2/2\mu_0$ averaged over a cycle
([section 6.6](/tutorial/relativity/maxwell-complex/#the-energy-of-the-field-and-its-flow-are-two-products-of-the-complex-field)),
and the gravitons' wave carries $c^3\omega^2h^2/32\pi G$, the flux of
[section 7.7](/tutorial/geometry/quadrupole-formula/#the-power-is-set-by-the-third-derivative-of-the-quadrupole) with
$\langle\dot{\field h}_+^2\rangle = \tfrac12\omega^2h^2$. Their ratio is the chance of conversion,

$$\boxed{P_{\rm conv} = \frac{4\pi GB_0^2L^2}{\mu_0c^4}} ,$$

in which $\omega$ and $h$ cancel: every graviton has the same chance, whatever its frequency. **Units.** $B_0^2/\mu_0$ is
an energy density, in $\mathrm{N\,m^{-2}}$, so $B_0^2L^2/\mu_0$ is a force, and so is $c^4/G$. **A number.** Ten tesla
over a metre give $P_{\rm conv} = 8.3\times10^{-36}$. The chance grows as $(B_0L)^2$ and would reach one near $B_0L =
3.5\times10^{18}\unit{T\,m}$, ten tesla across 37 light-years; the formula holds only while $P_{\rm conv} \ll 1$ and while the
photon keeps step with the graviton, which any gas or plasma in the field prevents. **What it means.** The photon keeps
the graviton's direction and phase, so a lens behind the converter can combine the field, but only about one graviton
in $10^{35}$ survives each metre of a strong magnet.
:::

## No state changes faster than its energy spread allows, and that caps every camera

We want a limit that holds whatever is read. A camera tells two scenes apart only if they leave it in different
states, so the question is how fast a state can become different from itself.

**Two levels.** Take the [beat](/tutorial/quantum/states/#a-state-of-definite-energy-turns-at-a-rate-set-by-its-energy)
of section 8.1, the state $(|E_1\rangle + |E_2\rangle)/\sqrt2$ with $E_1 = 0$ and $E_2 = E$. The answer to "are you
still in the state it started in?" is yes with the probability $\cos^2(Et/2\hbar)$, which first reaches zero at $t =
\pi\hbar/E$. Its energy is 0 or $E$ with equal probabilities, so its mean is $E/2$ and its standard deviation
$\sym{energy-spread}{\sigma_E} = E/2$, in joules. The time to become orthogonal is therefore

$$t_\perp = \frac{\pi\hbar}{2\sigma_E} .$$

**Any state.** For short times we expand $e^{-iHt/\hbar}$ (section
[8.2](/tutorial/quantum/operators/#a-generator-is-the-exponent-of-a-unitary-table)) to second order, with the energy
operator $H$:

$$\begin{aligned}
\langle\psi|e^{-iHt/\hbar}|\psi\rangle &= 1 - \frac{i\langle H\rangle t}{\hbar} - \frac{\langle H^2\rangle t^2}{2\hbar^2} + \dots,\\
\bigl|\langle\psi|e^{-iHt/\hbar}|\psi\rangle\bigr|^2 &= 1 - \frac{\sigma_E^2t^2}{\hbar^2} + \dots .
\end{aligned}$$

The squared size is the real part squared plus the imaginary part squared, and the terms in $t^2$ leave
$\langle H^2\rangle - \langle H\rangle^2 = \sigma_E^2$. So every state starts to leave itself at a rate set by its
energy spread and by nothing else.

**At every time.** Mandelstam and Tamm (1945) turned this start into a bound for all times.[^speed] Let $p_0(t) =
|\langle\psi(0)|\psi(t)\rangle|^2$ be the probability that the answer is still yes, and let $\Pi_0 =
|\psi(0)\rangle\langle\psi(0)|$ be the table that asks the question. It is Hermitian, its mean in $|\psi(t)\rangle$ is
$p_0(t)$, and $\Pi_0^2 = \Pi_0$, because $\langle\psi(0)|\psi(0)\rangle = 1$. The
[Heisenberg equation](/tutorial/quantum/operators/#the-quantum-equation-of-motion-is-the-classical-one-with-ihbar-times-the-bracket)
of section 8.2 gives $\dd p_0/\dd t = (i/\hbar)\langle[H, \Pi_0]\rangle$, and
[Robertson's inequality](/tutorial/quantum/operators/#two-quantities-that-do-not-commute-cannot-both-be-sharp) bounds
the mean of a commutator by twice the product of the two spreads:

$$\Bigl|\frac{\dd p_0}{\dd t}\Bigr| = \frac1\hbar\bigl|\langle[H, \Pi_0]\rangle\bigr| \le \frac{2}{\hbar}\,\sigma_E\,\sigma_\Pi .$$

Since $\Pi_0^2 = \Pi_0$, $\sigma_\Pi^2 = \langle\Pi_0\rangle - \langle\Pi_0\rangle^2 = p_0(1 - p_0)$. The spread $\sigma_E$ does not change
in time, because $H$ commutes with itself and with $H^2$, so the Heisenberg equation keeps both of their means. Hence

$$\Bigl|\frac{\dd p_0}{\dd t}\Bigr| \le \frac{2\sigma_E}{\hbar}\sqrt{p_0(1 - p_0)} .$$

We write $p_0 = \cos^2\phi$, with an angle $\phi(t)$ between 0 and $\pi/2$ that starts at $\phi(0) = 0$. Then $\dd
p_0/\dd t = -2\cos\phi\sin\phi\,\dd\phi/\dd t$ and $\sqrt{p_0(1 - p_0)} = \cos\phi\sin\phi$, so the inequality says
$|\dd\phi/\dd t| \le \sigma_E/\hbar$. The angle grows no faster than $\sigma_E/\hbar$, so $\phi(t) \le \sigma_Et/\hbar$,
and the overlap never falls faster than $\cos^2(\sigma_Et/\hbar)$. An orthogonal state has $\phi = \pi/2$, so

$$\boxed{\sym{orthogonality-time}{t_\perp} \ge \frac{\pi\hbar}{2\sigma_E}} ,$$

the **Mandelstam–Tamm bound**, the first **quantum speed limit**, a least time for a state to become different from
itself. The units check: $\sigma_Et/\hbar$ is joules times seconds over joule seconds, a pure number.

**When equality holds.** The two-level state has the overlap $\cos^2(\sigma_Et/\hbar)$ exactly, so it meets the bound
with equality. **Far from it**, take $\sqrt{1 - \epsilon}\,|E_1\rangle + \sqrt\epsilon\,|E_2\rangle$ with a small
weight $\epsilon$ on the upper level. Its spread is $\sigma_E = E\sqrt{\epsilon(1 - \epsilon)}$, so the bound allows
orthogonality after $\pi\hbar/2E\sqrt\epsilon$, yet its overlap, $1 - 4\epsilon(1 - \epsilon)\sin^2(Et/2\hbar)$, never
falls below $(1 - 2\epsilon)^2$: the state never becomes orthogonal at all. A second bound, by the mean energy above
the lowest level, is Margolus and Levitin's (1998).

**The same bound as information.** Let a scene's unknown strength $\theta$, a pure number, enter through an
interaction $\theta V$ acting for the time $\tau$, where $V$ is an energy operator of the camera with the standard
deviation $\sigma_V$ in its state. The camera's state is then $e^{-i\theta V\tau/\hbar}|\psi\rangle$. Two values of
$\theta$ a step $\delta\theta$ apart give states whose squared overlap is the expansion above with $\delta\theta\,V$ in
the place of $H$ and $\tau$ in the place of $t$. We write it in a second form,

$$1 - \frac{\sigma_V^2\tau^2}{\hbar^2}\,\delta\theta^2 + \dots = 1 - \frac{F_Q}{4}\,\delta\theta^2 + \dots ,$$

which defines the **quantum Fisher information**, here

$$\sym{quantum-fisher}{F_Q} = \frac{4\sigma_V^2\tau^2}{\hbar^2} .$$

Braunstein and Caves (1994) proved
that no measurement of the state draws more Fisher information about $\theta$ than $F_Q$; the box below proves it for
the pure states used here. The Cramér–Rao bound of
[section 3.3](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks)
then gives $\sigma_\theta \ge 1/\sqrt{F_Q}$ for any unbiased estimate of $\theta$, so

$$\boxed{\frac{\theta}{\sigma_\theta} \le \frac{2\theta\sigma_V\tau}{\hbar} = \frac{2E_{\rm int}\tau}{\hbar}} ,$$

where $\sym{interaction-energy}{E_{\rm int}} = \theta\sigma_V$ is the spread of the interaction energy $\theta V$, in
joules.

::: derivation
### No measurement draws more than $F_Q$ from a pure state

We want to bound the Fisher information of every measurement of the state $|\psi_\theta\rangle$. Take first a
measurement of the kind of section 8.1, with a complete orthonormal set of outcomes $|k\rangle$, so that outcome $k$
has the probability $p_k = |\langle k|\psi_\theta\rangle|^2$. The Fisher information of section 3.3, the mean square
of the score $\partial\ln p_k/\partial\theta$, is

$$F = \sum_kp_k\Bigl(\frac{\partial\ln p_k}{\partial\theta}\Bigr)^2 = \sum_k\frac{(\partial p_k/\partial\theta)^2}{p_k} .$$

We write $|\partial\psi\rangle$ for the derivative of the state with respect to $\theta$, and the product rule gives
$\partial p_k/\partial\theta = 2\,\mathrm{Re}\bigl(\langle k|\psi\rangle^*\langle k|\partial\psi\rangle\bigr)$.

**Removing the overall phase.** The length $\langle\psi|\psi\rangle = 1$ does not change with $\theta$, so its
derivative $2\,\mathrm{Re}\langle\psi|\partial\psi\rangle$ is zero, and $\langle\psi|\partial\psi\rangle$ is
imaginary. We subtract from $|\partial\psi\rangle$ its part along the state,

$$|\chi\rangle = |\partial\psi\rangle - \langle\psi|\partial\psi\rangle\,|\psi\rangle .$$

The part removed adds $p_k\langle\psi|\partial\psi\rangle$ to the bracket inside $\mathrm{Re}$, an imaginary number,
so $\partial p_k/\partial\theta = 2\,\mathrm{Re}\bigl(\langle k|\psi\rangle^*\langle k|\chi\rangle\bigr)$ as well. It
is the part of the change that only turns the overall phase, which no measurement sees.

**The bound.** The real part of a complex number is at most its size, so $(\partial p_k/\partial\theta)^2 \le
4p_k|\langle k|\chi\rangle|^2$, and each term of $F$ is at most $4|\langle k|\chi\rangle|^2$. The outcomes are complete
and orthonormal, so the sum of $|\langle k|\chi\rangle|^2$ over $k$ is $\langle\chi|\chi\rangle$, as for the record
of section 8.1. Multiplying out $\langle\chi|\chi\rangle$,

$$\boxed{F \le 4\langle\chi|\chi\rangle = 4\bigl(\langle\partial\psi|\partial\psi\rangle - |\langle\psi|\partial\psi\rangle|^2\bigr) = F_Q} .$$

**The camera's state.** For $|\psi_\theta\rangle = e^{-i\theta V\tau/\hbar}|\psi\rangle$, the derivative is
$|\partial\psi\rangle = -i(V\tau/\hbar)|\psi_\theta\rangle$, so $\langle\partial\psi|\partial\psi\rangle =
\langle V^2\rangle\tau^2/\hbar^2$ and $\langle\psi|\partial\psi\rangle = -i\langle V\rangle\tau/\hbar$. The bound is
$4\sigma_V^2\tau^2/\hbar^2$, the $F_Q$ found from the overlap. **Any measurement.** For the general measurements of
[the last section of this section](#a-measurement-is-a-set-of-positive-tables-that-add-to-one-and-a-gravitons-click-carries-about-a-bit),
$p_k = \langle\psi|\Pi_k|\psi\rangle$, the derivative is $2\,\mathrm{Re}\langle\psi|\Pi_k|\chi\rangle$, and the step
$|\langle\psi|\Pi_k|\chi\rangle|^2 \le p_k\langle\chi|\Pi_k|\chi\rangle$ is Robertson's argument of section 8.2 with
the bracket $\langle u|\Pi_k|w\rangle$ in place of $\langle u|w\rangle$, which serves because
$\langle u|\Pi_k|u\rangle$ is never negative. Then $\sum_k\Pi_k = 1$ gives the
same bound.

**When equality holds.** A spin one half up along $x$, turned about $z$ by $\theta$, has $V\tau/\hbar = S_z$ and $F_Q =
4\,\mathrm{Var}(S_z) = 1$. Measured along $y$, toward which it turns, it gives up with the probability $p = \tfrac12(1 +
\sin\theta)$, and $F = (\tfrac12\cos\theta)^2\,[1/p + 1/(1 - p)] = 1$: equality. Measured along $z$ it gives up half the
time whatever $\theta$ is, and $F = 0$.
:::

**The ceiling.** A camera within the distance $z$ of the scene, in metres, that is not a black hole has a mass below
$zc^2/2G$, with $G$ the gravitational constant and $c$ the speed of light (section
[11.1](/tutorial/black-holes/schwarzschild/)). Its energy of interaction with a source of mass $\sym{source-mass}{\matter M_s}$
is then below $G(zc^2/2G)\matter M_s/z = \matter M_sc^2/2$ in size, and $G$ and $z$ cancel. An energy confined to a
range of width $W$ has a standard deviation of at most $W/2$, so $E_{\rm int} \le \matter M_sc^2/4$, and the bound gives
$\SNR \le \matter M_sc^2\tau/2\hbar$ for the signal-to-noise ratio $\SNR$ of
[section 3.7](/tutorial/noise/blur-law/). We round $\matter M_sc^2/2$ up to $\matter M_sc^2$, an estimate's factor of
2, and write

$$\SNR \lesssim \frac{\matter M_sc^2\tau}{\hbar} .$$

The two bounds above are theorems; the assumption is that the scene acts through one fixed coupling and a single
measurement task.[^ceiling]

For the person of 70 kg watched for the age of the universe, $4.35\times10^{17}$ s, the ceiling is $2.6\times10^{70}$,
and the blur law gives $1.51°$ ([section 3.7](/tutorial/noise/blur-law/#what-the-law-means)), with or without the
factor ½. For the locked safe's 324 kg of gold it is $1.2\times10^{71}$. The camera's pull, unlike the ceiling, depends
on $z$, so we take $z$ = 3 m, the scale of a room. A camera of mass $zc^2/2G = 2.0\times10^{27}$ kg pulls at 3 m with
$1.5\times10^{15}$ times the Earth's gravity $g$. One that pulls no harder than the Earth is that much lighter, and the
ceiling falls by the same factor to $1.7\times10^{55}$, a blur of $1.91°$. On this estimate no near-field camera could draw a face.

The ideal pixel falls far below the ceiling. Its ratio on the person grows as $\tau^{3/2}$, from $1.44\times10^5$ in a
second, but only while the pair keeps its shape. The two grams pull each other together, with the relative
acceleration $2G\matter m/\xi^2 = 1.3\times10^{-9}\unit{m\,s^{-2}}$, and meet after about $\sqrt{\xi^3/G\matter m} =
3.9\times10^3$ s, an hour; the person's tide, moving them apart by $\tfrac12\curv{\tE}\xi\tau^2$, would part them
only after $\sqrt{2/\curv{\tE}} = 1.5\times10^4$ s. Read in stretches of $10^3$ s and averaged over the age of the
universe, the pixel reaches about $10^{17}$, a blur of 5.8°. The rule carried to the age of the universe would give
$4.1\times10^{31}$ and 3.2°, a formal extrapolation (Figure [](#fig:snr-ladder)).

![Look first at how little the blur moves: sixty-eight powers of ten of signal-to-noise ratio narrow it from 26° to
1.5°. The ratios are for the person of 70 kg a metre away; the blurs are the exact calculation of section 3.7. The open circle
at $4\times10^{31}$ is a formal extrapolation.](tut-snr-ladder){#fig:snr-ladder}

## A measurement is a set of positive tables that add to one, and a graviton's click carries about a bit

We want a measurement whose outcomes are directions on the sky. The kind of section 8.1 will not do, because its
outcomes are orthonormal states, and a spin $s$ has only $2s + 1$ of them while the sky has infinitely many directions.
A **measurement** in general is a set of tables $\sym{povm-element}{\Pi_k}$, one for each outcome $k$, each Hermitian
and positive, with $\langle\psi|\Pi_k|\psi\rangle \ge 0$ in every state (the positive semidefinite tables of
[section 3.4](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes), with no
eigenvalue negative), and with $\sum_k\Pi_k = 1$. Outcome $k$ then has the probability $\langle\psi|\Pi_k|\psi\rangle$.
Positivity makes each probability non-negative and the sum makes them add to one, in every state, which are the only
two things a list of probabilities needs. Such a set is a **POVM**, a positive operator-valued measure.[^povm] The
orthonormal outcomes $|k\rangle$ of section 8.1 are the special case $\Pi_k = |k\rangle\langle k|$.

**The example.** The [spin coherent states](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky)
$|\hat n\rangle_s$ of section 8.4, of spin $\sym{spin-number}{s}$ are complete, so the tables

$$\sym{coherent-povm}{\Pi(\hat n)}\,\dd\Omega = \frac{2s + 1}{4\pi}\,|\hat n\rangle_s\langle\hat n|_s\,\dd\Omega$$

add, over the sphere, to one. They are a measurement with one outcome for each direction. **A non-example.** The same
tables without the factor $(2s + 1)/4\pi$ add to $4\pi/(2s + 1)$ times the identity, not to one.

**One quantum.** A graviton from $\hat n_0$ is in the spin-two coherent state $|\hat n_0\rangle_2$. A click at $\hat
n$ then has the probability density $\langle\hat n_0|\Pi(\hat n)|\hat n_0\rangle$, and the overlap of section 8.4
gives, at the angle $\vartheta$ from $\hat n_0$,[^label]

$$p(\hat n) = \frac{2s + 1}{4\pi}\cos^{4s}\frac\vartheta2 .$$

For a graviton, $s = 2$, this is $(5/4\pi)\cos^8(\vartheta/2)$. An empty mode has no quantum to click, so the
measurement adds no noise.

**The bits.** We want the mutual information of
[section 3.8](/tutorial/noise/bits/#a-number-with-a-spread-has-a-differential-entropy-and-only-its-changes-count) between the source's direction, equally likely anywhere, and the click. Averaging $p$ over $\hat
n_0$, with the weight $\dd\Omega_0/4\pi$, puts the completeness of section 8.4 between $\langle\hat n|_s$ and $|\hat
n\rangle_s$, so the clicks have the density $1/4\pi$ everywhere, with the entropy $\log_2 4\pi$ (3.8's integrals with
$\dd\Omega$ in the place of $\dd x$). For a known source we write $y = \cos^2(\vartheta/2) = (1 + \cos\vartheta)/2$, so
that $p = (2s + 1)y^{2s}/4\pi$. Integrating first over the azimuth $\varphi$ about $\hat n_0$, $\dd\Omega =
\sin\vartheta\,\dd\vartheta\,\dd\varphi$ becomes $2\pi\sin\vartheta\,\dd\vartheta = 4\pi\,\dd y$. With $\int_0^1y^{2s}\ln
y\,\dd y = -1/(2s + 1)^2$,

$$\begin{aligned}
h(\hat n|\hat n_0) &= -\int_0^1(2s + 1)y^{2s}\log_2\frac{(2s + 1)y^{2s}}{4\pi}\,\dd y\\
&= \log_2 4\pi - \log_2(2s + 1) + \frac{2s}{(2s + 1)\ln2} .
\end{aligned}$$

The mutual information is the difference of the two entropies:

$$\boxed{I = \log_2(2s + 1) - \frac{2s}{(2s + 1)\ln2}\ \text{bits}} .$$

It is 1.17 bits for a graviton, 0.62 for a photon and, as a check, zero for a scalar ($s = 0$), whose click is spread
evenly whatever its source: three numbers that follow from the one formula. Larger spins point more sharply and tell more.

**The Fisher information.** Tilt the source by a small angle $\epsilon$, in radians, from $\hat n_0 = \hat z$ to
$(\sin\epsilon, 0, \cos\epsilon)$. A click at $\hat n = (\sin\vartheta\cos\varphi, \sin\vartheta\sin\varphi,
\cos\vartheta)$ is then at the angle $\Theta$ from the source, with $\cos\Theta = \hat n\cdot\hat n_0 =
\sin\vartheta\cos\varphi\sin\epsilon + \cos\vartheta\cos\epsilon$, which changes at the rate $\sin\vartheta\cos\varphi$
at $\epsilon = 0$. Up to a constant, $\ln p$ is $2s\ln(1 + \cos\Theta)$. So the score of section 3.3, $\partial\ln
p/\partial\epsilon$, is $2s\sin\vartheta\cos\varphi/(1 + \cos\vartheta)$ at $\epsilon = 0$, and its square is
$4s^2\cos^2\varphi\,(1 - y)/y$, since $\sin^2\vartheta = (1 - \cos\vartheta)(1 + \cos\vartheta)$. The Fisher information
is the mean of the squared score, and the mean of $\cos^2\varphi$ is $\tfrac12$, so

$$\begin{aligned}
F &= \int_0^1(2s + 1)y^{2s}\,\frac{2s^2(1 - y)}{y}\,\dd y\\
&= 2s^2(2s + 1)\Bigl(\frac1{2s} - \frac1{2s + 1}\Bigr) = s
\end{aligned}$$

per graviton and per angle. A tilt by $\epsilon$ is the turn $e^{-i\epsilon S_\perp}$, with $S_\perp$ the spin across $\hat n_0$ measured in units of
$\hbar$, as in section 8.4. This is the turn $e^{-i\theta V\tau/\hbar}$ of [the speed limit's
section](#no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera) with $\epsilon$ for
$\theta$ and $S_\perp$ for $V\tau/\hbar$, so the quantum Fisher information gives the quantum limit for one angle
alone, $F_Q = 4\,\mathrm{Var}(S_\perp) = 2s$: in a coherent state each of the $2s$ spins one half adds $\tfrac14$ to
the variance. The click draws half of it.[^bits] **A number.** One graviton a second for half an hour, 1800 gravitons
with $F = 2$ each, gives $F = 3600$ per angle, and an error of $1/\sqrt{3600} = 0.0167$ rad, $0.95°$: the direction of
the Sun's core to a degree in half an hour.

## Each kind of detector reads its own part of the tide

An interferometer such as LIGO reads one combination of $\curv{\tE}$, the difference along its two arms, integrated
twice in time, as the strain of
[section 7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain). In a wave
the magnetic part $\curv{\tB}$ also enters its response, at first order in the arm length over the wavelength
[@BaskaranGrishchuk2004]. A **resonant-mass detector** is a body whose ringing a tide excites, and a sphere's five
quadrupole modes ring in proportion to the five numbers of $\curv{\tE}$
([section 1.5](/tutorial/newton/five-numbers/#patterns-of-higher-degree-hold-7-9-and-more-numbers);
[@Forward1971; @WagonerPaik1977]). Gyroscopes read $\curv{\tB}$
([section 7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)).
All of them feel the changing pull of air, ground and people nearby, the **Newtonian noise**, which observatories model
and subtract [@Harms2019].

::: try {#quantum-limit}
Two panels. In the first, two free masses are read once, left alone for a time $\tau$ and read again; the bells show
each position's spread at the two readings, and the small plot beside them is Figure [](#fig:sql-compromise) with a
dot at your first reading. You set the first reading's sharpness against its best value, the mass, the time and the
separation, and read the tide the pair resolves, as the one-mass estimate and for the distance of the two. The second
panel has the axes of Figure [](#fig:sql-interferometer), the line $h_{\rm SQL}$ for mirrors of 40 kg and arms of 4 km,
and the quantum noise for a laser power you choose.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, set
the mass to 10 kg, the time to 100 s and the separation to 10 cm, and check the first problem's two tides.
:::

**The idea to keep: reading a free mass disturbs it, so following it for a time $\tau$ is limited to
$\sqrt{\hbar\tau/m}$, which lets two gram masses read a tide of about $10^{-13}\,\mathrm{s^{-2}}$ in a second; that
limit belongs to one way of reading and can be beaten. What cannot be beaten is the rate at which any state can change,
set by its energy, and with the largest energy a camera can have without becoming a black hole it caps the signal from a
person at about $10^{70}$, a blur of 1.5°.**

::: problems
### Practice

**[8.6]** Two 10 kg masses 10 cm apart are read for 100 s at the standard quantum limit. What tide do they resolve,
with the one-mass estimate and for the distance between the two?

::: solution
$\sigma_{\rm SQL} = \sqrt{1.055\times10^{-34}\times100/10}\unit m = 3.2\times10^{-17}$ m, so $\Delta\curv{\tE} \approx
2\sigma_{\rm SQL}/\xi\tau^2 = 6.5\times10^{-20}\unit{s^{-2}}$, and $\sqrt2$ times more, $9.2\times10^{-20}\unit{s^{-2}}$,
for the distance of the two.
:::

**[8.6]** Why can the standard quantum limit be beaten, but not the ceiling of $10^{70}$?

::: solution
The limit comes from one way of reading. The ceiling comes from how fast any state can change, whatever is read.
:::

**[8.6]** How many bits does one graviton's click carry about its direction, and why does a photon's carry fewer?

::: solution
1.17 against 0.62. The photon's click density, $\cos^4(\vartheta/2)$, is broader than the graviton's
$\cos^8(\vartheta/2)$.
:::

**[8.6]** A state is half in each of two levels 1 meV apart. What is the least time in which it can become orthogonal
to itself, and does it reach it?

::: solution
Its spread is $\sigma_E = 0.5\unit{meV} = 8.0\times10^{-23}$ J, so $t_\perp \ge \pi\hbar/2\sigma_E = 2.07\times10^{-12}$ s.
Its overlap is $\cos^2(Et/2\hbar)$, which first vanishes at $\pi\hbar/E$, the same 2.07 ps: it meets the bound.
:::

**[8.6]** At what occupation does combining two pixels before counting draw twice the information of recording them,
and how much does each draw there per pair of modes?

::: solution
$1 + 1/\bar n = 2$ at $\bar n = 1$, where $F_{\rm count} = 2/2 = 1$ and $F_{\rm rec} = 2/4 = \tfrac12$.
:::

### Stretch

**[8.6]** The person is watched at the ceiling for one year instead of the age of the universe. What is the ceiling,
and the blur?

::: solution
$70\times(3.00\times10^8)^2\times3.156\times10^7/1.055\times10^{-34} = 1.9\times10^{60}$. Then $q_c - \ln q_c = \ln(\pi
\times 1.9\times10^{60})$ gives $q_c = 145$, and the blur is $1.75°$, wider than at the age of the universe by only a
sixth.
:::

**[8.6]** A magnet of the Large Hadron Collider holds 8.3 T over 14.3 m. What is the chance that a graviton crossing
it along its length becomes a photon, and how many such magnets in a row would convert one graviton in a million?

::: solution
$P_{\rm conv} = 4\pi GB_0^2L^2/\mu_0c^4 = 1.2\times10^{-33}$ for one magnet. In a row the length adds, so the chance grows as the square
of their number $n$: $n^2\times1.2\times10^{-33} = 10^{-6}$ gives $n = 2.9\times10^{13}$, a row $4\times10^{14}$ m long,
about 2800 times the distance from the Earth to the Sun.
:::

**[8.6]** Show that a spin coherent state of spin $s$, turned by a small angle about an axis across its direction, has
the quantum Fisher information $2s$, and that the click measurement of the last section, with $F = s$, is not the best
measurement for that one angle.

::: solution
With $V\tau/\hbar = S_\perp$, $F_Q = 4\,\mathrm{Var}(S_\perp)$. Each of the $2s$ spins one half points along the state's
direction, so its spin across has mean zero and variance $\tfrac14$, and independent spins add their variances:
$\mathrm{Var}(S_\perp) = 2s/4$ and $F_Q = 2s$. The clicks draw $s$, half of it, so a measurement aimed at that one angle
alone does better.
:::

### The camera

**[8.6]** Reproduce the ceiling for the person, its blur, the $10^{15}$ times the Earth's gravity of the camera that
is not a black hole, and the lighter camera's ceiling and blur.

::: solution
$70 \times (3.00\times10^8)^2 \times 4.35\times10^{17}/1.055\times10^{-34} = 2.6\times10^{70}$, with $q_c = 168$ and a
blur of $1.51°$. The camera of mass $3c^2/2G = 2.0\times10^{27}$ kg pulls at 3 m with $G\times2.0\times10^{27}/9 =
1.5\times10^{16}\unit{m\,s^{-2}}$, $1.5\times10^{15}$ times $9.81\unit{m\,s^{-2}}$. A camera that pulls with
$9.81\unit{m\,s^{-2}}$ has $1.3\times10^{12}$ kg, so the ceiling falls by the same factor to $1.7\times10^{55}$, where the
blur is $1.91°$.
:::
:::

::: paper
- Section II's [*What the premise asks*](/paper/#par:what-the-premise-asks): the two gram masses at the standard quantum
  limit, the gradiometers, the sphere's five numbers and $\curv{\tB}$ in an interferometer.
- Section IV's [plain words](/paper/#sec:near-field) and [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity):
  the ceiling $\SNR \lesssim \matter M_sc^2\tau/\hbar$, $10^{70}$, $1.5°$, $10^{55}$ and $1.9°$.
- Section IX's [*Counting or recording*](/paper/#par:counting-or-recording): Caves's half quantum, counting with no
  noise, the coherent-state measurement, 1.17 bits, the Fisher information $s$ and the Sun's core in half an hour.
- Section VII's [*What a lens would add*](/paper/#par:what-a-lens-would-add): why combining the field before detection
  matters, by the added noise of recording.
- Section VIII's [*Variation across the array*](/paper/#par:variation-across-the-array): Newtonian noise.
:::

::: deeper
- The [GR course, chapter 10](https://neovand.github.io/general-relativity/chapter-10.html#what-a-tidal-instrument-measures)
  says what a small cloud of test masses can determine of the curvature and what it misses.
- V. B. Braginsky and F. Ya. Khalili, *Quantum Measurement* (Cambridge, 1992): the standard quantum limit, back-action
  evasion and quantum non-demolition measurement in full.
- C. M. Caves, *Physical Review D* 26, 1817 (1982): the half quantum of added noise for any gain.
- S. Deffner and S. Campbell, *Journal of Physics A* 50, 453001 (2017): the quantum speed limits, with the proofs of
  Mandelstam and Tamm's and of Margolus and Levitin's.
:::

[^microscope]: Heisenberg pictured this in 1927 as a microscope: light that locates a particle sharply has a short
    wavelength, and each photon that bounces off kicks it hard.

[^tau]: The letter $\tau$ is a relaxation time in section 4.4 and an optical depth in section 5.5; here it is only a
    reading time.

[^units]: The units check: $\mathrm{J\,s}\times\mathrm{s}/\mathrm{kg} = \mathrm{m^2}$, whose square root is a length.

[^reduced]: The same spread follows from the motion of the distance itself, which is that of one body of the
    **reduced mass** $\matter m_1\matter m_2/(\matter m_1 + \matter m_2)$, here $\matter m/2$.

[^pixel]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, as the ideal pixel that resolves
    $9\times10^{-14}\,\mathrm{s^{-2}}$.

[^hsql]: The units check: $\mathrm{J\,s}/(\mathrm{kg\,s^{-2}\,m^2}) = \mathrm s = \mathrm{Hz^{-1}}$, whose square
    root is $\mathrm{Hz^{-1/2}}$.

[^recording]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IX, which concludes that a thermal
    gravitational image recorded pixel by pixel would be buried in that noise.

[^ceiling]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its ceiling of about $10^{70}$ on
    the signal-to-noise ratio for a person.

[^povm]: Any such measurement can be made by letting the system touch a second one and then making a measurement of
    the kind of section 8.1 on the two together (Naimark's theorem).

[^label]: A graviton from $\hat n_0$ travels along $-\hat n_0$, and its coherent state points that way too. We label
    its state, and each click, by the opposite direction, toward the source.

[^speed]: L. Mandelstam and I. Tamm, *Journal of Physics (USSR)* 9, 249 (1945); S. L. Braunstein and C. M. Caves,
    *Physical Review Letters* 72, 3439 (1994).

[^gert]: M. E. Gertsenshtein, *Soviet Physics JETP* 14, 84 (1962); J. Plebanski, *Physical Review* 118, 1396 (1960).

[^combine]: First shown in *The gravitational camera* (Mohsenvand 2026), Secs. VII and IX,
    [*Counting or recording*](/paper/#par:counting-or-recording), that combining before detection is what lets a camera
    form an image from counted gravitons.

[^bits]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IX, with the 1.17 bits and the Fisher
    information $s$ per graviton, half the quantum limit $2s$ for one angle alone.
