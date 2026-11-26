---
id: '3.6'
title: 'Bessel functions and the Airy pattern'
question: 'What is the function $2J_1(x)/x$ that draws a point in the near-field image, why does a round opening need it where a slit needs only $\sin x/x$, and how wide is its pattern?'
part: '3'
requires: ['1.5b', '2.2', '2.6', '3.5']
paper: [sec:near-field, eq:cutoff, eq:resolution, sec:waves, fig:which-way, sec:no-lens, eq:diffraction, fig:array]
figures: [fig:which-way]
live: [round-pupil, array]
depth: A
---

A filter that keeps every ripple along a row up to a cut-off draws a point as $\sin u/u$
([section 3.5](/tutorial/noise/wiener-filter/)). A camera, however, is a plane, and the ripples that it keeps fill a
disc. The finest ripple that survives the noise has a wavenumber $q_c/z$, where $z$ is the depth of a mass below the
camera, in metres, and $q_c$ is a pure number found in section 3.7. What does a disc of ripples draw for a point? The
answer, $2J_1(x)/x$, is the diffraction pattern of a round pupil of radius $q_c/z$, and it is also the Airy spot that the array of
[section 5.3](/tutorial/waves/diffraction/) draws for a pair of turning balls.[^airy] So we ask: what is the function $2J_1(x)/x$, why
does a round opening need it where a slit needs only $\sin x/x$, and how wide is its pattern? Section 3.7 uses the
answer to find the blur of the near-field camera.

::: plain
A ripple on a flat sheet has parallel crests. Take the same ripple pointing in every direction at once and average
them. Every one has a crest at one chosen point, so they add up there; away from it they partly cancel, and what
remains is a ripple with circular crests, height one at the centre, and swings that fade outward. This is the Bessel
function $J_0$.

Any pattern that looks the same in every direction round a point is a sum of circular ripples. A round opening's sum is
a bright centre surrounded by faint rings, a little wider than the pattern of a slit of the same width. A lens of
diameter $D$ draws every star as the square of this pattern, with its first dark ring at the angle $1.22\lambda/D$,
where $\lambda$ is the wavelength. The gravitational camera draws a point as the pattern itself, not squared.
:::

## A pattern that looks the same in every direction is built from circular ripples

We want the Fourier transform of a pattern on a plane that looks the same in every direction round one point. A round
opening is such a pattern, and so is the blur of a camera that treats every direction alike.

Let $f(\vect a)$ be a pattern on the plane, with any unit, at the place $\vect a$ in metres. We assume that **$f$
depends only on the distance $a = |\vect a|$ from the origin**, and write it $f(a)$. Its transform is
$\tilde f(\vect k) = \int f(\vect a)\,e^{-i\vect k\cdot\vect a}\,\dd^2a$
([section 2.6](/tutorial/outside/fourier/)), where $\vect k$ is the wavevector of a ripple, in $\mathrm{m^{-1}}$, and
$k = |\vect k|$ its wavenumber. In polar coordinates the angle $\varphi$, in radians, is measured from the direction of
$\vect k$, so $\vect k\cdot\vect a = ka\cos\varphi$, and a patch with sides $\dd a$ and $a\,\dd\varphi$ has the
area $\dd^2a = a\,\dd a\,\dd\varphi$:

$$\tilde f(\vect k) = \int_0^\infty f(a)\,a\,\dd a\int_0^{2\pi}e^{-ika\cos\varphi}\,\dd\varphi .$$

The inner integral depends on $k$ and $a$ only through the pure number $u = ka$. Divided by $2\pi$, it is the average
of $e^{-iu\cos\varphi}$ over a whole turn, and we name that average.

**The definition.** The **Bessel function of order zero** is

$$\boxed{\begin{aligned}\sym{bessel-j0}{J_0}(u) &= \frac{1}{2\pi}\int_0^{2\pi}e^{iu\cos\varphi}\,\dd\varphi\\ &=
\frac{1}{2\pi}\int_0^{2\pi}\cos(u\cos\varphi)\,\dd\varphi .\end{aligned}} \label{eq:j0}$$

The sine part averages to zero: replacing $\varphi$ by $\pi - \varphi$ turns $\cos\varphi$ into $-\cos\varphi$ over
the same whole turn, so the integral of $\sin(u\cos\varphi)$ equals minus itself. So the sign in the exponent does not
matter, and $J_0$ is real, with $J_0(-u) = J_0(u)$.

**What it is.** The plane ripple $e^{i\vect k\cdot\vect a}$ runs along $\vect k$. The angle $\varphi$ lies between
$\vect a$ and $\vect k$, so with the place $\vect a$ fixed, the average over $\varphi$ is the average over every
direction in which the ripple could run. Thus $J_0(ka)$ is the value, at the distance $a$ from the origin, of a ripple
of wavenumber $k$ averaged over all its directions. All of these ripples have a crest at the origin, so they add up
there, and elsewhere they partly cancel. The average depends only on the distance, so its crests are circles: a
**circular ripple**. The figure draws one ripple, its turned copies and their average.

**The result.** Putting the definition into the transform gives

$$\boxed{\;\tilde f(k) = 2\pi\int_0^\infty f(a)\,J_0(ka)\,a\,\dd a .\;} \label{eq:hankel}$$

The transform depends only on $k$: a pattern that is the same in every direction has a transform that is the same in
every direction. This integral is the **Hankel transform** of order zero, and $J_0$ is the only new function that it
needs. The unit of $\tilde f$ is that of $f$ times a square metre, as in section 2.6. The same steps applied to the
inverse transform, with its $\dd^2k/(2\pi)^2$, give $f(a) = \frac1{2\pi}\int_0^\infty\tilde f(k)\,J_0(ka)\,k\,\dd k$: the
pattern is a sum of circular ripples.

**A number and a check.** At $u = 2.7$ the integral [](#eq:j0) gives $J_0(2.7) = -0.1424$: the averaged ripples have
passed from their crest at the centre into a trough. As a check, take the round Gaussian $e^{-a^2/2}$, the product
$e^{-a_1^2/2}\,e^{-a_2^2/2}$. By the [Gaussian pair](/tutorial/outside/fourier/) of section 2.6 with $\varepsilon = 1$,
$e^{-a_1^2/2} = \sqrt{2\pi}\,\delta_1(a_1)$ transforms to $\sqrt{2\pi}\,e^{-k_1^2/2}$, so the product transforms to
$2\pi\,e^{-k^2/2}$. Then [](#eq:hankel) requires $\int_0^\infty e^{-a^2/2}\,J_0(ka)\,a\,\dd a = e^{-k^2/2}$. At $k =
1.3$ the integral, computed numerically, is 0.42956, and $e^{-0.845} = 0.42956$.

**A non-example.** The shear of a point mass (section [1.5b](/tutorial/newton/complex-numbers/#the-shear-of-one-mass-is-a-square)) turns twice as we go
once round the mass, so it is not the same in every direction. Its transform depends on the direction of $\vect k$ and
needs Bessel functions of higher order.[^jn]

![Left, a plane ripple $\cos(\vect k\cdot\vect a)$ on a square, orange where it is above zero and blue where it is
below, with its wavevector $\vect k$ as an arrow across the crests; beside it, faint copies of the same ripple turned
in steps of 30°. Right, the average over all the directions, $J_0(ka)$, on the same colour scale: a crest of height 1
inside the first zero at $ka = 2.405$, a trough of $-0.403$ out to 5.520, and fainter rings beyond. The thin lines are
the zeros, and the lengths of the arrows are schematic.](tut-bessel-average){#fig:average}

## The circular ripple is a power series with only even powers

We want $J_0$ as a power series, to compute it and to see how it starts. We expand the exponential with the series of
section [1.5b](/tutorial/newton/complex-numbers/#the-shear-of-one-mass-is-a-square), $e^{iu\cos\varphi} = \sum_m (iu\cos\varphi)^m/m!$, and average each
term over the turn. The average of $\cos^m\varphi$ is zero for odd $m$, and for even $m = 2n$ the box below shows that

$$\bigl\langle\cos^{2n}\varphi\bigr\rangle = \frac{(2n)!}{4^n\,(n!)^2} .$$

The term with $m = 2n$ then gives $(iu)^{2n}/(2n)!$ times this, and $(iu)^{2n} = (-1)^nu^{2n}$, so the factorials
$(2n)!$ cancel:

$$\boxed{\begin{aligned}J_0(u) &= \sum_{n=0}^\infty\frac{(-1)^n}{(n!)^2}\Bigl(\frac u2\Bigr)^{2n}\\ &= 1 - \frac{u^2}{4} +
\frac{u^4}{64} - \frac{u^6}{2304} + \dots\end{aligned}} \label{eq:series}$$

The factor $(n!)^2$ makes the terms shrink fast, so the series converges for every $u$. At $u = 2.7$ its first ten
terms give $-0.142449370$, which agrees with the integral [](#eq:j0) to nine decimal places. For large $u$ the terms
first grow and then cancel, and the far form below is more useful.

**The limit.** At $u = 0$ the series gives $J_0(0) = 1$, the average of $e^0 = 1$ over all directions. Near the
centre, $J_0 \approx 1 - u^2/4$, because a ripple near its crest is $1 - (u\cos\varphi)^2/2$ and the average of
$\cos^2\varphi$ is $\tfrac12$.

::: derivation
### The average of a power of the cosine

We write $\cos\varphi = \tfrac12(e^{i\varphi} + e^{-i\varphi})$ and expand the power with the binomial theorem:

$$\cos^m\varphi = \frac{1}{2^m}\sum_{j=0}^m\binom mj e^{i(m - 2j)\varphi} .$$

The average of $e^{ip\varphi}$ over a whole turn is zero for every whole number $p \neq 0$, because its real and
imaginary parts run through $p$ whole turns and cancel, as in section
[2.6](/tutorial/outside/fourier/#across-a-plane-a-ripples-wavevector-points-across-its-crests). Only the term with $m - 2j = 0$ survives.
For odd $m$ there is no such term, and the average is zero. For $m = 2n$ it is the middle term, $j = n$, so

$$\bigl\langle\cos^{2n}\varphi\bigr\rangle = \frac{1}{4^n}\binom{2n}{n} = \frac{(2n)!}{4^n\,(n!)^2} .$$

The first values are 1, $\tfrac12$, $\tfrac38$ and $\tfrac5{16}$.
:::

## The circular ripple obeys Bessel's equation

We want an equation that $J_0$ obeys, since the properties that section 3.7 uses follow from it. A plane ripple
$e^{i\vect k\cdot\vect a}$ obeys $\nabla^2 f = -k^2f$, where $\nabla^2$ is the Laplacian along the plane, because its
two second derivatives bring down $-k_1^2 - k_2^2$ (section 2.6). The Laplacian is linear, so the average of such
ripples over the direction of $\vect k$, at fixed $k$, obeys the same equation. So

$$\nabla^2J_0(ka) = -k^2J_0(ka) .$$

**The Laplacian of a function of the distance.** Let $g(a)$ be any function of the distance alone
([section 2.2](/tutorial/outside/spherical-harmonics/) did this in space). The chain rule gives $\partial_ig = g'\,a_i/a$, with $i = 1, 2$ and the prime a
derivative with respect to $a$. We differentiate again, using $\partial_ia_i = 2$ in the plane and $a_ia_i = a^2$:

$$\begin{aligned}\nabla^2g &= \partial_i\Bigl(g'\,\frac{a_i}{a}\Bigr) = g''\,\frac{a_ia_i}{a^2} + g'\Bigl(\frac2a -
\frac{a_ia_i}{a^3}\Bigr)\\ &= g'' + \frac{g'}{a} .\end{aligned}$$

In three dimensions section 2.2 found $g'' + 2g'/a$. The 2 becomes 1 in the plane, because a circle's length grows as
$a$ while a sphere's area grows as $a^2$.

**The equation.** We put $g = J_0(ka)$ and change to $u = ka$, so that each derivative brings a factor $k$:
$k^2(J_0'' + J_0'/u) = -k^2J_0$, with primes now derivatives with respect to $u$. Multiplying by $u^2/k^2$ gives

$$\boxed{\begin{gathered}u^2J_0'' + uJ_0' + u^2J_0 = 0,\\ \text{that is,}\quad \bigl(uJ_0'\bigr)' = -uJ_0 .\end{gathered}}
\label{eq:bessel}$$

This is **Bessel's equation** of order zero; the second form is the first divided by $u$, since $(uJ_0')' = uJ_0'' +
J_0'$.

**A check on the series.** A term $c_nu^{2n}$ of [](#eq:series) gives $u^2J_0'' + uJ_0'$ the term
$\bigl(2n(2n - 1) + 2n\bigr)c_nu^{2n} = 4n^2c_nu^{2n}$, while $u^2J_0$ contributes $c_{n-1}u^{2n}$. So the equation
holds if $c_n = -c_{n-1}/4n^2$ for every $n \ge 1$. The coefficients $(-1)^n/\bigl(4^n(n!)^2\bigr)$ do exactly that,
since going from $n - 1$ to $n$ multiplies $4^n(n!)^2$ by $4n^2$. Bessel's equation has a second solution, but it grows
without bound at the centre, so it cannot be an average of ripples, which never exceeds one.[^y0]

## The function of order one adds up the circular ripple over a disc

We want the integral $\int_0^uJ_0(t)\,t\,\dd t$, because the transform [](#eq:hankel) of a round opening is this
integral. Bessel's equation in its second form gives it once we name $-J_0'$.

**The definition.** The **Bessel function of order one** is

$$\sym{bessel-j1}{J_1}(u) = -J_0'(u) .$$

The second form of [](#eq:bessel) is then $-(uJ_1)' = -uJ_0$, so

$$\boxed{\;\frac{\dd}{\dd u}\bigl(uJ_1(u)\bigr) = u\,J_0(u) .\;} \label{eq:uj1}$$

**The integral.** The function $J_0$ is even, so its slope at zero is zero and $J_1(0) = 0$. We integrate [](#eq:uj1)
from 0 to $u$, and the term $0\cdot J_1(0)$ at the lower end vanishes:

$$\boxed{\;\int_0^uJ_0(t)\,t\,\dd t = u\,J_1(u) .\;} \label{eq:integral}$$

Section 3.7 defines $J_1$ the other way round, as the function with [](#eq:uj1) and $J_1(0) = 0$.[^bessel-37] The two
agree: integrating [](#eq:uj1) from zero fixes $uJ_1$ as the integral above, so only one function has both properties.

**Near zero.** Differentiating [](#eq:series) term by term gives

$$\begin{aligned}J_1(u) &= \sum_{n=0}^\infty\frac{(-1)^n}{n!\,(n + 1)!}\Bigl(\frac u2\Bigr)^{2n+1}\\ &= \frac u2 - \frac{u^3}{16} +
\frac{u^5}{384} - \dots ,\end{aligned}$$

so $J_1(u) \approx u/2$ for small $u$. At $u = 0.01$, $J_1 = 0.00499994$, short of $u/2$ by $u^3/16 = 6\times10^{-8}$.

**A number and a limit.** At $u = 2.7$, $J_1(2.7) = 0.44160$, so $uJ_1(u) = 1.19232$, and the integral of
[](#eq:integral), computed numerically, is 1.19232. For small $u$, $J_0 \approx 1$ and the integral is $u^2/2$, which
is $u$ times $J_1 \approx u/2$.

**What it means.** A thin ring of radius $t$ and width $\dd t$ has the area $2\pi t\,\dd t$, so $2\pi uJ_1(u)$ is the
circular ripple added up over the disc of radius $u$. As the disc grows it takes in the positive and negative rings in
turn: the sum grows until $J_0$ changes sign at $u = 2.405$, where $uJ_1 = 1.248$, and falls back to zero at the first
zero of $J_1$, where the centre and the first negative ring balance. Later rings have more area, so the swings grow as
$\sqrt u$: $uJ_1$ reaches $-1.878$ at 5.520 and $2.349$ at 8.654.

## The zeros of the two functions alternate

We want the places where the two functions vanish, because the dark rings of a round opening's pattern lie there.
The function $J_0$ vanishes first at[^zeros]

$$u = 2.405,\quad 5.520,\quad 8.654,\quad 11.792,$$

and $J_1$ at

$$u = 3.832,\quad 7.016,\quad 10.173 .$$

**Why they alternate.** Rolle's theorem says that a smooth function which vanishes at two places has zero slope between
them. Between two zeros of $J_0$ there is a place where $J_0' = -J_1$ vanishes, a zero of $J_1$. Between two zeros of
$uJ_1$ there is a zero of its slope, which by [](#eq:uj1) is $uJ_0$, a zero of $J_0$. Since $uJ_1$ also vanishes at
$u = 0$, the first zero of $J_0$ comes before the first zero of $J_1$, and the zeros alternate.

The zeros of $J_1$ are where $J_0$ has its troughs and crests: the deepest trough of $J_0$ is $-0.403$ at 3.832,
between 2.405 and 5.520. The gaps between successive zeros of $J_0$ are 3.115, 3.134 and 3.138, and approach
$\pi$.[^drum] The figure below draws the two functions with their zeros.

## Far from the centre the circular ripple is a fading cosine

**The far form.** For large $u$ we state, with a plausibility argument,

$$\boxed{\;J_0(u) \approx \sqrt{\frac{2}{\pi u}}\,\cos\Bigl(u - \frac\pi4\Bigr)\;} \label{eq:far}$$

This is a cosine whose zeros are $\pi$ apart and whose height falls as $u^{-1/2}$. The argument goes back to the
average [](#eq:j0). The phase $u\cos\varphi$ changes slowest near $\varphi = 0$ and $\varphi = \pi$, the directions in
which the ripple runs straight along $\vect a$ or against it. Near $\varphi = 0$, $u\cos\varphi \approx u -
u\varphi^2/2$, so the ripples stay within about a radian of the phase $u$ only while $\varphi$ is smaller than about
$\sqrt{2/u}$. Ripples from other directions swing through many turns and cancel. So the average is about the share of
directions that stay in step, which falls as $u^{-1/2}$. These bring $e^{iu}$ from near $\varphi = 0$ and $e^{-iu}$ from
near $\varphi = \pi$, and together they make a cosine of $u$.

**The approximation.** The first term left out, stated without proof, is $\sqrt{2/\pi u}\,\sin(u - \pi/4)/8u$: at most
$1/8u$ of the height of the cosine, 1.25% at $u = 10$. At $u = 10$ the sine is only 0.21, so this term is 0.0007, most
of the difference between the far form, $-0.2468$, and the exact $-0.2459$. The zeros of [](#eq:far) fall at $(n -
\tfrac14)\pi$, which is 2.356, 5.498 and 8.639, close to the true ones. It fails near the centre: at $u = 2.7$ it gives
$-0.164$ against $-0.142$, and at $u = 0$ it is infinite where $J_0 = 1$.

**The far form of $J_1$.** Since $J_1 = -J_0'$, differentiating [](#eq:far) and dropping the slope of the factor
$u^{-1/2}$, smaller by $1/2u$, gives $J_1(u) \approx \sqrt{2/\pi u}\,\sin(u - \pi/4)$. At $u = 10$ it gives 0.0526 against
the exact 0.0435: the error, 0.009, is 4% of the cosine's height, but $u = 10$ lies near the zero of $J_1$ at 10.173,
where the value itself is small.

::: gap
The sketch skips the size of the phase. Adding up the directions near $\varphi = 0$ needs
$\int_{-\infty}^\infty e^{-iu\varphi^2/2}\,\dd\varphi = \sqrt{2\pi/u}\,e^{-i\pi/4}$, the Gaussian integral of section 2.6 with
an imaginary width, stated without proof. It supplies the factor $\sqrt{2/\pi u}$ and the shift $\pi/4$. The
correction of order $1/u$ is not derived.
:::

![The circular ripple $J_0$ (orange) and $J_1 = -J_0'$ (blue) against $u$, with their zeros marked on the line at zero
and numbered on the axis below. The zeros alternate, and the deepest trough of $J_0$, $-0.403$, lies at $u = 3.832$,
the first zero of $J_1$. Both functions fade inside the dashed envelope $\pm\sqrt{2/\pi u}$ of the far
form.](tut-bessel-j0-j1){#fig:zeros}

## A round opening transforms to a wider pattern than a slit

We want the transform of a round opening, because it is the opening of a lens, and because it is the set of ripples
that the filter of section 3.7 keeps.

**The disc.** We take $f = 1$ for $a < R$ and $f = 0$ beyond, where $R$ is the radius of the opening, in metres, and
$f$ is a pure number: the opening lets everything through inside and nothing outside. By [](#eq:hankel), and with the
substitution $t = ka$, so that $a\,\dd a = t\,\dd t/k^2$,

$$\begin{aligned}\tilde f(k) &= 2\pi\int_0^RJ_0(ka)\,a\,\dd a\\ &= \frac{2\pi}{k^2}\int_0^{kR}J_0(t)\,t\,\dd t\\ &= \frac{2\pi}{k^2}\,kR\,J_1(kR),\end{aligned}$$

where the last step is [](#eq:integral). We write $x = kR$, a pure number and not a position, and take out the
opening's area:

$$\boxed{\;\tilde f(k) = \pi R^2\,\frac{2J_1(x)}{x},\qquad x = kR .\;} \label{eq:disc}$$

The units agree: $\pi R^2$ is in square metres, the unit of the dimensionless $f$ times a square metre. As $k \to 0$,
$J_1(x) \approx x/2$ makes $2J_1(x)/x \to 1$, so $\tilde f(0) = \pi R^2$, the area of the opening, as
$\tilde f(0) = \int f\,\dd^2a$ must be.[^direct] The normalized pattern $2J_1(x)/x$ starts at 1.[^paper-x]

**The slit.** On a line, an opening of half-width $R$ has $f = 1$ for $|a_1| < R$, with $a_1$ the position along the
line, and its transform is

$$\int_{-R}^Re^{-ika_1}\,\dd a_1 = \frac{2\sin(kR)}{k} = 2R\,\frac{\sin x}{x} .$$

Normalized, this is $\sin x/x$, the function of section 3.5 with place and wavenumber exchanged: there a band of
ripples made a pattern in space, and here a band of space makes a pattern of ripples.

**The disc's pattern is wider.** The slit's pattern reaches zero first at $x = \pi = 3.142$, the disc's at $x =
3.832$, which is 22% later. The disc's pattern also falls to half its height later, at $x = 2.215$ against 1.895 (the figure below).

**Why it is wider near the peak.** We turn the axes so that $\vect k$ points along the first one. Then
$e^{-i\vect k\cdot\vect a} = e^{-ika_1}$ does not depend on $a_2$, so we can do the integral over $a_2$ first:

$$\tilde f(\vect k) = \int\Bigl[\int f\,\dd a_2\Bigr]e^{-ika_1}\,\dd a_1 .$$

The bracket is the **shadow** of the pattern on the first axis, and the transform of the plane pattern along $\vect k$
is the transform on the line of its shadow. For the disc, the shadow at $a_1$ is the length of the chord there,
$2\sqrt{R^2 - a_1^2}$: tallest in the middle and falling to zero at the edges. The slit's shadow is flat out to $\pm
R$. Near the peak we expand $e^{-ika_1} \approx 1 - ika_1 - k^2a_1^2/2$. The shadow is symmetric, so the term in
$a_1$ adds to zero, and

$$\frac{\tilde f(k)}{\tilde f(0)} \approx 1 - \frac{\sigma_a^2k^2}{2},$$

where $\sigma_a$ is the standard deviation of $a_1$ (section 3.1) with the shadow as the weight, in metres. For the
disc $\sigma_a = R/2$,[^chord] so its pattern starts as $1 - x^2/8$. For the flat shadow $\sigma_a = R/\sqrt3 =
0.58R$, so the slit's starts as $1 - x^2/6$. Both agree with the series of $2J_1(x)/x$ and $\sin x/x$. The disc's
shadow keeps more of its area near the middle, so its pattern falls more slowly from the peak, and its central spot is
wider near the top. This explains the shape near the peak only; the first zeros come from the zeros of $J_1$ and of
$\sin x$.

**The ringing.** Beyond its first zero, $2J_1(x)/x$ goes negative and reaches $-0.132$ at $x = 5.136$, where $\sin
x/x$ reaches $-0.217$ at $x = 4.493$ (section 3.5). The two tails differ because the two shadows end differently. The
slit's shadow jumps from one to zero, and its transform dies away as $1/x$. The disc's shadow reaches zero without a
jump, though with an infinitely steep slope: near the edge the chord is about $2\sqrt{2R(R - |a_1|)}$, a square root.
By the far form of $J_1$, this softer edge makes $2J_1(x)/x$ die away as $x^{-3/2}$, faster than $1/x$.

**What it means for the camera.** In section 3.7 the disc lies in the plane of wavevectors, as the set of ripples that
the filter keeps. The same integral, with $\vect a$ and $\vect k$ exchanged, draws a point as $2J_1(x)/x$.

![Left, a disc of radius $R$ and a slit of half-width $R$, which runs on past its faded ends, each with its shadow on
the first axis beneath it: the disc's is a half-ellipse of height $2R$, and the slit's a flat bar drawn with the same
area. Right, their patterns $2J_1(x)/x$ (orange) and $\sin x/x$ (blue, dashed), each divided by its peak. The disc's
falls to one half later, at 2.215 against 1.895, reaches zero later, at 3.832 against $\pi$, and dips less deep,
to $-0.132$ against $-0.217$.](tut-bessel-disc-slit){#fig:disc-slit}

## A lens draws a star as the square of that pattern

We want the picture that a lens makes of a star, because the wave camera of section 5.3 is judged against it.

**The assumptions.** A star is so far away that **its light arrives as a plane wave**, of wavelength $\lambda$ in
metres.[^lambda] A lens of diameter $D$, in metres, gathers the light that crosses its round opening. We assume that
**the lens adds the light from every point of the opening with equal weight, each with the phase it
carries**.[^fraunhofer]

**The phase across the opening.** A lens brings the light that arrives from one direction together at one point of its
focal plane, because it makes the paths from a plane wave of that direction to that point equal in length. Take the
point that belongs to the direction at the small angle $\theta$ from the star, in radians. At the distance $a_\parallel$
from the centre of the opening, measured along the tilt, the two wavefronts are $a_\parallel\sin\theta$ apart, so the
star's light through that place has that much more or less path than its light through the centre. One wavelength of
path is one turn of phase, $2\pi$, so the phase differs by $(2\pi/\lambda)\,a_\parallel\sin\theta$. Adding the
contributions over the opening, with $f = 1$ on it and $0$ elsewhere, gives

$$\int f(\vect a)\,e^{-i\vect k\cdot\vect a}\,\dd^2a,\qquad k = \frac{2\pi\sin\theta}{\lambda},$$

where $\vect k$ points along the tilt, in $\mathrm{m^{-1}}$. The sign of the phase does not matter, because the opening
is symmetric about its centre. So the light at the angle $\theta$ is the Fourier transform of the opening at the
wavenumber $k = 2\pi\sin\theta/\lambda$. This is **Fraunhofer diffraction**.

**The far field.** A source at the finite distance $L$ sends a wave whose fronts are spheres, not planes. The path from
the source to a point of the opening at the distance $a$ from its centre is longer than the path to the centre by about
$a^2/2L$, so at the rim, $a = D/2$, the light lags by the phase $\pi D^2/4\lambda L$. The plane-wave sum holds when this lag is
much less than a radian, in the **far field**, $L \gg D^2/\lambda$: for a telescope 1 m across at 500 nm,
$D^2/\lambda$ is 2000 km, and the nearest star is $4\times10^{16}$ m away.

**The pattern.** The opening is a disc of radius $R = D/2$, so by [](#eq:disc) the **amplitude** of the light, the size
of its oscillating field, which is what adds, is proportional to

$$\frac{2J_1(x)}{x},\qquad x = kR = \frac{\pi D\sin\theta}{\lambda} \approx \frac{\pi D\theta}{\lambda} .$$

A detector records the **intensity**, the energy per unit area per second, which is proportional to the square of the
amplitude. So a lens draws a star as $\bigl(2J_1(x)/x\bigr)^2$, a bright disc surrounded by faint rings. This is the
**Airy pattern**. Figure [](#fig:airy) draws it beside the amplitude.

**The first dark ring.** The intensity is zero where $J_1$ is, first at $x = 3.832$, which is $\theta =
3.832\,\lambda/\pi D$. Since $3.832/\pi = 1.2197$,

$$\boxed{\;\theta_{\rm dark} = 1.22\,\frac{\lambda}{D} .\;}$$

The intensity falls to half its peak at $x = 1.616$, so its full width at half maximum is $2\times1.616/\pi = 1.03$
times $\lambda/D$. This is the sharpness of any aperture of width $D$,

$$\Delta\theta \approx \frac{\lambda}{D} .$$

The light inside the first dark ring is 83.8% of the whole (the box below derives it), and the brightest of the rings,
at $x = 5.136$, reaches 1.75% of the peak.

**Numbers.** For a telescope 1 m across, at the 500 nm of green light, the first dark ring lies at $1.22\times5\times
10^{-7} = 6.1\times10^{-7}$ radians, or 0.13 arcseconds, from the centre of each star's image. In the figure below
the speed of light is slowed to 20 cm s⁻¹ and each pair of balls turns once a second, so it radiates at 2 Hz with waves
10 cm long. The array is 1.5 m across, so each spot's first dark ring lies $1.22\times0.1/1.5 = 0.081$ radians, or
4.7°, from its centre, and its width at half maximum is 3.9°. The shelf, about 4.5 m away, is much closer than
$D^2/\lambda = 22.5$ m, so the array is focused at that distance, with delays set for waves that spread from there.

{{paper fig:which-way}}

**Amplitude against intensity.** The amplitude $2J_1(x)/x$ is larger than its square everywhere inside the first dark
ring, so it falls to one half farther out, at $x = 2.215$ (section 3.7), and the same opening's pattern is 1.37 times
as wide measured on the amplitude. Which width a picture has depends on what it adds. A photograph adds energies and
shows the intensity. The near-field reconstruction is linear in the data, so the picture of two masses is the sum of
their two pictures, as the field of light from two points is the sum of two fields. Its picture of one point is
therefore the pattern itself and not its square, and section 3.7 measures its blur on $2J_1(x)/x$.

::: derivation
### The light inside a circle

We want the share of the light that falls inside the circle $x = X$. A thin ring between $x$ and $x + \dd x$ has an
area proportional to $2\pi x\,\dd x$, so it receives light in proportion to $\bigl(2J_1(x)/x\bigr)^2x\,\dd x =
4J_1^2\,\dd x/x$. From [](#eq:uj1), $J_1 + uJ_1' = uJ_0$, so $J_1' = J_0 - J_1/u$, and with $J_0' = -J_1$,

$$\begin{aligned}\frac{\dd}{\dd u}\bigl(J_0^2 + J_1^2\bigr) &= -2J_0J_1 + 2J_1\Bigl(J_0 - \frac{J_1}{u}\Bigr)\\ &= -\frac{2J_1^2}{u} .\end{aligned}$$

We integrate from 0, where $J_0 = 1$ and $J_1 = 0$:

$$\int_0^X\frac{4J_1^2}{u}\,\dd u = 2\bigl[1 - J_0^2(X) - J_1^2(X)\bigr] .$$

As $X$ grows, both functions fall to zero (the far form), so the whole pattern gives 2, and the share inside $X$ is
$1 - J_0^2(X) - J_1^2(X)$. At the first dark ring, $J_1 = 0$ and $J_0 = -0.403$, so the share is $1 - 0.162 = 0.838$.
Inside the second dark ring, at 7.016, it is 0.910.
:::

![Left, the amplitude $2J_1(x)/x$ (orange) and the intensity, its square, against $x$. Both vanish at the first dark
ring, $x = \pm3.832$, and they fall to one half at $\pm2.215$ and $\pm1.616$; the rings of the intensity, at most 1.75%
of its peak, are too faint to show on this scale. Right, the intensity across the plane on a logarithmic grey scale
from $10^{-4}$ to 1, which shows its rings, with the first dark ring circled.](tut-bessel-airy){#fig:airy}

::: try {#round-pupil}
Panel (a) is an opening in a screen: a disc of radius $R$ or a slit of half-width $R$. Panel (b) is its pattern across
the plane of wavevectors, and panel (c) the profile through the centre, with the other opening's profile dashed. The
buttons choose the opening and the amplitude or the intensity; the slider sets $R$ from 0.5 m to 2 m, and the readouts
give the half height, first zero and first ring in $x = kR$ and in $\mathrm{m^{-1}}$. Answer the two predictions first,
then compare the disc's and the slit's readouts with the numbers of this section.
:::

::: try {#array}
An **array** is a flat grid of gravitational pixels spread across a width $D$, whose records are delayed and added as a
lens does with glass. The slider sets $D/\lambda$ from a single pixel to 100; the curve is the brightness of the image
of one distant source against the angle of steering, which for every width above a single pixel is the Airy intensity.
The readout "blur" is its full width at half height. Before you move the slider, predict how the blur changes from 10
wavelengths to 30; then compare each readout with $\lambda/D$ in degrees: 5.9° against 5.7° at 10 wavelengths, 2.0°
against 1.9° at 30, about 3% more, the factor 1.03 above.
:::

**The idea to keep: a pattern that is the same in every direction across a plane is built from circular ripples, the
Bessel function $J_0$. A round opening transforms to $2J_1(x)/x$, whose first zero is at 3.83, and whose square is the
Airy pattern of every round lens, with its dark ring at $1.22\lambda/D$.**

::: problems
### Practice

**[3.6]** Why is $J_0(0) = 1$?

::: solution
At $u = 0$ the integrand of [](#eq:j0) is $e^0 = 1$ for every direction, and the average of 1 is 1.
:::

**[3.6]** Near its peak, why does a round opening's pattern fall more slowly than the pattern of a slit of the same
half-width?

::: solution
The disc's shadow is a half-ellipse, which keeps its area nearer the middle than the slit's flat shadow. Its spread is
$R/2$ against $0.58R$, so its pattern starts as $1 - x^2/8$ against $1 - x^2/6$.
:::

**[3.6]** What is $\int_0^{3.832}J_0(t)\,t\,\dd t$?

::: solution
Zero: by [](#eq:integral) it is $uJ_1(u)$ at the first zero of $J_1$, where the positive centre and the first negative
ring cancel.
:::

**[3.6]** A telescope 1 m across observes at 500 nm. At what angle from the centre of a star's image is its first dark
ring?

::: solution
$1.22\times5\times10^{-7}/1 = 6.1\times10^{-7}$ radians, which is 0.13 arcseconds.
:::

**[3.6]** From the series, show that $J_0''(0) = -\tfrac12$. Then differentiate the integral [](#eq:j0) under the integral
sign to check that its Taylor series agrees with $1 - u^2/4 + u^4/64$ up to the fourth power. Last, evaluate the three
terms at $u = 1$ and compare with $J_0(1) = 0.7652$.

::: solution
The series gives $J_0'' = -\tfrac12 + 3u^2/16 - \dots$, which is $-\tfrac12$ at zero. Differentiating
$\frac1{2\pi}\int\cos(u\cos\varphi)\,\dd\varphi$ twice brings down $-\cos^2\varphi$, and at $u = 0$ the average of
$-\cos^2\varphi$ is $-\tfrac12$. Four derivatives bring down $\cos^4\varphi$, whose average is $\tfrac38$, so the
fourth-order coefficient of the Taylor series is $\tfrac38/4! = \tfrac1{64}$. The odd derivatives bring down odd powers
of $\cos\varphi$ times a sine that vanishes at $u = 0$. At $u = 1$ the three terms give $1 - 0.25 + 0.015625 =
0.7656$, against 0.7652. The difference, $4.3\times10^{-4}$, is the next term, $1/2304$.
:::

### Stretch

**[3.6]** Use the Gaussian pair of section 2.6 to show that the round Gaussian $e^{-a^2/2\varepsilon^2}$, where $\varepsilon$ is a
length, transforms to $2\pi\varepsilon^2e^{-k^2\varepsilon^2/2}$. Confirm it with [](#eq:hankel) by putting in the
series [](#eq:series) and integrating term by term. Then find the full width at half maximum of the transform, in
units of $1/\varepsilon$.

::: solution
Each factor of $e^{-a_1^2/2\varepsilon^2}e^{-a_2^2/2\varepsilon^2}$ is $\sqrt{2\pi}\,\varepsilon\,\delta_\varepsilon(a_i)$, with the
transform $\sqrt{2\pi}\,\varepsilon\,e^{-k_i^2\varepsilon^2/2}$, so the product transforms to
$2\pi\varepsilon^2e^{-k^2\varepsilon^2/2}$. For the Hankel form we put $a = \varepsilon b$, so that [](#eq:hankel)
becomes $2\pi\varepsilon^2\int_0^\infty e^{-b^2/2}J_0(yb)\,b\,\dd b$ with $y = k\varepsilon$. With $v = b^2/2$,
$\int_0^\infty e^{-b^2/2}b^{2n+1}\,\dd b = 2^nn!$. So the series gives

$$\begin{aligned}&\sum_n\frac{(-1)^n}{(n!)^2}\Bigl(\frac y2\Bigr)^{2n}2^nn!\\ &\quad= \sum_n\frac{1}{n!}\Bigl(-\frac{y^2}{2}\Bigr)^n = e^{-y^2/2},\end{aligned}$$

as required. The transform falls to half where $k^2\varepsilon^2/2 = \ln2$, at $k\varepsilon = 1.177$, so its full
width is $2\sqrt{2\ln2}/\varepsilon = 2.355/\varepsilon$.
:::

### The camera

**[3.6]** The near-field image of a point is $2J_1(x)/x$ with $x = q_cr/z$, where $r$ is the distance across the sheet from
the point, in metres. Show, with the steps of [](#eq:disc) but with the disc in the plane of wavevectors, that a filter
keeping every ripple with $|\vect k| < k_c$ whole and none beyond draws a point mass $\matter m$ as $2J_1(k_cr)/k_cr$
times its peak, so that $k_c = q_c/z$ gives this $x$. Then find the full width of the picture at half its height, in
units of $z/q_c$, and say why it is measured on $2J_1(x)/x$ and not on its square.

::: solution
A point mass has the transform $\matter m$ for every ripple, so the filtered picture is $\matter m$ times the inverse
transform of the disc $k < k_c$. Its angular integral gives $J_0(kr)$ by [](#eq:j0), and [](#eq:integral) gives
$(\matter mk_c^2/4\pi)\cdot2J_1(k_cr)/k_cr$. The picture falls to half its peak at $x = 2.215$, so its full width is
$4.43\,z/q_c$. The reconstruction is linear in the data, so the picture of a point is the pattern itself, as the
amplitude of light is; the intensity would fall to half at $x = 1.616$ and give only $3.23\,z/q_c$.
:::
:::

::: paper
- [*How sharp*](/paper/#par:how-sharp) (Section IV) writes the image of a point as $2J_1(x)/x$ and gives its width in
  equation [](/paper/#eq:resolution); Table [](/paper/#tab:resolution) and Figure [](/paper/#fig:resolution-law) use
  the Hankel transform [](#eq:hankel) of the exact filter.
- [*The computed image*](/paper/#par:the-computed-image) (Section VII) gives the sharpness of any aperture, equation
  [](/paper/#eq:diffraction), and Figure [](/paper/#fig:array) draws a round aperture's intensity.
- Figure [](/paper/#fig:which-way) (Section V) draws each turning pair of balls as an Airy spot.
:::

::: deeper
- J. W. Goodman, *Introduction to Fourier Optics* (3rd edition, 2005), chapters 2 and 4: the Fourier–Bessel transform
  and Fraunhofer diffraction by a circular aperture.
- G. N. Watson, *A Treatise on the Theory of Bessel Functions* (2nd edition, 1944): everything here and much more; the
  NIST *Digital Library of Mathematical Functions*, chapter 10, tabulates the series, zeros and far forms.
:::

::: history
### Bessel, Airy and the resolving power of a telescope

Friedrich Wilhelm Bessel studied these functions systematically in 1824, in his work on the planets' orbits. George
Biddell Airy computed the pattern of a round telescope lens in 1834. In 1879 Lord Rayleigh quoted Airy's radius of the
first dark ring, $1.2197\lambda/2R$, and took two stars to be resolved when the maximum of one falls on the first zero
of the other, which for a round lens is the angle $1.22\lambda/D$.
:::

[^airy]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:resolution) for the image of a point, and Sec. V, where its Fig. [](/paper/#fig:which-way) draws each
    pair of balls as an Airy spot.

[^quad]: Adaptive quadrature of [](#eq:j0) and a numerical library's Bessel function agree to $10^{-16}$.

[^jn]: In general the **Bessel function of order** $n$ is $J_n(u) = \frac1{2\pi}\int_0^{2\pi}e^{i(u\sin\varphi -
    n\varphi)}\,\dd\varphi$. It is named here and not needed later; for $n = 1$ it agrees with the $J_1$ of this
    section.

[^y0]: It is called $Y_0$. Near zero it grows like a logarithm, as the potential of a long rod does in section
    [2.4](/tutorial/outside/greens-functions/#along-a-long-rod-the-greens-function-is-a-logarithm).

[^bessel-37]: Section 3.7 quotes the definition [](#eq:j0), the property [](#eq:uj1) with $J_1(0) = 0$, the integral
    [](#eq:integral) and $J_1(u) \approx u/2$.

[^zeros]: The zeros here, and the half maxima 1.616, 1.895 and 2.215, are computed numerically and agree with a
    numerical library's to twelve figures.

[^drum]: The first zero sets the lowest note of a round drum. Its skin, fixed at the rim, vibrates in the shape of
    $J_0(2.405\,a/R)$, which vanishes at the rim $a = R$; section 5.1 gives the wave equation behind it.

[^direct]: A direct numerical integral of $e^{-ika_1}$ over the disc, at $kR = 2$, gives $1.8118R^2$, the value of
    [](#eq:disc).

[^paper-x]: Section 3.7 writes the same number $u$. Here $u$ is the argument of $J_0$ and $J_1$, and $x$ the argument of the
    opening's pattern: $kR$ in this section, and $\pi D\sin\theta/\lambda$ in the last.

[^chord]: The shadow's area is $\pi R^2$, and with $a_1 = R\sin t$ the integral $\int_{-R}^Ra_1^2\cdot
    2\sqrt{R^2 - a_1^2}\,\dd a_1$ is $2R^4\int_{-\pi/2}^{\pi/2}\sin^2t\cos^2t\,\dd t = \pi R^4/4$. Their ratio is
    $\sigma_a^2 = R^2/4$.

[^fraunhofer]: Section [5.3](/tutorial/waves/diffraction/#beyond-an-opening-a-wave-is-a-sum-of-wavelets-from-every-point-of-it) justifies this assumption from the wave equation and adds the
    factor that sets the brightness. Here we use it only to find the shape of the pattern.

[^lambda]: Elsewhere $\lambda$ is a mass per unit length (section 2.4) and an eigenvalue (section 3.4).
