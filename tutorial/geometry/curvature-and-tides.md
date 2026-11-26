---
id: '7.2'
title: 'Curvature and tides: the Riemann tensor and geodesic deviation'
question: 'Falling removes gravity at a point. What is left, and why is it a piece of the curvature of spacetime?'
part: '7'
requires: ['1.1', '1.4', '1.5', '6.2', '7.1']
paper: [sec:pixel, eq:tidal, eq:deviation, eq:newton, eq:magnetic, fig:tidal, fig:tidal-field, sec:one-pixel, eq:bianchi-wave]
figures: [fig:tidal, fig:tidal-field]
live: [carry-around, tidal-ring]
depth: A
---

At one event, a change of coordinates can give the metric the values of flat spacetime and remove all its first
derivatives, so that a box falling freely feels no pull there (section
[7.1](/tutorial/geometry/metric/#falling-removes-the-fields-first-derivatives-at-a-point-but-not-its-second)). But 20
combinations of the metric's second derivatives survive every choice of coordinates. What are they, and what do they do
to a pair of free balls? For an observer at rest relative to the masses, with proper time $t$, the tide that remains is
$\curv\tE_{ij} = c^2R_{0i0j}$, where $R$ is the Riemann curvature tensor, and two free particles a small vector $\xi^i$
apart accelerate relative to each other by $\ddot\xi^i = -\curv\tE_{ij}\xi^j$.[^pa] The ring of free balls in panel (a)
of the figure below is stretched along the line to a mass and squeezed across it.

{{paper fig:tidal}}

![Look first at the tube's top: twelve free balls that start on a circle end on an ellipse, squeezed across the line to
the mass and spread along it. Each ball moves as straight as spacetime allows, and falling with the centre removes the
pull; what remains is the bending of neighbouring free paths, the curvature. The dashed circles are the ring
undisturbed. The distortion is exaggerated, and the mass's size and distance are schematic.](tut-curvature-tube){#fig:free-tube}

::: plain
On a curved surface such as a sphere, an arrow carried round a loop without ever being turned comes back pointing in a
new direction. On a flat sheet it comes back unchanged, whatever grid of labels is drawn on the sheet. That turning is
what curvature means, and no relabelling of the points can create it or remove it.

Spacetime can be curved in the same sense. There the measuring device is a pair of free balls falling side by side. Each
moves as straight as it can, yet the gap between them grows or shrinks, at a rate set by the curvature. The table that
holds the curvature is the Riemann tensor, with twenty independent numbers at each place and moment. For an observer at
rest, six of them are the tide that a pixel measures, which near slow matter is Newton's tide.
:::

## Curvature is what no change of coordinates removes

We want a property of a space that a change of labels can neither create nor remove, since relabelling changes both the
metric and the Christoffel symbols (section 7.1). A sphere gives the first example.

On a surface, an arrow is **carried without turning**, or **parallel transported**, when at each small step it is kept
parallel to itself in the small patch of surface around it, which looks flat.

Start at the North Pole with an arrow pointing south along the meridian of Greenwich. Walk down that meridian to the
equator, with the arrow pointing ahead. Walk east a quarter of the way round the equator, with the arrow still
pointing south, now at right angles to the path. Then walk north along the meridian of 90° east, back to the pole, with
the arrow pointing behind you. It now points south along that meridian, turned by 90° although never turned on the way.

The loop encloses one eighth of the sphere. For a sphere of radius $a$ that area is $4\pi a^2/8 = \pi a^2/2$, and
divided by $a^2$ it is $\pi/2$, which in radians is 90°. This is an instance of a rule, which we state without proof:
**on a sphere of radius $a$, an arrow carried round any loop comes back turned by the area enclosed divided by $a^2$**,
in radians. For an equilateral triangle on the Earth ($a = 6371$ km) with sides of 1000 km, the area is $4.3 \times
10^5\unit{km^2}$ and the turn is $0.61°$, a little more than the width of the full Moon. The turn after a loop is called
the loop's **holonomy**.

The **curvature** of a surface at a point is the turn of an arrow carried round a small loop there, divided by the
loop's area. For the sphere it is $1/a^2$, in $\mathrm{m^{-2}}$, the same everywhere. The walk used no coordinates, so
the curvature cannot depend on the labels.

On the flat sheet an arrow carried round any loop keeps the same components along fixed straight axes, so it comes back
unturned. In polar coordinates its components change as it goes and $\Gamma^r{}_{\theta\theta} = -r$ is not zero, yet it
still comes home unturned (Figure [](#fig:carried-arrow)). The next section builds the combination of Christoffel symbols
that is zero for the sheet and $1/a^2$ for the sphere.

![Look first at the two arrows at the start of each loop. On the sphere the arrow, never turned on the way, comes home
turned by 90°, the area enclosed divided by $a^2$; on the flat sheet it comes home unturned, although its polar
components change on the way and the Christoffel symbols are not zero.](tut-curvature-loops){#fig:carried-arrow}

::: try {#carry-around}
A sphere of radius $a$ and a loop on it whose corners you can drag; its sides are arcs of great circles. *Carry the
arrow round* takes an arrow round the loop without turning it, and the readouts compare the angle by which it comes home
turned with the area enclosed divided by $a^2$. A switch replaces the sphere by a flat sheet with polar labels. It
opens on the octant above.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, make a
long thin loop near the equator and a small round one near the pole with the same area, and compare their turns.
:::

## The Riemann tensor is built from the Christoffel symbols, yet it is a tensor

We want the curvature in terms of the metric. Carry an arrow $v^\alpha$ without turning round a small loop that goes
first along a small step $s^\gamma$, then along a step $q^\delta$, then back along each. To first order in the loop's
area it comes home changed by

$$\delta v^\alpha = -\sym{riemann}{\curv R}^\alpha{}_{\beta\gamma\delta}\,v^\beta s^\gamma q^\delta , \label{eq:loop}$$

which we state without proof (the last box of this section). The table $\curv R^\alpha{}_{\beta\gamma\delta}$ that links
the change to the arrow and the loop is the **Riemann tensor**. Carrying an arrow without turning uses the Christoffel
symbols $\sym{christoffel}{\Gamma^\mu{}_{\alpha\beta}}$ of 7.1, so the table is built from them and their derivatives.
With $\sigma$ summed over its four values, it is

$$\boxed{\;\begin{aligned}\curv R^\alpha{}_{\beta\gamma\delta} &= \partial_\gamma\Gamma^\alpha{}_{\beta\delta} - \partial_\delta\Gamma^\alpha{}_{\beta\gamma}\\
&\quad + \Gamma^\alpha{}_{\gamma\sigma}\Gamma^\sigma{}_{\beta\delta} - \Gamma^\alpha{}_{\delta\sigma}\Gamma^\sigma{}_{\beta\gamma} ,\end{aligned}\;} \label{eq:riemann}$$

in the **sign convention** of C. W. Misner, K. S. Thorne and J. A. Wheeler's *Gravitation* (1973). Each of its four
indices takes four values, so it has $4^4 = 256$ entries, most of them repeats. When every coordinate is a length, each
Christoffel symbol is in $\mathrm{m^{-1}}$, so each term is in $\mathrm{m^{-2}}$. Lowering the first index with the
metric gives $\sym{riemann-lowered}{\curv R}_{\alpha\beta\gamma\delta} = \field g_{\alpha\mu}\curv
R^\mu{}_{\beta\gamma\delta}$.

**Why it is a tensor.** A single Christoffel symbol is not a tensor: on the flat sheet straight axes make
$\Gamma^r{}_{\theta\theta} = -r$ zero. The Riemann tensor is one, because in [](#eq:loop) $\delta v$, $v$, $s$ and $q$
are all arrows, whose components change with the chain rule, so the table that links them changes with one chain-rule
matrix, $\partial x'/\partial x$ or its inverse, for each index. As in section
[6.2](/tutorial/relativity/spacetime-vectors/#a-tensor-is-a-table-whose-every-index-changes-with-the-boost),
**if the Riemann tensor is zero in one system of coordinates, it is zero in every one**.

**The flat sheet, checked.** On the sheet, $\dd s^2 = \dd r^2 + r^2\dd\theta^2$ gives $\Gamma^r{}_{\theta\theta} = -r$ and
$\Gamma^\theta{}_{r\theta} = \Gamma^\theta{}_{\theta r} = \tfrac12\field g^{\theta\theta}\partial_r\field g_{\theta\theta}
= 1/r$, and every other symbol is zero. We take [](#eq:riemann) with $\alpha = \gamma = r$ and $\beta = \delta =
\theta$. The first term is $\partial_r(-r) = -1$. The second is zero, because $\Gamma^r{}_{\theta r} = 0$. The third is
zero, because $\Gamma^r{}_{r\sigma} = 0$ for both values of $\sigma$. In the fourth only $\sigma = \theta$ contributes,
$-\Gamma^r{}_{\theta\theta}\Gamma^\theta{}_{\theta r} = -(-r)(1/r) = +1$. So

$$\curv R^r{}_{\theta r\theta} = -1 + 0 + 0 + 1 = 0 .$$

On a surface this one component fixes the others (the count below), so the sheet is flat. The products of Christoffel
symbols matter: the derivative term alone gives $-1$.

**The loop, checked on the sphere.** On a sphere of radius $a$, with $\vartheta$ the angle from the North Pole and
$\varphi$ the longitude, the same four terms give $\curv R^\vartheta{}_{\varphi\vartheta\varphi} = \sin^2\vartheta$ (the
box below). We put it into [](#eq:loop) for a small loop that goes first a step $\dd\vartheta$ south and then a step
$\dd\varphi$ east, so that $s^\vartheta = \dd\vartheta$ and $q^\varphi = \dd\varphi$. An arrow of length 1 pointing east
has the one component $v^\varphi = 1/(a\sin\vartheta)$, because a step $\dd\varphi$ east has length
$a\sin\vartheta\,\dd\varphi$. So

$$\delta v^\vartheta = -\curv R^\vartheta{}_{\varphi\vartheta\varphi}\,v^\varphi\,\dd\vartheta\,\dd\varphi = -\frac{\sin\vartheta}{a}\,\dd\vartheta\,\dd\varphi .$$

This is a change across the arrow, toward the north, of length $a|\delta v^\vartheta| = \sin\vartheta\,\dd\vartheta\,
\dd\varphi$. For an arrow of length 1 that is the angle of the turn, in radians. The loop's sides are $a\,\dd\vartheta$
and $a\sin\vartheta\,\dd\varphi$, so

$$\text{turn} = \sin\vartheta\,\dd\vartheta\,\dd\varphi = \frac{\text{area}}{a^2} ,$$

which is the rule of the first section, now from the formula. The curvature, the turn divided by the area, is $\curv
R_{\vartheta\varphi\vartheta\varphi}/(\field g_{\vartheta\vartheta}\field g_{\varphi\varphi}) = 1/a^2$.

::: derivation
### The sphere's one number

On the sphere $\dd s^2 = a^2(\dd\vartheta^2 + \sin^2\vartheta\,\dd\varphi^2)$, so $\field g_{\vartheta\vartheta} = a^2$
and $\field g_{\varphi\varphi} = a^2\sin^2\vartheta$. Only $\field g_{\varphi\varphi}$ varies, and only with
$\vartheta$, so the Christoffel symbols that are not zero are

$$\begin{aligned}\Gamma^\vartheta{}_{\varphi\varphi} &= -\tfrac12\field g^{\vartheta\vartheta}\partial_\vartheta\field g_{\varphi\varphi} = -\sin\vartheta\cos\vartheta ,\\
\Gamma^\varphi{}_{\vartheta\varphi} = \Gamma^\varphi{}_{\varphi\vartheta} &= \tfrac12\field
g^{\varphi\varphi}\partial_\vartheta\field g_{\varphi\varphi} = \cot\vartheta .\end{aligned}$$

In [](#eq:riemann) with $\alpha = \gamma = \vartheta$ and $\beta = \delta = \varphi$, the first term is
$\partial_\vartheta(-\sin\vartheta\cos\vartheta) = \sin^2\vartheta - \cos^2\vartheta$. The second is zero, because
$\Gamma^\vartheta{}_{\varphi\vartheta} = 0$, and the third is zero, because $\Gamma^\vartheta{}_{\vartheta\sigma} = 0$
for both values of $\sigma$. In the fourth only $\sigma = \varphi$ contributes,
$-\Gamma^\vartheta{}_{\varphi\varphi}\Gamma^\varphi{}_{\varphi\vartheta} = -(-\sin\vartheta\cos\vartheta)\cot\vartheta =
\cos^2\vartheta$. So $\curv R^\vartheta{}_{\varphi\vartheta\varphi} = \sin^2\vartheta$, and lowering with $\field
g_{\vartheta\vartheta} = a^2$ gives $\curv R_{\vartheta\varphi\vartheta\varphi} = a^2\sin^2\vartheta$.
:::

**Symmetries.** The Riemann tensor with all indices lowered changes sign when the first two indices are exchanged, and
when the last two are; it is unchanged when the first pair is exchanged with the second; and a cyclic sum over its last
three indices vanishes:

$$\begin{aligned}\curv R_{\alpha\beta\gamma\delta} &= -\curv R_{\beta\alpha\gamma\delta} = -\curv R_{\alpha\beta\delta\gamma} = \curv R_{\gamma\delta\alpha\beta} ,\\
0 &= \curv R_{\alpha\beta\gamma\delta} + \curv R_{\alpha\gamma\delta\beta} + \curv R_{\alpha\delta\beta\gamma}
.\end{aligned}$$

The last line is the **cyclic identity**, also called the **first Bianchi identity**.
[](#to-first-order-the-curvature-is-made-of-second-derivatives-of-the-metric) reads each of them off the formula.

**The count.** We count the **independent components**, the numbers that can each be chosen freely and together fix the
table (section [1.5](/tutorial/newton/five-numbers/#a-tidal-table-is-symmetric-so-six-numbers-are-enough)). By the first
two symmetries, $\curv R_{\alpha\beta\gamma\delta}$ is zero when $\alpha = \beta$ or $\gamma = \delta$, and it depends
on each pair only as a pair of different indices, up to a sign. In $n$ dimensions there are $N = n(n-1)/2$ such pairs;
in four they are 01, 02, 03, 12, 13 and 23. By the pair symmetry, the Riemann tensor is a symmetric table of $N$ rows
and columns, which has $N(N + 1)/2$ independent entries, 21 in four dimensions. The cyclic identity adds nothing when
two of its indices are equal, because the other symmetries already make its sum zero. When all four differ, the other
symmetries turn every ordering of the same four indices into the same condition, so the identity gives one condition for
each set of four different indices. There are $\binom n4 = n(n-1)(n-2)(n-3)/24$ such sets: none
in two or three dimensions, and in four the one set 0123, which gives $\curv R_{0123} + \curv R_{0231} + \curv R_{0312}
= 0$. So the number of independent components is

$$\boxed{\;\frac{N(N + 1)}{2} - \binom n4 = \frac{n^2(n^2 - 1)}{12} ,\;}$$

which is 1, 6 and 20 for $n = 2$, 3 and 4. A surface has one number at each point, the sphere's $1/a^2$; space of three dimensions has six; spacetime has 20.
The curvature at an event is built from the combinations of second derivatives that survive the count of section 7.1
(the section on the linearized curvature below shows this), and it has 20 independent components, so those 20 survivors
are independent.

::: gap
In components, an arrow $v^\alpha$ is carried without turning along a path $x^\gamma(\lambda)$ when $\dd
v^\alpha/\dd\lambda + \Gamma^\alpha{}_{\beta\gamma}v^\beta\,\dd x^\gamma/\dd\lambda = 0$. The same tensor measures how two rates of change along different directions
fail to commute: with $\nabla_\gamma v^\alpha = \partial_\gamma v^\alpha + \Gamma^\alpha{}_{\gamma\beta}v^\beta$, the
**covariant derivative**, $(\nabla_\gamma \nabla_\delta - \nabla_\delta\nabla_\gamma)v^\alpha = \curv
R^\alpha{}_{\beta\gamma\delta}v^\beta$. This box derives neither that formula nor [](#eq:loop).
:::

## Two free balls drift apart by the curvature between them

A pixel's test masses show the relative acceleration of two neighbouring free balls. We assume that **both balls fall
freely**, and that **their separation is small** compared with the distance over which the curvature changes (the
distance $r$ to a body, so the small parameter is $\xi/r$, as in section 1.4).

The first ball, the reference, follows the path $x^\mu(\obs\tau)$ with four-velocity $\sym{four-velocity}{\obs u}^\mu =
\dd x^\mu/\dd\obs\tau$, in metres per second, and $\sym{proper-time}{\obs\tau}$ its proper time. The second follows
$x^\mu + \sym{separation}{\xi}^\mu$, where $\xi^\mu(\obs\tau)$ is the **separation**, in metres. We label the second
ball's events by the reference ball's $\obs\tau$ and assume that **this label runs at a steady rate against the second
ball's own proper time**, so that it is an affine parameter there too, a label in which the geodesic equation of 7.1
keeps its form. Each ball obeys that equation, with the Christoffel symbols taken at its own place:

$$\begin{aligned}
&\frac{\dd^2x^\mu}{\dd\obs\tau^2} + \Gamma^\mu{}_{\alpha\beta}(x)\,\obs u^\alpha\obs u^\beta = 0 ,\\
&\frac{\dd^2(x^\mu + \xi^\mu)}{\dd\obs\tau^2}\\
&\quad + \Gamma^\mu{}_{\alpha\beta}(x + \xi)\Bigl(\obs u^\alpha + \frac{\dd\xi^\alpha}{\dd\obs\tau}\Bigr)\Bigl(\obs u^\beta + \frac{\dd\xi^\beta}{\dd\obs\tau}\Bigr) = 0 .
\end{aligned}$$

We expand $\Gamma^\mu{}_{\alpha\beta}(x + \xi) \approx \Gamma^\mu{}_{\alpha\beta}(x) +
\xi^\nu\partial_\nu\Gamma^\mu{}_{\alpha\beta}(x)$, subtract the first equation from the second, and keep only the terms
of first order in $\xi$. The two cross terms are equal, because the Christoffel symbols are symmetric in their lower
indices:

$$\begin{aligned}\frac{\dd^2\xi^\mu}{\dd\obs\tau^2} &= -\xi^\nu\,\partial_\nu\Gamma^\mu{}_{\alpha\beta}\,\obs u^\alpha\obs u^\beta\\
&\quad - 2\Gamma^\mu{}_{\alpha\beta}\,\obs u^\alpha\frac{\dd\xi^\beta}{\dd\obs\tau} .\end{aligned}$$

Now we choose coordinates that fall with the reference ball and do not turn, in which **every Christoffel symbol is zero
at every point of the reference ball's path**, not only at one event (the last box of this section). The last term
vanishes. Because $\Gamma^\mu{}_{\alpha\nu}$ is zero all along the path, its rate of change along the path is zero too:
$\obs u^\beta\partial_\beta\Gamma^\mu{}_{\alpha\nu} = 0$ there.

On the path, [](#eq:riemann) with its letters renamed ($\mu$ for $\alpha$, $\alpha$ for $\beta$, $\nu$ for $\gamma$ and
$\beta$ for $\delta$) is $\curv R^\mu{}_{\alpha\nu\beta} = \partial_\nu\Gamma^\mu{}_{\alpha\beta} -
\partial_\beta\Gamma^\mu{}_{\alpha\nu}$. We multiply by $\obs u^\alpha\xi^\nu\obs u^\beta$ and sum. The second term
carries the rate along the path, which is zero, so

$$\begin{aligned}&\curv R^\mu{}_{\alpha\nu\beta}\,\obs u^\alpha\xi^\nu\obs u^\beta\\ &\quad = \xi^\nu\,\partial_\nu\Gamma^\mu{}_{\alpha\beta}\,\obs u^\alpha\obs u^\beta ,\end{aligned}$$

which is the first term of the relative acceleration with its sign reversed. So

$$\boxed{\;\frac{\dd^2\xi^\mu}{\dd\obs\tau^2} = -\curv R^\mu{}_{\alpha\nu\beta}\,\obs u^\alpha\xi^\nu\obs u^\beta ,\;} \label{eq:geodesic-deviation}$$

the **geodesic deviation equation**. Its units check: $\mathrm{m^{-2}}$ times $(\mathrm{m\,s^{-1}})^2$ times
$\mathrm{m}$ is $\mathrm{m\,s^{-2}}$. In other coordinates the left side becomes the covariant second derivative
$\mathrm D^2\xi^\mu/\dd\obs\tau^2$, built from the $\nabla$ of the last box, and its extra terms vanish in the falling
frame, so the equation holds in every frame.

**A limit.** In flat spacetime $\curv R = 0$, so $\dd^2\xi^\mu/\dd\obs\tau^2 = 0$, and two free balls drift apart at a
steady speed, as in the inertial frames of section 6.1.

**What was dropped.** For a mass at the distance $r$ the next term of the Taylor expansion is smaller by about
$3\xi/2r$ (section 1.4), 1.5 per cent for balls 1 cm apart a metre from the person.

**What it means.** Free bodies, each moving as straight as it can, drift together or apart only if spacetime is curved
between them. What falling cannot remove is the change of the Christoffel symbols across the gap, which is the Riemann tensor
(Figure [](#fig:deviation)).

::: gap
Such coordinates exist for every free path: carry three axes along it without turning them, as gyroscopes would, and
label each nearby event by the reference ball's time and by the distances along the straightest lines that leave the
path along these axes. They are called **Fermi coordinates** (Enrico Fermi, 1922). This box does not prove that their
Christoffel symbols vanish on the path, nor does it derive the covariant form of the left side.
:::

![Look first at the three arrows $\xi$: in a frame falling with the reference ball, in which every Christoffel symbol
vanishes along its path, the separation still grows, and its acceleration is $-\curv R\,\xi$, by the geodesic deviation
equation.](tut-curvature-deviation){#fig:deviation}

## For an observer at rest the drift is the tide {#for-an-observer-at-rest-the-drift-is-the-papers-tide}

An observer at rest is held up, as a pixel on the ground is, and does not fall (section 7.1). In the falling frame of the last section the
reference ball sits at the origin, so its four-velocity is $\obs u^\mu = (c, 0, 0, 0)$ and its proper time is the
frame's time $t$. Free balls motionless beside the observer have its four-velocity. We take a separation in space, $\xi^0 = 0$ and
$\xi^j$ for $j = 1, 2, 3$.

**Raising and lowering here.** At the reference ball the metric is $\field\eta_{\mu\nu}$, so raising or lowering an
index multiplies a component by $+1$ for a spatial index and by $-1$ for the time index (section
[6.2](/tutorial/relativity/spacetime-vectors/#lowering-an-index-changes-only-the-sign-of-time)). So $\curv R^i{}_{0j0} =
\curv R_{i0j0}$ and $\curv R^0{}_{0j0} = -\curv R_{00j0}$.

In [](#eq:geodesic-deviation) only $\alpha = \beta = 0$ survive, each with a factor $c$. The time component is

$$\frac{\dd^2\xi^0}{\dd t^2} = -c^2\curv R^0{}_{0j0}\,\xi^j = c^2\curv R_{00j0}\,\xi^j = 0 ,$$

because the Riemann tensor changes sign when its first two indices are exchanged, so it vanishes when they are equal.
The separation stays in the observer's space. The spatial components are

$$\frac{\dd^2\xi^i}{\dd t^2} = -c^2\curv R^i{}_{0j0}\,\xi^j = -c^2\curv R_{i0j0}\,\xi^j .$$

Exchanging the first pair of indices gives one minus sign and exchanging the second pair another, so $\curv R_{i0j0} =
-\curv R_{0ij0} = \curv R_{0i0j}$. Therefore

$$\boxed{\;\sym{tidal-tensor}{\curv\tE}_{ij} = c^2\curv R_{0i0j} ,\qquad \frac{\dd^2\xi^i}{\dd t^2} = -\curv\tE_{ij}\,\xi^j ,\;} \label{eq:tide-curvature}$$

as stated at the start. The units check: $c^2$ in $\mathrm{m^2\,s^{-2}}$ times $\curv R$ in $\mathrm{m^{-2}}$ is
$\mathrm{s^{-2}}$, the unit of a tide.

**The table is symmetric.** By the pair symmetry, exchanging the pair $0i$ with the pair $0j$ gives $\curv R_{0j0i} =
\curv R_{0i0j}$, so $\curv\tE_{ij} = \curv\tE_{ji}$, the symmetry that section 1.4 used.

**The sign.** As in section [1.4](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives), a
negative entry $\curv\tE_{xx}$ makes $\ddot\xi^x$ positive for $\xi^x > 0$, so the balls move apart: a negative entry is
a stretch. Both the signature $-{+}{+}{+}$ and the sign of [](#eq:riemann) enter this sign.[^conventions]

**A number.** Section 1.4's stretch a metre from the 70 kg person is $\curv\tE_{rr} = -9.34 \times
10^{-9}\unit{s^{-2}}$, along the line to the person. As curvature it is

$$\begin{aligned}\curv R_{0r0r} = \frac{\curv\tE_{rr}}{c^2} &= \frac{-9.34 \times 10^{-9}\unit{s^{-2}}}{(3.00 \times 10^8\unit{m\,s^{-1}})^2}\\
&= -1.04 \times 10^{-25}\unit{m^{-2}} .\end{aligned}$$

The metric gives the same number in [](#near-slow-matter-the-curvature-is-newtons-tide).

## To first order the curvature is made of second derivatives of the metric

We want the Riemann tensor of a weak field in terms of the metric itself; the tides of this book, from a person to a
gravitational wave, are all weak.

**Step 1: the assumption.** **The field is weak**: $\field g_{\mu\nu} = \field\eta_{\mu\nu} +
\sym{metric-perturbation}{\field h}_{\mu\nu}$, with the perturbation $\field h_{\mu\nu}$ of 7.1 a table of small pure
numbers, $|\field h_{\mu\nu}| \ll 1$. We keep the first order in $\field h$ and drop every product of $\field h$ or its
derivatives with another.

**Step 2: the Christoffel symbols.** In the [formula for the Christoffel
symbols](/tutorial/geometry/metric/#free-bodies-follow-geodesics-and-the-christoffel-symbols-hold-newtons-pull), each
derivative of $\field g$ is a derivative of $\field h$, since $\field\eta$ is constant, and it is already of first
order. So the inverse metric that multiplies it can be taken as $\field\eta^{\mu\nu}$:

$$\Gamma^\mu{}_{\beta\delta} = \tfrac12\,\field\eta^{\mu\nu}\bigl(\partial_\beta\field h_{\nu\delta} + \partial_\delta\field h_{\nu\beta} - \partial_\nu\field h_{\beta\delta}\bigr) .$$

**Step 3: the products drop.** Each Christoffel symbol is of first order, so the products of two in [](#eq:riemann) are
of second order and drop, leaving $\curv R^\mu{}_{\beta\gamma\delta} = \partial_\gamma\Gamma^\mu{}_{\beta\delta} -
\partial_\delta\Gamma^\mu{}_{\beta\gamma}$.

**Step 4: lower the index and differentiate.** We multiply Step 2 by the constant $\field\eta_{\alpha\mu}$ and sum over
$\mu$, which leaves only the term $\nu = \alpha$ of the bracket, because $\field\eta_{\alpha\mu}\field\eta^{\mu\nu}$ is 1
when $\nu = \alpha$ and 0 otherwise:

$$\field\eta_{\alpha\mu}\Gamma^\mu{}_{\beta\delta} = \tfrac12\bigl(\partial_\beta\field h_{\alpha\delta} + \partial_\delta\field h_{\alpha\beta} - \partial_\alpha\field h_{\beta\delta}\bigr) .$$

We differentiate it with respect to $x^\gamma$, and subtract the same expression with $\gamma$ and $\delta$ exchanged:

$$\begin{aligned}\curv R_{\alpha\beta\gamma\delta} &= \tfrac12\bigl(\partial_\gamma\partial_\beta\field h_{\alpha\delta} + \partial_\gamma\partial_\delta\field h_{\alpha\beta} - \partial_\gamma\partial_\alpha\field h_{\beta\delta}\bigr)\\
&\quad - \tfrac12\bigl(\partial_\delta\partial_\beta\field h_{\alpha\gamma} + \partial_\delta\partial_\gamma\field h_{\alpha\beta} - \partial_\delta\partial_\alpha\field h_{\beta\gamma}\bigr) .\end{aligned}$$

The two terms in $\partial_\gamma\partial_\delta\field h_{\alpha\beta}$ cancel, because partial derivatives commute.
What is left is the **linearized curvature**:

$$\boxed{\;\begin{aligned}\curv R_{\alpha\beta\gamma\delta} = \tfrac12\bigl(&\partial_\beta\partial_\gamma\field h_{\alpha\delta} + \partial_\alpha\partial_\delta\field h_{\beta\gamma}\\
&- \partial_\alpha\partial_\gamma\field h_{\beta\delta} - \partial_\beta\partial_\delta\field h_{\alpha\gamma}\bigr) .\end{aligned}\;} \label{eq:linearized}$$

Its units check: $\field h$ is a pure number and two derivatives divide by two metres, so it is in $\mathrm{m^{-2}}$.
With no field, $\field h = 0$, it vanishes, as it should.

**Step 5: the symmetries, read off.** Each of the four symmetries follows from [](#eq:linearized) by exchanging indices,
because $\field h$ is symmetric and partial derivatives commute (the box below).

::: derivation
### The four symmetries, term by term

Write the four terms in the bracket of [](#eq:linearized), each with its sign, as $A_1$ to $A_4$, so that $A_3 =
-\partial_\alpha\partial_\gamma\field h_{\beta\delta}$ and $A_4 = -\partial_\beta\partial_\delta\field
h_{\alpha\gamma}$.

- Exchanging $\alpha$ and $\beta$ turns $A_1$ into $-A_3$, $A_2$ into $-A_4$, and back, because $\field h$ is symmetric:
  the tensor changes sign.
- Exchanging $\gamma$ and $\delta$ turns $A_1$ into $-A_4$ and $A_2$ into $-A_3$: it changes sign again.
- Exchanging the pair $\alpha\beta$ with the pair $\gamma\delta$ exchanges $A_1$ and $A_2$ and leaves $A_3$ and $A_4$
  as they are: it is unchanged.
- In the cyclic sum over $\beta\gamma\delta$, each second derivative appears once with each sign, so the sum vanishes.
:::

At an event where the local inertial frame of 7.1 makes the metric $\field\eta_{\mu\nu}$ and its first derivatives zero,
every Christoffel symbol is zero, so the products of Step 3 vanish exactly. Step 2 there reads only $0 = 0$, but its
derivative holds exactly, because the extra term from differentiating the inverse metric multiplies first derivatives of
$\field g$, which are zero there. So [](#eq:linearized) holds exactly at that event with $\field g$ in place of $\field
h$: the curvature is a combination of the metric's second derivatives, the twenty that survive the count of 7.1. The
symmetries therefore hold exactly there, and, as equations between tensors, at every event and in every frame. Sections
[7.4](/tutorial/geometry/linearized-gravity/#relabelling-the-coordinates-changes-the-table-not-the-curvature),
[7.5](/tutorial/geometry/gravitomagnetism/#moving-matter-makes-the-magnetic-part-through-the-potential-of-its-flow) and
[7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain) use this
formula.

## Near slow matter the curvature is Newton's tide

We want the tide of slowly moving matter from [](#eq:linearized), to close the circle with section 1.4. We assume first
that **the field is static**, so that no entry of $\field h_{\mu\nu}$ changes in time. From 7.1, $\field h_{00} =
-2\sym{potential}{\field\Phi}/c^2$, where $\field\Phi$ is the gravitational potential, in joules per kilogram.

We set $\alpha = \gamma = 0$, $\beta = i$ and $\delta = j$ in [](#eq:linearized):

$$\begin{aligned}\curv R_{0i0j} = \tfrac12\bigl(&\partial_i\partial_0\field h_{0j} + \partial_0\partial_j\field h_{i0}\\
&- \partial_0\partial_0\field h_{ij} - \partial_i\partial_j\field h_{00}\bigr) .\end{aligned}$$

Every term but the last carries a time derivative, which vanishes in a static field. So the entries $\field h_{0i}$ and
$\field h_{ij}$, which [7.4](/tutorial/geometry/linearized-gravity/#relabelling-the-coordinates-changes-the-table-not-the-curvature) derives, do not enter, and

$$\curv R_{0i0j} = -\tfrac12\,\partial_i\partial_j\field h_{00} = \frac{\partial_i\partial_j\field\Phi}{c^2} .$$

For matter moving slowly, at a speed $v$, the terms with time derivatives are smaller than the last by about $(v/c)^2$.
The observer's own time and lengths differ from these coordinates by factors $1 + O(\field\Phi/c^2)$, which change
$\curv R$ only at second order. With [](#eq:tide-curvature),

$$\boxed{\;\curv\tE_{ij} = \partial_i\partial_j\field\Phi ,\;}$$

which is section [1.4](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives)'s tidal
tensor, the Hessian of the potential.[^newton] This is the step that the last problem of 7.1 left to this section.

**A check.** For a point mass, $\field\Phi = -G\matter M/r$ gives section 1.4's $\curv\tE_{ij} = (G\matter
M/r^3)(\delta_{ij} - 3\hat n_i\hat n_j)$, with $\hat n$ the unit vector toward the mass: a stretch of $-2G\matter M/r^3$
along the line and squeezes of $+G\matter M/r^3$ across it, the ratio $-2 : 1 : 1$ of 1.4. That it holds in Einstein's
theory too, outside matter, is the result of section
[7.3](/tutorial/geometry/einstein-equation/#a-single-mass-stretches-twice-as-hard-as-it-squeezes-in-einsteins-theory-too).
The figure below maps this tide around one mass, with every ring stretched toward it.

{{paper fig:tidal-field}}

**Numbers.** A metre from the 70 kg person, $\curv R_{0r0r} = -2G\matter M/c^2r^3 = -1.04 \times
10^{-25}\unit{m^{-2}}$, as before, now from the metric. On the ground, from the Earth's tide of $3.08 \times
10^{-6}\unit{s^{-2}}$ (section 1.4), $\curv R_{0r0r} = -3.43 \times 10^{-23}\unit{m^{-2}}$.

A curvature in $\mathrm{m^{-2}}$ is easier to picture as a length. A sphere of radius $a$ has curvature $1/a^2$, so we
define the **radius of curvature** of one component as $|\curv R_{0r0r}|^{-1/2}$, the radius of a sphere whose curvature
has the same size. It is a scale made from one component, not the radius of a sphere into which spacetime bends. For the
person it is $3.1 \times 10^{12}$ m, 21 times the distance to the Sun, a little beyond Uranus. For the Earth at its
surface it is $1.71 \times 10^{11}$ m, 1.14 times the distance to the Sun.

**What it means.** The tide that a pixel reads is the curvature of spacetime in the direction of the pixel's own time.
Around a person its radius is about twenty times the distance to the Sun, and a gradiometer can still read it.

## The pixel reads six of the twenty numbers, and the magnetic part eight more

Which of the twenty numbers does a pixel read? We sort the components of $\curv R_{\alpha\beta\gamma\delta}$ by how many
of their indices are 0, the observer's time. A pair with two 0s vanishes, so a component has at most one 0 in each pair.

- **Two time indices**, one in each pair: $\curv R_{0i0j}$ and the entries it fixes by the symmetries, such as
  $\curv R_{i0j0}$. It is a symmetric table of three rows, so it has 6 numbers: the tide $\curv\tE_{ij}$.
- **One time index**: $\curv R_{0ijk}$, antisymmetric in $jk$. There are 3 values of $i$ and 3 pairs $jk$, so 9 entries,
  and the one condition of the count, $\curv R_{0123} + \curv R_{0231} + \curv R_{0312} = 0$, leaves 8. Section
  [7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index) packs them into the
  magnetic part, $\curv\tB_{ij} = \tfrac12c^2 \epsilon_{ipq}\curv R_{pqj0}$, whose trace is zero by the cyclic
  identity.[^magnetic]
- **No time index**: $\curv R_{ijkl}$, which by the count has 6 numbers in three dimensions. For an observer at rest in
  a static field these six are the curvature of space at one time. On a slice of space that bends within spacetime they
  differ from it by terms that measure the bending.

$$6 + 8 + 6 = 20 .$$

For two balls motionless beside the observer, [](#eq:geodesic-deviation) uses only $\curv R^i{}_{0j0}$, the tide. A
moving ball's four-velocity has spatial components, so the equation then also picks up the components with one time
index, in proportion to the ball's speed. The magnetic part therefore acts only on moving balls: it pushes them across
their velocity, as a magnetic field pushes a moving charge, which is why it is called magnetic. A pixel reads it from
how the axes of neighbouring gyroscopes twist relative to one another (section
[7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)).

![Look first at the three blocks: sorted by how many time indices they carry, the twenty numbers of the curvature are
the tide, the magnetic part and, for an observer at rest in a static field, the curvature of space. In empty space
Einstein's equation leaves five of the first two blocks each, and fixes the third by the
tide.](tut-curvature-count){#fig:twenty-numbers}

In empty space Einstein's equation sets ten combinations of the twenty to zero, and section
[7.3](/tutorial/geometry/einstein-equation/#in-empty-space-only-the-weyl-curvature-is-left-and-it-holds-ten-numbers)
derives which. What remains is the five numbers of a trace-free $\curv\tE$ and the five of a symmetric trace-free
$\curv\tB$, each one of section 1.5's tables of five, with the six of $\curv R_{ijkl}$ then fixed by $\curv\tE$. These
are the ten numbers that an ideal pixel records (Figure [](#fig:twenty-numbers)).[^bianchi]

::: try {#tidal-ring}
The figure opens with a mass of 70 kg one metre from a ring of twelve free balls, and its readout gives the stretch in
eötvös, $1\unit{E} = 10^{-9}\unit{s^{-2}}$. An entry of one eötvös is a curvature of $1.11 \times
10^{-26}\unit{m^{-2}}$, so the opening stretch of $-9.34$ E is $-1.04 \times 10^{-25}\unit{m^{-2}}$. Predict first:
if you drag the mass to 2 m, what happens to $\curv R_{0r0r}$ and to the radius of curvature? Then drag it and check.
(The stretch falls eightfold, to $-1.17$ E, so $\curv R_{0r0r} = -1.30 \times 10^{-26}\unit{m^{-2}}$, and the radius
grows by $\sqrt 8 = 2.83$, to $8.8 \times 10^{12}$ m.)
:::

<!-- try: tidal-ring, addition (small change to the existing TidalRing readout panel) — Under the principal values in
eötvös, add two lines for the stretch along the line to the mass: "as curvature: R₀ᵣ₀ᵣ = 𝓔ᵣᵣ/c² = … × 10⁻²⁶ m⁻²" and
"radius of curvature |R₀ᵣ₀ᵣ|^(−1/2) = … × 10¹² m (… AU)", to three figures, with c = 2.998 × 10⁸ m s⁻¹ and
1 AU = 1.496 × 10¹¹ m. At the opening state (70 kg at 1 m): −10.4 × 10⁻²⁶ m⁻² and 3.10 × 10¹² m (20.7 AU); at 2 m:
−1.30 × 10⁻²⁶ m⁻² and 8.77 × 10¹² m (58.6 AU). Shown only when the section asks for it (a prop on the component), so
that section 1.4's page is unchanged. -->

## Four free balls read the whole tide, and a moving pair reads the magnetic part too

How would a pixel read all six numbers of the tide? The oldest answer is the **gravitational compass** of F. A. E. Pirani
and P. Szekeres: a cluster of free balls whose separations are measured against one another [@Pirani1956;
@Szekeres1965]. Y. N. Obukhov and D. Puetzfeld review its later forms, clocks among them [@ObukhovPuetzfeld2019].

**One pair reads one number.** Two free balls at rest a distance $\ell$ apart, along the unit vector $\hat e$, have the
separation $\xi_i = \ell\hat e_i$. By [](#eq:tide-curvature) the distance between them, measured by timing light
between them, changes at the rate $\ddot\ell = \hat e_i\ddot\xi_i = -(\hat e_i\curv\tE_{ij}\hat e_j)\,\ell$. One pair
gives one number, the entry of the tide along its own line.

**Four balls read six.** Put one ball at a corner and three more a distance $\ell$ from it along $x$, $y$ and $z$. The
three arms read $\curv\tE_{xx}$, $\curv\tE_{yy}$ and $\curv\tE_{zz}$. The pair of balls at the ends of the $x$ and $y$
arms lies along $(\hat e_x - \hat e_y)/\sqrt2$, and it reads

$$\tfrac12\bigl(\curv\tE_{xx} + \curv\tE_{yy}\bigr) - \curv\tE_{xy} ,$$

which, with the two arms, gives $\curv\tE_{xy}$; the other two pairs give $\curv\tE_{xz}$ and $\curv\tE_{yz}$. So four
free balls and their six distances read the whole tide. In empty space its trace is zero, and the sixth reading is a
check.

**A moving pair reads the magnetic part.** Geodesic deviation holds for any free reference. Take two balls that move
together at the velocity $\vect w$ relative to the observer, with $w \ll c$, so that their four-velocity is $\obs u^\mu
= (c, \vect w)$ to first order. In [](#eq:geodesic-deviation) the terms with one spatial index on $\obs u$ now enter:

$$\ddot\xi^i = -c^2\curv R^i{}_{0j0}\,\xi^j - c\,w_k\bigl(\curv R^i{}_{kj0} + \curv R^i{}_{0jk}\bigr)\xi^j .$$

The magnetic part packs the components with one time index, $\curv\tB_{ij} = \tfrac12c^2\epsilon_{ipq}\curv R_{pqj0}$,
and the packing undoes as $\curv R_{pqj0} = \epsilon_{pqm}\curv\tB_{mj}/c^2$, the rule of section
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise) for each $j$. Spatial
indices rise with $+1$, so $\curv R^i{}_{kj0} = \epsilon_{ikm}\curv\tB_{mj}/c^2$, and by the pair symmetry $\curv
R^i{}_{0jk} = \curv R_{jki0} = \epsilon_{jkm}\curv\tB_{mi}/c^2$. So the pair drifts by $\ddot\xi_i =
-\curv\tE'_{ij}\xi_j$ with

$$\boxed{\;\curv\tE'_{ij} = \curv\tE_{ij} + \frac1c\bigl(\epsilon_{ikm}w_k\curv\tB_{mj} + \epsilon_{jkm}w_k\curv\tB_{mi}\bigr)
,\;} \label{eq:moving-tide}$$

a symmetric table, in $\mathrm{s^{-2}}$. **Checks.** With $\vect w = 0$ it is the tide. Its trace changes by $(2/c)w_k\epsilon_{kmi}\curv\tB_{mi}$,
which sees only the antisymmetric part of $\curv\tB$; that part is zero in empty space and in matter is set by the
matter's momentum (section 7.5), as a moving observer sees the energy density change by the momentum it moves
through.

So a gradiometer carried at $\vect w$ reads the tide changed by the magnetic part times $w/c$, and the difference
between its readings at $\vect w$ and $-\vect w$ is twice the bracket. This is the moving gradiometer of V. B.
Braginsky, C. M. Caves and K. S. Thorne [@BraginskyCavesThorne1977], carried round the Earth by B. Mashhoon, H. J. Paik
and C. M. Will [@MashhoonPaikWill1989]. **A number.** At $7.0\times10^6$ m from the Earth's centre, above its equator,
the Earth's spin makes a magnetic part of about $1.6\times10^{-12}\unit{s^{-2}}$ (section 7.5), so a gradiometer in orbit
at $7.5\unit{km\,s^{-1}}$ reads a change of order $2(w/c)|\curv\tB| = 8\times10^{-17}\unit{s^{-2}}$, a few parts in
$10^{11}$ of the Earth's tide there, $2.3\times10^{-6}\unit{s^{-2}}$.

**The idea to keep: falling removes gravity at a point but not the curvature of spacetime. Two neighbouring free balls
drift apart by $-\curv R^\mu{}_{\alpha\nu\beta}\obs u^\alpha\xi^\nu\obs u^\beta$, so for an observer at rest the tide
is $c^2\curv R_{0i0j}$, and near slow matter that piece of the curvature is the Hessian of Newton's potential. A pixel
reads six of the curvature's twenty numbers through the tide, and eight more through the magnetic part.**

::: problems
### Practice

**[7.2]** What is $\curv R_{0r0r}$ a metre from the 70 kg person, and what radius of curvature does it mean?

::: solution
It is $\curv R_{0r0r} = -2G\matter M/c^2r^3 = -1.04 \times 10^{-25}\unit{m^{-2}}$, and $|\curv R_{0r0r}|^{-1/2} = 3.1
\times 10^{12}$ m, about 21 times the distance to the Sun.
:::

**[7.2]** How many independent curvature numbers does a space of three dimensions have at a point, and why does the
cyclic identity remove none of them there?

::: solution
Six. There are $N = 3$ pairs of different indices, so the pair symmetry leaves $N(N + 1)/2 = 6$ entries. The cyclic
identity gives a new condition only for a set of four different indices, and three dimensions have none.
:::

**[7.2]** From $\field h_{00} = -2\field\Phi/c^2$ for the Earth, with $G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$
and radius $R_\oplus = 6.371 \times 10^6\unit{m}$, compute $\curv R_{0r0r}$ along the vertical and $\curv R_{0x0x}$
along a horizontal direction $x$ at the surface, and the radius of curvature of each.

::: solution
By [](#near-slow-matter-the-curvature-is-newtons-tide), $c^2\curv R_{0i0j} = \partial_i\partial_j\field\Phi$, which for
the Earth is $(G\matter M/R_\oplus^3)(\delta_{ij} - 3\hat n_i\hat n_j)$. Here $G\matter M/R_\oplus^3 = 1.54 \times
10^{-6}\unit{s^{-2}}$. Along the vertical, $\curv R_{0r0r} = -2G\matter M/c^2R_\oplus^3 = -3.43 \times
10^{-23}\unit{m^{-2}}$, a stretch, with radius of curvature $1.71 \times 10^{11}$ m. Along a horizontal direction,
$\curv R_{0x0x} = +G\matter M/c^2R_\oplus^3 = +1.71 \times 10^{-23}\unit{m^{-2}}$, a squeeze, with radius $2.41 \times
10^{11}$ m, larger by $\sqrt2$.
:::

**[7.2]** A mass lies at the distance $r$ in the direction $(\hat e_x + \hat e_y)/\sqrt2$ from the corner of a
gravitational compass with arms along $x$, $y$ and $z$. In units of $G\matter M/r^3$, what do the six distances read,
and how does $\curv\tE_{xy}$ follow from them?

::: solution
With $\curv\tE_{ij} = (G\matter M/r^3)(\delta_{ij} - 3\hat n_i\hat n_j)$ and $\hat n = (1, 1, 0)/\sqrt2$, the arms read
$\curv\tE_{xx} = \curv\tE_{yy} = -\tfrac12$ and $\curv\tE_{zz} = 1$. The pair along $(\hat e_x - \hat e_y)/\sqrt2$,
across the line to the mass, reads $1$, a squeeze; the pairs along $(\hat e_x - \hat e_z)/\sqrt2$ and $(\hat e_y -
\hat e_z)/\sqrt2$ read $\tfrac14$ each. Then $\curv\tE_{xy} = \tfrac12(-\tfrac12 - \tfrac12) - 1 = -\tfrac32$, and
$\curv\tE_{xz} = \curv\tE_{yz} = \tfrac14 - \tfrac14 = 0$.
:::

### Stretch

**[7.2]** From [](#eq:linearized), show that for a static field $c^2\curv R_{0i0i} = -\tfrac12c^2\nabla^2\field
h_{00}$ (summed over $i$), so that it vanishes wherever $\nabla^2\field\Phi = 0$. Which of section 1.5's counts does
this give for the tide in empty space?

::: solution
With $\alpha = \gamma = 0$ and $\beta = \delta = i$, the time derivatives vanish and $\curv R_{0i0i} =
-\tfrac12\partial_i\partial_i\field h_{00} = -\tfrac12\nabla^2\field h_{00}$. With $\field h_{00} = -2\field\Phi/c^2$,
$c^2\curv R_{0i0i} = \nabla^2\field\Phi$, which is $4\pi G\matter\rho$ by Poisson's equation and zero in empty space. So
the trace of $\curv\tE$ vanishes there, and the tide is a symmetric table with no trace: 1.5's five numbers. Section
[7.3](/tutorial/geometry/einstein-equation/#in-empty-space-only-the-weyl-curvature-is-left-and-it-holds-ten-numbers)
shows that the trace vanishes outside matter in Einstein's theory too.
:::

**[7.2]** A pair of free balls moves at $\vect w = w\hat e_x$ through a gravitational wave travelling along $z$, whose
magnetic part is that of section
[7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45),
$\curv\tB_{11} = -\curv\tE_\times$, $\curv\tB_{12} = \curv\tE_+$, $\curv\tB_{22} = \curv\tE_\times$. Use
[](#eq:moving-tide) to find $\curv\tE' - \curv\tE$, and show that it is the change that turning the wave's direction of
travel by the small angle $w/c$ about $y$ would make, the aberration of section 6.3.

::: solution
Only $\epsilon_{ikm}$ with $k = 1$ enters: $\epsilon_{213} = -1$ and $\epsilon_{312} = 1$. The first term of the
bracket, $\epsilon_{i1m}\curv\tB_{mj}$, is $-\curv\tB_{3j} = 0$ for $i = 2$ and $\curv\tB_{2j}$ for $i = 3$, so it is
$(\curv\tE_+, \curv\tE_\times, 0)$ in the third row; the second term is its transpose. So $\curv\tE'_{xz} =
(w/c)\curv\tE_+$ and $\curv\tE'_{yz} = (w/c)\curv\tE_\times$, and nothing else changes. Turning the tide's plane by a
small angle $\theta$ about $y$ moves the $x$ row into $z$: $\delta\curv\tE_{zx} = \theta\curv\tE_{xx} =
\theta\curv\tE_+$ and $\delta\curv\tE_{zy} = \theta\curv\tE_{xy} = \theta\curv\tE_\times$, the same with $\theta =
w/c$.
:::

### The camera

**[7.2]** Derive $\curv\tE_{ij} = c^2\curv R_{0i0j}$ and $\ddot\xi^i = -\curv\tE_{ij}\xi^j$ from the geodesic deviation
equation for an observer at rest, then $\curv\tE_{ij} = \partial_i\partial_j\field\Phi$ from the linearized curvature.
Check that the sign convention makes a stretch a negative entry of $\curv\tE$.

::: solution
In the falling frame of a ball motionless beside the observer at rest, $\obs u^\mu = (c, 0, 0, 0)$, and
[](#eq:geodesic-deviation) gives $\ddot\xi^i = -c^2\curv R^i{}_{0j0}\xi^j$. A spatial index is raised with $+1$, and the
two antisymmetries give $\curv R_{i0j0} = \curv R_{0i0j}$, so $\ddot\xi^i = -\curv\tE_{ij}\xi^j$ with $\curv\tE_{ij} =
c^2\curv R_{0i0j}$. In a static weak field [](#eq:linearized) gives $\curv R_{0i0j} =
-\tfrac12\partial_i\partial_j\field h_{00} = \partial_i\partial_j\field\Phi/c^2$, so $\curv\tE_{ij} =
\partial_i\partial_j\field\Phi$. For a point mass the entry along the line is $-2G\matter M/r^3 < 0$, and $\ddot\xi^r =
+(2G\matter M/r^3)\xi^r$: the balls along the line move apart, so the negative entry is a stretch.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) defines the tide as $c^2R_{0i0j}$, with the sign convention of
  [](#the-riemann-tensor-is-built-from-the-christoffel-symbols-yet-it-is-a-tensor); the paper's [](/paper/#eq:tidal)
  and [](/paper/#eq:deviation) are geodesic deviation for an observer at rest.
- The paper's [](/paper/#eq:newton), the tide near slow matter, is the linearized curvature with only $\field h_{00}$
  ([](#near-slow-matter-the-curvature-is-newtons-tide)); the paper's Figures [](/paper/#fig:tidal) and
  [](/paper/#fig:tidal-field) draw it.
- The paper's [](/paper/#eq:magnetic) packs the eight numbers with one time index; Section II's "ten numbers" are the
  count of [](#the-pixel-reads-six-of-the-twenty-numbers-and-the-magnetic-part-eight-more).
- In [Section VIII](/paper/#sec:one-pixel), the paper's [](/paper/#eq:bianchi-wave) follows from the second Bianchi
  identity "with no field equations assumed" (section 9.7).
:::

::: deeper
- The GR course derives geodesic deviation with every term kept in
  [section 10.3](https://neovand.github.io/general-relativity/chapter-10.html#10-3-deriving-geodesic-deviation-with-every-cancellation-visible),
  carries arrows round loops in
  [section 8.3](https://neovand.github.io/general-relativity/chapter-8.html#8-3-holonomy-geometry-remembers-your-route),
  and counts the twenty in [section 8.5](https://neovand.github.io/general-relativity/chapter-8.html#8-5-symmetries-that-turn-256-entries-into-20).
- Misner, Thorne and Wheeler, *Gravitation*, chapter 11, derive geodesic deviation in this convention.
:::

[^pa]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, as its equations [](/paper/#eq:tidal) and
    [](/paper/#eq:deviation), with the ring of its [](/paper/#fig:tidal).

[^newton]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, as its equation [](/paper/#eq:newton).

[^magnetic]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, as its equation
    [](/paper/#eq:magnetic).

[^bianchi]: The derivatives of the Riemann tensor obey a second rule, which relates them at neighbouring places. In a
    local inertial frame it reads $\partial_\sigma\curv R_{\alpha\beta\gamma\delta} + \partial_\gamma\curv
    R_{\alpha\beta\delta\sigma} + \partial_\delta\curv R_{\alpha\beta\sigma\gamma} = 0$, and it is called the **second
    Bianchi identity**. We state it without proof; for the linearized curvature it follows from [](#eq:linearized)
    because partial derivatives commute. Section
    [7.3](/tutorial/geometry/einstein-equation/#einsteins-equation-ties-the-curvature-to-the-energy-and-stress-at-each-point)
    uses it to build Einstein's equation, and section 9.7 uses it for the wave equation of the field of a single
    pixel ([](/paper/#eq:bianchi-wave)).

[^conventions]: With the opposite sign of the Riemann tensor, which some books use, the same stretch would be a positive
    $\curv R_{0x0x}$. With the signature $+{-}{-}{-}$, lowering a spatial index changes its sign, and the tide would be
    $-c^2\curv R_{0i0j}$.
