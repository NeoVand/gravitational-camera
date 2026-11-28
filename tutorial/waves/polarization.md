---
id: '5.4'
title: 'Polarization and the Stokes parameters'
question: 'A rotor sealed in a box is a single point in its own waves. How can one unresolved wave carry the sense in which its source turns, and the tilt of its axis?'
part: '5'
requires: ['1.4', '1.5', '1.5b', 'R1', '2.3', '5.1', '5.2']
paper: [sec:waves, eq:quadrupole, eq:rotor-amplitudes, eq:circular, eq:dumbbell, eq:wave, fig:quadrupole, fig:polarization, fig:rotor-views, fig:which-way, sec:thermal, sec:one-pixel]
figures: [fig:quadrupole, fig:polarization, fig:which-way, fig:rotor-views]
live: [rotor-polarization]
depth: A
---

A rotor, a dumbbell spinning about its middle, is sealed inside a steel box. Its waves are millions of times longer
than the box, so no camera can resolve it: in its own waves the rotor is a single point (section
[0.3](/tutorial/evening/waves-and-heat/#a-slow-body-is-far-smaller-than-its-waves-so-it-is-a-point)). Yet consider what
a ring of free balls feels as the wave passes. Seen along the rotor's axis, the pattern of stretch and squeeze turns
round and round, as the rotor does. Seen edge-on, it only pulses back and forth along fixed directions, and it carries
eight times less power. How does one unresolved wave carry the sense of turning of its
source?

The answer lies in the two patterns of stretch that make up every gravitational wave, and in the timing between them.
Of the four Stokes parameters that describe the wave, two do not change when the camera's axes turn.

::: plain
A gravitational wave changes the shape of a ring of free balls across its path in two basic ways. In the first, the
ring is stretched along one line and squeezed along the line at right angles to it. In the second, the same happens
along two lines turned by 45°. Every wave is a mixture of these two patterns, each growing and shrinking with time.

If the two patterns rise and fall together, the stretch pulses along one fixed line. If one is at its largest when the
other is zero, a quarter of a cycle later, the line of stretch goes round and round. A rotor seen along its axis makes
this second kind of wave, turning the same way as the rotor; seen from the side, it makes the first kind.

The amounts of the two patterns depend on how the camera holds its axes, but two combinations do not: the total strength
of the wave, and its part that turns anticlockwise minus its part that turns clockwise. Their ratio tells the camera
which way the rotor turns and how far its axis is tilted.
:::

## A wave across the line of sight has two patterns of stretch

The wave travels along a unit vector
$\sym{wave-direction}{\hat n}$, which here points from the source toward the camera (section
[5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source)).[^n] Across it we
take two unit vectors $\vect e_1$ and $\vect e_2$ at right angles, with $\vect e_1\times\vect e_2 = \hat n$. The camera
faces the source, so $\hat n$ points out of the page toward the viewer, and $\vect e_2$ lies a quarter turn
anticlockwise from $\vect e_1$, as $y$ lies from $x$ in section
[1.5b](/tutorial/newton/complex-numbers/#a-tide-across-a-direction-is-one-complex-number-and-turning-the-axes-turns-it-back-by-twice-the-angle).

A gravitational wave is **transverse**, its effect lying across its direction of travel:
its strain $\field h^{\rm TT}_{ij}$, the table of pure numbers that measures how much it stretches distances (section
[5.1](/tutorial/waves/wave-equation/#a-shear-in-a-solid-travels-and-its-law-is-the-wave-equation)), has zeros in the row
and column of $\hat n$ and no trace, the part that the projector $\Lambda_{ij,kl}(\hat n)$ of section 5.2 keeps. By
section [1.5](/tutorial/newton/five-numbers/#across-a-wave-two-numbers-are-left-and-a-turn-of-45-swaps-them), a
symmetric trace-free table in a plane holds two numbers. So in the axes $\vect e_1$, $\vect e_2$, $\hat n$ the strain at
the time $t$ is

$$\begin{gathered}
\field h^{\rm TT}_{ij}(t) = \field h_+(t)\,e^+_{ij} + \field h_\times(t)\,e^\times_{ij},\\ e^+ = \begin{pmatrix} 1 & 0 &
0\\ 0 & -1 & 0\\ 0 & 0 & 0\end{pmatrix}, \qquad e^\times = \begin{pmatrix} 0 & 1 & 0\\ 1 & 0 & 0\\ 0 & 0 &
0\end{pmatrix}. \end{gathered} \label{eq:two-patterns}$$

Here $\sym{strain-polarizations}{\field h_+(t)}$ and $\field h_\times(t)$ are the strains of the wave's two patterns, and
$\sym{polarization-tensors}{e^+_{ij}}$ and $e^\times_{ij}$ are fixed tables, all pure numbers. The largest values of the
strains over a cycle, written without the $(t)$, are the two **polarization amplitudes** $\field h_+$ and $\field h_\times$. The **plus pattern** $e^+$ stretches the ring along $\vect e_1$ and squeezes it along $\vect e_2$. The
**cross pattern** $e^\times$ does the same along the two diagonals, so it is the plus pattern turned by 45°. Each table
has $e^A_{ij}e^A_{ij} = 2$ (no sum over $A$, which names the pattern), the normalization used throughout, and
$e^+_{ij}e^\times_{ij} = 0$. That a gravitational wave has these two patterns and no others is derived in section
[7.6](/tutorial/geometry/gravitational-waves/#of-the-ten-amplitudes-of-a-plane-wave-two-are-physical).

**How the ring moves.** In a wave the tide is the strain's acceleration (section
[R1](/tutorial/newton/reading-section-ii/#near-slow-matter-the-tide-is-the-hessian-and-in-a-wave-it-is-the-strains-acceleration)),
so a ball at the small separation $\vect\xi$ from the centre of the ring is moved by $\delta\xi_i = \tfrac12\field
h^{\rm TT}_{ij}\xi_j$. Take the ball in the direction $\hat\xi = \cos\varphi\,\vect e_1 + \sin\varphi\,\vect e_2$. Its
outward movement, per metre of its distance from the centre, is $\tfrac12\hat\xi_i\field h^{\rm TT}_{ij}\hat\xi_j$, and
the double-angle algebra of section 1.5b gives

$$\begin{aligned}
\tfrac12\hat\xi_i\field h^{\rm TT}_{ij}\hat\xi_j &= \tfrac12\bigl(\field h_+(t)\cos2\varphi + \field h_\times(t)\sin2\varphi\bigr)\\
&= \tfrac12\bigl|\field h_+(t) + i\field h_\times(t)\bigr|\\
&\qquad\times\cos\bigl(2\varphi - \arg\bigl(\field h_+(t) + i\field h_\times(t)\bigr)\bigr).
\end{aligned}$$

So one complex number, $\field h_+(t) + i\field h_\times(t)$, holds the pattern. The stretch is largest along the
direction at the angle $\varphi = \tfrac12\arg(\field h_+(t) + i\field h_\times(t))$ from $\vect e_1$, and the squeeze
at right angles to it. When the axes turn anticlockwise by $\theta$, the two strains obey the rule of section 1.5b for a
tide across a direction:

$$\field h'_+(t) + i\field h'_\times(t) = e^{-2i\theta}\,\bigl(\field h_+(t) + i\field h_\times(t)\bigr). \label{eq:h-turn}$$

The number has spin two: a turn of 45° makes a plus pattern into a cross pattern (Figure [](#fig:pol-patterns)).

![The two patterns of a gravitational wave on a ring of free balls, the wave travelling out of the page toward the
reader. Look first at the orange arrows: in the plus pattern (left) they lie along $\vect e_1$, in the cross pattern
(right) along the diagonal, a turn of 45°. Orange marks a ball that has moved outward, blue one that has moved inward.
The strain is exaggerated about $10^{20}$ times beyond LIGO's.](tut-pol-patterns){#fig:pol-patterns}

## Two oscillations a quarter cycle apart make a pattern that turns

What does the pattern on the ring do during one cycle when both patterns are present? That motion is the polarization
of the wave. We assume **a steady wave of one angular frequency** $\omega$ at the camera. Each
strain is then the real part of a turning complex number (section
[1.5b](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number)), with the time dependence
$e^{-i\omega t}$:

$$\field h_+(t) = \mathrm{Re}\bigl[\tilde{\field h}_+e^{-i\omega t}\bigr], \qquad \field h_\times(t) = \mathrm{Re}\bigl[\tilde{\field h}_\times e^{-i\omega t}\bigr].$$

The fixed complex numbers $\sym{strain-phasors}{\tilde{\field h}_+}$ and $\tilde{\field h}_\times$ are the **phasors**,
whose sizes are the amplitudes and whose arguments are the phases.

Take first two strains a quarter of a cycle apart,

$$\field h_+(t) = a\cos\omega t, \qquad \field h_\times(t) = b\sin\omega t ,$$

where $a \ge 0$ and $b$ are pure numbers. Their phasors are $\tilde{\field h}_+ = a$ and $\tilde{\field h}_\times = ib$,
because $\mathrm{Re}[ib\,e^{-i\omega t}] = b\sin\omega t$: the factor $i$ is the quarter cycle. Euler's formula,
$\cos\omega t = \tfrac12(e^{i\omega t} + e^{-i\omega t})$ and $i\sin\omega t = \tfrac12(e^{i\omega t} - e^{-i\omega t})$,
puts the complex number of the last section in the form

$$\begin{aligned}
\field h_+(t) + i\field h_\times(t) &= a\cos\omega t + ib\sin\omega t\\
&= \tfrac12(a + b)\,e^{i\omega t} + \tfrac12(a - b)\,e^{-i\omega t}.
\end{aligned} \label{eq:circles}$$

The first term goes anticlockwise round a circle of radius $\tfrac12|a + b|$ in the complex plane, and the second
clockwise round a circle of radius $\tfrac12|a - b|$, both once per cycle. What the pattern does depends on the two
radii.

- **Equal amplitudes, $b = a$.** The second circle vanishes and $\field h_+(t) + i\field h_\times(t) = a\,e^{i\omega t}$.
  The size of the pattern stays $a$, and its phase grows steadily, so the stretch axis, at half the phase, turns
  anticlockwise at the rate $\omega/2$. This is **circular polarization**, a pattern that turns round at a steady size
  (Figure [](#fig:pol-instants), top). With $b = -a$ it turns clockwise instead.
- **One amplitude alone, $b = 0$.** The number $a\cos\omega t$ is real. It swings from $a$ to $-a$ and back, so the
  stretch lies along $\vect e_1$ for half the cycle and along $\vect e_2$ for the other half, passing through zero
  between. This is **linear polarization**, a pattern that pulses along fixed directions. The two circles are then
  equal, and so they are when $a = 0$.
- **Anything between.** The point $(\field h_+(t), \field h_\times(t))$ goes round an ellipse with semi-axes $a$ and
  $|b|$. This is **elliptical polarization**. The pattern still turns, but its size swells and shrinks, and its axis
  turns fastest where the pattern is smallest.[^uneven]

Whenever $a$ and $b$ are both non-zero, one circle is larger, and the phase of $\field h_+(t) + i\field h_\times(t)$
changes by a whole turn per cycle in the sense of the larger circle: anticlockwise when $b > 0$, clockwise when $b < 0$.
The stretch axis then turns by half a turn per cycle on average, which brings a spin-two pattern back to itself. This
sense is the wave's **sense of turning**, or **handedness**, always stated as the camera facing the source sees it. A
linear wave has none: its phase only jumps between 0 and a half turn.

![Eight instants of one cycle of a wave travelling toward the reader. Look first at the orange bar, the line of
strongest stretch. Top: the two patterns are equal and a quarter cycle apart, and the bar turns anticlockwise at a
steady length, half a turn per cycle (circular polarization). Bottom: the plus pattern alone, and the bar only grows,
vanishes and reappears across its first direction (linear polarization). Orange marks stretch, blue squeeze; the strain
is exaggerated.](tut-pol-instants){#fig:pol-instants}

## Projecting a turning quadrupole onto the sky gives the two amplitudes of a rotor

We want the two amplitudes of the rotor's wave seen from any direction, because the direction of view holds the sense
of turning and the tilt. We assume that **the rotor is compact**, much smaller than its wavelength, and that **the
camera is in its wave zone**, many reduced wavelengths away (section 5.2). For such a source Einstein's quadrupole
formula gives the strain far away:

$$\field h^{\rm TT}_{ij}(t) = \frac{2G}{c^4r}\,\ddot{\matter I}{}^{\rm TT}_{ij}\Bigl(t - \frac rc\Bigr). \label{eq:quadrupole-strain}$$

Here $\sym{second-moment}{\matter I_{ij}}(t) = \int\matter\rho\,x_ix_j\,\dd V$ is the source's second moment (section
[2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)),
in $\mathrm{kg\,m^2}$, measured from its centre of mass; the two dots are two time derivatives; $r$ is the distance from
the source; and TT means the part across the line of sight with no trace, which the projector of section 5.2 keeps.
The argument $t - r/c$ is the retarded time of section 5.2. Section 7.7 derives this result; here we derive only how the
wave depends on the direction of view.[^quad]

**The rotor's turning table.** Two point masses $\matter m$, a distance $d$ apart on a light rod, turn about the $z$ axis
through their middle at the angular velocity $\Omega$, in radians per second, anticlockwise as seen from the side toward
which $z$ points. So the rotor's spin points along $+z$. We start the clock when the rod lies along the $y$ axis, so that
the masses stand at $\pm\tfrac d2(-\sin\Omega t, \cos\Omega t, 0)$.[^clock] Each mass adds $\matter m\,x_ix_j$ to the
second moment, and the double-angle formulas give, in the $xy$ plane,

$$\begin{aligned}
\matter I_{xx} &= \frac{\matter m d^2}{4}(1 - \cos2\Omega t),\\
\matter I_{yy} &= \frac{\matter m d^2}{4}(1 + \cos2\Omega t),\\
\matter I_{xy} &= -\frac{\matter m d^2}{4}\sin2\Omega t .
\end{aligned}$$

The constant part sends no wave; the rest turns with the rod. We call $\sym{moment-difference}{\matter{\Delta I}}$ the difference between the two principal second
moments in the plane of rotation, in $\mathrm{kg\,m^2}$: along the rod it is $\tfrac12\matter md^2$, across it zero, so
$\matter{\Delta I} = \tfrac12\matter md^2$.[^inertia] The turning part of the table is then

$$\begin{aligned}
\matter I^{\rm turn} &= -\tfrac12\matter{\Delta I}\begin{pmatrix}\cos2\Omega t & \sin2\Omega t\\ \sin2\Omega t &
-\cos2\Omega t\end{pmatrix},\\ \ddot{\matter I}{}^{\rm turn} &= 2\matter{\Delta I}\,\Omega^2\begin{pmatrix}\cos2\Omega t
& \sin2\Omega t\\ \sin2\Omega t & -\cos2\Omega t\end{pmatrix}, \end{aligned} \label{eq:turning}$$

because two time derivatives of $\cos2\Omega t$ or $\sin2\Omega t$ give $-4\Omega^2$. The table repeats after half a
turn of the rod, so the wave has the angular frequency $\omega = 2\Omega$.

**The view from the camera.** The **inclination** $\sym{inclination}{\iota}$ is the angle between the rotor's spin and
the direction $\hat n$ from the rotor to the camera. We put the camera in the $xz$ plane (Figure [](#fig:pol-geometry)):

$$\begin{gathered}
\hat n = (\sin\iota,\ 0,\ \cos\iota),\\
\vect e_1 = (\cos\iota,\ 0,\ -\sin\iota), \qquad \vect e_2 = (0,\ 1,\ 0).
\end{gathered}$$

Indeed $\vect e_1\times\vect e_2 = (\sin\iota, 0, \cos\iota) = \hat n$. The spin's shadow on the sky, the part of $\hat z$ across $\hat n$, is $\hat z - \cos\iota\,\hat
n = -\sin\iota\,\vect e_1$, so $\vect e_1$ lies along the line of that shadow.

![Where the camera stands. Look first at the angle $\iota$ between the spin, along $z$, and the line $\hat n$ from the
rotor to the camera, which lies in the $xz$ plane. The camera's axes $\vect e_1$ and $\vect e_2$ lie across $\hat n$,
with $\vect e_1\times\vect e_2 = \hat n$; the spin's shadow on the sky, $-\sin\iota\,\vect e_1$, lies along $\vect e_1$.
Drawn at $\iota = 50°$; the rotor is schematic.](tut-pol-geometry){#fig:pol-geometry}

The components of $\ddot{\matter I}$ across the line of sight are its contractions with these axes, $\ddot{\matter
I}_{11} = e_{1i}\ddot{\matter I}_{ij}e_{1j}$ and so on. Only the $xy$ block is not zero, and $\vect e_1$ has the
components $\cos\iota$ along $x$ and 0 along $y$, so

$$\ddot{\matter I}_{11} = \cos^2\iota\,\ddot{\matter I}_{xx}, \quad \ddot{\matter I}_{22} = \ddot{\matter I}_{yy}, \quad \ddot{\matter I}_{12} = \cos\iota\,\ddot{\matter I}_{xy}.$$

Removing the trace leaves $\pm\tfrac12(\ddot{\matter I}_{11} - \ddot{\matter I}_{22})$ on the diagonal and $\ddot{\matter
I}_{12}$ off it. Comparing with [](#eq:two-patterns), $\field h_+(t)$ is $2G/c^4r$ times the first and $\field
h_\times(t)$ is $2G/c^4r$ times the second:

$$\field h_+(t) = \frac{G}{c^4r}\bigl(\ddot{\matter I}_{11} - \ddot{\matter I}_{22}\bigr), \qquad \field h_\times(t) = \frac{2G}{c^4r}\,\ddot{\matter I}_{12}.$$

We put in [](#eq:turning). The difference is $2\matter{\Delta I}\Omega^2\cos2\Omega t\,(\cos^2\iota + 1)$ and the entry off
the diagonal is $2\matter{\Delta I}\Omega^2\cos\iota\,\sin2\Omega t$, both at the retarded time. With
$\sym{rotor-amplitude}{\field A} = 4G\matter{\Delta I}\,\Omega^2/c^4r$, a pure number,[^units] this is

$$\boxed{\;\begin{aligned}
\field h_+ &= \field A\,\frac{1 + \cos^2\iota}{2}, \qquad \field h_\times = \field A\cos\iota,\\
\field h_+(t) &= \field h_+\cos2\Omega\Bigl(t - \frac rc\Bigr),\\
\field h_\times(t) &= \field h_\times\sin2\Omega\Bigl(t - \frac rc\Bigr).
\end{aligned}\;} \label{eq:rotor}$$

**A number.** For two 1 kg masses 1 m apart turning sixteen times a second, $\matter{\Delta I} = 0.5\unit{kg\,m^2}$ and
$\Omega = 100.5\unit{s^{-1}}$. At the distance of the Moon the face-on strain is $\field A = 4.3 \times 10^{-49}$, about
$4 \times 10^{-28}$ of the strain of $10^{-21}$ that LIGO detects.

**Limits.** Face-on, $\iota = 0$, both amplitudes are $\field A$, a quarter cycle apart, so by [](#eq:circles) the wave
is circularly polarized and turns anticlockwise, as the rotor does. Edge-on, $\iota = 90°$, $\field h_\times = 0$ and
$\field h_+ = \tfrac12\field A$: the wave is linearly polarized, at half the face-on amplitude. At $\iota = 180°$,
$\field h_\times = -\field A$ and the pattern turns clockwise, as the rotor then appears to.

**What it means.** The camera sees the turning table foreshortened (Figure [](#fig:pol-rotor-views)): the part along the
spin's shadow shrinks by $\cos\iota$, so the cross amplitude falls as $\cos\iota$ and the plus amplitude, which has a
part across the shadow too, falls only to a half.

![A rotor seen from three directions. Look first at the lower row: the point $(\field h_+, \field h_\times)$ goes round a
circle face on, an ellipse at 60° and to and fro along a line edge on. Its semi-axes are $(1 + \cos^2\iota)/2$ and
$\cos\iota$ in units of $\field A$, and it goes round in the sense in which the camera sees the rotor turn. The upper row
shows the turning pair foreshortened by the tilt, and the spin's shadow on the sky; the rotor is schematic. The magenta
fill deepens with $V/I$, printed under each.](tut-pol-rotor-views){#fig:pol-rotor-views}

## Four numbers describe a polarization, and two of them do not depend on the axes

The amplitudes and phases describe the wave fully, but they depend on how the camera holds its axes, and an unresolved
rotor offers no axes of its own. We want numbers that change in the simplest possible way when the axes turn.

**The two circular parts.** We split any steady wave into two circles, as [](#eq:circles) did for one timing. Writing
$\mathrm{Re}\,z = \tfrac12(z + z^*)$ and collecting the terms in $e^{-i\omega t}$ and $e^{i\omega t}$,

$$\begin{aligned}
\field h_+(t) + i\field h_\times(t) &= \tfrac12\bigl(\tilde{\field h}_+ + i\tilde{\field h}_\times\bigr)e^{-i\omega t} + \tfrac12\bigl(\tilde{\field h}_+^* + i\tilde{\field h}_\times^*\bigr)e^{i\omega t}\\
&= \tilde{\field h}_{\rm c}\,e^{-i\omega t} + \tilde{\field h}_{\rm a}^*\,e^{i\omega t},
\end{aligned}$$

with

$$\tilde{\field h}_{\rm a} = \tfrac12\bigl(\tilde{\field h}_+ - i\tilde{\field h}_\times\bigr), \qquad \tilde{\field h}_{\rm c} = \tfrac12\bigl(\tilde{\field h}_+ + i\tilde{\field h}_\times\bigr). \label{eq:helicities}$$

The second term turns anticlockwise in the complex plane with the size $|\tilde{\field h}_{\rm a}|$, and the first
clockwise with the size $|\tilde{\field h}_{\rm c}|$: hence the labels a and c. The anticlockwise part turns as
$e^{+i\omega t}$, so its number appears as a conjugate. These two circular parts are the wave's two
**helicities**.[^helicity] For the strains of [](#eq:circles) they are $\tfrac12(a + b)$ and $\tfrac12(a - b)$, the two
circles found there. The rotor has $a = \field h_+$ and $b = \field h_\times$, and with $\tfrac12(1 + \cos\iota) = \cos^2\tfrac\iota2$ its helicities are

$$\tilde{\field h}_{\rm a} = \field A\cos^4\tfrac\iota2, \qquad \tilde{\field h}_{\rm c} = \field A\sin^4\tfrac\iota2,$$

because $\tfrac12\bigl[\tfrac12(1 + \cos^2\iota) + \cos\iota\bigr] = \tfrac14(1 + \cos\iota)^2$, and the same with
$-\cos\iota$. Face-on only the anticlockwise part is left; edge-on the two are equal, $\tfrac14\field A$ each.

**The turn of the axes.** By [](#eq:h-turn), a turn of the axes by $\theta$ multiplies $\field h_+(t) + i\field
h_\times(t)$ by $e^{-2i\theta}$ at every instant, and so each of its two terms: $\tilde{\field h}'_{\rm c} =
e^{-2i\theta}\tilde{\field h}_{\rm c}$ and $\tilde{\field h}'^*_{\rm a} = e^{-2i\theta}\tilde{\field h}^*_{\rm a}$.
Taking the conjugate of the second,

$$\tilde{\field h}'_{\rm a} = e^{2i\theta}\,\tilde{\field h}_{\rm a}, \qquad \tilde{\field h}'_{\rm c} = e^{-2i\theta}\,\tilde{\field h}_{\rm c} . \label{eq:helicity-turn}$$

A turn of the axes changes the phases of the helicities, not their sizes.

**Four numbers.** The two sizes of the helicities give two numbers that no turn can change, and the product of one
with the conjugate of the other records how the two circles line up. The four **Stokes parameters** of a wave are

$$\begin{gathered}
\sym{stokes}{I} = 2\bigl(|\tilde{\field h}_{\rm a}|^2 + |\tilde{\field h}_{\rm c}|^2\bigr), \qquad V = 2\bigl(|\tilde{\field h}_{\rm a}|^2 - |\tilde{\field h}_{\rm c}|^2\bigr),\\
Q + iU = 4\,\tilde{\field h}^*_{\rm a}\,\tilde{\field h}_{\rm c},
\end{gathered} \label{eq:stokes-helicity}$$

all four pure numbers, squares of strains.[^letters] The first, $I$, is the total strength of the wave, and $V$ is the anticlockwise part minus the clockwise part, so its
sign gives the sense of turning. The pair $Q$ and $U$ is zero for a circular wave, where one helicity is missing; its
phase fixes the line of strongest stretch.[^line] Multiplying out
(the box below) gives the four in terms of the two polarizations:

$$\begin{aligned}
I &= |\tilde{\field h}_+|^2 + |\tilde{\field h}_\times|^2, &\qquad Q &= |\tilde{\field h}_+|^2 - |\tilde{\field
h}_\times|^2,\\ U &= 2\,\mathrm{Re}\bigl(\tilde{\field h}_+^*\tilde{\field h}_\times\bigr), &\qquad V &=
2\,\mathrm{Im}\bigl(\tilde{\field h}_+^*\tilde{\field h}_\times\bigr). \end{aligned} \label{eq:stokes}$$

The mean square of $\field h_+(t)$ over a cycle is $\tfrac12|\tilde{\field h}_+|^2$, so $I$ is twice the sum of the two
mean squares and $Q$ twice their difference, which a ring can measure over many cycles. The sign of $V$ says which
pattern leads: if the cross pattern does what the plus pattern did a quarter of a cycle earlier, $V = I$, as for the
rotor face-on; if it leads by a quarter cycle, $V = -I$.

::: derivation
### The two forms of the Stokes parameters agree

Write $p = \tilde{\field h}_+$ and $q = \tilde{\field h}_\times$, so that $\tilde{\field h}_{\rm a} = \tfrac12(p - iq)$
and $\tilde{\field h}_{\rm c} = \tfrac12(p + iq)$. For any two complex numbers, $|p \mp iq|^2 = (p \mp iq)(p^* \pm
iq^*) = |p|^2 + |q|^2 \pm i(pq^* - p^*q)$. Since $pq^* - p^*q = -2i\,\mathrm{Im}(p^*q)$, this is $|p|^2 + |q|^2 \pm
2\,\mathrm{Im}(p^*q)$. With the upper sign it is $4|\tilde{\field h}_{\rm a}|^2$, and with the lower sign
$4|\tilde{\field h}_{\rm c}|^2$. Adding and subtracting, and halving, gives $I$ and $V$.

For the third,

$$\begin{aligned}
4\,\tilde{\field h}^*_{\rm a}\tilde{\field h}_{\rm c} &= (p^* + iq^*)(p + iq)\\
&= |p|^2 - |q|^2 + i(p^*q + pq^*),
\end{aligned}$$

and $p^*q + pq^* = 2\,\mathrm{Re}(p^*q)$, which gives $Q$ and $U$.
:::

Now [](#eq:helicity-turn) and [](#eq:stokes-helicity) together give the rule for a turn of the axes. The sizes of the
helicities do not change, so neither do $I$ and $V$. The product $\tilde{\field h}^*_{\rm a}\tilde{\field h}_{\rm c}$
picks up $e^{-2i\theta}$ from each factor:

$$\boxed{\;\begin{gathered}I' = I, \qquad V' = V,\\ Q' + iU' = e^{-4i\theta}\,(Q + iU).\end{gathered}\;} \label{eq:stokes-turn}$$

The pair $(Q, U)$ turns back by four times the angle of the axes. As a check, the wave $\tilde{\field h}_+ =
\tilde{\field h}_\times = 1/\sqrt2$ has $I = U = 1$ and $Q = V = 0$. Its patterns rise and fall together, so the
stretch pulses along the line 22.5° from $\vect e_1$. In axes turned by 22.5° it is a plus wave, with $Q' = 1$; the rule
agrees, since $e^{-i\pi/2}\,i = 1$. So $U$ is $Q$ read in axes turned by 22.5°.

For a single steady wave the four numbers are tied together. By [](#eq:stokes-helicity), $I^2 - V^2 =
16|\tilde{\field h}_{\rm a}|^2|\tilde{\field h}_{\rm c}|^2 = Q^2 + U^2$, so $I^2 = Q^2 + U^2 + V^2$. The point $(Q/I, U/I,
V/I)$ then lies on a sphere of radius 1, **Poincaré's sphere**. Its poles are the two circular polarizations and its
equator the linear ones, and by [](#eq:stokes-turn) a turn of the axes carries the point round the vertical axis by
$-4\theta$ while its height $V/I$ stays (Figure [](#fig:pol-poincare)).

![The Stokes parameters of a fully polarized wave as a point on a sphere of radius 1, $(Q/I, U/I, V/I)$: Poincaré's
sphere. Look first at the small circle near the top: turning the camera's axes by $\theta$ carries the point round the
vertical by $-4\theta$ for a gravitational wave (left) and by $-2\theta$ for light (right), while its height $V/I$ stays. The poles
are the two circular polarizations, the equator the linear ones. The point is the rotor seen at $\iota = 75°$, the turn
$\theta = 22.5°$.](tut-pol-poincare){#fig:pol-poincare}

**Light, for comparison.** The electric field of light across its beam is the complex number $E_1 + iE_2$, which a turn
of the axes multiplies by $e^{-i\theta}$ (section 1.5b). The same algebra multiplies its $Q + iU$ by $e^{-2i\theta}$, so
a turn of 90° reverses $Q$ for light. For a gravitational wave a turn of 45° reverses $Q$, and a turn of 90° changes
nothing.

**When the wave is a mixture.** The glow of a warm body sums waves from many atoms that do not keep in step. Its Stokes
parameters are the forms of [](#eq:stokes) averaged over many cycles, and they obey $I^2 \ge Q^2 + U^2 + V^2$ (see the
stretch problem). A wave with $Q = U = V = 0$ is **unpolarized**: its pattern has no preferred direction and
no preferred sense of turning.

**The rotor.** For the rotor, $\tilde{\field h}^*_+\tilde{\field h}_\times = \field h_+\cdot i\field h_\times$, which is
purely imaginary, so $U = 0$ and $V = 2\field h_+\field h_\times$, while $I = \field h_+^2 + \field h_\times^2$. Their
ratio is

$$\boxed{\;\frac VI = \frac{2\field h_+\field h_\times}{\field h_+^2 + \field h_\times^2}.\;}$$

The ratio $V/I$ is the **degree of circular polarization**, a pure number between $-1$ and $1$: by
[](#eq:stokes-helicity), the anticlockwise power minus the clockwise power, over their sum. It is positive when the
pattern turns anticlockwise as the camera sees it, as for the rotor face-on, where $V = I$.[^circular]

**Numbers.** The ratio $V/I$ is 0.976 at $\iota = 60°$, 0.785 at 75°, one half at 82.2°, 0 edge-on and $-0.976$ at 120°.
Its sign tells the sense of turning from almost any direction, while its size measures the tilt finely only near
edge-on: at 30° it still differs from 1 by only $5 \times 10^{-5}$. Both survive any turn of the camera's axes, which
is why an unresolved rotor is described by $V/I$.

{{paper fig:polarization}}

## The rotor shines eight times less edge-on

How much power does the rotor send in each direction, compared with the power along its axis? A gravitational wave
carries the energy flux

$$F = \frac{c^3}{16\pi G}\,\bigl\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\bigr\rangle ,$$

a power per unit area, in $\mathrm{W\,m^{-2}}$, summed over the two polarizations (section
[5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed) states it; section 7.8 derives
it). In a steady wave, $\dot{\field h}_+ = \mathrm{Re}[-i\omega\tilde{\field h}_+e^{-i\omega t}]$, and the average of the
square of a cosine over a cycle is one half, so $\langle\dot{\field h}_+^2\rangle = \tfrac12\omega^2|\tilde{\field
h}_+|^2$, and the same for $\times$. So

$$F = \frac{c^3\omega^2}{32\pi G}\,I .$$

So $I$ measures the energy that the wave carries. For the rotor, by [](#eq:rotor),

$$\begin{aligned}
I = \field h_+^2 + \field h_\times^2 &= \field A^2\Bigl[\frac{(1 + \cos^2\iota)^2}{4} + \cos^2\iota\Bigr]\\
&= \frac{\field A^2}{4}\bigl(1 + 6\cos^2\iota + \cos^4\iota\bigr),
\end{aligned}$$

since $(1 + \cos^2\iota)^2 = 1 + 2\cos^2\iota + \cos^4\iota$ and the bracket adds $4\cos^2\iota$. Face-on this is
$2\field A^2$, so the power sent toward the angle $\iota$, relative to the power along the axis, is

$$\boxed{\;\frac{F(\iota)}{F(0)} = \frac{1 + 6\cos^2\iota + \cos^4\iota}{8}\;} \label{eq:pattern}$$

at the same distance. This is the rotor's **radiation pattern**, the way its power is shared among directions, drawn in
panel (a) of the figure below.

**Numbers.** Edge-on, $\cos\iota = 0$ and the ratio is $\tfrac18$. Two factors make the eight. The edge-on amplitude is
half the face-on one, which gives a quarter of the power, and only one of the two polarizations is left, which halves it
again. The power falls to half its axial value at $\iota = 47°$, where $\cos^2\iota = \sqrt{12} - 3$. Averaged over all directions, with $x = \cos\iota$ spread evenly between $-1$
and 1 as it is on a sphere,

$$\frac12\int_{-1}^{1}\frac{1 + 6x^2 + x^4}{8}\,\dd x = \frac{2 + 4 + \tfrac25}{16} = \frac25 .$$

So the total power is two fifths of what the rotor would send if it shone everywhere as it does along its axis. The
pattern is the same toward $\iota$ and $180° - \iota$, because a turn of the rotor end over end does not change its
wave's power. The last problem adds the power over a sphere to find the rotor's total power,
$P = \tfrac85G\matter m^2d^4\Omega^6/c^5$.[^power]

{{paper fig:quadrupole}}

## What the wave of a rotor cannot show, and what does not radiate

In the quadrupole formula [](#eq:quadrupole-strain) the source enters only through the part of $\ddot{\matter I}_{ij}$
across the line of sight and free of trace. This settles which motions send waves (sections
[7.6](/tutorial/geometry/gravitational-waves/#a-body-in-steady-motion-sends-no-wave-and-neither-does-an-even-pressure)
and 7.7 derive each case):

- A wheel turning steadily about its own axle keeps the same arrangement of mass, so $\matter I_{ij}$ does not change.
- A sphere that swells and shrinks keeps $\matter I_{ij}$ a multiple of $\delta_{ij}$, which is all trace; so does a
  pressure that is the same in all directions.
- A body moving steadily in a straight line has $\matter I_{ij}$, about a fixed origin, growing as $t^2$. So
  $\ddot{\matter I}_{ij}$ is constant, and so is the strain far away: no wave leaves.

An unresolved rotor shows its sense of turning and the tilt of its axis, and no shape. A uniform rod of mass $\matter M = 2$ kg and length $L = \sqrt3$ m = 1.73 m, turning like the
pair of masses above, has the pair's $\matter{\Delta I}$, $\matter ML^2/12 = 0.5\unit{kg\,m^2}$, so [](#eq:rotor) gives
the two the same wave in every direction. Their arrangements of mass differ first in the fourth moment along the rod, $\int\matter\rho\,x^4\,\dd V$, which
enters the wave weaker than the quadrupole by about the square of the speed of the ends, under 100 m/s, over the speed
of light. So a camera far away records the same data to about one part in $10^{13}$, and no aperture can resolve a body
millions of times smaller than its wavelength (section
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)). Only the near
field, where the separate tides of the masses can be read, tells the two apart. In Figure [](/paper/#fig:which-way), drawn with the speed
of light slowed so that the waves are 10 cm long, each turning pair is the diffraction spot of section 5.3, and the
colour of the spot is the $V/I$ that a compact rotor would have.

{{paper fig:which-way}}

::: try {#rotor-polarization}
On the left, the rotor and the camera; drag the knob on the arc, or use the slider, to tilt the rotor's spin by the
inclination $\iota$, from face on, 0°, past edge on, 90°, to pointing away, 180°. On the right, the ring of free balls as the camera sees it, moved by the rotor's wave (orange outward, blue inward),
with an inset that traces the point $(\field h_+(t), \field h_\times(t))$ round its ellipse, and a spot coloured as in
Figure [](/paper/#fig:which-way). A second knob turns the camera's own axes by $\theta$. The readouts fall in two groups: those that
change when the axes turn, the two amplitudes and $Q$ and $U$, and those that do not, $I$, $V$, $V/I$ and the power
relative to face on.

Answer the predictions at the top of the figure, then do what each asks. Afterwards, turn the axes by 90° and check that
every readout comes back.
:::

**The idea to keep: a gravitational wave across the line of sight is two patterns of stretch, and the timing between
them is its polarization. Equal and a quarter cycle apart, the pattern turns with its source; one alone, it pulses. Of
the four Stokes parameters, $I$ and $V$ do not depend on how the camera holds its axes, so $V/I$ gives an unresolved
rotor's sense of turning by its sign and the tilt of its axis by its size.**

::: problems
### Practice

**[5.4]** Compute $\field h_+/\field A$, $\field h_\times/\field A$, $V/I$ and the power relative to face-on for a rotor
seen at $\iota = 30°$ and at $\iota = 75°$.

::: solution
At 30°, $\cos\iota = 0.866$ and $\cos^2\iota = 0.75$: $\field h_+/\field A = 1.75/2 = 0.875$ and $\field h_\times/\field
A = 0.866$, so $V/I = 2 \times 0.875 \times 0.866/(0.7656 + 0.75) = 0.99995$, and the power ratio is $(1 + 4.5 +
0.5625)/8 = 0.758$. At 75°, $\cos\iota = 0.259$ and $\cos^2\iota = 0.067$: $\field h_+/\field A = 0.533$ and $\field
h_\times/\field A = 0.259$, so $V/I = 0.276/0.352 = 0.785$, and the power ratio is $(1 + 0.402 + 0.0045)/8 = 0.176$.
Between 30° and 75° the power falls fourfold while $V/I$ falls by a fifth.
:::

### Stretch

**[5.4]** A glow's Stokes parameters are the forms of [](#eq:stokes) averaged over many cycles. First show that they obey $I^2 \ge Q^2 + U^2 + V^2$, with equality for a
single steady wave. Then use it on a crystal. Only three of a wave's five shears drive the Raman line of a cubic crystal
such as silicon: the three entries off the diagonal in the crystal's own axes (section 10.3 explains it). So the
crystal absorbs a wave of polarization table $e_{ij}$ in proportion to $S(e, e) = e_{xy}^2 + e_{yz}^2 + e_{xz}^2$. A
warm body glows into each wave in proportion to how strongly it absorbs that wave (section 5.5), so the glow's two
polarizations have the averages $\langle|\tilde{\field h}_A|^2\rangle \propto S(e^A, e^A)$ and
$\langle\tilde{\field h}^*_+\tilde{\field h}_\times\rangle \propto S(e^+, e^\times)$, with $S(a, b) = a_{xy}b_{xy} +
a_{yz}b_{yz} + a_{xz}b_{xz}$. Use the tables of section 1.5 to show that, seen along a cube edge, the line is fully
linearly polarized; along a face diagonal it is $\tfrac54$ as bright and 60% polarized; along a body diagonal it is
$\tfrac43$ as bright and unpolarized.

::: solution
Write $P = \langle|\tilde{\field h}_+|^2\rangle$, $X = \langle|\tilde{\field h}_\times|^2\rangle$ and $C =
\langle\tilde{\field h}^*_+\tilde{\field h}_\times\rangle$, so that $I = P + X$, $Q = P - X$ and $U^2 + V^2 = 4|C|^2$. The
Cauchy–Schwarz inequality for averages gives $|C|^2 \le PX$, so $Q^2 + U^2 + V^2 \le (P - X)^2 + 4PX = (P + X)^2 = I^2$.
For a single steady wave no averaging is needed and $|C|^2 = PX$ exactly, which is the equality.

Along a cube edge, $\hat n = \hat z$, $\vect e_1 = \hat x$, $\vect e_2 = \hat y$: $e^+ = \mathrm{diag}(1, -1, 0)$ has
nothing off the diagonal, so $S(e^+, e^+) = 0$, while $e^\times$ has $e_{xy} = 1$, so $S(e^\times, e^\times) = 1$, and the
cross term is zero. So $I = 1$, $Q = -1$, $U = V = 0$.

Along a face diagonal, $\hat n = (1, 1, 0)/\sqrt2$, take $\vect e_1 = (-1, 1, 0)/\sqrt2$ and $\vect e_2 = \hat z$. Then
$e^+ = \vect e_1\vect e_1^{\mathsf T} - \vect e_2\vect e_2^{\mathsf T}$ has $e_{xy} = -\tfrac12$ and nothing else off the
diagonal, so $S(e^+, e^+) = \tfrac14$; $e^\times = \vect e_1\vect e_2^{\mathsf T} + \vect e_2\vect e_1^{\mathsf T}$ has
$e_{xz} = -1/\sqrt2$ and $e_{yz} = 1/\sqrt2$, so $S(e^\times, e^\times) = 1$; and $S(e^+, e^\times) = 0$. So $I =
\tfrac54$ and $|Q|/I = \tfrac34/\tfrac54 = 0.6$.

Along a body diagonal, $\hat n = (1, 1, 1)/\sqrt3$, take $\vect e_1 = (-1, 1, 0)/\sqrt2$ and $\vect e_2 = (-1, -1,
2)/\sqrt6$. Then $e^+$ has $e_{xy} = -\tfrac12 - \tfrac16 = -\tfrac23$, $e_{xz} = e_{yz} = \tfrac13$, so $S = \tfrac49 +
\tfrac19 + \tfrac19 = \tfrac23$; $e^\times$ has $e_{xy} = 0$ and $e_{xz} = -e_{yz} = -1/\sqrt3$, so $S = \tfrac23$; and the
cross term is $\tfrac13(-1/\sqrt3) + \tfrac13(1/\sqrt3) = 0$. So $I = \tfrac43$ and $Q = U = V = 0$: unpolarized. A thermal image of the crystal therefore shows which way its axes point.
:::

### The camera

**[5.4]** With the energy flux $c^3\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\rangle/16\pi G$ (section
7.8), add up the power over a sphere of radius $r$ to recover $P = \tfrac85G\matter m^2d^4\Omega^6/c^5$, and find the
power and the waiting time for one graviton, for two 1 kg masses a metre apart at sixteen turns a second, with a
graviton of the wave's frequency carrying the energy $\hbar\omega = 2\hbar\Omega$ (stated; section 8.3).

::: solution
The flux is $F = c^3\omega^2
I/32\pi G$ with $\omega = 2\Omega$ and $I = \tfrac14\field A^2(1 + 6x^2 + x^4)$, $x = \cos\iota$. A ring of the sphere
between $\iota$ and $\iota + \dd\iota$ has the area $2\pi r^2\sin\iota\,\dd\iota = 2\pi r^2\,|\dd x|$, so

$$\begin{aligned}
P &= 2\pi r^2\,\frac{c^3(2\Omega)^2}{32\pi G}\,\frac{\field A^2}{4}\\
&\qquad\times\int_{-1}^{1}(1 + 6x^2 + x^4)\,\dd x\\
&= \frac{r^2c^3\Omega^2\field A^2}{16G}\cdot\frac{32}{5}\\
&= \frac{2r^2c^3\Omega^2\field A^2}{5G}.
\end{aligned}$$

With $\field A = 4G\matter{\Delta I}\Omega^2/c^4r$, $\field A^2 = 16G^2\matter{\Delta I}^2\Omega^4/c^8r^2$, and the
distance cancels: $P = \tfrac{32}{5}G\matter{\Delta I}^2\Omega^6/c^5$. With $\matter{\Delta I} = \tfrac12\matter md^2$ this
is $\tfrac85G\matter m^2d^4\Omega^6/c^5$.

For the numbers, $\Omega = 2\pi \times 16 = 100.5\unit{s^{-1}}$ and $\Omega^6 = 1.03 \times 10^{12}\unit{s^{-6}}$, so
$P = 1.6 \times 6.674 \times 10^{-11} \times 1.03 \times 10^{12}/(2.998 \times 10^8)^5 = 4.55 \times 10^{-41}$ W. One
graviton carries $2\hbar\Omega = 2 \times 1.055 \times 10^{-34} \times 100.5 = 2.12 \times 10^{-32}$ J, so one leaves
every $2.12 \times 10^{-32}/4.55 \times 10^{-41} = 4.66 \times 10^8$ s, which is 14.8 years.
:::
:::

::: paper
- [Section V](/paper/#sec:waves): the rotor in its sealed box; [](#eq:pattern) is its "eight times less power", and
  [](#eq:stokes-turn) the Stokes parameters that "do not change". Figures [](/paper/#fig:quadrupole),
  [](/paper/#fig:polarization) and [](/paper/#fig:which-way) draw the pattern, the ellipses and the coloured spots;
  [*What does not radiate*](/paper/#par:what-does-not-radiate) lists the motions of the last section.
- [Section VI](/paper/#sec:thermal): the polarization of silicon's Raman line, the stretch problem.
- [Section VIII](/paper/#sec:one-pixel) reads a wave's two amplitudes with one pixel (Part 9).
:::

::: deeper
- The [GR course, section
  18.3](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten) shows
  why a gravitational wave keeps only the plus and cross patterns, and its
  [lab](https://neovand.github.io/general-relativity/chapter-18.html#scene-wave) draws them.
- M. Maggiore, *Gravitational Waves*, vol. 1 (Oxford, 2008), §3.3: the waves of a rotating body and the total power.
- E. Hecht, *Optics* (5th ed., Pearson, 2017), chapter 8: the Stokes parameters of light, the spin-one case.
:::

::: history
### Stokes, Poincaré and the polarization of light

George Gabriel Stokes introduced his four numbers in 1852, in a paper on how beams of polarized light combine. He chose
quantities that a polarizer and a quarter-wave plate can measure and that add when independent beams are mixed, so
they describe partly polarized light too. Henri Poincaré drew the fully polarized states as points on a sphere in 1892.
:::

[^n]: Where $\hat n$ points from a pixel toward its source, the wave travels along $-\hat n$. Here it points from the
    source toward the camera.

[^uneven]: The phase of $a\cos\omega t + ib\sin\omega t$ grows at the rate $ab\,\omega/(a^2\cos^2\omega t + b^2\sin^2\omega t)$,
    which is largest where the denominator, the square of the size, is smallest.

[^quad]: The rotor's amplitudes below first appeared in *The gravitational camera* (Mohsenvand 2026), Sec. V, as its
    equations [](/paper/#eq:quadrupole) and [](/paper/#eq:rotor-amplitudes).

[^clock]: Starting the clock with the rod along $x$ instead puts a minus sign in front of both amplitudes, which is the
    same wave half a cycle later.

[^inertia]: $\matter{\Delta I}$ is also the difference of the principal moments of inertia of a flat rotor, with the
    same size: the moment of inertia about an axis in the plane is $\int\matter\rho\,(x^2 + y^2)\,\dd V$ minus the second
    moment along that axis.

[^units]: The units of $\field A$ are $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ (for $G$) times $\mathrm{kg\,m^2\,s^{-2}}$ (for
    $\matter{\Delta I}\,\Omega^2$) over $\mathrm{m^4\,s^{-4}}$ (for $c^4$) times $\mathrm m$ (for $r$), which leave a
    pure number, as a strain must be.

[^helicity]: Physicists give the anticlockwise part, as the camera sees it, the helicity $+2$ and the clockwise part
    $-2$: the spin two of section 1.5b, counted along the direction of travel (section 9.1). Books on optics name the
    circular polarizations of light right- and left-handed by rules that differ, so we say "anticlockwise as the camera
    sees it".

[^letters]: Stokes $I$ is not the second moment $\matter I_{ij}$ or its difference $\matter{\Delta I}$, nor the moment
    of inertia of section 1.6; the rotor's amplitude $\field A$ is not the sum $A$ of section 4.5.

[^line]: The long axis of the ellipse lies at half the argument of $Q + iU$, so the line of strongest stretch on the ring
    lies at a quarter of it. For the rotor this is the spin's shadow, $\vect e_1$, where $Q > 0$ and $U = 0$. The line is
    fixed only up to a turn of 90°, which by [](#eq:stokes-turn) leaves $Q$ and $U$ unchanged: a stretch along one line
    and a squeeze along the line across it are the same pattern.

[^circular]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. V, as its equation
    [](/paper/#eq:circular).

[^power]: For the two 1 kg masses this is $4.6 \times 10^{-41}$ W, one graviton every fifteen years. First shown in
    *The gravitational camera* (Mohsenvand 2026), Sec. V, as its equation [](/paper/#eq:dumbbell).
