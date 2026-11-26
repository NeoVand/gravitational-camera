---
id: R8
title: 'From two grams to the ceiling'
question: 'How fine a tide could the best imaginable pixel resolve, and how far is it from the ceiling that quantum mechanics puts on every camera?'
part: '8'
requires: ['R1', 'R3', 'R4', '8.1', '8.2', '8.3', '8.6', '8.7']
paper: [sec:pixel, sec:near-field, app:benchmarks, eq:jitter-bounds, eq:deviation, fig:resolution-law, sec:no-lens, sec:first-image, sec:vistas]
figures: [fig:resolution-law]
live: [blur-law, quantum-limit]
---

The best pixel that quantum mechanics allows in the ordinary way of reading is two free masses of a gram, read for a
second at the standard quantum limit. Above it stands a ceiling on every camera, however it reads. How fine a tide does
that pixel resolve, and how far is it from the ceiling?[^origin]

::: plain
Quantum mechanics enters the near field in three places. A steel ball's ringing holds four hundred million quanta at
room temperature, so the classical rules of heat hold for it, and the camera reads its trembling without receiving a
single graviton.

Watching a free mass disturbs it. Two masses of a gram, read for a second, can at best resolve a tide 144,000 times
weaker than that of a person a metre away, though cleverer readings beat even this.

Nothing beats the speed at which a quantum state can change. A camera too heavy for its size would be a black hole, so
no camera could see a person with a signal-to-noise ratio above about $10^{70}$. That picture would be blurred by 1.5°
and would hold about 22 kilobytes.
:::

## Two gram masses at the standard quantum limit resolve a tide 144,000 times below the person's

Reading a free mass's position kicks its momentum, the **back-action** of the reading, and the kick makes the mass
drift. The best compromise between a sharp first reading and a small drift is the **standard quantum limit**. Section
[8.6](/tutorial/quantum/quantum-limit/#a-free-mass-watched-for-a-time-cannot-be-followed-better-than-the-standard-quantum-limit)
derived it for a mass $\matter m$, in kilograms, watched for a time $\sym{reading-time}{\tau}$, in seconds. Here
$\sym{sql-width}{\sigma_{\rm SQL}}$ is the least spread of the mass's position after that time, in metres, and
$\sym{hbar}{\hbar} = 1.055\times10^{-34}\unit{J\,s}$ is the reduced Planck constant:

$$\sigma_{\rm SQL} = \sqrt{\frac{\hbar\tau}{\matter m}} = 3.25\times10^{-16}\unit m$$

for a gram and a second, about a fifth of a proton's width. Masses a distance $\sym{separation}{\xi} = 1$ cm apart are
moved relative to each other by $\tfrac12\curv\tE\xi\tau^2$ (section 1.4), so with one of them a perfect reference the
smallest tide they resolve is $2\sigma_{\rm SQL}/\xi\tau^2 = 6.5\times10^{-14}\unit{s^{-2}}$
([8.6](/tutorial/quantum/quantum-limit/#two-gram-masses-read-for-a-second-resolve-a-tide-a-hundred-thousand-times-smaller-than-the-persons)).
Their distance, with a spread from each, resolves $\sqrt2$ times more, $9.2\times10^{-14}\unit{s^{-2}}$.[^sqrt2] The
person a metre away makes $9.34\times10^{-9}\unit{s^{-2}}$, 101,000 times more. With the one-mass estimate that
section 8.6 carries, this pixel reads the person with a signal-to-noise ratio of $1.44\times10^5$ in one second. The
best superconducting gradiometer, at $0.02$ eötvös (E) or $2\times10^{-11}\unit{s^{-2}}$ in a second, reaches 467
(section 1.7), and the ideal pixel does 308 times better.[^premise]

The limit belongs to one way of reading: the first reading's kick spoils the second. A reading whose kick never
disturbs the quantity read, a **quantum non-demolition measurement**, can beat it. In 2020 LIGO, using squeezed light, inferred a quantum noise 3 dB (half the power) below its standard quantum
limit near 40 Hz ([8.6](/tutorial/quantum/quantum-limit/#the-standard-quantum-limit-belongs-to-one-way-of-reading-and-it-can-be-beaten)).
The ceiling below rests instead on how fast any quantum state can change.

## The ball's tremor is classical, holds four hundred million quanta and needs no graviton

A mode of angular frequency $\omega$, in $\mathrm{s^{-1}}$, takes energy only in steps $\hbar\omega$, its **quanta**.
In equilibrium at the temperature $\sym{temperature}{T}$ it holds on average $\sym{occupation}{\bar n} =
1/(e^{\hbar\omega/\kB T} - 1)$ of them, its **occupation**, with $\sym{boltzmann}{\kB} = 1.38\times10^{-23}\unit{J\,K^{-1}}$
Boltzmann's constant. When $\hbar\omega \ll \kB T$ this is about $\kB T/\hbar\omega$
([8.3](/tutorial/quantum/quanta/#a-warm-mode-holds-about-k_bthbaromega-quanta)). Reordering the mode's operators then
changes its means by about $1/(\bar n + \tfrac12) \approx \hbar\omega/\kB T$
([8.3](/tutorial/quantum/quanta/#in-a-warm-mode-the-order-of-a-product-hardly-matters)), which is what "classical"
means. For the steel ball's 15.1 kHz note ($\omega = 9.49\times10^4\unit{s^{-1}}$) at 300 K this is $2.4\times10^{-9}$,
so quantum mechanics changes its tremor by parts in a billion. The mode holds $\kB T/\hbar\omega = 4.1\times10^8$
quanta, or $5.0\times10^8$ at Lamb's exact 12.6 kHz (section 4.3).[^lamb] Section 8.3 also gave the 15.1 kHz mode's
**zero-point motion**, the swing that it keeps with no heat at all: $7.5\times10^{-21}$ m at the poles, $2.9\times10^4$
times less than the thermal swing of $2.2\times10^{-16}$ m.

A **graviton** is one quantum $\hbar\omega$ of a mode of a gravitational wave
([8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons)). With
the power of a ringing quadrupole from section 7.7, $4.9\times10^{-55}$ W, one graviton leaves the ball every
$\hbar\omega/P = 2.1\times10^{25}$ s, or $6.5\times10^{17}$ years, at the 15.1 kHz note.[^graviton] The camera detects
the ringing without receiving any of this radiation, because the near field is the Newtonian pull of the ball's present
shape, so no quantum needs to arrive.

## No camera's state can change fast enough to pass about $10^{70}$ on a person

The ceiling is an estimate in three steps. First, a camera that fits within the distance $z$ to the scene without
becoming a black hole has a mass below $zc^2/2G$ (section 11.1), with $z$ in metres, $c = 3.00\times10^8\unit{m\,s^{-1}}$
and $G = 6.674\times10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$.

Second, its energy of interaction with a source of mass $\sym{source-mass}{\matter M_s}$ at the distance $z$ is at most
$G(zc^2/2G)\matter M_s/z = \matter M_sc^2/2$, and $G$ and $z$ cancel.

Third, quantum mechanics limits how quickly the camera's state can become distinguishable, to a rate set by that
energy, for a fixed coupling and a single measurement task. Section
[8.6](/tutorial/quantum/quantum-limit/#no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera)
proved, with the theorems of Mandelstam and Tamm and of Braunstein and Caves, that a strength read through one coupling for a time $\tau$ has a
signal-to-noise ratio of at most $2E_{\rm int}\tau/\hbar$. Here $E_{\rm int}$ is the spread of the interaction energy,
its standard deviation. An energy confined to a range of width $W$ has a spread of at most $W/2$, so $E_{\rm int} \le
\matter M_sc^2/4$ and the strict bound is $\matter M_sc^2\tau/2\hbar$. Rounding up by an estimate's factor of 2,

$$\SNR \lesssim \frac{\matter M_sc^2\tau}{\hbar} ,$$

a pure number, since $\mathrm{kg\,m^2\,s^{-2}}\times\mathrm s/\mathrm{J\,s} = 1$.[^ceiling] For 70 kg watched for the age
of the universe, $4.35\times10^{17}$ s, it is $2.6\times10^{70}$. Section
[3.7](/tutorial/noise/blur-law/#what-the-law-means)'s law gives the cut-off $\sym{cutoff}{q_c} = 168$, the finest
ripple the picture keeps, in units of one over the distance $z$ to the scene, and a blur of $1.51°$ at that ratio,
with or without the factor 2. This is 2.6 cm on a person a metre away, too coarse to draw a face. The eye's arcminute
would need about $10^{6610}$.

Section [3.8](/tutorial/noise/bits/#sensitivity-buys-more-patterns-and-more-bits-in-each-so-the-bits-grow-as-the-cube-of-its-logarithm)'s
integral gives $1.81\times10^5$ bits per patch at the ceiling, which is 22.6 kilobytes of 8000 bits, spread over 2260
patterns of 80 bits each.[^patch]

The estimate is generous. A camera of mass $zc^2/2G$ three metres away has the mass $2.0\times10^{27}$ kg, about
Jupiter's, and pulls on the person with $1.5\times10^{16}\unit{m\,s^{-2}}$, $1.5\times10^{15}$ times
$9.81\unit{m\,s^{-2}}$. A camera that pulls no harder than the Earth weighs $1.3\times10^{12}$ kg, and the ceiling falls
by the same factor to $1.7\times10^{55}$, where the blur is $1.91°$. Fifteen powers of ten widen the blur only from
$1.5^\circ$ to $1.9^\circ$.

## A camera that could read a quantum mass would end its superposition

A **superposition of states** is a state whose amplitudes are shared between two places, so that both can interfere
([8.1](/tutorial/quantum/states/#amplitudes-add-so-two-paths-can-cancel)). Put a mass $\matter m$ behind a wall in a
superposition of two places a distance $d$ apart. The body that moved the mass recoils, because forces inside an
isolated system cannot move its centre of mass, so the two branches have the same mass and the same centre of mass and
first differ in their second moments. Section
[8.1](/tutorial/quantum/states/#a-record-of-the-place-multiplies-the-interference-by-the-overlap-of-the-records) found
the difference of the quadrupoles to be $\matter md^2(1 + \matter m/\matter M)$ for a recoiling body of mass $\matter M$
whose centre is at the mass, such as a trap around it, so about $\matter md^2$. For a gram split by a micrometre,
$\matter md^2 = 10^{-15}\unit{kg\,m^2}$, and 8.1 derived the difference of the two tides a metre away along the split,
$12G\matter md^2/r^5 = 8.0\times10^{-25}\unit{s^{-2}}$. That is $1.2\times10^{-11}$ of what the gram pixel resolves in
a second.

A camera that read this tide before light from the place where the superposition is undone could arrive would learn
which way the mass went faster than causality allows. The resolution is that the field's vacuum fluctuations forbid
localizing any probe to better than about a Planck length, $\sqrt{\hbar G/c^3} = 1.6\times10^{-35}$ m, and that
whenever a camera could learn enough, undoing the superposition radiates gravitons that carry the information away
[@Belenchia2018; @DanielsonSatishchandranWald2022]. Section
[8.1](/tutorial/quantum/states/#a-record-of-the-place-multiplies-the-interference-by-the-overlap-of-the-records)
estimates both halves and finds them set by one ratio, the quadrupole over the Planck mass times the square of the
distance light travels in the time of the recombination.

A perfect camera is therefore a perfect source of decoherence. A record of the place multiplies the interference term by
the overlap $\langle e_R|e_L\rangle$ of the record's two states (8.1), and a record that tells the places apart
leaves no interference. This loss is **decoherence**; section
[13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell) treats gravity itself.

## The quantum jitter lies between the classical value and one mode

The **static jitter** $\langle\delta\matter Q_h^2\rangle$ is the mean square departure of a moment $\matter Q_h$ from its
mean. Here $\chi_0 = \sym{tide-response}{\chi_h}(0)$ is its static compliance, how far $\matter Q_h$ moves per unit of a
steady tide, and $\sym{response-sum}{A} = \int\matter\rho|\nabla h|^2\,\dd V$ is the sum of section 4.5. For a
quadrupolar tide, with its shape $h$ in square metres, $\matter Q_h$ is in $\mathrm{kg\,m^2}$, $\chi_0$ in
$\mathrm{kg\,m^2\,s^2}$ and $A$ in $\mathrm{kg\,m^2}$, so $A/\chi_0$ is a squared angular frequency.

For a quantum system the jitter is no longer $\kB T\chi_0$. The
[**quantum fluctuation–dissipation theorem**](/tutorial/quantum/quantum-fluctuation/#the-tremor-at-each-frequency-is-hbarcothhbaromega2k_bt-times-the-friction-there)
of section 8.7 says that the tremor at each frequency, averaged over the two orders of its operators, is
$\hbar\coth(\hbar\omega/2\kB T)$ times the friction there, which becomes the classical $2\kB T/\omega$ when
$\hbar\omega \ll \kB T$. The measure $(2/\pi\chi_0)\,\mathrm{Im}\,\chi(\omega)\,\dd\omega/\omega$ has unit weight and
mean square frequency $A/\chi_0$, by the
[two sums](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums) of section 4.5.
With this weight the theorem gives the jitter as the average of $\tfrac12\hbar\chi_0\,\omega\coth(\hbar\omega/2\kB T)$
([8.7](/tutorial/quantum/quantum-fluctuation/#the-static-jitter-lies-between-two-bounds)). With $x = \omega^2$ and
$s = \hbar/2\kB T$, a time in seconds, the function $\sqrt x\coth(s\sqrt x)$ is concave in $x$. By **Jensen's
inequality** its average lies at or below its value at the mean, here at $\omega^2 = A/\chi_0$. Since $u\coth u \ge 1$
for every $u > 0$, with $u = \hbar\omega/2\kB T$, the average also lies at or above $\kB T\chi_0$:

$$\kB T\chi_0 \le \langle\delta\matter Q_h^2\rangle \le \frac{\hbar}{2}\sqrt{A\chi_0}\,\coth\!\Big(\frac{\hbar}{2\kB T}\sqrt{\frac{A}{\chi_0}}\Big).$$[^jitter]

The upper bound is reached by a single undamped mode, whose weight sits at one frequency. For the steel ball as one
mode at Lamb's 12.6 kHz and 300 K, $u = 1.0\times10^{-9}$, and the two bounds differ by $u\coth u - 1 \approx u^2/3 =
3.4\times10^{-19}$ of the jitter ($4.9\times10^{-19}$ for the 15.1 kHz mode). At absolute zero the lower bound vanishes,
but the jitter keeps the zero-point swing given
[above](#the-balls-tremor-is-classical-holds-four-hundred-million-quanta-and-needs-no-graviton).

## Read ahead: a counter adds no noise, and each graviton tells about one bit

These two sections need only Part 8 and may be skipped.

Each mode of the thermal glow holds $10^{-30}$ gravitons or fewer on average (Part 10). A device that records both
quadratures of a mode, the amplitudes of its cosine and sine parts, adds at least half a quantum of noise, the **added
noise** of Caves's theorem
([8.6](/tutorial/quantum/quantum-limit/#recording-both-quadratures-of-a-wave-adds-half-a-quantum-of-noise)). A thermal
gravitational image recorded pixel by pixel would be buried in that noise. Counting avoids the noise but loses the
phase, because a coherent state's counts depend on its size and not on its phase
([8.5](/tutorial/quantum/counting-quanta/#counting-adds-no-noise-but-needs-quanta)). Combining the field before
detection lets a camera form an image from counted gravitons, with information that grows with the occupation rather
than its square
([8.6](/tutorial/quantum/quantum-limit/#combined-before-counting-two-pixels-gain-in-proportion-to-the-occupation-recorded-apart-in-proportion-to-its-square)).[^lens]

A graviton's **helicity** is $\pm2$, its angular momentum about its direction of travel in units of $\hbar$
([8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons)), which
section 9.1 reads from how $\curv{\mathcal W}$ changes in time. One graviton of helicity two from $\hat n$ excites the
five local modes of its helicity, the five components of a reading at one pixel, in a coherent state of spin two
([8.4](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky)). Section
[8.6](/tutorial/quantum/quantum-limit/#a-measurement-is-a-set-of-positive-tables-that-add-to-one-and-a-gravitons-click-carries-about-a-bit)
built the measurement made of all such states. Its clicks fall at the angle $\vartheta$ from $\hat n$ with the density
$(5/4\pi)\cos^8(\vartheta/2)$, and an empty mode never clicks, so it adds no noise.

Each click carries $\log_2 5 - 4/(5\ln2) = 1.168$ bits about the direction for a graviton, $\log_2 3 - 2/(3\ln2) =
0.623$ for a photon and none for a scalar. Its **Fisher information**, section 3.3's measure of how sharply data fix a
number, is 2 about each angle for a graviton, half of the 4 that 8.6 gives as the quantum Fisher information for one
angle alone. At one graviton a second, 1800 gravitons give 3600 per angle and an error of $1/\sqrt{3600}$ rad
$= 0.95°$, a degree in half an hour.

## Read ahead: coincidences tell a sky born hot from one born in inflation

The **second-order coherence** $\sym{second-order-coherence}{g^{(2)}}$ is the rate of coincident counts over that of
independent arrivals
([8.5](/tutorial/quantum/counting-quanta/#one-number-tells-the-two-apart-and-no-classical-wave-brings-it-below-one)).
Section 8.5 derived $g^{(2)} = 1$ for one mode of a coherent source and $g^{(2)} = 2$ for a thermal one. The
$0.905\unit K$ glow of section
[12.2](/tutorial/sky/universe/#gravitons-parted-first-and-kept-a-colder-share-of-the-heat) at 10 GHz holds $\bar n =
1.43$ gravitons per mode, so its pairs of clicks would be common.[^bunch]

Inflation makes gravitons in pairs of opposite momentum, a two-mode squeezed state, made only of pairs, one quantum in
each. Section
[8.5](/tutorial/quantum/counting-quanta/#pairs-in-two-modes-coincide-more-than-thermal-classical-waves-can) showed that
each mode of such a pair alone is thermal and that the two together give $\sym{cross-coherence}{g^{(2)}_{12}} = 2 +
1/\bar n$: 5.68 at $\bar n = 0.27$, and 3 at $\bar n = 1$. Two classical beams with thermal statistics reach at most 2,
by the Cauchy–Schwarz inequality, so a count above 2 cannot come from classical fields.

## The capstone: from two grams to the ceiling

The capstone follows the best pixel from two grams to the ceiling.

**(a) The best pixel.** In one second it reads the person with a ratio of $1.44\times10^5$, which section 3.7's exact
calculation blurs by $16.0°$, against $26.0°$ for the gradiometer's 467
([above](#two-gram-masses-at-the-standard-quantum-limit-resolve-a-tide-144000-times-below-the-persons)).

**(b) How far it grows.** The two grams fall together under their own pull in about an hour, so read in stretches of
$10^3$ s and averaged over the age of the universe, the pixel reaches $9.5\times10^{16}$, a blur of $5.8°$
([8.6's ladder](/tutorial/quantum/quantum-limit/#no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera)).

**(c) The ceiling.** No camera passes about $2.6\times10^{70}$
([above](#no-cameras-state-can-change-fast-enough-to-pass-about-1070-on-a-person)). The ceiling grows in proportion to
$\tau$, while the averaged pixel grows only as $\sqrt\tau$, so the longer both watch, the wider the gap.

**(d) The steel ball.** Its thermal tremor makes $3.4\times10^{-25}\unit{s^{-2}}$ a metre away (section 4.3),
$5.3\times10^{-12}$ of what the gram pixel resolves in a second.

**(e) The gram in two places.** Its tide is $1.2\times10^{-11}$ of the gram pixel's limit (Figure
[](#fig:quantum-tides)), and any pixel that read it would end the superposition.

![Look first at the gap below the dashed line: the quantum scenes lie more than ten powers of ten below
what the best pixel resolves in a second, and the ball's zero point more than fifteen. The dotted bar holds
only for a tide steady for the age of the universe. Instrument bars are for a steady tide; the tremors are
root-mean-square values.](tut-quantum-tides){#fig:quantum-tides}

{{paper fig:resolution-law}}

::: try {#blur-law}
This is the figure of section 3.7. Its slider stops at $10^{60}$, short of the ceiling's $10^{70}$, where the blur is
still $1.76°$. It opens at $10^3$, where the exact blur is $24°$. Predict how many powers of ten halve that blur to
$12°$: about two, four or eight? Then drag the slider to where it first falls below $12°$, and find where it first
falls below $6°$.
:::

::: try {#quantum-limit}
This is the figure of section 8.6. Predict first: if the reading lasts a hundred times longer, how much smaller a tide
do the two masses resolve? Then raise the reading time from 1 s to 100 s, well inside the hour after which the grams
fall together, and read the tide. Say how the factor becomes the $\tau^{3/2}$ growth of step (b).
:::

**The idea to keep: quantum mechanics enters the near field in three places. It leaves every slow mode of a body
classical, with hundreds of millions of quanta; it limits a pixel of two free grams to about $10^{-13}\,\mathrm{s^{-2}}$
in a second, a limit that can be beaten; and through the speed at which any state can change it caps every camera's
signal from a person near $10^{70}$, a blur of 1.5°.**

::: problems
### Practice

**[R8]** Rerun the first section's chain for two 10 kg masses 10 cm apart, read for 100 s. Find the tide they resolve,
the person's ratio, and the reading time at which the ratio is $10^{10}$, using its growth as $\tau^{3/2}$. Do the
masses stay close for that long?

::: solution
$\sigma_{\rm SQL} = \sqrt{1.055\times10^{-34}\times100/10}\unit m = 3.2\times10^{-17}$ m, so the tide is
$2\sigma_{\rm SQL}/\xi\tau^2 = 6.5\times10^{-20}\unit{s^{-2}}$ and the ratio is $1.44\times10^{11}$. The ratio is
$10^{10}$ after $100\times(10^{10}/1.44\times10^{11})^{2/3} = 17$ s. Their own pull closes the gap after about
$\sqrt{\xi^3/G\matter m} = 1.2\times10^3$ s and the person's tide parts them after $\sqrt{2/\curv\tE} = 1.5\times10^4$
s, so they stay close for 17 s.
:::

**[R8]** Why does the ceiling not rest on the standard quantum limit?

::: solution
The standard quantum limit belongs to one way of reading, and quantum non-demolition readings beat it. The ceiling rests
on how fast any state can change, which no reading beats, for a scene read through a fixed coupling and a single task.
:::

### Stretch

**[R8]** Combine 8.6 and 3.8: how many bits per patch would a picture of the person hold at the averaged pixel's
$9.5\times10^{16}$, against the ceiling's?

::: solution
Section 3.8's integral gives $3.2\times10^3$ bits, about 390 bytes, against $1.81\times10^5$ bits at $2.6\times10^{70}$:
fifty-three powers of ten for 57 times the bits.
:::

### The camera

**[R8]** Reproduce the ceiling's numbers: the $10^{70}$, $1.5°$, the $10^{15}$ times the Earth's gravity, $10^{55}$ and
$1.9°$, then the Planck length and the tide of a gram split by a micrometre.

::: solution
The ceiling is $70\times(3.00\times10^8)^2\times4.35\times10^{17}/1.055\times10^{-34} = 2.6\times10^{70}$, blur
$1.51°$. The camera of $3c^2/2G = 2.0\times10^{27}$ kg pulls at 3 m with $1.5\times10^{16}\unit{m\,s^{-2}}$, $1.5\times10^{15}\,g$;
one of $1.3\times10^{12}$ kg pulls with $g$, and the ceiling falls to $1.7\times10^{55}$, blur $1.91°$. The Planck length
is $1.6\times10^{-35}$ m, and $12G\matter md^2/r^5 = 8.0\times10^{-25}\unit{s^{-2}}$.
:::
:::

::: paper
- Section II's [*What the premise asks*](/paper/#par:what-the-premise-asks): the two gram masses at the standard quantum
  limit.
- Section IV's [plain words](/paper/#sec:near-field), [*What heat reveals*](/paper/#par:what-heat-reveals),
  [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) and
  [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity): the classical modes, the ceiling and the quantum scene.
- Appendix A's [*The trembling lattice*](/paper/#par:the-trembling-lattice): the paper's equation
  [](/paper/#eq:jitter-bounds).
- Sections VII, IX and XI, [*What a lens would add*](/paper/#par:what-a-lens-would-add),
  [*Counting or recording*](/paper/#par:counting-or-recording) and
  [*Counting coincidences*](/paper/#par:counting-coincidences): the optional stretches.
:::

::: deeper
- The GR course's [section 23.7](https://neovand.github.io/general-relativity/chapter-23.html#23-7-the-semiclassical-equation-and-its-limits)
  says where quantum fields and classical gravity meet, the setting of the which-way puzzle.
- V. B. Braginsky and F. Ya. Khalili, *Quantum Measurement* (Cambridge, 1992): the standard quantum limit and how to
  beat it.
:::

[^origin]: First shown in *The gravitational camera* (Mohsenvand 2026), Secs. II and IV and App. A.

[^sqrt2]: The distance between two free grams, each with its own spread, has $\sqrt2$ times the spread of one, as
    for one body of the reduced mass $\matter m/2$ (8.6).

[^premise]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, as its equation
    [](/paper/#eq:deviation).

[^lamb]: Rayleigh's bound for a guessed shape, 15 kHz, is 20% above Lamb's exact note (4.3).

[^graviton]: The time per graviton grows as $\omega^{-3}$, so at Lamb's 12.6 kHz it is $1.1\times10^{18}$ years.
    Both are of order $10^{18}$.

[^ceiling]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV.

[^patch]: A patch is a square of the scene whose side is its distance from the camera. At $10^{70}$ exactly the
    integral gives $1.78\times10^5$ bits.

[^jitter]: First shown in *The gravitational camera* (Mohsenvand 2026), App. A, as its equation
    [](/paper/#eq:jitter-bounds).

[^lens]: First shown in *The gravitational camera* (Mohsenvand 2026), Secs. VII and IX.

[^bunch]: A thermal sky bunches by 2 within one mode and one coherence time; a pixel that collects many modes in a
    window sees $g^{(2)}$ near 1 (8.5). First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI.
