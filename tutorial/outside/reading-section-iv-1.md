---
id: R2
title: 'The near-field image'
question: "What does a camera whose pixels read the tide see of a scene beside it, and what can a reading taken outside a body never tell it?"
part: '2'
requires: ['1.3', '1.4', '1.5', '1.6', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8']
paper: [sec:near-field, eq:tidal-brightness, eq:tidal-column, fig:sky-integral, eq:magnetic-point, eq:current-column, eq:split, eq:harmonic-point, fig:same-outside, fig:silent-flows, eq:evanescent, eq:array-data]
figures: [fig:sky-integral, fig:same-outside, fig:silent-flows]
live: [scene-locked-safe, same-outside]
---

Stand the camera in a room with a person, a steel ball with a gold nugget inside it, and a floor of concrete. Each pixel
reads the tide of every mass in view. What does this picture show of the scene, and what can it never show, however
good the pixels?[^near]

::: plain
Nothing blocks the tide, so walls hide nothing, and the tide's strength follows the mass, so the camera in effect
weighs what it sees. Yet many interiors pull exactly alike outside a body: the field outside fixes only the harmonic
part of the density, so the picture that assumes least shows every round body as uniform. Spin, heat and an applied
tide break the tie, but some flows stay silent whatever their speed. Fine detail also fades on its way to the camera.
:::

## A body's tidal brightness is its density times the cube of its angular size

No wall can hide a mass, because Gauss's law counts the mass inside a closed surface and has no term for what lies in
between ([section 1.3](/tutorial/newton/gauss-and-poisson/#the-flux-out-of-a-closed-surface-counts-the-mass-inside)).
For this reason gravity gradiometry, the measurement of the tide, has been proposed for imaging the contents of cargo
containers [@Kirkendall2007] and for finding objects under water [@WuTian2010]. The camera also weighs what it sees, because the stretch $2G\matter M/r^3$ beside a mass $\matter M$, in kilograms, at
the distance $r$, in metres, is in proportion to the mass
([section 1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)). Here
$\sym{gravitational-constant}{G} = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is Newton's constant.[^bright]

The **density** of a body is its mass per unit volume, and its **angular size** is its radius divided by its distance.
Take a body of mean density $\sym{mean-density}{\matter{\bar\rho}}$, in $\mathrm{kg\,m^{-3}}$, and radius $R$, at the
distance $r$. Its angular size is $\sym{angular-size}{\theta} = R/r$, a pure number, and the stretch it raises along
the line to it is

$$\frac{2G\matter M}{r^3} = \frac{8\pi G}{3}\,\matter{\bar\rho}\,\theta^3 .$$

The units check: $G\matter{\bar\rho}$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{kg\,m^{-3}} = \mathrm{s^{-2}}$.
Writing the mass of a ball as $\matter M = \tfrac43\pi R^3\matter{\bar\rho}$ turns the left side into the right. So of two bodies
of the same density, the one that looks twice as wide raises a tide $2^3 = 8$ times as strong.

The Moon, of mean density $3344\unit{kg\,m^{-3}}$ and angular size $4.52 \times 10^{-3}$, raises a stretch of
$1.73 \times 10^{-13}\unit{s^{-2}}$ at the Earth; the Sun, of $1408\unit{kg\,m^{-3}}$ and $4.65 \times 10^{-3}$,
$7.92 \times 10^{-14}\unit{s^{-2}}$. The Sun looks 3 per cent wider, which raises its tide by 9 per cent, but the
Moon is 2.38 times denser, so its tide is $2.38/1.09 = 2.18$ times the Sun's.

A person is a far brighter body. Section 1.4 treats a person of 70 kg as a ball of water, $1000\unit{kg\,m^{-3}}$, of
radius $0.2557\unit{m}$. At 1 m, $\theta = 0.2557$ and $\theta^3 = 0.0167$, and both sides of the equation give

$$\frac{2 \times 6.674 \times 10^{-11} \times 70}{1^3}\unit{s^{-2}} = 9.34 \times 10^{-9}\unit{s^{-2}}.$$

This is $9.34 \times 10^{-9}/1.73 \times 10^{-13} = 54{,}000$ times the Moon's stretch, so a person a metre away outweighs
the Moon in the camera's view some fifty thousand times.[^rod]

## The image is the tidal column, and a pixel reads only five of its numbers

The tide at a pixel is the sum of the tides of all the matter in view, grouped by direction. Here
$\sym{tidal-tensor}{\curv{\tE}}_{ij}$ is the tidal tensor, in $\mathrm{s^{-2}}$, $\sym{unit-vector}{\hat n}$ is a unit
vector from the pixel toward the matter, $\sym{solid-angle}{\dd\Omega}$ is a small patch of sky, in steradians, and
$\sym{density}{\matter\rho}$ is the density. Then

$$\begin{gathered}\curv{\tE}_{ij} = G \int \dd\Omega\,\bigl(\delta_{ij} - 3\,\hat n_i \hat n_j\bigr)\,S(\hat n),\\
S(\hat n) = \int \matter\rho(r\hat n)\,\frac{\dd r}{r} .\end{gathered}$$

The **tidal column** $S(\hat n)$ is the mass along the line of sight in the direction $\hat n$, each part weighted by one
over its distance, in $\mathrm{kg\,m^{-3}}$, so that $GS$ is in $\mathrm{s^{-2}}$
([section 1.5](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes)).[^column]

{{paper fig:sky-integral}}

In panel (a) the matter in a thin cone between $r$ and $r + \dd r$ has the volume $r^2\,\dd r\,\dd\Omega$ and a tide
that falls as $1/r^3$, so the $r^2$ cancels two of the three powers and leaves $\dd r/r$. Panel (b) colours the sky by
the weight $1 - 3\cos^2\vartheta$ of $\curv{\tE}_{zz}$, with $\vartheta$ the angle from the $z$ axis. It vanishes at
$\vartheta = 54.74°$ and averages to zero over the sky, so a uniform shell of matter around the camera is invisible.

The integral starts a short distance $r_{\min}$ from the camera, a quarter of a metre in the scenes of this book,
because matter at the camera itself would make $S$ diverge logarithmically. The tide stays finite, because the
trace-free weight averages the nearby matter away
([section 2.3](/tutorial/outside/multipoles/#at-the-cameras-own-place-the-tide-stays-finite-while-the-tidal-column-grows-without-limit)),
except that some entries off the diagonal grow logarithmically at a sharp edge or corner of a solid.

Each entry of the tidal weight is a pattern of degree two on the sky, so a single pixel reads the five coefficients of
degree two of $S$ and nothing else
([section 2.2](/tutorial/outside/spherical-harmonics/#a-pixel-reads-only-degree-two-of-its-sky)). An array measures
more, because the tide of degree three and higher changes across it
([section 2.3](/tutorial/outside/multipoles/#round-the-camera-distant-matter-makes-a-sum-of-growing-harmonics)).

## The magnetic picture images the current column, and its numbers can be checked before its formulas

Moving masses make the **magnetic part** of the tide, $\sym{magnetic-tide}{\curv{\tB}}_{ij}$, in
$\mathrm{s^{-2}}$, which twists gyroscopes instead of stretching rings.[^magnetic] We work to first order in $v/c$,
where $v$ is the speed of the mass and $c$ the speed of light, which is $5 \times 10^{-9}$ for a walker. A mass $\matter M$ in the direction $\hat n$ at the distance $r$, moving with the
velocity $\vect v$, gives

$$\curv{\tB}_{ij} = \frac{3G\matter M}{c\,r^{3}}\,\bigl[\hat n_i(\hat n\times\vect v)_j + \hat n_j(\hat n\times\vect v)_i\bigr],$$

as [section 7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)
derives. Its units check, because $G\matter M/cr^3$ is in $\mathrm{s^{-2}}$ divided by a speed. Grouping moving matter by
direction, as for the tidal column, gives

$$\begin{gathered}\curv{\tB}_{ij} = \frac{3G}{c}\int\dd\Omega\,\bigl[\hat n_i(\hat n\times\vect J)_j + \hat n_j(\hat n\times\vect J)_i\bigr],\\
\vect J(\hat n) = \int \matter\rho\,\vect v(r\hat n)\,\frac{\dd r}{r} .\end{gathered}$$

The **current column** $\sym{current-column}{\vect J(\hat n)}$ is the mass flux $\matter\rho\vect v$ along a line of
sight weighted by $\dd r/r$, in $\mathrm{kg\,m^{-2}\,s^{-1}}$
([section 2.8](/tutorial/outside/flows/#the-current-column-is-the-flow-along-a-line-of-sight-weighted-by-inverse-distance)).
Only motion across the line of sight counts, because $\hat n\times\vect J$ is zero for a vector along $\hat n$: the
magnetic channel is the opposite of a Doppler radar.

For a single moving mass, let $\vect w = \hat n\times\vect v$, of length $v_\perp$, the speed across the line of sight.
The bracket is the sum of the table $\hat n_iw_j$ and its transpose, each of length $v_\perp$, and the two stand at
right angles, because the sum of the products of their matching entries is

$$\sum_{ij}\hat n_iw_j\,\hat n_jw_i = (\hat n\cdot\vect w)^2 = 0 .$$

So the bracket has length $\sqrt2\,v_\perp$ and $|\curv{\tB}| = 3\sqrt2\,G\matter Mv_\perp/cr^3$, while the point-mass
tide $\mathrm{diag}(-2, 1, 1)\,G\matter M/r^3$ has $|\curv{\tE}| = \sqrt6\,G\matter M/r^3$. In Frobenius norms the ratio
is $3\sqrt2/\sqrt6 = \sqrt3$ times $v_\perp/c$. For a person walking past at $1.4\unit{m\,s^{-1}}$ it is

$$\frac{\sqrt3 \times 1.4\unit{m\,s^{-1}}}{2.998 \times 10^8\unit{m\,s^{-1}}} = 8.1 \times 10^{-9}.$$

One reading gives the line on which a body lies, along the stretch $-2G\matter M/r^3$, and this ratio gives the
sideways speed, which Part 9 makes exact at any speed.

Outside a spherical body spinning with angular momentum $\sym{angular-momentum}{\vect L}$, in
$\mathrm{kg\,m^2\,s^{-1}}$, the field is exactly that of a spin dipole, as Part 7 shows. Outside a round body whose
layers turn rigidly, the potential of the flow is $\vect L\times\vect x/2r^3$, which depends on nothing but $\vect L$
([section 2.8](/tutorial/outside/flows/#a-swirl-shows-through-its-angular-momentum-and-two-swirls-can-cancel)). The
moment of inertia measures how far the mass lies from the axis
([section 1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)), so motion
too can hide:

- A hollow shell and a solid ball of equal mass and size, spinning at the same rate, differ in $\curv{\tB}$ by their
  moments of inertia, $\tfrac23\matter MR^2$ and $\tfrac25\matter MR^2$, a factor $\tfrac53$. At equal angular momentum
  they are identical outside.
- A uniform ball of radius $a$ turning one way inside a shell of outer radius $R$ turning the other way has the moments
  of inertia $\tfrac{8\pi}{15}\matter\rho a^5$ and $\tfrac{8\pi}{15}\matter\rho(R^5 - a^5)$, which cancel at opposite
  rates when $a = 2^{-1/5}R = 0.871R$. Then $\vect L = 0$ and the field outside vanishes, although all of it moves.

## The field outside does not fix the tidal column, so the images are renderings of known scenes {#the-field-outside-does-not-fix-the-tidal-column-so-the-papers-images-are-renderings}

An array outside the matter it views does not measure $S$ itself.[^cannot] By the shell theorem a hollow shell and a
solid ball of the same mass pull alike everywhere outside
([section 1.3](/tutorial/newton/gauss-and-poisson/#outside-a-round-body-only-its-mass-counts)), and in general any
density $\matter{\delta\rho} = \nabla^2\field\psi/4\pi G$ can be added to a body without changing its field outside,
where $\sym{null-potential}{\field\psi}$, in $\mathrm{J\,kg^{-1}}$, is a smooth function that vanishes outside the body
together with its gradient, which we call **confined**
([section 2.5](/tutorial/outside/null-space/#a-confined-laplacian-added-to-a-body-changes-nothing-outside);
[@YurtseverMarzbanMeila2011]). Real matter makes such pairs, $\matter\rho_0 \pm \epsilon\,\matter{\delta\rho}$ with
$\epsilon$ a small pure number: the steel ball of section 2.5, of radius 10 cm and density
$\matter\rho_0 = 7850\unit{kg\,m^{-3}}$, with $\field\psi = A(1 - r^2/R^2)^2$ and $A = \pi GR^2\matter\rho_0/3$, stays
positive up to $\epsilon = 1$, where the balls reach $13{,}100$ and $15{,}700\unit{kg\,m^{-3}}$.

The two balls of a pair have different tidal columns but the same field outside, so the tidal column is a rendering of
a known scene and not a quantity the camera could reconstruct uniquely. The near-field images of this book show $S$
computed from the scene, then blurred by the blur law ([section 3.7](/tutorial/noise/blur-law/#what-the-law-means)).

::: try {#scene-locked-safe}
Predict first: the concrete floor of the room is mass too. Will it glow in the gravity view? Drag the divider to the
left edge for gravity, then drag the view to look round the safes and at the floor. Then decide a second question
before reading on: would a tidal camera standing on that floor read a uniform floor at all? The last section of this
chapter answers it.
:::

## The field outside fixes the harmonic part, and the least assuming picture never shows a core

In any bounded body every density splits in one way only into two parts,

$$\matter\rho = \sym{harmonic-part}{\matter\rho_h} + \frac{\nabla^2\field\psi}{4\pi G},$$

where $\matter\rho_h$ is the **harmonic part** of the density, whose Laplacian vanishes inside the body, and $\field\psi$
is confined.[^split] The two parts are orthogonal, which makes the split unique
([section 2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see)),
and together they make up every density [@Isakov1990]. For a body whose outside is connected,
the field outside fixes $\matter\rho_h$ completely. The reason is that the potential outside is built from the moments
$\int\matter\rho\,h\,\dd V$ against functions $h$ harmonic in the body
([section 2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments)), and the second part
has none of them, since $\int h\,\nabla^2\field\psi\,\dd V = \int \field\psi\,\nabla^2 h\,\dd V = 0$: Green's second
identity ([section 2.1](/tutorial/outside/laplace/#greens-identities-move-a-laplacian-from-one-function-to-the-other))
with no surface terms, and $\nabla^2h = 0$.

A **white prior** assumes, before any reading, that every point inside varies by the same amount, independently of the
others. Each reading is a moment against a harmonic $h$, its **kernel**, and an estimate linear in the data adds these
kernels with weights, so it is harmonic, as is the Wiener filter of
[section 3.5](/tutorial/noise/wiener-filter/#a-linear-guess-cannot-keep-mass-positive-and-with-a-white-prior-it-is-harmonic).
A harmonic function that is not constant takes its largest and smallest values only on the boundary
([section 2.1](/tutorial/outside/laplace/#in-empty-space-the-potential-has-no-peak-and-no-pit)). So the least
assuming picture, which takes the body's outline from light, has its densest and lightest points on the surface and
never shows a core. Every round body appears as a uniform ball of its mean density, because a harmonic function of
$r$ alone that is finite at the centre is a constant. For the Earth it is the mass over the volume of a ball of radius 6371 km:

$$\matter{\bar\rho} = \frac{5.972 \times 10^{24}\unit{kg}}{\tfrac43\pi\,(6.371 \times 10^6\unit{m})^3} = 5513\unit{kg\,m^{-3}},$$

so the layered Earth, seen from outside in this way, has $5513\unit{kg\,m^{-3}}$ throughout.

{{paper fig:same-outside}}

The figure shows three bodies with the same field outside. A steel ball of radius $R$ holds a gold nugget of mass
$\matter m$ at the distance $s$ from its centre, and the nugget's harmonic projection is

$$\matter\rho_h = \frac{\matter m}{4\pi R^3}\sum_{\ell=0}^{\infty}(2\ell+1)(2\ell+3)\,
\Bigl(\frac{s r}{R^2}\Bigr)^{\ell} P_\ell(\cos\vartheta) ,$$

where $P_\ell$ are the Legendre polynomials of section 2.2 and $\vartheta$ is the angle from the nugget's direction
([section 2.5](/tutorial/outside/null-space/#the-harmonic-part-of-a-nugget-is-a-flush-on-the-near-wall)). With
$t = sr/R^2$ the sum has the closed form $(3 - 10t^2 + 8t^3\cos\vartheta - t^4)/(1 - 2t\cos\vartheta + t^2)^{5/2}$.
For $s = R/2$ the body is a **flush**, densest on the wall nearest the nugget, where $t = \tfrac12$. At the near wall
$\cos\vartheta = 1$, the denominator is $(1 - t)^5$ and the numerator factors as

$$3 - 10t^2 + 8t^3 - t^4 = (1 - t)^2\,(3 + 6t - t^2) ,$$

so the closed form is $(3 + 6t - t^2)/(1 - t)^3 = 5.75/0.125 = 46$ in units of $\matter m/4\pi R^3$. The nugget's mass
spread evenly would be $3\,\matter m/4\pi R^3$, so the flush is $46/3 = 15.3$ times as dense there. At the far wall,
$\cos\vartheta = -1$, the same factoring with $-t$ in place of $t$ gives $(3 - 6t - t^2)/(1 + t)^3 = -0.25/3.375
= -\tfrac{2}{27}$, which dips below zero, so that only the steel keeps it a real density. <!-- lint-allow: just -->

Poincaré's balayage sweeps the same mass onto the surface as a skin of surface density
$\matter m(R^2 - s^2)/4\pi R\,|\vect x - \vect s|^3$
([section 2.4](/tutorial/outside/greens-functions/#on-a-sphere-kelvins-image-gives-the-potential-inside-and-the-skin-of-balayage)).
Over the nugget $|\vect x - \vect s| = R/2$, so the skin has $\tfrac34R^2/(R \times \tfrac18R^3) = 6/R^2$ times
$\matter m/4\pi$, six times the nugget's mass spread evenly over the surface; opposite the nugget it has
$0.22\,\matter m/4\pi R^2$.

All three have the moment $\matter m\,h(\vect s)$ against every harmonic $h$
([section 2.5](/tutorial/outside/null-space/#the-nugget-the-flush-and-the-skin-differ-only-in-what-the-outside-cannot-read)),
so at any sensitivity a camera outside cannot tell them apart by their steady pull.

## Spin, heat and a pixel inside break the tie, and rolls stay silent

The three bodies[^tie] differ in the first number that the field outside cannot carry, $\int\matter\rho\,r^2\,\dd V$, the
trace of the second moment of the mass. For the nugget, the flush and the skin it is

$$\matter ms^2 = 0.25\,\matter mR^2, \qquad \tfrac35\,\matter mR^2 = 0.6\,\matter mR^2, \qquad \matter mR^2 .$$

The flush's value does not depend on $s$, because only its term of degree zero, the gold spread evenly, survives the
integral over directions. Since $\nabla^2r^2 = 6$, the function $r^2$ is not harmonic, so the field outside carries no
trace of this integral. The moment of inertia contains it: section 1.6 wrote the squared distance from the $x$ axis as
$r^2 - x^2$, and splitting it gives
$I_x = \tfrac23\int\matter\rho\,r^2\,\dd V + \int\matter\rho\,(r^2/3 - x^2)\,\dd V$, whose second integrand is harmonic
because $\nabla^2(r^2/3) = 2 = \nabla^2x^2$. That share is the same for all three bodies. With the nugget on the $z$
axis it is $\matter ms^2/3 = 0.083\,\matter mR^2$, and the gold's shares of the moment of inertia are

$$\begin{aligned}\text{nugget:}&\quad \tfrac23 \times 0.25 + 0.083 = 0.25,\\ \text{flush:}&\quad \tfrac23 \times 0.6 + 0.083 = 0.483,\\ \text{skin:}&\quad \tfrac23 \times 1 + 0.083 = 0.75,\end{aligned}$$

in units of $\matter mR^2$. Spun at the same rate, the three carry angular momenta, and so spin dipoles, in this ratio.

::: try {#same-outside}
Choose *Gold off centre* and set A to the nugget and B to the flush. Predict first: as the nugget moves toward the
wall, does the flush's share of the moment of inertia change, and does it grow faster or slower than the nugget's?
Move the slider outward and read the row *Its share of the moment of inertia*; then make B the skin and move it again.
Compare how much each share has grown, and find where the nugget's share passes the flush's. Then answer the figure's
own two predictions.
:::

For a round body whose layers turn rigidly the magnetic field shows only
$\vect L = \tfrac23\Omega\int\matter\rho\,r^2\,\dd V$; for other shapes it holds $\int\matter\rho\,r^2 h\,\dd V$ for every
harmonic $h$, of which the moment of inertia is the first. Heat breaks the tie: the trembling of a warm
body, seen through its pull, and its response to a brief applied tide show how its mass is arranged
([section 4.6](/tutorial/response/fluctuation-dissipation/)). The thermal glow sums along lines instead of reaching
out as a potential, so it would show the nugget as a spot, the flush as a gradient and the skin as a ring
([section 5.6](/tutorial/waves/abel-transform/)), but it measures friction and temperature, not mass.

A pixel inside the matter escapes the ambiguity altogether, because there $\mathrm{tr}\,\curv{\tE} = 4\pi G\matter\rho$
reads the density where the pixel is
([section 1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point)). Inside steel the
trace is $6.6 \times 10^{-6}\unit{s^{-2}}$, 700 times the person's stretch at a metre.

Flows have a blind spot of the same kind. Suppose the flow is $\matter\rho\vect v = \nabla\times\nabla\times\vect V$,
where $\vect V$ is a vector field inside the body, in $\mathrm{kg\,s^{-1}}$, that vanishes together with its
derivatives at the surface. Its potential $\sym{roll-potential}{\vect W} = \int\vect V\,\dd V'/|\vect x - \vect x'|$, in
$\mathrm{kg\,m^2\,s^{-1}}$, makes the potential of the flow $\nabla(\nabla\cdot\vect W) - \nabla^2\vect W$ by two
integrations by parts. The second term is $4\pi\vect V$, zero outside, and a gradient has no curl, so
$\curv{\tB} = 0$ outside
([section 2.8](/tutorial/outside/flows/#rolls-are-silent-outside-because-their-potential-there-is-a-gradient)).

A confined flow that is the same all round an axis and turns in its **meridian planes**, which contain the axis, is of
this form in a body without a hole through it. Such **rolls** occur in the simplest convection inside a star or a
planet's core
([section 2.8](/tutorial/outside/flows/#every-steady-flow-round-an-axis-is-a-swirl-plus-rolls)). They are silent
outside however fast they run, to first order in $v/c$; of the flow only the **swirl** about the axis shows, and only
through its harmonic part.

{{paper fig:silent-flows}}

In a numerical integration the rolls' field stays below $10^{-4}$ of the swirl's; the exact value is zero
([section 2.8](/tutorial/outside/flows/#rolls-are-silent-outside-because-their-potential-there-is-a-gradient)).

## Three channels together weigh the Earth's core

The glow gives the radius of the core, $3480\unit{km}$, from the kinks in its brightness: a line of sight from the
ground that grazes the core makes the angle $\arcsin(3480/6371) = 33.1°$ with the direction straight down, and the
glow's brightness changes its slope at that angle ([section 5.6](/tutorial/waves/abel-transform/)). The electric part
gives the mass, by Gauss's law. The magnetic part gives the moment of inertia, $0.331\,\matter MR^2$, the measured
0.3307 rounded, from the Preliminary Reference Earth Model [@DziewonskiAnderson1981].

A two-layer Earth with that core, mass and moment of inertia follows from the two conditions of section 1.6. With
$q = 3480/6371 = 0.546$, $q^3 = 0.163$ and $q^5 = 0.0486$,

$$\begin{aligned}
\matter\rho_{\rm c}\,q^3 + \matter\rho_{\rm m}\,(1 - q^3) &= 5513\unit{kg\,m^{-3}},\\
\matter\rho_{\rm c}\,q^5 + \matter\rho_{\rm m}\,(1 - q^5) &= \frac{0.3307}{0.4} \times 5513\unit{kg\,m^{-3}} .
\end{aligned}$$

Here $\matter\rho_{\rm c}$ and $\matter\rho_{\rm m}$ are the densities of the core and the mantle; the lines are the
mass and the moment of inertia against a uniform ball's $0.4\,\matter MR^2$. They give
$\matter\rho_{\rm c} = 12{,}505$ and $\matter\rho_{\rm m} = 4152\unit{kg\,m^{-3}}$, which the rounded densities
$12{,}500$ and $4150$ reproduce as $5511\unit{kg\,m^{-3}}$ and $0.3307$. The reference model's core averages
$11{,}000\unit{kg\,m^{-3}}$, from earthquake waves; the difference is the compression of the deep mantle, which two
measured numbers cannot resolve.

## Fine detail fades as the exponential of the depth, and a uniform sheet has no tide

A pattern that repeats across the line of sight with **wavenumber** $\sym{wavenumber}{k}$, $2\pi$ divided by the
distance between its crests, in $\mathrm{m^{-1}}$
([section 2.6](/tutorial/outside/fourier/#across-a-plane-a-ripples-wavevector-points-across-its-crests)), fades with
height $h$ above the pattern as

$$\field\Phi \propto \cos(kx)\,e^{-kh},$$

because a ripple must curve along the height as much as along the plane, and the only such solution that does not grow
far away is $e^{-kh}$
([section 2.7](/tutorial/outside/evanescent/#in-empty-space-a-ripple-can-only-fade)).[^fade] A ripple whose crests are
10 cm apart has $k = 2\pi/0.1\unit{m} = 62.8\unit{m^{-1}}$ and weakens by $e^{kh}$. At 10 cm the factor is
$e^{2\pi} = 535$, so the ripple arrives about 500 times weaker; at 20 cm it is $e^{4\pi} = 2.87 \times 10^5$, about
300,000 times weaker.

To reconstruct the scene the camera must multiply each pattern by $e^{kz}$, where $z$ is the depth of the pattern below
the sensor, and its noise with it. If the largest features stand
$\sym{snr}{\SNR}$ times above their noise, a pattern is lost once $e^{kz} > \SNR$, that is, once $kz > \ln\SNR$. Half
the spacing of the finest crests kept is

$$\frac{\pi}{k_{\max}} = \frac{\pi z}{\ln\SNR} ,$$

an angle of $\pi/\ln\SNR$ radians as seen from the sensor, the same at every distance. At $\SNR = 10^3$ it is $0.455$
radians, or 26.1°; at $10^6$ it is 13.0°. The exact law of section 3.7 keeps factors that this estimate drops, and
gives 24° and 14°.

A flat array at the distance $z$ from a sheet of **surface density** $\sym{surface-density}{\matter\sigma}$, in
$\mathrm{kg\,m^{-2}}$, records $d = -\curv{\tE}_{zz}$, the tide along its normal with the sign changed so that a mass
below gives a positive bump. In Fourier space across the array the data are

$$\tilde d(\vect k) = 2\pi G\,k\,e^{-kz}\,\tilde{\matter\sigma}(\vect k) + \tilde n(\vect k),$$

where the tilde marks the Fourier transform across the plane and $\tilde n$ is the noise. Each ripple of the sheet has
the potential $-2\pi G\tilde{\matter\sigma}e^{-kh}/k$, and two derivatives along the height bring down $k^2$
([section 2.7](/tutorial/outside/evanescent/#the-camera-records-a-tide-which-weights-each-ripple-by-k)).

The factor $k$ says that a uniform sheet, whose density is all in the ripple $k = 0$, is invisible
([section 2.7](/tutorial/outside/evanescent/#only-the-uniform-part-of-a-layer-is-lost-and-the-factor-k-is-the-reason)).
An endless sheet pulls with $2\pi G\matter\sigma$ at every height, and a pull that does not change from point to
point has no tide. The locked safe's floor, 0.3 m of concrete at $2400\unit{kg\,m^{-3}}$, or
$720\unit{kg\,m^{-2}}$, treated as endless, pulls with

$$2\pi \times 6.674 \times 10^{-11} \times 720\unit{m\,s^{-2}} = 3.0 \times 10^{-7}\unit{m\,s^{-2}},$$

which a gravimeter reads at once and a tidal camera not at all. So the view draws the floor, but a tidal camera reads
only its edges and unevenness.

**The idea to keep: a near-field image weighs what it sees, through any wall, with a brightness set by density and
angular size; but the field outside a body fixes only the harmonic part of its density and the swirl of its flows, so
the least assuming picture puts its extremes on the surface, and spin, heat, an applied tide and the glow must break
the tie.**

::: problems
### Practice

**[2.5]** Why can a camera outside the matter never reconstruct the tidal column $S$?

::: solution
A confined Laplacian can be added to a body without changing the field outside, so bodies with different tidal
columns give the same readings.
:::

**[2.5]** Of the nugget, its flush and its skin, which has the largest moment of inertia about an axis across the line
to the nugget, and why does that not show in the pull?

::: solution
The skin, $0.75\,\matter mR^2$, against 0.483 and $0.25\,\matter mR^2$. The moment of inertia contains
$\int\matter\rho\,r^2\,\dd V$, and $r^2$ is not harmonic, so the field outside does not carry it.
:::

**[2.5]** Rerun the comparison of the nugget, the flush and the skin for a nugget at $s = 0.7R$. Find the three bodies'
$\int\matter\rho\,r^2\,\dd V$ and the gold's shares of the moment of inertia about an axis across the line to the
nugget. Do the shares still come in the order nugget, flush, skin? How far out must the nugget be for its share to pass
the flush's?

::: solution
The integrals are $0.49$, $0.6$ and $1$ in units of $\matter mR^2$. The shared harmonic part is
$\matter ms^2/3 = 0.163\,\matter mR^2$, so the shares are $\tfrac23 \times 0.49 + 0.163 = 0.49$, $\tfrac23 \times 0.6 + 0.163 = 0.563$ and
$\tfrac23 \times 1 + 0.163 = 0.830\,\matter mR^2$, in the same order as before. The nugget's share is $\matter ms^2$
and the flush's is $0.4\,\matter mR^2 + \matter ms^2/3$, so the nugget's passes the flush's when
$\tfrac23 s^2 = 0.4R^2$, at $s = \sqrt{0.6}\,R = 0.775R$.
:::

### Stretch

**[2.3, 2.5]** A camera on the ground could, in principle, read every moment $\matter Q_{\ell m}$ of the Earth against
the solid harmonics $r^\ell Y_{\ell m}$. Explain why even all of them, read without noise, cannot give the radius of
the core of a round Earth, and name the channel that does.

::: solution
For a round Earth every moment with $\ell \ge 1$ integrates a pattern of degree $\ell$ over directions, which gives
zero, and the moment with $\ell = 0$ is the mass. So every round Earth of the same mass has the same field outside, and
the radius of the core lies in the null space. The glow gives it from the kinks in its brightness
([section 5.6](/tutorial/waves/abel-transform/)).
:::

### The camera

**[2.5]** Find the flush's density at the near and far walls for $s = 0.7R$.

::: solution
With $t = 0.7$ the near wall has $(3 + 6t - t^2)/(1 - t)^3 = 6.71/0.027 = 248$ and the far wall has
$(3 - 6t - t^2)/(1 + t)^3 = -1.69/4.913 = -0.34$, in units of $\matter m/4\pi R^3$.
:::
:::

::: paper
- [Section IV](/paper/#sec:near-field), its plain words to the second limit.
- [*How bright*](/paper/#par:how-bright) and [*What the image is*](/paper/#par:what-the-image-is): equations
  [](/paper/#eq:tidal-brightness) and [](/paper/#eq:tidal-column), Figure [](/paper/#fig:sky-integral).
- [*The magnetic picture*](/paper/#par:the-magnetic-picture): equations [](/paper/#eq:magnetic-point) and
  [](/paper/#eq:current-column); equation [](/paper/#eq:star-velocity) of [Section VIII](/paper/#sec:one-pixel).
- [*What the image cannot show*](/paper/#par:what-the-image-cannot-show) and
  [*What the image does show*](/paper/#par:what-the-image-does-show): equations [](/paper/#eq:split) and
  [](/paper/#eq:harmonic-point), Figures [](/paper/#fig:same-outside) and [](/paper/#fig:locked-safe).
- [*What breaks the tie*](/paper/#par:what-breaks-the-tie): Figure [](/paper/#fig:silent-flows) and the two-layer Earth.
- [*How sharp*](/paper/#par:how-sharp), its first paragraph and the first sentences after equation
  [](/paper/#eq:array-data).
:::

::: deeper
- The [GR course, section 17.7](https://neovand.github.io/general-relativity/chapter-17.html#17-7-rotation-kerr-frame-dragging-and-carefully-qualified-no-hair-claims)
  treats frame dragging, the relativistic form of the magnetic picture.
- Adam Dziewonski and Don Anderson, "Preliminary reference Earth model", *Physics of the Earth and Planetary Interiors*
  25 (1981): the Earth's density by depth, which the two-layer model compresses into two numbers.
:::

[^near]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. IV](/paper/#sec:near-field).

[^bright]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in [*How bright*](/paper/#par:how-bright), as its equation [](/paper/#eq:tidal-brightness).

[^rod]: As an upright rod 1.7 m long ([section 2.3](/tutorial/outside/multipoles/#a-body-that-is-not-round-has-a-tide-that-the-ball-model-misses))
    the person gives $5.63 \times 10^{-9}\unit{s^{-2}}$ at a metre, 0.60 of the ball's and about 33,000 times the Moon's.

[^column]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in [*What the image is*](/paper/#par:what-the-image-is), as its equation [](/paper/#eq:tidal-column).

[^magnetic]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in [*The magnetic picture*](/paper/#par:the-magnetic-picture), as its equations [](/paper/#eq:magnetic-point) and
    [](/paper/#eq:current-column). Equation [](/paper/#eq:star-velocity) of [Sec. VIII](/paper/#sec:one-pixel) gives
    the exact sideways speed.

[^cannot]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in [*What the image cannot show*](/paper/#par:what-the-image-cannot-show).

[^split]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in [*What the image does show*](/paper/#par:what-the-image-does-show), as its equations [](/paper/#eq:split) and
    [](/paper/#eq:harmonic-point).

[^tie]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in [*What breaks the tie*](/paper/#par:what-breaks-the-tie).

[^fade]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, in [*How sharp*](/paper/#par:how-sharp), as its equations [](/paper/#eq:evanescent) and [](/paper/#eq:array-data).
