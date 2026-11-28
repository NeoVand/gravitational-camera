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

Two bodies pull alike everywhere outside: a thin shell, and a point at the centre of a larger shell that holds half
the mass. A tonne flies past each on the same straight path, at 1.5 times the larger radius from the centre. Both
bodies bend its path by exactly the same small angle. Yet the pass leaves 30 per cent more energy inside the second
body than inside the first,[^thirty] and the tonne pays for that energy out of its own motion.[^open]

{{paper fig:passing}}

Why does the bending show only what the steady field shows, while the slowing reaches the inside, and how do the
slowings along many paths become a map of the density? The pull on a mass outside is of first order in that mass. What
the body does in reply, and so what the mass gains or loses, is of second order.

![Look first at the bars on the right: a brief tide of degree three, not a passing mass, leaves twice as much energy
in the right-hand body as in the left, though the two pull alike everywhere outside the dashed circle. The left body is
a thin shell; the right holds half its mass in a small ball at its centre and half in a shell of the dashed circle's
radius. Pale orange and blue mark where the tide pushes out and where it pushes in, and the small arrows on each cut
ring are the kicks it gives. Section [13.3](/tutorial/what-a-field-keeps/ladder/) derives the ratio; the view and
the arrows' scale are schematic.](tut-keeps-hero){#fig:keeps-hero}

::: plain
A small mass that flies past a body is pulled toward it, so its path bends. Doubling the small mass doubles the
momentum it trades with the body. This is a first-order effect. The bending shows only what the body's steady pull
shows, so a hollow shell and a solid ball of the same mass bend the path alike.

The small mass also sets every part of the body moving. Doubling it doubles each part's speed, so the energy left
behind becomes four times as large. This is a second-order effect. The energy comes out of the passer's motion, so it
leaves a little slower, and the loss depends on how the mass is arranged inside.

Passes at many distances, from all round the body, fix the body's mass as seen along the paths. Paths in all the
directions of one plane then give the density everywhere inside.
:::

## A probe reads the field at first order and the body's reply at second

A **probe** is anything sent at a body to learn about it, such as a passing mass or a brief tide. A probe has a
strength that can be turned up or down: the passing mass $\sym{passing-mass}{\matter\mu}$, in kilograms, or the
strength $\sym{impulse-strength}{\epsilon}$ of the impulsive tide of section 1.7, whose product with the tide's profile
is in $\mathrm{m^2\,s^{-1}}$. An effect of the probe is **first order** in its strength if it is in proportion to the
strength, and **second order** if it is in proportion to the square of the strength, so that doubling the strength
makes it four times as large (section
[0.5](/tutorial/evening/what-the-outside-keeps/#the-bodys-reply-to-a-pull-reveals-its-inside)).

The pass is the first example. Section
[1.8](/tutorial/newton/orbits-and-kicks/#a-fast-passing-mass-gives-every-part-of-a-body-a-sideways-kick) found that a
part of the body over the point $\vect s$ of the plane across the path receives the velocity

$$\Delta\vect v = C\,\frac{\vect b - \vect s}{|\vect b - \vect s|^2}, \qquad \sym{flyby-constant}{C} = \frac{2G\matter\mu}{V},$$

where $\vect b$ is the point at which the path crosses that plane, $G$ is the gravitational constant, $V$ is the
passer's speed in metres per second, and $C$ is in $\mathrm{m^2\,s^{-1}}$. Every velocity is in proportion to
$\matter\mu$. So the body's momentum, a sum of masses times velocities, is first order in $\matter\mu$, and its kinetic
energy, a sum of masses times squared velocities, is second order. Doubling a tonne to two tonnes raises the kick at
the steel ball's near edge from $3.0 \times 10^{-12}$ to $6.1 \times 10^{-12}\unit{m\,s^{-1}}$, and the ball's gain of
energy from $8.8 \times 10^{-21}$ to $3.5 \times 10^{-20}\unit{J}$, four times as much.

On the passer each order falls by one, because each is divided by the passer's own momentum or energy. So its angle of
bending, its sideways momentum over $\matter\mu V$, does not depend on $\matter\mu$ at all, and the fraction by which
it slows is first order in $\matter\mu$.

The push is the second example. A part of mass $\matter m$ and momentum $\vect p$ that receives the kick
$\epsilon\nabla g$ per unit mass (section 1.7), with $g$ the tide's profile, a function of position that fixes its
shape, changes its kinetic energy by $\epsilon\,\vect p\cdot\nabla g + \tfrac12\matter m\,\epsilon^2|\nabla g|^2$.
Adding over the parts gives the energy $\Delta E$, in joules, that an impulsive tide leaves in a body that may
already be moving:[^push]

$$\boxed{\;\Delta E = \epsilon\,\matter{\dot Q_g} + \frac{\epsilon^2}{2}\int\matter\rho\,|\nabla g|^2\,\dd V .\;}$$

Here $\sym{mass-moment}{\matter{Q_g}} = \int\matter\rho\,g\,\dd V$ is the moment of the mass against $g$, with
$\sym{density}{\matter\rho}$ the density, and $\matter{\dot Q_g} = \sum\vect p\cdot\nabla g$ is its rate of change
(section 1.7). The first term is first order in $\epsilon$ and changes sign with it, so we call it the **odd part**.
For a harmonic $g$, $\matter{Q_g}$ is one of the moments that the steady field outside holds, so the odd part is that
field's rate of change and holds nothing about the density beyond what the field holds. The second term is second
order and keeps its sign, so we call it the **even part**. It weighs each piece of mass by the square of its kick.

A non-example is the steady pull of the body on the probe, $-\matter\mu\nabla\field\Phi$, with $\field\Phi$ the
body's potential. It is first order in $\matter\mu$, and by the shell theorem
([section 1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)) and the null space
([section 2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see))
it holds only the harmonic moments, the moments of the mass against harmonic functions.

Three second-order readings hold the same integral: a warm body's tremor
([section 4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density)),
its response to a tide driven fast
([section 4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust)), and the energy
exchanged with a probe. Each holds $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ for two harmonic profiles $h$ and
$g$, and $\nabla h\cdot\nabla g$ is in general not harmonic
([section 2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic)): for $h = g =
\tfrac12(x^2 - y^2)$ it is $x^2 + y^2$, whose Laplacian is 4. The shell theorem is a theorem about first order.

## The passer's bending holds only the harmonic moments of the projected body

We want the momentum that the pass gives the body. By the third law
([section 1.6](/tutorial/newton/motion/#force-changes-momentum-and-forces-inside-a-body-cancel)) the passer loses the
same momentum sideways, and that loss is its bending. We keep the two assumptions of section 1.8: **the passer moves on
a straight line** and **the parts of the body stay still while it passes**.

We write a point $\vect s$ of the plane as the complex number $\sym{complex-place}{w} = x + iy$, and the crossing
point $\vect b$ as the complex number $b$, in metres, with $|b|$ its distance from the origin and $\varphi$ its
angle. A velocity $(X, Y)$ is the complex number $X + iY$, and $|b - w|^2 = (b - w)(b^* - w^*)$, so the kick at $w$ is

$$C\,\frac{b - w}{|b - w|^2} = \frac{C}{b^* - w^*} .$$

Let the origin lie inside the body, and assume that **every part of the projected body is closer to the origin than
the path is**, $|w| < |b|$. This asks more than a miss: a path between the two ends of a long body misses it, yet
some parts lie farther out than the path. The geometric series then gives

$$\frac{C}{b^* - w^*} = \frac{C}{b^*}\sum_{q=0}^{\infty}\Bigl(\frac{w^*}{b^*}\Bigr)^q .$$

The parts over a small patch $\dd^2s$ carry the mass $\sym{projected-density}{\matter\Sigma}\,\dd^2s$, where
$\matter\Sigma$ is the projected surface density of section 1.8, in kilograms per square metre. We multiply each kick
by this mass and add the patches. The body's momentum after the pass, written as a complex number, is

$$\boxed{\;\Delta P = C\sum_{q=0}^{\infty}\frac{m_{0q}}{(b^*)^{q+1}},\;}$$

where

$$\sym{planar-moment}{m_{pq}} = \int w^p\,(w^*)^q\,\matter\Sigma\,\dd^2s$$

is the **planar moment** of the projected body, a complex number in $\mathrm{kg\,m}^{p+q}$. It is not a mass, though it
has the letter. We call $p + q$ its **total degree**, the degree of $w^p(w^*)^q$ as a polynomial in $x$ and $y$. The
term $q = 0$ is $C\matter M/b^*$, with $\sym{mass}{\matter M}$ the body's mass. Its length is $\matter M$ times the
recoil velocity $C/|b|$ of section 1.8, and its direction is that of $b$, toward the path.

Only the moments $m_{0q}$ enter, the moments against the powers of $w^* = x - iy$. Their real and imaginary parts are
harmonic in the plane (section 2.1), and so in space, since they do not change along the path. Their moments against
$\matter\Sigma$ are moments against $\matter\rho$, which the steady field outside holds. The reason is general: the
kick is $-C\nabla\ln|\vect b - \vect s|$, the gradient of a function harmonic in the plane away from $\vect b$, and
every derivative of a harmonic function is harmonic. Because $\matter\Sigma$ is real, $m_{q0} = m_{0q}^*$, so these are
also the moments against the powers of $x + iy$.

So two projected bodies with the same $m_{0q}$ bend every passer alike. For a round body every $m_{0q}$ with $q \ge 1$
vanishes, because the powers of $w^*$ average to zero round each circle (section 1.8), and a round body bends the
passer as a point of its mass would. This is the shell theorem in the plane.[^plane] The angle of bending is
$|\Delta P|/\matter\mu V = 2G\matter M/|b|V^2$: $1.9 \times 10^{-16}$ rad for the steel ball of 4110 kg at
$|b| = 1.5\unit{m}$ and $44\unit{km\,s^{-1}}$, as section 1.8 found. The two bodies of the opening bend it by the
same angle, exactly (Figure [](#fig:pass-two-orders)). Far away only the term $q = 0$ survives, and every body bends
the passer as a point mass does. Up to the total degree $n$, the bending holds $m_{00}$, the mass, and the complex
numbers $m_{01}$ to $m_{0n}$: in all, $1 + 2n$ real numbers.

![Look first at the two bars: one pass leaves 0.080 and 0.104, in units of $\matter MC^2/2R^2$, inside two bodies that
the pass bends by exactly the same angle. Left, a thin shell of radius $R/\sqrt2$; right, half the mass at the centre
of a shell of radius $R$. The bending is drawn much larger than it is, alike for both, and the cutaway bodies are
pictures.](tut-pass-two-orders){#fig:pass-two-orders}

## The passer's loss of energy holds every moment of the projected body

We want the energy that the pass leaves, keeping every term that section 1.8 averaged away. The kicks have the
squared length $C^2/|b - w|^2$, so the even part of the energy, summed over the parts, is

$$\Delta E(\vect b) = \frac{C^2}{2}\int\frac{\matter\Sigma(\vect s)}{|\vect b - \vect s|^2}\,\dd^2s .$$

Section 1.8 multiplied the geometric series of $1/(b - w)$ and of $1/(b - w^*)$ for a real $b$. The same product, for
a complex $b$ and with $|w| < |b|$, is

$$\frac{1}{|b - w|^2} = \sum_{p, q\ge0}\frac{w^p\,(w^*)^q}{b^{p+1}\,(b^*)^{q+1}} ,$$

and the integral of each term is a planar moment:[^pass]

$$\boxed{\;\Delta E(b) = \frac{C^2}{2}\sum_{p, q\ge0}\frac{m_{pq}}{b^{p+1}\,(b^*)^{q+1}} .\;}$$

The unit is $\mathrm{m^4\,s^{-2}}$ times $\mathrm{kg\,m}^{p+q}$ over $\mathrm m^{p+q+2}$, which is joules.

The moments can be told apart. Write $b = |b|e^{i\varphi}$. Multiplying adds angles (section 1.5b), so dividing by
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
number. So the pairs hold that many real numbers, against the $1 + 2n$ of the bending:

| Total degree up to | 0 | 1 | 2 | 3 | 4 |
|:--|:-:|:-:|:-:|:-:|:-:|
| real numbers in the bending | 1 | 3 | 5 | 7 | 9 |
| real numbers in the loss | 1 | 3 | 6 | 10 | 15 |

The two agree for the mass and the centre of mass. At degree two the loss gains
$m_{11} = \int\matter\rho\,(x^2 + y^2)\,\dd V$, with the path along $z$: the moment of inertia about the path's
direction, which the steady field cannot see (section
[1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)).

The pair of the opening shows the table at work. Both bodies are round, so only the $m_{pp}$ survive. Both have $m_{11} = \tfrac13\matter MR^2$, with $R$ the larger shell's radius, so their losses
agree up to $|b|^{-4}$. Then $m_{22}$ is $\tfrac{2}{15}\matter MR^4$ for the thin shell and $\tfrac{4}{15}\matter MR^4$
for the other. Summed in full at $|b| = 1.5R$, the internal energies are 0.080 and 0.104 in units of
$\matter MC^2/2R^2$, 30 per cent apart.

The moments fix $\matter\Sigma$. The transform across the plane (section 2.6) is
$\tilde{\matter\Sigma}(\vect k) = \int\matter\Sigma\,e^{-i\vect k\cdot\vect s}\,\dd^2s$, with $\vect k$ a wavevector in
radians per metre. We expand the exponential in its power series:

$$\tilde{\matter\Sigma}(\vect k) = \sum_{n=0}^{\infty}\frac{(-i)^n}{n!}\int(\vect k\cdot\vect s)^n\,\matter\Sigma\,\dd^2s .$$

Each $(\vect k\cdot\vect s)^n$ is a polynomial of degree $n$ in $x$ and $y$, and $x = (w + w^*)/2$ and
$y = (w - w^*)/2i$, so each integral is a sum of the $m_{pq}$ with $p + q = n$. The moments therefore give
$\tilde{\matter\Sigma}$ at every $\vect k$, and the inverse transform gives $\matter\Sigma$. That a body of bounded
size is fixed by its polynomial moments is called **moment determinacy**.

The exchange of the sum and the integral is allowed. If every part lies within the distance $a$ of the origin, then
$|\vect k\cdot\vect s| \le |\vect k|a$ throughout the body, so the $n$-th term of the series is at most
$(|\vect k|a)^n/n!$ times the mass, and these bounds add up to $e^{|\vect k|a}$ times the mass. A series bounded term by
term by a convergent one may be integrated term by term, and the result converges for every $\vect k$.

That the moments fix the body even when its density jumps, or when it holds thin shells or points, follows without
the transform. Let the body lie in a square $Q$ of the plane. By **Weierstrass's theorem**, every continuous function
$f$ on $Q$ is the limit, uniform over $Q$, of polynomials in $x$ and $y$ (K. Weierstrass, 1885). Bernstein's proof
shows why: on $0 \le x \le 1$ the polynomial $\sum_k f(k/n)\binom{n}{k}x^k(1 - x)^{n-k}$ is an average of $f$ over
the points $k/n$, with the weights of $n$ tosses of a coin that falls heads with the probability $x$, which crowd
within about $\sqrt{x(1 - x)/n}$ of $x$; as $n$ grows the average tends to $f(x)$, uniformly because $f$
is uniformly continuous on the closed interval. The same average over a grid of points $(k/n, l/n)$, with one set of
weights in $x$ and another in $y$, gives the square. If $P$ is within
$\varepsilon$ of $f$ everywhere on $Q$, then $\int P\,\matter\Sigma\,\dd^2s$, which the moments give, is within
$\varepsilon\matter M$ of $\int f\,\matter\Sigma\,\dd^2s$. So the moments give $\int f\,\matter\Sigma\,\dd^2s$ for every
continuous $f$.

Now take a closed rectangle $B$ inside $Q$, and let $f_j$ be 1 on $B$, 0 farther than $1/j$ from it, and linear in the
distance between. Each $f_j$ is continuous, and as $j$ grows $f_j$ falls to the indicator of $B$, the function that is
1 on $B$ and 0 elsewhere. Because mass is never negative, $\int f_j\,\matter\Sigma\,\dd^2s$ falls to the mass in $B$.
So the moments give the mass in every closed rectangle, and with it the mass in every region built from rectangles,
however the density jumps and whether the mass is spread, laid on a curve or gathered at a point. Two bodies with the
same moments have the same mass in every rectangle, so they are the same body.

Nothing is weighed, and the speed of light does not enter. The passer leaves slower by $\Delta E/\matter\mu V$. The
leading term of the loss, $C^2\matter M/2|b|^2$, taken as a fraction of the passer's energy, is smaller than the angle
of bending, $C\matter M/|b|\matter\mu V$, by the factor $C/|b|V = 2G\matter\mu/|b|V^2$: the body's speed after the pass
over the passer's, and $4.6 \times 10^{-17}$ for the tonne. The second reading is that much weaker than the first, and
section 13.2 counts what this costs.

## Passes along one great circle of directions give the density

The losses on paths in one direction give $\matter\Sigma$ for that direction, and we want $\matter\rho$ itself. Let the
paths run along the unit vector $\hat n$. With $z$ the distance along a path, in metres, the projected density over the
point $\vect s$ of the plane across $\hat n$ is

$$\matter\Sigma_{\hat n}(\vect s) = \int\matter\rho(\vect s + z\hat n)\,\dd z .$$

Take a wavevector $\vect k$ in that plane, so that $\vect k\cdot\hat n = 0$. The density's transform is
$\tilde{\matter\rho}(\vect k) = \int\matter\rho\,e^{-i\vect k\cdot\vect x}\,\dd V$. Every point is
$\vect x = \vect s + z\hat n$, with $\dd V = \dd^2s\,\dd z$, and $\vect k\cdot\vect x = \vect k\cdot\vect s$. The
exponential does not change along a path, so we do the integral along the path first:

$$\boxed{\;\begin{aligned}
\tilde{\matter\rho}(\vect k) &= \int e^{-i\vect k\cdot\vect s}\Bigl[\int\matter\rho\,\dd z\Bigr]\dd^2s\\
&= \tilde{\matter\Sigma}_{\hat n}(\vect k)\quad\text{for }\vect k\cdot\hat n = 0 .
\end{aligned}\;} \label{eq:slice}$$

This is the projection–slice theorem of section
[5.6](/tutorial/waves/abel-transform/#a-body-that-is-not-round-needs-views-from-many-directions).

A **great circle** of directions is the set of all directions at right angles to one axis $\hat\nu$, as the equator's
directions are at right angles to the Earth's axis. Take any $\vect k$. If $\vect k$ is not along $\hat\nu$, the
direction $\hat n = \vect k\times\hat\nu/|\vect k\times\hat\nu|$ is at right angles to $\hat\nu$, so it lies on the
great circle, and it is at right angles to $\vect k$, so $\vect k$ lies on its slice. If $\vect k$ is along $\hat\nu$,
every direction of the circle is at right angles to it. So the slices of one great circle fill the whole space of
wavevectors (Figure [](#fig:pass-slice)). The losses on paths whose directions lie in one plane give
$\tilde{\matter\rho}$ at every $\vect k$, and the inverse transform gives $\matter\rho$ everywhere.[^proofs]

A round body needs one direction only. Its $\matter\Sigma$ is then the Abel transform of section
[5.6](/tutorial/waves/abel-transform/#the-transform-can-be-undone), which can be undone. For a stone, a mass that
passes gives the density; for a black hole it gives what the hole absorbs, set by its mass and spin.[^hair]

![Look first at the three slices on the right: each direction of paths gives the density's transform on one plane of
wavevectors, and as the direction turns round the great circle, the planes turn about its axis and fill the space.
Left, the body, three bundles of paths in directions of one great circle, and the projected mass for one of them, the
body's mass summed along lines in that direction, as along the dotted one. The body's shape and the spacing of the
paths are chosen for the drawing.](tut-pass-slice){#fig:pass-slice}

## A mass held for an instant leaves energy through a kernel that is not harmonic

A mass $\matter\mu$ held still at a point $\vect y$ outside the body for a short time $\delta t$, then taken away, is
the impulsive tide of section 1.7 with the profile $g = 1/|\vect x - \vect y|$ and the strength
$\epsilon = G\matter\mu\,\delta t$, in $\mathrm{m^3\,s^{-1}}$. We call it a **held mass**. Since
$|\nabla g|^2 = |\vect x - \vect y|^{-4}$, a body at rest gains

$$\Delta E(\vect y) = \tfrac12(G\matter\mu\,\delta t)^2\int\matter\rho\,|\vect x - \vect y|^{-4}\,\dd V .$$

The field's kernel is harmonic, and the energy's is not. For a power of the distance $r = |\vect x - \vect y|$, section
[2.2](/tutorial/outside/spherical-harmonics/#the-laplacian-splits-into-a-part-along-the-radius-and-a-part-on-the-sphere)
gives $\nabla^2r^n = n(n + 1)\,r^{n-2}$ away from $r = 0$. For the field, $n = -1$ gives zero. For the energy,
$n = -4$ gives $12\,r^{-6}$. So the energy weighs the density by a function that no reading of the field at one time
can supply, and section
[13.3](/tutorial/what-a-field-keeps/ladder/#a-mass-held-for-an-instant-is-a-tide-of-every-degree-so-it-climbs-the-whole-ladder)
derives that the energies at all points $\vect y$ outside a sphere about the centre that encloses the body fix the
density. No tonne can be brought up and taken away in fifty microseconds, but one that flies past does the same work.

## Two weighings of two copies read the even part and the odd part

Energy has weight. A gain $\Delta E$ raises the mass that the body's field reports by $\Delta E/c^2$, with $c$ the
speed of light (section 6.4), and an isolated body keeps the gain until it is read. We call this reading a
**weighing**. One weighing gives the sum of both parts of the boxed energy above. Two copies of the body, prepared
alike and kicked by $+\epsilon$ and $-\epsilon$, gain
$E_\pm = \pm\epsilon\matter{\dot Q_g} + \tfrac12\epsilon^2\int\matter\rho\,|\nabla g|^2\,\dd V$. Adding and
subtracting gives

$$\boxed{\;\begin{aligned}
\frac{E_+ + E_-}{2} &= \frac{\epsilon^2}{2}\int\matter\rho\,|\nabla g|^2\,\dd V,\\
\frac{E_+ - E_-}{2\epsilon} &= \matter{\dot Q_g} .
\end{aligned}\;}$$

For $g = \tfrac12(x^2 - y^2)$ the even part is $\tfrac12\epsilon^2$ times the moment of inertia about the $z$ axis, so a
ball and a shell of one mass and one radius gain in the ratio 3 : 5 (section
[1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass)), as panel (a) of
Figure [](/paper/#fig:hair) draws for three bodies.

{{paper fig:hair}}

The even parts weigh the inside. Two profiles $h$ and $g$ give $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ through

$$\nabla h\cdot\nabla g = \tfrac14\bigl(|\nabla(h + g)|^2 - |\nabla(h - g)|^2\bigr),$$

from four weighings, two for each of the profiles $h + g$ and $h - g$. For complex profiles these are the left-hand
side of the equation that section 13.2 derives, the density's Fourier transform.[^sum]

The odd parts read the motion. For a body of $N$ parts at known places $\vect x_a$, the odd part is
$\matter{\dot Q_g} = \sum_a\vect p_a\cdot\nabla g(\vect x_a)$ (section 1.7), one equation for the $3N$ components of
the momenta $\vect p_a$. The gradients of harmonic functions at $N$ places can take any values, so $3N$ well-chosen
profiles give every momentum.[^rank] The last problem of section 1.7 uses the same result for the bracket.

## Both readings are far beyond reach

An impulse that changes velocities by $\Delta v$ raises the weight by about $\tfrac12(\Delta v/c)^2$ of itself: for
$\Delta v = 3 \times 10^{-12}\unit{m\,s^{-1}}$ this is $5.0 \times 10^{-41}$.[^dv] For the tonne and the steel ball in
full, the gain of $8.8 \times 10^{-21}$ J raises the ball's mass by $9.8 \times 10^{-38}$ kg, $2.4 \times 10^{-41}$ of
itself, of which the inside's share is $1.1 \times 10^{-42}$. The tonne leaves slower by $4.5 \times 10^{-33}$ of its
speed, of which the inside's share is $2.1 \times 10^{-34}$.[^tonne] Timed over a measured stretch of path, a slowing
is the same fraction of the time of flight, and the best clocks keep time to about one part in $10^{18}$. The inside's
share is nearly sixteen powers of ten beyond them. Fine detail costs more still, exponentially (section 13.2).

The boxed energy needs the impulse to be over before the body responds, and a tide cannot be switched faster than
light crosses the body. It is also the first order in $1/c^2$, not the whole theory. The pass lasts about $|b|/V = 34\unit{\mu s}$, in which the ball's slowest
ringing that a tide can set going, at the angular frequency $1.6 \times 10^4\unit{s^{-1}}$,[^ring] turns through 0.54
radians. Section 1.8 estimated that this changes the internal energy by 10 to 15 per cent and leaves the recoil as it
is. Section 13.5 removes the condition of slow motion.

::: try {#first-and-second-order}
Predict first: as the passer goes once round the lopsided body at a fixed distance, which reading changes more with
the direction, the bending or the energy left inside? And does the bending change more at $4R$ or at $1.5R$? The
figure draws the chosen body, the passer's straight path and the bead where the path crosses the page. For each body
it reads the sideways momentum, with its parts from $m_{00}$ to $m_{04}$ listed under it, the bending angle and the
energy left inside. Start with the first body in the list and set *The passing mass* from one tonne to four. Then choose *Two
lumps*, set *Distance of the pass* to $4R$, and drag the bead once round the body, or turn it with the arrow keys; do
it again at $1.5R$.
:::

**The idea to keep: a probe reads the body's field at first order and the body's reply at second. A passing mass is
bent by the harmonic moments of the projected body alone, but the energy it loses holds every moment, and its losses
along one great circle of directions fix the density.**

::: problems
### Practice

**[13.1]** A passer bends by the same angle round a uniform ball and round a thin shell of the same mass. Why?

::: solution
The bending holds only the moments $m_{0q}$, and for a round body all of them except the mass vanish.
:::

**[13.1]** The tonne passes the steel ball at $|b| = 1.5$ m at $100\unit{km\,s^{-1}}$ instead of 44. Find $C$, the
ball's total and internal gains, and the fraction by which the tonne slows.

::: solution
$C = 1.33 \times 10^{-12}\unit{m^2\,s^{-1}}$. Both gains go as $C^2$, so they fall by $(44/100)^2$, to
$1.7 \times 10^{-21}$ J and $7.7 \times 10^{-23}$ J. The fraction $\Delta E/\matter\mu V^2$ is $1.7 \times 10^{-34}$.
The pass now lasts 15 μs, so it is a better impulse.
:::

**[13.1]** How many real numbers does the loss of energy hold up to the total degree 3, and how many does the bending?

::: solution
Ten against seven: $(3 + 1)(3 + 2)/2$ against $1 + 2 \times 3$.
:::

### Stretch

**[13.1]** Write the Bernstein polynomial of degree 2 for $f(x) = |x - \tfrac12|$ on $0 \le x \le 1$, and find how far
it is from $f$ at $x = \tfrac12$. Why does the error shrink as the degree grows?

::: solution
$B_2f(x) = \tfrac12(1 - x)^2 + 0 + \tfrac12x^2$, which is $\tfrac14$ at $x = \tfrac12$, against $f = 0$. The weights
crowd within about $\sqrt{x(1 - x)/n}$ of $x$, so the average samples $f$ ever closer to $x$; at $x = \tfrac12$ the
error is close to $\sqrt{1/2\pi n}$, which falls to zero.
:::


**[13.1]** Two copies of a moving body are kicked by $+\epsilon$ and $-\epsilon$ and gain $E_+$ and $E_-$. What does
$E_+ - E_-$ measure?

::: solution
It measures $2\epsilon\matter{\dot Q_g}$, the rate of change of one of the field's moments: nothing about the density
beyond the field, but, with the places of the parts known, enough of them give every momentum.
:::

**[13.1]** A thin ring of mass $\matter M$ and radius $d$ and a uniform disc of mass $\matter M$ and radius $\sqrt2\,d$
lie in the plane across the path. Show that they bend alike every passer whose path is parallel to their axis, that
their losses agree up to $|b|^{-4}$, and that they first differ through $m_{22}$.

::: solution
Both are round, so $m_{0q} = 0$ for $q \ge 1$, and only $m_{pp}$ survive. Then $m_{11} = \matter Md^2$ for both, while
$m_{22}$ is $\matter Md^4$ for the ring and $\tfrac13\matter M(\sqrt2\,d)^4 = \tfrac43\matter Md^4$ for the disc.
:::

### The camera

**[13.1]** For a round body the loss of energy is $\matter M/b^2 + \tfrac23\int\matter\rho\,r^2\,\dd V/b^4 +
\tfrac{8}{15}\int\matter\rho\,r^4\,\dd V/b^6$ and so on, in units of $C^2/2$, with a real $b$. Check $\tfrac23$ and
$\tfrac{8}{15}$ from the $m_{pp}$, and the difference $\matter MC^2R^4/15b^6$ between the two bodies of the opening.

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
  [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing): the two orders, the energy of
  an impulsive tide in its two parts, the weighings, the momenta and their reach.
- [*A mass that passes*](/paper/#par:a-mass-that-passes): the held mass, the energy of a pass, the shell
  theorem in the plane, and Figure [](/paper/#fig:passing).
- [Appendix C](/paper/#app:proofs), *The moments and the weight* and
  [*What the passes of a mass determine*](/paper/#par:what-the-passes-of-a-mass-determine).
:::

::: deeper
- J. Binney and S. Tremaine, *Galactic Dynamics* (2nd ed., Princeton, 2008), treat the impulse approximation and the
  heating of star clusters by passing masses [@Spitzer1958].
:::

[^thirty]: Not counting the push that moves each body as a whole. With that push, the recoil, the totals differ by 4.5
    per cent.

[^open]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII.

[^push]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, as its equation
    [](/paper/#eq:push), which also holds for the operators of quantum mechanics, where the impulse is
    $e^{i\epsilon Q_g/\hbar}$; see [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing).

[^plane]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, where it is called the shell theorem
    in the plane; see [*A mass that passes*](/paper/#par:a-mass-that-passes).

[^pass]: This is equation [](/paper/#eq:pass) of *The gravitational camera* (Mohsenvand 2026), Sec. XIII; the
    heating of a star cluster by a passing mass is its classical counterpart [@Spitzer1958].

[^nine]: For forty random lumps, losses on nine circles of 48 impact points, at 3 to 10 times the body's radius,
    return every $m_{pq}$ with $p + q \le 4$ to one part in $10^9$ of the mass.

[^proofs]: See [*What the passes of a mass determine*](/paper/#par:what-the-passes-of-a-mass-determine) and
    [Appendix C](/paper/#app:proofs) of *The gravitational camera* (Mohsenvand 2026).

[^hair]: Table [](/paper/#tab:hair) of *The gravitational camera* (Mohsenvand 2026) lists what each probe reads.

[^sum]: Equation [](/paper/#eq:push) of *The gravitational camera* (Mohsenvand 2026) is the sum rule in time instead of
    frequency: a blow holds every frequency, and the energy it leaves is the total of section
    [4.5](/tutorial/response/causality/#a-blow-holds-every-frequency-and-the-energy-it-leaves-is-the-same-total).

[^rank]: For thirty parts at random places and the profiles $1/|\vect x - \vect y|$ of 400 points $\vect y$ outside,
    the table of gradients has rank 90, which is $3N$.

[^dv]: The pull of a tonne held 1 m from the edge for 50 µs. Of it, $1.5 \times 10^{-12}\unit{m\,s^{-1}}$ is the
    recoil of the ball.

[^tonne]: Of the whole loss, $5 \times 10^{-33}$ of the tonne's speed, 95 per cent is the recoil, which weighs the ball
    and nothing else; the rest is the inside's share.

[^ring]: H. Lamb's solution for a free elastic sphere (1882) puts this ringing near 12.6 kHz for a steel ball of
    radius 10 cm; the frequency goes as one over the radius.

