---
id: R9
title: 'Reading Section VIII, part 1: one table, four directions and a moving body'
question: 'With chapters 9.1 to 9.4 behind us, can we derive every claim of Section VIII from its plain words to the state of a moving body, and does every number come out as the paper says?'
part: '9'
requires: ['R1', '6.1', '6.3', '6.6', '7.5', '7.6', '8.4', '9.1', '9.2', '9.3', '9.4']
paper: [sec:one-pixel, eq:W, eq:invariants, eq:square, eq:one-wave, eq:stars, eq:one-spin, eq:magnetic-ratio, eq:polar, eq:speedometer, eq:star-velocity, eq:moving-state, eq:contact, fig:stars, fig:speedometer, app:proofs, eq:proof-stars, eq:proof-midpoint]
figures: [fig:stars, fig:speedometer]
live: [stars, speedometer]
---

The paper's [Section VIII](/paper/#sec:one-pixel) claims that the extra numbers of a gravitational pixel "let a single
pixel do much of the work of a whole camera". Its first half writes the ten numbers as one complex table, finds four
directions on the sky in every reading, and reads a pixel's own velocity and a moving body's whole state. With chapters
9.1 to 9.4 behind us, can we derive every claim of this first half, and does every number come out as the paper says?

This chapter reads the section in order, up to the paragraph [*The state of a moving
body*](/paper/#par:the-state-of-a-moving-body), and derives nothing new. As in
[R7](/tutorial/geometry/reading-section-ii-again/), each claim gets the chapter that derived it and one mark: *checked
here* (derived earlier, its numbers recomputed here), *read now, derived in chapter N*, or *stated in the paper*. The
map below draws the stretches in order (Figure [](#fig:read-viii-map)).

![Look first at the filled boxes: every stretch of the first half of Section VIII is derived in Part 9 or earlier,
with the results stated rather than derived in their dotted insets. The dashed strip is read in
R9b.](tut-read-viii-map){#fig:read-viii-map}

::: plain
The first half of Section VIII is about what one pixel can learn from a single reading. A pixel's ten numbers fit into
one table of five complex numbers. An observer who turns, or moves, reads that table turned, by an ordinary angle or
by an imaginary one, so the table's eigenvalues are the same for everyone at that place. They are four of the ten
numbers. Three more give the orientation of the field's own axes, and the last three a velocity.

So a pixel moving through a room of masses at rest can read its own velocity from one reading, and complex
eigenvalues show that something in the room moves. Every reading also picks out four directions on the sky. Their
pattern tells a single wave from a single body and from anything more complicated. For a moving body, the four
directions and the way the reading changes give its position, its velocity and its mass, at any speed.
:::

## The plain words hold, up to the moving body

The [plain words](/paper/#sec:one-pixel) first count: a sensor of light reads six numbers, a pixel ten, and one wave
needs four (*read now, derived in chapter
[9.1](/tutorial/one-point/spin-two/#the-square-holds-four-numbers-a-direction-and-one-complex-amplitude)*). Every
observer agrees on four of the ten, and three more give the field's axes and three a velocity.[^distinct] So a pixel in
a still room reads its own velocity,[^person] and motion within the room usually shows in the invariants[^motion]
(*read now, derived in chapter [9.3](/tutorial/one-point/the-matrix-w/)*, numbers *checked here*
[below](#ten-numbers-are-four-invariants-an-orientation-and-a-velocity)). Every reading also has four directions whose
pattern sorts fields and gives a moving body's position, velocity and mass (*read now, derived in chapter
[9.4](/tutorial/one-point/petrov/)*, numbers *checked here*
[below](#four-directions-on-the-sky-sort-every-reading)).[^four] The rest, from *Separating waves* on, is read in R9b.

## Ten numbers are six more than a wave needs

A detector of one component cannot tell a wave from "the pull of a passing lorry"
([R1](/tutorial/newton/reading-section-ii/#the-summary-in-plain-words-holds-number-by-number), *read now*). "Even
the whole electric part cannot find a wave beneath an unknown pull" can be checked at one instant. A plus
wave along $\hat z$ reads $\curv\tE = \curv\tE_+\,\mathrm{diag}(1, -1, 0)$, with $\curv\tE_+$ its amplitude in
$\mathrm{s^{-2}}$. Two masses, one on the $y$ axis with the tidal weight $G\matter M/r^3 = \tfrac23\curv\tE_+$ and one
on the $z$ axis with $\tfrac13\curv\tE_+$, give by chapter [1.4](/tutorial/newton/tides/)

$$\begin{aligned}&\tfrac23\curv\tE_+\,\mathrm{diag}(1, -2, 1) + \tfrac13\curv\tE_+\,\mathrm{diag}(1, 1, -2)\\
&\quad= \curv\tE_+\,\mathrm{diag}(1, -1, 0),\end{aligned}$$

the same tide (*checked here*, at one instant; with noise and over time, *read now, derived in chapter 9.7*). The
magnetic part tells them apart, as the paper says next: the wave's is as large as its tide, and masses at rest have
none.

## The ten numbers are one complex table, and a wave's is a square

The paragraph [*One complex matrix*](/paper/#par:one-complex-matrix) joins the two real tables, symmetric and
trace-free in vacuum, into one:

{{paper eq:W}}

a symmetric, trace-free table $\sym{weyl-complex}{\curv{\mathcal W}}$ of complex entries in $\mathrm{s^{-2}}$, "five
complex numbers" (*read now, derived in chapter
[9.3](/tutorial/one-point/the-matrix-w/#the-ten-numbers-are-one-complex-symmetric-table)*). A turned pixel reads
$R^{\mathsf T}\curv{\mathcal W}R$, chapter 1.1's rule for a table in turned axes.

A pixel moving along the unit vector $\hat u$ with the **rapidity** $\sym{rapidity}{\obs\eta}$, the pure number for
which its speed is $c\tanh\obs\eta$ (chapter
[6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not)), reads $\Lambda\curv{\mathcal
W}\Lambda^{\mathsf T}$. Here $\sym{complex-boost}{\Lambda} = \exp(-i\obs\eta\,\hat u\cdot\mathbf L)$, with generators
$\sym{generators}{(L_k)_{ij}} = -\epsilon_{kij}$. At $0.6c$ along $x$, $\obs\eta = \ln2$ and the rows of $\Lambda$ are
$(1, 0, 0)$, $(0, 1.25, 0.75i)$ and $(0, -0.75i, 1.25)$ (*checked here*). The rule is *read now, derived in chapter
[9.3](/tutorial/one-point/the-matrix-w/#a-moving-pixel-reads-the-table-turned-by-an-imaginary-angle)* as a sketch with a
named gap. That the group of boosts and turns is $SO(3,\mathbb C)$ is *stated in the paper* [@Petrov2000; @Penrose1960].

A turn has $R^{\mathsf T} = R^{-1}$, and a boost has $\Lambda^{\mathsf T} = \Lambda^{-1}$, because its transpose is the
boost with $-\obs\eta$. So both rules give $P\curv{\mathcal W}P^{-1}$, the same table in other axes, and the paper's

{{paper eq:invariants}}

are "the same for every observer at that point" (*read now, derived in chapters
[9.2](/tutorial/one-point/complex-symmetric/#two-complex-numbers-fix-the-eigenvalues-of-a-trace-free-three-by-three-table)
and [9.3](/tutorial/one-point/the-matrix-w/#the-eigenvalues-are-the-same-for-every-observer)*). For the person of
70 kg a metre away, $I = 1.31\times10^{-16}\unit{s^{-4}}$ and $J = -6.12\times10^{-25}\unit{s^{-6}}$ (*checked here*).

"Second, the $\mathcal W$ of a plane wave is the square of a vector." With unit vectors $\vect e_1$, $\vect e_2$ across
the direction of travel $\hat k$, $\vect e_1\times\vect e_2 = \hat k$, the null vector $\sym{null-vector}{\vect m} =
(\vect e_1 + i\vect e_2)/\sqrt2$ has $\hat k\times\vect m = -i\vect m$, since a right-angle turn sends $\vect e_1$ to
$\vect e_2$ and $\vect e_2$ to $-\vect e_1$. With 7.6's magnetic part of a wave,

{{paper eq:square}}

with the polarization amplitudes $\sym{wave-polarizations}{\curv\tE_+}$ and $\curv\tE_\times$ in $\mathrm{s^{-2}}$: a
table of rank one (*read now, derived in chapter
[9.1](/tutorial/one-point/spin-two/#a-plane-wave-fills-only-the-extreme-weight-so-its-reading-is-a-square)*). Its
direction comes back through the **super-Poynting vector**, $\epsilon_{ijk}\curv\tE_{jl}\curv\tB_{kl}$ in
$\mathrm{s^{-4}}$ (chapter 8.4):

{{paper eq:one-wave}}

A plus wave along $\hat z$ with $\curv\tE_+ = 1\unit{s^{-2}}$ gives the vector $(0, 0, 2)\unit{s^{-4}}$ and $|\curv
\tE|^2 = 2\unit{s^{-4}}$, so $\hat n = -\hat z$, toward the source (*checked here*). Light's wave
field $\light{\vect F} = \light{\vect E} + ic\light{\vect B}$ (chapter 6.6, with $\light{\vect E}$ and $\light{\vect
B}$ the electric and magnetic fields) is a multiple of $\vect m$ itself, so "a square against a single power" is spin
two against spin one (*read now, derived in chapter
[9.1](/tutorial/one-point/spin-two/#lights-wave-is-the-vector-itself-spin-one-against-spin-two)*). That "matter
neither reflects nor absorbs gravitational waves" is *stated in the paper*.

## Four directions on the sky sort every reading

The paragraph [*Principal null directions*](/paper/#par:principal-null-directions) labels each direction on the sky by
its **stereographic coordinate** $z$, a complex number, through the null vector $\vect m(z) = (1 - z^2, i(1 + z^2),
-2z)$, and asks where

{{paper eq:stars}}

Chapter [9.4](/tutorial/one-point/petrov/#a-direction-on-the-sky-is-a-complex-number) mapped $z$ to the direction along
which the wave of $\vect m(z)$ travels: $z = 0$ is $+\hat z$, $z = \infty$ is $-\hat z$, and $|z| = \tan(\vartheta/2)$,
with $\vartheta$ the angle from $+\hat z$. The quartic's four roots are the **principal null directions**,
and their pattern of coinciding is the field's **Petrov type**: "for one plane wave all four coincide", and one body
gives "two pairs". [9.4's table](/tutorial/one-point/petrov/#the-pattern-of-the-four-directions-is-the-fields-petrov-type)
lists the types with the paper's tests from the invariants (*read now, derived in chapter 9.4*). The roots are also the
reading's **Majorana stars** (chapter [8.4](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky)), because the
quartic is twice Majorana's polynomial (*read now, derived in chapter
[9.4](/tutorial/one-point/petrov/#the-four-directions-are-the-readings-majorana-stars)*).

"The type describes the
field, not the objects" (*read now, derived in chapter 9.4*). "The quantity $1 - 6J^2/I^3$ is $0.55$ for the two
masses": with the figure's masses 1 and 0.45 at $(-1.5, 0.3, 0)$ and $(0.9, 1.1, 0.6)$, in its units, the eigenvalues
are $-0.537$, $0.135$ and $0.402$, $I = 0.468$ and $J = -0.0874$, so the number is $0.553$ (*checked here*). Light's
condition $\vect m(z)\cdot\light{\vect F} = 0$ is a quadratic, with two roots (*read now, derived in chapter
[6.6](/tutorial/relativity/maxwell-complex/#light-has-two-special-directions-where-gravity-has-four)*).[^light]

{{paper fig:stars}}

In the figure, the body at $1.5$ along $-\hat x$, moving along $+\hat y$ at $0.9c$, has its directions at $(\pm0.436,
0.9, 0)$, each twice, whose midpoint $(0, 0.9, 0)$ is the caption's $\obs{\vect v}_\perp/c$. The two masses give four
directions on two lines, $\pm(-0.797, 0.224, -0.561)$ and $\pm(0.887, 0.227, -0.401)$: type I (*checked here*
from the quartics).

::: try {#stars}
Predict first: with *One body*, as the speed goes from 0 to $0.95c$, do the two pairs
stay pairs, and where does their midpoint go? Then try it. Next set the speed to zero, choose *Two*, predict where the
second body must go for its four dots to close into two pairs, and drag it there. Last, choose *Both*, a body with a
weak wave that travels off the line to it: predict how many separate dots you will see and which type that is, then
look.
:::

## One of the four spins points along the super-Poynting vector

A reading is also a state of four spins one half, unchanged when they are exchanged. What one of them holds, the
other three ignored, is

{{paper eq:one-spin}}

(*read now, derived in chapter
[8.4](/tutorial/quantum/spin/#one-of-the-four-spins-of-a-reading-points-along-its-super-poynting-vector)*).[^convention]
Here $\varrho_1$ is its density matrix, $\boldsymbol\sigma$ the Pauli matrices, $\sym{super-energy}{u}$ the
**super-energy** in $\mathrm{s^{-4}}$ and $\sym{super-poynting}{\mathbf P}$ the super-Poynting vector, so the spin's
arrow is $\mathbf P/u$. That the Petrov types are then classes of entanglement is *stated in the paper*
[@BengtssonZyczkowski2017; @Kam2026]. Its two checks hold:

- "Pure for one plane wave": there $\mathbf P = |\curv\tE|^2\hat k$ and $|\curv\tB| = |\curv\tE|$, so $u =
  |\curv\tE|^2$ and the arrow has length one (*checked here*).
- "Unpolarized in the field's own rest frame": there $\curv\tE$ and $\curv\tB$ are diagonal along the same axes, so
  their product is diagonal, hence symmetric, and $P_k = \epsilon_{kij}(\curv\tE\curv\tB)_{ij} = 0$ (*checked here*:
  a random reading carried to that frame gives $|\mathbf P| < 10^{-15}u$).

## The shape of the tide tells an isolated wave from an isolated mass

The paragraph [*Shape*](/paper/#par:shape) compares determinants. A wave's tide has nothing along $\hat k$, so
$\det\curv\tE = 0$ (7.6). A mass has the eigenvalues $-2:1:1$ times $G\matter M/r^3$, so $\det\curv\tE = -2(G\matter
M/r^3)^3$, which is $-2.04\times10^{-25}\unit{s^{-6}}$ for the person, equal to $J/3$ (*checked here*). "The test is
for an isolated source": the two masses that imitated a wave [above](#ten-numbers-are-six-more-than-a-wave-needs)
have determinant zero, as the wave does (*checked here*).

## The magnetic part equals the tide in a wave and is small near slow matter

The paragraph [*The magnetic part*](/paper/#par:the-magnetic-part) states

{{paper eq:magnetic-ratio}}

with $|\curv\tE|$ the **Frobenius norm**, the square root of the sum of the squares of the nine entries, and $v$ the
speed of the matter. In a wave $\curv\tB$ is $\curv\tE$ turned by 45° about $\hat k$ (*read now, derived in chapter
[7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45)*). Near a mass
crossing the line of sight at the speed $\obs v_\perp$ the ratio is $\sqrt3\,\obs v_\perp/c$
([7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight)),
$8.09\times10^{-9}$ for a person walking past at $1.4\unit{m\,s^{-1}}$ (*checked here*). The changing part of the
field, at the angular frequency $\omega$, has a magnetic part smaller than its tide "by about $kr$", with $k =
\omega/c$ and $r$ the distance: "more than $v/c$, but still far below one in the near zone" (*read now, derived in
chapter 7.5*).[^kr]

"Averaged over time, in mean square", independent waves have equal magnetic and electric parts (*read now, derived in
chapter [9.3](/tutorial/one-point/the-matrix-w/#how-large-the-magnetic-part-is-and-where-the-field-points)*).[^mean]
"In a standing wave the magnetic part vanishes where the electric part is largest." Two plus waves of amplitude
$\curv\tE_+$ along $\pm\hat x$, with $x$ the distance along their line, give $\curv\tE = 2\curv\tE_+\cos kx\cos\omega
t\,\mathrm{diag}(0, 1, -1)$. Their magnetic parts, which change sign with the direction of travel, add to
$2\curv\tE_+\sin kx\sin\omega t$ times the table with 1 at $yz$ and $zy$, zero where $\cos kx = \pm1$ (*checked here*).

## Ten numbers are four invariants, an orientation and a velocity

The paragraph [*Ten numbers*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity) writes a reading with
different eigenvalues as

{{paper eq:polar}}

where $\sym{complex-rotation}{P}$ is a **complex rotation**, $P^{\mathsf T}P = 1$, split into a real turn
$\sym{polar-turn}{R_0}$ and $e^{iK_0}$, with $\sym{polar-boost}{K_0}$ real and antisymmetric (*read now, derived in
chapter [9.2](/tutorial/one-point/complex-symmetric/#every-complex-rotation-is-a-boost-followed-by-a-turn)*).[^K0]
Then $(iK_0)^\dagger = -iK_0^{\mathsf T} = iK_0$, so $e^{iK_0}$ equals its own conjugate transpose, and because $R_0$
is real with $R_0^{\mathsf T}R_0 = 1$, $P^\dagger P = e^{iK_0}R_0^{\mathsf T}R_0e^{iK_0} = e^{2iK_0}$.

The eigenvalues $\sym{weyl-eigenvalue}{\curv w_a}$ give four numbers, $R_0$ three angles and $K_0$ the velocity of the
field's **principal observer**, the one observer who reads $\curv\tE$ and $\curv\tB$ along shared axes, unique for type
I. It reads the least $|\curv\tE|^2 + |\curv\tB|^2$ of all observers, $\sum_a|\curv w_a|^2$, by Schur's theorem, which
chapter 9.3 states: every square table is $UTU^\dagger$ with $U$ unitary and $T$ triangular, the eigenvalues on its
diagonal (*read now, derived in chapter
[9.3](/tutorial/one-point/the-matrix-w/#ten-numbers-are-four-invariants-three-angles-and-a-velocity)*). Among the
figure's two masses, a pixel at $0.6c$ along $(0.30, 0.80, -0.52)$ reads $|\curv\tE|^2 + |\curv\tB|^2 = 2.27$ in the
figure's units, and the room, the principal observer, reads $0.468 = I$, because with real eigenvalues $\sum_a|\curv
w_a|^2 = \mathrm{tr}\,\curv{\mathcal W}^2$. The polar split returns $\obs\eta = 0.693147 = \ln2$ and the pixel's
velocity $(0.180, 0.480, -0.312)\,c$ (*checked here*).

"For a scene of masses at rest, $\tB = 0$ in the scene's frame", so every observer finds real eigenvalues, and $P$
holds the pixel's velocity through the room at any speed. To first order in the speed, in right-handed principal axes
of $\curv\tE$ with its eigenvalues $\sym{tide-eigenvalue}{\curv\lambda_a}$ in $\mathrm{s^{-2}}$,

{{paper eq:speedometer}}

with $\obs v_a$ the components of the pixel's own velocity.[^v] With noise of standard deviation $\sigma_n$ on each of
the five coefficients of $\curv\tB$ (the paper's bare $\sigma$), each component is read to $c\,\sigma_n/(\sqrt2\,
|\curv\lambda_b - \curv\lambda_c|)$ (*read now, derived in chapter
[9.3](/tutorial/one-point/the-matrix-w/#in-a-room-at-rest-a-pixel-reads-its-own-velocity)*). With $\sigma_n =
10^{-16}\unit{s^{-2}}$, one part in $10^8$ of $10^{-8}\unit{s^{-2}}$, eigenvalues $10^{-8}\unit{s^{-2}}$ apart give

$$\frac{3.00\times10^8\unit{m\,s^{-1}}\times10^{-16}}{\sqrt2\times10^{-8}} = 2.1\unit{m\,s^{-1}},$$

"about two metres per second". Beside the person a metre away the gap across the line is $3G\matter M/r^3 =
1.40\times10^{-8}\unit{s^{-2}}$, giving $1.5\unit{m\,s^{-1}}$, and along the line the two equal squeezes leave no gap
(*checked here*).

## Complex eigenvalues show motion in the scene, and light reads less

"If the eigenvalues are complex, something in the scene moves relative to the rest of it, or turns" (*read now, derived
in chapter
[9.3](/tutorial/one-point/the-matrix-w/#complex-eigenvalues-mean-that-something-in-the-room-moves-or-turns)*). That
outside a spinning body they go, to first order in $a$, as $(r - ia\cos\vartheta)^{-3}$ is Kerr's result, *stated in
the paper* [@Kerr1963]; chapter 9.3 derived the phase $3a/r$ on the axis. Here $\sym{kerr-parameter}{a}$ is the angular
momentum over $\matter Mc$, a length, and $\vartheta$ the angle from the spin axis. For the Earth $a =
5.86\times10^{33}/(5.97\times10^{24}\times2.998\times10^8) = 3.27\unit{m}$, and at the polar surface, $r =
6.357\times10^6\unit{m}$, the phase is $1.54\times10^{-6}$, the paper's $1.5\times10^{-6}$ (*checked here*).[^kerr]

On the equator the eigenvalues stay real at first order, and the velocity read is

$$\begin{aligned}\Bigl(1 - \frac{C}{\matter MR^2}\Bigr)\Omega R &= 0.6693\times465.1\unit{m\,s^{-1}}\\ &= 311\unit{m\,s^{-1}},\end{aligned}$$

with $\Omega = 7.292\times10^{-5}\unit{s^{-1}}$ the Earth's rate of turning, $R = 6.378\times10^6\unit{m}$ its radius
and $C$ its moment of inertia, $0.3307\,\matter MR^2$, Section II's letter too (*checked here*).

{{paper fig:speedometer}}

::: try {#speedometer}
The paper's speedometer. Predict first: at $0.6c$, whatever the heading, does the motion test under the path leave its
floor? Then try it. Next set *One of the masses* to *Walks* and then to *Flies*, and compare. Last, say which part of
the velocity light's arrow leaves out.
:::

"Light cannot do this." Its two invariants come from $\light{\vect F}\cdot\light{\vect F} = \light{\vect E}^2 -
c^2\light{\vect B}^2 + 2ic\,\light{\vect E}\cdot\light{\vect B}$. In the frame where $\light{\vect E}$ is parallel to
$\light{\vect B}$, a boost along their axis changes nothing, so a sensor reads at most two components of its velocity
(*read now, derived in chapters
[6.6](/tutorial/relativity/maxwell-complex/#one-complex-number-is-the-same-for-every-observer) and
[9.3](/tutorial/one-point/the-matrix-w/#light-reads-only-two-components-of-its-own-velocity-gravity-reads-three)*). One
body has the same blind spot along the line to it: "coming straight at the pixel, even at $0.3\,c$, it shows no $\tB$
at all", and its exact field gives a magnetic part below $10^{-16}$ of the tide, the rounding error (*checked here*).
"Two bodies seen off the line through them, or one that is not round seen off its axis, generally remove the blind
spot" (*read now, derived in chapter 9.3*).[^line]

## One pixel reads the position, velocity and mass of a moving body

The paragraph [*The state of a moving body*](/paper/#par:the-state-of-a-moving-body) reads a round body moving
steadily. Its two pairs are "displaced by aberration toward its direction of motion", because the four directions move
as rays of light do (*read now, derived in chapter
[9.4](/tutorial/one-point/petrov/#moving-the-pixel-moves-the-four-directions-as-rays-of-light)*). With
$\sym{pnd-pairs}{\hat p_\pm}$ the unit vectors of the two pairs and $\obs{\vect v}_\perp$ the body's velocity across
the line from the body to the pixel, in $\mathrm{m\,s^{-1}}$,

{{paper eq:star-velocity}}

Chapter [9.4](/tutorial/one-point/petrov/#one-pixel-reads-the-whole-state-of-a-moving-body) derived it from chapter
[6.3](/tutorial/relativity/aberration/#one-step-of-appendix-c-the-directions-of-a-moving-body-are-its-directions-at-rest-aberrated)'s
aberration algebra, the paper's [](/paper/#eq:proof-stars) and [](/paper/#eq:proof-midpoint), with the companion line
"$\tfrac12(\hat p_+ - \hat p_-) = \pm(1 - v_\perp^2/c^2)^{1/2}\,\hat n$", where $\hat n$ is the unit vector toward where
the body is now.[^first] As a new check, a body at $(-1, 2, 1.5)$ moving with $(0.5, -0.2, 0.3)\,c$, in units with
$G\matter M = c = 1$, has the half sum $(0.4379, -0.0759, 0.3931)$, equal to $\obs{\vect v}_\perp/c$ to eight figures,
and a half difference of length $0.80494 = (1 - \obs v_\perp^2/c^2)^{1/2}$ along $\hat n$ (*checked here*).

"The line turns toward the sideways velocity at the rate $v_\perp/r$", which gives the distance. The repeated eigenvalue
is $\curv w = G\matter M/R_*^3$, with $\sym{rest-frame-distance}{R_*}$ the distance in the body's own frame,

$$R_*^2 = \obs\gamma^2\Bigl(r^2 - \frac{|\obs{\vect v}\times\vect r|^2}{c^2}\Bigr),$$

where $\obs\gamma = (1 - \obs v^2/c^2)^{-1/2}$ is chapter
[6.1](/tutorial/relativity/lorentz/#a-moving-ruler-is-shorter-along-its-motion-and-distances-in-a-bodys-own-frame-are-longer)'s
factor for the body's speed $\obs v$ relative to the pixel. The vector $\obs{\vect v}\times\vect r$ is constant along
the path because $\dot{\vect r} = \obs{\vect v}$. So

{{paper eq:moving-state}}

Chapter 6.1 left the first line to this reading; all three are *read now, derived in chapter 9.4*. For the body
above, three readings $10^{-4}$ apart give $r = 2.692582$ (the true $\sqrt{7.25}$), $\dot r = -0.167126\,c$ and
$\matter M = 1.000000$, true to seven figures (*checked here*). These are the paper's "seven numbers": two angles of
$\hat n$ and the distance $r$ give the position, the two components of $\obs{\vect v}_\perp$ and the rate $\dot r$
give the velocity, and $\matter M$ is the seventh.

A body coming straight on cannot be ranged, but its
tide along the line, $\sym{line-tide}{\curv\tE_\parallel}$, gives

{{paper eq:contact}}

(*read now, derived in chapter 9.4*).[^contact] For a body coasting straight in at $0.5c$ from 3 units, finite
differences of $\curv\tE_\parallel = -2G\matter M/\obs\gamma^3r^3$ give $3\curv\tE_\parallel/\dot{\curv
\tE}_\parallel = 6.000 = -r/\dot r$, the time to arrival, and the second ratio $1.3333 = \tfrac43$ (*checked here*).

## The ledger: the first half's twelve equations are derived

| The paper's equation | What it says | Where it is derived; its mark here |
|---|---|---|
| [](/paper/#eq:W) | ten numbers, one table | [1.5b](/tutorial/newton/complex-numbers/), [9.3](/tutorial/one-point/the-matrix-w/#the-ten-numbers-are-one-complex-symmetric-table); *read now* |
| [](/paper/#eq:invariants) | the invariants | [9.2](/tutorial/one-point/complex-symmetric/#two-complex-numbers-fix-the-eigenvalues-of-a-trace-free-three-by-three-table), [9.3](/tutorial/one-point/the-matrix-w/#the-eigenvalues-are-the-same-for-every-observer); *checked here* |
| [](/paper/#eq:square) | a wave is a square | [7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45), [9.1](/tutorial/one-point/spin-two/#a-plane-wave-fills-only-the-extreme-weight-so-its-reading-is-a-square); *read now* |
| [](/paper/#eq:one-wave) | a wave's direction | [9.1](/tutorial/one-point/spin-two/#the-square-holds-four-numbers-a-direction-and-one-complex-amplitude); *checked here* |
| [](/paper/#eq:stars) | four directions | [9.4](/tutorial/one-point/petrov/#four-directions-solve-one-quartic); *checked here* |
| [](/paper/#eq:one-spin) | one spin's state | [8.4](/tutorial/quantum/spin/#one-of-the-four-spins-of-a-reading-points-along-its-super-poynting-vector); *checked here* |
| [](/paper/#eq:magnetic-ratio) | the size of $\curv\tB$ | [7.5](/tutorial/geometry/gravitomagnetism/#a-moving-mass-makes-a-magnetic-part-only-by-moving-across-the-line-of-sight), [7.6](/tutorial/geometry/gravitational-waves/#the-magnetic-part-of-a-wave-is-its-tide-turned-by-45), [9.3](/tutorial/one-point/the-matrix-w/#how-large-the-magnetic-part-is-and-where-the-field-points); *checked here* |
| [](/paper/#eq:polar) | invariants, axes, velocity | [9.2](/tutorial/one-point/complex-symmetric/#every-complex-rotation-is-a-boost-followed-by-a-turn), [9.3](/tutorial/one-point/the-matrix-w/#ten-numbers-are-four-invariants-three-angles-and-a-velocity); *checked here* |
| [](/paper/#eq:speedometer) | the speedometer | [9.3](/tutorial/one-point/the-matrix-w/#in-a-room-at-rest-a-pixel-reads-its-own-velocity); *checked here* |
| [](/paper/#eq:star-velocity) | the pairs' midpoint | [6.3](/tutorial/relativity/aberration/#one-step-of-appendix-c-the-directions-of-a-moving-body-are-its-directions-at-rest-aberrated), [9.4](/tutorial/one-point/petrov/#one-pixel-reads-the-whole-state-of-a-moving-body); *checked here* |
| [](/paper/#eq:moving-state) | distance, approach, mass | [9.4](/tutorial/one-point/petrov/#one-pixel-reads-the-whole-state-of-a-moving-body); *checked here* |
| [](/paper/#eq:contact) | time to contact | [9.4](/tutorial/one-point/petrov/#one-pixel-reads-the-whole-state-of-a-moving-body); *checked here* |

Appendix C's [](/paper/#eq:proof-stars) and [](/paper/#eq:proof-midpoint) are derived too, in 6.3 and 9.4. The section's
other fourteen equations, from the paper's [](/paper/#eq:pencil) to its [](/paper/#eq:magnetic-range), belong to
chapters 9.5 to 9.7 and to R9b. Nine results are stated, not derived. The paper states the group $SO(3,\mathbb C)$,
Kerr's eigenvalues beyond first order, the classes of entanglement, and that matter neither reflects nor absorbs (argued
in Section VII and estimated in chapter [5.5](/tutorial/waves/radiance/)). Chapter 9.3 states [its boost rule's
gap](/tutorial/one-point/the-matrix-w/#a-moving-pixel-reads-the-table-turned-by-an-imaginary-angle) and [Schur's
theorem](/tutorial/one-point/the-matrix-w/#ten-numbers-are-four-invariants-three-angles-and-a-velocity); chapter 9.4,
Penrose's link of [shapes to root
patterns](/tutorial/one-point/petrov/#the-pattern-of-the-four-directions-is-the-fields-petrov-type) and the [Möbius
maps](/tutorial/one-point/petrov/#moving-the-pixel-moves-the-four-directions-as-rays-of-light) that keep the type;
chapters [8.4](/tutorial/quantum/spin/#a-spin-s-is-2s-stars-on-the-sky) and
[9.4](/tutorial/one-point/petrov/#the-four-directions-are-the-readings-majorana-stars), Majorana's factors and phases.

::: check
### Q

A pixel moves through a still room whose tide has two eigenvalues $3\times10^{-9}\unit{s^{-2}}$ apart, read with noise
$10^{-17}\unit{s^{-2}}$ on each coefficient. How well does it know the velocity component that this gap controls?

### A

To $2.998\times10^8\times10^{-17}/(1.414\times3\times10^{-9}) = 0.71\unit{m\,s^{-1}}$.

### Q

Two equal masses sit one unit from the pixel, along $\hat x$ and along $\hat y$, with the tide $\mathrm{diag}(-1, -1,
2)$ in units of $G\matter M/r^3$. Why could one body not make it, although it has a repeated eigenvalue?

### A

Here $I = J = 6$, so the repeated eigenvalue $-J/I = -1$ is negative, while one body's is positive.
:::

**The idea to keep: the first half of Section VIII follows from Part 9. A pixel's ten numbers are one complex table that
every observer reads turned, so its eigenvalues are four numbers all agree on, and the rest is the field's axes and a
velocity. Its four principal null directions sort fields into types and give a moving body's position, velocity and
mass.**

::: problems
### Practice

Rerun the speedometer's chain for R1's lorry, 20 tonnes at 10 m, read with noise
$10^{-16}\unit{s^{-2}}$: its repeated eigenvalue $\curv w$, the invariants $I$ and $J$, and the precision of each
velocity component that the lorry alone lets a pixel read.

::: solution
$\curv w = G\matter M/r^3 = 1.33\times10^{-9}\unit{s^{-2}}$, so $I = 6\curv w^2 = 1.07\times10^{-17}\unit{s^{-4}}$ and
$J = -6\curv w^3 = -1.43\times10^{-26}\unit{s^{-6}}$. The gap across the line is $3\curv w = 4.00\times10^{-9}
\unit{s^{-2}}$, so the two components across it are read to $5.3\unit{m\,s^{-1}}$, and the one along it not at all.
:::

### Stretch

A pixel moves at $1\unit{m\,s^{-1}}$ along $\hat x$ through the tide $\curv\tE_+\,\mathrm{diag}(1, -1, 0)$ of this
chapter's two masses. Find its $|\curv\tB|/|\curv\tE|$ from the paper's [](/paper/#eq:speedometer), and
say whether any motion of the pixel could make the masses read like the plus wave.

::: solution
In the right-handed axes $\hat x$, $\hat y$, $\hat z$, $\curv\lambda_a = \curv\tE_+$, $-\curv\tE_+$, $0$, and only
$\obs v_1 \neq 0$, so $\curv\tB_{23} = \curv\tB_{32} = (\obs v_1/c)(\curv\lambda_3 - \curv\lambda_2) =
\curv\tE_+\obs v_1/c$, and the other entries vanish. Then $|\curv\tB|/|\curv\tE| = \obs v_1/c = 3.3\times10^{-9}$,
against 1 for the wave. No motion can do it: the masses' $I = 2\curv\tE_+^2$ is the same for every observer, and the
wave's square $\curv{\mathcal W} = 2\curv\tE_+\vect m\vect m^{\mathsf T}$ has $I = 0$.
:::

### The paper

The paragraph *Shape* ends: "their sum can have either form". Build two plus waves, along $\hat z$ and along $\hat x$,
whose tides at one instant add to that of one mass on the $z$ axis, and say what still tells them apart.

::: solution
Waves along $\hat z$ and $\hat x$ of amplitudes $s$ and $s'$, in $\mathrm{s^{-2}}$, give $s\,\mathrm{diag}(1, -1, 0)
+ s'\,\mathrm{diag}(0, 1, -1)$, which is a mass's $s\,\mathrm{diag}(1, 1, -2)$, with determinant $-2s^3$, when $s' =
2s$. Their magnetic parts sit at $xy$ and $yz$ and cannot cancel: $|\curv\tB|^2 = 2s^2 + 8s^2 = 10s^2$ against
$|\curv\tE|^2 = 6s^2$, a ratio of $1.29$, where one mass at rest has none.
:::
:::

::: paper
- Section VIII's plain words, opening and [*One complex matrix*](/paper/#par:one-complex-matrix): the paper's
  [](/paper/#eq:W), [](/paper/#eq:invariants), [](/paper/#eq:square) and [](/paper/#eq:one-wave).
- Section VIII's [*Principal null directions*](/paper/#par:principal-null-directions), [*Shape*](/paper/#par:shape)
  and [*The magnetic part*](/paper/#par:the-magnetic-part): the paper's [](/paper/#eq:stars),
  [](/paper/#eq:one-spin) and [](/paper/#eq:magnetic-ratio), and Figure [](/paper/#fig:stars).
- Section VIII's [*Ten numbers*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity): the paper's
  [](/paper/#eq:polar) and [](/paper/#eq:speedometer), and Figure [](/paper/#fig:speedometer).
- Section VIII's [*The state of a moving body*](/paper/#par:the-state-of-a-moving-body), with Appendix C's [*The
  principal null directions of a moving body*](/paper/#par:the-principal-null-directions-of-a-moving-body): the
  paper's [](/paper/#eq:star-velocity), [](/paper/#eq:moving-state) and [](/paper/#eq:contact).
:::

::: deeper
- The GR course's [section
  10.7](https://neovand.github.io/general-relativity/chapter-10.html#10-7-scalar-invariants-are-powerful-but-spacetime-has-a-loophole)
  builds curvature invariants like $I$ and $J$ and shows what they miss.
:::

[^distinct]: There is one such observer only when the three eigenvalues differ, as the paper says. One round body has
    two equal ones, $4.67\times10^{-9}\unit{s^{-2}}$ for the person of 70 kg a metre away, and a boost along the line
    to it changes nothing, so no observer on that line is singled out (9.3).

[^person]: Near a person, the paper's "about two metres per second" is the speed across the line to the person, where
    the gap $3G\matter M/r^3$ ($\matter M = 70$ kg, $r = 1$ m) gives $1.5\unit{m\,s^{-1}}$. Along that line, two equal
    eigenvalues leave the velocity unread.

[^motion]: What is proved is the other way round: a room at rest gives real eigenvalues. Hence the paper's "usually".
    One body moving steadily gives real ones too: with $G\matter M = c = 1$, the figure's body at $0.9c$, 1.5 units
    away, gives $-0.593$, $0.296$ and $0.296$ (9.3).

[^four]: Hence the paper's "usually four separate directions" and "generally four distinct points". With $G = 1$,
    masses 1 and 0.45 on one line through the pixel, 1.5 and 0.9 away on opposite sides, make one body's reading, with
    the eigenvalue $0.914$ twice (9.4). Two equal masses at right angles give two pairs that point at neither (*Check
    yourself*).

[^light]: Hence the paper's "any field of light whose invariant is not zero has two separate null directions". A static
    field with $c\light{\vect B}$ as large as $\light{\vect E}$ and at right angles to it has
    $\light{\vect F}\cdot\light{\vect F} = 0$ and one double direction, although it is not a wave (6.6).

[^convention]: The paper takes $\curv{\mathcal W}$ itself as the state. Its conjugate would reverse the arrow to
    $-\mathbf P/u$, toward the source. With this choice, 8.4's, a plus wave along $\hat z$ has $\mathbf P/u = (0, 0,
    1)$, its direction of travel.

[^kr]: For a body swaying with the amplitude $d$, the changing tide goes as $G\matter Md/r^4$ and its magnetic part as
    $G\matter M\omega d/cr^3$, so the ratio is $\omega r/c = kr = (v/c)(r/d)$, with $v = \omega d$ (7.5).

[^mean]: The time average of $|\curv\tB|^2$ equals that of $|\curv\tE|^2$, but the average of the ratio itself can be
    infinite: in the standing wave below, where $kx = \pi/4$, it is $|\tan\omega t|$.

[^K0]: That $K_0$ is real and antisymmetric is what makes the split work. For the moving pixel below, its entries above
    the diagonal, $0.342$, $0.577$ and $-0.174$, are real and make a vector of length $0.693 = \ln2$.

[^v]: The paper's "pixel's velocity $\mathbf v$ through the room" is the opposite of the velocity "of the scene
    relative to itself" that $P$ holds. The formula holds in right-handed axes. Beside the person, a pixel crossing the
    line at $1\unit{m\,s^{-1}}$ reads an entry of $4.7\times10^{-17}\unit{s^{-2}}$, whose sign the scene's velocity or
    left-handed axes would reverse.

[^kerr]: Kerr's $(r - ia\cos\vartheta)^{-3}$ is exact for his black hole. For the Earth the first order in $a$ is
    enough, because $a/r = 5.2\times10^{-7}$. The phase falls as $1/r$, to half its surface value 6,357 km above the
    pole.

[^line]: On the line through two bodies, masses 1 and 0.45 at 1.5 and 0.9 ($G = 1$) give $-1.83$, $0.91$ and $0.91$, so
    a boost along it reads no magnetic part, and a body symmetric about an axis, seen along it, keeps two equal
    eigenvalues (9.3).

[^first]: To first order, 7.5's $|\curv\tB|/|\curv\tE| = \sqrt3\,\obs v_\perp/c$ gives the size of $\obs v_\perp$ but
    not its direction, as the paper says. The figure's body at $0.9c$ has the exact ratio $0.993$, against
    $\sqrt3\times0.9 = 1.56$.

[^contact]: Exactly, the tide along the line is $-2G\matter M/\obs\gamma^3r^3$, so its $r^{-3}$ law needs $\obs\gamma$
    to stay fixed, which holds while $\obs\gamma^2r|\ddot r| \ll c^2$, the paper's condition, with $\ddot r$ the
    acceleration along the line. For 9.4's walker, 5 m away and speeding up at $0.05\unit{m\,s^{-2}}$, $r|\ddot r|/c^2
    = 2.8\times10^{-18}$.
