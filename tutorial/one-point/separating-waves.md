---
id: '9.5'
title: 'Separating waves at one point'
question: 'Section VIII says that when several waves cross a pixel at once, "one pixel can still separate them: two waves from a single reading, three waves at one frequency, and up to four waves from a record over time. A sensor of light can separate at most two." How can one point separate waves that cross it together, and why four for gravity and two for light?'
part: '9'
requires: ['3.1', '3.3', '9.1', '9.2', '9.4']
paper: [sec:one-pixel, eq:pencil, eq:four-waves, eq:wave-count, fig:voices, eq:stars, app:proofs, eq:proof-prony]
figures: [fig:voices]
live: [voices]
depth: A
---

The paper's Figure [](/paper/#fig:voices) sends four gravitational waves across one pixel at once, each from its own
direction and with its own waveform. The pixel records only its ten numbers as they change. From that record alone the
figure finds four points on the sky, and they fall on the four sources. A sensor of light,
given the same kind of record, finds two.

{{paper fig:voices}}

Section VIII's paragraph [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point) says that one
pixel "can still separate them". How can one point separate waves that cross it together, and why four for gravity and
two for light? The answer is one counting rule. It builds on chapters [3.1](/tutorial/noise/probability/),
[3.3](/tutorial/noise/measuring-a-number/), [9.1](/tutorial/one-point/spin-two/),
[9.2](/tutorial/one-point/complex-symmetric/) and [chapter 9.4](/tutorial/one-point/petrov/).

::: plain
A single gravitational wave makes the pixel's reading a square: one complex arrow multiplied by itself. Several waves
add their squares, and separating them means finding the arrows again.

One reading separates two waves, because the sum of two squares sends one direction to zero, and that direction leads
to both. One frequency separates three, by comparing the record's two parts, one for each sense of turning. A long
record separates four, because their readings leave one combination of the five complex numbers empty, and that
combination points to all four sources. Five waves fill everything.

All three cases are one old problem, finding unknown numbers from the sums of their first few powers, and counting
unknowns against recorded numbers gives the rule. Light, whose wave is the arrow and not its square, separates at most
two.
:::

## Two waves give a reading of rank two, and the vector it sends to zero leads to both

We want to find two waves from one reading. Each wave is four real numbers, a direction and a complex amplitude
(chapter 9.1), so two waves are eight real unknowns against the reading's ten real numbers. We assume that **two plane
waves cross the pixel from two different directions, and nothing else contributes**. By chapter
[9.1](/tutorial/one-point/spin-two/#a-plane-wave-fills-only-the-extreme-weight-so-its-reading-is-a-square), each wave's
reading is a square, and readings add, so

$$\curv{\mathcal W} = \curv\alpha_1\vect m_1\vect m_1^{\mathsf T} + \curv\alpha_2\vect m_2\vect m_2^{\mathsf T} .$$

Here $\vect m_a$, for $a = 1, 2$, is a null vector of the direction of wave $a$, a complex vector with $\vect
m_a\cdot\vect m_a = 0$ (chapter 9.1), and $\sym{wave-amplitudes}{\curv\alpha_a}$ is its complex amplitude in
$\mathrm{s^{-2}}$, which absorbs the length and phase of $\vect m_a$.[^c]

**The rank is two.** Every column of $\curv{\mathcal W}$ is a combination of $\vect m_1$ and $\vect m_2$, so the table
has rank two (chapter [9.2](/tutorial/one-point/complex-symmetric/#singular-values-are-not-the-sizes-of-the-eigenvalues))
and $\det\curv{\mathcal W} = 0$. That is one complex condition, two real ones: the two numbers left over in the count.
The pull of one mass $\matter M$ at the distance $r$ has $\det\curv{\mathcal W} = -2(G\matter M/r^3)^3$ (chapter 9.2),
which is never zero, so $\det\curv{\mathcal W}$ tells two waves from a mass.

**The vector it sends to zero.** Take $\mathbf v = \vect m_1\times\vect m_2$. Then

$$\curv{\mathcal W}\mathbf v = \curv\alpha_1\vect m_1\,\bigl(\vect m_1\cdot\mathbf v\bigr) + \curv\alpha_2\vect
m_2\,\bigl(\vect m_2\cdot\mathbf v\bigr) = 0 ,$$

because a triple product with a repeated vector vanishes. The pixel finds $\mathbf v$, up to a factor, as the singular
vector of $\curv{\mathcal W}$ whose singular value is zero.[^v]

**The quadratic.** We now write each $\vect m_a$ as chapter 9.4's $\vect m(z_a) = (1 - z_a^2,\ i(1 + z_a^2),\ -2z_a)$,
with $z_a$ the stereographic coordinate of its direction: one complex number with no unit, for the direction's two real
numbers. Multiplying out the cross product (the box below) gives

$$\boxed{\;\begin{aligned}&\vect m(z)\cdot\bigl(\vect m(z_1)\times\vect m(z_2)\bigr)\\
&\quad = 4i\,(z_2 - z_1)(z - z_1)(z - z_2) .\end{aligned}\;} \label{eq:triple}$$

So the condition $\vect m(z)\cdot\mathbf v = 0$, which for $\mathbf v = (v_x, v_y, v_z)$ reads

$$(v_x + iv_y) - 2v_z\,z + (iv_y - v_x)\,z^2 = 0 ,$$

is a quadratic in $z$, and its two roots are $z_1$ and $z_2$, the two directions. The amplitudes follow from 9.4's
quartic $Q(z) = \vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z)$, which for this reading is $4\curv\alpha_1(z -
z_1)^4 + 4\curv\alpha_2(z - z_2)^4$: at $z = z_2$ the second term drops out, and
$\curv\alpha_1 = Q(z_2)/[4(z_2 - z_1)^4]$.

::: derivation
### The cross product of two null vectors

We write $\vect m(z) = \mathbf u_0 + z\,\mathbf u_1 + z^2\mathbf u_2$ with the constant vectors $\mathbf u_0 = (1, i,
0)$, $\mathbf u_1 = (0, 0, -2)$ and $\mathbf u_2 = (-1, i, 0)$ (local letters). Their cross products are $\mathbf
u_0\times\mathbf u_1 = (-2i, 2, 0)$, $\mathbf u_0\times\mathbf u_2 = (0, 0, 2i)$ and $\mathbf u_1\times\mathbf u_2 =
(2i, 2, 0)$. In $\vect m(z_1)\times\vect m(z_2)$ the terms $z_1^jz_2^k\,\mathbf u_j\times\mathbf u_k$ pair off with
$z_1^kz_2^j\, \mathbf u_k\times\mathbf u_j$, so

$$\begin{aligned}
\vect m(z_1)\times\vect m(z_2) &= (z_2 - z_1)\bigl[\mathbf u_0\times\mathbf u_1\\
&\quad + (z_1 + z_2)\,\mathbf u_0\times\mathbf u_2\\
&\quad + z_1z_2\,\mathbf u_1\times\mathbf u_2\bigr]\\
&= 2(z_2 - z_1)\bigl(i(z_1z_2 - 1),\\
&\qquad 1 + z_1z_2,\ i(z_1 + z_2)\bigr) .
\end{aligned}$$

The product of $\vect m(z)$ with the last vector is $i[(z_1z_2 - 1)(1 - z^2) + (1 + z_1z_2)(1 + z^2) - 2z(z_1 +
z_2)]$, which is $2i(z - z_1)(z - z_2)$. Multiplying by $2(z_2 - z_1)$ gives [](#eq:triple).
:::

**A number.** Two waves of unit amplitude travel along $\hat z$ and $\hat x$, with 9.1's unit null vectors $\vect m_z =
(1, i, 0)/\sqrt2$ and $\vect m_x = (0, 1, i)/\sqrt2$. Their reading $\curv{\mathcal W} = \vect m_z\vect m_z^{\mathsf
T} + \vect m_x\vect m_x^{\mathsf T}$ has the rows $\tfrac12(1, i, 0)$, $\tfrac12(i, 0, i)$ and $\tfrac12(0, i, -1)$,
and it sends $\mathbf v = (1, i, -1)$ to zero. The quadratic is $2z - 2z^2 = 0$, with the roots $z = 0$ and $z = 1$,
which are the directions $+\hat z$ and $+\hat x$ (chapter 9.4). Since $\vect m(0) = \sqrt2\,\vect m_z$, the first wave
is $\tfrac12\vect m(0)\vect m(0)^{\mathsf T}$, and indeed $Q(1) = 2$ gives $\curv\alpha_1 = 2/[4(1 - 0)^4] = \tfrac12$.

**A limit.** If the two directions coincide, $z_1 = z_2$, then [](#eq:triple) vanishes, $\mathbf v = 0$, and the
reading is a single square of rank one: one wave, which no reading can split in two.

**The converse holds generically.** Sylvester proved in 1851 that a quartic is, generically, a sum of two fourth
powers when one combination of its coefficients vanishes [@Sylvester1851], and for $Q$ that combination is a multiple
of $\det\curv{\mathcal W}$. A reading whose quartic has a triple root, such as $Q = z^3(z - 1)$, also has
$\det\curv{\mathcal W} = 0$, but its quadratic has a double root.[^triple-root] So a reading
is two waves when $\det\curv{\mathcal W} = 0$ and its quadratic has two different roots.

Light cannot do it at all: one wave of light, a complex multiple of one null vector, uses four of its six real
numbers (9.1).

## Three waves of one frequency are three roots of one pencil

We want to separate three waves, which one reading cannot do: three waves hold six complex unknowns, three directions
and three amplitudes, against a reading's five complex numbers.
We assume that **three plane waves of one angular frequency $\omega$ cross the pixel from three different directions**,
and that the record is long enough to split the reading into its two parts at that frequency. The paper writes

$$\curv{\mathcal W}(t) = \curv{\mathcal W}_+e^{-i\omega t} + \curv{\mathcal W}_-e^{i\omega t} ,$$

and since $\curv{\mathcal W}$ is complex, $\curv{\mathcal W}_-$ is not the conjugate of $\curv{\mathcal W}_+$. By
chapter [9.1](/tutorial/one-point/spin-two/#on-the-sky-a-quantity-of-spin-weight-s-begins-at-degree-s), one wave puts
the same square into both parts, with its two helicity amplitudes, so the three waves give

$$\curv{\mathcal W}_\pm = \sum_{a=1}^3\curv\alpha^\pm_a\,\vect m_a\vect m_a^{\mathsf T} .$$

Chapter [9.2](/tutorial/one-point/complex-symmetric/#a-pencil-of-two-tables-has-generalized-eigenvalues) proved the
identity for two tables built from the same three squares, which with $\curv{\mathcal W}_+$ and $\curv{\mathcal W}_-$
is the paper's equation:

{{paper eq:pencil}}

The left side is a cubic in $\lambda$. It has three roots only if the determinant of the three null vectors on the
right is not zero, and by [](#eq:triple) with $z = z_3$,[^infinity]
$\det[\vect m(z_1), \vect m(z_2), \vect m(z_3)] = 4i(z_2 - z_1)(z_3 - z_1)(z_3 - z_2)$, which vanishes only when two
directions coincide. So the cubic has the three roots $\sym{pencil-roots}{\lambda_a} = \curv\alpha^+_a/
\curv\alpha^-_a$, complex numbers with no unit.[^lambda]

**The directions.** At the root $\lambda_1$ the first square drops out, so $\curv{\mathcal W}_+ -
\lambda_1\curv{\mathcal W}_-$ is a sum of two squares, and by the first section it sends $\mathbf v_1 = \vect
m_2\times\vect m_3$ to zero. The roots $\lambda_2$ and $\lambda_3$ give $\mathbf v_2 = \vect m_3\times\vect m_1$ and
$\mathbf v_3 = \vect m_1\times\vect m_2$ in the same way, and a vector identity (the box below) gives

$$\mathbf v_2\times\mathbf v_3 = \vect m_1\,\det[\vect m_3, \vect m_1, \vect m_2] .$$

So the cross product of the vectors found at $\lambda_2$ and $\lambda_3$ is wave 1's $\vect m$, up to a factor, and
9.1's $\hat k = \mathrm{Re}(i\,\vect m\times\vect m^*)/|\vect m|^2$ gives its direction. The other two follow in the
same way.

::: derivation
### Why the cross product lies along the third wave

The identity $(\mathbf a\times\mathbf b)\times(\mathbf c\times\mathbf d) = \mathbf c\,[(\mathbf a\times\mathbf b)\cdot
\mathbf d] - \mathbf d\,[(\mathbf a\times\mathbf b)\cdot\mathbf c]$ (local letters), with $\mathbf a = \vect m_3$,
$\mathbf b = \mathbf c = \vect m_1$ and $\mathbf d = \vect m_2$, gives

$$\begin{aligned}\mathbf v_2\times\mathbf v_3 &= \vect m_1\,[(\vect m_3\times\vect m_1)\cdot\vect m_2]\\
&\quad - \vect m_2\,[(\vect m_3\times\vect m_1)\cdot\vect m_1] .\end{aligned}$$

The second bracket is a triple product with a repeated vector, so it vanishes.
:::

**The roots must differ.** If two waves have the same ratio, both drop out at once, and what remains is one square,
which sends a whole plane of vectors to zero instead of one. Two binaries seen face-on and turning the same way have
$\curv\alpha^- = 0$, so they share the root at infinity.

**The binary's ratio.** Chapter 9.1's
[rotor formula](/tutorial/one-point/spin-two/#on-the-sky-a-quantity-of-spin-weight-s-begins-at-degree-s) gives a
circular binary seen at the inclination $\iota$, the angle between its axis and the line of sight,

$$\boxed{\;|\lambda| = \left|\frac{\curv\alpha^+}{\curv\alpha^-}\right| = \cot^4\frac\iota2 ,\;}$$

which is the paper's $\tan^{\pm4}(\iota/2)$ with the lower sign. **Numbers:** $|\lambda| = 194$ at $\iota = 30°$, 9.00
at 60° and 0.496 at 100°, where the clockwise helicity is the stronger. **A limit:** edge-on, $\iota = 90°$, the two
helicities are equal and $|\lambda| = 1$. An interferometer records a single number at each moment, so three binaries in
one frequency bin, a band too narrow for its record to split, add into one sinusoid. To one pixel they are "three
separate directions".

## Four waves over time leave one combination of the readings empty

We want to separate four waves of any waveforms, because real sources do not share one frequency. We assume that
**four plane waves arrive from fixed directions**, and that **their waveforms are linearly independent** over the
record, so that no one of them is a fixed combination of the others. Each reading is then

$$\curv{\mathcal W}(t) = \sum_{a=1}^4\curv\alpha_a(t)\,\vect m_a\vect m_a^{\mathsf T} ,$$

a combination of the same four tables at every time $t$. A reading is five complex numbers, so the readings fill only a
four-dimensional part of the five-dimensional space of readings. Chapter
[0.4](/tutorial/evening/one-pixel/#one-pixel-separates-several-waves-and-tells-a-wave-from-a-nearby-pull) counted the
same in real numbers: eight of the ten, with two left over.

**The empty combination.** One linear combination of the five numbers is then zero for every reading. We write it as
$\mathrm{tr}(\sym{four-wave-table}{A}\,\curv{\mathcal W}) = A_{ij}\curv{\mathcal W}_{ij} = 0$, with $A$ a symmetric
table of numbers with no unit.[^A] To find it, we stack the $\sym{snapshots}{L}$ readings as rows of
their five numbers in chapter 1.5's basis. The combination is the singular vector of that table whose singular value is
zero (9.2), or with noise the smallest.

**Two conics.** Because the waveforms are independent, each square $\vect m_a\vect m_a^{\mathsf T}$ is itself a
combination of readings, so $\mathrm{tr}(A\,\vect m_a\vect m_a^{\mathsf T}) = \vect m_a^{\mathsf T}A\,\vect m_a = 0$.
Each wave's null vector therefore solves two equations, the paper's

{{paper eq:four-waves}}

Each is a quadratic equation in the components of $\vect m$, whose solutions, counted up to a factor, form a curve
called a **conic**. Two conics meet in four points, by Bézout's theorem, which we state without proof. With $\vect m =
\vect m(z)$ the second equation holds for every $z$, and the first becomes the quartic $\vect m(z)^{\mathsf T}A\,\vect
m(z) = 0$, whose four roots are the four directions. They are the four principal null directions of the table $A$
(chapter 9.4).

**A number.** Take the paper's case: four waves from random directions with independent random complex waveforms,
300 readings, and complex Gaussian noise on every component of $10^{-4}$ of the signal's typical size, the root mean
square of the noise-free components. Over 1,200 such records the median angle between a found direction and the true
one is about $2\times10^{-5}$ rad, and about four records in five have all four directions within $10^{-4}$ rad. The
worst reach about $2\times10^{-3}$ rad, where two sources are a few degrees apart. That is the paper's "located to
$10^{-4}$ radian from three hundred readings", for a typical record.[^typical]

## All three cases are Prony's problem, and counting gives the limit

We want one rule for the three cases, and the largest number of waves a point sensor can separate. Chapter 9.4 found
the quartic of a sum of squares, $\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) = 4\sum_a\curv\alpha_a(z - z_a)^4$,
with $\vect m_a = \vect m(z_a)$. We expand each fourth power by the binomial theorem, $(z - z_a)^4 =
\sum_{k=0}^4\binom4kz^k(-z_a)^{4-k}$, and collect the powers of $z$:

$$\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) = 4\sum_{k=0}^4(-1)^k\binom4k\,y_{4-k}\,z^k ,$$

with the five **moments**

$$\boxed{\;\sym{moments-y}{y_j} = \sum_a\curv\alpha_a\,z_a^j ,\qquad j = 0, \dots, 4 ,\;}$$

in $\mathrm{s^{-2}}$. The coefficients of the quartic are linear in the entries of $\curv{\mathcal W}$, so the five
numbers of a reading are the five moments, up to a fixed linear map.[^map] Finding the points $z_a$ and the weights
$\curv\alpha_a$ of a sum of powers from its first moments is **Prony's problem**
[@KunisPeterRomerOhe2016].[^moment-problem]

**Snapshots.** A **snapshot** is one set of five moments: one reading, or one of the two parts $\curv{\mathcal W}_\pm$
at one frequency. The directions $z_a$ are the same in every snapshot, and only the amplitudes are new in each, so a
further snapshot adds five numbers but only $N$ new unknowns for $N$ waves. From here on $L$ counts the snapshots whose
amplitudes are independent of one another.

**The key step.** Let $\sym{prony-polynomial}{p(z)} = \prod_a(z - z_a) = \sum_{k=0}^Np_kz^k$, with $p_N = 1$. Its roots
are the $N$ directions, so its coefficients are shared by all snapshots.[^p] For a whole number $j$ we form the sum
$\sum_{k=0}^Np_ky_{j+k}$, put in $y_{j+k} = \sum_a\curv\alpha_az_a^{j+k}$, and do the sum over $k$ first. Every term
then holds $p(z_a)$, which is zero. This is Appendix C's equation:

{{paper eq:proof-prony}}

For a field of spin $s$, a reading holds $2s + 1$ complex numbers (9.1), the moments $y_0$ to $y_{2s}$.[^spin-s] The
index $j$ runs from 0 to $2s - N$, so that $j + N$ stays within $2s$, and each snapshot gives $2s - N + 1$ linear
equations for the $N$ unknowns $p_0, \dots, p_{N-1}$. The $L$ snapshots share $p$, so together they give $L(2s - N +
1)$ equations, enough when $L(2s - N + 1) \ge N$, that is $N(L + 1) \le L(2s + 1)$. The largest such $N$ is

$$\boxed{\;\sym{wave-count}{N_{\max}} = \left\lfloor\frac{L(2s + 1)}{L + 1}\right\rfloor ,\;}$$

where $\lfloor x\rfloor$ is the largest whole number not above $x$. This is the paper's equation:

{{paper eq:wave-count}}

**No method does better.** $N$ waves have $N$ directions and $LN$ amplitudes, $N(L + 1)$ complex unknowns, against the
$L(2s + 1)$ complex numbers recorded: the same inequality. The count holds "generically", because snapshots whose
amplitudes are all proportional add no new equations.[^generic]

| | one instant, $L = 1$ | one frequency, $L = 2$ | long record, $L \to \infty$ |
|---|---|---|---|
| light, $s = 1$ | 1 | 2 | 2 |
| gravity, $s = 2$ | 2 | 3 | 4 |
| spin four (hypothetical), $s = 4$ | 4 | 6 | 8 |

Over a long record $N_{\max} = 2s$, because $L(2s + 1)/(L + 1)$ stays below $2s + 1$ and reaches $2s$ once $L \ge
2s$: for gravity, four independent snapshots are enough in principle.

**Two waves are a special case.** At one instant, $N = 2$ and $j = 0, 1, 2$: three equations for $p_0$
and $p_1$, which need the $3\times3$ table of the $y_{j+k}$ to be singular. That table is a Hankel matrix (chapter 3.9),
whose entries depend only on $j + k$. Its determinant is exactly $-\det\curv{\mathcal W}/16$, so this is the
first section's $\det\curv{\mathcal W} = 0$.[^hankel]

**Five waves.** The five quartics $(z - z_a)^4$ of five different directions are independent, since the table of their
coefficients has the determinant $96\prod_{a<b}(z_a - z_b)$, and the map from a reading to its quartic is one-to-one,
since 9.4's factors 2, $4\sqrt2$, 12, $-4\sqrt2$ and 2 are nonzero. So every reading is a sum of five squares for any
five directions we choose, and five waves can look like any other five: a pixel cannot find them.

<!-- diagram: tut-wave-count — About 560 × 300 px at 1440 (full width on a phone). Three small panels side by side,
"one instant (L = 1)", "one frequency (L = 2)", "long record (L large)". In each, a horizontal axis "number of waves N"
from 1 to 6 with ticks, one rising step line of dots, "unknowns N(L + 1)" in ink, and a flat horizontal line "recorded
L(2s + 1)" drawn twice, solid in the curvature colour for gravity (s = 2: 5, 10, 5L) and dashed in the light colour for
light (s = 1: 3, 6, 3L). The largest N with unknowns at or below the recorded line is ringed on each: gravity 2, 3, 4;
light 1, 2, 2. For the long record, plot unknowns and recorded per snapshot, N(L + 1)/L and 2s + 1, with L = 20. No
orange or blue. Caption: "Look first at the rings: the largest number of waves whose unknowns, a direction and L
amplitudes each, still fit within the numbers recorded. Gravity's rings sit at 2, 3 and 4, light's at 1, 2 and 2. Counts
exact." -->

::: try {#voices}
Predict first: the pixel finds four waves from its record. What will it find when a fifth is added? Then raise the
number of waves to five and read what the figure reports under each sky. With four waves, drag one source close to
another and watch the zeros of $\vect m^{\mathsf T}A\,\vect m$ crowd together.
:::

## Uncorrelated sources separate from their average brightness and circular polarization

This section is a sketch, at depth B. The count above stops at four because every amplitude in every snapshot is an
unknown. Averages over many stretches of record are different data: they keep only each source's mean brightness and
circular polarization. They can separate up to five sources, because each source needs its own independent column of
five numbers.

We assume that **the sources are independent**, so that averaged products between different sources
vanish, and that **their circular fractions differ**. In each stretch we write the parts $\curv{\mathcal W}_\pm$ at one
frequency as columns $\mathbf w_\pm$ of five numbers in 1.5's orthonormal basis, and each unit square as a column
$\sym{steering-vector}{\mathbf q_a}$, the **steering vector** of source $a$. The averages $C_\pm$ of $\mathbf
w_\pm\mathbf w_\pm^\dagger$ over the stretches, with $\dagger$ the conjugate transpose, lose their cross terms, and

$$\begin{aligned}C_I &= C_+ + C_- = \sum_aI_a\,\mathbf q_a\mathbf q_a^\dagger ,\\
C_V &= C_+ - C_- = \sum_aV_a\,\mathbf q_a\mathbf q_a^\dagger .\end{aligned}$$

The brightness $I_a$ and the circular polarization $V_a$, the means of $|\curv\alpha^+_a|^2 \pm |\curv\alpha^-_a|^2$ for
unit squares, in $\mathrm{s^{-4}}$, are proportional to chapter
[5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes)'s
Stokes $I$ and $V$ of one source, with the same ratio $V_a/I_a$, its circular fraction.[^IV] Whitening $C_I$ to the
identity (chapter
[3.4](/tutorial/noise/symmetric-matrices/#whitening-turns-shared-noise-into-independent-noise-of-unit-size)) and
diagonalizing what $C_V$ becomes gives the five fractions, the roots $\mu$ of $\det(C_V - \mu\,C_I) = 0$.[^closed] Each
eigenvector $\mathbf x_a$, scaled so that $\mathbf x_a^\dagger C_I\mathbf x_a = 1$, gives $C_I\mathbf x_a$, a multiple
of $\mathbf q_a$ whose direction follows by 9.1's rule and whose squared length is $I_a$. **A number:** five sources
from random directions, with brightnesses from 0.5 to 1.3 and fractions 0.8, 0.4, 0, −0.3 and −0.7, averaged over $10^4$
noise-free stretches, come back with the fractions to about 0.01 and the directions to about 0.03 rad.

::: gap
This sketch skips why $C_I\mathbf x_a$ is a multiple of $\mathbf q_a$ (each $\mathbf x_a$ has $\mathbf
q_b^\dagger\mathbf x_a = 0$ for every other source $b$), how fast the averages converge, which sets the errors, and
equal circular fractions, whose sources mix. Unpolarized sources, all of fraction zero, cannot be separated this way.
:::

## Lensed images fall in separate cells of time and frequency

We want to know whether one pixel can resolve a lensed source, which a galaxy splits into "two or four images about
an arcsecond apart" whose "arrival times differ by hours to months". This is an estimate. At any moment each image is
at a different stage of the same chirp, the wave whose frequency rises as the binary spirals in, and so at a different
frequency.

A stretch of record of duration $\Delta t$ resolves frequencies about $1/\Delta t$ apart, and a patch of the record
$\Delta t$ long and $1/\Delta t$ wide in frequency is a **time–frequency cell**. A pair of neutron stars at 100 Hz rises
in frequency at the rate $\dot f = 17\unit{Hz\,s^{-1}}$,[^chirp] and it crosses one cell's width in one cell's time when
$\dot f\,\Delta t = 1/\Delta t$, so the cells are $\Delta t = 1/\sqrt{\dot f} = 0.24\unit{s}$ long and $4.1\unit{Hz}$
wide. Two images half a second apart differ by $7.4\unit{Hz}$, 1.8 cells: the paper's "the cells stay separate even for
images only half a second out of step". In each cell the pixel reads one wave.

One wave is placed to within $1/\rho$ radian at the signal-to-noise ratio $\rho$ of its cell, a number with no unit
(stated here, derived in chapter 9.7).[^rho] An arcsecond is $4.85\times10^{-6}$ rad, so it needs

$$\rho = \frac{1}{4.85\times10^{-6}} = 2.1\times10^5 ,$$

thousands of times the ratios of 10 to 100 of the events detected so far. An aperture would need, at 100 Hz, a width of
one wavelength over an arcsecond, $3.0\times10^6\unit{m}/4.85\times10^{-6} = 6.2\times10^{11}\unit{m}$, 4.1 times the
distance from the Earth to the Sun (chapter
[5.3](/tutorial/waves/diffraction/#an-array-resolves-as-many-directions-as-its-area-holds-square-wavelengths)). So one
pixel separates the images of a lensed chirp, but it places them an arcsecond apart only at $\rho \approx 2\times10^5$.
Images that overlap in frequency, as a steady source's do, are a Prony problem whose errors grow as a power of one over
their separation (stated without proof).

<!-- diagram: tut-lens-cells — About 560 × 260 px at 1440 (full width on a phone). A time–frequency plane: horizontal
axis "time (s)" from −2 to 0.5, vertical axis "frequency (Hz)" from 60 to 200, with a faint grid of rectangular cells
0.24 s wide and 4.1 Hz tall (draw only a band of them near the curves). Two chirp curves of a neutron-star pair
(chirp mass 1.2 solar masses, f rising as (t_c − t)^(−3/8), the first at 100 Hz at t = 0), the second shifted 0.5 s
later, both thin lines in the curvature colour, the second at lower opacity. At t = 0 mark the two frequencies with
small dots and a bracket labelled "7.4 Hz: 1.8 cells". No orange or blue. Caption: "Look first at the bracket: two
images of one chirp, half a second out of step, sit in different cells, so one pixel reads each as a single wave. Chirps
exact for a neutron-star pair; the grid's cell size is the 4.1 Hz by 0.24 s of the text." -->

::: check
### Q

How many waves can one pixel separate at one instant, at one frequency and over a long record, and why does light do
worse?

### A

Two, three and four. Light's wave is a vector of three complex numbers rather than a square of five, so $s = 1$ in
$\lfloor L(2s + 1)/(L + 1)\rfloor$, which gives one, two and two.

### Q

A circular binary in a set of three at one frequency gives the root $|\lambda| = 9$. At what inclination is it seen?

### A

$\cot^4(\iota/2) = 9$ gives $\cot(\iota/2) = \sqrt3$, so $\iota/2 = 30°$ and $\iota = 60°$.

:::

**The idea to keep: each wave's reading is a square, so the readings of several waves are sums of fourth powers, and
separating them is Prony's problem. Counting unknowns against recorded numbers gives $\lfloor L(2s + 1)/(L +
1)\rfloor$ waves for a point sensor of spin $s$: two, three and four for gravity, and one, two and two for light.**

::: problems
### Practice

Two waves of unit amplitude travel along $\hat z$ and $\hat y$, with $\vect m_z = (1, i, 0)/\sqrt2$ and $\vect m_y = (i,
0, 1)/\sqrt2$. Write $\curv{\mathcal W}$, find the vector it sends to zero, and recover both directions from the
quadratic.

::: solution
$\curv{\mathcal W} = \vect m_z\vect m_z^{\mathsf T} + \vect m_y\vect m_y^{\mathsf T}$ has the rows $\tfrac12(0, i, i)$,
$\tfrac12(i, -1, 0)$ and $\tfrac12(i, 0, 1)$, with trace zero. It sends $\mathbf v = (1, i, 0)\times(i, 0, 1) = (i, -1,
1)$ to zero, as each row shows. The quadratic is $(i - i) - 2z + (-i - i)z^2 = -2z(1 + iz)$, with the roots $z = 0$ and
$z = i$, the directions $+\hat z$ and $+\hat y$ (chapter 9.4).
:::

### Stretch

Combine with chapter 9.1's rotor formula. Three circular binaries share one frequency, and the pencil gives the roots
of size 194, 1 and 0.0625. Find their inclinations, and say which way each turns as the camera sees it.

::: solution
$\cot^4(\iota/2) = |\lambda|$ gives $\iota = 2\,\mathrm{arccot}\,|\lambda|^{1/4}$. For 194, $|\lambda|^{1/4} = 3.73 =
\cot 15°$, so $\iota = 30°$, and the anticlockwise helicity $+2$ dominates. For 1, $\iota = 90°$: edge-on, turning
neither way. For 0.0625, $|\lambda|^{1/4} = 0.5$ and $\iota = 2\times63.4° = 127°$, and the clockwise helicity
dominates.
:::

### The paper

Derive the paper's [](/paper/#eq:proof-prony) and from it the paper's [](/paper/#eq:wave-count). Show that for $N = 2$,
$L = 1$ and $s = 2$ it asks for a singular $3\times3$ Hankel table, and check the count of unknowns for light at one
frequency.

::: solution
Putting $y_{j+k} = \sum_a\curv\alpha_az_a^{j+k}$ into $\sum_kp_ky_{j+k}$ and summing over $k$ first gives $\sum_a
\curv\alpha_az_a^jp(z_a) = 0$. With $j$ from 0 to $2s - N$ there are $L(2s - N + 1)$ equations for $N$ unknowns, and
$L(2s - N + 1) \ge N$ is $N \le L(2s + 1)/(L + 1)$. For $N = 2$, $s = 2$ the equations $y_j p_0 + y_{j+1}p_1 + y_{j+2} =
0$ for $j = 0, 1, 2$ have a solution only if the table with rows $(y_0, y_1, y_2)$, $(y_1, y_2, y_3)$, $(y_2, y_3, y_4)$
is singular. Light at one frequency, with $N = 2$: two directions and four amplitudes, six unknowns, against six numbers
recorded; with $N = 3$, nine against six.
:::
:::

::: paper
- Section VIII's [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point): Sylvester's theorem, the
  paper's [](/paper/#eq:pencil), [](/paper/#eq:four-waves) with Figure [](/paper/#fig:voices), and
  [](/paper/#eq:wave-count), with the uncorrelated sources.
- Section VIII's [*Lensed images at one point*](/paper/#par:lensed-images-at-one-point): the cells and the arcsecond's
  $2\times10^5$.
- Appendix C's [*The count of waves*](/paper/#par:the-count-of-waves): the paper's [](/paper/#eq:proof-prony) and what
  "generically" means.
:::

::: deeper
- S. Kunis, T. Peter, T. Römer and U. von der Ohe, "A multivariate generalization of Prony's method", *Linear Algebra
  and its Applications* 490, 31 (2016): Prony's method with Hankel tables, as the paper uses it.
- J. J. Sylvester, "On a remarkable discovery in the theory of canonical forms and of hyperdeterminants",
  *Philosophical Magazine* 2, 391 (1851): when a binary quartic is a sum of two fourth powers.
- A. Nehorai and E. Paldi, "Vector-sensor array processing for electromagnetic source localization", *IEEE
  Transactions on Signal Processing* 42, 376 (1994): direction finding with a sensor of all six numbers of light.
:::

[^c]: The paper writes $c_a$. The tutorial keeps $c$ for the speed of light and 9.1's components $c_m$.

[^v]: The letter $\mathbf v$ is the paper's: a complex vector of no unit, not a velocity.

[^triple-root]: That reading is 9.4's type III. It sends $(-i, 1, 0)$ to zero, a null vector, and its quadratic
    is $2iz^2$.

[^infinity]: A wave travelling along $-\hat z$ sits at $z = \infty$, where [](#eq:triple) does not apply. Turning the
    axes first moves every wave to a finite $z$.

[^lambda]: Here $\lambda_a$ is not a wavelength.

[^A]: The paper's letter. Since $\curv{\mathcal W}$ has no trace, $A$ can be taken trace-free. It is not chapter 8.7's
    sum $A$, nor 9.1's amplitude of the rotor.

[^typical]: The paper's "located to $10^{-4}$ radian" holds typically, not for every record: one record in five has a
    direction off by more than $10^{-4}$ rad.

[^map]: The paper's Section VIII says the five numbers "are the moments". They are, up to a fixed linear map, as its
    Appendix C says: in 9.1's components, $y_0 = c_2/2$.

[^moment-problem]: Gaspard de Prony posed it in 1795, for sums of decaying exponentials.

[^p]: The paper's letter, not 8.4's Majorana polynomial.

[^spin-s]: The product of $s$ factors $\vect m(z)\cdot\vect m(z_a) = -2(z - z_a)^2$ gives $(-2)^s(z - z_a)^{2s}$, a
    polynomial of degree $2s$ with $2s + 1$ coefficients.

[^generic]: In each snapshot the table of the $y_{j+k}$, with rows $j = 0, \dots, 2s - N$ and columns $k = 0, \dots,
    N$, sends the column of the $p_k$ to zero. Stacked over the snapshots, these tables must have rank $N$ for $p$ to be
    unique.

[^IV]: The letter $I_a$, with its index, is one source's brightness, not 9.2's invariant $I = \mathrm{tr}\,\curv{\mathcal
    W}^2$.

[^closed]: The paper's "in closed form" is loose. The fractions are the roots of a polynomial of degree five, which has no
    general formula, and linear algebra alone finds them.

[^rho]: Tilting a wave by one radian changes its reading by about its own size, so by chapter 3.3's Cramér–Rao bound
    a direction is known to about the noise over the signal, $1/\rho$.

[^hankel]: Both sides are the degree-three invariant of a binary quartic, which Sylvester called its catalecticant.

[^chirp]: The quadrupole formula's rate $\dot f = \tfrac{96}{5}\pi^{8/3}(G\mathcal M/c^3)^{5/3}f^{11/3}$ for a chirp
    mass $\mathcal M$ of 1.2 solar masses, stated (M. Maggiore, *Gravitational Waves*, vol. 1, Oxford, 2008, section 4.1).
