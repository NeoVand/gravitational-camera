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

In one of the paper's scenes, a camera stands in a room and faces two identical steel safes, 3.5 m in front of it.
One safe holds a bar of gold of 324 kg, and the other is empty. In ordinary light the two safes look the same, so the
camera must tell them apart by gravity. The paper gives the method in one sentence: "The empty room and the two safes
are known and subtracted." What remains is the gold.

To subtract the pull of the room, we must first compute it. The floor, the three walls, the steel of the safes and
the gold all pull on the camera at once, each from its own direction and with its own strength. How do we add up the
pull of everything in a room? The answer is a single number at each point of space, the potential, whose slope gives
the whole pull. Chapter 1.4 differentiates it once more, and that second derivative is what each pixel of the paper's
camera measures.

{{paper fig:locked-safe}}

Look first at panel (a) of the figure, the room in ordinary light. The other panels use ideas from later chapters,
the tide of chapter 1.4 and the blur of chapter 3.7, and all of them rest on this chapter's rule that the pulls of
separate bodies add.

::: plain
Every mass pulls on every other mass. The pull grows with both masses and weakens with the square of the distance
between them, so twice as far away means four times weaker.

The pull on a small ball, divided by the ball's mass, does not depend on the ball. It depends only on the place where
the ball is, so it describes the place. It is called the gravitational field, and it is an arrow at each point.
When many bodies pull at once, their arrows add.

Adding arrows is laborious, because each arrow has a direction as well as a length. Gravity offers a shortcut. At
each point there is a single number, the potential, which is lower near masses and rises toward zero far from
them. The field points in the direction in which the potential falls fastest, and its strength is how fast it falls
there. The potentials of many bodies add as ordinary numbers do. So we add numbers, one per body, and then find the
slope of the sum.
:::

## Gravity pulls with a force proportional to both masses

A **force** is a push or a pull. A force $\vect F$ on a body of mass $\matter m$ gives it the acceleration
$\vect F/\matter m$, so a force is measured in newtons, $1\unit{N} = 1\unit{kg\,m\,s^{-2}}$. A force has a direction
as well as a size, so it is a vector, in the sense of chapter 1.1. As in chapter 1.1, a point has the position
$\vect x$, with the components $x_1$, $x_2$ and $x_3$ in metres from an origin. Where a formula reads more easily that
way, we also call these components $x$, $y$ and $z$.

Newton's law of gravitation says how strongly two bodies pull on each other. We put a body of mass
$\sym{mass}{\matter{M}}$, in kilograms, at the origin, and a small body of mass $\sym{test-mass}{\matter{m}}$ at the
position $\vect x$, at the distance $r = |\vect x| = \sqrt{x_jx_j}$. Chapter 1.1 wrote $\sym{unit-vector}{\hat n}$
for the unit vector from the pixel toward the source, as the paper does, and put the pixel at the origin, so there
$\hat n = \vect x/r$. Here the source sits at the origin, which makes the formulas for the field shorter, and the
small body stands where the pixel would be. So $\hat n$ points from the small body back to the origin:
$\hat n = -\vect x/r$, with the components $\hat n_i = -x_i/r$. The force on the small body is

$$\vect F = \frac{G\matter M\matter m}{r^2}\,\hat n = -\frac{G\matter M\matter m}{r^3}\,\vect x. \label{eq:newton-law}$$

Here $\sym{gravitational-constant}{G}$ is the **gravitational constant**, the same for every pair of bodies. Its
measured value is

$$G = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}.$$

The force points along $\hat n$, toward the large body, so gravity attracts. Its size, $G\matter M\matter m/r^2$, is
proportional to each mass and falls as the inverse square of the distance, so equation [](#eq:newton-law) is often
called the **inverse-square law**. The units agree: $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times $\mathrm{kg^2}$ divided by
$\mathrm{m^2}$ is $\mathrm{kg\,m\,s^{-2}}$, a newton.

We state this law and do not derive it. Newton inferred it from the motion of the Moon and the planets, and every
measurement since has confirmed it under two conditions: **the bodies move slowly** compared with light, and **the
field is weak**, in a sense that chapter 7.1 makes exact. Both hold by a wide margin in every scene of this part.
Chapter 1.3 shows where the square comes from.

The paper's simplest scene is a person of 70 kg standing 1 m from a small free ball. The person pulls on the ball with
the force $G\matter M\matter m/r^2$, so the ball accelerates by

$$\frac{G\matter M}{r^2} = \frac{6.674 \times 10^{-11} \times 70}{1^2}\unit{m\,s^{-2}} = 4.7 \times 10^{-9}\unit{m\,s^{-2}}.$$

The ball's own mass has cancelled. The Earth, with $G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$ and a radius
of 6371 km, pulls the same ball with $9.82\unit{m\,s^{-2}}$ at the ground,[^ground] which is two billion times more.
A person is a feeble source of gravity, and the paper's camera must measure effects of this size and smaller.

## The field is the pull per unit mass, and fields add

In the last calculation the mass of the ball dropped out. This holds for every body: the pull of gravity on it is
proportional to its own mass $\matter m$, so the pull divided by $\matter m$ is the same for a grain of sand and for a
cannonball at the same place. That quotient describes the place, not the body, and it is called the
**gravitational field**:

$$\sym{gravitational-field}{\vect g}(\vect x) = \frac{\vect F}{\matter m}.$$

The field is a vector at each point of space, and it is an acceleration, measured in $\mathrm{m\,s^{-2}}$. In
principle we measure it by releasing a small ball at the point and measuring its acceleration in a frame that is not
itself accelerating. A **frame** is a set of axes and clocks against which positions and times are measured, such as
the walls and the clock of a laboratory. In a frame that is not accelerating, a body that nothing pushes or pulls
keeps its speed and its direction.[^frame] The ball must be a **test mass**, small enough that its own pull does not
move the bodies it is measuring. For one body of mass $\matter M$ at the origin, equation [](#eq:newton-law) divided
by $\matter m$ gives

$$\vect g(\vect x) = -\frac{G\matter M}{r^3}\,\vect x. \label{eq:point-field}$$

An example of a field is the Earth's, $9.82\unit{m\,s^{-2}}$ pointing down at the ground. A non-example is the weight
of a body, the force with which the Earth pulls on it, in newtons. A weight doubles when the body's mass doubles, so it
describes the body as well as the place, and it is not a field.

The rule that answers the chapter's question is about many bodies at once. The pull of each body on a test mass is
the pull it would exert if it were alone, and the total pull is the vector sum of these. Experiment has found this
rule, called **superposition**, to hold for gravity. For the masses $\matter{m_1}, \matter{m_2}, \dots$ at the
positions $\vect x_1, \vect x_2, \dots$, the field is

$$\vect g(\vect x) = -\sum_a G\matter{m_a}\,\frac{\vect x - \vect x_a}{|\vect x - \vect x_a|^3}. \label{eq:field-sum}$$

The letter $a$ counts bodies and is not a direction in space, so the sum over it is written out with a $\sum$ sign,
and the summation convention of chapter 1.1 does not apply to it. Each term is equation [](#eq:point-field) with the
origin moved to body $a$, and $\vect x - \vect x_a$ is the vector from that body to the point.

A solid body, such as a floor or a steel safe, is made of mass spread through a volume. Its **density**
$\sym{density}{\matter\rho}(\vect x)$ is its mass per unit volume at each point, measured in kilograms per cubic metre.
We cut the body into small cubes. The cube at $\vect x'$ has the volume $\dd^3x' = \dd x'\,\dd y'\,\dd z'$ and so the
mass $\matter\rho(\vect x')\,\dd^3x'$. Each cube pulls as a point mass, and in the limit of small cubes the sum
[](#eq:field-sum) becomes an integral over the body:

$$\vect g(\vect x) = -G\int \matter\rho(\vect x')\,\frac{\vect x - \vect x'}{|\vect x - \vect x'|^3}\,\dd^3x'.$$

The prime marks the point $\vect x'$ where the mass is, to keep it apart from the point $\vect x$ where the field is
wanted.

### The pulls of the room, part by part

This is how the room of the locked safe is added up. We put the origin on the floor below the camera, with $x_1$
pointing to the right, $x_2$ straight ahead and $x_3$ up. The camera is at $(0, 0, 1.5)\unit{m}$. The safes are hollow
steel boxes, 0.8 m wide, 0.8 m deep and 1.0 m tall, with their middles at $(\pm 1.1, 3.5, 0.5)\unit{m}$. The paper's
3.5 m is therefore measured straight ahead. The middle of each safe is
$\sqrt{1.1^2 + 3.5^2 + 1.0^2}\unit{m} = 3.8\unit{m}$ from the camera, which is the radius of the sphere in panel (e).
The gold is a bar 0.30 m wide, 0.40 m deep and 0.14 m tall on the floor of the right-hand safe, with its middle at
$(1.1, 3.5, 0.13)\unit{m}$. The floor and the walls are described in the margin.[^room]

<!-- diagram: plan of the locked-safe room seen from above, with the axes x₁ (right) and x₂ (ahead) drawn from the
origin below the camera; the two safes as squares 0.8 m across centred at x₁ = ±1.1 m, x₂ = 3.5 m, the gold bar inside
the right-hand safe, the back wall at x₂ = 8.0 m and the side walls at x₁ = ±6.0 m; the straight-ahead distance 3.5 m
marked along x₂, and a line from the camera to each safe's middle labelled 3.8 m. A small side view gives the
heights: camera 1.5 m, safes' middles 0.5 m, gold 0.13 m. -->

The table gives the size of each part's pull at the camera.[^cubes] The concrete floor is the largest source by far,
because it is heavy and close.

| Part of the room | Mass | Size of its pull at the camera |
|---|---|---|
| Concrete floor | 121,000 kg | $2.3 \times 10^{-7}\unit{m\,s^{-2}}$ |
| Back wall | 22,700 kg | $1.7 \times 10^{-8}\unit{m\,s^{-2}}$ |
| Each side wall | 14,400 kg | $1.6 \times 10^{-8}\unit{m\,s^{-2}}$ |
| Steel of each safe | 1560 kg | $7.2 \times 10^{-9}\unit{m\,s^{-2}}$ |
| Gold | 324 kg | $1.4 \times 10^{-9}\unit{m\,s^{-2}}$ |
| The whole room | 176,000 kg | $2.5 \times 10^{-7}\unit{m\,s^{-2}}$ |

The gold's row can be checked by hand, because the bar is small compared with its distance and pulls almost as a
point mass at its middle. The vector from the camera to the gold is $(1.1,\ 3.5,\ 0.13 - 1.5)\unit{m} =
(1.1,\ 3.5,\ -1.37)\unit{m}$, of length $\sqrt{1.21 + 12.25 + 1.88}\unit{m} = 3.92\unit{m}$. The size of the pull is
$6.674 \times 10^{-11} \times 324/3.92^2 = 1.4 \times 10^{-9}\unit{m\,s^{-2}}$. Its sideways part, along $x_1$, is
$1.1/3.92$ of that, or $4.0 \times 10^{-10}\unit{m\,s^{-2}}$.

The sizes in the last column add up to $3.0 \times 10^{-7}\unit{m\,s^{-2}}$, not to the size of the total,
$2.5 \times 10^{-7}\unit{m\,s^{-2}}$, because the arrows point in different directions and parts of them cancel. The
left wall pulls the camera to the left and the right wall pulls it to the right by the same amount, so their sideways
parts cancel exactly. The two safes stand symmetrically, one on each side, so the sideways pulls of
their steel cancel too. The only sideways pull that survives at the camera is the gold's
$4.0 \times 10^{-10}\unit{m\,s^{-2}}$ toward the right-hand safe. To add arrows, we must add their three components
separately and keep track of every direction. The next section replaces each arrow with a single number.

## A potential is one number per point whose downhill slope is the field

A map of a hill shows the hill's height as one number at each point of the ground. From the heights alone we can find,
at every point, the direction in which the ground falls most steeply and how steep it is there. In this way one number
per point carries an arrow per point. We want the same for gravity: one number at each point of space whose steepest
downhill slope is the field. We first need the mathematics of slopes in three dimensions.

### The gradient points uphill

Take a function $f(\vect x)$, one number at each point of space. Its **partial derivative**
$\partial_i f = \partial f/\partial x_i$ is the rate at which $f$ changes when we move along the axis $x_i$ alone and
hold the other two coordinates fixed. We also write $\partial_x$, $\partial_y$ and $\partial_z$ for $\partial_1$,
$\partial_2$ and $\partial_3$. The **gradient** of $f$ is the vector of its three partial derivatives,

$$\sym{nabla}{\nabla} f = \bigl(\partial_1 f,\ \partial_2 f,\ \partial_3 f\bigr), \qquad (\nabla f)_i = \partial_i f.$$

The symbol $\nabla$ is read "del" or "nabla". If $f$ is measured in some unit, its gradient is measured in that unit
per metre.

We want the rate of change of $f$ in any direction, not only along the axes. Let $\hat{\vect u}$ be a unit vector, and
move from $\vect x$ a distance $s$ along it, to the point $\vect x + s\hat{\vect u}$, whose coordinates are
$x_i + s\hat u_i$. By the chain rule, the derivative with respect to $s$ is the sum, over the three coordinates, of the
partial derivative times the rate at which that coordinate changes. The coordinate $x_i + s\hat u_i$ changes at the
rate $\hat u_i$, so

$$\frac{\dd}{\dd s}\,f(\vect x + s\hat{\vect u})\Big|_{s=0} = \hat u_i\,\partial_i f = \hat{\vect u}\cdot\nabla f. \label{eq:directional}$$

This is the **directional derivative** of $f$ along $\hat{\vect u}$: how fast $f$ changes, per metre, as we move in
that direction. A dot product is $|\hat{\vect u}|\,|\nabla f|\cos\vartheta$, where $\vartheta$ is the angle between
the two vectors, and $|\hat{\vect u}| = 1$, so

$$\boxed{\;\hat{\vect u}\cdot\nabla f = |\nabla f|\cos\vartheta.\;}$$

The rate is largest when $\vartheta = 0$, so the gradient points in the direction in which $f$ grows fastest, and its
length $|\nabla f|$ is that fastest rate. The rate is most negative when $\vartheta = 180°$, so $-\nabla f$ points
steepest downhill. The rate is zero when $\vartheta = 90°$, so moving at right angles to the gradient does not change
$f$ at all.

An example shows these properties. Take $f = x^2 + y^2$ in the plane of $x$ and $y$. Its gradient is
$\nabla f = (2x, 2y)$, which points straight away from the origin. At the point $(3, 4)$ the gradient is $(6, 8)$, of
length 10, so $f$ grows by 10 per unit of distance in that direction. The curves on which $f$ is constant are circles
about the origin, and the gradient, which points along a radius, crosses each circle at a right angle.

<!-- diagram: contour map of f = x² + y² in the plane, the circles f = 1, 4, 9, 16, 25 about the origin (radii 1 to 5),
with gradient arrows ∇f = (2x, 2y) drawn at a few points, each pointing outward along a radius, crossing its circle at
a right angle, and longer the farther it is from the origin; the point (3, 4) marked on the circle f = 25 with its
arrow (6, 8), of length 10. -->

### The potential of one mass

We now look for a function $\sym{potential}{\field{\Phi}}(\vect x)$, one number at each point, whose gradient with a
minus sign is the field of a point mass, equation [](#eq:point-field). We make two assumptions: **the mass is a point
at the origin**, and **it does not move**. We will show that

$$\field\Phi = -\frac{G\matter M}{r}$$

does the job. First we need the derivative of the distance $r$ with respect to each coordinate. We write the case
$i = 1$ in full. The distance obeys $r^2 = x_1^2 + x_2^2 + x_3^2$. We differentiate both sides with respect to $x_1$,
using the chain rule on the left:

$$2r\,\partial_1 r = 2x_1, \qquad\text{so}\qquad \partial_1 r = \frac{x_1}{r}.$$

The same steps with $x_2$ or $x_3$ in place of $x_1$ give the same form, so for every $i$

$$\partial_i r = \frac{x_i}{r}.$$

In words, the distance from the origin grows fastest along $\vect x/r$, the unit vector that points away from the
origin (along $-\hat n$), at one metre per metre. Next, the derivative of $1/r$ with respect to $r$ is $-1/r^2$, and
by the chain rule we multiply it by $\partial_i r$:

$$\partial_i\,\frac{1}{r} = -\frac{1}{r^2}\,\partial_i r = -\frac{x_i}{r^3}.$$

Chapter 1.4 differentiates this result once more to find the tide. Now we multiply by $-G\matter M$:

$$\partial_i\field\Phi = -G\matter M\,\partial_i\frac{1}{r} = \frac{G\matter M\,x_i}{r^3}.$$

With a minus sign this is $-G\matter M x_i/r^3$, the field [](#eq:point-field) of the point mass. So the field of a
point mass is the downhill slope of a single number:

$$\boxed{\;\vect g = -\nabla\field\Phi, \qquad \field\Phi = -\frac{G\matter M}{r}.\;} \label{eq:potential}$$

The function $\field\Phi$ is the **gravitational potential**. It is an energy per unit mass, measured in joules per
kilogram, which is the same as $\mathrm{m^2\,s^{-2}}$;
[the section on work](#the-work-done-by-gravity-depends-only-on-the-ends-of-the-path) shows why it is an energy. The
units agree: $G\matter M/r$ is $\mathrm{m^3\,s^{-2}}$ divided by $\mathrm{m}$, and each derivative divides by another
metre, which gives the $\mathrm{m\,s^{-2}}$ of a field.

The equation has two minus signs, and they are easy to confuse. The table follows them through for the person of
70 kg at the origin and a point 1 m away on the $x$ axis. The final test is that a ball released there falls toward
the person.

| Quantity | Value 1 m from the person, on the $x$ axis | What the sign says |
|---|---|---|
| $\field\Phi$ | $-4.7 \times 10^{-9}\unit{J\,kg^{-1}}$ | lower than its value of zero far away |
| $\partial_x\field\Phi$ | $+4.7 \times 10^{-9}\unit{m\,s^{-2}}$ | the potential rises as we step away |
| $g_x = -\partial_x\field\Phi$ | $-4.7 \times 10^{-9}\unit{m\,s^{-2}}$ | the field points back toward the person |

The ball falls toward the person, as it must. The field points downhill on the potential, toward lower values, and
lower values lie nearer the mass.

<!-- diagram: the curve Φ(x) = −GM/|x| along the x axis for the person of 70 kg at the origin, a well that rises toward
zero on both sides; the point x = 1 m, Φ = −4.7 × 10⁻⁹ J kg⁻¹ marked, with its tangent rising to the right (∂ₓΦ > 0),
and under the axis the field arrow g_x pointing left, back toward the person and down the slope. -->

We check the result at a large distance. As $r$ grows, $\field\Phi$ rises toward zero as $1/r$, and the field falls
as $1/r^2$, one power faster, because a derivative with respect to distance divides by one more power of it. Far from
every mass the potential is flat, and there is no pull.

### Why the potential is negative, and what a constant changes

Adding a constant to $\field\Phi$ changes nothing that can be measured, because the derivative of a constant is zero
and the field is unchanged. Even clocks, which respond to the potential itself, compare its values at two places and
so read only its differences.[^clocks] The usual choice, which the paper makes, is that $\field\Phi$ is zero
infinitely far from every mass. The potential is lower near a mass than far away, so with this choice it is negative
everywhere.

### Equipotentials

A surface on which $\field\Phi$ has the same value everywhere is an **equipotential**. Moving along such a surface does
not change $\field\Phi$, so by equation [](#eq:directional) the field has no component along it. The field therefore
crosses every equipotential at right angles, pointing toward the lower one. For a point mass the equipotentials are
the spheres $r = \text{constant}$ centred on it, and the field points along their radii, inward. The surface of a calm
sea is close to an equipotential of the Earth, once the Earth's turning is included, so a plumb line hangs
perpendicular to the sea everywhere.

### The potentials of many masses add as numbers

The gradient of a sum is the sum of the gradients, because each partial derivative of a sum is the sum of the partial
derivatives. So the sum of the bodies' potentials has the sum of their fields as its downhill slope. By equation
[](#eq:field-sum), the potential of many point masses is therefore

$$\field\Phi(\vect x) = -\sum_a \frac{G\matter{m_a}}{|\vect x - \vect x_a|}, \label{eq:potential-sum}$$

and the potential of a body with density $\matter\rho$, cut into small cubes as before, is

$$\boxed{\;\field\Phi(\vect x) = -G\int \frac{\matter\rho(\vect x')}{|\vect x - \vect x'|}\,\dd^3x'.\;} \label{eq:potential-integral}$$

Each term of [](#eq:potential-sum) is a single negative number, so adding the potentials of a room is ordinary
arithmetic. At the camera of the locked safe, the gold contributes
$-6.674 \times 10^{-11} \times 324/3.92 = -5.5 \times 10^{-9}\unit{J\,kg^{-1}}$. The floor contributes
$-1.6 \times 10^{-6}\unit{J\,kg^{-1}}$, the back wall $-1.7 \times 10^{-7}$, each side wall $-1.3 \times 10^{-7}$ and
the steel of each safe $-2.7 \times 10^{-8}$, all in joules per kilogram. The sum, $-2.1 \times 10^{-6}\unit{J\,kg^{-1}}$,
is the potential of the whole room at the camera, with nothing cancelled and no direction to track. To get the field
of the room, we compute this sum at points around the camera and take its gradient.

## The work done by gravity depends only on the ends of the path

The potential is called an energy per unit mass for a reason that this section derives. When a force $\vect F$ acts
on a body that moves a small step $\dd\vect x$, it does the **work** $\vect F\cdot\dd\vect x$, the energy that the
force gives to the body, measured in joules, $1\unit{J} = 1\unit{N\,m}$. Over a path from a point $A$ to a point $B$,
the work is the sum of these small amounts. To write the sum, we describe the path as $\vect x(s)$, with a parameter
$s$ that runs from $s_A$ at $A$ to $s_B$ at $B$. Each step is $\dd\vect x = (\dd\vect x/\dd s)\,\dd s$, so the sum
becomes an ordinary integral over $s$, called a **path integral** and written for short as
$\int_A^B \vect F\cdot\dd\vect x$. For gravity on a test mass, $\vect F = \matter m\vect g = -\matter m\nabla\field\Phi$,
and

$$W = -\matter m\int_{s_A}^{s_B} \partial_i\field\Phi\,\frac{\dd x_i}{\dd s}\,\dd s .$$

By the chain rule, the integrand is the rate of change of the potential along the path,
$\partial_i\field\Phi\,\dd x_i/\dd s = \dd\field\Phi/\dd s$. The integral of a derivative is the difference of the
function's values at the two ends, so

$$\boxed{\;W = -\matter m\,\bigl[\field\Phi(B) - \field\Phi(A)\bigr].\;} \label{eq:work}$$

The path has dropped out. Gravity does the same work on every path between the same two points, and no work on a path
that returns to its start. A force with this property is called **conservative**. The quantity
$U = \matter m\field\Phi$ is the body's **potential energy**: the energy it has because of where it is, in joules.
When gravity does positive work, the potential energy falls by the same amount.

This gives the sign of $\field\Phi$ a second meaning. A body that falls in from very far away, where
$\field\Phi = 0$, is pulled along its path, so gravity does positive work on it. By [](#eq:work), $\field\Phi$ at the
end of its fall is below zero.

The work goes into motion. Newton's second law, $\matter m\,\dd\vect v/\dd t = \vect F$, shows that the work done
along a path equals the change of the **kinetic energy** $\tfrac12\matter m v^2$, the energy of motion.[^kinetic] So
$\tfrac12\matter m v^2 + \matter m\field\Phi$ stays the same for a body that only gravity acts on, which is the
conservation of energy.

### Near the ground the potential grows by $gh$

We check that the potential gives the familiar potential energy $\matter m g h$ near the ground. At a height $h$ above
the surface of the Earth, of radius $R$,

$$\field\Phi(R + h) = -\frac{G\matter M}{R + h} = -\frac{G\matter M}{R}\,\frac{1}{1 + h/R}.$$

The small parameter is $h/R$. For a number $u$ much smaller than one, $1/(1 + u) \approx 1 - u$, with an error of
about $u^2$. So to first order in $h/R$

$$\field\Phi(R + h) \approx -\frac{G\matter M}{R} + \frac{G\matter M}{R^2}\,h = \field\Phi(R) + g h ,$$

where $g = G\matter M/R^2 = 9.82\unit{m\,s^{-2}}$ is the size of the field at the ground. By [](#eq:work), raising a
body of mass $\matter m$ by $h$ takes the energy $\matter m g h$: 9.82 J for a kilogram raised a metre. The first term
left out is smaller than $gh$ by the factor $h/R$, which is $1.6 \times 10^{-4}$ for a height of 1 km.

## Close to a point the field changes linearly

The paper's camera measures how the field changes from one point to a nearby one. We call the small step between them
$\vect\xi$ (the Greek letter xi), a vector measured in metres, as in chapter 1.1. To find the field at
$\vect x + \vect\xi$, we apply equation [](#eq:directional) to each component $g_i$ of the field, with
$\hat{\vect u} = \vect\xi/|\vect\xi|$ and the distance $s = |\vect\xi|$. To first order, the change of $g_i$ is the
distance times the directional derivative, $s\,\hat u_j\partial_j g_i = \xi_j\partial_j g_i$, so

$$g_i(\vect x + \vect\xi) \approx g_i(\vect x) + \xi_j\,\partial_j g_i(\vect x). \label{eq:linear}$$

This is the first-order Taylor expansion in three dimensions, with the repeated index $j$ summed. The nine numbers
$\partial_j g_i$ form a table of three rows and three columns, which turns the step $\vect\xi$ into the change of the
field. Because $g_i = -\partial_i\field\Phi$, each entry is a second derivative of the potential,
$\partial_j g_i = -\partial_j\partial_i\field\Phi$. The table is a tensor in the sense of chapter 1.1: it turns with
the axes, so it turns arrows into arrows in the same way whichever axes describe them. The paper calls the table of
second derivatives of the potential the tidal tensor and writes it $\curv{\tE}_{ij}$, so that
$\partial_j g_i = -\curv{\tE}_{ij}$:

{{paper eq:newton}}

Chapter 1.4 computes the whole table for a point mass.

The approximation is good when the step is small compared with the distance $r$ to the mass, because the field of a
point mass changes appreciably only over distances comparable with $r$. For a step along the line to the mass, the
first term that [](#eq:linear) leaves out is $3|\vect\xi|/2r$ times the change that it keeps.[^neglected] For two
points 1 cm apart beside the person a metre away, this ratio is 1.5 per cent. For points a metre apart the expansion
fails, and the field must be computed at each point separately.

::: try {#potential-map}
Before you move anything, predict: between a heavy and a light mass, is the point of zero pull nearer the heavy one?
The figure opens with masses of 1000 kg and 250 kg, 2 m apart, seen from above. The lines are equipotentials, and the
probe shows the field where it stands as an arrow, with readouts of $\field\Phi$ and $|\vect g|$. Drag the probe, or
move it with the arrow keys, along the line between the masses until it finds the point of zero pull, and compare
it with your prediction. Read the potential there too: is it zero? Then drag a mass, or change the lighter one with
the slider, and watch the point move. Wherever the probe stands, its arrow crosses the lines at
right angles and points toward lower potential.
:::

::: check
### Q

In what units is the potential measured, and why is that the same as $\mathrm{m^2\,s^{-2}}$?

### A

In joules per kilogram, because it is a potential energy per unit mass. A joule is $\mathrm{kg\,m^2\,s^{-2}}$, so a
joule per kilogram is $\mathrm{m^2\,s^{-2}}$, the square of a speed.

### Q

The Moon's mass is 0.0123 times the Earth's, and the two centres are 384,400 km apart. If nothing else pulls, where on
the line between them do their pulls cancel? Is the potential zero there?

### A

Let $r$ be the distance from the Earth's centre, $d = 384{,}400\unit{km}$ and $\mu = 0.0123$. The pulls are equal when
$G\matter M_{\rm Earth}/r^2 = G\matter M_{\rm Moon}/(d - r)^2$, so $(d - r)/r = \sqrt\mu = 0.111$ and
$r = d/(1 + \sqrt\mu) = 346{,}000\unit{km}$. The point is 38,000 km from the Moon. It lies nearer the lighter body,
because the lighter body's pull matches the heavier one's only close to it. The potential there is
$-1.15 \times 10^{6} - 1.3 \times 10^{5} = -1.28 \times 10^{6}\unit{J\,kg^{-1}}$, not zero. The potential is flat
there along the line, like the top of a mountain pass between two valleys, and only its slope is zero.

### Q

The left and right walls of the locked-safe room pull on the camera, and their sideways pulls cancel. Do their
potentials at the camera cancel too?

### A

No. Each wall contributes $-1.3 \times 10^{-7}\unit{J\,kg^{-1}}$, and the two add to twice that. Their summed potential
is the same at equal distances to the left and right of the camera, so its sideways slope there is zero. Only the
sideways pulls cancel: together the walls still pull the camera with $1.5 \times 10^{-8}\unit{m\,s^{-2}}$, up and
toward the back wall.
:::

**The idea to keep: one number at each point, the potential, holds the whole pull of gravity. The field is its
downhill slope, $\vect g = -\nabla\field\Phi$, and the potentials of many masses add as ordinary numbers.**

::: problems
### Practice

The person of 70 kg stands at the origin. Find the field and the potential at the point $(3, 4, 0)\unit{m}$.

::: solution
The distance is $r = \sqrt{3^2 + 4^2} = 5\unit{m}$. By equation [](#eq:point-field), the field is
$-(G\matter M/r^3)(3, 4, 0)\unit{m} = (-1.12, -1.50, 0) \times 10^{-10}\unit{m\,s^{-2}}$. Its size is
$G\matter M/r^2 = 6.674 \times 10^{-11} \times 70/25 = 1.87 \times 10^{-10}\unit{m\,s^{-2}}$, and it points from the
point straight back toward the person. The potential is $-G\matter M/r = -9.3 \times 10^{-10}\unit{J\,kg^{-1}}$.
:::

### Stretch

A thin ring of mass $\matter M$ and radius $R$ lies in the plane $z = 0$, centred on the origin. Find its potential at
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

### The paper

The paper's Section II says that the tide of the person a metre away has the size $2G\matter M/r^3 = 9 \times
10^{-9}\unit{s^{-2}}$ along the line to the person. Show from equation [](#eq:point-field) that this is how fast the
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
10^{-9}\unit{s^{-2}}$, the paper's number. Two points 1 cm apart on that line feel pulls that differ by
$9.3 \times 10^{-11}\unit{m\,s^{-2}}$.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) gives the person's tide, $2G\matter M/r^3$, the rate of change of the pull along
  the line to the person.
- Equation [](/paper/#eq:newton) writes the tide as the second derivatives of the potential derived here.
- In [Section IV](/paper/#sec:near-field), *What the image cannot show* adds to a body a density whose potential
  $\psi$ vanishes outside the body. Because potentials add, the potential outside is unchanged, and chapter 2.5 builds
  the paper's equation [](/paper/#eq:split) on this.
- Section IV's *Other gravitational sensors* compares a camera of clocks, which read the potential, a camera of
  accelerometers, which read the field, and the paper's tidal camera, which reads the second derivatives.
- Figure [](/paper/#fig:locked-safe) and *A worked case* in Section IV subtract the known room and safes, which needs
  this chapter's superposition.
:::

::: deeper
- The [GR course, section 0.2](https://neovand.github.io/general-relativity/chapter-0.html#0-2-partial-derivatives-change-one-input-at-a-time)
  reviews partial derivatives with worked examples, and its
  [section 0.5](https://neovand.github.io/general-relativity/chapter-0.html#0-5-the-mechanics-we-will-use) reviews
  force and energy.
- The [GR course, section 16.7](https://neovand.github.io/general-relativity/chapter-16.html#16-7-gps-calculate-the-competing-clock-effects)
  computes how the potential speeds up the clocks of GPS satellites, with a calculator.
- H. M. Schey, *Div, Grad, Curl, and All That* (Norton, 4th edition 2005), introduces the gradient and the other
  derivatives of vector calculus through the electric field, one picture at a time.
:::

::: history
### Newton, Cavendish and the constant $G$

Newton published the law of gravitation in the *Principia* (1687), and checked it against the Moon: at 60 Earth radii,
the pull it predicts is 3600 times weaker than at the ground, as the Moon's orbit requires. He could not measure $G$
itself, because the pull between two bodies in a laboratory is so weak. In 1798 Henry Cavendish measured the
attraction between lead spheres with a torsion balance, and from it the mean density of the Earth. His result fixes
$G$ within about one per cent of today's value. The potential, a single function whose slope gives the force, came
later, in the work of Lagrange (1773) and Laplace (1782) on the gravity of the planets.
:::

[^ground]: The value measured at the ground is $9.78$ to $9.83\unit{m\,s^{-2}}$, depending on latitude, because the
    Earth turns and is not quite round. This chapter uses $G\matter M/R^2 = 9.82\unit{m\,s^{-2}}$ for a round Earth
    that does not turn.

[^frame]: The field is a definite vector at each point, but chapter 1.4 shows that it cannot be measured on its own,
    because a laboratory that falls freely falls with the ball. A detector can measure only how the field differs
    between nearby points, and that is what the paper's camera reads.

[^room]: The floor is concrete ($2400\unit{kg\,m^{-3}}$), 12 m wide, 14 m deep and 0.3 m thick, with its top at
    $x_3 = 0$. The three walls are plaster ($1200\unit{kg\,m^{-3}}$), 5 m tall and 0.3 m thick, with their inner faces
    at $x_2 = 8.0\unit{m}$ and $x_1 = \pm 6.0\unit{m}$. The safes' steel is 5 cm thick. The room has no ceiling and no
    front wall.

[^cubes]: Each box of the paper's scene was cut into cubes 2 cm across (10 cm for the floor and walls), and the cubes'
    fields and potentials were summed as point masses by equations [](#eq:field-sum) and [](#eq:potential-sum). The
    Earth's own pull, forty million times larger, is left out. The paper's camera reads tides, and the paper subtracts
    the Earth's tide, which is steady and known, as it subtracts the room ([Section II](/paper/#sec:pixel)).

[^clocks]: Chapter 7.1 derives that a clock higher up runs faster by the fraction $\Delta\field\Phi/c^2$, where $c$ is
    the speed of light. For one metre of height at the ground this is $gh/c^2 = 1.1 \times 10^{-16}$. Atomic clocks
    have measured it over 33 cm (C. W. Chou and colleagues, *Science* 329, 1630, 2010) and across one millimetre
    (T. Bothwell and colleagues, *Nature* 602, 420, 2022).

[^kinetic]: Take the dot product of both sides of the law with the velocity $\vect v$. The left side becomes
    $\dd(\tfrac12\matter m v^2)/\dd t$, because $\dd(\vect v\cdot\vect v)/\dd t = 2\vect v\cdot\dd\vect v/\dd t$. The
    right side, $\vect F\cdot\vect v$, is the work done per unit time, because $\vect v\,\dd t$ is the step
    $\dd\vect x$.

[^neglected]: Take a step of length $s$ along the line, away from the mass. The exact change in the size of the pull
    is $G\matter M\,[1/(r + s)^2 - 1/r^2]$, which is $-(G\matter M/r^3)$ times $2s - 3s^2/r + \dots$. The first
    term is the change that equation [](#eq:linear) keeps, and the second is $3s/2r$ times it.
