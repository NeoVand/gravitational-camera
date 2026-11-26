---
id: '13.2'
title: "Reading an interior: Calderón's argument; the two readings as one transform"
question: 'How can readings made from outside, each of which weighs the density against a smooth harmonic function, add up to every ripple of the density, how would a flat camera arrange such readings, and what does fine detail still cost?'
part: '13'
requires: ['1.5b', '1.7', '2.1', '2.3', '2.4', '2.5', '2.6', '2.7', '3.7', '3.8', '13.1']
paper: [sec:second-order, eq:hair-commutator, eq:calderon, eq:scene-transform, eq:cone, fig:two-readings, eq:hair-bits]
figures: [fig:same-outside, fig:two-readings, fig:hair]
live: [two-readings]
depth: A
---

Three steel balls are drawn in Figure [](/paper/#fig:same-outside). One holds a gold nugget halfway to its wall, one
holds a flush of extra density on the near wall, and one carries a thin skin of mass on its surface. Their fields
are identical everywhere outside, at every instant, so no camera can tell them apart by their steady pull (section
[2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)).
They are told apart as soon as they are warm or a tide is applied.[^first]

{{paper fig:same-outside}}

How can readings made from outside, each of which weighs the density against a smooth harmonic function, add up to
every ripple of the density, how would a flat camera arrange such readings, and what does fine detail still cost? The
answer is Calderón's argument.

::: plain
At any one moment, a camera outside a body reads only certain averages of its mass, each weighted by a smooth pattern
that the steady field can carry outward. Masses arranged differently can share all these averages, as the three balls
do.

After a known tide has given the body a brief kick, a second reading holds a new kind of average. Its weight is the
product of two such patterns, and products are not limited in the same way. Two patterns that grow exponentially in
opposite directions multiply into a pure ripple. Knowing the strength of every ripple of the density is the same as
knowing the density, so the second reading tells the three balls apart.

A flat camera above a scene reads ripples across its plane that fade with depth: one reading gives one rate of fading
for each ripple, and two readings give every faster rate as well.

Fine detail stays expensive. The patterns that make a fine ripple are huge at one side of the body and tiny at the
other, so the precision needed grows exponentially with the fineness, and the resolution grows only as the logarithm of
the sensitivity.
:::

## Readings at two times hold an integral that no reading at one time holds

Here $\sym{density}{\matter\rho}$ is the density, in kilograms per cubic metre, and
$\sym{mass-moment}{\matter{Q_h}} = \int\matter\rho\,h\,\dd V$ is its moment against a profile $h$, a dimensionless
function of position (section 1.7). A **reading at one time** is what a camera outside records of a body's field at one
instant. It holds $\matter{Q_h}$ only for profiles $h$ that are harmonic in the body, and densities with none of these
moments are invisible to it (section 2.5). A **reading at two times** reads a moment again after a known tide has acted,
or reads how the moments of a body at a known temperature change from one instant to the next.

Section 1.7 found what such readings hold. The bracket of a moment with the rate of change $\matter{\dot Q_g}$ of
another is

$$\{\matter{Q_h}, \matter{\dot Q_g}\} = \int\matter\rho\,\nabla h\cdot\nabla g\,\dd V ,$$

in $\mathrm{kg\,m^{-2}}$, and section 13.1 found the same integral, with $g = h$, as the even part of two weighings.
Its quantum form is a commutator.[^four] It holds for matter whose forces do not depend on velocity, which we assume
throughout.

For harmonic $h$ and $g$ this integral is therefore known. It is the moment of the density against $\nabla h\cdot\nabla
g$, which is in general not harmonic
([2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic)). If the products
$\nabla h\cdot\nabla g$, over all pairs of harmonic profiles, build every function, then these numbers fix
$\matter\rho$.

## Two harmonic exponentials multiply into any ripple

We want two harmonic functions whose gradients multiply into a ripple $e^{i\vect\xi\cdot\vect x}$, because the
integral of the last section is then the density's Fourier transform. Here $\vect\xi$ is a real wavevector in
$\mathrm{m^{-1}}$, so the ripple's crests are $2\pi/|\vect\xi|$ apart (section 2.6).

The tool is section 2.1's stretch problem. For a vector $\vect\zeta$ with complex components, in $\mathrm{m^{-1}}$, each
derivative $\partial_j$ of $e^{\vect\zeta\cdot\vect x}$ brings down the factor $\zeta_j$, so

$$\nabla^2e^{\vect\zeta\cdot\vect x} = (\vect\zeta\cdot\vect\zeta)\,e^{\vect\zeta\cdot\vect x} .$$

The exponential is harmonic exactly when $\vect\zeta\cdot\vect\zeta = 0$, with the dot product taken without a complex
conjugate. A complex vector whose square vanishes in this sense is a **null vector**
([1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero)). We call
$e^{\vect\zeta\cdot\vect x}$ with $\vect\zeta$ null a **harmonic exponential**.

We assume that **$\vect\xi$ is any real wavevector** and that **$\vect\eta$ is a second real vector, in
$\mathrm{m^{-1}}$, at right angles to $\vect\xi$ and as long**. The pair is[^letters]

$$\sym{calderon-vectors}{\vect\zeta_\pm} = \tfrac12\,(i\vect\xi \pm \vect\eta), \qquad h_\pm = e^{\vect\zeta_\pm\cdot\vect x} .$$

We square each, using $\vect\xi\cdot\vect\eta = 0$ and $|\vect\eta| = |\vect\xi|$:

$$\vect\zeta_\pm\cdot\vect\zeta_\pm = \tfrac14\bigl(-|\vect\xi|^2 + |\vect\eta|^2 \pm 2i\,\vect\xi\cdot\vect\eta\bigr) = 0 ,$$

so both $h_\pm$ are harmonic. The gradient of $h_\pm$ is $\vect\zeta_\pm h_\pm$, so the product of the gradients is

$$\nabla h_+\cdot\nabla h_- = (\vect\zeta_+\cdot\vect\zeta_-)\,e^{(\vect\zeta_+ + \vect\zeta_-)\cdot\vect x} .$$

We multiply out $(i\vect\xi + \vect\eta)\cdot(i\vect\xi - \vect\eta)$, in which the two cross terms cancel, and add the
vectors, in which $\vect\eta$ cancels:

$$\vect\zeta_+\cdot\vect\zeta_- = \tfrac14\bigl(-|\vect\xi|^2 - |\vect\eta|^2\bigr) = -\tfrac12|\vect\xi|^2 , \qquad \vect\zeta_+ + \vect\zeta_- = i\vect\xi .$$

We multiply by $\matter\rho$ and integrate over the body:

$$\boxed{\;\int\matter\rho\,\nabla h_+\cdot\nabla h_-\,\dd V = -\tfrac12|\vect\xi|^2\int\matter\rho\,e^{i\vect\xi\cdot\vect x}\,\dd V ,\;}$$

The data at two times, given a known push, are therefore the Fourier transform of the density.[^push] Both sides are in $\mathrm{kg\,m^{-2}}$: the density in $\mathrm{kg\,m^{-3}}$, each gradient in $\mathrm{m^{-1}}$ and
the volume in $\mathrm m^3$. The exponent has a plus sign, so for a real density the right side is the complex conjugate of the transform of
section 2.6, with the same modulus.

For a check, put $\vect\eta = 0$. Then $\vect\zeta\cdot\vect\zeta = -|\vect\xi|^2/4$ is not zero, so
$e^{i\vect\xi\cdot\vect x/2}$ is not harmonic. The real parts $\pm\vect\eta/2$ make the exponentials harmonic, and
because of them $h_+$ grows along $\vect\eta$ and $h_-$ along $-\vect\eta$. For a number,
take $\vect\xi = (2, 1, -0.5)\unit{m^{-1}}$. Then $|\vect\xi|^2 = 5.25\unit{m^{-2}}$ and
$\vect\zeta_+\cdot\vect\zeta_- = -2.625\unit{m^{-2}}$, which is $-\tfrac12|\vect\xi|^2$.

So a ripple that is not harmonic is the product of two exponentials that are (Figure [](#fig:calderon-pair)).

![Look first at the two grey ramps: one harmonic exponential grows along $\vect\eta$ and the other along
$-\vect\eta$, so their product has no growth at all. What is left is the ripple whose crests cross the disc, at right
angles to $\vect\xi$. The size of the body and the length of $\vect\xi$ are chosen for the
drawing.](tut-calderon-pair){#fig:calderon-pair}

## Sixteen weighings give one ripple

We want the number of weighings that one ripple needs. A tide's profile is real, because masses outside make it, and
$h_\pm$ are complex. So we write $h_\pm = u_\pm + iv_\pm$, with $u_\pm$ and $v_\pm$ real and dimensionless. The
Laplacian has real coefficients, so the real and imaginary parts of $\nabla^2h_\pm = 0$ vanish separately, and $u_\pm$
and $v_\pm$ are harmonic. We expand the product:

$$\nabla h_+\cdot\nabla h_- = \bigl(\nabla u_+\cdot\nabla u_- - \nabla v_+\cdot\nabla v_-\bigr) + i\,\bigl(\nabla u_+\cdot\nabla v_- + \nabla v_+\cdot\nabla u_-\bigr) .$$

One complex component therefore needs four real integrals of the form $\int\matter\rho\,\nabla a\cdot\nabla b\,\dd V$,
with $a$ and $b$ real harmonic profiles.

Each comes from squares. We expand $|\nabla(a \pm b)|^2 = |\nabla a|^2 \pm 2\,\nabla a\cdot\nabla b + |\nabla b|^2$ and
subtract the two signs:

$$\int\matter\rho\,\nabla a\cdot\nabla b\,\dd V = \tfrac14\bigl[A(a + b) - A(a - b)\bigr], \qquad A(f) = \int\matter\rho\,|\nabla f|^2\,\dd V .$$

This is the **polarization identity**: a product found from two squares. For a dimensionless profile $f$, $A(f)$ is in
$\mathrm{kg\,m^{-2}}$.

Section 13.1 measured each square. Two copies of the body, prepared alike and given impulsive tides of profile $f$ and
strengths $+\epsilon$ and $-\epsilon$, gain the energies $E_+$ and $E_-$, and their even part is
$\tfrac12(E_+ + E_-) = \tfrac12\epsilon^2A(f)$. So

$$A(f) = \frac{E_+ + E_-}{\epsilon^2} .$$

The odd parts $\pm\epsilon\matter{\dot Q_f}$ cancel in the sum, so the body may be moving. Four real integrals, two
squares for each and two copies for each square give

$$\boxed{\;4 \times 2 \times 2 = 16\ \text{weighings for one complex Fourier component,}\;}$$

sixteen weighings for each Fourier component of the density. The component is complex, so the sixteen
give both the cosine and the sine ripple of one wavevector. For a check, take one real profile, $a = b = h$: the integral is $A(h)$ itself, and
two weighings suffice, as in section 13.1.

So every ripple of the density is a finite recipe of pushes and weighings (Figure [](#fig:sixteen-weighings)).

![Look first at the counts under the columns: one complex ripple of the density needs four real integrals, each found
from two squares by the polarization identity, and each square from two copies kicked both ways. The balances stand for
weighings.](tut-sixteen-weighings){#fig:sixteen-weighings}

## This is Calderón's problem made linear, and in Newton's gravity the linear form is exact

**Electrical impedance tomography** finds what lies inside a body from currents and voltages at its surface. It seeks
the **conductivity** $\sigma(\vect x)$, in siemens per metre, which says how easily current flows at each
point.[^sigma] With a pattern of voltages held on the surface, the potential $u$ inside obeys
$\nabla\cdot(\sigma\nabla u) = 0$. Then $\nabla\cdot(v\sigma\nabla u) = \sigma\nabla u\cdot\nabla v$ for the potential $v$
of a second pattern, so the divergence theorem turns $\int\sigma\,\nabla u\cdot\nabla v\,\dd V$ into
$\oint v\,\sigma\nabla u\cdot\dd\vect A$, the voltages of one pattern times the currents of the other. The measurements
therefore give these integrals.

Let the body be nearly uniform, $\sigma = \sigma_0 + \delta\sigma$, with $\sigma_0$ a constant and $\delta\sigma$ small.
The potentials change at first order in $\delta\sigma$, but the change adds nothing to the data at first order. It
vanishes on the surface, so Green's first identity (section 2.1) moves its gradient onto the uniform body's potentials,
whose Laplacian is zero. The data change by $\int\delta\sigma\,\nabla u\cdot\nabla v\,\dd V$, with $u$ and $v$ the
harmonic potentials of the uniform body. Keeping only the first order of a small change is linearizing
([7.4](/tutorial/geometry/linearized-gravity/#a-weak-field-is-a-small-table-laid-on-flat-spacetime)). The result is our
integral, with $\delta\sigma$ in place of $\matter\rho$. Calderón proved in 1980 that this linearized map loses nothing
[@Calderon1980], by the argument of the last two sections and with the same pair $h_\pm$.

In gravity nothing is dropped, whereas the currents of a conductor are bent by the very conductivity they measure. A tide is
made by masses outside, and the kick $\epsilon\matter m\nabla g$ that it gives a part of mass $\matter m$ does not
depend on where the other parts are. So the energy of an impulsive tide (section 13.1) and the bracket above hold exactly in Newton's
mechanics, so in Newton's theory the linear form is exact.

::: history
### Calderón and the oil fields

Calderón published his paper in 1980, in the proceedings of a seminar in Rio de Janeiro. G. Uhlmann's review records
that oil prospecting led him to the problem in the 1940s, when he was an engineer for Argentina's state oil company.
:::

::: history
### Isozaki and hyperbolic space

Below a flat camera the lifted potential $z^{1/2}\field\Phi$, with $z$ the depth, obeys $(\nabla^2_H + \tfrac34)\,u = 0$,
where $\nabla^2_H$ is the Laplacian of hyperbolic space and the camera's plane is that space's boundary at infinity
(section [3.9](/tutorial/noise/positivity/#the-space-below-a-flat-camera-is-hyperbolic)). H. Isozaki made the same
substitution the first step of a method for Calderón's problem [@Isozaki2004]. In hyperbolic space the data on the
boundary become data at infinity, and the methods of scattering theory on hyperbolic manifolds then rebuild what lies
inside.
:::

## The null space belongs to one reading, not to gravity

The nugget and its flush differ by a density $\nabla^2\field\psi/4\pi G$, where $\sym{null-potential}{\field\psi}$ is
a potential, in joules per kilogram, that vanishes with its gradient outside the ball (section 2.5). At one time the two
balls give the same data, because every harmonic moment of $\nabla^2\field\psi/4\pi G$ is zero. At two times 
Calderón's equation gives $-\tfrac12|\vect\xi|^2$ times the transform of the difference.

We apply Green's second identity (section 2.1) over a region a little larger than the ball, to $e^{i\vect\xi\cdot\vect
x}$ and $\field\psi$. The terms on its surface vanish, because $\field\psi$ and its gradient vanish there, so the
Laplacian moves across:

$$\int e^{i\vect\xi\cdot\vect x}\,\nabla^2\field\psi\,\dd V = \int\field\psi\,\nabla^2e^{i\vect\xi\cdot\vect x}\,\dd V = -|\vect\xi|^2\,\tilde\psi(\vect\xi) ,$$

with $\tilde\psi(\vect\xi) = \int\field\psi\,e^{i\vect\xi\cdot\vect x}\,\dd V$, with the plus sign of the exponent. Dividing by
$4\pi G$,

$$\boxed{\;\int\frac{\nabla^2\field\psi}{4\pi G}\,e^{i\vect\xi\cdot\vect x}\,\dd V = -\frac{|\vect\xi|^2\,\tilde\psi(\vect\xi)}{4\pi G} ,\;}$$

in kilograms. This vanishes at every $\vect\xi \ne 0$ only if $\tilde\psi$ does, and then $\field\psi = 0$ by the
inverse transform. So the second reading sees every density that the first misses. For a check, at $\vect\xi = 0$ the transform
vanishes: the null density has no mass, as it must.

The null space is therefore a property of a reading at one time, not of gravity. The three balls of the opening are
told apart by the second reading.[^rungs]

## A flat camera reads the transform on a cone at one time and inside it at two

Let the camera lie in the plane $z = 0$ and the scene beneath it, at depths $z > 0$ in metres, as in sections 2.4 and
2.7. Here $\vect a$ is the position across the camera, in metres, and $\sym{wavevector}{\vect k}$ is a wavevector in its
plane, in $\mathrm{m^{-1}}$. Section 2.4's harmonic functions that fade into the scene are

$$h_{\vect k} = e^{i\vect k\cdot\vect a - |\vect k|z} ,$$

harmonic because the second derivatives across bring $-|\vect k|^2$ and the one in depth brings $+|\vect k|^2$. Their
real and imaginary parts are real tides, as for $h_\pm$.

We write the scene's transform as

$$\matter{\tilde\rho}(\vect K, \kappa) = \int\matter\rho(\vect a, z)\,e^{i\vect K\cdot\vect a - \kappa z}\,\dd^2a\,\dd z .$$

Here $\vect K$ is a wavevector across the plane and $\sym{decay-rate}{\kappa}$ a rate of decay with depth, both in
$\mathrm{m^{-1}}$, and $\sym{scene-transform}{\matter{\tilde\rho}}(\vect K, \kappa)$ is in kilograms. We call it the
**scene transform**. Across the plane it is a Fourier transform, with a plus sign. In depth it weights the
density by the falling exponential $e^{-\kappa z}$ instead of a ripple, and such a weighting is a **Laplace transform**.
The camera's functions $h_{\vect k}$, and their products, are exactly of this form. For an example, a point mass $\matter m$ at the place $\vect a_0$ and depth $z_0$ has
$\matter{\tilde\rho} = \matter m\,e^{i\vect K\cdot\vect a_0 - \kappa z_0}$. For a non-example, $e^{i\vect k\cdot\vect a
+ |\vect k|z}$ is harmonic too, but it grows into the scene and is made by masses below it, not by a tide from above.

The first reading is the moment of $h_{\vect k}$, which is the transform at $\kappa = |\vect k|$ by definition:
$Q(\vect k) = \int\matter\rho\,h_{\vect k}\,\dd V = \matter{\tilde\rho}(\vect k, |\vect k|)$. For the second, the
gradient of $h_{\vect k}$ has the parts $i\vect k$ across and $-|\vect k|$ in depth, times $h_{\vect k}$. So

$$\nabla h_{\vect k}\cdot\nabla h_{\vect k'} = \bigl(|\vect k||\vect k'| - \vect k\cdot\vect k'\bigr)\,h_{\vect k}h_{\vect k'}, \qquad h_{\vect k}h_{\vect k'} = e^{i\vect K\cdot\vect a - \kappa z} ,$$

with $\vect K = \vect k + \vect k'$ and $\kappa = |\vect k| + |\vect k'|$. We write $K = |\vect K|$, which is not a
bulk modulus or a kinetic energy here, and expand
$\kappa^2 = (|\vect k| + |\vect k'|)^2$ and $K^2 = |\vect k + \vect k'|^2$:

$$\tfrac12(\kappa^2 - K^2) = \tfrac12\bigl(2|\vect k||\vect k'| - 2\,\vect k\cdot\vect k'\bigr) = |\vect k||\vect k'| - \vect k\cdot\vect k' .$$

Multiplying by $\matter\rho$ and integrating gives two lines:

$$\begin{gathered}
Q(\vect k) = \matter{\tilde\rho}(\vect k, |\vect k|),\\
\int\matter\rho\,\nabla h_{\vect k}\cdot\nabla h_{\vect k'}\,\dd V
= \tfrac12\,(\kappa^2 - K^2)\,\matter{\tilde\rho}(\vect K, \kappa),
\end{gathered}$$

By the triangle inequality, $|\vect k + \vect k'| \le |\vect k| + |\vect k'|$, so $\kappa \ge K$, with equality only
when $\vect k$ and $\vect k'$ point the same way. In the space of $(\vect K, \kappa)$ the surface $\kappa = K$ is a
cone, which we call **the cone** of the scene transform. A reading at one time holds $\matter{\tilde\rho}$ on the cone.
Two readings hold it inside, times $\tfrac12(\kappa^2 - K^2)$. The factor $\kappa^2 - K^2$ is what the Laplacian brings to $e^{i\vect K\cdot\vect a - \kappa z}$, and it vanishes on
the cone.[^local] For
a scene of bounded depth, the values at every $\kappa > K$ fix the depth profile of the ripple $\vect K$, because a
Laplace transform known on an interval can be undone. We show this now.

We fix the ripple $\vect K$ and call
$\matter\rho_{\vect K}(z) = \int\matter\rho(\vect a, z)\,e^{i\vect K\cdot\vect a}\,\dd^2a$, in kilograms per metre, its
**depth profile**: how much of the ripple $\vect K$ the density holds at each depth. We assume that **the scene has a
bounded depth**, so that $\matter\rho_{\vect K}(z) = 0$ below some depth $D$. The scene transform is then the Laplace
transform of the profile over a bounded range,

$$\matter{\tilde\rho}(\vect K, \kappa) = \int_0^D\matter\rho_{\vect K}(z)\,e^{-\kappa z}\,\dd z ,$$

and the second reading gives it at every $\kappa$ of an interval above $K$, once we divide by $\tfrac12(\kappa^2 - K^2)$,
which is not zero there. Let $\kappa_0$ be a point inside that interval. We split the exponential as
$e^{-\kappa z} = e^{-\kappa_0z}\,e^{-(\kappa - \kappa_0)z}$, expand the second factor in its power series and integrate
term by term:

$$\matter{\tilde\rho}(\vect K, \kappa) = \sum_{n=0}^\infty\frac{(\kappa - \kappa_0)^n}{n!}\,c_n, \qquad c_n = \int_0^D(-z)^n\,\matter\rho_{\vect K}(z)\,e^{-\kappa_0z}\,\dd z .$$

Each $c_n$ is in $\mathrm{kg\,m}^n$, so each term is in kilograms. The bounded depth is what allows the sum and the
integral to be exchanged: for $0 \le z \le D$ the $n$th term of the exponential series is at most
$(D|\kappa - \kappa_0|)^n/n!$ in size, whatever $z$ is, and these bounds add up to the finite
$e^{D|\kappa - \kappa_0|}$. The series therefore converges for every $\kappa$, real or complex. Its coefficient $c_n$
is the $n$th derivative of the transform at $\kappa_0$, because each derivative with respect to $\kappa$ brings down a
factor $-z$, and a derivative at $\kappa_0$ is a limit of differences of values on the interval. So the readings on the
interval fix every $c_n$, and with them the transform at every complex $\kappa$.

Now we put $\kappa = -iq$, with $q$ a real wavenumber in depth, in $\mathrm{m^{-1}}$. Then $e^{-\kappa z} = e^{iqz}$, and
the transform becomes the Fourier transform of the profile in depth, with the plus sign of section 2.6. Its inverse
returns $\matter\rho_{\vect K}(z)$, and the inverse transform across the plane, over every $\vect K$, returns
$\matter\rho$. So the second reading fixes the whole scene.

For a check, take a point mass $\matter m$ at depth $z_0$ below the origin, so that
$\matter\rho_{\vect K}(z) = \matter m\,\delta(z - z_0)$ for every $\vect K$. Then $c_n = \matter m(-z_0)^ne^{-\kappa_0z_0}$,
the series sums to $\matter me^{-\kappa_0z_0}e^{-(\kappa - \kappa_0)z_0} = \matter me^{-\kappa z_0}$, and at
$\kappa = -iq$ it is $\matter me^{iqz_0}$, the transform of a spike at $z_0$.

The argument also shows the price. The series is a cancellation among terms as large as about
$e^{D|\kappa - \kappa_0|}$ times the readings. Detail of 50 cm in depth has $q = 2\pi/0.5 = 12.6\unit{m^{-1}}$. In a
scene 1 m deep, read near $\kappa_0 = 2\unit{m^{-1}}$, $|\kappa - \kappa_0| = 12.7\unit{m^{-1}}$ and the terms reach
$e^{12.7} = 3.4 \times 10^5$, so the readings must hold about that many parts. The depth law derived below gives the same
order: a width of 0.47 m at a signal-to-noise ratio of $3.4 \times 10^5$.

{{paper fig:two-readings}}

The null space has the same shape here. The argument above, with $e^{i\vect K\cdot\vect a - \kappa z}$ in place of
$e^{i\vect\xi\cdot\vect x}$, gives a null density the transform
$(\kappa^2 - K^2)\tilde\psi/4\pi G$. It is zero on the cone whatever $\field\psi$ is, and inside the cone it is
$\tilde\psi$ times a factor that is not zero there, which the second reading holds.

For a check, take a point mass $\matter m$ at depth $z_0$ below the origin. Then $Q(\vect k) = \matter me^{-|\vect
k|z_0}$, and the second reading is $\matter m(|\vect k||\vect k'| - \vect k\cdot\vect k')e^{-\kappa z_0}$, which is
$\tfrac12(\kappa^2 - K^2)\matter{\tilde\rho}$ at once. For $\vect k = (1.3, 0.4)$ and
$\vect k' = (-0.2, 0.9)\unit{m^{-1}}$, $K = 1.70$ and $\kappa = 2.28\unit{m^{-1}}$, and the factor is
$1.154\unit{m^{-2}}$ by either side. The first line is Parker's formula for the field of buried mass [@Parker1973].[^slice]

## Every point inside the cone is reached by an ellipse of pairs of tides

We fix a point $(\vect K, \kappa)$ inside the cone and want every pair of tides that reaches it. The pairs have
$\vect k' = \vect K - \vect k$, so they satisfy

$$|\vect k| + |\vect K - \vect k| = \kappa .$$

The distances from $\vect k$ to the two points $0$ and $\vect K$ add up to $\kappa$. A loop of string pinned at two
points and pulled taut by a pencil draws the curve of a fixed sum of distances: an **ellipse**, with the pins as its
foci (Figure [](#fig:cone-ellipse)). Here the foci are $0$ and $\vect K$, each $K/2$ from the centre $\vect K/2$. At an
end of the long axis the distances to the two foci are the semi-major axis plus $K/2$ and the semi-major axis minus
$K/2$, so their sum, $\kappa$, is twice the semi-major axis. An end of the short axis is equally far from both foci, so
each distance is $\kappa/2$, and Pythagoras's theorem gives

$$\text{semi-major axis} = \frac\kappa2, \qquad \text{semi-minor axis} = \tfrac12\sqrt{\kappa^2 - K^2} .$$

On the cone the semi-minor axis is zero, and the ellipse shrinks to the segment from $0$ to $\vect K$: both tides point
along $\vect K$. Every pair on the ellipse gives the same number, because a pair's second reading is the integral on the left of the
second cone equation, and the right side depends only on $(\vect K, \kappa)$. For the pair of the last section the
semi-axes are 1.14 and $0.760\unit{m^{-1}}$, so the long axis is 1.5 times the short one.

![Look first at the ellipse on the left: every wavevector $\vect k$ on it, paired with $\vect K - \vect k$, reaches
the same point of the transform, marked on the right inside the cone. On the cone itself the ellipse shrinks to the
segment from $0$ to $\vect K$. The two pairs drawn are examples.](tut-cone-ellipse){#fig:cone-ellipse}

The same relation, with the same ellipse, governs **optical diffusion tomography**, which maps the inside of soft
tissue with near-infrared light. The light is scattered so often that its density spreads by diffusion. In steady
light, away from its sources, the density $n$ of the light, in photons per cubic metre, obeys

$$\nabla\cdot(D\nabla n) - c\mu_a\,n = 0 ,$$

with $D$ the diffusion coefficient of the light in the tissue, in $\mathrm{m^2\,s^{-1}}$, $\mu_a$ the fraction of the
light absorbed per metre of path, in $\mathrm{m^{-1}}$, and $c$ the speed of light in the tissue. Both terms are in
photons per cubic metre per second. Let the tissue fill the half space below a flat surface and be uniform, apart from
small changes. Sources on the surface whose strength varies across it as $e^{i\vect q\cdot\vect a}$, with $\vect q$ a
wavevector in the surface, make below them $n \propto e^{i\vect q\cdot\vect a - Q(q)z}$. We put this into the equation
with $D$ constant; the derivatives across bring $-|\vect q|^2$ and the one in depth $Q^2$, so
$D(Q^2 - |\vect q|^2) = c\mu_a$ and

$$Q(q) = \sqrt{|\vect q|^2 + \kappa_a^2}, \qquad \kappa_a^2 = \frac{c\mu_a}{D} .$$

A pattern of detectors with wavevector $\vect q'$ weighs the light below it in the same way, because light diffuses
from the tissue to a detector as it would from a source at the detector's place to the tissue. A small change $\delta D$
of the diffusion coefficient then changes what the detectors read by an amount proportional to
$\int\delta D\,\nabla n_s\cdot\nabla n_d\,\dd V$, where $n_s$ is the light of the sources and $n_d$ the light that a
source at the detectors would make; this is the step that linearized Calderón's problem, with $\delta D$ in place of
$\delta\sigma$. A small change $\delta\mu_a$ of the absorption enters as $\int\delta\mu_a\,n_sn_d\,\dd V$. Either way
the data of the pair $(\vect q, \vect q')$ hold the transform of the change at $\vect K = \vect q + \vect q'$ and
$\kappa = Q(q) + Q(q')$. Without absorption, $\kappa_a = 0$ and $Q = |\vect q|$, and this is our relation, with our
ellipse of pairs. Markel and Schotland built inversion formulas, Fourier across and Laplace in depth, on this relation,
and the many pairs that reach one point are averaged to steady the inversion
[@MarkelSchotland2001; @ArridgeSchotland2009].

Two things differ. Tissue absorbs: typical values in the near infrared are $\mu_a = 5\unit{m^{-1}}$ and a reduced
scattering coefficient $\mu_s' = 1000\unit{m^{-1}}$, which set $D = c/[3(\mu_a + \mu_s')]$, so
$\kappa_a^2 = 3\mu_a(\mu_a + \mu_s') = 1.5 \times 10^4\unit{m^{-2}}$, and the light fades over $1/\kappa_a = 8\unit{mm}$
even where it is uniform across the surface. In gravity $\kappa_a = 0$, because the potential obeys Laplace's equation.
And light gives no reading without a source. For a given $\vect K$ the smallest $\kappa$ that a pair reaches is at
$\vect q = \vect q' = \vect K/2$, because the curve $Q(q)$ bends upward, and there
$\kappa = 2Q(K/2) = \sqrt{K^2 + 4\kappa_a^2}$, above the cone: optical tomography has no reading at one time, and so no
cone.

## Fine detail still costs exponentially: the two readings remove the ambiguity and keep the blur

We estimate the precision that a detail of size $2\pi/|\vect\xi|$ needs. The modulus of $h_\pm$ comes from the real part
of its exponent alone:

$$|h_\pm| = e^{\pm\vect\eta\cdot\vect x/2} .$$

Across a body of radius $R$ about the origin, $|\vect\eta\cdot\vect x| \le |\vect\eta|R = |\vect\xi|R$, so each
profile grows to $\boxed{\,|h_\pm| \le e^{|\vect\xi|R/2}\,}$, and from one side of the body to the other it spans the
factor $e^{|\vect\xi|R}$. Their product is a ripple of modulus one. But each square $A(f)$ of the sixteen weighings is dominated by the side
where its profile is largest. So the reading is a small difference of large numbers and needs a relative precision of about $e^{-|\vect\xi|R}$. The
camera must also build the profiles from multipoles, which reach a camera at the radius $R_c$ weakened by
$(R/R_c)^\ell$ at each degree $\ell$ (section 2.3). That cost is not sized here, so the spans below are only part of the price.

For the steel ball one metre across, of section 13.1, $R = 0.5\unit m$. Detail of 20 cm, 10 cm and 5 cm needs spans of
$6.6 \times 10^6$, $4.4 \times 10^{13}$ and $1.9 \times 10^{27}$ (Figure [](#fig:detail-cost)). The best clocks
compare frequencies to about one part in $10^{18}$, so detail finer than about 8 cm is out of reach, even before the
weighing's own smallness. This is the fade of section
[2.7](/tutorial/outside/evanescent/#undoing-the-fade-multiplies-the-noise) once more.

The flat camera shows the same law in depth. A mass $\matter m$ at depth $z$ adds
$\tfrac12(\kappa^2 - K^2)\matter me^{-\kappa z}$ to the second reading, so at one ripple $\vect K$ the second reading,
as a function of $\kappa$, is a Laplace transform of the depth profile. In section 3.7 the ripples of a Fourier
transform fell as $e^{-kz}$ and were kept up to the cut-off $kz = \sym{cutoff}{q_c}$, the larger root of
$q_ce^{-q_c} = 1/\pi\SNR$, with $\sym{snr}{\SNR}$ the camera's signal-to-noise ratio. The blur across the plane was
$4.43\,z/q_c$, which is 43 cm for a mass 1 m deep at $\SNR = 10^3$, where $q_c = 10.4$. Undoing a Laplace transform
costs more, because the falling exponentials of two nearby depths differ far less than two ripples do. For readings
with the same noise at every $\kappa$, the result
([derived below](#undoing-a-laplace-transform-costs-a-fixed-factor-of-sensitivity-for-each-step-of-detail-in-depth))
is a width in depth $\Delta z$, in metres, of about

$$\Delta z \approx \frac{6\,z}{\ln\SNR}$$

for the picture of a point at half its height. For a mass 1 m deep this is 0.87 m at $\SNR = 10^3$ and 0.43 m at
$10^6$, and direct numerical inversions give 0.8 to 1 m and 0.4 to 0.5 m, depending on the model of the noise. So
depth is read about twice as coarsely as position across the plane, and a thousand times the sensitivity buys about a
factor of two. The width grows as $z/\ln\SNR$: this is the blur law again.

Mathematicians know this cost. Let a body's conductivity be known beforehand to lie between two positive bounds and
to have its derivatives, up to some order $s$, bounded by a constant. Alessandrini proved in 1988, for bodies in three
or more dimensions, that two such conductivities whose surface data differ by a small relative amount $\delta$ differ
inside by at most $C\,|\ln\delta|^{-\theta}$, with $C$ and $\theta$ positive constants set by the bounds and the body
[@Alessandrini1988]. With $\SNR = 1/\delta$ the ratio of the data to their error, the error falls as a negative power
of $\ln\SNR$. This is called **logarithmic stability**: squaring the precision of the data improves the result only by
a fixed factor, $2^\theta$. Mandache showed in 2001 that no method can do better than this, apart from the power. For
every small $\varepsilon$ he built pairs of smooth conductivities, within the same bounds, that differ by $\varepsilon$
inside while their surface data differ by less than $e^{-c\,\varepsilon^{-a}}$, with $c$ and $a$ positive constants
[@Mandache2001]. So when the data are known to one part in $\SNR$, conductivities that differ by as much as
$(c/\ln\SNR)^{1/a}$ give data closer together than their error, and no method tells them apart: its error is at least a
power of $1/\ln\SNR$. Both theorems are stated here without proof, from Uhlmann's review.

The spans above show the reason for the form of both. A relative precision of $1/\SNR$ reaches
$|\vect\xi| \approx \ln\SNR/R$. A conductivity with $s$ bounded derivatives has Fourier components that fall at
least as $|\vect\xi|^{-s}$, because each derivative multiplies a component by $|\vect\xi|$. The components beyond
the reach are lost, and they carry a relative error of order $(R|\vect\xi|)^{-s}$ at $|\vect\xi| = \ln\SNR/R$, which is
$(\ln\SNR)^{-s}$: a power of $1/\ln\SNR$, as both theorems say. Since
$6.6 \times 10^6$ squared is $4.4 \times 10^{13}$, squaring the precision halves the finest detail, from 20 to 10 cm. Readings at two times remove the ambiguity and keep the blur.

![Look first at the three marked points: halving the size of the detail squares the precision a second reading needs.
The faint line is the best fractional precision of today's clocks, for comparison. The ball is the steel ball one metre
across.](tut-detail-cost){#fig:detail-cost}

## Undoing a Laplace transform costs a fixed factor of sensitivity for each step of detail in depth

We want the width in depth of the last section from the readings and their noise. We take the ripple $\vect K = 0$,
the density averaged across the plane, whose readings reach every $\kappa > 0$, and write its depth profile as
$\matter\rho_0(z)$, in kilograms per metre. The second reading at $(0, \kappa)$ is $\tfrac12\kappa^2$ times the Laplace
transform

$$F(\kappa) = \int_0^\infty\matter\rho_0(z)\,e^{-\kappa z}\,\dd z ,$$

in kilograms. We first treat $F$ as if it were read with the same noise at every $\kappa$, and then add the factor
$\tfrac12\kappa^2$ and the pairs that share each point.

**In the logarithm of the depth the transform is a blur.** Euler's **gamma function** is
$\Gamma(s) = \int_0^\infty u^{s-1}e^{-u}\,\dd u$, a pure number for each complex $s$ with a positive real part.
Integration by parts gives $\Gamma(s + 1) = s\,\Gamma(s)$, so $\Gamma(n + 1) = n!$. We try the profile $z^{s-1}$, with
$z$ in metres, and substitute $u = \kappa z$:

$$\int_0^\infty z^{s-1}e^{-\kappa z}\,\dd z = \Gamma(s)\,\kappa^{-s} .$$

The transform sends a power of the depth to a power of the decay rate, times $\Gamma(s)$. We take
$s = \tfrac12 + i\omega$ with $\omega$ real. Since $z^{i\omega} = e^{i\omega\ln z}$, the profile
$z^{-1/2}e^{i\omega\ln z}$ is a ripple in $\ln z$ of angular frequency $\omega$, and it comes out as a ripple in
$\ln\kappa$, $\kappa^{-1/2}e^{-i\omega\ln\kappa}$, times $\Gamma(\tfrac12 + i\omega)$. The factors $z^{-1/2}$ and
$\kappa^{-1/2}$ give every ripple the same strength over each unit of its logarithm, since
$\int|z^{-1/2}|^2\,\dd z = \int\dd(\ln z)$, so noise of the same size at every $\kappa$ is noise of the same size for
every ripple. The transform thus multiplies each ripple by its own factor, its **gain**, as a blur does (section
[3.5](/tutorial/noise/wiener-filter/#seen-in-space-a-filter-is-a-blur)).

The gain's size follows from Euler's reflection formula, $\Gamma(s)\,\Gamma(1 - s) = \pi/\sin\pi s$, a standard result
of complex analysis that we state without proof. For real $\omega$, $\Gamma(\tfrac12 - i\omega)$ is the complex
conjugate of $\Gamma(\tfrac12 + i\omega)$, because its integrand is, and $\sin(\tfrac\pi2 + i\pi\omega) =
\cos(i\pi\omega) = \cosh\pi\omega$. So $|\Gamma(\tfrac12 + i\omega)|^2 = \pi/\cosh\pi\omega$. For a check, at
$\omega = 0$ the substitution $u = x^2$ gives $\Gamma(\tfrac12) = 2\int_0^\infty e^{-x^2}\,\dd x = \sqrt\pi$, the
Gaussian integral, and $\pi/\cosh0 = \pi$. Against the slowest ripple,

$$\boxed{\;\frac{|\Gamma(\tfrac12 + i\omega)|}{\Gamma(\tfrac12)} = \frac{1}{\sqrt{\cosh\pi\omega}} \approx \sqrt2\,e^{-\pi\omega/2}\;}$$

for $\omega$ above about one. A ripple with $\omega = 2$ repeats each time the depth grows by $e^\pi = 23$ times, and its
gain is 0.061; at $\omega = 4$ it is 0.0026. Each step of $2/\pi$ in $\omega$ costs a factor $e$ in gain.

**On an interval the gains become singular values.** A scene of bounded depth lies between depths $z_1$ and $z_2$, a
length $\ell = \ln(z_2/z_1)$ in $\ln z$. A profile confined to that length is not a pure ripple, so the gains become the
**singular values** of the transform, the gains of its independent patterns (section
[3.4](/tutorial/noise/symmetric-matrices/#every-linear-camera-is-a-set-of-patterns-gains-and-blind-spots)). Their
squares are the eigenvalues of the transform followed by its transpose, which sends a profile $f(z)$ to
$\int_{z_1}^{z_2}f(z')\,\dd z'/(z + z')$, because $\int_0^\infty e^{-\kappa z}e^{-\kappa z'}\,\dd\kappa = 1/(z + z')$.
An estimate gives their fall. By the count of section [3.8](/tutorial/noise/bits/), done in one dimension, a length
$\ell$ holds $\ell/2\pi$ independent ripples per unit of $\omega$, so the band from $-W$ to $W$ holds $W\ell/\pi$ of
them. The $n$th singular value therefore lies near the gain at $\omega = \pi n/\ell$, and falls as
$e^{-\pi^2n/2\ell}$: by the same factor from each to the next. The eigenvalues of the kernel $1/(z + z')$, computed on
the interval, bear this out. The singular values fall by the factors 0.17, 0.26 and 0.44 when $z_2/z_1$ is 4, 10 and
100, which are $e^{-\pi^2/2\ell}$ with the length taken as $\ell = \ln(4z_2/z_1)$: the ends lengthen the interval by
$\ln4$. Bertero, Boccacci and Pike analysed these singular values and the resolution they allow (M. Bertero,
P. Boccacci and E. R. Pike, *Proc. R. Soc. Lond. A* **383** (1982) 15). For a scene from 0.5 to 2 m deep each further
number about the depth profile costs a factor 6 in sensitivity, so four numbers stand above the noise at a ratio of
$10^3$ and eight at $10^6$.

**The noise sets the finest depth.** Let $\SNR$ be the ratio of the slowest ripple to its noise. A ripple stands
above its noise while $1/\sqrt{\cosh\pi\omega} > 1/\SNR$, up to $\cosh\pi\omega_{\max} = \SNR^2$, or

$$\omega_{\max} \approx \frac1\pi\ln\bigl(2\SNR^2\bigr) = \frac2\pi\ln\SNR + 0.22 .$$

A picture of a point at the depth $z_0$, built from the ripples with $|\omega| \le \omega_{\max}$, is
$\int_{-\omega_{\max}}^{\omega_{\max}}e^{i\omega u}\,\dd\omega/2\pi = \sin(\omega_{\max}u)/\pi u$ in the variable
$u = \ln(z/z_0)$. It falls to half its height where $\sin x/x = \tfrac12$, at $x = 1.90$, so its width at half height
is $3.79/\omega_{\max}$ in $\ln z$. With $\omega_{\max} \approx (2/\pi)\ln\SNR$ this is $3.79\pi/(2\ln\SNR) =
5.95/\ln\SNR$, and a narrow picture is $z$ times that wide in metres:

$$\boxed{\;\Delta z \approx \frac{6\,z}{\ln\SNR} ,\;}$$

the law of the last section. At $\SNR = 10^3$ the exact $\omega_{\max}$ is 4.62 and the width 0.82 in $\ln z$, or
0.84 m for a mass 1 m deep, between $z_0e^{-0.41}$ and $z_0e^{0.41}$; at $10^6$ they are 9.02, 0.42 and 0.42 m. As
$\SNR$ grows without limit the width shrinks, but only as $1/\ln\SNR$; when $\SNR$ falls towards one, $\omega_{\max}$
falls to zero and no depth is read at all. Halving the width needs the square of the sensitivity.

**The camera's own noise.** Now we read $F$ as the camera does. The pairs that reach $(0, \kappa)$ have
$\vect k' = -\vect k$ with $|\vect k| = \kappa/2$: the
[ellipse of pairs](#every-point-inside-the-cone-is-reached-by-an-ellipse-of-pairs-of-tides) has both foci at $0$ and
is a circle of radius $\kappa/2$. Each pair's reading is $\tfrac12\kappa^2F(\kappa)$. We assume that **each pair is read
once, with noise of one size, independent from pair to pair**. A camera of area $A$ tells apart wavevectors whose
components differ by $2\pi/\sqrt A$, so the circles between $\kappa$ and $\kappa + \dd\kappa$, a ring of area
$\pi\kappa\,\dd\kappa/2$ in the plane of $\vect k$, hold $A\kappa\,\dd\kappa/16\pi$ different pairs, half of
$A/(2\pi)^2$ per unit area, since $\vect k$ and $-\vect k$ make the same pair. Averaging $N$ readings of one number
divides its noise by $\sqrt N$. So, per unit of $\kappa$, the camera reads $F$ as well as it would read
$\kappa^{5/2}F(\kappa)$ with the same noise at every $\kappa$: $\kappa^2$ from the factor $\tfrac12\kappa^2$ and
$\kappa^{1/2}$ from the number of pairs.

The step with the gamma function carries over. Now $\kappa^{5/2}\int z^{s-1}e^{-\kappa z}\,\dd z = \Gamma(s)\,
\kappa^{5/2-s}$, which is a ripple of equal strength in $\ln\kappa$, $\kappa^{-1/2-i\omega}$, when $s = 3 + i\omega$.
The gain is $|\Gamma(3 + i\omega)|$. The rule $\Gamma(s + 1) = s\,\Gamma(s)$ gives
$\Gamma(3 + i\omega) = (2 + i\omega)(1 + i\omega)\,i\omega\,\Gamma(i\omega)$, and the reflection formula at $s = i\omega$
gives $\Gamma(i\omega)\,\Gamma(1 - i\omega) = \pi/\sin(i\pi\omega) = \pi/(i\sinh\pi\omega)$. With
$\Gamma(1 - i\omega) = -i\omega\,\Gamma(-i\omega)$, the conjugate of $i\omega\,\Gamma(i\omega)$, we find
$|\Gamma(1 + i\omega)|^2 = \pi\omega/\sinh\pi\omega$, and against $\Gamma(3) = 2$,

$$\frac{|\Gamma(3 + i\omega)|^2}{\Gamma(3)^2} = \frac{(1 + \omega^2)(4 + \omega^2)}{4}\,\frac{\pi\omega}{\sinh\pi\omega} \approx \frac\pi2\,\omega^5e^{-\pi\omega} .$$

At $\omega = 0$ it is one, as it must be. For large $\omega$ it falls with the same exponential as before, and only the
power in front is new. The cut-off now solves
$\tfrac\pi2\omega_{\max} = \ln\SNR + \tfrac12\ln\tfrac\pi2 + \tfrac52\ln\omega_{\max}$, a logarithm of a logarithm like
the cut-off of section [3.7](/tutorial/noise/blur-law/#step-4-solving-the-cut-off-needs-a-logarithm-of-a-logarithm).
At the same ratio for the slowest ripple, $\omega_{\max}$ is 7.85 at $10^3$ and 13.0 at $10^6$, against 4.62 and 9.02,
and the picture of a mass 1 m deep is 0.49 m and 0.29 m wide. Built with the Wiener filter of section 3.5 in place of a
sharp cut-off, on depths from 5 cm to 20 m, it is 0.5 m and 0.3 m wide. The factor $\tfrac12\kappa^2$ and the shared
pairs favour the fast-fading readings, which carry the depth, so at a given ratio they narrow the picture. They change
the power in front of the exponential, not the exponential, so the width still shrinks only as $1/\ln\SNR$, and the
two widths draw together as the sensitivity grows: at $10^{12}$ they are 0.17 and 0.21 m.

**Ripples across the plane.** For $\vect K \ne 0$ the readings start on the cone, at $\kappa = K$, and each carries at
least the factor $e^{-Kz}$ for a mass at depth $z$. A fine ripple across therefore reaches the noise sooner, and its
depth profile is read with the coarser width that its smaller ratio allows.

## The bits of a second reading grow as the fourth power of the logarithm

We want the bits that a second reading holds, by section 3.8's rule. Let a mass be held for an instant (section 13.1)
at points anywhere outside a sphere of radius $R_c$ about a body of radius $R$, at many distances. Section
[13.3](/tutorial/what-a-field-keeps/ladder/#a-mass-held-for-an-instant-is-a-tide-of-every-degree-so-it-climbs-the-whole-ladder)
shows that the energies it leaves hold the moment of the density against every polynomial in $x$, $y$ and $z$, and we
use that result here. A product of $n$ coordinates is fixed by how many of its factors are $x$, $y$ and $z$. With no
$x$ there are $n + 1$ ways to share the factors between $y$ and $z$, with one $x$ there are $n$, and so on, so there
are $(n + 1) + n + \dots + 1 = (n + 1)(n + 2)/2$ products of degree $n$, about $n^2/2$, against the $2n + 1$
harmonic ones of the first reading
([2.2](/tutorial/outside/spherical-harmonics/#there-are-2ell-1-patterns-of-each-degree)). For $n = 2$ there are six,
$x^2$, $y^2$, $z^2$, $xy$, $yz$ and $zx$, against five.

We assume that **each moment of degree $n$ reaches the camera weakened by $(R/R_c)^n$** (section
2.3). Section 3.8's rule then gives each moment $(L - n\Lambda)/\ln2$ bits, with 3.8's pure numbers $L = \ln\SNR$ and
$\Lambda = \ln(R_c/R)$, where $\SNR$ is the second reading's own ratio for its leading term.[^Lambda] Adding the degrees
up to $L/\Lambda$, the bits are

$$H_2 \approx \frac1{\ln2}\sum_{n \le L/\Lambda}\tfrac12(n + 1)(n + 2)\,(L - n\Lambda) .$$

For many degrees we replace the sum by an integral and keep its largest power:
$\int_0^{L/\Lambda}\tfrac12n^2(L - n\Lambda)\,\dd n = \tfrac12\bigl(\tfrac13 - \tfrac14\bigr)L^4/\Lambda^3$. So

$$\boxed{\;H_2 \approx \frac{L^4}{24\,\Lambda^3\ln2} ,\;}$$

against the leading term $L^3/(3\Lambda^2\ln2)$ of the first reading's bits (section 3.8). About $n^2/2$ numbers of each
degree, in place of $2n$, bring one more power of the readable degree $L/\Lambda$.

From three radii, $\Lambda = \ln3 = 1.10$. At $\SNR = 10^6$ the sum runs to degree 12 and gives 2580 bits, against the
first reading's 1200. The boxed term gives only 1650 there, because twelve degrees are too few for an integral. It is a
guide only when many degrees are read, as at $10^{70}$, where it gives $3.06 \times 10^7$ against the sum's $3.19 \times
10^7$ and the first reading's $1.7 \times 10^6$. The sum is an upper bound, because it reads each moment as if it were
alone. In one angular pattern, moments of different degree fall off with the held mass's distance in nearly the same
way, so telling them apart has a price; a full count, 1300 bits at $10^6$ and $9.6 \times 10^6$ at
$10^{70}$, includes it.[^bits] On a single sphere with one mass held at a time they cannot be told apart at all; two
masses held together tell them apart by their directions (sections
[13.8](/tutorial/what-a-field-keeps/holography/#pushing-reads-the-volume-but-only-to-a-number-of-cells-set-by-the-logarithm)
and
[13.3](/tutorial/what-a-field-keeps/ladder/#a-mass-held-for-an-instant-is-a-tide-of-every-degree-so-it-climbs-the-whole-ladder)).
If a passing tonne makes the second reading of the steel ball, its ratio is $4.6 \times 10^{-17}$ times the first's
(section 13.1). A first reading at $10^6$ then leaves nothing of the second to count, and one at $10^{70}$ leaves $4.6
\times 10^{53}$, for which the sum gives $1.1 \times 10^7$ bits.

{{paper fig:hair}}

Panel (b) of the figure shows the first reading's 169 beads at $10^6$, up to degree twelve. The second reading has 455
moments up to the same degree, the sum of $(n + 1)(n + 2)/2$ from $n = 0$ to 12.

::: try {#two-readings}
Predict first: two tides whose wavevectors point the same way are applied in turn. Does their second reading land on
the cone or inside it? And the nugget minus its flush is invisible to every first reading: what does its second
reading show on the cone, and a little inside it? The left panel shows the two tides' $\vect k$ and $\vect k'$, their sum $\vect K$, and the ellipse of every pair that
lands where this one does. The right panel is the half-plane of $|\vect K|$ and $\kappa$, with the cone's line, the
dot where the pair lands, and the second reading, shaded where it stands above the noise. Drag the tip of
$\vect k'$ round until it points along $\vect k$, or Tab to it and move it with the arrow keys. Then choose *A nugget
minus its flush* in *The scene*. Last, with *A point mass*, raise *Signal-to-noise* from $10^3$ to $10^4$ and watch how far the shaded edge moves,
with *Depth of the mass* at 1 m and at 2 m.
:::

**The idea to keep: two harmonic exponentials whose exponents are null vectors multiply into any ripple, so readings at
two times give the Fourier transform of the density, and in Newton's gravity Calderón's argument is exact. A flat camera
reads that transform on a cone at one time and inside it at two. The ambiguity is gone but the blur is not: resolution
grows only as the logarithm of the sensitivity, and the bits as its fourth power.**

::: problems
### Practice

**[13.2]** Why is $e^{i\vect\xi\cdot\vect x}$ not harmonic, and how can harmonic tides still read it?

::: solution
Its Laplacian is $-|\vect\xi|^2$ times itself. It is the product of $e^{\vect\zeta_+\cdot\vect x}$ and
$e^{\vect\zeta_-\cdot\vect x}$, both harmonic, and the product of their gradients carries it, times
$-\tfrac12|\vect\xi|^2$.
:::

**[13.2]** How many weighings does one complex Fourier component need, and where does each factor of two come from?

::: solution
Sixteen: four real integrals, two squares for each, two copies for each square.
:::

**[13.2]** A point mass of 100 kg lies 2 m below the origin of a flat camera. For $\vect k = (1, 0)$ and
$\vect k' = (0, 1)\unit{m^{-1}}$, find $Q(\vect k)$, the point $(K, \kappa)$, the second reading and the semi-axes of
the ellipse.

::: solution
$Q(\vect k) = 100\,e^{-2} = 13.5\unit{kg}$. $K = \sqrt2 = 1.41$ and $\kappa = 2\unit{m^{-1}}$. The second reading is
$\tfrac12(4 - 2) \times 100\,e^{-4} = 1.83\unit{kg\,m^{-2}}$. The semi-axes are 1 and $\tfrac12\sqrt2 =
0.71\unit{m^{-1}}$.
:::

**[13.2]** Why does the argument that a Laplace transform known on an interval fixes the depth profile need a scene of
bounded depth? Check the argument on a point mass of 1 kg at 1 m: find $c_n$ at $\kappa_0 = 2\unit{m^{-1}}$ and sum the
series at $\kappa = 3\unit{m^{-1}}$.

::: solution
The power series of $e^{-(\kappa - \kappa_0)z}$ may be integrated term by term only if its terms are bounded together;
for $0 \le z \le D$ they are at most $(D|\kappa - \kappa_0|)^n/n!$, which add up to $e^{D|\kappa - \kappa_0|}$, so the
series converges for every complex $\kappa$, including $\kappa = -iq$. For the point mass $c_n = (-1)^ne^{-2}\unit{kg\,m^n}$,
and the series is $e^{-2}\sum(-1)^n/n! = e^{-3} = 0.0498\unit{kg}$, the transform $e^{-\kappa z_0}$ at $\kappa = 3$.
:::

**[13.2]** Suppose the error of a reconstruction falls as $(\ln\SNR)^{-2}$. By what factor does it fall when $\SNR$ goes
from $10^6$ to $10^{12}$? How many numbers about the depth profile of a scene from 0.5 to 2 m deep stand above the
noise at $10^{12}$, if each costs a factor 6?

::: solution
The logarithm doubles, so the error falls by four. The $n$th number stands above the noise while $6^{-n} > 10^{-12}$,
that is $n \le 27.6/1.79 = 15.4$: sixteen numbers, $n = 0$ to 15, against eight at $10^6$.
:::

### Stretch

**[13.2]** In Figure [](/paper/#fig:two-readings), where does a reading at one time lie, and where is a null-space
density invisible?

::: solution
Both on the cone $\kappa = K$: a null density's transform, $(\kappa^2 - K^2)\tilde\psi/4\pi G$, vanishes there
whatever $\field\psi$ is, and nowhere inside it.
:::

**[13.2]** For the steel ball of radius 0.5 m, by what factor do the two exponentials span the ball when they read
detail of 10 cm?

::: solution
$|\vect\xi| = 2\pi/0.1 = 62.8\unit{m^{-1}}$, so $e^{|\vect\xi|R} = e^{31.4} = 4.4 \times 10^{13}$.
:::

**[13.2]** With section 2.1, show that a null-space density $\nabla^2\field\psi/4\pi G$ has the scene transform
$(\kappa^2 - K^2)\tilde\psi/4\pi G$, and that its second reading at $(\vect K, \kappa)$ is
$\tfrac12(\kappa^2 - K^2)^2\tilde\psi/4\pi G$.

::: solution
Green's second identity moves the Laplacian onto $e^{i\vect K\cdot\vect a - \kappa z}$, whose Laplacian is
$(\kappa^2 - K^2)$ times itself. Because $\field\psi$ is confined, there are no surface terms. The second reading multiplies the transform by $\tfrac12(\kappa^2 - K^2)$.
:::

**[13.2]** In tissue whose light fades over $1/\kappa_a = 8\unit{mm}$, what is the smallest decay rate $\kappa$ that a
source pattern and a detector pattern reach together at $K = 0$, and at $K = 2\kappa_a$? Where is the cone at these
$K$?

::: solution
The smallest is $\sqrt{K^2 + 4\kappa_a^2}$, with $\kappa_a = 125\unit{m^{-1}}$: $250\unit{m^{-1}}$ at $K = 0$ and
$\sqrt8\,\kappa_a = 354\unit{m^{-1}}$ at $K = 250\unit{m^{-1}}$. The cone is at $\kappa = K$, that is 0 and
$250\unit{m^{-1}}$, so the light's readings lie wholly inside it.
:::

**[13.2]** Show from the reflection formula that $|\Gamma(\tfrac12 + i\omega)|^2 = \pi/\cosh\pi\omega$. With the same
noise at every $\kappa$, find $\omega_{\max}$ and the width in depth of the picture of a mass 1 m deep at
$\SNR = 10^4$, and compare with $6z/\ln\SNR$.

::: solution
At $s = \tfrac12 + i\omega$, $1 - s$ is the conjugate of $s$, so $\Gamma(s)\Gamma(1 - s) = |\Gamma(s)|^2$, and
$\sin\pi s = \cosh\pi\omega$. The cut-off solves $\cosh\pi\omega = 10^8$, so $\pi\omega_{\max} = \ln(2 \times 10^8) =
19.11$ and $\omega_{\max} = 6.08$. The width is $3.79/6.08 = 0.62$ in $\ln z$, or $2\sinh0.31 = 0.63\unit m$, against
$6/\ln10^4 = 0.65\unit m$.
:::

### The camera

**[13.2]** Derive Calderón's equation from the null vectors $\vect\zeta_\pm$, then both lines of the cone equations, and show
that the sixteen weighings of section 13.1 give one Fourier component.

::: solution
The key steps are $\vect\zeta_+\cdot\vect\zeta_- = -\tfrac12|\vect\xi|^2$,
$|\vect k||\vect k'| - \vect k\cdot\vect k' = \tfrac12(\kappa^2 - K^2)$, and the polarization identity applied to the
four real integrals.
:::
:::

::: paper
- [*The field at two times*](/paper/#par:the-field-at-two-times) (Section XIII): the commutator, Calderón's argument,
  and the null space as a property of a reading at one time.
- [*The two readings as one transform*](/paper/#par:the-two-readings-as-one-transform): the cone, the ellipse, Parker
  and optical tomography, with Figure [](/paper/#fig:two-readings).
- [*Stability*](/paper/#par:stability): the spans $e^{|\vect\xi|R}$, Alessandrini and Mandache.
- [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing): the sixteen weighings.
- [*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading): the fourth power of $\ln\SNR$.
:::

::: deeper
- A. P. Calderón, "On an inverse boundary value problem" (1980, reprinted 2006) [@Calderon1980]: a few pages, with
  these exponentials.
- G. Uhlmann, "Electrical impedance tomography and Calderón's problem", *Inverse Problems* **25** (2009) 123011: the
  problem, its history and its stability.
- R. L. Parker, "The rapid calculation of potential anomalies" (1973) [@Parker1973]: the first cone equation as
  geophysicists use it.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, which also treats the quantum form
    of the bracket, its equation [](/paper/#eq:hair-commutator); see
    [*The field at two times*](/paper/#par:the-field-at-two-times).

[^four]: Section
    [R4](/tutorial/response/reading-section-iv-3/#one-integral-of-the-density-is-a-bracket-a-thermal-average-the-weight-of-a-response-and-the-answer-of-dust)
    reads the same integral four ways: as a bracket, a tremor, the weight of a response and the answer of dust.

[^letters]: Here $\vect\xi$ is not the separation of section 1.4, and $\vect\eta$ is not a rapidity.

[^push]: This is equation [](/paper/#eq:calderon) of *The gravitational camera* (Mohsenvand 2026), Sec. XIII. A push is
    an applied tide or heat at a known temperature; a cold body at rest with nothing applied has
    $\matter{\dot Q_g} = 0$, so a second reading of its field repeats the first.

[^sigma]: This $\sigma$ is local to this section.

[^rungs]: Section [13.3](/tutorial/what-a-field-keeps/ladder/#two-bodies-that-no-quadrupolar-tide-tells-apart) shows which tides see which part of the null space.

[^slice]: Passes along one direction (section 13.1) read the three-dimensional transform on a plane of wavevectors
    through the origin; a flat camera reads its own transform on the cone, and inside it.

[^local]: A density whose scene transform is $\kappa^2 - K^2$ times the transform of a function $\chi$ that vanishes
    outside a bounded region is $\nabla^2\chi$: Green's second identity (section 2.1) gives $\nabla^2\chi$ that
    transform, and the argument below shows that a transform of bounded depth fixes its density. Such a density is
    local, since it vanishes wherever $\chi$ does, and its moment against every harmonic $h$ is
    $\int\chi\,\nabla^2h\,\dd V = 0$, so it changes neither the multipoles nor the field outside. The reason is that
    $\kappa^2 - K^2$ is the Fourier symbol of the Laplacian: the exponential $e^{i\vect K\cdot\vect a - \kappa z}$ is a
    ripple whose three-dimensional wavevector $(\vect K, i\kappa)$ has the square $K^2 - \kappa^2$. The same fact is
    known for the stress tensors of compact bodies in general relativity: terms of their transforms proportional to the
    square of the wavevector are local and leave the multipoles and the distant field as they were
    [@GoldbergerRothstein2006a; @BianchiEtAl2025].

[^Lambda]: This $\Lambda$ is the logarithm of section 3.8; $H_2$ is the second reading's bits, as $H$ is the first's.

[^bits]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII; see
    [*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading) and its equation
    [](/paper/#eq:hair-bits).
