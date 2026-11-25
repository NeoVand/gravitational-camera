---
id: '7.5'
title: "Gravity's electric and magnetic parts; gravitomagnetism"
question: 'A pixel at rest on the equator reads a magnetic part of the tide of size $4.8\times10^{-12}\,\mathrm{s^{-2}}$, and the paper says that "one pixel on the ground reads $C/MR^2$, the number that tells a planet with a core from one without". What makes a magnetic part of the tide, and why does it need motion?'
part: '7'
requires: ['1.1', '1.3', '1.5', '1.6', '6.1', '6.5', '7.2', '7.3', '7.4']
paper: [sec:pixel, eq:magnetic, sec:near-field, eq:magnetic-point, eq:current-column, sec:one-pixel, eq:magnetic-ratio, sec:vistas, eq:multipole]
figures: []
live: [magnetic-tide]
depth: A
---

In the paper's [Section II](/paper/#sec:pixel), [*The Earth's own tide*](/paper/#par:the-earths-own-tide) ends with the
planet's turning. A pixel at rest on the equator moves with the ground at $465\unit{m\,s^{-1}}$ through the field of a
spinning planet, and the two together give it a magnetic part of the tide of size $(3G\matter M\Omega/cR^2)(1 -
C/\matter MR^2) = 4.8\times10^{-12}\unit{s^{-2}}$, with $C$ the planet's moment of inertia, its resistance to being
spun, in $\mathrm{kg\,m^2}$. In the paper's words, "it is a measurement: one pixel on the ground reads $C/MR^2$, the
number that tells a planet with a core from one without". This second kind of tide, Section II says, "makes gyroscopes
at neighbouring points turn slightly relative to one another".

So we ask what makes a magnetic part of the tide, and why it needs motion. It is the curvature with one time index
(chapter
[7.2](/tutorial/geometry/curvature-and-tides/#the-pixel-reads-six-of-the-twenty-numbers-and-the-magnetic-part-eight-more)),
which matter makes through the flow of its mass (chapter [7.4](/tutorial/geometry/linearized-gravity/)).

::: plain
A mass at rest makes one kind of tide: it stretches a ring of free balls toward itself and squeezes it across. A mass
that moves makes a second kind as well, called the magnetic part. It stretches nothing. Instead, two gyroscopes a metre
apart, whose axes would otherwise keep pointing at the same stars, slowly turn relative to one another.

The magnetic part comes from the flow of mass, as a magnetic field comes from a flow of electric charge. Near slow
matter it is smaller than the ordinary tide by about the ratio of the matter's speed to the speed of light. Only motion
across the line of sight makes it, so it cannot see a body that comes straight toward it.

A spinning planet makes a magnetic part, and a pixel carried round by the ground reads another through its own
motion. The two partly cancel, and what is left depends on how much of the planet's mass lies in its core.
:::

## The magnetic part is the curvature with one time index

We want one table for the eight curvature numbers with one time index, because chapter 7.2 found that a pixel reads
them besides the tide. Here $\curv R_{pqj0}$ is 7.2's Riemann tensor in the pixel's frame, in $\mathrm{m^{-2}}$. It
changes sign when $p$ and $q$ are exchanged, so for each $j$ it is an antisymmetric table in $pq$, and chapter
[1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise) turned such a table into a
vector with $\tfrac12\epsilon$. The paper does this for each $j$ and multiplies by $c^2$:

{{paper eq:magnetic}}

Here $\epsilon_{ipq}$ is 1.1's [Levi-Civita
symbol](/tutorial/newton/vectors-and-indices/#the-cross-product-is-written-with-the-levi-civita-symbol). The unit is
that of $c^2$ times $\mathrm{m^{-2}}$, which is $\mathrm{s^{-2}}$, as for 7.2's tide $\curv\tE_{ij} =
c^2\curv R_{0i0j}$; with the $\tfrac12$ the two tables are equal in size in a gravitational wave (chapter 7.6). We call
$\sym{magnetic-tide}{\curv{\tB}}_{ij}$ the **magnetic part** of the tide, and $\curv\tE_{ij}$ the **electric part**;
the last section explains the names.

**What it does.** These components act only on moving balls (chapter 7.2), so the paper reads $\curv\tB$ with
gyroscopes. A **gyroscope** is a fast wheel whose axis keeps its direction when nothing twists it (chapter
[1.6](/tutorial/newton/motion/#angular-momentum-stays-fixed-when-the-force-points-at-a-centre)). Two gyroscopes a small
distance $\vect\xi$ apart, in metres, held at rest in the pixel's non-rotating frame, turn relative to one another with
the angular velocity

$$\delta\Omega_i = \frac1c\,\curv\tB_{ij}\,\xi_j ,$$

in $\mathrm{rad\,s^{-1}}$, as the [section on
gyroscopes](#neighbouring-gyroscopes-turn-relative-to-one-another-at-the-magnetic-part-times-their-separation) derives.
On the equator, 1 m apart, this is $1.6\times10^{-20}\unit{rad\,s^{-1}}$, so a full turn of one relative to the other
would take about 900 times the age of the universe. A non-example is a pixel whose axes turn in empty space: all its
gyroscopes turn alike relative to its axes, and that turning belongs to the frame, not to the curvature.

**The trace is always zero.** The pair symmetry of 7.2 gives $\curv R_{pqi0} = \curv R_{i0pq} = -\curv R_{0ipq}$, so

$$\curv\tB_{ii} = \tfrac12c^2\epsilon_{ipq}\curv R_{pqi0} = -\tfrac12c^2\epsilon_{ipq}\curv R_{0ipq} .$$

Chapter 7.2's cyclic identity with the first index 0 reads $\curv R_{0ipq} + \curv R_{0pqi} + \curv R_{0qip} = 0$. We
multiply it by $\epsilon_{ipq}$ and sum. A cyclic renaming of the letters, which leaves $\epsilon$ unchanged, turns the
second and third terms into the first, so $3\epsilon_{ipq}\curv R_{0ipq} = 0$ and

$$\boxed{\;\mathrm{tr}\,\curv\tB = 0\;} \label{eq:trace}$$

at every event, inside matter too, because the cyclic identity holds for every Riemann tensor. The electric part
differs: chapter
[7.3](/tutorial/geometry/einstein-equation/#the-trace-of-the-tide-is-the-ricci-curvature-along-the-observers-time) found
$\mathrm{tr}\,\curv\tE = c^2\curv R_{00}$, which matter sets.

**The antisymmetric part is a Ricci component.** We contract $\curv\tB_{ij}$ with $\epsilon_{kij} = \epsilon_{ijk}$.
Chapter [1.1](/tutorial/newton/vectors-and-indices/#two-levi-civita-symbols-make-two-kronecker-deltas)'s identity
$\epsilon_{ijk}\epsilon_{ipq} = \delta_{jp}\delta_{kq} - \delta_{jq}\delta_{kp}$ gives

$$\epsilon_{kij}\curv\tB_{ij} = \tfrac12c^2\bigl(\curv R_{jkj0} - \curv R_{kjj0}\bigr) = c^2\curv R_{jkj0} .$$

The Ricci tensor of 7.3 is $\curv R_{k0} = \curv R^\alpha{}_{k\alpha0}$. Its term $\alpha = 0$ vanishes, because
$\curv R_{0k00}$ is antisymmetric in its last pair, and raising a spatial index changes nothing, so

$$\boxed{\;\epsilon_{kij}\curv\tB_{ij} = c^2\curv R_{k0} .\;} \label{eq:ricci}$$

The left side sees only the antisymmetric part of $\curv\tB$. We write that part as 1.1's vector in disguise,
$\curv\tB_{[ij]} = \epsilon_{ijm}w_m$; then the left side is $\epsilon_{kij}\epsilon_{ijm}w_m = 2w_k$, so $w_k =
\tfrac12c^2\curv R_{k0}$.

**In empty space** $\curv R_{k0} = 0$ (chapter 7.3), so $\curv\tB$ is symmetric and trace-free, one of chapter
[1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left)'s tables of five
numbers.

**Inside matter** we assume that **the matter at the pixel moves slowly**, at velocity $\vect v$, and keep the first
order in $v/c$. Chapter 7.3's trace-reversed equation, with $\field g_{0k} = 0$ at the pixel, gives $\curv R_{0k} = (8\pi
G/c^4)\matter T_{0k}$, and chapter 6.5's moving matter has $\matter T_{0k} = -\matter\rho cv_k$, with
$\sym{density}{\matter\rho}$ the density in $\mathrm{kg\,m^{-3}}$. So $w_k = -(4\pi G/c)\matter\rho v_k$:

$$\boxed{\;\curv\tB_{[ij]} = -\frac{4\pi G}{c}\,\epsilon_{ijk}\,\matter\rho v_k ,\;} \label{eq:antisym}$$

Section II's antisymmetric part, which "lies along the flow". Its vector, $-(4\pi G/c)\matter\rho\vect v$, points
upstream, against $\vect v$.

**Numbers.** In water ($1000\unit{kg\,m^{-3}}$) flowing at $1\unit{m\,s^{-1}}$ it is $4\pi G\matter\rho v/c =
2.8\times10^{-15}\unit{s^{-2}}$, the trace of the tide inside water, $8.4\times10^{-7}\unit{s^{-2}}$, times $v/c =
3.3\times10^{-9}$. A beam of light has $\matter T_{0k} = -F_k/c$
([6.5](/tutorial/relativity/stress-energy/#dust-a-fluid-and-a-beam-of-light-each-fill-the-table)), with $\vect F$ the
energy flux in $\mathrm{W\,m^{-2}}$ (not a force), so $\matter\rho\vect v$ becomes $\vect F/c^2$ and the antisymmetric
part is Section VIII's $-(4\pi G/c^3)\epsilon_{ijk}F_k$ in [*Matter at the pixel*](/paper/#par:matter-at-the-pixel).

**What it means.** At the pixel the trace of $\curv\tE$ reads the energy of the matter there, and the antisymmetric
part of $\curv\tB$ its momentum.

## Moving matter makes the magnetic part through the potential of its flow

We want $\curv\tB$ from the field of moving matter. We assume, as chapter
[7.4](/tutorial/geometry/linearized-gravity/#moving-matter-adds-a-potential-of-its-flow) did, that **the field is weak**
and that **the source moves and changes slowly**: we keep the first order in $v/c$, and the source changes over times
much longer than light takes to cross it. The observer is at rest in 7.4's harmonic gauge. Three of 7.4's results enter.
The first is

$$\field h_{0i} = -\frac{4G}{c^3}\field A_i ,\qquad \sym{flow-potential}{\field{\vect A}}(\vect x) =
\int\frac{\matter\rho\vect v(\vect y)}{|\vect x - \vect y|}\,\dd^3y .$$

Chapter 7.4 boxed it for $\field{\bar h}_{0i}$, which equals $\field h_{0i}$ because the trace reversal leaves entries
off the diagonal alone. Here $\matter\rho\vect v$ is the mass flux, in $\mathrm{kg\,m^{-2}\,s^{-1}}$, and $\field{\vect
A}$ is the **potential of the flow** of chapter
[2.8](/tutorial/outside/flows/#a-flow-has-a-potential-of-its-own-built-like-the-gravitational-one): the mass flux added
up over the source as the density is added up for the potential, in $\mathrm{kg\,s^{-1}}$. The others are
[7.4's](/tutorial/geometry/linearized-gravity/#a-static-source-gives-newtons-potential-in-time-and-in-space) $\field
h_{ij} = -2\field\Phi\delta_{ij}/c^2$, with $\field\Phi$ the potential in $\mathrm{J\,kg^{-1}}$, and its gauge condition
$\partial_t\field\Phi = G\,\nabla\cdot\field{\vect A}$, which is the conservation of mass.

**Step 1: the curvature with one time index.** Chapter
[7.2](/tutorial/geometry/curvature-and-tides/#to-first-order-the-curvature-is-made-of-second-derivatives-of-the-metric)'s
linearized curvature with $p, q, j, 0$ in the places of $\alpha, \beta, \gamma, \delta$ is

$$\begin{aligned}\curv R_{pqj0} &= \tfrac12\bigl(\partial_q\partial_j\field h_{p0} - \partial_p\partial_j\field h_{q0}\bigr)\\
&\quad + \tfrac12\bigl(\partial_p\partial_0\field h_{qj} - \partial_q\partial_0\field h_{pj}\bigr) .\end{aligned}$$

We multiply by $\tfrac12c^2\epsilon_{ipq}$ and sum. In each bracket the two terms differ only by the names $p$ and $q$,
and $\epsilon_{ipq}$ changes sign when they are exchanged, so each bracket gives twice one of its terms.

**Step 2: the flow.** The first bracket gives $-\tfrac12c^2\,\partial_j\,\epsilon_{ipq}\partial_p\field h_{q0}$. Here
$\epsilon_{ipq}\partial_p\field A_q$ is the $i$ component of the **curl** $\nabla\times\field{\vect A}$, 1.1's cross
product with the gradient $\nabla$ in the place of the first vector, which measures how the field swirls round each
point (chapter 2.8). With $\field h_{q0} = -4G\field A_q/c^3$ the bracket is

$$\frac{2G}{c}\,\partial_j\field b_i ,\qquad \sym{flow-curl}{\field{\vect b}} = \nabla\times\field{\vect A} ,$$

with $\field{\vect b}$ in $\mathrm{kg\,m^{-1}\,s^{-1}}$, 2.8's letter.

**Step 3: the changing potential.** The second bracket gives $\tfrac12c^2\epsilon_{ipq}\partial_p\partial_0\field
h_{qj}$. With $\field h_{qj} = -2\field\Phi\delta_{qj}/c^2$ and $\partial_0 = c^{-1}\partial_t$ it is
$(1/c)\epsilon_{ijk}\partial_k\partial_t\field\Phi$, and the gauge condition turns it into
$(G/c)\epsilon_{ijk}\partial_k(\nabla\cdot\field{\vect A})$. Adding the two steps,

$$\boxed{\;\curv\tB_{ij} = \frac Gc\Bigl[2\partial_j\field b_i + \epsilon_{ijk}\partial_k(\nabla\cdot\field{\vect A})\Bigr] .\;} \label{eq:flow-rule}$$

The units check: $G/c$ in $\mathrm{m^2\,kg^{-1}\,s^{-1}}$ times $\mathrm{kg\,s^{-1}\,m^{-2}}$ is $\mathrm{s^{-2}}$.

**The symmetric part** is $(G/c)(\partial_i\field b_j + \partial_j\field b_i)$, the rule that chapter 2.8 stated, now
derived. Outside matter it is all of $\curv\tB$, by the first section, whether the flow is steady or not (within 7.4's
approximation of a slowly changing source). The antisymmetric part, worked out with 2.8's identity
$\nabla\times(\nabla\times\field{\vect A}) = \nabla(\nabla\cdot\field{\vect A}) - \nabla^2\field{\vect A}$ and
$\nabla^2\field{\vect A} = -4\pi\matter\rho\vect v$, gives [](#eq:antisym) again.

**What it means.** The electric part is the second derivatives of the potential of the mass, and the magnetic part
those of the potential of its flow, which carries the speed $v$; with $G/c$ for $G$, it is smaller by about $v/c$.

## A moving mass makes a magnetic part only by moving across the line of sight

We want $\curv\tB$ for one moving mass, the paper's equation in [*The magnetic
picture*](/paper/#par:the-magnetic-picture). We assume **a mass $\matter M$ at the origin, moving slowly with velocity
$\vect v$**, and a pixel outside it at $\vect x$, a distance $r$ away. We write $\hat n = -\vect x/r$ for the unit
vector from the pixel toward the mass, the paper's sense in Section IV.

The flux sits at one point, so $\field{\vect A} = \matter M\vect v/r$, and its curl is $\field{\vect b} =
\nabla(1/r)\times\matter M\vect v = -\matter M\,\vect x\times\vect v/r^3$. Differentiating,

$$\partial_i\field b_j = -\matter M\Bigl[\frac{\epsilon_{jik}v_k}{r^3} - \frac{3x_i(\vect x\times\vect v)_j}{r^5}\Bigr] .$$

The first term is antisymmetric and drops from the symmetric part. With $\vect x = -r\hat n$, $x_i(\vect x\times\vect
v)_j = r^2\hat n_i(\hat n\times\vect v)_j$, so the symmetric part of [](#eq:flow-rule) is the paper's equation for one
moving mass:

{{paper eq:magnetic-point}}

**A check.** Outside the mass the antisymmetric part of $(2G/c)\partial_j\field b_i$ is $(G\matter
M/cr^3)\epsilon_{ijk}(v_k - 3\hat n_k\,\hat n\cdot\vect v)$. Since $\nabla\cdot\field{\vect A} = -\matter M\,\vect
v\cdot\vect x/r^3$, the term of [](#eq:flow-rule) in $\nabla\cdot\field{\vect A}$ is exactly minus this, so nothing
antisymmetric is left, as the first section requires in empty space. The trace, $2\hat n\cdot(\hat n\times\vect v)$, is
zero.

**Motion along the line of sight gives nothing**, because then $\hat n\times\vect v = 0$ (Figure
[](#fig:magnetic-crossing)). Only the sideways speed $v_\perp = |\hat n\times\vect v|$ counts: the magnetic channel is
"the opposite of a Doppler radar", which sees only motion along the line.

**Numbers.** Chapter [1.5](/tutorial/newton/five-numbers/#a-pixel-that-also-reads-the-twist-records-ten-numbers)
found from this equation that $|\curv\tB|/|\curv\tE| = \sqrt3\,v_\perp/c$ (Frobenius norms), now derived. For the
70 kg person walking across the line of sight 1 m away at $1.4\unit{m\,s^{-1}}$, $|\curv\tB| = 3\sqrt2\,G\matter
Mv/cr^3 = 9.3\times10^{-17}\unit{s^{-2}}$ and $|\curv\tE| = \sqrt6\,G\matter M/r^3 = 1.14\times10^{-8}\unit{s^{-2}}$, a
ratio of $8.1\times10^{-9}$.

**Grouping moving matter by direction.** The field is linear in the source, so a body's $\curv\tB$ is the paper's
equation summed over its pieces. We group them by direction, as chapter
[1.5](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes) did for the tide. The matter in a
small patch of sky of solid angle $\dd\Omega$ round $\hat n$, between the distances $r$ and $r + \dd r$ from the pixel,
has the mass $\matter\rho\,r^2\,\dd r\,\dd\Omega$, so it replaces $\matter M\vect v/r^3$ by $\matter\rho\vect
v\,r^2\,\dd r\,\dd\Omega/r^3 = \dd\Omega\,\matter\rho\vect v\,\dd r/r$. Adding along each line of sight, and then over
the directions, gives the paper's

{{paper eq:current-column}}

whose weight $3G/c$ is now derived. Its integral $\vect J(\hat n)$ is chapter 2.8's [current
column](/tutorial/outside/flows/#the-current-column-is-the-flow-along-a-line-of-sight-weighted-by-inverse-distance), the
mass flux along the line of sight, each part weighted by the inverse of its distance.

**The part that changes.** Near slow matter $|\curv\tB|/|\curv\tE|$ is about $v/c$, the near-field half of Section
VIII's [](/paper/#eq:magnetic-ratio). For the part of the field that changes we estimate the order of magnitude in the
**near zone**, at distances much smaller than $c/\omega$, where the field follows the source with no delay (7.4's
approximation). A mass $\matter M$ swinging across the line of sight with the amplitude $d$ at the angular frequency
$\omega$ has a speed $v \approx \omega d$. It changes the tide by $\delta\curv\tE \approx G\matter Md/r^4$ and makes
$\curv\tB \approx G\matter Mv/cr^3$, so

$$\frac{|\curv\tB|}{|\delta\curv\tE|} \approx \frac vc\,\frac rd = \frac{\omega r}{c} :$$

the paper's "about $kr$ at the frequency $\omega$ of the change", with $k = \omega/c$, "more than $v/c$, but still far
below one in the near zone". For the paper's person swaying by 5 cm once a second, 1 m away, $\omega r/c =
2.1\times10^{-8}$, twenty times $v/c$.

**Flows that change no density.** In chapter
[4.3](/tutorial/response/elastic-bodies/#a-guessed-shape-overestimates-the-lowest-note-and-a-good-guess-comes-close)'s
twist of a steel ball, the two hemispheres turn against each other. No density changes, so there is no Newtonian tide,
and the hemispheres' angular momenta cancel. The first pattern left in the flow is a **current quadrupole**, the moment
of degree two of the mass flux, and it shows in $\curv\tB$ alone, smaller than a tide by about $v/c$. So does any shear
motion of a solid, such as a shear wave.

![Look first at the gyroscopes. A mass moving across the line of sight makes neighbouring gyroscopes turn relative to
one another; the same mass moving straight at the pixel makes no magnetic part, though the stretch toward it is the
same. The deformation and the turning are exaggerated.](tut-magnetic-crossing){#fig:magnetic-crossing}

## A spinning round body is a spin dipole

We want $\curv\tB$ outside a spinning body. We assume **a round body whose spherical layers each turn rigidly**, with
total angular momentum $\vect L$ in $\mathrm{kg\,m^2\,s^{-1}}$ (chapter
[1.6](/tutorial/newton/motion/#a-turning-body-keeps-the-spread-of-its-mass-in-a-table-of-inertia)), and a pixel outside
it. Outside, chapter [2.8](/tutorial/outside/flows/#a-swirl-shows-through-its-angular-momentum-and-two-swirls-can-cancel)
found the potential of the flow, because each turning layer adds only a term of degree one, set by its angular momentum:

$$\field{\vect A} = \frac{\vect L\times\vect x}{2r^3} ,$$

with $\vect x$ from the body's centre to the pixel and $\hat x = \vect x/r$. In the metric this is $\field{\bar h}^{0i}
= -\field{\bar h}_{0i} = 2G(\vect L\times\vect x)_i/c^3r^3$, the spin term of the paper's [](/paper/#eq:multipole), as
7.4's paper problem found. The flow is steady and $\nabla\cdot\field{\vect A} = 0$, so only the symmetric part of
[](#eq:flow-rule) is left. Chapter 2.8 found the curl, $\field{\vect b} = [3\hat x(\vect L\cdot\hat x) -
\vect L]/2r^3$. We differentiate it with the product rule and $\partial_ir = x_i/r$:

$$\begin{aligned}\partial_i\field b_j = \frac{3}{2r^5}\Bigl[&\delta_{ij}(\vect L\cdot\vect x) + L_ix_j + x_iL_j\\
&- \frac{5x_ix_j(\vect L\cdot\vect x)}{r^2}\Bigr] .\end{aligned}$$

This is already symmetric, so $\curv\tB_{ij} = (2G/c)\partial_i\field b_j$, and with $\vect x = -r\hat n$, $\hat n$ from
the pixel toward the body,

$$\boxed{\;\begin{aligned}\curv\tB_{ij} = -\frac{3G}{c\,r^4}\Bigl[&L_i\hat n_j + \hat n_iL_j\\ &+ (\vect L\cdot\hat
n)(\delta_{ij} - 5\hat n_i\hat n_j)\Bigr] ,\end{aligned}\;} \label{eq:spin-dipole}$$

the paper's field of a **spin dipole** in *The magnetic picture* (Figure [](#fig:spin-dipole-sky)). Its unit is $G/c$
times $\mathrm{kg\,m^2\,s^{-1}}$ over $\mathrm{m^4}$, which is $\mathrm{s^{-2}}$. Its trace is $2\vect L\cdot\hat n +
(\vect L\cdot\hat n)(3 - 5) = 0$, as the first section requires outside matter.

**Checks.** The field depends on the body only through $\vect L$. A thin shell and a solid ball of equal mass and
radius, spun at the same rate, pull alike outside, but their moments of inertia, $\tfrac23\matter MR^2$ and
$\tfrac25\matter MR^2$, make their magnetic parts differ by $5/3$. A uniform ball of radius $2^{-1/5}R = 0.871R$ inside a
counter-turning shell of the same density has $\vect L = 0$ (chapter 2.8), and no magnetic part outside, "though all of
it moves". The Earth has $L = 0.3307\,\matter MR^2\Omega = 5.86\times10^{33}\unit{kg\,m^2\,s^{-1}}$.

![Look first at the right sphere. The magnetic part $\curv\tB_{nn}$ along the line to a spinning body has opposite signs
over its two hemispheres and vanishes on its equator, while the stretch $\curv\tE_{nn}$ of a point mass is the same in
every direction. The shading is schematic in strength.](tut-spin-dipole-sky){#fig:spin-dipole-sky}

## The Earth's magnetic part weighs its core

We want the magnetic part that a pixel at rest on the equator reads. The pixel moves with the ground through the
planet's static field, and the planet spins.

**Step 1: a moving pixel.** By chapter
[6.1](/tutorial/relativity/lorentz/#every-observer-measures-the-same-speed-of-light)'s principle of relativity, no
experiment in a laboratory moving steadily can tell how fast it moves. So a pixel moving with velocity $\obs{\vect u}$
past a mass at rest reads what a pixel at rest reads of the mass moving with $-\obs{\vect u}$:

$$\curv\tB_{ij} = -\frac{3G\matter M}{c\,r^3}\bigl[\hat n_i(\hat n\times\obs{\vect u})_j + \hat n_j(\hat
n\times\obs{\vect u})_i\bigr] .$$

We assume **first order in $u/c$**; the exact rule for a moving pixel is chapter 9.3's. The pixel's
acceleration does not enter, because a reading depends only on the pixel's velocity (chapter 7.2).

**Step 2: the ground.** We put $\vect L$ along $z$ and the pixel on the $x$ axis at the radius $R$. The ground moves at
$\obs{\vect u} = \Omega R\,\hat y$, with $\Omega R = 465\unit{m\,s^{-1}}$ (chapter
[1.1](/tutorial/newton/vectors-and-indices/#a-small-turn-is-a-cross-product-and-the-equator-moves-faster-than-sound)).
Toward the centre $\hat n = -\hat x$, so $\hat n\times\obs{\vect u} = -\Omega R\,\hat z$, and the motion gives
$\curv\tB_{xz} = \curv\tB_{zx} = -3G\matter M\Omega/cR^2$.

**Step 3: the spin.** In [](#eq:spin-dipole), $\vect L\cdot\hat n = 0$ on the equator and $L_z\hat n_x = -C\Omega$,
with $C$ the moment of inertia about the axis, in $\mathrm{kg\,m^2}$ (the paper's letter; chapter 1.6 writes $I$), so
the spin gives $\curv\tB_{xz} = \curv\tB_{zx} = +3GC\Omega/cR^4$. The two steps have opposite signs, and with every
other entry zero their sum is

$$\boxed{\;\curv\tB_{xz} = -\frac{3G\matter M\Omega}{cR^2}\Bigl(1 - \frac{C}{\matter MR^2}\Bigr) ,\;} \label{eq:earth}$$

Section II's formula: the 1 is the pixel's motion, and $C/\matter MR^2$ the planet's spin.

**Numbers.** With $G\matter M = 3.986\times10^{14}\unit{m^3\,s^{-2}}$, $\Omega = 7.292\times10^{-5}\unit{s^{-1}}$ and
the equatorial radius $6.378\times10^6\unit{m}$, the factor in front is $7.15\times10^{-12}\unit{s^{-2}}$. With the
Earth's $C/\matter MR^2 = 0.3307$ (chapter
[1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)) the reading is
$\curv\tB_{xz} = -4.79\times10^{-12}\unit{s^{-2}}$ (Figure [](#fig:earth-two-bars)), and the paper quotes its size, 4.8.
The sign gives the sense of the turning: by the first section's rule, of two gyroscopes one above the other the upper
one turns relative to the lower one clockwise as seen from above the north pole. The person walking past 1 m away at
$1.4\unit{m\,s^{-1}}$ gives $3G\matter Mv/cr^3 = 6.54\times10^{-17}\unit{s^{-2}}$ in the corresponding entry, 73,100
times less, the paper's "seventy thousand". A uniform Earth, 0.4, would read $4.29\times10^{-12}\unit{s^{-2}}$, and a
hollow shell, $\tfrac23$, $2.38\times10^{-12}\unit{s^{-2}}$.

**A limit.** No round body has $C/\matter MR^2$ above the shell's $\tfrac23$, so the spin never cancels the motion. At
the poles $\obs{\vect u} = 0$, and the pixel reads the spin dipole alone.

**What it means.** The mass, the rate and the radius are known, so one reading gives $C/\matter MR^2$, which the steady
pull hides (chapter 1.3): the Earth's core raises the reading by 12 per cent over a uniform Earth's.

![Look first at the third bar: the pixel's motion through the planet's field and the planet's own spin give opposite
magnetic parts, and their difference reads the moment of inertia. The outline is the spin's bar laid at the end of the
motion's. Ticks mark a uniform Earth and a hollow shell.](tut-earth-two-bars){#fig:earth-two-bars}

## A body turning at a known rate shows one hidden integral for each harmonic function

We want what $\curv\tB$ outside shows of a turning body of any shape. The paper's [*What breaks the
tie*](/paper/#par:what-breaks-the-tie) says that "the magnetic field of a body turning at a known rate holds $\int\rho\,
r^2 h\,\dd V$ for every harmonic $h$, of which the moment of inertia is the first, and for a round body the only one".
We write $g$ for the paper's harmonic $h$, because $h$ with indices is the metric perturbation.

**The general result, stated.** Outside a steady flow, $\field{\vect b}$ has no curl and no divergence, so it is the
gradient of a harmonic function. That function is fixed by the flow's **magnetic moments** $m[g] = \int(\vect
x\times\matter\rho\vect v)\cdot\nabla g\,\dd V$, one for each solid harmonic $g$ of chapter
[2.2](/tutorial/outside/spherical-harmonics/#each-pattern-of-one-degree-gives-two-harmonic-functions-the-solid-harmonics).
For a body turning rigidly at a known rate, each moment of degree $\ell$ is $(\ell + 1)/(2\ell + 1)$ times a new
integral $\int\matter\rho\,r^2g'\,\dd V$, with $g'$ harmonic of degree $\ell - 1$, plus mass moments that the electric
part already shows. We state this without proof here; chapter
[13.4](/tutorial/what-a-field-keeps/flows-inside/#at-a-known-rate-of-turning-the-field-outside-holds-the-first-rung-of-the-ladder)
derives it.

**The check $\ell = 1$.** We assume that **the body turns rigidly**, $\matter\rho\vect v =
\matter\rho\,\vect\Omega\times\vect x$, at a known $\vect\Omega$. For $g = x_k$ the moment is $\int(\vect
x\times\matter\rho\vect v)_k\,\dd V = L_k$. By 1.1's rule for a double cross product, $\vect
x\times(\vect\Omega\times\vect x) = \vect\Omega r^2 - \vect x(\vect\Omega\cdot\vect x)$, so

$$\begin{aligned}L_k &= \tfrac23\,\Omega_k\int\matter\rho\,r^2\,\dd V\\
&\quad - \Omega_m\int\matter\rho\,\bigl(x_kx_m - \tfrac13r^2\delta_{km}\bigr)\,\dd V .\end{aligned}$$

The first term carries the new integral with the factor $(\ell + 1)/(2\ell + 1) = \tfrac23$. The second is a mass moment
of a harmonic, which the electric part outside already fixes (chapter
[2.5](/tutorial/outside/null-space/#every-density-splits-into-a-harmonic-part-and-a-part-the-outside-cannot-see)). This
is chapter [1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)'s split of the
moment of inertia. For a round body every integral of $\matter\rho(r)$ times a harmonic of degree one or more vanishes,
by 2.2's orthogonality, so only $\ell = 1$ is left, and that is $\vect L$.

## Neighbouring gyroscopes turn relative to one another at the magnetic part times their separation

We want to derive the first section's rule, the paper's "twists the axes of nearby gyroscopes relative to one another".
We state that in a **steady weak field** a gyroscope held **at rest** turns relative to the distant stars with the
angular velocity

$$\sym{gyroscope-precession}{\vect\Omega_{\rm g}} = -\frac c2\,\nabla\times\vect h_0 = \frac{2G}{c^2}\,\field{\vect b} ,$$

where $\vect h_0 = (\field h_{01}, \field h_{02}, \field h_{03})$; the second form uses 7.4's $\field h_{0i} =
-4G\field A_i/c^3$. The units: $G/c^2$ in $\mathrm{m\,kg^{-1}}$ times $\mathrm{kg\,m^{-1}\,s^{-1}}$ is
$\mathrm{s^{-1}}$.

::: gap
A gyroscope's axis is carried along its path in spacetime by **Fermi–Walker transport**: kept at right angles to the
four-velocity and otherwise carried without turning, as chapter 7.2 carried an arrow. With 7.1's Christoffel symbols in
7.4's metric, this rule gives $\vect\Omega_{\rm g}$ for a gyroscope at rest; this box does not work it out. A moving
gyroscope also turns by its motion through $\field\Phi$.
:::

**A spinning body.** With the [spin dipole](#a-spinning-round-body-is-a-spin-dipole)'s $\field{\vect b}$,
$\vect\Omega_{\rm g} = (G/c^2r^3)[3(\vect L\cdot\hat x)\hat x - \vect L]$, the **Lense–Thirring precession** (J. Lense
and H. Thirring, 1918). Over a pole it is $2GL/c^2r^3$ along $\vect L$, so the body drags the gyroscope round with it;
over the equator it is half as large and opposite. This turning of gyroscopes by moving mass is called **frame
dragging**.

**Two gyroscopes.** A second gyroscope a small vector $\vect\xi$ away turns faster by $\delta\Omega_i =
\xi_j\partial_j\Omega_{{\rm g},i} = (2G/c^2)\xi_j\partial_j\field b_i$. Outside a steady flow $\field{\vect b}$ has no
curl (the last section), so $\partial_j\field b_i$ is symmetric and [](#eq:flow-rule) is $\curv\tB_{ij} =
(2G/c)\partial_j\field b_i$. Therefore

$$\boxed{\;\delta\Omega_i = \frac1c\,\curv\tB_{ij}\,\xi_j .\;} \label{eq:gyro-pair}$$

The units: $\mathrm{s^{-2}}$ times $\mathrm{m}$ over $\mathrm{m\,s^{-1}}$ is $\mathrm{s^{-1}}$. We derived it for
gyroscopes at rest in a static frame. D. A. Nichols and colleagues show that it holds, with the pixel's own $\curv\tB$,
for gyroscopes held at rest in the non-rotating frame of any pixel, the moving pixel included [@Nichols2011] (stated).
That is Section II's assumption. Gyroscopes fixed to the turning ground differ: they move relative to one another at
$\Omega\xi$ while held up with the acceleration $a = 9.8\unit{m\,s^{-2}}$, which adds terms of order $a\Omega\xi/c^2
\approx 8\times10^{-21}\unit{rad\,s^{-1}}$ for 1 m, half the magnetic part's.

**Gravity Probe B** (stated). This satellite carried gyroscopes in a polar orbit 642 km up, aimed at the star IM Pegasi.
Frame dragging was predicted to turn them by 39 milliarcseconds a year (a milliarcsecond is $1/3{,}600{,}000$ of a
degree), and C. W. F. Everitt and colleagues measured $37 \pm 7$ (2011). The **geodetic precession**, the turning of a
gyroscope carried through the static field of a mass, was predicted at 6606 and measured at $6602 \pm 18$.

## The name comes from electromagnetism, which guides but does not prove

The electric part comes from the potential of the mass as an electric field comes from the potential of charge, and the
magnetic part from the curl of the potential of the flow as a magnetic field comes from the curl of the vector potential
of a current. This kinship is called **gravitomagnetism**. The factors differ: $\field h_{0i}$ carries a 4, and parallel
flows of mass repel where parallel currents attract. So the analogy guides and does not prove. For readers of chapter
[6.6](/tutorial/relativity/maxwell-complex/#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle),
$\curv{\mathcal W} = \curv\tE + i\curv\tB$ is gravity's counterpart of $\mathbf E + ic\mathbf B$, which chapter 9.3
makes exact.

::: try {#magnetic-tide}
Three scenes in tabs. In the first, a pixel, drawn as a ring of free balls with two gyroscopes 1 m apart on the line
beside it, watches a 70 kg mass 1 m away whose velocity arrow you can drag. In the second, a ball or a thin shell of
1000 kg spins beside the pixel, or a ball spins inside a shell turning the other way, with a slider for the inner
radius. In the third, a slider sets $C/MR^2$ for a pixel on the Earth's equator, and the two bars of Figure
[](#fig:earth-two-bars) follow it. The readouts give $|\curv\tB|$, $|\curv\tE|$, their ratio beside $\sqrt3\,v_\perp/c$,
the spin $L$, and the equator's $\curv\tB_{xz}$. Every exaggeration is printed on the drawing.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, find
the inner radius at which the ball and the counter-turning shell together give no magnetic part, and say why the
stretch of the ring is still there.
:::

::: check
### Q

Why is $\curv\tB$ trace-free even inside matter, while $\curv\tE$ is not?

### A

The cyclic identity makes the trace of $\curv\tB$ zero for every Riemann tensor. The trace of $\curv\tE$ is $c^2\curv
R_{00}$, which Einstein's equation sets to $4\pi G\matter\rho$ inside matter.

### Q

What does a pixel on the equator read in $\curv\tB$, and what would it read on a uniform Earth?

### A

A $\curv\tB_{xz}$ of size $4.79\times10^{-12}\unit{s^{-2}}$ (the entry is negative in the chapter's axes), and
$4.29\times10^{-12}\unit{s^{-2}}$ on a uniform Earth: $7.15\times10^{-12}\unit{s^{-2}}$ times $1 - 0.3307$ and $1 -
0.4$.

### Q

By how much does a gyroscope on the equator turn each second relative to one a metre above it, both held in the pixel's
non-rotating frame?

### A

$|\curv\tB_{xz}|/c = 1.6\times10^{-20}$ radians.
:::

**The idea to keep: the magnetic part of the tide is the curvature with one time index, packed by $\epsilon$ into a
table that is always trace-free and, in empty space, symmetric. Moving matter makes it through the potential of its
flow, so it is smaller than the tide by about $v/c$, sees only motion across the line of sight, and turns neighbouring
gyroscopes relative to one another. For the Earth it reads the moment of inertia, and so the core.**

::: problems
### Practice

The 70 kg person of chapter 7.4 walks at $1.4\unit{m\,s^{-1}}$ along a straight line that passes 1 m from a pixel. When
the person is 2 m past the closest point, find $|\curv\tB|$, the ratio $|\curv\tB|/|\curv\tE|$, and the fastest relative
turning of two gyroscopes 1 m apart.

::: solution
Here $r = \sqrt5\unit{m} = 2.24\unit{m}$, and the path meets the line of sight at an angle whose sine is $1/\sqrt5$, so
$v_\perp = 0.626\unit{m\,s^{-1}}$. Then $|\curv\tB| = 3\sqrt2\,G\matter Mv_\perp/cr^3 =
3.70\times10^{-18}\unit{s^{-2}}$, 25 times less than at the closest point, and the ratio is $\sqrt3\,v_\perp/c =
3.6\times10^{-9}$. The table $\hat n_iw_j + w_i\hat n_j$, with $\vect w = \hat n\times\vect v$ at right angles to $\hat
n$, has the eigenvalues $\pm v_\perp$ and 0, so by [](#eq:gyro-pair) the fastest relative turning is $3G\matter
Mv_\perp\xi/c^2r^3 = 8.7\times10^{-27}\unit{rad\,s^{-1}}$.
:::

### Stretch

Combine this chapter with chapters 1.1 and 1.6. Mars has $G\matter M = 4.283\times10^{13}\unit{m^3\,s^{-2}}$, an
equatorial radius of 3396 km, a sidereal day of 24.62 hours and $C/\matter MR^2 = 0.364$. Find the speed of its equator
and the size of the reading there, for Mars and for a uniform Mars. Which planet gathers more of its mass toward its
centre, Mars or the Earth?

::: solution
Here $\Omega = 2\pi/(24.62 \times 3600\unit{s}) = 7.09\times10^{-5}\unit{s^{-1}}$, so the equator moves at $\Omega R =
241\unit{m\,s^{-1}}$. The factor in front of [](#eq:earth) is $2.63\times10^{-12}\unit{s^{-2}}$, so the reading is
$2.63\times10^{-12} \times 0.636 = 1.67\times10^{-12}\unit{s^{-2}}$, against $1.58\times10^{-12}\unit{s^{-2}}$ for a
uniform Mars. The Earth's 0.331 is the smaller, so the Earth gathers more mass toward its centre: its core raises the
reading by 12 per cent, Mars's by 6 per cent.
:::

### The paper

Check Section VIII's estimate of the changing part, beside the paper's [](/paper/#eq:magnetic-ratio). A point mass
$\matter M$ sways across the line of sight, at $d\sin\omega t$ along $\hat y$, and the pixel is a distance $r \gg d$
away along $\hat x$. Show that the amplitudes of $|\curv\tB|$ and $|\delta\curv\tE|$ have the ratio $\omega r/c$, the
paper's $kr$.

::: solution
With the mass at the origin, the tide at $\vect x$ is $G\matter M(\delta_{ij}r^2 - 3x_ix_j)/r^5$ (chapter
[1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)), and moving the
mass by $d\hat y$ changes it by $-d\,\partial_y$ of this. At $\vect x = r\hat x$ only the derivative of $x_ix_j$
survives: $\delta\curv\tE_{xy} = \delta\curv\tE_{yx} = 3G\matter Md/r^4$, so $|\delta\curv\tE| = 3\sqrt2\,G\matter
Md/r^4$. The velocity, of amplitude $\omega d$, lies across the line of sight, so $|\curv\tB|$ reaches
$3\sqrt2\,G\matter M\omega d/cr^3$, and the ratio is $\omega r/c = kr$: $2.1\times10^{-8}$ for the paper's person.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel): the paper's [](/paper/#eq:magnetic), its symmetry and trace, its antisymmetric part
  inside matter, the gyroscopes, and the Earth's reading [](#eq:earth).
- [Section IV](/paper/#sec:near-field): the paper's [](/paper/#eq:magnetic-point) and [](/paper/#eq:current-column),
  the spin dipole [](#eq:spin-dipole), and *What breaks the tie*, its case $\ell = 1$.
- [Section VIII](/paper/#sec:one-pixel): the near-field half of the paper's [](/paper/#eq:magnetic-ratio), and the
  antisymmetric part made by light.
- [Section XI](/paper/#sec:vistas): the spin term of the paper's [](/paper/#eq:multipole), and shear waves that "appear
  in $\tB$".
:::

::: deeper
- The GR course treats gyroscopes and frame dragging in
  [section 16.9](https://neovand.github.io/general-relativity/chapter-16.html#16-9-gyroscopes-and-a-compact-experimental-map)
  and shows in [appendix A.28](https://neovand.github.io/general-relativity/appendix-a.html#a-28-a-pure-frame-rotation-is-not-curvature)
  why a turning frame is not curvature.
- D. A. Nichols and colleagues [@Nichols2011] draw $\curv\tB$ as the relative turning of gyroscopes.
- C. W. F. Everitt and colleagues, *Physical Review Letters* 106, 221101 (2011), report Gravity Probe B's measurements.
- J. D. Jackson, *Classical Electrodynamics* (3rd ed., Wiley, 1999), §5.6 and §9.7, gives the vector potential of a
  current loop and the magnetic multipoles, the electromagnetic home of the spin dipole.
:::
