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

The pixel of the paper's gravitational camera is a ring of twelve small balls that float freely in space. Beside a
mass, gravity pulls each ball a little differently, so each ball drifts in its own direction relative to the ring's
centre. The balls on the line to the mass drift outward, the balls at the two sides drift inward, and the balls in
between drift partly outward and partly sideways. Panel (a) of the figure below draws these drifts as arrows.

{{paper fig:tidal}}

The paper describes all twelve drifts, and the drift of any other ball one could add, with one short line, its
equation [](/paper/#eq:deviation):

{{paper eq:deviation}}

The small letters $i$ and $j$ are labels for directions, which this chapter explains. The paper writes them raised,
as in $\xi^i$. In space, with axes at right angles, a raised label and a lowered one mean the same thing (the
difference matters only in relativity, in chapter 6.2), so in Part 1 we write every label low.

How can one short equation describe the push on every ball of the ring in every direction at once? The answer is a
way of writing called index notation, with two small tables of numbers, the Kronecker delta and the Levi-Civita
symbol. Every equation of the paper is written in it. By the end we will also know how fast the ground on the
equator moves as the Earth turns, a number that the paper's Section II uses.

::: plain
An arrow in space, such as the step from one ball of the ring to a neighbour, can be described by three numbers:
how far it reaches to the east, how far to the north and how far up. These numbers are its components. A table of
nine numbers, with three rows and three columns, turns one arrow into another. Give it the step between two balls,
and it gives back the push between them.

Index notation writes such statements with small letters, such as $i$ and $j$, that stand for the three directions.
A letter that appears twice in a product means "add up the three terms, one for each direction". A letter that
appears once means "this holds for each of the three directions". So one short line stands for three equations, each
a sum of three terms. When the axes are turned, every component changes, but the two sides of such an equation
change in the same way, so the equation still holds.
:::

## A vector is an arrow, and its components are its shadows on three axes

A **vector** is a quantity that has a size and a direction, and it can be drawn as an arrow. The step from one ball
of the ring to another is a vector, and so is the pull of gravity on a ball. A quantity that is a single number,
with no direction, is a **scalar**: a mass, a temperature or the length of an arrow. We write vectors in bold, such as $\vect a$, and the length of $\vect a$ as $|\vect a|$.

To compute with arrows, we choose three axes at right angles to one another. In the paper's scenes they point east,
north and up. We number them 1, 2 and 3, and we write $\vect e_1$, $\vect e_2$ and $\vect e_3$ for arrows of length
one along them. An arrow of length one is called a **unit vector**. Any vector is a sum of these three,

$$\vect a = a_1\,\vect e_1 + a_2\,\vect e_2 + a_3\,\vect e_3 ,$$

and the three numbers $a_1$, $a_2$ and $a_3$ are its **components**. Each component is the shadow of the arrow on
one axis, cast by light that falls at right angles to that axis (Figure [](#fig:shadows)). The shadow on the east
axis has the length $a_1$, counted as negative when it points west. A component has the unit of the vector itself,
so the components of a step are in metres.

![A dotted line falls from the tip of the arrow $\vect a$ onto each axis at right angles, like light that falls at
right angles to that axis. The orange arrow from the origin to the point where it lands is the shadow of $\vect a$
on that axis, and its length is the component $a_1$, $a_2$ or $a_3$. This arrow points downward, so its shadow on
the up axis points down, and $a_3$ is negative.](tut-vec-shadows){#fig:shadows}

The dot product of two vectors is $\vect a\cdot\vect b = |\vect a|\,|\vect b|\cos\vartheta$, where $\vartheta$ (a
rounded form of the Greek letter theta) is the angle between them. The unit vectors along the axes have
$\vect e_1\cdot\vect e_1 = 1$ and $\vect e_1\cdot\vect e_2 = 0$, and so on, because each has length one and they are
at right angles. The dot product of $\vect a$ with $\vect e_1$ therefore keeps only the first term of the sum above,
so $a_1 = \vect a\cdot\vect e_1$, the shadow again. In components, the dot product is

$$\vect a\cdot\vect b = a_1b_1 + a_2b_2 + a_3b_3 .$$

### An index stands for all three directions

Index notation gives the three components one name with a label. We write $a_i$, where the **index** $i$ stands
for any one of the values 1, 2 and 3. An equation such as $a_i = b_i$ then means three equations at once:
$a_1 = b_1$, $a_2 = b_2$ and $a_3 = b_3$.

Sums over the three directions appear so often that physicists leave out the summation sign. The **summation
convention**, introduced by Einstein, says that an index which appears twice in one product is summed over its three
values. So the dot product is written

$$\vect a\cdot\vect b = a_ib_i = a_1b_1 + a_2b_2 + a_3b_3 .$$

The position of a point, measured from an origin, is a vector $\vect x$ with components $x_i$, in metres. In the
paper's scenes $x_1$, $x_2$ and $x_3$ are the distances east, north and up. Later chapters also write them $x$, $y$
and $z$, and use the same letters as labels, so that $\xi_x$ means $\xi_1$ and $\curv{\tE}_{xy}$ means
$\curv{\tE}_{12}$. The distance of the point from the origin is the length of $\vect x$,

$$r = \sqrt{x_ix_i} = \sqrt{x_1^2 + x_2^2 + x_3^2} .$$

Dividing a vector by its length gives a unit vector in the same direction. The unit vector along the position is

$$\sym{unit-vector}{\hat{\vect x}} = \frac{\vect x}{r}, \qquad \hat x_i = \frac{x_i}{r},$$

read "x hat". It points from the origin toward the point, and it has no unit, because a length is divided by a
length. Its length is one, because $\hat x_i\hat x_i = x_ix_i/r^2 = 1$. A ball 2 cm east and 1 cm north of the
origin, for example, is $r = 2.24\unit{cm}$ away, in the direction $\hat{\vect x} = (0.894, 0.447, 0)$.

The paper writes $\hat n$ for the unit vector that points from a pixel toward a source, and we keep the letter for
that.[^hats] If the pixel sits at the origin and the source at $\vect x$, then $\hat n = \hat{\vect x}$. If the
source sits at the origin and the pixel at $\vect x$, as in chapters 1.2 and 1.4, then $\hat n = -\hat{\vect x}$.

The dot products of the three unit vectors along the axes form a table of their own. We write it

$$\sym{kronecker-delta}{\delta_{ij}} = \vect e_i\cdot\vect e_j = \begin{cases} 1 & \text{if } i = j,\\ 0 & \text{if } i \ne j,\end{cases}$$

and call it the **Kronecker delta**. As a table it is the identity matrix. In the product $\delta_{ij}a_j$ the index $j$ appears twice, so it is summed. For $i = 1$ the sum is
$\delta_{11}a_1 + \delta_{12}a_2 + \delta_{13}a_3 = a_1$, because only the term with $j = 1$ survives. The same holds
for each $i$, so

$$\delta_{ij}\,a_j = a_i .$$

The Kronecker delta replaces one index by another.

### Not every list of three numbers is a vector

The components of an arrow depend on the axes we chose, and turning the axes mixes them. A step of 1 cm due east has
the components $(1, 0, 0)$ in centimetres. If we turn the axes so that the first one points north-east, the same step
has the components $(0.707, -0.707, 0)$, as Figure [](#fig:turned-axes) shows. The second number is negative
because the second new axis points north-west, partly against the step. The length of the step, 1 cm, has not
changed.

![One step of 1 cm due east is drawn once, seen from above, under two sets of axes: east and north (blue), and the
same axes turned by 45° (orange). On the blue axes the step lies along the east axis, so its components are 1 and 0.
On the orange axes the dotted lines fall from its tip at right angles, and the shadows they mark give the components
0.707 and −0.707, although the arrow has not changed.](tut-vec-turn){#fig:turned-axes}

A shop's record of the temperature of a room, the mass of a parcel and the price of a stamp is also a list of three
numbers, but it is not a vector. No turn of any axes can make a temperature partly a price. The components of a
vector change in one fixed way when the axes turn, and
[the section on turning the axes](#turning-the-axes-changes-the-components-not-the-arrow) finds that way.

## A table of nine numbers turns one arrow into another

A matrix $T$ with three rows and three columns, multiplied by a vector $\vect\xi$, gives a new vector. Here
$\vect\xi$ (the Greek letter xi) stands for the step from one ball to another, the **separation**, in metres. We
write $T_{ij}$ for the entry of $T$ in row $i$ and column $j$. The component $i$ of the product is row $i$ of the
matrix dotted with $\vect\xi$:

$$(T\vect\xi)_i = T_{i1}\,\xi_1 + T_{i2}\,\xi_2 + T_{i3}\,\xi_3 = T_{ij}\,\xi_j .$$

The index $j$ appears twice in the product, so it is summed.
It is a **dummy index**: its letter does not matter, and $T_{ij}\xi_j$ and $T_{ik}\xi_k$ are the same sum. The index
$i$ appears once. It is a **free index**, and an equation with a free index is a list of equations, one for each of
its values. So $b_i = T_{ij}\xi_j$ is three equations, each a sum of three products.

Three rules keep the notation honest. Each free index appears exactly once in every term, on both sides of the
equation. Each dummy index appears exactly twice in its term. No index appears three times in one term. So
$a_i = b_j$ is not an equation, because its two sides are lists over different labels, and $a_ib_ic_i$ is not a
product the notation allows, because the index $i$ appears three times.

The product of two matrices follows the same pattern. The entry in row $i$ and column $k$ of $AB$ is row $i$ of $A$
dotted with column $k$ of $B$,

$$(AB)_{ik} = A_{ij}\,B_{jk},$$

and the transpose of a matrix swaps its rows and columns, $(A^{\mathsf T})_{ij} = A_{ji}$.

### The paper's equation is three equations

We can now read the paper's line. Here $\sym{tidal-tensor}{\curv{\tE}}_{ij}$ (a curly capital E) is the **tidal
tensor**, a table of nine numbers that describes how the pull of gravity changes from one point to the next. It is
measured in reciprocal seconds squared, $\mathrm{s^{-2}}$, and chapter [1.4](/tutorial/newton/tides/) derives it.
(A tensor is a table that changes in one fixed way when the axes turn, which a later section finds.) Two dots over a
symbol mean the second derivative with respect to time, so $\ddot\xi_i$ is the relative acceleration of the two
balls. With every index written low, the paper's equation is

$$\ddot\xi_i = -\curv{\tE}_{ij}\,\xi_j . \label{eq:push}$$

The free index $i$ makes it three equations, one for each direction of the push. The dummy index $j$ adds, in each
of them, the contributions of the three components of the separation. For $i = 1$, the push toward the east, the
equation is

$$\ddot\xi_1 = -\bigl(\curv{\tE}_{11}\,\xi_1 + \curv{\tE}_{12}\,\xi_2 + \curv{\tE}_{13}\,\xi_3\bigr).$$

The units agree, because a tide in $\mathrm{s^{-2}}$ times a separation in metres is an acceleration in
$\mathrm{m\,s^{-2}}$. Every ball has its own separation $\vect\xi$ from the centre, and the same line gives its
push. This is how one short equation describes the push on every ball in every direction.

Here is the equation at work. A person of 70 kg standing at the distance $r = 1\unit{m}$ to the east of the ring
makes the tidal tensor[^person]

$$\curv{\tE} = \frac{G\matter M}{r^3}\begin{pmatrix} -2 & 0 & 0\\ 0 & 1 & 0\\ 0 & 0 & 1\end{pmatrix},$$

where $\sym{mass}{\matter{M}}$ is the person's mass and $G = 6.674\times10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is
Newton's constant. For the person, $G\matter M/r^3 = 4.67\times10^{-9}\unit{s^{-2}}$. Take the ball 1 cm from the
centre toward the north-east, at $\vect\xi = (0.707, 0.707, 0)\unit{cm}$. The table has no entries off its diagonal,
so each equation keeps one term. The first gives
$\ddot\xi_1 = -\curv{\tE}_{11}\,\xi_1 = 2 \times 4.67\times10^{-9} \times 0.00707\unit{m\,s^{-2}} = +6.6\times10^{-11}\unit{m\,s^{-2}}$,
toward the east. The others give $\ddot\xi_2 = -3.3\times10^{-11}\unit{m\,s^{-2}}$, toward the south, and
$\ddot\xi_3 = 0$. So this ball drifts outward along the line to the person and inward across it, as panel (a) of the
paper's Figure [](/paper/#fig:tidal) shows. Its acceleration, $7.4\times10^{-11}\unit{m\,s^{-2}}$ in all, is $7.5\times10^{-12}$ times the
$9.8\unit{m\,s^{-2}}$ of a falling apple.

The minus sign in the equation decides which entries pull balls apart. The entry $\curv{\tE}_{11}$ is negative, so
$-\curv{\tE}_{11}\,\xi_1$ has the same sign as $\xi_1$, and a ball east of the centre is pushed further east. A
negative entry on the diagonal therefore drives balls apart along its direction, a **stretch**. A positive entry,
such as $\curv{\tE}_{22}$ here, draws them together, a **squeeze**.

### The trace, and the symmetric and antisymmetric parts

The **trace** of a table is the sum of its diagonal entries. With the summation convention it is

$$T_{ii} = T_{11} + T_{22} + T_{33} .$$

The trace of the Kronecker delta is $\delta_{ii} = 1 + 1 + 1 = 3$. The trace of the person's tide is
$(-2 + 1 + 1)\,G\matter M/r^3 = 0$, and chapter 1.4 shows that the trace of the tidal tensor is always zero in empty
space.

A table is **symmetric** if $T_{ij} = T_{ji}$ for every $i$ and $j$, so that it equals its own transpose. It is
**antisymmetric** if $A_{ij} = -A_{ji}$. An antisymmetric table has zeros on its diagonal, because $A_{11} = -A_{11}$
can hold only if $A_{11} = 0$. Every table is the sum of a symmetric part and an antisymmetric part,

$$\begin{aligned}T_{ij} &= T_{(ij)} + T_{[ij]},\\ T_{(ij)} &= \tfrac12\bigl(T_{ij} + T_{ji}\bigr),\\ T_{[ij]} &= \tfrac12\bigl(T_{ij} - T_{ji}\bigr).\end{aligned}$$

Round brackets around indices mean the symmetric part and square brackets the antisymmetric part, as in the paper.
For example, a table with $T_{12} = 4$ and $T_{21} = 2$ has $T_{(12)} = 3$ and $T_{[12]} = 1$. A symmetric table has
six independent entries: the three on the diagonal and the three above it. An antisymmetric table has three, the
entries above the diagonal. The tidal tensor is symmetric, because the order of two partial derivatives does not
matter (chapter 1.4).

### A table built from two arrows

Two vectors $\vect a$ and $\vect b$ make a table whose entry in row $i$ and column $j$ is the product $a_ib_j$. It
is called their **outer product**. Applied to a third vector $\vect c$, it gives $a_i\,b_j\,c_j = a_i\,(\vect
b\cdot\vect c)$, the vector $\vect a$ multiplied by the number $\vect b\cdot\vect c$. The most useful outer product
is that of a unit vector with itself. The table $\hat n_i\hat n_j$ turns any vector $\vect\xi$ into
$\hat n_i(\hat n_j\xi_j)$: the shadow of $\vect\xi$ on the line along $\hat n$, laid along that line. It keeps the
part of $\vect\xi$ along $\hat n$ and drops the rest.

Taking that part away leaves the part of $\vect\xi$ across $\hat n$. The table that does this is

$$\boxed{\;\sym{projector}{P}_{ij} = \delta_{ij} - \hat n_i\hat n_j\;}, \qquad P_{ij}\,\xi_j = \xi_i - \hat n_i\,(\hat n\cdot\vect\xi).$$

It flattens every arrow onto the plane at right angles to $\hat n$, as the shadow of a pencil falls flat onto a
table top when the light comes from straight above (Figure [](#fig:projector)). It sends $\hat n$ itself to zero, because
$P_{ij}\hat n_j = \hat n_i - \hat n_i = 0$, and it leaves every arrow already in that plane as it is. A table with
these two properties is called a **projector**. Its trace is $P_{ii} = 3 - 1 = 2$, the number of directions in the
plane. The paper uses $P_{ij}$ in its equation [](/paper/#eq:pixel-kernel), with $\hat n$ along the line from the
pixel toward a source of waves, to keep only the directions across that line.

![The unit vector $\hat n$ (blue) stands at right angles to a plane, and the arrow $\vect\xi$ leans out of the plane.
The projector removes the part of $\vect\xi$ along $\hat n$ (dashed) and leaves $P\vect\xi$ (orange), which lies in
the plane directly below $\vect\xi$, as a pencil's shadow lies under light from straight above.](tut-vec-projector){#fig:projector}

::: example
### The table of one mass

We want to know what the table $\delta_{ij} - 3\hat n_i\hat n_j$ does to arrows, because chapter 1.4 shows that the
tide of a single mass is $G\matter M/r^3$ times this table, with $\hat n$ pointing from the ring toward the mass. We
apply it to $\hat n$ itself, and use $\delta_{ij}\hat n_j = \hat n_i$ and $\hat n_j\hat n_j = 1$:

$$\bigl(\delta_{ij} - 3\hat n_i\hat n_j\bigr)\hat n_j = \hat n_i - 3\hat n_i\,(\hat n_j\hat n_j) = -2\,\hat n_i .$$

Next we apply it to a vector $\vect b$ at right angles to $\hat n$, so that $\hat n_jb_j = 0$:

$$\bigl(\delta_{ij} - 3\hat n_i\hat n_j\bigr)b_j = b_i - 3\hat n_i\,(\hat n_jb_j) = b_i .$$

So $\hat n$ is an eigenvector, a vector that the table only multiplies by a number, and its eigenvalue, that number,
is $-2$. Every vector at right angles to $\hat n$ is an eigenvector with eigenvalue $1$, and there are two independent
such directions, so the three eigenvalues are $-2$, $1$ and $1$. The trace checks this, because the trace of a table is the sum of its eigenvalues: here
$\delta_{ii} - 3\hat n_i\hat n_i = 3 - 3 = 0 = -2 + 1 + 1$. In the tide of one mass, the eigenvalue $-2$ is the
stretch along the line to the mass, and the two eigenvalues $1$ are the squeezes across it, each half as strong.
:::

Now put the person of 70 kg 1 m to the north-east of the ring, in the horizontal plane. The unit vector toward the
person is $\hat n = (1, 1, 0)/\sqrt2$. Its outer product with itself, $\hat n_i\hat n_j$, has $\tfrac12$ in each of the
four entries of the first two rows and columns and zeros elsewhere. In $\delta_{ij} - 3\hat n_i\hat n_j$ the first two
diagonal entries become $1 - \tfrac32 = -\tfrac12$, the two entries off the diagonal become $-\tfrac32$, and the
last diagonal entry stays $1$, so

$$\curv{\tE} = \frac{G\matter M}{r^3}\begin{pmatrix} -\tfrac12 & -\tfrac32 & 0\\ -\tfrac32 & -\tfrac12 & 0\\ 0 & 0 & 1\end{pmatrix}. \label{eq:north-east}$$

The paper's [Section II](/paper/#sec:pixel) describes each entry in words. The entry in the east row and the north
column says how strongly two balls one metre apart along north are pushed, relative to each other, toward the east.
Here it is $\curv{\tE}_{12} = -\tfrac32 \times 4.67\times10^{-9}\unit{s^{-2}} = -7.0\times10^{-9}\unit{s^{-2}}$. Two
balls one metre apart along north have $\xi_2 = 1\unit{m}$, and the term $-\curv{\tE}_{12}\,\xi_2$ of equation
[](#eq:push) pushes the northern ball toward the east, relative to the southern one, by
$7.0\times10^{-9}\unit{m\,s^{-2}}$.[^metre] The next section shows that this table, with its entries off the
diagonal, is the first table seen from turned axes.

## Turning the axes changes the components, not the arrow

We want to know how the components of a vector, and the entries of a table, change when the axes are turned,
because the answer shows why an equation in index notation holds in every orientation of the axes.

We assume that **the new axes are again three unit vectors at right angles to one another**. We call them
$\vect e'_1$, $\vect e'_2$ and $\vect e'_3$, and we describe them by their components in the old axes:

$$\sym{rotation}{R}_{ij} = \vect e'_i\cdot\vect e_j .$$

Row $i$ of the table $R$ is the new axis $i$, written in the old components, so $\vect e'_i = R_{ij}\,\vect e_j$.
The new components of a vector are its shadows on the new axes. We take the dot product of
$\vect a = a_j\vect e_j$ with $\vect e'_i$:

$$a'_i = \vect e'_i\cdot\vect a = \bigl(\vect e'_i\cdot\vect e_j\bigr)\,a_j = R_{ij}\,a_j .$$

The assumption about the new axes is a condition on $R$. We write the dot product of two new axes in the old
components, $\vect e'_i\cdot\vect e'_j = R_{ik}R_{jl}\,\vect e_k\cdot\vect e_l = R_{ik}R_{jl}\,\delta_{kl}$, and use
the Kronecker delta to replace $l$ by $k$. The new axes are unit vectors at right angles, so

$$R_{ik}\,R_{jk} = \delta_{ij}, \qquad\text{that is,}\qquad RR^{\mathsf T} = 1 .$$

So $R^{\mathsf T}$ is the inverse of $R$. A matrix commutes with its inverse, so also $R^{\mathsf T}R = 1$, or
$R_{ki}R_{kj} = \delta_{ij}$. A matrix whose transpose is its inverse is called an **orthogonal matrix**.

The dot product of two vectors does not change. We write the new components with the rule above, using different
dummy letters for the two sums, and then use $R^{\mathsf T}R = 1$:

$$\begin{aligned}a'_ib'_i &= \bigl(R_{ij}a_j\bigr)\bigl(R_{ik}b_k\bigr) = \bigl(R_{ij}R_{ik}\bigr)a_jb_k\\ &= \delta_{jk}\,a_jb_k = a_jb_j .\end{aligned}$$

Lengths and angles are made of dot products, so they do not change either. Turning the axes changes the shadows of
an arrow, but not the arrow.

Now suppose that a table turns one vector into another in the old axes, $b_k = T_{kl}\,a_l$. We want the table
$T'$ that does the same in the new axes, and for that we need the old components in terms of the new ones. In matrix
form the rule for vectors is $\vect a' = R\vect a$. We multiply it on the left by $R^{\mathsf T}$ and use
$R^{\mathsf T}R = 1$:

$$\vect a = R^{\mathsf T}\vect a', \qquad\text{that is,}\qquad a_l = R_{jl}\,a'_j .$$

The new components of $\vect b$ are then

$$b'_i = R_{ik}\,b_k = R_{ik}\,T_{kl}\,a_l = \bigl(R_{ik}\,R_{jl}\,T_{kl}\bigr)\,a'_j .$$

The bracket is the new table. The result of this section is

$$\boxed{\;\begin{aligned}a'_i &= R_{ij}\,a_j,\\ T'_{ij} &= R_{ik}\,R_{jl}\,T_{kl}, \quad\text{that is,}\quad T' = RTR^{\mathsf T}\end{aligned}\;} \label{eq:turn}$$

for any orthogonal $R$.[^paper-turn] When the axes do not turn at all, $R_{ij} = \delta_{ij}$, and both rules give
back what we started with. The trace does not change, because $R^{\mathsf T}R = 1$ again removes both $R$s:

$$T'_{ii} = R_{ik}\,R_{il}\,T_{kl} = \delta_{kl}\,T_{kl} = T_{kk} .$$

A number that stays the same when the axes turn, such as a dot product or a trace, is a scalar. Three numbers that
change by the first rule of [](#eq:turn) are a vector, which is the precise answer to the shop's list. A table whose
entries change by the second rule is a **tensor**: it turns arrows into arrows in the same way whichever axes
describe them.

Here is the rule at work on the person to the north-east. We turn the axes about the vertical by 45°, so that the
new first axis points north-east, toward the person, the second north-west, and the third up. The rows of $R$ are the
new axes:

$$R = \begin{pmatrix} \tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2} & 0\\ -\tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2} & 0\\ 0 & 0 & 1\end{pmatrix}.$$

We apply the second rule of equation [](#eq:turn) to the table of equation [](#eq:north-east), in units of
$G\matter M/r^3$. The new entry $\curv{\tE}'_{11} = R_{1k}R_{1l}\curv{\tE}_{kl}$ adds the four entries in the first
two rows and columns of the old table, each multiplied by $R_{1k}R_{1l} = \tfrac12$. The new entry
$\curv{\tE}'_{12} = R_{1k}R_{2l}\curv{\tE}_{kl}$ adds the same four entries, multiplied by $\tfrac12$ and by the
signs of the second row of $R$, which are $-$ for $l = 1$ and $+$ for $l = 2$:

$$\begin{aligned}
\curv{\tE}'_{11} &= \tfrac12\bigl(-\tfrac12 - \tfrac32 - \tfrac32 - \tfrac12\bigr) = -2,\\
\curv{\tE}'_{12} &= \tfrac12\bigl(+\tfrac12 - \tfrac32 + \tfrac32 - \tfrac12\bigr) = 0 .
\end{aligned}$$

The remaining entries work out in the same way, and the whole table is $\mathrm{diag}(-2, 1, 1)$ times
$G\matter M/r^3$, where $\mathrm{diag}$ means a table with these numbers on its diagonal and zeros elsewhere. This is
the table of the person to the east, now in axes that point at the person.

The meaning is the idea of this chapter. If $b_i = T_{ij}a_j$ holds in one set of axes, then $b'_i = T'_{ij}a'_j$
holds in every other set, because both sides change by the same rule. So the paper can write
$\ddot\xi_i = -\curv{\tE}_{ij}\xi_j$ without saying which way its axes point. The equation is true in all of them.

::: try {#ring-matrix}
The figure shows a ring of twelve free balls in the plane of the axes $x$ (east) and $y$ (north), under a symmetric
table whose entries you set with three sliders: $a = T_{xx}$, $b = T_{xy} = T_{yx}$ and $d = T_{yy}$. Each arrow is
the push $-T_{ij}\xi_j$ on one ball. The two lines through the centre are the table's principal axes, the directions
of its eigenvectors. The figure opens on $\mathrm{diag}(-2, 1)$, the person to the east in units of
$G\matter M/r^3$.

You are going to enter the north-east table of equation [](#eq:north-east), whose first two rows and columns are
$a = -0.5$, $b = -1.5$ and $d = -0.5$. Before you move anything, write down the two eigenvalues $\lambda_1$ and
$\lambda_2$ you expect the readout to show, and the angle of the first axis from the $x$ axis. Then set the sliders
and compare. Last, keep $b$ at $-1.5$ and move $a$ and $d$ in opposite directions, so that their sum stays at $-1$,
and watch which readouts change and which stay fixed.
:::

## The cross product is written with the Levi-Civita symbol

The **cross product** of two vectors $\vect a$ and $\vect b$ is a vector at right angles to both, of length
$|\vect a|\,|\vect b|\sin\vartheta$, pointing the way the thumb of the right hand points when its fingers curl from
$\vect a$ toward $\vect b$. In components it is

$$\vect a\times\vect b = \bigl(a_2b_3 - a_3b_2,\ \ a_3b_1 - a_1b_3,\ \ a_1b_2 - a_2b_1\bigr).$$

Each component has two terms. Read each term as three numbers in a row: the number of the component, then the index
of $\vect a$, then the index of $\vect b$. The term $a_2b_3$ of the first component reads $1, 2, 3$ and has a plus
sign, and the term $a_3b_2$ reads $1, 3, 2$ and has a minus sign. In the second component the term with a plus sign
reads $2, 3, 1$, and in the third it reads $3, 1, 2$. These three orders are the **cyclic orders**: each one comes from
the one before by moving the first number to the end. The other three orders, $1, 3, 2$ and $3, 2, 1$ and $2, 1, 3$,
carry a minus sign. Figure [](#fig:cyclic) reads both sets of orders round a circle.

![The numbers 1, 2 and 3 stand round a circle. Reading round the left circle the way its orange arrows go, starting
from each number in turn, gives the three cyclic orders, which carry a plus sign. Reading the other way, along the
blue arrows on the right, gives the other three orders, which carry a minus sign.](tut-vec-cyclic){#fig:cyclic}

The **Levi-Civita symbol** records this pattern. It is a table with three indices, and so with 27 entries:

$$\sym{levi-civita}{\epsilon_{ijk}} = \begin{cases} +1 & \text{for } (i, j, k) = (1, 2, 3),\ (2, 3, 1),\ (3, 1, 2),\\ -1 & \text{for } (i, j, k) = (1, 3, 2),\ (3, 2, 1),\ (2, 1, 3),\\ \ \ 0 & \text{if two indices are equal.}\end{cases}$$

The paper fixes the same sign, $\epsilon_{123} = +1$, beside its equation [](/paper/#eq:magnetic). Two facts follow
from the definition. Swapping any two indices changes the sign, $\epsilon_{jik} = -\epsilon_{ijk}$ and so on, so the
symbol is antisymmetric in each pair of its indices. Moving the indices round in a cycle changes nothing,
$\epsilon_{ijk} = \epsilon_{jki} = \epsilon_{kij}$. With the symbol, the cross product becomes

$$\boxed{\;(\vect a\times\vect b)_i = \epsilon_{ijk}\,a_j\,b_k\;}.$$

We check the first component. For $i = 1$ the sum over $j$ and $k$ has nine terms, but only two have three
different indices: $\epsilon_{123}\,a_2b_3 + \epsilon_{132}\,a_3b_2 = a_2b_3 - a_3b_2$, as in the formula above.

The limit of parallel vectors checks the definition. The cross product of a vector with itself is
$\epsilon_{ijk}\,a_ja_k$. We rename the two dummy indices, $j$ as $k$ and $k$ as $j$, which does not change the sum,
and then swap the last two indices of $\epsilon$, which changes its sign:

$$\epsilon_{ijk}\,a_ja_k = \epsilon_{ikj}\,a_ka_j = -\epsilon_{ijk}\,a_ja_k .$$

A number equal to its own negative is zero, so $\vect a\times\vect a = 0$, and the cross product of any two parallel
vectors vanishes. The argument used only that $a_ja_k$ does not change when $j$ and $k$ are swapped. So
$\epsilon_{ijk}S_{jk} = 0$ for every symmetric table $S$.

## Two Levi-Civita symbols make two Kronecker deltas

A product of two cross products, or a cross product inside another, contains two $\epsilon$ symbols that share an
index. One identity turns such a pair into Kronecker deltas, and it does most of the work with $\epsilon$ in the
paper:

$$\boxed{\;\epsilon_{kij}\,\epsilon_{klm} = \delta_{il}\,\delta_{jm} - \delta_{im}\,\delta_{jl}\;}. \label{eq:eps-delta}$$

The index $k$ is summed, and $i$, $j$, $l$ and $m$ are free, so this is 81 equations. We prove them by cases, with
$i$, $j$, $l$ and $m$ fixed numbers. The sum over $k$ has at most one nonzero term, because $\epsilon_{kij}$ needs
$k$ to be the value that is neither $i$ nor $j$, and $\epsilon_{klm}$ needs $k$ to be the value that is neither $l$
nor $m$. With $i \ne j$, that term is $+1$ when $l, m$ are $i, j$ in the same order, $-1$ when they are $j, i$, and
$0$ otherwise. The right side gives the same three answers, and both sides are zero when $i = j$. The box goes
through the cases one by one.[^code]

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

These cases cover every choice of the four indices, and the two sides agree in each.
:::

The identity follows a pattern that lets one rebuild it. In the first term, the second index of one symbol pairs
with the second index of the other ($i$ with $l$), and the third index pairs with the third ($j$ with $m$). The
second term pairs them the other way round, $i$ with $m$ and $j$ with $l$, and carries a minus sign.

Setting $l = i$ in [](#eq:eps-delta) and summing over $i$ as well gives a shorter rule. On the right,
$\delta_{ii} = 3$ and $\delta_{im}\delta_{ji} = \delta_{jm}$, so

$$\epsilon_{kij}\,\epsilon_{kim} = 3\,\delta_{jm} - \delta_{jm} = 2\,\delta_{jm} . \label{eq:eps-two}$$

When two $\epsilon$s share two indices in the same places, their product is twice a Kronecker delta.

### A cross product inside a cross product

We use the identity to find $\vect a\times(\vect b\times\vect c)$. A product of this form gives, for example, the
centrifugal acceleration in a turning room, which chapter 1.6 derives. In components, with a new pair of dummy
letters for the inner product,

$$\begin{aligned}\bigl[\vect a\times(\vect b\times\vect c)\bigr]_i &= \epsilon_{ijk}\,a_j\,(\vect b\times\vect c)_k\\ &= \epsilon_{ijk}\,\epsilon_{klm}\,a_j\,b_l\,c_m .\end{aligned}$$

The shared index $k$ is last in the first symbol. A cyclic move, $\epsilon_{ijk} = \epsilon_{kij}$, puts it first,
and then [](#eq:eps-delta) applies:

$$\begin{aligned}\epsilon_{kij}\,\epsilon_{klm}\,a_j\,b_l\,c_m &= \bigl(\delta_{il}\delta_{jm} - \delta_{im}\delta_{jl}\bigr)a_j\,b_l\,c_m\\ &= b_i\,(a_jc_j) - c_i\,(a_jb_j).\end{aligned}$$

Each Kronecker delta replaced one index by another. In vectors,

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

To go back from the table to its vector, we multiply by $\epsilon_{kij}$ and sum over $i$ and $j$. A cyclic move
turns $\epsilon_{kij}$ into $\epsilon_{ijk}$, so that the two symbols share their first two indices, and
[](#eq:eps-two) with its letters renamed gives $\epsilon_{ijk}\,\epsilon_{ijl} = 2\,\delta_{kl}$. So

$$\tfrac12\,\epsilon_{kij}\,A_{ij} = \tfrac12\,\epsilon_{ijk}\,\epsilon_{ijl}\,w_l = \tfrac12 \times 2\,\delta_{kl}\,w_l = w_k ,$$

and

$$\boxed{\;A_{ij} = \epsilon_{ijk}\,w_k \quad\Longleftrightarrow\quad w_k = \tfrac12\,\epsilon_{kij}\,A_{ij}\;}.$$

An antisymmetric table therefore points along a direction, and $\tfrac12\epsilon_{kij}$ reads off which. This is how
the paper can say, of the antisymmetric part of a tensor inside flowing matter, that it lies along the flow. The
third problem below finds which way along the flow it points.

## A small turn is a cross product, and the equator moves faster than sound

Turn an arrow $\vect a$ by a small angle $\theta$, in radians, about an axis along the unit vector $\hat u$. We
combine the two into one vector, $\vect\theta = \theta\,\hat u$, along the axis and as long as the angle. The tip of
the arrow moves on a circle round the axis. The radius of that circle is $|\vect a|\sin\vartheta$, where $\vartheta$
is again an angle between two vectors, here between $\vect a$ and the axis, so the tip moves a distance
$\theta\,|\vect a|\sin\vartheta$. It moves at right angles to both the axis and the arrow, the way the right-hand
rule gives. These are the length and the direction of $\vect\theta\times\vect a$, so, to first order in the small
angle,

$$\delta\vect a = \vect\theta\times\vect a, \qquad \delta a_i = \epsilon_{ijk}\,\theta_j\,a_k .$$

Here $\delta\vect a$ is the small change in the arrow.[^generators]

### The ground at the equator

The Earth turns once about its axis, relative to the stars, in 86,164 s. This is four minutes less than a day of
24 h, because a day is counted from noon to noon by the Sun, and the Earth moves along its orbit while it turns. Its
**angular velocity** $\sym{angular-velocity}{\vect\Omega}$ is a vector along the axis,
pointing north by the right-hand rule, with a length equal to the angle turned per second:

$$|\vect\Omega| = \frac{2\pi}{86{,}164\unit{s}} = 7.29\times10^{-5}\unit{s^{-1}} .$$

The unit is radians per second, and a radian has no unit. In a short time $\dd t$ the Earth turns by the small
angle $\vect\Omega\,\dd t$, so a point at the position $\vect x$, measured from the Earth's centre, moves by
$(\vect\Omega\,\dd t)\times\vect x$. Dividing by $\dd t$ gives its velocity,

$$\boxed{\;\vect v = \vect\Omega\times\vect x\;}.$$

The units agree, because $\mathrm{s^{-1}}$ times metres is metres per second. On the equator $\vect x$ is at right
angles to the axis, so the sine of the angle between $\vect x$ and $\vect\Omega$ is 1, and the length of $\vect x$ is
the equatorial radius of the Earth, $R_\oplus = 6.378\times10^6\unit{m}$. So

$$\begin{aligned}|\vect\Omega\times\vect x| &= 7.29\times10^{-5}\unit{s^{-1}} \times 6.378\times10^6\unit{m}\\ &= 465\unit{m\,s^{-1}} .\end{aligned}$$

A pixel at rest on the equator therefore moves at 465 metres per second. Sound in air at 20 °C travels at
$343\unit{m\,s^{-1}}$, so the ground moves 1.36 times faster than sound. The paper's Section II uses this speed,
because the motion of the ground through the field of a spinning planet gives a pixel on the equator a small
magnetic part of the tide, a second kind of tide made by moving masses (chapter 7.5).

The limit of parallel vectors gives the poles. There $\vect x$ lies along the axis, so $\vect\Omega\times\vect x = 0$
and the ground does not move. Between the equator and a pole, the angle between $\vect x$ and the axis is
$90^\circ$ minus the latitude, whose sine is the cosine of the latitude. So the speed is $465\unit{m\,s^{-1}}$ times
the cosine of the latitude.

::: check
### Q

Which indices are free in $a_ib_iT_{jk}$, and how many numbers does the expression stand for?

### A

The index $i$ appears twice, so it is summed: $a_ib_i$ is the dot product, one number. The indices $j$ and $k$ each
appear once, so they are free. The expression is a table of nine numbers, $(\vect a\cdot\vect b)\,T_{jk}$.

### Q

What is $\epsilon_{ijk}\,\epsilon_{ijk}$, summed over all three indices?

### A

Six. By equation [](#eq:eps-two), with its letters renamed, $\epsilon_{ijk}\epsilon_{ijm} = 2\delta_{km}$, and
setting $m = k$ and summing gives $2\delta_{kk} = 6$. A direct count agrees: six of the 27 entries are $\pm1$, and
each squared is 1.

### Q

Why does a positive entry $\curv{\tE}_{22}$ draw two balls separated along the north toward each other?

### A

Their relative acceleration along the north is $\ddot\xi_2 = -\curv{\tE}_{22}\,\xi_2$. With $\curv{\tE}_{22} > 0$ the
minus sign makes it the opposite sign to $\xi_2$, so it points from the northern ball back toward the southern one,
and the separation shrinks. This is a squeeze.

### Q

How fast does the ground move at a latitude of 30°, the latitude of Cairo and of New Orleans?

### A

The speed is $|\vect\Omega|R_\oplus\cos(30^\circ) = 465\unit{m\,s^{-1}} \times 0.866 = 403\unit{m\,s^{-1}}$,
treating the Earth as a sphere. It is still faster than sound.

### Q

Two balls are 1 m apart along the north, and the person of 70 kg stands 1 m to the east, not to the north-east.
Does the person push the northern ball toward the east relative to the southern one?

### A

No. For the person to the east the table is diagonal, so $\curv{\tE}_{12} = 0$, and the push along the east is
$-\curv{\tE}_{12}\,\xi_2 = 0$. The two balls move only along the north, toward each other: the squeeze across the line
to the person.
:::

**The idea to keep: a repeated index is a sum, a free index is a list of equations, and an equation written this way
holds in every orientation of the axes.**

::: problems
### Practice

Show that the projector $P_{ij} = \delta_{ij} - \hat n_i\hat n_j$ satisfies $P_{ij}P_{jk} = P_{ik}$ and
$P_{ij}\hat n_j = 0$, and say in words what the first equation means.

::: solution
We multiply out, with $j$ summed, and use $\delta_{ij}\delta_{jk} = \delta_{ik}$, $\delta_{ij}\hat n_j = \hat n_i$ and
$\hat n_j\hat n_j = 1$:

$$\begin{aligned}P_{ij}P_{jk} &= \delta_{ik} - \hat n_i\hat n_k - \hat n_i\hat n_k + \hat n_i\,(\hat n_j\hat n_j)\,\hat n_k\\ &= \delta_{ik} - \hat n_i\hat n_k = P_{ik} .\end{aligned}$$

The second follows in one line: $P_{ij}\hat n_j = \hat n_i - \hat n_i(\hat n_j\hat n_j) = 0$. The first equation says
that flattening an arrow twice is the same as flattening it once: an arrow already in the plane stays where it is.
:::

### Stretch

Prove that $(\vect a\times\vect b)\cdot(\vect c\times\vect d) = (\vect a\cdot\vect c)(\vect b\cdot\vect d) -
(\vect a\cdot\vect d)(\vect b\cdot\vect c)$ with one use of the identity [](#eq:eps-delta). Then set
$\vect c = \vect a$ and $\vect d = \vect b$, and find the length of $\vect a\times\vect b$.

::: solution
In components, with the summed index $i$ first in both symbols,

$$\begin{aligned}&(\vect a\times\vect b)\cdot(\vect c\times\vect d)\\ &\quad= \epsilon_{ijk}\,\epsilon_{ilm}\,a_jb_kc_ld_m\\ &\quad= \bigl(\delta_{jl}\delta_{km} - \delta_{jm}\delta_{kl}\bigr)a_jb_kc_ld_m .\end{aligned}$$

The first pair of deltas sets $l = j$ and $m = k$, which gives $(a_jc_j)(b_kd_k)$. The second sets $m = j$ and
$l = k$, which gives $(a_jd_j)(b_kc_k)$. The difference is the result. With $\vect c = \vect a$ and $\vect d = \vect b$
it becomes $|\vect a\times\vect b|^2 = |\vect a|^2|\vect b|^2 - (\vect a\cdot\vect b)^2 =
|\vect a|^2|\vect b|^2(1 - \cos^2\vartheta)$. So $|\vect a\times\vect b| = |\vect a|\,|\vect b|\sin\vartheta$, the
length in the definition of the cross product.
:::

### The paper

The paper's [Section II](/paper/#sec:pixel) speaks of the magnetic part of the tide, $\curv{\tB}_{ij}$ (a curly
capital B). It is a second table of the same kind as $\curv{\tE}_{ij}$, made by moving masses and measured, like
$\curv{\tE}_{ij}$, in $\mathrm{s^{-2}}$; chapter 7.5 introduces it. Inside matter of density $\matter\rho$, in
kilograms per cubic metre, flowing with velocity $\vect v$, it has the antisymmetric part
$\curv{\tB}_{[ij]} = -(4\pi G/c)\,\epsilon_{ijk}\,\matter\rho\,v_k$, "which lies along the flow". Here $c$ is the
speed of light. Check that the right side is in $\mathrm{s^{-2}}$, find the vector of this antisymmetric table and
which way it points, and find its size for water flowing at $1\unit{m\,s^{-1}}$.

::: solution
The units: $G$ in $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times $\matter\rho$ in $\mathrm{kg\,m^{-3}}$ is $\mathrm{s^{-2}}$,
and $v/c$ has no unit. The table has the form $A_{ij} = \epsilon_{ijk}w_k$ with
$\vect w = -(4\pi G/c)\matter\rho\,\vect v$, so by the boxed rule its vector is
$\tfrac12\epsilon_{kij}\curv{\tB}_{[ij]} = w_k$. In detail,

$$\begin{aligned}\tfrac12\,\epsilon_{kij}\,\curv{\tB}_{[ij]} &= -\frac{4\pi G}{c}\,\matter\rho\;\tfrac12\,\epsilon_{kij}\,\epsilon_{ijl}\,v_l\\ &= -\frac{4\pi G}{c}\,\matter\rho\;\tfrac12 \times 2\,\delta_{kl}\,v_l\\ &= -\frac{4\pi G}{c}\,\matter\rho\,v_k .\end{aligned}$$

The vector is $-(4\pi G/c)\matter\rho\,\vect v$. It lies along the line of the flow but points against it, upstream.
The sign matters in the paper's [Section XI](/paper/#sec:vistas), where neutrinos stream outward from an exploding
star and this vector points back toward the star. For water, $\matter\rho = 1000\unit{kg\,m^{-3}}$, at
$1\unit{m\,s^{-1}}$ its size is
$4\pi \times 6.674\times10^{-11} \times 1000 \times 1/(3.00\times10^8)\unit{s^{-2}} = 2.8\times10^{-15}\unit{s^{-2}}$.
This is the trace of the tide inside water, $4\pi G\matter\rho = 8.4\times10^{-7}\unit{s^{-2}}$ (chapter 1.4),
multiplied by $v/c = 3.3\times10^{-9}$.
:::
:::

::: paper
- Equation [](/paper/#eq:deviation) is the equation of motion of free balls read in this chapter: three equations,
  one for each direction of the push, each a sum over the three directions of the separation.
- [Section II](/paper/#sec:pixel) describes the tide in plain words as a table of three rows and three columns, and
  uses the speed of the ground on the equator, 465 m s⁻¹, and the antisymmetric part $\curv{\tB}_{[ij]}$ of the
  third problem.
- Equation [](/paper/#eq:magnetic) defines the magnetic part of the tide with $\epsilon_{ipq}$ and fixes
  $\epsilon_{123} = +1$; chapter 7.5 reads it.
- Equation [](/paper/#eq:magnetic-point) contains $\hat n\times\vect v$, which is zero for motion along the line of
  sight by the limit of parallel vectors, so only sideways motion makes a magnetic tide.
- Equation [](/paper/#eq:pixel-kernel) builds the sky as one pixel sees it from the projector $P_{ij}$.
- [Section VIII](/paper/#sec:one-pixel) turns the curvature that one pixel reads with the rule of equation
  [](#eq:turn).
:::

::: deeper
- The [GR course, section 2.1](https://neovand.github.io/general-relativity/chapter-2.html#2-1-a-vector-is-not-its-spreadsheet)
  separates a vector from the list of its components, the point of the shop's list above, and
  [section 2.5](https://neovand.github.io/general-relativity/chapter-2.html#2-5-tensors-are-multilinear-relationships)
  defines tensors without reference to any axes.
- The GR course's [index-reading checklist](https://neovand.github.io/general-relativity/appendix-e.html#e-1-an-index-reading-checklist)
  is a list of questions to ask of any equation in index notation, useful when reading the paper.
- The [homology course, section 1.5](https://neovand.github.io/homology/foundations/linear-algebra/) treats linear
  maps in general, of which the tables of this chapter are the three-dimensional case.
- K. F. Riley, M. P. Hobson and S. J. Bence, *Mathematical Methods for Physics and Engineering* (Cambridge, third
  edition 2006), chapter 26 on tensors, works through Cartesian tensors, the $\epsilon$–$\delta$ identity and
  isotropic tensors with many exercises.
:::

::: history
### Arrows, indices and the dropped sign

Josiah Willard Gibbs, at Yale, and Oliver Heaviside, in England, each built vector analysis in the 1880s, with the
dot and cross products in the form used here. Gregorio Ricci-Curbastro and his student Tullio Levi-Civita set out
the calculus of tensors in components in 1900, in *Méthodes de calcul différentiel absolu et leurs applications*,
and the symbol $\epsilon_{ijk}$ carries Levi-Civita's name. Albert Einstein introduced the convention of dropping the
summation sign in his 1916 paper on the foundations of general relativity.
:::

[^hats]: In two places the paper uses $\hat n$ the other way round, for the direction from a source to the point
    where its field is measured: in Section V, at equation [](/paper/#eq:wave-zone), and in Section XI, at equation
    [](/paper/#eq:multipole). The chapters that read those equations say so.

[^person]: Chapter [1.4](/tutorial/newton/tides/) derives this table from Newton's law. Here we only read it; nothing
    in this chapter depends on where it comes from.

[^metre]: Balls a metre apart are only a way to state the entry, a push per metre of separation. Real balls must be
    much closer together than the distance to the person, for the reason given in chapter 1.4.

[^paper-turn]: Turning an arrow one way changes its components in the same way as turning the axes the other way.
    The paper's [Section VIII](/paper/#sec:one-pixel) describes a turned pixel by the rotation that carries the old
    axes onto the new ones, which turns arrows, and writes its reading as $R^{\mathsf T}\mathcal W R$, where $\mathcal W$ is
    the paper's table for the whole tide. That rotation is our $R^{\mathsf T}$, so the paper's rule is our
    $T' = RTR^{\mathsf T}$. For the person to the north-east both
    give $\mathrm{diag}(-2, 1, 1)$.

[^code]: A computer can check all 81 cases in a few lines: build the 27 entries of $\epsilon$, form both sides for
    every $i$, $j$, $l$ and $m$, and compare them.

[^generators]: Chapter 1.7 writes this rule as three fixed tables built from $\epsilon$. The paper's Section VIII
    uses them, with an imaginary angle, for the boost of a moving pixel.
