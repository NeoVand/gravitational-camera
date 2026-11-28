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
These loops are **convection rolls**, and they also churn in the liquid iron of a planet's core. The magnetic part of
the tide, $\curv{\tB}_{ij}$, is the second table of tides, in $\mathrm{s^{-2}}$, that moving masses make: it describes
how gyroscopes at nearby points turn relative to one another (section 1.5's
[ten numbers](/tutorial/newton/five-numbers/#a-pixel-that-also-reads-the-twist-records-ten-numbers)). Every confined
flow that is the same all round an axis and turns in its meridian planes is silent outside, however fast it runs,
while a swirl about the axis always shows.[^first]

{{paper fig:silent-flows}}

The shading spans four decades, down to $10^{-4}$ of the swirl's largest value, and the rolls stay below the lightest
shade. Why can rolls run unseen while a swirl always shows? The answer is a second null space, the twin of the density's
in section 2.5.

::: plain
Moving matter carries mass, and mass is never made or destroyed, so the mass in a small box changes only by what flows
across its walls. A flow has a potential of its own, built from moving mass as the gravitational potential is built
from mass at rest, and the magnetic part of the tide outside a body comes from how this potential turns. In a body that
is the same all round an axis, a steady flow has a swirl, which carries matter round the axis, and rolls, which carry it
up, across, down and back in the planes that contain the axis. The rolls leave the potential outside with no turning at
all, so they are invisible however fast they run, while the swirl carries angular momentum, and that shows. Even a
swirl can hide: a ball turning one way inside a shell turning the other way shows nothing outside when their
amounts of turning are equal.
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
tilted patch only the part at right angles counts, as for the [flux](/tutorial/newton/gauss-and-poisson/#flux-counts-how-much-field-crosses-a-surface)
of section 1.3. Each cubic metre holds the mass $\matter\rho$ moving at $\vect v$, so $\matter{\vect J}$ is also the
momentum per unit volume.[^J]

Rock of $2700\unit{kg\,m^{-3}}$ carried round at the equator's $465\unit{m\,s^{-1}}$ (section 1.1) has
$|\matter{\vect J}| = 1.26\times10^6\unit{kg\,m^{-2}\,s^{-1}}$: through each square metre that faces east, 1260 tonnes
of rock pass every second as the Earth turns. Air at the same speed carries 2250 times less mass.

We want a law, at each point, that says mass is neither made nor destroyed. We assume that **mass is conserved**: the
mass inside any region changes only by what crosses its surface. Take section 1.3's
[small box](/tutorial/newton/gauss-and-poisson/#divergence-is-the-outflow-per-unit-volume) of volume $\Delta V$. The
mass inside it is $\matter\rho\,\Delta V$, which changes by $(\partial\matter\rho/\partial t)\,\Delta V$ per second.
Section 1.3 found that the flux out of the six faces of a small box is the divergence times its volume, so the mass
leaving per second is $\nabla\cdot\matter{\vect J}\,\Delta V$. What the box gains is what it does not lose
(Figure [](#fig:flow-box)):

$$\frac{\partial\matter\rho}{\partial t}\,\Delta V = -\nabla\cdot\matter{\vect J}\,\Delta V .$$

Dividing by $\Delta V$ gives

$$\boxed{\;\frac{\partial\matter\rho}{\partial t} + \nabla\cdot\matter{\vect J} = 0 ,\;}$$

the **continuity equation**. Both terms are in $\mathrm{kg\,m^{-3}\,s^{-1}}$.

**A check.** A ball of uniform density swells with $\vect v = H\vect x$, where $H$ is a rate in $\mathrm{s^{-1}}$. Then
$\nabla\cdot\matter{\vect J} = 3H\matter\rho$, so $\partial\matter\rho/\partial t = -3H\matter\rho$: its radius grows at the rate $H$, its
volume at $3H$, and at a fixed mass its density falls at $3H$.

A flow is **steady** when the density at every point stays the same, $\partial\matter\rho/\partial t = 0$, so that
$\nabla\cdot\matter{\vect J} = 0$: as much mass leaves each small box as enters it. A flow is **confined** to a body when
$\matter{\vect J}$ is zero outside it. The swelling ball is not confined: its flow crosses every sphere about its centre.

**An example.** A body whose density depends only on the distance $r$ from its centre turns rigidly, with
$\vect v = \vect\Omega\times\vect x$ (section 1.1). In $\nabla\cdot(\matter\rho\vect v) = \vect v\cdot\nabla\matter\rho + \matter\rho\,\nabla\cdot\vect v$ the first term
vanishes, because $\nabla\matter\rho$ points along $\vect x$ and $\vect v$ is perpendicular to it, and the second because
$\partial_i(\epsilon_{ijk}\Omega_jx_k) = \epsilon_{ijk}\Omega_j\delta_{ik} = 0$. So a turning round body is a steady, confined flow: all of
it moves, and its density at each point never changes.

![The box of section 1.3 with mass flowing through it. The flux $\matter J_x(x)$ enters through the blue face, and the
larger $\matter J_x(x + \Delta x)$ leaves through the orange face, so the density inside falls, $\partial\matter\rho/\partial t
< 0$, between the times $t$ and $t + \Delta t$ shown beneath. The arrows' lengths and the shades are chosen for the
drawing.](tut-flow-box){#fig:flow-box}

## A flow has a potential of its own, built like the gravitational one

Section 2.4 built the [potential of a body](/tutorial/outside/greens-functions/#the-potential-of-one-point-builds-every-potential)
by adding the potentials of its pieces, $\field\Phi(\vect x) = -G\int\matter\rho(\vect y)/|\vect x - \vect y|\,\dd^3y$,
and showed that $\nabla^2\field\Phi = 4\pi G\matter\rho$; here $\vect y$ runs over the sources. We do the same with
each component of the mass flux. The **potential of the flow** is

$$\sym{flow-potential}{\field{\vect A}}(\vect x) = \int\frac{\matter{\vect J}(\vect y)}{|\vect x - \vect y|}\,\dd^3y ,$$

three integrals of section 2.4's kind, one for each component.[^A] Its unit is that of $\matter{\vect J}$ times a
square metre, $\mathrm{kg\,s^{-1}}$. Section 2.4's result, applied to one component at a time, gives

$$\boxed{\;\nabla^2\field{\vect A} = -4\pi\,\matter{\vect J} .\;}$$

The **curl** of a vector field $\vect F$ is the vector

$$(\nabla\times\vect F)_i = \epsilon_{ijk}\,\partial_jF_k ,$$

section 1.1's [cross product](/tutorial/newton/vectors-and-indices/#the-cross-product-is-written-with-the-levi-civita-symbol)
with the derivative $\partial_j$ in the place of the first vector. It measures how the field turns round each point.
For the rigid turning, $\partial_jx_m = \delta_{jm}$ and section 1.1's
[identity](/tutorial/newton/vectors-and-indices/#two-levi-civita-symbols-make-two-kronecker-deltas) give
$\nabla\times(\vect\Omega\times\vect x) = 3\vect\Omega - \vect\Omega = 2\vect\Omega$, twice the angular velocity.
The antisymmetry of $\epsilon$ makes two combinations vanish.

- **A gradient has no curl**: $\epsilon_{ijk}\partial_j\partial_kf = 0$. Renaming $j$ as $k$ and $k$ as $j$ changes the
  sign of $\epsilon$ and leaves $\partial_j\partial_k$ as it was, so the sum equals minus itself.
- **A curl has no divergence**: $\partial_i\epsilon_{ijk}\partial_jF_k = 0$, for the same reason.

The same identity gives the curl of a curl, after a cyclic move puts the shared index first:
$\epsilon_{ijk}\partial_j\epsilon_{klm}\partial_lV_m = (\delta_{il}\delta_{jm} -
\delta_{im}\delta_{jl})\partial_j\partial_lV_m$, so

$$\boxed{\;\nabla\times(\nabla\times\vect V) = \nabla(\nabla\cdot\vect V) - \nabla^2\vect V .\;}$$

Outside a body, for a steady flow and to first order in $v/c$, where $c$ is the speed of light, the magnetic part comes
from this potential, as
[section 7.5](/tutorial/geometry/gravitomagnetism/#moving-matter-makes-the-magnetic-part-through-the-potential-of-its-flow)
derives:

$$\curv{\tB}_{ij} = \frac{G}{c}\,(\partial_ib_j + \partial_jb_i), \qquad \vect b = \nabla\times\field{\vect A} ,$$

with $\vect b$ in $\mathrm{kg\,m^{-1}\,s^{-1}}$. The units agree: $G/c$, in $\mathrm{m^2\,kg^{-1}\,s^{-1}}$, times
$\mathrm{kg\,s^{-1}}$ divided by a square metre for the two derivatives, is $\mathrm{s^{-2}}$, the unit of a tide. We
rely on nothing else from section [7.5](/tutorial/geometry/gravitomagnetism/#moving-matter-makes-the-magnetic-part-through-the-potential-of-its-flow).

One mass $\matter M$ at the origin, moving with velocity $\vect v$, has at the point $\vect x$ the potential
$\field{\vect A} = \matter M\vect v/r$, which points along the velocity and falls as the inverse distance. So $\vect b =
\nabla(1/r)\times\matter M\vect v = -\matter M\,\vect x\times\vect v/r^3$. Its derivative $\partial_ib_j$ has a part
that is antisymmetric in $i$ and $j$, which cancels in the sum, and the part $3\matter M\,x_i(\vect x\times\vect
v)_j/r^5$. With $\hat n = -\vect x/r$, the unit vector from the point toward the mass, the rule gives, for one moving mass,[^mp]

$$\curv{\tB}_{ij} = \frac{3G\matter M}{c\,r^{3}}\,\bigl[\hat n_i(\hat n\times\vect v)_j + \hat n_j(\hat n\times\vect v)_i\bigr].$$

So if $\field{\vect A}$ is a gradient everywhere outside a body, its curl $\vect b$ vanishes there, and the body makes
no magnetic part outside.

## The current column is the flow along a line of sight, weighted by inverse distance

Section 1.5 grouped the matter round a pixel by direction and found the
[tidal column](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes)
$S(\hat n) = \int\matter\rho\,\dd r/r$. We group moving matter in the same way. The pixel is at the origin, $\hat n$ is
a unit vector toward the matter, and $r$ is the distance along $\hat n$. The matter in a small patch of sky of solid
angle $\dd\Omega$ (section 2.2), between the distances $r$ and $r + \dd r$, has the mass
$\matter\rho\,r^2\,\dd r\,\dd\Omega$. Its magnetic part falls as $1/r^3$, so it enters with the weight
$r^2\,\dd r/r^3 = \dd r/r$. Adding up all the pieces gives

$$\begin{gathered}
\curv{\tB}_{ij} = \frac{3G}{c}\int\dd\Omega\,\bigl[\hat n_i(\hat n\times\vect J)_j + \hat n_j(\hat n\times\vect J)_i\bigr],\\
\vect J(\hat n) = \int \matter\rho\,\vect v(r\hat n)\,\frac{\dd r}{r} .
\end{gathered}$$

The **current column**
$\sym{current-column}{\vect J(\hat n)}$ is the mass flux along the line of sight, each part weighted by the inverse of
its distance. Its unit is that of the mass flux, because $\dd r/r$ has none. We write it plain, always with its direction. The column enters only through
$\hat n\times\vect J$, so motion toward or away from the camera adds nothing to $\curv{\tB}$. A Doppler radar sees
only that motion, so the magnetic channel is the opposite of a Doppler radar.

We want the column of a turning ball. We assume a **ball of uniform density $\matter\rho$, turning rigidly with angular
velocity $\vect\Omega$ about its centre $\vect s$**, which is measured from the pixel. The pixel is outside the ball,
and a line of sight that meets it enters at the distance $a$ and leaves at $b$. At the point $r\hat n$ the velocity is
$\vect\Omega\times(r\hat n - \vect s)$, section 1.1's rule with the centre moved to $\vect s$. Only the stretch from $a$
to $b$ contributes (Figure [](#fig:flow-column)):

$$\vect J(\hat n) = \matter\rho\int_a^b\vect\Omega\times(r\hat n - \vect s)\,\frac{\dd r}{r} .$$

The vectors $\vect\Omega\times\hat n$ and $\vect\Omega\times\vect s$ do not change along the line, so the integral
splits into $\int_a^b\dd r = b - a$ and $\int_a^b\dd r/r = \ln(b/a)$:

$$\boxed{\;\vect J(\hat n) = \matter\rho\bigl[(\vect\Omega\times\hat n)(b - a) - (\vect\Omega\times\vect s)\ln(b/a)\bigr] ,\;}$$

**A number.** A steel ball of radius 10 cm and density $7850\unit{kg\,m^{-3}}$, its centre 1 m from the pixel, turns ten
times a second, $\Omega = 62.8\unit{s^{-1}}$, about the line to its centre, so $\vect\Omega\times\vect s = 0$. A line of sight that passes 5 cm from the centre enters at $a = 0.912\unit{m}$ and
leaves at $b = 1.085\unit{m}$. The steel on it moves sideways at about $\Omega \times 5\unit{cm} = 3.1\unit{m\,s^{-1}}$,
and the column is $4270\unit{kg\,m^{-2}\,s^{-1}}$, along that motion.[^quad] On every line of sight the column points
round the line to the centre, so on the sky it makes a vortex that circulates in the sense of the ball's turning.
The ball pulls the same spinning or still, so its pull hides the turning, and its current column shows it.

**A limit.** For a thin piece of matter, $b$ close to $a$, $\ln(b/a) \approx (b - a)/a$, and the column becomes the mass
flux where the line crosses, times the thickness, divided by the distance, as the weight $\dd r/r$ says.

![A ball turning about an axis at right angles to the page, cut through the plane that holds the pixel, the ball's
centre and one line of sight, which enters the ball at $a$ and leaves at $b$. At five points of the chord the velocity is
split into its part along the line (faint), which adds nothing to $\curv{\tB}$, and its part across the line (bold),
which counts. The sizes and the arrows' scale are chosen for the drawing.](tut-flow-column){#fig:flow-column}

<!-- try: current-column — A disc of uniform density turning about a point the reader drags, seen from a camera at the
left. A fan of lines of sight, each with its current column drawn as an arrow at the camera's sky (only the part across
the line), and the boxed formula as a readout (a, b, the two terms) for the line under the pointer. Predict: "Turn the
disc about its own centre. Does the column change when the disc is moved along the line of sight?" (Only the ln(b/a)
term changes.) Keyboard and both themes. Optional. -->

## Every steady flow round an axis is a swirl plus rolls

We now sort the steady flows of a body that is the same all round an axis, the $z$ axis. Such a flow is **axially
symmetric**: turning the body and its flow about the axis changes nothing. A **meridian plane** contains the axis, as the
meridians of a globe do. At each point, $\matter{\vect J}$ splits into a part round the axis, along the unit vector
$\vect e_\varphi$, and a part in the meridian plane through the point.

The part round the axis is the **toroidal flow**, or **swirl**, as in a rigid turning or a star whose equator turns
faster than its poles. The part in the meridian planes is the **poloidal flow**. The swirl has no divergence, because
it carries matter along circles on which nothing changes, and a steady flow has none, so the poloidal part has none
either.

A flow in a plane with no divergence is described by one function. Take a point $\vect x$ in a meridian plane and the
circle about the axis through $\vect x$. Let $2\pi\sym{stream-function}{\chi}(\vect x)$ be the mass per second that
crosses the flat disc spanned by this circle, counted positive upward, along $+z$. Any other surface bounded by the same
circle carries the same mass per second, because in a steady flow the region between the two surfaces has no net
outflow (the divergence theorem of section 1.3). The function $\chi$ is the **stream function** of the flow, in
kilograms per second.[^chi]

Now take two points $\vect x_1$ and $\vect x_2$ in one half of a meridian plane, and the straight segment between them.
Turned once round the axis, the segment sweeps out a band, a piece of a cone. The disc of the first circle and the band
together make a surface bounded by the second circle, so the band carries the mass per second
$2\pi[\chi(\vect x_2) - \chi(\vect x_1)]$. If the two points lie on one contour of $\chi$, nothing crosses between
them, so the flow runs along the contours of $\chi$.

On the axis the circle shrinks to a point, so $\chi = 0$ there. On the surface of a confined flow the circle bounds a
cap that no mass crosses, so $\chi = 0$ there too. A contour of $\chi$ at any other value therefore never reaches the
axis or the surface, and since a contour of a smooth function has no loose end, it closes on itself inside the body, and
the matter runs round it. In each half of a meridian plane the poloidal flow is one or more **rolls**. An example, in a
ball of radius $R$, is

$$\chi = \frac{4K\varpi^2}{R^2}\Bigl(1 - \frac{r^2}{R^2}\Bigr) ,$$

where $\varpi = r\sin\vartheta$ is the distance from the axis, in metres, and $K$ is a constant in kilograms per second.
It vanishes on the axis and on the surface, and its contours make one roll in each half-plane
(Figure [](#fig:flow-stream) and the stretch problem below).

![A ball cut in half through its axis. Left, rolls: the contours of the example $\chi$ at 0.35, 0.65 and 0.9 of its
greatest value $K$, along which the matter rises near the axis and sinks near the surface; $P$ lies on the outer roll,
and $2\pi\chi(P)$ is the mass per second through the shaded disc bounded by the circle about the axis through $P$.
Right, a swirl: the matter comes out of the page on
one side of the axis and goes into it on the other.](tut-flow-stream){#fig:flow-stream}

The two parts can be written with two functions of position, $T$ and $P$, as[^TP]

$$\matter{\vect J} = \nabla\times(T\,\vect x) + \nabla\times\nabla\times(P\,\vect x) .$$

By the product rule the first term is $\nabla T\times\vect x + T\,\nabla\times\vect x$, and $\nabla\times\vect x = 0$, so it is
$\nabla T\times\vect x$. When $T$ is the same all round the axis, $\nabla T$ lies in the meridian plane through the point, as
does $\vect x$, so their cross product is perpendicular to that plane and points round the axis: it is the swirl. A
uniform ball turning rigidly has $T = \matter\rho\,\vect\Omega\cdot\vect x$, since then
$\nabla T\times\vect x = \matter\rho\,\vect\Omega\times\vect x$.

The second term is the rolls, written $\nabla\times\nabla\times\vect V$, with $\sym{roll-vector}{\vect V} = P\vect x$
in kilograms per second. In a body without a hole through it, every confined poloidal flow can be written in this form
with $\vect V$ zero outside the body; for a round body $P$ itself vanishes outside, and for any other shape this holds
after a gradient is added to $\vect V$, as the box below explains.

::: gap
Every flow with no divergence, symmetric or not, can be written as $\nabla\times(T\vect x) + \nabla\times\nabla\times(P\vect x)$,
and the two functions are unique once their averages over every sphere about the centre are removed; Backus's review
(in *Go deeper*) proves it. The step from $\chi$ to $P$ is one integration over the polar angle $\vartheta$, which we
skip.

The next section needs $\vect V$ and its first derivatives to vanish outside the body. The choice $\vect V = P\vect x$
can miss this where the body is not round, since $P$ then need not vanish outside, and where rolls slide along the
surface. In both cases we add to $\vect V$ the gradient of a suitable function, which leaves the flow unchanged
because a gradient has no curl. The stretch problem's $\vect V = f(r)\,\hat z$ is of this kind: it is $P\vect x$ with
$P = 4Kz(1 - r^2/R^2)/R^2$, plus a gradient.
:::

## Rolls are silent outside, because their potential there is a gradient

We want to show that rolls make no magnetic part outside the body. We assume that **the flow is
$\matter{\vect J} = \nabla\times\nabla\times\vect V$**, and that **$\vect V$ and its first derivatives are continuous
everywhere and zero outside the body**. Nothing else about $\vect V$ is used, so it need not have the form $P\vect x$.
Each component of $\vect V$ is then confined in the sense of
[section 2.5](/tutorial/outside/null-space/#a-confined-laplacian-added-to-a-body-changes-nothing-outside). Such a flow is
steady, because a curl has no divergence.

The proof uses **integration by parts in a volume**. The product rule gives $\partial_j(fg) = (\partial_jf)\,g + f\,\partial_jg$.
We integrate over a large ball that holds the body and apply the divergence theorem to $fg$ along the $j$ axis: the left
side becomes an integral over the ball's surface, which vanishes if $f$ is zero outside the body, and

$$\int f\,\partial_jg\,\dd^3y = -\int(\partial_jf)\,g\,\dd^3y .$$

One derivative moves from one function to the other, with a change of sign. Section 2.1's
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
$U_k = \epsilon_{klm}\partial^y_lV_m$, turn that integral into the curl of $\int\vect V/|\vect x - \vect y|\,\dd^3y$. So

$$\field{\vect A} = \nabla\times\nabla\times\vect W, \qquad \sym{roll-potential}{\vect W}(\vect x) = \int\frac{\vect V(\vect y)}{|\vect x - \vect y|}\,\dd^3y ,$$

with $\vect W$ in $\mathrm{kg\,m^2\,s^{-1}}$. The curl of a curl gives

$$\field{\vect A} = \nabla(\nabla\cdot\vect W) - \nabla^2\vect W .$$

By section 2.4's result, used above for $\field{\vect A}$, $\nabla^2\vect W = -4\pi\vect V$, which is zero outside the
body. So outside it

$$\boxed{\;\field{\vect A} = \nabla(\nabla\cdot\vect W) ,\;}$$

a gradient. A gradient has no curl, so the magnetic part outside is zero, however fast the rolls run. The stream
function gives a shorter proof for a body of any shape, even a ring.[^ring]

The potential itself is not zero outside; only its curl is. For the rolls of the stretch problem the potential outside is
$\field{\vect A} = F\,\nabla\,\partial_z(1/r)$, with $F = \int f\,\dd V$.

**The flows of the figure.** The two flows of the figure at the head of this section share one profile. In a ball of
radius $R$ and uniform density $\matter\rho$ we take

$$\Psi = \frac{\matter\rho\,\Omega_0R^2}{10}\Bigl(1 - \frac{r^2}{R^2}\Bigr)^5$$

inside and zero outside, in $\mathrm{kg\,m^{-1}\,s^{-1}}$, with $\Omega_0$ a rate in $\mathrm{s^{-1}}$. It vanishes at
the surface together with its first four derivatives. The swirl is $\matter{\vect J} = \nabla\times(\Psi\hat z) =
\nabla\Psi\times\hat z$. Since $\nabla\Psi = -\matter\rho\,\Omega_0(1 - r^2/R^2)^4\,\vect x$,

$$\matter{\vect J}_{\rm swirl} = \matter\rho\,\Omega_0\Bigl(1 - \frac{r^2}{R^2}\Bigr)^4\,\hat z\times\vect x ,$$

so each spherical layer turns rigidly about the $z$ axis at $\Omega(r) = \Omega_0(1 - r^2/R^2)^4$, fastest at the
centre and still at the surface. The rolls are $\matter{\vect J} = \nabla\times\nabla\times\vect V$ with
$\vect V = R\,\Psi\,\hat z$, in $\mathrm{kg\,s^{-1}}$, a confined $\vect V$ of the kind the proof needs. At the centre
they carry $2\matter\rho\,\Omega_0R$ upward, ten times the swirl's largest flux, $0.21\,\matter\rho\,\Omega_0R$ at
$r = R/3$.

The swirl's field outside is known exactly, because its layers turn rigidly: by the boxed result of the next section,
$\field{\vect A} = \vect L\times\vect x/2r^3$ there. Its angular momentum is $\vect L = \tfrac23\hat z\int\matter\rho\,
\Omega(r)\,r^2\,\dd V$. With $u = r/R$ and $(1 - u^2)^4 = 1 - 4u^2 + 6u^4 - 4u^6 + u^8$,

$$\begin{aligned}\int_0^1u^4(1 - u^2)^4\,\dd u &= \tfrac15 - \tfrac47 + \tfrac69 - \tfrac4{11} + \tfrac1{13} = \frac{128}{15{,}015},\\
L &= \frac{8\pi}{3}\,\matter\rho\,\Omega_0R^5\,\frac{128}{15{,}015} = 0.0714\,\matter\rho\,\Omega_0R^5 ,\end{aligned}$$

which is $128/3003$, or 4.3 per cent, of the angular momentum $\tfrac{8\pi}{15}\matter\rho\,\Omega_0R^5$ of the same ball
turning rigidly at $\Omega_0$. The magnetic part follows from $\vect b = \nabla\times\field{\vect A} = [3\vect x(\vect
L\cdot\vect x) - \vect Lr^2]/2r^5$. Differentiating, $\partial_ib_j = \tfrac12[3\delta_{ij}(\vect L\cdot\vect x) +
3x_jL_i + 3L_jx_i]/r^5 - \tfrac{15}{2}x_ix_j(\vect L\cdot\vect x)/r^7$, so with $\hat x = \vect x/r$

$$\curv{\tB}_{ij} = \frac{G}{c}\,(\partial_ib_j + \partial_jb_i) = \frac{3G}{c\,r^4}\bigl[L_i\hat x_j + \hat x_iL_j +
(\vect L\cdot\hat x)(\delta_{ij} - 5\hat x_i\hat x_j)\bigr] ,$$

the field of a spin dipole. Its size follows from the sums of the products of matching entries: the first two terms
together give $2L^2 + 2(\vect L\cdot\hat x)^2$, the third $(3 - 10 + 25)(\vect L\cdot\hat x)^2$, and twice their cross
term $-16(\vect L\cdot\hat x)^2$. With $\vartheta$ the angle from the axis,

$$\boxed{\;|\curv{\tB}| = \frac{3GL}{c\,r^4}\sqrt{2 + 4\cos^2\vartheta}\;}$$

in $\mathrm{s^{-2}}$, as $GL/cr^4$ is. On the axis the table is $(3GL/cr^4)\,\mathrm{diag}(1, 1, -2)$, of size
$\sqrt6\,(3GL/cr^4)$, as the formula says. The figure's largest value, on the axis at $1.1R$, is
$\sqrt6 \times 3GL/c(1.1R)^4$. For the steel ball of radius 10 cm, with its centre turning ten times a second,
$\Omega_0 = 62.8\unit{s^{-1}}$, the angular momentum is $0.0714 \times 7850 \times 62.8 \times 10^{-5} =
0.352\unit{kg\,m^2\,s^{-1}}$ and this largest value is $3.9 \times 10^{-15}\unit{s^{-2}}$, about a billionth of the
ball's stretch $2G\matter M/r^3 = 3.3 \times 10^{-6}\unit{s^{-2}}$ at the same point, a ratio of the size of $v/c$ for
steel moving at a metre or so per second.

The figure computes both fields by one numerical integration, the same for each. The cube $|x|, |y|, |z| \le R$ is
cut into $64^3$ small cubes of side $R/32$. At each point outside, the second derivatives
$\partial_q\partial_j\field A_p$ are the sum, over the cubes, of $\matter J_p$ at the cube's centre times
$\partial_q\partial_j(1/|\vect x - \vect y|) = (3X_qX_j - X^2\delta_{qj})/X^5$, with $\vect X = \vect x - \vect y$,
times the cube's volume; $\curv{\tB}$ follows by the curl and the symmetric sum. The profile's smoothness at the
surface makes this simple sum accurate. Over the figure's square of the meridian plane, $4R$ on a side, at every point
farther than $1.1R$ from the centre, the sum for the swirl agrees with the exact spin dipole to 3 parts in $10^7$. The sum for the rolls is at most
$5.0 \times 10^{-5}$ of the swirl's largest value, on the equator at $1.1R$, and there it shrinks about fourteen times
when the cubes are halved in side. So what remains of the rolls is the error of the sum, and their field outside is zero.

**Two scenes.** Take a ball of uniform density at rest, and the same ball with rolls running inside it. A uniform density with $\nabla\cdot\matter{\vect J} = 0$ has $\nabla\cdot\vect v = 0$, so the matter moves without
crowding: the density at every point is the same in both scenes at every instant, and so is $\curv{\tE}$ outside. The
magnetic part outside is zero in both. To first order in $v/c$, no reading of the near field outside can tell them
apart.

A reading at two times breaks the tie. Apply a short tide shaped by a harmonic function $g$, read how fast the moment
$\int\matter\rho\,h\,\dd V$ of a second harmonic function $h$ changes, and repeat with $h$ and $g$ exchanged. The part
of the response that changes sign is a bracket, an integral of $\matter{\vect J}$ itself, so it sees flows that the field
outside misses ([section 1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside); section
[13.4](/tutorial/what-a-field-keeps/flows-inside/#every-silent-flow-is-read-by-calderóns-pair) shows that it reads
every silent flow). A pixel inside the matter breaks the tie too: there $\curv{\tB}$ has an antisymmetric part, a
[vector in disguise](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise), equal to
$-(4\pi G/c)\,\matter\rho\vect v$ and lying along the flow.

## A swirl shows through its angular momentum, and two swirls can cancel

We want the potential outside a round body whose swirl is a rigid turning of each spherical layer. We assume that
**the density depends only on $r$**, and first take **one thin layer at the radius $r'$, turning rigidly at
$\vect\Omega$**. Its mass flux is $\matter\rho\,\vect\Omega\times\vect y$, so

$$\field{\vect A}(\vect x) = \vect\Omega\times\int\frac{\matter\rho\,\vect y}{|\vect x - \vect y|}\,\dd^3y .$$

Outside the layer, $r' < r$, and the [generating function](/tutorial/outside/spherical-harmonics/#the-patterns-symmetric-about-an-axis-are-the-legendre-polynomials-and-the-inverse-distance-generates-them)
of section 2.2 writes $1/|\vect x - \vect y| = \sum_\ell r'^\ell P_\ell(\cos\gamma)/r^{\ell+1}$, with $\gamma$ the angle between
$\vect x$ and $\vect y$. The components of $\hat y$ are patterns of degree one, so every term but $\ell = 1$ integrates to
zero over the directions of $\vect y$, by orthogonality. The term $\ell = 1$ is $r'\,\hat x\cdot\hat y/r^2$. With
$\vect y = r'\hat y$, $\dd^3y = r'^2\,\dd r'\,\dd\Omega_y$ and the sky average of section 1.5,
$\oint\hat y\,(\hat y\cdot\hat x)\,\dd\Omega_y = \tfrac{4\pi}{3}\hat x$:

$$\begin{aligned}\int\frac{\matter\rho\,\vect y}{|\vect x - \vect y|}\,\dd^3y &= \frac{1}{r^2}\int\matter\rho\,r'^4\,\dd r'\oint\hat y\,(\hat y\cdot\hat x)\,\dd\Omega_y\\ &= \frac{\vect x}{3r^3}\int\matter\rho\,r'^2\,\dd V ,\end{aligned}$$

because $4\pi r'^2\,\dd r'$ is the volume of the layer. Section 1.6's
[moment of inertia](/tutorial/newton/motion/#a-round-body-has-the-same-moment-about-every-axis)
of a round body is $I = \tfrac23\int\matter\rho\,r^2\,\dd V$, and its angular momentum,
$\int\vect x\times\matter{\vect J}\,\dd V$, is $\vect L = I\vect\Omega$, so the layer gives

$$\boxed{\;\field{\vect A} = \frac{\vect L\times\vect x}{2r^3}\;}$$

everywhere outside it. Layers add, so outside a round body whose layers turn rigidly, each at its own rate, $\field{\vect A}$ is this with the
total angular momentum. Its curl, $[3\vect x(\vect L\cdot\vect x) - \vect
Lr^2]/2r^5$, is not zero: it is the pattern of a **spin dipole**, and the magnetic part outside a spinning round body is built from it in section
[7.5](/tutorial/geometry/gravitomagnetism/#a-spinning-round-body-is-a-spin-dipole). **A check** of units:
$\mathrm{kg\,m^2\,s^{-1}}$ times a metre over $\mathrm{m^3}$ is $\mathrm{kg\,s^{-1}}$, the unit of $\field{\vect A}$.
The rolls pass another check: a flow that showed outside through a spin dipole would need angular momentum, and they
have none.[^L]

So a swirl of rigidly turning layers shows, and only through its angular momentum. A swirl whose rate changes with
latitude shows through further **moments** of the flow, integrals of the mass flux times a fixed function of position,
of which the angular momentum is one: it shows only through its
[harmonic part](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see),
of which the spin dipole is the first term.

The Earth's angular momentum is $0.3307\,\matter MR^2\Omega = 5.8\times10^{33}\unit{kg\,m^2\,s^{-1}}$ (section 1.6), 17 per
cent less than a uniform Earth would carry at the same rate. A ball and a thin shell of equal mass and size, turning at
the same rate, pull alike outside, but their angular momenta differ by the ratio of their moments of inertia,
$\tfrac23\matter MR^2$ against $\tfrac25\matter MR^2$, a factor $\tfrac53$. At equal angular momentum they are identical
outside: motion too can hide.

**The hidden swirl.** A uniform ball of radius $a$ turns at $\vect\Omega$ inside a shell of the same density that fills
the sphere out to $R$ and turns at $-\vect\Omega$. By section 1.6, a uniform ball of radius $a$ has the moment
$\tfrac25\matter Ma^2 = \tfrac{8\pi}{15}\matter\rho a^5$, so the shell has $\tfrac{8\pi}{15}\matter\rho(R^5 - a^5)$, and

$$\vect L = \tfrac{8\pi}{15}\matter\rho\,\vect\Omega\bigl[a^5 - (R^5 - a^5)\bigr] .$$

It vanishes when $a^5 = R^5/2$:

$$\boxed{\;a = 2^{-1/5}R = 0.871\,R .\;}$$

The inner ball holds $2^{-3/5} = 66$ per cent of the mass, and the outer third, lying farther from the axis, carries as
much angular momentum (Figure [](#fig:flow-hidden)). Outside, $\field{\vect A} = 0$ and there is no magnetic part at
all, though all of it moves. Two octupolar tides, the next finer pattern after the simple stretch and squeeze, read this flow: their bracket has the size $0.221\,\matter M\Omega R^4$, in
$\mathrm{kg\,m^4\,s^{-1}}$ (section
[13.4](/tutorial/what-a-field-keeps/flows-inside/#octupolar-tides-read-the-hidden-swirl)), while two quadrupolar tides
give zero, because their bracket is proportional to $\vect L$.[^hs]

::: try {#hidden-flow}
Predict first: the bracket of the two octupolar tides vanishes at one radius of the inner ball. Is that radius smaller
or larger than $0.871R$, where the angular momentum vanishes? The figure opens at $0.871R$. Drag the slider, or use the
arrow keys, and watch the two sums: the quadrupolar bracket always reads $-2$ times the angular momentum below it. Find
where the sum of degree three reads zero, and see in the shaded shares how much more the outer layers count there.
:::

![The hidden swirl in section through its equator, seen along the axis. The inner ball, out to $0.871R$, turns one way
(orange) and the shell out to $R$ the other way (blue) at the same rate. The bars are the two angular momenta, equal and
opposite, although the inner ball holds 66 per cent of the mass and the shell 34 per cent.](tut-flow-hidden){#fig:flow-hidden}

## The density and the flow each have a null space

Section 2.5 found the [null space](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see)
of the steady pull: densities $\nabla^2\field\psi/4\pi G$ with $\field\psi$ confined. The magnetic part has a null
space of the same build, the flows $\nabla\times\nabla\times\vect V$ with $\vect V$ confined, together with the swirls
whose moments vanish. The table lists the two.[^tab]

| Channel | What the outside fixes | What it cannot see | What reveals it |
|---|---|---|---|
| Electric part, $\curv{\tE}$ | the harmonic part of $\matter\rho$ (2.5) | $\nabla^2\field\psi/4\pi G$: a cored Earth against a uniform one, a nugget against its flush | spin, a kick, heat, a pixel inside |
| Magnetic part, $\curv{\tB}$ | the swirl, through $\vect L$ and moments like it | rolls $\nabla\times\nabla\times\vect V$; swirls whose moments all vanish, such as the hidden swirl | two tides in either order, a pixel inside |

Both blind spots belong to a reading at one time; readings at two times, the responses to tides applied in turn, break
both (sections [13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple) and
[13.4](/tutorial/what-a-field-keeps/flows-inside/#the-order-of-two-short-tides-matters-first-at-the-second-power-of-the-time)).

**The idea to keep: moving mass is a flux, $\matter\rho\vect v$, with a potential built like the gravitational one.
Rolls leave that potential a gradient outside, so they are silent however fast they run; a swirl shows through its
angular momentum, and two swirls with opposite angular momenta hide each other.**

::: problems
### Practice

**[2.8]** Air of $1.2\unit{kg\,m^{-3}}$ blows at $10\unit{m\,s^{-1}}$ through an open door of $2\unit{m^2}$. What is the mass
flux, and how much air passes through the door each second?

::: solution
The mass flux is $1.2 \times 10 = 12\unit{kg\,m^{-2}\,s^{-1}}$, and through $2\unit{m^2}$ that is $24\unit{kg}$ of air
each second.
:::

**[2.8]** A uniform ball of radius $a$ turns at $\vect\Omega$ inside a shell of the same density, out to $R$, that turns at
$-2\vect\Omega$. For which $a$ is the angular momentum zero, and what share of the mass then turns with the inner
ball?

::: solution
With section 1.6's moments, $\vect L \propto a^5 - 2(R^5 - a^5)$, which vanishes when $3a^5 = 2R^5$, so
$a = (2/3)^{1/5}R = 0.922\,R$, and the inner ball holds $(a/R)^3 = (2/3)^{3/5} = 78$ per cent of the mass.
:::

**[2.8]** In the flows of the figure each layer of the swirl turns at $\Omega(r) = \Omega_0(1 - r^2/R^2)^4$. Show that
its angular momentum is $128/3003$ of that of the same ball turning rigidly at $\Omega_0$, and find at what radius the
swirl's flux is largest.

::: solution
A thin layer of mass $\dd m$ at the radius $r$ has the moment of inertia $\tfrac23r^2\,\dd m$, so
$L = \tfrac23\int\matter\rho\,\Omega(r)\,r^2\,4\pi r^2\,\dd r = \tfrac{8\pi}{3}\matter\rho\,\Omega_0R^5 \times
\tfrac{128}{15{,}015}$. The rigid ball has $\tfrac{8\pi}{15}\matter\rho\,\Omega_0R^5$, and the ratio is
$5 \times 128/15{,}015 = 128/3003 = 0.043$. The flux has the size $\matter\rho\,\Omega_0\,\varpi(1 - r^2/R^2)^4$, largest on
the equator, where $\varpi = r$. The derivative of $u(1 - u^2)^4$ is $(1 - u^2)^3(1 - 9u^2)$, zero at $u = \tfrac13$,
where the flux is $\tfrac13(\tfrac89)^4 = 0.21$ in units of $\matter\rho\,\Omega_0R$.
:::

### Stretch

**[2.8]** Outside a round body whose layers turn rigidly, the size of the magnetic part is
$(3GL/cr^4)\sqrt{2 + 4\cos^2\vartheta}$. At equal distance, how much stronger is it on the axis than on the equator?
Show that on the equator the table has the entry $3GL/cr^4$ in the two places that pair the axis with the
direction to the point, and nothing else.

::: solution
The ratio is $\sqrt6/\sqrt2 = \sqrt3 = 1.73$. On the equator $\vect L\cdot\hat x = 0$, so only
$L_i\hat x_j + \hat x_iL_j$ is left: with $\vect L = L\hat z$ and $\hat x = \hat e_1$ it has $L$ in the entries $13$ and
$31$ and zero elsewhere, so $\curv{\tB}_{13} = \curv{\tB}_{31} = 3GL/cr^4$, of size $\sqrt2\,(3GL/cr^4)$ as the formula
gives.
:::

**[2.8]** Take $\vect V = f(r)\,\hat z$ with $f = K(1 - r^2/R^2)^2$ inside a ball of radius $R$ and $f = 0$ outside. (This $\vect
V$ is not of the form $P\vect x$, but the proof of the silent flows needs only a confined $\vect V$.) Show that outside
the ball $\vect W = \hat z\,F/r$ with $F = \int f\,\dd V$, so that $\field{\vect A} = F\,\nabla\,\partial_z(1/r)$ there.
Then show that the flow inside is $\matter{\vect J} = (K/R^2)\bigl[8z\vect x/R^2 + (8 - 16r^2/R^2)\,\hat z\bigr]$, that
no mass crosses the surface, and that it makes one roll in each half of a meridian plane.

::: solution
Outside the ball, $\int f(r')/|\vect x - \vect y|\,\dd^3y$ is the potential of a round body of "density" $f$, divided by
$-G$, so by section 1.3's shell theorem it is $F/r$. The derivative $\partial_z$ commutes with $\nabla$, so
$\nabla\cdot\vect W = \partial_z(F/r)$ and the boxed result gives $\field{\vect A} = \nabla\partial_z(F/r)$.

Inside, with $u = r^2/R^2$, $\partial_zf = -4Kz(1 - u)/R^2$, whose gradient is
$(K/R^2)[-4(1 - u)\hat z + 8z\vect x/R^2]$, and $\nabla^2f = (K/R^2)(20u - 12)$ (section 2.2). The curl of a curl is
$\nabla(\partial_zf) - \hat z\nabla^2f$, which is the flow stated. Its radial part, $(K/R^2)(8zr/R^2 + (8 - 16u)z/r)$, is
zero at $r = R$. At the centre $\matter{\vect J} = 8K\hat z/R^2$ points up; at the equator near the surface it is
$-8K\hat z/R^2$ and points down. So in each half-plane the matter rises near the axis and sinks near the surface: one
roll, with the $\chi$ of the [section above](#every-steady-flow-round-an-axis-is-a-swirl-plus-rolls).
:::

### The camera

**[2.8]** The bracket of two tides with harmonic profiles $h$ and $g$ is
$\int\matter{\vect J}\cdot[(\nabla\nabla h)\nabla g - (\nabla\nabla g)\nabla h]\,\dd V$, where $\nabla\nabla h$ is the
table of second derivatives of $h$ (its Hessian, section 1.4). The octupolar pair is $h = (x^3 - 3xy^2)/3$ and
$g = (3x^2y - y^3)/3$. For a flow $\matter{\vect J} = \matter\rho\,\Omega\,(-y, x, 0)$ turning about the $z$ axis, show
that the integrand is $-4\matter\rho\,\Omega\,\varpi^4$, with $\varpi$ the distance from the axis. Use this to derive
the size $\tfrac{32}{35}(1 - 2^{-2/5})\,\matter M\Omega R^4$ of the hidden swirl's bracket, and check the number $0.221$.

::: solution
The gradients are $\nabla h = (x^2 - y^2, -2xy, 0)$ and $\nabla g = (2xy, x^2 - y^2, 0)$. Multiplying by the Hessians
gives $(\nabla\nabla h)\nabla g = 2\varpi^2(y, -x, 0)$ and $(\nabla\nabla g)\nabla h = -2\varpi^2(y, -x, 0)$, so the
bracket's vector is $4\varpi^2(y, -x, 0)$, and its product with $\matter{\vect J}$ is $-4\matter\rho\,\Omega\,\varpi^4$.
Over a uniform ball of radius $a$, $\int\varpi^4\,\dd V = 2\pi\int_0^ar^6\,\dd r\int_0^\pi\sin^5\vartheta\,\dd\vartheta
= \tfrac{32\pi}{105}a^7$. For a whole ball of radius $R$ turning one way the bracket has the size
$\tfrac{128\pi}{105}\matter\rho\,\Omega R^7 = \tfrac{32}{35}\matter M\Omega R^4$, with
$\matter M = \tfrac{4\pi}{3}\matter\rho R^3$. In the hidden swirl the inner ball gives $a^7/R^7$ of this with one sign,
and the shell $1 - a^7/R^7$ with the other, so the total is $1 - 2a^7/R^7$ of the uniform size. With $a = 2^{-1/5}R$,
$2a^7/R^7 = 2^{-2/5} = 0.758$, so the factor is $0.242$, and $\tfrac{32}{35} \times 0.242 = 0.221$.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), *The magnetic picture* and *What breaks the tie*: equations
  [](/paper/#eq:magnetic-point) and [](/paper/#eq:current-column), the spin dipole, the ball inside a shell at
  $2^{-1/5}R$, and Figure [](/paper/#fig:silent-flows).
- [Section XIII](/paper/#sec:second-order), *The flow*: equations [](/paper/#eq:flow-bracket) and
  [](/paper/#eq:hidden-spin), Figure [](/paper/#fig:hidden-flow), and Table [](/paper/#tab:null) (section
  [13.4](/tutorial/what-a-field-keeps/flows-inside/#octupolar-tides-read-the-hidden-swirl)).
:::

::: deeper
- G. Backus, "Poloidal and toroidal fields in geomagnetic field modeling", *Reviews of Geophysics* 24, 75 (1986): the
  split of a field with no divergence into a toroidal and a poloidal part, and when the two scalar functions are unique.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, Fig. [](/paper/#fig:silent-flows).

[^mp]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, equations [](/paper/#eq:magnetic-point) and
    [](/paper/#eq:current-column).

[^hs]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XIII, equation [](/paper/#eq:hidden-spin).

[^tab]: *The gravitational camera* (Mohsenvand 2026), Table [](/paper/#tab:null).

[^J]: The coloured $\matter{\vect J}$ is the mass flux; sections 1.6 and 1.7 used $\vect J$ for an impulse, and the
    plain $\vect J(\hat n)$ below is the current column.

[^A]: The letter $A$ is an area in section 2.6 and a design matrix in section 3.4; the bold $\field{\vect A}$ here is
    always the flow's potential.

[^quad]: The column is $\matter\rho\,\Omega\sin\theta\,(b - a)$, with $\sin\theta = 0.0500$ for the angle between the
    line of sight and the axis; a numerical integral along the line gives the same.

[^chi]: Section [4.1](/tutorial/response/oscillator/) uses $\chi$ for response functions; here it is the stream function only.

[^TP]: The letters $T$ and $P$ are not a temperature and a power here. $T$ is in $\mathrm{kg\,m^{-2}\,s^{-1}}$ and $P$
    in $\mathrm{kg\,m^{-1}\,s^{-1}}$.

[^ring]: Let $\vect U = (\chi/\varpi)\,\vect e_\varphi$, zero outside the body as $\chi$ is. Its curl is the poloidal flow,
    because its circulation round the circle through a point, $2\pi\varpi \times \chi/\varpi$, is the mass per second
    $2\pi\chi$ through the disc (Stokes's theorem). The first step of the proof gives $\field{\vect A} = \nabla\times\vect Y$,
    $\vect Y = \int\vect U/|\vect x - \vect y|\,\dd^3y$, with $\nabla^2\vect Y = -4\pi\vect U$ and $\nabla\cdot\vect Y = 0$, so
    $\nabla\times\field{\vect A} = 4\pi\vect U$, which is zero outside.

[^L]: Write $\vect U = \nabla\times\vect V$, so that $\matter{\vect J} = \nabla\times\vect U$. In components,
    $[\vect x\times\matter{\vect J}]_i = x_j\partial_iU_j - x_j\partial_jU_i$. Integrating by parts, the first term
    gives $-\int U_i\,\dd V$ and the second $+3\int U_i\,\dd V$, so
    $\vect L = 2\int\vect U\,\dd V$. One more integration by parts gives $\int\vect U\,\dd V = 0$,
    because $\vect V$ vanishes outside the body.
