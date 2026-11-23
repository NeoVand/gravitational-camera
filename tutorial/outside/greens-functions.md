---
id: '2.4'
title: "Green's functions"
question: 'Every potential in the paper is built from the potential of a single point. Why does one point suffice, and what does the same idea give when the potential is known only on a surface, such as a camera''s plane or a sphere round a body?'
part: '2'
requires: ['1.2', '1.3', '2.1', '2.2', '2.3']
paper: [sec:near-field, fig:same-outside, eq:split, eq:evanescent, eq:resolution, fig:nearfield, eq:scene-transform, eq:wave-zone, eq:abel]
figures: [fig:same-outside]
live: [image-charge]
depth: A
---

In the paper's Figure [](/paper/#fig:same-outside) a gold nugget of mass $\matter m$ sits inside a steel ball of radius
$R$, at the distance $s$ from its centre. The paper's [Section IV](/paper/#sec:near-field), in *What the image does
show*, says that "Poincaré's balayage sweeps the same mass onto the surface as a skin of surface density
$m(R^2 - s^2)/4\pi R\,|\mathbf x - \mathbf s|^3$, thickest over the nugget". Here $\vect s$ is the nugget's position,
measured from the centre, and $\vect x$ is a point of the ball's surface. Balayage, French for sweeping, replaces the
nugget by a thin skin of the same mass, which pulls on everything outside the ball exactly as the nugget does.

So we ask why the potential of a single point is enough to build every potential in the paper, and what the same idea
gives when the potential is known only on a surface, such as a camera's flat plane or a sphere round a body. The
skin's formula is the last step of the answer.

::: plain
Gravity adds up. The potential of a body is the sum of the potentials of its small pieces, and each piece pulls like
a point. So one formula, the potential of a single point of unit mass, builds the potential of anything. That formula
is called a Green's function.

The same idea answers a second question. Suppose that a camera knows the potential only on a surface, and that no
matter lies beyond the surface. Then the potential everywhere beyond it is a weighted average of the values on the
surface. For a flat camera the weights form a bell under each point, wider at greater heights, so the potential higher
up is smoother. For a sphere they show that a point mass inside a ball can be replaced by a thin skin on its surface,
thickest over the point, which pulls outside exactly as the point does.
:::

## The potential of one point builds every potential

We want the potential of a body from its density. Throughout, $\vect x$ is the point where we want the potential and
$\vect y$ is a point where a source sits (chapter 1.2 wrote $\vect x'$ for it). Chapter 1.3 found that [$\nabla^2(1/r) =
-4\pi\,\delta^3(\vect x)$](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point), where
$\sym{delta-function}{\delta^3}$ is the delta function, in $\mathrm{m^{-3}}$. With the origin moved to $\vect y$, it
says that the function

$$\sym{greens-function}{\mathcal G}(\vect x, \vect y) = -\frac{1}{4\pi\,|\vect x - \vect y|}$$

satisfies $\nabla^2\mathcal G = \delta^3(\vect x - \vect y)$, with the Laplacian taken with respect to $\vect
x$.[^script] A **Green's function** of the Laplacian is any solution of this equation: the potential of a point source
of unit strength at $\vect y$, in $\mathrm{m^{-1}}$. This one falls to zero far away.

Poisson's equation, $\nabla^2\field\Phi = 4\pi G\matter\rho$, is **linear**: the Laplacian of a sum is the sum of the
Laplacians, and a constant factor passes through it. A body is a sum of small pieces, the piece at $\vect y$ having the
mass $\matter\rho(\vect y)\,\dd^3y$, so its potential is the same sum of Green's functions, the
[superposition](/tutorial/newton/field-and-potential/#the-field-is-the-pull-per-unit-mass-and-fields-add) of chapter
1.2:

$$\boxed{\;\begin{aligned}\field\Phi(\vect x) &= 4\pi G\int\mathcal G(\vect x, \vect y)\,\matter\rho(\vect y)\,\dd^3y\\ &= -G\int\frac{\matter\rho(\vect y)}{|\vect x - \vect y|}\,\dd^3y .\end{aligned}\;} \label{eq:superposition}$$

The second form is chapter 1.2's
[integral over a body](/tutorial/newton/field-and-potential/#a-potential-is-one-number-per-point-whose-downhill-slope-is-the-field),
in joules per kilogram. A point mass $\matter M$ at the origin, of density $\matter M\,\delta^3(\vect y)$, gets
$4\pi G\matter M\,\mathcal G(\vect x, 0) = -G\matter M/r$, as it should. We apply the Laplacian under the integral
and use the rule of the delta function:

$$\begin{aligned}\nabla^2\field\Phi(\vect x) &= 4\pi G\int\delta^3(\vect x - \vect y)\,\matter\rho(\vect y)\,\dd^3y\\ &= 4\pi G\matter\rho(\vect x) .\end{aligned}$$

So the potential of any body satisfies Poisson's equation wherever its density is smooth, as chapter 1.3 promised.
The step across the point $\vect y = \vect x$, where $\mathcal G$ is infinite, needs care, which the next section
supplies. Where the density jumps, as at the surface of the steel ball below, the second derivative of $\field\Phi$
along the radius jumps by $4\pi G\matter\rho$, and the equation holds only in the integrated sense of the next section.

**A number.** A steel ball of radius $R = 10\unit{cm}$ and density $7850\unit{kg\,m^{-3}}$ has the mass
$32.9\unit{kg}$. Seen from its centre, the steel at the distance $r$ fills a shell of volume $4\pi r^2\,\dd r$, so
[](#eq:superposition) gives

$$\begin{aligned}\field\Phi(0) &= -G\int_0^R\frac{\matter\rho\,4\pi r^2}{r}\,\dd r = -2\pi G\matter\rho R^2\\ &= -3.3 \times 10^{-8}\unit{J\,kg^{-1}} .\end{aligned}$$

This is 1.5 times the value at the surface, $-G\matter M/R = -2.2 \times 10^{-8}\unit{J\,kg^{-1}}$, which the practice
problem of chapter 1.3 found by another road.

**A non-example.** The potential [](#eq:superposition) plus a constant, or plus $g_0z$ (a uniform downward pull of $g_0$
metres per second squared), also satisfies Poisson's equation. Neither sum falls to zero far away, and chapter 2.1
proved that only one solution [does](/tutorial/outside/laplace/#the-values-on-a-closed-surface-fix-the-potential-inside).
In the same way, $\mathcal G$ plus any function harmonic in $\vect x$ is a Green's function, and a condition on a
boundary picks one.

The Green's function depends only on the distance $|\vect x - \vect y|$, so $\mathcal G(\vect x, \vect y) = \mathcal
G(\vect y, \vect x)$. This symmetry is called **reciprocity**: the potential at the camera of a kilogram in the safe
equals the potential in the safe of a kilogram at the camera.

## The Laplacian of the inverse distance is a delta function, by Green's second identity

We want to prove the statement in chapter 1.3's
[gap box](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point), which gives
$\nabla^2(1/r) = -4\pi\delta^3$ its precise meaning. We test it against a function $f$, and assume that **$f$ has
continuous second derivatives** and that **$f$ and its gradient fall to zero far away fast enough** that their
integrals over a very large sphere vanish, as $e^{-r^2}$ does.

Green's second identity cannot be used across the origin, where $1/r$ is infinite. So we take for $V$ the shell
between a small sphere of radius $\varepsilon$ round the origin[^eps] and a large sphere of radius $L$, where
$\nabla^2(1/r) = 0$. We apply
[Green's second identity](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other)
to $V$ with $u = 1/r$ and $v = f$. As $L$ grows, the integral over the large sphere vanishes by the second assumption,
and the small sphere is left:

$$\int_{r > \varepsilon}\frac{\nabla^2 f}{r}\,\dd^3x = \oint_{r = \varepsilon}\Bigl(\frac1r\,\nabla f - f\,\nabla\frac1r\Bigr)\cdot\dd\vect A .$$

The element $\dd\vect A$ points out of $V$, which on the small sphere is toward the origin (Figure [](#fig:grn-hole)),
so $\dd\vect A = -\hat{\vect x}\,\varepsilon^2\,\dd\Omega$, where $\hat{\vect x}$ is the unit vector away from the
origin and $\dd\Omega$ the solid angle. The first term is at most $(1/\varepsilon) \times |\nabla f|_{\max} \times
4\pi\varepsilon^2$, which tends to zero with $\varepsilon$. In the second term $\nabla(1/r) = -\hat{\vect x}/r^2$
(chapter 1.2), so

$$\begin{aligned}-f\,\nabla\frac1r\cdot\dd\vect A &= -f\,\Bigl(-\frac{\hat{\vect x}}{\varepsilon^2}\Bigr)\cdot\bigl(-\hat{\vect x}\,\varepsilon^2\,\dd\Omega\bigr)\\ &= -f\,\dd\Omega .\end{aligned}$$

As the sphere shrinks, $f$ on it approaches $f(0)$, and the integral of $\dd\Omega$ is $4\pi$. The left side approaches
the integral over all space, because $1/r$ times the volume $4\pi r^2\,\dd r$ stays finite near the origin. So

$$\boxed{\;\int\frac{\nabla^2 f}{r}\,\dd^3x = -4\pi f(0) .\;} \label{eq:delta-rule}$$

**A number.** Take $f = e^{-r^2}$, with $r$ in metres, so that $f(0) = 1$. Its Laplacian is
$(4r^2 - 6)\,e^{-r^2}$, and the integral over shells is

$$4\pi\int_0^\infty(4r^3 - 6r)\,e^{-r^2}\,\dd r = 4\pi(2 - 3) = -4\pi ,$$

because $\int_0^\infty r^3e^{-r^2}\dd r = \int_0^\infty re^{-r^2}\dd r = \tfrac12$. If the Laplacian could be moved
from $f$ to $1/r$, the left side of [](#eq:delta-rule) would be $\int f\,\nabla^2(1/r)\,\dd^3x$, so the rule says that
$\nabla^2(1/r)$ acts on every $f$ as $-4\pi\delta^3$ does.

**Poisson's equation without crossing the infinity.** We now close the last section's step. We multiply
[](#eq:superposition) by $\nabla^2 f(\vect x)$, integrate over $\vect x$, and do the integral over $\vect x$ first. By
[](#eq:delta-rule), with the origin moved to $\vect y$, it is $\int\nabla^2 f\,\dd^3x/|\vect x - \vect y| =
-4\pi f(\vect y)$, and the factor $-1/4\pi$ of $\mathcal G$ cancels the $-4\pi$:

$$\begin{aligned}\int\field\Phi\,\nabla^2 f\,\dd^3x &= 4\pi G\int\matter\rho(\vect y)\,\Bigl(-\frac{1}{4\pi}\Bigr)\bigl(-4\pi f(\vect y)\bigr)\,\dd^3y\\ &= 4\pi G\int\matter\rho\,f\,\dd^3y .\end{aligned}$$

This holds for every body, smooth or not, and it is what Poisson's equation means where the density jumps.

Now let $f$ be zero except inside a small ball in which $\matter\rho$ is smooth. We assume that **$\field\Phi$ has
continuous second derivatives wherever $\matter\rho$ is smooth**. This is a separate fact, taken on trust; it is not
what we are proving, which is the value of $\nabla^2\field\Phi$. Green's second identity on the small ball, with
$u = \field\Phi$ and $v = f$, has no surface term, because $f$ and its gradient vanish on the ball's sphere. So
$\int\field\Phi\,\nabla^2 f\,\dd^3x = \int f\,\nabla^2\field\Phi\,\dd^3x$, and

$$\int\bigl(\nabla^2\field\Phi - 4\pi G\matter\rho\bigr)\,f\,\dd^3x = 0$$

for every such $f$. A continuous function with this property is zero, because a small bump $f$ placed where the
function is positive would give a positive integral. So $\nabla^2\field\Phi = 4\pi G\matter\rho$ wherever
$\matter\rho$ is smooth.

![The region $V$ of the proof, drawn in section: the shell between a small sphere of radius $\varepsilon$ round the
origin and a large sphere of radius $L$. On the small sphere each element $\dd\vect A$ points out of $V$, which there is
toward the origin. The two radii and the lengths of the arrows are chosen for the drawing.](tut-grn-hole){#fig:grn-hole}

## Along a long rod the Green's function is a logarithm

Some scenes do not change along one direction: a rail, a rod, or the line masses of the paper's Figure
[](/paper/#fig:nearfield). Their potential depends only on $x$ and $y$, and in this section $r = \sqrt{x^2 + y^2}$ is
the distance from the $z$ axis. We want the potential of a line that holds $\sym{line-density}{\matter\lambda}$
kilograms per metre.[^lambda]

Away from the axis, $\ln r$ is harmonic: $\partial_x^2\ln r = (y^2 - x^2)/r^4$ and $\partial_y^2\ln r = (x^2 -
y^2)/r^4$ add to zero. Its gradient, $\hat{\vect r}/r$, has the flux $(1/r) \times 2\pi r = 2\pi$ out of every circle
round the axis, whatever its radius. This is Gauss's law in two dimensions, and the argument of chapter 1.3 gives
$\nabla^2\ln r = 2\pi\,\delta^2(x, y)$, with $\delta^2(x, y) = \delta(x)\,\delta(y)$ in $\mathrm{m^{-2}}$. So the
Green's function in two dimensions is

$$\boxed{\;\sym{greens-function-2d}{\mathcal G_2} = \frac{1}{2\pi}\ln r ,\;}$$

a pure number once $r$ is measured in some unit; changing the unit adds a constant. The line has the density
$\matter\lambda\,\delta^2(x, y)$, so its potential is $4\pi G\matter\lambda\,\mathcal G_2$, that is

$$\field\Phi = 2G\matter\lambda\ln r + \text{a constant} .$$

Doubling $r$ adds $2G\matter\lambda\ln 2$ to the potential, so circles round the line whose radii double are equal steps
of potential apart (Figure [](#fig:grn-rail)). The pull toward the line has the size $2G\matter\lambda/r$. For a steel
rail of $60\unit{kg\,m^{-1}}$ at 1 m this is $8.0 \times 10^{-9}\unit{m\,s^{-2}}$, as
[chapter 1.3](/tutorial/newton/gauss-and-poisson/) found with a cylinder, and 1.7 times the pull of a 70 kg person at a
metre, $4.7 \times 10^{-9}\unit{m\,s^{-2}}$.

The logarithm grows without limit far from the line, so no constant makes this potential vanish far away. Only its
differences, its pull and its tide are fixed, and a camera reads tides, so nothing is lost. The paper's single row of
sensors over a two-dimensional scene sees a world of such lines. Its blur, the width of the picture of a point as an
angle seen from the row, is $3.79/q_c$ (beside the paper's equation [](/paper/#eq:resolution)), where $q_c$ is the pure
number of chapter 3.7 that measures how fine a detail still rises above the noise; that chapter computes the picture of
a point in [its step 5](/tutorial/noise/blur-law/#step-5-the-picture-of-a-point-is-the-pattern-of-a-round-opening).

![A rail seen end-on, with the circles on which its potential is constant at 0.25, 0.5, 1, 2 and 4 m from it. Each
circle is labelled by its potential less that of the 1 m circle, in units of $2G\matter\lambda$: the radii double from
one circle to the next, so the steps of potential are equal. The square in the middle is enlarged on the right, where
the rail's profile is drawn to scale; the arrows show the pull toward the rail, and their length is chosen for the
drawing.](tut-grn-rail){#fig:grn-rail}

## Inside an empty region, the values on its boundary write the potential

Chapter 2.1 proved that the values of a harmonic function on the boundary of a region
[fix it inside](/tutorial/outside/laplace/#the-values-on-a-closed-surface-fix-the-potential-inside). We want the
formula. We assume that **the region $V$ holds no matter**, so that $\field\Phi$ is harmonic there, and that
**$\field\Phi$ is smooth up to the boundary $\partial V$**. Let $\vect x$ be a point inside $V$.

We apply Green's second identity in the variable $\vect y$, with $u = \field\Phi(\vect y)$ and
$v = \mathcal G(\vect x, \vect y)$. By reciprocity $\nabla^2_y\mathcal G = \delta^3(\vect y - \vect x)$, and
$\nabla^2\field\Phi = 0$, so the volume side is $\field\Phi(\vect x)$:[^cut]

$$\boxed{\;\field\Phi(\vect x) = \oint_{\partial V}\bigl(\field\Phi\,\nabla_y\mathcal G - \mathcal G\,\nabla_y\field\Phi\bigr)\cdot\dd\vect A_y .\;} \label{eq:representation}$$

This is **Green's representation formula**. As a check, let $V$ be a ball of radius $R$ about $\vect x$. On its surface
$\mathcal G = -1/4\pi R$ is constant, and $\nabla_y\mathcal G$ points straight out with the size $1/4\pi R^2$. The
second term is then a constant times the flux of $\nabla\field\Phi$ out of the ball, which is zero because
$\nabla^2\field\Phi = 0$ inside. The first term is the average of $\field\Phi$ over the sphere, so
[](#eq:representation) becomes the
[mean value property](/tutorial/outside/laplace/#the-value-at-the-centre-of-a-sphere-is-the-average-over-the-sphere).

The formula asks for both the values of $\field\Phi$ and its slope along the normal. Uniqueness says that the values
alone suffice, so we remove the slope term. For each point $\vect x$ of $V$ we add to $\mathcal G$ a correction
$F(\vect x, \vect y)$ that is harmonic in $\vect y$ throughout $V$ and equals $-\mathcal G(\vect x, \vect y)$ for
every $\vect y$ on the boundary. The correction depends on $\vect x$, because it must cancel the potential of a source
at $\vect x$. The sum

$$\sym{dirichlet-greens-function}{\mathcal G_D}(\vect x, \vect y) = \mathcal G(\vect x, \vect y) + F(\vect x, \vect y)$$

is then zero for every $\vect y$ on $\partial V$.

Green's second identity with $u = \field\Phi$ and $v = F(\vect x, \vect y)$, both harmonic in $\vect y$, gives
$0 = \oint(\field\Phi\,\nabla_yF - F\,\nabla_y\field\Phi)\cdot\dd\vect A_y$. Added to [](#eq:representation), it turns
$\mathcal G$ into $\mathcal G_D$, and the slope term vanishes because $\mathcal G_D = 0$ on $\partial V$:

$$\boxed{\;\field\Phi(\vect x) = \oint_{\partial V}\field\Phi(\vect y)\;\hat{\vect\nu}\cdot\nabla_y\mathcal G_D(\vect x, \vect y)\;\dd A_y .\;} \label{eq:dirichlet}$$

Here $\hat{\vect\nu}$ is the outward unit normal of $\partial V$.[^nu] Finding a harmonic function from its values on a
boundary is the **Dirichlet problem**, and $\mathcal G_D$ is the **Dirichlet Green's function** of $V$. The weight
$\hat{\vect\nu}\cdot\nabla_y\mathcal G_D$, in $\mathrm{m^{-2}}$, is the **Poisson kernel** of $V$.

The Dirichlet Green's function keeps reciprocity. We apply Green's second identity with
$u = \mathcal G_D(\vect x_1, \vect y)$ and $v = \mathcal G_D(\vect x_2, \vect y)$, for two points $\vect x_1$ and
$\vect x_2$ of $V$. The volume side is $\mathcal G_D(\vect x_1, \vect x_2) - \mathcal G_D(\vect x_2, \vect x_1)$, and
the surface side is zero because both functions vanish on $\partial V$. For most regions $\mathcal G_D$ is as hard to
find as the answer, but for a plane and for a sphere a single image point gives it.

## Above a flat camera, a mirror image gives the potential at every height

We want the potential above a plane on which it is known, the plane being a camera's array, with all the sources
below it. We assume that **the half-space above the plane holds no matter** and that **the potential falls to zero far
away at least as fast as one over the distance**, as the potential of any body of finite size does. A point of the
half-space is $\vect x = (\vect a, z)$, where $\vect a$, in metres, is the position across the plane (the paper's
letter) and $z > 0$ is the height above it.

We place a unit source at $\vect x$ and a source of the opposite sign at its mirror image $\vect x^* = (\vect a, -z)$:

$$\mathcal G_D(\vect x, \vect y) = \mathcal G(\vect x, \vect y) - \mathcal G(\vect x^*, \vect y) .$$

Every point $\vect y$ of the plane is as far from $\vect x$ as from $\vect x^*$, so $\mathcal G_D = 0$ there. The image
lies below the plane, outside the region, so the second term is harmonic in the region: it is the correction $F$.
Placing sources outside a region to make a Green's function vanish on its boundary is the **method of images**.

The region is unbounded, so [](#eq:dirichlet) also has a term on a large half-sphere of radius $L$. On it
$\field\Phi$ falls at least as $1/L$ and the slope of $\mathcal G_D$ at least as $1/L^2$, while the area grows as
$2\pi L^2$. The term therefore falls at least as $1/L$, and it vanishes as $L$ grows.

We write $\vect y = (\vect a', \zeta)$ and differentiate the two inverse distances with respect to $\zeta$, at
$\zeta = 0$:

$$\begin{aligned}\partial_\zeta\frac{1}{|\vect x - \vect y|}\Big|_{\zeta=0} &= \frac{z}{(|\vect a - \vect a'|^2 + z^2)^{3/2}},\\ \partial_\zeta\frac{1}{|\vect x^* - \vect y|}\Big|_{\zeta=0} &= -\frac{z}{(|\vect a - \vect a'|^2 + z^2)^{3/2}} .\end{aligned}$$

The second has the opposite sign because $\vect x^*$ lies below the plane. With the factor $-1/4\pi$ of $\mathcal G$,
$\partial_\zeta\mathcal G_D = -2z/[4\pi(|\vect a - \vect a'|^2 + z^2)^{3/2}]$. The outward normal of the region points
down, $\hat{\vect\nu} = -\hat{\vect z}$, which changes the sign. With [](#eq:dirichlet):

$$\boxed{\;\begin{gathered}\field\Phi(\vect a, z) = \int\sym{half-space-kernel}{P_z}(\vect a - \vect a')\,\field\Phi(\vect a', 0)\,\dd^2a',\\ P_z(\vect a) = \frac{z}{2\pi\,(a^2 + z^2)^{3/2}} .\end{gathered}\;} \label{eq:half-space}$$

The kernel $P_z$, in $\mathrm{m^{-2}}$, is the Poisson kernel of the half-space.[^P] It is a bell centred under the
point, of height $1/2\pi z^2$ (Figure [](#fig:grn-mirror)). It falls to half that height where $(1 + a^2/z^2)^{-3/2} =
\tfrac12$, so its full width there is $2z\sqrt{2^{2/3} - 1} = 1.53z$. Its integral over the plane is 1, because in polar
coordinates $-1/\sqrt{a^2 + z^2}$ is an antiderivative of $a/(a^2 + z^2)^{3/2}$. As $z$ shrinks to zero the bell grows
narrow and tall with its area fixed, like chapter 1.3's narrow Gaussian, so [](#eq:half-space) returns the values on the
plane.

**A number.** A person of $70\unit{kg}$ stands 1 m below the plane, so that the potential on it is
$-G\matter m/\sqrt{a'^2 + 1}$, with lengths in metres. Put into [](#eq:half-space) at $\vect a = 0$, it gives

$$\field\Phi(0, z) = -\frac{G\matter m}{1 + z} ,$$

as the practice problem shows by hand. This is the person's own potential at the distance $1 + z$ metres. It must be,
because the person's potential is harmonic above the plane and falls to zero far away, and uniqueness allows only one
such function with these values on the plane. At $z = 0.5\unit{m}$ it is $-3.1 \times 10^{-9}\unit{J\,kg^{-1}}$, and
at $z = 0$ it returns the value on the plane.

Computing the potential farther from the sources in this way is called **upward continuation**, the geophysicists'
name. Each point at the height $z$ receives an average over a patch about $1.5z$ wide, so detail finer than $z$ is
averaged away. The reverse, **downward continuation**, computes the potential nearer the sources to sharpen the
picture. It must undo the averaging, which multiplies the noise, as chapter 2.1
[showed](/tutorial/outside/laplace/#a-harmonic-function-is-fixed-by-its-values-in-any-small-ball); the paper's
*How sharp* names it.

We state one more fact, which chapter 2.7 derives. A ripple $\cos(kx)$ on the plane, with crests $2\pi/k$ apart and
$k$ in $\mathrm{m^{-1}}$, continues to $\cos(kx)\,e^{-kz}$ at the height $z$.[^fourier] Both $\cos(kx)\,e^{\mp kz}$ are
harmonic, because $\partial_x^2$ brings down $-k^2$ and $\partial_z^2$ brings down $+k^2$, and both equal the ripple on
the plane. The ripple does not fall to zero far away along the plane, so here the condition that picks $e^{-kz}$ is
that **the potential stays bounded** above the plane, which $e^{+kz}$ does not. Crests 1 m apart fade by
$e^{-2\pi} = 0.0019$ in a metre of height. This fade of each ripple by its own factor is the paper's equation
[](/paper/#eq:evanescent).

The camera reads the tide, not the potential. Each derivative of a harmonic function is harmonic too, because
derivatives can be taken in any order, and it falls to zero far away. So the same kernel continues every component of
the [tidal tensor](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives)
$\curv{\tE}_{ij} = \partial_i\partial_j\field\Phi$, in $\mathrm{s^{-2}}$. Among them is the **array's reading**, the
vertical component with its sign changed so that a mass below gives a positive bump, which the paper writes
$\curv d = -\curv{\tE}_{zz}$.

![Left: a point $\vect x$ at the height $z$ above the plane and its mirror image $\vect x^*$ at the depth $z$ below it.
Every point $\vect y$ of the plane is as far from one as from the other, so $\mathcal G_D$ vanishes there. Right: the
kernel $P_z$ along a line of the plane through the point under $\vect x$, for $z = 0.5$ and $1\unit{m}$: doubling the
height divides the peak by four, from 0.64 to $0.16\unit{m^{-2}}$, and doubles the width at half height, from 0.77 to
1.53 m.](tut-grn-mirror){#fig:grn-mirror}

## On a sphere, Kelvin's image gives the potential inside and the skin of balayage

We want a harmonic function inside a ball from its values on the sphere, and then the paper's skin. We use the paper's
letters: $\vect s$ is a point inside the ball of radius $R$, at the distance $s$ from its centre, and $\vect x$ is a
point of the sphere. In [](#eq:dirichlet) the point inside was $\vect x$ and the point on the boundary was $\vect y$;
here $\vect s$ plays the part of $\vect x$, and $\vect x$ plays the part of $\vect y$. We assume that **$h$ is harmonic
in the ball and continuous up to the sphere**.

The point $\vect s^* = R^2\vect s/s^2$ lies on the same ray at the distance $R^2/s$, outside the ball. For
$|\vect x| = R$ we expand the square and use $|\vect x|^2 = R^2$:

$$\begin{aligned}|\vect x - \vect s^*|^2 &= R^2 - \frac{2R^2\,\vect x\cdot\vect s}{s^2} + \frac{R^4}{s^2}\\ &= \frac{R^2}{s^2}\bigl(s^2 - 2\,\vect x\cdot\vect s + R^2\bigr)\\ &= \frac{R^2}{s^2}\,|\vect x - \vect s|^2 .\end{aligned}$$

So every point of the sphere is $R/s$ times as far from $\vect s^*$ as from $\vect s$, and a source of weight $R/s$ at
$\vect s^*$ cancels the source at $\vect s$ there:

$$\mathcal G_D(\vect s, \vect x) = \mathcal G(\vect s, \vect x) - \frac{R}{s}\,\mathcal G(\vect s^*, \vect x)$$

vanishes for $|\vect x| = R$. The second term is the correction $F$, harmonic in the ball because $\vect s^*$ lies
outside it. The point $\vect s^*$ with the weight $R/s$ is called the **Kelvin image** of $\vect s$. For $s = R/2$ it
lies at $2R$ with the weight 2.

The outward normal of the sphere is $\hat{\vect\nu} = \vect x/R$, and $\nabla_x(1/|\vect x - \vect s|) = -(\vect x -
\vect s)/|\vect x - \vect s|^3$. For the source and for the image, using $|\vect x - \vect s^*| = (R/s)|\vect x -
\vect s|$ and $\vect x\cdot\vect s^* = R^2\,\vect x\cdot\vect s/s^2$,

$$\begin{aligned}\hat{\vect\nu}\cdot\nabla_x\frac{1}{|\vect x - \vect s|} &= -\frac{R^2 - \vect x\cdot\vect s}{R\,|\vect x - \vect s|^3},\\ \hat{\vect\nu}\cdot\nabla_x\frac{R/s}{|\vect x - \vect s^*|} &= -\frac{s^2 - \vect x\cdot\vect s}{R\,|\vect x - \vect s|^3} .\end{aligned}$$

We subtract the second from the first. The terms in $\vect x\cdot\vect s$ cancel and leave
$-(R^2 - s^2)/R\,|\vect x - \vect s|^3$, which the factor $-1/4\pi$ of $\mathcal G$ turns into the Poisson kernel of the
ball. With [](#eq:dirichlet),

$$\boxed{\;\begin{gathered}h(\vect s) = \oint_{|\vect x| = R}\sym{ball-kernel}{P}(\vect x, \vect s)\,h(\vect x)\,\dd A,\\ P(\vect x, \vect s) = \frac{R^2 - s^2}{4\pi R\,|\vect x - \vect s|^3} .\end{gathered}\;} \label{eq:ball}$$

The kernel is in $\mathrm{m^{-2}}$. The function $h = 1$ is harmonic, so [](#eq:ball) says that the kernel's integral
over the sphere is 1. At the centre, $s = 0$, the kernel is $1/4\pi R^2$ everywhere on the sphere, and [](#eq:ball) is
the mean value property again.

**The balayage.** Let $\vect X$ be a point outside the ball. The function $h(\vect x) = 1/|\vect X - \vect x|$ is
harmonic inside the ball and on it, because its one infinite point lies outside. Equation [](#eq:ball) at $\vect s$,
multiplied by $-G\matter m$, gives

$$-\frac{G\matter m}{|\vect X - \vect s|} = -G\oint\frac{\matter m\,P(\vect x, \vect s)}{|\vect X - \vect x|}\,\dd A .$$

The left side is the potential at $\vect X$ of a point mass $\matter m$ at $\vect s$. The right side is the potential at
$\vect X$ of a skin on the sphere whose surface density, in kilograms per square metre, is
$\matter\sigma = \matter m\,P(\vect x, \vect s)$. So the skin pulls at every point outside the ball exactly as the
point mass does, and its mass is $\matter m$, because $P$ integrates to 1. Replacing a mass inside a region by a skin
on its boundary with the same field outside is **balayage**. This skin is the paper's formula,
$\matter m(R^2 - s^2)/4\pi R\,|\vect x - \vect s|^3$.

**Numbers.** For the nugget at $s = R/2$, the point of the sphere over it is $R/2$ away, and there the skin has the
surface density $6\,\matter m/4\pi R^2$, six times the nugget's mass spread evenly, as the caption below says. The
opposite point is $3R/2$ away, where the skin has $0.22\,\matter m/4\pi R^2$ (Figure [](#fig:grn-kelvin)). With $t =
s/R$, the factor over the nugget is $(1 + t)/(1 - t)^2$, and at $t = 0.9$ it is 190. At $\vect X = (2R, 0, R)$, with the
nugget on the $z$ axis, a numerical integral over the sphere gives the skin's potential as $-0.485071\,G\matter m/R$,
the nugget's own value to $10^{-14}$.

{{paper fig:same-outside}}

Panel (c) is this skin. Chapter 2.5 uses it as the third of the three bodies that a camera outside cannot tell apart.

::: try {#image-charge}
Predict first: move the nugget halfway to the wall, then to 0.9 of the way. How much thicker does the skin grow over
it? The figure opens on the skin of a nugget at half the radius, shaded in steps that double, with the nugget's
equipotentials outside drawn solid and the skin's own dashed: they lie on each other. Move the point $\mathbf X$ and
compare the two potentials. Then predict where the nugget must be for the skin to be uniform, and check. In *Image*
mode, drag the source in the ball or above the plane and watch its image move, and the line where the two potentials
cancel fall on the boundary.
:::

![A ball of radius $R$ cut through its centre, with a nugget at $\vect s$, halfway from the centre to the sphere, and
its Kelvin image $\vect s^*$ at $2R$ from the centre, of weight 2: every point $\vect x$ of the sphere is twice as far
from $\vect s^*$ as from $\vect s$. The band along the inside of the sphere is the skin of balayage, shaded in steps
that double in surface density, from $6\,\matter m/4\pi R^2$ over the nugget to $0.22\,\matter m/4\pi R^2$ opposite. The
band's width, the nugget's size and the place of $\vect x$ are chosen for the drawing.](tut-grn-kelvin){#fig:grn-kelvin}

::: derivation
### Harmonic functions are analytic

Chapter 2.1 [stated](/tutorial/outside/laplace/#a-harmonic-function-is-fixed-by-its-values-in-any-small-ball) without
proof that a harmonic function equals the sum of its Taylor series round every point. Equation [](#eq:ball) gives a
sketch. Let $\gamma$ be the angle between $\vect x$ and $\vect s$, $\mu = \cos\gamma$ and $t = s/R$. Then
$|\vect x - \vect s|^2 = R^2(1 - 2t\mu + t^2)$, and the kernel is

$$P = \frac{1 - t^2}{4\pi R^2\,(1 - 2t\mu + t^2)^{3/2}} .$$

We want the kernel as a series in powers of $t$. Chapter 2.2's
[generating function](/tutorial/outside/spherical-harmonics/#the-patterns-symmetric-about-an-axis-are-the-legendre-polynomials-and-the-inverse-distance-generates-them)
gives one for $(1 - 2t\mu + t^2)^{-1/2} = \sum_\ell t^\ell P_\ell(\mu)$, with $P_\ell$ the Legendre polynomial of degree
$\ell$. Its derivative with respect to $t$, $(\mu - t)(1 - 2t\mu + t^2)^{-3/2}$, has the kernel's power $3/2$. The
generating function plus $2t$ times this derivative has the kernel's numerator, and on the series the same operation
multiplies $t^\ell$ by $2\ell + 1$:

$$\begin{aligned}\frac{(1 - 2t\mu + t^2) + 2t(\mu - t)}{(1 - 2t\mu + t^2)^{3/2}} &= \frac{1 - t^2}{(1 - 2t\mu + t^2)^{3/2}}\\ &= \sum_{\ell=0}^\infty(2\ell + 1)\,t^\ell P_\ell(\mu) .\end{aligned}$$

Chapter 2.2 showed that $s^\ell P_\ell(\cos\gamma)$ is a polynomial of degree $\ell$ in the components of $\vect s$. So
[](#eq:ball) writes $h(\vect s)$ as a sum of polynomials of rising degree. Chapter 2.3
[proves](/tutorial/outside/multipoles/#each-degree-has-a-ceiling-lower-than-the-last-by-the-size-over-the-distance)
that $|P_\ell(\mu)| \le 1$, so the term of degree $\ell$ is no larger than $(2\ell + 1)\,t^\ell$ times the
largest $|h|$ on the sphere, and the sum converges for every $s < R$. Every point where $h$ is harmonic is the centre
of such a ball, so round every such point $h$ is a convergent sum of polynomials.
:::

::: gap
The sketch does not show that the polynomials may be regrouped into one power series in the components of
$\vect s$, which is what "analytic" asks; we take that step on trust.
:::

## Where Green's functions go next

The field of one point, added up over all the sources, returns three times in the paper. The wave equation has a
**retarded Green's function**, which delivers the field of each piece of a source late by the time light takes to cross
the distance; chapter [5.2](/tutorial/waves/retarded-waves/#a-source-sends-its-news-outward-at-the-speed-of-the-wave)
derives it for the paper's equation [](/paper/#eq:wave-zone). The transform of the paper's equation
[](/paper/#eq:scene-transform) weighs the scene against the continued ripples of [the flat
camera](#above-a-flat-camera-a-mirror-image-gives-the-potential-at-every-height), written $e^{i\vect k\cdot\vect a -
|\vect k|z}$, where $\vect k$ is a vector in the camera's plane that points across the crests and has the length $k$
(chapter 13.2). The paper's equation [](/paper/#eq:abel), an Abel transform, adds up a round planet's glow along
straight chords, with a weight fixed by geometry; chapter
[5.6](/tutorial/waves/abel-transform/#the-transform-can-be-undone) inverts it.

::: check
### Q

Why must the potential of a body be $-G\int\matter\rho/|\vect x - \vect y|\,\dd^3y$, and not that plus a constant?

### A

Both satisfy Poisson's equation, but only the first falls to zero far away, and uniqueness allows one solution with
that condition. A constant changes no pull and no tide, so the condition is a convention, the one the paper makes.

### Q

Where is the Kelvin image of a point at 0.8 of the radius, and what is its weight?

### A

At $R^2/0.8R = 1.25R$ on the same ray, with the weight $R/s = 1.25$.
:::

**The idea to keep: because Poisson's equation is linear, the potential of one point builds every potential. Inside an
empty region a potential is a weighted average of its values on the boundary; the weights, the Poisson kernel, carry a
plane's values up to any height above it and sweep a mass inside a sphere onto its surface.**

::: problems
### Practice

Show that the half-space kernel continues the person's potential on the plane, $-G\matter m/\sqrt{a'^2 + 1}$ with
lengths in metres, to $-G\matter m/(1 + z)$ at the height $z$ over the person. Use polar coordinates on the plane and
the substitution $w = a'^2$.

::: solution
In polar coordinates $\dd^2a' = 2\pi a'\,\dd a'$, and $a'\,\dd a' = \tfrac12\dd w$, so

$$\field\Phi(0, z) = -\frac{G\matter m\,z}{2}\int_0^\infty\frac{\dd w}{(w + z^2)^{3/2}\,(w + 1)^{1/2}} .$$

The function $\sqrt{w + 1}/\sqrt{w + z^2}$ has the derivative $(z^2 - 1)/[2(w + 1)^{1/2}(w + z^2)^{3/2}]$, and it goes
from $1/z$ at $w = 0$ to 1 far away. So the integral is $2(1 - 1/z)/(z^2 - 1) = 2/[z(1 + z)]$, and
$\field\Phi(0, z) = -G\matter m/(1 + z)$. At $z = 1$ the antiderivative has the form $0/0$, but the answer is
continuous there.
:::

### Stretch

Show that the skin of balayage has its centre of mass at the nugget: $\oint\matter m\,P(\vect x, \vect s)\,\vect x\,\dd
A = \matter m\,\vect s$. Do it once with the Legendre series of the ball's kernel and the
[orthogonality](/tutorial/outside/spherical-harmonics/#patterns-of-different-degree-are-orthogonal-and-every-pattern-is-a-sum-of-them)
of chapter 2.2, and once in a single line from [](#eq:ball).

::: solution
Put the $z$ axis along $\vect s$. By symmetry only the $z$ component survives, with $x_z = R\mu$, and after the integral
round the axis $\dd A = 2\pi R^2\,\dd\mu$. With the series,

$$\begin{aligned}
\oint P\,x_z\,\dd A &= \frac{R}{4\pi R^2}\sum_\ell(2\ell + 1)\,t^\ell\\
&\qquad\times 2\pi R^2\int_{-1}^1P_\ell(\mu)\,\mu\,\dd\mu\\
&= \frac R2 \times 3t \times \frac23 = Rt = s ,
\end{aligned}$$

because $\mu = P_1(\mu)$, so only $\ell = 1$ survives, with $\int_{-1}^1P_1^2\,\dd\mu = \tfrac23$. In one line: each
component of $\vect x$ is harmonic, so by [](#eq:ball) its integral against $P$ is its value at $\vect s$.
:::

### The paper

The paper's *What breaks the tie* gives the gold's shares of the moment of inertia, about an axis through the centre
perpendicular to the line from the centre to the nugget, as $0.25$ and $0.75\,\matter mR^2$ for the nugget and the
skin, at $s = R/2$. Derive both. For the skin, write $x^2 = (x^2 - r^2/3) + r^2/3$, with $x$ along the axis of
rotation, and use [](#eq:ball) on the harmonic part.

::: solution
Put the nugget on the $z$ axis and the axis of rotation along $x$. The moment of inertia is $\int\matter\rho\,(y^2 +
z^2)\,\dd V = \int\matter\rho\,(r^2 - x^2)\,\dd V$. For the nugget, $r^2 - x^2 = s^2$, so it is
$\matter ms^2 = 0.25\,\matter mR^2$. On the skin $r^2 = R^2$ and the mass is $\matter m$, so the first part is
$\matter mR^2$. The function $x^2 - r^2/3$ has the Laplacian $2 - 2 = 0$, so by [](#eq:ball) its integral against
$\matter mP$ is $\matter m$ times its value at the nugget, $0 - s^2/3$; the constant $R^2/3$ adds $\matter mR^2/3$. So
$\oint\matter mP\,x^2\,\dd A = \matter m(R^2 - s^2)/3$, and the moment of inertia is
$\matter mR^2 - \matter m(R^2 - s^2)/3 = \matter m(\tfrac23R^2 + \tfrac13s^2) = 0.75\,\matter mR^2$.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), *What the image does show*: the skin of Figure [](/paper/#fig:same-outside)(c)
  is the ball's Poisson kernel times the nugget's mass.
- *What the image cannot show*: adding $\nabla^2\field\psi/4\pi G$ "changes the potential by $\psi$", which is
  [](#eq:superposition) with uniqueness; chapter 2.5 builds on it and on the paper's equation [](/paper/#eq:split).
- *How sharp*: the fade of the paper's equation [](/paper/#eq:evanescent) is the half-space kernel acting on a ripple;
  the row of the paper's equation [](/paper/#eq:resolution) and Figure [](/paper/#fig:nearfield) use line masses;
  downward continuation is named.
- [Section XIII](/paper/#sec:second-order), equation [](/paper/#eq:scene-transform): the harmonic functions that decay
  into the scene.
- [Section V](/paper/#sec:waves), equation [](/paper/#eq:wave-zone): the retarded Green's function, in Part 5; and
  [Section IX](/paper/#sec:first-image), equation [](/paper/#eq:abel), in chapter [5.6](/tutorial/waves/abel-transform/).
:::

::: deeper
- The GR course's lesson
  [From an initial ripple to a retarded field](https://neovand.github.io/general-relativity/chapter-18.html#waves-modes-and-green-functions)
  builds a Green's function for the wave equation, and
  [section 18.5](https://neovand.github.io/general-relativity/chapter-18.html#18-5-retarded-solutions-the-field-receives-yesterday-s-news)
  uses it for gravitational waves.
- John David Jackson, *Classical Electrodynamics* (Wiley, 3rd edition, 1999), sections 1.8 to 1.10 (Green's theorem,
  uniqueness, and the formal solution with Dirichlet Green's functions) and 2.1 to 2.2 (images, and a point charge
  and a sphere).
- Richard J. Blakely, *Potential Theory in Gravity and Magnetic Applications* (Cambridge, 1995), chapters 2 and 12:
  Green's functions and the half-space kernel as geophysicists use them for upward continuation.
:::

::: history
### Thomson's images and Poincaré's sweeping

William Thomson, later Lord Kelvin, introduced the method of images in the 1840s, for the charge that a point charge
draws onto a conducting sphere or plane. Henri Poincaré announced the *méthode du balayage* in 1887, in the *Comptes
rendus* (volume 104), and set it out in 1890, in the *American Journal of Mathematics* (volume 12). He solved the
Dirichlet problem for regions whose boundary is smooth enough, with a tangent plane and curvatures at each point. He
swept the mass out of one ball after another onto that ball's sphere, each sweep being this chapter's ball kernel, again
and again until the mass lay on the boundary.
:::

[^script]: We write the Green's function as a script $\mathcal G$, because the plain $G$ is Newton's constant,
    $6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$. The unit $\mathrm{m^{-1}}$ follows because the Laplacian
    divides by a square metre and the delta function is in $\mathrm{m^{-3}}$.

[^eps]: Here $\varepsilon$ is a small radius, in metres. In the paper $\epsilon$ is the strength of an impulsive tide
    and the small factor in the densities $\rho_0 \pm \epsilon\,\delta\rho$ of *What the image cannot show*; it is
    also an accuracy, and $\varepsilon_{ijk}$ is the Levi-Civita symbol. None of these appears here.

[^lambda]: In other chapters $\lambda$ is a wavelength; here it is a mass per unit length, in the colour of matter.

[^cut]: The delta function stands here for the step of the last section: cutting a small ball round $\vect x$ out of
    $V$ and letting it shrink gives the same result.

[^nu]: We write $\hat{\vect\nu}$ for the outward normal because the paper's $\hat{\vect n}$ is the direction from a
    pixel to a source.

[^P]: The letter $P$ is also the Legendre polynomial $P_\ell$ of chapter 2.2 and the projector $P_{ij}$ of chapter
    1.1. The kernels carry a subscript $z$ or two arguments, and a Legendre polynomial always carries its degree.

[^fourier]: In the language of chapter 2.6, the Fourier transform of $P_z$ across the plane is $e^{-|\vect k|z}$.
