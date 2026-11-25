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

In the paper's room of the locked safe, a camera stands 1.5 m above a concrete floor, and two steel safes stand 3.5 m
in front of it. Between them there is only air, which we treat as empty space,[^air] so the gravitational potential
there obeys Laplace's equation, $\nabla^2\field\Phi = 0$. From this one equation the paper's
[Section IV](/paper/#sec:near-field) concludes that the least assuming picture of an interior has its densest and its
lightest points on the surface: "It can never show a core." The **least assuming picture** is the one a camera draws
when it knows the body's outline from light and nothing else: it is built in proportion to the readings, and it
treats every point inside alike and independently.

So we ask what Laplace's equation forbids in the air of that room, and why the picture of a safe's inside cannot be
densest at its centre. The answer rests on four facts, which the rest of Part 2 uses. Each value is the average of the
values round it. So there is no peak and no pit in empty space. The values on a closed surface fix the solution
inside. And Green's second identity moves a Laplacian from one function to another inside an integral.

::: plain
A function of position is called **harmonic** where the sum of its three second derivatives is zero. Laplace's
equation says that the gravitational potential is harmonic wherever there is no matter. This means that the value at
each point equals the average of the values round it, over any sphere round the point that holds no matter.

So a harmonic function has no peak or pit in empty space, because a peak would be higher than the average round it.
Its largest and smallest values lie on the edge of the region. And if you know its values all over a closed surface,
you know it everywhere inside.

The paper applies the same rule to the picture of a body's inside that a camera outside draws when it assumes
nothing about it. That picture is harmonic inside the body, so it is densest somewhere on the surface and cannot show
a dense core. A round body appears as a uniform ball.
:::

## Laplace's equation says that each value is the average of its neighbours

Chapter 1.3 derived Poisson's equation, $\nabla^2\field\Phi = 4\pi G\matter\rho$, for the gravitational potential
$\sym{potential}{\field\Phi}$, in joules per kilogram, and the density $\sym{density}{\matter\rho}$, in kilograms per
cubic metre. The **Laplacian** $\nabla^2 = \partial_x^2 + \partial_y^2 + \partial_z^2$ is the sum of the three second
derivatives along the axes. In empty space $\matter\rho = 0$, and the equation becomes **Laplace's equation**,
$\nabla^2\field\Phi = 0$
([chapter 1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point)). We want to say
what it means for the values of $\field\Phi$ near a point, without derivatives.

Take any smooth function $f$ of position and a small distance $b$, in metres.[^b] Taylor's expansion in one variable,
carried to the fourth power of $b$, gives

$$f(x \pm b) = f \pm b\,f' + \tfrac12 b^2 f'' \pm \tfrac16 b^3 f''' + \tfrac1{24}b^4 f'''' + \dots ,$$

where $f$ and its derivatives with respect to $x$ are taken at the point, and $y$ and $z$ stay fixed. We add the
expansions with the two signs, and the odd powers of $b$ cancel:

$$f(x + b) + f(x - b) - 2f(x) = b^2\,\partial_x^2 f + O(b^4).$$

Here $O(b^4)$ stands for terms of size $b^4$ and smaller. The same holds along $y$ and along $z$. Let $\bar f_6$ be
the average of $f$ at the six neighbours $(x \pm b, y, z)$, $(x, y \pm b, z)$ and $(x, y, z \pm b)$. We add the three
equations and divide by 6:

$$\boxed{\;\bar f_6 - f = \frac{b^2}{6}\,\nabla^2 f + O(b^4).\;} \label{eq:neighbours}$$

So the Laplacian measures how far the average of the neighbours stands above the value at the centre. Where
$\nabla^2 f = 0$, each value equals the average of its six neighbours, up to terms of order $b^4$.

A function $h$ with $\nabla^2 h = 0$ at every point of a region is **harmonic** there.[^letters] Chapter 1.6 used the
word ([the moment of inertia](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)),
and [](#eq:neighbours) says what it means. Every constant is harmonic, and so are $x$, $xy$ and $x^2 - y^2$. So is
$1/r$, with $r$ the distance from the origin, everywhere except at the origin (chapter 1.3). The function $x^2$ is
not: its Laplacian is 2, so its six neighbours average $b^2/3$ more than the centre, $3.3 \times 10^{-3}\unit{m^2}$
for $b = 0.1\unit{m}$. Nor is $r^2 = x^2 + y^2 + z^2$, whose Laplacian is 6.

**A number.** Take $1/r$ at the point 1 m from the origin along $x$. With $b = 0.1\unit{m}$, its six neighbours
average $5.8 \times 10^{-5}\unit{m^{-1}}$ more than the value at the centre, $1\unit{m^{-1}}$. With
$b = 0.01\unit{m}$, the excess is $5.8 \times 10^{-9}\unit{m^{-1}}$. A distance ten times smaller makes the excess ten
thousand times smaller, so only the $b^4$ term of [](#eq:neighbours) is left, as it must be for a harmonic function.
For $x^2 - y^2$ the excess is zero for every $b$, because all its fourth derivatives vanish. Figure
[](#fig:seven-points) shows its seven values about one point.

![A point and its six neighbours at the distance $b$ along the three axes, which are the centres of the faces of a
cube of side $2b$, with the value of $x^2 - y^2$ beside each, in square metres. The centre is at
$(0.3, 0.2, 0)\unit{m}$ and $b = 0.1\unit{m}$, and the six values average 0.05, the value at the centre. The values
are exact; the view of the cube is chosen for the drawing.](tut-lap-cube){#fig:seven-points}

In the steel of a safe, of density $7850\unit{kg\,m^{-3}}$, the potential is not harmonic:
$\nabla^2\field\Phi = 4\pi G\matter\rho = 6.6 \times 10^{-6}\unit{s^{-2}}$, so each value lies slightly below the
average of its neighbours. Matter makes a dip in the potential.

## The harmonic quadratics are the trace-free tables

We want all the harmonic polynomials of degree two, because the quadratic part of the potential near the camera is
one of them. Let $T_{ij}$ be a symmetric table of numbers (chapter 1.5) and $q = T_{ij}x_ix_j$ the quadratic it
makes, with repeated indices summed. We differentiate with the product rule, using $\partial_k x_i = \delta_{ki}$:

$$\partial_k q = T_{kj}x_j + T_{ik}x_i = 2T_{kj}x_j .$$

The two terms are equal because $T$ is symmetric. We differentiate again with respect to $x_k$ and sum over $k$:

$$\boxed{\;\nabla^2\bigl(T_{ij}x_ix_j\bigr) = 2T_{kj}\delta_{kj} = 2T_{kk} .\;}$$

So the quadratic is harmonic exactly when its table is trace-free. Such a table holds five independent numbers
([chapter 1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left)), so there
are five independent **harmonic polynomials** of degree two, for example $x^2 - y^2$, $y^2 - z^2$, $xy$, $yz$ and
$zx$.

The potential near the camera shows where they come from. The Taylor expansion of chapter 1.2, carried to second
order in the displacement $\vect x$ from the camera, is

$$\field\Phi(\vect x) \approx \field\Phi_0 - g_ix_i + \tfrac12\,\curv{\tE}_{ij}\,x_ix_j ,$$

where $\field\Phi_0$ is the potential at the camera, $g_i = -\partial_i\field\Phi$ is the gravitational field there,
in metres per second squared, and $\sym{tidal-tensor}{\curv{\tE}}_{ij} = \partial_i\partial_j\field\Phi$ is the tidal
tensor of chapter 1.4, in $\mathrm{s^{-2}}$. Each term is in joules per kilogram. In empty space the tide is trace-free
([chapter 1.4](/tutorial/newton/tides/#in-empty-space-the-stretch-and-the-squeezes-balance)), so the quadratic part
is harmonic. The five numbers that a pixel records are the five coefficients of this harmonic quadratic.

A polynomial whose terms all have the degree $\ell$ is likewise harmonic exactly when its table of $\ell$ indices is
trace-free,[^degree] so there are $2\ell + 1$ independent ones, as chapter 1.5 counted
([patterns of higher degree](/tutorial/newton/five-numbers/#patterns-of-higher-degree-hold-7-9-and-more-numbers)):
1, 3, 5, 7 and 9 for the degrees 0 to 4. Chapter 2.2 proves the count.

In the plane, where a function depends on $x$ and $y$ only, the real and imaginary parts of the powers of $x + iy$
(chapter 1.5b) are harmonic. They give two harmonic polynomials of each degree from one upward, and the constant at
degree zero. At degree two they are $x^2 - y^2$ and $2xy$, the patterns of chapter 1.5b's
[shear of one mass](/tutorial/newton/complex-numbers/#the-shear-of-one-mass-is-a-square). The box below shows why.

::: derivation
### In the plane, a harmonic function is the real part of a function of $x + iy$

We write a place in the plane as one complex number, $\sym{complex-place}{w} = x + iy$, as chapter 1.5b does. A
function $f(w)$ has a **derivative** $f'(w)$ if the quotient $[f(w + \Delta) - f(w)]/\Delta$ tends to one complex
number however the small complex step $\Delta$ shrinks to zero. A function with a derivative at every point of a
region is **holomorphic** there. Every polynomial in $w$ is holomorphic, because the derivative of $w^n$ is $nw^{n-1}$.

Let $f = u + iv$, with $u$ and $v$ real functions of $x$ and $y$. We take the step first along the real axis,
$\Delta = \Delta x$, and then along the imaginary axis, $\Delta = i\,\Delta y$:

$$f'(w) = \partial_xu + i\,\partial_xv, \qquad f'(w) = \frac{\partial_yu + i\,\partial_yv}{i} = \partial_yv - i\,\partial_yu .$$

The two must agree, so their real parts agree and their imaginary parts agree:

$$\partial_xu = \partial_yv, \qquad \partial_yu = -\partial_xv .$$

These are the **Cauchy–Riemann equations**. We differentiate the first with respect to $x$ and the second with
respect to $y$, and add:

$$\partial_x^2u + \partial_y^2u = \partial_x\partial_yv - \partial_y\partial_xv = 0 .$$

The mixed derivatives cancel, because for a function with continuous second derivatives the order of partial
derivatives does not matter. A holomorphic function has derivatives of every order, so $u$ and $v$ qualify; we state
this theorem without proof. The same steps in the other order give $\nabla^2v = 0$. So the real and the imaginary
parts of a holomorphic function are harmonic in the plane.

The cube $w^3$ has the real part $x^3 - 3xy^2$ and the imaginary part $3x^2y - y^3$, with the Laplacians $6x - 6x = 0$
and $6y - 6y = 0$, and $\tfrac13w^3$ is the pair $h + ig$ of the paper's equation [](/paper/#eq:hidden-spin). A
non-example is $|w|^2 = x^2 + y^2$, which needs the complex conjugate of $w$: it is not holomorphic, and its Laplacian
is 4. Chapter 3.9 uses holomorphic functions for the zeros of the shear (the paper's
[](/paper/#eq:shear-zeros)).
:::

## The value at the centre of a sphere is the average over the sphere

We want to show that the rule of the six neighbours holds exactly, over every sphere. We assume that **$h$ is harmonic
in a region that contains a whole ball** of radius $R$ about the point $\vect x_0$, its surface included. The average
of $h$ over the sphere of radius $R$ is

$$\sym{sphere-average}{\bar h}(R) = \frac{1}{4\pi R^2}\oint h\,\dd A = \frac{1}{4\pi}\oint h(\vect x_0 + R\,\hat{\vect u})\,\dd\Omega ,$$

in the unit of $h$. In the second form $\hat{\vect u}$ is the unit vector from the centre to a point of the sphere, and
$\dd\Omega$ is the solid angle of
[chapter 1.3](/tutorial/newton/gauss-and-poisson/#solid-angle-measures-how-large-a-patch-looks), with
$\dd A = R^2\,\dd\Omega$ on the sphere.

We differentiate with respect to $R$. In the second form only $h$ depends on $R$, and by the chain rule
$\dd h(\vect x_0 + R\hat{\vect u})/\dd R = \hat{\vect u}\cdot\nabla h$ (chapter 1.2). The outward normal of the sphere
is $\hat{\vect u}$, so $\dd\vect A = \hat{\vect u}\,R^2\,\dd\Omega$, and

$$\bar h'(R) = \frac{1}{4\pi}\oint\hat{\vect u}\cdot\nabla h\,\dd\Omega = \frac{1}{4\pi R^2}\oint\nabla h\cdot\dd\vect A .$$

The last integral is the flux of $\nabla h$ out of the sphere. By the divergence theorem of
[chapter 1.3](/tutorial/newton/gauss-and-poisson/#the-divergence-theorem-adds-up-the-boxes) it equals the integral of
the divergence of $\nabla h$, which is $\nabla^2 h$, over the ball:

$$\bar h'(R) = \frac{1}{4\pi R^2}\int_{\text{ball}}\nabla^2 h\,\dd V = 0 .$$

So $\bar h$ is the same for every radius up to $R$. As the radius shrinks to zero, every point of the sphere approaches
$\vect x_0$, and the average approaches $h(\vect x_0)$. Therefore

$$\boxed{\;h(\vect x_0) = \frac{1}{4\pi R^2}\oint_{|\vect x - \vect x_0| = R} h\,\dd A .\;} \label{eq:mean-value}$$

This is the **mean value property**: the value of a harmonic function at the centre of any sphere inside its region is
its average over that sphere.

**A check: the shell theorem again.** A thin uniform shell of mass $\sym{mass}{\matter M}$ and radius $R$ about the
origin has the mass $\matter M\,\dd A/4\pi R^2$ in each piece of area $\dd A$. Its potential at a point $\vect y$ is the
sum of $-G\,\dd m/|\vect x - \vect y|$ over its pieces (chapter 1.2):

$$\field\Phi(\vect y) = -G\matter M\,\frac{1}{4\pi R^2}\oint\frac{\dd A}{|\vect x - \vect y|} .$$

The fraction is the average over the sphere of $1/|\vect x - \vect y|$, a function of $\vect x$. If $\vect y$ is
outside the shell, this function is harmonic inside the sphere and on it, because its one bad point, $\vect x =
\vect y$, lies outside. By [](#eq:mean-value) the average is the value at the centre, $1/|\vect y|$, so
$\field\Phi(\vect y) = -G\matter M/|\vect y|$. This is the shell theorem of
[chapter 1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts), proved without the
symmetry argument. If $\vect y$ is inside the shell, the property says nothing, and the practice problem finds the
average: it is $1/R$, wherever $\vect y$ lies inside.

**A number.** At the camera of the locked safe, the 324 kg of gold, 3.92 m away, makes the potential
$-5.5 \times 10^{-9}\unit{J\,kg^{-1}}$ (chapter 1.2). Its average over a sphere of radius 2 m about the camera has
the same value, because the ball holds no gold. A sphere of radius 5 m encloses the gold, and by the practice problem
the average over it is $-G\matter M/R = -4.3 \times 10^{-9}\unit{J\,kg^{-1}}$, 22 per cent smaller in size.

## In empty space the potential has no peak and no pit

We want to know where a harmonic function can take its largest value. We assume that **$h$ is harmonic in a bounded
region $V$ that is all in one piece**, and continuous up to the region's **boundary**, the closed surface
$\sym{boundary}{\partial V}$ that encloses it.

Suppose that $h$ takes its largest value, $h_{\max}$, at a point $\vect x_0$ inside $V$. Take a ball about
$\vect x_0$ inside $V$. On the ball's surface $h \le h_{\max}$, while by [](#eq:mean-value) the average over the
surface is $h(\vect x_0) = h_{\max}$. An average of values that are nowhere larger than $h_{\max}$ can equal $h_{\max}$
only if every value equals it, so $h = h_{\max}$ on that sphere. The same holds on every smaller sphere about
$\vect x_0$, so $h = h_{\max}$ throughout the ball.

Now take any other point of $V$, and a path inside $V$ from $\vect x_0$ to it, which exists because $V$ is in one
piece. Let $\vect q$ be the farthest point along the path up to which $h = h_{\max}$ all the way. Since $h$ is
continuous, $h(\vect q) = h_{\max}$, so by the same argument $h = h_{\max}$ in a ball about $\vect q$. That ball holds a
further stretch of the path, so $\vect q$ is the path's end, and $h = h_{\max}$ everywhere in $V$. Applied to $-h$, the
argument treats the smallest value. So

$$\boxed{\;\begin{gathered}\text{a harmonic function that is not constant}\\ \text{takes its largest and smallest values}\\ \text{only on the boundary of its region.}\end{gathered}\;}$$

This is the **maximum principle**.

Chapter 1.4 gives a second view. There the Hessian of the potential, its table of second derivatives
$\partial_i\partial_j\field\Phi$, was the tidal tensor $\curv{\tE}_{ij}$, whose trace is zero in empty space. Where
the field vanishes, the potential near the point changes as $\tfrac12\curv{\tE}_{ij}x_ix_j$. If the tide there is not
zero, its three eigenvalues add to zero without all being zero, so one is positive and another negative, and the
potential rises along some directions and falls along others. So a point where the field vanishes and the tide does
not is a **saddle**. Where both vanish, only the maximum principle forbids a pit: at the centre
of a cube with equal masses at its eight corners, the potential rises toward the faces and falls toward the corners.

**A number.** Two people of 70 kg stand at $x = \pm a$, with $a = 1\unit{m}$. At the point midway the two pulls
cancel, and the potential is $-2G\matter M/a = -9.3 \times 10^{-9}\unit{J\,kg^{-1}}$. It falls toward each person,
so the midpoint is a maximum along the line, with $\partial_x^2\field\Phi = -4G\matter M/a^3 =
-1.87 \times 10^{-8}\unit{s^{-2}}$. Across the line, at the distance $y$ from it, the potential is
$-2G\matter M/\sqrt{a^2 + y^2}$, which rises toward zero as $|y|$ grows, so the midpoint is a minimum across, with
$\partial_y^2\field\Phi = \partial_z^2\field\Phi = +9.3 \times 10^{-9}\unit{s^{-2}}$. The three add up to zero. They
are the tide of the second check question of
[chapter 1.4](/tutorial/newton/tides/#in-empty-space-the-stretch-and-the-squeezes-balance). Figure
[](#fig:two-people) draws the potential along the line and across it.

![The potential of the two people, who stand at $x = -1\unit{m}$ and $x = 1\unit{m}$, along the line through them,
$\field\Phi(x, 0, 0)$, and across it through the midpoint, $\field\Phi(0, y, 0)$, in units of $G\matter M/a$. The
two curves meet at the midpoint at $-2$, which is the highest point along the line and the lowest across it. The
curves are exact; the people are not drawn to scale.](tut-lap-two){#fig:two-people}

A free ball at the midpoint stays there, because the field is zero. Nudged across the line, it is pulled back. Nudged
along it, it falls toward the nearer person. A rest point that pulled a nudge back in every direction would be a
minimum of the potential, and in empty space there is none. So no arrangement of masses can hold a free body at rest
stably, at a point of empty space, by gravity alone. This is **Earnshaw's theorem**. Figure [](#fig:saddle) shows a
saddle, which empty space allows, beside a peak, which it forbids.

![Two functions drawn as membranes over a disc of radius 1. On the left, the harmonic saddle $u = x^2 - y^2$ takes
its largest value, 1, and its smallest, $-1$, on the rim. On the right, the bump $u = 1 - r^2$, with
$r^2 = x^2 + y^2$, has its largest value at the centre, inside the disc, which no harmonic function can do; its
Laplacian is $-4$. The surfaces are exact, but their heights are drawn smaller than the radius and the view is chosen
for the drawing.](tut-lap-membranes){#fig:saddle}

The paper applies the principle to a density. Chapter 2.5 shows that the least assuming picture of an interior, the part
$\matter\rho_h$ of the paper's equation [](/paper/#eq:split), is harmonic inside the body. By the maximum principle its
densest and its lightest points lie on the body's surface: "It can never show a core." For a round body the picture is
round too, because the split is unique and turning the body changes nothing. So it takes one value all over the surface,
its largest and smallest values are equal, and it is constant. It has the body's mass, because it makes the same field
outside. So every round body appears as a uniform ball of its mean density, and the two-layer Earth of [chapter
1.3](/tutorial/newton/gauss-and-poisson/#the-outside-of-the-earth-cannot-tell-a-core-from-a-uniform-ball), with its iron
core of $12{,}500\unit{kg\,m^{-3}}$, appears as $5513\unit{kg\,m^{-3}}$ throughout. Panel (b) of the paper's Figure
[](/paper/#fig:same-outside) shows such a picture, densest at the wall nearest a hidden nugget of gold.

## Green's identities move a Laplacian from one function to the other

We want a rule that moves a Laplacian from one function to another inside an integral, because the paper's step in
*What the image does show* is such a move. We assume that **$u$ and $v$ have continuous second derivatives in a
bounded region $V$ and on its boundary $\partial V$**. They need not be harmonic. The product rule gives
$\partial_i(u\,\partial_iv) = \partial_iu\,\partial_iv + u\,\partial_i\partial_iv$, or in vector form

$$\nabla\cdot(u\nabla v) = \nabla u\cdot\nabla v + u\,\nabla^2v .$$

We integrate over $V$ and apply the divergence theorem to the vector field $u\nabla v$:

$$\int_V\bigl(\nabla u\cdot\nabla v + u\,\nabla^2v\bigr)\,\dd V = \oint_{\partial V}u\,\nabla v\cdot\dd\vect A . \label{eq:green-first}$$

This is **Green's first identity**. We write it again with $u$ and $v$ exchanged and subtract. The term
$\nabla u\cdot\nabla v$ is the same in both, so it cancels:

$$\boxed{\;\int_V\bigl(u\,\nabla^2v - v\,\nabla^2u\bigr)\,\dd V = \oint_{\partial V}\bigl(u\,\nabla v - v\,\nabla u\bigr)\cdot\dd\vect A .\;} \label{eq:green-second}$$

This is **Green's second identity**, which chapter 1.3 promised. The units agree, because a Laplacian divides by a
square metre where a volume multiplies by a cubic metre, and a gradient divides by a metre where an area multiplies by
a square metre.

**A check.** Take $u = 1$ and $v = r^2$ on a ball of radius $R$ about the origin. On the left, $\nabla^2 r^2 = 6$, so
the integral is $6 \times \tfrac43\pi R^3 = 8\pi R^3$. On the right, $\nabla u = 0$, and $\nabla r^2 = 2\vect x$ points
straight out with the size $2R$ on the surface, so the integral is $2R \times 4\pi R^2 = 8\pi R^3$. For
$R = 0.1\unit{m}$ both sides are $0.0251\unit{m^3}$. Figure [](#fig:green) shows where each side of the identity
is added up.

![Green's second identity on a region $V$, drawn in section. The integrand of the left side,
$u\,\nabla^2v - v\,\nabla^2u$, is added up over the inside of $V$, and the integrand of the right side,
$(u\,\nabla v - v\,\nabla u)\cdot\dd\vect A$, over its boundary $\partial V$, where each $\dd\vect A$ points straight
out. The shape of the region and the lengths of the arrows are chosen for the drawing.](tut-lap-green){#fig:green}

**What it means.** Let $h$ be harmonic inside a body, and let $\field\psi$, in joules per kilogram, be the potential
of a part of the body's matter that makes no field outside. Then $\field\psi$ is zero everywhere outside, and on the
surface it vanishes together with its gradient. By Poisson's equation that part has the density
$\nabla^2\field\psi/4\pi G$. We put $u = h$ and $v = \field\psi$ in [](#eq:green-second). On the surface the term
$h\nabla\field\psi$ vanishes because $\nabla\field\psi = 0$, and the term $\field\psi\nabla h$ because
$\field\psi = 0$. Inside, $\nabla^2h = 0$. So

$$\int h\,\nabla^2\field\psi\,\dd V = \int\field\psi\,\nabla^2h\,\dd V = 0 .$$

This is the step that the paper writes after its split of the density:

{{paper eq:split}}

So the part $\nabla^2\field\psi/4\pi G$ of the split has no moment $\int\matter\rho\,h\,\dd V$ against any harmonic
$h$. The field outside is built only from those moments (chapter 1.6), so the outside cannot see that part. Chapter 2.5
derives the split, and chapter 2.4 uses the same identity to solve Poisson's equation.

## The values on a closed surface fix the potential inside

We want to know how much of a harmonic function its values on a boundary fix. We assume that **$V$ is bounded and in
one piece**, and that $h_1$ and $h_2$ are harmonic in $V$ and equal on $\partial V$. Their difference
$w = h_1 - h_2$ is harmonic, because $\nabla^2w = \nabla^2h_1 - \nabla^2h_2 = 0$, and it is zero on
$\partial V$.[^w-real] By the maximum principle its largest and its smallest values lie on $\partial V$, where both
are zero. So $0 \le w \le 0$ everywhere in $V$, and $w = 0$:

$$\boxed{\;\begin{gathered}\text{a function harmonic in a bounded region}\\ \text{is fixed by its values}\\ \text{on the region's boundary.}\end{gathered}\;}$$

Values prescribed on a boundary are called a **boundary condition**, and this result is the **uniqueness** of the
solution of Laplace's equation with that condition.

The region outside a body has no outer boundary, so it needs one more condition: **the potential falls to zero far
away**. Two potentials with the same values on the body's surface then differ by a harmonic $w$ that is zero there and
small far away. Choose any small number $\varepsilon$. Beyond some large sphere $|w| < \varepsilon$, and between the
body and that sphere the maximum principle gives $|w| \le \varepsilon$ too. Because $\varepsilon$ can be as small as
we like, $w = 0$.

For the camera this means that the part of the potential made by the matter inside a closed surface is fixed
everywhere outside the surface by its values on it. The whole potential is fixed this way only if no matter lies
outside the surface. In the room of the locked safe the floor, the camera and the Earth lie outside any surface round
the safes, so their shares must be known and removed first. On the side of a flat camera away from all the sources,
likewise, the potential is fixed by its values on the camera's plane (chapter 2.4 writes the formula).

With no body at all, the same argument fixes a potential by its sources. Two potentials made by the same density
differ by a $w$ with $\nabla^2w = 4\pi G\matter\rho - 4\pi G\matter\rho = 0$ everywhere, which falls to zero far away.
The argument above, with no body, gives $w = 0$. Chapter 2.4 builds the potential from its sources.

::: try {#mean-value}
Predict first: raise one edge of the square as high as you like. Can any point inside rise above it? The square opens
on $x^2 - y^2$, already settled; set the edges with the sliders and watch the inside relax to the harmonic function
with those edges. Then move the probe circle and compare the average round it with the value at its centre. Last, open
the gold: a sphere round the camera averages the gold's potential, $-5.52 \times 10^{-9}\unit{J\,kg^{-1}}$, until
it reaches the gold at 3.92 m. Predict what the average does beyond that, then read it at 5 m.
:::

## A harmonic function is fixed by its values in any small ball

This section is a sketch, at depth B. We want to know whether a camera must surround a body to fix the body's
potential outside it, or whether a small piece of space is enough.

Every harmonic function is **analytic**: round every point of its region it equals the sum of its Taylor series, in
some ball about that point. We state this without proof. So if every derivative of a harmonic function is zero at a
point, its Taylor series there is zero, and the function vanishes in a ball about that point.

Suppose that a harmonic function $h$ vanishes in a small ball inside a region that is **connected**, that is, all in
one piece. Follow a path inside the region from the ball to any other point, and let $\vect q$ be the farthest point
along it up to which $h$ vanishes round every point. Each derivative of $h$ is continuous and is zero on the path
before $\vect q$, so it is zero at $\vect q$ too. Then $h$ vanishes in a ball about $\vect q$, which holds a further
stretch of the path, so $\vect q$ is the path's end. This is the argument of the maximum principle, with "every
derivative is zero" in place of "$h = h_{\max}$". Applied to the difference of two harmonic functions, it gives

$$\boxed{\;\begin{gathered}\text{two functions harmonic in a connected region}\\ \text{that agree in any small ball}\\ \text{agree everywhere in it.}\end{gathered}\;}$$

This is **unique continuation**. For the camera it means that a noiseless reading of a body's potential in any small
piece of the empty space round it would fix that potential everywhere outside the body, provided the outside is
connected, as the paper assumes before its split.[^flat] The potential $\field\psi$ of the split is a non-example: it
vanishes on the whole outside without vanishing everywhere, because inside the body it is not harmonic.

No real camera gets this much. A ripple of density whose crests lie $\lambda$ apart, in metres, makes a potential that
fades with the height $z$ above the body as $e^{-2\pi z/\lambda}$: the paper's equation [](/paper/#eq:evanescent), with
its wavenumber $k = 2\pi/\lambda$, which chapter 2.7 derives. For crests 10 cm apart, the ripple's potential is
$e^{2\pi} = 535$ times weaker 10 cm above the body than at its surface, and $e^{4\pi} = 2.9 \times 10^5$ times weaker 20
cm above it. To recover the ripple, the camera must multiply its reading by that factor, and its noise with it. So the
continuation is exact but unstable, and noise decides how much detail can be brought back ([chapter
3.7](/tutorial/noise/blur-law/#what-the-law-means)).

::: gap
This sketch does not prove that harmonic functions are analytic, which follows from chapter 2.4's formula for a
harmonic function inside a ball as an integral over its surface, nor the version for a flat camera.
:::

## The product of two harmonic functions is not harmonic

We want to know whether the dot product $\nabla h\cdot\nabla g$ of two gradients, which the paper meets, is harmonic.
The product rule, applied twice to $hg$, gives

$$\nabla^2(hg) = g\,\nabla^2h + 2\,\nabla h\cdot\nabla g + h\,\nabla^2g .$$

For $h$ and $g$ harmonic the first and the last terms vanish:

$$\boxed{\;\nabla h\cdot\nabla g = \tfrac12\,\nabla^2(hg) .\;}$$

With $h = g = x$, both sides are 1. With $h = g = \tfrac12(x^2 - y^2)$, the left side is
$x^2 + y^2$, and the right side is $\tfrac18\nabla^2(x^2 - y^2)^2 = \tfrac18(8x^2 + 8y^2)$, the same. But
$x^2 + y^2$ is not harmonic, since its Laplacian is 4. So neither the product of two harmonic functions nor the dot
product of their gradients is harmonic in general.

The paper's equation [](/paper/#eq:thermal-moment) finds the integral $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$
in the trembling of a warm body, and chapter 1.7 shows that it is the response of one moment of a body to a kick made
by another ([the bracket of two moments](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside)). The
field outside holds only moments against harmonic functions, and $\nabla h\cdot\nabla g$ is not harmonic beyond the
lowest degrees, so, in the paper's words, "the right-hand side holds what the static field cannot see".[^ladder]

::: check
### Q

Is $x^2 + y^2 - 2z^2$ harmonic? Is $x^2 + y^2 + z^2$?

### A

The first is, because its table has the diagonal $1$, $1$, $-2$, whose trace is zero. The second is not, because
$\nabla^2 r^2 = 6$.

### Q

Why can a free test mass not rest stably at any point of empty space under gravity alone?

### A

A stable rest point would be a minimum of the potential, and a harmonic function has no minimum inside its region
unless it is constant. Inside a closed shell the potential is constant: every point is then a minimum, but none pulls
a nudged mass back.

### Q

A camera knows exactly the potential made by the two safes alone, on a closed surface round them. What else does it
know?

### A

That potential everywhere outside the surface, by uniqueness, because it is harmonic there and falls to zero far away.
It does not fix the potential inside, where the steel and the gold are sources, nor the whole potential of the room,
because the floor, the camera and the Earth are sources outside the surface.

### Q

What is the average of $1/|\vect x - \vect y|$ over a sphere of radius 1 m about the origin, if $|\vect y| = 3\unit{m}$?

### A

The function is harmonic inside and on the sphere, so its average is its value at the centre, $1/3\unit{m^{-1}}$.
:::

**The idea to keep: in empty space the potential at each point is the average of the potential round it, so it has
no peak and no pit there, and its values on a closed surface fix it everywhere inside. Green's second identity lets a
Laplacian move from one function to the other, which is how the next chapters weigh what the outside can and cannot
see.**

::: problems
### Practice

Show directly that $1/r$ has the mean value property over a sphere that does not enclose the origin. Take a sphere of
radius $R$ whose centre is at the distance $D > R$ from the origin, and let $\vartheta$ be the angle at the centre
between the line to the origin and the line to a point of the sphere. Chapter 1.5 gave the band of solid angle
$2\pi\sin\vartheta\,\dd\vartheta$; with $\mu = \cos\vartheta$ it is $2\pi\,\dd\mu$. Find the average of $1/r$. Then
repeat for $D < R$.

::: solution
The point of the sphere at the angle $\vartheta$ is at the distance $r = \sqrt{D^2 + R^2 - 2DR\mu}$ from the origin.
The band between $\mu$ and $\mu + \dd\mu$ is the fraction $2\pi\,\dd\mu/4\pi = \tfrac12\dd\mu$ of the sphere. The
derivative of $\sqrt{D^2 + R^2 - 2DR\mu}$ with respect to $\mu$ is $-DR/\sqrt{D^2 + R^2 - 2DR\mu}$, so an
antiderivative of $1/r$ is $-\sqrt{D^2 + R^2 - 2DR\mu}/DR$, and the average is

$$\begin{aligned}
&\frac12\int_{-1}^{1}\frac{\dd\mu}{\sqrt{D^2 + R^2 - 2DR\mu}}\\
&\quad= \frac{1}{2DR}\Bigl[\sqrt{D^2 + R^2 - 2DR\mu}\Bigr]_{\mu=1}^{\mu=-1}\\
&\quad= \frac{(D + R) - |D - R|}{2DR}.
\end{aligned}$$

For $D > R$ this is $2R/2DR = 1/D$, the value of $1/r$ at the centre. For $D < R$ it is $2D/2DR = 1/R$, which does
not depend on $D$: inside a uniform shell the potential is the same everywhere.
:::

### Stretch

Let $\vect\zeta$ be a vector with complex components, in inverse metres, so that $\vect\zeta\cdot\vect x$ is a
number. Show that $e^{\vect\zeta\cdot\vect x}$ is harmonic exactly when $\vect\zeta\cdot\vect\zeta = 0$, the dot
product taken without a complex conjugate, as for the null vectors of
[chapter 1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero). Check it for
$\vect\zeta = \tfrac12(i\vect\xi + \vect\eta)$, with $\vect\xi$ and $\vect\eta$ real vectors that are perpendicular and
of equal length.

::: solution
Each derivative $\partial_i$ brings down the factor $\zeta_i$, so $\nabla^2e^{\vect\zeta\cdot\vect x} =
\zeta_i\zeta_i\,e^{\vect\zeta\cdot\vect x}$. The exponential is never zero, so the function is harmonic exactly when
$\vect\zeta\cdot\vect\zeta = 0$. For the given vector,

$$\vect\zeta\cdot\vect\zeta = \tfrac14\bigl(-\vect\xi\cdot\vect\xi + \vect\eta\cdot\vect\eta\bigr) + \tfrac{i}{2}\,\vect\xi\cdot\vect\eta ,$$

and both parts vanish when $|\vect\eta| = |\vect\xi|$ and $\vect\eta\perp\vect\xi$. These are the paper's harmonic
exponentials $h_\pm$ of equation [](/paper/#eq:calderon), with which chapter
[13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple) reads the Fourier
transform of a density from two readings of its field.
:::

### The paper

In *What the image does show* the paper writes
$\int h\,\nabla^2\field\psi\,\dd V = \int\field\psi\,\nabla^2h\,\dd V = 0$. Derive it from Green's second identity,
and say which surface term needs $\field\psi = 0$ and which needs $\nabla\field\psi = 0$. Then take $h = 1$ and
$\field\psi = 1 - r^2/R^2$ on a ball of radius $R$, a function that vanishes on the surface while its gradient does
not. Show that for it the paper's step fails: $\int h\,\nabla^2\field\psi\,\dd V$ is not zero. Green's identity
still holds, and the surface term that survives makes up the difference.

::: solution
With $u = h$ and $v = \field\psi$, the surface integral is
$\oint(h\,\nabla\field\psi - \field\psi\,\nabla h)\cdot\dd\vect A$. The first term needs $\nabla\field\psi = 0$ on
the surface and the second needs $\field\psi = 0$. With both, and $\nabla^2h = 0$, the volume integral
$\int h\,\nabla^2\field\psi\,\dd V$ is zero.

For the example, $\nabla^2\field\psi = -6/R^2$, so $\int h\,\nabla^2\field\psi\,\dd V = -\tfrac{6}{R^2} \times
\tfrac43\pi R^3 = -8\pi R$, which is not zero, while $\int\field\psi\,\nabla^2 h\,\dd V = 0$. The gradient
$\nabla\field\psi = -2\vect x/R^2$ has the size $2/R$ on the surface and points inward, so the surviving term is
$\oint h\,\nabla\field\psi\cdot\dd\vect A = -\tfrac{2}{R} \times 4\pi R^2 = -8\pi R$, the same.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), *What the image does show*, uses the maximum principle for "It can never show
  a core" and Green's second identity for the split of equation [](/paper/#eq:split). *How sharp* and *Other
  gravitational sensors* trace the blur to the fade of equation [](/paper/#eq:evanescent).
- *What heat reveals* uses $\nabla h\cdot\nabla g = \tfrac12\nabla^2(hg)$ after equation
  [](/paper/#eq:thermal-moment).
- [Section XII](/paper/#sec:hair) builds the field outside a body from its moments against harmonic functions.
- [Section XIII](/paper/#sec:second-order) uses the harmonic exponentials of equation [](/paper/#eq:calderon), the
  pair $(x + iy)^3/3$ of equation [](/paper/#eq:hidden-spin), and equation [](/paper/#eq:ladder).
- *The moments and the weight*, in [Appendix C](/paper/#app:proofs), uses unique continuation.
:::

::: deeper
- The GR course's [lesson on Poisson's equation from a flux](https://neovand.github.io/general-relativity/chapter-12.html#poisson-from-a-flux)
  goes from Gauss's law to the equation that this chapter empties of matter.
- The GR course's [problem A.5](https://neovand.github.io/general-relativity/appendix-a.html#a-5-a-divergence-free-field-can-hide-a-puncture)
  shows why Green's identities ask for smooth functions.
- Sheldon Axler, Paul Bourdon and Wade Ramey, *Harmonic Function Theory* (Springer, 2nd edition, 2001), chapters 1
  and 2, prove the mean value property, the maximum principle and the Poisson formula at this level.
- Oliver Dimon Kellogg, *Foundations of Potential Theory* (Springer, 1929; Dover reprint), derives them from
  Newton's potential.
:::

::: history
### Laplace, Green, Gauss and Earnshaw

Pierre-Simon Laplace wrote his equation in the 1780s, in work on the shapes of the planets. George Green, a
self-taught miller from Nottingham, published his identities in 1828 in a privately printed essay, which William
Thomson rediscovered in 1845. Carl Friedrich Gauss proved the mean value property in 1840 for the potential of masses
outside a sphere, in Article 20 of his *Allgemeine Lehrsätze* on forces that fall as the inverse square. Samuel
Earnshaw's theorem, for any such forces, was published in 1842 in the *Transactions of the Cambridge Philosophical
Society*.
:::

[^air]: Air, of $1.2\unit{kg\,m^{-3}}$, adds $4\pi G\matter\rho = 1.0 \times 10^{-9}\unit{s^{-2}}$ to the trace of
    the tide, a ninth of the person's tide at a metre. It is uniform and known, so its share is removed like the
    floor's.

[^b]: In the paper $b$ is a spacing of pixels or an impact parameter; here it is only the distance to a neighbour.

[^letters]: We write $h$ and $g$ for harmonic functions, as the paper does, in whatever unit they carry. Elsewhere
    $h$ is also a strain (the paper's Section II) and a height (chapter 3.7), and the vector $\vect g$ of chapter 1.2
    is the gravitational field.

[^degree]: The same two differentiations, applied to a symmetric $T_{i_1\cdots i_\ell}x_{i_1}\cdots x_{i_\ell}$,
    give $\ell(\ell - 1)\,T_{kk\,i_3\cdots i_\ell}\,x_{i_3}\cdots x_{i_\ell}$, which vanishes for every $\vect x$
    exactly when the table's trace (two indices set equal and summed) is zero.

[^w-real]: Here $w$ is a real function of position, not the complex place $x + iy$ of the box.

[^flat]: A flat camera reads a piece of a surface, not a ball. Its tides give the potential's value on the surface and
    its slope along the normal, both up to a constant and a uniform pull, which no tide sees, and with these the
    same conclusion holds. We state it without proof.

[^ladder]: When $h$ and $g$ are quadratics, $\nabla h\cdot\nabla g$ is a quadratic, so two Laplacians make it zero.
    The paper's equation [](/paper/#eq:ladder) says which functions killed by several Laplacians a tide of a given
    degree reaches, and chapter
    [13.3](/tutorial/what-a-field-keeps/ladder/#no-tide-reaches-beyond-the-rungs-below-its-degree-whatever-is-read)
    derives it.
