---
id: '3.2'
title: 'Random signals: noise and its spectrum'
question: 'What does it mean that a gradiometer reads 0.02 E in a second, and how is the same thing said of an array whose noise is spread over a plane?'
part: '3'
requires: ['1.3', '1.5b', '3.1']
paper: [sec:near-field, eq:array-data, eq:wiener, eq:thermometer, eq:hole-noise, app:benchmarks]
figures: []
live: [noise-spectrum]
depth: A
---

The paper's paragraph [*How sharp*](/paper/#par:how-sharp) imagines a flat array of sensors that records the tide
"with white noise of spectral density $N_0$". It also guesses, before any data arrive, that the scene is a sheet of
independent point masses, "whose spectrum is $S_\sigma = m^2/z^2$". Chapter [3.7](/tutorial/noise/blur-law/) builds the
blur law on these two quantities. Chapter [3.1](/tutorial/noise/probability/) described one instrument more plainly:
the best laboratory gradiometer reads the tide to 0.02 eötvös (E) in a second, where $1\unit{E} =
10^{-9}\unit{s^{-2}}$. So this chapter asks what that phrase means exactly, and how the same thing is said of an array
whose noise is spread over a plane.

The answer is to describe noise by its spectrum: how the strength of the noise is shared among frequencies in time, or
among ripples across a plane. Figure [](#fig:white-noise) draws both for white noise, which has the same strength at
every frequency.

![Top, white noise in time, in arbitrary units: a record $n(t)$ over two seconds; its spectrum $S(\omega)$, the same at
every frequency, negative and positive, with the band from $-\omega$ to $\omega$ shaded; and its autocorrelation $C(t)$,
a single spike at zero lag of area $S(0)$. Bottom, the noise of an array of $11\times11$ pixels, each pixel's reading
drawn from one Gaussian (orange above zero, blue below), and beside it the mean of $|\tilde n(\vect k)|^2$, a column
on each wavevector of the array, the same on every one (16,000 simulated maps agree with it within 3%). The trace never
repeats, but its spectrum is flat, and the map's spectrum is flat across the plane in the same
way.](tut-noise-hero){#fig:white-noise}

::: plain
Noise can be split into steady oscillations of every frequency, slow and fast. Its spectrum says how strong each
frequency is on average. Noise with the same strength at every frequency is called white, as white light holds every
colour.

The average of white noise over a time $\tau$ has a spread that falls as $1/\sqrt\tau$: watching four times longer
halves it. "0.02 E in a second" names that rule by its value after one second.

The noise of an array of sensors varies across the plane. If it is white there too, its average over a patch of area
$A$ falls as $1/\sqrt A$. Even masses dropped at random places form a white noise of this kind, and the paper uses
that to describe what it expects to see before it looks.
:::

## A noisy record is a random function of time

A gradiometer that reads for a minute produces a record: one reading at every instant. Its noise
$\sym{noise-record}{n(t)}$ is then a function of time, in the unit of the reading ($\mathrm{s^{-2}}$ for a tide), and it
is a different function each time the experiment is repeated. A function whose values are drawn at random in this way is
a **random process**. At each instant the value $n(t)$ is a random variable in the sense of chapter
[3.1](/tutorial/noise/probability/#a-reading-is-a-signal-plus-a-random-number), and we take its mean to be zero.

A random process is described by how its values at two instants vary together. The noise is **stationary** when its
statistics do not change with time: the readings at 10:00 and at 10:01 vary together exactly as the readings at 15:00
and at 15:01 do. Then the covariance of two readings depends only on the lag $t$ between them. Since the means are
zero, the covariance is the mean of the product, and it defines the **autocorrelation**

$$\sym{autocorrelation}{C(t)} = \langle n(t_0 + t)\,n(t_0)\rangle = \langle n(t)\,n(0)\rangle ,$$

the same for every starting time $t_0$, in the square of the unit of $n$. At zero lag it is the variance,
$C(0) = \sigma_n^2$, where $\sigma_n$ is the standard deviation of one instantaneous reading. Stationarity also makes
$C$ even: starting the pair at $t_0 - t$ instead of $t_0$ shows that $C(-t) = C(t)$.

We use this quantity because it is the covariance matrix of chapter
[3.1](/tutorial/noise/probability/#covariance-describes-noise-that-two-readings-share) for a record with a reading at
every instant: the entry for the instants $t_a$ and $t_b$ is $C(t_a - t_b)$, so stationarity turns the whole table into
one function. It is measured by multiplying a long record by a copy of itself shifted by $t$ and averaging the product
along the record, which here gives the same result as averaging over repeated experiments.

The **correlation time** $\tau_c$ is the lag beyond which $C(t)$ is negligible, so that readings further apart than
$\tau_c$ are uncorrelated. For example, the noise of an instrument that responds sluggishly, over a time $\tau_c$, has
the autocorrelation

$$C(t) = \sigma_n^2\,e^{-|t|/\tau_c}. \label{eq:exp-corr}$$

A non-example is the noise of an instrument that is warming up. Its spread grows through the morning, so it is not
stationary, and no single function $C(t)$ describes it.

## The spectrum says how the noise is shared among frequencies

This chapter gives the minimum of Fourier analysis that it needs; chapter 2.6 develops it in full. One fact carries
everything:

$$\int e^{i\omega t}\,\dd t = 2\pi\,\delta(\omega). \label{eq:delta-sum}$$

To see why, integrate over a record of length $T$ only: $\int_{-T/2}^{T/2} e^{i\omega t}\,\dd t = 2\sin(\omega
T/2)/\omega$. This is a peak at $\omega = 0$ of height $T$ and width about $2\pi/T$, and its area over all $\omega$ is
$2\pi$ for every $T$.[^sinc] As $T$ grows, the peak narrows while its area stays fixed, and chapter
[1.3](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point) showed that this is what makes
a delta function. Unlike the positive spike of chapter 1.3, this peak has side lobes of both signs. When the peak
multiplies a smooth function inside an integral, the lobes swing faster and faster as $T$ grows, so their positive and
negative parts cancel, and only the central peak counts. The peak is even in $\omega$, so $\delta(-x) = \delta(x)$. The
finite record also tells us how to read $2\pi\delta(0)$ when it appears: it stands for $T$, the length of the record.

A record $n(t)$ is a sum of steady oscillations $e^{-i\omega t}$, each with its own complex amplitude
$\tilde n(\omega)$:

$$\begin{gathered}
\tilde n(\omega) = \int n(t)\,e^{i\omega t}\,\dd t,\\
n(t) = \int \tilde n(\omega)\,e^{-i\omega t}\,\frac{\dd\omega}{2\pi}.
\end{gathered} \label{eq:ft-time}$$

To check that the second line undoes the first, we put the first into the second and do the integral over $\omega$
first, using [](#eq:delta-sum) with $t$ and $\omega$ exchanged:

$$\int \tilde n(\omega)\,e^{-i\omega t}\,\frac{\dd\omega}{2\pi} = \int n(t')\,\delta(t' - t)\,\dd t' = n(t).$$

Here $\omega$ is the angular frequency, in radians per second, and $\tilde n(\omega)$ is in the unit of $n$ times a
second. Like a phasor of chapter
[1.5b](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number), $\tilde n(\omega)$ holds
the size and the phase of one oscillation, which turns as $e^{-i\omega t}$, the paper's convention. A real record has
$\tilde n(-\omega) = \tilde n^*(\omega)$: the negative frequencies are the mirror images that make the sum real. For a
record that never ends, the integral for $\tilde n(\omega)$ does not converge, because the noise never dies away. So
we work on a record of length $T$ and let $T$ grow only at the end.

We want one number for each frequency that says how strong the noise is there. Each $\tilde n(\omega)$ is random with
mean zero, so we look at the mean of a product. We assume only that **the noise is stationary**. Because $n$ is real,
$\tilde n^*(\omega') = \int n(t')\,e^{-i\omega't'}\,\dd t'$. We multiply the two transforms, take the mean inside
the integrals, and write $\langle n(t)\,n(t')\rangle = C(t - t')$, which stationarity allows:

$$\langle\tilde n(\omega)\,\tilde n^*(\omega')\rangle = \iint C(t - t')\,e^{i\omega t - i\omega' t'}\,\dd t\,\dd t' .$$

We change the variable $t$ to the lag $u = t - t'$, so that the exponent becomes $i\omega u + i(\omega - \omega')t'$,
and the double integral splits into two single ones:

$$\langle\tilde n(\omega)\,\tilde n^*(\omega')\rangle = \int C(u)\,e^{i\omega u}\,\dd u\int e^{i(\omega - \omega')t'}\,\dd t' .$$

The second integral is $2\pi\delta(\omega - \omega')$ by [](#eq:delta-sum). Naming the first $S(\omega)$, we have

$$\boxed{\begin{gathered}
\langle\tilde n(\omega)\,\tilde n^*(\omega')\rangle = 2\pi\,S(\omega)\,\delta(\omega - \omega'),\\
S(\omega) = \int C(t)\,e^{i\omega t}\,\dd t .
\end{gathered}}$$

The function $\sym{noise-spectrum}{S(\omega)}$ is the **power spectral density** of the noise, or its
spectrum.[^letters] The name comes from circuits: if $n$ is a voltage, $n^2$ is proportional to the power it delivers to
a resistor, and the spectrum spreads that power over frequency. For any other noise, "power" means the mean square. The
result says two things. Different frequencies are uncorrelated, because the delta function vanishes when $\omega' \neq
\omega$.[^mirror] And on a record of length $T$, the mean squared size of one oscillation is $\langle|\tilde
n(\omega)|^2\rangle = T\,S(\omega)$: it grows in proportion to the length of the record, and $S(\omega)$ is the growth
per unit time.

The second line of the box is a Fourier transform, and its inverse, by [](#eq:ft-time), is

$$C(t) = \int S(\omega)\,e^{-i\omega t}\,\frac{\dd\omega}{2\pi}. \label{eq:wk}$$

This is the **Wiener–Khinchin relation**: the autocorrelation and the spectrum are a Fourier pair. At zero lag it
gives

$$\sigma_n^2 = C(0) = \int S(\omega)\,\frac{\dd\omega}{2\pi}, \label{eq:variance-shared}$$

so the variance is shared among the frequencies, and the band from $\omega$ to $\omega + \dd\omega$ holds
$S(\omega)\,\dd\omega/2\pi$ of it. With $f = \omega/2\pi$ the frequency in hertz, $\dd\omega/2\pi = \dd f$, so the
spectrum is the variance per hertz. Its unit is the square of the unit of $n$ times a second. For a tide that is
$\mathrm{s^{-4}}\times\mathrm{s} = \mathrm{s^{-3}}$, so $\sqrt{S(\omega)}$ is in $\mathrm{s^{-2}\,Hz^{-1/2}}$, where
$\mathrm{Hz^{-1/2}} = \mathrm{s^{1/2}}$.

**One side or two.** Because $C$ is even, $S(\omega)$ is real and $S(-\omega) = S(\omega)$.[^even] The integral
[](#eq:variance-shared) runs over negative and positive $\omega$, so each physical oscillation is counted twice, once at
$\omega$ and once at $-\omega$. A spectrum defined in this way is **two-sided**, and the paper's equations use
two-sided spectra. Instrument makers and many books use instead the **one-sided** spectrum $S_1(f)$, defined on
positive frequencies only, which holds the whole variance there: $\sigma_n^2 = \int_0^\infty S_1(f)\,\dd f$. Since
$S(\omega)$ is even, [](#eq:variance-shared) can be folded onto positive frequencies,

$$\sigma_n^2 = \int_{-\infty}^{\infty} S(2\pi f)\,\dd f = \int_0^\infty 2S(2\pi f)\,\dd f ,$$

and comparing the two integrals gives

$$\boxed{S_1(f) = 2\,S(\omega), \qquad \omega = 2\pi f .}$$

A data sheet that quotes $\sqrt{S_1}$ gives a number $\sqrt2$ times larger than the two-sided $\sqrt{S(\omega)}$ of
the same instrument.

**An example and a non-example.** The sluggish noise of [](#eq:exp-corr) has the spectrum

$$\begin{aligned}
S(\omega) &= \sigma_n^2\int_{-\infty}^{\infty} e^{-|t|/\tau_c + i\omega t}\,\dd t\\
&= \sigma_n^2\left[\frac{1}{1/\tau_c - i\omega} + \frac{1}{1/\tau_c + i\omega}\right]\\
&= \frac{2\sigma_n^2\tau_c}{1 + \omega^2\tau_c^2},
\end{aligned}$$

where the two terms are the integrals over positive and negative $t$. As a check, [](#eq:variance-shared) gives back
$\sigma_n^2$, because $\int\dd x/(1 + x^2) = \pi$. The spectrum is flat, at the value $S(0) = 2\sigma_n^2\tau_c$, for
frequencies well below $1/\tau_c$, and it falls beyond. Noise whose spectrum is the same at every frequency is
**white noise**, named after white light, which holds every colour. Sluggish noise with $\tau_c = 1\unit{ms}$ is
nearly white below about 50 Hz, where its spectrum stays within a tenth of $S(0)$.

The non-example is **red noise**, named after the low-frequency end of the rainbow: noise whose spectrum grows without
limit toward zero frequency, so that its correlation time is longer than any observation. A slow drift is the common
case; a random walk has a spectrum that rises as $1/\omega^2$. Noise that is only strongest at low frequencies is not
red in this sense. Sluggish noise with $\tau_c$ of an hour piles its spectrum below
$1/\tau_c = 2.8\times10^{-4}\unit{rad\,s^{-1}}$, but $S(0)$ is finite, and the next section shows that it still
averages down over times much longer than an hour.

## The variance of white noise falls as one over the observing time

We want the variance of the average of the noise over an observing time $\tau$, because that is what an instrument
that reads for a time $\tau$ reports. We assume that **the noise is stationary** and that **it is white**: $S(\omega)
= S(0)$ at every frequency.

First, the autocorrelation. Putting the constant $S(0)$ into [](#eq:wk) and using [](#eq:delta-sum) with $t$ and
$\omega$ exchanged, and $\delta(-t) = \delta(t)$, gives

$$C(t) = S(0)\int e^{-i\omega t}\,\frac{\dd\omega}{2\pi} = S(0)\,\delta(t).$$

Readings at two different instants are uncorrelated, however close the instants are. The units agree, because
$\delta(t)$ is in $\mathrm{s^{-1}}$.

The average is $\bar n = \frac1\tau\int_0^\tau n(t)\,\dd t$. Its mean is zero, so its variance is the mean of its
square, which is a double integral of the autocorrelation:

$$\begin{aligned}
\mathrm{Var}\,\bar n &= \frac{1}{\tau^2}\int_0^\tau\!\!\int_0^\tau \langle n(t)\,n(t')\rangle\,\dd t\,\dd t'\\
&= \frac{S(0)}{\tau^2}\int_0^\tau\!\!\int_0^\tau \delta(t - t')\,\dd t\,\dd t' .
\end{aligned}$$

For each $t'$ between 0 and $\tau$, the integral over $t$ picks out the point $t = t'$, which lies inside the range,
and gives 1. The integral over $t'$ then gives $\tau$. So

$$\boxed{\mathrm{Var}\,\bar n = \frac{S(0)}{\tau}} . \label{eq:var-time}$$

The variance falls as $1/\tau$, so the noise after averaging, its standard deviation
$\sigma_n(\tau) = \sqrt{S(0)/\tau}$, falls as $1/\sqrt\tau$. This is the square-root law of chapter
[3.1](/tutorial/noise/probability/#averaging-independent-readings-shrinks-the-noise-as-a-square-root) with a
continuous clock: cut the time $\tau$ into $N$ uncorrelated pieces, and the square-root law divides each piece's
variance, $NS(0)/\tau$, by $N$.

**Only the low frequencies matter.** A real noise is not white at every frequency, so we redo the average for any
stationary noise. Putting the inverse transform [](#eq:ft-time) into $\bar n$ gives

$$\begin{gathered}
\bar n = \int\tilde n(\omega)\,W(\omega)\,\frac{\dd\omega}{2\pi},\\
W(\omega) = \frac1\tau\int_0^\tau e^{-i\omega t}\,\dd t = e^{-i\omega\tau/2}\,\frac{\sin(\omega\tau/2)}{\omega\tau/2}.
\end{gathered}$$

The mean of $\bar n\,\bar n^*$ then follows from the box of the last section, whose delta function removes one integral:

$$\mathrm{Var}\,\bar n = \int S(\omega)\left[\frac{\sin(\omega\tau/2)}{\omega\tau/2}\right]^2\frac{\dd\omega}{2\pi} .$$

The bracket is a window: it is 1 at $\omega = 0$, falls to zero at $\omega = 2\pi/\tau$, and stays small beyond, and its
area $\int[\dots]^2\,\dd\omega/2\pi$ is $1/\tau$.[^window] So if the spectrum is nearly flat over the window,
$\mathrm{Var}\,\bar n \approx S(0)/\tau$: an average over a time $\tau$ needs the spectrum to be flat only below about
$1/\tau$ in hertz. The sluggish noise of [](#eq:exp-corr) is flat below $1/\tau_c$, so once $\tau \gg \tau_c$ it
averages down as $2\sigma_n^2\tau_c/\tau$.[^exact]

**A number.** "0.02 E in a second" says that the average over $\tau = 1\unit{s}$ has the standard deviation
$\sigma_n(1\unit{s}) = 0.02\unit{E}$. By [](#eq:var-time) the spectrum at low frequencies is
$S(0) = (0.02\unit{E})^2\times1\unit{s}$, so

$$\sqrt{S(0)} = 0.02\unit{E\,s^{1/2}} = 2\times10^{-11}\unit{s^{-2}\,Hz^{-1/2}} .$$

So $\sqrt{S(0)}$, in $\mathrm{E\,Hz^{-1/2}}$, is the noise in eötvös after one second.[^strict] Averaged for 25 s, the
noise falls to $0.02/\sqrt{25} = 0.004\unit{E}$, and the signal-to-noise ratio on the person one metre away (9.34 E)
grows from 467 to 2300.

**A limit.** As $\tau \to 0$, [](#eq:var-time) gives an infinite variance. A real reading is finite, because for
$\tau \ll \tau_c$ the average is one reading, with variance $C(0) = \sigma_n^2$. White noise is an idealization,
valid for averages over times much longer than the correlation time.

**Red noise does not obey the square-root law.** If the spectrum grows without limit toward zero frequency, the window
always holds the part that grows, however long $\tau$ is. For a spectrum proportional to $|\omega|^{-\alpha}$, the
substitution $x = \omega\tau/2$ makes the variance of the average proportional to $\tau^{\alpha - 1}$. For
$\alpha < 1$ it falls more slowly than $1/\tau$; for $\alpha \geq 1$, as for a random walk, the integral diverges, and
two averages taken an hour apart differ by the drift, however long each one is. The law of chapter 3.1 needs a
spectrum that is finite and flat near zero frequency. Figure [](#fig:red-white) compares a white and a red record.

![Two records of noise over 100 s, white (top) and red, a random walk with a small white part added (bottom), scaled
so that their averages over one second scatter equally; under each are its averages over successive blocks of 1 s (thin
steps) and of 10 s (thick steps). The white averages over 10 s scatter $\sqrt{10} = 3.2$ times less than those over 1 s,
while the red ones follow the wander and barely narrow. The inset shows the two spectra on logarithmic axes: the white
one is flat, and the red one rises as $1/\omega^2$ toward zero frequency.](tut-noise-red-white){#fig:red-white}

::: try {#noise-spectrum}
Predict first: for red noise, does averaging ten times longer shrink the scatter of the averages by $\sqrt{10}$? The
figure shows one record of noise, its autocorrelation $C(t)$ and its spectrum $S(\omega)$, each measured from many
records and drawn over the exact curve. Its red noise is a slow wander whose correlation time, 500 samples, is longer
than any average the slider allows. Choose red and move the averaging time $\tau$ from 10 to 100. Then predict which
of the three kinds follows $\sqrt{S(0)/\tau}$ at every $\tau$ the slider allows, and check each.
:::

## The variance of noise spread over a plane falls as one over the area

An array of sensors records a reading at every place on its plane. We name a place by the vector $\vect a$, in
metres, and write the noise there, after the sensors have read for a fixed time, as $n(\vect a)$, in
$\mathrm{s^{-2}}$. Everything in the last two sections carries over, with a place instead of an instant.

The noise is **spatially white** when readings at different places are uncorrelated, however close the places are:

$$\langle n(\vect a)\,n(\vect a')\rangle = N_0\,\delta^2(\vect a - \vect a'),$$

where $\delta^2(\vect a) = \delta(a_1)\,\delta(a_2)$ is the delta function of the plane, in $\mathrm{m^{-2}}$, built
from the components of $\vect a$ as chapter
[1.3](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point) built $\delta^3$. The constant
$\sym{noise-density}{N_0}$ is the **spatial noise density**. Its unit is the square of a tide times an area,
$\mathrm{s^{-4}\,m^2}$, so that $N_0\,\delta^2$ is in $\mathrm{s^{-4}}$.

The average over a patch of area $A$ is $\bar n = \frac1A\int_A n(\vect a)\,\dd^2a$, and its variance is the same
double integral as before, with $\tau$ replaced by $A$:

$$\mathrm{Var}\,\bar n = \frac{N_0}{A^2}\int_A\!\int_A \delta^2(\vect a - \vect a')\,\dd^2a\,\dd^2a' ,$$

and the integrals give $A$, as they gave $\tau$, so

$$\boxed{\mathrm{Var}\,\bar n = \frac{N_0}{A}} .$$

The variance is in $\mathrm{s^{-4}}$, the square of a tide. Over a square patch of side $z$, the standard deviation is
$\sqrt{N_0}/z$.[^ahead]

**Pixels.** A real array has pixels a distance $b$ apart. After reading for a time $\tau$, each pixel carries its
own independent noise, of standard deviation $\sigma_n(\tau)$. A patch of area $A$ holds $A/b^2$ pixels, so the
square-root law gives the patch average the variance $\sigma_n(\tau)^2b^2/A$. That is $N_0/A$ with

$$N_0 = \sigma_n(\tau)^2\,b^2 ,$$

the relation of the paper's [Appendix A](/paper/#app:benchmarks). If each pixel is a gradiometer with white noise of
spectrum $S(0)$, then $\sigma_n(\tau)^2 = S(0)/\tau$ and $N_0 = S(0)\,b^2/\tau$: the noise of each instrument, spread
over the area it covers.

**A number.** Suppose that the person one metre away, at depth $z = 1\unit{m}$, is to stand a thousand times above
the noise. Their peak tide is $2G\matter{m}/z^3 = 9.3\times10^{-9}\unit{s^{-2}}$, and the bump of tide that a mass
makes on the array is about $z$ wide, so the noise averaged over a square metre must be
$9.3\times10^{-12}\unit{s^{-2}}$, and $\sqrt{N_0} = 9.3\times10^{-12}\unit{s^{-2}\,m}$.
With pixels $10\unit{cm}$ apart, as in the paper's locked-safe array of $11\times11 = 121$ pixels a metre across,
each pixel needs
$\sigma_n(\tau) = \sqrt{N_0}/b = 9.3\times10^{-11}\unit{s^{-2}}$, or 0.093 E, which the laboratory gradiometer of
0.02 E in a second reaches in $(0.02/0.093)^2 = 0.046\unit{s}$.

**Ripples.** Across a plane, this tutorial writes a pattern as a sum of ripples $e^{i\vect k\cdot\vect a}$, with the
transform $\tilde n(\vect k) = \int n(\vect a)\,e^{-i\vect k\cdot\vect a}\,\dd^2a$. The wavevector $\vect k$,
in $\mathrm{m^{-1}}$, points across the crests. The sign in the exponent is this tutorial's choice; the paper's one
transform across a plane, its equation [](/paper/#eq:scene-transform), uses the other, and nothing here depends on it.
We repeat the calculation of the spectrum. The delta function in the autocorrelation removes one of the two integrals
over the plane:

$$\begin{aligned}
\langle\tilde n(\vect k)\,\tilde n^*(\vect k')\rangle &= N_0\iint \delta^2(\vect a - \vect a')\\
&\qquad\times e^{-i\vect k\cdot\vect a + i\vect k'\cdot\vect a'}\,\dd^2a\,\dd^2a'\\
&= N_0\int e^{-i(\vect k - \vect k')\cdot\vect a}\,\dd^2a .
\end{aligned}$$

The last integral is a product of two integrals of the form [](#eq:delta-sum), one along each direction of the
plane, so

$$\boxed{\langle\tilde n(\vect k)\,\tilde n^*(\vect k')\rangle = (2\pi)^2\,N_0\,\delta^2(\vect k - \vect k')} .$$

On an array of area $A$, where $(2\pi)^2\delta^2(0)$ stands for $A$, each ripple has
$\langle|\tilde n(\vect k)|^2\rangle = A\,N_0$. So $N_0$ is the spatial spectrum of the noise, and it is flat:
white noise gives every ripple the same strength.

The box also says that two different ripples are uncorrelated. A real map has
$\tilde n(-\vect k) = \tilde n^*(\vect k)$, so $\vect k$ and $-\vect k$ describe one ripple, and "different
ripples" means $\vect k' \neq \pm\vect k$.[^mirror] Uncorrelated is weaker than independent, but not for
Gaussian noise. Noise is **jointly Gaussian** when every set of its readings has a joint Gaussian distribution, as
when independent pixels each carry Gaussian noise. Each ripple is a sum of readings, so the ripples are jointly
Gaussian too, and jointly Gaussian variables that are uncorrelated are independent, which we state without proof. So
the noise in one ripple tells nothing about the noise in another, and each ripple can be read on its own.

This answers the second half of the question: for an array, $\sqrt{N_0}/z$, the noise averaged over a square of side
$z$, plays the part that the noise after one second plays for one instrument. Figure [](#fig:patch) draws the array with
such a square on it.

![The array of $11\times11$ pixels a distance $b = 10\unit{cm}$ apart, each pixel shaded by its own noise (orange above
zero, blue below); the plate's thickness and the slant of the view are drawn for clarity. One pixel's reading has the
variance $\sigma_n(\tau)^2$, the average over the patch of side $z = 3b$, nine pixels, has the variance
$N_0/z^2 = \sigma_n(\tau)^2b^2/z^2$, and the average over the dashed patch of side $2z$ has a quarter of
that.](tut-noise-patch){#fig:patch}

## Randomly placed masses are a noise too

A **prior** is a description of the expected statistics of a scene before any reading is taken; chapter 3.5 combines
a prior with the data into a best guess. The paper's prior is a sheet of point masses $\matter{m}$ dropped at random
places. Its surface density is then a random function, which we treat as we treated the noise. Here
$\sym{surface-density}{\matter{\sigma}}$ is the mass per unit area, in kilograms per square metre (a bare
$\matter\sigma$ in the colour of matter is always this density, never a standard deviation). With the delta function
of the plane, the sheet is

$$\matter{\sigma}(\vect a) = \sum_j \matter{m}\,\delta^2(\vect a - \vect a_j),$$

where $\vect a_j$ is the place of the $j$-th mass. We want its spectrum, defined as for the noise by
$\langle\tilde{\matter\sigma}(\vect k)\,\tilde{\matter\sigma}^*(\vect k')\rangle =
(2\pi)^2\,S_\sigma\,\delta^2(\vect k - \vect k')$ for every ripple except the uniform one, $\vect k = 0$.

We assume that **the places are independent of one another** and that **each is spread evenly over the plane**, with
$\sym{number-per-area}{\nu}$ masses per unit area on average, in $\mathrm{m^{-2}}$.[^nu] The number of masses in an
area $A$ is then a Poisson count with mean $\nu A$, as in chapter
[3.1](/tutorial/noise/probability/#rare-events-are-counted-with-the-poisson-distribution).

Take a large region of area $A$. The transform of the sheet is a sum of
phases, one per mass:

$$\tilde{\matter\sigma}(\vect k) = \matter{m}\sum_j e^{-i\vect k\cdot\vect a_j}.$$

The product $\tilde{\matter\sigma}(\vect k)\,\tilde{\matter\sigma}^*(\vect k')$ is a double sum over the masses
$j$ and $l$, and we split it into the terms with $j = l$ and those with $j \neq l$.

- **The terms with $j = l$.** Each has the mean $\matter{m}^2\,\langle e^{-i(\vect k - \vect k')\cdot\vect a_j}\rangle
  = \frac{\matter{m}^2}{A}\int_A e^{-i(\vect k - \vect k')\cdot\vect a}\,\dd^2a$. Their number has the mean
  $\nu A$, so together they give on average $\nu\matter{m}^2\int e^{-i(\vect k - \vect k')\cdot\vect a}\,\dd^2a
  = (2\pi)^2\,\nu\matter{m}^2\,\delta^2(\vect k - \vect k')$.
- **The terms with $j \neq l$.** Two different masses are independent, so the mean of the product is the product of
  the means, and each mean is $\frac1A\int_A e^{-i\vect k\cdot\vect a}\,\dd^2a$. For a large region this vanishes
  for every ripple except $\vect k = 0$, because the crests and troughs of the ripple cancel. These terms describe
  only the mean of the sheet, which is uniform.

So the departures of the sheet from its mean have a flat spectrum:

$$\boxed{S_\sigma = \nu\,\matter{m}^2} .$$

The unit is $\mathrm{kg^2\,m^{-2}}$. With one mass in each area $z^2$, $\nu = 1/z^2$, and
$\sym{prior-spectrum}{S_\sigma} = \matter{m}^2/z^2$, the paper's prior. On a region of area $A$,
$\langle|\tilde{\matter\sigma}|^2\rangle = A\,S_\sigma$: only the terms with $j = l$ survive, so independent masses add
their squared sizes.

**A number, and a check.** Masses of 70 kg, one in each square metre, have $S_\sigma = 4900\unit{kg^2\,m^{-2}}$. The
surface density averaged over a patch of area $A$ has the variance $S_\sigma/A$, by the argument of the last section,
so the mass in the patch has the variance $A^2\,S_\sigma/A = \nu A\,\matter{m}^2$. Its standard deviation is
$\matter{m}\sqrt{\nu A}$, the Poisson spread $\sqrt\lambda$ of chapter 3.1 with $\lambda = \nu A$, counted in masses of
$\matter m$. A square metre holds 70 kg give or take 70 kg: one person more or less.

**A limit.** Keep the mean density $\nu\matter{m}$ fixed and make the masses lighter and more numerous. Then
$S_\sigma = (\nu\matter{m})\,\matter{m}$ falls in proportion to $\matter{m}$. The same 70 kg in each square metre as
grains of 1 g, 70,000 of them, gives $S_\sigma = 0.07\unit{kg^2\,m^{-2}}$, and the mass in a square metre varies by
0.26 kg, a part in 260. A sheet of sand is smooth where a sheet of people is grainy, and as $\matter m \to 0$ the sheet
becomes uniform. Figure [](#fig:points) draws both sheets with their spectra.

**Shot noise.** The same calculation in time describes arrivals at independent random instants $t_j$, such as photons
on a detector or the gravitons of the paper's [Section IX](/paper/#sec:first-image). At a mean rate $r$ per second,
they form the count rate $\sum_j\delta(t - t_j)$. With $\nu$ replaced by $r$ and $\matter m$ by 1, its spectrum is
flat, $S(\omega) = r$, and this is called **shot noise**. Averaged over a time
$\tau$, by [](#eq:var-time), the rate has the variance $r/\tau$, so the count, the rate times $\tau$, has the variance
$r\tau = \lambda$. That is the Poisson variance of chapter 3.1, now derived from a spectrum: the 438 gravitons that
the Earth sends to a square metre in a year vary by $\sqrt{438} = 21$.

![Top left, 402 masses $\matter{m}$ dropped at random on a square region, each a dot whose area is in proportion to its
mass; top right, the mean of $|\tilde{\matter\sigma}(\vect k)|^2/A$, a column on each wavevector, flat at
$\nu\matter{m}^2$ except at $\vect k = 0$, where the mean sheet gives 401 times as much (off the scale, drawn as an
arrow), as 8000 simulated drawings confirm. Below, the same region holds 40 times as many masses of a fortieth of the
mass: the page carries the same ink, the spectrum is 40 times lower, and the spike at $\vect k = 0$ is the
same.](tut-noise-points){#fig:points}

::: check
### Q

Why is the average over a larger patch of the array quieter?

### A

It averages more independent noise. For white noise the variance of the patch average is $N_0/A$, so a patch of four
times the area has half the standard deviation.

### Q

Sluggish noise with a correlation time of an hour is strongest at low frequencies. Does its average over a day shrink
as the square-root law says?

### A

Very nearly. Its spectrum is finite at zero frequency, so it is not red, and a day is 24 correlation times. The exact
formula of the margin note gives a variance within 5% of $S(0)/\tau$.

### Q

A gradiometer reads 0.02 E in a second, with white noise. What is its noise after 100 s?

### A

$0.02/\sqrt{100} = 0.002\unit{E}$.
:::

**The idea to keep: the spectrum says how noise is shared among frequencies or ripples. White noise has the same
share in every one, so the variance of its average falls as one over the time or the area, and the noise itself as
one over the square root.**

::: problems
### Practice

The gradiometer of the satellite GOCE had a one-sided $\sqrt{S_1}$ of 10 to $20\unit{mE\,Hz^{-1/2}}$ in its band
from 5 to 100 mHz (R. Rummel, W. Yi and C. Stummer, *J. Geod.* 85, 777, 2011), which the paper reads as 0.01 to
0.02 E in a second ([*A flown gradiometer*](/paper/#par:a-flown-gradiometer)). Find the two-sided $\sqrt{S(0)}$, the
noise after one second read strictly, and the noise averaged over a day if the noise were white.

::: solution
By $S_1 = 2S(\omega)$, $\sqrt{S(0)} = \sqrt{S_1/2} = 7.1$ to $14\unit{mE\,s^{1/2}}$, or $0.71$ to
$1.4\times10^{-11}\unit{s^{-2}\,Hz^{-1/2}}$. By [](#eq:var-time) the noise after one second is
$\sigma_n(1\unit{s}) = 0.0071$ to $0.014\unit{E}$, a factor $\sqrt2$ below the paper's reading. A day is 86,400 s, and
$\sqrt{86{,}400} = 294$, so the noise would fall to $2.4$ to $4.8\times10^{-5}\unit{E}$. But GOCE's noise rises
roughly as $1/f$ below its band, whose longest period is 200 s, so this red part sets the floor of a day's average.
:::

### Stretch

A square array of $L\times L$ pixels, a distance $b$ apart, has independent noise $\sigma_n(\tau)$ on each pixel.
Its discrete transform is $\tilde n_{\vect k} = b^2\sum_{\vect a} n_{\vect a}\,e^{-i\vect k\cdot\vect a}$,
for $\vect k = (2\pi/Lb)(p, q)$ with whole numbers $p$ and $q$ from 0 to $L - 1$. Using the sum of a geometric
series, show that different ripples are uncorrelated and that each has the variance $N_0A$, with
$N_0 = \sigma_n(\tau)^2b^2$ and $A = L^2b^2$.

::: solution
The pixels are independent, so $\langle n_{\vect a}n_{\vect a'}\rangle = \sigma_n(\tau)^2$ when
$\vect a = \vect a'$ and 0 otherwise. The double sum in $\langle\tilde n_{\vect k}\tilde n^*_{\vect k'}\rangle$
keeps one sum: $b^4\sigma_n(\tau)^2\sum_{\vect a}e^{-i(\vect k - \vect k')\cdot\vect a}$. Along one direction
the pixels are at $a_1 = bj$, $j = 0, \dots, L - 1$, and the sum is $\sum_j x^j$ with $x = e^{-2\pi i(p - p')/L}$. For
$p \neq p'$, $x \neq 1$ and $x^L = 1$, so the sum $(1 - x^L)/(1 - x)$ is zero; for $p = p'$ it is $L$. The same holds
along the other direction. So the ripples are uncorrelated, and each has the variance
$b^4\sigma_n(\tau)^2L^2 = (\sigma_n(\tau)^2b^2)(L^2b^2) = N_0A$.
:::

### The paper

The worked inversion of [Appendix A](/paper/#app:benchmarks) uses an array a metre across, of $11\times11 = 121$
pixels $b = 10\unit{cm}$ apart. It sets the noise $\sigma$ on each component that a pixel reads by
$\SNR = 2G\matter{m}/(z^2\sigma b)$, with $N_0 = \sigma^2b^2$ (the appendix writes a bare $\sigma$ for the noise of
one reading, which this tutorial writes $\sigma_n(\tau)$). Show that this agrees with chapter 3.7's
$\SNR = 2G\matter{m}/(z^2\sqrt{N_0})$, and find the noise on each pixel of the locked-safe array
($\matter{m} = 324\unit{kg}$, $z = 3.5\unit{m}$) at $\SNR = 10$ and $10^3$.

::: solution
With $N_0 = \sigma_n(\tau)^2b^2$, $\sqrt{N_0} = \sigma_n(\tau)\,b$, so the two forms are the same. Solving for the pixel
noise, $\sigma_n(\tau) = 2G\matter{m}/(z^2b\,\SNR) = 2\times6.674\times10^{-11}\times324/(12.25\times0.1\times\SNR)$,
which is $3.5\times10^{-9}\unit{s^{-2}}$ (3.5 E) at $\SNR = 10$ and $3.5\times10^{-11}\unit{s^{-2}}$ (0.035 E) at
$10^3$. At $\SNR = 10$ each pixel's noise is larger than the gold's peak tide, $2G\matter{m}/z^3 =
1.0\times10^{-9}\unit{s^{-2}}$: only the 121 pixels together see it.
:::
:::

::: paper
- [*How sharp*](/paper/#par:how-sharp) (Section IV) assumes white noise of density $N_0$ and the prior spectrum
  $S_\sigma = \matter{m}^2/z^2$, and writes the data ripple by ripple in the paper's equation [](/paper/#eq:array-data); the
  paper's Wiener filter [](/paper/#eq:wiener) weighs the two spectra against each other (chapters 3.5 and 3.7).
- The paper's equations use two-sided spectra, as in this chapter's relation [](#eq:wk). Only the paper's
  [](/paper/#eq:hole-noise) states the convention. In its thermometer [](/paper/#eq:thermometer), the
  fluctuation–dissipation relation $S_{yy}(\omega) = 2\kB T\,\mathrm{Im}\,\chi_{yy}(\omega)/\omega$ (chapter 4.6) gives the
  right variance only if $S_{yy}$ is two-sided.
- [Appendix A](/paper/#app:benchmarks) sets the pixel noise of the locked safe's array through $N_0 = \sigma^2b^2$,
  with a bare $\sigma$ for this tutorial's $\sigma_n(\tau)$.
:::

::: deeper
- K. S. Thorne and R. D. Blandford, *Modern Classical Physics* (2017), chapter 6, treats random processes for
  physicists, with many instruments; its spectra are one-sided, twice ours.
- A. Papoulis and S. U. Pillai, *Probability, Random Variables and Stochastic Processes* (4th edition, 2002), gives
  the careful mathematics of stationary processes and of shot noise.
- The [GR course, lesson *Waves, modes and Green functions*](https://neovand.github.io/general-relativity/chapter-18.html#waves-modes-and-green-functions)
  writes waves as the same complex exponentials.
:::

[^sinc]: The area follows from the standard integral $\int_{-\infty}^{\infty}(\sin x/x)\,\dd x = \pi$, with
    $x = \omega T/2$.

[^letters]: The paper also writes $S(\hat n)$ for the tidal column of its [](/paper/#eq:tidal-column), and $C$ for the
    capacity of an image in Section IV. Here a spectrum $S$ always carries a frequency or a subscript, and $C(t)$ is
    always the autocorrelation.

[^mirror]: The frequency $-\omega$ is the mirror image of $\omega$, not a different oscillation. For $\omega' =
    -\omega \neq 0$ the box gives $\langle\tilde n(\omega)^2\rangle = 0$; with $\tilde n = x + iy$, this says
    $\langle x^2\rangle = \langle y^2\rangle$ and $\langle xy\rangle = 0$, so every phase is equally likely. The same
    holds for $\pm\vect k$ on a plane.

[^even]: Replacing $t$ by $-t$ in $S(\omega) = \int C(t)\,e^{i\omega t}\,\dd t$ and using $C(-t) = C(t)$ gives
    $S(-\omega) = S(\omega)$. The imaginary part, $\int C(t)\sin\omega t\,\dd t$, has an odd integrand and vanishes.

[^window]: Substitute $x = \omega\tau/2$, so that $\dd\omega/2\pi = \dd x/\pi\tau$, and use the standard integral
    $\int_{-\infty}^{\infty}(\sin x/x)^2\,\dd x = \pi$. For white noise the window formula gives $S(0)/\tau$ exactly,
    as [](#eq:var-time) does.

[^exact]: For the sluggish noise of [](#eq:exp-corr) the double integral can be done exactly. It gives
    $\mathrm{Var}\,\bar n = (2\sigma_n^2\tau_c/\tau)\bigl[1 - (\tau_c/\tau)(1 - e^{-\tau/\tau_c})\bigr]$, which is
    $2\sigma_n^2\tau_c/\tau$ for $\tau \gg \tau_c$ and tends to $\sigma_n^2$ as $\tau \to 0$.

[^strict]: This is the paper's reading, and the tutorial keeps it. The source (M. V. Moody, H. J. Paik and
    E. R. Canavan, *Rev. Sci. Instrum.* 73, 3957, 2002) quotes $0.02\unit{E\,Hz^{-1/2}}$ as a one-sided amplitude
    spectral density $\sqrt{S_1}$, as data sheets do. Read strictly, $S(0) = S_1/2$, so the noise after one second is
    $0.014\unit{E}$, and the ratio on the person is about 660 rather than 467.

[^ahead]: Chapter [3.7](/tutorial/noise/blur-law/) builds the blur law on $N_0$ and on the spectrum $S_\sigma$ of the
    last section: its signal-to-noise ratio compares the peak tide of a mass at depth $z$ with $\sqrt{N_0}/z$.

[^nu]: The number per area is written $\nu$ because $n$ is the noise. In Section XIV of the paper, $\nu$ is a black
    hole's friction, which is unrelated.
