---
id: R13
title: 'Reading Sections XII and XIII, with the capstone: a ball and a shell read every way'
question: 'With chapters 13.1 to 13.7 behind us, which claims of Sections XII and XIII can we derive or check, where does the paper say more than it shows, and what would a camera that both watches and pushes learn of a ball and a shell of one mass?'
part: '13'
requires: ['1.4', '1.7', '1.8', '2.3', '2.5', '2.6', '2.8', '3.8', '4.2', '4.5', '6.4', '6.5', '8.2', '8.7', '11.2', '13.1', '13.2', '13.3', '13.4', '13.5', '13.6']
paper: [sec:hair, eq:hair-bits, fig:hair, sec:second-order, eq:hair-commutator, eq:dust, eq:calderon, eq:scene-transform, eq:cone, fig:two-readings, eq:push, eq:pass, fig:passing, eq:shock, eq:shock-even, eq:massless-pass, eq:ladder, eq:ladder-identity, fig:ladder, eq:flow-bracket, eq:hidden-spin, fig:hidden-flow, eq:moment-bracket]
figures: [fig:hair, fig:two-readings, fig:passing, fig:ladder, fig:hidden-flow]
live: [passing]
---

**What you need:** chapters
[1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it),
[1.7](/tutorial/newton/hamilton/#an-impulsive-tide-is-the-motion-generated-by-a-moment-of-the-mass),
[1.8](/tutorial/newton/orbits-and-kicks/#what-a-pass-leaves-inside-a-body-is-a-weighted-sum-of-its-projected-mass),
[2.3](/tutorial/outside/multipoles/#outside-a-body-the-potential-is-a-list-of-moments),
[2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see),
[2.6](/tutorial/outside/fourier/), [2.8](/tutorial/outside/flows/#the-density-and-the-flow-each-have-a-null-space),
[3.8](/tutorial/noise/bits/#a-bodys-field-at-one-time-holds-about-1200-bits-from-three-radii-away),
[4.2](/tutorial/response/temperature/#the-mean-square-rate-of-change-of-a-warm-bodys-moments-is-fixed-by-its-temperature-and-density),
[4.5](/tutorial/response/causality/#driven-faster-than-its-bonds-every-body-answers-as-dust),
[6.4](/tutorial/relativity/energy-and-momentum/#gravity-weighs-the-rest-mass-so-a-weighing-reads-the-energy),
[6.5](/tutorial/relativity/stress-energy/#some-stresses-are-invisible-to-every-ray),
[8.2](/tutorial/quantum/operators/#two-moments-of-a-body-do-not-commute),
[8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-bodys-correlations-still-contain-its-commutators),
[11.2](/tutorial/black-holes/spin/#a-hole-at-rest-shows-seven-numbers-and-nothing-of-what-fell-in) and
[13.1](/tutorial/what-a-field-keeps/push-and-pass/) to [13.6](/tutorial/what-a-field-keeps/algebra-of-moments/);
helpful, [R4](/tutorial/response/reading-section-iv-3/#one-integral-of-the-density-is-a-bracket-a-thermal-average-the-weight-of-a-response-and-the-answer-of-dust)
and [R8](/tutorial/quantum/reading-the-quantum-limits/#no-cameras-state-can-change-fast-enough-to-pass-about-1070-on-a-person).

The paper's [Section XII](/paper/#sec:hair) asks what the field outside a body fixes of its interior. For one reading
the answer is the harmonic moments, about 1200 bits of them, against a black hole's seven numbers. Its
[Section XIII](/paper/#sec:second-order), the paper's main result, shows that a second reading, made after a push,
holds the whole density. With chapters 13.1 to 13.7 behind us, which claims of these two sections can we derive or
check, where does the paper say more than it shows, and what would a camera that both watches and pushes learn of a
ball and a shell of one mass?

We read the two sections paragraph by paragraph (Figure [](#fig:read-xii-xiii-map)). Each claim is *checked here* (a
number recomputed from an earlier result), *read now, derived in chapter N*, or *stated in the paper* (cited there
without proof). A bare chapter number in parentheses, as "(13.4)", marks a smaller step derived in that chapter.
Sections XIV and XV are read in R13b, *Reading Sections XIV and XV*, after chapter 13.8.

![Look first at the solid boxes: every paragraph of Sections XII and XIII rests on chapters of Parts 1 to 13, with
its stated results in dotted insets. The hatched corners mark a step sketched at depth B, and the two flags mark
where the paper says more than it shows. The last box follows one ball and one shell through seven of
them.](tut-read-xii-xiii-map){#fig:read-xii-xiii-map}

::: plain
At any one moment, the gravity outside a body shows only certain averages of its mass, so a hollow shell and a solid
ball of the same mass pull alike. Section XII counts what one moment shows: about 1200 yes-or-no facts from three body
radii away, against about 140 for a black hole.

Section XIII gives the body a push. A brief tide leaves energy in the body, and energy has weight. The energy depends
on how the mass is arranged, so the ball and the shell gain different amounts, in the ratio three to five. A mass that
flies past does the same and comes out a little slower. Pushes of the right shapes read every ripple of the density,
though fine detail still costs a great deal, and two pushes in either order read how the mass flows inside.
:::

## Section XII's plain words: one reading holds a short list, and the scale from bald to hairy is short

**Hair** is whatever the field outside could show of what lies inside; a black hole in equilibrium shows only its
mass, spin and charge (chapter 11.2). The **multipole moments**, the weighted totals of the mass that the field
outside carries, are chapter 2.3's. From three radii, "each step is three times weaker than the last" is 2.3's factor
$R/R_c = \tfrac13$ per degree
([2.3](/tutorial/outside/multipoles/#each-degree-has-a-ceiling-lower-than-the-last-by-the-size-over-the-distance)). The
box's counts of bits are checked under *The number of bits*. The neutron star's "to within about one per cent" is
*stated in the paper* [@YagiYunes2013], and "about nine times" is $1176/140 = 8.4$.[^nine] The paragraph after the box
gathers Section IV's ambiguity, blur, bits and heat, read in R2 to R4, into "one subject".

## At one time the field holds the harmonic moments, and Einstein's theory fixes still less

[*The field at one time*](/paper/#par:the-field-at-one-time): outside a body, with no waves from elsewhere, the field is
built from the moments $\sym{mass-moment}{\matter{Q_h}} = \int\sym{density}{\matter\rho}\,h\,\dd V$, with $\matter\rho$
the density in $\mathrm{kg\,m^{-3}}$ and $h$ harmonic in the body, and from the like moments of the flow (2.8). A
density $\nabla^2\sym{null-potential}{\field\psi}/4\pi G$, with $\field\psi$ in $\mathrm{J\,kg^{-1}}$ and zero with its
gradient outside the body, has none of these moments and no effect outside, by the paper's [](/paper/#eq:split)
(*read now, derived in chapter 2.5*). The shell and the ball differ by such a density: "This generalizes Newton's shell
theorem."

"In general relativity still less is fixed at one time." To first order, a free field added on one slice can cancel
the fields of every moment beyond the energy, momentum, angular momentum and centre of mass [@DonnellyGiddings2017].
In the full theory, vacuum data inside a large ball can be joined, across a shell, to a black hole's field, "spinning
and in general moving" [@CorvinoSchoen2006]. Both are *stated in the paper*, which assumes no such field.

## One reading holds about 1200 bits of a body and seven numbers of a black hole

[*The number of bits*](/paper/#par:the-number-of-bits): on a sphere of radius $R_c$ about a body of radius $R$, the
$2\ell + 1$ moments of degree $\ell$ are weaker than the monopole by $(R/R_c)^\ell$. With the monopole read at the
signal-to-noise ratio $\sym{snr}{\SNR}$, the paper's

{{paper eq:hair-bits}}

counts $\sym{hair-bits}{H}$, the bits of the whole body at one time (*read now, derived in chapter
[3.8](/tutorial/noise/bits/#a-bodys-field-at-one-time-holds-about-1200-bits-from-three-radii-away)*, as
$C_{\rm body}$), with $L$ and $\Lambda$ pure numbers.[^H] For a camera at the height $z$, in metres, above the surface,
$\Lambda = \ln(1 + z/R) \approx z/R$, and the leading term becomes the paper's [](/paper/#eq:capacity) (3.8). Its
reading as an **$\varepsilon$-entropy**, the bits that fix a harmonic function between the spheres to the accuracy
$\varepsilon = 1/\SNR$, is *stated in the paper* [@KolmogorovTikhomirov1959; @SkibaZahariuta2000].

From three radii, $\Lambda = \ln3 = 1.099$. At $\SNR = 10^6$, $L = 13.82$ and $H = 1176$ bits. At Section IV's ceiling
of $10^{70}$ (read in R8), $L = 161.2$ and $H = 1.685 \times 10^6$ bits, or 211 kB: the paper's "1200",
"$1.7\times10^6$" and "two hundred kilobytes" (*checked here*). A black hole's moments are fixed by its mass and spin
[@Hansen1974] (*stated in the paper*), so with its place it holds seven numbers and at most $7\log_2\SNR$ bits: 139.5
at $10^6$ and 1628 at $10^{70}$, the paper's "140" and "1600" (*checked here*). The ratios, 8.4 and 1035, are the
paper's "nearly nine" and "a thousand".

{{paper fig:hair}}

Panel (a)'s bars are $\int\matter\rho\,r^2\,\dd V$ in units of $\sym{mass}{\matter M}R^2$ (*checked here*). A uniform
ball gives $\tfrac35 = 0.60$. A shell between $0.92R$ and $R$ gives $\tfrac35(1 - 0.92^5)/(1 - 0.92^3) = 0.924$. A rock
whose core of $0.4R$ holds half the mass, both parts uniform, gives $\tfrac12\cdot\tfrac35\cdot0.4^2 +
\tfrac12\cdot\tfrac35(1 - 0.4^5)/(1 - 0.4^3) = 0.365$. The impulses along $(x, -y)$ are the gradient of the profile
$\tfrac12(x^2 - y^2)$ (1.7). Panel (b)'s 169 beads are the moments of degrees 0 to 12,
$\sum_{\ell\le12}(2\ell + 1) = 13^2$ (*checked here*).

## Section XIII's plain words: the pull is first order, and the body's reply is second

The plain words define **first order** and **second order** as chapter
[13.1](/tutorial/what-a-field-keeps/push-and-pass/#a-probe-reads-the-field-at-first-order-and-the-bodys-reply-at-second)
does: an effect in proportion to the probe's strength, or to its square. So twice the small mass leaves an energy
"four times as large" (*checked here*: $2^2$). The ball and the shell gain "in the ratio of three to five", that of
$\tfrac35\matter MR^2$ to $\matter MR^2$ (1.7). The "ripple patterns" are 2.6's Fourier transform, the body that
"becomes very slightly heavier" is 6.4's weighing, and the mass that "leaves a little slower" is 1.8's.

The box's bodies are chapter 13.3's pair. **Body A** is a thin shell of mass $\matter M$ and radius $R/\sqrt2$.
**Body B** is half the mass at the centre of a shell of radius $R$ that holds the other half. Both have
$\int\matter\rho\,r^2\,\dd V = \tfrac12\matter MR^2$, so every quadrupolar tide treats them alike (13.3). Their
octupolar tide, the "$30\%$" and the tonne's "five parts in $10^{33}$" are checked below.

The paragraph after the box gives the reason. The pull holds the harmonic moments, but "a variance of the field, a
response to a second mass, or an energy exchanged with one" each hold $\int\matter\rho\,\nabla h\cdot\nabla g\,\dd V$,
which is not a harmonic moment: "They have no null space" (13.1, 13.2).

## At two times the readings hold a bracket, and products of tides build every ripple

[*The field at two times*](/paper/#par:the-field-at-two-times): for matter whose forces do not depend on velocity, a
moment and the rate of change of another do not commute, the paper's

{{paper eq:hair-commutator}}

(*read now, derived in chapter [8.2](/tutorial/quantum/operators/#two-moments-of-a-body-do-not-commute)*; the Poisson
bracket in [1.7](/tutorial/newton/hamilton/#the-bracket-of-two-moments-weighs-the-inside)). The same integral appears
three more times. Times $\kB T$, it is the classical tremor $\langle\matter{\dot Q_h}\matter{\dot Q_g}\rangle$ (4.2).
It is the whole weight of the response to a tide, the paper's [](/paper/#eq:sum-rule) (4.5). And it fixes the answer
to a tide driven faster than the body can respond, the paper's

{{paper eq:dust}}

with $\chi_{hg}$ the response of the moment of $h$ to a tide of profile $g$ at the angular frequency $\omega$ (*read
now, derived in chapter 4.5*).

Calderón's pair turns the integral into a ripple. With $\vect\xi$ a real wavevector, $\vect\eta$ at right angles to it
and as long, both in $\mathrm{m^{-1}}$, and $\sym{calderon-vectors}{\vect\zeta_\pm} = \tfrac12(i\vect\xi \pm
\vect\eta)$, the exponentials $h_\pm = e^{\vect\zeta_\pm\cdot\vect x}$ are harmonic. In one line (*checked here*),

$$\begin{aligned}
\vect\zeta_\pm\cdot\vect\zeta_\pm &= \tfrac14\bigl(|\vect\eta|^2 - |\vect\xi|^2\bigr) = 0 ,\\
\vect\zeta_+\cdot\vect\zeta_- &= -\tfrac14\bigl(|\vect\xi|^2 + |\vect\eta|^2\bigr) = -\tfrac12|\vect\xi|^2 ,
\end{aligned}$$

and the paper's

{{paper eq:calderon}}

follows (*read now, derived in chapter
[13.2](/tutorial/what-a-field-keeps/calderon/#two-harmonic-exponentials-multiply-into-any-ripple)*). Calderón made the
argument for a conductivity read from currents and voltages at a surface [@Calderon1980]. The paper's problem is that
one "in its linearized form, with density in place of conductivity", and "in Newton's theory, the linear form is
exact", because a tide's kick to a part does not depend on where the others are. So the null space of the paper's
[](/paper/#eq:split) "is therefore a property of a reading at one time, not of gravity"
([13.2](/tutorial/what-a-field-keeps/calderon/#the-null-space-belongs-to-one-reading-not-to-gravity)). The steel
balls of the paper's Figure [](/paper/#fig:same-outside), with a gold nugget, a flush of density on the wall or a skin
of mass, pull alike (2.5) and are told apart "as soon as they are warm or a tide is applied".[^twotimes]

## A flat camera reads the scene's transform on a cone at one time and inside it at two

[*The two readings as one transform*](/paper/#par:the-two-readings-as-one-transform): a flat camera in the plane
$z = 0$ reads the harmonic functions $h_{\vect k} = e^{i\vect k\cdot\vect a - |\vect k|z}$, with $\vect a$ the place
across the camera and $\vect k$ a wavevector in its plane. The scene's transform, a Fourier transform across and a
Laplace transform in depth (an integral against $e^{-\kappa z}$, 13.2), is the paper's

{{paper eq:scene-transform}}

with $\vect K$ a wavevector across, $\sym{decay-rate}{\kappa}$ a rate of decay in depth, both in $\mathrm{m^{-1}}$,
and $\sym{scene-transform}{\matter{\tilde\rho}}$ in kilograms. The two readings are the paper's

{{paper eq:cone}}

with $\vect K = \vect k + \vect k'$ and $\kappa = |\vect k| + |\vect k'| \ge K$ (*read now, derived in chapter
[13.2](/tutorial/what-a-field-keeps/calderon/#a-flat-camera-reads-the-transform-on-a-cone-at-one-time-and-inside-it-at-two)*).
One reading holds the transform on the cone $\kappa = K$, and readings at two times hold it inside. Differentiating
$e^{i\vect K\cdot\vect a - \kappa z}$ twice gives $\kappa^2 - K^2$ times itself, so a null density has the transform
$(\kappa^2 - K^2)\tilde\psi/4\pi G$ (*checked here*): zero on the cone, and inside it what the second reading
holds.[^half]

{{paper fig:two-readings}}

Every pair with $|\vect k| + |\vect K - \vect k| = \kappa$ reaches the same point: an ellipse with foci $0$ and
$\vect K$ and semi-axes $\kappa/2$ and $\tfrac12\sqrt{\kappa^2 - K^2}$
([13.2](/tutorial/what-a-field-keeps/calderon/#every-point-inside-the-cone-is-reached-by-an-ellipse-of-pairs-of-tides)).
Parker's formula [@Parker1973], the locality of sources [@GoldbergerRothstein2006a; @BianchiEtAl2025] and optical
tomography [@MarkelSchotland2001; @ArridgeSchotland2009] are *stated in the paper*.

## Fine detail still costs exponentially: the ambiguity goes and the blur stays

[*Stability*](/paper/#par:stability): each of $h_\pm$ grows to $e^{|\vect\xi|R/2}$ across a body of radius $R$,
because the real part of $\vect\zeta_\pm$ is $\pm\vect\eta/2$ (*checked here*). The two exponentials span
$e^{|\vect\xi|R}$ from one side to the other, so detail of size $2\pi/|\vect\xi|$ needs a relative precision of about
$e^{-|\vect\xi|R}$. For the steel ball of radius 0.5 m, 10 cm of detail needs one part in $e^{31.4} = 4.4 \times
10^{13}$
([13.2](/tutorial/what-a-field-keeps/calderon/#fine-detail-still-costs-exponentially-the-two-readings-remove-the-ambiguity-and-keep-the-blur)).
The multipoles that build the profiles reach the camera weakened by the paper's $(R/r)^\ell$.[^Rc] That the stability
of Calderón's problem, "for conductivities bounded beforehand", is logarithmic and cannot be better is *stated in the
paper* [@Alessandrini1988; @Mandache2001]. "Readings at two times remove the ambiguity and keep the blur."

## Sixteen weighings read one ripple, and the weight changes by five parts in 10⁴¹

[*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing): masses outside make, for an instant,
the potential $-\epsilon g\,\delta(t)$, with $g$ harmonic in the body and in square metres, and
$\sym{impulse-strength}{\epsilon}$ its strength in $\mathrm{s^{-1}}$. The paper's

{{paper eq:push}}

gives the energy gained (*read now, derived in chapter 1.7*; for operators in 8.2, and as a bracket taken twice in
[13.6](/tutorial/what-a-field-keeps/algebra-of-moments/#an-impulsive-tide-and-a-weighing-read-a-bracket-taken-twice)).
The sum rule "in time instead of frequency" is 4.5's, the impulse $e^{i\epsilon Q_g/\hbar}$ is 8.2's, and the
weight's rise by $\Delta E/c^2$ is 6.4's.

Two copies kicked by $\pm\epsilon$ and two weighings give the even part,
$\tfrac12\epsilon^2\int\matter\rho\,|\nabla g|^2\,\dd V$, and the odd part, $\epsilon\matter{\dot Q_g}$
([13.1](/tutorial/what-a-field-keeps/push-and-pass/#two-weighings-of-two-copies-read-the-even-part-and-the-odd-part)).
The "sixteen weighings for each Fourier component" are $4 \times 2 \times 2$ (*checked here*, as in
[13.2](/tutorial/what-a-field-keeps/calderon/#sixteen-weighings-give-one-ripple)): four real integrals in
$\nabla h_+\cdot\nabla h_-$, each from two squares by the polarization identity, each square from two copies kicked
both ways. That enough impulses give "every momentum" is Appendix C, read in
[13.6](/tutorial/what-a-field-keeps/algebra-of-moments/#the-moments-and-the-energy-generate-everything-that-can-be-known-of-a-body).

"The measurement is far beyond reach." An impulse of $\Delta v = 3 \times 10^{-12}\unit{m\,s^{-1}}$ raises the weight
by $\tfrac12(\Delta v/c)^2 = 5.0 \times 10^{-41}$ of itself, "five parts in $10^{41}$" (*checked here*). A tonne held a
metre from the edge for 50 µs gives the edge
$G \times 1000\unit{kg}/(1\unit m)^2 \times 50\unit{\mu s} = 3.3 \times 10^{-12}\unit{m\,s^{-1}}$.[^dv] The impulse
must also be over before the body responds, the body's motions slow beside light, and the result is the first order in
$1/c^2$ (13.1). Chapter 13.5 removes the restriction to slow matter and to order $1/c^2$; the impulse must still be
brief.

## A passing mass reads the projected body with nothing weighed

[*A mass that passes*](/paper/#par:a-mass-that-passes): a mass $\sym{passing-mass}{\matter\mu}$ held for an instant at
$\vect y$ is the impulsive tide of profile $1/|\vect x - \vect y|$, so a body at rest gains in proportion to
$\int\matter\rho\,|\vect x - \vect y|^{-4}\,\dd V$, whose kernel is not harmonic
([13.1](/tutorial/what-a-field-keeps/push-and-pass/#a-mass-held-for-an-instant-leaves-energy-through-a-kernel-that-is-not-harmonic)).
Its values outside the body fix the density
([13.3](/tutorial/what-a-field-keeps/ladder/#a-mass-held-for-an-instant-is-a-tide-of-every-degree-so-it-climbs-the-whole-ladder)).

Let the mass fly past on a straight line at the speed $V$, in $\mathrm{m\,s^{-1}}$, crossing the plane through the body
at right angles to its path at the point $\vect b$. A part that lies over the point $\vect s$ of that plane, both
points in metres, receives the velocity $C(\vect b - \vect s)/|\vect b - \vect s|^2$, with
$\sym{flyby-constant}{C} = 2G\matter\mu/V$ in $\mathrm{m^2\,s^{-1}}$. The paper's

{{paper eq:pass}}

follows, with $\sym{projected-density}{\matter\Sigma}$ the mass per area projected along the path (*read now, derived in
chapter [1.8](/tutorial/newton/orbits-and-kicks/#what-a-pass-leaves-inside-a-body-is-a-weighted-sum-of-its-projected-mass)*).
Spitzer's impulse approximation [@Spitzer1958; @BanikVanDenBosch2021] is *stated in the paper*. The passer leaves
slower by $\Delta E/\matter\mu V$ (1.8). The losses give every moment of $\matter\Sigma$
([13.1](/tutorial/what-a-field-keeps/push-and-pass/#the-passers-loss-of-energy-holds-every-moment-of-the-projected-body),
where the step from the moments to $\matter\Sigma$ is a sketch at depth B), and paths along one great circle of
directions give the density
([13.1](/tutorial/what-a-field-keeps/push-and-pass/#passes-along-one-great-circle-of-directions-give-the-density)).
The bending holds only the moments of $\matter\Sigma$ against the powers of $x + iy$, "the shell theorem in the plane"
([13.1](/tutorial/what-a-field-keeps/push-and-pass/#the-passers-bending-holds-only-the-harmonic-moments-of-the-projected-body)).

Write $F(b) = \int\matter\Sigma\,|\vect b - \vect s|^{-2}\,\dd^2s$, in $\mathrm{kg\,m^{-2}}$, so that
$\Delta E = \tfrac12C^2F$. For a round body the paper's series is $F = \matter M/b^2 + \tfrac23\int\matter\rho\,r^2\,\dd
V/b^4 + \tfrac{8}{15}\int\matter\rho\,r^4\,\dd V/b^6 + \cdots$, whose first term is the recoil. A thin shell of radius
$r$ has $F = (\matter M/rq)\arctan(r/q)$ with $q = \sqrt{b^2 - r^2}$; at $r = 0.3b$ the three terms match it to 3 parts
in $10^4$, and a fourth, $\tfrac{16}{35}r^6/b^6$, to 3 parts in $10^5$ (*checked here*). A and B agree in the first two
terms, and the third gives B more than A by $\tfrac{C^2}{2}\cdot\tfrac{8}{15}\cdot\tfrac{\matter MR^4}{4b^6} =
\matter MC^2R^4/15b^6$ (*checked here*). At $b = 1.5R$ the full sums leave 0.0803 inside A and 0.1041 inside B, in
units of $\matter MC^2/2R^2$: the caption's "0.080 and 0.104", whose ratio, 1.296, is the "$30\%$" (*checked here*, by
1.8).[^thirty] The tonne's "five parts in $10^{33}$" is 13.1's $4.5 \times 10^{-33}$, rechecked in the
capstone.[^frozen]

{{paper fig:passing}}

::: try {#passing}
The paper's Figure, live, as in chapter 1.8. Drag the bead, the chart or the slider *Distance of the pass*, from
$1.04R$ to $4R$; it opens at the paper's $1.5R$.

Predict first: in the closest pass, at $1.04R$, does B hold more or less than twice A's internal energy? At $4R$, is B
still ahead by more than 5 per cent? Then drag the bead in and out and read the bars.
:::

## An impulsive wave does the same at any speed, and a particle of light kicks twice as hard

The paragraph after the Figure carries the pass to the speed of light. A wave with flat fronts and a profile
$\sym{wave-profile}{H}$, in metres, harmonic across its front, is an exact solution of Einstein's equation
([13.5](/tutorial/what-a-field-keeps/impulsive-waves/#a-sudden-sheet-of-gravity-is-an-exact-solution-of-einsteins-equation)),
and the field of a particle without mass is one [@AichelburgSexl1971]
([13.5](/tutorial/what-a-field-keeps/impulsive-waves/#the-field-of-a-particle-without-mass-is-an-impulsive-wave)). A
particle that crosses the wave keeps $E - cp_z$ and gains the sideways momentum $(E - cp_z)\nabla H/2c$
[@Balasin1997; @Steinbauer1998]
([13.5](/tutorial/what-a-field-keeps/impulsive-waves/#whatever-crosses-the-front-keeps-q-and-is-kicked-in-proportion-to-it)),[^q]
so it gains the paper's

{{paper eq:shock}}

(*read now, derived in chapter
[6.4](/tutorial/relativity/energy-and-momentum/#a-sideways-kick-that-keeps-q-fixes-the-energy-gained)*). With $E_\pm$
the body's energies after the wave and after its reverse, and $E_0$ with none, the paper's

{{paper eq:shock-even}}

holds, with $\sym{crossing-energy}{\matter{\mathcal N}}$ the energy less $c$ times the momentum along the wave that
crosses each square metre of the front, in $\mathrm{J\,m^{-2}}$ (*read now, derived in chapter
[13.5](/tutorial/what-a-field-keeps/impulsive-waves/#a-wave-and-its-reverse-together-always-give-energy)*). For the
rest mass the mean square of $\nabla H$ becomes its variance over the body
([6.4](/tutorial/relativity/energy-and-momentum/#a-bodys-rest-mass-in-light-cone-form-is-a-sum-and-a-weighted-variance)).
That $k^\mu$ generates the wave's displacement is *stated in the paper* [@CasiniTesteTorroba2017; @CordovaShao2018].

Pairs of waves read $\tilde{\matter{\mathcal N}}(\vect\xi)$, the Fourier transform of $\matter{\mathcal N}$
([13.5](/tutorial/what-a-field-keeps/impulsive-waves/#pairs-of-waves-read-the-fourier-transform-of-what-crosses-the-front)).
What their integrals along the rays of light leave undetermined is *stated in the paper*
[@KrishnanSenapatiVashisth2020]. The stresses $(\partial_\mu\partial_\nu - \eta_{\mu\nu}\Box)\phi$ give zero along every
ray, and in ordinary matter they would change the energy density by about a part in $10^{12}$ (6.5).[^none]

The particle without mass has $H = -(8Gp/c^3)\ln|\vect x_\perp - \vect b|$, with $p$ its momentum, and a body at rest
gains the paper's

{{paper eq:massless-pass}}

(*read now, derived in chapter
[13.5](/tutorial/what-a-field-keeps/impulsive-waves/#a-particle-without-mass-reads-the-interior-as-newtons-passing-tonne-does-with-twice-the-kick)*).
For slow matter $\matter{\mathcal N} = \matter\Sigma c^2$, so the printed prefactor $8G^2p^2/c^6$ becomes
$8G^2p^2/c^4$ in front of $\int\matter\Sigma/|\vect b - \vect s|^2\,\dd^2s$. That is the pass's $C^2/2$ for
$C = 4Gp/c^2$ (*checked here*), twice Newton's $2Gp/c^2$ at $\matter\mu = p/c$ and $V = c$, because what gravitates is
the energy plus the stresses (6.5). The closing condition on a wave of finite duration is a sketch at depth B in 13.5.

## A second reading holds a volume's worth of moments, but the paper's bits include a price

[*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading): a held mass outside a sphere of radius
$R_c$ reads every moment $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$, with $Y_\ell$ a surface pattern of degree $\ell$
(13.3). Of total degree $n = \ell + 2j$ there are $(n + 1)(n + 2)/2$, against the first reading's $2n + 1$ (*checked
here*): the sum $\sum_{j\le n/2}\bigl(2(n - 2j) + 1\bigr)$ gives 1, 3, 6, 10, 15 and 21 for $n = 0$ to 5, against 1, 3,
5, 7, 9 and 11. The count then grows as the fourth power of $\ln\SNR$, as $L^4/24\Lambda^3\ln2$ (*read now, derived in
chapter
[13.2](/tutorial/what-a-field-keeps/calderon/#the-bits-of-a-second-reading-grow-as-the-fourth-power-of-the-logarithm)*).

The paper's "$1300$ bits at a signal-to-noise ratio of $10^6$ and $9.6\times10^6$ at $10^{70}$" are *stated in the
paper*. They come from its own computation, in its reference implementation (`reference/gravcam/passing.py`), which
the text does not show. Applied moment by moment, the rule that gave the first reading's 1200 gives 2580 and
$3.19 \times 10^7$ (13.2). The paper's numbers include an unmentioned price: moments of one pattern fall off with the
held mass's distance in nearly the same way, and telling them apart costs bits. With one mass at a time on one sphere
they cannot be told apart at all: "read on a single sphere, the second reading gives only as many as the first"
(13.3). Masses held in pairs on one sphere read every rung
([13.8](/tutorial/what-a-field-keeps/holography/#pushing-reads-the-volume-but-only-to-a-number-of-cells-set-by-the-logarithm)). For a pass, the second
reading's ratio is smaller by $2G\matter\mu/bV^2$, $4.6 \times 10^{-17}$ for the tonne at 1.5 m and 44 km/s
(*checked here*, by 13.1).

## A tide of degree m reaches m rungs of the ladder

[*What a tide of a given degree reaches*](/paper/#par:what-a-tide-of-a-given-degree-reaches): inside a body a tide is a
sum of harmonic polynomials, of degree two from far away and higher as its masses come near. For an applied profile $g$
of degree at most $\sym{tide-degree}{m}$, the functions $\nabla h\cdot\nabla g$ and the harmonic polynomials span
exactly the polynomials $P$ of the paper's

{{paper eq:ladder}}

the radial moments $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$ with $j < m$, because of the paper's

{{paper eq:ladder-identity}}

(*read now, derived in chapter
[13.3](/tutorial/what-a-field-keeps/ladder/#no-tide-reaches-beyond-the-rungs-below-its-degree-whatever-is-read)*; that
every rung below $m$ is reached, Appendix C, in
[13.3](/tutorial/what-a-field-keeps/ladder/#every-polynomial-on-the-ladder-is-reached)). The triangular structure of
linearized impedance tomography is *stated in the paper* [@GardeHirvensalo2025; @GardeHyvonen2024].

Two densities that differ by $\nabla^{2m}\field\psi$ "have the same exterior field and the same response to every
tide of degree up to $m$, and differ under a tide of degree $m + 1$" (*read now, derived in chapter
[13.3](/tutorial/what-a-field-keeps/ladder/#two-bodies-that-no-quadrupolar-tide-tells-apart)*, with two
caveats).[^strong] Their transforms differ by $(\kappa^2 - K^2)^m\tilde\psi$, and their second readings by half of
$(\kappa^2 - K^2)^{m+1}\tilde\psi$ (13.3).

The pair's numbers (*checked here*): the profile $\tfrac12(x^2 - y^2)$ has $|\nabla g|^2 = x^2 + y^2$, averaging
$\tfrac23r^2$, so A and B both gain
$\tfrac12\epsilon^2\cdot\tfrac23\cdot\tfrac12\matter MR^2 = \tfrac12\epsilon^2\matter MR^2/3$. The profile
$\tfrac13(x^3 - 3xy^2)$ has $|\nabla g|^2 = (x^2 + y^2)^2$, averaging $\tfrac{8}{15}r^4$, and
$\int\matter\rho\,r^4\,\dd V$ is $\tfrac14\matter MR^4$ for A and $\tfrac12\matter MR^4$ for B. They gain
$\tfrac12\epsilon^2$ times $\tfrac{2}{15}\matter MR^4$ and $\tfrac{4}{15}\matter MR^4$, "the second twice as much".

{{paper fig:ladder}}

## Two tides in either order read the flow, even a flow that shows nothing outside

[*The flow*](/paper/#par:the-flow): the rates of two moments have the bracket

{{paper eq:flow-bracket}}

with $\sym{mass-flux}{\matter{\vect J}}$ the density of momentum, in $\mathrm{kg\,m^{-2}\,s^{-1}}$, and $\nabla\nabla h$
the table of second derivatives (*read now, derived in chapter
[13.4](/tutorial/what-a-field-keeps/flows-inside/#the-bracket-of-two-rates-is-an-integral-of-the-flow)*). For a short
wait $\tau$, in seconds, between impulse and reading, $\tau^2$ times this bracket is the part of the response that
changes sign when the profile applied and the moment read are exchanged (13.4). For Calderón's pair the bracket is
$-\tfrac12|\vect\xi|^2\vect\eta\cdot\tilde{\matter{\vect J}}(\vect\xi)$, so every flow with no magnetic field outside
is read as the density is
([13.4](/tutorial/what-a-field-keeps/flows-inside/#every-silent-flow-is-read-by-calderóns-pair)). For quadrupolar
profiles the bracket is proportional to the angular momentum (13.4).

For the octupolar pair $h + ig = (x + iy)^3/3$ and chapter 2.8's sphere, whose inner ball out to $2^{-1/5}R$ turns one
way and the rest the other, it is the paper's

{{paper eq:hidden-spin}}

(*read now, derived in chapter
[13.4](/tutorial/what-a-field-keeps/flows-inside/#octupolar-tides-read-the-hidden-swirl)*). The rigid ball gives
$-\tfrac{32}{35}\matter M\Omega R^4$, and the split multiplies it by $2^{-2/5} - 1$: $\tfrac{32}{35}(1 - 2^{-2/5}) =
0.2214$ (*checked here*). The paper's "with $\Omega$ the rate of turning" does not say whose rate. The value is
$+0.221\,\matter M\Omega R^4$ for the inner ball's rate, in the positive sense about $z$, and
$-0.221\,\matter M\Omega R^4$ for the outer part's (13.4). The trapped gas's splitting is *stated in the paper*
[@ZambelliStringari1998].

{{paper fig:hidden-flow}}

## The moments and the weight generate everything, but watching alone cannot read it

[*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy): a quantity whose
bracket with every harmonic moment vanishes does not depend on the momenta, and one whose bracket with the energy also
vanishes is a constant
([13.6](/tutorial/what-a-field-keeps/algebra-of-moments/#the-moments-and-the-energy-generate-everything-that-can-be-known-of-a-body),
from Appendix C). In general relativity the mass moments are the charges of the motions $f\,\partial_t +
t\,\nabla f\cdot\nabla$, with $f$ harmonic [@CompereOliveriSeraj2018] (*stated in the paper*).[^c] That these motions
do not close at degree two and above is derived in
[13.6](/tutorial/what-a-field-keeps/algebra-of-moments/#in-general-relativity-the-moments-are-charges-of-motions-that-do-not-close).
For matter the bracket follows from those of the energy density [@Dirac1962; @Schwinger1963] (*stated in the paper*),
and the moments of the energy obey the paper's

{{paper eq:moment-bracket}}

(*read now, derived in chapter
[13.6](/tutorial/what-a-field-keeps/algebra-of-moments/#to-order-1c²-the-moments-of-the-energy-do-not-commute)*, where
it is exact for free particles and needs "To order $1/c^2$" only for the potential energy). Two dipoles give
$-L_z/c^2$ [@Pryce1948], and the quadrupoles $x^2 - y^2$ and $2xy$ give $-(2/c^2)\int(x^2 + y^2)\,
\sym{angular-momentum-density}{\ell_z}\,\dd V$, with $\ell_z$ the density of angular momentum about $z$ (13.6). For the
hidden swirl this is $\tfrac{16}{35}(1 - 2^{-2/5})\,\matter M\Omega R^4/c^2 = 0.111\,\matter M\Omega R^4/c^2$, half
of the paper's [](/paper/#eq:hidden-spin) over $c^2$: a moment of the flow that "does not vanish for the sphere"
(*checked here*).

Marolf's statement [@Marolf2009; @Marolf2014], with his remark that the values of $L_x$ and $L_y$ do not fix $L_z$, and
Jacobson and Nguyen's lack of analyticity [@JacobsonNguyen2019] are *stated in the paper* and worked in
[13.6](/tutorial/what-a-field-keeps/algebra-of-moments/#marolfs-boundary-algebra-holds-the-interior-but-watching-cannot-read-it).
The last sentences are 13.6's answer: "the bracket of two quantities is the response of the first to an impulse
generated by the second". Heat supplies the impulses, and in the tremor "the temperature stands where $\hbar$ stands"
(4.2). A quantum state's zero point supplies them too, while a cold classical body's correlations hold none of the
brackets
([8.7](/tutorial/quantum/quantum-fluctuation/#a-cold-bodys-correlations-still-contain-its-commutators)).

## The capstone: a ball and a shell read every way

![Look first at panel (a), where the two bodies cannot be told apart, and then at (b) and (c), where heat and one
push separate them by three to five. Each tag gives the ball's number before the shell's. The numbers are exact; the
bands, bars and paths are to scale, and the arrows are schematic.](tut-read-ball-shell){#fig:read-ball-shell}

The capstone follows chapter 13.1's steel ball, 1 m across and 4110 kg, and a thin shell of the same mass and
radius, $R = 0.5$ m, through Part 13's readings (Figure [](#fig:read-ball-shell)). Each row can be recomputed from
the table with $G$ and $c$, and row (e) with the pass's series.

| Step | Formula | Ball | Shell | Chapter |
|---|---|---|---|---|
| (a) one time | the paper's [](/paper/#eq:hair-bits) from $3R$ at $10^6$ | 1176 bits | the same | 2.5, 3.8 |
| (b) heat | $\langle\matter{\dot Q_g}^2\rangle = \kB T\int\matter\rho\,\lvert\nabla g\rvert^2\,\dd V$, $g = \tfrac12(x^2 - y^2)$ | $411\unit{kg\,m^2}$ | $685\unit{kg\,m^2}$ | 4.2 |
| (c) a push | $\tfrac12\epsilon^2\int\matter\rho\,\lvert\nabla g\rvert^2\,\dd V$, $\epsilon = 10^{-10}\unit{s^{-1}}$; over $c^2$ | $2.06 \times 10^{-18}$ J, $2.29 \times 10^{-35}$ kg | $3.43 \times 10^{-18}$ J, $3.81 \times 10^{-35}$ kg | 1.7, 6.4 |
| (d) one ripple | $\matter{\tilde\rho}(\vect\xi) = \int\matter\rho\,e^{i\vect\xi\cdot\vect x}\,\dd V$ at $x = \lvert\vect\xi\rvert R = \pi$: $3\matter M(\sin x - x\cos x)/x^3$ and $\matter M\sin x/x$ | $3\matter M/\pi^2$, 1250 kg | 0 | 13.2 |
| (e) the tonne's pass | $b = 1.5$ m, $V = 44\unit{km\,s^{-1}}$; slowing $\Delta E/\matter\mu V^2$ | $4.55 \times 10^{-33}$, $2.1 \times 10^{-34}$ inside | $4.70 \times 10^{-33}$, $3.5 \times 10^{-34}$ inside | 1.8, 13.1 |
| (f) light | $C = 4Gp/c^2 = 2G\matter\mu/V$, so $E = pc = \matter\mu c^3/2V$ | $3.1 \times 10^{23}$ J | the same | 13.5 |
| (g) the $1/c^2$ bracket | $\{\matter{Q_{x^2-y^2}}, \matter{Q_{2xy}}\}$, swirl at $\Omega = 100\unit{s^{-1}}$ against rest | $3.2 \times 10^{-14}\unit{kg\,m^2\,s}$ | 0 | 13.4, 13.6 |

(a) At one time the two bodies are one scene, to every bit. (b) Heat breaks the tie: the tremors are 3 : 5. (c) The
strength $\epsilon$ only sets the scale. An impulse that size, delivered within the tens of microseconds that the
impulsive condition needs, say 34 µs, takes a tide of about $3 \times 10^{-6}\unit{s^{-2}}$, some 300 times the person's
$9.3 \times 10^{-9}\unit{s^{-2}}$ a metre away (1.4). This profile stretches along $x$ as much as it squeezes along $y$,
so it is not one point mass's tide, which stretches twice as much as it squeezes. The gains in weight are 5.6 and
$9.3 \times 10^{-39}$ of the mass. (d) With crests 1 m apart, the ripple averages to zero over a sphere of radius $R$,
so the shell's transform vanishes and the ball's does not. One Fourier component tells them apart, at the mildest of
13.2's costs: the exponentials span only $e^{\pi} = 23$. (e) The tonne's recoil, $4.34 \times 10^{-33}$ of its speed, is
the same for both; the interiors take nearly 3 : 5 again. (f) Light kicks alike if it carries about 0.8 ms of the Sun's
output. (g) The ball's two parts turn against each other and show no flow outside, yet its bracket is
$0.111\,\matter M\Omega R^4/c^2$.

::: check
### Q

The capstone's ball and shell are kicked by a tide three times stronger, $\epsilon = 3 \times 10^{-10}\unit{s^{-1}}$.
What does each gain, and does the ratio change?

### A

The even part goes as $\epsilon^2$, so each gain is nine times as large, $1.85 \times 10^{-17}$ and
$3.08 \times 10^{-17}$ J. The ratio stays 3 : 5.

### Q

Why does the pass's bending not tell A from B, while its slowing does?

### A

The bending is first order and holds only the moments against powers of $x + iy$, which the field at one time also
holds. The slowing is second order and weighs $\int\matter\rho\,r^4\,\dd V$ through the series' third term, where A and
B differ.
:::

## The ledger: Section XII's one equation and all fifteen of Section XIII's are derived

| The paper's equation | Its mark here: *read now, derived in chapter* |
|---|---|
| [](/paper/#eq:hair-bits), the bits of one reading | 3.8 |
| [](/paper/#eq:hair-commutator), a moment and a rate | 8.2, the bracket in 1.7 |
| [](/paper/#eq:dust), the answer of dust | 4.5 |
| [](/paper/#eq:calderon), [](/paper/#eq:scene-transform), [](/paper/#eq:cone), the transforms | 13.2 |
| [](/paper/#eq:push), an impulsive tide | 1.7 |
| [](/paper/#eq:pass), a pass | 1.8 |
| [](/paper/#eq:shock), an impulsive wave | 6.4, with the kick from 13.5 |
| [](/paper/#eq:shock-even), [](/paper/#eq:massless-pass), a wave and its reverse; light that passes | 13.5 |
| [](/paper/#eq:ladder), [](/paper/#eq:ladder-identity), the reach of a tide | 13.3 |
| [](/paper/#eq:flow-bracket), [](/paper/#eq:hidden-spin), the flow | 13.4 |
| [](/paper/#eq:moment-bracket), the moments of the energy | 13.6 |

The stated results rest on the works cited, except the 1300 bits, which come from the paper's own computation. R13b
reads Section XIV's four equations and Section XV's one.

**The idea to keep: one reading of the field holds only the harmonic moments, about 1200 bits of a body; the body's
reply to a push is of second order, weighs the density against products of tides, and so reads every ripple of the
density and of its flow, as long as something supplies the push, and with the blur of the first reading left in place.**

::: problems
### Practice

Rerun the pass for A and B at $b = 2R$: their internal energies, their ratio, and the far-field estimate
$\matter MC^2R^4/15b^6$ against the exact difference.

::: solution
From each shell's $F(b)$, less the recoil, the internal energies are 0.0232 and 0.0261 in units of
$\matter MC^2/2R^2$, a ratio of 1.13. Their difference, 0.0030, exceeds the far estimate $2/(15 \times 2^6) = 0.0021$
by about 40 per cent.
:::

### Stretch

With chapters 13.4 and 13.6: let the boundary of the counter-turning ball be at a radius $a$, with the inner ball at
$+\Omega$ and the rest at $-\Omega$. Find the bracket of the energy's quadrupole moments for $x^2 - y^2$ and $2xy$ as a
function of $a$, and the radius at which it vanishes. Does the ball then have angular momentum?

::: solution
The rigid ball's $-\tfrac{16}{35}\matter M\Omega R^4/c^2$ is multiplied by $2a^7/R^7 - 1$. The bracket vanishes at
$a = 2^{-1/7}R = 0.906R$, outside 2.8's $0.871R$ where the angular momentum vanishes, so the ball then has angular
momentum.
:::

### The paper

Reproduce every number of [*A mass that passes*](/paper/#par:a-mass-that-passes) and of the caption of the paper's
Figure [](/paper/#fig:passing): the series' $\tfrac23$ and $\tfrac{8}{15}$, the 30 per cent, $\matter MC^2R^4/15b^6$,
0.080 and 0.104, and the five parts in $10^{33}$.

::: solution
The series and the pair's numbers are checked in the section on the pass. For the tonne,
$C = 2G \times 1000/44{,}000 = 3.03 \times 10^{-12}\unit{m^2\,s^{-1}}$. The uniform ball's $F$ at $b = 1.5$ m, summed
shell by shell, is $1914\unit{kg\,m^{-2}}$, of which the recoil's $\matter M/b^2$ is 1827. So
$\tfrac12C^2F/\matter\mu V^2 = 4.5 \times 10^{-33}$ of the speed.
:::
:::

::: paper
- [Section XII](/paper/#sec:hair) in full: the plain words, the field at one time, the paper's [](/paper/#eq:hair-bits)
  and Figure [](/paper/#fig:hair).
- [Section XIII](/paper/#sec:second-order) in full: its fifteen equations and Figures [](/paper/#fig:two-readings),
  [](/paper/#fig:passing), [](/paper/#fig:ladder) and [](/paper/#fig:hidden-flow).
- The Introduction's last bullet, whose "the field at two times gives all of it" the margin note on the impulses
  qualifies.
:::

::: deeper
- A. P. Calderón, "On an inverse boundary value problem" (1980) [@Calderon1980]: a few pages, with the exponentials
  of Section XIII.
- D. Marolf, "Unitarity and holography in gravitational physics" (2009) [@Marolf2009]: the boundary algebra and its
  remark on $L_x$, $L_y$ and $L_z$.
:::

[^nine]: The paper's "about nine times" and "nearly nine" are 8.4 (8.6 from the rounded 1200), nearer eight than nine.

[^H]: This $H$ is the bits, not 1.7's energy, 3.5's Wiener filter, or the wave's profile below. Here $\Lambda$ is not
    Part 7's projector.

[^thirty]: The "$30\%$" is the energy left inside. With the recoil, which both share, the totals differ by 4.5 per cent.

[^twotimes]: The paper's "the data at two times are the Fourier transform of the density", and its Introduction's "the
    field at two times gives all of it", need something to supply the impulses: a tide, heat at a known temperature,
    or a quantum state's zero point. A classical body at rest, read at any number of times, shows only the harmonic
    moments of $\matter\rho$; a known rate of turning
    ([13.4](/tutorial/what-a-field-keeps/flows-inside/#at-a-known-rate-of-turning-the-field-outside-holds-the-first-rung-of-the-ladder))
    and the passive ladder of a moving body (chapter 13.8) add a little. The same holds for *The two readings as one transform* and *Stability*.

[^half]: The paper's "multiplied by half of $\kappa^2 - K^2$, which is the Laplacian in these variables" can be
    misread: the Laplacian brings $\kappa^2 - K^2$, and the second reading carries half of it.

[^Rc]: The paper's $r$ here is the camera sphere's radius, written $R_c$ in its paragraphs on bits and in 13.2.

[^dv]: The paper's $3 \times 10^{-12}\unit{m\,s^{-1}}$ is the held tonne's whole pull at the edge, nearly half of it a
    kick to the ball as a whole. Its tidal part, the edge's impulse less the centre's, is
    $1.9 \times 10^{-12}\unit{m\,s^{-1}}$ (*checked here*).

[^frozen]: The pass lasts $b/V = 34\unit{\mu s}$, half a radian of the ball's slowest ringing, so "the parts of the
    body do not move meanwhile" holds only roughly; the internal energy changes by 10 to 15 per cent (1.8).

[^q]: The paper writes $E - cp_z$ here and $q = E/c - p_z$ in its Appendix C; they are the same component, $E - cp_z =
    cq$ (13.5).

[^none]: The paper's "has none" means that the integral of such a stress along every ray of light is zero.

[^strong]: First, "with $\psi$ confined to the body" reads two ways. Take $\psi = (R^2 - r^2)^2$ inside and zero
    outside, confined in 2.5's sense. As a smooth function inside, its $\nabla^4\psi$ is 120 and has a mass, so that
    reading needs every derivative up to order $2m - 1$ to vanish on the surface. Counted with the surface layer where
    $\nabla^2\psi$ jumps, as 13.3 counts the pair, it has no mass, and 2.5's sense is enough. Second, "differ under a
    tide of degree $m + 1$" fails when $\psi$ is itself the Laplacian of a confined function, as for A and B, whom
    every tide of degree two treats alike (13.3).

[^c]: The paper writes this field without $c$. In SI units it is $(f/c)\,\partial_t + ct\,\nabla f\cdot\nabla$, and the
    $t^2$ of its commutator becomes $c^2t^2$ (13.6).
