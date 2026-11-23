---
id: '6.2'
title: 'Spacetime vectors: η, raising and lowering indices'
question: 'Earlier chapters wrote every index low and said that a raised and a lowered index "differ only in relativity". What changes when time joins the three directions of space, and what does the paper''s signature $-{+}{+}{+}$ say?'
part: '6'
requires: ['1.1', '1.4', '1.5', '6.1']
paper: [sec:pixel, eq:tidal, eq:deviation, eq:magnetic, sec:one-pixel, sec:second-order, app:proofs]
figures: []
live: [lorentz-diagram]
depth: A
---

The paper's [Section II](/paper/#sec:pixel) defines the tide that a pixel measures in one line,

{{paper eq:tidal}}

and adds that the curvature $R$ is taken "with signature $-{+}{+}{+}$". In the paper's next equation,
[](/paper/#eq:deviation), it writes the separation of two free particles as $\xi^i$, with the index raised, where
chapter [1.4](/tutorial/newton/tides/) wrote $\xi_i$. Much later, in [*A mass that
passes*](/paper/#par:a-mass-that-passes), the paper writes a stress built from a function $\phi$ as
$(\partial_\mu\partial_\nu - \eta_{\mu\nu}\Box)\phi$. This is the only place where the paper writes the symbol
$\eta_{\mu\nu}$.

Earlier chapters wrote every index low and said that a raised and a lowered index differ only in relativity. So we ask
what changes when time joins the three directions of space, and what the paper's signature $-{+}{+}{+}$ says. Chapter
[6.1](/tutorial/relativity/lorentz/#steady-motion-along-a-line-mixes-time-and-distance) found that every observer
computes the same interval between two events. Here we build on it a dot product for events, with one minus sign, on
time. From it come the two positions of an index, the rule for moving an index from one position to the other, and the
reason why the paper defines its tide "for an observer at rest".

::: plain
In space, three numbers describe an arrow, and the length of an arrow is the same however the axes are turned. In
relativity, four numbers describe the step from one event to another: the time between them, multiplied by the speed of
light so that it becomes a distance, and the three distances in space. The quantity that every observer agrees on is
not the sum of the four squares. It is the sum of the three squares of space minus the square of the time. This one
minus sign is what the paper means by its "signature $-{+}{+}{+}$".

Because of that sign, every vector can be written in two ways, which differ only in the sign of the time component.
One way suits steps and velocities. The other suits rates of change, such as how fast a quantity grows in each
direction. Pairing one of each kind gives a number that every observer agrees on.

The three directions of space carry no minus sign. So for an observer in free motion, using straight axes at right
angles, a raised and a lowered index in space mean the same thing. What an observer measures always involves its own
direction in time. An observer that moves has a different direction in time, so it measures a different mixture of the
same quantities.
:::

## An event is a vector of four components

We want one list of numbers for an event, so that a change of observer becomes one table acting on that list, as a
turn of the axes was one table acting on an arrow in chapter
[1.1](/tutorial/newton/vectors-and-indices/#turning-the-axes-changes-the-components-not-the-arrow). An event, a
place at a time (chapter [6.1](/tutorial/relativity/lorentz/#every-observer-measures-the-same-speed-of-light)), is
measured in an observer's frame by a time $t$ and a position $\vect x$ with components $x$, $y$ and $z$. We multiply the
time by $c$, so that all four numbers are in metres, and write

$$\sym{four-position}{x^\mu} = (x^0, x^1, x^2, x^3) = (ct, x, y, z) = (ct, \vect x) .$$

A list of four numbers whose entries change in a fixed way when the observer changes, as these do, is a
**four-vector**, or spacetime vector. Its four entries are its components, and $x^\mu$ stands both for any one of
them and for the whole list, as $a_i$ did in chapter 1.1. The index is written raised; the reason comes in
[the section on lowering](#lowering-an-index-changes-only-the-sign-of-time). A **Greek index**, such as $\mu$, $\nu$,
$\alpha$ or $\beta$, runs over the four values 0, 1, 2 and 3, with 0 for time. A Latin index, such as $i$ or $j$, runs
over 1, 2 and 3 only, the directions of space, as in Part 1. These are the paper's rules, and its $x^0 = ct$.[^eta]

**The boost is one table.** Chapter 6.1's boost along $x$ at the speed $\obs\beta c$ gave $ct' = \obs\gamma(ct -
\obs\beta x)$ and $x' = \obs\gamma(x - \obs\beta ct)$, with $y' = y$ and $z' = z$. Each new component is a sum of the
old ones, each multiplied by a number, so we write

$$x'^\mu = \sym{lorentz-matrix}{\Lambda^\mu{}_\nu}\,x^\nu ,$$

with the index $\nu$ summed over its four values by the summation convention of chapter
[1.1](/tutorial/newton/vectors-and-indices/#an-index-stands-for-all-three-directions). The table $\Lambda^\mu{}_\nu$ has
the row $\mu$ and the column $\nu$, both counted from 0, and for the boost along $x$ it is

$$\Lambda^\mu{}_\nu = \begin{pmatrix} \obs\gamma & -\obs\gamma\obs\beta & 0 & 0\\ -\obs\gamma\obs\beta & \obs\gamma & 0
& 0\\ 0 & 0 & 1 & 0\\ 0 & 0 & 0 & 1\end{pmatrix} .$$

Row 0 times $(ct, x, y, z)$ gives $ct'$, row 1 gives $x'$, and rows 2 and 3 leave $y$ and $z$ alone. Its entries are
pure numbers, because all four components are in metres. At $0.6c$ they are $\obs\gamma = 1.25$ and $\obs\gamma\obs\beta
= 0.75$. A summed Greek index appears once raised and once lowered, as $\nu$ does here. [The section on
lowering](#lowering-an-index-changes-only-the-sign-of-time) gives the reason, and says when the position of a spatial
index does not matter.[^lambda]

A boost in any other direction is a table of the same kind, built from chapter 6.1's [boost along
$\obs{\vect\beta}$](/tutorial/relativity/lorentz/#a-boost-can-point-in-any-direction); this chapter needs only the boost
along $x$.

**Why four.** The interval of chapter 6.1, $-c^2\Delta t^2 + \Delta x^2$, is shared by every observer, while the time
$\Delta t$ and the distance $\Delta x$ are not. A boost mixes $ct$ and $x$ as a turn mixes $x$ and $y$, so time and
place belong in one list, as the east and north components of an arrow do. A non-example is the list $(t, x, y, z)$
with $t$ in seconds. Its first entry has a different unit from the other three, so its squares cannot be added into an
interval, and the table that changes it would hold entries in seconds per metre and metres per second.

## The Minkowski metric measures the interval, with one minus sign for time

We want a dot product of four-vectors that every observer agrees on, as every set of turned axes agreed on chapter
1.1's $\vect a\cdot\vect b = a_ib_i$. The interval is the natural candidate, because every inertial observer computes
the same value. We define the table

$$\sym{minkowski-metric}{\field\eta}_{\mu\nu} = \mathrm{diag}(-1, 1, 1, 1) = \begin{pmatrix} -1 & 0 & 0 & 0\\ 0 & 1 &
0 & 0\\ 0 & 0 & 1 & 0\\ 0 & 0 & 0 & 1\end{pmatrix} ,$$

the **Minkowski metric**, a table of pure numbers, and with it the **dot product** of two four-vectors $a^\mu$ and
$b^\mu$:

$$\begin{aligned}
a\cdot b &= \field\eta_{\mu\nu}\,a^\mu b^\nu\\
&= -a^0b^0 + a^1b^1 + a^2b^2 + a^3b^3\\
&= -a^0b^0 + \vect a\cdot\vect b .
\end{aligned}$$

Both indices are summed, over sixteen terms, and only the four on the diagonal survive. Here $\vect a$ is the part of
$a^\mu$ in space, with components $a^1$, $a^2$ and $a^3$. A table that turns steps into squared lengths is called a
metric. For the step $\Delta x^\mu$ between two events, the dot product with itself is

$$\Delta x\cdot\Delta x = -c^2\Delta t^2 + |\Delta\vect x|^2 ,$$

the interval of chapter 6.1, in square metres.

**Every boost keeps the metric.** We want the condition on $\Lambda^\mu{}_\nu$ that keeps every dot product, the
analogue of chapter 1.1's $R_{ki}R_{kj} = \delta_{ij}$ for a turn. We assume, from chapter 6.1, that **every boost keeps
the interval of every step**. First, this fixes every dot product, not only squares. The table $\field\eta_{\mu\nu}$ is
symmetric, so $a\cdot b = b\cdot a$, and expanding $(a + b)\cdot(a + b) = a\cdot a + 2\,a\cdot b + b\cdot b$ gives

$$a\cdot b = \tfrac12\bigl[(a + b)\cdot(a + b) - a\cdot a - b\cdot b\bigr] .$$

The boost keeps each of the three squares on the right, so it keeps $a\cdot b$. Second, we write the boosted dot
product with the table, using $\alpha$ and $\beta$ as the summed letters:

$$\begin{aligned}
a'\cdot b' &= \field\eta_{\alpha\beta}\,\Lambda^\alpha{}_\mu a^\mu\,\Lambda^\beta{}_\nu b^\nu\\
&= \bigl(\field\eta_{\alpha\beta}\,\Lambda^\alpha{}_\mu\Lambda^\beta{}_\nu\bigr)\,a^\mu b^\nu .
\end{aligned}$$

This equals $\field\eta_{\mu\nu}a^\mu b^\nu$ for every $a$ and $b$. Choosing $a$ with a 1 in the place $\mu$ and $b$ with
a 1 in the place $\nu$, and zeros elsewhere, picks out one entry of each table, so the bracket and $\field\eta_{\mu\nu}$
agree entry by entry:

$$\boxed{\;\field\eta_{\alpha\beta}\,\Lambda^\alpha{}_\mu\,\Lambda^\beta{}_\nu = \field\eta_{\mu\nu}\;} \label{eq:keeps-eta}$$

A turn keeps the table $\delta_{ij}$, and a boost keeps the table $\field\eta_{\mu\nu}$. For the boost along $x$, the
entry $00$ is $-\obs\gamma^2 + \obs\gamma^2\obs\beta^2 = -1$, the entry $01$ is $\obs\gamma^2\obs\beta -
\obs\gamma^2\obs\beta = 0$, and the entry $11$ is $-\obs\gamma^2\obs\beta^2 + \obs\gamma^2 = 1$, because
$\obs\gamma^2(1 - \obs\beta^2) = 1$.[^random]

**The signature.** The list of signs on the diagonal of $\field\eta_{\mu\nu}$ is the signature, which chapter 6.1 named.
The paper makes the same choice as Misner, Thorne and Wheeler, with the minus sign on time. Distances in space then
count as positive, and a step along a clock's path has $\Delta x\cdot\Delta x = -c^2\Delta\obs\tau^2$, with $\obs\tau$
the clock's proper time
([6.1](/tutorial/relativity/lorentz/#a-moving-clock-runs-slow-and-a-clocks-own-time-is-the-length-of-its-path)). This is
the sense of chapter [R1](/tutorial/newton/reading-section-ii/#equations-1-and-2-define-the-tide-and-say-what-it-does)'s
reading: time enters the measure of separation with the opposite sign to the three directions of space. The paper names
its signature because the signs of its curvature depend on it.[^signature]

**Three kinds of vector.** Every observer computes the same $a\cdot a$, so its sign sorts four-vectors into three
kinds that every observer agrees on. A four-vector is **time-like** when $a\cdot a < 0$. Its time component is then
larger than its length in space, as for a step along the path of a clock, which moves slower than light. It is
**null** when $a\cdot a = 0$ and $a$ is not zero, as for a step along the path of a flash. It is **space-like** when
$a\cdot a > 0$, as for the step between two events too far apart for light to cross between them in the time between
them, so that no clock can be present at both. The null steps from one event form its **light cone** (Figure
[](#fig:vector-kinds)).

**Two flashes.** Chapter 6.1's two lamps flash at the same time in the room, one light-second apart, so $\Delta x^\mu =
(0, c \times 1\unit{s}, 0, 0)$ and

$$\Delta x\cdot\Delta x = (2.998\times10^8\unit{m})^2 = 8.99\times10^{16}\unit{m^2} ,$$

one light-second squared, a space-like step. For the pixel at $0.6c$ the step is $\Delta x'^\mu = (-0.75, 1.25, 0, 0)$
in light-seconds, with 6.1's $-0.75\unit{s}$ in its time component, and $-0.5625 + 1.5625 = 1$ light-second squared
again. A clock at rest that ticks once a second has the step $(c \times 1\unit{s}, 0, 0, 0)$ and the interval
$-8.99\times10^{16}\unit{m^2}$, the same size with the opposite sign.

![Look first at the three arrows from $A$: one inside the light cone, one on it and one outside. The sign of
$a\cdot a$, which every observer agrees on, says which: negative for the path of a clock, zero for light, positive for
two events that no clock can attend, such as chapter 6.1's two flashes $A$ and $B$. Units are
light-seconds.](tut-vectors-kinds){#fig:vector-kinds}

## The four-velocity has the same length for every body

We want a four-vector for the motion of a body, because the paper's observers are moving pixels, and a velocity in
space changes from one observer to another in an awkward way (chapter
[6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not)'s addition rule). A body's worldline is a
list of events, and we label them by the proper time $\obs\tau$ that the body's own clock reads. The step $\dd x^\mu$
between two neighbouring events on the worldline is a four-vector, and $\dd\obs\tau$ is the same for every observer, so
their ratio is a four-vector too:

$$\sym{four-velocity}{\obs u^\mu} = \frac{\dd x^\mu}{\dd\obs\tau} .$$

This is the **four-velocity**, in metres per second. In a frame where the body moves at $\obs{\vect v}$, chapter 6.1's
proper time gives $\dd t/\dd\obs\tau = \obs\gamma$. So $\dd x^0/\dd\obs\tau = c\obs\gamma$, and the chain rule gives
$\dd x^i/\dd\obs\tau = (\dd x^i/\dd t)(\dd t/\dd\obs\tau) = \obs\gamma\obs v_i$:

$$\obs u^\mu = \obs\gamma\,(c, \obs{\vect v}) .$$

We take its dot product with itself and use $\obs\gamma^2(1 - \obs\beta^2) = 1$:

$$\boxed{\;\obs u\cdot\obs u = \obs\gamma^2\,(-c^2 + \obs v^2) = -c^2\;} \label{eq:unit}$$

Every body's four-velocity has the same squared length, whatever its speed. At $0.6c$, $\obs u^\mu = (1.25c, 0.75c,
0, 0)$, and $\obs u\cdot\obs u = (-1.5625 + 0.5625)\,c^2 = -c^2$. For a slow body $\obs\gamma \approx 1$, and
$\obs u^\mu \approx (c, \obs{\vect v})$: a time component $c$ and Newton's velocity.

**An observer is a direction in time.** By [](#eq:unit), an observer's four-velocity is a time-like vector of fixed
length, and it points along the observer's worldline. The events that the observer calls simultaneous with an event lie
along the steps $a^\mu$ with $\obs u\cdot a = 0$. In the observer's own frame $\obs u^\mu = (c, 0, 0, 0)$, so $\obs
u\cdot a = -c\,a^0$, which is zero exactly when the step takes no time. Every observer computes the same $\obs u\cdot
a$, so the condition picks out the same steps in every frame. In the room, for the pixel at $0.6c$, $\obs u\cdot a =
c\,(-1.25a^0 + 0.75a^1)$ is zero when $a^0 = 0.6\,a^1$, which is the line $ct = 0.6\,x$: chapter
[6.1](/tutorial/relativity/lorentz/#moving-observers-disagree-about-what-happens-at-the-same-time)'s tilted slice of
simultaneity, now in one line. Two four-vectors whose dot product is zero are called orthogonal, as two arrows at right
angles are, so the pixel's "now" is orthogonal to its four-velocity (Figure [](#fig:velocity-hyperbola)).

![Look first at the arrow at $0.6c$ and the dashed line below it: they are mirror images across the light line,
which is how two directions orthogonal in the sense of $\field\eta_{\mu\nu}$ look on paper. Every four-velocity ends
on the same hyperbola, $\obs u\cdot\obs u = -c^2$.](tut-vectors-hyperbola){#fig:velocity-hyperbola}

## Lowering an index changes only the sign of time

We want a list that measures four-vectors: one that, multiplied into any step $b^\mu$ and summed, gives the dot product
$a\cdot b$ that every observer agrees on. In chapter 1.1 the arrow itself was such a list, because $\vect a\cdot\vect b
= a_ib_i$ multiplies matching components and adds them. In spacetime that plain sum would miss the minus sign of time.
So for every four-vector $a^\mu$ we ask for the list $a_\mu$ with

$$a_\mu b^\mu = a\cdot b \quad\text{for every } b^\mu .$$

The terms in $b^0$ on the two sides agree when $a_0 = -a^0$, and the terms in $b^i$ when $a_i = a^i$. The dot product
counts time with a minus sign, so the time entry of the measuring list carries that sign, and the three entries of space
stay as they are. In one formula,

$$a_\mu = \field\eta_{\mu\nu}\,a^\nu ,$$

which is called **lowering the index**. Because $\field\eta_{\mu\nu}$ is diagonal, the sum over $\nu$ keeps only $\nu =
\mu$ and multiplies it by $-1$ or $+1$. The lowered list is a measuring device: given any step, it returns a number that
every observer agrees on. The gradient below is a device of the same kind.

The inverse table $\sym{inverse-minkowski-metric}{\field\eta}^{\mu\nu}$ undoes the step. It is defined by
$\field\eta^{\mu\alpha}\field\eta_{\alpha\nu} = \delta^\mu{}_\nu$, where $\delta^\mu{}_\nu$ is 1 when $\mu = \nu$ and 0
otherwise, the Kronecker delta of chapter 1.1 with four values. Since $(-1)(-1) = 1$, $\field\eta^{\mu\nu} =
\mathrm{diag}(-1, 1, 1, 1)$, the same table, and $a^\mu = \field\eta^{\mu\nu}a_\nu$ is **raising the index**. For the
pixel at $0.6c$, $\obs u_\mu = (-1.25c, 0.75c, 0, 0)$, and $\obs u_\mu\obs u^\mu = -1.5625c^2 + 0.5625c^2 = -c^2$
again.

**The reason for two positions** lies in quantities that measure steps instead of being steps. Take a number $f$ at each
event that every observer agrees on, such as the phase of a wave, which counts its crests. Across a small step the
chain rule of calculus gives

$$\dd f = \frac{\partial f}{\partial x^\mu}\,\dd x^\mu = \partial_\mu f\,\dd x^\mu ,$$

where $\partial_\mu = \partial/\partial x^\mu$. Its index is written low. A way to remember this is that $x^\mu$ stands
below the fraction's line, but the reason is the way the rates change, which we find now. Every observer agrees on $\dd
f$, the difference of $f$ between two events. A boost changes the step by $\Lambda^\mu{}_\nu$. To find how it changes
the rates, we write the old coordinates in terms of the new with the inverse table $(\Lambda^{-1})^\nu{}_\alpha$, which
for a boost is the same boost with $-\obs\beta$ (chapter 6.1's rule back). Then we differentiate with respect to one new
coordinate $x'^\mu$:

$$x^\nu = (\Lambda^{-1})^\nu{}_\alpha\,x'^\alpha, \qquad\text{so}\qquad \frac{\partial x^\nu}{\partial x'^\mu} = (\Lambda^{-1})^\nu{}_\mu .$$

The four new coordinates vary independently, so the derivative keeps only the term with $\alpha = \mu$. The chain rule
of calculus, applied to $f$ as a function of the old coordinates, then gives

$$\begin{aligned}
\partial'_\mu f &= \frac{\partial x^\nu}{\partial x'^\mu}\,\partial_\nu f\\
&= (\Lambda^{-1})^\nu{}_\mu\,\partial_\nu f .
\end{aligned}$$

So the rates change by the inverse table, while the step changes by the table itself. In
$(\Lambda^{-1})^\nu{}_\mu\,\partial_\nu f$ the summed index $\nu$ is the row and the new index $\mu$ the column, the
reverse of $\Lambda^\mu{}_\nu\,\dd x^\nu$, where the new index is the row. (The boost along $x$ is a symmetric table, so
for it the exchange changes nothing.) Paired, the two changes cancel, since
$(\Lambda^{-1})^\nu{}_\mu\Lambda^\mu{}_\alpha = \delta^\nu{}_\alpha$:

$$\begin{aligned}
\partial'_\mu f\,\dd x'^\mu &= (\Lambda^{-1})^\nu{}_\mu\,\Lambda^\mu{}_\alpha\,\partial_\nu f\,\dd x^\alpha\\
&= \partial_\alpha f\,\dd x^\alpha .
\end{aligned}$$

**A number.** Take $f = 2x - ct$, with $x$ and $ct$ in light-seconds, so that its rates are per light-second, and the
step $a^\mu$ from the origin to $x = 1.5$ light-seconds at $ct = 0$. In the room, $\partial_\mu f = (-1, 2, 0, 0)$ and
$a^\mu = (0, 1.5, 0, 0)$, so $\partial_\mu f\,a^\mu = 3$: the step runs from the level line $f = 0$ to the level line $f
= 3$, across three gaps. For the pixel at $0.6c$ the inverse table has the entries 1.25 and 0.75, so $\partial'_0 f =
1.25(-1) + 0.75(2) = 0.25$ and $\partial'_1 f = 0.75(-1) + 1.25(2) = 1.75$, while the step becomes $a'^\mu = (-1.125,
1.875, 0, 0)$. The pairing is $0.25(-1.125) + 1.75(1.875) = 3$ again (Figure [](#fig:gaps-crossed)).

![Look first at the count of gaps that the arrow crosses: three in both panels. The step and the level lines both
change when the observer changes, the step by the boost and the spacing of the lines by its inverse, and the count of
lines crossed, $\partial_\mu f\,a^\mu$, stays the same. After the gradient figure of the GR course, section
2.3.](tut-vectors-gradient){#fig:gaps-crossed}

The lowered list $a_\mu$ changes in the same way as the rates. The [section on the
metric](#the-minkowski-metric-measures-the-interval-with-one-minus-sign-for-time) found that a boost keeps every dot
product, so $a'_\mu b'^\mu = a_\mu b^\mu$ for every $b$. We put in $b'^\mu = \Lambda^\mu{}_\nu b^\nu$, so
$a'_\mu\Lambda^\mu{}_\nu b^\nu = a_\nu b^\nu$ for every $b$, and therefore $a'_\mu\Lambda^\mu{}_\nu = a_\nu$. We
multiply by $(\Lambda^{-1})^\nu{}_\rho$, sum over $\nu$, and use $\Lambda^\mu{}_\nu(\Lambda^{-1})^\nu{}_\rho =
\delta^\mu{}_\rho$:

$$\boxed{\;a'^\mu = \Lambda^\mu{}_\nu\,a^\nu, \qquad a'_\rho = (\Lambda^{-1})^\nu{}_\rho\,a_\nu\;} \label{eq:two-rules}$$

An **upper index** changes by the table and a **lower index** by its inverse, and a sum over one of each gives a number
that every observer agrees on. This is why a summed Greek index appears once up and once down.[^names]
For the pixel's own four-velocity, the boost to its frame has $(\Lambda^{-1})^0{}_0 = (\Lambda^{-1})^1{}_1 = 1.25$ and
$(\Lambda^{-1})^1{}_0 = (\Lambda^{-1})^0{}_1 = 0.75$. So $\obs u'_0 = 1.25(-1.25c) + 0.75(0.75c) = -c$ and $\obs u'_1 =
0.75(-1.25c) + 1.25(0.75c) = 0$: in its own frame the pixel is at rest, with $\obs u'_\mu = (-c, 0, 0, 0)$.

**When the position of an index matters.** A Greek index must always stand in its right place, and a summed Greek index
pairs one upper with one lower, because only that sum is the same for every observer. A Latin index is more forgiving,
because only an index 0 changes sign when it moves. In an inertial frame with Cartesian axes (straight axes at right
angles, marked in metres), the spatial block of the metric is $\field\eta_{ij} = \delta_{ij}$, so $a^i = a_i$: **a
spatial index means the same up or down**, and two spatial indices may be summed both low, as Part 1 summed them. This
holds in every inertial frame, because every such frame has the same table $\field\eta_{\mu\nu}$. It agrees with Part
1's turns too: the inverse of a turn $R$ is its transpose, so $(R^{-1})^{\mathsf T} = R$, and a lower index changes by
$R$ itself, exactly as an upper one does.

In curved spacetime the same holds in the local frame of a freely falling observer, one moved by gravity alone, because
there the metric is $\field\eta_{\mu\nu}$ at the observer's place (chapter 7.1). That is the frame of the paper's
[](/paper/#eq:deviation). Its $\xi^i$ is a separation in the observer's own space, with $\xi^0 = 0$, and its components
are 1.4's $\xi_i$. The paper also sums spatial indices both low, as $p$ and $q$ in $\epsilon_{ipq}R_{pqj0}$ of the
paper's [](/paper/#eq:magnetic). The tutorial keeps writing spatial indices low, except where it quotes the paper.

## The gradient is a lower-index vector, and the wave operator is its square

We want the wave operator in the notation of four-vectors, because the paper writes it once, as $\Box$, and because it
is the clearest case of a lower index. The **four-gradient** is the list of rates of the previous section,

$$\sym{four-gradient}{\partial_\mu} = \frac{\partial}{\partial x^\mu} = \Bigl(\frac1c\frac{\partial}{\partial t},
\nabla\Bigr) ,$$

in $\mathrm{m^{-1}}$. Its first entry carries $1/c$ because $x^0 = ct$, and its last three are chapter
[1.2](/tutorial/newton/field-and-potential/#the-gradient-points-uphill)'s gradient $\nabla$. Raising the index gives
$\partial^\mu = \field\eta^{\mu\nu}\partial_\nu = (-c^{-1}\partial_t, \nabla)$. The square of the four-gradient is

$$\boxed{\;\sym{wave-operator}{\Box} = \field\eta^{\mu\nu}\,\partial_\mu\partial_\nu = \partial^\mu\partial_\mu =
-\frac{1}{c^2}\frac{\partial^2}{\partial t^2} + \nabla^2\;} \label{eq:box}$$

the **d'Alembert operator**, or wave operator, in $\mathrm{m^{-2}}$. The equation $\Box\phi = 0$ is the wave equation of
chapter [5.1](/tutorial/waves/wave-equation/#a-shear-in-a-solid-travels-and-its-law-is-the-wave-equation), for waves
that travel at $c$; readers who have not met it need only [](#eq:box). Every index of $\Box$ is summed, so every
observer finds the same operator (the practice problem below checks it). When nothing changes in time, $\Box$ becomes
$\nabla^2$, the operator of Poisson's equation in chapter
[1.3](/tutorial/newton/gauss-and-poisson/#poissons-equation-is-gausss-law-at-every-point).

**A plane wave.** We try $\phi = e^{ik_\mu x^\mu}$, with the **wave four-vector**

$$\sym{wave-four-vector}{k^\mu} = \Bigl(\frac{\omega}{c}, \vect k\Bigr) ,$$

in $\mathrm{m^{-1}}$, where $\omega$ is the angular frequency and $\vect k$ the wavevector, which points across the
crests. Lowering gives $k_\mu = (-\omega/c, \vect k)$, so the phase is $k_\mu x^\mu = \vect k\cdot\vect x - \omega t$,
with the paper's signs, $+i\vect k\cdot\vect x$ and $-i\omega t$. The phase counts crests, and $k_\mu =
\partial_\mu(k_\nu x^\nu)$ is its gradient, so the wave four-vector comes most naturally with a lower index. Each
derivative brings down $ik_\mu$, so

$$\Box\phi = \field\eta^{\mu\nu}(ik_\mu)(ik_\nu)\,\phi = -(k\cdot k)\,\phi .$$

The plane wave solves $\Box\phi = 0$ exactly when $k\cdot k = -\omega^2/c^2 + |\vect k|^2 = 0$, that is, when
$\omega = c|\vect k|$: the wave four-vector of a wave that travels at $c$ is null. A gravitational wave of 1 kHz along
$x$ has $\omega/c = |\vect k| = 2\pi\times1000/(2.998\times10^8\unit{m\,s^{-1}}) = 2.10\times10^{-5}\unit{m^{-1}}$, one
cycle per 300 km, and $k\cdot k = 0$. Chapter 6.3 boosts this four-vector to find the Doppler shift and the tilt of
starlight.

## A tensor is a table whose every index changes with the boost

We want the rule for tables with several indices, because the paper's curvature and stress are such tables. A table
$T^{\mu\nu}$ with two upper indices is a **tensor of spacetime** when each index changes with its own copy of the boost:

$$\boxed{\;T'^{\mu\nu} = \Lambda^\mu{}_\alpha\,\Lambda^\nu{}_\beta\,T^{\alpha\beta}\;} \label{eq:tensor}$$

This is chapter [1.1](/tutorial/newton/vectors-and-indices/#turning-the-axes-changes-the-components-not-the-arrow)'s
rule $T'_{ij} = R_{ik}R_{jl}T_{kl}$, with the boost in place of the turn. A lower index takes the inverse table, as in
[](#eq:two-rules), and the metric raises or lowers one index at a time, as in $T^\mu{}_\nu = T^{\mu\alpha}\field
\eta_{\alpha\nu}$. The number of indices is the tensor's **rank**. A number that every observer agrees on has rank 0, a
four-vector rank 1, a table rank 2, and the Riemann tensor of the paper's [](/paper/#eq:tidal) rank 4 (chapter 7.2).

A sum over one upper and one lower index is a **contraction of indices**. It removes both indices, so it lowers the
rank by two, and a quantity with every index contracted is a number that every observer agrees on, a **Lorentz
invariant**. The dot products $a\cdot b$, $\obs u\cdot\obs u = -c^2$ and $k\cdot k$, and the operator $\Box$, are
invariants.

**A tensor equation holds in every frame.** If $A^{\mu\nu} = B^{\mu\nu}$ in one frame, both sides change by
[](#eq:tensor), so $A'^{\mu\nu} = B'^{\mu\nu}$ in every frame. The metric is an example: every inertial observer has the
same table $\field\eta_{\mu\nu}$, because every boost keeps it, by [](#eq:keeps-eta), and that is why it can serve as
everyone's dot product.

**Counting.** A symmetric table of four rows, $T^{\mu\nu} = T^{\nu\mu}$, has its 4 diagonal entries and the 6 entries
above the diagonal free, since those below repeat them: 10 numbers. The stress–energy tensor $\matter T^{\mu\nu}$ of
matter, which holds its energy, momentum and stress, is such a table (chapter 6.5). An antisymmetric table, $A^{\mu\nu} =
-A^{\nu\mu}$, has zeros on its diagonal and is fixed by the 6 entries above it. Light's electric and magnetic fields,
three numbers each, make such a table (chapter 6.6): the "six numbers" that [Section VIII](/paper/#sec:one-pixel)
counts for a sensor of light.

**A non-example.** A fluid at rest has an energy density $\matter\rho c^2$ and a pressure $p$ in every direction, both
in joules per cubic metre. (The letter $p$ alone is the pressure; the four-momentum of the next section always carries
its index, $p^\mu$.) Take dust, a cloud of grains at rest with no pressure, $p = 0$, seen by an observer passing at
$0.6c$. Its energy density grows by $\obs\gamma^2 = 1.5625$: once because each grain's energy grows by $\obs\gamma$, and
once because the grains crowd closer by $\obs\gamma$ along the motion. A four-vector with no part in space, such as
$(\matter\rho c^2, 0, 0, 0)$, would have its time component grow by a single $\obs\gamma$. So the list $(\matter\rho
c^2, p, p, p)$ is not a four-vector, and chapter 6.5 shows that its four numbers are the diagonal of a tensor of rank 2,
the stress–energy tensor.

## What an observer measures is a contraction with its own four-velocity

We want a rule for what an observer measures that any frame can compute, because the paper's pixel moves and its tide is
defined "for an observer at rest". We assume, from chapter 6.4, that **a particle of mass $\matter m$ has the
four-momentum $\sym{four-momentum}{p^\mu} = \matter m\,\obs u^\mu_{\rm particle}$, with $\obs u^\mu_{\rm particle}$ its
four-velocity, and that the energy an observer measures is $c$ times the time component $p^0$ in the observer's own
frame.** In a frame where the particle moves at $\obs v$, $cp^0 = \obs\gamma\matter mc^2$, which for a slow particle is
$\matter mc^2 + \tfrac12\matter m\obs v^2$: the energy of the mass at rest plus the energy of motion of chapter
[1.2](/tutorial/newton/field-and-potential/#the-work-done-by-gravity-depends-only-on-the-ends-of-the-path). In the
observer's own frame its four-velocity is $\obs u^\mu = (c, 0, 0, 0)$, so $-p_\mu\obs u^\mu = -p_0c = cp^0$, because
lowering flips the sign of the time component, $p_0 = -p^0$. The left side is a contraction, the same in every frame, so

$$\boxed{\;E = -p_\mu\,\obs u^\mu\;} \label{eq:measured}$$

in joules, since $p^\mu$ is in $\mathrm{kg\,m\,s^{-1}}$ and $\obs u^\mu$ in $\mathrm{m\,s^{-1}}$.[^sym]

**A number.** A particle moves through the room at $0.6c$, so $p^\mu = \matter m(1.25c, 0.75c, 0, 0)$. The room's
observer, with $\obs u^\mu = (c, 0, 0, 0)$, measures $E = 1.25\,\matter mc^2$. An observer moving with the particle has
$\obs u^\mu = (1.25c, 0.75c, 0, 0)$, and $p_\mu\obs u^\mu = \matter m(-1.5625 + 0.5625)c^2$, so it measures $E =
\matter mc^2$, the energy of the particle at rest. Both were computed in the room's frame, without changing frames.

**The paper's index 0 belongs to an observer.** The same idea reads the paper's [](/paper/#eq:tidal). Its index 0 is the
observer's own direction in time, and its $i$ and $j$ are directions in the observer's own space. For an observer at
rest, $\obs u^\mu = (c, 0, 0, 0)$, so

$$\curv{\tE}_{ij} = c^2R_{0i0j} = R_{\mu i\nu j}\,\obs u^\mu\obs u^\nu ,$$

the curvature contracted twice with the observer's four-velocity. We state here without proof that $R_{\alpha\beta
\gamma\delta}$ is a tensor of rank 4 (chapter 7.2), and that in curved spacetime a general metric $\field g_{\mu\nu}$
takes the place of $\field\eta_{\mu\nu}$ (chapter 7.1). The paper's magnetic part, its [](/paper/#eq:magnetic), carries
one index 0, so it too belongs to the observer. A moving observer has another four-velocity and other axes in space, so
it reads another $\curv{\tE}_{ij}$ and another $\curv{\tB}_{ij}$ from the same curvature. This is why [Section
VIII](/paper/#sec:one-pixel) says that "a moving pixel measures a different mixture of stretch and twist from a pixel at
rest at the same place". Chapter 6.6 works this out for light, and chapters 7.5 and 9.3 for gravity. A pixel's ten
numbers are five for $\curv{\tE}$ and five for $\curv{\tB}$, each, in empty space, a symmetric trace-free table of
chapter [1.5](/tutorial/newton/five-numbers/), and not the ten of a symmetric table of four rows.

::: try {#lorentz-diagram}
Chapter 6.1's Lorentz diagram, in its third view, *Vectors*. The room's axes and the light lines are drawn as before,
with the pixel's tilted axes in the observer's colour and the rapidity slider beneath. One arrow $a$ runs from the
origin, and its tip can be dragged anywhere; its colour says its kind, and a faint hyperbola through its tip marks
every point with the same $a\cdot a$. The table lists $a^\mu$ and $a_\mu$, as (time, $x$), for the room and for the
pixel, and $a\cdot a$ for each. The button *show observer* draws the pixel's four-velocity and its "now", with the dot
product $\obs u\cdot a$. It opens on chapter 6.1's two flashes, $a$ from A to B, with the pixel at $0.6c$.

Before you touch anything, answer the predictions at the top of the figure, then do what each asks. Afterwards, turn on
*show observer*, lay $a$ along the pixel's "now", and read $\obs u\cdot a$.
:::

::: check
### Q

Compute $a\cdot a$ for $a^\mu = (3, 4, 0, 0)$ and for $a^\mu = (5, 3, 4, 0)$, and say which kind each vector is.

### A

The first gives $-9 + 16 = 7$, so it is space-like. The second gives $-25 + 9 + 16 = 0$, so it is null.

### Q

Lower the index of $\obs u^\mu = (1.25c, 0.75c, 0, 0)$ and compute $\obs u_\mu\obs u^\mu$.

### A

Only the time component changes sign, so $\obs u_\mu = (-1.25c, 0.75c, 0, 0)$, and $\obs u_\mu\obs u^\mu = -1.5625c^2 +
0.5625c^2 = -c^2$.

### Q

Why do the paper's $\xi^i$ and chapter 1.4's $\xi_i$ name the same numbers?

### A

The separation is measured in the Cartesian axes of the observer's freely falling frame, where the spatial block of the
metric is $\field\eta_{ij} = \delta_{ij}$. Lowering a spatial index multiplies it by $+1$; only an index 0 would change
sign.

### Q

How many independent numbers does an antisymmetric table of four rows hold, and what in the paper has that many?

### A

Six, the entries above the diagonal. Light's electric and magnetic fields, three each, form such a table.
:::

**The idea to keep: spacetime vectors have four components and a dot product with one minus sign, on time. Lowering an
index flips only that sign, so in the Cartesian axes of an inertial frame a spatial index is the same up or down, and a
quantity with every index contracted is the same for every observer.**

::: problems
### Practice

Show that $\Box$ is the same operator for the pixel at $0.6c$ as for the room, by writing $\partial'_0$ and
$\partial'_1$ in terms of $\partial_0$ and $\partial_1$ for a boost along $x$.

::: solution
The rule back is $x^0 = \obs\gamma(x'^0 + \obs\beta x'^1)$ and $x^1 = \obs\gamma(x'^1 + \obs\beta x'^0)$, so the chain
rule gives $\partial'_0 = \obs\gamma(\partial_0 + \obs\beta\partial_1)$ and $\partial'_1 = \obs\gamma(\partial_1 +
\obs\beta\partial_0)$. Then

$$\begin{aligned}
-\partial'^2_0 + \partial'^2_1 &= \obs\gamma^2(\obs\beta^2 - 1)\,\partial_0^2\\
&\quad + \obs\gamma^2(1 - \obs\beta^2)\,\partial_1^2\\
&\quad + \obs\gamma^2(2\obs\beta - 2\obs\beta)\,\partial_0\partial_1\\
&= -\partial_0^2 + \partial_1^2 .
\end{aligned}$$

The cross terms cancel, and the squares keep their size because $\obs\gamma^2(1 - \obs\beta^2) = \cosh^2\obs\eta -
\sinh^2\obs\eta = 1$. The derivatives along $y$ and $z$ do not change, so $\Box' = \Box$. At $0.6c$ the coefficients are
$1.5625 \times (-0.64) = -1$ and $1.5625 \times 0.64 = 1$.
:::

### Stretch

Chapter [1.5](/tutorial/newton/five-numbers/#in-empty-space-the-trace-vanishes-and-five-numbers-are-left) used the trace
of a table, the sum of its diagonal, which turned axes do not change. Show that for a symmetric table $T^{\mu\nu}$ the
trace that every observer agrees on is $\field\eta_{\mu\nu}T^{\mu\nu} = -T^{00} + T^{11} + T^{22} + T^{33}$, evaluate it
for a fluid at rest with $\matter T^{\mu\nu} = \mathrm{diag}(\matter\rho c^2, p, p, p)$, and check it for dust seen from
$0.6c$.

::: solution
Both indices of $T^{\mu\nu}$ are contracted with $\field\eta_{\mu\nu}$, so the result is an invariant, and since the
metric is diagonal only the four diagonal entries enter, with the signs $-{+}{+}{+}$. For the fluid it is
$-\matter\rho c^2 + 3p$. For dust, $p = 0$, the trace at rest is $-\matter\rho c^2$. Seen from $0.6c$, [](#eq:tensor)
gives $\matter T'^{00} = 1.5625\,\matter\rho c^2$ and $\matter T'^{11} = 0.5625\,\matter\rho c^2$, so $-\matter T'^{00} + \matter T'^{11} = -\matter\rho
c^2$ again, while the plain sum of the diagonal changes from $\matter\rho c^2$ to $2.125\,\matter\rho c^2$. Chapter 6.5
uses this trace, which differs from chapter 1.5's trace of a table in space.
:::

### The paper

In [*A mass that passes*](/paper/#par:a-mass-that-passes) the paper names a stress tensor
$S_{\mu\nu} = (\partial_\mu\partial_\nu - \field\eta_{\mu\nu}\Box)\phi$ that its readings cannot see, and says that for a
body at rest it "adds $\nabla^2\phi$ to the density of energy". Show that its divergence $\partial^\mu S_{\mu\nu}$
vanishes for every $\phi$, and that its 00 component is $\nabla^2\phi$.

::: solution
Raising the first index gives $\partial^\mu S_{\mu\nu} = \partial^\mu\partial_\mu\partial_\nu\phi - \partial_\nu\Box\phi
= \Box\partial_\nu\phi - \partial_\nu\Box\phi = 0$, because $\partial^\mu\field\eta_{\mu\nu} = \partial_\nu$ and
derivatives taken in either order agree. The 00 component is $\partial_0\partial_0\phi - \field\eta_{00}\Box\phi =
c^{-2}\partial_t^2\phi + (-c^{-2}\partial_t^2\phi + \nabla^2\phi) = \nabla^2\phi$. Lowering both indices flips the sign
twice, so $S^{00} = S_{00}$, and the density of energy, the entry 00 with raised indices, gains $\nabla^2\phi$, as the
paper says. A divergence of zero means that the added energy and momentum are conserved, so nothing forbids them;
chapter 6.5 reads what this means for the paper's null space.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) and the paper's [](/paper/#eq:tidal): the coordinates $x^0 = ct$, the signature
  $-{+}{+}{+}$ and the observer's index 0 in $R_{0i0j}$, read in
  [the last section](#what-an-observer-measures-is-a-contraction-with-its-own-four-velocity); the raised $\xi^i$ of
  the paper's [](/paper/#eq:deviation), the same numbers as $\xi_i$, read in
  [the section on lowering](#lowering-an-index-changes-only-the-sign-of-time); and the index 0 of the paper's
  [](/paper/#eq:magnetic).
- [Section VIII](/paper/#sec:one-pixel), its plain words and
  [*Ten numbers: four invariants, an orientation, a velocity*](/paper/#par:ten-numbers-four-invariants-an-orientation-a-velocity):
  quantities "the same for every observer", and the six numbers of light, an antisymmetric table.
- [Section XIII](/paper/#sec:second-order), [*A mass that passes*](/paper/#par:a-mass-that-passes): the contraction
  $T_{\mu\nu}k^\mu k^\nu$ with a null $k^\mu$, and the stress $(\partial_\mu\partial_\nu - \eta_{\mu\nu}\Box)\phi$, the
  paper's one display of $\field\eta_{\mu\nu}$.
- Appendix C, [*The energy given by an impulsive wave*](/paper/#par:the-energy-given-by-an-impulsive-wave): the metric
  $\dd s^2 = -\dd u\,\dd v + \dots$, which is $\field\eta_{\mu\nu}$ written with $u = ct - z$ and $v = ct + z$ (chapter
  6.4).
:::

::: deeper
- The GR course, [section 3.3](https://neovand.github.io/general-relativity/chapter-3.html#3-3-the-interval-the-quantity-that-refuses-to-change),
  builds the interval into a geometry, and
  [section 3.6](https://neovand.github.io/general-relativity/chapter-3.html#3-6-four-velocity-and-four-momentum) the
  four-velocity and four-momentum.
- The GR course, [section 2.3](https://neovand.github.io/general-relativity/chapter-2.html#2-3-covectors-questions-you-can-ask-a-vector),
  on lower-index vectors as questions asked of a vector, with its
  [scene of an arrow crossing level planes](https://neovand.github.io/general-relativity/chapter-2.html#scene-covector),
  and [section 2.5](https://neovand.github.io/general-relativity/chapter-2.html#2-5-tensors-are-multilinear-relationships)
  on tensors.
- The GR course's exercises
  [A.1](https://neovand.github.io/general-relativity/appendix-a.html#a-1-a-vector-and-a-covector-change-their-clothes)
  and [A.2](https://neovand.github.io/general-relativity/appendix-a.html#a-2-an-inverse-metric-is-a-matrix-inverse)
  give practice with the two rules of change and the inverse metric, and its
  [index checklist](https://neovand.github.io/general-relativity/appendix-e.html#e-1-an-index-reading-checklist) reads
  any equation's indices step by step.
- C. W. Misner, K. S. Thorne and J. A. Wheeler, *Gravitation* (Freeman, 1973), chapter 2: the paper's signature and its
  conventions for indices, with the geometric picture of each object.
:::

[^eta]: The letter $\eta$ has four meanings in the tutorial. The Minkowski metric always carries its two indices,
    $\field\eta_{\mu\nu}$ or $\field\eta^{\mu\nu}$, and the colour of fields, because it is the flat form of the metric
    through which gravity acts (chapter 7.1). The rapidity $\obs\eta$ of chapter
    [6.1](/tutorial/relativity/lorentz/#rapidities-add-where-velocities-do-not) is the paper's letter, in the observer's
    colour. The viscosity of chapter [4.4](/tutorial/response/viscosity/) is $\matter\eta$, in the colour of matter, and
    the paper's vector $\vect\eta$ of Section XIII returns in chapter 13.2.

[^lambda]: The $4\times4$ table $\Lambda^\mu{}_\nu$ always carries its indices. The paper's $\Lambda = \exp(-i\eta\,\hat
    u\cdot\mathbf L)$ in [*One complex matrix*](/paper/#par:one-complex-matrix) is a $3\times3$ complex table that
    describes the same boost acting on the paper's complex tide; chapter 6.6 links the two. The projector
    $\Lambda_{ij,kl}$ of chapter [5.2](/tutorial/waves/retarded-waves/) is a third object, and a bare $\Lambda$ is chapter
    3.8's logarithm or the cosmological constant.

[^random]: For a boost at a random speed of $0.27c$ in a random direction, all sixteen entries of
    $\field\eta_{\alpha\beta}\Lambda^\alpha{}_\mu\Lambda^\beta{}_\nu - \field\eta_{\mu\nu}$ are below $3\times10^{-16}$,
    the rounding of the arithmetic, and the table agrees with 6.1's boost in any direction to the same accuracy.

[^signature]: Many books on particle physics use the opposite signature, $+{-}{-}{-}$. Then time-like vectors have
    $a\cdot a > 0$, and every dot product changes sign, though the physics is the same. The paper and the tutorial never
    use it, so a formula taken from such a book must have its signs changed before it is compared.

[^names]: The components with an upper index are called **contravariant** and those with a lower index **covariant**.
    The tutorial names them only here and speaks of upper and lower indices instead.

[^sym]: Units: a momentum in $\mathrm{kg\,m\,s^{-1}}$ times a speed in $\mathrm{m\,s^{-1}}$ is
    $\mathrm{kg\,m^2\,s^{-2}}$, a joule. Chapter 6.4 builds the four-momentum and its time component.
