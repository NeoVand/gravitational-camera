---
id: R7
title: 'Reading Section II again, the relativistic half'
question: "With Part 7 behind us, can we now derive the claims of Section II that reading chapter R1 left to Einstein's theory, and does every number still come out as the paper says?"
part: '7'
requires: ['R1', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6']
paper: [sec:pixel, eq:tidal, eq:deviation, eq:newton, eq:wave, eq:magnetic, fig:tidal, fig:tidal-field, eq:magnetic-point, eq:current-column]
figures: [fig:tidal, fig:tidal-field]
live: [tidal-rings]
---

The paper's Figure [](/paper/#fig:tidal), below, draws three rings of free balls. Reading chapter
[R1](/tutorial/newton/reading-section-ii/) explained the first, beside a mass, with Newton's law. It left to Part 7 the
two rings in a gravitational wave, together with the tide as curvature and the twisting magnetic part. With Part 7
behind us, can we now derive these claims, and does every number still come out as the paper says?

{{paper fig:tidal}}

This chapter reads those stretches of [Section II](/paper/#sec:pixel) again, in order (Figure
[](#fig:read-ii-again-map)), and derives nothing new. Each claim gets its chapter and one of R1's marks; *checked here*
now means that Part 1 or Part 7 has derived it and this chapter recomputes its numbers.

::: plain
Part 7 derives the parts of Section II that need Einstein's theory. Falling freely
removes the pull of gravity at one point but not the curvature of spacetime, and the tide that a pixel reads is one part
of that curvature. Near slowly moving matter this part is Newton's tide. In a gravitational wave it is minus half the
acceleration of the wave's strain. The strain is the difference between the fractional changes in length of a
detector's two arms, and each arm changes by half of it, one getting longer while the other gets shorter.

The magnetic part, which turns neighbouring gyroscopes, comes from motion. Near ordinary matter it is smaller than the
tide by about the speed of the matter divided by the speed of light, but in a wave the two are equal.
:::

![Look first at the filled boxes: every stretch of Section II that reading chapter R1 left to Einstein's theory is
now derived in Part 7, and only the quantum limit (8.6) and the complex table $\curv{\mathcal W}$ at a general point
(9.3) are still read. The dashed arrow marks the section's pointer to the waves of moving bodies, which reading
chapter R7b reads.](tut-read-ii-again-map){#fig:read-ii-again-map}

## The plain words hold in Einstein's theory

The [plain words](/paper/#sec:pixel) make these claims, in this order.

- "At any single point, therefore, the effect of gravity can be cancelled by falling freely." Chapter
  [7.1](/tutorial/geometry/metric/#falling-removes-the-fields-first-derivatives-at-a-point-but-not-its-second) showed
  it by a count, which it calls a sketch. The **metric**, the table of ten numbers at each event that turns coordinates
  into what clocks and rulers read, has 40 first derivatives at an event, and a change of coordinates has 40 free
  numbers with which to set them all to zero. Of its 100 second derivatives, 20 combinations survive: the **Riemann
  tensor**, the curvature of spacetime
  ([7.2](/tutorial/geometry/curvature-and-tides/#curvature-is-what-no-change-of-coordinates-removes); *checked here*,
  as a sketch).
- "The tide is the only effect of gravity that any detector can measure." For a detector that falls freely and reads
  at one place this follows, because at one point a relabelling of events can change everything except the curvature
  (7.1, and [7.4](/tutorial/geometry/linearized-gravity/#relabelling-the-coordinates-changes-the-table-not-the-curvature)
  for weak fields; *checked here* for such a detector).[^clocks]
- The stretch "exactly twice the squeeze" beside a single mass holds outside any round body in Einstein's theory too,
  from the vacuum equation and the symmetry alone
  ([7.3](/tutorial/geometry/einstein-equation/#a-single-mass-stretches-twice-as-hard-as-it-squeezes-in-einsteins-theory-too),
  *checked here*).
- The **magnetic part** of the tide "makes gyroscopes at neighbouring points turn slightly relative to one another."
  Chapter
  [7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)
  derived the rule: two gyroscopes a separation $\sym{separation}{\xi}_j$ apart, in metres, turn relative to each
  other at $\delta\Omega_i = \curv\tB_{ij}\xi_j/c$ radians per second, where $\sym{magnetic-tide}{\curv\tB}_{ij}$ is
  the magnetic part in $\mathrm{s^{-2}}$ and $c = 2.998\times10^8\unit{m\,s^{-1}}$ (*checked here*; applied on the
  equator [below](#the-premise-and-the-earths-own-tide-read-with-part-7)).
- It has "five independent numbers", because its trace is always zero and its antisymmetric part vanishes in empty
  space (7.5, *checked here*).
- "Near slowly moving matter it is very small…" The size of such a table is its **Frobenius norm**, the square root of
  the sum of the squares of its nine entries, in $\mathrm{s^{-2}}$: $|\curv\tB|^2 = \curv\tB_{ij}\curv\tB_{ij}$, and
  the same for the tide (7.5, 7.6). For a mass crossing the line of sight at the speed $v_\perp$, 7.5 found
  $|\curv\tB|/|\curv\tE| = \sqrt3\,v_\perp/c$, which is $8.1\times10^{-9}$ for the person walking across it at
  $1.4\unit{m\,s^{-1}}$ (*checked here*).
- "In a gravitational wave it is as strong as the first part": $|\curv\tB| = |\curv\tE|$
  ([7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45), *checked
  here*).
- For LIGO, "one arm becomes longer than the other by about $4\times10^{-18}$ metres…" A wave of strain $10^{-21}$
  lengthens one 4000 m arm by half the strain, $\tfrac12 \times 10^{-21} \times 4000\unit{m} = 2\times10^{-18}$ m,
  and shortens the other by the same
  ([7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain), *checked
  here*).

## Equations (1) and (2) are the curvature along the observer's time

The body of [Section II](/paper/#sec:pixel) defines the tide for an observer at rest, "with proper time $t$…". The
**proper time** is the time on the observer's own clock
([7.1](/tutorial/geometry/metric/#a-clocks-own-time-is-set-by-the-metric)):

{{paper eq:tidal}}

Here $\sym{tidal-tensor}{\curv\tE}_{ij}$ is the tide in $\mathrm{s^{-2}}$ and $R_{0i0j}$ are entries of the Riemann
tensor in $\mathrm{m^{-2}}$, so "the factor $c^2$ gives $\curv\tE_{ij}$ the units $\mathrm{s^{-2}}$" (*checked here*).
Chapter
[7.2](/tutorial/geometry/curvature-and-tides/#the-riemann-tensor-is-built-from-the-christoffel-symbols-yet-it-is-a-tensor)
built the tensor with the paper's sign, "$R^\alpha{}_{\beta\gamma\delta} = \partial_\gamma\Gamma^\alpha_{\beta\delta} -
\dots$", from the Christoffel symbols of 7.1. Two free particles "separated by a small vector $\xi^i$" then obey

{{paper eq:deviation}}

Chapter [7.2](/tutorial/geometry/curvature-and-tides/#for-an-observer-at-rest-the-drift-is-the-papers-tide) derived
it from the geodesic deviation of two free balls at rest beside the observer, and showed that $\curv\tE_{ij}$ is
symmetric, by the pair symmetry of the Riemann tensor (*checked here*).[^at-rest] Equation (2) sets the sign. If
$\curv\tE_{11}$ is negative, the acceleration $-\curv\tE_{11}\xi^1$ points the same way as $\xi^1$, so the balls
speed apart along that axis: a negative entry is a stretch. With the paper's sign of the Riemann tensor and the
signature $-{+}{+}{+}$, 7.2's curvature agrees (*checked here*).

A metre from the 70 kg person, with $\matter M = 70$ kg and $r = 1$ m, 7.2 found $R_{0r0r} = -2G\matter M/c^2r^3 =
-1.04\times10^{-25}\unit{m^{-2}}$ along the line to the person. Times $c^2$ it is the person's stretch,
$-9.34\times10^{-9}\unit{s^{-2}}$ (*checked here*). Its **radius of curvature** $|R_{0r0r}|^{-1/2}$, the radius of a
sphere whose curvature has the same size, is $3.1\times10^{12}$ m, 21 times the distance to the Sun (7.2).

## Near slow matter the curvature is Newton's tide, and in a wave it is the strain's acceleration

Section II's ["two limits"](/paper/#sec:pixel) begin close to slowly moving matter:

{{paper eq:newton}}

Here $\sym{potential}{\field\Phi}$ is the Newtonian potential, in joules per kilogram. Chapter
[7.2](/tutorial/geometry/curvature-and-tides/#near-slow-matter-the-curvature-is-newtons-tide) found $R_{0i0j} =
-\tfrac12\partial_i\partial_jh_{00}$ in a static weak field, where $h_{00}$ is the small change of the metric's time
entry, and [7.1](/tutorial/geometry/metric/#free-fall-is-the-path-along-which-a-clock-ages-most) found $h_{00} =
-2\field\Phi/c^2$ from Newton's law, by asking that a falling clock age most. Together they give equation (3) as
curvature, up to terms smaller by about $(v/c)^2$ for matter moving at the speed $v$ (*checked here*).

Far from its source, "in a gravitational wave of strain $h^{\rm TT}_{ij}$ (in the transverse traceless gauge)":

{{paper eq:wave}}

Chapter [7.6](/tutorial/geometry/gravitational-waves/#of-the-ten-amplitudes-of-a-plane-wave-two-are-physical) counted
the ten amplitudes of a plane wave. One choice of coordinates fixes four: **harmonic gauge**, in which the
trace-reversed field $\bar h_{\mu\nu}$ of
[7.4](/tutorial/geometry/linearized-gravity/#trace-reversal-and-harmonic-gauge-tidy-the-equation) obeys the four
conditions $\partial^\mu\bar h_{\mu\nu} = 0$. A further choice removes four more, and $10 - 4 - 4 = 2$ remain, the plus
and the cross. In the **transverse traceless gauge** only these two are left, across the direction of travel and with
no trace. In it $h_{00}$ and $h_{0i}$ vanish, so 7.2's curvature $R_{0i0j}$ reduces
to $-\tfrac12\partial_0^2h^{\rm TT}_{ij}$, and $c^2$ times it, with $\partial_0 = c^{-1}\partial_t$, is equation (4)
([7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain),
*checked here*).

"An interferometer such as LIGO reads one component of $\curv\tE_{ij}$, integrated twice in time, as the fractional
change $h$ in the length of its arms." Chapter 7.6 found that this one component is $\curv\tE_{11} - \curv\tE_{22}$
for arms along $\vect e_1$ and $\vect e_2$, and that each arm changes by half of $h$, so $h$ is the difference of the
two arms' fractional changes (*checked here*).

{{paper fig:tidal-field}}

In Figure [](/paper/#fig:tidal), panels (b) and (c), the stretch and the squeeze "change places every half cycle",
because a strain $h\cos\omega t$ gives the tide $\tfrac12\omega^2h\cos\omega t$. In Figure [](/paper/#fig:tidal-field),
panel (c), "nothing happens along" the direction of travel $\hat k$, because $\hat k_i\curv\tE_{ij} = 0$ (7.6; both
*checked here*).

::: try {#tidal-rings}
The three rings of the paper's Figure [](/paper/#fig:tidal) move here, drawn far more distorted than a real tide could
make them. On the left a mass drifts nearer to its ring and away again. In the middle and on the right a plus wave and
a cross wave pass through the page toward you.

Before you touch anything, answer the predictions: as the mass comes nearer, does the area inside its ring grow, shrink
or stay the same? Does either wave ring change its area during a cycle? Then watch a few cycles against the dashed
circles. Afterwards, say why a flat ring beside the mass can change its area while a ball of free particles there keeps
its volume.
:::

## The swaying person's strain is counted as a wave's

The person who sways by 5 cm once a second changes the tide by "about $1.4\times10^{-9}\unit{s^{-2}}$, which a detector
reads as a strain $h = 2\,\delta\curv\tE/\omega^2 \approx 7\times10^{-11}$…" R1 found $\delta\curv\tE = 0.15 \times
9.34\times10^{-9} = 1.40\times10^{-9}\unit{s^{-2}}$, which changes a small detector's free arm along the line to the
person by $\delta\curv\tE/\omega^2 = 3.55\times10^{-11}$ of its length ($\omega^2 = 39.5\unit{s^{-2}}$). A wave of
strain $h$ moves each arm by $h/2$ (7.6), so a wave that moved the arm as much has $h = 7.1\times10^{-11}$, the
paper's number (*checked here*).

## In empty space a pixel reads ten numbers, and inside matter two more pieces

An ideal pixel also records the magnetic part:

{{paper eq:magnetic}}

Here $\epsilon_{ipq}$ is the Levi-Civita symbol, "with $\epsilon_{123} = +1$". Chapter
[7.2](/tutorial/geometry/curvature-and-tides/#the-pixel-reads-six-of-the-twenty-numbers-and-the-magnetic-part-eight-more)
counted eight independent entries $R_{pqj0}$ with one time index, and chapter
[7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index) packed them into this
table, in the units of equation (1). That it "twists the axes of nearby gyroscopes" is 7.5's rule, derived for
gyroscopes at rest in a steady field (*checked here*) and *stated in the paper* for any pixel [@Nichols2011].

- "In vacuum both are symmetric and trace-free, so a pixel yields ten numbers…" The tide is symmetric by the pair
  symmetry (7.2), and its trace, $c^2R_{00}$, vanishes in vacuum (7.3). The magnetic part is symmetric and
  trace-free there by 7.5. Einstein's equation in vacuum leaves ten of the twenty curvature numbers, five in each table
  ([7.3](/tutorial/geometry/einstein-equation/#in-empty-space-only-the-weyl-curvature-is-left-and-it-holds-ten-numbers),
  *checked here*).
- "With this normalization the two are equal in size in a plane wave, and $\curv\tB_{ij}$ is $\curv\tE_{ij}$ turned
  by 45°…" Chapter 7.6 found $\curv\tB_{ij} = \epsilon_{ipq}\hat k_p\curv\tE_{qj}$, the tide's pattern turned by 45°
  about $\hat k$, with $|\curv\tB| = |\curv\tE|$ because of the factor $\tfrac12c^2$ (*checked here*).
- "Inside matter the Ricci part of the curvature adds local information…" The **Ricci part** is the part that
  Einstein's equation ties to the matter at the point itself (7.3). Its first piece is "the trace
  $\mathrm{tr}\,\curv\tE = c^2R_{00} = 4\pi G\rho$ in the Newtonian limit", with $\sym{density}{\matter\rho}$ the
  density in $\mathrm{kg\,m^{-3}}$. The first equality is 7.3's identity and the second is Poisson's equation. In
  water it is $8.4\times10^{-7}\unit{s^{-2}}$, ninety times the person's stretch (*checked here*).
- Second, "$\curv\tB_{[ij]} = -(4\pi G/c)\,\epsilon_{ijk}\,\rho v_k$ … which lies along the flow", for matter moving at
  the velocity $\vect v$. Chapter 7.5 derived it from the matter's momentum at the pixel. For water flowing at
  $1\unit{m\,s^{-1}}$ it is $2.8\times10^{-15}\unit{s^{-2}}$, the trace in water times $v/c = 3.3\times10^{-9}$
  (*checked here*).

## The premise and the Earth's own tide, read with Part 7

In [*What the premise asks*](/paper/#par:what-the-premise-asks), the magnetic part "near slow matter … is smaller than
the electric part by $v/c$". Chapter
[7.5](/tutorial/geometry/gravitomagnetism/#moving-matter-makes-the-magnetic-part-through-the-potential-of-its-flow)
found that the flow of mass, $\matter\rho\vect v$, makes it with $G/c$, where the density makes the tide with $G$, so
their ratio is about $v/c$ (*checked here*). The instruments that would read it are *stated in the paper*. Gyroscopes
use 7.5's rule. A gradiometer reads the tide in its own frame, and its motion mixes into that tide the magnetic part of
the field it crosses, at first order in its speed over $c$, as 7.5's
[moving pixel](/tutorial/geometry/gravitomagnetism/#the-earths-magnetic-part-weighs-its-core) reads a magnetic part made
from the tide it crosses. An interferometer meets it "at first order in the length of its arms over the wavelength…"
[@BaskaranGrishchuk2004]. For LIGO at 100 Hz, with arms of length $L = 4$ km and the wavelength $\lambda = 3000$ km,
that ratio is $L/\lambda = 1.3\times10^{-3}$. "The waves of moving bodies" are [Section V](/paper/#sec:waves)'s, which
reading chapter R7b reads, and the thermal glow is Section IX's, for reading chapter R10.

In [*The Earth's own tide*](/paper/#par:the-earths-own-tide), a pixel at rest on the equator moves with the ground at
$\Omega R = 465\unit{m\,s^{-1}}$, where $\Omega$ is the Earth's rate of turning and $R$ its equatorial radius. "The two
together (Eq. [](/paper/#eq:magnetic-point) and the spin dipole …)" give it a magnetic part
$(3G\matter M\Omega/cR^2)(1 - I/\matter MR^2)$, with $\matter M$ the Earth's mass and $I$ its moment of inertia, as
chapter [7.5](/tutorial/geometry/gravitomagnetism/#the-earths-magnetic-part-weighs-its-core) derived. With $G\matter M =
3.986\times10^{14}\unit{m^3\,s^{-2}}$, $\Omega = 7.292\times10^{-5}\unit{s^{-1}}$, $R = 6.378\times10^6$ m and the
Earth's measured $I/\matter MR^2 = 0.3307$ (chapter 1.6),

$$\begin{aligned}&\frac{3G\matter M\Omega}{cR^2}\Bigl(1 - \frac{I}{\matter MR^2}\Bigr)\\
&\quad= 7.150\times10^{-12} \times 0.6693\unit{s^{-2}}\\ &\quad= 4.785\times10^{-12}\unit{s^{-2}} ,\end{aligned}$$

which rounds to $4.79\times10^{-12}\unit{s^{-2}}$, the paper's "$4.8\times10^{-12}$" (*checked here*).[^c-value] The
person walking past a metre away gives $3G\matter Mv/cr^3 = 6.545\times10^{-17}\unit{s^{-2}}$, and
$4.785\times10^{-12}/6.545\times10^{-17} = 73{,}100$, the paper's "seventy thousand" (*checked here*). A uniform Earth
would read $4.29\times10^{-12}\unit{s^{-2}}$, so the core raises the reading by 12 per cent.

On the equator this magnetic part has entries only for the pair of directions up and north ($\curv\tB_{xz}$ in 7.5's
axes, with $x$ up and $z$ north). So two gyroscopes a metre apart, one above the other or one north of the other, turn
relative to each other at $4.785\times10^{-12}/2.998\times10^8 = 1.6\times10^{-20}\unit{rad\,s^{-1}}$, one full turn
in about 900 times the age of the universe, while a pair a metre apart from east to west does not turn at all
(*checked here*). That holds for gyroscopes held still in the pixel's non-rotating frame. Gyroscopes fixed to the
turning ground pick up further terms of about $8\times10^{-21}\unit{rad\,s^{-1}}$ for 1 m, half of that rate
([7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)).

The last paragraph writes the two tables as one complex table, $\curv{\mathcal W} = \curv\tE + i\curv\tB$. Chapter
[7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45) derived
$\curv{\mathcal W}$ for one plane wave, as the square of one complex vector, and chapter 9.3 takes it at a general point
of the field, with the special directions it singles out, its null directions (*read now, derived in Part 9*). It and
the premise paragraph's standard quantum limit, which stays R1's estimate until chapter 8.6 (*read now, derived in Part
8*), are all of Section II that still waits.

## The ledger: after Part 7, all five of Section II's equations are derived

| The paper's equation | What it says | After Part 7 | Where it is derived |
|---|---|---|---|
| [](/paper/#eq:tidal) | the tide is $c^2R_{0i0j}$ | derived | 7.2 |
| [](/paper/#eq:deviation) | free balls move by $-\curv\tE_{ij}\xi^j$ | derived | 1.4; 7.2 |
| [](/paper/#eq:newton) | near slow matter, the Hessian of $\field\Phi$ | derived, also as curvature | 1.4; 7.2 |
| [](/paper/#eq:wave) | in a wave, $-\tfrac12\partial_t^2h^{\rm TT}_{ij}$ | derived | 7.6 |
| [](/paper/#eq:magnetic) | the magnetic part $\curv\tB_{ij}$ | defined, every property derived | 7.5, 7.6 |

Part 7 also completes Section IV. Chapter 7.5 derived its equation [](/paper/#eq:magnetic-point) and the weight $3G/c$
of its equation [](/paper/#eq:current-column), which reading chapters [R2](/tutorial/outside/reading-section-iv-1/) to
[R4](/tutorial/response/reading-section-iv-3/) left to it. So all twenty of Section IV's equations are now derived,
its equation [](/paper/#eq:split) with its completeness stated (R2) and its equation [](/paper/#eq:handheld) as a
sketch (R3), and the section is derived except its quantum limits.

::: check
### Q

Which of Section II's five equations needed Einstein's theory, and which chapter derives each?

### A

Equations (1) and (2) come from 7.2, equation (4) from 7.6, and equation (5) and its properties from 7.5 and 7.6.
Equation (3) is Newton's (1.4), and 7.2 showed that it is also the curvature near slow matter.

### Q

Two gyroscopes on the equator are 2 m apart, one above the other. How fast do they turn relative to each other, and how
fast would they turn if they were 2 m apart from east to west?

### A

By 7.5's rule, $2 \times 4.785\times10^{-12}/2.998\times10^8 = 3.2\times10^{-20}\unit{rad\,s^{-1}}$, twice the rate
for 1 m. From east to west they would not turn relative to each other, because the equator's $\curv\tB$ has entries only
for up and north.

### Q

Why does the ring beside the mass change its area, while the rings in a wave keep theirs?

### A

By equation (2), balls released at rest move to $\xi^i \approx \xi^i_0 - \tfrac12\curv\tE_{ij}\xi^j_0\,t^2$, so a
flat ring's area changes by the factor $1 - \tfrac12(\curv\tE_{11} + \curv\tE_{22})t^2$, set by the trace of the tide
in its own plane. A wave's ring lies across $\hat k$, where this sum is zero because $\hat k_i\curv\tE_{ij} = 0$ and the
tide has no trace. Beside the mass the ring's plane holds the line to the mass, so with $a = G\matter M/r^3$ the sum is
$-2a + a = -a$, and the area grows. The squeeze $+a$ along the third direction makes the full trace zero, so a ball
keeps its volume (7.3).
:::

**The idea to keep: Section II follows from Part 7. The tide is the curvature along the observer's own time, Newton's
tide near slow matter and minus half the strain's acceleration in a wave; the magnetic part is the curvature with one
time index, smaller by $v/c$ near slow matter and equal to the tide in a wave.**

::: problems
### Practice

Rerun the chain for Section II's lorry, 20 tonnes at 10 m, driving across the line of sight at $10\unit{m\,s^{-1}}$:
the stretch, $R_{0r0r}$ and its radius of curvature $|R_{0r0r}|^{-1/2}$ (the radius of a sphere whose curvature has the
same size), the magnetic part's largest entry $3G\matter Mv/cr^3$, and the ratio of Frobenius norms
$|\curv\tB|/|\curv\tE|$.

::: solution
The stretch is $2G\matter M/r^3 = 2.67\times10^{-9}\unit{s^{-2}}$, so $R_{0r0r} = -2.97\times10^{-26}\unit{m^{-2}}$,
a radius of curvature of $5.8\times10^{12}$ m, 39 times the distance to the Sun. The magnetic part's largest entry is
$1.34\times10^{-16}\unit{s^{-2}}$. The norms are $|\curv\tE| = \sqrt6\,G\matter M/r^3 = 3.27\times10^{-9}\unit{s^{-2}}$
and $|\curv\tB| = 3\sqrt2\,G\matter Mv/cr^3 = 1.89\times10^{-16}\unit{s^{-2}}$, so $|\curv\tB|/|\curv\tE| =
\sqrt3\,v/c = 5.8\times10^{-8}$. (The largest entries alone give $3v/2c = 5.0\times10^{-8}$.)
:::

### Stretch

Combine 7.5 and 7.6. A plus wave of strain $10^{-21}$ at 100 Hz passes two gyroscopes a metre apart, placed across its
direction of travel. Find the peak tide and magnetic part and the gyroscopes' largest relative rate of turning.

::: solution
The tide's amplitude is $\tfrac12\omega^2h = \tfrac12(628\unit{s^{-1}})^2 \times 10^{-21} = 2.0\times10^{-16}
\unit{s^{-2}}$, and the magnetic part's is the same (7.6). The gyroscopes turn relative to each other at up to
$2.0\times10^{-16}/2.998\times10^8 = 6.6\times10^{-25}\unit{rad\,s^{-1}}$, 24,000 times slower than on the equator,
although here $|\curv\tB|/|\curv\tE| = 1$, against the walker's $8.1\times10^{-9}$.
:::

### The paper

Derive the formula of *The Earth's own tide* from Section IV's equation [](/paper/#eq:magnetic-point) and 7.5's spin
dipole, and reproduce the paper's $4.8\times10^{-12}\unit{s^{-2}}$.

::: solution
Put the spin $\vect L = I\Omega\,\hat z$ along $z$ and the pixel on the $x$ axis, with $\hat n = -\hat x$ toward the
centre. The pixel reads the Earth moving past at $-\Omega R\,\hat y$, and the paper's equation
[](/paper/#eq:magnetic-point) gives $\curv\tB_{xz} = -3G\matter M\Omega/cR^2$. On the equator $\vect L\cdot\hat n = 0$,
and the spin dipole gives $+3GI\Omega/cR^4$. The sum is $-(3G\matter M\Omega/cR^2)(1 - I/\matter MR^2)$, and with the
Earth's numbers of the last section its size is $4.785\times10^{-12}\unit{s^{-2}}$, the paper's 4.8.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel): the plain words, the paper's equations [](/paper/#eq:tidal) to
  [](/paper/#eq:magnetic) and Figures [](/paper/#fig:tidal) and [](/paper/#fig:tidal-field), now derived.
- [*What the premise asks*](/paper/#par:what-the-premise-asks) and [*The Earth's own
  tide*](/paper/#par:the-earths-own-tide): the magnetic part's $v/c$ and the reading that weighs the core.
- [Section IV](/paper/#sec:near-field), *The magnetic picture*: its equations [](/paper/#eq:magnetic-point) and
  [](/paper/#eq:current-column), derived in 7.5.
:::

::: deeper
- The GR course's [section
  18.4](https://neovand.github.io/general-relativity/chapter-18.html#18-4-but-the-particles-do-not-move-in-tt-coordinates-exactly)
  shows what a detector reads in the coordinates of the paper's equation (4), as R1 promised: free balls keep their
  labels while the measured distances between them change.
:::

[^clocks]: Detectors that are held up, or that join two places, read more. An accelerometer held up on the ground
    reads the gradient of the potential, and clocks compared by light read the difference of the potential between two
    places (chapter 7.1), as in Section IV's [*Other gravitational sensors*](/paper/#par:other-gravitational-sensors).

[^at-rest]: The observer at rest is held up, not falling; 7.2 uses a free ball at the moment it is at rest beside the
    observer, which has the same four-velocity.

[^c-value]: Reading chapter R1 found $4.78\times10^{-12}\unit{s^{-2}}$ with $c = 3.00\times10^8\unit{m\,s^{-1}}$. With
    $c = 2.998\times10^8\unit{m\,s^{-1}}$, as here and in 7.5, the product is $4.785\times10^{-12}$, which rounds to 4.79.
    The ratio 73,100 does not depend on $c$.
