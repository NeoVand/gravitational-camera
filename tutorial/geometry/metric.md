---
id: '7.1'
title: 'The metric, proper time and free fall'
question: 'The paper says that "at any single point, therefore, the effect of gravity can be cancelled by falling freely". If falling cancels gravity, what is gravity, and why does a clock higher up run faster?'
part: '7'
requires: ['1.2', '1.4', '1.6', '6.1', '6.2']
paper: [sec:pixel, eq:tidal, eq:deviation, eq:newton, sec:near-field, sec:introduction, sec:no-lens, sec:vistas]
figures: [fig:tidal]
live: [longest-path]
depth: A
---

An astronaut in orbit floats beside her spacecraft. The paper's [Section II](/paper/#sec:pixel) begins with her, and its
plain words conclude: "At any single point, therefore, the effect of gravity can be cancelled by falling freely." The
body of the section starts from the same fact, "A freely falling observer feels no gravitational field at their own
position", and defines the tide for "an observer at rest, with proper time $t$ and coordinates $x^0 = ct$":

{{paper eq:tidal}}

Here $\curv{\tE}_{ij}$ is the tide, and $R_{0i0j}$ are entries of the Riemann curvature tensor, a table built from
second derivatives of the metric, which chapter 7.2 constructs. This chapter builds what that table is made of: the
metric, the observer's proper time $t$ and the coordinates.

In Newton's theory, as chapter [1.4](/tutorial/newton/tides/) showed, falling cancels the pull of gravity because every
body falls alike. But a clock on a shelf runs faster than the same clock on the floor. So we ask: if falling cancels
gravity, what is gravity, and why does a clock higher up run faster? Einstein's answer is that gravity is the metric, a
table of numbers at every event that says what clocks and rulers measure. The paper needs it twice: its tide is defined
with the observer's own clock, and its [*Other gravitational sensors*](/paper/#par:other-gravitational-sensors) are
clocks "reading the potential itself".

::: plain
Everything falls in the same way, whatever it is made of, so nothing inside a closed room that falls freely can feel
gravity. This works only at one place: across the room the pull changes a little, and that change, the tide, remains.

Einstein concluded that gravity is not a force but a table of numbers at every place and moment, called the metric,
which says how much time a clock records and how much distance a ruler measures. A body that falls freely follows the
path along which its own clock records the most time.

From this rule and Newton's law, one number of the metric can be found. It shows that a clock higher up runs faster, by
the difference in the gravitational potential (the energy per kilogram that height gives) divided by the square of the
speed of light. Near the ground that is about one part in $10^{16}$ for each metre of height, and atomic clocks measure
it.
:::

## Falling cancels gravity at a point, and only there

Everything here rests on one fact of experiment, which we state without proof. **At a given place, every body falls with
the same acceleration, whatever its mass and whatever it is made of.** The most precise test is that of the satellite
MICROSCOPE, which kept four hollow cylinders in free fall around the Earth for about two and a half years, from 2016 to
2018: a pair of a titanium alloy and a platinum alloy for the test, and a pair of the platinum alloy as a reference. The
two metals fell alike to within about three parts in $10^{15}$ (P. Touboul and colleagues, *Physical Review Letters*
129, 121102, 2022). Earlier tests are in the history box below.

Chapter 1.4 drew the consequence. Two free balls at $\vect x$ and $\vect x + \vect\xi$ each accelerate by the field at
their own place, so their separation $\vect\xi$ changes only by the difference of the field between them. In a box that
falls freely and does not turn, the uniform part of gravity therefore does nothing: a ball released at rest stays at
rest, and a ball pushed moves straight at a steady speed.

We make this a definition. A **local inertial frame** at an event is the frame of a box that falls freely and does not
turn, small enough and used for a short enough time that the change of the field across it can be neglected. Free bodies
in it move as in the inertial frames of chapter
[6.1](/tutorial/relativity/lorentz/#every-observer-measures-the-same-speed-of-light). The cabin of the International
Space Station is an example, over a few metres and a short time. A room on the ground is a non-example: a ball released
in it falls at $9.81\unit{m\,s^{-2}}$, and its floor pushes everything on it upward.

The box cannot remove the tide. Take the box near the ground, falling freely for 3 s, in which time it drops 44 m.
Inside it two balls are released at rest, one a metre above the other. The Earth's tide, $2G\matter M/R^3 = 3.08 \times
10^{-6}\unit{s^{-2}}$, with $\matter M$ and $R$ the Earth's mass and radius (chapter
[1.4](/tutorial/newton/tides/#on-the-ground-the-earths-own-tide-is-far-larger-but-steady)), gives them a relative
acceleration of $3.08 \times 10^{-6}\unit{m\,s^{-2}}$, so in 3 s they separate by

$$\tfrac12 \times 3.08 \times 10^{-6}\unit{m\,s^{-2}} \times (3\unit{s})^2 = 1.4 \times 10^{-5}\unit{m} ,$$

or 14 micrometres, about a seventh of the thickness of a sheet of paper. This is how small the box must be: for balls 1
cm apart the drift is a seventh of a micrometre, and the box is a local inertial frame to that accuracy.

Einstein turned the fact into a principle, which we also state without proof. The **equivalence principle**, in
Einstein's form, says that **in a local inertial frame every law of physics takes the form it has in special
relativity**: clocks tick as in chapter 6.1, light travels at $c$ in straight lines, and the dot product of chapter 6.2
measures intervals. It extends chapter 1.4's equal fall of bodies to clocks and light.

::: history
### Einstein's happiest thought

Galileo and Newton found that bodies fall alike to about a part in a thousand, and Eötvös, with a torsion balance, to a
few parts in a billion (chapter
[1.4](/tutorial/newton/tides/#falling-together-cancels-the-pull-but-not-its-difference)'s history box). In 1907, while
writing a review of relativity, Albert Einstein realized that for a person falling freely from a roof there is no
gravitational field nearby. A manuscript of 1920 (his *Collected Papers*, volume 7) calls this "the happiest thought of
my life". In the review he found that a clock lower down runs slower by the fraction $\Delta\field\Phi/c^2$, and in 1911
that light bends near the Sun, by half the value of his full theory of 1915.
:::

## A clock's own time is set by the metric

We want the time a clock records along any path with gravity present, because the paper's $t$ is such a time. Without
gravity, chapter
[6.1](/tutorial/relativity/lorentz/#a-moving-clock-runs-slow-and-a-clocks-own-time-is-the-length-of-its-path) found that
a clock moving at the speed $\obs v$ through an inertial frame records the **proper time**
$\sym{proper-time}{\obs\tau}$, in seconds, at the rate $\dd\obs\tau = \dd t\sqrt{1 - \obs v^2/c^2}$.[^letters] We square
it and use $\dd\vect x = \obs{\vect v}\,\dd t$. In the notation of chapter
[6.2](/tutorial/relativity/spacetime-vectors/#the-minkowski-metric-measures-the-interval-with-one-minus-sign-for-time),
with $x^0 = ct$ and the Minkowski metric $\sym{minkowski-metric}{\field\eta}_{\mu\nu} = \mathrm{diag}(-1, 1, 1, 1)$, the
result is

$$c^2\dd\obs\tau^2 = c^2\dd t^2 - |\dd\vect x|^2 = -\field\eta_{\mu\nu}\,\dd x^\mu\dd x^\nu .$$

With gravity, one inertial frame cannot cover a large region, because boxes falling freely over the two poles accelerate
in opposite directions. So we label events by four **coordinates** $x^\mu$, with $x^0 = ct$ and three of place, chosen
for convenience: for example a grid tied to the Earth and the time $t$ of a clock far away. Coordinates are only labels,
and the difference of two labels does not by itself say how much time a clock records.

A table of numbers at each event does. The **metric** $\sym{spacetime-metric}{\field g}_{\mu\nu}(x)$ is a symmetric
table of four rows, with ten independent entries (chapter
[6.2](/tutorial/relativity/spacetime-vectors/#a-tensor-is-a-table-whose-every-index-changes-with-the-boost)) that may
change from event to event, such that along the path of any clock

$$\boxed{\;c^2\dd\obs\tau^2 = -\field g_{\mu\nu}(x)\,\dd x^\mu\dd x^\nu\;} \label{eq:proper-time}$$

with both indices summed. The expression $\field g_{\mu\nu}\dd x^\mu\dd x^\nu$ is the **line element**, written $\dd
s^2$. For two marks that a ruler measures at one coordinate time, $\dd x^0 = 0$, and $\dd s^2 = \field g_{ij}\dd x^i\dd
x^j$ is their squared distance (when $\field g_{0i} = 0$, as in every metric of this chapter). Both sides of
[](#eq:proper-time) are in square metres. So when every coordinate is a length, as with $x^0 = ct$ and a grid in metres,
the entries of $\field g_{\mu\nu}$ are pure numbers; with other coordinates an entry carries the unit that makes its
term a squared length.

**How the metric is measured.** With clocks and rulers, and nothing else. A clock at rest has $\dd x^i = 0$, so
[](#eq:proper-time) gives

$$\frac{\dd\obs\tau}{\dd t} = \sqrt{-\field g_{00}} :$$

the entry $\field g_{00}$ is read by comparing the clock at that place with the clock that defines $t$. Rulers, and
clocks moving in other directions, give the other entries.

**An example.** In flat spacetime, with the coordinates of an inertial frame, $\field g_{\mu\nu} = \field\eta_{\mu\nu}$
at every event, and [](#eq:proper-time) is chapter 6.1's proper time.

**A non-example.** On a flat sheet, with the polar coordinates $r$ (distance from a centre, in metres) and $\theta$
(angle, a pure number), a small step has the squared length

$$\dd s^2 = \dd r^2 + r^2\dd\theta^2 ,$$

so $\field g_{rr} = 1$ and $\field g_{\theta\theta} = r^2$, which is in square metres and grows with $r$. The sheet is
flat; only the labels spread apart. A metric that varies is therefore not, by itself, a sign of gravity, and chapter 7.2
finds the quantity that tells the two apart.

**The inverse metric** $\sym{inverse-spacetime-metric}{\field g}^{\mu\nu}$ is the inverse matrix, $\field
g^{\mu\alpha}\field g_{\alpha\nu} = \delta^\mu{}_\nu$, and it raises an index as $\field\eta$ did in chapter
[6.2](/tutorial/relativity/spacetime-vectors/#lowering-an-index-changes-only-the-sign-of-time). For a diagonal metric
each of its entries is one over the matching entry of $\field g_{\mu\nu}$: in polar coordinates $\field g^{\theta\theta}
= 1/r^2$.

**The four-velocity.** A clock's four-velocity is $\sym{four-velocity}{\obs u}^\mu = \dd x^\mu/\dd\obs\tau$, as in
chapter [6.2](/tutorial/relativity/spacetime-vectors/#the-four-velocity-has-the-same-length-for-every-body), in metres
per second when the coordinates are lengths. Dividing [](#eq:proper-time) by $\dd\obs\tau^2$ gives

$$\field g_{\mu\nu}\,\obs u^\mu\obs u^\nu = -c^2 , \label{eq:unit}$$

as in chapter 6.2 with the metric in place of $\field\eta_{\mu\nu}$. An observer at rest has $\obs u^i = 0$, so $\field
g_{00}(\obs u^0)^2 = -c^2$ and

$$\obs u^\mu = \Bigl(\frac{c}{\sqrt{-\field g_{00}}},\ 0,\ 0,\ 0\Bigr) .$$

**The paper's observer at rest.** The paper's [](/paper/#eq:tidal) is written for "an observer at rest, with proper time
$t$", so its $t$ is the time on that observer's own clock. In a static field $\sqrt{-\field g_{00}}$ does not change
along the observer's worldline, so changing from the far clock's time to the observer's own changes the unit of $t$ by a
constant factor, and makes $\field g_{00} = -1$ at the observer's place.

An observer at rest on the ground is not in free fall, because its support pushes it up. The paper's pixel is such an
observer, and the free test masses inside it fall relative to its case. The tide is their relative acceleration, so the
push on the case does not enter it.

From here on, $t$ in this chapter is the far clock's time, the coordinate time in which the metric is written.

## Free fall is the path along which a clock ages most

We want $\field g_{00}$ near ordinary masses, because slow bodies feel it, and because it makes exact the "weak field"
of chapter [1.2](/tutorial/newton/field-and-potential/#gravity-pulls-with-a-force-proportional-to-both-masses). We find
it from Newton's law, with three assumptions.

**Free fall maximizes proper time.** Chapter 6.1 found that in flat spacetime the unaccelerated path between two events
has the longest proper time. Free bodies move unaccelerated in a local inertial frame, so we take this as the law of
motion with gravity: **between two events, a freely falling body follows the path along which its own clock records the
most time**, compared with every nearby path.

**The field is weak and static.** We write

$$\field g_{00} = -\Bigl(1 + \frac{2\field\phi}{c^2}\Bigr), \qquad \field g_{0i} = 0 ,$$

with $\field\phi(\vect x)$ a function of place that does not change in time, in joules per kilogram, so that
$\field\phi/c^2$ is a pure number. This form is an assumption, which Newton's law will test. It says that the field is
static, that it has no mixed entries (as for masses at rest), and that $\field g_{00}$ stays close to $-1$, so that
$|\field\phi|/c^2 \ll 1$. Any such $\field g_{00}$ can be written in this form, and the factor 2 makes a clock's rate
$\sqrt{-\field g_{00}}$ equal to $1 + \field\phi/c^2$ to first order. We write $\field\phi$, not $\field\Phi$, because
we do not yet know that it is the potential.

**The motion is slow**, $\obs v^2/c^2 \ll 1$. We also set $\field g_{ij} = \delta_{ij}$, which is an approximation. The
true spatial entries differ from $\delta_{ij}$ by about $2|\field\phi|/c^2$, but a slow body crosses little space while
$x^0$ advances, so the error in its proper time is only of order $\obs v^2\field\phi/c^4$, which is enough for slow
bodies.[^spatial] The approximation fails for light, and this is why light bends twice as much as $\field g_{00}$ alone
would make it bend ([](#light-follows-paths-on-which-no-proper-time-passes)).

We describe the path by its place $\vect x(t)$, so $\dd x^0 = c\,\dd t$ and $\dd x^i = \obs v^i\dd t$. Then
[](#eq:proper-time) gives $c^2\dd\obs\tau^2 = (1 + 2\field\phi/c^2)c^2\dd t^2 - |\dd\vect x|^2$, and

$$\obs\tau = \int\sqrt{1 + \frac{2\field\phi}{c^2} - \frac{\obs v^2}{c^2}}\;\dd t .$$

Both terms under the root are small, and for a small number $\epsilon$, $\sqrt{1 + \epsilon} \approx 1 + \epsilon/2$
with an error of about $\epsilon^2/8$: near the Earth $\epsilon$ is about $10^{-9}$, so the error is a part in
$10^{19}$. To first order,

$$\begin{aligned}\obs\tau &\approx \int\Bigl(1 + \frac{\field\phi}{c^2} - \frac{\obs v^2}{2c^2}\Bigr)\dd t\\
&= (t_2 - t_1) - \frac{1}{c^2}\int_{t_1}^{t_2}\Bigl(\tfrac12\obs v^2 - \field\phi\Bigr)\dd t .\end{aligned}$$

The two events fix $t_1$ and $t_2$, so the path with the largest $\obs\tau$ is the one that makes the integral
$\int(\tfrac12\obs v^2 - \field\phi)\,\dd t$ smallest. The box below finds such a path for any integrand, and for ours the
result is

$$\ddot{\vect x} = -\nabla\field\phi .$$

::: derivation
### The path that makes an integral smallest

We want the path $\vect x(t)$, from $\vect x_1$ at $t_1$ to $\vect x_2$ at $t_2$, that makes

$$S = \int_{t_1}^{t_2}L(\vect x, \dot{\vect x})\,\dd t$$

smallest, where $L$ is any function of the place and the velocity; ours is $L = \tfrac12|\dot{\vect x}|^2 -
\field\phi(\vect x)$, and a dot means a derivative with respect to $t$. Take a nearby path with the same ends, $\vect
x(t) + \epsilon\,\vect y(t)$, where $\vect y(t)$ is any smooth change of shape with $\vect y(t_1) = \vect y(t_2) = 0$
and $\epsilon$ is a small number. For the best path, $S$ as a function of $\epsilon$ is smallest at $\epsilon = 0$, so
its derivative there is zero, for every $\vect y$.

We differentiate under the integral by the chain rule of chapter 1.2, with $i$ summed over 1, 2, 3:

$$\frac{\dd S}{\dd\epsilon}\Big|_{\epsilon=0} = \int_{t_1}^{t_2}\Bigl(\frac{\partial L}{\partial x_i}\,y_i +
\frac{\partial L}{\partial\dot x_i}\,\dot y_i\Bigr)\dd t .$$

Integrating the second term by parts moves the derivative off $y_i$:

$$\int_{t_1}^{t_2}\frac{\partial L}{\partial\dot x_i}\,\dot y_i\,\dd t = \Bigl[\frac{\partial L}{\partial\dot
x_i}\,y_i\Bigr]_{t_1}^{t_2} - \int_{t_1}^{t_2}\Bigl(\frac{\dd}{\dd t}\frac{\partial L}{\partial\dot x_i}\Bigr)y_i\,\dd t
.$$

The bracket is zero, because $\vect y$ vanishes at both ends. So

$$\frac{\dd S}{\dd\epsilon}\Big|_{\epsilon=0} = \int_{t_1}^{t_2}\Bigl(\frac{\partial L}{\partial x_i} -
\frac{\dd}{\dd t}\frac{\partial L}{\partial\dot x_i}\Bigr)y_i\,\dd t = 0$$

for every such $\vect y$. Choose each $y_i$ equal to the bracket that multiplies it times a function $f(t)$ that is
positive between the ends and zero at them. The integrand becomes $f$ times the sum of the squared brackets, which is
never negative, so the integral is zero only if every bracket vanishes at every time:

$$\frac{\dd}{\dd t}\frac{\partial L}{\partial\dot x_i} = \frac{\partial L}{\partial x_i} ,$$

the **Euler–Lagrange equation**. Its derivation used neither the number of coordinates nor the fact that the label along
the path is a time, so it holds for any number of coordinates and any label. For our $L$, $\partial L/\partial\dot x_i =
\dot x_i$ and $\partial L/\partial x_i = -\partial_i\field\phi$, which gives $\ddot{\vect x} = -\nabla\field\phi$.

The steps show only that the derivative of $S$ is zero, so the same equation holds for a largest value, a smallest one
or a saddle. The tossed clock below checks that the free path gives the largest proper time.
:::

Newton's law for a body that only gravity acts on is $\ddot{\vect x} = -\nabla\field\Phi$, with
$\sym{potential}{\field\Phi}$ the gravitational potential of chapter
[1.2](/tutorial/newton/field-and-potential/#a-potential-is-one-number-per-point-whose-downhill-slope-is-the-field), in
joules per kilogram. The two laws agree for every body only if $\nabla\field\phi = \nabla\field\Phi$, so $\field\phi =
\field\Phi + C$ with a constant $C$. Far from every mass spacetime is flat and the coordinates can be inertial, with
$\field g_{00} = -1$, so $\field\phi$ is zero far away, as $\field\Phi$ is in chapter 1.2, and $C = 0$:

$$\boxed{\;\field g_{00} = -\Bigl(1 + \frac{2\field\Phi}{c^2}\Bigr)\;} \label{eq:g00}$$

The difference from the flat metric is the **metric perturbation** $\sym{metric-perturbation}{\field h}_{\mu\nu} =
\field g_{\mu\nu} - \field\eta_{\mu\nu}$, a table of small numbers, the quantity that chapter
[5.2](/tutorial/waves/retarded-waves/) promised. Its first entry is $\field h_{00} = -2\field\Phi/c^2$, a pure number,
since $\field\Phi$ is in $\mathrm{J\,kg^{-1}} = \mathrm{m^2\,s^{-2}}$. Chapter 7.4 derives the other entries.

**Weak, in numbers.** The field is **weak** when $|\field h_{00}| = 2|\field\Phi|/c^2 \ll 1$, and the motion slow when
$\obs v^2/c^2 \ll 1$: chapter 1.2's conditions for Newton's law, made exact. The ratio $|\field\Phi|/c^2 = G\matter
M/rc^2$ is $5.2 \times 10^{-26}$ a metre from the paper's person of 70 kg, $6.96 \times 10^{-10}$ at the Earth's surface
(chapter 1.2's $7.0 \times 10^{-10}$) and $2.12 \times 10^{-6}$ at the Sun's. At the surface of a neutron star of 1.4
solar masses and a radius of 12 km it is $0.17$, so the dropped terms, of order $(\field\Phi/c^2)^2 = 0.03$, are a sixth
of the kept one, and the weak field fails.

**A check: the tossed clock.** A clock is thrown straight up and caught at the same place $T = 2\unit{s}$ later, so the
throw and the catch are two events at one place, $T$ apart in coordinate time. A twin clock stays on the ground. In free
flight the clock's height is $z(t) = \tfrac12gt(T - t)$, which rises to $gT^2/8 = 4.9\unit{m}$, and its speed is $\obs v
= g(T/2 - t)$, with $g = 9.81\unit{m\,s^{-2}}$, the measured acceleration of fall. Near the ground $\field\Phi(z) -
\field\Phi(0) = gz$ (chapter
[1.2](/tutorial/newton/field-and-potential/#the-work-done-by-gravity-depends-only-on-the-ends-of-the-path)), so the
first-order proper time gives the tossed clock's gain over its twin,

$$\Delta\obs\tau = \frac{1}{c^2}\int_0^T\Bigl(gz - \tfrac12\obs v^2\Bigr)\dd t .$$

With $\int_0^Tt(T - t)\,\dd t = T^3/6$ and $\int_0^T(T/2 - t)^2\,\dd t = T^3/12$, the two terms integrate to $g^2T^3/12$
and $g^2T^3/24$, and

$$\boxed{\;\Delta\obs\tau = \frac{g^2T^3}{24c^2}\;} \label{eq:tossed}$$

in seconds, since $g^2T^3$ is in $\mathrm{m^2\,s^{-1}}$. For $T = 2\unit{s}$ it is $9.81^2 \times 2^3/[24 \times (2.998
\times 10^8)^2]\unit{s} = 3.57 \times 10^{-16}\unit{s}$, the time light takes to cross a tenth of a micrometre. The
tossed clock ages more.

Now compare other paths between the same two events. A clock carried on the path $a\,z(t)$, which rises $a$ times as
high, has $a$ times the height and $a$ times the speed at each moment, so the first integral grows by $a$ and the second
by $a^2$, and its gain is

$$\Delta\obs\tau_a = (2a - a^2)\,\frac{g^2T^3}{24c^2} .$$

This is largest at $a = 1$, the free path. A path that rises half as high, $a = \tfrac12$, or 1.5 times as high, $a =
\tfrac32$, gains $\tfrac34$ as much, $2.68 \times 10^{-16}\unit{s}$,[^exact] and $a = 0$ is the clock that stays on the
ground. A clock that rises higher spends its time where clocks run faster, but it must move faster to get there and
back, and speed slows a clock; the free path strikes the balance that ages most (Figure
[](#fig:tossed-paths)).

![Look first at the solid curve: of all paths between the throw and the catch, the clock in free fall ages most. The
numbers are each path's gain over the clock that stays on the ground, in units of $10^{-16}\unit{s}$; the dashed
paths, though one rises higher, gain only three quarters as much.](tut-metric-tossed){#fig:tossed-paths}

::: try {#longest-path}
The tossed clock's two events, the throw and the catch, on a plane of height against coordinate time. Three handles
shape a path between them, and the free-fall parabola is drawn faintly for comparison. The readouts give the proper
time that your path and free fall each gain over a clock that stays on the ground, in units of $10^{-16}\unit{s}$, and
their ratio; *fall freely* puts the handles on the parabola. The sliders set the flight time $T$ and the acceleration
of fall $g$, with stops for the Earth, the Moon and a neutron star.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, find a
path that rises higher than the ball and still gains less than the clock on the ground.
:::

**What it means.** A falling body is not pushed by a force. It takes the path along which its own clock runs longest,
and near a mass, where clocks deeper down run slower, that path curves the way Newton's pull would bend it.

## Clocks higher up run faster: clocks read the potential

We want to compare two clocks at rest at heights 0 and $h$, because the paper's clocks "reading the potential itself"
make this comparison. The lower one sends a flash of light up to the upper one at each of its ticks. We assume that
**the field does not change in time**: the metric does not depend on $t$. Then every flash follows the same path, only
shifted in $t$, and takes the same coordinate time to climb, so two flashes that leave $\Delta t$ apart arrive $\Delta
t$ apart (Figure [](#fig:clocks-flashes)).

![Look first at the two brackets: they span the same coordinate time $\Delta t$, because the field does not change
and the second flash is a copy of the first. The clocks' own times across them differ by the fraction
$[\field\Phi(h) - \field\Phi(0)]/c^2$, so the upper clock records more.](tut-metric-clocks){#fig:clocks-flashes}

Each clock is at rest, so its own time is $\dd\obs\tau = \sqrt{-\field g_{00}}\,\dd t \approx (1 + \field\Phi/c^2)\,\dd
t$, by [](#eq:g00). Between the two flashes the lower clock records $(1 + \field\Phi(0)/c^2)\Delta t$ and the upper one
$(1 + \field\Phi(h)/c^2)\Delta t$. We divide and keep the first order in the small numbers:

$$\boxed{\;\frac{\dd\obs\tau_{\rm upper}}{\dd\obs\tau_{\rm lower}} = 1 + \frac{\field\Phi(h) - \field\Phi(0)}{c^2}
\approx 1 + \frac{gh}{c^2}\;} \label{eq:rate}$$

where the last step uses $\field\Phi(h) - \field\Phi(0) = gh$ near the ground; $gh/c^2$ is a pure number. The upper
clock records more time between two flashes than the lower one took to send them, so to it the lower clock runs slow,
and the light arrives with its frequency lowered by the fraction $gh/c^2$. This is the **gravitational redshift**. Light
that falls is raised in frequency by the same fraction.[^doppler]

**Numbers.** For one metre of height, $gh/c^2 = 9.81/(2.998 \times 10^8)^2 = 1.09 \times 10^{-16}$, chapter
[1.2](/tutorial/newton/field-and-potential/#a-potential-is-one-number-per-point-whose-downhill-slope-is-the-field)'s
$1.1 \times 10^{-16}$: a clock on a shelf a metre up gains 9.4 picoseconds a day on one on the floor. C. W. Chou and
colleagues raised one of two aluminium-ion clocks by 33 cm and found that it ran faster by $(4.1 \pm 1.6) \times
10^{-17}$, against the predicted $gh/c^2 = 3.6 \times 10^{-17}$ (*Science* 329, 1630, 2010).[^towers]

**GPS.** A satellite of the Global Positioning System circles the Earth at $r = 26{,}560\unit{km}$ from its centre. For
a clock moving at the speed $\obs v$ through a weak static field, the first-order proper time of
[](#free-fall-is-the-path-along-which-a-clock-ages-most) gives the rate

$$\frac{\dd\obs\tau}{\dd t} \approx 1 + \frac{\field\Phi}{c^2} - \frac{\obs v^2}{2c^2} .$$

Against a clock on the ground, at $R = 6371\unit{km}$, the satellite sits higher in the potential by $G\matter M(1/R -
1/r)$, with $G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$, which gains $45.7\,\mu$s a day. On a circular orbit
$\obs v^2 = G\matter M/r$, so the satellite moves at $3.87\unit{km\,s^{-1}}$, and its motion loses $7.2\,\mu$s a day.
The net gain, $38.5\,\mu$s a day ($38.6\,\mu$s in a fuller account by N. Ashby, *Living Reviews in Relativity* 6, 1,
2003), is the time light takes to travel 11.5 km, so the satellites' clocks are built to tick slow by this fraction.

**Sea level and the Sun.** The same rate shows that every clock at sea level ticks at the same rate, and that the Sun's
gravity and the Earth's orbital motion slow the Earth's clocks by $1.48 \times 10^{-8}$, about half a second a year, as
chapter 6.1 quoted.[^sea]

**A limit.** With no field every clock at rest keeps the same rate, as in chapter 6.1, and far from every mass
$\dd\obs\tau/\dd t \to 1$. A uniform field is not such a limit, because $\field\Phi = gz$ still grows with height.

**What it means.** A clock's rate is set by the potential $\field\Phi$ itself, not by its slope (the field) or its
second derivatives (the tide). This is the sense of the paper's [*Other gravitational
sensors*](/paper/#par:other-gravitational-sensors): pixels linked into one array "could compare clocks, reading the
potential itself". Only differences are read, because two clocks are compared.

## Free bodies follow geodesics, and the Christoffel symbols hold Newton's pull

We want the law of free fall in any metric and any coordinates, because the paper's curvature is built from the symbols
that appear in it. A **geodesic** is a path whose proper time does not change, to first order, when the path is changed
slightly with its ends fixed: the straightest path that spacetime allows. Free bodies follow geodesics. The box below
applies the Euler–Lagrange equation to [](#eq:proper-time) and finds the **geodesic equation**

$$\boxed{\;\frac{\dd^2x^\mu}{\dd\obs\tau^2} + \Gamma^\mu{}_{\alpha\beta}\,\frac{\dd x^\alpha}{\dd\obs\tau}\frac{\dd
x^\beta}{\dd\obs\tau} = 0\;} \label{eq:geodesic}$$

with

$$\sym{christoffel}{\Gamma^\mu{}_{\alpha\beta}} = \tfrac12\,\field g^{\mu\nu}\bigl(\partial_\alpha\field g_{\nu\beta} +
\partial_\beta\field g_{\nu\alpha} - \partial_\nu\field g_{\alpha\beta}\bigr) , \label{eq:christoffel}$$

where $\partial_\alpha = \partial/\partial x^\alpha$. The numbers $\Gamma^\mu{}_{\alpha\beta}$ are the **Christoffel
symbols**.[^gamma] They are symmetric in their lower indices, because the bracket is, so at each event there are $4
\times 10 = 40$ of them. When every coordinate is a length they are in $\mathrm{m^{-1}}$, and each term of
[](#eq:geodesic) is in $\mathrm{m\,s^{-2}}$; with other coordinates their units follow the coordinates. In flat
spacetime with inertial coordinates every symbol vanishes. The paper's convention for the curvature, stated after the
paper's [](/paper/#eq:tidal), is $R^\alpha{}_{\beta\gamma\delta} = \partial_\gamma\Gamma^\alpha{}_{\beta\delta} -
\dots$: a derivative of a Christoffel symbol, followed by terms that chapter 7.2 supplies.

::: derivation
### The geodesic equation from the longest proper time

We label the events of a path by any number $\lambda$ that increases along it, and write $\dot x^\mu = \dd
x^\mu/\dd\lambda$. By [](#eq:proper-time) the proper time along the path is

$$\obs\tau = \frac1c\int L\,\dd\lambda, \qquad L = \sqrt{-\field g_{\mu\nu}(x)\,\dot x^\mu\dot x^\nu} .$$

The Euler–Lagrange equation of the box in [](#free-fall-is-the-path-along-which-a-clock-ages-most) holds for any number
of coordinates and any label. With the four coordinates $x^\alpha$ and the label $\lambda$ it reads

$$\frac{\dd}{\dd\lambda}\frac{\partial L}{\partial\dot x^\alpha} = \frac{\partial L}{\partial x^\alpha} .$$

The derivative of $\field g_{\mu\nu}\dot x^\mu\dot x^\nu$ with respect to $\dot x^\alpha$ is $2\field g_{\alpha\nu}\dot
x^\nu$, because $\field g$ is symmetric, so

$$\frac{\partial L}{\partial\dot x^\alpha} = -\frac{\field g_{\alpha\nu}\dot x^\nu}{L}, \qquad \frac{\partial L}{\partial
x^\alpha} = -\frac{(\partial_\alpha\field g_{\mu\nu})\,\dot x^\mu\dot x^\nu}{2L} .$$

With the derivatives taken, we choose the label to be the proper time, $\lambda = \obs\tau$. Then $\dot x^\mu = \obs
u^\mu$, and by [](#eq:unit) $L = c$ at every point, so $L$ comes outside the derivative. We multiply both sides by $-c$:

$$\frac{\dd}{\dd\obs\tau}\bigl(\field g_{\alpha\nu}\obs u^\nu\bigr) = \tfrac12\,(\partial_\alpha\field
g_{\mu\nu})\,\obs u^\mu\obs u^\nu .$$

On the left, the product rule and the chain rule, $\dd\field g_{\alpha\nu}/\dd\obs\tau = (\partial_\beta\field
g_{\alpha\nu})\,\obs u^\beta$, give

$$\field g_{\alpha\nu}\frac{\dd\obs u^\nu}{\dd\obs\tau} + (\partial_\beta\field g_{\alpha\nu})\,\obs u^\beta\obs u^\nu
= \tfrac12\,(\partial_\alpha\field g_{\beta\nu})\,\obs u^\beta\obs u^\nu ,$$

with the summed letters on the right renamed $\beta\nu$. In the second term on the left the summed letters $\beta$ and
$\nu$ can be exchanged, so we write it as half of itself plus half of the exchanged form, $\tfrac12(\partial_\beta\field
g_{\alpha\nu} + \partial_\nu\field g_{\alpha\beta})\,\obs u^\beta\obs u^\nu$. Moving the right side over,

$$\field g_{\alpha\nu}\frac{\dd\obs u^\nu}{\dd\obs\tau} + \tfrac12\bigl(\partial_\beta\field g_{\alpha\nu} +
\partial_\nu\field g_{\alpha\beta} - \partial_\alpha\field g_{\beta\nu}\bigr)\,\obs u^\beta\obs u^\nu = 0 .$$

Last, we multiply by $\field g^{\mu\alpha}$ and sum over $\alpha$. The first term becomes $\dd\obs u^\mu/\dd\obs\tau$,
and the second becomes $\Gamma^\mu{}_{\beta\nu}\obs u^\beta\obs u^\nu$ with $\Gamma$ as in [](#eq:christoffel), which
gives [](#eq:geodesic) after renaming the letters.
:::

::: gap
The box set the label equal to $\obs\tau$ only after differentiating, because the nearby paths have other proper times.
Labels for which [](#eq:geodesic) keeps its form are called affine parameters; light, which has no proper time, uses one
of them. The box took the Christoffel symbols from the metric, which makes them symmetric in their lower indices;
general relativity makes that choice from the start.
:::

**The weak static field gives Newton's law.** We take [](#eq:g00), with $\field g_{0i} = 0$ and nothing changing in
time. The derivatives $\partial_0$ of every entry vanish, so [](#eq:christoffel) with $\mu = i$, $\alpha = \beta = 0$
and $\field g^{ij} \approx \delta_{ij}$ leaves one term:

$$\Gamma^i{}_{00} = -\tfrac12\,\partial_i\field g_{00} = \frac{\partial_i\field\Phi}{c^2} ,$$

in $\mathrm{m^{-1}}$. The symbols $\Gamma^i{}_{0j}$ vanish in a static field with $\field g_{0i} = 0$, and the terms
with $\Gamma^i{}_{jk}$ carry two spatial components $\obs u^j\obs u^k$, so they are smaller than the term in $(\obs
u^0)^2$ by $\obs v^2/c^2$. For slow motion $\obs u^0 \approx c$ and $\dd\obs\tau \approx \dd t$, so [](#eq:geodesic)
with $\mu = i$ reads

$$\ddot x^i = -c^2\,\Gamma^i{}_{00} = -\partial_i\field\Phi ,$$

Newton's law again. The pull of gravity has moved into the Christoffel symbols, which are first derivatives of the
metric.

**A non-example: symbols with no gravity.** On the flat sheet with polar coordinates, $\field g_{rr} = 1$ and $\field
g_{\theta\theta} = r^2$, so [](#eq:christoffel) gives $\Gamma^r{}_{\theta\theta} = -\tfrac12\partial_r(r^2) = -r$, in
metres, nonzero with no gravity at all: in polar labels a straight line seems to bend away from the centre, though
nothing pulls on it. The Christoffel symbols describe the coordinates as much as the field.

## Falling removes the field's first derivatives at a point, but not its second

We want to know how far a choice of coordinates can remove gravity at one event, because the body of the paper's
[Section II](/paper/#sec:pixel) begins by saying that a freely falling observer "feels no gravitational field at their
own position". The argument is a count, sketched here.

**What must be removed.** At one event P the metric has 10 values and $10 \times 4 = 40$ first derivatives. It has $10
\times 10 = 100$ second derivatives $\partial_\gamma\partial_\delta\field g_{\alpha\beta}$, one for each entry and each
pair of coordinates, with order not mattering.

**What a change of coordinates can choose.** Take new coordinates $x'^\mu$, with P at their origin, and write the old
ones as a Taylor series in the new:

$$\begin{aligned}x^\mu &= x^\mu_P + A^\mu{}_\alpha x'^\alpha + \tfrac12B^\mu{}_{\alpha\beta}x'^\alpha x'^\beta\\
&\quad + \tfrac16C^\mu{}_{\alpha\beta\gamma}x'^\alpha x'^\beta x'^\gamma + \dots\end{aligned}$$

The numbers at each order can be chosen freely. The place $x^\mu_P$ is 4 numbers, and it moves only the origin. The
table $A^\mu{}_\alpha$ is $4 \times 4 = 16$ numbers. The table $B^\mu{}_{\alpha\beta}$ is symmetric in $\alpha\beta$,
which gives $4 \times 10 = 40$ numbers, and $C^\mu{}_{\alpha\beta\gamma}$ is symmetric in its three lower indices, which
gives $4 \times 20 = 80$, since four values make 20 unordered triples.

**How the metric changes.** The time a clock records cannot depend on the labels, so $\field g'_{\alpha\beta}\dd
x'^\alpha\dd x'^\beta = \field g_{\mu\nu}\dd x^\mu\dd x^\nu$. The chain rule gives $\dd x^\mu = (\partial x^\mu/\partial
x'^\alpha)\,\dd x'^\alpha$, so

$$\field g'_{\alpha\beta}(x') = \frac{\partial x^\mu}{\partial x'^\alpha}\frac{\partial x^\nu}{\partial
x'^\beta}\,\field g_{\mu\nu}(x) ,$$

and the derivative of the series is

$$\frac{\partial x^\mu}{\partial x'^\alpha} = A^\mu{}_\alpha + B^\mu{}_{\alpha\gamma}x'^\gamma +
\tfrac12C^\mu{}_{\alpha\gamma\delta}x'^\gamma x'^\delta + \dots .$$

At P, where $x' = 0$, only $A$ survives, and $\field g'_{\alpha\beta} = A^\mu{}_\alpha A^\nu{}_\beta\,\field
g_{\mu\nu}$. We differentiate once with respect to $x'^\gamma$ and set $x' = 0$. Each factor $\partial x/\partial x'$
gives a $B$, the factor $\field g_{\mu\nu}(x)$ gives $A^\lambda{}_\gamma\partial_\lambda\field g_{\mu\nu}$ by the chain
rule, and $C$ still carries a factor $x'$ and drops out:

$$\begin{aligned}\partial'_\gamma\field g'_{\alpha\beta} &= \bigl(B^\mu{}_{\alpha\gamma}A^\nu{}_\beta +
A^\mu{}_\alpha B^\nu{}_{\beta\gamma}\bigr)\field g_{\mu\nu}\\ &\quad + A^\mu{}_\alpha A^\nu{}_\beta
A^\lambda{}_\gamma\,\partial_\lambda\field g_{\mu\nu} \quad \text{at P.}\end{aligned}$$

So the first derivatives at P depend on $B$ and on numbers already fixed. Differentiating once more brings in $C$ for
the first time in the same way, so the second derivatives at P depend on $C$ and on numbers already fixed.

**The count.** Requiring $\field g'_{\alpha\beta} = \field\eta_{\alpha\beta}$ at P is 10 conditions on the 16 numbers of
$A$. The 6 left over are the changes that keep $\field\eta$: three turns of the axes and three boosts (10 + 6 = 16).
With $A$ chosen, the 40 numbers of $B$ can set all 40 first derivatives at P to zero, and then every Christoffel symbol
vanishes at P, by [](#eq:christoffel). With $B$ chosen, the 80 numbers of $C$ can remove only 80 of the 100 second
derivatives. So

$$\boxed{\;100 - 80 = 20\;}$$

combinations of second derivatives of the metric at P survive every choice of coordinates (Figure [](#fig:count)).

![Look first at the coloured end of the longest bar: of the metric's 100 second derivatives at an event, a change of
coordinates can remove 80, and the 20 that remain are the curvature. The values and the first derivatives can all be
set, to those of flat spacetime and to zero.](tut-metric-count){#fig:count}

**What it means.** In the new coordinates the metric is $\field\eta_{\mu\nu}$ at P and its first derivatives vanish
there, so free bodies move straight at steady speed at P, and clocks tick as in chapter 6.1. This is the local inertial
frame of [](#falling-cancels-gravity-at-a-point-and-only-there), made exact, and the frame with $\field\eta_{\mu\nu}$ at
the observer's place that chapter
[6.2](/tutorial/relativity/spacetime-vectors/#lowering-an-index-changes-only-the-sign-of-time) used. The pull of gravity
lived in the first derivatives, and falling removes it.

The 20 numbers that no frame removes are the curvature of chapter 7.2, the Riemann tensor $R$ of the paper's
[](/paper/#eq:tidal), and the tide $\curv{\tE}_{ij} = c^2R_{0i0j}$, a symmetric table of three rows, is six of them.
Panel (a) of the paper's figure below shows what the tide does: a ring of free test masses beside a mass is stretched
along the line to the mass and squeezed across it, and no falling keeps it round. Panels (b) and (c) show the ring in a
gravitational wave.

{{paper fig:tidal}}

In Newton's language, falling with the acceleration $-\nabla\field\Phi$ at P removes $\Gamma^i{}_{00} =
\partial_i\field\Phi/c^2$ there, but not its change from place to place, $\partial_j\Gamma^i{}_{00} =
\partial_i\partial_j\field\Phi/c^2$. That change is chapter 1.4's tidal tensor divided by $c^2$, and the paper problem
below works it out.

::: gap
The sketch counts numbers and does not prove that the conditions can be met. For the first derivatives they can: the 40
Christoffel symbols at P and the 40 first derivatives of the metric determine each other, and a suitable choice of $B$
removes them all, which gives what are called normal coordinates. That the 20 survivors are independent follows from the
symmetries of the Riemann tensor (chapter 7.2).
:::

## Light follows paths on which no proper time passes

Along the path of a flash proper time does not advance, $\dd\obs\tau = 0$ (chapter
[6.1](/tutorial/relativity/lorentz/#a-moving-clock-runs-slow-and-a-clocks-own-time-is-the-length-of-its-path)), and such
a path is called null. Light crosses a metre of space while $x^0 = ct$ advances a metre, so for light the spatial
entries of the metric count as much as the time entry. Near a mass, in the coordinates of chapter 7.4 (called isotropic,
because their spatial part is the same in every direction), $\field g_{ij} = (1 - 2\field\Phi/c^2)\delta_{ij}$, which
this chapter states without proof. The spatial entries bend light as much as the time entry does, so a ray that passes a
mass $\matter M$ at the distance $b$ is turned by $4G\matter M/bc^2$, twice Newton's value for a particle moving at $c$.
At the Sun's edge this is $1.75''$ (seconds of arc), against Newton's $0.88''$. Chapter 7.4 derives the spatial entries
and chapter 11.1 the bending, which the paper uses in [Section VII](/paper/#sec:no-lens) and [Section
XI](/paper/#par:the-transparent-sun-as-a-lens).

::: check
### Q

Why can falling remove the pull of gravity at a point, but not the tide?

### A

The pull is the same on the box and on everything in it, so falling with the box cancels it. The tide is the change of
the pull across the box, and one motion of the box cannot match two different pulls at once.

### Q

By how much does a clock at the top of a 100 m tower run ahead of one at its foot in a day?

### A

By the fraction $gh/c^2 = 9.81 \times 100/(2.998 \times 10^8)^2 = 1.09 \times 10^{-14}$, which over a day of 86,400 s is
$9.4 \times 10^{-10}\unit{s}$, or 0.94 ns.

### Q

On a flat sheet in polar coordinates, $\Gamma^r{}_{\theta\theta} = -r$. Is the sheet curved?

### A

No. The Christoffel symbols depend on the labels, and straight axes set them all to zero. Curvature (chapter 7.2) is
made of the second derivatives that no change of coordinates removes, and for the flat sheet it is zero.
:::

**The idea to keep: gravity is the metric, a table at each event that turns coordinate labels into what clocks and
rulers read. Free bodies follow the paths along which their own clocks run longest, and to first order the time part
$\field g_{00} = -(1 + 2\field\Phi/c^2)$ gives Newton's law and makes a clock higher up run fast by $\Delta\field
\Phi/c^2$. Falling removes the field at a point, never its change from point to point.**

::: problems
### Practice

A clock spends a week on the summit of Everest, 8849 m above sea level, and returns. How far ahead of its twin at sea
level is it? Take $g = 9.81\unit{m\,s^{-2}}$ to be the same all the way up, and say how good that is.

::: solution
By [](#eq:rate) the summit clock gains the fraction $gh/c^2 = 9.81 \times 8849/(2.998 \times 10^8)^2 = 9.66 \times
10^{-13}$. A week is $604{,}800\unit{s}$, so it gains $5.8 \times 10^{-7}\unit{s}$, about 0.6 microseconds. The field
weakens with height, so the true potential difference is $gh/(1 + h/R)$, smaller by the fraction $h/R = 1.4 \times
10^{-3}$: the answer is good to about 0.1 per cent.
:::

### Stretch

Combine this chapter with chapter 1.6. On which circular orbit does a clock keep pace with a clock on the equator? Take
$R = 6371\unit{km}$, $G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$ and the Earth's angular velocity $\obs\Omega
= 7.29 \times 10^{-5}\unit{s^{-1}}$.

::: solution
Use $\dd\obs\tau/\dd t \approx 1 + \field\Phi/c^2 - \obs v^2/2c^2$ with $\field\Phi = -G\matter M/r$. On an orbit of
radius $r$, $\obs v^2 = G\matter M/r$, so the rate is $1 - 3G\matter M/2rc^2$. On the equator $\obs v = \obs\Omega R$,
so the rate is $1 - G\matter M/Rc^2 - (\obs\Omega R)^2/2c^2$. The two are equal when $3G\matter M/2r = G\matter M/R +
\obs\Omega^2R^2/2$, that is

$$\begin{aligned}
r &= \frac{\tfrac32R}{1 + \obs\Omega^2R^3/2G\matter M}\\
&= \frac{9557\unit{km}}{1.0017} = 9540\unit{km} ,
\end{aligned}$$

an altitude of 3170 km. Clocks on higher orbits run fast against the ground, as GPS clocks do, and clocks on lower
orbits run slow.
:::

### The paper

The paper's Section II says that near slow matter the tide is

{{paper eq:newton}}

In the weak static field, take coordinates that fall with the acceleration $-\nabla\field\Phi(0)$ of the origin, $x'^i =
x^i + \tfrac12\partial_i\field\Phi(0)\,t^2$ and $t' = t$. Find the slow-motion symbol $\Gamma'^i{}_{00}$ from the law of
motion $\ddot x'^i = -c^2\Gamma'^i{}_{00}$. Show that it vanishes at the origin, as the paper's Section II says it must,
and that its first derivative $\partial'_j\Gamma'^i{}_{00}$ does not. Then compare $c^2$ times that derivative with the
paper's equation above.

::: solution
A free body obeys $\ddot x^i = -\partial_i\field\Phi(\vect x)$. Differentiating $x'^i$ twice gives $\ddot x'^i = \ddot
x^i + \partial_i\field\Phi(0) = -[\partial_i\field\Phi(\vect x) - \partial_i\field\Phi(0)]$, so

$$\Gamma'^i{}_{00} = \frac{\partial_i\field\Phi(\vect x) - \partial_i\field\Phi(0)}{c^2} .$$

At the origin, near $t = 0$, $\vect x = 0$ and the symbol is zero: the falling observer feels no field there. Near the
origin $\vect x' \approx \vect x$, so the derivative is $\partial'_j\Gamma'^i{}_{00} =
\partial_i\partial_j\field\Phi/c^2$, which no uniform acceleration can cancel. Times $c^2$ it is
$\partial_i\partial_j\field\Phi$, chapter 1.4's tidal tensor and the right side of the paper's [](/paper/#eq:newton).
Chapter 7.2 shows that it is also $c^2R_{0i0j}$, so that the paper's [](/paper/#eq:tidal) becomes the paper's
[](/paper/#eq:newton) near slow matter.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel): the astronaut ([](#falling-cancels-gravity-at-a-point-and-only-there)); the freely
  falling observer ([](#falling-removes-the-fields-first-derivatives-at-a-point-but-not-its-second)); the tide of
  the paper's [](/paper/#eq:tidal) "for an observer at rest, with proper time $t$"
  ([](#a-clocks-own-time-is-set-by-the-metric)); and its sign convention for the curvature, which starts from
  [the Christoffel symbols](#free-bodies-follow-geodesics-and-the-christoffel-symbols-hold-newtons-pull).
- [*Other gravitational sensors*](/paper/#par:other-gravitational-sensors), in Section IV: clocks "reading the potential
  itself", the rate [](#eq:rate).
- [Section I](/paper/#sec:introduction): gravity "is simple where it is weak", the weak field of [](#eq:g00) in
  numbers.
- [Section VII](/paper/#sec:no-lens) and [*The transparent Sun as a lens*](/paper/#par:the-transparent-sun-as-a-lens) in
  Section XI: the bending $4G\matter M/bc^2$ ([](#light-follows-paths-on-which-no-proper-time-passes)).
:::

::: deeper
- The GR course states the equivalence principle with its limits in
  [section 5.2](https://neovand.github.io/general-relativity/chapter-5.html#5-2-what-the-equivalence-principle-says-and-what-it-does-not-buy-you),
  derives the geodesic equation step by step in
  [section 5.5](https://neovand.github.io/general-relativity/chapter-5.html#5-5-deriving-the-geodesic-equation-one-operation-at-a-time),
  and gives the count of twenty in full in
  [section 10.10](https://neovand.github.io/general-relativity/chapter-10.html#10-10-why-twenty-curvature-numbers-survive-local-flattening).
- The GR course works the [tossed clock](https://neovand.github.io/general-relativity/chapter-16.html#16-8-a-tossed-clock-can-age-more-than-the-clock-on-the-shelf)
  and [GPS](https://neovand.github.io/general-relativity/chapter-16.html#16-7-gps-calculate-the-competing-clock-effects)
  in chapter 16. C. M. Will, *Theory and Experiment in Gravitational Physics* (Cambridge, 2018), gives the tests of
  the equivalence principle.
:::

[^letters]: The proper time $\obs\tau$ is not chapter 4.4's relaxation time nor chapter 5.5's optical depth. The
    metric $\field g_{\mu\nu}$ and the perturbation $\field h_{\mu\nu}$ always have two indices; a bare $g$ is the
    acceleration of fall, a bare $h$ a height, and the paper's $h_+$ and $h_\times$ are a wave's strain.

[^spatial]: With $\field g_{ij} = (1 - 2\field\Phi/c^2)\delta_{ij}$, the term $\obs v^2/c^2$ under the square root below
    is multiplied by $1 - 2\field\Phi/c^2$, so it changes by the fraction $2|\field\Phi|/c^2$, which is
    $1.4 \times 10^{-9}$ at the Earth's surface.

[^exact]: Integrating the full square root along each path, with $\field\Phi = gz$, gives the same gains to about one
    part in $10^{15}$. With the Earth's whole potential in $\field\Phi$, the gains change by the fraction
    $7.0 \times 10^{-10}$, so they still hold to nine figures.

[^doppler]: A box accelerating at $g$ in empty space gives the same result with no gravity at all. Light from the floor
    takes the time $h/c$ to reach the ceiling, which meanwhile gains the speed $gh/c$. A receiver moving away at the
    speed $u$ receives a frequency lowered by the fraction $u/c$ (the Doppler shift of chapter
    [6.3](/tutorial/relativity/aberration/#light-from-ahead-is-bluer-and-light-from-behind-is-redder)), here $gh/c^2$,
    as in [](#eq:rate).

[^towers]: R. V. Pound and G. A. Rebka sent gamma rays up and down a tower 22.5 m high and found shifts agreeing with
    $gh/c^2 = 2.46 \times 10^{-15}$ to ten per cent (*Physical Review Letters* 4, 337, 1960). T. Bothwell and colleagues
    measured the shift across a cloud of atoms one millimetre tall, consistent with the predicted $1.1 \times 10^{-19}$
    to about a quarter (*Nature* 602, 420, 2022).

[^sea]: A clock at the distance $r_\perp$ from the Earth's axis moves at $\obs\Omega r_\perp$, with $\obs\Omega$ the
    Earth's angular velocity, so its rate is $1 + (\field\Phi - \tfrac12\obs\Omega^2r_\perp^2)/c^2$. The bracket has one
    value on the calm sea (chapter 1.2). The turning has flattened the Earth, and the equator, 21 km farther from the
    centre than a pole, gains $1.2 \times 10^{-12}$ in gravity's potential, which its motion cancels. The Sun's
    potential at 1 AU gives $9.87 \times 10^{-9}$ and the Earth's orbital motion half as much: that is the Sun's share,
    and with the Earth's own $6.96 \times 10^{-10}$ the total is $1.55 \times 10^{-8}$.

[^gamma]: The paper writes $\Gamma^\alpha_{\beta\delta}$; the tutorial sets the upper index first and always writes all
    three indices. A bare $\Gamma$ is a damping rate, as in chapter [4.1](/tutorial/response/oscillator/). The symbols
    are not a tensor, so they carry no colour.
