---
id: '3.9'
title: 'Positivity, super-resolution, and the geometry of the near field'
question: 'From the same data, the best image that only adds and multiplies the readings weighs the gold in the locked safe to within ±730 kg, while an image that assumes only that mass is never negative finds 315 ± 20 kg. How does that one fact beat the blur, which other features of a scene survive the blur, and what geometry lies beneath them?'
part: '3'
requires: ['1.5b', '2.1', '2.3', '2.5', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8']
paper: [sec:near-field, app:benchmarks, eq:shear-zeros, fig:buried-ruler, eq:hyperbolic, fig:near-field-geometry, sec:hole]
figures: [fig:buried-ruler, fig:near-field-geometry]
live: [positive-image]
depth: A
---

An array of $11\times11$ pixels, a metre across, points at two safes 3.5 m away, with the empty room and the safes
themselves subtracted. What remains is a bar of gold, 30 by 14 by 40 cm and 324 kg, in the right-hand safe. At a
signal-to-noise ratio of $10^3$, the best image that only adds and multiplies the readings weighs that safe to within
$\pm730$ kg, more than twice the gold (section [3.5](/tutorial/noise/wiener-filter/#many-unknowns-are-guessed-together-with-the-same-formula)). One more fact changes this: mass
is never negative. With that fact and nothing else, the same data put $315 \pm 20$ kg in the right-hand safe and almost
nothing in the left.[^positive]

How can one fact beat the blur, which other features of a scene survive the blur, and what geometry lies beneath them?
In short, positivity forbids the mixtures of signed mass that the camera cannot see, the places where the shear of the
tide vanishes give a thin layer's size with no image, and beneath both lies a geometry in which every depth looks alike.

::: plain
An image that only adds and multiplies the readings must allow every scene that fits them, including scenes with
negative mass. Put 500 kg in a safe, and spread about 500 kg of negative mass thinly over the floor round it: the pulls
nearly cancel at the camera, which can barely tell this scene from an empty room. The large errors of such an image hide
in scenes like this one.

Mass is never negative, so an image that obeys this has nowhere to hide extra mass: it puts the gold where the data need
it and leaves almost every other place empty. A few separate masses are then fixed by a few averages of their mass, which
the camera measures well, and the separation at which two masses can be told from one shrinks as a power of the
sensitivity, while the blur shrinks only as its logarithm.

Two more facts survive the blur: above two equal masses, the stretching pattern of the tide has two zeros exactly as far
apart as the masses; and if every step is measured in units of its depth, every depth looks alike, which is why the blur
is an angle.
:::

## A linear image cannot use the sign of mass

We want to see where the $\pm730$ kg comes from, because positivity removes it. The best linear guess under a Gaussian
prior (section 3.5) is the **Gaussian image**. At $\SNR = 10^3$ only 17 of the camera's 231 patterns of cell mass
stand above the noise (section [3.4](/tutorial/noise/symmetric-matrices/#every-linear-camera-is-a-set-of-patterns-gains-and-blind-spots)), and one scene shows how much mass the others
can move. Spread 500 kg through the twelve cells of the right-hand safe, between 25 and 59 kg in each, and spread about
500 kg of negative mass through the cells round it. The 500 kg is a net figure: 111 cells lose 903 kg in all, at most 54
kg each, and 108 others gain 394 kg. This scene and the empty room predict readings only $D = 0.17$ noise standard
deviations apart, in the measure of section [3.3](/tutorial/noise/measuring-a-number/#choosing-between-two-scenes-comes-down-to-one-gaussian-number), so no test could tell them
apart.[^hidden] The gold itself moves the readings by $D = 177$. So the Gaussian image must leave the hidden scene almost
as probable as no change at all, and its large error hides there. The negative mass hides only because it is spread
thin: $+500$ kg and $-500$ kg in two neighbouring cells would move the readings by $D = 35$, which the camera sees
plainly.

No rule that only adds and multiplies the readings can forbid the hidden scene: it turns the readings $-\mathbf y$ into
minus the image of $\mathbf y$, so it must draw negative mass for some data.

## Non-negative least squares keeps only the masses the data need

We want an image that uses the sign of mass and assumes nothing else. We keep the whitened readings $\mathbf y$, the
design matrix $A$ and the list $\matter{\mathbf m}$ of cell masses $\matter m_j$, in kilograms (section 3.4). The
**misfit**

$$f(\matter{\mathbf m}) = |\mathbf y - A\matter{\mathbf m}|^2 = \sum_a\Bigl(y_a - \sum_jA_{aj}\matter m_j\Bigr)^2$$

is the sum of the squared differences between the readings and the predictions, each in units of the noise, so for
Gaussian noise the scene with the smallest misfit is the most likely one (section 3.3). The **positivity constraint** is
$\matter m_j \ge 0$ for every cell. **Non-negative least squares** is the problem

$$\text{minimize } |\mathbf y - A\matter{\mathbf m}|^2 \quad\text{over all } \matter{\mathbf m} \text{ with every }
\matter m_j \ge 0 .$$

Its answer is the most likely scene among those with no negative mass, the positive image. Unlike the Gaussian image, it
has no prior: nothing says how much mass a cell is expected to hold.

**The two conditions at the answer.** Differentiating the square with the chain rule gives the slopes of the misfit,

$$\frac{\partial f}{\partial\matter m_j} = 2\bigl[A^{\mathsf T}(A\matter{\mathbf m} - \mathbf y)\bigr]_j .$$

At the best positive scene each cell is in one of two states. Either it holds mass, $\matter m_j > 0$, and its slope is
zero, because a small change of either sign is allowed and neither may lower the misfit. Or it holds none, $\matter m_j =
0$, and its slope is at least zero: adding mass would raise the misfit, and removing it is forbidden. These are the
**Karush–Kuhn–Tucker conditions**. Differentiating once more gives the matrix $2A^{\mathsf T}A$, which is positive
semidefinite (section 3.4), so the misfit curves upward or stays flat in every direction, like a bowl. Because of that,
any scene that meets both conditions in every cell is a best one (stated without proof).

**Two cells.** Two pixels lie above two cells. A unit of mass in a cell gives the pixel above it the whitened reading 1
and the other pixel 0.6, so $A = \bigl(\begin{smallmatrix}1&0.6\\0.6&1\end{smallmatrix}\bigr)$, and the readings are
$\mathbf y = (1, 0.3)$. The best signed scene solves $A\matter{\mathbf m} = \mathbf y$: it is $(1.28, -0.47)$, with no
misfit, and it puts negative mass in the second cell. The best positive scene lies on the edge $\matter m_2 = 0$, where
$f = (1 - \matter m_1)^2 + (0.3 - 0.6\matter m_1)^2$. Its slope is $\partial f/\partial\matter m_1 = 2.72\matter m_1 -
2.36$, which is zero at $\matter m_1 = 0.87$. There $A\matter{\mathbf m} - \mathbf y = (-0.13, 0.22)$, so the slope in
the second cell is $\partial f/\partial\matter m_2 = 2\,(0.6\times(-0.13) + 0.22) = +0.28$. Both conditions hold, so the
answer is $(0.87, 0)$, with the misfit 0.066.

![The misfit of the two-cell example, drawn as contours in the plane of the two cell masses, is a bowl of ellipses
about the best signed scene $(1.28, -0.47)$, which lies outside the shaded quarter of positive masses. The best positive
scene $(0.87, 0)$ lies where the darker contour, the misfit 0.066, touches the edge $\matter m_2 = 0$, and there the
downhill direction, minus the slopes $(0, 0.28)$, points out of the quarter. The arrow's length is
schematic.](tut-pos-nnls){#fig:nnls}

**Most cells end at exactly zero**, so the scene is **sparse**. At $\SNR = 10^3$
the positive image of the safe has mass in a median of 6 of its 231 cells. With no noise it has mass in 5 cells: four
inside the right-hand safe, and one at the far-left edge of the grid that holds 0.2 kg. The hidden scene of the last
section needs negative mass round the safe, so the constraint forbids it, and the doubt goes with it.

**Numbers.** Over many draws of the noise, the positive image puts $315\pm20$ kg in the right-hand safe and $0.35\pm1.9$
kg in the left at $\SNR = 10^3$ (the mean and the spread over the noise), and $327.6\pm0.7$ kg in the right at
$10^4$.[^draws] The Gaussian image puts 228 kg there on average, with a spread of 729 kg. At $10^3$ the positive image
holds about 340 kg in all, more than the 324 kg of gold: noise that would push a cell below zero is cut off, while noise
that pushes a cell up is kept, so the cutting only adds mass. At $10^4$ the safe holds 3.3 kg more than the bar, mostly
because the bar's centre falls between the points of the grid.[^grid]

::: derivation
### How the draws of the noise are made

**The scene and the cells.** The array, the bar, the noise and the 231 cells are those of the worked inversion of
[R3](/tutorial/noise/reading-section-iv-2/#the-safe-is-found-quickly-but-a-cautious-image-cannot-weigh-it): $11\times11$
pixels 10 cm apart, five components of the tide at each, and point masses at the nodes of a grid 25 cm apart in the
upright plane of the safes. The true readings are those of the bar as a uniform box of gold, computed exactly; the
design matrix holds the readings of one kilogram at each node, as a point.

**One draw.** Each of the 605 true readings receives its own Gaussian noise of mean zero and standard deviation
$\sigma_n$, independent of the others, with $\sigma_n = 2G\matter m/(z^2\,\SNR\,b) = 3.5\times10^{-11}\unit{s^{-2}}$ at
$\SNR = 10^3$ ($\matter m = 324$ kg, $z = 3.5$ m, $b = 0.1$ m). The problem of non-negative least squares is then solved
once, on the whitened readings, by the active-set method of Lawson and Hanson. It starts with every cell empty. At each
step it frees the empty cell whose slope $\partial f/\partial\matter m_j$ is most negative, solves the ordinary
least-squares problem for the free cells alone, and, if that would make a free cell negative, moves only part of the way
toward that solution, stopping where the first cell reaches zero and returning it to the empty set. It stops when both
conditions of the answer hold in every cell. The mass of a safe is the sum over the twelve cells of its footprint.

**The count.** Three thousand draws give the mean and the spread quoted above. The mean is then fixed to about
$20\unit{kg}/\sqrt{3000} = 0.4$ kg, by the square-root law of section 3.1. As a check by hand, the Cramér–Rao bounds for
a gold known to be one point are $\pm25$ kg with its depth unknown and $\pm2.2$ kg with it known (R3), and the positive
image's $\pm20$ kg lies between them. Appendix [A.1](/tutorial/appendices/numerical-methods/) follows the draws further.
:::

**What it cannot do.** Positivity removes only the scenes that need negative mass somewhere. An invisible positive
scene, such as a uniform layer under an endless flat camera (section [2.5](/tutorial/outside/null-space/#a-uniform-sheet-is-invisible-to-a-tidal-camera)), can still be
added. In a scene crowded with mass every cell holds plenty, so a hidden pattern of small gains and losses keeps every
cell positive, and the blur of section 3.7 then holds.

## A positive distribution of mass is fixed by a few of its moments

We want the mathematics behind the last section: why a few compact positive masses are pinned by a few numbers. We take
masses on a line. Masses $\matter m_i > 0$ at the places $x_i$ have the **moments**

$$\sym{line-moment}{\matter\mu_n} = \sum_i\matter m_ix_i^n, \qquad n = 0, 1, 2, \dots,$$

in $\mathrm{kg\,m^n}$. The first is the total mass, $\matter\mu_1/\matter\mu_0$ is the centre of mass, and the higher
ones are the line's version of the multipole moments of section [2.3](/tutorial/outside/multipoles/#each-degree-has-a-ceiling-lower-than-the-last-by-the-size-over-the-distance), which a distant
camera measures less well the higher they go. The **moment problem** asks which scenes have given moments.

**One mass.** With $\bar x = \matter\mu_1/\matter\mu_0$, the spread $\sum_i\matter m_i(x_i - \bar x)^2$ is a sum of terms
that cannot be negative. If it is zero, every mass lies at $\bar x$, and the scene is a single point. With signed masses
this fails: $+1$, $-3$, $+3$ and $-1$ kg at $x = 0$, $h$, $2h$ and $3h$ have $\matter\mu_0 = \matter\mu_1 = \matter\mu_2 =
0$, so they can be added to any scene without changing its first three moments, however large $h$ is.

**Two masses from four moments.** Let two masses $\matter m_1$ and $\matter m_2$ lie at $x_1$ and $x_2$, the roots of a
quadratic $x^2 - c_1x - c_0 = (x - x_1)(x - x_2)$, with two unknown numbers $c_0$ and $c_1$. Each $x_i$ obeys $x_i^2 =
c_1x_i + c_0$. We multiply by $\matter m_ix_i^n$ and add over $i$: $\matter\mu_{n+2} = c_1\matter\mu_{n+1} +
c_0\matter\mu_n$. With $n = 0$ and $n = 1$ this is

$$\boxed{\begin{pmatrix}\matter\mu_0&\matter\mu_1\\\matter\mu_1&\matter\mu_2\end{pmatrix}\begin{pmatrix}c_0\\c_1\end{pmatrix}
= \begin{pmatrix}\matter\mu_2\\\matter\mu_3\end{pmatrix}} . \label{eq:hankel}$$

So the four moments $\matter\mu_0$ to $\matter\mu_3$ give $c_0$ and $c_1$, the quadratic gives the two places, and
$\matter\mu_0$ and $\matter\mu_1$ then give the two masses. A matrix of moments whose entries depend only on the sum of
the row and column numbers is a **Hankel matrix**. **A number:** masses of 2 and 1 kg at $x = 0.3$ and $-0.5$ m have the
moments 3, 0.1, 0.43 and $-0.071$. Equation [](#eq:hankel) gives $c_0 = 0.15$ and $c_1 = -0.2$, so the quadratic is $x^2
+ 0.2x - 0.15$, and its roots are 0.3 and $-0.5$ (the figure below).

Four moments are enough when we know that the scene is two points. The fifth, $\matter\mu_4$, rules out every other
positive scene, with any number of masses.

**Why no other positive scene fits.** Let $p(x) = (x - x_1)(x - x_2)$. For the true scene $\sum_i\matter m_i\,p(x_i)^2 =
0$, because $p$ vanishes at every mass. Multiplied out, $p^2$ is a polynomial of degree four, so this sum is a fixed
combination of $\matter\mu_0$ to $\matter\mu_4$. Any other scene with the same five moments therefore also has
$\sum_j\matter m'_jp(x'_j)^2 = 0$, with masses $\matter m'_j$ at places $x'_j$. If its masses are positive, every term
is at least zero, so every term is zero: each $x'_j$ is $x_1$ or $x_2$. **Among positive scenes, $k$ point masses are
fixed by their moments $\matter\mu_0$ to $\matter\mu_{2k}$**, with $p$ of degree $k$; the case $k = 1$ is the spread
above. With signed masses the terms can cancel, and the argument fails. In the example, $\matter\mu_4 = 0.0787$, and the
combination $\matter\mu_4 + 0.4\matter\mu_3 - 0.26\matter\mu_2 - 0.06\matter\mu_1 + 0.0225\matter\mu_0$ is zero.

If every moment were known, a scene on a finite stretch of line would be fixed even with signed masses, because
polynomials can approximate any continuous function there (the box below). A camera measures only the
first few moments well, and it is for a few moments that positivity makes the difference.

::: derivation
### Every moment together fixes a scene, and a round body's even moments fix its density

**Weierstrass's theorem.** Every continuous function $f$ on a finite interval is a uniform limit of polynomials: for
every $\epsilon > 0$ there is a polynomial $p$ with $|f(x) - p(x)| < \epsilon$ at every $x$ of the interval.[^weierstrass]
On the interval from 0 to 1 one such polynomial is $\sum_kf(k/n)\binom nkx^k(1 - x)^{n-k}$, the mean of $f(K/n)$ for
the number $K$ of successes in $n$ trials that each succeed with the chance $x$; $K/n$ has the mean $x$ and the variance
$x(1 - x)/n \le 1/4n$, so for large $n$ it lies close to $x$ except with a small chance, and the mean of $f(K/n)$
approaches $f(x)$ at every $x$ at once.

**All moments fix a density, of either sign.** Let two continuous densities on a line, $\matter\rho_1$ and
$\matter\rho_2$, in $\mathrm{kg\,m^{-1}}$, vanish outside a finite interval and have all their moments equal. Their
difference $\delta = \matter\rho_1 - \matter\rho_2$ has $\int\delta\,x^n\,\dd x = 0$ for every $n$, so $\int\delta\,p\,\dd
x = 0$ for every polynomial $p$. We choose $p$ within $\epsilon$ of $\delta$ itself:

$$\int\delta^2\,\dd x = \int\delta\,(\delta - p)\,\dd x \le \epsilon\int|\delta|\,\dd x .$$

The left side does not depend on $\epsilon$, which can be as small as we like, so $\int\delta^2\,\dd x = 0$ and $\delta =
0$ everywhere. Nothing here used the sign of the mass. For point masses the same argument, with a continuous tent that
is 1 at one of the places and 0 at all the others in place of $\delta$, shows that the two scenes hold the same mass at
every place.

**A round body.** Its density $\matter\rho(r)$ is continuous on $0 \le r \le R$, and its even moments are
$\int\matter\rho\,r^{2n}\,\dd V = 4\pi\int_0^R\matter\rho\,r^{2n+2}\,\dd r$ for $n = 0, 1, 2, \dots$, the moments
$\int\matter\rho\,r^{2\ell-2}\,\dd V$ that a warm body's tremor reveals
([section R4](/tutorial/response/reading-section-iv-3/#a-warm-bodys-moments-change-at-a-rate-set-by-its-temperature-and-its-density-alone)),
with $\ell = n + 1$. We substitute $s = r^2$, so that $\dd r = \dd s/2\sqrt s$:

$$\int\matter\rho\,r^{2n}\,\dd V = \int_0^{R^2}2\pi\sqrt s\,\matter\rho(\sqrt s)\,s^n\,\dd s .$$

These are all the moments of the continuous function $2\pi\sqrt s\,\matter\rho(\sqrt s)$ on the interval from 0 to
$R^2$, so by the last paragraph they fix it, and with it $\matter\rho$ at every $r > 0$, and at $r = 0$ by continuity.
The odd powers of $r$ are not needed, because the even ones are all the powers of $s$, and $s$ runs over an interval as
$r$ does.

**A number.** A uniform ball of mass $\matter M$ has the moments $3\matter MR^{2n}/(2n + 3)$, and a thin shell of the
same mass and radius has $\matter MR^{2n}$. They agree at $n = 0$, differ by the factor $5/3$ at $n = 1$, the ratio of
the tremors of section R4, and by $7/3$ at $n = 2$: each further moment tells them apart more strongly.
:::

**Moments of positive mass make a positive semidefinite matrix.** For any numbers $a_0, \dots, a_k$,

$$\sum_{i,j}a_ia_j\matter\mu_{i+j} = \sum_l\matter m_l\Bigl(\sum_ia_ix_l^i\Bigr)^2 \ge 0 ,$$

so every Hankel matrix of a positive scene is positive semidefinite (section 3.4). The $2\times2$ matrix of the example
has the eigenvalues 3.004 and 0.426; the $3\times3$ matrix of $\matter\mu_0$ to $\matter\mu_4$ has 3.065, 0.444 and zero,
and its eigenvector for zero holds the coefficients of $p$. **A non-example:** $+1$ kg at 0.1 m and
$-1$ kg at $-0.1$ m have the moments $(0, 0.2, 0, 0.002)$, whose $2\times2$ Hankel matrix has the eigenvalue $-0.2$, so
no positive scene has these moments.

![Two masses on a line and the quadratic whose roots are their places. The bars stand at $-0.5$ and 0.3 m, their
heights in proportion to their 1 and 2 kg, and below them $p(x) = x^2 + 0.2x - 0.15$, whose coefficients the four
moments give through equation [](#eq:hankel) (upper right), crosses zero exactly beneath each bar. The bars and
the parabola have their own vertical scales.](tut-pos-moments){#fig:moments}

## Positivity resolves as a power of the sensitivity, not its logarithm

We want the separation at which two masses can be told from one when the camera knows only that mass is positive, and we
compare it with the blur. Section 3.3 answered a narrower question, for a camera told that the scene held one mass or two. Two equal masses $d$ apart and one mass at their centre predict readings $D = \kappa\mathcal R\,d^2/z^2$ apart, with
$\kappa = 0.34$, $\sym{pattern-snr}{\mathcal R} = 0.767\,\SNR$ the signal-to-noise ratio of the whole pattern, and $z$
the depth. Asking for $D = 2$, which is wrong one time in six, gives $d = \sqrt{2/\kappa}\;z/\sqrt{\mathcal R} =
2.4\,z/\sqrt{\mathcal R}$: 8.8 cm at 1 m and $\SNR = 10^3$, and 2.8 mm at $10^6$, against blurs of 42 and 25 cm (section
[3.7](/tutorial/noise/blur-law/#what-the-law-means)). A thousandfold gain in sensitivity shrinks this separation by $\sqrt{1000} = 32$.

**The camera measures the spread.** Two equal masses $\matter M/2$ at $\bar x \pm d/2$ have the spread $\matter Md^2/4$,
their quadrupole (section 2.3), and $D$ grows in proportion to it: a spread of $\matter Mz^2/4\kappa\mathcal R \approx
0.74\,\matter Mz^2/\mathcal R$ gives $D = 1$, the noise on a measured spread.

**Positivity turns a small spread into a compact scene.** Each positive mass farther than $t$ from the centre adds at
least $\matter m_it^2$ to the spread, so the share of the mass beyond $t$ is at most the spread divided by $\matter
Mt^2$. This is **Chebyshev's inequality**, applied to mass instead of probability. With signed masses the spread bounds
nothing, as the masses $+1$, $-3$, $+3$, $-1$ showed. So, among positive scenes, readings whose spread is zero within its
noise guarantee that the mass lies within a distance of order $z/\sqrt{\mathcal R}$ of one point, and readings whose
spread stands well above the noise rule out a single compact mass. The readings can therefore decide between one compact
mass and something wider at a separation that scales as

$$\boxed{d \propto \frac{z}{\sqrt{\mathcal R}}} ,$$

a power of the sensitivity, without being told how many masses there are. The scaling law drops the factor of 2.4 that a
decision at $D = 2$ needs, and the argument is a sketch: it assumes that the spread of an unknown positive scene is
measured as well as that of section 3.3's pair.

**Drawing the two masses takes more.** To draw two separate peaks in the right places, the positive image needs more of
the pair's shape than its spread, and higher moments are measured less well (section 2.3). On a simple model, a row of
cells under a row of sensors that read the tide, the positive image draws two equal masses as two peaks down to a
separation of $0.14z$ at $\SNR = 10^3$ and $0.016z$ at $10^6$.[^merge] A thousandfold gain in sensitivity shrinks this
separation 8.6-fold, about as the cube root of the sensitivity, while the Gaussian image's blur shrinks only 1.7-fold,
from $0.36z$ to $0.21z$, as in section 3.7. Both the decision and the drawing improve as powers of the sensitivity, and
as $\SNR$ grows without bound a power always overtakes a logarithm.

Recovering detail finer than the blur by using what is known about the scene is called **super-resolution**.
Morgenshtern and Candès proved that positive point sources on a fine grid are recovered stably by a positive fit, with
no minimum separation between neighbours as long as not too many crowd together [@MorgenshternCandes2016]; we state this
without proof. The logarithmic law of section 3.7 is therefore the limit for a scene crowded with mass; for an empty
room holding a few objects, positivity is the camera's most powerful prior. The electrostatic camera of the same
mathematics has no such help, because its charges have two signs.

**Two masses from four noisy moments.** The power law can be proved for two masses on a line, by asking how the
solution of [](#eq:hankel) responds to noise in the moments. We assume that **the scene is two positive point masses**,
$p\matter M$ and $(1 - p)\matter M$, at $x_1$ and $x_2 = x_1 + d$, and we measure places from the centre of mass, so that
$\matter\mu_1 = 0$. The mass and the centre are the moments the camera measures best, so we take **$\matter\mu_0$ and
$\matter\mu_1$ as exact**. Then $\matter\mu_2 = p(1 - p)\matter Md^2$, the spread, and the Hankel matrix is diagonal:

$$\begin{pmatrix}\matter\mu_0&\matter\mu_1\\\matter\mu_1&\matter\mu_2\end{pmatrix} = \matter M\begin{pmatrix}1&0\\0&p(1 -
p)\,d^2\end{pmatrix}, \qquad c_0 = \frac{\matter\mu_2}{\matter M}, \qquad c_1 = \frac{\matter\mu_3}{\matter\mu_2} .$$

Small errors $\delta\matter\mu_2$ and $\delta\matter\mu_3$ change the coefficients by $\delta c_0 = \delta\matter\mu_2/\matter
M$ and $\delta c_1 = (\delta\matter\mu_3 - c_1\,\delta\matter\mu_2)/\matter\mu_2$. Each place obeys $x_i^2 = c_1x_i + c_0$;
we differentiate this, and use $2x_i - c_1 = 2x_i - (x_1 + x_2) = \pm d$, with the plus sign for $x_2$:

$$\delta x_i = \pm\,\frac{x_i\,\delta c_1 + \delta c_0}{d} .$$

For equal masses, $p = \tfrac12$, the places are $\mp d/2$, $c_1 = 0$ and $\delta c_1 = 4\,\delta\matter\mu_3/\matter Md^2$, so
the separation and the midpoint of the pair move by

$$\boxed{\delta d = \delta x_2 - \delta x_1 = \frac{2\,\delta\matter\mu_2}{\matter Md}, \qquad
\tfrac12(\delta x_1 + \delta x_2) = \frac{2\,\delta\matter\mu_3}{\matter Md^2}} .$$

Both are in metres, since $\matter\mu_n$ is in $\mathrm{kg\,m^n}$. The first agrees with differentiating $d^2 =
4\matter\mu_2/\matter M$ directly. As $d$ shrinks the errors grow as $1/d$ and $1/d^2$, powers and not exponentials,
because the matrix to be inverted has the **condition number**, the ratio of its largest eigenvalue to its smallest,
$1/p(1 - p)d^2$ with lengths in units of the depth: $4/d^2$ for equal masses. **A number:** with the spread measured to
$0.74\,\matter Mz^2/\mathcal R$, as above, $\delta d = 1.48\,z^2/\mathcal Rd$, which is smaller than $d$ once $d >
1.22\,z/\sqrt{\mathcal R}$: 4.4 cm at 1 m and $\SNR = 10^3$, between the 3.6 cm of $z/\sqrt{\mathcal R}$ itself and the
8.8 cm of a decision at $D = 2$. The midpoint is the centre of mass only when the masses are known to be equal; with their
ratio unknown, the third moment fixes it, and it enters divided by $d^2$. A camera measures $\matter\mu_3$ less well, to
an amount that scales as $\matter Mz^3/\mathcal R$, so placing both masses needs $d \propto z/\mathcal R^{1/3}$: the cube
root, as the drawing of two peaks above found.

**Many masses: the Vandermonde matrix.** For $k$ masses $\matter m_a$ at places $x_a$, the polynomial whose roots are
the places has degree $k$, and its coefficients solve the $k\times k$ Hankel system of $\matter\mu_0$ to
$\matter\mu_{2k-1}$. The Hankel matrix factors as $V^{\mathsf T}\mathrm{diag}(\matter m_a)V$, where $V_{ai} = x_a^i$
($a = 1, \dots, k$; $i = 0, \dots, k - 1$) is the **Vandermonde matrix** of the places, because
$\sum_a\matter m_ax_a^ix_a^j = \matter\mu_{i+j}$. A list $\mathbf a$ of coefficients gives $(V\mathbf a)_b = q(x_b)$,
the polynomial $q$ with those coefficients evaluated at the place $b$. We choose $q(x) = (x - x_1)\cdots(x - x_{k-1})$.
Its leading coefficient is 1, so $|\mathbf a| \ge 1$, and $V\mathbf a$ has a single entry that is not zero,
$q(x_k)$, which is at most $d^{k-1}$ if all the places lie within $d$ of one another. Hence, with $\hat{\mathbf a} =
\mathbf a/|\mathbf a|$ and $\matter m_{\max}$ the largest mass,

$$\hat{\mathbf a}^{\mathsf T}H\hat{\mathbf a} = \sum_b\matter m_b\,(V\hat{\mathbf a})_b^2 \le \matter m_{\max}\,d^{2(k-1)},$$

while the first entry of $H$ is $\matter\mu_0 = \matter M$. By the Rayleigh quotient of section
[3.4](/tutorial/noise/symmetric-matrices/#the-rayleigh-quotient-finds-the-strongest-and-weakest-directions) the
smallest eigenvalue of $H$ is at most the first number and the largest at least the second, so

$$\boxed{\text{condition number of } H \ge \frac{\matter M}{\matter m_{\max}}\,d^{-2(k-1)}} ,$$

with $d$ in units of the depth. For two equal masses the bound is $2/d^2$, against the exact $4/d^2$. Gautschi bounded
the inverse of a Vandermonde matrix from above, which shows that the power $2(k - 1)$ is the true one for $k$ places
spaced about $d$ apart.[^gautschi] Noise in the moments is therefore amplified by a power of $1/d$, so the separation that can be
resolved shrinks as a power of the sensitivity, never as its logarithm. The same matrices decide how well overlapping
lensed images of one wave can be separated at one point
([section 9.5](/tutorial/one-point/separating-waves/#all-three-cases-are-pronys-problem-and-counting-gives-the-limit)).

The general theorems carry this algebra to sources on a fine grid in any arrangement. Donoho proved that sparse sources
of either sign are recovered stably from their coarse features, with an error that grows as a power of the ratio of the
blur to the grid's spacing, the power set by how many sources crowd within one blur [@Donoho1992]. In Morgenshtern and
Candès's theorem for positive sources the power is $2r$, for at most $r$ sources in any window about $1.9r$ times the
finest kept wavelength [@MorgenshternCandes2016].

::: try {#positive-image}
Two or three equal masses lie in a row of cells at the depth $z$ below a row of sensors that read the tide through white
noise. Three rows share one scale: the truth, whose masses you drag or move with the arrow keys; the Gaussian image; and
the positive image, which stays hidden until you ask for it. The sliders set $\SNR$ from $10^2$ to $10^8$ and a zoom; one
button adds or removes the third mass, another draws new noise. Answer the two predictions first, then put a third mass
midway between the two and find the sensitivity at which the positive image first draws all three.
:::

## The zeros of the shear survive the blur

We want the rule for where the shear vanishes above a thin layer of mass, because those places give the size of the layer
without any image.[^zeros] Section [1.5b](/tutorial/newton/complex-numbers/#the-shear-of-one-mass-is-a-square) defined the **shear** of the tide in the
camera's plane, $\sym{shear}{\curv s} = (\curv{\tE}_{xx} - \curv{\tE}_{yy}) + 2i\,\curv{\tE}_{xy}$, in $\mathrm{s^{-2}}$,
wrote a place on the plane as $\sym{complex-place}{w} = x + iy$, in metres, and found for a point mass $\matter m$ at the
depth $z$ below the place $w'$

$$\curv s(w) = -\frac{3G\matter m\,(w - w')^2}{r^5}, \qquad r^2 = |w - w'|^2 + z^2 .$$

Above two equal masses $d$ apart it found exactly two **zeros**, places where the shear vanishes, on the perpendicular
bisector and $d$ apart, at every depth greater than $\tfrac{\sqrt3}{2}d$.

**Assumptions.** **The layer is thin**: all its mass lies at one depth $z$. **It is seen from far**: its width $R$ is
small beside $z$, and we look only at places within a few $R$ of the point above it. Its surface density
$\sym{surface-density}{\matter\sigma}(w')$, in $\mathrm{kg\,m^{-2}}$, gives the mass $\matter M = \int\matter\sigma\,
\dd^2w'$ and the centre of mass $w_{\rm cm} = \int\matter\sigma\,w'\,\dd^2w'/\matter M$.

**Step 1: add the shears of all the parts.**

$$\curv s(w) = -3G\int\frac{\matter\sigma(w')\,(w - w')^2}{\bigl(|w - w'|^2 + z^2\bigr)^{5/2}}\,\dd^2w' .$$

**Step 2: use the same distance for every part.** Here $|w - w'|$ is at most a few $R$, so the denominator is
$z^5\bigl(1 + |w - w'|^2/z^2\bigr)^{5/2} = z^5\bigl(1 + O(R^2/z^2)\bigr)$. Dropping the correction gives

$$\curv s(w) \approx -\frac{3G}{z^5}\int\matter\sigma(w')\,(w - w')^2\,\dd^2w' .$$

**Step 3: measure from the centre of mass.** We write $w - w' = (w - w_{\rm cm}) - (w' - w_{\rm cm})$ and square. The cross
term holds $\int\matter\sigma\,(w' - w_{\rm cm})\,\dd^2w'$, which is zero by the definition of the centre, so

$$\begin{gathered}\curv s(w) \approx -\frac{3G}{z^5}\Bigl[\matter M(w - w_{\rm cm})^2 +
\sym{complex-quadrupole}{\matter Q_c}\Bigr],\\ \matter Q_c = \int\matter\sigma\,(w' - w_{\rm cm})^2\,\dd^2w'
.\end{gathered}$$

The bracket is a polynomial of degree two in $w$, so it has exactly two roots:

$$\boxed{w = w_{\rm cm} \pm i\sqrt{\matter Q_c/\matter M}} .$$

The units agree: $\matter Q_c$ is in $\mathrm{kg\,m^2}$, so $\sqrt{\matter Q_c/\matter M}$ is in metres. Neither $z$ nor
$G$ appears, so the zeros stand at the layer's true scale at every height: they are not blurred.

**What $\matter Q_c$ is.** Its real and imaginary parts are $\int\matter\sigma\,(x^2 - y^2)$ and $2\int\matter\sigma\,xy$,
measured from the centre, so $\matter Q_c = (\matter Q_{xx} - \matter Q_{yy} + 2i\matter Q_{xy})/3$ with the quadrupole
tensor of section [2.3](/tutorial/outside/multipoles/#each-degree-has-a-ceiling-lower-than-the-last-by-the-size-over-the-distance): the **complex quadrupole** of the layer, its two quadrupole
numbers within the plane. Turning the layer by an angle $\beta$ multiplies $\matter Q_c$ by $e^{2i\beta}$, so the zeros
turn with the layer. For a layer stretched along the angle $\beta$, $\matter Q_c/\matter M$ is a positive number times
$e^{2i\beta}$, so $i\sqrt{\matter Q_c/\matter M}$ points at $\beta + 90°$: the zeros lie across the layer's long axis.

**Two checks.** For two equal masses $\matter m$ at $\pm d/2$, $\matter Q_c = \matter md^2/2$ and $\matter M = 2\matter
m$, so the zeros stand at $\pm i\,d/2$, as in section 1.5b, and the rule is exact, because on the bisector Step 2
changes nothing. For a single point $\matter Q_c = 0$, and the two zeros merge into the
double zero of $w^2$ directly above it.

**The size of the error.** Take three masses of 1.0, 0.7 and 1.4 units at $0.2 + 0.1i$, $-0.3 + 0.05i$ and $0.05 -
0.25i$, a layer about 0.5 across. The rule puts its zeros at $0.034 + 0.014i$ and $0.005 - 0.153i$; the true zeros lie at
most 0.018, 0.0017 and 0.00015 from them at the heights 1, 3 and 10, so each threefold rise in height cuts the error
ninefold, as an error of order $(R/z)^2$ should.

![A thin layer of three masses seen from above, each dot's area in proportion to its mass. The rule puts the two zeros
of the shear (open circles) on the dotted line through the centre of mass $w_{\rm cm}$ (cross), across the layer's long
axis (dashed). Turned by 40° about its centre (faint), the layer has its $\matter Q_c$
multiplied by $e^{2i\beta}$, and its zeros turn by the same 40°.](tut-pos-layer){#fig:layer}

**How precisely noise places a zero.** Noise moves each zero by a distance of the order of $z^2/2\mathcal Rd$ (the box
below sketches why), so the zeros, $d$ apart, are told apart once $d > z/\sqrt{2\mathcal R}$: about 2.6 cm at 1 m and
$\SNR = 10^3$, and a pair 10 cm apart has its zeros placed to about 6.5 mm. This is the scaling at which the readings
decide between one mass and two, now reached by inspection.

:::: derivation
### How noise moves a zero

Near a zero $w_0$ the shear grows in proportion to the step from it, $\curv s \approx \curv s'(w_0)(w - w_0)$, with
$\curv s' = \dd\curv s/\dd w$. Noise adds a random amount $\delta\curv s$ to the shear and so moves the zero by about
$\delta\curv s/|\curv s'|$. For the pair, the bracket of Step 3 is $\matter M(w^2 + d^2/4)$, whose slope at $w_0 = id/2$
gives $|\curv s'| = 3G\matter Md/z^5$. The shear changes over a patch about $z$ wide, where the noise averages to about
$\sqrt{N_0}/z$, with $N_0$ the noise density of section 3.3. With $\SNR = 2G\matter M/(z^2\sqrt{N_0})$ and $\mathcal R =
0.767\,\SNR$, the zero moves by about

$$\frac{z^4\sqrt{N_0}}{3G\matter Md} = \frac{2z^2}{3\,\SNR\,d} = 0.51\,\frac{z^2}{\mathcal Rd} ,$$

of the order of $z^2/2\mathcal Rd$.

::: gap
The sketch takes the noise on the shear to be one component's noise averaged over a patch $z$ wide, so its factor is
only an order of magnitude, and it ignores the four extra zeros of a pair shallower than $\tfrac{\sqrt3}{2}d$.
:::
::::

{{paper fig:buried-ruler}}

::: history
### Critical curves and defects

The quadratic of two equal masses also places the secondary critical curves of a double gravitational lens
[@Bozza2000], and zeros of a shear were studied as defects in maps of weak lensing [@VitelliJainKamien2009].

The check is short. Write directions on the sky as complex numbers $w$, in units of the angle of the Einstein ring of
the pair ([section 11.1](/tutorial/black-holes/schwarzschild/#a-mass-is-a-lens-with-a-line-of-foci-and-an-einstein-ring)),
with two equal masses at $\pm d/2$, so that each has the weight $\tfrac12$. The deflections of point masses add, and a
deflection of size $k/|w - w_i|$ toward the mass at $w_i$ is $k/(\bar w - \bar w_i)$, so a ray seen at $w$ comes from
the source direction $w - \tfrac12\sum_i1/(\bar w - \bar w_i)$. This map changes $w$ by $\dd w$ and adds the
**lensing shear** $\gamma = \tfrac12\sum_i1/(\bar w - \bar w_i)^2$ times $\dd\bar w$, so it stretches areas by $1 -
|\gamma|^2$, and images become infinitely bright on the **critical curves**, where $|\gamma| = 1$. The shear vanishes
where $(w + d/2)^2 + (w - d/2)^2 = 0$, at $w = \pm id/2$: the zeros of the camera's shear above the same pair. Near a
zero $|\gamma|$ grows as $(4/d^3)\,|w \mp id/2|$, while it is huge beside each mass, so for a close pair, $d \ll 1$, the
critical curves include two small loops of radius $d^3/4$ round these points: the secondary critical curves. Their
images in the source plane, the secondary caustics, lie at $\mp i(1/d - d/2)$, far out across the line of the pair.
:::

## The space below a flat camera is hyperbolic

We want the geometry behind the fixed-angle blur of section 3.7, where a pattern at twice the depth looked like the same
pattern twice as wide. So we measure each small step in units of its own depth.

**A line element.** A **line element** is a rule that turns a small step of the coordinates into a squared length. In flat
space it is $\dd x^2 + \dd y^2 + \dd z^2$. Below the camera, with $z > 0$ the depth, we set

$$\sym{line-element}{\dd s^2} = \frac{\dd x^2 + \dd y^2 + \dd z^2}{z^2} .$$

A step of 1 cm across has the length 0.01 at a depth of 1 m, and 0.1 at 10 cm. Written as $\dd s^2 = g_{ij}\,\dd x_i\,\dd x_j$, the table
$\sym{metric}{g_{ij}} = \delta_{ij}/z^2$ is the **metric**.

**The camera is infinitely far away.** Straight down from depth $z_1$ to depth $z_2$ the length is $\int\dd z/z =
\ln(z_2/z_1)$, which grows without limit as $z_1$ shrinks to zero: the camera's plane is infinitely far from every point
below it. The half of space $z > 0$ with this metric is **hyperbolic space**, in the model called the **upper
half-space**, and the camera's plane is its **boundary at infinity**.

**A change of scale is a rigid move.** An **isometry** is a map that keeps every length. Sliding across, $(x, y) \to (x +
a, y + b)$, is one. So is a change of scale about a point of the camera's plane, $(x, y, z) \to (\lambda x, \lambda y,
\lambda z)$: it multiplies $\dd x$, $\dd y$, $\dd z$ and $z$ by $\lambda$, and leaves $\dd s^2$ unchanged. Seen from
inside this geometry it is a step of length $\ln\lambda$ straight down.

**The Laplacian of this metric.** The Laplacian measured with a metric is called the **Laplace–Beltrami operator**. For
our metric it is

$$\sym{hyperbolic-laplacian}{\nabla^2_H}u = z^2\nabla^2u - z\,\partial_zu ,$$

as the box below derives. The extra term $-z\,\partial_zu$ appears because the metric's factor $1/z^2$ changes with
depth.

**Laplace's equation in this geometry.** We want an equation for the potential that holds nothing but this Laplacian and
a constant, because such an equation is built from the metric alone, and every isometry then carries a solution to a
solution. So we try $z^\alpha\field\Phi$, with $\field\Phi$ the potential in $\mathrm{J\,kg^{-1}}$ and $\alpha$ a number
to be chosen. The product rule (box below) gives

$$\begin{aligned}
\nabla^2_H(z^\alpha\field\Phi) &= z^{\alpha+2}\,\nabla^2\field\Phi + \alpha(\alpha - 2)\,z^\alpha\field\Phi\\
&\quad + (2\alpha - 1)\,z^{\alpha+1}\,\partial_z\field\Phi .
\end{aligned}$$

The first term holds $\nabla^2\field\Phi$, and the second is a multiple of $z^\alpha\field\Phi$ itself. The last is
neither, and it vanishes only for $\alpha = \tfrac12$: that is why the power is one half. Then $\alpha(\alpha - 2) =
-\tfrac34$, so with $\sym{lifted-potential}{\field u} = z^{1/2}\field\Phi$

$$\boxed{\nabla^2_H\field u + \tfrac34\field u = z^{5/2}\,\nabla^2\field\Phi} . \label{eq:lift}$$

Both sides are in $\mathrm{J\,kg^{-1}\,m^{1/2}}$, because $\nabla^2_H$ is $z^2$ times second derivatives. Between the
camera and the scene $\nabla^2\field\Phi = 0$, so

$$\bigl(\nabla^2_H + \tfrac34\bigr)\,\field u = 0 .$$

:::: derivation
### From $\nabla^2\Phi$ to $\nabla^2_H u$

**The general formula.** The Laplace–Beltrami operator of a metric $g_{ij}$ is

$$\nabla^2_g u = \frac{1}{\sqrt g}\,\partial_i\bigl(\sqrt g\,g^{ij}\,\partial_ju\bigr),$$

where $g$ is the determinant of $g_{ij}$ and $g^{ij}$ its inverse (we state it without proof). **A check:** the plane in
polar coordinates $a$, $\varphi$ has $\dd s^2 = \dd a^2 + a^2\dd\varphi^2$, so $\sqrt g = a$, $g^{aa} = 1$ and
$g^{\varphi\varphi} = 1/a^2$. For a function of $a$ alone the formula gives $(1/a)(au')' = u'' + u'/a$, the Laplacian of
section [3.6](/tutorial/noise/bessel-and-airy/#the-circular-ripple-obeys-bessels-equation).

**Our metric.** Here $g_{ij} = \delta_{ij}/z^2$, so $\sqrt g = z^{-3}$ and $\sqrt g\,g^{ij} = \delta_{ij}/z$. Then

$$\nabla^2_Hu = z^3\,\partial_i\Bigl(\frac{\partial_iu}{z}\Bigr) = z^2\nabla^2u - z\,\partial_zu ,$$

because only $\partial_z$ acts on $1/z$, and it gives $-1/z^2$.

**The power of $z$.** Only $\partial_z$ meets the factor $z^\alpha$ in $u = z^\alpha\Phi$, so the product rule gives

$$\begin{aligned}
\partial_zu &= \alpha z^{\alpha-1}\Phi + z^\alpha\partial_z\Phi ,\\
\partial_z^2u &= \alpha(\alpha - 1)z^{\alpha-2}\Phi + 2\alpha z^{\alpha-1}\partial_z\Phi\\
&\quad + z^\alpha\partial_z^2\Phi .
\end{aligned}$$

The derivatives across, $\partial_x^2$ and $\partial_y^2$, act on $\Phi$ alone, so

$$\begin{aligned}
z^2\nabla^2u &= z^{\alpha+2}\nabla^2\Phi + 2\alpha z^{\alpha+1}\partial_z\Phi\\
&\quad + \alpha(\alpha - 1)z^\alpha\Phi ,\\
z\,\partial_zu &= \alpha z^\alpha\Phi + z^{\alpha+1}\partial_z\Phi .
\end{aligned}$$

Subtracting the second line from the first leaves $(2\alpha - 1)z^{\alpha+1}\partial_z\Phi$ and $\bigl(\alpha(\alpha -
1) - \alpha\bigr)z^\alpha\Phi = \alpha(\alpha - 2)z^\alpha\Phi$, which is the formula in the text.
::::

**Checks.** For $u = z^s$ the formula for $\nabla^2_H$ gives $s(s - 2)z^s$, so $(\nabla^2_H + \tfrac34)z^s = (s -
\tfrac12)(s - \tfrac32)z^s$. A constant potential, $s = \tfrac12$, and a uniform pull, $\field\Phi \propto z$ with $s =
\tfrac32$, are harmonic, and both give zero: the $\tfrac34$ is the number that lets both solve the equation.

**What it means.** A change of scale is an isometry, so a scene at twice the depth, twice as large, gives the same
pattern at the camera, twice as wide,[^inversion] and at a fixed signal-to-noise ratio the blur is a fixed angle, as
section 3.7 found from the formula of the blur. The hyperbolic picture adds that the change of scale is a rigid move of
the whole problem, a step straight down, so whatever is true of resolution at one depth is true at every depth, in
units of that depth. Cells of one size in this metric,
squares as wide as they are deep, each hold the same number of resolved patterns, which is why that number is counted per
area $z^2$ (section [3.8](/tutorial/noise/bits/#where-a-ripple-stands-well-above-its-noise-it-carries-log_2-s-bits)).[^geometry]

::: derivation
### The precision of a place has the same geometry

Section 3.3 found that two scenes a small step $\dd\theta$ apart predict readings $D$ noise standard deviations apart,
with $D^2 = F_{kl}\,\dd\theta_k\,\dd\theta_l$ and $F_{kl}$ the Fisher matrix. Read as a line element on the scenes, $D^2$
is the **Fisher metric**. For one mass of unknown size at $(x_0, y_0, z)$ beneath an endless flat array, the matrix of
section 3.3, with the mass projected out as in section 3.4, gives

$$D^2 = \mathcal R^2\,\frac{\tfrac52\,\dd x_0^2 + \tfrac52\,\dd y_0^2 + \dd z^2}{z^2} .$$

This is hyperbolic only while $\mathcal R$ is held fixed; a real camera's $\mathcal R$ falls as $1/z^2$, so its error in
metres grows as $z^3$ (section 3.3). At fixed $\mathcal R$,
the stretch $x' = \sqrt{5/2}\,x_0$, $y' = \sqrt{5/2}\,y_0$ turns $D^2$ into $\mathcal R^2(\dd x'^2 + \dd y'^2 + \dd
z^2)/z^2$, exactly $\mathcal R^2$ times the line element above. So a mass is placed to the same fraction of its depth at
every depth, with the error across $\sqrt{2/5} = 0.63$ times the error in depth.
:::

{{paper fig:near-field-geometry}}

In the figure each pattern is as wide, at half its height, as its mass is deep: the bump of a point mass at the depth
$z$ is $1.001\,z$ wide at half its height
([section 3.7](/tutorial/noise/blur-law/#step-1-one-number-measures-the-camera)). In the line element $\dd s^2$ that
width is the same length, 1.0, at every depth.

## Inside a sphere of sensors, the precision of a place has the geometry of Poincaré's ball {#inside-a-sphere-of-sensors-the-precision-of-a-place-has-the-geometry-of-poincares-ball}

We want the Fisher metric of the last box for a camera that surrounds the scene. Sensors cover a sphere of radius $R$, in
metres, and one mass $\matter m$ lies inside it at $\vect x$, at the distance $r$ from the centre.[^sphere] As under the
flat array, **the mass is unknown and is fitted together with its place**, and **the noise is white over the sphere**,
with the density $N_0$ on each component that a sensor reads.

**The metric from one overlap.** Let $\vect f_{\vect x}(\vect n)$ be the list of readings that one kilogram at $\vect x$
gives at the point $\vect n$ of the sphere, so that the mass gives $\matter m\vect f_{\vect x}$. The **overlap** of two
places is

$$\mathcal K(\vect x, \vect x') = \frac{1}{N_0}\oint\vect f_{\vect x}\cdot\vect f_{\vect x'}\,\dd A ,$$

in $\mathrm{kg^{-2}}$, with the components multiplied in pairs and added. The sums of section 3.3, turned into integrals
as under the flat array, give the Fisher matrix of the place and the mass from it. With $\partial_i$ acting on $\vect x$
and $\partial'_j$ on $\vect x'$, all taken at $\vect x' = \vect x$,

$$F_{ij} = \matter m^2\,\partial_i\partial'_j\mathcal K, \qquad F_{im} = \matter m\,\partial_i\mathcal K, \qquad F_{mm} =
\mathcal K ,$$

and the whole pattern stands $\mathcal R = \matter m\sqrt{\mathcal K(\vect x, \vect x)}$ above the noise. Fitting the
mass is a projection (section
[3.4](/tutorial/noise/symmetric-matrices/#in-whitened-data-fitting-a-nuisance-is-a-projection)), which replaces
$F_{ij}$ by $F_{ij} - F_{im}F_{jm}/F_{mm}$, so

$$D^2 = \mathcal R^2\,g_{ij}\,\dd x_i\,\dd x_j, \qquad g_{ij} = \frac{\partial_i\partial'_j\mathcal K}{\mathcal K} -
\frac{\partial_i\mathcal K\,\partial'_j\mathcal K}{\mathcal K^2} = \partial_i\partial'_j\ln\mathcal K .$$

The metric $g_{ij}$ is in $\mathrm{m^{-2}}$, and the mass has dropped out of it: it belongs to the sensors alone.

**The overlap of a sphere.** At a point $\vect n$ at the distance $\rho \ge R$ from the centre, beyond the mass, the
generating function and the addition theorem write the potential of one kilogram as a sum of solid harmonics (section
[2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments)):

$$-\frac{G}{|\vect n - \vect x|} = -G\sum_{\ell m}\frac{4\pi}{2\ell + 1}\,r^\ell\,Y^*_{\ell m}(\hat x)\,\frac{Y_{\ell
m}(\hat n)}{\rho^{\ell+1}} .$$

Take one term, $h = Y_{\ell m}(\hat n)/\rho^{\ell+1}$, harmonic outside the sphere (section 2.2). On the sphere its
gradient has the part $-(\ell + 1)h/R$ along the radius and $\nabla_\Omega h/R$ across it, where $\nabla_\Omega$ is the
gradient on the unit sphere. Integrating by parts over the closed sphere and using $\nabla^2_\Omega Y_{\ell m} = -\ell(\ell
+ 1)Y_{\ell m}$ (section 2.2) gives $\oint|\nabla_\Omega h|^2\dd\Omega = \ell(\ell + 1)\oint|h|^2\dd\Omega$, so

$$\oint|\nabla h|^2\,\dd A = \frac{(\ell + 1)(2\ell + 1)}{R^2}\oint|h|^2\,\dd A ,$$

and two terms of different $\ell$ or $m$ give zero, because their patterns are orthogonal. Each derivative $\partial_ih$
is again harmonic and falls as $\rho^{-(\ell+2)}$, so it is made of terms of degree $\ell + 1$, and the same rule applied
to the three of them multiplies by $(\ell + 2)(2\ell + 3)/R^2$ once more for the tide. We use $\oint|Y_{\ell
m}|^2\dd A/R^{2\ell+2} = R^{-2\ell}$ and the addition theorem again, $\sum_mY^*_{\ell m}(\hat x)Y_{\ell m}(\hat x') =
(2\ell + 1)P_\ell(\cos\gamma)/4\pi$, with $\gamma$ the angle between $\vect x$ and $\vect x'$:

$$\begin{gathered}
\mathcal K_{\rm pull} = \frac{4\pi G^2}{N_0R^2}\sum_{\ell=0}^\infty(\ell + 1)\,t^\ell P_\ell(\cos\gamma),\\
\mathcal K_{\rm tide} = \frac{4\pi G^2}{N_0R^4}\sum_{\ell=0}^\infty(\ell + 1)(\ell + 2)(2\ell + 3)\,t^\ell
P_\ell(\cos\gamma),
\end{gathered} \qquad t = \frac{rr'}{R^2},$$

for sensors that read the three components of the pull and the nine entries of the tide. The prefactors are in
$\mathrm{kg^{-2}}$ in both, since $N_0$ is in $\mathrm{m^4\,s^{-4}}$ for the pull and $\mathrm{m^2\,s^{-4}}$ for the
tide. We write $c_\ell$ for the weights, $\ell + 1$ or $(\ell + 1)(\ell + 2)(2\ell + 3)$, and $F(t) = \sum_\ell
c_\ell t^\ell$ for the sum along one line, where $\cos\gamma = 1$.

**Along and across.** A step along the radius keeps $\cos\gamma = 1$. Differentiating $\ln F(rr'/R^2)$ with respect to
$r'$ and then $r$ gives, at $r' = r$,

$$g_{rr} = \frac{1}{R^2}\,\frac{\dd}{\dd t}\Bigl(t\,\frac{\dd\ln F}{\dd t}\Bigr) \quad\text{at } t = \frac{r^2}{R^2} .$$

Steps across, of lengths $r\,\dd\vartheta$ and $r\,\dd\vartheta'$ in one plane through the centre, give $\cos\gamma =
\cos(\vartheta - \vartheta')$, whose mixed derivative is 1 at $\vartheta = \vartheta'$, where its first derivatives
vanish. So the metric across is

$$g_\perp = \frac{1}{r^2F}\sum_\ell c_\ell\,t^\ell P'_\ell(1), \qquad P'_\ell(1) = \frac{\ell(\ell + 1)}{2} .$$

The last value comes from differentiating the generating function $(1 - 2t\cos\gamma + t^2)^{-1/2} = \sum_\ell t^\ell
P_\ell(\cos\gamma)$ with respect to $\cos\gamma$ at $\cos\gamma = 1$, which gives $t/(1 - t)^3 = \sum_\ell\tfrac12\ell(\ell
+ 1)t^\ell$. Steps along and across do not mix, by the symmetry about the line through the centre.

**The sums.** Each sum follows from $1/(1 - t)$ and $t/(1 - t)^3$, because $t\,\dd/\dd t$ multiplies the term $t^\ell$
by $\ell$. For the pull, $F = 1/(1 - t)^2$ and $\sum_\ell c_\ell t^\ell P'_\ell(1) = t(2 + t)/(1 - t)^4$; for the tide,
$F = 6(1 + t)/(1 - t)^4$ and the sum across is $6t(5 + 12t + 3t^2)/(1 - t)^6$. For the pull,
$t\,\dd\ln F/\dd t = 2t/(1 - t)$, whose derivative is $2/(1 - t)^2$; for the tide, $t/(1 + t) + 4t/(1 - t)$, whose
derivative is $1/(1 + t)^2 + 4/(1 - t)^2$. With $\dd\Omega$ the angle of a step across, so that $r\,\dd\Omega$ is its
length,

$$\boxed{\begin{gathered}
D^2_{\rm pull} = \mathcal R^2\Bigl[2\,\dd r^2 + \Bigl(2 + \frac{r^2}{R^2}\Bigr)r^2\dd\Omega^2\Bigr]\frac{R^2}{(R^2 -
r^2)^2},\\
D^2_{\rm tide} = \mathcal R^2\bigl[g_r\,\dd r^2 + g_t\,r^2\dd\Omega^2\bigr]\frac{R^2}{(R^2 - r^2)^2},\\
g_r = \frac{5 + 6t + 5t^2}{(1 + t)^2}, \qquad g_t = \frac{5 + 12t + 3t^2}{1 + t}, \qquad t = \frac{r^2}{R^2} .
\end{gathered}}$$

The bracket is in $\mathrm{m^2}$ and the factor after it in $\mathrm{m^{-2}}$, so $D^2$ is a pure number. **Two
limits.** At the centre, $t = 0$, both metrics are the same in every direction, $2/R^2$ and $5/R^2$, as they must be,
since no direction is special there. Near the sensors, $t \to 1$, the weights tend to 2 and 3 for the pull and to 4 and
10 for the tide: $D^2_{\rm tide} \to \mathcal R^2(4\,\dd r^2 + 10\,r^2\dd\Omega^2)R^2/(R^2 - r^2)^2$.

**Poincaré's ball is the space below a flat camera.** The line element

$$\dd s^2 = \frac{R^2\,(\dd r^2 + r^2\dd\Omega^2)}{(R^2 - r^2)^2}$$

is hyperbolic space in **Poincaré's ball**: the distance from the centre to the sphere, $\int_0^RR\,\dd r/(R^2 - r^2)$, is
infinite, so the sphere lies at infinity, as the camera's plane did. With lengths in units of $R$, the inversion

$$\vect x = \vect c + \frac{2(\vect w - \vect c)}{|\vect w - \vect c|^2}, \qquad \vect c = (0, 0, -1),$$

carries the space below a flat camera, the points $\vect w$ with depth $w_3 > 0$, into the ball; $\vect c$ is the point
one unit above the camera's plane. Expanding the squares, as for Kelvin's image (section
[2.4](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage)),
gives two facts. Two points are carried to points $2|\vect w_1 - \vect w_2|/(|\vect w_1 - \vect c|\,|\vect w_2 - \vect
c|)$ apart, so a small step has $|\dd\vect x| = 2|\dd\vect w|/|\vect w - \vect c|^2$. And $1 - |\vect x|^2 = 4w_3/|\vect w
- \vect c|^2$, so the camera's plane goes to the sphere and the point one unit deep to the centre. Dividing,

$$\frac{|\dd\vect x|^2}{(1 - |\vect x|^2)^2} = \frac{|\dd\vect w|^2}{4w_3^2} :$$

Poincaré's ball is the space below a flat camera, with every length halved. Near the sensors, at the depth $z = R - r
\ll R$, the factor $R^2/(R^2 - r^2)^2 = 1/z^2(2 - z/R)^2$ tends to $1/4z^2$, a step $\dd r$ is a step $-\dd z$ in depth,
and $r\,\dd\Omega$ is a step $\dd x$ across, so

$$D^2_{\rm tide} \to \mathcal R^2\,\frac{\dd z^2 + \tfrac52\,\dd x^2}{z^2}, \qquad D^2_{\rm pull} \to
\mathcal R^2\,\frac{\dd z^2 + \tfrac32\,\dd x^2}{2z^2} .$$

The first is the flat array's metric of the last box, exactly. Near the sensors each metric is therefore Poincaré's,
with unequal weights in depth and across, and for tidal sensors the ratio of the weights is the $5/2$ of a point under a
flat array.

**A number.** Ten centimetres inside a sphere of tidal sensors 1 m in radius, $t = 0.81$, $g_r = 4.01$, $g_t = 9.22$
and $R^2/(R^2 - r^2)^2 = 27.7\unit{m^{-2}}$. A step in depth then has the weight $111\unit{m^{-2}}$ and a step across
$255\unit{m^{-2}}$, against the flat array's 100 and 250 at the same depth: the curvature of the sphere adds 11 and 2
per cent. At $\mathcal R = 767$ the mass is placed to 0.12 mm in depth and 0.082 mm across.

**The harmonic measure.** The Poisson kernel of the ball, $P = (R^2 - r^2)/4\pi R|\vect n - \vect x|^3$ (section 2.4), is
positive and integrates to 1 over the sphere, so for each place $\vect x$ it is a probability on the sphere, the
**harmonic measure** seen from $\vect x$. A family of probabilities has the Fisher metric $g_{ij} = \langle\partial_i\ln
P\,\partial_j\ln P\rangle$, the mean taken over $P$, as section 3.3 defined it through the variance of the score.
Differentiating under the integral, with the integrals of $|\vect n - \vect x|^{-3}$ and $|\vect n - \vect x|^{-5}$ over
the sphere, gives

$$g = \Bigl[\Bigl(3 + \frac t5\Bigr)\dd r^2 + \Bigl(3 - \frac{3t}{5}\Bigr)r^2\dd\Omega^2\Bigr]\frac{R^2}{(R^2 - r^2)^2},
\qquad t = \frac{r^2}{R^2},$$

a metric of the same kind: Poincaré's factor, with weights that are 3 at the centre and 3.2 along and 2.4 across at the
sphere, so that a step across counts 0.91 times a step along at $r = 0.6R$. The **Poisson kernel of hyperbolic space**,
in $N$ dimensions $[(R^2 - r^2)/|\vect n - \vect x|^2]^{N-1}$ divided by the area of the sphere, has a Fisher metric that
is exactly a constant times Poincaré's at every place [@ItohShishido2008]; the constant, found at the centre, is $4(N -
1)^2/N$, which is 16/3 in three dimensions. The Euclidean kernel is $(R^2 - r^2)R^{N-2}/|\vect n - \vect x|^N$ divided by
the same area, and the two agree only when $N = 2$. In the plane, then, the harmonic measure is exactly hyperbolic.

::: derivation
### In the plane the harmonic measure is exactly hyperbolic

We take lengths in units of $R$ and write points of the plane as complex numbers: $x$ inside the unit circle, at the
distance $r = |x|$ from the centre, and $\zeta = e^{i\varphi}$ on the circle. The same Kelvin image in the plane gives
the circle's Poisson kernel, $P = (1 - |x|^2)/2\pi|\zeta - x|^2$ per unit length of the circle, and the mean over $P$ of
any function harmonic inside the circle is its value at $x$.

**The score.** A step $\delta x$, a small complex number, changes $\ln|\zeta - x|^2 = \ln(\zeta - x) + \ln(\bar\zeta -
\bar x)$ by $-2\,\mathrm{Re}[\delta x/(\zeta - x)]$ and $\ln(1 - x\bar x)$ by $-2\,\mathrm{Re}[\bar x\,\delta x]/(1 -
|x|^2)$, so

$$\delta\ln P = 2\,\mathrm{Re}\bigl[\delta x\,A\bigr], \qquad A = \frac{1}{\zeta - x} - \frac{\bar x}{1 - |x|^2} .$$

On the circle $\bar\zeta = 1/\zeta$, so $1/(\zeta - x) = \bar\zeta/(1 - x\bar\zeta) = \sum_{n\ge0}x^n\bar\zeta^{n+1}$, a
series in powers of $\bar\zeta$ alone. Each power $\bar\zeta^k$ is the value on the circle of $\bar w^k$, which is
harmonic, so its mean is $\bar x^k$; in the same way the mean of $\zeta^k$ is $x^k$.

**The means.** The mean of $1/(\zeta - x)$ is $\sum_nx^n\bar x^{n+1} = \bar x/(1 - |x|^2)$, so $\langle A\rangle = 0$,
as the mean of a score must be. The mean of $A^2$ vanishes too: $A^2$ is a series in $\bar\zeta$, whose mean is found by
putting $\bar x$ in place of $\bar\zeta$, and that turns $A$ into zero. For $|A|^2$ we need $1/|\zeta - x|^2 =
\sum_{n,m}x^n\bar x^m\zeta^{m-n}$. The mean of each term is $r^{2\max(n,m)}$, and $2k + 1$ pairs $(n, m)$ have the
larger number $k$, so

$$\Bigl\langle\frac{1}{|\zeta - x|^2}\Bigr\rangle = \sum_{k\ge0}(2k + 1)\,r^{2k} = \frac{1 + r^2}{(1 - r^2)^2}, \qquad
\langle|A|^2\rangle = \frac{1 + r^2}{(1 - r^2)^2} - \frac{r^2}{(1 - r^2)^2} = \frac{1}{(1 - r^2)^2} .$$

**The metric.** Since $(2\,\mathrm{Re}\,a)^2 = 2|a|^2 + 2\,\mathrm{Re}\,a^2$,

$$\langle(\delta\ln P)^2\rangle = 2|\delta x|^2\langle|A|^2\rangle + 2\,\mathrm{Re}\bigl[\delta x^2\langle A^2\rangle\bigr]
= \frac{2\,|\delta x|^2}{(1 - r^2)^2} .$$

With $R$ restored this is $2R^2|\dd\vect x|^2/(R^2 - r^2)^2$, twice Poincaré's metric, the same in every direction and
at every place: $4(N - 1)^2/N$ with $N = 2$. **A check:** at the centre $A = \bar\zeta$, and a step of size $|\delta x|$
toward the angle $\varphi_0$ gives $\delta\ln P = 2|\delta x|\cos(\varphi - \varphi_0)$, whose square has the mean
$2|\delta x|^2$, since the mean of $\cos^2$ is one half.
:::

**The idea to keep: the blur limits what can be drawn of a scene crowded with mass, not how finely a few positive masses
can be told apart. Positivity fixes a few sources from a few moments, so their resolution improves as a power of the
sensitivity; the zeros of the shear give a thin layer's size with no image; and the space below a flat camera is
hyperbolic, which makes every depth alike and the blur an angle.**

::: problems
### Practice

**[3.9]** Why can no linear image use the fact that mass is positive?

::: solution
A linear image is a fixed weighted sum of the readings, so it turns the readings $-\mathbf y$ into minus the image of
$\mathbf y$. A condition on the sign of the answer cannot be built from fixed weights.
:::

**[3.9]** Two equal masses 5 cm apart lie 1 m below the camera, at $\SNR = 10^3$. Is the blur or the zeros of the shear
the better ruler?

::: solution
The zeros. Each is placed to about $z^2/2\mathcal Rd = 1/(2\times767\times0.05)\unit{m} = 1.3\unit{cm}$, less than their
5 cm separation, while the blur is 42 cm.
:::

**[3.9]** In the metric $\dd s^2 = (\dd x^2 + \dd y^2 + \dd z^2)/z^2$, how long is a step of 1 cm across at a depth of 1 m,
and at 10 cm?

::: solution
0.01 and 0.1: the same step is ten times longer near the camera.
:::

**[3.9]** Why does the positive image leave the left-hand safe almost empty, while the Gaussian image cannot say which
safe holds the gold?

::: solution
The Gaussian image may add patterns of positive and negative mass that the data barely see. Forbidding negative mass
removes them, because the true scene is empty round the safes, and the readings can then be fitted only by mass near the
gold.
:::

**[3.9]** Masses on a line have the moments $\matter\mu = (3, 0, 1.5, -0.75)$, in kilograms times powers of metres. Find
the two places and the two masses, and check that the $2\times2$ Hankel matrix is positive definite.

::: solution
Equation [](#eq:hankel) reads $3c_0 = 1.5$ and $1.5c_1 = -0.75$, so $c_0 = 0.5$ and $c_1 = -0.5$, and $x^2 + 0.5x - 0.5 =
0$ has the roots $0.5$ and $-1$ m. Then $\matter m_1 + \matter m_2 = 3$ and $0.5\matter m_1 - \matter m_2 = 0$ give 2 kg
at 0.5 m and 1 kg at $-1$ m. The Hankel matrix is diagonal, with the eigenvalues 3 and 1.5, both positive.
:::

**[3.9]** A round body of radius $R$ has the even moments $\int\matter\rho\,r^{2n}\,\dd V = 8\pi\matter\rho_0R^{2n+3}/(2n +
3)(2n + 5)$ for every $n$. What is its density, and why can no other continuous density have these moments?

::: solution
Try $\matter\rho = \matter\rho_0(1 - r^2/R^2)$: $4\pi\matter\rho_0\int_0^R(r^{2n+2} - r^{2n+4}/R^2)\,\dd r =
4\pi\matter\rho_0R^{2n+3}[1/(2n + 3) - 1/(2n + 5)]$, which is the given moment. By Weierstrass's theorem, after the
substitution $s = r^2$, all the even moments fix a continuous density, so this is the only one. Its mass, $n = 0$, is
$8\pi\matter\rho_0R^3/15$, two fifths of a uniform ball of density $\matter\rho_0$.
:::

**[3.9]** Two equal masses 10 cm apart lie 1 m below the camera, at $\SNR = 10^3$. To what precision do four noisy
moments give their separation, and how does it compare with the zeros of the shear?

::: solution
With the spread measured to $0.74\,\matter Mz^2/\mathcal R$, $\delta d = 2\,\delta\matter\mu_2/\matter Md = 1.48\,z^2/\mathcal
Rd = 1.48/(767\times0.1)\unit{m} = 1.9\unit{cm}$, a fifth of the separation. Each zero of the shear is placed to about
$z^2/2\mathcal Rd = 0.65$ cm, so the zeros make the finer ruler.
:::

**[3.9]** A mass lies at the centre of a sphere of tidal sensors 1 m in radius, and its pattern stands $\mathcal R = 767$
above the noise. How precisely is it placed? And by sensors of the pull?

::: solution
At the centre $D^2_{\rm tide} = 5\,\mathcal R^2|\dd\vect x|^2/R^2$, so the error in every direction is $R/\sqrt5\,\mathcal R
= 1\unit{m}/(2.24\times767) = 0.58\unit{mm}$. For the pull the weight is 2, and the error $R/\sqrt2\,\mathcal R = 0.92$
mm.
:::

### Stretch

**[3.9]** A layer is two unequal masses $\matter m_1$ and $\matter m_2$ at $w_1$ and $w_2$. Compute $w_{\rm cm}$ and
$\matter Q_c$, and show that the rule puts the zeros on the perpendicular bisector of the pair only when $\matter m_1 =
\matter m_2$. For 2 kg and 1 kg at $\pm0.5$ m, how far apart are the zeros?

::: solution
With $\matter M = \matter m_1 + \matter m_2$, $w_{\rm cm} = (\matter m_1w_1 + \matter m_2w_2)/\matter M$, so $w_1 - w_{\rm
cm} = \matter m_2(w_1 - w_2)/\matter M$ and $w_2 - w_{\rm cm} = -\matter m_1(w_1 - w_2)/\matter M$. Then $\matter Q_c =
\matter m_1\matter m_2(w_1 - w_2)^2/\matter M$, and the zeros stand at $w_{\rm cm} \pm i\sqrt{\matter m_1\matter
m_2}\,(w_1 - w_2)/\matter M$, on the line through the centre of mass across the pair. That line is the bisector only
when the centre of mass is the midpoint, so when $\matter m_1 = \matter m_2$. For 2 and 1 kg the zeros are $2\sqrt2/3 =
0.943$ m apart, not 1 m; the exact shear puts them 0.900 m apart at a height of 2 m, so they move with depth.
:::

**[3.9]** Three equal masses $\matter m$ lie at $-d$, 0 and $d$ on a line, with lengths in units of the depth and $d \ll
1$. Find the eigenvalues of the $3\times3$ Hankel matrix of $\matter\mu_0$ to $\matter\mu_4$, and show that its condition
number grows as $d^{-4}$, the power $2(k - 1)$ for $k = 3$.

::: solution
The moments are $\matter\mu_0 = 3\matter m$, $\matter\mu_2 = 2\matter md^2$, $\matter\mu_4 = 2\matter md^4$, and the odd
ones vanish. The matrix splits into the entry $2\matter md^2$ and the block $\matter m\bigl(\begin{smallmatrix}3 & 2d^2\\
2d^2 & 2d^4\end{smallmatrix}\bigr)$, whose determinant is $2\matter m^2d^4$ and whose trace is close to $3\matter m$. So
its eigenvalues are close to $3\matter m$ and $2\matter md^4/3$, and the condition number is close to $9/2d^4$. The
bound of the text, with all three places within $2d$ of one another, gives at least $3/16d^4$.
:::

**[3.9]** Find the Fisher metric of the harmonic measure of a ball at its centre, and that of the hyperbolic Poisson
kernel $[(R^2 - r^2)/|\vect n - \vect x|^2]^2/4\pi R^2$ there.

::: solution
At $\vect x = 0$ only $|\vect n - \vect x|$ changes to first order, and $\ln|\vect n - \vect x|^2$ changes by $-2\,\vect
n\cdot\dd\vect x/R^2$. The harmonic measure has $\ln P = -\tfrac32\ln|\vect n - \vect x|^2 + \dots$, so its score is
$3\,\vect n\cdot\dd\vect x/R^2$, whose square has the mean $9|\dd\vect x|^2/3R^2 = 3|\dd\vect x|^2/R^2$, because the
mean of $(\hat n\cdot\hat e)^2$ over the sphere is one third. The hyperbolic kernel has the power $-2$ in place of
$-\tfrac32$, so its score is $4\,\vect n\cdot\dd\vect x/R^2$, and its metric is $16|\dd\vect x|^2/3R^2$, the constant
$4(N - 1)^2/N$ with $N = 3$.
:::

### The camera

**[3.9]** Show that a change of scale about a point of the camera's plane, $\field u_\lambda(x, y, z) = \field u(x/\lambda,
y/\lambda, z/\lambda)$, carries a solution of $(\nabla^2_H + \tfrac34)\field u = 0$ to a solution. Then explain in two
sentences why the blur is a fixed angle and why the number of patterns resolved is counted per area $z^2$.

::: solution
Each derivative of $\field u_\lambda$ brings a factor $1/\lambda$, and the factors $z^2$ and $z$ in $\nabla^2_H = z^2\nabla^2
- z\,\partial_z$ are $\lambda^2$ and $\lambda$ times their values at $z/\lambda$. The factors cancel, so $(\nabla^2_H +
\tfrac34)\field u_\lambda$ is $(\nabla^2_H + \tfrac34)\field u$ taken at $(x, y, z)/\lambda$, which is zero. So a scene
$\lambda$ times deeper and larger makes the same pattern at the camera, $\lambda$ times wider, and at a fixed
signal-to-noise ratio the finest detail is a fixed fraction of the depth, an angle. The same holds for every pattern, so
the number resolved under an area of the camera depends only on that area divided by $z^2$.
:::
:::

::: paper
- [*A worked case*](/paper/#par:a-worked-case) (Section IV) and [*The worked inversion*](/paper/#par:the-worked-inversion)
  (Appendix A) give the $\pm730$ kg of the Gaussian image; [*The positivity of mass*](/paper/#par:the-positivity-of-mass)
  gives the positive image's weights of the safe.
- [*The zeros of the shear*](/paper/#par:the-zeros-of-the-shear) (Section IV) states equation
  [](/paper/#eq:shear-zeros), the precision $z^2/2\mathcal Rd$ and Figure [](/paper/#fig:buried-ruler).
- [*The geometry of the near field*](/paper/#par:the-geometry-of-the-near-field) (Section IV) states equation
  [](/paper/#eq:hyperbolic) and Figure [](/paper/#fig:near-field-geometry).
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV) reads a round body's density from its moments
  (section [R4](/tutorial/response/reading-section-iv-3/#a-warm-bodys-moments-change-at-a-rate-set-by-its-temperature-and-its-density-alone)); [Section XIV](/paper/#sec:hole) shows that a black hole's
  tidal response belongs to no positive mass, a Hankel condition of this section's kind.
:::

::: deeper
- V. I. Morgenshtern and E. J. Candès [@MorgenshternCandes2016]: positive sources on a grid need no minimum separation,
  only that at most $r$ sources lie in any window about $1.9r$ times the finest kept wavelength; the error grows as the
  blur divided by the grid's spacing, to the power $2r$. D. L. Donoho [@Donoho1992] treats sources of either sign.
- E. J. Candès and C. Fernandez-Granda [@CandesFernandezGranda2014]: point sources of any sign are recovered exactly when
  at least twice the finest kept wavelength apart. Under a flat camera at 1 m and $\SNR = 10^3$ that is 1.2 m, about
  three blur widths: the theorem does not reach masses a few centimetres apart.
- C. L. Lawson and R. J. Hanson, *Solving Least Squares Problems* (SIAM, 1995), chapter 23: non-negative least squares.
- J. W. Cannon and others, "Hyperbolic geometry", in *Flavors of Geometry* (MSRI, 1997): the upper half-space.
:::

[^positive]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in its paragraphs on the worked case
    and the positivity of mass.

[^weierstrass]: K. Weierstrass, *Sitzungsberichte der Königlich Preußischen Akademie der Wissenschaften zu Berlin*,
    633 and 789 (1885). The proof by the mean of $f(K/n)$ is S. Bernstein's (1912).

[^sphere]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV,
    [*The geometry of the near field*](/paper/#par:the-geometry-of-the-near-field), which states both metrics, their
    limit at the sensors and the harmonic measure.

[^gautschi]: W. Gautschi, *Numerische Mathematik* 4, 117 (1962): the inverse has a norm of at most
    $\max_a\prod_{b\ne a}(1 + |x_b|)/|x_a - x_b|$, of order $d^{-(k-1)}$ for $k$ places spaced about $d$ apart.

[^hidden]: Of all the scenes that add 500 kg to the right-hand safe, this is the one the Gaussian image finds least
    improbable. It is $P^{-1}\mathbf w$, scaled, where $P = A^{\mathsf T}A + \sigma_m^{-2}I$ is the matrix of section
    3.5, $\sigma_m = 324$ kg its prior spread for one cell, and $\mathbf w$ a list with one in each cell of the safe and
    zero elsewhere.

[^draws]: At $10^3$ the draws are skewed: nine in ten lie between 279 and 332 kg, most of them close below the truth and
    a few far lower, so the median, 323.8 kg, lies above the mean.

[^grid]: A point mass of 324.24 kg at the bar's centre, between grid points, already gives 326.4 kg in the safe, while the
    same mass on a grid point gives 324.24 kg exactly. Most of the rest comes from the bar's 40 cm of depth.

[^merge]: Cells a sixth of the separation wide, and 400 draws of the noise. Two masses count as drawn apart when each has
    its own run of filled cells, holding at least a quarter of a mass and centred within $d/4$ of it; other reasonable
    criteria give 7.9- to 8.6-fold.

[^zeros]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:shear-zeros), with the precision $z^2/2\mathcal Rd$ and its Fig. [](/paper/#fig:buried-ruler).

[^geometry]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:hyperbolic) and Fig. [](/paper/#fig:near-field-geometry), which cuts the ground into such cells.

[^inversion]: The other isometries of hyperbolic space include inversion in a sphere centred on the camera's plane, and it
    too carries solutions of [](#eq:lift) to solutions. It does not keep the noise uniform across the camera, however, so
    it is not a symmetry of the noisy camera.
