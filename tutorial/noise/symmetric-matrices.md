---
id: '3.4'
title: 'Symmetric matrices at work: eigen-decomposition, SVD, whitening, the Rayleigh quotient'
question: 'Which patterns of mass can an array of pixels measure well, which badly, and which not at all?'
part: '3'
requires: ['1.1', '1.4', '1.5', '1.5b', '2.5', '2.6', '2.7', '3.1', '3.2', '3.3']
paper: [sec:near-field, app:benchmarks, eq:array-data, eq:wiener, sec:pixel, eq:ranging-instant]
figures: []
live: [toy-camera, ring-matrix]
depth: A
---

An array of $11\times11$ pixels, a metre across, points at 324 kg of gold in one of two safes 3.5 m away. The data soon
say which safe holds it ([section 3.3](/tutorial/noise/measuring-a-number/)). Yet asked for an image that assumes
little beyond mass lying in the plane of the safes, the same data weigh the contents of a safe only to within
$\pm730$ kg, more than twice the gold.[^worked] Which patterns of mass can an array of pixels measure well, which
badly, and which not at all?

The answer is a list. A camera whose readings are proportional to the masses splits every scene into patterns, each
with its own gain, and for the safe's camera only 17 of 231 patterns stand above the noise. The list comes from the
eigen-decomposition of a symmetric matrix. Figure [](#fig:svd-hero) shows the list of an endless flat camera, whose
patterns are ripples.

![Seven ripples of mass, orange where the mass is above its mean and blue where it is below, from a broad swell on
the left to fine crests on the right ($q = kz$ from 1 to 12, as defined below); the bar over each is its gain against
the best ripple's, $q\,e^{1-q}$, on a log scale. The blue line is the noise at $\SNR = 10^3$, which the gains cross at
$q = 10.4$, so the faded ripple is lost. The uniform layer, $q = 0$, is not drawn, because its gain is zero.](tut-svd-hero){#fig:svd-hero}

::: plain
A camera that reads tides adds up the pulls of many small masses. This sum can be taken apart into patterns of mass,
each of which reaches the readings multiplied by its own number, its gain.

Patterns with large gains stand far above the noise and are measured well. Patterns with small gains are buried in the
noise, and recovering them means dividing by the small gain, which enlarges the noise too.

For a flat camera the patterns are ripples, waves of mass with their crests a fixed distance apart. The gain of a
ripple falls exponentially with its fineness, which is why the picture is blurred.
:::

## A symmetric matrix stretches space along perpendicular axes

Section [1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left) used a fact
without proof: a symmetric table has real eigenvalues and eigenvectors at right angles to one another. We prove it for
tables of any size, because the camera's tables have hundreds of rows.

A table is now a **matrix**, written as an italic capital, and a list of $n$ numbers is written in bold, as
$\mathbf x$. The product $T\mathbf x$ has the components $T_{ab}x_b$
([1.1](/tutorial/newton/vectors-and-indices/#a-table-of-nine-numbers-turns-one-arrow-into-another)). The
**transpose** $T^{\mathsf T}$ swaps rows and columns, and the transpose of a product is the product of the transposes
in the opposite order. The dot product is $\mathbf x^{\mathsf T}\mathbf y = x_ay_a$, and the **identity matrix** $I$
has ones on its diagonal and zeros elsewhere. Here $T$ is real and symmetric, $T^{\mathsf T} = T$, with $n$ rows and
columns.[^letters]

**The eigenvalues are real.** Suppose that $T\mathbf x = \lambda\mathbf x$, where at first $\lambda$ and $\mathbf x$
may be complex. We multiply on the left by $\bar{\mathbf x}^{\mathsf T}$, the row of complex conjugates:

$$\bar{\mathbf x}^{\mathsf T}T\mathbf x = \lambda\,\bar{\mathbf x}^{\mathsf T}\mathbf x .$$

The number $\bar{\mathbf x}^{\mathsf T}\mathbf x = |x_1|^2 + \dots + |x_n|^2$ is the
[Hermitian product](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero) of section
1.5b, real and positive. The left side is real too. Its complex conjugate is $\mathbf x^{\mathsf T}T\bar{\mathbf x}$,
because $T$ is real. This single number equals its own transpose $\bar{\mathbf x}^{\mathsf T}T^{\mathsf T}\mathbf x$,
which is the left side again because $T^{\mathsf T} = T$. So $\lambda$ is a ratio of two real numbers.[^complex] Then $T - \lambda I$ is real, and the eigenvectors can be taken real.

**Eigenvectors of different eigenvalues are perpendicular.** Let $T\mathbf u = \lambda\mathbf u$ and $T\mathbf v =
\mu\mathbf v$. Letting $T$ act once to the right and once, using $T^{\mathsf T} = T$, to the left,

$$\lambda\,\mathbf v^{\mathsf T}\mathbf u = \mathbf v^{\mathsf T}T\mathbf u = (T\mathbf v)^{\mathsf T}\mathbf u =
\mu\,\mathbf v^{\mathsf T}\mathbf u .$$

So $(\lambda - \mu)\,\mathbf v^{\mathsf T}\mathbf u = 0$, and if $\lambda \neq \mu$, then $\mathbf v^{\mathsf
T}\mathbf u = 0$.

**There is a full set of axes**, even when eigenvalues repeat. On the unit vectors the number $\mathbf x^{\mathsf
T}T\mathbf x$ has a largest value, reached at some $\mathbf u_1$ (the box below says why). Its gradient is $2T\mathbf
x$, because $\partial(x_aT_{ab}x_b)/\partial x_c = T_{cb}x_b + x_aT_{ac}$ and $T_{ac} = T_{ca}$. A small step
$\varepsilon\mathbf y$ from $\mathbf u_1$, with $\mathbf y$ perpendicular to $\mathbf u_1$, changes the squared length
only in second order, to $1 + \varepsilon^2|\mathbf y|^2$, but changes $\mathbf x^{\mathsf T}T\mathbf x$ by
$2\varepsilon\,\mathbf y^{\mathsf T}T\mathbf u_1$ in first order. At a largest value this change must vanish, so
$T\mathbf u_1$ has no part across $\mathbf u_1$, and $T\mathbf u_1 = \lambda_1\mathbf u_1$. If $\mathbf x$ is perpendicular to $\mathbf u_1$, so is $T\mathbf x$, because $\mathbf
u_1^{\mathsf T}T\mathbf x = (T\mathbf u_1)^{\mathsf T}\mathbf x = \lambda_1\mathbf u_1^{\mathsf T}\mathbf x = 0$. So the
argument works among the directions perpendicular to $\mathbf u_1$, and repeating it gives $n$ perpendicular
eigenvectors.

::: gap
This proof skips one theorem: a continuous function on the unit vectors, a closed and bounded set, reaches a largest
value somewhere.
:::

We put the unit eigenvectors as the columns of a matrix $Q$ and the eigenvalues on the diagonal of a matrix
$\Lambda$, so that $TQ = Q\Lambda$. The columns are perpendicular unit vectors, so $Q^{\mathsf T}Q = QQ^{\mathsf T} =
I$: $Q$ is an [orthogonal matrix](/tutorial/newton/vectors-and-indices/#turning-the-axes-changes-the-components-not-the-arrow),
a turn of the axes. Multiplying on the right by $Q^{\mathsf T}$ gives the **spectral theorem**:

$$\boxed{\;T = Q\Lambda Q^{\mathsf T} = \sum_i\lambda_i\,\mathbf u_i\mathbf u_i^{\mathsf T} .\;} \label{eq:spectral}$$

Read from right to left, $T\mathbf x$ turns $\mathbf x$ into the eigen-axes, stretches each component by its
eigenvalue, and turns back. Sandwiching between $\mathbf x^{\mathsf T}$ and $\mathbf x$ gives

$$\mathbf x^{\mathsf T}T\mathbf x = \sum_i\lambda_i\,c_i^2, \qquad c_i = \mathbf u_i^{\mathsf T}\mathbf x .
\label{eq:quadratic}$$

**An example: the tide of one mass.** The tide of a mass $\matter M$ at a distance $r$ is $\curv{\tE}
= (G\matter M/r^3)(I - 3\hat n\hat n^{\mathsf T})$, and $I - 3\hat n\hat n^{\mathsf T} = -2\,\hat n\hat n^{\mathsf T} +
(I - \hat n\hat n^{\mathsf T})$. The bracket is the projector across $\hat n$ (section 1.1), the sum of $\mathbf u\mathbf
u^{\mathsf T}$ over two perpendicular unit vectors across it, so this is [](#eq:spectral) with the eigenvalues $-2$,
$1$, $1$ in units of $G\matter M/r^3$. For the person of 70 kg at 1 m they are $-9.3$ and $+4.7$ (twice) in eötvös: a stretch along the line and two squeezes
across it.

**A non-example: a shear.** The matrix $\bigl(\begin{smallmatrix}1&1\\0&1\end{smallmatrix}\bigr)$ has the eigenvalue 1
twice, but subtracting $I$ leaves $\bigl(\begin{smallmatrix}0&1\\0&0\end{smallmatrix}\bigr)$, which sends $(x_1,
x_2)$ to $(x_2, 0)$ and is zero only along $(1, 0)$: the shear has one eigen-direction. It is not symmetric. Its
antisymmetric part turns every arrow a quarter turn
([section 1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise)). A symmetric matrix
has no such part, so it stretches and squeezes along its axes and never turns (Figure [](#fig:sym-ellipse)).

![The unit circle (dashed) and its image, an ellipse, under the symmetric matrix on the left and the shear on the
right; thin arrows are unit vectors on the circle and heavy arrows of the same colour are their images, orange for the
longer axis of each ellipse and blue for the shorter. The symmetric matrix sends its eigenvectors along their own
lines, three times as long and once as long, while the shear sends the perpendicular pair at 58° and 148° onto its
axes, 1.62 and 0.62 long, at 32° and 122°, so that the pair turns. The shear's one eigen-direction, along $(1, 0)$,
is its own image and is not an axis of its ellipse.](tut-sym-ellipse){#fig:sym-ellipse}

**Positive matrices.** A symmetric matrix is **positive definite** when $\mathbf x^{\mathsf T}T\mathbf x > 0$ for
every nonzero $\mathbf x$, and **positive semidefinite** when $\mathbf x^{\mathsf T}T\mathbf x \ge 0$; by
[](#eq:quadratic), when no eigenvalue is negative. Every covariance matrix is positive semidefinite, because $\mathbf w^{\mathsf T}C\mathbf w$ is the variance of the
weighted sum $w_ax_a$ ([section 3.1](/tutorial/noise/probability/#covariance-describes-noise-that-two-readings-share)). A positive definite matrix has the inverse
$T^{-1} = Q\Lambda^{-1}Q^{\mathsf T}$, with the same axes and the eigenvalues $1/\lambda_i$.

**The Cramér–Rao bound for every combination.** Section
[3.3](/tutorial/noise/measuring-a-number/#an-unknown-we-do-not-want-can-only-enlarge-the-error-of-one-we-do) bounded
the error of one estimate $\hat\theta_1$. We want the variance of any combination $\mathbf w^{\mathsf
T}\hat{\boldsymbol\theta}$, with fixed weights $\mathbf w$, assuming that **the estimates are unbiased whatever the
parameters are** and that **the Fisher matrix $F$ is positive definite**. As there, $\mathrm{Cov}(\hat\theta_k, U_l)
= 1$ for $k = l$ and 0 otherwise, where $U_l$ is the score of $\theta_l$. A combination $Y = \beta_lU_l$ of the scores
has $\mathrm{Cov}(\mathbf w^{\mathsf T}\hat{\boldsymbol\theta}, Y) = \mathbf w^{\mathsf T}\boldsymbol\beta$ and
$\mathrm{Var}\,Y = \boldsymbol\beta^{\mathsf T}F\boldsymbol\beta$, and the Cauchy–Schwarz inequality gives

$$\mathrm{Var}(\mathbf w^{\mathsf T}\hat{\boldsymbol\theta}) \ge \frac{(\mathbf w^{\mathsf
T}\boldsymbol\beta)^2}{\boldsymbol\beta^{\mathsf T}F\boldsymbol\beta} .$$

We choose $\boldsymbol\beta = F^{-1}\mathbf w$. Because $F^{-1}$ is symmetric, $\mathbf w^{\mathsf T}\boldsymbol\beta$
and $\boldsymbol\beta^{\mathsf T}F\boldsymbol\beta$ both equal $\mathbf w^{\mathsf T}F^{-1}\mathbf w$, and so does the
right side. The left side is $\mathbf w^{\mathsf T}\mathrm{Cov}(\hat{\boldsymbol\theta})\,\mathbf w$. One symmetric matrix is **at least** another when their difference is positive semidefinite, so the bound for every $\mathbf
w$ reads

$$\boxed{\;\mathrm{Cov}(\hat{\boldsymbol\theta}) \ge F^{-1} .\;}$$

The weights $(1, 0, \dots, 0)$ give back $(F^{-1})_{11}$. Equality holds for the least-squares estimate of a linear
model with Gaussian noise: its error is $F^{-1}$ times the list of scores, whose covariance is $F$, so the error's
covariance is $F^{-1}FF^{-1} = F^{-1}$.

## Every square matrix is triangular in some set of perpendicular complex axes

A matrix that is complex, or not symmetric, may have no set of perpendicular eigen-axes at all, as the shear showed.
One weaker fact still holds for every square matrix: in suitable axes it is triangular. We prove it here, because the
proof repeats the step of the spectral theorem, one eigenvector at a time.

Here $X$ is any square matrix with $n$ rows and complex entries. The **conjugate transpose** $X^\dagger = \bar
X^{\mathsf T}$ takes the complex conjugate of every entry and swaps rows and columns, so the Hermitian product of
section 1.5b is $\mathbf x^\dagger\mathbf y = \bar x_ay_a$, and two complex vectors are **perpendicular** when it
vanishes. A matrix $U$ whose columns are $n$ perpendicular complex unit vectors, $\mathbf u_a^\dagger\mathbf u_b =
\delta_{ab}$, is **unitary**: $U^\dagger U = I$, so $U^{-1} = U^\dagger$. A turn of the axes is a unitary matrix whose
entries are real. A matrix is **upper triangular** when every entry below its diagonal is zero.

**Schur's theorem.** For every complex square matrix $X$ there is a unitary $U$ with

$$\boxed{\;X = U\Delta U^\dagger ,\qquad \Delta \text{ upper triangular},\;} \label{eq:schur}$$

and the diagonal of $\Delta$ holds the eigenvalues of $X$.[^schur] We prove it by induction on $n$. For $n = 1$ there is
nothing to prove. Suppose that it holds for $n - 1$. The determinant $\det(X - \lambda I)$ is a polynomial of degree
$n$ in $\lambda$, so it has a complex root $\lambda_1$ (the box below). A matrix with zero determinant sends some
nonzero vector to zero, so $X\mathbf x = \lambda_1\mathbf x$ for some $\mathbf x \ne 0$, and $\mathbf u_1 = \mathbf
x/\sqrt{\mathbf x^\dagger\mathbf x}$ is a unit eigenvector. We make it the first of $n$ perpendicular unit vectors: we
add the $n - 1$ coordinate axes other than one along which $\mathbf u_1$ has a nonzero component, subtract from each
new vector its shadows $(\mathbf u_b^\dagger\mathbf v)\,\mathbf u_b$ on the vectors already made, and divide it by
its length. These are the columns of a unitary $U_1$. The entry $a1$ of $U_1^\dagger XU_1$ is $\mathbf
u_a^\dagger X\mathbf u_1 = \lambda_1\mathbf u_a^\dagger\mathbf u_1 = \lambda_1\delta_{a1}$, so its first column is
$\lambda_1$ followed by zeros:

$$U_1^\dagger XU_1 = \begin{pmatrix}\lambda_1 & \mathbf w^\dagger\\ \mathbf 0 & X'\end{pmatrix},$$

with some row $\mathbf w^\dagger$ and a matrix $X'$ of $n - 1$ rows. By the assumption, $X' = U'\Delta'U'^\dagger$ with
$U'$ unitary and $\Delta'$ upper triangular. The matrix $U = U_1\bigl(\begin{smallmatrix}1&\mathbf 0\\ \mathbf
0&U'\end{smallmatrix}\bigr)$ is unitary, as a product of two unitary matrices, and multiplying out the blocks gives

$$U^\dagger XU = \begin{pmatrix}\lambda_1 & \mathbf w^\dagger U'\\ \mathbf 0 & U'^\dagger X'U'\end{pmatrix} =
\begin{pmatrix}\lambda_1 & \mathbf w^\dagger U'\\ \mathbf 0 & \Delta'\end{pmatrix},$$

which is upper triangular. The determinant of a triangular matrix is the product of its diagonal entries, so
$\det(\Delta - \lambda I) = \prod_a(\Delta_{aa} - \lambda)$. It equals $\det(X - \lambda I)$, because $X - \lambda I =
U(\Delta - \lambda I)U^\dagger$ and $\det U\,\det U^\dagger = \det(U^\dagger U) = 1$. So the $\Delta_{aa}$ are the
eigenvalues of $X$, each as often as it repeats.

::: gap
This proof skips one theorem, the fundamental theorem of algebra: every polynomial of degree one or more has a complex
root.
:::

**A check: symmetric matrices.** If $X$ is real and symmetric, then $X^\dagger = X$, so $\Delta^\dagger = U^\dagger
X^\dagger U = \Delta$. An upper triangular matrix equal to its own conjugate transpose has nothing above its diagonal
either, and real numbers on it, so $\Delta$ is diagonal and [](#eq:schur) is the spectral theorem [](#eq:spectral)
again.

**What it is used for.** The squared sizes of all the entries add up to $\sum_{ab}|X_{ab}|^2 = \mathrm{tr}(X^\dagger
X)$, and a unitary change of axes keeps this sum. The trace of a product does not change when the factors are cycled,
$\mathrm{tr}(YZ) = Y_{ab}Z_{ba} = \mathrm{tr}(ZY)$ for any two matrices $Y$ and $Z$, so
$\mathrm{tr}(U\Delta^\dagger\Delta U^\dagger) = \mathrm{tr}(\Delta^\dagger\Delta\,U^\dagger U) =
\mathrm{tr}(\Delta^\dagger\Delta)$, and

$$\sum_{ab}|X_{ab}|^2 = \sum_a|\lambda_a|^2 + \sum_{a<b}|\Delta_{ab}|^2 \ge \sum_a|\lambda_a|^2 ,$$

with equality only when $\Delta$ is diagonal. The shear is its own triangular form, with $U = I$: its entries give
$1 + 1 + 1 = 3$, its eigenvalues $1 + 1 = 2$, and the excess, $|\Delta_{12}|^2 = 1$, is the part that no unitary change
of axes removes. This inequality shows that one observer, the field's principal observer, reads the least
$|\curv{\tE}|^2 + |\curv{\tB}|^2$ of all observers at a place
([section 9.3](/tutorial/one-point/the-matrix-w/#ten-numbers-are-four-invariants-three-angles-and-a-velocity)).

## The Rayleigh quotient finds the strongest and weakest directions

We want the directions in which a symmetric matrix acts most and least strongly. For a nonzero $\mathbf x$ the
**Rayleigh quotient** is

$$\sym{rayleigh-quotient}{R_T}(\mathbf x) = \frac{\mathbf x^{\mathsf T}T\mathbf x}{\mathbf x^{\mathsf T}\mathbf x} ,$$

in the unit of the entries of $T$. It depends only on the direction of $\mathbf x$. We number the eigenvalues from the
largest, $\lambda_1 \ge \dots \ge \lambda_n$. Turning the axes keeps lengths, so $\mathbf x^{\mathsf T}\mathbf x =
\sum_ic_i^2$, and by [](#eq:quadratic) $R_T$ is an average of the eigenvalues with weights $c_i^2/\sum_jc_j^2$, not negative and adding to one, so

$$\boxed{\;\lambda_n \le R_T(\mathbf x) \le \lambda_1 ,\;}$$

with the bounds reached along the bottom and the top eigenvectors. By the gradient $2T\mathbf x$ and the rule for a
quotient, the gradient of $R_T$ is $2(T\mathbf x - R_T\mathbf x)/\mathbf x^{\mathsf T}\mathbf x$, which vanishes
exactly at eigenvectors. So near an eigen-axis the quotient changes only in second order: in two dimensions, at the angle $\vartheta$ from
$\mathbf u_1$, $R_T = \lambda_1 - (\lambda_1 - \lambda_2)\sin^2\vartheta$ (Figure [](#fig:sym-rayleigh)). The lower
bound is Rayleigh's method (section 4.3): stiffness over mass, for any trial shape of vibration, overestimates the
square of a body's lowest frequency.

**The ring's greatest stretch.** A ball of the ring at unit distance in the direction $\vect\xi$ is pushed by
$-\curv{\tE}\vect\xi$
([section 1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)),
whose outward part is $-R_{\curv{\tE}}(\vect\xi)$. It is largest along the eigenvector of the most negative
eigenvalue, which beside the person is the line to the person: one reading gives the line on which a body lies.

**The worst-measured combination.** Section 3.3 found the Fisher matrix of the depth $z$ and mass $\matter m$ of one
mass below a flat camera. In the relative changes $\mathbf x = (\delta z/z, \delta\matter m/\matter m)$ it is $F =
\mathcal R^2\bigl(\begin{smallmatrix}5&-2\\-2&1\end{smallmatrix}\bigr)$, with $\mathcal R$ the signal-to-noise ratio of
the whole pattern, and $\mathbf x^{\mathsf T}F\mathbf x$ is the squared distance, in noise standard deviations, by
which $\mathbf x$ moves the data. The eigenvalues are $\mathcal R^2(3 \pm 2\sqrt2)$, or $5.83\,\mathcal R^2$ and
$0.172\,\mathcal R^2$. The smaller belongs to $\delta\matter m/\matter m = (1 + \sqrt2)\,\delta z/z$, a mass deeper and
heavier at once. Because $F^{-1}$ has the same axes with the eigenvalues $1/\lambda_i$, the bound along a unit
eigenvector is $1/\sqrt{\lambda_i}$: $2.41/\mathcal R$ along this combination, six times the $0.41/\mathcal R$ across it.

![Above, a unit probe $\mathbf x$ at the angle $\vartheta$ from the horizontal, under the symmetric matrix with the
eigenvalue $-2$ along the line at 30° (orange) and $1$ along the line at 120° (blue); the dotted drop from $T\mathbf x$
meets the probe's line at $R_T(\mathbf x) = 0.65$. Below, $R_T$ as the probe turns through half a turn, a cosine wave
that stays between the two eigenvalues (dashed); the dot at 100° is the probe drawn above.](tut-sym-rayleigh){#fig:sym-rayleigh}

## Whitening turns shared noise into independent noise of unit size

Section 3.3 assumed readings with independent noises of one size. We want to bring any Gaussian readings to that form.
We assume that **the noise $\mathbf n$ has mean zero and a positive definite covariance
matrix** $C = \langle\mathbf n\mathbf n^{\mathsf T}\rangle$, so that $C = Q\Lambda Q^{\mathsf T}$ with every
$\lambda_i > 0$. The **whitening** matrix is

$$\sym{whitening-matrix}{W} = \Lambda^{-1/2}Q^{\mathsf T} ,$$

where $\Lambda^{-1/2}$ is diagonal with the entries $1/\sqrt{\lambda_i}$. The covariance of $W\mathbf n$ is
$WCW^{\mathsf T}$, and with $Q^{\mathsf T}Q = I$ twice,

$$WCW^{\mathsf T} = \Lambda^{-1/2}\,Q^{\mathsf T}Q\,\Lambda\,Q^{\mathsf T}Q\,\Lambda^{-1/2} = I .$$

The whitened noises are uncorrelated, with a standard deviation of one each. Zero covariance does not in general mean
independence, but for Gaussian noise it does, since weighted sums of Gaussian readings are Gaussian (stated without
proof). **A check:** for independent noises of one size, $C = \sigma_n^2I$ and $W = I/\sigma_n$, the division of
section 3.3.

**A number: the two accelerometers.** The gradiometer of section 3.1 reads two accelerometers that share the shaking of
their table, of standard deviation $\sigma_u$, each with its own noise of equal size $\sigma_n$:

$$C = \begin{pmatrix}\sigma_u^2 + \sigma_n^2 & \sigma_u^2\\ \sigma_u^2 & \sigma_u^2 + \sigma_n^2\end{pmatrix} .$$

Its eigenvectors are $(1, 1)/\sqrt2$, with eigenvalue $2\sigma_u^2 + \sigma_n^2$, and $(1, -1)/\sqrt2$, with
$\sigma_n^2$. The second whitened reading is $(a_1 - a_2)/(\sqrt2\,\sigma_n)$: whitening finds the gradiometer's difference. With the correlation of section 3.1, $\sigma_u^2/(\sigma_u^2 + \sigma_n^2) = 0.98$, $\sigma_u^2 = 49\,\sigma_n^2$, and the sum carries 99 times the noise variance of the difference.

**Signal against noise.** When the scene is random too
([section 3.2](/tutorial/noise/random-signals/#randomly-placed-masses-are-a-noise-too)), its signal has a covariance
$C_{\rm sig}$. The combination $\mathbf v^{\mathsf T}W\mathbf y$ of whitened readings has the squared signal-to-noise ratio
$\mathbf v^{\mathsf T}WC_{\rm sig}W^{\mathsf T}\mathbf v/\mathbf v^{\mathsf T}\mathbf v$, a Rayleigh quotient, so the
best combinations are the eigenvectors of $WC_{\rm sig}W^{\mathsf T}$. Before whitening this reads $C_{\rm sig}\mathbf
w = \lambda\,C\mathbf w$, a **generalized eigenproblem**, which section 3.5 solves for the flat camera.

## In whitened data, fitting a nuisance is a projection

A nuisance parameter enlarges an error by the factor $1/\sqrt{1 - \gamma^2}$, with $\gamma$ the correlation between
the scores of the two parameters (section 3.3), and the box on two masses there removed the part of the difference that
the nuisance can produce. We want to see both as geometry. In whitened data a small change of $\theta_k$ moves
the expected readings $\mathbf f$ along $\mathbf t_k = \partial(W\mathbf f)/\partial\theta_k$, in noise standard
deviations per unit of $\theta_k$, and $F_{kl} = \mathbf t_k^{\mathsf T}\mathbf t_l$.

A change of $\theta_2$ can mimic the shadow of $\mathbf t_1$ on $\mathbf t_2$. The
[projector](/tutorial/newton/vectors-and-indices/#a-table-of-nine-numbers-turns-one-arrow-into-another) $P = I -
\hat{\mathbf t}_2\hat{\mathbf t}_2^{\mathsf T}$, with $\hat{\mathbf t}_2 = \mathbf t_2/|\mathbf t_2|$, removes it and
leaves

$$|P\mathbf t_1|^2 = |\mathbf t_1|^2 - (\mathbf t_1^{\mathsf T}\hat{\mathbf t}_2)^2 = F_{11} - \frac{F_{12}^2}{F_{22}} =
F_{11}\,(1 - \gamma^2) ,$$

where $\gamma = F_{12}/\sqrt{F_{11}F_{22}}$ is the cosine of the angle between $\mathbf t_1$ and $\mathbf t_2$. This is
$1/(F^{-1})_{11}$ of section 3.3, so

$$\boxed{\;(F^{-1})_{11} = \frac{1}{|P\mathbf t_1|^2} .\;}$$

A parameter is measured only by the part of its signal that no nuisance can produce; with several nuisances $P$
removes the shadow on all of them (stated without proof). **A number:** with $\theta_1 = z$ and $\theta_2
= \matter m$, $|\mathbf t_1|^2 = 5\mathcal R^2/z^2$ and the projection leaves $\mathcal R^2/z^2$, so the error grows
from $z/(\sqrt5\,\mathcal R)$ to $z/\mathcal R$. In the
[box on two masses](/tutorial/noise/measuring-a-number/#two-masses-are-hard-to-tell-from-one) of section 3.3, the same
projection lowers $\kappa$ from 0.555 to 0.335.

## Every linear camera is a set of patterns, gains and blind spots

We want to describe any camera whose readings are proportional to the masses. Its matrix is neither square nor
symmetric, so we start with one small enough to write down.

**A camera of three pixels.** Three pixels in a row, 1 m apart, read $\curv d = -\curv{\tE}_{zz}$ above three masses
in a row at the depth $z = 1\unit{m}$, a distance $\delta$ apart, the middle one under the middle pixel. By
[section 3.3](/tutorial/noise/measuring-a-number/#one-mass-a-metre-away-is-placed-to-a-millimetre), a kilogram at the distance
$a$ along the row gives a pixel $g_z(a) = G(2z^2 - a^2)/(z^2 + a^2)^{5/2}$, so the camera's matrix has the entries
$A_{ab} = g_z(x_a - x'_b)$, with $x_a$ the place of pixel $a$ and $x'_b$ that of mass $b$. The decomposition below
gives three gains, in units of $G/z^3 = 6.7\times10^{-11}\unit{s^{-2}}$ per kilogram:

| $\delta$ | first gain | second gain | third gain |
|:--|:--|:--|:--|
| 1 m | 2.23 | 2.04 | 1.73 |
| 0.5 m | 2.58 | 1.01 | 0.63 |
| 0.25 m | 3.14 | 0.43 | 0.14 |
| 0.1 m | 3.43 | 0.16 | 0.021 |

The first pattern has mass of one sign in all three places, close to a uniform row. The second is $(-1, 0,
1)/\sqrt2$, mass moved from one side to the other. The third sets the middle against the two sides. As the masses crowd
together the second gain falls in proportion to $\delta$ and the third to $\delta^2$: the two masses of section 3.3
differ from one by a signal that grows as the square of their separation.

::: try {#toy-camera}
The camera of three pixels, with its patterns and its three gains beside a line for the noise. Predict first, then
move the masses together and watch which patterns sink below the noise.
:::

**The decomposition.** We assume that **the camera is linear**: $\mathbf y = A\matter{\mathbf m} + \mathbf n$, with $N$
readings in $\mathbf y$ and $K$ masses in $\matter{\mathbf m}$. The **design matrix** $\sym{design-matrix}{A}$ has $N$
rows and $K$ columns, and column $k$ is what a kilogram in cell $k$ gives the readings. Whitening the readings turns
$A$ into $WA$, so that gains count noise standard deviations; for noise of one size it only divides $A$ by
$\sigma_n$. The $K\times K$ matrix $A^{\mathsf T}A$ is symmetric and positive semidefinite, since $\mathbf x^{\mathsf T}A^{\mathsf T}A\mathbf x = |A\mathbf x|^2$. By [](#eq:spectral)
it has perpendicular unit eigenvectors $\mathbf v_i$, with eigenvalues that we write $s_i^2$, from the largest. For
each $s_i > 0$ we define $\mathbf u_i = A\mathbf v_i/s_i$. These are perpendicular unit vectors too:

$$\mathbf u_i^{\mathsf T}\mathbf u_j = \frac{\mathbf v_i^{\mathsf T}A^{\mathsf T}A\mathbf v_j}{s_is_j} =
\frac{s_j^2\,\mathbf v_i^{\mathsf T}\mathbf v_j}{s_is_j} = \delta_{ij} .$$

Any scene is $\matter{\mathbf m} = \sum_i\mathbf v_i(\mathbf v_i^{\mathsf T}\matter{\mathbf m})$. Applying $A$, each
term with $s_i > 0$ gives $s_i\mathbf u_i$, and each with $s_i = 0$ gives nothing, because $|A\mathbf v_i|^2 = s_i^2$.
So

$$\boxed{\;A = \sum_{s_i > 0}s_i\,\mathbf u_i\mathbf v_i^{\mathsf T} = U\Sigma V^{\mathsf T} ,\;} \label{eq:svd}$$

the **singular value decomposition**. The columns of $U$ are the $\mathbf u_i$, those of $V$ the $\mathbf v_i$, and
$\Sigma$ is diagonal with the $s_i$, one column for each nonzero gain; this compact form leaves the zero gains out. The
$\sym{singular-value}{s_i}$ are the **singular values**, and the $\mathbf v_i$ and $\mathbf u_i$ the **singular
vectors**. The camera takes each scene pattern $\mathbf v_i$, multiplies it by its gain $s_i$, and lays the result along its
reading pattern $\mathbf u_i$; different patterns never mix. The number of nonzero gains is
the **rank** of $A$. The patterns with zero gain form the **null space** of $A$, the scenes that give no reading at
all, as in
[section 2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see)
for the field outside a body (Figure [](#fig:svd-spaces)).

![Left, the scenes, split into the plane of the patterns $\mathbf v_1$ and $\mathbf v_2$, which have gains, and the
null space at right angles to it; right, the readings, split into the plane of $\mathbf u_1$ and $\mathbf u_2$, where
every signal lands, and the rest, which only noise reaches. The camera carries each $\mathbf v_i$ to $s_i\mathbf u_i$
and every scene of the null space to zero. The camera drawn has three cells and three readings, with $s_1 = 1.5$ and $s_2 = 0.6$; the safe's scenes have 231
numbers and its readings 605.](tut-svd-spaces){#fig:svd-spaces}

The two decompositions differ:

| | eigenvalues $\lambda_i$ | singular values $s_i$ |
|:--|:--|:--|
| of | a square matrix | any matrix |
| sign | any (real if symmetric) | never negative |
| vectors | one set, $T\mathbf u = \lambda\mathbf u$ | two sets, $A\mathbf v = s\,\mathbf u$ |
| the person's tide, $10^{-9}\unit{s^{-2}}$ | $-9.3$, $4.7$, $4.7$ | $9.3$, $4.7$, $4.7$ |

For a symmetric matrix the singular values are the sizes of the eigenvalues, because $T^{\mathsf T}T =
Q\Lambda^2Q^{\mathsf T}$. A turn of the axes, whose transpose is its inverse, has every gain equal to one.

**A number: the locked safe.** The safe's camera has $N = 605$ readings, five components of the tide at 121 pixels, and
$K = 231$ cells 25 cm apart on a patch 5 m by 2.5 m in the plane of the safes. A safe's mass is the sum over the twelve
cells of its footprint. At $\SNR = 10^3$ the noise is $3.5\times10^{-11}\unit{s^{-2}}$ (0.035 eötvös) per component.
Before looking at the data we assume that each cell holds about 324 kg either way, its **prior** (section 3.5). Counting
each cell's mass in units of 324 kg, a **whitened gain** of one means that a pattern of the expected size moves the
whitened readings by one noise standard deviation. The largest whitened gain is
2100, twelve exceed 10, and only 17 exceed one. The smallest are below $10^{-16}$ of the largest, under the computer's rounding error.[^code] Mass can move among
the 214 weak patterns while the readings change by less than their noise, so the image cannot weigh either safe to
better than several hundred kilograms.

The weak patterns are fine ones, which move mass between neighbouring cells. The uniform layer is not among them: mass
spread evenly over this patch, a few metres from the camera, has the whitened gain 1950, 0.94 of the largest.

## For a flat array the patterns are ripples

We assume **a row of $N$ pixels above $N$ cells that
repeats with the period of the row**, so that what cell $l$ gives pixel $j$ depends only on $j - l$, counted round the
period: $A_{jl} = g(j - l)$. The function $g$ is the camera's **kernel**, the reading that one kilogram gives a pixel
at a given distance along the row. Each row of $A$ is the one above shifted by one place, and such a matrix is
**circulant**.

A **ripple** is the pattern with the components $e_l = e^{2\pi inl/N}$, whose real part, by Euler's formula
([section 1.5b](/tutorial/newton/complex-numbers/#eulers-formula-a-turn-is-an-exponential)), is a cosine wave with $n$
crests along the row; [section 2.6](/tutorial/outside/fourier/#a-repeating-pattern-is-a-sum-of-ripples) builds every
pattern from ripples. We put a ripple into the camera and write $p = j - l$:

$$\sum_lg(j - l)\,e^{2\pi inl/N} = e^{2\pi inj/N}\sum_pg(p)\,e^{-2\pi inp/N} = \tilde g_n\,e_j .$$

The sum over $p$ covers one whole period whatever $j$ is, so $\tilde g_n$ does not depend on $j$: every ripple is an
eigenvector, with the eigenvalue $\tilde g_n$. Two different ripples $n$ and $n'$ are perpendicular in the Hermitian
product, a geometric sum: with
$\rho = e^{2\pi i(n' - n)/N}$,

$$\sum_{l=0}^{N-1}\rho^l = \frac{1 - \rho^N}{1 - \rho} = 0 ,$$

because $\rho^N = 1$ and $\rho \ne 1$. This is the sampled form of the **convolution theorem** of section 2.6: a blur that
treats every place alike multiplies each ripple by its own number, the kernel's transform $\tilde g$. When the kernel
is even, as the tide of a mass below is, the circulant matrix is symmetric, so the gains are the sizes $|\tilde g_n|$.

On an endless plane the sum becomes an integral. A ripple of surface density, mass per unit area, whose **wavenumber**
$k$ is $2\pi$ divided by the distance between its crests, reaches the readings at the height $z$ multiplied by
$2\pi G\,k\,e^{-kz}$ ([section 2.6](/tutorial/outside/fourier/#a-blur-multiplies-each-ripple-by-a-number) states it,
and [section 2.7](/tutorial/outside/evanescent/) derives it):

$$\tilde{\curv d}(\vect k) = 2\pi G\,k\,e^{-kz}\,\tilde{\matter\sigma}(\vect k) + \tilde n(\vect k).$$[^arraydata]

Here $\tilde{\curv d}$, $\tilde{\matter\sigma}$ and $\tilde n$ are the amounts of the ripple in the readings, the
surface density and the noise. The factor $e^{-kz}$ is the fading of fine detail with distance, and the factor $k$
comes from reading a tide, a second derivative.

**A number.** With $\sym{kz}{q} = kz$, the gain is proportional to $q\,e^{-q}$, largest at $q = 1$, where its
derivative $(1 - q)\,e^{-q}$ vanishes. Relative to that best ripple the gain is $q\,e^{1-q}$: $1/810$ at $q = 10$,
crests $0.63\,z$ apart, and $1/(8.9\times10^6)$ at $q = 20$. Whitened, and counted against a prior that expects a mass
$\matter m$ on each patch $z$ on a side, the gain becomes the $s = \pi\SNR\,q\,e^{-q}$ of
[section 3.7](/tutorial/noise/blur-law/#step-2-each-ripple-stands-above-its-noise-by-a-factor-that-depends-on-two-numbers),
a whitened gain for each ripple. Its $\pi$ is the $2\pi$ of $2\pi G\,k\,e^{-kz}$, whose 2 is in
$\SNR = 2G\matter m/(z^2\sqrt{N_0})$ (section 3.3).

**The blind spot.** At $k = 0$ the gain is exactly zero, so under an endless flat camera the uniform layer is in the
null space: a uniform sheet is invisible
([section 2.5](/tutorial/outside/null-space/#a-uniform-sheet-is-invisible-to-a-tidal-camera)). An endless even sheet
pulls with the same force at every height, so it makes no tide; a finite patch, such as the safe's, is no such sheet. The finest
ripples are lost to the noise, not invisible, because their gains fall exponentially but never reach zero. Bodies with depth have many more blind patterns, since mass can be moved inside a body in endless ways that change
nothing outside it (section 2.5).

## Dividing by a small gain multiplies the noise

By [](#eq:svd) the reading pattern $\mathbf u_i$ holds $s_i(\mathbf v_i^{\mathsf T}\matter{\mathbf m})$, so to find the
scene that best explains the data we divide by $s_i$ for each pattern with $s_i > 0$:

$$\begin{aligned}
\hat{\matter{\mathbf m}} &= \sum_{s_i > 0}\frac{\mathbf u_i^{\mathsf T}\mathbf y}{s_i}\,\mathbf v_i\\ &= \sum_{s_i >
0}\Bigl(\mathbf v_i^{\mathsf T}\matter{\mathbf m} + \frac{\mathbf u_i^{\mathsf T}\mathbf n}{s_i}\Bigr)\mathbf v_i .
\end{aligned}$$

The matrix that does this is the **pseudo-inverse** $A^+ = \sum_{s_i > 0}\mathbf v_i\mathbf u_i^{\mathsf T}/s_i$. For a
whitened camera each $\mathbf u_i^{\mathsf T}\mathbf n$ is unit noise seen along a unit vector, of standard deviation
one, so

$$\boxed{\;\text{the pattern } \mathbf v_i \text{ is recovered with the noise } 1/s_i ,\;}$$

and the null space is not recovered at all. The ratio $s_1/s_{\min}$ of the largest gain to the smallest one kept is the **condition number**.

**A number: the safe again.** Keeping the 17 patterns with whitened gains above one, the noise in the mass found in
the right-hand safe is 243 kg. Keeping 25, down to the gain 0.08, it is 2900 kg; keeping 40, it is 140,000 kg.
Dropping every pattern whose whitened gain is below one is the **truncated singular value decomposition**, the
simplest **regularization**, a rule that drops or shrinks the patterns whose noise would swamp the image. Its price is
a bias: on average the 17 kept patterns put 241 kg in the right-hand safe, not 324, because part of the gold lies in
dropped patterns (Figure [](#fig:svd-tsvd)).

The 243 kg is not the whole error, because the data say almost nothing about the dropped patterns. Counted against the
prior, they leave 705 kg of doubt in the safe's mass, and with the noise the error is
$\sqrt{243^2 + 705^2} = 746\unit{kg}$. Section 3.5 replaces the sharp cut by the smooth weight $s^2/(1 + s^2)$, which the last problem derives. Counted the
same way, it leaves 177 kg of noise and 707 kg of the prior's doubt, or $\sqrt{177^2 + 707^2} = 729\unit{kg}$: the
$\pm730$ kg of the opening, a little better than the sharp cut.
The prior alone would give $\sqrt{12}\times324 = 1120$ kg.

![Above, the safe's 231 whitened gains $s_i$ on a log scale against their rank $i$, largest first: the 17 above the line at one (orange) are the
patterns the cut keeps, and those below about $3\times10^{-10}$ (pale) are lost in rounding. Below, the noise in the
mass found in the right-hand safe when the first $k$ patterns are kept, from 1.1 kg at $k = 5$ through 243 kg at
$k = 17$ (dotted) to $10^{11}$ kg at $k = 111$.](tut-svd-tsvd){#fig:svd-tsvd}

::: try {#ring-matrix}
The ring of twelve balls of section 1.4, one every 30°, under the symmetric matrix $T =
\bigl(\begin{smallmatrix}a&b\\b&d\end{smallmatrix}\bigr)$ of the sliders. Each arrow is the push $-T\vect\xi$ on the
ball in the direction $\vect\xi$, and its part toward the centre is $R_T(\vect\xi)$. Set $a = 2$, $b = 1$ and $d = 2$,
and first predict the direction of the strongest push and its size. The readout numbers the eigenvalues from the
smaller, so its first axis belongs to the eigenvalue 1. No ball sits on the other axis, at 45°: compare the balls at
30° and 60° with those at 0° and 90°, halfway between the axes.
:::

**The idea to keep: a linear camera is a list of scene patterns, each with a gain. Patterns with large gains are
seen, patterns with small gains lose to the noise, and patterns with zero gain are invisible at any sensitivity.**

::: problems
### Practice

**[3.4]** What are the eigenvalues and eigenvectors of $\bigl(\begin{smallmatrix}2&1\\1&2\end{smallmatrix}\bigr)$?

::: solution
3, along $(1, 1)/\sqrt2$, and 1, along $(1, -1)/\sqrt2$, which are perpendicular.
:::

**[3.4]** How far is the gain of a ripple with $q = kz = 10$ below that of the best ripple?

::: solution
$q\,e^{1-q} = 10\,e^{-9} = 1.2\times10^{-3}$, about $1/810$.
:::

**[3.4]** Two pixels have the noise covariance matrix $C = \bigl(\begin{smallmatrix}1&0.5\\0.5&1\end{smallmatrix}\bigr)$, in units
of $\sigma_n^2$. Find the whitening matrix and check that $WCW^{\mathsf T} = I$.

::: solution
The eigenvalues are 1.5 along $(1, 1)/\sqrt2$ and 0.5 along $(1, -1)/\sqrt2$, so the rows of $\sigma_nW$ are
$(1, 1)/\sqrt3$ and $(1, -1)$. Each row gives 1 with $C$ on both sides ($1.5\times2/3$ and $0.5\times2$), and the cross
term is $0.5\,(1, 1)(1, -1)^{\mathsf T}/\sqrt3 = 0$.
:::

**[3.4]** The complex symmetric matrix $X = \bigl(\begin{smallmatrix}1&i\\i&-1\end{smallmatrix}\bigr)$ has both
eigenvalues zero. Find its triangular form $\Delta$ with the unit eigenvector $\mathbf u_1 = (1, i)/\sqrt2$, and
compare $\sum_{ab}|X_{ab}|^2$ with $\sum_a|\lambda_a|^2$.

::: solution
The trace and the determinant, $1 - 1 = 0$ and $-1 - i^2 = 0$, are the sum and the product of the eigenvalues, so both
are zero, and $X(1, i) = (1 + i^2, i - i) = 0$. The second axis is $\mathbf u_2 = (1, -i)/\sqrt2$, with $\mathbf
u_1^\dagger\mathbf u_2 = (1 + (-i)(-i))/2 = 0$. Then $X\mathbf u_2 = (2, 2i)/\sqrt2 = 2\mathbf u_1$, so $\Delta =
\bigl(\begin{smallmatrix}0&2\\0&0\end{smallmatrix}\bigr)$. The entries of $X$ give $1 + 1 + 1 + 1 = 4 = |\Delta_{12}|^2$,
while the eigenvalues give 0: no change of axes makes this matrix small.
:::

### Stretch

**[3.4]** A row of four pixels repeats round a period, with the kernel $g(0) = 2$, $g(\pm1) = -1$, $g(2) = 0$, whose weights add
to zero. Find the four gains and the pattern with gain zero, and say why every kernel whose weights add to zero has
that blind spot.

::: solution
$\tilde g_n = 2 - e^{-i\pi n/2} - e^{i\pi n/2} = 2 - 2\cos(\pi n/2)$, which is 0, 2, 4 and 2 for $n = 0$ to 3. The
pattern with gain zero is $n = 0$, the uniform row. For any kernel $\tilde g_0 = \sum_pg(p)$, the sum of its weights,
so a kernel whose weights add to zero cannot see a uniform pattern.
:::

**[3.4]** A matrix is **normal** when $X^\dagger X = XX^\dagger$. Show that the triangular form of a normal matrix is
diagonal, so that a normal matrix has $n$ perpendicular complex eigen-axes. Is the shear normal?

::: solution
With $X = U\Delta U^\dagger$, $X^\dagger X = U\Delta^\dagger\Delta U^\dagger$ and $XX^\dagger = U\Delta\Delta^\dagger
U^\dagger$, so $\Delta$ is normal too. The entry $11$ of $\Delta^\dagger\Delta$ is $|\Delta_{11}|^2$, because the first
column of $\Delta$ has only its top entry; that of $\Delta\Delta^\dagger$ is $\sum_b|\Delta_{1b}|^2$, the first row. They
are equal, so $\Delta_{1b} = 0$ for $b > 1$. Deleting the first row and column leaves a smaller normal triangular matrix,
and the same step clears each row in turn. So $\Delta$ is diagonal and the columns of $U$ are eigenvectors. The shear
has $S^{\mathsf T}S = \bigl(\begin{smallmatrix}1&1\\1&2\end{smallmatrix}\bigr)$ and $SS^{\mathsf T} =
\bigl(\begin{smallmatrix}2&1\\1&1\end{smallmatrix}\bigr)$, so it is not normal, as its single eigen-direction requires.
:::

### The camera

**[3.4]** The image of the safe is a Gaussian **posterior**, the spread of scenes that remain likely once the data are combined
with the prior (section 3.5). With whitened readings and independent cell masses of prior standard deviation
$\sigma_m$, the posterior mean is $(A^{\mathsf T}A + \sigma_m^{-2}I)^{-1}A^{\mathsf T}\mathbf y$ and its covariance
$(A^{\mathsf T}A + \sigma_m^{-2}I)^{-1}$ (section 3.5 derives both). Show that each pattern is kept with the weight
$s^2/(1 + s^2)$, with $s = s_i\sigma_m$.

::: solution
By [](#eq:svd) and $I = \sum_i\mathbf v_i\mathbf v_i^{\mathsf T}$, $A^{\mathsf T}A + \sigma_m^{-2}I = \sum_i(s_i^2 +
\sigma_m^{-2})\,\mathbf v_i\mathbf v_i^{\mathsf T}$, whose inverse has $1/(s_i^2 + \sigma_m^{-2})$ in each term, and
$A^{\mathsf T}\mathbf y = \sum_is_i\mathbf v_i(\mathbf u_i^{\mathsf T}\mathbf y)$. So the amount of pattern $i$ in the
mean is

$$\frac{s_i\,\mathbf u_i^{\mathsf T}\mathbf y}{s_i^2 + \sigma_m^{-2}} = \frac{s^2}{1 + s^2}\cdot\frac{\mathbf
u_i^{\mathsf T}\mathbf y}{s_i} ,$$

the pseudo-inverse's estimate times $s^2/(1 + s^2)$, and its variance is $\sigma_m^2/(1 + s^2)$. For the safe at
$\SNR = 10^3$ the weights add up to 16.7, close to the 17 patterns above one, and the posterior covariance summed over
the twelve cells of the right-hand safe gives a standard deviation of 729 kg, the $\pm730$ kg of the opening.
:::
:::

::: paper
- [*A worked case*](/paper/#par:a-worked-case) (Section IV) gives the $\pm730$ kg; [*The worked
  inversion*](/paper/#par:the-worked-inversion) (Appendix A) computes the image through the singular values.
- [](/paper/#eq:array-data) is the flat camera diagonalized by ripples, and [](/paper/#eq:wiener) the weight each
  pattern receives.
- [Section II](/paper/#sec:pixel) reads one mass's tide by its eigenvalues, and [*The magnetic
  picture*](/paper/#par:the-magnetic-picture) (Section IV) takes a body's line from an eigenvector of $\curv{\tE}$.
- [*The trembling lattice*](/paper/#par:the-trembling-lattice) (Appendix A) uses Rayleigh's method;
  [](/paper/#eq:ranging-instant) uses the singular values of the complex matrix $\mathcal W$ (section 9.2).
:::

::: deeper
- G. Strang, *Introduction to Linear Algebra* (5th edition, 2016), chapters 6 and 7: the spectral theorem and the
  singular value decomposition.
- P. C. Hansen, *Discrete Inverse Problems* (2010): the truncated singular value decomposition at work on blurred data.
- The GR course,
  [matrices measure pairs of arrows](https://neovand.github.io/general-relativity/chapter-0.html#0-6-matrices-measure-pairs-of-arrows),
  reads a symmetric matrix as the form $\mathbf x^{\mathsf T}T\mathbf y$.
:::

[^worked]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in its
    [worked case](/paper/#par:a-worked-case), and computed in its Appendix A.

[^arraydata]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation [](/paper/#eq:array-data); the paper also gives the
    weight each ripple receives, [](/paper/#eq:wiener).

[^complex]: The proof used that $T$ is real. The complex symmetric matrix $\mathcal W = \curv{\tE} + i\curv{\tB}$ can have
    complex eigenvalues and incomplete eigen-axes; section 9.2 treats it.

[^letters]: The symmetric matrix is $T$, as in the interactive figure, and $Q$ holds its eigenvectors. The design matrix
    is $A$, and $U$ and $V$ hold its singular vectors, not section 3.3's score or a volume. The diagonal matrices
    $\Lambda$ and $\Sigma$ are not other sections' projector or column density.

[^schur]: Issai Schur proved it in 1909 (*Mathematische Annalen* 66, 488). The axes $U$ are not unique: the
    eigenvalues can be put on the diagonal in any order.

[^code]: The first five whitened gains are 2080, 1480, 960, 440 and 330.
