---
id: '2.8'
title: 'Flows of mass: continuity, currents, toroidal and poloidal flows'
question: 'Rolls of convection can churn inside a star or a planet''s core without making any magnetic part of the tide outside it, however fast they run, while a swirl about the axis always shows. Why?'
part: '2'
requires: ['1.1', '1.3', '1.5', '1.6', '2.1', '2.2', '2.4', '2.5']
paper: [sec:near-field, eq:magnetic-point, eq:current-column, fig:silent-flows, tab:null, sec:second-order, eq:flow-bracket, eq:hidden-spin, fig:hidden-flow]
figures: [fig:silent-flows]
live: [hidden-flow]
depth: A
---

Inside a star, hot gas rises through the middle of a cell, spreads out at the top, cools and sinks again at the sides.
These turning loops of moving matter are called **convection rolls**, and they also churn in the liquid iron of a
planet's core. The magnetic part of the tide, $\curv{\tB}_{ij}$, is the second table of tides, in
$\mathrm{s^{-2}}$, that moving masses make: it describes how gyroscopes at nearby points turn relative to one another
(chapter 1.5's [ten numbers](/tutorial/newton/five-numbers/#a-pixel-that-also-reads-the-twist-records-ten-numbers)).
The paper's [Section IV](/paper/#sec:near-field) says that "Every confined flow that is the same all round an axis and
turns in its meridian planes … is silent outside, however fast it runs", while a swirl about the axis always shows.
Figure [](/paper/#fig:silent-flows) shows the two kinds of flow inside a ball, each with the field it makes outside.

{{paper fig:silent-flows}}

Its shading spans four decades, down to $10^{-4}$ of the swirl's largest value, and the rolls stay below the
lightest shade. So we ask why rolls can run unseen while a swirl always shows. The answer finds a second null space,
the twin of chapter 2.5's for the density.

::: plain
Moving matter carries mass. At each point we can say how much mass crosses a square metre each
second, and in which direction. Mass is never made or destroyed, so the mass in a small box changes only by what flows
across its walls.

A flow has a potential of its own, built from moving mass as the gravitational potential is built from mass at rest. The
magnetic part of the tide outside a body comes from how this potential turns from point to point. If the potential
outside does not turn at all, the body makes no magnetic part there.

Inside a body that is the same all round an axis, a steady flow has two kinds of part. A swirl carries matter round the
axis. Rolls carry it up, across, down and back in the planes that contain the axis. The rolls leave the potential
outside with no turning at all, so they are invisible from outside however fast they run. The swirl carries angular
momentum, and that shows. Even a swirl can hide: a ball turning one way inside a shell turning the other way shows
nothing outside when their amounts of turning are equal.
:::

## A flow of mass is a mass flux, and mass is conserved

We describe moving matter by its **velocity field** $\sym{flow-velocity}{\vect v}(\vect x)$: the velocity of the
matter at each point $\vect x$, in metres per second. The density $\matter\rho$ and the velocity together, at every
point, make up the **flow** of a body.

We want one quantity that says how much mass moves past a point, and in which direction. It is the **mass flux**

$$\sym{mass-flux}{\matter{\vect J}} = \matter\rho\,\vect v ,$$

in kilograms per square metre per second. To see why, take a small flat patch at right angles to $\vect v$. In a time
$\Delta t$ the matter that crosses one square metre of it fills a slab of thickness $v\,\Delta t$, which holds the
mass $\matter\rho\,v\,\Delta t$. So $|\matter{\vect J}|$ is the mass that crosses a unit area per second. Through a
tilted patch only the part of $\matter{\vect J}$ at right angles to it counts, as in chapter 1.3's
[flux](/tutorial/newton/gauss-and-poisson/#flux-counts-how-much-field-crosses-a-surface). Each cubic metre holds the mass $\matter\rho$ moving at $\vect v$, so the
same quantity is also the momentum per unit volume, which the paper calls the density of momentum in Section XIII.[^J]

Rock of $2700\unit{kg\,m^{-3}}$ carried round at the equator's $465\unit{m\,s^{-1}}$ (chapter 1.1) has
$|\matter{\vect J}| = 1.26\times10^6\unit{kg\,m^{-2}\,s^{-1}}$: through each square metre that faces east, 1260 tonnes
of rock pass every second as the Earth turns. A velocity alone is not a flux: air of $1.2\unit{kg\,m^{-3}}$ moving at
the same speed carries 2250 times less mass.

We want a law, at each point, that says mass is neither made nor destroyed. We assume that **mass is conserved**: the
mass inside any region changes only by what crosses its surface. Take chapter 1.3's
[small box](/tutorial/newton/gauss-and-poisson/#divergence-is-the-outflow-per-unit-volume) of volume $\Delta V$. The
mass inside it is $\matter\rho\,\Delta V$, which changes by $(\partial\matter\rho/\partial t)\,\Delta V$ per second.
Chapter 1.3 found that the flux out of the six faces of a small box is the divergence times its volume, so the mass
leaving per second is $\nabla\cdot\matter{\vect J}\,\Delta V$. What the box gains is what it does not lose
(Figure [](#fig:flow-box)):

$$\frac{\partial\matter\rho}{\partial t}\,\Delta V = -\nabla\cdot\matter{\vect J}\,\Delta V .$$

Dividing by $\Delta V$ gives

$$\boxed{\;\frac{\partial\matter\rho}{\partial t} + \nabla\cdot\matter{\vect J} = 0 ,\;}$$

the **continuity equation**. Both terms are in $\mathrm{kg\,m^{-3}\,s^{-1}}$.

**A check.** A ball of uniform density swells evenly with $\vect v = H\vect x$, where $H$ is the rate of swelling in
$\mathrm{s^{-1}}$. Then $\nabla\cdot\matter{\vect J} = \matter\rho H\,\partial_ix_i = 3H\matter\rho$, so
$\partial\matter\rho/\partial t = -3H\matter\rho$. The whole ball gives the same: its radius grows at the rate $H$, so
its volume grows at the rate $3H$, and at a fixed mass its density falls at the rate $3H$.

A flow is **steady** when the density at every point stays the same, $\partial\matter\rho/\partial t = 0$, so that
$\nabla\cdot\matter{\vect J} = 0$: as much mass leaves each small box as enters it. Water, whose density does not
change, flowing steadily at $2\unit{m\,s^{-1}}$ through a pipe that narrows to half its area speeds up to
$4\unit{m\,s^{-1}}$, because every cross-section carries the same mass per second. A flow is **confined** to a body when
$\matter{\vect J}$ is zero outside it and no mass crosses its surface. The swelling ball is not confined: its flow
crosses every sphere about its centre outward.

**An example.** A body whose density depends only on the distance $r$ from its centre turns rigidly, with
$\vect v = \vect\Omega\times\vect x$ (chapter 1.1). In
$\nabla\cdot(\matter\rho\vect v) = \vect v\cdot\nabla\matter\rho + \matter\rho\,\nabla\cdot\vect v$ the first term
vanishes, because $\nabla\matter\rho$ points along $\vect x$ and $\vect v$ is perpendicular to it, and the second
because $\partial_i(\epsilon_{ijk}\Omega_jx_k) = \epsilon_{ijk}\Omega_j\delta_{ik} = \epsilon_{iji}\Omega_j =
0$. So a turning round body is a steady, confined flow: all of it moves, and its density at each point never changes.

![Chapter 1.3's small box with mass flowing through it. The mass flux $\matter J_x(x)$ enters through the blue face at
$x$, and the larger $\matter J_x(x + \Delta x)$ leaves through the orange face at $x + \Delta x$, so more mass leaves
than enters. Beneath, the same box at the times $t$ and $t + \Delta t$: the density inside falls,
$\partial\matter\rho/\partial t < 0$; the arrows' lengths and the shades are chosen for the
drawing.](tut-flow-box){#fig:flow-box}

## A flow has a potential of its own, built like the gravitational one

Chapter 2.4 built the
[potential of a body](/tutorial/outside/greens-functions/#the-potential-of-one-point-builds-every-potential) by adding
the potentials of its pieces, $\field\Phi(\vect x) = -G\int\matter\rho(\vect y)/|\vect x - \vect y|\,\dd^3y$, and
showed that $\nabla^2\field\Phi = 4\pi G\matter\rho$. Here $\vect y$ runs over the sources and $\vect x$ is the point
where we want the potential. We do the same with each of the three components of the mass flux. The **potential of
the flow** is

$$\sym{flow-potential}{\field{\vect A}}(\vect x) = \int\frac{\matter{\vect J}(\vect y)}{|\vect x - \vect y|}\,\dd^3y ,$$

three integrals of chapter 2.4's kind, one for each component.[^A] Its unit is that of $\matter{\vect J}$ times a
square metre, $\mathrm{kg\,s^{-1}}$. Chapter 2.4's result, applied to one component at a time, gives

$$\boxed{\;\nabla^2\field{\vect A} = -4\pi\,\matter{\vect J} .\;}$$

The **curl** of a vector field $\vect F$ is the vector

$$(\nabla\times\vect F)_i = \epsilon_{ijk}\,\partial_jF_k ,$$

chapter 1.1's [cross product](/tutorial/newton/vectors-and-indices/#the-cross-product-is-written-with-the-levi-civita-symbol)
with the derivative $\partial_j$ in the place of the first vector. It measures how the field turns round each point.
For the rigid turning, $\partial_jx_m = \delta_{jm}$ and chapter 1.1's
[identity](/tutorial/newton/vectors-and-indices/#two-levi-civita-symbols-make-two-kronecker-deltas) give
$\nabla\times(\vect\Omega\times\vect x) = 3\vect\Omega - \vect\Omega = 2\vect\Omega$, twice the angular velocity.
The antisymmetry of $\epsilon$ makes two combinations
vanish.

- **A gradient has no curl**: $\epsilon_{ijk}\partial_j\partial_kf = 0$. Renaming $j$ as $k$ and $k$ as $j$ changes the
  sign of $\epsilon$ and leaves $\partial_j\partial_k$ as it was, so the sum equals minus itself.
- **A curl has no divergence**: $\partial_i\epsilon_{ijk}\partial_jF_k = 0$, for the same reason.

The same identity gives the curl of a curl, after a cyclic move puts the shared index first:
$\epsilon_{ijk}\partial_j\epsilon_{klm}\partial_lV_m = (\delta_{il}\delta_{jm} -
\delta_{im}\delta_{jl})\partial_j\partial_lV_m$, so

$$\boxed{\;\nabla\times(\nabla\times\vect V) = \nabla(\nabla\cdot\vect V) - \nabla^2\vect V .\;}$$

This is chapter 1.1's rule for $\vect a\times(\vect b\times\vect c)$, with the derivatives kept in front.

The paper uses this potential: "Outside a body, $\tB$ comes from the potential
$\int\rho\mathbf v\,\dd V'/|\mathbf x - \mathbf x'|$ of its steady flow of mass", where the paper writes $\mathbf x'$
for our $\vect y$. We state the rule from chapter 7.5, which derives it. Outside a body, for a steady flow and to
first order in $v/c$, where $c$ is the speed of light,

$$\curv{\tB}_{ij} = \frac{G}{c}\,(\partial_ib_j + \partial_jb_i), \qquad \vect b = \nabla\times\field{\vect A} ,$$

with $\vect b$ in $\mathrm{kg\,m^{-1}\,s^{-1}}$. The units agree: $G/c$, in $\mathrm{m^2\,kg^{-1}\,s^{-1}}$, times
$\mathrm{kg\,s^{-1}}$ divided by a square metre for the two derivatives, is $\mathrm{s^{-2}}$, the unit of a tide. We
rely on nothing else from chapter 7.5.

One mass $\matter M$ at the origin, moving with velocity $\vect v$, has at the point $\vect x$ the potential
$\field{\vect A} = \matter M\vect v/r$, which points along the velocity and falls as the inverse distance. So $\vect b =
\nabla(1/r)\times\matter M\vect v = -\matter M\,\vect x\times\vect v/r^3$. Its derivative $\partial_ib_j$ has a part
that is antisymmetric in $i$ and $j$, which cancels in the sum, and the part $3\matter M\,x_i(\vect x\times\vect
v)_j/r^5$. With $\hat n = -\vect x/r$, the unit vector from the point toward the mass, the rule gives the paper's
equation for one moving mass:

{{paper eq:magnetic-point}}

So if $\field{\vect A}$ is a gradient everywhere outside a body, its curl $\vect b$ vanishes there, and the body makes
no magnetic part outside. The proof that rolls are silent will show exactly that.

## The current column is the flow along a line of sight, weighted by inverse distance

Chapter 1.5 grouped the matter round a pixel by direction and found the
[tidal column](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes)
$S(\hat n) = \int\matter\rho\,\dd r/r$. We group moving matter in the same way. The pixel is at the origin, $\hat n$ is
a unit vector toward the matter, and $r$ is the distance along $\hat n$. The matter in a small patch of sky of solid
angle $\dd\Omega$ (chapter 2.2), between the distances $r$ and $r + \dd r$, has the mass
$\matter\rho\,r^2\,\dd r\,\dd\Omega$. Its magnetic part falls as $1/r^3$, so it enters with the weight
$r^2\,\dd r/r^3 = \dd r/r$. Adding up all the pieces gives the paper's equation:

{{paper eq:current-column}}

Here $\dd\Omega$ is a solid angle, not a rate of turning. The **current column**
$\sym{current-column}{\vect J(\hat n)}$ is the mass flux along the line of sight, each part weighted by the inverse of
its distance. Its unit is that of the mass flux, because $\dd r/r$ has none. We set it plain and always write its
direction, so that it is not mistaken for the mass flux at a point. The column enters only through
$\hat n\times\vect J$, so motion toward or away from the camera adds nothing to $\curv{\tB}$. A Doppler radar sees
only that motion, so the paper calls the magnetic channel "the opposite of a Doppler radar".

We want the column of a turning ball. We assume a **ball of uniform density $\matter\rho$, turning rigidly with angular
velocity $\vect\Omega$ about its centre $\vect s$**, which is measured from the pixel. The pixel is outside the ball,
and a line of sight that meets it enters at the distance $a$ and leaves at $b$. At the point $r\hat n$ the velocity is
$\vect\Omega\times(r\hat n - \vect s)$, chapter 1.1's rule with the centre moved to $\vect s$. Only the stretch from $a$
to $b$ contributes (Figure [](#fig:flow-column)):

$$\vect J(\hat n) = \matter\rho\int_a^b\vect\Omega\times(r\hat n - \vect s)\,\frac{\dd r}{r} .$$

The vectors $\vect\Omega\times\hat n$ and $\vect\Omega\times\vect s$ do not change along the line, so the integral
splits into $\int_a^b\dd r = b - a$ and $\int_a^b\dd r/r = \ln(b/a)$:

$$\boxed{\;\vect J(\hat n) = \matter\rho\bigl[(\vect\Omega\times\hat n)(b - a) - (\vect\Omega\times\vect s)\ln(b/a)\bigr] ,\;}$$

the paper's formula.

**A number.** A steel ball of radius 10 cm and density $7850\unit{kg\,m^{-3}}$ has its centre 1 m from the pixel and
turns ten times a second, $\Omega = 62.8\unit{s^{-1}}$, about the line from the pixel to its centre. Then
$\vect\Omega\times\vect s = 0$. A line of sight that passes 5 cm from the centre enters at $a = 0.912\unit{m}$ and
leaves at $b = 1.085\unit{m}$. The steel on it moves sideways at about $\Omega \times 5\unit{cm} = 3.1\unit{m\,s^{-1}}$,
and the column is $4270\unit{kg\,m^{-2}\,s^{-1}}$, along that motion.[^quad] On every line of sight the column points
round the line to the centre, so on the sky it makes a vortex that circulates in the sense of the ball's turning.
Because the ball spins about that line, the vortex is the same at every instant, and so is the density, which is why
the ball pulls the same spinning or still. The paper says this of a smooth flywheel: its pull hides the turning, and
its current column shows it.

**A limit.** For a thin piece of matter, $b$ close to $a$, $\ln(b/a) \approx (b - a)/a$, and the column becomes
$\matter\rho(b - a)\,\vect\Omega\times(a\hat n - \vect s)/a$: the mass flux where the line crosses, times the thickness,
divided by the distance, as the weight $\dd r/r$ says.

![A ball turning about an axis at right angles to the page, cut through the plane that holds the pixel, the ball's
centre and one line of sight, which enters the ball at the distance $a$ from the pixel and leaves at $b$. At five
points of the chord the velocity is split into its part along the line (faint), which adds nothing to $\curv{\tB}$, and
its part across the line (bold), which counts. The part along the line is the same at every point, and the part across
vanishes at the point nearest the centre; the sizes and the arrows' scale are chosen for the
drawing.](tut-flow-column){#fig:flow-column}

<!-- try: current-column — A disc of uniform density turning about a point the reader drags, seen from a camera at the
left. A fan of lines of sight, each with its current column drawn as an arrow at the camera's sky (only the part across
the line), and the boxed formula as a readout (a, b, the two terms) for the line under the pointer. Predict: "Turn the
disc about its own centre. Does the column change when the disc is moved along the line of sight?" (Only the ln(b/a)
term changes.) Keyboard and both themes. Optional. -->

## Every steady flow round an axis is a swirl plus rolls

We now sort the steady flows of a body that is the same all round an axis, which we take as the $z$ axis. Such a flow
is **axially symmetric**: turning the body and its flow about the axis by any angle changes nothing. A **meridian
plane** is a plane that contains the axis, as the meridians of a globe do. At each point, $\matter{\vect J}$ splits into
a part round the axis, along the unit vector $\vect e_\varphi$ that points round it, and a part that lies in the
meridian plane through the point.

The part round the axis is the **toroidal flow**, or **swirl**: each bit of matter in it goes round a circle about the
axis, as in a rigid turning or a star whose equator turns faster than its poles. The part in the meridian planes is
the **poloidal flow**. The swirl has no divergence, because it carries matter along circles on which nothing changes.
A steady flow has none, so the poloidal part has none either.

A flow in a plane with no divergence is described by one function. Take a point $\vect x$ in a meridian plane and the
circle about the axis through $\vect x$. Let $2\pi\sym{stream-function}{\chi}(\vect x)$ be the mass per second that
crosses the flat disc spanned by this circle, counted positive when it crosses upward, along $+z$. Any other surface
bounded by the same circle, such as a dome over it, carries the same mass per second, because in a steady flow the
region between the two surfaces has no net outflow (chapter 1.3's divergence theorem). The function $\chi$ is the
**stream function** of the flow, in kilograms per second.[^chi]

Now take two points $\vect x_1$ and $\vect x_2$ in one half of a meridian plane, and the straight segment between them.
Turned once round the axis, the segment sweeps out a band, a piece of a cone, from the circle through $\vect x_1$ to the
circle through $\vect x_2$. The disc of the first circle and the band together make a surface bounded by the second
circle, so the band carries the mass per second $2\pi[\chi(\vect x_2) - \chi(\vect x_1)]$. Drawn with the axis on the
left and $z$ upward, this mass is counted positive when it crosses the segment from right to left as we walk from
$\vect x_1$ to $\vect x_2$. If the two points lie on one contour of $\chi$, nothing crosses between them, so the flow
runs along the contours of $\chi$.

On the axis the circle shrinks to a point, so $\chi = 0$ there. On the surface of a confined flow the circle bounds a
cap of the surface, which no mass crosses, so $\chi = 0$ there too. A contour of $\chi$ at any other value therefore
never reaches the axis or the surface. A contour of a smooth function has no loose end, so inside the body it closes
on itself, and the matter runs round it. In each half of a meridian plane the poloidal flow is one or more **rolls**.
An example, in a ball of radius $R$, is

$$\chi = \frac{4K\varpi^2}{R^2}\Bigl(1 - \frac{r^2}{R^2}\Bigr) ,$$

where $\varpi = r\sin\vartheta$ is the distance from the axis, in metres, and $K$ is a constant in kilograms per second.
It vanishes on the axis and on the surface, and its contours make one roll in each half-plane
(Figure [](#fig:flow-stream) and the stretch problem below).

![A ball cut in half through its axis and seen a little from above. Left, rolls: the contours of the example $\chi$ at
0.35, 0.65 and 0.9 of its greatest value $K$, along which the matter rises near the axis and sinks near the surface;
the circle about the axis through the point $P$ bounds a disc, shaded in front of the section, and $2\pi\chi(P)$ is the
mass that crosses it each second. Right, a swirl: the matter comes out of the page on one side of the axis and goes
into it on the other; the place of $P$ and the view are chosen for the drawing.](tut-flow-stream){#fig:flow-stream}

The two parts can be written with two functions of position, $T$ and $P$, as[^TP]

$$\matter{\vect J} = \nabla\times(T\,\vect x) + \nabla\times\nabla\times(P\,\vect x) .$$

By the product rule the first term is $\nabla T\times\vect x + T\,\nabla\times\vect x$, and
$(\nabla\times\vect x)_i = \epsilon_{ijk}\delta_{jk} = 0$, so it is $\nabla T\times\vect x$. When $T$ is the same all
round the axis, $\nabla T$ has no part round the axis, so it lies in the meridian plane through the point. The vector
$\vect x$ from the centre lies in that plane too. The cross product of two vectors in a plane is perpendicular to the
plane, so $\nabla T\times\vect x$ points round the axis: it is the swirl. A uniform ball turning rigidly has
$T = \matter\rho\,\vect\Omega\cdot\vect x$, since then $\nabla T\times\vect x = \matter\rho\,\vect\Omega\times\vect x$.

The second term is the rolls, which the paper writes as $\nabla\times\nabla\times\vect V$, with
$\sym{roll-vector}{\vect V} = P\vect x$ in kilograms per second. In a body without a hole through it, every confined
poloidal flow can be written in this form with $\vect V$ zero outside the body. For a round body $P$ itself vanishes
outside. For any other shape this holds after a gradient is added to $\vect V$, as the box below explains.

::: gap
This section sketched the split for axially symmetric flows only. Every flow with no divergence, symmetric or not, can
be written as $\nabla\times(T\vect x) + \nabla\times\nabla\times(P\vect x)$, and the two functions are unique once their
averages over every sphere about the centre are removed; Backus's review (in *Go deeper*) proves it. The step from
$\chi$ to $P$ is one integration over the polar angle $\vartheta$, which we skip.

The next section needs $\vect V$ and its first derivatives to vanish outside the body. The choice $\vect V = P\vect x$
can miss this in two ways. Outside a body that is not round, $P$ need not be zero; there it depends on $r$ alone in
each piece of the outside, so $P\vect x$ is the gradient of a function of $r$. And when the rolls slide along the
surface, the first derivatives of $P\vect x$ do not vanish there. In both cases we add to $\vect V$ the gradient of a
suitable function. The flow does not change, because a gradient has no curl. The stretch problem's
$\vect V = f(r)\,\hat z$ is of this kind: it is $P\vect x$ with $P = 4Kz(1 - r^2/R^2)/R^2$, plus a gradient.
:::

## Rolls are silent outside, because their potential there is a gradient

We want to show that rolls make no magnetic part outside the body. We assume that **the flow is
$\matter{\vect J} = \nabla\times\nabla\times\vect V$**, and that **$\vect V$ and its first derivatives are continuous
everywhere and zero outside the body**. Nothing else about $\vect V$ is used, so it need not have the form $P\vect x$.
Each component of $\vect V$ is then confined in the sense of
[chapter 2.5](/tutorial/outside/null-space/#a-confined-laplacian-added-to-a-body-changes-nothing-outside). Such a flow is
steady, because a curl has no divergence.

The proof uses **integration by parts in a volume**. For two functions $f$ and $g$, the product rule gives
$\partial_j(fg) = (\partial_jf)\,g + f\,\partial_jg$. We integrate over a large ball that holds the body and apply the
divergence theorem to the vector field $fg$ along the $j$ axis: the left side becomes an integral over the ball's
surface. If $f$ is zero outside the body, that integral vanishes, and

$$\int f\,\partial_jg\,\dd^3y = -\int(\partial_jf)\,g\,\dd^3y .$$

One derivative moves from one function to the other, with a change of sign. Chapter 2.1's
[Green's identities](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other) make
the same move with a gradient.

Write $\vect U = \nabla\times\vect V$, so that $\matter{\vect J} = \nabla\times\vect U$. Like $\vect V$, it is zero
outside the body. One component of the potential is

$$\field A_i(\vect x) = \epsilon_{ijk}\int\frac{\partial^y_jU_k(\vect y)}{|\vect x - \vect y|}\,\dd^3y ,$$

where $\partial^y_j$ differentiates with respect to $y_j$. We integrate by parts, which moves the derivative onto the
inverse distance and brings the first minus sign:

$$\field A_i = -\epsilon_{ijk}\int U_k\,\partial^y_j\frac{1}{|\vect x - \vect y|}\,\dd^3y .$$

The inverse distance depends only on $\vect x - \vect y$, so its derivative with respect to $y_j$ is minus its
derivative with respect to $x_j$. This second minus sign cancels the first. A derivative in $\vect x$ can be taken
outside an integral over $\vect y$, so

$$\field A_i = \epsilon_{ijk}\,\partial^x_j\int\frac{U_k}{|\vect x - \vect y|}\,\dd^3y .$$

The potential is the curl of $\int\vect U/|\vect x - \vect y|\,\dd^3y$. The same two steps, with
$U_k = \epsilon_{klm}\partial^y_lV_m$, turn that integral into the curl of $\int\vect V/|\vect x - \vect y|\,\dd^3y$.
So

$$\field{\vect A} = \nabla\times\nabla\times\vect W, \qquad \sym{roll-potential}{\vect W}(\vect x) = \int\frac{\vect V(\vect y)}{|\vect x - \vect y|}\,\dd^3y ,$$

with $\vect W$ in $\mathrm{kg\,m^2\,s^{-1}}$. The curl of a curl gives

$$\field{\vect A} = \nabla(\nabla\cdot\vect W) - \nabla^2\vect W .$$

By chapter 2.4's result, used above for $\field{\vect A}$, $\nabla^2\vect W = -4\pi\vect V$, which is zero outside the
body. So outside it

$$\boxed{\;\field{\vect A} = \nabla(\nabla\cdot\vect W) ,\;}$$

a gradient. A gradient has no curl, so the magnetic part outside is zero, however fast the rolls run. The stream
function gives a shorter proof that holds for a body of any shape, even a ring.[^ring]

The potential itself is not zero outside; only its curl is. For the rolls of the stretch problem,
$\vect V = f(r)\,\hat z$, the potential outside is $\field{\vect A} = F\,\nabla\,\partial_z(1/r)$, with
$F = \int f\,\dd V$.[^num]

**Two scenes.** The first is a ball of uniform density at rest. The second is the same ball with rolls running inside
it. A uniform density with $\nabla\cdot\matter{\vect J} = 0$ has $\nabla\cdot\vect v = 0$, so the matter moves without
crowding: the density at every point is the same in both scenes at every instant, and so is $\curv{\tE}$ outside. The
magnetic part outside is zero in both. To first order in $v/c$, no reading of the near field outside can tell them
apart: it is the paper's "silent outside, however fast it runs".

A reading at two times breaks the tie. Apply a short tide shaped by a harmonic function $g$, read how fast the moment
$\int\matter\rho\,h\,\dd V$ of a second harmonic function $h$ changes, and repeat with $h$ and $g$ exchanged. The
part of the response that changes sign is the bracket of the paper's equation [](/paper/#eq:flow-bracket), an integral
of $\matter{\vect J}$ itself, so it sees flows that the field outside misses. Chapter 1.7's
[bracket of two moments](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside) and its stretch problem
lead to it, and chapter 13.4 shows that it reads every silent flow. A pixel inside the matter breaks the tie too. Inside
matter $\curv{\tB}$ also has an antisymmetric part, a
[vector in disguise](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise) (chapter
1.1), and that vector is $-(4\pi G/c)\,\matter\rho\vect v$, which lies along the flow (chapter 1.1's paper problem).

## A swirl shows through its angular momentum, and two swirls can cancel

We want the potential outside a round body whose swirl is a rigid turning of each spherical layer. We assume that
**the density depends only on $r$**, and first take **one thin layer at the radius $r'$, turning rigidly at
$\vect\Omega$**. Its mass flux is $\matter\rho\,\vect\Omega\times\vect y$, so

$$\field{\vect A}(\vect x) = \vect\Omega\times\int\frac{\matter\rho\,\vect y}{|\vect x - \vect y|}\,\dd^3y .$$

Outside the layer, $r' < r$, and chapter 2.2's [generating
function](/tutorial/outside/spherical-harmonics/#the-patterns-symmetric-about-an-axis-are-the-legendre-polynomials-and-the-inverse-distance-generates-them)
writes $1/|\vect x - \vect y| = \sum_\ell r'^\ell P_\ell(\cos\gamma)/r^{\ell+1}$, with $\gamma$ the angle between $\vect
x$ and $\vect y$. The components of $\hat y$ are patterns of degree one, so over the directions of $\vect y$ every term
but $\ell = 1$ integrates to zero, by chapter 2.2's orthogonality. The term $\ell = 1$ is $r'\,\hat x\cdot\hat y/r^2$.
We write $\vect y = r'\hat y$ and $\dd^3y = r'^2\,\dd r'\,\dd\Omega_y$, where $\dd\Omega_y$ is the solid angle of a
small patch of directions $\hat y$, and use chapter 1.5's sky average, $\oint\hat y\,(\hat y\cdot\hat x)\,\dd\Omega_y =
\tfrac{4\pi}{3}\hat x$:

$$\begin{aligned}\int\frac{\matter\rho\,\vect y}{|\vect x - \vect y|}\,\dd^3y &= \frac{1}{r^2}\int\matter\rho\,r'^4\,\dd r'\oint\hat y\,(\hat y\cdot\hat x)\,\dd\Omega_y\\ &= \frac{\vect x}{3r^3}\int\matter\rho\,r'^2\,\dd V ,\end{aligned}$$

because $4\pi r'^2\,\dd r'$ is the volume of the layer. Chapter 1.6's
[moment of inertia](/tutorial/newton/motion/#a-round-body-has-the-same-moment-about-every-axis)
of a round body is $I = \tfrac23\int\matter\rho\,r^2\,\dd V$, and its angular momentum,
$\int\vect x\times\matter{\vect J}\,\dd V$, is $\vect L = I\vect\Omega$, so the layer gives

$$\boxed{\;\field{\vect A} = \frac{\vect L\times\vect x}{2r^3}\;}$$

everywhere outside it. Layers add, so outside a round body whose layers turn rigidly, each at its own rate,
$\field{\vect A}$ is this with the total angular momentum. Its curl,
$[3\vect x(\vect L\cdot\vect x) - \vect Lr^2]/2r^5$, is not zero: it is the pattern of a **spin dipole**,
and the paper's formula for $\curv{\tB}$ outside a spinning round body (in *The magnetic picture*) is built from it in
chapter 7.5. **A check** of units: $\mathrm{kg\,m^2\,s^{-1}}$ times a metre over $\mathrm{m^3}$ is
$\mathrm{kg\,s^{-1}}$, the unit of $\field{\vect A}$. The rolls of the last section pass another check: a flow that
showed outside through a spin dipole would need angular momentum, and they have none.[^L]

So a swirl of rigidly turning layers shows, and only through its angular momentum. A swirl whose rate changes with
latitude shows through further **moments** of the flow, integrals over the body of the mass flux times a fixed
function of position, of which the angular momentum is one. In the paper's words it shows "only through its harmonic
part, of which the spin dipole is the first term": the part that the outside can see, like chapter 2.5's
[harmonic part](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see)
of a density.

The Earth's angular momentum is $0.3307\,\matter MR^2\Omega = 5.8\times10^{33}\unit{kg\,m^2\,s^{-1}}$ (chapter 1.6),
17 per cent less than a uniform Earth would carry at the same rate. A ball and a thin shell of equal mass and size,
turning at the same rate, pull alike outside, but their angular momenta, and so their magnetic parts outside, differ
by the ratio of their moments of inertia, $\tfrac23\matter MR^2$ against $\tfrac25\matter MR^2$, a factor $\tfrac53$.
At equal angular momentum they are identical outside: motion too can hide.

**The hidden swirl.** A uniform ball of radius $a$ turns at $\vect\Omega$ inside a shell of the same density that fills
the sphere out to $R$ and turns at $-\vect\Omega$. By chapter 1.6, a uniform ball of radius $a$ has the moment
$\tfrac25\matter Ma^2 = \tfrac{8\pi}{15}\matter\rho a^5$, so the shell has $\tfrac{8\pi}{15}\matter\rho(R^5 - a^5)$, and

$$\vect L = \tfrac{8\pi}{15}\matter\rho\,\vect\Omega\bigl[a^5 - (R^5 - a^5)\bigr] .$$

It vanishes when $a^5 = R^5/2$:

$$\boxed{\;a = 2^{-1/5}R = 0.871\,R .\;}$$

The inner ball holds $2^{-3/5} = 66$ per cent of the mass, and the outer third, lying farther from the axis, carries as
much angular momentum (Figure [](#fig:flow-hidden)). Outside, $\field{\vect A} = 0$ and there is no magnetic part at
all, "though all of it moves", in the paper's words. The paper's Section XIII reads this flow with two octupolar tides,
the next finer pattern after the simple stretch and squeeze. Their bracket has the size $0.221\,\matter M\Omega R^4$, in
$\mathrm{kg\,m^4\,s^{-1}}$ (the paper's equation [](/paper/#eq:hidden-spin), chapter 13.4), while two quadrupolar tides
give zero, because their bracket is proportional to $\vect L$.


::: try {#hidden-flow}
Predict first: the bracket of the two octupolar tides vanishes at one radius of the inner ball. Is that radius smaller
or larger than $0.871R$, where the angular momentum vanishes? The figure opens at $0.871R$, with the inner ball
(orange) turning one way and the rest of the sphere (blue) the other. Drag the slider, or use the arrow keys, and watch
the two sums. The sum of degree two, the quadrupolar bracket, always reads $-2$ times the angular momentum
below it, so the two vanish together. Find where the sum of degree three reads zero, and see in the shaded shares how
much more the outer layers count there.
:::

![The hidden swirl in section through its equator, seen along the axis. The inner ball, out to $0.871R$, turns one way
(orange) and the shell out to $R$ turns the other way (blue) at the same rate; each arrow is the path of a part in one
interval of time. The bars are the two angular momenta, equal and opposite, although the inner ball holds 66 per cent
of the mass and the shell 34 per cent.](tut-flow-hidden){#fig:flow-hidden}

## The density and the flow each have a null space

Chapter 2.5 found the [null space](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see)
of the steady pull: densities $\nabla^2\field\psi/4\pi G$ with $\field\psi$ confined. The magnetic part has a null
space of the same build, the flows $\nabla\times\nabla\times\vect V$ with $\vect V$ confined, together with the
swirls whose moments vanish. In both, a confined quantity is differentiated twice. The paper's Table
[](/paper/#tab:null) lists the two.

| Channel | What the outside fixes | What it cannot see | What reveals it |
|---|---|---|---|
| Electric part, $\curv{\tE}$ | the harmonic part of $\matter\rho$ (2.5) | $\nabla^2\field\psi/4\pi G$: a cored Earth against a uniform one, a nugget against its flush | spin, a kick, heat, a pixel inside |
| Magnetic part, $\curv{\tB}$ | the swirl, through $\vect L$ and moments like it | rolls $\nabla\times\nabla\times\vect V$; swirls whose moments all vanish, such as the hidden swirl | two tides in either order, a pixel inside |

Both blind spots belong to a reading at one time. Readings at two times, the responses to tides applied in turn,
break both (the paper's Section XIII, chapters 13.2 and 13.4).

::: check
### Q

Air of $1.2\unit{kg\,m^{-3}}$ blows at $10\unit{m\,s^{-1}}$ through an open door of $2\unit{m^2}$. What is the mass
flux, and how much air passes through the door each second?

### A

The mass flux is $1.2 \times 10 = 12\unit{kg\,m^{-2}\,s^{-1}}$, and through $2\unit{m^2}$ that is
$24\unit{kg}$ of air each second.

### Q

Why does a steady flow have $\nabla\cdot\matter{\vect J} = 0$?

### A

In a steady flow the density at each point does not change, so by the continuity equation as much mass leaves each
small box as enters it.

### Q

Why are meridional rolls silent outside, while a swirl is not?

### A

The rolls are $\nabla\times\nabla\times\vect V$ with $\vect V$ confined, so their potential outside is a gradient,
which has no curl. A swirl carries angular momentum, and its potential outside is $\vect L\times\vect x/2r^3$,
whose curl is a spin dipole.

### Q

Why is the magnetic channel "the opposite of a Doppler radar"?

### A

The current column enters the magnetic part only through $\hat n\times\vect J$, so only motion across the line
of sight counts. A radar sees only motion along it.
:::

**The idea to keep: moving mass is a flux, $\matter\rho\vect v$, with a potential built like the gravitational one.
Rolls that turn in the meridian planes of a body leave that potential a gradient outside, so they are silent however
fast they run; a swirl shows through its angular momentum, and two swirls with opposite angular momenta hide each
other.**

::: problems
### Practice

A uniform ball of radius $a$ turns at $\vect\Omega$ inside a shell of the same density, out to $R$, that turns at
$-2\vect\Omega$. For which $a$ is the angular momentum zero, and what share of the mass then turns with the inner
ball?

::: solution
With chapter 1.6's moments, $\vect L \propto a^5 - 2(R^5 - a^5)$, which vanishes when $3a^5 = 2R^5$, so
$a = (2/3)^{1/5}R = 0.922\,R$. The inner ball holds $(a/R)^3 = (2/3)^{3/5} = 78$ per cent of the mass. A faster shell
needs less mass far out to balance the inner ball.
:::

### Stretch

Take $\vect V = f(r)\,\hat z$ with $f = K(1 - r^2/R^2)^2$ inside a ball of radius $R$ and $f = 0$ outside. (This $\vect
V$ is not of the form $P\vect x$, but the proof of the silent flows needs only a confined $\vect V$.) Show that outside
the ball $\vect W = \hat z\,F/r$ with $F = \int f\,\dd V$, so that $\field{\vect A} = F\,\nabla\,\partial_z(1/r)$ there.
Then show that the flow inside is $\matter{\vect J} = (K/R^2)\bigl[8z\vect x/R^2 + (8 - 16r^2/R^2)\,\hat z\bigr]$, that
no mass crosses the surface, and that it makes one roll in each half of a meridian plane.

::: solution
Outside the ball, $\int f(r')/|\vect x - \vect y|\,\dd^3y$ is the potential of a round body of "density" $f$, divided by
$-G$, so by chapter 1.3's shell theorem it is $F/r$. The derivative $\partial_z$ commutes with $\nabla$, so
$\nabla\cdot\vect W = \partial_z(F/r)$ and the boxed result gives $\field{\vect A} = \nabla\partial_z(F/r)$.

Inside, with $u = r^2/R^2$, $\partial_zf = -4Kz(1 - u)/R^2$, whose gradient is
$(K/R^2)[-4(1 - u)\hat z + 8z\vect x/R^2]$, and chapter 2.2's Laplacian of a function of $r$ gives
$\nabla^2f = (K/R^2)(20u - 12)$. The curl of a curl is $\nabla(\partial_zf) - \hat z\nabla^2f$, which is the flow
stated. Its radial part is $\hat x\cdot\matter{\vect J} = (K/R^2)(8zr/R^2 + (8 - 16u)z/r)$, which is zero at $r = R$.
On the axis, at the centre, $\matter{\vect J} = 8K\hat z/R^2$ points up; at the equator near the surface, $r \to R$
with $z = 0$, it is $-8K\hat z/R^2$ and points down. So in each half-plane the matter rises near the axis and sinks near
the surface: one roll, whose stream function is the $\chi$ of the section
[](#every-steady-flow-round-an-axis-is-a-swirl-plus-rolls).
:::

### The paper

The paper's bracket of two tides with harmonic profiles $h$ and $g$, equation [](/paper/#eq:flow-bracket), is
$\int\matter{\vect J}\cdot[(\nabla\nabla h)\nabla g - (\nabla\nabla g)\nabla h]\,\dd V$, where $\nabla\nabla h$ is the
table of second derivatives of $h$ (its Hessian, chapter 1.4). The octupolar pair is $h = (x^3 - 3xy^2)/3$ and
$g = (3x^2y - y^3)/3$. For a flow $\matter{\vect J} = \matter\rho\,\Omega\,(-y, x, 0)$ turning about the $z$ axis, show
that the integrand is $-4\matter\rho\,\Omega\,\varpi^4$, with $\varpi$ the distance from the axis. Use this to derive
the paper's factor $\tfrac{32}{35}(1 - 2^{-2/5})$ in equation [](/paper/#eq:hidden-spin) for the hidden swirl, and check
the number $0.221$.

::: solution
The gradients are $\nabla h = (x^2 - y^2, -2xy, 0)$ and $\nabla g = (2xy, x^2 - y^2, 0)$. Multiplying by the Hessians
gives $(\nabla\nabla h)\nabla g = 2\varpi^2(y, -x, 0)$ and $(\nabla\nabla g)\nabla h = -2\varpi^2(y, -x, 0)$, so the
bracket's vector is $4\varpi^2(y, -x, 0)$, and its product with $\matter{\vect J}$ is $-4\matter\rho\,\Omega\,\varpi^4$.
Over a uniform ball of radius $a$, $\int\varpi^4\,\dd V = 2\pi\int_0^ar^6\,\dd r\int_0^\pi\sin^5\vartheta\,\dd\vartheta
= \tfrac{32\pi}{105}a^7$. For a whole ball of radius $R$ turning one way the bracket has the size
$\tfrac{128\pi}{105}\matter\rho\,\Omega R^7 = \tfrac{32}{35}\matter M\Omega R^4$, with
$\matter M = \tfrac{4\pi}{3}\matter\rho R^3$. In the hidden swirl the inner ball gives $a^7/R^7$ of this with one sign,
and the shell $1 - a^7/R^7$ with the other, so the total is $1 - 2a^7/R^7$ of the uniform size. With $a = 2^{-1/5}R$,
$2a^7/R^7 = 2^{-2/5} = 0.758$, so the factor is $0.242$, and $\tfrac{32}{35} \times 0.242 = 0.221$. For quadrupolar
tides the integrand goes as $\varpi^2$, the same as in the angular momentum, and the factor $1 - 2a^5/R^5$ is zero.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), *The magnetic picture*: equation [](/paper/#eq:magnetic-point) (stated) and
  equation [](/paper/#eq:current-column), the current column; "the opposite of a Doppler radar"; the spin dipole and the
  factor $5/3$; the ball inside a shell at $2^{-1/5}R$; the turning ball's column and the flywheel's vortex.
- *What breaks the tie*: the potential $\int\rho\mathbf v\,\dd V'/|\mathbf x - \mathbf x'|$, the silent flows
  $\nabla\times\nabla\times\mathbf V$, convection rolls in a star or a core, and Figure [](/paper/#fig:silent-flows).
- [Section XIII](/paper/#sec:second-order), *The flow*: equation [](/paper/#eq:flow-bracket), with $\mathbf J$ the
  density of momentum, and equation [](/paper/#eq:hidden-spin) with Figure [](/paper/#fig:hidden-flow) (chapter 13.4).
- Table [](/paper/#tab:null): the magnetic part's row of what the camera cannot tell apart.
:::

::: deeper
- The GR course's [section 11.3](https://neovand.github.io/general-relativity/chapter-11.html#11-3-dust-a-crowd-that-refuses-to-interact)
  writes the mass flux of dust, $\rho\mathbf v$, as one row of the stress–energy tensor, and its lab
  [What crosses the surface?](https://neovand.github.io/general-relativity/chapter-11.html#particle-momentum-lab) counts
  the crossings; [section A.22](https://neovand.github.io/general-relativity/appendix-a.html#a-22-an-expanding-box-gives-the-fluid-equation)
  derives a continuity equation from a box, for the energy of an expanding universe.
- The homology course's [section 4.3](https://neovand.github.io/homology/cohomology/differential-forms/) treats the
  gradient, the curl and the divergence as one operation, and shows why the curl of a gradient vanishes.
- G. Backus, "Poloidal and toroidal fields in geomagnetic field modeling", *Reviews of Geophysics* 24, 75 (1986):
  the proof that every field with no divergence splits into a toroidal and a poloidal part, and when the two scalar
  functions are unique.
:::

[^J]: The letter $\vect J$ has several meanings. The coloured $\matter{\vect J}$ of this chapter is the mass flux, the
    density of momentum of the paper's Section XIII. Chapters 1.6 and 1.7 used $\vect J$ for an impulse. The paper's
    Section IV uses the same letter for the current column, which this chapter sets plain and always with its
    direction, $\vect J(\hat n)$. The plain $J$ of Section VIII is an invariant of the curvature,
    $\mathrm{tr}\,\mathcal W^3$.

[^A]: The letter $A$ is an area in chapter 2.6 and a design matrix in chapter 3.4. The paper gives the flow's potential
    no letter, and its own plain $A$ is the sum $\int\rho|\nabla h|^2\,\dd V$ of equation [](/paper/#eq:sum-rule).
    The bold $\field{\vect A}$ of this chapter is always the flow's potential.

[^quad]: The column is $\matter\rho\,\Omega\sin\theta\,(b - a)$, with $\sin\theta = 0.0500$ for the angle between the
    line of sight and the axis; a numerical integral along the line gives the same.

[^chi]: The paper uses $\chi$ for response functions ([chapter 4.1](/tutorial/response/oscillator/)); here it is the stream function only.

[^TP]: The letters $T$ and $P$ are not a temperature and a power here. $T$ is in $\mathrm{kg\,m^{-2}\,s^{-1}}$ and $P$
    in $\mathrm{kg\,m^{-1}\,s^{-1}}$.

[^ring]: Let $\vect U = (\chi/\varpi)\,\vect e_\varphi$, which is zero outside the body, as $\chi$ is. Its curl is the
    poloidal flow, because the circulation of $\vect U$ round the circle through a point, $2\pi\varpi \times
    \chi/\varpi$, is the mass per second $2\pi\chi$ through the disc (Stokes's theorem). The first step of the proof
    gives $\field{\vect A} = \nabla\times\vect Y$ with $\vect Y = \int\vect U/|\vect x - \vect y|\,\dd^3y$. Since $\nabla^2\vect Y =
    -4\pi\vect U$, and $\nabla\cdot\vect Y = 0$ because $\vect U$ has no divergence, the curl of a curl gives
    $\nabla\times\field{\vect A} = 4\pi\vect U$, which is zero outside.

[^num]: A numerical integral of $\int\matter{\vect J}/|\vect x - \vect y|\,\dd^3y$ for these rolls, at points outside
    the ball, agrees with $F\,\nabla\partial_z(1/r)$ to the accuracy of the integration.

[^L]: Write $\vect U = \nabla\times\vect V$, so that $\matter{\vect J} = \nabla\times\vect U$. In components,
    $[\vect x\times\matter{\vect J}]_i = x_j\partial_iU_j - x_j\partial_jU_i$. Integrating by parts, the first term
    gives $-\int U_i\,\dd V$ and the second $+3\int U_i\,\dd V$, so
    $\vect L = 2\int\vect U\,\dd V$. One more integration by parts gives $\int\vect U\,\dd V = 0$,
    because $\vect V$ vanishes outside the body.
