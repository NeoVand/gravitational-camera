---
id: '2.2'
title: 'Solid angle, spherical harmonics and Legendre polynomials'
question: "GOCE's map of the Earth's gravity runs out of signal between spherical harmonic degrees 280 and 300. What is the degree of a pattern on a sphere, and how is any pattern on the sky split into degrees?"
part: '2'
requires: ['1.3', '1.4', '1.5', '1.5b', '2.1']
paper: [sec:near-field, eq:tidal-column, fig:sky-integral, eq:handheld, eq:harmonic-point, eq:thermal-multipole, eq:hair-bits, fig:hair, eq:sky-count, sec:one-pixel, eq:ladder]
figures: []
live: [sky-patterns]
depth: A
---

For four years the satellite GOCE carried a gradiometer, an instrument that measures the tide, around the Earth at a
height of 254 km. The paper's [Section IV](/paper/#sec:near-field) reports, in its paragraph *A flown gradiometer*,
that the final map "runs out of signal between spherical harmonic degrees $\ell = 280$ and $300$". What is the degree
of a pattern on a sphere, and how is any pattern on the sky split into degrees?

Chapter 1.5 met the
[degree of a pattern on the sky](/tutorial/newton/five-numbers/#patterns-of-higher-degree-hold-7-9-and-more-numbers)
and counted $2\ell + 1$ numbers of each degree, but left the count unproved. The answer is a set of basic patterns,
the spherical harmonics. The paper uses them to say why one pixel reads only five numbers of its sky and how fine the
detail of a map of degree $\ell$ is.

::: plain
A pattern on the sky gives one number for each direction, such as how much matter lies that way. Any such pattern is
a sum of basic patterns, much as a musical sound is a sum of a note and its overtones. The basic patterns are called
spherical harmonics, and they come in families numbered by a whole number, the degree. Degree 0 is one constant
pattern, and degree $\ell$ has $2\ell + 1$ patterns.

A pattern of degree $\ell$ changes sign about every $180°/\ell$ across the sky, so a high degree means fine detail.
GOCE's map stops near degree 300, which on the Earth is detail about 70 km wide. The average over the sky of the
product of two patterns of different degree is zero. The tide at one pixel weighs the sky by a pattern of degree 2,
so a pixel learns only the five numbers of degree 2 of the matter around it.
:::

## A direction is two angles, and a small patch of sky has the solid angle $\sin\vartheta\,\dd\vartheta\,\dd\varphi$

We describe a point by its distance $r$ from the origin and by two angles. The **polar angle**
$\sym{polar-angle}{\vartheta}$ (a curly theta) is the angle between the direction of the point and the $z$ axis: 0 at
the north pole, $\pi/2$ on the equator, $\pi$ at the south pole. The **azimuth** $\sym{azimuth}{\varphi}$ (phi) is the
angle round the $z$ axis, measured in the $xy$ plane from the $x$ axis, anticlockwise as seen from the side toward
which $z$ points. Both are in radians, and $r$, $\vartheta$ and $\varphi$ together are the **spherical coordinates**
of the point. The point lies at the height $r\cos\vartheta$ above the $xy$ plane and at the distance $r\sin\vartheta$
from the $z$ axis, so the unit vector toward it is

$$\hat n = (\sin\vartheta\cos\varphi,\ \sin\vartheta\sin\varphi,\ \cos\vartheta).$$

The curly $\vartheta$ keeps the polar angle apart from the paper's $\theta = R/r$, the angular size of a body in its
equation [](/paper/#eq:tidal-brightness), and the azimuth $\varphi$ is not the potential $\field\Phi$.

Now increase $\vartheta$ by a small $\dd\vartheta$ and $\varphi$ by a small $\dd\varphi$. On the sphere of radius $r$
the point moves along a line of longitude by $r\,\dd\vartheta$, and round a circle of latitude, whose radius is
$r\sin\vartheta$, by $r\sin\vartheta\,\dd\varphi$. The two moves are at right angles, so the patch they sweep has the
area $r^2\sin\vartheta\,\dd\vartheta\,\dd\varphi$. Its solid angle is its area divided by $r^2$
([chapter 1.3](/tutorial/newton/gauss-and-poisson/#solid-angle-measures-how-large-a-patch-looks)), and a shell of
thickness $\dd r$ over the patch has the volume $r^2\,\dd r$ times that solid angle:

$$\boxed{\;\sym{solid-angle}{\dd\Omega} = \sin\vartheta\,\dd\vartheta\,\dd\varphi, \qquad \dd V = r^2\,\dd r\,\dd\Omega .\;} \label{eq:dOmega}$$

The second is the volume that chapter 1.5 used for the sky integral. Over the whole sky,

$$\int_0^{2\pi}\!\!\int_0^\pi \sin\vartheta\,\dd\vartheta\,\dd\varphi = 2\pi\times2 = 4\pi = 12.566 ,$$

the $4\pi$ steradians of chapter 1.3.

<!-- diagram: The small spherical box between r and r + dr, ϑ and ϑ + dϑ, φ and φ + dφ, drawn on a sphere with the z axis and the x axis, with its three pairs of faces shaded and its three edges labelled dr, r dϑ (along the line of longitude) and r sinϑ dφ (round the circle of latitude, whose radius r sinϑ is drawn from the z axis). -->

## The Laplacian splits into a part along the radius and a part on the sphere

We want the Laplacian $\nabla^2 f = \partial_i\partial_i f$ of chapter 1.3 in spherical coordinates, because the
patterns we are after live on spheres. We assume that **$f$ is smooth**. Chapter 1.3 found the divergence of a field as
the flux out of a small box divided by the box's volume, and the Laplacian is the divergence of the gradient. The same
method, used on the box of the last section, gives (derivation below)

$$\boxed{\;\begin{aligned}
\nabla^2 f &= \frac{1}{r^2}\frac{\partial}{\partial r}\Bigl(r^2\frac{\partial f}{\partial r}\Bigr) +
\frac{1}{r^2}\,\nabla_\Omega^2 f,\\ \nabla_\Omega^2 f &=
\frac{1}{\sin\vartheta}\frac{\partial}{\partial\vartheta}\Bigl(\sin\vartheta\,\frac{\partial
f}{\partial\vartheta}\Bigr)\\ &\qquad + \frac{1}{\sin^2\vartheta}\frac{\partial^2 f}{\partial\varphi^2}.
\end{aligned}\;} \label{eq:laplacian}$$

The second line defines the **Laplacian on the sphere** $\sym{sphere-laplacian}{\nabla_\Omega^2}$. It differentiates
only with respect to the two angles, so it acts on a pattern on the sky, a function of the direction alone, and it
has no unit. The factor $1/r^2$ in front of it gives $\nabla^2 f$ the unit of $f$ per square metre.

Two checks come from chapter 1.3. For $f = r^2$ the formula gives $(1/r^2)\,\partial_r(r^2\cdot2r) = 6$, as the three
second derivatives along the axes do. For $f = 1/r$ the bracket $r^2\,\partial_r(1/r) = -1$ is a constant, so
$\nabla^2(1/r) = 0$ wherever $r > 0$.

::: derivation
### The flux of the gradient out of a spherical box

A step $\dd r$ moves the point by $\dd r$, a step $\dd\vartheta$ by $r\,\dd\vartheta$ and a step $\dd\varphi$ by
$r\sin\vartheta\,\dd\varphi$. So the components of $\nabla f$ along the radius, the line of longitude and the circle of
latitude are $\partial_r f$, $(1/r)\,\partial_\vartheta f$ and $\partial_\varphi f/(r\sin\vartheta)$. The faces at $r$
and $r + \dd r$ have the area $r^2\sin\vartheta\,\dd\vartheta\,\dd\varphi$, the faces at $\vartheta$ and $\vartheta +
\dd\vartheta$ the area $r\sin\vartheta\,\dd r\,\dd\varphi$, and the faces at $\varphi$ and $\varphi + \dd\varphi$ the
area $r\,\dd r\,\dd\vartheta$. The volume is $r^2\sin\vartheta\,\dd r\,\dd\vartheta\,\dd\varphi$.

In chapter 1.3 opposite faces had equal areas. Here they do not (the face at $r + \dd r$ is the larger), so the net
flux out through a pair of opposite faces is the change, across the box, of the component times the area, and we
differentiate that product. For the pair at $r$ and
$r + \dd r$ the product is $r^2\,\partial_r f\,\sin\vartheta\,\dd\vartheta\,\dd\varphi$, and its change across
$\dd r$ is

$$\partial_r\bigl(r^2\,\partial_r f\bigr)\,\sin\vartheta\;\dd r\,\dd\vartheta\,\dd\varphi .$$

For the pair at $\vartheta$ and $\vartheta + \dd\vartheta$ the product is
$\sin\vartheta\,\partial_\vartheta f\,\dd r\,\dd\varphi$, and for the pair at $\varphi$ and $\varphi + \dd\varphi$ it
is $\partial_\varphi f\,\dd r\,\dd\vartheta/\sin\vartheta$. Their changes across $\dd\vartheta$ and $\dd\varphi$ are

$$\begin{gathered}
\partial_\vartheta\bigl(\sin\vartheta\,\partial_\vartheta f\bigr)\;\dd r\,\dd\vartheta\,\dd\varphi ,\\
\frac{1}{\sin\vartheta}\,\partial_\varphi^2 f\;\dd r\,\dd\vartheta\,\dd\varphi .
\end{gathered}$$

We add the three and divide by the volume. The three terms become the three terms of [](#eq:laplacian).
:::

## Each pattern of one degree gives two harmonic functions, the solid harmonics

A **harmonic function** is a solution of Laplace's equation, $\nabla^2 f = 0$ (chapter 2.1). We want the harmonic
functions that are a power of $r$ times a pattern on the sky, $f = r^n\,Y(\hat n)$, where $n$ is any real number and
$Y$ depends only on the direction. In [](#eq:laplacian) the radial part gives
$(1/r^2)\,\partial_r(r^2\cdot nr^{n-1})\,Y = n(n+1)\,r^{n-2}\,Y$, and the part on the sphere acts on $Y$ alone, so

$$\nabla^2\bigl(r^nY\bigr) = r^{n-2}\bigl[n(n+1)\,Y + \nabla_\Omega^2 Y\bigr]. \label{eq:rnY}$$

So $r^nY$ is harmonic exactly when $\nabla_\Omega^2 Y = -n(n+1)\,Y$. With $Y = 1$ the formula gives
$\nabla^2 r^n = n(n+1)\,r^{n-2}$, which is 6 for $n = 2$ and 0 for $n = -1$, as in the two checks.

Chapter 1.5's patterns pass this test. It called $Y = T_{i_1\cdots i_\ell}\,\hat n_{i_1}\cdots\hat n_{i_\ell}$, with
$T$ a symmetric trace-free table of $\ell$ indices, a pattern of **degree** $\sym{degree}{\ell}$. Multiplied by
$r^\ell$, it becomes $T_{i_1\cdots i_\ell}\,x_{i_1}\cdots x_{i_\ell}$, a polynomial whose terms all have the degree
$\ell$; such a polynomial is called **homogeneous**. We differentiate it. Because $T$ is symmetric, each of the $\ell$
factors gives the same term:

$$\begin{aligned}
\partial_k\bigl(T_{i_1\cdots i_\ell}\,x_{i_1}\cdots x_{i_\ell}\bigr) &= \ell\,T_{k\,i_2\cdots i_\ell}\,x_{i_2}\cdots
x_{i_\ell},\\ \partial_k\partial_k\bigl(T_{i_1\cdots i_\ell}\,x_{i_1}\cdots x_{i_\ell}\bigr) &= \ell(\ell -
1)\,T_{kk\,i_3\cdots i_\ell}\,x_{i_3}\cdots x_{i_\ell}. \end{aligned}$$

The table $T_{kk\,i_3\cdots i_\ell}$ is a trace of $T$, which is zero, so $r^\ell Y$ is harmonic. Then
[](#eq:rnY) with $n = \ell$ gives

$$\boxed{\;\nabla_\Omega^2 Y = -\ell(\ell + 1)\,Y \quad\text{for every pattern } Y \text{ of degree } \ell .\;} \label{eq:eigen}$$

For $\ell = 1$ and $Y = \cos\vartheta$ we check it directly:
$(1/\sin\vartheta)\,\partial_\vartheta(-\sin^2\vartheta) = -2\cos\vartheta$, which is $-\ell(\ell + 1) = -2$ times
$Y$.

The two lines also run backwards, because every homogeneous polynomial comes from exactly one symmetric table: $xy$,
for example, is $T_{ij}x_ix_j$ with $T_{xy} = T_{yx} = \tfrac12$ and every other entry zero. (The coefficient of a
monomial collects the entries whose indices are reorderings of one another, which are equal, so each entry is that
coefficient divided by the number of reorderings.) The second line then shows that a homogeneous polynomial is
harmonic only if its table is trace-free, so the harmonic polynomials of degree $\ell$ of chapter 2.1 are exactly
$r^\ell$ times the patterns of degree $\ell$.

The equation $n(n+1) = \ell(\ell+1)$ has two solutions, $n = \ell$ and $n = -\ell - 1$, because
$(-\ell - 1)(-\ell) = \ell(\ell + 1)$. So each pattern $Y_\ell$ of degree $\ell$ gives two harmonic functions,

$$\boxed{\;r^\ell\,Y_\ell \qquad\text{and}\qquad \frac{Y_\ell}{r^{\ell+1}} ,\;} \label{eq:solid}$$

the **solid harmonics** of degree $\ell$. The first is finite at the origin and grows outward. The second is infinite
at the origin and fades far away. For degree 0 they are 1 and $1/r$. For degree 1 they are $z$ and
$z/r^3 = -\partial_z(1/r)$. For degree 2, with $Y = 3\cos^2\vartheta - 1$, they are $3z^2 - r^2$ and
$(3z^2 - r^2)/r^5$, which is chapter 1.4's second derivative $\partial_z^2(1/r)$.

## There are $2\ell + 1$ patterns of each degree

A symmetric table of $\ell$ indices has $(\ell + 1)(\ell + 2)/2$ entries, one for each **monomial** $x^ay^bz^c$ with
$a + b + c = \ell$, and its traces form a symmetric table with $(\ell - 1)\ell/2$ entries. Chapter 1.5's count
assumed that setting the traces to zero imposes that many independent conditions.

The second line of the last section's differentiation says that the Laplacian of the polynomial of $T$ is
$\ell(\ell - 1)$ times the polynomial of the trace of $T$. So taking the trace is, up to that factor, the Laplacian,
and "the trace conditions are independent" means "the Laplacian reaches every homogeneous polynomial of degree
$\ell - 2$". The Laplacian acts on lists of coefficients as a matrix, and the vectors a matrix sends to zero form a
space whose dimension is the dimension it starts from minus the dimension it reaches. If the Laplacian reaches
everything, this gives

$$\frac{(\ell + 1)(\ell + 2)}{2} - \frac{(\ell - 1)\ell}{2} = 2\ell + 1$$

independent harmonic polynomials of degree $\ell$, and so $2\ell + 1$ patterns.

For $\ell = 2$ we check this by hand. The six quadratics $x^2$, $y^2$, $z^2$, $xy$, $yz$, $zx$ have the Laplacians
2, 2, 2, 0, 0, 0, so every constant is reached, and the harmonic quadratics form a space of dimension $6 - 1 = 5$.
The box proves the general case. With it, 1.5's counts stand: 25 patterns up to degree four, the paper's sky of
[Section VIII](/paper/#sec:one-pixel), and 169 up to degree twelve, the beads of Figure [](/paper/#fig:hair).

::: derivation
### The Laplacian reaches every polynomial of degree $\ell - 2$

For two homogeneous polynomials $p$ and $q$ of the same degree, we define the number $\langle p, q\rangle$: in $p$,
replace $x$, $y$, $z$ by $\partial_x$, $\partial_y$, $\partial_z$, and apply the derivative that results to $q$.
Applied to the monomial $x^{a'}y^{b'}z^{c'}$ of the same degree, $\partial_x^a\partial_y^b\partial_z^c$ gives
$a!\,b!\,c!$ if $(a, b, c) = (a', b', c')$ and 0 otherwise. So, with $p_{abc}$ and $q_{abc}$ the coefficients of the
two polynomials,

$$\langle p, q\rangle = \sum_{a+b+c=\ell} a!\,b!\,c!\;p_{abc}\,q_{abc} .$$

This is a dot product of the two lists of coefficients, with positive weights. It is symmetric, and
$\langle p, p\rangle > 0$ unless $p = 0$.

Now let $p$ have the degree $\ell - 2$ and $q$ the degree $\ell$. In the polynomial $r^2p$, with
$r^2 = x^2 + y^2 + z^2$, the replacement turns $r^2$ into $\nabla^2$. Partial derivatives commute, so

$$\langle r^2p, q\rangle = p(\partial)\,\nabla^2q = \langle p, \nabla^2q\rangle .$$

Suppose that $\nabla^2$ misses some polynomial of degree $\ell - 2$. Then the polynomials it reaches form a smaller
space, and some nonzero $p$ of degree $\ell - 2$ is at right angles to all of them: $\langle p, \nabla^2q\rangle = 0$
for every $q$. By the identity, $\langle r^2p, q\rangle = 0$ for every $q$, and the choice $q = r^2p$ gives
$\langle r^2p, r^2p\rangle = 0$, so $r^2p = 0$. A product of two nonzero polynomials is not zero, so $p = 0$, which
contradicts the choice of $p$. So $\nabla^2$ reaches every polynomial of degree $\ell - 2$.
:::

::: gap
The argument uses two facts of linear algebra without proof: the count of the vectors a matrix sends to zero, and
the fact that a subspace smaller than the whole space has a nonzero vector at right angles to all of it, which the
Gram–Schmidt construction provides.
:::

## The patterns symmetric about an axis are the Legendre polynomials, and the inverse distance generates them

The potential of a point mass holds every degree at once. Take a point $\vect x$ at the distance $r$ from the origin
and a point $\vect y$ at the smaller distance $r'$, let $\gamma$ be the angle between their directions, and write
$\mu = \cos\gamma$ and $t = r'/r$, a ratio smaller than 1 (not a time). By the law of cosines,
$|\vect x - \vect y|^2 = r^2 - 2rr'\mu + r'^2$, so

$$\frac{1}{|\vect x - \vect y|} = \frac{1}{r\sqrt{1 - 2t\mu + t^2}} .$$

We expand in powers of $t$. Each coefficient is a polynomial in $\mu$, and we call the coefficient of $t^\ell$ the
**Legendre polynomial** $\sym{legendre}{P_\ell}(\mu)$:

$$\boxed{\;\begin{aligned}
\frac{1}{\sqrt{1 - 2t\mu + t^2}} &= \sum_{\ell=0}^{\infty} t^\ell P_\ell(\mu),\\
\frac{1}{|\vect x - \vect y|} &= \sum_{\ell=0}^{\infty}\frac{r'^{\,\ell}}{r^{\ell+1}}\,P_\ell(\cos\gamma) .
\end{aligned}\;} \label{eq:generating}$$

The function on the left is the **generating function** of the Legendre polynomials. We state without proof that the
series converges whenever $t < 1$, and that it may be differentiated term by term there.

The binomial series $(1 - u)^{-1/2} = 1 + \tfrac12u + \tfrac38u^2 + \tfrac5{16}u^3 + \dots$, whose coefficients are
all positive, gives the polynomials with $u = 2t\mu - t^2$. The terms in $t^2$, for example, are $-\tfrac12t^2$ from
$\tfrac12u$ and $\tfrac32t^2\mu^2$ from $\tfrac38u^2$. Collecting each power of $t$,

$$P_0 = 1, \qquad P_1 = \mu, \qquad P_2 = \tfrac12\bigl(3\mu^2 - 1\bigr), \qquad P_3 = \tfrac12\bigl(5\mu^3 - 3\mu\bigr).$$

At $\mu = 1$ the left side is $1/(1 - t) = 1 + t + t^2 + \dots$, so $P_\ell(1) = 1$ for every $\ell$.

The same series shows which powers of $\mu$ each $P_\ell$ holds. The term $u^k = t^k(2\mu - t)^k$ reaches $t^\ell$
only by taking $t^{\ell-k}$ from the bracket, which leaves the power $\mu^{2k-\ell}$, so $\ell/2 \le k \le \ell$. So
$P_\ell$ holds only $\mu^\ell$, $\mu^{\ell-2}$, and so on down, and $P_\ell(-\mu) = (-1)^\ell P_\ell(\mu)$. The top
power $\mu^\ell$ comes from $k = \ell$ alone, with $2^\ell$ times a positive coefficient of the series, so $P_\ell$ has
the degree $\ell$ exactly.

<!-- diagram: P0 to P4 against μ from −1 to 1 on one pair of axes, each curve labelled at its right end, where all equal 1; the zero of P2 at μ = 1/√3 marked with a tick and the angle 54.7°. -->

We want to show that $P_\ell(\cos\gamma)$ is a pattern of degree $\ell$. Fix $\vect x$ and treat
$1/|\vect x - \vect y|$ as a function of $\vect y$, for $r' < r$. It is harmonic there (chapter 1.3). We use spherical
coordinates for $\vect y$ with the polar axis along $\vect x$, so that $\gamma$ is the polar angle of $\vect y$, and
apply [](#eq:rnY) with $n = \ell$ to each term of [](#eq:generating):

$$0 = \nabla_{\vect y}^2\,\frac{1}{|\vect x - \vect y|} = \sum_{\ell=0}^{\infty}\frac{r'^{\,\ell-2}}{r^{\ell+1}}\Bigl[\ell(\ell + 1)\,P_\ell + \nabla_\Omega^2 P_\ell\Bigr].$$

The terms $\ell = 0$ and 1 are zero already, because $P_0 = 1$ and $\nabla_\Omega^2\cos\gamma = -2\cos\gamma$. At a
fixed direction the rest is a series in the powers $r'^0, r'^1, \dots$ that vanishes for every $r'$ between 0 and
$r$. Setting $r' = 0$ shows that its first coefficient is zero, and dividing by $r'$ and repeating shows the same for
every coefficient. So $\nabla_\Omega^2 P_\ell = -\ell(\ell + 1)\,P_\ell$. Each term $r'^{\,\ell}P_\ell$ is also a
polynomial in the components of $\vect y$, because every power of $\mu$ in $P_\ell$ is $\mu^{\ell-2k}$ with
$\ell - 2k \ge 0$, and $r'^{\,\ell}\mu^{\ell - 2k} = (\hat{\vect x}\cdot\vect y)^{\ell - 2k}\,(\vect y\cdot\vect y)^k$.
So $r'^{\,\ell}P_\ell$ is a harmonic polynomial of degree $\ell$, and $P_\ell(\hat{\vect x}\cdot\hat n)$ is a pattern
of degree $\ell$ that does not change when the sky is turned about $\hat{\vect x}$: an **axially symmetric** pattern.
The next section states that it is the only one of its degree, up to a factor. Chapter 2.3 builds the multipole
expansion on [](#eq:generating).

The polynomial $P_2$ vanishes where $3\mu^2 = 1$, at $\mu = 1/\sqrt3$, an angle of 54.7°. This is the angle of
chapter 1.5 at which the weight $1 - 3\cos^2\vartheta$ of $\curv{\tE}_{zz}$ changes sign, and the reason is that the
weight is $-2P_2(\cos\vartheta)$. At $\vartheta = 0.9$ both give $-0.159$.

## Patterns of different degree are orthogonal, and every pattern is a sum of them

For two patterns $f$ and $g$ on the sky we use the integral $\oint f^*g\,\dd\Omega$ over all directions, where the
star is the complex conjugate of
[chapter 1.5b](/tutorial/newton/complex-numbers/#a-complex-number-is-a-point-of-the-plane-that-can-be-multiplied)
(for real patterns the star does nothing). It plays the part of the dot product of chapter 1.1, with one entry for
each direction. Two patterns are **orthogonal** when this integral is zero.

We want to show that **patterns of different degree are orthogonal**. Let $Y_\ell$ have the degree $\ell$ and
$Y_{\ell'}$ the degree $\ell' \neq \ell$. We use chapter 2.1's Green's second identity in the ball of radius 1 round
the origin, with $u = r^\ell\,Y_\ell^*$ and $v = r^{\ell'}\,Y_{\ell'}$. Both are harmonic polynomials (the conjugate
of a harmonic polynomial is harmonic, because the Laplacian has real coefficients), so the integral over the ball is
zero. On the surface the outward derivative is $\partial_r$, with $\partial_r u = \ell\,Y_\ell^*$ and
$\partial_r v = \ell'\,Y_{\ell'}$ at $r = 1$, and the area element is $\dd\Omega$. The surface side of the identity is
then

$$0 = \oint\bigl(u\,\partial_r v - v\,\partial_r u\bigr)\,\dd\Omega = (\ell' - \ell)\oint Y_\ell^*\,Y_{\ell'}\,\dd\Omega ,$$

and since $\ell' \neq \ell$,

$$\boxed{\;\oint Y_\ell^*\,Y_{\ell'}\,\dd\Omega = 0 \qquad (\ell \neq \ell').\;} \label{eq:orth}$$

With $\mu = \cos\vartheta$ we have $\sin\vartheta\,\dd\vartheta = -\dd\mu$, so for the Legendre polynomials
$\int_{-1}^{1}P_\ell P_{\ell'}\,\dd\mu$ is exactly zero when $\ell' \neq \ell$. When $\ell' = \ell$ it is
$2/(2\ell + 1)$, which we state and check in the practice problem for $\ell = 2$.

Within one degree the patterns can be chosen orthogonal too. With chapter 1.5b's
$x \pm iy = r\sin\vartheta\,e^{\pm i\varphi}$, the five harmonic quadratics

$$(x + iy)^2, \quad z(x + iy), \quad 3z^2 - r^2, \quad z(x - iy), \quad (x - iy)^2$$

(for the first, $\nabla^2(x + iy)^2 = 2 + 2i^2 = 0$) become, divided by $r^2$, patterns that depend on $\varphi$ only
through $e^{im\varphi}$, with $m = 2, 1, 0, -1, -2$. Two with different $m$ are orthogonal, because
$\int_0^{2\pi}e^{i(m' - m)\varphi}\,\dd\varphi = 0$: by
[Euler's formula](/tutorial/newton/complex-numbers/#eulers-formula-a-turn-is-an-exponential) it is the integral of a
cosine and a sine over whole turns.

We state without proof that the same holds in every degree: **each degree $\ell$ has exactly one pattern, up to a
constant factor, for each whole number $m$ from $-\ell$ to $\ell$**. Times $r^\ell$, it is $(x + iy)^m$, or
$(x - iy)^{|m|}$ for negative $m$, times a polynomial in $z$ and $r^2$, so $|m|$ cannot exceed $\ell$, and the
$2\ell + 1$ values of $m$ agree with the count above. A pattern unchanged by turns about the $z$ axis has $m = 0$, so
each degree has one axially symmetric pattern.

Scaled so that the integral of $|Y|^2$ over the sky is 1, these patterns are the **spherical harmonics**
$\sym{spherical-harmonic}{Y_{\ell m}}$. The whole number $\sym{order}{m}$ is the **order** of the pattern: the real
part of $Y_{\ell m}$ goes through $|m|$ whole waves round the $z$ axis. Here $m$ is never a mass; masses in this
chapter are written $\matter M$. The spherical harmonics are **orthonormal**, orthogonal and of unit length:

$$\boxed{\;\oint Y_{\ell m}^*\,Y_{\ell'm'}\,\dd\Omega = \delta_{\ell\ell'}\,\delta_{mm'} .\;}$$

Up to degree two they are

$$\begin{aligned}
Y_{00} &= \sqrt{\tfrac{1}{4\pi}},\\
Y_{10} &= \sqrt{\tfrac{3}{4\pi}}\,\cos\vartheta,\\
Y_{1,\pm1} &= \mp\sqrt{\tfrac{3}{8\pi}}\,\sin\vartheta\,e^{\pm i\varphi},\\
Y_{20} &= \sqrt{\tfrac{5}{16\pi}}\,\bigl(3\cos^2\vartheta - 1\bigr),\\
Y_{2,\pm1} &= \mp\sqrt{\tfrac{15}{8\pi}}\,\sin\vartheta\cos\vartheta\,e^{\pm i\varphi},\\
Y_{2,\pm2} &= \sqrt{\tfrac{15}{32\pi}}\,\sin^2\vartheta\,e^{\pm2i\varphi} .
\end{aligned}$$

The factor of $Y_{20}$, for example, follows from $\oint(3\cos^2\vartheta - 1)^2\,\dd\Omega =
2\pi\int_{-1}^{1}(3\mu^2 - 1)^2\,\dd\mu = 2\pi\times\tfrac85 = \tfrac{16\pi}{5}$, so it is
$\sqrt{5/16\pi} = 0.315$.[^cs] For any degree, stated without derivation,

$$\begin{aligned}
Y_{\ell m} &= \sqrt{\frac{2\ell + 1}{4\pi}\,\frac{(\ell - m)!}{(\ell + m)!}}\;P_\ell^m(\cos\vartheta)\,e^{im\varphi},\\
P_\ell^m(\mu) &= (-1)^m\bigl(1 - \mu^2\bigr)^{m/2}\,\frac{\dd^mP_\ell}{\dd\mu^m}
\end{aligned}$$

for $m \ge 0$, with $Y_{\ell,-m} = (-1)^mY_{\ell m}^*$. The functions $P_\ell^m$ are the **associated Legendre
functions**. For $m = 0$ the formula gives $Y_{\ell0} = \sqrt{(2\ell + 1)/4\pi}\,P_\ell(\cos\vartheta)$.

<!-- diagram: The real parts of Y_lm for l = 0, 1, 2, 3 drawn on spheres, orange where positive and blue where negative (the paper's sign colours, used here only for the sign of a pattern, as the caption says), arranged in a triangle with one row per degree and m running from −l to l across each row, so that rows hold 1, 3, 5 and 7 spheres. -->

Now we can split a pattern into degrees. Any pattern $f(\hat n)$ on the sky is a sum

$$\boxed{\;\begin{aligned}
f(\hat n) &= \sum_{\ell=0}^{\infty}\sum_{m=-\ell}^{\ell}\sym{harmonic-coefficient}{a_{\ell m}}\,Y_{\ell m}(\hat n),\\
a_{\ell m} &= \oint Y_{\ell m}^*\,f\,\dd\Omega .
\end{aligned}\;} \label{eq:expand}$$

The rule for the coefficients $a_{\ell m}$ of $f$ follows from orthonormality: multiply the sum by $Y_{\ell'm'}^*$ and
integrate over the sky, and only the term with $\ell = \ell'$ and $m = m'$ survives. The coefficients have the unit
of $f$. That every pattern can be written in this way, with an error whose average square over the sky goes to zero
as more degrees are added, is the **completeness** of the spherical harmonics, which we state without proof.

An example is the weight of $\curv{\tE}_{zz}$. It is $1 - 3\cos^2\vartheta = -2P_2(\cos\vartheta) =
-2\sqrt{4\pi/5}\;Y_{20}$, so its only coefficient is $-3.17$, on $Y_{20}$. A non-example is the hemisphere pattern,
$+1$ where $z > 0$ and $-1$ where $z < 0$. It does not depend on $\varphi$, so the integral over $\varphi$ removes
every $m \neq 0$. It is odd, changing sign when $\hat n$ becomes $-\hat n$, while $P_\ell$ is even for even $\ell$, so
the even coefficients vanish. For odd $\ell$ the two hemispheres add:

$$\begin{aligned}
a_{\ell0} &= 2\pi\sqrt{\frac{2\ell + 1}{4\pi}}\left(\int_0^1P_\ell\,\dd\mu - \int_{-1}^0P_\ell\,\dd\mu\right)\\
&= 4\pi\sqrt{\frac{2\ell + 1}{4\pi}}\int_0^1P_\ell\,\dd\mu .
\end{aligned}$$

With $\int_0^1P_\ell\,\dd\mu = \tfrac12$, $-\tfrac18$ and $\tfrac1{16}$ for $\ell = 1$, 3 and 5, these are 3.07,
$-1.17$ and 0.73. No finite number of degrees is enough, because each $Y_{\ell m}$ is a polynomial in the components
of $\hat n$, so a finite sum cannot jump as this pattern does at the equator. A sharp edge needs infinitely many
degrees.

Together with the solid harmonics, this shows what a potential looks like where there is no matter. Take an empty
**shell**, the region between two spheres about the origin, and expand the potential on each sphere of radius $r$ in
it, $f = \sum a_{\ell m}(r)\,Y_{\ell m}$. We apply [](#eq:laplacian) term by term (allowed for a smooth potential,
which we state without proof) and use [](#eq:eigen):

$$\begin{aligned}
0 = \nabla^2 f &= \sum_{\ell, m}\frac{1}{r^2}\Bigl[\bigl(r^2a_{\ell m}'\bigr)'\\
&\qquad - \ell(\ell + 1)\,a_{\ell m}\Bigr]Y_{\ell m} .
\end{aligned}$$

By orthonormality each bracket is zero. We write $a_{\ell m} = r^\ell b$, and the bracket becomes
$r^{-\ell}\bigl(r^{2\ell+2}b'\bigr)'$. So $r^{2\ell+2}b'$ is a constant, $b$ is a constant plus a multiple of
$r^{-2\ell-1}$, and

$$\boxed{\;a_{\ell m}(r) = A_{\ell m}\,r^\ell + \frac{B_{\ell m}}{r^{\ell+1}} ,\;}$$

with constants $A_{\ell m}$ and $B_{\ell m}$: the two powers of [](#eq:rnY). In an empty shell the potential is a sum
of both kinds of solid harmonics. In an empty ball about the origin, such as the space round a camera whose sources
are all far away, every $B_{\ell m}$ is zero, because $Y_{\ell m}/r^{\ell+1}$ is infinite at the centre. Outside all
matter, where the potential falls to zero far away, every $A_{\ell m}$ is zero. For $\ell = 0$ in a ball, the average
over each sphere is the constant $A_{00}/\sqrt{4\pi}$, chapter 2.1's mean value property.

## A pattern of degree $\ell$ has features about $\pi/\ell$ wide

We want to know how fine the detail of degree $\ell$ is. The real part of $Y_{\ell\ell}$ is a constant times
$\sin^\ell\vartheta\cos(\ell\varphi)$, which goes through exactly $\ell$ waves round the equator. The Legendre
polynomial $P_\ell(\cos\vartheta)$ has $\ell$ zeros between the poles, spaced by close to $180°/\ell$: for $P_{10}$
they lie at 13°, 30°, 47°, 64°, …, 17° apart.

The general reason is [](#eq:eigen). On a sphere of radius $R$, in metres, the part of $\nabla^2$ along the sphere is
$(1/R^2)\nabla_\Omega^2$, so for a pattern of degree $\ell$ it gives $-\ell(\ell + 1)/R^2$ times the pattern. A small
piece of the sphere is nearly flat, and there a wave $\cos(kx)$, with $x$ the distance along the ground, has the
second derivative $-k^2\cos(kx)$. Here $k$ is the **wavenumber**, $2\pi$ divided by the distance between crests, in
$\mathrm{m^{-1}}$, as in chapter 3.7. So a pattern of degree $\ell$ is locally a wave with

$$k = \frac{\sqrt{\ell(\ell + 1)}}{R} \approx \frac{\ell + \tfrac12}{R} .$$

The paper's *A flown gradiometer* rounds this to $\ell/R$. The estimate's small parameter is $1/\ell$: at degree 280
the extra half changes $k$ by 0.2%. At degree 1 it fails, because $\sqrt2 = 1.41$ is 41% larger than 1, and a
pattern of degree 1 spans the whole sphere, so it is not a local wave. For large $\ell$ the crests are $2\pi R/\ell$
apart, and the pattern changes sign about every $\pi/\ell$ radians:

$$\boxed{\;k \approx \frac{\ell}{R}, \qquad \text{features about } \frac{\pi R}{\ell} \text{ wide} .\;}$$

For GOCE, with the Earth's radius $R = 6371$ km, degree 280 has a wavelength of 143 km and features 71 km wide;
degree 300 gives 133 km and 67 km. GOCE flew at the height $z = 254$ km, 1.8 times the distance between crests of
degree 280. In chapter 3.7, where $z$ is the depth of the sources below the
sensors, a ripple of wavenumber $k$ fades over that distance as $e^{-kz}$. Here $kz = 280\times254/6371 = 11.2$, so
the ripple of degree 280 reaches the satellite weakened by $e^{-11.2} = 1.4\times10^{-5}$. Chapter 3.7
[turns $kz$ into GOCE's sensitivity](/tutorial/noise/blur-law/#what-the-law-means). On a camera's own sky the same
rule gives the paper's finest detail $\Delta\theta \approx \pi/\ell_{\max}$ (equation [](/paper/#eq:handheld)).

<!-- diagram: A great circle of the Earth with 280 crests of a pattern of degree 280 drawn as a ripple on it, and an enlarged inset of one arc showing one wavelength, 143 km, against GOCE's height of 254 km above the ground, both drawn to the same scale. -->

## The addition theorem turns a sum over $m$ into one Legendre polynomial

The paper often sums over the $2\ell + 1$ orders of one degree. The **addition theorem**, stated here without proof,
does such sums:

$$\boxed{\;\sum_{m=-\ell}^{\ell} Y_{\ell m}^*(\hat n)\,Y_{\ell m}(\hat n') = \frac{2\ell + 1}{4\pi}\,P_\ell(\hat n\cdot\hat n') .\;} \label{eq:addition}$$

It is plausible for two reasons. First, the left side does not change when both directions are turned together. A
turn mixes the $Y_{\ell m}$ of one degree among themselves by a matrix, and it leaves $\oint|f|^2\,\dd\Omega =
\sum_m|a_{\ell m}|^2$ unchanged. So the matrix keeps the length of every list of coefficients, as a turn kept the
[length of a table](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length)
in chapter 1.5, and with it the dot product of the lists $Y_{\ell m}(\hat n)$ and $Y_{\ell m}(\hat n')$, which is the
left side. So the left side depends only on the angle between $\hat n$ and $\hat n'$. Second, as a function of
$\hat n'$ it is a pattern of degree $\ell$ unchanged by turns about $\hat n$, and the only such pattern, up to a
factor, is $P_\ell(\hat n\cdot\hat n')$. Setting $\hat n' = \hat n$ and integrating over the sky fixes the factor:
the left side gives $2\ell + 1$, and the right side the factor times $4\pi$.

We check it for $\ell = 1$ by hand. The terms with $m = \pm1$ give
$\tfrac{3}{8\pi}\sin\vartheta\sin\vartheta'\bigl(e^{-i(\varphi - \varphi')} + e^{i(\varphi - \varphi')}\bigr) =
\tfrac{3}{4\pi}\sin\vartheta\sin\vartheta'\cos(\varphi - \varphi')$, and the term with $m = 0$ gives
$\tfrac{3}{4\pi}\cos\vartheta\cos\vartheta'$. The sum is $\tfrac{3}{4\pi}\,\hat n\cdot\hat n'$, which is the right side
with $P_1(\mu) = \mu$. At $\hat n' = \hat n$ the theorem says that $\sum_m|Y_{\ell m}|^2 = (2\ell + 1)/4\pi$ in every
direction, 0.398 for $\ell = 2$: the sum over one degree is perfectly round. This is why the paper's sums over $m$, as
in [](/paper/#eq:thermal-multipole), do not depend on the choice of axes.

## A pixel reads only degree two of its sky

Chapter 1.5 wrote the tide at one pixel as the paper's sky integral, with $S(\hat n) = \int\matter\rho\,\dd r/r$ the
tidal column in the direction $\hat n$:

{{paper eq:tidal-column}}

For fixed $i$ and $j$, the weight is $\delta_{ij} - 3\hat n_i\hat n_j = -3\bigl(\hat n_i\hat n_j -
\tfrac13\delta_{ij}\bigr) = -3\,\Pi_{ijkl}\,\hat n_k\hat n_l$, where $\Pi_{ijkl}$ is chapter 1.5's
[projector](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length).
With $i$ and $j$ held fixed it is a table in $k$ and $l$ that is symmetric and trace-free ($\Pi_{ijkk} = \delta_{ij} -
\delta_{ij} = 0$). So each entry of the weight is a pattern of degree two, with no constant part. We expand the tidal
column by [](#eq:expand), with coefficients $a_{\ell m}$ of $S$. By [](#eq:orth), every degree other than two integrates
to zero against the weight, so

$$\curv{\tE}_{ij} = G\sum_{m=-2}^{2} a_{2m}\oint\bigl(\delta_{ij} - 3\hat n_i\hat n_j\bigr)\,Y_{2m}\,\dd\Omega .$$

A pixel learns five numbers of its sky, the coefficients $a_{2m}$ of degree two of $S$, and nothing of any other
degree. This completes chapter 1.5's paper problem, where degrees 0 and 1 were shown to give nothing. For the $zz$
entry, the weight is $-2\sqrt{4\pi/5}\,Y_{20}$ and $Y_{20}$ is real, so $\curv{\tE}_{zz} = -3.17\,G\,a_{20}$.

We check this on a point mass $\matter M$ at the distance $r_0$ on the $z$ axis. Its column is concentrated in the one
direction $\hat z$. By [](#eq:dOmega), $S\,\dd\Omega = \matter\rho\,\dd r\,\dd\Omega/r = \matter\rho\,\dd V/r^3$, so
$\oint S\,\dd\Omega = \matter M/r_0^3$. The coefficient of $S$ on $Y_{20}$ is then
$a_{20} = Y_{20}(\hat z)\,\matter M/r_0^3 = \sqrt{5/4\pi}\,\matter M/r_0^3$, and
$\curv{\tE}_{zz} = -2G\matter M/r_0^3$, chapter 1.4's stretch along the line to the mass.

::: try {#sky-patterns}
Predict first: how many circles of zeros does the pattern $Y_{\ell0}$ have, and how far apart are they? The globe
opens at $\ell = 2$, $m = 0$, with its two circles at 54.7° and 125.3° from the north pole. Raise $\ell$, and turn
the globe by dragging it or with Shift and the arrow keys. Then switch to *Build a cap*: a cap of the sky 30° in
radius, rebuilt from the degrees 0 to $L$. Predict how high $L$ must go before the edge of the cap is sharp to about
10°, then raise $L$ and read the width of the edge.
:::

::: check
### Q

Which two powers of $r$ make $r^nY_{2m}$ harmonic, and which of them can appear inside an empty ball about the
origin?

### A

The powers $r^2$ and $r^{-3}$, the two solutions of $n(n + 1) = 2\times3$. Only $r^2$ is finite at the centre, so only
it can appear inside the ball.

### Q

Why does a pixel learn nothing from the parts of the tidal column of degree three and higher?

### A

Each entry of the tidal weight is a pattern of degree two, and patterns of different degree are orthogonal over the
sky, so those parts integrate to zero against it.

### Q

About how many kilometres apart are the crests of degree 300 on the Earth?

### A

The wavelength is $2\pi\times6371/300 = 133$ km.

:::

**The idea to keep: any pattern on the sky is a sum of spherical harmonics, $2\ell + 1$ of each degree $\ell$, with
features about $\pi/\ell$ wide. In an empty ball about a point the potential is a sum of $r^\ell Y_{\ell m}$, in an
empty shell a sum of $r^\ell Y_{\ell m}$ and $Y_{\ell m}/r^{\ell+1}$, and $1/|\vect x - \vect y|$ itself is the sum of
the Legendre polynomials.**

::: problems
### Practice

Expand $1/\sqrt{1 - 2t\mu + t^2}$ to second order in $t$ and read off $P_1$ and $P_2$. Then check that
$\int_{-1}^{1}P_2^2\,\dd\mu = \tfrac25$.

::: solution
With $u = 2t\mu - t^2$, $(1 - u)^{-1/2} = 1 + \tfrac12u + \tfrac38u^2 + \dots = 1 + t\mu - \tfrac12t^2 +
\tfrac32t^2\mu^2 + \dots$, so $P_1 = \mu$ and $P_2 = \tfrac12(3\mu^2 - 1)$. Then
$\int_{-1}^{1}\tfrac14(9\mu^4 - 6\mu^2 + 1)\,\dd\mu = \tfrac14\bigl(\tfrac{18}{5} - 4 + 2\bigr) = \tfrac25$, which is
$2/(2\ell + 1)$ for $\ell = 2$.
:::

### Stretch

The paper's *A small camera* says that inside a camera of width $D$, "the part of the field that varies over the sky
with angular degree $\ell$ changes across the camera by a factor $(D/2r)^{\ell-2}$ relative to the quadrupole". Use
the solid harmonics and chapter 1.4 to explain the power $\ell - 2$, and evaluate the factor at degree 5 for a camera
$D = 0.1$ m wide and a lorry $r = 15$ m away.

::: solution
Let $b$ be the distance of a point of the camera from its centre, in metres. The sources are far away, so near the
centre the potential is a sum of the solid harmonics $b^\ell Y_{\ell m}$. By [](#eq:generating), with the lorry of
mass $\matter M$ at $\vect x$ and the point of the camera at $\vect y$, the term of degree $\ell$ has the size about
$(G\matter M/r)(b/r)^\ell$. The tide is a second derivative of the potential (chapter 1.4), so the term of degree
$\ell$ in the tide grows as $b^{\ell-2}$, and degree 2 gives a tide that is the same across the camera. At the edge
$b = D/2$, so the tide of degree $\ell$ compared with the quadrupole's is about $(D/2r)^{\ell-2}$. For the lorry,
$D/2r = 0.05/15 = 1/300$, and at degree 5 the factor is $(1/300)^3 = 3.7\times10^{-8}$.
:::

### The paper

The paper's equation [](/paper/#eq:thermal-multipole) needs the sum $\sum_m\nabla h_m\cdot\nabla h_m^*$ for the
solid harmonics $h_m = r^\ell Y_{\ell m}$. Using chapter 2.1's rule $\nabla h\cdot\nabla g = \tfrac12\nabla^2(hg)$
for harmonic $h$ and $g$, the addition theorem and $\nabla^2r^n = n(n + 1)\,r^{n-2}$, show that the sum is
$\ell(2\ell + 1)^2\,r^{2\ell-2}/4\pi$, the factor in the paper's equation, and check it at $\ell = 1$.

::: solution
The conjugate $h_m^*$ is harmonic too, so the rule gives
$\sum_m\nabla h_m\cdot\nabla h_m^* = \tfrac12\nabla^2\sum_m|h_m|^2$. By the addition theorem at $\hat n' = \hat n$,
$\sum_m|h_m|^2 = r^{2\ell}(2\ell + 1)/4\pi$. Then $\nabla^2r^{2\ell} = 2\ell(2\ell + 1)\,r^{2\ell-2}$, and the sum is
$\tfrac12\times2\ell(2\ell + 1)\times(2\ell + 1)\,r^{2\ell-2}/4\pi = \ell(2\ell + 1)^2\,r^{2\ell-2}/4\pi$. At
$\ell = 1$ the solid harmonics are $\sqrt{3/4\pi}$ times $z$ and $\mp(x \pm iy)/\sqrt2$, three gradients of squared
length $3/4\pi$, so the sum is $9/4\pi$, as the formula gives.
:::
:::

::: paper
- Equation [](/paper/#eq:tidal-column) and Figure [](/paper/#fig:sky-integral): one pixel reads only the five numbers
  of degree two of the tidal column, and 54.7° is the zero of $P_2$.
- *A flown gradiometer* in [Section IV](/paper/#sec:near-field) reads GOCE's map in degrees, with $k = \ell/R$.
- *A small camera* and equation [](/paper/#eq:handheld) count degrees on the camera's own sky.
- Equation [](/paper/#eq:harmonic-point) writes the harmonic projection of a nugget as a sum over $P_\ell$
  (chapter 2.5).
- Equation [](/paper/#eq:thermal-multipole) uses the solid harmonics $r^\ell Y_{\ell m}$ and the addition theorem.
- Equation [](/paper/#eq:hair-bits), Figure [](/paper/#fig:hair) and equation [](/paper/#eq:sky-count) count
  $2\ell + 1$ numbers of each degree.
- Equation [](/paper/#eq:ladder) sorts the radial moments $\int\matter\rho\,r^{\ell+2j}\,Y_\ell\,\dd V$ by degree.
:::

::: deeper
- The [GR course, section 4.7](https://neovand.github.io/general-relativity/chapter-4.html#4-7-determinants-tell-integration-how-much-room-there-is)
  finds the area element of polar coordinates from a determinant, the same step that gives $\dd\Omega$.
- Jackson, *Classical Electrodynamics* (3rd edition, Wiley, 1999), sections 3.1 to 3.6, proves the properties of the
  Legendre polynomials and the spherical harmonics, the addition theorem and completeness.
- Thorne's review of multipole expansions [@Thorne1980], section II, relates the trace-free tables of every degree to
  the $Y_{\ell m}$.
:::

[^cs]: The minus signs of $Y_{1,1}$ and $Y_{2,1}$ are the Condon–Shortley convention, which not every book follows.
    Nothing in the paper depends on this sign, because the paper always sums over $m$. The normalization does matter:
    the factor $\ell(2\ell + 1)^2/4\pi$ of [](/paper/#eq:thermal-multipole) assumes orthonormal harmonics, as here,
    and the $4\pi$-normalized harmonics of geodesy would make it $\ell(2\ell + 1)^2$. The paper's moments
    $h = r^\ell Y_{\ell m}$ carry no conjugate, which does not matter where it takes a squared modulus.
