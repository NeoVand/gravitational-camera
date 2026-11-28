---
id: '1.2'
title: 'Force, field and potential; the gradient'
question: 'The floor, the walls, two steel safes and a bar of gold all pull on the camera at once. How do we add up the pull of everything in a room?'
part: '1'
requires: ['1.1']
paper: [sec:pixel, eq:newton, sec:near-field, eq:split, fig:locked-safe]
figures: [fig:locked-safe]
live: [potential-map]
depth: A
---

A camera stands in a room and faces two identical steel safes, 3.5 m in front of it. One safe holds a bar of gold of
324 kg, and the other is empty. In ordinary light the two safes look the same, so the camera must tell them apart by
gravity. It does so by subtracting the known room and the two empty safes, and what remains is the gold.[^safe]

To subtract the pull of the room, we must first compute it. The floor, the three walls, the steel of the safes and
the gold all pull on the camera at once, each from its own direction and with its own strength. How do we add up the
pull of everything in a room? The answer is a single number at each point of space, the potential, whose slope gives
the whole pull. Section 1.4 differentiates it once more, and that second derivative is what each pixel measures.

{{paper fig:locked-safe}}

Panel (a) of Figure [](/paper/#fig:locked-safe) shows the room in ordinary light; the other panels use the tide (section 1.4) and the blur (section 3.7),
and rest on the rule that the pulls of separate bodies add.

::: plain
Every mass pulls on every other mass, more strongly for larger masses and, by the square of the distance, less
strongly when they are farther apart. The pull on a small ball, divided by its mass, depends only on the place, and
is called the gravitational field: an arrow at each point. The arrows of many bodies add.

Adding arrows is laborious. Gravity offers a shortcut: a single number at each point, the potential, which is lower
near masses and rises toward zero far away. The field points where the potential falls fastest, and its strength is
how fast it falls. Potentials add as ordinary numbers, so we add one number per body and then find the slope of the
sum.
:::

## Gravity pulls with a force proportional to both masses

A **force** is a push or a pull. A force $\vect F$ on a body of mass $\matter m$ gives it the acceleration
$\vect F/\matter m$, so a force is measured in newtons, $1\unit{N} = 1\unit{kg\,m\,s^{-2}}$. A force has a direction
as well as a size, so it is a vector (section [1.1](/tutorial/newton/vectors-and-indices/)). A point has the position
$\vect x$, with the components $x_1$, $x_2$ and $x_3$ in metres from an origin, also called $x$, $y$ and $z$.

Newton's law of gravitation says how strongly two bodies pull on each other. We put a body of mass
$\sym{mass}{\matter{M}}$, in kilograms, at the origin, and a small body of mass $\sym{test-mass}{\matter{m}}$ at the
position $\vect x$, at the distance $r = |\vect x| = \sqrt{x_jx_j}$. Here the source sits at the origin, which makes the formulas for the field shorter, and the small body stands where
the pixel would be. The unit vector $\sym{unit-vector}{\hat n}$ from the pixel toward the source therefore points from
the small body back to the origin: $\hat n = -\vect x/r$, with the components $\hat n_i = -x_i/r$. The force on the small body is

$$\vect F = \frac{G\matter M\matter m}{r^2}\,\hat n = -\frac{G\matter M\matter m}{r^3}\,\vect x. \label{eq:newton-law}$$

Here $\sym{gravitational-constant}{G}$ is the **gravitational constant**, the same for every pair of bodies. Its
measured value is

$$G = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}.$$

The force points along $\hat n$, toward the large body, so gravity attracts. Its size is proportional to each mass and
falls as the inverse square of the distance, so equation [](#eq:newton-law) is called the **inverse-square law**. The units agree: $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times $\mathrm{kg^2}$ over $\mathrm{m^2}$ is a newton.

We state this law and do not derive it. Newton inferred it from the motion of the Moon and the planets, and every
measurement since has confirmed it under two conditions: **the bodies move slowly** compared with light, and **the field
is weak**, in a sense that section [7.1](/tutorial/geometry/metric/#free-fall-is-the-path-along-which-a-clock-ages-most)
makes exact. Both hold by a wide margin here. Section 1.3 shows where the square comes from.

The simplest scene is a person of 70 kg standing 1 m from a small free ball. The person pulls on the ball with the
force $G\matter M\matter m/r^2$, so the ball accelerates by

$$\frac{G\matter M}{r^2} = \frac{6.674 \times 10^{-11} \times 70}{1^2}\unit{m\,s^{-2}} = 4.7 \times 10^{-9}\unit{m\,s^{-2}}.$$

The ball's mass has cancelled. The Earth, with $G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$ and a radius of
6371 km, pulls it with $9.82\unit{m\,s^{-2}}$ at the ground,[^ground] two billion times more.
A person is a feeble source, and the camera must measure effects this small.

## The field is the pull per unit mass, and fields add

The mass of the ball dropped out. This holds for every body: the pull on it is proportional to its mass $\matter m$,
so the pull divided by $\matter m$ is the same for a grain of sand and a cannonball at the same place. This quotient
describes the place, and it is the **gravitational field**:

$$\sym{gravitational-field}{\vect g}(\vect x) = \frac{\vect F}{\matter m}.$$

The field is a vector at each point of space, and it is an acceleration, measured in $\mathrm{m\,s^{-2}}$. In
principle we measure it by releasing a small ball at the point and measuring its acceleration in a frame that is not
itself accelerating. A **frame** is a set of axes and clocks against which positions and times are measured, such as
the walls and the clock of a laboratory. In a frame that is not accelerating, a body that nothing pushes or pulls
keeps its speed and its direction.[^frame] The ball must be a **test mass**, small enough that its own pull does not
move the bodies it is measuring. For one body of mass $\matter M$ at the origin, equation [](#eq:newton-law) divided
by $\matter m$ gives

$$\vect g(\vect x) = -\frac{G\matter M}{r^3}\,\vect x. \label{eq:point-field}$$

The Earth's pull, $9.82\unit{m\,s^{-2}}$ down at the ground, is a field; a body's weight in newtons is not, because it
doubles with the body's mass.

Many bodies obey **superposition**, which experiment finds to hold: the pull of each on a test mass is the pull it
would exert alone, and the total is the vector sum. For the masses $\matter{m_1}, \matter{m_2}, \dots$ at the
positions $\vect x_1, \vect x_2, \dots$, the field is

$$\vect g(\vect x) = -\sum_a G\matter{m_a}\,\frac{\vect x - \vect x_a}{|\vect x - \vect x_a|^3}. \label{eq:field-sum}$$

The letter $a$ counts bodies and is not a direction in space, so its sum is written with a $\sum$ sign, and the
summation convention of section 1.1 does not apply to it. Each term is equation [](#eq:point-field) with the
origin moved to body $a$, and $\vect x - \vect x_a$ is the vector from that body to the point.

A solid body has mass spread through a volume. Its **density**
$\sym{density}{\matter\rho}(\vect x)$ is its mass per unit volume at each point, measured in kilograms per cubic metre.
We cut the body into small cubes. The cube at $\vect x'$ has the volume $\dd^3x' = \dd x'\,\dd y'\,\dd z'$ and the
mass $\matter\rho(\vect x')\,\dd^3x'$ and pulls as a point mass, so in the limit of small cubes the sum
[](#eq:field-sum) becomes an integral over the body:

$$\vect g(\vect x) = -G\int \matter\rho(\vect x')\,\frac{\vect x - \vect x'}{|\vect x - \vect x'|^3}\,\dd^3x'.$$

The prime marks the point $\vect x'$ where the mass is, apart from the point $\vect x$ where the field is wanted.

### The pulls of the room, part by part

This is how the room of the locked safe is added up. We put the origin on the floor below the camera, with $x_1$
pointing to the right, $x_2$ straight ahead and $x_3$ up. The camera is at $(0, 0, 1.5)\unit{m}$. The safes are hollow
steel boxes, 0.8 m wide, 0.8 m deep and 1.0 m tall, with their middles at $(\pm 1.1, 3.5, 0.5)\unit{m}$. The 3.5 m is
therefore measured straight ahead. The middle of each safe is
$\sqrt{1.1^2 + 3.5^2 + 1.0^2}\unit{m} = 3.8\unit{m}$ from the camera, which is the radius of the sphere in panel (e) of Figure [](/paper/#fig:locked-safe).
The gold is a bar 0.30 m wide, 0.40 m deep and 0.14 m tall on the floor of the right-hand safe, with its middle at
$(1.1, 3.5, 0.13)\unit{m}$. The floor and the walls are described in the margin.[^room] Figure [](#fig:room) draws
the whole room to scale.

![The room of the locked safe, to scale. Left, seen from above: the floor (tinted), the three walls, the two steel
safes and, in the right-hand one, the gold (orange). Right, the camera and safes seen from behind, three times as large;
a + marks the middle of each safe and of the gold, and the heights are measured to it. Each line from the camera to a
safe's middle is 3.8 m long.](tut-pot-room){#fig:room}

The table gives the size of each part's pull at the camera.[^cubes] The floor is the largest, being heavy and close.

| Part of the room | Mass | Size of its pull at the camera |
|---|---|---|
| Concrete floor | 121,000 kg | $2.3 \times 10^{-7}\unit{m\,s^{-2}}$ |
| Back wall | 22,700 kg | $1.7 \times 10^{-8}\unit{m\,s^{-2}}$ |
| Each side wall | 14,400 kg | $1.6 \times 10^{-8}\unit{m\,s^{-2}}$ |
| Steel of each safe | 1560 kg | $7.2 \times 10^{-9}\unit{m\,s^{-2}}$ |
| Gold | 324 kg | $1.4 \times 10^{-9}\unit{m\,s^{-2}}$ |
| The whole room | 176,000 kg | $2.5 \times 10^{-7}\unit{m\,s^{-2}}$ |

The gold's row can be checked by hand, treating the bar as a point mass at its middle. The vector from the camera to the gold is $(1.1,\ 3.5,\ 0.13 - 1.5)\unit{m} =
(1.1,\ 3.5,\ -1.37)\unit{m}$, of length $\sqrt{1.21 + 12.25 + 1.88}\unit{m} = 3.92\unit{m}$. The size of the pull is
$6.674 \times 10^{-11} \times 324/3.92^2 = 1.4 \times 10^{-9}\unit{m\,s^{-2}}$. Its sideways part, along $x_1$, is
$1.1/3.92$ of that, or $4.0 \times 10^{-10}\unit{m\,s^{-2}}$.

The sizes in the last column add up to $3.0 \times 10^{-7}\unit{m\,s^{-2}}$, not to the size of the total,
$2.5 \times 10^{-7}\unit{m\,s^{-2}}$, because the arrows point in different directions and parts of them cancel. The
two side walls pull the camera left and right by the same amount, and the two safes stand symmetrically, so their
sideways parts cancel exactly. The only sideways pull that survives is the gold's $4.0 \times 10^{-10}\unit{m\,s^{-2}}$
toward the right-hand safe. To add arrows, we must add their three components separately and keep track of every
direction. The next section replaces each arrow with a single number.

## A potential is one number per point whose downhill slope is the field

A map of a hill shows its height as one number at each point of the ground. From the heights alone we can find, at
every point, the direction in which the ground falls most steeply and how steep it is there: one number per point
carries an arrow per point. We want the same for gravity, one number at each point of space whose steepest downhill
slope is the field. We first need the mathematics of slopes in three dimensions.

### The gradient points uphill

Take a function $f(\vect x)$. Its **partial derivative**
$\partial_i f = \partial f/\partial x_i$ is the rate at which $f$ changes when we move along the axis $x_i$ alone and
hold the other two coordinates fixed. We also write $\partial_x$, $\partial_y$ and $\partial_z$ for $\partial_1$,
$\partial_2$ and $\partial_3$. The **gradient** of $f$ is the vector of its three partial derivatives,

$$\sym{nabla}{\nabla} f = \bigl(\partial_1 f,\ \partial_2 f,\ \partial_3 f\bigr), \qquad (\nabla f)_i = \partial_i f.$$

The symbol $\nabla$ is read "del" or "nabla". The gradient of $f$ is measured in the unit of $f$ per metre.

To find the rate of change of $f$ in any direction, let $\hat{\vect u}$ be a unit vector and move from $\vect x$ a
distance $s$ along it, to the point with coordinates $x_i + s\hat u_i$. By the chain rule, the derivative with respect
to $s$ is the sum, over the three coordinates, of the partial derivative times the rate at which that coordinate
changes, which is $\hat u_i$:

$$\frac{\dd}{\dd s}\,f(\vect x + s\hat{\vect u})\Big|_{s=0} = \hat u_i\,\partial_i f = \hat{\vect u}\cdot\nabla f. \label{eq:directional}$$

This is the **directional derivative** of $f$ along $\hat{\vect u}$. A dot product is $|\hat{\vect u}|\,|\nabla f|\cos\vartheta$, where $\vartheta$ is the angle between
the two vectors, and $|\hat{\vect u}| = 1$, so

$$\boxed{\;\hat{\vect u}\cdot\nabla f = |\nabla f|\cos\vartheta.\;}$$

The rate is largest when $\vartheta = 0$, so the gradient points where $f$ grows fastest, and $|\nabla f|$ is that
rate; $-\nabla f$ points steepest downhill; and moving at right angles to the gradient ($\vartheta = 90°$) does not
change $f$.

Take $f = x^2 + y^2$ in the plane of $x$ and $y$. Its gradient is
$\nabla f = (2x, 2y)$, which points straight away from the origin. At the point $(3, 4)$ the gradient is $(6, 8)$, of
length 10, so $f$ grows by 10 per unit of distance in that direction. The curves on which $f$ is constant are circles about the origin, and the gradient, along a radius, crosses each at a
right angle (Figure [](#fig:contours)).

![The circles on which $f = x^2 + y^2$ is constant, with the gradient $\nabla f = (2x, 2y)$ at points on them, each
arrow drawn at a tenth of its length, so the arrow at $(3, 4)$ is one unit long.](tut-pot-contours){#fig:contours}

### The potential of one mass

We look for a function $\sym{potential}{\field{\Phi}}(\vect x)$ whose negative gradient is the field of a point mass,
equation [](#eq:point-field). We assume **the mass is a point
at the origin**, and **it does not move**. We will show that

$$\field\Phi = -\frac{G\matter M}{r}$$

does the job. First we need $\partial_i r$; we write the case $i = 1$ in full. The distance obeys $r^2 = x_1^2 + x_2^2 + x_3^2$. We differentiate both sides with respect to $x_1$,
using the chain rule on the left:

$$2r\,\partial_1 r = 2x_1, \qquad\text{so}\qquad \partial_1 r = \frac{x_1}{r}.$$

The same steps hold for $x_2$ and $x_3$, so for every $i$

$$\partial_i r = \frac{x_i}{r}.$$

In words, the distance grows fastest along $\vect x/r$, away from the origin, at one metre per metre. Next, the derivative of $1/r$ with respect to $r$ is $-1/r^2$, and
by the chain rule we multiply it by $\partial_i r$:

$$\partial_i\,\frac{1}{r} = -\frac{1}{r^2}\,\partial_i r = -\frac{x_i}{r^3}.$$

Section 1.4 differentiates this result once more to find the tide. Now we multiply by $-G\matter M$:

$$\partial_i\field\Phi = -G\matter M\,\partial_i\frac{1}{r} = \frac{G\matter M\,x_i}{r^3}.$$

With a minus sign this is $-G\matter M x_i/r^3$, the field [](#eq:point-field) of the point mass:

$$\boxed{\;\vect g = -\nabla\field\Phi, \qquad \field\Phi = -\frac{G\matter M}{r}.\;} \label{eq:potential}$$

The function $\field\Phi$ is the **gravitational potential**. It is an energy per unit mass, measured in joules per
kilogram, which is the same as $\mathrm{m^2\,s^{-2}}$;
[the section on work](#the-work-done-by-gravity-depends-only-on-the-ends-of-the-path) shows why it is an energy. The units
agree: $G\matter M/r$ is $\mathrm{m^2\,s^{-2}}$, and the derivative divides by a metre, which gives the
$\mathrm{m\,s^{-2}}$ of a field.

The equation has two minus signs, which are easy to confuse. The table follows them for the person of 70 kg at the
origin and a point 1 m away on the $x$ axis.

| Quantity | Value 1 m from the person, on the $x$ axis | What the sign says |
|---|---|---|
| $\field\Phi$ | $-4.7 \times 10^{-9}\unit{J\,kg^{-1}}$ | lower than its value of zero far away |
| $\partial_x\field\Phi$ | $+4.7 \times 10^{-9}\unit{m\,s^{-2}}$ | the potential rises as we step away |
| $g_x = -\partial_x\field\Phi$ | $-4.7 \times 10^{-9}\unit{m\,s^{-2}}$ | the field points back toward the person |

A ball released there falls toward the person, as it must: the field points downhill, toward lower values of the
potential, and these lie nearer the mass. Figure [](#fig:well) shows both signs on the curve of the potential.

![The potential of the person of 70 kg along the $x$ axis: a well that rises toward zero on both sides. At 1 m its
tangent rises to the right, so $\partial_x\field\Phi$ is positive, while the field $g_x$ (arrow, not to scale) points
back toward the person.](tut-pot-well){#fig:well}

At a large distance, $\field\Phi$ rises toward zero as $1/r$ and the field falls as $1/r^2$, one power faster,
because a derivative divides by one more power of the distance. Far from every mass the potential is flat, and there
is no pull.

### Why the potential is negative, and what a constant changes

Adding a constant to $\field\Phi$ leaves the field unchanged, because the derivative of a constant is zero. Even
clocks, which respond to the potential, read only its differences between places.[^clocks] The usual choice is that $\field\Phi$ is zero infinitely far from every mass. The potential is lower near a mass than far away, so with this choice it is negative
everywhere.

### Equipotentials

A surface on which $\field\Phi$ has the same value everywhere is an **equipotential**. Moving along such a surface does
not change $\field\Phi$, so by equation [](#eq:directional) the field has no component along it: it crosses every
equipotential at right angles, pointing toward the lower one. For a point mass they are the spheres $r = \text{constant}$, and the field points inward along their radii. The surface of a calm sea is close to an equipotential of the Earth, once its turning is included, so a plumb line
hangs perpendicular to the sea.

### The potentials of many masses add as numbers

The gradient of a sum is the sum of the gradients, so the sum of the bodies' potentials has the sum of their fields as
its downhill slope. By equation [](#eq:field-sum), the potential of many point masses is

$$\field\Phi(\vect x) = -\sum_a \frac{G\matter{m_a}}{|\vect x - \vect x_a|}, \label{eq:potential-sum}$$

and the potential of a body with density $\matter\rho$, cut into small cubes as before, is

$$\boxed{\;\field\Phi(\vect x) = -G\int \frac{\matter\rho(\vect x')}{|\vect x - \vect x'|}\,\dd^3x'.\;} \label{eq:potential-integral}$$

Each term of [](#eq:potential-sum) is a single negative number. At the camera of the locked safe, the gold contributes
$-6.674 \times 10^{-11} \times 324/3.92 = -5.5 \times 10^{-9}\unit{J\,kg^{-1}}$. The floor contributes
$-1.6 \times 10^{-6}\unit{J\,kg^{-1}}$, the back wall $-1.7 \times 10^{-7}$, each side wall $-1.3 \times 10^{-7}$ and
the steel of each safe $-2.7 \times 10^{-8}$, all in joules per kilogram. The sum, $-2.1 \times 10^{-6}\unit{J\,kg^{-1}}$,
is the potential of the whole room at the camera, with no direction to track. To get the field of the room, we
compute this sum at points around the camera and take its gradient.

## The work done by gravity depends only on the ends of the path

The potential is an energy per unit mass, as we now show. When a force $\vect F$ acts
on a body that moves a small step $\dd\vect x$, it does the **work** $\vect F\cdot\dd\vect x$, the energy that the
force gives to the body, measured in joules, $1\unit{J} = 1\unit{N\,m}$. Over a path from a point $A$ to a point $B$,
the work is the sum of these small amounts. We describe the path as $\vect x(s)$, with $s$ running from $s_A$ at $A$ to $s_B$ at $B$. Each step is
$\dd\vect x = (\dd\vect x/\dd s)\,\dd s$, so the sum is an integral over $s$, a **path integral** written
$\int_A^B \vect F\cdot\dd\vect x$. For gravity on a test mass, $\vect F = \matter m\vect g = -\matter m\nabla\field\Phi$,
and

$$W = -\matter m\int_{s_A}^{s_B} \partial_i\field\Phi\,\frac{\dd x_i}{\dd s}\,\dd s .$$

By the chain rule, the integrand is the rate of change of the potential along the path,
$\partial_i\field\Phi\,\dd x_i/\dd s = \dd\field\Phi/\dd s$. The integral of a derivative is the difference of the function's values at the ends, so

$$\boxed{\;W = -\matter m\,\bigl[\field\Phi(B) - \field\Phi(A)\bigr].\;} \label{eq:work}$$

The path has dropped out: gravity does the same work on every path between the same two points, and none on a path
that returns to its start. Such a force is **conservative**. The quantity
$U = \matter m\field\Phi$ is the body's **potential energy**: the energy it has because of where it is, in joules.
When gravity does positive work, the potential energy falls by the same amount.

This gives the sign of $\field\Phi$ a second meaning. A body that falls in from very far away, where
$\field\Phi = 0$, is pulled along its path, so gravity does positive work on it, and by [](#eq:work) $\field\Phi$ at
the end of its fall is below zero.

The work goes into motion: by Newton's second law the work along a path equals the change of the **kinetic energy**
$\tfrac12\matter m v^2$.[^kinetic] So $\tfrac12\matter m v^2 + \matter m\field\Phi$ stays the same for a body that
only gravity acts on, the conservation of energy.

### Near the ground the potential grows by $gh$

Near the ground the potential gives the familiar $\matter m g h$. At a height $h$ above
the surface of the Earth, of radius $R$,

$$\field\Phi(R + h) = -\frac{G\matter M}{R + h} = -\frac{G\matter M}{R}\,\frac{1}{1 + h/R}.$$

The small parameter is $h/R$. For $u \ll 1$, $1/(1 + u) \approx 1 - u$, with an error of about $u^2$, so to first order in $h/R$

$$\field\Phi(R + h) \approx -\frac{G\matter M}{R} + \frac{G\matter M}{R^2}\,h = \field\Phi(R) + g h ,$$

where $g = G\matter M/R^2 = 9.82\unit{m\,s^{-2}}$ is the size of the field at the ground. By [](#eq:work), raising a
body of mass $\matter m$ by $h$ takes the energy $\matter m g h$: 9.82 J for a kilogram raised a metre. The first term left out is smaller than $gh$ by $h/R$, which is $1.6 \times 10^{-4}$ at 1 km.

## Close to a point the field changes linearly

The camera measures how the field changes from one point to a nearby one. We call the small step between them
$\vect\xi$ (the Greek letter xi), a vector measured in metres. To find the field at
$\vect x + \vect\xi$, we apply equation [](#eq:directional) to each component $g_i$ of the field, with
$\hat{\vect u} = \vect\xi/|\vect\xi|$ and the distance $s = |\vect\xi|$. To first order, the change of $g_i$ is the
distance times the directional derivative, $s\,\hat u_j\partial_j g_i = \xi_j\partial_j g_i$, so

$$g_i(\vect x + \vect\xi) \approx g_i(\vect x) + \xi_j\,\partial_j g_i(\vect x). \label{eq:linear}$$

This is the first-order Taylor expansion in three dimensions. The nine numbers $\partial_j g_i$ form a table that
turns the step $\vect\xi$ into the change of the field. Because $g_i = -\partial_i\field\Phi$, each entry is a second derivative of the potential,
$\partial_j g_i = -\partial_j\partial_i\field\Phi$. The table is a tensor (section [1.1](/tutorial/newton/vectors-and-indices/#turning-the-axes-changes-the-components-not-the-arrow)):
it turns arrows into arrows in the same way whichever axes describe them. The table of second derivatives of the
potential is the tidal tensor, written $\curv{\tE}_{ij}$:

$$\curv{\tE}_{ij} = \partial_i\partial_j\field\Phi, \qquad \partial_j g_i = -\curv{\tE}_{ij}.$$[^tide]

Section 1.4 computes the whole table for a point mass.

The approximation is good when the step is small compared with the distance $r$ to the mass. For a step along the line to the mass, the
first term that [](#eq:linear) leaves out is $3|\vect\xi|/2r$ times the change that it keeps.[^neglected] For two
points 1 cm apart beside the person a metre away, this ratio is 1.5 per cent; for points a metre apart the expansion
fails.

::: try {#potential-map}
Before you move anything, predict: between a heavy and a light mass, is the point of zero pull nearer the heavy one?
The figure opens with masses of 1000 kg and 250 kg, 2 m apart, seen from above, with equipotential lines and a probe
that shows the field as an arrow with readouts of $\field\Phi$ and $|\vect g|$. Drag the probe along the line between
the masses to the point of zero pull, and compare it with your prediction. Read the potential there too: is it zero?
Then move a mass, or change the lighter one with the slider, and watch the point move.
:::

**The idea to keep: one number at each point, the potential, holds the whole pull of gravity. The field is its
downhill slope, $\vect g = -\nabla\field\Phi$, and the potentials of many masses add as ordinary numbers.**

::: problems
### Practice

**[1.2]** In what units is the potential measured, and why is that the same as $\mathrm{m^2\,s^{-2}}$?

::: solution
In joules per kilogram, because it is a potential energy per unit mass. A joule is $\mathrm{kg\,m^2\,s^{-2}}$, so a
joule per kilogram is $\mathrm{m^2\,s^{-2}}$, the square of a speed.
:::

**[1.2]** The Moon's mass is 0.0123 times the Earth's, and the two centres are 384,400 km apart. If nothing else
pulls, where on the line between them do their pulls cancel? Is the potential zero there?

::: solution
Let $r$ be the distance from the Earth's centre, $d = 384{,}400\unit{km}$ and $\mu = 0.0123$. The pulls are equal when
$G\matter M_{\rm Earth}/r^2 = G\matter M_{\rm Moon}/(d - r)^2$, so $(d - r)/r = \sqrt\mu = 0.111$ and
$r = d/(1 + \sqrt\mu) = 346{,}000\unit{km}$. The point is 38,000 km from the Moon, nearer the lighter body, because
its pull matches the heavier one's only close to it. The potential there is
$-1.15 \times 10^{6} - 1.3 \times 10^{5} = -1.28 \times 10^{6}\unit{J\,kg^{-1}}$, not zero: it is flat there along
the line, like a mountain pass between two valleys, and only its slope is zero.
:::

**[1.2]** The left and right walls of the locked-safe room pull on the camera, and their sideways pulls cancel. Do
their potentials at the camera cancel too?

::: solution
No. Each wall contributes $-1.3 \times 10^{-7}\unit{J\,kg^{-1}}$, and the two add to twice that. Their summed
potential is the same at equal distances to the left and right of the camera, so its sideways slope there is zero.
Together the walls still pull the camera with $1.5 \times 10^{-8}\unit{m\,s^{-2}}$, up and toward the back wall.
:::

**[1.2]** The person of 70 kg stands at the origin. Find the field and the potential at the point $(3, 4, 0)\unit{m}$.

::: solution
The distance is $r = \sqrt{3^2 + 4^2} = 5\unit{m}$. By equation [](#eq:point-field), the field is
$-(G\matter M/r^3)(3, 4, 0)\unit{m} = (-1.12, -1.50, 0) \times 10^{-10}\unit{m\,s^{-2}}$. Its size is
$G\matter M/r^2 = 6.674 \times 10^{-11} \times 70/25 = 1.87 \times 10^{-10}\unit{m\,s^{-2}}$, and it points from the
point straight back toward the person. The potential is $-G\matter M/r = -9.3 \times 10^{-10}\unit{J\,kg^{-1}}$.
:::

### Stretch

**[1.2]** A thin ring of mass $\matter M$ and radius $R$ lies in the plane $z = 0$, centred on the origin. Find its potential at
the point $(0, 0, z)$ on its axis, and its field there. What happens far away, and at the centre? The ring has no
thickness, so in equation [](#eq:potential-integral) the integral of $\matter\rho\,\dd^3x'$ becomes a sum over small
pieces of the ring: each piece's mass, divided by its distance $|\vect x - \vect x'|$ from the point.

::: solution
Every piece of the ring is at the same distance $\sqrt{R^2 + z^2}$ from the point, because a point of the ring is
$(R\cos\varphi, R\sin\varphi, 0)$ and $|\vect x - \vect x'|^2 = R^2\cos^2\varphi + R^2\sin^2\varphi + z^2$. The
pieces' masses add up to $\matter M$, so

$$\field\Phi(z) = -\frac{G\matter M}{\sqrt{R^2 + z^2}}.$$

By symmetry the field on the axis points along it, and $g_z = -\dd\field\Phi/\dd z = -G\matter M z/(R^2 + z^2)^{3/2}$.
Far away, for $z \gg R$, the potential becomes $-G\matter M/z$ and the field $-G\matter M/z^2$: the ring looks like a
point. At the centre the field is zero, because every piece pulls outward and the pulls cancel, while the potential
is $-G\matter M/R$, its lowest value on the axis.
:::

### The camera

**[1.2]** Beside a person at distance $r$, the tide along the line to the person has the size $2G\matter M/r^3$, which is
$9 \times 10^{-9}\unit{s^{-2}}$ for 70 kg at 1 m. Show from equation [](#eq:point-field) that this is how fast the
size of the pull changes, per metre, as we move along that line, and compute it.

::: solution
Along the line, the field has the size $g(r) = G\matter M/r^2$ and points toward the person. Its rate of change with
distance is $\dd g/\dd r = -2G\matter M/r^3$, so the pull weakens by $2G\matter M/r^3$ for each metre we move away.

In the language of equation [](#eq:linear), this rate is the entry $\partial_x g_x$, for the person at the origin and
a point on the positive $x$ axis. There the field points in the $-x$ direction, so $g_x = -g(x)$, and
$\partial_x g_x = -\dd g/\dd r = +2G\matter M/r^3$. The sign is positive because $g_x$ is negative and rises toward
zero as $x$ grows. The same result follows from $g_x = -G\matter M\,x\,r^{-3}$ by the product rule, with
$\partial_x r = x/r$:

$$\partial_x g_x = -G\matter M\Bigl(\frac{1}{r^3} - \frac{3x}{r^4}\,\frac{x}{r}\Bigr) = -G\matter M\Bigl(\frac{1}{r^3} - \frac{3x^2}{r^5}\Bigr),$$

which is $2G\matter M/r^3$ at $x = r$. For 70 kg at 1 m, $2 \times 6.674 \times 10^{-11} \times 70 = 9.3 \times
10^{-9}\unit{s^{-2}}$. Two points 1 cm apart on that line feel pulls that differ by
$9.3 \times 10^{-11}\unit{m\,s^{-2}}$.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) gives the person's tide, $2G\matter M/r^3$, and equation [](/paper/#eq:newton) writes
  the tide as the second derivatives of the potential.
- [Section IV](/paper/#sec:near-field) adds to a body a density whose potential vanishes outside it, which uses
  that potentials add (section 2.5, equation [](/paper/#eq:split)); its figure [](/paper/#fig:locked-safe) subtracts
  the known room and safes by superposition.
:::

::: deeper
- The [GR course, section 0.2](https://neovand.github.io/general-relativity/chapter-0.html#0-2-partial-derivatives-change-one-input-at-a-time)
  reviews partial derivatives, and its
  [section 16.7](https://neovand.github.io/general-relativity/chapter-16.html#16-7-gps-calculate-the-competing-clock-effects)
  computes the potential's effect on GPS clocks.
- H. M. Schey, *Div, Grad, Curl, and All That* (Norton, 4th edition 2005), introduces the gradient through the electric
  field.
:::

::: history
### Newton, Cavendish and the constant $G$

Newton published the law of gravitation in the *Principia* (1687) and checked it against the Moon: at 60 Earth radii
the pull is 3600 times weaker than at the ground, as the orbit requires. He could not measure $G$, because the pull
between laboratory bodies is so weak. In 1798 Henry Cavendish measured the attraction between lead spheres with a
torsion balance, and from it the mean density of the Earth, which fixes $G$ within about one per cent. The potential
came later, in the work of Lagrange (1773) and Laplace (1782).
:::

[^ground]: The measured value is $9.78$ to $9.83\unit{m\,s^{-2}}$, depending on latitude; we use $G\matter M/R^2 = 9.82$
    for a round Earth that does not turn.

[^frame]: The field cannot be measured alone, because a freely falling laboratory falls with the ball (section 1.4);
    a detector reads only how the field differs between nearby points.

[^room]: The floor is concrete ($2400\unit{kg\,m^{-3}}$), 12 m wide, 14 m deep and 0.3 m thick, with its top at
    $x_3 = 0$. The three walls are plaster ($1200\unit{kg\,m^{-3}}$), 5 m tall and 0.3 m thick, with their inner faces
    at $x_2 = 8.0\unit{m}$ and $x_1 = \pm 6.0\unit{m}$. The safes' steel is 5 cm thick. The room has no ceiling and no
    front wall.

[^cubes]: Each box is cut into cubes 2 cm across (10 cm for the floor and walls) and summed as point masses by
    equations [](#eq:field-sum) and [](#eq:potential-sum). The Earth's own pull is left out: its tide is steady and
    known, and is subtracted as the room is.

[^clocks]: A clock higher up runs faster by the fraction $\Delta\field\Phi/c^2$ (section
    [7.1](/tutorial/geometry/metric/#clocks-higher-up-run-faster-clocks-read-the-potential)), $1.1 \times 10^{-16}$ for one
    metre at the ground; atomic clocks have measured it (C. W. Chou and colleagues, *Science* 329, 1630, 2010).

[^kinetic]: Dot the law with $\vect v$: the left side is $\dd(\tfrac12\matter m v^2)/\dd t$, and the right side,
    $\vect F\cdot\vect v$, is the work per unit time.

[^neglected]: The exact change in the pull for a step $s$ along the line is $G\matter M\,[1/(r + s)^2 - 1/r^2]
    = -(G\matter M/r^3)(2s - 3s^2/r + \dots)$; the second term is $3s/2r$ times the first.

[^safe]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, Fig. [](/paper/#fig:locked-safe).

[^tide]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. II, as its equation
    [](/paper/#eq:newton).
