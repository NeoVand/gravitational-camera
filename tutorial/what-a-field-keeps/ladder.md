---
id: '13.3'
title: 'The ladder of tides: polyharmonic functions'
question: 'A body is kicked by the tides of distant masses, which are quadrupolar. What exactly do such tides read of the inside, what does a nearer mass add, and why can no tide of a given degree reach beyond a fixed set of moments, whatever is read afterwards?'
part: '13'
requires: ['1.3', '1.5b', '1.7', '1.8', '2.1', '2.2', '2.3', '2.5', '13.1', '13.2']
paper: [sec:second-order, eq:ladder, eq:ladder-identity, app:proofs, eq:proof-ladder, fig:ladder, tab:hair, eq:push, eq:cone]
figures: [fig:ladder]
live: [push-and-weigh]
depth: A
---

Figure [](/paper/#fig:ladder) sets two bodies side by side. Here $\sym{mass}{\matter M}$ is a mass in kilograms and $R$
a radius in metres. Body A is a thin shell of mass $\matter M$ and radius $R/\sqrt2$. Body B holds half of that mass at
its centre and half on a thin shell of radius $R$. By the shell theorem (section
[1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)) the two pull alike outside $R$.
They are the bodies of section 13.1, where a passing tonne left 30 per cent more energy in B than in A.

A brief quadrupolar tide, the stretch and squeeze of a distant mass, leaves the same energy in both, so their bars in
panel (a) are equal. A brief octupolar tide, the lopsided part that a nearer mass adds, leaves twice as much in B. Why
can no tide of a given degree reach beyond a fixed set of moments, whatever is read afterwards?[^first]

{{paper fig:ladder}}

::: plain
A distant mass stretches a body along the line towards it and squeezes it across that line: this is its tide. A nearer
mass adds finer patterns, with more lobes round the body. A brief tide kicks every part of the body, and the energy
gained adds up its pieces, each weighted by the square of its kick.

For a round body, the coarsest tide weights each piece by the square of its distance from the centre, and each finer
pattern by a higher power: the fourth, the sixth, and so on. These powers are the rungs of a ladder, and no tide
reaches above its own. So no distant mass can tell apart two round bodies of the same mass that agree in the average
square distance of their mass. A mass held near the body for an instant makes every pattern at once, so it reaches
every rung.
:::

## Inside a body, a tide is a sum of harmonic polynomials of rising degree

We want the shape that a tide from outside takes inside a body, since it decides what the kicks weigh. Take one mass $\sym{passing-mass}{\matter\mu}$, in kilograms, at the point $\vect y$, and let $s = |\vect y|$ be its
distance in metres from an origin at the body's centre. Let $\vect x$ be a point of the body at the distance
$r = |\vect x|$, and $\gamma$ the angle between $\vect x$ and $\vect y$. We assume that **every point of the body is
nearer the centre than the mass is**, $r < s$. The interior expansion of section
[2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics), with the
Legendre polynomials $\sym{legendre}{P_\ell}$ of section 2.2, gives the potential in joules per kilogram:

$$\begin{aligned}
\field\Phi(\vect x) &= -\frac{G\matter\mu}{|\vect x - \vect y|}\\
&= -\frac{G\matter\mu}{s}\sum_{\ell=0}^{\infty}\Bigl(\frac{r}{s}\Bigr)^\ell P_\ell(\cos\gamma) .
\end{aligned}$$

Each term $r^\ell P_\ell(\cos\gamma)$ is $r^\ell$ times a pattern of degree $\sym{degree}{\ell}$, so it is a **harmonic
polynomial** of degree $\ell$ in $x$, $y$ and $z$: a polynomial whose Laplacian is zero (the solid harmonic of section
2.2). Degree 0 is a constant and pushes nothing. Degree 1 is a uniform pull, the recoil of section 13.1. Degree 2 is the **quadrupolar tide**, the first term that deforms the body, and its profile is
a harmonic quadratic. Degree 3 is the **octupolar tide**, whose profile is a harmonic cubic.

The small parameter is $r/s$. Along the line to the mass, where $P_\ell = 1$, the kick of degree $\ell$ is
$(\ell/2)(r/s)^{\ell-2}$ times the quadrupolar one. For section 13.1's steel ball, of radius 0.5 m, and a mass 1.5 m
from its centre, $r/s$ is a third at the surface. There the octupolar kick is half the quadrupolar one, and the kick of
degree four two ninths: each degree adds about a factor $r/s$. So a distant mass makes a tide of degree two, and
finer tides need masses close by; the series fails only when the mass touches the body.

A **tide of degree $m$** is an impulsive tide (section 1.7), with the potential $-\epsilon\,g(\vect x)\,\delta(t)$ and
the strength $\sym{impulse-strength}{\epsilon}$, whose profile $g$ is a harmonic polynomial of degree at most
$\sym{tide-degree}{m}$, a whole number. So $\tfrac12(x^2 - y^2)$ is a tide of degree two, while the profile
$1/|\vect x - \vect y|$ of a mass at $\vect y$ has terms of every degree and no finite degree.

## Polynomials killed by repeated Laplacians are harmonic ones times even powers of the radius

We want the polynomials that $m$ Laplacians make zero, because a tide of degree $m$ weighs the density against such
polynomials only (see [below](#no-tide-reaches-beyond-the-rungs-below-its-degree-whatever-is-read)). We write $\nabla^{2m}$ for the Laplacian taken $m$ times, not a derivative of
order $2m$. A polynomial $P$ in $x$, $y$ and $z$ is **polyharmonic of order $m$** if $\nabla^{2m}P = 0$. Order one is
harmonic, and order two is called **biharmonic**. For an example, section 2.2's rule $\nabla^2r^n = n(n + 1)\,r^{n-2}$ gives $\nabla^2r^2 = 6$
and $\nabla^4r^2 = 0$, so $r^2$ is biharmonic but not harmonic. For a non-example, $\nabla^2r^4 = 20r^2$ and
$\nabla^4r^4 = 120$.

We want the Laplacian of $r^{2j}H_\ell$, because products of this kind build every polynomial. A polynomial is
**homogeneous** of degree $\ell$ when all its terms have the degree $\ell$. We assume that
**$\sym{harmonic-polynomial}{H_\ell}$ is a homogeneous harmonic polynomial of degree $\ell$**, $r^\ell Y_\ell$ in the
words of section 2.2, with $Y_\ell$ a pattern of degree $\ell$ on the sphere,[^H] and that **$j$ is a whole number**.
The product rule of section 2.1 gives

$$\begin{aligned}
\nabla^2\bigl(r^{2j}H_\ell\bigr) &= H_\ell\,\nabla^2r^{2j} + 2\,\nabla r^{2j}\cdot\nabla H_\ell\\
&\quad + r^{2j}\,\nabla^2H_\ell .
\end{aligned}$$

The last term is zero. In the first, the rule of section 2.2 with $n = 2j$ gives $\nabla^2r^{2j} = 2j(2j + 1)\,r^{2j-2}$.
In the middle one, the gradient of $r^{2j}$ is $2j\,r^{2j-2}\,\vect x$, so we need $\vect x\cdot\nabla H_\ell$.

Homogeneity means that $H_\ell(\lambda\vect x) = \lambda^\ell H_\ell(\vect x)$ for every number $\lambda$. We
differentiate both sides with respect to $\lambda$, by the chain rule, and set $\lambda = 1$:

$$\vect x\cdot\nabla H_\ell = \ell\,H_\ell .$$

This is **Euler's relation**. For $H_2 = x^2 - y^2$ the left side is $x \cdot 2x - y \cdot 2y$, twice $H_2$. The
middle term is therefore $4j\ell\,r^{2j-2}H_\ell$, and $2j(2j + 1) + 4j\ell = 2j(2\ell + 2j + 1)$:

$$\boxed{\;\nabla^2\bigl(r^{2j}H_\ell\bigr) = 2j\,(2\ell + 2j + 1)\,r^{2j-2}H_\ell .\;}$$

The factor is a pure number, so both sides have the unit of $r^{2j}H_\ell$ divided by a square metre. For a check,
$j = 1$ and $H_0 = 1$ give 6, which is $\nabla^2r^2$. For a number, $j = 1$ and $H_2 = x^2 - y^2$ give
$\nabla^2[r^2(x^2 - y^2)] = 14(x^2 - y^2)$.

So each Laplacian lowers the power of $r$ by two, with a factor that is zero only when $j = 0$ (Figure
[](#fig:ladder-laplacians)). After $j$ Laplacians a nonzero multiple of $H_\ell$ remains, and one more gives zero:
$r^{2j}H_\ell$ is polyharmonic of order exactly $j + 1$.

![Look first at the two zeros at the bottom. On the left, each Laplacian lowers the power of $r$ by two and multiplies
by a number, until $r^4H_2$ is gone after three steps. On the right, each Laplacian adds one derivative to each factor
of $\nabla h\cdot\nabla g$, until the derivatives of a cubic tide run
out.](tut-ladder-laplacians){#fig:ladder-laplacians}

Section 13.2 counted $(n + 1)(n + 2)/2$ monomials $x^ay^bz^c$ of degree $a + b + c = n$, and the counts at degrees $n$
and $n - 2$ differ by $2n + 1$, section 2.2's count of the $H_n$. So the products $r^{2j}H_{n-2j}$, of which a given
$j$ gives $2(n - 2j) + 1$, are as many as the monomials: at degree four, $9 + 5 + 1 = 15$.

The products are also independent. In a sum $H_n + r^2H_{n-2} + r^4H_{n-4} + \cdots$ with a nonzero term, let
$r^{2J}H_{n-2J}$ be the nonzero term with the highest power of $r$. Then $J$ Laplacians kill every term with a lower
power and turn this one into a nonzero multiple of $H_{n-2J}$, so the sum is not zero. Independent and as many as the
monomials, the products form a basis, and every homogeneous polynomial of degree $n$ splits in exactly one way as

$$P = H_n + r^2H_{n-2} + r^4H_{n-4} + \cdots ,$$

the **Fischer decomposition**: for example, $x^2 = \tfrac13(2x^2 - y^2 - z^2) + \tfrac13r^2$.

Now we apply $m$ Laplacians to the split. The terms with $j < m$ vanish, and those with $j \ge m$ become nonzero
multiples of $r^{2(j-m)}H_{n-2j}$, which are independent by the same argument. So, degree by degree,

$$\boxed{\;\nabla^{2m}P = 0 \quad\text{exactly when}\quad P = \sum_{j<m}r^{2j}H_{n-2j} .\;} \label{eq:ladder-polys}$$

At degree four the biharmonic polynomials fill $9 + 5 = 14$ of the 15 dimensions of all quartics; the split's $r^4$
term is missing. For any function the same statement is **Almansi's theorem**, which we state
without proof: every solution of $\nabla^{2m}f = 0$ in a ball about the origin is $\sum_{j<m}r^{2j}f_j$ with each
$f_j$ harmonic.[^almansi]

A tide **reaches** the moment $\int\matter\rho\,P\,\dd V$ of the density $\sym{density}{\matter\rho}$ when $P$ is a sum
of harmonic polynomials and of the functions $\nabla h\cdot\nabla g$ that the next section finds in the data, so that
the data fix that moment to leading order in $\epsilon$. A tide of degree $m$ reaches exactly the polynomials of
equation [](#eq:ladder-polys). Their moments are the **radial moments** $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$,
against $r^{2j}H_\ell$ with $j < m$, and $j$ is the moment's **rung**: a row of beads in panel (b) of Figure
[](/paper/#fig:ladder). A reading at one time holds the rung $j = 0$ alone, the multipole moments of section 2.3
(Figure [](#fig:ladder-rungs)).

![Look first at the bands: each degree $m$ of tide adds one floor, one more power of $r^2$, to every column of angular
patterns. The bead in the colour of matter, $\int\matter\rho\,r^4$, is the first at which the two bodies of the opening
differ. The dashed diagonals collect the moments that a held mass reaches at one power of its distance. The number of
beads in a cell is exact; the spacing is chosen for the drawing.](tut-ladder-rungs){#fig:ladder-rungs}

## No tide reaches beyond the rungs below its degree, whatever is read

We want what a tide of degree $m$ can reach. After the tide $g$, the data hold the density (sections 13.1 and 13.2)
only through $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$, to leading order in $\epsilon$. A weighing holds it with
$h = g$. A later reading of a moment $\sym{mass-moment}{\matter{Q_h}} = \int\matter\rho\,h\,\dd V$, with $h$
harmonic, holds it as the jump $\epsilon\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ in its rate of change. So we
want $\nabla^{2m}(\nabla h\cdot\nabla g)$, and we assume that **$h$ and $g$ are harmonic**.

We write the dot product with summed indices, $\partial_ih\,\partial_ig$, and use the product rule of section 2.1:

$$\begin{aligned}
\nabla^2\bigl(\partial_ih\,\partial_ig\bigr) &= (\nabla^2\partial_ih)\,\partial_ig\\
&\quad + 2\,\partial_k\partial_ih\,\partial_k\partial_ig + \partial_ih\,(\nabla^2\partial_ig) .
\end{aligned}$$

Derivatives can be taken in either order, so $\nabla^2\partial_ih = \partial_i\nabla^2h = 0$, and the same holds for
$g$. Only the middle term is left:

$$\nabla^2(\nabla h\cdot\nabla g) = 2\,\partial_i\partial_kh\,\partial_i\partial_kg .$$

The right side has the same form, with each derivative harmonic. So each further Laplacian adds one derivative to each factor and a factor 2, and $m$ steps give

$$\nabla^{2m}(\nabla h\cdot\nabla g) = 2^m\,(\partial_{i_1}\!\cdots\partial_{i_{m+1}}h)\,(\partial_{i_1}\!\cdots\partial_{i_{m+1}}g) . \label{eq:ladder-identity}$$

If $g$ has degree $m$ or less, its derivatives of order $m + 1$ are zero, and so is the left side. So $m$ Laplacians
kill every $\nabla h\cdot\nabla g$, whatever harmonic $h$ is read, because any $h$ harmonic in the ball is a sum of
harmonic polynomials (section 2.3). The moments that a tide of degree $m$ reaches all satisfy equation
[](#eq:ladder-polys), to leading order in the tide's strength.

For a check, a uniform tide ($m = 1$) has a constant gradient $\vect c$, and $\nabla h\cdot\vect c$ is harmonic: a
uniform push reads nothing beyond the field at one time. For a number, read
$h = \tfrac13(x^3 - 3xy^2)$ after the quadrupolar tide $g = \tfrac12(x^2 - y^2)$. Then
$\nabla h\cdot\nabla g = x^3 + xy^2$, whose Laplacian is $8x$, as the identity's right side,
$2(2x \cdot 1 + (-2x)(-1))$, gives. A second Laplacian gives zero, because $g$ has degree two. Since $x^3 + xy^2$ is
$\tfrac45r^2x$ plus a harmonic cubic, this reading reaches $\int\matter\rho\,r^2x\,\dd V$, on the rung $j = 1$.

## Every polynomial on the ladder is reached

We want the converse: every polynomial with $\nabla^{2m}P = 0$ is reached by tides of degree up to $m$. A **null
vector** is a complex vector whose dot product with itself, taken without a complex conjugate, is zero (section
[1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero)). Let $\vect a$ and
$\vect b$ be two null vectors, and $p$ and $q$ whole numbers. The gradient of $(\vect a\cdot\vect x)^p$ is
$p(\vect a\cdot\vect x)^{p-1}\vect a$, and its Laplacian is
$p(p - 1)(\vect a\cdot\vect a)(\vect a\cdot\vect x)^{p-2} = 0$. So every power of $\vect a\cdot\vect x$ is harmonic,
and its real and imaginary parts are real tides.

We take the tide $g = (\vect b\cdot\vect x)^q$ and read $h = (\vect a\cdot\vect x)^p$. The dot product of their
gradients gives the first line below. The rule for harmonic $f$ and $g$ in section 2.1, $\nabla^2(fg) = 2\,\nabla f\cdot\nabla g$,
gives the second:

$$\begin{aligned}
\nabla(\vect a\cdot\vect x)^p\cdot\nabla(\vect b\cdot\vect x)^q &= pq\,(\vect a\cdot\vect b)\,(\vect a\cdot\vect x)^{p-1}(\vect b\cdot\vect x)^{q-1},\\
\nabla^2\bigl[(\vect a\cdot\vect x)^p(\vect b\cdot\vect x)^q\bigr] &= 2pq\,(\vect a\cdot\vect b)\,(\vect a\cdot\vect x)^{p-1}(\vect b\cdot\vect x)^{q-1}.
\end{aligned}$$

We choose the powers so that $j$ Laplacians use up the factor $\vect b\cdot\vect x$ and leave
$(\vect a\cdot\vect x)^\ell$: $q = j + 1$ and $p = \ell + j + 1$, with $j < m$. The tide has degree $j + 1 \le m$, and
the product of the gradients is a multiple of $(\vect a\cdot\vect x)^{\ell+j}(\vect b\cdot\vect x)^j$. Each Laplacian
lowers both powers by one and brings a whole number times $\vect a\cdot\vect b$, so $j$ of them leave a nonzero whole number times $(\vect a\cdot\vect b)^{j+1}(\vect a\cdot\vect x)^\ell$. The conjugate
$\vect b = \vect a^*$ is again a null vector, because $\vect a^*\cdot\vect a^*$ is the conjugate of
$\vect a\cdot\vect a$, and $\vect a\cdot\vect a^* = |\vect a|^2 > 0$.

For a number, take $m = 2$, $j = 1$ and $\ell = 0$, with $\vect a = (1, i, 0)$ and $\vect b = (1, -i, 0)$, so that
$\vect a\cdot\vect b = 2$. The tide $(x - iy)^2$ is quadrupolar, the moment read is that of $(x + iy)^2$, and the
product of the gradients is $8(x^2 + y^2)$, whose Laplacian is 32. Since $x^2 + y^2$ is $\tfrac23r^2$ plus a harmonic
quadratic, the quadrupolar tide reaches $\int\matter\rho\,r^2\,\dd V$.

As $\vect a$ runs over the null vectors, the powers $(\vect a\cdot\vect x)^\ell$ give every harmonic polynomial of
degree $\ell$. At $\ell = 2$, $(1, i, 0)$, $(0, 1, i)$ and $(i, 0, 1)$ give $x^2 - y^2$, $2xy$, $y^2 - z^2$, $2yz$,
$z^2 - x^2$ and $2zx$, of which five are independent, the count of section 2.2. The box below proves it at every
degree. So for every $H_\ell$ and every $j < m$, some combination $S$ of products $\nabla h\cdot\nabla g$, with
tides of degree $j + 1$, has $\nabla^{2j}S = H_\ell$. The second box carries this down the ladder.[^rank]

::: derivation
### The powers of null vectors give every harmonic polynomial

We use complex coefficients, since the real and imaginary parts of a complex harmonic polynomial are real harmonic
polynomials. For a polynomial $p$, let $p(\partial)$ be the operator made by putting $\partial_x$, $\partial_y$,
$\partial_z$ in place of $x$, $y$, $z$, and $\bar p$ the polynomial with conjugated coefficients. For two homogeneous
polynomials of degree $\ell$ the **Fischer product** is the number

$$\langle p, q\rangle = \bar p(\partial)\,q .$$

On monomials, $\partial_x^{a}\partial_y^{b}\partial_z^{c}$ applied to $x^{a'}y^{b'}z^{c'}$ of the same degree gives
$a!\,b!\,c!$ if the powers agree and zero otherwise. So $\langle q, q\rangle$ is the sum of $a!\,b!\,c!$ times the
squared modulus of each coefficient of $q$, positive unless $q = 0$. It has three properties that we need.

**It evaluates.** For any vector $\vect v$, $(\vect v\cdot\nabla)^\ell q = \ell!\,q(\vect v)$ when $q$ is homogeneous of
degree $\ell$: by Taylor's rule $q(t\vect v)$ is $\sum_k t^k(\vect v\cdot\nabla)^kq(0)/k!$, it equals $t^\ell q(\vect v)$
by homogeneity, and only the term $k = \ell$ survives. With $p = (\vect a\cdot\vect x)^\ell$, $\bar p(\partial) =
(\bar{\vect a}\cdot\nabla)^\ell$, so

$$\langle(\vect a\cdot\vect x)^\ell, q\rangle = \ell!\,q(\bar{\vect a}) .$$

**It turns $r^2$ into the Laplacian.** The polynomial $r^2 = x^2 + y^2 + z^2$ has real coefficients and becomes the
operator $\nabla^2$, so for $p$ of degree $\ell - 2$, $\langle r^2p, q\rangle = \bar p(\partial)\,\nabla^2q =
\langle p, \nabla^2q\rangle$.

**A polynomial that vanishes on the null cone has the factor $r^2$.** The **null cone** is the set of complex vectors
$\vect z$ with $\vect z\cdot\vect z = 0$. Divide $q$ by $z_1^2 + (z_2^2 + z_3^2)$ as a polynomial in $z_1$, with the
other two as parameters:

$$q = (\vect z\cdot\vect z)\,p + A(z_2, z_3)\,z_1 + B(z_2, z_3) .$$

Where $z_2^2 + z_3^2 \ne 0$, the cone holds the two points $z_1 = \pm w$ with $w^2 = -(z_2^2 + z_3^2)$, $w \ne 0$. If
$q$ vanishes at both, $Aw + B = 0$ and $-Aw + B = 0$, so $A = B = 0$ there. Polynomials that vanish except where
$z_2^2 + z_3^2 = 0$ vanish everywhere, by continuity, so $q = (\vect z\cdot\vect z)\,p$.

**The proof.** Let $q$ be harmonic of degree $\ell$ and Fischer-orthogonal to every $(\vect a\cdot\vect x)^\ell$ with
$\vect a$ null. By the first property $q(\bar{\vect a}) = 0$, and $\bar{\vect a}$ runs over the whole null cone as
$\vect a$ does, so by the third $q = r^2p$. By the second,

$$\langle q, q\rangle = \langle r^2p, q\rangle = \langle p, \nabla^2q\rangle = 0 ,$$

because $q$ is harmonic. So $q = 0$. In the space of harmonic polynomials of degree $\ell$ nothing is at right angles
to all the powers, so the powers span it.

For a check at $\ell = 2$, the harmonic $q = xy$ has $q(1, i, 0) = i \ne 0$, so it is not orthogonal to
$(x - iy)^2$, and indeed $\langle(x - iy)^2, xy\rangle = (\partial_x + i\partial_y)^2xy = 2i$, which is $2!\,q(1, i, 0)$.
:::

::: derivation
### Down the ladder, one rung at a time

Let $P$ be homogeneous, with $\nabla^{2(j+1)}P = 0$ and $j < m$. Then $\nabla^{2j}P$ is harmonic, so there is an $S$ as
above with $\nabla^{2j}S = \nabla^{2j}P$. So $S$ is reached, and the remainder has come down one rung:

$$\nabla^{2j}(P - S) = 0 .$$

We repeat with $j - 1$ in place of $j$, and so on, until the remainder is harmonic. So $P$ is a sum of reached products
and a harmonic polynomial, whose moment a reading at one time holds. A polynomial that is not homogeneous is treated
degree by degree, because a Laplacian lowers every degree by two.
:::

## Two bodies that no quadrupolar tide tells apart

The opening's bodies both have $\int\matter\rho\,r^2\,\dd V = \tfrac12\matter MR^2$: $\matter M(R/\sqrt2)^2$ for A, and
$\tfrac12\matter MR^2$ for B. A quadrupolar tide reaches only the rungs $j = 0$ and 1, where a round body has only
moments with $\ell = 0$, its mass and $\int\matter\rho\,r^2\,\dd V$, because higher patterns average to zero over a
sphere. A and B agree in both, so every quadrupolar tide, with any reading after it, treats them alike.

For a number, $g = \tfrac12(x^2 - y^2)$ has $|\nabla g|^2 = x^2 + y^2$, which averages to $\tfrac23r^2$ over
directions (section 1.8). So $\int\matter\rho\,|\nabla g|^2\,\dd V = \tfrac13\matter MR^2$ for both, and the sum rule
of section 13.1 gives each at rest $\tfrac12\epsilon^2$ times that, in joules when $g$ is in square metres and
$\epsilon$ in $\mathrm{s^{-1}}$.

The octupolar tide $g = \tfrac13(x^3 - 3xy^2)$ is the real part of $\tfrac13(x + iy)^3$. Its gradient is
$(x^2 - y^2,\,-2xy,\,0)$, so $|\nabla g|^2 = (x^2 - y^2)^2 + 4x^2y^2 = (x^2 + y^2)^2$, which is $|x + iy|^4$ (section
1.5b). It averages to $\tfrac{8}{15}r^4$ (section 1.8), and $\int\matter\rho\,r^4\,\dd V$ is $\tfrac14\matter MR^4$ for
A and $\tfrac12\matter MR^4$ for B:

$$\boxed{\;\begin{aligned}
\int\matter\rho_{\rm A}\,|\nabla g|^2\,\dd V &= \tfrac{2}{15}\matter MR^4,\\
\int\matter\rho_{\rm B}\,|\nabla g|^2\,\dd V &= \tfrac{4}{15}\matter MR^4 .
\end{aligned}\;}$$

B gains twice as much ($\epsilon$ is now in $\mathrm{m^{-1}\,s^{-1}}$). In general the tide
$\mathrm{Re}\,(x + iy)^n/n$ has $|\nabla g|^2 = (x^2 + y^2)^{n-1}$ by the same step, and weighs
$\int\matter\rho\,r^{2n-2}\,\dd V$: $\matter M(R^2/2)^{n-1}$ for A and $\tfrac12\matter MR^{2n-2}$ for B, so B gains
$2^{n-2}$ times as much: 1, 2 and 4 for $n = 2$, 3 and 4.

The pair is the simplest case of a rule. Let $\sym{null-potential}{\field\psi}$ be zero outside the body, with its
derivatives up to order $2m - 1$ zero on the surface; equivalently, $\field\psi$, $\nabla^2\field\psi$, …,
$\nabla^{2m-2}\field\psi$ are each confined in the sense of section
[2.5](/tutorial/outside/null-space/#a-confined-laplacian-added-to-a-body-changes-nothing-outside).[^strong] We add the
density $\nabla^{2m}\field\psi/4\pi G$, the null density of section 2.5 when $m = 1$, with $\field\psi$ in joules per
kilogram times metres to the power $2m - 2$. Green's second identity (section 2.1) moves one Laplacian at a time from
$\field\psi$ to a harmonic $h$, with no terms on the surface, where those derivatives vanish. After $m$ moves,
$\int h\,\nabla^{2m}\field\psi\,\dd V = \int\field\psi\,\nabla^{2m}h\,\dd V = 0$, so the field outside does not
change. The same moves with $\nabla h\cdot\nabla g$ in place of $h$ give

$$\begin{aligned}
\int\nabla h\cdot\nabla g\;\nabla^{2m}\field\psi\,\dd V &= \int\field\psi\;\nabla^{2m}(\nabla h\cdot\nabla g)\,\dd V\\
&= 0
\end{aligned}$$

for every tide $g$ of degree up to $m$, by equation [](#eq:ladder-identity). Two densities that differ by
$\nabla^{2m}\field\psi/4\pi G$ therefore answer every tide of degree up to $m$ alike.[^cone]

The pair's difference is $\nabla^4\field\psi/4\pi G$ (Figure [](#fig:ladder-pair-profiles)), the case $m = 2$, with
$\field\psi$ zero outside $R$ (the stretch problem). For the pair, the Laplacians are taken with the shells as surface
densities and B's centre as a point, every derivative being moved onto the smooth polynomial. That is why every
quadrupolar tide treats the pair alike; the octupolar difference comes from the computation above.[^slip] The null
space of one reading, the densities $\nabla^2\field\psi/4\pi G$, is the bottom rung, and each degree of tide beyond the
first removes one more.[^converse] A warm body's tremor climbs the same ladder (section
[4.6](/tutorial/response/fluctuation-dissipation/#each-degree-of-the-tremor-holds-one-moment-of-the-density)).

![Look first at the bottom curve, which meets zero at the radius $R$ and stays there: the pair's difference is four
derivatives, two Laplacians, of a function that vanishes outside the body. The top panel is the difference itself, two
shells and a point; the middle one is its potential, which already vanishes outside $R$. The shapes are exact; the
heights are schematic, and the dashed curve is the bottom one drawn twenty times
higher.](tut-ladder-pair-profiles){#fig:ladder-pair-profiles}

## A mass held for an instant is a tide of every degree, so it climbs the whole ladder

Section 13.1 found that a mass $\matter\mu$ held at $\vect y$ for a short time $\delta t$ is the impulsive tide
$g = 1/|\vect x - \vect y|$ with $\epsilon = G\matter\mu\,\delta t$, so that a body at rest gains
$\tfrac12\epsilon^2\int\matter\rho\,|\vect x - \vect y|^{-4}\,\dd V$. By the first section its profile holds every
degree. With $u = r/s < 1$, $|\vect x - \vect y|^2 = s^2(1 - 2u\cos\gamma + u^2)$, so

$$\begin{aligned}
|\vect x - \vect y|^{-4} &= \frac{(1 - 2u\cos\gamma + u^2)^{-2}}{s^4}\\
&= \sum_{n=0}^{\infty}C^{(2)}_n(\cos\gamma)\,\frac{r^n}{s^{n+4}} .
\end{aligned}$$

The **Gegenbauer polynomials** $\sym{gegenbauer}{C^{(2)}_n}$ are defined by this generating function,
$(1 - 2u\cos\gamma + u^2)^{-2} = \sum_nC^{(2)}_n(\cos\gamma)\,u^n$, the fourth power of the generating function of the
Legendre polynomials in section 2.2, $(1 - 2u\cos\gamma + u^2)^{-1/2} = \sum_\ell P_\ell(\cos\gamma)\,u^\ell$; the (2)
records the power $-2$. We expand $(1 - w)^{-2} = 1 + 2w + 3w^2 + 4w^3 + \cdots$ with $w = 2u\cos\gamma - u^2$ and
collect the powers of $u$:

$$\begin{aligned}
C^{(2)}_2 &= 12\cos^2\gamma - 2 = 2P_0 + 8P_2,\\
C^{(2)}_3 &= 32\cos^3\gamma - 12\cos\gamma = \tfrac{36}{5}P_1 + \tfrac{64}{5}P_3 .
\end{aligned}$$

The next is $C^{(2)}_4 = 3P_0 + \tfrac{96}{7}P_2 + \tfrac{128}{7}P_4$. Each is a sum of the Legendre polynomials of its
own parity, with positive coefficients, so no rung is missed.[^gegen] For a check, at $\gamma = 0$ the generating
function is $(1 - u)^{-4}$, with coefficients $(n + 1)(n + 2)(n + 3)/6$: 10, 20 and 35 for $n = 2$, 3 and 4, the sums of
those above, because every $P_\ell(1) = 1$.

::: derivation
### Every coefficient is positive, at every degree

We write $x = \cos\gamma$ and $G(x, u) = (1 - 2ux + u^2)^{-1/2} = \sum_\ell P_\ell(x)\,u^\ell$, so that the generating
function of the $C^{(2)}_n$ is $G^4$. We show that $C^{(2)}_n$ holds every $P_\ell$ with $\ell \le n$ of the parity of
$n$, with a coefficient of at least $2\ell + 1$.

**The derivatives of the Legendre polynomials.** Differentiating $G$ gives $\partial_xG = uG^3$ and
$\partial_uG = (x - u)G^3$. Then

$$\begin{aligned}
\sum_k\bigl(P'_{k+1} - P'_{k-1}\bigr)u^k &= \Bigl(\frac1u - u\Bigr)\partial_xG = (1 - u^2)\,G^3,\\
\sum_k(2k + 1)P_k\,u^k &= (2u\,\partial_u + 1)\,G\\
&= G^3\bigl[2u(x - u) + 1 - 2ux + u^2\bigr] = (1 - u^2)\,G^3 ,
\end{aligned}$$

so $P'_{k+1} - P'_{k-1} = (2k + 1)P_k$, with $P'_{-1} = P'_0 = 0$. Adding these for $k = n, n - 2, \dots$,

$$P'_{n+1} = (2n + 1)P_n + (2n - 3)P_{n-2} + \cdots ,$$

ending in $P_0$ or $3P_1$: every Legendre polynomial of the parity of $n$ up to $P_n$, each with the coefficient
$2\ell + 1$. For $n = 2$, $P'_3 = \tfrac12(15x^2 - 3) = 5P_2 + P_0$.

**Products of Legendre polynomials.** By section 2.2's addition theorem, $P_a(\hat{\vect x}\cdot\hat{\vect y}) =
\tfrac{4\pi}{2a + 1}\sum_mY_{am}(\hat{\vect x})\,Y^*_{am}(\hat{\vect y})$, so the product
$P_a(\hat{\vect x}\cdot\hat{\vect y})\,P_b(\hat{\vect x}\cdot\hat{\vect y})$ is a sum of terms
$\phi(\hat{\vect x})\,\phi^*(\hat{\vect y})$, with each $\phi$ a product $Y_{am}Y_{bm'}$ times a positive number. Let
$P_aP_b = \sum_Lc_LP_L$. Multiply by $P_L(\hat{\vect x}\cdot\hat{\vect y})$, written by the addition theorem again,
and integrate over both directions. On the right, the orthogonality of the patterns (section 2.2) leaves $c_L$ times a
positive number. On the left, each term gives a positive number times $\sum_M\bigl|\oint\phi\,Y^*_{LM}\,\dd\Omega\bigr|^2$,
which is not negative. So every $c_L \ge 0$: **a product of Legendre polynomials is a sum of Legendre polynomials
with coefficients that are not negative.**

**The coefficients of $C^{(2)}_n$.** Differentiating $G$ in $x$ again, $\sum_\ell P'_\ell u^{\ell-1} = G^3$, so
$G^3 = \sum_aP'_{a+1}u^a$ and

$$G^4 = G^3\,G = \sum_n u^n\sum_{b=0}^{n}P'_{n-b+1}\,P_b .$$

Each term $P'_{n-b+1}P_b$ is, by the two results, a sum of $P_\ell$ with coefficients that are not negative, and of
the parity of $n$. The term $b = 0$ is $P'_{n+1}$ itself, which holds every $P_\ell$ of that parity up to $P_n$ with
the coefficient $2\ell + 1$. Nothing can cancel it, so

$$\boxed{\;C^{(2)}_n = \sum_\ell a_{n\ell}P_\ell, \qquad a_{n\ell} \ge 2\ell + 1 > 0\;}$$

for $\ell = n, n - 2, \dots$, and every $n$. For $n = 2$ the bound is $1$ and $5$ against the exact $2$ and $8$; for
$n = 3$, $3$ and $7$ against $\tfrac{36}{5}$ and $\tfrac{64}{5}$.
:::

The addition theorem of section 2.2 turns each $P_\ell(\cos\gamma)$ into a sum, over the $2\ell + 1$ patterns of degree
$\ell$, of a pattern at the direction of $\vect x$ times one at the direction of $\vect y$. So the term $n$ of the
energy holds each moment $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$ with $\ell + 2j = n$, with a positive coefficient,
the factor $s^{-n-4}$ and a pattern $Y_\ell$ of the mass's direction, and no two share both pattern and power. Energies
outside a sphere about the centre that encloses the body, sorted by direction and power of $s$, therefore give every
radial moment. These are all the polynomial moments, which fix a body of bounded size (section 13.1's argument), so the energies of a
held mass fix the density.

At $n = 2$ the energy carries $s^{-6}\int\matter\rho\,r^2\bigl(2 + 8P_2(\cos\gamma)\bigr)\dd V$, so the first moment
that is not harmonic, $2\int\matter\rho\,r^2\,\dd V$, comes with the quadrupole. For a round body only $P_0$ survives,
and the kernel averaged over directions is $(s^2 - r^2)^{-2} = \sum_k(k + 1)\,r^{2k}/s^{2k+4}$. The pair agrees at
$s^{-4}$ and $s^{-6}$, and at $s^{-8}$ the term $3\int\matter\rho\,r^4\,\dd V$ gives B more than A by
$\tfrac38\epsilon^2\matter MR^4/s^8$.

For one mass at a time on a sphere of one radius, the moments of one pattern $Y_\ell$ on different rungs arrive with
the same pattern of the mass's direction and add into one number, so only varying distances pull the rungs apart. Two
masses held together on one sphere sort the rungs by the pair of directions (section
[13.8](/tutorial/what-a-field-keeps/holography/#pushing-reads-the-volume-but-only-to-a-number-of-cells-set-by-the-logarithm)).

## The same ladder appears in impedance tomography

Calderón's problem (section 13.2) seeks the electrical conductivity inside a body from currents and voltages at its
surface. Linearized about a uniform ball, it is a **triangular system**: the first equation holds one unknown, the
second that one and one more, so that they can be solved in turn. Currents whose surface patterns have degree up to
$m$ give exactly the first $m$ radial orders, or rungs, of the conductivity in every angular sector
[@GardeHirvensalo2025], as in a disc [@GardeHyvonen2024]; we state this without proof. In gravity the linear form is
exact (section 13.2).

::: try {#push-and-weigh}
The figure cuts two bodies through their centres and pushes their particles along their kicks, outward in orange and
inward in blue. Bars give the energies gained, marks what noisy weighings read, and a line says whether the pair is
told apart. Under "The degree of the tide", "Hexadecapole" is degree four.

Predict first, before you look at the table "The ladder": what is the lowest degree of tide that tells apart "Same
second and fourth moments", and why does "Quadrupole" fail for it? Choose that pair under "The pair of bodies", set
Noise to none, and press Push at each degree. At the lowest degree you found, put Noise back to σ = 0.0200 and Pushes
to 100, its most. The line seldom says "Told apart.": this difference needs about 250 pushes. Lower Noise until it
does; near σ = 0.0125 about half the presses tell the pair apart, and at σ = 0.0075 nearly all.
:::

**The idea to keep: whatever is read after it, a tide of degree $m$ reaches exactly the polynomials killed by $m$
Laplacians, the sums of $r^{2j}$ times harmonic ones with $j < m$. A mass held for an instant, a tide of every degree,
climbs the whole ladder.**

::: problems
### Practice

**[13.3]** A mass is held briefly $1.5R$ from the centre of the pair of the opening. How much more energy does B gain
than A?

::: solution
By the averaged kernel, A gains $\tfrac12\epsilon^2\matter M(s^2 - R^2/2)^{-2}$ and B
$\tfrac14\epsilon^2\matter M[s^{-4} + (s^2 - R^2)^{-2}]$: at $s = 1.5R$, 0.327 and 0.419 times
$\tfrac12\epsilon^2\matter M/R^4$. B gains 28 per cent more.
:::

**[13.3]** What is the dimension of the space of biharmonic polynomials of degree four?

::: solution
Fourteen, $9 + 5$, of the fifteen of all quartics.
:::

**[13.3]** Why must a single held mass be used at several distances to read every rung?

::: solution
At one distance the moments of one angular pattern on different rungs add into one number.
:::

**[13.3]** The pair "Same second and fourth moments" has A, two shells of $\matter M/2$ at $R/2$ and $\sqrt3R/2$, and
B, $\matter M/5$ at the centre and $4\matter M/5$ on a shell at $\sqrt{5/8}\,R$. Check that their
$\int\matter\rho\,r^2\,\dd V$ and $\int\matter\rho\,r^4\,\dd V$ agree, and find $\int\matter\rho\,|\nabla g|^2\,\dd V$
under $g = \mathrm{Re}\,(x + iy)^4/4$.

::: solution
Both have $\tfrac12\matter MR^2$ and $\tfrac{5}{16}\matter MR^4$. With $\langle\sin^6\theta\rangle = \tfrac{16}{35}$
and $\int\matter\rho\,r^6\,\dd V = \tfrac{7}{32}$ and $\tfrac{25}{128}\matter MR^6$, the integrals are $\tfrac{1}{10}$
and $\tfrac{5}{56}\matter MR^6$, 0.100 against 0.089.
:::

**[13.3]** Find the Fischer product of $(\vect a\cdot\vect x)^2$, with $\vect a = (1, -i, 0)$, and the harmonic
$q = x^2 - y^2$, both directly and as $2!\,q(\bar{\vect a})$.

::: solution
$(\vect a\cdot\vect x)^2 = (x - iy)^2$, so $\bar p(\partial) = (\partial_x + i\partial_y)^2$, and applied to
$x^2 - y^2$ it gives $2 - (-2) = 4$. With $\bar{\vect a} = (1, i, 0)$, $q(\bar{\vect a}) = 1 - i^2 = 2$, and
$2!\times2 = 4$.
:::

### Stretch

**[13.3]** Write $P'_5$ as a sum of Legendre polynomials, and compare the lower bounds it gives for the coefficients of
$C^{(2)}_4$ with the exact $3$, $\tfrac{96}{7}$ and $\tfrac{128}{7}$.

::: solution
From $P'_{k+1} - P'_{k-1} = (2k + 1)P_k$, $P'_5 = 9P_4 + 5P_2 + P_0$. The bounds $1$, $5$ and $9$ lie below $3$,
$13.7$ and $18.3$; the other terms $P'_4P_1$, $P'_3P_2$, $P'_2P_3$ and $P'_1P_4$ supply the rest.
:::

**[13.3]** With section 2.5, show that the difference $\matter{\delta\rho} = \matter\rho_B - \matter\rho_A$ of the pair
of the opening is $\nabla^4\field\psi_2/4\pi G$ with $\field\psi_2$ zero outside the ball of radius $R$.

::: solution
The solution of $\nabla^2\field\psi_1 = 4\pi G\matter{\delta\rho}$ vanishes outside $R$, because the round
$\matter{\delta\rho}$ has no mass. Then $\nabla^2\field\psi_2 = \field\psi_1$ has a solution that vanishes outside $R$
if $\int\field\psi_1\,\dd V = 0$, and Green's identity with $\nabla^2(r^2/6) = 1$ gives

$$\begin{aligned}
\int\field\psi_1\,\dd V &= \tfrac16\int r^2\,\nabla^2\field\psi_1\,\dd V\\
&= \tfrac{4\pi G}{6}\int r^2\,\matter{\delta\rho}\,\dd V = 0 .
\end{aligned}$$
:::

### The camera

**[13.3]** Derive equation [](#eq:ladder-identity) and both lines of the product formulas for null vectors, and use
them to show that a tide of degree two reaches $\int\matter\rho\,r^{\ell+2}Y_\ell\,\dd V$ for every $\ell$.

::: solution
See the sections [on the reach](#no-tide-reaches-beyond-the-rungs-below-its-degree-whatever-is-read) and [on the
converse](#every-polynomial-on-the-ladder-is-reached). With $q = 2$ and $p = \ell + 2$, one Laplacian takes
the product of the gradients to a nonzero multiple of $(\vect a\cdot\vect b)^2(\vect a\cdot\vect x)^\ell$, so the
products reach $r^2H_\ell$ for every $H_\ell$, whose moments are $\int\matter\rho\,r^{\ell+2}Y_\ell\,\dd V$.
:::
:::

::: paper
- [*What a tide of a given degree reaches*](/paper/#par:what-a-tide-of-a-given-degree-reaches) (Section XIII): the
  equations [](/paper/#eq:ladder) and [](/paper/#eq:ladder-identity), the pair, the null spaces and the triangular
  systems, with Figure [](/paper/#fig:ladder).
- Appendix C, [*The reach of a tide of given degree*](/paper/#par:the-reach-of-a-tide-of-given-degree)
  ([](/paper/#eq:proof-ladder)) and [*What the passes of a mass
  determine*](/paper/#par:what-the-passes-of-a-mass-determine) (the Gegenbauer step).
- [*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading): the single sphere.
- Table [](/paper/#tab:hair), the row "Tides of degree up to $m$"; [Section XV](/paper/#sec:holography).
:::

::: deeper
- S. Axler, P. Bourdon and W. Ramey, *Harmonic Function Theory* (2nd edition, Springer, 2001), chapter 5: the
  decomposition into $r^{2j}$ times harmonic polynomials.
- N. Aronszajn, T. M. Creese and L. J. Lipkin, *Polyharmonic Functions* (Oxford, 1983).
- The GR course's lesson
  [*Poisson from a flux*](https://neovand.github.io/general-relativity/chapter-12.html#poisson-from-a-flux).
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, as its equations
    [](/paper/#eq:ladder) and [](/paper/#eq:ladder-identity), with the converse in its Appendix C
    ([](/paper/#eq:proof-ladder)).

[^H]: $H_\ell$ is always written with its subscript. It is not the bits of section 3.8 or a Hamiltonian.

[^almansi]: E. Almansi proved the theorem in 1899.

[^rank]: At degree $n$ the products $\nabla h\cdot\nabla g$ and the harmonic polynomials span $\sum(2n - 4j + 1)$
    dimensions, summed over $j < m$ with $n \ge 2j$: 1, 3, 6, 10, 14, 18 and 22 for $m = 2$ at $n = 0$ to 6.

[^strong]: Section 2.5's sense alone is not enough once $m \ge 2$: $\field\psi = (R^2 - r^2)^2$ inside $R$ and zero
    outside meets it, but $\nabla^2\field\psi$ jumps at the surface, and $\nabla^4\field\psi$ gives a density with a mass.

[^cone]: In the variables of section 13.2 the Laplacian brings the factor $\kappa^2 - K^2$ to
    $e^{i\vect K\cdot\vect a - \kappa z}$, so the scene transforms differ by $(\kappa^2 - K^2)^m\tilde\psi/4\pi G$ and
    the second readings by half of $(\kappa^2 - K^2)^{m+1}\tilde\psi/4\pi G$: both vanish on the cone $\kappa = K$.

[^slip]: Such densities differ under a tide of degree $m + 1$ in general, but not when $\field\psi$ is itself the
    Laplacian of a confined function; only then is every $\int\field\psi\,\nabla^{2m}(r^{2m}H_\ell)\,\dd V$, a positive
    multiple of $\int\field\psi\,H_\ell\,\dd V$, zero. The pair is such a case at $m = 1$.

[^converse]: Conversely, a density $\matter{\delta\rho}$ that the field outside and every tide of degree up to $m$
    treat as zero is $\nabla^{2m}\field\psi/4\pi G$ with $\field\psi$ as above. By section
    [2.5](/tutorial/outside/null-space/#two-bodies-with-the-same-outside-differ-by-a-confined-laplacian) it is
    $\nabla^2\field\psi_1/4\pi G$ with $\field\psi_1$ confined. For $m \ge 2$, tides of degree two reach $r^2H_\ell$,
    so $\int\matter{\delta\rho}\,r^2H_\ell\,\dd V = 0$, which Green's identity turns into
    $\int\field\psi_1H_\ell\,\dd V = 0$; so $\field\psi_1 = \nabla^2\field\psi_2$, and each degree repeats the step.

[^gegen]: The box below proves the positivity for every $n$. The exact coefficients are given by the connection
    formula $C^{(2)}_n = \sum_k\frac{(2)_{n-k}(3/2)_k(2n - 4k + 1)}{(3/2)_{n-k}\,k!}P_{n-2k}$, $0 \le k \le n/2$, with
    $(a)_k = a(a + 1)\cdots(a + k - 1)$, a case of Gegenbauer's formula connecting his polynomials of two different
    orders (R. Askey, *Orthogonal Polynomials and Special Functions*, SIAM, 1975), which we state without
    proof; it gives $2$, $8$ at $n = 2$ and $\tfrac{36}{5}$, $\tfrac{64}{5}$ at $n = 3$, as above.
