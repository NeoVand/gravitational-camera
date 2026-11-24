---
id: '8.6'
title: 'Measurement, added noise and the standard quantum limit; detectors and strain'
question: 'Section II says that two free masses of a gram, a centimetre apart and read for a second at the standard quantum limit, "would resolve $6\times10^{-14}\,\mathrm{s^{-2}}$", and Section IV that no camera could do better than a signal-to-noise ratio of about $10^{70}$ on a person, even watching for the age of the universe. Why does watching a free mass disturb it, and what limits does quantum mechanics set on reading a tide?'
part: '8'
requires: ['1.4', 'R1', '3.1', '3.2', '3.3', '3.7', '3.8', '8.1', '8.2', '8.3', '8.4']
paper: [sec:pixel, sec:near-field, sec:first-image, sec:no-lens, sec:one-pixel]
figures: []
live: []
depth: A
---

The paper's paragraph [*What the premise asks*](/paper/#par:what-the-premise-asks), in its Section II, ends its list
of instruments with an ideal one: "Two free masses of a gram, a centimetre apart and read for a second at the standard
quantum limit, would resolve $6\times10^{-14}\,\mathrm{s^{-2}}$, a hundred thousand times less than the person's tide."
Chapter [R1](/tutorial/newton/reading-section-ii/#what-the-premise-asks-existing-instruments-nearly-supply) checked the
arithmetic from an uncertainty of $3.25\times10^{-16}$ m and left two things to this chapter: where that uncertainty
comes from, and "factors such as the $\sqrt2$ of two masses". Section IV's
[*Limits on sensitivity*](/paper/#par:limits-on-sensitivity) goes further and estimates a ceiling that no camera could
pass, about $10^{70}$ on a person.

Why does watching a free mass disturb it, and what limits does quantum mechanics set on reading a tide? We answer with
the uncertainty relation of [chapter 8.2](/tutorial/quantum/operators/) and the states of chapters
[8.1](/tutorial/quantum/states/), [8.3](/tutorial/quantum/quanta/), [8.4](/tutorial/quantum/spin/) and
[8.5](/tutorial/quantum/counting-quanta/).

::: plain
To read where a mass is, something must touch it, such as light bouncing off it. The touch gives the mass a small kick
of unknown size, and the sharper the reading, the harder the kick. A free mass then drifts by an amount that grows
with time. Reading it sharply at the start makes the drift worse later, and reading it loosely leaves the start
uncertain. The best compromise is the standard quantum limit: for a gram watched for a second, about a fifth of the
width of a proton.

This limit belongs to one way of reading, and cleverer readings beat it. What no reading beats is the speed at which
any quantum state can change, which is set by the spread of its energy. A camera too heavy for its size would be a
black hole, so its energy of interaction with a scene is limited, and the paper estimates from this that no camera
could watch a person with a signal-to-noise ratio better than about $10^{70}$. The picture would still be blurred by
1.5°.

A counter of gravitons adds no noise at all, but each graviton it counts tells only about one bit about where the
graviton came from.
:::

## Reading a position disturbs the momentum

We want to know what a sharp reading does to a free mass $\matter m$, in kilograms. In [chapter 8.1](/tutorial/quantum/states/#probabilities-are-the-squared-sizes-of-amplitudes)
a measurement asked a question and the Born rule gave the probabilities of its answers. A reading of a position does
more: after it, the mass is in a state that agrees with the answer. We assume that **after a reading to within
$\sigma_0$, the position has the standard deviation $\sigma_0$**. Here $\sym{first-reading-spread}{\sigma_0}$, in
metres, is the sharpness of the reading.

Chapter 8.2's [uncertainty relation](/tutorial/quantum/operators/#the-uncertainty-relation-is-robertsons-inequality-for-position-and-momentum)
$\sigma_x\sigma_p \ge \hbar/2$, with $\hbar = 1.055\times10^{-34}\unit{J\,s}$ the reduced Planck constant, then holds
in the new state, so its momentum has the spread

$$\sigma_p \ge \frac{\hbar}{2\sigma_0} .$$

The reading has given the mass a momentum it did not know before. This disturbance of the quantity that was not read
is the **back-action** of the measurement.[^microscope]

**A number.** A gram read to $10^{-16}$ m receives a spread of velocities of at least $\hbar/2\matter m\sigma_0 =
5.3\times10^{-16}\unit{m\,s^{-1}}$. In one second that spread carries the mass five times farther than the reading's
own uncertainty.

## A free mass watched for a time cannot be followed better than the standard quantum limit

We want the smallest spread of a free mass's position a time $\tau$ after a first reading, because the paper reads a
tide by how far it moves two masses in that time. Here $\sym{reading-time}{\tau}$ is the reading time, in
seconds.[^tau] We assume that **the mass is free**, so that a force that does not depend on its position moves its mean
and not its spread, and that **the first reading leaves no chirp**: the position and the momentum of the new state are
uncorrelated, as in chapter 8.2's [Gaussian packet](/tutorial/quantum/operators/#the-uncertainty-relation-is-robertsons-inequality-for-position-and-momentum).

Chapter 8.2's Practice problem found that such a packet spreads as

$$\sigma_x(\tau)^2 = \sigma_0^2 + \Bigl(\frac{\sigma_p\tau}{\matter m}\Bigr)^2 .$$

We put in the back-action, $\sigma_p \ge \hbar/2\sigma_0$:

$$\sigma_x(\tau)^2 \ge \sigma_0^2 + \Bigl(\frac{\hbar\tau}{2\matter m\sigma_0}\Bigr)^2 . \label{eq:spread}$$

The first term falls as the first reading sharpens, and the second grows. A square cannot be negative, so
$(\sigma_0 - \hbar\tau/2\matter m\sigma_0)^2 \ge 0$, and expanding it gives $\sigma_0^2 + (\hbar\tau/2\matter m\sigma_0)^2
\ge \hbar\tau/\matter m$, with equality when $\sigma_0^2 = \hbar\tau/2\matter m$. The least spread is therefore

$$\boxed{\sym{sql-width}{\sigma_{\rm SQL}} = \sqrt{\frac{\hbar\tau}{\matter m}}} ,$$

the **standard quantum limit** for a free mass, the quantity that R1 wrote $\Delta x$.[^units]

**A number.** A gram watched for a second has $\sigma_{\rm SQL} = 3.25\times10^{-16}$ m, R1's value, about a fifth of
the width of a proton, whose radius is $8.4\times10^{-16}$ m. The best first reading is $\sigma_0 =
\sqrt{\hbar\tau/2\matter m} = 2.30\times10^{-16}$ m. **A limit.** As $\matter m \to \infty$ or $\hbar \to 0$ the limit
goes to zero, and classical mechanics follows a free mass as closely as we like.

**What it means.** Past the best $\sigma_0$, reading more sharply at the start blurs the end more. If the first reading
is ten times sharper than the best, the second term of [](#eq:spread) is a hundred times larger than there, and the
final spread is seven times $\sigma_{\rm SQL}$. The best is a compromise, not zero, and it grows as $\sqrt\tau$.

<!-- diagram: tut-sql-compromise — One panel, about 560 × 380 px at 1440 (full width on a phone), logarithmic on both
axes: across, σ₀/σ_SQL from 0.03 to 30; up, σ_x(τ)/σ_SQL from 0.5 to 30. Three curves, thin single strokes: the first
reading's own term σ₀ (a straight line of slope +1, dashed grey, labelled "first reading" beside its upper end), the
back-action's term ħτ/2mσ₀ (a straight line of slope −1, dashed grey, labelled "back-action" beside its upper left
end), and their quadrature sum √(σ₀² + (ħτ/2mσ₀)²) in ink, labelled "σ_x(τ)". The minimum of the sum at σ₀/σ_SQL =
1/√2 = 0.707, value 1, marked with an ink dot and a thin horizontal line at σ_x(τ)/σ_SQL = 1 labelled "σ_SQL = √(ħτ/m)"
at the right; a thin vertical tick on the axis at 0.707 labelled "√(ħτ/2m)". Two small open circles on the ink curve at
σ₀/σ_SQL = 0.0707 and 7.07 (ten times sharper and ten times looser than the best), each at height 7.07, labelled "×7".
No orange or blue (they are the tide's stretch and squeeze). Caption: "Look first at the lowest point of the ink
curve: no first reading leaves the mass better known after the time τ than √(ħτ/m). Sharper readings (left) leave a
larger kick, looser ones (right) a larger start. The curves are exact for a packet with no chirp." -->

## Two gram masses read for a second resolve a tide a hundred thousand times smaller than the person's

We want the smallest tide this limit allows two free masses to read. By the paper's equation
[](/paper/#eq:deviation) (chapter [1.4](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives)),
two masses a distance $\sym{separation}{\xi}$ apart, at rest at the start, are moved relative to each other by
$\tfrac12\curv{\tE}\xi\tau^2$ in the time $\tau$. A tide is resolved when this exceeds the spread, so the smallest
resolved tide is about

$$\begin{aligned}
\sym{smallest-tide}{\Delta\curv{\tE}} \approx \frac{2\sigma_{\rm SQL}}{\xi\tau^2}
&= \frac{2\times3.25\times10^{-16}}{0.01\times1^2}\unit{s^{-2}}\\
&= 6.5\times10^{-14}\unit{s^{-2}} ,
\end{aligned}$$

the paper's "$6\times10^{-14}$". The person a metre away makes $9.34\times10^{-9}\unit{s^{-2}}$ (1.4), 144,000 times
more, "a hundred thousand times less than the person's tide". On the person, this pixel reads a signal-to-noise ratio
of $1.44\times10^5$ in a second.

**The $\sqrt2$.** This estimate gives one mass the limit and treats the other as a perfect reference. What is read is
the distance between them, and each has its own spread. The spreads of independent masses add in squares (chapter
[3.1](/tutorial/noise/probability/#covariance-describes-noise-that-two-readings-share)), so the distance has the spread
$\sqrt2\,\sigma_{\rm SQL} = \sqrt{2\hbar\tau/\matter m} = 4.6\times10^{-16}$ m,[^reduced] and the tide is
$9.2\times10^{-14}\unit{s^{-2}}$. Both are "about $10^{-13}$": the paper's figure is the one-mass estimate, and the
larger one is the distance between two equal masses.

**Against real instruments.** The superconducting gradiometer of Section II reaches $0.02\unit{E}$ in a second,
$2\times10^{-11}\unit{s^{-2}}$ (*stated in the paper*), and so gives the person R1's ratio of 467. On the paper's
reading it is 300 times short of the ideal pixel.[^grad]

<!-- diagram: tut-sql-pixel — Two panels, about 640 × 300 px at 1440 (stacked on a phone). Left: two small grey balls,
labelled "1 g" each, a centimetre apart along a horizontal line, drawn twice, at "t = 0" (top) and "t = 1 s" (bottom);
above each ball a narrow ink bell for its position's spread, of width σ₀ = 2.3 × 10⁻¹⁶ m at the top and σ_SQL =
3.25 × 10⁻¹⁶ m at the bottom (both drawn hugely magnified; a note "spreads magnified about 10¹³ times"); at the right,
the person (the stone figure of Part 1, small) a metre away along the same line, with a thin dimension line "1 m".
Right: a vertical logarithmic strip of tides from 10⁻¹⁵ to 10⁻⁸ s⁻², with three ticks labelled beside them: "the
person, 9.3 × 10⁻⁹", "gradiometer, 0.02 E in 1 s, 2 × 10⁻¹¹" and "the SQL pixel, 6.5 × 10⁻¹⁴", the last with a short
bracket up to "9.2 × 10⁻¹⁴ (distance of the two)". No orange or blue except a short orange arrow on each ball at the
bottom showing the stretch toward the person, labelled "½𝓔ξτ²". Caption: "Look first at the strip: the ideal pixel of
Section II reads tides 144,000 times smaller than the person's. The bells are the position's spreads at the first and
the second reading; their sizes and the person's distance are not to scale." -->

## The standard quantum limit belongs to one way of reading, and it can be beaten

The limit came from three choices: reading the position, reading it twice, and starting from a state with no chirp.
None is required. A reading of a free mass's momentum disturbs its position, and the position never feeds back into the
momentum, so the momentum can be read again and again. A reading that its own disturbance never reaches is a **quantum
non-demolition measurement**, and arranging one is **back-action evasion** (Braginsky, Vorontsov and Thorne, and Caves
and colleagues, both 1980; stated here).

**An interferometer.** LIGO reads the difference of the lengths of its two arms, $\sym{arm-length}{L}$ = 4 km, with
laser light reflected from mirrors of $\matter m = 40$ kg. More laser power $P$, in watts, reads the length more
sharply, because the noise of counting photons, **shot noise**, falls as $P^{-1/2}$ (chapter
[3.2](/tutorial/noise/random-signals/#randomly-placed-masses-are-a-noise-too)). It also kicks the mirrors harder:
**radiation-pressure noise**, the random push of the photons' momenta, grows as $P^{1/2}$ and moves free mirrors less at
higher frequency. The balance of the two at each frequency is the interferometer's standard quantum limit. For a
signal of frequency $f$, with the angular frequency $\omega = 2\pi f$ in $\mathrm{s^{-1}}$, we state it in the form

$$\sym{sql-strain}{h_{\rm SQL}} = \sqrt{\frac{8\hbar}{\matter m\omega^2L^2}} ,$$

an **amplitude spectral density** of the strain, the square root of chapter
[3.2](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies)'s spectrum, in
$\mathrm{Hz^{-1/2}}$ and one-sided, as instrument makers quote it.[^hsql] At 100 Hz, $\omega = 628\unit{s^{-1}}$ and
$h_{\rm SQL} = 1.8\times10^{-24}\unit{Hz^{-1/2}}$. The variance of the strain over a band is the spectrum
$h_{\rm SQL}^2$ added up over the band's frequencies, so from 50 to 150 Hz, where $h_{\rm SQL}$ falls as $1/f$, the
strain is $2.1\times10^{-23}$. That is about fifty times smaller than the waves of $10^{-21}$ that LIGO detects
(chapter [7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain)).

::: gap
This sketch skips the spectral form of the uncertainty relation: a reading of a position with the one-sided noise
spectrum $S_x$, in $\mathrm{m^2\,Hz^{-1}}$, pushes the mass with a random force of spectrum $S_F$, and $S_xS_F \ge
\hbar^2$ when the two are uncorrelated (Braginsky and Khalili). Shot noise is $S_x$ and radiation pressure $S_F$. A
force at the frequency $\omega$ moves a free mass by $F/\matter m\omega^2$, so the total $S_x + S_F/\matter
m^2\omega^4$ is at least $2\hbar/\matter m\omega^2$, by the same square as for
[the free mass](#a-free-mass-watched-for-a-time-cannot-be-followed-better-than-the-standard-quantum-limit). The
difference of two arms of two mirrors each moves as one body of a quarter of a mirror's mass, and the strain is that
difference over $L$, which gives $8\hbar/\matter m\omega^2L^2$.
:::

**Squeezed light.** Both noises come from the zero point of the light entering the interferometer: one quadrature
makes the shot noise, the other the radiation pressure. Chapter 8.5's
[squeezed vacuum](/tutorial/quantum/counting-quanta/#a-squeezed-state-is-narrower-than-the-zero-point-in-one-direction),
sent in instead, narrows one quadrature and widens the other. Squeezed in the shot-noise quadrature, it reads the
length more finely than the zero point allows, but alone this acts as more power. Squeezed in a mixture of the two, it
makes the reading's noise and the mirrors' kick partly cancel, so the quantum noise falls below the limit in a band.
In 2020 LIGO Livingston did this and inferred, after subtracting its classical noise, a quantum noise 3 dB (half the
power) below its standard quantum limit at 40 Hz (H. Yu and colleagues, *Nature* 583, 43; stated). That quantum part
was 28% of the total noise power, so the total stayed above the limit. The paper's ceiling
([below](#no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera)) does not use this limit.

<!-- diagram: tut-sql-interferometer — One panel, about 560 × 380 px at 1440 (full width on a phone), logarithmic on
both axes: across, frequency from 10 to 1000 Hz; up, strain noise from 10⁻²⁵ to 10⁻²² Hz^-1/2. The line h_SQL(f) =
√(8ħ/mω²L²) for m = 40 kg, L = 4 km (falling as 1/f, through 3.65 × 10⁻²⁴ at 50 Hz, 1.83 × 10⁻²⁴ at 100 Hz,
0.914 × 10⁻²⁴ at 200 Hz), thick ink, labelled "h_SQL" at its right end. For three laser powers, P₀/10, P₀ and 10P₀,
with P₀ chosen so that the curve touches h_SQL at 100 Hz, the total quantum noise √(S_shot + S_rp) as thin grey
curves, each flat at high frequency (shot noise, ∝ P^-1/2) and falling as f⁻² at low frequency (radiation pressure,
∝ P^1/2), touching the h_SQL line once, at 31.6 Hz, 100 Hz and 316 Hz; each labelled "P₀/10", "P₀", "10 P₀" beside its
flat part. The touching points marked with small ink dots. No orange or blue. Caption: "Look first at the dots: each
laser power reaches the limit at one frequency only, where its shot noise and its radiation pressure are equal. More
power helps above that frequency and hurts below it, and squeezing in the shot-noise quadrature acts as more power.
The curves are exact for an ideal interferometer of LIGO's size; real noise has other sources." -->

## Recording both quadratures of a wave adds half a quantum of noise

A mode of a wave has two quadratures, chapter 8.5's
[$X_1$ and $X_2$](/tutorial/quantum/counting-quanta/#a-thermal-source-gives-geometric-counts-with-a-larger-spread), the
amplitudes of its cosine and sine parts. For an oscillator of angular frequency $\omega$ they are $X_1 = x$ and $X_2 =
p/\matter m\omega$, both in metres. Their commutator is $[X_1, X_2] = i\hbar/\matter m\omega$, so Robertson's
inequality gives $\sigma_{X_1}\sigma_{X_2} \ge \hbar/2\matter m\omega = x_{\rm zp}^2$, with chapter
[8.3](/tutorial/quantum/quanta/#its-energies-are-evenly-spaced-and-the-lowest-is-not-zero)'s zero-point width
$x_{\rm zp}$. A device that records both at once, as a radio receiver records a wave's amplitude and phase, is a
**phase-insensitive amplifier**, one that magnifies both quadratures alike, or a **heterodyne** receiver, which mixes
the wave with a reference of nearby frequency.

We want the least noise such a device must add. Its two records are read at the same time, so they must commute. We
assume that **the device records $O_1 = X_1 + Y_1$ and $O_2 = X_2 + Y_2$**, where $Y_1$ and $Y_2$, in metres, belong to
a second system inside the device and so commute with $X_1$ and $X_2$. Then

$$\begin{aligned}
[O_1, O_2] &= [X_1, X_2] + [Y_1, Y_2]\\
&= \frac{i\hbar}{\matter m\omega} + [Y_1, Y_2] ,
\end{aligned}$$

and the records commute only if $[Y_1, Y_2] = -i\hbar/\matter m\omega$: the second system's commutator must cancel the
mode's. Robertson's inequality then holds for it too, $\sigma_{Y_1}\sigma_{Y_2} \ge x_{\rm zp}^2$. We assume also that
**the device is phase-insensitive**, so that $\sigma_{Y_1} = \sigma_{Y_2}$. Each added variance is then at least
$x_{\rm zp}^2$, a variance and not a spread; without this symmetry only their product is bounded, by $x_{\rm zp}^4$.
Independent variances add (chapter 3.1), so each record's variance is the mode's own plus at least $x_{\rm zp}^2$.

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

::: gap
This skips Caves's general theorem, for a linear amplifier of any gain $G$ whose output is still a quantum mode: its
added noise, referred to the input, is at least half a quantum times $1 - 1/G$, our half at large gain.
:::

**A number.** Section IX's [*Counting or recording*](/paper/#par:counting-or-recording) says that each mode of the
thermal glow "holds of order $10^{-30}$ gravitons on average". Recorded quadrature by quadrature, its excess over the
noise is $10^{-30}$ of a quantum against at least one, the zero point's half and the device's half: "recorded pixel by
pixel, a thermal gravitational image would be buried in that noise". A counter adds no noise, because an empty mode
never clicks (chapter [8.5](/tutorial/quantum/counting-quanta/#counting-adds-no-noise-but-needs-quanta)), but it loses
the phase that an array needs to combine its pixels. This is Section IX's tension, read in chapter R10.

## No state changes faster than its energy spread allows, and that caps every camera

We want a limit that holds whatever is read, because the paper's ceiling must survive every clever measurement. A
camera tells two scenes apart only if they leave it in different states, and the question is how fast a state can
become different from itself.

**Two levels.** Take chapter 8.1's [beat](/tutorial/quantum/states/#a-state-of-definite-energy-turns-at-a-rate-set-by-its-energy),
the state $(|E_1\rangle + |E_2\rangle)/\sqrt2$ with $E_1 = 0$ and $E_2 = E$. The answer to "are you still in the
state it started in?" is yes with the probability $\cos^2(Et/2\hbar)$, which first reaches zero at $t = \pi\hbar/E$.
Its energy is 0 or $E$ with equal probabilities, so its mean is $E/2$ and its standard deviation
$\sym{energy-spread}{\sigma_E} = E/2$, in joules. The time to become orthogonal is therefore

$$t_\perp = \frac{\pi\hbar}{2\sigma_E} .$$

**Any state.** For short times we expand $e^{-iHt/\hbar}$ (chapter
[8.2](/tutorial/quantum/operators/#a-generator-is-the-exponent-of-a-unitary-table)) to second order, with chapter 8.2's
energy operator $H$:

$$\begin{aligned}
\langle\psi|e^{-iHt/\hbar}|\psi\rangle &= 1 - \frac{i\langle H\rangle t}{\hbar} - \frac{\langle H^2\rangle t^2}{2\hbar^2} + \dots,\\
\bigl|\langle\psi|e^{-iHt/\hbar}|\psi\rangle\bigr|^2 &= 1 - \frac{\sigma_E^2t^2}{\hbar^2} + \dots .
\end{aligned}$$

The squared size is the real part squared plus the imaginary part squared, and the terms in $t^2$ leave
$\langle H^2\rangle - \langle H\rangle^2 = \sigma_E^2$. So every state starts to leave itself at a rate set by its
energy spread and by nothing else. Mandelstam and Tamm proved in 1945 that the overlap never falls faster than
$\cos^2(\sigma_Et/\hbar)$, which we state, so that

$$\boxed{\sym{orthogonality-time}{t_\perp} \ge \frac{\pi\hbar}{2\sigma_E}} ,$$

the **Mandelstam–Tamm bound**. It was the first **quantum speed limit**, a least time for a state to become different
from itself. The two-level state has the overlap $\cos^2(\sigma_Et/\hbar)$ exactly, so it meets the bound with equality.
A state whose energy spread comes from a small weight on a very high level is far from equality, since that weight
hardly moves the overlap. A second bound, by the mean energy above the lowest level, is Margolus and Levitin's (1998,
stated).

**The same bound as information.** Let a scene's unknown strength $\theta$, a pure number, enter through an
interaction $\theta V$ acting for the time $\tau$, where $V$ is an energy operator of the camera with the standard
deviation $\sigma_V$ in its state. The camera's state is then $e^{-i\theta V\tau/\hbar}|\psi\rangle$. Two values of
$\theta$ a step $\delta\theta$ apart give states whose squared overlap is the expansion above with $\delta\theta\,V$ in
the place of $H$ and $\tau$ in the place of $t$. We write it in a second form,

$$1 - \frac{\sigma_V^2\tau^2}{\hbar^2}\,\delta\theta^2 + \dots = 1 - \frac{F_Q}{4}\,\delta\theta^2 + \dots ,$$

which defines the **quantum Fisher information**, here

$$\sym{quantum-fisher}{F_Q} = \frac{4\sigma_V^2\tau^2}{\hbar^2} .$$

The faster the overlap falls, the better two neighbouring values can be told apart. We state Braunstein and Caves's
theorem (1994): no measurement of the state draws more Fisher information about $\theta$ than $F_Q$. Chapter
[3.3](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks)'s
Cramér–Rao bound, also a theorem, then gives $\sigma_\theta \ge 1/\sqrt{F_Q}$ for any unbiased estimate of $\theta$, so

$$\boxed{\frac{\theta}{\sigma_\theta} \le \frac{2\theta\sigma_V\tau}{\hbar} = \frac{2E_{\rm int}\tau}{\hbar}} ,$$

where $\sym{interaction-energy}{E_{\rm int}} = \theta\sigma_V$ is the spread of the interaction energy $\theta V$, in
joules.

**The paper's ceiling.** The rest is the paper's estimate, which chapter
[R3](/tutorial/noise/reading-section-iv-2/#physics-outside-part-3-caps-the-sensitivity-near-1070) read. A camera
within the distance $z$ of the scene, in metres, that is not a black hole has a mass below $zc^2/2G$, with $G$ the
gravitational constant and $c$ the speed of light (*read now, derived in Part 11*, chapter 11.1). Its energy of
interaction with a source of mass $\sym{source-mass}{\matter M_s}$ is then below $G(zc^2/2G)\matter M_s/z = \matter
M_sc^2/2$ in size, and $G$ and $z$ cancel. An energy confined to a range of width $W$ has a standard deviation of at most
$W/2$, so $E_{\rm int} \le \matter M_sc^2/4$, and the bound gives $\SNR \le \matter M_sc^2\tau/2\hbar$ for chapter
3.7's signal-to-noise ratio $\SNR$. The paper rounds $\matter M_sc^2/2$ up to "about $\matter M_sc^2$", an estimate's
factor of 2, and writes

$$\SNR \lesssim \frac{\matter M_sc^2\tau}{\hbar} .$$

We use the paper's form. The two bounds above are theorems; the paper's assumption is that the scene acts through
one fixed coupling, "as it does for a fixed coupling and a single measurement task".

For the person of 70 kg watched for the age of the universe, $4.35\times10^{17}$ s, the ceiling is $2.6\times10^{70}$,
and chapter [3.7](/tutorial/noise/blur-law/#what-the-law-means)'s blur law gives $1.51°$, with or without the factor ½.
For the locked safe's 324 kg of gold it is $1.2\times10^{71}$. The camera's pull, unlike the ceiling, depends on $z$,
so the paper takes $z$ = 3 m, the scale of a room, as R3 does. A camera of mass $zc^2/2G = 2.0\times10^{27}$ kg pulls
at 3 m with $1.5\times10^{15}$ times the Earth's gravity $g$. One that pulls no harder than the Earth is that much
lighter, and the paper's ceiling falls by the same factor to $1.7\times10^{55}$, a blur of $1.91°$. Its interaction
energy at face value, $gz\matter M_s = 2.1\unit{kJ}$, gives half that, $8.5\times10^{54}$ and $1.92°$. On this
estimate no near-field camera could draw a face.

The pixel of Section II falls far below the ceiling. Its ratio on the person grows as $\tau^{3/2}$, from
$1.44\times10^5$ in a second, but only while the masses stay close: the person's tide moves them apart by
$\tfrac12\curv{\tE}\xi\tau^2$, which reaches $\xi$ after $\sqrt{2/\curv{\tE}} = 1.5\times10^4$ s, about four
hours. Read in stretches of $10^4$ s and averaged over the age of the universe, the pixel reaches about $10^{18}$, a
blur of 5.5°. The rule carried to the age of the universe would give $4.1\times10^{31}$ and 3.2°, a formal
extrapolation.

<!-- diagram: tut-snr-ladder — One panel, about 640 × 300 px at 1440 (rotated to a vertical ladder on a phone): a
horizontal axis of log₁₀ SNR on the person a metre away from 0 to 72, thin grey with ticks every 10. Four ink dots on
it, each with its label above and its blur from chapter 3.7's law below in grey: "superconducting gradiometer, 1 s"
at 467 (log 2.67), blur 26°; "the SQL pixel, 1 s" at 1.44 × 10⁵ (log 5.16), blur 16°; "the SQL pixel, 10⁴ s stretches
averaged over the age of the universe" at 9.5 × 10¹⁷ (log 18.0), blur 5.5°; "the ceiling, age of the universe" at
2.6 × 10⁷⁰ (log 70.4), blur 1.5°. Two open circles: one at 4.1 × 10³¹ (log 31.6) labelled "SQL pixel, τ^3/2 carried to
the age of the universe (formal)", blur 3.2°, and one at 1.7 × 10⁵⁵ (log 55.2) labelled "ceiling, a camera no heavier
in pull than the Earth", blur 1.9°. A thin dashed bracket from the SQL pixel at 1 s to the formal open circle labelled
"grows as τ^3/2". No orange or blue. Caption: "Look first at how little the blur moves: sixty-eight powers of ten of
signal-to-noise ratio narrow it from 26° to 1.5°. The ratios are computed for the person of 70 kg a metre away; the
blurs are chapter 3.7's law. The open circle at 4 × 10³¹ is a formal extrapolation." -->

## A measurement is a set of positive tables that add to one, and a graviton's click carries about a bit

Readers on the route to Section IV may skip this section: it serves Section IX's counting pixel and needs chapters 3.8
and 8.4.

We want a measurement whose outcomes are directions on the sky. Chapter 8.1's kind will not do, because its outcomes are
orthonormal states, and a spin $s$ has only $2s + 1$ of them while the sky has infinitely many directions. A
**measurement** in general is a set of tables $\sym{povm-element}{\Pi_k}$, one for each outcome $k$, each Hermitian and
positive, with $\langle\psi|\Pi_k|\psi\rangle \ge 0$ in every state (chapter
[3.4](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes)'s positive
semidefinite, with no eigenvalue negative), and with $\sum_k\Pi_k = 1$. Outcome $k$ then has the probability
$\langle\psi|\Pi_k|\psi\rangle$. Positivity makes each probability non-negative and the sum makes them add to one, in
every state; these are the only two things a list of probabilities needs. Such a set is a **POVM**, a positive
operator-valued measure.[^povm] Chapter 8.1's orthonormal outcomes $|k\rangle$ are the special case $\Pi_k =
|k\rangle\langle k|$.

**The example.** Chapter 8.4's [spin coherent states](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky)
$|\hat n\rangle_s$ of spin $\sym{spin-number}{s}$ are complete, so the tables

$$\sym{coherent-povm}{\Pi(\hat n)}\,\dd\Omega = \frac{2s + 1}{4\pi}\,|\hat n\rangle_s\langle\hat n|_s\,\dd\Omega$$

add, over the sphere, to one. They are a measurement with one outcome for each direction. **A non-example.** The same
tables without the factor $(2s + 1)/4\pi$ add to $4\pi/(2s + 1)$ times the identity, not to one.

**One quantum.** By Section IX, a graviton from $\hat n_0$ is in the spin-two coherent state $|\hat n_0\rangle_2$. A
click at $\hat n$ then has the probability density $\langle\hat n_0|\Pi(\hat n)|\hat n_0\rangle$, and chapter 8.4's
overlap gives, at the angle $\vartheta$ from $\hat n_0$,[^label]

$$p(\hat n) = \frac{2s + 1}{4\pi}\cos^{4s}\frac\vartheta2 .$$

For a graviton this is the paper's $(5/4\pi)\cos^8(\vartheta/2)$. An empty mode has no quantum to click, so the
measurement adds no noise.

**The bits.** We want chapter [3.8](/tutorial/noise/bits/#a-number-with-a-spread-has-a-differential-entropy-and-only-its-changes-count)'s
mutual information between the source's direction, equally likely anywhere, and the click. Averaging $p$ over $\hat
n_0$, with the weight $\dd\Omega_0/4\pi$, puts chapter 8.4's completeness between $\langle\hat n|_s$ and $|\hat
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
evenly whatever its source: the paper's three numbers. Larger spins point more sharply and tell more.

**The Fisher information.** Tilt the source by a small angle $\epsilon$, in radians, from $\hat n_0 = \hat z$ to
$(\sin\epsilon, 0, \cos\epsilon)$. A click at $\hat n = (\sin\vartheta\cos\varphi, \sin\vartheta\sin\varphi,
\cos\vartheta)$ is then at the angle $\Theta$ from the source, with $\cos\Theta = \hat n\cdot\hat n_0 =
\sin\vartheta\cos\varphi\sin\epsilon + \cos\vartheta\cos\epsilon$, which changes at the rate $\sin\vartheta\cos\varphi$
at $\epsilon = 0$. Up to a constant, $\ln p$ is $2s\ln(1 + \cos\Theta)$. So the score of chapter 3.3, $\partial\ln
p/\partial\epsilon$, is $2s\sin\vartheta\cos\varphi/(1 + \cos\vartheta)$ at $\epsilon = 0$, and its square is
$4s^2\cos^2\varphi\,(1 - y)/y$, since $\sin^2\vartheta = (1 - \cos\vartheta)(1 + \cos\vartheta)$. The Fisher information
is the mean of the squared score, and the mean of $\cos^2\varphi$ is $\tfrac12$, so

$$\begin{aligned}
F &= \int_0^1(2s + 1)y^{2s}\,\frac{2s^2(1 - y)}{y}\,\dd y\\
&= 2s^2(2s + 1)\Bigl(\frac1{2s} - \frac1{2s + 1}\Bigr) = s
\end{aligned}$$

per graviton and per angle. A tilt by $\epsilon$ is the turn $e^{-i\epsilon S_\perp}$, with $S_\perp$ the spin across
$\hat n_0$ measured in units of $\hbar$, as in chapter 8.4. This is the turn $e^{-i\theta V\tau/\hbar}$ of [the speed
limit's section](#no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera) with $\epsilon$ for
$\theta$ and $S_\perp$ for $V\tau/\hbar$, so the quantum Fisher information gives the quantum limit for one angle alone,
$F_Q = 4\,\mathrm{Var}(S_\perp) = 2s$: in a coherent state each of the $2s$ spins one half adds $\tfrac14$ to the
variance. The click draws half of it, the paper's "half the quantum limit $2s$ for one angle alone". **A number.** One
graviton a second for half an hour, 1800 gravitons with $F = 2$ each, gives $F = 3600$ per angle, and an error of
$1/\sqrt{3600} = 0.0167$ rad, $0.95°$: Section IX's Sun's core "to a degree in half an hour" (read in chapter R10).

## Each kind of detector reads its own part of the tide

An interferometer such as LIGO reads one combination of $\curv{\tE}$, the difference along its two arms, integrated
twice in time, as the strain of chapter [7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain).
In a wave the magnetic part $\curv{\tB}$ also enters its response, at first order in the arm length over the wavelength
[@BaskaranGrishchuk2004] (*stated in the paper*). A **resonant-mass detector** is a body whose ringing a tide excites,
and a sphere's five quadrupole modes ring in proportion to the five numbers of $\curv{\tE}$
([1.5](/tutorial/newton/five-numbers/#patterns-of-higher-degree-hold-7-9-and-more-numbers);
[@Forward1971; @WagonerPaik1977], stated). Gyroscopes read $\curv{\tB}$
([7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)).
All of them feel the changing pull of air, ground and people nearby, the **Newtonian noise**: Part 2's near field seen
as noise, which observatories model and subtract [@Harms2019].

<!-- try: quantum-limit (a new interactive figure, QuantumLimit, two panels on an exact engine: panel 1 uses the
spread σ_x(τ)² = σ₀² + (ħτ/2mσ₀)² and the tide 2σ_x(τ)/ξτ² with ħ = 1.0546 × 10⁻³⁴ J s; panel 2 uses the one-sided
quantum noise S_h = (S_shot + S_rp) of an ideal interferometer, S_shot = A/P and S_rp = BP/f⁴ with AB fixed by
S_h,min = 8ħ/mω²L², checked against h_SQL = 1.83 × 10⁻²⁴ Hz^-1/2 at 100 Hz for 40 kg and 4 km) — Panel 1, about
640 × 300 px at 1440: two free masses drawn as grey balls, each with its position's bell drawn at the start (σ₀) and
at τ (σ_x(τ)), magnified; readouts of σ₀, σ_x(τ) in units of σ_SQL and in metres, and the tide resolved by two masses,
2σ_x(τ)/ξτ², with the paper's one-mass value and the value for the distance of the two, √2 larger, side by side; a
small log–log copy of diagram tut-sql-compromise with a dot that follows the slider. Controls: a slider "σ₀ / optimum"
from 0.03 to 30, logarithmic (opens at 1), sliders for m (1 mg to 10 kg, opens at 1 g), τ (1 ms to 100 s, opens at
1 s) and ξ (1 mm to 1 m, opens at 1 cm). Panel 2, about 640 × 300 px: diagram tut-sql-interferometer's axes with the
h_SQL line and one grey noise curve for the chosen power; a dot where the curve touches the line, its frequency read
out. Controls: a slider "laser power / P₀" from 0.01 to 100, logarithmic (opens at 1); a slider for the frequency of
interest (10 to 1000 Hz, opens at 100 Hz) whose readout gives the noise there over h_SQL. Predict first: "Read the
first position ten times more sharply than the optimum. Does the final uncertainty shrink?" (Answer: no; it grows
sevenfold, √(1/200 + 50) ≈ 7.07, from the back-action.) Then: "At 100 Hz, which laser power touches the limit?"
(Answer: only P₀; any other power is above the line at 100 Hz, and more power helps only above its touching
frequency, which moves as √P.) Keyboard: Tab reaches each slider, arrows step it, shift for larger steps; both
themes; on a phone the panels stack. -->

::: check
### Q

What is the standard quantum limit for one of LIGO's 40 kg mirrors watched for 10 ms?

### A

$\sqrt{\hbar\tau/\matter m} = \sqrt{1.055\times10^{-34}\times0.01/40}\unit{m} = 1.6\times10^{-19}$ m, about a
ten-thousandth of the width of a proton.

### Q

Why can the standard quantum limit be beaten, but not the ceiling of $10^{70}$?

### A

The standard quantum limit comes from one way of reading: the position, twice, with the reading's kick fed into it.
The ceiling comes from how fast any state can change, whatever is read; only its assumption about the interaction energy
is an estimate.

### Q

How many bits does one graviton's click carry about its direction, and why does a photon's carry fewer?

### A

1.17 against 0.62. The photon's click density, $\cos^4(\vartheta/2)$, is broader than the graviton's
$\cos^8(\vartheta/2)$.
:::

**The idea to keep: reading a free mass disturbs it, so following it for a time $\tau$ is limited to
$\sqrt{\hbar\tau/m}$, which lets two gram masses read a tide of about $10^{-13}\,\mathrm{s^{-2}}$ in a second; that
limit belongs to one way of reading and can be beaten. What cannot be beaten is the rate at which any state can change,
set by its energy, and with the largest energy a camera can have without becoming a black hole it caps the signal from a
person at about $10^{70}$, a blur of 1.5°.**

::: problems
### Practice

Two 10 kg masses 10 cm apart are read for 100 s at the standard quantum limit. What tide do they resolve, with the
paper's one-mass estimate and for the distance between the two?

::: solution
$\sigma_{\rm SQL} = \sqrt{1.055\times10^{-34}\times100/10}\unit m = 3.2\times10^{-17}$ m, so $\Delta\curv{\tE} \approx
2\sigma_{\rm SQL}/\xi\tau^2 = 6.5\times10^{-20}\unit{s^{-2}}$, and $\sqrt2$ times more, $9.2\times10^{-20}\unit{s^{-2}}$,
for the distance of the two.
:::

### Stretch

Combine this chapter with chapter 3.7: the person is watched at the ceiling for one year instead of the age of the
universe. What is the ceiling, and the blur?

::: solution
$70\times(3.00\times10^8)^2\times3.156\times10^7/1.055\times10^{-34} = 1.9\times10^{60}$. Then $q_c - \ln q_c = \ln(\pi
\times 1.9\times10^{60})$ gives $q_c = 145$, and the blur is $1.75°$, wider than at the age of the universe by only a
sixth.
:::

### The paper

Reproduce Section IV's [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity): $10^{70}$, $1.5°$, the $10^{15}$
times the Earth's gravity, $10^{55}$ and $1.9°$.

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
  says what a small cloud of test masses can determine of the curvature and what it misses: the detectors of the last
  section seen from the side of geometry.
- V. B. Braginsky and F. Ya. Khalili, *Quantum Measurement* (Cambridge, 1992), derive the standard quantum limit and
  treat back-action evasion and quantum non-demolition measurement in full.
- C. M. Caves, "Quantum limits on noise in linear amplifiers", *Physical Review D* 26, 1817 (1982), proves the half
  quantum of added noise for any gain.
- S. Deffner and S. Campbell, *Journal of Physics A* 50, 453001 (2017), review the quantum speed limits, with the
  proofs of Mandelstam and Tamm's and of Margolus and Levitin's.
:::

[^microscope]: Heisenberg pictured this in 1927 as **Heisenberg's microscope**: light that locates a particle sharply
    has a short wavelength, and each photon that bounces off kicks it hard, in a direction the lens cannot fix.

[^tau]: The letter $\tau$ is a relaxation time in chapter 4.4 and an optical depth in chapter 5.5; here it is only a
    reading time.

[^units]: The units check: $\mathrm{J\,s}\times\mathrm{s}/\mathrm{kg} = \mathrm{kg\,m^2\,s^{-2}\,s^2}/\mathrm{kg} =
    \mathrm{m^2}$, whose square root is a length.

[^reduced]: The same spread follows from the motion of the distance itself, which is that of one body of the
    **reduced mass** $\matter m_1\matter m_2/(\matter m_1 + \matter m_2)$, here $\matter m/2$.

[^grad]: The source's $0.02\unit{E\,Hz^{-1/2}}$ is a one-sided amplitude spectral density. Read strictly it gives
    $0.014\unit{E}$ in a second (chapter 3.2's
    [note](/tutorial/noise/random-signals/#the-variance-of-white-noise-falls-as-one-over-the-observing-time)), a ratio
    of 660 on the person instead of 467, and a factor of 218 short of the ideal pixel instead of 308.

[^hsql]: The units check: $\mathrm{J\,s}/(\mathrm{kg\,s^{-2}\,m^2}) = \mathrm s = \mathrm{Hz^{-1}}$, whose square
    root is $\mathrm{Hz^{-1/2}}$.

[^povm]: Any such measurement can be made by letting the system touch a second one and then making a measurement of
    chapter 8.1's kind on the two together (Naimark's theorem, stated).

[^label]: A graviton from $\hat n_0$ travels along $-\hat n_0$; we label its state, and each click, by the direction
    toward the source, as the paper's sentence does.
