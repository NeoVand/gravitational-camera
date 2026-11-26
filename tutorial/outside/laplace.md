---
id: '2.1'
title: "Laplace's equation and harmonic functions; Green's identities; the maximum principle"
question: 'The space between a scene and the camera is empty, so the potential there obeys $\nabla^2\Phi = 0$. What does this one equation forbid, and why can the simplest picture of an interior never show a core?'
part: '2'
requires: ['1.2', '1.3', '1.4', '1.5', '1.5b', '1.6']
paper: [sec:near-field, eq:split, eq:evanescent, eq:thermal-moment, sec:hair, sec:second-order, eq:calderon, eq:hidden-spin, eq:ladder, eq:shear-zeros, app:proofs]
figures: []
live: [mean-value]
depth: A
---

In the scene of the locked safe, a camera stands 1.5 m above a concrete floor, and two steel safes stand 3.5 m in
front of it. Between them there is only air, which we treat as empty space,[^air] so the gravitational potential there
obeys Laplace's equation, $\nabla^2\field\Phi = 0$. What does this equation forbid? One consequence concerns the
**least assuming picture** of an interior, the one a camera draws when it knows only the body's outline: it is built
in proportion to the readings and treats every point inside alike and independently. That picture is densest and
lightest on the surface, so it can never show a core.[^core]

Four facts lead there: each value is the average of the values round it; so there is no peak and no pit in empty
space; the values on a closed surface fix the solution inside; and Green's second identity moves a Laplacian from one
function to another inside an integral.

::: plain
A function is **harmonic** where the sum of its three second derivatives is zero. The potential is harmonic wherever
there is no matter, so its value at each point equals the average over any matter-free sphere round the point. So it
has no peak or pit in empty space, its extreme values lie on the edge of its region, and its values on a closed
surface fix it everywhere inside. The camera's least assuming picture of a body is harmonic too (section 2.5), so a
round body appears as a uniform ball.
:::

## Laplace's equation says that each value is the average of its neighbours

Poisson's equation ([section 1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point))
is $\nabla^2\field\Phi = 4\pi G\matter\rho$, for the potential $\sym{potential}{\field\Phi}$, in joules per
kilogram, and the density $\sym{density}{\matter\rho}$, in kilograms per cubic metre. The **Laplacian**
$\nabla^2 = \partial_x^2 + \partial_y^2 + \partial_z^2$ is the sum of the three second derivatives along the axes.
In empty space $\matter\rho = 0$, and the equation becomes **Laplace's equation**, $\nabla^2\field\Phi = 0$. We want
to say what it means for the values of $\field\Phi$ near a point, without derivatives.

Take any smooth function $f$ of position and a small distance $b$, in metres. Taylor's expansion in one variable,
carried to the fourth power of $b$, gives

$$f(x \pm b) = f \pm b\,f' + \tfrac12 b^2 f'' \pm \tfrac16 b^3 f''' + \tfrac1{24}b^4 f'''' + \dots ,$$

with $y$ and $z$ fixed and $f$ and its derivatives taken at the point. Adding the two signs cancels the odd powers:

$$f(x + b) + f(x - b) - 2f(x) = b^2\,\partial_x^2 f + O(b^4).$$

Here $O(b^4)$ stands for terms of size $b^4$ and smaller. The same holds along $y$ and $z$. Let $\bar f_6$ be the
average of $f$ at the six neighbours $(x \pm b, y, z)$, $(x, y \pm b, z)$ and $(x, y, z \pm b)$. We add the three
equations and divide by 6:

$$\boxed{\;\bar f_6 - f = \frac{b^2}{6}\,\nabla^2 f + O(b^4).\;} \label{eq:neighbours}$$

So the Laplacian measures how far the average of the neighbours stands above the centre. Where $\nabla^2 f = 0$,
each value equals the average of its six neighbours, up to terms of order $b^4$.

A function $h$ with $\nabla^2 h = 0$ at every point of a region is **harmonic** there.[^letters] Every constant is
harmonic, and so are $x$, $xy$ and $x^2 - y^2$. So is $1/r$, with $r$ the distance from the origin, everywhere except
at the origin (section 1.3). The function $x^2$ is not: its Laplacian is 2, so its six neighbours average $b^2/3$ more
than the centre, $3.3 \times 10^{-3}\unit{m^2}$ for $b = 0.1\unit{m}$. Nor is $r^2$, whose Laplacian is 6.

**A number.** Take $1/r$ at the point 1 m from the origin along $x$. With $b = 0.1\unit{m}$, its six neighbours
average $5.8 \times 10^{-5}\unit{m^{-1}}$ more than the centre's $1\unit{m^{-1}}$; with $b = 0.01\unit{m}$, the excess
is $5.8 \times 10^{-9}\unit{m^{-1}}$. A distance ten times smaller makes it ten thousand times smaller, so only the
$b^4$ term of [](#eq:neighbours) is left, as it must be for a harmonic function. For $x^2 - y^2$ the excess is zero for
every $b$, because all its fourth derivatives vanish (Figure [](#fig:seven-points)).

![A point and its six neighbours at the distance $b$ along the axes, the centres of the faces of a cube of side $2b$,
with the value of $x^2 - y^2$ beside each, in square metres. The centre is at $(0.3, 0.2, 0)\unit{m}$ and
$b = 0.1\unit{m}$, and the six values average 0.05, the value at the centre.](tut-lap-cube){#fig:seven-points}

In the steel of a safe, of density $7850\unit{kg\,m^{-3}}$, the potential is not harmonic:
$\nabla^2\field\Phi = 4\pi G\matter\rho = 6.6 \times 10^{-6}\unit{s^{-2}}$, so each value lies below the average
of its neighbours. Matter makes a dip in the potential.

## The harmonic quadratics are the trace-free tables

We want the harmonic polynomials of degree two, because the quadratic part of the potential near the camera is one of
them. Let $T_{ij}$ be a symmetric table (section 1.5) and $q = T_{ij}x_ix_j$ the quadratic it makes. The product rule,
with $\partial_k x_i = \delta_{ki}$, gives

$$\partial_k q = T_{kj}x_j + T_{ik}x_i = 2T_{kj}x_j .$$

the two terms being equal because $T$ is symmetric. Differentiating again with respect to $x_k$ and summing over $k$,

$$\boxed{\;\nabla^2\bigl(T_{ij}x_ix_j\bigr) = 2T_{kj}\delta_{kj} = 2T_{kk} .\;}$$

so the quadratic is harmonic exactly when its table is trace-free. Such a table holds five independent numbers
([section 1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left)), so there
are five independent **harmonic polynomials** of degree two, for example $x^2 - y^2$, $y^2 - z^2$, $xy$, $yz$ and
$zx$.

They appear in the potential near the camera. The Taylor expansion of section 1.2, to second order in the
displacement $\vect x$ from the camera, is

$$\field\Phi(\vect x) \approx \field\Phi_0 - g_ix_i + \tfrac12\,\curv{\tE}_{ij}\,x_ix_j ,$$

where $\field\Phi_0$ is the potential at the camera, $g_i = -\partial_i\field\Phi$ the gravitational field there, in
metres per second squared, and $\sym{tidal-tensor}{\curv{\tE}}_{ij} = \partial_i\partial_j\field\Phi$ the tidal tensor
of section 1.4, in $\mathrm{s^{-2}}$. Each term is in joules per kilogram. In empty space the tide is trace-free
([section 1.4](/tutorial/newton/tides/#in-empty-space-the-stretch-and-the-squeezes-balance)), so the quadratic part
is harmonic, and the five numbers that a pixel records are its five coefficients.

A polynomial whose terms all have the degree $\ell$ is likewise harmonic exactly when its table of $\ell$ indices is
trace-free,[^degree] so there are $2\ell + 1$ independent ones, as section 1.5 counted
([patterns of higher degree](/tutorial/newton/five-numbers/#patterns-of-higher-degree-hold-7-9-and-more-numbers)):
1, 3, 5, 7 and 9 for the degrees 0 to 4. Section 2.2 proves the count.

In the plane, the real and imaginary parts of the powers of $x + iy$ (section 1.5b) are harmonic. They give two
harmonic polynomials of each degree from one upward, and the constant at degree zero. At degree two they are
$x^2 - y^2$ and $2xy$, the patterns of
[the shear of one mass](/tutorial/newton/complex-numbers/#the-shear-of-one-mass-is-a-square). The box shows why.

::: derivation
### In the plane, a harmonic function is the real part of a function of $x + iy$

A place in the plane is one complex number, $\sym{complex-place}{w} = x + iy$ (section 1.5b). A function $f(w)$ has a
**derivative** $f'(w)$ if $[f(w + \Delta) - f(w)]/\Delta$ tends to one complex number however the small complex step
$\Delta$ shrinks to zero. A function with a derivative at every point of a region is **holomorphic** there. Every
polynomial in $w$ is, because the derivative of $w^n$ is $nw^{n-1}$.

Let $f = u + iv$, with $u$ and $v$ real functions of $x$ and $y$. We take the step along the real axis,
$\Delta = \Delta x$, and along the imaginary axis, $\Delta = i\,\Delta y$:

$$f'(w) = \partial_xu + i\,\partial_xv, \qquad f'(w) = \frac{\partial_yu + i\,\partial_yv}{i} = \partial_yv - i\,\partial_yu .$$

The two agree, so their real parts agree and their imaginary parts agree:

$$\partial_xu = \partial_yv, \qquad \partial_yu = -\partial_xv .$$

These are the **Cauchy–Riemann equations**. We differentiate the first with respect to $x$, the second with respect
to $y$, and add:

$$\partial_x^2u + \partial_y^2u = \partial_x\partial_yv - \partial_y\partial_xv = 0 .$$

The mixed derivatives cancel, because the order of partial derivatives does not matter for continuous second
derivatives; a holomorphic function has derivatives of every order, a theorem we state without proof. The same steps
in the other order give $\nabla^2v = 0$. So the real and imaginary parts of a holomorphic function are harmonic.

The cube $w^3$ has the real part $x^3 - 3xy^2$ and the imaginary part $3x^2y - y^3$, with the Laplacians $6x - 6x = 0$
and $6y - 6y = 0$.[^spin] A non-example is $|w|^2 = x^2 + y^2$, which needs the complex conjugate of $w$: it is not
holomorphic, and its Laplacian is 4. Section 3.9 uses holomorphic functions for the zeros of the shear.
:::

## The value at the centre of a sphere is the average over the sphere

The rule of the six neighbours holds exactly, over every sphere. We assume that **$h$ is harmonic in a region that
contains a whole ball**, its surface included, of radius $R$ about $\vect x_0$. The average of $h$ over the sphere is

$$\sym{sphere-average}{\bar h}(R) = \frac{1}{4\pi R^2}\oint h\,\dd A = \frac{1}{4\pi}\oint h(\vect x_0 + R\,\hat{\vect u})\,\dd\Omega ,$$

in the unit of $h$. In the second form $\hat{\vect u}$ is the unit vector from the centre to a point of the sphere, and
$\dd\Omega$ is the solid angle of
[section 1.3](/tutorial/newton/gauss-and-poisson/#solid-angle-measures-how-large-a-patch-looks), with
$\dd A = R^2\,\dd\Omega$.

We differentiate with respect to $R$. Only $h$ depends on $R$ in the second form, and by the chain rule
$\dd h(\vect x_0 + R\hat{\vect u})/\dd R = \hat{\vect u}\cdot\nabla h$. The outward normal is $\hat{\vect u}$, so
$\dd\vect A = \hat{\vect u}\,R^2\,\dd\Omega$, and

$$\bar h'(R) = \frac{1}{4\pi}\oint\hat{\vect u}\cdot\nabla h\,\dd\Omega = \frac{1}{4\pi R^2}\oint\nabla h\cdot\dd\vect A .$$

The last integral is the flux of $\nabla h$ out of the sphere. By the
[divergence theorem](/tutorial/newton/gauss-and-poisson/#the-divergence-theorem-adds-up-the-boxes) it equals the
integral of $\nabla\cdot\nabla h = \nabla^2 h$ over the ball:

$$\bar h'(R) = \frac{1}{4\pi R^2}\int_{\text{ball}}\nabla^2 h\,\dd V = 0 .$$

So $\bar h$ is the same for every radius up to $R$. As the radius shrinks to zero the average approaches
$h(\vect x_0)$. Therefore

$$\boxed{\;h(\vect x_0) = \frac{1}{4\pi R^2}\oint_{|\vect x - \vect x_0| = R} h\,\dd A .\;} \label{eq:mean-value}$$

This is the **mean value property**: a harmonic function at the centre of any sphere inside its region equals its
average over that sphere.

**A check: the shell theorem.** A thin uniform shell of mass $\sym{mass}{\matter M}$ and radius $R$ about the origin
has its potential at $\vect y$ (section 1.2)

$$\field\Phi(\vect y) = -G\matter M\,\frac{1}{4\pi R^2}\oint\frac{\dd A}{|\vect x - \vect y|} .$$

The fraction is the average over the sphere of $1/|\vect x - \vect y|$. If $\vect y$ is outside the shell, this
function of $\vect x$ is harmonic inside the sphere and on it, because its one bad point, $\vect x = \vect y$, lies
outside. By [](#eq:mean-value) the average is the value at the centre, $1/|\vect y|$, so
$\field\Phi(\vect y) = -G\matter M/|\vect y|$: the
[shell theorem](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts), proved without the
symmetry argument. For $\vect y$ inside the shell the property says nothing, and the first practice problem finds the
average: $1/R$, wherever $\vect y$ lies inside.

**A number.** At the camera of the locked safe, the 324 kg of gold, 3.92 m away, makes the potential
$-5.5 \times 10^{-9}\unit{J\,kg^{-1}}$ (section 1.2). Its average over a sphere of radius 2 m about the camera is
the same, because the ball holds no gold. A sphere of radius 5 m encloses the gold, and the average over it is
$-G\matter M/R = -4.3 \times 10^{-9}\unit{J\,kg^{-1}}$, 22 per cent smaller in size.

## In empty space the potential has no peak and no pit

Where can a harmonic function take its largest value? We assume that **$h$ is harmonic in a bounded region $V$ that
is all in one piece**, and continuous up to the region's **boundary**, the closed surface $\sym{boundary}{\partial V}$
that encloses it.

Suppose that $h$ takes its largest value, $h_{\max}$, at a point $\vect x_0$ inside $V$. On the surface of a ball about
$\vect x_0$ inside $V$, $h \le h_{\max}$, while by [](#eq:mean-value) the average over the surface is
$h(\vect x_0) = h_{\max}$. An average of values nowhere larger than $h_{\max}$ equals $h_{\max}$ only if every value
does, so $h = h_{\max}$ on every sphere about $\vect x_0$, and so throughout the ball.

Now take any other point of $V$ and a path inside $V$ from $\vect x_0$ to it, which exists because $V$ is in one
piece. Let $\vect q$ be the farthest point along the path up to which $h = h_{\max}$ all the way. By continuity
$h(\vect q) = h_{\max}$, so by the same argument $h = h_{\max}$ in a ball about $\vect q$. That ball holds a further
stretch of the path, so $\vect q$ is the path's end, and $h = h_{\max}$ everywhere in $V$. Applied to $-h$, the
argument treats the smallest value. So

$$\boxed{\;\begin{gathered}\text{a harmonic function that is not constant}\\ \text{takes its largest and smallest values}\\ \text{only on the boundary of its region.}\end{gathered}\;}$$

This is the **maximum principle**.

Where the field vanishes, the potential changes as $\tfrac12\curv{\tE}_{ij}x_ix_j$, and the three eigenvalues of the
tide add to zero (section 1.4). If they are not all zero, one is positive and another negative, so the point is a
**saddle**. Where the tide vanishes too, only the maximum principle forbids a pit.

**A number.** Two people of 70 kg stand at $x = \pm a$, with $a = 1\unit{m}$. At the midpoint the two pulls cancel,
and the potential is $-2G\matter M/a = -9.3 \times 10^{-9}\unit{J\,kg^{-1}}$. It falls toward each person, so the
midpoint is a maximum along the line, with $\partial_x^2\field\Phi = -4G\matter M/a^3 =
-1.87 \times 10^{-8}\unit{s^{-2}}$. Across the line the potential is $-2G\matter M/\sqrt{a^2 + y^2}$, which rises
toward zero with $|y|$, so the midpoint is a minimum across, with
$\partial_y^2\field\Phi = \partial_z^2\field\Phi = +9.3 \times 10^{-9}\unit{s^{-2}}$. The three add up to zero
(Figure [](#fig:two-people)).

![The potential of two people at $x = \pm1\unit{m}$, along the line through them, $\field\Phi(x, 0, 0)$, and across
it through the midpoint, $\field\Phi(0, y, 0)$, in units of $G\matter M/a$. The curves meet at $-2$, the highest point
along the line and the lowest across it.](tut-lap-two){#fig:two-people}

A free ball at the midpoint stays there, because the field is zero. Nudged across the line, it is pulled back; nudged
along it, it falls toward the nearer person. A rest point that pulled a nudge back in every direction would be a
minimum of the potential, and in empty space there is none. So no arrangement of masses can hold a free body at rest
stably, at a point of empty space, by gravity alone: **Earnshaw's theorem**. Figure [](#fig:saddle) shows a saddle,
which empty space allows, beside a peak, which it forbids.

![Two membranes over a disc of radius 1. On the left, the harmonic saddle $u = x^2 - y^2$ takes its largest value, 1,
and its smallest, $-1$, on the rim. On the right, the bump $u = 1 - r^2$, with Laplacian $-4$, has its largest value
at the centre, which no harmonic function can do.](tut-lap-membranes){#fig:saddle}

The same principle governs the camera's picture of an interior. The least assuming picture of a body is the part
$\matter\rho_h$ of its density that the field outside can see, and it is harmonic inside the body (section 2.5). By
the maximum principle its densest and lightest points lie on the body's surface, so it can never show a core. For a
round body the picture is round too, because the split is unique and turning the body changes nothing. So it takes one
value all over the surface, its largest and smallest values are equal, and it is constant. It has the body's mass,
because it makes the same field outside. So every round body appears as a uniform ball of its mean density, and the
two-layer Earth of
[section 1.3](/tutorial/newton/gauss-and-poisson/#the-outside-of-the-earth-cannot-tell-a-core-from-a-uniform-ball),
with its iron core of $12{,}500\unit{kg\,m^{-3}}$, appears as $5513\unit{kg\,m^{-3}}$ throughout.

## Green's identities move a Laplacian from one function to the other

We want a rule that moves a Laplacian from one function to another inside an integral, because the step that
separates what the outside sees from what it cannot is such a move. We assume that **$u$ and $v$ have continuous
second derivatives in a bounded region $V$ and on its boundary $\partial V$**; they need not be harmonic. The product
rule gives

$$\nabla\cdot(u\nabla v) = \nabla u\cdot\nabla v + u\,\nabla^2v .$$

Integrating over $V$ and applying the divergence theorem to $u\nabla v$,

$$\int_V\bigl(\nabla u\cdot\nabla v + u\,\nabla^2v\bigr)\,\dd V = \oint_{\partial V}u\,\nabla v\cdot\dd\vect A . \label{eq:green-first}$$

which is **Green's first identity**. Written again with $u$ and $v$ exchanged and subtracted, the term
$\nabla u\cdot\nabla v$, the same in both, cancels:

$$\boxed{\;\int_V\bigl(u\,\nabla^2v - v\,\nabla^2u\bigr)\,\dd V = \oint_{\partial V}\bigl(u\,\nabla v - v\,\nabla u\bigr)\cdot\dd\vect A .\;} \label{eq:green-second}$$

This is **Green's second identity**. The units agree: a Laplacian divides by a square metre where a volume multiplies
by a cubic metre, and a gradient divides by a metre where an area multiplies by a square metre.

**A check.** Take $u = 1$ and $v = r^2$ on a ball of radius $R$ about the origin. On the left, $\nabla^2 r^2 = 6$, so
the integral is $6 \times \tfrac43\pi R^3 = 8\pi R^3$. On the right, $\nabla u = 0$, and $\nabla r^2 = 2\vect x$ points
straight out with the size $2R$, so the integral is $2R \times 4\pi R^2 = 8\pi R^3$. For $R = 0.1\unit{m}$ both sides
are $0.0251\unit{m^3}$ (Figure [](#fig:green)).

![Green's second identity on a region $V$, in section. The left side adds $u\,\nabla^2v - v\,\nabla^2u$ over the
inside of $V$, and the right side adds $(u\,\nabla v - v\,\nabla u)\cdot\dd\vect A$ over its boundary $\partial V$,
where each $\dd\vect A$ points straight out.](tut-lap-green){#fig:green}

**What it means.** Let $h$ be harmonic inside a body, and let $\field\psi$, in joules per kilogram, be the potential
of a part of the body's matter that makes no field outside. Then $\field\psi$ is zero outside, and on the surface it
vanishes together with its gradient. By Poisson's equation that part has the density $\nabla^2\field\psi/4\pi G$,
and the body's density splits into a harmonic part and a part that the outside cannot see:[^split]

$$\matter\rho = \matter\rho_h + \frac{\nabla^2\field\psi}{4\pi G}, \qquad \nabla^2\matter\rho_h = 0 .$$

With $u = h$ and $v = \field\psi$ in [](#eq:green-second), the surface term $h\nabla\field\psi$ vanishes because
$\nabla\field\psi = 0$, and $\field\psi\nabla h$ because $\field\psi = 0$. Inside, $\nabla^2h = 0$. So

$$\int h\,\nabla^2\field\psi\,\dd V = \int\field\psi\,\nabla^2h\,\dd V = 0 .$$

The part $\nabla^2\field\psi/4\pi G$ has no moment $\int\matter\rho\,h\,\dd V$ against any harmonic $h$. The field
outside is built only from those moments (section 1.6), so the outside cannot see that part. Section 2.5 derives the
split, and section 2.4 uses the same identity to solve Poisson's equation.

## The values on a closed surface fix the potential inside

How much of a harmonic function do its values on a boundary fix? We assume that **$V$ is bounded and in one piece**,
and that $h_1$ and $h_2$ are harmonic in $V$ and equal on $\partial V$. Their difference $w = h_1 - h_2$ is harmonic,
because $\nabla^2w = 0$, and it is zero on $\partial V$. By the maximum principle its largest and smallest values lie
on $\partial V$, where both are zero. So $0 \le w \le 0$ everywhere in $V$, and $w = 0$:

$$\boxed{\;\begin{gathered}\text{a function harmonic in a bounded region}\\ \text{is fixed by its values}\\ \text{on the region's boundary.}\end{gathered}\;}$$

Values prescribed on a boundary are a **boundary condition**, and this result is the **uniqueness** of the solution of
Laplace's equation with that condition.

The region outside a body has no outer boundary, so it needs one more condition: **the potential falls to zero far
away**. Two potentials with the same values on the body's surface then differ by a harmonic $w$ that is zero there and
small far away. For any small $\varepsilon$, beyond some large sphere $|w| < \varepsilon$, and between the body and that
sphere the maximum principle gives $|w| \le \varepsilon$ too. Because $\varepsilon$ can be as small as we like,
$w = 0$.

For the camera, the part of the potential made by the matter inside a closed surface is fixed everywhere outside it by
its values on it, provided no other matter lies outside. In the locked-safe room the floor, the camera and the Earth
do, so their shares must be known and removed first. On the far side of a flat camera from all the sources, likewise,
the potential is fixed by its values on the camera's plane (section 2.4 writes the formula).

Two potentials made by the same density differ by a $w$ with $\nabla^2w = 0$ everywhere that falls to zero far away,
so $w = 0$: sources fix the potential. Section 2.4 builds it from them.

::: try {#mean-value}
Predict first: raise one edge of the square as high as you like. Can any point inside rise above it? Set the edges
with the sliders and watch the inside relax to the harmonic function with those edges. Then move the probe circle and
compare the average round it with the value at its centre. Last, open the gold: a sphere round the camera averages the
gold's potential, $-5.52 \times 10^{-9}\unit{J\,kg^{-1}}$, until it reaches the gold at 3.92 m. Predict what the
average does beyond that, then read it at 5 m.
:::

## A harmonic function is fixed by its values in any small ball

This section is a sketch, at depth B. Must a camera surround a body to fix its potential outside, or is a small piece
of space enough?

Every harmonic function is **analytic**: round every point of its region it equals the sum of its Taylor series, in
some ball about that point. We state this without proof. So if every derivative of a harmonic function is zero at a
point, the function vanishes in a ball about that point.

Suppose that a harmonic function $h$ vanishes in a small ball inside a **connected** region, one in a single piece.
Follow a path from the ball to any other point, and let $\vect q$ be the farthest point along it up to which $h$
vanishes round every point. Each derivative of $h$ is continuous and zero on the path before $\vect q$, so it is zero
at $\vect q$ too. Then $h$ vanishes in a ball about $\vect q$, which holds a further stretch of the path, so $\vect q$
is the path's end. This is the argument of the maximum principle, with "every derivative is zero" in place of
"$h = h_{\max}$". Applied to the difference of two harmonic functions, it gives

$$\boxed{\;\begin{gathered}\text{two functions harmonic in a connected region}\\ \text{that agree in any small ball}\\ \text{agree everywhere in it.}\end{gathered}\;}$$

This is **unique continuation**. For the camera it means that a noiseless reading of a body's potential in any small
piece of the empty space round it would fix that potential everywhere outside the body, provided the outside is
connected.[^flat] The potential $\field\psi$ of the split is a non-example: it vanishes on the whole outside without
vanishing everywhere, because inside the body it is not harmonic.

No real camera gets this much. A ripple of density whose crests lie $\lambda$ apart, in metres, makes a potential that
fades with the height $z$ above the body as $\cos(kx)\,e^{-kz}$, with the wavenumber $k = 2\pi/\lambda$ (section 2.7
derives it).[^evanescent] For crests 10 cm apart, the potential is $e^{2\pi} = 535$ times weaker 10 cm above the body
than at its surface, and $e^{4\pi} = 2.9 \times 10^5$ times weaker 20 cm above it. To recover the ripple the camera
must multiply its reading, and its noise, by that factor: the continuation is exact but unstable
([section 3.7](/tutorial/noise/blur-law/#what-the-law-means)).

::: gap
The sketch does not prove that harmonic functions are analytic, which follows from section 2.4's integral formula
over a sphere, nor the version for a flat camera.
:::

## The product of two harmonic functions is not harmonic

Is the dot product $\nabla h\cdot\nabla g$ of two gradients harmonic? The product rule, applied twice to $hg$, gives

$$\nabla^2(hg) = g\,\nabla^2h + 2\,\nabla h\cdot\nabla g + h\,\nabla^2g .$$

For $h$ and $g$ harmonic the first and the last terms vanish:

$$\boxed{\;\nabla h\cdot\nabla g = \tfrac12\,\nabla^2(hg) .\;}$$

With $h = g = x$, both sides are 1. With $h = g = \tfrac12(x^2 - y^2)$, the left side is $x^2 + y^2$ and the right side
is $\tfrac18\nabla^2(x^2 - y^2)^2 = \tfrac18(8x^2 + 8y^2)$, the same. But $x^2 + y^2$ has the Laplacian 4, so neither
the product of two harmonic functions nor the dot product of their gradients is harmonic in general.

The integral $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$ is what the thermal trembling of a warm body adds
up,[^thermal] and it is the response of one moment of a body to a kick made by another
([section 1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside)). The field outside holds
only moments against harmonic functions, and $\nabla h\cdot\nabla g$ is not harmonic beyond the lowest degrees, so
this integral holds what the static field cannot see.[^ladder]

**The idea to keep: in empty space the potential at each point is the average of the potential round it, so it has
no peak and no pit there, and its values on a closed surface fix it everywhere inside. Green's second identity moves a
Laplacian from one function to the other, which is how the next sections weigh what the outside can and cannot see.**

::: problems
### Practice

**[2.1]** Show that $1/r$ has the mean value property over a sphere of radius $R$ that does not enclose the origin, the
centre being at the distance $D > R$ from it. With $\mu$ the cosine of the angle at the centre between the line to the
origin and the line to a point of the sphere, the band of solid angle is $2\pi\,\dd\mu$ (section 1.5). Then repeat for
$D < R$.

::: solution
A point of the sphere is at the distance $r = \sqrt{D^2 + R^2 - 2DR\mu}$ from the origin, and a band $\dd\mu$ is the
fraction $\tfrac12\dd\mu$ of the sphere, so the average is

$$\frac12\int_{-1}^{1}\frac{\dd\mu}{\sqrt{D^2 + R^2 - 2DR\mu}}
= \frac{1}{2DR}\Bigl[\sqrt{D^2 + R^2 - 2DR\mu}\Bigr]_{\mu=1}^{\mu=-1} = \frac{(D + R) - |D - R|}{2DR}.$$

For $D > R$ this is $1/D$, the value at the centre. For $D < R$ it is $1/R$, independent of $D$: inside a uniform
shell the potential is the same everywhere.
:::

**[2.1]** Is $x^2 + y^2 - 2z^2$ harmonic? Is $x^2 + y^2 + z^2$?

::: solution
The first is, because its diagonal $1$, $1$, $-2$ has trace zero. The second is not: $\nabla^2 r^2 = 6$.
:::

**[2.1]** Why can a free test mass not rest stably at any point of empty space under gravity alone?

::: solution
A stable rest point would be a minimum of the potential, and a harmonic function has none unless it is constant.
:::

**[2.1]** A camera knows exactly the potential made by the two safes alone, on a closed surface round them. What else
does it know?

::: solution
That potential everywhere outside the surface, by uniqueness. Not the potential inside, where the steel and gold are
sources, nor the whole potential of the room, because the floor, camera and Earth are sources outside.
:::

**[2.1]** What is the average of $1/|\vect x - \vect y|$ over a sphere of radius 1 m about the origin, if
$|\vect y| = 3\unit{m}$?

::: solution
The function is harmonic inside and on the sphere, so the average is the value at the centre, $1/3\unit{m^{-1}}$.
:::

### Stretch

**[2.1]** Let $\vect\zeta$ be a vector with complex components, in inverse metres. Show that $e^{\vect\zeta\cdot\vect x}$
is harmonic exactly when $\vect\zeta\cdot\vect\zeta = 0$, the dot product taken without a complex conjugate, as for
the null vectors of
[section 1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero). Check it for
$\vect\zeta = \tfrac12(i\vect\xi + \vect\eta)$, with $\vect\xi$ and $\vect\eta$ real, perpendicular and of equal
length.

::: solution
Each derivative brings down $\zeta_i$, so $\nabla^2e^{\vect\zeta\cdot\vect x} = \zeta_i\zeta_i\,
e^{\vect\zeta\cdot\vect x}$. For the given vector,
$\vect\zeta\cdot\vect\zeta = \tfrac14(-\vect\xi\cdot\vect\xi + \vect\eta\cdot\vect\eta) + \tfrac{i}{2}\,\vect\xi\cdot\vect\eta$,
and both parts vanish. With such exponentials
[section 13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple) reads the
Fourier transform of a density from two readings of its field.
:::

### The camera

**[2.1]** Derive $\int h\,\nabla^2\field\psi\,\dd V = \int\field\psi\,\nabla^2h\,\dd V = 0$, for $h$ harmonic and
$\field\psi$ the potential of a part of a body that makes no field outside, and say which surface term needs
$\field\psi = 0$ and which needs $\nabla\field\psi = 0$. Then take $h = 1$ and $\field\psi = 1 - r^2/R^2$ on a ball
of radius $R$, which vanishes on the surface while its gradient does not. Show that $\int h\,\nabla^2\field\psi\,\dd V$
is then not zero, and which surface term makes up the difference.

::: solution
With $u = h$ and $v = \field\psi$ the surface integral is $\oint(h\,\nabla\field\psi - \field\psi\,\nabla h)\cdot\dd\vect A$:
the first term needs $\nabla\field\psi = 0$ and the second $\field\psi = 0$. For the example,
$\nabla^2\field\psi = -6/R^2$, so $\int h\,\nabla^2\field\psi\,\dd V = -\tfrac{6}{R^2} \times \tfrac43\pi R^3 = -8\pi R$,
while $\int\field\psi\,\nabla^2 h\,\dd V = 0$. The surviving term is $\oint h\,\nabla\field\psi\cdot\dd\vect A =
-\tfrac{2}{R} \times 4\pi R^2 = -8\pi R$, the same.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field): the picture that can never show a core, the split of equation
  [](/paper/#eq:split), the fade of equation [](/paper/#eq:evanescent), and equation [](/paper/#eq:thermal-moment).
- [Section XII](/paper/#sec:hair) builds the field outside from moments against harmonic functions;
  [Section XIII](/paper/#sec:second-order) uses equations [](/paper/#eq:calderon), [](/paper/#eq:hidden-spin) and
  [](/paper/#eq:ladder); [Appendix C](/paper/#app:proofs) uses unique continuation.
:::

::: deeper
- Oliver Dimon Kellogg, *Foundations of Potential Theory* (Springer, 1929; Dover reprint), derives them from
  Newton's potential.
:::

::: history
### Laplace, Green, Gauss and Earnshaw

Laplace wrote his equation in the 1780s. George Green, a self-taught miller from Nottingham, published his identities
in 1828, and Gauss proved the mean value property in 1840. Samuel Earnshaw's theorem, for any inverse-square force,
dates from 1842.
:::

[^air]: Air, of $1.2\unit{kg\,m^{-3}}$, adds $4\pi G\matter\rho = 1.0 \times 10^{-9}\unit{s^{-2}}$ to the trace of the
    tide, a ninth of the person's tide at a metre; it is uniform and known, so its share is removed like the floor's.

[^core]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, Fig. [](/paper/#fig:same-outside)(b).

[^letters]: We write $h$ and $g$ for harmonic functions; the vector $\vect g$ of section 1.2 is the field.

[^degree]: The same two differentiations, applied to a symmetric $T_{i_1\cdots i_\ell}x_{i_1}\cdots x_{i_\ell}$,
    give $\ell(\ell - 1)\,T_{kk\,i_3\cdots i_\ell}\,x_{i_3}\cdots x_{i_\ell}$, which vanishes for every $\vect x$
    exactly when the table's trace (two indices set equal and summed) is zero.

[^spin]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, as its equation
    [](/paper/#eq:hidden-spin), and Sec. IV, equation [](/paper/#eq:shear-zeros).

[^split]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:split). For a body whose outside is connected, the field outside fixes $\matter\rho_h$ completely
    [@Isakov1990].

[^flat]: A flat camera reads a piece of a surface: its tides give the potential and its slope along the normal, up to a
    constant and a uniform pull, and with these the same conclusion holds. We state it without proof.

[^evanescent]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:evanescent).

[^thermal]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:thermal-moment).

[^ladder]: For quadratics $\nabla h\cdot\nabla g$ is a quadratic, so two Laplacians make it zero. First shown in *The
    gravitational camera* (Mohsenvand 2026), Sec. XIII, as its equation [](/paper/#eq:ladder); section
    [13.3](/tutorial/what-a-field-keeps/ladder/#no-tide-reaches-beyond-the-rungs-below-its-degree-whatever-is-read)
    derives it.
