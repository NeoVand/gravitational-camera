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

An astronaut in orbit floats in her cabin, although the Earth still pulls on her with about nine tenths of its
strength on the ground.[^iss] She floats because she and the spacecraft fall together, with the same acceleration.

Now put a closed box, falling freely, one metre from a person of 70 kg. The person pulls on the box with an
acceleration of $4.7 \times 10^{-9}\unit{m\,s^{-2}}$, half a billionth of the Earth's pull at the ground. Everything
inside falls with the box, so no instrument inside can detect that pull, or the Earth's. What is left that a detector
can measure?[^scene]

The answer is the tide, the difference in gravity between nearby points, and it is what one pixel of the gravitational
camera records. A person swaying beside the mirrors of LIGO, the observatory that detects gravitational waves, makes a
tidal signal far larger than the waves themselves, a disturbance that LIGO must keep out and that the camera records.

![A person of 70 kg stands with their centre of mass (the quartered mark, at the height of the hips) 1 m from the
centre of a ring of twelve small free balls. The person's tide stretches the ring along the line to the person and
squeezes it across that line, so the dashed circle becomes an ellipse. The arrows show how the balls accelerate
relative to the ring's centre: each orange stretch is exactly twice each blue squeeze. The person and the 1 m are to
one scale; the ring is far too large for a real one, and its distortion is greatly exaggerated.](tut-tides){#fig:person-ring}

::: plain
Gravity gives every body at the same place the same acceleration, whatever the body is made of. So if you fall
freely, everything near you falls with you, and you cannot feel the pull at all.

The pull is not quite the same at two nearby places, though. In a ring of small balls floating beside a large mass,
the nearest ball is pulled a little harder than the farthest, so the ring is stretched along the line to the mass.
The balls at the two sides are both pulled toward the centre of the mass, so they move slightly toward each other,
and the ring is squeezed across that line.

This difference in gravity between nearby places is called the **tide**. Falling cannot remove it, so it is what
every detector of gravity measures. It is a table of numbers with three rows and three columns, one for each
direction in space, and it weakens with the cube of the distance. Beside a single mass the stretch along the line is
exactly as large as the two squeezes across it put together.
:::

## Falling together cancels the pull, but not its difference

The pull of gravity on a small body, divided by the body's mass, is the **gravitational field** at the body's
place.[^field] We write it $\vect g$, an acceleration in metres per second squared
([section 1.2](/tutorial/newton/field-and-potential/)). Every experiment so far confirms that at a given place every
body falls with the same acceleration, whatever it is made of.[^falling] This is the Newtonian form of the **equivalence
principle**, which we take from experiment: in Newton's theory it holds because the mass that gravity pulls on is the
same as the mass that resists being accelerated.

A body is in **free fall** when gravity is the only force acting on it. Take two small balls in free fall, at
$\vect x$ and $\vect x + \vect\xi$, where $\sym{separation}{\xi}$ (the Greek letter xi)
is the **separation**, the vector from the first ball to the second, in metres. Each ball accelerates by the field
at its own place:

$$\ddot{\vect x} = \vect g(\vect x), \qquad \ddot{\vect x} + \ddot{\vect \xi} = \vect g(\vect x + \vect \xi).$$

A dot means a derivative with respect to time. We subtract the first equation from the second and write the result
in components, with $i = 1, 2, 3$ for the directions $x$, $y$, $z$:

$$\ddot\xi_i = g_i(\vect x + \vect\xi) - g_i(\vect x). \label{eq:difference}$$

The separation changes only because the field differs between the two places: whatever the field does at both alike
cancels. No motion of the box can remove this difference, because one acceleration can match the field at one place
but not two different values at once.

The argument rests on three assumptions. **The balls are free**: no spring, string or air pushes on them. **The
masses that make the field move slowly**, so that the field is at each moment the Newtonian field of the masses where
they are. **The separation is small compared with the
distance to the nearest mass.**

{{paper fig:tidal}}

In panel (a) of the figure above, twelve free balls float in a ring beside a mass, and each arrow shows how one ball
moves relative to the ring's centre; we now compute those arrows. Panels (b) and (c) show the ring in a gravitational
wave ([section 7.6](/tutorial/geometry/gravitational-waves/)).

## The difference in gravity is a table of second derivatives

We want the difference in equation [](#eq:difference) in terms of what the field does at one point. The separation is
small, so we use the first-order Taylor expansion of section 1.2: each component $g_i$ at the new point is its value
at the old point plus the dot product of its gradient with the displacement $\vect\xi$,

$$g_i(\vect x + \vect\xi) \approx g_i(\vect x) + \xi_j\,\partial_j g_i(\vect x).$$

Here $\partial_j$ is the partial derivative with respect to $x_j$, and the repeated index $j$ is summed over its
three values ([section 1.1](/tutorial/newton/vectors-and-indices/)). We put this into equation
[](#eq:difference), and $g_i(\vect x)$ cancels:

$$\ddot\xi_i \approx \xi_j\,\partial_j g_i .$$

The field is minus the gradient of the potential, $g_i = -\partial_i\field\Phi$, where
$\sym{potential}{\field{\Phi}}$ is the gravitational potential, the energy per unit mass that a small body has because
of where it is, in joules per kilogram. We substitute this and write $\partial_j\partial_i$ as $\partial_i\partial_j$,
since partial derivatives of a smooth function commute:

$$\ddot\xi_i \approx -\bigl(\partial_i\partial_j\field\Phi\bigr)\,\xi_j .$$

The table of all second partial derivatives of a function, here the nine numbers $\partial_i\partial_j\field\Phi$, is
its **Hessian**. The Hessian of the potential is the **tidal tensor**, written $\sym{tidal-tensor}{\curv{\tE}}_{ij}$ (a
curly capital E). A **tensor** is a table like this one, with a row and a column for each direction in space, whose
entries change in a fixed way when the axes are turned, as the components of a vector do. The result is

$$\boxed{\;\curv{\tE}_{ij} = \partial_i\partial_j\field\Phi, \qquad \ddot\xi_i = -\curv{\tE}_{ij}\,\xi_j\;} \label{eq:tide}$$

The second equation holds to first order in the separation, the only order we keep.[^general] The unit of
$\curv{\tE}_{ij}$ is $\mathrm{s^{-2}}$, because a potential is in $\mathrm{m^2\,s^{-2}}$ and each derivative divides
by a metre; $\mathrm{s^{-2}}$ times a separation in metres is then an acceleration, as it should be.

Each entry has a direct meaning. The number $-\curv{\tE}_{xx}$ is the relative acceleration along $x$ of two balls
separated along $x$, per metre of their separation, and $-\curv{\tE}_{xy}$ is the relative acceleration along $x$ of
two balls separated along $y$. The table is symmetric, $\curv{\tE}_{xy} = \curv{\tE}_{yx}$, because
$\partial_x\partial_y\field\Phi = \partial_y\partial_x\field\Phi$.

The minus sign in [](#eq:tide) decides which way the balls move. If $\curv{\tE}_{xx}$ is negative and two balls are
separated along $x$ with $\xi_x > 0$, then $\ddot\xi_x = -\curv{\tE}_{xx}\,\xi_x$ is positive and the balls move apart;
if it is positive, they move together. The rule is

$$\boxed{\;\curv{\tE}_{xx} < 0:\ \text{a stretch along } x, \qquad \curv{\tE}_{xx} > 0:\ \text{a squeeze along } x.\;}$$

A **stretch** along a direction means that free balls separated along it move apart, and a **squeeze** that they move
together; in every figure of this book a stretch is orange and a squeeze blue. The size of a stretch or a squeeze is
the size of its entry, such as $|\curv{\tE}_{xx}|$, and the entry itself always keeps its sign.

A uniform field has no tide. Its potential $\field\Phi = -\vect g\cdot\vect x$ is linear in position, so all its
second derivatives vanish, and free balls in it never accelerate relative to one another.

## Beside one mass the ring stretches along the line and squeezes across it

Put a point mass $\sym{mass}{\matter{M}}$, measured in kilograms, at the origin. Its potential is

$$\field\Phi = -\frac{G\matter M}{r}, \qquad r = \sqrt{x^2 + y^2 + z^2},$$

where $G = 6.674 \times 10^{-11}\unit{m^3\,kg^{-1}\,s^{-2}}$ is Newton's constant. By the shell theorem
([section 1.3](/tutorial/newton/gauss-and-poisson/)), a spherical body has the same field outside it as a point mass
at its centre, so this covers the Earth, the Moon and the Sun.

We place the ring on the $x$ axis at a distance $r$ from the mass. The chain rule applied to $r^2 = x^2 + y^2 + z^2$
gives $\partial_x r = x/r$ (the box below does this step in full), so the first derivative of the potential is
$G\matter M/r^2$ times $x/r$:

$$\partial_x\field\Phi = \frac{G\matter M\,x}{r^3}.$$

We differentiate this again with respect to $x$, using the product rule and $\partial_x r^{-3} = -3x/r^5$:

$$\partial_x\partial_x\field\Phi = G\matter M\Bigl(\frac{1}{r^3} - \frac{3x^2}{r^5}\Bigr).$$

We differentiate the same first derivative with respect to $y$ instead, using $\partial_y r^{-3} = -3y/r^5$:

$$\partial_y\partial_x\field\Phi = -\frac{3G\matter M\,xy}{r^5}.$$

At the ring, $x = r$ and $y = z = 0$. The first result becomes $G\matter M(1 - 3)/r^3$, and the second becomes zero:

$$\curv{\tE}_{xx} = -\frac{2G\matter M}{r^3}, \qquad \curv{\tE}_{xy} = 0 .$$

The same steps with $y$ in place of $x$ give $\partial_y\partial_y\field\Phi = G\matter M(1/r^3 - 3y^2/r^5)$, which is
$G\matter M/r^3$ at the ring, and $z$ behaves as $y$ does. Every entry off the diagonal contains $xy$, $xz$ or $yz$ and
vanishes at the ring. The whole table is

$$\curv{\tE} = \frac{G\matter M}{r^3}\begin{pmatrix} -2 & 0 & 0\\ 0 & 1 & 0\\ 0 & 0 & 1 \end{pmatrix}.$$

By the sign rule, the ring is stretched along the line to the mass at the rate $2G\matter M/r^3$ and squeezed across
it, in both other directions, at the rate $G\matter M/r^3$: the stretch is twice each squeeze.

The pulls themselves give the same table. Of two balls on the line to the mass, at $r$ and $r + \xi$, the near one is
pulled harder, by

$$\frac{G\matter M}{r^2} - \frac{G\matter M}{(r+\xi)^2} \approx \frac{2G\matter M}{r^3}\,\xi ,$$

and they move apart at this rate. Two balls a distance $\xi$ apart across the line are each pulled toward the centre
of the mass, so each pull leans toward the line by about $\xi/2r$ and has a sideways part
$(G\matter M/r^2)(\xi/2r)$ toward the other ball. They approach each other at twice this, $G\matter M\xi/r^3$, the
squeeze in the table.

For a ring in any direction from the mass, let $\hat n$ be the unit vector from the ring toward the mass and
$\delta_{ij}$ the Kronecker delta of section 1.1, which is 1 when $i = j$ and 0 otherwise. Then

$$\boxed{\;\curv{\tE}_{ij} = \frac{G\matter M}{r^3}\bigl(\delta_{ij} - 3\hat n_i\hat n_j\bigr).\;} \label{eq:point}$$

With $\hat n$ along $x$ this is the table above; the box below derives the general form. Applied to $\hat n$, the
table $\delta_{ij} - 3\hat n_i\hat n_j$ gives $-2\hat n$, because $\hat n_j\hat n_j = 1$, and applied to a vector
perpendicular to $\hat n$ it gives that vector back. So the stretch always lies along the line to the mass.

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
$\partial_x\partial_x(1/r) = -1/r^3 + 3x^2/r^5$, as in the main text. The potential is
$\field\Phi = -G\matter M\,(1/r)$, so

$$\curv{\tE}_{ij} = \partial_i\partial_j\field\Phi = \frac{G\matter M}{r^3}\bigl(\delta_{ij} - 3\hat x_i\hat x_j\bigr).$$

The unit vector from the ring toward the mass is $\hat n = -\hat x$. It appears twice in the product
$\hat n_i\hat n_j = \hat x_i\hat x_j$, so the sign drops out and this is equation [](#eq:point).
:::

Now the number. We treat the person as a point mass of 70 kg at 1 m.[^shape] The entry along the line to the person
is

$$\begin{aligned}
\curv{\tE}_{xx} = -\frac{2G\matter M}{r^3} &= -\frac{2 \times 6.674 \times 10^{-11} \times 70}{1^3}\unit{s^{-2}}\\
&= -9.3 \times 10^{-9}\unit{s^{-2}},
\end{aligned}$$

a stretch, with a squeeze of half its size across the line. Tides are often given in **eötvös**, with
$1\unit{E} = 10^{-9}\unit{s^{-2}}$, so the person's stretch has a size of 9.3 E.[^eotvos]

Two free balls on the line to the person move apart at $9.3 \times 10^{-9}\unit{m\,s^{-2}}$ for each metre between them,
about a billionth of the $9.8\unit{m\,s^{-2}}$ of a falling apple. Real balls must be much closer than a metre for the
Taylor expansion to hold.[^next] Two balls 1 cm apart, starting at rest, drift apart by
$\tfrac12 (2G\matter M/r^3)\,\xi t^2 = 4.7 \times 10^{-11}\unit{m}$ in the first second, a little less than the radius
of a hydrogen atom, $5.3 \times 10^{-11}\unit{m}$.

At large distance the tide falls faster than the pull. It is the change of the pull $G\matter M/r^2$ from one point to
the next, a derivative with respect to distance, so it falls as $r^{-3}$: at twice the distance the pull is four times
weaker and the tide eight times.

{{paper fig:tidal-field}}

Panel (a) of the figure above draws a small ring at many points around one mass, and every ring is stretched toward
the mass. Its $z$, up the page, is our $x$. The rings are drawn with their strength compressed so that weak regions
stay visible, so the true fall with distance is much steeper than it looks. In panel (b), midway between two masses, the pulls cancel
but the ring is still stretched along the line joining them. Panel (c) is a gravitational wave
([section 7.6](/tutorial/geometry/gravitational-waves/#the-tide-of-a-wave-is-minus-half-the-acceleration-of-its-strain)).

## Tidal brightness is density times the cube of angular size

The tide of a body can be written with two quantities that say how it looks from the ring: its **mean density**
$\sym{mean-density}{\matter{\bar\rho}}$, its mass divided by its volume, in kilograms per cubic metre, and its
**angular size** $\sym{angular-size}{\theta} = R/r$, its radius $R$ divided by its distance $r$. For a distant body
$\theta$ is the angle, in radians, between the lines to its centre and to its edge. A sphere of radius $R$ has the mass
$\matter M = \tfrac43\pi R^3\matter{\bar\rho}$. We put this into the stretch, $2G\matter M/r^3$, and collect
$R^3/r^3$ into $\theta^3$:

$$\boxed{\;\frac{2G\matter M}{r^3} = \frac{8\pi G}{3}\,\matter{\bar\rho}\,\theta^3, \qquad \theta = \frac{R}{r}.\;}$$

The units agree, because $G\matter{\bar\rho}$ is $\mathrm{m^3\,kg^{-1}\,s^{-2}}$ times $\mathrm{kg\,m^{-3}}$, which is
$\mathrm{s^{-2}}$. The larger the tide a body raises at the camera, the brighter it looks in the camera's picture, so
we call the size of the stretch that a body raises its **tidal brightness**.[^brightness] It depends only on what the
body is made of and how large it looks. Two bodies of the same density that look the same size are equally bright,
however far away they are, and a body that looks twice as wide is $2^3 = 8$ times as bright.

The Moon and the Sun test this.[^sources] The Moon has a mean density of $3344\unit{kg\,m^{-3}}$, a radius of
1737 km and a distance of 384,400 km, so $\theta = 4.52 \times 10^{-3}$ and the size of its stretch at the Earth is

$$\frac{8\pi G}{3} \times 3344 \times (4.52 \times 10^{-3})^3\unit{s^{-2}} = 1.7 \times 10^{-13}\unit{s^{-2}}.$$

The Sun, with $1408\unit{kg\,m^{-3}}$, a radius of 695,700 km and a distance of $1.496 \times 10^{11}\unit{m}$, has
$\theta = 4.65 \times 10^{-3}$ and a stretch of size $7.9 \times 10^{-14}\unit{s^{-2}}$. The two look almost the same
size in our sky, but the Moon is 2.4 times denser; the Sun's 3 per cent greater width raises its tide by 9 per cent,
so the Moon's tide is 2.2 times the Sun's, and the Moon raises the larger part of the ocean tides.

People nearly float in water, so we treat the person as a ball of water, $1000\unit{kg\,m^{-3}}$. A ball of water of
70 kg has a radius of 0.256 m, so at 1 m its angular size is 0.256, which is 56.6 times the Moon's; cubed, that is a
factor of 181,000. The person's density is 0.30 of the Moon's, so the person is about 54,000 times as bright as the
Moon. The formula gives the same $9.3 \times 10^{-9}\unit{s^{-2}}$ as before, as it must.

## In empty space the stretch and the squeezes balance

The **trace** of a table is the sum of its diagonal entries, here
$\curv{\tE}_{ii} = \curv{\tE}_{xx} + \curv{\tE}_{yy} + \curv{\tE}_{zz}$. By equation [](#eq:tide) it is

$$\curv{\tE}_{ii} = \partial_i\partial_i\field\Phi = \nabla^2\field\Phi ,$$

the Laplacian of the potential. Poisson's equation, $\nabla^2\field\Phi = 4\pi G\matter\rho$, which section 1.3 derives
from the inverse-square law, then gives the trace in terms of $\sym{density}{\matter{\rho}}$, the density of mass at
the point, in kilograms per cubic metre:

$$\boxed{\;\curv{\tE}_{ii} = 4\pi G\matter\rho .\;}$$

The unit is $\mathrm{s^{-2}}$ on both sides. In empty space the density is zero, so the trace is zero; a table whose
diagonal adds up to zero is called **trace-free**.[^five] The tide of one mass passes this check: $-2 + 1 + 1 = 0$, or,
in equation [](#eq:point), $\delta_{ii} - 3\hat n_i\hat n_i = 3 - 3 = 0$. So in empty space a tide cannot squeeze a
ring in every direction at once, and every squeeze is paid for by a stretch in another direction. The same holds
outside any number of masses, because each adds a trace-free table.

Inside water the trace is $4\pi G\matter\rho = 8.4 \times 10^{-7}\unit{s^{-2}}$, about ninety times the size of the
person's stretch. A positive trace is a squeeze on average over all directions, so free grains inside matter fall
toward one another, and a cloud of dust begins to collapse (the box below). The trace measures the density at the
pixel's own place and nothing else, so a pixel in empty space reads a trace of zero, however much matter lies nearby.

::: derivation
### The tide inside a ball of dust

Take a ball of freely falling dust of uniform density $\matter\rho$. By the shell theorem, the matter outside a radius
$r$ exerts no net pull there, and the matter inside pulls as a point mass $\tfrac43\pi r^3\matter\rho$ at the centre,
so the field at $\vect x$ is

$$g_i = -\frac{G}{r^2}\,\frac{4\pi r^3\matter\rho}{3}\,\frac{x_i}{r} = -\frac{4\pi}{3}G\matter\rho\,x_i ,$$

toward the centre. Its potential is

$$\field\Phi = \frac{2\pi}{3}G\matter\rho\,r^2 + \text{constant},$$

because $\partial_i r^2 = 2x_i$. Its Laplacian is $\tfrac{2\pi}{3}G\matter\rho \times 6 = 4\pi G\matter\rho$, as
Poisson's equation requires. Its Hessian is

$$\curv{\tE}_{ij} = \frac{4\pi}{3}G\matter\rho\,\delta_{ij},$$

an equal squeeze in every direction, with the trace $4\pi G\matter\rho$. By equation [](#eq:tide), every pair of grains
accelerates toward each other at $\tfrac{4\pi}{3}G\matter\rho$ per metre of separation, so the cloud begins to shrink
in the same way at every point. For the density of water this rate is $2.8 \times 10^{-7}\unit{s^{-2}}$.
:::

## On the ground the Earth's own tide is far larger, but steady

The camera works on the ground or in a room falling freely far from any planet. On the ground the largest tide is the
Earth's own. With $G\matter M = 3.986 \times 10^{14}\unit{m^3\,s^{-2}}$ and a radius of
$R = 6.371 \times 10^6\unit{m}$, the stretch along the vertical has the size

$$\frac{2G\matter M}{R^3} = 3.1 \times 10^{-6}\unit{s^{-2}},$$

with a squeeze of half this size in each horizontal direction: 330 times the person's tide. It is steady and well
known, so it can be subtracted, and the camera records what remains.

The pixel must also not rotate. A turning frame feels a centrifugal acceleration that grows with the distance from the
axis, so it differs between two nearby balls, and a turning pixel would read that difference as a **pseudo-tide**, an
apparent tide that comes from the motion of the frame and not from any mass. Turning with the Earth gives a stretch of
$5.3 \times 10^{-9}\unit{s^{-2}}$, more than half the person's tide, so the camera's pixels hold their axes still with
gyroscopes.[^rotation]

## A swaying person makes the signal that LIGO must keep out

Suppose now that the person sways toward the ring and away from it, by 5 cm, once a second. The tide then changes in
time, and an instrument that compares lengths can see the change. **LIGO**, the Laser Interferometer
Gravitational-Wave Observatory, has two arms at right angles, each 4 km long, with a hanging mirror at each end. A
**strain** is a change in length divided by the length, and LIGO reads the strain of one arm minus that of the
other. The gravitational waves it detects have strains near $10^{-21}$, a change of $4 \times 10^{-18}\unit{m}$ in a
4 km arm. Its reading is the difference of two entries of $\curv{\tE}$, integrated twice in time, so LIGO too measures
a tide.

Equation [](#eq:tide) applies only to arms much shorter than the metre to the person, so we take a detector built like
LIGO but with arms a few centimetres long, close to one pixel of the camera, with the person 1 m away along one arm.
We assume that **the mirrors move freely at the frequency of the sway**, while their suspension holds them against the
steady tide.[^free]

The entry along the arm that points at the person is $\curv{\tE}_{xx} = -2G\matter M/r^3$. Its derivative with respect
to the distance is $6G\matter M/r^4 = -3\curv{\tE}_{xx}/r$, so a small change $\delta r$ in the distance changes it by

$$\delta\curv{\tE}_{xx} = -3\,\curv{\tE}_{xx}\,\frac{\delta r}{r}.$$

When the person steps back by $\delta r = 5\unit{cm}$, the entry rises toward zero by 15 per cent of itself:
$\delta\curv{\tE}_{xx} = -3 \times (-9.34 \times 10^{-9}\unit{s^{-2}}) \times 0.05 = +1.40 \times 10^{-9}\unit{s^{-2}}$.[^exact]
The squeeze across the line, $\curv{\tE}_{yy} = G\matter M/r^3$, changes by half as much and in the opposite sense,
$\delta\curv{\tE}_{yy} = -\tfrac12\,\delta\curv{\tE}_{xx}$.

The entry along the arm is its steady value, which the suspension holds, plus a part that oscillates with the sway,
$\delta\curv{\tE}_{xx}\cos\omega t$. Here $\omega = 2\pi f$ is the angular frequency in radians per second, $f$ is the
frequency of the sway, and the clock starts when the person is farthest away. For two mirrors a length $L$ apart along
$x$, equation [](#eq:tide) gives the change $\delta L$ in their distance:

$$\frac{\dd^2\,\delta L}{\dd t^2} = -\delta\curv{\tE}_{xx}\,L\cos\omega t .$$

The tide also acts on $\delta L$ itself, but that adds terms smaller by about $10^{-10}$, which we drop. A length that
oscillates with the sway, $\delta L = A\cos\omega t$, has the second derivative $-\omega^2 A\cos\omega t$, so
$\omega^2 A = \delta\curv{\tE}_{xx}\,L$, and the strain of the arm has the amplitude

$$\boxed{\;\frac{\delta L}{L} = \frac{\delta\curv{\tE}_{xx}}{\omega^2}.\;} \label{eq:arm}$$

Both sides have no unit. The arm is longest when the stretch is weakest, because a free mass shaken back and forth
moves opposite to the force on it. A faster sway gives a smaller strain, by the square of the frequency, because a
free mirror has less time to move before the force reverses; a very slow sway would give a very large strain, but
there the suspension holds the mirrors and the assumption fails.

The arm across the line obeys the same equation with $\delta\curv{\tE}_{yy}$ in place of $\delta\curv{\tE}_{xx}$. For
a sway once a second, $\omega = 2\pi\unit{s^{-1}}$ and $\omega^2 = 39.5\unit{s^{-2}}$, so the reading, the difference
of the two strains, is

$$\frac{\delta\curv{\tE}_{xx} - \delta\curv{\tE}_{yy}}{\omega^2} = \frac{1.5 \times 1.40 \times 10^{-9}}{39.5} = 5.3 \times 10^{-11}.$$

This is about fifty billion times the $10^{-21}$ of the waves that LIGO detects.[^conventions] The real LIGO, whose
long arms let the person pull on only the nearest mirror, would read less, but still millions of times the strain of
its waves.[^long-arms] Both signals are changes of the tidal tensor read as changes in the lengths of the arms, and
LIGO's one number cannot tell a lorry driving past from a distant collision of black holes, so
people and vehicles are kept away from its mirrors [@ThorneWinstein1999]. The disturbance that LIGO must keep out is
the signal that the camera records.

::: try {#tidal-ring}
The figure opens with a mass of 70 kg one metre from a ring of twelve free balls, and above the ring it asks you for
two predictions. Make each guess before you touch anything, then drag the mass, or switch on the second mass,
until the answer appears. The readout keeps the sign of the boxed rule, so a stretch shows as a negative number, and
for a single mass the ratio of stretch to squeeze stays at $-2 : 1$ wherever you put it.
:::

**The idea to keep: gravity at one point can be cancelled by falling, but its difference between nearby points cannot.
That difference, $\curv{\tE}_{ij} = \partial_i\partial_j\field\Phi$, is what every detector of gravity measures.**

::: problems
### Practice

**[1.4]** What is the trace of the tide inside a block of granite, of density $2700\unit{kg\,m^{-3}}$, and what is it
one metre outside the block?

::: solution
Inside, $\curv{\tE}_{ii} = 4\pi G\matter\rho = 4\pi \times 6.674 \times 10^{-11} \times 2700\unit{s^{-2}} =
2.3 \times 10^{-6}\unit{s^{-2}}$, about three quarters of the Earth's stretch on the ground. Outside, the density is
zero, so the trace is zero, however close the point is: the block's tide there is real, but its stretch and squeezes
balance.
:::

**[1.4]** A ring floats midway between two people of 70 kg, each a metre away on opposite sides. What pull does it
feel, and what tide?

::: solution
The pulls are equal and opposite, so there is no pull. The stretches add, because $\hat n_i\hat n_j$ in equation
[](#eq:point) does not change when $\hat n$ turns round: the tide is a stretch of $1.9 \times 10^{-8}\unit{s^{-2}}$
along the line and a squeeze of $9.3 \times 10^{-9}\unit{s^{-2}}$ in each direction across it.
:::

**[1.4]** Two free balls float one above the other, and the vertical entry of the tide is $\curv{\tE}_{zz} < 0$. Do
the balls move apart or together?

::: solution
Apart: with $\xi_z > 0$, $\ddot\xi_z = -\curv{\tE}_{zz}\,\xi_z$ is positive, so a negative entry is a stretch.
:::

**[1.4]** The person sways by the same 5 cm, but ten times a second. What does the small detector read?

::: solution
By equation [](#eq:arm) the strain falls as $1/\omega^2$, so it is a hundred times less, $5.3 \times 10^{-13}$: still
about five hundred million times the strain of LIGO's waves.
:::

**[1.4]** A car of 1000 kg is parked 5 m from a ring of free balls. Find the stretch along the line to the car, and
compare it with the tide of the 70 kg person.

::: solution
As a point mass, the car gives $2G\matter M/r^3 = 2 \times 6.674 \times 10^{-11} \times 1000/5^3\unit{s^{-2}} =
1.1 \times 10^{-9}\unit{s^{-2}}$ along the line, about the person's tide at 2 m ($1.2 \times 10^{-9}\unit{s^{-2}}$)
and a ninth of it at 1 m. A car is a poor point mass at 5 m, so this is an estimate.
:::

### Stretch

**[1.4]** Two equal masses $\matter M$ sit at $x = \pm a$ on the $x$ axis. Find the tidal tensor at the point
$(0, y, 0)$ on the perpendicular bisector, and the distance $y$ at which $\curv{\tE}_{xx}$ changes sign. Use equation
[](#eq:point) for each mass and add the two tables.

::: solution
Both masses are at the distance $d = \sqrt{a^2 + y^2}$, in the directions $\hat n = (\pm a, -y, 0)/d$. In the sum of
the two tables the products $\hat n_x\hat n_y = \mp ay/d^2$ cancel, and the others are the same for both masses, so

$$\begin{aligned}
\curv{\tE}_{xx} &= \frac{2G\matter M}{d^3}\Bigl(1 - \frac{3a^2}{d^2}\Bigr),\\
\curv{\tE}_{yy} &= \frac{2G\matter M}{d^3}\Bigl(1 - \frac{3y^2}{d^2}\Bigr),\\
\curv{\tE}_{zz} &= \frac{2G\matter M}{d^3},
\end{aligned}$$

with every entry off the diagonal zero. The trace is $(2G\matter M/d^3)(3 - 3) = 0$, as in empty space it must be. At
$y = 0$ the first entry is $-4G\matter M/a^3$, the doubled stretch between two people; for $y \gg a$ the table becomes
that of one mass $2\matter M$ along $y$.

The entry $\curv{\tE}_{xx}$ vanishes when $d^2 = 3a^2$, at $y = \sqrt2\,a$. There the line to each mass makes with the
$x$ axis an angle $\vartheta$ with $\cos^2\vartheta = a^2/d^2 = 1/3$, which is 54.7°. Matter within 54.7° of an axis
stretches a ring along that axis, and matter farther from it squeezes; the same angle divides the camera's sky
([section 1.5](/tutorial/newton/five-numbers/#averaged-over-the-sky-the-tidal-weight-vanishes)).
:::

### The camera

**[1.4]** The tide of a gravitational wave of strain $h$ is $\curv{\tE} = -\tfrac12\,\partial_t^2 h$, so a wave lined up
with two arms changes one by $h/2$ of its length and the other by $-h/2$
([section 7.6](/tutorial/geometry/gravitational-waves/#a-wave-of-strain-h-moves-each-ball-by-half-the-strain)).
Express the swaying person's signal as such a strain $h$, and compare it with the one-arm strain and with the
difference of the two arms. Then explain why a body twice as wide raises a tide eight times as strong.

::: solution
The stretch is $2G\matter M/r^3 = 9.3 \times 10^{-9}\unit{s^{-2}}$, and since the tide goes as $r^{-3}$ its relative
change is $3\,\delta r/r = 0.15$, so $\delta\curv{\tE}_{xx} = 1.40 \times 10^{-9}\unit{s^{-2}}$. For a strain that
oscillates as $\cos\omega t$, two time derivatives give a factor $-\omega^2$, so $\curv{\tE} = \tfrac12\omega^2 h$ and
$h = 2\,\delta\curv{\tE}_{xx}/\omega^2 = 2 \times 1.40 \times 10^{-9}/39.5 = 7.1 \times 10^{-11}$. Such a wave changes one
arm by $h/2 = 3.55 \times 10^{-11}$, which is equation [](#eq:arm); the difference of the two arms is three quarters of
$h$, the $5.3 \times 10^{-11}$ found above.

By the tidal brightness, at a fixed density the tide is proportional to $\theta^3$, so a body twice as wide raises
$2^3 = 8$ times the tide.
:::
:::

::: paper
- [Section II](/paper/#sec:pixel) begins with this falling observer, defines the tidal field, computes the person and
  the strains that a small detector and LIGO would read, names the lorry, and gives the Earth's tide, the turning
  frame and the eötvös.
- The paper's equation [](/paper/#eq:tidal) defines the tide in general relativity as $c^2R_{0i0j}$. Chapter
  [7.2](/tutorial/geometry/curvature-and-tides/#for-an-observer-at-rest-the-drift-is-the-papers-tide) derives it, and
  this section uses only its Newtonian limit.
- The paper's equations [](/paper/#eq:newton) and [](/paper/#eq:deviation) are this section's equation [](#eq:tide): the
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
- The [GR course, section 5.9](https://neovand.github.io/general-relativity/chapter-5.html#5-9-tides-the-gravity-a-falling-laboratory-cannot-remove):
  tides as the gravity that a falling laboratory cannot remove.
- The [GR course, section 10.5](https://neovand.github.io/general-relativity/chapter-10.html#10-5-the-newtonian-limit-checks-both-the-meaning-and-the-sign)
  and its [lesson on tidal instruments](https://neovand.github.io/general-relativity/chapter-10.html#what-a-tidal-instrument-measures):
  the Newtonian tide recovered from curvature, its sign, and what a tidal matrix measures.
- The [GR course, section 10.9](https://neovand.github.io/general-relativity/chapter-10.html#10-9-how-much-curvature-is-outside-your-window):
  the Earth's tide, $3.08 \times 10^{-6}\unit{s^{-2}}$, against other sources.
- The [GR course, section 10.3](https://neovand.github.io/general-relativity/chapter-10.html#10-3-deriving-geodesic-deviation-with-every-cancellation-visible):
  geodesic deviation, the relativistic form of equation [](#eq:tide), with every step shown.
- Kip Thorne and Roger Blandford, *Modern Classical Physics* (Princeton, 2017): the Newtonian tidal tensor as the
  bridge to the curvature of spacetime.
:::

::: history
### Newton, Eötvös and the tides

Newton explained the tides of the sea in the *Principia* (1687) as the difference between the Moon's pulls on the near
side of the Earth, its centre and its far side. In the 1890s the Hungarian physicist Loránd Eötvös built a torsion
balance that measured how gravity changes over a few tens of centimetres, and mapped with it the changes of gravity
across the ground. With such balances, in 1889 and in 1906–09, he also found that bodies of different materials fall
alike to a few parts in a billion.
:::

[^iss]: At a height of about 420 km, the pull is $(6371/6791)^2 = 0.88$ of its value on the ground.

[^scene]: The falling box and the person a metre away are the opening scene of *The gravitational camera*
    (Mohsenvand 2026), [Sec. II](/paper/#sec:pixel).

[^falling]: Eötvös, Pekár and Fekete (1922, *Annalen der Physik* 68, 11) compared the pulls on pairs of materials with
    a torsion balance and found them equal to a few parts in a billion. A torsion balance in Seattle reached two parts
    in $10^{13}$ for beryllium and titanium (Schlamminger and colleagues 2008, *Physical Review Letters* 100, 041101),
    and the satellite MICROSCOPE, which let titanium and platinum fall together round the Earth, a few parts in
    $10^{15}$ (Touboul and colleagues 2022, *Physical Review Letters* 129, 121102). The book uses the principle as
    exact.

[^field]: The field is an acceleration at one point; the tide is its change from one point to the next.

[^general]: In relativity the tide is a piece of the curvature of spacetime, $\curv{\tE}_{ij} = c^2R_{0i0j}$, which
    becomes [](#eq:tide) near slowly moving matter ([section 7.2](/tutorial/geometry/curvature-and-tides/)). *The
    gravitational camera* (Mohsenvand 2026), Sec. II, writes the three as its equations [](/paper/#eq:tidal),
    [](/paper/#eq:deviation) and [](/paper/#eq:newton).

[^next]: The small parameter is $\xi/r$. The exact difference of the pulls along the line,
    $G\matter M\,[1/r^2 - 1/(r+\xi)^2] = (G\matter M/r^3)(2\xi - 3\xi^2/r + \dots)$, shows that the first neglected
    term is $3\xi/2r$ of the one kept: 1.5 per cent for balls 1 cm apart at 1 m. For balls a metre apart the expansion
    fails, and equation [](#eq:difference) must be used directly.

[^five]: The table is symmetric, so six of its entries are independent, and in empty space the vanishing trace fixes
    one of them: the tide there is five numbers ([section 1.5](/tutorial/newton/five-numbers/)).

[^shape]: A real person is tall and thin, so the number is an estimate; section 2.3 computes the tide of any shape.

[^eotvos]: The roman E of the unit, named after Loránd Eötvös (see the history box), is not the tensor $\curv{\tE}$.

[^brightness]: First shown in *The gravitational camera* (Mohsenvand 2026), Sec. IV, as its equation
    [](/paper/#eq:tidal-brightness).

[^sources]: Mean densities, radii and distances from NASA's planetary fact sheets. The Sun's distance is the
    astronomical unit.

[^rotation]: The Earth turns once relative to the stars in 23 h 56 min, at $\Omega = 7.29 \times 10^{-5}\unit{s^{-1}}$.
    The centrifugal acceleration $\Omega^2 s$ at a distance $s$ from the axis differs by $\Omega^2\xi$ between two
    points $\xi$ apart across the axis, so the pseudo-tide, $\Omega^2 = 5.3 \times 10^{-9}\unit{s^{-2}}$, is a stretch in
    every direction across the axis and nothing along it: 31,000 times the Moon's tide
    ([section 1.6](/tutorial/newton/motion/#a-turning-pixel-feels-a-pseudo-tide)).

[^free]: LIGO's mirrors hang from pendulums that swing near 1 Hz, and a hanging mirror is nearly free only under forces
    that change much faster, so at a sway once a second the free mirror is an idealization.

[^exact]: The exact change is 13.6 per cent for a step back and 16.6 per cent for a step forward.

[^conventions]: One arm alone changes by $3.55 \times 10^{-11}$. Counted as the strain $h$ of a gravitational wave,
    which changes each arm by $h/2$, the sway gives $h = 7.1 \times 10^{-11}$ (the last problem). First shown in *The
    gravitational camera* (Mohsenvand 2026), Sec. II.

[^long-arms]: A person 1 m beyond an end mirror pulls on that mirror alone, with
    $G\matter M/r^2 = 4.7 \times 10^{-9}\unit{m\,s^{-2}}$ (equation [](#eq:difference) used directly, since the
    other mirrors are 4 km away). The sway changes the pull by $2\,\delta r/r = 10$ per cent, so the free mirror
    swings by $4.7 \times 10^{-10}/39.5 = 1.2 \times 10^{-11}\unit{m}$, a strain of $3 \times 10^{-15}$ over 4 km:
    three million times the strain of LIGO's waves.
