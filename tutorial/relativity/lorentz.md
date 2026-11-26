---
id: '6.1'
title: 'Clocks, light and the Lorentz transformation; rapidity'
question: 'What do a moving observer''s clock and ruler read, and why must moving observers disagree about which events happen at the same time?'
part: '6'
requires: ['1.1', '1.6']
paper: [sec:pixel, eq:tidal, sec:one-pixel, eq:W, eq:moving-state, fig:speedometer, fig:present, fig:stars, app:proofs, sec:vistas]
figures: [fig:speedometer]
live: [lorentz-diagram]
depth: A
---

A pixel crosses a room of four masses at 0.6 of the speed of light and reads its own velocity from the tide alone. To
interpret what it reads, we must know what the pixel's clock measures and what it means by "now", for both depend on how
the pixel moves.[^first]

{{paper fig:speedometer}}

What do a moving observer's clock and ruler read, and why must moving observers disagree about which events happen at
the same time? The whole answer follows from one fact of experiment: light has the same speed for every observer. From
it we derive the rule that carries the times and places of events from one observer to another, and the distance $R_*$
that weighs a moving body.

![Look first at the two glass sheets: they are the two rings' "now" through the same event. The ring at rest
calls the horizontal sheet "now"; the ring moving at 0.6 of the speed of light calls the tilted sheet "now". Both
sheets lie outside the light cone.](tut-lorentz-hero){#fig:two-nows}

::: plain
Light travels at the same speed for everyone, however fast they move. That single fact forces time and distance to mix
when an observer moves.

A clock that moves past you runs slow: at 0.6 of the speed of light it ticks 8 seconds while your clocks tick 10. A
ruler moving along its length is shorter by the same factor. Two events that happen at the same moment for you happen
at different moments for the moving observer, so "now" is not the same for everyone. Each clock's own reading is the
same for everyone, and so is the interval, a combination of the time and the distance between two events.

Speeds do not add as Newton thought: two boosts of 0.6 of the speed of light give 0.88 of it, not 1.2. A quantity
called the rapidity does add, and 0.6 of the speed of light has the rapidity $\ln 2$.
:::

## Every observer measures the same speed of light

An **event** is a place at a time: a flash, a click of a clock, a collision. A **frame** is a set of axes and clocks
against which the places and times of events are measured ([section 1.6](/tutorial/newton/motion/#in-a-turning-frame-two-extra-accelerations-appear)),
pictured as a lattice of rulers with a clock at every crossing. A frame is **inertial** when a body that nothing pushes
or pulls keeps its speed and direction in it. Here there is no gravity, so an inertial frame feels no force and does not
turn (how free fall fits in is the subject of [section 7.1](/tutorial/geometry/metric/)). The **rest frame** of a body
is the inertial frame in which it is at rest. A body's path through space and time, the list of events it passes
through, is its **worldline**. A platform that turns is not inertial: a free ring on it stretches across the axis with
no mass to cause it ([section 1.6](/tutorial/newton/motion/#a-turning-pixel-feels-a-pseudo-tide)).

We take two inertial frames that move relative to each other at a steady velocity $\sym{velocity}{\obs{\vect v}}$, in
metres per second: the room, and the pixel that crosses it. In Newton's mechanics velocities add: a ball thrown forward
at $u$ from a cart moving at $\obs v$ moves at $u + \obs v$ over the ground. Light breaks this rule. We take as our
starting point a result of experiment, stated without proof:

**The speed of light in empty space, $c = 2.998\times10^8\unit{m\,s^{-1}}$, is the same in every inertial frame,
whatever the motion of the source of the light and of the one who measures it.** 

Michelson and Morley, and many after them, found light's speed the same along the Earth's motion and across it (the box
below; [section 6.3](/tutorial/relativity/aberration/#at-small-speeds-the-shift-is-the-speed-across-the-line-of-sight-over-c)
adds the tilt of starlight). Einstein made the fact part of a principle: no experiment done inside a closed laboratory moving
steadily can tell how fast the laboratory moves, so light timed inside any such laboratory must have the same speed.

::: history
### From the ether to relativity

In 1887 A. A. Michelson and E. W. Morley sent light along two arms at right angles and back, and looked for the shift in
its interference that the Earth's motion through a medium for light, the "ether", should cause. They found less than a
twentieth of the expected shift (*American Journal of Science*, 1887). H. A. Lorentz and H. Poincaré found the
transformation of this section between 1895 and 1905 as a property of Maxwell's equations, and A. Einstein derived it
from the two principles used here (*Annalen der Physik*, 1905), seeing that it changes the meaning of time. Optical
cavities now find no difference in the speed of light between directions to about one part in $10^{18}$ (M. Nagel and
colleagues, *Nature Communications* 6, 8174, 2015). In 2017 gamma rays from a merger of two neutron stars arrived 1.74 s
after its gravitational waves, after about 130 million years, so the two speeds differ by between $-3\times10^{-15}$
and $+7\times10^{-16}$ of $c$ (B. P. Abbott and colleagues, *Astrophysical Journal Letters* 848, L13, 2017).
:::

To compare times at different places, the clocks of a frame must be **synchronized**, and light gives the way to do it.
A clock at A sends a flash at the time $t_1$ on its own dial. A mirror beside a clock at B returns the flash, which
comes back to A at $t_2$. Light takes as long on the way out as on the way back, so the flash reached B at
$(t_1 + t_2)/2$, and the clock at B is set to read that time at the moment of reflection. This is Einstein's rule. Each
frame synchronizes its own clocks this way, with its own light, so nothing promises that two frames agree which of
their distant clocks read the same time.

## Steady motion along a line mixes time and distance

We want the rule that carries the time and place of an event in the room to its time and place for the pixel. The room
measures each event by $t$, $x$, $y$ and $z$, and the pixel, whose measures carry primes, by $t'$, $x'$, $y'$ and $z'$.
The pixel moves at the speed $\obs v$ along the room's $x$ axis, with axes parallel to the room's, and the two origins
coincide at $t = t' = 0$. We write $\sym{speed-ratio}{\obs\beta} = \obs v/c$ for the speed as a fraction of light's, a
pure number between 0 and 1.

Newton's rule for this change of frame is $x' = x - \obs vt$ and $t' = t$. A flash sent along the $x$ axis from the
common origin has its front at $x = ct$ in the room, so by this rule the pixel would find it at
$x' = (c - \obs v)\,t'$ and measure the speed $c - \obs v$. The starting fact forbids this. What we give up is
$t' = t$, which the synchronization rule never promised. We make three assumptions instead.

**The rule is linear.** A free body moves on a straight line at steady speed in both frames, and no place or time is
special, so $x'$ and $t'$ are each a constant times $x$ plus a constant times $t$. The pixel's own origin, $x' = 0$, is
at $x = \obs vt$ in the room, so $x'$ vanishes whenever $x - \obs vt$ does, and

$$x' = \obs\gamma\,(x - \obs vt),$$

with $\sym{lorentz-factor}{\obs\gamma}$ a number still to be found, which may depend on $\obs v$. In Newton's mechanics
$\obs\gamma = 1$.

**The two frames are equivalent.** For the pixel the room's origin moves at $-\obs v$, so the rule back from the pixel to
the room is the same rule with $-\obs v$ and the same $\obs\gamma$:

$$x = \obs\gamma\,(x' + \obs vt').$$

**A flash travels at $c$ in both frames.** A flash leaves the common origin at $t = t' = 0$. Its front is at $x = ct$ in
the room and at $x' = ct'$ for the pixel. We put these into the two rules:

$$ct' = \obs\gamma\,(c - \obs v)\,t, \qquad ct = \obs\gamma\,(c + \obs v)\,t' .$$

We multiply the two equations and cancel $tt'$, which gives $c^2 = \obs\gamma^2(c^2 - \obs v^2)$, so

$$\obs\gamma = \frac{1}{\sqrt{1 - \obs\beta^2}} .$$

To find $t'$, we put the first rule into the second, $x = \obs\gamma\,[\obs\gamma(x - \obs vt) + \obs vt']$, and solve
for $t'$:

$$t' = \obs\gamma t - \frac{\obs\gamma^2 - 1}{\obs\gamma\obs v}\,x .$$

From $\obs\gamma^2(1 - \obs\beta^2) = 1$ we have $\obs\gamma^2 - 1 = \obs\gamma^2\obs\beta^2$, so the coefficient of
$x$ is $\obs\gamma\obs v/c^2$. We multiply by $c$ and collect the result:

$$\boxed{\;\begin{aligned} ct' &= \obs\gamma\,(ct - \obs\beta x),\\ x' &= \obs\gamma\,(x - \obs\beta\,ct),\\
\obs\gamma &= \frac{1}{\sqrt{1 - \obs\beta^2}}\end{aligned}\;} \label{eq:lorentz}$$

This is the **Lorentz transformation**, and the change of frame it describes is a **boost**. The directions across the
motion do not change: $y' = y$ and $z' = z$.[^hoop] Both $ct$ and $x$ are in metres and $\obs\beta$, $\obs\gamma$ are
pure numbers, so the units agree. The rule back is the same with $-\obs\beta$.

**One quantity does not change.** We compute $-c^2t'^2 + x'^2$ from [](#eq:lorentz):

$$\begin{aligned}
&-c^2t'^2 + x'^2\\
&\quad= \obs\gamma^2\bigl[-(ct - \obs\beta x)^2 + (x - \obs\beta ct)^2\bigr]\\
&\quad= \obs\gamma^2\bigl[-c^2t^2 + 2\obs\beta ctx - \obs\beta^2x^2\\
&\qquad\quad + x^2 - 2\obs\beta xct + \obs\beta^2c^2t^2\bigr]\\
&\quad= \obs\gamma^2(1 - \obs\beta^2)\,(-c^2t^2 + x^2)\\
&\quad= -c^2t^2 + x^2 .
\end{aligned}$$

The same algebra holds for differences between two events. The quantity $-c^2\Delta t^2 + \Delta x^2$, with
$\Delta y^2 + \Delta z^2$ added when the events are apart across the motion too, is the **interval** between them, in
square metres. Every inertial observer computes the same interval, and section 6.2 builds the geometry of space and time
on it. The list of signs in front of the four squares, minus for time and plus for each direction of space, is the
**signature**, here $-{+}{+}{+}$.

**The pixel.** At $\obs\beta = 0.6$, $1 - \obs\beta^2 = 0.64$, so $\obs\gamma = 1/0.8 = 1.25$ and
$\obs\gamma\obs\beta = 0.75$: $ct' = 1.25\,ct - 0.75\,x$ and $x' = 1.25\,x - 0.75\,ct$.

**Slow motion.** For $\obs\beta \ll 1$, $\obs\gamma = 1 + \obs\beta^2/2 + \dots$. For the Earth on its orbit, at
$29.8\unit{km\,s^{-1}}$, $\obs\beta = 9.94\times10^{-5}$ and $\obs\gamma - 1 = 4.9\times10^{-9}$. To this accuracy
$x' = x - \obs vt$, Newton's rule, but $t' = t - \obs vx/c^2$ keeps a term of first order in $\obs\beta$, so
Newton's $t' = t$ fails for distant events.

## Moving observers disagree about what happens at the same time

If two events are simultaneous in the room, $\Delta t = 0$, and lie $\Delta x$ apart, the differences of
[](#eq:lorentz) give

$$\boxed{\;\Delta t' = -\frac{\obs\gamma\obs\beta\,\Delta x}{c}\;} .$$

**Two flashes.** Two lamps in the room flash at the same moment by the room's clocks, one beside the pixel and one a
light-second farther along its path, $\Delta x = 3.00\times10^5\unit{km}$. For the pixel at $0.6c$,
$\Delta t' = -0.75\unit{s}$: the far flash, the one the pixel is moving toward, happens three quarters of a second
earlier. These are times on the pixel's own synchronized clocks beside each flash, so the travel time of
light plays no part. When $\obs\beta = 0$ the flashes are simultaneous for both, as Newton assumed.

The synchronization rule shows why. Seen from the room, light the pixel sends forward to set a distant clock must catch
up with a clock that moves away, so the trip out takes longer than the trip back; the pixel's rule takes them as equal,
so the pixel's clocks farther ahead read earlier times.

This is the **relativity of simultaneity**. The set of all events that one observer calls "now" is that observer's
**slice of simultaneity**. In a diagram with the room's $x$ across and its $ct$ upward, the room's slice is a
horizontal line. The pixel's slice $t' = 0$ is the line $ct = \obs\beta x$, tilted up toward the path of light by the
angle by which the pixel's worldline $x = \obs\beta ct$ is tilted from the vertical (Figure [](#fig:boost-axes)).

![Look first at the two dots on the room's horizontal axis: the room calls the flashes A and B simultaneous. The
pixel at 0.6 of the speed of light calls the tilted line through A "now"; B lies below it, on the parallel line of
$t' = -0.75\unit{s}$, so for the pixel B came first. Units are light-seconds; the light lines are at
45°.](tut-lorentz-axes){#fig:boost-axes}

Two events can be ordered differently by different observers only if light cannot connect them. In general
$\Delta t' = \obs\gamma(\Delta t - \obs\beta\Delta x/c)$, which changes sign for some $\obs\beta < 1$ only when
$|\Delta x| > c|\Delta t|$: on the line of motion, when the interval between the events is positive. For events that
light or any slower signal can connect, every observer agrees which came first, so no observer sees an effect before
its cause.

A pixel therefore reads the tide of a steadily moving body as a function of where the body is on the pixel's own slice
of simultaneity ([section 6.3](/tutorial/relativity/aberration/#the-steady-field-of-a-moving-body-depends-on-where-the-body-is-now)).[^now]

## A moving clock runs slow, and a clock's own time is the length of its path

We want the time that a moving clock reads. A clock at rest at the pixel's origin, $x' = 0$, has by the rule back
$ct = \obs\gamma(ct' + \obs\beta x') = \obs\gamma ct'$, so between two ticks

$$\boxed{\;\Delta t = \obs\gamma\,\Delta t'\;} .$$

While the moving clock advances by $\Delta t'$, the room's clocks, which it passes one after another, advance by
$\obs\gamma$ times as much. This is **time dilation**. Each clock is slow as judged by the other frame, with no
contradiction, because the two judgements compare different pairs of clocks.

A clock made of light shows the same factor. Two mirrors a distance $L$ apart, across the motion, bounce a flash between
them, and one tick is the flash's trip up and back, $2L/c$ in the clock's own frame. In the room the mirrors move on by
$\obs v\Delta t/2$ while the flash goes up, so the flash runs along a diagonal (Figure [](#fig:light-clock)) of length
$c\Delta t/2$, and by Pythagoras $(c\Delta t/2)^2 = L^2 + (\obs v\Delta t/2)^2$. So
$\Delta t = (2L/c)/\sqrt{1 - \obs\beta^2}$, which is $\obs\gamma$ times the tick in the clock's own frame.

![Look first at the diagonal: in the room, the flash travels 1.25 times as far per tick as in the clock's own frame,
at the same speed $c$, so each tick lasts 1.25 times as long. The triangle is the 3 : 4 : 5 triangle of
$0.6c$.](tut-lorentz-light-clock){#fig:light-clock}

**A clock on any path.** A clock may change its speed. We assume that **a clock that speeds up or slows down ticks, at
each moment, like a clock moving steadily with its velocity of that moment**.[^clock] In a short time $\dd t$ of the
room it moves $\dd x = \obs v\,\dd t$ and ticks $\dd t/\obs\gamma$. Its own reading, the **proper time**
$\sym{proper-time}{\obs\tau}$, in seconds, is therefore

$$\boxed{\;\obs\tau = \int \frac{\dd t}{\obs\gamma} = \int \sqrt{1 - \frac{\obs v^2}{c^2}}\;\dd t\;} \label{eq:proper-time}$$

along the clock's path. Squared and multiplied by $-c^2$, each step reads $-c^2\dd\obs\tau^2 = -c^2\dd t^2 + \dd
x^2$, the interval between two neighbouring events on the path. Every observer computes the same interval, so every
observer computes the same $\obs\tau$. Each step of a clock's path has a negative interval, because the clock moves
slower than light, so the proper time is the length of the path measured with the interval, its sign reversed and its
square root taken, divided by $c$. As $\obs v \to c$, $\dd\obs\tau \to 0$: along a flash of light, proper time does not advance at all.

**The straight path is the longest.** Of all the paths between two events, the unaccelerated one has the longest proper
time. In its own rest frame that path stays at one place, so its clock has $\obs v = 0$ throughout and reads the whole
time between the events. Any other path moves at some moments, where $\sqrt{1 - \obs v^2/c^2} < 1$, so its clock
reads less, in this frame and, since $\obs\tau$ is shared, in every frame.

**Numbers.** A traveller who moves at $0.6c$ for 10 years of the room's time ages $10/1.25 = 8$ years. The Earth's
orbital motion slows its clocks against those at rest relative to the Sun by $1 - 1/\obs\gamma = 4.9\times10^{-9}$,
which is 0.16 s a year.[^sun] A clock on the equator moves at $465\unit{m\,s^{-1}}$ round the Earth's axis
([section 1.1](/tutorial/newton/vectors-and-indices/#a-small-turn-is-a-cross-product-and-the-equator-moves-faster-than-sound)),
so, gravity aside, it runs slow by $\obs\beta^2/2 = 1.2\times10^{-12}$, a tenth of a microsecond a day. Gravity slows
a clock at the ground by $6.96\times10^{-10}$, some 580 times as much ([section 7.1](/tutorial/geometry/metric/#clocks-higher-up-run-faster-clocks-read-the-potential)). The
two effects cancel between equator and pole: the surface of the sea has the same combined potential of gravity and of
the Earth's turning everywhere ([section 1.2](/tutorial/newton/field-and-potential/)), so every clock at sea level
ticks at the same rate (N. Ashby, *Living Reviews in Relativity* 6, 1, 2003).

Proper time is thus the time $t$ of an observer at rest relative to the masses, which is the time in which the tide of
a still body is defined ([section 1.4](/tutorial/newton/tides/)).

## A moving ruler is shorter along its motion, and distances in a body's own frame are longer

A rod at rest in the pixel's frame has its ends at $x' = 0$ and $x' = L$. The room measures its length by marking both
ends at the same room time, $\Delta t = 0$. The second rule of [](#eq:lorentz) gives
$\Delta x' = \obs\gamma(\Delta x - \obs\beta c\Delta t) = \obs\gamma\Delta x$, so the room finds

$$\boxed{\;\Delta x = \frac{L}{\obs\gamma}\;} .$$

This is **length contraction**. A rod moving at $0.6c$ measures $0.8$ of its own length; across its motion it keeps its
length, since $y' = y$. The contraction comes from simultaneity: the room marks the two ends at one room time, which is
not one time for the rod.

**The distance in a body's frame.** A moving body acts on the pixel as if it were at rest at its distance $R_*$ in its
own frame (we see why at the end of this section). The roles now change. The pixel's frame is the unprimed one, with
the pixel at rest at its origin, and the body moves through it with the velocity $\obs{\vect v}$. The body's rest frame
takes the primes. At the pixel's "now", $t = 0$, the body is at $\vect r$, the vector from the pixel to where the body is
now, in metres. With $\hat v = \obs{\vect v}/\obs v$ the unit vector along the motion, the part of $\vect r$ along the
motion is its shadow on that line ([section 1.1](/tutorial/newton/vectors-and-indices/#a-vector-is-an-arrow-and-its-components-are-its-shadows-on-three-axes)),
$r_\parallel = \hat v\cdot\vect r$, and its part across is $r_\perp = |\vect r - r_\parallel\hat v|$, so that
$r^2 = r_\parallel^2 + r_\perp^2$.

We take two events: the pixel at its origin at $t = 0$, and the body at $\vect r$ at the same $t = 0$. In the pixel's
frame their differences are $\Delta t = 0$, $\Delta x_\parallel = r_\parallel$ and $\Delta x_\perp = r_\perp$. In the
body's frame the second rule of [](#eq:lorentz) gives the part along the motion, $\obs\gamma r_\parallel$, and the part
across is unchanged. The two events have different times in the body's frame, which does not matter, because the body
is at rest there. So

$$R_*^2 = \obs\gamma^2r_\parallel^2 + r_\perp^2 .$$

To write this with whole vectors, we use the cross product's length $|\obs{\vect v}\times\vect r| = \obs vr_\perp$
([section 1.1](/tutorial/newton/vectors-and-indices/#the-cross-product-is-written-with-the-levi-civita-symbol)) and
$r^2 = r_\parallel^2 + r_\perp^2$:

$$\begin{aligned}
\obs\gamma^2\Bigl(r^2 - \frac{|\obs{\vect v}\times\vect r|^2}{c^2}\Bigr) &= \obs\gamma^2r_\parallel^2 +
\obs\gamma^2(1 - \obs\beta^2)\,r_\perp^2\\
&= \obs\gamma^2r_\parallel^2 + r_\perp^2 ,
\end{aligned}$$

and

$$\boxed{\;\sym{rest-frame-distance}{R_*}^2 = \obs\gamma^2r_\parallel^2 + r_\perp^2 = \obs\gamma^2\Bigl(r^2 -
\frac{|\obs{\vect v}\times\vect r|^2}{c^2}\Bigr)\;} \label{eq:rstar}$$

A body at $0.6c$ seen directly across its path, $r_\parallel = 0$, is at $R_* = r$ in its own frame. Seen ahead of the
pixel along its path, $r_\perp = 0$, it is at $R_* = 1.25\,r$. The distance in the body's frame is longer along the
motion, because the pixel measures the gap at one of its own times, as the room measured the moving rod, and so finds
it contracted (Figure [](#fig:rest-frame-distance)). When $\obs v \to 0$, $R_* = r$.

![Look first at the horizontal dashed parts: along the motion the body's frame finds the gap 1.25 times longer, and
across it the same. So $R_* = \sqrt{1.5^2 + 1.6^2}\unit{m} = 2.19\unit{m}$, against $r = 2.0\unit{m}$ in the pixel's
frame. The pixel is drawn at its event $t = 0$.](tut-lorentz-rstar){#fig:rest-frame-distance}

A body of mass $\matter M$ at rest a distance $R$ away squeezes a ring across the line to it at the rate
$G\matter M/R^3$, the same in both directions across ([section 1.4](/tutorial/newton/tides/#beside-one-mass-the-ring-stretches-along-the-line-and-squeezes-across-it)).
Call this repeated rate $w$, in $\mathrm{s^{-2}}$. For a moving body $w = G\matter M/R_*^3$, with the distance taken in
the body's frame.[^state] A pixel can then read the body's mass from it:

$$\matter M = \frac{w\,\obs\gamma^3 r^3}{G}\Bigl(1 - \frac{\obs v_\perp^2}{c^2}\Bigr)^{3/2},$$

where $r$ is the distance to where the body is now and $\obs v_\perp$ is the body's speed across the line between them.
This follows from [](#eq:rstar) in a few steps, which the last problem below does.

## Rapidities add where velocities do not

We want to combine two boosts along the same line. A body moves at $\obs\beta_2c$ through the pixel's frame, which moves at $\obs\beta_1c$ through the room. In the pixel's frame the body is at $x' = \obs\beta_2ct'$. The rule
back to the room, with $\obs\beta_1$, gives

$$\begin{aligned} x &= \obs\gamma_1(\obs\beta_2 + \obs\beta_1)\,ct',\\ ct &= \obs\gamma_1(1 + \obs\beta_1\obs\beta_2)\,ct' .\end{aligned}$$

We divide the first by the second. The body moves through the room at

$$\boxed{\;\obs\beta = \frac{\obs\beta_1 + \obs\beta_2}{1 + \obs\beta_1\obs\beta_2}\;} . \label{eq:addition}$$

Two boosts of $0.6c$ give $1.2/1.36 = 0.882c$, not $1.2c$. When both speeds are small, the denominator is close to 1
and Newton's rule returns. When one speed is $c$, the result is $c$, as the starting fact requires.

A better measure of speed adds where velocities do not. A turn of the axes keeps $x^2 + y^2$, and the cosine and sine
of its angle obey $\cos^2 + \sin^2 = 1$, so they trace a circle. A boost keeps $-c^2t^2 + x^2$ instead, so we want two
functions whose squares differ by 1, which trace a hyperbola. They are built from the exponential. The
**hyperbolic cosine** and **hyperbolic sine** of a number $\eta$ are

$$\cosh\eta = \frac{e^\eta + e^{-\eta}}{2}, \qquad \sinh\eta = \frac{e^\eta - e^{-\eta}}{2},$$

and $\tanh\eta = \sinh\eta/\cosh\eta$. Squaring and subtracting gives
$\cosh^2\eta - \sinh^2\eta = \tfrac14\bigl[(e^{2\eta} + 2 + e^{-2\eta}) - (e^{2\eta} - 2 + e^{-2\eta})\bigr] = 1$. For
two numbers $a$ and $b$ we multiply out the exponentials:

$$\begin{aligned}
&\cosh a\cosh b + \sinh a\sinh b\\
&\quad= \tfrac14(e^a + e^{-a})(e^b + e^{-b})\\
&\qquad + \tfrac14(e^a - e^{-a})(e^b - e^{-b})\\
&\quad= \tfrac12\bigl(e^{a+b} + e^{-a-b}\bigr) = \cosh(a + b),
\end{aligned}$$

and in the same way $\sinh a\cosh b + \cosh a\sinh b = \sinh(a + b)$. Dividing the second by the first, and then top
and bottom by $\cosh a\cosh b$, gives

$$\tanh(a + b) = \frac{\tanh a + \tanh b}{1 + \tanh a\tanh b} .$$

This is [](#eq:addition) with $\obs\beta = \tanh\obs\eta$. So we define the **rapidity** $\sym{rapidity}{\obs\eta}$, a
pure number, by $\obs\beta = \tanh\obs\eta$.[^eta] Then $1 - \obs\beta^2 = 1/\cosh^2\obs\eta$, so $\obs\gamma =
\cosh\obs\eta$ and $\obs\gamma\obs\beta = \sinh\obs\eta$, and [](#eq:lorentz) becomes

$$\begin{pmatrix} ct'\\ x'\end{pmatrix} = \begin{pmatrix}\cosh\obs\eta & -\sinh\obs\eta\\ -\sinh\obs\eta &
\cosh\obs\eta\end{pmatrix}\begin{pmatrix} ct\\ x\end{pmatrix} .$$

The table of a turn of the axes ([section 1.1](/tutorial/newton/vectors-and-indices/#turning-the-axes-changes-the-components-not-the-arrow))
holds cosines and sines. This one holds their hyperbolic cousins, and it keeps $-c^2t^2 + x^2$ because
$\cosh^2 - \sinh^2 = 1$. Multiplying the tables of two boosts and using the addition formulas gives the table of
$\obs\eta_1 + \obs\eta_2$: **along one line, rapidities add**, as angles of turns about one axis do.[^exp]

**Numbers.** Multiplying the top and bottom of $\tanh\obs\eta$ by $e^{\obs\eta}$ gives $\tanh\obs\eta =
(e^{2\obs\eta} - 1)/(e^{2\obs\eta} + 1)$, and solving $\tanh\obs\eta = \obs\beta$ for the exponential gives
$e^{2\obs\eta} = (1 + \obs\beta)/(1 - \obs\beta)$. At $0.6c$ this is $1.6/0.4 = 4$, so the pixel's rapidity is exactly
$\obs\eta = \ln 2 = 0.693$. Two such boosts give $\ln 4$, where $e^{2\obs\eta} = 16$, and
$\tanh(\ln 4) = 15/17 = 0.882$, as [](#eq:addition) found (Figure [](#fig:rapidity-hyperbola)). For small speeds
$\obs\eta \approx \obs\beta$. As $\obs\beta \to 1$, $\obs\eta \to \infty$: $0.9c$ is the rapidity 1.47 and $0.99c$ is
2.65. Each boost adds a finite rapidity, so no number of boosts reaches the speed of light.

![Look first at the three dots: each is one tick of a clock, $c\obs\tau = 1$, for an observer at rest, at $0.6c$
and at $0.882c$. The steps between them are equal in rapidity, $\ln 2$ each, though they look unequal on the page;
the hyperbola is the set of events one tick from the origin for every
observer.](tut-lorentz-hyperbola){#fig:rapidity-hyperbola}

[Section 6.6](/tutorial/relativity/maxwell-complex/#a-moving-sensor-reads-the-field-turned-by-an-imaginary-angle) shows
that this boost is a turn of the axes by an imaginary angle, the rapidity.

## A boost can point in any direction

When the pixel moves along a direction that is not an axis, we split the position $\vect x$ of an event into its part
along the velocity and its part across it, keeping both as vectors. With $\obs{\vect\beta} = \obs{\vect v}/c$ and
$\hat\beta = \obs{\vect\beta}/\obs\beta$ the unit vector along it, the part along is
$\vect x_\parallel = (\hat\beta\cdot\vect x)\, \hat\beta$ and the part across is $\vect x_\perp = \vect x - \vect
x_\parallel$. The boost acts on the part along as [](#eq:lorentz) acts on $x$, and leaves the part across alone:

$$\boxed{\;\begin{aligned} ct' &= \obs\gamma\,(ct - \obs{\vect\beta}\cdot\vect x),\\ \vect x'_\parallel &=
\obs\gamma\,(\vect x_\parallel - \obs{\vect\beta}\,ct),\\ \vect x'_\perp &= \vect x_\perp\end{aligned}\;}
\label{eq:boost}$$

with $\obs\gamma = (1 - \obs\beta^2)^{-1/2}$. When $\obs{\vect\beta}$ lies along the $x$ axis this is [](#eq:lorentz)
with $y' = y$ and $z' = z$. Section 6.2 writes [](#eq:boost) as one table of four rows and four columns,
$\Lambda^\mu{}_\nu$.

Two boosts along different directions do not make a single boost. They make a boost followed by a turn of the axes. We
state this without proof here; [section 6.6](/tutorial/relativity/maxwell-complex/#two-boosts-make-a-boost-and-a-turn)
computes it, and for $0.6c$ along $x$ followed by $0.6c$ along $y$ the turn is $12.7°$. Only boosts along one line
combine by adding their rapidities.

::: try {#lorentz-diagram}
The room's axes $x$ and $ct$ in light-seconds, the light lines dashed, and the pixel's axes $ct'$ and $x'$ drawn over
them in the observer's colour, each with a tick at one light-second of the pixel's own measure. The slider sets the
pixel's rapidity $\obs\eta$, with its $\obs\beta$ and $\obs\gamma$ beside it. Two events, A and B, can be dragged
anywhere; through each runs the faint hyperbola of its interval from the origin, and the table lists each event's
times and places for the room and for the pixel, the interval between them, and which of the two the pixel calls
first. It opens on the two flashes at $0.6c$. The second view, *Two boosts*, adds a boost on top of the pixel's and
reads the speed of the result.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, open
*Two boosts*, set the second boost to $0.6c$, and compare the speed it reads with $0.6c + 0.6c$.
:::

**The idea to keep: because light has the same speed for every observer, time and distance mix when an observer moves.
Moving clocks run slow, "now" tilts, and only the interval and each clock's own time are shared. Speeds do not add, but
rapidities do, and $0.6c$ is the rapidity $\ln 2$.**

::: problems
### Practice

**[6.1]** A pixel crosses a room 10 m wide at $0.6c$. How long does the crossing take on the room's clocks and on the
pixel's, and how wide is the room for the pixel?

::: solution
On the room's clocks, $10\unit{m}/(0.6 \times 2.998\times10^8\unit{m\,s^{-1}}) = 55.6$ ns. The pixel's clock advances
$55.6/1.25 = 44.5$ ns. For the pixel the room moves past at $0.6c$ and is contracted to $10/1.25 = 8$ m, and
$8\unit{m}/0.6c = 44.5$ ns again, as it must be.
:::

**[6.1]** What is $\obs\gamma$ at half the speed of light, and how long does a journey of 1 h by the room's clocks last
on the traveller's clock?

::: solution
$\obs\gamma = 1/\sqrt{1 - 0.25} = 1.155$, so the traveller's clock advances $60/1.155 = 52$ minutes.
:::

**[6.1]** Two boosts of rapidity 1 along the same line give what speed?

::: solution
The rapidities add to 2, and $\tanh 2 = 0.964$, so the speed is $0.964c$.
:::

### Stretch

**[6.1]** Return to the cart and ball of the first section, where Newton adds speeds. Show that for $\obs\beta_1,
\obs\beta_2 \ll 1$ the rule [](#eq:addition) reduces to Newton's, and find the size of the first correction for two
cars, each at $30\unit{m\,s^{-1}}$, approaching each other.

::: solution
For small speeds $1/(1 + \obs\beta_1\obs\beta_2) \approx 1 - \obs\beta_1\obs\beta_2$, so $\obs\beta \approx
(\obs\beta_1 + \obs\beta_2)(1 - \obs\beta_1\obs\beta_2)$: Newton's sum, reduced by the fraction
$\obs\beta_1\obs\beta_2$. For the cars $\obs\beta_1 = \obs\beta_2 = 30/2.998\times10^8 = 1.0\times10^{-7}$, so the
fraction is $1.0\times10^{-14}$. One car sees the other approach at $60\unit{m\,s^{-1}}$ less $0.6$ picometres per
second.
:::

### The camera

**[6.1]** From $R_*^2 = \obs\gamma^2(r^2 - |\obs{\vect v}\times\vect r|^2/c^2)$ and $w = G\matter M/R_*^3$, show that
$\matter M = w\obs\gamma^3r^3(1 - \obs v_\perp^2/c^2)^{3/2}/G$, where $\obs v_\perp$ is the body's speed across the line
from the pixel to it. Check it at $0.6c$ for a body seen directly across its path.

::: solution
In [](#eq:rstar) we wrote $|\obs{\vect v}\times\vect r| = \obs vr_\perp$. The same length is $\obs v_\perp r$, because
both equal $\obs vr\sin\vartheta$, with $\vartheta$ the angle between the two vectors. So $R_*^2 =
\obs\gamma^2r^2(1 - \obs v_\perp^2/c^2)$, $R_*^3 = \obs\gamma^3r^3(1 - \obs v_\perp^2/c^2)^{3/2}$, and $\matter M =
wR_*^3/G$ is the stated result. Directly across the path $\obs v_\perp = \obs v$, so $\obs\gamma^3(1 -
\obs\beta^2)^{3/2} = 1$, $R_* = r$ and $\matter M = wr^3/G$, the mass of a body at rest at the distance $r$.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel), [](/paper/#eq:tidal): the tide for an observer at rest relative to the masses, with
  proper time $t$ ([proper time](#a-moving-clock-runs-slow-and-a-clocks-own-time-is-the-length-of-its-path)).
- [*One complex matrix*](/paper/#par:one-complex-matrix), beside [](/paper/#eq:W): a pixel moving with rapidity $\eta$
  at the speed $c\tanh\eta$ ([rapidity](#rapidities-add-where-velocities-do-not)).
- [*The state of a moving body*](/paper/#par:the-state-of-a-moving-body), [](/paper/#eq:moving-state): $\obs\gamma$ and
  the rest-frame distance $R_*$ ([here](#a-moving-ruler-is-shorter-along-its-motion-and-distances-in-a-bodys-own-frame-are-longer)).
- [*The absence of gravitational aberration*](/paper/#par:the-absence-of-gravitational-aberration): the slice of
  simultaneity of [this section](#moving-observers-disagree-about-what-happens-at-the-same-time).
- Figures [](/paper/#fig:speedometer) and [](/paper/#fig:present) at $0.6c$, and [](/paper/#fig:stars) at $0.9c$.
- Appendix C, [*The principal null directions of a moving body*](/paper/#par:the-principal-null-directions-of-a-moving-body):
  the boost in any direction.
- [*Through a room at nearly the speed of light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light), with angles
  that shrink as $1/\obs\gamma$, and [*A cosmic string*](/paper/#par:a-cosmic-string), whose step of temperature carries
  the factor $\obs\gamma\obs v$ ([section 12.2](/tutorial/sky/universe/#a-cosmic-string-removes-a-wedge-of-space-invisible-to-every-pixel-but-not-to-what-lies-behind)).
:::

::: deeper
- The [GR course, section 3.2](https://neovand.github.io/general-relativity/chapter-3.html#3-2-deriving-a-lorentz-boost-without-pulling-a-rabbit-from-a-matrix)
  derives the same boost with every step, after
  [section 3.1](https://neovand.github.io/general-relativity/chapter-3.html#3-1-events-not-photographs) on events and
  synchronized clocks; its lesson [*Hyperbolas and rapidity*](https://neovand.github.io/general-relativity/chapter-3.html#hyperbolas-and-rapidity)
  builds a boost from exponentials.
- The GR course, [section 3.4](https://neovand.github.io/general-relativity/chapter-3.html#3-4-proper-time-your-life-is-a-line-integral)
  on proper time and
  [section 3.5](https://neovand.github.io/general-relativity/chapter-3.html#3-5-the-twins-acceleration-explains-the-asymmetry-geometry-computes-the-age)
  on the twins.
- E. F. Taylor and J. A. Wheeler, *Spacetime Physics* (2nd edition, Freeman, 1992), chapters 1 to 3 and 5.
:::

[^first]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its Fig. [](/paper/#fig:speedometer);
    the tide of an observer at rest is defined in Sec. II, [](/paper/#eq:tidal).

[^hoop]: Two equal hoops, one at rest and one moving along their common axis, pass through each other. If motion
    shrank the moving hoop, it would pass inside the hoop at rest; but in the moving hoop's frame the other hoop moves
    and would shrink and pass inside. Both cannot happen, so motion leaves sizes across it unchanged.

[^now]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, [*The absence of gravitational
    aberration*](/paper/#par:the-absence-of-gravitational-aberration) and Fig. [](/paper/#fig:present).

[^clock]: Muons circling in a storage ring at $\obs\gamma = 29.3$, accelerating at about $10^{18}$ times the Earth's
    gravity, lived $\obs\gamma$ times longer than muons at rest, to two parts in a thousand (J. Bailey and colleagues,
    *Nature* 268, 301, 1977).

[^sun]: The Sun's gravity slows the Earth's clocks by twice as much, $9.9\times10^{-9}$ ([section 7.1](/tutorial/geometry/metric/#clocks-higher-up-run-faster-clocks-read-the-potential)).
    On a circular orbit the effect of motion is exactly half that of gravity, because $\obs v^2 = G\matter M_\odot/r$.

[^state]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, [*The state of a moving
    body*](/paper/#par:the-state-of-a-moving-body), as its equation [](/paper/#eq:moving-state), which also gives the
    body's distance and its rate of change.

[^eta]: The letter $\obs\eta$ carries the observer's colour; the viscosity of [section 4.4](/tutorial/response/viscosity/)
    is $\matter\eta$, and the $\eta_{\mu\nu}$ of section 6.2 always carries two indices.

[^exp]: Write the table as $1\cosh\obs\eta - K\sinh\obs\eta$, with $K$ the table with 0 on the diagonal and 1 off it.
    Since $K^2 = 1$, the series of $e^{-\obs\eta K}$ splits into even powers, which give $\cosh\obs\eta$, and odd
    powers, which give $-K\sinh\obs\eta$. So the boost is the exponential $e^{-\obs\eta K}$, as a turn is the
    exponential of a fixed table times its angle.
