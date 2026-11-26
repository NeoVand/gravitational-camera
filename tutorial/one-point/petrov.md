---
id: '9.4'
title: 'Principal null directions and the Petrov classification'
question: 'Every reading of one pixel picks out four directions on the sky around it. For one plane wave all four coincide on its direction of travel, for one body at rest they fall in two pairs, on the line to the body and opposite it, and where two or more bodies pull they are generally four distinct directions. What are these four directions, and how do they tell one wave, one body and many bodies apart?'
part: '9'
requires: ['1.4', '1.5', '1.5b', '6.1', '6.3', '6.6', '8.4', '9.1', '9.2', '9.3']
paper: [sec:one-pixel, eq:stars, eq:star-velocity, eq:moving-state, eq:contact, fig:stars, app:proofs, eq:proof-stars, eq:proof-midpoint, sec:vistas]
figures: [fig:stars]
live: [stars]
depth: A
---

Figure [](/paper/#fig:stars) marks the special directions on the sky around one pixel. For gravity, a single wave puts four marks together
on its direction of travel, and a mass at rest puts two on the line to it and two opposite. The same mass moving across
that line at $0.9c$ folds both pairs toward its motion, and two masses scatter four marks over the sky. For light, every
sky holds two.[^fig]

{{paper fig:stars}}

What are these four directions, and how do they tell one wave, one body and many bodies apart? The answer lets one
reading say whether its field could come from a single body or a single wave, and gives a moving body's velocity,
distance and mass.

::: plain
Every reading of a pixel picks out four directions on the sky around it, the solutions of one equation of the fourth
degree. Some of them can coincide.

A single gravitational wave puts all four on its direction of travel. A single round body at rest puts two on the line
toward it and two pointing directly away. Two bodies give four separate directions in general, and fewer in special
arrangements, such as two bodies on one line through the pixel. The pattern of the four is called the field's Petrov type.
The numbers that every observer agrees on, with a few products of the reading with itself, tell the type without solving
anything. The type belongs to the field and not to the bodies, so two masses on one line look like one.

When the pixel moves, the four directions shift as rays of light do. For a moving body, the midpoint of its two pairs is
its velocity across the line of sight, as a fraction of the speed of light, and how the reading changes in time gives the
body's distance and its mass.
:::

## A direction on the sky is a complex number

We want one number for each direction around the pixel, because the four directions will be the roots of one polynomial.
The directions around a point form a sphere, the **celestial sphere**, and section
[6.6](/tutorial/relativity/maxwell-complex/#light-has-two-special-directions-where-gravity-has-four) labelled each of
them by a complex number $\sym{stereographic-z}{z}$, its **stereographic coordinate**, a pure number. In Part 9 the letter
$z$ is only this number, never a depth; the axis is written $\hat z$. For each $z$ we use the complex vector

$$\sym{null-vector-z}{\vect m(z)} = \bigl(1 - z^2,\ i(1 + z^2),\ -2z\bigr) ,$$

with no unit. It is null for every $z$, $\vect m(z)\cdot\vect m(z) = (1 - z^2)^2 - (1 + z^2)^2 + 4z^2 = 0$. By section
[9.1](/tutorial/one-point/spin-two/#the-square-holds-four-numbers-a-direction-and-one-complex-amplitude), a null vector
$\vect m$ belongs to a wave that travels along $\mathrm{Re}(i\vect m\times\vect m^*)/|\vect m|^2$, and for $\vect m(z)$
that direction is

$$\boxed{\;\sym{sky-direction}{\hat k(z)} = \dfrac{\bigl(2\,\mathrm{Re}\,z,\ 2\,\mathrm{Im}\,z,\ 1 -
|z|^2\bigr)}{1 + |z|^2}\;} \label{eq:direction}$$

(the box below works it out). Section 6.6 stated it as $\hat n(z)$.

::: derivation
### The direction of travel of $\vect m(z)$

With $\bar z$ the conjugate of the number $z$ (vectors keep the asterisk), $\vect m(z)^* = (1 - \bar z^2,\ -i(1 + \bar z^2),\
-2\bar z)$, and the third component of the cross product is

$$\begin{aligned}(\vect m\times\vect m^*)_3 &= -i\bigl[(1 - z^2)(1 + \bar z^2)\\ &\qquad + (1 + z^2)(1 - \bar
z^2)\bigr]\\ &= -2i\bigl(1 - |z|^4\bigr),\end{aligned}$$

and in the same way the first is $-2i(z + \bar z)(1 + |z|^2)$ and the second $-2(z - \bar z)(1 + |z|^2)$. With $z + \bar z
= 2\,\mathrm{Re}\,z$ and $z - \bar z = 2i\,\mathrm{Im}\,z$, multiplying by $i$ gives $4\,\mathrm{Re}\,z\,(1 + |z|^2)$,
$4\,\mathrm{Im}\,z\,(1 + |z|^2)$ and $2(1 - |z|^2)(1 + |z|^2)$. Section 6.6 found $|\vect m(z)|^2 = 2(1 + |z|^2)^2$, and
dividing gives [](#eq:direction).
:::

**Checks.** The directions of $z = 0$, $1$ and $i$ are $+\hat z$, $+\hat x$ and $+\hat y$, $z \to \infty$ gives $-\hat z$,
and the circle $|z| = 1$ is the equator. The third component is $\cos\vartheta = (1 - |z|^2)/(1 + |z|^2)$, with $\vartheta$
the angle from $+\hat z$, and the angle of $z$ in the complex plane is the azimuth $\varphi$ about $\hat z$, so by the
half-angle formula

$$|z| = \tan\frac\vartheta2, \qquad \arg z = \varphi .$$

**The opposite direction.** Multiplying out each component gives $\vect m(-1/\bar z) = -\vect m(z)^*/\bar z^2$, and
conjugating $\vect e_1 + i\vect e_2$ reverses its direction of travel, $\vect e_1\times(-\vect e_2) = -\hat k$. So the
direction opposite to $z$ is $-1/\bar z$ (Figure [](#fig:stereographic)).

**Two directions.** We multiply out the product of two of these vectors,

$$\begin{aligned}\vect m(z_1)\cdot\vect m(z_2) = {}&(1 - z_1^2)(1 - z_2^2)\\ &- (1 + z_1^2)(1 + z_2^2) + 4z_1z_2 .\end{aligned}$$

The terms $1$ and $z_1^2z_2^2$ cancel, leaving

$$\boxed{\;\vect m(z_1)\cdot\vect m(z_2) = -2(z_1 - z_2)^2 .\;} \label{eq:product}$$

It is zero at $z_1 = z_2$, as a null vector must give, and for no two different directions.

![Look first at the two dashed lines from the south pole: each carries a direction on the sky to one complex number, the
stereographic coordinate $z$. The north pole is $z = 0$, the equator $|z| = 1$ and the south pole $z \to \infty$, and the
opposite direction is $-1/\bar z$. Geometry exact.](tut-stereographic){#fig:stereographic}

## Four directions solve one quartic

The overlap of section 9.1 gives a rule that picks directions out of a reading. About the axis $\hat
k(z)$, $\vect m(z)$ is a multiple of the $\vect m$ of 9.1, so $\vect m(z)^*\vect m(z)^{*\mathsf T}$ is a multiple of $T_{-2}
= \vect m^*\vect m^{*\mathsf T}$, the reading of a wave travelling along $-\hat k(z)$, because a wave from behind carries
$\vect m^*$ instead of $\vect m$ ([9.1](/tutorial/one-point/spin-two/#two-squares-overlap-less-than-two-vectors)). With the
bracket $\langle T|U\rangle = \mathrm{tr}(T^\dagger U)$ of 9.1, the reading's overlap with that wave is

$$\begin{aligned}\langle\vect m(z)^*\vect m(z)^{*\mathsf T}|\curv{\mathcal W}\rangle &= \mathrm{tr}\bigl(\vect m(z)\vect
m(z)^{\mathsf T}\curv{\mathcal W}\bigr)\\ &= \vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) .\end{aligned}$$

A direction is principal when the reading has no overlap with the wave running exactly opposite (the rule of section 6.6
for light, and of Majorana's representation, the last section):

$$\vect m(z)^{\mathsf T}\,\curv{\mathcal W}\,\vect m(z) = 0 .\label{eq:quartic}$$

Each component of $\vect m(z)$ has degree two at most in $z$, so the left side is a polynomial of degree four, a
**quartic**, with coefficients made from the entries of $\curv{\mathcal W}$, in $\mathrm{s^{-2}}$. It has four complex
roots, counted with their **multiplicity**, the number of times the factor $z - z_k$ of a root $z_k$ divides it. Its
coefficient of $z^4$, from the terms $-z^2$ and $iz^2$ of $\vect m(z)$, is $\curv{\mathcal W}_{11} - \curv{\mathcal W}_{22}
- 2i\curv{\mathcal W}_{12}$. When it vanishes the degree drops, and the missing root is at $z = \infty$, the direction
$-\hat z$. Carried to the sky by [](#eq:direction), the four roots are the field's **principal null directions**, the
four special directions of section
[0.4](/tutorial/evening/one-pixel/#four-special-directions-sort-every-reading).[^stars]

**One wave.** A wave travelling along $\hat k(z_k)$ has, by section 9.1, the reading $\curv{\mathcal W} = \curv\alpha\,\vect
m(z_k)\vect m(z_k)^{\mathsf T}$, with a complex amplitude $\curv\alpha$ in $\mathrm{s^{-2}}$ that absorbs the length and the
phase of $\vect m(z_k)$. By [](#eq:product),

$$\boxed{\;\begin{aligned}\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) &= \curv\alpha\bigl(\vect m(z)\cdot\vect
m(z_k)\bigr)^2\\ &= 4\curv\alpha\,(z - z_k)^4 .\end{aligned}\;}$$

One root four times: all four directions lie on the wave's direction of travel. Several waves give $4\sum_a\curv\alpha_a(z - z_a)^4$.

**One body at rest.** A mass $\sym{mass}{\matter M}$ at the distance $r$ along the unit vector $\hat n$ from the pixel has,
by section [1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it), the
reading $\curv{\mathcal W} = \curv w(1 - 3\hat n\hat n^{\mathsf T})$, with $\sym{weyl-eigenvalue}{\curv w} = G\matter M/r^3$,
the repeated eigenvalue of section 9.2. Since $\vect m(z)\cdot\vect m(z) = 0$,

$$\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) = -3\curv w\,\bigl(\vect m(z)\cdot\hat n\bigr)^2 .$$

The bracket is a quadratic in $z$, and it is squared, so each of its two roots is a double root of the quartic. We write
$\vect m(z)$ as a multiple of $\vect e_1 + i\vect e_2$, with axes $\vect e_1$, $\vect e_2$ across its direction of travel. A
root makes $(\vect e_1 + i\vect e_2)\cdot\hat n = 0$, and because $\hat n$ is real, the real and imaginary parts vanish
separately, $\vect e_1\cdot\hat n = \vect e_2\cdot\hat n = 0$. So both axes are at right angles to $\hat n$, and the
direction of travel is $\pm\hat n$: two directions on the line to the body and two opposite. On the $z$ axis the bracket is
$-2z$ and the quartic $-12\curv wz^2$: a double root at $z = 0$, and two roots at infinity, $-\hat z$.

**Any scene at rest.** For a pixel at rest among masses at rest there is no magnetic part, so $\curv{\mathcal W}$ is real
(section 9.3). By the formula for $\vect m(-1/\bar z)$ above,

$$\vect m(-1/\bar z)^{\mathsf T}\curv{\mathcal W}\vect m(-1/\bar z) = \frac{1}{\bar z^4}\bigl[\vect m(z)^{\mathsf
T}\curv{\mathcal W}\vect m(z)\bigr]^* ,$$

because $\curv{\mathcal W}^* = \curv{\mathcal W}$. So whenever $z$ is a root, so is $-1/\bar z$, the opposite direction,
which is never $z$ itself ($|z|^2 = -1$ is impossible). **For a pixel at rest among masses at rest the four directions
come in two opposite pairs**, two lines through the pixel.

**Where the two lines lie.** The tide has three eigenvalues $\curv\lambda_1 < \curv\lambda_2 < \curv\lambda_3$, in
$\mathrm{s^{-2}}$ (the letters of section 9.3), along unit axes $\mathbf a_1$, $\mathbf a_2$, $\mathbf a_3$, which we take
right-handed, $\mathbf a_1\times\mathbf a_2 = \mathbf a_3$. For a real $\curv{\mathcal W}$ the condition $(\vect e_1 +
i\vect e_2)^{\mathsf T}\curv{\mathcal W}(\vect e_1 + i\vect e_2) = 0$ has the imaginary part $2\vect e_1^{\mathsf
T}\curv{\mathcal W}\vect e_2$, which vanishes when $\vect e_2$ is an eigenvector, and the real part $\vect e_1^{\mathsf
T}\curv{\mathcal W}\vect e_1 - \vect e_2^{\mathsf T}\curv{\mathcal W}\vect e_2$. A unit vector $\vect e_1$ turning between
the other two axes gives every value between their eigenvalues, so the real part can vanish only with $\vect e_2$ on the
middle axis. We try $\vect e_2 = \mathbf a_2$ and $\vect e_1 = \cos\vartheta\,\mathbf a_1 + \sin\vartheta\,\mathbf a_3$, for
an angle $\vartheta$ to be found:

$$\begin{aligned}(\vect e_1 + i\vect e_2)^{\mathsf T}\curv{\mathcal W}(\vect e_1 + i\vect e_2) = {}&\curv\lambda_1\cos^2\vartheta\\
&+ \curv\lambda_3\sin^2\vartheta - \curv\lambda_2 ,\end{aligned}$$

which is zero at

$$\boxed{\;\cos^2\vartheta = \dfrac{\curv\lambda_3 - \curv\lambda_2}{\curv\lambda_3 - \curv\lambda_1} ,\;}$$

a number between 0 and 1. The angles $\pm\vartheta$ give two directions of travel $\vect e_1\times\mathbf a_2 =
\cos\vartheta\,\mathbf a_3 - \sin\vartheta\,\mathbf a_1$, and their opposites give two more: all four roots. **The four
directions lie in the plane at right angles to the axis of the middle eigenvalue, at the angle $\vartheta$ on either side
of the axis of the largest.** **Limit:** for one body $\curv\lambda_2 = \curv\lambda_3$, so $\vartheta = 90°$, and both lines close onto $\mathbf a_1$,
the line to the body.

**A number.** The two masses of Figure [](/paper/#fig:stars) have the eigenvalues $-0.537$, $0.135$ and $0.402$ in the figure's units
(section 9.2), so $\cos^2\vartheta = 0.267/0.939 = 0.284$ and $\vartheta = 57.8°$: two lines that cross at $180° - 2\vartheta
= 64.4°$. Solving the quartic gives the figure's two lines of marks, $\pm(-0.797, 0.224, -0.561)$ and $\pm(0.887, 0.227,
-0.401)$. The two directions quoted are $2\vartheta = 115.6°$ apart.

## The pattern of the four directions is the field's Petrov type

The **Petrov type** of a reading is the pattern of the multiplicities of its four principal null directions: **type I**,
four separate directions; **type II**, two together and two apart; **type D**, two pairs; **type III**, three together and
one apart; **type N**, all four together; and **type O**, no field, where the quartic vanishes for every $z$ and singles
out nothing. Every type but I is called **algebraically special** (Figure [](#fig:petrov-skies)).

After Penrose [@Penrose1960], each pattern of the roots goes with one shape of section 9.2, as the table below shows;
the [section on repeated directions](#a-repeated-direction-is-a-null-eigenvector-so-each-pattern-is-one-shape) proves
it. We check it here on types II and III. The type II of
9.2, $\curv w(1 - 3\hat z\hat z^{\mathsf T}) + \curv c_2\,\vect m\vect m^{\mathsf T}$ with $\vect m = (1, i, 0)/\sqrt2$ and
$\vect m\cdot\vect m(z) = -\sqrt2z^2$, has the quartic $2z^2(\curv c_2z^2 - 6\curv w)$: two roots at $z = 0$, and two that
split from $-\hat z$ to $z = \pm(6\curv w/\curv c_2)^{1/2} = \pm3.87$, the directions $(\pm0.484, 0, -0.875)$, for 9.2's
$\curv w = 0.125$ and $\curv c_2 = 0.05$. The type III table, with rows $(0, 0, 1)$, $(0, 0, i)$ and $(1, i, 0)$, gives
$2m_3(m_1 + im_2) = 2(-2z)(-2z^2) = 8z^3$, with $m_k$ the components of $\vect m(z)$: three roots at $z = 0$ and one at
infinity.

**The test without solving.** The invariants $\sym{invariant-i}{I} = \mathrm{tr}\,\curv{\mathcal W}^2$ and
$\sym{invariant-j}{J} = \mathrm{tr}\,\curv{\mathcal W}^3$ of section 9.2 and the reading's powers sort the types, with
$\curv w = -J/I$ and the product $(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w)$:

| Type | The four directions | The shape of section 9.2, and its test | Example |
|---|---|---|---|
| I | four separate | three different eigenvalues: $I^3 \neq 6J^2$ | two masses |
| II | two together, two apart | a repeated eigenvalue, not diagonalizable: $I^3 = 6J^2 \neq 0$, product $\neq 0$ | a mass and a wave along its line |
| D | two pairs | a repeated eigenvalue, diagonalizable: $I^3 = 6J^2 \neq 0$, product $= 0$ | one mass, if $\curv w > 0$ |
| III | three together, one apart | all eigenvalues zero, $\curv{\mathcal W}^2 \neq 0$: $I = J = 0$ | the type III table |
| N | four together | $\curv{\mathcal W} \neq 0$, $\curv{\mathcal W}^2 = 0$ | one wave |
| O | none singled out | $\curv{\mathcal W} = 0$ | no field |

The two masses of Figure [](/paper/#fig:stars) give $1 - 6J^2/I^3 = 0.553$: type I, so not one body. Type D is not enough by itself. Equal masses
at unit distance along $\hat x$ and $\hat y$, with $G = 1$, give $\mathrm{diag}(-2, 1, 1) + \mathrm{diag}(1, -2, 1) =
\mathrm{diag}(-1, -1, 2)$: type D, with two double directions along $\pm\hat z$ that point at neither body, and $\curv w =
-J/I = -1$. One body has $\curv w = G\matter M/r^3 > 0$, so type D reads as one body only when $\curv w > 0$.[^four]

**The type describes the field, not the bodies.** We put the figure's two masses on one line through the pixel, the mass 1
at $1.5$ along $-\hat x$ and the mass $0.45$ at $0.9$ along $+\hat x$. Both readings contain $1 - 3\hat x\hat x^{\mathsf
T}$, since $\hat n\hat n^{\mathsf T}$ is the same for $\pm\hat n$, so

$$\begin{aligned}\curv{\mathcal W} &= \Bigl(\frac{1}{1.5^3} + \frac{0.45}{0.9^3}\Bigr)(1 - 3\hat x\hat x^{\mathsf T})\\ &=
0.914\,(1 - 3\hat x\hat x^{\mathsf T}),\end{aligned}$$

exactly the reading of one body with $\curv w = 0.914$: type D. A reading says whether its field could come from one body
or one wave, not that it does.

![Look first at the touching marks: the type is the pattern in which the four directions coincide, from four separate (I)
to all four together (N). Directions computed from each reading's quartic.](tut-petrov-skies){#fig:petrov-skies}

## Moving the pixel moves the four directions as rays of light

Take **a pixel moving along $+\hat z$ with the
rapidity $\obs\eta$**, the pure number of section 6.1, so that by [section 9.3](/tutorial/one-point/the-matrix-w/) it reads
$\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$ with $\sym{complex-boost}{\Lambda} = \exp(-i\obs\eta\,\hat z\cdot\mathbf L)$. The
rule of section
[6.6](/tutorial/relativity/maxwell-complex/#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle) for $\Lambda$ keeps
the part of a vector along $\hat z$, here $-2z$, and sends the part across, $\vect m_\perp = (1 - z^2, i(1 + z^2), 0)$, to
$\cosh\obs\eta\,\vect m_\perp - i\sinh\obs\eta\,\hat z\times\vect m_\perp$, where $\hat z\times\vect m_\perp = (-i(1 + z^2),
1 - z^2, 0)$. Collecting the terms in $1$ and in $z^2$,

$$\begin{aligned}
(\Lambda\vect m(z))_1 &= (\cosh\obs\eta - \sinh\obs\eta)\\ &\quad - (\cosh\obs\eta + \sinh\obs\eta)\,z^2\\ &=
e^{-\obs\eta} - e^{\obs\eta}z^2,\\
(\Lambda\vect m(z))_2 &= i\bigl(e^{-\obs\eta} + e^{\obs\eta}z^2\bigr) ,
\end{aligned}$$

so that

$$\boxed{\;\Lambda\,\vect m(z) = e^{-\obs\eta}\,\vect m\bigl(z\,e^{\obs\eta}\bigr) .\;} \label{eq:boost-z}$$

The new quartic is $\vect m(z)^{\mathsf T}\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}\vect m(z) = (\Lambda^{\mathsf T}\vect
m(z))^{\mathsf T}\curv{\mathcal W}(\Lambda^{\mathsf T}\vect m(z))$. Here $\Lambda^{\mathsf T} = \Lambda^{-1}$ is the boost with
$-\obs\eta$, so by [](#eq:boost-z) $\Lambda^{\mathsf T}\vect m(z) = e^{\obs\eta}\vect m(z e^{-\obs\eta})$, and the new quartic
is $e^{2\obs\eta}$ times the old one at $z e^{-\obs\eta}$. **Its roots are the old roots times $e^{\obs\eta}$.** **Check:**
for the two masses of Figure [](/paper/#fig:stars) at $\obs\eta = 0.7$, all four roots grow by $2.01375 = e^{0.7}$.

**This is the aberration of light.** The azimuth $\arg z$ is kept and $|z| = \tan(\vartheta/2)$ grows, so every direction
slides from $+\hat z$, the direction of motion, toward $-\hat z$. A mark shows where a wave would travel to, so the marks slide behind the pixel while the sources crowd ahead, as section
6.3 found for [directions of
travel](/tutorial/relativity/aberration/#a-moving-observers-sky-crowds-toward-the-direction-of-motion). Section
[6.3](/tutorial/relativity/aberration/#a-ray-of-light-is-a-null-four-vector-and-a-boost-changes-its-frequency-and-its-direction-together)
also found that a ray travelling at the angle $\vartheta$ to the motion travels, for the moving observer, at
$\cos\vartheta' = (\cos\vartheta - \obs\beta)/(1 - \obs\beta\cos\vartheta)$, with $\obs\beta$ the pixel's speed as a
fraction of $c$. Writing $\cos\vartheta = (1 - |z|^2)/(1 + |z|^2)$, the same for $\vartheta'$ with $e^{\obs\eta}|z|$, and
using $e^{2\obs\eta} = (1 + \obs\beta)/(1 - \obs\beta)$ (section 6.1) gives that formula. So **the four directions move as
directions of travel of light**.

**Every change of observer is a Möbius map of the sky.** A turn by $\psi$ about $\hat z$ and a turn by $\theta$ about $\hat
y$, which carries $\hat z$ toward $\hat x$, act on $\vect m(z)$ as the box below works out. With $C = \cos(\theta/2)$ and
$S = \sin(\theta/2)$,

$$\begin{gathered}R_z\,\vect m(z) = e^{-i\psi}\,\vect m\bigl(z\,e^{i\psi}\bigr),\\ R_y\,\vect m(z) = (C - Sz)^2\,\vect
m\Bigl(\frac{Cz + S}{C - Sz}\Bigr) .\end{gathered}$$

These two and [](#eq:boost-z) all have the form

$$\boxed{\;P\,\vect m(z) = (A_{21}z + A_{22})^2\,\vect m\Bigl(\frac{A_{11}z + A_{12}}{A_{21}z + A_{22}}\Bigr), \quad \det A
= 1 ,\;} \label{eq:mobius}$$

with a table $A$ of two rows of complex numbers whose rows are $(e^{i\psi/2}, 0)$ and $(0, e^{-i\psi/2})$ for the turn
about $\hat z$, $(C, S)$ and $(-S, C)$ for the turn about $\hat y$, and $(e^{\obs\eta/2}, 0)$ and $(0, e^{-\obs\eta/2})$ for
the boost. The map $z \to (A_{11}z + A_{12})/(A_{21}z + A_{22})$ is a **Möbius map**, a ratio of two linear functions of
$z$, the map by which one invertible table of two rows moves a star in
[section 8.4](/tutorial/quantum/spin/#the-petrov-types-are-the-families-of-entanglement-of-the-four-spins). The form
survives a product. If $P_1$, with the table $A$, sends $z$ to $z_1$, and $P_2$, with the table $B$, sends $z_1$ to $z_2$,
then $P_2P_1\vect m(z) = (A_{21}z + A_{22})^2(B_{21}z_1 + B_{22})^2\,\vect m(z_2)$, and

$$\begin{aligned}(A_{21}z + A_{22})(B_{21}z_1 + B_{22}) = {}&B_{21}(A_{11}z + A_{12})\\ &+ B_{22}(A_{21}z + A_{22})\end{aligned}$$

is linear in $z$, with the second row of the product $BA$; the same multiplication gives $z_2$ as the Möbius map of $BA$,
whose determinant is again 1.
Every turn is a turn about $\hat z$, then about $\hat y$, then about $\hat z$, because the last two carry $\hat z$ to any
direction and what is left keeps $\hat z$ fixed. Every boost along a direction $\hat u$ is $R\Lambda R^{\mathsf T}$, with
$\Lambda$ the boost along $\hat z$ and $R$ a turn that carries $\hat z$ to $\hat u$ (section 9.3), and every change of
observer is a boost and a turn (section 6.6). So [](#eq:mobius) holds for every change of observer.

::: derivation
### The two turns as Möbius maps

The turn about $\hat z$ sends $(x, y)$ to $(x\cos\psi - y\sin\psi,\ x\sin\psi + y\cos\psi)$. On $\vect m(z)$ the first
component becomes $(1 - z^2)\cos\psi - i(1 + z^2)\sin\psi = e^{-i\psi} - z^2e^{i\psi}$ and the second $i(e^{-i\psi} +
z^2e^{i\psi})$, while the third stays $-2z$; taking out $e^{-i\psi}$ leaves $\vect m(ze^{i\psi})$. The turn about $\hat y$
sends $(x, z)$ to $(x\cos\theta + z\sin\theta,\ -x\sin\theta + z\cos\theta)$. With $\cos\theta = C^2 - S^2$, $\sin\theta
= 2CS$ and $C^2 + S^2 = 1$, the three components of $R_y\vect m(z)$ are

$$\begin{aligned}(C^2 - S^2)(1 - z^2) - 4CSz &= (C - Sz)^2 - (Cz + S)^2,\\ i(1 + z^2) &= i\bigl[(C - Sz)^2 + (Cz +
S)^2\bigr],\\ -2CS(1 - z^2) - 2(C^2 - S^2)z &= -2(Cz + S)(C - Sz) ,\end{aligned}$$

which are $(C - Sz)^2$ times the components of $\vect m$ at $(Cz + S)/(C - Sz)$.
:::

**The type is the same for every observer.** The quartic that the observer reads is $(P^{\mathsf T}\vect m(z))^{\mathsf
T}\curv{\mathcal W}(P^{\mathsf T}\vect m(z))$, as for the boost above, and $P^{\mathsf T} = P^{-1}$ is again a change of
observer, so by [](#eq:mobius) the new quartic is $(A_{21}z + A_{22})^4$ times the old one at $z' = (A_{11}z +
A_{12})/(A_{21}z + A_{22})$. We write the old one as a number times $\prod_k(z' - z_k)$ over its finite roots, with $n$
factors missing when $n$ roots lie at infinity. Each factor gives $(A_{21}z + A_{22})(z' - z_k) = (A_{11} - A_{21}z_k)z +
A_{12} - A_{22}z_k$, linear in $z$, and the $n$ factors $A_{21}z + A_{22}$ left over give $n$ roots at $z =
-A_{22}/A_{21}$, the point that the map sends to infinity. So a root of multiplicity $n$ becomes
one root of multiplicity $n$, at the point that the map carries onto it: coinciding directions stay together and
separate ones apart, and **the Petrov type is the same for every observer**. On the four spins of a reading (section 8.4)
the same map is one invertible table acting on every spin, so each type is a family of entanglement that no observer
changes. Type D flown along its axis does not change, because $z \to e^{\obs\eta}z$ leaves its roots $0$ and $\infty$ in place: the blind spot of section 9.3.

## One pixel reads the whole state of a moving body

A moving body's velocity, distance and mass follow from the readings of one pixel. We assume that **the body is round and
moves steadily**. Two frames enter, and we take their letters one at a time: the body's own frame holds $\hat n_0$, $R_*$
and $\obs{\vect\beta}$, and the pixel's frame holds $\vect r$ and $\obs{\vect v}$.

**In the body's frame** the body is at rest, at the distance $\sym{rest-frame-distance}{R_*}$ along the unit vector
$\sym{rest-direction}{\hat n_0}$ of section 6.3 from the pixel. Its reading is $\curv w(1 - 3\hat n_0\hat n_0^{\mathsf T})$
with $\curv w = G\matter M/R_*^3$, so its directions are $\pm\hat n_0$, each twice. The pixel moves through this frame with
the velocity $c\obs{\vect\beta}$, and $\obs\gamma = (1 - \obs\beta^2)^{-1/2}$. We write $a = \obs{\vect\beta}\cdot\hat n_0$,
a pure number, and split $\hat n_0 = (a/\obs\beta)\hat\beta + \vect n_\perp$ into its parts along and across
$\obs{\vect\beta}$.

**In the pixel's frame** each of the directions $\pm\hat n_0$ is aberrated as a ray (the last section). Section
[6.3](/tutorial/relativity/aberration/#one-step-of-appendix-c-the-directions-of-a-moving-body-are-its-directions-at-rest-aberrated)
did that algebra and found the two pairs,

$$\hat p_\pm = \frac{\pm\vect n_\perp + \obs\gamma(\pm a/\obs\beta - \obs\beta)\,\hat\beta}{\obs\gamma(1 \mp a)} ,$$

with the upper signs for $\sym{pnd-pairs}{\hat p_+}$ and the lower for $\hat p_-$. Adding the two lines over the common
denominator $\obs\gamma(1 - a^2)$, and subtracting them, gives the half sum and half difference,

$$\begin{gathered}
\tfrac12(\hat p_+ + \hat p_-) = \frac{a^2 - \obs\beta^2}{\obs\beta(1 - a^2)}\,\hat\beta + \frac{a}{\obs\gamma(1 -
a^2)}\,\vect n_\perp ,\\
\tfrac12(\hat p_+ - \hat p_-) = \frac{(a/\obs\gamma\obs\beta)\,\hat\beta + \vect n_\perp}{\obs\gamma(1 - a^2)} .
\end{gathered}$$

**The half difference points at where the body is now.** Section 6.3 found the vector from the pixel to the body's present
position, $\vect r = R_*[(a/\obs\gamma\obs\beta)\hat\beta + \vect n_\perp]$. Its squared length is $R_*^2[a^2/\obs\gamma^2\obs\beta^2
+ 1 - a^2/\obs\beta^2] = R_*^2(1 - a^2)$, because $1 - 1/\obs\gamma^2 = \obs\beta^2$. So the half difference is
$\vect r/\obs\gamma R_*(1 - a^2)$, a vector along the line to where the body is now.

**The half sum is the sideways velocity.** For the pixel the body moves with $\obs{\vect v} = -c\obs{\vect\beta}$, and
$\obs{\vect v}\cdot\vect r/c = -R_*a/\obs\gamma$. Its **sideways velocity** $\sym{sideways-velocity}{\obs{\vect v}_\perp}$,
in $\mathrm{m\,s^{-1}}$, is the part of $\obs{\vect v}$ across the line to $\vect r$, $\obs{\vect v} - (\obs{\vect
v}\cdot\vect r)\vect r/r^2$, so

$$\frac{\obs{\vect v}_\perp}{c} = -\obs\beta\hat\beta + \frac{a}{\obs\gamma(1 - a^2)}\Bigl(\frac{a}{\obs\gamma\obs\beta}\hat\beta +
\vect n_\perp\Bigr) .$$

Its part along $\vect n_\perp$ is that of the half sum, and its part along $\hat\beta$, $-\obs\beta +
a^2/\obs\gamma^2\obs\beta(1 - a^2)$, is with $1/\obs\gamma^2 = 1 - \obs\beta^2$ the half sum's $(a^2 - \obs\beta^2)/\obs\beta(1 -
a^2)$. Since $\hat p_+$ and $\hat p_-$ have length one, the half sum and the half
difference are at right angles and their squared lengths add to one. So, with $\sym{present-line}{\hat n}$ the unit vector
toward where the body is now,

$$\boxed{\;\begin{gathered}\tfrac12(\hat p_+ + \hat p_-) = \frac{\obs{\vect v}_\perp}{c},\\ \tfrac12(\hat p_+ - \hat
p_-) = \pm\Bigl(1 - \frac{\obs v_\perp^2}{c^2}\Bigr)^{1/2}\hat n ,\end{gathered}\;}$$

both in pure numbers.[^velocity] **Limit:** at zero speed the half sum vanishes and the half difference is $\pm\hat n$. **A check.** A body as in Figure [](/paper/#fig:stars), at $1.5$ along $-\hat x$ and moving along $+\hat y$ at $0.9c$, has the
directions $(\pm0.436, 0.9, 0)$, each twice: the half sum is $(0, 0.9, 0)$, and the half difference has the length $0.436 =
(1 - 0.81)^{1/2}$ (Figure [](#fig:moving-pairs)).

**Distance, approach and mass.** The rest of the state follows from how the reading changes. The present position moves
with $\obs{\vect v}$, and only the part across the line turns it, so the line turns at $\dot{\hat n} = \obs{\vect
v}_\perp/r$, the sideways velocity over the distance. This gives $r$, and fixes the sign of $\hat n$. The repeated eigenvalue $\curv w$ is the same for every observer (section
9.3), so the pixel reads $\curv w = G\matter M/R_*^3$, with the relation of section
[6.1](/tutorial/relativity/lorentz/#a-moving-ruler-is-shorter-along-its-motion-and-distances-in-a-bodys-own-frame-are-longer)

$$R_*^2 = \obs\gamma^2\Bigl(r^2 - \frac{|\obs{\vect v}\times\vect r|^2}{c^2}\Bigr) .$$

The vector $\obs{\vect v}\times\vect r$ is constant along the path, since $\dot{\vect r} = \obs{\vect v}$ and $\obs{\vect
v}\times\obs{\vect v} = 0$. Differentiating in time with $\obs\gamma$ fixed gives $R_*\dot R_* = \obs\gamma^2r\dot r$, and
$\dot{\curv w}/\curv w = -3\dot R_*/R_*$, so

$$\frac{\dot{\curv w}}{\curv w} = -\frac{3r\dot r}{r^2 - |\obs{\vect v}\times\vect r|^2/c^2} = -\frac{3\dot r}{r\,(1 -
\obs v_\perp^2/c^2)} ,$$

because $|\obs{\vect v}\times\vect r| = \obs v_\perp r$. Solving for $\dot r$, and writing $\matter M = \curv wR_*^3/G$
(the problem of section 6.1), gives

$$\begin{gathered}
r = \frac{\obs v_\perp}{|\dot{\hat n}|}, \qquad \dot r = -\frac{r}{3}\Bigl(1 - \frac{\obs v_\perp^2}{c^2}\Bigr)\frac{\dot{\curv
w}}{\curv w},\\
\matter M = \frac{\curv w\,\obs\gamma^3 r^3}{G}\Bigl(1 - \frac{\obs v_\perp^2}{c^2}\Bigr)^{3/2}.
\end{gathered}$$

The rate $\dot r$ is the velocity along the line, so $\obs{\vect v} = \obs{\vect v}_\perp + \dot r\,\hat n$ and with it
$\obs\gamma$ are known: position, velocity and mass, seven numbers.[^state] **Limit:** for a slow body, $\obs\gamma \to 1$ and
$\matter M = \curv wr^3/G$, the mass of a body at rest at the distance $r$.

**Coming straight on.** A body moving along the line to the pixel has no sideways velocity, its line does not turn, and it
cannot be ranged. Its reading keeps the form $\curv w(1 - 3\hat n\hat n^{\mathsf T})$, the radial blind spot of section 9.3,
so its tide along the line, $\sym{line-tide}{\curv\tE_\parallel} = -2\curv w$ in $\mathrm{s^{-2}}$, is $-2G\matter
M/\obs\gamma^3r^3$, since $R_* = \obs\gamma r$ on the line. We assume that **$\curv\tE_\parallel = K/r^3$ with a constant
$K$**, which holds exactly for a body that **coasts**, keeping its speed, and closely for one whose speed changes, as long
as $\obs\gamma^2r|\ddot r| \ll c^2$.[^contact] Differentiating once and twice gives $\dot{\curv\tE}_\parallel =
-3Kr^{-4}\dot r$ and $\ddot{\curv\tE}_\parallel = K(12r^{-5}\dot r^2 - 3r^{-4}\ddot r)$, so

$$-\frac{r}{\dot r} = \frac{3\,\curv\tE_\parallel}{\dot{\curv\tE}_\parallel}, \qquad \frac{\curv\tE_\parallel\,\ddot{\curv\tE}_\parallel}{\dot{\curv\tE}_\parallel^2}
= \frac43 - \frac{r\ddot r}{3\dot r^2} .$$

The first ratio is the **time to contact**, $-r/\dot r$, read from the tide and its rate alone. **Numbers.** A person of 70
kg, 5 m away, makes a tide along the line of $-7.5\times10^{-11}\unit{s^{-2}}$, 125 times weaker than at a metre. Walking
toward the pixel at $0.3\unit{m\,s^{-1}}$, the person arrives in $16.7\unit{s}$. The second ratio is $1.33$ if the person
coasts, $2.26$ if they speed up toward the pixel at $0.05\unit{m\,s^{-2}}$ ($\ddot r = -0.05\unit{m\,s^{-2}}$), and $0.41$
if they brake at the same rate: above $\tfrac43$ when driven, below when braking.

![Look first at the arrow from the pixel to the midpoint: a body moving across the line at $0.9c$ folds both pairs of
directions toward its motion, and their half sum is its sideways velocity over $c$, while their half difference lies along
the line to where it is now. Directions computed from the boosted reading.](tut-moving-pairs){#fig:moving-pairs}

## The principal null directions are the roots of Majorana's polynomial {#the-four-directions-are-the-readings-majorana-stars}

Section [8.4](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky) drew a spin
two as four points on the sphere, the roots of Majorana's polynomial $p(z)$, whose factors for a spin two are 1, $-2$,
$\sqrt6$, $-2$ and 1, and derived them as an overlap with the opposite coherent state. We write the reading with the five tables of 9.1 about $\hat z$, $\curv{\mathcal W} =
\sum_m\curv c_mT_m$, and use $\vect m(z)\cdot\vect m = -\sqrt2z^2$, $\vect m(z)\cdot\vect m^* = \sqrt2$ and $\vect
m(z)\cdot\hat z = -2z$ for the $\vect m = (1, i, 0)/\sqrt2$ of 9.1. Each table gives one power of $z$:

$$\begin{aligned}\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z) = {}&2\curv c_2z^4 + 4\sqrt2\,\curv c_1z^3 +
12\curv c_0z^2\\ &- 4\sqrt2\,\curv c_{-1}z + 2\curv c_{-2} .\end{aligned}$$

In the standard phases the spin states of weights 2 to $-2$ are the tables of length one $T_2$, $-T_1/\sqrt2$,
$T_0/\sqrt6$, $T_{-1}/\sqrt2$ and $T_{-2}$, so the reading's components are $\curv c_2$, $-\sqrt2\,\curv c_1$,
$\sqrt6\,\curv c_0$, $\sqrt2\,\curv c_{-1}$ and $\curv c_{-2}$. Twice their products with Majorana's factors are the coefficients above, so the quartic is exactly twice Majorana's
polynomial, and **the principal null directions are the roots of the reading's Majorana polynomial** [@Bruno2019].
**Check.** A wave along $\hat z$ has only $\curv c_2$, and $2\curv c_2z^4$ puts its four directions at $z = 0$.

**The standard phases.** We want the signs that tie the five tables to the five states of four spins. On the states of
section 8.4 the **lowering table** $S_- = S_x - iS_y$ turns one spin from up to down, in every way at once. On the sum of
all arrangements with $k$ spins up out of $N$ it gives $N - k + 1$ times the sum with $k - 1$ up, since each arrangement
with $k - 1$ up comes from the $N - k + 1$ arrangements with one more spin up. With the lengths of the two sums, $S_-$
carries $|2, m\rangle$ to $\sqrt{(2 + m)(3 - m)}$ times $|2, m - 1\rangle$, a positive multiple: the factors 2, $\sqrt6$,
$\sqrt6$ and 2. On a reading, $S_k\curv{\mathcal W} = [iL_k, \curv{\mathcal W}]$ (section
[8.4](/tutorial/quantum/spin/#a-reading-turns-as-a-spin-two)), so $S_-\curv{\mathcal W} = [X, \curv{\mathcal W}]$ with $X =
L_y + iL_x$. Multiplying out with $(L_k)_{ij} = -\epsilon_{kij}$, the table $X$ sends $\vect m$ to $-\sqrt2\,\hat z$, $\hat z$
to $\sqrt2\,\vect m^*$, and $\vect m^*$ to zero. Since $X^{\mathsf T} = -X$, a table $\vect a\vect b^{\mathsf T} + \vect b\vect
a^{\mathsf T}$ goes to $(X\vect a)\vect b^{\mathsf T} + \vect a(X\vect b)^{\mathsf T} + (X\vect b)\vect a^{\mathsf T} + \vect
b(X\vect a)^{\mathsf T}$, and with $\vect m\vect m^{*\mathsf T} + \vect m^*\vect m^{\mathsf T} = 1 - \hat z\hat z^{\mathsf
T}$,

$$\begin{gathered}S_-T_2 = -\sqrt2\,T_1, \qquad S_-T_1 = -\sqrt2\,T_0,\\ S_-T_0 = 3\sqrt2\,T_{-1}, \qquad S_-T_{-1} =
2\sqrt2\,T_{-2} .\end{gathered}$$

So $S_-$ carries $T_2$ to $2(-T_1/\sqrt2)$, that to $\sqrt6\,(T_0/\sqrt6)$, that to $\sqrt6\,(T_{-1}/\sqrt2)$, and that
to $2T_{-2}$: the five tables of length one above, lowered by the same positive factors as the states of four spins.
Both sets have length one and the same spin components, and $S_+$ is the conjugate transpose of $S_-$ in both, so the
three spin tables act on them alike, and a reading and a state of four spins with these components turn alike. That
fixes the phases, up to one factor for all five, which moves no root.

## A repeated direction is a null eigenvector, so each pattern is one shape

We want to prove the table of Petrov types: that the pattern of a reading's four directions and the shape of its table
(section 9.2) decide each other. We write $q(z) = \vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m(z)$ for the quartic.

**A repeated root.** A root $z_k$ is repeated exactly when $q(z_k) = 0$ and $q'(z_k) = 0$, by the argument of section
[9.2](/tutorial/one-point/complex-symmetric/#one-combination-of-the-two-numbers-marks-a-repeated-eigenvalue). Because
$\curv{\mathcal W}$ is symmetric, $q'(z) = 2\,\vect m(z)^{\mathsf T}\curv{\mathcal W}\vect m'(z)$, with $\vect m'(z) = (-2z,
2iz, -2)$ the derivative of $\vect m(z)$. So $z_k$ is repeated exactly when the vector $\curv{\mathcal W}\vect m(z_k)$ is
orthogonal, in the unconjugated sense, to both $\vect m(z_k)$ and $\vect m'(z_k)$. The vector $\vect m(z_k)$ is itself
orthogonal to both, since $\vect m\cdot\vect m = 0$ and, differentiating, $2\vect m\cdot\vect m' = 0$. The two are
independent, since $\vect m'\cdot\vect m' = 4$ while $\vect m$ is null. Two independent conditions on a vector of three
components leave one direction, so $\curv{\mathcal W}\vect m(z_k)$ is a multiple of $\vect m(z_k)$:

$$\boxed{\;z_k \text{ is a repeated root} \iff \vect m(z_k) \text{ is an eigenvector of } \curv{\mathcal W} .\;}$$

A root at infinity is first brought to a finite place by a turn, which keeps the pattern (the section on moving the
pixel).

**From a repeated root to the shape.** We turn the axes so that the repeated direction is $+\hat z$, the root $z = 0$. A
double root at $z = 0$ needs the last two coefficients of the quartic above to vanish, $\curv c_{-2} = \curv c_{-1} = 0$,
so that $\curv{\mathcal W} = \curv c_0T_0 + \curv c_1T_1 + \curv c_2T_2$ and

$$q(z) = 2z^2\bigl(\curv c_2z^2 + 2\sqrt2\,\curv c_1z + 6\curv c_0\bigr) .$$

With $T_0 = 3\hat z\hat z^{\mathsf T} - 1$, $T_1 = \vect m\hat z^{\mathsf T} + \hat z\vect m^{\mathsf T}$, $T_2 = \vect m\vect
m^{\mathsf T}$ and the products $\vect m\cdot\vect m = \vect m\cdot\hat z = 0$ and $\vect m\cdot\vect m^* = 1$, the table
acts on the three vectors $\vect m$, $\hat z$ and $\vect m^*$ as

$$\begin{aligned}\curv{\mathcal W}\vect m &= -\curv c_0\,\vect m,\\ \curv{\mathcal W}\hat z &= 2\curv c_0\,\hat z + \curv
c_1\vect m,\\ \curv{\mathcal W}\vect m^* &= -\curv c_0\,\vect m^* + \curv c_1\hat z + \curv c_2\vect m .\end{aligned}$$

Written in these three vectors it is triangular, so its eigenvalues are $-\curv c_0$, $2\curv c_0$ and $-\curv c_0$: a
repeated root gives the repeated eigenvalue $\curv w = -\curv c_0$. Three cases follow.

- **$\curv c_0 \neq 0$.** The test of section 9.2, $(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w) = (\curv{\mathcal
  W} + \curv c_0)(\curv{\mathcal W} - 2\curv c_0)$, sends $\vect m$ and $\hat z$ to zero and $\vect m^*$ to $(\curv c_1^2 -
  3\curv c_0\curv c_2)\,\vect m$, so it is $(\curv c_1^2 - 3\curv c_0\curv c_2)\,\vect m\vect m^{\mathsf T}$. The other two
  roots solve $\curv c_2z^2 + 2\sqrt2\,\curv c_1z + 6\curv c_0 = 0$, whose discriminant is $8(\curv c_1^2 - 3\curv c_0\curv
  c_2)$, and neither is zero, since $6\curv c_0 \neq 0$. So the other two coincide exactly when the table can be
  diagonalized: two pairs go with shape D, and two together and two apart with shape II. (If $\curv c_2 = 0$, a root lies
  at infinity, and the rule still holds.)
- **$\curv c_0 = 0$ and $\curv c_1 \neq 0$.** All eigenvalues are zero, $q(z) = 2z^3(\curv c_2z + 2\sqrt2\,\curv c_1)$ has
  three roots together and one apart, and $\curv{\mathcal W}^2 = \curv c_1^2\,\vect m\vect m^{\mathsf T} \neq 0$, because
  $T_1^2 = \vect m\vect m^{\mathsf T}$ while $T_1T_2$, $T_2T_1$ and $T_2^2$ vanish: shape III.
- **$\curv c_0 = \curv c_1 = 0$.** Then $q(z) = 2\curv c_2z^4$ and $\curv{\mathcal W} = \curv c_2\,\vect m\vect m^{\mathsf T}$,
  with $\curv{\mathcal W}^2 = 0$: shape N, or O if $\curv c_2 = 0$ too.

**From a repeated eigenvalue to a repeated root.** If the reading has a repeated eigenvalue $\curv w$, it has a null
eigenvector. When the eigenvectors of $\curv w$ fill a plane, of the vectors $s\mathbf a + t\mathbf b$, the condition
$(s\mathbf a + t\mathbf b)\cdot(s\mathbf a + t\mathbf b) = 0$ is a quadratic in $s/t$ with a complex root, unless $\mathbf
a\cdot\mathbf a = 0$ and $\mathbf a$ is null already, so the plane holds a null vector. Otherwise the table cannot be diagonalized, and section
9.2's lowest vanishing product of factors has the factor $\curv{\mathcal W} - \curv w$ twice. Leaving one of them out gives
a table that is not zero, so some vector $\mathbf v = (\curv{\mathcal W} - \curv w)\mathbf u$ is not zero while
$(\curv{\mathcal W} - \curv w)\mathbf v = 0$. Then $\mathbf v$ is an eigenvector and $\mathbf v\cdot\mathbf v = \mathbf
u\cdot(\curv{\mathcal W} - \curv w)\mathbf v = 0$. Either way, by the box, the reading has a repeated root.

**Together.** A repeated root gives a repeated eigenvalue, and a repeated eigenvalue a repeated root. So four separate
directions go with three different eigenvalues, type I, and each pattern with a repeated direction goes with the shape
found above: **two together with II, two pairs with D, three together with III and four together with N**. This is
the table of the types, Penrose's correspondence. **A number.** The mass with a weak wave along its line of section
9.2 has $\curv c_0 = -\curv w = -0.125$, $\curv c_1 = 0$ and $\curv c_2 = 0.05$, so the product is $3\curv w\curv
c_2\,\vect m\vect m^{\mathsf T}$, with entries of size $0.0094$ as found there, and the other two roots are $z^2 = -6\curv
c_0/\curv c_2 = 15$, the $\pm3.87$ of the section on types.

::: try {#stars}
Predict first: how many separate directions do two masses on one line through the pixel give? Choose *Two*, set the speed
to zero, and drag the second body onto that line and off it, watching the type. Then choose *One body* at $0.9c$ and
compare the midpoint of its two pairs, the arrow's tip, with the small ring, the body's sideways velocity over $c$.
:::

**The idea to keep: every reading picks out four directions on the sky, the roots of one quartic. They lie together for a
single wave, in two pairs for a single body at rest, and in general apart when more is pulling. Their pattern, Petrov's
type, describes the field, not the bodies. The directions move as rays of light, so a moving body's two pairs have its
sideways velocity as their midpoint, and how the reading changes gives its distance and mass.**

::: problems
### Practice

**[9.4]** A reading has $1 - 6J^2/I^3 = 0$. Is it one body?

::: solution
Not necessarily. It is type D or II; type D needs $(\curv{\mathcal W} - \curv w)(\curv{\mathcal W} + 2\curv w) = 0$ too, and
one body needs $\curv w > 0$ besides. Even then it can be two bodies on one line.
:::

**[9.4]** Find the four principal null directions of $\curv{\mathcal W} = \mathrm{diag}(-2, 1, 1)$, a mass on the $x$ axis
in units of $G\matter M/r^3$, from the quartic.

::: solution
With $\vect m(z) = (1 - z^2, i(1 + z^2), -2z)$, the quartic is $-2(1 - z^2)^2 - (1 + z^2)^2 + 4z^2 = -3z^4 + 6z^2 - 3 =
-3(z^2 - 1)^2$. Its roots $z = \pm1$, each twice, are $\pm\hat x$, the line to the mass. None is at infinity, since the
coefficient of $z^4$ is not zero, and $-1 = -1/\bar z$ for $z = 1$, as at rest it must be.
:::

**[9.4]** Find the Möbius map of a half turn about $\hat y$, and check that it carries the direction $+\hat z$ to $-\hat
z$ and $+\hat x$ to $-\hat x$.

::: solution
At $\theta = \pi$, $C = 0$ and $S = 1$, so $z \to (Cz + S)/(C - Sz) = -1/z$. The direction $+\hat z$, $z = 0$, goes to
infinity, which is $-\hat z$, and $+\hat x$, $z = 1$, goes to $z = -1$, which is $-\hat x$, as a half turn about $\hat y$
must do.
:::

**[9.4]** A reading is $\curv{\mathcal W} = T_0 + \sqrt6\,T_1 + 2T_2$ about $\hat z$, in any unit of tide. Find its type and
its principal null directions.

::: solution
Here $\curv c_0 = 1$, $\curv c_1 = \sqrt6$ and $\curv c_2 = 2$, so $\curv c_1^2 - 3\curv c_0\curv c_2 = 6 - 6 = 0$: type D,
with the eigenvalues $-1$, $-1$ and 2. The quartic is $2z^2(2z^2 + 4\sqrt3\,z + 6) = 4z^2(z + \sqrt3)^2$, so one double
direction is $+\hat z$ and the other is at $z = -\sqrt3$, where $|z| = \tan(\vartheta/2)$ gives $\vartheta = 120°$ and
$\arg z = \pi$: the direction $(-0.866, 0, -0.5)$. The two pairs are not opposite, so the reading is not real: no
observer at rest among masses at rest reads it.
:::

### Stretch

Combine with section 6.3. A mass at rest is seen by a pixel moving at $0.6c$ at right angles to the line to it. Where does
the pixel see the two pairs, and how far apart are they?

::: solution
For the pixel the body moves at $0.6c$ the other way, across the line, so $\obs v_\perp = 0.6c$. The half sum has the length
0.6 along the body's velocity and the half difference the length $(1 - 0.36)^{1/2} = 0.8$ along the line, so each pair leans
$\arctan(0.6/0.8) = 36.9°$ from the line toward the body's motion. The pairs are $180° - 2(36.9°) = 106.3°$ apart instead of
opposite.
:::

### The camera

Check the second ratio of the time-to-contact formula for a body that coasts straight at the pixel at any speed, with
$\curv\tE_\parallel = -2G\matter M/\obs\gamma^3r^3$.

::: solution
Coasting keeps $\obs\gamma$ fixed and $\ddot r = 0$, so $\curv\tE_\parallel = K/r^3$ with $K = -2G\matter M/\obs\gamma^3$.
Then $\dot{\curv\tE}_\parallel = -3K\dot r/r^4$ and $\ddot{\curv\tE}_\parallel = 12K\dot r^2/r^5$, so the ratio is
$(K/r^3)(12K\dot r^2/r^5)/(9K^2\dot r^2/r^8) = \tfrac43$, at every speed.
:::
:::

::: paper
- Section VIII's [*Principal null directions*](/paper/#par:principal-null-directions) and Figure
  [](/paper/#fig:stars): the quartic, the types, and $1 - 6J^2/I^3$ and its 0.55.
- Section VIII's [*What no reading can tell*](/paper/#par:what-no-reading-can-tell): two masses on a line, the type III
  table.
- Section VIII's [*The state of a moving body*](/paper/#par:the-state-of-a-moving-body) and Appendix C's [*The principal
  null directions of a moving body*](/paper/#par:the-principal-null-directions-of-a-moving-body): the midpoint, the state
  and the time to contact.
:::

::: deeper
- R. Penrose, "A spinor approach to general relativity" [@Penrose1960]: the principal null directions as the roots of a
  quartic, and the types as their patterns.
- R. Penrose and W. Rindler, *Spinors and Space-Time*, vol. 1 (Cambridge, 1984), sections 1.2 to 1.4: the sky as the
  complex plane, and boosts as Möbius maps.
- On Majorana's representation [@Bruno2019] and the types as classes of entanglement [@BengtssonZyczkowski2017; @Kam2026].
:::

[^fig]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, whose Fig. [](/paper/#fig:stars) draws
    this sky.

[^stars]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:stars).

[^four]: Equal pulls at right angles give $1 - 6J^2/I^3 = 0$ although the bodies are two.

[^velocity]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:star-velocity); the proof is in its Appendix C, equations [](/paper/#eq:proof-stars) and
    [](/paper/#eq:proof-midpoint).

[^state]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:moving-state).

[^contact]: The $r^{-3}$ law is exact only while $\obs\gamma$ stays fixed; for the person below, $\obs\gamma^2r|\ddot
    r|/c^2 = 2.8\times10^{-18}$. First shown in *The gravitational camera* (Mohsenvand
    2026), Sec. VIII, as its equation [](/paper/#eq:contact).
