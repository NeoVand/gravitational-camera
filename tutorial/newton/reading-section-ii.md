---
id: R1
title: "What the camera sees: one pixel in Newton's gravity"
question: 'What would one pixel of the camera record beside a person, a lorry and the Earth, and how small a tide could it read?'
part: '1'
requires: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6']
paper: [sec:pixel, eq:tidal, eq:deviation, eq:newton, eq:wave, eq:magnetic, fig:tidal, fig:tidal-field, eq:magnetic-point, eq:W]
figures: [fig:tidal, fig:tidal-field]
live: [tidal-ring, turning-pixel]
---

A pixel of the gravitational camera is a small instrument, falling freely or held still on the ground, that reads the
tide at its place: the table of section 1.4, with the five numbers of section 1.5, in the frame of section 1.6. What
would one pixel record beside a person, a lorry and the Earth, and how small a tide could it read?[^pixel]

::: plain
A pixel of the camera reads the tide, the difference in gravity between nearby points. Nothing screens gravity, so a
person behind a wall raises the same tide at the pixel as a person in the open. A metre away, the person makes two
free balls a metre apart accelerate away from each other by about a billionth of the acceleration of a falling
apple.

That is small, but it can be measured. The best gradiometer in a laboratory reads it about five hundred times above
its noise in one second, and quantum mechanics would allow a reading a hundred thousand times finer. LIGO would see the
same person swaying as a signal far larger than the waves it was built to detect.

On the ground the Earth's own tide is three hundred times the person's, but it is steady, so it can be subtracted. A
small part of it that comes from the Earth's spin tells whether the Earth has a heavy core.
:::

## The person's tide reaches the pixel through a wall {#the-summary-in-plain-words-holds-number-by-number}

A person of mass $\sym{mass}{\matter M} = 70\unit{kg}$ whose centre of mass is $r = 1\unit{m}$ from the pixel
stretches it along the line between them by

$$\begin{aligned}\frac{2G\matter M}{r^3} &= \frac{2 \times 6.674 \times 10^{-11} \times 70}{1^3}\unit{s^{-2}}\\ &= 9.34 \times 10^{-9}\unit{s^{-2}},\end{aligned}$$

where $G = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is Newton's constant. The person squeezes the pixel
across the line by half as much
([section 1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)). In
eötvös, $1\unit{E} = 10^{-9}\unit{s^{-2}}$, the stretch is 9.34 E. Free balls on that line accelerate apart at
$9.5 \times 10^{-10}$ of the $9.81\unit{m\,s^{-2}}$ of a falling apple for each metre between them, about a
billionth. A lorry of 20 tonnes at 10 m gives $2.7 \times 10^{-9}\unit{s^{-2}}$, about a third as much.

Nothing screens gravity. A wall between the person and the pixel leaves the person's tide unchanged and adds a tide of
its own, which is small if the wall is wide and even: outside a uniform slab that extends far in both directions,
Gauss's law makes the field the same at every point, $2\pi G\sym{surface-density}{\matter\sigma}$ toward the slab,
where $\matter\sigma$ is the slab's mass per unit area in kilograms per square metre
([section 1.3](/tutorial/newton/gauss-and-poisson/)), and a uniform field has no tide (section 1.4). Only the wall's
edges, openings and unevenness raise a tide at the pixel, and they belong to the scene that the camera images.

A detector that reads one number of the tide cannot tell what made it. LIGO reads the combination
$\sym{tidal-tensor}{\curv{\tE}}_{xx} - \curv{\tE}_{yy}$ of the tidal tensor, integrated twice in time, one combination
of its five numbers
([section 1.5](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length)).
So a lorry driving past and a distant collision of black holes can give it the same signal.

{{paper fig:tidal-field}}

In this figure the colour maps one entry only: in panels (a) and (b) the entry up the page, $\curv{\tE}_{zz}$, orange
where it is a stretch and blue where it is a squeeze. So in panel (a) every ring is stretched toward the mass, yet the
map is blue to the left and right of the mass, where the stretch lies across the page. With $\vartheta$ the angle
between the vertical and the line to the mass, $\curv{\tE}_{zz}$ is proportional to $1 - 3\cos^2\vartheta$, so orange
meets blue at $\vartheta = 54.7°$
([section 1.5](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes)). In panel (b), midway
between two equal masses, the pulls cancel but the stretches add, because $\delta_{ij} - 3\hat n_i\hat n_j$ does not
change when $\hat n$ turns round: two people of 70 kg a metre on either side stretch the pixel by
$1.87 \times 10^{-8}\unit{s^{-2}}$. Panel (c) is a plane wave, coloured by the entry across the page.

## An ideal pixel reads ten numbers, and must not turn

A pixel records the whole tidal tensor at its place. In empty space the tensor is symmetric and trace-free, so it holds
five independent numbers
([section 1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left)). Moving
masses add a second table, the **magnetic part** of the tide, $\sym{magnetic-tide}{\curv{\tB}}_{ij}$, also in
$\mathrm{s^{-2}}$. It turns the axes of neighbouring **gyroscopes** relative to one another, a gyroscope being a
fast wheel whose axis keeps its direction
([section 1.6](/tutorial/newton/motion/#angular-momentum-stays-fixed-when-the-force-points-at-a-centre)). In empty space it too is symmetric and trace-free, so an ideal pixel records ten numbers.[^magnetic] Near
slowly moving matter it is smaller than $\curv{\tE}$ by about the speed of the matter over the speed of light; in a
gravitational wave the two are equal in size, and $\curv{\tB}$ is $\curv{\tE}$ turned by 45° about the direction of
travel (section 7.6).[^turned] The two combine into one complex table, $\curv{\mathcal W} = \curv{\tE} + i\curv{\tB}$
(section 9.3).[^W]

Inside matter the pixel would read more. The trace of $\curv{\tE}$ is $4\pi G\sym{density}{\matter\rho}$, where
$\matter\rho$ is the density of mass at the pixel in kilograms per cubic metre
([section 1.4](/tutorial/newton/tides/#in-empty-space-the-stretch-and-the-squeezes-balance)). In water it is
$4\pi \times 6.674 \times 10^{-11} \times 1000 = 8.4 \times 10^{-7}\unit{s^{-2}}$, ninety times the person's stretch,
and at the Earth's mean density of $5513\unit{kg\,m^{-3}}$ it is $4.6 \times 10^{-6}\unit{s^{-2}}$. Flowing matter
adds to $\curv{\tB}$ an antisymmetric part,

$$\curv{\tB}_{[ij]} = -\frac{4\pi G}{c}\,\epsilon_{ijk}\,\matter\rho v_k ,$$

where $\vect v$ is the velocity of the matter, in metres per second, and $c$ the speed of light (section 7.5 derives
it). An antisymmetric table is a vector in disguise, and this one is $-(4\pi G/c)\matter\rho\,\vect v$: it lies along
the flow and points upstream
([section 1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise)). For water
flowing at $1\unit{m\,s^{-1}}$ its size is $2.8 \times 10^{-15}\unit{s^{-2}}$. Both pieces vanish where there is no
matter, whatever lies nearby, so a pixel in empty space never sees them. In relativity they are the **Ricci part** of
the curvature, the part that Einstein's equation ties to the matter at the point itself
([section 7.3](/tutorial/geometry/einstein-equation/)).

The pixel must also not turn. A frame turning at the angular velocity $\sym{angular-velocity}{\obs\Omega}$, in radians
per second, feels a **pseudo-tide**, an apparent stretch of size $\obs\Omega^2$ across the axis
([section 1.6](/tutorial/newton/motion/#a-turning-pixel-feels-a-pseudo-tide)). The Earth turns once in 86,164 s, so

$$\begin{aligned}\obs\Omega^2 &= \Bigl(\frac{2\pi}{86{,}164\unit{s}}\Bigr)^2 = (7.29 \times 10^{-5}\unit{s^{-1}})^2\\ &= 5.3 \times 10^{-9}\unit{s^{-2}},\end{aligned}$$

which is 31,000 times the Moon's tide at the Earth, $1.73 \times 10^{-13}\unit{s^{-2}}$ (section 1.4), and 0.57 of the
person's stretch. It is steady, so a pixel that knew its rate of turning to two parts in a thousand could subtract it,
leaving an error in $\obs\Omega^2$ of four parts in a thousand, $2 \times 10^{-11}\unit{s^{-2}}$, the noise of the best
gradiometer below. Turning is measured by gyroscopes, so the pixel needs them in either case, to measure its turning
or to hold its axes still; the camera's pixels do the second
([section 1.6](/tutorial/newton/motion/#the-pixel-reads-the-tide-in-axes-that-gyroscopes-hold-still)).

::: try {#turning-pixel}
Predict first: if the pixel turned at half the Earth's rate, would its pseudo-tide be half as large, or smaller still?
The figure is already playing; watch the ring seen from the side widen across the axis. Press "The Earth's rate" and
read the stretch across the axis, $-5.32 \times 10^{-9}\unit{s^{-2}}$. Then drag the turning rate to halfway and read
it again. Last, switch on "The person's tide beside it" and compare the two traces: the pseudo-tide's is
$-2\obs\Omega^2$, which no mass in empty space can give, and the person's is zero.
:::

## In relativity the tide is a piece of the curvature of spacetime {#equations-1-and-2-define-the-tide-and-say-what-it-does}

In Einstein's theory gravity is a **curvature of spacetime**: space and time together are bent, so that free bodies,
each moving as straight as it can, drift together or apart. The tide is defined for an observer at rest relative to
the masses, with $t$ the observer's **proper time**, the time on its clock
([section 7.1](/tutorial/geometry/metric/#a-clocks-own-time-is-set-by-the-metric)), and with axes at right angles,
$x^0 = ct$ and $x^i$, measured by its own rulers and clock:

$$\curv{\tE}_{ij} = c^2 R_{0i0j} .$$

Here $R_{0i0j}$ are components of the **Riemann tensor**, the table that measures the curvature, in $\mathrm{m^{-2}}$.
The units check, because $c^2$ in $\mathrm{m^2\,s^{-2}}$ times $\mathrm{m^{-2}}$ is $\mathrm{s^{-2}}$. The sign
depends on two conventions: the signature $-{+}{+}{+}$, which says that time enters Einstein's measure of the
separation between two events with the opposite sign to the three directions of space (section 6.2), and the sign of
$R$.[^riemann] The table is symmetric because of a symmetry of the Riemann tensor, free balls whose separation is
$\sym{separation}{\xi}^i$, in metres, still move by $\ddot\xi^i = -\curv{\tE}_{ij}\xi^j$, and near slowly moving matter the table becomes the Hessian
$\partial_i\partial_j\sym{potential}{\field\Phi}$ of section 1.4
([section 7.2](/tutorial/geometry/curvature-and-tides/) derives all three).[^equations]

## In a wave the tide is minus half the acceleration of the strain {#near-slow-matter-the-tide-is-the-hessian-and-in-a-wave-it-is-the-strains-acceleration}

Far from its source, a gravitational wave is described by its strain $h^{\rm TT}_{ij}$, a table of pure numbers
written in a particular choice of coordinates, the transverse traceless gauge. Its tide is minus half the second time
derivative of the strain,

$$\curv{\tE}_{ij} = -\tfrac12\,\partial_t^2 h^{\rm TT}_{ij} ,$$

which [section 7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)
derives. The units check, because a pure number differentiated twice by seconds is in $\mathrm{s^{-2}}$.

The factor $\tfrac12$ fixes what the strain $h$ of a wave means. Take a wave whose stretch and squeeze lie along two
arms of length $L$, on the $x$ and $y$ axes, so that $h^{\rm TT}_{xx} = h$ and $h^{\rm TT}_{yy} = -h$. We put the
wave's tide into the motion of free balls, $\ddot\xi_i = -\curv{\tE}_{ij}\xi_j$: the arm along $x$ obeys
$\ddot\xi_x = \tfrac12\ddot h\,\xi_x$. The strain is tiny, so $\xi_x$ stays close to $L$ on the right, and integrating
twice in time gives

$$\delta\xi_x = \tfrac12 hL, \qquad \delta\xi_y = -\tfrac12 hL.$$

So one arm changes by $h/2$ of its length and the other by $-h/2$, and their difference divided by $L$ is $h$. For a
wave lined up with the arms, LIGO's strain and $h$ are the same number. The component that LIGO reads,
$\curv{\tE}_{xx} - \curv{\tE}_{yy}$, is $\sqrt2$ times the coefficient of $\curv{\tE}$ along the basis table $b^4$ of
section 1.5.[^wave]

{{paper fig:tidal}}

In this figure each arrow is the displacement of one ball. Panel (a) is the ring beside a mass. Panels (b) and (c) are
the two **polarizations** of a gravitational wave, its two basic patterns of stretch and squeeze; the wave travels out
of the page (⊙), and the pale ring is the ring half a cycle later. The two patterns differ by a turn of 45°, as any
two such patterns across a direction do
([section 1.5](/tutorial/newton/five-numbers/#across-a-wave-two-numbers-are-left-and-a-turn-of-45-swaps-them)).

## The swaying person gives four strains, all far above LIGO's waves

Let the person sway by 5 cm toward the pixel and away, once a second. The stretch goes as $r^{-3}$, so its relative
change is three times the relative change of the distance, $3 \times 0.05 = 0.15$, and

$$\delta\curv{\tE} = 0.15 \times 9.34 \times 10^{-9}\unit{s^{-2}} = 1.40 \times 10^{-9}\unit{s^{-2}}.$$

The exact change is $1.27 \times 10^{-9}\unit{s^{-2}}$ for a step back and $1.55 \times 10^{-9}\unit{s^{-2}}$ for a
step forward, 13.6 and 16.6 per cent, because $r^{-3}$ is not a straight line.

::: try {#tidal-ring}
Predict first: when the person steps back from 1 m to 1.05 m, the pull falls by about 10 per cent. Does the stretch fall
by less, by the same or by more? Then answer the figure's own two predictions, and read the stretch at 1 m on the way:
$9.34\unit{E}$. Last, switch back to one mass, bring it to 1.00 m and move it out to 1.05 m (each press of an arrow key
moves it 5 cm). The stretch falls to $8.07\unit{E}$, by 13.6 per cent, more than the pull, because the tide goes as the
cube of the distance.
:::

On a detector built like LIGO but with arms a few centimetres long, close to one pixel, a free arm of length $L$ along
the line to the person changes by $\delta L/L = \delta\curv{\tE}/\omega^2$
([section 1.4](/tutorial/newton/tides/#a-swaying-person-makes-the-signal-that-ligo-must-keep-out)), where
$\omega = 2\pi\unit{s^{-1}}$ is the angular frequency of the sway and $\omega^2 = 39.5\unit{s^{-2}}$. The signal can
be counted in four ways:

- *One arm*, along the line to the person, changes by $1.40 \times 10^{-9}/39.5 = 3.55 \times 10^{-11}$ of its length.
- *The difference of two arms divided by the length of an arm* is larger by $\tfrac32$, because the arm across the line
  changes by half as much in the opposite sense: $5.3 \times 10^{-11}$.
- *As a wave's strain $h$*, in which each arm changes by $h/2$ (the last section), it is twice the one-arm strain,
  $h = 2\,\delta\curv{\tE}/\omega^2 = 7.1 \times 10^{-11}$.
- *The real LIGO*, with arms 4 km long, is not a small detector. A person 1 m beyond one end mirror pulls on that
  mirror alone, with $G\matter M/r^2 = 4.67 \times 10^{-9}\unit{m\,s^{-2}}$. The sway changes this pull, which goes
  as $r^{-2}$, by $2\,\delta r/r = 10$ per cent, and a mirror free at the sway's frequency swings by
  $4.67 \times 10^{-10}/39.5\unit{m} = 1.18 \times 10^{-11}\unit{m}$, a hundred-millionth of a millimetre.[^free] Over the 4000 m arm this is a strain of $2.96 \times 10^{-15}$.

The gravitational waves that LIGO detects have strains near $10^{-21}$, which make its arms differ by
$10^{-21} \times 4000\unit{m} = 4.0 \times 10^{-18}\unit{m}$, a 420th of the width of a proton
($1.68 \times 10^{-15}\unit{m}$, twice its measured charge radius). In the same order, the four strains of the sway
are $3.55 \times 10^{10}$, $5.3 \times 10^{10}$, $7.1 \times 10^{10}$ and $3.0 \times 10^{6}$ times $10^{-21}$. This is
why people and vehicles are kept away from LIGO's mirrors [@ThorneWinstein1999], and the signal that the observatory
removes as contamination is the one that a camera close to the person records.[^sway]

## Today's instruments read the person, and quantum mechanics allows far finer readings {#what-the-premise-asks-existing-instruments-nearly-supply}

A **gravity gradiometer** is any instrument that measures the tide, the gradient of gravity.[^premise] A pixel that
reads the whole tide is an old idea: a **gravitational compass** of free masses read against one another
[@Pirani1956; @Szekeres1965], a ball of metal whose five ways of ringing in its lowest tone read the five numbers of
$\curv{\tE}$ [@Forward1971; @WagonerPaik1977; @MerkowitzJohnson1995], and a detector designed to read all of
$\curv{\tE}$ [@Paik2016].

Instruments of today come close to reading the person. An atom gradiometer carried over a buried tunnel reached 20 E
in ten minutes [@Stray2022], and a superconducting one in the laboratory reaches $0.02\unit{E\,Hz^{-1/2}}$
[@MoodyPaikCanavan2002], which is a noise of $0.02\unit{E}$ for one second of averaging
([section 3.2](/tutorial/noise/random-signals/#the-variance-of-white-noise-falls-as-one-over-the-observing-time)).
**Noise** is the random change in a reading present even when there is nothing to measure, and the
**signal-to-noise ratio** is the size of a signal over the typical size of the noise: on the person's 9.34 E it is
$9.34/0.02 = 467$ in one second.[^sqrt] A satellite has carried a gradiometer as sensitive around the Earth
[@RummelYiStummer2011]
([section 0.2](/tutorial/evening/through-walls/#the-blur-shrinks-only-with-the-number-of-digits-of-the-sensitivity)
reads its map).

Smaller instruments are being made cheap enough to serve as the pixels of an imager. A **gravimeter** measures the pull itself rather
than its difference, and gravimeters a few cubic centimetres in size, etched from silicon, have recorded the Earth's
tides [@Middlemiss2016; @Prasad2021]; a patent calls an array of such sensors a gravity camera [@JordanHowell2021].
The first of them reached a noise of 40 μGal in one second, where $1\unit{\mu Gal} = 10^{-8}\unit{m\,s^{-2}}$. Two of
them a metre apart read the person's tide as the difference of their pulls, $9.34 \times 10^{-9}\unit{m\,s^{-2}}$,
against the noise of a difference, $\sqrt2 \times 4 \times 10^{-7} = 5.7 \times 10^{-7}\unit{m\,s^{-2}}$ in one
second. The signal-to-noise ratio is then 0.016, and since it grows as the square root of the time, the pair needs
$(5.7 \times 10^{-7}/9.34 \times 10^{-9})^2\unit{s} = 3700\unit{s}$, about an hour, to read the person once above its
noise.

Quantum mechanics sets a finer limit. Watching a mass disturbs it, so a free mass $m$, in kilograms, watched for a
time $\tau$, in seconds, with the watching as the only disturbance, cannot be followed better than the **standard
quantum limit**

$$\begin{aligned}\Delta x = \sqrt{\frac{\hbar\tau}{m}} &= \sqrt{\frac{1.055 \times 10^{-34} \times 1}{10^{-3}}}\unit{m}\\ &= 3.25 \times 10^{-16}\unit{m},\end{aligned}$$

here for a gram watched for a second, with $\sym{hbar}{\hbar}$ the reduced Planck constant, in joule seconds
([section 8.6](/tutorial/quantum/quantum-limit/#a-free-mass-watched-for-a-time-cannot-be-followed-better-than-the-standard-quantum-limit)
derives it). For two such masses a centimetre apart, the separation is uncertain by $\sqrt2$ times as much,
$4.59 \times 10^{-16}\unit{m}$, as for one mass of half a gram (the pair's reduced mass). A tide moves two masses a
distance $\xi$ apart, starting at rest, by $\tfrac12\curv{\tE}\xi\tau^2$ in the time $\tau$, so the smallest tide that
moves them by the uncertainty of their separation is about

$$\begin{aligned}\curv{\tE} \approx \frac{2\sqrt2\,\Delta x}{\xi\tau^2} &= \frac{2 \times 4.59 \times 10^{-16}}{0.01 \times 1^2}\unit{s^{-2}}\\ &= 9.2 \times 10^{-14}\unit{s^{-2}},\end{aligned}$$

which is 102,000 times less than the person's tide
([section 8.6](/tutorial/quantum/quantum-limit/#two-gram-masses-read-for-a-second-resolve-a-tide-a-hundred-thousand-times-smaller-than-the-persons)
works out the factor $\sqrt2$). The estimate is good to an order of magnitude.

The magnetic part asks more. It can be read by gyroscopes [@Nichols2011], by a gradiometer in motion
[@BraginskyCavesThorne1977; @MashhoonPaikWill1989], by light sent both ways round a loop [@Frauendiener2020], and
through an interferometer's response at first order in its arm length over the wavelength
[@BaskaranGrishchuk2004]. A mass $\matter M$ in the direction $\hat n$ from the pixel, at the distance $r$, moving
with the velocity $\vect v$, gives to first order in $v/c$

$$\curv{\tB}_{ij} = \frac{3G\matter M}{c\,r^3}\bigl[\hat n_i(\hat n\times\vect v)_j + \hat n_j(\hat n\times\vect v)_i\bigr] ,$$

which section 7.5 derives.[^point] Only the speed $v_\perp$ across the line of sight enters. The bracket has the
eigenvalue $v_\perp$ on the direction halfway between $\hat n$ and $\hat n\times\vect v$, so the largest eigenvalue of
$\curv{\tB}$ is $3G\matter Mv_\perp/cr^3$, and $|\curv{\tB}|/|\curv{\tE}| = \sqrt3\,v_\perp/c$. For a person walking
past at $1.4\unit{m\,s^{-1}}$ the ratio is $8.1 \times 10^{-9}$.

## The Earth's own tide is subtracted, and its magnetic part weighs the core

On the ground the largest tide is the Earth's own.[^earth] For a pixel anywhere on the ground we use the Earth's mean
radius, $R = 6.371 \times 10^6\unit{m}$, with $G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$:

$$\begin{aligned}\frac{2G\matter M}{R^3} &= \frac{2 \times 3.986 \times 10^{14}}{(6.371 \times 10^6)^3}\unit{s^{-2}}\\ &= 3.08 \times 10^{-6}\unit{s^{-2}}\end{aligned}$$

along the vertical, 330 times the person's stretch
([section 1.4](/tutorial/newton/tides/#on-the-ground-the-earths-own-tide-is-far-larger-but-steady)). It is steady and
known, so it is subtracted; otherwise the camera works in a room falling freely far from any planet.

The Earth's spin leaves a smaller mark, which the camera can use. A pixel at rest on the equator moves with the
ground, at a speed for which we use the equatorial radius, $R = 6.378 \times 10^6\unit{m}$, as in every formula that
follows ([section 1.1](/tutorial/newton/vectors-and-indices/#the-ground-at-the-equator)):

$$\begin{aligned}\Omega R &= 7.292 \times 10^{-5}\unit{s^{-1}} \times 6.378 \times 10^6\unit{m}\\ &= 465\unit{m\,s^{-1}},\end{aligned}$$

where $\Omega$ is the Earth's spin. The pixel's motion and the planet's spin each give the pixel a small magnetic part,
of opposite signs, and their sum is

$$\frac{3G\matter M\Omega}{cR^2}\Bigl(1 - \frac{C}{\matter MR^2}\Bigr)$$

([section 7.5](/tutorial/geometry/gravitomagnetism/#the-earths-magnetic-part-weighs-its-core) derives it). Here $C$ is
the planet's moment of inertia about its axis of spin, in $\mathrm{kg\,m^2}$: the moment of inertia
$\sym{moment-of-inertia}{I}$ of section 1.6 about that axis, for which geophysicists write $C$. The units check:
$G\matter M\Omega/cR^2$ is $\mathrm{m^3\,s^{-2}} \times \mathrm{s^{-1}}$ divided by $\mathrm{m\,s^{-1}} \times
\mathrm{m^2}$, which is $\mathrm{s^{-2}}$. The 1 in the bracket is the pixel's motion: the ground carries the pixel
across the line to the Earth's centre at $v = \Omega R$, at the distance $r = R$, and the magnetic part of a moving mass
then gives $3G\matter Mv/cr^3 = 3G\matter M\Omega/cR^2$. The second term is the field of the planet's spin, its spin
dipole. The factor in front is

$$\begin{aligned}\frac{3G\matter M\Omega}{cR^2} &= \frac{3 \times 3.986 \times 10^{14} \times 7.292 \times 10^{-5}}{3.00 \times 10^8 \times (6.378 \times 10^6)^2}\unit{s^{-2}}\\ &= 7.15 \times 10^{-12}\unit{s^{-2}},\end{aligned}$$

and with the Earth's measured $C/\matter MR^2 = 0.3307$ (section 1.6) the sum is $0.669$ of it,
$4.78 \times 10^{-12}\unit{s^{-2}}$, about a two-thousandth of the person's stretch. A person walking past a metre away at $1.4\unit{m\,s^{-1}}$ makes, along the largest axis,

$$\begin{aligned}\frac{3G\matter Mv}{cr^3} &= \frac{3 \times 6.674 \times 10^{-11} \times 70 \times 1.4}{3.00 \times 10^8 \times 1^3}\unit{s^{-2}}\\ &= 6.54 \times 10^{-17}\unit{s^{-2}},\end{aligned}$$

so the Earth's magnetic part is $4.78 \times 10^{-12}/6.54 \times 10^{-17} = 73{,}100$ times larger.

The mass, the rate of spin and the radius are known, so one pixel on the ground reads the only unknown,
$C/\matter MR^2$. That number tells a planet with a core from one without: it is 0.4 for a uniform ball and 0.3307 for
the Earth, which fits a core of $12{,}500\unit{kg\,m^{-3}}$ and radius 3480 km inside a mantle of
$4150\unit{kg\,m^{-3}}$ ([section 1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)).
The steady pull outside cannot show the core, by the shell theorem of section 1.3.

**The idea to keep: one pixel in empty space reads the five numbers of the tide, and five more when masses move, in
axes held still. A person a metre away, behind a wall or not, raises $9 \times 10^{-9}\unit{s^{-2}}$, which the best
gradiometer of today reads five hundred times above its noise in a second and which quantum mechanics would allow to
be read a hundred thousand times more finely.**

::: problems
### Practice

**[R1]** A person of 90 kg stands 2 m from a pixel and sways by 10 cm once a second. Find the stretch, its change, the
strain of one free arm of a small detector, and the strain $h$ counted as for a wave.

::: solution
The stretch is $2G\matter M/r^3 = 2 \times 6.674 \times 10^{-11} \times 90/2^3\unit{s^{-2}} = 1.50 \times
10^{-9}\unit{s^{-2}}$. Its relative change is $3\,\delta r/r = 3 \times 0.1/2 = 0.15$, as for the person at 1 m, so the
change is $2.25 \times 10^{-10}\unit{s^{-2}}$. One arm changes by $2.25 \times 10^{-10}/39.5 = 5.7 \times 10^{-12}$,
and $h$ is twice that, $1.1 \times 10^{-11}$: about five and eleven billion times $10^{-21}$.
:::

**[R1]** Of the swaying person's strains $7 \times 10^{-11}$ and $3 \times 10^{-15}$, which belongs to the real LIGO,
and why is it so much smaller?

::: solution
The $3 \times 10^{-15}$. The tide formula assumes a detector much smaller than its distance from the person; LIGO's
arms are 4 km long, so the person pulls on only the nearest mirror, whose swing is divided by 4 km. The
$7 \times 10^{-11}$ belongs to a small detector, counted as for a wave.
:::

**[R1]** How large is the trace of the tide inside a pixel of water, compared with the person's stretch, and why can a
pixel in empty space never read it?

::: solution
$4\pi G\matter\rho = 8.4 \times 10^{-7}\unit{s^{-2}}$, ninety times the person's $9.34 \times 10^{-9}\unit{s^{-2}}$.
The trace measures the density at the pixel's own place and nothing else, so in empty space it is zero, however much
matter lies nearby.
:::

### Stretch

**[R1]** A pixel at rest on the equator turns with the Earth, so its axis of turning points north, along the ground.
The person stands 1 m to the east. Find the three eigenvalues of what the turning pixel reads, along east, north and
up, once the Earth's own tide has been subtracted, and their sum. What density of matter would a pixel need to read
that sum from a real tide?

::: solution
The person's table, along east, north and up, is $(-9.34, +4.67, +4.67) \times 10^{-9}\unit{s^{-2}}$ (section 1.4).
The pseudo-tide is $-\obs\Omega^2 = -5.32 \times 10^{-9}\unit{s^{-2}}$ along each direction across the axis, east and
up, and zero along it, north (section 1.6). The sums are $-1.47 \times 10^{-8}$ east, $+4.67 \times 10^{-9}$ north and
$-6.5 \times 10^{-10}\unit{s^{-2}}$ up: the vertical squeeze has become a slight stretch. The three add up to
$-1.06 \times 10^{-8}\unit{s^{-2}} = -2\obs\Omega^2$. The Earth's own tide, 300 times larger, would not change the
sum, because it is trace-free. A real tide has the trace $4\pi G\matter\rho$, so it would need
$\matter\rho = -2\obs\Omega^2/4\pi G = -12.7\unit{kg\,m^{-3}}$, a negative density. The trace gives the turning away.
:::

### The camera

**[R1]** Compute, for a pixel on the ground, the Earth's tide along the vertical, the speed of the ground at the
equator, the Earth's magnetic part with $C/\matter MR^2 = 0.3307$, and its ratio to the magnetic part of a person
walking past a metre away at $1.4\unit{m\,s^{-1}}$, taken as $3G\matter Mv/cr^3$.

::: solution
The mean radius gives $2G\matter M/R^3 = 3.08 \times 10^{-6}\unit{s^{-2}}$. The equatorial radius, used for the
pixel on the equator, gives $\Omega R = 465\unit{m\,s^{-1}}$ and $3G\matter M\Omega/cR^2 = 7.15 \times
10^{-12}\unit{s^{-2}}$, which times $0.669$ is $4.78 \times 10^{-12}\unit{s^{-2}}$. The walking person gives
$6.54 \times 10^{-17}\unit{s^{-2}}$, and the ratio is 73,100.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel), its summary in plain words and its body: the falling observer, the ring, the five
  numbers, the person, LIGO and the lorry, all read above.
- The paper's equations [](/paper/#eq:tidal) to [](/paper/#eq:magnetic), and Figures [](/paper/#fig:tidal) and
  [](/paper/#fig:tidal-field): the tide, its two limits and its magnetic part.
- [*What the premise asks*](/paper/#par:what-the-premise-asks): the instruments, the ratio of five hundred and the
  standard quantum limit.
- [*The Earth's own tide*](/paper/#par:the-earths-own-tide): the Earth's tide, the speed of the ground, and the
  magnetic part that reads $C/\matter MR^2$, with equation [](/paper/#eq:magnetic-point) from
  [Section IV](/paper/#sec:near-field).
- [*One complex matrix*](/paper/#par:one-complex-matrix), in Section VIII, takes up $\curv{\mathcal W}$ from the
  section's last paragraph.
:::

::: deeper
- The [GR course, section 10.1](https://neovand.github.io/general-relativity/chapter-10.html#10-1-one-falling-astronaut-is-not-enough)
  starts with one falling astronaut, and
  [section 10.9](https://neovand.github.io/general-relativity/chapter-10.html#10-9-how-much-curvature-is-outside-your-window)
  computes the Earth's tide, $3.08 \times 10^{-6}\unit{s^{-2}}$, from curvature.
- The GR course's [appendix A.9](https://neovand.github.io/general-relativity/appendix-a.html#a-9-newtonian-tides-know-the-sign-convention)
  fixes the sign conventions of $\curv{\tE}$, and
  [appendix A.20](https://neovand.github.io/general-relativity/appendix-a.html#a-20-gravitational-wave-strain-is-a-relative-measurement)
  explains why a wave's strain is a relative measurement.
- The [GR course, section 18.4](https://neovand.github.io/general-relativity/chapter-18.html#18-4-but-the-particles-do-not-move-in-tt-coordinates-exactly)
  shows what a detector reads in the transverse traceless coordinates of a wave.
:::

[^pixel]: The pixel and the numbers of this section were first set out in *The gravitational camera* (Mohsenvand
    2026), [Sec. II](/paper/#sec:pixel).

[^magnetic]: Section [7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index)
    defines the magnetic part from the curvature of spacetime, $\curv{\tB}_{ij} = \tfrac12c^2\epsilon_{ipq}R_{pqj0}$,
    with $\epsilon_{ipq}$ the Levi-Civita symbol of
    [section 1.1](/tutorial/newton/vectors-and-indices/#the-cross-product-is-written-with-the-levi-civita-symbol), and
    derives its properties [@Nichols2011]; it is equation [](/paper/#eq:magnetic) of *The gravitational camera*
    (Mohsenvand 2026), Sec. II.

[^turned]: Section [1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero) shows,
    with complex numbers, that the imaginary part of a wave's complex table is its real part turned by 45°.

[^W]: Section [1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero) builds
    $\curv{\mathcal W}$ for a plane wave.

[^riemann]: The convention is $R^\alpha{}_{\beta\gamma\delta} = \partial_\gamma\Gamma^\alpha_{\beta\delta} - \dots$,
    where the $\Gamma$ are the Christoffel symbols of section
    [7.1](/tutorial/geometry/metric/#free-bodies-follow-geodesics-and-the-christoffel-symbols-hold-newtons-pull). With
    it, a stretch is a negative entry, as in section 1.4.

[^equations]: *The gravitational camera* (Mohsenvand 2026), Sec. II, defines the pixel's tide in this way, as its
    equations [](/paper/#eq:tidal) and [](/paper/#eq:deviation).

[^wave]: In *The gravitational camera* (Mohsenvand 2026), Sec. II, the tide of a wave is its equation
    [](/paper/#eq:wave), and the strain of every later section is counted in this way.

[^free]: LIGO's mirrors hang from pendulums whose own swings lie near 1 Hz, so at a sway of once a second a free mirror
    is an idealization (section 1.4).

[^sway]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II.

[^premise]: The instruments and the quantum limit of this section were first compared with the person's tide in *The
    gravitational camera* (Mohsenvand 2026), Sec. II, [*What the premise asks*](/paper/#par:what-the-premise-asks).

[^sqrt]: The noise of an average falls as the square root of the reading time (section 3.1), so the atom gradiometer's
    20 E in ten minutes is about $20\sqrt{600} = 490\unit{E}$ in one second, 25,000 times the superconducting one's.

[^point]: It is equation [](/paper/#eq:magnetic-point) of *The gravitational camera* (Mohsenvand 2026), Sec. IV.

[^earth]: The Earth's magnetic part as a measure of its core was first shown in *The gravitational camera*
    (Mohsenvand 2026), Sec. II, [*The Earth's own tide*](/paper/#par:the-earths-own-tide).
