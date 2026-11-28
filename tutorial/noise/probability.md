---
id: '3.1'
title: 'The probability we use: Gaussian, Poisson, covariance, the square-root law'
question: 'The best laboratory gradiometer sees the person one metre away with a signal-to-noise ratio of about five hundred after one second. How long must it watch to reach a thousand, or a million?'
part: '3'
requires: ['1.1', '1.4']
paper: [sec:pixel, sec:near-field, tab:resolution, sec:first-image, tab:budget, app:benchmarks]
figures: []
live: [averaging-noise, graviton-count]
depth: A
---

A person of 70 kg stands one metre from a gravity gradiometer, an instrument that measures the tide, the change of
gravity from one point to the next. Section [1.4](/tutorial/newton/tides/#on-the-ground-the-earths-own-tide-is-far-larger-but-steady) found the person's tide there: a stretch of
$9.34\times10^{-9}\unit{s^{-2}}$, or 9.34 eötvös, where one eötvös (E) is $10^{-9}\unit{s^{-2}}$. The best laboratory
gradiometer, reading for one second, has a noise of 0.02 E, a signal-to-noise ratio of five hundred on that
person.[^premise] The blur law of section [3.7](/tutorial/noise/blur-law/#step-1-one-number-measures-the-camera) asks for ratios from a thousand to $10^{60}$.
How long must the same instrument watch to reach a thousand, or a million?

The answer rests on one fact about random numbers: independent errors add in their squares. Figure [](#fig:average)
shows what that means for the gradiometer.

![Histograms of 10,000 simulated one-second readings of the person's tide (grey) and of 10,000 averages of four
such readings (outline). The orange line is the signal $x_0 = 9.34\unit{E}$; the blue lines under the axis reach one
standard deviation of the noise on either side of it, 0.020 E for one second and 0.010 E for four. Averaging four
readings halves the spread; it does not quarter it.](tut-prob-average){#fig:average}

::: plain
Every instrument has noise: its reading wobbles at random even when there is nothing to measure. The typical size
of the wobble is the standard deviation, and a signal's signal-to-noise ratio is how many times larger than that it is.

Averaging helps, but slowly. When four readings with independent errors are averaged, some errors push up and some
push down, so the noise falls by half, not by four: it falls as the square root of the number of readings. To be a
thousand times more sensitive, you must watch a million times as long. A count of rare events, such as gravitons,
varies by about its own square root.
:::

## A reading is a signal plus a random number

A **random variable** is a quantity whose value is drawn anew each time it is measured, such as the reading of an
instrument. A continuous random variable $x$ has a **probability density** $p(x)$ (in the reciprocal of the unit of
$x$): the probability that $x$ falls between $x$ and $x + \dd x$ is $p(x)\,\dd x$, and $\int p(x)\,\dd x = 1$.

The **mean** of $x$ is its average over many draws,

$$\sym{mean-value}{\langle x\rangle} = \int x\,p(x)\,\dd x .$$

We write means with angle brackets, since the $E[x]$ of many books would collide with the tidal tensor $\curv{\tE}$
and the eötvös. The mean of a sum is the sum of the means, and constants come out of the brackets:
$\langle 3x + 2\rangle = 3\langle x\rangle + 2$. The mean $\langle x\rangle$ is itself a constant, so
$\langle\langle x\rangle x\rangle = \langle x\rangle^2$.

The **variance**, in the square of the unit of $x$, is the mean square of the departure from the mean. Expanding the
square and taking the mean term by term gives a second form:

$$\begin{aligned}
\mathrm{Var}\,x &= \bigl\langle (x - \langle x\rangle)^2 \bigr\rangle
= \langle x^2\rangle - 2\langle x\rangle^2 + \langle x\rangle^2\\
&= \langle x^2\rangle - \langle x\rangle^2 .
\end{aligned}$$

The **standard deviation** $\sym{standard-deviation}{\sigma_x}$ is the square root of the variance, in the unit of $x$.
We prefer it to the mean size of the departure because variances add. A standard deviation is always
written $\sigma$ with a subscript naming its quantity; a bare $\matter{\sigma}$, in the colour of matter, is a surface
density ([section 1.3](/tutorial/newton/gauss-and-poisson/#a-uniform-sheet-pulls-equally-at-every-height)).

A reading of the gradiometer is a sum of two parts:

$$x = x_0 + n .$$

Here $x_0$ is the **signal**, the true value of the tide that the instrument measures, in eötvös. The **noise** $n$
is a random change in the reading, caused for example by heat and vibration. It has mean zero, so the mean reading is
the signal, and its standard deviation is $\sigma_n$. The **signal-to-noise ratio** is
$x_0/\sigma_n$, a pure number.[^snr]

**A number.** With $x_0 = 9.34\unit{E}$ and $\sigma_n = 0.02\unit{E}$ in one second,

$$\frac{x_0}{\sigma_n} = \frac{9.34}{0.02} = 467,$$

about five hundred, the precision of a length of 47 cm measured with a standard deviation of 1 mm.

A non-example: an offset that is the same in every reading is not noise but a **bias**, which averaging never
reduces. The Earth's own tide is a bias for a camera on the ground, 330 times the person's tide but
steady and well known, so the camera subtracts it
([section 1.4](/tutorial/newton/tides/#on-the-ground-the-earths-own-tide-is-far-larger-but-steady)).

## Most noise follows the Gaussian bell

The **Gaussian distribution** with mean $\langle x\rangle$ and standard deviation $\sigma_x$ has the density

$$p(x) = \frac{1}{\sqrt{2\pi}\,\sigma_x}\exp\!\left[-\frac{(x - \langle x\rangle)^2}{2\sigma_x^2}\right].$$

The factor in front makes the total probability one.[^area] With the standard variable $Z = (x - \langle x\rangle)/\sigma_x$, a Gaussian with mean 0 and standard
deviation 1, distances are in standard deviations. The **cumulative probability** is the probability that $Z$ falls below a number $x$:

$$P(Z < x) = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^{x} e^{-t^2/2}\,\dd t .$$

Many books write it $\Phi(x)$; here $\field{\Phi}$ is the potential.

A Gaussian reading lies within one standard deviation of its mean 68.3% of the time, within two 95.4%, and within
three 99.73%. The probability that it lies more than three standard deviations above its mean is[^erfc]

$$P(Z > 3) = 1.35\times10^{-3},$$

about one reading in 740 (Figure [](#fig:tails)).

![The standard Gaussian density, with the bands within one, two and three standard deviations of the mean shaded in
blue, the colour of the noise. The tail beyond $Z = 3$, of area $P(Z > 3) = 1.35\times10^{-3}$, is too thin to see at
this scale; it is filled in full blue drawn twenty times taller.](tut-prob-tails){#fig:tails}

These tails decide how often a camera is wrong. Gold lies in one of two safes 3.5 m away, at a signal-to-noise
ratio of 10 (the gold's largest tide against the noise averaged over a patch 3.5 m square). The real array is a metre
across and the two places of the gold give partly similar fields there, so the two expected sets of readings differ by
only 1.81 standard deviations of the noise. The camera picks the safe whose expected readings lie closer to what it
read, so it is wrong when the noise carries the readings more than halfway across: $P(Z > 0.905) = 0.18$, an error rate of 18%.[^safes] Section [3.3](/tutorial/noise/measuring-a-number/)
shows that this rule is the best one and computes the 1.81.

**Why noise is so often Gaussian.** Noise is usually the sum of many small, independent kicks, such as gas molecules
striking a test mass. The **central limit theorem** says that a sum of $N$ independent random numbers from one
distribution with a finite variance, less its mean and divided by its standard deviation, approaches the standard
Gaussian as $N$ grows, whatever that distribution. We state it without proof (see *Go deeper*).

A number drawn evenly between 0 and 1 has the mean $\tfrac12$ and the variance
$\int_0^1 x^2\,\dd x - \tfrac14 = \tfrac1{12}$. The table compares sums of such numbers with the
Gaussian, each measured in its own standard deviations.

| Sum of | within one standard deviation | beyond three, one side |
|---|---|---|
| 1 number | 57.7% | 0 |
| 2 numbers | 65.0% | 0 |
| 12 numbers | 67.9% | $1.0\times10^{-3}$ |
| Gaussian | 68.3% | $1.35\times10^{-3}$ |

The middle is nearly Gaussian after a dozen terms; the far tail comes last.

## Averaging independent readings shrinks the noise as a square root

We want the noise of an average of $N$ readings, since watching longer means averaging more.

Two random variables $x$ and $y$ are **independent** when the value of one tells nothing about the other: their joint
density is $p(x, y) = p(x)\,p(y)$, so the double integral of $xy\,p(x,y)$ splits and
$\langle xy\rangle = \langle x\rangle\langle y\rangle$.

We assume that **the readings are independent**, that **they have the same standard deviation $\sigma_x$**, and
that **the signal does not change while we watch**. The departure of $x + y$ from its mean is the sum of the two
departures, so we square that sum and take the mean term by term,

$$\begin{aligned}
\mathrm{Var}(x + y) &= \bigl\langle\bigl[(x - \langle x\rangle) + (y - \langle y\rangle)\bigr]^2\bigr\rangle\\
&= \bigl\langle(x - \langle x\rangle)^2\bigr\rangle + \bigl\langle(y - \langle y\rangle)^2\bigr\rangle\\
&\quad + 2\bigl\langle(x - \langle x\rangle)(y - \langle y\rangle)\bigr\rangle\\
&= \mathrm{Var}\,x + \mathrm{Var}\,y + 2\bigl\langle(x - \langle x\rangle)(y - \langle y\rangle)\bigr\rangle .
\end{aligned}\label{eq:var-sum}$$

The last mean is the **covariance** of $x$ and $y$ (see [below](#covariance-describes-noise-that-two-readings-share)).
For independent variables it is the product of the means of $x - \langle x\rangle$ and $y - \langle y\rangle$, and
each of these is zero. So variances of independent variables add, and for $N$ readings

$$\mathrm{Var}\Bigl(\sum_{a=1}^{N} x_a\Bigr) = \sum_{a=1}^{N}\mathrm{Var}\,x_a = N\sigma_x^2 .$$

Multiplying a random variable by a constant multiplies its variance by the constant's square. The average
$\bar x = \frac1N\sum_a x_a$ is the sum times $1/N$, so its variance is $\sigma_x^2/N$, and

$$\boxed{\sigma_{\bar x} = \frac{\sigma_x}{\sqrt N}}.$$

This is the **square-root law**. For $N = 1$ it gives $\sigma_{\bar x} = \sigma_x$, as it must. The average keeps the
whole signal, while independent errors only partly cancel.

Reading for a time $\tau$ averages $\tau/(1\unit{s})$ one-second readings. If each second's noise is independent of
the others (white noise, made exact in section [3.2](/tutorial/noise/random-signals/)), the ratio grows as the square
root of the time,

$$\frac{x_0}{\sigma_n(\tau)} = 467\,\sqrt{\frac{\tau}{1\unit{s}}}, \label{eq:snr-time}$$

where $\sigma_n(\tau)$ is the noise of the average over the time $\tau$.

**Numbers.** Inverting [](#eq:snr-time), a ratio $R$ takes $\tau = (R/467)^2$ seconds.

- A ratio of a thousand takes $(1000/467)^2 = 4.6$ seconds.
- A ratio of a million takes $4.6\times10^6$ seconds, which is 53 days.
- A ratio of $10^{30}$, a row of the blur law's table, takes $4.6\times10^{54}$ seconds. The universe is
  $4.35\times10^{17}$ seconds old, so this is $10^{37}$ times its age.

So a thousand takes 4.6 seconds and a million takes 53 days: a thousand times the sensitivity costs a million times
the observing time.

::: try {#averaging-noise}
Predict first: how many readings must be averaged to halve the noise? And with a noise of 30 E on each reading, which
hides the person's step of 9.34 E, at about how many readings will the step show? Drag $N$ from 1 to 4: the band of
one standard deviation narrows from 30 E to 15 E, by half and not by a quarter. At about 10 readings the band, 9.5 E,
is as wide as the step, and the step stands out of the noise each time the person comes near.
:::

Watching for the age of the universe, this gradiometer would reach $467\times\sqrt{4.35\times10^{17}} =
3\times10^{11}$. A perfect instrument could reach far more, if quantum mechanics limits how fast a camera can tell two
scenes apart to a rate set by its energy of interaction with the source, which is bounded because a camera too heavy
for its size would be a black hole. The generous estimate is about $10^{70}$ for a person watched for the age of the
universe, and about $10^{55}$ for a camera that pulls on the person no harder than the Earth does (section
8.6).[^limits] These sensitivities are a premise about what gravity allows, not a forecast.

## Covariance describes noise that two readings share

Two accelerometers bolted to one table both shake when the floor shakes, so their errors move together. The covariance of [](#eq:var-sum),

$$\mathrm{Cov}(x, y) = \bigl\langle(x - \langle x\rangle)(y - \langle y\rangle)\bigr\rangle ,$$

in the product of the two units, measures this. It is positive when the two tend to lie on the same side of their
means, and negative when on opposite sides. Divided by both standard deviations it becomes the
**correlation**, $r_{xy} = \mathrm{Cov}(x, y)/(\sigma_x\sigma_y)$, a pure number between $-1$ and $1$ (here $r$ is not
a distance).

For readings $x_1, \dots, x_N$ the covariances form the **covariance matrix**

$$\sym{covariance-matrix}{C_{ab}} = \mathrm{Cov}(x_a, x_b),$$

a symmetric $N\times N$ table whose diagonal holds the variances. For a weighted sum $y = w_ax_a$ with fixed weights
(the repeated index summed, as in section
[1.1](/tutorial/newton/vectors-and-indices/#an-index-stands-for-all-three-directions), over the $N$ readings), the
departure from the mean is $w_a(x_a - \langle x_a\rangle)$; we square it, with index $b$ on the second factor, and
take the mean:

$$\begin{aligned}
\mathrm{Var}\,y &= \bigl\langle w_a(x_a - \langle x_a\rangle)\,w_b(x_b - \langle x_b\rangle)\bigr\rangle\\
&= w_a\,w_b\,\bigl\langle(x_a - \langle x_a\rangle)(x_b - \langle x_b\rangle)\bigr\rangle\\
&= w_a\,C_{ab}\,w_b .
\end{aligned}\label{eq:var-weighted}$$

The difference of two readings has the weights $(1, -1)$, so

$$\mathrm{Var}(x - y) = \sigma_x^2 + \sigma_y^2 - 2\,\mathrm{Cov}(x, y). \label{eq:var-diff}$$

**A gradiometer removes what its two halves share.** Many gradiometers are two accelerometers a short distance apart,
read against each other. An accelerometer reads the force per unit mass that holds a small test mass in place inside
its case, so it responds both to gravity and to the shaking of the case. Each reading, in $\mathrm{m\,s^{-2}}$, has
three parts: the field at its own place, $g_1$ or $g_2$, along the line between the two; the acceleration $u$ of the
shaking table; and its own noise:

$$a_1 = g_1 + u + n_1, \qquad a_2 = g_2 + u + n_2 .$$

The own noises ($\sigma_{n_1}$, $\sigma_{n_2}$) are independent of each other and of the shaking ($\sigma_u$). Then $\mathrm{Var}\,a_1 = \sigma_u^2 + \sigma_{n_1}^2$,
$\mathrm{Var}\,a_2 = \sigma_u^2 + \sigma_{n_2}^2$ and $\mathrm{Cov}(a_1, a_2) = \sigma_u^2$, so [](#eq:var-diff) gives

$$\mathrm{Var}(a_1 - a_2) = \sigma_{n_1}^2 + \sigma_{n_2}^2 .$$

In this ideal model the shaking cancels exactly, however large it was; a real instrument cancels it only as well as its
two halves match. If the table also turns, the halves sit at different distances from the
axis, and their difference keeps the pseudo-tide of section
[1.6](/tutorial/newton/motion/#a-turning-pixel-feels-a-pseudo-tide); a superconducting
gradiometer adds angular accelerometers to measure the turning and remove it. The ideal model shows the principle.

The signal survives, because $g_1 - g_2$ is the tide times the distance between the accelerometers. The
Earth's pull cancels too, apart from its tide. The person's tide across 10 cm is
$9.3\times10^{-10}\unit{m\,s^{-2}}$, ten billion times smaller than the $9.8\unit{m\,s^{-2}}$ that each accelerometer
feels, and only the difference can find it (Figure [](#fig:shared)).

![Two accelerometers on one table share a large shaking, so their readings $a_1$ and $a_2$ move together, and plotted
against each other (right) they lie close to a line, with the correlation $r = 0.98$. Their difference keeps only the
two own noises (the blue band, one standard deviation wide on either side) about the steady signal $g_1 - g_2$ in
orange; the dashed line under it is zero. The units are arbitrary, and the sizes are chosen so that all three can be seen.](tut-prob-shared){#fig:shared}

**Zero covariance does not mean independence.** Let $x$ be Gaussian with mean zero and let $y = x^2$. Then $y$ is fixed by $x$, yet

$$\mathrm{Cov}(x, y) = \langle x^3\rangle - \langle x\rangle\langle x^2\rangle = 0 ,$$

because a distribution symmetric about zero has $\langle x\rangle = \langle x^3\rangle = 0$. Covariance measures only
how two quantities move together along a straight line. Readings with zero covariance are **uncorrelated**, and may
still depend on each other; the square-root law needs only zero covariance.

## Rare events are counted with the Poisson distribution

Some measurements count random arrivals: photons on a detector (the shot noise of section 3.2), or gravitons
([section 0.3](/tutorial/evening/waves-and-heat/)). The reading is then a count $N$, a whole number, not an average of
readings that we chose.

We want the probability of each count, assuming that **arrivals are independent of one another** and that **they
come at a steady mean rate**. Let $\sym{poisson-mean}{\lambda}$ be the mean count in the exposure, a pure number equal
to the rate times the exposure (and, for gravitons, times the area). Here $\lambda$ is not a wavelength.

Divide the exposure into intervals so short that each holds at most one arrival, with a small probability $p$. There
are $\lambda/p$ of them, since together they hold $\lambda$ arrivals on average. They are independent, so the
probability of $N$ arrivals is the number of ways to choose the $N$ intervals that hold them,
$(\lambda/p)(\lambda/p - 1)\cdots(\lambda/p - N + 1)/N!$, times the probability $p^N(1 - p)^{\lambda/p - N}$ of each
such pattern. We move one factor $p$ into each term of the product:

$$\begin{aligned}
P(N) &= \frac{1}{N!}\,\frac{\lambda}{p}\Bigl(\frac{\lambda}{p} - 1\Bigr)\cdots\Bigl(\frac{\lambda}{p} - N + 1\Bigr)\\
&\quad\times p^N\,(1 - p)^{\lambda/p - N}\\
&= \frac{\lambda(\lambda - p)\cdots\bigl(\lambda - (N - 1)p\bigr)}{N!}\\
&\quad\times\bigl[(1 - p)^{1/p}\bigr]^{\lambda}\,(1 - p)^{-N}.
\end{aligned}$$

As $p$ shrinks with $N$ fixed, the numerator tends to $\lambda^N$, the bracket to $e^{-1}$, and $(1 - p)^{-N}$ to 1.
What remains is the **Poisson distribution**,

$$\boxed{P(N) = \frac{\lambda^N e^{-\lambda}}{N!}}.$$

The probabilities add to one, because $\sum_N \lambda^N/N! = e^{\lambda}$. For the mean, the term $N = 0$ is zero, and
$N/N! = 1/(N - 1)!$ for the others:

$$\begin{aligned}
\langle N\rangle &= \sum_{N\ge1}\frac{\lambda^N e^{-\lambda}}{(N-1)!}\\
&= \lambda\sum_{N\ge1}\frac{\lambda^{N-1}e^{-\lambda}}{(N-1)!} = \lambda .
\end{aligned}$$

With $N' = N - 1$, the last sum is the sum of all the probabilities, one. The variance needs
$\langle N^2\rangle = \langle N(N-1)\rangle + \langle N\rangle$, and $N(N - 1)$ cancels against $N!$ in the same way.
With $N'' = N - 2$,

$$\langle N(N-1)\rangle = \lambda^2\sum_{N\ge2}\frac{\lambda^{N-2}e^{-\lambda}}{(N-2)!} = \lambda^2 .$$

So $\langle N^2\rangle = \lambda^2 + \lambda$, and the variance is $\langle N^2\rangle - \langle N\rangle^2 = \lambda$:

$$\boxed{\sigma_N = \sqrt{\lambda}}.$$

Adding variances gives the same answer: each short interval has variance $p - p^2$, and the $\lambda/p$ intervals add
to $\lambda(1 - p)$, which tends to $\lambda$. The spread $\sqrt\lambda$ is **counting noise**: a count of 100 varies
by about 10, or 10%.

**How many counts a picture needs.** Suppose one part of a picture is brighter than another by a fraction $\epsilon$
(a contrast). For the extra counts, $\epsilon N$, to stand $k$ standard deviations above the counting noise
$\sqrt N$, we need $\epsilon N = k\sqrt N$, so

$$N \approx \frac{k^2}{\epsilon^2}.$$

A contrast of 10% at three standard deviations needs $(3/0.1)^2 = 900$ counts in each part. At five it needs
$(5/0.1)^2 = 2500$, the rule we use for a **picture element** in the graviton budget.[^two-parts] So the
[35,000 gravitons](/tutorial/evening/waves-and-heat/#a-first-image-the-sun-at-midnight-and-how-few-gravitons-arrive)
that the Earth sends to a square metre in a lifetime give 14 elements.

**A limit.** For a large mean the count is nearly Gaussian: cut the exposure into $\lambda$ pieces (take $\lambda$
whole), each with a mean count of 1. The count is a sum of $\lambda$ independent counts, each with mean 1 and variance 1, so as $\lambda$ grows the
central limit theorem makes it nearly Gaussian, with mean $\lambda$ and standard deviation $\sqrt\lambda$.

At $\lambda = 50$ the chance of exactly 50 is $P(50) = 0.0563$, which matches the Gaussian's peak density times one
unit, $1/\sqrt{2\pi\times50} = 0.0564$. At $\lambda = 2$ the distribution is lopsided (0.135 for 0, and 0.271 each
for 1 and 2), because a count cannot be negative (Figure [](#fig:poisson)).

![The Poisson probabilities of a count $N$ (grey bars) for $\lambda = 2$ and $\lambda = 50$, each with the Gaussian of
mean $\lambda$ and standard deviation $\sqrt\lambda$ drawn over it. For $\lambda = 2$ the curve spills below zero,
where no count can lie; for $\lambda = 50$ it runs nearly through the bars' tops. The orange line marks the mean, and
the blue line under each axis reaches one standard deviation of the counting noise on either side of it.](tut-prob-poisson){#fig:poisson}

::: try {#graviton-count}
Predict first: the figure opens on a year of the Earth below, with $\lambda = 438$ gravitons expected on one square
metre (the figure writes the mean as $\mu$). Of ten draws, how many will lie within 21, the square root of 438, of the
mean? Press *New draw* ten times and read the year's whole count. About seven should, because so large a count is
nearly Gaussian. Then choose a lifetime, the third tick: the spread grows to 187 gravitons but falls from 4.8% to
0.53% of the count.
:::

**The idea to keep: independent noise adds in variance, so averaging $N$ readings shrinks it by $\sqrt N$. A thousand
times the sensitivity costs a million times the observing time.**

::: problems
### Practice

**[3.1]** The gradiometer of the opening reads for 100 seconds. What is its signal-to-noise ratio on the person?

::: solution
$467\times\sqrt{100} = 4670$; the noise is $0.002\unit{E}$.
:::

**[3.1]** Why does averaging $N$ independent readings shrink the noise by $\sqrt N$ and not by $N$?

::: solution
The sum has noise $\sqrt N\,\sigma_x$ while its signal grows as $N$; dividing by $N$ leaves $\sigma_x/\sqrt N$.
:::

**[3.1]** An atom gradiometer carried over a buried tunnel reaches a noise of 20 E in ten minutes. If its noise is
white, how long must it watch to see the person of the opening at a signal-to-noise ratio of one?

::: solution
The noise must fall from 20 E to 9.34 E, a factor of $20/9.34 = 2.14$. The time must grow by the square of that
factor, $2.14^2 = 4.58$, so $\tau = 600\times4.58 = 2750\unit{s}$, about 46 minutes.
:::

### Stretch

Two accelerometers have the same noise $\sigma_n$, and the correlation between their noises is $r$. Find the noise of
their difference, and the value of $r$ at which it vanishes. Then take independent noises of $10^{-9}\unit{m\,s^{-2}}$ in one second (near the best accelerometers on the ground),
with the halves on the line to the person, 0.95 m and 1.05 m away. What is the signal-to-noise ratio in a second, and
in a minute?

::: solution
With $\sigma_x = \sigma_y = \sigma_n$ and $\mathrm{Cov} = r\sigma_n^2$, equation [](#eq:var-diff) gives $\mathrm{Var} =
2\sigma_n^2(1 - r)$, so the noise is $\sigma_n\sqrt{2(1 - r)}$, which vanishes at $r = 1$. For $r = 0$ it is
$\sqrt2\,\sigma_n = 1.41\times10^{-9}\unit{m\,s^{-2}}$. Divided by the 0.1 m between the halves, this is a gradiometer
of 14 E in a second, 700 times the 0.02 E of the opening. The signal is the tide times the separation,
$9.34\times10^{-9}\times0.1 = 9.3\times10^{-10}\unit{m\,s^{-2}}$, so the ratio is 0.66 in a second and
$0.66\times\sqrt{60} = 5.1$ in a minute.
:::

### The camera

A gradiometer with a noise of 0.02 E in a second has a ratio of about five hundred on the person. To what fraction of
itself must the Earth's own tide then be known, to be subtracted to within the noise?

::: solution
The ratio is $9.34/0.02 = 467$. The Earth's tide on the ground, $3.08\times10^{-6}\unit{s^{-2}}$ (section 1.4), is
$3.08\times10^{-6}/9.34\times10^{-9} = 330$ times the person's. It is a bias, which averaging does not remove, so what
is left after subtraction must be below 0.02 E: $2\times10^{-11}/3.08\times10^{-6} = 6.5\times10^{-6}$ of the Earth's
tide, one part in 150,000.
:::
:::

::: paper
- [*What the premise asks*](/paper/#par:what-the-premise-asks) (Section II) gives the ratio of five hundred.
- [*A worked case*](/paper/#par:a-worked-case) (Section IV) gives the locked safe's error rates.
- [*Limits on sensitivity*](/paper/#par:limits-on-sensitivity) (Section IV) and its [table](/paper/#tab:resolution)
  reach $10^{60}$.
- [*The graviton budget*](/paper/#par:the-graviton-budget) (Section IX) counts 2500 gravitons to a picture element.
- [Appendix A](/paper/#app:benchmarks) writes $\sigma$ for one pixel's noise, here $\sigma_n$.
:::

::: deeper
- J. K. Blitzstein and J. Hwang, *Introduction to Probability* (2nd edition, 2019), proves the central limit theorem.
- J. R. Taylor, *An Introduction to Error Analysis* (2nd edition, 1997), treats the square-root law and covariance.
- The [GR course, section 22.7](https://neovand.github.io/general-relativity/chapter-22.html#probability-temperature-and-entropy)
  goes from probability to temperature and entropy.
:::

[^premise]: The 0.02 E figure and the five hundred first appear in *The gravitational camera* (Mohsenvand 2026), Sec. II.
    The paper's table of the blur, from a thousand to $10^{60}$, is in Sec. IV.

[^snr]: The signal-to-noise ratio of the blur law fixes two choices: the signal is the largest tide of a point mass,
    and the noise is averaged over a patch as wide as the mass is deep
    ([section 3.7](/tutorial/noise/blur-law/#step-1-one-number-measures-the-camera)).

[^area]: The square of $\int e^{-t^2/2}\,\dd t$ over the line is $\iint e^{-(t^2+u^2)/2}\,\dd t\,\dd u$ over the
    plane, which in polar coordinates is $\int_0^{2\pi}\!\dd\varphi\int_0^\infty e^{-r^2/2}\,r\,\dd r = 2\pi$. So the
    integral is $\sqrt{2\pi}$, and $t = (x - \langle x\rangle)/\sigma_x$ gives the factor $\sqrt{2\pi}\,\sigma_x$.

[^erfc]: $P(Z > x) = \tfrac12\,\mathrm{erfc}(x/\sqrt2)$, where $\mathrm{erfc}$ is the complementary error function of
    calculators and programming languages.

[^safes]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its worked case of the two safes.

[^limits]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV.

[^two-parts]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IX. The rule takes the fainter part's
    mean as known; if both counts are measured, their difference has the variance $2N$, by [](#eq:var-diff) with zero
    covariance, and about twice as many counts are needed, so 2500 is good to a factor of two.
