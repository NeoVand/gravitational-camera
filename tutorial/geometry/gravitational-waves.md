---
id: '7.6'
title: 'Gravitational waves and their two polarizations'
question: 'Far from its source, in a gravitational wave of strain $h^{\rm TT}_{ij}$ in the transverse traceless gauge, the tide is $\mathcal E_{ij} = -\tfrac12\partial_t^2h^{\rm TT}_{ij}$, and its magnetic part is equal in size and turned by 45°. Why does a gravitational wave have exactly two patterns, and why is its tide minus half the acceleration of its strain?'
part: '7'
requires: ['1.5', '1.5b', '6.1', '7.2', '7.4', '7.5']
paper: [sec:pixel, eq:wave, eq:magnetic, fig:tidal, fig:tidal-field, sec:regimes, sec:waves, eq:wave-zone, sec:no-lens, eq:beam, sec:one-pixel, eq:square, eq:magnetic-ratio]
figures: [fig:tidal, fig:tidal-field]
live: [tidal-rings, wave-rings]
depth: A
---

A ring of free balls in a gravitational wave is stretched and squeezed equally along two perpendicular directions, which
change places every half cycle (panels (b) and (c) of Figure [](/paper/#fig:tidal), below). The tide of such a wave is
minus half the second time derivative of its strain, and its magnetic part is equal in size, with the tide's pattern
turned by $45^\circ$ about the direction of travel.[^wave]

{{paper fig:tidal}}

Why does a gravitational wave have exactly two patterns, and why is its tide minus half the acceleration of its
strain? The answer is that eight of the field's ten numbers are labels, and the two left are a trace-free stretch across
the direction of travel.

::: plain
Far from every source, each of the ten numbers that describe a weak gravitational field obeys the wave equation, so
changes in the field travel at the speed of light. Most of the ten numbers of a wave are only labels: changing the
coordinates, which changes no measurement, can set eight of them to zero. The two left are the wave's two
polarizations.

Each polarization stretches a ring of free balls along one direction across the wave and squeezes it equally along
the perpendicular direction, and the two patterns differ by a turn of 45°. Each ball moves by half the strain times its
distance from the centre, so LIGO's two arms change by opposite halves of the strain.
:::

## In empty space every entry of the field obeys the wave equation

We assume **empty space**, with $\matter T_{\mu\nu} = 0$ at the place we look. Section
[7.4](/tutorial/geometry/linearized-gravity/#in-harmonic-gauge-einsteins-equation-is-a-wave-equation-for-each-component)'s
linearized field equation in harmonic gauge then reads

$$\sym{wave-operator}{\Box}\,\field{\bar h}_{\mu\nu} = 0 ,$$

where $\Box = -c^{-2}\partial_t^2 + \nabla^2$ is the wave operator and
$\sym{trace-reversed-perturbation}{\field{\bar h}}_{\mu\nu}$ is 7.4's trace-reversed perturbation, a symmetric table of
ten pure numbers at each event. Each entry obeys section
[5.1](/tutorial/waves/wave-equation/#any-shape-travels-without-changing)'s wave equation with the speed $c$.

We try a **plane wave**, the same over each plane across its direction of travel, with
$\sym{travel-direction}{\hat k}$ the unit vector along which it travels:

$$\field{\bar h}_{\mu\nu}(t, \vect x) = \field a_{\mu\nu}\,f(u) ,\qquad u = t - \frac{\hat k\cdot\vect x}{c} ,$$

where the **amplitudes** $\field a_{\mu\nu}$ are a fixed symmetric table of ten pure numbers and the **profile** $f$ is
any function of $u$, in seconds, with pure-number values. By the chain rule, $\partial u/\partial t = 1$ and $\partial
u/\partial x_i = -\hat k_i/c$. With $f'$ and $f''$ the derivatives of $f$ with respect to $u$, in $\mathrm{s^{-1}}$ and
$\mathrm{s^{-2}}$,

$$\frac1{c^2}\frac{\partial^2f}{\partial t^2} = \frac{f''}{c^2} ,\qquad \nabla^2f = \frac{\hat k_i\hat k_i}{c^2}\,f'' = \frac{f''}{c^2} ,$$

since $\hat k_i\hat k_i = 1$. The two terms of $\Box$ cancel, and

$$\boxed{\;\Box\bigl[\field a_{\mu\nu}\,f(t - \hat k\cdot\vect x/c)\bigr] = 0\;}$$

for every profile $f$. The crest $u = 0$ sits where $\hat k\cdot\vect x = ct$, so the profile moves along $\hat k$ at the
speed $c$ without changing its shape: gravity's waves travel at the speed of light.

**A check.** In 2017 the gravitational wave of two neutron stars merging 40 Mpc away arrived 1.7 s before their flash of
gamma rays (Abbott and colleagues 2017). A megaparsec is $3.09\times10^{22}$ m, so the journey took $4.1\times10^{15}$ s, 130 million
years, and if the two signals left together their speeds differ by about $1.7/(4.1\times10^{15}) = 4\times10^{-16}$ of
themselves. The published bound, between $-3\times10^{-15}$ and $+7\times10^{-16}$, is wider because the analysis used
the nearest distance allowed, 26 Mpc, and let the flash leave up to 10 s after the waves.

## Of the ten amplitudes of a plane wave, two are physical

We want to know how many of the ten amplitudes change the curvature, the only thing a pixel reads (section
[7.4](/tutorial/geometry/linearized-gravity/#relabelling-the-coordinates-changes-the-table-not-the-curvature)). We
choose the axes so that the wave travels along $z$, $\hat k = \vect e_3$ and $u = t - z/c$.

**Harmonic gauge fixes four.** The wave equation holds in 7.4's harmonic gauge, so the wave also obeys its condition
$\partial^\mu\field{\bar h}_{\mu\nu} = 0$. On $f(t - z/c)$ only $\partial_0 = c^{-1}\partial_t$ and $\partial_3$ act,
giving $f'/c$ and $-f'/c$, and raising the index 0 of a derivative changes its sign. So for each $\nu$

$$\partial^\mu\field{\bar h}_{\mu\nu} = -\frac{f'}c\bigl(\field a_{0\nu} + \field a_{3\nu}\bigr) = 0 .$$

These four conditions fix the four amplitudes with a time index by the spatial ones: $\field a_{0i} = -\field a_{3i}$
and $\field a_{00} = -\field a_{30}$. The table is symmetric, so $\field a_{30} = \field a_{03} = -\field a_{33}$, and
$\field a_{00} = \field a_{33}$. Six amplitudes $\field a_{ij}$ are left.

**The leftover freedom removes four more.** Section
[7.4](/tutorial/geometry/linearized-gravity/#trace-reversal-and-harmonic-gauge-tidy-the-equation)'s gap box found that a
gauge shift $\zeta^\mu$ with $\Box\zeta_\nu = 0$ keeps harmonic gauge. We take $\zeta_\nu = c\,b_\nu F(u)$, with
four pure numbers $b_\nu$ and $F' = f$, so that $\Box\zeta_\nu = 0$ as above. By 7.4 it changes $\field{\bar h}_{\mu\nu}$ by $-\partial_\mu\zeta_\nu - \partial_\nu\zeta_\mu +
\field\eta_{\mu\nu}\partial^\alpha\zeta_\alpha$. Here $\partial_0\zeta_\nu = b_\nu f$ and $\partial_3\zeta_\nu = -b_\nu
f$, and raising the index 0 again changes a sign, so

$$\partial^\alpha\zeta_\alpha = -\partial_0\zeta_0 + \partial_3\zeta_3 = -(b_0 + b_3)\,f .$$

Only this last term reaches $\field a_{11}$ and $\field a_{22}$, through $\field\eta_{11} = \field\eta_{22} = 1$. The
spatial amplitudes change by

$$\begin{aligned}
\delta\field a_{11} = \delta\field a_{22} &= -(b_0 + b_3) ,\qquad \delta\field a_{33} = b_3 - b_0 ,\\
\delta\field a_{13} &= b_1 ,\qquad \delta\field a_{23} = b_2 ,\qquad \delta\field a_{12} = 0 .
\end{aligned}$$

The four numbers $b_\nu$ make four independent changes. We choose

$$\begin{aligned}
b_1 &= -\field a_{13} , & b_2 &= -\field a_{23} ,\\
b_3 - b_0 &= -\field a_{33} , & b_0 + b_3 &= \tfrac12(\field a_{11} + \field a_{22}) ,
\end{aligned}$$

which set $\field a_{13}$, $\field a_{23}$, $\field a_{33}$ and the sum $\field a_{11} + \field a_{22}$ to zero.
Harmonic gauge still holds, so it then makes every $\field a_{0\nu}$ zero too. Because $\delta\field a_{11} =
\delta\field a_{22}$, the difference $\field a_{11} - \field a_{22}$ is untouched, and so is $\field a_{12}$. Left are
$\field a_{11} = -\field a_{22}$ and $\field a_{12}$ (Figure [](#fig:ten-amplitudes)).

![Look first at the heavy cells: of the ten amplitudes $\field a_{\mu\nu}$ of a plane wave travelling along $z$,
harmonic gauge fixes the four with a time index, the leftover gauge removes the three along $z$ and the trace across it,
and two remain.](tut-gw-count){#fig:ten-amplitudes}

**The transverse-traceless gauge.** The wave now has no entry with a time index. It is **transverse**, with no entry
along the direction of travel, and **traceless**, so reversing the trace changes nothing and $\field h_{\mu\nu} =
\field{\bar h}_{\mu\nu}$. These coordinates are the **transverse-traceless gauge**, or TT gauge. In it the spatial part of $\field h_{\mu\nu}$ is the wave's **strain**
$\sym{tt-strain}{\field h^{\rm TT}_{ij}}$, a table of pure numbers with

$$\hat k_j\,\field h^{\rm TT}_{ij} = 0 ,\qquad \field h^{\rm TT}_{ii} = 0 .$$

**The count** is

$$\boxed{\;10 - 4 - 4 = 2 .\;}$$

By section [1.5](/tutorial/newton/five-numbers/#across-a-wave-two-numbers-are-left-and-a-turn-of-45-swaps-them), a
symmetric trace-free table across a direction holds two numbers. In the axes of section
[5.4](/tutorial/waves/polarization/#a-wave-across-the-line-of-sight-has-two-patterns-of-stretch),

$$\boxed{\;\field h^{\rm TT}_{ij} = \field h_+\,e^+_{ij} + \field h_\times\,e^\times_{ij} ,\;}$$

with $\sym{strain-polarizations}{\field h_+} = \field a_{11}f$ and $\field h_\times = \field a_{12}f$ the strains of
the two **polarizations**, the two independent patterns of the wave. Here
$\sym{polarization-tensors}{e^+_{ij}} = \mathrm{diag}(1, -1, 0)$ is the **plus pattern**, and the **cross pattern**
$e^\times_{ij}$ has 1 in the places $12$ and $21$, the plus pattern turned by 45°. A gravitational wave has these two
patterns and no others.

## One projector keeps what a wave can carry

We want a rule that picks the two physical amplitudes out of any table in any axes.[^proj] For a unit vector $\hat n$, section
[1.1](/tutorial/newton/vectors-and-indices/#a-table-built-from-two-arrows)'s projector
$\sym{projector}{P}_{ij} = \delta_{ij} - \hat n_i\hat n_j$ flattens every arrow onto the plane across $\hat n$. It has
$P_{ij}P_{jk} = P_{ik}$, $P_{ij}\hat n_j = 0$ and trace $P_{ii} = 2$. From it we build a table of pure numbers with four
indices, the **transverse trace-free projector**,[^letters]

$$\boxed{\;\begin{aligned}\sym{tt-projector}{\Lambda_{ij,kl}}(\hat n) &= \tfrac12\bigl(P_{ik}P_{jl} + P_{il}P_{jk}\bigr)\\
&\quad - \tfrac12P_{ij}P_{kl} .\end{aligned}\;} \label{eq:lambda}$$

$\Lambda$ keeps the part of a symmetric table that lies across $\hat n$ and removes the trace of that part: applied to
a symmetric table $T_{kl}$,

$$\Lambda_{ij,kl}T_{kl} = (PTP)_{ij} - \tfrac12P_{ij}\,(P_{kl}T_{kl}) .$$

The first term is $T$ flattened onto the plane in its rows and columns; the second removes the trace left in the plane,
$P_{kl}T_{kl}$, shared over the plane's two directions.

::: derivation
### Four properties of the projector

- $\Lambda_{ij,kl}\hat n_l = 0$, because every term holds a $P$ with the index $l$: nothing along $\hat n$ survives.
- $\Lambda_{ij,kl}\delta_{kl} = \tfrac12(P_{ij} + P_{ij}) - \tfrac12P_{ij}\times2 = 0$, because $P_{kk} = 2$: a table
  that is pure trace is removed.
- $\Lambda_{ij,kl}\Lambda_{kl,mn} = \Lambda_{ij,mn}$: the table $S_{ij} = \Lambda_{ij,kl}T_{kl}$ lies across $\hat n$
  with no trace, so $PSP = S$ and $P_{kl}S_{kl} = 0$, and a second application returns $S$, which is what makes
  $\Lambda$ a projector.
- $\Lambda_{ij,ij} = \tfrac12(2\times2 + 2) - \tfrac12\times2 = 2$, the number of polarizations.

Each $P$, and so $\Lambda$, is unchanged when $\hat n$ is reversed, so $\hat n$ may point toward the source or away
from it.
:::

**For a plane wave in any harmonic gauge.** With $\hat n = \hat k$, the leftover gauge changed only the entries along
$\hat k$ and the trace across it, which is exactly what $\Lambda$ removes, and $\Lambda$ leaves the two TT amplitudes
as they are. So

$$\boxed{\;\field h^{\rm TT}_{ij} = \Lambda_{ij,kl}(\hat k)\,\field{\bar h}_{kl} ,\;}$$

the projection that section
[5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source) stated. A wave along
$z$ with $\field a_{11} = 3$, $\field a_{22} = 1$ and $\field a_{13} = 2$, in units of $10^{-21}$, keeps $\field
a_{11} = -\field a_{22} = 1$, a plus wave.

## The tide of a wave is minus half the acceleration of its strain

We want the tide in TT gauge. Section
[7.2](/tutorial/geometry/curvature-and-tides/#to-first-order-the-curvature-is-made-of-second-derivatives-of-the-metric)'s
linearized curvature gives

$$\begin{aligned}\curv R_{0i0j} = \tfrac12\bigl(&\partial_i\partial_0\field h_{0j} + \partial_0\partial_j\field h_{i0}\\
&- \partial_0\partial_0\field h_{ij} - \partial_i\partial_j\field h_{00}\bigr) .\end{aligned}$$

In TT gauge $\field h_{00} = \field h_{0i} = 0$, so only the third term is left, $\curv R_{0i0j} =
-\tfrac12\partial_0^2\field h^{\rm TT}_{ij}$. With 7.2's tide $\sym{tidal-tensor}{\curv\tE}_{ij} = c^2\curv R_{0i0j}$
and $\partial_0 = c^{-1}\partial_t$,

$$\boxed{\;\curv\tE_{ij} = -\tfrac12\,\partial_t^2\field h^{\rm TT}_{ij} ,\;} \label{eq:wave}$$

in $\mathrm{s^{-2}}$, as a pure number differentiated twice by seconds should be.[^tide] The tide inherits
$\hat k_i\curv\tE_{ij} = 0$ and $\curv\tE_{ii} = 0$ from the strain: it acts only across the direction of travel, with
no trace, as section 1.5 assumed. Its two numbers are
$\sym{wave-polarizations}{\curv\tE_+} = -\tfrac12\ddot{\field h}_+$ and $\curv\tE_\times = -\tfrac12\ddot{\field h}_\times$,
in $\mathrm{s^{-2}}$, where a dot is a derivative in time.

**A check: any harmonic gauge.** The box below computes the tide in harmonic gauge before the leftover gauge is used,
and finds the same, $\curv\tE_{ij} = -\tfrac12\partial_t^2\Lambda_{ij,kl}\field{\bar h}_{kl}$: the parts that
$\Lambda$ removes are pure gauge (section 7.4) and carry no curvature.

::: derivation
### The tide in any harmonic gauge

For the wave along $z$ in harmonic gauge, $\field a_{00} = \field a_{33}$, so the trace of $\field{\bar h}_{\mu\nu}$
is $\field a_{11} + \field a_{22}$. Reversing it gives $\field h_{\mu\nu} = \alpha_{\mu\nu}f$ with $\alpha_{\mu\nu} = \field a_{\mu\nu} -
\tfrac12\field\eta_{\mu\nu}(\field a_{11} + \field a_{22})$. Each $\partial_i$ becomes $-(\hat k_i/c)\,\dd/\dd u$ and
$\partial_0$ becomes $c^{-1}\dd/\dd u$, so

$$\curv\tE_{ij} = -\tfrac12\bigl(\alpha_{ij} + \hat k_i\alpha_{0j} + \hat k_j\alpha_{0i} + \hat k_i\hat k_j\alpha_{00}\bigr)f'' .$$

- Across the wave ($i, j = 1, 2$): $\curv\tE_{ij} = -\tfrac12\alpha_{ij}f''$, and $\alpha_{ij}$ is the trace-free
  part of $\field a_{ij}$ in the plane, $\Lambda_{ij,kl}\field a_{kl}$.
- Mixed ($i = 1$, $j = 3$): $\curv\tE_{13} = -\tfrac12(\field a_{13} + \field a_{01})f'' = 0$, because $\field a_{01} =
  -\field a_{31}$; the same holds for $i = 2$.
- Along the wave: $\curv\tE_{33} = -\tfrac12(\alpha_{33} + 2\alpha_{03} + \alpha_{00})f''$. Here $\alpha_{03} =
  -\field a_{33}$ and $\alpha_{33} + \alpha_{00} = \field a_{33} + \field a_{00} = 2\field a_{33}$, so it is zero.
:::

**A steady wave.** For a plus wave $\field h_+(t) = \field h_+\cos\omega t$, with $\omega$ the angular frequency, the
tide is $\curv\tE_+(t) = \tfrac12\omega^2\field h_+\cos\omega t$, and the same holds for the cross pattern.

**A number.** A wave of $\field h = 10^{-21}$ at 100 Hz has $\omega = 628\unit{s^{-1}}$ and the tide
$\tfrac12\omega^2\field h = 2.0\times10^{-16}\unit{s^{-2}}$: free balls a metre apart accelerate apart by
$2.0\times10^{-16}\unit{m\,s^{-2}}$ at the peak, 47 million times less than beside the 70 kg person a metre away
($9.34\times10^{-9}\unit{s^{-2}}$, section 1.4).

Panel (c) of Figure [](/paper/#fig:tidal-field), below, is this tide for a plus wave travelling up the page: bands of
stretch and squeeze alternate every half wavelength, and nothing happens along the direction of travel, because
$\hat k_i\curv\tE_{ij} = 0$.

{{paper fig:tidal-field}}

## A wave of strain h moves each ball by half the strain

We want what the strain does to free balls. Section
[7.2](/tutorial/geometry/curvature-and-tides/#for-an-observer-at-rest-the-drift-is-the-papers-tide)'s drift $\ddot\xi_i
= -\curv\tE_{ij}\xi_j$, with $\xi_j$ the proper separation of two free balls in metres (the distance that rulers
carried by the balls measure), and the boxed tide give

$$\ddot\xi_i = \tfrac12\,\ddot{\field h}^{\rm TT}_{ij}\,\xi_j .$$

We assume that **the balls are at rest before the wave arrives**, and use that the strain is tiny, so that $\xi_j$ on the
right stays at its undisturbed value. Integrating twice in time,

$$\boxed{\;\delta\xi_i = \tfrac12\,\field h^{\rm TT}_{ij}\,\xi_j .\;}$$

**LIGO's two arms.** In a plus wave travelling along $z$, an arm of length $L$ along $\vect e_1$ grows by
$\tfrac12\field h_+L$, and one along $\vect e_2$ shrinks by the same (Figure [](#fig:ligo-arms)). Their difference is
$\field h_+L$, so LIGO's strain, the difference of the arms divided by the length of one, is $\field h_+$ itself.
Arms turned by 45° read $\field h_\times$ and nothing of $\field h_+$.

**A number.** A wave of $\field h_+ = 10^{-21}$ on LIGO's 4 km arms makes a difference of $4\times10^{-18}$ m, about a
400th of the width of a proton ($1.7\times10^{-15}$ m). The rule assumes arms much shorter than the wavelength, 3000 km
at 100 Hz; the correction is set by the phase the wave advances along one arm, $2\pi L/\lambda = 8.4\times10^{-3}$.

Since $\ddot{\field h}_{ij} = -2\curv\tE_{ij}$, the difference of the arms is one component of $\curv\tE_{ij}$,
integrated twice in time:

$$\tfrac12\bigl(\field h_{11} - \field h_{22}\bigr)L = -L\iint\bigl(\curv\tE_{11} - \curv\tE_{22}\bigr)\,\dd t\,\dd t .$$

![Look first at the two brackets: in a plus wave along the arms' normal one arm grows by half the strain and the
other shrinks by the same, so the difference of the arms divided by their length is the strain $\field h_+$ itself.
Displacements exaggerated about $10^{20}$ times.](tut-gw-arms){#fig:ligo-arms}

::: gap
In TT gauge a free ball at rest keeps its coordinates as the wave passes, because the pull in section 7.1's geodesic
equation is made of $\field h_{00}$ and $\field h_{0i}$, which vanish there. Yet the **proper distance** between two
balls, measured with the metric, changes: for balls at the **TT coordinates** $x = 0$ and $L$ it is $\int\sqrt{1 +
\field h_{xx}}\,\dd x \approx L(1 + \tfrac12\field h_+)$, which is the rulers' $\delta\xi$ above. The *Try it* figure of
section [7.4](/tutorial/geometry/linearized-gravity/#in-harmonic-gauge-einsteins-equation-is-a-wave-equation-for-each-component) shows both views. This sketch skips the geodesic equation in TT
gauge, and arms as long as a wavelength; the GR course's section 18.4 gives both.
:::

## The magnetic part of a wave is its tide turned by 45°

We want the magnetic part of a wave's tide. Section
[7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index) defined it as
$\sym{magnetic-tide}{\curv\tB}_{ij} = \tfrac12c^2\epsilon_{ipq}\curv R_{pqj0}$, in $\mathrm{s^{-2}}$, with
$\epsilon_{ipq}$ the Levi-Civita symbol.[^mag] In 7.2's linearized curvature the terms of $\curv R_{pqj0}$ with $\field h_{p0}$ and $\field h_{q0}$ vanish in TT gauge, and the
two left are equal after the sum with $\epsilon_{ipq}$:

$$\curv\tB_{ij} = \tfrac12c^2\epsilon_{ipq}\,\partial_p\partial_0\field h^{\rm TT}_{qj} .$$

On a plane wave $\partial_p = -(\hat k_p/c)\partial_t$, so $\curv\tB_{ij} = -\tfrac12\epsilon_{ipq}\hat
k_p\,\partial_t^2\field h^{\rm TT}_{qj}$, and the boxed tide turns this into

$$\boxed{\;\curv\tB_{ij} = \epsilon_{ipq}\,\hat k_p\,\curv\tE_{qj} .\;} \label{eq:b-wave}$$

This part does not move free balls. It turns neighbouring gyroscopes relative to one another, at a rate set by
$\curv\tB$ times their separation (section
[7.5](/tutorial/geometry/gravitomagnetism/#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation)).

For a wave along $z$, $\epsilon_{13q}$ is $-1$ for $q = 2$ and $\epsilon_{23q}$ is $+1$ for $q = 1$, so the first row
of $\curv\tB$ is minus the second row of $\curv\tE$, and its second row is the first row of $\curv\tE$:

$$\curv\tE = \begin{pmatrix}\curv\tE_+ & \curv\tE_\times\\ \curv\tE_\times & -\curv\tE_+\end{pmatrix} ,\qquad
\curv\tB = \begin{pmatrix}-\curv\tE_\times & \curv\tE_+\\ \curv\tE_+ & \curv\tE_\times\end{pmatrix} .$$

The table $\curv\tB$ is symmetric and trace-free. Its size $|\curv\tB|$ is defined by $|\curv\tB|^2 =
\curv\tB_{ij}\curv\tB_{ij}$, the sum of the squares of its entries, and here $|\curv\tB|^2 = 2(\curv\tE_\times^2 +
\curv\tE_+^2) = |\curv\tE|^2$. So in a wave $|\curv\tB|/|\curv\tE| = 1$, where near slow matter the ratio is about
$v/c$ (section 7.5).[^ratio]

To see the turn we use section
[1.5b](/tutorial/newton/complex-numbers/#turning-the-axes-turns-the-shear-twice-as-fast)'s shear, $\curv{s} =
(\curv\tE_{11} - \curv\tE_{22}) + 2i\,\curv\tE_{12} = 2(\curv\tE_+ + i\curv\tE_\times)$, in $\mathrm{s^{-2}}$. Its
rule is that turning the axes anticlockwise by $\theta$ multiplies the shear by $e^{-2i\theta}$, so a factor
$\mp i$ is a turn of the axes by $\pm45°$. A pattern turned anticlockwise by 45° in fixed axes reads the same as the old
pattern in axes turned clockwise by 45°, so its shear is $i$ times the old one. The shear of $\curv\tB$ is
$-2\curv\tE_\times + 2i\curv\tE_+ = i\curv{s}$. So $\curv\tB$ is the pattern of $\curv\tE$ **turned by 45°** about the
direction of travel, anticlockwise as seen by the reader toward whom the wave comes (Figure
[](#fig:magnetic-turned)). With 1.5b's $\curv\tE_+ = 0.6$ and $\curv\tE_\times = 0.25$, in any unit of tide, the two
shears are $1.2 + 0.5i$ and $-0.5 + 1.2i$.

![Look first at the axes: in a plane wave the magnetic part $\curv\tB$ is the tide's own pattern, equal in size and
turned by 45° about the direction of travel, anticlockwise as seen by a reader the wave
approaches.](tut-gw-turned){#fig:magnetic-turned}

**The square of one complex vector.** Section
[1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero)'s null vector
$\sym{null-vector}{\vect m} = (\vect e_1 + i\vect e_2)/\sqrt2$ has $\hat k\times\vect m = -i\vect m$ and $\hat
k\times\vect m^* = i\vect m^*$, and the tide is the real part of $2A\,\vect m\vect m^{\mathsf T}$, with $A =
\curv\tE_+ - i\curv\tE_\times$:

$$\curv\tE_{ij} = A\,m_im_j + A^*m^*_im^*_j .$$

In [](#eq:b-wave), $\epsilon_{ipq}\hat k_pm_q = (\hat k\times\vect m)_i = -im_i$, so $\curv\tB_{ij} = -iA\,m_im_j +
iA^*m^*_im^*_j$. Then $\curv\tE + i\curv\tB$ keeps the first term twice and cancels the second, so
$\sym{weyl-complex}{\curv{\mathcal W}} = \curv\tE + i\curv\tB$ is

$$\curv{\mathcal W} = 2(\curv\tE_+ - i\curv\tE_\times)\,\vect m\vect m^{\mathsf T}, \label{eq:square}$$

with the imaginary part $\curv\tB$. A wave's reading is the square of one complex vector, where light's is the vector
itself.[^light]

**Front and back.** With $\hat n = -\hat k$ pointing back toward the source, [](#eq:b-wave) and 1.1's
$\epsilon$–$\delta$ identity give $\epsilon_{ipq}\hat n_p\curv\tB_{qj} = \curv\tE_{ij}$, so the sum
$\tfrac12(\curv\tE_{ij} + \epsilon_{ipq}\hat n_p\curv\tB_{qj})$ keeps a wave arriving from $\hat n$ and cancels one
arriving from the opposite side, which section
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array) uses to tell front
from back.

## An arm a fraction of a wavelength long reads the strain at its middle

The rule $\delta\xi_i = \tfrac12\field h^{\rm TT}_{ij}\xi_j$ assumed arms much shorter than the wavelength. We want the
first correction, of order $L/\lambda$, to the time that light takes along an arm of length $L$ and back. We work in TT
gauge, where the free mirrors at the corner and at the far end keep their coordinates (the gap box above): the corner
at the origin, the far mirror at $L\hat a$, with $\hat a$ a unit vector. The strain is $\field h^{\rm TT}_{ij}(t - \hat
k\cdot\vect x/c)$, and we write $\mu = \hat k\cdot\hat a$ and $\field h_{aa} = \hat a_i\hat a_j\field h^{\rm TT}_{ij}$.

**Along the arm.** Light has $\dd s^2 = 0$, so with $\dd l$ a step along the arm, $c\,\dd t = (1 +
\tfrac12\field h_{aa})\,\dd l$, with the strain taken where and when the light is. Light that leaves the corner at
$t_0$ is at the distance $s$ at $t_0 + s/c$, where the wave's argument is $t_0 + (1 - \mu)s/c$. On the way back it is
at $L - s'$ at $t_0 + (L + s')/c$, where the argument is $t_0 + [(1 - \mu)L + (1 + \mu)s']/c$. We expand the strain to
first order in these delays, $\field h_{aa}(t_0 + \tau) \approx \field h_{aa} + \dot{\field h}_{aa}\tau$, and
integrate each leg from 0 to $L$:

$$\begin{aligned}\int\field h_{aa}\,\dd l &= 2\field h_{aa}L + \frac{\dot{\field h}_{aa}L^2}{c}\Bigl[\frac{1 - \mu}2 +
(1 - \mu) + \frac{1 + \mu}2\Bigr]\\ &= 2\field h_{aa}L + (2 - \mu)\frac{\dot{\field h}_{aa}L^2}{c} ,\end{aligned}$$

with the strain at $t_0$. We refer it instead to the time $t_{\rm m} = t_0 + L/c$ at which the light turns at the far
mirror, using $\field h_{aa}(t_0) = \field h_{aa}(t_{\rm m}) - \dot{\field h}_{aa}L/c$. The round trip takes

$$T = \frac{2L}c + \frac Lc\Bigl[\field h_{aa}(t_{\rm m}) - \frac{\mu L}{2c}\,\dot{\field h}_{aa}\Bigr] .$$

The bracket is the strain at the arm's middle, $\vect x = \tfrac12L\hat a$, at $t_{\rm m}$, where the wave's argument is
$t_{\rm m} - \mu L/2c$. So

$$\boxed{\;T = \frac{2L}c + \frac Lc\,\field h_{aa}\bigl(t_{\rm m}, \tfrac12L\hat a\bigr) .\;}$$

**What it means.** To first order in $L/\lambda$ an arm reads the strain at its middle at the moment the light turns.
The correction, $-(\mu L/2c)\dot{\field h}_{aa}$, is the change of the strain across half the arm. It vanishes for an
arm across the wave, $\mu = 0$, and it changes sign when the same wave arrives from the other side, $\hat k \to -\hat
k$, while the leading term does not. So at this order an arm can tell a wave from the front from one from behind, which
is the information that $\curv\tB = \epsilon\hat k\curv\tE$ adds to $\curv\tE$. **A number.** For LIGO's 4 km arms at
100 Hz the correction is at most $\omega L/2c = 4.2\times10^{-3}$ of the strain.

**In the falling frame of the corner.** There the same correction is the change of the tide along the arm, the next
term of section 1.4's Taylor expansion, which section 7.2 dropped. The magnetic part enters at the same order as a
second force. In the corner's falling frame the metric has the mixed entries $\field g_{0i} = -\tfrac23\curv
R_{0jik}\,x^jx^k$ (Misner, Thorne and Wheeler's *Gravitation*, section 13.6), and as they change with the wave they push
a free mass at $\vect\xi$ by $(2/3c)\,(\dot{\curv\tB}\vect\xi)\times\vect\xi$, of order $\omega L/c$ times the tide's
push. V. Baskaran and L. P. Grishchuk split the force at this order into such electric and magnetic parts
[@BaskaranGrishchuk2004]. The magnetic force is at right angles to $\vect\xi$, so it swings the far mirror sideways
and leaves the length of a straight arm, and the time above, unchanged at this order.

## A body in steady motion sends no wave, and neither does an even pressure

We want two statements about what does not radiate.[^flux] A wave is the part of the curvature that falls as $1/r$ with
the distance $r$ from its source, the only part that carries energy to infinity (section
[5.2](/tutorial/waves/retarded-waves/#only-the-1r-part-carries-energy-to-infinity)).

**Steady motion.** By section [6.1](/tutorial/relativity/lorentz/#every-observer-measures-the-same-speed-of-light)'s
principle of relativity, a body moving steadily in a straight line is a body at rest seen by an observer moving the other
way. At rest its curvature is static and falls as $1/r^3$, like the tide $2G\matter M/r^3$. The moving observer reads the
same field with its components mixed by factors set by the speed, so it still falls as $1/r^3$ from where the body is
now (section
[6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now)). No part falls
as $1/r$, so no wave leaves.

**An even pressure.** A pressure that is the same in all directions is pure trace, which the projector removes
($\Lambda_{ij,kl}\delta_{kl} = 0$), so it sends no wave; section 7.7 shows this with the quadrupole formula, together
with the swelling sphere and the smooth wheel.

::: try {#tidal-rings}
The rings of Figure [](/paper/#fig:tidal) move here: a ring beside a mass on the left, then a ring in a plus wave and a
ring in a cross wave, both travelling toward you. Predict first: in the plus ring, when the balls at the left and right
move outward, what do the balls at the top and bottom do, and by how much? What happens half a period later?

Then find the four balls of the cross ring that move most, and compare the plus ring with the ring beside the mass.

The plus ring stretches along one axis while it squeezes by the same amount along the other, and half a period later the
two change places. The cross ring does the same along the diagonals. Beside the mass the ring is always stretched toward
the mass, and its stretch is twice its squeeze.
:::

::: try {#wave-rings}
A ring of twelve free balls in a wave travelling toward you, with the L of a detector's two arms through its centre.
Sliders set the plus and cross amplitudes, how far the cross wave runs behind the plus wave, and the angle of the arms;
a switch draws the magnetic part beside the ring, as a second ring or as six pairs of gyroscopes. The strain is drawn
about $5\times10^{20}$ times larger than LIGO's waves.

Answer the predictions at the top of the figure first. Afterwards, set a circular wave and turn the arms: say why the arm
difference keeps the same size whatever their angle, and only its timing changes.
:::

**The idea to keep: in empty space the weak field travels at $c$, and of its ten amplitudes only two are real waves, a
trace-free strain across the direction of travel, the plus and cross patterns 45° apart. Its tide is minus half the
acceleration of that strain, so each ball moves by half the strain, and its magnetic part is the same pattern turned by
45°, equal in size.**

::: problems
### Practice

**[7.6]** Why does a gravitational wave have two patterns and not ten, and why does each of LIGO's arms change by $h/2$,
not $h$?

::: solution
Harmonic gauge fixes the four amplitudes with a time index and the leftover gauge removes four more, leaving a
trace-free table across the direction of travel. A free ball moves by $\tfrac12\field h^{\rm TT}_{ij}\xi_j$, so one arm
grows by half the strain and the other shrinks by half.
:::

**[7.6]** Why does a body moving steadily in a straight line send no wave?

::: solution
It is a body at rest seen from a moving frame, whose field is carried along and falls as $1/r^3$, with no part that
falls as $1/r$.
:::

**[7.6]** A plus wave of amplitude $\field h_+ = 10^{-21}$ at 30 Hz meets LIGO head on, its pattern along the arms. Find the
largest tide, the size of the magnetic part, and the largest change in the difference of the 4 km arms.

::: solution
With $\omega = 188\unit{s^{-1}}$, $\curv\tE_+ = \tfrac12\omega^2\field h_+ = 1.8\times10^{-17}\unit{s^{-2}}$, and
$|\curv\tB| = |\curv\tE|$ by [](#eq:b-wave). The arms differ by $\field h_+L = 4\times10^{-18}\unit{m}$ at the peak,
whatever the frequency.
:::

**[7.6]** A plus wave of 100 Hz arrives at $30°$ from LIGO's 4 km arm, in the plane of the arm and the wave's own
$\vect e_1$ axis. By what fraction of the leading term does the strain at the arm's middle differ from the strain at
the corner, at most?

::: solution
Here $\mu = \cos30° = 0.866$, so the correction is $(\mu L/2c)\dot{\field h}_{aa}$, at most $\mu\omega L/2c =
0.866\times4.2\times10^{-3} = 3.6\times10^{-3}$ of $\field h_{aa}$.
:::

### Stretch

**[7.6]** Show that a wave with $\curv\tE_+ = \curv\tE\cos\omega t$ and $\curv\tE_\times
= \curv\tE\sin\omega t$ has $\curv{\mathcal W} = 2\curv\tE e^{-i\omega t}\vect m\vect m^{\mathsf T}$, and find how fast
its pattern turns.

::: solution
Euler's formula gives $\curv\tE_+ - i\curv\tE_\times = \curv\tE e^{-i\omega t}$, and $\vect m\vect m^{\mathsf T}$ is
fixed. Turning a pattern anticlockwise by $\beta$ multiplies its shear $2(\curv\tE_+ + i\curv\tE_\times)$ by
$e^{2i\beta}$ (section 1.5b), so it multiplies the conjugate $\curv\tE_+ - i\curv\tE_\times$ by $e^{-2i\beta}$. Here
$2\beta = \omega t$: the pattern turns anticlockwise at $\omega/2$, as a rotor, section 5.4's dumbbell spinning about
its middle, turns at half its wave's frequency. With the sign of $\curv\tE_\times$ reversed it turns the other way.
:::

**[7.6]** An arm points along $\hat a$, and a wave passes along $\hat k$ and then, later, an identical wave along
$-\hat k$. Show that the two round-trip times differ by $(\mu L^2/c^2)\dot{\field h}_{aa}$, and say why an arm across
the wave cannot tell the two apart.

::: solution
Reversing $\hat k$ reverses $\mu$ and leaves $\field h_{aa}$ and the leading term $(L/c)\field h_{aa}(t_{\rm m})$
alone. The correction $-(\mu L^2/2c^2)\dot{\field h}_{aa}$ changes sign, so the difference is twice it in size,
$(\mu L^2/c^2)\dot{\field h}_{aa}$. For $\mu = 0$ the correction is zero for both waves.
:::

### The camera

**[7.6]** Derive the tide $\curv\tE_{ij} = -\tfrac12\partial_t^2\field h^{\rm TT}_{ij}$ from the linearized curvature in
TT gauge, and show that with the factor $\tfrac12c^2$ the magnetic part is equal in size to the tide and turned by
$45^\circ$ about the direction of travel.

::: solution
In TT gauge only $-\tfrac12\partial_0^2\field h_{ij}$ survives in $\curv R_{0i0j}$. The magnetic part is
[](#eq:b-wave), whose plus and cross numbers $(-\curv\tE_\times, \curv\tE_+)$ have the size of $\curv\tE$'s and are
$\curv\tE$'s turned by 45°. Any other factor would make the sizes differ.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel): [](/paper/#eq:wave), the wave panels of its two figures, and LIGO's one component of
  $\tE_{ij}$ integrated twice.
- [Section III](/paper/#sec:regimes): in a wave the reading is a square.
- [Section V](/paper/#sec:waves): the TT projection in [](/paper/#eq:quadrupole) and [](/paper/#eq:wave-zone), and two
  cases of *What does not radiate*.
- [Section VII](/paper/#sec:no-lens): the projector and front–back sum of [](/paper/#eq:beam).
- [Section VIII](/paper/#sec:one-pixel): [](/paper/#eq:square), the wave half of [](/paper/#eq:magnetic-ratio), and
  $\hat k_i\curv\tE_{ij} = 0$.
:::

::: deeper
- The GR course's [section 18.3](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten)
  counts the polarizations, its [wave lab](https://neovand.github.io/general-relativity/chapter-18.html#scene-wave) moves
  the rings, [section 18.4](https://neovand.github.io/general-relativity/chapter-18.html#18-4-but-the-particles-do-not-move-in-tt-coordinates-exactly)
  works through the TT coordinates of the gap box, and
  [appendix A.20](https://neovand.github.io/general-relativity/appendix-a.html#a-20-gravitational-wave-strain-is-a-relative-measurement)
  explains why strain is a relative measurement.
- M. Maggiore, *Gravitational Waves*, vol. 1 (Oxford, 2008), sections 1.2 and 1.3: the TT gauge and $\Lambda$.
- B. P. Abbott and colleagues, "Gravitational waves and gamma-rays from a binary neutron star merger: GW170817 and GRB
  170817A", *Astrophysical Journal Letters* 848, L13 (2017): the speed of gravity.
:::

[^letters]: This $\Lambda_{ij,kl}$, always with its four indices, is not the cosmological constant of section 7.3,
    the logarithm $\Lambda$ of section 3.8, or section 6.2's boost table $\Lambda^\mu{}_\nu$.

[^wave]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. II](/paper/#sec:pixel), as its equations
    [](/paper/#eq:wave) and [](/paper/#eq:magnetic).

[^proj]: The paper uses this projector in its equations [](/paper/#eq:wave-zone) (Sec. V) and [](/paper/#eq:beam)
    (Sec. VII).

[^tide]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, as its equation [](/paper/#eq:wave).

[^mag]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, as its equation
    [](/paper/#eq:magnetic).

[^ratio]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:magnetic-ratio).

[^light]: For light the same construction makes the complex field $\light{\vect E} + ic\light{\vect B}$ a complex
    multiple of $\vect m$ itself (section
    [6.6](/tutorial/relativity/maxwell-complex/#in-a-light-wave-the-complex-field-is-a-multiple-of-one-null-vector)).
    Section 9.1 shows that the square against the single power is spin two against spin one.

[^flux]: See [*What does not radiate*](/paper/#par:what-does-not-radiate) in Sec. V of *The gravitational camera*. A
    wave carries the energy flux $c^3\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\rangle/16\pi G$, in
    $\mathrm{W\,m^{-2}}$, stated in section
    [5.4](/tutorial/waves/polarization/#the-rotor-shines-eight-times-less-edge-on) and derived in section 7.8.
