---
id: '13.1'
title: 'First order and second order: the push and the pass'
question: 'A tonne that flies past a steel ball is both bent and slowed. Why does its bending show only what the steady field shows, while its slowing reaches the inside, and how do the slowings along many paths become a map of the density?'
part: '13'
requires: ['1.3', '1.5b', '1.6', '1.7', '1.8', '2.1', '2.5', '2.6', '6.4']
paper: [sec:second-order, eq:push, eq:pass, app:proofs, fig:passing, fig:hair, tab:hair, eq:calderon]
figures: [fig:passing, fig:hair]
live: [first-and-second-order]
depth: A
---

**What you need:** chapters
[1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts) (the shell theorem),
[1.5b](/tutorial/newton/complex-numbers/#multiplying-multiplies-lengths-and-adds-angles) (multiplying adds angles),
[1.6](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel) (momentum and the third law),
[1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass) (the impulsive
tide and its energy),
[1.8](/tutorial/newton/orbits-and-kicks/#what-a-pass-leaves-inside-a-body-is-a-weighted-sum-of-its-projected-mass) (the
pass and its series),
[2.1](/tutorial/outside/laplace/#the-harmonic-quadratics-are-the-trace-free-tables) (harmonic functions in the plane),
[2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see) (the
null space), [2.6](/tutorial/outside/fourier/#across-a-plane-a-ripples-wavevector-points-across-its-crests)
(transforms) and
[6.4](/tutorial/relativity/energy-and-momentum/#gravity-weighs-the-rest-mass-so-a-weighing-reads-the-energy) (energy
has weight).

The paper's [Section XIII](/paper/#sec:second-order) sets two bodies side by side that pull alike outside: a thin shell,
and a point at the centre of a larger shell that holds half the mass. A tonne flies past each on the same straight path,
at 1.5 times the larger radius from the centre. Both bodies bend its path by exactly the same small angle. Yet
the pass leaves 30 per cent more energy inside the second body than inside the first,[^thirty] and the tonne pays for
that energy out of its own motion.

{{paper fig:passing}}

So we ask: why does the bending of a passing mass show only what the steady field shows, while its slowing reaches the
inside, and how do the slowings along many paths become a map of the density? The section's opening gives the reason.
The pull on a mass outside is of first order in that mass, while "what the body does in reply, and so what the mass
gains or loses, is of second order". Chapters 1.7 and 1.8 derived the two equations; this chapter reads them.

::: plain
A small mass that flies past a body is pulled toward it, so its path bends. If the small mass is doubled, the
momentum it trades with the body doubles too. This is a first-order effect. The bending shows only what the body's
steady pull shows, so a hollow shell and a solid ball of the same mass bend the path alike.

The small mass also sets every part of the body moving. Doubling it doubles each part's speed, so the energy left
behind becomes four times as large. This is a second-order effect. That energy comes out of the passer's motion, so it
leaves a little slower, and the loss depends on how the mass is arranged inside.

Passes at many distances, from all round the body, fix the body's mass as seen along the paths. Paths in all the
directions of one plane then give the density everywhere inside.
:::

## A probe reads the field at first order and the body's reply at second

A **probe** is anything that the camera's owner sends at a body to learn about it, such as a passing mass or a brief
tide. A probe has a strength that can be turned up or down: the passing mass $\sym{passing-mass}{\matter\mu}$, in
kilograms, or the strength $\sym{impulse-strength}{\epsilon}$ of chapter 1.7's impulsive tide, whose product with the
tide's profile is in $\mathrm{m^2\,s^{-1}}$. An effect of the probe is **first order** in its strength if it is in
proportion to the strength, so that doubling the strength doubles it. It is **second order** if it is in proportion to
the square of the strength, so that doubling the strength makes it four times as large. These are chapter
[0.5](/tutorial/evening/what-the-outside-keeps/#the-bodys-reply-to-a-pull-reveals-its-inside)'s words, now with
symbols.

The pass is the first example. Chapter
[1.8](/tutorial/newton/orbits-and-kicks/#a-fast-passing-mass-gives-every-part-of-a-body-a-sideways-kick) found that a
part of the body over the point $\vect s$ of the plane across the path receives the velocity

$$\Delta\vect v = C\,\frac{\vect b - \vect s}{|\vect b - \vect s|^2}, \qquad \sym{flyby-constant}{C} = \frac{2G\matter\mu}{V},$$

where $\vect b$ is the point at which the path crosses that plane, $G$ is the gravitational constant, $V$ is the
passer's speed in metres per second, and $C$ is in $\mathrm{m^2\,s^{-1}}$. Every velocity is in proportion to
$\matter\mu$. So the body's momentum, a sum of masses times velocities, is first order in $\matter\mu$. Its kinetic
energy, a sum of masses times squared velocities, is second order. Doubling the paper's tonne raises the kick at the
steel ball's near edge from $3.0 \times 10^{-12}$ to $6.1 \times 10^{-12}\unit{m\,s^{-1}}$, and the ball's gain of
energy from $8.8 \times 10^{-21}$ to $3.5 \times 10^{-20}\unit{J}$, four times as much.

These orders belong to the body's momentum and energy. On the passer each falls by one order, because it is divided
by the passer's own momentum or energy. So the passer's angle of bending, its sideways momentum over $\matter\mu V$,
does not depend on $\matter\mu$ at all, and the fraction by which it slows is first order in $\matter\mu$.

The push is the second example. The paper's equation gives the energy $\Delta E$, in joules, that an impulsive tide
leaves in a body that may already be moving, with $g$ the tide's profile, a function of position that fixes its shape:

{{paper eq:push}}

Here $\sym{mass-moment}{\matter{Q_g}} = \int\matter\rho\,g\,\dd V$ is the moment of the mass against $g$, with
$\sym{density}{\matter\rho}$ the density, and $\matter{\dot Q_g}$ is its rate of change (chapter 1.7). The first term is
first order in $\epsilon$ and changes sign with it, so we call it the **odd part**. For a harmonic $g$, $\matter{Q_g}$
is one of the moments that the steady field outside holds, so the odd part is that field's rate of change, and it
holds nothing about the density beyond what the field holds. With the places of the parts known, odd parts give every
momentum ([below](#two-weighings-of-two-copies-read-the-even-part-and-the-odd-part)). The second term is second order
and keeps its sign, so we call it the **even part**. It weighs each piece of mass by the square of its kick.

A non-example is the steady pull of the body on the probe, $-\matter\mu\nabla\field\Phi$, with $\field\Phi$ the
body's potential in joules per kilogram. It is first order in $\matter\mu$, and by the shell theorem
([1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)) and the null space
([2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see)) it
holds only the harmonic moments, the moments of the mass against harmonic functions.

Section XIII names three second-order readings: a warm body's tremor
([4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)),
its response to a tide driven fast
([4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust)), and the energy
exchanged with a probe. Each holds $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ for two harmonic profiles $h$
and $g$, and $\nabla h\cdot\nabla g$ is in general not harmonic
([2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic)): for $h = g =
\tfrac12(x^2 - y^2)$ it is $x^2 + y^2$, whose Laplacian is 4. The shell theorem is a theorem about first order.

## The passer's bending holds only the harmonic moments of the projected body

We want the momentum that the pass gives the body. By the third law
([1.6](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel)) the passer loses the same
momentum sideways, and that loss is its bending. We keep chapter 1.8's two assumptions, **the passer moves on a straight
line** and **the parts of the body stay still while it passes**.

We write a point $\vect s$ of the plane as the complex number $\sym{complex-place}{w} = x + iy$, as chapter 1.8 did, and
the crossing point $\vect b$ as the complex number $b$, in metres, with $|b|$ its distance from the origin and $\varphi$
its angle.[^z] A velocity $(X, Y)$ is the complex
number $X + iY$, and $|b - w|^2 = (b - w)(b^* - w^*)$, so the kick at $w$ is

$$C\,\frac{b - w}{|b - w|^2} = \frac{C}{b^* - w^*} .$$

Let the origin lie inside the body, and assume that **every part of the projected body is closer to the origin than
the path is**, $|w| < |b|$. This asks more than a miss: a path between the two ends of a long body misses it, yet
some parts lie farther out than the path. The geometric series then gives

$$\frac{C}{b^* - w^*} = \frac{C}{b^*}\sum_{q=0}^{\infty}\Bigl(\frac{w^*}{b^*}\Bigr)^q .$$

The parts over a small patch $\dd^2s$ carry the mass $\sym{projected-density}{\matter\Sigma}\,\dd^2s$, where
$\matter\Sigma$ is chapter 1.8's projected surface density, in kilograms per square metre. We multiply each kick by
this mass and add the patches. The body's momentum after the pass, written as a complex number, is

$$\boxed{\;\Delta P = C\sum_{q=0}^{\infty}\frac{m_{0q}}{(b^*)^{q+1}},\;}$$

where

$$\sym{planar-moment}{m_{pq}} = \int w^p\,(w^*)^q\,\matter\Sigma\,\dd^2s$$

is the **planar moment** of the projected body, a complex number in $\mathrm{kg\,m}^{p+q}$. It is not a mass, though it
has the letter. We call $p + q$ its **total degree**, the degree of $w^p(w^*)^q$ as a polynomial in $x$ and $y$. The
term $q = 0$ is $C\matter M/b^*$, with $\sym{mass}{\matter M}$ the body's mass. Its length is $\matter M$ times chapter
1.8's recoil velocity $C/|b|$, and its direction is that of $b$, toward the path.

Only the moments $m_{0q}$ enter, the moments against the powers of $w^* = x - iy$. Their real and imaginary parts are
harmonic in the plane (chapter 2.1's box), and so in space, since they do not change along the path. Their moments
against $\matter\Sigma$ are moments against $\matter\rho$, which the steady field outside holds. The reason is
general: the kick is $-C\nabla\ln|\vect b - \vect s|$, the gradient of a function harmonic in the plane away from
$\vect b$ (chapter 1.8), and every derivative of a harmonic function is harmonic, because the order of two derivatives
does not matter. Because $\matter\Sigma$ is real, $m_{q0} = m_{0q}^*$, so these are also the moments against the
powers of $x + iy$, as Section XIII puts it.

So two projected bodies with the same $m_{0q}$ bend every passer alike. For a round body every $m_{0q}$ with
$q \ge 1$ vanishes, because the powers of $w^*$ average to zero round each circle (chapter 1.8). A round body therefore
bends the passer as a point of its mass would. The paper calls this "the shell theorem in the plane".

The passer's angle of bending is $|\Delta P|/\matter\mu V = 2G\matter M/|b|V^2$ for a round body: $1.9 \times
10^{-16}$ rad for the steel ball of 4110 kg at $|b| = 1.5\unit{m}$ and $44\unit{km\,s^{-1}}$, as chapter 1.8 found.
The two bodies of the figure bend it by the same angle, exactly (Figure [](#fig:pass-two-orders)). Far away only the
term $q = 0$ survives, and every body bends the passer as a point mass does.

Up to the total degree $n$, the bending holds $m_{00}$, the mass, and the complex numbers $m_{01}$ to $m_{0n}$: in all,
$1 + 2n$ real numbers.

![Look first at the two bars: one pass leaves 0.080 and 0.104, in units of $\matter MC^2/2R^2$, inside two bodies that
the pass bends by exactly the same angle. Left, a thin shell of radius $R/\sqrt2$; right, half the mass at the centre
of a shell of radius $R$. The bending is drawn much larger than it is, alike for both, and the cutaway bodies are
pictures.](tut-pass-two-orders){#fig:pass-two-orders}

## The passer's loss of energy holds every moment of the projected body

We want the energy that the pass leaves, keeping every term that chapter 1.8 averaged away. Chapter 1.8 multiplied the
geometric series of $1/(b - w)$ and of $1/(b - w^*)$ for a real $b$. The same product, for a complex $b$ and with
$|w| < |b|$, is

$$\frac{1}{|b - w|^2} = \sum_{p, q\ge0}\frac{w^p\,(w^*)^q}{b^{p+1}\,(b^*)^{q+1}} .$$

We put it into the paper's equation [](/paper/#eq:pass), and the integral of each term is a planar moment:

$$\boxed{\;\Delta E(b) = \frac{C^2}{2}\sum_{p, q\ge0}\frac{m_{pq}}{b^{p+1}\,(b^*)^{q+1}} .\;}$$

The unit is $\mathrm{m^4\,s^{-2}}$ times $\mathrm{kg\,m}^{p+q}$ over $\mathrm m^{p+q+2}$, which is joules.

The moments can be told apart. Write $b = |b|e^{i\varphi}$. Multiplying adds angles (chapter 1.5b), so dividing by
$b^{p+1}$ turns by $-(p + 1)\varphi$ and dividing by $(b^*)^{q+1}$ turns by $(q + 1)\varphi$. The term $(p, q)$ is
therefore

$$\frac{m_{pq}}{|b|^{p+q+2}}\,e^{i(q-p)\varphi} .$$

It falls as the power $p + q + 2$ of the distance, and its phase turns $q - p$ times as $b$ goes once round the body.
No two different terms share both numbers, because $p + q$ and $q - p$ fix $p$ and $q$. We multiply the losses on a
circle of impact points by $e^{-ij\varphi}$, for a whole number $j$, and average round the circle. Every term with
$q - p \ne j$ averages to zero, and what remains, $\tfrac12C^2\sum_pm_{p,p+j}|b|^{-(2p+j+2)}$ over
$p \ge \max(0, -j)$, is a series in powers of $1/|b|$. Such a series, known over a range of radii, has only one set of
coefficients, because a power series that vanishes over a range vanishes term by term. So the losses on an
**annulus** of impact points, a ring-shaped band of them round the body and outside the circle that holds it, give
every $m_{pq}$ (Figure [](#fig:pass-annulus)).[^nine]

![Look first at the grid: every term of the loss has its own power of the distance (its row) and its own number of
turns round the body (its column), so losses over a band of radii pull every term apart. The filled dots on the two
edges are the only terms the bending holds. The body and the number of beads are chosen for the
drawing.](tut-pass-annulus){#fig:pass-annulus}

Up to the total degree $n$ there are $(n + 1)(n + 2)/2$ pairs $(p, q)$. Because $m_{qp} = m_{pq}^*$, a pair with
$p \ne q$ and its mirror $(q, p)$ share one complex number, two real numbers, and a pair with $p = q$ gives one real
number. So the pairs hold that many real numbers. The bending holds $1 + 2n$:

| Total degree up to | 0 | 1 | 2 | 3 | 4 |
|:--|:-:|:-:|:-:|:-:|:-:|
| real numbers in the bending | 1 | 3 | 5 | 7 | 9 |
| real numbers in the loss | 1 | 3 | 6 | 10 | 15 |

The two agree for the mass and the centre of mass. At degree two the loss gains
$m_{11} = \int\matter\rho\,(x^2 + y^2)\,\dd V$, with the path along $z$: the moment of inertia about the path's
direction, which the steady field cannot see (chapter
[1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)).

The pair of the opening shows the table at work. Both bodies are round, so only the $m_{pp}$ survive, and the term
$p = 0$ is the recoil. Both have $m_{11} = \tfrac13\matter MR^2$, with $R$ the larger shell's radius, so their losses
agree up to $|b|^{-4}$. Then $m_{22}$ is $\tfrac{2}{15}\matter MR^4$ for the thin shell and $\tfrac{4}{15}\matter MR^4$
for the other. Summed in full at $|b| = 1.5R$, the internal energies are 0.080 and 0.104 in units of
$\matter MC^2/2R^2$, 30 per cent apart.

The moments fix $\matter\Sigma$. This step is a sketch at depth B. Chapter 2.6's transform across the plane is
$\tilde{\matter\Sigma}(\vect k) = \int\matter\Sigma\,e^{-i\vect k\cdot\vect s}\,\dd^2s$, with $\vect k$ a wavevector in
radians per metre. We expand the exponential in its power series:

$$\tilde{\matter\Sigma}(\vect k) = \sum_{n=0}^{\infty}\frac{(-i)^n}{n!}\int(\vect k\cdot\vect s)^n\,\matter\Sigma\,\dd^2s .$$

Each $(\vect k\cdot\vect s)^n$ is a polynomial of degree $n$ in $x$ and $y$, and $x = (w + w^*)/2$ and
$y = (w - w^*)/2i$, so each integral is a sum of the $m_{pq}$ with $p + q = n$. The moments therefore give
$\tilde{\matter\Sigma}$ at every $\vect k$, and 2.6's inverse transform gives $\matter\Sigma$. That a body of bounded
size is fixed by its polynomial moments is called **moment determinacy**.[^exp]

::: gap
The sketch exchanges the sum and the integral. If every part lies within the distance $a$ of the origin, the partial
sums of the exponential's series are at most $e^{|\vect k|a}$ in size throughout the body. That bound allows the series
to be integrated term by term, and it makes the result converge for every $\vect k$. That the transform fixes a
density with jumps or thin shells is stated without proof; it is in a first course in Fourier analysis.
:::

Nothing is weighed, and the speed of light does not enter. The passer leaves slower by $\Delta E/\matter\mu V$ (chapter
1.8). The leading term of the loss, $C^2\matter M/2|b|^2$, taken as a fraction of the passer's energy, is smaller than
the angle of bending, $C\matter M/|b|\matter\mu V$, by the factor $C/|b|V = 2G\matter\mu/|b|V^2$: the body's speed
after the pass over the passer's, and $4.6 \times 10^{-17}$ for the tonne. The second reading is that much weaker than
the first, and chapter 13.2 counts what this costs. (A speed falls by half the fraction its energy does, so the slowing
given below, over the angle, is about half that.)

## Passes along one great circle of directions give the density

The losses on paths in one direction give $\matter\Sigma$ for that direction, and we want $\matter\rho$ itself. Let the
paths run along the unit vector $\hat n$.[^nhat] With $z$ the distance along a path, in metres, as in chapter 1.8, the
projected density over the point $\vect s$ of the plane across $\hat n$ is

$$\matter\Sigma_{\hat n}(\vect s) = \int\matter\rho(\vect s + z\hat n)\,\dd z .$$

Take a wavevector $\vect k$ in that plane, so that $\vect k\cdot\hat n = 0$. The density's transform is
$\tilde{\matter\rho}(\vect k) = \int\matter\rho\,e^{-i\vect k\cdot\vect x}\,\dd V$.[^sign] Every point is
$\vect x = \vect s + z\hat n$, with $\dd V = \dd^2s\,\dd z$, and $\vect k\cdot\vect x = \vect k\cdot\vect s$. The
exponential does not change along a path, so we do the integral along the path first:

$$\boxed{\;\begin{aligned}
\tilde{\matter\rho}(\vect k) &= \int e^{-i\vect k\cdot\vect s}\Bigl[\int\matter\rho\,\dd z\Bigr]\dd^2s\\
&= \tilde{\matter\Sigma}_{\hat n}(\vect k)\quad\text{for }\vect k\cdot\hat n = 0 .
\end{aligned}\;} \label{eq:slice}$$

This is the projection–slice theorem, which chapter
[5.6](/tutorial/waves/abel-transform/#a-body-that-is-not-round-needs-views-from-many-directions) stated.

A **great circle** of directions is the set of all directions at right angles to one axis $\hat\nu$, as the equator's
directions are at right angles to the Earth's axis. Take any $\vect k$. If $\vect k$ is not along $\hat\nu$, the
direction $\hat n = \vect k\times\hat\nu/|\vect k\times\hat\nu|$ is at right angles to $\hat\nu$, so it lies on the
great circle, and it is at right angles to $\vect k$, so $\vect k$ lies on its slice. If $\vect k$ is along $\hat\nu$,
every direction of the circle is at right angles to it. So the slices of one great circle fill the whole space of
wavevectors (Figure [](#fig:pass-slice)). The losses on paths whose directions lie in one plane give
$\tilde{\matter\rho}$ at every $\vect k$, and 2.6's inverse transform gives $\matter\rho$ everywhere.

A round body needs one direction only. Its $\matter\Sigma$ is then the Abel transform of chapter
[5.6](/tutorial/waves/abel-transform/#the-transform-can-be-undone), which can be undone. In the paper's Table
[](/paper/#tab:hair), the row "A mass that passes" ends with "the density" for a stone, and with "what the hole absorbs,
set by its mass and spin" for a black hole.

![Look first at the three slices on the right: each direction of paths gives the density's transform on one plane of
wavevectors, and as the direction turns round the great circle, the planes turn about its axis and fill the space.
Left, the body, three bundles of paths in directions of one great circle, and the projected mass for one of them. The
body's shape and the spacing of the paths are chosen for the drawing.](tut-pass-slice){#fig:pass-slice}

## A mass held for an instant leaves energy through a kernel that is not harmonic

The paper opens its passage on the pass with "neither the weighing nor the contrived instant is needed". The weighing
is the next section's, and the contrived instant is a cruder probe. A mass $\matter\mu$ held still at a point
$\vect y$ outside the body for a short time $\delta t$, then taken away, is chapter 1.7's impulsive tide with the
profile $g = 1/|\vect x - \vect y|$ and the strength $\epsilon = G\matter\mu\,\delta t$, in
$\mathrm{m^3\,s^{-1}}$. We call it a **held mass**. Since $|\nabla g|^2 = |\vect x - \vect y|^{-4}$, the paper's
equation [](/paper/#eq:push) says that a body at rest gains

$$\Delta E(\vect y) = \tfrac12(G\matter\mu\,\delta t)^2\int\matter\rho\,|\vect x - \vect y|^{-4}\,\dd V .$$

The field's kernel is harmonic, and the energy's is not. For a power of the distance $r = |\vect x - \vect y|$, chapter
[2.2](/tutorial/outside/spherical-harmonics/#the-laplacian-splits-into-a-part-along-the-radius-and-a-part-on-the-sphere)
gives $\nabla^2r^n = n(n + 1)\,r^{n-2}$ away from $r = 0$. For the field, $n = -1$ gives zero. For the energy, $n = -4$
gives $12\,r^{-6}$. So the energy weighs the density by a function that no reading of the field at one time can supply,
and chapter 13.3 derives that the energies at all points $\vect y$ outside the body fix the density. No tonne can be
brought up and taken away in fifty microseconds, but one that flies past does the same work.

## Two weighings of two copies read the even part and the odd part

Energy has weight. A gain $\Delta E$ raises the mass that the body's field reports by $\Delta E/c^2$, with $c$ the speed
of light (chapter 6.4), and an isolated body keeps the gain until it is read. We call this reading a **weighing**. One
weighing gives the sum of both parts of the paper's equation [](/paper/#eq:push). Two copies of the body, prepared alike
and kicked by $+\epsilon$ and $-\epsilon$, gain
$E_\pm = \pm\epsilon\matter{\dot Q_g} + \tfrac12\epsilon^2\int\matter\rho\,|\nabla g|^2\,\dd V$. Adding and
subtracting gives

$$\boxed{\;\begin{aligned}
\frac{E_+ + E_-}{2} &= \frac{\epsilon^2}{2}\int\matter\rho\,|\nabla g|^2\,\dd V,\\
\frac{E_+ - E_-}{2\epsilon} &= \matter{\dot Q_g} .
\end{aligned}\;}$$

For $g = \tfrac12(x^2 - y^2)$ the even part is $\tfrac12\epsilon^2$ times the moment of inertia about the $z$ axis, so a
ball and a shell of one mass and one radius gain in the ratio 3 : 5
([1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass)). Panel (a) of the
paper's figure draws it for three bodies.

{{paper fig:hair}}

The even parts weigh the inside. Two profiles $h$ and $g$ give $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ through

$$\nabla h\cdot\nabla g = \tfrac14\bigl(|\nabla(h + g)|^2 - |\nabla(h - g)|^2\bigr),$$

from four weighings, two for each of the profiles $h + g$ and $h - g$. For the paper's complex profiles these are the
left-hand side of its equation [](/paper/#eq:calderon), the density's Fourier transform, which chapter 13.2
derives.[^sum]

The odd parts read the motion. For a body of $N$ parts at known places $\vect x_a$, the odd part is
$\matter{\dot Q_g} = \sum_a\vect p_a\cdot\nabla g(\vect x_a)$ (chapter 1.7), one equation for the $3N$ components of the
momenta $\vect p_a$. The paper's [Appendix C](/paper/#app:proofs) proves that the gradients of harmonic functions at
$N$ places can take any values, so $3N$ well-chosen profiles give every momentum.[^rank] Chapter 1.7's last problem uses
the same result for the bracket.

## Both readings are far beyond reach

An impulse that changes velocities by $\Delta v$ raises the weight by about $\tfrac12(\Delta v/c)^2$ of itself: the
paper's $5.0 \times 10^{-41}$ for $\Delta v = 3 \times 10^{-12}\unit{m\,s^{-1}}$.[^dv] For the tonne and the steel ball
in full, the gain of $8.8 \times 10^{-21}$ J raises the ball's mass by $9.8 \times 10^{-38}$ kg, $2.4 \times 10^{-41}$
of itself, of which the inside's share is $1.1 \times 10^{-42}$. The tonne leaves slower by $4.5 \times 10^{-33}$ of
its speed, of which the inside's share is $2.1 \times 10^{-34}$.[^tonne] Timed over a measured stretch of path, a
slowing is the same fraction of the time of flight, and the best clocks keep time to about one part in $10^{18}$. The
inside's share is nearly sixteen powers of ten beyond them. Fine detail costs more still, exponentially (chapter 13.2).

The paper's equation [](/paper/#eq:push) also needs the impulse to be over before the body responds. A tide cannot be
switched on and off faster than light crosses the body, so the body's own motions must be slower than that. The
equation is also the first order in $1/c^2$, not the whole theory. The pass lasts about $|b|/V = 34\unit{\mu s}$, in
which the ball's slowest ringing that a tide can set going, at the angular frequency $1.6 \times
10^4\unit{s^{-1}}$,[^ring] turns through 0.54 radians. Chapter 1.8 estimated that this changes the internal energy by
10 to 15 per cent and leaves the recoil as it is. Chapter 13.5 removes the condition of slow motion.[^shock]

::: try {#first-and-second-order}
Predict first: as the passer goes once round the lopsided body at a fixed distance, which reading changes more with
the direction, the bending or the energy left inside? And does the bending change more at $4R$ or at $1.5R$? The
figure draws the chosen body, the passer's straight path and the bead where the path crosses the page. For each body
it reads the sideways momentum, with its parts from $m_{00}$ to $m_{04}$ listed under it, the bending angle and the
energy left inside. Start with *The paper's pair* and set *The passing mass* from one tonne to four. Then choose *Two
lumps*, set *Distance of the pass* to $4R$, and drag the bead once round the body, or turn it with the arrow keys; do
it again at $1.5R$.
:::

::: check
### Q

A passer bends by the same angle round a uniform ball and round a thin shell of the same mass. Why?

### A

The bending holds only the moments $m_{0q}$, and for a round body all of them except the mass vanish.

### Q

How many real numbers does the loss of energy hold up to the total degree 3, and how many does the bending?

### A

Ten against seven: $(3 + 1)(3 + 2)/2$ against $1 + 2 \times 3$.

### Q

Two copies of a moving body are kicked by $+\epsilon$ and $-\epsilon$ and gain $E_+$ and $E_-$. What does $E_+ - E_-$
measure?

### A

It measures $2\epsilon\matter{\dot Q_g}$, the rate of change of one of the field's moments: nothing about the density
beyond the field, but, with the places of the parts known, enough of them give every momentum.

### Q

Why do the passes along one great circle of directions give the density, when the body is not round?

### A

Each direction gives the density's transform on one plane of wavevectors through the origin, and those planes fill
the space.
:::

**The idea to keep: a probe reads the body's field at first order and the body's reply at second. A passing mass is
bent by the harmonic moments of the projected body alone, but the energy it loses holds every moment, and its losses
along one great circle of directions fix the density.**

::: problems
### Practice

The tonne passes the steel ball at $|b| = 1.5$ m at $100\unit{km\,s^{-1}}$ instead of 44. Find $C$, the ball's total
and internal gains, and the fraction by which the tonne slows.

::: solution
$C = 1.33 \times 10^{-12}\unit{m^2\,s^{-1}}$. Both gains go as $C^2$, so they fall by $(44/100)^2$, to
$1.7 \times 10^{-21}$ J and $7.7 \times 10^{-23}$ J. The fraction $\Delta E/\matter\mu V^2$ is $1.7 \times 10^{-34}$.
The pass now lasts 15 μs, so it is a better impulse.
:::

### Stretch

A thin ring of mass $\matter M$ and radius $d$ and a uniform disc of mass $\matter M$ and radius $\sqrt2\,d$ lie in the
plane across the path. Show that they bend alike every passer whose path is parallel to their axis, that their losses
agree up to $|b|^{-4}$, and that they first differ through $m_{22}$.

::: solution
Both are round, so $m_{0q} = 0$ for $q \ge 1$, and only $m_{pp}$ survive. Then $m_{11} = \matter Md^2$ for both, while
$m_{22}$ is $\matter Md^4$ for the ring and $\tfrac13\matter M(\sqrt2\,d)^4 = \tfrac43\matter Md^4$ for the disc.
:::

### The paper

Section XIII writes the integral of the paper's [](/paper/#eq:pass) for a round body as
$\matter M/b^2 + \tfrac23\int\matter\rho\,r^2\,\dd V/b^4 + \tfrac{8}{15}\int\matter\rho\,r^4\,\dd V/b^6$ and so on,
with its real $b$ our $|b|$. Check $\tfrac23$ and $\tfrac{8}{15}$ from the $m_{pp}$, and the paper's
$\matter MC^2R^4/15b^6$ between the two bodies of its figure.

::: solution
A part at the distance $r$ from the centre, at the angle $\theta$ to the path, has $|w|^2 = r^2\sin^2\theta$, so
$m_{pp} = \int\matter\rho\,r^{2p}\sin^{2p}\theta\,\dd V$. For a round body $\sin^{2p}\theta$ may be replaced by its
average over directions, and $\cos^2\theta$ and $\cos^4\theta$ average to $\tfrac13$ and $\tfrac15$. So
$\sin^2\theta$ averages to $\tfrac23$, and $\sin^4\theta$ to $1 - \tfrac23 + \tfrac15 = \tfrac{8}{15}$. The two
bodies have $\int\matter\rho\,r^4\,\dd V = \tfrac14\matter MR^4$ and $\tfrac12\matter MR^4$, so their terms in
$b^{-6}$ differ by $\tfrac12C^2 \times \tfrac{8}{15} \times \tfrac14\matter MR^4/b^6 = \matter MC^2R^4/15b^6$.
:::
:::

::: paper
- [Section XIII](/paper/#sec:second-order), its opening and
  [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing): the two orders, the paper's
  [](/paper/#eq:push) in parts, the weighings, the momenta and their reach.
- [*A mass that passes*](/paper/#par:a-mass-that-passes): the held mass, the paper's [](/paper/#eq:pass), the shell
  theorem in the plane, and Figure [](/paper/#fig:passing).
- [Appendix C](/paper/#app:proofs), *The moments and the weight* and
  [*What the passes of a mass determine*](/paper/#par:what-the-passes-of-a-mass-determine).
:::

::: deeper
- J. Binney and S. Tremaine, *Galactic Dynamics* (2nd ed., Princeton, 2008), treat the impulse approximation and the
  heating of star clusters by passing masses [@Spitzer1958].
:::

[^z]: The paper's appendix writes $z$ for this complex number, but here, as in chapter 1.8, $z$ is the distance along
    the path, so we keep 1.8's $w$. The appendix writes $\bar b$ for the conjugate that we write $b^*$.

[^nine]: For forty random lumps, losses on nine circles of 48 impact points, at 3 to 10 times the body's radius,
    return every $m_{pq}$ with $p + q \le 4$ to one part in $10^9$ of the mass.

[^exp]: The paper's appendix adds a route through B. Gustafsson and M. Putinar's exponential transform, which this
    step does not need.

[^nhat]: This $\hat n$ is a path's direction, not the direction from a pixel to a source of Sections IV and VIII.

[^sign]: With chapter 2.6's minus sign. The paper writes a plus sign in Section XIII, as 2.6 explains; equation
    [](#eq:slice) holds with either.

[^sum]: The paper calls its equation [](/paper/#eq:push) the sum rule "in time instead of frequency": a blow holds every
    frequency, and the energy it leaves is the total of chapter
    [4.5](/tutorial/response/causality/#a-blow-holds-every-frequency-and-the-energy-it-leaves-is-the-same-total).

[^rank]: For thirty parts at random places and the profiles $1/|\vect x - \vect y|$ of 400 points $\vect y$ outside,
    the table of gradients has rank 90, which is $3N$.

[^dv]: The paper's "tide of a tonne a metre away", $3 \times 10^{-12}\unit{m\,s^{-1}}$ at the edge, is the whole pull,
    mostly the recoil of the ball. Its tidal part, the change across the ball to first order in the radius, is
    $6.7 \times 10^{-13}\unit{m\,s^{-1}}$; the exact change from the centre to the edge is
    $1.01 \times 10^{-12}\unit{m\,s^{-1}}$ (chapter 1.8).

[^tonne]: The paper's "five parts in $10^{33}$" is this whole loss. Of it, 95 per cent is the recoil, which weighs the
    ball and nothing else.

[^ring]: H. Lamb's solution for a free elastic sphere (1882) puts this ringing of a steel ball of radius 10 cm near
    12.6 kHz, and the frequency goes as one over the radius. The paper's rougher 15 kHz, which chapter 1.8 scaled,
    gives $1.9 \times 10^4\unit{s^{-1}}$ and 0.65 radians.

[^shock]: There the impulsive wave of the paper's [](/paper/#eq:shock) gives the energy at any speed, light included,
    and the paper's [](/paper/#eq:massless-pass) is the pass at the speed of light.

[^thirty]: The paper's plain words say "energies in them that differ by $30\%$". These are the energies inside; with
    the recoil, the totals differ by 4.5 per cent.
