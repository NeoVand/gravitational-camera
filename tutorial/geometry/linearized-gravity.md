---
id: '7.4'
title: 'Linearized gravity and gauge'
question: 'The paper says that for a camera "we need only the linear theory, and the stress and motion of the matter in view". How does a weak field obey a wave equation whose source is the energy, momentum and stress of matter, and why does nothing a pixel reads depend on the choice of coordinates?'
part: '7'
requires: ['1.3', '6.2', '6.5', '7.1', '7.2', '7.3']
paper: [sec:introduction, sec:pixel, eq:wave, sec:waves, eq:wave-zone, sec:vistas, eq:multipole, fig:binary-field, sec:one-pixel]
figures: []
live: []
depth: A
---

The paper's [Section I](/paper/#sec:introduction) says that every form of matter and energy produces gravity "in
proportion to its energy (and, for fast motion and for light, its momentum and stress too)". It then says that the
weakness of gravity makes a camera easy to reason about: "we need only the linear theory, and the stress and motion of
the matter in view". Chapter
[5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source) stated the linear
theory's equation for the waves, $\Box\field{\bar h}_{ij} = -16\pi G\matter T_{ij}/c^4$, and left its derivation to this
chapter.

So we ask how a weak field obeys a wave equation whose source is the energy, momentum and stress of matter, and why
nothing a pixel reads depends on the choice of coordinates. The answer is that a change of coordinates alters the
metric but not the curvature, and that a good choice of coordinates turns Einstein's equation into one wave equation
for each entry of the metric.

::: plain
Where gravity is weak, spacetime is almost flat. The metric, the table that turns coordinates into what clocks and
rulers read, is then the flat table plus a small correction. The correction is a table of ten small numbers at each
place and time.

The coordinates are labels, and we may relabel the events a little. Relabelling changes the small table, but it does not
change the curvature, which is what free balls and a pixel feel. A ripple of labels can look like a wave on paper while
every ball stays where it was.

We also rewrite the small table in a second form, the trace-reversed table h̄, which shifts its diagonal entries and
keeps the others. With well-chosen labels, Einstein's equation becomes ten copies of the wave equation. Each entry of
the trace-reversed table h̄ is made by one entry of the energy, momentum and stress of matter, and its changes travel
outward at the speed of light. For slow matter the energy entry gives Newton's potential twice, once in the clocks and
once in the rulers, and the momentum entry gives a much smaller field of the matter's flow.
:::

## A weak field is a small table laid on flat spacetime

We want the simplest form of Einstein's theory that still holds every scene of the paper. We assume that **the field is
weak**: there are coordinates in which

$$\field g_{\mu\nu} = \sym{minkowski-metric}{\field\eta}_{\mu\nu} + \sym{metric-perturbation}{\field h}_{\mu\nu} ,
\qquad |\field h_{\mu\nu}| \ll 1 ,$$

where $\field g_{\mu\nu}$ is chapter 7.1's metric, $\field\eta_{\mu\nu}$ the Minkowski metric of chapter
[6.2](/tutorial/relativity/spacetime-vectors/#the-minkowski-metric-measures-the-interval-with-one-minus-sign-for-time),
and $\field h_{\mu\nu}$ the **metric perturbation** of chapter
[7.1](/tutorial/geometry/metric/#free-fall-is-the-path-along-which-a-clock-ages-most), a symmetric table of ten small
pure numbers. The **linear theory** keeps every quantity to first order in $\field h_{\mu\nu}$ and drops every product
of two of its entries or their derivatives.[^letters]

**The small parameter.** Near a body of mass $\matter M$ at the distance $r$, $|\field h_{00}| = 2G\matter M/rc^2$
(chapter 7.1). It is $1.0\times10^{-25}$ a metre from the paper's person of 70 kg. In the waves that LIGO detects the
entries are about $10^{-21}$. The two black holes of the paper's Figure [](/paper/#fig:binary-field) hold sixty solar
masses in all, and at their separation $d = 2200\unit{km}$ the field of the whole mass is $2G\matter M/dc^2 = 0.08$.

**The first neglected term** is a product of two entries, so its size relative to the kept one is about the entry
itself: $10^{-25}$ beside the person, and 8 per cent at the scale of the black holes' orbit. The linear theory fails
where $2G\matter M/rc^2$ approaches 1, near a horizon (chapter 11.1) and in the last orbits of a merger. That is why the
caption of the paper's figure calls its linear solution for the pair "a guide to the full solution, not a substitute for
it".

**Raising and lowering.** We raise and lower indices with $\field\eta_{\mu\nu}$ instead of $\field g_{\mu\nu}$, because
the difference is a product of $\field h_{\mu\nu}$ with the quantity itself and is dropped. So, as in chapter
[6.2](/tutorial/relativity/spacetime-vectors/#lowering-an-index-changes-only-the-sign-of-time), each index 0 that is
raised or lowered changes the sign, and a spatial index changes nothing: $\field h^0{}_0 = -\field h_{00}$ and
$\matter T_{0i} = -\matter T^{0i}$.

## Relabelling the coordinates changes the table, not the curvature

We want to know what a small change of coordinates does to $\field h_{\mu\nu}$. Take new coordinates

$$x'^\mu = x^\mu + \zeta^\mu(x) ,$$

where the **gauge shift** $\sym{gauge-shift}{\zeta}^\mu$, in metres, is a set of four functions whose derivatives
$\partial_\alpha\zeta^\mu$ are as small as the entries of $\field h_{\mu\nu}$. Chapter
[7.1](/tutorial/geometry/metric/#falling-removes-the-fields-first-derivatives-at-a-point-but-not-its-second) found how
the metric changes:

$$\field g'_{\alpha\beta}(x') = \frac{\partial x^\mu}{\partial x'^\alpha}\frac{\partial x^\nu}{\partial
x'^\beta}\,\field g_{\mu\nu}(x) .$$

Since $x^\mu = x'^\mu - \zeta^\mu$, each factor $\partial x^\mu/\partial x'^\alpha$ is $\delta^\mu{}_\alpha -
\partial_\alpha\zeta^\mu$ to first order, where $\delta^\mu{}_\alpha$ is 1 when $\mu = \alpha$ and 0 otherwise.[^order]
We multiply out, keep the terms of first order, and lower the index of $\zeta$ with $\field\eta$, $\zeta_\beta =
\field\eta_{\beta\mu}\zeta^\mu$:

$$\field g'_{\alpha\beta} = \field g_{\alpha\beta} - \partial_\alpha\zeta_\beta - \partial_\beta\zeta_\alpha .$$

The flat part $\field\eta_{\alpha\beta}$ is the same on both sides, so

$$\boxed{\;\field h'_{\mu\nu} = \field h_{\mu\nu} - \partial_\mu\zeta_\nu - \partial_\nu\zeta_\mu .\;}
\label{eq:gauge}$$

We put this change into chapter
[7.2](/tutorial/geometry/curvature-and-tides/#to-first-order-the-curvature-is-made-of-second-derivatives-of-the-metric)'s
linearized curvature,

$$\begin{aligned}\curv R_{\alpha\beta\gamma\delta} = \tfrac12\bigl(&\partial_\beta\partial_\gamma\field h_{\alpha\delta}
+ \partial_\alpha\partial_\delta\field h_{\beta\gamma}\\ &- \partial_\alpha\partial_\gamma\field h_{\beta\delta} -
\partial_\beta\partial_\delta\field h_{\alpha\gamma}\bigr) .\end{aligned}$$

Each of its four terms gives two terms with three derivatives of $\zeta$, eight in all. We call the change of the
curvature $\Delta\curv R_{\alpha\beta\gamma\delta}$ and group the eight terms by the component of $\zeta$ that they
hold:

$$\begin{aligned}2\,\Delta\curv R_{\alpha\beta\gamma\delta} &= (\partial_\alpha\partial_\gamma\partial_\beta -
\partial_\beta\partial_\gamma\partial_\alpha)\zeta_\delta\\ &\quad + (\partial_\beta\partial_\delta\partial_\gamma -
\partial_\beta\partial_\gamma\partial_\delta)\zeta_\alpha\\ &\quad + (\partial_\beta\partial_\delta\partial_\alpha -
\partial_\alpha\partial_\delta\partial_\beta)\zeta_\gamma\\ &\quad + (\partial_\alpha\partial_\gamma\partial_\delta -
\partial_\alpha\partial_\delta\partial_\gamma)\zeta_\beta .\end{aligned}$$

Partial derivatives commute, so each bracket is zero, and

$$\boxed{\;\curv R_{\alpha\beta\gamma\delta}[\field h'_{\mu\nu}] = \curv R_{\alpha\beta\gamma\delta}[\field h_{\mu\nu}] .\;}$$

The freedom to change $\field h_{\mu\nu}$ by [](#eq:gauge) is called **gauge freedom**, the change is a **gauge
transformation**, and a choice of coordinates within the freedom is a **gauge**. Since $\zeta^\mu$ is four functions, a
gauge transformation can change four combinations of the ten entries of $\field h_{\mu\nu}$ at will.

**A wave that is not there.** Start in flat spacetime, $\field h_{\mu\nu} = 0$, and take $\zeta_x = \epsilon\cos(kx -
\omega t)$, with the other three components zero. With $\partial_0 = c^{-1}\partial_t$, [](#eq:gauge) gives

$$\begin{aligned}\field h'_{xx} &= 2\epsilon k\sin(kx - \omega t) ,\\ \field h'_{0x} &= -\frac{\epsilon\omega}{c}\sin(kx -
\omega t) .\end{aligned}$$

On paper this is a wave that travels along $x$ at the speed $\omega/k$, and that speed can be anything. With $\epsilon =
1\unit{mm}$ and $k = 1\unit{m^{-1}}$ the entry $\field h'_{xx}$ reaches $2\times10^{-3}$, $2\times10^{18}$ times LIGO's
waves. Yet its curvature is zero, because it came from $\field h_{\mu\nu} = 0$. A free ball at rest at $x$ carries the
new label $x + \epsilon\cos(kx - \omega t)$, so the labels of the balls ripple, but the distances between them, measured
with the metric, never change. A table of this kind, $\field h_{\mu\nu} = -\partial_\mu\zeta_\nu -
\partial_\nu\zeta_\mu$, is called **pure gauge**.

**What it means.** A pixel reads the tide $\curv\tE_{ij} = c^2\curv R_{0i0j}$ (chapter 7.2), a piece of the curvature,
so no change of coordinates can alter its reading. Every result of the paper is a statement about curvature.

<!-- diagram: tut-gauge-or-wave — Two panels side by side, each about 340 × 300 px at 1440 (stacked on a phone). Each
shows a square grid of 7 × 7 free balls (small filled dots in the observer colour) over thin grey coordinate lines.
Left, "pure gauge": the coordinate lines ripple along x as a sine wave of exaggerated amplitude (vertical lines bunched
and spread), while every ball keeps its place on an even square lattice, so the balls now sit off the rippled lines;
beside it the note "labels move, balls do not: curvature 0". Right, "a real wave" (a plus-polarized wave travelling out
of the page): the coordinate lines are straight and even, and the balls are displaced from them, the lattice stretched
along x (orange tint on the balls at the two ends of each row) and squeezed along y (blue tint at the ends of each
column), exaggerated; beside it "separations change: curvature ≠ 0". One small double-headed ink arrow between two
neighbouring balls in each panel, labelled "proper separation", unchanged on the left and longer on the right. Labels
beside the geometry, never on a line. Caption: "Look first at the balls against the lines. On the left a change of
coordinates ripples the labels, and the balls keep their separations; on the right a gravitational wave changes the
separations themselves. Only the right panel has curvature. Amplitudes are exaggerated." -->

## Trace reversal and harmonic gauge tidy the equation

We want a form of the table in which Einstein's equation is simple, and a use for the four free functions. The **trace**
of $\field h_{\mu\nu}$ is the pure number

$$\sym{perturbation-trace}{\field h^\alpha{}_\alpha} = \field\eta^{\alpha\beta}\field h_{\alpha\beta} = -\field h_{00} +
\field h_{11} + \field h_{22} + \field h_{33} .$$

The **trace-reversed perturbation** is

$$\sym{trace-reversed-perturbation}{\field{\bar h}}_{\mu\nu} = \field h_{\mu\nu} - \tfrac12\field\eta_{\mu\nu}\field
h^\alpha{}_\alpha .$$

Since $\field\eta^{\mu\nu}\field\eta_{\mu\nu} = 4$, its trace is $\field h^\alpha{}_\alpha - 2\field h^\alpha{}_\alpha =
-\field h^\alpha{}_\alpha$, the trace of $\field h_{\mu\nu}$ with its sign reversed. So reversing twice returns the
table we started from: $\field h_{\mu\nu} = \field{\bar h}_{\mu\nu} - \tfrac12\field\eta_{\mu\nu}\field{\bar
h}^\alpha{}_\alpha$. The bar marks the reversal, not an average.

The **harmonic gauge**, also called the Lorenz gauge,[^lorenz] is the choice of coordinates in which

$$\partial^\mu\field{\bar h}_{\mu\nu} = 0 ,$$

four conditions, one for each $\nu$. It can always be reached. We need chapter
[6.2](/tutorial/relativity/spacetime-vectors/#the-gradient-is-a-lower-index-vector-and-the-wave-operator-is-its-square)'s
wave operator $\sym{wave-operator}{\Box} = \partial^\mu\partial_\mu = -c^{-2}\partial_t^2 + \nabla^2$ and its rule
$\field\eta_{\mu\nu}\partial^\mu = \partial_\nu$, which lowers the index of a derivative. Under [](#eq:gauge) the trace
changes by $-2\partial^\alpha\zeta_\alpha$, so $\field{\bar h}_{\mu\nu}$ changes by $-\partial_\mu\zeta_\nu -
\partial_\nu\zeta_\mu + \field\eta_{\mu\nu}\partial^\alpha\zeta_\alpha$, and its divergence by

$$\begin{aligned}\partial^\mu\bigl(&-\partial_\mu\zeta_\nu - \partial_\nu\zeta_\mu +
\field\eta_{\mu\nu}\partial^\alpha\zeta_\alpha\bigr)\\ &= -\Box\zeta_\nu - \partial_\nu\partial^\mu\zeta_\mu +
\partial_\nu\partial^\alpha\zeta_\alpha .\end{aligned}$$

The first term is $-\Box\zeta_\nu$, and in the third $\field\eta_{\mu\nu}\partial^\mu = \partial_\nu$. The last two are
then the same sum, with the summed index named differently, and cancel. So from any $\field h_{\mu\nu}$ we reach
harmonic gauge by choosing $\zeta$ with

$$\Box\zeta_\nu = \partial^\mu\field{\bar h}_{\mu\nu} ,$$

a wave equation with a known source, one for each $\nu$.

::: gap
That this equation has a solution is chapter
[5.2](/tutorial/waves/retarded-waves/#a-source-sends-its-news-outward-at-the-speed-of-the-wave)'s result. Its **retarded
solution** adds up the source over space, each piece divided by $4\pi$ times its distance and taken at the earlier time
when a wave leaving it would arrive. It exists for any source that is not too large far away, which this box does not
make precise. Any $\zeta$ with $\Box\zeta_\nu = 0$ can be added without spoiling the gauge, so the solution is not
unique; chapter 7.6 uses that leftover freedom to simplify a wave.
:::

## In harmonic gauge Einstein's equation is a wave equation for each component

We want Einstein's equation for a weak field. Chapter
[7.3](/tutorial/geometry/einstein-equation/#the-ten-equations-are-not-ten-laws-of-motion) found that four of its ten
equations are constraints, and that its curvature side has zero divergence by the contracted Bianchi identity. Because
of that identity the equations cannot fix four functions, the choice of coordinates (stated without proof), and harmonic
gauge now fixes that choice.

**Step 1: the linearized Ricci tensor.** Chapter
[7.3](/tutorial/geometry/einstein-equation/#the-trace-of-the-tide-is-the-ricci-curvature-along-the-observers-time)'s
**Ricci tensor**, the Riemann tensor summed over its first and third indices, is $\sym{ricci-tensor}{\curv R}_{\mu\nu} =
\curv R^\alpha{}_{\mu\alpha\nu} = \field\eta^{\alpha\beta}\curv R_{\beta\mu\alpha\nu}$. In the linearized curvature we
put $\beta, \mu, \alpha, \nu$ in the places of $\alpha, \beta, \gamma, \delta$:

$$\begin{aligned}\curv R_{\beta\mu\alpha\nu} = \tfrac12\bigl(&\partial_\mu\partial_\alpha\field h_{\beta\nu} +
\partial_\beta\partial_\nu\field h_{\mu\alpha}\\ &- \partial_\beta\partial_\alpha\field h_{\mu\nu} -
\partial_\mu\partial_\nu\field h_{\beta\alpha}\bigr) .\end{aligned}$$

We multiply by $\field\eta^{\alpha\beta}$ and sum, which raises the index $\beta$ wherever it sits. In the first term
$\field\eta^{\alpha\beta}\field h_{\beta\nu} = \field h^\alpha{}_\nu$. In the second
$\field\eta^{\alpha\beta}\partial_\beta = \partial^\alpha$, and $\partial^\alpha\field h_{\mu\alpha} =
\partial_\alpha\field h^\alpha{}_\mu$, because a summed index may be raised in one place and lowered in the other, and
$\field h_{\mu\nu}$ is symmetric. The third gives $\Box\field h_{\mu\nu}$, and the fourth the trace $\field
h^\alpha{}_\alpha$. So

$$\begin{aligned}\curv R_{\mu\nu} = \tfrac12\bigl(&\partial_\alpha\partial_\mu\field h^\alpha{}_\nu +
\partial_\alpha\partial_\nu\field h^\alpha{}_\mu\\ &- \partial_\mu\partial_\nu\field h^\alpha{}_\alpha - \Box\field
h_{\mu\nu}\bigr) .\end{aligned} \label{eq:ricci}$$

**Step 2: harmonic gauge.** With $\field{\bar h}_{\mu\nu}$ written out, Step 1's rule $\partial^\mu\field h_{\mu\nu} =
\partial_\alpha\field h^\alpha{}_\nu$ and $\field\eta_{\mu\nu}\partial^\mu = \partial_\nu$, the condition reads

$$\partial^\mu\field{\bar h}_{\mu\nu} = \partial_\alpha\field h^\alpha{}_\nu - \tfrac12\partial_\nu\field
h^\alpha{}_\alpha = 0 .$$

So the first term of [](#eq:ricci), $\partial_\mu(\partial_\alpha\field h^\alpha{}_\nu)$, is
$\tfrac12\partial_\mu\partial_\nu\field h^\alpha{}_\alpha$, the second is the same with $\mu$ and $\nu$ swapped, and
together they cancel the third:

$$\curv R_{\mu\nu} = -\tfrac12\Box\field h_{\mu\nu} .$$

**Step 3: the Einstein tensor.** The **Ricci scalar** is the trace of the Ricci tensor, $\sym{ricci-scalar}{\curv R} =
\field\eta^{\mu\nu}\curv R_{\mu\nu} = -\tfrac12\Box\field h^\alpha{}_\alpha$. Chapter
[7.3](/tutorial/geometry/einstein-equation/#einsteins-equation-ties-the-curvature-to-the-energy-and-stress-at-each-point)'s
**Einstein tensor**, the combination of the two whose divergence vanishes for every metric, is then, with $\field\eta$
for $\field g$ because $\curv R$ is already of first order,

$$\begin{aligned}\sym{einstein-tensor}{\curv G}_{\mu\nu} &= \curv R_{\mu\nu} - \tfrac12\field\eta_{\mu\nu}\curv R\\ &=
-\tfrac12\Box\bigl(\field h_{\mu\nu} - \tfrac12\field\eta_{\mu\nu}\field h^\alpha{}_\alpha\bigr)\\ &=
-\tfrac12\Box\field{\bar h}_{\mu\nu} .\end{aligned}$$

**Step 4: Einstein's equation.** Chapter 7.3's $\curv G_{\mu\nu} = (8\pi G/c^4)\matter T_{\mu\nu}$, with
$\sym{stress-energy-tensor}{\matter T}_{\mu\nu}$ the stress–energy tensor of chapter 6.5, becomes the **linearized field
equation**

$$\boxed{\;\Box\field{\bar h}_{\mu\nu} = -\frac{16\pi G}{c^4}\,\matter T_{\mu\nu} .\;} \label{eq:field}$$

Both sides are in $\mathrm{m^{-2}}$, because $16\pi G/c^4$ is in $\mathrm{N^{-1}}$ and $\matter T$ in
$\mathrm{N\,m^{-2}}$. With $\mu\nu = ij$ it is chapter 5.2's stated equation, now derived.

**A check.** The divergence of the left side is $\Box\,\partial^\mu\field{\bar h}_{\mu\nu}$, which is zero in harmonic
gauge. The divergence of the right side is zero by chapter
[6.5](/tutorial/relativity/stress-energy/#conservation-is-one-equation-with-four-parts)'s conservation of energy and
momentum, $\partial^\mu\matter T_{\mu\nu} = 0$. So the gauge condition and the conservation law are the same statement
at this order.[^bound]

**What it means.** Each entry of $\field{\bar h}_{\mu\nu}$ obeys its own wave equation, made by its own entry of
$\matter T_{\mu\nu}$: the energy density makes $\field{\bar h}_{00}$, the momentum density $\field{\bar h}_{0i}$, and
the momentum flux and the stresses $\field{\bar h}_{ij}$.

<!-- diagram: tut-linear-steps — One strip of four boxes joined by thin ink arrows, about 1000 × 150 px at 1440
(a 2 × 2 grid on a phone, read row by row). Each box, outlined in thin ink, holds one equation and a short label above
it. Box 1, "7.2's curvature, contracted": R_μν = ½(∂_α∂_μ h^α_ν + ∂_α∂_ν h^α_μ − ∂_μ∂_ν h^α_α − □h_μν). Box 2, "harmonic
gauge, ∂^μ h̄_μν = 0": R_μν = −½□h_μν. Box 3, "the Einstein tensor": G_μν = −½□h̄_μν. Box 4, "7.3's equation":
□h̄_μν = −16πG T_μν/c⁴, the box drawn slightly heavier. Under the arrow between boxes 1 and 2 the small note "three terms
cancel". Curvature symbols (R, G) in the curvature colour, h and h̄ in the field colour, T in the matter colour.
Caption: "Look first at the last box: four steps turn the curvature of a weak field into one wave equation for each
entry of the trace-reversed perturbation, with the energy and stress of matter as its source." -->

## A static source gives Newton's potential, in time and in space

We want the field of slow matter that does not change. We assume that **the source is static and slow**, so that
$\matter T_{00} = \matter\rho c^2$, with $\sym{density}{\matter\rho}$ the density in $\mathrm{kg\,m^{-3}}$, and the
other entries are much smaller. From here on there are two small numbers, and "at this order" means first order in
$\field h_{\mu\nu}$ and leading order in $v/c$, with $v$ the speed of the matter. The momentum entries vanish for matter
at rest, and the stresses are small: the pressure in water at one atmosphere is $10^{-15}$ of its energy density. In a
static field $\Box = \nabla^2$, so [](#eq:field) gives $\nabla^2\field{\bar h}_{00} = -16\pi G\matter\rho/c^2$, and the
other entries of $\field{\bar h}_{\mu\nu}$ are zero at this order.

Chapter [1.3](/tutorial/newton/gauss-and-poisson/#a-point-mass-is-density-gathered-at-one-point)'s rule $\nabla^2(1/r)
= -4\pi\delta^3(\vect x)$, added up over the pieces of a source, says that the solution of $\nabla^2f = -4\pi s$ that
vanishes far away is

$$f(\vect x) = \int\frac{s(\vect y)}{|\vect x - \vect y|}\,\dd^3y . \label{eq:rule}$$

Here $s = 4G\matter\rho/c^2$, and the potential is $\sym{potential}{\field\Phi}(\vect x) = -G\int\matter\rho(\vect
y)/|\vect x - \vect y|\,\dd^3y$, in $\mathrm{J\,kg^{-1}}$, so $\field{\bar h}_{00} = -4\field\Phi/c^2$.

We reverse the trace. Only $\field{\bar h}_{00}$ is not zero, so $\field{\bar h}^\alpha{}_\alpha =
\field\eta^{00}\field{\bar h}_{00} = -\field{\bar h}_{00}$, and $\field h_{\mu\nu} = \field{\bar h}_{\mu\nu} +
\tfrac12\field\eta_{\mu\nu}\field{\bar h}_{00}$. This gives $\field h_{00} = \tfrac12\field{\bar h}_{00} =
-2\field\Phi/c^2$, chapter 7.1's entry now derived from Einstein's equation, $\field h_{0i} = 0$, and $\field h_{ij} =
\tfrac12\delta_{ij}\field{\bar h}_{00} = -2\field\Phi\delta_{ij}/c^2$. So

$$\boxed{\;\begin{aligned}\dd s^2 &= -\Bigl(1 + \frac{2\field\Phi}{c^2}\Bigr)c^2\dd t^2\\ &\quad + \Bigl(1 -
\frac{2\field\Phi}{c^2}\Bigr)\dd\vect x^2 .\end{aligned}\;} \label{eq:static}$$

These are the **isotropic coordinates** that chapter
[7.1](/tutorial/geometry/metric/#light-follows-paths-on-which-no-proper-time-passes) used, named because the spatial
part is the same in every direction. The field is static and $\field{\bar h}_{0i} = 0$, so the harmonic-gauge condition
holds.

**A check.** For a point mass, $\field\Phi = -G\matter M/r$ gives $\field{\bar h}_{00} = 4G\matter M/c^2r$. Raising both
time indices changes the sign twice, so this is $\field{\bar h}^{00}$, the first term of the paper's
[](/paper/#eq:multipole) for the field outside a compact source. Chapter 7.7 reads its other terms.

**The rulers.** The spatial entries double the bending of light, to $1.75''$ at the Sun's edge against $0.88''$ from the
time entry alone (chapter [7.1](/tutorial/geometry/metric/#light-follows-paths-on-which-no-proper-time-passes)). They do
not change the tide of slow matter, because only $\field h_{00}$ enters $\curv R_{0i0j}$ in a static field (chapter
[7.2](/tutorial/geometry/curvature-and-tides/#near-slow-matter-the-curvature-is-newtons-tide)).

**What it means.** One entry, $\field{\bar h}_{00}$, holds Newton's potential, and reversing the trace shares it
equally between the clocks and the rulers.

## Moving matter adds a potential of its flow

We want the field of matter that moves, to first order in its speed $v$. We assume that **the source moves slowly and
changes slowly**, over times much longer than light takes to cross it, so that $c^{-2}\partial_t^2$ is small beside
$\nabla^2$ and $\Box \approx \nabla^2$. Chapter 6.5's entry $\matter T^{0i} = \matter\rho cv_i$ is $c$ times the
momentum density, and lowering one time index gives

$$\matter T_{0i} = -\matter\rho cv_i ,$$

so [](#eq:field) reads $\nabla^2\field{\bar h}_{0i} = 16\pi G\matter\rho v_i/c^3$. The rule [](#eq:rule), with $s =
-4G\matter\rho v_i/c^3$ and applied to each component, gives

$$\boxed{\;\begin{aligned}\field{\bar h}_{0i} &= -\frac{4G}{c^3}\field A_i ,\\ \sym{flow-potential}{\field{\vect
A}}(\vect x) &= \int\frac{\matter\rho\vect v(\vect y)}{|\vect x - \vect y|}\,\dd^3y .\end{aligned}\;}
\label{eq:flow}$$

Here $\matter\rho\vect v$ is the **mass flux**, in $\mathrm{kg\,m^{-2}\,s^{-1}}$, the mass that crosses a square metre
each second, and $\field{\vect A}$ is chapter
[2.8](/tutorial/outside/flows/#a-flow-has-a-potential-of-its-own-built-like-the-gravitational-one)'s **potential of the
flow**: the mass flux added up over the source as the density is added up for $\field\Phi$, in $\mathrm{kg\,s^{-1}}$.
Since $G/c^3$ is in $\mathrm{s\,kg^{-1}}$, $\field{\bar h}_{0i}$ is a pure number.

**The gauge condition is the conservation of mass.** With $\nu = 0$, $\field{\bar h}_{00} = -4\field\Phi/c^2$ and
[](#eq:flow), the harmonic condition becomes

$$\frac{\partial\field\Phi}{\partial t} = G\,\nabla\cdot\field{\vect A} .$$

It holds whenever $\partial_t\matter\rho + \nabla\cdot(\matter\rho\vect v) = 0$, which is chapter
[2.8](/tutorial/outside/flows/#a-flow-of-mass-is-a-mass-flux-and-mass-is-conserved)'s **continuity equation**: the
density at a point falls as fast as the mass flux carries mass away, so mass is neither made nor lost. The box below
gives the steps.

::: derivation
### The gauge condition, step by step

With $\nu = 0$ the condition reads $-\partial_0\field{\bar h}_{00} + \partial_i\field{\bar h}_{i0} = 0$, because raising
the index 0 of the derivative changes its sign. With $\partial_0 = c^{-1}\partial_t$ and the two fields it is
$(4/c^3)(\partial_t\field\Phi - G\,\nabla\cdot\field{\vect A}) = 0$.

Under the integral, $\partial_t\field\Phi = -G\int\partial_t\matter\rho(\vect y)/|\vect x - \vect y|\,\dd^3y$. In
$\nabla\cdot\field{\vect A}$ the factor $1/|\vect x - \vect y|$ depends only on $\vect x - \vect y$, so its gradient in
$\vect x$ is minus its gradient in $\vect y$:

$$\nabla\cdot\field{\vect A} = -\int\matter\rho\vect v(\vect y)\cdot\nabla_{\vect y}\frac{1}{|\vect x - \vect
y|}\,\dd^3y .$$

We integrate by parts in $\vect y$; the flow is confined to the source, so no term from far away is left:

$$\nabla\cdot\field{\vect A} = \int\frac{\nabla\cdot(\matter\rho\vect v)(\vect y)}{|\vect x - \vect y|}\,\dd^3y .$$

So $\partial_t\field\Phi - G\,\nabla\cdot\field{\vect A} = -G\int[\partial_t\matter\rho + \nabla\cdot(\matter\rho\vect
v)]/|\vect x - \vect y|\,\dd^3y$, zero at every $\vect x$ when the continuity equation holds.
:::

**Numbers.** A metre from the person walking at $1.4\unit{m\,s^{-1}}$, treated as a point, $|\field{\bar h}_{0i}| =
4G\matter Mv/c^3r = 9.7\times10^{-34}$, against $|\field h_{00}| = 1.0\times10^{-25}$: smaller by $2v/c =
9.3\times10^{-9}$.

**The sizes near slow matter.** The energy makes $\field h_{00}$, of about $\field\Phi/c^2$, and the momentum makes
$\field{\bar h}_{0i}$, of about $(v/c)\field\Phi/c^2$. The momentum flux $\matter\rho v_iv_j$ and the stresses make
$\field{\bar h}_{ij}$. For a body held together by its own material and free of outside forces, the stresses add up to
zero, by chapter [6.5](/tutorial/relativity/stress-energy/#the-stresses-of-a-body-at-rest-add-up-to-zero)'s von Laue
theorem. So far away only the motion part of $\field{\bar h}_{ij}$ is left, of about $(v/c)^2$ times $\field{\bar
h}_{00}$: $4.5\times10^{-42}$ for the walking person, another factor of about $v/c$ below $\field{\bar h}_{0i}$. That is
why a pressure like that of water at one atmosphere, fifty times $\matter\rho v^2$ at walking speed, does not show in
the far field.

A person standing on a floor is not free of outside forces. The stress of bearing their weight adds up to $\int\matter
T_{zz}\,\dd V \approx \matter Mgz_{\rm cm} \approx 690\unit{J}$, with $g = 9.8\unit{m\,s^{-2}}$ and $z_{\rm cm} \approx
1\unit{m}$ the height of their centre of mass, against $\int\matter\rho v^2\,\dd V = 137\unit{J}$. So a metre away it
gives $\field{\bar h}_{zz}$ of about $2\times10^{-41}$, five times the motion part.

This ladder is why chapter 7.5's magnetic part, made from $\field h_{0i}$, is smaller than the tide by about $v/c$, and
why the stress and motion of matter count only for fast motion and for light. A beam of light has a momentum flux equal
to its energy density, so its $\field{\bar h}_{ij}$ is as large as its $\field{\bar h}_{00}$.

<!-- diagram: tut-linear-hierarchy — One panel, about 560 × 240 px at 1440 (full width on a phone). Three horizontal
bars on a logarithmic axis from 10⁻⁴⁴ to 10⁻²⁴, one per row, for the 70 kg person walking at 1.4 m s⁻¹, seen at 1 m:
"h₀₀, from the energy" 1.0 × 10⁻²⁵; "h̄₀ᵢ, from the momentum" 9.7 × 10⁻³⁴; "h̄ᵢⱼ, its motion part ρvᵢvⱼ"
4.5 × 10⁻⁴². Bars solid in the field colour, the longest darkest. On the third row a small hollow tick at 2 × 10⁻⁴¹,
labelled "with the stress of standing on a floor". Between consecutive bars, at their right ends, a small bracket
labelled "× 2v/c" (first gap) and "× v/c" (second gap), with v/c = 4.7 × 10⁻⁹ printed once below the axis. Labels left
of the bars, values right of them, never on the bars. Caption: "Look first at the gaps: each step down the table, from
energy to momentum to momentum flux, costs about one factor of v/c, eight orders of magnitude for a walking person. The
hollow tick is the stress of bearing the person's weight on a floor, five times the motion part. Logarithmic
scale." -->

## The field travels at the speed of light

We want to know how fast a change of the source reaches the field. Each entry of [](#eq:field) is a wave equation with
the speed $c$. Chapter [5.2](/tutorial/waves/retarded-waves/#a-source-sends-its-news-outward-at-the-speed-of-the-wave)
found that the equation $c^{-2}\partial_t^2u - \nabla^2u = s$ has the retarded solution $u = \int s(\vect y, t - |\vect
x - \vect y|/c)/4\pi|\vect x - \vect y|\,\dd^3y$. Here $s = 16\pi G\matter T_{\mu\nu}/c^4$, and dividing by the $4\pi$
leaves

$$\boxed{\;\begin{aligned}\field{\bar h}_{\mu\nu}(t, \vect x) &= \frac{4G}{c^4}\int\frac{\matter T_{\mu\nu}(t_{\rm r},
\vect y)}{|\vect x - \vect y|}\,\dd^3y ,\\ t_{\rm r} &= t - \frac{|\vect x - \vect y|}{c} .\end{aligned}\;}
\label{eq:retarded}$$

The field at $\vect x$ is set by each piece of the source at the **retarded time** $t_{\rm r}$, one light-travel time
earlier, so gravity's news travels at the speed of light. For a static source the delay drops out, and [](#eq:retarded)
returns $\field{\bar h}_{00} = -4\field\Phi/c^2$ and [](#eq:flow). When the source's energy and momentum are conserved,
this solution satisfies the harmonic-gauge condition (stated), as the paper says of its solution for the pair of black
holes.

**Where the field points.** The delay does not make the field of a steadily moving body point at where the body was.
Chapter [6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now)
showed that a field static in the body's own frame depends only on where the body is now; in the retarded integral this
appears as terms in the body's velocity, which chapter 7.7 reads.

In empty space the waves of [](#eq:field) are chapter
[5.1](/tutorial/waves/wave-equation/#a-plane-wave-is-a-turning-number-that-travels)'s plane waves, and chapter 7.6 shows
that only two of their ten amplitudes are physical, the strains of the paper's "transverse traceless gauge".

<!-- try: gauge-or-wave (a new interactive figure, GaugeOrWave, not yet built) — One panel, about 640 × 460 px at 1440
(full width on a phone, controls below). A 5 × 5 grid of rings of twelve free balls (small dots in the observer colour),
drawn in coordinates over thin grey coordinate lines, each ring's undisturbed circle dashed. Two sliders: "gauge shift ε"
(0 to 0.3 of the ring spacing, drawn as the pure-gauge relabelling x' = x + ε cos(kx − ωt) with k set by the grid,
which moves each ball's coordinate position and the lines' labels together) and "real wave h₊" (0 to 0.3, drawn
exaggerated with a stated factor, a plus-polarized wave travelling out of the screen, which moves the balls relative to
one another); a play button that runs t, and a pause. Readouts, to two figures: "largest change in the proper separation
of neighbouring balls: … (fraction)" computed from the metric, and "tide at the centre 𝓔ₓₓ = … (in units of ω²)" from
−½∂²ₜh₊. Opens with the gauge shift at 0.2 and the wave at 0, playing. Predict first: "Only the gauge shift is on. The
coordinate lines ripple. Do the balls move relative to one another?" (Answer: no; the separations change by 0 and the
tide is 0, because a pure-gauge table has no curvature.) Then: "Turn the gauge shift off and the wave on. What changes
now?" (Answer: the rings become ellipses, stretched along x and squeezed along y in turn; the separations change by about
h₊/2 and the tide is not zero.) Then: "Turn both on. Which readout does the gauge shift affect?" (Answer: neither.)
Keyboard: Tab reaches both sliders and the play button, arrows step them, shift for larger steps; both themes; phone;
static on reduced motion (one frame at the phase of largest stretch). -->

::: check
### Q

How large is $\field h_{00}$ a metre from the 70 kg person, and what does that say about the linear theory there?

### A

It is $2G\matter M/rc^2 = 1.0\times10^{-25}$. The neglected products of its entries are smaller still by that factor, so
the linear theory errs there by about one part in $10^{25}$.

### Q

Why is $\field{\bar h}_{0i}$ smaller than $\field h_{00}$ near a walking person, and by how much?

### A

It is made by the momentum density $\matter\rho v$ instead of the energy density $\matter\rho c^2$, so it is smaller by
$v/c$, times the factor 2 between $4G\matter M/c^2r$ and $2G\matter M/c^2r$: $2v/c = 9.3\times10^{-9}$.

### Q

Which law of matter makes the harmonic-gauge condition consistent with the field equation?

### A

The conservation of energy and momentum, $\partial^\mu\matter T_{\mu\nu} = 0$; for slow matter its time component is the
continuity equation of mass.
:::

**The idea to keep: where gravity is weak, the metric is flat spacetime plus a small table $\field h_{\mu\nu}$. A change
of coordinates alters the table but never the curvature, and in harmonic gauge Einstein's equation becomes
$\Box\field{\bar h}_{\mu\nu} = -16\pi G\matter T_{\mu\nu}/c^4$, one wave equation for each entry, made by energy,
momentum and stress and travelling at the speed of light.**

::: problems
### Practice

A person of 70 kg walks at $1.4\unit{m\,s^{-1}}$ across the line of sight, 1 m away. Find $\field h_{00}$, the size of
$\field{\bar h}_{0i}$, and the ratio of the two.

::: solution
The time entry is $\field h_{00} = 2G\matter M/rc^2 = 2\times6.674\times10^{-11}\times70/(2.998\times10^8)^2 =
1.0\times10^{-25}$. Treating the person as a point, as the paper does, $\field{\vect A} = \matter M\vect v/r$, so
$|\field{\bar h}_{0i}| = 4G\matter Mv/c^3r = 9.7\times10^{-34}$. The ratio is $2v/c = 9.3\times10^{-9}$.
:::

### Stretch

Combine this chapter with chapter 1.3. Solve $\nabla^2\field{\bar h}_{00} = -16\pi G\matter\rho/c^2$ inside and outside
a uniform ball of mass $\matter M$ and radius $R$, and write $\field g_{00}$ at its centre. By how much does a clock at
the centre of a uniform Earth run slow against one far away?

::: solution
Since $\field{\bar h}_{00} = -4\field\Phi/c^2$, this is Poisson's equation. Chapter 1.3's interior potential is
$\field\Phi = -G\matter M(3R^2 - r^2)/2R^3$ inside and $-G\matter M/r$ outside, so $\field\Phi(0) = -\tfrac32G\matter
M/R$ and $\field g_{00} = -(1 + 2\field\Phi/c^2) = -(1 - 3G\matter M/Rc^2)$. The clock's rate is $\sqrt{-\field g_{00}}
\approx 1 - \tfrac32G\matter M/Rc^2$, so with $G\matter M = 3.986\times10^{14}\unit{m^3\,s^{-2}}$ and $R =
6.371\times10^6\unit{m}$ it runs slow by $1.04\times10^{-9}$. The real Earth's dense core makes it about
$1.22\times10^{-9}$, some 17 per cent more.
:::

### The paper

Derive $\Box\field{\bar h}_{\mu\nu} = -16\pi G\matter T_{\mu\nu}/c^4$ from Einstein's equation in harmonic gauge. Then
check that the first and last terms of the paper's [](/paper/#eq:multipole) for $\field{\bar h}^{00}$ and $\field{\bar
h}^{0i}$, $4G\matter M/c^2r$ and $2G(\vect L\times\vect x)_i/c^3r^3$, are the fields of a round spinning body.

::: solution
The four steps of [](#in-harmonic-gauge-einsteins-equation-is-a-wave-equation-for-each-component) give the equation. For
a static round body, [](#eq:rule) gives $\field{\bar h}_{00} = 4G\matter M/c^2r$ outside, and $\field{\bar h}^{00} =
\field{\bar h}_{00}$. Outside a round body that turns steadily with the angular momentum $\vect L$, chapter
[2.8](/tutorial/outside/flows/#a-swirl-shows-through-its-angular-momentum-and-two-swirls-can-cancel) found $\field{\vect
A} = \vect L\times\vect x/2r^3$, so [](#eq:flow) gives $\field{\bar h}_{0i} = -2G(\vect L\times\vect x)_i/c^3r^3$.
Raising one time index changes the sign, so $\field{\bar h}^{0i} = 2G(\vect L\times\vect x)_i/c^3r^3$, the paper's term
with its sign.
:::
:::

::: paper
- [Section I](/paper/#sec:introduction): "we need only the linear theory"; gravity made by energy "and, for fast motion
  and for light, its momentum and stress too", the sizes in
  [](#moving-matter-adds-a-potential-of-its-flow).
- [Section II](/paper/#sec:pixel): the paper's [](/paper/#eq:wave) is written "in the transverse traceless gauge", a
  gauge of [](#relabelling-the-coordinates-changes-the-table-not-the-curvature) (chapter 7.6).
- [Section V](/paper/#sec:waves): the factor $4G/c^4$ of the paper's [](/paper/#eq:wave-zone) is that of
  [](#eq:retarded), the retarded solution of [](#eq:field) (chapters 5.2 and 7.7).
- [Section VIII](/paper/#sec:one-pixel), [*The absence of gravitational
  aberration*](/paper/#par:the-absence-of-gravitational-aberration): gravity "travels at the speed of light",
  [](#eq:retarded) (chapter 7.7).
- [Section XI](/paper/#sec:vistas): the paper's [](/paper/#eq:multipole) is "the trace-reversed perturbation in
  harmonic gauge", whose static and spin terms are [](#eq:static) and [](#eq:flow) (chapter 7.7).
:::

::: deeper
- The GR course linearizes Einstein's theory in
  [section 18.1](https://neovand.github.io/general-relativity/chapter-18.html#18-1-linearization-is-a-controlled-approximation-not-a-different-theory),
  reverses the trace and fixes the Lorenz gauge in
  [section 18.2](https://neovand.github.io/general-relativity/chapter-18.html#18-2-trace-reversal-and-lorenz-gauge-cleaning-the-algebra-without-deleting-physics),
  and builds the retarded field in
  [section 18.5](https://neovand.github.io/general-relativity/chapter-18.html#18-5-retarded-solutions-the-field-receives-yesterday-s-news).
- The GR course's [section 16.1](https://neovand.github.io/general-relativity/chapter-16.html#16-1-two-gravitational-potentials-because-clocks-and-rulers-both-participate)
  reads the two potentials of [](#eq:static), and
  [section 16.4](https://neovand.github.io/general-relativity/chapter-16.html#16-4-bending-light-finding-the-famous-factor-of-two)
  finds the factor of two in the bending of light.
- M. Maggiore, *Gravitational Waves*, vol. 1 (Oxford, 2008), chapter 1: the linearized theory and its gauges, in the
  paper's conventions.
:::

[^letters]: Three letters look alike. With two indices, $\field h_{\mu\nu}$ is the metric perturbation, and
    $\field h^\alpha{}_\alpha$, always written with its indices, is its trace. A bare $h$ is the paper's strain of a
    wave, and in Parts 2 and 4 a harmonic function. The gauge shift $\zeta^\mu$ is not 7.2's separation $\xi^\mu$,
    nor the paper's $\zeta_\pm$ of Section XIII.

[^order]: The derivatives of $\zeta$ with respect to $x'$ and to $x$ differ by a product of two small quantities,
    which is dropped. The same holds for $\field h_{\mu\nu}$ at the point $x'$ and at the point $x$, so the old and
    new tables may be compared at the same coordinate values.

[^lorenz]: After Ludvig Lorenz, who imposed the same condition on the potentials of electromagnetism in 1867.

[^bound]: Chapter 6.5's law holds for matter on which no outside force acts, and gravity, which is not part of
    $\matter T_{\mu\nu}$, acts here as one. So for a body held together by its own gravity, such as the Earth, a star
    or a pair in orbit, the law holds only to leading order. That is all this chapter uses, and chapter 7.7 keeps
    track of the next order.
