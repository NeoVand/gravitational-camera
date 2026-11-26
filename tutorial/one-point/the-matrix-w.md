---
id: '9.3'
title: 'The matrix 𝒲: four invariants, an orientation, a velocity'
question: 'A pixel reads ten numbers, five in the tide and five in the magnetic part. How do they split into four that are the same for every observer, three angles that orient the field''s own axes and three numbers of a velocity, and how can a pixel read its own speed in a room it has never seen?'
part: '9'
requires: ['1.1', '1.5', '1.5b', '1.7', '3.1', '6.1', '6.2', '6.3', '6.6', '7.2', '7.5', '7.6', '8.4', '9.1', '9.2']
paper: [sec:one-pixel, eq:W, eq:invariants, eq:magnetic-ratio, eq:polar, eq:speedometer, fig:speedometer, fig:present, sec:pixel]
figures: [fig:speedometer, fig:present]
live: [speedometer]
depth: A
---

A pixel crosses a room of four masses at $0.6c$. It has no map of the room, yet at every point of its path it reads its
own velocity from one reading of the tide and the magnetic part. Under the path, the figure plots the largest imaginary
part of the reading's eigenvalues over their largest size. The ratio is zero for a room at rest, however fast the pixel
moves, and it is not zero once one of the masses crosses the room.[^speed]

{{paper fig:speedometer}}

How do the pixel's ten numbers split into four, three and three, and how can a pixel read its own speed in a room it has
never seen?

::: plain
A pixel reads ten numbers: five for the stretch and squeeze of the tide, and five for its twist. They fit into one table
of five complex numbers. A pixel that is turned reads this table turned; a pixel that moves reads it turned too, but by
an imaginary angle.

Turning a table does not change its eigenvalues, the amounts by which it stretches along its own special directions, so
every observer at one place finds the same eigenvalues. They hold four of the ten numbers. Three more are the angles of
the field's own axes. The last three are a velocity: that of the one observer for whom the stretch and the twist share
the same axes.

In a room where every mass is at rest, that observer is at rest in the room, so a pixel moving through the room reads its
own velocity from one reading, without a map. If the eigenvalues come out complex, something in the room moves or turns,
and no motion of the pixel can produce that.
:::

## The ten numbers are one complex symmetric table

One object should hold a pixel's ten numbers so that every observer changes it in a simple way. In empty space the tide
$\sym{tidal-tensor}{\curv\tE}$ (section [1.4](/tutorial/newton/tides/)) and the magnetic part
$\sym{magnetic-tide}{\curv\tB}$ (section 7.5) are each real, symmetric and trace-free, so each holds five numbers
(section [1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left)). We join them
into one table,

$$\sym{weyl-complex}{\curv{\mathcal W}} = \curv\tE + i\,\curv\tB ,$$

which has complex entries in $\mathrm{s^{-2}}$, is symmetric, $\curv{\mathcal W}^{\mathsf T} = \curv{\mathcal W}$, and has no
trace: five complex numbers, the **complex matrix of a reading** that section
[1.5b](/tutorial/newton/complex-numbers/) first wrote down.[^W] A pixel measures its real part from the drift of its free
balls and its imaginary part from the turning of its gyroscopes (section
[7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)),
each in its own axes and along its own time (section
[7.2](/tutorial/geometry/curvature-and-tides/#for-an-observer-at-rest-the-drift-is-the-papers-tide)). We join them because a
change of velocity then acts on the table as a turn does, as the next section shows.

**An example and a non-example.** One mass $\matter M$ at the distance $r$ along the unit vector $\hat n$ gives the real
table $\curv{\mathcal W} = (G\matter M/r^3)(1 - 3\hat n\hat n^{\mathsf T})$, with no magnetic part. One plane wave gives
the square $2(\curv\tE_+ - i\curv\tE_\times)\,\vect m\vect m^{\mathsf T}$ of section 9.1, whose imaginary part is as large
as its real part. Inside matter the tide's trace is $4\pi G\matter\rho$, so a reading there is not trace-free; this
section stays in empty space, where $\curv{\mathcal W}$ is built from the Weyl tensor of section
[7.3](/tutorial/geometry/einstein-equation/#in-empty-space-only-the-weyl-curvature-is-left-and-it-holds-ten-numbers).

**A turned pixel.** The rule of section
[1.1](/tutorial/newton/vectors-and-indices/#turning-the-axes-changes-the-components-not-the-arrow) for a table read in
turned axes applies to $\curv\tE$ and $\curv\tB$ alike, and because the turn is real it applies to $\curv{\mathcal W}$ as a
whole. With $R = \exp(\theta\,\hat u\cdot\mathbf L)$, the turn by the angle $\theta$ about $\hat u$ that carries the old
axes onto the new (section
[1.7](/tutorial/newton/hamilton/#every-quantity-generates-a-motion-and-a-symmetry-gives-a-constant)), a turned pixel reads
$R^{\mathsf T}\curv{\mathcal W}R$.

## A moving pixel reads the table turned by an imaginary angle

We want the reading of a pixel that passes, with the velocity $\obs{\vect v} = c\tanh\obs\eta\,\hat u$, the place where a
pixel at rest reads $\curv{\mathcal W}$. Here $\sym{rapidity}{\obs\eta}$ is the rapidity of section
[6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not), a pure number, and $\hat u$ the direction of
motion. For light, section
[6.6](/tutorial/relativity/maxwell-complex/#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle) found that the
moving sensor reads $\light{\vect F}' = \Lambda\light{\vect F}$, with the table $\sym{complex-boost}{\Lambda} =
\exp(-i\obs\eta\,\hat u\cdot\mathbf L)$ built from the generators $\sym{generators}{(L_k)_{ij}} = -\epsilon_{kij}$ of
section 1.7. At $0.6c$ along $x$, where $\obs\eta = \ln2$, its rows are $(1, 0, 0)$, $(0, 1.25, 0.75i)$ and $(0, -0.75i,
1.25)$. We build gravity's rule in two steps from light's, and then check it.

**Step 1: one plane wave.** By section 9.1 a plane wave's reading is a square, $\curv{\mathcal W} = \curv c_2\,\vect
m\vect m^{\mathsf T}$, with $\vect m$ the null vector of its direction of travel, of unit size ($\vect m^*\cdot\vect m =
1$), and $\curv c_2$ a complex amplitude in $\mathrm{s^{-2}}$. Light's wave along that direction is $\light{\vect F} =
a\,\vect m$. The moving pixel sees a plane wave along a new direction, and for light that wave is $\Lambda(a\vect m)$. So
$\Lambda\vect m$ is a multiple of the new unit null vector $\vect m'$, $\Lambda\vect m = f\,\vect m'$ with $f$ a complex
number, and light's amplitude becomes $fa$. We claim that gravity's becomes $\curv c_2' = f^2\curv c_2$, so that

$$\curv{\mathcal W}' = \curv c_2'\,\vect m'\vect m'^{\mathsf T} = \curv c_2\,(\Lambda\vect m)(\Lambda\vect m)^{\mathsf T}
= \Lambda\,\curv{\mathcal W}\,\Lambda^{\mathsf T} .$$

For a pixel running along the wave the claim is easy to check. It has $\Lambda\vect m = e^{-\obs\eta}\vect m$ (section
[6.6](/tutorial/relativity/maxwell-complex/#a-sensor-that-runs-with-a-wave-reads-it-weaker-by-the-doppler-factor)), so
$f = e^{-\obs\eta}$ and the claim gives $\curv{\mathcal W}' = e^{-2\obs\eta}\curv{\mathcal W}$. The running pixel meets the
crests less often, so the angular frequency falls by the Doppler factor $e^{-\obs\eta}$, while the strain, a stretch
across the motion, is the same for both observers. The tide is $-\tfrac12$ times the second time derivative of the strain
(section
[7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)), so it
falls by $e^{-2\obs\eta}$, as claimed.

**Step 2: every reading is a sum of squares.** The rule acts only on the curvature at the point, and linearly: a moving
observer's $\curv\tE'$ and $\curv\tB'$ are sums of the curvature's components at that event, with coefficients made from
its four-velocity and its axes (section
[6.2](/tutorial/relativity/spacetime-vectors/#what-an-observer-measures-is-a-contraction-with-its-own-four-velocity)).
So a moving pixel reads a sum of curvatures as the sum of its readings of each. We state that the squares of the null
vectors of five different directions are independent tables, so every reading is a sum $\curv{\mathcal W} =
\sum_k\curv c_k\,\vect m_k\vect m_k^{\mathsf T}$ of five of them,[^five] each a curvature that one plane wave could make.
Step 1 applied to each term gives

$$\boxed{\;\curv{\mathcal W}' = \Lambda\,\curv{\mathcal W}\,\Lambda^{\mathsf T}, \qquad \Lambda =
\exp(-i\obs\eta\,\hat u\cdot\mathbf L),\;} \label{eq:rule}$$

for a pixel moving with the velocity $c\tanh\obs\eta\,\hat u$. A scene moving with that velocity past a pixel at rest is
seen through $\Lambda^{-1}$, the boost along $-\hat u$.

The two steps take two facts on trust: that $\curv c_2' = f^2\curv c_2$ for every direction of the wave and of the
motion, and that five squares make every reading. The next section proves the rule from the curvature itself, without
either.

**A check.** For a real reading, from masses at rest, the rule with $\Lambda^{-1}$, the complex conjugate of $\Lambda$,
gets $\curv\tE'$ right and only flips the sign of $\curv\tB'$, so a test needs a complex reading: the linearized
Riemann tensor of section
[7.2](/tutorial/geometry/curvature-and-tides/#to-first-order-the-curvature-is-made-of-second-derivatives-of-the-metric)
for two masses at rest, plus that of a third mass passing them at $0.5c$ (the tensor of a mass at rest written in the
room's axes, section 6.2). Contracted with the four-velocity and the axes of an observer moving at $0.7c$ in a random
direction, with $\curv\tB_{ij} = \tfrac12c^2\epsilon_{ipq}\curv R_{pqj0}$ (section
[7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index)), the sum gives
$\curv\tE'$ and $\curv\tB'$ that agree with [](#eq:rule) to fifteen figures.

**First order.** For a slow pixel $\Lambda \approx 1 - i\obs\eta\,\hat u\cdot\mathbf L$, with $\obs\eta \approx \obs v/c$.
The table $\hat u\cdot\mathbf L$ sends a vector $\vect x$ to $\hat u\times\vect x$ (section 1.7), and it is
antisymmetric, so $\Lambda^{\mathsf T} \approx 1 + i\obs\eta\,\hat u\cdot\mathbf L$. Multiplying out and keeping the terms
of first order gives $\curv{\mathcal W}' \approx \curv{\mathcal W} - i\obs\eta\,[\hat u\cdot\mathbf L, \curv{\mathcal W}]$,
with the commutator $[X, Y] = XY - YX$. Masses at rest have a real $\curv{\mathcal W} = \curv\tE$, so the moving pixel
reads the magnetic part

$$\boxed{\;\curv\tB' = -\frac{\obs v}{c}\,[\hat u\cdot\mathbf L, \curv\tE] .\;} \label{eq:first-order}$$

**Check: the moving pixel of section 7.5.** For one mass along $\hat n$, $\curv\tE = (G\matter M/r^3)(1 - 3\hat n\hat
n^{\mathsf T})$. The 1 commutes with every table, and $[\hat u\cdot\mathbf L, \hat n\hat n^{\mathsf T}] = (\hat u\times\hat
n)\hat n^{\mathsf T} + \hat n(\hat u\times\hat n)^{\mathsf T}$, because $\hat n^{\mathsf T}(\hat u\cdot\mathbf L) = -(\hat
u\times\hat n)^{\mathsf T}$. So

$$\curv\tB' = -\frac{3G\matter M}{c\,r^3}\bigl[\hat n(\hat n\times\obs{\vect v})^{\mathsf T} + (\hat n\times\obs{\vect
v})\hat n^{\mathsf T}\bigr],$$

the reading of a pixel moving past a mass at rest that section
[7.5](/tutorial/geometry/gravitomagnetism/#the-earths-magnetic-part-weighs-its-core) found with the principle of
relativity. The exact rule contains it as its first term.

## A small boost mixes the tide and the magnetic part, and many small boosts make the rule

We want [](#eq:rule) for every reading and every motion, from the curvature alone. We first find what a boost by a very
small rapidity does to any reading, and then build every boost from many small ones.

**The axes of a slowly moving observer.** An observer at rest at an event carries four unit axes: $e_0$, its
four-velocity divided by $c$, and $e_1$, $e_2$, $e_3$ in its own space. A second observer at the same event moves along
$\hat u$ with the small rapidity $\delta\obs\eta$. The boost of section
[6.1](/tutorial/relativity/lorentz/#a-boost-can-point-in-any-direction), with $\cosh\delta\obs\eta \approx 1$ and
$\sinh\delta\obs\eta \approx \delta\obs\eta$, gives it the axes

$$e_0' = e_0 + \delta\obs\eta\,\hat u_k\,e_k, \qquad e_i' = e_i + \delta\obs\eta\,\hat u_i\,e_0 ,$$

to first order in $\delta\obs\eta$. With the metric's minus sign for time, $e_0'\cdot e_i' = -\delta\obs\eta\,\hat u_i +
\delta\obs\eta\,\hat u_i = 0$, and the lengths change only at second order. The second observer's components
$\curv R'_{\alpha\beta\gamma\delta}$ are the same tensor contracted with its own axes (section
[6.2](/tutorial/relativity/spacetime-vectors/#a-tensor-is-a-table-whose-every-index-changes-with-the-boost)), so each
changes by $\delta\obs\eta$ times the components in which one index has been exchanged between time and space.

**The tide.** For the contraction $\curv\tE'_{ij} = c^2\curv R'_{0i0j}$ this is the tide of a pair of free balls moving at
$\vect w = c\,\delta\obs\eta\,\hat u$, which section
[7.2](/tutorial/geometry/curvature-and-tides/#four-free-balls-read-the-whole-tide-and-a-moving-pair-reads-the-magnetic-part-too)
found from geodesic deviation, the moving gradiometer: $\curv\tE'_{ij} = \curv\tE_{ij} + \delta\obs\eta\,(\epsilon_{ipq}\hat
u_p\curv\tB_{qj} + \epsilon_{jpq}\hat u_p\curv\tB_{qi})$. The table $\hat u\cdot\mathbf L$ sends $\vect x$ to $\hat
u\times\vect x$, so the bracket is $(\hat u\cdot\mathbf L\,\curv\tB)_{ij}$ plus its transpose, and the transpose is
$-\curv\tB\,\hat u\cdot\mathbf L$, because $\hat u\cdot\mathbf L$ is antisymmetric and $\curv\tB$ symmetric. So

$$\curv\tE' = \curv\tE + \delta\obs\eta\,[\hat u\cdot\mathbf L, \curv\tB] .$$

**The magnetic part.** For $\curv\tB'_{ij} = \tfrac12c^2\epsilon_{ipq}\curv R'_{pqj0}$ (section 7.5) we let each of the four
indices take its correction in turn:

$$\begin{aligned}\curv R'_{pqj0} = \curv R_{pqj0} + \delta\obs\eta\,\bigl(&\hat u_p\curv R_{0qj0} + \hat u_q\curv
R_{p0j0}\\ &+ \hat u_j\curv R_{pq00} + \hat u_k\curv R_{pqjk}\bigr) .\end{aligned}$$

The third term vanishes, because the curvature is antisymmetric in its last two indices. The first two hold the tide,
$\curv R_{0qj0} = -\curv R_{0q0j} = -\curv\tE_{qj}/c^2$, and they give the same after $\epsilon_{ipq}$, which changes sign
when $p$ and $q$ swap, so together they contribute $-\delta\obs\eta\,\epsilon_{ipq}\hat u_p\curv\tE_{qj} = -\delta\obs\eta\,(\hat
u\cdot\mathbf L\,\curv\tE)_{ij}$. The last term needs the curvature with four indices in space.

**The curvature with four indices in space.** The components $\curv R_{pqjk}$ are antisymmetric in $pq$ and in $jk$, so
each pair is a vector in disguise (section
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise)), and $\curv R_{pqjk} =
\epsilon_{pqa}\epsilon_{jkb}S_{ab}$ for a table $S$, symmetric because the curvature does not change when its two pairs
are exchanged. In empty space the Ricci tensor vanishes (section
[7.3](/tutorial/geometry/einstein-equation/#in-empty-space-only-the-weyl-curvature-is-left-and-it-holds-ten-numbers)), and
its part in space is $\curv R_{jl} = -\curv R_{0j0l} + \curv R_{kjkl}$, the minus sign from the metric. The identity of
section [1.1](/tutorial/newton/vectors-and-indices/#two-levi-civita-symbols-make-two-kronecker-deltas) gives $\curv
R_{kjkl} = \epsilon_{kja}\epsilon_{klb}S_{ab} = \delta_{jl}\,\mathrm{tr}\,S - S_{jl}$, so $\delta_{jl}\,\mathrm{tr}\,S -
S_{jl} = \curv\tE_{jl}/c^2$. Its trace gives $2\,\mathrm{tr}\,S = \mathrm{tr}\,\curv\tE/c^2 = 0$, and then

$$\curv R_{pqjk} = -\frac{1}{c^2}\,\epsilon_{pqa}\epsilon_{jkb}\curv\tE_{ab} .$$

With $\epsilon_{ipq}\epsilon_{pqa} = 2\delta_{ia}$, from the same identity, the last term contributes
$\tfrac12c^2\,\delta\obs\eta\,\epsilon_{ipq}\hat u_k\curv R_{pqjk} = -\delta\obs\eta\,\epsilon_{jkb}\hat u_k\curv\tE_{bi}$,
which is $-\delta\obs\eta$ times the transpose of $\hat u\cdot\mathbf L\,\curv\tE$. As for the tide,

$$\curv\tB' = \curv\tB - \delta\obs\eta\,[\hat u\cdot\mathbf L, \curv\tE] .$$

**One small boost.** Adding $i$ times the second change to the first, $\delta\obs\eta\,([\hat u\cdot\mathbf L, \curv\tB] -
i[\hat u\cdot\mathbf L, \curv\tE]) = -i\,\delta\obs\eta\,[\hat u\cdot\mathbf L, \curv\tE + i\curv\tB]$, so

$$\boxed{\;\curv{\mathcal W}' = \curv{\mathcal W} - i\,\delta\obs\eta\,[\hat u\cdot\mathbf L, \curv{\mathcal W}] .\;}
\label{eq:small-boost}$$

Both sides are in $\mathrm{s^{-2}}$, since $\delta\obs\eta$ and $\hat u\cdot\mathbf L$ are pure numbers. The real part is the
moving gradiometer, whose tide gains the magnetic part times $\obs v/c$; the imaginary part is a moving pixel's
gyroscopes, which gain the tide times $\obs v/c$. For masses at rest it is [](#eq:first-order), now found without the
rule.

**Many small boosts.** Let $\curv{\mathcal W}(\obs\eta)$ be the reading of the observer that moves along $\hat u$ with the
rapidity $\obs\eta$, its axes carried from the first observer's by the boost. Its neighbour at $\obs\eta +
\delta\obs\eta$ moves relative to it along the same $\hat u$, which the boost leaves alone, with the rapidity
$\delta\obs\eta$, because rapidities along one line add (section
[6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not)). So [](#eq:small-boost) holds at every
$\obs\eta$:

$$\frac{\dd\curv{\mathcal W}}{\dd\obs\eta} = -i\,[\hat u\cdot\mathbf L, \curv{\mathcal W}] .$$

The tables $e^{\pm i\obs\eta\,\hat u\cdot\mathbf L}$ commute with $\hat u\cdot\mathbf L$. Differentiating $G(\obs\eta) =
e^{i\obs\eta\,\hat u\cdot\mathbf L}\,\curv{\mathcal W}(\obs\eta)\,e^{-i\obs\eta\,\hat u\cdot\mathbf L}$ by the product
rule gives $i[\hat u\cdot\mathbf L, G]$ from the two outer factors and $-i[\hat u\cdot\mathbf L, G]$ from the middle one,
so $G$ does not change, and it equals its value $\curv{\mathcal W}$ at $\obs\eta = 0$. Since $(\hat u\cdot\mathbf
L)^{\mathsf T} = -\hat u\cdot\mathbf L$, the table $e^{i\obs\eta\,\hat u\cdot\mathbf L}$ is $\Lambda^{\mathsf T}$, and
solving for $\curv{\mathcal W}(\obs\eta)$ gives $\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$, which is [](#eq:rule), for
every reading and every rapidity. **A limit.** At $\obs\eta = 0$ the rule is the identity, and to first order in
$\obs\eta$ it is [](#eq:small-boost) again.

**Every observer.** A turned pixel reads $R^{\mathsf T}\curv{\mathcal W}R$, and every change of observer is a boost and a
turn, whose tables are the complex rotations one for one (section
[6.6](/tutorial/relativity/maxwell-complex/#the-turns-and-boosts-are-the-complex-rotations-one-for-one)). So every observer at
the event reads $P\curv{\mathcal W}P^{\mathsf T}$ with $P$ a complex rotation. For one plane wave, $\curv{\mathcal W} =
\curv c_2\,\vect m\vect m^{\mathsf T}$ becomes $\curv c_2(\Lambda\vect m)(\Lambda\vect m)^{\mathsf T} = f^2\curv
c_2\,\vect m'\vect m'^{\mathsf T}$, the claim of Step 1, for every direction of the wave and of the motion.

**A number.** A gradiometer in orbit at $7.5\unit{km\,s^{-1}}$, $7.0 \times 10^6\unit{m}$ from the Earth's centre, moves
across the line to the centre, where the tide's eigenvalues are $\curv w$, $\curv w$ and $-2\curv w$ with $\curv w =
G\matter M/r^3 = 1.16 \times 10^{-6}\unit{s^{-2}}$. By the imaginary part of [](#eq:small-boost), its own motion gives it
a magnetic part of size $3\curv w\,\obs v/c = 8.7 \times 10^{-11}\unit{s^{-2}}$, about fifty times the $1.6 \times
10^{-12}\unit{s^{-2}}$ that the Earth's spin makes there (section 7.2). By the real part, that spin changes its tide by
only about $8 \times 10^{-17}\unit{s^{-2}}$. Near slow matter the two halves of one small boost differ by the factor
$\obs v/c$ by which the magnetic part is the smaller field.

## The eigenvalues are the same for every observer

The boost is complex orthogonal, $\Lambda^{\mathsf T}\Lambda = 1$ (section
[6.6](/tutorial/relativity/maxwell-complex/#one-complex-number-is-the-same-for-every-observer)), so $\Lambda^{\mathsf T} =
\Lambda^{-1}$, and a real turn has $R^{\mathsf T} = R^{-1}$. Both rules therefore have the form $P\curv{\mathcal
W}P^{-1}$, with $P = \Lambda$ or $P = R^{\mathsf T}$. Two tables related in this way are **similar**: the second is the
first written in other axes. If $\curv{\mathcal W}\mathbf v = \curv w\,\mathbf v$, then

$$\bigl(P\curv{\mathcal W}P^{-1}\bigr)(P\mathbf v) = P\curv{\mathcal W}\mathbf v = \curv w\,(P\mathbf v),$$

so every eigenvalue of $\curv{\mathcal W}$ is an eigenvalue of the new table, with the eigenvector $P\mathbf v$, and the same
argument with $P^{-1}$ runs back. The three eigenvalues $\sym{weyl-eigenvalue}{\curv w_a}$, and with them the invariants
$\sym{invariant-i}{I} = \mathrm{tr}\,\curv{\mathcal W}^2$ and $\sym{invariant-j}{J} = \mathrm{tr}\,\curv{\mathcal W}^3$ of
section 9.2, are the same for every observer at the point:

$$\boxed{\;\curv w_a' = \curv w_a, \qquad I' = I, \qquad J' = J .\;}$$

**The count.** The eigenvalues are three complex numbers adding to zero (the table has no trace), so two are free: four
real numbers that no observer can change. **A number.** For the person of 70 kg a metre away, $I = 1.31 \times
10^{-16}\unit{s^{-4}}$ and $J = -6.12 \times 10^{-25}\unit{s^{-6}}$ (section 9.2), for a pixel at rest there and for one
passing at $0.6c$ alike. What does change is the size of the reading, $|\curv\tE|^2 + |\curv\tB|^2$ (Figure [](#fig:same-eigenvalues)).
**A limit.** At $\obs\eta = 0$, $\Lambda = 1$ and nothing changes.

![Look first at the numbers under the two panels: the moving pixel feels a stronger stretch and a twist that the
pixel at rest does not, yet both find the same three eigenvalues. Readings computed from the rule; movements
exaggerated.](tut-same-eigenvalues){#fig:same-eigenvalues}

## Ten numbers are four invariants, three angles and a velocity

We assume that **the eigenvalues are all different**. Section 9.2 then wrote
the reading as

$$\curv{\mathcal W} = P\,\mathrm{diag}(\curv w_1, \curv w_2, \curv w_3)\,P^{\mathsf T}, \qquad P = R_0\,e^{iK_0},$$

with $\sym{complex-rotation}{P}$ a complex rotation, $\sym{polar-turn}{R_0}$ a real turn and $\sym{polar-boost}{K_0} =
-\obs\eta\,\hat u\cdot\mathbf L$ real and antisymmetric, so that $e^{iK_0}$ is the boost $\Lambda$ of rapidity $\obs\eta$
along a unit vector $\hat u$.[^polar] With $D = \mathrm{diag}(\curv w_1, \curv w_2, \curv w_3)$ and $(e^{iK_0})^{\mathsf T}
= e^{-iK_0}$,

$$\curv{\mathcal W} = R_0\,e^{iK_0}\,D\,e^{-iK_0}\,R_0^{\mathsf T} .$$

**The observer for whom stretch and twist share axes.** A turn carries the generators as it carries vectors,
$R_0(\hat u\cdot\mathbf L)R_0^{\mathsf T} = (R_0\hat u)\cdot\mathbf L$, because both send $\vect x$ to $(R_0\hat
u)\times\vect x$. So a second pixel at the same place, moving relative to the first with rapidity $\obs\eta$ along
$-R_0\hat u$, has the boost $R_0e^{-iK_0}R_0^{\mathsf T}$, and by [](#eq:rule) it reads

$$R_0e^{-iK_0}R_0^{\mathsf T}\,\curv{\mathcal W}\,R_0e^{iK_0}R_0^{\mathsf T} = R_0\,D\,R_0^{\mathsf T} .$$

Its tide $R_0\,\mathrm{Re}(D)\,R_0^{\mathsf T}$ and its magnetic part $R_0\,\mathrm{Im}(D)\,R_0^{\mathsf T}$ are both diagonal
along the columns of $R_0$. This observer is the field's **principal observer**, and its frame the field's **rest frame**
of section [0.4](/tutorial/evening/one-pixel/#the-ten-numbers-regroup-into-four-invariants-three-angles-and-a-velocity).
The columns of $R_0$ are the **field's own axes**, and their orientation is three angles. The first pixel moves relative to
the principal observer with the velocity

$$\boxed{\;\obs{\vect v} = c\tanh\obs\eta\;R_0\hat u ,\;} \label{eq:velocity}$$

three numbers. So the ten numbers are four in the eigenvalues, three in $R_0$ and three in $\obs\eta\hat u$: $10 = 4 + 3 +
3$ (Figure [](#fig:ten-regroup)). The columns of $R_0$ must be taken right-handed, $\det R_0 = +1$, as for any turn.
Left-handed columns would reverse the velocity.

**Only one such observer.** Suppose a boost $\Lambda$ left the principal reading unchanged, $\Lambda D\Lambda^{\mathsf T} =
D$. Since $\Lambda^{\mathsf T} = \Lambda^{-1}$, this says $\Lambda D = D\Lambda$, whose entry $bc$ is $\Lambda_{bc}(\curv
w_c - \curv w_b) = 0$. With different eigenvalues every entry off the diagonal vanishes. A diagonal table with
$\Lambda^{\mathsf T}\Lambda = 1$ and determinant one, as a boost has, has entries $\pm1$ with an even number of minus
signs: no change or a half turn, never a boost. So for three different eigenvalues the principal observer is unique (up to
the order of its axes), as Costa, Wylleman and Natário state [@CostaWyllemanNatario2021]. It is the rest frame of the
matter only when the source is **stationary**, its field unchanging in time in some frame.

**The frame of the least reading.** The sum $|\curv\tE|^2 + |\curv\tB|^2 = \sum_{ij}|\curv{\mathcal W}_{ij}|^2$ is twice
the super-energy $\sym{super-energy}{u}$ of section [8.4](/tutorial/quantum/spin/), in $\mathrm{s^{-4}}$. Schur's theorem, proved in
[section 3.4](/tutorial/noise/symmetric-matrices/#every-square-matrix-is-triangular-in-some-set-of-perpendicular-complex-axes),
writes every square table as $U T U^\dagger$ with $U$ unitary and $T$ triangular, the eigenvalues on its diagonal. A
unitary table keeps the sum of the squared sizes of the entries (a boost, complex orthogonal but not unitary, changes it),
so

$$\sum_{ij}|\curv{\mathcal W}_{ij}|^2 = \sum_a|\curv w_a|^2 + \sum_{i<j}|T_{ij}|^2 \ge \sum_a|\curv w_a|^2 .$$

Equality needs a diagonal $T$. The principal reading $R_0DR_0^{\mathsf T}$ has it, because a real turn is unitary, so the
principal observer reads the least $|\curv\tE|^2 + |\curv\tB|^2$ of all observers at the place, $\sum_a|\curv w_a|^2$, the
statement of Ferrando and Sáez [@FerrandoSaez2012].

**Numbers.** Two masses in the ratio $1 : 0.45$ have the eigenvalues $-0.537$, $0.135$ and $0.402$ in the scene's units
(section 9.2). A pixel moving through them at $0.6c$ along the unit vector of $(0.30, 0.80, -0.52)$ reads a table with
complex entries and the same three real eigenvalues. Its polar decomposition, with $\det R_0 = +1$, gives $\obs\eta =
0.693147 = \ln 2 = \mathrm{artanh}\,0.6$, and [](#eq:velocity) returns the pixel's own velocity, $(0.180, 0.480,
-0.312)\,c$. Its $|\curv\tE|^2 + |\curv\tB|^2$ is $2.27$, and the principal observer's is $0.468 = \sum_a\curv w_a^2$, the
least value.

![Look first at the three groups at the bottom: the same ten numbers, regrouped by what an observer can change. The
eigenvalues no observer changes; the axes change with a turn; the velocity changes with a
boost.](tut-ten-regroup){#fig:ten-regroup}

## In a room at rest a pixel reads its own velocity

We want a pixel's velocity through a room it does not know. We assume that **every mass in the room is at rest in the
room's frame**. Then that frame reads no magnetic part (section 7.5), and its real symmetric reading has real eigenvalues
along three axes at right angles. If the eigenvalues are different, the room's frame is the principal observer, and a
pixel moving through the room finds, by [](#eq:velocity), its velocity relative to the room, at any speed and from one
reading. This is the pixel of the figure above.

**At first order.** We want the formula a slow pixel uses. In the room's principal axes, taken right-handed, the tide is
$\curv\tE = \mathrm{diag}(\curv\lambda_1, \curv\lambda_2, \curv\lambda_3)$, with $\sym{tide-eigenvalue}{\curv\lambda_a}$
its eigenvalues in $\mathrm{s^{-2}}$. The entry $bc$ of $[\hat u\cdot\mathbf L, \curv\tE]$ is $(\hat u\cdot\mathbf
L)_{bc}(\curv\lambda_c - \curv\lambda_b)$, with $(\hat u\cdot\mathbf L)_{bc} = -\epsilon_{kbc}\hat u_k$, so
[](#eq:first-order) gives $\curv\tB'_{bc} = \epsilon_{kbc}(\obs v_k/c)(\curv\lambda_c - \curv\lambda_b)$. For $(a, b, c)$
in the order $(1, 2, 3)$, $(2, 3, 1)$ or $(3, 1, 2)$ only $k = a$ survives, with $\epsilon_{abc} = 1$:

$$\boxed{\;\curv\tB_{bc} = \frac{\obs v_a}{c}\,(\curv\lambda_c - \curv\lambda_b), \qquad (a, b, c)\ \text{cyclic},\;}$$

and the diagonal entries vanish, because $\epsilon_{kbb} = 0$.[^speedometer] Here $\obs v_a$ is the pixel's velocity
through the room along the axis $a$. In left-handed axes every sign flips. Read backwards, $\obs v_a = c\,\curv\tB_{bc}/(\curv\lambda_c
- \curv\lambda_b)$.

**Its precision.** We assume **independent Gaussian noise of standard deviation $\sigma_n$ on each of the five
coefficients of $\curv\tB$ in the orthonormal basis of section 1.5** (section
[3.1](/tutorial/noise/probability/#most-noise-follows-the-gaussian-bell)). An entry off the diagonal is its coefficient
divided by $\sqrt2$, because the basis table of section
[1.5](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length) for it has
$1/\sqrt2$ in two places, so the entry carries $\sigma_n/\sqrt2$. Dividing by the gap between the two eigenvalues gives the
standard deviation $\sym{standard-deviation}{\sigma_v}$ of each component of the velocity read:

$$\boxed{\;\sigma_v = \frac{c\,\sigma_n}{\sqrt2\,|\curv\lambda_b - \curv\lambda_c|} .\;} \label{eq:precision}$$

The unit is that of $c$, since $\sigma_n$ and the gap are both in $\mathrm{s^{-2}}$.

**Numbers.** A tide whose eigenvalues are $10^{-8}\unit{s^{-2}}$ apart, read to one part in $10^8$, so $\sigma_n =
10^{-16}\unit{s^{-2}}$, gives $\sigma_v = 3.00 \times 10^8 \times 10^{-16}/(1.414 \times 10^{-8}) = 2.1\unit{m\,s^{-1}}$,
about two metres per second, a walking pace. Beside the person a metre away the eigenvalues are $-2\curv w$, $\curv w$ and
$\curv w$, with $\curv w = G\matter M/r^3 = 4.67 \times 10^{-9}\unit{s^{-2}}$. The two components across the line to the
person face the gap $3\curv w = 1.40 \times 10^{-8}\unit{s^{-2}}$ and are read to $1.5\unit{m\,s^{-1}}$. The component
along the line faces the gap between the two equal squeezes, zero.

**The blind spot of a round body.** For one round body along $\hat n$, a boost along $\hat n$ changes nothing at any speed.
The table $\hat n\cdot\mathbf L$ commutes with $\hat n\hat n^{\mathsf T}$, because $[\hat n\cdot\mathbf L, \hat n\hat
n^{\mathsf T}] = (\hat n\times\hat n)\hat n^{\mathsf T} + \hat n(\hat n\times\hat n)^{\mathsf T} = 0$, so its exponential
$\Lambda$ commutes with $\curv{\mathcal W} = \curv w(1 - 3\hat n\hat n^{\mathsf T})$, and $\Lambda\curv{\mathcal
W}\Lambda^{\mathsf T} = \Lambda\curv{\mathcal W}\Lambda^{-1} = \curv{\mathcal W}$. A pixel flying straight at the body at
$0.3c$ reads exactly the same table as a pixel at rest, with no magnetic part. Its radial speed is unreadable: this is the
**radial blind spot** (Figure [](#fig:speedometer-gap)). A second body gives three different eigenvalues and removes it
everywhere off the line through the two bodies;[^line] so does a body that is not round, off any axis of symmetry.

![Look first at the dashed bracket: equal squeezes leave the speed along the line to a round body unreadable, while
every gap between different eigenvalues reads a component of the velocity, more sharply the wider it is. Line
exact.](tut-speedometer-gap){#fig:speedometer-gap}

::: try {#speedometer}
A pixel crossing a room of four masses, with the velocity it reads from gravity, the velocity light would give it, and
under the path the motion test, the largest imaginary part of the eigenvalues over their largest size. Predict first: if
you raise the pixel's speed to $0.6c$ and turn its heading, will the motion test move off its floor? Then do it. Next set
*One of the masses* to *Flies*, $0.05c$, and say why no speed or heading of the pixel brings the test back down; then try
*Walks*, $1.5\unit{m\,s^{-1}}$. Afterwards, watch light's arrow and say which part of the velocity it misses, and why.
:::

## Complex eigenvalues mean that something in the room moves or turns

We want what a reading with complex eigenvalues says. If any observer at the place reads no magnetic part, its table is
real and symmetric, with real eigenvalues, and by the third section every observer finds those. So complex eigenvalues mean
that no observer reads $\curv\tB = 0$: the masses are not all at rest in one frame, something turns, or a wave crosses the
room. The pixel's own motion cannot make them complex. One body moving steadily has the real eigenvalues of its own rest
frame, and a mass moving straight at the pixel adds no magnetic part at first order (section
[7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)).

**Turning puts a phase on the eigenvalues.** Above a pole of a round body of mass $\matter M$
spinning with the angular momentum $\matter Mca\,\hat z$, which defines $\sym{kerr-parameter}{a}$, Kerr's spin parameter,
a length. The pixel is on the axis at the distance $r$, so the unit vector toward the body is $\hat n = -\hat z$. Section
7.5 found the magnetic part of such a [spin
dipole](/tutorial/geometry/gravitomagnetism/#a-spinning-round-body-is-a-spin-dipole); with this angular momentum it is

$$\begin{aligned}\curv\tB_{ij} = -\frac{3G\matter Ma}{r^4}\Bigl[&\hat z_i\hat n_j + \hat n_i\hat z_j\\ &+ (\hat
z\cdot\hat n)(\delta_{ij} - 5\hat n_i\hat n_j)\Bigr] .\end{aligned}$$

With $\hat z\cdot\hat n = -1$ the bracket is $-2\hat z\hat z^{\mathsf T} - (1 - 5\hat z\hat z^{\mathsf T}) = -(1 - 3\hat
z\hat z^{\mathsf T})$, so $\curv\tB = (3G\matter Ma/r^4)(1 - 3\hat z\hat z^{\mathsf T})$, in $\mathrm{s^{-2}}$. The tide is
$(G\matter M/r^3)(1 - 3\hat z\hat z^{\mathsf T})$, and

$$\curv{\mathcal W} = \frac{G\matter M}{r^3}\Bigl(1 + \frac{3ia}{r}\Bigr)(1 - 3\hat z\hat z^{\mathsf T}) .$$

Every eigenvalue carries the phase $3a/r$. Kerr found [@Kerr1963] that for a spinning black hole the eigenvalues are proportional to $(r -
ia\cos\vartheta)^{-3}$, with $\vartheta$ the angle from the spin axis, which to first order in $a$ is $r^{-3}(1 +
3ia\cos\vartheta/r)$ outside any round spinning body; on the axis it is ours.

**Off the axis.** We derive the first-order phase at any angle $\vartheta$ from the spin axis. The unit vector $\hat n$
from the pixel to the body now has $\hat z\cdot\hat n = -\cos\vartheta$, and we split $\hat z = (\hat z\cdot\hat n)\hat n +
\hat z_\perp$ into its parts along the line to the body and across it. Then $\hat z\hat n^{\mathsf T} + \hat n\hat
z^{\mathsf T} = \hat z_\perp\hat n^{\mathsf T} + \hat n\hat z_\perp^{\mathsf T} + 2(\hat z\cdot\hat n)\,\hat n\hat
n^{\mathsf T}$, and the bracket of the spin dipole becomes $(\hat z\cdot\hat n)(1 - 3\hat n\hat n^{\mathsf T}) + \hat
z_\perp\hat n^{\mathsf T} + \hat n\hat z_\perp^{\mathsf T}$. Adding the tide,

$$\begin{aligned}\curv{\mathcal W} = {}&\frac{G\matter M}{r^3}\Bigl(1 + \frac{3ia\cos\vartheta}{r}\Bigr)(1 - 3\hat n\hat
n^{\mathsf T})\\ &- \frac{3iG\matter Ma}{r^4}\bigl(\hat z_\perp\hat n^{\mathsf T} + \hat n\hat z_\perp^{\mathsf
T}\bigr) .\end{aligned}$$

The first term has the tide's eigenvalues times $1 + 3ia\cos\vartheta/r$. The second only joins the line to the body to
the plane across it: in the tide's axes, the line and any two directions across it, it has nothing on the diagonal and
nothing inside the plane, where the two equal eigenvalues lie. An eigenvalue moves at first order by its diagonal entry
(the note on the Earth below), so the second term moves the eigenvalues only at second order in $a$. **To first order
every eigenvalue carries the phase $3a\cos\vartheta/r$**, which is $3a/r$ on the axis and zero on the equator, as Kerr's
form says. **A number.** At latitude $45°$ on the Earth, $\vartheta = 45°$ and the phase is $1.54 \times 10^{-6} \times
0.707 = 1.09 \times 10^{-6}$, whatever the pixel's own motion, since no motion changes the eigenvalues.

**The Earth at a pole.** The Earth's angular momentum, $5.86 \times 10^{33}\unit{kg\,m^2\,s^{-1}}$ (section 7.5), divided
by $\matter Mc$ gives $a = 3.27\unit{m}$. A pixel resting on the ground at a pole does not move, and at the surface there,
$r = 6.357 \times 10^6\unit{m}$, its eigenvalues carry the phase $3a/r = 1.54 \times 10^{-6}$.

**The Earth on the equator.** A pixel at rest on the ground moves east at $\Omega R = 465\unit{m\,s^{-1}}$ through the
field of a turning planet. Section 7.5 found that both effects give only the entry $\curv\tB_{xz}$, with $x$ up and $z$
along the axis, so $\curv\tB$ has no diagonal entry in the tide's principal axes, and to first order the eigenvalues stay
real.[^shift] The pixel reads a velocity from the first-order formula above with $(a, b, c) = (y, z, x)$ and the
eigenvalues $\curv\lambda_x = -2\curv w$, $\curv\lambda_z = \curv w$, $\curv w = G\matter M/R^3$: $\curv\tB_{zx} = -3\curv
w\,\obs v_y/c$. Setting this equal to $\curv\tB_{zx} = -(3G\matter M\Omega/cR^2)(1 - C/\matter MR^2)$ of section 7.5 gives

$$\begin{aligned}\obs v_y &= \Bigl(1 - \frac{C}{\matter MR^2}\Bigr)\Omega R\\ &= 0.669 \times 465\unit{m\,s^{-1}} =
311\unit{m\,s^{-1}},\end{aligned}$$

with $C$ the moment of inertia (not $I$, which is the invariant; $C/\matter MR^2$ is the 0.3307 of section 7.5). The
planet's spin takes back the share $C/\matter MR^2$ of the ground's speed.[^earth]

## Light reads only two components of its own velocity; gravity reads three

Section [6.6](/tutorial/relativity/maxwell-complex/#one-complex-number-is-the-same-for-every-observer) found that light's
$\light{\vect F}$ has one complex invariant, $\light{\vect F}\cdot\light{\vect F}$, and that in the frame where
$\light{\vect E}$ and $\light{\vect B}$ are parallel, $\light{\vect F} = w\hat n$, a turn about $\hat n$ or a boost along
it changes nothing. Sensors that differ by such a boost read the same, so light's six numbers are two in the complex
invariant, two angles for the direction $\hat n$, and two components of the sensor's velocity across $\hat n$: $6 = 2 + 2 +
2$. For gravity with three different eigenvalues the section on ten numbers showed that no boost keeps the principal
reading, so a pixel reads all three components: $10 = 4 + 3 + 3$. Only a reading with two equal eigenvalues, a round
body's, has light's blind spot, along the line to the body.

## How large the magnetic part is, and where the field points

In a wave $\curv\tB$ is $\curv\tE$ turned by 45° about the direction of travel, so the two have the same size (section
[7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45)). Near slow matter
section 7.5 found $\sqrt3\,\obs v_\perp/c$, $8.1 \times 10^{-9}$ for a person walking past a metre away, and for the part
of the tide that changes at the angular frequency $\omega$ a magnetic part about $\omega r/c$ times as large:

$$\frac{|\curv\tB|}{|\curv\tE|} = 1\ \text{(wave)}, \qquad \frac{|\curv\tB|}{|\curv\tE|}\ \text{is of the order
of}\ \frac{\obs v}{c}\ \text{(near field)} .$$

**Many waves.** For waves from independent sources the cross terms between different waves in $|\curv\tB|^2$ and
$|\curv\tE|^2$ average to zero over time, while each wave has $|\curv\tB_k| = |\curv\tE_k|$. So $\langle|\curv\tB|^2\rangle
= \langle|\curv\tE|^2\rangle$: the first ratio holds in mean square, and the magnetic part detects radiation that
nearby slow masses barely touch.[^ratio] Two equal waves running in opposite directions with one polarization make a
**standing wave**, whose crests stay in place (section [5.1](/tutorial/waves/wave-equation/)). At its antinodes the tides
add, while the magnetic parts, which change sign with the direction of travel, cancel.

**A fast pixel.** Near slow matter the ratio is small, but a pixel moving fast enough raises it to one for every field,
as section [6.6](/tutorial/relativity/maxwell-complex/#a-sensor-moving-fast-enough-reads-every-field-as-a-wave-coming-at-it)
found for light. With $K = \hat u\cdot\mathbf L$, $K^2$ removes the part of a vector along $\hat u$ and reverses the rest,
so $K^3 = -K$, and the series for $\Lambda$ sums, as in section 6.6, to

$$\Lambda = 1 - i\sinh\obs\eta\,K + (1 - \cosh\obs\eta)\,K^2 .$$

For a large rapidity $\cosh\obs\eta \approx \sinh\obs\eta \approx e^{\obs\eta}/2$, and $\Lambda \approx
\tfrac12e^{\obs\eta}(-iK - K^2)$. Let $\vect m$ be the unit null vector of section 9.1 for the direction $\hat u$, so that
$K\vect m = -i\vect m$, $K\vect m^* = i\vect m^*$ and $K\hat u = 0$. Then $-iK - K^2$ sends $\vect m$ and $\hat u$ to zero
and $\vect m^*$ to $2\vect m^*$: it is $2\vect m^*\vect m^{\mathsf T}$. So $\Lambda \approx e^{\obs\eta}\vect m^*\vect
m^{\mathsf T}$, and

$$\boxed{\;\Lambda\curv{\mathcal W}\Lambda^{\mathsf T} \approx e^{2\obs\eta}\,\curv c_{-2}\,\vect m^*\vect m^{*\mathsf
T}, \qquad \curv c_{-2} = \vect m^{\mathsf T}\curv{\mathcal W}\vect m ,\;}$$

with $\curv c_{-2}$ the reading's component of weight $-2$ about $\hat u$ (section 9.1, where $T_{-2} = \vect m^*\vect
m^{*\mathsf T}$ has length one). The table $\vect m^*\vect m^{*\mathsf T}$ is the square of a wave travelling along $-\hat
u$, toward the pixel from ahead. Its real and imaginary parts have the same size, so $\curv\tE'$ and $\curv\tB'$ both grow
as $e^{2\obs\eta} \approx 4\obs\gamma^2$, and $|\curv\tB'|/|\curv\tE'| \to 1$. The invariants stay fixed, and with them
$\mathrm{Re}\,I = |\curv\tE'|^2 - |\curv\tB'|^2$, so the squared ratio is $1 - \mathrm{Re}\,I/|\curv\tE'|^2$.[^fast]

**A number.** One mass along $\hat y$, in units of its $\curv w$, with the pixel moving along $\hat x$, has $\vect m = (\hat
y + i\hat z)/\sqrt2$ and $\curv c_{-2} = \vect m^{\mathsf T}(1 - 3\hat y\hat y^{\mathsf T})\vect m = -1.5$. At $0.6c$ the
ratio $|\curv\tB'|/|\curv\tE'|$ is $0.85$. At $0.99c$, $e^{2\obs\eta} = (1 + \obs\beta)/(1 - \obs\beta) = 199$, the reading
has the size $|\curv{\mathcal W}'| = 298.5$, equal to $199 \times 1.5$, and the ratio is $0.99993$. **The exception** is
$\curv c_{-2} = 0$, when the leading term vanishes: by section 9.4 the pixel then moves along a principal null direction.
On the line to a round body, the blind spot above, nothing grows at all.

**The present position.** We want where the stretch axis of a mass moving steadily points, as section
[6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now) promised. Let
$\vect r$ point from the pixel to where the mass is now, at the pixel's time, and let $\sym{rest-frame-distance}{R_*}$ be
the distance in the mass's own frame of section 6.3. There the reading is real, $\curv{\mathcal W}_0 = \curv w_0(1 - 3\hat
n_0\hat n_0^{\mathsf T})$, with $\curv w_0 = G\matter M/R_*^3$ and, by the result of section 6.3, $\hat n_0 =
(\obs\gamma\vect r_\parallel + \vect r_\perp)/R_*$, the parts along and across the motion. The pixel moves relative to the
mass with rapidity $\obs\eta$ along $\hat u$, and $\obs\gamma = \cosh\obs\eta$. Its boost leaves the part of $\hat n_0$
along $\hat u$ alone and turns the part across it by the imaginary angle:

$$\begin{aligned}\Lambda\hat n_0 &= \mathbf t - i\,\mathbf s,\\ \mathbf t &= \hat n_{0\parallel} +
\cosh\obs\eta\,\hat n_{0\perp},\\ \mathbf s &= \sinh\obs\eta\,\hat u\times\hat n_0 .\end{aligned}$$

Since $\Lambda\Lambda^{\mathsf T} = 1$, the rule gives $\curv w_0\bigl[1 - 3(\Lambda\hat n_0)(\Lambda\hat n_0)^{\mathsf
T}\bigr]$, whose real part is the moving pixel's tide,

$$\curv\tE = \curv w_0\bigl(1 - 3\,\mathbf t\mathbf t^{\mathsf T} + 3\,\mathbf s\mathbf s^{\mathsf T}\bigr) .$$

The vectors $\mathbf t$ and $\mathbf s$ are at right angles, so $\mathbf t$ is an axis of this tide, with the negative
eigenvalue $\curv w_0(1 - 3|\mathbf t|^2)$, the stretch. With the $\hat n_0$ of section 6.3 it is

$$\boxed{\;\mathbf t = \frac{\obs\gamma\,\vect r}{R_*} .\;}$$

The stretch axis points at where the mass is now, at every speed. **A number.** At closest approach at $0.6c$, $|\mathbf
t|^2 = 1.5625$, so the stretch is $-3.69\,\curv w_0$, against $-2\curv w_0$ at rest, while the mass's light arrives from
$36.9°$ behind it, the $\tan\delta = \sinh\obs\eta = 0.75$ of section 6.3.[^present]

{{paper fig:present}}

**The idea to keep: every observer reads a pixel's one complex table turned, by a real angle for a turn and by an
imaginary one for a boost, so its four invariants are the same for all, and the other six are the field's axes and the
velocity of its principal observer. So a pixel among masses at rest reads its own velocity, and complex eigenvalues mean
that something in the scene moves.**

::: problems
### Practice

**[9.3]** A pixel reads a tide whose eigenvalues differ by $10^{-8}\unit{s^{-2}}$, with noise $10^{-16}\unit{s^{-2}}$. How
well does it know its speed?

::: solution
To about $2\unit{m\,s^{-1}}$ for each component, by [](#eq:precision).
:::

**[9.3]** A pixel moves at $0.6c$ along $x$ past one mass on its $y$ axis, where at rest $\curv{\mathcal W} = \curv w\,
\mathrm{diag}(1, -2, 1)$. Using the $\Lambda$ of section 6.6, compute the reading, its eigenvalues and the largest entry of
$\curv\tB$.

::: solution
With the rows of $\Lambda$ given in the second section, the reading has $1$ in the place $xx$ and, in the $yz$ block,
$\curv{\mathcal W}_{yy} = 1.25^2(-2) + (0.75i)^2 = -3.6875$, $\curv{\mathcal W}_{zz} = (-0.75i)^2(-2) + 1.25^2 = 2.6875$ and
$\curv{\mathcal W}_{yz} = 1.25(-2)(-0.75i) + 0.75i \times 1.25 = 2.8125i$, all times $\curv w$. The block has trace $-1$ and
determinant $-9.91 + 7.91 = -2$, so its eigenvalues are 1 and $-2$: the eigenvalues stay $\curv w(1, 1, -2)$. The largest
entry of $\curv\tB$ is $2.81\,\curv w = 3\cosh\obs\eta\sinh\obs\eta\,\curv w$.
:::

**[9.3]** A plane wave travels along $\hat z$, $\curv{\mathcal W} = \curv c_2\,\vect m\vect m^{\mathsf T}$ with $\vect m =
(1, i, 0)/\sqrt2$, and a pixel moves along $\hat z$. Use [](#eq:small-boost) to find $\dd\curv{\mathcal W}/\dd\obs\eta$,
and solve for $\curv{\mathcal W}(\obs\eta)$.

::: solution
With $\hat u = \hat z$, $(\hat z\cdot\mathbf L)\vect m = \hat z\times\vect m = -i\vect m$, so $[\hat z\cdot\mathbf L,
\vect m\vect m^{\mathsf T}] = (-i\vect m)\vect m^{\mathsf T} + \vect m(-i\vect m)^{\mathsf T} = -2i\,\vect m\vect
m^{\mathsf T}$. Then $\dd\curv{\mathcal W}/\dd\obs\eta = -i(-2i)\curv{\mathcal W} = -2\curv{\mathcal W}$, and
$\curv{\mathcal W}(\obs\eta) = e^{-2\obs\eta}\curv{\mathcal W}$: the Doppler factor squared of Step 1.
:::

**[9.3]** At what latitude on the Earth is the phase of the eigenvalues half its value at a pole, and what is it there?

::: solution
The phase is $3a\cos\vartheta/r$, so it halves at $\vartheta = 60°$ from the axis, the latitude $30°$, where it is
$7.7 \times 10^{-7}$.
:::

### Stretch

Combine with section 6.6. A pixel moves along $\hat x$ past one mass on its $y$ axis. Using the reading of the second
practice problem, with $\cosh\obs\eta$ and $\sinh\obs\eta$ in place of 1.25 and 0.75, show that $|\curv\tE'|^2 -
|\curv\tB'|^2 = 6\curv w^2$ at every speed, and find $|\curv\tB'|/|\curv\tE'|$ at $0.9c$.

::: solution
Write $C = \cosh\obs\eta$ and $S = \sinh\obs\eta$. In units of $\curv w$ the tide has the diagonal $1$, $-(2C^2 + S^2)$
and $2S^2 + C^2$, and the magnetic part has $3CS$ in the places $yz$ and $zy$. So $|\curv\tE'|^2 - |\curv\tB'|^2 = 1 +
5C^4 + 5S^4 + 8C^2S^2 - 18C^2S^2 = 1 + 5(C^2 - S^2)^2 = 6$. At $0.9c$, $C = 2.294$ and $S = 2.065$, so $|\curv\tB'|^2 =
18C^2S^2 = 403.9$ and $|\curv\tE'|^2 = 409.9$, and the ratio is $0.993$. It is the $\mathrm{Re}\,I = 6\curv w^2$ of
one mass, which no boost changes.
:::


Combine with section 7.5. Check that [](#eq:first-order) gives a ground pixel on the equator, moving at $465\unit{m\,
s^{-1}}$ through a planet that does not spin, a magnetic part of size $3G\matter M\Omega/cR^2$, and with the spin $4.8
\times 10^{-12}\unit{s^{-2}}$.

::: solution
By the check of the second section, with $\hat n$ toward the centre and the velocity across it, the one entry has the size
$3(G\matter M/R^3)(\Omega R/c) = 3G\matter M\Omega/cR^2 = 7.15 \times 10^{-12}\unit{s^{-2}}$ for $G\matter M = 3.986 \times
10^{14}\unit{m^3\,s^{-2}}$, $\Omega = 7.29 \times 10^{-5}\unit{s^{-1}}$ and $R = 6.378 \times 10^6\unit{m}$. The spin of
section 7.5 takes back the share 0.3307, leaving $7.15 \times 0.669 = 4.79 \times 10^{-12}\unit{s^{-2}}$.
:::

### The camera

The principal observer reads the least $|\curv\tE|^2 + |\curv\tB|^2$, equal to $\sum_a|\curv w_a|^2$. Check it for the
pixel of the second practice problem. Which observer reads that least value, how fast does the pixel move relative to it,
and is that observer the only one?

::: solution
The moving pixel reads $|\curv\tE|^2 + |\curv\tB|^2 = (1 + 3.6875^2 + 2.6875^2 + 2 \times 2.8125^2)\,\curv w^2 =
37.6\,\curv w^2$, while $\sum_a\curv w_a^2 = (1 + 1 + 4)\,\curv w^2 = 6\,\curv w^2$, which the mass's own frame reads,
because there $\curv\tB = 0$. The pixel moves relative to that frame at $c\tanh(\ln2) = 0.6c$. The frame is not the only
one: one mass has two equal eigenvalues, and any further boost along the $y$ axis commutes with the reading. This is the
blind spot, and the reason [](#eq:velocity), derived for different eigenvalues, does not apply.
:::
:::

::: paper
- Section VIII's plain words, *What every observer agrees on*: the regrouping, the speedometer and the test for motion.
- Section VIII's [*One complex matrix*](/paper/#par:one-complex-matrix) and
  [*The magnetic part*](/paper/#par:the-magnetic-part): the table, its invariants, the ratio and the standing wave.
- Section VIII's [*Ten numbers*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity): the polar form, the
  speedometer, Kerr's phase, the $311\unit{m\,s^{-1}}$, light's two components and the blind spot of a round body.
- Section VIII's [*The absence of gravitational
  aberration*](/paper/#par:the-absence-of-gravitational-aberration): the stretch axis at the present position.
- Section II's [*The Earth's own tide*](/paper/#par:the-earths-own-tide): the equator's magnetic part, which here becomes
  a velocity.
:::

::: deeper
- The GR course's [section 9.3](https://neovand.github.io/general-relativity/chapter-9.html#9-3-extracting-the-trace-free-remainder-the-weyl-tensor)
  extracts the Weyl tensor, and its
  [section 10.7](https://neovand.github.io/general-relativity/chapter-10.html#10-7-scalar-invariants-are-powerful-but-spacetime-has-a-loophole)
  builds invariants like $I$ and $J$.
- L. F. O. Costa, L. Wylleman and J. Natário, on the principal observer and its uniqueness
  [@CostaWyllemanNatario2021; @WyllemanCostaNatario2021], and J. J. Ferrando and J. A. Sáez on the frame of the least
  reading [@FerrandoSaez2012].
- R. Penrose and W. Rindler, *Spinors and Space-Time*, vol. 1 (Cambridge, 1984): the spinors that prove the boost rule.
:::

[^speed]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its Fig. [](/paper/#fig:speedometer).

[^W]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation [](/paper/#eq:W); its
    invariants are the equation [](/paper/#eq:invariants).

[^five]: Section 9.5 finds the five squares for a given reading.

[^polar]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation [](/paper/#eq:polar).

[^speedometer]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:speedometer).

[^line]: On that line the field is symmetric about it, two eigenvalues stay equal, and a boost along it still leaves
    $\curv\tB' = 0$.

[^shift]: To first order an eigenvalue $\curv\lambda_a$ with the unit axis $\mathbf u_a$ moves by $i\,\mathbf
    u_a\cdot\curv\tB\mathbf u_a$. Here that entry is zero, and so are the entries of $\curv\tB$ in the plane of the two
    equal squeezes.

[^earth]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, in the paragraph
    [*The Earth's own tide*](/paper/#par:the-earths-own-tide).

[^ratio]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:magnetic-ratio).

[^fast]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. XI, in the paragraph
    [*Through a room at nearly the speed of light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light).

[^present]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, whose Fig. [](/paper/#fig:present)
    draws it.
