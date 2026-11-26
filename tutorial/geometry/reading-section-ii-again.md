---
id: R7
title: "What the camera sees: one pixel in Einstein's gravity"
question: "What does a pixel read of the curvature of spacetime, near a mass and in a gravitational wave, and how large is the magnetic part beside the tide?"
part: '7'
requires: ['R1', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6']
paper: [sec:pixel, eq:tidal, eq:deviation, eq:newton, eq:wave, eq:magnetic, fig:tidal, fig:tidal-field, eq:magnetic-point, eq:current-column]
figures: [fig:tidal, fig:tidal-field]
live: [tidal-rings]
---

The pixel of [the first reading chapter](/tutorial/newton/reading-section-ii/) read the tide as Newton's gravity gives
it. In Einstein's theory the tide is a piece of the curvature of spacetime, and the pixel reads a second table beside
it. What does the pixel read of the curvature, near a mass and in a gravitational wave, and how large is the second
table?[^pixel]

::: plain
Falling freely removes the pull of gravity at one point but not the curvature of spacetime, and the tide that a pixel
reads is one part of that curvature. Near slowly moving matter it is Newton's tide; in a gravitational wave it is minus
half the acceleration of the wave's strain, and each arm of a detector changes by half the strain.

The magnetic part, which turns neighbouring gyroscopes, comes from motion. Near ordinary matter it is smaller than the
tide by about the speed of the matter over the speed of light, but in a wave the two are equal.
:::

## Falling removes gravity at a point, and the curvature is what is left

The **metric**, the table of ten numbers at each event that turns coordinates into what clocks and rulers read, has 40
first derivatives at an event, and a change of coordinates has 40 free numbers with which to set them all to zero
([section 7.1](/tutorial/geometry/metric/#falling-removes-the-fields-first-derivatives-at-a-point-but-not-its-second)).
Of its 100 second derivatives, 20 combinations survive: the **Riemann tensor**, the curvature of spacetime
([section 7.2](/tutorial/geometry/curvature-and-tides/#curvature-is-what-no-change-of-coordinates-removes)). So at one
point a relabelling of events can change everything except the curvature (section 7.1, and
[section 7.4](/tutorial/geometry/linearized-gravity/#relabelling-the-coordinates-changes-the-table-not-the-curvature)
for weak fields), and the tide is the only effect of gravity that a freely falling detector can measure at one
place.

The tide is defined for an observer at rest relative to the masses, with the **proper time** $t$, the time on its own
clock ([section 7.1](/tutorial/geometry/metric/#a-clocks-own-time-is-set-by-the-metric)), and $x^0 = ct$:

$$\curv\tE_{ij} = c^2R_{0i0j} .$$

Here $\sym{tidal-tensor}{\curv\tE}_{ij}$ is the tide in $\mathrm{s^{-2}}$ and $R_{0i0j}$ are entries of the Riemann
tensor in $\mathrm{m^{-2}}$, so $c^2$ gives the tide its units. Section 7.2 builds the tensor from the Christoffel symbols of section 7.1, $R^\alpha{}_{\beta\gamma\delta} = \partial_\gamma\Gamma^\alpha_{\beta\delta} -
\dots$, and derives, for two free particles separated by a small vector $\sym{separation}{\xi}^i$,

$$\ddot\xi^i = -\curv\tE_{ij}\xi^j ,$$

from the geodesic deviation of free balls at rest beside the observer,[^at-rest] and shows that $\curv\tE_{ij}$ is
symmetric, by the pair symmetry of the Riemann tensor.[^equations] With the signature $-{+}{+}{+}$ a negative entry is a stretch: if $\curv\tE_{11}<0$, the acceleration
$-\curv\tE_{11}\xi^1$ points the same way as $\xi^1$ and the balls speed apart.

Beside the person of 70 kg at 1 m, section 7.2 finds $R_{0r0r} =
-2G\matter M/c^2r^3 = -1.04\times10^{-25}\unit{m^{-2}}$ along the line to the person, and $c^2$ times it is the stretch
of section 1.4, $-9.34\times10^{-9}\unit{s^{-2}}$. The **radius of curvature** $|R_{0r0r}|^{-1/2}$, the radius of a
sphere whose curvature has the same size, is $3.1\times10^{12}$ m, 21 times the distance to the Sun. The stretch is twice the squeeze outside any round body in Einstein's theory too
([section 7.3](/tutorial/geometry/einstein-equation/#a-single-mass-stretches-twice-as-hard-as-it-squeezes-in-einsteins-theory-too)).

## Near slow matter the tide is Newton's, and in a wave it is the strain's acceleration

Section 7.2 finds $R_{0i0j} = -\tfrac12\partial_i\partial_jh_{00}$ in a static weak field, where $h_{00}$ is the small
change of the metric's time entry, and section 7.1 finds $h_{00} = -2\field\Phi/c^2$ from Newton's law, by asking that a
falling clock age most, with $\sym{potential}{\field\Phi}$ the Newtonian potential in joules per kilogram. Together they
give
$$\curv\tE_{ij} = \partial_i\partial_j\field\Phi ,$$
up to terms smaller by about $(v/c)^2$ for matter moving at the speed $v$.

In a gravitational wave the result is different. Section 7.6 counts the ten amplitudes of a plane wave. **Harmonic
gauge**, a choice of coordinates in which the trace-reversed field $\bar h_{\mu\nu}$
([section 7.4](/tutorial/geometry/linearized-gravity/#trace-reversal-and-harmonic-gauge-tidy-the-equation)) obeys the
four conditions $\partial^\mu\bar h_{\mu\nu} = 0$, fixes four. A further choice removes four more, so $10 - 4 - 4 = 2$
remain, the plus and the cross. In the **transverse traceless gauge** only these two are left, across the direction of
travel and with no trace, and $h_{00}$ and $h_{0i}$ vanish. Then $R_{0i0j} = -\tfrac12\partial_0^2h^{\rm TT}_{ij}$, and
with $\partial_0 = c^{-1}\partial_t$,
$$\curv\tE_{ij} = -\tfrac12\,\partial_t^2h^{\rm TT}_{ij} ,$$
as section 7.6 shows ([in detail](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)).[^wave]
An interferometer reads $\curv\tE_{11} - \curv\tE_{22}$ for arms along $\vect e_1$ and $\vect e_2$, integrated twice
in time: the difference $h$ of the fractional changes in the lengths of its arms, each changing by $h/2$, one
lengthening while the other shortens. A wave of strain $10^{-21}$
lengthens one 4000 m arm by $\tfrac12\times10^{-21}\times4000\unit{m} = 2\times10^{-18}$ m and shortens the other by
the same.

{{paper fig:tidal}}

Panel (a) of Figure [](/paper/#fig:tidal) is the ring beside a mass and panels (b) and (c) are the two polarizations of a wave. The stretch and the
squeeze change places every half cycle, because a strain $h\cos\omega t$ gives the tide $\tfrac12\omega^2h\cos\omega t$.

{{paper fig:tidal-field}}

In panel (c) of Figure [](/paper/#fig:tidal-field) nothing happens along the direction of travel $\hat k$, because $\hat k_i\curv\tE_{ij} = 0$.

::: try {#tidal-rings}
The three rings move here, drawn far more distorted than a real tide could make them: a mass drifts nearer to its
ring and away again, and a plus wave and a cross wave pass through the page. Predict first: as the mass comes nearer,
does the area inside its ring grow, shrink or stay the same? Does either wave ring change its area?
:::

The person of section 1.4 who sways by 5 cm once a second changes the tide by $\delta\curv\tE = 0.15\times9.34\times10^{-9}
= 1.40\times10^{-9}\unit{s^{-2}}$, which changes a small detector's free arm along the line to the person by
$\delta\curv\tE/\omega^2 = 3.55\times10^{-11}$ of its length ($\omega^2 = 39.5\unit{s^{-2}}$). A wave moves each arm
by $h/2$, so a wave that moved it as much has $h = 7.1\times10^{-11}$. LIGO's arms are far longer than the metre to the
person, so only the near mirror moves, by $2G\matter M\,\delta r/r^3\omega^2 = 4.7\times10^{-10}/39.5 =
1.2\times10^{-11}$ m ($\delta r = 0.05$ m), a strain over 4000 m of $3.0\times10^{-15}$, three million times the
$10^{-21}$ of the waves it detects.

## The magnetic part is the curvature with one time index, small near slow matter and equal to the tide in a wave

An ideal pixel also records the **magnetic part** of the tide,
$$\sym{magnetic-tide}{\curv\tB}_{ij} = \tfrac12c^2\epsilon_{ipq}R_{pqj0} ,$$
in the units of the tide, where $\epsilon_{ipq}$ is the Levi-Civita symbol with $\epsilon_{123} = +1$. Section 7.2
counts eight independent entries $R_{pqj0}$ with one time index, which
[section 7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index) packs them
into this table.[^magnetic] Two gyroscopes a separation $\xi_j$ apart, in metres, turn relative to each other at
$\delta\Omega_i = \curv\tB_{ij}\xi_j/c$ radians per second, with $c = 2.998\times10^8\unit{m\,s^{-1}}$
([section 7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)),
for gyroscopes at rest in a steady field [@Nichols2011].

In vacuum both tables are symmetric and trace-free, five numbers each (the trace of the tide, $c^2R_{00}$, vanishes by
section 7.3), so a pixel yields ten numbers, the ten curvature numbers that Einstein's equation leaves
([section 7.3](/tutorial/geometry/einstein-equation/#in-empty-space-only-the-weyl-curvature-is-left-and-it-holds-ten-numbers)).
Inside matter the **Ricci part**, which Einstein's equation ties to the matter at the point itself, adds two pieces.
The trace of the tide is $c^2R_{00} = 4\pi G\sym{density}{\matter\rho}$ in the Newtonian limit, with
$\matter\rho$ the density in $\mathrm{kg\,m^{-3}}$, which is $8.4\times10^{-7}\unit{s^{-2}}$ in water, ninety times the
person's stretch. Moving matter adds the antisymmetric part
$\curv\tB_{[ij]} = -(4\pi G/c)\,\epsilon_{ijk}\matter\rho v_k$, which lies along the flow, for matter moving at the
velocity $\vect v$ (section 7.5). For water flowing at $1\unit{m\,s^{-1}}$ it is $2.8\times10^{-15}\unit{s^{-2}}$, the
trace in water times $v/c = 3.3\times10^{-9}$.

Near slowly moving matter the magnetic part is smaller than the tide by about $v/c$, because the flow of mass,
$\matter\rho\vect v$, makes it with $G/c$, where the density makes the tide with $G$ (section 7.5). The size of a table is its **Frobenius norm**, with $|\curv\tB|^2 = \curv\tB_{ij}\curv\tB_{ij}$. For a mass
crossing the line of sight at the speed $v_\perp$, section 7.5 finds $|\curv\tB|/|\curv\tE| = \sqrt3\,v_\perp/c$, which is $8.1\times10^{-9}$ for the person walking across
it at $1.4\unit{m\,s^{-1}}$.

In a plane wave of direction $\hat k$ the two are equal, $|\curv\tB| = |\curv\tE|$, because $\curv\tB_{ij} =
\epsilon_{ipq}\hat k_p\curv\tE_{qj}$: the magnetic part is the tide's pattern turned by 45° about $\hat k$, and the factor
$\tfrac12c^2$ makes the sizes equal ([section 7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45)).
The two tables combine into one complex table, $\curv{\mathcal W} = \curv\tE + i\curv\tB$, built for a plane wave in
section 7.6 and taken at a general point in sections 9.2 to 9.4.

## The Earth's own tide, read with the curvature, weighs the core

A pixel at rest on the equator moves with the ground at $\Omega R = 465\unit{m\,s^{-1}}$, where $\Omega$ is the Earth's
rate of turning and $R$ its equatorial radius. Section 7.5 derives its magnetic part from the motion and the Earth's
spin dipole,
$$\frac{3G\matter M\Omega}{cR^2}\Bigl(1 - \frac{C}{\matter MR^2}\Bigr) ,$$
with $\matter M$ the Earth's mass and $C$ its moment of inertia (written $I$ in section 1.6).[^earth] With
$G\matter M = 3.986\times10^{14}\unit{m^3\,s^{-2}}$, $\Omega = 7.292\times10^{-5}\unit{s^{-1}}$, $R =
6.378\times10^6$ m and the Earth's measured $C/\matter MR^2 = 0.3307$,

$$\begin{aligned}&\frac{3G\matter M\Omega}{cR^2}\Bigl(1 - \frac{C}{\matter MR^2}\Bigr)\\
&\quad= 7.150\times10^{-12} \times 0.6693\unit{s^{-2}}\\ &\quad= 4.785\times10^{-12}\unit{s^{-2}} .\end{aligned}$$

The person walking past a metre away gives $3G\matter Mv/cr^3 = 6.545\times10^{-17}\unit{s^{-2}}$, and
$4.785\times10^{-12}/6.545\times10^{-17} = 73{,}100$. A uniform Earth would read $4.29\times10^{-12}\unit{s^{-2}}$, so the
core raises it by 12 per cent.

On the equator this magnetic part has entries only for up and north. So two gyroscopes a metre apart, one above or north of the
other, turn relative to each other at $4.785\times10^{-12}/2.998\times10^8 =
1.6\times10^{-20}\unit{rad\,s^{-1}}$, one full turn in about 900 times the age of the universe, while a pair a metre
apart from east to west does not turn at all. That holds for gyroscopes held still in the pixel's non-rotating frame; those fixed to the
turning ground pick up further terms of about $8\times10^{-21}\unit{rad\,s^{-1}}$ for 1 m (section 7.5).

**The idea to keep: the tide is the curvature along the observer's own time, Newton's tide near slow matter and minus
half the strain's acceleration in a wave; the magnetic part is the curvature with one time index, smaller by $v/c$ near
slow matter and equal to the tide in a wave.**

::: problems
### Practice

**[R7]** Rerun the chain for a lorry of 20 tonnes at 10 m, crossing the line of sight at $10\unit{m\,s^{-1}}$: the stretch,
$R_{0r0r}$, the radius of curvature, the magnetic part's largest entry $3G\matter Mv/cr^3$ and $|\curv\tB|/|\curv\tE|$.

::: solution
The stretch is $2G\matter M/r^3 = 2.67\times10^{-9}\unit{s^{-2}}$, so $R_{0r0r} = -2.97\times10^{-26}\unit{m^{-2}}$,
a radius of curvature of $5.8\times10^{12}$ m, 39 times the distance to the Sun. The largest entry is
$1.34\times10^{-16}\unit{s^{-2}}$. The norms are $|\curv\tE| = \sqrt6\,G\matter M/r^3$ and $|\curv\tB| = 3\sqrt2\,G\matter Mv/cr^3$, so
$|\curv\tB|/|\curv\tE| = \sqrt3\,v/c = 5.8\times10^{-8}$.
:::

### Stretch

**[R7]** A plus wave of strain $10^{-21}$ at 100 Hz passes two gyroscopes a metre apart, placed across its direction of
travel. Find the peak tide and magnetic part and the gyroscopes' largest relative rate of turning.

::: solution
The tide's amplitude is $\tfrac12\omega^2h = \tfrac12(628\unit{s^{-1}})^2 \times 10^{-21} = 2.0\times10^{-16}
\unit{s^{-2}}$, and the magnetic part's is the same. The gyroscopes turn relative to each other at up to
$2.0\times10^{-16}/2.998\times10^8 = 6.6\times10^{-25}\unit{rad\,s^{-1}}$, 24,000 times slower than on the equator, although here
$|\curv\tB|/|\curv\tE| = 1$.
:::

**[R7]** Why does the ring beside a mass change its area, while the rings in a wave keep theirs?

::: solution
Balls released at rest move to $\xi^i \approx \xi^i_0 - \tfrac12\curv\tE_{ij}\xi^j_0\,t^2$, so a flat ring's area
changes by the factor $1 - \tfrac12(\curv\tE_{11} + \curv\tE_{22})t^2$, set by the trace of the tide in its plane. A
wave's ring lies across $\hat k$, where this sum is zero. Beside the mass the ring's plane holds the line to the mass,
so with $a = G\matter M/r^3$ the sum is $-2a + a = -a$ and the area grows; the squeeze $+a$ along the third direction
makes the full trace zero, so a ball keeps its volume.
:::

### The camera

**[R7]** Derive the Earth's magnetic part on the equator from the magnetic part of a moving mass and the spin dipole of
section 7.5, and reproduce $4.8\times10^{-12}\unit{s^{-2}}$.

::: solution
Put the spin $\vect L = C\Omega\,\hat z$ along $z$ and the pixel on the $x$ axis, with $\hat n = -\hat x$ toward the
centre. The pixel reads the Earth moving past at $-\Omega R\,\hat y$, which gives $\curv\tB_{xz} =
-3G\matter M\Omega/cR^2$. On the equator $\vect L\cdot\hat n = 0$, and the spin dipole gives $+3GC\Omega/cR^4$. The
sum is $-(3G\matter M\Omega/cR^2)(1 - C/\matter MR^2)$, of size $4.785\times10^{-12}\unit{s^{-2}}$.
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
  shows what a detector reads in the coordinates of a wave.
:::

[^pixel]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. II](/paper/#sec:pixel), as its equations
    [](/paper/#eq:tidal) and [](/paper/#eq:deviation).

[^at-rest]: The observer at rest is held up; section 7.2 uses a free ball momentarily at rest beside it.

[^equations]: Equation [](/paper/#eq:newton) of *The gravitational camera* (Mohsenvand 2026), Sec. II.

[^wave]: It is equation [](/paper/#eq:wave) of *The gravitational camera* (Mohsenvand 2026), Sec. II.

[^magnetic]: It is equation [](/paper/#eq:magnetic) of *The gravitational camera* (Mohsenvand 2026), Sec. II.

[^earth]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II,
    [*The Earth's own tide*](/paper/#par:the-earths-own-tide), with its equation [](/paper/#eq:magnetic-point). With
    $c = 3.00\times10^8\unit{m\,s^{-1}}$, as in the first reading chapter, the value is $4.78\times10^{-12}$.
