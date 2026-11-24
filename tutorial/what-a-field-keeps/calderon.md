---
id: '13.2'
title: "Reading an interior: Calderón's argument; the two readings as one transform"
question: 'How can readings made from outside, each of which weighs the density against a smooth harmonic function, add up to every ripple of the density, how would a flat camera arrange such readings, and what does fine detail still cost?'
part: '13'
requires: ['1.5b', '1.7', '2.1', '2.3', '2.4', '2.5', '2.6', '2.7', '3.7', '3.8', '13.1']
paper: [sec:second-order, eq:hair-commutator, eq:calderon, eq:scene-transform, eq:cone, fig:two-readings, eq:hair-bits]
figures: [fig:same-outside, fig:two-readings, fig:hair]
live: [fading-ripple]
depth: A
---

**What you need:** chapters
[1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside) (the bracket of two moments),
[2.1](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other) (Green's second
identity),
[2.4](/tutorial/outside/greens-functions/#above-a-flat-camera-a-mirror-image-gives-the-potential-at-every-height) (the
flat camera),
[2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read) (the
null space),
[2.6](/tutorial/outside/fourier/#the-papers-convention-is-a-plus-sign-in-space-and-a-minus-sign-in-time) (transforms),
[3.7](/tutorial/noise/blur-law/#step-3-the-filter-keeps-a-ripple-while-it-stands-above-its-noise) (the cut-off),
[3.8](/tutorial/noise/bits/#a-bodys-field-at-one-time-holds-about-1200-bits-from-three-radii-away) (bits) and chapter
[13.1](/tutorial/what-a-field-keeps/push-and-pass/#two-weighings-of-two-copies-read-the-even-part-and-the-odd-part)
(the weighings).

The paper's Figure [](/paper/#fig:same-outside) shows three steel balls. One holds a gold nugget halfway to its wall,
one holds a flush of extra density on the near wall, and one carries a thin skin of mass on its surface. Their fields
are identical everywhere outside, at every instant, so no camera can tell them apart by their steady pull (chapter 2.5).
Section XIII says that they "are told apart as soon as they are warm or a tide is applied".

{{paper fig:same-outside}}

So we ask: how can readings made from outside, each of which weighs the density against a smooth harmonic function, add
up to every ripple of the density, how would a flat camera arrange such readings, and what does fine detail still cost?
The answer is Calderón's argument, on which the paper's claim that an interior can be read from outside rests.

::: plain
At any one moment, a camera outside a body reads only certain averages of its mass. Each average weights the mass by a
smooth pattern that the steady field can carry outward. Masses arranged differently can share all these averages, as
the three balls do.

After a known tide has given the body a brief kick, a second reading holds a new kind of average. Its weight is the
product of two such patterns, and products are not limited in the same way. Two patterns that grow exponentially in
opposite directions multiply into a pure ripple. Knowing the strength of every ripple of the density is the same as
knowing the density, so the second reading tells the three balls apart.

A flat camera above a scene reads ripples across its plane that fade with depth. One reading gives one rate of fading
for each ripple, and two readings give every faster rate as well.

Fine detail stays expensive. The patterns that make a fine ripple are huge at one side of the body and tiny at the
other, so the precision needed grows exponentially with the fineness. The resolution grows only as the logarithm of the
sensitivity.
:::

## Readings at two times hold an integral that no reading at one time holds

Here $\sym{density}{\matter\rho}$ is the density, in kilograms per cubic metre, and
$\sym{mass-moment}{\matter{Q_h}} = \int\matter\rho\,h\,\dd V$ is its moment against a profile $h$, a dimensionless
function of position (chapter 1.7). A **reading at one time** is what a camera outside records of a body's field at one
instant. It holds $\matter{Q_h}$ only for profiles $h$ that are harmonic in the body, and densities with none of these
moments are invisible to it (chapter 2.5). A **reading at two times** reads a moment again after a known tide has acted,
or reads how the moments of a body at a known temperature change from one instant to the next.

Chapter 1.7 found what such readings hold. The bracket of a moment with the rate of change $\matter{\dot Q_g}$ of
another is

$$\{\matter{Q_h}, \matter{\dot Q_g}\} = \int\matter\rho\,\nabla h\cdot\nabla g\,\dd V ,$$

in $\mathrm{kg\,m^{-2}}$, and chapter 13.1 found the same integral, with $g = h$, as the even part of two weighings. The
paper's [](/paper/#eq:hair-commutator) is its quantum form.[^four] It holds for matter whose forces do not depend on
velocity, which we assume throughout.

For harmonic $h$ and $g$ this integral is therefore known. It is the moment of the density against $\nabla h\cdot\nabla
g$, which is in general not harmonic
([2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic)). If the products
$\nabla h\cdot\nabla g$, over all pairs of harmonic profiles, build every function, then these numbers fix
$\matter\rho$.

## Two harmonic exponentials multiply into any ripple

We want two harmonic functions whose gradients multiply into a ripple $e^{i\vect\xi\cdot\vect x}$, because the
integral of the last section is then the density's Fourier transform. Here $\vect\xi$ is a real wavevector in
$\mathrm{m^{-1}}$, so the ripple's crests are $2\pi/|\vect\xi|$ apart (chapter 2.6).

The tool is chapter 2.1's stretch problem. For a vector $\vect\zeta$ with complex components, in $\mathrm{m^{-1}}$, each
derivative $\partial_j$ of $e^{\vect\zeta\cdot\vect x}$ brings down the factor $\zeta_j$, so

$$\nabla^2e^{\vect\zeta\cdot\vect x} = (\vect\zeta\cdot\vect\zeta)\,e^{\vect\zeta\cdot\vect x} .$$

The exponential is harmonic exactly when $\vect\zeta\cdot\vect\zeta = 0$, with the dot product taken without a complex
conjugate. A complex vector whose square vanishes in this sense is a **null vector**
([1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero)). We call
$e^{\vect\zeta\cdot\vect x}$ with $\vect\zeta$ null a **harmonic exponential**.

We assume that **$\vect\xi$ is any real wavevector** and that **$\vect\eta$ is a second real vector, in
$\mathrm{m^{-1}}$, at right angles to $\vect\xi$ and as long**. The paper's pair is[^letters]

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

which is the paper's equation:

{{paper eq:calderon}}

In the paper's words, "the data at two times are the Fourier transform of the density".[^push] Both sides are in
$\mathrm{kg\,m^{-2}}$: the density in $\mathrm{kg\,m^{-3}}$, each gradient in $\mathrm{m^{-1}}$ and the volume in
$\mathrm m^3$. The exponent has the paper's plus sign, so for a real density the right side is the complex conjugate of
chapter 2.6's transform, with the same modulus (2.6's table of conventions).

For a check, put $\vect\eta = 0$. Then $\vect\zeta = i\vect\xi/2$ and $\vect\zeta\cdot\vect\zeta = -|\vect\xi|^2/4$,
which is not zero, so $e^{i\vect\xi\cdot\vect x/2}$ is not harmonic. The real parts $\pm\vect\eta/2$ are what make the
exponentials harmonic, and because of them $h_+$ grows along $\vect\eta$ and $h_-$ along $-\vect\eta$. For a number,
take $\vect\xi = (2, 1, -0.5)\unit{m^{-1}}$. Then $|\vect\xi|^2 = 5.25\unit{m^{-2}}$ and
$\vect\zeta_+\cdot\vect\zeta_- = -2.625\unit{m^{-2}}$, which is $-\tfrac12|\vect\xi|^2$.[^checks]

So a ripple that is not harmonic is the product of two exponentials that are. A reading at two times made with them
holds the strength of that ripple in the density.

<!-- diagram: tut-calderon-pair — spec: one plane containing ξ and η, a body's disc of radius R drawn faint. Behind it,
the two real growths |h₊| = e^{η·x/2} and |h₋| = e^{−η·x/2} as two grey ramps of shading that rise in opposite
directions along η (each from e^{−|ξ|R/2} to e^{|ξ|R/2} across the disc, on one log scale, with |ξ|R = 6 for the
drawing). Across the disc, the crests of cos ξ·x as thin lines at right angles to ξ, spaced 2π/|ξ| exactly. Inset at a
corner: the vectors ξ and η from one point, at right angles, of equal length, labelled; and ζ± = ½(iξ ± η) named
beside them. Labels never on the ramps. Caption: "Look first at the two grey ramps: one harmonic exponential grows
along η and the other along −η, so their product has no growth at all. What is left is the
ripple whose crests cross the disc, at right angles to ξ. The size of the body and the length of ξ are chosen for the
drawing." -->

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

Chapter 13.1 measured each square. Two copies of the body, prepared alike and given impulsive tides of profile $f$ and
strengths $+\epsilon$ and $-\epsilon$, gain the energies $E_+$ and $E_-$, and their even part is
$\tfrac12(E_+ + E_-) = \tfrac12\epsilon^2A(f)$. So

$$A(f) = \frac{E_+ + E_-}{\epsilon^2} .$$

The odd parts $\pm\epsilon\matter{\dot Q_f}$ cancel in the sum, so the body may be moving. Four real integrals, two
squares for each and two copies for each square give

$$\boxed{\;4 \times 2 \times 2 = 16\ \text{weighings for one complex Fourier component,}\;}$$

the paper's "sixteen weighings for each Fourier component of the density". The component is complex, so the sixteen
give both the cosine and the sine ripple of one wavevector. For a check, take one real profile, $a = b = h$:
then the integral is $A(h)$ itself, and two weighings suffice, as in chapter 13.1.

So every ripple of the density is a finite recipe of pushes and weighings: four real profiles, combined in eight ways,
each applied to two copies of the body.

<!-- diagram: tut-sixteen-weighings — spec: a tree drawn left to right. Root: "one Fourier component" (the complex
number ∫ρ∇h₊·∇h₋). Two branches: its real and its imaginary part. Four nodes: ∫ρ∇u₊·∇u₋, ∫ρ∇v₊·∇v₋ under the real
part, ∫ρ∇u₊·∇v₋, ∫ρ∇v₊·∇u₋ under the imaginary part. Eight nodes: A(a + b) and A(a − b) under each. Sixteen leaves:
E₊ and E₋ under each square, each leaf a small balance icon of one style. Thin single strokes, neutral colour; a count
under each column: 1, 2, 4, 8, 16. Caption: "Look first at the counts under the columns: one complex ripple of the
density needs four real integrals, each found from two squares by the polarization identity, and each square from two
copies kicked both ways. The balances stand for weighings." -->

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
vanishes on the surface, so Green's first identity (chapter 2.1) moves its gradient onto the uniform body's potentials,
whose Laplacian is zero. The data change by $\int\delta\sigma\,\nabla u\cdot\nabla v\,\dd V$, with $u$ and $v$ the
harmonic potentials of the uniform body. Keeping only the first order of a small change is linearizing
([7.4](/tutorial/geometry/linearized-gravity/#a-weak-field-is-a-small-table-laid-on-flat-spacetime)). The result is our
integral, with $\delta\sigma$ in place of $\matter\rho$. Calderón proved in 1980 that this linearized map loses nothing
[@Calderon1980], by the argument of the last two sections and with the same pair $h_\pm$.

In gravity nothing is dropped. The currents of a conductor are bent by the very conductivity they measure. A tide is
made by masses outside, and the kick $\epsilon\matter m\nabla g$ that it gives a part of mass $\matter m$ does not
depend on where the other parts are. So the paper's [](/paper/#eq:push) and the bracket above hold exactly in Newton's
mechanics: "here, in Newton's theory, the linear form is exact."

::: history
### Calderón and the oil fields

Calderón published "On an inverse boundary value problem" in 1980, in the proceedings of a seminar in Rio de Janeiro.
G. Uhlmann's review of 2009 records that oil prospecting led him to the problem in the 1940s, when he was an engineer
for YPF, Argentina's state oil company, and that he published nothing on it for many years.
:::

## The null space belongs to one reading, not to gravity

The nugget and its flush differ by a density $\nabla^2\field\psi/4\pi G$, where $\sym{null-potential}{\field\psi}$ is
a potential, in joules per kilogram, that vanishes with its gradient outside the ball (chapter 2.5). At one time the two
balls give the same data, because every harmonic moment of $\nabla^2\field\psi/4\pi G$ is zero. At two times the
paper's [](/paper/#eq:calderon) gives $-\tfrac12|\vect\xi|^2$ times the transform of the difference.

We apply Green's second identity (chapter 2.1) over a region a little larger than the ball, to $e^{i\vect\xi\cdot\vect
x}$ and $\field\psi$. The terms on its surface vanish, because $\field\psi$ and its gradient vanish there, so the
Laplacian moves across:

$$\int e^{i\vect\xi\cdot\vect x}\,\nabla^2\field\psi\,\dd V = \int\field\psi\,\nabla^2e^{i\vect\xi\cdot\vect x}\,\dd V = -|\vect\xi|^2\,\tilde\psi(\vect\xi) ,$$

with $\tilde\psi(\vect\xi) = \int\field\psi\,e^{i\vect\xi\cdot\vect x}\,\dd V$, in the paper's sign. Dividing by
$4\pi G$,

$$\boxed{\;\int\frac{\nabla^2\field\psi}{4\pi G}\,e^{i\vect\xi\cdot\vect x}\,\dd V = -\frac{|\vect\xi|^2\,\tilde\psi(\vect\xi)}{4\pi G} ,\;}$$

in kilograms. This vanishes at every $\vect\xi \ne 0$ only if $\tilde\psi$ does, and then $\field\psi = 0$ by chapter
2.6's inverse transform. So the second reading sees every density that the first misses. For a check, at
$\vect\xi = 0$ the transform vanishes: the null density has no mass, as it must, since its mass is a harmonic moment.

The null space is therefore "a property of a reading at one time, not of gravity". The three balls of the opening are
told apart by the second reading.[^rungs]

## A flat camera reads the transform on a cone at one time and inside it at two

Let the camera lie in the plane $z = 0$ and the scene beneath it, at depths $z > 0$ in metres, as in chapters 2.4 and
2.7. Here $\vect a$ is the position across the camera, in metres, and $\sym{wavevector}{\vect k}$ is a wavevector in its
plane, in $\mathrm{m^{-1}}$. Chapter 2.4's harmonic functions that fade into the scene are

$$h_{\vect k} = e^{i\vect k\cdot\vect a - |\vect k|z} ,$$

harmonic because the second derivatives across bring $-|\vect k|^2$ and the one in depth brings $+|\vect k|^2$. Their
real and imaginary parts are real tides, as for $h_\pm$.

The paper writes the scene's transform as

{{paper eq:scene-transform}}

Here $\vect K$ is a wavevector across the plane and $\sym{decay-rate}{\kappa}$ a rate of decay with depth, both in
$\mathrm{m^{-1}}$, and $\sym{scene-transform}{\matter{\tilde\rho}}(\vect K, \kappa)$ is in kilograms. We call it the
**scene transform**. Across the plane it is a Fourier transform, with the paper's plus sign. In depth it weights the
density by the falling exponential $e^{-\kappa z}$ instead of a ripple, and such a weighting is a **Laplace transform**.
We use this transform because the camera's functions $h_{\vect k}$, and their products, are exactly of its form. For an
example, a point mass $\matter m$ at the place $\vect a_0$ and depth $z_0$ has
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

Multiplying by $\matter\rho$ and integrating gives the paper's two lines:

{{paper eq:cone}}

By the triangle inequality, $|\vect k + \vect k'| \le |\vect k| + |\vect k'|$, so $\kappa \ge K$, with equality only
when $\vect k$ and $\vect k'$ point the same way. In the space of $(\vect K, \kappa)$ the surface $\kappa = K$ is a
cone, which we call **the cone** of the scene transform. A reading at one time holds $\matter{\tilde\rho}$ on the cone.
Two readings hold it inside, times $\tfrac12(\kappa^2 - K^2)$. Differentiating $e^{i\vect K\cdot\vect a - \kappa z}$
twice shows that $\kappa^2 - K^2$ is the factor that the Laplacian brings to it, and it vanishes on the cone.[^half] For
a scene of bounded depth, the values at every $\kappa > K$ fix the depth profile of the ripple $\vect K$, because a
Laplace transform known on an interval can be undone (stated here without proof).

{{paper fig:two-readings}}

The null space has the same shape here. The argument for the null space above, with
$e^{i\vect K\cdot\vect a - \kappa z}$ in place of $e^{i\vect\xi\cdot\vect x}$, gives a null density the transform
$(\kappa^2 - K^2)\tilde\psi/4\pi G$. It is zero on the cone whatever $\field\psi$ is, and inside the cone it is
$\tilde\psi$ times a factor that is not zero there, which the second reading holds.

For a check, take a point mass $\matter m$ at depth $z_0$ below the origin. Then $Q(\vect k) = \matter me^{-|\vect
k|z_0}$, and the second reading is $\matter m(|\vect k||\vect k'| - \vect k\cdot\vect k')e^{-\kappa z_0}$, which is
$\tfrac12(\kappa^2 - K^2)\matter{\tilde\rho}$ at once. For $\vect k = (1.3, 0.4)$ and
$\vect k' = (-0.2, 0.9)\unit{m^{-1}}$, $K = 1.70$ and $\kappa = 2.28\unit{m^{-1}}$, and the factor is
$1.154\unit{m^{-2}}$ by either side. The first line is Parker's formula, with which geophysicists compute the field
of buried mass from its transform [@Parker1973].[^slice]

## Every point inside the cone is reached by an ellipse of pairs of tides

We fix a point $(\vect K, \kappa)$ inside the cone and want every pair of tides that reaches it. The pairs have
$\vect k' = \vect K - \vect k$, so they satisfy

$$|\vect k| + |\vect K - \vect k| = \kappa .$$

The distances from $\vect k$ to the two points $0$ and $\vect K$ add up to $\kappa$. A loop of string pinned at two
points and pulled taut by a pencil draws the curve of a fixed sum of distances: an **ellipse**, with the pins as its
foci. Here the foci are $0$ and $\vect K$, each $K/2$ from the centre $\vect K/2$. At an end of the long axis the
distances to the two foci are the semi-major axis plus $K/2$ and the semi-major axis minus $K/2$, so their sum,
$\kappa$, is twice the semi-major axis. An end of the short axis is equally far from both foci, so each distance is
$\kappa/2$, and Pythagoras's theorem gives

$$\text{semi-major axis} = \frac\kappa2, \qquad \text{semi-minor axis} = \tfrac12\sqrt{\kappa^2 - K^2} .$$

On the cone the semi-minor axis is zero, and the ellipse shrinks to the segment from $0$ to $\vect K$: both tides point
along $\vect K$. Every pair on the ellipse gives the same number. A pair's second reading is the bracket of the first
section, which equals the integral on the left of the paper's [](/paper/#eq:cone) because the forces inside do not
depend on velocity, and the right side depends only on $(\vect K, \kappa)$. For the pair of the last section the
semi-axes are 1.14 and $0.760\unit{m^{-1}}$, so the long axis is 1.5 times the short one.[^optical]

<!-- diagram: tut-cone-ellipse — spec: two panels. Left: the plane of wavevectors across the camera, axes k_x and k_y
in m⁻¹, the foci 0 and K = (1.1, 1.3) as dots, the ellipse |k| + |K − k| = 2.28 drawn exactly (semi-axes 1.141 and
0.760, long axis along K), and two pairs drawn as arrows from the origin: k = (1.3, 0.4) with k' = K − k from the tip of
k to K, and one other pair (pale) at another point of the ellipse. Right: the half-plane (K, κ) with κ upward, the
cone's line κ = K (blue outline, as fig:two-readings), the region above it shaded faint orange, the point
(1.70, 2.28) marked, and on the cone's line the point (1.70, 1.70) with a short note "the ellipse becomes a segment".
Caption: "Look first at the ellipse on the left: every wavevector k on it, paired with K − k, reaches the same point of
the transform, marked on the right inside the cone. On the cone itself the ellipse shrinks to the segment from 0 to K.
The two pairs drawn are examples." -->

## Fine detail still costs exponentially: the two readings remove the ambiguity and keep the blur

We estimate the precision that a detail of size $2\pi/|\vect\xi|$ needs. The modulus of $h_\pm$ comes from the real part
of its exponent alone:

$$|h_\pm| = e^{\pm\vect\eta\cdot\vect x/2} .$$

Across a body of radius $R$ about the origin, $|\vect\eta\cdot\vect x| \le |\vect\eta|R = |\vect\xi|R$, so each
profile grows to $\boxed{\,|h_\pm| \le e^{|\vect\xi|R/2}\,}$, and from one side of the body to the other it spans the
factor $e^{|\vect\xi|R}$. Their product is a ripple of modulus one. Each square $A(f)$ of the sixteen weighings is
dominated by the side where its profile is largest, while their combination is of the size of the ripple. So the
reading is a small difference of large numbers, and it needs a relative precision of about $e^{-|\vect\xi|R}$. The
camera must also build the profiles from multipoles, which reach a camera at the radius $R_c$ weakened by
$(R/R_c)^\ell$ at each degree $\ell$ (chapter 2.3). We do not size that cost here, so the spans below are only part of
the price.

For the steel ball one metre across, of chapter 13.1, $R = 0.5\unit m$. Detail of 20 cm, 10 cm and 5 cm needs spans of
$6.6 \times 10^6$, $4.4 \times 10^{13}$ and $1.9 \times 10^{27}$. The best clocks compare frequencies to about one part
in $10^{18}$, so detail finer than about 8 cm is out of reach of any precision now known, even before the weighing's own
smallness. This is the fade of chapter
[2.7](/tutorial/outside/evanescent/#undoing-the-fade-multiplies-the-noise) and the paper's
[](/paper/#eq:evanescent) once more.

The flat camera shows the same law in depth. This step is a sketch at depth B. A mass $\matter m$ at depth $z$ adds
$\tfrac12(\kappa^2 - K^2)\matter me^{-\kappa z}$ to the second reading, so at one ripple $\vect K$ the second reading,
as a function of $\kappa$, is a Laplace transform of the depth profile. In chapter 3.7 the ripples of a Fourier
transform fell as $e^{-kz}$ and were kept up to the cut-off $kz = \sym{cutoff}{q_c}$, the larger root of
$q_ce^{-q_c} = 1/\pi\SNR$, with $\sym{snr}{\SNR}$ the camera's signal-to-noise ratio. The blur across the plane was
$4.43\,z/q_c$, which is 43 cm for a mass 1 m deep at $\SNR = 10^3$, where $q_c = 10.4$. Undoing a Laplace transform
costs more, because the falling exponentials of two nearby depths differ far less than two ripples do. The standard
result is a width in depth $\Delta z$, in metres, of about

$$\Delta z \approx \frac{6\,z}{\ln\SNR}$$

for the picture of a point at half its height. For a mass 1 m deep this is 0.87 m at $\SNR = 10^3$ and 0.43 m at
$10^6$, and direct numerical inversions give 0.8 to 1 m and 0.4 to 0.5 m, depending on the model of the noise. So
depth is read about twice as coarsely as position across the plane, and a thousand times the sensitivity buys about a
factor of two. The width grows as $z/\ln\SNR$: this is the blur law again.

::: gap
The sketch skips two calculations. The first is the cost of undoing a Laplace transform. In the variable $\ln z$ the
transform becomes a blur, which weakens a ripple $z^{-1/2}e^{i\omega\ln z}$ of the depth profile, of angular frequency
$\omega$ in $\ln z$, by $1/\sqrt{\cosh\pi\omega}$, about $\sqrt2\,e^{-\pi\omega/2}$ (J. G. McWhirter and E. R. Pike,
*J. Phys. A* **11** (1978) 1729). These ripples stand above the noise up to $\omega \approx (2/\pi)\ln\SNR$, and a
picture built from them is $3.8/\omega$ wide in $\ln z$ at half its height, which gives the $6/\ln\SNR$ above. The
second is the full noise calculation. The sketch treats each point inside the cone as read alone, and it skips the
factor $\tfrac12(\kappa^2 - K^2)$, which is small near the cone, and the way the many pairs of the ellipse share the
noise.
:::

Mathematicians know this cost in Calderón's problem. For conductivities whose smoothness is bounded beforehand, the
error in the conductivity is at most a constant times a negative power of $\ln\SNR$, where $\SNR$ is now the ratio of
the data to their error [@Alessandrini1988]. This is called **logarithmic stability**: squaring the precision of the
data, from $\SNR$ to $\SNR^2$, improves the result only by a fixed factor. Mandache showed that no method can do better
than this, apart from the power [@Mandache2001]. Both are stated here without proof, as Uhlmann's review states them.
The spans above show the reason: a relative precision of $1/\SNR$ reaches $|\vect\xi| \approx \ln\SNR/R$. A check is in
the numbers, since $6.6 \times 10^6$ squared is $4.4 \times 10^{13}$: squaring the precision halves the finest detail,
from 20 to 10 cm. In the paper's words, "Readings at two times remove the ambiguity and keep the blur."

<!-- diagram: tut-detail-cost — spec: log–log axes; horizontal, the detail 2π/|ξ| from 2 cm to 1 m (decreasing to the
right is NOT used: increasing to the right, as usual); vertical, the span e^{|ξ|R} from 1 to 10^40, for R = 0.5 m,
drawn as one exact curve. Three marked points at 20, 10 and 5 cm with their values 6.6 × 10⁶, 4.4 × 10¹³ and
1.9 × 10²⁷ beside them (labels off the curve), and one faint horizontal line at 10¹⁸ labelled "best clocks". Neutral
stroke; no colour roles. Caption: "Look first at the three marked points: halving the size of the detail squares the
precision a second reading needs. The faint line is the best fractional precision of today's clocks, for comparison.
The ball is the steel ball one metre across." -->

## The bits of a second reading grow as the fourth power of the logarithm

We want the bits that a second reading holds, by chapter 3.8's rule. Let a mass be held for an instant (chapter 13.1)
at points anywhere outside a sphere of radius $R_c$ about a body of radius $R$, at many distances. Chapter 13.3
shows that the energies it leaves hold the moment of the density against every polynomial in $x$, $y$ and $z$, and we
use that result here. A product of $n$ coordinates is fixed by how many of its factors are $x$, $y$ and $z$. With no
$x$ there are $n + 1$ ways to share the factors between $y$ and $z$, with one $x$ there are $n$, and so on, so there
are $(n + 1) + n + \dots + 1 = (n + 1)(n + 2)/2$ products of degree $n$, about $n^2/2$, against the $2n + 1$
harmonic ones of the first reading
([2.2](/tutorial/outside/spherical-harmonics/#there-are-2ell-1-patterns-of-each-degree)). For $n = 2$ there are six,
$x^2$, $y^2$, $z^2$, $xy$, $yz$ and $zx$, against five.

We assume, as the paper does, that **each moment of degree $n$ reaches the camera weakened by $(R/R_c)^n$** (chapter
2.3). Chapter 3.8's rule then gives each moment $(L - n\Lambda)/\ln2$ bits, with 3.8's pure numbers $L = \ln\SNR$ and
$\Lambda = \ln(R_c/R)$, where $\SNR$ is the second reading's own ratio for its leading term.[^Lambda] Adding the degrees
up to $L/\Lambda$, the bits are

$$H_2 \approx \frac1{\ln2}\sum_{n \le L/\Lambda}\tfrac12(n + 1)(n + 2)\,(L - n\Lambda) .$$

For many degrees we replace the sum by an integral and keep its largest power:
$\int_0^{L/\Lambda}\tfrac12n^2(L - n\Lambda)\,\dd n = \tfrac12\bigl(\tfrac13 - \tfrac14\bigr)L^4/\Lambda^3$. So

$$\boxed{\;H_2 \approx \frac{L^4}{24\,\Lambda^3\ln2} ,\;}$$

against the leading term $L^3/(3\Lambda^2\ln2)$ of the paper's [](/paper/#eq:hair-bits). About $n^2/2$ numbers of each
degree, in place of $2n$, bring one more power of the readable degree $L/\Lambda$.

From three radii, $\Lambda = \ln3 = 1.10$. At $\SNR = 10^6$ the sum runs to degree 12 and gives 2580 bits, against the
first reading's 1200. The boxed term gives only 1650 there, because twelve degrees are too few for an integral. It is
a guide only when many degrees are read, as at $10^{70}$, where it gives $3.06 \times 10^7$ against the sum's
$3.19 \times 10^7$ and the first reading's $1.7 \times 10^6$. The sum is an upper bound, because it reads each moment
as if it were alone. In one angular pattern, moments of different degree give signals that fall off with the held
mass's distance in nearly the same way, so telling them apart has a price. The paper's 1300 bits at $10^6$ and
$9.6 \times 10^6$ at $10^{70}$ include it.[^bits] With the held mass on a single sphere they cannot be told apart at
all, and the second reading gives only as many numbers as the first (chapter 13.3). If a passing tonne makes the second
reading of the steel ball, its ratio is $4.6 \times 10^{-17}$ times the first's (chapter 13.1). A first reading at
$10^6$ then leaves nothing of the second to count, and one at $10^{70}$ leaves $4.6 \times 10^{53}$, for which the sum
gives $1.1 \times 10^7$ bits.

{{paper fig:hair}}

Panel (b) of the figure shows the first reading's 169 beads at $10^6$, up to degree twelve. The second reading up to the
same degree has 455 moments, the sum of $(n + 1)(n + 2)/2$ from $n = 0$ to 12.

<!-- try: two-readings — new (P7a-DECISIONS item 9). Predict first: "Two tides with the same wavevector direction are
applied in turn. Where does their second reading land, on the cone or inside it?" (Answer, revealed after: on the cone,
where a second reading holds nothing that the first does not, because parallel k and k' give κ = K.)
Left panel: the camera's plane of wavevectors, axes k_x, k_y from −3 to 3 m⁻¹. Two draggable arrows from the origin,
k (default (1.3, 0.4)) and k' (default (−0.2, 0.9)), their sum K drawn from the origin, and the ellipse of all pairs
|k| + |K − k| = |k| + |k'|, foci 0 and K, drawn live. Keyboard: Tab moves between the two arrow tips; arrow keys move
the focused tip by 0.05 m⁻¹ (Shift: 0.25).
Right panel: the half-plane (K, κ), K from 0 to 6 and κ from 0 to 6 m⁻¹, the cone's line κ = K (blue outline), the
point (|k + k'|, |k| + |k'|) as a dot, and under it a heat map of the size of the chosen scene's second reading,
½(κ² − K²)|ρ̃(K, κ)| in kg m⁻², with ρ̃ taken at |K| along K's direction, shaded only where it stands above a noise
floor set by a slider "Signal-to-noise" (10 to 10⁶, logarithmic, default 10³): the floor is the largest value of the
chosen scene's map over the panel divided by the slider's value.
Scene menu: "A point mass" (m = 100 kg at depth z₀, slider 0.5 to 3 m, default 1 m; ρ̃ = m e^{−κz₀}); "A nugget minus
its flush" (a null-space density, built as ∇²ψ/4πG with ψ a smooth bump confined to a ball of radius 0.5 m at depth
1 m, ψ = ψ₀(1 − r²/a²)³ inside; its transform (κ² − K²)ψ̃/4πG computed by quadrature in a worker).
Readouts: K, κ, the semi-axes κ/2 and ½√(κ² − K²), the second reading at the dot, and "above the noise" or "below the
noise".
Checks: at the defaults the readouts are K = 1.70, κ = 2.28 m⁻¹, semi-axes 1.14 and 0.760 m⁻¹, factor ½(κ² − K²) =
1.154 m⁻²; making k' parallel to k puts the dot on the cone's line and the semi-minor axis at 0; for the point mass at
z₀ = 2 m with k = (1, 0) and k' = (0, 1), the reading is 1.83 kg m⁻²; the null-space scene is dark along the cone
(exactly zero there) and bright inside; raising the slider tenfold moves the readable edge of the point mass's map
outward by about ln 10/z₀ in κ (2.3 m⁻¹ at z₀ = 1 m).
Both themes (the paper's palette, swapped per theme); phone: the two panels stacked, left above right, the arrows
draggable by touch. Stand-in until it is built: the paper's static fig:two-readings in section 6, and the registered
fading-ripple below for section 8. -->

::: try {#fading-ripple}
This figure stands in for the cost of fine detail. Predict first: if the crests of a ripple of density come
twice as close together, how much more precisely must the camera read to see it from the same height? The figure opens
on a ripple with crests 10 cm apart, read from 10 cm above. Halve the spacing of the crests and watch how much the
field fades: the factor is squared, as the spans of a second reading are. Then halve the height as well, and see that
only the product of the wavenumber and the height matters.
:::

::: check
### Q

Why is $e^{i\vect\xi\cdot\vect x}$ not harmonic, and how can harmonic tides still read it?

### A

Its Laplacian is $-|\vect\xi|^2$ times itself. It is the product of $e^{\vect\zeta_+\cdot\vect x}$ and
$e^{\vect\zeta_-\cdot\vect x}$, both harmonic, and the product of their gradients carries it, times $-\tfrac12
|\vect\xi|^2$.

### Q

How many weighings does one complex Fourier component of the density need, and where does each factor of two come
from?

### A

Sixteen. The real and imaginary parts give four real integrals; each needs two squares by the polarization identity;
each square needs two copies kicked both ways.

### Q

In the paper's Figure [](/paper/#fig:two-readings), where does a reading at one time lie, and where is a null-space
density invisible?

### A

Both on the cone $\kappa = K$. The first reading holds the transform only there, and a null density's transform,
$(\kappa^2 - K^2)\tilde\psi/4\pi G$, is zero there whatever $\field\psi$ is, because its factor $\kappa^2 - K^2$
vanishes on the cone and nowhere inside it.

### Q

For the steel ball of radius 0.5 m, by what factor do the two exponentials span the ball when they read detail of 10 cm?

### A

$|\vect\xi| = 2\pi/0.1 = 62.8\unit{m^{-1}}$, so $e^{|\vect\xi|R} = e^{31.4} = 4.4 \times 10^{13}$.
:::

**The idea to keep: two harmonic exponentials whose exponents are null vectors multiply into any ripple, so readings at
two times give the Fourier transform of the density, and in Newton's gravity Calderón's argument is exact. A flat camera
reads that transform on a cone at one time and inside it at two. The ambiguity is gone but the blur is not: resolution
grows only as the logarithm of the sensitivity, and the bits as its fourth power.**

::: problems
### Practice

A point mass of 100 kg lies 2 m below the origin of a flat camera. For $\vect k = (1, 0)$ and
$\vect k' = (0, 1)\unit{m^{-1}}$, find $Q(\vect k)$, the point $(K, \kappa)$, the second reading and the semi-axes of
the ellipse.

::: solution
$Q(\vect k) = 100\,e^{-2} = 13.5\unit{kg}$. $K = \sqrt2 = 1.41$ and $\kappa = 2\unit{m^{-1}}$. The second reading is
$\tfrac12(4 - 2) \times 100\,e^{-4} = 1.83\unit{kg\,m^{-2}}$. The semi-axes are 1 and $\tfrac12\sqrt2 =
0.71\unit{m^{-1}}$.
:::

### Stretch

With chapter 2.1, show that a null-space density $\nabla^2\field\psi/4\pi G$ has the scene transform
$(\kappa^2 - K^2)\tilde\psi/4\pi G$, and that its second reading at $(\vect K, \kappa)$ is
$\tfrac12(\kappa^2 - K^2)^2\tilde\psi/4\pi G$.

::: solution
Green's second identity moves the Laplacian onto $e^{i\vect K\cdot\vect a - \kappa z}$, whose Laplacian is
$(\kappa^2 - K^2)$ times itself. Because $\field\psi$ is confined, there are no surface terms. The paper's
[](/paper/#eq:cone) multiplies the transform by $\tfrac12(\kappa^2 - K^2)$.
:::

### The paper

Derive the paper's [](/paper/#eq:calderon) from the null vectors $\vect\zeta_\pm$, then both lines of the paper's
[](/paper/#eq:cone), and show that the sixteen weighings of
[*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing) give one Fourier component.

::: solution
The key steps are $\vect\zeta_+\cdot\vect\zeta_- = -\tfrac12|\vect\xi|^2$,
$|\vect k||\vect k'| - \vect k\cdot\vect k' = \tfrac12(\kappa^2 - K^2)$, and the polarization identity applied to the
four real integrals.
:::
:::

::: paper
- [*The field at two times*](/paper/#par:the-field-at-two-times) (Section XIII): the paper's equations
  [](/paper/#eq:hair-commutator) and [](/paper/#eq:calderon), Calderón's argument, and the null space as "a property of
  a reading at one time, not of gravity".
- [*The two readings as one transform*](/paper/#par:the-two-readings-as-one-transform): the paper's equations
  [](/paper/#eq:scene-transform) and [](/paper/#eq:cone), the cone, the ellipse, Parker and optical tomography, with
  Figure [](/paper/#fig:two-readings).
- [*Stability*](/paper/#par:stability): the spans $e^{|\vect\xi|R}$, Alessandrini and Mandache.
- [*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing): the sixteen weighings.
- [*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading): the fourth power of $\ln\SNR$.
:::

::: deeper
- A. P. Calderón, "On an inverse boundary value problem" (1980, reprinted 2006) [@Calderon1980]: a few pages, with
  these exponentials.
- G. Uhlmann, "Electrical impedance tomography and Calderón's problem", *Inverse Problems* **25** (2009) 123011: the
  problem, its history and its stability, for a reader who wants the mathematics.
- J. L. Mueller and S. Siltanen, *Linear and Nonlinear Inverse Problems with Practical Applications* (SIAM, 2012): why
  the linearized problem is ill-posed, with code.
- R. L. Parker, "The rapid calculation of potential anomalies" (1973) [@Parker1973]: the first line of the paper's
  [](/paper/#eq:cone) as geophysicists use it.
- The GR course has no section on inverse problems. Its lesson
  [*Poisson from a flux*](https://neovand.github.io/general-relativity/chapter-12.html#poisson-from-a-flux) derives the
  Laplacian on which this chapter rests.
:::

[^four]: Chapter
    [R4](/tutorial/response/reading-section-iv-3/#one-integral-of-the-density-is-a-bracket-a-thermal-average-the-weight-of-a-response-and-the-answer-of-dust)
    reads the same integral four ways: the bracket over $i\hbar$, the tremor over $\kB T$, the weight of the response to
    a tide, and the answer of dust, the paper's [](/paper/#eq:dust).

[^letters]: Here $\vect\xi$ is not the separation $\xi^i$ of two free particles of chapter 1.4, nor chapter 12.1's
    Lane–Emden $\xi$. $\vect\eta$ is not the rapidity, the viscosity or $\eta_{\mu\nu}$, and $\vect\zeta_\pm$ is not
    chapter 7.4's $\zeta^\mu$.

[^push]: This needs a known push between the two times: an applied tide, or heat at a known temperature. A cold body
    at rest with nothing applied has $\matter{\dot Q_g} = 0$, so a second reading of its field repeats the first.

[^checks]: For thirty point masses at random in a ball of radius 0.5 m, the two sides of the boxed equation agree to
    rounding error, and so do sixteen simulated weighings of the same masses, moving, with $\epsilon = 10^{-3}$. For
    thirty masses buried 0.5 to 3 m deep, both lines of the paper's [](/paper/#eq:cone) hold to rounding error for five
    pairs on one ellipse. The paper's reference code makes the first two checks on its own random bodies
    (`calderon_vectors` and `density_from_weighings` in `reference/gravcam/hair.py`, tested in
    `reference/tests/test_hair.py`).

[^sigma]: This $\sigma$ is local to this section and neutral in colour. Elsewhere a bare $\sigma$ in the colour of
    matter is a surface density, and a standard deviation always carries a subscript.

[^rungs]: Chapter 13.3 shows, rung by rung, which tides see which part of the null space.

[^half]: The paper's "multiplied by half of $\kappa^2 - K^2$, which is the Laplacian in these variables" can be misread:
    the Laplacian brings $\kappa^2 - K^2$, and the second reading carries half of it.

[^slice]: Chapter 13.1 found that passes along one direction read the three-dimensional transform on a plane of
    wavevectors through the origin. A flat camera reads its own transform on the cone, and inside it.

[^optical]: Optical diffusion tomography in a half space has the same relation, with a light source and a detector in
    place of the two tides, and averages the pairs of one point [@MarkelSchotland2001]. It has no reading without a
    source, and so no cone.

[^Lambda]: This $\Lambda$ is chapter 3.8's logarithm, not the projector of Part 7. The paper writes $H$ for the
    first reading's bits, which chapter 3.8 called $C_{\rm body}$; $H_2$ is the second reading's.

[^bits]: The paper prints these numbers beside the rule that gives the sum above, without saying that they include
    this price.
