---
id: '9.5'
title: 'Separating waves at one point'
question: 'Several gravitational waves cross one pixel at once, each from its own direction. How can a single point separate them, and why can it find four for gravity but only two for light?'
part: '9'
requires: ['3.1', '3.3', '9.1', '9.2', '9.4']
paper: [sec:one-pixel, eq:pencil, eq:four-waves, eq:wave-count, fig:voices, eq:stars, app:proofs, eq:proof-prony]
figures: [fig:voices]
live: [voices]
depth: A
---

Four gravitational waves cross one pixel at once, each from its own direction and with its own waveform. The pixel
records only its ten numbers as they change. From that record alone the figure below finds four points on the sky, and
they fall on the four sources.[^first] A sensor of light, given the same kind of record, finds two. How can one point
separate waves that cross it together, and why four for gravity and two for light? The answer is one counting rule.

{{paper fig:voices}}

::: plain
A single gravitational wave makes the pixel's reading a square: one complex arrow multiplied by itself. Several waves
add their squares, and separating them means finding the arrows again.

One reading separates two waves, because the sum of two squares sends one direction to zero, and that direction leads
to both. One frequency separates three, by comparing the record's two parts, one for each sense of turning. A long
record separates four, because their readings leave one combination of the five complex numbers empty. Five waves
fill everything. Counting unknowns against recorded numbers gives the rule, and light, whose wave is the arrow and not
its square, separates at most two.
:::

## Two waves give a reading of rank two, and the vector it sends to zero leads to both

Each wave is four real numbers, a direction and a complex amplitude (section 9.1), so two waves are eight real
unknowns against the reading's ten real numbers. We assume that **two plane waves cross the pixel from two different
directions, and nothing else contributes**. Each wave's reading is a square
([section 9.1](/tutorial/one-point/spin-two/#a-plane-wave-fills-only-the-extreme-weight-so-its-reading-is-a-square)),
and readings add, so

$$\curv{\mathcal W} = \curv\alpha_1\vect m_1\vect m_1^{\mathsf T} + \curv\alpha_2\vect m_2\vect m_2^{\mathsf T} .$$

Here $\vect m_a$, for $a = 1, 2$, is a null vector of the direction of wave $a$, a complex vector with $\vect
m_a\cdot\vect m_a = 0$, and $\sym{wave-amplitudes}{\curv\alpha_a}$ is its complex amplitude in $\mathrm{s^{-2}}$, which
absorbs the length and phase of $\vect m_a$.

**The rank is two.** Every column of $\curv{\mathcal W}$ is a combination of $\vect m_1$ and $\vect m_2$, so the table
has rank two (section
[9.2](/tutorial/one-point/complex-symmetric/#singular-values-are-not-the-sizes-of-the-eigenvalues)) and $\det\curv{\mathcal
W} = 0$. That is one complex condition, two real ones: the two numbers left over in the count. The pull of one mass
$\matter M$ at the distance $r$ has $\det\curv{\mathcal W} = -2(G\matter M/r^3)^3$ (section 9.2), which is never zero,
so $\det\curv{\mathcal W}$ tells two waves from a mass.

**The vector it sends to zero.** Take $\mathbf v = \vect m_1\times\vect m_2$, a complex vector with no unit. Then

$$\curv{\mathcal W}\mathbf v = \curv\alpha_1\vect m_1\,\bigl(\vect m_1\cdot\mathbf v\bigr) + \curv\alpha_2\vect
m_2\,\bigl(\vect m_2\cdot\mathbf v\bigr) = 0 ,$$

because a triple product with a repeated vector vanishes. The pixel finds $\mathbf v$, up to a factor, as the singular vector of
$\curv{\mathcal W}$ with singular value zero.

**The quadratic.** We write each $\vect m_a$ as $\vect m(z_a) = (1 - z_a^2,\ i(1 + z_a^2),\ -2z_a)$, with $z_a$ the
stereographic coordinate of its direction (section 9.4): one complex number with no unit, for the direction's two real
numbers. Multiplying out the cross product (the box below) gives

$$\boxed{\;\begin{aligned}&\vect m(z)\cdot\bigl(\vect m(z_1)\times\vect m(z_2)\bigr)\\
&\quad = 4i\,(z_2 - z_1)(z - z_1)(z - z_2) .\end{aligned}\;} \label{eq:triple}$$

So the condition $\vect m(z)\cdot\mathbf v = 0$, which for $\mathbf v = (v_x, v_y, v_z)$ reads

$$(v_x + iv_y) - 2v_z\,z + (iv_y - v_x)\,z^2 = 0 ,$$

is a quadratic in $z$, and its two roots are $z_1$ and $z_2$, the two directions. The amplitudes follow from section
9.4's quartic $Q(z) = \vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z)$, which for this reading is $4\curv\alpha_1(z -
z_1)^4 + 4\curv\alpha_2(z - z_2)^4$: at $z = z_2$ the second term drops out, and $\curv\alpha_1 = Q(z_2)/[4(z_2 -
z_1)^4]$.

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

**A number.** Two waves of unit amplitude travel along $\hat z$ and $\hat x$, with the unit null vectors $\vect m_z =
(1, i, 0)/\sqrt2$ and $\vect m_x = (0, 1, i)/\sqrt2$ of section 9.1. Their reading $\curv{\mathcal W} = \vect m_z\vect
m_z^{\mathsf T} + \vect m_x\vect m_x^{\mathsf T}$ has the rows $\tfrac12(1, i, 0)$, $\tfrac12(i, 0, i)$ and
$\tfrac12(0, i, -1)$, and it sends $\mathbf v = (1, i, -1)$ to zero. The quadratic is $2z - 2z^2 = 0$, with the roots $z
= 0$ and $z = 1$, the directions $+\hat z$ and $+\hat x$. Since $\vect m(0) = \sqrt2\,\vect m_z$, the first wave is
$\tfrac12\vect m(0)\vect m(0)^{\mathsf T}$, and indeed $Q(1) = 2$ gives $\curv\alpha_1 = 2/[4(1 - 0)^4] = \tfrac12$.

**A limit.** If the two directions coincide, $z_1 = z_2$, then [](#eq:triple) vanishes, $\mathbf v = 0$, and the
reading is a single square of rank one: one wave, which no reading can split in two.

**The converse holds generically.** A quartic is, generically, a sum of two fourth powers when one combination of its
coefficients vanishes [@Sylvester1851], and for $Q$ that combination is a multiple of $\det\curv{\mathcal W}$. We can
see it directly. Let $\det\curv{\mathcal W} = 0$ with $\curv{\mathcal W}$ of rank two, and let $\mathbf v$ be the vector
it sends to zero. The quadratic above has the discriminant $(2v_z)^2 - 4(v_x + iv_y)(iv_y - v_x) = 4(v_x^2 + v_y^2 +
v_z^2) = 4\,\mathbf v\cdot\mathbf v$. So when $\mathbf v\cdot\mathbf v \neq 0$ it has two different roots $z_1$ and
$z_2$, and $\vect m_1 = \vect m(z_1)$ and $\vect m_2 = \vect m(z_2)$ are null vectors with $\vect m_a\cdot\mathbf v = 0$.
They are independent, since multiplying out gives $\vect m_1\cdot\vect m_2 = -2(z_1 - z_2)^2 \neq 0$, so they span the plane of
vectors $\mathbf u$ with $\mathbf u\cdot\mathbf v = 0$, and with $\mathbf v$ they form a basis. A symmetric table that
sends $\mathbf v$ to zero has no terms with $\mathbf v$ in that basis, so $\curv{\mathcal W} = \sum_{a,b}\beta_{ab}\vect
m_a\vect m_b^{\mathsf T}$ over $a, b = 1, 2$, with a symmetric $2\times2$ table $\beta_{ab}$ (local). Its trace is
$2\beta_{12}\,\vect m_1\cdot\vect m_2$, which must vanish, so $\beta_{12} = 0$ and $\curv{\mathcal W} = \beta_{11}\vect
m_1\vect m_1^{\mathsf T} + \beta_{22}\vect m_2\vect m_2^{\mathsf T}$: two waves. When $\mathbf v\cdot\mathbf v = 0$ the
quadratic has a double root and the reading is not two waves. A reading whose quartic has a triple root, such as $Q =
z^3(z - 1)$, is of that kind: it has $\det\curv{\mathcal W} = 0$, but its quadratic has a double root.[^triple-root] So a
reading of rank two is two waves exactly when $\det\curv{\mathcal W} = 0$ and its quadratic has two different roots.

Light cannot do it at all: one wave of light, a complex multiple of one null vector, uses four of its six real
numbers (section 9.1).

## Three waves of one frequency are three roots of one pencil

One reading cannot separate three waves: they hold six complex unknowns, three directions and three amplitudes,
against a reading's five complex numbers. We assume that **three plane waves of one angular frequency $\omega$ cross
the pixel from three different directions**, and that the record is long enough to split the reading into its two
parts at that frequency:

$$\curv{\mathcal W}(t) = \curv{\mathcal W}_+e^{-i\omega t} + \curv{\mathcal W}_-e^{i\omega t} .$$

Since $\curv{\mathcal W}$ is complex, $\curv{\mathcal W}_-$ is not the conjugate of $\curv{\mathcal W}_+$. One wave puts
the same square into both parts, with its two helicity amplitudes
([section 9.1](/tutorial/one-point/spin-two/#on-the-sky-a-quantity-of-spin-weight-s-begins-at-degree-s)), so the three
waves give

$$\curv{\mathcal W}_\pm = \sum_{a=1}^3\curv\alpha^\pm_a\,\vect m_a\vect m_a^{\mathsf T} .$$

For two tables built from the same three squares, the
[pencil identity of section 9.2](/tutorial/one-point/complex-symmetric/#a-pencil-of-two-tables-has-generalized-eigenvalues)
reads

$$\det(\curv{\mathcal W}_+ - \lambda\,\curv{\mathcal W}_-) = \det[\vect m_1, \vect m_2, \vect m_3]^2\prod_{a=1}^{3}
(\curv\alpha^+_a - \lambda\,\curv\alpha^-_a) .$$

The left side is a cubic in $\lambda$ with three roots only if the determinant of the three null vectors is not zero,
and by [](#eq:triple) with $z = z_3$,[^infinity] $\det[\vect m(z_1), \vect m(z_2), \vect m(z_3)] = 4i(z_2 -
z_1)(z_3 - z_1)(z_3 - z_2)$, which vanishes only when two directions coincide. So the cubic has the three roots
$\sym{pencil-roots}{\lambda_a} = \curv\alpha^+_a/\curv\alpha^-_a$, complex numbers with no unit.

**The directions.** At the root $\lambda_1$ the first square drops out, so $\curv{\mathcal W}_+ -
\lambda_1\curv{\mathcal W}_-$ is a sum of two squares, and by the first section it sends $\mathbf v_1 = \vect
m_2\times\vect m_3$ to zero. The roots $\lambda_2$ and $\lambda_3$ give $\mathbf v_2 = \vect m_3\times\vect m_1$ and
$\mathbf v_3 = \vect m_1\times\vect m_2$ in the same way, and a vector identity (the box below) gives

$$\mathbf v_2\times\mathbf v_3 = \vect m_1\,\det[\vect m_3, \vect m_1, \vect m_2] .$$

So the cross product of the vectors found at $\lambda_2$ and $\lambda_3$ is wave 1's $\vect m$, up to a factor, and
section 9.1's $\hat k = \mathrm{Re}(i\,\vect m\times\vect m^*)/|\vect m|^2$ gives its direction. The other two follow
in the same way.

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
which sends a whole plane of vectors to zero. Two binaries seen face-on and turning the same way have $\curv\alpha^- =
0$, so they share the root at infinity.

**The binary's ratio.** The rotor formula of section 9.1 gives a circular binary seen at the inclination $\iota$, the
angle between its axis and the line of sight,

$$\boxed{\;|\lambda| = \left|\frac{\curv\alpha^+}{\curv\alpha^-}\right| = \cot^4\frac\iota2 .\;}$$

**Numbers:** $|\lambda| = 194$ at $\iota = 30°$, 9.00 at 60° and 0.496 at 100°, where the clockwise helicity is the
stronger. **A limit:** edge-on, $\iota = 90°$, the two helicities are equal and $|\lambda| = 1$. An interferometer
records one number at each moment, so three binaries in one frequency bin add into one sinusoid. To one pixel they are
three separate directions.

## Four waves over time leave one combination of the readings empty

Real sources do not share one frequency, so we separate four waves of any waveforms. We assume that **four plane waves
arrive from fixed directions**, and that **their waveforms are linearly independent** over the record, so that no one
of them is a fixed combination of the others. Each reading is then

$$\curv{\mathcal W}(t) = \sum_{a=1}^4\curv\alpha_a(t)\,\vect m_a\vect m_a^{\mathsf T} ,$$

a combination of the same four tables at every time $t$. A reading is five complex numbers, so the readings fill only
a four-dimensional part of the five-dimensional space of readings: eight of the ten real numbers, with two left over
([section 0.4](/tutorial/evening/one-pixel/#one-pixel-separates-several-waves-and-tells-a-wave-from-a-nearby-pull)).

**The empty combination.** One linear combination of the five numbers is then zero for every reading. We write it as
$\mathrm{tr}(\sym{four-wave-table}{A}\,\curv{\mathcal W}) = A_{ij}\curv{\mathcal W}_{ij} = 0$, with $A$ a symmetric
table of numbers with no unit, which can be taken trace-free since $\curv{\mathcal W}$ has no trace. To find it, we
stack the $\sym{snapshots}{L}$ readings as rows of their five numbers in the orthonormal basis of
[section 1.5](/tutorial/newton/five-numbers/). The combination is the singular vector of that table whose singular
value is zero (section 9.2), or with noise the smallest.

**Two conics.** Because the waveforms are independent, each square $\vect m_a\vect m_a^{\mathsf T}$ is itself a
combination of readings, so $\mathrm{tr}(A\,\vect m_a\vect m_a^{\mathsf T}) = \vect m_a^{\mathsf T}A\,\vect m_a = 0$.
Each wave's null vector therefore solves two equations,

$$\vect m^{\mathsf T}A\,\vect m = 0, \qquad \vect m\cdot\vect m = 0 .$$

Each is a quadratic equation in the components of $\vect m$, whose solutions, counted up to a factor, form a curve
called a **conic**. These two meet in four points, and here we can see why. Every null vector is a multiple of some
$\vect m(z)$ (section 9.4), so with $\vect m = \vect m(z)$ the second equation holds for every $z$, and the first
becomes the quartic $\vect m(z)^{\mathsf T}A\,\vect m(z) = 0$. It is a polynomial of degree four in $z$, not zero
since $A$ is not (the map from a table to its quartic is one-to-one, as the paragraph on five waves below shows), so
it has four roots, counted with their multiplicity, a root at infinity, a wave along $-\hat z$, included when the degree drops. The
four directions are roots, so they are all of them. (Bézout's theorem says the same of any two conics.) They are the four principal null directions of the table $A$
(section 9.4).

**A number.** Take four waves from random directions with independent random complex waveforms, 300 readings, and
complex Gaussian noise of $10^{-4}$ of the signal's root mean square on every component. Over 1,200 such records the
median angle between a found direction and the true one is about $2\times10^{-5}$ rad, and about four records in five
have all four directions within $10^{-4}$ rad. The worst reach $2\times10^{-3}$ rad, where two sources are a few
degrees apart.

## All three cases are Prony's problem, and counting gives the limit

We want one rule for the three cases, and the largest number of waves a point sensor can separate. Section 9.4 found
the quartic of a sum of squares, $\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) = 4\sum_a\curv\alpha_a(z - z_a)^4$,
with $\vect m_a = \vect m(z_a)$. We expand each fourth power by the binomial theorem, $(z - z_a)^4 =
\sum_{k=0}^4\binom4kz^k(-z_a)^{4-k}$, and collect the powers of $z$:

$$\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) = 4\sum_{k=0}^4(-1)^k\binom4k\,y_{4-k}\,z^k ,$$

with the five **moments**

$$\boxed{\;\sym{moments-y}{y_j} = \sum_a\curv\alpha_a\,z_a^j ,\qquad j = 0, \dots, 4 ,\;}$$

in $\mathrm{s^{-2}}$. The coefficients of the quartic are linear in the entries of $\curv{\mathcal W}$, so the five
numbers of a reading are the five moments, up to a fixed linear map.[^map] Finding the points $z_a$ and the weights
$\curv\alpha_a$ of a sum of powers from its first moments is **Prony's problem** [@KunisPeterRomerOhe2016], posed by
Gaspard de Prony in 1795 for sums of decaying exponentials.

**Snapshots.** A **snapshot** is one set of five moments: one reading, or one of the two parts $\curv{\mathcal W}_\pm$
at one frequency. The directions $z_a$ are the same in every snapshot, so a further snapshot adds five numbers but only
$N$ new unknowns for $N$ waves. Here $L$ counts the snapshots whose amplitudes are independent of one another.

**The key step.** Let $\sym{prony-polynomial}{p(z)} = \prod_a(z - z_a) = \sum_{k=0}^Np_kz^k$, with $p_N = 1$. Its roots
are the $N$ directions, so its coefficients are shared by all snapshots. For a whole number $j$ we form the sum
$\sum_{k=0}^Np_ky_{j+k}$, put in $y_{j+k} = \sum_a\curv\alpha_az_a^{j+k}$, and do the sum over $k$ first. Every term
then holds $p(z_a)$, which is zero:

$$\sum_{k=0}^{N}p_k\,y_{j+k} = \sum_a\curv\alpha_az_a^j\,p(z_a) = 0 ,\qquad j = 0, \dots, 2s - N .$$

For a field of spin $s$, a reading holds $2s + 1$ complex numbers (section 9.1), the moments $y_0$ to $y_{2s}$.[^spin-s]
The index $j$ runs from 0 to $2s - N$, so that $j + N$ stays within $2s$, and each snapshot gives $2s - N + 1$ linear
equations for the $N$ unknowns $p_0, \dots, p_{N-1}$. The $L$ snapshots share $p$, so together they give $L(2s - N +
1)$ equations, enough when $L(2s - N + 1) \ge N$, that is $N(L + 1) \le L(2s + 1)$. The largest such $N$ is

$$\boxed{\;\sym{wave-count}{N_{\max}} = \left\lfloor\frac{L(2s + 1)}{L + 1}\right\rfloor ,\;}$$

where $\lfloor x\rfloor$ is the largest whole number not above $x$.

**No method does better.** $N$ waves have $N$ directions and $LN$ amplitudes, $N(L + 1)$ complex unknowns, against the
$L(2s + 1)$ complex numbers recorded: the same inequality (Figure [](#fig:wave-count)). The count holds generically,
because snapshots whose amplitudes are all proportional add no new equations.[^generic] Bounds of this kind were found
earlier for sensors of light's six numbers and for acoustic vector sensors, and there they depend on what is assumed of
the sources' polarization [@NehoraiPaldi1994; @HochwaldNehorai1996].

**When $p$ is unique.** Stack the equations of all the snapshots as one table $H$ (local), whose rows are $(y_j,
y_{j+1}, \dots, y_{j+N})$ for every snapshot and every $j$, so that $H\mathbf p = 0$ for the column $\mathbf p = (p_0,
\dots, p_N)$. Each row is $\sum_a\curv\alpha_az_a^j\,(1, z_a, \dots, z_a^N)$, a combination of the $N$ rows $(1, z_a,
\dots, z_a^N)$, which are independent for different $z_a$. So $H$, with $N + 1$ columns, has rank at most $N$ and always
sends some column to zero. When its rank is exactly $N$, that column is one, up to a factor, and with $p_N = 1$ it is
$\mathbf p$. The rank falls below $N$ when the snapshots' amplitudes are proportional, or tied to the directions, and
the rank of $H$ shows when that has happened.

**Sound.** A sensor of sound reads a pressure and the air's velocity, four real numbers, and a sound wave from $\hat n$
gives them in proportion to $(1, -\hat n)$ in suitable units; its count is not Prony's. At one instant a wave has three
unknowns, two angles and an amplitude, against four numbers: one wave. At one frequency the amplitudes are complex, four
unknowns a wave against eight numbers, and two waves whose phases differ give real and imaginary parts that span the
plane of their two columns: two waves. Over a long record $N$ waves with independent waveforms fill an $N$-dimensional
part of the four numbers, and each direction must obey $4 - N$ linear conditions $\ell_0 - \boldsymbol\ell\cdot\hat n =
0$ (local letters), each a plane in the space of $\hat n$. Two waves leave two planes, which meet in a line that crosses
the unit sphere at the two directions. Three leave one plane, which cuts the sphere in a whole circle of candidates, so
three cannot be found, though the count of unknowns, $(2 + L)N \le 4L$, would allow it. Sound separates 1, 2 and 2.

| | one instant, $L = 1$ | one frequency, $L = 2$ | long record, $L \to \infty$ |
|---|---|---|---|
| light, $s = 1$ | 1 | 2 | 2 |
| gravity, $s = 2$ | 2 | 3 | 4 |
| spin four (hypothetical), $s = 4$ | 4 | 6 | 8 |

Over a long record $N_{\max} = 2s$, because $L(2s + 1)/(L + 1)$ stays below $2s + 1$ and reaches $2s$ once $L \ge 2s$: for gravity, four
independent snapshots are enough in principle.

**Two waves are a special case.** At one instant, $N = 2$ and $j = 0, 1, 2$: three equations for $p_0$ and $p_1$,
which need the $3\times3$ table of the $y_{j+k}$ to be singular. That table is a Hankel matrix (section 3.9), whose
entries depend only on $j + k$. Its determinant is exactly $-\det\curv{\mathcal W}/16$, so this is the first section's
$\det\curv{\mathcal W} = 0$.[^hankel]

**Five waves.** The five quartics $(z - z_a)^4$ of five different directions are independent, since the table of their
coefficients has the determinant $96\prod_{a<b}(z_a - z_b)$, and the map from a reading to its quartic is one-to-one,
since the factors 2, $4\sqrt2$, 12, $-4\sqrt2$ and 2 of section 9.4 are nonzero. So every reading is a sum of five
squares for any five directions we choose: a pixel cannot find five waves.

![Look first at the rings: the largest number of waves whose unknowns, a direction and $L$ amplitudes each, still fit
within the numbers recorded. Gravity's rings sit at 2, 3 and 4, light's at 1, 2 and 2. Counts
exact.](tut-wave-count){#fig:wave-count}

::: try {#voices}
Predict first: the pixel finds four waves from its record. What will it find when a fifth is added? Then raise the
number of waves to five and read what the figure reports under each sky. With four waves, drag one source close to
another and watch the zeros of $\vect m^{\mathsf T}A\,\vect m$ crowd together.
:::

## Uncorrelated sources separate from their average brightness and circular polarization

The count above stops at four because every amplitude in every snapshot is an unknown. Averages over many stretches keep only each source's mean brightness and circular polarization, and they
separate up to five sources, because each needs its own independent column of five numbers.

We assume that **the sources are independent**, so that averaged products between different sources vanish, and that
**their circular fractions differ**. In each stretch we write the parts $\curv{\mathcal W}_\pm$ at one frequency as
columns $\mathbf w_\pm$ of five numbers in the orthonormal basis, and each unit square as a column
$\sym{steering-vector}{\mathbf q_a}$, the **steering vector** of source $a$. The averages $C_\pm$ of $\mathbf
w_\pm\mathbf w_\pm^\dagger$ over the stretches, with $\dagger$ the conjugate transpose, lose their cross terms, and

$$\begin{aligned}C_I &= C_+ + C_- = \sum_aI_a\,\mathbf q_a\mathbf q_a^\dagger ,\\
C_V &= C_+ - C_- = \sum_aV_a\,\mathbf q_a\mathbf q_a^\dagger .\end{aligned}$$

The brightness $I_a$ and the circular polarization $V_a$, the means of $|\curv\alpha^+_a|^2 \pm |\curv\alpha^-_a|^2$ for
unit squares, in $\mathrm{s^{-4}}$, are proportional to the Stokes $I$ and $V$ of one source
([section 5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes)),
with the same ratio $V_a/I_a$, its circular fraction.[^IV] Whitening $C_I$ to the identity
([section 3.4](/tutorial/noise/symmetric-matrices/#whitening-turns-shared-noise-into-independent-noise-of-unit-size))
and diagonalizing what $C_V$ becomes gives the five fractions, the roots $\mu$ of $\det(C_V - \mu\,C_I) = 0$.[^closed]
Each eigenvector $\mathbf x_a$, scaled so that $\mathbf x_a^\dagger C_I\mathbf x_a = 1$, gives $C_I\mathbf x_a$, a
multiple of $\mathbf q_a$ whose direction follows by section 9.1's rule and whose squared length is $I_a$. **A
number:** five sources from random directions, with brightnesses from 0.5 to 1.3 and fractions 0.8, 0.4, 0, −0.3 and
−0.7, averaged over $10^4$ noise-free stretches, come back with the fractions to about 0.01 and the directions to about
0.03 rad.

**Why it works.** Let $Q$ (local) be the $5\times5$ table whose columns are the five steering vectors, independent for
five generic directions, so that $Q$ has an inverse, and let $D_I$ and $D_V$ be the diagonal tables of the $I_a$ and
the $V_a$. Then $C_I = QD_IQ^\dagger$ and $C_V = QD_VQ^\dagger$. Take $\mathbf x_a = (Q^\dagger)^{-1}\mathbf
e_a/\sqrt{I_a}$, with $\mathbf e_a$ the $a$th column of the identity, so that $Q^\dagger\mathbf x_a = \mathbf
e_a/\sqrt{I_a}$. Then

$$C_I\mathbf x_a = \sqrt{I_a}\,\mathbf q_a ,\qquad C_V\mathbf x_a = \frac{V_a}{\sqrt{I_a}}\,\mathbf q_a = \frac{V_a}{I_a}\,
C_I\mathbf x_a .$$

So $\mathbf x_a$ solves the pencil with the root $\mu_a = V_a/I_a$, the circular fraction, and $C_I\mathbf x_a$ is
$\sqrt{I_a}$ times $\mathbf q_a$, of squared length $I_a$. These vectors are also orthonormal in the weight of $C_I$,
$\mathbf x_a^\dagger C_I\mathbf x_b = \mathbf e_a^\dagger D_I\mathbf e_b/\sqrt{I_aI_b} = \delta_{ab}$, which is the
scaling used above. When the five fractions differ, each root has one eigenvector only, so these are the vectors the
diagonalization returns. When two fractions are equal, every combination of their two eigenvectors solves the pencil,
and their sources mix; unpolarized sources all have $V_a = 0$, so they cannot be separated this way.

**How fast it converges.** Over $K$ stretches the cross terms between sources, which average to zero, leave a remainder
of relative size about $1/\sqrt K$, by the square-root law of
[section 3.1](/tutorial/noise/probability/), and the fractions and directions inherit errors of that order: $10^4$
stretches give about 0.01, as in the number above, the directions a few times more where two steering vectors are
nearly parallel.

## Lensed images fall in separate cells of time and frequency

Can one pixel resolve a lensed source, which a galaxy splits into two or four images about an arcsecond apart, with
arrival times that differ by hours to months? This is an estimate. At any moment each image is at a different stage of
the same chirp, the wave whose frequency rises as the binary spirals in, so at a different frequency.

A stretch of record of duration $\Delta t$ resolves frequencies about $1/\Delta t$ apart, and a patch of the record
$\Delta t$ long and $1/\Delta t$ wide in frequency is a **time–frequency cell**. A pair of neutron stars at 100 Hz rises
in frequency at the rate $\dot f = 17\unit{Hz\,s^{-1}}$,[^chirp] and it crosses one cell's width in one cell's time when
$\dot f\,\Delta t = 1/\Delta t$, so the cells are $\Delta t = 1/\sqrt{\dot f} = 0.24\unit{s}$ long and $4.1\unit{Hz}$
wide. Two images half a second apart differ by $7.3\unit{Hz}$, 1.8 cells, so they stay separate even when only half a
second out of step. In each cell the pixel reads one wave (Figure [](#fig:lens-cells)).

One wave is placed to within $1/\rho$ radian at the signal-to-noise ratio $\rho$ of its cell, a number with no unit
(derived in section 9.7).[^rho] An arcsecond is $4.85\times10^{-6}$ rad, so it needs

$$\rho = \frac{1}{4.85\times10^{-6}} = 2.1\times10^5 ,$$

thousands of times the ratios of 10 to 100 of the events detected so far. An aperture would need, at 100 Hz, a width of
one wavelength over an arcsecond, $3.0\times10^6\unit{m}/4.85\times10^{-6} = 6.2\times10^{11}\unit{m}$, 4.1 times the
distance from the Earth to the Sun
([section 5.3](/tutorial/waves/diffraction/#an-array-resolves-as-many-directions-as-its-area-holds-square-wavelengths)).
Images that overlap in frequency, as those of a steady source do, must be separated as one Prony problem, and close
images make it ill-conditioned. Let two waves come from the nearby directions $\bar z \mp \delta/2$ with the amplitudes
$\curv\alpha_1$ and $\curv\alpha_2$, and write $S(z) = \vect m(z)\vect m(z)^{\mathsf T}$ for the square of a wave from
$z$. Expanding each square about $\bar z$ (primes are derivatives with respect to $z$),

$$\begin{aligned}\curv{\mathcal W} &= (\curv\alpha_1 + \curv\alpha_2)\,S + (\curv\alpha_2 - \curv\alpha_1)\frac\delta2\,S'\\
&\quad + (\curv\alpha_1 + \curv\alpha_2)\frac{\delta^2}{8}\,S'' + (\curv\alpha_2 - \curv\alpha_1)\frac{\delta^3}{48}\,S'''
+ \dots\end{aligned}$$

The first two terms are one wave from a slightly shifted direction. The separation first shows in the third term, of
order $\delta^2$, and the difference of the amplitudes, once the shift it imitates is fitted, only in the fourth, of
order $\delta^3$. The change of $\curv{\mathcal W}$ with $\delta$ is therefore of size about $|\curv\alpha_1 +
\curv\alpha_2|\,\delta|S''|/4$, so by the Cramér–Rao bound of section 3.3 the separation is read to a fraction of
about $1/(\rho\delta^2)$ of itself, and the two amplitudes only to about $1/(\rho\delta^3)$ of their sum: the errors
grow as powers of one over the separation. Two images an arcsecond apart, with $\delta$ of order $5\times10^{-6}$,
would need $\rho$ of order $1/\delta^2$, about $4\times10^{10}$, against the $2\times10^5$ that suffices when they fall in
separate cells.

![Look first at the bracket: two images of one chirp, half a second out of step, sit in different cells, so one pixel
reads each as a single wave. Chirps exact for a neutron-star pair; the grid's cell size is the $4.1\unit{Hz}$ by
$0.24\unit{s}$ of the text.](tut-lens-cells){#fig:lens-cells}

**The idea to keep: each wave's reading is a square, so the readings of several waves are sums of fourth powers, and
separating them is Prony's problem. Counting unknowns against recorded numbers gives $\lfloor L(2s + 1)/(L +
1)\rfloor$ waves for a point sensor of spin $s$: two, three and four for gravity, and one, two and two for light.**

::: problems
### Practice

**[9.5]** How many waves can one pixel separate at one instant, at one frequency and over a long record, and why does
light do worse?

::: solution
Two, three and four. Light's wave is a vector of three complex numbers rather than a square of five, so $s = 1$ in
$\lfloor L(2s + 1)/(L + 1)\rfloor$, which gives one, two and two.
:::

**[9.5]** A circular binary in a set of three at one frequency gives the root $|\lambda| = 9$. At what inclination is
it seen?

::: solution
$\cot^4(\iota/2) = 9$ gives $\cot(\iota/2) = \sqrt3$, so $\iota/2 = 30°$ and $\iota = 60°$.
:::

**[9.5]** Two waves of unit amplitude travel along $\hat z$ and $\hat y$, with $\vect m_z = (1, i, 0)/\sqrt2$ and
$\vect m_y = (i, 0, 1)/\sqrt2$. Find the vector $\curv{\mathcal W}$ sends to zero and both directions.

::: solution
$\curv{\mathcal W}$ has the rows $\tfrac12(0, i, i)$, $\tfrac12(i, -1, 0)$ and $\tfrac12(i, 0, 1)$. It sends $\mathbf v
= (1, i, 0)\times(i, 0, 1) = (i, -1, 1)$ to zero. The quadratic is $-2z - 2iz^2 = -2z(1 + iz)$, with the roots $z = 0$
and $z = i$, the directions $+\hat z$ and $+\hat y$.
:::

**[9.5]** The reading of the first section's number sends $\mathbf v = (1, i, -1)$ to zero. Check that $\mathbf
v\cdot\mathbf v \neq 0$, find the discriminant of its quadratic, and confirm that the converse applies.

::: solution
$\mathbf v\cdot\mathbf v = 1 - 1 + 1 = 1$, so the discriminant is $4\,\mathbf v\cdot\mathbf v = 4$, the quadratic $2z -
2z^2$ has the two roots 0 and 1, and the reading is two waves, along $+\hat z$ and $+\hat x$.
:::

**[9.5]** How many sound waves can a sensor of pressure and velocity separate over a long record, and why does the count
of unknowns overstate it?

::: solution
Two. For three waves the readings leave one linear condition on $(1, -\hat n)$, a plane that cuts the unit sphere in a
circle, so every direction on that circle fits; the count of unknowns, $3(2 + L) \le 4L$ for $L \ge 6$, ignores that
the conditions are linear in $\hat n$.
:::

### Stretch

**[9.5]** Three circular binaries share one frequency, and the pencil gives the roots of size 194, 1 and 0.0625. Find
their inclinations, and say which way each turns as the camera sees it.

::: solution
$\iota = 2\,\mathrm{arccot}\,|\lambda|^{1/4}$. For 194, $|\lambda|^{1/4} = 3.73 = \cot 15°$, so $\iota = 30°$, and the
anticlockwise helicity $+2$ dominates. For 1, $\iota = 90°$: edge-on, turning neither way. For 0.0625, $|\lambda|^{1/4}
= 0.5$ and $\iota = 127°$, and the clockwise helicity dominates.
:::

**[9.5]** Two images of one steady source overlap in frequency. If their separation falls from $10^{-4}$ to $10^{-5}$,
by what factor must $\rho$ grow to read the separation to the same fraction, and the amplitudes to the same precision?

::: solution
The fractional error of the separation goes as $1/(\rho\delta^2)$, so $\rho$ must grow 100 times; the amplitudes' error
goes as $1/(\rho\delta^3)$, so for them 1000 times.
:::

**[9.5]** Two uncorrelated sources have the same circular fraction $\mu$. Show that any combination $\mathbf x =
a\mathbf x_1 + b\mathbf x_2$ solves $C_V\mathbf x = \mu C_I\mathbf x$, and say what the pixel then finds.

::: solution
$C_V\mathbf x = aC_V\mathbf x_1 + bC_V\mathbf x_2 = \mu(aC_I\mathbf x_1 + bC_I\mathbf x_2) = \mu C_I\mathbf x$. Then
$C_I\mathbf x = a\sqrt{I_1}\mathbf q_1 + b\sqrt{I_2}\mathbf q_2$, a mixture of the two steering vectors, which is no
single direction: the pixel finds the plane of the two sources but not each.
:::

### The camera

**[9.5]** Show that for $N = 2$, $L = 1$ and $s = 2$ the Prony equations ask for a singular $3\times3$ Hankel table,
and check the count of unknowns for light at one frequency.

::: solution
For $N = 2$, $s = 2$ the equations $y_j p_0 + y_{j+1}p_1 + y_{j+2} = 0$ for $j = 0, 1, 2$ have a solution only if the
table with rows $(y_0, y_1, y_2)$, $(y_1, y_2, y_3)$, $(y_2, y_3, y_4)$ is singular. Light at one frequency, with $N =
2$: two directions and four amplitudes, six unknowns, against six numbers recorded; with $N = 3$, nine against six.
:::
:::

::: paper
- Section VIII's [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point): the pencil, the two
  conics, the count, and the uncorrelated sources.
- Section VIII's [*Lensed images at one point*](/paper/#par:lensed-images-at-one-point): the cells and the arcsecond's
  $2\times10^5$.
- Appendix C's [*The count of waves*](/paper/#par:the-count-of-waves): the proof of the count.
:::

::: deeper
- S. Kunis, T. Peter, T. Römer and U. von der Ohe, *Linear Algebra and its Applications* 490, 31 (2016): Prony's
  method with Hankel tables.
- J. J. Sylvester, *Philosophical Magazine* 2, 391 (1851): when a binary quartic is a sum of two fourth powers.
- A. Nehorai and E. Paldi, *IEEE Transactions on Signal Processing* 42, 376 (1994): direction finding with a sensor of
  all six numbers of light.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII,
    [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point) and
    [*Lensed images at one point*](/paper/#par:lensed-images-at-one-point), with Figure [](/paper/#fig:voices), the
    pencil identity [](/paper/#eq:pencil), the two conics [](/paper/#eq:four-waves), the count [](/paper/#eq:wave-count)
    and the cells; the proof of the count is in Appendix C, [](/paper/#eq:proof-prony).

[^triple-root]: That reading is section 9.4's type III. It sends $(-i, 1, 0)$ to zero, a null vector, and its quadratic
    is $2iz^2$.

[^infinity]: A wave travelling along $-\hat z$ sits at $z = \infty$, where [](#eq:triple) does not apply. Turning the
    axes first moves every wave to a finite $z$.

[^map]: In section 9.1's components, for example, $y_0 = c_2/2$.

[^spin-s]: The product of $s$ factors $\vect m(z)\cdot\vect m(z_a) = -2(z - z_a)^2$ gives $(-2)^s(z - z_a)^{2s}$, a
    polynomial of degree $2s$ with $2s + 1$ coefficients.

[^generic]: The tables of the $y_{j+k}$ of the snapshots, stacked, must have rank $N$ for $p$ to be unique.

[^hankel]: Both sides are the degree-three invariant of a binary quartic, Sylvester's catalecticant.

[^IV]: The letter $I_a$, with its index, is one source's brightness, not the invariant $I = \mathrm{tr}\,\curv{\mathcal
    W}^2$ of section 9.2.

[^closed]: The fractions are the roots of a polynomial of degree five, which has no general formula; linear algebra alone
    finds them.

[^rho]: Tilting a wave by one radian changes its reading by about its own size, so by the Cramér–Rao bound of section 3.3
    a direction is known to about the noise over the signal, $1/\rho$.

[^chirp]: The quadrupole formula's rate $\dot f = \tfrac{96}{5}\pi^{8/3}(G\mathcal M/c^3)^{5/3}f^{11/3}$ for a chirp
    mass $\mathcal M$ of 1.2 solar masses, stated (M. Maggiore, *Gravitational Waves*, vol. 1, Oxford, 2008, section 4.1).
