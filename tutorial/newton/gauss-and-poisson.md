---
id: '1.3'
title: "Gauss's law: what the outside of a ball can tell"
question: 'Why does a hollow steel shell pull on everything outside it exactly as a solid steel ball of the same mass does?'
part: '1'
requires: ['1.1', '1.2']
paper: [sec:pixel, sec:near-field, eq:tidal-column, eq:split, eq:array-data, fig:same-outside]
figures: [fig:same-outside]
live: [shell-theorem]
depth: A
---

Take two steel bodies of the same mass: a solid ball, and a hollow shell, wider than the ball, with nothing inside it.
At any point outside both, the two pull on a small body with exactly the same strength and in exactly the same
direction, so no instrument outside them, however sensitive, can tell by the steady pull which one is there. Newton
proved this in 1687. It is the first limit that the paper's [Section IV](/paper/#sec:near-field) sets on a
gravitational camera: the pull outside a body does not settle how the mass inside it is arranged. By its steady pull
alone, the Earth, with its dense iron core, cannot be told from a uniform ball of 5513 kilograms per cubic metre.

This chapter proves that result, the shell theorem, and so answers the question that the two bodies raise. Why does a
hollow steel shell pull on everything outside it exactly as a solid steel ball of the same mass does? On the way,
Newton's inverse-square law becomes a law about the flux of the field through a closed surface, called Gauss's law.
Gauss's law then becomes a law that holds at every point, called Poisson's equation, which chapter 1.4 and all of
Part 2 use. The tools are the flux, the solid angle, the divergence, the divergence theorem and the delta function.

::: plain
Picture the field of gravity around a mass as a crowd of arrows, all pointing toward the mass. Now wrap the mass in a
closed surface, such as a sphere or the surface of a box. At each small piece of the surface, ask how much of the field
passes through it, and add up the answers over the whole surface. The total is called the **flux**.

For gravity the flux through a closed surface depends only on the mass inside it, not on the size or shape of the
surface, and mass outside adds nothing. This is **Gauss's law**. Applied to a tiny box around one point, it says that
the way the field gathers in at the point is set by the density of mass there, and that version is called
**Poisson's equation**.

A round body's field points straight at its centre and is equally strong all over any sphere around the centre. Gauss's
law then fixes the field outside from the total mass alone. So a hollow shell and a solid ball of the same mass pull
alike outside, and inside a hollow shell there is no pull at all.
:::

## Flux counts how much field crosses a surface

Here $\sym{gravitational-field}{\vect g}$ is the **gravitational field** of chapter 1.2: the pull of gravity on a
small body divided by the body's mass, an acceleration in metres per second squared. A point mass
$\sym{mass}{\matter{M}}$, in kilograms, at the origin makes the field

$$\vect g = -\frac{G\matter M}{r^2}\,\hat{\vect x}, \label{eq:point-field}$$

where $G = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is Newton's constant, $r$ is the distance from the mass,
and $\hat{\vect x} = \vect x/r$ is the unit vector that points from the mass outward to the point $\vect x$. This is
chapter 1.2's $-G\matter M\vect x/r^3$, and the minus sign makes the field point toward the mass.[^nhat]

We want one number that says how much of a field passes through a surface. Take first a small flat patch of area
$\Delta A$, and choose one of its two sides. Let $\Delta\vect A$ be the vector that stands perpendicular to the patch
on that side and whose length is the patch's area. Its direction is called the patch's **normal**. The **flux** of
$\vect g$ through the patch is

$$\vect g\cdot\Delta\vect A ,$$

the part of the field perpendicular to the patch times the area of the patch. The part of the field that runs along
the patch does not cross it, so it does not count.

A large or curved surface $S$ is cut into many small patches, each nearly flat.[^S] The flux through the whole surface
is the sum of the fluxes through the patches, in the limit in which the patches become very small. This limit is a
**surface integral**, written $\int_S \vect g\cdot\dd\vect A$. Its unit is an acceleration times an area,
$\mathrm{m^3\,s^{-2}}$, the same unit as $G\matter M$. In principle it is found by measuring the field at many
points of the surface and adding up.

If $\vect g$ were the velocity of a flowing liquid, the flux would be the volume of liquid crossing the surface each
second. Nothing flows in a gravitational field, but the same bookkeeping gives a number that, as the next sections
show, stays fixed while the surface changes.

A **closed surface** is a surface with no edge that encloses a region of space, such as a sphere, the six faces of a
box, or the skin of a potato. On a closed surface we always choose the **outward normal**, the normal that points out
of the enclosed region, so that the flux counts what leaves the region as positive and what enters it as negative.
Its integral is written with a circle, $\oint_S$.

The simplest example is a sphere of radius $r$ centred on a point mass. The field points straight inward at every
point of the sphere, and $\dd\vect A$ points straight outward, so $\vect g\cdot\dd\vect A = -(G\matter M/r^2)\,\dd A$
everywhere on it. The sphere's area is $4\pi r^2$, so

$$\begin{aligned}
\oint_S \vect g\cdot\dd\vect A &= -\frac{G\matter M}{r^2}\times 4\pi r^2\\
&= -4\pi G\matter M.
\end{aligned} \label{eq:flux-sphere}$$

The radius has cancelled. For the person of the paper, of mass 70 kg, the field 1 m away is
$4.67 \times 10^{-9}\unit{m\,s^{-2}}$ and the sphere's area is $12.6\unit{m^2}$, so the flux is
$-5.9 \times 10^{-8}\unit{m^3\,s^{-2}}$. At 2 m the field is four times weaker and the sphere four times larger, so the
flux is the same.

## Solid angle measures how large a patch looks

To handle a surface of any shape, we need a way to say how large a small tilted patch looks from the mass.

An angle, in radians, is the length of arc that it cuts from a circle of radius 1 centred on its corner. The **solid
angle** of a patch, seen from a point, is the area that the patch covers on a sphere of radius 1 centred on the point,
when each point of the patch is moved along the straight line toward the centre until it reaches that sphere. It is
the patch's shadow on the unit sphere. Its unit is the **steradian**, written sr. Like the radian it is a pure number,
because it is an area divided by the square of a length: the shadow could be cast on a sphere of any radius $R$, and
its area divided by $R^2$ gives the same number. The whole sphere has the area $4\pi$, so the whole sky covers $4\pi$
steradians.

Solid angle measures how large something looks, whatever its distance. The Moon, of radius 1737 km at a distance of
384,400 km, has an angular radius of $4.52 \times 10^{-3}$ radians, so its disc covers
$\pi(4.52 \times 10^{-3})^2 = 6.4 \times 10^{-5}\unit{sr}$, about one part in 200,000 of the sky. A photograph of the
whole sky would show the Moon filling that fraction of it.

The area of a patch is not its solid angle. A square window
of one square metre, seen face-on from 1 m, covers 0.81 steradian rather than 1, because its corners are farther away
than its centre and are seen at a slant.[^window] Seen edge-on, it covers none.

Now take a small patch of area $\dd A$ at a distance $r$ from the point, tilted so that its normal makes an angle
$\alpha$ with the direction $\hat{\vect x}$ from the point to the patch. Only the patch's cross-section perpendicular
to the line of sight, $\cos\alpha\,\dd A$, faces the point. Moving this cross-section in to the unit sphere shrinks
each of its lengths by the factor $1/r$, and so its area by $1/r^2$ (Figure [](#fig:solid-angle)). The solid angle
of the patch is therefore

$$\sym{solid-angle}{\dd\Omega} = \frac{\cos\alpha\,\dd A}{r^2} = \frac{\hat{\vect x}\cdot\dd\vect A}{r^2}.$$

![A flat patch of area $\dd A$ at the distance $r$ from the point $O$, its normal tilted by the angle $\alpha$ from the
line of sight $\hat{\vect x}$. Moved along the thin cone toward $O$, the patch lands on the sphere of radius 1 as its
shadow $\dd\Omega$ (orange), which is drawn exactly; the dashed square is the cross-section $\cos\alpha\,\dd A$ that
faces $O$.](tut-gauss-solid-angle){#fig:solid-angle}

We keep the sign of $\cos\alpha$: the solid angle is positive when the patch's normal points away from the point, and
negative when it points toward it.[^omega]

This is where the inverse-square law enters. The flux of a point mass through the small patch is, by
[](#eq:point-field),

$$\vect g\cdot\dd\vect A = -\frac{G\matter M}{r^2}\,\hat{\vect x}\cdot\dd\vect A = -G\matter M\,\dd\Omega .$$

The flux through any patch is $-G\matter M$ times the solid angle that the patch covers, seen from the mass. The
$1/r^2$ of the field exactly cancels the $r^2$ by which a patch must grow to cover the same solid angle at a larger
distance. A pull that fell as $1/r^3$ would not have this property.

## The flux out of a closed surface counts the mass inside

We want the flux of gravity out of any closed surface, whatever its shape. We assume that **the masses are at rest**,
so that the field is the Newtonian field of chapter 1.2, and that **no mass lies on the surface itself**, so that the
field is finite at every point of it.

Start with one point mass inside the surface. Follow a thin cone of directions of solid angle $\dd\Omega$ out from the
mass. The cone must leave the enclosed region, so it crosses the surface at least once. It may cross more than once,
for a surface with folds: out, back in, and out again. Each crossing cuts a small patch from the surface. Where the
cone leaves the region, the outward normal points away from the mass, and the patch covers $+\dd\Omega$. Where it
enters, the patch covers $-\dd\Omega$. The cone starts inside the region and ends outside it, so its crossings
alternate between outward and inward, and the first and the last are outward. Every inward crossing therefore cancels
one outward crossing (Figure [](#fig:crossings)), and $+\dd\Omega$ is left. Adding over all the cones gives the solid
angle of the whole closed
surface seen from inside it, $4\pi$, and by the last section the flux is $-G\matter M$ times this:

$$\oint_S \vect g\cdot\dd\vect A = -4\pi G\matter M \qquad \text{(mass inside)}.$$

![A closed surface $S$ with a fold, cut through its middle. The thin cone from the mass $\matter{m_1}$ inside crosses $S$
out, back in and out again, so its patches count $+\dd\Omega$, $-\dd\Omega$, $+\dd\Omega$; the cone from $\matter{m_2}$, outside
in the fold, enters and leaves, and its two patches cancel. Each arrow is the outward normal, orange where it points
away from the mass and blue where it points toward it.](tut-gauss-crossings){#fig:crossings}

Now put the mass outside the surface. A cone from the mass either misses the region or enters and leaves it an equal
number of times. Its crossings cancel in pairs, so the total solid angle is zero, and so is the flux:

$$\oint_S \vect g\cdot\dd\vect A = 0 \qquad \text{(mass outside)}.$$

Fields add, by the superposition of chapter 1.2, so the flux of many point masses $\matter{m_a}$ is the sum of their
fluxes. Each mass inside the surface adds $-4\pi G\matter{m_a}$, and each mass outside adds nothing. For matter spread
out with a **density** $\sym{density}{\matter{\rho}}$, its mass per unit volume in kilograms per cubic metre, the sum
becomes an integral over the volume:

$$\boxed{\;\begin{gathered}
\oint_S \vect g\cdot\dd\vect A = -4\pi G\,\sym{enclosed-mass}{\matter{M}_{\mathrm{enc}}},\\
\matter{M}_{\mathrm{enc}} = \int_V \matter\rho\,\dd V ,
\end{gathered}\;} \label{eq:gauss}$$

where $V$ is the region inside $S$ and $\matter{M}_{\mathrm{enc}}$, the **enclosed mass**, is the mass in that
region. This is **Gauss's law** for gravity. Both sides are in $\mathrm{m^3\,s^{-2}}$, and for a sphere around a
single mass it gives back [](#eq:flux-sphere).

So the flux out of any closed surface around the person is $-5.9 \times 10^{-8}\unit{m^3\,s^{-2}}$, whether the
surface is a box, a sphere or a potato skin, and wherever inside it the person stands. Gauss's law gives this one
number for the whole surface, but not the field at each point of it, because many different fields have the same
flux. For a round body, the missing fact is its symmetry, which the section on round bodies uses.

## Divergence is the outflow per unit volume

To get a law about a single point, we apply Gauss's law to a very small box.

We write the axes as $x$, $y$ and $z$, which are chapter 1.1's $x_1$, $x_2$ and $x_3$. Take a box with one corner at
the point $(x, y, z)$ and sides $\Delta x$, $\Delta y$, $\Delta z$ along the axes. Look first at its two faces
perpendicular to the $x$ axis, each of area $\Delta y\,\Delta z$. On the face at $x + \Delta x$ the outward normal
points along $+x$, so the flux through it is $g_x(x + \Delta x)\,\Delta y\,\Delta z$, where $g_x$ is the $x$ component
of the field and we write only the coordinate that changes. On the face at $x$ the outward normal points along $-x$,
so the flux is $-g_x(x)\,\Delta y\,\Delta z$. By the first-order Taylor expansion of chapter 1.2, the two faces
(Figure [](#fig:box)) together give

$$\begin{aligned}
&\bigl[g_x(x + \Delta x) - g_x(x)\bigr]\,\Delta y\,\Delta z\\
&\qquad\approx \partial_x g_x\;\Delta x\,\Delta y\,\Delta z .
\end{aligned}$$

![A small box with one corner at $(x, y, z)$. The field $g_x(x)$ enters through the blue face at $x$, whose outward
normal points along $-x$, and the longer $g_x(x + \Delta x)$ leaves through the orange face at $x + \Delta x$, whose
outward normal points along $+x$; the arrows' lengths are schematic.](tut-gauss-box){#fig:box}

The other two pairs of faces give the same with $y$ and $z$ in place of $x$. We add the three pairs and write
$\Delta V = \Delta x\,\Delta y\,\Delta z$ for the volume of the box:

$$\begin{aligned}
\oint_{\text{box}} \vect g\cdot\dd\vect A &\approx \bigl(\partial_x g_x + \partial_y g_y\\
&\qquad + \partial_z g_z\bigr)\,\Delta V .
\end{aligned}$$

The bracket is the **divergence** of the field, the flux out of a small region per unit of its volume, in the limit in
which the region shrinks to a point:

$$\boxed{\;\begin{aligned}
\nabla\cdot\vect g &= \partial_i g_i\\
&= \lim_{\Delta V \to 0}\frac{1}{\Delta V}\oint \vect g\cdot\dd\vect A .
\end{aligned}\;}$$

The repeated index $i$ is summed, as in chapter 1.1. The divergence is measured in $\mathrm{s^{-2}}$, the unit of the
field divided by a length. It is positive where more field leaves a small region around the point than enters it, and
negative where more enters.

An example is a field that points toward the origin and grows in proportion to the distance, $\vect g = -k\,\vect x$,
with $k$ a constant in $\mathrm{s^{-2}}$. Its components are $g_i = -k x_i$, and $\partial_i x_i = 1 + 1 + 1 = 3$, so
$\nabla\cdot\vect g = -3k$ at every point. The section on round bodies shows that this is the field inside a uniform
ball.

A non-example warns against reading the divergence from a picture of arrows. The arrows of a point mass all converge
toward the mass, and this looks like an inflow at every point. Yet away from the mass the divergence is zero. To see
why, take a small box shaped like a piece of a cone from the mass: it lies between the distances $r$ and $r + \Delta r$
and covers the small solid angle $\Delta\Omega$. Its side faces run along the field, so no field crosses them. Its
inner face has area $r^2\Delta\Omega$ and its outer face $(r + \Delta r)^2\Delta\Omega$. The field enters through the
outer face with the flux $-G\matter M/(r + \Delta r)^2 \times (r + \Delta r)^2\Delta\Omega = -G\matter M\,\Delta\Omega$,
and it leaves through the inner face with $+G\matter M\,\Delta\Omega$. The two cancel. The field is stronger on the
inner face, and that face is smaller, by exactly the same factor
(Figure [](#fig:cone-box)).

![A box cut from a cone of directions from the mass $\matter M$. The field enters through the outer face (blue) and leaves
through the inner face (orange); the inner arrow is longer by $(r + \Delta r)^2/r^2$ and the inner face is smaller by
the same factor, as drawn, so the two fluxes cancel.](tut-gauss-cone-box){#fig:cone-box}

## The divergence theorem adds up the boxes

We now fill a whole region $V$ with small boxes and add up their outflows, each the divergence times the volume of the
box. A face inside the region is shared by two neighbouring boxes, whose outward normals on it point in opposite
directions, so its flux enters the sum twice with opposite signs and cancels. Only the faces on the region's outer
surface $S$ are left, and their fluxes add up to the flux out of $S$. In the limit of very small boxes the sum of
divergence times volume becomes a volume integral, and

$$\boxed{\;\oint_S \vect g\cdot\dd\vect A = \int_V \nabla\cdot\vect g\;\dd V .\;} \label{eq:div-theorem}$$

This is the **divergence theorem**: the flux out of a closed surface equals the total divergence inside it. Nothing in
the argument used gravity, so it holds for any smooth vector field. We check it on $\vect g = -k\,\vect x$ and a ball
of radius $a$ centred on the origin. The right side is the divergence $-3k$ times the volume $\tfrac43\pi a^3$, which
is $-4\pi k a^3$. On the surface the field has the size $ka$ and points straight inward, so the left side is
$-ka \times 4\pi a^2$, again $-4\pi k a^3$.

::: gap
The argument skips two points. Near a curved surface the boxes make a staircase, and each box used a first-order
Taylor expansion. The full proof shows that both errors vanish as the boxes shrink, when the surface is smooth or made
of smooth pieces like the faces of a cube, and the field and its first derivatives are continuous. The theorem does
not apply when the field is infinite somewhere inside, as it is at a point mass. The section on the delta function
handles that case without it.
:::

## Poisson's equation is Gauss's law at every point

We want the law that Gauss's law imposes at each single point. We assume that **the density changes smoothly** from
point to point, so that the field is smooth and the divergence theorem applies. For any region $V$, Gauss's law
[](#eq:gauss) gives the flux out of its surface, and the divergence theorem [](#eq:div-theorem) writes the same flux
as an integral over $V$. Moving everything to one side,

$$\int_V \bigl(\nabla\cdot\vect g + 4\pi G\matter\rho\bigr)\,\dd V = 0$$

for every region $V$. Suppose the bracket were positive at some point. Because it is continuous, it is positive in a
small ball around that point, and its integral over that ball is positive, which contradicts the equation. A negative
value fails in the same way. So the bracket is zero at every point, and $\nabla\cdot\vect g = -4\pi G\matter\rho$.

Now we use the potential. Here $\sym{potential}{\field{\Phi}}$ is the gravitational potential of chapter 1.2, the
energy per unit mass that a small body has because of where it is, in joules per kilogram, and the field is
$g_i = -\partial_i\field\Phi$. So $\nabla\cdot\vect g = -\partial_i\partial_i\field\Phi$. The sum of the three second
derivatives along the axes is the **Laplacian**,

$$\begin{aligned}
\nabla^2\field\Phi &= \partial_i\partial_i\field\Phi\\
&= \frac{\partial^2\field\Phi}{\partial x^2} + \frac{\partial^2\field\Phi}{\partial y^2} + \frac{\partial^2\field\Phi}{\partial z^2},
\end{aligned}$$

the divergence of the gradient. With it, the last equation becomes

$$\boxed{\;\nabla^2\field\Phi = 4\pi G\matter\rho .\;} \label{eq:poisson}$$

This is **Poisson's equation**. Both sides are in $\mathrm{s^{-2}}$: the potential is in $\mathrm{m^2\,s^{-2}}$ and
each derivative divides by a metre, while $G\matter\rho$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times
$\mathrm{kg\,m^{-3}}$. The density at a point fixes how the potential curves at that point.

In **empty space**, a region with no matter in it, Poisson's equation becomes **Laplace's equation**,
$\nabla^2\field\Phi = 0$. Chapter 2.1 is about this equation, because the space between a scene and the camera is
empty. The potential of a point mass, $-G\matter M/r$, passes this test away from the mass, because
$\nabla^2\field\Phi = -\nabla\cdot\vect g$ and the cone-shaped box showed that the divergence is zero there.

Poisson's equation is also a statement about the tide. Chapter 1.2 called the table of second derivatives
$\sym{tidal-tensor}{\curv{\tE}}_{ij} = \partial_i\partial_j\field\Phi$, in $\mathrm{s^{-2}}$, the tidal tensor. The
sum of its diagonal entries, called its **trace**, is $\curv{\tE}_{ii} = \nabla^2\field\Phi$. So the trace of the
tide at a point is $4\pi G\matter\rho$, which measures the density at that point and nothing else. In water, of
density $1000\unit{kg\,m^{-3}}$, it is $4\pi \times 6.674 \times 10^{-11} \times 1000 = 8.4 \times 10^{-7}\unit{s^{-2}}$,
about ninety times the largest entry of the person's tide at a metre, $2G\matter M/r^3 = 9.3 \times 10^{-9}\unit{s^{-2}}$,
which chapter 1.4 derives. In empty space the trace is zero, however much matter lies nearby.

## A point mass is density gathered at one point

Poisson's equation has a gap. A point mass has no density in the ordinary sense: its density is zero everywhere
except at one point, where it would have to be infinite, and no ordinary function behaves like that. Yet Gauss's law
for a point mass is perfectly finite. We want a way to write the density of a point mass so that Poisson's equation
holds there too.

The answer is to describe the density by what it does inside an integral. The **delta function** in one dimension,
$\delta(z)$, is defined by the rule

$$\int \delta(z)\,f(z)\,\dd z = f(0)$$

for every smooth function $f$. In three dimensions $\sym{delta-function}{\delta^3}(\vect x) =
\delta(x)\,\delta(y)\,\delta(z)$. In the integral of $\delta(x)\,\delta(y)\,\delta(z)\,f(x, y, z)$, the integral over $x$
replaces $f$ by $f(0, y, z)$, the integral over $y$ then replaces it by $f(0, 0, z)$, and the integral over $z$ leaves
$f(0, 0, 0)$:

$$\boxed{\;\int \delta^3(\vect x)\,f(\vect x)\,\dd^3x = f(0) .\;} \label{eq:delta}$$

Here $\dd^3x = \dd x\,\dd y\,\dd z$ is the element of volume, and $\delta^3$ is measured in $\mathrm{m^{-3}}$, so that
the integral has the unit of $f$. The density of a point mass $\matter M$ at the point $\vect x_0$ is
$\matter\rho(\vect x) = \matter M\,\delta^3(\vect x - \vect x_0)$. With $f = 1$ the rule gives the total mass
$\matter M$, and over any region that does not contain $\vect x_0$ it gives zero, which is what a point mass means.

The delta function is not a function. It is a **distribution**: a rule that turns each smooth function into a number,
in the way that integrating against an ordinary density does, and in this tutorial it always appears inside an
integral.

An example shows how ordinary functions approach it. Spread the mass of a point as a cloud whose density follows a
narrow Gaussian of width $\varepsilon$,

$$\delta_\varepsilon(\vect x) = \frac{1}{(2\pi\varepsilon^2)^{3/2}}\,e^{-r^2/2\varepsilon^2}.$$

Its integral is 1 for every width, because it is the product of three one-dimensional Gaussians, each of area 1. As
$\varepsilon$ shrinks, almost all of its area lies within a few $\varepsilon$ of the origin, where a smooth $f$ is
close to $f(0)$, so $\int\delta_\varepsilon f\,\dd^3x$ tends to $f(0)$. A non-example is a spike of fixed height 1 that
grows narrower, whose integral tends to zero. What makes a delta function is its area, one, and not its height.

The delta function lets us finish the point mass. We want $\nabla^2(1/r)$, including the point $r = 0$. Away from the
origin it is zero, by the last section. At the origin the field is infinite, so the divergence theorem cannot be used
across it. We do not need it there, because the proof of Gauss's law with solid angles asked the field to be finite
only on the surface. The gradient of $1/r$ is $-\hat{\vect x}/r^2$ (chapter 1.2), the field of a point mass divided
by $G\matter M$, so by Gauss's law its flux out of any closed surface is

$$\oint_S \nabla\frac{1}{r}\cdot\dd\vect A = \begin{cases} -4\pi & \text{(origin inside)},\\ 0 & \text{(origin outside)}.\end{cases}$$

If the divergence theorem is to hold for every region, the integral of $\nabla^2(1/r)$ over a region must therefore be
$-4\pi$ when the region contains the origin and zero when it does not. That is the behaviour of $-4\pi$ times the
delta function:

$$\boxed{\;\nabla^2\frac{1}{r} = -4\pi\,\delta^3(\vect x) .\;} \label{eq:laplacian-point}$$

For a point mass, $\field\Phi = -G\matter M/r$ then gives $\nabla^2\field\Phi = 4\pi G\matter M\,\delta^3(\vect x)$,
which is $4\pi G\matter\rho$ for the density $\matter M\,\delta^3(\vect x)$. Poisson's equation holds at the mass too.
By superposition, the potential of any body, chapter 1.2's integral over its pieces, then satisfies Poisson's equation
at every point; chapter 2.4 works this out.

::: gap
We gave $\nabla^2(1/r)$ a meaning at the origin by asking that the divergence theorem keep holding there. The precise
statement, which uses only smooth functions, is that $\int (1/r)\,\nabla^2 f\,\dd^3x = -4\pi f(0)$ for every smooth
$f$ that vanishes far away. Chapter 2.4 proves it with Green's second identity, which chapter 2.1 derives.
:::

## Outside a round body, only its mass counts

We can now answer the chapter's question. We want the field of a body whose density depends only on the distance from
its centre. Such a body is **spherically symmetric**: turning it by any rotation about its centre leaves it unchanged.
A uniform ball, a hollow shell of uniform thickness and an Earth made of layers like an onion are all spherically
symmetric. We put the centre at the origin and write $r$ for the distance from it.

Symmetry fixes the direction of the field first. Take a point $P$ and turn the body about the straight line through
the centre and $P$. Turning the body turns its field with it. The body is unchanged by this turn, and $P$ does not
move, so the field at $P$ must be the same vector after the turn as before. A vector that is unchanged by every
rotation about a line must lie along that line, so the field at $P$ points straight toward the centre or straight away
from it.

Symmetry fixes the size of the field next. A rotation about the centre can carry any point of a sphere of radius $r$
to any other point of the same sphere, and it leaves the body unchanged. So the field has the same size at every point
of the sphere, and we write $\vect g = g_r(r)\,\hat{\vect x}$, where $g_r$ is the outward component, negative when the
field points inward.

Now Gauss's law can be used. Take as the closed surface the sphere of radius $r$ centred on the body's centre. On it
$\vect g\cdot\dd\vect A = g_r(r)\,\dd A$ at every point, so the flux is $g_r(r) \times 4\pi r^2$. Gauss's law sets
this equal to $-4\pi G\matter M_{\mathrm{enc}}(r)$, where $\matter M_{\mathrm{enc}}(r)$ is the mass within the radius
$r$. Dividing by $4\pi r^2$,

$$\boxed{\;\vect g = -\frac{G\matter M_{\mathrm{enc}}(r)}{r^2}\,\hat{\vect x} .\;}$$

This is the **shell theorem**. The field at a distance $r$ from the centre of a round body is the field of a point
mass at the centre, whose mass is all the mass nearer to the centre than $r$. The mass farther out does not count.
The unit is $\mathrm{m\,s^{-2}}$, as in [](#eq:point-field).

Outside the body, $\matter M_{\mathrm{enc}}$ is the whole mass $\matter M$, so the field is
$-G\matter M\hat{\vect x}/r^2$, the field of a point mass. A solid steel ball and a hollow steel shell of the same mass
therefore have the same field at every point outside both. This answers the guiding question. Gauss's law counts only
the mass inside a sphere, and symmetry spreads that count evenly over the sphere, so nothing about the arrangement of
the mass can reach the field outside.

Inside a hollow shell, every sphere centred on the shell's centre and drawn within the hollow encloses no mass. With
$\matter M_{\mathrm{enc}}(r) = 0$, the shell theorem makes the field zero at every point of the hollow. The shell's
mass has not gone away: every part of it pulls, and the pulls from all sides cancel exactly. Because the field is zero
throughout the hollow, it does not change from one point to the next, so the shell raises no tide anywhere inside it.

::: try {#shell-theorem}
Moving the mass outward, does the pull at twice the radius change? Make your guess before you touch anything. The
figure opens at a uniform ball of fixed mass and plots its pull against the distance from the centre, out to three
radii. Press Shell to move all the mass to the surface, then drag the slider to gather it toward the centre, which
answers the figure's own two predictions. Watch the curve outside the body, the reading of the pull at $2R$, and the
moment of inertia read out below them, the quantity of the next section.
:::

Inside a uniform ball of radius $R$ and density $\matter\rho$, the mass within the radius $r$ is
$\tfrac43\pi r^3\matter\rho$, so the shell theorem gives

$$g_r = -\frac{G}{r^2}\,\frac{4\pi r^3\matter\rho}{3} = -\frac{4\pi}{3}G\matter\rho\,r ,$$

a pull toward the centre that grows in proportion to the distance from it. This is the field $-k\vect x$ of the
section on divergence, with $k = \tfrac43\pi G\matter\rho$, and its divergence $-3k = -4\pi G\matter\rho$ agrees with
Poisson's equation. Two limits check it. At the centre the pull is zero, because the matter around the centre pulls
equally in every direction. At the surface it is $\tfrac43\pi G\matter\rho R = G\matter M/R^2$, the field outside, so
the two formulas agree where they meet.

The shell theorem weighs the Earth from its surface. On the ground the pull is $g = G\matter M/R^2 =
9.82\unit{m\,s^{-2}}$, and the Earth's radius is $R = 6371\unit{km}$.[^spin] The mass is $\matter M = gR^2/G =
5.97 \times 10^{24}\unit{kg}$, and dividing it by the volume $\tfrac43\pi R^3$ gives the **mean density**,

$$\begin{aligned}
\sym{mean-density}{\matter{\bar\rho}} = \frac{3g}{4\pi GR} &= \frac{3 \times 9.82}{4\pi \times 6.674 \times 10^{-11} \times 6.371 \times 10^6}\\
&= 5510\unit{kg\,m^{-3}}.
\end{aligned}$$

The unit is that of $g/GR$: $\mathrm{m\,s^{-2}}$ divided by $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{m}$, which is
$\mathrm{kg\,m^{-3}}$. With the mass known to four figures, $5.972 \times 10^{24}\unit{kg}$, the mean density is
$5513\unit{kg\,m^{-3}}$, the paper's value. It is twice the density of granite, $2700\unit{kg\,m^{-3}}$, the kind of
rock found at the surface, so the inside of the Earth must be much denser than its surface.

## The outside of the Earth cannot tell a core from a uniform ball

The shell theorem is the paper's first impossibility result: two different scenes that a camera outside cannot tell
apart. We build the two scenes explicitly.

The first Earth is a uniform ball of radius 6371 km and density $5513\unit{kg\,m^{-3}}$. The second has an iron core
of radius 3480 km and density $12{,}500\unit{kg\,m^{-3}}$, inside a rock mantle of density $4150\unit{kg\,m^{-3}}$.
These densities, rounded to three figures, give the second Earth the same mass as the first to within 0.05 per cent,
and the paper's [Section IV](/paper/#sec:near-field) uses the same two-layer Earth. Both Earths are round and have the
same mass, so by the shell theorem both fields are $-G\matter M\hat{\vect x}/r^2$ at every point outside. So are the
potentials and the tides outside, which are built from the field, and no steady reading taken outside the Earth, at
any sensitivity, can tell the two apart.

Inside they differ. In the uniform Earth the pull at 3480 km from the centre is $5.4\unit{m\,s^{-2}}$. In the second
Earth the core alone pulls at its own surface with $\tfrac43\pi G\matter\rho_{\mathrm{core}} \times 3480\unit{km} =
12.2\unit{m\,s^{-2}}$, more than at the ground.

Bodies that are not round can also share one field outside, although the shell theorem cannot prove it. The figure
below, from the paper, shows three steel balls of the same size, each holding the same extra mass of gold.

{{paper fig:same-outside}}

In (a) the gold is a small nugget, halfway from the centre to the wall. In (b) the same mass of gold is spread through
the ball, densest at the wall nearest the nugget: this is the picture that assumes the least, the one a camera outside
would draw from the field alone. In (c) the gold is spread over the surface as a thin skin. The blue curves are
equipotentials of the gold's share of the field, the surfaces of equal potential of chapter 1.2, cut through the
middle. They are the same in all three, so the pull at every point outside is the same too. The nugget is off the
centre, so this case lies beyond the shell theorem, and chapter 2.5 proves it.

Something else must tell the two Earths apart, and the paper names it: the **moment of inertia**, which measures how
hard it is to set a body spinning. It is the sum of each piece's mass times the square of its distance from the axis.
It is $0.400\,\matter MR^2$ for the uniform ball and $0.331\,\matter MR^2$ for the second Earth, whose mass lies
nearer the centre; the second is the value measured for the real Earth, and the paper problem below checks it. The
paper's [Section II](/paper/#sec:pixel) shows that one pixel on the ground reads this number from the magnetic part of
the tide of the spinning Earth.

## A uniform sheet pulls equally at every height

Gauss's law gives one more field that the tutorial needs, that of a flat sheet. A thin flat layer of matter is
described by its **surface density** $\sym{surface-density}{\matter{\sigma}}$, its mass per unit area, in kilograms per
square metre.[^sigma] We assume that **the sheet is flat, uniform and infinite**, and we take the $z$ axis
perpendicular to it, with the sheet at $z = 0$.

Sliding the sheet along itself, or turning it about the $z$ axis, leaves it unchanged, so the field cannot point along
the sheet and can depend only on the height $z$. Turning the sheet over leaves it unchanged too, so the field has the
same size at the heights $z$ and $-z$. Every piece of the sheet attracts, so on both sides the field points toward the
sheet.

For the closed surface we take a **pillbox**: a short cylinder that stands across the sheet, with flat ends of area $A$
at the heights $z$ and $-z$ (Figure [](#fig:pillbox)). The field runs along the curved side, so no flux crosses it.
On each flat end the field
points inward with some size $g$, so each end has the flux $-gA$. The mass inside is $\matter\sigma A$, and Gauss's law
[](#eq:gauss) gives $-2gA = -4\pi G\matter\sigma A$, so

$$\boxed{\;g = 2\pi G\matter\sigma, \quad\text{toward the sheet, at every height} .\;}$$

![A pillbox standing across a uniform sheet, with flat ends of area $A$ at the heights $z$ and $-z$ and the disc of
mass $\matter\sigma A$ (orange) inside it. The field has the same size everywhere and points toward the sheet: it
crosses both ends inward (blue) and runs along the curved side (grey), where no flux crosses.](tut-gauss-pillbox){#fig:pillbox}

The unit is $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{kg\,m^{-2}} = \mathrm{m\,s^{-2}}$. The height has dropped
out, and the solid angle shows why. A small patch of the sheet, of area $\dd A$, at a distance $s$ and seen at the
angle $\alpha$ from the perpendicular, pulls toward itself with $G\matter\sigma\,\dd A/s^2$. The part of that pull
perpendicular to the sheet is $G\matter\sigma\cos\alpha\,\dd A/s^2 = G\matter\sigma\,\dd\Omega$. So any flat sheet pulls
perpendicular to itself with $G\matter\sigma$ times the solid angle it covers, and an infinite sheet covers half the
sky, $2\pi$, from every height.

**A number.** The floor of the paper's locked-safe room is concrete 0.3 m thick, of density $2400\unit{kg\,m^{-3}}$, so
$\matter\sigma = 720\unit{kg\,m^{-2}}$. As an infinite sheet it would pull with

$$\begin{aligned}
2\pi G\matter\sigma &= 2\pi \times 6.674 \times 10^{-11} \times 720\unit{m\,s^{-2}}\\
&= 3.0 \times 10^{-7}\unit{m\,s^{-2}},
\end{aligned}$$

about sixty-five times the person's pull at a metre. This pull is the same at every height and points the same way,
so two free balls above the sheet feel the same pull, and the sheet raises no tide.

The infinite sheet is an approximation, and its small parameter is the height divided by the distance to the sheet's
edges. The real floor is 12 m by 14 m, and the camera is 1.5 m above it, 3 m from its near edge and 11 m from its far
one, so toward the near edge the small parameter is a half and the approximation is rough. From there the floor covers about 4.5 steradians instead of $2\pi = 6.3$, so it pulls down with
$2.2 \times 10^{-7}\unit{m\,s^{-2}}$, 72 per cent of $2\pi G\matter\sigma$.[^floor] Its edges also give it a tide, a
vertical stretch of $4.5 \times 10^{-8}\unit{s^{-2}}$, nearly five times the person's tide at a metre and about sixty
times the largest tide of the 324 kg of gold in the safe. The room is known, so its pull and its tide are computed and
subtracted, as Section IV says, and what remains is the gold.

Chapter 2.7 writes the potential of the sheet, whose
slope jumps by $4\pi G\matter\sigma$ across it, and uses that jump for sheets whose density varies.

::: check
### Q

What is the flux of gravity out of a closed box around the person of 70 kg? What is it out of a box beside the person
that does not enclose them?

### A

By Gauss's law it is $-4\pi G\matter M = -4\pi \times 6.674 \times 10^{-11} \times 70\unit{m^3\,s^{-2}} =
-5.9 \times 10^{-8}\unit{m^3\,s^{-2}}$, whatever the size and shape of the box. Out of a box that does not enclose the
person, the flux is zero.

### Q

Gauss's law holds for a cube as well as for a sphere. Why does it give the field of a round body but not the field of
a cube?

### A

The law gives only the total flux through a surface. Around a round body, symmetry makes the field equal in size and
perpendicular at every point of a sphere, so the total fixes the field at each point. No surface around a cube has
the field equal and perpendicular all over it, so the total flux does not say how the field is shared out.

### Q

What is $\nabla^2(r^2)$?

### A

The square of the distance is $r^2 = x^2 + y^2 + z^2$. Each of its three second derivatives along the axes is 2, so
$\nabla^2(r^2) = 6$.

### Q

A camera floats at the centre of a closed, hollow, round shell of rock. What tide does the shell raise at the camera?
What if the camera moves off the centre?

### A

None in either case. The field of the shell is zero everywhere in the hollow, so its difference between nearby points,
the tide, is zero too. Any tide the camera reads comes from matter inside the hollow or from outside the shell.
:::

**The idea to keep: the flux of gravity out of a closed surface counts the mass inside. At each point this is
Poisson's equation, $\nabla^2\field\Phi = 4\pi G\matter\rho$, and for a round body it means that the field outside
cannot tell how the mass is arranged.**

::: problems
### Practice

Inside a uniform ball of density $\matter\rho$ and radius $R$, the potential has the form $\field\Phi = c_2r^2 + c_0$,
with $c_2$ and $c_0$ constants. Find $c_2$ from Poisson's equation, and $c_0$ by matching the potential
$-G\matter M/R$ at the surface.

::: solution
By the third check question, $\nabla^2(c_2r^2) = 6c_2$, and the constant $c_0$ has no derivatives. Poisson's equation
gives $6c_2 = 4\pi G\matter\rho$, so $c_2 = 2\pi G\matter\rho/3 = G\matter M/2R^3$. At the surface,
$c_2R^2 + c_0 = G\matter M/2R + c_0$ must equal $-G\matter M/R$, so $c_0 = -3G\matter M/2R$. The potential at the
centre is one and a half times its value at the surface. As a check, the field $-\partial_r\field\Phi = -2c_2r =
-\tfrac43\pi G\matter\rho\,r$ is the field of the section on round bodies.
:::

### Stretch

A long straight rod along the $z$ axis has a mass $\matter\lambda$ per unit length, in kilograms per metre. Use
Gauss's law with a cylinder around the rod to find its field at a distance $r$. Then find its potential and the
diagonal entries $\partial_x^2\field\Phi$, $\partial_y^2\field\Phi$, $\partial_z^2\field\Phi$ of chapter 1.2's tidal
tensor at the point $(r, 0, 0)$. Evaluate the field and the largest entry for a steel rail of 60 kg per metre, 1 m
away.

::: solution
By symmetry the field points straight toward the rod and depends only on $r$. Take a cylinder of radius $r$ and length
$\ell$ around the rod. No flux crosses its flat ends, and through its curved side the flux is $-g \times 2\pi r\ell$.
The mass inside is $\matter\lambda\ell$, so $-2\pi r\ell g = -4\pi G\matter\lambda\ell$ and

$$g = \frac{2G\matter\lambda}{r},$$

which falls more slowly than the $1/r^2$ of a point. The potential is $\field\Phi = G\matter\lambda\ln(x^2 + y^2)$ plus
a constant, because its derivative along $r = \sqrt{x^2 + y^2}$ is $2G\matter\lambda/r$. Differentiating twice gives
$\partial_x^2\field\Phi = 2G\matter\lambda(y^2 - x^2)/r^4$ and $\partial_y^2\field\Phi = 2G\matter\lambda(x^2 - y^2)/r^4$,
so at $(r, 0, 0)$ the entries are $-2G\matter\lambda/r^2$, $+2G\matter\lambda/r^2$ and $0$. The negative entry, along
the line to the rod, is a stretch: the pull grows toward the rod, so two balls on that line drift apart. The trace is
zero, as it must be outside matter. For the rail the field is $2 \times 6.674 \times 10^{-11} \times 60/1 =
8.0 \times 10^{-9}\unit{m\,s^{-2}}$, and the stretch has the size $8.0 \times 10^{-9}\unit{s^{-2}}$, close to the
person's. Chapters 2.7 and 3.6 use rows of such rods.
:::

### The paper

The paper's [Section IV](/paper/#sec:near-field) says that a two-layer Earth with a core of radius 3480 km, the
Earth's mass and the moment of inertia $0.331\,\matter MR^2$ has a core of $12{,}500\unit{kg\,m^{-3}}$ and a mantle of
$4150\unit{kg\,m^{-3}}$. Check the mass and the moment of inertia, using $\matter M = 5.972 \times 10^{24}\unit{kg}$,
$R = 6371\unit{km}$, and the moment of inertia of a uniform ball of density $\matter\rho$ and radius $a$ about an axis
through its centre, $\tfrac{8\pi}{15}\matter\rho a^5$, which chapter 1.6 derives.

::: solution
Treat the second Earth as a uniform ball of $4150\unit{kg\,m^{-3}}$ and radius $R$, plus a ball of
$12{,}500 - 4150 = 8350\unit{kg\,m^{-3}}$ and radius $r_c = 3480\unit{km}$; masses and moments of inertia both add.
With $R^3 = 2.586 \times 10^{20}\unit{m^3}$ and $r_c^3 = 4.214 \times 10^{19}\unit{m^3}$, the mass is
$\tfrac43\pi(4150R^3 + 8350r_c^3) = 5.969 \times 10^{24}\unit{kg}$, the Earth's mass to 0.05 per cent. With
$R^5 = 1.050 \times 10^{34}\unit{m^5}$ and $r_c^5 = 5.10 \times 10^{32}\unit{m^5}$, the moment of inertia is
$\tfrac{8\pi}{15}(4150R^5 + 8350r_c^5) = 8.01 \times 10^{37}\unit{kg\,m^2}$, and dividing by $\matter MR^2$ gives
0.331. For a uniform ball the formula gives $\tfrac{8\pi}{15}\matter\rho R^5 \big/ \tfrac{4\pi}{3}\matter\rho R^5 =
\tfrac25$, the 0.400 of the text.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) uses Poisson's equation for the trace of the tide inside matter,
  $\mathrm{tr}\,\curv{\tE} = 4\pi G\matter\rho$, local information that a pixel in empty space does not see, and shows
  that one pixel on the ground reads the Earth's moment of inertia.
- [Section IV](/paper/#sec:near-field) opens with the shell theorem as the camera's first limit, and its paragraph
  "What the image cannot show" adds the densities that change nothing outside a body. Figure
  [](/paper/#fig:same-outside) shows three bodies with the same field outside.
- Equation [](/paper/#eq:split) splits every density into the part the outside sees and the part it cannot, a split
  that chapter 2.5 derives from Poisson's equation.
- Equation [](/paper/#eq:tidal-column) groups matter by the solid angle $\dd\Omega$ in which the camera sees it. Its
  integral starts a short distance from the camera, because matter at the camera itself would make the column $S$ grow
  without bound, although not the tide; chapter 2.3 treats matter at the camera's own place.
- Equation [](/paper/#eq:array-data) has a factor $k$, there the wavenumber of a ripple across the array (chapter 2.7)
  rather than the constant of this chapter. That factor makes a uniform sheet invisible, because the sheet's pull,
  $2\pi G\matter\sigma$, is the same at every height.
:::

::: deeper
- The [GR course, section 0.7](https://neovand.github.io/general-relativity/chapter-0.html#0-7-flux-and-divergence-with-a-box-before-a-theorem)
  derives flux and divergence with a box of flowing water before stating the theorem.
- The GR course's [lesson on Poisson's equation from a flux](https://neovand.github.io/general-relativity/chapter-12.html#poisson-from-a-flux)
  works through Gauss's law for a point mass, and its
  [section 12.4](https://neovand.github.io/general-relativity/chapter-12.html#12-4-deriving-the-newtonian-limit-including-the-factor-of-two)
  shows how Einstein's equation gives back Poisson's equation, with its factor $4\pi G$.
- The [homology course, section 4.3](https://neovand.github.io/homology/cohomology/differential-forms/) shows the
  divergence theorem as one case of a single theorem about the boundaries of regions, Stokes's theorem.
- David Griffiths, *Introduction to Electrodynamics* (Cambridge, 4th edition, 2017), chapters 1 and 2, treats the
  divergence theorem, the delta function and Gauss's law for electric charge, with many worked examples.
:::

::: history
### Newton's shells and the weight of the Earth

Newton proved the shell theorem in the *Principia* (1687) with geometry rather than flux: Propositions 70 and 71 of
Book I treat the shell, and Proposition 74 the solid ball. In Book III he guessed that the Earth's mean density was
five or six times that of water. Henry Cavendish weighed lead balls against each other with a torsion balance and
reported in 1798 a mean density 5.48 times that of water, within one per cent of the modern value. Joseph-Louis
Lagrange used a form of the divergence theorem in 1762, Carl Friedrich Gauss proved special cases in 1813, and Mikhail
Ostrogradsky gave the first general proof in 1826, published in 1831. Siméon Denis Poisson added the density to
Laplace's equation in 1813. Paul Dirac made the delta function a standard tool of physics in his *Principles of
Quantum Mechanics* (1930), and Laurent Schwartz gave it its exact meaning as a distribution in the late 1940s.
:::

[^nhat]: The paper, like chapter 1.2, writes $\hat n$ for the unit vector from the camera toward a source. For a
    camera at $\vect x$ looking at a mass at the origin, that is $-\hat{\vect x}$.

[^S]: The paper uses $S$ for the tidal column of its equation [](/paper/#eq:tidal-column). In this chapter $S$ is
    always a surface.

[^window]: A square of side $a$, seen face-on from a distance $d$ on the line through its centre, covers
    $4\arcsin\bigl(a^2/(a^2 + 4d^2)\bigr)$ steradians, which is $4\arcsin(1/5) = 0.81$ for $a = d = 1\unit{m}$.

[^omega]: Chapter 2.2 writes the solid angle in spherical coordinates. The paper also uses $\Omega$ for a rate of
    turning, such as the Earth's spin; the solid angle always appears as $\dd\Omega$ or with the word.

[^spin]: The value $9.82\unit{m\,s^{-2}}$ is $G\matter M/R^2$, the pull alone. The Earth's spin reduces the weight
    that a scale measures at the equator by about $0.03\unit{m\,s^{-2}}$, and chapter 1.6 explains why.

[^sigma]: Part 3 also uses $\sigma$ for the standard deviation of a noise. Each chapter says which it means.

[^floor]: Each thin horizontal layer of the floor pulls down with its surface density times $G$ times the solid angle
    of a rectangle seen from the camera, which has a closed form; the layers are added through the 0.3 m. The stretch
    is the change of this pull with height.
