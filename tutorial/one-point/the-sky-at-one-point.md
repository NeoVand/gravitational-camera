---
id: '9.6'
title: 'The sky at one point'
question: 'Section VIII says that one pixel "measures 68 numbers that describe the brightness and polarization of the whole sky at each frequency, among them whether the sky as a whole has a handedness". Which 68 numbers does one pixel read from a sky of independent sources, and what can it never see?'
part: '9'
requires: ['2.2', '3.2', '7.6', '9.1', '9.4', '9.5']
paper: [sec:one-pixel, eq:pixel-kernel, eq:sky-count, eq:sky-witness, fig:sky-count, sec:no-lens, fig:array, sec:near-field, sec:conclusion]
figures: [fig:sky-count, fig:array]
live: [array, sky]
depth: A
---

Chapter 9.5 separated up to four waves at one pixel by following their waveforms, and up to five independent
sources by their averages. A real sky may hold thousands of sources at once, such as the binaries of a galaxy, all
humming in the same band of frequencies, and no timing separates them.

Section VIII's overview answers that one pixel "measures 68 numbers that describe the brightness and polarization of
the whole sky at each frequency, among them whether the sky as a whole has a handedness". Which 68 numbers does one
pixel read from a sky of independent sources, and what can it never see? The answer fixes the sharpness of the
single pixel's picture, the curve of the paper's Figure [](/paper/#fig:array) that chapter 0.4 quoted as a blur of
52°. We answer with chapter [2.2](/tutorial/outside/spherical-harmonics/)'s spherical harmonics, chapter
[3.2](/tutorial/noise/random-signals/)'s spectrum, chapter [7.6](/tutorial/geometry/gravitational-waves/)'s projector,
chapter [9.1](/tutorial/one-point/spin-two/)'s helicities and spin weight, chapter [9.4](/tutorial/one-point/petrov/)'s
complex number for a direction, and the steering vectors of [chapter 9.5](/tutorial/one-point/separating-waves/).

::: plain
Imagine a sky full of independent sources of gravitational waves, all at the same frequency. One pixel cannot
follow any of them, but it can average. The averages it can form are the mean products of its ten numbers, taken in
pairs: one hundred averages in all.

Each average weighs the sky by a pattern that changes smoothly with direction, and none of these patterns is finer
than the spherical harmonics of degree four. So the pixel sees the sky's brightness only in its 25 coarsest
patterns, and the same for the difference between the two senses of turning. It sees the sky's linear polarization
only through 9 patterns of degree four, each two numbers. That makes 25 + 25 + 18 = 68. The other 32 averages are
zero for every sky of waves, so they test the instrument.

As a result, twelve sources at the corners of an icosahedron look to the pixel exactly like a uniform sky, and the
pixel's picture of a single source is a blob about 52° wide.
:::

## The pixel's spectral matrix splits into three blocks by helicity

We want the numbers a pixel can learn from a sky of many sources. We assume that **the sources are independent**: each
has a random waveform, and the average of a product of the waves of two different sources is zero. Then, in averages of
products of the pixel's numbers, each source's own wave survives and the cross terms between sources average away.

We split the record into many stretches, each many periods long, and take from each stretch the complex amplitudes
at one angular frequency $\omega$: chapter
[9.1](/tutorial/one-point/spin-two/#the-sign-of-the-frequency-gives-the-helicity)'s tables $\tilde{\curv\tE}$ and
$\tilde{\curv\tB}$, in $\mathrm{s^{-2}}$, each written as five numbers in chapter
[1.5](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length)'s
orthonormal basis. That is ten complex numbers per stretch, a column $\mathbf x$. The **spectral matrix** is the
$10\times10$ table of their mean products over the stretches,

$$\sym{spectral-matrix}{C} = \langle\mathbf x\,\mathbf x^\dagger\rangle ,$$

in $\mathrm{s^{-4}}$, the covariance matrix of chapter
[3.1](/tutorial/noise/probability/#covariance-describes-noise-that-two-readings-share) for complex
amplitudes.[^spectrum] It is **Hermitian**, $C^\dagger = C$, because swapping the two factors conjugates the product.
So its ten diagonal entries are real, and the 45 entries above them are complex and fix those below: $10 + 2\times45 =
100$ real numbers.

**Helicity coordinates.** Chapter 9.1 wrote the reading of one frequency as $\curv{\mathcal W}(t) = \curv{\mathcal
W}_+e^{-i\omega t} + \curv{\mathcal W}_-e^{i\omega t}$. Putting $\curv\tE(t) = \tfrac12\tilde{\curv\tE}e^{-i\omega t}
+ \tfrac12\tilde{\curv\tE}^*e^{i\omega t}$, and the same for $\curv\tB$, into $\curv{\mathcal W} = \curv\tE +
i\curv\tB$ and collecting the two exponentials gives

$$\curv{\mathcal W}_+ = \tfrac12\bigl(\tilde{\curv\tE} + i\tilde{\curv\tB}\bigr), \qquad \curv{\mathcal W}_-^* =
\tfrac12\bigl(\tilde{\curv\tE} - i\tilde{\curv\tB}\bigr) .$$

Adding and subtracting undoes the mixture, $\tilde{\curv\tE} = \curv{\mathcal W}_+ + \curv{\mathcal W}_-^*$ and
$\tilde{\curv\tB} = -i(\curv{\mathcal W}_+ - \curv{\mathcal W}_-^*)$, so the column $(\mathbf w_+, \mathbf
w_-^*)$, with $\mathbf w_\pm$ the five numbers of $\curv{\mathcal W}_\pm$, says as much as $\mathbf x$. By
chapter 9.1, a wave arriving from the direction $\hat n$ has $\curv{\mathcal W}_\pm = \curv\alpha^\pm\,\vect
m\vect m^{\mathsf T}$, with its helicity amplitudes $\curv\alpha^\pm$ and 9.1's unit null vector $\vect m$ of its
direction of travel $\hat k = -\hat n$ (9.4's $\vect m(z)$ is not of unit length). In the orthonormal basis $\vect
m\vect m^{\mathsf T}$ is chapter 9.5's steering vector $\sym{steering-vector}{\mathbf q}(\hat n)$, five numbers of
length one.[^v] So $\mathbf w_\pm = \sum_a\curv\alpha^\pm_a\mathbf
q_a$, summed over the sources $a$, and independence leaves

$$\begin{aligned}
C_+ &= \langle\mathbf w_+\mathbf w_+^\dagger\rangle = \sum_a\langle|\curv\alpha^+_a|^2\rangle\,\mathbf q_a\mathbf
q_a^\dagger ,\\
C_- &= \langle\mathbf w_-\mathbf w_-^\dagger\rangle = \sum_a\langle|\curv\alpha^-_a|^2\rangle\,\mathbf q_a\mathbf
q_a^\dagger ,\\
C_{+-} &= \langle\mathbf w_+\mathbf w_-^{\mathsf T}\rangle = \sum_a\langle\curv\alpha^+_a\curv\alpha^-_a\rangle\,\mathbf
q_a\mathbf q_a^{\mathsf T} .
\end{aligned}$$

The spectral matrix of the column $(\mathbf w_+, \mathbf w_-^*)$ has $C_+$ at its upper left, $C_-^*$ at its lower
right, $C_{+-}$ at its upper right and the conjugate transpose of $C_{+-}$ at its lower left. These are the paper's
**helicity blocks**: 25 real numbers in each Hermitian block and 50 in the complex $C_{+-}$.

**What the blocks hold.** Chapter
[5.4](/tutorial/waves/polarization/#four-numbers-describe-a-polarization-and-two-of-them-do-not-depend-on-the-axes)
described a wave by four **Stokes parameters** built from its two helicities: the brightness $I$, its total strength;
the circular polarization $V$, the anticlockwise part minus the clockwise part, as the camera sees them; and the pair
$Q$, $U$ of the linear polarization, which a turn of the axes by $\theta$ multiplies, as $Q + iU$, by $e^{-4i\theta}$.
In the tide's units they are, for one wave,[^stokes]

$$\begin{gathered}I = |\curv\alpha^+|^2 + |\curv\alpha^-|^2, \qquad V = |\curv\alpha^+|^2 - |\curv\alpha^-|^2,\\
Q - iU = 2\curv\alpha^+\curv\alpha^- .\end{gathered}$$

For a sky we add up the sources in each small patch $\dd\Omega$ of directions and divide by its size. This gives the
sky's $\sym{sky-stokes}{I(\hat n)}$, $V(\hat n)$ and $(Q - iU)(\hat n)$, in $\mathrm{s^{-4}\,sr^{-1}}$, and the
blocks become integrals over the sky:

$$\boxed{\;\begin{aligned}
C_\pm &= \oint\tfrac12(I \pm V)\,\mathbf q\mathbf q^\dagger\,\dd\Omega ,\\
C_{+-} &= \oint\tfrac12(Q - iU)\,\mathbf q\mathbf q^{\mathsf T}\,\dd\Omega .
\end{aligned}\;} \label{eq:blocks}$$

The block $C_{+-}$ is **complex symmetric**, because $\mathbf q\mathbf q^{\mathsf T}$ is, and chapter 9.5's two
tables are $C_I = C_+ + C_-$ and $C_V = C_+ - C_-$.

<!-- diagram: sky-spectral-blocks — The pixel's 10×10 spectral matrix in the helicity coordinates (w₊, w₋*), drawn as
a square of four 5×5 blocks. Upper left C₊, filled, labelled "½(I + V): 25"; lower right C₋* (the conjugate of
C₋), filled, "½(I − V): 25"; upper right C₊₋, split by a diagonal hatch into its symmetric part (15 complex entries,
of which 9 complex combinations are reached by the sky: "Q − iU at degree 4: 18", and 6 that stay zero: "checks: 12")
and its antisymmetric part (10 complex entries: "checks: 20"); lower left drawn faint, "conjugate transpose of
C₊₋: no new numbers". A bar under the square adds 25 + 25 + 18 = 68 in the sky's colour and 12 + 20 = 32 in grey.
Text in the panels kept to the labels; numbers exact. -->

## The pixel sees the sky only up to degree four: 68 numbers

We want to know which features of $I$, $V$ and $Q - iU$ reach the blocks of [](#eq:blocks).

**The paper's kernel.** Take first a sky of **unpolarized** sources, with $Q = U = V = 0$ (chapter 5.4). A wave from
$\hat n$ has the tide $\tilde{\curv\tE} = \tilde{\curv\tE}_+e^+ + \tilde{\curv\tE}_\times e^\times$, with 9.1's
polarization tables, and being unpolarized means that its two amplitudes have equal mean squares and an average
product of zero. Chapter
[9.1](/tutorial/one-point/spin-two/#a-plane-wave-fills-only-the-extreme-weight-so-its-reading-is-a-square) used $\vect
m\vect m^{\mathsf T} = \tfrac12(e^+ + ie^\times)$ to rewrite this tide as $(\tilde{\curv\tE}_+ -
i\tilde{\curv\tE}_\times)\,\vect m\vect m^{\mathsf T} + (\tilde{\curv\tE}_+ + i\tilde{\curv\tE}_\times)\,\vect
m^*\vect m^{*\mathsf T}$. Comparing this with $\tilde{\curv\tE} = \curv{\mathcal W}_+ + \curv{\mathcal W}_-^*$ gives
$\curv\alpha^+ = \tilde{\curv\tE}_+ - i\tilde{\curv\tE}_\times$ and $\curv\alpha^{-*} = \tilde{\curv\tE}_+ +
i\tilde{\curv\tE}_\times$. So the brightness is $2(|\tilde{\curv\tE}_+|^2 + |\tilde{\curv\tE}_\times|^2)$, each mean
square is a quarter of it, and the tide's part of the spectral matrix is

$$\langle\tilde{\curv\tE}_{ij}\tilde{\curv\tE}^*_{kl}\rangle = \oint\tfrac14I(\hat n)\sum_{A=+,\times}e^A_{ij}e^A_{kl}\,\dd\Omega ,$$

and the sum is the paper's kernel:

{{paper eq:pixel-kernel}}

We derive it from 7.6. The tables $e^+/\sqrt2$ and $e^\times/\sqrt2$ have length one and are orthogonal, and every
symmetric table across $\hat n$ with no trace is a combination of them. So for any symmetric table $X$,
$\tfrac12\sum_Ae^A(e^A\!:\!X)$ keeps the part of $X$ across $\hat n$ without trace and removes the rest, which is what
chapter [7.6](/tutorial/geometry/gravitational-waves/#one-projector-keeps-what-a-wave-can-carry)'s projector
$\sym{tt-projector}{\Lambda_{ij,kl}}$ does. Both four-index tables are symmetric in $k$ and $l$, so they agree:

$$\boxed{\;\begin{aligned}\sum_{A=+,\times}e^A_{ij}e^A_{kl} &= 2\Lambda_{ij,kl}\\ &= P_{ik}P_{jl} + P_{il}P_{jk} -
P_{ij}P_{kl} ,\end{aligned}\;}$$

with $P_{ij} = \delta_{ij} - \hat n_i\hat n_j$. **A check.** Contracting $i$ with $k$ and $j$ with $l$ gives
$2\times2 + 2 - 2 = 4$, the sum of $e^A\!:\!e^A = 2$ over the two polarizations, so the mean of
$\tilde{\curv\tE}\!:\!\tilde{\curv\tE}^*$ is $\oint I\,\dd\Omega$, the sky's total brightness. Each $P_{ij}$ holds terms
of degree 0 and 2 in the components of $\hat n$, so the kernel is a polynomial of degree four in them.

**Why degree four matters.** By chapter
[2.2](/tutorial/outside/spherical-harmonics/#there-are-2ell-1-patterns-of-each-degree)'s box, a polynomial of degree
four is, on the sky, a sum of spherical harmonics of degree four and below. By 2.2's
[orthogonality](/tutorial/outside/spherical-harmonics/#patterns-of-different-degree-are-orthogonal-and-every-pattern-is-a-sum-of-them),
an integral of $I$ against such a kernel therefore receives only the parts of $I$ of degree four and below.

**Brightness and circular polarization: 25 and 25.** The kernel is even in $\hat n$, but the helicity blocks also
see the odd degrees. Their entries contain $\mathbf q\mathbf q^\dagger$, built from $m_im_jm^*_km^*_l$, and
each pair is

$$m_im^*_k = \tfrac12\bigl(P_{ik} + i\epsilon_{ikp}\hat n_p\bigr) ,$$

because $\vect m\vect m^{*\mathsf T} = \tfrac12(\vect e_1\vect e_1^{\mathsf T} + \vect e_2\vect e_2^{\mathsf T}) -
\tfrac i2(\vect e_1\vect e_2^{\mathsf T} - \vect e_2\vect e_1^{\mathsf T})$, whose first bracket is $P_{ik}$ and whose
second has the entries $\epsilon_{ikp}\hat k_p$ (chapter
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise)), with $\hat k = -\hat n$. A
product of two such pairs is a polynomial of degree at most four, with odd terms of degree one and three. So $C_+$
receives the harmonics of $\tfrac12(I + V)$ of degree 0 to 4. A real pattern has $2\ell + 1$ real numbers in each
degree, which makes $1 + 3 + 5 + 7 + 9 = 25$, as many as $C_+$ holds. We state without proof that the match is one to
one: by the rule for adding two angular momenta (in any text on quantum mechanics), a table of two spin twos splits
under turns into one part of each degree from 0 to 4. The count below checks it. The same holds for $C_-$ and
$\tfrac12(I - V)$: 25 numbers each of $I$ and $V$.

**Where the odd degrees show up.** The kernel is $4\,\mathrm{Re}(m_im_jm^*_km^*_l)$, and its partner, the real
table $H_{ijkl} = 4\,\mathrm{Im}(m_im_jm^*_km^*_l)$, is odd in $\hat n$, because reversing $\hat n$ turns $\vect m$
into its conjugate, up to a phase that cancels. A wave of helicity $+2$ has $\tilde{\curv\tE} = \curv\alpha^+\vect
m\vect m^{\mathsf T}$ and, by chapter 9.1, $\tilde{\curv\tB} = -i\tilde{\curv\tE}$; one of helicity $-2$ has
$\tilde{\curv\tE} = \curv\alpha^{-*}\vect m^*\vect m^{*\mathsf T}$ and $\tilde{\curv\tB} = i\tilde{\curv\tE}$.
Multiplying out and adding the sources gives

$$\begin{aligned}
\langle\tilde{\curv\tE}_{ij}\tilde{\curv\tE}^*_{kl}\rangle &= \oint\tfrac14\Bigl(I\sum_Ae^A_{ij}e^A_{kl} +
iV\,H_{ijkl}\Bigr)\dd\Omega ,\\
\langle\tilde{\curv\tE}_{ij}\tilde{\curv\tB}^*_{kl}\rangle &= \oint\tfrac14\Bigl(iV\sum_Ae^A_{ij}e^A_{kl} -
I\,H_{ijkl}\Bigr)\dd\Omega .
\end{aligned}$$

So the tide alone sees the even degrees of $I$ and the odd degrees of $V$. The correlations of the tide with the
magnetic part see the rest: the odd degrees of $I$ and the even degrees of $V$, among them the handedness of the next
section.[^even] In every entry $I$ is real and $V$ imaginary: the paper's statement that the two "never mix
at one pixel: one lies in the real part of the spectral matrix, the other in its imaginary part".

**Linear polarization: 18, at degree four alone.** The entries of $C_{+-}$ contain $\mathbf q\mathbf q^{\mathsf T}$,
built from four copies of $\vect m$ and none of $\vect m^*$. So all that $C_{+-}$ can hold is the table

$$\oint\tfrac12(Q - iU)\,m_im_jm_km_l\,\dd\Omega ,$$

which is symmetric in its four indices and has no trace, since $\vect m\cdot\vect m = 0$. Such a table has $2\times4
+ 1 = 9$ complex components (chapter 2.2's count with $\ell = 4$), so $C_{+-}$ holds at most 18 real numbers of the
sky.

Here $Q - iU$ is not an ordinary function on the sky. Turning $\vect e_1$, $\vect e_2$ by $\psi$ multiplies it by
$e^{4i\psi}$ and $m_im_jm_km_l$ by $e^{-4i\psi}$, so only their product stays fixed, and $Q - iU$ has spin weight
four. Its degree means the degree of chapter
[9.1](/tutorial/one-point/spin-two/#on-the-sky-a-quantity-of-spin-weight-s-begins-at-degree-s)'s spin-weighted
patterns, which begin at degree four. We state that the pixel receives the linear polarization at degree four alone,
in nine patterns: the table's nine components leave room for one degree, and the lowest is four. Together, the
paper's count:

{{paper eq:sky-count}}

**The other 32.** The antisymmetric part of $C_{+-}$, ten complex entries, is zero for every sky, since $\mathbf
q\mathbf q^{\mathsf T}$ is symmetric. Of the fifteen complex entries of its symmetric part, the sky reaches only nine
combinations. That leaves $20 + 12 = 32$ real numbers that vanish for any sky of waves; noise, a near field or a
miscalibration can fill them, so they are checks. A numerical count confirms the split: single waves from 500 random
directions, in four states of polarization each, span 25 real dimensions of $C$ for the brightness, 25 for the
circular polarization and 18 for the linear polarization. The 68th singular value is 0.02 of the largest, and the 69th
is $2\times10^{-16}$ of it, rounding error.

{{paper fig:sky-count}}

## One pixel tells whether the sky has a handedness

We want one number of the 68 that says whether the sky prefers one sense of turning. The sky is **chiral**, or has a
handedness, if its total circular polarization $\oint V\,\dd\Omega$ is not zero.

For one wave, we write $\tilde{\curv\tE}$ and $\tilde{\curv\tB}$ in the helicity coordinates and contract the first
with the conjugate of the second:

$$\begin{aligned}
\tilde{\curv\tE}\!:\!\tilde{\curv\tB}^* &= i\bigl(\curv{\mathcal W}_+ + \curv{\mathcal W}_-^*\bigr)\!:\!\bigl(\curv{\mathcal
W}_+^* - \curv{\mathcal W}_-\bigr)\\
&= i\bigl(|\curv{\mathcal W}_+|^2 - |\curv{\mathcal W}_-|^2\bigr)\\
&\quad + i\bigl(\curv{\mathcal W}_-^*\!:\!\curv{\mathcal W}_+^* - \curv{\mathcal W}_+\!:\!\curv{\mathcal W}_-\bigr) .
\end{aligned}$$

The last bracket vanishes, because
$\curv{\mathcal W}_+\!:\!\curv{\mathcal W}_- = \curv\alpha^+\curv\alpha^-(\vect m\cdot\vect m)^2 = 0$. With
$|\vect m\vect m^{\mathsf T}| = 1$, what is left is $i(|\curv\alpha^+|^2 - |\curv\alpha^-|^2) = iV$. In the same way
$\tilde{\curv\tE}\!:\!\tilde{\curv\tE}^* = |\curv\alpha^+|^2 + |\curv\alpha^-|^2 = I$. Both contractions are unchanged
by turns, so they do not depend on the wave's direction.
Independent waves add them, so for every sky of independent waves

$$\boxed{\;\begin{aligned}\mathrm{Im}\,\langle\tilde{\curv\tE}\!:\!\tilde{\curv\tB}^*\rangle &= \oint V\,\dd\Omega,\\
\langle\tilde{\curv\tE}\!:\!\tilde{\curv\tE}^*\rangle &= \oint I\,\dd\Omega .\end{aligned}\;} \label{eq:handedness}$$

For an isotropic sky, the same in every direction, the ratio is the circular fraction $V/I$ itself, and that is the
paper's statement: such a sky "puts exactly $(V/I)\langle\tE\!:\!\tE^*\rangle$ into the imaginary part of
$\langle\tE\!:\!\tB^*\rangle$". The box itself holds for any sky of independent sources. **Limits.** An unpolarized sky
gives 0, and a sky of helicity $+2$ alone, for which $\tilde{\curv\tB} = -i\tilde{\curv\tE}$, gives 1.

A single interferometer cannot do this. If it is small against the wavelength, it records one real combination
$D_{ij}\curv\tE_{ij}$ of the tide, with fixed real weights $D_{ij}$ set by its arms. The mean square of its amplitude
then holds $V$ only through $D_{ij}D_{kl}H_{ijkl}$. That is zero, because swapping the pairs $ij$ and $kl$ conjugates
$m_im_jm^*_km^*_l$ and so reverses the sign of $H$. Seto and Taruya showed that, for an isotropic sky,
even two interferometers far apart cannot measure it if their arms lie in one plane [@SetoTaruya2007]. One pixel
reads it in one number.[^lisa]

## A sky obeys an inequality that a standing wave breaks

We want to know whether every Hermitian table could come from some sky. A Hermitian table $C$ is **positive** if all
its eigenvalues are zero or more, which means $\mathbf y^\dagger C\mathbf y \ge 0$ for every column $\mathbf y$. Every
spectral matrix is positive, because $\mathbf y^\dagger C\mathbf y = \langle|\mathbf y^\dagger\mathbf x|^2\rangle$.
Within one helicity, [](#eq:blocks) says that a sky gives $C_+ = \oint\tfrac12(I + V)\,\mathbf q\mathbf
q^\dagger\,\dd\Omega$ with $\tfrac12(I + V) \ge 0$. Sums of such tables with positive weights form a **convex
cone**, a set closed under adding and under multiplying by positive numbers, and it is smaller than the set of all
positive Hermitian tables. A **witness** is an inequality that every member of the cone obeys and some positive table
breaks.

The paper's witness uses the five numbers $\mathbf u$ of the real table $\mathrm{diag}(1, -1, 0)/\sqrt2$, 9.1's $e^+$
about $\hat z$ at unit length. A single wave turns, so its table $\vect m\vect m^{\mathsf T} = \tfrac12(e^+ +
ie^\times)$ mixes $e^+$ and $e^\times$ a quarter period apart, and we expect at most half of it to lie along a fixed
real pattern. For a wave travelling along chapter
[9.4](/tutorial/one-point/petrov/#a-direction-on-the-sky-is-a-complex-number)'s direction $\hat k(z)$, 9.4's vector
$\vect m(z) = (1 - z^2, i(1 + z^2), -2z)$ does not have unit length, so the steering vector is $\vect m(z)\vect
m(z)^{\mathsf T}/|\vect m(z)|^2$. Its product with $\mathbf u$ is $(m_1^2 - m_2^2)/(\sqrt2\,|\vect m|^2)$, and with
9.4's $|\vect m(z)|^2 = 2(1 + |z|^2)^2$,

$$\mathbf u^\dagger\mathbf q = \frac{(1 - z^2)^2 + (1 + z^2)^2}{2\sqrt2\,(1 + |z|^2)^2} = \frac{1 +
z^4}{\sqrt2\,(1 + |z|^2)^2} .$$

Since $|1 + z^4| \le 1 + |z|^4 \le (1 + |z|^2)^2$, every wave has $|\mathbf u^\dagger\mathbf q|^2 \le \tfrac12$, with
equality only at $z = 0$ and $z \to \infty$, the waves along $\pm\hat z$. A wave along $\hat x$, at $z = 1$, gives
$\tfrac18$. Integrating over the sky, with $\mathrm{tr}\,C_+ = \oint\tfrac12(I + V)\,\dd\Omega$ because $\mathbf
q^\dagger\mathbf q = 1$,

$$\boxed{\;\begin{aligned}\mathbf u^\dagger C_+\,\mathbf u &= \oint\tfrac12(I + V)\,|\mathbf u^\dagger\mathbf
q|^2\,\dd\Omega\\ &\le \tfrac12\,\mathrm{tr}\,C_+ ,\end{aligned}\;}$$

the paper's equation, written for either helicity block:

{{paper eq:sky-witness}}

**A table that is no sky.** Take two waves of helicity $+2$ with the same amplitude $\curv\alpha$, one along $+\hat z$
and one along $-\hat z$. Their unit null vectors are $(1, i, 0)/\sqrt2$ and its conjugate, so their steering vectors
$\mathbf q_1$ and $\mathbf q_2$ are orthogonal, and $\vect m\vect m^{\mathsf T} + \vect m^*\vect m^{*\mathsf T} =
\mathrm{diag}(1, -1, 0)$ gives $\mathbf q_1 + \mathbf q_2 = \sqrt2\,\mathbf u$. If the two waves are independent, $C_+ =
|\curv\alpha|^2(\mathbf q_1\mathbf q_1^\dagger + \mathbf q_2\mathbf q_2^\dagger)$ and $\mathbf u^\dagger C_+\mathbf u =
|\curv\alpha|^2 = \tfrac12\mathrm{tr}\,C_+$: they sit exactly on the bound. If they are locked in phase, $\mathbf w_+ =
\sqrt2\,\curv\alpha\,\mathbf u$ and $C_+ = 2|\curv\alpha|^2\,\mathbf u\mathbf u^\dagger$, so $\mathbf u^\dagger
C_+\mathbf u = \mathrm{tr}\,C_+$: the cross terms double the left side, to twice the bound. Two equal waves moving in
opposite directions in step make a **standing wave** (chapter 5.1). A pixel that finds the witness broken has found
coherence, a near field or a miscalibration, not a sky of independent waves.

## Twelve sources look to the pixel like a uniform sky

We want the skies that the pixel cannot tell apart. Every entry of $C$ is an integral of $I$ or $V$ against a
polynomial of degree four or less in $\hat n$, or of $Q - iU$ against $m_im_jm_km_l$. Two skies that agree in all such
integrals give the same spectral matrix.

A **spherical design** of degree $t$ is a set of points on the sphere whose average of every polynomial of degree
$t$ or less equals the polynomial's average over the whole sphere. The twelve corners of a regular icosahedron are a
design of degree five [@Delsarte1977]. **A check.** The polynomial $\hat n_x^4 + \hat n_y^4 + \hat n_z^4$ averages
$3\times\tfrac15 = 0.6$ over the sphere, and 0.6 over the twelve corners, but 1 over the six corners of an
octahedron, each of which has one component $\pm1$. The octahedron is a design of degree three only.

Twelve equal, unpolarized, independent sources at the corners of an icosahedron give exactly the spectral matrix of a
uniform sky of the same total brightness, and six at the corners of an octahedron do not. The uniform sky gives each of
the tide's five orthonormal components the mean square $\tfrac15\oint I\,\dd\Omega$. The octahedron, with its sources on
the axes, gives $\tfrac14$ of it to the two diagonal components and $\tfrac16$ to the three off-diagonal ones.

Two things tell the skies apart. Sources that are not Gaussian have fourth moments, means of products of four
numbers, whose kernels have degree eight, which no icosahedron averages. And two pixels a distance $\Delta\mathbf x$
apart correlate with the phase $e^{i\omega\hat n\cdot\Delta\mathbf x/c}$, which is not a polynomial and which no
finite design averages exactly. We state both.

::: try {#sky}
The paper's sky at one pixel: a sky of sources you choose, and the picture of its brightness that one pixel can make,
from its harmonics of degree four and below. Predict first: will twelve equal sources at the corners of an
icosahedron give the pixel a different picture from a uniform sky? Choose *Twelve*, then *Uniform*, and compare. Then
choose *Six*, the corners of an octahedron, and say what has changed and why. Last, choose *Two* and compare the width
of each source's blob with Figure [](/paper/#fig:array)'s single pixel.
:::

## A single pixel's picture of the sky is blurred over 52°

We want the picture of the sky's brightness that one pixel can make. The pixel fixes exactly the coefficients
$a_{\ell m}$ of $I$ with $\ell \le 4$ (chapter 2.2's expansion) and nothing else. The picture that claims no more than
the data keeps those 25 and sets the rest to zero:

$$I_{\rm pic}(\hat n) = \sum_{\ell=0}^{4}\sum_{m=-\ell}^{\ell}a_{\ell m}Y_{\ell m}(\hat n) ,$$

the projection of the sky onto the harmonics of degree four and below. Every other sky with the same data adds
orthogonal patterns of higher degree, so $I_{\rm pic}$ has the least $\oint I^2\,\dd\Omega$ of them all. The paper calls
it "the best linear estimate of the sky from the pixel's data".

For one point source of total brightness $I_0$ in the direction $\hat n_0$, the coefficients are $a_{\ell m} =
I_0Y^*_{\ell m}(\hat n_0)$, by 2.2's rule for them. Chapter
[2.2](/tutorial/outside/spherical-harmonics/#the-addition-theorem-turns-a-sum-over-m-into-one-legendre-polynomial)'s
addition theorem turns each sum over $m$ into $(2\ell + 1)P_\ell(\cos\vartheta)/4\pi$, with $\vartheta$ the angle
from the source and $P_\ell$ Legendre's polynomial of degree $\ell$, always written here with its index, unlike the
projector $P_{ij}$. At $\vartheta = 0$ every $P_\ell$ is 1 and the picture is $25I_0/4\pi$. Dividing by that,

$$\boxed{\;\sym{pixel-picture}{K(\vartheta)} = \frac1{25}\sum_{\ell=0}^{4}(2\ell + 1)\,P_\ell(\cos\vartheta) .\;}
\label{eq:picture}$$

**Numbers.** The picture falls to one half at $\vartheta = 25.8°$, a full width at half height of $51.6°$, the "some
fifty degrees" of the paper's caption and chapter 0.4's 52°. It crosses zero at $43.9°$ and dips to $-0.152$ at $59.5°$,
the caption's "negative, as it is sixty degrees off". Behind the source it rises to $K(180°) = (1 - 3 + 5 - 7 + 9)/25 =
0.2$. **Checks.** At the source $K$ is 1. The picture $I_{\rm pic}$ integrates over the sky to $I_0$, because only
degree zero survives the integral. **For comparison**, a point sensor of light sees degrees up to two, and its picture,
$\sum_{\ell\le2}(2\ell + 1)P_\ell/9$, is $88.5°$ wide; arrays 2, 5 and 30 wavelengths wide give $29.8°$, $11.8°$ and
$1.97°$ (chapter [5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)).

The dip and the bump behind are not in the sky. They are what any sum cut off at degree four does to a point, and
they can be negative because the picture is an estimate, not a power.

{{paper fig:array}}

<!-- diagram: single-pixel-picture — K(ϑ) of eq:picture against ϑ from 0° to 180°, one solid curve, with a thin
horizontal line at zero. Marked: the half height at ϑ = 25.8° (a short bracket labelled "51.6° full width"), the first
zero at 43.9°, the dip −0.152 at 59.5° (labelled "−0.15 at 60°"), the later zeros at 80.4°, 116.5° and 152.3°, and the
value 0.2 at 180°. A dashed curve for light's Σ_{ℓ≤2}(2ℓ+1)P_ℓ/9 (full width 88.5°) for comparison. All marks exact. -->

::: try {#array}
Predict first: will the single pixel's curve be wider or narrower than that of an array two wavelengths wide, and by
how much? Then drag the slider to its left end, the single pixel, and read its width; drag it to two wavelengths
and compare. Notice that only the single pixel's curve goes below zero.
:::

::: check
### Q

Of the hundred real numbers of one pixel's spectral matrix, how many carry the sky, and what are the others for?

### A

Sixty-eight carry the sky: 25 of the brightness, 25 of the circular polarization and 18 of the linear polarization.
The other 32 vanish for every sky of independent gravitational waves, so they test the instrument.

### Q

Why does the pixel see the sky's brightness only up to degree four?

### A

Every entry of the spectral matrix integrates the brightness against a polynomial of degree four or less in the
direction, and harmonics of degree five and higher are orthogonal to all such polynomials.

### Q

How wide is a single pixel's picture of one source, and why may it be negative?

### A

Its full width at half height is 51.6°. It is the source's sum of harmonics cut off at degree four, an estimate rather
than a power, and such a sum dips to −0.15 near 60°.
:::

**The idea to keep: a sky of independent sources reaches one pixel only through its harmonics of degree four and
below, 25 numbers of the brightness, 25 of the circular polarization and 18 of the linear polarization. So one
pixel sees the sky's handedness, cannot tell an icosahedron of sources from a uniform sky, and pictures a point as a
blob 52° wide.**

::: problems
### Practice

A point sensor of a transverse field of spin three, with two helicities, would read a $14\times14$ spectral matrix. How
many of its real numbers carry the sky, and how are they shared?

::: solution
Each Hermitian block is $7\times7$, with kernels of degree up to six: $1 + 3 + 5 + 7 + 9 + 11 + 13 = 49$ numbers each,
for $I + V$ and $I - V$. The linear polarization has spin weight six and enters at degree six only, as a trace-free
table of six indices with $2\times6 + 1 = 13$ complex components, 26 real. In all $49 + 49 + 26 = 124$ of 196, which
is $2(2s + 1)^2 + 2(4s + 1)$ with $s = 3$. The same rule gives light, with $s = 1$, its 28 of 36.
:::

### Stretch

Combine with chapter 5.4. The only source in the sky is a rotor seen at the inclination 60°. What does the pixel's ratio
$\mathrm{Im}\langle\tilde{\curv\tE}\!:\!\tilde{\curv\tB}^*\rangle/\langle\tilde{\curv\tE}\!:\!\tilde{\curv\tE}^*\rangle$
read?

::: solution
By [](#eq:handedness) the ratio is the sky's total $V$ over its total $I$ for any sky, and with one source that is the
rotor's own circular fraction. Chapter 5.4 found $V/I = 2\field h_+\field h_\times/(\field h_+^2 + \field h_\times^2) =
0.976$ at 60°.
:::

### The paper

Check the paper's [](/paper/#eq:pixel-kernel) by hand for $\hat n = \hat z$ in the entries $1111$, $1122$ and $1212$,
and show that its full contraction is 4.

::: solution
With $\hat n = \hat z$, $e^+ = \mathrm{diag}(1, -1, 0)$, $e^\times$ has 1 in the places $12$ and $21$, and $P_{ij}$ is
the table $\mathrm{diag}(1, 1, 0)$. Entry $1111$: the left side is $1\times1 + 0 = 1$, the right $1 + 1 - 1 = 1$. Entry
$1122$: the left side is $1\times(-1) + 0 = -1$, the right $P_{12}P_{12} + P_{12}P_{12} - P_{11}P_{22} = -1$. Entry
$1212$: the left side is $0 + 1\times1 = 1$, the right $P_{11}P_{22} + P_{12}P_{21} - P_{12}P_{12} = 1$. Contracting,
$P_{ii} = 2$ and $P_{ij}P_{ij} = 2$ give $2\times2 + 2 - 2 = 4$, which is $e^+\!:\!e^+ + e^\times\!:\!e^\times$.
:::
:::

::: paper
- Section VIII's [*What one pixel sees of the sky*](/paper/#par:what-one-pixel-sees-of-the-sky): the spectral matrix
  and its blocks, the paper's [](/paper/#eq:pixel-kernel) and its [](/paper/#eq:sky-count), the handedness, the paper's
  witness [](/paper/#eq:sky-witness), the icosahedron, and Figure [](/paper/#fig:sky-count), all derived here.
- [Section VII](/paper/#sec:no-lens), Figure [](/paper/#fig:array): the single pixel's curve, derived here.
- Section IV's [*The information in a near-field image*](/paper/#par:the-information-in-a-near-field-image): "twenty-five
  numbers of its brightness, sixty-eight with polarization, however sensitive it is".
- The [Conclusion](/paper/#sec:conclusion): "the sky's harmonics of degree four and below and none above".
:::

::: deeper
- B. Allen and A. C. Ottewill [@AllenOttewill1997] expand the brightness of a background in spherical harmonics and
  work out how a pair of detectors responds to each degree.
- N. Seto and A. Cooray [@SetoCooray2004] show that LISA's correlations at low frequencies reach the sky's harmonics
  up to degree four, the hexadecapole, as this chapter's kernels do.
- P. Delsarte, J. M. Goethals and J. J. Seidel, "Spherical codes and designs" [@Delsarte1977], define spherical
  designs and prove that the icosahedron's corners are one of degree five.
:::

[^spectrum]: The diagonal entries are proportional to chapter
    [3.2](/tutorial/noise/random-signals/#the-spectrum-says-how-the-noise-is-shared-among-frequencies)'s spectra of
    the ten records at $\omega$, and the off-diagonal ones are their cross-spectra.

[^v]: The paper writes $\mathbf v(\hat n)$ for $\mathbf q(\hat n)$ and $p(\hat n)$ for $\tfrac12(I + V)$; here
    $\mathbf v$ keeps chapter 9.5's meaning, and the letter $p$ is not used. Turning $\vect e_1$, $\vect e_2$ by
    $\psi$ multiplies $\mathbf q$ by $e^{-2i\psi}$ and each $\curv\alpha^\pm$ by $e^{2i\psi}$, so the products in the
    blocks do not depend on the choice.

[^stokes]: These are chapter 5.4's $I$, $V$ and $Q - iU$ times $\omega^4/2$, because 9.1's $\curv\alpha^+$ and
    $\curv\alpha^-$ are $\omega^2$ times 5.4's $\tilde{\field h}_{\rm a}$ and $\tilde{\field h}^*_{\rm c}$. The
    letters $I$ and $V$ here are the sky's, not 9.2's invariant; $Q$ and $U$ are not a moment or a quality factor.

[^even]: The paper's reason for the 25 numbers of $I$, its even kernel, gives only 15 of them; degrees 1 and 3
    come through $H$.

[^lisa]: LISA, moving on its orbit, sees the degrees one and three of $V$ but not the net $V$ (N. Seto, *Phys.
    Rev. Lett.* 97, 151101, 2006). The paper's "single planar interferometer" cites Seto and Taruya, whose result is
    for pairs.
