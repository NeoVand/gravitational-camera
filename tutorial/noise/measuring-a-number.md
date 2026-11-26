---
id: '3.3'
title: 'Measuring a number: likelihood, detection, Fisher information, Cramér–Rao'
question: 'The tide of a mass one metre from the camera makes a bump about a metre wide; how can the same data place that mass to within a millimetre?'
part: '3'
requires: ['1.4', '3.1', '3.2']
paper: [sec:near-field, fig:locked-safe, app:benchmarks, eq:depth-bound, sec:one-pixel, sec:first-image]
figures: []
live: [which-safe]
depth: A
---

A mass at a distance $z$ from a flat array makes a bump of tide on it about $z$ wide
([section 3.2](/tutorial/noise/random-signals/#the-variance-of-noise-spread-over-a-plane-falls-as-one-over-the-area)),
so a person one metre away makes a bump about a metre across, even when it stands a thousand times above the
noise.[^blur] Yet the same data place the mass to within a millimetre.[^precision] How can a bump a metre wide do
that? A similar claim concerns the locked safe: 324 kg of gold lie in one of two safes 3.5 m away, and at a
signal-to-noise ratio of 10 the two possibilities give readings 1.8 standard deviations apart, so the camera picks the
wrong safe 18% of the time.

The answer is that a measurement of a known kind of scene does not depend on the width of its picture. It depends on
how fast the data the camera expects change when the number being measured changes, counted in standard deviations
of the noise. Figure [](#fig:safe) shows the simplest case, the choice between the two safes.

![The locked safe as a choice between two scenes, at $\SNR = 10$. Above, one of the five components that each pixel
reads, $\curv{\tE}_{xz}$, with the gold in the left safe ($\mathbf f_A$) and in the right ($\mathbf f_B$), and their
difference, orange where positive and blue where negative, on one scale whose full tint would be a fifth of
$\sigma_n$; this component carries 82% of $D^2$. In all, the 605
readings differ by $D = 1.81$ noise standard deviations, so that, projected on their difference, the choice between
the safes is a choice between two bells of unit width, and the shaded tails beyond the midline, 18.3% on each side,
are the wrong answers.](tut-measure-safe){#fig:safe}

::: plain
To measure something, the camera compares what it read with what each possible scene would have produced. The scene
whose expected readings lie closest to the real ones, in units of the noise, is the best explanation.

To choose between two scenes, what matters is how far apart their expected readings lie. At 1.8 noise standard
deviations apart, the noise carries the readings past the midpoint 18% of the time.

A number, such as the depth of a mass, is measured as precisely as its expected readings change when it changes. When
the mass moves by a millimetre, every one of the many readings changes a little, and together those changes give a
precision far finer than the width of the bump. The Cramér–Rao bound says that no method that is right on average can
do better.
:::

## The likelihood scores each scene by how well it explains the data

A camera records $N$ readings $y_1, \dots, y_N$, numbered by $i$, such as the five numbers that each of the 121
pixels of the safe's array reports. Each is a prediction plus noise,

$$y_i = f_i(\theta) + n_i .$$

Here $\sym{parameter}{\theta}$ is the **parameter**, the unknown number of the scene that we want: a mass in
kilograms, a depth in metres, or which safe holds the gold. The **prediction** $f_i(\theta)$ is the reading that the scene with this value of
$\theta$ would give at reading $i$ without noise, computed from the laws of Part 1. The noise $n_i$ is Gaussian, with mean zero and standard deviation $\sigma_n$, and
the noises of different readings are independent
([section 3.1](/tutorial/noise/probability/#averaging-independent-readings-shrinks-the-noise-as-a-square-root)); this
$\sigma_n$ is the $\sigma_n(\tau)$ of section 3.2 for a fixed averaging time.

One reading has the Gaussian density
([section 3.1](/tutorial/noise/probability/#most-noise-follows-the-gaussian-bell)) centred on $f_i(\theta)$. The readings are
independent, so the density of the whole list $\mathbf y = (y_1, \dots, y_N)$ is the product of the $N$ densities.
We write it $p(\mathbf y|\theta)$, read "$p$ of $\mathbf y$ given $\theta$". Seen as a function of $\theta$, with the
data fixed at what was recorded, it is the **likelihood** $\sym{likelihood}{L(\theta)} = p(\mathbf y|\theta)$. Its
logarithm turns the product into a sum:

$$\ln L(\theta) = -\sum_{i=1}^{N}\frac{\bigl(y_i - f_i(\theta)\bigr)^2}{2\sigma_n^2} + \text{const}. \label{eq:loglike}$$

The constant comes from the factors $1/(\sqrt{2\pi}\,\sigma_n)$. The likelihood scores each candidate scene by the
sum of its squared misfits, each in units of the noise. The value of $\theta$ that
makes $L$ largest is the **maximum-likelihood estimate**, written $\hat\theta$. For Gaussian noise it is the
least-squares fit.

**An example.** A gradiometer reads one steady tide $x_0$ (the parameter) $N$ times, so every prediction is
$f_i = x_0$. We set the derivative of [](#eq:loglike) to zero:

$$\frac{\partial\ln L}{\partial x_0} = \sum_i\frac{y_i - x_0}{\sigma_n^2} = 0, \qquad \hat x_0 = \frac1N\sum_i y_i .$$

The maximum-likelihood estimate is the average of the readings, whose noise is $\sigma_n/\sqrt N$ (section 3.1).

**A non-example.** The likelihood is not the probability that $\theta$ is the true value: its integral over
$\theta$ need not be one. A probability for $\theta$ needs a prior (section 3.5).

## Choosing between two scenes comes down to one Gaussian number

We want the probability that the camera picks the wrong safe, which measures how well data decide a question.

Each possible answer is a **hypothesis**, a complete scene that predicts every reading. Hypothesis $A$ (the gold in
the left safe) predicts the readings $\mathbf f_A = (f_{A,1}, \dots, f_{A,N})$, and hypothesis $B$ (the gold in the
right safe) predicts $\mathbf f_B$. A **hypothesis test** is a rule that picks one of them from the data. We assume
that **the noise is Gaussian, independent and of the same standard deviation $\sigma_n$ in every reading**,
and that **the two hypotheses are equally likely before we look**.

**The best rule.** Any rule answers $A$ for some sets of readings and $B$ for the others. Each hypothesis is true
half the time, so the **error probability** of the rule is

$$\begin{aligned}
P_{\rm err} &= \tfrac12\int_{\text{answer }B} p_A\,\dd\mathbf y + \tfrac12\int_{\text{answer }A} p_B\,\dd\mathbf y\\
&= \tfrac12 - \tfrac12\int_{\text{answer }A}(p_A - p_B)\,\dd\mathbf y ,
\end{aligned}$$

where $p_A$ and $p_B$ are the densities of the data under the two hypotheses and the second form uses
$\int p_A\,\dd\mathbf y = 1$. The error is smallest when the region "answer $A$" holds every set of readings where
$p_A > p_B$ and no other. So the best rule picks the hypothesis with
the larger likelihood: it compares the **likelihood ratio** $L_A/L_B$ with one.

**The rule measures a distance.** By [](#eq:loglike), the rule picks $A$ when $|\mathbf y - \mathbf f_A|^2 < |\mathbf
y - \mathbf f_B|^2$, where $|\mathbf v|^2 = \sum_i v_i^2$. So it picks the hypothesis whose predicted readings lie
closer to the real ones. The terms in $|\mathbf y|^2$ cancel, and

$$|\mathbf y - \mathbf f_B|^2 - |\mathbf y - \mathbf f_A|^2 = 2\,(\mathbf f_A - \mathbf f_B)\cdot\Bigl(\mathbf y -
\frac{\mathbf f_A + \mathbf f_B}{2}\Bigr).$$

Let $\mathbf e = (\mathbf f_A - \mathbf f_B)/|\mathbf f_A - \mathbf f_B|$ be the unit vector along the difference of
the predictions. The rule picks $A$ when the number $t = \mathbf e\cdot\bigl(\mathbf y - \tfrac12(\mathbf f_A +
\mathbf f_B)\bigr)$ is positive. Of all the $N$ readings, only this combination matters.

**The error.** Suppose that $A$ is true, so $\mathbf y = \mathbf f_A + \mathbf n$. Then

$$t = \tfrac12|\mathbf f_A - \mathbf f_B| + \mathbf e\cdot\mathbf n .$$

The second term is a [weighted
sum](/tutorial/noise/probability/#covariance-describes-noise-that-two-readings-share) of the noises, with variance
$\sigma_n^2\sum_i e_i^2 = \sigma_n^2$, because $\mathbf e$ has length one. A weighted sum of independent
Gaussian numbers is itself Gaussian (stated without proof), so
$\mathbf e\cdot\mathbf n = \sigma_n Z$ with $Z$ a standard Gaussian. The rule errs when $t < 0$, that is when
$Z < -\tfrac12|\mathbf f_A - \mathbf f_B|/\sigma_n$. We name the separation of the predictions in units of the noise

$$\sym{scene-separation}{D} = \frac{|\mathbf f_A - \mathbf f_B|}{\sigma_n},$$

a pure number. (Sections 2.3 and 3.7 use $D$ for the width of a camera; here it is always the separation of two
scenes.) The Gaussian is symmetric, and the case where $B$ is true gives the same, so

$$\boxed{\sym{error-probability}{P_{\rm err}} = P\bigl(Z > D/2\bigr)} .$$

**A number.** The array is an upright square a metre across, of $11\times11$ pixels $b = 10\unit{cm}$ apart, facing the
safes. We take $x$ to the right, $y$ up and $z$ forward, from the camera's plane toward the scene. Each pixel reads
five components of the tide, $\curv{\tE}_{xx}$, $\curv{\tE}_{yy}$, $\curv{\tE}_{xy}$, $\curv{\tE}_{xz}$ and
$\curv{\tE}_{yz}$, which fix the rest because the tide is symmetric and, in empty space, trace-free (section 1.4). So
$N = 605$. The noise on each reading is $\sigma_n = 2G\matter m/(z^2b\,\SNR)$ (section 3.2), with
$\matter m = 324\unit{kg}$ and $z = 3.5\unit{m}$: $3.5\times10^{-9}\unit{s^{-2}}$ at $\SNR = 10$. The gold is a bar of $0.3\times0.14\times0.4\unit{m}$, 3.5 m in front of the array, 1.1 m to the left or the
right of its axis and 1.37 m below it. Summing the squares of the 605 differences between the two safes' predicted
readings gives $D = 1.81$, and

$$P_{\rm err} = P(Z > 0.906) = 0.183 ,$$

an error rate of 18%.[^safe] No single reading decides: the largest difference between the two predictions is under a
fifth of $\sigma_n$. The test works because all 605 differences add up in $D^2$.

Because $\sigma_n$ is proportional to $1/\SNR$, $D = 0.181\,\SNR$ for the safe. At $\SNR = 34$, $D = 6.16$ and $P_{\rm err} = P(Z > 3.08) = 1.04\times10^{-3}$, once in a thousand. **A limit.** As $D \to 0$, $P_{\rm err} \to \tfrac12$: when the two predictions agree, the data are no better than
a coin.

::: try {#which-safe}
Each trial puts the gold in one safe at random, adds noise to the 605 predicted readings, and picks the safe whose
predictions lie closer. Predict first, then set the signal-to-noise ratio and run trials until the count of wrong
answers settles beside $P(Z > D/2)$.
:::

## The Fisher information measures how sharply the likelihood peaks

We want the smallest error with which any method can measure a number $\theta$ from the data.

An **estimator** $\hat\theta(\mathbf y)$ is any rule that turns the readings into a value of $\theta$, such as the
maximum-likelihood fit. It is **unbiased** when its mean over the noise is the true value, $\langle\hat\theta\rangle
= \theta$, for every possible true value. The rule "always answer zero" has no scatter but is biased.

**How fast the predictions change.** Two values of $\theta$ a small step $\delta\theta$ apart predict readings that
differ by $f_i'\,\delta\theta$, with $f_i' = \partial f_i/\partial\theta$, and are $D = \sqrt F\,\delta\theta$ apart in
units of the noise, where

$$\sym{fisher}{F} = \sum_{i=1}^{N}\frac{(\partial f_i/\partial\theta)^2}{\sigma_n^2} \label{eq:fisher}$$

is the **Fisher information**, in the inverse square of the unit of $\theta$. A step $\delta\theta = 1/\sqrt F$
moves the predicted data by one standard deviation of the noise. The same number is the sharpness of the likelihood:
averaged over the noise, [](#eq:loglike) is $-\sum_i\bigl(f_i(\theta) - f_i(\theta_0)\bigr)^2/2\sigma_n^2$ plus a
constant, where $\theta_0$ is the true value,[^average] and with $f_i(\theta) - f_i(\theta_0) \approx
f_i'\,(\theta - \theta_0)$ this is $-\tfrac12F(\theta - \theta_0)^2$. So the likelihood peaks with a width of about
$1/\sqrt F$. Figure [](#fig:peak) draws the peak for the depth of one mass.

![The log-likelihood of the depth $\theta$ of one mass whose mass is known, averaged over the noise, for three
strengths $\mathcal R$ of the whole pattern; here $F = 5\mathcal R^2/z^2$, as found below. Each curve has fallen by
one half at $\theta - \theta_0 = \pm1/\sqrt F$ (the blue dots), and the widths marked under the axis, $0.149z$,
$0.045z$ and $0.015z$, shrink in proportion to $1/\mathcal R$.](tut-measure-peak){#fig:peak}

**The bound.** We assume that **the estimator is unbiased** and that **the readings that can occur are the same
whatever $\theta$ is**: $\theta$ changes how probable each reading is, not which are possible.
Gaussian noise meets the second assumption, because every reading is possible at every $\theta$. Readings spread
evenly between 0 and $\theta$ do not: the largest of $N$ readings finds $\theta$ with an error that falls as $1/N$,
faster than the bound below, because the edge of the possible readings moves with $\theta$. The assumption lets us
differentiate under the integral sign. We define the **score**, the slope of the log-likelihood at the true
value, in the inverse of the unit of $\theta$:

$$U = \frac{\partial\ln p(\mathbf y|\theta)}{\partial\theta} = \frac{1}{p}\frac{\partial p}{\partial\theta} .$$

The mean of the score is zero, because the total probability is one whatever $\theta$ is:

$$\langle U\rangle = \int\frac{\partial p}{\partial\theta}\,\dd\mathbf y = \frac{\partial}{\partial\theta}\int
p\,\dd\mathbf y = 0 .$$

Differentiating the condition of no bias, $\int\hat\theta\,p\,\dd\mathbf y = \theta$, with respect to $\theta$
(the estimator depends on the data only) gives

$$\int\hat\theta\,\frac{\partial p}{\partial\theta}\,\dd\mathbf y = \langle\hat\theta\,U\rangle = 1 .$$

Because $\langle U\rangle = 0$, this mean of a product is the covariance: $\mathrm{Cov}(\hat\theta, U) = 1$.

For any random numbers $X$ and $Y$ and any constant $c$, the variance of $X - cY$ cannot be negative. By the rule for
the variance of a [difference](/tutorial/noise/probability/#covariance-describes-noise-that-two-readings-share),

$$0 \le \mathrm{Var}(X - cY) = \mathrm{Var}\,X - 2c\,\mathrm{Cov}(X, Y) + c^2\,\mathrm{Var}\,Y .$$

The choice $c = \mathrm{Cov}(X, Y)/\mathrm{Var}\,Y$ gives the **Cauchy–Schwarz inequality**
$\mathrm{Cov}(X, Y)^2 \le \mathrm{Var}\,X\,\mathrm{Var}\,Y$, which is why a correlation lies between $-1$ and 1. With
$X = \hat\theta$ and $Y = U$, the left side is 1, so $\mathrm{Var}\,\hat\theta \ge 1/\mathrm{Var}\,U$. For Gaussian
noise the score is, from [](#eq:loglike), $U = \sum_i n_if_i'/\sigma_n^2$, a weighted sum of independent noises, and
its variance is $\sum_i (f_i'/\sigma_n^2)^2\sigma_n^2$, which is $F$ of [](#eq:fisher). (For any other noise,
$\mathrm{Var}\,U$ is taken as the definition of $F$.) So

$$\boxed{\mathrm{Var}\,\hat\theta \ge \frac{1}{F}} .$$

This is the **Cramér–Rao bound**; both sides are in the square of the unit of $\theta$.

**When equality holds.** Cauchy–Schwarz is an equality only when $\hat\theta - \theta$ is a fixed multiple of the
score, as for a **linear model**,
$f_i = \theta\,g_i$ with fixed $g_i$. The least-squares fit is then $\hat\theta = \sum_i y_ig_i/\sum_i g_i^2 = \theta +
U/F$, unbiased with the variance $1/F$ exactly.

**A check.** For $N$ readings of one number, $g_i = 1$ and $F = N/\sigma_n^2$: the bound is the square-root law, which
the average reaches.

**Near equality and far from it.** One mass under a flat camera is not a linear model in its position, but at a high
signal-to-noise ratio it is nearly linear over the range that the noise explores. In 4000 simulated fits of
the place of one mass across the plane, with its depth and mass known, the scatter is within 2% of the bound when the
whole pattern stands 10 noise standard deviations above zero (the ratio $\mathcal R$ of [the section on one
mass](#one-mass-a-metre-away-is-placed-to-a-millimetre)). At $\mathcal R = 2$ it is 6.1 times the bound, and 69% of
the fits land more than half a depth away, on a bump of the noise:[^weak] a weak signal gives a likelihood with
several peaks.

## An unknown we do not want can only enlarge the error of one we do

A real scene has several unknowns: one mass has two coordinates across the plane, a depth and a mass. We write them
$\theta_1, \dots, \theta_K$, numbered by $k$ and $l$. The **Fisher matrix** generalizes [](#eq:fisher),

$$\sym{fisher-matrix}{F_{kl}} = \sum_i\frac{1}{\sigma_n^2}\frac{\partial f_i}{\partial\theta_k}\frac{\partial
f_i}{\partial\theta_l} ,$$

a symmetric $K\times K$ table, whose entry is in the inverse of the product of the units of $\theta_k$ and $\theta_l$.
Each parameter has its own score $U_k = \partial\ln p/\partial\theta_k$, and with Gaussian noise
$\mathrm{Cov}(U_k, U_l) = F_{kl}$.

We want the bound on $\theta_1$ when the others must be fitted too. The estimator $\hat\theta_1$ is unbiased whatever
the parameters, so differentiating its mean with respect to each $\theta_l$ gives
$\mathrm{Cov}(\hat\theta_1, U_l) = 1$ for $l = 1$ and 0 otherwise. Take any combination $Y = w_lU_l$ of the scores,
with fixed weights $w_l$ and the repeated index summed. Then $\mathrm{Cov}(\hat\theta_1, Y) = w_1$, and by the rule
for a weighted sum $\mathrm{Var}\,Y = w_kF_{kl}w_l$. Cauchy–Schwarz gives
$\mathrm{Var}\,\hat\theta_1 \ge w_1^2/w_kF_{kl}w_l$ for every choice of weights. We choose the weights that make the
right side largest, the first column of the inverse matrix, $w_l = (F^{-1})_{l1}$.[^weights] Then $F_{kl}w_l$ is 1
for $k = 1$ and 0 otherwise, so $w_kF_{kl}w_l = w_1 = (F^{-1})_{11}$, and

$$\boxed{\mathrm{Var}\,\hat\theta_1 \ge (F^{-1})_{11}} .$$

Section [3.4](/tutorial/noise/symmetric-matrices/) extends this to every combination of the parameters.

**Two unknowns.** The inverse of a $2\times2$ symmetric matrix gives

$$(F^{-1})_{11} = \frac{F_{22}}{F_{11}F_{22} - F_{12}^2} = \frac{1}{F_{11}\,(1 - \gamma^2)}, \qquad \gamma =
\frac{F_{12}}{\sqrt{F_{11}F_{22}}} .$$

The pure number $\gamma$ is the correlation (section 3.1) between the two scores. It is also the cosine of the angle between the two lists of rates of change, $\partial
f_i/\partial\theta_1$ and $\partial f_i/\partial\theta_2$, each divided by $\sigma_n$. Since $\gamma^2 \ge 0$,
$(F^{-1})_{11} \ge 1/F_{11}$. An unknown that we must fit but do not want, a **nuisance parameter**, can only enlarge
the error of the one we want, by the factor $1/\sqrt{1 - \gamma^2}$. The cost is large when the two change the
predicted data in similar ways, so that $\gamma$ is close to $\pm1$.

**A number.** The next section finds, for the depth $z$ and the mass $\matter m$ of one mass, the matrix

$$F = \mathcal R^2\begin{pmatrix}5/z^2 & -2/\matter mz\\ -2/\matter mz & 1/\matter m^2\end{pmatrix},$$

where $\mathcal R$ is a pure number, the strength of the whole pattern in units of the noise. Here $\gamma^2 = 4/5$,
so the factor is $\sqrt5 = 2.24$. With the mass known, the depth would be measured to $1/\sqrt{F_{zz}} =
z/(\sqrt5\,\mathcal R)$; with the mass unknown, to $\sqrt{(F^{-1})_{zz}} = z/\mathcal R$. A deeper, heavier mass
gives nearly the same readings over the middle of the bump as a shallower, lighter one, and the data spend most of
their information telling the two apart (Figure [](#fig:ellipse)).

![The steps of the depth and the mass that move the predicted data by one noise standard deviation,
$(\delta\theta)^{\mathsf T}F\,(\delta\theta) = 1$, in units of $z/\mathcal R$ and $\matter m/\mathcal R$; the scales
of the two axes are chosen for the drawing. The ellipse leans along the line where a deeper mass is also heavier,
with correlation $2/\sqrt5 = 0.89$: its shadow on the depth axis, the error with the mass fitted, reaches $\pm1$,
while its cut by that axis, the error with the mass known, reaches only $\pm1/\sqrt5$; on the mass axis the two are
$\pm\sqrt5$ and $\pm1$.](tut-measure-ellipse){#fig:ellipse}

## One mass a metre away is placed to a millimetre

We want the bounds for one point mass below a flat camera, which answer the opening question.

**A simpler camera.** The safe's array was a metre wide and read five components at each pixel. We use instead a model
camera: a plane wide enough to catch the whole bump of tide, which reads one component, $\curv d = -\curv{\tE}_{zz}$,
in $\mathrm{s^{-2}}$, at every place $\vect a$ of the plane, with white noise of density $N_0$ (section 3.2).[^model]
Here $z$ runs straight down from the plane to the mass. One component keeps every integral short. The minus sign makes
the reading positive directly above a mass, where the tide stretches along the vertical and $\curv{\tE}_{zz}$ is
negative (section 1.4).

**The data.** A point mass $\matter m$ lies at depth $z$, at a distance $a = |\vect a - \vect a_0|$ across the
plane from the place $\vect a_0$ above it. In the [tide of a point
mass](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it) of section 1.4, the unit
vector from the camera toward the mass, which lies below, has the vertical component $-z/\sqrt{z^2 + a^2}$, so
$\curv{\tE}_{zz} = G\matter m\,(1 - 3z^2/(z^2 + a^2))/(z^2 + a^2)^{3/2}$ and

$$\curv d(\vect a) = \frac{G\matter m\,(2z^2 - a^2)}{(z^2 + a^2)^{5/2}} .$$

It is $2G\matter m/z^3$ directly above the mass, falls to zero at $a = \sqrt2\,z$, and is slightly negative beyond.

**From readings to an integral.** Pixels a distance $b$ apart each carry the noise $\sigma_n$, with $N_0 =
\sigma_n^2b^2$ ([section 3.2](/tutorial/noise/random-signals/#the-variance-of-noise-spread-over-a-plane-falls-as-one-over-the-area)).
So $1/\sigma_n^2 = b^2/N_0$, and a sum over pixels of $b^2$ times a smooth function is the integral of that function
over the plane. The sums of the last sections become

$$F_{kl} = \frac{1}{N_0}\int\frac{\partial\curv d}{\partial\theta_k}\,\frac{\partial\curv d}{\partial\theta_l}\,\dd^2a,
\qquad D^2 = \frac{1}{N_0}\int\bigl(\curv d_A - \curv d_B\bigr)^2\,\dd^2a .$$

**The whole pattern.** The scene "one mass here" and the empty scene are separated by

$$\sym{pattern-snr}{\mathcal R}^2 = \frac{1}{N_0}\int\curv d^{\,2}\,\dd^2a ,$$

the **signal-to-noise ratio of the whole pattern**. With $\dd^2a = 2\pi a\,\dd a$ we substitute $v = 1 + a^2/z^2$, which gives $2\pi a\,\dd a = \pi z^2\,\dd v$, $2z^2 - a^2 = z^2(3 - v)$ and
$z^2 + a^2 = z^2v$:

$$\begin{aligned}
\int\curv d^{\,2}\,\dd^2a &= \frac{\pi G^2\matter m^2}{z^4}\int_1^\infty\frac{(3 - v)^2}{v^5}\,\dd v\\
&= \frac{\pi G^2\matter m^2}{z^4}\Bigl(\frac94 - 2 + \frac12\Bigr) = \frac{3\pi}{4}\,\frac{G^2\matter m^2}{z^4} .
\end{aligned}$$

The three terms are the integrals of $9v^{-5}$, $-6v^{-4}$ and $v^{-3}$. Section 3.2 compared the peak tide
$2G\matter m/z^3$ with $\sqrt{N_0}/z$, the noise averaged over a square of side $z$, so that
$\SNR = 2G\matter m/(z^2\sqrt{N_0})$. Then $G^2\matter m^2/(z^4N_0) = \SNR^2/4$, and

$$\boxed{\mathcal R = \frac{\sqrt{3\pi}}{4}\,\SNR = 0.767\,\SNR} .$$

The ratio $\SNR$ compares the peak with the noise on one square of side $z$, while $\mathcal R$ counts the whole
pattern. The integral above is $(3\pi/16)(2G\matter m/z^3)^2z^2$, so the whole pattern holds as much signal as a patch
of area $0.59\,z^2$ at the height of its peak: $\mathcal R = 767$ at $\SNR = 10^3$. As a check, $\partial\curv d/\partial\matter m = \curv d/\matter m$, so $F_{mm} = \mathcal
R^2/\matter m^2$: with everything else known, the mass is measured to $1/\mathcal R$ of itself.

**The full matrix.** The parameters are the two coordinates $x_0, y_0$ of $\vect a_0$, the depth $z$ and the mass
$\matter m$. The box below computes every entry:

$$F = \mathcal R^2\begin{pmatrix}
5/2z^2 & 0 & 0 & 0\\
0 & 5/2z^2 & 0 & 0\\
0 & 0 & 5/z^2 & -2/\matter mz\\
0 & 0 & -2/\matter mz & 1/\matter m^2
\end{pmatrix}.$$

The coordinates across the plane are separate, because moving the mass sideways changes the data in a pattern odd
about the point above it, while the depth and the mass change it evenly. The depth and the mass form the
$2\times2$ block of the last section, whose inverse is

$$\frac{1}{\mathcal R^2}\begin{pmatrix}z^2 & 2\matter mz\\ 2\matter mz & 5\matter m^2\end{pmatrix}.$$

The square roots of the diagonal entries of $F^{-1}$ are the smallest errors of any unbiased method:

$$\boxed{\sigma_{x_0} = \sqrt{\frac25}\,\frac{z}{\mathcal R}, \qquad \sigma_z = \frac{z}{\mathcal R}, \qquad
\frac{\sigma_m}{\matter m} = \frac{\sqrt5}{\mathcal R}} ,$$

the bounds for one mass.

::: derivation
### The entries of the Fisher matrix of one mass

With $v = 1 + a^2/z^2$ as above, write $\vect a - \vect a_0 = a(\cos\varphi, \sin\varphi)$.

**Across.** The product rule gives $\partial\curv d/\partial a = 3G\matter m\,a\,(a^2 - 4z^2)/(z^2 + a^2)^{7/2}$. Moving
the mass by $\delta x_0$ moves the pattern, so $\partial\curv d/\partial x_0 = -\cos\varphi\,\partial\curv d/\partial
a$. The integral of $\cos^2\varphi$ over a turn is $\pi$. With $a\,\dd a = \tfrac12z^2\,\dd v$ this gives

$$\begin{aligned}
F_{x_0x_0} &= \frac{\pi}{N_0}\int\Bigl(\frac{\partial\curv d}{\partial a}\Bigr)^2a\,\dd a\\
&= \frac{9\pi G^2\matter m^2}{2N_0z^6}\int_1^\infty\frac{(v - 1)(v - 5)^2}{v^7}\,\dd v\\
&= \frac{9\pi G^2\matter m^2}{2N_0z^6}\Bigl(\frac13 - \frac{11}{4} + 7 - \frac{25}{6}\Bigr)\\
&= \frac{15\pi}{8}\,\frac{G^2\matter m^2}{N_0z^6} = \frac52\,\frac{\mathcal R^2}{z^2} .
\end{aligned}$$

**Depth.** Differentiating with respect to $z$ at fixed $a$ gives $\partial\curv d/\partial z = 3G\matter m\,z\,(3a^2
- 2z^2)/(z^2 + a^2)^{7/2}$, and $3a^2 - 2z^2 = z^2(3v - 5)$:

$$\begin{aligned}
F_{zz} &= \frac{9\pi G^2\matter m^2}{N_0z^6}\int_1^\infty\frac{(3v - 5)^2}{v^7}\,\dd v\\
&= \frac{9\pi G^2\matter m^2}{N_0z^6}\Bigl(\frac94 - 6 + \frac{25}{6}\Bigr) = 5\,\frac{\mathcal R^2}{z^2} .
\end{aligned}$$

**Depth with mass.** With $\partial\curv d/\partial\matter m = \curv d/\matter m$,

$$\begin{aligned}
F_{zm} &= \frac{3\pi G^2\matter m}{N_0z^5}\int_1^\infty\frac{(3v - 5)(3 - v)}{v^6}\,\dd v\\
&= \frac{3\pi G^2\matter m}{N_0z^5}\Bigl(-1 + \frac72 - 3\Bigr) = -2\,\frac{\mathcal R^2}{\matter mz} .
\end{aligned}$$

**The rest.** The entry $F_{mm} = \mathcal R^2/\matter m^2$ was found above. Every entry that pairs $x_0$ or $y_0$
with another parameter holds $\cos\varphi$ or $\sin\varphi$ once, or their product, and integrates to zero over a turn.

:::

**Numbers.** At $\SNR = 10^3$ and $z = 1\unit{m}$, $\mathcal R = 767$. The mass is placed to
$0.632/767\unit{m} = 0.82\unit{mm}$ across and $1.3\unit{mm}$ in depth, and weighed to $2.24/767 = 0.29\%$ of
itself, while its bump is more than a thousand times wider than the error across.

**A limit.** At a fixed noise $\SNR \propto 1/z^2$, so $\sigma_z = z/\mathcal R$ grows as $z^3$: a mass twice as far
away is placed eight times less precisely in depth.

This answers the opening question. The width of the bump is what the data say about a scene that might hold anything.
Here the scene is known to hold one mass, so only four numbers are unknown, each measured by how far the whole pattern,
767 noise standard deviations strong, moves when that number changes. A bump about $z$ wide is located to its width
divided by its strength: $1\unit{m}/767 \approx 1.3\unit{mm}$.

## Two masses are hard to tell from one

We want the separation at which the camera can tell two masses from one, to set beside the millimetre.

Take two masses $\matter m/2$ a distance $\delta$ apart, at $x = \pm\delta/2$, against one mass $\matter m$ at their
centre, both at depth $z$. The pair's data are the average of the single mass's data shifted by $\pm\delta/2$, and
Taylor's formula to second order gives

$$\tfrac12\bigl[\curv d(x - \tfrac\delta2) + \curv d(x + \tfrac\delta2)\bigr] - \curv d(x) = \frac{\delta^2}{8}\,
\frac{\partial^2\curv d}{\partial x^2} + \dots$$

The first-order terms cancel (Figure [](#fig:pair)). The two scenes have the same mass and centre of mass, so they
first differ in their **quadrupole**, the two-lobed part of a body's field that falls as the inverse fourth power of the
distance
([section 2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)). The pair's quadrupole is proportional to $\matter m\delta^2$. The difference in the data is the fixed
pattern $\partial^2\curv d/\partial x^2$ times $\delta^2$, so

$$D = \kappa\,\mathcal R\,\frac{\delta^2}{z^2},$$

with $\kappa$ a pure number: 0.55 if the single mass is held fixed, and 0.34 if it may also change its depth and mass
to mimic the pair (box below). A camera that does not know the scene must allow the second, so we use 0.34.

**The numbers.** Solving for the separation gives $\delta = z\sqrt{D/\kappa\mathcal R}$.[^scale] The scale
$z/\sqrt{\mathcal R}$ is the separation at which $D = \kappa = 0.34$, far too small to decide: at $\mathcal R = 767$
and $z = 1\unit{m}$ it is 3.6 cm. The pair reaches $D = 1$ at 6.2 cm, and $D = 2$ at 8.8 cm, where the test is wrong
$P(Z > 1) = 16\%$ of the time: the camera that places one mass to 0.82 mm tells two masses from one, wrong one time in
six, only when they are about 9 cm apart. A shift changes the data in proportion to its size, a split in proportion to its square. At $\SNR = 10^6$ the scale $z/\sqrt{\mathcal R}$ falls to 1.1 mm: a few compact
masses can be resolved far more finely than an arbitrary scene, as sections 3.7 and 3.9 explain.

::: gap
This sketch skips the value of $\kappa$. With the single mass held fixed, $\kappa^2 = z^4\int(\partial^2\curv
d/\partial x^2)^2\,\dd^2a\,\big/\,64\int\curv d^{\,2}\,\dd^2a$, and $\kappa = 0.555$. If the single mass may change its
depth and mass, the part of the difference that those changes can produce is removed first, a projection treated in
section 3.4; numerically, $\kappa = 0.335$. "One mass or two" also compares two families of scenes, so $P(Z > D/2)$
holds only approximately.
:::

![Left, the datum $\curv d$ along the line through the masses, in units of $G\matter m/z^3$, for one mass $\matter m$
at depth $z$ under $x = 0$ and for two masses $\matter m/2$ at $x = \pm\delta/2$ with $\delta = 0.3z$: the two lie
nearly on top of each other. Right, the pair's data less the single mass's, drawn ten times taller, with the shape of
$\partial^2\curv d/\partial x^2$, and about four times smaller for $\delta = 0.15z$ (below, on the same scale).](tut-measure-pair){#fig:pair}

## A tremor far below the noise can still be detected

Every warm body trembles, and its interior can be read from the tremor (Part 4 derives its size).[^heat] The tremor is
a random signal with mean zero and a spectrum $S_s(\omega)$, added to noise of spectrum $S_n(\omega)$
([section 3.2](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies)). It has
no fixed shape to predict, so its only mark is extra power, and we ask how well that power can be detected when
$S_s \ll S_n$. This section is a sketch.

A record of length $T$ holds independent frequencies spaced $2\pi/T$ apart, so a band $\dd\omega$ holds
$T\,\dd\omega/2\pi$ of them (positive frequencies only). At each frequency the power $|\tilde y(\omega)|^2/T$ is one
reading. Its mean is $S_n$ without the tremor and $S_n + S_s$ with it (section 3.2); its standard deviation equals its mean
(box below). We write the tremor's spectrum as $S_s = A\,g(\omega)$, with $g$ a
fixed shape and the pure number $A$ its strength, the parameter. Each reading's mean then changes with $A$ at the
rate $g$, and its standard deviation is $S_n$ while $A$ is small, so by [](#eq:fisher) it adds $(g/S_n)^2$ to the
Fisher information. The frequencies add up to $F_A = T\int(g/S_n)^2\,\dd\omega/2\pi$. The record with the tremor lies
a step $A$ from the record without it, so $D = \sqrt{F_A}\,A$, which is

$$\boxed{D^2 \approx T\int_0^\infty\Bigl(\frac{S_s(\omega)}{S_n(\omega)}\Bigr)^2\frac{\dd\omega}{2\pi}} .$$

This is the **radiometer equation**, after the radiometers of radio astronomy that detect noise from the sky beneath
their receivers' own. For a flat ratio over a band of $B$ hertz, $D = (S_s/S_n)\sqrt{BT}$. A tremor a hundred times
weaker than the noise, over a kilohertz, reaches $D = 5$ when $BT = (5/0.01)^2 = 2.5\times10^5$, in 250 s.

**The cost of distance.** The forces of a tremor act inside the body, so they move neither its mass nor its centre of
mass. The first part of its field that can tremble is the quadrupole, whose pull falls as $r^{-4}$ with the distance
$r$ from the body and whose tide falls as $r^{-5}$. The spectrum is a mean square of the tide, so it falls as $r^{-10}$,
and the information holds the square of the spectrum, so it falls as $r^{-20}$. So
the observing time needed for a given precision grows as $r^{20}$: from 20 cm out to a metre it grows by
$5^{20} = 9.5\times10^{13}$, about $10^{14}$. A signal of fixed shape would cost only $5^{10}$, because its
information holds its amplitude squared.

::: gap
The sketch skips three steps (Kay, volume II, *Go deeper*). First, the real and imaginary parts of $\tilde n(\omega)$ are
independent Gaussian numbers of variance $TS/2$, and a Gaussian number of variance $v$ has $\langle x^4\rangle = 3v^2$,
so $|\tilde n|^2$ has the mean $TS$ and the variance $(TS)^2$. Second, the power is exponential, not Gaussian; its
score's variance, stated without proof, gives the same $(g/S_n)^2$. Third, neighbouring frequencies mix a little on a
finite record.
:::

**The idea to keep: how precisely a number can be measured depends on how fast the data change when the number
changes, measured in units of the noise. That is the Fisher information, and one over it bounds every unbiased
estimate.**

::: problems
### Practice

**[3.3]** Why can the position of one mass be measured far more finely than the width of its bump of tide?

::: solution
Precision depends on how fast the predicted data change with position, in units of the noise. Every reading under the
pattern changes a little, and together they move by one noise standard deviation for less than a millimetre.
:::

**[3.3]** What is $D$ for the safe at $\SNR = 100$, and how often is the camera then wrong?

::: solution
From the unrounded $D = 1.811$ at $\SNR = 10$, $D = 18.11$, so $P(Z > 9.056) = 6.8\times10^{-20}$.
:::

**[3.3]** At what signal-to-noise ratio is the safe's camera wrong once in a million choices? How much longer must it watch
than at $\SNR = 34$, if its noise is white?

::: solution
An error of $10^{-6}$ needs $D/2 = 4.75$, so $D = 9.51$ and $\SNR = 9.51/0.181 = 52.5$. The ratio grows as the
square root of the observing time (section 3.1), so the time grows by $(52.5/34.1)^2 = 2.4$: errors a thousand times
rarer cost less than three times the watching, because the Gaussian tail falls so fast.
:::

### Stretch

**[3.3]** The gradiometer of section 3.1, with $\sigma_n = 0.02\unit{E}$ per reading, reads at $t_i = 1, 2, \dots,
100\unit{s}$ while its reading drifts as $y = \alpha + \beta t$. Find the Fisher matrix of $\alpha$ and $\beta$, their
smallest errors, and the factor by which the unknown slope enlarges the error of $\alpha$. Repeat with time measured
from the middle of the run, $t_i' = t_i - 50.5\unit{s}$.

::: solution
The predictions are $f_i = \alpha + \beta t_i$, so $\partial f_i/\partial\alpha = 1$ and $\partial
f_i/\partial\beta = t_i$, and

$$F = \frac{1}{\sigma_n^2}\begin{pmatrix}N & \sum t_i\\ \sum t_i & \sum t_i^2\end{pmatrix} =
\frac{1}{\sigma_n^2}\begin{pmatrix}100 & 5050\\ 5050 & 338{,}350\end{pmatrix}.$$

Here $\gamma = 5050/\sqrt{100\times338{,}350} = 0.868$, so the slope enlarges the error of $\alpha$ by $1/\sqrt{1 -
\gamma^2} = 2.01$, from $0.002\unit{E}$ to $0.0040\unit{E}$; the slope is found to $6.9\times10^{-5}\unit{E\,s^{-1}}$.
With centred times $\sum t_i' = 0$, the matrix is diagonal, the intercept (the reading at mid-run) is found to
0.002 E, and the slope is unchanged.
:::

### The camera

**[3.3]** The gold bar's shape departs from a point of the same mass by only 0.6 standard deviations in the safe's
predicted readings at $\SNR = 10^3$. At what ratio would the camera tell the bar from a point of the same mass, at the
same place, with errors once in a thousand?

::: solution
For two fixed scenes, the separation grows in proportion to $\SNR$. Errors of $10^{-3}$ need $D = 2\times3.09 =
6.18$, ten times 0.6, so $\SNR \approx 10^4$ ($1.07\times10^4$ with the unrounded $D = 0.58$). A shape is a finer
detail than a place, so it costs more.
:::
:::

::: paper
- [*The precision of a simple scene*](/paper/#par:the-precision-of-a-simple-scene) (Section IV) states the three
  bounds, $\mathcal R$ and the two-mass scale $z/\sqrt{\mathcal R}$.
- [*A worked case*](/paper/#par:a-worked-case) (Section IV) and [*The worked
  inversion*](/paper/#par:the-worked-inversion) (Appendix A) give the safe's separation of 1.8 and its error rates.
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV) uses the information $T/r^{20}$ of a tremor.
- [Section VIII](/paper/#sec:one-pixel) gives Cramér–Rao bounds for one pixel, [](/paper/#eq:depth-bound).
- [Section IX](/paper/#sec:first-image) fits five shells to graviton counts by maximum likelihood, with Poisson
  counts in place of Gaussian noise.
:::

::: deeper
- S. M. Kay, *Fundamentals of Statistical Signal Processing*, volume I, *Estimation Theory* (1993), derives the
  Cramér–Rao bound for vectors and many models; volume II, *Detection Theory* (1998), treats tests between
  hypotheses and the detection of random signals.
- T. M. Cover and J. A. Thomas, *Elements of Information Theory* (2nd edition, 2006), chapter 11, places Fisher
  information beside entropy (section 3.8).
:::

[^blur]: Section [3.7](/tutorial/noise/blur-law/) finds that a camera which assumes nothing about the scene draws this
    mass as a blur 24° wide, 42 cm across. This section does not use that result.

[^precision]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in the paragraph
    [*The precision of a simple scene*](/paper/#par:the-precision-of-a-simple-scene); the safe is its
    [worked case](/paper/#par:a-worked-case), with the inputs of its Appendix A.

[^safe]: The bar is computed as a uniform box of gold; a point of the same mass gives $D = 1.805$.

[^model]: This is the model camera of the paper's Sec. IV, [](/paper/#eq:array-data).

[^scale]: The two-mass scale $z/\sqrt{\mathcal R}$ is the one given in the paper's Sec. IV.

[^heat]: First shown in *The gravitational camera* (Mohsenvand 2026), in the paragraph [*What heat reveals*](/paper/#par:what-heat-reveals), Sec. IV.

[^average]: The mean of $(y_i - f_i(\theta))^2 = (f_i(\theta_0) - f_i(\theta) + n_i)^2$ is $(f_i(\theta_0) -
    f_i(\theta))^2 + \sigma_n^2$, because $\langle n_i\rangle = 0$; the $\sigma_n^2$ goes into the constant.

[^weak]: The camera is a square 32 depths across, with pixels a quarter of a depth apart; the scatter is the
    root-mean-square error of one coordinate, against the bound $\sqrt{2/5}\,z/\mathcal R$.

[^weights]: Cauchy–Schwarz again shows why. With $v_l = (F^{-1})_{l1}$, $w_1 = v_kF_{kl}w_l$, whose square is at
    most $(v_kF_{kl}v_l)(w_kF_{kl}w_l) = (F^{-1})_{11}\,w_kF_{kl}w_l$. So no weights give more than $(F^{-1})_{11}$,
    and $w = v$ gives that.

