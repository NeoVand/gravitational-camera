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

**What you need:** chapters [1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts) (the
shell theorem), [1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero) (null
vectors), [1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass) (the
impulsive tide),
[1.8](/tutorial/newton/orbits-and-kicks/#what-a-pass-leaves-inside-a-body-is-a-weighted-sum-of-its-projected-mass)
(averages over directions), [2.1](/tutorial/outside/laplace/#the-product-of-two-harmonic-functions-is-not-harmonic)
(the Laplacian of a product),
[2.2](/tutorial/outside/spherical-harmonics/#each-pattern-of-one-degree-gives-two-harmonic-functions-the-solid-harmonics)
(solid harmonics and Legendre polynomials),
[2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics) (the interior
expansion), [2.5](/tutorial/outside/null-space/#a-confined-laplacian-added-to-a-body-changes-nothing-outside) (confined
functions), and chapters
[13.1](/tutorial/what-a-field-keeps/push-and-pass/#a-mass-held-for-an-instant-leaves-energy-through-a-kernel-that-is-not-harmonic)
(the held mass) and
[13.2](/tutorial/what-a-field-keeps/calderon/#a-flat-camera-reads-the-transform-on-a-cone-at-one-time-and-inside-it-at-two)
(the cone).

The paper's Figure [](/paper/#fig:ladder) sets two bodies side by side. Here $\sym{mass}{\matter M}$ is a mass in
kilograms and $R$ a radius in metres. Body A is a thin shell of mass $\matter M$ and radius $R/\sqrt2$. Body B holds
half of that mass at its centre and half on a thin shell of radius $R$. By the shell theorem the two pull alike outside
$R$. They are chapter 13.1's bodies: there a passing tonne left 30 per cent more energy in B than in A.

A brief quadrupolar tide, the stretch and squeeze of a distant mass, leaves the same energy in both, so their bars in
panel (a) are equal. A brief octupolar tide, the lopsided part that a nearer mass adds, leaves twice as much in B.

{{paper fig:ladder}}

So we ask: a body is kicked by the tides of distant masses, which are quadrupolar. What exactly do such tides read of
the inside, what does a nearer mass add, and why can no tide of a given degree reach beyond a fixed set of moments,
whatever is read afterwards? The answer is the paper's ladder, which says which radial moments of the density each kind
of tide can read.

::: plain
A distant mass stretches a body along the line towards it and squeezes it across that line: this is its tide. A nearer
mass adds finer patterns, with more lobes round the body. A brief tide kicks every part of the body, and the energy
gained adds up its pieces, each weighted by the square of its kick.

For a round body, the coarsest tide weights each piece by the square of its distance from the centre, and each finer
pattern by a higher power: the fourth, the sixth, and so on. These powers are the rungs of a ladder, and no tide
reaches above its own, whether the body is weighed afterwards or its field is read again. So no distant mass can tell
apart two round bodies of the same mass that agree in the average square distance of their mass.

A mass held near the body for an instant makes every pattern at once, so it reaches every rung.
:::

## Inside a body, a tide is a sum of harmonic polynomials of rising degree

We want the shape that a tide from outside takes inside a body, because that shape decides what the kicks weigh. Take
one mass $\sym{passing-mass}{\matter\mu}$, in kilograms, at the point $\vect y$, and let $s = |\vect y|$ be its
distance in metres from an origin at the body's centre. Let $\vect x$ be a point of the body at the distance
$r = |\vect x|$, and $\gamma$ the angle between $\vect x$ and $\vect y$ (not a Lorentz factor). We assume that **every
point of the body is nearer the centre than the mass is**, $r < s$. Chapter 2.3's interior expansion, for one mass and
with 2.2's Legendre polynomials $\sym{legendre}{P_\ell}$, gives the potential in joules per kilogram:

$$\begin{aligned}
\field\Phi(\vect x) &= -\frac{G\matter\mu}{|\vect x - \vect y|}\\
&= -\frac{G\matter\mu}{s}\sum_{\ell=0}^{\infty}\Bigl(\frac{r}{s}\Bigr)^\ell P_\ell(\cos\gamma) .
\end{aligned}$$

Each term $r^\ell P_\ell(\cos\gamma)$ is $r^\ell$ times a pattern of degree $\sym{degree}{\ell}$, so it is a **harmonic
polynomial** of degree $\ell$ in $x$, $y$ and $z$: a polynomial whose Laplacian is zero (2.2's solid harmonic). Degree
0 is a constant and pushes nothing. Degree 1 is a uniform pull, which moves the body as a whole: chapter 13.1's recoil.
Degree 2 is the **quadrupolar tide**, the first term that deforms the body, and its profile is a harmonic quadratic.
Degree 3 is the **octupolar tide**, whose profile is a harmonic cubic.

The small parameter is $r/s$. Along the line to the mass, where $P_\ell = 1$, the kick of degree $\ell$ is
$(\ell/2)(r/s)^{\ell-2}$ times the quadrupolar one. For the paper's steel ball, of radius 0.5 m, and a mass 1.5 m from
its centre, $r/s$ is a third at the surface. There the octupolar kick is half the quadrupolar one, and the kick of
degree four two ninths: each degree adds about a factor $r/s$. The series fails when the mass touches the body,
where every degree counts. So a distant mass makes a tide of degree two, and finer tides need masses close by.

A **tide of degree $m$** is an impulsive tide (chapter 1.7), with the potential $-\epsilon\,g(\vect x)\,\delta(t)$ and
the strength $\sym{impulse-strength}{\epsilon}$, whose profile $g$ is a harmonic polynomial of degree at most $m$. Here
$\sym{tide-degree}{m}$ is a whole number, the paper's letter.[^m] So $\tfrac12(x^2 - y^2)$ is a tide of degree two,
while the profile $1/|\vect x - \vect y|$ of a mass at $\vect y$ has terms of every degree and no finite degree.

## Polynomials killed by repeated Laplacians are harmonic ones times even powers of the radius

We want the polynomials that $m$ Laplacians make zero, because the [next
section](#no-tide-reaches-beyond-the-rungs-below-its-degree-whatever-is-read) shows that a tide of degree $m$ weighs the
density against such polynomials only. We write $\nabla^{2m}$ for the Laplacian taken $m$ times, not a derivative of
order $2m$. A polynomial $P$ in $x$, $y$ and $z$ is **polyharmonic of order $m$** if $\nabla^{2m}P = 0$. Order one is
harmonic, and order two is called **biharmonic**. (A Legendre polynomial always carries its subscript, so a bare $P$ is
a polynomial of this kind.) For an example, chapter 2.2's rule $\nabla^2r^n = n(n + 1)\,r^{n-2}$ gives $\nabla^2r^2 = 6$
and $\nabla^4r^2 = 0$, so $r^2$ is biharmonic but not harmonic. For a non-example, $\nabla^2r^4 = 20r^2$ and
$\nabla^4r^4 = 120$.

We want the Laplacian of $r^{2j}H_\ell$, because products of this kind build every polynomial. A polynomial is
**homogeneous** of degree $\ell$ when all its terms have the degree $\ell$. We assume that
**$\sym{harmonic-polynomial}{H_\ell}$ is a homogeneous harmonic polynomial of degree $\ell$**, $r^\ell Y_\ell$ in
chapter 2.2's words, with $Y_\ell$ a pattern of degree $\ell$ on the sphere,[^H] and that **$j$ is a whole number**.
Chapter 2.1's product rule gives

$$\begin{aligned}
\nabla^2\bigl(r^{2j}H_\ell\bigr) &= H_\ell\,\nabla^2r^{2j} + 2\,\nabla r^{2j}\cdot\nabla H_\ell\\
&\quad + r^{2j}\,\nabla^2H_\ell .
\end{aligned}$$

The last term is zero. In the first, 2.2's rule with $n = 2j$ gives $\nabla^2r^{2j} = 2j(2j + 1)\,r^{2j-2}$. In the
middle one, the gradient of $r^{2j}$ is $2j\,r^{2j-2}\,\vect x$, so we need $\vect x\cdot\nabla H_\ell$.

Homogeneity means that $H_\ell(\lambda\vect x) = \lambda^\ell H_\ell(\vect x)$ for every number $\lambda$. We
differentiate both sides with respect to $\lambda$, by the chain rule, and set $\lambda = 1$:

$$\vect x\cdot\nabla H_\ell = \ell\,H_\ell .$$

This is **Euler's relation**. For $H_2 = x^2 - y^2$ the left side is $x \cdot 2x - y \cdot 2y$, twice $H_2$. The
middle term is therefore $4j\ell\,r^{2j-2}H_\ell$, and $2j(2j + 1) + 4j\ell = 2j(2\ell + 2j + 1)$:

$$\boxed{\;\nabla^2\bigl(r^{2j}H_\ell\bigr) = 2j\,(2\ell + 2j + 1)\,r^{2j-2}H_\ell .\;}$$

The factor is a pure number, so both sides have the unit of $r^{2j}H_\ell$ divided by a square metre. For a check,
$j = 1$ and $H_0 = 1$ give 6, which is $\nabla^2r^2$. For a number, $j = 1$ and $H_2 = x^2 - y^2$ give
$\nabla^2[r^2(x^2 - y^2)] = 14(x^2 - y^2)$.

So each Laplacian lowers the power of $r$ by two, with a factor that is zero only when $j = 0$, when no power of $r$
is left (Figure [](#fig:ladder-laplacians)). After $j$ Laplacians a nonzero multiple of $H_\ell$ remains, and one more
gives zero: $r^{2j}H_\ell$ is polyharmonic of order exactly $j + 1$.

![Look first at the two zeros at the bottom. On the left, each Laplacian lowers the power of $r$ by two and multiplies
by a number, until $r^4H_2$ is gone after three steps. On the right, each Laplacian adds one derivative to each factor
of $\nabla h\cdot\nabla g$, until the derivatives of a cubic tide run
out.](tut-ladder-laplacians){#fig:ladder-laplacians}

Chapter 13.2 counted $(n + 1)(n + 2)/2$ monomials $x^ay^bz^c$ of degree $a + b + c = n$, and the counts at degrees $n$
and $n - 2$ differ by $2n + 1$, 2.2's count of the $H_n$. So the products $r^{2j}H_{n-2j}$, of which a given $j$ gives
$2(n - 2j) + 1$ independent ones, add down by twos to as many as the monomials: at degree four, $9 + 5 + 1 = 15$.

The products are also independent. In a sum $H_n + r^2H_{n-2} + r^4H_{n-4} + \cdots$ with a nonzero term, let
$r^{2J}H_{n-2J}$ be the nonzero term with the highest power of $r$. Then $J$ Laplacians kill every term with a lower
power and turn this one into a nonzero multiple of $H_{n-2J}$, so the sum is not zero. Independent and as many as the
monomials, the products form a basis, and every homogeneous polynomial of degree $n$ splits in exactly one way as

$$P = H_n + r^2H_{n-2} + r^4H_{n-4} + \cdots ,$$

the **Fischer decomposition**: for example, $x^2 = \tfrac13(2x^2 - y^2 - z^2) + \tfrac13r^2$.

Now we apply $m$ Laplacians to the split. The terms with $j < m$ vanish, and those with $j \ge m$ become nonzero
multiples of $r^{2(j-m)}H_{n-2j}$, which are independent by the same argument. So, degree by degree,

$$\boxed{\;\nabla^{2m}P = 0 \quad\text{exactly when}\quad P = \sum_{j<m}r^{2j}H_{n-2j} .\;}$$

At degree four the biharmonic polynomials fill $9 + 5 = 14$ of the 15 dimensions of all quartics, and the direction
missing is the split's $r^4$ term. For any function the same statement is **Almansi's theorem**, which we state
without proof: every solution of $\nabla^{2m}f = 0$ in a ball about the origin is $\sum_{j<m}r^{2j}f_j$ with each
$f_j$ harmonic.[^almansi] The polynomials of the paper's ladder are these:

{{paper eq:ladder}}

A tide **reaches** the moment $\int\matter\rho\,P\,\dd V$ of the density $\sym{density}{\matter\rho}$ when $P$ is a sum
of harmonic polynomials and of the functions $\nabla h\cdot\nabla g$ that the next section finds in the data, so that
the data fix that moment to leading order in $\epsilon$. By the paper, a tide of degree $m$ reaches exactly the $P$ of
its [](/paper/#eq:ladder). Their moments are the **radial moments** $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$,
against $r^{2j}H_\ell$ with $j < m$, and $j$ is the moment's **rung**: the paper's floor, a row of beads in panel (b).
A reading at one time holds the rung $j = 0$ alone, 2.3's multipole moments (Figure [](#fig:ladder-rungs)).

![Look first at the bands: each degree of tide adds one floor, one more power of $r^2$, to every column of angular
patterns. The bead in the colour of matter, $\int\matter\rho\,r^4$, is the first at which the two bodies of the paper's
figure differ. The dashed diagonals collect the moments that a held mass reaches at one power of its distance. The
number of beads in a cell is exact; the spacing is chosen for the drawing.](tut-ladder-rungs){#fig:ladder-rungs}

## No tide reaches beyond the rungs below its degree, whatever is read

We want what a tide of degree $m$ can reach. After the tide $g$, chapters 13.1 and 13.2 found the density in the data
only through $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$, to leading order in $\epsilon$. A weighing holds it with
$h = g$. A later reading of a moment $\sym{mass-moment}{\matter{Q_h}} = \int\matter\rho\,h\,\dd V$, with $h$
harmonic, holds it as the jump $\epsilon\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ in its rate of change. So we
want $\nabla^{2m}(\nabla h\cdot\nabla g)$, and we assume that **$h$ and $g$ are harmonic**.

We write the dot product with summed indices, $\partial_ih\,\partial_ig$, and use 2.1's
product rule:

$$\begin{aligned}
\nabla^2\bigl(\partial_ih\,\partial_ig\bigr) &= (\nabla^2\partial_ih)\,\partial_ig\\
&\quad + 2\,\partial_k\partial_ih\,\partial_k\partial_ig + \partial_ih\,(\nabla^2\partial_ig) .
\end{aligned}$$

Derivatives can be taken in either order, so $\nabla^2\partial_ih = \partial_i\nabla^2h = 0$, and the same holds for
$g$. Only the middle term is left:

$$\nabla^2(\nabla h\cdot\nabla g) = 2\,\partial_i\partial_kh\,\partial_i\partial_kg .$$

The right side has the same form, a sum of products of a derivative of $h$ with the same derivative of $g$, each
harmonic. So each further Laplacian adds one derivative to each factor and a factor 2, and $m$ steps give the paper's
equation:

{{paper eq:ladder-identity}}

If $g$ has degree $m$ or less, its derivatives of order $m + 1$ are zero, and so is the left side. So $m$ Laplacians
kill every $\nabla h\cdot\nabla g$, whatever harmonic $h$ is read, because any $h$ harmonic in the ball is a sum of
harmonic polynomials (2.3). The moments that a tide of degree $m$ reaches all satisfy the paper's
[](/paper/#eq:ladder), to leading order in the tide's strength, as its Table [](/paper/#tab:hair) records in the row
"Tides of degree up to $m$".

For a check, a uniform tide ($m = 1$) has a constant gradient $\vect c$, and $\nabla h\cdot\vect c$, a derivative of
$h$, is harmonic: a uniform push reads nothing beyond the field at one time. For a number, read
$h = \tfrac13(x^3 - 3xy^2)$ after the quadrupolar tide $g = \tfrac12(x^2 - y^2)$. Then
$\nabla h\cdot\nabla g = x^3 + xy^2$, whose Laplacian is $8x$, as the identity's right side,
$2(2x \cdot 1 + (-2x)(-1))$, gives. A second Laplacian gives zero, because $g$ has degree two. Since $x^3 + xy^2$ is
$\tfrac45r^2x$ plus a harmonic cubic, this reading reaches $\int\matter\rho\,r^2x\,\dd V$, on the rung $j = 1$.

## Every polynomial on the ladder is reached

We want the converse: every polynomial with $\nabla^{2m}P = 0$ is reached by tides of degree up to $m$. A **null
vector** is a complex vector whose dot product with itself, taken without a complex conjugate, is zero (1.5b). We use
the paper's Appendix C letters: $\vect a$ and $\vect b$ for two null vectors, $p$ and $q$ for whole numbers.[^ab] The
gradient of $(\vect a\cdot\vect x)^p$ is $p(\vect a\cdot\vect x)^{p-1}\vect a$, and its Laplacian is
$p(p - 1)(\vect a\cdot\vect a)(\vect a\cdot\vect x)^{p-2} = 0$. So every power of $\vect a\cdot\vect x$ is harmonic,
and its real and imaginary parts are real tides.

We take the tide $g = (\vect b\cdot\vect x)^q$ and read $h = (\vect a\cdot\vect x)^p$. The dot product of their
gradients gives the first line below. Chapter 2.1's rule for harmonic $f$ and $g$,
$\nabla^2(fg) = 2\,\nabla f\cdot\nabla g$, gives the second:

{{paper eq:proof-ladder}}

We choose the powers so that $j$ Laplacians use up the factor $\vect b\cdot\vect x$ and leave
$(\vect a\cdot\vect x)^\ell$: $q = j + 1$ and $p = \ell + j + 1$, with $j < m$. The tide has degree $j + 1 \le m$, and
the product of the gradients is a multiple of $(\vect a\cdot\vect x)^{\ell+j}(\vect b\cdot\vect x)^j$. Each Laplacian,
by the second line, lowers both powers by one and brings a whole number times $\vect a\cdot\vect b$, so $j$ of them
leave a nonzero whole number times $(\vect a\cdot\vect b)^{j+1}(\vect a\cdot\vect x)^\ell$. The conjugate
$\vect b = \vect a^*$ is again a null vector, because $\vect a^*\cdot\vect a^*$ is the conjugate of
$\vect a\cdot\vect a$, and $\vect a\cdot\vect a^* = |\vect a|^2 > 0$.

For a number, take $m = 2$, $j = 1$ and $\ell = 0$, with $\vect a = (1, i, 0)$ and $\vect b = (1, -i, 0)$, so that
$\vect a\cdot\vect b = 2$. The tide $(x - iy)^2$ is quadrupolar, the moment read is that of $(x + iy)^2$, and the
product of the gradients is $8(x^2 + y^2)$, whose Laplacian is 32. Since $x^2 + y^2$ is $\tfrac23r^2$ plus a harmonic
quadratic, the quadrupolar tide reaches $\int\matter\rho\,r^2\,\dd V$.

As $\vect a$ runs over the null vectors, the powers $(\vect a\cdot\vect x)^\ell$ give every harmonic polynomial of
degree $\ell$. At $\ell = 2$, $(1, i, 0)$, $(0, 1, i)$ and $(i, 0, 1)$ give $x^2 - y^2$, $2xy$, $y^2 - z^2$, $2yz$,
$z^2 - x^2$ and $2zx$, of which five are independent, 2.2's count. So for every $H_\ell$ and every $j < m$, some
combination $S$ of products $\nabla h\cdot\nabla g$, with tides of degree $j + 1$, has $\nabla^{2j}S = H_\ell$. The
derivation below carries this down the ladder.[^rank]

::: derivation
### Down the ladder, one rung at a time

Let $P$ be homogeneous, with $\nabla^{2(j+1)}P = 0$ and $j < m$. Then $\nabla^{2j}P$ is harmonic, so there is an $S$ as
above with $\nabla^{2j}S = \nabla^{2j}P$. So $S$ is reached, and the remainder has come down one rung:

$$\nabla^{2j}(P - S) = 0 .$$

We repeat with $j - 1$ in place of $j$, and so on, until the remainder is harmonic. So $P$ is a sum of reached products
and a harmonic polynomial, whose moment a reading at one time holds. A polynomial that is not homogeneous is treated
degree by degree, because a Laplacian lowers every degree by two.
:::

::: gap
That the powers $(\vect a\cdot\vect x)^\ell$ give all $2\ell + 1$ harmonic polynomials of degree $\ell$ is checked here
at degree two only, and stated for the others.
:::

## Two bodies that no quadrupolar tide tells apart

The opening's bodies both have $\int\matter\rho\,r^2\,\dd V = \tfrac12\matter MR^2$: $\matter M(R/\sqrt2)^2$ for A, and
$\tfrac12\matter MR^2$ for B. A quadrupolar tide reaches only the rungs $j = 0$ and 1, where a round body has only
moments with $\ell = 0$, its mass and $\int\matter\rho\,r^2\,\dd V$, because higher patterns average to zero over a
sphere. A and B agree in both, so every quadrupolar tide, with any reading after it, treats them alike.

For a number, the tide $g = \tfrac12(x^2 - y^2)$ has $|\nabla g|^2 = x^2 + y^2$, which averages to $\tfrac23r^2$ over
directions (1.8). So $\int\matter\rho\,|\nabla g|^2\,\dd V = \tfrac13\matter MR^2$ for both, and the paper's
[](/paper/#eq:push) gives each at rest $\tfrac12\epsilon^2$ times that, in joules when $g$ is in square metres and
$\epsilon$ in $\mathrm{s^{-1}}$.

The octupolar tide $g = \tfrac13(x^3 - 3xy^2)$ is the real part of $\tfrac13(x + iy)^3$. Its gradient is
$(x^2 - y^2,\,-2xy,\,0)$, so $|\nabla g|^2 = (x^2 - y^2)^2 + 4x^2y^2 = (x^2 + y^2)^2$, which is $|x + iy|^4$ (1.5b). It
averages to $\tfrac{8}{15}r^4$ (1.8), and $\int\matter\rho\,r^4\,\dd V$ is $\tfrac14\matter MR^4$ for A and
$\tfrac12\matter MR^4$ for B:

$$\boxed{\;\begin{aligned}
\int\matter\rho_{\rm A}\,|\nabla g|^2\,\dd V &= \tfrac{2}{15}\matter MR^4,\\
\int\matter\rho_{\rm B}\,|\nabla g|^2\,\dd V &= \tfrac{4}{15}\matter MR^4 .
\end{aligned}\;}$$

B gains twice as much, with $\epsilon$ now in $\mathrm{m^{-1}\,s^{-1}}$. In general the tide
$\mathrm{Re}\,(x + iy)^n/n$ has $|\nabla g|^2 = (x^2 + y^2)^{n-1}$ by the same step, and weighs
$\int\matter\rho\,r^{2n-2}\,\dd V$: $\matter M(R^2/2)^{n-1}$ for A and $\tfrac12\matter MR^{2n-2}$ for B, so B gains
$2^{n-2}$ times as much: 1, 2 and 4 for $n = 2$, 3 and 4.

The pair is the simplest case of a rule. Let $\sym{null-potential}{\field\psi}$ be zero outside the body, with its
derivatives up to order $2m - 1$ zero on the surface; equivalently, $\field\psi$, $\nabla^2\field\psi$, …,
$\nabla^{2m-2}\field\psi$ are each confined in chapter 2.5's sense.[^strong] We add the density
$\nabla^{2m}\field\psi/4\pi G$, 2.5's null density when $m = 1$, with $\field\psi$ in joules per kilogram times metres
to the power $2m - 2$. Green's second identity (2.1) moves one Laplacian at a time from $\field\psi$ to a harmonic
$h$, with no terms on the surface, where those derivatives vanish. After $m$ moves,
$\int h\,\nabla^{2m}\field\psi\,\dd V = \int\field\psi\,\nabla^{2m}h\,\dd V = 0$, so the field outside does not
change. The same moves with $\nabla h\cdot\nabla g$ in place of $h$ give

$$\begin{aligned}
\int\nabla h\cdot\nabla g\;\nabla^{2m}\field\psi\,\dd V &= \int\field\psi\;\nabla^{2m}(\nabla h\cdot\nabla g)\,\dd V\\
&= 0
\end{aligned}$$

for every tide $g$ of degree up to $m$, by the paper's [](/paper/#eq:ladder-identity). Two densities that differ by
$\nabla^{2m}\field\psi/4\pi G$ therefore answer every tide of degree up to $m$ alike.[^cone]

The pair's difference is $\nabla^4\field\psi/4\pi G$ (Figure [](#fig:ladder-pair-profiles)), the case $m = 2$, with
$\field\psi$ zero outside $R$ (the stretch problem). For the pair, the Laplacians are taken with the shells as 2.5's
surface densities and B's centre as a point, every derivative being moved onto the smooth polynomial. That is why every
quadrupolar tide treats the pair alike; the octupolar difference comes from the computation above.[^slip] The null space
of one reading, the densities $\nabla^2\field\psi/4\pi G$, is the bottom rung, and each degree of tide beyond the first
removes one more.[^converse] As an aside, a warm body's tremor climbs the same ladder: in chapter
[4.6](/tutorial/response/fluctuation-dissipation/#each-degree-of-the-tremor-holds-one-moment-of-the-density) its degree
$\ell$ reads $\int\matter\rho\,r^{2\ell-2}\,\dd V$ of a round body, as the tide $\mathrm{Re}\,(x + iy)^\ell/\ell$ does.

![Look first at the bottom curve, which meets zero at the radius $R$ and stays there: the pair's difference is four
derivatives, two Laplacians, of a function that vanishes outside the body. The top panel is the difference itself, two
shells and a point; the middle one is its potential, which already vanishes outside $R$. The shapes are exact; the
heights are schematic, and the dashed curve is the bottom one drawn twenty times
higher.](tut-ladder-pair-profiles){#fig:ladder-pair-profiles}

## A mass held for an instant is a tide of every degree, so it climbs the whole ladder

Chapter 13.1 found that a mass $\matter\mu$ held at $\vect y$ for a short time $\delta t$ is the impulsive tide
$g = 1/|\vect x - \vect y|$ with $\epsilon = G\matter\mu\,\delta t$, so that a body at rest gains
$\tfrac12\epsilon^2\int\matter\rho\,|\vect x - \vect y|^{-4}\,\dd V$. By the first section its profile holds every
degree. With $u = r/s < 1$, $|\vect x - \vect y|^2 = s^2(1 - 2u\cos\gamma + u^2)$, so

$$\begin{aligned}
|\vect x - \vect y|^{-4} &= \frac{(1 - 2u\cos\gamma + u^2)^{-2}}{s^4}\\
&= \sum_{n=0}^{\infty}C^{(2)}_n(\cos\gamma)\,\frac{r^n}{s^{n+4}} .
\end{aligned}$$

The **Gegenbauer polynomials** $\sym{gegenbauer}{C^{(2)}_n}$ are defined by this generating function,
$(1 - 2u\cos\gamma + u^2)^{-2} = \sum_nC^{(2)}_n(\cos\gamma)\,u^n$, the fourth power of 2.2's
$(1 - 2u\cos\gamma + u^2)^{-1/2} = \sum_\ell P_\ell(\cos\gamma)\,u^\ell$; the (2) records the power $-2$. We expand
$(1 - w)^{-2} = 1 + 2w + 3w^2 + 4w^3 + \cdots$ with $w = 2u\cos\gamma - u^2$ and collect the powers of $u$:

$$\begin{aligned}
C^{(2)}_2 &= 12\cos^2\gamma - 2 = 2P_0 + 8P_2,\\
C^{(2)}_3 &= 32\cos^3\gamma - 12\cos\gamma = \tfrac{36}{5}P_1 + \tfrac{64}{5}P_3 .
\end{aligned}$$

The next is $C^{(2)}_4 = 3P_0 + \tfrac{96}{7}P_2 + \tfrac{128}{7}P_4$. Each is a sum of the Legendre polynomials of its
own parity, with positive coefficients, as the paper's Appendix C states, so no rung is missed.[^gegen] For a check,
at $\gamma = 0$ the generating function is $(1 - u)^{-4}$, with coefficients $(n + 1)(n + 2)(n + 3)/6$: 10, 20 and 35
for $n = 2$, 3 and 4, the sums of those above, because every $P_\ell(1) = 1$.

Chapter 2.2's addition theorem turns each $P_\ell(\cos\gamma)$ into a sum, over the $2\ell + 1$ patterns of degree
$\ell$, of a pattern at the direction of $\vect x$ times one at the direction of $\vect y$. So the term $n$ of the
energy holds each moment $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$ with $\ell + 2j = n$, with a positive coefficient,
the factor $s^{-n-4}$ and a pattern $Y_\ell$ of the mass's direction, and no two share both pattern and power. Energies
outside a sphere about the centre that encloses the body, sorted by direction and power of $s$, therefore give every
radial moment. These are all the polynomial moments, which fix a body of bounded size by chapter 13.1's argument in
three dimensions. So the energies of a held mass fix the density.

At $n = 2$ the energy carries $s^{-6}\int\matter\rho\,r^2\bigl(2 + 8P_2(\cos\gamma)\bigr)\dd V$, so the first moment
that is not harmonic, $2\int\matter\rho\,r^2\,\dd V$, comes with the quadrupole. For a round body only $P_0$ survives,
and the kernel averaged over directions is $(s^2 - r^2)^{-2} = \sum_k(k + 1)\,r^{2k}/s^{2k+4}$. The paper's pair agrees
at $s^{-4}$ and $s^{-6}$, and at $s^{-8}$ the term $3\int\matter\rho\,r^4\,\dd V$ gives B more than A by
$\tfrac38\epsilon^2\matter MR^4/s^8$.

On a sphere of one radius the moments of one pattern $Y_\ell$ on different rungs arrive with the same pattern of the
mass's direction and add into one number, so only distances that vary pull the rungs apart.

## The same ladder appears in impedance tomography

Calderón's problem (chapter 13.2) seeks the electrical conductivity inside a body from currents and voltages at its
surface. Linearized about a uniform ball, it is a **triangular system**: the first equation holds one unknown, the
second that one and one more, and so on, so that they can be solved in turn. Currents whose surface patterns have
degree up to $m$ give exactly the first $m$ radial orders, or rungs, of the conductivity in every angular sector
[@GardeHirvensalo2025], as in a disc [@GardeHyvonen2024]. We state this without proof. In gravity the linear form is
exact (13.2), and the paper reads it as what an observer with limited tides cannot tell apart.

::: try {#push-and-weigh}
The figure cuts two bodies through their centres and pushes their particles along their kicks, outward in orange and
inward in blue. Bars give the energies gained, marks what noisy weighings read, and a line says whether the pair is
told apart. Under "The degree of the tide", "Hexadecapole" is degree four.

Predict first, before you look at the table "The ladder": what is the lowest degree of tide that tells apart "Same
second and fourth moments", and why does "Quadrupole" fail for it? Choose that pair under "The pair of bodies", set
Noise to none, and press Push at each degree. At the lowest degree you found, put Noise back to σ = 0.0200 and Pushes
to 100, its most. The line seldom says "Told apart.": this difference needs about 250 pushes. Lower Noise until it
does. Near σ = 0.0125 about half the presses of Push tell the pair apart, and at σ = 0.0075 nearly all.
:::

::: check
### Q

A mass is held briefly $1.5R$ from the centre of the paper's pair. How much more energy does B gain than A?

### A

By the averaged kernel, A gains $\tfrac12\epsilon^2\matter M(s^2 - R^2/2)^{-2}$ and B
$\tfrac14\epsilon^2\matter M[s^{-4} + (s^2 - R^2)^{-2}]$: at $s = 1.5R$, 0.327 and 0.419 times
$\tfrac12\epsilon^2\matter M/R^4$. B gains 28 per cent more.

### Q

What is the dimension of the space of biharmonic polynomials of degree four?

### A

Fourteen, $9 + 5$, of the fifteen of all quartics. Only 9 of the 15 monomials are themselves biharmonic; $x^4$ and
$x^2y^2$ are not.

### Q

Why must a held mass be used at several distances to read every rung?

### A

At one distance the moments of one angular pattern on different rungs arrive with the same pattern, and add into one
number.
:::

**The idea to keep: whatever is read after it, a tide of degree $m$ reaches exactly the polynomials killed by $m$
Laplacians, the sums of $r^{2j}$ times harmonic ones with $j < m$. A mass held for an instant, a tide of every degree,
climbs the whole ladder.**

::: problems
### Practice

The pair "Same second and fourth moments" has A, two shells of $\matter M/2$ at $R/2$ and $\sqrt3R/2$, and B,
$\matter M/5$ at the centre and $4\matter M/5$ on a shell at $\sqrt{5/8}\,R$. Check that their
$\int\matter\rho\,r^2\,\dd V$ and $\int\matter\rho\,r^4\,\dd V$ agree, and find $\int\matter\rho\,|\nabla g|^2\,\dd V$
under $g = \mathrm{Re}\,(x + iy)^4/4$.

::: solution
Both have $\tfrac12\matter MR^2$ and $\tfrac{5}{16}\matter MR^4$. With $\langle\sin^6\theta\rangle = \tfrac{16}{35}$
and $\int\matter\rho\,r^6\,\dd V = \tfrac{7}{32}$ and $\tfrac{25}{128}\matter MR^6$, the integrals are $\tfrac{1}{10}$
and $\tfrac{5}{56}\matter MR^6$, 0.100 against 0.089.
:::

### Stretch

With chapter 2.5, show that the difference $\matter{\delta\rho} = \matter\rho_B - \matter\rho_A$ of the paper's pair is
$\nabla^4\field\psi_2/4\pi G$ with $\field\psi_2$ zero outside the ball of radius $R$.

::: solution
The solution of $\nabla^2\field\psi_1 = 4\pi G\matter{\delta\rho}$ vanishes outside $R$, because the round
$\matter{\delta\rho}$ has no mass. Then $\nabla^2\field\psi_2 = \field\psi_1$ has a solution that vanishes outside $R$
if $\int\field\psi_1\,\dd V = 0$, and Green's identity with $\nabla^2(r^2/6) = 1$ gives

$$\begin{aligned}
\int\field\psi_1\,\dd V &= \tfrac16\int r^2\,\nabla^2\field\psi_1\,\dd V\\
&= \tfrac{4\pi G}{6}\int r^2\,\matter{\delta\rho}\,\dd V = 0 .
\end{aligned}$$
:::

### The paper

Derive the paper's [](/paper/#eq:ladder-identity) and both lines of its [](/paper/#eq:proof-ladder), and use them to
show that a tide of degree two reaches $\int\matter\rho\,r^{\ell+2}Y_\ell\,\dd V$ for every $\ell$.

::: solution
The sections [on the reach](#no-tide-reaches-beyond-the-rungs-below-its-degree-whatever-is-read) and [on the
converse](#every-polynomial-on-the-ladder-is-reached) derive both. With $q = 2$ and $p = \ell + 2$, one Laplacian takes
the product of the gradients to a nonzero multiple of $(\vect a\cdot\vect b)^2(\vect a\cdot\vect x)^\ell$, so the
products reach $r^2H_\ell$ for every $H_\ell$, whose moments are $\int\matter\rho\,r^{\ell+2}Y_\ell\,\dd V$.
:::
:::

::: paper
- [*What a tide of a given degree reaches*](/paper/#par:what-a-tide-of-a-given-degree-reaches) (Section XIII): the
  paper's [](/paper/#eq:ladder) and [](/paper/#eq:ladder-identity), the pair, the null spaces and the triangular
  systems, with Figure [](/paper/#fig:ladder).
-  Appendix C, [*The reach of a tide of given degree*](/paper/#par:the-reach-of-a-tide-of-given-degree): the paper's
  [](/paper/#eq:proof-ladder); [*What the passes of a mass
  determine*](/paper/#par:what-the-passes-of-a-mass-determine): the Gegenbauer step.
- [*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading): the single sphere.
- Table [](/paper/#tab:hair), the row "Tides of degree up to $m$"; [Section XV](/paper/#sec:holography), where the
  paper's [](/paper/#eq:split) and [](/paper/#eq:ladder) "say which" interiors differ.
:::

::: deeper
- S. Axler, P. Bourdon and W. Ramey, *Harmonic Function Theory* (2nd edition, Springer, 2001), chapter 5, *Harmonic
  Polynomials*: the decomposition into $r^{2j}$ times harmonic polynomials, proved at this level.
- N. Aronszajn, T. M. Creese and L. J. Lipkin, *Polyharmonic Functions* (Oxford, 1983): Almansi's theorem and its
  relatives.
- The GR course's lesson
  [*Poisson from a flux*](https://neovand.github.io/general-relativity/chapter-12.html#poisson-from-a-flux) derives the
  Laplacian on which this chapter rests.
:::

[^m]: No mass here carries a bare $m$: the masses are $\matter M$ and $\matter\mu$. Chapter 2.2's patterns are
    written $Y_\ell$, without their order, as in Section XIII.

[^H]: $H_\ell$ is the letter of the paper's Appendix C, always with its subscript. It is not chapter 3.8's bits or a
    Hamiltonian.

[^almansi]: E. Almansi proved the theorem in 1899. The paper does not name it.

[^ab]: These $\vect a$ and $\vect b$ are not 13.2's position $\vect a$ across a camera or 13.1's impact point
    $\vect b$, neither of which appears here.

[^rank]: At degree $n$ the products $\nabla h\cdot\nabla g$ and the harmonic polynomials span $\sum(2n - 4j + 1)$
    dimensions, summed over $j < m$ with $n \ge 2j$, as computing the rank confirms for $m \le 3$ and $n \le 6$: 1,
    3, 6, 10, 14, 18 and 22 for $m = 2$.

[^strong]: 2.5's sense alone is not enough once $m \ge 2$. A $\field\psi$ equal to $(R^2 - r^2)^2$ times a constant
    inside $R$, and zero outside, meets it. But $\nabla^2\field\psi$ jumps at the surface from $8R^2$ times that
    constant to zero, and $\nabla^4\field\psi$, 120 times it inside, gives a density with a mass.

[^cone]: In 13.2's variables the Laplacian brings the factor $\kappa^2 - K^2$ to $e^{i\vect K\cdot\vect a - \kappa z}$,
    so the scene transforms differ by $(\kappa^2 - K^2)^m\tilde\psi/4\pi G$ and the second readings, by the paper's
    [](/paper/#eq:cone), by half of $(\kappa^2 - K^2)^{m+1}\tilde\psi/4\pi G$: both vanish on the cone $\kappa = K$,
    where one reading looks, more steeply as $m$ grows.

[^slip]: Such densities "differ under a tide of degree $m + 1$", as the paper says, unless $\field\psi$ is itself the
    Laplacian of a confined function. Only then is every $\int\field\psi\,\nabla^{2m}(r^{2m}H_\ell)\,\dd V$, a positive
    multiple of $\int\field\psi\,H_\ell\,\dd V$, zero. The paper's pair is such a case at $m = 1$: its difference is
    $\nabla^2\field\psi_1/4\pi G$ with $\field\psi_1 = \nabla^2\field\psi_2$, and every tide of degree two gives both
    $\tfrac13\matter MR^2$.

[^converse]: Conversely, a density $\matter{\delta\rho}$ that the field outside and every tide of degree up to $m$
    treat as zero is $\nabla^{2m}\field\psi/4\pi G$ with $\field\psi$ as above. By chapter
    [2.5](/tutorial/outside/null-space/#two-bodies-with-the-same-outside-differ-by-a-confined-laplacian) it is
    $\nabla^2\field\psi_1/4\pi G$ with $\field\psi_1$ confined. For $m \ge 2$, tides of degree two reach $r^2H_\ell$,
    so $\int\matter{\delta\rho}\,r^2H_\ell\,\dd V = 0$, and Green's identity turns this into
    $\int\field\psi_1H_\ell\,\dd V = 0$. So 2.5 applies to $\field\psi_1$ in turn:
    $\field\psi_1 = \nabla^2\field\psi_2$. Each degree repeats the step.

[^gegen]: Summed to $n = 40$, the series matches the kernel in the steel ball, for a mass 1.5 m from its centre, to
    one part in $10^{15}$, checked numerically. The coefficients are positive for every $n$: the connection formula
    $C^{(2)}_n = \sum_k\frac{(2)_{n-k}(3/2)_k(2n - 4k + 1)}{(3/2)_{n-k}\,k!}P_{n-2k}$, $0 \le k \le n/2$, with
    $(a)_k = a(a + 1)\cdots(a + k - 1)$, stated here without proof, has only positive factors.
