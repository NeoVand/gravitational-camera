---
id: '1.8'
title: 'Orbits, flybys and kicks'
question: 'A tonne flies past a steel ball at 44 km/s and leaves a little slower. How large is the kick that each part of the ball receives, and why does it not depend on where the part lies along the path?'
part: '1'
requires: ['1.2', '1.3', '1.4', '1.5b', '1.6', '1.7']
paper: [sec:second-order, eq:pass, eq:push, fig:passing, sec:no-lens, sec:vistas]
figures: []
live: [flyby-kick, passing]
depth: A
---

A tonne of matter flies past a steel ball a metre across, at 44 kilometres per second. Its path passes 1 m from the
edge of the ball, 1.5 m from its centre. The ball is pulled toward the passing mass for a few tens of microseconds.
Afterwards the ball as a whole is left moving, its parts are left moving a little relative to one another, and the
tonne leaves a little slower than it came. The paper's [Section XIII](/paper/#sec:second-order), in the paragraph *A
mass that passes*, uses this scene. It states that a part of the ball receives a sideways velocity that depends only
on where the part lies in the plane at right angles to the path, "wherever it lies along the path".

This chapter asks how large the kick that each part of the ball receives is, and why it does not depend on where the
part lies along the path. The answer gives the energy that a pass leaves inside a body, from which the paper reads the
inside. First we need the other thing that a mass can do when it meets another: orbit it.

::: plain
A body in orbit is falling all the time. It moves sideways fast enough that, as it falls toward the planet, the
curved ground drops away beneath it by the same amount, so it never comes closer. The time it takes to go round is
fixed by how strongly gravity changes from place to place there, which is the tide.

A body that comes in fast enough is not caught. It flies past and leaves again. If it is very fast, it hardly bends,
and the body it passes feels a short tug toward its path. Each small part of that body is tugged sideways, toward the
path, by an amount that depends only on its distance from the path. A part farther along the path meets the passing
mass a moment later, but it feels the same tug.

Those tugs set the parts moving. Most of the energy goes into moving the body as a whole, and for a round body that
share depends only on the body's mass. The rest is left inside the body, and it depends on how the mass is spread out
inside. The passing mass loses exactly the energy the body gains.
:::

## A circular orbit is a fall that keeps missing

An **orbit** is the path of a body that moves round another under gravity alone. We start with the simplest, a
circle. A small body of mass $\matter m$, in kilograms, moves at the steady speed $v$, in metres per second, on a circle
of radius $r$ round a body of mass $\matter M$ at the centre. We assume that **the central body does not move**, and we
remove this assumption at the end of the section.

A body that moves on a circle at a steady speed still accelerates, because the direction of its velocity turns. Its
position is $r(\cos\Omega t, \sin\Omega t)$, where $\Omega = v/r$ is the angle it turns through per second. We
differentiate twice with respect to time and find $-\Omega^2$ times the position: an acceleration of size
$\Omega^2 r = v^2/r$, pointing at the centre. Gravity supplies an acceleration $G\matter M/r^2$ toward the centre
(chapter 1.2). The two must be equal:

$$\frac{v^2}{r} = \frac{G\matter M}{r^2}.$$

We solve for $v$, and divide the length of the circle, $2\pi r$, by $v$ to find the time of one turn, which is the
**period** $\sym{orbital-period}{T}$, in seconds:

$$\boxed{\;v = \sqrt{\frac{G\matter M}{r}}, \qquad T = 2\pi\sqrt{\frac{r^3}{G\matter M}}.\;} \label{eq:circle}$$

The units agree, because $G\matter M/r$ is $\mathrm{m^3\,s^{-2}}$ divided by metres, the square of a speed. The square
of the period grows as the cube of the radius, which is **Kepler's third law**. The mass $\matter m$ of the orbiting
body has cancelled.

The International Space Station flies about 420 km above the ground, at $r = 6791\unit{km}$ from the Earth's centre.
With $G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$ for the Earth, equation [](#eq:circle) gives
$v = 7.66\unit{km\,s^{-1}}$ and $T = 92.8$ minutes. The Earth pulls there with 0.88 of its strength on the ground,
$8.6\unit{m\,s^{-2}}$, the "nine tenths" of chapter 1.4. In one second the station moves 7.66 km sideways and falls
4.3 m toward the Earth. Over 7.66 km, the curved surface of the Earth drops away from a straight line by the same
4.3 m, so the station never comes closer. The crew float because they fall with it.

<!-- diagram: an orbit as a sequence of falls that miss: from a point on a circle round the Earth, a straight dashed
step of one second (7.66 km, drawn exaggerated) along the velocity, then a short fall of 4.3 m back onto the circle;
three such steps in a row, the planet's curved surface beneath -->

Two limits check the formula. Close to the ground, at $r = 6371\unit{km}$, the orbit takes 84.3 minutes at
$7.91\unit{km\,s^{-1}}$, the quickest orbit round the Earth. Far away, $v$ falls as $1/\sqrt r$. For the Earth
round the Sun, with $G\matter M = 1.327124 \times 10^{20}\unit{m^3\,s^{-2}}$ and $r = 1.495979 \times 10^{11}\unit{m}$,
the formula gives $29.8\unit{km\,s^{-1}}$ and a period of 365.257 days, within about a minute of the year measured
against the stars.[^year]

Now let both bodies move. Two masses $\matter m_1$ and $\matter m_2$ sit at $\vect x_1$ and $\vect x_2$. Each pulls the
other along the line between them, so with $\vect d = \vect x_2 - \vect x_1$ and $d = |\vect d|$,

$$\ddot{\vect x}_1 = \frac{G\matter m_2\,\vect d}{d^3}, \qquad \ddot{\vect x}_2 = -\frac{G\matter m_1\,\vect d}{d^3}.$$

We subtract the first equation from the second:

$$\ddot{\vect d} = -\frac{G(\matter m_1 + \matter m_2)\,\vect d}{d^3}.$$

The separation moves as a single body round a fixed mass $\matter m_1 + \matter m_2$, so equation [](#eq:circle)
holds for a pair, with $r$ replaced by the separation and $\matter M$ by the total mass. For the two black holes of 30
solar masses each, 2200 km apart, in the paper's [Section XI](/paper/#sec:vistas), it gives 4.35 turns a second, and
each hole moves at a tenth of the speed of light. Their gravitational waves have twice the frequency of the
orbit, 8.7 Hz,[^twice] and so a wavelength of 34,400 km, close to the paper's 35,000 km.[^binary]

## The period of a free orbit is set by the tide where it runs

Chapter 1.4 found the tide beside a mass $\matter M$ at the distance $r$. With $x$ along the line to the mass, the
tidal tensor $\curv{\tE}_{ij}$, in $\mathrm{s^{-2}}$, has the entry $\curv{\tE}_{xx} = -2G\matter M/r^3$ (a stretch
along the line) and $\curv{\tE}_{yy} = \curv{\tE}_{zz} = G\matter M/r^3$ (a squeeze across it). The orbit's rate of
turning, $\Omega = 2\pi/T$, is by equation [](#eq:circle)

$$\Omega^2 = \frac{G\matter M}{r^3} = \curv{\tE}_{yy} = \tfrac12\,|\curv{\tE}_{xx}| .$$

So the square of the rate is exactly the squeeze across the line, and half the stretch along it. In terms of the tide
alone,

$$\boxed{\;T = 2\pi\sqrt{\frac{2}{|\curv{\tE}_{xx}|}}.\;} \label{eq:tide-period}$$

The units agree, because $1/\mathrm{s^{-2}}$ is a time squared. The mass and the distance no longer appear separately:
wherever the stretch is the same, a free orbit takes the same time.

<!-- diagram: one ring of free balls drawn at four places round a circular orbit, each stretched along the line to
the central mass (orange) and squeezed across it (blue); the stretch axis turns once per orbit, keeping pace with the
orbit -->

Three numbers show the range. At the Earth's surface the stretch is $3.08 \times 10^{-6}\unit{s^{-2}}$, and
equation [](#eq:tide-period) gives 84.3 minutes, as before. Beside the person of chapter 1.4, whose stretch at 1 m is
$9.34 \times 10^{-9}\unit{s^{-2}}$, a free pebble would orbit once in 25.5 hours, at $0.068\unit{mm\,s^{-1}}$. The
paper's [Section VII](/paper/#sec:no-lens) imagines a small black hole of $1.36 \times 10^{23}\unit{kg}$ used as a lens.
Its tide falls to $1\unit{s^{-2}}$ at 26.3 km. There the two ends of a camera a metre long are pulled apart at
$1\unit{m\,s^{-2}}$, a tenth of the Earth's gravity, which a camera can bear. By equation [](#eq:tide-period) any free orbit there takes $2\pi\sqrt2 = 8.9\unit{s}$, whatever the mass of the
hole. The camera would have to move at $2\pi r/T = 18.6\unit{km\,s^{-1}}$, and the hole would pull on it with
$13{,}100\unit{m\,s^{-2}}$, 1340 times the Earth's gravity: the paper's "once every nine seconds", "19 km s⁻¹" and
"1340".

## Energy and angular momentum fix the size and shape of an orbit

For the circle the energies follow from equation [](#eq:circle). The kinetic energy is
$K = \tfrac12\matter mv^2 = G\matter M\matter m/2r$, and the potential energy is $U = \matter m\field\Phi =
-G\matter M\matter m/r$, where $\field\Phi$ is the gravitational potential of chapter 1.2, in joules per kilogram. So

$$K = -\tfrac12\,U, \qquad E = K + U = -\frac{G\matter M\matter m}{2r}.$$

For any system held together by gravity the first relation holds on average over a long time: twice the average
kinetic energy is minus the average potential energy. This is the **virial theorem**, which chapter 12.1 derives.

The total energy $E$ is negative. An orbit whose energy is negative is **bound**: the body can never reach a great
distance, where $U$ is zero and $E$ would be at least the kinetic energy, which is never negative. A body with $E \ge 0$
can escape. The speed at which $E = 0$ is the **escape speed**,

$$\boxed{\;v_{\rm esc} = \sqrt{\frac{2G\matter M}{r}},\;}$$

$\sqrt2$ times the circular speed at the same place. At the Earth's surface it is $11.2\unit{km\,s^{-1}}$. A body that
arrives from far away has $E > 0$ (it came from a great distance with some speed), so it cannot be caught by the pull
of one body alone; it flies past and leaves.

The angular momentum of chapter 1.6, $\vect L = \vect x\times\vect p$, in $\mathrm{kg\,m^2\,s^{-1}}$, is fixed under a
central force, so the orbit stays in the plane at right angles to $\vect L$. In a small time $\dd t$ the line from the
centre to the body sweeps a thin triangle with sides $\vect x$ and $\vect v\,\dd t$, whose area is half the size of
their cross product (chapter 1.1). So the line sweeps area $A$ at the rate

$$\frac{\dd A}{\dd t} = \tfrac12|\vect x\times\vect v| = \frac{L}{2\matter m},$$

in square metres per second, with $L = |\vect L|$. Because $L$ is constant, the line sweeps equal areas in equal times,
which is **Kepler's second law**; it holds for any central force. Over one period the space station sweeps
$\tfrac12 rv \times T = 1.45 \times 10^{14}\unit{m^2}$, the area $\pi r^2$ of its circle.

Most orbits are not circles. We state the next result without proof. Under the pull $G\matter M/r^2$ every bound orbit
is an ellipse with the central mass at one **focus**, one of the two points inside an ellipse whose distances to any
point on it add up to the same length. This is **Kepler's first law**. Half the ellipse's longest diameter is its
**semi-major axis** $\sym{semi-major-axis}{a}$, in metres. Its shape is set by a pure number between 0 and 1, the
**eccentricity**: 0 for a circle, close to 1 for a long thin ellipse. Only $a$ enters the energy and the period:

$$\boxed{\;E = -\frac{G\matter M\matter m}{2a}, \qquad T = 2\pi\sqrt{\frac{a^3}{G\matter M}}.\;}$$

For a circle $a = r$, and both agree with the formulas above.

::: gap
Stated here without proof: that every bound orbit under the pull $G\matter M/r^2$ is an ellipse with the central mass
at a focus; that its energy and period are the two boxed formulas above, with only $a$ in them; and that a body with
$E \ge 0$ moves on an open curve, a parabola or a hyperbola. The proof writes the energy in polar coordinates, uses the
constant angular momentum to trade time for the angle, and solves the equation that results for $1/r$. The GR course
derives all of it (see *Go deeper*).
:::

The thinnest ellipse is a fall straight in. A body let go at rest at the distance $r_0$ falls along a line, which is
the limit of ellipses whose far end stays at $r_0$ while their near end comes down to the centre. Their longest
diameter is $r_0$, so $a = r_0/2$, and the body reaches the centre after half their period,
$\pi\sqrt{r_0^3/8G\matter M}$. If the Earth stopped in its orbit, it would fall into the Sun in 64.6 days, the year
divided by $4\sqrt2$.

## A fast passing mass gives every part of a body a sideways kick

We come to the tonne. A **flyby** is an encounter in which a mass arrives from far away, passes a body and leaves
again. The passing mass is $\sym{passing-mass}{\matter\mu}$, in kilograms, and it moves at the speed $V$, in metres per
second.[^mu] We want the velocity that each part of the body gains, and we approximate in two ways, each stated in
bold.

First, **the passing mass moves on a straight line at a steady speed**. Its true path bends, but by a small angle when
it is fast. Second, **the parts of the body do not move while the mass passes**, so each part feels the pull at a
fixed place. The body starts at rest. Together these make the **impulse approximation**: each part receives an
impulse, a change of momentum (chapter 1.6), and only afterwards moves.

Put one part of the body at the origin. The **impact parameter** $B$, in metres, is the distance from the part to the
passing mass's line. We take the line parallel to the $z$ axis, through the point $(B, 0, 0)$, so that the passing mass
is at $(B, 0, Vt)$ and is closest at $t = 0$. Its pull, per unit mass of the part, points toward it:

$$\vect g(t) = \frac{G\matter\mu\,(B, 0, Vt)}{(B^2 + V^2t^2)^{3/2}} .$$

The component along the path, $G\matter\mu Vt/(B^2 + V^2t^2)^{3/2}$, is odd in $t$: the pull forward while the mass
approaches is cancelled by the pull backward while it leaves. The sideways component never changes sign. Its integral
over time is the velocity the part gains. We substitute $Vt = B\tan\theta$, so that $\dd t = (B/V)\,\dd\theta/\cos^2\theta$
and $B^2 + V^2t^2 = B^2/\cos^2\theta$:

$$\begin{aligned}
\Delta v &= \int_{-\infty}^{\infty}\frac{G\matter\mu B}{(B^2 + V^2t^2)^{3/2}}\,\dd t\\
&= \frac{G\matter\mu}{BV}\int_{-\pi/2}^{\pi/2}\cos\theta\,\dd\theta .
\end{aligned}$$

The last integral is 2, so

$$\boxed{\;\Delta v = \frac{2G\matter\mu}{BV},\;} \label{eq:kick}$$

pointing from the part straight toward the path. The unit is $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times kilograms, divided by
metres and by metres per second: a velocity. The kick is the peak pull $G\matter\mu/B^2$ times the time $2B/V$. We call
$2B/V$ the **duration** of the pass at that part: it is how long the peak pull would have to act to give the same kick.
A faster mass gives a smaller kick, though its peak pull is the same, because the pass is shorter.

<!-- diagram: the flyby geometry: the passing mass's straight path, the plane at right angles to it through the
body, a part of the body over the point s of that plane at the distance B from the path; beside it, the sideways pull
on that part against time, a bell-shaped curve of height Gμ/B², its shaded area labelled 2Gμ/BV, with a dashed
rectangle of the same height and area whose width is the duration 2B/V -->

Now the guiding question. Take a second part, also at the distance $B$ from the line, but farther along the path, at
$z = z_0$. The passing mass reaches its closest point to this part at $t_0 = z_0/V$, later than for the first. This
part feels the same pull as a function of $t - t_0$, shifted in time. The integral over all time does not change when
the pulse is shifted, so it receives the same kick. Only the distance from the path matters, because the kick sums the
pull over the whole pass.

The plane at right angles to the path is a natural place to describe the body. Let $\vect b$ be the point where the
path crosses this plane, and $\vect s$ the point of the plane over which a part lies. The part's distance from the path
is $B = |\vect b - \vect s|$, and its kick points along $\vect b - \vect s$, so

$$\Delta\vect v = C\,\frac{\vect b - \vect s}{|\vect b - \vect s|^2}, \qquad C = \frac{2G\matter\mu}{V},$$

which is the paper's statement. Here $\sym{flyby-constant}{C}$ is measured in $\mathrm{m^2\,s^{-1}}$.[^C]

For the tonne at $44\unit{km\,s^{-1}}$, $C = 2 \times 6.674 \times 10^{-11} \times 1000/44{,}000 =
3.0 \times 10^{-12}\unit{m^2\,s^{-1}}$. The edge of the ball nearest the path, 1 m from it, gets
$3.0 \times 10^{-12}\unit{m\,s^{-1}}$. At that speed a part would take ten years to move a millimetre. The pull on it
peaks at $6.7 \times 10^{-8}\unit{m\,s^{-2}}$, and the pass there lasts $2B/V = 45\unit{\mu s}$: this is the paper's
$3 \times 10^{-12}\unit{m\,s^{-1}}$ "in fifty microseconds", which chapter 1.7 quotes. Most of it moves the ball as a
whole, because the centre of the ball, 1.5 m from the path, gets $2.0 \times 10^{-12}\unit{m\,s^{-1}}$. The tidal part
of the kick, its change across the ball to first order in the radius, is
$C \times 0.5\unit{m}/(1.5\unit{m})^2 = 7 \times 10^{-13}\unit{m\,s^{-1}}$ at the edge.

The approximation rests on two small numbers. The ball, of 4110 kg, bends the tonne's path by the angle
$2G\matter M/bV^2$, from equation [](#eq:kick) with the roles exchanged: $1.9 \times 10^{-16}$ rad for a pass at
$b = 1.5\unit{m}$ from its centre. The parts of the ball lie between 1 m and 2 m from the path, so the pass lasts 45 to
91 μs at them, while the ball's slowest internal motion, a ringing of its whole shape, takes about 330 μs.[^ring] The
parts move very little while the tonne passes.

The approximation fails when the kick is not small compared with the speed of the pass. If the Sun passed a body at
1 AU at $30\unit{km\,s^{-1}}$, equation [](#eq:kick) would give a kick of $59\unit{km\,s^{-1}}$, twice that speed.
The path is then far from straight, and the encounter is not a flyby: it is the Earth's orbit.

::: try {#flyby-kick}
Predict first: if the tonne passed twice as fast, what would happen to the kick of a part? Would a part farther along
the path get a different kick? The drawing shows the ball from the side, under the tonne's path, and seen along the
path; arrows give the velocity each part has gained. Below, the sideways pull on the ringed part is plotted against
time, and its shaded area is the kick so far. Double the speed with its slider: the peak of the pull stays the same,
while its width and its area halve. Then drag the ringed part along the path: its pulse comes earlier or later, and
its kick does not change.
:::

## What a pass leaves inside a body is a weighted sum of its projected mass

We want the energy that the pass gives the body. Each part starts at rest, so a part of mass $\matter m_a$ gains the
kinetic energy $\tfrac12\matter m_a|\Delta\vect v_a|^2$. Here $a$ labels the parts of the body, as in chapter 1.6, and
is not the semi-major axis. All the parts that lie over the same point $\vect s$ get the same kick, whatever their
place along the path, so we can add them up first. We add the density along the line through $\vect s$ parallel to the
path:

$$\sym{projected-density}{\matter\Sigma}(\vect s) = \int\matter\rho\,\dd z .$$

This is the **projected surface density**, in kilograms per square metre: the mass that lies over each square metre of
the plane at $\vect s$. Here $\matter\rho$ is the density of chapter 1.3. A small patch of the plane round $\vect s$,
of area $\dd^2s$ in square metres, has the mass $\matter\Sigma\,\dd^2s$ over it, and that mass gains the kinetic energy
$\tfrac12\matter\Sigma\,\dd^2s\,C^2/|\vect b - \vect s|^2$. Adding the patches gives

$$\boxed{\;\Delta E(\vect b) = \frac{C^2}{2}\int\frac{\matter\Sigma(\vect s)}{|\vect b - \vect s|^2}\,\dd^2s,\;} \label{eq:pass}$$

the paper's equation [](/paper/#eq:pass):[^push]

{{paper eq:pass}}

The unit is $\mathrm{m^4\,s^{-2}}$ times $\mathrm{kg\,m^{-2}}$ times $\mathrm{m^2}$ over $\mathrm{m^2}$, which is joules.

This energy has two parts. Let $\vect P$ be the body's total momentum after the pass, $\vect v_{\rm cm} = \vect
P/\matter M$ the velocity of its centre of mass (chapter 1.6), and $\vect u_a = \Delta\vect v_a - \vect v_{\rm cm}$ the
velocity of part $a$ relative to it. By the definition of the centre of mass, $\sum_a\matter m_a\vect u_a = 0$. We
expand the kinetic energy $K$:

$$\begin{aligned}
K &= \sum_a\tfrac12\matter m_a|\vect v_{\rm cm} + \vect u_a|^2\\
&= \tfrac12\matter M v_{\rm cm}^2 + \vect v_{\rm cm}\cdot\sum_a\matter m_a\vect u_a\\
&\quad + \sum_a\tfrac12\matter m_au_a^2 .
\end{aligned}$$

The middle term is zero. The first term is the **recoil**, the energy of the body moving as a whole. The last is the
**internal energy** that the pass leaves inside the body, the energy of the parts moving relative to one another.

For a **round body**, one whose density depends only on the distance from its centre, both parts can be found. We use
the complex numbers of chapter 1.5b. We put the centre at the origin of the plane and turn the axes so that $\vect b$
lies along the first axis, a real number $b$. A point $\vect s$ of the plane is the complex number $w$, with $|w| = s$
and angle $\varphi$. We take $s < b$: the path misses the body. A kick $(X, Y)$ is the complex number $X + iY$, so the
kick at $w$ is

$$C\,\frac{b - w}{|b - w|^2} = \frac{C}{b - w^*} = \frac{C}{b}\sum_{n=0}^{\infty}\Bigl(\frac{w^*}{b}\Bigr)^n ,$$

because $|b - w|^2 = (b - w)(b - w^*)$ for real $b$, and by the geometric series. Round a circle of radius $s$, the
power $(w^*)^n$ has the angle $-n\varphi$, and its average over the circle is zero for every $n \ge 1$. So every ring of
the projected body, on average, gets the kick $C/b$ of its centre, and the whole body moves off at $v_{\rm cm} = C/b$
toward the path. This is the shell theorem of chapter 1.3 carried into the plane: there a round shell pulls on an
outside mass as if all its mass sat at its centre, and here a ring moves off on average as if all its mass sat at its
centre. The recoil is $\tfrac12\matter M C^2/b^2$, which depends on the mass alone.

The total needs the average of $1/|b - w|^2$ round the circle. We multiply the two geometric series of
$1/(b - w)$ and $1/(b - w^*)$:

$$\frac{1}{|b - w|^2} = \frac{1}{b^2}\sum_{m=0}^\infty\sum_{n=0}^\infty\frac{w^m(w^*)^n}{b^{m+n}} .$$

Multiplying adds angles (chapter 1.5b), so $w^m(w^*)^n$ has the length $s^{m+n}$ and the angle $(m - n)\varphi$, and its
average round the circle is zero unless $m = n$. The terms with $m = n$ are $s^{2n}/b^{2n+2}$, so the average is
$\sum_n s^{2n}/b^{2n+2}$, which the geometric series sums to $1/(b^2 - s^2)$. We put this series into equation
[](#eq:pass). With the path along $z$, so that $s^2 = x^2 + y^2$, the term $n$ holds the integral
$\int\matter\Sigma\,s^{2n}\,\dd^2s = \int\matter\rho\,(x^2 + y^2)^n\,\dd V$, where $\dd V$ is a small volume (not the
speed $V$).

For a round body we can average over directions first. With $\theta$ the angle between a part's position and the
path, $x^2 + y^2 = r^2\sin^2\theta$. On a sphere, the band between the angles $\theta$ and $\theta + \dd\theta$ has
the share $\tfrac12\sin\theta\,\dd\theta$ of the whole area, so the average of $\sin^{2n}\theta$ over all
directions is

$$\bigl\langle\sin^{2n}\theta\bigr\rangle = \tfrac12\int_0^\pi\sin^{2n+1}\theta\,\dd\theta .$$

With $\cos\theta$ as the new variable, this is $\tfrac23$ for $n = 1$ and $\tfrac{8}{15}$ for $n = 2$. The density
does not depend on the direction, so $\int\matter\rho\,(x^2 + y^2)^n\,\dd V = \langle\sin^{2n}\theta\rangle
\int\matter\rho\,r^{2n}\,\dd V$. The first average is chapter 1.6's two thirds. So

$$\boxed{\;\begin{aligned}
\Delta E = \frac{C^2}{2}\Bigl[&\frac{\matter M}{b^2} + \frac{2}{3b^4}\int\matter\rho\,r^2\,\dd V\\
&+ \frac{8}{15b^6}\int\matter\rho\,r^4\,\dd V + \dots\Bigr].
\end{aligned}\;}$$

The first term is the recoil. The internal energy begins with $\int\matter\rho\,r^2\,\dd V$, the number that chapter
1.6 showed the steady field outside cannot see.

Now the paper's scene. The ball is steel, of density $7850\unit{kg\,m^{-3}}$, radius 0.5 m and mass 4110 kg, and the
tonne passes at $b = 1.5$ m from its centre. Equation [](#eq:pass), integrated in full, gives a total of
$8.8 \times 10^{-21}\unit{J}$. The recoil is $8.4 \times 10^{-21}\unit{J}$, 95 per cent of it, and it weighs the ball and
nothing else. The internal energy is $4.0 \times 10^{-22}\unit{J}$, a fifteenth of the mean kinetic energy of a single
atom at room temperature.[^kT]

What the ball gains, the tonne loses. Its kinetic energy $\tfrac12\matter\mu V^2$ falls by $\Delta E$, so its speed
falls by $\Delta E/\matter\mu V$, a fraction $\Delta E/\matter\mu V^2 = 4.5 \times 10^{-33}$ of itself: the paper's
"five parts in $10^{33}$". The share of the inside is $2.1 \times 10^{-34}$.

The paper sharpens this with a pair of bodies that the outside cannot tell apart. Body A is a thin shell of mass
$\matter M$ and radius $R/\sqrt2$. Body B has half its mass at a point at the centre and half on a thin shell of
radius $R$. Both are round, with the same mass, so they have the same field outside. Both have
$\int\matter\rho\,r^2\,\dd V = \tfrac12\matter MR^2$. A **quadrupolar** tide is an impulsive tide of chapter 1.7 whose
profile $g$ is of degree two in the position, such as $\tfrac12(x^2 - y^2)$. For a round body the energy it leaves
depends on the body only through $\int\matter\rho\,r^2\,\dd V$,[^quad] so every quadrupolar kick leaves the same energy
in A and in B.

The two bodies differ at $\int\matter\rho\,r^4\,\dd V$: $\tfrac14\matter MR^4$ for A and $\tfrac12\matter MR^4$ for B. A
pass at $b = 1.5R$ leaves the internal energies 0.080 and 0.104 in units of $\matter MC^2/2R^2$, 30 per cent apart. Far
away the two series first differ at their third term, by $\tfrac{C^2}{2}\cdot\tfrac{8}{15}\cdot\tfrac{\matter
MR^4}{4b^6} = \matter MC^2R^4/15b^6$, the paper's number. The later terms differ too: they make the true gap 8 per cent
larger at $b = 4R$ and 1.3 per cent larger at $b = 10R$. One pass tells apart two bodies that every steady reading and
every quadrupolar kick confuse.

::: try {#passing}
Predict first: as the passing mass moves farther away, which body keeps more of its internal energy, A (the shell) or
B (the point and the outer shell)? The drawing shows both bodies cut open, with arrows for the kicks of their parts
less the kick of the whole body, and a bead that marks where the path crosses the page. Bars and a chart give the
energy left inside each. Drag the bead or the slider from the paper's pass, $b = 1.5R$, where B keeps 30 per cent
more, out to $b = 4R$. Both energies fall steeply, as $1/b^4$, and the gap between them falls faster still, as
$1/b^6$.
:::

::: check
### Q

The crew of the space station float, though the Earth pulls them with 0.88 of its strength on the ground. Why?

### A

They and the station fall together, with the same acceleration, so neither moves relative to the other. Only the
tide, the difference of the pull across the cabin, remains.

### Q

A free orbit runs where the stretch along the line to the centre is $2 \times 10^{-6}\unit{s^{-2}}$. What is its
period?

### A

By equation [](#eq:tide-period), $T = 2\pi\sqrt{2/(2 \times 10^{-6})}\unit{s} = 6300\unit{s}$, about 105 minutes.

### Q

Why does a part of the body far along the path get the same kick as a part at the passing mass's point of closest
approach?

### A

The kick is the pull added over the whole pass. A part farther along feels the same pulse of pull, only later, and
shifting a pulse in time does not change its integral. The kick depends only on the distance from the path.

### Q

A passing mass moves twice as fast. What happens to the kick and to the energy left inside the body?

### A

The kick $2G\matter\mu/BV$ halves, because the pass lasts half as long. The energy goes as $C^2$, so it falls to a
quarter.

### Q

In a circular orbit, what is $K/U$, and what is $E/K$?

### A

$K/U = -\tfrac12$, and $E = K + U = -K$, so $E/K = -1$.
:::

**The idea to keep: the period of a free orbit is set by the tide where it runs. A fast passing mass gives every part
of a body a sideways kick $2G\matter\mu/BV$ that depends only on the part's distance from the path, so the energy the
pass leaves is a weighted sum of the body's projected mass, and its internal part reads what the steady field cannot.**

::: problems
### Practice

Two white dwarfs of $0.6$ solar masses each orbit each other once every 10 minutes. Find their separation and the
frequency of their gravitational waves, which is twice that of the orbit.

::: solution
For a pair, equation [](#eq:circle) holds with the total mass, $1.2 \times 1.989 \times 10^{30}\unit{kg}$. Solving for
the separation, $d = [G\matter M\,(T/2\pi)^2]^{1/3} = 1.13 \times 10^8\unit{m}$, or 113,000 km, about 18 Earth radii.
The orbit has the frequency $1/600\unit{s} = 1.67\unit{mHz}$, so the waves have 3.3 mHz: the millihertz of the
paper's Section XI.
:::

### Stretch

Show that for a uniform ball of mass $\matter M$ and radius $R$ the internal energy left by a pass at $b$ begins
$\tfrac{C^2}{2}\matter M\cdot\tfrac25R^2/b^4$, and evaluate it for the tonne and the steel ball. Then add the next term.

::: solution
For a uniform ball $\int\matter\rho\,r^2\,\dd V = \tfrac35\matter MR^2$ (chapter 1.6), so the second term of the series
is $\tfrac{2}{3b^4}\cdot\tfrac35\matter MR^2 = \tfrac25\matter MR^2/b^4$. With $C = 3.03 \times 10^{-12}\unit{m^2\,s^{-1}}$,
$\matter M = 4110\unit{kg}$, $R = 0.5\unit{m}$ and $b = 1.5\unit{m}$, it is $3.7 \times 10^{-22}\unit{J}$. The next term
uses $\int\matter\rho\,r^4\,\dd V = \tfrac37\matter MR^4$ and adds $\tfrac{C^2}{2}\cdot\tfrac{8}{15}\cdot\tfrac37
\matter MR^4/b^6 = 0.24 \times 10^{-22}\unit{J}$. Together they give $3.97 \times 10^{-22}\unit{J}$, against the full
$3.99 \times 10^{-22}\unit{J}$.
:::

### The paper

Derive the paper's equation [](/paper/#eq:pass) from the kick of equation [](#eq:kick), show that its recoil term is
$\matter M/b^2$ for any round body, and reproduce the paper's $\matter MC^2R^4/15b^6$ for the pair of
Figure [](/paper/#fig:passing).

::: solution
Each part over $\vect s$ gets $C(\vect b - \vect s)/|\vect b - \vect s|^2$ whatever its place along the path, so the
parts over a patch $\dd^2s$, of total mass $\matter\Sigma\,\dd^2s$, gain $\tfrac12\matter\Sigma\,\dd^2s\,C^2/|\vect b -
\vect s|^2$; adding the patches gives equation [](#eq:pass). For a round body, each ring of the projected body moves off
on average with the kick $C/b$ of its centre, because the powers $(w^*)^n$ with $n \ge 1$ average to zero round a
circle; so $v_{\rm cm} = C/b$ and the recoil is $\tfrac{C^2}{2}\matter M/b^2$, the first term. For the pair, the first
two terms agree. The third term holds $\int\matter\rho\,r^4\,\dd V$, which is $\matter M(R/\sqrt2)^4 = \tfrac14\matter
MR^4$ for A and $\tfrac12\matter M\cdot R^4$ for B. The difference is $\tfrac{C^2}{2}\cdot\tfrac{8}{15}\cdot\tfrac14
\matter MR^4/b^6 = \matter MC^2R^4/15b^6$.
:::
:::

::: paper
- [Section XIII](/paper/#sec:second-order), *A mass that passes*, gives the kick $C(\vect b - \vect s)/|\vect b -
  \vect s|^2$ with $C = 2G\matter\mu/V$, the energy of equation [](/paper/#eq:pass), the recoil, the series for a round
  body, the pair of Figure [](/paper/#fig:passing), and the tonne at $44\unit{km\,s^{-1}}$ that leaves five parts in
  $10^{33}$ slower.
- The paragraph before it, *An impulsive tide and a weighing*, gives equation [](/paper/#eq:push), the energy of any
  kick, which chapter 1.7 derives; for a body at rest it agrees with this chapter.
- [Section VII](/paper/#sec:no-lens) has the camera orbit a small black hole once every nine seconds, where the tide is
  $1\unit{s^{-2}}$.
- [Section XI](/paper/#sec:vistas) takes two black holes 2200 km apart, at a tenth of the speed of light, and pairs of
  white dwarfs that radiate at millihertz frequencies.
:::

::: deeper
- The GR course's lesson
  [Why an orbit keeps its angular momentum](https://neovand.github.io/general-relativity/chapter-16.html#orbit-conservation)
  sets up and solves the orbit equation that this chapter states, and its
  [section 16.6](https://neovand.github.io/general-relativity/chapter-16.html#16-6-mercury-a-resonant-correction-that-slowly-rotates-an-ellipse)
  with the [precession lab](https://neovand.github.io/general-relativity/chapter-16.html#orbital-precession-experience)
  shows how relativity turns the ellipse slowly round.
- The GR course's
  [section 5.8](https://neovand.github.io/general-relativity/chapter-5.html#5-8-check-that-the-action-remembers-newton)
  recovers Newton's orbits from the motion of free bodies in curved spacetime, and
  [section 17.5](https://neovand.github.io/general-relativity/chapter-17.html#17-5-the-photon-sphere-and-isco-three-radii-you-should-never-merge)
  shows where Newton's orbits fail near a black hole.
- James Binney and Scott Tremaine, *Galactic Dynamics* (2nd ed., Princeton, 2008), treat the impulse approximation of
  encounters and the heating of star clusters by passing masses.
:::

::: history
### Kepler, Newton and Spitzer

Johannes Kepler found the first two of his laws in Tycho Brahe's observations of Mars and published them in
*Astronomia nova* (1609); the third followed in *Harmonices mundi* (1619). Newton derived all three from his law of
gravity in the *Principia* (1687). In 1958 Lyman Spitzer used the impulse approximation of this chapter to show how
passing clouds of gas heat star clusters and slowly break them up [@Spitzer1958].
:::

[^year]: The year measured against the stars is 365.256 days. With the constants rounded to four figures,
    $1.327 \times 10^{20}$ and $1.496 \times 10^{11}$, the formula gives 365.28 days, 37 minutes too long. The period
    goes as $r^{3/2}$ and as $1/\sqrt{G\matter M}$, so a change in the fourth figure of either moves it by minutes.

[^twice]: The pair looks the same after half a turn, so its waves repeat twice in each orbit. Chapter 7.7 derives
    this.

[^binary]: Newton's law is only an approximation here. Its corrections are of the size $G\matter M/c^2d$, which equals
    $(v_{\rm rel}/c)^2$ with $v_{\rm rel}$ the speed of one hole relative to the other: 0.04 for this pair. The numbers
    hold to a few per cent, and the gap between 34,400 km and the paper's 35,000 km is inside that.

[^mu]: The paper writes $\mu$ for the passing mass in Section XIII and for the rigidity of a solid in Sections IV and
    VI; the two never meet.

[^C]: The paper also writes $C$ for the moment of inertia in Section VIII and for a capacity in Section IV. Here it is
    always $2G\matter\mu/V$.

[^ring]: The paper's steel ball of radius 10 cm rings in its slowest way near 15 kHz (Section IV). The frequency of a
    ringing scales as one over the size, so a ball of radius 0.5 m rings near 3 kHz, a period of 330 μs. The pass, of
    45 to 91 μs, is then a seventh to a quarter of a period, so the parts held by their neighbours do not stay quite
    still. Driving the ringing with the tonne's full tide shows that the frozen estimate of the internal energy is off
    by about 10 to 15 per cent, probably too low. The recoil, most of the total, does not depend on how the parts are
    held.

[^push]: Chapter 1.7 derives the paper's equation [](/paper/#eq:push), the energy that any impulsive tide gives a body
    that may already be moving. For a body at rest its first term vanishes, and with the impulse of equation
    [](#eq:kick) it gives equation [](#eq:pass). In the paper's words the pass is "the impulsive tide of profile
    $-\ln|\vect s - \vect b|$": the gradient of $-C\ln|\vect s - \vect b|$ with respect to $\vect s$ is the kick, and
    the logarithm is harmonic in the plane, away from $\vect b$. Here the profile has no unit and the strength is $C$,
    in $\mathrm{m^2\,s^{-1}}$; in chapter 1.7's example $\tfrac12(x^2 - y^2)$ the profile is in square metres and the
    strength in $\mathrm{s^{-1}}$. Only their product has a fixed unit.

[^kT]: That mean kinetic energy is $\tfrac32k_B \times 300\unit{K} = 6.2 \times 10^{-21}\unit{J}$, where
    $k_B = 1.38 \times 10^{-23}\unit{J\,K^{-1}}$ is Boltzmann's constant; chapter 4.2 explains it.

[^quad]: Write the profile as $g = \tfrac12x_iQ_{ij}x_j$, with $Q_{ij}$ a symmetric trace-free table of numbers.
    Chapter 1.7 found the energy $\tfrac12\epsilon^2\int\matter\rho\,|\nabla g|^2\,\dd V$ for a body at rest, and here
    $|\nabla g|^2 = Q_{ik}Q_{jk}x_ix_j$. Chapter 1.6 showed that a round body has
    $\int\matter\rho\,x_ix_j\,\dd V = \tfrac13\delta_{ij}\int\matter\rho\,r^2\,\dd V$, so the energy is
    $\tfrac16\epsilon^2Q_{ij}Q_{ij}\int\matter\rho\,r^2\,\dd V$.
