---
id: '5.4'
title: 'Polarization and the Stokes parameters'
question: 'A rotor sealed in a box is a single point in its own waves, yet the paper says that from the polarization the camera "can tell which way the rotor turns and how its axis is tilted". How does one unresolved wave carry the sense of turning of its source?'
part: '5'
requires: ['1.4', '1.5', '1.5b', 'R1', '2.3', '5.1', '5.2']
paper: [sec:waves, eq:quadrupole, eq:rotor-amplitudes, eq:circular, eq:dumbbell, eq:wave, fig:quadrupole, fig:polarization, fig:which-way, sec:thermal, sec:one-pixel]
figures: [fig:quadrupole, fig:polarization, fig:which-way]
live: [rotor-polarization]
depth: A
---

The paper's [Section V](/paper/#sec:waves) hides a rotor, a dumbbell spinning about its middle, inside a sealed steel
box. The rotor's waves are millions of times longer than the box, so no camera can resolve it: in its own waves the
rotor is a single point (chapter
[0.3](/tutorial/evening/waves-and-heat/#a-slow-body-is-far-smaller-than-its-waves-so-it-is-a-point)). Yet the plain
words of the section describe what a ring of free balls feels as the wave passes. "Seen along the rotor's axis, the
pattern of stretch and squeeze turns round and round as the rotor turns, in the same direction." Seen edge-on, the
pattern "only pulses back and forth along fixed directions, and it is eight times weaker". From this, the paper says,
the camera "can tell which way the rotor turns and how its axis is tilted". How does one unresolved wave carry the
sense of turning of its source?

The answer lies in the two patterns of stretch that make up every gravitational wave, and in the timing between
them. The paper describes the wave by four numbers, the Stokes parameters, and uses the two that do not change when
the camera's axes turn. This chapter derives its equations [](/paper/#eq:rotor-amplitudes) and
[](/paper/#eq:circular) and its factor of eight.

::: plain
A gravitational wave changes the shape of a ring of free balls across its path, in two basic ways. In the first,
the ring is stretched along one line and squeezed along the line at right angles to it. In the second, the same
happens along two lines turned by 45°. Every wave is a mixture of these two patterns, each growing and shrinking with
time.

If the two patterns rise and fall together, the ring is stretched along one fixed line and then along the line across
it: the stretch pulses. If one pattern is at its largest when the other is zero, a quarter of a cycle later, the line
of stretch goes round and round. A spinning rotor seen along its axis makes this second kind of wave, and the line of
stretch turns the same way as the rotor. Seen from the side, the rotor makes the first kind.

The amounts of the two patterns depend on how the camera holds its axes, but two combinations do not: the total
strength of the wave, and its part that turns anticlockwise minus its part that turns clockwise. Their ratio tells the
camera which way the rotor turns and how far its axis is tilted.
:::

## A wave across the line of sight has two patterns of stretch

We want a description of a gravitational wave that a ring of free balls can read. The wave travels along a unit vector
$\sym{wave-direction}{\hat n}$, which here points from the source toward the camera, as in the paper's Section V and in
chapter [5.2](/tutorial/waves/retarded-waves/#far-away-each-direction-carries-one-ripple-of-the-source).[^n] Across it
we take two unit vectors $\vect e_1$ and $\vect e_2$ at right angles, with $\vect e_1\times\vect e_2 = \hat n$. The
camera faces the source, and the wave comes straight at it along $\hat n$. In the picture that the camera sees, $\hat n$
points out of the page toward the viewer, and $\vect e_2$ lies a quarter turn anticlockwise from $\vect e_1$, as $y$
lies from $x$ in chapter
[1.5b](/tutorial/newton/complex-numbers/#a-tide-across-a-direction-is-one-complex-number-and-turning-the-axes-turns-it-back-by-twice-the-angle).

A **transverse wave** is a wave whose effect lies across its direction of travel. A gravitational wave is transverse:
its strain $\field h^{\rm TT}_{ij}$, chapter
[5.1](/tutorial/waves/wave-equation/#a-shear-in-a-solid-travels-and-its-law-is-the-wave-equation)'s table of pure
numbers that measures how much it stretches distances, has zeros in the row and the column of $\hat n$ and no trace,
the part that chapter 5.2's projector $\Lambda_{ij,kl}(\hat n)$ keeps. By chapter
[1.5](/tutorial/newton/five-numbers/#across-a-wave-two-numbers-are-left-and-a-turn-of-45-swaps-them), a symmetric
trace-free table in a plane holds two numbers. So in the axes $\vect e_1$, $\vect e_2$, $\hat n$ the strain at the
time $t$ is

$$\begin{gathered}
\field h^{\rm TT}_{ij}(t) = \field h_+(t)\,e^+_{ij} + \field h_\times(t)\,e^\times_{ij},\\ e^+ = \begin{pmatrix} 1 & 0 &
0\\ 0 & -1 & 0\\ 0 & 0 & 0\end{pmatrix}, \qquad e^\times = \begin{pmatrix} 0 & 1 & 0\\ 1 & 0 & 0\\ 0 & 0 &
0\end{pmatrix}. \end{gathered} \label{eq:two-patterns}$$

Here $\sym{strain-polarizations}{\field h_+(t)}$ and $\field h_\times(t)$ are the strains of the wave's two patterns,
pure numbers, and $\sym{polarization-tensors}{e^+_{ij}}$ and $e^\times_{ij}$ are fixed tables of pure numbers. Their
largest values over a cycle, written as in the paper without the $(t)$, are the two **polarization amplitudes** $\field
h_+$ and $\field h_\times$. The **plus pattern** $e^+$ stretches the ring along $\vect e_1$ and squeezes it along $\vect
e_2$. The **cross pattern** $e^\times$ does the same along the two diagonals, so it is the plus pattern turned by 45°.
Each table has $e^A_{ij}e^A_{ij} = 2$ (no sum over $A$, which names the pattern), the paper's normalization, and
$e^+_{ij}e^\times_{ij} = 0$. That a gravitational wave has these two patterns and no others is stated here; chapter 7.6
derives it.

**How the ring moves.** By chapter
[R1](/tutorial/newton/reading-section-ii/#near-slow-matter-the-tide-is-the-hessian-and-in-a-wave-it-is-the-strains-acceleration),
a ball at the small separation $\vect\xi$ from the centre of the ring is moved by $\delta\xi_i = \tfrac12\field
h^{\rm TT}_{ij}\xi_j$. Take the ball in the direction $\hat\xi = \cos\varphi\,\vect e_1 + \sin\varphi\,\vect e_2$. Its
outward movement, per metre of its distance from the centre, is $\tfrac12\hat\xi_i\field h^{\rm TT}_{ij}\hat\xi_j$, and
the double-angle algebra of chapter 1.5b gives

$$\begin{aligned}
\tfrac12\hat\xi_i\field h^{\rm TT}_{ij}\hat\xi_j &= \tfrac12\bigl(\field h_+(t)\cos2\varphi + \field h_\times(t)\sin2\varphi\bigr)\\
&= \tfrac12\bigl|\field h_+(t) + i\field h_\times(t)\bigr|\\
&\qquad\times\cos\bigl(2\varphi - \arg\bigl(\field h_+(t) + i\field h_\times(t)\bigr)\bigr).
\end{aligned}$$

So the wave's pattern on the ring is held by one complex number, $\field h_+(t) + i\field h_\times(t)$. The stretch is
largest along the direction at the angle $\varphi = \tfrac12\arg(\field h_+(t) + i\field h_\times(t))$ from $\vect
e_1$, and the squeeze is largest at right angles to it. When the axes turn anticlockwise by $\theta$, as the camera
sees them, the two strains obey chapter 1.5b's rule for a tide across a direction:

$$\field h'_+(t) + i\field h'_\times(t) = e^{-2i\theta}\,\bigl(\field h_+(t) + i\field h_\times(t)\bigr). \label{eq:h-turn}$$

The number has spin two: a turn of 45° makes a plus pattern into a cross pattern (Figure [](#fig:pol-patterns)),
and a half turn brings it back.

![The two patterns of a gravitational wave on a ring of free balls, the wave travelling out of the page toward the
reader. Look first at the orange arrows: in the plus pattern (left) they lie along $\vect e_1$, in the cross pattern
(right) along the diagonal, a turn of 45°. Orange marks a ball that has moved outward, blue one that has moved inward.
The strain is exaggerated about $10^{20}$ times beyond LIGO's.](tut-pol-patterns){#fig:pol-patterns}

## Two oscillations a quarter cycle apart make a pattern that turns

We want to know what the pattern on the ring does during one cycle when both patterns are present, because that
motion is what the paper calls the polarization of the wave. We assume **a steady wave of one angular frequency**
$\omega$ at the camera. Each strain is then a cosine with its own size and phase, which chapter [1.5b](/tutorial/newton/complex-numbers/#a-steady-oscillation-is-a-turning-complex-number) writes as the
real part of a turning complex number. We use the paper's time dependence $e^{-i\omega t}$ throughout:

$$\field h_+(t) = \mathrm{Re}\bigl[\tilde{\field h}_+e^{-i\omega t}\bigr], \qquad \field h_\times(t) = \mathrm{Re}\bigl[\tilde{\field h}_\times e^{-i\omega t}\bigr].$$

The fixed complex numbers $\sym{strain-phasors}{\tilde{\field h}_+}$ and $\tilde{\field h}_\times$ are the
**phasors** of the two strains, pure numbers whose sizes are the amplitudes $\field h_+$ and $\field h_\times$ and
whose arguments are the phases.

We take first the two strains a quarter of a cycle apart,

$$\field h_+(t) = a\cos\omega t, \qquad \field h_\times(t) = b\sin\omega t ,$$

where $a \ge 0$ and $b$ are pure numbers. Their phasors are $\tilde{\field h}_+ = a$ and $\tilde{\field h}_\times =
ib$, because $\mathrm{Re}[ib\,e^{-i\omega t}] = b\sin\omega t$: the factor $i$ is the quarter cycle. We write the
cosine and the sine in the complex number of the last section with Euler's formula,
$\cos\omega t = \tfrac12(e^{i\omega t} + e^{-i\omega t})$ and $i\sin\omega t = \tfrac12(e^{i\omega t} -
e^{-i\omega t})$:

$$\begin{aligned}
\field h_+(t) + i\field h_\times(t) &= a\cos\omega t + ib\sin\omega t\\
&= \tfrac12(a + b)\,e^{i\omega t} + \tfrac12(a - b)\,e^{-i\omega t}.
\end{aligned} \label{eq:circles}$$

The first term is a point that goes anticlockwise round a circle of radius $\tfrac12|a + b|$ in the complex plane,
and the second a point that goes clockwise round a circle of radius $\tfrac12|a - b|$, both once per cycle. What the
pattern does depends on the sizes of the two circles.

- **Equal amplitudes, $b = a$.** The second circle vanishes and $\field h_+(t) + i\field h_\times(t) = a\,e^{i\omega
  t}$. The size of the pattern stays $a$, and its phase grows steadily, so the stretch axis, at half the phase, turns
  anticlockwise at the rate $\omega/2$. This is **circular polarization**, a pattern that turns round at a steady
  size (Figure [](#fig:pol-instants), top). With $b = -a$ it turns clockwise instead.
- **One amplitude alone, $b = 0$.** The number $a\cos\omega t$ is real. It swings from $a$ to $-a$ and back, so the
  stretch lies along $\vect e_1$ for half the cycle and along $\vect e_2$ for the other half, with the pattern passing
  through zero between. This is **linear polarization**, a pattern that pulses along fixed directions. The two
  circles are then equal, and so they are when $a = 0$.
- **Anything between.** The point $(\field h_+(t), \field h_\times(t))$ goes round an ellipse with semi-axes $a$ and
  $|b|$. This is **elliptical polarization**. The pattern still turns, but its size swells and shrinks, and its axis
  turns fastest where the pattern is smallest.[^uneven]

Whenever $a$ and $b$ are both non-zero, one circle is larger, and the phase of $\field h_+(t) + i\field
h_\times(t)$ changes by a whole turn per cycle in the sense of the larger circle: anticlockwise when $b > 0$,
clockwise when $b < 0$. The stretch axis then turns by half a turn per cycle on average, which brings a spin-two
pattern back to itself. This sense is the wave's **sense of turning**, or **handedness**, stated always as the camera
facing the source sees it. A linear wave has none: its phase only jumps between 0
and a half turn.

![Eight instants of one cycle of a wave travelling toward the reader. Look first at the orange bar, the line of
strongest stretch. Top: the two patterns are equal and a quarter cycle apart, and the bar turns anticlockwise at a
steady length, half a turn per cycle (circular polarization). Bottom: the plus pattern alone, and the bar only grows,
vanishes and reappears across its first direction (linear polarization). Orange marks stretch, blue squeeze; the
strain is exaggerated.](tut-pol-instants){#fig:pol-instants}

## Projecting a turning quadrupole onto the sky gives the two amplitudes of a rotor

We want the two amplitudes of the rotor's wave seen from any direction, because the direction of view holds the sense
of turning and the tilt. We assume that **the rotor is compact**, much smaller than its wavelength, and that **the
camera is in its wave zone**, many reduced wavelengths away (chapter 5.2). For such a source the paper gives the
strain far away:

{{paper eq:quadrupole}}

Here $\sym{second-moment}{\matter I_{ij}}(t) = \int\matter\rho\,x_ix_j\,\dd V$ is the source's second moment (chapter
[2.3](/tutorial/outside/multipoles/#the-first-three-degrees-are-the-mass-the-centre-of-mass-and-a-trace-free-quadrupole)),
in $\mathrm{kg\,m^2}$, measured from its centre of mass; the two dots are two time derivatives; $r$ is the distance from
the source; and the label TT means the part across the line of sight with no trace, which the projector of chapter 5.2
keeps. The argument $t - r/c$ is chapter 5.2's retarded time, which the paper writes $u$. We state this result without
proof; chapter 7.7 derives it, and with it the amplitude $A$ below. This section derives only how the wave depends on
the direction of view.

**The rotor's turning table.** Two point masses $\matter m$, a distance $d$ apart on a light rod, turn about the
$z$ axis through their middle at the angular velocity $\Omega$, in radians per second, anticlockwise as seen from
the side toward which $z$ points. So the rotor's spin points along $+z$. We start the clock when the rod lies along
the $y$ axis, so that the masses stand at $\pm\tfrac d2(-\sin\Omega t, \cos\Omega t, 0)$.[^clock] Each mass adds
$\matter m\,x_ix_j$ to the second moment, and the double-angle formulas give, in the $xy$ plane,

$$\begin{aligned}
\matter I_{xx} &= \frac{\matter m d^2}{4}(1 - \cos2\Omega t),\\
\matter I_{yy} &= \frac{\matter m d^2}{4}(1 + \cos2\Omega t),\\
\matter I_{xy} &= -\frac{\matter m d^2}{4}\sin2\Omega t .
\end{aligned}$$

The constant part, $\tfrac14\matter md^2$ on the diagonal, has no second derivative and sends no wave. The rest turns
with the rod. We call $\sym{moment-difference}{\matter{\Delta I}}$ the difference between the two principal second
moments in the plane of rotation, in $\mathrm{kg\,m^2}$: along the rod it is $\tfrac12\matter md^2$, across it zero, so
$\matter{\Delta I} = \tfrac12\matter md^2$, the paper's value.[^inertia] The turning part of the table is then

$$\begin{aligned}
\matter I^{\rm turn} &= -\tfrac12\matter{\Delta I}\begin{pmatrix}\cos2\Omega t & \sin2\Omega t\\ \sin2\Omega t &
-\cos2\Omega t\end{pmatrix},\\ \ddot{\matter I}{}^{\rm turn} &= 2\matter{\Delta I}\,\Omega^2\begin{pmatrix}\cos2\Omega t
& \sin2\Omega t\\ \sin2\Omega t & -\cos2\Omega t\end{pmatrix}, \end{aligned} \label{eq:turning}$$

because each time derivative of $\cos2\Omega t$ or $\sin2\Omega t$ brings a factor $2\Omega$, and two of them give
$-4\Omega^2$. The table repeats after half a turn of the rod, so the wave has the angular frequency $\omega = 2\Omega$.

**The view from the camera.** The **inclination** $\sym{inclination}{\iota}$ is the angle between the rotor's spin
and the direction $\hat n$ from the rotor to the camera, in degrees or radians. We put the camera in the $xz$ plane
(Figure [](#fig:pol-geometry)):

$$\begin{gathered}
\hat n = (\sin\iota,\ 0,\ \cos\iota),\\
\vect e_1 = (\cos\iota,\ 0,\ -\sin\iota), \qquad \vect e_2 = (0,\ 1,\ 0).
\end{gathered}$$

The cross product, component by component, is $\vect e_1\times\vect e_2 = (\sin\iota, 0, \cos\iota) =
\hat n$, as the first section requires. The spin's shadow on the sky, the part of $\hat z$ across $\hat n$, is $\hat
z - \cos\iota\,\hat n = -\sin\iota\,\vect e_1$, so $\vect e_1$ lies along the line of that shadow, as in the paper.

![Where the camera stands. Look first at the angle $\iota$ between the spin, along $z$, and the line $\hat n$ from the
rotor to the camera, which lies in the $xz$ plane. The camera's axes $\vect e_1$ and $\vect e_2$ lie across $\hat n$,
with $\vect e_1\times\vect e_2 = \hat n$; the spin's shadow on the sky, $-\sin\iota\,\vect e_1$, lies along $\vect
e_1$. Drawn at $\iota = 50°$; the rotor is schematic.](tut-pol-geometry){#fig:pol-geometry}

The components of $\ddot{\matter I}$ across the line of sight are its contractions with these axes,
$\ddot{\matter I}_{11} = e_{1i}\ddot{\matter I}_{ij}e_{1j}$ and so on. Only the $xy$ block of $\ddot{\matter I}$ is
not zero, and $\vect e_1$ has the components $\cos\iota$ along $x$ and 0 along $y$, so

$$\ddot{\matter I}_{11} = \cos^2\iota\,\ddot{\matter I}_{xx}, \quad \ddot{\matter I}_{22} = \ddot{\matter I}_{yy}, \quad \ddot{\matter I}_{12} = \cos\iota\,\ddot{\matter I}_{xy}.$$

Removing the trace leaves $\pm\tfrac12(\ddot{\matter I}_{11} - \ddot{\matter I}_{22})$ on the diagonal and
$\ddot{\matter I}_{12}$ off it. Comparing with [](#eq:two-patterns), $\field h_+(t)$ is $2G/c^4r$ times
$\tfrac12(\ddot{\matter I}_{11} - \ddot{\matter I}_{22})$, where the half cancels the 2, and $\field h_\times(t)$ is
$2G/c^4r$ times $\ddot{\matter I}_{12}$:

$$\field h_+(t) = \frac{G}{c^4r}\bigl(\ddot{\matter I}_{11} - \ddot{\matter I}_{22}\bigr), \qquad \field h_\times(t) = \frac{2G}{c^4r}\,\ddot{\matter I}_{12}.$$

We put in [](#eq:turning). The difference is $2\matter{\Delta I}\Omega^2\cos2\Omega t\,(\cos^2\iota + 1)$ and the
entry off the diagonal is $2\matter{\Delta I}\Omega^2\cos\iota\,\sin2\Omega t$, both at the retarded time. With
$\sym{rotor-amplitude}{\field A} = 4G\matter{\Delta I}\,\Omega^2/c^4r$, a pure number,[^units] this is

$$\boxed{\;\begin{aligned}
\field h_+ &= \field A\,\frac{1 + \cos^2\iota}{2}, \qquad \field h_\times = \field A\cos\iota,\\
\field h_+(t) &= \field h_+\cos2\Omega\Bigl(t - \frac rc\Bigr),\\
\field h_\times(t) &= \field h_\times\sin2\Omega\Bigl(t - \frac rc\Bigr),
\end{aligned}\;} \label{eq:rotor}$$

the paper's equation:[^check]

{{paper eq:rotor-amplitudes}}

**A number.** For the paper's pair, two 1 kg masses 1 m apart turning sixteen times a second, $\matter{\Delta I} =
0.5\unit{kg\,m^2}$ and $\Omega = 100.5\unit{s^{-1}}$. At the distance of the Moon the face-on strain is $\field A =
4.3 \times 10^{-49}$, about $4 \times 10^{-28}$ times the strain of $10^{-21}$ that LIGO detects.

**Limits.** Face-on, $\iota = 0$, both amplitudes are $\field A$, a quarter cycle apart, so by [](#eq:circles) the wave
is circularly polarized and turns anticlockwise, as the rotor does when its spin points at the camera. Edge-on, $\iota =
90°$, $\field h_\times = 0$ and $\field h_+ = \tfrac12\field A$: the wave is linearly polarized, at half the face-on
amplitude. At $\iota = 180°$, $\field h_\times = -\field A$ and the pattern turns clockwise, as the rotor then appears
to.

**What it means.** The camera sees the rotor's turning table foreshortened (Figure [](#fig:pol-rotor-views)). The
part along the line of the spin's shadow shrinks by $\cos\iota$ in each of its two directions, so the cross amplitude
falls as $\cos\iota$ and the plus amplitude, which also has a part from the direction across the shadow, falls only
to a half.

![A rotor seen from three directions. Look first at the lower row: the point $(\field h_+, \field h_\times)$ goes
round a circle face on, an ellipse at 60° and to and fro along a line edge on. Its semi-axes are $(1 + \cos^2\iota)/2$
and $\cos\iota$ in units of $\field A$, and it goes round in the sense in which the camera sees the rotor turn. The
upper row shows the turning pair foreshortened by the tilt, and the spin's shadow on the sky; the rotor is schematic.
The magenta fill follows the paper's Figure [](/paper/#fig:quadrupole): it deepens with $V/I$, printed under
each.](tut-pol-rotor-views){#fig:pol-rotor-views}

## Four numbers describe a polarization, and two of them do not depend on the axes

The amplitudes $\field h_+$ and $\field h_\times$ and their phases describe the wave fully, but they depend on how the
camera holds its axes, and an unresolved rotor offers no axes of its own. We want numbers that change in the simplest
possible way when the axes turn.

**The two circular parts.** We split any steady wave into two circles, as [](#eq:circles) did for one timing. We write
each real part as half of a number plus its complex conjugate, $\mathrm{Re}\,z = \tfrac12(z + z^*)$, and collect the
terms in $e^{-i\omega t}$ and in $e^{i\omega t}$:

$$\begin{aligned}
\field h_+(t) + i\field h_\times(t) &= \tfrac12\bigl(\tilde{\field h}_+ + i\tilde{\field h}_\times\bigr)e^{-i\omega t} + \tfrac12\bigl(\tilde{\field h}_+^* + i\tilde{\field h}_\times^*\bigr)e^{i\omega t}\\
&= \tilde{\field h}_{\rm c}\,e^{-i\omega t} + \tilde{\field h}_{\rm a}^*\,e^{i\omega t},
\end{aligned}$$

with

$$\tilde{\field h}_{\rm a} = \tfrac12\bigl(\tilde{\field h}_+ - i\tilde{\field h}_\times\bigr), \qquad \tilde{\field h}_{\rm c} = \tfrac12\bigl(\tilde{\field h}_+ + i\tilde{\field h}_\times\bigr). \label{eq:helicities}$$

The second term turns anticlockwise in the complex plane with the size $|\tilde{\field h}_{\rm a}|$, and the first
clockwise with the size $|\tilde{\field h}_{\rm c}|$, as the camera sees them: hence the labels a and c. The
anticlockwise part turns as $e^{+i\omega t}$, against the paper's $e^{-i\omega t}$, so its number appears there as a
conjugate; its size is the same. These two circular parts are the wave's two **helicities**.[^helicity] For the strains
of [](#eq:circles), $\tilde{\field h}_+ = a$ and $\tilde{\field h}_\times = ib$ give $\tilde{\field h}_{\rm a} =
\tfrac12(a + b)$ and $\tilde{\field h}_{\rm c} = \tfrac12(a - b)$, the two circles found there. The rotor has $a =
\field h_+$ and $b = \field h_\times$, and with $\tfrac12(1 + \cos\iota) = \cos^2\tfrac\iota2$ its helicities are

$$\tilde{\field h}_{\rm a} = \field A\cos^4\tfrac\iota2, \qquad \tilde{\field h}_{\rm c} = \field A\sin^4\tfrac\iota2,$$

because $\tfrac12\bigl[\tfrac12(1 + \cos^2\iota) + \cos\iota\bigr] = \tfrac14(1 + \cos\iota)^2$, and the same with
$-\cos\iota$. Face-on only the anticlockwise part is left; edge-on the two are equal, $\tfrac14\field A$ each.

**The turn of the axes.** We turn the axes anticlockwise by $\theta$. By [](#eq:h-turn) the whole of
$\field h_+(t) + i\field h_\times(t)$ is multiplied by $e^{-2i\theta}$ at every instant, and so is each of its two
terms: $\tilde{\field h}'_{\rm c} = e^{-2i\theta}\tilde{\field h}_{\rm c}$ and $\tilde{\field h}'^*_{\rm a} =
e^{-2i\theta}\tilde{\field h}^*_{\rm a}$. Taking the conjugate of the second,

$$\tilde{\field h}'_{\rm a} = e^{2i\theta}\,\tilde{\field h}_{\rm a}, \qquad \tilde{\field h}'_{\rm c} = e^{-2i\theta}\,\tilde{\field h}_{\rm c} . \label{eq:helicity-turn}$$

A turn of the axes changes the phases of the two helicities but not their sizes.

**Four numbers.** We build the numbers from the helicities, because a turn of the axes only changes their phases.
Their two sizes give two numbers that no turn can change, and the product of one with the conjugate of the other
records how the two circles line up. The four **Stokes parameters** of a wave are

$$\begin{gathered}
\sym{stokes}{I} = 2\bigl(|\tilde{\field h}_{\rm a}|^2 + |\tilde{\field h}_{\rm c}|^2\bigr), \qquad V = 2\bigl(|\tilde{\field h}_{\rm a}|^2 - |\tilde{\field h}_{\rm c}|^2\bigr),\\
Q + iU = 4\,\tilde{\field h}^*_{\rm a}\,\tilde{\field h}_{\rm c},
\end{gathered} \label{eq:stokes-helicity}$$

all four pure numbers, squares of strains.[^letters] The first, $I$, is the total strength of the wave. The last,
$V$, is the anticlockwise part minus the clockwise part, so its sign gives the sense of turning. The pair $Q$ and $U$
is zero for a circular wave, where one helicity is missing. Its phase fixes the long axis of the ellipse traced by
$\field h_+(t) + i\field h_\times(t)$, and so the line of strongest stretch.[^line] Multiplying out (the box below)
gives the four in terms of the two polarizations:

$$\begin{aligned}
I &= |\tilde{\field h}_+|^2 + |\tilde{\field h}_\times|^2, &\qquad Q &= |\tilde{\field h}_+|^2 - |\tilde{\field
h}_\times|^2,\\ U &= 2\,\mathrm{Re}\bigl(\tilde{\field h}_+^*\tilde{\field h}_\times\bigr), &\qquad V &=
2\,\mathrm{Im}\bigl(\tilde{\field h}_+^*\tilde{\field h}_\times\bigr). \end{aligned} \label{eq:stokes}$$

The mean square of $\field h_+(t)$ over a cycle is $\tfrac12|\tilde{\field h}_+|^2$, so $I$ is twice the sum of the
two mean squares and $Q$ twice their difference, which a ring can measure over many cycles. The sign of $V$ says
which pattern leads. When the cross pattern does what the plus
pattern did a quarter of a cycle earlier, $\tilde{\field h}_\times = i\tilde{\field h}_+$ and $V = 2|\tilde{\field
h}_+|^2 = I$, as for the rotor face-on; when it leads by a quarter cycle, $V = -I$.

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
helicities do not change, so neither do $I$ and $V$. The product $\tilde{\field h}^*_{\rm a}
\tilde{\field h}_{\rm c}$ picks up $e^{-2i\theta}$ from each factor:

$$\boxed{\;\begin{gathered}I' = I, \qquad V' = V,\\ Q' + iU' = e^{-4i\theta}\,(Q + iU).\end{gathered}\;} \label{eq:stokes-turn}$$

The pair $(Q, U)$ turns back by four times the angle of the axes. The wave $\tilde{\field h}_+ =
\tilde{\field h}_\times = 1/\sqrt2$ has $I = U = 1$ and $Q = V = 0$. Its two patterns rise and fall together, so
$\field h_+(t) + i\field h_\times(t)$ keeps to the line at 45° in the complex plane, and the stretch pulses along the
line at half that angle, 22.5° from $\vect e_1$. In axes turned by 22.5° it is therefore a plus wave, with $Q' = 1$,
its $U$ in the first axes; the rule agrees, since $e^{-i\pi/2}\,i = 1$. So $U$ is $Q$ read in axes turned by 22.5°.

For a single steady wave the four numbers are tied together. By [](#eq:stokes-helicity), $I^2 - V^2 =
16|\tilde{\field h}_{\rm a}|^2|\tilde{\field h}_{\rm c}|^2 = Q^2 + U^2$, so $I^2 = Q^2 + U^2 + V^2$. The point $(Q/I,
U/I, V/I)$ then lies on a sphere of radius 1, **Poincaré's sphere**. Its poles are the two circular polarizations and
its equator the linear ones, and by [](#eq:stokes-turn) a turn of the axes carries the point round the vertical axis
by $-4\theta$ while its height $V/I$ stays (Figure [](#fig:pol-poincare)).

![The Stokes parameters of a fully polarized wave as a point on a sphere of radius 1, $(Q/I, U/I, V/I)$: Poincaré's
sphere. Look first at the dashed circle: turning the camera's axes by $\theta$ carries the point round the vertical
by $-4\theta$ for a gravitational wave (left) and by $-2\theta$ for light (right), while its height $V/I$ stays.
The poles are the two circular polarizations, the equator the linear ones. The point is the rotor seen at $\iota =
75°$, the turn $\theta = 22.5°$.](tut-pol-poincare){#fig:pol-poincare}

**Light, for comparison.** The electric field of light across its beam is an arrow, the complex number $E_1 +
iE_2$, which a turn of the axes multiplies by $e^{-i\theta}$ (chapter 1.5b). The same algebra then multiplies its $Q +
iU$ by $e^{-2i\theta}$, so a turn of 90° reverses $Q$ for light. For a gravitational wave a turn of 45° reverses $Q$,
and a turn of 90° changes nothing.

**When the wave is a mixture.** The glow of a warm body sums waves from many atoms that do not keep in step. Its
Stokes parameters are the forms of [](#eq:stokes) averaged over many cycles, and they obey $I^2 \ge Q^2 + U^2 + V^2$
(the stretch problem proves it). A wave with $Q = U = V = 0$ is **unpolarized**: its pattern has no preferred
direction and no preferred sense of turning.

**The rotor.** For the rotor, $\tilde{\field h}^*_+\tilde{\field h}_\times = \field h_+\cdot i\field h_\times$, which is
purely imaginary, so $U = 0$ and $V = 2\field h_+\field h_\times$, while $I = \field h_+^2 + \field h_\times^2$. Their
ratio is

$$\boxed{\;\frac VI = \frac{2\field h_+\field h_\times}{\field h_+^2 + \field h_\times^2},\;}$$

the paper's equation:

{{paper eq:circular}}

The ratio $V/I$ is the **degree of circular polarization** of the wave, the paper's circular fraction, a pure number
between $-1$ and $1$. By [](#eq:stokes-helicity) it is the anticlockwise power minus the clockwise power, over their
sum. The paper's sign convention is that $V/I$ is positive when the pattern turns anticlockwise as the camera sees it.
Face-on, only the anticlockwise helicity is present, so $V = I$: the sign agrees with the convention.

**Numbers.** The ratio $V/I$ is 0.976 at $\iota = 60°$, 0.785 at 75°, one half at 82.2°, 0 edge-on and $-0.976$ at
120°. So its sign tells the sense of turning from almost any direction,
while its size measures the tilt finely only near edge-on: at 30° it still differs from 1 by only $5 \times 10^{-5}$.

**What it means.** The sign of $V/I$ gives the sense in which the rotor turns, and its size gives the tilt of its
axis. Both survive any turn of the camera's axes, which is why the paper describes an unresolved rotor by $V/I$.

{{paper fig:polarization}}

## The rotor shines eight times less edge-on

We want the power that the rotor sends in each direction, compared with the power along its axis, because the paper
says the edge-on wave is "eight times weaker". A gravitational wave carries the energy flux

$$F = \frac{c^3}{16\pi G}\,\bigl\langle\dot{\field h}_+^2 + \dot{\field h}_\times^2\bigr\rangle ,$$

a power per unit area, in $\mathrm{W\,m^{-2}}$, summed over the two polarizations (stated, as in chapter
[5.1](/tutorial/waves/wave-equation/#a-wave-carries-its-energy-along-at-its-own-speed); chapter 7.8 derives it). In a
steady wave, $\dot{\field h}_+ = \mathrm{Re}[-i\omega\tilde{\field h}_+e^{-i\omega t}]$, and the average of the square
of a cosine over a cycle is one half, so $\langle\dot{\field h}_+^2\rangle = \tfrac12\omega^2|\tilde{\field h}_+|^2$,
and the same for $\times$. So

$$F = \frac{c^3\omega^2}{32\pi G}\,I .$$

The Stokes parameter $I$ measures the energy that the wave carries. For the rotor, by [](#eq:rotor),

$$\begin{aligned}
I = \field h_+^2 + \field h_\times^2 &= \field A^2\Bigl[\frac{(1 + \cos^2\iota)^2}{4} + \cos^2\iota\Bigr]\\
&= \frac{\field A^2}{4}\bigl(1 + 6\cos^2\iota + \cos^4\iota\bigr),
\end{aligned}$$

since $(1 + \cos^2\iota)^2 = 1 + 2\cos^2\iota + \cos^4\iota$ and the bracket adds $4\cos^2\iota$. Face-on this is
$2\field A^2$, so the power sent toward the angle $\iota$, relative to the power along the axis, is

$$\boxed{\;\frac{F(\iota)}{F(0)} = \frac{1 + 6\cos^2\iota + \cos^4\iota}{8}\;} \label{eq:pattern}$$

at the same distance. This is the rotor's **radiation pattern**, the way its power is shared among directions, drawn in
panel (a) of the paper's figure below.

**Numbers.** Edge-on, $\cos\iota = 0$ and the ratio is $\tfrac18$: the paper's "eight times weaker". Two factors make
the eight. The edge-on amplitude is half the face-on one, which gives a quarter of the power, and only one of the two
polarizations is left, which halves it again. The power falls to half of its value on the axis where
$\cos^4\iota + 6\cos^2\iota - 3 = 0$, so $\cos^2\iota = \sqrt{12} - 3 = 0.464$ and $\iota = 47°$.
Averaged over all directions, with $x = \cos\iota$ spread evenly between $-1$ and 1 as it is on a sphere,

$$\frac12\int_{-1}^{1}\frac{1 + 6x^2 + x^4}{8}\,\dd x = \frac{2 + 4 + \tfrac25}{16} = \frac25 .$$

So the total power is two fifths of what the rotor would send if it shone everywhere as it does along its axis.
**Checks.** The pattern is largest on the axis, where $\cos^2\iota = 1$, as the paper says, and it is the same toward
$\iota$ and $180° - \iota$, because a turn of the rotor end over end does not change its wave's power. The problems
below turn the two fifths into the paper's total power, equation [](/paper/#eq:dumbbell).

{{paper fig:quadrupole}}

## What the wave of a rotor cannot show, and what does not radiate

In the paper's [](/paper/#eq:quadrupole) the source enters only through the part of $\ddot{\matter I}_{ij}$ across the
line of sight and free of trace. This settles which motions send waves, as the paper's
[*What does not radiate*](/paper/#par:what-does-not-radiate) says; chapters 7.6 and 7.7 derive each case.

- A wheel turning steadily about its own axle keeps the same arrangement of mass, so $\matter I_{ij}$ does not change.
- A sphere that swells and shrinks keeps $\matter I_{ij}$ a multiple of $\delta_{ij}$, which is all trace.
- A pressure that is the same in all directions pushes equally along every axis, so it too is all trace.
- A body moving steadily in a straight line has $\matter I_{ij}$, measured about a fixed origin, growing as $t^2$
  (about its own centre of mass it does not change). So $\ddot{\matter I}_{ij}$ is constant, and the strain far away
  is constant too: no wave leaves.

An unresolved rotor shows two things: its sense of turning, by the sign of $V/I$, and the tilt of its axis, by the size
of $V/I$. It shows no shape. A uniform rod of mass $\matter M = 2$ kg and length $L = \sqrt3$ m = 1.73 m, turning like
the paper's pair, has the pair's $\matter{\Delta I}$, $\matter ML^2/12 = 0.5\unit{kg\,m^2}$, so [](#eq:rotor) gives the
two the same wave in every direction. Their arrangements of mass differ first in the fourth moment along the rod,
$\int\matter\rho\,x^4\,\dd V$, which enters the wave weaker than the quadrupole by about the square of the speed of the
ends, under 100 m/s, over the speed of light. So a camera far away records the same data to about one part in $10^{13}$.
No aperture can resolve a body millions of times smaller than its wavelength (chapter
[5.3](/tutorial/waves/diffraction/#delaying-and-adding-the-records-of-many-pixels-points-the-array)): only the near
field, where the separate tides of the masses can be read, tells the two apart. In the paper's Figure
[](/paper/#fig:which-way), drawn with the speed of light slowed so that the waves are 10 cm long, each turning pair is
chapter 5.3's diffraction spot, and the colour of the spot is its $V/I$.

{{paper fig:which-way}}

::: try {#rotor-polarization}
On the left, the rotor and the camera; drag the knob on the arc, or use the slider, to tilt the rotor's spin away
from the line to the camera by the inclination $\iota$, from face on, 0°, past edge on, 90°, to the spin pointing
away, 180°. On the right, the ring of free balls as the camera sees it, moved by the rotor's wave (orange outward,
blue inward), with an inset that traces the point $(\field h_+(t), \field h_\times(t))$ round its ellipse, and a spot
coloured as in the paper's Figure [](/paper/#fig:which-way). A second knob turns the camera's own axes by $\theta$.
The readouts fall in two groups: those that change when the axes turn, the two amplitudes and $Q$ and $U$, and those
that do not, $I$, $V$, $V/I$ and the power relative to face on.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, turn
the axes by 90° and check that every readout comes back.
:::

::: check
### Q

Seen from 60° off its axis, what are a rotor's $V/I$ and the power it sends that way, relative to face-on?

### A

With $\cos60° = 0.5$, the amplitudes are $\field h_+ = 0.625\,\field A$ and $\field h_\times = 0.5\,\field A$, so
$V/I = 2 \times 0.625 \times 0.5/(0.391 + 0.25) = 0.976$. The power ratio is $(1 + 1.5 + 0.0625)/8 = 0.32$.

### Q

Why does the paper describe the rotor by $V/I$ rather than by $\field h_+$ and $\field h_\times$?

### A

The amplitudes $\field h_+$ and $\field h_\times$ change when the camera's axes turn, by [](#eq:h-turn), and an
unresolved rotor gives no axes to line them up with. The parameters $I$ and $V$ are made from the sizes of the two
helicities, which a turn of the axes does not change.

### Q

A wheel spins fast about its axle. Does it send out gravitational waves?

### A

No. Its arrangement of mass is the same at every instant, so its second moment is constant and its second derivative
is zero.

### Q

For light, turning the axes by 90° changes $Q$ to $-Q$. What does the same turn do to $Q$ for a gravitational wave?

### A

Nothing: $Q + iU$ is multiplied by $e^{-4i\theta}$, and $4 \times 90° = 360°$ is a whole turn. For a gravitational
wave it is a turn of 45° that changes $Q$ to $-Q$.
:::

**The idea to keep: a gravitational wave across the line of sight is two patterns of stretch, and the timing between
them is its polarization. Equal and a quarter cycle apart, the pattern turns with its source; one alone, it pulses. Of
the four Stokes parameters, $I$ and $V$ do not depend on how the camera holds its axes, so $V/I$ gives an unresolved
rotor's sense of turning by its sign and the tilt of its axis by its size.**

::: problems
### Practice

Compute $\field h_+/\field A$, $\field h_\times/\field A$, $V/I$ and the power relative to face-on for a rotor seen at
$\iota = 30°$ and at $\iota = 75°$.

::: solution
At 30°, $\cos\iota = 0.866$ and $\cos^2\iota = 0.75$: $\field h_+/\field A = 1.75/2 = 0.875$ and $\field h_\times/\field
A = 0.866$, so $V/I = 2 \times 0.875 \times 0.866/(0.7656 + 0.75) = 0.99995$, and the power ratio is $(1 + 4.5 +
0.5625)/8 = 0.758$. At 75°, $\cos\iota = 0.259$ and $\cos^2\iota = 0.067$: $\field h_+/\field A = 0.533$ and $\field
h_\times/\field A = 0.259$, so $V/I = 0.276/0.352 = 0.785$, and the power ratio is $(1 + 0.402 + 0.0045)/8 = 0.176$.
Between 30° and 75° the power falls by a factor of four while $V/I$ falls by only a fifth.
:::

### Stretch

A glow is a mixture of many waves that do not keep in step, so its Stokes parameters are the forms of
[](#eq:stokes) averaged over many cycles. First show that they obey $I^2 \ge Q^2 + U^2 + V^2$, with equality for a
single steady wave. Then use it on a crystal. The paper's [Section VI](/paper/#sec:thermal), in *Driven vibrations*,
says that only three of a wave's five shears drive the Raman line of a cubic crystal such as silicon: the three
entries off the diagonal in the crystal's own axes (stated; chapter 10.3 explains it). So the crystal absorbs a wave
of polarization table $e_{ij}$ in proportion to $S(e, e) = e_{xy}^2 + e_{yz}^2 + e_{xz}^2$. A warm body glows into
each wave in proportion to how strongly it absorbs that wave (stated; chapter 5.5 explains it), so the glow's two
polarizations have the averages $\langle|\tilde{\field h}_A|^2\rangle \propto S(e^A, e^A)$ and
$\langle\tilde{\field h}^*_+\tilde{\field h}_\times\rangle \propto S(e^+, e^\times)$, with $S(a, b) = a_{xy}b_{xy} +
a_{yz}b_{yz} + a_{xz}b_{xz}$. Use chapter 1.5's tables to show the paper's numbers: seen along a cube edge the line is
fully linearly polarized; along a face diagonal it is $\tfrac54$ as bright and 60% polarized; along a body diagonal
it is $\tfrac43$ as bright and unpolarized.

::: solution
Write $P = \langle|\tilde{\field h}_+|^2\rangle$, $X = \langle|\tilde{\field h}_\times|^2\rangle$ and $C =
\langle\tilde{\field h}^*_+\tilde{\field h}_\times\rangle$, so that $I = P + X$, $Q = P - X$ and $U^2 + V^2 =
4|C|^2$. The Cauchy–Schwarz inequality for averages gives $|C|^2 \le PX$, so $Q^2 + U^2 + V^2 \le (P - X)^2 + 4PX =
(P + X)^2 = I^2$. For a single steady wave no averaging is needed and $|C|^2 = PX$ exactly, which is the equality.

Along a cube edge, $\hat n = \hat z$, $\vect e_1 = \hat x$, $\vect e_2 = \hat y$: $e^+ = \mathrm{diag}(1, -1, 0)$ has
nothing off the diagonal, so $S(e^+, e^+) = 0$, while $e^\times$ has $e_{xy} = 1$, so $S(e^\times, e^\times) = 1$, and
the cross term is zero. So $I = 1$, $Q = -1$, $U = V = 0$: fully linearly polarized.

Along a face diagonal, $\hat n = (1, 1, 0)/\sqrt2$, take $\vect e_1 = (-1, 1, 0)/\sqrt2$ and $\vect e_2 = \hat z$. Then
$e^+ = \vect e_1\vect e_1^{\mathsf T} - \vect e_2\vect e_2^{\mathsf T}$ has $e_{xy} = -\tfrac12$ and nothing else off
the diagonal, so $S(e^+, e^+) = \tfrac14$; $e^\times = \vect e_1\vect e_2^{\mathsf T} + \vect e_2\vect e_1^{\mathsf T}$
has $e_{xz} = -1/\sqrt2$ and $e_{yz} = 1/\sqrt2$, so $S(e^\times, e^\times) = 1$; and $S(e^+, e^\times) = 0$. So $I =
\tfrac54$ and $|Q|/I = \tfrac34/\tfrac54 = 0.6$.

Along a body diagonal, $\hat n = (1, 1, 1)/\sqrt3$, take $\vect e_1 = (-1, 1, 0)/\sqrt2$ and $\vect e_2 = (-1, -1,
2)/\sqrt6$. Then $e^+$ has $e_{xy} = -\tfrac12 - \tfrac16 = -\tfrac23$, $e_{xz} = e_{yz} = \tfrac13$, so $S = \tfrac49 +
\tfrac19 + \tfrac19 = \tfrac23$; $e^\times$ has $e_{xy} = 0$ and $e_{xz} = -e_{yz} = -1/\sqrt3$, so $S = \tfrac23$; and
the cross term is $\tfrac13(-1/\sqrt3) + \tfrac13(1/\sqrt3) = 0$. So $I = \tfrac43$ and $Q = U = V = 0$: unpolarized.
Here $Q^2 + U^2 + V^2$ is zero, as far below $I^2$ as it can be. A thermal image of the crystal therefore shows which
way its axes point.
:::

### The paper

Derive the angular factors of [](/paper/#eq:rotor-amplitudes), equation [](/paper/#eq:circular) and the factor of
eight, by projection as in this chapter. Then, with the energy flux $c^3\langle\dot{\field h}_+^2 + \dot{\field
h}_\times^2\rangle/16\pi G$ (stated; chapter 7.8), add up the power over a sphere of radius $r$ to recover the paper's
[](/paper/#eq:dumbbell), and check Section V's $4.5 \times 10^{-41}$ W and "one graviton every fifteen years" for two
1 kg masses a metre apart at sixteen turns a second, with a graviton of the wave's frequency carrying the energy
$\hbar\omega = 2\hbar\Omega$ (stated; chapter 8.3).

::: solution
The first part is the section on projection and the two that follow it. For the power, the flux is $F = c^3\omega^2
I/32\pi G$ with $\omega = 2\Omega$ and $I = \tfrac14\field A^2(1 + 6x^2 + x^4)$, $x = \cos\iota$. A ring of the sphere
between $\iota$ and $\iota + \dd\iota$ has the area $2\pi r^2\sin\iota\,\dd\iota = 2\pi r^2\,|\dd x|$, so

$$\begin{aligned}
P &= 2\pi r^2\,\frac{c^3(2\Omega)^2}{32\pi G}\,\frac{\field A^2}{4}\\
&\qquad\times\int_{-1}^{1}(1 + 6x^2 + x^4)\,\dd x\\
&= \frac{r^2c^3\Omega^2\field A^2}{16G}\cdot\frac{32}{5}\\
&= \frac{2r^2c^3\Omega^2\field A^2}{5G}.
\end{aligned}$$

With $\field A = 4G\matter{\Delta I}\Omega^2/c^4r$, $\field A^2 = 16G^2\matter{\Delta I}^2\Omega^4/c^8r^2$, and the
distance cancels: $P = \tfrac{32}{5}G\matter{\Delta I}^2\Omega^6/c^5$. With $\matter{\Delta I} = \tfrac12\matter md^2$
this is $\tfrac85G\matter m^2d^4\Omega^6/c^5$, the paper's [](/paper/#eq:dumbbell).

For the numbers, $\Omega = 2\pi \times 16 = 100.5\unit{s^{-1}}$ and $\Omega^6 = 1.03 \times 10^{12}\unit{s^{-6}}$,
so $P = 1.6 \times 6.674 \times 10^{-11} \times 1.03 \times 10^{12}/(2.998 \times 10^8)^5 = 4.55 \times
10^{-41}$ W. One graviton carries $2\hbar\Omega = 2 \times 1.055 \times 10^{-34} \times 100.5 = 2.12 \times
10^{-32}$ J, so one leaves every $2.12 \times 10^{-32}/4.55 \times 10^{-41} = 4.66 \times 10^8$ s, which is 14.8 years.
:::
:::

::: paper
- [Section V](/paper/#sec:waves): the polarization paragraph of the plain words, which this chapter opens with;
  [*The polarization of an unresolved source*](/paper/#par:the-polarization-of-an-unresolved-source), circular along
  the axis and "eight times weaker" in the plane, which is [](#eq:pattern).
- [*The sense of turning*](/paper/#par:the-sense-of-turning): [](/paper/#eq:rotor-amplitudes), derived here as
  [](#eq:rotor), and [](/paper/#eq:circular), with the sentence that "the two amplitudes mix as a spin-two pair, while
  the Stokes parameters $I$ and $V$ below do not change", which is [](#eq:stokes-turn).
- Figures [](/paper/#fig:quadrupole), [](/paper/#fig:polarization) and [](/paper/#fig:which-way) draw the radiation
  pattern, the ellipses, $V/I$ against $\iota$ and the coloured spots.
- [*What does not radiate*](/paper/#par:what-does-not-radiate) lists the motions of the last section.
- [Section VI](/paper/#sec:thermal), *Driven vibrations*: the polarization of silicon's Raman line by direction, the
  stretch problem.
- [Section VIII](/paper/#sec:one-pixel) reads a wave's two amplitudes with one pixel and splits a turning pair's wave by
  helicity (Part 9).
:::

::: deeper
- The [GR course, section 18.3](https://neovand.github.io/general-relativity/chapter-18.html#18-3-why-there-are-two-polarizations-not-ten)
  shows why a gravitational wave keeps only the plus and cross patterns, the statement this chapter takes from
  chapter 7.6, and its [lab](https://neovand.github.io/general-relativity/chapter-18.html#scene-wave) draws the two
  patterns on rings of free particles.
- M. Maggiore, *Gravitational Waves*, vol. 1 (Oxford, 2008), §3.3, works out the waves of a rotating body and their
  dependence on the inclination, in the paper's notation, together with the total power.
- E. Hecht, *Optics* (5th ed., Pearson, 2017), chapter 8, treats the polarization and the Stokes parameters of light,
  the spin-one case that this chapter compares with.
:::

::: history
### Stokes, Poincaré and the polarization of light

George Gabriel Stokes introduced his four numbers in 1852, in a paper on how beams of polarized light from different
sources combine. He chose quantities that could be measured with a polarizer and a quarter-wave plate and that add
when independent beams are mixed, which is why they describe partly polarized light as well as fully polarized
light. Henri Poincaré drew the fully polarized states as points on a sphere in his *Théorie mathématique de la
lumière* (1892). The same four numbers describe a gravitational wave once the turn of the axes is counted twice.
:::

[^n]: Elsewhere the paper's $\hat n$ points from the pixel toward the source, and the wave then travels along
    $-\hat n$. In this chapter, as in the paper's Section V, it points from the source toward the camera.

[^uneven]: The phase of $a\cos\omega t + ib\sin\omega t$ grows at the rate $ab\,\omega/(a^2\cos^2\omega t + b^2\sin^2\omega t)$,
    which is largest where the denominator, the square of the size, is smallest.

[^clock]: Starting the clock with the rod along $x$ instead puts a minus sign in front of both amplitudes, which is the
    same wave half a cycle later. Our choice matches the paper's positive amplitudes.

[^check]: Projecting the turning table numerically onto the sky at 0°, 60° and 90°, at nine instants of a cycle, gives
    [](#eq:rotor) to four decimals.

[^helicity]: Physicists give the anticlockwise part, as the camera sees it, the helicity $+2$ and the clockwise part
    $-2$: the spin two of chapter 1.5b, counted along the direction of travel (chapter 9.1). Books on optics name the
    circular polarizations of light right- and left-handed by rules that differ from book to book, so this chapter
    says only "anticlockwise as the camera sees it".

[^letters]: The four letters belong together and appear in this tutorial only here, in R5 and in Part 9. Stokes $I$ is
    not the second moment $\matter I_{ij}$ or its difference $\matter{\Delta I}$, which always carry indices or a
    $\Delta$ here, nor the moment of inertia of chapter 1.6, nor the paper's invariant $\mathrm{tr}\,\mathcal W^2$.
    Stokes $Q$ is not a quality factor or a moment of the mass. The rotor's amplitude $\field A$ is not the sum $A$ of
    chapter 4.5, nor an area.

[^line]: The long axis of the ellipse lies at half the argument of $Q + iU$, so the line of strongest stretch on the
    ring lies at a quarter of it. For the rotor this is the line of the spin's shadow, $\vect e_1$, where $Q > 0$ and
    $U = 0$. A quarter of an argument fixes the line only up to a turn of 90°: by [](#eq:stokes-turn) a turn of the
    axes by 90° leaves $Q$ and $U$ unchanged, because a stretch along one line and a squeeze along the line across it
    are the same pattern.

[^inertia]: The paper calls $\matter{\Delta I}$ a difference of principal moments of inertia. It has the same size,
    because for a flat rotor the moment of inertia about an axis in its plane is $\int\matter\rho\,(x^2 + y^2)\,\dd V$
    minus the second moment along that axis, so the two differences are equal and opposite.

[^units]: The units of $\field A$ are $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ (for $G$) times $\mathrm{kg\,m^2\,s^{-2}}$ (for
    $\matter{\Delta I}\,\Omega^2$) over $\mathrm{m^4\,s^{-4}}$ (for $c^4$) times $\mathrm m$ (for $r$), which leave a
    pure number, as a strain must be.
