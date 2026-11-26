---
id: '3.5'
title: 'The best guess: the Wiener filter'
question: 'When noise has swamped the finest ripples, what is the best image that the data still allow?'
part: '3'
requires: ['2.1', '2.4', '2.5', '2.6', '2.7', '3.1', '3.2', '3.3', '3.4']
paper: [eq:wiener, fig:nearfield, eq:array-data, eq:cutoff, fig:resolution-law, sec:near-field, app:benchmarks]
figures: [fig:nearfield]
live: [one-mode-wiener, near-field-blur]
depth: A
---

Two line masses lie half a depth apart, and a row of pixels above them records their tides at a signal-to-noise ratio of
a million. The record is one smooth bump, because the fine ripples that tell the two masses apart have faded on their
way up (section [2.7](/tutorial/outside/evanescent/#undoing-the-fade-multiplies-the-noise)). The best picture that can be rebuilt from it, in Figure [](/paper/#fig:nearfield),
shows two peaks a little closer together than the masses, at 0.236 depths on each side of the centre instead of
0.25. Between the peaks it falls below zero, to $-0.40$ of the peak's height at the midpoint, and beyond them it dips
again, to $-0.16$ at 0.49 depths from the centre.

These swings below zero are the price of discarding the detail that noise has swamped. We call them ringing, and keep
the word ripple for one Fourier component, a pattern with one fixed spacing between its crests (section
[2.6](/tutorial/outside/fourier/#a-ripple-in-space-is-a-turning-number-as-an-oscillation-in-time-is)). When noise has swamped the finest ripples, what is the best image that the data
still allow? Among guesses that only multiply and add the readings, the answer is to keep each ripple of the scene with
the weight $s^2/(1 + s^2)$, where $s$ says how far that ripple stands above its noise. This is the **Wiener
filter**.[^wiener] A weight that falls from one to zero across the ripples acts in space as a blur, and the way it
falls makes the ringing.

{{paper fig:nearfield}}

::: plain
A camera's reading is the scene multiplied by a gain, plus noise. When the gain is large, dividing the reading by the
gain gives a good guess of the scene. When the gain is small, the division enlarges the noise more than it recovers
the scene, and a better guess keeps only part of the reading.

The best share to keep depends on how large the scene's part of the reading is expected to be, against the noise. At
three times the noise the best guess keeps 90% of the reading; at equal size, half; at a third of the noise, a tenth.

For a flat camera each ripple of the scene gets its own share: coarse ripples are kept and fine ones dropped. Dropping
them blurs every point and makes the picture swing below zero around each mass.
:::

## The best guess of one number weighs the reading against what was expected

We start with one unknown number, because the camera's problem splits into many problems of this kind. The camera of
the locked safe splits into 231 patterns of mass
([section 3.4](/tutorial/noise/symmetric-matrices/)).
The amount of each pattern reaches the readings multiplied by its own gain, with noise added, and different patterns
never mix. The 17th pattern has a whitened gain of 1.14: a pattern of the size that the scene is expected to hold
moves its reading by 1.14 standard deviations of the noise. How much of that reading should the image keep?

**The model.** We write the unknown as $x$ and the reading as

$$y = \sym{gain}{T}\,x + n .$$

Here $x$ is in the unit of the scene, such as kilograms, and $y$ in the unit of the reading. The **gain** $T$ (not a
temperature) is the reading that one unit of $x$ produces, in the unit of $y$ per unit of $x$. We assume that **$x$
and $n$ are independent**, that **$n$ has mean zero and the standard deviation $\sigma_n$**, and that **$x$ has mean
zero and the standard deviation $\sigma_x$**, in the unit of $x$. This last statement is a **prior**
([section 3.2](/tutorial/noise/random-signals/)): what we expect of $x$ before
the reading. Here $x$ measures how far the scene departs from what we expect on average, so a departure is as likely
to be positive as negative, and its typical size is $\sigma_x$.

**The guess.** An [estimator](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks)
is any rule that turns the reading into a value of $x$. A **linear estimate** multiplies the reading by a fixed weight,
$\hat x = w\,y$. We judge it by its **mean squared error**, the mean of $(\hat x - x)^2$ over both the scene and the
noise. The **best linear estimate** is the one whose mean squared error is smallest.

We write the error with the model, $\hat x - x = (wT - 1)\,x + w\,n$, and square it. The mean of the cross term is
$2(wT - 1)\,w\,\langle x\rangle\langle n\rangle = 0$, because $x$ and $n$ are independent and have mean zero, so

$$\langle(\hat x - x)^2\rangle = (wT - 1)^2\,\sigma_x^2 + w^2\sigma_n^2 .$$

The first term is the part of the scene that the weight loses, and the second is the noise that it lets in. We set
the derivative with respect to $w$ to zero:

$$2T(wT - 1)\,\sigma_x^2 + 2w\,\sigma_n^2 = 0, \qquad w = \frac{T\sigma_x^2}{T^2\sigma_x^2 + \sigma_n^2} .$$

The second derivative, $2(T^2\sigma_x^2 + \sigma_n^2)$, is positive, so this is a minimum. The naive guess divides the
reading by the gain, $y/T$. We compare the best guess with it, writing $\hat x = H\,y/T$ with $\sym{wiener-filter}{H} =
wT$, and we name the pure number $s = T\sigma_x/\sigma_n$, so that $H = s^2/(1 + s^2)$. To find the error that remains,
we put this $w$ into the two terms above: $wT - 1 = -1/(1 + s^2)$, and $w^2\sigma_n^2 = H^2\sigma_n^2/T^2 =
s^2\sigma_x^2/(1 + s^2)^2$. Their sum is $\sigma_x^2(1 + s^2)/(1 + s^2)^2$, so

$$\boxed{\begin{gathered}\hat x = H\,\frac{y}{T},\qquad H = \frac{s^2}{1 + s^2},\\
\langle(\hat x - x)^2\rangle = \frac{\sigma_x^2}{1 + s^2},\qquad s = \frac{T\sigma_x}{\sigma_n} .\end{gathered}}
\label{eq:one-number}$$

The ratio $\sym{ripple-ratio}{s}$ counts the noise standard deviations by which a scene of the expected size moves
the reading: it is the whitened gain of section 3.4. The weight $H$ lies between zero and one. The derivation used only
means, variances and independence, and no particular shape of the distributions.

**A number.** For the 17th pattern, $s = 1.14$, so $H = 1.31/2.31 = 0.57$. The image keeps 57% of what the reading
says, and the remaining error is $0.43$ of the prior's variance. Section 3.4 counted mass in units of the gold's 324 kg,
the prior's standard deviation, so the error has the standard deviation $324\unit{kg}\times\sqrt{0.43} = 213\unit{kg}$.
The naive guess $y/T$ has the error $n/T$, of standard deviation $\sigma_n/T = \sigma_x/s = 283\unit{kg}$. The 25th
pattern, with $s = 0.083$, is kept with $H = 0.0068$.

**The limits.** When $s \gg 1$, $H \to 1$ and $\hat x \to y/T$: the data are trusted. When $s \ll 1$, $H \approx s^2
\to 0$ and $\hat x \to 0$, the prior's mean. At $s = 1$ the guess keeps half the reading and leaves half the prior's
variance. The naive guess has the error $\sigma_x^2/s^2$, larger than the prior's variance when $s < 1$: a buried
pattern divided by its small gain is worse than no guess at all, and $H$ removes it instead. The figure draws the
weight and the two errors.

![The weight $H$ with which the best guess keeps the reading, the error $1/(1 + s^2)$ that it leaves, and the
error $1/s^2$ of the naive guess $y/T$, against the ratio $s$; the errors are in units of the prior's variance. The
weight and the best guess's error add to one, so they cross at $s = 1$, where the naive guess's error reaches the
prior's variance. Above $s = 3$ the two guesses hardly differ.](tut-wiener-weight){#fig:weight}

## With Gaussian scene and noise the best linear guess is also the most probable

We now want the values of $x$ that the reading makes probable, which give an error bar for this one reading (section
[3.3](/tutorial/noise/measuring-a-number/#the-likelihood-scores-each-scene-by-how-well-it-explains-the-data)).

The **conditional density** $p(x|y)$, read "$p$ of $x$ given $y$", is the probability density of $x$ among the cases
in which the reading came out $y$: $p(x|y) = p(x, y)/p(y)$, where $p(x, y)$ is the joint density of
[section 3.1](/tutorial/noise/probability/) and
$p(y)$ the density of $y$ alone. The joint density can be written either way round, $p(x, y) = p(y|x)\,p(x) = p(x|y)\,p(y)$,
which gives **Bayes' rule**:

$$p(x|y) = \frac{p(y|x)\,p(x)}{p(y)} .$$

Here $p(y|x)$ is the likelihood of section 3.3, $p(x)$ is the prior's density, and $p(x|y)$ is the **posterior**, the
density of $x$ after the reading. The denominator $p(y) = \int p(y|x)\,p(x)\,\dd x$ does not depend on $x$ and only
makes the posterior's integral one. So a likelihood becomes a probability for $x$ when it is multiplied by a prior.

We now assume that **$x$ and $n$ are Gaussian**. For a given $x$, the reading differs from $Tx$ only by the noise, so
the likelihood $p(y|x)$ is the density of the noise at $n = y - Tx$. With the Gaussian of
[section 3.1](/tutorial/noise/probability/) for each factor,

$$\ln p(x|y) = -\frac{(y - Tx)^2}{2\sigma_n^2} - \frac{x^2}{2\sigma_x^2} + \text{const} ,$$

where the constant does not depend on $x$. We expand the first square and collect the powers of $x$:

$$\ln p(x|y) = -\frac{x^2}{2}\Bigl(\frac{T^2}{\sigma_n^2} + \frac{1}{\sigma_x^2}\Bigr) + \frac{Ty}{\sigma_n^2}\,x + \text{const} .$$

We name the bracket $1/\sigma_{\rm post}^2$ and complete the square, moving every term without $x$ into the constant:

$$\ln p(x|y) = -\frac{(x - \hat x)^2}{2\sigma_{\rm post}^2} + \text{const}, \qquad \hat x = \sigma_{\rm
post}^2\,\frac{Ty}{\sigma_n^2} .$$

The bracket is $(1 + s^2)/\sigma_x^2$, so $\sigma_{\rm post}^2 = \sigma_x^2/(1 + s^2)$, and then $\hat x =
\sigma_x^2Ty/\bigl(\sigma_n^2(1 + s^2)\bigr) = H\,y/T$. So

$$\boxed{\begin{gathered}p(x|y) \text{ is Gaussian, with}\\ \text{mean and peak } H\,\frac{y}{T},\quad \text{variance }
\frac{\sigma_x^2}{1 + s^2} .\end{gathered}}$$

The posterior's peak, the **most probable** value, is the best linear estimate, and the posterior's variance is the
remaining error of [](#eq:one-number). For the 17th pattern the reading narrows the prior's 324 kg to a posterior
standard deviation of 213 kg.

**With Gaussians, no rule does better.** For any rule $\hat x(y)$, linear or not, the mean squared error is $\int
p(y)\bigl[\int p(x|y)\,(\hat x - x)^2\,\dd x\bigr]\dd y$. For each reading the bracket depends on the one number
$\hat x(y)$. We differentiate it with respect to that number and use $\int p(x|y)\,\dd x = 1$:

$$\frac{\dd}{\dd\hat x}\int p(x|y)\,(\hat x - x)^2\,\dd x = 2\hat x - 2\int x\,p(x|y)\,\dd x .$$

This vanishes at the posterior's mean, $\hat x = \int x\,p(x|y)\,\dd x$, and the second derivative is $2 > 0$, so the
mean is a minimum. So for any prior and any noise, the mean of the posterior is the best of all rules. For Gaussian
scene and noise that mean is $H\,y/T$, which is linear in $y$, so the best linear guess is the best guess.

The best linear estimate and its error need only means, variances and independence, while "most probable" and "no
rule does better" need Gaussian scene and noise. Without Gaussians a non-linear rule can win, as the last section shows
for the safe.

**Information adds.** In the bracket, $T^2/\sigma_n^2$ is the [Fisher
information](/tutorial/noise/measuring-a-number/#the-fisher-information-measures-how-sharply-the-likelihood-peaks) $F$ of the reading about $x$, so $1/\sigma_{\rm post}^2 =
1/\sigma_x^2 + F$. The posterior variance is smaller than the Cramér–Rao bound $1/F$ without contradiction: that bound
holds only for unbiased estimators, and this one is biased, since for a fixed $x$ its mean is $Hx$.[^fixed-x] The fair
comparison is the Bayesian Cramér–Rao bound (Van Trees 1968): averaged over a Gaussian prior, no rule has a mean
squared error below $1/(F + 1/\sigma_x^2)$, and the posterior attains it.

## Many unknowns are guessed together with the same formula

We want the image of the whole safe, which has 231 unknowns. Its readings are whitened as in
[section 3.4](/tutorial/noise/symmetric-matrices/), so
that $\mathbf y = A\matter{\mathbf m} + \mathbf n$ with independent noises of standard deviation one. Here $\mathbf y$
is the list of 605 readings, $\matter{\mathbf m}$ the list of the masses of the cells, in kilograms, and
$\sym{design-matrix}{A}$ the design matrix. We assume a **white prior**: **the cell masses are independent and
Gaussian, with mean zero and one standard deviation $\sigma_m$**, which we take to be the gold's mass, 324 kg. Every
cell is then treated alike and independently.

As before, the logarithm of the posterior is minus half the squared misfit, minus half the prior's sum of squares:

$$\ln p(\matter{\mathbf m}|\mathbf y) = -\tfrac12|\mathbf y - A\matter{\mathbf m}|^2 -
\frac{|\matter{\mathbf m}|^2}{2\sigma_m^2} + \text{const} .$$

We expand $|\mathbf y - A\matter{\mathbf m}|^2 = \mathbf y^{\mathsf T}\mathbf y - 2\matter{\mathbf m}^{\mathsf
T}A^{\mathsf T}\mathbf y + \matter{\mathbf m}^{\mathsf T}A^{\mathsf T}A\matter{\mathbf m}$ and complete the square as
for one number. The symmetric matrix $P = A^{\mathsf T}A + \sigma_m^{-2}I$, with $I$ the identity matrix, takes the
place of $1/\sigma_{\rm post}^2$:

$$\ln p(\matter{\mathbf m}|\mathbf y) = -\tfrac12(\matter{\mathbf m} - \hat{\matter{\mathbf m}})^{\mathsf
T}P\,(\matter{\mathbf m} - \hat{\matter{\mathbf m}}) + \text{const}, \qquad \hat{\matter{\mathbf m}} = P^{-1}A^{\mathsf
T}\mathbf y .$$

Expanding the new form gives back the terms of the old one, because $P\hat{\matter{\mathbf m}} = A^{\mathsf
T}\mathbf y$ makes the terms linear in $\matter{\mathbf m}$ agree.

**The spread.** The **posterior covariance** $\mathrm{Cov}(\matter{\mathbf m}|\mathbf y)$ is the matrix whose entry in
row $i$ and column $j$ is the posterior mean of $(\matter m_i - \hat{\matter m}_i)(\matter m_j - \hat{\matter m}_j)$.
To find it we turn to the eigen-axes of $P$. By the [spectral
theorem](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes), $P =
\sum_i\lambda_i\mathbf v_i\mathbf v_i^{\mathsf T}$, where the $\mathbf v_i$ are perpendicular unit eigenvectors and the
$\lambda_i$ their eigenvalues, in $\mathrm{kg^{-2}}$. These axes are the scene patterns of section 3.4, with
$\lambda_i = s_i^2 + \sigma_m^{-2}$. We write the departure from the best guess as $\matter{\mathbf
m} - \hat{\matter{\mathbf m}} = \sum_ic_i\mathbf v_i$, where $c_i = \mathbf v_i^{\mathsf T}(\matter{\mathbf m} -
\hat{\matter{\mathbf m}})$ is the amount of pattern $i$ in it, in kilograms. The exponent becomes
$-\tfrac12\sum_i\lambda_ic_i^2$: a product of independent Gaussians, one for each $c_i$, with mean zero and variance
$1/\lambda_i$, so $\langle c_ic_j\rangle = \delta_{ij}/\lambda_i$. Turning back to the cells,

$$\bigl\langle(\matter{\mathbf m} - \hat{\matter{\mathbf m}})(\matter{\mathbf m} - \hat{\matter{\mathbf m}})^{\mathsf
T}\bigr\rangle = \sum_{i,j}\mathbf v_i\langle c_ic_j\rangle\mathbf v_j^{\mathsf T} = \sum_i\frac{\mathbf v_i\mathbf
v_i^{\mathsf T}}{\lambda_i} = P^{-1} .$$

The last step holds because $P$ times the sum is $\sum_i\mathbf v_i\mathbf v_i^{\mathsf T} = I$. So

$$\boxed{\begin{gathered}\hat{\matter{\mathbf m}} = (A^{\mathsf T}A + \sigma_m^{-2}I)^{-1}A^{\mathsf T}\mathbf y,\\
\mathrm{Cov}(\matter{\mathbf m}|\mathbf y) = (A^{\mathsf T}A + \sigma_m^{-2}I)^{-1} .\end{gathered}}
\label{eq:posterior}$$

In the singular value decomposition of section 3.4 each scene pattern is kept with the weight $s^2/(1 + s^2)$ of
[](#eq:one-number), and the white prior makes their amounts independent: the 231 unknowns are 231 separate problems of
the first section.

**Numbers.** Before any reading, the mass of the twelve cells of the right-hand safe has the standard deviation
$324\unit{kg}\times\sqrt{12} = 1120\unit{kg}$. At $\SNR = 10^3$ the posterior narrows it to 729 kg. Averaged over the
noise, the best guess puts 228 kg of the 324 in the right-hand safe and $-23$ kg in the left: the weak patterns that
place the gold are shrunk toward zero.

The 729 kg is 177 kg of noise that the guess lets in and 707 kg of the prior's doubt about the weak patterns, added as
independent squares: $\sqrt{177^2 + 707^2} = 729\unit{kg}$. The sharp cut of section
[3.4](/tutorial/noise/symmetric-matrices/#every-linear-camera-is-a-set-of-patterns-gains-and-blind-spots), which keeps the 17 strongest patterns whole, gives about 746 kg, so the
smooth weight does a little better.

## Independent ripples can be filtered one at a time

We want the best guess for the flat camera of section
[2.7](/tutorial/outside/evanescent/#undoing-the-fade-multiplies-the-noise), which multiplies each
ripple of the surface density by its own gain, falling as the ripple gets finer. Ripple $\vect k$ of the surface
density $\sym{surface-density}{\matter\sigma}$ reaches the data as $\tilde{\curv d}(\vect k) = T(\vect k)\,\tilde{\matter\sigma}(\vect k) +
\tilde n(\vect k)$, with $T(\vect k) = 2\pi G\,k\,e^{-kz}$, in $\mathrm{m^2\,kg^{-1}\,s^{-2}}$, and the transforms as
in [section 2.6](/tutorial/outside/fourier/).

We assume that **the sensors fill the plane**, so that the camera treats every place alike, and that **the scene and
the noise are stationary**: their statistics are the same at every place. Different ripples of such a noise are
uncorrelated, with $\langle|\tilde n|^2\rangle = L^2N_0$ on a square patch of side $L$, and the same holds for a sheet
of randomly placed masses, with $\langle|\tilde{\matter\sigma}|^2\rangle = L^2S_\sigma$ and
$\sym{prior-spectrum}{S_\sigma}$ the prior's spectrum
([section 3.2](/tutorial/noise/random-signals/)).

The camera does not mix ripples, by the [convolution
theorem](/tutorial/outside/fourier/#a-blur-multiplies-each-ripple-by-a-number). So the data of any other ripple
$\vect k'$ are uncorrelated with the scene and the noise of ripple $\vect k$. If a linear guess of ripple $\vect k$
also used them with a weight $w'$, its error would gain the term $w'\tilde{\curv d}(\vect k')$. The cross term
averages to zero, so the mean squared error would grow by $|w'|^2\langle|\tilde{\curv d}(\vect k')|^2\rangle$, and
the best $w'$ is zero.[^mirror] Each ripple is therefore a problem of the first section, with

$$x \to \tilde{\matter\sigma}(\vect k),\qquad \sigma_x^2 \to L^2S_\sigma,\qquad \sigma_n^2 \to L^2N_0 .$$

A ripple's amount is a complex number, but its real and imaginary parts obey the same model with the same real gain,
so both get the same weight. The patch's area cancels in $s^2 = T^2\sigma_x^2/\sigma_n^2$, and [](#eq:one-number) gives

$$\boxed{\begin{gathered}\hat{\tilde{\matter\sigma}}(\vect k) = H(\vect k)\,\frac{\tilde{\curv d}(\vect k)}{T(\vect k)},\\
H = \frac{T^2S_\sigma}{T^2S_\sigma + N_0} = \frac{s^2}{1 + s^2},\qquad s^2 = \frac{T^2S_\sigma}{N_0} .\end{gathered}}
\label{eq:wiener-here}$$

The units agree: $T^2S_\sigma$ is in $\mathrm{m^4\,kg^{-2}\,s^{-4}}\times\mathrm{kg^2\,m^{-2}} =
\mathrm{m^2\,s^{-4}}$, the unit of the noise density $\sym{noise-density}{N_0}$, so $s$ is a pure number.[^generalized]

This ripple-by-ripple best guess is the Wiener filter. The first section used only means, variances and independence,
so it is also the best linear guess for a prior of randomly placed point masses, although that prior is not Gaussian.

**The limits.** As $k \to 0$ the gain $T$ vanishes, so $H \to 0$: a uniform layer has no tide (section
[2.7](/tutorial/outside/evanescent/#undoing-the-fade-multiplies-the-noise)), and the
guess returns the prior's mean for it, which is zero for the prior of the first section.[^mean] For fine ripples the
factor $e^{-2kz}$ in $s^2$ drives $H$ to zero.

Section [3.7](/tutorial/noise/blur-law/#step-2-each-ripple-stands-above-its-noise-by-a-factor-that-depends-on-two-numbers)
puts in the gain and the prior of randomly placed point masses and finds $s = \pi\SNR\,q\,e^{-q}$, where $q = kz$ is the
wavenumber in units of one over the depth.[^from-blur-law] At the sensitivity of Figure [](/paper/#fig:nearfield), $\SNR = 10^6$, the weight stays
within $10^{-5}$ of one for every $q$ from $10^{-4}$, a ripple with crests 63,000 depths apart, up to 11.7. It falls to
one half at the two values of $q$ where $s = 1$: at $q = 3.2\times10^{-7}$ and at the cut-off $q_c = 17.8$, the larger
of the two.

## Seen in space, a filter is a blur

We want to know what the weights $H$ do to the picture in space, using two facts from section 2.6: the convolution
theorem, and that a point holds every ripple equally. Averaged over the noise, whose mean is zero,
[](#eq:wiener-here) gives $\langle\hat{\tilde{\matter\sigma}}\rangle = H\,\tilde{\matter\sigma}$. So the mean image is
the true scene with each ripple multiplied by $H(\vect k)$, the **transfer function** of the reconstruction. By the
convolution theorem, this is convolving the scene with the kernel $h$ whose transform is $H$. The kernel is the same
at every place, because the camera treats every place alike, and such a reconstruction is called
**shift-invariant**: moving the scene moves its image and changes nothing else.

A point mass $\matter m$ has $\tilde{\matter\sigma} = \matter m$ for every ripple (section
[2.6](/tutorial/outside/fourier/#a-ripple-in-space-is-a-turning-number-as-an-oscillation-in-time-is)), so its mean image is $\matter m\,h$. The kernel
$h$ is therefore the **point-spread function**, the picture that the reconstruction draws of one point.

**From the plane to a line.** The line masses of Figure [](/paper/#fig:nearfield) do not change along their length, so the scene holds only
ripples whose wavevector points along the row of pixels. These are numbered by one wavenumber $k$, positive or negative
according to direction, and the transforms become those on a line
([section 2.6](/tutorial/outside/fourier/)), with $\dd k/2\pi$ in place
of $\dd^2k/(2\pi)^2$. We write $a$ for the distance along the row, in metres. The point-spread function on the row is

$$\sym{point-spread-function}{h}(a) = \int_{-\infty}^{\infty}H(k)\,e^{ika}\,\frac{\dd k}{2\pi} ,$$

in $\mathrm{m^{-1}}$.

**The ideal low-pass filter.** A **low-pass filter** keeps the coarse ripples and removes the fine ones. The ideal one
keeps every ripple up to a **cut-off** wavenumber $\sym{cutoff-wavenumber}{k_c}$, in $\mathrm{m^{-1}}$, whole, and
none beyond: $H = 1$ for $|k| < k_c$ and $0$ otherwise. Its point-spread function is one integral:

$$h(a) = \int_{-k_c}^{k_c}e^{ika}\,\frac{\dd k}{2\pi} = \frac{e^{ik_ca} - e^{-ik_ca}}{2\pi ia} ,$$

and with $e^{i\theta} - e^{-i\theta} = 2i\sin\theta$,

$$\boxed{\begin{gathered}h(a) = \frac{\sin(k_ca)}{\pi a} = \frac{k_c}{\pi}\,\frac{\sin u}{u},\\ u = k_ca .\end{gathered}}$$

Its peak is $k_c/\pi$, because $\sin u/u \to 1$ as $u \to 0$, and its area is $H(0) = 1$, the transform at $k = 0$. So
the ideal filter spreads each point over a width of about $1/k_c$ and keeps its mass.

The Wiener filter differs at $k = 0$, where $H = 0$, so the area under its point-spread function is zero. The mass
that it removes is spread as a shallow negative halo about $\pi\SNR$ depths wide.[^halo] At $\SNR = 10^6$ that is
three million depths, so the halo takes away only about one part in a million of the mass within a few depths.

**Its width.** The **full width at half maximum** of a peak is the distance between the two points, one on each side,
where it has fallen to half its top. The equation $\sin u/u = \tfrac12$ has no closed-form solution; numerically,
$u = 1.8955$. So the full width is $2\times1.8955/k_c$:

$$\boxed{\;\text{full width at half maximum} = \frac{3.79}{k_c} .\;}$$

For $k_c = 20\unit{m^{-1}}$, where the finest ripple kept has crests 31 cm apart, the width is 19 cm. As a check, when
$k_c \to \infty$ the peak grows as $k_c$ and narrows as $1/k_c$ with its area fixed, and $h$ becomes the delta function
of section 2.6: a filter that keeps everything blurs nothing. Section
[3.7](/tutorial/noise/blur-law/#step-2-each-ripple-stands-above-its-noise-by-a-factor-that-depends-on-two-numbers) finds the cut-off of the
figure, $k_c = 17.8/z$,[^cutoff] so the ideal filter's width there is $3.79/17.8 = 0.2125$ depths. The Wiener filter's
own point-spread function on a row has the width 0.2118 depths, close to it: this is the bar of 0.21 depths in the
figure's second panel.

**The ringing.** Between $u = \pi$ and $2\pi$, $\sin u/u$ is negative. Its first dip is deepest where its slope
vanishes, at $\tan u = u$, which is $u = 4.493$, and there it is $-0.217$ of the peak. So the image of each mass is
flanked by dips of negative mass a fifth as deep as its peak, 4.49 cut-off lengths $1/k_c$ to each side, with weaker
dips beyond. This **ringing** is the [Gibbs
phenomenon](/tutorial/outside/fourier/#a-repeating-pattern-is-a-sum-of-ripples) of section 2.6 in another form: a
sharp edge in $k$ gives an oscillation in $a$ that dies away only as $1/a$. The Wiener filter's edge is soft, so it rings a little less: at the sensitivity of
Figure [](/paper/#fig:nearfield) its first dip is $-0.211$ of the peak, 0.251 depths from the mass.

That distance explains Figure [](/paper/#fig:nearfield). The masses lie 0.5 depths apart, so the inner dip of each falls at the midpoint,
where the two dips add to $-0.40$ of the peak. The outer dips, at 0.49 depths from the centre, reach $-0.16$, and each
mass's image pulls the other's peak inward, to 0.236 depths from the centre.

A soft edge alone does not stop the ringing, since the Wiener filter falls smoothly and still rings. A
point-spread function that is positive everywhere, such as a Gaussian, does, but it has a larger mean squared error:
the Wiener filter is best on average, not best to the eye.

![Left, the ideal low-pass filter (the dashed box) and the Wiener filter at $\SNR = 10^6$, which falls through one half
at the cut-off $q_c = 17.8$; its drop to zero at $q = 0$ is far too narrow to see. Right, their point-spread functions
on a row, each divided by its peak, against $u = k_ca$. The ideal filter's is 3.79 wide at half maximum and dips to
$-0.217$ at $u = 4.49$, and the Wiener filter's, almost the same, dips to $-0.211$.](tut-wiener-sinc){#fig:sinc}

## A linear guess cannot keep mass positive, and with a white prior it is harmonic

We want to know what a linear estimate cannot do.

**Positivity.** A linear rule turns the readings $-\mathbf y$ into minus the image of $\mathbf y$, so for some data it
must draw negative mass. The Gaussian prior allows it too: a cell may hold plus five hundred kilograms of gold with
minus five hundred spread round it, and that is where the $\pm730$ kg hides. Requiring positive mass makes the rule
non-linear, and for the safe it pays: the positive image puts $315 \pm 20$ kg in the right-hand safe (the mean and
spread over the noise), where the Wiener filter puts 228 kg on average, with the posterior's spread of 729 kg. The
prior of point masses is not Gaussian, so the best linear guess is not the best guess. Section 3.9 treats positivity.

**The guess is built from the camera's own kernels.** We go back to [](#eq:posterior) and move the matrix inverse to
the other side of $A^{\mathsf T}$ (the box below shows the step):

$$\boxed{\begin{gathered}\hat{\matter{\mathbf m}} = A^{\mathsf T}\mathbf b,\\ \mathbf b = \sigma_m^2\,(\sigma_m^2AA^{\mathsf
T} + I)^{-1}\mathbf y .\end{gathered}}$$

Here $\mathbf b$ is a list of numbers, one for each reading. Row $j$ of $A$ is the kernel of reading $j$: what a
kilogram in each cell gives that reading. So $A^{\mathsf T}\mathbf b = \sum_jb_j\times(\text{row } j)$, and the image
is a weighted sum of the kernels of the readings. This is the **representer property** of a linear guess with a white
prior.

::: derivation
### Moving the inverse past $A^{\mathsf T}$

Both $A^{\mathsf T}(\sigma_m^2AA^{\mathsf T} + I)$ and $(\sigma_m^2A^{\mathsf T}A + I)A^{\mathsf T}$ equal
$\sigma_m^2A^{\mathsf T}AA^{\mathsf T} + A^{\mathsf T}$. We multiply that equality by $(\sigma_m^2A^{\mathsf T}A +
I)^{-1}$ on the left and by $(\sigma_m^2AA^{\mathsf T} + I)^{-1}$ on the right:

$$(\sigma_m^2A^{\mathsf T}A + I)^{-1}A^{\mathsf T} = A^{\mathsf T}(\sigma_m^2AA^{\mathsf T} + I)^{-1} .$$

With $P = \sigma_m^{-2}(\sigma_m^2A^{\mathsf T}A + I)$, the posterior mean is $P^{-1}A^{\mathsf T}\mathbf y =
\sigma_m^2(\sigma_m^2A^{\mathsf T}A + I)^{-1}A^{\mathsf T}\mathbf y = A^{\mathsf T}\mathbf b$.
:::

**Why the image is harmonic.** The argument uses three facts: the inverse distance is harmonic away from its source
(section 2.4), a harmonic function has no peak or pit inside its region (section 2.1), and every density has a
harmonic part that the outside fixes (section 2.5). Let the scene be the density $\matter\rho$ of a body and the
readings the tides at pixels outside it. The kernel of a reading at the pixel $\vect r_j$ is a second derivative, with
respect to $\vect r_j$, of $G/|\vect r_j - \vect r'|$, where $\vect r'$ is a point inside the body. As a function of
$\vect r'$, $1/|\vect r_j - \vect r'|$ is
[harmonic](/tutorial/outside/greens-functions/#the-potential-of-one-point-builds-every-potential), because the pixel
lies outside, and derivatives with respect to $\vect r_j$ keep it so. A sum of harmonic functions is harmonic. So any
estimate that is linear in the data and treats every point inside alike and independently is harmonic. By the
[maximum principle](/tutorial/outside/laplace/#in-empty-space-the-potential-has-no-peak-and-no-pit) its densest and
lightest points lie on the surface: such an image can never show a core.[^core]

**With no noise.** Before whitening, with noise of standard deviation $\sigma_n$ on each reading, the same image is
$A^{\mathsf T}\mathbf b$ with $\mathbf b = (AA^{\mathsf T} + (\sigma_n/\sigma_m)^2I)^{-1}\mathbf y$. As $\sigma_n \to 0$
the list tends to $(AA^{\mathsf T})^{-1}\mathbf y$, provided that $AA^{\mathsf T}$ has an inverse, which needs
independent kernels and so no more readings than unknowns. Then $A\hat{\matter{\mathbf m}} = \mathbf y$: the image
reproduces every reading exactly. Any other scene that does so adds a pattern $\mathbf u$ with $A\mathbf u = 0$,
orthogonal to every row of $A$ and so to the image. By the Pythagoras of section
[2.5](/tutorial/outside/null-space/#the-least-assuming-interior-is-the-harmonic-part-and-it-never-shows-a-core), the image has the smallest sum of squared masses among them.

With more readings than unknowns, as in the safe's 605 readings of 231 cells, $AA^{\mathsf T}$ has no inverse. The limit
is the pseudo-inverse of section [3.4](/tutorial/noise/symmetric-matrices/#every-linear-camera-is-a-set-of-patterns-gains-and-blind-spots), $A^+\mathbf y$, and the image ignores the
374 combinations of the readings that can hold only noise.

A body read at finitely many pixels is the first case, with far more unknowns than readings. Its image is a sum of
finitely many kernels: harmonic, but not the harmonic part $\matter\rho_h$, which has the right moment against every
harmonic function, not only against these kernels. With readings everywhere outside, it becomes $\matter\rho_h$.

::: gap
This treats the density as a list of small cells. The continuous version needs a prior whose covariance is a delta
function, and a last step, used without proof: sums of the kernels of readings everywhere outside come as close as we
like to every function harmonic in the body.
:::

::: try {#one-mode-wiener}
One pattern seen through noise, $y = Tx + n$, with sliders for the gain, the prior's standard deviation and the noise.
Each dot is one simulated case; the two lines are the naive guess $y/T$ and the best guess $H\,y/T$. Answer the
prediction first, then compare the two errors with the prior's variance.
:::

::: try {#near-field-blur}
The figure of the two line masses, with sliders for the sensitivity and the separation. Before you move anything,
predict what happens to the middle dip as the masses move apart. Then lower the sensitivity until the peaks merge, and
raise it to $10^{60}$, far beyond any instrument, to see how slowly the blur shrinks.

What to notice: the middle dip grows shallower, and near 0.67 depths it splits in two. The peaks merge between
$\SNR = 10^3$ and $10^2$. From $10^6$ to $10^{60}$ the bar narrows only from 0.21 to 0.026 depths, because the cut-off
grows only as the logarithm of the sensitivity.
:::

**The idea to keep: the best linear guess keeps each ripple in proportion to how far it stands above its noise,
$s^2/(1 + s^2)$; seen in space, this weighting is a blur.**

::: problems
### Practice

**[3.5]** A pattern stands three times above its noise, $s = 3$. With what weight does the best guess keep it, and what
share of the prior's variance is left as error?

::: solution
$H = 9/10 = 0.9$, and the error is $1/(1 + 9) = 0.1$ of the prior's variance.
:::

**[3.5]** How wide is the blur of an ideal low-pass filter with $k_c = 20\unit{m^{-1}}$?

::: solution
$3.79/20\unit{m^{-1}} = 0.19\unit{m}$, or 19 cm.
:::

**[3.5]** Give the remaining error of the best guess for $s = 1$ and $s = 10$, as fractions of the prior's variance,
and compare each with the error of the naive guess $y/T$.

::: solution
The best guess leaves $1/(1 + s^2)$: 0.5 at $s = 1$ and $1/101 = 0.0099$ at $s = 10$. The naive guess leaves
$1/s^2$: 1 and 0.01. At $s = 10$ the two hardly differ; at $s = 1$ the best guess halves the error.
:::

### Stretch

**[3.5]** Two pixels read two cell masses directly, $y_1 = x_1 + n_1$ and $y_2 = x_2 + n_2$. The prior is white: $x_1$
and $x_2$ are independent, each with the standard deviation $\sigma_x$. The noises have the covariance
$\sigma_n^2\bigl(\begin{smallmatrix}1&\gamma\\\gamma&1\end{smallmatrix}\bigr)$, with $\gamma$ their correlation.
Whiten, filter each whitened pattern, and transform back. Give the two weights and the guess for $\sigma_x = \sigma_n$
and $\gamma = 0.5$.

::: solution
The noise's eigenvectors are $(1, 1)/\sqrt2$, with variance $\sigma_n^2(1 + \gamma)$, and $(1, -1)/\sqrt2$, with
$\sigma_n^2(1 - \gamma)$. A white prior has the covariance $\sigma_x^2I$, and turning the axes leaves it unchanged,
because $Q\,\sigma_x^2I\,Q^{\mathsf T} = \sigma_x^2I$ for any rotation $Q$. So the amounts of the turned patterns,
$(x_1 \pm x_2)/\sqrt2$, are independent, each with the variance $\sigma_x^2$. Then $s_\pm^2 = \sigma_x^2/\sigma_n^2(1
\pm \gamma)$: $2/3$ for the sum and 2 for the difference, kept with $H_+ = 0.4$ and $H_- = 2/3$. Turning back,

$$\hat x_1 = \tfrac12\bigl[0.4\,(y_1 + y_2) + \tfrac23(y_1 - y_2)\bigr] = 0.533\,y_1 - 0.133\,y_2 ,$$

and $\hat x_2$ with $y_1$ and $y_2$ exchanged. The difference, which the shared noise spares, is kept more, as in the
gradiometer of section 3.1.
:::

### The camera

**[3.5]** Show that $H \to 0$ as $k \to 0$, and that $H$ passes one half where $s = 1$. With the $s = \pi\SNR\,q\,e^{-q}$
of section 3.7, this happens at two values of $q$; show that the larger is the cut-off $q_c$, the finest ripple kept.

::: solution
As $k \to 0$, $T = 2\pi Gk\,e^{-kz} \to 0$, so $s^2 = T^2S_\sigma/N_0 \to 0$ and $H = s^2/(1 + s^2) \to 0$: a uniform
scene is not seen. The condition $H = \tfrac12$ means $2s^2 = 1 + s^2$, so $s = 1$. With $s =
\pi\SNR\,q\,e^{-q}$ this is $q\,e^{-q} = 1/\pi\SNR$. The left side rises from zero to its top, $1/e$ at $q = 1$, and
then falls, so the equation has one root below $q = 1$ and one above. At $\SNR = 10^6$ they are $3.2\times10^{-7}$ and
17.8. Above the larger root $H$ falls toward zero and stays there, so the larger root is the cut-off $q_c$.
:::
:::

::: paper
- The paper's equation [](/paper/#eq:wiener) is the filter derived here; Figure [](/paper/#fig:resolution-law)(a) draws
  it.
- Figure [](/paper/#fig:nearfield) shows its point-spread function on two masses, ringing included.
- [*What the image does show*](/paper/#par:what-the-image-does-show) (Section IV) states that a linear estimate with a
  white prior is harmonic.
- [*A worked case*](/paper/#par:a-worked-case) and [*The worked inversion*](/paper/#par:the-worked-inversion)
  (Appendix A) give the safe's Gaussian posterior and its $\pm730$ kg; [*The positivity of
  mass*](/paper/#par:the-positivity-of-mass) gives the positive image's $315 \pm 20$ kg.
:::

::: deeper
- S. M. Kay, *Fundamentals of Statistical Signal Processing*, volume I (1993), chapters 10 to 12: Bayesian estimation
  and the Wiener filter in matrix form.
- C. E. Rasmussen and C. K. I. Williams, *Gaussian Processes for Machine Learning* (2006), chapter 2: the posterior
  mean as a weighted sum of kernels.
:::

[^wiener]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:wiener), with the cut-off of its equation [](/paper/#eq:cutoff).

[^core]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, which also gives the positive image of
    the safe.

[^from-blur-law]: Section 3.7 puts the prior of randomly placed point masses into $s^2 = T^2S_\sigma/N_0$; this
    section only uses the result.

[^halo]: For small $q$, $s \approx \pi\SNR\,q$, so the share that the filter drops is $1 - H = 1/(1 + s^2) \approx
    1/\bigl(1 + (\pi\SNR\,kz)^2\bigr)$. Its transform on a row is $e^{-|a|/\ell}/2\ell$, with the length $\ell = \pi\SNR\,z$: a halo
    of total mass one, spread over about $\ell$ on each side.

[^cutoff]: Section [3.7](/tutorial/noise/blur-law/#step-2-each-ripple-stands-above-its-noise-by-a-factor-that-depends-on-two-numbers)
    solves $q_ce^{-q_c} = 1/\pi\SNR$; at $\SNR = 10^6$ it gives $q_c = 17.8$, so $k_c = 17.8/z$.

[^fixed-x]: For a fixed $x$ the error $(H - 1)\,x + H\,n/T$ has the mean square $(x^2 + s^2\sigma_x^2)/(1 + s^2)^2$.
    This exceeds $1/F = \sigma_x^2/s^2$ when $|x| > \sigma_x\sqrt{2 + 1/s^2}$, which for the 17th pattern means more
    than $1.66\,\sigma_x$ from the mean.

[^mirror]: The mirror ripple $-\vect k$ brings nothing new either: for a real scene its amount is the complex
    conjugate of the amount of $\vect k$.

[^generalized]: This solves the generalized eigenproblem $C_{\rm sig}\mathbf w = \lambda\,C\mathbf w$ of section 3.4
    for the flat camera. Neither covariance mixes ripples, so each ripple is an eigenvector, with the eigenvalue $s^2$.

[^mean]: A prior of point masses has a mean density above zero. The best guess that adds a constant to a multiple of
    the data then returns that mean at $k = 0$.
