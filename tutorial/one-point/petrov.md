---
id: '9.4'
title: 'Principal null directions and the Petrov classification'
question: 'Section VIII says that "every reading has four directions of its own": for one plane wave "all four coincide on its direction of travel", for one body at rest "they fall in two pairs, on the line to the body and opposite it", and "where two or more bodies pull, they are four distinct points". What are these four directions, and how do they tell one wave, one body and many bodies apart?'
part: '9'
requires: ['1.4', '1.5', '1.5b', '6.1', '6.3', '6.6', '8.4', '9.1', '9.2', '9.3']
paper: [sec:one-pixel, eq:stars, eq:star-velocity, eq:moving-state, eq:contact, fig:stars, app:proofs, eq:proof-stars, eq:proof-midpoint, sec:vistas]
figures: [fig:stars]
live: [stars]
depth: A
---

The paper's Figure [](/paper/#fig:stars) draws special directions on the sky around one pixel as dots. For gravity, a
single wave puts four dots together on its direction of travel, and a mass at rest puts two on the line to it and two
opposite. The same mass moving across that line at $0.9c$ folds both pairs toward its motion, and two masses scatter
four dots over the sky. For light, every sky holds two.

{{paper fig:stars}}

Section VIII's paragraph [*Principal null directions*](/paper/#par:principal-null-directions) says that "every reading
has four directions of its own". What are these four directions, and how do they tell one wave, one body and many
bodies apart? The answer lets one reading say whether its field could come from a single body or a single wave, and it
gives a moving body's velocity, distance and mass. It builds on chapters [1.4](/tutorial/newton/tides/),
[1.5b](/tutorial/newton/complex-numbers/), [6.3](/tutorial/relativity/aberration/),
[6.6](/tutorial/relativity/maxwell-complex/), [8.4](/tutorial/quantum/spin/), [9.1](/tutorial/one-point/spin-two/),
[9.2](/tutorial/one-point/complex-symmetric/) and [chapter 9.3](/tutorial/one-point/the-matrix-w/).

::: plain
Every reading of the paper's pixel picks out four directions on the sky around it, the solutions of one equation of
the fourth degree. Some of them can coincide.

A single gravitational wave puts all four on its direction of travel. A single round body at rest puts two on the line
toward it and two pointing directly away. Two bodies give four separate directions in general, and fewer in special
arrangements, such as two bodies on one line through the pixel or two equal pulls at right angles. The pattern of the
four is called the field's Petrov type. The numbers that every observer agrees on, with a few products of the reading
with itself, tell the type without solving anything. The type belongs to the field and not to the bodies, so two
masses on one line look like one.

When the pixel moves, the four directions shift as rays of light do. For a moving body, the midpoint of its two pairs
is its velocity across the line of sight, as a fraction of the speed of light. How the reading changes in time then
gives the body's distance and its mass.
:::

## A direction on the sky is a complex number

We want one number for each direction around the pixel, because the four directions will be the roots of one
polynomial. The directions around a point form a sphere, the **celestial sphere**, and chapter
[6.6](/tutorial/relativity/maxwell-complex/#light-has-two-special-directions-where-gravity-has-four) labelled each of
them by a complex number $\sym{stereographic-z}{z}$, its **stereographic coordinate**, a pure number. In Part 9 the
letter $z$ is only this number, never a depth; the axis is written $\hat z$. For each $z$ the paper writes the complex
vector

$$\sym{null-vector-z}{\vect m(z)} = \bigl(1 - z^2,\ i(1 + z^2),\ -2z\bigr) ,$$

with no unit. It is null for every $z$, $\vect m(z)\cdot\vect m(z) = (1 - z^2)^2 - (1 + z^2)^2 + 4z^2 = 0$. By chapter
[9.1](/tutorial/one-point/spin-two/#the-square-holds-four-numbers-a-direction-and-one-complex-amplitude), a null vector
$\vect m$ belongs to a wave that travels along $\mathrm{Re}(i\vect m\times\vect m^*)/|\vect m|^2$, and for $\vect m(z)$
that direction is

$$\boxed{\;\sym{sky-direction}{\hat k(z)} = \dfrac{\bigl(2\,\mathrm{Re}\,z,\ 2\,\mathrm{Im}\,z,\ 1 -
|z|^2\bigr)}{1 + |z|^2}\;} \label{eq:direction}$$

(the box below works it out). Chapter 6.6 called this direction $\hat n(z)$ and stated it. We write $\hat k(z)$,
because it is a direction of travel, and keep $\hat n$ for the direction from the pixel toward a source.

::: derivation
### The direction of travel of $\vect m(z)$

With $\bar z$ the conjugate of the number $z$ (vectors keep the star), $\vect m(z)^* = (1 - \bar z^2,\ -i(1 + \bar
z^2),\ -2\bar z)$, and the third component of the cross product is

$$\begin{aligned}(\vect m\times\vect m^*)_3 &= -i\bigl[(1 - z^2)(1 + \bar z^2)\\ &\qquad + (1 + z^2)(1 - \bar
z^2)\bigr]\\ &= -2i\bigl(1 - |z|^4\bigr),\end{aligned}$$

and in the same way the first is $-2i(z + \bar z)(1 + |z|^2)$ and the second $-2(z - \bar z)(1 + |z|^2)$. With $z +
\bar z = 2\,\mathrm{Re}\,z$ and $z - \bar z = 2i\,\mathrm{Im}\,z$, multiplying by $i$ gives $4\,\mathrm{Re}\,z\,(1 +
|z|^2)$, $4\,\mathrm{Im}\,z\,(1 + |z|^2)$ and $2(1 - |z|^2)(1 + |z|^2)$. Chapter 6.6 found $|\vect m(z)|^2 = 2(1 +
|z|^2)^2$, and dividing gives [](#eq:direction).
:::

**Checks.** The directions of $z = 0$, $1$ and $i$ are $+\hat z$, $+\hat x$ and $+\hat y$, $z \to \infty$ gives
$-\hat z$, and the circle $|z| = 1$ is the equator. The third component is $\cos\vartheta = (1 - |z|^2)/(1 + |z|^2)$,
with $\vartheta$ the angle from $+\hat z$, and the angle of $z$ in the complex plane is the azimuth $\varphi$ about
$\hat z$, so by the half-angle formula

$$|z| = \tan\frac\vartheta2, \qquad \arg z = \varphi .$$

**The opposite direction.** Multiplying out each component gives $\vect m(-1/\bar z) = -\vect m(z)^*/\bar z^2$,
and conjugating $\vect e_1 + i\vect e_2$ reverses its direction of travel, $\vect e_1\times(-\vect e_2) = -\hat k$. So
the direction opposite to $z$ is $-1/\bar z$ (Figure [](#fig:stereographic)). For $z = 1$ it is $-1$, the direction
$-\hat x$.

**Two directions.** We multiply out the product of two of these vectors,

$$\begin{aligned}\vect m(z_1)\cdot\vect m(z_2) = {}&(1 - z_1^2)(1 - z_2^2)\\ &- (1 + z_1^2)(1 + z_2^2) +
4z_1z_2 .\end{aligned}$$

The terms $1$ and $z_1^2z_2^2$ cancel, leaving

$$\boxed{\;\vect m(z_1)\cdot\vect m(z_2) = -2(z_1 - z_2)^2 .\;} \label{eq:product}$$

It is zero at $z_1 = z_2$, as a null vector must give, and for no two different directions.

![Look first at the two dashed lines from the south pole: each carries a direction on the sky to one complex number,
the stereographic coordinate $z$. The north pole is $z = 0$, the equator $|z| = 1$ and the south pole $z \to \infty$,
and the opposite direction is $-1/\bar z$. Geometry exact.](tut-stereographic){#fig:stereographic}

## Four directions solve one quartic

We want a rule that picks directions out of a reading, and chapter 9.1's overlap gives one. About the axis $\hat
k(z)$, $\vect m(z)$ is a multiple of 9.1's $\vect m$, so $\vect m(z)^*\vect m(z)^{*\mathsf T}$ is a multiple of 9.1's
table $T_{-2} = \vect m^*\vect m^{*\mathsf T}$, the reading of a wave travelling along $-\hat k(z)$, because a wave from
behind carries $\vect m^*$ instead of $\vect m$
([9.1](/tutorial/one-point/spin-two/#two-squares-overlap-less-than-two-vectors)). With 9.1's bracket $\langle
T|U\rangle = \mathrm{tr}(T^\dagger U)$, the reading's overlap with that wave is

$$\begin{aligned}\langle\vect m(z)^*\vect m(z)^{*\mathsf T}|\curv{\mathcal W}\rangle &=
\mathrm{tr}\bigl(\vect m(z)\vect m(z)^{\mathsf T}\curv{\mathcal W}\bigr)\\ &= \vect m(z)^{\mathsf T}\curv{\mathcal
W}\vect m(z) .\end{aligned}$$

A direction is principal when the reading has no overlap with the wave running exactly opposite. Chapter 6.6 used the
same rule for light, and it is also the rule for a Majorana star (the last section). The paper asks where it holds:

{{paper eq:stars}}

Each component of $\vect m(z)$ has degree two at most in $z$, so the left side is a polynomial of degree four, a
**quartic**, with coefficients made from the entries of $\curv{\mathcal W}$, in $\mathrm{s^{-2}}$. It has four complex
roots, counted with their **multiplicity**, the number of times the factor $z - z_k$ of a root $z_k$ divides it. Its
coefficient of $z^4$, from the terms $-z^2$ and $iz^2$ of $\vect m(z)$, is $\curv{\mathcal W}_{11} - \curv{\mathcal
W}_{22} - 2i\curv{\mathcal W}_{12}$. When it vanishes the degree drops, and the missing root is at $z = \infty$, the
direction $-\hat z$. Carried to the sky by [](#eq:direction), the four roots are the field's
**principal null directions**, chapter
[0.4](/tutorial/evening/one-pixel/#four-special-directions-sort-every-reading)'s four special directions.

**One wave.** A wave travelling along $\hat k(z_k)$ has, by chapter 9.1, the reading $\curv{\mathcal W} =
\curv\alpha\,\vect m(z_k)\vect m(z_k)^{\mathsf T}$, with a complex amplitude $\curv\alpha$ in $\mathrm{s^{-2}}$ that
absorbs the length and the phase of $\vect m(z_k)$. By
[](#eq:product),

$$\boxed{\;\begin{aligned}\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) &= \curv\alpha\bigl(\vect
m(z)\cdot\vect m(z_k)\bigr)^2\\ &= 4\curv\alpha\,(z - z_k)^4 .\end{aligned}\;}$$

One root four times: all four directions lie on the wave's direction of travel. Several waves,
$\sum_a\curv\alpha_a\vect m(z_a)\vect m(z_a)^{\mathsf T}$, give $4\sum_a\curv\alpha_a(z - z_a)^4$.

**One body at rest.** A mass $\sym{mass}{\matter M}$ at the distance $r$ along the unit vector $\hat n$ from the pixel
has, by chapter [1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it),
the reading $\curv{\mathcal W} = \curv w(1 - 3\hat n\hat n^{\mathsf T})$, with $\sym{weyl-eigenvalue}{\curv w} =
G\matter M/r^3$, chapter 9.2's repeated eigenvalue. Since $\vect m(z)\cdot\vect m(z) = 0$,

$$\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) = -3\curv w\,\bigl(\vect m(z)\cdot\hat n\bigr)^2 .$$

The bracket is a quadratic in $z$, and it is squared, so each of its two roots is a double root of the quartic. We write
$\vect m(z)$ as a multiple of $\vect e_1 + i\vect e_2$, with axes $\vect e_1$, $\vect e_2$ across its direction of
travel. A root makes $(\vect e_1 + i\vect e_2)\cdot\hat n = 0$, and because $\hat n$ is real, the real and imaginary
parts vanish separately, $\vect e_1\cdot\hat n = \vect e_2\cdot\hat n = 0$. So both axes are at right angles to $\hat
n$, and the direction of travel is $\pm\hat n$: two directions on the line to the body and two opposite. On the $z$ axis
the bracket is $-2z$ and the quartic $-12\curv wz^2$: a double root at $z = 0$, and two roots at infinity, $-\hat z$.

**Any scene at rest.** For a pixel at rest among masses at rest there is no magnetic part, so $\curv{\mathcal W}$ is
real (chapter 9.3). By the formula for $\vect m(-1/\bar z)$ in the first section,

$$\vect m(-1/\bar z)^{\mathsf T}\curv{\mathcal W}\vect m(-1/\bar z) = \frac{1}{\bar z^4}\bigl[\vect m(z)^{\mathsf
T}\curv{\mathcal W}\vect m(z)\bigr]^* ,$$

because $\curv{\mathcal W}^* = \curv{\mathcal W}$. So whenever $z$ is a root, so is $-1/\bar z$, the opposite direction,
which is never $z$ itself ($|z|^2 = -1$ is impossible). **For a pixel at rest among masses at rest the four
directions come in two opposite pairs**, two lines through the pixel.

**Where the two lines lie.** The tide has three eigenvalues $\curv\lambda_1 < \curv\lambda_2 < \curv\lambda_3$, in
$\mathrm{s^{-2}}$ (chapter 9.3's letters), along unit axes $\mathbf a_1$, $\mathbf a_2$, $\mathbf a_3$, which we take
right-handed, $\mathbf a_1\times\mathbf a_2 = \mathbf a_3$. For a real $\curv{\mathcal W}$ the condition $(\vect e_1 +
i\vect e_2)^{\mathsf T}\curv{\mathcal W}(\vect e_1 + i\vect e_2) = 0$ has the imaginary part $2\vect e_1^{\mathsf
T}\curv{\mathcal W}\vect e_2$, which vanishes when $\vect e_2$ is an eigenvector, and the real part $\vect
e_1^{\mathsf T}\curv{\mathcal W}\vect e_1 - \vect e_2^{\mathsf T}\curv{\mathcal W}\vect e_2$. A unit vector $\vect
e_1$ turning between the other two axes gives every value between their eigenvalues, so the real part can vanish only
with $\vect e_2$ on the middle axis. We try $\vect e_2 = \mathbf a_2$ and $\vect e_1 = \cos\vartheta\,\mathbf a_1 +
\sin\vartheta\,\mathbf a_3$, for an angle $\vartheta$ to be found:

$$\begin{aligned}(\vect e_1 + i\vect e_2)^{\mathsf T}\curv{\mathcal W}(\vect e_1 + i\vect e_2) = {}&\curv\lambda_1\cos^2\vartheta\\
&+ \curv\lambda_3\sin^2\vartheta - \curv\lambda_2 ,\end{aligned}$$

which is zero at

$$\boxed{\;\cos^2\vartheta = \dfrac{\curv\lambda_3 - \curv\lambda_2}{\curv\lambda_3 - \curv\lambda_1} ,\;}$$

a number between 0 and 1. The angles $\pm\vartheta$ give two directions of travel $\vect e_1\times\mathbf a_2 =
\cos\vartheta\,\mathbf a_3 - \sin\vartheta\,\mathbf a_1$, and their opposites give two more: all four roots. **The
four directions lie in the plane at right angles to the axis of the middle eigenvalue, at the angle $\vartheta$ on
either side of the axis of the largest.** **Limit:** for one body $\curv\lambda_2 = \curv\lambda_3$, so $\vartheta =
90°$, and both lines close onto $\mathbf a_1$, the stretch axis and the line to the body.

**A number.** The two masses of the paper's Figure [](/paper/#fig:stars) have the eigenvalues $-0.537$, $0.135$ and
$0.402$ in the figure's units (chapter 9.2), so $\cos^2\vartheta = 0.267/0.939 = 0.284$ and $\vartheta = 57.8°$: two
lines that cross at $180° - 2\vartheta = 64.4°$. Solving the quartic gives the figure's two lines of dots, $\pm(-0.797,
0.224, -0.561)$ and $\pm(0.887, 0.227, -0.401)$. The two directions quoted are $2\vartheta = 115.6°$ apart, and both are
at right angles to the middle axis $(-0.04, 0.91, 0.42)$ to $10^{-15}$.

## The pattern of the four directions is the field's Petrov type

We want names for the patterns the four roots can make. The **Petrov type** of a reading is the pattern of the
multiplicities of its four principal null directions: **type I**, four separate directions; **type II**, two together
and two apart; **type D**, two pairs; **type III**, three together and one apart; **type N**, all four together; and
**type O**, no field, where the quartic vanishes for every $z$ and singles out nothing. Every type but I is called
**algebraically special** (Figure [](#fig:petrov-skies)).

The link from chapter 9.2's shapes to the patterns of the roots is stated here without proof, after Penrose
[@Penrose1960]: each pattern goes with one shape, as the table below shows. We check it on types II and III. Chapter
9.2's type II, $\curv w(1 - 3\hat z\hat z^{\mathsf T}) + \curv c_2\,\vect m\vect m^{\mathsf T}$ with $\vect m = (1, i,
0)/\sqrt2$ and $\vect m\cdot\vect m(z) = -\sqrt2z^2$, has the quartic $2z^2(\curv c_2z^2 - 6\curv w)$: two roots at
$z = 0$, and two that split from $-\hat z$ to $z = \pm(6\curv w/\curv c_2)^{1/2} = \pm3.87$, the directions
$(\pm0.484, 0, -0.875)$, for 9.2's $\curv w = 0.125$ and $\curv c_2 = 0.05$. The paper's type III table, with rows $(0,
0, 1)$, $(0, 0, i)$ and $(1, i, 0)$, gives $2m_3(m_1 + im_2) = 2(-2z)(-2z^2) = 8z^3$, with $m_k$ the components of
$\vect m(z)$: three roots at $z = 0$ and one at infinity.

**The test without solving.** Chapter 9.2's invariants $\sym{invariant-i}{I} = \mathrm{tr}\,\curv{\mathcal W}^2$ and
$\sym{invariant-j}{J} = \mathrm{tr}\,\curv{\mathcal W}^3$ and the reading's powers sort the types, with $\curv w = -J/I$
and the product $(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w)$:

| Type | The four directions | Chapter 9.2's shape, and its test | Example |
|---|---|---|---|
| I | four separate | three different eigenvalues: $I^3 \neq 6J^2$ | two masses |
| II | two together, two apart | a repeated eigenvalue, not diagonalizable: $I^3 = 6J^2 \neq 0$, product $\neq 0$ | a mass and a wave along its line |
| D | two pairs | a repeated eigenvalue, diagonalizable: $I^3 = 6J^2 \neq 0$, product $= 0$ | one mass, if $\curv w > 0$ |
| III | three together, one apart | all eigenvalues zero, $\curv{\mathcal W}^2 \neq 0$: $I = J = 0$ | the paper's table |
| N | four together | $\curv{\mathcal W} \neq 0$, $\curv{\mathcal W}^2 = 0$ | one wave |
| O | none singled out | $\curv{\mathcal W} = 0$ | no field |

The figure's two masses give $1 - 6J^2/I^3 = 0.553$, the paper's 0.55: type I, so not one body. Type D is not enough by
itself. Equal masses at unit distance along $\hat x$ and $\hat y$, with $G = 1$, give $\mathrm{diag}(-2, 1, 1) +
\mathrm{diag}(1, -2, 1) = \mathrm{diag}(-1, -1, 2)$: type D, with two double directions along $\pm\hat z$ that point at
neither body, and $\curv w = -J/I = -1$. One body has $\curv w = G\matter M/r^3 > 0$, so type D reads as one body only
when $\curv w > 0$, as the paper says.[^four] The tide alone gives a coarser test for a single source, the paper's
paragraph [*Shape*](/paper/#par:shape): a wave's tide has a zero eigenvalue, so $\det\curv\tE = 0$, while one mass has
$\det\curv\tE = -2(G\matter M/r^3)^3$.

**The type describes the field, not the bodies.** We put the figure's two masses on one line through the pixel, the
mass 1 at $1.5$ along $-\hat x$ and the mass $0.45$ at $0.9$ along $+\hat x$. Both readings contain $1 - 3\hat x\hat
x^{\mathsf T}$, since $\hat n\hat n^{\mathsf T}$ is the same for $\pm\hat n$, so

$$\begin{aligned}\curv{\mathcal W} &= \Bigl(\frac{1}{1.5^3} + \frac{0.45}{0.9^3}\Bigr)(1 - 3\hat x\hat x^{\mathsf
T})\\ &= 0.914\,(1 - 3\hat x\hat x^{\mathsf T}),\end{aligned}$$

exactly the reading of one body with $\curv w = 0.914$: type D, as the paper's [*What no reading can
tell*](/paper/#par:what-no-reading-can-tell) says. The type III table is complex, so no scene at rest
makes it (chapter 9.2). A reading says whether its field could come from one body or one wave, not that it does.

![Look first at the touching dots: the type is the pattern in which the four directions coincide, from four separate
(I) to all four together (N). Directions computed from each reading's quartic.](tut-petrov-skies){#fig:petrov-skies}

## Moving the pixel moves the four directions as rays of light

We want the principal null directions that a moving pixel finds. We take **a pixel moving along $+\hat z$ with the
rapidity $\obs\eta$**, chapter 6.1's pure number, so that by [chapter 9.3](/tutorial/one-point/the-matrix-w/) it reads
$\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$ with $\sym{complex-boost}{\Lambda} = \exp(-i\obs\eta\,\hat z\cdot\mathbf
L)$. Chapter
[6.6](/tutorial/relativity/maxwell-complex/#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle)'s rule for
$\Lambda$ keeps the part of a vector along $\hat z$, here $-2z$, and sends the part across, $\vect m_\perp = (1 - z^2,
i(1 + z^2), 0)$, to $\cosh\obs\eta\,\vect m_\perp - i\sinh\obs\eta\,\hat z\times\vect m_\perp$, where $\hat z\times\vect
m_\perp = (-i(1 + z^2), 1 - z^2, 0)$. Collecting the terms in $1$ and in $z^2$,

$$\begin{aligned}
(\Lambda\vect m(z))_1 &= (\cosh\obs\eta - \sinh\obs\eta)\\ &\quad - (\cosh\obs\eta + \sinh\obs\eta)\,z^2\\ &=
e^{-\obs\eta} - e^{\obs\eta}z^2,\\
(\Lambda\vect m(z))_2 &= i\bigl(e^{-\obs\eta} + e^{\obs\eta}z^2\bigr) ,
\end{aligned}$$

so that

$$\boxed{\;\Lambda\,\vect m(z) = e^{-\obs\eta}\,\vect m\bigl(z\,e^{\obs\eta}\bigr) .\;} \label{eq:boost-z}$$

The new quartic is $\vect m(z)^{\mathsf T}\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}\vect m(z) = (\Lambda^{\mathsf
T}\vect m(z))^{\mathsf T}\curv{\mathcal W}(\Lambda^{\mathsf T}\vect m(z))$. Here $\Lambda^{\mathsf T} = \Lambda^{-1}$ is
the boost with $-\obs\eta$, so by [](#eq:boost-z) $\Lambda^{\mathsf T}\vect m(z) = e^{\obs\eta}\vect m(z
e^{-\obs\eta})$, and the new quartic is $e^{2\obs\eta}$ times the old one at $z e^{-\obs\eta}$. **Its roots are the old
roots times $e^{\obs\eta}$.** **Check:** for the figure's two masses at $\obs\eta = 0.7$, all four computed roots grow
by the factor $2.01375 = e^{0.7}$.

**This is the aberration of light.** The azimuth $\arg z$ is kept and $|z| = \tan(\vartheta/2)$ grows, so every
direction slides from $+\hat z$, the direction of motion, toward $-\hat z$. A dot marks where a wave would travel to,
not where it comes from: a wave arriving from the west puts its four dots in the east. So the dots slide behind the
pixel while the sources crowd ahead, as chapter 6.3 found for [directions of
travel](/tutorial/relativity/aberration/#a-moving-observers-sky-crowds-toward-the-direction-of-motion). Chapter
[6.3](/tutorial/relativity/aberration/#a-ray-of-light-is-a-null-four-vector-and-a-boost-changes-its-frequency-and-its-direction-together)
also found that a ray travelling at the angle $\vartheta$ to the motion travels, for the moving observer, at
$\cos\vartheta' = (\cos\vartheta - \obs\beta)/(1 - \obs\beta\cos\vartheta)$, with $\obs\beta$ the pixel's speed as a
fraction of $c$. Writing $\cos\vartheta = (1 - |z|^2)/(1 + |z|^2)$, the same for $\vartheta'$ with $e^{\obs\eta}|z|$,
and using $e^{2\obs\eta} = (1 + \obs\beta)/(1 - \obs\beta)$ (chapter 6.1) gives that formula. So **the four directions
move as directions of travel of light**.

Every boost and every turn acts on $z$ as a **Möbius map**, a ratio of two linear functions of $z$, which keeps
coinciding roots together, so the type never changes (stated, after Penrose and Rindler).

**Through a room at nearly the speed of light.** When the paper's Section XI [flies a pixel through a still
room](/paper/#par:through-a-room-at-nearly-the-speed-of-light), every direction but the one straight ahead crowds
toward the one behind (chapter 6.3). Type D flown along its axis does not change, because $z \to
e^{\obs\eta}z$ leaves its roots $0$ and $\infty$ in place: chapter 9.3's blind spot.

## One pixel reads the whole state of a moving body

We want a moving body's velocity, distance and mass from the readings of one pixel. We assume that **the body is round
and moves steadily**. Two frames enter, and we take their letters one at a time: the body's own frame holds $\hat
n_0$, $R_*$ and $\obs{\vect\beta}$, and the pixel's frame holds $\vect r$ and $\obs{\vect v}$.

**In the body's frame** the body is at rest, at the distance $\sym{rest-frame-distance}{R_*}$ along chapter 6.3's
unit vector $\sym{rest-direction}{\hat n_0}$ from the pixel. Its reading is $\curv w(1 - 3\hat n_0\hat n_0^{\mathsf
T})$ with $\curv w = G\matter M/R_*^3$, so its directions are $\pm\hat n_0$, each twice. The pixel moves through this
frame with the velocity $c\obs{\vect\beta}$, and $\obs\gamma = (1 - \obs\beta^2)^{-1/2}$. Appendix C writes $a =
\obs{\vect\beta}\cdot\hat n_0$, a pure number, and splits $\hat n_0 = (a/\obs\beta)\hat\beta + \vect n_\perp$ into its
parts along and across $\obs{\vect\beta}$.

**In the pixel's frame** each of the directions $\pm\hat n_0$ is aberrated as a ray (the last section). Chapter
[6.3](/tutorial/relativity/aberration/#one-step-of-appendix-c-the-directions-of-a-moving-body-are-its-directions-at-rest-aberrated)
did that algebra and found the two pairs, the paper's

{{paper eq:proof-stars}}

with the upper signs for $\sym{pnd-pairs}{\hat p_+}$ and the lower for $\hat p_-$. Adding the two lines over the
common denominator $\obs\gamma(1 - a^2)$, and subtracting them, gives Appendix C's half sum and half difference,

{{paper eq:proof-midpoint}}

**The half difference points at where the body is now.** Chapter 6.3 found the vector from the pixel to the body's
present position, $\vect r = R_*[(a/\obs\gamma\obs\beta)\hat\beta + \vect n_\perp]$. Its squared length is
$R_*^2[a^2/\obs\gamma^2\obs\beta^2 + 1 - a^2/\obs\beta^2] = R_*^2(1 - a^2)$, because $1 - 1/\obs\gamma^2 =
\obs\beta^2$. So the half difference is $\vect r/\obs\gamma R_*(1 - a^2)$, a vector along the line to where the body
is now.

**The half sum is the sideways velocity.** For the pixel the body moves with $\obs{\vect v} = -c\obs{\vect\beta}$, and
$\obs{\vect v}\cdot\vect r/c = -R_*a/\obs\gamma$. Its **sideways velocity** $\sym{sideways-velocity}{\obs{\vect
v}_\perp}$, in $\mathrm{m\,s^{-1}}$, is the part of $\obs{\vect v}$ across the line to $\vect r$, $\obs{\vect v} -
(\obs{\vect v}\cdot\vect r)\vect r/r^2$, so

$$\frac{\obs{\vect v}_\perp}{c} = -\obs\beta\hat\beta + \frac{a}{\obs\gamma(1 - a^2)}\Bigl(\frac{a}{\obs\gamma\obs\beta}\hat\beta +
\vect n_\perp\Bigr) .$$

Its part along $\vect n_\perp$ is that of the half sum, the first line of Appendix C's equation. Its part along
$\hat\beta$ is $-\obs\beta + a^2/\obs\gamma^2\obs\beta(1 - a^2)$, and with $1/\obs\gamma^2 = 1 - \obs\beta^2$ this is
$(a^2 - \obs\beta^2)/\obs\beta(1 - a^2)$, the half sum's part along $\hat\beta$. Since $\hat p_+$ and $\hat p_-$ have
length one, the half sum and the half difference are at right angles and their squared lengths add to one. So, with
$\sym{present-line}{\hat n}$ the unit vector toward where the body is now,

$$\boxed{\;\begin{gathered}\tfrac12(\hat p_+ + \hat p_-) = \frac{\obs{\vect v}_\perp}{c},\\ \tfrac12(\hat p_+ - \hat
p_-) = \pm\Bigl(1 - \frac{\obs v_\perp^2}{c^2}\Bigr)^{1/2}\hat n ,\end{gathered}\;}$$

the paper's equation

{{paper eq:star-velocity}}

and the companion that Section VIII states beside it, both in pure numbers. **Limit:** at zero speed the half sum
vanishes and the half difference is $\pm\hat n$, the pairs at rest. **A check.** A body as in the paper's Figure
[](/paper/#fig:stars), at $1.5$ along $-\hat x$ and moving along $+\hat y$ at $0.9c$, has the directions $(\pm0.436,
0.9, 0)$, each twice: the half sum is $(0, 0.9, 0)$, the figure's $0.9$, and the half difference has the length $0.436 =
(1 - 0.81)^{1/2}$ (Figure [](#fig:moving-pairs)).

**Distance, approach and mass.** We want the rest of the state from how the reading changes. The present position moves
with $\obs{\vect v}$, and only the part across the line turns it, so the line turns at $\dot{\hat n} = \obs{\vect
v}_\perp/r$, the sideways velocity over the distance. This gives $r$, and the sign of $\hat n$ is the one for which
$\dot{\hat n}$ points along $\obs{\vect v}_\perp$. The repeated eigenvalue $\curv w$ is the same for every observer
(chapter 9.3), so the pixel reads $\curv w = G\matter M/R_*^3$, with chapter
[6.1](/tutorial/relativity/lorentz/#a-moving-ruler-is-shorter-along-its-motion-and-distances-in-a-bodys-own-frame-are-longer)'s

$$R_*^2 = \obs\gamma^2\Bigl(r^2 - \frac{|\obs{\vect v}\times\vect r|^2}{c^2}\Bigr) .$$

The vector $\obs{\vect v}\times\vect r$ is constant along the path, since $\dot{\vect r} = \obs{\vect v}$ and
$\obs{\vect v}\times\obs{\vect v} = 0$. Differentiating in time with $\obs\gamma$ fixed gives $R_*\dot R_* =
\obs\gamma^2r\dot r$, and $\dot{\curv w}/\curv w = -3\dot R_*/R_*$, so

$$\frac{\dot{\curv w}}{\curv w} = -\frac{3r\dot r}{r^2 - |\obs{\vect v}\times\vect r|^2/c^2} = -\frac{3\dot
r}{r\,(1 - \obs v_\perp^2/c^2)} ,$$

because $|\obs{\vect v}\times\vect r| = \obs v_\perp r$. Solving for $\dot r$, and writing $\matter M = \curv
wR_*^3/G$ (chapter 6.1's problem), gives the paper's

{{paper eq:moving-state}}

The rate $\dot r$ is the velocity along the line, so $\obs{\vect v} = \obs{\vect v}_\perp + \dot r\,\hat n$ and with it
$\obs\gamma$ are known: position, velocity and mass, seven numbers. **Limit:** for a slow body, $\obs\gamma \to 1$ and
$\matter M = \curv wr^3/G$, the mass of a body at rest at the distance $r$.

**Coming straight on.** A body moving along the line to the pixel has no sideways velocity, its line does not turn, and
it cannot be ranged. Its reading keeps the form $\curv w(1 - 3\hat n\hat n^{\mathsf T})$, the radial blind spot of
chapter 9.3, so its tide along the line, $\sym{line-tide}{\curv\tE_\parallel} = -2\curv w$ in $\mathrm{s^{-2}}$, is
$-2G\matter M/\obs\gamma^3r^3$, since $R_* = \obs\gamma r$ on the line. We assume that **$\curv\tE_\parallel = K/r^3$
with a constant $K$**, which holds exactly for a body that **coasts**, keeping its speed, and closely for one whose
speed changes, as long as $\obs\gamma^2r|\ddot r| \ll c^2$.[^contact] Differentiating once and twice gives
$\dot{\curv\tE}_\parallel = -3Kr^{-4}\dot r$ and $\ddot{\curv\tE}_\parallel = K(12r^{-5}\dot r^2 - 3r^{-4}\ddot r)$, so

{{paper eq:contact}}

The first ratio is the **time to contact**, $-r/\dot r$, read from the tide and its rate alone. **Numbers.** A person of
70 kg, 5 m away, makes a tide along the line of $-7.5\times10^{-11}\unit{s^{-2}}$, 125 times weaker than at a metre.
Walking toward the pixel at $0.3\unit{m\,s^{-1}}$, the person arrives in $16.7\unit{s}$. The second ratio is $1.33$ if
the person coasts, $2.26$ if they speed up toward the pixel at $0.05\unit{m\,s^{-2}}$ ($\ddot r =
-0.05\unit{m\,s^{-2}}$), and $0.41$ if they brake at the same rate: above $\tfrac43$ when driven, below when braking.

![Look first at the arrow from the pixel to the midpoint: a body moving across the line at $0.9c$ folds both pairs of
directions toward its motion, and their half sum is its sideways velocity over $c$, while their half difference lies
along the line to where it is now. Directions computed from the boosted
reading.](tut-moving-pairs){#fig:moving-pairs}

## The four directions are the reading's Majorana stars

This section is a sketch, at depth B. Chapter [8.4](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky) drew a
spin two as four **Majorana stars**, the roots of Majorana's polynomial $p(z)$, whose factors for a spin two are 1,
$-2$, $\sqrt6$, $-2$ and 1. We write the reading with 9.1's five tables about $\hat z$, $\curv{\mathcal W} =
\sum_m\curv c_mT_m$, and use $\vect m(z)\cdot\vect m = -\sqrt2z^2$, $\vect m(z)\cdot\vect m^* = \sqrt2$ and $\vect
m(z)\cdot\hat z = -2z$ for 9.1's $\vect m = (1, i, 0)/\sqrt2$. Each table gives one power of $z$:

$$\begin{aligned}\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) = {}&2\curv c_2z^4 + 4\sqrt2\,\curv c_1z^3 +
12\curv c_0z^2\\ &- 4\sqrt2\,\curv c_{-1}z + 2\curv c_{-2} .\end{aligned}$$

In the standard phases the spin states of weights 2 to $-2$ are the tables of length one $T_2$, $-T_1/\sqrt2$,
$T_0/\sqrt6$, $T_{-1}/\sqrt2$ and $T_{-2}$, so the reading's components are $\curv c_2$, $-\sqrt2\,\curv c_1$,
$\sqrt6\,\curv c_0$, $\sqrt2\,\curv c_{-1}$ and $\curv c_{-2}$. Twice their products with Majorana's factors are 2,
$4\sqrt2$, 12, $-4\sqrt2$ and 2 times the $\curv c_m$, the coefficients above. So the quartic is exactly twice
Majorana's polynomial, and **the principal null directions are the reading's Majorana stars** [@Bruno2019].
**Checks.** A wave along $\hat z$ has only $\curv c_2$, and $2\curv c_2z^4$ puts its four stars at $z =
0$. A body on the $z$ axis, $\curv{\mathcal W} = -\curv wT_0$, gives $-12\curv wz^2$, chapter 8.4's two stars at each
pole.

::: gap
This sketch does not derive Majorana's factors (chapter 8.4's gap). It states three things: the standard phases, which
come from lowering the weight one step at a time from $T_2$; that a star is a direction whose opposite coherent state
has no overlap with the state; and that for a spin $s$ the product with $s$ copies of $\vect m(z)$ is Majorana's
polynomial (Penrose and Rindler).
:::

::: try {#stars}
Predict first: how many separate directions do two masses on one line through the pixel give? Choose *Two*, set the
speed to zero, and drag the second body onto the line through the pixel and the first body, then off it, watching
the type. Predict next where a moving body's two pairs have their midpoint. Choose *One body* at $0.9c$ and compare
the arrow's tip, the midpoint, with the small ring, the body's sideways velocity over $c$ worked out from its motion.
:::

::: check
### Q

Why does a single wave have all four principal null directions on its direction of travel?

### A

Its quartic is $4\curv\alpha(z - z_k)^4$, by [](#eq:product): one root four times.

### Q

A reading has $1 - 6J^2/I^3 = 0$. Is it one body?

### A

Not necessarily. It is type D or II, type D needs $(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w) = 0$
too, and one body needs $\curv w > 0$ besides. Even then it can be two bodies on one line through the pixel.

### Q

A body passes at $0.6c$ straight across the line of sight. What is the half sum of its two pairs?

### A

Its sideways velocity over $c$: a vector of length 0.6 along its velocity.
:::

**The idea to keep: every reading picks out four directions on the sky, the roots of one quartic. They lie together for
a single wave, in two pairs for a single body at rest, and in general apart when more is pulling. Their pattern,
Petrov's type, describes the field, not the bodies. The directions move as rays of light, so a moving body's two pairs
have its sideways velocity as their midpoint, and how the reading changes gives its distance and mass.**

::: problems
### Practice

Find the four principal null directions of $\curv{\mathcal W} = \mathrm{diag}(-2, 1, 1)$, a mass on the $x$ axis in
units of $G\matter M/r^3$, from the quartic.

::: solution
With $\vect m(z) = (1 - z^2, i(1 + z^2), -2z)$, the quartic is $-2(1 - z^2)^2 - (1 + z^2)^2 + 4z^2 = -3z^4 + 6z^2 - 3 =
-3(z^2 - 1)^2$. Its roots $z = \pm1$, each twice, are $\pm\hat x$, the line to the mass. None is at infinity, since the
coefficient of $z^4$ is not zero, and $-1 = -1/\bar z$ for $z = 1$, as at rest it must be.
:::

### Stretch

Combine with chapter 6.3. A mass at rest is seen by a pixel moving at $0.6c$ at right angles to the line to it. Where
does the pixel see the two pairs, and how far apart are they?

::: solution
For the pixel the body moves at $0.6c$ the other way, across the line, so $\obs v_\perp = 0.6c$. The half sum has the
length 0.6 along the body's velocity and the half difference the length $(1 - 0.36)^{1/2} = 0.8$ along the line, so
each pair leans $\arctan(0.6/0.8) = 36.9°$ from the line toward the body's motion. The pairs are $180° - 2(36.9°) =
106.3°$ apart instead of opposite. For a mass on the $x$ axis and a pixel moving along $+\hat y$ they lie at
$(\pm0.8, -0.6, 0)$, each twice, as a boosted reading gives.
:::

### The paper

Check the second of the paper's [](/paper/#eq:contact) for a body that coasts straight at the pixel at any speed, with
$\curv\tE_\parallel = -2G\matter M/\obs\gamma^3r^3$.

::: solution
Coasting keeps $\obs\gamma$ fixed and $\ddot r = 0$, so $\curv\tE_\parallel = K/r^3$ with $K = -2G\matter
M/\obs\gamma^3$. Then $\dot{\curv\tE}_\parallel = -3K\dot r/r^4$ and $\ddot{\curv\tE}_\parallel
= 12K\dot r^2/r^5$, so the ratio is $(K/r^3)(12K\dot r^2/r^5)/(9K^2\dot r^2/r^8) = \tfrac43$, at every speed.
:::
:::

::: paper
- Section VIII's [*Principal null directions*](/paper/#par:principal-null-directions) and Figure
  [](/paper/#fig:stars): the paper's [](/paper/#eq:stars), the types, and $1 - 6J^2/I^3$ and its 0.55.
- Section VIII's [*Shape*](/paper/#par:shape): $\det\curv\tE = 0$ for a wave against $-2 : 1 : 1$ for a mass.
- Section VIII's [*The state of a moving body*](/paper/#par:the-state-of-a-moving-body): the paper's
  [](/paper/#eq:star-velocity), [](/paper/#eq:moving-state) and [](/paper/#eq:contact), derived here.
- Section VIII's [*What no reading can tell*](/paper/#par:what-no-reading-can-tell): two masses on a line, the type III
  table.
- Appendix C's [*The principal null directions of a moving
  body*](/paper/#par:the-principal-null-directions-of-a-moving-body): the paper's [](/paper/#eq:proof-stars) and
  [](/paper/#eq:proof-midpoint).
- Section XI's [*Through a room at nearly the speed of light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light):
  the directions crowd behind.
:::

::: deeper
- R. Penrose, "A spinor approach to general relativity" [@Penrose1960]: the principal null directions as the roots of
  a quartic, and the types as their patterns.
- R. Penrose and W. Rindler, *Spinors and Space-Time*, vol. 1 (Cambridge, 1984), sections 1.2 to 1.4: the sky as the
  complex plane, and boosts and turns as its Möbius maps.
- The paper's sources on Majorana's stars [@Bruno2019] and on the types as classes of entanglement
  [@BengtssonZyczkowski2017; @Kam2026].
:::

[^four]: The paper's "where two or more bodies pull, they are four distinct points" holds in general. "Generally four"
    would be exact, since equal pulls at right angles give $1 - 6J^2/I^3 = 0$.

[^contact]: The paper states the second ratio without this condition, which is exact only while $\obs\gamma$ stays
    fixed. For the person below, $\obs\gamma^2r|\ddot r|/c^2 = 5 \times 0.05/(3.00\times10^8)^2 = 2.8\times10^{-18}$.
