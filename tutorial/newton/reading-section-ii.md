---
id: R1
title: 'Reading Section II, the Newtonian half'
question: "With Part 1 behind us, which of Section II's claims can we now check for ourselves, and which must wait for relativity and quantum mechanics?"
part: '1'
requires: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6']
paper: [sec:pixel, eq:tidal, eq:deviation, eq:newton, eq:wave, eq:magnetic, fig:tidal, fig:tidal-field, eq:magnetic-point, eq:W]
figures: [fig:tidal, fig:tidal-field]
live: [tidal-ring, turning-pixel]
---

[Section II](/paper/#sec:pixel) of the paper, *What a pixel measures*, is short: a summary in plain words, five
numbered equations, two figures and two closing paragraphs. It defines the quantity that every later section uses, and
it puts numbers on it: a person, a lorry, LIGO, the best laboratory instrument and the Earth. With Part 1 behind us,
which of Section II's claims can we now check for ourselves, and which must wait for relativity and quantum mechanics?

This chapter reads the section in order, with one heading for each stretch of text, and derives nothing new. Each
claim gets one plain sentence, the chapter that teaches it, and one of three marks. *Checked here* means that
Part 1 has derived the claim and this chapter recomputes its numbers. *Read now, derived in Part N* means that we can
read the claim and use it, but its proof needs a later part. *Stated in the paper* means that the paper takes the
claim from outside its own argument, such as the record of an instrument or a measured property of the Earth.

::: plain
Section II says what one pixel of the gravitational camera records. A freely falling detector cannot feel the pull of
gravity at its own place, so it records the tide: the difference in the pull between nearby points. Part 1 derived
this from Newton's law, together with the table of numbers that describes the tide, the count of five independent
numbers in it, and the tide of a person one metre away.

So most of Section II can now be checked with a calculator. The person's tide, the strain that LIGO would read if the
person swayed beside it, the best instrument's view of the person and the Earth's own tide all come out as the paper
says.

A few claims need more. The definition of the tide as curvature, the tide of a gravitational wave and the second,
twisting kind of tide come from Einstein's theory, which Part 7 teaches. The finest reading that quantum mechanics
allows comes from Part 8. For these the chapter says what the claim means and where it will be proved.
:::

## The section can be read as a map of what Part 1 has proved

Each row of the table is one stretch of Section II, in order, with its main claim, the chapters that teach it and its
mark. A row marked *mixed* holds claims of more than one kind.

| Stretch of Section II | Its main claim | Taught in | Mark |
|---|---|---|---|
| Summary in plain words | A ring of free balls is stretched along the line to a mass; the person's tide swamps LIGO's waves; moving masses add a magnetic part. | 1.4, 1.5; 7.5 | mixed: numbers checked, magnetic part Part 7 |
| Equations (1) and (2) | The tide is a piece of the curvature, and it moves free balls as $-\curv{\tE}_{ij}\xi_j$. | 1.4; 7.2 | mixed: (2) checked, (1) Part 7 |
| Two limits, (3) and (4) | Near slow matter the tide is the Hessian of the potential; in a wave it is the strain's acceleration. | 1.4; 7.6 | mixed: (3) checked, (4) Part 7 |
| The lorry and the swaying person | A sway of 5 cm changes the tide by about 15 per cent, read as a strain far above $10^{-21}$. | 1.4; 7.6 | mixed: numbers checked, convention of $h$ Part 7 |
| Ten numbers, equation (5) | A pixel reads ten numbers and must not turn. | 1.1, 1.3, 1.5, 1.6; 7.5 | mixed |
| What the premise asks | Existing instruments see the person; quantum mechanics allows far better. | 1.4; 8.6 | mixed: numbers checked, the limit Part 8 |
| The Earth's own tide | The Earth's tide is subtracted, and its magnetic part weighs the core. | 1.1, 1.4, 1.6; 7.5 | mixed: numbers checked, the formula Part 7 |
| One complex matrix | The two parts combine as $\curv{\mathcal W} = \curv{\tE} + i\curv{\tB}$. | 1.5b; 9.3 | read now, derived in Part 9 |

## The summary in plain words holds, number by number

The [summary in plain words](/paper/#sec:pixel) begins with an astronaut, who floats because the astronaut and the spacecraft
fall together. Gravity at a single point can be cancelled by falling freely. This is the **equivalence principle**,
which [1.4](/tutorial/newton/tides/#falling-together-cancels-the-pull-but-not-its-difference)
states in its Newtonian form: every body at a given place falls with the same acceleration (*stated in the paper*, as
the result of experiment).

Falling cannot cancel the difference in gravity between two nearby points, because one acceleration cannot match two
different pulls. The ring of free balls beside a mass is stretched along the line to the mass and squeezed across it.
The near balls are pulled harder than the far ones, and the balls at the sides are pulled along lines that meet at the
mass. This difference in gravity is the **tide**
([1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it), *checked
here*). It is measured in reciprocal seconds squared, $\mathrm{s^{-2}}$: in a tide of one per second squared, two free
balls one metre apart accelerate relative to each other by one metre per second squared. The unit checks, because a
potential in $\mathrm{m^2\,s^{-2}}$ differentiated twice by metres gives $\mathrm{s^{-2}}$.

The tide at a point is a table with three rows and three columns, the **tidal tensor**
$\sym{tidal-tensor}{\curv{\tE}}_{ij}$, measured in $\mathrm{s^{-2}}$. The summary says that only five of its nine
entries are independent. In Newton's theory the table is symmetric, because it is a table of second derivatives taken
in either order, and in empty space its diagonal adds to zero. Beside a single mass the stretch is exactly twice each
squeeze, the pattern $-2 : 1 : 1$ of 1.4
([1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left), *checked here* for
Newton's theory). That the same holds in Einstein's theory is *read now, derived in Part 7* (chapters 7.2 and 7.3).

The summary then names the **magnetic part** of the tide, a second table made by moving masses, which twists
gyroscopes instead of stretching rings. That it holds five numbers, is very small near slow matter and is as strong as
the first part in a wave is *read now, derived in Part 7* (chapters 7.5 and 7.6).

LIGO measures how much longer one of its 4 km arms has become than the other. The **strain** is that difference in
length divided by the length of an arm, a pure number. A strain of $10^{-21}$ (*stated in the paper*, from LIGO's
detections) makes the arms differ by

$$10^{-21} \times 4000\unit{m} = 4.0 \times 10^{-18}\unit{m}.$$

The width of a proton is $1.68 \times 10^{-15}\unit{m}$, twice its measured charge radius, so this is a 420th of it,
the paper's "about a four-hundredth" (*checked here*). A wave lined up with the arms stretches one arm and squeezes the
other by the same amount, so each arm changes by half the difference, $2 \times 10^{-18}\unit{m}$
([shown below](#near-slow-matter-the-tide-is-the-hessian-and-in-a-wave-it-is-the-strains-acceleration) from the
paper's equations). LIGO's one number is $\curv{\tE}_{xx} - \curv{\tE}_{yy}$ integrated twice in
time, one combination of the five
([1.5](/tutorial/newton/five-numbers/#the-five-numbers-are-the-components-of-a-vector-with-its-own-length), *checked
here*). That is why it cannot tell a passing lorry from a distant collision of black holes.

Here $G = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is Newton's constant. A person of mass
$\sym{mass}{\matter M} = 70\unit{kg}$ at the distance $r = 1\unit{m}$ makes the stretch

$$\begin{aligned}\frac{2G\matter M}{r^3} &= \frac{2 \times 6.674 \times 10^{-11} \times 70}{1^3}\unit{s^{-2}}\\ &= 9.34 \times 10^{-9}\unit{s^{-2}},\end{aligned}$$

the summary's "$9\times10^{-9}$" (1.4, *checked here*). A falling apple accelerates at $9.81\unit{m\,s^{-2}}$, and
$9.34 \times 10^{-9}/9.81 = 9.5 \times 10^{-10}$, "about a billionth".

Next the person stands 1 m beyond one of LIGO's end mirrors and sways by 5 cm once a second. The other mirrors are
4 km away, so the person pulls on that one mirror alone, with $G\matter M/r^2 = 4.67 \times 10^{-9}\unit{m\,s^{-2}}$.
The sway changes the distance by $\delta r = 5\unit{cm}$, and the pull, which goes as $r^{-2}$, by $2\,\delta r/r = 10$
per cent, or $4.67 \times 10^{-10}\unit{m\,s^{-2}}$. A mirror that moves freely at the sway's angular frequency
$\omega = 2\pi\unit{s^{-1}}$, with $\omega^2 = 39.5\unit{s^{-2}}$, swings by the change in the pull divided by
$\omega^2$:

$$\frac{4.67 \times 10^{-10}}{39.5}\unit{m} = 1.18 \times 10^{-11}\unit{m}.$$

That is $1.18 \times 10^{-8}$ of a millimetre, "a hundred-millionth of a millimetre". Divided by the 4000 m of the
arm, it is a strain of $2.96 \times 10^{-15}$, "about $3\times10^{-15}$", and $2.96 \times 10^{6}$ times $10^{-21}$,
"about three million times"
([1.4](/tutorial/newton/tides/#a-swaying-person-makes-the-signal-that-ligo-must-keep-out), last margin note, *checked
here*).[^free]

The summary next introduces **noise**, the small random changes in an instrument's reading that are present even when
there is nothing to measure, and the **signal-to-noise ratio**, the size of a signal divided by the typical size of
the noise ([0.2](/tutorial/evening/through-walls/#the-blur-shrinks-only-with-the-number-of-digits-of-the-sensitivity);
Part 3). The best laboratory gradiometer, read for a second, has a noise
of $0.02\unit{E}$ (*stated in the paper*), where $1\unit{E} = 10^{-9}\unit{s^{-2}}$ is the eötvös of 1.4. The
person's stretch is $9.34\unit{E}$, so the ratio is $9.34/0.02 = 467$, "about five hundred" (*checked here*).

Last, the Earth's own tide on the ground is $3.08 \times 10^{-6}\unit{s^{-2}}$ (computed in the last section), and $3.08
\times 10^{-6}/9.34 \times 10^{-9} = 330$, "about three hundred times larger"
([1.4](/tutorial/newton/tides/#on-the-ground-the-earths-own-tide-is-far-larger-but-steady), *checked here*).

## Equations (1) and (2) define the tide and say what it does

The body of [Section II](/paper/#sec:pixel) starts again from the falling observer. It defines the tide for an observer
at rest, with $t$ the observer's **proper time**, the time read on the observer's own clock (chapter
[7.1](/tutorial/geometry/metric/#a-clocks-own-time-is-set-by-the-metric)), and $x^0 = ct$:

{{paper eq:tidal}}

In Einstein's theory gravity is a **curvature of spacetime**: space and time together are bent, so that free bodies,
each moving as straight as it can, drift together or apart (chapter 7.2). Here $R_{0i0j}$ are some of the components
of the **Riemann tensor**, the table that measures this curvature, in $\mathrm{m^{-2}}$. The sign of $\curv{\tE}$
depends on two conventions, which the paper names. The signature $-{+}{+}{+}$ says that time enters Einstein's
measure of the separation between two events with the opposite sign to the three directions of space (chapter 6.2).
The other is the sign of $R$.[^riemann]

We can read the equation now with the five steps of
[0.6](/tutorial/evening/how-to-read/#an-equation-can-be-read-before-it-is-derived). Its units check, because $c^2$ in
$\mathrm{m^2\,s^{-2}}$ times $\mathrm{m^{-2}}$ is $\mathrm{s^{-2}}$, the unit of a tide. Near slow matter it should
reduce to the paper's equation (3), which 1.4 derived from Newton's law directly. That it does so, and the equation
itself, are *read now, derived in Part 7* (chapter 7.2).

The second equation is the motion of free balls:

{{paper eq:deviation}}

Here $\sym{separation}{\xi}^i$ is the separation of two free balls, in metres, and the left side is their relative
acceleration. This is the ring equation that
[1.4](/tutorial/newton/tides/#the-difference-in-gravity-is-a-table-of-second-derivatives) derived from Newton's law by
a Taylor expansion (*checked here*). The paper raises the index on $\xi$, and in Part 1 a raised and a lowered index
mean the same thing. The minus sign makes a negative entry a stretch and a positive entry a squeeze.

{{paper fig:tidal}}

Figure 2 has no colour. Each arrow is the displacement of one ball, and the dashed circle is the ring undisturbed.
Panel (a) is 1.4's ring beside a mass, with the stretch twice each squeeze (*checked here*). Panels (b) and (c) are the
two polarizations of a gravitational wave, its two basic patterns of stretch and squeeze. The sign ⊙ means that the
wave travels out of the page toward the reader, like the point of an arrow seen head on. The pale ring is the ring half
a cycle later, when the stretch and the squeeze have changed places. That the two patterns differ by a turn of 45° is
[1.5](/tutorial/newton/five-numbers/#across-a-wave-two-numbers-are-left-and-a-turn-of-45-swaps-them)'s result for any
symmetric trace-free table across a direction (*checked here*). That a wave has this form is *read now, derived in
Part 7* (chapter 7.6).

{{paper fig:tidal-field}}

In Figure 3 the colour maps one entry of the table only. In panels (a) and (b) it is $\curv{\tE}_{zz}$, the entry up
the page: orange where the ring is stretched up the page (the entry negative), blue where it is squeezed. So in panel
(a) every ring is stretched toward the mass, yet the map is blue to the left and right of the mass, because there the
stretch lies across the page. Let $\vartheta$ be the angle between the vertical and the line from a point to the mass.
The entry $\curv{\tE}_{zz}$ is proportional to $1 - 3\cos^2\vartheta$, so the boundary between orange and blue runs at
$\vartheta = 54.7°$, as [1.5](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes) finds
(*checked here*).

In panel (b), midway between two equal masses, the ring is stretched along the line joining them. There the two pulls
cancel, but the two stretches add, because the point-mass table $\delta_{ij} - 3\hat n_i\hat n_j$ does not change when
$\hat n$ turns round. For two people of 70 kg a metre on either side the stretch is $1.87 \times 10^{-8}\unit{s^{-2}}$,
twice one person's (1.4's second check question, *checked here*). Panel (c) is a plane wave, with the colour now the
entry across the page, $\curv{\tE}_{xx}$ (*read now, derived in Part 7*).

::: try {#tidal-ring}
Predict first: when the person steps back from 1 m to 1.05 m, the pull falls by about 10 per cent. Does the stretch fall
by less, by the same or by more? Then answer the figure's own two predictions, and read the stretch at 1 m on the way:
Section II's $9.34\unit{E}$. Last, switch back to one mass, bring it to 1.00 m and move it out to 1.05 m (each press of
an arrow key moves it 5 cm). The stretch falls to $8.07\unit{E}$, by 13.6 per cent, more than the pull, because the tide
goes as the cube of the distance. This is the sway of the next sections.
:::

## Near slow matter the tide is the Hessian, and in a wave it is the strain's acceleration

Section II's paragraph on ["two limits"](/paper/#sec:pixel) gives the tide close to slowly moving matter:

{{paper eq:newton}}

Here $\sym{potential}{\field\Phi}$ is the Newtonian potential, in joules per kilogram, and the right side is its table
of second derivatives, its Hessian. This is 1.4's boxed result (*checked here*). The paper adds that for a body of mass
$\matter M$ at distance $r$ "its size is $2GM/r^3$ along the line to the body", which is 1.4's entry along the line,
$-2G\matter M/r^3$, a stretch (*checked here*).

Far from the source, in a gravitational wave, it is

{{paper eq:wave}}

Here $h^{\rm TT}_{ij}$ is the strain of the wave, a table of pure numbers, written in a particular choice of
coordinates (the transverse traceless gauge) that chapter 7.6 explains. The equation says that the tide of a wave is
minus half the second time derivative of its strain (*read now, derived in Part 7*). Its units check, because a pure
number differentiated twice by seconds is in $\mathrm{s^{-2}}$.

The factor $\tfrac12$ fixes what the paper means by the strain $h$ of a wave. Take a wave whose stretch and squeeze lie
along two arms of length $L$, on the $x$ and $y$ axes, so that $h^{\rm TT}_{xx} = h$ and $h^{\rm TT}_{yy} = -h$. Put
equation (4) into equation (2): the arm along $x$ obeys $\ddot\xi_x = \tfrac12\ddot h\,\xi_x$. The strain is tiny, so
$\xi_x$ stays close to $L$ on the right, and integrating twice in time gives

$$\delta\xi_x = \tfrac12 hL, \qquad \delta\xi_y = -\tfrac12 hL.$$

So one arm changes by $h/2$ of its length and the other by $-h/2$, and their difference divided by $L$ is $h$. For a
wave lined up with the arms, LIGO's strain and the paper's $h$ are the same number.

The paper's next sentence says that an interferometer, an instrument like LIGO that compares the lengths of its arms
with light, "reads one component of $\curv{\tE}_{ij}$, integrated twice in time". The component is
$\curv{\tE}_{xx} - \curv{\tE}_{yy}$, which is $\sqrt2$ times the coefficient of $\curv{\tE}$ along 1.5's basis table
$b^4$. This is 1.4's last section and 1.5's contraction with $\mathrm{diag}(1, -1, 0)$ (*checked here*).

## The swaying person gives four strains, all far above LIGO's waves

The paragraph on the lorry and the swaying person, in the body of [Section II](/paper/#sec:pixel), repeats the
person's tide, "$\curv{\tE} \approx 9\times10^{-9}\unit{s^{-2}}$". If the person sways by 5 cm once a second, "the
field changes by $3\,\delta r/r$ of itself". The stretch goes as $r^{-3}$, so its relative change is three times the
relative change of the distance, $3 \times 0.05 = 0.15$, and

$$\delta\curv{\tE} = 0.15 \times 9.34 \times 10^{-9}\unit{s^{-2}} = 1.40 \times 10^{-9}\unit{s^{-2}},$$

the paper's "about $1.4\times10^{-9}$"
([1.4](/tutorial/newton/tides/#a-swaying-person-makes-the-signal-that-ligo-must-keep-out), *checked here*). The exact
change is $1.27 \times 10^{-9}$ when the person steps back 5 cm and $1.55 \times 10^{-9}$ when they step forward, 13.6
and 16.6 per cent of the stretch. The two differ because $r^{-3}$ is not a straight line, and that is why the paper
writes "about".

The paper then says that a detector reads this "as a strain $h = 2\,\delta\curv{\tE}/\omega^2 \approx 7\times10^{-11}$".
Section II thus gives two strains for this person, $7 \times 10^{-11}$ here and $3 \times 10^{-15}$ in its plain words.
They belong to two different detectors, and the first is counted in the convention of equation (4). Four numbers make
the picture complete. The first three use a small detector, built like LIGO but with arms a few centimetres long, which
is close to one pixel. The tide is nearly the same across it, so equation (2) holds, and 1.4 found that a free arm of
length $L$ along the line to the person changes by $\delta L/L = \delta\curv{\tE}/\omega^2$. With $\omega^2 =
39.5\unit{s^{-2}}$:

- *One arm*, along the line to the person, changes by $1.40 \times 10^{-9}/39.5 = 3.55 \times 10^{-11}$ of its length.
- *The difference of two arms divided by the length of an arm*, the strain as the plain words define it, is larger by
  $\tfrac32$, because the arm across the line changes by half as much in the opposite sense: $5.3 \times 10^{-11}$.
- *The paper's $h$* counts as for a wave, in which each arm changes by $h/2$, as the last section showed. So $h$ is
  twice the one-arm strain, $2 \times 3.55 \times 10^{-11} = 7.1 \times 10^{-11}$, the paper's
  "$\approx 7\times10^{-11}$" (the convention is *read now, derived in Part 7*).
- *The real LIGO*, with arms 4 km long, is not a small detector. The person moves only the nearest mirror, and the
  strain, by the plain words' definition again, is their $2.96 \times 10^{-15}$.

In the same order, the four strains are $3.55 \times 10^{10}$, $5.3 \times 10^{10}$, $7.1 \times 10^{10}$ and
$3.0 \times 10^{6}$ times the $10^{-21}$ of LIGO's waves (all *checked here*). All of them are enormous, and
that is all the paper's conclusion needs. "This is why people and vehicles must be kept away from its mirrors"
[@ThorneWinstein1999]: the practice is *stated in the paper*, and these numbers explain it. "The signal that the
observatory removes as contamination is the one that a near-field camera records." A lorry is heavier and farther,
and it gives the same conclusion.[^lorry]

## An ideal pixel reads ten numbers, and must not turn

The next paragraph of [Section II](/paper/#sec:pixel) says that an ideal pixel records all of $\curv{\tE}_{ij}$ and
also its magnetic counterpart:

{{paper eq:magnetic}}

Here $\sym{magnetic-tide}{\curv{\tB}}_{ij}$ is the magnetic part of the tide, in $\mathrm{s^{-2}}$, and
$\epsilon_{ipq}$ is the Levi-Civita symbol of
[1.1](/tutorial/newton/vectors-and-indices/#the-cross-product-is-written-with-the-levi-civita-symbol). The components
$R_{pqj0}$ have one time index, so they record how the curvature changes as matter moves, and the units check as for
equation (1). The paper says that $\curv{\tB}$ "describes how the field twists the axes of nearby gyroscopes relative
to one another" [@Nichols2011]. A gyroscope is a fast wheel whose axis keeps its direction
([1.6](/tutorial/newton/motion/#angular-momentum-stays-fixed-when-the-force-points-at-a-centre)). The equation and its
meaning are *read now, derived in Part 7* (chapter 7.5).

The paper's claims about the two tables, one by one:

- "In vacuum both are symmetric and trace-free, so a pixel yields ten numbers." For $\curv{\tE}$ in Newton's theory
  this is 1.5's count of five (*checked here*). In Einstein's theory $\curv{\tE}$ is symmetric because of a symmetry
  of the Riemann tensor, and trace-free because Einstein's equation makes $R_{00}$ vanish in vacuum; this, and the
  claim for $\curv{\tB}$, are *read now, derived in Part 7* (chapters 7.2, 7.3 and 7.5).
- "With this normalization the two are equal in size in a plane wave, and $\curv{\tB}_{ij}$ is $\curv{\tE}_{ij}$
  turned by 45° about the direction of travel." The normalization is the factor $\tfrac12c^2$ in equation (5), chosen
  so that the two tables come out equal in size in a wave. What a turn of 45° does to a pattern of stretch
  and squeeze is 1.5's result (*checked here*). That the wave's magnetic part is that turned copy is *read now, derived
  in Part 7* (chapter 7.6).[^turned]
- "Inside matter the Ricci part of the curvature adds local information that a pixel in vacuum does not see." The
  **Ricci part** is the part of the curvature that Einstein's equation ties to the matter at the point itself
  (chapter 7.3). Its first piece is "the trace $\mathrm{tr}\,\curv{\tE} = c^2R_{00} = 4\pi G\matter\rho$ in the
  Newtonian limit". Here $\sym{density}{\matter\rho}$ is the density of mass at the pixel, in kilograms per cubic
  metre. The Newtonian form, $\curv{\tE}_{kk} = 4\pi G\matter\rho$, is Poisson's equation
  ([1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point) and
  [1.4](/tutorial/newton/tides/#in-empty-space-the-stretch-and-the-squeezes-balance), *checked here*). In water it is
  $4\pi \times 6.674 \times 10^{-11} \times 1000 = 8.4 \times 10^{-7}\unit{s^{-2}}$, ninety times the person's stretch,
  and at the Earth's mean density of $5513\unit{kg\,m^{-3}}$ it is $4.6 \times 10^{-6}\unit{s^{-2}}$. The identity
  with $c^2R_{00}$ is *read now, derived in Part 7* (chapter 7.3).
- Its second piece is "an antisymmetric part of the magnetic tensor,
  $\curv{\tB}_{[ij]} = -(4\pi G/c)\,\epsilon_{ijk}\,\matter\rho v_k$ … which lies along the flow". Here $\vect v$ is
  the velocity of the matter, in metres per second. An antisymmetric table is a vector in disguise, and 1.1's third
  problem found this one to be $-(4\pi G/c)\matter\rho\,\vect v$: along the flow, pointing upstream
  ([1.1](/tutorial/newton/vectors-and-indices/#an-antisymmetric-table-is-a-vector-in-disguise), *checked here*). For
  water flowing at $1\unit{m\,s^{-1}}$ its size is $2.8 \times 10^{-15}\unit{s^{-2}}$. The formula itself is *read
  now, derived in Part 7* (chapter 7.5).

Both pieces vanish where there is no matter, whatever lies nearby, so a pixel in empty space never sees them.

The paragraph then sets a condition: "the pixel is also assumed not to rotate". A frame turning at the angular
velocity $\sym{angular-velocity}{\obs\Omega}$, in radians per second, feels a **pseudo-tide**: an apparent stretch
across the axis, of size $\obs\Omega^2$, that comes from the turning and not from any mass
([1.6](/tutorial/newton/motion/#a-turning-pixel-feels-a-pseudo-tide), *checked here*). The Earth turns once in
86,164 s, so

$$\begin{aligned}\obs\Omega^2 &= \Bigl(\frac{2\pi}{86{,}164\unit{s}}\Bigr)^2 = (7.29 \times 10^{-5}\unit{s^{-1}})^2\\ &= 5.3 \times 10^{-9}\unit{s^{-2}},\end{aligned}$$

the paper's "$5\times10^{-9}$". The Moon's tide at the Earth is $1.73 \times 10^{-13}\unit{s^{-2}}$ (1.4), and
$5.32 \times 10^{-9}/1.73 \times 10^{-13} = 31{,}000$, "some thirty thousand times" (*checked here*). The pseudo-tide
is also 0.57 of the person's stretch.

The pseudo-tide is steady, like the Earth's tide, so a pixel that knew its own turning exactly, to two parts in a
thousand, could subtract it. Turning is measured by gyroscopes, so the pixel needs them either way: to measure its
turning, or to hold its axes still so that there is nothing to subtract. The paper takes the second way: "gyroscopes
must hold the frame still"
([1.6](/tutorial/newton/motion/#the-pixel-reads-the-tide-in-axes-that-gyroscopes-hold-still), *checked here*).

The paragraph ends with a definition: "We call an array of such pixels a gravitational camera."

::: try {#turning-pixel}
Predict first: if the pixel turned at half the Earth's rate, would its pseudo-tide be half as large, or smaller still?
The figure is already playing; watch the ring seen from the side widen across the axis. Press "The Earth's rate" and
read the stretch across the axis, $-5.32 \times 10^{-9}\unit{s^{-2}}$. Then drag the turning rate to halfway and read
it again. Last, switch on "The person's tide beside it" and compare the two traces: the pseudo-tide's is
$-2\obs\Omega^2$, which no mass in empty space can give, and the person's is zero.
:::

## What the premise asks, existing instruments nearly supply

The paragraph [*What the premise asks*](/paper/#par:what-the-premise-asks) begins: "A pixel of this kind is an old
idea." Each instrument it lists is *stated in the paper*, from its source:

- the **gravitational compass**, a cluster of free masses read against one another, proposed to measure the curvature
  piece by piece [@Pirani1956; @Szekeres1965];
- a sphere with several transducers, a ball of metal that rings when a tide squashes it, whose five ways of ringing in
  its lowest tone read the five numbers of $\curv{\tE}$ at one place
  [@Forward1971; @WagonerPaik1977; @MerkowitzJohnson1995]; the count of five is
  [1.5](/tutorial/newton/five-numbers/#patterns-of-higher-degree-hold-7-9-and-more-numbers)'s (*checked here*);
- a detector designed to read all of $\curv{\tE}$ [@Paik2016].

"In the near field the premise asks little more than exists." A **gravity gradiometer** is any instrument that measures
the tide, the gradient of gravity. Tides are measured in eötvös, and "the person a metre away is nine of them":
$9.34\unit{E}$ (1.4, *checked here*). An atom gradiometer carried over a buried tunnel reached $20\unit{E}$ in ten
minutes [@Stray2022], and a superconducting one in the laboratory reaches $0.02\unit{E}$ in a second
[@MoodyPaikCanavan2002] (both *stated in the paper*). The second gives the ratio of 467 found above, the paper's "five
hundred".[^sqrt] A satellite has carried a gradiometer as sensitive around the Earth [@RummelYiStummer2011]; chapter
[0.2](/tutorial/evening/through-walls/#the-blur-shrinks-only-with-the-number-of-digits-of-the-sensitivity) reads its
map.

The paper then asks how fine a reading the laws of physics allow. Two free masses of a gram, a centimetre apart and read
for a second at the **standard quantum limit**, "would resolve $6\times10^{-14}\unit{s^{-2}}$". Watching a mass
disturbs it, so quantum mechanics sets a smallest uncertainty on its position. For a mass $m$, in kilograms, watched
for a time $\tau$, in seconds, with the watching as the only disturbance, that smallest uncertainty is the standard
quantum limit:

$$\begin{aligned}\Delta x = \sqrt{\frac{\hbar\tau}{m}} &= \sqrt{\frac{1.055 \times 10^{-34} \times 1}{10^{-3}}}\unit{m}\\ &= 3.25 \times 10^{-16}\unit{m}.\end{aligned}$$

Here $\sym{hbar}{\hbar}$ is the reduced Planck constant, in joule seconds (*read now, derived in Part 8*, chapter 8.6).
By equation (2), two masses a distance $\xi$ apart, starting at rest, are moved relative to each other by
$\tfrac12\curv{\tE}\xi\tau^2$ in the time $\tau$. The smallest tide that moves them by $\Delta x$ is therefore about

$$\begin{aligned}\curv{\tE} \approx \frac{2\,\Delta x}{\xi\tau^2} &= \frac{2 \times 3.25 \times 10^{-16}}{0.01 \times 1^2}\unit{s^{-2}}\\ &= 6.5 \times 10^{-14}\unit{s^{-2}},\end{aligned}$$

the paper's "$6\times10^{-14}$", and $9.34 \times 10^{-9}/6.5 \times 10^{-14} = 144{,}000$, "a hundred thousand times
less than the person's tide" (*checked here*, given $\Delta x$). The estimate is an order of magnitude: factors such as
the $\sqrt2$ of two masses each with its own uncertainty belong to chapter 8.6.

"The magnetic part asks more." It can be read by gyroscopes [@Nichols2011], by a gradiometer in motion
[@BraginskyCavesThorne1977; @MashhoonPaikWill1989], by light sent both ways round a loop [@Frauendiener2020], and
through an interferometer's response at first order in its arm length over the wavelength [@BaskaranGrishchuk2004]
(all *stated in the paper*). Near slow matter it is "smaller than the electric part by $v/c$" (*read now, derived in
Part 7*). The paper's equation (9), from Section IV, gives its size; chapter 7.5 derives it, and we take it as given:

{{paper eq:magnetic-point}}

Here $\hat n$ is the direction from the pixel to a mass $\matter M$ at the distance $r$, and $\vect v$ is the mass's
velocity, in metres per second. Chapter 1.5's stretch problem found from it that
$|\curv{\tB}|/|\curv{\tE}| = \sqrt3\,v_\perp/c$, where $v_\perp$ is the speed across the line of sight. For a person
walking at $1.4\unit{m\,s^{-1}}$ this is $8.1 \times 10^{-9}$. The bracket has the eigenvalue $v_\perp$ on the
direction halfway between $\hat n$ and $\hat n\times\vect v$, so the largest eigenvalue of $\curv{\tB}$ is
$3G\matter Mv_\perp/cr^3$ (*checked here*, given equation (9)).

The paragraph ends: "The waves of moving bodies and the thermal glow ask far more again, and the glow asks for
something that no matter can supply." Both claims are *stated in the paper* here, and
[Section IX](/paper/#sec:first-image) and reading chapter R10 explain them.

## The Earth's own tide is subtracted, and its magnetic part weighs the core

The paragraph [*The Earth's own tide*](/paper/#par:the-earths-own-tide) starts with the largest tide on the ground.
For a pixel anywhere on the ground we use the Earth's mean radius, $R = 6.371 \times 10^6\unit{m}$, with
$G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$:

$$\begin{aligned}\frac{2G\matter M}{R^3} &= \frac{2 \times 3.986 \times 10^{14}}{(6.371 \times 10^6)^3}\unit{s^{-2}}\\ &= 3.08 \times 10^{-6}\unit{s^{-2}},\end{aligned}$$

the paper's "$3.1\times10^{-6}$" along the vertical, the 330 times the person's stretch found above
([1.4](/tutorial/newton/tides/#on-the-ground-the-earths-own-tide-is-far-larger-but-steady), *checked here*). It is
steady and known, so it is subtracted, as the empty room is in [Section IV](/paper/#sec:near-field) (reading chapter
R2): "the rooms of this paper are what remains, or rooms in free fall far from any planet". The second kind is 1.4's
falling box.

A pixel at rest on the equator moves with the ground. For this pixel we use the equatorial radius,
$R = 6.378 \times 10^6\unit{m}$, in every formula that follows
([1.1](/tutorial/newton/vectors-and-indices/#the-ground-at-the-equator), *checked here*):

$$\begin{aligned}\Omega R &= 7.292 \times 10^{-5}\unit{s^{-1}} \times 6.378 \times 10^6\unit{m}\\ &= 465\unit{m\,s^{-1}}.\end{aligned}$$

Here $\Omega$ is the planet's own spin. The pixel's motion and the planet's spin each give the pixel a small magnetic
part, of opposite signs, and the paper gives their sum as

$$\frac{3G\matter M\Omega}{cR^2}\Bigl(1 - \frac{I}{\matter MR^2}\Bigr).$$

Here $c$ is the speed of light and $\sym{moment-of-inertia}{I}$ is the planet's moment of inertia, in
$\mathrm{kg\,m^2}$. The units check: $G\matter M\Omega/cR^2$ is $\mathrm{m^3\,s^{-2}} \times \mathrm{s^{-1}}$ divided
by $\mathrm{m\,s^{-1}} \times \mathrm{m^2}$, which is $\mathrm{s^{-2}}$. The 1 in the bracket is the pixel's motion:
the ground carries the pixel across the line to the Earth's centre at $v = \Omega R$, at the distance $r = R$, and
equation (9) then gives $3G\matter Mv/cr^3 = 3G\matter M\Omega/cR^2$. The second term comes from the field of the
planet's spin, which Section IV calls its spin dipole (*read now, derived in Part 7*, chapter 7.5). The Earth's measured
$I/\matter MR^2$ is 0.3307, which the paper rounds to 0.331 in Section IV (1.6). The factor in front is

$$\begin{aligned}\frac{3G\matter M\Omega}{cR^2} &= \frac{3 \times 3.986 \times 10^{14} \times 7.292 \times 10^{-5}}{3.00 \times 10^8 \times (6.378 \times 10^6)^2}\unit{s^{-2}}\\ &= 7.15 \times 10^{-12}\unit{s^{-2}},\end{aligned}$$

and multiplying it by $1 - 0.3307 = 0.669$ gives $4.78 \times 10^{-12}\unit{s^{-2}}$, the paper's "$4.8\times10^{-12}$"
(*checked here*, given the formula). It is about a two-thousandth of the person's stretch.

The paper compares it with "the magnetic part of a person walking past a metre away at $1.4\unit{m\,s^{-1}}$". By
equation (9), that is $3G\matter Mv/cr^3$ along its largest axis, with $v$ the walking speed:

$$\begin{aligned}\frac{3G\matter Mv}{cr^3} &= \frac{3 \times 6.674 \times 10^{-11} \times 70 \times 1.4}{3.00 \times 10^8 \times 1^3}\unit{s^{-2}}\\ &= 6.54 \times 10^{-17}\unit{s^{-2}}.\end{aligned}$$

The ratio is $4.78 \times 10^{-12}/6.54 \times 10^{-17} = 73{,}100$, the paper's "seventy thousand times" (*checked
here*, given the formula).

The paragraph closes with a measurement: "one pixel on the ground reads $I/\matter MR^2$, the number that tells a planet
with a core from one without". The mass, the rate and the radius are known, so the only unknown in the formula is
$I/\matter MR^2$. Chapter [1.6](/tutorial/newton/motion/#the-moment-of-inertia-tells-a-cored-planet-from-a-uniform-one)
showed what that number holds: 0.4 for a uniform ball, 0.3307 for the Earth, and, with a core of radius 3480 km, a core
of $12{,}500\unit{kg\,m^{-3}}$ inside a mantle of $4150\unit{kg\,m^{-3}}$ (*checked here*). The steady pull outside
cannot show it, by the shell theorem of 1.3.

The section's last paragraph joins the two parts into one complex table, $\curv{\mathcal W} = \curv{\tE} +
i\curv{\tB}$, and sends the reader to [Section VIII](/paper/#sec:one-pixel) to see how much one pixel can read from it
(*read now, derived in Part 9*, chapter 9.3).[^W]

## The ledger: Part 1 derives two of the five equations, and Part 7 adds the rest

Of Section II's five numbered equations, the reader can now derive two, and understand a third in its Newtonian limit.

| Equation | What it says | After Part 1 | Where it is derived |
|---|---|---|---|
| [](/paper/#eq:tidal) | the tide is $c^2R_{0i0j}$ | understood through its limit (3) | 7.2 |
| [](/paper/#eq:deviation) | free balls move by $-\curv{\tE}_{ij}\xi^j$ | derived (Newtonian form) | 1.4; 7.2 in relativity |
| [](/paper/#eq:newton) | near slow matter, the Hessian of $\field\Phi$ | derived | 1.4 |
| [](/paper/#eq:wave) | in a wave, $-\tfrac12\partial_t^2h^{\rm TT}_{ij}$ | read, used for the convention of $h$ | 7.6 |
| [](/paper/#eq:magnetic) | the magnetic part $\curv{\tB}_{ij}$ | read | 7.5 |

Every number of the section is now checked. Three of them, the quantum limit's $6.5 \times 10^{-14}\unit{s^{-2}}$,
the Earth's magnetic part and the factor 73,100, are checked given a formula that a later part derives.

Reading chapter R7 reads Section II again after Part 7. It adds equation (1) and geodesic deviation in relativity (7.2);
the trace as $c^2R_{00}$ (7.3); equation (5), its antisymmetric part, Section IV's equation
[](/paper/#eq:magnetic-point) and the Earth's formula (7.5); and equation (4), with the factor 2 in the strain and the
45° between the two parts (7.6). The quantum limit waits for chapter 8.6, and $\curv{\mathcal W}$ for chapter 9.3.

::: check
### Q

Which of the paper's two strains for the swaying person, $7 \times 10^{-11}$ or $3 \times 10^{-15}$, belongs to the
real LIGO, and why is it so much smaller?

### A

The $3 \times 10^{-15}$. The tide formula assumes a detector much smaller than its distance from the person. LIGO's
arms are 4 km long, so the person pulls on only the nearest mirror, and the swing of that one mirror is divided by
4 km. The $7 \times 10^{-11}$ belongs to a small detector, counted as for a wave.

### Q

How large is the trace of the tide inside a pixel of water, compared with the person's stretch, and why can a pixel in
empty space never read it?

### A

$4\pi G\matter\rho = 8.4 \times 10^{-7}\unit{s^{-2}}$, ninety times the person's $9.34 \times 10^{-9}\unit{s^{-2}}$.
The trace measures the density at the pixel's own place and nothing else, so in empty space it is zero, however much
matter lies nearby.

:::

**The idea to keep: Section II's Newtonian half, the ring, the person, the lorry, the Earth's tide, the turning frame
and the five numbers, follows from Part 1, and every one of its numbers can be recomputed by hand. What remains, the
tide as curvature, the waves and the twisting magnetic part, belongs to Part 7.**

::: problems
### Practice

Rerun Section II's chain for a person of 90 kg at 2 m who sways by 10 cm once a second. Find the stretch, its change,
the strain of one free arm of a small detector, and the paper's $h$.

::: solution
The stretch is $2G\matter M/r^3 = 2 \times 6.674 \times 10^{-11} \times 90/2^3\unit{s^{-2}} = 1.50 \times
10^{-9}\unit{s^{-2}}$. Its relative change is $3\,\delta r/r = 3 \times 0.1/2 = 0.15$, the same as in the paper, so the
change is $2.25 \times 10^{-10}\unit{s^{-2}}$. One arm changes by $2.25 \times 10^{-10}/39.5 = 5.7 \times 10^{-12}$,
and the paper's $h$ is twice that, $1.1 \times 10^{-11}$. These are about five and eleven billion times $10^{-21}$.
:::

### Stretch

A pixel at rest on the equator turns with the Earth, so its axis of turning points north, along the ground. The person
stands 1 m to the east. Using chapters 1.4 and 1.6, find the three eigenvalues of what the turning pixel reads, along
east, north and up, once the Earth's own tide has been subtracted, and their sum. What density of matter would a pixel
need to read that sum from a real tide?

::: solution
The person's table, along east, north and up, is $(-9.34, +4.67, +4.67) \times 10^{-9}\unit{s^{-2}}$ (chapter 1.4).
The pseudo-tide is $-\obs\Omega^2 = -5.32 \times 10^{-9}\unit{s^{-2}}$ along each direction across the axis, east and
up, and zero along it, north (chapter 1.6). The sums are $-1.47 \times 10^{-8}$ east, $+4.67 \times 10^{-9}$ north and
$-6.5 \times 10^{-10}\unit{s^{-2}}$ up: the vertical squeeze has become a slight stretch. The three add up to
$-1.06 \times 10^{-8}\unit{s^{-2}} = -2\obs\Omega^2$. The Earth's own tide, 300 times larger, would not change the
sum, because it is trace-free. A real tide has the trace $4\pi G\matter\rho$, so it would need
$\matter\rho = -2\obs\Omega^2/4\pi G = -12.7\unit{kg\,m^{-3}}$, a negative density. The trace gives the turning
away.
:::

### The paper

Reproduce the four numbers of the paragraph *The Earth's own tide*: $3.1 \times 10^{-6}\unit{s^{-2}}$,
$465\unit{m\,s^{-1}}$, $4.8 \times 10^{-12}\unit{s^{-2}}$ (with $I/\matter MR^2 = 0.3307$ and the formula stated in the
paper) and "seventy thousand", taking the person's magnetic part as $3G\matter Mv/cr^3$ from the paper's
equation [](/paper/#eq:magnetic-point).

::: solution
The mean radius gives $2G\matter M/R^3 = 3.08 \times 10^{-6}\unit{s^{-2}}$. The equatorial radius, used for the
pixel on the equator, gives $\Omega R = 465\unit{m\,s^{-1}}$ and $3G\matter M\Omega/cR^2 = 7.15 \times
10^{-12}\unit{s^{-2}}$, which times $0.669$ is $4.78 \times 10^{-12}\unit{s^{-2}}$. The walking person gives
$6.54 \times 10^{-17}\unit{s^{-2}}$, and the ratio is 73,100. The last section shows each step.
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
  magnetic part that reads $I/\matter MR^2$, with equation [](/paper/#eq:magnetic-point) from
  [Section IV](/paper/#sec:near-field).
- [*One complex matrix*](/paper/#par:one-complex-matrix), in Section VIII, takes up $\curv{\mathcal W}$ from the
  section's last paragraph.
:::

::: deeper
- The [GR course, section 10.1](https://neovand.github.io/general-relativity/chapter-10.html#10-1-one-falling-astronaut-is-not-enough)
  starts, as Section II does, with one falling astronaut, and
  [section 10.9](https://neovand.github.io/general-relativity/chapter-10.html#10-9-how-much-curvature-is-outside-your-window)
  computes the Earth's tide, $3.08 \times 10^{-6}\unit{s^{-2}}$, from curvature.
- The GR course's [appendix A.9](https://neovand.github.io/general-relativity/appendix-a.html#a-9-newtonian-tides-know-the-sign-convention)
  fixes the sign conventions of $\curv{\tE}$, and
  [appendix A.20](https://neovand.github.io/general-relativity/appendix-a.html#a-20-gravitational-wave-strain-is-a-relative-measurement)
  explains why a wave's strain is a relative measurement.
- The [GR course, section 18.4](https://neovand.github.io/general-relativity/chapter-18.html#18-4-but-the-particles-do-not-move-in-tt-coordinates-exactly)
  shows what a detector reads in the coordinates of equation (4), for reading chapter R7.
:::

[^free]: LIGO's mirrors hang from pendulums whose own swings lie near 1 Hz, so at a sway of once a second a free mirror
    is an idealization, as it is in the paper (1.4).

[^riemann]: The paper writes the Riemann tensor's sign convention as $R^\alpha{}_{\beta\gamma\delta} =
    \partial_\gamma\Gamma^\alpha_{\beta\delta} - \dots$, where the $\Gamma$ are the Christoffel symbols of chapter
    [7.1](/tutorial/geometry/metric/#free-bodies-follow-geodesics-and-the-christoffel-symbols-hold-newtons-pull). With
    it, a stretch is a negative entry, as in 1.4.

[^lorry]: A lorry of 20 tonnes at 10 m makes a stretch of $2G\matter M/r^3 = 2.7 \times 10^{-9}\unit{s^{-2}}$, about
    a third of the person's at 1 m.

[^turned]: Chapter [1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero) shows,
    with complex numbers, that the imaginary part of a wave's complex table is its real part turned by 45°.

[^sqrt]: Chapter 3.1 shows that the noise of an average falls as the square root of the reading time. By that rule
    the atom gradiometer's $20\unit{E}$ in ten minutes is about $20\sqrt{600} = 490\unit{E}$ in one second, 25,000
    times the superconducting one's.

[^W]: Chapter [1.5b](/tutorial/newton/complex-numbers/#complex-vectors-a-direction-whose-square-is-zero) builds
    $\curv{\mathcal W}$ for a plane wave.
