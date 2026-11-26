---
id: '8.5'
title: 'Counting quanta: Poisson, thermal and squeezed'
question: 'How can the timing of a detector''s clicks tell a steady source from a hot one, and what can no classical field do?'
part: '8'
requires: ['3.1', '3.2', '3.3', '4.2', '8.2', '8.3', '8.4']
paper: [sec:vistas, sec:first-image, sec:thermal]
figures: []
live: [click-trains]
depth: A
---

A pixel of the camera may only count, clicking once for each graviton it absorbs. How can the timing of its clicks tell
a steady source from a hot one, and what can no classical field do? We use the levels of
[section 8.3](/tutorial/quantum/quanta/), the reduced states of [section 8.4](/tutorial/quantum/spin/) and the
probability of sections [3.1](/tutorial/noise/probability/#rare-events-are-counted-with-the-poisson-distribution)
and [3.3](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks).

::: plain
A steady wave, such as a laser's light, gives clicks that come independently of one another, like drops of steady
rain. The light of a hot body is a jumble of waves whose brightness rises and falls at random, so its clicks come in
bunches. One number, written $g^{(2)}$, measures this: it is 1 for steady light and 2 for heat, and no classical wave
can make it less than 1.

Quantum mechanics also allows sources that make quanta in pairs. Two detectors that each catch one quantum of every
pair click together more often than any two classical waves with the same bunching could. Inflation, if it happened,
made gravitons in such pairs.
:::

## A steady source gives Poisson counts

We want the probability of each count from a mode in a coherent state. A mode is one pattern of a field, with one
frequency, direction and polarization, and section 8.3 showed that each is an
[oscillator](/tutorial/quantum/quanta/#each-mode-of-a-wave-is-an-oscillator-and-its-quanta-are-photons-or-gravitons)
whose steady swing is a coherent state. We assume that **the detector is ideal**: it
absorbs every quantum of the mode, and its count $n$ is the outcome of measuring the number operator $a^\dagger a$, so
by the [Born rule](/tutorial/quantum/states/#probabilities-are-the-squared-sizes-of-amplitudes) the count $n$ comes
with the probability $|\langle n|\psi\rangle|^2$.[^n]

We expand the coherent state over the levels, $|\alpha\rangle = \sum_n\psi_n|n\rangle$, and apply $a$, which sends
$|n\rangle$ to $\sqrt n\,|n - 1\rangle$:

$$\begin{aligned}
a|\alpha\rangle &= \sum_{n\ge1}\psi_n\sqrt n\,|n - 1\rangle\\
&= \sum_{n\ge0}\psi_{n+1}\sqrt{n + 1}\,|n\rangle .
\end{aligned}$$

This must equal $\alpha|\alpha\rangle = \sum_n\alpha\psi_n|n\rangle$. Comparing the two level by level gives
$\psi_{n+1} = \alpha\psi_n/\sqrt{n + 1}$, and repeating the step gives $\psi_n = \psi_0\,\alpha^n/\sqrt{n!}$. The state
has length one, so $|\psi_0|^2\sum_n|\alpha|^{2n}/n! = |\psi_0|^2e^{|\alpha|^2} = 1$. With $\bar n = |\alpha|^2$ from
section 8.3, the probability of the count $n$ is

$$\boxed{\sym{count-distribution}{P}(n) = |\psi_n|^2 = \frac{e^{-\bar n}\,\bar n^n}{n!}} ,$$

the Poisson distribution of section 3.1 with the mean $\lambda = \bar n$. Its variance is $\bar n$, so the count's
spread is $\sqrt{\bar n}$. A coherent state is therefore a steady wave whose quanta arrive independently, as a laser's
light nearly does. **A number.** A coherent mode with $\bar n = 4$ gives counts of variance 4, a spread of 2 about the mean; the counts 3 and 4 are the likeliest, each with the probability 0.195.

## A thermal source gives geometric counts, with a larger spread

We want the same distribution for a mode in thermal equilibrium. From
[Boltzmann's weights](/tutorial/response/temperature/#the-chance-of-a-state-falls-exponentially-with-its-energy)
section 8.3 found $P(n) = (1 - y)\,y^n$, with $y = e^{-\hbar\omega/\kB T}$ and $\bar n = y/(1 - y)$. Solving the last
for $y$ gives $y = \bar n/(1 + \bar n)$ and $1 - y = 1/(1 + \bar n)$, so

$$\boxed{P(n) = \frac{\bar n^n}{(1 + \bar n)^{n+1}}} .$$

Each count is $\bar n/(1 + \bar n)$ times as likely as the one below it, so this is a **geometric distribution**; counts
that follow it obey **thermal statistics**, also called **Bose–Einstein statistics**. For the variance we differentiate
the geometric series $\sum_ny^n = 1/(1 - y)$ twice, which gives $\sum_nn(n - 1)\,y^{n-2} = 2/(1 - y)^3$. Multiplying
by $(1 - y)\,y^2$,

$$\langle n(n - 1)\rangle = \frac{2y^2}{(1 - y)^2} = 2\bar n^2 .$$

So $\langle n^2\rangle = 2\bar n^2 + \bar n$, and the variance is

$$\boxed{\langle n^2\rangle - \bar n^2 = \bar n + \bar n^2} .$$

**A number.** With $\bar n = 4$ the likeliest count is zero, with the probability 0.20, where a coherent mode gives
zero only 1.8% of the time (Figure [](#fig:counts)). **Two limits.** When $\bar n \ll 1$ the counts are nearly Poisson;
when $\bar n \gg 1$ the spread is about $\bar n$, as large as the mean.

The extra $\bar n^2$ has a classical meaning. Take a classical wave of angular frequency $\omega$, such as one
component of light's electric field or a gravitational wave's strain, and write its value at one place as $q(t) =
X_1\cos\omega t + X_2\sin\omega t$. The amplitudes $\sym{quadrature}{X_1}$ and $X_2$ of its cosine and sine parts, in
the unit of $q$, are its two **quadratures**. They are fixed for a steady wave and wander for noise, over a
[coherence time](/tutorial/waves/diffraction/#one-moving-pixel-can-image-a-steady-source-but-thermal-light-needs-pixels-that-record-together-in-pairs),
the time over which a wave keeps its phase. The wave's **intensity** $\sym{wave-intensity}{I}$, its power per square
metre averaged over a cycle, is in proportion to the cycle's mean of $q^2$. Since $\cos^2$ and $\sin^2$ average to
$\tfrac12$ over a cycle and $\cos\sin$ to zero, that mean is $\tfrac12(X_1^2 + X_2^2)$.[^I]

We assume that **the detector clicks at random, independently in each short interval, with a mean count $\lambda$ in a
window in proportion to the intensity then**, and that **the intensity is steady within a window but may change from
one window to the next**. In a window of a given $\lambda$ the count is Poisson, with $\langle n(n - 1)\rangle =
\lambda^2$ (section 3.1). Averaging over the windows gives $\bar n = \langle\lambda\rangle$ and $\langle n(n -
1)\rangle = \langle\lambda^2\rangle$, so

$$\langle n^2\rangle - \bar n^2 = \langle\lambda\rangle + \bigl(\langle\lambda^2\rangle - \langle\lambda\rangle^2\bigr) .
\label{eq:two-noises}$$

The first term is the clicks' noise and the second the wave's. Heat is the sum of the waves of very many independent
emitters, so by the central limit theorem its quadratures are independent
[Gaussian](/tutorial/noise/probability/#most-noise-follows-the-gaussian-bell) numbers with mean zero and one variance
$s^2$, in the unit of $q$. A Gaussian number has $\langle X^4\rangle = 3s^4$,[^fourth] so

$$\begin{aligned}
\frac{\langle I^2\rangle}{\langle I\rangle^2} &= \frac{\langle X_1^4\rangle + 2\langle X_1^2\rangle\langle X_2^2\rangle
+ \langle X_2^4\rangle}{(2s^2)^2}\\
&= \frac{8s^4}{4s^4} = 2 .
\end{aligned}$$

So the wave's noise is $\langle\lambda^2\rangle - \langle\lambda\rangle^2 = \langle\lambda\rangle^2 = \bar n^2$, and
[](#eq:two-noises) gives the quantum answer, $\bar n + \bar n^2$: in heat the $\bar n$ is the clicks and the $\bar
n^2$ is the wave. The agreement is exact for every count: a thermal mode is a mixture of coherent states whose
$\alpha$ is a Gaussian number with mean zero and $\langle|\alpha|^2\rangle = \bar n$, each counted as
Poisson.[^glauber]

![Look first at $n = 0$: a thermal mode with four quanta on average is most often empty, while a coherent one
almost never is. Both have the mean 4; the thermal counts spread with the standard deviation 4.5, the coherent ones
with 2. Every bar is exact.](tut-count-bars){#fig:counts}

## One number tells the two apart, and no classical wave brings it below one

We want one number that separates the two sources at any mean count. In a window shorter than the coherence
time, $n(n - 1)$ is the number of ordered pairs of different clicks, whose mean for independent arrivals would be $\bar
n^2$ (section 3.1). The **second-order coherence** compares the two:

$$\sym{second-order-coherence}{g^{(2)}} = \frac{\langle n(n - 1)\rangle}{\bar n^2} =
\frac{\langle a^\dagger a^\dagger aa\rangle}{\langle a^\dagger a\rangle^2} ,$$

a pure number. The second form holds because $[a, a^\dagger] = 1$ gives $a^\dagger a^\dagger aa = a^\dagger(aa^\dagger
- 1)\,a = (a^\dagger a)^2 - a^\dagger a$, which is $n^2 - n$ on the level $|n\rangle$. It is measured by splitting a beam
onto two detectors and counting **coincidences**, clicks of both in one short window. From the last two sections,

$$\boxed{g^{(2)} = 1 \ \text{(coherent)} , \qquad g^{(2)} = 2 \ \text{(thermal)}} .$$

Clicks with $g^{(2)} > 1$ show **bunching** (Figure [](#fig:click-trains)). **A number:** with $\bar n = 0.1$ in a
window, two or more clicks come in 0.47% of windows for a coherent mode and 0.83% for a thermal one.

**The classical bound.** We assume that **the counts are made by a classical wave**, as in the last section: its
intensity cannot be negative and has a probability distribution over the windows. Then $\langle n(n - 1)\rangle =
\langle\lambda^2\rangle$, and since $\lambda$ is in proportion to $I$,

$$\boxed{g^{(2)} = \frac{\langle I^2\rangle}{\langle I\rangle^2} = 1 + \frac{\langle I^2\rangle - \langle I\rangle^2}
{\langle I\rangle^2} \ge 1} ,$$

because a variance cannot be negative. Equality holds only for a steady intensity, a coherent wave. A quantum state can
go below: one quantum, $|1\rangle$, has $\langle n(n - 1)\rangle = 0$ and $g^{(2)} = 0$. Clicks with $g^{(2)} < 1$ show
**antibunching**, which no classical wave can produce.

Two detectors, 1 and 2, give the cross coherence $\sym{cross-coherence}{g^{(2)}_{12}} = \langle n_1n_2\rangle/\bar
n_1\bar n_2$, which needs no $-1$ because a click of one detector and a click of the other are always different
clicks. For classical waves the detectors click independently once the intensities are given, so $\langle
n_1n_2\rangle = \langle\lambda_1\lambda_2\rangle$, while $g^{(2)}_{11} = \langle\lambda_1^2\rangle/\bar n_1^2$ as
above, and likewise $g^{(2)}_{22}$. The argument of section 3.3 with mean squares in the place of variances, $\langle(\lambda_1 -
\beta\lambda_2)^2\rangle \ge 0$ with $\beta = \langle\lambda_1\lambda_2\rangle/\langle\lambda_2^2\rangle$,
gives the Cauchy–Schwarz inequality $\langle\lambda_1\lambda_2\rangle^2 \le
\langle\lambda_1^2\rangle\langle\lambda_2^2\rangle$. Dividing by $\bar n_1^2\bar n_2^2$,

$$\boxed{g^{(2)}_{12} \le \sqrt{g^{(2)}_{11}\,g^{(2)}_{22}}} .$$

This is the **classical bound**. Equality holds when $I_2$ is a fixed multiple of $I_1$, as for one beam split in two,
so two thermal beams reach at most 2.

![Look first at the bottom two rows: every click of one detector has a partner in the other. The steady
source's clicks fall independently, the thermal source's come in bunches a coherence time long, and the pair source's
two detectors each see thermal bunches but click together. The click times are simulated; the rates and the coherence
time are schematic.](tut-click-trains){#fig:click-trains}

::: history
### Hanbury Brown and Twiss measure a star with its bunching

In 1956 Robert Hanbury Brown and Richard Twiss, at Jodrell Bank, turned two searchlight mirrors on Sirius and
measured how the correlation of their fluctuating signals fell as the mirrors were moved apart. Starlight fluctuates
together at two places only within about a wavelength divided by the star's angular size, so the fall gave the size,
0.0068 seconds of arc (*Nature* 178, 1046). This is **intensity interferometry**; Edward Purcell explained its
bunching as that of photons in thermal light (*Nature* 178, 1449).
:::

## A squeezed state is narrower than the zero point in one direction

We want a state quieter than the zero point in one quadrature, because section 8.6 uses such a state to measure one
quadrature more finely than the standard quantum limit allows. A free swing that starts at the position $x$ with the
momentum $p$ moves as $x\cos\omega t + (p/\matter m\omega)\sin\omega t$, so its quadratures are $x$ and
$p/\matter m\omega$. Section 8.3 wrote them as

$$x = x_{\rm zp}\,(a + a^\dagger) , \qquad \frac{p}{\matter m\omega} = -i\,x_{\rm zp}\,(a - a^\dagger) .$$

On the [phase plane](/tutorial/quantum/quanta/#a-classical-oscillation-is-a-state-of-many-quanta-in-step) the ground
state is a round blob with the spread $x_{\rm zp}$ in both, a coherent state is the same blob moved, and a thermal
state is a wider round blur centred at the origin. A **squeezed vacuum** is the state $S|0\rangle$ made from the ground
state by the table

$$S = \exp\bigl[\tfrac{r}{2}\bigl(a^2 - a^{\dagger2}\bigr)\bigr] ,$$

where the **squeezing parameter** $\sym{squeezing-parameter}{r}$ is a real number with no unit. Its blob is an
ellipse of the same area, narrower than the zero point in $x$ and wider in $p$ (Figure [](#fig:squeezed)), with the
spreads

$$\sigma_x = e^{-r}x_{\rm zp} , \qquad \sigma_{p/\matter m\omega} = e^{r}x_{\rm zp} .$$

It holds

$$\boxed{\bar n = \sinh^2r}$$

quanta on average (the box below derives both). Each term of the exponent of $S$, $a^2$ or $a^{\dagger2}$, changes the
count by two, so the state holds only even counts: its quanta come in pairs. **A number.** At $r = 0.6$ the spread in
$x$ is $0.55\,x_{\rm zp}$, and the mode holds $\bar n = 0.405$ quanta.

![Look first at the ellipse at the centre: the squeezed vacuum is narrower than the zero point along $x$ and
wider along $p$, with the same area. A coherent state is the zero point moved; a thermal state is a wider round blur
about the origin, with no phase. Each contour is one standard deviation, exact; the position of the coherent state is
chosen for clarity.](tut-phase-blobs){#fig:squeezed}

::: derivation
### The squeezed vacuum's spreads and its count

The table $S$ is the [generated table](/tutorial/quantum/operators/#a-generator-is-the-exponent-of-a-unitary-table)
$e^{-i\lambda G/\hbar}$ of section 8.2 with $\lambda = r$ and the Hermitian $G = \tfrac{i\hbar}{2}(a^2 - a^{\dagger2})$,
so it is unitary: $S^\dagger S = SS^\dagger = 1$. With $K = \tfrac12(a^2 - a^{\dagger2})$ we have $S =
e^{rK}$, and the series for $U^\dagger FU$ of section 8.2 gives

$$S^\dagger aS = a - r[K, a] + \frac{r^2}{2!}[K, [K, a]] - \dots .$$

From $[a, a^\dagger] = 1$, $[K, a] = a^\dagger$ and $[K, a^\dagger] = a$, so the terms alternate between $a$ and
$a^\dagger$ and sum to

$$S^\dagger aS = a\cosh r - a^\dagger\sinh r \equiv A .$$

Because $SS^\dagger = 1$, a product such as $S^\dagger aaS$ equals $(S^\dagger aS)(S^\dagger aS)$. So a mean in
$S|0\rangle$ is the mean in $|0\rangle$ with $a$ replaced by $A$. That replacement turns $a + a^\dagger$ into $e^{-r}(a
+ a^\dagger)$ and $a - a^\dagger$ into $e^{r}(a - a^\dagger)$, which gives the spreads above. Their product is the
ground state's, so $\sigma_x\sigma_p = \hbar/2$ meets the
[bound](/tutorial/quantum/operators/#the-uncertainty-relation-is-robertsons-inequality-for-position-and-momentum) of
section 8.2. The mean count $\langle a^\dagger a\rangle$ is the squared length of $A|0\rangle = -\sinh r\,|1\rangle$,
which is $\sinh^2r$.
:::

## Pairs in two modes coincide more than thermal classical waves can

We want the state that inflation would give the gravitons. Take two modes, with lowering operators $a$ and $b$ and
the levels $|n\rangle|n'\rangle$ of the rule for two things in section 8.1. The **two-mode squeezed state** is

$$|\Psi\rangle = \sum_nc_n\,|n\rangle|n\rangle , \qquad \sym{pair-amplitude}{c_n} = \frac{\tanh^nr}{\cosh r} ,$$

made from the vacuum of both modes by $e^{r(a^\dagger b^\dagger - ab)}$, as the box below derives. It makes
quanta only in pairs, one in each mode, and its length is one, because $\sum_n\tanh^{2n}r = 1/(1 - \tanh^2r) =
\cosh^2r$.

::: derivation
### The pair amplitudes of the two-mode squeeze

We want the amplitudes of $|\Psi\rangle = U|0\rangle|0\rangle$, with $U = e^{rK}$ and $K = a^\dagger b^\dagger - ab$.
Since $K^\dagger = -K$, $U$ is unitary, as $S$ was. The series of section 8.2, $e^XFe^{-X} = F + [X, F] + \dots$, with
$X = rK$, gives

$$UaU^\dagger = a + r[K, a] + \frac{r^2}{2!}[K, [K, a]] + \dots .$$

From $[a, a^\dagger] = [b, b^\dagger] = 1$, and since the operators of different modes commute, $[K, a] = -b^\dagger$
and $[K, b^\dagger] = -a$, so the terms alternate between $a$ and $-b^\dagger$ and sum to

$$UaU^\dagger = a\cosh r - b^\dagger\sinh r .$$

The vacuum has $a|0\rangle|0\rangle = 0$, so $UaU^\dagger$ gives zero on $|\Psi\rangle$, and
$a|\Psi\rangle = \tanh r\;b^\dagger|\Psi\rangle$; the same steps with $a$ and $b$ exchanged give $b|\Psi\rangle =
\tanh r\;a^\dagger|\Psi\rangle$. We write $|\Psi\rangle = \sum c_{nn'}|n\rangle|n'\rangle$ and use $a|n\rangle = \sqrt
n\,|n - 1\rangle$ and $b^\dagger|n'\rangle = \sqrt{n' + 1}\,|n' + 1\rangle$ (section 8.3). Matching the amplitudes of
$|n - 1\rangle|n'\rangle$ on the two sides,

$$\sqrt n\,c_{nn'} = \tanh r\,\sqrt{n'}\,c_{n-1,\,n'-1} ,$$

with the right side zero when $n' = 0$. So $c_{n0} = 0$ for every $n \ge 1$, and by the exchanged equation $c_{0n'} =
0$ for every $n' \ge 1$. Stepping both counts down together carries any $c_{nn'}$ with $n \ne n'$ to one of these, so
only $c_{nn}$ survive, with $c_{nn} = \tanh r\,c_{n-1,\,n-1}$, hence $c_{nn} = \tanh^nr\,c_{00}$. A length of one gives
$|c_{00}|^2\cosh^2r = 1$, so $c_{00} = 1/\cosh r$ with its phase chosen real, and $c_n = \tanh^nr/\cosh r$.
:::

**Each mode alone is thermal.** The table of amplitudes is $C = \mathrm{diag}(c_0, c_1, \dots)$, so the reduced state
of section 8.4 is $\varrho_1 = CC^\dagger = \sum_nc_n^2\,|n\rangle\langle n|$, a mixture of the levels with $P(n) =
c_n^2$. With $y = \tanh^2r$ and the sum $\sum_nn\,y^n = y/(1 - y)^2$ of section 8.3, the mean count is $\bar n =
\sum_nn\,c_n^2 = \tanh^2r\cosh^2r = \sinh^2r$. Then $1 + \bar n = \cosh^2r$ and $\bar n/(1 + \bar n) = \tanh^2r$, so
$P(n)$ is the thermal law, and each mode alone has $g^{(2)} = 2$.

**Together they are not.** In every term of $|\Psi\rangle$ both counts equal $n$, so $\langle n_1n_2\rangle$ is
$\langle n^2\rangle = 2\bar n^2 + \bar n$ over the thermal law, and

$$\boxed{g^{(2)}_{12} = 2 + \frac{1}{\bar n}} .$$

The classical bound for two beams that are each thermal is $\sqrt{2\times2} = 2$, so the pair beats it by $1/\bar
n$. Two classical beams can at best carry the same intensity, and even then each detector clicks at random on
its own, so their counts differ; here the two counts are always equal.[^pairs] **Numbers.** At $r = 0.5$, $\bar n =
0.27$ and $g^{(2)}_{12} = 5.68$; at $\bar n = 1$ it is 3. **A limit.** When $\bar n \gg 1$ the excess vanishes, and the
pair looks like one thermal beam split in two.

Inflation would have made gravitons in such pairs of opposite momentum [@GrishchukSidorov1990], because its expanding
background is the same everywhere and so makes quanta with zero total momentum.

**Why a changing background makes pairs.** Take first one oscillator of mass $\matter m$ in its ground state at the
angular frequency $\omega_1$, with the spreads $\sigma_x^2 = \hbar/2\matter m\omega_1$ and $\sigma_p^2 = \hbar\matter
m\omega_1/2$ of section 8.3, and let **its frequency jump suddenly to $\omega_2$**, so that the state has no time to
change. Against the new zero point, $x_{\rm zp}^2 = \hbar/2\matter m\omega_2$, its spreads are

$$\frac{\sigma_x^2}{x_{\rm zp}^2} = \frac{\omega_2}{\omega_1}, \qquad \frac{\sigma_{p/\matter m\omega_2}^2}{x_{\rm zp}^2} = \frac{\omega_1}{\omega_2} .$$

Its wave function is still a bell with no chirp, so it is the squeezed vacuum of the new oscillator with $e^{2r} =
\omega_1/\omega_2$, and it holds $\bar n = \sinh^2r = (\omega_1 - \omega_2)^2/4\omega_1\omega_2$ quanta, in pairs.
Halving the frequency gives $\bar n = \tfrac18$; a change slow compared with a period makes almost none, which we
state. A field has, for each wavevector $\vect k$, a wave travelling along $\vect k$ and one along $-\vect k$, with the
lowering operators $a$ and $b$, and two standing waves, $\cos\vect k\cdot\vect x$ and $\sin\vect k\cdot\vect x$, with
$c = (a + b)/\sqrt2$ and $d = -i(a - b)/\sqrt2$. A background that is the same everywhere changes the frequencies of
both standing waves alike and squeezes both by the same $r$. Multiplying out, $c^2 + d^2 = 2ab$ and $c^{\dagger2} +
d^{\dagger2} = 2a^\dagger b^\dagger$, so the two squeezes together are

$$\exp\bigl[\tfrac r2\bigl(c^2 - c^{\dagger2} + d^2 - d^{\dagger2}\bigr)\bigr] = e^{-r(a^\dagger b^\dagger - ab)} ,$$

the two-mode squeeze of the travelling waves, with $-r$ for $r$, which changes only the signs of the $c_n$. The
quanta along $\vect k$ and $-\vect k$ are made together. Grishchuk and Sidorov (1990) carried this through for the
gravitons of an expanding universe. Two counting pixels looking in opposite
directions could then tell a sky born in inflation from one born hot, whose opposite directions are independent and give
$g^{(2)}_{12} = 1$. With $M$ modes per pixel and window the excess shrinks to $1/M\bar n$ (the last problem below).
Intensity interferometry of primordial gravitons has been proposed for this [@KannoSoda2019].

::: try {#click-trains}
Clicks from a steady, a thermal or a pair source, at a mean count per window that you set, as in Figure
[](#fig:click-trains), with the histogram of counts under the Poisson and geometric laws and the measured $\bar n$,
variance and $g^{(2)}$ beside the two classical bounds.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, run the
thermal source at a mean of 10 and say why its histogram falls as a straight line on the logarithmic axis.
:::

## Counting adds no noise but needs quanta

An ideal counter adds no noise of its own: a mode in its ground state gives $P(0) = 1$ and never clicks, whereas a
device that records both quadratures of a mode must add at least half a quantum (section 8.6). Counting pays with the
phase instead: the coherent state's $P(n)$ depends on $|\alpha|$ alone, not on the angle of $\alpha$.

Counting does need quanta. An image of the Earth's thermal glow that holds 35,619 counted gravitons has a Poisson
spread of $\sqrt{35{,}619} = 189$, a relative error of 0.53%.[^earth] The counts are Poisson although the glow is
thermal, because each mode of matter's thermal glow holds $10^{-30}$ gravitons or fewer on average, and at $\bar n =
10^{-30}$ the wave term $\bar n^2$ of the thermal variance is $10^{-30}$ times the clicks' term $\bar n$. A detector
watching one such mode clicks once in about $10^{30}$ windows of one coherence time, about $3\times10^{-14}$ s at room
temperature (section 5.3), so it waits about $3\times10^{16}$ s, a billion years, for each click.

A primordial graviton background, if it exists, has a temperature of 0.905 K, derived in section
[12.2](/tutorial/sky/universe/#gravitons-parted-first-and-kept-a-colder-share-of-the-heat).[^background] Its gravitons
left equilibrium near the Planck temperature and have kept a black-body spectrum since, so the occupation
$\bar n = 1/(e^{\hbar\omega/\kB T} - 1)$ of section 8.3 still holds. At 10 GHz, a wavelength of 3 cm, $\bar n = 1.43$;
at 100 GHz, $\bar n = 5.0\times10^{-3}$. Such a sky's pairs of clicks are common only at centimetre wavelengths.

**The idea to keep: how quanta arrive together says what made them. A steady source gives independent clicks,
$g^{(2)} = 1$; a hot one bunches them, $g^{(2)} = 2$; and pairs made together, as inflation would make gravitons,
coincide in two directions by $2 + 1/\bar n$, more than any two classical waves with thermal statistics can.**

::: problems
### Practice

**[8.5]** For a thermal mode with $\bar n = 0.1$, find $P(0)$, $P(1)$, $P(2)$ and $g^{(2)}$.

::: solution
The law $P(n) = 0.1^n/1.1^{n+1}$ gives $P(0) = 0.909$, $P(1) = 0.0826$ and $P(2) = 0.0075$, each $1/11$ of the one
before, and $g^{(2)} = 2$, as for every thermal mode.
:::

**[8.5]** What is the variance of the count of a coherent mode holding 9 quanta on average, and of a thermal one?

::: solution
It is 9 for the coherent mode and $9 + 81 = 90$ for the thermal one.
:::

**[8.5]** An oscillator's frequency drops suddenly to a third of its value. How many quanta does its former ground
state hold, and with what probability does a two-mode squeeze of the same $r$ leave both of its modes empty?

::: solution
$\bar n = (\omega_1 - \omega_2)^2/4\omega_1\omega_2 = (3 - 1)^2/12 = \tfrac13$, so $\sinh^2r = \tfrac13$ and $\cosh^2r =
\tfrac43$. Both modes are empty with the probability $c_0^2 = 1/\cosh^2r = 0.75$.
:::

### Stretch

**[8.5]** Show that the two-mode squeezed state is unchanged by $a^\dagger a - b^\dagger b$, the difference of the two
counts, and say what this means for inflation's gravitons.

::: solution
Every term $|n\rangle|n\rangle$ has equal counts, so $(a^\dagger a - b^\dagger b)|\Psi\rangle = 0$. In the box, this
follows from $[K, a^\dagger a - b^\dagger b] = 0$: $K$ makes or removes one quantum in each mode at once. For inflation's
gravitons the counts along $\vect k$ and $-\vect k$ are always equal, so their momenta sum to zero, as the uniform
background requires.
:::

**[8.5]** Two independent coherent sources, each giving the mean count $\bar n$ alone, fall on one detector with a
relative phase $\phi$ that drifts at random, uniformly over a turn and slowly compared with a window. Show that the
counts are no longer Poisson, and find $g^{(2)}$.

::: solution
The amplitudes add, so a window's mean count is $\lambda = \bar n|1 + e^{i\phi}|^2 = 2\bar n(1 + \cos\phi)$, which
changes as $\phi$ drifts, and by [](#eq:two-noises) the variance exceeds the mean. With $\langle\cos\phi\rangle = 0$
and $\langle\cos^2\phi\rangle = \tfrac12$, $g^{(2)} = \langle(1 + \cos\phi)^2\rangle/\langle1 + \cos\phi\rangle^2 =
\tfrac32$, and the variance is $2\bar n + 2\bar n^2$.
:::

### The camera

**[8.5]** A pixel and window hold $M$ independent pairs of modes, each mode holding $\bar n$ on average. Detector 1
counts one mode of every pair and detector 2 the other. Find $g^{(2)}_{11}$ and $g^{(2)}_{12}$.

::: solution
Detector 1 counts $n_1 = \sum_kn_k$, and detector 2 the same $n_k$. With $\langle n_k^2\rangle = 2\bar n^2 + \bar n$ and
$\langle n_kn_l\rangle = \bar n^2$ for $k \ne l$, $\langle n_1n_2\rangle = M(2\bar n^2 + \bar n) + M(M - 1)\bar n^2$, so
$g^{(2)}_{12} = 1 + (1 + 1/\bar n)/M$. Subtracting $M\bar n$ gives $g^{(2)}_{11} = 1 + 1/M$, the bound, which the pair
beats by $1/M\bar n$.
:::
:::

::: paper
- Section XI's [*Counting coincidences*](/paper/#par:counting-coincidences): $g^{(2)} = 1$, 2 and $2 + 1/\bar n$, and
  inflation's pairs.
- Section IX's [simulated thermal Earth](/paper/#fig:earth-inverted): 35,619 gravitons with Poisson errors.
- Section IX's [*Counting or recording*](/paper/#par:counting-or-recording): $10^{-30}$ gravitons or fewer per mode, and
  counting that avoids the noise but loses the phase (section 8.6).
- Section XI's [*A primordial graviton background*](/paper/#par:a-primordial-graviton-background) and the paper's
  [](/paper/#eq:graviton-temperature): the 0.905 K sky, about one graviton per mode at 10 GHz.
:::

::: deeper
- R. Loudon, *The Quantum Theory of Light* (3rd ed., Oxford, 2000), chapters 3, 5 and 6.
- L. P. Grishchuk and Y. V. Sidorov [@GrishchukSidorov1990] and S. Kanno and J. Soda [@KannoSoda2019]: squeezed
  primordial gravitons, and how to detect them by their coincidences.
:::

[^n]: The count $n$ and its mean $\bar n$ are the $N$ and $\lambda$ of section 3.1; $n$ is not a refractive index.

[^I]: Only ratios of intensities enter, so the constant of proportion never matters.

[^fourth]: Integrating by parts, $\int x^4e^{-x^2/2s^2}\,\dd x = 3s^2\int x^2e^{-x^2/2s^2}\,\dd x$, so $\langle X^4\rangle
    = 3s^4$.

[^glauber]: R. J. Glauber, *Physical Review* 131, 2766 (1963). To check it, average the Poisson law over
    $\lambda = |\alpha|^2$, which is exponential with the mean $\bar n$: the integral gives the geometric law.

[^pairs]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, which states that such pairs coincide
    more than any two classical fields of thermal statistics allow.

[^earth]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IX, in its simulated image of the Earth
    ([](/paper/#fig:earth-inverted)).

[^background]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, as its equation
    [](/paper/#eq:graviton-temperature).
