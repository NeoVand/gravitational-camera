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

The paper's [worked case](/paper/#par:a-worked-case) points an array of $11\times11$ pixels, a metre across, at two
safes 3.5 m away, with the empty room and the safes themselves subtracted. What remains is a bar of gold, 30 by 14 by
40 cm and 324 kg, in the right-hand safe. At a signal-to-noise ratio of $10^3$, the best image that only adds and
multiplies the readings weighs that safe to within $\pm730$ kg, more than twice the gold (chapter
[3.5](/tutorial/noise/wiener-filter/#many-unknowns-are-guessed-together-with-the-same-formula)). The paper's next
paragraph, [*The positivity of mass*](/paper/#par:the-positivity-of-mass), adds one fact: mass is never negative. With
that fact and nothing else, the same data put $315 \pm 20$ kg in the right-hand safe and almost nothing in the left.

So this chapter asks how one fact can beat the blur, which other features of a scene survive the blur, and what
geometry lies beneath them. In short, positivity forbids the mixtures of signed mass that the camera cannot see, the
places where the shear of the tide vanishes give a thin layer's size with no image, and beneath both lies a geometry
in which every depth looks alike.

::: plain
An image that only adds and multiplies the readings must allow every scene that fits them, including scenes with
negative mass. Put 500 kg of mass in a safe, and spread about 500 kg of negative mass thinly over the floor round it.
The camera can barely tell this scene from an empty room, because the two pulls nearly cancel at the camera. The large
errors of such an image hide in scenes like this one.

Mass is never negative. An image that obeys this has nowhere to hide extra mass, so it puts the gold where the data
need it and leaves almost every other place empty. A scene of a few separate masses is then fixed by a few averages of
its mass, such as its total, its centre and its spread, and the camera measures these averages well. The separation
at which two masses can be told from one, and the larger separation at which the image draws them apart, both shrink as
a power of the sensitivity. The blur shrinks far more slowly, only as the logarithm of the sensitivity grows.

Two more exact facts survive the blur. Above two equal masses, the stretching pattern of the tide has two points where
it vanishes, exactly as far apart as the masses, whenever the camera is higher above them than 0.87 times their
separation. And if every step is measured in units of its depth, every depth looks alike, which is why the blur is an
angle.
:::

## A linear image cannot use the sign of mass

We want to see where the $\pm730$ kg comes from, because positivity removes it. Chapter 3.5's image is the best linear
guess under a Gaussian prior, and we call it the **Gaussian image**. At $\SNR = 10^3$ only 17 of the camera's 231
patterns of cell mass stand above the noise (chapter
[3.4](/tutorial/noise/symmetric-matrices/#every-linear-camera-is-a-set-of-patterns-gains-and-blind-spots)), and one
scene shows how much mass the others can move. Spread 500 kg through the twelve cells of the right-hand
safe, between 25 and 59 kg in each, and spread about 500 kg of negative mass through the cells round it. The 500 kg is
a net figure: 111 cells lose 903 kg in all, at most 54 kg each, and 108 others gain 394 kg. This scene and the empty
room predict readings only $D = 0.17$ noise standard deviations apart, in the measure of chapter
[3.3](/tutorial/noise/measuring-a-number/#choosing-between-two-scenes-comes-down-to-one-gaussian-number), so no test
could tell them apart.[^hidden] The gold itself moves the readings by $D = 177$. So the Gaussian image must leave the
hidden scene almost as probable as no change at all, and its large error hides there. The negative mass hides only
because it is spread thin: $+500$ kg and $-500$ kg in two neighbouring cells would move the readings by $D = 35$, which
the camera sees plainly.

No rule that only adds and multiplies the readings can forbid the hidden scene. Such a rule turns the readings
$-\mathbf y$ into minus the image of $\mathbf y$, so it must draw negative mass for some data (chapter
[3.5](/tutorial/noise/wiener-filter/#a-linear-guess-cannot-keep-mass-positive-and-with-a-white-prior-it-is-harmonic)).

## Non-negative least squares keeps only the masses the data need

We want an image that uses the sign of mass and assumes nothing else. We keep chapter 3.4's whitened readings $\mathbf
y$, its design matrix $A$, and the list $\matter{\mathbf m}$ of cell masses $\matter m_j$, in kilograms. The
**misfit**

$$f(\matter{\mathbf m}) = |\mathbf y - A\matter{\mathbf m}|^2 = \sum_a\Bigl(y_a - \sum_jA_{aj}\matter m_j\Bigr)^2$$

is the sum of the squared differences between the readings and the predictions, each in units of the noise, so for
Gaussian noise the scene with the smallest misfit is the most likely one (chapter
[3.3](/tutorial/noise/measuring-a-number/#the-likelihood-scores-each-scene-by-how-well-it-explains-the-data)). The
**positivity constraint** is $\matter m_j \ge 0$ for every cell. **Non-negative least squares** is the problem

$$\text{minimize } |\mathbf y - A\matter{\mathbf m}|^2 \quad\text{over all } \matter{\mathbf m} \text{ with every }
\matter m_j \ge 0 .$$

Its answer is the most likely scene among those with no negative mass, and we call it the positive image. Unlike the
Gaussian image, it has no prior: nothing says how much mass a cell is expected to hold.

**The two conditions at the answer.** Differentiating the square with the chain rule gives the slopes of the misfit,

$$\frac{\partial f}{\partial\matter m_j} = 2\bigl[A^{\mathsf T}(A\matter{\mathbf m} - \mathbf y)\bigr]_j .$$

At the best positive scene each cell is in one of two states. Either it holds mass, $\matter m_j > 0$, and its slope is
zero, because a small change of either sign is allowed and neither may lower the misfit. Or it holds none, $\matter m_j
= 0$, and its slope is at least zero: adding mass would raise the misfit, and removing it is forbidden. These are the
**Karush–Kuhn–Tucker conditions** of the problem. Differentiating once more gives the matrix $2A^{\mathsf T}A$, which is
positive semidefinite (chapter 3.4), so the misfit curves upward or stays flat in every direction, like a bowl. Because
of that, any scene that meets both conditions in every cell is a best one (we state this without proof).

**Two cells.** Two pixels lie above two cells. A unit of mass in a cell gives the pixel above it the whitened reading 1
and the other pixel 0.6, so $A = \bigl(\begin{smallmatrix}1&0.6\\0.6&1\end{smallmatrix}\bigr)$, and the readings are
$\mathbf y = (1, 0.3)$. The best signed scene solves $A\matter{\mathbf m} = \mathbf y$: it is $(1.28, -0.47)$, with no
misfit, and it puts negative mass in the second cell. The best positive scene lies on the edge $\matter m_2 = 0$, where
$f = (1 - \matter m_1)^2 + (0.3 - 0.6\matter m_1)^2$. Its slope is $\partial f/\partial\matter m_1 = 2.72\matter m_1 -
2.36$, which is zero at $\matter m_1 = 0.87$. There $A\matter{\mathbf m} - \mathbf y = (-0.13, 0.22)$, so the slope in
the second cell is $\partial f/\partial\matter m_2 = 2\,(0.6\times(-0.13) + 0.22) = +0.28$. Both conditions hold, so the
answer is $(0.87, 0)$, with the misfit 0.066 (Figure [](#fig:nnls)).

![The misfit of the two-cell example, drawn as contours in the plane of the two cell masses, is a bowl of ellipses
about the best signed scene $(1.28, -0.47)$, which lies outside the shaded quarter of positive masses. The best positive
scene $(0.87, 0)$ lies where the darker contour, the misfit 0.066, touches the edge $\matter m_2 = 0$, and there the
downhill direction, minus the slopes $(0, 0.28)$, points out of the quarter. The arrow's length is
schematic.](tut-pos-nnls){#fig:nnls}

**Most cells end at exactly zero.** A scene with mass in only a few of its places is called **sparse**. At $\SNR =
10^3$ the positive image of the safe has mass in a median of 6 of its 231 cells. With no noise it has mass in 5 cells:
four inside the right-hand safe, and one at the far-left edge of the grid that holds 0.2 kg. The hidden scene of the
last section needs negative mass round the safe, so the constraint forbids it, and the doubt goes with it.

**Numbers.** Over many draws of the noise, the positive image puts $315\pm20$ kg in the right-hand safe and
$0.35\pm1.9$ kg in the left at $\SNR = 10^3$ (the mean and the spread over the noise), and $327.6\pm0.7$ kg in the
right at $10^4$.[^draws] The Gaussian image puts 228 kg there on average, with a spread of 729 kg. At $10^3$ the
positive image holds about 340 kg in all, 26 kg of it in a few cells elsewhere, which is more than the 324 kg of gold.
The reason is that noise which would push a cell below zero is cut off, while noise which pushes a cell up is kept, so
the cutting only adds mass. At $10^4$ the safe holds 3.3 kg more than the bar, mostly because the bar's centre falls
between the points of the grid.[^grid]

**What it cannot do.** Positivity removes only the scenes that need negative mass somewhere. An invisible positive
scene, such as a uniform layer under an endless flat camera (chapter
[2.5](/tutorial/outside/null-space/#a-uniform-sheet-is-invisible-to-a-tidal-camera)), can still be added. In a scene
crowded with mass every cell holds plenty, so a hidden pattern of small gains and losses keeps every cell positive, and
the blur of chapter 3.7 then holds.

## A positive distribution of mass is fixed by a few of its moments

We want the mathematics behind the last section: why a few compact positive masses are pinned by a few numbers. We take
the simplest case, masses on a line. Masses $\matter m_i > 0$ at the places $x_i$ have the **moments**

$$\sym{line-moment}{\matter\mu_n} = \sum_i\matter m_ix_i^n, \qquad n = 0, 1, 2, \dots,$$

in $\mathrm{kg\,m^n}$. (Here $\matter\mu$ is a moment; elsewhere the paper uses $\mu$ for rigidity and for a passing
mass.) The first is the total mass, $\matter\mu_1/\matter\mu_0$ is the centre of mass, and the higher ones are the
line's version of the multipole moments of chapter
[2.3](/tutorial/outside/multipoles/#each-degree-has-a-ceiling-lower-than-the-last-by-the-size-over-the-distance), which
a distant camera measures less well the higher they go. The **moment problem** asks which scenes have given moments.

**One mass.** With $\bar x = \matter\mu_1/\matter\mu_0$, the spread $\sum_i\matter m_i(x_i - \bar x)^2$ is a sum of
terms that cannot be negative. If it is zero, every mass lies at $\bar x$, and the scene is a single point. With signed
masses this fails: $+1$, $-3$, $+3$ and $-1$ kg at $x = 0$, $h$, $2h$ and $3h$ have $\matter\mu_0 = \matter\mu_1 =
\matter\mu_2 = 0$, so they can be added to any scene without changing its first three moments, however large $h$ is.

**Two masses from four moments.** Let two masses $\matter m_1$ and $\matter m_2$ lie at $x_1$ and $x_2$, the roots of a
quadratic $x^2 - c_1x - c_0 = (x - x_1)(x - x_2)$, with two unknown numbers $c_0$ and $c_1$. Each $x_i$ obeys $x_i^2 =
c_1x_i + c_0$. We multiply by $\matter m_ix_i^n$ and add over $i$: $\matter\mu_{n+2} = c_1\matter\mu_{n+1} +
c_0\matter\mu_n$. With $n = 0$ and $n = 1$ this is

$$\boxed{\begin{pmatrix}\matter\mu_0&\matter\mu_1\\\matter\mu_1&\matter\mu_2\end{pmatrix}\begin{pmatrix}c_0\\c_1\end{pmatrix}
= \begin{pmatrix}\matter\mu_2\\\matter\mu_3\end{pmatrix}} . \label{eq:hankel}$$

So the four moments $\matter\mu_0$ to $\matter\mu_3$ give $c_0$ and $c_1$, the quadratic gives the two places, and
$\matter\mu_0$ and $\matter\mu_1$ then give the two masses. A matrix of moments whose entries depend only on the sum of
the row and column numbers is a **Hankel matrix**. **A number:** masses of 2 and 1 kg at $x = 0.3$ and $-0.5$ m have
the moments 3, 0.1, 0.43 and $-0.071$. Equation [](#eq:hankel) gives $c_0 = 0.15$ and $c_1 = -0.2$, so the quadratic is
$x^2 + 0.2x - 0.15$, and its roots are 0.3 and $-0.5$ (Figure [](#fig:moments)).

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
polynomials can approximate any continuous function there (we state this without proof). A camera measures only the
first few moments well, and it is for a few moments that positivity makes the difference.

**Moments of positive mass make a positive semidefinite matrix.** For any numbers $a_0, \dots, a_k$,

$$\sum_{i,j}a_ia_j\matter\mu_{i+j} = \sum_l\matter m_l\Bigl(\sum_ia_ix_l^i\Bigr)^2 \ge 0 ,$$

so every Hankel matrix of a positive scene is positive semidefinite, in the sense of chapter
[3.4](/tutorial/noise/symmetric-matrices/#a-symmetric-matrix-stretches-space-along-perpendicular-axes). The $2\times2$
matrix of the example has the eigenvalues 3.004 and 0.426. The $3\times3$ matrix of $\matter\mu_0$ to $\matter\mu_4$ has
3.065, 0.444 and zero, and its eigenvector for zero, $(-0.15, 0.2, 1)$, holds the coefficients of $p$. **A
non-example:** $+1$ kg at 0.1 m and $-1$ kg at $-0.1$ m have the moments $(0, 0.2, 0, 0.002)$, whose $2\times2$ Hankel
matrix has the eigenvalue $-0.2$, so no positive scene has these moments.

![Two masses on a line and the quadratic whose roots are their places. The bars stand at $-0.5$ and 0.3 m, their
heights in proportion to their 1 and 2 kg, and below them $p(x) = x^2 + 0.2x - 0.15$, whose coefficients the four
moments give through equation [](#eq:hankel) (upper right), crosses zero exactly beneath each bar. The bars and
the parabola have their own vertical scales.](tut-pos-moments){#fig:moments}

## Positivity resolves as a power of the sensitivity, not its logarithm

We want the separation at which two masses can be told from one when the camera knows only that mass is positive,
and we compare it with the blur. Chapter
[3.3](/tutorial/noise/measuring-a-number/#two-masses-are-hard-to-tell-from-one) answered a narrower question, for a
camera told that the scene held one mass or two. Two equal masses $d$ apart and one mass at their centre predict
readings $D = \kappa\mathcal R\,d^2/z^2$ apart, with $\kappa = 0.34$, $\sym{pattern-snr}{\mathcal R} = 0.767\,\SNR$ the
signal-to-noise ratio of the whole pattern, and $z$ the depth. (That chapter wrote the separation $\delta$.) Asking for
$D = 2$, which is wrong one time in six, gives $d = \sqrt{2/\kappa}\;z/\sqrt{\mathcal R} = 2.4\,z/\sqrt{\mathcal R}$:
8.8 cm at 1 m and $\SNR = 10^3$, and 2.8 mm at $10^6$, against blurs of 42 and 25 cm (chapter
[3.7](/tutorial/noise/blur-law/#what-the-law-means)). A thousandfold gain in sensitivity shrinks this separation by
$\sqrt{1000} = 32$.

**The camera measures the spread.** Two equal masses $\matter M/2$ at $\bar x \pm d/2$ have the spread $\sum_i\matter
m_i(x_i - \bar x)^2 = \matter Md^2/4$, their quadrupole (chapter 2.3). So $D$ grows in proportion to the spread, and a
spread of $\matter Mz^2/4\kappa\mathcal R \approx 0.74\,\matter Mz^2/\mathcal R$ gives $D = 1$: this is the noise on a
measured spread.

**Positivity turns a small spread into a compact scene.** Each positive mass farther than $t$ from the centre adds at
least $\matter m_it^2$ to the spread, so the share of the mass beyond $t$ is at most the spread divided by $\matter
Mt^2$. This is **Chebyshev's inequality**, applied to mass instead of probability. With signed masses the spread bounds
nothing, as the masses $+1$, $-3$, $+3$, $-1$ showed. So, among positive scenes, readings whose spread is zero within
its noise guarantee that the mass lies within a distance of order $z/\sqrt{\mathcal R}$ of one point, and readings
whose spread stands well above the noise rule out a single compact mass. The readings can therefore decide between one
compact mass and something wider at a separation that scales as

$$\boxed{d \propto \frac{z}{\sqrt{\mathcal R}}} ,$$

a power of the sensitivity, without being told how many masses there are. This is what positivity adds to chapter
3.3. The scaling law drops the factor of 2.4 that a decision at $D = 2$ needs. The argument is a sketch, because it
assumes that the spread of an unknown positive scene is measured as well as the spread of chapter 3.3's pair.

**Drawing the two masses takes more.** To draw two separate peaks in the right places, the positive image needs more
of the pair's shape than its spread, and higher moments are measured less well (chapter 2.3). On a simple model, a row
of cells under a row of sensors that read the tide, the positive image draws two equal masses as two peaks down to a
separation of $0.14z$ at $\SNR = 10^3$ and $0.016z$ at $10^6$.[^merge] A thousandfold gain in sensitivity shrinks this
separation 8.6-fold, about as the cube root of the sensitivity. On the same model the Gaussian image's blur shrinks
from $0.36z$ to $0.21z$, only 1.7-fold, as the blur of chapter 3.7 does from 24.0° to 14.1°. **A limit:** both the
decision and the drawing improve as powers of the sensitivity, and as $\SNR$ grows without bound a power always
overtakes a logarithm.

Recovering detail finer than the blur by using what is known about the scene is called **super-resolution**.
Morgenshtern and Candès proved that positive point sources on a fine grid are recovered stably by a positive fit, with
no minimum separation between neighbours as long as not too many crowd together, and with an error that grows as a
power of the ratio of the blur to the grid's spacing [@MorgenshternCandes2016]. We state this without proof; *Go
deeper* gives the exact conditions.

The paper draws the conclusion: the logarithmic law of chapter 3.7 "is the limit for a scene crowded with mass; for an
empty room holding a few objects … positivity is the camera's most powerful prior". The electrostatic camera of the
same mathematics has no such help, because its charges have two signs.

::: try {#positive-image}
Two or three equal masses lie in a row of cells at the depth $z$ below a row of sensors that read the tide through
white noise. Three rows share one scale across: the truth, whose masses you drag, or move with the arrow keys; the
Gaussian image of chapter 3.5; and the positive image, the non-negative least-squares fit to the same readings, which
stays hidden until you ask for it. The sliders set $\SNR$ from $10^2$ to $10^8$ and a zoom about the middle of the
row; one button adds or removes the third mass, another draws new noise.

Before you touch anything, answer the two predictions at the top of the figure, then do what each asks. Afterwards,
put a third mass midway between the two and find the sensitivity at which the positive image first draws all three.
:::

## The zeros of the shear survive the blur

We want the paper's rule for where the shear vanishes above a thin layer of mass, because those places give the size of
the layer without any image. Chapter [1.5b](/tutorial/newton/complex-numbers/#the-shear-of-one-mass-is-a-square)
defined the **shear** of the tide in the camera's plane, $\sym{shear}{\curv s} = (\curv{\tE}_{xx} - \curv{\tE}_{yy}) +
2i\,\curv{\tE}_{xy}$, in $\mathrm{s^{-2}}$, wrote a place on the plane as $\sym{complex-place}{w} = x + iy$, in metres,
and found for a point mass $\matter m$ at the depth $z$ below the place $w'$ (it wrote $Z$)

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

**Step 3: measure from the centre of mass.** We write $w - w' = (w - w_{\rm cm}) - (w' - w_{\rm cm})$ and square. The
cross term holds $\int\matter\sigma\,(w' - w_{\rm cm})\,\dd^2w'$, which is zero by the definition of the centre, so

$$\begin{gathered}\curv s(w) \approx -\frac{3G}{z^5}\Bigl[\matter M(w - w_{\rm cm})^2 +
\sym{complex-quadrupole}{\matter Q_c}\Bigr],\\ \matter Q_c = \int\matter\sigma\,(w' - w_{\rm cm})^2\,\dd^2w'
.\end{gathered}$$

The bracket is a polynomial of degree two in $w$, so it has exactly two roots:

$$\boxed{w = w_{\rm cm} \pm i\sqrt{\matter Q_c/\matter M}} .$$

{{paper eq:shear-zeros}}

The units agree: $\matter Q_c$ is in $\mathrm{kg\,m^2}$, so $\sqrt{\matter Q_c/\matter M}$ is in metres. Neither $z$
nor $G$ appears, so the zeros stand at the layer's true scale at every height: they are not blurred.

**What $\matter Q_c$ is.** Its real and imaginary parts are $\int\matter\sigma\,(x^2 - y^2)$ and
$2\int\matter\sigma\,xy$, measured from the centre, so $\matter Q_c = (\matter Q_{xx} - \matter Q_{yy} + 2i\matter
Q_{xy})/3$ with the quadrupole tensor of chapter
[2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole):
the **complex quadrupole** of the layer, its two quadrupole numbers within the plane. Turning the layer by an angle
$\beta$ multiplies $\matter Q_c$ by $e^{2i\beta}$, so the zeros turn with the layer. For a layer stretched along the
angle $\beta$, $\matter Q_c/\matter M$ is a positive number times $e^{2i\beta}$, so $i\sqrt{\matter Q_c/\matter M}$
points at $\beta + 90°$: the zeros lie across the layer's long axis.

**Two checks.** For two equal masses $\matter m$ at $\pm d/2$, $\matter Q_c = \matter md^2/2$ and $\matter M =
2\matter m$, so the zeros stand at $\pm i\,d/2$, chapter 1.5b's answer (its last problem). There the rule is exact,
because on the bisector the two distances are equal and Step 2 changes nothing. For a single point $\matter Q_c = 0$,
and the two zeros merge into the double zero of $w^2$ directly above it.

**The size of the error.** Take three masses of 1.0, 0.7 and 1.4 units at $0.2 + 0.1i$, $-0.3 + 0.05i$ and $0.05 -
0.25i$, a layer about 0.5 across. The rule puts its zeros at $0.034 + 0.014i$ and $0.005 - 0.153i$
(Figure [](#fig:layer)). The true zeros, found numerically, lie at most 0.018, 0.0017 and 0.00015 from them at the
heights 1, 3 and 10: each threefold rise in height cuts the error about ninefold, as an error of order $(R/z)^2$ should.

![A thin layer of three masses seen from above, each dot's area in proportion to its mass. The rule puts the two zeros
of the shear (open circles) on the dotted line through the centre of mass $w_{\rm cm}$ (cross), across the layer's long
axis (dashed). Turned by 40° about its centre (faint), the layer has its $\matter Q_c$
multiplied by $e^{2i\beta}$, and its zeros turn by the same 40°.](tut-pos-layer){#fig:layer}

**How precisely noise places a zero.** Noise moves each zero by a distance of the order of the paper's estimate
$z^2/2\mathcal Rd$ (the box below sketches why). So the zeros, $d$ apart, are told apart once $d > z/\sqrt{2\mathcal
R}$, about 2.6 cm at 1 m and $\SNR = 10^3$, and a pair 10 cm apart has its zeros placed to about 6.5 mm. This is the
scaling $z/\sqrt{\mathcal R}$ at which the readings decide between one mass and two, "now reached by inspection".

:::: derivation
### How noise moves a zero

Near a zero $w_0$ the shear grows in proportion to the step from it, $\curv s \approx \curv s'(w_0)(w - w_0)$, with
$\curv s' = \dd\curv s/\dd w$. Noise adds a random amount $\delta\curv s$ to the shear and so moves the zero by about
$\delta\curv s/|\curv s'|$. For the pair, the bracket of Step 3 is $\matter M(w^2 + d^2/4)$, whose slope at $w_0 =
id/2$ gives $|\curv s'| = 3G\matter Md/z^5$. The shear changes over a patch about $z$ wide, where the noise averages to
about $\sqrt{N_0}/z$, with $N_0$ the noise density of chapter
[3.3](/tutorial/noise/measuring-a-number/#one-mass-a-metre-away-is-placed-to-a-millimetre). With $\SNR =
2G\matter M/(z^2\sqrt{N_0})$ and $\mathcal R = 0.767\,\SNR$, the zero moves by about

$$\frac{z^4\sqrt{N_0}}{3G\matter Md} = \frac{2z^2}{3\,\SNR\,d} = 0.51\,\frac{z^2}{\mathcal Rd} ,$$

which is of the order of the paper's $z^2/2\mathcal Rd$.

::: gap
The sketch takes the noise on the shear to be one component's noise averaged over a patch $z$ wide, while the shear
combines three components and a best fit would use the whole pattern, so its factor is only an order of magnitude. It
ignores the four extra zeros of a pair shallower than $\tfrac{\sqrt3}{2}d$, and the drift with depth of the zeros of
unequal masses (the stretch problem below).
:::
::::

{{paper fig:buried-ruler}}

::: history
### Critical curves and defects

The quadratic of the two equal masses also places the secondary critical curves of a double gravitational lens: small
loops in the plane of the two lensing masses, on which the magnification of a point source becomes infinite
[@Bozza2000]. The zeros of a shear, as points round which its axes make half a turn, were studied as defects in maps of
weak gravitational lensing [@VitelliJainKamien2009].
:::

## The space below a flat camera is hyperbolic

We want the geometry behind the fixed-angle blur of chapter 3.7. There a pattern at twice the depth looked like the
same pattern twice as wide. So we measure each small step in units of its own depth.

**A line element.** A **line element** is a rule that turns a small step of the coordinates into a squared length. In
flat space it is $\dd x^2 + \dd y^2 + \dd z^2$. Below the camera, with $z > 0$ the depth, we set

$$\sym{line-element}{\dd s^2} = \frac{\dd x^2 + \dd y^2 + \dd z^2}{z^2} .$$

A step of 1 cm across has the length 0.01 at a depth of 1 m, and 0.1 at 10 cm: the same step is ten times longer near
the camera. Lengths are pure numbers. Written as $\dd s^2 = g_{ij}\,\dd x_i\,\dd x_j$, the table
$\sym{metric}{g_{ij}} = \delta_{ij}/z^2$ is the **metric**. (Elsewhere $g$ is a field or a tidal profile.)

**The camera is infinitely far away.** Straight down from depth $z_1$ to depth $z_2$ the length is $\int\dd z/z =
\ln(z_2/z_1)$, which grows without limit as $z_1$ shrinks to zero: the camera's plane is infinitely far from every
point below it. The half of space $z > 0$ with this metric is
**hyperbolic space**, in the model called the **upper half-space** (mathematicians draw it above a plane; ours hangs
below the camera), and the camera's plane is its **boundary at infinity**.

**A change of scale is a rigid move.** An **isometry** is a map that keeps every length. Sliding across, $(x, y) \to
(x + a, y + b)$, is one. So is a change of scale about a point of the camera's plane, $(x, y, z) \to (\lambda x,
\lambda y, \lambda z)$: it multiplies $\dd x$, $\dd y$, $\dd z$ and $z$ by $\lambda$, and leaves $\dd s^2$ unchanged.
Seen from inside this geometry it is a step of length $\ln\lambda$ straight down.

**The Laplacian of this metric.** The Laplacian measured with a metric is called the **Laplace–Beltrami operator**. For
our metric it is

$$\sym{hyperbolic-laplacian}{\nabla^2_H}u = z^2\nabla^2u - z\,\partial_zu ,$$

as the box below derives. The extra term $-z\,\partial_zu$ appears because the metric's factor $1/z^2$ changes with
depth.

**Laplace's equation in this geometry.** We want an equation for the potential that holds nothing but this Laplacian
and a constant, because such an equation is built from the metric alone, and every isometry then carries a solution to
a solution. So we try $z^\alpha\field\Phi$, with $\field\Phi$ the potential in $\mathrm{J\,kg^{-1}}$ and $\alpha$ a
number to be chosen. The product rule (box below) gives

$$\begin{aligned}
\nabla^2_H(z^\alpha\field\Phi) &= z^{\alpha+2}\,\nabla^2\field\Phi + \alpha(\alpha - 2)\,z^\alpha\field\Phi\\
&\quad + (2\alpha - 1)\,z^{\alpha+1}\,\partial_z\field\Phi .
\end{aligned}$$

The first term holds $\nabla^2\field\Phi$, and the second is a multiple of $z^\alpha\field\Phi$ itself. The last is
neither, and it vanishes only for $\alpha = \tfrac12$: that is why the power is one half. Then $\alpha(\alpha - 2) =
-\tfrac34$, so with $\sym{lifted-potential}{\field u} = z^{1/2}\field\Phi$ (here $u$ is not
chapter 3.7's scaled radius)

$$\boxed{\nabla^2_H\field u + \tfrac34\field u = z^{5/2}\,\nabla^2\field\Phi} . \label{eq:lift}$$

Both sides are in $\mathrm{J\,kg^{-1}\,m^{1/2}}$, because $\nabla^2_H$ is $z^2$ times second derivatives. Between the
camera and the scene $\nabla^2\field\Phi = 0$, which is the paper's equation:

{{paper eq:hyperbolic}}

:::: derivation
### From $\nabla^2\Phi$ to $\nabla^2_H u$

**The general formula.** The Laplace–Beltrami operator of a metric $g_{ij}$ is

$$\nabla^2_g u = \frac{1}{\sqrt g}\,\partial_i\bigl(\sqrt g\,g^{ij}\,\partial_ju\bigr),$$

where $g$ is the determinant of $g_{ij}$ and $g^{ij}$ its inverse (we state it without proof). **A check:** the plane
in polar coordinates $a$, $\varphi$ has $\dd s^2 = \dd a^2 + a^2\dd\varphi^2$, so $\sqrt g = a$, $g^{aa} = 1$ and
$g^{\varphi\varphi} = 1/a^2$. For a function of $a$ alone the formula gives $(1/a)(au')' = u'' + u'/a$, the Laplacian
of chapter [3.6](/tutorial/noise/bessel-and-airy/#the-circular-ripple-obeys-bessels-equation).

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
\tfrac32$, are harmonic, and both give zero: the $\tfrac34$ is the number that lets both solve the equation. For a point
mass 1 m deep, finite differences with a step of a thousandth of the depth give a residual of $6\times10^{-7}$ of the
size of $\field u$ at the point $(0.3, 0.2, 0.5)$ m, halfway up and off the axis.

**What it means.** A change of scale is an isometry, so a scene at twice the depth, twice as large, gives the same
pattern at the camera, twice as wide,[^inversion] and at a fixed signal-to-noise ratio the blur is a fixed angle.
Chapter 3.7 found this from the formula of the blur, in which only $kz$ enters. The hyperbolic picture adds that the
change of scale is a rigid move of the whole problem, a step straight down, so every depth is equivalent to every
other. Whatever is true of resolution at one depth is true at every depth, in units of that depth. Cells of one size in
this metric, squares as wide as they are deep, each hold the same number of resolved patterns, which is why that number
is counted per area $z^2$ (chapter
[3.8](/tutorial/noise/bits/#where-a-ripple-stands-well-above-its-noise-it-carries-log_2-s-bits) counts them). Figure
[](/paper/#fig:near-field-geometry) cuts the ground into such cells.

::: derivation
### The precision of a place has the same geometry

Chapter 3.3 found that two scenes a small step $\dd\theta$ apart predict readings $D$ noise standard deviations apart,
with $D^2 = F_{kl}\,\dd\theta_k\,\dd\theta_l$ and $F_{kl}$ the Fisher matrix. Read as a line element on the scenes,
$D^2$ is the **Fisher metric**. For one mass of unknown size at $(x_0, y_0, z)$ beneath an endless flat array, chapter
3.3's matrix, with the mass projected out as in chapter
[3.4](/tutorial/noise/symmetric-matrices/#in-whitened-data-fitting-a-nuisance-is-a-projection), gives

$$D^2 = \mathcal R^2\,\frac{\tfrac52\,\dd x_0^2 + \tfrac52\,\dd y_0^2 + \dd z^2}{z^2} .$$

This is hyperbolic only while $\mathcal R$ is held fixed. A real camera's $\mathcal R$ falls as $1/z^2$, so its error
in metres grows as $z^3$ (chapter 3.3): the geometry gives the shape of the error, not that fall. At fixed $\mathcal
R$, the stretch $x' = \sqrt{5/2}\,x_0$, $y' = \sqrt{5/2}\,y_0$ turns $D^2$ into $\mathcal R^2(\dd x'^2 + \dd y'^2 + \dd
z^2)/z^2$, exactly $\mathcal R^2$ times the line element above. So a mass is placed to the same fraction of its depth at
every depth, with the error across $\sqrt{2/5} = 0.63$ times the error in depth.
:::

{{paper fig:near-field-geometry}}

::: check
### Q

Why can no linear image use the fact that mass is positive?

### A

A linear image is a fixed weighted sum of the readings, so it turns the readings $-\mathbf y$ into minus the image of
$\mathbf y$. A condition that depends on the sign of the answer cannot be built from fixed weights.

### Q

Two equal masses 5 cm apart lie 1 m below the camera, at $\SNR = 10^3$. Is the blur or the zeros of the shear the better
ruler?

### A

The zeros. Each is placed to about $z^2/2\mathcal Rd = 1/(2\times767\times0.05)\unit{m} = 1.3\unit{cm}$, less than
their 5 cm separation, while the blur is 42 cm.

### Q

In the metric $\dd s^2 = (\dd x^2 + \dd y^2 + \dd z^2)/z^2$, how long is a step of 1 cm across at a depth of 1 m, and at
10 cm?

### A

0.01 and 0.1: the same step is ten times longer near the camera.

### Q

Why does the positive image leave the left-hand safe almost empty, while the Gaussian image cannot say which safe holds
the gold?

### A

The Gaussian image may add patterns of positive and negative mass that the data barely see. Forbidding negative mass
removes them, because the true scene is empty round the safes, and the readings can then be fitted only by mass near
the gold.
:::

**The idea to keep: the blur limits what can be drawn of a scene crowded with mass, not how finely a few positive
masses can be told apart. Positivity fixes a few sources from a few moments, so their resolution improves as a power of
the sensitivity; the zeros of the shear give a thin layer's size with no image; and the space below a flat camera is
hyperbolic, which makes every depth alike and the blur an angle.**

::: problems
### Practice

Masses on a line have the moments $\matter\mu = (3, 0, 1.5, -0.75)$, in kilograms times powers of metres. Find the two
places and the two masses, and check that the $2\times2$ Hankel matrix is positive definite.

::: solution
Equation [](#eq:hankel) reads $3c_0 = 1.5$ and $1.5c_1 = -0.75$, so $c_0 = 0.5$ and $c_1 = -0.5$, and $x^2 + 0.5x - 0.5
= 0$ has the roots $0.5$ and $-1$ m. Then $\matter m_1 + \matter m_2 = 3$ and $0.5\matter m_1 - \matter m_2 = 0$ give 2
kg at 0.5 m and 1 kg at $-1$ m. The Hankel matrix is diagonal, with the eigenvalues 3 and 1.5, both positive.
:::

### Stretch

A layer is two unequal masses $\matter m_1$ and $\matter m_2$ at $w_1$ and $w_2$. Compute $w_{\rm cm}$ and $\matter
Q_c$, and show that the rule puts the zeros on the perpendicular bisector of the pair only when $\matter m_1 = \matter
m_2$ (this uses chapter 2.3's centre of mass). For 2 kg and 1 kg at $\pm0.5$ m, how far apart are the zeros?

::: solution
With $\matter M = \matter m_1 + \matter m_2$, $w_{\rm cm} = (\matter m_1w_1 + \matter m_2w_2)/\matter M$, so $w_1 -
w_{\rm cm} = \matter m_2(w_1 - w_2)/\matter M$ and $w_2 - w_{\rm cm} = -\matter m_1(w_1 - w_2)/\matter M$. Then
$\matter Q_c = \matter m_1\matter m_2(w_1 - w_2)^2/\matter M$, and the zeros stand at $w_{\rm cm} \pm
i\sqrt{\matter m_1\matter m_2}\,(w_1 - w_2)/\matter M$, on the line through the centre of mass across the pair. That
line is the bisector only when the centre of mass is the midpoint, so when $\matter m_1 = \matter m_2$. For 2 and 1 kg
the zeros are $2\sqrt2/3 = 0.943$ m apart, not 1 m. The exact shear puts them 0.900 m apart at a height of 2 m and
0.937 m at 5 m: they move with depth.
:::

### The paper

Show that a change of scale about a point of the camera's plane, $\field u_\lambda(x, y, z) = \field u(x/\lambda,
y/\lambda, z/\lambda)$, carries a solution of the paper's equation [](/paper/#eq:hyperbolic) to a solution. Then explain
in two sentences the paper's "which is why the blur is a fixed angle and why the number of patterns resolved is counted
per area $z^2$".

::: solution
Each derivative of $\field u_\lambda$ brings a factor $1/\lambda$, and the factors $z^2$ and $z$ in $\nabla^2_H =
z^2\nabla^2 - z\,\partial_z$ are $\lambda^2$ and $\lambda$ times their values at $z/\lambda$. The factors cancel, so
$(\nabla^2_H + \tfrac34)\field u_\lambda$ is $(\nabla^2_H + \tfrac34)\field u$ taken at $(x, y, z)/\lambda$, which is
zero. So a scene $\lambda$ times deeper and larger makes the same pattern at the camera, $\lambda$ times wider, and at a
fixed signal-to-noise ratio the finest detail is a fixed fraction of the depth, an angle. The same holds for every
pattern, so the number resolved under an area of the camera depends only on that area divided by $z^2$.
:::
:::

::: paper
- [*A worked case*](/paper/#par:a-worked-case) (Section IV) and [*The worked
  inversion*](/paper/#par:the-worked-inversion) (Appendix A) give the $\pm730$, 490 and 350 kg of the Gaussian image
  and describe the non-negative least-squares image.
- [*The positivity of mass*](/paper/#par:the-positivity-of-mass) (Section IV) gives the positive image's weights of
  the safe at $\SNR = 10^3$ and $10^4$, places them in the mathematics of super-resolution, and contrasts the
  electrostatic camera, which lacks positivity.
- [*The zeros of the shear*](/paper/#par:the-zeros-of-the-shear) (Section IV) states equation
  [](/paper/#eq:shear-zeros), the precision $z^2/2\mathcal Rd$ and Figure [](/paper/#fig:buried-ruler).
- [*The geometry of the near field*](/paper/#par:the-geometry-of-the-near-field) (Section IV) states equation
  [](/paper/#eq:hyperbolic) and Figure [](/paper/#fig:near-field-geometry), and gives the precision metrics for
  sensors on a sphere round a mass, which near the sensors are those of hyperbolic space in Poincaré's ball.
- [*What heat reveals*](/paper/#par:what-heat-reveals) (Section IV) reads a round body's density at every radius from
  its moments (chapter [R4](/tutorial/response/reading-section-iv-3/#a-warm-bodys-moments-change-at-a-rate-set-by-its-temperature-and-its-density-alone)). When only a few moments are known, positivity is what makes them enough.
- [Section XIV](/paper/#sec:hole) shows that a black hole's tidal response belongs to no positive mass, from the
  inequality $\int\matter\rho\,r^2(r^2 - a)^2\,\dd V \ge 0$, a Hankel condition of this chapter's kind.
:::

::: deeper
- The GR course on [the metric as a local measuring
  operation](https://neovand.github.io/general-relativity/chapter-4.html#4-4-the-metric-is-a-local-measuring-operation)
  and its lesson [a metric converts labels into
  lengths](https://neovand.github.io/general-relativity/chapter-4.html#a-metric-converts-labels-into-lengths): a line
  element as a rule for turning coordinate steps into lengths. Its section on [conformal
  time](https://neovand.github.io/general-relativity/chapter-19.html#19-7-conformal-time-changing-the-graph-paper-to-straighten-light-rays)
  treats a metric that is flat space rescaled at each point, as this chapter's is.
- C. L. Lawson and R. J. Hanson, *Solving Least Squares Problems* (SIAM, 1995), chapter 23: the algorithm for
  non-negative least squares that the paper's reference code uses.
- V. I. Morgenshtern and E. J. Candès [@MorgenshternCandes2016]: positive sources on a grid. No minimum separation is
  needed, only that at most $r$ sources lie in any window about $1.9r$ times the finest kept wavelength (the shortest
  wavelength still measured above the noise). The error grows as the **super-resolution factor**, the blur divided by
  the grid's spacing, to the power $2r$.
- D. L. Donoho [@Donoho1992]: sources of either sign on a grid, with at most $\ell$ of them in any window about one blur
  wide; the error grows as the super-resolution factor to the power $2\ell + 1$.
- E. J. Candès and C. Fernandez-Granda [@CandesFernandezGranda2014]: point sources of any sign, even complex, are
  recovered exactly when they are at least twice the finest kept wavelength apart (1.87 times for real amplitudes).
  Under a flat camera at 1 m and $\SNR = 10^3$ that wavelength is $2\pi z/q_c = 0.60$ m, so the separation needed is
  1.2 m, about three blur widths: the theorem does not reach masses a few centimetres apart.
- J. W. Cannon, W. J. Floyd, R. Kenyon and W. R. Parry, "Hyperbolic geometry", in *Flavors of Geometry* (MSRI, 1997):
  the upper half-space and the Poincaré ball, at this level.
:::

[^hidden]: Of all the scenes that add 500 kg to the right-hand safe, this is the one the Gaussian image finds least
    improbable. It is $P^{-1}\mathbf w$, scaled, where $P = A^{\mathsf T}A + \sigma_m^{-2}I$ is chapter 3.5's matrix,
    $\sigma_m = 324$ kg that chapter's prior spread for one cell, and $\mathbf w$ a list with one in each cell of the
    safe and zero elsewhere.

[^draws]: Over 100 000 draws of the noise the right-hand safe holds $315.4 \pm 19.7$ kg at $\SNR = 10^3$ and $327.55
    \pm 0.69$ kg at $10^4$ (the mean and the standard deviation). At $10^3$ the draws are skewed: nine in ten lie
    between 279 and 332 kg, most of them close below the truth and a few far lower, so the median, 323.8 kg, lies above
    the mean. The reference code computes these numbers (`reference/gravcam/inversion.py`, `positive_case`).

[^grid]: The bar's centre lies between the columns of grid points 1.0 and 1.25 m across. A point mass of 324.24 kg at
    that centre already gives 326.4 kg in the safe, while the same point mass placed on a grid point gives 324.24 kg
    exactly. Most of the rest comes from the bar's 40 cm of depth, drawn as points in the plane of the cells.

[^merge]: The model is the one of this chapter's interactive figure
    (`app/src/lib/tutorial/live/positive-image.ts`): cells a sixth of the separation wide, the signal-to-noise ratio of
    one mass defined as in chapter 3.7, and 400 draws of the noise. Two masses count as drawn apart when each has its
    own run of filled cells, holding at least a quarter of a mass and centred within $d/4$ of it. Other reasonable
    criteria give a shrinking of 7.9- to 8.6-fold.

[^inversion]: The other isometries of hyperbolic space include inversion in a sphere centred on the camera's plane, and
    it too carries solutions of [](#eq:lift) to solutions. It does not keep the noise uniform across the camera,
    however, so it is not a symmetry of the noisy camera, and the paper uses only the change of scale.
