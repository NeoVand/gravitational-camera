---
id: '1.1'
title: 'Vectors and index notation; the Levi-Civita symbol'
question: 'How can one short equation, $\ddot\xi^i = -\mathcal{E}_{ij}\,\xi^j$, describe the push on every ball of the ring in every direction at once?'
part: '1'
requires: []
paper: [sec:pixel, eq:deviation, eq:magnetic, eq:magnetic-point, eq:pixel-kernel, sec:one-pixel, fig:tidal]
figures: [fig:tidal]
live: [ring-matrix]
depth: A
---

The pixel of the gravitational camera is a ring of twelve small balls that float freely in space. Beside a mass,
gravity pulls each ball a little differently, so each ball drifts in its own direction relative to the ring's centre.
The balls on the line to the mass drift outward, those at the two sides inward, and those between partly outward
and partly sideways. Panel (a) of Figure [](/paper/#fig:tidal) draws the drifts as arrows.

{{paper fig:tidal}}

One short line gives all twelve drifts, and the drift of any other ball one could add:

$$\ddot\xi_i = -\curv{\tE}_{ij}\,\xi_j . \label{eq:push}$$

The small letters $i$ and $j$ label directions. In relativity labels are written raised or lowered, and the
difference matters (section 6.2); in space with axes at right angles it does not, so in Part I we write every label
low.[^dev]

How can one short equation describe the push on every ball in every direction at once? The answer is index notation,
with two small tables of numbers, the Kronecker delta and the Levi-Civita symbol. By the end we will also know how
fast the ground on the equator moves as the Earth turns, a speed that the Earth's gravitomagnetic tide needs
(section 7.5).

::: plain
An arrow in space is described by three numbers: how far it reaches east, north and up. A table of nine numbers, in
three rows and three columns, turns one arrow into another: give it the step between two balls, and it gives back the
push between them. Index notation uses small letters, such as $i$ and $j$, for the three directions. A letter that
appears twice in a product means "add up the three terms", and a letter that appears once means "this holds for each
of the three directions". When the axes are turned, both sides of such an equation change in the same way, so the
equation still holds.
:::

## A vector is an arrow, and its components are its shadows on three axes

A **vector** is a quantity that has a size and a direction, and it can be drawn as an arrow. The step between two balls is a vector, and so is the pull of gravity on a ball. A single number, with no direction, is a
**scalar**: a mass, a temperature or the length of an arrow. We write vectors in bold, such as
$\vect a$, and the length of $\vect a$ as $|\vect a|$.

To compute with arrows, we choose three axes at right angles, pointing east, north and up, numbered 1, 2 and 3. We write $\vect e_1$, $\vect e_2$ and $\vect e_3$ for arrows of length one along them, called
**unit vectors**. Any vector is a sum of these three,

$$\vect a = a_1\,\vect e_1 + a_2\,\vect e_2 + a_3\,\vect e_3 ,$$

and the three numbers $a_1$, $a_2$ and $a_3$ are its **components**. Each component is the shadow of the arrow on one axis, cast by light that falls at right angles to that axis
(Figure [](#fig:shadows)); a shadow that points west counts as negative. A component has the unit of the vector itself, so the
components of a step are in metres.

![(a) An arrow $\vect a$ is the diagonal of a box whose edges run along the axes. The orange arrow on each axis is the
shadow of $\vect a$ on it: the dotted line from the tip crosses a face of the box at right angles to the axis and meets
the axis where the shadow ends. Its length is the component $a_1$, $a_2$ or $a_3$. (b) A level arrow $\vect b$ that
points north and west: its shadow on the east axis points west, so $b_1$ is negative, and $b_3 = 0$.](tut-vec-shadows){#fig:shadows}

The dot product of two vectors is $\vect a\cdot\vect b = |\vect a|\,|\vect b|\cos\vartheta$, where $\vartheta$ (a
rounded form of the Greek letter theta) is the angle between them.  The unit vectors along the axes have
$\vect e_1\cdot\vect e_1 = 1$ and $\vect e_1\cdot\vect e_2 = 0$, and so on. The dot product of $\vect a$ with $\vect e_1$ therefore keeps only the first term of the sum above,
so $a_1 = \vect a\cdot\vect e_1$. In components, the dot product is

$$\vect a\cdot\vect b = a_1b_1 + a_2b_2 + a_3b_3 .$$

### An index stands for all three directions

We write $a_i$, where the **index** $i$ stands for any one of the values 1, 2 and 3. An equation such as
$a_i = b_i$ then means three equations at once: $a_1 = b_1$, $a_2 = b_2$ and $a_3 = b_3$.

Sums over the three directions appear so often that physicists leave out the summation sign. The **summation
convention**, introduced by Einstein, says that an index which appears twice in one product is summed over its three
values. So the dot product is written

$$\vect a\cdot\vect b = a_ib_i = a_1b_1 + a_2b_2 + a_3b_3 .$$

The position of a point, measured from an origin, is a vector $\vect x$ with components $x_i$, in metres. We also
write them $x$, $y$ and $z$, and use the same letters as labels: $\xi_x$ means $\xi_1$ and $\curv{\tE}_{xy}$ means
$\curv{\tE}_{12}$. The distance of the point from the origin is the length of $\vect x$,

$$r = \sqrt{x_ix_i} = \sqrt{x_1^2 + x_2^2 + x_3^2} .$$

Dividing a vector by its length gives a unit vector. The one along the position is

$$\sym{unit-vector}{\hat{\vect x}} = \frac{\vect x}{r}, \qquad \hat x_i = \frac{x_i}{r},$$

read "x hat". It points from the origin toward the point, and it has no unit, because a length is divided by a length.
Its length is one, because $\hat x_i\hat x_i = x_ix_i/r^2 = 1$. A ball 2 cm east and 1 cm north of the origin is $r = 2.24\unit{cm}$ away, in the direction
$\hat{\vect x} = (0.894, 0.447, 0)$.

We write $\hat n$ for the unit vector that points from a pixel toward a source. If the pixel sits at the origin and
the source at $\vect x$, then $\hat n = \hat{\vect x}$. If the source sits at the origin and the pixel at $\vect x$,
as in the tide of a single mass (section 1.4), then $\hat n = -\hat{\vect x}$.

The dot products of the three unit vectors along the axes form a table of their own. We write it

$$\sym{kronecker-delta}{\delta_{ij}} = \vect e_i\cdot\vect e_j = \begin{cases} 1 & \text{if } i = j,\\ 0 & \text{if } i \ne j,\end{cases}$$

and call it the **Kronecker delta**. As a table it is the identity matrix. In $\delta_{ij}a_j$, for $i = 1$ the sum is $\delta_{11}a_1 + \delta_{12}a_2 + \delta_{13}a_3 = a_1$, because only the term with
$j = 1$ survives. The same holds for each $i$, so

$$\delta_{ij}\,a_j = a_i .$$

The Kronecker delta replaces one index by another.

### Not every list of three numbers is a vector

The components of an arrow depend on the axes we chose, and turning the axes mixes them. A step of 1 cm due east has
the components $(1, 0, 0)$ in centimetres. If we turn the axes so that the first one points north-east, the same step
has the components $(0.707, -0.707, 0)$, as Figure [](#fig:turned-axes) shows. The second number is negative
because the second new axis points north-west, partly against the step. The step's length has not changed.

![One step of 1 cm due east, seen from above, under east and north axes (blue) and the same axes turned by 45°
(orange). The components are 1 and 0 on the blue axes, and 0.707 and −0.707 on the orange.](tut-vec-turn){#fig:turned-axes}

A shop's record of the temperature of a room, the mass of a parcel and the price of a stamp is also a list of three
numbers, but no turn of any axes can make a temperature partly a price. The components of a vector change in one
fixed way, found [below](#turning-the-axes-changes-the-components-not-the-arrow).

## A table of nine numbers turns one arrow into another

A matrix $T$ with three rows and three columns, multiplied by a vector $\vect\xi$, gives a new vector. Here $\vect\xi$
(the Greek letter xi) stands for the step from one ball to another, the **separation**, in metres. We write $T_{ij}$
for the entry of $T$ in row $i$ and column $j$. The component $i$ of the product is row $i$ of the matrix dotted with
$\vect\xi$:

$$(T\vect\xi)_i = T_{i1}\,\xi_1 + T_{i2}\,\xi_2 + T_{i3}\,\xi_3 = T_{ij}\,\xi_j .$$

The index $j$ is a **dummy index**: its letter does not matter, and $T_{ij}\xi_j$ and $T_{ik}\xi_k$ are the same sum.
The index $i$ is a **free index**, and an equation with a free index is a list of equations, one for each of its
values. So $b_i = T_{ij}\xi_j$ is three equations, each a sum of three products.

Three rules keep the notation honest. Each free index appears exactly once in every term, on both sides of the
equation. Each dummy index appears exactly twice in its term. No index appears three times in one term. So
$a_i = b_j$ is not an equation, because its two sides are lists over different labels, and $a_ib_ic_i$ is not
allowed.

In the product of two matrices, the entry in row $i$ and column $k$ of $AB$ is row $i$ of $A$ dotted with column $k$
of $B$,

$$(AB)_{ik} = A_{ij}\,B_{jk},$$

and the transpose of a matrix swaps its rows and columns, $(A^{\mathsf T})_{ij} = A_{ji}$.

### The push on a ball is three equations

We can now read equation [](#eq:push). Here $\sym{tidal-tensor}{\curv{\tE}}_{ij}$ (a curly capital E) is the **tidal
tensor**, a table of nine numbers that describes how the pull of gravity changes from one point to the next. It is
measured in reciprocal seconds squared, $\mathrm{s^{-2}}$, and section [1.4](/tutorial/newton/tides/) derives it. (A
tensor is a table that changes in one fixed way when the axes turn, as found below.) Two dots over a symbol mean the
second derivative with respect to time, so $\ddot\xi_i$ is the relative acceleration of the two balls.

The free index $i$ makes three equations, one for each direction of the push, and the dummy index $j$ adds in each
the contributions of the three components of the separation. For $i = 1$, the push toward the east,

$$\ddot\xi_1 = -\bigl(\curv{\tE}_{11}\,\xi_1 + \curv{\tE}_{12}\,\xi_2 + \curv{\tE}_{13}\,\xi_3\bigr).$$

The units agree, because a tide in $\mathrm{s^{-2}}$ times a separation in metres is an acceleration in
$\mathrm{m\,s^{-2}}$. Every ball has its own $\vect\xi$ from the centre, and the same line gives its push.

Here is the equation at work. A person of 70 kg standing at the distance $r = 1\unit{m}$ to the east of the ring
makes the tidal tensor[^person]

$$\curv{\tE} = \frac{G\matter M}{r^3}\begin{pmatrix} -2 & 0 & 0\\ 0 & 1 & 0\\ 0 & 0 & 1\end{pmatrix},$$

where $\sym{mass}{\matter{M}}$ is the person's mass and $G = 6.674\times10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is
Newton's constant. For the person, $G\matter M/r^3 = 4.67\times10^{-9}\unit{s^{-2}}$. Take the ball 1 cm from the
centre toward the north-east, at $\vect\xi = (0.707, 0.707, 0)\unit{cm}$. The table has no entries off its diagonal,
so each equation keeps one term. The first gives
$\ddot\xi_1 = -\curv{\tE}_{11}\,\xi_1 = 2 \times 4.67\times10^{-9} \times 0.00707\unit{m\,s^{-2}} = +6.6\times10^{-11}\unit{m\,s^{-2}}$,
toward the east. The others give $\ddot\xi_2 = -3.3\times10^{-11}\unit{m\,s^{-2}}$, toward the south, and
$\ddot\xi_3 = 0$. So this ball drifts outward along the line to the person and inward across it, as in panel (a) of Figure [](/paper/#fig:tidal).
Its acceleration, $7.4\times10^{-11}\unit{m\,s^{-2}}$ in all, is $7.5\times10^{-12}$ times the
$9.8\unit{m\,s^{-2}}$ of a falling apple.

The minus sign decides which entries pull balls apart. The entry $\curv{\tE}_{11}$ is negative, so
$-\curv{\tE}_{11}\,\xi_1$ has the sign of $\xi_1$, and a ball east of the centre is pushed further east. A negative
diagonal entry drives balls apart along its direction, a **stretch**; a positive one, such as $\curv{\tE}_{22}$ here,
draws them together, a **squeeze**.

### The trace, and the symmetric and antisymmetric parts

The **trace** of a table is the sum of its diagonal entries. With the summation convention it is

$$T_{ii} = T_{11} + T_{22} + T_{33} .$$

The trace of the Kronecker delta is $\delta_{ii} = 3$. The trace of the person's tide is
$(-2 + 1 + 1)\,G\matter M/r^3 = 0$, and section 1.4 shows that the trace of the tidal tensor is always zero in empty
space.

A table is **symmetric** if $T_{ij} = T_{ji}$, so that it equals its transpose. It is
**antisymmetric** if $A_{ij} = -A_{ji}$. An antisymmetric table has zeros on its diagonal, because $A_{11} = -A_{11}$
can hold only if $A_{11} = 0$. Every table is the sum of a symmetric part and an antisymmetric part,

$$\begin{aligned}T_{ij} &= T_{(ij)} + T_{[ij]},\\ T_{(ij)} &= \tfrac12\bigl(T_{ij} + T_{ji}\bigr),\\ T_{[ij]} &= \tfrac12\bigl(T_{ij} - T_{ji}\bigr).\end{aligned}$$

Round brackets around indices mean the symmetric part and square brackets the antisymmetric part: a table with
$T_{12} = 4$ and $T_{21} = 2$ has $T_{(12)} = 3$ and $T_{[12]} = 1$. A symmetric table has six independent
entries: the three on the diagonal and the three above it. An antisymmetric table has three, the entries above the
diagonal. The tidal tensor is symmetric, because the order of two partial derivatives does not matter (section 1.4).

### A table built from two arrows

Two vectors $\vect a$ and $\vect b$ make a table whose entry in row $i$ and column $j$ is $a_ib_j$, their **outer
product**. Applied to a third vector $\vect c$, it gives $a_i\,(\vect b\cdot\vect c)$. The most useful outer
product is that of a unit vector with itself: $\hat n_i\hat n_j$ turns any vector $\vect\xi$ into
$\hat n_i(\hat n_j\xi_j)$, the part of $\vect\xi$ along $\hat n$, and drops the rest.

Taking that part away leaves the part of $\vect\xi$ across $\hat n$. The table that does this is

$$\boxed{\;\sym{projector}{P}_{ij} = \delta_{ij} - \hat n_i\hat n_j\;}, \qquad P_{ij}\,\xi_j = \xi_i - \hat n_i\,(\hat n\cdot\vect\xi).$$

It flattens every arrow onto the plane at right angles to $\hat n$ (Figure [](#fig:projector)). It sends $\hat n$ itself to zero, because
$P_{ij}\hat n_j = \hat n_i - \hat n_i = 0$, and it leaves every arrow already in that plane as it is. A table with
these two properties is called a **projector**. Its trace is $P_{ii} = 3 - 1 = 2$, the number of directions in the
plane. With $\hat n$ along the line from a pixel toward a source of waves, the projector keeps only the directions
across that line, and it builds the sky as one pixel sees it (section [7.6](/tutorial/geometry/gravitational-waves/#one-projector-keeps-what-a-wave-can-carry)).[^kernel]

![The projector removes the part of $\vect\xi$ along $\hat n$ (dashed) and leaves $P\vect\xi$ (orange), which lies
in the plane at right angles to $\hat n$. The pale blue triangle stands upright on the plane.](tut-vec-projector){#fig:projector}

::: example
### The table of one mass

Section 1.4 shows that the tide of a single mass is $G\matter M/r^3$ times the table
$\delta_{ij} - 3\hat n_i\hat n_j$, with $\hat n$ pointing from the ring toward the mass. What does this table do to
arrows? We apply it to $\hat n$ itself, and use $\delta_{ij}\hat n_j = \hat n_i$ and $\hat n_j\hat n_j = 1$:

$$\bigl(\delta_{ij} - 3\hat n_i\hat n_j\bigr)\hat n_j = \hat n_i - 3\hat n_i\,(\hat n_j\hat n_j) = -2\,\hat n_i .$$

Next we apply it to a vector $\vect b$ at right angles to $\hat n$, so that $\hat n_jb_j = 0$:

$$\bigl(\delta_{ij} - 3\hat n_i\hat n_j\bigr)b_j = b_i - 3\hat n_i\,(\hat n_jb_j) = b_i .$$

So $\hat n$ is an eigenvector, a vector that the table only multiplies by a number, and its eigenvalue, that number,
is $-2$. Every vector at right angles to $\hat n$ is an eigenvector with eigenvalue $1$, and there are two independent
such directions, so the three eigenvalues are $-2$, $1$ and $1$. The trace checks this, because the trace of a table
is the sum of its eigenvalues: here $\delta_{ii} - 3\hat n_i\hat n_i = 3 - 3 = 0 = -2 + 1 + 1$. In the tide of one
mass, the eigenvalue $-2$ is the stretch along the line to the mass, and the two eigenvalues $1$ are the squeezes
across it, each half as strong.
:::

Now put the person of 70 kg 1 m to the north-east of the ring, in the horizontal plane. The unit vector toward the
person is $\hat n = (1, 1, 0)/\sqrt2$. Its outer product with itself, $\hat n_i\hat n_j$, has $\tfrac12$ in each of
the four entries of the first two rows and columns and zeros elsewhere. In $\delta_{ij} - 3\hat n_i\hat n_j$ the first
two diagonal entries become $1 - \tfrac32 = -\tfrac12$, the two entries off the diagonal become $-\tfrac32$, and the
last diagonal entry stays $1$, so

$$\curv{\tE} = \frac{G\matter M}{r^3}\begin{pmatrix} -\tfrac12 & -\tfrac32 & 0\\ -\tfrac32 & -\tfrac12 & 0\\ 0 & 0 & 1\end{pmatrix}. \label{eq:north-east}$$

The entry $\curv{\tE}_{12}$ is the push toward the east, per metre, of two balls apart along north. Here it is
$\curv{\tE}_{12} = -\tfrac32 \times 4.67\times10^{-9}\unit{s^{-2}} = -7.0\times10^{-9}\unit{s^{-2}}$. Two balls one
metre apart along north have $\xi_2 = 1\unit{m}$, and the term $-\curv{\tE}_{12}\,\xi_2$ of equation
[](#eq:push) pushes the northern ball toward the east, relative to the southern one, by
$7.0\times10^{-9}\unit{m\,s^{-2}}$.[^metre] The next section shows that this table is the first one seen from turned
axes.

## Turning the axes changes the components, not the arrow

How do the components of a vector, and the entries of a table, change when the axes are turned? The answer shows why
an equation in index notation holds in every orientation of the axes. We assume that **the new axes are again three unit vectors at right angles to one another**. We call them
$\vect e'_1$, $\vect e'_2$ and $\vect e'_3$, and we describe them by their components in the old axes:

$$\sym{rotation}{R}_{ij} = \vect e'_i\cdot\vect e_j .$$

Row $i$ of the table $R$ is the new axis $i$, written in the old components, so $\vect e'_i = R_{ij}\,\vect e_j$. The new components are the shadows on the new axes. We take the dot product of $\vect a = a_j\vect e_j$ with
$\vect e'_i$:

$$a'_i = \vect e'_i\cdot\vect a = \bigl(\vect e'_i\cdot\vect e_j\bigr)\,a_j = R_{ij}\,a_j .$$

The assumption is a condition on $R$. We write the dot product of two new axes in the old components,
$\vect e'_i\cdot\vect e'_j = R_{ik}R_{jl}\,\vect e_k\cdot\vect e_l = R_{ik}R_{jl}\,\delta_{kl}$, and use
the Kronecker delta to replace $l$ by $k$. The new axes are unit vectors at right angles, so

$$R_{ik}\,R_{jk} = \delta_{ij}, \qquad\text{that is,}\qquad RR^{\mathsf T} = 1 .$$

So $R^{\mathsf T}$ is the inverse of $R$, and also $R^{\mathsf T}R = 1$, or $R_{ki}R_{kj} = \delta_{ij}$. A matrix whose
transpose is its inverse is an **orthogonal matrix**.

The dot product does not change. With different dummy letters for the two sums, and $R^{\mathsf T}R = 1$:

$$\begin{aligned}a'_ib'_i &= \bigl(R_{ij}a_j\bigr)\bigl(R_{ik}b_k\bigr) = \bigl(R_{ij}R_{ik}\bigr)a_jb_k\\ &= \delta_{jk}\,a_jb_k = a_jb_j .\end{aligned}$$

Lengths and angles are made of dot products, so they do not change either: turning the axes changes the shadows of an
arrow, not the arrow.

Now suppose that a table turns one vector into another in the old axes, $b_k = T_{kl}\,a_l$. We want the table $T'$
that does the same in the new axes. The rule $\vect a' = R\vect a$, multiplied on the left by $R^{\mathsf T}$, gives
the old components in terms of the new:

$$\vect a = R^{\mathsf T}\vect a', \qquad\text{that is,}\qquad a_l = R_{jl}\,a'_j .$$

The new components of $\vect b$ are then

$$b'_i = R_{ik}\,b_k = R_{ik}\,T_{kl}\,a_l = \bigl(R_{ik}\,R_{jl}\,T_{kl}\bigr)\,a'_j .$$

The bracket is the new table. The result of this section is

$$\boxed{\;\begin{aligned}a'_i &= R_{ij}\,a_j,\\ T'_{ij} &= R_{ik}\,R_{jl}\,T_{kl}, \quad\text{that is,}\quad T' = RTR^{\mathsf T}\end{aligned}\;} \label{eq:turn}$$

for any orthogonal $R$.[^turn] When the axes do not turn at all, $R_{ij} = \delta_{ij}$, and both rules give back what we
started with. The trace does not change, because $R^{\mathsf T}R = 1$ again removes both $R$s:

$$T'_{ii} = R_{ik}\,R_{il}\,T_{kl} = \delta_{kl}\,T_{kl} = T_{kk} .$$

A number that stays the same when the axes turn, such as a dot product or a trace, is a scalar. Three numbers that
change by the first rule of [](#eq:turn) are a vector, the precise answer to the shop's list. A table whose entries
change by the second rule is a **tensor**.

Here is the rule at work on the person to the north-east. We turn the axes about the vertical by 45°, so that the new
first axis points north-east, toward the person, the second north-west, and the third up. The rows of $R$ are the new
axes:

$$R = \begin{pmatrix} \tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2} & 0\\ -\tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2} & 0\\ 0 & 0 & 1\end{pmatrix}.$$

We apply the second rule of equation [](#eq:turn) to equation [](#eq:north-east), in units of $G\matter M/r^3$. The
entry $\curv{\tE}'_{11} = R_{1k}R_{1l}\curv{\tE}_{kl}$ adds the four entries in the first two rows and columns, each
multiplied by $\tfrac12$. The entry $\curv{\tE}'_{12} = R_{1k}R_{2l}\curv{\tE}_{kl}$ adds the same four, multiplied by
$\tfrac12$ and by the signs of the second row of $R$, $-$ for $l = 1$ and $+$ for $l = 2$:

$$\begin{aligned}
\curv{\tE}'_{11} &= \tfrac12\bigl(-\tfrac12 - \tfrac32 - \tfrac32 - \tfrac12\bigr) = -2,\\
\curv{\tE}'_{12} &= \tfrac12\bigl(+\tfrac12 - \tfrac32 + \tfrac32 - \tfrac12\bigr) = 0 .
\end{aligned}$$

The remaining entries work out in the same way, and the whole table is $\mathrm{diag}(-2, 1, 1)$ times
$G\matter M/r^3$, where $\mathrm{diag}$ means these numbers on the diagonal and zeros elsewhere: the table of the
person to the east, now in axes that point at the person.

If $b_i = T_{ij}a_j$ holds in one set of axes, then $b'_i = T'_{ij}a'_j$
holds in every other set, because both sides change by the same rule. So we can write
$\ddot\xi_i = -\curv{\tE}_{ij}\xi_j$ without saying which way the axes point. The equation is true in all of them.

::: try {#ring-matrix}
The figure shows a ring of twelve free balls under a symmetric table whose entries you set with three sliders:
$a = T_{xx}$, $b = T_{xy} = T_{yx}$ and $d = T_{yy}$. Each arrow is the push $-T_{ij}\xi_j$ on one ball, and the two
lines through the centre are the table's principal axes. The figure opens on $\mathrm{diag}(-2, 1)$, the person to
the east.

Enter the north-east table of equation [](#eq:north-east): $a = -0.5$, $b = -1.5$, $d = -0.5$. Before you move
anything, write down the two eigenvalues and the angle of the first axis from the $x$ axis that you expect the readout
to show, then compare. Last, keep $b$ at $-1.5$ and move $a$ and $d$ in opposite directions, so that their sum stays
at $-1$, and watch which readouts change and which stay fixed.
:::

## The cross product is written with the Levi-Civita symbol

The **cross product** of two vectors $\vect a$ and $\vect b$ is a vector at right angles to both, of length
$|\vect a|\,|\vect b|\sin\vartheta$, pointing the way the thumb of the right hand points when its fingers curl from
$\vect a$ toward $\vect b$. In components it is

$$\vect a\times\vect b = \bigl(a_2b_3 - a_3b_2,\ \ a_3b_1 - a_1b_3,\ \ a_1b_2 - a_2b_1\bigr).$$

Read each term as three numbers: the number of the component, the index of $\vect a$, then that of $\vect b$. The
term $a_2b_3$ of the first component reads $1, 2, 3$ with a plus sign, and $a_3b_2$ reads $1, 3, 2$ with a minus
sign. The plus terms of the second and third components read $2, 3, 1$ and $3, 1, 2$. These are the **cyclic
orders**, each coming from the one before by moving the first number to the end (Figure [](#fig:cyclic)); the other
three orders carry a minus sign.

![Reading round the circle along the orange arrows gives the three cyclic orders, with a plus sign; reading along the
blue arrows gives the other three, with a minus sign.](tut-vec-cyclic){#fig:cyclic}

The **Levi-Civita symbol** records this pattern. It is a table with three indices, and so with 27 entries:

$$\sym{levi-civita}{\epsilon_{ijk}} = \begin{cases} +1 & \text{for } (i, j, k) = (1, 2, 3),\ (2, 3, 1),\ (3, 1, 2),\\ -1 & \text{for } (i, j, k) = (1, 3, 2),\ (3, 2, 1),\ (2, 1, 3),\\ \ \ 0 & \text{if two indices are equal.}\end{cases}$$

Two facts follow from the definition. Swapping any two indices changes the sign, $\epsilon_{jik} = -\epsilon_{ijk}$ and
so on, so the symbol is antisymmetric in each pair of its indices. Moving the indices round in a cycle changes
nothing, $\epsilon_{ijk} = \epsilon_{jki} = \epsilon_{kij}$. With the symbol, the cross product becomes

$$\boxed{\;(\vect a\times\vect b)_i = \epsilon_{ijk}\,a_j\,b_k\;}.$$

For $i = 1$ the sum over $j$ and $k$ has nine terms, but only two have three different indices: $\epsilon_{123}\,a_2b_3 + \epsilon_{132}\,a_3b_2 = a_2b_3 - a_3b_2$, as in the formula above.

The limit of parallel vectors checks the definition. The cross product of a vector with itself is
$\epsilon_{ijk}\,a_ja_k$. We rename the dummy indices, $j$ as $k$ and $k$ as $j$, and swap the last two indices of
$\epsilon$, which changes its sign:

$$\epsilon_{ijk}\,a_ja_k = \epsilon_{ikj}\,a_ka_j = -\epsilon_{ijk}\,a_ja_k .$$

A number equal to its own negative is zero, so $\vect a\times\vect a = 0$, and the cross product of any two parallel
vectors vanishes. The argument used only that $a_ja_k$ is unchanged when $j$ and $k$ are swapped, so
$\epsilon_{ijk}S_{jk} = 0$ for every symmetric table $S$.[^magnetic]

## Two Levi-Civita symbols make two Kronecker deltas

A product of two cross products, or a cross product inside another, contains two $\epsilon$ symbols that share an
index. One identity turns such a pair into Kronecker deltas, and it does most of the work with $\epsilon$ in the rest
of the book:

$$\boxed{\;\epsilon_{kij}\,\epsilon_{klm} = \delta_{il}\,\delta_{jm} - \delta_{im}\,\delta_{jl}\;}. \label{eq:eps-delta}$$

The index $k$ is summed, and $i$, $j$, $l$ and $m$ are free, so this is 81 equations. The sum over $k$ has at most one
nonzero term, because $\epsilon_{kij}$ needs $k$ to be the value that is neither $i$ nor $j$, and $\epsilon_{klm}$
needs it to be neither $l$ nor $m$. The box goes through the cases.

::: derivation
### The four cases of the identity

- **If $i = j$**, every term on the left has $\epsilon_{kii} = 0$. On the right, $\delta_{il}\delta_{im} -
  \delta_{im}\delta_{il} = 0$. Both sides are zero, and the case $l = m$ is the same.
- **If $i \ne j$ and $l \ne m$, but the pair $l, m$ is not the pair $i, j$ in some order**, then no single $k$ can
  be the value left over by both pairs, so the left side is zero. On the right, $\delta_{il}\delta_{jm}$ is nonzero
  only if $l = i$ and $m = j$, and $\delta_{im}\delta_{jl}$ only if $m = i$ and $l = j$. Neither is possible here, so
  the right side is zero too.
- **If $l = i$ and $m = j$, with $i \ne j$**, the one surviving term on the left is $\epsilon_{kij}^2 = 1$. On the
  right, $\delta_{il}\delta_{jm} = 1$ and $\delta_{im}\delta_{jl} = \delta_{ij}\delta_{ji} = 0$, so the right side
  is 1.
- **If $l = j$ and $m = i$, with $i \ne j$**, the surviving term on the left is $\epsilon_{kij}\,\epsilon_{kji} = -1$,
  because swapping the last two indices changes the sign. On the right, $\delta_{il}\delta_{jm} = \delta_{ij}\delta_{ji}
  = 0$ and $\delta_{im}\delta_{jl} = 1$, so the right side is $-1$.

These cases cover every choice of the four indices.
:::

To rebuild the identity from memory: in the first term the second index of one symbol pairs with the second of the
other ($i$ with $l$) and the third with the third ($j$ with $m$); the second term pairs them the other way round and
carries a minus sign.

Setting $l = i$ in [](#eq:eps-delta) and summing over $i$ as well gives a shorter rule. On the right, $\delta_{ii} = 3$
and $\delta_{im}\delta_{ji} = \delta_{jm}$, so

$$\epsilon_{kij}\,\epsilon_{kim} = 3\,\delta_{jm} - \delta_{jm} = 2\,\delta_{jm} . \label{eq:eps-two}$$

When two $\epsilon$s share two indices in the same places, their product is twice a Kronecker delta.

### A cross product inside a cross product

We use the identity to find $\vect a\times(\vect b\times\vect c)$. A product of this form gives, for example, the
centrifugal acceleration in a turning room (section 1.6). In components, with a new pair of dummy letters for the
inner product,

$$\begin{aligned}\bigl[\vect a\times(\vect b\times\vect c)\bigr]_i &= \epsilon_{ijk}\,a_j\,(\vect b\times\vect c)_k\\ &= \epsilon_{ijk}\,\epsilon_{klm}\,a_j\,b_l\,c_m .\end{aligned}$$

The shared index $k$ is last in the first symbol. A cyclic move, $\epsilon_{ijk} = \epsilon_{kij}$, puts it first, and
then [](#eq:eps-delta) applies:

$$\begin{aligned}\epsilon_{kij}\,\epsilon_{klm}\,a_j\,b_l\,c_m &= \bigl(\delta_{il}\delta_{jm} - \delta_{im}\delta_{jl}\bigr)a_j\,b_l\,c_m\\ &= b_i\,(a_jc_j) - c_i\,(a_jb_j).\end{aligned}$$

In vectors,

$$\boxed{\;\vect a\times(\vect b\times\vect c) = \vect b\,(\vect a\cdot\vect c) - \vect c\,(\vect a\cdot\vect b)\;}.$$

A special case checks it. With $\vect a = \vect b = \vect e_1$ and $\vect c = \vect e_2$, the left side is
$\vect e_1\times\vect e_3 = -\vect e_2$. On the right, $\vect e_1\cdot\vect e_2 = 0$ and $\vect e_1\cdot\vect e_1 = 1$,
so the right side is $0\,\vect e_1 - 1\,\vect e_2 = -\vect e_2$.

## An antisymmetric table is a vector in disguise

An antisymmetric table has three independent entries, the same number as a vector, and $\epsilon$ links the two.
Given a vector $\vect w$, the table

$$A_{ij} = \epsilon_{ijk}\,w_k = \begin{pmatrix} 0 & w_3 & -w_2\\ -w_3 & 0 & w_1\\ w_2 & -w_1 & 0\end{pmatrix}$$

is antisymmetric, because $\epsilon_{ijk}$ is. Applied to a vector $\vect b$, it gives
$A_{ij}b_j = \epsilon_{ijk}\,b_j\,w_k = (\vect b\times\vect w)_i$, so an antisymmetric table acts as a cross product.

To go back from the table to its vector, we multiply by $\epsilon_{kij}$ and sum over $i$ and $j$. A cyclic move turns
$\epsilon_{kij}$ into $\epsilon_{ijk}$, so that the two symbols share their first two indices, and [](#eq:eps-two)
with its letters renamed gives $\epsilon_{ijk}\,\epsilon_{ijl} = 2\,\delta_{kl}$. So

$$\tfrac12\,\epsilon_{kij}\,A_{ij} = \tfrac12\,\epsilon_{ijk}\,\epsilon_{ijl}\,w_l = \tfrac12 \times 2\,\delta_{kl}\,w_l = w_k ,$$

and

$$\boxed{\;A_{ij} = \epsilon_{ijk}\,w_k \quad\Longleftrightarrow\quad w_k = \tfrac12\,\epsilon_{kij}\,A_{ij}\;}.$$

An antisymmetric table therefore points along a direction, and $\tfrac12\epsilon_{kij}$ reads off which; the last
problem below finds it for the antisymmetric part of a tensor inside flowing matter.

## A small turn is a cross product, and the equator moves faster than sound

Turn an arrow $\vect a$ by a small angle $\theta$, in radians, about an axis along the unit vector $\hat u$. We
combine the two into one vector, $\vect\theta = \theta\,\hat u$, along the axis and as long as the angle. The tip of
the arrow moves on a circle round the axis. The radius of that circle is $|\vect a|\sin\vartheta$, where $\vartheta$ is
again an angle between two vectors, here between $\vect a$ and the axis, so the tip moves a distance
$\theta\,|\vect a|\sin\vartheta$. It moves at right angles to both the axis and the arrow, the way the right-hand rule
gives. These are the length and the direction of $\vect\theta\times\vect a$, so, to first order in the small angle,

$$\delta\vect a = \vect\theta\times\vect a, \qquad \delta a_i = \epsilon_{ijk}\,\theta_j\,a_k .$$

Here $\delta\vect a$ is the small change in the arrow.[^generators]

### The ground at the equator

The Earth turns once about its axis, relative to the stars, in 86,164 s, four minutes less than a day of 24 h,
because a day is counted from noon to noon and the Earth moves along its orbit while it turns. Its
**angular velocity** $\sym{angular-velocity}{\vect\Omega}$ is a vector along the axis, pointing north by the
right-hand rule, with a length equal to the angle turned per second:

$$|\vect\Omega| = \frac{2\pi}{86{,}164\unit{s}} = 7.29\times10^{-5}\unit{s^{-1}} .$$

A radian has no unit. In a short time $\dd t$ the Earth turns by the small angle
$\vect\Omega\,\dd t$, so a point at the position $\vect x$, measured from the Earth's centre, moves by
$(\vect\Omega\,\dd t)\times\vect x$. Dividing by $\dd t$ gives its velocity,

$$\boxed{\;\vect v = \vect\Omega\times\vect x\;}.$$

The units agree, because $\mathrm{s^{-1}}$ times metres is metres per second. On the equator $\vect x$ is at right
angles to the axis, so the sine of the angle between $\vect x$ and $\vect\Omega$ is 1, and the length of $\vect x$ is
the equatorial radius of the Earth, $R_\oplus = 6.378\times10^6\unit{m}$. So

$$\begin{aligned}|\vect\Omega\times\vect x| &= 7.29\times10^{-5}\unit{s^{-1}} \times 6.378\times10^6\unit{m}\\ &= 465\unit{m\,s^{-1}} .\end{aligned}$$

A pixel at rest on the equator therefore moves at 465 metres per second. Sound in air at 20 °C travels at
$343\unit{m\,s^{-1}}$, so the ground moves 1.36 times faster than sound. The motion of the ground through the field
of a spinning planet gives a pixel on the equator a small magnetic part of the tide, a second kind of tide made by
moving masses (section
[7.5](/tutorial/geometry/gravitomagnetism/#the-earths-magnetic-part-weighs-its-core)).[^equator]

The limit of parallel vectors gives the poles. There $\vect x$ lies along the axis, so $\vect\Omega\times\vect x = 0$
and the ground does not move. At latitude $\varphi$ the angle between $\vect x$ and the axis is $90^\circ - \varphi$,
whose sine is $\cos\varphi$, so the speed is $465\unit{m\,s^{-1}}\cos\varphi$.

**The idea to keep: a repeated index is a sum, a free index is a list of equations, and an equation written this way
holds in every orientation of the axes.**

::: problems
### Practice

**[1.1]** Which indices are free in $a_ib_iT_{jk}$, and how many numbers does the expression stand for?

::: solution
The index $i$ appears twice, so it is summed: $a_ib_i$ is the dot product, one number. The indices $j$ and $k$ each
appear once, so they are free. The expression is a table of nine numbers, $(\vect a\cdot\vect b)\,T_{jk}$.
:::

**[1.1]** What is $\epsilon_{ijk}\,\epsilon_{ijk}$, summed over all three indices?

::: solution
Six. By equation [](#eq:eps-two), with its letters renamed, $\epsilon_{ijk}\epsilon_{ijm} = 2\delta_{km}$, and setting
$m = k$ and summing gives $2\delta_{kk} = 6$. A direct count agrees: six of the 27 entries are $\pm1$, and each
squared is 1.
:::

**[1.1]** How fast does the ground move at a latitude of 30°, the latitude of Cairo and of New Orleans?

::: solution
The speed is $|\vect\Omega|R_\oplus\cos(30^\circ) = 465\unit{m\,s^{-1}} \times 0.866 = 403\unit{m\,s^{-1}}$, treating
the Earth as a sphere. It is still faster than sound.
:::

**[1.1]** Show that the projector $P_{ij} = \delta_{ij} - \hat n_i\hat n_j$ satisfies $P_{ij}P_{jk} = P_{ik}$ and
$P_{ij}\hat n_j = 0$, and say in words what the first equation means.

::: solution
We multiply out, with $\hat n_j\hat n_j = 1$:

$$\begin{aligned}P_{ij}P_{jk} &= \delta_{ik} - \hat n_i\hat n_k - \hat n_i\hat n_k + \hat n_i\,(\hat n_j\hat n_j)\,\hat n_k\\ &= \delta_{ik} - \hat n_i\hat n_k = P_{ik} .\end{aligned}$$

Also $P_{ij}\hat n_j = \hat n_i - \hat n_i(\hat n_j\hat n_j) = 0$. The first equation says that flattening an
arrow twice is the same as flattening it once.
:::

### Stretch

**[1.1]** Prove that $(\vect a\times\vect b)\cdot(\vect c\times\vect d) = (\vect a\cdot\vect c)(\vect b\cdot\vect d) -
(\vect a\cdot\vect d)(\vect b\cdot\vect c)$ with one use of the identity [](#eq:eps-delta). Then set
$\vect c = \vect a$ and $\vect d = \vect b$, and find the length of $\vect a\times\vect b$.

::: solution
In components, with the summed index $i$ first in both symbols,

$$\begin{aligned}&(\vect a\times\vect b)\cdot(\vect c\times\vect d)\\ &\quad= \epsilon_{ijk}\,\epsilon_{ilm}\,a_jb_kc_ld_m\\ &\quad= \bigl(\delta_{jl}\delta_{km} - \delta_{jm}\delta_{kl}\bigr)a_jb_kc_ld_m .\end{aligned}$$

The first pair of deltas gives $(a_jc_j)(b_kd_k)$ and the second $(a_jd_j)(b_kc_k)$. With $\vect c = \vect a$ and $\vect d = \vect b$
it becomes $|\vect a\times\vect b|^2 = |\vect a|^2|\vect b|^2 - (\vect a\cdot\vect b)^2 =
|\vect a|^2|\vect b|^2(1 - \cos^2\vartheta)$. So $|\vect a\times\vect b| = |\vect a|\,|\vect b|\sin\vartheta$, the
length in the definition of the cross product.
:::

### The camera

**[1.1]** Moving matter makes a second table beside the tide, the magnetic part of the tide, $\curv{\tB}_{ij}$ (a
curly capital B), measured, like $\curv{\tE}_{ij}$, in $\mathrm{s^{-2}}$ (section
[7.5](/tutorial/geometry/gravitomagnetism/#the-magnetic-part-is-the-curvature-with-one-time-index)). Inside matter of
density $\matter\rho$, in kilograms per cubic metre, flowing with velocity $\vect v$, it has the antisymmetric part
$\curv{\tB}_{[ij]} = -(4\pi G/c)\,\epsilon_{ijk}\,\matter\rho\,v_k$, where $c$ is the speed of light. Check that the
right side is in $\mathrm{s^{-2}}$, find the vector of this antisymmetric table and which way it points relative to
the flow, and find its size for water flowing at $1\unit{m\,s^{-1}}$.

::: solution
The units: $G\matter\rho$ is $\mathrm{s^{-2}}$, and $v/c$ has no unit. The table has the form $A_{ij} = \epsilon_{ijk}w_k$
with $\vect w = -(4\pi G/c)\matter\rho\,\vect v$, so by the boxed rule its vector is $w_k$. In detail,

$$\begin{aligned}\tfrac12\,\epsilon_{kij}\,\curv{\tB}_{[ij]} &= -\frac{4\pi G}{c}\,\matter\rho\;\tfrac12\,\epsilon_{kij}\,\epsilon_{ijl}\,v_l\\ &= -\frac{4\pi G}{c}\,\matter\rho\;\tfrac12 \times 2\,\delta_{kl}\,v_l\\ &= -\frac{4\pi G}{c}\,\matter\rho\,v_k .\end{aligned}$$

The vector lies along the flow but points against it, upstream. For water, $\matter\rho = 1000\unit{kg\,m^{-3}}$, at $1\unit{m\,s^{-1}}$ its size is
$4\pi \times 6.674\times10^{-11} \times 1000 \times 1/(3.00\times10^8)\unit{s^{-2}} = 2.8\times10^{-15}\unit{s^{-2}}$.
This is the trace of the tide inside water, $4\pi G\matter\rho = 8.4\times10^{-7}\unit{s^{-2}}$ (section 1.4), times
$v/c = 3.3\times10^{-9}$.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) describes the tide as a table, equation [](/paper/#eq:deviation), and uses the
  equator speed and $\curv{\tB}_{[ij]}$; [](/paper/#eq:magnetic) and [](/paper/#eq:magnetic-point) use $\epsilon_{ipq}$.
- The sky of one pixel, [](/paper/#eq:pixel-kernel), is built from the projector $P_{ij}$, and
  [Section VIII](/paper/#sec:one-pixel) turns a pixel's curvature with the rule of equation [](#eq:turn).
:::

::: deeper
- The [GR course, section 2.1](https://neovand.github.io/general-relativity/chapter-2.html#2-1-a-vector-is-not-its-spreadsheet)
  separates a vector from its components, and its
  [section 2.5](https://neovand.github.io/general-relativity/chapter-2.html#2-5-tensors-are-multilinear-relationships)
  defines tensors without axes.
- K. F. Riley, M. P. Hobson and S. J. Bence, *Mathematical Methods for Physics and Engineering* (Cambridge, third
  edition 2006), chapter 26, treats Cartesian tensors and the $\epsilon$–$\delta$ identity.
:::

::: history
### Arrows, indices and the dropped sign

Gibbs and Heaviside built vector analysis in the 1880s, with the dot and cross products used here. Ricci-Curbastro
and Levi-Civita set out the calculus of tensors in components in 1900, and the symbol $\epsilon_{ijk}$ carries
Levi-Civita's name. Einstein dropped the summation sign in his 1916 paper on general relativity.
:::

[^dev]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, as its equation
    [](/paper/#eq:deviation), where the labels are written raised, $\ddot\xi^i = -\mathcal E_{ij}\,\xi^j$.

[^person]: Section [1.4](/tutorial/newton/tides/) derives this table from Newton's law; here we only read it.

[^kernel]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as its equation
    [](/paper/#eq:pixel-kernel).

[^metre]: Balls a metre apart only state the entry, a push per metre; real balls must be much closer together than the
    person (section 1.4).

[^turn]: The rule appears in *The gravitational camera* (Mohsenvand 2026), Sec. VIII, as $R^{\mathsf T}\mathcal W R$,
    with the opposite convention for $R$.

[^magnetic]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, where the sign $\epsilon_{123} = +1$
    is fixed beside the equation [](/paper/#eq:magnetic) of the magnetic part of the tide.

[^generators]: Section 1.7 writes this rule as three tables built from $\epsilon$; with an imaginary angle they give
    the boost (section [6.1](/tutorial/relativity/lorentz/)).

[^equator]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II.
