---
id: R8
title: 'Reading the quantum limits, with the capstone: from two grams to the ceiling'
question: 'With Part 8 behind us, which of the paper''s statements about quantum limits can we now check, and how far is the best imaginable pixel from the ceiling that quantum mechanics puts on any camera?'
part: '8'
requires: ['R1', 'R3', 'R4', '8.1', '8.2', '8.3', '8.6', '8.7']
paper: [sec:pixel, sec:near-field, app:benchmarks, eq:jitter-bounds, eq:deviation, fig:resolution-law, sec:no-lens, sec:first-image, sec:vistas]
figures: [fig:resolution-law]
live: [blur-law, quantum-limit]
---

The plain words of the paper's [Section IV](/paper/#sec:near-field) end with an estimate: "A rough estimate from
quantum physics suggests that no camera could do better than a signal-to-noise ratio of about $10^{70}$ on a person,
even watching for the age of the universe." Section II, at the other end, imagines the best pixel that quantum
mechanics allows in the ordinary way of reading: two free masses of a gram, read for a second at the standard quantum
limit. With Part 8 behind us, which of the paper's statements about quantum limits can we now check, and how far is the
best imaginable pixel from the ceiling that quantum mechanics puts on any camera?

This chapter reads the quantum stretches of [Section II](/paper/#sec:pixel), Section IV and Appendix A in the paper's
order, and derives nothing new. It completes the readings of chapters [R1](/tutorial/newton/reading-section-ii/),
[R3](/tutorial/noise/reading-section-iv-2/) and [R4](/tutorial/response/reading-section-iv-3/), which marked these
claims *read now, derived in Part 8*. Each claim gets its chapter and a mark: *checked here* (derived earlier, with its
numbers recomputed here), *read now, derived in Part N*, or *stated in the paper*. Two optional stretches of Sections
IX and XI follow, then the capstone. The map below draws the stretches in order (Figure
[](#fig:read-quantum-map)).

![Look first at the filled boxes: every quantum statement of Sections II and IV and Appendix A is now derived in Part
8, except the camera's mass bound (11.1), the resolution of the which-way puzzle, which is stated in the paper, and
decoherence by gravity ([13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell)).
A half-filled box also holds a claim read now, in its dotted box, or stated in the paper.
The dashed strip holds two optional stretches of Sections IX and XI, with one sentence of Section VII, that need only
Part 8.](tut-read-quantum-map){#fig:read-quantum-map}

::: plain
Quantum mechanics enters the paper's near field in three places. First, the slow motions of ordinary bodies are
classical. A steel ball's ringing holds four hundred million quanta at room temperature, so the classical rules of heat
used in Part 4 hold for it, and the camera reads its trembling without receiving a single graviton.

Second, watching a free mass disturbs it. Two masses of a gram, read for a second, can at best resolve a tide 144,000
times weaker than that of a person a metre away. Cleverer ways of reading can beat even this limit.

Third, nothing beats the speed at which a quantum state can change. A camera too heavy for its size would be a black
hole, so its pull on a scene is limited. From this the paper estimates that no camera could see a person with a
signal-to-noise ratio above about $10^{70}$. Even that picture would be blurred by 1.5° and would hold about 22
kilobytes. A camera that could read a mass held in two places at once would end that double state.
:::

## Two gram masses at the standard quantum limit resolve a tide 144,000 times below the person's

The paragraph [*What the premise asks*](/paper/#par:what-the-premise-asks) of Section II ends its list of instruments
with an ideal one: two free masses of a gram, a centimetre apart and read for a second at the standard quantum limit,
"would resolve $9\times10^{-14}\,\mathrm{s^{-2}}$". Reading a free mass's position kicks its momentum, the
**back-action** of the reading, and the kick makes the mass drift. The best compromise between a sharp first reading
and a small drift is the **standard quantum limit**. Chapter
[8.6](/tutorial/quantum/quantum-limit/#a-free-mass-watched-for-a-time-cannot-be-followed-better-than-the-standard-quantum-limit)
derived it for a mass $\matter m$, in kilograms, watched for a time $\sym{reading-time}{\tau}$, in seconds. Here
$\sym{sql-width}{\sigma_{\rm SQL}}$ is the least spread of the mass's position after that time, in metres, and
$\sym{hbar}{\hbar} = 1.055\times10^{-34}\unit{J\,s}$ is the reduced Planck constant:

$$\sigma_{\rm SQL} = \sqrt{\frac{\hbar\tau}{\matter m}} = 3.25\times10^{-16}\unit m$$

for a gram and a second, about a fifth of a proton's width. It is the quantity that R1 wrote $\Delta x$ and took as
given (*checked here*).

By the paper's equation [](/paper/#eq:deviation), masses a distance $\sym{separation}{\xi} = 1$ cm apart are moved
relative to each other by $\tfrac12\curv\tE\xi\tau^2$, so with one of them a perfect reference the smallest tide they
resolve is $2\sigma_{\rm SQL}/\xi\tau^2 = 6.5\times10^{-14}\unit{s^{-2}}$
([8.6](/tutorial/quantum/quantum-limit/#two-gram-masses-read-for-a-second-resolve-a-tide-a-hundred-thousand-times-smaller-than-the-persons),
*checked here*). Their distance, with a spread from each, resolves $\sqrt2$ times more,
$9.2\times10^{-14}\unit{s^{-2}}$, the paper's figure.[^sqrt2] The person a metre away makes
$9.34\times10^{-9}\unit{s^{-2}}$, which is 101,000 times more, "a hundred thousand times less than the person's tide"
(*checked here*). Like 8.6, this chapter carries the one-mass estimate, 144,000 times below the person's tide, so this
pixel reads the person with a signal-to-noise ratio of $1.44\times10^5$ in one second. The paragraph's superconducting
gradiometer, at $0.02$ eötvös (E) or $2\times10^{-11}\unit{s^{-2}}$ in a second, as the paper takes it, gives R1's 467,
"five hundred", and the ideal pixel does 308 times better.

The limit belongs to one way of reading: the position is read twice, and the first reading's kick spoils the second.
A reading whose kick never disturbs the quantity being read, a **quantum non-demolition measurement**, can beat the
limit. In 2020 LIGO, using squeezed light, inferred a quantum noise 3 dB (half the power) below its standard quantum
limit near 40 Hz ([8.6](/tutorial/quantum/quantum-limit/#the-standard-quantum-limit-belongs-to-one-way-of-reading-and-it-can-be-beaten),
both *stated* there). The paper's ceiling, read below, rests instead on how fast any quantum state can change.

## The plain words' ceiling, its blur and its 22 kilobytes come out of Parts 3 and 8

The plain words of Section IV say that "about $10^{70}$ on a person" gives "a blur of $1.5^\circ$, so no camera of this
kind could draw a face". The ceiling is the estimate of *Limits on sensitivity*, read
[below](#no-cameras-state-can-change-fast-enough-to-pass-about-1070-on-a-person), which comes out at $2.6\times10^{70}$.
Chapter [3.7](/tutorial/noise/blur-law/#what-the-law-means)'s law gives the cut-off $\sym{cutoff}{q_c} = 168$, the
finest ripple the picture keeps, in units of one over the distance $z$ to the scene, and a blur of $1.51°$ at that ratio.
The eye's arcminute would need about $10^{6610}$ (*checked here*, as in R3).

"At the quantum ceiling of $10^{70}$, it holds about 22 kilobytes." Chapter
[3.8](/tutorial/noise/bits/#sensitivity-buys-more-patterns-and-more-bits-in-each-so-the-bits-grow-as-the-cube-of-its-logarithm)'s
integral gives $1.81\times10^5$ bits per patch at $2.6\times10^{70}$, which is 22.6 kilobytes of 8000 bits, spread
over 2260 patterns of 80 bits each, the "2200 patterns of 80 bits each" of *The information in a near-field image*
(*checked here*).[^patch]

## The ball's tremor is classical, holds four hundred million quanta and needs no graviton

[*What heat reveals*](/paper/#par:what-heat-reveals) names three conditions, of which the first is quantum: "the modes
that carry the tremor must be classical, $\hbar\omega \ll k_BT$". A mode of angular frequency $\omega$, in
$\mathrm{s^{-1}}$, takes energy only in steps $\hbar\omega$, its **quanta**. In equilibrium at the temperature
$\sym{temperature}{T}$ it holds on average $\sym{occupation}{\bar n} = 1/(e^{\hbar\omega/\kB T} - 1)$ of them, its
**occupation**, with $\sym{boltzmann}{\kB} = 1.38\times10^{-23}\unit{J\,K^{-1}}$ Boltzmann's constant. When
$\hbar\omega \ll \kB T$ this is about $\kB T/\hbar\omega$ ([8.3](/tutorial/quantum/quanta/#a-warm-mode-holds-about-k_bthbaromega-quanta)).
Chapter [8.3](/tutorial/quantum/quanta/#in-a-warm-mode-the-order-of-a-product-hardly-matters) showed what "classical"
means: reordering the mode's operators changes its means by about $1/(\bar n + \tfrac12) \approx \hbar\omega/\kB T$.
For the steel ball's 15.1 kHz note ($\omega = 9.49\times10^4\unit{s^{-1}}$) at 300 K this is $2.4\times10^{-9}$, so
quantum mechanics changes its tremor by parts in a billion (*checked here*).

"With $4\times10^8$ quanta in it at room temperature": $\kB T/\hbar\omega = 4.1\times10^8$ at Rayleigh's 15.1 kHz and
$5.0\times10^8$ at Lamb's exact 12.6 kHz (*checked here*).[^lamb] Chapter 8.3 also gave the 15.1 kHz trial mode's
**zero-point motion**, the swing that it keeps with no heat at all: $7.5\times10^{-21}$ m at the poles, $2.9\times10^4$
times less than the thermal swing of $2.2\times10^{-16}$ m.

"That mode emits one graviton in a time of order $10^{18}$ years." A **graviton** is one quantum $\hbar\omega$ of a
mode of a gravitational wave
([8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons), a
sketch for the field). With chapter 7.7's power of a ringing quadrupole, $4.9\times10^{-55}$ W, one graviton leaves
every $\hbar\omega/P = 2.1\times10^{25}$ s, or $6.5\times10^{17}$ years, at the 15.1 kHz trial note (*checked here*, as
in R4).[^graviton] "The camera detects the ball's ringing without receiving any of its radiation", because the near
field is the Newtonian pull of the ball's present shape and not radiation, so no quantum needs to arrive (8.3; *checked
here*). This is why "the graviton counts that limit the thermal glow … say nothing about the near field". The other two
conditions and the cost of distance were R4's.

## No camera's state can change fast enough to pass about $10^{70}$ on a person

The first paragraph of [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity) is an estimate in three steps.
First, "a camera that fits within the distance $z$ to the scene, without becoming a black hole, has a mass below
$zc^2/2G$" (*read now, derived in Part 11*, chapter 11.1). Here $z$ is in metres, $c = 3.00\times10^8\unit{m\,s^{-1}}$
is the speed of light and $G = 6.674\times10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ the gravitational constant.

Second, "its energy of interaction with a source of mass $M_s$ is below about $M_sc^2$". The energy of the pull
between such a camera and a source of mass $\sym{source-mass}{\matter M_s}$ at the distance $z$ is
$G(zc^2/2G)\matter M_s/z = \matter M_sc^2/2$, and $G$ and $z$ cancel (*checked here*).

Third, "if quantum mechanics then limits how quickly the camera's state can become distinguishable to a rate set by
that energy, as it does for a fixed coupling and a single measurement task". Chapter
[8.6](/tutorial/quantum/quantum-limit/#no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera)
showed, with two theorems that it states, that a strength read through one coupling for a time $\tau$ has a
signal-to-noise ratio of at most $2E_{\rm int}\tau/\hbar$. Here $E_{\rm int}$ is the spread of the interaction energy,
its standard deviation. An energy confined to a range of width $W$ has a spread of at most $W/2$, so $E_{\rm int} \le
\matter M_sc^2/4$, and the strict bound is $\matter M_sc^2\tau/2\hbar$ (*checked here*, as a sketch with the paper's
"if" kept). The paper rounds $\matter M_sc^2/2$ up to "about $\matter M_sc^2$", an estimate's factor of 2, and writes

$$\SNR \lesssim \frac{\matter M_sc^2\tau}{\hbar} ,$$

a pure number, since $\mathrm{kg\,m^2\,s^{-2}}\times\mathrm s/\mathrm{J\,s} = 1$. For 70 kg watched for the age of the
universe, $4.35\times10^{17}$ s, it is $2.6\times10^{70}$, "about $10^{70}$", and the blur is $1.51°$ with or without
the factor 2 (3.7, *checked here*). For the locked safe's 324 kg of gold it is $1.2\times10^{71}$ and $1.49°$.

"The estimate is generous: a camera of mass $zc^2/2G$ three metres away would pull on the person with $10^{15}$ times
the Earth's gravity." That mass is $2.0\times10^{27}$ kg, about Jupiter's, and its pull at 3 m is
$1.5\times10^{16}\unit{m\,s^{-2}}$, $1.5\times10^{15}$ times $9.81\unit{m\,s^{-2}}$. A camera that pulls no harder than
the Earth weighs $1.3\times10^{12}$ kg, and the ceiling falls by the same factor to $1.7\times10^{55}$, where the blur
is $1.91°$ (*checked here*). Fifteen powers of ten widen the blur only "from $1.5^\circ$ to $1.9^\circ$".

## A camera that could read a quantum mass would end its superposition

The second paragraph holds "a mass $m$ behind a wall in a superposition of two places a distance $d$ apart". A
**superposition of states** is a state whose amplitudes are shared between the two places, so that both can interfere
([8.1](/tutorial/quantum/states/#amplitudes-add-so-two-paths-can-cancel), *checked here*). "The two branches differ in
their quadrupole, by about $md^2$ when the body that recoils is centred on the mass." The body that moved the mass
recoils, because forces inside an isolated system cannot move its centre of mass, so the two branches have the same
mass and the same centre of mass and first differ in their second moments. Chapter
[8.1](/tutorial/quantum/states/#a-record-of-the-place-multiplies-the-interference-by-the-overlap-of-the-records) found
that difference to be $\matter md^2(1 + \matter m/\matter M)$ for a recoiling body of mass $\matter M$ whose centre is
at the mass, such as a trap around it (*checked here*). For a gram split by a micrometre, $\matter md^2 =
10^{-15}\unit{kg\,m^2}$, and 8.1 derived the difference of the two tides a metre away along the split, $12G\matter
md^2/r^5 = 8.0\times10^{-25}\unit{s^{-2}}$. That is $1.2\times10^{-11}$ of what the gram pixel of Section II resolves
in a second.

"A camera that read it before light from the place where the superposition is undone could arrive would learn which way
the mass went faster than causality allows." The puzzle and its resolution are *stated in the paper*
[@Belenchia2018; @DanielsonSatishchandranWald2022]. The field's vacuum fluctuations forbid "localizing any probe to
better than about a Planck length", $\sqrt{\hbar G/c^3} = 1.6\times10^{-35}$ m, $5\times10^{19}$ times smaller than a
proton's radius. Whenever a camera could learn enough, "undoing the superposition radiates gravitons that carry the
information away".

"A perfect camera is therefore a perfect source of decoherence." Chapter 8.1 derived the rule behind it: a record of
the place multiplies the interference term by the overlap $\langle e_R|e_L\rangle$ of the record's two states, and a
record that tells the places apart leaves no interference. This loss is **decoherence** (*checked here* in Part 8's
model; for gravity, *read now, derived in Part 13*, chapter
[13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell)).

## Appendix A's quantum jitter lies between the classical value and one mode

Section IV's paragraph [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals) ends by quoting
Appendix A: "Quantum mechanics bounds the jitter between the classical value and that of a single mode at the
root-mean-square frequency, $\sqrt{A/\chi_h(0)}$". The **static jitter** $\langle\delta\matter Q_h^2\rangle$ is the mean
square departure of a moment $\matter Q_h$ from its mean. Here $\chi_0 = \sym{tide-response}{\chi_h}(0)$ is its static
compliance, how far $\matter Q_h$ moves per unit of a steady tide, and $\sym{response-sum}{A} = \int\matter\rho|\nabla
h|^2\,\dd V$ is the sum of the paper's equation [](/paper/#eq:sum-rule). For a quadrupolar tide, with its shape $h$ in
square metres, $\matter Q_h$ is in $\mathrm{kg\,m^2}$, $\chi_0$ in $\mathrm{kg\,m^2\,s^2}$ and $A$ in
$\mathrm{kg\,m^2}$, so $A/\chi_0$ is a squared angular frequency.

The last paragraph of Appendix A's [*The trembling lattice*](/paper/#par:the-trembling-lattice) opens: "For a quantum
system the jitter is no longer $k_BT\chi_0$". Chapter 8.7 derived the
[**quantum fluctuation–dissipation theorem**](/tutorial/quantum/quantum-fluctuation/#the-tremor-at-each-frequency-is-hbarcothhbaromega2k_bt-times-the-friction-there):
the tremor of a reading at each frequency, averaged over the two orders of its operators, is
$\hbar\coth(\hbar\omega/2\kB T)$ times the friction there. It becomes the classical $2\kB T/\omega$ when $\hbar\omega
\ll \kB T$ (*checked here*).

"The measure $(2/\pi\chi_0)\,\mathrm{Im}\,\chi(\omega)\,\dd\omega/\omega$ has unit weight and mean square frequency
$A/\chi_0$." Chapter 4.5's paper problem showed both from its
[two sums](/tutorial/response/causality/#at-the-two-ends-of-the-spectrum-the-relation-becomes-two-sums). With
this weight, the theorem gives the jitter "as its average of $\tfrac12\hbar\chi_0\,\omega\coth(\hbar\omega/2k_BT)$"
([8.7](/tutorial/quantum/quantum-fluctuation/#the-static-jitter-lies-between-two-bounds), *checked here*). The paper
adds that "$\sqrt x\coth(s\sqrt x)$ is concave in $x$", where $x = \omega^2$ and $s = \hbar/2\kB T$ is a time, in
seconds: the function is $\omega\coth(s\omega)$. By **Jensen's inequality**, the average of a concave function lies
at or below its value at the mean, here at $\omega^2 = A/\chi_0$. Since $u\coth u \ge 1$ for every $u > 0$, with $u =
\hbar\omega/2\kB T$, the average also lies at or above $\kB T\chi_0$ (8.7, *checked here*):

{{paper eq:jitter-bounds}}

"With the upper bound reached by a single undamped mode": the average equals its value at the mean only when the weight
sits at one frequency, as it does for one mode with no line width. For the steel ball as one mode at Lamb's 12.6 kHz
and 300 K, $u = 1.0\times10^{-9}$, and the two bounds differ by $u\coth u - 1 \approx u^2/3 = 3.4\times10^{-19}$ of the
jitter ($4.9\times10^{-19}$ for the 15.1 kHz trial mode). R4's check is now derived. At absolute zero the lower bound
vanishes, but the jitter keeps the zero-point swing given
[above](#the-balls-tremor-is-classical-holds-four-hundred-million-quanta-and-needs-no-graviton).

## Read ahead: a counter adds no noise, and each graviton tells about one bit

The next two sections read stretches of Sections IX and XI that need only Part 8. Readers on the route to Section IV
may skip them; reading chapters R10b, R11 and R12 will point back here.

Section IX's [*Counting or recording*](/paper/#par:counting-or-recording) states the tension: each mode of the thermal
glow "holds $10^{-30}$ gravitons or fewer on average" (*read now, derived in Part 10*). A device that records both
quadratures of a mode, the amplitudes of its cosine and sine parts, adds at least half a quantum of noise, the **added
noise** of Caves's theorem
([8.6](/tutorial/quantum/quantum-limit/#recording-both-quadratures-of-a-wave-adds-half-a-quantum-of-noise), *checked
here* with the general theorem stated). So "recorded pixel by pixel, a thermal gravitational image would be buried in
that noise". "Counting avoids the noise but loses the phase", because a coherent state's counts depend on its size and
not on its phase ([8.5](/tutorial/quantum/counting-quanta/#counting-adds-no-noise-but-needs-quanta), *checked here*).
The paragraph's remedies are *stated in the paper*.

Section VII's [*What a lens would add*](/paper/#par:what-a-lens-would-add) says that combining the field before
detection "is what lets a camera form an image from counted gravitons instead of recording noise": by Section IX, an
image whose information grows with the occupation rather than its square (*stated in the paper*). The counting pixel
below, which counts with no combining, needs no lens. The rest of that paragraph is classical, for R11.

A graviton's **helicity** is $\pm2$, its angular momentum about its direction of travel in units of $\hbar$
([8.3](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons)), which
chapter 9.1 reads from how $\curv{\mathcal W}$ changes in time. "One graviton of helicity two from $\hat n$ excites the
five local modes of its helicity", the five components of a reading at one pixel, "in the state of" the paper's
equation [](/paper/#eq:square), "a coherent state of spin two"
([8.4](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky), *checked here*). Chapter
[8.6](/tutorial/quantum/quantum-limit/#a-measurement-is-a-set-of-positive-tables-that-add-to-one-and-a-gravitons-click-carries-about-a-bit)
built the measurement made of all such states. Its clicks fall at the angle $\vartheta$ from $\hat n$ with the density
$(5/4\pi)\cos^8(\vartheta/2)$, and an empty mode never clicks, so it "adds no noise".

Each click carries $\log_2 5 - 4/(5\ln2) = 1.168$ bits about the direction for a graviton, $\log_2 3 - 2/(3\ln2) =
0.623$ for a photon and none for a scalar: the paper's "1.17", "0.62" and "none". Its **Fisher information**, chapter
3.3's measure of how sharply data fix a number, is 2 about each angle for a graviton. That is half of 4, the quantum
Fisher information of 8.6 for one angle alone, the paper's "half the quantum limit" (*all checked here*). At one
graviton a second, 1800 gravitons give the information 3600 per angle and an error of $1/\sqrt{3600}$ rad $= 0.95°$, "to
a degree in half an hour" (the rate is R10b's).

## Read ahead: coincidences tell a sky born hot from one born in inflation

Section XI's [*Counting coincidences*](/paper/#par:counting-coincidences) uses the **second-order coherence**
$\sym{second-order-coherence}{g^{(2)}}$, the rate of coincident counts over that of independent arrivals
([8.5](/tutorial/quantum/counting-quanta/#one-number-tells-the-two-apart-and-no-classical-wave-brings-it-below-one)).
Chapter 8.5 derived $g^{(2)} = 1$ for one mode of a coherent source and $g^{(2)} = 2$ for a thermal one (*checked
here*). The $0.905\unit K$ glow is *read now, derived in chapter
[12.2](/tutorial/sky/universe/#gravitons-parted-first-and-kept-a-colder-share-of-the-heat)*; at 10 GHz it holds $\bar n
= 1.43$ gravitons per mode, so its pairs of clicks would be common.[^bunch]

Inflation "makes gravitons in pairs of opposite momentum, a two-mode squeezed state" (*stated in the paper*), a state
of two modes made only of pairs, one quantum in each. Chapter
[8.5](/tutorial/quantum/counting-quanta/#pairs-in-two-modes-coincide-more-than-thermal-classical-waves-can) showed that
each mode of such a pair alone is thermal and that the two together give $\sym{cross-coherence}{g^{(2)}_{12}} = 2 +
1/\bar n$: 5.68 at $\bar n = 0.27$, and 3 at $\bar n = 1$. Two classical beams with thermal statistics reach at most 2,
by the Cauchy–Schwarz inequality, which is the paper's "more than any two classical fields of thermal statistics allow"
(*checked here*).

## The capstone: from two grams to the ceiling

The capstone follows the best pixel from two grams to the ceiling. Each step gives one number and the place where it
was found.

**(a) The best pixel of Section II.** In one second it reads the person with a ratio of $1.44\times10^5$, which chapter
3.7's exact calculation blurs by $16.0°$, against $26.0°$ for the gradiometer's 467
([above](#two-gram-masses-at-the-standard-quantum-limit-resolve-a-tide-144000-times-below-the-persons)).

**(b) How far it grows.** The two grams fall together under their own pull in about an hour, so read in stretches of
$10^3$ s and averaged over the age of the universe, the pixel reaches $9.5\times10^{16}$, a blur of $5.8°$
([8.6's ladder](/tutorial/quantum/quantum-limit/#no-state-changes-faster-than-its-energy-spread-allows-and-that-caps-every-camera)).

**(c) The ceiling.** No camera passes about $2.6\times10^{70}$
([above](#no-cameras-state-can-change-fast-enough-to-pass-about-1070-on-a-person)). The ceiling grows in proportion to
$\tau$, while the averaged pixel grows only as $\sqrt\tau$, so the longer both watch, the wider the gap.

**(d) The steel ball.** Its thermal tremor makes $3.4\times10^{-25}\unit{s^{-2}}$ a metre away (4.3, R4),
$5.3\times10^{-12}$ of what the gram pixel resolves in a second
([above](#the-balls-tremor-is-classical-holds-four-hundred-million-quanta-and-needs-no-graviton)).

**(e) The gram in two places.** Its tide is $1.2\times10^{-11}$ of the gram pixel's limit (Figure
[](#fig:quantum-tides)), and any pixel that read it would end the superposition
([above](#a-camera-that-could-read-a-quantum-mass-would-end-its-superposition)).

**(f) What the ceiling means.** A blur of $1.51°$ is 2.6 cm on a person a metre away, too coarse to draw a face
(3.7, [above](#the-plain-words-ceiling-its-blur-and-its-22-kilobytes-come-out-of-parts-3-and-8)).

![Look first at the gap below the dashed line: the quantum scenes of Section IV lie more than ten powers of ten below
what the best pixel of Section II resolves in a second, and the ball's zero point more than fifteen. The dotted bar holds
only for a tide that stays steady for the age of the universe, which these scenes do not. Instrument bars are for a
steady tide; the tremors are root-mean-square values.](tut-quantum-tides){#fig:quantum-tides}

{{paper fig:resolution-law}}

::: try {#blur-law}
This is chapter 3.7's figure. Its slider runs in half powers of ten from 10 to $10^{60}$, short of the ceiling's
$10^{70}$; at $10^{60}$ the blur is still $1.76°$. It opens at $10^3$, where the exact blur is $24°$. Before
you touch it, predict how many powers of ten of sensitivity halve that blur to $12°$: about two, four or eight? Then
drag the slider to where the exact blur first falls below $12°$. Afterwards, find where it first falls below $6°$, and
compare the numbers of powers of ten that the two halvings cost.
:::

::: try {#quantum-limit}
This is chapter 8.6's figure; it opens at the paper's pixel, two grams a centimetre apart read for a second. Its own
predictions are 8.6's. Here, predict first: if the reading lasts a hundred times longer, how much smaller a tide do
the two masses resolve? Then raise the reading time from 1 s to 100 s, still well inside the hour after which the two
grams fall together, and read the resolved tide. Afterwards, say how the factor you found becomes the $\tau^{3/2}$
growth of step (b).
:::

## The ledger: after Part 8, Sections II and IV are derived except three statements of physics beyond them

R7 found all five of Section II's equations and all twenty of Section IV's derived. The quantum statements read here
add one more, the paper's [](/paper/#eq:jitter-bounds), derived in chapter 8.7. Part 8 also derived three equations that
no stretch read here uses: the paper's [](/paper/#eq:hair-commutator) and [](/paper/#eq:push) for operators in 8.2, which
[R13](/tutorial/what-a-field-keeps/reading-sections-xii-and-xiii/) will read, and the paper's
[](/paper/#eq:one-spin), the state of one of a reading's four spins one half, in 8.4, which R9 will read.

Every statement of Section II is now derived or stated. In Section IV the quantum statements are derived in Part 8,
except the camera's mass bound (chapter 11.1), the resolution of the which-way puzzle (stated in the paper) and
decoherence by gravity (chapter
[13.8](/tutorial/what-a-field-keeps/holography/#gravity-cannot-decohere-a-ball-and-a-shell)). The $10^{-30}$ gravitons
per mode come in Part 10 and R10b, and the $0.905\unit K$ glow in chapter
[12.2](/tutorial/sky/universe/#gravitons-parted-first-and-kept-a-colder-share-of-the-heat) and R12b.

::: check
### Q

Why does the paper's ceiling not rest on the standard quantum limit?

### A

The standard quantum limit belongs to one way of reading, the position twice, and quantum non-demolition readings beat
it. The ceiling rests on how fast any state can change, which no reading beats, for a scene read through "a fixed
coupling and a single measurement task". Within that condition only its interaction energy is an estimate.

### Q

What ratio does the ceiling allow on the gold bar of the locked safe, 324 kg watched for the age of the universe, and
what blur?

### A

The ceiling is $324\times(3.00\times10^8)^2\times4.35\times10^{17}/1.055\times10^{-34} = 1.2\times10^{71}$, a blur of $1.49°$.

### Q

Why does a camera that could read the quadrupole of a mass in two places end its superposition?

### A

The camera ends in a different state for each place, and the interference is multiplied by the overlap of those two
states, which is close to zero for a reading far above the noise (8.1).
:::

**The idea to keep: quantum mechanics enters the near field in three places. It leaves every slow mode of a body
classical, with hundreds of millions of quanta; it limits a pixel of two free grams to about $10^{-13}\,\mathrm{s^{-2}}$
in a second, a limit that can be beaten; and through the speed at which any state can change it caps every camera's
signal from a person near $10^{70}$, a blur of 1.5°.**

::: problems
### Practice

Rerun the first section's chain for two 10 kg masses 10 cm apart, read for 100 s. Find the tide they resolve, the
person's ratio, and the reading time at which the ratio is $10^{10}$, using its growth as $\tau^{3/2}$. Do the masses
stay close for that long?

::: solution
The limit is $\sigma_{\rm SQL} = \sqrt{1.055\times10^{-34}\times100/10}\unit m = 3.2\times10^{-17}$ m, so the tide is
$2\sigma_{\rm SQL}/\xi\tau^2 = 6.5\times10^{-20}\unit{s^{-2}}$ and the ratio is $1.44\times10^{11}$. By the
$\tau^{3/2}$ law the ratio is $10^{10}$ after $100\times(10^{10}/1.44\times10^{11})^{2/3} = 17$ s. The masses' own pull
closes the gap after about $\sqrt{\xi^3/G\matter m} = 1.2\times10^3$ s, and the person's tide parts them after
$\sqrt{2/\curv\tE} = 1.5\times10^4$ s, so they stay close for 17 s.
:::

### Stretch

Combine 8.6 and 3.8: how many bits per patch would a picture of the person hold at the averaged pixel's
$9.5\times10^{16}$, against the ceiling's?

::: solution
Chapter 3.8's integral gives $3.2\times10^3$ bits, about 390 bytes, at $9.5\times10^{16}$, against $1.81\times10^5$
bits, 22.6 kilobytes, at $2.6\times10^{70}$: fifty-three powers of ten for 57 times the bits.
:::

### The paper

Reproduce every number of *Limits on sensitivity*: the $10^{70}$, $1.5°$, the $10^{15}$ times the Earth's gravity,
$10^{55}$ and $1.9°$, then the Planck length and the tide of a gram split by a micrometre.

::: solution
The ceiling is $70\times(3.00\times10^8)^2\times4.35\times10^{17}/1.055\times10^{-34} = 2.6\times10^{70}$, $q_c = 168$, blur $1.51°$.
The camera of $3c^2/2G = 2.0\times10^{27}$ kg pulls at 3 m with $1.5\times10^{16}\unit{m\,s^{-2}}$, $1.5\times10^{15}\,g$;
one of $1.3\times10^{12}$ kg pulls with $g$, and the ceiling falls to $1.7\times10^{55}$, blur $1.91°$. The Planck length
is $\sqrt{\hbar G/c^3} = 1.6\times10^{-35}$ m, and $12G\matter md^2/r^5 = 8.0\times10^{-25}\unit{s^{-2}}$.
:::
:::

::: paper
- Section II's [*What the premise asks*](/paper/#par:what-the-premise-asks): the two gram masses at the standard quantum
  limit.
- Section IV's [plain words](/paper/#sec:near-field), [*What heat reveals*](/paper/#par:what-heat-reveals),
  [*What an applied tide reveals*](/paper/#par:what-an-applied-tide-reveals),
  [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity) and
  [*The information in a near-field image*](/paper/#par:the-information-in-a-near-field-image): the classical modes, the
  ceiling, the quantum scene and the 22 kilobytes.
- Appendix A's [*The trembling lattice*](/paper/#par:the-trembling-lattice): the paper's equation
  [](/paper/#eq:jitter-bounds).
- Section VII's [*What a lens would add*](/paper/#par:what-a-lens-would-add), Section IX's
  [*Counting or recording*](/paper/#par:counting-or-recording) and Section XI's
  [*Counting coincidences*](/paper/#par:counting-coincidences): the optional stretches.
:::

::: deeper
- The GR course's [section 23.7](https://neovand.github.io/general-relativity/chapter-23.html#23-7-the-semiclassical-equation-and-its-limits)
  says where quantum fields and classical gravity meet, the setting of the which-way puzzle.
- V. B. Braginsky and F. Ya. Khalili, *Quantum Measurement* (Cambridge, 1992): the standard quantum limit and how to
  beat it.
:::

[^sqrt2]: The distance between two free grams, each with its own spread, has $\sqrt2$ times the spread of one, as
    for one body of the reduced mass $\matter m/2$ (8.6).

[^patch]: A patch is a square of the scene whose side is its distance from the camera. At $10^{70}$ exactly, as R3
    computed, the integral gives $1.78\times10^5$ bits.

[^lamb]: The paper's "an estimated $15\,\mathrm{kHz}$" is Rayleigh's bound for a guessed shape, 20% above Lamb's exact note (4.3).

[^graviton]: The time per graviton grows as $\omega^{-3}$, so at Lamb's 12.6 kHz it is $1.1\times10^{18}$ years.
    Both are of order $10^{18}$.

[^bunch]: A thermal sky bunches by 2 within one mode and one coherence time; a pixel that collects many modes in a
    window sees $g^{(2)}$ near 1 (8.5).
