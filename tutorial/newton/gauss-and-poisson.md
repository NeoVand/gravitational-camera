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
At any point outside both, they pull on a small body with exactly the same strength and direction, so no instrument
outside, however sensitive, can tell by the steady pull which one is there. Newton proved this in 1687, and it is the
first limit on a gravitational camera: the pull outside a body does not settle how its mass is arranged.[^limit] By its
steady pull alone, the Earth with its iron core cannot be told from a uniform ball of 5513 kilograms per cubic metre.

Why does a hollow shell pull outside it exactly as a solid ball of the same mass does? To answer, we turn Newton's
inverse-square law into a law about the flux of the field through a closed surface, Gauss's law, and then into a law at
every point, Poisson's equation, which section 1.4 and all of Part 2 use.

::: plain
Wrap a mass in a closed surface, ask at each small piece how much of the field passes through it, and add up the
answers. The total is the **flux**. For gravity it depends only on the mass inside, not on the surface's size or shape,
and mass outside adds nothing: this is **Gauss's law**. Applied to a tiny box around one point, it says that the way
the field gathers in there is set by the density of mass there, which is **Poisson's equation**.

A round body's field points at its centre and is equally strong all over any sphere around it, so Gauss's law fixes
the field outside from the total mass alone. Inside a hollow shell there is no pull at all.
:::

## Flux counts how much field crosses a surface

Here $\sym{gravitational-field}{\vect g}$ is the **gravitational field** of section 1.2: the pull of gravity on a small
body divided by the body's mass, an acceleration in metres per second squared. A point mass
$\sym{mass}{\matter{M}}$, in kilograms, at the origin makes the field

$$\vect g = -\frac{G\matter M}{r^2}\,\hat{\vect x}, \label{eq:point-field}$$

where $G = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is Newton's constant, $r$ is the distance from the mass,
and $\hat{\vect x} = \vect x/r$ is the unit vector that points from the mass outward to the point $\vect x$. This is
section 1.2's $-G\matter M\vect x/r^3$, and the minus sign points the field toward the mass.[^nhat]

We want one number that says how much of a field passes through a surface. Take first a small flat patch of area
$\Delta A$, and let $\Delta\vect A$ be the vector perpendicular to the patch on one chosen side, whose length is the
patch's area; its direction is the patch's **normal**. The **flux** of $\vect g$ through the patch is

$$\vect g\cdot\Delta\vect A ,$$

the part of the field perpendicular to the patch times the patch's area; the part along the patch does not cross it.

A curved surface $S$ is cut into many small, nearly flat patches, and its flux is the sum of theirs in the limit of
small patches. This **surface integral**, $\int_S \vect g\cdot\dd\vect A$, has the unit of an
acceleration times an area, $\mathrm{m^3\,s^{-2}}$, the unit of $G\matter M$.

A **closed surface** has no edge and encloses a region: a sphere, the six faces of a box, the skin of a potato. On it
we always choose the **outward normal**, so that flux leaving the region counts as positive and flux entering it as
negative, and write the integral $\oint_S$.

The simplest example is a sphere of radius $r$ centred on a point mass. The field points straight inward at every point
of the sphere, and $\dd\vect A$ points straight outward, so $\vect g\cdot\dd\vect A = -(G\matter M/r^2)\,\dd A$
everywhere on it. The sphere's area is $4\pi r^2$, so

$$\begin{aligned}
\oint_S \vect g\cdot\dd\vect A &= -\frac{G\matter M}{r^2}\times 4\pi r^2\\
&= -4\pi G\matter M.
\end{aligned} \label{eq:flux-sphere}$$

The radius has cancelled. For a person of 70 kg, the field 1 m away is $4.67 \times 10^{-9}\unit{m\,s^{-2}}$ and
the sphere's area is $12.6\unit{m^2}$, so the flux is $-5.9 \times 10^{-8}\unit{m^3\,s^{-2}}$, and at 2 m the same.

## Solid angle measures how large a patch looks

To handle a surface of any shape, we need to say how large a small tilted patch looks from the mass. An angle, in
radians, is the length of arc that it cuts from a circle of radius 1 centred on its corner. The **solid angle** of a
patch, seen from a point, is the area of its shadow on a sphere of radius 1 centred on the point, found by moving each
point of the patch straight toward the centre until it reaches that sphere. Its unit is the **steradian**, sr, a pure
number like the radian, because the shadow's area divided by $R^2$ is the same on a sphere of any radius $R$. The
whole sky covers $4\pi$ steradians.

The Moon, of radius 1737 km at 384,400 km, has an angular radius of $4.52 \times 10^{-3}$ radians, so its disc covers
$\pi(4.52 \times 10^{-3})^2 = 6.4 \times 10^{-5}\unit{sr}$, one part in 200,000 of the sky. A patch's area is not its
solid angle: a square window of one square metre, seen face-on from 1 m, covers 0.81 steradian.[^window]

Take a small patch of area $\dd A$ at a distance $r$ from the point, tilted so that its normal makes an angle $\alpha$
with the direction $\hat{\vect x}$ from the point to the patch. Only its cross-section perpendicular to the line of
sight, $\cos\alpha\,\dd A$, faces the point. Moving this cross-section in to the unit sphere shrinks each of its
lengths by the factor $1/r$, and so its area by $1/r^2$ (Figure [](#fig:solid-angle)). The solid angle of the patch is
therefore

$$\sym{solid-angle}{\dd\Omega} = \frac{\cos\alpha\,\dd A}{r^2} = \frac{\hat{\vect x}\cdot\dd\vect A}{r^2}.$$

![A flat patch of area $\dd A$ at the distance $r$ from the point $O$, its normal tilted by $\alpha$ from the line of
sight $\hat{\vect x}$. Moved along the thin cone toward $O$, it lands on the unit sphere as its shadow $\dd\Omega$
(orange); the dashed square is the cross-section $\cos\alpha\,\dd A$ that faces $O$.](tut-gauss-solid-angle){#fig:solid-angle}

We keep the sign of $\cos\alpha$: the solid angle is negative when the patch's normal points toward the
point.[^omega]

This is where the inverse-square law enters. By [](#eq:point-field), the flux of a point mass through the small patch
is

$$\vect g\cdot\dd\vect A = -\frac{G\matter M}{r^2}\,\hat{\vect x}\cdot\dd\vect A = -G\matter M\,\dd\Omega .$$

The flux through any patch is $-G\matter M$ times the solid angle that the patch covers: the $1/r^2$ of the field
cancels the $r^2$ by which a patch must grow to cover the same solid angle at a larger distance. A pull that fell as
$1/r^3$ would not have this property.

## The flux out of a closed surface counts the mass inside

We assume that **the masses are at rest**, so that the field is the Newtonian field of section 1.2, and that **no mass
lies on the surface**, so that the field is finite on it.

Start with one point mass inside the surface, and follow a thin cone of directions of solid angle $\dd\Omega$ out from
it. The cone crosses the surface at least once, and for a surface with folds it may cross out, back in, and out again.
Where the cone leaves the region the patch covers $+\dd\Omega$; where it enters, $-\dd\Omega$. The cone starts inside
and ends outside, so its crossings alternate and the first and last are outward. Every inward crossing therefore
cancels one outward crossing (Figure [](#fig:crossings)), and $+\dd\Omega$ is left. Adding over all the cones gives the solid
angle of the whole closed surface seen from inside it, $4\pi$, and the flux is $-G\matter M$ times this:

$$\oint_S \vect g\cdot\dd\vect A = -4\pi G\matter M \qquad \text{(mass inside)}.$$

![A closed surface $S$ with a fold, cut through its middle. The thin cone from the mass $\matter{m_1}$ inside crosses $S$
out, back in and out again, so its patches count $+\dd\Omega$, $-\dd\Omega$, $+\dd\Omega$; the cone from $\matter{m_2}$, outside
in the fold, enters and leaves, and its two patches cancel. Each arrow is the outward normal, orange where it points
away from the mass and blue where it points toward it.](tut-gauss-crossings){#fig:crossings}

If the mass is outside the surface, a cone from it either misses the region or enters and leaves it an equal number of
times. Its crossings cancel in pairs, so the total solid angle is zero, and so is the flux:

$$\oint_S \vect g\cdot\dd\vect A = 0 \qquad \text{(mass outside)}.$$

Fields add (section 1.2), so each point mass $\matter{m_a}$ inside adds $-4\pi G\matter{m_a}$ and each outside adds
nothing. For matter spread out with a **density** $\sym{density}{\matter{\rho}}$, its mass per unit volume in
kilograms per cubic metre, the sum becomes an integral over the volume:

$$\boxed{\;\begin{gathered}
\oint_S \vect g\cdot\dd\vect A = -4\pi G\,\sym{enclosed-mass}{\matter{M}_{\mathrm{enc}}},\\
\matter{M}_{\mathrm{enc}} = \int_V \matter\rho\,\dd V ,
\end{gathered}\;} \label{eq:gauss}$$

where $V$ is the region inside $S$ and $\matter{M}_{\mathrm{enc}}$, the **enclosed mass**, is the mass in that region.
This is **Gauss's law** for gravity. Both sides are in $\mathrm{m^3\,s^{-2}}$, and for a sphere around a single mass it
gives back [](#eq:flux-sphere).

So the flux out of any closed surface around the person is $-5.9 \times 10^{-8}\unit{m^3\,s^{-2}}$, whether the surface
is a box or a potato skin, and wherever inside it the person stands. It does not give the field at each point, because
many fields have the same flux; for a round body the missing fact is symmetry.

## Divergence is the outflow per unit volume

To get a law about a single point, we apply Gauss's law to a very small box. We write the axes as $x$, $y$ and $z$,
which are section 1.1's $x_1$, $x_2$ and $x_3$. Take a box with one corner at the point $(x, y, z)$ and sides
$\Delta x$, $\Delta y$, $\Delta z$ along the axes. Look first at its two faces perpendicular to the $x$ axis, each of
area $\Delta y\,\Delta z$. On the face at $x + \Delta x$ the outward normal points along $+x$, so the flux through it
is $g_x(x + \Delta x)\,\Delta y\,\Delta z$, where $g_x$ is the $x$ component of the field and we write only the
coordinate that changes. On the face at $x$ the outward normal points along $-x$, so the flux is
$-g_x(x)\,\Delta y\,\Delta z$. By the first-order Taylor expansion of section 1.2, the two faces (Figure
[](#fig:box)) together give

$$\begin{aligned}
&\bigl[g_x(x + \Delta x) - g_x(x)\bigr]\,\Delta y\,\Delta z\\
&\qquad\approx \partial_x g_x\;\Delta x\,\Delta y\,\Delta z .
\end{aligned}$$

![A small box with one corner at $(x, y, z)$. The field $g_x(x)$ enters through the blue face at $x$, whose outward
normal points along $-x$, and the longer $g_x(x + \Delta x)$ leaves through the orange face at $x + \Delta x$, whose
outward normal points along $+x$; the arrows' lengths are schematic.](tut-gauss-box){#fig:box}

The other two pairs of faces give the same with $y$ and $z$ in place of $x$. With
$\Delta V = \Delta x\,\Delta y\,\Delta z$ the volume of the box, the total is

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

The repeated index $i$ is summed (section 1.1). The divergence is in $\mathrm{s^{-2}}$, the field's unit divided by a
length; it is positive where more field leaves a small region than enters it, and negative where more enters.

An example is a field that points toward the origin and grows in proportion to the distance, $\vect g = -k\,\vect x$,
with $k$ a constant in $\mathrm{s^{-2}}$. Its components are $g_i = -k x_i$, and $\partial_i x_i = 1 + 1 + 1 = 3$, so
$\nabla\cdot\vect g = -3k$ at every point. This is the field inside a uniform ball, as the section on round bodies
shows.

A non-example: the arrows of a point mass all converge, which looks like an inflow at every point, yet away from the
mass the divergence is zero. Take a small
box shaped like a piece of a cone from the mass, between the distances $r$ and $r + \Delta r$, covering the small solid
angle $\Delta\Omega$. Its side faces run along the field, so no field crosses them. Its inner face has area
$r^2\Delta\Omega$ and its outer face $(r + \Delta r)^2\Delta\Omega$, so the field enters through the outer face with
the flux $-G\matter M\,\Delta\Omega$ and leaves through the inner face with $+G\matter M\,\Delta\Omega$. The two
cancel: the field is stronger on the inner face, and that face is smaller, by exactly the same factor (Figure
[](#fig:cone-box)).

![A box cut from a cone of directions from the mass $\matter M$. The field enters through the outer face (blue) and leaves
through the inner face (orange); the inner arrow is longer by $(r + \Delta r)^2/r^2$ and the inner face is smaller by
the same factor, as drawn, so the two fluxes cancel.](tut-gauss-cone-box){#fig:cone-box}

## The divergence theorem adds up the boxes

We fill a whole region $V$ with small boxes and add up their outflows, each the divergence times the volume of the
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
The argument skips two points: the boxes make a staircase near a curved surface, and each used a first-order
expansion. The full proof shows both errors vanish as the boxes shrink, for a surface made of smooth pieces and a field with
continuous first derivatives. It fails where the field is infinite inside, as at a point mass, which the delta function
handles.
:::

## Poisson's equation is Gauss's law at every point

We assume that **the density changes smoothly** from point to point, so that the field is smooth and the divergence
theorem applies. For any region $V$, Gauss's law [](#eq:gauss) gives the flux out of its surface, and the divergence
theorem [](#eq:div-theorem) writes the same flux as an integral over $V$. Moving everything to one side,

$$\int_V \bigl(\nabla\cdot\vect g + 4\pi G\matter\rho\bigr)\,\dd V = 0$$

for every region $V$. If the bracket were positive at some point, being continuous it would be positive in a small ball around it, and its
integral over that ball would be positive, a contradiction; a negative value fails likewise. So the bracket is zero at
every point, and $\nabla\cdot\vect g = -4\pi G\matter\rho$.

Now we use the potential. Here $\sym{potential}{\field{\Phi}}$ is the gravitational potential of section 1.2, the
energy per unit mass that a small body has because of where it is, in joules per kilogram, and the field is
$g_i = -\partial_i\field\Phi$. So $\nabla\cdot\vect g = -\partial_i\partial_i\field\Phi$. The sum of the three second
derivatives along the axes is the **Laplacian**,

$$\begin{aligned}
\nabla^2\field\Phi &= \partial_i\partial_i\field\Phi\\
&= \frac{\partial^2\field\Phi}{\partial x^2} + \frac{\partial^2\field\Phi}{\partial y^2} + \frac{\partial^2\field\Phi}{\partial z^2},
\end{aligned}$$

the divergence of the gradient. With it, the last equation becomes

$$\boxed{\;\nabla^2\field\Phi = 4\pi G\matter\rho .\;} \label{eq:poisson}$$

This is **Poisson's equation**. Both sides are in $\mathrm{s^{-2}}$: the potential is in $\mathrm{m^2\,s^{-2}}$ and each
derivative divides by a metre, while $G\matter\rho$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times $\mathrm{kg\,m^{-3}}$.

In **empty space**, which has no matter in it, Poisson's equation becomes **Laplace's equation**,
$\nabla^2\field\Phi = 0$ (section 2.1), and the space between a scene and the camera is empty. The potential of a point
mass, $-G\matter M/r$, passes this test away from the mass, because the cone-shaped box showed that the divergence is
zero there.

Poisson's equation is also a statement about the tide. The sum of the diagonal entries of the tidal tensor
$\sym{tidal-tensor}{\curv{\tE}}_{ij} = \partial_i\partial_j\field\Phi$ of section 1.2, its **trace**, is
$\curv{\tE}_{ii} = \nabla^2\field\Phi = 4\pi G\matter\rho$, which measures the density at that point and nothing
else. In water, of density $1000\unit{kg\,m^{-3}}$, it is $8.4 \times 10^{-7}\unit{s^{-2}}$, about ninety times the
person's largest tide at a metre, $9.3 \times 10^{-9}\unit{s^{-2}}$ (section 1.4). In empty space it is zero, however
much matter lies nearby.

## A point mass is density gathered at one point

A point mass has no density in the ordinary sense: its density is zero everywhere except at one point, where it would
have to be infinite, yet Gauss's law for a point mass is perfectly finite. We describe such a density by what it does
inside an integral. The **delta function** in one dimension, $\delta(z)$, is defined by the rule

$$\int \delta(z)\,f(z)\,\dd z = f(0)$$

for every smooth function $f$. In three dimensions $\sym{delta-function}{\delta^3}(\vect x) =
\delta(x)\,\delta(y)\,\delta(z)$. In the integral of $\delta(x)\,\delta(y)\,\delta(z)\,f(x, y, z)$, the integral over
$x$ replaces $f$ by $f(0, y, z)$, the integral over $y$ then replaces it by $f(0, 0, z)$, and the integral over $z$
leaves $f(0, 0, 0)$:

$$\boxed{\;\int \delta^3(\vect x)\,f(\vect x)\,\dd^3x = f(0) .\;} \label{eq:delta}$$

Here $\dd^3x = \dd x\,\dd y\,\dd z$, and $\delta^3$ is in $\mathrm{m^{-3}}$, so that the integral has the unit of $f$.
The density of a point mass $\matter M$ at $\vect x_0$ is $\matter\rho(\vect x) = \matter M\,\delta^3(\vect x - \vect x_0)$:
with $f = 1$ the rule gives the total mass $\matter M$, and over any region not containing $\vect x_0$ it gives zero.

The delta function is not a function but a **distribution**: a rule that turns each smooth function into a number, as
integrating against an ordinary density does, and it appears only inside an integral. Ordinary functions approach it.
Spread the mass of a point as a cloud whose density follows a narrow Gaussian of width $\varepsilon$,

$$\delta_\varepsilon(\vect x) = \frac{1}{(2\pi\varepsilon^2)^{3/2}}\,e^{-r^2/2\varepsilon^2}.$$

Its integral is 1 for every width, being the product of three one-dimensional Gaussians, each of area 1. As
$\varepsilon$ shrinks, almost all of its area lies near the origin, where a smooth $f$ is close to $f(0)$, so
$\int\delta_\varepsilon f\,\dd^3x$ tends to $f(0)$. A spike of fixed height 1 that grows narrower is a non-example,
since its integral tends to zero: a delta function is defined by its area, one, and not its height.

We want $\nabla^2(1/r)$, including the point $r = 0$. Away from the origin it is zero. At the origin the field is
infinite, so the divergence theorem cannot be used across it, but the proof of Gauss's law with solid angles asked the
field to be finite only on the surface. The gradient of $1/r$ is
$-\hat{\vect x}/r^2$ (section 1.2), the field of a point mass divided by $G\matter M$, so by Gauss's law its flux out of
any closed surface is

$$\oint_S \nabla\frac{1}{r}\cdot\dd\vect A = \begin{cases} -4\pi & \text{(origin inside)},\\ 0 & \text{(origin outside)}.\end{cases}$$

If the divergence theorem is to hold for every region, the integral of $\nabla^2(1/r)$ over a region must therefore be
$-4\pi$ when the region contains the origin and zero when it does not. That is the behaviour of $-4\pi$ times the delta
function:

$$\boxed{\;\nabla^2\frac{1}{r} = -4\pi\,\delta^3(\vect x) .\;} \label{eq:laplacian-point}$$

For a point mass, $\field\Phi = -G\matter M/r$ then gives $\nabla^2\field\Phi = 4\pi G\matter M\,\delta^3(\vect x)
= 4\pi G\matter\rho$, so Poisson's equation holds at the mass too, and by superposition the potential of any body
satisfies it at every point (section 2.4).

::: gap
We gave $\nabla^2(1/r)$ a meaning at the origin by asking that the divergence theorem keep holding. The precise
statement is that $\int (1/r)\,\nabla^2 f\,\dd^3x = -4\pi f(0)$ for every smooth
$f$ that vanishes far away. Section 2.4 proves it with Green's second identity, which section 2.1 derives.
:::

## Outside a round body, only its mass counts

We want the field of a body whose density depends only on the distance from its centre. Such a body is **spherically
symmetric**: any rotation about its centre leaves it unchanged, as for a uniform ball, a hollow shell or an Earth made
of layers like an onion. We put the centre at the origin and
write $r$ for the distance from it.

Symmetry fixes the direction of the field first. Turn the body about the straight line through the centre and a point
$P$. The body is unchanged and $P$ does not move, so the field at $P$ is the same vector after the turn as before. A
vector unchanged by every rotation about a line lies along that line, so the field at $P$ points straight toward or
away from the centre. Symmetry fixes the size next: a rotation about the centre carries any point of a sphere of
radius $r$ to any other and leaves the body unchanged, so the field has the same size everywhere on the sphere. We
write $\vect g = g_r(r)\,\hat{\vect x}$, where $g_r$ is the outward component, negative when the field
points inward.

Now Gauss's law can be used. Take as the closed surface the sphere of radius $r$ centred on the body's centre. On it
$\vect g\cdot\dd\vect A = g_r(r)\,\dd A$ at every point, so the flux is $g_r(r) \times 4\pi r^2$. Gauss's law sets this
equal to $-4\pi G\matter M_{\mathrm{enc}}(r)$, where $\matter M_{\mathrm{enc}}(r)$ is the mass within the radius $r$.
Dividing by $4\pi r^2$,

$$\boxed{\;\vect g = -\frac{G\matter M_{\mathrm{enc}}(r)}{r^2}\,\hat{\vect x} .\;}$$

This is the **shell theorem**: the field at a distance $r$ from the centre of a round body is the field of a point mass
at the centre, whose mass is all the mass nearer to the centre than $r$. The mass farther out does not count. The unit
is $\mathrm{m\,s^{-2}}$, as in [](#eq:point-field).

Outside the body, $\matter M_{\mathrm{enc}}$ is the whole mass $\matter M$, so the field is that of a point mass. A solid
steel ball and a hollow steel shell of the same mass therefore have the same field at every point outside both: Gauss's
law counts only the mass inside a sphere, and symmetry spreads that count evenly over the sphere, so nothing about the
arrangement of the mass can reach the field outside.

Inside a hollow shell, every sphere centred on the shell's centre and drawn within the hollow encloses no mass. With
$\matter M_{\mathrm{enc}}(r) = 0$, the field is zero at every point of the hollow. Every part of the shell still pulls, and
the pulls from all sides cancel exactly. A field that is zero throughout the hollow does not change from point to
point, so the shell raises no tide anywhere inside it.

::: try {#shell-theorem}
Moving the mass outward, does the pull at twice the radius change? Guess before you touch anything. The figure plots
the pull of a uniform ball against the distance from its centre. Press Shell to move all the mass to the surface, then
drag the slider to gather it toward the centre. Watch the curve outside the body, the pull at $2R$, and the moment of
inertia of the last section.
:::

Inside a uniform ball of radius $R$ and density $\matter\rho$, the mass within the radius $r$ is
$\tfrac43\pi r^3\matter\rho$, so the shell theorem gives

$$g_r = -\frac{G}{r^2}\,\frac{4\pi r^3\matter\rho}{3} = -\frac{4\pi}{3}G\matter\rho\,r ,$$

a pull toward the centre that grows in proportion to the distance from it. This is the field $-k\vect x$ of the section
on divergence, with $k = \tfrac43\pi G\matter\rho$, and its divergence $-3k = -4\pi G\matter\rho$ agrees with
Poisson's equation. At the centre the pull is zero, and at the surface it is
$\tfrac43\pi G\matter\rho R = G\matter M/R^2$, the field outside, so the formulas agree where they meet.

The shell theorem weighs the Earth. On the ground the pull is $g = G\matter M/R^2 =
9.82\unit{m\,s^{-2}}$, and the Earth's radius is $R = 6371\unit{km}$.[^spin] The mass is $\matter M = gR^2/G =
5.97 \times 10^{24}\unit{kg}$, and dividing it by the volume $\tfrac43\pi R^3$ gives the **mean density**,

$$\begin{aligned}
\sym{mean-density}{\matter{\bar\rho}} = \frac{3g}{4\pi GR} &= \frac{3 \times 9.82}{4\pi \times 6.674 \times 10^{-11} \times 6.371 \times 10^6}\\
&= 5510\unit{kg\,m^{-3}}.
\end{aligned}$$

The unit is that of $g/GR$, $\mathrm{m\,s^{-2}}$ divided by $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{m}$, which is
$\mathrm{kg\,m^{-3}}$. With the mass to four figures, $5.972 \times 10^{24}\unit{kg}$, it is $5513\unit{kg\,m^{-3}}$,
twice the density of granite ($2700\unit{kg\,m^{-3}}$), so the inside of the Earth is much denser than its surface.

## The outside of the Earth cannot tell a core from a uniform ball

Take two Earths. The first is a uniform ball of radius 6371 km and density $5513\unit{kg\,m^{-3}}$. The second has an
iron core of radius 3480 km and density $12{,}500\unit{kg\,m^{-3}}$ inside a rock mantle of density
$4150\unit{kg\,m^{-3}}$, which gives it the same mass to within 0.05 per cent. Both are round, so by the shell theorem
both fields are $-G\matter M\hat{\vect x}/r^2$ outside, and so are the potentials and tides built from them: no steady
reading taken outside, at any sensitivity, can tell the two apart.[^same]

Inside they differ. At 3480 km from the centre the pull is $5.4\unit{m\,s^{-2}}$ in the uniform Earth, but in the
second Earth the core alone pulls at its surface with $\tfrac43\pi G\matter\rho_{\mathrm{core}} \times 3480\unit{km} =
12.2\unit{m\,s^{-2}}$, more than at the ground.

Bodies that are not round can also share one field outside, although the shell theorem cannot prove it. The figure
below shows three steel balls of the same size, each holding the same extra mass of gold.

{{paper fig:same-outside}}

In (a) the gold is a small nugget, halfway from the centre to the wall; in (b) it is spread through the ball, densest
at the wall nearest the nugget; in (c) it is a thin skin over the surface. The blue curves are equipotentials of the
gold's share of the field, cut through the middle. They are the same in all three, so the pull at every point outside
is the same too. The nugget is off the centre, so this case lies beyond the shell theorem; section 2.5 proves it.

The two Earths differ in their **moment of inertia**, which measures how hard it is to set a body spinning: the sum of
each piece's mass times the square of its distance from the axis. It is $0.400\,\matter MR^2$ for the uniform ball and
$0.331\,\matter MR^2$ for the second Earth, whose mass lies nearer the centre; the second is the value measured for the
real Earth (the last exercise checks it). A single pixel on the ground reads this number from the magnetic part of the
tide of the spinning Earth.

## A uniform sheet pulls equally at every height

Gauss's law gives one more field the book needs, that of a flat sheet. A thin layer of matter has a **surface density** $\sym{surface-density}{\matter{\sigma}}$, its mass per unit area in kilograms per square
metre.[^sigma] We assume that **the sheet is flat, uniform and infinite**, and we take the $z$ axis perpendicular to
it, with the sheet at $z = 0$.

Sliding the sheet along itself, or turning it about the $z$ axis, leaves it unchanged, so the field cannot point along
the sheet and depends only on the height $z$. Turning the sheet over leaves it unchanged too, so the field has the same
size at $z$ and $-z$, and on both sides it points toward the sheet.

For the closed surface we take a **pillbox**: a short cylinder that stands across the sheet, with flat ends of area $A$
at the heights $z$ and $-z$ (Figure [](#fig:pillbox)). The field runs along the curved side, so no flux crosses it. On
each flat end the field points inward with some size $g$, so each end has the flux $-gA$. The mass inside is
$\matter\sigma A$, and Gauss's law [](#eq:gauss) gives $-2gA = -4\pi G\matter\sigma A$, so

$$\boxed{\;g = 2\pi G\matter\sigma, \quad\text{toward the sheet, at every height} .\;}$$

![A pillbox standing across a uniform sheet, with flat ends of area $A$ at the heights $z$ and $-z$ and the disc of
mass $\matter\sigma A$ (orange) inside it. The field has the same size everywhere and points toward the sheet: it
crosses both ends inward (blue) and runs along the curved side (grey), where no flux crosses.](tut-gauss-pillbox){#fig:pillbox}

The unit is $\mathrm{m^3\,kg^{-1}\,s^{-2}} \times \mathrm{kg\,m^{-2}} = \mathrm{m\,s^{-2}}$. The height has dropped
out, and the solid angle shows why. A small patch of the sheet, of area $\dd A$, at a distance $s$ and seen at the
angle $\alpha$ from the perpendicular, pulls toward itself with $G\matter\sigma\,\dd A/s^2$. The part of that pull
perpendicular to the sheet is $G\matter\sigma\cos\alpha\,\dd A/s^2 = G\matter\sigma\,\dd\Omega$. So any flat sheet pulls
perpendicular to itself with $G\matter\sigma$ times the solid angle it covers, and an infinite sheet covers half the
sky, $2\pi$, from every height.[^sheet]

A number: the camera's room has a concrete floor 0.3 m thick, of density $2400\unit{kg\,m^{-3}}$, so
$\matter\sigma = 720\unit{kg\,m^{-2}}$. As an infinite sheet it would pull with

$$\begin{aligned}
2\pi G\matter\sigma &= 2\pi \times 6.674 \times 10^{-11} \times 720\unit{m\,s^{-2}}\\
&= 3.0 \times 10^{-7}\unit{m\,s^{-2}},
\end{aligned}$$

about sixty-five times the person's pull at a metre. The pull is the same at every height, so two free balls above the
sheet feel the same pull, and the sheet raises no tide.

The infinite sheet is an approximation whose small parameter is the height divided by the distance to the sheet's
edges. The real floor is 12 m by 14 m, and the camera is 1.5 m above it, 3 m from its near edge and 11 m from its far
one, so toward the near edge the parameter is a half and the approximation is rough. The floor covers about 4.5
steradians instead of $2\pi = 6.3$, so it pulls down with $2.2 \times 10^{-7}\unit{m\,s^{-2}}$, 72 per cent of
$2\pi G\matter\sigma$.[^floor] Its edges also give it a tide, a vertical stretch of $4.5 \times 10^{-8}\unit{s^{-2}}$,
nearly five times the person's tide at a metre and about sixty times the largest tide of the 324 kg of gold in the
room's safe. The room is known, so its pull and tide are computed and subtracted, and what remains is the gold.
Section 2.7 writes the potential of the sheet, whose slope jumps by $4\pi G\matter\sigma$ across it.

**The idea to keep: the flux of gravity out of a closed surface counts the mass inside. At each point this is
Poisson's equation, $\nabla^2\field\Phi = 4\pi G\matter\rho$, and for a round body it means that the field outside
cannot tell how the mass is arranged.**

::: problems
### Practice

**[1.3]** What is the flux of gravity out of a closed box around the person of 70 kg? What is it out of a box beside
the person that does not enclose them?

::: solution
$-4\pi G\matter M = -5.9 \times 10^{-8}\unit{m^3\,s^{-2}}$, whatever the box's size and shape; out of a box that
does not enclose the person it is zero.
:::

**[1.3]** Gauss's law holds for a cube as well as for a sphere. Why does it give the field of a round body but not the
field of a cube?

::: solution
The law gives only the total flux. Around a round body, symmetry makes the field equal and perpendicular all over a
sphere, so the total fixes it at each point. No surface around a cube has that property, so the total does not say how
the field is shared out.
:::

**[1.3]** A camera floats at the centre of a closed, hollow, round shell of rock. What tide does the shell raise at
the camera? What if the camera moves off the centre?

::: solution
None in either case: the field is zero everywhere in the hollow, so its difference between nearby points is zero.
:::

**[1.3]** Inside a uniform ball of density $\matter\rho$ and radius $R$, the potential has the form
$\field\Phi = c_2r^2 + c_0$, with $c_2$ and $c_0$ constants. Find $c_2$ from Poisson's equation, and $c_0$ by matching
the potential $-G\matter M/R$ at the surface.

::: solution
Each of the three second derivatives of $r^2 = x^2 + y^2 + z^2$ is 2, so $\nabla^2(c_2r^2) = 6c_2$, and Poisson's
equation gives $c_2 = 2\pi G\matter\rho/3 = G\matter M/2R^3$. At the surface $G\matter M/2R + c_0 = -G\matter M/R$, so
$c_0 = -3G\matter M/2R$, and the potential at the centre is one and a half times its surface value. Check: the field
$-2c_2r = -\tfrac43\pi G\matter\rho\,r$ is that of the section on round bodies.
:::

### Stretch

**[1.3]** A long straight rod along the $z$ axis has a mass $\matter\lambda$ per unit length, in kilograms per metre.
Use Gauss's law with a cylinder around the rod to find its field at a distance $r$. Then find its potential and the
diagonal entries $\partial_x^2\field\Phi$, $\partial_y^2\field\Phi$, $\partial_z^2\field\Phi$ of section 1.2's tidal
tensor at the point $(r, 0, 0)$. Evaluate the field and the largest entry for a steel rail of 60 kg per metre, 1 m
away.

::: solution
By symmetry the field points toward the rod and depends only on $r$. Take a cylinder of radius $r$ and length $\ell$
around the rod: no flux crosses its flat ends, and the curved side has the flux $-g \times 2\pi r\ell$. The mass
inside is $\matter\lambda\ell$, so $-2\pi r\ell g = -4\pi G\matter\lambda\ell$ and

$$g = \frac{2G\matter\lambda}{r},$$

The potential is $\field\Phi = G\matter\lambda\ln(x^2 + y^2)$ plus
a constant, because its derivative along $r = \sqrt{x^2 + y^2}$ is $2G\matter\lambda/r$. Differentiating twice gives
$\partial_x^2\field\Phi = 2G\matter\lambda(y^2 - x^2)/r^4$ and $\partial_y^2\field\Phi = 2G\matter\lambda(x^2 - y^2)/r^4$,
so at $(r, 0, 0)$ the entries are $-2G\matter\lambda/r^2$, $+2G\matter\lambda/r^2$ and $0$. The negative entry, along
the line to the rod, is a stretch, and the trace is zero, as outside matter it must be. For the rail the field is $2 \times 6.674 \times 10^{-11} \times 60/1 =
8.0 \times 10^{-9}\unit{m\,s^{-2}}$, and the stretch has the size $8.0 \times 10^{-9}\unit{s^{-2}}$, close to the
person's. Sections 3.5 and 3.7 use rows of such rods.
:::

### The camera

**[1.3]** A two-layer Earth with a core of radius 3480 km, the Earth's mass and the moment of inertia
$0.331\,\matter MR^2$ has a core of $12{,}500\unit{kg\,m^{-3}}$ and a mantle of $4150\unit{kg\,m^{-3}}$. Check the mass
and the moment of inertia, using $\matter M = 5.972 \times 10^{24}\unit{kg}$, $R = 6371\unit{km}$, and the moment of
inertia of a uniform ball of density $\matter\rho$ and radius $a$ about an axis through its centre,
$\tfrac{8\pi}{15}\matter\rho a^5$, which section 1.6 derives.

::: solution
Treat the second Earth as a ball of $4150\unit{kg\,m^{-3}}$ and radius $R$ plus a ball of
$12{,}500 - 4150 = 8350\unit{kg\,m^{-3}}$ and radius $r_c = 3480\unit{km}$; masses and moments of inertia add. With
$R^3 = 2.586 \times 10^{20}\unit{m^3}$ and $r_c^3 = 4.214 \times 10^{19}\unit{m^3}$, the mass is
$\tfrac43\pi(4150R^3 + 8350r_c^3) = 5.969 \times 10^{24}\unit{kg}$, within 0.05 per cent. With
$R^5 = 1.050 \times 10^{34}\unit{m^5}$ and $r_c^5 = 5.10 \times 10^{32}\unit{m^5}$, the moment of inertia is
$\tfrac{8\pi}{15}(4150R^5 + 8350r_c^5) = 8.01 \times 10^{37}\unit{kg\,m^2}$, which is $0.331\,\matter MR^2$. A uniform
ball gives $\tfrac{8\pi}{15}\matter\rho R^5 \big/ \tfrac{4\pi}{3}\matter\rho R^5 = \tfrac25$.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) uses Poisson's equation for the trace of the tide inside matter, and shows that one
  pixel on the ground reads the Earth's moment of inertia.
- [Section IV](/paper/#sec:near-field) opens with the shell theorem as the camera's first limit; Figure
  [](/paper/#fig:same-outside) shows three bodies with the same field outside.
- The paper's equation [](/paper/#eq:split) splits every density into the part the outside sees and the part it
  cannot (section 2.5); equation [](/paper/#eq:tidal-column) groups matter by the solid angle in which the camera sees
  it (section 2.3).
- The paper's equation [](/paper/#eq:array-data) has a factor $k$, the wavenumber of a ripple across the array
  (section 2.7), which makes a uniform sheet invisible because its pull is the same at every height.
:::

::: deeper
- The [GR course, section 0.7](https://neovand.github.io/general-relativity/chapter-0.html#0-7-flux-and-divergence-with-a-box-before-a-theorem)
  derives flux and divergence with a box of flowing water before stating the theorem.
- The GR course's [lesson on Poisson's equation from a flux](https://neovand.github.io/general-relativity/chapter-12.html#poisson-from-a-flux)
  works through Gauss's law for a point mass, and its
  [section 12.4](https://neovand.github.io/general-relativity/chapter-12.html#12-4-deriving-the-newtonian-limit-including-the-factor-of-two)
  gets Poisson's equation back from Einstein's.
- David Griffiths, *Introduction to Electrodynamics* (Cambridge, 4th edition, 2017), chapters 1 and 2, treats the
  divergence theorem, the delta function and Gauss's law for electric charge.
:::

::: history
### Newton's shells and the weight of the Earth

Newton proved the shell theorem in the *Principia* (1687) with geometry rather than flux (Book I, Propositions 70, 71
and 74), and guessed in Book III that the Earth's mean density was five or six times that of water. Henry Cavendish
weighed lead balls with a torsion balance and reported in 1798 a mean density 5.48 times that of water, within one per
cent of the modern value. Lagrange used a form of the divergence theorem in 1762, Gauss proved special cases in 1813,
and Ostrogradsky gave the first general proof in 1826. Poisson added the density to Laplace's equation in 1813. Dirac
made the delta function a standard tool in 1930, and Laurent Schwartz gave it its exact meaning as a distribution in
the late 1940s.
:::

[^limit]: First shown in *The gravitational camera* (Mohsenvand 2026), [Sec. IV](/paper/#sec:near-field).

[^nhat]: Section 1.2's $\hat n$, from the camera toward a source, is $-\hat{\vect x}$ here.

[^window]: A square of side $a$ seen face-on from a distance $d$ covers $4\arcsin\bigl(a^2/(a^2 + 4d^2)\bigr)$
    steradians, which is $4\arcsin(1/5) = 0.81$ for $a = d = 1\unit{m}$; its corners are seen at a slant.

[^omega]: $\Omega$ also names a rate of turning, such as the Earth's spin; the solid angle always appears as
    $\dd\Omega$ or with the word.

[^same]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, with equation [](/paper/#eq:split).

[^spin]: This is the pull alone; the Earth's spin lowers the weight at the equator by about $0.03\unit{m\,s^{-2}}$
    (section 1.6).

[^sigma]: Part 3 also uses $\sigma$ for the standard deviation of a noise. Each section says which it means.

[^sheet]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, equation [](/paper/#eq:array-data).

[^floor]: Each thin layer pulls down with $G\matter\sigma$ times the solid angle of a rectangle seen from the camera,
    which has a closed form; the layers are added through the 0.3 m, and the stretch is the change of the pull with
    height.
