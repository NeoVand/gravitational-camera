---
id: '1.4'
title: 'Tides: the difference in gravity'
question: 'A freely falling observer cannot feel the pull of a person standing one metre away. What is left that a detector can measure?'
part: '1'
requires: ['1.1', '1.2', '1.3']
paper: [sec:pixel, eq:tidal, eq:deviation, eq:newton, eq:wave, eq:tidal-brightness, eq:array-data, fig:tidal, fig:tidal-field]
figures: [fig:tidal, fig:tidal-field]
live: [tidal-ring]
depth: A
---

An astronaut in orbit floats in the cabin of her spacecraft. Gravity has not stopped acting on her: at the height of
the International Space Station the Earth still pulls with about nine tenths of its strength on the ground.[^iss] She
floats because she and the spacecraft fall around the Earth together, with the same acceleration, so neither moves
relative to the other.

Now put a closed box, falling freely, one metre from a person of 70 kg. The person pulls on the box with an
acceleration of $4.7 \times 10^{-9}\unit{m\,s^{-2}}$, half a billionth of the Earth's pull at the ground. The box and
everything inside it fall together, so an instrument inside cannot detect that pull, or the Earth's.
[Section II](/paper/#sec:pixel) of the paper begins with this falling observer and with the question that this
chapter answers. A freely falling observer cannot feel the pull of a person standing one metre away, so what is left
that a detector can measure?

The answer is the tide, the difference in gravity between nearby points. It is the quantity that one pixel of the
paper's gravitational camera records, and most of the tutorial builds on it. By the end of the chapter we will see why
a person swaying beside the mirrors of LIGO, the observatory that detects gravitational waves, makes a signal far
larger than the waves themselves, and why the paper's camera wants that signal.

![A person of 70 kg stands with their centre of mass 1 m from the centre of a ring of twelve small free balls. The
quartered mark on the arm stands in front of the centre of mass, which lies inside the body at the height of the hips.
The person's tide stretches the ring along the line to the person and squeezes it across that line, so the circle the
balls started on (dashed) becomes an ellipse. The arrows show how the balls accelerate relative to the centre of the
ring: each orange stretch is exactly twice as long as each blue squeeze, as the table of numbers says. The person and
the 1 m are drawn to one scale, but the ring is far larger than a real one could be, and its distortion is greatly
exaggerated.](tut-tides){#fig:person-ring}

::: plain
Gravity gives every body at the same place the same acceleration, whatever the body is made of. So if you fall
freely, everything near you falls with you, and you cannot feel the pull at all.

The pull is not quite the same at two nearby places, though. Picture a ring of small balls floating beside a large
mass. The ball nearest the mass is pulled a little harder than the ball farthest from it, so the ring is stretched
along the line to the mass. The balls at the two sides are each pulled toward the centre of the mass, so they move
slightly toward each other, and the ring is squeezed across that line.

This difference in gravity between nearby places is called the **tide**. Falling cannot remove it, so it is what
every detector of gravity measures. The change in the pull depends on the direction in which you step and on the
direction of the pull you look at, so the tide is a table of numbers with three rows and three columns, one for each direction in
space. It weakens with the cube of the distance. The three entries on the table's diagonal add to zero in empty space;
beside a single mass the stretch along the line is exactly as large as the two squeezes across it put together.
:::

## Falling together cancels the pull, but not its difference

The pull of gravity on a small body, divided by the body's mass, is the **gravitational field** at the body's
place.[^field] We write it $\vect g$. It is an acceleration, measured in metres per second squared, and chapter 1.2
defines it. Newton's gravity has a property that every experiment so far has confirmed: at a given place, every body
falls with the same acceleration $\vect g$, whatever its mass and whatever it is made of. This is the Newtonian form
of the **equivalence principle**. We state it and do not derive it. In Newton's theory it holds because the mass that
gravity pulls on is the same as the mass that resists being accelerated.

A body is in **free fall** when gravity is the only force acting on it. Take two small balls in free fall. The first
is at the position $\vect x$ and the second at $\vect x + \vect\xi$. Here $\sym{separation}{\xi}$ (the Greek letter
xi) is the **separation**, the vector that points from the first ball to the second, measured in metres. Each ball
accelerates by the field at its own place:

$$\ddot{\vect x} = \vect g(\vect x), \qquad \ddot{\vect x} + \ddot{\vect \xi} = \vect g(\vect x + \vect \xi).$$

A dot over a symbol means a derivative with respect to time, so $\ddot{\vect x}$ is the acceleration of the first
ball. We subtract the first equation from the second and write the result in components, with $i = 1, 2, 3$ for the
three directions $x$, $y$, $z$:

$$\ddot\xi_i = g_i(\vect x + \vect\xi) - g_i(\vect x). \label{eq:difference}$$

In words, the separation changes only because the field differs between the two places. Whatever the field does at
both places alike cancels out, so an observer who falls with the first ball sees the second ball accelerate by this
difference and by nothing else.

This also shows why no choice of motion can remove the difference. By falling freely, an observer gives the box one
acceleration, which can match the field at one place. The field at a second place is different, and a single
acceleration cannot match two different values at once.

The chapter rests on three assumptions. **The balls are free**: no spring, string or air pushes on them. **The
masses that make the field move slowly**, so that at each moment the field is the Newtonian field of the masses where
they are; until the last section they do not move at all. **The separation is small compared with the distance to
the nearest mass**, which allows the approximation of the next section.

{{paper fig:tidal}}

The figure above, from the paper, draws twelve free balls in a ring. In panel (a) they float beside a mass, and each
arrow shows how one ball moves relative to the ring's centre. The rest of this chapter computes those arrows. Panels (b)
and (c) show the same ring in a gravitational wave, which chapter [7.6](/tutorial/geometry/gravitational-waves/)
explains, and they can be left until then.

## The difference in gravity is a table of second derivatives

We want the difference in equation [](#eq:difference) in a form that uses only what the field does at one point. The
separation is small, so we use the first-order Taylor expansion of chapter 1.2: each component $g_i$ at the new point
is its value at the old point plus the dot product of its gradient with the displacement $\vect\xi$. In components,

$$g_i(\vect x + \vect\xi) \approx g_i(\vect x) + \xi_j\,\partial_j g_i(\vect x).$$

Here $\partial_j$ means the partial derivative with respect to the coordinate $x_j$, and the repeated index $j$ is
summed over its three values, as in chapter 1.1. We put this into equation [](#eq:difference), and $g_i(\vect x)$
cancels:

$$\ddot\xi_i \approx \xi_j\,\partial_j g_i .$$

The field is the gradient of a potential with a minus sign, $g_i = -\partial_i\field\Phi$ (chapter 1.2). Here
$\sym{potential}{\field{\Phi}}$ is the gravitational potential, the energy per unit mass that a small body has because
of where it is, measured in joules per kilogram. We substitute $g_i = -\partial_i\field\Phi$ and write
$\partial_j\partial_i$ as $\partial_i\partial_j$, which is allowed because partial derivatives of a smooth function
commute:

$$\ddot\xi_i \approx -\bigl(\partial_i\partial_j\field\Phi\bigr)\,\xi_j .$$

The nine numbers $\partial_i\partial_j\field\Phi$ form a table with three rows and three columns. The table of all second partial derivatives of a function is called its
**Hessian**. The Hessian of the potential is the **tidal tensor**, which we write
$\sym{tidal-tensor}{\curv{\tE}}_{ij}$ (a curly capital E). A **tensor** is a table like this one, with a row and a
column for each direction in space, whose entries change in a fixed way when the axes are turned, as the components
of a vector do. In this chapter the tidal tensor never needs more than its nine entries. The result of this section is

$$\boxed{\;\curv{\tE}_{ij} = \partial_i\partial_j\field\Phi, \qquad \ddot\xi_i = -\curv{\tE}_{ij}\,\xi_j\;} \label{eq:tide}$$

which is the paper's equation [](/paper/#eq:newton) together with its equation [](/paper/#eq:deviation):[^general]

{{paper eq:newton}}

{{paper eq:deviation}}

The second equation of [](#eq:tide) holds to first order in the separation, and from here on we keep only that
order. The unit of $\curv{\tE}_{ij}$ is the reciprocal second squared, $\mathrm{s^{-2}}$, because a potential in
joules per kilogram is $\mathrm{m^2\,s^{-2}}$ and each derivative divides by a metre. Then $\mathrm{s^{-2}}$ times a
separation in metres is an acceleration in $\mathrm{m\,s^{-2}}$, as it should be.

Each entry has a direct meaning. The number $-\curv{\tE}_{xx}$ is the relative acceleration along $x$ of two balls
that are separated along $x$, for each metre of their separation. In the same way, $-\curv{\tE}_{xy}$ is the relative
acceleration along $x$ of two balls that are separated along $y$, again for each metre. The table is symmetric, so
that $\curv{\tE}_{xy} = \curv{\tE}_{yx}$, because $\partial_x\partial_y\field\Phi = \partial_y\partial_x\field\Phi$.

The minus sign in [](#eq:tide) decides which way the balls move, and it is the easiest thing in this chapter to get
wrong. Suppose $\curv{\tE}_{xx}$ is negative, and two balls are separated along $x$ with $\xi_x > 0$. Then
$\ddot\xi_x = -\curv{\tE}_{xx}\,\xi_x$ is positive, so the separation grows and the balls move apart. If
$\curv{\tE}_{xx}$ is positive, the separation shrinks. The rule is

$$\boxed{\;\curv{\tE}_{xx} < 0:\ \text{a stretch along } x, \qquad \curv{\tE}_{xx} > 0:\ \text{a squeeze along } x.\;}$$

A **stretch** along a direction means that free balls separated along it move apart, and a **squeeze** means that they
move together. In every figure of the paper and of this tutorial a stretch is drawn in orange and a squeeze in blue.
Every entry of the tensor in this chapter keeps its sign. When we speak of the size of a stretch or a squeeze, we
mean the size of the entry, such as $|\curv{\tE}_{xx}|$, and we say in words which of the two it is.

A uniform field, the same at every point, shows what the definition leaves out. Its potential
$\field\Phi = -\vect g\cdot\vect x$ is linear in position, so all its second derivatives vanish: it has no tide, and
free balls in it never accelerate relative to one another. The field of a person changes from point to point, so it
does have a tide, and the next section computes it.

## Beside one mass the ring stretches along the line and squeezes across it

We now compute the table for one body. Put a point mass $\sym{mass}{\matter{M}}$, measured in kilograms, at the origin.
Its potential is

$$\field\Phi = -\frac{G\matter M}{r}, \qquad r = \sqrt{x^2 + y^2 + z^2},$$

where $G = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is Newton's constant. By the shell theorem of chapter 1.3,
a spherical body has the same field outside it as a point mass at its centre, so this covers the Earth, the Moon and
the Sun.

We place the ring on the $x$ axis, at a distance $r$ from the mass, so that the line from the ring to the mass is the
$x$ axis. We first need $\partial_x r = x/r$. It follows from the chain rule applied to $r^2 = x^2 + y^2 + z^2$, and
the box later in this section does this step in full. The first derivative of the potential is then
$G\matter M/r^2$ times $x/r$:

$$\partial_x\field\Phi = \frac{G\matter M\,x}{r^3}.$$

We differentiate this again with respect to $x$, using the product rule and $\partial_x r^{-3} = -3x/r^5$:

$$\partial_x\partial_x\field\Phi = G\matter M\Bigl(\frac{1}{r^3} - \frac{3x^2}{r^5}\Bigr).$$

We differentiate the same first derivative with respect to $y$ instead, using $\partial_y r^{-3} = -3y/r^5$:

$$\partial_y\partial_x\field\Phi = -\frac{3G\matter M\,xy}{r^5}.$$

At the ring, $x = r$ and $y = z = 0$. The first result becomes $G\matter M(1 - 3)/r^3$, and the second becomes zero:

$$\curv{\tE}_{xx} = -\frac{2G\matter M}{r^3}, \qquad \curv{\tE}_{xy} = 0 .$$

The same steps with $y$ in place of $x$ give $\partial_y\partial_y\field\Phi = G\matter M(1/r^3 - 3y^2/r^5)$, which is
$G\matter M/r^3$ at the ring, and $z$ behaves in the same way as $y$. Every entry off the diagonal contains a product
$xy$, $xz$ or $yz$, and so vanishes at the ring. The whole table is

$$\curv{\tE} = \frac{G\matter M}{r^3}\begin{pmatrix} -2 & 0 & 0\\ 0 & 1 & 0\\ 0 & 0 & 1 \end{pmatrix}.$$

By the sign rule, the ring is stretched along the line to the mass, at the rate $2G\matter M/r^3$, and squeezed across
it in both of the other directions, at the rate $G\matter M/r^3$. The stretch is twice as strong as each squeeze.

The table agrees with the picture of the opening. Take two balls on the line to the mass, the near one at $r$ and the
far one at $r + \xi$. The pull toward the mass at distance $s$ is $G\matter M/s^2$, so the near ball is pulled harder,
by

$$\frac{G\matter M}{r^2} - \frac{G\matter M}{(r+\xi)^2} \approx \frac{2G\matter M}{r^3}\,\xi ,$$

and the two balls move apart at this rate. Now take two balls at the sides, a distance $\xi$ apart across the line.
Each is pulled toward the centre of the mass, so each pull leans slightly toward the line, by an angle of about
$\xi/2r$. The sideways part of each pull is $(G\matter M/r^2)(\xi/2r)$, toward the other ball. The two balls approach
each other at twice this rate, $G\matter M\xi/r^3$, which is the squeeze in the table.

The same table can be written for a ring in any direction from the mass. Let $\hat n$ be the unit vector pointing from
the ring toward the mass, as in the paper, and let $\delta_{ij}$ be the Kronecker delta of chapter 1.1, which is 1
when $i = j$ and 0 otherwise. Then

$$\boxed{\;\curv{\tE}_{ij} = \frac{G\matter M}{r^3}\bigl(\delta_{ij} - 3\hat n_i\hat n_j\bigr).\;} \label{eq:point}$$

For a ring on the $x$ axis, $\hat n$ points along $x$, and this gives back the table above; the box below derives
the general form. Applied to $\hat n$ itself, the table $\delta_{ij} - 3\hat n_i\hat n_j$ gives $-2\hat n$, because
$\hat n_j\hat n_j = 1$ for a unit vector. Applied to a vector perpendicular to $\hat n$, it gives the same vector
back. So the stretch always points along the line to the mass, whichever way that line runs.

::: derivation
### The tide of a point mass in any direction

We want $\partial_i\partial_j(1/r)$ at a general point $\vect x$, with $r = \sqrt{x_k x_k}$. Differentiating
$r^2 = x_k x_k$ gives $2r\,\partial_j r = 2x_j$, so

$$\partial_j r = \frac{x_j}{r}.$$

The chain rule then gives the first derivative of $1/r$:

$$\partial_j \frac{1}{r} = -\frac{1}{r^2}\,\partial_j r = -\frac{x_j}{r^3}.$$

We differentiate again with respect to $x_i$, using the product rule. The derivative of $x_j$ is $\partial_i x_j =
\delta_{ij}$, and the derivative of $r^{-3}$ is $-3r^{-4}\,\partial_i r = -3x_i/r^5$:

$$\partial_i\partial_j \frac{1}{r} = -\frac{\delta_{ij}}{r^3} + \frac{3x_ix_j}{r^5} = \frac{3\hat x_i\hat x_j - \delta_{ij}}{r^3},$$

where $\hat x_i = x_i/r$ is the unit vector from the mass to the point. For $i = j = 1$ this reads
$\partial_x\partial_x(1/r) = -1/r^3 + 3x^2/r^5$, as in the main text.

The potential is $\field\Phi = -G\matter M\,(1/r)$, so

$$\curv{\tE}_{ij} = \partial_i\partial_j\field\Phi = \frac{G\matter M}{r^3}\bigl(\delta_{ij} - 3\hat x_i\hat x_j\bigr).$$

The unit vector from the ring toward the mass is $\hat n = -\hat x$. It appears twice in the product
$\hat n_i\hat n_j = \hat x_i\hat x_j$, so the sign drops out and this is equation [](#eq:point).
:::

Now the number. We treat the person of the paper as a point mass of 70 kg at 1 m.[^shape] The entry along the line to
the person is

$$\begin{aligned}
\curv{\tE}_{xx} = -\frac{2G\matter M}{r^3} &= -\frac{2 \times 6.674 \times 10^{-11} \times 70}{1^3}\unit{s^{-2}}\\
&= -9.3 \times 10^{-9}\unit{s^{-2}},
\end{aligned}$$

a stretch, and the squeeze across the line is half of its size. Tides are often given in **eötvös**, with
$1\unit{E} = 10^{-9}\unit{s^{-2}}$, so the person's stretch has a size of 9.3 E.[^eotvos]

This number is a relative acceleration per metre of separation, a rate in the way that a speed in metres per second
is. Two free balls along the line to the person move apart at $9.3 \times 10^{-9}\unit{m\,s^{-2}}$ for each metre
between them, about a billionth of the $9.8\unit{m\,s^{-2}}$ of a falling apple. Real balls must be much closer
together than a metre, because the Taylor expansion needs the separation to be small compared with the
distance.[^next] Two balls 1 cm apart, starting at rest, drift apart by
$\tfrac12 (2G\matter M/r^3)\,\xi t^2 = 4.7 \times 10^{-11}\unit{m}$ in the first second, a little less than the radius
of a hydrogen atom, $5.3 \times 10^{-11}\unit{m}$.

The limit of large distance shows how the tide differs from the pull. The tide is the change of the pull
$G\matter M/r^2$ from one point to the next, a derivative with respect to distance, so it falls as $r^{-3}$, one
power faster. At twice the distance the pull is four times weaker and the tide eight times weaker.

{{paper fig:tidal-field}}

Panel (a) of this figure, from the paper, draws a small ring at many points around one mass, and every ring is stretched
toward the mass. The caption calls the direction up the page $z$, which is this chapter's $x$. The figure compresses the
strength so that weak regions stay visible, so the true fall with distance is much steeper than it looks. In panel (b),
midway between two masses, the pulls cancel but the ring is still stretched along the line joining them. Panel (c) is a
gravitational wave, for chapter
[7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain).

## Tidal brightness is density times the cube of angular size

The tide of a body can be written with two quantities that say how the body looks from the ring. The first is its
**mean density** $\sym{mean-density}{\matter{\bar\rho}}$, its mass divided by its volume, in kilograms per cubic metre.
The second is its **angular size** $\sym{angular-size}{\theta} = R/r$, its radius $R$ divided by its distance $r$.
For a distant body $\theta$ is the angle, in radians, between the line to the body's centre and the line to its edge.
It has no unit.

We want to know how large a tide a body raises from these two quantities alone. A sphere of radius $R$ has the mass
$\matter M = \tfrac43\pi R^3\matter{\bar\rho}$. We put this into the size of the stretch, $2G\matter M/r^3$, and
collect $R^3/r^3$ into $\theta^3$:

$$\boxed{\;\frac{2G\matter M}{r^3} = \frac{8\pi G}{3}\,\matter{\bar\rho}\,\theta^3, \qquad \theta = \frac{R}{r}.\;}$$

This is the paper's equation [](/paper/#eq:tidal-brightness):

{{paper eq:tidal-brightness}}

The units agree, because $G\matter{\bar\rho}$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times $\mathrm{kg\,m^{-3}}$, which is
$\mathrm{s^{-2}}$. The paper's camera sees by tide: the larger the tide a body raises at the camera, the brighter the
body looks in the camera's picture. So the paper calls the size of the stretch that a body raises its **tidal
brightness**. The formula says that it depends only on what the body is made of and how large it looks. Two bodies of
the same density that look the same size are equally bright, however far away they are, and a body that looks twice
as wide is eight times as bright, because $2^3 = 8$.

The Moon and the Sun test this.[^sources] The Moon has a mean density of $3344\unit{kg\,m^{-3}}$, a radius of
1737 km and a distance of 384,400 km, so $\theta = 4.52 \times 10^{-3}$ and the size of its stretch at the Earth is

$$\frac{8\pi G}{3} \times 3344 \times (4.52 \times 10^{-3})^3\unit{s^{-2}} = 1.7 \times 10^{-13}\unit{s^{-2}}.$$

The Sun, with $1408\unit{kg\,m^{-3}}$, a radius of 695,700 km and a distance of $1.496 \times 10^{11}\unit{m}$, has
$\theta = 4.65 \times 10^{-3}$ and a stretch of size $7.9 \times 10^{-14}\unit{s^{-2}}$. The two look almost the same
size in our sky. The Moon is 2.4 times denser, and the Sun looks 3 per cent wider, which raises its tide by 9 per cent,
so the Moon's tide is 2.2 times the Sun's. This is why the Moon, and not the Sun, raises the larger part of the ocean
tides.

The person a metre away can be treated in the same way. People nearly float in water, so we treat the person as a
ball of water, $1000\unit{kg\,m^{-3}}$. A ball of water of 70 kg has a radius of 0.256 m, so at 1 m its angular size
is 0.256, which is 56.6 times the Moon's. Cubed, that is a factor of 181,000. The person's density is 0.30 of the
Moon's, so the person is about 54,000 times as bright as the Moon. The formula gives the same
$9.3 \times 10^{-9}\unit{s^{-2}}$ as before, because it is the same formula written differently.

## In empty space the stretch and the squeezes balance

The **trace** of a table is the sum of its diagonal entries. For the tidal tensor it is
$\curv{\tE}_{xx} + \curv{\tE}_{yy} + \curv{\tE}_{zz}$, which we write $\curv{\tE}_{ii}$ with the summation convention.
We want to know what it measures. By equation [](#eq:tide) it is

$$\curv{\tE}_{ii} = \partial_i\partial_i\field\Phi = \nabla^2\field\Phi ,$$

the Laplacian of the potential, which is the sum of its three second derivatives along the axes. Chapter 1.3 derives
Poisson's equation, $\nabla^2\field\Phi = 4\pi G\matter\rho$, from the inverse-square law: the field that flows into a
small region is proportional to the mass inside it. Here $\sym{density}{\matter{\rho}}$ is the density of mass at the
point, in kilograms per cubic metre. So

$$\boxed{\;\curv{\tE}_{ii} = 4\pi G\matter\rho .\;}$$

The unit is $\mathrm{s^{-2}}$ on both sides. In empty space the density is zero, so the trace is zero. A table whose
diagonal entries add up to zero is called **trace-free**.[^five] The tide of one mass passes this check: its diagonal
entries are $-2$, $+1$ and $+1$ in units of $G\matter M/r^3$, and $-2 + 1 + 1 = 0$. In equation [](#eq:point) the
check reads $\delta_{ii} - 3\hat n_i\hat n_i = 3 - 3 = 0$, because $\delta_{ii} = 3$ and $\hat n$ has length one.

The meaning is that in empty space a tide cannot squeeze a ring in every direction at once. Every squeeze is paid for
by a stretch in another direction. The same holds for the tide of any number of masses outside them, because each one
adds a trace-free table.

Inside matter the trace is not zero. Inside water it is $4\pi G\matter\rho = 8.4 \times 10^{-7}\unit{s^{-2}}$, about
ninety times the size of the person's stretch. A positive trace is a squeeze on average over all directions, so free
grains inside matter fall toward one another; this is how a cloud of dust begins to collapse (the box below works it
out). The trace measures the density at the pixel's own place and nothing else, so a pixel in empty space always
reads a trace of zero. This is what the paper's Section II means when it calls the trace local information that a
pixel in empty space does not see.

::: derivation
### The tide inside a ball of dust

We want the tide inside a ball of dust whose grains fall freely and whose density $\matter\rho$ is uniform. By the
shell theorem of chapter 1.3, the matter outside a radius $r$ exerts no net pull there, and the matter inside pulls as
a point mass $\tfrac43\pi r^3\matter\rho$ at the centre. The field at the point $\vect x$ is therefore

$$g_i = -\frac{G}{r^2}\,\frac{4\pi r^3\matter\rho}{3}\,\frac{x_i}{r} = -\frac{4\pi}{3}G\matter\rho\,x_i ,$$

pointing toward the centre. The potential whose gradient, with a minus sign, gives this field is

$$\field\Phi = \frac{2\pi}{3}G\matter\rho\,r^2 + \text{constant},$$

because $\partial_i r^2 = 2x_i$. Its Laplacian is $\tfrac{2\pi}{3}G\matter\rho \times 6 = 4\pi G\matter\rho$, as
Poisson's equation requires. Its Hessian is

$$\curv{\tE}_{ij} = \frac{4\pi}{3}G\matter\rho\,\delta_{ij},$$

an equal squeeze in every direction, with the trace $4\pi G\matter\rho$ of the boxed equation. By equation
[](#eq:tide), every pair of grains accelerates toward each other at $\tfrac{4\pi}{3}G\matter\rho$ per metre of
separation, so the whole cloud begins to shrink, in the same way at every point. For the density of water this rate is
$2.8 \times 10^{-7}\unit{s^{-2}}$.
:::

## On the ground the Earth's own tide is far larger, but steady

The paper's camera works on the ground, or in a room falling freely far from any planet. On the ground the largest
tide is the Earth's own. With $G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$ and a radius of
$R = 6.371 \times 10^6\unit{m}$, the stretch along the vertical has the size

$$\frac{2G\matter M}{R^3} = 3.1 \times 10^{-6}\unit{s^{-2}},$$

with a squeeze of half this size in each horizontal direction. This is 330 times the person's tide. The Earth's tide
is steady and well known, so it can be subtracted, and the camera records what remains.

The pixel must also not rotate. A turning frame feels a centrifugal acceleration that grows with the distance from
the axis, so it differs between two nearby balls. A turning pixel would read that difference as a **pseudo-tide**, an
apparent tide that comes from the motion of the frame and not from any mass. For a frame that turns with the Earth it
is a stretch of $5.3 \times 10^{-9}\unit{s^{-2}}$, more than half the person's tide, so gyroscopes hold the axes of
the paper's pixels still.[^rotation]

## A swaying person makes the signal that LIGO must keep out

So far nothing has moved. Suppose now that the person sways toward the ring and away from it, by 5 cm, once a second.
The tide then changes in time, and an instrument that compares lengths can see the change.

**LIGO**, the Laser Interferometer Gravitational-Wave Observatory, is such an instrument. It has two arms at right
angles, each 4 km long, with a hanging mirror at each end. A **strain** is a change in length divided by the length,
a pure number, and LIGO reads the strain of one arm minus the strain of the other. The gravitational waves it detects
have strains near $10^{-21}$, a change of $4 \times 10^{-18}\unit{m}$ in a 4 km arm. What LIGO measures is also a tide.
Its reading is the difference of two entries of $\curv{\tE}$, integrated twice in time, which appears as a change in
the lengths of its arms.

The person's tide changes over a metre, so equation [](#eq:tide) applies only to arms much shorter than that. We
therefore take a detector built like LIGO but with arms a few centimetres long, which is close to one pixel of the
paper's camera, and put the person 1 m away along the line of one arm. We assume that **the mirrors move freely at
the frequency of the sway**, while their suspension holds them against the steady tide.[^free]

We first want the change in the entry along the arm that points at the person, $\curv{\tE}_{xx} = -2G\matter M/r^3$.
Its derivative with respect to the distance is $6G\matter M/r^4 = -3\curv{\tE}_{xx}/r$, so a small change $\delta r$
in the distance changes the entry by

$$\delta\curv{\tE}_{xx} = -3\,\curv{\tE}_{xx}\,\frac{\delta r}{r}.$$

When the person steps back by $\delta r = 5\unit{cm}$, the entry rises toward zero by 15 per cent of itself, and the
stretch weakens:
$\delta\curv{\tE}_{xx} = -3 \times (-9.34 \times 10^{-9}\unit{s^{-2}}) \times 0.05 = +1.40 \times 10^{-9}\unit{s^{-2}}$.[^exact]
The squeeze across the line, $\curv{\tE}_{yy} = G\matter M/r^3$, changes by half as much and in the opposite sense,
$\delta\curv{\tE}_{yy} = -\tfrac12\,\delta\curv{\tE}_{xx}$.

Next we want the strain of one arm. The entry along it is its steady value, which the suspension holds, plus a part
that oscillates with the sway, $\delta\curv{\tE}_{xx}\cos\omega t$. Here $\omega = 2\pi f$ is the angular frequency
in radians per second, $f$ is the frequency of the sway, and the clock starts when the person is farthest away. For
two mirrors a length $L$ apart along $x$, equation [](#eq:tide) gives the change $\delta L$ in their distance:

$$\frac{\dd^2\,\delta L}{\dd t^2} = -\delta\curv{\tE}_{xx}\,L\cos\omega t .$$

The tide also acts on the small change $\delta L$ itself, but that adds terms smaller by a factor of about
$10^{-10}$, which we drop. We look for a length that oscillates with the sway, $\delta L = A\cos\omega t$. Its second
derivative is $-\omega^2 A\cos\omega t$, so $\omega^2 A = \delta\curv{\tE}_{xx}\,L$, and the strain of the arm has the amplitude

$$\boxed{\;\frac{\delta L}{L} = \frac{\delta\curv{\tE}_{xx}}{\omega^2}.\;} \label{eq:arm}$$

Both sides have no unit, because $\omega^2$ is measured in $\mathrm{s^{-2}}$ like the tide. The sign says that the
arm is longest when the stretch is weakest, because a free mass shaken back and forth moves opposite to the force on
it. A faster sway gives a smaller strain, by the square of the frequency, because a free mirror has less time to move
before the force reverses. A very slow sway would give a very large strain, but there the suspension holds the
mirrors and the assumption fails.

The arm across the line obeys the same equation with $\delta\curv{\tE}_{yy}$ in place of $\delta\curv{\tE}_{xx}$. For
a sway once a second, $\omega = 2\pi\unit{s^{-1}}$ and $\omega^2 = 39.5\unit{s^{-2}}$, so the reading, the difference
of the two strains, is

$$\frac{\delta\curv{\tE}_{xx} - \delta\curv{\tE}_{yy}}{\omega^2} = \frac{1.5 \times 1.40 \times 10^{-9}}{39.5} = 5.3 \times 10^{-11}.$$

This is about fifty billion times the $10^{-21}$ of the waves that LIGO detects.[^conventions] The real LIGO, with its
long arms, would read less, because the person can pull on only the nearest mirror, but its reading would still be
millions of times the strain of its waves.[^long-arms] The two signals are of the same kind: each is a change in the
tidal tensor, read as a change in the lengths of the arms. LIGO's one number cannot tell a lorry driving past from a
distant collision of black holes, and that is why people and vehicles are kept away from its mirrors
[@ThorneWinstein1999]. The disturbance that LIGO must keep out is the signal that the paper's camera sets out to
record.

::: try {#tidal-ring}
The figure opens with a mass of 70 kg one metre from a ring of twelve free balls, and above the ring it asks you for
two predictions. Make each guess before you touch anything, then drag the mass, or switch on the second mass,
until the answer appears. The readout keeps the sign of the boxed rule, so a stretch shows as a negative number, and
for a single mass the ratio of stretch to squeeze stays at $-2 : 1$ wherever you put it.
:::

::: check
### Q

What is the trace of the tide inside a block of granite, of density $2700\unit{kg\,m^{-3}}$, and what is it one
metre outside the block?

### A

Inside, $\curv{\tE}_{ii} = 4\pi G\matter\rho = 4\pi \times 6.674 \times 10^{-11} \times 2700\unit{s^{-2}} =
2.3 \times 10^{-6}\unit{s^{-2}}$, about three quarters of the size of the Earth's stretch on the ground. Outside, the density is zero,
so the trace is zero, however close to the block the point is. The block's tide there is real, but its stretch and squeezes
balance.

### Q

A ring floats midway between two people of 70 kg, each a metre away on opposite sides. What pull does it feel, and
what tide?

### A

The two pulls are equal and opposite, so there is no pull. Each person stretches the ring along the line by
$9.3 \times 10^{-9}\unit{s^{-2}}$, and the stretches add, because $\hat n_i\hat n_j$ in equation [](#eq:point) does not
change when $\hat n$ turns round. The tide is a stretch of $1.9 \times 10^{-8}\unit{s^{-2}}$ along the line and a
squeeze of $9.3 \times 10^{-9}\unit{s^{-2}}$ in each direction across it.

### Q

Two free balls float one above the other, and the vertical entry of the tide is $\curv{\tE}_{zz} < 0$. Do the balls
move apart or together?

### A

Apart. With $\xi_z > 0$, the equation $\ddot\xi_z = -\curv{\tE}_{zz}\,\xi_z$ gives a positive relative acceleration,
so the separation grows. A negative entry is a stretch.

### Q

Why can no choice of motion remove the tide?

### A

Any motion of the box gives it one acceleration, which can cancel the field at one point. The tide is the difference
between the fields at two points, and one acceleration cannot match two different fields.

### Q

The person sways by the same 5 cm, but ten times a second. What does the small detector of the last section read?

### A

By equation [](#eq:arm) the strain falls as $1/\omega^2$, so ten times the frequency gives a hundred times less:
$5.3 \times 10^{-13}$. That is still about five hundred million times the strain of LIGO's waves.
:::

**The idea to keep: gravity at one point can be cancelled by falling, but its difference between nearby points cannot.
That difference, $\curv{\tE}_{ij} = \partial_i\partial_j\field\Phi$, is what every detector of gravity measures.**

::: problems
### Practice

A car of 1000 kg is parked 5 m from a ring of free balls. Find the stretch along the line to the car, and compare it
with the tide of the 70 kg person.

::: solution
Treating the car as a point mass, $2G\matter M/r^3 = 2 \times 6.674 \times 10^{-11} \times 1000/5^3\unit{s^{-2}} =
1.1 \times 10^{-9}\unit{s^{-2}}$, the size of a stretch along the line. This is about the person's tide at 2 m
($1.2 \times 10^{-9}\unit{s^{-2}}$) and about a ninth of the person's tide at 1 m. A car is a poor point mass at 5 m,
so the number is an estimate.
:::

### Stretch

Two equal masses $\matter M$ sit at $x = \pm a$ on the $x$ axis. Find the tidal tensor at the point $(0, y, 0)$ on the
perpendicular bisector, and the distance $y$ at which $\curv{\tE}_{xx}$ changes sign. Use equation [](#eq:point) for
each mass and add the two tables.

::: solution
Both masses are at the distance $d = \sqrt{a^2 + y^2}$. The unit vectors toward them are $\hat n = (\pm a, -y, 0)/d$.
In the sum of the two tables the products $\hat n_x\hat n_y = \mp ay/d^2$ cancel, and the others are the same for both
masses, so

$$\begin{aligned}
\curv{\tE}_{xx} &= \frac{2G\matter M}{d^3}\Bigl(1 - \frac{3a^2}{d^2}\Bigr),\\
\curv{\tE}_{yy} &= \frac{2G\matter M}{d^3}\Bigl(1 - \frac{3y^2}{d^2}\Bigr),\\
\curv{\tE}_{zz} &= \frac{2G\matter M}{d^3},
\end{aligned}$$

with every entry off the diagonal zero. The trace is $(2G\matter M/d^3)(3 - 3) = 0$, as it must be in empty space.
At $y = 0$ the first entry is $-4G\matter M/a^3$, the doubled stretch of the second check question. Far away, for
$y \gg a$, the table becomes that of one mass $2\matter M$ along $y$.

The entry $\curv{\tE}_{xx}$ is zero when $d^2 = 3a^2$, which is $y = \sqrt2\,a$. There the line to each mass makes an
angle $\vartheta$ with the $x$ axis for which $\cos^2\vartheta = a^2/d^2 = 1/3$, so $\vartheta$ is 54.7°. Matter
within 54.7° of an axis stretches a ring along that axis, and matter farther from it squeezes. The same angle
divides the sky in the paper's Figure [](/paper/#fig:sky-integral), which shows how matter in each direction of the
sky adds to the tide at the camera.
:::

### The paper

Reproduce the chain of numbers in the paper's Section II for the person a metre away: the tide of
$9 \times 10^{-9}\unit{s^{-2}}$, its change $3\,\delta r/r$ for a sway of 5 cm, the change of
$1.4 \times 10^{-9}\unit{s^{-2}}$, and the paper's strain $h = 7 \times 10^{-11}$. The paper counts strain as for a
gravitational wave, in the convention of its equation [](/paper/#eq:wave), where a wave of strain $h$ changes the
length of an arm by $h/2$. Then explain why, in the summary in plain words that opens the paper's Section IV, a body
twice as wide raises a tide eight times as strong.

::: solution
The size of the stretch is $2G\matter M/r^3 = 2 \times 6.674 \times 10^{-11} \times 70\unit{s^{-2}} = 9.3 \times
10^{-9}\unit{s^{-2}}$. Because the tide goes as $r^{-3}$, its relative change is $3\,\delta r/r = 0.15$, so
$\delta\curv{\tE}_{xx} = 1.40 \times 10^{-9}\unit{s^{-2}}$.

The paper's equation [](/paper/#eq:wave) says $\curv{\tE} = -\tfrac12\,\partial_t^2 h$. For a strain that oscillates as
$\cos\omega t$, two time derivatives give a factor $-\omega^2$, so $\curv{\tE} = \tfrac12\omega^2 h$ and
$h = 2\,\delta\curv{\tE}_{xx}/\omega^2 = 2 \times 1.40 \times 10^{-9}/39.5 = 7.1 \times 10^{-11}$. The wave changes
one arm by $h/2 = 3.55 \times 10^{-11}$, which is equation [](#eq:arm). The difference of the two arms of the small
detector is three quarters of $h$, the $5.3 \times 10^{-11}$ of the chapter.

By the paper's equation [](/paper/#eq:tidal-brightness), at a fixed density the tide is proportional to $\theta^3$. A
body that looks twice as wide has twice the angular size, so its tide is $2^3 = 8$ times as strong.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) begins with this falling observer, defines the tidal field, computes the person and
  the strain that a detector would read, names the lorry, and gives the Earth's tide, the turning frame and the eötvös.
- The paper's equation [](/paper/#eq:tidal) defines the tide in general relativity as $c^2R_{0i0j}$. Chapter
  [7.2](/tutorial/geometry/curvature-and-tides/#for-an-observer-at-rest-the-drift-is-the-papers-tide) derives it, and
  this chapter uses only its Newtonian limit.
- The paper's equations [](/paper/#eq:newton) and [](/paper/#eq:deviation) are this chapter's equation [](#eq:tide): the
  tide as the Hessian of the potential, and the motion of free balls.
- The paper's equation [](/paper/#eq:wave) gives the tide of a gravitational wave, from which it takes its convention
  for the strain.
- Figures [](/paper/#fig:tidal) and [](/paper/#fig:tidal-field) draw the ring beside a mass and the field around one
  and two masses.
- The paper's equation [](/paper/#eq:tidal-brightness), in Section IV, is the tidal brightness of a body, which sets how
  bright the Moon, the Sun and the person look to the camera.
- The paper's equation [](/paper/#eq:array-data), also in Section IV, takes the camera's data to be $-\curv{\tE}_{zz}$,
  the vertical entry with its sign reversed, so that the stretch along the vertical above a buried mass shows as a
  positive number.
:::

::: deeper
- The [GR course, section 5.9](https://neovand.github.io/general-relativity/chapter-5.html#5-9-tides-the-gravity-a-falling-laboratory-cannot-remove)
  treats tides as the gravity that a falling laboratory cannot remove, alongside the equivalence principle.
- The [GR course, section 10.5](https://neovand.github.io/general-relativity/chapter-10.html#10-5-the-newtonian-limit-checks-both-the-meaning-and-the-sign)
  recovers the Newtonian tide from curvature and checks its sign, and its
  [lesson on tidal instruments](https://neovand.github.io/general-relativity/chapter-10.html#what-a-tidal-instrument-measures)
  says what a tidal matrix measures.
- The [GR course, section 10.9](https://neovand.github.io/general-relativity/chapter-10.html#10-9-how-much-curvature-is-outside-your-window)
  computes the Earth's tide, $3.08 \times 10^{-6}\unit{s^{-2}}$, and compares it with other sources.
- The [GR course, section 10.3](https://neovand.github.io/general-relativity/chapter-10.html#10-3-deriving-geodesic-deviation-with-every-cancellation-visible)
  derives the relativistic form of equation [](#eq:tide), geodesic deviation, with every step shown.
- Kip Thorne and Roger Blandford, *Modern Classical Physics* (Princeton, 2017), introduce the Newtonian tidal tensor
  in their chapter on the foundations of general relativity, as the bridge to the curvature of spacetime.
:::

::: history
### Newton, Eötvös and the tides

Newton explained the tides of the sea in the *Principia* (1687) as the difference between the Moon's pull on the
near side of the Earth, on its centre and on its far side. In the 1890s the Hungarian physicist Loránd Eötvös built a
torsion balance that measured how gravity changes over a distance of a few tens of centimetres, and he used it in the
field to map how gravity changes across the ground. The unit of tide is named after him. With torsion balances of the
same kind, in 1889 and again in 1906–09, he also tested whether bodies of different materials fall alike, and found
that they do to a few parts in a billion: the equivalence principle with which this chapter began.
:::

[^iss]: At a height of about 420 km, the pull is $(6371/6791)^2 = 0.88$ of its value on the ground.

[^field]: The field is an acceleration at one point. It should not be confused with the tide, which is the
    field's change from one point to the next.

[^general]: The paper writes the separation as $\xi^i$, with the index raised. In this part of the tutorial a raised and
    a lowered index mean the same thing; they differ only in relativity, from chapter 6.2. The paper's equation
    [](/paper/#eq:tidal) defines the tide in general relativity, as $\curv{\tE}_{ij} = c^2R_{0i0j}$, where $R$ is the
    curvature of spacetime. We state it without proof here; chapter [7.2](/tutorial/geometry/curvature-and-tides/)
    derives it and shows that it becomes [](#eq:tide) near slowly moving matter.

[^next]: The small parameter is $\xi/r$. The exact difference of the pulls on two balls along the line is
    $G\matter M\,[1/r^2 - 1/(r+\xi)^2]$, which in powers of $\xi$ is $(G\matter M/r^3)(2\xi - 3\xi^2/r + \dots)$.
    The first term the expansion leaves out is $3\xi/2r$ times the term it keeps: 1.5 per cent for balls 1 cm apart
    at 1 m. For balls a metre apart beside a person a metre away the expansion fails, and equation
    [](#eq:difference) must be used directly.

[^five]: The tidal tensor is symmetric, so only six of its nine entries are independent: the three on the diagonal
    and the three above it. In empty space the trace-free condition fixes one of the six from the other five, so the
    tide there is five independent numbers. Chapter 1.5 counts them carefully.

[^shape]: A real person is tall and thin rather than round, so the number is an estimate, as it is in the paper.
    Chapter 2.3 shows how to compute the tide of a body of any shape.

[^eotvos]: The roman E of the unit is not the tensor $\curv{\tE}$. The unit is named after Loránd Eötvös; see the
    history box at the end.

[^sources]: Mean densities, radii and distances from NASA's planetary fact sheets. The Sun's distance is the
    astronomical unit.

[^rotation]: The Earth turns once relative to the stars in 23 h 56 min, so its angular velocity is
    $\Omega = 7.29 \times 10^{-5}\unit{s^{-1}}$. The centrifugal acceleration at a distance $s$ from the axis is
    $\Omega^2 s$, so it differs by $\Omega^2\xi$ between two points $\xi$ apart in any direction across the axis.
    The pseudo-tide, $\Omega^2 = 5.3 \times 10^{-9}\unit{s^{-2}}$, is therefore a stretch in every direction
    perpendicular to the axis and nothing along it. It is 31,000 times the Moon's tide. Chapter 1.6 derives it,
    together with the sideways Coriolis push that a turning frame adds for moving balls.

[^free]: LIGO's mirrors hang from chains of pendulums whose own swings lie near 1 Hz. A hanging mirror moves almost
    as a free mass only under forces that change much faster than its own swing, so for a sway once a second the
    free mirror is an idealization, as it is in the paper. LIGO itself listens from about 10 Hz upward.

[^exact]: The exact change is 13.6 per cent when the person steps back and 16.6 per cent when they step forward, so
    the estimate of 15 per cent is good to about a tenth of itself.

[^conventions]: The paper quotes $7 \times 10^{-11}$ for this sway, because it counts in the convention of a
    gravitational wave's strain $h$, in which a wave of strain $h$ changes one arm by $h/2$ (chapter
    [7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain)). One arm alone
    changes by $3.55 \times 10^{-11}$. All three ways of counting give tens of billions of times the strain of the waves
    that LIGO detects.

[^long-arms]: A person 1 m beyond an end mirror of LIGO pulls on that mirror alone, with
    $G\matter M/r^2 = 4.7 \times 10^{-9}\unit{m\,s^{-2}}$, because the other mirrors are 4 km away. This is
    equation [](#eq:difference) used directly, since the separation is far larger than the distance. The sway
    changes the pull by $2\,\delta r/r$, which is 10 per cent, so the free mirror swings by
    $4.7 \times 10^{-10}/39.5 = 1.2 \times 10^{-11}\unit{m}$. Divided by 4 km this is a strain of
    $3 \times 10^{-15}$, three million times the strain of LIGO's waves.
